<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>

<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Registrati!</title>
<!-- Le styles -->
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="assets/css/bootstrap.css" rel="stylesheet">

<style>
body {
	padding-top: 60px; /* 60px to make the container go all the way
      to the bottom of the topbar */
}
</style>

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
	
<style>
      body { padding-top: 60px; /* 60px to make the container go all the way
      to the bottom of the topbar */ }
    </style>
<style type="text/css">

.error {
	color: #ff0000;
}
.errorblock {
	color: #ff0000;
	background-color: #ffEEEE;
	border: 3px solid #ff0000;
	padding: 8px;
	margin: 16px;
}
</style>
</head>

<body>
	<div class="navbar navbar-fixed-top navbar-inverse">
		<div class="navbar-inner">
			<div class="container">
				<a class="brand" href="/ThesisProject"> Home </a>
			</div>
		</div>
	</div>

	<div class="container">
		<div class="hero-unit">
			<h1>Registrati su Smiled</h1>
			<div>
				<p>Pagina di registrazione dei docenti!</p>
			</div>

			<form:form commandName="register">
				<div class="form-group">
					<form:errors path="*" cssClass="errorblock" element="div" />
					<label for="textinputEmail"> Email: </label>
					<form:input type="email" path="email" cssErrorClass="error" />
					<form:errors path="email" cssClass="error" />
					<div class="error">${errorMessage}</div>
				</div>
				<div class="form-group">
				<label for="textinputPassword"> Password: </label>
				<form:input path="password" type="password" cssErrorClass="error" />
				<form:errors path="password" cssClass="error" />
				</div>
				<div class="form-group">
				<label for="textinputFirstName"> First name: </label>
				<form:input path="firstName" cssErrorClass="error" />
				<form:errors path="firstName" cssClass="error" />
				</div>
				<div class="form-group">
				<label for="textinputLastName"> Last name: </label>
				<form:input path="lastName" cssErrorClass="error" />
				<form:errors path="lastName" cssClass="error" />
				</div>
				<div class="form-group">
				<label for="textinputGender"> Gender (M/F): </label>
				<form:input path="gender" cssErrorClass="error" />
				<form:errors path="gender" cssClass="error" />
				</div>
				<div class="form-group">
				<label for="textinputMatter"> Matter: </label>
				<form:input path="matter" cssErrorClass="error" />
				<form:errors path="matter" cssClass="error" />
				</div>
				<button type="submit" class="btn btn-primary btn-lg" name="submit" value="Sign Up!" >Registrati</button>
			</form:form>
			
		</div>
	</div>

	<script src="assets/js/jquery.min.js"></script>
	<script src="assets/js/bootstrap.min.js"></script>
	<script src="assets/js/angular.min.js"></script>
	<script src="assets/js/app.js"></script>
	<script src="assets/js/GetSchoolsController.js"></script>
</body>
</html>