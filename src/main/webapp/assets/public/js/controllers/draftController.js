angular.module('smiled.application').controller('draftCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','notifyService','$state','article', '$stateParams', 'alertingGeneric',
              function draftCtrl(CONSTANTS,$scope, apiService,Upload, notifyService, $state, article, $stateParams, alertingGeneric){
	 
	var self = this; 
	var scenId = $stateParams.id;
	//settaggio id da service - verrà preso dal DB
	self.id = article.getArticleId(); 
	console.log(self.id + "ID ARTICOLO")
	if(self.id == ""){
		$state.go('logged.scenario.template1');	
	}
	
	self.newsNumber = article.getNumberNewspaper();

	self.idCurrentTemplate = article.getIdCurrentTemplate();
	self.idTemplate = article.getIdTemplate(); 
	self.isChecked = false;
	self.isCityChecked = false; 
	self.isUploaded = false;
	self.articles = []; 
	self.article = {};
	self.article.image = null;
	var oldIdImage; 
	self.articlePut = {}; 

	 
	/*----------------------  GET ARTICLE ACCORDING TO ARTICLE ID    ---------------------*/

	self.getArticleDraft = function() {
		console.log(self.id); 
		if(self.id == "1"){
			getArticleObject(1); 
		} else
		if (self.id == "2") {
			getArticleObject(2);	
		} else
		if (self.id == "3") {
			getArticleObject(3);
		}
			}

	var getArticleObject = function(id) {
		
		var s = apiService.getMyLastNewspaper(scenId);
		s.then(function(data){
			
			self.newspaper = data; 
			self.articles = self.newspaper.articles;  
			
			if(self.articles.length == 0) {
				self.article = article.getArticleObject(self.id);
				console.log(self.article);	
				
			} else {
				 
				for(var i=0; i<=self.articles.length; i++){
					if(self.articles[i].idArticleTemplate == id){
						self.article = self.articles[i]; 
						console.log("Passo di qui");
						
						var oldIdImage = angular.copy(self.article.imageId);
					
						if(oldIdImage == null) {
						
							self.article.image = ""; 
							
						} else {
						console.log("Eccomi"); 
							self.article.image = CONSTANTS.urlMedia(self.article.imageId);
							console.log(self.article); 
							
						}
						
						break; 
						
					} else {			
						self.article = article.getArticleObject(self.id);
					}
		
				}
			}

		}),
		
		  function(reason){
			
			console.log("Errore.");	
		}
	
	}
	self.getArticleDraft();  
	
	
	/*----------------------  UPLOAD ARTICLE IMAGE     ---------------------*/
	
	self.uploadImage=function(file){
		self.isUploaded = true; 
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
		console.log("Di qui ci passo"); 
		self.uploadedFile = undefined;
	}

	
	/*----------------------  UPDATE DRAFT ARTICLE    ---------------------*/
	
	self.setData = function(input){
	        	
	        	/*if (input.subtitle == "") {
	        		input.subtitle = "Sottotitolo dell'articolo";
	        		
	        	}*/
	           
	    	    if (self.idTemplate == 1) {
	    	    	
	    	    	if(self.id == "1") {
	    	    		
	    	    		if(input.title.length<5 || input.title == "" || input.title == null){
	    	    			alertingGeneric.addWarning("Inserire un titolo di almeno 5 caratteri");
	    	    		} else if(input.subtitle.length<5 || input.subtitle == "" ){
	    	    			alertingGeneric.addWarning("Inserire un sottitolo di almeno 5 caratteri");
	    	    			 
	    	    		} else if (input.text1 == "" || input.text1.length<20 || input.text2 == "" || input.text2.lenght<20) {
	    	    			alertingGeneric.addWarning("Hai inserito un testo troppo corto, scrivi una frase più lunga.");
	    	    		}	
	    	    		else {
	    	    	self.articlePut.title = input.title; 
	    	    	self.articlePut.subtitle = input.subtitle; 
	    	    	self.articlePut.text1 = input.text1; 
	    	    	self.articlePut.text2 = input.text2;
	    	    	self.articlePut.idArticleTemplate = 1; 
	    	    	
	    	    	if(input.city == undefined) {self.articlePut.city = ""}
	    	    	else { self.articlePut.city = input.city;   }
	    	    	 
	    	    	
	    	    	console.log(self.articlePut); 

	    	    	//put dell'articolo al db
	    	    	var s= apiService.updateArticle(scenId,self.newsNumber , self.articlePut);
					s.then(function(data){ 		
						 $state.go('logged.scenario.template1');
						 
					 }, function(reason){
						 
						 alertingGeneric.addWarning("Non e' stato possibile memorizzare l'articolo, riprova!");
						 console.log("Impossibile aggiornare l'articolo.")
					 })
	    	    		}
	    	    } else
	    	    	if(self.id == "2") {
	    	    		
	    	    		if(input.title.length<5 || input.title == "" || input.title == null){
	    	    			alertingGeneric.addWarning("Inserire un titolo di almeno 5 caratteri");
	    	    		} 
	    	    		
	    	    		else if (input.text1 == "" || input.text1.length<20) {
	    	    			alertingGeneric.addWarning("Hai inserito un testo troppo corto, scrivi una frase più lunga.");
	    	    		}
	    	    		
	    	    		
		    	    	self.articlePut.title = input.title; 
		    	    	self.articlePut.text1 = input.text1; 
		    	    	if(self.isUploaded == true){
		    	    			self.articlePut.imageId = self.uploadedFile.id;
		    	    			self.isUploaded == false; 
		    	    	} else 
		    	    {		
		    	    		self.articlePut.imageId = self.article.imageId; 
		    	    			
		    	    			
		    	    		}
		    	    
		    	    	self.articlePut.idArticleTemplate = 2; 
		    	    	
		    	    	if(input.city == undefined) {self.articlePut.city = ""}
		    	    	else { self.articlePut.city = input.city;   }
		    	    	console.log(self.articlePut); 

		    	    	//put dell'articolo al db
		    	    	var s= apiService.updateArticle(scenId,self.newsNumber , self.articlePut);
						s.then(function(data){ 		
							 $state.go('logged.scenario.template1');
							 
						 }, function(reason){
							 
							 alertingGeneric.addWarning("Non e' stato possibile memorizzare l'articolo, riprova!");
							 console.log("Impossibile aggiornare l'articolo.")
						 })
		    	    } 
	    	    	
	    	    	if(self.id == "3") {
	    	    
	    	    		if(input.title.length<5 || input.title == "" || input.title == null){
	    	    			alertingGeneric.addWarning("Inserire un titolo di almeno 5 caratteri");
	    	    		} else if(input.subtitle.length<5 || input.subtitle == "" ){
	    	    			alertingGeneric.addWarning("Inserire un sottitolo di almeno 5 caratteri");
	    	    			 
	    	    		} else if (input.text1 == "" || input.text1.length<20 || input.text2 == "" || input.text2.lenght<20) {
	    	    			alertingGeneric.addWarning("Hai inserito un testo troppo corto, scrivi una frase più lunga.");
	    	    		}	
	    	    		
	    	    		
		    	    	self.articlePut.title = input.title; 
		    	    	self.articlePut.subtitle = input.subtitle; 
		    	    	self.articlePut.text1 = input.text1; 
		    	    	self.articlePut.text2 = input.text2;
		    	    	self.articlePut.idArticleTemplate = 3; 
		    	    	
		    	    	if(input.city == undefined) {self.articlePut.city = ""}
		    	    	else { self.articlePut.city = input.city;   }
		    	    	 
		    	    	if(self.isUploaded == true){
	    	    			self.articlePut.imageId = self.uploadedFile.id;
	    	    			self.isUploaded == false; 
	    	    	} 	else 
	    	    		{		
	    	    		self.articlePut.imageId = self.article.imageId; 
	    	    			
	    	    			
	    	    		}
		    	    	//put dell'articolo al db
		    	    	var s= apiService.updateArticle(scenId,self.newsNumber , self.articlePut);
						s.then(function(data){ 		
							 $state.go('logged.scenario.template1');
						 }, function(reason){
							 
							 alertingGeneric.addWarning("Non e' stato possibile memorizzare l'articolo, riprova!");
							 console.log("Impossibile aggiornare l'articolo.")
						 })
		    	    }
	    	    	
	    	    	
	  	
	    	 }
	    	    
	    	    if (self.idTemplate == 2) {
	    	    	article.setArticleObject(input, self.id);
		            $state.go('logged.scenario.template2');
	    	    	
	    	    	
	    	    }
	    	    
	            /*article.setArticleObject(input, self.id);
	            $state.go('logged.scenario.template1');*/
	      
	    	    
	    	    

	       
	}
	

	

	
}]);