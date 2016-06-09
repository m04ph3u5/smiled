angular.module('smiled.application').controller('draftCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','notifyService','$state','article', '$stateParams', 
              function draftCtrl(CONSTANTS,$scope, apiService,Upload, notifyService, $state, article, $stateParams){
	 
	var self = this; 
	var scenId = $stateParams.id;
	//settaggio id da service - verrà preso dal DB
	self.id = article.getArticleId(); 
	self.newsNumber = article.getNumberNewspaper();
	
	console.log(self.newsNumber + "ID ARTICOLO");

	self.idCurrentTemplate = article.getIdCurrentTemplate();
	self.idTemplate = article.getIdTemplate(); 
	self.article = article.getArticleObject(self.id);
	self.isChecked = false;
	self.isCityChecked = false; 
	
	self.articlePut = {}; 
	

	self.setData = function(input){
	      
	       if (input == undefined ) {
	            console.log ("its undefined");
	        }       
	        else {
	        	// gestire se l'utente non scrive nulla
	        	if (input.title == "") {
	        		input.title = "Titolo dell'articolo";
	        	}
	        	
	        	/*if (input.subtitle == "") {
	        		input.subtitle = "Sottotitolo dell'articolo";
	        		
	        	}*/
	           
	    	    if (self.idTemplate == 1) {
	    	    	
	    	    	self.articlePut.title = input.title; 
	    	    	self.articlePut.subtitle = input.subtitle; 
	    	    	/*self.articlePut.subtitle = "";*/
	    	    	self.articlePut.text1 = input.text1; 
	    	    	self.articlePut.text2 = input.text2; 
	    	    	self.articlePut.imageId = input.imageId;
	    	    	self.articlePut.idArticleTemplate = 1; 
	    	    	self.articlePut.city = ""; 
	    	    	
	    	    	console.log(self.articlePut); 

	    	    	//put dell'articolo al db
	    	    	var s= apiService.updateArticle(scenId,self.newsNumber , self.articlePut);
					s.then(function(data){ 		
						 $state.go('logged.scenario.template1');
						 
					 }, function(reason){
						 console.log("Impossibile aggiornare l'articolo.")
					 })
	    	    	
	    	    	/*article.setArticleObject(input, self.id);*/
		           
	    	    	
	    	    } 
	    	    
	    	    if (self.idTemplate == 2) {
	    	    	article.setArticleObject(input, self.id);
		            $state.go('logged.scenario.template2');
	    	    	
	    	    	
	    	    }
	    	    
	            /*article.setArticleObject(input, self.id);
	            $state.go('logged.scenario.template1');*/
	      
	  }  
	         
	}
	
	
}]);