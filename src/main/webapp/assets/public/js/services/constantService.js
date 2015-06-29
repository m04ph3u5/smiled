angular.module("smiled.application").constant("CONSTANTS",{
	"baseUrl" : "https://localhost:8443/ThesisProject",
	"urlGetMeCover" : "api/v1/me/cover",
	"urlGetUserCover" : function(id){
						   		return "api/v1/users/"+id+"/cover"
						   }
});