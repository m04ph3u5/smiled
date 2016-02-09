package it.polito.applied.smiled.pojo.scenario;

import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.HistoricalDate;
import it.polito.applied.smiled.pojo.Reference;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.data.annotation.Id;

public abstract class Post {
	
	@Id
	private String id;
	private Date creationDate;
	private PostStatus status;
	//private HistoricalDate historicalDate;
	private Long julianDayNumber;
	private Integer timeNumber;
	private Date lastChangeDate;
	private Reference user;
	private Set<CharacterReference> likes;
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
	public Integer getTimeNumber() {
		return timeNumber;
	}
	public void setTimeNumber(Integer timeNumber) {
		this.timeNumber = timeNumber;
	}
	
	public Set<CharacterReference> getLikes() {
		return likes;
	}
	public void setLikes(Set<CharacterReference> likes) {
		this.likes = likes;
	}
	public boolean addLike(CharacterReference charRef){
		if(likes.contains(charRef)){
			likes.remove(charRef);
			return false;
		}
		else{
			likes.add(charRef);
			return true;
		}
	}
		
}
