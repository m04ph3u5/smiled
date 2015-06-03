package it.polito.applied.smiled.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;

public class RegisterTeacherDTO {

	
	@Email
	@Size(min=4, max=64)
	private String email;
	
	@Size(min=8, max=128)
	private String password;
	
	@Size(min=2, max=30)
	private String firstName;
	
	@Size(min=2, max=30)
	private String lastName;
	
	@NotNull
	@Size(min=1, max=1)
	private String gender;
	
	@NotNull
	@NotEmpty
	private String matter;

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getMatter() {
		return matter;
	}

	public void setMatter(String matter) {
		this.matter = matter;
	}
	
	
	
}
