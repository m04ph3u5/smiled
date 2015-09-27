package it.polito.applied.smiled.pojo;

import it.polito.applied.smiled.pojo.user.User;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class ExceptionOnClient {

	@Id
	private String id;
	private String exceptionMessage;
	private String cause;
	private Reference user;
	private Date date;
	
	public String getExceptionMessage() {
		return exceptionMessage;
	}
	public void setExceptionMessage(String exceptionMessage) {
		this.exceptionMessage = exceptionMessage;
	}
	public String getCause() {
		return cause;
	}
	public void setCause(String cause) {
		this.cause = cause;
	}
	public Reference getUser() {
		return user;
	}
	public void setUser(Reference user) {
		this.user = user;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	
	
	
}
