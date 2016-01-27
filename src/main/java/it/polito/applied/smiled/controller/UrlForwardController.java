package it.polito.applied.smiled.controller;

import it.polito.applied.smiled.dto.ResetPasswordDTO;
import it.polito.applied.smiled.exception.InvalidRegistrationTokenException;
import it.polito.applied.smiled.exception.RegistrationTokenExpiredException;
import it.polito.applied.smiled.exception.UserNotFoundException;
import it.polito.applied.smiled.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
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
	
	@RequestMapping(value="reset-password", method=RequestMethod.GET)
	public String resetPassword(@RequestParam(value="token") String token, @RequestParam(value="email") String email, Model m) throws MongoException, InvalidRegistrationTokenException, UserNotFoundException, RegistrationTokenExpiredException{
	    boolean b = userService.isPassworrdResettable(token,email);
	    if(b){
	    	m.addAttribute("token", token);
	    	m.addAttribute("email", email);
	    	return "resetPasswordPage";
	    }
	    else
	    	return "errorResetPasswordPage";
	}
	
	@RequestMapping(value="sendNewPassword", method=RequestMethod.POST)
	public String sendNewPassword(@ModelAttribute ResetPasswordDTO resetPassword, Model m) {
		
		boolean b = userService.resetPassword(resetPassword);
		if(b)
			return "passwordChanged";
		else
			return "errorResetPasswordPage";
	}
	
//	@RequestMapping(value="setPassword", method=RequestMethod.GET)
//	public String setPassword(Model model){
//		
//		FirstPasswordDTO firstPassword = new FirstPasswordDTO();
//		model.addAttribute("firstPassword", firstPassword);
//		return "setPassword";
//	}
//	
//	@RequestMapping(value="setPassword", method=RequestMethod.POST)
//	public String setPassword(@ModelAttribute @Valid FirstPasswordDTO firstPassword, BindingResult result) throws UserNotFoundException, BadCredentialsException, MongoException, BadRequestException{
//		System.out.println("setPassword post");
//		if(result.hasErrors()){
//
//			return "setPassword";
//		}
//		
//	    userService.changeFirstPassword(firstPassword);
//		return "redirect:login";
//		
//	}
	
	/*TODO gestire valori di ritorno quando vengono richieste pagine che non esistono
	 * Si potrebbe aggiungere un header alla risposta contenente l'url richiesto di modo che si Angular,
	 * attraverso un interceptor, di farsi carico della gestione di pagine di errore. */
	@RequestMapping(value="/**",method=RequestMethod.GET)
	public String index() {
		
	    return "index";
	}
	
	
}
