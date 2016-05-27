angular.module("smiled.application").directive('articleColumnImage', ['article', '$state',
                                     function(article, $state){
	
	return {
		
		templateUrl: "assets/private/partials/article-column-image.html",
		restrict: "E",
		scope: {
			
			
		},
		
		controller: ['$scope',function($scope){
			var self = this;
			self.idTemplate = article.getIdCurrentTemplate();
			self.article = {};
			
			self.loadArticle = function(idTemplate) {
				
				switch (idTemplate) {
				case "id2":
				self.idArticle = "5";
				self.article = article.getArticleObject(self.idArticle);
				console.log("ERROR" + " " + self.idTemplate);
				console.log(self.article);
				break;
				

				default:
				console.log("ERROR" + " " + self.idTemplate);
					
				}	
				
			}
			
			
			self.loadArticle("id" + self.idTemplate);
			
			self.goToDraft = function (){
				
				//PROVVISORIO per caricamento dati corretti articolo 
				article.setArticleId(self.idArticle);
				$state.go('logged.scenario.draftArticleSimple');
				console.log(self.idArticle + "ID-ARTICLE");
				
			}
		}],
		
		controllerAs: "articleColumnImage"
		
		
	}
	
	
	
}]);