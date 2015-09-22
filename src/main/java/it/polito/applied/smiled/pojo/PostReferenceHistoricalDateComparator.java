package it.polito.applied.smiled.pojo;

import java.util.Comparator;

public class PostReferenceHistoricalDateComparator implements Comparator<PostReference> {

//	/*Il comparator implementanto funziona in modo inverso per consentire
//	 * l'ordinamento decrescente*/
//	@Override
//	public int compare(PostReference pr1, PostReference pr2) {
//		if(pr1.getHistoricalDate().before(pr2.getHistoricalDate()))
//			return -1;
//		else if(pr1.getHistoricalDate().after(pr2.getHistoricalDate()))
//			return 1;
//		else
//			return 0;		
//	}
	
	/*Il comparator implementanto funziona in modo inverso per consentire
	 * l'ordinamento decrescente*/
	@Override
	public int compare(PostReference pr1, PostReference pr2) {
		if(pr1.getJulianDayNumber()>pr2.getJulianDayNumber())
			return -1;
		else if(pr1.getJulianDayNumber()<pr2.getJulianDayNumber())
			return 1;
		else{
			if(pr1.getTimeNumber()!=null && pr2.getTimeNumber()!=null){
				if(pr1.getTimeNumber()>pr2.getTimeNumber())
					return 1;
				else if(pr1.getTimeNumber()<pr2.getTimeNumber())
					return -1;
				else
					return 0;
			}else
				return 0;
		}
	}

}
