angular.module('smiled.application').controller('customDatePickerNewspaperCtrl', ['startDate', 'endDate', 'newspaper', 'modalService', 'apiService', '$stateParams', 'article',
              function customDatePickerNewspaperCtrl(startDate, endDate, newspaper, modalService, apiService, $stateParams, article){
	
	
	var self = this;
	var scenId = $stateParams.id;
	self.startDate = startDate;
	self.endDate = endDate;
	
	var oldDateString = angular.copy(newspaper.historicalDate);
	var oldDateNumber = angular.copy(newspaper.julianDayNumber);
	
	self.dateNumber = newspaper.julianDayNumber;
	self.dateString = newspaper.historicalDate;
	self.timeNumber = newspaper.timeNumber;
	
	 
	
	
	self.updateDate = function(){

		newspaper.julianDayNumber = self.dateNumber;
		newspaper.historicalDate = self.dateString;
		newspaper.timeNumber = self.timeNumber;
		self.currentNews = article.getCurrentNewspaper();
		newspaper.number = self.currentNews.number; 
		self.updateNewspaper(newspaper); 
		console.log(newspaper); 
		modalService.closeModalSetHistoryDateNewspaper();
	}
	
	self.cancel = function(){
		self.dateNumber = oldDateNumber;
		self.dateString = oldDateString;
		modalService.closeModalSetHistoryDateNewspaper();
	}
	
	
	self.updateNewspaper = function(toUpdateNewspaper){
		console.log(scenId + " " + toUpdateNewspaper.number + " " + toUpdateNewspaper.historicalDate); 
		var s = apiService.updateNewspaper(scenId, toUpdateNewspaper.number, toUpdateNewspaper); 
		console.log("UPDATE DATE OK!"); 
	}
	
	
}]);
