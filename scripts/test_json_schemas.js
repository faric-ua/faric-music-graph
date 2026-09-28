"use strict";

const fs=require("node:fs");
const path=require("node:path");
const assert=require("node:assert/strict");

const ROOT=path.resolve(__dirname,"..");

function clone(value){
  return JSON.parse(JSON.stringify(value));
}

function sameJson(a,b){
  return JSON.stringify(a)===JSON.stringify(b);
}

function valueType(value){
  if(value===null)return "null";
  if(Array.isArray(value))return "array";
  return typeof value;
}

function matchesType(value,expected){
  if(expected==="object")return value!==null&&typeof value==="object"&&!Array.isArray(value);
  if(expected==="array")return Array.isArray(value);
  if(expected==="integer")return Number.isInteger(value);
  if(expected==="number")return typeof value==="number"&&Number.isFinite(value);
  if(expected==="null")return value===null;
  return typeof value===expected;
}

function validate(value,schema,at){
  const location=at||"$";
  const errors=[];
  const allowedTypes=Array.isArray(schema.type)
    ?schema.type
    :schema.type
      ?[schema.type]
      :[];

  if(allowedTypes.length&&!allowedTypes.some(type=>matchesType(value,type))){
    errors.push(
      location+": expected type "+allowedTypes.join("|")+
      ", got "+valueType(value)
    );
    return errors;
  }

  if(Object.prototype.hasOwnProperty.call(schema,"const")&&!sameJson(value,schema.const)){
    errors.push(
      location+": expected const "+JSON.stringify(schema.const)+
      ", got "+JSON.stringify(value)
    );
  }

  if(typeof value==="string"&&Number.isInteger(schema.minLength)&&value.length<schema.minLength){
    errors.push(location+": string shorter than minLength "+schema.minLength);
  }

  if(Array.isArray(value)){
    if(Number.isInteger(schema.minItems)&&value.length<schema.minItems){
      errors.push(location+": array shorter than minItems "+schema.minItems);
    }
    if(schema.items){
      value.forEach((item,index)=>{
        errors.push(...validate(item,schema.items,location+"["+index+"]"));
      });
    }
  }

  if(value!==null&&typeof value==="object"&&!Array.isArray(value)){
    const properties=schema.properties||{};
    for(const key of schema.required||[]){
      if(!Object.prototype.hasOwnProperty.call(value,key)){
        errors.push(location+": missing required property "+key);
      }
    }

    for(const [key,item] of Object.entries(value)){
      if(Object.prototype.hasOwnProperty.call(properties,key)){
        errors.push(...validate(item,properties[key],location+"."+key));
      }else if(schema.additionalProperties===false){
        errors.push(location+": additional property not allowed: "+key);
      }
    }
  }

  return errors;
}

const schema=JSON.parse(
  fs.readFileSync(path.join(ROOT,"data/schemas/account.schema.json"),"utf8")
);
const fixture=JSON.parse(
  fs.readFileSync(path.join(ROOT,"data/accounts.fixture.json"),"utf8")
);

assert.equal(schema.$schema,"https://json-schema.org/draft/2020-12/schema");
assert.deepEqual(
  validate(fixture,schema),
  [],
  "canonical Account fixture must conform to account.schema.json"
);

const missingRequired=clone(fixture);
delete missingRequired.accounts[0].displayName;
assert(
  validate(missingRequired,schema).some(error=>error.includes("missing required property displayName")),
  "schema validator must reject missing required fields"
);

const badConst=clone(fixture);
badConst.authDataIncluded=true;
assert(
  validate(badConst,schema).some(error=>error.includes("expected const false")),
  "schema validator must enforce authDataIncluded=false"
);

const badType=clone(fixture);
badType.accounts[0].externalAccountId=123;
assert(
  validate(badType,schema).some(error=>error.includes("expected type string|null")),
  "schema validator must enforce declared union types"
);

const extraProperty=clone(fixture);
extraProperty.accounts[0].unexpectedField="must fail";
assert(
  validate(extraProperty,schema).some(error=>error.includes("additional property not allowed: unexpectedField")),
  "schema validator must enforce additionalProperties=false"
);

console.log("PASS: JSON Schema conformance for canonical Account fixture");
