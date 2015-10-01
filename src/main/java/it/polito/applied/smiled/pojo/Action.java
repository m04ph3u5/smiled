package it.polito.applied.smiled.pojo;

import java.util.Date;

public class Action implements Comparable{
	
	private ActionType action;
	private AuthorActionReference author;
	private Date date;
	private AuthorActionReference object;
	
	
	public ActionType getAction() {
		return action;
	}
	public void setAction(ActionType action) {
		this.action = action;
	}
	public AuthorActionReference getAuthor() {
		return author;
	}
	public void setAuthor(AuthorActionReference author) {
		this.author = author;
	}
	public AuthorActionReference getObject() {
		return object;
	}
	public void setObject(AuthorActionReference object) {
		this.object = object;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	
	@Override
	public int compareTo(Object o) {
		Action a = (Action) o;
		if(this.date.before(a.getDate()))
			return -1;
		else if(this.date.after(a.getDate()))
			return 1;
		else
			return 0;
	}
	
	
}
