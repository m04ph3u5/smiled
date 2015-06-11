angular.module('smiled.application').controller('updateScenarioCtrl', ['$scope', 'apiService', '$stateParams', 'Upload',
                                                              function updateScenarioCtrl($scope, apiService, $stateParams, Upload){
	var id = $stateParams.id;
	//$scope.cover=null;
	

//	var uploadCover = function(file){
//		console.log("uploadCover");
//		$scope.cover=file;
//		console.log($scope.cover);
//		
//		if($scope.cover!=null){
//			var fd = new FormData();
//			fd.append('file',$scope.cover);
//			console.log(fd);
//			apiService.uploadCoverScenario(id,$scope.cover);
//		}
//	}
	
	var uploadCover = function(file){
		if(file && file.length){
			
			Upload.upload({
	            url: 'api/v1/scenarios/'+id+'/cover',
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
	        });
		}
	}
	
	$scope.uploadCover = uploadCover;
}]);