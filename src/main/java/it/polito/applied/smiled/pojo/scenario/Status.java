package it.polito.applied.smiled.pojo.scenario;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.DBRef;

import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.FileMetadata;
import it.polito.applied.smiled.pojo.FileReference;
import it.polito.applied.smiled.pojo.Id;
import it.polito.applied.smiled.pojo.Media;
import it.polito.applied.smiled.pojo.Reference;

public class Status extends Post{

	private CharacterReference character;
	private List<Reference> tags;
	private String text;
	
	
	private ArrayList<FileReference> imagesMetadata;
	
	private ArrayList<FileReference> filesMetadata;
	
	private List<Source> sources;
	private Place place;

	
	
	public Status(){
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
	
	
	public CharacterReference getCharacter() {
		return character;
	}

	public void setCharacter(CharacterReference character) {
		this.character = character;
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
		
	
}
