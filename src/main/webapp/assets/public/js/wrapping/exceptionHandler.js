angular.module('smiled.application').config(
               function exceptionService($provide){
            	   
           //$delegate rappresenta l'original service che si vuole decorare, in questo caso rappresenta l'exceptionHandler
           $provide.decorator("$exceptionHandler", function($delegate ){    //$injector
        	  return function(exception, cause){ 
        		  $delegate(exception, cause);
        		  console.log("I'M ON EXCEPTION HANDLER");
        		  console.log ("EXCEPTION: "+exception+ ", cause: "+ cause);
        		  
        	  } 
           });
       
});

