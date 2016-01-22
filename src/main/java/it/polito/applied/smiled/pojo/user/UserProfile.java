package it.polito.applied.smiled.pojo.user;

import java.util.Date;

public class UserProfile {

	//TODO - ATTENZIONE se modifichiamo questa classe ricordiamoci di aggiornare
	// la updateUser di userServiceImpl e lo UserDTOValidator (ed eventuali altre classi)
	protected Boolean gender; //false= donna; true= uomo
	
	protected Date bornDate;
	protected String bornCity;
	protected String schoolCity;
	protected String school;
	protected String quote;
	protected String coverPhotoId;
	protected String largeCoverPhotoId;
	
	public String getQuote() {
		return quote;
	}

	public void setQuote(String quote) {
		this.quote = quote;
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

	

	public Boolean getGender() {
		return gender;
	}

	public void setGender(Boolean gender) {
		this.gender = gender;
	}

	public String getCoverPhotoId() {
		return coverPhotoId;
	}

	public void setCoverPhotoId(String coverPhotoId) {
		this.coverPhotoId = coverPhotoId;
	}

	public Date getBornDate() {
		return bornDate;
	}

	public void setBornDate(Date bornDate) {
		this.bornDate = bornDate;
	}

	public String getLargeCoverPhotoId() {
		return largeCoverPhotoId;
	}

	public void setLargeCoverPhotoId(String largeCoverPhotoId) {
		this.largeCoverPhotoId = largeCoverPhotoId;
	}
	
	
	
}
