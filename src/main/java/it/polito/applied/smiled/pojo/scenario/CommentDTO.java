package it.polito.applied.smiled.pojo.scenario;

import it.polito.applied.smiled.pojo.Reference;

import java.util.List;

public class CommentDTO {
	private List<String> tags; 
	private String text; 
	
	public List<String> getTags() { 
		return tags; 
	} 
	
	public void setTags(List<String> tags) { 
		this.tags = tags; 
	} 
	
	public String getText() { 
		return text; 
	} 
	
	public void setText(String text) { 
		this.text = text; 
	} 
}

