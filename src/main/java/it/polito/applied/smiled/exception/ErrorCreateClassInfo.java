package it.polito.applied.smiled.exception;

import it.polito.applied.smiled.pojo.Reference;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ErrorCreateClassInfo extends ErrorInfo{

	private Map<String,String> failedUsers;
	
	public ErrorCreateClassInfo(){
		super();
		failedUsers = new HashMap<String,String>();
	}
	
	public ErrorCreateClassInfo(List<Reference> u){
		super();
		this.setMessage("ErrorCreateClass");
		failedUsers = new HashMap<String,String>();
		for(Reference err: u){
			failedUsers.put(err.getEmail(), err.getFirstname());
		}
	}
	
	public Map<String,String> getFailedUsers(){
		return failedUsers;
	}
	
	public void addFailedUser(String email, String code){
		failedUsers.put(email, code);
	}
}
