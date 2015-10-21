package it.polito.applied.smiled.dto;
//package it.polito.applied.smiled.controller;
//
//import it.polito.applied.smiled.dto.RegisterTeacherDTO;
//import it.polito.applied.smiled.dto.SetPasswordDTO;
//import it.polito.applied.smiled.exception.BadCredentialsException;
//import it.polito.applied.smiled.exception.BadRequestException;
//import it.polito.applied.smiled.exception.InvalidRegistrationTokenException;
//import it.polito.applied.smiled.exception.RegistrationTokenExpiredException;
//import it.polito.applied.smiled.exception.UserAlreadyExistsException;
//import it.polito.applied.smiled.exception.UserNotFoundException;
//import it.polito.applied.smiled.service.UserServiceImpl;
//
//import javax.validation.Valid;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.mongodb.core.MongoDataIntegrityViolationException;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.validation.BindingResult;
//import org.springframework.web.bind.annotation.ModelAttribute;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestMethod;
//import org.springframework.web.bind.annotation.RequestParam;
//
//import com.mongodb.MongoException;
//
//@Controller
//public class RegisterController extends BaseController {
//	
//	@Autowired
//	UserServiceImpl userService;
//	
//	@RequestMapping(value="register", method=RequestMethod.GET)
//	public String register(Model model){
//		RegisterTeacherDTO register = new RegisterTeacherDTO();
//		model.addAttribute("register",register);
//		
//		return "register";
//	}
//	
//	@RequestMapping(value="register", method=RequestMethod.POST)
//	public String register(@Valid @ModelAttribute("register") RegisterTeacherDTO register, BindingResult bindingResult) throws UserAlreadyExistsException, MongoException, BadRequestException, MongoDataIntegrityViolationException{
//
//		if(bindingResult.hasErrors()) {
//			return "register";
//		}
//		
//		userService.registerTeacher(register);
//		
//		return "checkRegister";
//	}
//	
//	@RequestMapping(value="registrationConfirm", method=RequestMethod.GET)
//	public String registrationConfirm(@RequestParam(value="token") String token, @RequestParam(value="email") String email) throws MongoException, InvalidRegistrationTokenException, UserNotFoundException, RegistrationTokenExpiredException{
//	    userService.confirmRegistration(token,email);
//		return "registrationConfirm";
//	}
//	
//	@RequestMapping(value="setPassword", method=RequestMethod.GET)
//	public String setPassword(Model model){
//		
//		SetPasswordDTO setPassword = new SetPasswordDTO();
//		model.addAttribute("setPassword", setPassword);
//		return "setPassword";
//	}
//	
//	@RequestMapping(value="setPassword", method=RequestMethod.POST)
//	public String setPassword(@ModelAttribute @Valid SetPasswordDTO setPassword, BindingResult result) throws UserNotFoundException, BadCredentialsException, MongoException, BadRequestException{
//		
//		if(result.hasErrors()){
//			return "setPassword";
//		}
//	    userService.changePassword(setPassword.getEmail(),setPassword.getOldPassword(),setPassword.getNewPassword());
//		return "redirect:";
//		
//	}
//}
