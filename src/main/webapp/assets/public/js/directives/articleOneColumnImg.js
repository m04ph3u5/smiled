angular.module("smiled.application").directive('articleOneColumnImg', ['article', '$state', 'apiService', '$stateParams','alertingGeneric', 'CONSTANTS',
                                     function(article, $state, apiService, $stateParams,alertingGeneric, CONSTANTS){
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
			self.idChoosenTemplate = article.getIdCurrentTemplate(); 
			self.idTemplate = article.getIdTemplate();
			self.currentHeadline = article.getNameJustCreated();
			self.isImage = true; 
			self.lastNewspaper = article.getCurrentNewspaper(); 
			
			console.log(self.idChoosenTemplate + "PROVA"+ self.idTemplate); 
			
			//initialize variable
			self.newspaper = {}; 
			self.articles = []; 
			self.article = {};
			//variabile che mi serve per un controllo sul caricamento degli articoli 
			//subito dopo che un giornale è stato cancellato
			/*var oldName = angular.copy(self.lastNewspaper.name);*/
			var oldName = angular.copy(self.lastNewspaper.name);
			
			
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
							for(var i=0; i<=self.articles.length; i++){
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
				console.log("dovrei passare di qui"); 
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
			if(self.lastNewspaper.status == undefined) {
				
				self.loadArticleFirst("id"+self.idChoosenTemplate);		
			} 
			else if(self.lastNewspaper.status == 'DRAFT' || oldName == self.lastNewspaper.name)
				{
				console.log(self.idTemplate); 
				self.loadArticle(self.idTemplate);
				}
			
	
			self.goToDraft = function(){
				
				console.log(self.idArticle); 
				article.setArticleId(self.idArticle);
				$state.go('logged.scenario.draftArticleSimple');
				
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
