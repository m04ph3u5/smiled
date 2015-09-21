package it.polito.applied.smiled.pojo;

import it.polito.applied.smiled.pojo.scenario.Post;

import java.util.Date;

public class PostReference {
	
	private String id;
	private Date realDate;
//	private HistoricaDate historicalDate;
	private Long julianDayNumber;
	
	public PostReference(){
		
	}
	
	public PostReference(Post post){
		this.id=post.getId();
		this.realDate=post.getCreationDate();
		this.julianDayNumber=post.getJulianDayNumber();
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
//	public HistoricalDate getHistoricalDate() {
//		return historicalDate;
//	}
//	public void setHistoricalDate(HistoricalDate historicalDate) {
//		this.historicalDate = historicalDate;
//	}

	public Long getJulianDayNumber() {
		return julianDayNumber;
	}

	public void setJulianDayNumber(Long julianDayNumber) {
		this.julianDayNumber = julianDayNumber;
	}
	
	
	

}
