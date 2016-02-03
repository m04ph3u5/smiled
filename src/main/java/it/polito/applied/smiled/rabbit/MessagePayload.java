package it.polito.applied.smiled.rabbit;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.util.Date;

import it.polito.applied.smiled.pojo.Reference;

public class MessagePayload implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -7624810844790418445L;
	private String id;
	private Date date;
	private boolean isMessage;
	
	/*Message fields*/
	private String receiverId;
	private Reference sender;
	private String text;
	
	/*Notification fields*/
	private NotificationType verb;
	private String objectId;
	private String actorId;
	private String actorName;
	private String scenarioId;
	private String scenarioName;
	
		
	public static byte[] serialize(MessagePayload obj) throws IOException {
	    ByteArrayOutputStream out = new ByteArrayOutputStream();
	    ObjectOutputStream os = new ObjectOutputStream(out);
	    os.writeObject(obj);
	    byte[] b = out.toByteArray();
	    os.close();
	    out.close();
	    return b;
	}
	public static MessagePayload deserialize(byte[] data) throws IOException, ClassNotFoundException {
	    ByteArrayInputStream in = new ByteArrayInputStream(data);
	    ObjectInputStream is = new ObjectInputStream(in);
	    MessagePayload m = (MessagePayload) is.readObject();
	    in.close();
	    is.close();
	    return m;
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
	public boolean isMessage() {
		return isMessage;
	}
	public void setMessage(boolean isMessage) {
		this.isMessage = isMessage;
	}
	public String getReceiverId() {
		return receiverId;
	}
	public void setReceiverId(String receiverId) {
		this.receiverId = receiverId;
	}
	public Reference getSender() {
		return sender;
	}
	public void setSender(Reference sender) {
		this.sender = sender;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
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
	
	
}
