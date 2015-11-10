angular.module("smiled.application").directive('editDraftPost',[ 'apiService', 'CONSTANTS', 'modalService',
    function(apiService, CONSTANTS, modalService){
		return {
			templateUrl: "assets/private/partials/edit-draft-post-directive.html",
			scope : {
				post : "=",
				user : "="
			},
			controller : ['$scope' , function($scope){
				var self = this;
				self.scenario = {};
				self.date={};				
				self.realDateFormat = CONSTANTS.realDateFormatWithHour;
				apiService.getScenario(self.post.scenarioId).then(
						function(data){
							self.scenario = data;
							self.startDate = angular.copy(self.scenario.history.startDate);
							if(!self.startDate.afterChrist)
								self.startDate.year*=-1;
							self.endDate = angular.copy(self.scenario.history.endDate);
							if(!self.endDate.afterChrist)
								self.endDate.year*=-1;
						},
						function(reason){
							console.log("Impossibile recuperare lo scenario");
							console.log(reason);
						}
				);
				
				var getMonthString = function(month){
					return CONSTANTS.monthString(month);
				} 

				var julianNumberToDate = function(jd, date){
					var l = jd + 68569;
					var n = parseInt(( 4 * l ) / 146097);
					l = l - parseInt(( 146097 * n + 3 ) / 4);
					var i = parseInt(( 4000 * ( l + 1 ) ) / 1461001);
					l = l - parseInt(( 1461 * i ) / 4) + 31;
					var j = parseInt(( 80 * l ) / 2447);
					date.day = l - parseInt(( 2447 * j ) / 80);
					l = parseInt(j / 11);
					date.month = j + 2 - ( 12 * l );
					date.year = 100 * ( n - 49 ) + i + l;
					date.dow = jd%7;
				}
				
				
				var getTimeToSeconds=function(timeNumber,t){
	        		t.hours=parseInt(timeNumber/3600);
	        		timeNumber=timeNumber%3600;
	        		t.minutes=parseInt(timeNumber/60);
	        		timeNumber=timeNumber%60;
	        		t.seconds=timeNumber;
	        	}
				
				self.updateDate = function(){
					modalService.showModalSetHistoryDate(self.startDate, self.endDate, self.post);
				}
				
				self.formatDate = function(jd, timeNumber){
					julianNumberToDate(jd, self.date);
					var era = self.date.year > 0 ? "" : " a.C.";
					var s = getMonthString(self.date.month) + " "+ Math.abs(self.date.year) + era;
					var f = self.date.day+" "+s;
					if(timeNumber){
						var t = {};
						getTimeToSeconds(timeNumber, t);
						f+=" "+t.hours+":";
						if(t.minutes<10)
		        			f+="0"+t.minutes;
		        		else
		        			f+=t.minutes;
					}
					return f;
				}
				
				self.updatePositionPost = function(){
					var oldPlace = {};
					if(self.post.place)
						var oldPlace = angular.copy(self.post.place);
					var map=null;
					if(self.scenario.history.mapId)
						map = {'url': CONSTANTS.urlMedia(self.scenario.history.mapId)};
					
					modalService.showModalOpenMap(self.post,map).then(
							function(data){
								console.log("position changed");
							},
							function(reason){
								self.post.place = oldPlace;
							}
					);
				}
				
				
			}],
			controllerAs: "editDraftPost",
			bindToController: true
		};
}]);