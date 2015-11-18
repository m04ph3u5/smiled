angular.module("smiled.application").directive('pinPointCanvas', [ 'CONSTANTS', '$q',
                                                                function(CONSTANTS, $q){
	return {
		restrict : "A",
		scope : {
			post : "=",
			map : "@"
		},
		link : function(scope, element, attrs){
			console.log(scope.post);
			var ctx = element[0].getContext('2d');
			var canvas = ctx.canvas;
			//TODO adattare la dimensione del canvas a quella del modal???
			canvas.width = 700;
			var map = new Image();
			map.src = scope.map;
			var lastX = -1;
			var lastY = -1;
			var marker = new Image();
			marker.src = CONSTANTS.urlMarker;
			//TODO anche per la dimensione del marker sarebbe da evitare il valore cablato
			var markerDim= 40;
			var original;
			var promise = $q.defer();
			
			map.onload = function(){
				var mapRatio = map.width / map.height;
				var newHeight = (map.height*canvas.width)/map.width;
				canvas.height = newHeight;
				ctx.drawImage(map, 0, 0, map.width, map.height, 0, 0, canvas.width, newHeight);
				original = ctx.getImageData(0,0,canvas.width, canvas.height);
				promise.resolve();
			};
			
			marker.onload = function(){
				if(scope.post.place){
					promise.promise.then(
							function(data){
								var x = (scope.post.place.x*canvas.width)-(markerDim/2);
								var y = (scope.post.place.y*canvas.height)-(markerDim);
								ctx.drawImage(marker, x, y, markerDim, markerDim);
								lastX=x;
								lastY=y;
					});
				}
			}
			
		
			
			element.on('click', function(event){
				var pin = {};
				pin.x = event.offsetX/canvas.width;
				pin.y = event.offsetY/canvas.height;
				scope.post.place = pin;
 
				var x = event.offsetX-20;
				var y = event.offsetY-40;
				
				if(lastX!=-1 && lastY!=-1){
					ctx.clearRect(0,0,canvas.width, canvas.height);
					ctx.putImageData(original,0,0);
				}
				ctx.drawImage(marker, x, y, markerDim, markerDim);
				lastX=x;
				lastY=y;
				
				
			});
		}
	}
}]);
//			element.on("click", function(event) {
//				console.log(event);
//				var pin = {};
//				pin.x = event.offsetX/event.target.width;
//				pin.y = event.offsetY/event.target.height;
//				ctrl.post.place = pin;
//
//				var x = event.offsetX-20;
//				var y = event.offsetY-40;
//				console.log(x+" "+y);
//
//				var el = angular.element("#pin");
//				console.log(el);
//				el.attr("style", "top: "+y+"px; left: "+x+"px; visibility: visible;");
//				scope.$apply(function(){
//					$compile(el)(scope);
//				});
////				var template = "<img id='pin"+ctrl.pinPoints.length+"' data-ng-src='assets/public/img/marker.png' class='top-layer marker' style='top: "+y+"px; left: "+x+"px;'>";
////				scope.$apply(function() {
////				var content = $compile(template)(scope);
////				$( "#overlay-container" ).append(content);
////				})
//			});

//			angular.element($window).bind('resize', function() {
//			console.log("------------------->RESIZE");
//			var mapX = element.find('#map-layer').width(); 
//			var mapY = element.find('#map-layer').height();
//			console.log(mapX+" "+mapY)
//			for(var i=0; i<ctrl.pinPoints.length; i++){
//			var id = "pin"+(i+1);
//			var newX = Math.round(((ctrl.pinPoints[i].x*ctrl.pinPoints[i].naturalX)/mapX))-20;
//			var newY = Math.round(((ctrl.pinPoints[i].y*ctrl.pinPoints[i].naturalY)/mapY))-40;
////			console.log(newX+" "+newY);
////			var el = angular.element(id);
////			el.attr("style" , "top: "+newX+"px; left: "+newY+"px;");
////			$scope = el.scope();
////			$injector = angular.injector();
////			$injector.invoke(function($compile){
////			$compile(el)($scope)
////			})
//			}
//			});
		
	