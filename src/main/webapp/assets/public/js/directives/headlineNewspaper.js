angular.module("smiled.application").directive('headlineNewspaper', ['article', 'modalService','apiService', '$stateParams', 'CONSTANTS', '$state',
                                     function(article, modalService, apiService, $stateParams, CONSTANTS, $state){
	return {

		restrict: "AE",
		templateUrl: "assets/private/partials/headline-newspaper.html",
		scope: {
			newspaper: '=?',
			scenario: '=',
			isJournalist: '=?'
			
		},
		bindToController: true,
		controller: ['$scope',function($scope){
			var self = this;
			if(self.isJournalist==undefined){
				self.isJournalist=true;
			}
			self.showWarning = false;
			var scenId = $stateParams.id; 
			self.isFirst; 
			self.isPublished = article.getIsPublished(); 
			self.date = {}; 
			self.isPublished = article.getIsPublished();
	
			if($state.current.name == 'logged.scenario.newspublished'){
			/*	apiService.getpublishedNewspapers(scenId).then (
						function(data) {
							self.publishedNewspapers = data; 
							self.publishedNewspaperNumber = article.getPublishedNewspaperNumber(); 
							console.log(self.publishedNewspaperNumber); 
							console.log("numero"); 
							var found = false;
							for(var i=0; !found && i<self.publishedNewspapers.length; i++) {
								if(self.publishedNewspapers[i].number = self.publishedNewspaperNumber) { 
									self.newspaper = self.publishedNewspapers[i];
									console.log(self.newspaper.name);
									console.log("NOME GIORNALE PUBBLICATO"); 
									
									found = true;
									break; 
								}
							}
						},function(reason){	
						}	
						);*/
		}
			
			if($state.current.name == 'logged.scenario.template1') {
			if(self.newspaper.status == 'DRAFT' || self.newspaper.status == undefined){
				
				/*Initialize dates variable*/
				self.startDate = angular.copy(self.scenario.history.startDate);
				if(!self.startDate.afterChrist)
					self.startDate.year*=-1;
				self.endDate = angular.copy(self.scenario.history.endDate);
				if(!self.endDate.afterChrist)
					self.endDate.year*=-1;
				self.newspaper.historicalDate=CONSTANTS.insertHistoricalDateNewspaper; 	
			}
			}
			

			self.showPopUpCreationTitle = function (){
			modalService.showModalCreateTitle(self.newspaper);	
			};
			
			
			
			self.setDateNewspaper = function(){
				if(self.newspaper!=null && self.newspaper.status!=undefined){
					modalService.showModalSetHistoryNewspaperDate(self.startDate, self.endDate, self.newspaper);
				}else{
					modalService.showAlertNewspaper();
				}
			}
			
			//format date
			
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
			
			var getMonthString = function(month){
				return CONSTANTS.monthString(month);
			}	
			
		}],
		
		controllerAs: "headlineNewspaper",

		link : function(scope,elem,attrs,ctrl){
		scope.$watch('headlineNewspaper.newspaper.font', function(newVal, oldVal){
			if(newVal){	
				if(ctrl.newspaper.font == 'Rakkas'){
					ctrl.newspaper.font = {'font-family': 'Rakkas' };
					console.log(ctrl.newspaper.font);	
				} else

					if(ctrl.newspaper.font == 'Patrick Hand') {
						console.log(ctrl.newspaper.font);
						ctrl.newspaper.font = {'font-family': 'Patrick Hand'};		
					} else 
						if (ctrl.newspaper.font == 'Abril Fatface'){

							ctrl.newspaper.font = {'font-family': 'Abril Fatface'};		

						} else 
							if (ctrl.newspaper.font == 'Katibeh'){

								ctrl.newspaper.font = {'font-family': 'Katibeh'};	

							}

							else 
								if (ctrl.newspaper.font == undefined){

									ctrl.newspaper.font = oldVal;	

								}

			} else {
			
			ctrl.newspaper.font = oldVal;	
			
		}
			
			
			});
		}
		
} 
}]);
