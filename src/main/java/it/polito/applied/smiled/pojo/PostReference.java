package it.polito.applied.smiled.pojo;

import it.polito.applied.smiled.pojo.scenario.Post;

import java.util.Date;

public class PostReference {
	
	private String id;
	private Date realDate;
	private HistoricalDate historicalDate;
	
	public PostReference(){
		
	}
	
	public PostReference(Post post){
		this.id=post.getId();
		this.realDate=post.getCreationDate();
		this.historicalDate=post.getHistoricalDate();
	}
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Date getRealDate() {
		return realDate;
	}
	public void setRealDate(Date realDate) {
		this.realDate = realDate;
	}
	public HistoricalDate getHistoricalDate() {
		return historicalDate;
	}
	public void setHistoricalDate(HistoricalDate historicalDate) {
		this.historicalDate = historicalDate;
	}
	
	
	

}
