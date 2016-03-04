angular.module('smiled.application').controller('notificationCtrl', ['$stateParams', 'apiService', 
              function characterProfileCtrl($stateParams, apiService){
	
	var self = this;
	self.notifications = {};
	
	var getMoreRecentNotifications = function(){
		apiService.getLastUserNotifications("", 10).then(		
				function(data){
					self.notifications=data;
					
				},
				function(reason){
					console.log("problem in getLastUserNotifications");
					console.log(reason);
				}
			);
	}
	
	
	self.downloadMoreNotifications = function(){
		apiService.getLastUserNotifications(self.notifications[self.notifications.length-1].id, 10).then(		
				function(data){
					self.notifications = self.notifications.concat(data);
				},
				function(reason){
					console.log("problem in download more notifications");
					console.log(reason);
				}
			);
	}
	
	
	var onStartup = function(){
		
		getMoreRecentNotifications();
		
		
	}
	
	onStartup();
	
	

}]);