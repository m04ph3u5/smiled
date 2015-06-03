package it.polito.applied.smiled.exception;

public class ForbiddenException extends Exception{
	
	private String message;

	public ForbiddenException() {
		super();
	}

	public ForbiddenException(String message) {
		super();
		this.message = message;
	}

	public ForbiddenException(Throwable cause) {
		super(cause);
	}

	@Override
	public String toString() {
		return "ForbiddenException: "+message;
	}

	@Override
	public String getMessage() {
		return message;
	}
}
