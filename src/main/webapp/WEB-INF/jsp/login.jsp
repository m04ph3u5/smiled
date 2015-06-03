<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fun" uri="http://java.sun.com/jsp/jstl/functions"%>

<!DOCTYPE html>
<html lang="it">
<head>
<title>Login</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="assets/css/bootstrap.css" rel="stylesheet">

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

<body onload='document.f.j_username.focus();'>
	<div class="navbar navbar-fixed-top navbar-inverse">
		<div class="navbar-inner">
			<div class="container">
				<a class="brand" href="/ThesisProject"> Home </a>
			</div>
		</div>
	</div>


	<div class="container">
		<div class="hero-unit">
			<h1>Pagina di Login di Smiled</h1>
			<div>
				<p>
					Per iniziare è necessario essere registrati, proponilo alla tua scuola!				
				</p>
			
			</div>
			<c:if test="${not empty error}">
				<div class="errorblock">
					Il tuo tentativo di login è fallito.<br> A causa di:
					<c:out value= "${SPRING_SECURITY_LAST_EXCEPTION.message}"/>
				</div>
			</c:if>


			<form action="j_spring_security_check" role="form" name="f"
				method="post">
				<div class="form-group">
					<label for="email">Email:</label> <input type="email"
						name="j_username" class="form-control" id="email"
						placeholder="Inserisci l'email">
				</div>
				<div class="form-group">
					<label for="pwd">Password:</label> <input type="password"
						name="j_password" class="form-control" id="pwd"
						placeholder="Inserisci la password">
				</div>
				<div class="checkbox">
					<label><input id="remember_me"
						name="_spring_security_remember_me" type="checkbox">
						Ricordami</label>
				</div>
				<div class="form-group">
					<button type="submit" class="btn btn-primary btn-lg" name="submit">Entra</button>
					<a href="register.html" class="btn btn-default">Registrati!</a>
				</div>
			</form>
		</div>
	</div>


	<script src="assets/js/jquery.min.js"></script>
	<script src="assets/js/bootstrap.min.js"></script>

</body>
</html>