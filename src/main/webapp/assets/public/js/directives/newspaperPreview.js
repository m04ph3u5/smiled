angular.module("smiled.application").directive("newspaperPreview", [ '$stateParams', 'apiService', 'CONSTANTS', '$state', 'article','alertingGeneric',
                                                                     function($stateParams, apiService, CONSTANTS, $state, article, alertingGeneric){
	return {
		restrict: "AE",
		templateUrl: "assets/private/partials/newspaper-preview.html",
		scope : {
			newspaper: '=?',
		},
		bindToController: true,
		controller: ['$scope', function(){
			var self = this;
			var scenId = $stateParams.id;
			self.publishedNewspapers = []; 
			self.publishedNewspaperNumber = 0;
			self.publishedNewspapers.idTemplate = 0; 
			self.articlesPreviews = [];  
			self.articles = [];
			self.article = {};
			self.isDraft; 
			self.article.idArticleTemplate = 0; 

			/*------------------- DATA FOR PREVIEWS THUMBNAILS ----------------*/


			apiService.getpublishedNewspapers(scenId).then(
					function(data) { 
						self.publishedNewspapers = data;  
						for(var i=0;  i<self.publishedNewspapers.length; i++) {
							if(self.publishedNewspapers[i].idTemplate == 1) {
								for(var j=0; j<self.publishedNewspapers[i].articles.length; j++) {
									if(self.publishedNewspapers[i].articles[j].idArticleTemplate == 3){
										self.publishedNewspapers[i].articles[j].newspaperNumber = self.publishedNewspapers[i].number; 
										self.publishedNewspapers[i].articles[j].image = CONSTANTS.urlMedia(self.publishedNewspapers[i].articles[j].imageId); 
										self.articlesPreviews.push(self.publishedNewspapers[i].articles[j]);
										
									}
									 

								}
							}

						}

					},function(reason){

						alertingGeneric.addWarning("Non è stato possibile caricare il giornale, riprova");

					}	
			); 



			self.goToNewspaper = function(newspaperNumber){
				article.setPublishedNewspaperNumber(newspaperNumber); 
				article.setIsDraft(false); 
				$state.go('logged.scenario.newspublished');


			}


		}],

		controllerAs: "newspaperPreview"

	}
}]);