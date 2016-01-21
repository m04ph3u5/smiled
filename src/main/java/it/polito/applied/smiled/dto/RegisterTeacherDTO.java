package it.polito.applied.smiled.dto;

import java.util.Date;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.Email;

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
	private Date bornDate;
	
	@NotNull
	private String schoolCity;
	
	@NotNull
	private String bornCity;
	
	@NotNull
	private String nameOfSchool;
	
	@NotNull
	private boolean agree;
	
	

	public boolean isAgree() {
		return agree;
	}

	public void setAgree(boolean agree) {
		this.agree = agree;
	}

	public String getSchoolCity() {
		return schoolCity;
	}

	public void setSchoolCity(String schoolCity) {
		this.schoolCity = schoolCity;
	}

	public String getBornCity() {
		return bornCity;
	}

	public void setBornCity(String bornCity) {
		this.bornCity = bornCity;
	}

	public String getNameOfSchool() {
		return nameOfSchool;
	}

	public void setNameOfSchool(String nameOfSchool) {
		this.nameOfSchool = nameOfSchool;
	}

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

	public Date getBornDate() {
		return bornDate;
	}

	public void setBornDate(Date bornDate) {
		this.bornDate = bornDate;
	}

	
	
}
