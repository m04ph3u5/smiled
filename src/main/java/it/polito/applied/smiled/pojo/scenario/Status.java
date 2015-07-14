package it.polito.applied.smiled.pojo.scenario;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.DBRef;

import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.FileMetadata;
import it.polito.applied.smiled.pojo.Media;
import it.polito.applied.smiled.pojo.Reference;

public class Status extends Post{

	private CharacterReference character;
	private List<Tag> tags;
	private String text;
	
	@DBRef
	private ArrayList<FileMetadata> imagesMetadata;
	@DBRef
	private ArrayList<FileMetadata> filesMetadata;
	
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
		this.imagesMetadata = new ArrayList<FileMetadata>();
		this.filesMetadata = new ArrayList<FileMetadata>();
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


	public ArrayList<FileMetadata> getImagesMetadata() {
		return imagesMetadata;
	}
	public void setImagesMetadata(ArrayList<FileMetadata> imagesMetadata) {
		this.imagesMetadata = imagesMetadata;
	}
	public void addImageMetadata(FileMetadata f){
		this.imagesMetadata.add(f);
	}

	public ArrayList<FileMetadata> getFilesMetadata() {
		return filesMetadata;
	}
	public void setFilesMetadata(ArrayList<FileMetadata> filesMetadata) {
		this.filesMetadata = filesMetadata;
	}
	public void addFileMetadata(FileMetadata f){
		this.filesMetadata.add(f);
	}
		
	
}
