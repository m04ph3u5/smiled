angular.module('smiled.application').controller('scenarioResourcesCtrl', ['CONSTANTS', '$scope', 'apiService', 'Upload',
              function scenarioResourcesCtrl(CONSTANTS,$scope, apiService,Upload){
	var self = this;
	self.scen = $scope.scenario.scen;
	self.uploadable = $scope.scenario.isCreator || $scope.scenario.isModerator;
	
	self.showMetaBox = false;
	self.showProgressBar = false;
	self.newFile = {};
	self.newFile.progress=0;
	self.showCancelButton=false;
	self.error="";
	self.files = [];
	
	self.realDateFormat = CONSTANTS.realDateFormatWithoutHour;
	
	var up;
	
	apiService.getTrustedMediaMetadata(self.scen.id).then(
		function(response){
			self.files = response;
			console.log(self.files);
		},
		function(reason){
			console.log("ERRORE DOWNLOAD METADATA");
		}
	);
	
	self.uploadFiles = function(file){
		self.error="";
		up = Upload.upload({
            url: CONSTANTS.urlTrustedMediaScenarioPost(self.scen.id),
            headers : {
                'Content-Type': file.type
            },
            file: file
        });
		
		up.then(
				/*SUCCESS*/
				function(resp){
					console.log("UPLOADED");
					self.showCancelButton=false;
					self.showMetaBox=true;
					self.newFile.name = resp.config.file[0].name;
					self.newFile.id=resp.data.id;
					var file = {};
					file.name = resp.config.file[0].name;
					file.creationDate = new Date();
					file.user = $scope.scenario.loggedUser.firstname+" "+$scope.scenario.loggedUser.lasttname;
					console.log(file);
					self.files.push(angular.copy(file));
					file = {};
				},
				/*FAIL*/
				function(reason){
					console.log("UPLOAD FAILED");
					self.newFile.progress = 0;
					self.error="Upload fallito. Si prega di riprovare."
				},
				/*PROGRESS*/
				function(evt){
					self.showCancelButton=true;
					self.showProgressBar=true;
					console.log(evt);
					self.newFile.progress = parseInt(100.0 * evt.loaded / evt.total);
					self.widthProgressBar=self.newFile.progress+"%";
				}
		);
	};
	
	self.abortUpload = function(){
		up.abort();
	}
	
	self.saveMeta = function(){
		var metaDTO = {};
		metaDTO.description = self.newFile.description;
		console.log(self.newFile.id);
		apiService.postTrustedMediaMetadata(self.scen.id, self.newFile.id, metaDTO).then(
				function(data){
					self.showMetaBox = false;
					self.showProgressBar = false;
					self.newFile = {};
					self.newFile.progress=0;
				},
				function(reason){
					console.log("ERRORE UPLOAD METADATA!");
					console.log(reason);
				}
		);
	};
	
	self.hideMetaBox = function(){
		self.showMetaBox = false;
		self.showProgressBar = false;
		self.newFile = {};
		self.newFile.progress=0;
	}
}]);