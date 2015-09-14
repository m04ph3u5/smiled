angular.module("smiled.application").directive('mapPostView', [ 'CONSTANTS',
                                                                function(CONSTANTS){
	return {
		restrict : "A",
		scope : {
			post : "=",
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
				
				if(scope.post.place){
					var x = (scope.post.place.x*canvas.width)-(markerDim/2);
					var y = (scope.post.place.y*canvas.height)-(markerDim);
					ctx.drawImage(marker, x, y, markerDim, markerDim);
					lastX=x;
					lastY=y;
				}
			};
			
//			marker.onload = function(){
//				
//			}
		}
	}
}]);
