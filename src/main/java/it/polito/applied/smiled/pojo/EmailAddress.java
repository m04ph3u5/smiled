package it.polito.applied.smiled.pojo;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Email;

public class EmailAddress {
	
	@NotNull
	@Email
	private String email;

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	
	

}
