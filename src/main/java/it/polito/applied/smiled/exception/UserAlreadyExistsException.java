package it.polito.applied.smiled.exception;

public class UserAlreadyExistsException extends Exception {

	private String message="";
	private String userEmail="";

	public UserAlreadyExistsException() {
		super();
	}
	
	public UserAlreadyExistsException(String userEmail) {
		super();
		this.userEmail=userEmail;
	}
	
	public UserAlreadyExistsException(String userEmail, String message) {
		super();
		this.userEmail=userEmail;
		this.message=message;
	}

	public UserAlreadyExistsException(Throwable cause) {
		super(cause);
	}

	@Override
	public String toString() {
		return "UserAlreadyExistsException: "+message;
	}

	@Override
	public String getMessage() {
		return message;
	}

	public String getUserEmail() {
		return userEmail;
	}
}
