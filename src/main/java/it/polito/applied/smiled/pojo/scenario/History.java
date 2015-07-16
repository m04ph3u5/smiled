package it.polito.applied.smiled.pojo.scenario;

import it.polito.applied.smiled.pojo.HistoricalDate;

import java.util.Date;

import javax.validation.constraints.NotNull;

public class History {
	//TODO
	/*DA CONTROLLARE SE POSSIBILE MAPPARE DATA STORICA SU OGGETTO DATE DIRETTAMENTE*/
	@NotNull
	private HistoricalDate startDate;
	@NotNull
	private HistoricalDate endDate;
	
	private String description;
	private String mapId;
	
	public HistoricalDate getStartDate() {
		return startDate;
	}
	public void setStartDate(HistoricalDate startDate) {
		this.startDate = startDate;
	}
	public HistoricalDate getEndDate() {
		return endDate;
	}
	public void setEndDate(HistoricalDate endDate) {
		this.endDate = endDate;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getMapId() {
		return mapId;
	}
	public void setMapId(String map) {
		this.mapId = map;
	}
	
	

}
