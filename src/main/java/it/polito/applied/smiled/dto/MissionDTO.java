package it.polito.applied.smiled.dto;

import it.polito.applied.smiled.pojo.scenario.MissionStatus;

import java.util.Date;

public class MissionDTO {

	private String characterId;
	
	private String title;
	private String description;
	
	private MissionStatus status;
	
	
	public String getCharacterId() {
		return characterId;
	}
	public void setCharacterId(String characterId) {
		this.characterId = characterId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	public MissionStatus getStatus() {
		return status;
	}
	public void setStatus(MissionStatus status) {
		this.status = status;
	}
	
}