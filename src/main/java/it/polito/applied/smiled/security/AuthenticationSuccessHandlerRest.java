package it.polito.applied.smiled.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component("authenticationSuccessHandler")
public class AuthenticationSuccessHandlerRest extends SavedRequestAwareAuthenticationSuccessHandler{
	
	@Value("${session.maxTimeInterval}")
    private int maxTimeInterval;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
			throws ServletException, IOException
	{
		request.getSession().invalidate();
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.setStatus(HttpStatus.OK.value());
        request.getSession().setMaxInactiveInterval(maxTimeInterval);
		request.getSession().setAttribute("ip", request.getRemoteAddr());
		request.getSession().setAttribute("loggedUser", authentication.getPrincipal());
		System.out.println(request.getSession().getAttribute("logged"));
		response.getWriter().println("{\"success\":\"true\"}");
	}
}
