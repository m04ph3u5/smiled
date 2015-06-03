package it.polito.applied.smiled.exception;


public class UserNotFoundException extends Exception{

	private String message;

	public UserNotFoundException() {
		super();
	}

	public UserNotFoundException(String email) {
		super();
		this.message = "User with email '"+email+"' not found";
	}

	public UserNotFoundException(Throwable cause) {
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
