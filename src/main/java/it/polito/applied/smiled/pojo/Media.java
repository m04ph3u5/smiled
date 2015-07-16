package it.polito.applied.smiled.pojo;

import java.util.List;

import it.polito.applied.smiled.pojo.scenario.Place;

public class Media {
	
	private String url;
	private String alt;
	private MediaType type;
	private Place place;
	private List<Reference> tags;
	
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getAlt() {
		return alt;
	}
	public void setAlt(String alt) {
		this.alt = alt;
	}
	public MediaType getType() {
		return type;
	}
	public void setType(MediaType type) {
		this.type = type;
	}
	public Place getPlace() {
		return place;
	}
	public void setPlace(Place place) {
		this.place = place;
	}
	public List<Reference> getTags() {
		return tags;
	}
	public void setTags(List<Reference> tags) {
		this.tags = tags;
	}
	
	

}
