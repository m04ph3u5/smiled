package it.polito.applied.smiled.controller;

import it.polito.applied.smiled.controller.BaseController;
import it.polito.applied.smiled.dto.FirstPasswordDTO;
import it.polito.applied.smiled.dto.SetPasswordDTO;
import it.polito.applied.smiled.exception.BadCredentialsException;
import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.exception.InvalidRegistrationTokenException;
import it.polito.applied.smiled.exception.RegistrationTokenExpiredException;
import it.polito.applied.smiled.exception.UserNotFoundException;
import it.polito.applied.smiled.service.UserService;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.mongodb.MongoException;

@Controller
public class UrlForwardController extends BaseController{
	
	@Autowired
	UserService userService;

	@RequestMapping(value="registrationConfirm", method=RequestMethod.GET)
	public String registrationConfirm(@RequestParam(value="token") String token, @RequestParam(value="email") String email) throws MongoException, InvalidRegistrationTokenException, UserNotFoundException, RegistrationTokenExpiredException{
	    userService.confirmRegistration(token,email);
		return "index";
	}
	
	@RequestMapping(value="setPassword", method=RequestMethod.GET)
	public String setPassword(Model model){
		
		FirstPasswordDTO firstPassword = new FirstPasswordDTO();
		model.addAttribute("firstPassword", firstPassword);
		return "setPassword";
	}
	
	@RequestMapping(value="setPassword", method=RequestMethod.POST)
	public String setPassword(@ModelAttribute @Valid FirstPasswordDTO firstPassword, BindingResult result) throws UserNotFoundException, BadCredentialsException, MongoException, BadRequestException{
		System.out.println("setPassword post");
		if(result.hasErrors()){
			System.out.println("setPassword hasError");

			return "setPassword";
		}
		
	    userService.changeFirstPassword(firstPassword);
		return "index";
		
	}
	
	/*TODO gestire valori di ritorno quando vengono richieste pagine che non esistono
	 * Si potrebbe aggiungere un header alla risposta contenente l'url richiesto di modo che si Angular,
	 * attraverso un interceptor, di farsi carico della gestione di pagine di errore. */
	@RequestMapping(value="/**",method=RequestMethod.GET)
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
