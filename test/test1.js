console.log("STARTING test1.js");
//var ABC=xrequire("http://oleg.fi/relaxed-json/relaxed-json.js");
//console.log(ABC.stringify({foo:"bar"}));
require("test2.js");
source("test3x.js");
console.log("ENDING test1.js");
return "test1 ready "+Math.random();