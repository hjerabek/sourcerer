require("org.mindrot/jbcrypt/0.4");
var BCrypt=org.mindrot.jbcrypt.BCrypt;
module.exports=function(s){
    return BCrypt.hashpw(s,BCrypt.gensalt());
}