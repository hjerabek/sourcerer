# sourcerer

The **sourcerer** is a recursive dependency inliner for TypeScript/JavaScript: It looks up all the resources a script requires, and creates a single JavaScript output file that directly contains those resources. This inlining process is recursively repeated until all references are resolved. The sourcerer warns you about circular dependencies or unresolveable sources. Scripts can be loaded from the local file system or remotely via HTTP(S). Similar to Java's class paths, additional directories for searching for resources can be defined via a configuration file. If your operating system provides a TypeScript compiler (tsc), you can reference TypeScript resources within your scripts. They will automatically be transpiled before they are written to the output file. This allows you to maintain your coding projects purely in TypeScript without having to transpile all your scripts separately.


## Usage  

By default, you can run the sourcer just with the file:
```
./run test.js
```

If you want to use a custom, non-default configuration file, use the "-cfg" parameter:
```
./run -cfg=cfg.js test.js
```
The file "cfg.js" contains a short documentation to all available parameters.  

If you want to run the resulting JavaScript within the sourcerer's environment (Nashorn+Vert.x), then add the parameter "-run":
```bash
./run -cfg=cfg.js test.js -run
```

If you want to print the resulting JavaScript to the console, add the parameter "-print":
```bash
./run -cfg=cfg.js test.js -print
```

If you want to process multiple files serially, add multiple paths as arguments:
```bash
./run -cfg=cfg.js test1.js test2.js test3.js
```

## Code samples  
```javascript
// load remote resouce
console.log(typeof(Promise));
require("https://cdn.jsdelivr.net/npm/es6-promise/dist/es6-promise.auto.min.js");
console.log(typeof(Promise));

// load local TypeScript resource
var ABC=require("modules/ABC.ts")
console.log(ABC.doSomething());

// load local resource with a custom loader "init"
// (configure "names" to allow non-standard loading functions)
init("mylib")
console.log(MYLIB.get("xyz"));
```
  
To get a better idea of the inlining process, you can take a look at "test_src.js", which is a processed version of "test.js".