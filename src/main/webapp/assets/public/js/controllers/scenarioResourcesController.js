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
	
	self.realDateFormat = CONSTANTS.realDateFormatWithHour;
	
	var up;
	
	var getResourceType = function(format){
		if(format=="jpg" || format=="png" || format=="gif")
			return "img";
		if(format=="pdf")
			return "pdf";
		if(format=="doc" || format =="docx" || format=="odt" || format=="txt")
			return "doc";
		if(format=="ppt" || format=="pptx" || format=="odp")
			return "ppt";
		if(format="xls" || format=="xlsx" || format=="ods")
			return "excel";
		
		
		return "doc";
		
	}
	
	var uploadMediaList = function(){
		apiService.getTrustedMediaMetadata(self.scen.id).then(
	
			function(response){
				self.files = response;
				if(self.files){
					for(var i=0; i<self.files.length; i++){
						
						self.files[i].type = getResourceType(self.files[i].format);
						
						if(self.files[i].teacherId==self.scen.teacherCreator.id){
							self.files[i].user = self.scen.teacherCreator.firstname+" "+self.scen.teacherCreator.lastname;
							continue;
						}else{
							if(self.scen.collaborators){
								for(var j=0; j<self.scen.collaborators; j++){
									if(self.files[i].teacherId==self.scen.collaborators[j].id){
										self.files[i].user = self.scen.collaborators[j].firstname+" "+self.scencollaborators[j].lastname;
										break;
									}
								}
							}
						}
					}
				}
			},
			function(reason){
				console.log("ERRORE DOWNLOAD METADATA");
			}
		);
	}
	
	uploadMediaList();
	
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
					uploadMediaList();
				},
				/*FAIL*/
				function(reason){
					console.log("UPLOAD FAILED");
					console.log(reason);
					self.newFile.progress = 0;
					self.error="Upload fallito ("+reason.data.message+"). Si prega di riprovare.";
					self.showCancelButton=false;
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
	
	self.getMediaUrl = function(id){
		return CONSTANTS.urlMedia(id);
	}

}]);