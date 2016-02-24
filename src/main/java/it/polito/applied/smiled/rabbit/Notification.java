package it.polito.applied.smiled.rabbit;

import java.util.Date;
import java.util.List;

import it.polito.applied.smiled.pojo.Reference;

public class Notification{
	
	private String id;
	private Date date;
	private ComunicationType type;
	private NotificationType verb;
	private String actorId;
	private String actorName;
	private String scenarioId;
	private String scenarioName;
	private String objectId;
	private String objectContent;
	private String mainReceiver;
	private String sender;
	private List<Reference> tagged;
	
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


	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
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
	public ComunicationType getType() {
		return type;
	}
	public void setType(ComunicationType type) {
		this.type = type;
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
	
	

}
