// this is used to simplify development by not having to re-build the jar every time
/*try {
    var js=vertx.fileSystem().readFileBlocking("dev.js").toString("UTF-8");
    (new Function(js))();
    vertx.close();
    return;
} catch(err) {}*/

// VERSION 0.2.4
var createSourcerer=(function(){
    var System=java.lang.System;
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
            var s=new Scanner(is).useDelimiter("\\A").next();
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
            var s=new Scanner(is).useDelimiter("\\A").next();
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

    var x=new File(".sourcerer/jscache");
    if (!x.isDirectory()) x.mkdirs();

    var tsc=function(ts,target){
        var s,k;
        k=".sourcerer/jscache/"+toMd5(ts);
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

	var DigestUtils=org.apache.commons.codec.digest.DigestUtils;
	var toMd5=DigestUtils.md5Hex
	var toSha256=DigestUtils.sha256Hex;
    var toSha512=DigestUtils.sha512Hex;

    return function(cfg){
        if (!cfg) cfg={};
        else if (typeof(cfg)==="string") cfg=(fromFjson(getFile(cfg) || cfg) || {});

        var sNames=(cfg.names || ["require","source"]).join("|");
        var rxMatchValueMarker=new RegExp("([^a-zA-Z0-9$_.])("+sNames+")\\(\s*[\"']([^\"']+)[\"']\s*\\)","g");

        var i,dirs=(cfg.directories || cfg.dirs);
        if (dirs) {
            for (i=0;i<dirs.length;i++) {
                if (dirs[i] && !rxTestDirPath.test(dirs[i])) dirs[i]+=SEP_DIR;
            }
        } else dirs=[""];
        var getReferenceContent=function(path){
            var i,s,s1;
            if (isHttpUri(path)) return getHttp(path);
            path=path.replace(rxTestFileUri,"");
            for (i=0;i<dirs.length;i++) {
                s=dirs[i]+path;
                if (hasFile(s)) return getFile(s);
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
                }
            }
            return "";
        }
        var getAbsoluteReference=function(path){
            if (isHttpUri(path)) return getHttp(path);
            return new File(path.replace(rxTestFileUri,"")).getAbsolutePath();
        }

        return function(path){
            var s,o;
            var nt0=nanonow();
            var src=getReferenceContent(path);
            //if (!src) throw "errMissingInitialSource";
            if (!src) {
                clog("ERROR: cannot find the source '"+path+"'");
                return "";
            }
            var ref2src,ref,refs,srcs,src1,mtch,hash,hash1,hash2hash2hasref,warnings;
            ref2src={};
            ref2src[path]=src;
            refs=[path];
            srcs=[src];
            hash2hash2hasref={};
            warnings=[];
            while (srcs.length) {
                src1=srcs[0];
                // TODO: the hashes should be cached in order to not have hash them over and over again
                hash1=toMd5(src1);
                while (mtch=rxMatchValueMarker.exec(src1)) {
                    ref=mtch[3];
                    s=ref2src[ref];
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
                    if (s) continue;
                    s=getReferenceContent(ref);
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
                '(function(global){',
                '   var __hash2value={};',
                '   var f_undefined=function(){return;};'
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
                '   typeof(global)==="undefined" ? (typeof(window)==="undefined" ? (typeof(applicationScope)==="undefined" ? {} : applicationScope) : window) : global',
                ');'
            );
            src1=srcs.join("\n").replace(rxMatchValueMarker,function(){
                return arguments[1]+"f_"+ref2hash[arguments[3]]+"()";
            })
            src1=(tsc(src1,cfg.tsctarget) || src1);
            clog("build time = "+((nanonow()-nt0)*1e-6).toFixed(3)+"ms");
            setFile(path.replace(/\.(js|ts)/i,"")+"_src.js",src1);
            return src1;
        }
    }
})();

// process arguments
var cfg=null,pathsIn=[],pathOut="",doRun=false,doPrint=false;
var i,s,a,k,v,args=JSON.parse(java.lang.System.getProperty("args") || "[]");
var rx=/\s*-([^=]+)=([\s\S]+)\s*$/i;
for (i=0;i<args.length;i++) {
    s=args[i];
    if (a=s.match(rx)) {
        k=a[1];v=a[2];
        if (k=="cfg") cfg=v;
        else if (k=="out") pathOut=v;
    } else if (s=="-run") {
        doRun=true;
    } else if (s=="-print") {
        doPrint=true;
    } else {
        pathsIn.push(s);
    }

}

// do the work
var toSource=createSourcerer(cfg);
for (i=0;i<pathsIn.length;i++) {
    s=toSource(pathsIn[i]);
    if (doPrint) console.log(s)
    if (doRun) (new Function(s)());
}

// exit
vertx.close();
return;