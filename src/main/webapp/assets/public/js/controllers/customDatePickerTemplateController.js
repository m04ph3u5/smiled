angular.module('smiled.application').controller('customDatePickerTemplateCtrl', ['startDate', 'endDate', 'post', 'modalService',
              function customDatePickerTemplateCtrl(startDate, endDate, post, modalService){
	
	var self = this;

	self.startDate = startDate;
	self.endDate = endDate;

	var oldDateNumber = angular.copy(post.julianDayNumber);
	var oldDateString = angular.copy(post.formattedDate);
	
	self.dateNumber = post.julianDayNumber;
	self.dateString = post.formattedDate;
	
	self.updateDate = function(){
		post.julianDayNumber = self.dateNumber;
		post.formattedDate = self.dateString;
		modalService.closeModalSetHistoryDate();
	}
	
	self.cancel = function(){
		self.dateNumber = oldDateNumber;
		self.dateString = oldDateString;
		modalService.closeModalSetHistoryDate();
	}

}]);