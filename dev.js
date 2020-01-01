// this is used to simplify development by not having to re-build the jar every time
/*try {
    var js=vertx.fileSystem().readFileBlocking("dev.js").toString("UTF-8");
    var SRCR=(new Function(js))();
    if (typeof(module)!=="undefined") module.exports=SRCR;
    return SRCR;
} catch(err) {
    if (js) {
        console.log(err.toString());
        return;
    }
}*/

// VERSION 0.7.2

var SRCR={};

var System=java.lang.System;
var sysprop=System.getProperty;
var hndlrs0,lgr0=java.util.logging.Logger.getLogger("");
if (lgr0 && (hndlrs0=lgr0.getHandlers()).length) lgr0.removeHandler(hndlrs0[0]);
var clog=function(x){console.log(x);return x;};
var clogO=function(x){console.log(toJson(x,null,4));return x;};
var now=Date.now;
var nanonow=System.nanoTime;

var fromJson=JSON.parse;
var toJson=JSON.stringify;
var fromFjson=function(s){
    try {
        var a,n;
        while ((a=s.match(/^\s*(\/\/[\s\S]*?\n|\/\*[\s\S]*?\*\/)/)) && (n=a[0].length)) s=s.substring(n);
        if (a=s.match(/^(\s*|\s*return\s*)[{["]/)) s="return "+s.substring(a[1].length) // }]"
        else throw "errInvalidFjson";
        return (new Function(s))();
    } catch(err1) {
        return;
    }
}

var ByteArrayOutputStream=java.io.ByteArrayOutputStream;
var CommandLine=org.apache.commons.exec.CommandLine;
var DefaultExecutor=org.apache.commons.exec.DefaultExecutor;
var PumpStreamHandler=org.apache.commons.exec.PumpStreamHandler;
var ExecuteWatchdog=org.apache.commons.exec.ExecuteWatchdog;
var osexec=function(cmd,opts) {
    var x;
    if (typeof(cmd)==="object") {
        opts=cmd;
        cmd=opts.command;
    } else if (!opts) {
        opts={};
    }
    var exec=new DefaultExecutor();
    var osOut=new ByteArrayOutputStream();
    var osErr=new ByteArrayOutputStream();
    exec.setStreamHandler(new PumpStreamHandler(osOut,osErr));
    exec.setWatchdog(new ExecuteWatchdog(opts.timeout || 8000));
    if (x=opts.exitvalue) exec.setExitValue(x);
    var exitvalue=exec.execute(CommandLine.parse(cmd));
    var sOut=osOut.toString(opts.charset || "UTF-8");
    var sErr=osErr.toString(opts.charset || "UTF-8");
    osOut.close();
    osErr.close();
    if (sOut) return sOut;
    if (sErr) throw sErr;
    return "";
}

var File=java.io.File;
var FileInputStream=java.io.FileInputStream;
var FileOutputStream=java.io.FileOutputStream;
var Scanner=java.util.Scanner;
var SEP_DIR=(System.getProperty("file.separator") || "/")
var hasFile=function(path){
    return new File(path).isFile();
};
var getFile=function(path){
    try {
        var file=new File(path);
        if (!file.isFile()) return "";
        var is=new FileInputStream(file);
        var s=new Scanner(is,"UTF-8").useDelimiter("\\A").next();
        is.close();
        return s;
        //return FS.readFileBlocking(path).toString("UTF-8");
    } catch(err1) {
        try { if (is) is.close(); } catch(err2) {}
    }
};
var setFile=function(path,text){
    var bytes=(text || "").getBytes("UTF-8");
    var os=new FileOutputStream(path);
    os.write(bytes,0,bytes.length);
    os.close();
    return path;
};
var removeFile=function(path){
    try {
        if ((new File(path))["delete"]()) return path;
    } catch(err) {}
    return "";
};

/*
" = 34
' = 39
` = 96
* = 42
/ = 47
\ = 92
( = 40
) = 41
[ = 91
] = 93
{ = 123
} = 125
*/
// TODO: test thoroughly
var bracket2opening={")":"(","}":"{","]":"[",">":"<"};
var getIndexOfJavascriptClosingBracket=function(s,s2,i0){
    var i=(typeof(i0)==="number" ? i0 : s.indexOf(bracket2opening[s2]))+1;
    var n=s.length;
    var cc,cc0=bracket2opening[s2].charCodeAt(0),cc1,cc2=s2.charCodeAt(0),ccX=0;
    var c=1;
    while (i<n) {
        cc1=s.charCodeAt(i);
        if (ccX) {
            if (cc1==ccX) {
                ccX=0;
            } else if (cc1==92) {
                i++;
            }
        } else {
            if (cc1==cc2) {
                c--;
                if (c<1) return i;
            } else if (cc1==cc0) {
                c++;
            } else if (cc1==47) {
                cc=s.charCodeAt(i+1);
                if (cc==47) {
                    i=s.indexOf("\n",i+2)+1;
                    if (i<1) return -1;
                } else if (cc==42) {
                    i=s.indexOf("*"+"/",i+2)+2;
                    if (i<2) return -1;
                } else {
                    ccX=cc1;    
                }
            //} else if (cc1==92) {
            //    i++;
            } else if (cc1==34 || cc1==39 || cc1==96) {
                ccX=cc1;
            }
        }
        i++;
    }
    return -1;
}
// TODO: test thoroughly
var getCommentlessJavascript=function(s){
    if (s.indexOf("//")<0 && s.indexOf("/*")<0) return s;
    var i=0,i1,n=s.length,cc,cc1,ccX=0;
    while (i<n) {
        cc=s.charCodeAt(i);
        if (ccX) {
            if (cc==ccX) ccX=0;
            else if (cc==92) i++;
        } else if (cc==47) {
            cc1=s.charCodeAt(i+1);
            if (cc1==47) {
                i1=s.indexOf("\n",i+2);
                if (i1<0) return s.substring(0,i);
                s=s.substring(0,i)+s.substring(i1);
                n=s.length;
            } else if (cc1==42) {
                i1=s.indexOf("*"+"/",i+2);
                if (i1<0) return s.substring(0,i);
                s=s.substring(0,i)+s.substring(i1+2);
                n=s.length;
            } else {
                ccX=cc;    
            }
        } else if (cc==34 || cc==39 || cc==96) {
            ccX=cc;
        }
        i++;
    }
    return s;
}

var SystemClassLoader=java.lang.ClassLoader.getSystemClassLoader();
var hasResource=function(path){
    return (SystemClassLoader.getResource(path)!=null)
}
var getResource=function(path){
    try {
        var is=SystemClassLoader.getResourceAsStream(path);
        if (!is) return "";
        var s=new Scanner(is,"UTF-8").useDelimiter("\\A").next();
        is.close();
        return s;
    } catch(err1) {
        try { if (is) is.close(); } catch(err2) {}
    }
}

var URL=java.net.URL;
var getHttp=function(s){
    try {
        var url=new URL(s);
        con=url.openConnection();
        con.setRequestMethod("GET");
        con.setConnectTimeout(4000);
        con.setReadTimeout(16000);
        //con.setFollowRedirects(true);
        var is=con.getInputStream();
        var s=new Scanner(is,"UTF-8").useDelimiter("\\A").next();
        var status=con.getResponseCode();
        is.close();
        con.disconnect();
        if (status>=400) return "";
        return s;
    } catch(err1) {
        try { if (is) is.close(); } catch(err2) {}
        try { if (con) con.disconnect(); } catch(err2) {}
    }
}

var x=new File(".srcr/cache");
if (!x.isDirectory()) x.mkdirs();
var getCache=function(k){
    return getFile(".srcr/cache/"+k);
}
var setCache=function(k,s){
    return setFile(".srcr/cache/"+k,s);
}
var removeCache=function(k){
    return removeFile(".srcr/cache/"+k);
}

var tsc=function(ts,target){
    var s,k;
    k=".srcr/cache/tsc_"+toMd5(ts);
    if (s=getFile(k+".js")) return s;
    setFile(k+".ts",ts);
    try {
        osexec("tsc -t "+(target || "ES5")+" "+k+".ts");
    } catch(err) {}
    s=getFile(k+".js");
    removeFile(k+".ts");
    return s;
}

var rxTestVarname=/^[a-zA-Z$_][a-zA-Z0-9$_]*$/;
var isVarname=function(s){ return rxTestVarname.test(s); }
var rxTestUri=/^[a-zA-Z$_][a-zA-Z0-9$_]*:/;
var isUri=function(s){ return rxTestUri.test(s); }
var rxTestFileUri=/^file:/i;
var isFileUri=function(s){ return rxTestFileUri.test(s); }
var rxTestHttpUri=/^https?:/i;
var isHttpUri=function(s){ return rxTestHttpUri.test(s); }
var rxTestScriptPath=/\.(js|ts)$/i;
var rxTestDirPath=/[\/\\]$/i;
var rxTestJavaReference=/^(((java|javax|com|net|org|io)\.|(commons)-)[^\/]+)\/([^\/]+)\/(\d+\.\d+[\s\S]*)$/i;

var DigestUtils=org.apache.commons.codec.digest.DigestUtils;
var toMd5=DigestUtils.md5Hex
var toSha256=DigestUtils.sha256Hex;
var toSha512=DigestUtils.sha512Hex;

// TODO: support all potential define/require syntaxes:
/*
    + module / module.exports / exports
    define(...)
    define([...],function...)
    define("...",[...],function...)
    define("...",...)
    + require_("...")
    require("...",function...)
    require([...],function...)
    require_("...").then(...)
    require([...]).then(...)
*/
// TODO: add support for async requires ("_require") [?]
// TODO: ignore commented requires
var createSrcr=SRCR.create=(function(){
    // ...
    return function(cfg){
        var i,s,a,o,x;
        if (!cfg) cfg={};
        else if (typeof(cfg)==="string") cfg=(fromFjson(getFile(cfg) || cfg) || {});

        var sNames=(cfg.names || ["require","source"]).join("|");
        var rxMatchValueMarker=new RegExp("(^|[^a-zA-Z0-9$_.])("+sNames+")\\(\s*[\"']([^\"']+)[\"']\s*\\)","g");

        var dirs=(cfg.directories || cfg.dirs);
        if (dirs) {
            for (i=0;i<dirs.length;i++) {
                if (dirs[i] && !rxTestDirPath.test(dirs[i])) dirs[i]+=SEP_DIR;
            }
        } else dirs=[""];
        var getReferenceContent=function(path){
            var i,s,s1;
            if (isHttpUri(path)) {
                s1=toMd5(path);
                if (s=getCache(s1)) return s;
                if (s=getHttp(path)) setCache(s1,s);
                return s;
            }
            path=path.replace(rxTestFileUri,"");
            for (i=0;i<dirs.length;i++) {
                s=dirs[i]+path;
                if (hasFile(s)) return getFile(s);
                if (hasResource(s)) return getResource(s);
                if (rxTestScriptPath.test(s)) {
                    s1=s.substring(s.length-3);
                    if (s1==".ts") {
                        s1=s.substring(0,s.length-3);
                        if (hasFile(s1+".js")) return getFile(s1+".js");
                    } else {
                        s1=s.substring(0,s.length-3);
                        if (hasFile(s1+".ts")) return getFile(s1+".ts");
                    }
                    if (s1==".js" && hasFile(s.substring(0,s.length-3)+".ts")) return getFile(s.substring(0,s.length-3)+".ts");
                } else {
                    if (hasFile(s+".js")) return getFile(s+".js");
                    if (hasFile(s+".ts")) return getFile(s+".ts");
                    if (hasResource(s+".js")) return getResource(s+".js");
                    if (hasResource(s+".ts")) return getResource(s+".ts");
                }
            }
            return "";
        }
        var getAbsoluteReference=function(path){
            if (isHttpUri(path)) return getHttp(path);
            return new File(path.replace(rxTestFileUri,"")).getAbsolutePath();
        }

        var rxIgnoredReference=cfg.rxIgnoredReference;
        if (typeof(rxIgnoredReference)==="undefined") rxIgnoredReference=/^vertx-[a-z0-9-]+js\//i;

        return function(path,opts){
            if (!opts) opts={};
            var s,o;
            var nt0=nanonow();
            var src=getReferenceContent(path);
            //if (!src) throw "errMissingInitialSource";
            if (!src) {
                clog("ERROR: cannot find the source '"+path+"'");
                return "";
            }
            src=getCommentlessJavascript(src);
            var ref2src,ref,refs,javarefs,srcs,src1,mtch,hash,hash1,hash2hash2hasref,warnings;
            ref2src={};
            ref2src[path]=src;
            refs=[path];
            javarefs=[];
            srcs=[src];
            hash2hash2hasref={};
            warnings=[];
            while (srcs.length) {
                src1=srcs[0];
                // TODO: the hashes should be cached in order to not have hash them over and over again
                hash1=toMd5(src1);
                while (mtch=rxMatchValueMarker.exec(src1)) {
                    ref=mtch[3];
                    if (rxIgnoredReference && rxIgnoredReference.test(ref)) continue;
                    if (rxTestJavaReference.test(ref)) {
                        javarefs.push(ref);
                        ref2src[ref]="return;";
                        continue;
                    }
                    s=ref2src[ref];
                    /*
                    // TODO: re-activate when vertx' script recompilation bug is fixed
                    // TODO: the hashes should be cached in order to not have hash them over and over again
                    hash=toMd5(s);
                    if ((o=hash2hash2hasref[hash]) && o[hash1]) {
                        warnings.push("WARNING: circular reference to '"+ref+"' detected in '"+refs[0]+"'. it will be disabled and return undefined.");
                        clog(warnings[warnings.length-1]);
                        ref2src[ref]="return;";
                        continue;
                    }
                    o=hash2hash2hasref[hash1];
                    if (!o) hash2hash2hasref[hash1]=o={};
                    o[hash]=true;
                    */
                    if (s) continue;
                    s=getReferenceContent(ref);
                    s=getCommentlessJavascript(s);
                    ref2src[ref]=(s || "return;");
                    if (s) {
                        refs.push(ref);
                        srcs.push(s);
                    } else {
                        warnings.push("WARNING: the reference '"+ref+"' could not be resolved. it will return undefined.");
                        clog(warnings[warnings.length-1]);
                    }
                }
                refs.shift();
                srcs.shift();
            }
            var ref2hash,hash2ref;
            srcs=[
                '// source-resolved version of "'+path+'" ['+toMd5(src)+']',
                (warnings.length ? "// "+warnings.join("\n// ") : ""),
                'var MODULE=(typeof(module)==="undefined" ? {exports:{}} : module);',
                '(function(global,module,exports){',
                //'   var define=function(){};',
                '   var __hash2value={};'
                //'   var f_undefined=function(){return;};'
            ];
            ref2hash={};
            hash2ref={};
            for (ref in ref2src) {
                if (ref==path) continue;
                src1=ref2src[ref];
                hash=toMd5(src1);
                if (!hash2ref[hash]) {
                    srcs.push(
                        '',
                        '   // #########################################################',
                        '   // function sourced from "'+ref+'"',
                        '   var f_'+hash+'=global["f_'+hash+'"]=function(){',
                        '       var hash="'+hash+'"; ',
                        '       if (hash in __hash2value) return __hash2value[hash];',
                        '       __hash2value[hash]=null;',
                        '       var exports={},module={exports:exports};',
                        '       var value=(function(module,exports){',
                        '       // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
                                    src1,
                        '       // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
                        '       })(module,exports);',
                        '       if (typeof(value)==="undefined") {',
                        '           if (module.exports!==exports || Object.keys(exports).length) value=module.exports;',
                        '       };',
                        '       __hash2value[hash]=value;',
                        '       return value;',
                        '   };'
                    )
                    hash2ref[hash]=ref;
                }
                ref2hash[ref]=hash;
            }
            srcs.push(
                '',
                '   // #########################################################',
                    src,
                '',
                '   // #########################################################',
                '})(',
                '   typeof(global)==="undefined" ? (typeof(window)==="undefined" ? (typeof(applicationScope)==="undefined" ? {} : applicationScope) : window) : global,',
                '   MODULE,MODULE.exports',
                ');'
            );
            src1=srcs.join("\n").replace(rxMatchValueMarker,function(){
                var s=ref2hash[arguments[3]];
                return (s ? arguments[1]+"f_"+s+"()" : arguments[0]);
                //return arguments[1]+"f_"+ref2hash[arguments[3]]+"()";
            })
            if (opts.tsc) {
                src1=(tsc(src1,cfg.tsctarget) || src1);
            } else {
                clog("WARNING: this environment does not provide a typescript compiler (tsc). do not reference non-javascript-compatible typescript references if you want your output to be valid javascript.");
            }
            var pathbase=path.replace(/\.(js|ts)/i,"");
            setFile(pathbase+"_srcr.js",src1);
            clog("INFO: the full script source has been transpiled and written to '"+pathbase+"_srcr.js' ["+(src1.length*1e-3).toFixed(0)+"kb].");

            if (opts.jar!==false && (javarefs.length || opts.jar)) {
                var pom=getResource("pom.xml");
                s="";
                for (i=0;i<javarefs.length;i++) {
                    a=javarefs[i].split("/");
                    s+="\n<dependency>"
                        +"<groupId>"+a[0]+"</groupId>"
                        +"<artifactId>"+a[1]+"</artifactId>"
                        +"<version>"+a[2]+"</version>"
                    +"</dependency>";
                }
                pom=pom.replace("</dependencies>",s+"\n</dependencies>");
                pom=pom.replace(/srcr.js/g,pathbase+"_srcr.js");
                pom=pom.replace(/srcr.jar/g,pathbase+"_srcr.jar");
                pom=pom.replace(/pom.xml/g,pathbase+"_srcr_pom.xml");
                setFile(pathbase+"_srcr_pom.xml",pom);
                clog("INFO: the pom file with all maven dependencies has been written to '"+pathbase+"_srcr_pom.xml'");
                if (opts.mvn) {
                    osexec("mvn package clean -f "+pathbase+"_srcr_pom.xml");
                    clog("INFO: the standalone application jar for running the script has been written to '"+pathbase+"_srcr.jar'. the application can be started with the command 'java -jar "+pathbase+"_srcr.jar'.");
                } else {
                    clog("WARNING: cannot build '"+pathbase+"_srcr.jar' from '"+pathbase+"_srcr_pom.xml' because this environment does not seem to provide maven (mvn).")
                }
            }

            clog("total execution time = "+((nanonow()-nt0)*1e-6).toFixed(3)+"ms");
            return src1;
        }
    }
})();

// exit if this script is used like a module
if (!sysprop("args_srcr")) {
    if (typeof(module)!=="undefined") module.exports=SRCR;
    return SRCR;
}

// process arguments
var cfg=null,pathsIn=[],opts={};
var i,s,a,k,v,args=fromFjson(sysprop("args_srcr") || "[]");
var rx=/\s*-([^=]+)=([\s\S]+)\s*$/i;
for (i=0;i<args.length;i++) {
    s=args[i];
    if (a=s.match(rx)) {
        k=a[1];v=a[2];
        if (k=="cfg") cfg=v;
        else if (k=="out") opts.outpath=v;
    } else if (s.charAt(0)=="-") {
        opts[s.substring(1)]=true;
    } else {
        pathsIn.push(s);
    }
}
System.clearProperty("args_srcr");

// do the work
var toSrc=createSrcr(cfg);
for (i=0;i<pathsIn.length;i++) {
    s=toSrc(pathsIn[i],opts);
    if (opts.print) clog(s);
    if (opts.run) (new Function(s)());
}

// exit
if (typeof(module)!=="undefined") module.exports=SRCR;
if (!opts.run) vertx.close();
return SRCR;