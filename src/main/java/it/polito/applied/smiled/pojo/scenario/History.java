package it.polito.applied.smiled.pojo.scenario;

import java.util.Date;

import javax.validation.constraints.NotNull;

public class History {
	//TODO
	/*DA CONTROLLARE SE POSSIBILE MAPPARE DATA STORICA SU OGGETTO DATE DIRETTAMENTE*/
	@NotNull
	private Date startDate;
	@NotNull
	private Date endDate;
	
	private String description;
	private String mapURL;
	
	public Date getStartDate() {
		return startDate;
	}
	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}
	public Date getEndDate() {
		return endDate;
	}
	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getMap() {
		return mapURL;
	}
	public void setMap(String map) {
		this.mapURL = map;
	}
	
	

}
