angular.module('smiled.application').controller('draftCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','notifyService','$state','article', 
              function draftCtrl(CONSTANTS,$scope, apiService,Upload, notifyService, $state, article){
	 
	var self = this; 
	
	//settaggio id da service - verrà preso dal DB
	self.id = article.getArticleId(); 
	console.log(self.id + "ID ARTICOLO");
	self.idTemplate = article.getIdCurrentTemplate();
	self.article = article.getArticleObject(self.id);
	self.isChecked = false;
	self.isCityChecked = false; 
	
	self.setData = function(input){
	      
	       if (input == undefined ) {
	            console.log ("its undefined");
	        }       
	        else {
	        	
	        	if (input.title == "") {
	        		input.title = "Titolo dell'articolo";
	        	}
	        	
	        	/*if (input.subtitle == "") {
	        		input.subtitle = "Sottotitolo dell'articolo";
	        		
	        	}*/
	           
	    	    if (self.idTemplate == "1") {
	    	    	article.setArticleObject(input, self.id);
		            $state.go('logged.scenario.template1');
	    	    	
	    	    } 
	    	    
	    	    if (self.idTemplate == "2") {
	    	    	article.setArticleObject(input, self.id);
		            $state.go('logged.scenario.template2');
	    	    	
	    	    	
	    	    }
	    	    
	            /*article.setArticleObject(input, self.id);
	            $state.go('logged.scenario.template1');*/
	      
	  }  
	         
	}
	
	
}]);