package it.polito.applied.smiled.rabbit;

import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.index.Indexed;

import com.fasterxml.jackson.annotation.JsonCreator;

import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.scenario.Comment;
import it.polito.applied.smiled.pojo.scenario.MetaComment;
public class Notification extends Comunication{
	//TWO MONTHS OF NOTIFICATION PERSISTANCE
	@Indexed(expireAfterSeconds=5184000)
	private Date date;
	private NotificationType verb;
	private String actorId;
	private String actorName;
	private String scenarioId;
	private String scenarioName;
	private String objectId;
	private String objectContent;
	private String mainReceiver;
	private String sender;
	//Questo viene usato solo nel caso di nuovo commento/suggerimento o di aggiornamento degli stessi
	private Comment comment;
	private MetaComment metaComment;
	private List<Reference> tagged;
	
	@JsonCreator
	public Notification(){
		type=ComunicationType.NOTIFICATION;
	}
	
	
	public String getMainReceiver() {
		return mainReceiver;
	}

	public String getSender() {
		return sender;
	}

	public void setSender(String sender) {
		this.sender = sender;
	}

	public void setMainReceiver(String mainReceiver) {
		this.mainReceiver = mainReceiver;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public NotificationType getVerb() {
		return verb;
	}
	public void setVerb(NotificationType verb) {
		this.verb = verb;
	}
	public String getActorId() {
		return actorId;
	}
	public void setActorId(String actorId) {
		this.actorId = actorId;
	}
	public String getActorName() {
		return actorName;
	}
	public void setActorName(String actorName) {
		this.actorName = actorName;
	}
	public String getScenarioId() {
		return scenarioId;
	}
	public void setScenarioId(String scenarioId) {
		this.scenarioId = scenarioId;
	}
	public String getScenarioName() {
		return scenarioName;
	}
	public void setScenarioName(String scenarioName) {
		this.scenarioName = scenarioName;
	}
	public String getObjectId() {
		return objectId;
	}
	public void setObjectId(String objectId) {
		this.objectId = objectId;
	}
	public String getObjectContent() {
		return objectContent;
	}
	public void setObjectContent(String objectContent) {
		this.objectContent = objectContent;
	}
	public List<Reference> getTagged() {
		return tagged;
	}
	public void setTagged(List<Reference> tagged) {
		this.tagged = tagged;
	}
	public Comment getComment() {
		return comment;
	}
	public void setComment(Comment comment) {
		this.comment = comment;
	}
	public MetaComment getMetaComment() {
		return metaComment;
	}
	public void setMetaComment(MetaComment metaComment) {
		this.metaComment = metaComment;
	}
}
