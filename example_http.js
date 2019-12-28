var server = vertx.createHttpServer();
var Router = require("vertx-web-js/router");
var router = Router.router(vertx);
router.route().handler(function(rctx){
  rctx.response().putHeader("content-type","text/plain").end("SRCR is reporting for duty...");
});
server.requestHandler(router.handle).listen(4380);