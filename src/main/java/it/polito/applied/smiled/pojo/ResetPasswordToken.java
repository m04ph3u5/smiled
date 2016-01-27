package it.polito.applied.smiled.pojo;

import java.util.Date;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class ResetPasswordToken {
	
	@Id
	private String id;
	@Indexed(unique=true)
	private String email;
	private String token;
	@Indexed(expireAfterSeconds=86400)
	private Date date;
	          
	
	public ResetPasswordToken(){}
	
	public ResetPasswordToken(String email){
		this.email=email;
		token=UUID.randomUUID().toString();
		date = new Date();
	}
	
	public String getId() {
		return id;
	}

	public String getEmail() {
		return email;
	}

	public String getToken() {
		return token;
	}

	public Date getDate(){
		return date;
	}
		
}
