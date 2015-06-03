package it.polito.applied.smiled.dto;

import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.Email;

public class SetPasswordDTO {
	
	@Email
	@Size(min=4,max=64)
	private String email;

	@Size(min=8,max=128)
	private String oldPassword;
	
	@Size(min=8,max=128)
	private String newPassword;

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getOldPassword() {
		return oldPassword;
	}

	public void setOldPassword(String oldPassword) {
		this.oldPassword = oldPassword;
	}

	public String getNewPassword() {
		return newPassword;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}
	
	
}
