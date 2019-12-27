console.log("STARTING test.js");
console.log(typeof(Promise));
require("https://cdn.jsdelivr.net/npm/es6-promise/dist/es6-promise.auto.min.js");
console.log(typeof(Promise));
Promise.resolve("PROMISE").then(console.log);
require("https://www.foo.bar/abc/def.js");
var x=source("test1");
console.log("value of test1 = "+JSON.stringify(x || null));
console.log("value of test2 = "+JSON.stringify(require("test2.ts")));
console.log("value of test1 (again) = "+JSON.stringify(source("test1.js")));
console.log("value of test3 = "+JSON.stringify(source("file:test3.js")));
console.log("value of test4 (which equals test3) = "+JSON.stringify(source("test4.js")));
console.log("ENDING test.js ... with a BANG");
return "test ready";