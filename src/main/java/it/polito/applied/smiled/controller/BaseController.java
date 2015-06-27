package it.polito.applied.smiled.controller;

import it.polito.applied.smiled.dto.RegisterTeacherDTO;
import it.polito.applied.smiled.exception.BadCredentialsException;
import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.exception.InvalidRegistrationTokenException;
import it.polito.applied.smiled.exception.RegistrationTokenExpiredException;
import it.polito.applied.smiled.exception.UserAlreadyExistsException;
import it.polito.applied.smiled.exception.UserNotFoundException;

import org.springframework.data.mongodb.core.MongoDataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.ModelAndView;

public abstract class BaseController {
	
	//TODO
	/*1. Creare la pagina di errore (400 da cambiare) così da ritornare sempre la stessa ai client
	 *2. Inserire log dettagliati con i messaggi delle singole eccezioni 
	 *3. Eventualmente aggiungere Service per la gestione della sicurezza (es. troppe richieste ...)*/
	
//	@ExceptionHandler(BadCredentialsException.class)
//	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
//	public String handleBadCredentialsException(BadCredentialsException e){
//		return "400";
//	}
//	
//	@ExceptionHandler(BadRequestException.class)
//	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
//	public String handleBadRequestException(BadRequestException e){
//		return "400";
//	}
//	
//	@ExceptionHandler(UserNotFoundException.class)
//	@ResponseStatus(value = HttpStatus.NOT_FOUND)
//	public String handleUserNotFoundException(UserNotFoundException e){
//		return "404";
//	}
//	
//	@ExceptionHandler(MongoDataIntegrityViolationException.class)
//	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
//	public String handleMongoDataIntegrityViolationException(MongoDataIntegrityViolationException e){
//		return "500";
//	}
	
	@ExceptionHandler(InvalidRegistrationTokenException.class)
	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
	public String handleInvalidRegistrationTokenException(InvalidRegistrationTokenException e){
		System.out.println("InvalidRegistrationTokenExcpetion: "+e.getMessage());
		return "index";
	}

//	@ExceptionHandler(RegistrationTokenExpiredException.class)
//	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
//	public ModelAndView handleRegistrationTokenExpiredException(RegistrationTokenExpiredException e){
//		ModelAndView m = new ModelAndView("register");
//		RegisterTeacherDTO r = new RegisterTeacherDTO();
//		m.addObject("register", r);
//		m.addObject("errorMessage", "Registrati nuovamente al sistema");
//		return m;
//	}
//	
//	@ExceptionHandler(UserAlreadyExistsException.class)
//	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
//	public ModelAndView handleUserAlreadyExistsException(UserAlreadyExistsException e){
//		
//		ModelAndView m = new ModelAndView("register");
//		RegisterTeacherDTO r = new RegisterTeacherDTO();
//		m.addObject("register", r);
//		m.addObject("errorMessage", e.getUserEmail()+" email già registrata nel sistema");
//		return m;
//	}
//	
//	
//	
//	@ExceptionHandler(Exception.class)
//	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
//	public String handleGenericException(Exception e){
//		return "400";
//	}
}
