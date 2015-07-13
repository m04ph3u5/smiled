angular.module("smiled.application").directive("insertStatus", [ 'CONSTANTS', function(CONSTANTS){
	return {
		templateUrl: "assets/private/partials/insert-status-template.html",
		scope : {
			character: "=",
			status: "=",
			//draftNewPost : "&",
			save: "&"
		},
		bindToController: true,
		controller: ['$scope', function(){
			var self = this;
			
			if(self.status){
				console.log(self.status);
			}else{
				console.log(self.status);
			}
			
			if(self.character){
				self.showInsertStatus = true;
				console.log(self.character);
			}else{
				self.showInsertStatus = false;
				console.log(self.character);
			}
			
			self.showDatePicker = false;
			self.setDateNewPost = function(){
				self.showDatePicker = !self.showDatePicker;
			}
			
			self.savePost = function(){
				self.setDateNewPost();
				self.save();
			}

		}],
		controllerAs: "insertStatus"
	}
}]);

