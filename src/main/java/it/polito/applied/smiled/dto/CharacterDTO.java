package it.polito.applied.smiled.dto;

import java.util.Date;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.Size;

public class CharacterDTO {
	
	
	private String id;
	@NotNull
	@Size(min=2,max=64)
	private String name;
	private String nickname;
	private String description;
	private Date birthDate;
	private Date deadDate;
	private String cover;
	private String quote;
	private String gender;
	private String role;
	private String bornTown;
	private String deadTown;
	@Null //Nella post del nuovo character non può esserci già il legame con l'utente che lo interpreta
	private String actualUserId;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Date getBirthDate() {
		return birthDate;
	}
	public void setBirthDate(Date birthDate) {
		this.birthDate = birthDate;
	}
	public Date getDeadDate() {
		return deadDate;
	}
	public void setDeadDate(Date deadDate) {
		this.deadDate = deadDate;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getCover() {
		return cover;
	}
	public void setCover(String cover) {
		this.cover = cover;
	}
	public String getActualUserId() {
		return actualUserId;
	}
	public void setActualUserId(String actualUserId) {
		this.actualUserId = actualUserId;
	}
	public String getQuote() {
		return quote;
	}
	public void setQuote(String quote) {
		this.quote = quote;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public String getBornTown() {
		return bornTown;
	}
	public void setBornTown(String bornTown) {
		this.bornTown = bornTown;
	}
	public String getDeadTown() {
		return deadTown;
	}
	public void setDeadTown(String deadTown) {
		this.deadTown = deadTown;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public String getNickname() {
		return nickname;
	}
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
	
	
}
