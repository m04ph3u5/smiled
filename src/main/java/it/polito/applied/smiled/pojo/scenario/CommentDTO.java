package it.polito.applied.smiled.pojo.scenario;

import java.util.List;

public class CommentDTO {
	private List<Tag> tags; 
	private String text; 
	
	public List<Tag> getTags() { 
		return tags; 
	} 
	
	public void setTags(List<Tag> tags) { 
		this.tags = tags; 
	} 
	
	public String getText() { 
		return text; 
	} 
	
	public void setText(String text) { 
		this.text = text; 
	} 
}

