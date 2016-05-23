package it.polito.applied.smiled.dto;

import it.polito.applied.smiled.pojo.HistoricalDate;

public class NewspaperDTOPut {

	private String name;
	private HistoricalDate date;
	
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
