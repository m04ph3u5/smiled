angular.module("smiled.application").directive('articleTwoColumnsImg', ['article', '$state','apiService','$stateParams', 'alertingGeneric','CONSTANTS', 
                                     function( article, $state, apiService, $stateParams, alertingGeneric, CONSTANTS){
	return {

		restrict: "AE",
		templateUrl: "assets/private/partials/article-two-columns-img.html",
		scope: {
			
			newspaper: '=?'
		},
		
		controller: ['$scope',function($scope){
			
			var self = this;
			var scenId = $stateParams.id;
			self.showWarningTitle = false; 
			self.showWarningTextCol1 = false; 
			self.showWarningTextCol2 = false; 
			self.showWarningSubtitle = false; 
			/*self.article = article.getArticleObject(self.id);*/
			self.idChoosenTemplate = article.getIdCurrentTemplate(); 
			self.idTemplate = article.getIdTemplate();
			self.currentHeadline = article.getNameJustCreated();
			self.isImage = true; 
			self.lastNewspaper = article.getCurrentNewspaper(); 
			//initialize variables 
			self.idArticle = "";
			self.newspaper = {}; 
			self.articles = []; 
			self.article = {};
			
			var oldName = angular.copy(self.lastNewspaper.name);

			/*----------------------  GET ARTICLE  ---------------------*/
			
			
			
			self.loadArticle = function(idTemplate) { 
				switch (idTemplate) {
				
				//se template 1 carico articolo relativo a quel template
				case 1:
					//caso di cancellazione appena avvenuta
					if(oldName == self.lastNewspaper.name){
						self.idArticle = "3";
						self.article = article.getArticleObject(self.idArticle);
						console.log(self.article);	
					}

					var s = apiService.getMyLastNewspaper(scenId);
					s.then(function(data){
						
						self.newspaper = data; 
						self.articles = self.newspaper.articles;  
						 
						//non ci sono articoli scritti 
						
						if(self.articles.length == 0) {
							console.log("PASSO DI QUI"); 
							self.idArticle = "3";
							self.article = article.getArticleObject(self.idArticle);
							console.log(self.article);	
							
						} else {
						
						//ciclo sull'array che contiene gli articoli per ricavare quello che mi interessa
						for(var i=0; i<=self.articles.length; i++){
							
							if(self.articles[i].idArticleTemplate == 3){
								console.log(self.articles[i].idArticleTemplate + "CIAAAAO"); 
								self.article = self.articles[i];
								self.article.image = CONSTANTS.urlMedia(self.article.imageId);
								console.log(self.article.image); 
								self.idArticle = "3";
								console.log("PASSO DI QUAA");  
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
				
				console.log("SONO STATO CHIAMATO"); 
				switch (idTemplate) {
				case "id1":
				self.idArticle = "3";
				self.article = article.getArticleObject(self.idArticle);
				console.log(self.article);
				break;
				
				case "id2":
					
				break;
				

				default:
				console.log("ERROR" + " " + self.idTemplate);
				}
			}

			//caricamento template in base all'esistenza o meno di un giornale in bozza 
			if(self.lastNewspaper.status == undefined) {
				self.loadArticleFirst("id"+self.idChoosenTemplate);		
			} 
			else if(self.lastNewspaper.status == 'DRAFT' || oldName == self.lastNewspaper.name)
				{
				console.log(self.idTemplate); 
				self.loadArticle(self.idTemplate);
				}
			
			
			
			
			self.goToDraft = function(){
				
				article.setArticleId(self.idArticle);
				$state.go('logged.scenario.draftArticle2col');	
			}
			

	self.closeWarning = function (s){
				
				switch (s) {
				
				case "title":
				self.showWarningTitle = false;
				break;
				
				case "subtitle":
				self.showWarningSubtitle = false;
				console.log ("CHIUDI!");
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
	
		/*----------------------  LINK FUNCTION - WATCH ON CHARACTERS  ---------------------*/
		
		
		controllerAs: "articleTwoColumnsImg",
		link : function(scope,elem,attrs,ctrl){
			/*controllo titolo */
			scope.$watch('articleTwoColumnsImg.article.title', function(newVal, oldVal){
				if(newVal){	
			if(newVal.length>28) {
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
			
			scope.$watch('articleTwoColumnsImg.article.subtitle', function(newVal, oldVal){
				if(newVal){	
				if(newVal.length>26) {
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
			
			scope.$watch('articleTwoColumnsImg.article.text1', function(newVal, oldVal){
				if(newVal){	
				if(newVal.length>594) {
					ctrl.showWarningTextCol1 = true;
					console.log ("ATTENZIONE");
			
				} else
					{
					ctrl.showWarningTextCol1= false; 
					console.log ("VA BENE");
					
					}
				
				}
				});
			
			
			scope.$watch('articleTwoColumnsImg.article.text2', function(newVal, oldVal){
				if(newVal){	
				if(newVal.length>594) {
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
