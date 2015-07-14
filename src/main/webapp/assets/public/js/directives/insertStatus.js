angular.module("smiled.application").directive("insertStatus", [ 'CONSTANTS', 'apiService', 'Upload',
                                     function(CONSTANTS, apiService, Upload){
	return {
		templateUrl: "assets/private/partials/insert-status-template.html",
		scope : {
			character: "=",
			posts: "=",
			scenario: "="
		},
		bindToController: true,
		controller: ['$scope', function(){
			var self = this;
		
			/*Initialize newPost variable*/
			self.newPost = {};
			self.newPost.date = {
					afterChrist : true
			};
			self.newPost.date.formatted=CONSTANTS.insertHistoricalDate;
			self.newPost.image = new Array();
			self.newPost.file  = new Array();
			self.newPost.tags = new Array();
			/*--------------------------*/
			
			
			/*Check character presence. If absent don't show template*/
			if(self.character){
				self.showInsertStatus = true;
				console.log(self.character);
			}else{
				self.showInsertStatus = false;
				console.log(self.character);
			}
			/*--------------------------------------------------------*/
			
			/*Variable and function to switch open/closed historicalDatePicker*/
			self.showDatePicker = false;
			self.setDateNewPost = function(){
				self.showDatePicker = !self.showDatePicker;
			}
			/*----------------------------------------------------------------*/
			
			
			/*Create new Status*/
			self.savePost = function(){
				self.setDateNewPost();
				if(self.newPost.content && (self.newPost.date.formatted!=CONSTANTS.insertHistoricalDate)){
					var toSendPost = {};
					toSendPost.text = self.newPost.content;
					toSendPost.historicalDate = self.newPost.date;
					toSendPost.status = "PUBLISHED";
					toSendPost.imageMetaId = new Array();
					toSendPost.fileMetaId = new Array();
					for(var i=0; i<self.newPost.image.length; i++){
						toSendPost.imageMetaId.push(self.newPost.image[i].id);
					}
						
					for(var i=0; i<self.newPost.file.length; i++){
						toSendPost.fileMetaId.push(self.newPost.file[i].id);
					}
					
					apiService.sendStatus(self.scenario.id, self.character.id, toSendPost).then(
							function(data){
								console.log("sended: "+data);
								self.newPost.content="";
								self.newPost.image=[];
								self.newPost.file=[];
								self.newPost.date={afterChrist : true};
								self.newPost.date.formatted=CONSTANTS.insertHistoricalDate;
								apiService.getSingleStatus(self.scenario.id, data.id).then(
										function(data){
											self.posts.unshift(data);
											if(self.posts[0].imageMetaId){
												self.posts[0].imagesUrl = new Array();
												for(var i=0; i<self.posts[0].imageMetaId.length; i++){
													self.posts[0].imagesUrl[i].push(CONSTANTS.urlMedia(self.posts[0].imageMetaId[i]));
												}
											}
											self.posts[0].character.cover = CONSTANTS.urlCharacterCover(self.scenario.id,self.posts[0].character.id);
										},
										function(reason){
											console.log("error in insert new post in array");
										}
								);
							},
							function(reason){
								console.log("error in send status: "+reason);
							}
					);
				}else{
					//TODO gestione alert errore
				}
			
			}
			/*----------------------------------------------------------------*/

			/*Public function to add/remove new image to status*/
			self.addImageToNewPost = function(file){
				uploadMediaToPost(file,true);
			}
			
			self.removeImage =function(image){
				for(var i=0; i<self.newPost.image.length; i++){
					if(self.newPost.image[i].id==image.id){
						self.newPost.image.splice(i,1);
					}
				}
			}
			/*------------------------------------------*/
			
			/*Public function to add/remove new file to status*/
			self.addFileToNewPost = function(file){
				console.log("add File");
				uploadMediaToPost(file,false);
			}
			self.removeFile =function(file){
				for(var i=0; i<self.newPost.file.length; i++){
					if(self.newPost.file[i].id==file.id){
						self.newPost.file.splice(i,1);
					}
				}
			}
			/*------------------------------------------*/
			
			/*Private function used to upload media*/
			var uploadMediaToPost = function(file,isImage){
				if(file && file.length){
					Upload.upload({
			            url: CONSTANTS.urlMediaScenarioPost(self.scenario.id),
			            headers : {
			                'Content-Type': file.type
			            },
			            file: file
			        })
//			            .progress(function (evt) {
//			            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//			            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
//			        })
			        .success(function (data, status, headers, config) {
			           console.log("SUCCESS UPLOAD");
			           console.log(data);
			           if(isImage){
			        	   var uploadedFile = {};
			        	   uploadedFile.id = data.id;
			        	   uploadedFile.name = config.file[0].name;
			        	   self.newPost.image.push(uploadedFile);
			           }else{
			        	   var uploadedFile = {};
			        	   uploadedFile.id = data.id;
			        	   uploadedFile.name = config.file[0].name;
			        	   self.newPost.file.push(uploadedFile);
			           }
			        });
				}
			}
			/*-----------------------------------------------------*/

		}],
		controllerAs: "insertStatus"
	}
}]);

