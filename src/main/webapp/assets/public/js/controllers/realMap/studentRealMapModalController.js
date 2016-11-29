angular.module('smiled.application').controller('studentModalController', ['post', '$scope', 'userService', 'modalService',

	function (post,$scope,userService, modalService) {

 
 var self = this;
 self.post = post;
 self.fixMax = userService.getBounds();
 var baseLay = userService.getTileUrl();
 self.marker = {};
// self.marker = {}
 if(self.post.place){
//   self.marker[1] = {};
   console.log(self.post.place);
   self.marker = {
		   
   m:{
	   lat : self.post.place.x,
	   lan : self.post.place.y,
	   icon : {
		     iconUrl: 'assets/public/img/map-pin2.png',
			 iconSize:     [69, 65],
			 iconAnchor:   [14, 60]
	   }
   }
   }
   
 }
 self.map =  {
			    
				maxbounds: {
                    northEast: {
                        lat: self.fixMax.northEast.lat,
                        lng: self.fixMax.northEast.lng
                    },
                    southWest: {
                        lat: self.fixMax.southWest.lat,
                        lng: self.fixMax.southWest.lng
                    }
                },
				
                center: {},
				tiles: {
                    url: baseLay

                },
				defaults: {
					zoomControl: false,
					scrollWheelZoom: false,
					doubleClickZoom: false
				}				
			
 }
 
 self.ok = function(){
	 self.post.place = {};
	 self.post.place.x = self.marker[1].lat;
	 self.post.place.y = self.marker[1].lng;
	 modalService.closeRealMapStudent();
 }
 
 self.cancel = function(){
	 modalService.closeRealMapStudent();
 }

 
 $scope.$on("leafletDirectiveMap.click", function(event, args){
                var leafEvent = args.leafletEvent;
				
                self.marker[1]={
                    lat: leafEvent.latlng.lat,
                    lng: leafEvent.latlng.lng,
                    icon: {
       							 iconUrl: 'assets/public/img/map-pin2.png',
        						 iconSize:     [69, 65],
        						 iconAnchor:   [14, 60],
   							 } 
                };
                console.log(self.marker);
//				userService.setMarker(self.marker);
				
            });
 
}]);
