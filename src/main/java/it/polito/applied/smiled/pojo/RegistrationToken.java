package it.polito.applied.smiled.pojo;

import java.util.Calendar;
import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class RegistrationToken {
	
	@Id
	private String id;
	@Indexed(unique=true)
	private String email;
	private String token;
	private Date expiration;
	@Value("${registrationToken.expiration.days}")
	private int expirationDaysTeacher;
	
	public RegistrationToken(){}
	
	public RegistrationToken(String email){
		this.email=email;
		token=UUID.randomUUID().toString();
		Calendar cal = Calendar.getInstance();
        cal.setTime(new Date());
       	cal.add(Calendar.DATE, expirationDaysTeacher);
        expiration=cal.getTime();
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

	public Date getExpiration() {
		return expiration;
	}
	
}
