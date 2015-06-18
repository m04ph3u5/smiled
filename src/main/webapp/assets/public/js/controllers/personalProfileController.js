angular.module('smiled.application').controller('personalProfileCtrl', ['$scope', 'apiService', 'Upload','userService',
                                                              function personalProfileCtrl($scope, apiService, Upload, userService){
	

	
	var uploadCover = function(file){
		if(file && file.length){
			Upload.upload({
	            url: 'api/v1/me/cover/',
	            headers : {
	                'Content-Type': file.type
	            },
	            file: file
	        })
//	            .progress(function (evt) {
//	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//	            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
//	        })
	        .success(function (data, status, headers, config) {
	            console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
	            userService.notifyImageProfileObservers();          
	        });
		}
	}
	
	var uploadFile = function(file){
		if(file && file.length){
			Upload.upload({
	            url: 'api/v1/scenarios/55828de744ae54bfb888fca8/media',
	            headers : {
	                'Content-Type': file.type
	            },
	            file: file
	        })
//	            .progress(function (evt) {
//	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//	            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
//	        })
	        .success(function (data, status, headers, config) {
	            console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
	            userService.notifyImageProfileObservers();  
	        });
		}
	}
	
	apiService.getImagePersonalProfile().then(
			function(data){
				console.log("ARRAY IMAGE")
				$scope.images = [];
				var list = data.content;
				for (i=0; i<list.length; i++){
					$scope.images[i]=list[i].thumb;
				}
			},
			function(reason){
				console.log("ERROR ON IMAGE RETRIEVING");
			}
	);
	
	apiService.getFilePersonalProfile().then(
			function(data){
				console.log("ARRAY IMAGE")
				$scope.files = [];
				var list = data.content;
				for (i=0; i<list.length; i++){
					$scope.files[i]=list[i].thumb;
				}
			},
			function(reason){
				console.log("ERROR ON IMAGE RETRIEVING");
			}
	);
	
	$scope.uploadCover = uploadCover;
	$scope.uploadFile = uploadFile;
}]);