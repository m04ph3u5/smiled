package it.polito.applied.smiled.dto;

import java.util.ArrayList;
import java.util.List;

import it.polito.applied.smiled.pojo.HistoricalDate;
import it.polito.applied.smiled.pojo.Media;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.scenario.EventType;
import it.polito.applied.smiled.pojo.scenario.Place;
import it.polito.applied.smiled.pojo.scenario.PostStatus;
import it.polito.applied.smiled.pojo.scenario.Source;

public class EventDTO {
	private PostStatus status;
	private HistoricalDate historicalDate;
	private Reference user;
	private String scenarioId;
	private Place place;
	
	private List<String> tags;
	private ArrayList<String> imageMetaId;
	private ArrayList<String> fileMetaId;
	private ArrayList<String> imageMetaIdToDelete;
	private ArrayList<String> fileMetaIdToDelete;
	private List<Source> sources;
	private String text;
	private EventType type;
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
	public Reference getUser() {
		return user;
	}
	public void setUser(Reference user) {
		this.user = user;
	}
	public String getScenarioId() {
		return scenarioId;
	}
	public void setScenarioId(String scenarioId) {
		this.scenarioId = scenarioId;
	}
	public Place getPlace() {
		return place;
	}
	public void setPlace(Place place) {
		this.place = place;
	}
	public List<String> getTags() {
		return tags;
	}
	public void setTags(List<String> tags) {
		this.tags = tags;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public EventType getType() {
		return type;
	}
	public void setType(EventType type) {
		this.type = type;
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
	public ArrayList<String> getImageMetaIdToDelete() {
		return imageMetaIdToDelete;
	}
	public void setImageMetaIdToDelete(ArrayList<String> imageMetaIdToDelete) {
		this.imageMetaIdToDelete = imageMetaIdToDelete;
	}
	public ArrayList<String> getFileMetaIdToDelete() {
		return fileMetaIdToDelete;
	}
	public void setFileMetaIdToDelete(ArrayList<String> fileMetaIdToDelete) {
		this.fileMetaIdToDelete = fileMetaIdToDelete;
	}
	public List<Source> getSources() {
		return sources;
	}
	public void setSources(List<Source> sources) {
		this.sources = sources;
	}
	
	
}
