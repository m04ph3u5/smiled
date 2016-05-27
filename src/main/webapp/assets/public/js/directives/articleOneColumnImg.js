angular.module("smiled.application").directive('articleOneColumnImg', ['article', '$state',
                                     function(article, $state){
	return {

		restrict: "AE",
		templateUrl: "assets/private/partials/article-one-column-img.html",
		//isolated scope 
		scope: {
			
			
		},
		
		controller: ['$scope',function($scope){
			
			var self = this;
			self.showWarningTitle = false; 
			self.showWarningText = false; 
			self.idTemplate = article.getIdCurrentTemplate();
			self.idArticle = "";
			self.article = {};
			self.isSubtitle = false;

			
			self.loadArticle = function(idTemplate) {
				
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
			
			self.loadArticle("id" + self.idTemplate);
			 
			
		
			self.goToDraft = function(){
				
				//PROVVISORIO per caricamento dati articolo 
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
			
			
			
			scope.$watch('articleOneColumnImg.article.text', function(newVal, oldVal){
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
