package it.polito.applied.smiled.security;

import it.polito.applied.smiled.exception.ErrorInfo;
import it.polito.applied.smiled.exception.JacksonUtil;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import com.mongodb.MongoException;

@Component("authenticationFailureHandler")
public class AuthenticationFailureHandlerRest extends SimpleUrlAuthenticationFailureHandler {
	
	@Override
	public void onAuthenticationFailure(HttpServletRequest request,
			HttpServletResponse response, AuthenticationException exception)
			throws IOException, ServletException {
		
		ErrorInfo e = new ErrorInfo();
		
		if(exception.getClass().equals((MongoException.class))){
			e.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.toString());
			response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
			e.setMessage("C'è stato un problema inatteso. Per favore riprova più tardi a loggarti di nuovo");
		}else{
			e.setStatusCode(HttpStatus.UNAUTHORIZED.toString());
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			e.setMessage("Email e/o password errati");
		}
		
		String json = JacksonUtil.toJSON(e);

		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.getWriter().println(json);
	}

}
