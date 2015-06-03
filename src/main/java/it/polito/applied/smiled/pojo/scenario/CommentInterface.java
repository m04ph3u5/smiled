package it.polito.applied.smiled.pojo.scenario;

import it.polito.applied.smiled.pojo.Reference;

import java.util.Date;
import java.util.List;

public interface CommentInterface {
	
	public Reference getUser();
	public void setUser(Reference user);
	public Date getCreationDate();
	public void setCreationDate(Date creationDate);
	public Date getLastChangeDate();
	public void setLastChangeDate(Date lastChangeDate);
	public List<Tag> getTags();
	public void setTags(List<Tag> tags);
	public String getText();
	public void setText(String text);
	public String getId();
	
}
