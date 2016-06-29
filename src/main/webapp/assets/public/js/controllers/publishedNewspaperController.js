angular.module('smiled.application').controller('publishedNewspaperCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload','notifyService','article', 'modalService', '$state', '$stateParams','alertingGeneric',
              function publishedNewspaperCtrl(CONSTANTS,$scope, apiService,Upload, notifyService, article, modalService, $state, $stateParams, alertingGeneric){
	
	var self = this; 
	self.newspaper = {};
	var scenId = $stateParams.id;
	apiService.getpublishedNewspapers(scenId).then (
			function(data) {
				self.publishedNewspapers = data; 
				self.publishedNewspaperNumber = article.getPublishedNewspaperNumber(); 
				var found = false;
				for(var i=0; !found && i<self.publishedNewspapers.length; i++) {
					if(self.publishedNewspapers[i].number == self.publishedNewspaperNumber) { 
						self.newspaper = self.publishedNewspapers[i]; 
						found = true;
						break;
					}
				}
			},function(reason){
				
				
			}	
			);
	
	self.publishedNewspapers = [];
	
	
	
}]); 