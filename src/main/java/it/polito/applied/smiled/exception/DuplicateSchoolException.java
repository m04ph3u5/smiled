package it.polito.applied.smiled.exception;

public class DuplicateSchoolException extends Exception {
	
	private String message;
	private String schoolName;
	private String schoolCity;
	private String schoolRegion;

	public DuplicateSchoolException() {
		super();
	}

	public DuplicateSchoolException(String schoolName, String schoolCity, String schoolRegion) {
		super();
		this.message = "La scuola "+schoolName+" nella città di "+schoolCity+" - "+schoolRegion+" è già stata registrata nel sistema";
	}

	public DuplicateSchoolException(Throwable cause) {
		super(cause);
	}

	@Override
	public String toString() {
		return "DuplicateSchoolException: "+message;
	}

	@Override
	public String getMessage() {
		return message;
	}
}
