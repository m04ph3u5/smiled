package it.polito.applied.smiled.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.rememberme.RememberMeAuthenticationFilter;

public class RememberMeFilter extends RememberMeAuthenticationFilter  {

	@Override
	protected void onSuccessfulAuthentication(HttpServletRequest request,
            HttpServletResponse response,
            Authentication authResult){
		
		super.onSuccessfulAuthentication(request, response, authResult);
		request.getSession().setAttribute("loggedUser", authResult.getPrincipal());

	}
}
