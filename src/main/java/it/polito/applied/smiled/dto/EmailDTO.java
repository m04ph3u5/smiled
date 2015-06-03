package it.polito.applied.smiled.dto;

import org.hibernate.validator.constraints.Email;

public class EmailDTO {
	
	@Email
	private String email;

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	
}
