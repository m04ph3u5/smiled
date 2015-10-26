package it.polito.applied.smiled.rabbit;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Notification {
	
	private String id;
	private String targetId;
	private NotificationType verb;
	private NotifyReference info;
	private String objectId;
	private Date date;
	

	public String getTargetId() {
		return targetId;
	}
	public void setTargetId(String targetId) {
		this.targetId = targetId;
	}
	public NotificationType getVerb() {
		return verb;
	}
	public void setVerb(NotificationType verb) {
		this.verb = verb;
	}
	
	public String getObjectId() {
		return objectId;
	}
	public void setObjectId(String objectId) {
		this.objectId = objectId;
	}
	public String getId() {
		return id;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	
	public NotifyReference getInfo() {
		return info;
	}

	public void setInfo(NotifyReference info) {
		this.info = info;
	}
	
	

}
