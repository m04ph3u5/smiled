package it.polito.applied.smiled.pojo;

import it.polito.applied.smiled.pojo.scenario.Post;

import java.util.Comparator;

public class PostReverseDateComparator implements Comparator<Post>{

	@Override
	public int compare(Post p1, Post p2) {
		
		if(p1.getCreationDate().before(p2.getCreationDate()))
			return 1;
		else if(p1.getCreationDate().after(p2.getCreationDate()))
			return -1;
		else
			return 0;		
	}


}