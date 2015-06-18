<%@taglib prefix="sec"
	uri="http://www.springframework.org/security/tags"%>
<!DOCTYPE html>
<html lang="it">

<head>
<meta charset="utf-8">
<title>Home</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- Le styles -->
<link href="assets/css/bootstrap.css" rel="stylesheet">
<link href="assets/css/bootstrap-responsive.css" rel="stylesheet">


<style>
body {
	padding-top: 60px; /* 60px to make the container go all the way
      to the bottom of the topbar */
}
</style>


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

</head>
<body>
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
				<h1>
					Benvenuto su Smiled <small><sec:authentication
							property="name" /></small>
				</h1>
				<sec:authorize ifAnyGranted="ROLE_TEACHER">
					<p>
						Pagina di gestione del docente
						<sec:authentication property="name" />
					</p>
			</div>
			<a class="btn btn-primary" href="/ThesisProject/createScenario.html">
				Crea uno scenario » </a>
			</sec:authorize>
			<sec:authorize access="!hasRole('ROLE_TEACHER')">
				<a class="btn btn-primary" href=""> I miei docenti » </a>
			</sec:authorize>
			<a class="btn btn-primary" href=""> I miei dati personali » </a> <a
				class="btn btn-primary" href=""> I miei scenari » </a> <a
				class="btn btn-warninig" href="j_spring_security_logout"> Logout
				» </a>
		</div>
		
		<div class="hero-unit">
			<form method="POST" enctype="multipart/form-data" action="/ThesisProject/api/v1/upload">
				File to upload: <input type="file" name="profilePicture">
				<br /> 
				<input type="submit" value="Upload"> 
				Press here to upload the file!
			</form>
		</div>
		
		<div></div>

	</div>

	<script type="text/javascript" src="assets/js/jquery.min.js"></script>
	<script type="text/javascript" src="assets/js/bootstrap.js"></script>
</body>
</html>
