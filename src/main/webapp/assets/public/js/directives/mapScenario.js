angular.module("smiled.application").directive('mapScenario', [ 'CONSTANTS', '$timeout',
                                                                function(CONSTANTS, $timeout){
	return {
		restrict : "A",
		scope : {
			posts : "=",
			map : "@"
		},
		link : function(scope, element, attrs){
			var ctx = element[0].getContext('2d');
			var canvas = ctx.canvas;
			var marker = new Image();
			marker.src = CONSTANTS.urlMarker;
			//TODO adattare la dimensione del canvas a quella del modal???
			canvas.width = 700;
			var map = new Image();
			map.src = scope.map;
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
				
				
				if(scope.posts){
					for(var i=0; i<scope.posts.length;i++){
						if(scope.posts[i].place){
							var x = (scope.posts[i].place.x*canvas.width)-(markerDim/2);
							var y = (scope.posts[i].place.y*canvas.height)-(markerDim);
							ctx.drawImage(marker, x, y, markerDim, markerDim);
							lastX=x;
							lastY=y;
						}	
					}
				}
				
			};
			
//			marker.onload = function(){
//				
//			}
		}
	}
}]);
