package it.polito.applied.smiled.pojo;

import it.polito.applied.smiled.serializer.LogSessionSerializer;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@Document
//@JsonSerialize(using = LogSessionSerializer.class)
public class LogSession {
	
	@Id
	private String id;
	@Indexed
	private String userId;
	private String sessionId;
	private String ip;
	private Date start;
	private Date end;
	
	public LogSession(){
		
	}
	
	public LogSession(String userId, String sessionId, String ip){
		this.userId=userId;
		this.start = new Date();
	    this.end=null;	
	    this.sessionId = sessionId;
	    this.ip = ip;
	}
	
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public Date getStart() {
		return start;
	}
	public void setStart(Date start) {
		this.start = start;
	}
	public Date getEnd() {
		return end;
	}
	public void setEnd(Date end) {
		this.end = end;
	}
	public String getId() {
		return id;
	}
	public String getSessionId() {
		return sessionId;
	}
	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}
	public String getIp() {
		return ip;
	}
	public void setIp(String ip) {
		this.ip = ip;
	}
	
}
