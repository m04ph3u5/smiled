<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html ng-app="mainModule">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- Le styles -->
<link href="assets/css/bootstrap.css" rel="stylesheet">
<link rel="stylesheet"
	href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
<style>
body {
	padding-top: 60px; /* 60px to make the container go all the way
      to the bottom of the topbar */
}
</style>
<link href="assets/css/bootstrap-responsive.css" rel="stylesheet">

<link href="assets/css/jquery-ui.css" rel="stylesheet">
<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js">
      </script>
    <![endif]-->
<!-- Le fav and touch icons -->
<link rel="shortcut icon" href="assets/ico/favicon.ico">
<link rel="apple-touch-icon-precomposed" sizes="144x144"
	href="assets/ico/apple-touch-icon-144-precomposed.png">
<link rel="apple-touch-icon-precomposed" sizes="114x114"
	href="assets/ico/apple-touch-icon-114-precomposed.png">
<link rel="apple-touch-icon-precomposed" sizes="72x72"
	href="assets/ico/apple-touch-icon-72-precomposed.png">
<link rel="apple-touch-icon-precomposed"
	href="assets/ico/apple-touch-icon-57-precomposed.png">

<title>Crea scenario</title>
</head>
<body ng-controller="CreateScenarioController">
	<div class="navbar navbar-fixed-top navbar-inverse">
		<div class="navbar-inner">
			<div class="container">
				<a class="brand" href="/ThesisProject"> Home </a>
				<ul class="nav">
				</ul>
			</div>
		</div>
	</div>
	<div class="container">
		<div class="hero-unit">
			<div>
				<h1>Crea nuovo scenario</h1>
			</div>
			<div style="display: inline-block">
				<label>Nome</label><input type="text" ng-model="scenario.name">
				<label>Periodo storico</label>
				<input type="text" class="datepicker" name="fromDate" ng-model="scenario.history.startDate">
				<input type="text" class="datepicker" name="toDate" ng-model="scenario.history.endDate">

				</div>
			</div>
			<h3 align="center">Aggiungi i tuoi studenti</h3>
			<div>
				<form ng-submit="addStudent(user)">
					<div class="text-error" ng-show=>Lo studente è stato
						già inserito</div>
					<label>First name</label><input type="text" name="firstName"
						ng-model="user.firstName" required> <label>Last
						name</label><input type="text" name="lastName" ng-model="user.lastName"
						required> <label>Email</label><input type="email"
						name="email" ng-model="user.email"> <br> <input
						type="submit" value="Add student">
				</form>

			</div>
			<div ng-show="one">
				<form>
					<table id="listOfStudents">
						<tr>
							<th>First name</th>
							<th>Last name</th>
							<th>Email</th>
						</tr>
						<tr ng-repeat="user in users">
							<td><label>{{user.firstName}}</label></td>
							<td><label>{{user.lastName}}</label></td>
							<td><label>{{user.email}}</label></td>
							<td><input type="submit" value="Remove"
								ng-click="onRemoveUser(user)">
						</tr>
					</table>
					<br> <input type="submit" value="Create scanario"
						ng-click="onCreateClass()">
				</form>
			</div>
		</div>
	</div>
	
<script src="assets/js/angular.min.js"></script>
<script src="assets/js/app.js"></script>
<script src="assets/js/jquery-2.1.3.js"></script>
<script src="assets/js/jquery-ui.js"></script>
<script src="assets/js/CreateClassController.js"></script>
<script>
$(function(){
	$(".datepicker").datepicker({
		format: "dd/mm/yyyy",
		startView: 2,
		 language: "it"
	});
	
});
</script>
</body>
</html>