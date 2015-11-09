package it.polito.applied.smiled.pojo.scenario;

import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.FileMetadata;
import it.polito.applied.smiled.pojo.FileReference;
import it.polito.applied.smiled.pojo.Media;
import it.polito.applied.smiled.pojo.Reference;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;


public class Event extends Post{

	private List<Reference> tags;
	private String text;
	private EventType type;
	
	private ArrayList<FileReference> imagesMetadata;
	private ArrayList<FileReference> filesMetadata;
	
	private List<Source> sources;
	private Place place;

	
	public Event(){
		this.setCreationDate(new Date());
		this.setLastChangeDate(this.getCreationDate());
		this.setLikes(new HashSet<CharacterReference>());
		this.setComments(new ArrayList<Comment>());
		this.setMetaComments(new ArrayList<MetaComment>());
		this.setRevision(new Revision());
		this.tags=new ArrayList<Reference>();
		this.sources=new ArrayList<Source>();
		this.imagesMetadata = new ArrayList<FileReference>();
		this.filesMetadata = new ArrayList<FileReference>();
	}
	
	public List<Reference> getTags() {
		return tags;
	}
	public void setTags(List<Reference> tags) {
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
	

	public Place getPlace() {
		return place;
	}

	public void setPlace(Place place) {
		this.place = place;
	}

	public ArrayList<FileReference> getImagesMetadata() {
		return imagesMetadata;
	}

	public void setImagesMetadata(ArrayList<FileReference> imagesMetadata) {
		this.imagesMetadata = imagesMetadata;
	}
	public void addImageMetadata(FileReference f){
		this.imagesMetadata.add(f);
	}
	
	public ArrayList<FileReference> getFilesMetadata() {
		return filesMetadata;
	}

	public void setFilesMetadata(ArrayList<FileReference> filesMetadata) {
		this.filesMetadata = filesMetadata;
	}

	public void addFileMetadata(FileReference f){
		this.filesMetadata.add(f);
	}
	
	public List<Source> getSources() {
		return sources;
	}

	public void setSources(List<Source> sources) {
		this.sources = sources;
	}
	
	
}
