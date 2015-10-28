package it.polito.applied.smiled.rabbit;



public class Notification extends Comunication{
	
	private String targetId;
	private NotificationType verb;
	private NotifyReference info;
	private String objectId;
	

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
	
	public NotifyReference getInfo() {
		return info;
	}

	public void setInfo(NotifyReference info) {
		this.info = info;
	}
	
	

}
