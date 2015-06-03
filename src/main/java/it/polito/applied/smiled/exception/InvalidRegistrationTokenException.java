package it.polito.applied.smiled.exception;

import it.polito.applied.smiled.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;

public class InvalidRegistrationTokenException extends Exception{

	private String message;
	
	public InvalidRegistrationTokenException() {
		super();
	}

	public InvalidRegistrationTokenException(String token, String email, UserRepository userRepository) {
		super();
		this.message = "Invalid token ("+token+") for "+email;
		System.out.println(message);
		if(userRepository==null)
			System.out.println("ERROR!!!");
		userRepository.deletePendingByEmail(email);
	}

	public InvalidRegistrationTokenException(Throwable cause) {
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
}
