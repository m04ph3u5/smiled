package it.polito.applied.smiled.security;

import it.polito.applied.smiled.exception.ErrorInfo;
import it.polito.applied.smiled.exception.JacksonUtil;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component("restServicesEntryPoint")
public class AuthenticationEntryPointRest extends LoginUrlAuthenticationEntryPoint{

	public AuthenticationEntryPointRest()
	{
		super("/login");
	}

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
			throws IOException, ServletException
	{
		String path = request.getRequestURI().substring(request.getContextPath().length());
		
		if (path.startsWith("/assets") || path.startsWith("/api") || path.startsWith("/websocket")) {
			ErrorInfo e = new ErrorInfo();
			e.setStatusCode(HttpStatus.UNAUTHORIZED.toString());
			e.setMessage("Devi essere loggato per accedere a questa risorsa");


			String json = JacksonUtil.toJSON(e);
			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			response.getWriter().println(json);
		} else{
		    response.sendRedirect("/ThesisProject#"+path);
		}
		
	

		
	}
}
