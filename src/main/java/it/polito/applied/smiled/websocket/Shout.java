package it.polito.applied.smiled.websocket;

public class Shout {

	private String message;
	
	public Shout(){
		
	}
	
	public Shout(String message){
		this.message=message;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
	
	
}
