var toSrc=require("srcr.js").create();

var server=vertx.createHttpServer();
var Router=require("vertx-web-js/router");
var router=Router.router(vertx);
router.route("/example_*").handler(function(rctx){
  var ref=(rctx.normalisedPath() || "").substring(1);
  var src=(ref ? toSrc(ref,{tsc:true,jar:false}) : "");
  if (!src) src='console.log("[SRCR] cannot resolve reference \''+ref+'\'");';
  rctx.response().putHeader("content-type","application/json; charset=UTF-8").end(src);
});
server.requestHandler(router.handle).listen(4380);

console.log("\nSRCR HTTP server started.\nOpen, for example, 'http://localhost:4380/example_app' to see the full source of the example app...\n");