package it.polito.applied.smiled.rabbit;

import java.util.Date;

public class Notification{
	
	private String id;
	private Date date;
//	private String targetId;
	private NotificationType verb;
	private String actorId;
	private String actorName;
	private String scenarioId;
	private String scenarioName;	
	private String objectId;
	
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
	
	

}
