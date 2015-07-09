package it.polito.applied.smiled.dto;

import it.polito.applied.smiled.pojo.HistoricalDate;
import it.polito.applied.smiled.pojo.Media;
import it.polito.applied.smiled.pojo.scenario.Place;
import it.polito.applied.smiled.pojo.scenario.PostStatus;
import it.polito.applied.smiled.pojo.scenario.Source;
import it.polito.applied.smiled.pojo.scenario.Tag;

import java.util.List;

public class StatusDTO {
	
	private String text;
	private String characterId;
	private List<Tag> tags;
	private String imageId;
	private String fileId;
	private List<Source> sources;
	private PostStatus status;
	private HistoricalDate historicalDate;
	private Place place;
	
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
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
	
	public List<Source> getSources() {
		return sources;
	}
	public void setSources(List<Source> sources) {
		this.sources = sources;
	}
	public PostStatus getStatus() {
		return status;
	}
	public void setStatus(PostStatus status) {
		this.status = status;
	}
	public HistoricalDate getHistoricalDate() {
		return historicalDate;
	}
	public void setHistoricalDate(HistoricalDate historicalDate) {
		this.historicalDate = historicalDate;
	}
	public Place getPlace() {
		return place;
	}
	public void setPlace(Place place) {
		this.place = place;
	}
	public String getImageId() {
		return imageId;
	}
	public void setImageId(String imageId) {
		this.imageId = imageId;
	}
	public String getFileId() {
		return fileId;
	}
	public void setFileId(String fileId) {
		this.fileId = fileId;
	}
	
	

}
