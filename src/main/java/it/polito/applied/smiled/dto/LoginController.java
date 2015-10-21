package it.polito.applied.smiled.dto;
//package it.polito.applied.smiled.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.ModelMap;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestMethod;
//
//@Controller
//public class LoginController {
//
//	@RequestMapping(value="/login", method=RequestMethod.GET)
//	public String login(ModelMap model){
//		
//		return "login";
//	}
//	
//	@RequestMapping(value="/loginFailed", method=RequestMethod.GET)
//	public String loginFailed(ModelMap model){
//		model.addAttribute("error", "Username o password invalide");
//		return "login";
//	}
//	
//	@RequestMapping(value="/logout", method=RequestMethod.GET)
//	public String logout(ModelMap model){
//		return "redirect:index.jsp";
//	}
//	
//	@RequestMapping(value="/400")
//	public String error400(){
//		return "400";
//	}
//	
//	@RequestMapping(value="/404")
//	public String error404(){
//		return "404";
//	}
//	
//	@RequestMapping(value="/500")
//	public String error500(){
//		return "500";
//	}
//}
