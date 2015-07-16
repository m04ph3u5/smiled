angular.module("smiled.application").directive('myTagBox', [ 'CONSTANTS', '$document', function(CONSTANTS, $document){
	return {
		restrict: 'EA',
		templateUrl: 'assets/private/partials/tag-box-template.html',
		scope : {
			selectedTags : "=tags",
			selectable : "=",
			type : "@",
			scenarioId : "@?scenario"
		},
		controller : function(){
			var self = this;
			self.selectedIndex=-1;
			self.suggestions = new Array();
			self.searchText = "";
			self.showSuggestions=true;
			
			self.search = function(){
				self.suggestions = [];
				self.selectedIndex=-1;

				var regex = new RegExp("(^|\\s|-|'|,|\.)"+self.searchText,"gi");
				if(self.selectable){
					if(self.type=="user"){
						for(var i=0; i<self.selectable.length; i++){
							if(regex.test(self.selectable[i].firstname) || regex.test(self.selectable[i].lastname)){
								var suggestion = {};
								suggestion.name=self.selectable[i].lastname+" "+self.selectable[i].firstname;
								suggestion.id=self.selectable[i].id;
								suggestion.cover=CONSTANTS.urlUserCover(self.selectable[i].id);
								self.suggestions.push(suggestion);
							}
						}
					}else if(self.type=="character"){
						console.log("search->character");
						console.log(regex.source);

						if(!self.scenarioId){
							throw new Error("Unsupported type");
						}
						for(var i=0; i<self.selectable.length; i++){
							if(regex.test(self.selectable[i].name)){
								var suggestion = {};
								suggestion.name=self.selectable[i].name;
								suggestion.id=self.selectable[i].id;
								suggestion.cover=CONSTANTS.urlCharacterCover(self.scenarioId,self.selectable[i].id);
								self.suggestions.push(suggestion);
								console.log("search->addSuggestion "+i);
							}

						}
					}else
						throw new Error("Unsupported type");
				}
			}

			self.removeTag=function(index){
				self.selectedTags.splice(index,1);
			}

			self.addToSelectedTags=function(index){
				console.log("addToSelectedTags "+index);
				if(self.selectedTags.indexOf(self.suggestions[index])===-1){
					self.selectedTags.push(self.suggestions[index]);
					self.searchText='';
					self.suggestions=[];
				}
			}
			
			self.checkKeyDown=function(event){
				if(event.keyCode===40){
					event.preventDefault();
					if(self.selectedIndex+1 !== self.suggestions.length){
						self.selectedIndex++;
					}else
						self.selectedIndex=0;
				}
				else if(event.keyCode===38){
					event.preventDefault();
					if(self.selectedIndex-1 !== -1){
						self.selectedIndex--;
					}else
						self.selectedIndex=self.suggestions.length-1;
				}
				else if(event.keyCode===13){
					self.addToSelectedTags(self.selectedIndex);
				}
			}
			
//			self.onFocusOut = function(){
//				console.log("FOCUSOUT");
//				
//				self.showSuggestions=false;
//			}
//			
//			self.onFocusIn = function(){
//				console.log("FOCUSIN");
//				self.showSuggestions=true;
//			}
		},
		controllerAs: 'tagBox',
		bindToController : true,
		link : function(scope, elem, attrs, controller){
			
//			var clickedIn=false;
		
			scope.$watch('tagBox.selectedIndex',function(val){
				if(val!==-1) {
					controller.searchText = controller.suggestions[controller.selectedIndex].name;
				}
			});
			
			
			elem.on('focusout', function($event){
				console.log("focusout: "+ controller.showSuggestions);
			
					controller.showSuggestions=false;
					scope.$apply();
//					clickedIn=false;
//					controller.suggestions=[];
//					controller.selectedIndex=-1;
//					controller.searchText="";

			});
			elem.on('focusin', function($event){
				console.log("focusin: "+ controller.showSuggestions);
				console.log(scope);
				controller.search();
				controller.showSuggestions=true;
				console.log($event.target);
				scope.$apply();
			});
			
//			elem.bind('mousedown', function(e){
//			    e.stopPropagation();
//			    console.log('clicked on directive');
//			    console.log(e);
//			    clickedIn=true;
//			});
//			
			
		}
	}
}]);