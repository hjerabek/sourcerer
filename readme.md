# sourcerer

The **sourcerer** is a recursive dependency inliner for TypeScript/JavaScript, i.e. ...

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
```
./run -cfg=cfg.js test.js -run
```

If you want to print the resulting JavaScript to the console, add the parameter "-print":
```
./run -cfg=cfg.js test.js -print
```

If you want to process multiple files serially, add multiple paths as arguments:
```
./run -cfg=cfg.js test1.js test2.js test3.js
```