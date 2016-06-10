angular.module('smiled.application').controller('draftCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','notifyService','$state','article', '$stateParams', 'alertingScenario',
              function draftCtrl(CONSTANTS,$scope, apiService,Upload, notifyService, $state, article, $stateParams, alertingScenario){
	 
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
	
	self.uploadImage=function(file){
		Upload.upload({
            url: CONSTANTS.urlMediaScenarioPost(scenId),
            headers : {
                'Content-Type': file.type
            },
            file: file
        })
        .then(
        function (response) {
	        self.uploadedFile = {};
	        self.uploadedFile.id = response.data.id;
	        self.uploadedFile.name = response.config.file[0].name;       
        },function(reason){
        	if(reason.status=="400" || reason.status=="406"){
				alertingScenario.addWarning("Formato non supportato.");
        	}else{
        		alertingScenario.addWarning("C'è stato un errore, non è stato possibile caricare il file. Riprova per favore.");
        	}				        
        });
	}
	
	self.getUploadedImage = function(){
		return CONSTANTS.urlMedia(self.uploadedFile.id);
	}
	self.removeImage =function(){
		self.uploadedFile = undefined;
	}

	

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
	    	    	self.articlePut.imageId = self.uploadedFile.id;
	    	    	console.log(self.uploadedFile.id + "IMMAGINE PROVA"); 
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