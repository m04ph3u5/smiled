package it.polito.applied.smiled.pojo.scenario;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.Media;
import it.polito.applied.smiled.pojo.Reference;

public class Status extends Post{

	private CharacterReference character;
	private List<Tag> tags;
	private String text;
	private Media media;
	private List<Source> sources;
	private Place place;

	
	
	public Status(){
		this.setCreationDate(new Date());
		this.setLastChangeDate(this.getCreationDate());
		this.setLikes(new ArrayList<CharacterReference>());
		this.setComments(new ArrayList<Comment>());
		this.setMetaComments(new ArrayList<MetaComment>());
		this.setRevision(new Revision());
		this.tags=new ArrayList<Tag>();
		this.sources=new ArrayList<Source>();
	}
	
	
	public CharacterReference getCharacter() {
		return character;
	}

	public void setCharacter(CharacterReference character) {
		this.character = character;
	}

	public List<Tag> getTags() {
		return tags;
	}
	public void setTags(List<Tag> tags) {
		this.tags = tags;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public Media getMedia() {
		return media;
	}
	public void setMedia(Media media) {
		this.media = media;
	}
	public List<Source> getSources() {
		return sources;
	}
	public void setSources(List<Source> sources) {
		this.sources = sources;
	}


	public Place getPlace() {
		return place;
	}


	public void setPlace(Place place) {
		this.place = place;
	}
	
}
