angular.module("smiled.application").directive('articleTwoColumnsImg', ['article', '$state','apiService','$stateParams', 'alertingGeneric','CONSTANTS','modalService', 
                                                                        function( article, $state, apiService, $stateParams, alertingGeneric, CONSTANTS, modalService){
	return {

		restrict: "AE",
		templateUrl: "assets/private/partials/article-two-columns-img.html",
		scope: {
			
			newspaper: "=?"
		},

		controller: ['$scope',function($scope){

			var self = this;
			var scenId = $stateParams.id;
			self.showWarningTitle = false; 
			self.showWarningTextCol1 = false; 
			self.showWarningTextCol2 = false; 
			self.showWarningSubtitle = false; 
			self.idChoosenTemplate = article.getIdCurrentTemplate(); 
			
			self.currentHeadline = article.getNameJustCreated();
			self.isImage = true; 
			self.idArticle = 0;

			self.newspaper = {}; 
			self.publishedNewspapers = [];
			self.publishedNewspapers.number = 0; 
			self.publishedNewsNumber = article.getPublishedNewspaperNumber();
			self.isPublished;
			self.isJustDeleted = article.getIsJustDeleted();
			self.isDraft = article.getIsDraft(); 
			self.isFirst; 
			self.articles = []; 
			self.article = {};

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
										if(self.publishedNewspapers[i].articles[j].idArticleTemplate == 3){
											self.newspaper = self.publishedNewspapers[i]; 
											self.article = self.publishedNewspapers[i].articles[j];
											self.article.image = CONSTANTS.urlMedia(self.publishedNewspapers[i].articles[j].imageId); 
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

			/*--------------------------------------- GET ARTICLE  ----------------------------------------------*/



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
							self.idArticle = 3;
							article.setArticleObject(self.idArticle);
							self.article = article.getArticleObject(self.idArticle);


						} else {

							//ciclo sull'array che contiene gli articoli per ricavare quello che mi interessa
							for(var i=0; i<self.articles.length; i++){
								if(self.articles[i].idArticleTemplate == 3){
									self.article = self.articles[i];
									
									if(self.article.imageId == null) {
										self.article.image = null; 
									} else {
										
										self.article.image = CONSTANTS.urlMedia(self.article.imageId); 	
										
									}

									self.idArticle = 3;  
									break; 

								} else {			
									self.idArticle = 3;
									article.setArticleObject(self.idArticle);
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

			self.loadArticleFirst = function(idTemplate){
				self.isFirst = true; 
				switch (idTemplate) {
				case "id1":
					self.idArticle = 3;
					article.setArticleObject(self.idArticle);
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


			if($state.current.name == 'logged.scenario.template1') {
				self.isPublished = false; 
				if($scope.newspaper.status == undefined && self.isDraft == false || $scope.newspaper.status  == 'PUBLISHED' 
					|| self.isJustDeleted == true && self.isDraft == false ) {
					self.loadArticleFirst("id"+self.idChoosenTemplate);		
				} 
				else if($scope.newspaper.status == 'DRAFT'  || oldName == $scope.newspaper.name)
				{
					article.getIdTemplate().then(
						function(data){
							self.idTemplate = data;
							console.log(self.idTemplate); 
							self.loadArticle(self.idTemplate);
						},
						function(reason) {
							console.log(reason);
						}
					);
				}
			}

			if($state.current.name == 'logged.scenario.newspublished'){
				self.isPublished = true; 
				if(self.publishedNewsNumber  != null || self.publishedNewsNumber  != undefined)  {
					self.loadArticlePublished(self.publishedNewsNumber); 

				}		
			}

			self.goToDraft = function(){
				//controllo se un nome è già stato assegnato per la creazione del giornale oppure no 

				self.currentHeadline = article.getNameJustCreated();  

				if(self.currentHeadline == "" && $scope.newspaper.status == undefined || self.isJustDeleted == true){
					//modalService.showModalCreateTitle(self.newspaper);
					modalService.showAlertNewspaper();
				} else {
					article.setArticleId(self.idArticle);
					$state.go('logged.scenario.draftArticle2col');
				}		
			}


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
