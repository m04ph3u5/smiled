<!doctype html>
<html data-ng-app="smiled.application">
<head>
<!-- <meta charset="UTF-8"> -->
<link rel="stylesheet"
	href="https://localhost:8443/ThesisProject/assets/public/js/vendor/bootstrap/dist/css/bootstrap.css">
<link rel="stylesheet" href="https://localhost:8443/ThesisProject/assets/public/css/custom-style.css">
<link rel="stylesheet" href="https://localhost:8443/ThesisProject/assets/public/css/secondaryCss.css">
<link rel="stylesheet" href="https://localhost:8443/ThesisProject/assets/public/js/vendor/jquery-ui/themes/ui-lightness/jquery-ui.css">
<link rel="stylesheet" href="https://localhost:8443/ThesisProject/assets/public/css/validation-form.css">
<link rel="stylesheet" href="https://localhost:8443/ThesisProject/assets/public/js/vendor/ngDialog/css/ngDialog.css">
<link rel="stylesheet" href="https://localhost:8443/ThesisProject/assets/public/js/vendor/ng-tags-input/ng-tags-input.css">
<link rel="stylesheet" href="https://localhost:8443/ThesisProject/assets/public/js/vendor/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.css">
<link rel="stylesheet" href="https://localhost:8443/ThesisProject/assets/public/js/vendor/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css">

</head>
<base href="/ThesisProject/">
<body data-ng-cloak>
<div  class="container-fluid fillContent">
	
	<div data-ui-view></div>


</div>
	<!-- VENDOR SCRIPT -->
	
	<script
		src="https://localhost:8443/ThesisProject/assets/public/js/vendor/jquery/dist/jquery.js"></script>

	<script
		src="https://localhost:8443/ThesisProject/assets/public/js/vendor/bootstrap/dist/js/bootstrap.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/jquery-ui/jquery-ui.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/angular/angular.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/angular-ui-date/src/date.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/angular-ui-date/datepicker-it.js"></script>
		
	<script
		src="https://localhost:8443/ThesisProject/assets/public/js/vendor/angular-cookies/angular-cookies.js"></script>
	<script
		src="https://localhost:8443/ThesisProject/assets/public/js/vendor/angular-ui-router/release/angular-ui-router.js"></script>
	<script
		src="https://localhost:8443/ThesisProject/assets/public/js/vendor/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/ngstorage/ngStorage.js"></script>
	<script
		src="https://localhost:8443/ThesisProject/assets/public/js/vendor/angular-resource/angular-resource.js"></script>
	<script
		src="https://localhost:8443/ThesisProject/assets/public/js/vendor/angular-permission/dist/angular-permission.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/lodash/lodash.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/restangular/src/restangular.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/stomp-websocket/lib/stomp.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/ng-file-upload/ng-file-upload.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/ng-file-upload/ng-file-upload-shim.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/sockjs-client/dist/sockjs-0.3.4.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/ngDialog/js/ngDialog.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/angular-native-dragdrop/draganddrop.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/ngInfiniteScroll/build/ng-infinite-scroll.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/ng-tags-input/ng-tags-input.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/vendor/bootstrap-switch/dist/js/bootstrap-switch.js"></script>
	
<!-- 	<script src="http://cdn.sockjs.org/sockjs-0.3.min.js"></script> -->
	
	<!-- CUSTOM SCRIPT -->
	<script src="https://localhost:8443/ThesisProject/assets/public/js/app.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/router.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/loggedController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/loginController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/registerController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/registrationConfirmController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/dashboardController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/scenariosListController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/scenarioWizardController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/navbarController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/updateScenarioController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/scenarioController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/scenarioPostController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/scenarioCharactersController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/scenarioMapController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/personalProfileController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/studentsListController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/characterProfileController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/dialogScenarioController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/dialogSetDateController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/controllers/scenarioStorylineController.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/services/userService.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/services/apiService.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/services/modalService.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/services/alertingLogin.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/services/alertingGeneric.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/services/constantService.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/services/alertingRegistration.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/directives/alertLogin.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/directives/showOnHoverParent.js"></script> 
	<script src="https://localhost:8443/ThesisProject/assets/public/js/directives/hideOnHoverParent.js"></script> 
	<script src="https://localhost:8443/ThesisProject/assets/public/js/directives/insertStatus.js"></script> 
	<script src="https://localhost:8443/ThesisProject/assets/public/js/directives/insertEvent.js"></script> 
	<script src="https://localhost:8443/ThesisProject/assets/public/js/directives/insertPost.js"></script> 
	<script src="https://localhost:8443/ThesisProject/assets/public/js/directives/tagBox.js"></script> 
	<script src="https://localhost:8443/ThesisProject/assets/public/js/directives/alertRegistration.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/directives/alertGeneric.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/directives/workSpinner.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/directives/historicalDatePicker.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/directives/errSrc.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/directives/bsSwitch.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/support/jqSupport.js"></script>
	
	<!-- CUSTOM SCRIPT WRAPPING -->
	<script src="https://localhost:8443/ThesisProject/assets/public/js/wrapping/exceptionHandler.js"></script>  
<!-- 	<script src="https://localhost:8443/ThesisProject/assets/public/js/wrapping/interpolateDebug.js"></script> -->
	<script src="https://localhost:8443/ThesisProject/assets/public/js/wrapping/requestCounter.js"></script>
	<script src="https://localhost:8443/ThesisProject/assets/public/js/wrapping/stateChangeErrors.js"></script>
	
	
<!-- <script> 
// 	var url = 'https://'+window.location.host+'/ThesisProject/websocket/marcopolo';
// 	var sock = new SockJS(url);
	
// 	var stomp = Stomp.over(sock);
	
// 	var payload = JSON.stringify({ 'message': 'Marco!' });
// 	stomp.connect('guest', 'guest', function(frame) {
// 		stomp.send("/marco", {}, payload);
// 	});
	
// // 	sock.onopen = function() {
	
// // 		console.log('Opening');
// // 		sayMarco();
// // 	};
// // 	sock.onmessage = function(e) {
// // 		console.log('Received message: ', e.data);
// // 		setTimeout(function(){sayMarco()}, 2000);
// // 	};
// // 	sock.onclose = function() {
// // 		console.log('Closing');
// // 	};
// // 	function sayMarco() {
// // 		console.log('Sending Marco!');
// // 		sock.send("Marco!");
// // 	}
  </script> -->

</body>
</html>
