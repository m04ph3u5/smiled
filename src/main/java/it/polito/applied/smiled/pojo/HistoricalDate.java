package it.polito.applied.smiled.pojo;

import org.springframework.data.annotation.PersistenceConstructor;
import org.springframework.data.annotation.Transient;

public class HistoricalDate {
	
	private long dateMillis;
	
	@Transient
	private int year;
	@Transient
	private int month;
	@Transient
	private int day;
	@Transient
	private int hour;
	@Transient
	private int minute;
	@Transient
	private boolean afterChrist;
	
	@PersistenceConstructor
	public HistoricalDate(long dateMillis){
		this.dateMillis=dateMillis;
		getDateFromMillis();
	}
	
	public HistoricalDate(){
		
	}
	
	public HistoricalDate(int year, int month, int day, int hour, int minute, boolean afterChrist){
		System.out.println("costruttore con parametri historicaldate");
		this.afterChrist=afterChrist;
		this.year=year;
		this.month=month;
		this.day=day;
		this.hour=hour;
		this.minute=minute;
		
		dateMillis=calculateDateMillis();
	}
	
	
	public int getYear() {
		return year;
	}
	public void setYear(int year) {
		this.year = year;
		dateMillis=calculateDateMillis();
	}
	public int getMonth() {
		return month;
	}
	public void setMonth(int month) {
		this.month = month;
		dateMillis=calculateDateMillis();
	}
	public int getDay() {
		return day;
	}
	public void setDay(int day) {
		this.day = day;
		dateMillis=calculateDateMillis();
	}
	public int getHour() {
		return hour;
	}
	public void setHour(int hour) {
		this.hour = hour;
		dateMillis=calculateDateMillis();
	}
	public int getMinute() {
		return minute;
	}
	public void setMinute(int minute) {
		this.minute = minute;
		dateMillis=calculateDateMillis();
	}
	public boolean isAfterChrist() {
		return afterChrist;
	}
	public void setAfterChrist(boolean afterChrist) {
		this.afterChrist = afterChrist;
		dateMillis=calculateDateMillis();
	}
	public long getDateMillis() {
		return dateMillis;
	}
	
	
	@Override
	public boolean equals(Object o){
		if(!o.getClass().isInstance(HistoricalDate.class))
			return false;
		HistoricalDate d = (HistoricalDate) o;
		if(d.getDateMillis()==this.dateMillis)
			return true;
		else
			return false;
	}
	
	public boolean after(HistoricalDate d){
		if(dateMillis>d.getDateMillis())
			return true;
		else
			return false;
	}
	
	public boolean before(HistoricalDate d){
		if(dateMillis<d.getDateMillis())
			return true;
		else
			return false;
	}
	
	private long calculateDateMillis() {
		long date=0;
		int monthsDays=0;

		date=(long)year*365*24*60;
		
		switch((int)month){
		case 1: break;
		case 2: monthsDays=31;
				break;
		case 3: monthsDays=59;
				break;
		case 4: monthsDays=90;
				break;
		case 5: monthsDays=120;
				break;
		case 6: monthsDays=151;
				break;
		case 7:	monthsDays=181;
				break;
		case 8: monthsDays=212;
				break;
		case 9: monthsDays=243;
				break;
		case 10:monthsDays=273;
				break;
		case 11:monthsDays=304;
				break;
		case 12:monthsDays=334;
				break;
		}
		date+=(long)monthsDays*24*60;
		
		if(monthsDays!=0){
			date+=(long)(day-1)*24*60;
			if(day!=0){
				date+=(long)hour*60;
				date+=(long)minute;
			}
		}
		if(!afterChrist)
			date*=-1;
		
		return date;
	}
	
	private void getDateFromMillis(){
		int remains;
		year = (int)(dateMillis/(365*24*60));
		remains = (int)(dateMillis%(365*24*60));
		int monthDays = remains/(24*60);
		remains = remains % (24*60);
		hour = remains / 60;
		minute = remains % 60;
		monthDays++;
		
		if(monthDays<=31){
			month=1;
			day=monthDays;
		}else if(monthDays<=59){
			month=2;
			day=monthDays-31;
		}else if(monthDays<=90){
			month=3;
			day=monthDays-59;
		}else if(monthDays<=120){
			month=4;
			day=monthDays-90;
		}else if(monthDays<=151){
			month=5;
			day=monthDays-120;
		}else if(monthDays<=181){
			month=6;
			day=monthDays-151;
		}else if(monthDays<=212){
			month=7;
			day=monthDays-181;
		}else if(monthDays<=243){
			month=8;
			day=monthDays-212;
		}else if(monthDays<=273){
			month=9;
			day=monthDays-243;
		}else if(monthDays<=304){
			month=10;
			day=monthDays-273;
		}else if(monthDays<=334){
			month=11;
			day=monthDays-304;
		}else{
			month=12;
			day=monthDays-334;
		}
		
		if(dateMillis<0)
			afterChrist=false;
		else
			afterChrist=true;
			
	}

}
