package it.polito.applied.smiled.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.Email;

public class FirstPasswordDTO {
	
	@NotNull
	@Size(min=8, max=128)
	private String oldPassword;
	@NotNull
	@Size(min=8, max=128)
	private String newPassword;
	@NotNull
	@Size(min=2, max=64)
	private String firstname;
	@NotNull
	@Size(min=2, max=64)
	private String lastname;
	
	@Email
	private String email;
	
	
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
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getFirstname() {
		return firstname;
	}
	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}
	public String getLastname() {
		return lastname;
	}
	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

}
