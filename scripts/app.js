/*
 Stormpath ID Site v0.3.0
 (c) 2014-2016 Stormpath, Inc. http://stormpath.com
 License: Apache 2.0
*/
"use strict";!function(){angular.module("stormpathIdpApp",["ngRoute"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/login.html",controller:"LoginCtrl"}).when("/register",{templateUrl:"views/registration.html",controller:"RegistrationCtrl"}).when("/forgot/:retry?",{templateUrl:"views/forgot.html",controller:"ForgotCtrl"}).when("/reset",{templateUrl:"views/reset.html",controller:"ResetCtrl"}).when("/verify",{templateUrl:"views/verify.html",controller:"VerifyCtrl"}).when("/unverified",{templateUrl:"views/unverified.html",controller:"UnverifiedCtrl"}).otherwise({redirectTo:"/"})}])}(window),angular.module("stormpathIdpApp").controller("LoginCtrl",["$scope","Stormpath","$window",function(a,b,c){function d(){c.fbAsyncInit=function(){var a=c.FB;a.init({appId:b.getProvider("facebook").clientId,xfbml:!0,status:!0,version:"v2.0"})},function(a,b,c){var d,e=a.getElementsByTagName(b)[0];a.getElementById(c)||(d=a.createElement(b),d.id=c,d.src="//connect.facebook.net/es_LA/sdk.js",e.parentNode.insertBefore(d,e))}(c.document,"script","facebook-jssdk")}function e(){Object.keys(a.errors).map(function(b){a.errors[b]=!1})}function f(b){400===b.status?b.code&&2014===b.code?a.errors.organizationNameKeyInvalid=!0:a.errors.badLogin=!0:404===b.status?a.errors.notFound=!0:b.userMessage||b.message?a.errors.userMessage=b.userMessage||b.message:a.errors.unknown=!0}function g(b){a.submitting=!1,b&&f(b)}function h(a){b.register({providerData:{providerId:"facebook",accessToken:a.authResponse.accessToken}},g)}a.ready=!1,a.canRegister=!0,a.errors={badLogin:!1,notFound:!1,userMessage:!1,unknown:!1,organizationNameKeyRequired:!1,organizationNameKeyInvalid:!1},b.init.then(function(){a.organizationNameKey=b.getOrganizationNameKey(),a.showOrganizationField=b.client.jwtPayload.sof,a.disableOrganizationField=""!==a.organizationNameKey,a.canRegister=!!b.idSiteModel.passwordPolicy,a.providers=b.providers,a.ready=!0,a.hasProviders=a.providers.length>0,b.getProvider("facebook")&&d()});var i=!1;return a.submit=function(){if(e(),a.showOrganizationField&&!a.organizationNameKey)a.errors.organizationNameKeyRequired=!0;else if(a.username&&a.password){a.submitting=!0;var c={login:a.username.trim(),password:a.password.trim()};a.organizationNameKey&&(c.accountStore={nameKey:a.organizationNameKey}),b.client.jwtPayload.ash&&(c.accountStore={href:b.client.jwtPayload.ash}),b.login(c,g)}else a.errors.emailPasswordRequired=!0},a.googleLogin=function(){var a=c.gapi;if(a){e();var d={clientid:b.getProvider("google").clientId,scope:"email",cookiepolicy:"single_host_origin",callback:function(a){!i&&a.status.signed_in&&"PROMPT"===a.status.method&&(i=!0,b.register({providerData:{providerId:"google",accessToken:a.access_token}},g))}};a.auth.signIn(d)}},a.facebookLogin=function(){var a=c.FB;a.login(function(a){"connected"===a.status&&h(a)},{scope:"email"})},a.samlLogin=function(a){b.samlLogin(a.accountStore,g)},a.providerLogin=function(b){var c=b.providerId,d=a[c+"Login"];"function"!=typeof d?console.error("provider login function '"+c+"' is not implemented"):d(b)},a}]),angular.module("stormpathIdpApp").controller("RegistrationCtrl",["$scope",function(a){return a}]),angular.module("stormpathIdpApp").controller("ForgotCtrl",["$scope","Stormpath","$routeParams","$rootScope",function(a,b,c,d){a.sent=!1,a.ready=!1,a.retry=c.retry||!1,a.fields={},d.$on("$locationChangeStart",function(b){a.sent&&b.preventDefault()}),b.init.then(function(){a.organizationNameKey=b.getOrganizationNameKey(),a.showOrganizationField=b.client.jwtPayload.sof,a.disableOrganizationField=""!==a.organizationNameKey,a.ready=!0}),a.submit=function(){a.notFound=!1;var c=Object.keys(a.fields).filter(function(b){return a.fields[b].validate()});if(!(c.length>0)){var d={email:a.fields.email.value.trim()};a.organizationNameKey&&(d.accountStore={nameKey:a.organizationNameKey}),b.client.jwtPayload.ash&&(d.accountStore={href:b.client.jwtPayload.ash}),a.submitting=!0,b.sendPasswordResetEmail(d,function(){a.sent=!0,a.submitting=!1})}}}]),angular.module("stormpathIdpApp").controller("ResetCtrl",["$scope","Stormpath","$location",function(a,b,c){a.status="loading",a.fields={};var d;b.init.then(function(){b.verifyPasswordToken(function(b,e){b?404===b.status?c.path("/forgot/retry"):(a.status="failed",a.error=b.userMessage||b):(a.status="verified",d=e)})}),a.submit=function(){var c=Object.keys(a.fields).filter(function(b){var c=a.fields[b];return c.validate()}).length;if(!(c>0)){var e=a.fields.password.value;a.submitting=!0,b.setNewPassword(d,e,function(b){a.submitting=!1,b?a.unknownError=String(b.userMessage||b.developerMessage||b):a.status="success"})}}}]),angular.module("stormpathIdpApp").controller("VerifyCtrl",["$scope","Stormpath",function(a,b){a.status="loading",b.init.then(function(){b.verifyEmailToken(function(b){b?(a.status="failed",a.error=String(b.userMessage||b.developerMessage||b.message||b)):a.status="verified"})})}]),angular.module("stormpathIdpApp").controller("ErrorCtrl",["$scope","Stormpath",function(a,b){a.errors=b.errors,a.inError=!1,a.$watchCollection("errors",function(){a.inError=a.errors.length>0})}]),angular.module("stormpathIdpApp").service("Stormpath",["$window","$routeParams","$location","$rootScope","$q",function(a,b,c,d,e){function f(a){var b=a.userMessage||a.developerMessage||a.message||"Unknown";-1===j.errors.indexOf(b)&&j.errors.push(b)}function g(b){a.location=o.baseurl+"sso/?jwtResponse="+b.split("jwtResponse=")[1]}function h(b){a.location=b}function i(){return n&&n[1]&&parseInt(n[1],10)<10?void f(new Error("Internet Explorer "+n[1]+" is not supported.  Please try again with a newer browser.")):void(o=j.client=new m.Client(function(a,b){d.$apply(function(){if(a)f(a),k.reject(a);else{var c=b;j.idSiteModel=c,j.providers=j.providers.concat(c.providers),d.logoUrl=c.logoUrl,k.resolve()}})}))}var j=this,k=e.defer(),l=c.search(),m=a.Stormpath,n=a.navigator.userAgent.match(/MSIE ([0-9.]+)/),o=j.client=null;return j.init=k.promise,j.errors=[],j.jwt=l.jwt,j.isRegistered=null,j.providers=[],j.registeredAccount=null,j.isVerified=null,this.samlLogin=function(b,c){var d={method:"GET",url:j.client.appHref+"/saml/sso/idpRedirect?accountStore.href="+b.href};j.client.requestExecutor.execute(d,function(b,d){b?b.serviceProviderCallbackUrl?h(b.serviceProviderCallbackUrl):c(b):a.location=d.serviceProviderCallbackUrl})},this.login=function(a,b){o.login(a,function(a,c){d.$apply(function(){a?a.serviceProviderCallbackUrl?h(a.serviceProviderCallbackUrl):b(a):g(c.serviceProviderCallbackUrl)})})},this.register=function(a,b){o.register(a,function(a,e){d.$apply(function(){a?a.serviceProviderCallbackUrl?h(a.serviceProviderCallbackUrl):b(a):e&&e.serviceProviderCallbackUrl?g(e.serviceProviderCallbackUrl):(j.isRegistered=!0,c.path("/unverified"))})})},this.verifyEmailToken=function(a){o.verifyEmailToken(function(b){d.$apply(function(){j.isVerified=b?!1:!0,a(b)})})},this.verifyPasswordToken=function(a){o.verifyPasswordResetToken(function(b,c){d.$apply(function(){a(b,c)})})},this.sendPasswordResetEmail=function(a,b){o.sendPasswordResetEmail(a,function(a){d.$apply(function(){a?a.serviceProviderCallbackUrl?h(a.serviceProviderCallbackUrl):b(a):b()})})},this.setNewPassword=function(a,b,c){o.setAccountPassword(a,b,function(a,b){d.$apply(function(){c(a,b)})})},this.getOrganizationNameKey=function(){return o.jwtPayload.asnk||""},this.getProvider=function(a){var b=j.providers.filter(function(b){return b.providerId===a});return 1===b.length?b[0]:null},i(),this}]),angular.module("stormpathIdpApp").controller("RegistrationFormCtrl",["$scope","Stormpath",function(a,b){a.fields={},a.submit=function(){a.unknownError=!1;var c=Object.keys(a.fields).filter(function(b){var c=a.fields[b];return c.validate()}),d=Object.keys(a.fields).reduce(function(b,c){return b[c]=a.fields[c].value,b},{});delete d.passwordConfirm,0===c.length&&(a.submitting=!0,b.register(d,function(b){a.submitting=!1,b&&(409===b.status?a.fields.email.setError("duplicateUser",!0):a.unknownError=String(b.userMessage||b.developerMessage||b))}))}}]),angular.module("stormpathIdpApp").directive("formGroup",function(){return{restrict:"A",scope:!0,link:function(a,b,c){a.validationError=!1,a.errors={},a.$watch("validationError",function(){b.toggleClass(c.errorClass||"has-error",a.validationError)}),a.$watchCollection("errors",function(){var d=Object.keys(a.errors).filter(function(b){return a.errors[b]}).length;b.toggleClass(c.errorClass||"has-error",a.validationError||d>0)})}}}),angular.module("stormpathIdpApp").directive("formControl",function(){return{restrict:"A",link:function(a,b,c){var d=c.name;a.fields||(a.fields={}),a.fields[d]={value:b.val(),validationError:!1,errors:a.errors||{},setError:function(b,c){"function"==typeof a.setError&&a.setError(b,c)},validate:function(){return"function"==typeof a.validate?a.validate(b):!0}},a.clearErrors=function(){Object.keys(a.errors).map(function(b){a.errors[b]=!1})},b.on("input",function(){a.$apply(function(a){a.fields[d].value=b.val()})}),a.$watchCollection("errors",function(b){angular.extend(a.fields[d].errors,b||{})}),a.$watchCollection("fields."+d+".errors",function(b){angular.extend(a.errors,b||{})})}}}),angular.module("stormpathIdpApp").directive("validateOnBlur",function(){return{restrict:"A",link:function(a,b){b.on("blur",function(){a.$apply(function(){a.validate(b)})})}}}),angular.module("stormpathIdpApp").directive("nameValidation",function(){return{restrict:"A",link:function(a){a.validate=function(b){a.clearErrors();var c=""===b.val();return a.validationError=c,c}}}}),angular.module("stormpathIdpApp").directive("emailValidation",function(){var a=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;return{restrict:"A",link:function(b){b.errors={duplicateUser:!1},b.setError=function(a,c){b.errors[a]=c},b.validate=function(c){b.clearErrors();var d=c.val().trim(),e=""===d?!0:!a.test(d);return b.validationError=e,e}}}}),angular.module("stormpathIdpApp").directive("passwordMatchValidation",function(){return{restrict:"A",link:function(a){a.validate=function(b){var c=""!==a.fields.password.value&&b.val()!==a.fields.password.value;return a.validationError=c,c}}}}),angular.module("stormpathIdpApp").directive("passwordPolicyValidation",["Stormpath",function(a){return{restrict:"A",link:function(b){b.errors={minLength:!1,maxLength:!1,requireLowerCase:!1,requireUpperCase:!1,requireNumeric:!1,requireDiacritical:!1},b.errorCount=function(){return Object.keys(b.errors).filter(function(a){return b.errors[a]}).length},b.validate=function(c){b.clearErrors();for(var d=c.val(),e=[["minLength",function(){return d.length<a.idSiteModel.passwordPolicy.minLength}],["maxLength",function(){return d.length>a.idSiteModel.passwordPolicy.maxLength}],["requireLowerCase",function(){return a.idSiteModel.passwordPolicy.requireLowerCase&&!/[a-z]/.test(d)}],["requireUpperCase",function(){return a.idSiteModel.passwordPolicy.requireUpperCase&&!/[A-Z]/.test(d)}],["requireNumeric",function(){return a.idSiteModel.passwordPolicy.requireNumeric&&!/[0-9]/.test(d)}],["requireDiacritical",function(){return a.idSiteModel.passwordPolicy.requireDiacritical&&!/[\u00C0-\u017F]/.test(d)}]],f=0;f<e.length;f++)if(b.errors[e[f][0]]=e[f][1](d),b.errorCount()>0){alert(b.errors[0]);break}return b.validationError=b.errorCount()>0,b.validationError}}}}]),angular.module("stormpathIdpApp").controller("UnverifiedCtrl",["$scope","Stormpath","$location",function(a,b,c){b.isRegistered||c.path("/")}]);