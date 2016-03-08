angular.module("smiled.application").controller('scenarioStorylineCtrl', [ 'apiService', '$scope', 'CONSTANTS', 'Lightbox',
        function scenarioStorylineCtrl(apiService, $scope, CONSTANTS, Lightbox){
        	
        	var self = this;
        	self.posts = [];
        	self.date = {};
        	var numMediaPerRow = 3;
        	var order=true;
        	self.showFromEnd = true;
        	var scrollable = CONSTANTS.numberOfPostForScroll;
        
        	self.busy=false;
        	var stopScroll=false;
        	
        	
        	self.nextPost = function(){
        		if(self.busy || stopScroll)
        			return;
        		self.busy=true;
        		if(self.posts.length==0){
        			getPost();
        		}else{
        			getPost(self.posts[self.posts.length-1].julianDayNumber,self.posts[self.posts.length-1].timeNumber);
        		}
        	}
        	
        	var getPost = function(date, time){
        	
		    	apiService.getLastHistoricPosts($scope.scenario.scen.id, scrollable, order, date, time).then(
		    			function(data){
		    				var arrivedPosts = data;
		    				if(arrivedPosts.length==0){
		    					stopScroll=true;
		    					return;
		    				}
		    				for(var i=0; i<arrivedPosts.length;i++){
		  					
		    					if(arrivedPosts[i].character && arrivedPosts[i].character.id){
		    						arrivedPosts[i].character.cover = CONSTANTS.urlCharacterCover($scope.scenario.scen.id,arrivedPosts[i].character.id);
		    						for(var j=0; j<arrivedPosts[i].likes.length; j++){
		    							if(arrivedPosts[i].likes[j].id==arrivedPosts[i].character.id){
		    								arrivedPosts[i].youLike=true;
		    								break;
		    							}
		    						}
		    					}else{
		    						arrivedPosts[i].character = {};
		    						arrivedPosts[i].character.name="Narratore";
		    						arrivedPosts[i].character.cover="assets/public/img/narr.png";
		    						arrivedPosts[i].isEvent = true;
		    					}
		    					if(arrivedPosts[i].comments){
		    						for(var j=0; j<arrivedPosts[i].comments.length; j++){
		    							arrivedPosts[i].comments[j].character.cover = CONSTANTS.urlCharacterCover($scope.scenario.scen.id,arrivedPosts[i].comments[j].character.id);
		    						}
		    					}
		    					if(arrivedPosts[i].imagesMetadata){
		    						arrivedPosts[i].media = new Array();
		    						arrivedPosts[i].media[0] = new Array();
		    						var col = -1;
		    						var row = 0;
		    						for(var j=0; j<arrivedPosts[i].imagesMetadata.length;j++){
		    							if(j!=0 && j%numMediaPerRow==0){
		    								col=0;
		    								row++;
		    								arrivedPosts[i].media[row] = new Array();
		    							}else{
		    								col++;
		    							}
		    							arrivedPosts[i].media[row][col] = CONSTANTS.urlMediaThumb(arrivedPosts[i].imagesMetadata[j].id);
		    							arrivedPosts[i].imagesMetadata[j].url = CONSTANTS.urlMedia(arrivedPosts[i].imagesMetadata[j].id);
		    						}
		    					}
		    					self.posts.push(angular.copy(arrivedPosts[i]));
		    				}
	    					self.busy=false;
		    			}, function(reason){
		    				console.log("errore");
	    					self.busy=false;
		    			}
		    	);
			}
        	
//        	getPost();
        	
        	self.switchOrder = function(o){
        		order = !order;
        		self.posts=[];
        		self.busy=false;
        		stopScroll=false;
        		self.nextPost();
        	}
        	
        	self.getPosition = function(index){
        		if(index%2==0)
        			return "timeline-inverted";
        		else
        			return "";
        	}
        	
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
			
			self.formatDate = function(jd, timeNumber){
//				if(date.afterChrist)
//					era="D.C.";
//				else
//					era="A.C.";
//				
//				return date.day+" / "+date.month+" / "+date.year+" "+era;
				julianNumberToDate(jd, self.date);
        		var era = self.date.year > 0 ? "" : " A.C.";
        		var s = getMonthString(self.date.month) + " "+ Math.abs(self.date.year) + era;
        		s = self.date.day+" "+s;
        		var time = {};
        		getTimeToSeconds(timeNumber, time);
        		
        		s+=" "+time.hours+":";
				if(time.minutes<10)
        			s+="0"+time.minutes;
        		else
        			s+=time.minutes;
        		return s;
			}
        	
        	self.realDateFormatWithHour = CONSTANTS.realDateFormatWithHour;
        	
        	self.getMediaUrl = function(id){
        		return CONSNTANTS.urlMedia(id);
        	}
        	
        	self.openPostGallery = function(post, row, col){
				var index = (row*numMediaPerRow)+col;
				if(post.media)
					Lightbox.openModal(post.imagesMetadata,index);
        	}
}]);