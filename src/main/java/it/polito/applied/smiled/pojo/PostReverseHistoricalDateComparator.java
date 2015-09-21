package it.polito.applied.smiled.pojo;

import it.polito.applied.smiled.pojo.scenario.Post;

import java.util.Comparator;

public class PostReverseHistoricalDateComparator implements Comparator<Post>{

//	@Override
//	public int compare(Post p1, Post p2) {
//		if(p1.getHistoricalDate().before(p2.getHistoricalDate()))
//			return 1;
//		else if(p1.getHistoricalDate().after(p2.getHistoricalDate()))
//			return -1;
//		else
//			return 0;
//	}
	
	@Override
	public int compare(Post p1, Post p2) {
		if(p1.getJulianDayNumber()<p2.getJulianDayNumber())
			return 1;
		else if(p1.getJulianDayNumber()>p2.getJulianDayNumber())
			return -1;
		else
			return 0;
	}	

}
