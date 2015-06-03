package it.polito.applied.smiled.exception;

import java.util.Date;

import it.polito.applied.smiled.repository.RegistrationRepository;
import it.polito.applied.smiled.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;

public class RegistrationTokenExpiredException extends Exception{
private String message;
private String userEmail;

	public RegistrationTokenExpiredException() {
		super();
	}

	public RegistrationTokenExpiredException(Date date, String email) {
		super();
		this.message = "Registration request is expired on "+date;
		this.userEmail=email;		
	}

	public RegistrationTokenExpiredException(Throwable cause) {
		super(cause);
	}

	@Override
	public String toString() {
		return message;
	}

	@Override
	public String getMessage() {
		return message;
	}

	public String getUserEmail() {
		return userEmail;
	}	
	
}
