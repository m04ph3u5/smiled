angular.module("smiled.application").directive('articleTwoColumns', ['article', '$state', 'apiService', '$stateParams', 'alertingGeneric', 'modalService', 'CONSTANTS',
                                     function(article, $state, apiService, $stateParams, alertingGeneric, modalService, CONSTANTS){
	return {

		restrict: "AE",
		templateUrl: "assets/private/partials/article-two-columns.html",
		scope: {
			newspaper: '=?'
		},
		
		controller: ['$scope',function($scope){
			
			var self = this;
		
			self.showWarningTitle = false; 
			self.showWarningSubtitle = false; 
			self.showWarningTextCol1 = false; 
			self.showWarningTextCol2 = false; 
			var scenId = $stateParams.id; 
			
			self.lastNewspaper = article.getCurrentNewspaper();
		
			self.idChoosenTemplate = article.getIdCurrentTemplate(); 
			self.currentHeadline = article.getNameJustCreated(); 
			console.log(self.idChoosenTemplate); 
			//id articolo
			self.idArticle = "";
			self.idTemplate = article.getIdTemplate();
			
			self.newspaper = {}; 
			self.publishedNewspapers = [];
			self.publishedNewspapers.number = 0; 
			self.isPublished; 
			self.isJustDeleted = article.getIsJustDeleted(); 
			self.isDraft = article.getIsDraft(); 
			self.articles = []; 
			self.article = {};
			self.publishedNewsNumber = article.getPublishedNewspaperNumber(); 
			//variabile che mi serve per un controllo sul caricamento degli articoli 
			//subito dopo che un giornale è stato cancellato
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
										if(self.publishedNewspapers[i].articles[j].idArticleTemplate == 1){
											self.article = self.publishedNewspapers[i].articles[j];
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
						self.idArticle = "1";
						self.article = article.getArticleObject(self.idArticle);
						
					}

					var s = apiService.getMyLastNewspaper(scenId);
					s.then(function(data){
						
						self.newspaper = data; 
						self.articles = self.newspaper.articles;  
						 
						//non ci sono articoli scritti 
						
						if(self.articles.length == 0) {
							self.idArticle = "1";
							self.article = article.getArticleObject(self.idArticle);
						
							
						} else {
						
						//ciclo sull'array che contiene gli articoli per ricavare quello che mi interessa
						for(var i=0; i<=self.articles.length; i++){
							
							if(self.articles[i].idArticleTemplate == 1){
								self.article = self.articles[i];
								self.idArticle = "1";  
								break; 
								
							} else {			
				alertingGeneric.addWarning("Non e' stato possibile visualizzare gli articoli, ricarica la pagina.");			
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
			
			self.loadArticleFirst = function(idTemplate){
				
				switch (idTemplate) {
				case "id1":
				self.idArticle = "1";
				self.article = article.getArticleObject(self.idArticle);
				console.log(self.article);
				break;
				
				case "id2":
				self.idArticle = "7";
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
				else if(self.lastNewspaper.status == 'DRAFT')
					{
					console.log(self.idTemplate); 
					self.loadArticle(self.idTemplate);
					}
				
				
	/*			var s = apiService.getMyLastNewspaper(scenId); 
				s.then(function(data){
						self.lastNewspaper = data; 	
						if(self.lastNewspaper.status == undefined) {
							self.loadArticleFirst("id"+self.idChoosenTemplate);		
						}
						else if(self.lastNewspaper.status == 'DRAFT' || oldName == self.lastNewspaper.name)
							{
							console.log(self.idTemplate); 
							self.loadArticle(self.idTemplate);
							}
				},function(reason){	
				}
		)*/		
			}
			
			if($state.current.name == 'logged.scenario.newspublished'){
				self.isPublished = true;
				if(self.publishedNewsNumber  != null || self.publishedNewsNumber  != undefined)  {
				self.loadArticlePublished(self.publishedNewsNumber); 
							
			}		
			}
			//vai alle bozze
			self.goToDraft = function(){
				
				//controllo se un nome è già stato assegnato per la creazione del giornale oppure no 
				self.currentHeadline = article.getNameJustCreated();   
				if(self.currentHeadline == "" && self.newspaper.status == undefined){
					modalService.showAlertNewspaper();
			
				} 
				
			 else {
					article.setArticleId(self.idArticle);
					$state.go('logged.scenario.draftArticle2col');
					
				}
				
			}
		
			//chiusura warning 
			self.closeWarning = function (s){
				
				switch (s) {
				
				case "title":
				self.showWarningTitle = false;
				break;
				
				case "subtitle":
				self.showWarningSubtitle = false;
				break;
				
				case "col1":
				self.showWarningTextCol1 = false; 
				break;
				
				case "col2":
				self.showWarningTextCol2 = false;
				break;
				
				default:
				console.log("ERROR");
					
				}
			}
			
			
			
		}],
		
		controllerAs: "articleTwoColumns",
		link : function(scope,elem,attrs,ctrl){
			
		
			
			/*controllo testo titolo */
			scope.$watch('articleTwoColumns.article.title', function(newVal, oldVal){
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
			
			
			
			/*controllo testo sottotitolo */
			
			scope.$watch('articleTwoColumns.article.subtitle', function(newVal, oldVal){
				if(newVal){	
				if(newVal.length>27) {
					ctrl.showWarningSubtitle = true;
					console.log ("ATTENZIONE");
			
				} else
					{
					ctrl.showWarningTextCol1= false; 
					console.log ("VA BENE");
					
					}
				
				}
				});
			
			/*controllo testo prima colonna */
			
			scope.$watch('articleTwoColumns.article.text1', function(newVal, oldVal){
				if(newVal){	
				if(newVal.length>682) {
					ctrl.showWarningTextCol1 = true;
					console.log ("ATTENZIONE");
			
				} else
					{
					ctrl.showWarningTextCol1= false; 
					console.log ("VA BENE");
					
					}
				
				}
				});

			/*controllo testo seconda colonna */
			
			scope.$watch('articleTwoColumns.article.text2', function(newVal, oldVal){
				if(newVal){	
				if(newVal.length>682) {
					ctrl.showWarningTextCol2 = true;
					console.log ("ATTENZIONE");
			
				} else
					{
					ctrl.showWarningTextCol2= false; 
					console.log ("VA BENE");
					
					}
				
				}
				});
			
		}


} 
}]);