var server = vertx.createHttpServer();
var Router = require("vertx-web-js/router");
var router = Router.router(vertx);
router.route().handler(function(rctx){
  rctx.response().putHeader("content-type","text/plain").end("SRCR is reporting for duty...");
});
server.requestHandler(router.handle).listen(4380);
var hndlrs0,lgr0=java.util.logging.Logger.getLogger("");
if (lgr0 && (hndlrs0=lgr0.getHandlers()).length) lgr0.removeHandler(hndlrs0[0]);
console.log("HTTP server started. Open 'http://localhost:4380' and see for yourself...")