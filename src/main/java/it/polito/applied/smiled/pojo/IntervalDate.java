package it.polito.applied.smiled.pojo;

import java.util.Date;

public class IntervalDate {
	
	private Date startDate;
	private Date endDate;
	
	public IntervalDate(Date startDate, Date endDate){
		if(endDate.before(startDate))
			System.out.println("EndDate cannot be lower than startDate");
		this.startDate=startDate;
		this.endDate=endDate;
	}

	public Date getStartDate() {
		return startDate;
	}

	public Date getEndDate() {
		return endDate;
	}
	
	

}
