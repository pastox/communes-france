var url = document.location.href;

var loginElt = document.getElementById('login');
var registerElt = document.getElementById('register');

if (loginElt != null && registerElt != null){
    loginElt.href+='?url='+url;
    registerElt.href+='?url='+url;
}