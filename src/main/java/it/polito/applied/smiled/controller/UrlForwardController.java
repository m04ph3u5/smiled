package it.polito.applied.smiled.controller;

import it.polito.applied.smiled.security.CustomUserDetails;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class UrlForwardController{

	@RequestMapping(value="/*")
	public String index() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if(auth.isAuthenticated()){
			System.out.println("UrlForwardController "+auth.getPrincipal());
		}else{
			System.out.println("UrlForwardController - NOT LOGGED");
		}
	    return "index";
	}
	

	
}
