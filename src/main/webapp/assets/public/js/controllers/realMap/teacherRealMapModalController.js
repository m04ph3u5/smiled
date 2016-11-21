angular.module('smiled.application').controller('teacherRealMapModalController', ['userService', 'center', 'modalService',
    function (userService, center, modalService) {

        var self = this;
        self.map = {
            bounds: {},
            center: center,
            tiles: {
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

            }
        }
      /*  $scope.$watch(angular.bind(this, function () {
            return this.map.center.zoom;
        }), function (zoom) {
            this.map.tiles.url = (zoom > 6) ?
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" :
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
        });*/

        self.setMaxBounds = function (b) {
            console.log(b);
            userService.setBounds(b);
            userService.setCenter(self.map.center);
            //TODO add call to userService to store tileUrl choosen
            modalService.closeRealMapTeacher();
        }

    }
]);