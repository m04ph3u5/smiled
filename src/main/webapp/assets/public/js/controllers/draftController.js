angular.module('smiled.application').controller('draftCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','notifyService','$state','article', '$stateParams', 'alertingGeneric',
                                                              function draftCtrl(CONSTANTS,$scope, apiService,Upload, notifyService, $state, article, $stateParams, alertingGeneric){

	var self = this; 
	var scenId = $stateParams.id;
	//settaggio id da service - verrà preso dal DB
	self.id = article.getArticleId(); 
	if(self.id == null || self.id == 0){
		$state.go('logged.scenario.template1');	
	}

	/*self.newsNumber = article.getNumberNewspaper();*/

	self.idCurrentTemplate = article.getIdCurrentTemplate();
	//TODO CHECK
	 
	self.idPublishedTemplate = article.getIdPublishedTemplate(); 
	self.isChecked = false;
	self.isCityChecked = false; 
	self.isUploaded = false;
	self.isChanged == false;
	self.isEditing; 
	self.articles = []; 
	self.article = {};
	self.article.image = null;
	self.oldIdImage;  
	self.articlePut = {}; 

	self.publishedNewspaperNumber = article.getPublishedNewspaperNumber();

	/*----------------------  GET ARTICLE ACCORDING TO ARTICLE ID AND IF PUBLISHED OR DRAFT   ---------------------*/

	var getArticlePublishedObject = function (id) {
		apiService.getpublishedNewspapers(scenId).then (
				function(data) {
					self.publishedNewspapers = data;  
					self.idTemplate = data.idTemplate;
					var found = false;
					for(var i=0;  !found && i<self.publishedNewspapers.length; i++) { 
						if(self.publishedNewspapers[i].number == self.publishedNewspaperNumber) { 
							for(var j=0; j<self.publishedNewspapers[i].articles.length; j++) {
								self.newspaper = self.publishedNewspapers[i]; 

								if(self.publishedNewspapers[i].articles[j].idArticleTemplate == id){
									self.article = self.publishedNewspapers[i].articles[j];

									self.article.image = CONSTANTS.urlMedia(self.publishedNewspapers[i].articles[j].imageId); 
									console.log(self.article); 
									found = true;
									break; 

								}
							}

						}

					}
				}
				,function(reason){	
				}	
		);


	}

	var getArticleObject = function(id) {

		var s = apiService.getMyLastNewspaper(scenId);
		s.then(function(data){
			self.idTemplate = data.idTemplate;
			self.newspaper = data; 
			self.articles = self.newspaper.articles;  

			if(self.articles.length == 0) {
				self.article = article.getArticleObject(self.id);
				console.log(self.article);	

			} else {

				for(var i=0; i<self.articles.length; i++){
					if(self.articles[i].idArticleTemplate == id){
						self.article = self.articles[i]; 

						self.oldIdImage = angular.copy(self.article.imageId);

						if(self.oldIdImage == null) {

							self.article.image = null; 

						} else


						{
							self.article.image = CONSTANTS.urlMedia(self.article.imageId);


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


	self.getArticleDraft = function() {
		self.isEditing = article.getIsEditing(); 
		if(self.isEditing && self.idPublishedTemplate == 1){

			if(self.id == 1){
				getArticlePublishedObject(1); 
			} else
				if (self.id == 2) {
					getArticlePublishedObject(2);	
				} else
					if (self.id == 3) {
						getArticlePublishedObject(3);
					}

		} else {

			if(self.id == 1){
				getArticleObject(1); 
			} else
				if (self.id == 2) {
					getArticleObject(2);	
				} else
					if (self.id == 3) {
						getArticleObject(3);
					}

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

		if(self.idTemplate == 1 || self.idPublishedTemplate == 1) {

			if(self.id == 1) {

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


					if(self.isEditing){

						article.setIsEditing(false); 

						//put dell'articolo al db
						var s= apiService.updateArticle(scenId,self.publishedNewspaperNumber , self.articlePut);
						s.then(function(data){ 	

							$state.go('logged.scenario.editorial');

						}, function(reason){

							alertingGeneric.addWarning("Non e' stato possibile memorizzare l'articolo, riprova!");
							console.log("Impossibile aggiornare l'articolo.")
						})	

					} else {

						var s = apiService.getMyLastNewspaper(scenId); 
						s.then(function(data){
							self.newsNumber  = data.number; 
							var n= apiService.updateArticle(scenId,self.newsNumber , self.articlePut);
							n.then(function(data){ 		
								$state.go('logged.scenario.template1');

							}, function(reason){

								alertingGeneric.addWarning("Non e' stato possibile memorizzare l'articolo, riprova!");
								console.log("Impossibile aggiornare l'articolo.")
							})	


						},function(reason){

							console.log("Errore.");	
						}
						)




					}

				}
			} else
				if(self.id == 2) {

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



					if(self.isEditing){

						article.setIsEditing(false); 
						console.log(self.publishedNewspaperNumber); 
						//put dell'articolo al db
						var s= apiService.updateArticle(scenId,self.publishedNewspaperNumber , self.articlePut);
						s.then(function(data){ 	

							$state.go('logged.scenario.editorial');

						}, function(reason){

							alertingGeneric.addWarning("Non e' stato possibile memorizzare l'articolo, riprova!");
							console.log("Impossibile aggiornare l'articolo.")
						})	

					} else {

						//put dell'articolo al db
						var s = apiService.getMyLastNewspaper(scenId); 
						s.then(function(data){
							self.newsNumber  = data.number; 
							var n= apiService.updateArticle(scenId,self.newsNumber , self.articlePut);
							n.then(function(data){ 		
								$state.go('logged.scenario.template1');

							}, function(reason){

								alertingGeneric.addWarning("Non e' stato possibile memorizzare l'articolo, riprova!");
								console.log("Impossibile aggiornare l'articolo.")
							})	


						},function(reason){

							console.log("Errore.");	
						}
						)

					}
				} 

			if(self.id == 3) {

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



				if(self.isEditing){
					article.setIsEditing(false); 
					//put dell'articolo al db
					var s= apiService.updateArticle(scenId,self.publishedNewspaperNumber , self.articlePut);
					s.then(function(data){ 	

						$state.go('logged.scenario.editorial');

					}, function(reason){

						alertingGeneric.addWarning("Non e' stato possibile memorizzare l'articolo, riprova!");
						console.log("Impossibile aggiornare l'articolo.")
					})	

				} else {

					var s = apiService.getMyLastNewspaper(scenId); 
					s.then(function(data){
						self.newsNumber  = data.number; 
						var n= apiService.updateArticle(scenId,self.newsNumber , self.articlePut);
						n.then(function(data){ 		
							$state.go('logged.scenario.template1');

						}, function(reason){

							alertingGeneric.addWarning("Non e' stato possibile memorizzare l'articolo, riprova!");
							console.log("Impossibile aggiornare l'articolo.")
						})	


					},function(reason){

						console.log("Errore.");	
					}
					)
				}	


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