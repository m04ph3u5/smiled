<!doctype html>
<html ng-app="smiled.application">
<head>
<link
	href="https://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css"
	rel="stylesheet">
</head>
<base href="/ThesisProject/">
<body>

	<div class="container">
		<div class="navbar navbar-inverse" ng-controller="loginCtrl">
			<div class="navbar-inner">
					<a class="brand" href="/ThesisProject"> Home </a>
			</div>
			<div class="navbar-inner">
				<a ng-click="logout()"> Logout </a>
			</div>
		</div>

		<div class="content-main" ui-view></div>



		<div id="footer">
			<div class="container">
				<span class="pull-right text-info credit">Smiled Platform</span>
			</div>
		</div>
	</div>
	
	<!-- VENDOR SCRIPT -->
	<script src="assets/public/js/vendor/angular/angular.js"></script>
	<script src="assets/public/js/vendor/angular-cookies/angular-cookies.js"></script>
	<script src="assets/public/js/vendor/angular-ui-router/release/angular-ui-router.js"></script>
	<script src="assets/public/js/vendor/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js"></script>
	<script src="assets/public/js/vendor/ngstorage/ngStorage.js"></script>
	<script src="assets/public/js/vendor/angular-resource/angular-resource.js"></script>
	<script src="assets/public/js/vendor/angular-permission/dist/angular-permission.js"></script>
	<script src="assets/public/js/vendor/lodash/lodash.js"></script>
	<script src="assets/public/js/vendor/restangular/src/restangular.js"></script>
	<!-- CUSTOM SCRIPT -->
	<script src="assets/public/js/app.js"></script>
	<script src="assets/public/js/router.js"></script>
	<script src="assets/public/js/controllers/shellController.js"></script>
	<script src="assets/public/js/controllers/loginController.js"></script>
	<script src="assets/public/js/controllers/dashboardController.js"></script>
	<script src="assets/public/js/services/userService.js"></script>
	<script src="assets/public/js/services/apiService.js"></script>
</body>
</html>
