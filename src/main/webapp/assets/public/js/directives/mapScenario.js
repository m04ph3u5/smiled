angular.module("smiled.application").directive('mapScenario', [ 'CONSTANTS', '$timeout','$document', 'dateUtil',
                                                                function(CONSTANTS, $timeout,$document, dateUtil){
	return {
		restrict : "A",
		scope : {
			posts : "=",
			slideNumber : "=",
			map : "@",
			start : "=",
			end : "=",
			bars : "=",
			actual : "="
		},
		controller : function(){
			var self = this;
			self.toShowPost = new Array();
			var mapPost;
			var compare = function(p1, p2){
				var d1 = parseInt(p1.julianDayNumber);
				var d2 = parseInt(p2.julianDayNumber);
				if(p1.timeNumber)
					var t1 = parseInt(p1.timeNumber);
				else
					var t1 =0;
				if(p2.timeNumber)
					var t2 = parseInt(p2.timeNumber);
				else
					var t2 = 0;
				
				if(d1<d2)
					return -1;
				else if(d1>d2)
					return 1;
				else{
					if(t1<t2)
						return -1;
					else if(t1>t2)
						return 1;
					else
						return 0;
				}
			}
			
			var elaborate = function(){
				if(mapPost.length){
					mapPost.sort(compare);
					self.start = dateUtil.dateTimeToStringShort(mapPost[0].julianDayNumber, mapPost[0].timeNumber);
					self.end = dateUtil.dateTimeToStringShort(mapPost[mapPost.length-1].julianDayNumber, mapPost[mapPost.length-1].timeNumber);
					var startDate = 0;
					if(mapPost[0].timeNumber){
						startDate+=parseInt(mapPost[0].timeNumber/60);
					}
					var endDate = (mapPost[mapPost.length-1].julianDayNumber-mapPost[0].julianDayNumber)*24*60;
					if(mapPost[mapPost.length-1].timeNumber){
						endDate+=parseInt(mapPost[mapPost.length-1].timeNumber/60);
					}
					
					var actualStep = (endDate-startDate)/100;
					var step = actualStep;
				
					var i=0;
					var index=0;
					while(index<100 && i<mapPost.length){
						
						var col=0;
						self.toShowPost[index]=new Array();
						var actualDate = (mapPost[i].julianDayNumber-mapPost[0].julianDayNumber)*24*60;
						if(mapPost[i].timeNumber)
							actualDate+=parseInt(mapPost[i].timeNumber/60);
					
						while(actualDate<=(startDate+actualStep)){
							self.toShowPost[index][col]=mapPost[i];
							col++;
							i++;
							if(i<mapPost.length){
								actualDate = (mapPost[i].julianDayNumber-mapPost[0].julianDayNumber)*24*60;
								if(mapPost[i].timeNumber)
									actualDate+=parseInt(mapPost[i].timeNumber/60);
							}else
								break;
						}
//						if(index==99){
//							self.toShowPost[index].push(mapPost[mapPost.length-1]);
//						}
						index++;
						actualStep+=step;						
					}
				}
				self.bars = new Array();
				for(var i=0; i<100; i++){
					if(self.toShowPost[i])
						self.bars[i]=self.toShowPost[i].length;
					else
						self.bars[i]=0;
				}
				
			}
			
			self.posts.then(
					function(data){
						mapPost = angular.copy(data.content);
						elaborate();
					},
					function(reason){
						console.log("Error in retrieve post");
					}
			);
			
		
			
			
						
		},
		controllerAs: "dirMapScenario",
		bindToController : true,
		link : function(scope, element, attrs,ctrl){
			var ctx = element[0].getContext('2d');
			var canvas = ctx.canvas;
			var marker = new Image();
			marker.src = CONSTANTS.urlMarker;
			//TODO adattare la dimensione del canvas a quella del modal???
//			canvas.width = 700;
			
			canvas.style.width ='100%';
			canvas.style.height='100%';
			
			var container = angular.element(document.querySelector('#container-canvas'));
			canvas.width  = container.width();
			canvas.height = container.height();
			var map = new Image();
			map.src = ctrl.map;
			var lastX = -1;
			var lastY = -1;
			
			//TODO anche per la dimensione del marker sarebbe da evitare il valore cablato
			var markerDim= 40;
			var original;
			
			map.onload = function(){
				var mapRatio = map.width / map.height;
				var newHeight = (map.height*canvas.width)/map.width;
				canvas.height = newHeight;
				ctx.drawImage(map, 0, 0, map.width, map.height, 0, 0, canvas.width, newHeight);
				original = ctx.getImageData(0,0,canvas.width, canvas.height);
			};	
				
			
			
			var drawMarker = function(n){
				if(ctrl.toShowPost){
					for(var i=0;i<n;i++){
						if(ctrl.toShowPost[i]){
							var alpha = Math.exp((i-n+1)*0.0135);
							ctx.globalAlpha=alpha;
							for(var j=0; j<ctrl.toShowPost[i].length;j++){
								if(ctrl.toShowPost[i][j].place){
									var x = (ctrl.toShowPost[i][j].place.x*canvas.width)-(markerDim/2);
									var y = (ctrl.toShowPost[i][j].place.y*canvas.height)-(markerDim);
									ctx.drawImage(marker, x, y, markerDim, markerDim);
								}
							}
							ctx.globalAlpha=1;
						}
					}
					if(ctrl.toShowPost && ctrl.toShowPost[n-1]){
						if(ctrl.toShowPost[n-1][0]){
							ctrl.actual = dateUtil.dateTimeToStringShort(ctrl.toShowPost[n-1][0].julianDayNumber,ctrl.toShowPost[n-1][0].timeNumber);
							ctrl.actual += " ("+ctrl.toShowPost[n-1].length+")";
						}
						else
							ctrl.actual="";
					}
					else
						ctrl.actual="";
				}
			}
			
//			var drawMarkerDelay = function(n){
//				if(ctrl.toShowPost){
//					for(var i=0;i<n;i++){
//						if(ctrl.toShowPost[i])
//							for(var j=0; j<ctrl.toShowPost[i].length;j++){
//								if(ctrl.toShowPost[i][j].place){
//									var x = (ctrl.toShowPost[i][j].place.x*canvas.width)-(markerDim/2);
//									var y = (ctrl.toShowPost[i][j].place.y*canvas.height)-(markerDim);
//									$timeout(ctx.drawImage(marker, x, y, markerDim, markerDim),1550);
//								}
//							}
//					}
//				}
//			}
			
			scope.$watch('dirMapScenario.slideNumber', function(newVal, oldVal){
				if(oldVal){
					ctx.putImageData(original,0,0);
					if(newVal!=0 && newVal>oldVal){
						drawMarker(newVal);
					}else if(newVal!=0 && newVal<oldVal){
						drawMarker(newVal);
					}
				}
			});
			
//			marker.onload = function(){
//				
//			}
		}
	}
}]);
