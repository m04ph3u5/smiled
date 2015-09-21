package it.polito.applied.smiled.pojo.scenario;

import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.HistoricalDate;
import it.polito.applied.smiled.pojo.Reference;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;

public abstract class Post {
	
	@Id
	private String id;
	private Date creationDate;
	private PostStatus status;
	//private HistoricalDate historicalDate;
	private Long julianDayNumber;
	private Date lastChangeDate;
	private Reference user;
	private List<CharacterReference> likes;
	private List<Comment> comments;
	private List<MetaComment> metaComments;
	private String scenarioId;
	private Revision revision;
	

	public Date getCreationDate() {
		return creationDate;
	}
	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}
	public PostStatus getStatus() {
		return status;
	}
	public void setStatus(PostStatus status) {
		this.status = status;
	}
//	public HistoricalDate getHistoricalDate() {
//		return historicalDate;
//	}
//	public void setHistoricalDate(HistoricalDate historicalDate) {
//		this.historicalDate = historicalDate;
//	}
	public Date getLastChangeDate() {
		return lastChangeDate;
	}
	public void setLastChangeDate(Date lastChangeDate) {
		this.lastChangeDate = lastChangeDate;
	}
	public Reference getUser() {
		return user;
	}
	public void setUser(Reference user) {
		this.user = user;
	}
	public List<CharacterReference> getLikes() {
		return likes;
	}
	public void setLikes(List<CharacterReference> likes) {
		this.likes = likes;
	}
	public List<Comment> getComments() {
		return comments;
	}
	public void setComments(List<Comment> comments) {
		this.comments = comments;
	}
	public List<MetaComment> getMetaComments() {
		return metaComments;
	}
	public void setMetaComments(List<MetaComment> metaComments) {
		this.metaComments = metaComments;
	}
	public String getScenarioId() {
		return scenarioId;
	}
	public void setScenarioId(String scenarioId) {
		this.scenarioId = scenarioId;
	}

	public Revision getRevision() {
		return revision;
	}
	public void setRevision(Revision revision) {
		this.revision = revision;
	}
	public String getId() {
		return id;
	}
	
	public Long getJulianDayNumber() {
		return julianDayNumber;
	}
	public void setJulianDayNumber(Long julianDayNumber) {
		this.julianDayNumber = julianDayNumber;
	}
	public void addLike(CharacterReference charRef){
		for(int i=0; i<likes.size(); i++){
			if(likes.get(i).getId().equals(charRef.getId())){
				likes.remove(i);
				return;
			}
		}
		this.likes.add(charRef);
	}
		
}
