angular.module("smiled.application").directive('articleTwoColumns', ['article', '$state', 'apiService', '$stateParams', 'alertingGeneric', 'modalService', 'CONSTANTS', 'userService',
                                     function(article, $state, apiService, $stateParams, alertingGeneric, modalService, CONSTANTS, userService){
	return {

		restrict: "AE",
		templateUrl: "assets/private/partials/article-two-columns.html",
		scope: {
			loggedUser: '=?',
			scenario: '=?',
			newspaper: "=?"
		},
		
		controller: ['$scope',function($scope){
			
			var self = this;
		
			self.showWarningTitle = false; 
			self.showWarningSubtitle = false; 
			self.showWarningTextCol1 = false; 
			self.showWarningTextCol2 = false; 
			var scenId = $stateParams.id; 
			
			/*self.lastNewspaper = article.getCurrentNewspaper();*/
			
			self.idChoosenTemplate = article.getIdCurrentTemplate(); 
			self.currentHeadline = article.getNameJustCreated(); 
			console.log(self.idChoosenTemplate); 
			self.idArticle = 0;
			/*self.idTemplate = article.getIdTemplate();*/
			
			/*self.newspaper = {};*/ 
			self.publishedNewspapers = [];
			self.publishedNewspapers.number = 0; 
			self.isPublished; 
			self.isJournalist; 
			self.isFirst; 
			self.isJustDeleted = article.getIsJustDeleted(); 
			self.isDraft = article.getIsDraft(); 
			self.articles = []; 
			self.article = {};
			self.publishedNewsNumber = article.getPublishedNewspaperNumber(); 
			//variabile che mi serve per un controllo sul caricamento degli articoli 
			//subito dopo che un giornale è stato cancellato
			var oldName = angular.copy($scope.newspaper.name); 
			
			
		
	/*-------------------------- ARTICOLO PER GIORNALE PUBBLICATO ---------------------------------*/

			self.loadArticlePublished = function(newsNumber){
				
				apiService.getpublishedNewspapers(scenId).then (
						
						function(data) {
							self.publishedNewspapers = data;
							var found = false;
							for(var i=0;  !found && i<self.publishedNewspapers.length; i++) { 
								if(self.publishedNewspapers[i].number == newsNumber) {
									for(var j=0; j<self.publishedNewspapers[i].articles.length; j++) {
										if(self.publishedNewspapers[i].articles[j].idArticleTemplate == 1){
											self.article = self.publishedNewspapers[i].articles[j];
											self.article.author = self.publishedNewspapers[i].articles[j].user.firstname + " " + self.publishedNewspapers[i].articles[j].user.lastname; 
											
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

					var s = apiService.getMyLastNewspaper(scenId);
					s.then(function(data){

						self.newspaper = data; 
						self.articles = self.newspaper.articles;  

						//non ci sono articoli scritti 

						if(self.articles.length == 0) {
							self.idArticle = 1;
							article.setArticleObject(self.idArticle);
							self.article = article.getArticleObject(self.idArticle);


						} else {

							//ciclo sull'array che contiene gli articoli per ricavare quello che mi interessa
							for(var i=0; i<self.articles.length; i++){

								if(self.articles[i].idArticleTemplate == 1){
									self.article = self.articles[i];
									self.idArticle = 1;  
									break; 

								} else {	
									
									self.idArticle = 1; 
									article.setArticleObject(self.idArticle);
									self.article = article.getArticleObject(self.idArticle);
											
								}

							}
						}
					},

					function(reason){
						$state.go("logged.scenario.editorial"); 
						console.log("Errore recupero articolo.");	
					}
					)
					break; 	


				case 2:
					self.idArticle = "7";
					self.article = article.getArticleObject(self.idArticle);	
					break;


				default:
					console.log("ERROR" + " " + self.idTemplate);	
				}


			}
			
			self.loadArticleFirst = function(idTemplate){
				self.isFirst = true; 
				switch (idTemplate) {
				case "id1":
					self.idArticle = 1;
					article.setArticleObject(self.idArticle);
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

				console.log(self.isDraft); 
				if($scope.newspaper.status == undefined && self.isDraft == false || 
					$scope.newspaper.status  == 'PUBLISHED' || self.isJustDeleted == true && self.isDraft == false ) {
					self.loadArticleFirst("id"+self.idChoosenTemplate);		
				} 
				
				
				else if($scope.newspaper.status == 'DRAFT' || self.isDraft == true)
					
				{
					var s = apiService.getMyLastNewspaper(scenId); 
					s.then(function(data){
						self.idTemplate = data.idTemplate;  
						console.log("PASSO DI QUI PER SCARICARE ARTICOLO"); 
						self.loadArticle(self.idTemplate);
					},function(reason){
					
						console.log("Errore.");	
					}
			)
					
				
				}	
			}
			
			if($state.current.name == 'logged.scenario.newspublished'){
				console.log("PASSO DI QUI, GIORNALE PUBBLICATO"); 
				self.isPublished = true;
				if(self.publishedNewsNumber  != null || self.publishedNewsNumber  != undefined)  {
					console.log("PASSO DI QUI PER CHIAMARE IL METODO DI CARICAMENTO" + self.publishedNewsNumber); 
					self.loadArticlePublished(self.publishedNewsNumber); 

				}		
			}
			//vai alle bozze
			self.goToDraft = function(){
				//controllo se un nome è già stato assegnato per la creazione del giornale oppure no 
				self.currentHeadline = article.getNameJustCreated(); 
			
				if(self.currentHeadline == "" && $scope.newspaper.status == undefined || self.isJustDeleted == true){
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
