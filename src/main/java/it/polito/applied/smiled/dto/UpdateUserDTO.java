package it.polito.applied.smiled.dto;

import java.util.Date;

public class UpdateUserDTO {

	private Boolean gender;
	private Date bornDate;
	private String bornCity;
	private String schoolCity;
	private String school;
	private String quote;
	
	
	public Boolean getGender() {
		return gender;
	}
	public void setGender(Boolean gender) {
		this.gender = gender;
	}
	public Date getBornDate() {
		return bornDate;
	}
	public void setBornDate(Date bornDate) {
		this.bornDate = bornDate;
	}
	public String getBornCity() {
		return bornCity;
	}
	public void setBornCity(String bornCity) {
		this.bornCity = bornCity;
	}
	public String getSchoolCity() {
		return schoolCity;
	}
	public void setSchoolCity(String schoolCity) {
		this.schoolCity = schoolCity;
	}
	public String getSchool() {
		return school;
	}
	public void setSchool(String school) {
		this.school = school;
	}
	public String getQuote() {
		return quote;
	}
	public void setQuote(String quote) {
		this.quote = quote;
	}
	
	
	
}
