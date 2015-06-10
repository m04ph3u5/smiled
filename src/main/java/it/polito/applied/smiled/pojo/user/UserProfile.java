package it.polito.applied.smiled.pojo.user;

import java.util.Date;

public class UserProfile {

	//TODO - ATTENZIONE se modifichiamo questa classe ricordiamoci di aggiornare
	// la updateUser di userServiceImpl e lo UserDTOValidator (ed eventuali altre classi)
	protected String gender;
	protected String coverPhoto;
	protected Date bornDate;
	
	
	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getCoverPhoto() {
		return coverPhoto;
	}

	public void setCoverPhoto(String coverPhoto) {
		this.coverPhoto = coverPhoto;
	}

	public Date getBornDate() {
		return bornDate;
	}

	public void setBornDate(Date bornDate) {
		this.bornDate = bornDate;
	}
	
	
	
}
