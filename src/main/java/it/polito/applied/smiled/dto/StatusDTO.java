package it.polito.applied.smiled.dto;

import it.polito.applied.smiled.pojo.HistoricalDate;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.scenario.Place;
import it.polito.applied.smiled.pojo.scenario.PostStatus;
import it.polito.applied.smiled.pojo.scenario.Source;

import java.util.ArrayList;
import java.util.List;

public class StatusDTO {
	
	private String text;
	private String characterId;
	private List<String> tags;
	private ArrayList<String> imageMetaId;
	private ArrayList<String> fileMetaId;
	private List<Source> sources;
	private PostStatus status;
//	private HistoricalDate historicalDate;
	private Long julianDayNumber;
	private Integer timeNumber;
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
	public List<String> getTags() {
		return tags;
	}
	public void setTags(List<String> tags) {
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
//	public HistoricalDate getHistoricalDate() {
//		return historicalDate;
//	}
//	public void setHistoricalDate(HistoricalDate historicalDate) {
//		this.historicalDate = historicalDate;
//	}
	
	public Place getPlace() {
		return place;
	}
	public Long getJulianDayNumber() {
		return julianDayNumber;
	}
	public void setJulianDayNumber(Long julianDayNumber) {
		this.julianDayNumber = julianDayNumber;
	}
	public void setPlace(Place place) {
		this.place = place;
	}
	public ArrayList<String> getImageMetaId() {
		return imageMetaId;
	}
	public void setImageMetaId(ArrayList<String> imageMetaId) {
		this.imageMetaId = imageMetaId;
	}
	public ArrayList<String> getFileMetaId() {
		return fileMetaId;
	}
	public void setFileMetaId(ArrayList<String> fileMetaId) {
		this.fileMetaId = fileMetaId;
	}
	
	public Integer getTimeNumber() {
		return timeNumber;
	}
	public void setTimeNumber(Integer timeNumber) {
		this.timeNumber = timeNumber;
	}
		

}
