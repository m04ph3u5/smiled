package it.polito.applied.smiled.pojo.scenario;

import it.polito.applied.smiled.pojo.Reference;

import java.util.Date;
import java.util.List;

public class MetaComment implements CommentInterface{
	
	private String id;

	private Reference user;
	private Date creationDate;
	private Date lastChangeDate;
	private List<Reference> likes;
	private List<Tag> tags;
	
	private String text;
	
	public MetaComment(){
		
	}
	
	public MetaComment(CommentDTO commentDTO, Reference userReference) {
		this.creationDate=new Date();
		this.lastChangeDate=creationDate;
		
		/*L'id del commento viene generato concatenando la data di creazione convertita in millisecondi con l'ID del character che sta scrivendo il
		 * commento. Questo per evitare di utilizzare un contatore/generatore di id statico che avrebbe penalizzato le prestazioni dell'architettura
		 * multithreading*/
		this.id=creationDate.getTime()+userReference.getId();
		this.text=commentDTO.getText();
		this.tags=commentDTO.getTags();
		this.user=userReference;
	}

	public Reference getUser() {
		return user;
	}

	public void setUser(Reference user) {
		this.user = user;
	}

	public Date getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}

	public Date getLastChangeDate() {
		return lastChangeDate;
	}

	public void setLastChangeDate(Date lastChangeDate) {
		this.lastChangeDate = lastChangeDate;
	}

	public List<Reference> getLikes() {
		return likes;
	}

	public void setLikes(List<Reference> likes) {
		this.likes = likes;
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

	public String getId() {
		return id;
	}
}
