angular.module("smiled.application").directive('articleOneColumn', ['article', '$state',
                                     function(article, $state){

	return {
		
		templateUrl: "assets/private/partials/article-one-column.html",
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
			self.idArticle = "6";
			self.article = article.getArticleObject(self.idArticle);
			break;
			

			default:
			console.log("ERROR" + " " + self.idTemplate);
				
			}	
			
		}
		
		
		self.loadArticle("id" + self.idTemplate);
			
		
		self.goToDraft = function(){
			
			//PROVVISORIO per caricamento dati corretti articolo 
			article.setArticleId(self.idArticle);
			$state.go('logged.scenario.draftArticleSimple');
			
		}
		
		
		
		self.closeWarning = function (s){
			
			switch (s) {
			
			case "title":
			self.showWarningTitle = false;
			break;
			
			case "col1":
			self.showWarningTextCol1 = false; 
			break;
			
			
			default:
			console.log("ERROR");
				
			}
		}
			
		
	}],
		
		controllerAs: "articleOneColumn"
		
		
	}
	
	
	
	
}]);