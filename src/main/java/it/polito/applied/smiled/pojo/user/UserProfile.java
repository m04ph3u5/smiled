package it.polito.applied.smiled.pojo.user;

import java.util.Date;

public class UserProfile {

	//TODO - ATTENZIONE se modifichiamo questa classe ricordiamoci di aggiornare
	// la updateUser di userServiceImpl e lo UserDTOValidator (ed eventuali altre classi)
	protected String gender;
	protected String coverPhotoId;
	protected String largeCoverPhotoId;
	protected Date bornDate;
	protected String bornCity;
	protected String actualCity;
	protected String school;
	protected String quote;
	
	
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

	public String getActualCity() {
		return actualCity;
	}

	public void setActualCity(String actualCity) {
		this.actualCity = actualCity;
	}

	public String getSchool() {
		return school;
	}

	public void setSchool(String school) {
		this.school = school;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
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
