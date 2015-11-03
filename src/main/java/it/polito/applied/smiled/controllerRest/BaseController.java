package it.polito.applied.smiled.controllerRest;

import java.io.FileNotFoundException;
import java.io.IOException;

import it.polito.applied.smiled.exception.BadCredentialsException;
import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.exception.DuplicateSchoolException;
import it.polito.applied.smiled.exception.ErrorCreateClassInfo;
import it.polito.applied.smiled.exception.ErrorInfo;
import it.polito.applied.smiled.exception.ForbiddenException;
import it.polito.applied.smiled.exception.InvalidRegistrationTokenException;
import it.polito.applied.smiled.exception.InvalidUserInsertAttemptionException;
import it.polito.applied.smiled.exception.NotFoundException;
import it.polito.applied.smiled.exception.UserNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.mongodb.MongoException;

//TODO aggiungere alle eccezioni tutti gli Errors provenienti dalle validazioni, in modo da poterli loggare correttamente

public abstract class BaseController {
	
	@ExceptionHandler(BadRequestException.class)
	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
	public ErrorInfo handleBadRequestException(BadRequestException e){
		ErrorInfo error = new ErrorInfo();
		error.setMessage(e.getMessage());
		error.setStatusCode("400");
		/*DA INSERIRE URL*/
		return error;
	}
	
	@ExceptionHandler(UserNotFoundException.class)
	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
	public ErrorInfo handleUserNotFoundException(UserNotFoundException e){
		ErrorInfo error = new ErrorInfo();
		error.setMessage(e.getMessage());
		error.setStatusCode("400");
		/*DA INSERIRE URL*/
		return error;
	}
	
	@ExceptionHandler(ForbiddenException.class)
	@ResponseStatus(value = HttpStatus.FORBIDDEN)
	public ErrorInfo handleForbiddenException(ForbiddenException e){
		ErrorInfo error = new ErrorInfo();
		error.setMessage(e.getMessage());
		error.setStatusCode("403");
		/*DA INSERIRE URL*/
		return error;
	}
	
	@ExceptionHandler(NotFoundException.class)
	@ResponseStatus(value = HttpStatus.NOT_FOUND)
	public ErrorInfo handleNotFoundException(NotFoundException e){
		ErrorInfo error = new ErrorInfo();
		error.setMessage(e.getMessage());
		error.setStatusCode("404");
		/*DA INSERIRE URL*/
		return error;
	}
	
	@ExceptionHandler(BadCredentialsException.class)
	@ResponseStatus(value = HttpStatus.FORBIDDEN)
	public ErrorInfo handleBadCredentialsException(BadCredentialsException e){
		ErrorInfo error = new ErrorInfo();
		error.setMessage(e.getMessage());
		error.setStatusCode("403");
		/*DA INSERIRE URL*/
		return error;
	}
	
	@ExceptionHandler(MongoException.class)
	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
	public ErrorInfo handleMongoException(MongoException e){
		ErrorInfo error = new ErrorInfo();
		error.setMessage("Internal server error");
		error.setStatusCode("500");
		return error;
	}
	
	
	@ExceptionHandler(DuplicateSchoolException.class)
	@ResponseStatus(value = HttpStatus.CONFLICT)
	public ErrorInfo handleDuplicateSchoolException(DuplicateSchoolException e){
		ErrorInfo error = new ErrorInfo();
		error.setMessage(e.getMessage());
		error.setStatusCode("409");
		return error;
	}
	
	@ExceptionHandler(InvalidUserInsertAttemptionException.class)
	@ResponseStatus(value = HttpStatus.PARTIAL_CONTENT)
	public ErrorCreateClassInfo handleInvalidUserInsertAttemptionException(InvalidUserInsertAttemptionException e){
		ErrorCreateClassInfo error = new ErrorCreateClassInfo(e.getFailureUsers());
		error.setStatusCode("206");
		return error;
	}
	
	
	@ExceptionHandler(HttpMessageNotReadableException.class)
	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
	public ErrorInfo handleHttpMessageNotReadableException(HttpMessageNotReadableException e){
		ErrorInfo error = new ErrorInfo();
		error.setStatusCode("400");
		System.out.println("HttpMessageNotReadableException: "+e.getMessage());
		return error;
	}
	
	
	@ExceptionHandler(HttpMediaTypeNotAcceptableException.class)
	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
	public ErrorInfo handleHttpMediaTypeNotAcceptableException(HttpMediaTypeNotAcceptableException e){
		ErrorInfo error = new ErrorInfo();
		error.setStatusCode("400");
		System.out.println("HttpMediaTypeNotAcceptableException: "+e.getMessage());
		error.setMessage(e.getMessage());
		return error;
	}
	
	
	
	@ExceptionHandler(AccessDeniedException.class)
	@ResponseStatus(value = HttpStatus.FORBIDDEN)
	public ErrorInfo handleAccessDeniedException(AccessDeniedException e){
		ErrorInfo error = new ErrorInfo();
		error.setStatusCode("403");
		System.out.println("FORBIDDEN");
		return error;
	}
	
	@ExceptionHandler(FileNotFoundException.class)
	@ResponseStatus(value = HttpStatus.NOT_FOUND)
	public ErrorInfo handleFileNotFoundException(FileNotFoundException e){
		ErrorInfo error = new ErrorInfo();
		error.setStatusCode("404");
//		System.out.println("File not found"+e.getMessage());
		return error;
	}
	
	@ExceptionHandler(IOException.class)
	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
	public ErrorInfo handleIOException(IOException e){
		ErrorInfo error = new ErrorInfo();
		error.setStatusCode("400");
		System.out.println("io exception: "+e.getMessage());
		return error;
	}
	
	@ExceptionHandler(Exception.class)
	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
	public ErrorInfo handleGenericException(Exception e){
		ErrorInfo error = new ErrorInfo();
		error.setStatusCode("400");
		System.out.println("generic exception: "+e.getClass()+" "+e.getMessage());
		return error;
	}
	
}
