angular.module('smiled.application').config(
               function exceptionService($provide){
            	   
           //$delegate rappresenta l'original service che si vuole decorare, in questo caso rappresenta l'exceptionHandler
           $provide.decorator("$exceptionHandler", ['$delegate', '$injector', function($delegate , $injector){   //$injector
        	  return function(exception, cause){ 
        		  
        		  console.log("I'M ON EXCEPTION HANDLER");
        		  console.log ("EXCEPTION: "+exception+ ", cause: "+ cause);
        		  var $rootScope = $injector.get("$rootScope");
        		  $delegate(exception, cause);
        		 
        		  $rootScope.logAngularError(exception, cause);
        	  } 
           }]);
       
}).run(function ($http, $rootScope) {
    $rootScope.logAngularError = function (exception, cause) {
    	var errore = {};
    	errore.exceptionMessage = exception.message;
    	errore.cause = cause;
   	
        //Call your webservice here.
    	$http.post("/api/v1/clientException", errore )
                .success(function (response) {
                    console.log(JSON.stringify(response));
                });
    };

});

