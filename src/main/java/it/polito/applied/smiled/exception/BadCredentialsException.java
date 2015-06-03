package it.polito.applied.smiled.exception;

public class BadCredentialsException extends Exception{
	
	private String message;

	public BadCredentialsException() {
		super();
	}

	public BadCredentialsException(String message) {
		super();
		this.message = message;
	}

	public BadCredentialsException(Throwable cause) {
		super(cause);
	}

	@Override
	public String toString() {
		return "BadCredentialsException: "+message;
	}

	@Override
	public String getMessage() {
		return message;
	}
}

