angular.module("smiled.application").directive("alertArticle", [ 
                                                              function(){
                         	return {
                         		restrict: 'E',
                         		templateUrl: "assets/public/partials/alertArticle.html",
                         		scope : {
                         			 message: '=',
                         				
                         			
                         		},
                         		bindToController: true,
                         		controller: ['$scope', function($scope){
                         			var self = this;
                         			self.messageTitle = "Attento, titolo troppo lungo";
                         			
                         		}],
                         		
                         		controllerAs: "alertArticle"
                         		
                         	}
                         }]);