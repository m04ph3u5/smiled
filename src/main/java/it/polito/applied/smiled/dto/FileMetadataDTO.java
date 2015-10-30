package it.polito.applied.smiled.dto;

import it.polito.applied.smiled.pojo.FileMetadata;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.SupportedMedia;
import it.polito.applied.smiled.pojo.scenario.Place;

import java.util.Date;
import java.util.List;

import javax.validation.constraints.Null;

public class FileMetadataDTO {
	
	private String name;
	private String characterId;
	private List<Reference> tags;
	private String description;
	private Place place;
	private SupportedMedia format;
 
	
	@Null
	private byte[] thumb;
	@Null
	private String originalName;
	@Null
	private Date creationDate;
	@Null
	private Date lastChange;
	@Null
	private String teacherId;
	
	public FileMetadataDTO(){
		
	}
	
	public FileMetadataDTO(FileMetadata meta){
		this.name=meta.getId();
		this.characterId=meta.getCharacterId();
		this.tags=meta.getTags();
		this.description=meta.getDescription();
		this.place=meta.getPlace();
		this.originalName=meta.getOriginalName();
		this.creationDate=meta.getCreationDate();
		this.lastChange=meta.getLastChange();
		this.teacherId=meta.getUserId();
		this.format = meta.getFormat();
		this.thumb = meta.getThumbnail();
	}
	
	
	
	public String getCharacterId() {
		return characterId;
	}
	public void setCharacterId(String characterId) {
		this.characterId = characterId;
	}
	public List<Reference> getTags() {
		return tags;
	}
	public void setTags(List<Reference> tags) {
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

	public byte[] getThumb() {
		return thumb;
	}

	public void setThumb(byte[] thumb) {
		this.thumb = thumb;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public SupportedMedia getFormat() {
		return format;
	}

	public void setFormat(SupportedMedia format) {
		this.format = format;
	}

	public String getOriginalName() {
		return originalName;
	}

	public void setOriginalName(String originalName) {
		this.originalName = originalName;
	}

	public Date getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}

	public Date getLastChange() {
		return lastChange;
	}

	public void setLastChange(Date lastChange) {
		this.lastChange = lastChange;
	}

	public String getTeacherId() {
		return teacherId;
	}

	public void setTeacherId(String teacherId) {
		this.teacherId = teacherId;
	}
	
	

}
