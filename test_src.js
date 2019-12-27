// source-resolved version of "test" [f41d4c60c1633f1652509e1ae19bc340]
// WARNING: the reference 'test3x.js' could not be resolved. it will return undefined.
(function (global) {
    var __hash2value = {};
    var f_undefined = function () { return; };
    // #########################################################
    // function sourced from "test1"
    var f_59906a6157622a78ec7ce9f75cbfc716 = global["f_59906a6157622a78ec7ce9f75cbfc716"] = function () {
        var hash = "59906a6157622a78ec7ce9f75cbfc716";
        if (hash in __hash2value)
            return __hash2value[hash];
        var exports = {}, module = { exports: exports };
        var value = (function (module, exports) {
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            console.log("STARTING test1.js");
            //var ABC=xrequire("http://oleg.fi/relaxed-json/relaxed-json.js");
            //console.log(ABC.stringify({foo:"bar"}));
            f_9f8a33eee733b5a786ddeefd9f773777();
            f_505b97969baa28c3f607a38ee02f4f2d();
            console.log("ENDING test1.js");
            return "test1 ready " + Math.random();
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        })(module, exports);
        if (typeof (value) === "undefined") {
            if (module.exports !== exports || Object.keys(exports).length)
                value = module.exports;
        }
        ;
        __hash2value[hash] = value;
        return value;
    };
    // #########################################################
    // function sourced from "test2.ts"
    var f_9f8a33eee733b5a786ddeefd9f773777 = global["f_9f8a33eee733b5a786ddeefd9f773777"] = function () {
        var hash = "9f8a33eee733b5a786ddeefd9f773777";
        if (hash in __hash2value)
            return __hash2value[hash];
        var exports = {}, module = { exports: exports };
        var value = (function (module, exports) {
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            console.log("STARTING test2.js");
            var s = { test: 2 };
            module.exports = s;
            console.log("ENDING test2.js");
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        })(module, exports);
        if (typeof (value) === "undefined") {
            if (module.exports !== exports || Object.keys(exports).length)
                value = module.exports;
        }
        ;
        __hash2value[hash] = value;
        return value;
    };
    // #########################################################
    // function sourced from "file:test3.js"
    var f_e726235d5d21e1e5cce1a380074be252 = global["f_e726235d5d21e1e5cce1a380074be252"] = function () {
        var hash = "e726235d5d21e1e5cce1a380074be252";
        if (hash in __hash2value)
            return __hash2value[hash];
        var exports = {}, module = { exports: exports };
        var value = (function (module, exports) {
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            console.log("STARTING test3.js");
            console.log("the value of test1 in test3 is " + f_59906a6157622a78ec7ce9f75cbfc716());
            exports.foo = ["bar", "morebar"];
            console.log("ENDING test3.js");
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        })(module, exports);
        if (typeof (value) === "undefined") {
            if (module.exports !== exports || Object.keys(exports).length)
                value = module.exports;
        }
        ;
        __hash2value[hash] = value;
        return value;
    };
    // #########################################################
    // function sourced from "test3x.js"
    var f_505b97969baa28c3f607a38ee02f4f2d = global["f_505b97969baa28c3f607a38ee02f4f2d"] = function () {
        var hash = "505b97969baa28c3f607a38ee02f4f2d";
        if (hash in __hash2value)
            return __hash2value[hash];
        var exports = {}, module = { exports: exports };
        var value = (function (module, exports) {
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            return;
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        })(module, exports);
        if (typeof (value) === "undefined") {
            if (module.exports !== exports || Object.keys(exports).length)
                value = module.exports;
        }
        ;
        __hash2value[hash] = value;
        return value;
    };
    // #########################################################
    console.log("STARTING test.js");
    console.log(typeof (Promise));
    //xrequire("https://cdn.jsdelivr.net/npm/es6-promise/dist/es6-promise.auto.min.js");
    console.log(typeof (Promise));
    //Promise.resolve("PROMISE").then(console.log);
    //rxequire("https://www.foo.bar/abc/def.js");
    var x = f_59906a6157622a78ec7ce9f75cbfc716();
    console.log("value of test1 = " + JSON.stringify(x || null));
    console.log("value of test2 = " + JSON.stringify(f_9f8a33eee733b5a786ddeefd9f773777()));
    console.log("value of test1 (again) = " + JSON.stringify(f_59906a6157622a78ec7ce9f75cbfc716()));
    console.log("value of test3 = " + JSON.stringify(f_e726235d5d21e1e5cce1a380074be252()));
    console.log("value of test4 (which equals test3) = " + JSON.stringify(f_e726235d5d21e1e5cce1a380074be252()));
    console.log("ENDING test.js ... with a BANG");
    return "test ready";
    // #########################################################
})(typeof (global) === "undefined" ? (typeof (window) === "undefined" ? (typeof (applicationScope) === "undefined" ? {} : applicationScope) : window) : global);
