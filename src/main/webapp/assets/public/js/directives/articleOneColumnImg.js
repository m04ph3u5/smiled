angular.module("smiled.application").directive('articleOneColumnImg', ['article', '$state', 'apiService', '$stateParams','alertingGeneric', 'CONSTANTS', 'modalService',
                                     function(article, $state, apiService, $stateParams,alertingGeneric, CONSTANTS, modalService){
	return {

		restrict: "AE",
		templateUrl: "assets/private/partials/article-one-column-img.html",
		//isolated scope 
		scope: {
			
			newspaper: '=?'
			
		},
		
		controller: ['$scope',function($scope){
			
			var self = this;
			var scenId = $stateParams.id;
			self.showWarningTitle = false; 
			self.showWarningText = false;  
			self.idArticle = "";
			self.article = {};
			self.isSubtitle = false;
			self.currentHeadline = {}; 
			self.idChoosenTemplate = article.getIdCurrentTemplate(); 
			self.idTemplate = article.getIdTemplate();
			self.isImage = true; 
			self.lastNewspaper = article.getCurrentNewspaper(); 
			
			console.log(self.idChoosenTemplate + "PROVA"+ self.idTemplate); 
			
			//initialize variable
			self.newspaper = {}; 
			self.publishedNewspapers = [];
			self.publishedNewspapers.number = 0; 
			self.publishedNewsNumber = article.getPublishedNewspaperNumber(); 
			self.isPublished; 
			self.isJustDeleted = article.getIsJustDeleted(); 
			self.articles = []; 
			self.article = {};
			/*var oldName = angular.copy(self.lastNewspaper.name);*/
			var oldName = angular.copy(self.lastNewspaper.name);
			
			/*-------------------------- ARTICOLO PER GIORNALE PUBBLICATO ---------------------------------*/			
			self.loadArticlePublished = function(newsNumber){
				apiService.getpublishedNewspapers(scenId).then (
						function(data) {
							self.publishedNewspapers = data;  
							var found = false;
							for(var i=0;  !found && i<self.publishedNewspapers.length; i++) { 
								if(self.publishedNewspapers[i].number == newsNumber) { 
									for(var j=0; i<self.publishedNewspapers[i].articles.length; j++) {
										if(self.publishedNewspapers[i].articles[j].idArticleTemplate == 2){
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
			
			/*-------------------------- ARTICOLO PER GIORNALE IN BOZZA ---------------------------------*/
			//GET article 
			self.loadArticle = function(idTemplate) { 
				switch (idTemplate) {
				
				//se template 1 carico articolo relativo a quel template
				case 1:
					//caso di cancellazione appena avvenuta
					if(oldName == self.lastNewspaper.name){ 
						self.idArticle = "2";
						self.article = article.getArticleObject(self.idArticle);
						console.log(self.article);	
					}

					var s = apiService.getMyLastNewspaper(scenId);
					s.then(function(data){
						
						self.newspaper = data; 
						self.articles = self.newspaper.articles;  
						 
						//se non ci sono articoli scritti 
						
						if(self.articles.length == 0) {
							self.idArticle = "2";
							self.article = article.getArticleObject(self.idArticle);
	
							
						} else {
						
							//ciclo sull'array che contiene gli articoli per ricavare quello che mi interessa
							for(var i=0; i<self.articles.length; i++){
								if(self.articles[i].idArticleTemplate == 2){
									self.article = self.articles[i];
									self.article.image = CONSTANTS.urlMedia(self.article.imageId);
									console.log(self.article.imageId); 
									self.idArticle = "2";  
									break; 
									
								} else {
									
									self.idArticle = "2";
									self.article = article.getArticleObject(self.idArticle);
								
								}
					
							}
					}
						},
						
					  function(reason){
					
						console.log("Errore recupero articolo.");	
					}
			)
				break; //fine case 1	
				
					
				case 2:
					
					self.idArticle = "7";
					self.article = article.getArticleObject(self.idArticle);	
					break;
					
					
				default:
					console.log("ERROR" + " " + self.idTemplate);	
				}	
				
			}
			

			
			self.loadArticleFirst = function(idTemplate) {
				switch (idTemplate) {
				case "id1":
				
				self.idArticle = "2"
				self.article = article.getArticleObject(self.idArticle);
				break;
				
				case "id2":
				
				self.idArticle = "4";
				self.article = article.getArticleObject(self.idArticle);
				break;

				default:
				console.log("ERROR" + " " + self.idTemplate);
					
				}	
				
			}

			
			
			//caricamento template in base all'esistenza o meno di un giornale in bozza 
			
			if($state.current.name == 'logged.scenario.template1') {
				self.isPublished = false; 
			if(self.lastNewspaper.status == undefined || self.lastNewspaper.status  == 'PUBLISHED' || self.isJustDeleted == true) {
				
				self.loadArticleFirst("id"+self.idChoosenTemplate);		
			} 
			else if(self.lastNewspaper.status == 'DRAFT' || oldName == self.lastNewspaper.name)
				{
				console.log(self.idTemplate); 
				self.loadArticle(self.idTemplate);
				}
		
			}
			
			
			if($state.current.name == 'logged.scenario.newspublished'){
				self.isPublished = true; 
				if(self.publishedNewsNumber  != null || self.publishedNewsNumber  != undefined)  {
				self.loadArticlePublished(self.publishedNewsNumber); 
							
			}		
			}
			
			
	
			self.goToDraft = function(){
				
				
				self.currentHeadline = article.getNameJustCreated();  
				 
				if(self.currentHeadline == "" && self.newspaper.status == undefined){
					//modalService.showModalCreateTitle(self.newspaper);
					modalService.showAlertNewspaper();
				} else {
					
					console.log(self.idArticle); 
					article.setArticleId(self.idArticle);
					$state.go('logged.scenario.draftArticleSimple');
					
				}
				
				
			}
			
			
			self.closeWarning = function (s){
				
				switch (s) {
				
				case "title":
				self.showWarningTitle = false;
				break;
				
				case "text":
				self.showWarningText = false; 
				break;
				
				default:
				console.log("ERROR");
					
				}
			}
			
			
			
		}],
		
		controllerAs: "articleOneColumnImg",
		link : function(scope,elem,attrs,ctrl){
			/*controllo titolo */
			scope.$watch('articleOneColumnImg.article.title', function(newVal, oldVal){
				if(newVal){	
			if(newVal.length>25) {
				ctrl.showWarningTitle = true;
				console.log ("ATTENZIONE");
				
			} else
				{
				ctrl.showWarningTitle = false; 
				console.log ("VA BENE");
				
				}
				}
			
			});	
			
			
			
			scope.$watch('articleOneColumnImg.article.text1', function(newVal, oldVal){
				if(newVal){	
				if(newVal.length>1159) {
					ctrl.showWarningText = true;
					console.log ("ATTENZIONE");
			
				} else
					{
					ctrl.showWarningText = false; 
					console.log ("VA BENE");
					
					}
				
				}
				});
			
	
			
		}


} 
}]);
