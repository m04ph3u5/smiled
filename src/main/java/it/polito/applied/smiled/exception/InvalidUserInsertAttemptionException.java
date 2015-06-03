package it.polito.applied.smiled.exception;

import it.polito.applied.smiled.pojo.Reference;

import java.util.List;

public class InvalidUserInsertAttemptionException extends Exception {
	
	private String message;
	private List<Reference> failureUsers;

	public InvalidUserInsertAttemptionException() {
		super();
	}
	
	public InvalidUserInsertAttemptionException(List<Reference> failureUsers) {
		super();
		this.failureUsers=failureUsers;
	}

	public InvalidUserInsertAttemptionException(String message) {
		super();
		this.message = message;
	}

	public InvalidUserInsertAttemptionException(Throwable cause) {
		super(cause);
	}

	@Override
	public String toString() {
		return "InvalidUserInsertAttemptionException: "+message;
	}

	@Override
	public String getMessage() {
		return message;
	}
	
	public List<Reference> getFailureUsers(){
		return failureUsers;
	}
}
