# srcr

Primarily, the **srcr** ("**sourcerer**") is a **recursive dependency inliner for TypeScript/JavaScript**: It looks up all the resources a script requires, and creates a single JavaScript output file that directly contains those resources. This inlining process is recursively repeated until all references are resolved. The sourcerer warns you about circular dependencies or unresolveable sources. Scripts can be loaded from the local file system or remotely via HTTP(S). Similar to Java's class paths, additional directories for searching for resources can be defined via a configuration file. If your operating system provides a TypeScript compiler (tsc), you can reference TypeScript resources within your scripts. They will automatically be transpiled before they are written to the output file. This allows you to maintain your coding projects purely in TypeScript without having to transpile all your scripts separately.  

Secondly, the srcr is a **Java application creator**: it creates a **standalone fatjar** that contains your fully resolved script as well as all Java dependencies referenced within. Running the fatjar with "**java -jar ...**" will run your script in a **Nashorn+Vert.x** JavaScript engine.


## Example  

As a simple example/showcase, we provide a short **TypeScript** application named **example_app.ts**:

```javascript
require("https://cdn.jsdelivr.net/npm/es6-promise/dist/es6-promise.auto.min.js");
var createHash=require("example_module");
console.log(createHash("this is the data i want to hash"));
```

This app will first run a **JavaScript** library from an HTTP source, and afterwards require to run a function provided by a local module **example_module.js**:

```javascript
require("org.mindrot/jbcrypt/0.4");
var BCrypt=org.mindrot.jbcrypt.BCrypt;
module.exports=function(s){
    return BCrypt.hashpw(s,BCrypt.gensalt());
}
```

In this example, the module provides a hash function based on the functionality of a referenced **Java** library (all references following a "$GROUP_ID/$ARTIFACT_ID/$VERSION" pattern will automatically be recognized as Java dependencies).

To start, open a terminal and run the srcr:

```bash
./srcr example_app.ts
```

He will produce the following output files:  

**example_app_srcr.js** ...  the fully resolved and transpiled JavaScript source

**example_app_srcr.jar** ...  the standalone runnable fatjar including the full script as well as all required Java dependecies. If your script does not reference any Java libraries, it will assume that the script is meant to be run in JavaScript clients like browsers. In that case, this jar file will not be created.

To start your application, run

```bash
java -jar example_app_srcr.jar
```

## Commandline usage  

By default, you run the srcr just with a single file:
```bash
./srcr script.js
```

If you want to use a custom, non-default configuration file, use the "**-cfg**" parameter:
```bash
./srcr -cfg=cfg.js script.js
```
The file "**cfg.js**" contains a short documentation to all available parameters.  

If you want to directly run the resulting JavaScript within the srcr's environment (Nashorn+Vert.x), then add the parameter "**-run**":
```bash
./srcr -cfg=cfg.js script.js -run
```

If you want to print the resulting JavaScript to the console, add the parameter "**-print**":
```bash
./srcr -cfg=cfg.js script.js -print
```

If you want to process multiple files serially, add multiple paths as arguments:
```bash
./srcr -cfg=cfg.js script1.js script2.js script3.js
```