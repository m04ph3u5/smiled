angular.module("smiled.application").directive("newspaperPreview", [
                                     function(){
	return {
		restrict: "AE",
		templateUrl: "assets/private/partials/newspaper-preview.html",
		scope : {
			newspaper: '=?'
		},
		bindToController: true,
		controller: ['$scope', function(){
			var self = this;
		
			/*-------DATA FOR PREVIEWS THUMBNAILS --------*/
				
			self.articlePreviews = [     
			               {
			            	title: "CIAO",
			            	subtitle: "Sono un sottotitolo",
			            	image: 'assets/public/img/newspaper-img/ic_photo_default-horizontal.jpg'
			            	   
			            	   
			               }, 
			{
			            	title: "Ciao sono un altro titolo", 
			            	subtitle: "Secondo sottotitolo",
			            	image: 'assets/public/img/newspaper-img/ic_photo_default-horizontal.jpg'

			}          
			                        ]
			
		}],
		
		controllerAs: "newspaperPreview"
		
	}
}]);