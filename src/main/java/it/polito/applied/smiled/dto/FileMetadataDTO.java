package it.polito.applied.smiled.dto;

import it.polito.applied.smiled.pojo.FileMetadata;
import it.polito.applied.smiled.pojo.scenario.Place;
import it.polito.applied.smiled.pojo.scenario.Tag;

import java.util.Date;
import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;

public class FileMetadataDTO {
	

	private String characterId;
	private List<Tag> tags;
	private String description;
	private Place place;
	
	@Null
	private String thumb;
	@Null
	private String originalName;
	@Null
	private Date creationDate;
	@Null
	private Date lastChange;
	
	public FileMetadataDTO(){
		
	}
	
	public FileMetadataDTO(FileMetadata meta){
		this.characterId=meta.getCharacterId();
		this.tags=meta.getTags();
		this.description=meta.getDescription();
		this.place=meta.getPlace();
		this.originalName=meta.getOriginalName();
		this.creationDate=meta.getCreationDate();
		this.lastChange=meta.getLastChange();
	}
	
	
	
	public String getCharacterId() {
		return characterId;
	}
	public void setCharacterId(String characterId) {
		this.characterId = characterId;
	}
	public List<Tag> getTags() {
		return tags;
	}
	public void setTags(List<Tag> tags) {
		this.tags = tags;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Place getPlace() {
		return place;
	}
	public void setPlace(Place place) {
		this.place = place;
	}
	public String getThumb() {
		return thumb;
	}
	public void setThumb(String thumb) {
		this.thumb = thumb;
	}
	
	

}
