angular.module('smiled.application').controller('teacherRealMapModalController', ['userService', 'modalService', '$scope',
  function (userService, modalService, $scope) {

    var self = this;
    var tileUrl = userService.getTileUrl();
    var center = userService.getCenter();
    var bounds = userService.getBounds();
    self.map = {
      bounds: bounds,
      center: center,
      layers: {
        baselayers: {
          Streets: {
            name: 'Streets',
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            type: 'xyz',

          },
          Satellite: {
            name: 'Satellite',
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            type: 'xyz',
          }
          /* ,
                       Vintage: {
                            name: 'Vintage',
                            url: 'https://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg',
                            type: 'xyz',
                            layerOptions: {
                                apikey: 'pk.eyJ1IjoidG9ydmEiLCJhIjoiY2lqanljYjNiMDA0anZzbHhsMHNocG9qaSJ9.MbxiyjWjNlAL0A1lmVbkFQ',
                                mapid: 'mapbox.Vintage'
                            }
					   }*/
        }
      },
      tiles: {
        url: tileUrl

      }
    }
    var lay = {};
    $scope.$on('leafletDirectiveMap.baselayerchange', function (ev, layer) {
      lay = layer.leafletEvent.name;

    });

    self.setMaxBounds = function (b) {
      userService.setBounds(b);
      userService.setCenter(self.map.center);
      var baseUrl;
      angular.forEach(self.map.layers.baselayers, function (item) {
        if (item.name == lay)
          baseUrl = item.url;
      });
      userService.setTileUrl(baseUrl);
      modalService.closeRealMapTeacher();
    }

  }
]);