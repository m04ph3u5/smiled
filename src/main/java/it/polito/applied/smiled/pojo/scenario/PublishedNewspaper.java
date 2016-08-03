/**
 * 
 */
package it.polito.applied.smiled.pojo.scenario;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;

import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.newspaper.Newspaper;

/**
 * @author m04ph3u5
 *
 */
public class PublishedNewspaper extends Post{

	private int number;
	private String name;
	
	public PublishedNewspaper(){
		this.setCreationDate(new Date());
		this.setLastChangeDate(this.getCreationDate());
		this.setLikes(new HashSet<CharacterReference>());
		this.setComments(new ArrayList<Comment>());
		this.setMetaComments(new ArrayList<MetaComment>());
		this.setRevision(new Revision());
	}
	
	public PublishedNewspaper(Newspaper n){
		this();
		this.name=n.getName();
		this.number=n.getNumber();
		this.setScenarioId(n.getIdScenario());
		this.setStatus(PostStatus.PUBLISHED);
		this.setJulianDayNumber(n.getJulianDayNumber());
		this.setTimeNumber(n.getTimeNumber());
	}
	
	public int getNumber() {
		return number;
	}
	public void setNumber(int number) {
		this.number = number;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	
}
