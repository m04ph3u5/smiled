package it.polito.applied.smiled.dto;

import it.polito.applied.smiled.pojo.HistoricalDate;

public class NewspaperDTOPut {

	private String name;
	private HistoricalDate date;
	
	//booleano che se a true chiede di pubblicare il newspaper
	private boolean publish;
	
	
	public boolean getPublish() {
		return publish;
	}
	public void setPublish(boolean publish) {
		this.publish = publish;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public HistoricalDate getDate() {
		return date;
	}
	public void setDate(HistoricalDate date) {
		this.date = date;
	}
	
	
}
