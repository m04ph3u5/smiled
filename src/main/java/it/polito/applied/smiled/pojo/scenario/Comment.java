package it.polito.applied.smiled.pojo.scenario;

import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.Reference;

import java.util.Date;
import java.util.List;

public class Comment implements CommentInterface{
	
	private String id;

	private Reference user;
	private Reference character;
	private Date creationDate;
	private Date lastChangeDate;
	private Revision revision;
	private List<CharacterReference> likes;
	private List<Tag> tags;
	
	private String text;
	
	public Comment(){
		
	}
	
	public Comment(Reference character, CommentDTO commentDTO, Reference userReference){
		this.character=character;
		this.creationDate=new Date();
		this.lastChangeDate=creationDate;
		
		/*L'id del commento viene generato concatenando la data di creazione convertita in millisecondi con l'ID del character che sta scrivendo il
		 * commento. Questo per evitare di utilizzare un contatore/generatore di id statico che avrebbe penalizzato le prestazioni dell'architettura
		 * multithreading*/
		this.id=creationDate.getTime()+character.getId();
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

	public Reference getCharacter() {
		return character;
	}

	public void setCharacter(Reference character) {
		this.character = character;
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

	public Revision getRevision() {
		return revision;
	}

	public void setRevision(Revision revision) {
		this.revision = revision;
	}

	public List<CharacterReference> getLikes() {
		return likes;
	}

	public void setLikes(List<CharacterReference> likes) {
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
