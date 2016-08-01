package it.polito.applied.smiled.exception;

public class NotFoundException extends Exception{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 7582127337335436115L;
	private String message;

	public NotFoundException() {
		super();
	}

	public NotFoundException(String message) {
		super();
		this.message = message;
	}

	public NotFoundException(Throwable cause) {
		super(cause);
	}

	@Override
	public String toString() {
		return "NotFoundException: "+message;
	}

	@Override
	public String getMessage() {
		return message;
	}
}
