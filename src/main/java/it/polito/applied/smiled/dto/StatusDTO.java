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
	private List<Reference> tags;
	private ArrayList<String> imageMetaId;
	private ArrayList<String> fileMetaId;
	private ArrayList<String> imageMetaIdToDelete;
	private ArrayList<String> fileMetaIdToDelete;
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
	public List<Reference> getTags() {
		return tags;
	}
	public void setTags(List<Reference> tags) {
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
		

}
