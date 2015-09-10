package it.polito.applied.smiled.pojo.scenario;

import it.polito.applied.smiled.dto.CharacterDTO;
import it.polito.applied.smiled.pojo.HistoricalDate;
import it.polito.applied.smiled.pojo.IntervalDate;
import it.polito.applied.smiled.pojo.PostReference;
import it.polito.applied.smiled.pojo.Reference;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.springframework.data.annotation.Id;

public class Character {
	
	@Id
	private String id;
	
	@NotNull
	@Size(min=2,max=64)
	private String name;
	private String nickname;
	private String description;
	private HistoricalDate bornDate;
	private HistoricalDate deadDate;
	private String coverPhotoId;
	private String largeCoverPhotoId;
	private String quote;
	private String gender;
	private String bornTown;
	private String deadTown;
	private String role;
	private Reference actualUser;
	private Date actualUserStart;
	private Map<String,IntervalDate> pastUserId;
	private String idScenario;
	private List<PostReference> posts;
	
	//TODO settare valore al momento della creazione
	private String createdBy;
	
	private boolean deleted;
	
	public Character(){
		
	}

	
	public Character(CharacterDTO c, String idScenario, String creatorId){
		this.name = c.getName();
		this.description = c.getDescription();
		this.bornDate = c.getBornDate();
		this.deadDate = c.getDeadDate();
		this.idScenario = idScenario;
		this.createdBy=creatorId;
		this.quote=c.getQuote();
		this.gender=c.getGender();
		this.bornTown=c.getBornTown();
		this.deadTown=c.getDeadTown();
		this.role=c.getRole();
		this.nickname=c.getNickname();
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public HistoricalDate getBornDate() {
		return bornDate;
	}
	public void setBornDate(HistoricalDate bornDate) {
		this.bornDate = bornDate;
	}
	public HistoricalDate getDeadDate() {
		return deadDate;
	}
	public void setDeadDate(HistoricalDate deadDate) {
		this.deadDate = deadDate;
	}
	
	public Reference getActualUser() {
		return actualUser;
	}
	public void setActualUser(Reference newActualUser, ScenarioStatus status) {
		Date now = new Date();
		/*Se lo Scenario non è ancora attivo oppure se il Character non era già interpretato da qualcuno, non devo gestire la lista di PastUSer*/
		if(status.equals(ScenarioStatus.ACTIVE) && this.actualUser!=null){
			if(pastUserId==null)
				pastUserId=new HashMap<String, IntervalDate>();
			IntervalDate intervalDate = new IntervalDate(actualUserStart,now);
			pastUserId.put(this.actualUser.getId(), intervalDate);
		}
		this.actualUser = newActualUser;
		if(newActualUser!=null)
			actualUserStart = now;
		else
			actualUserStart = null;
	}
	public String getScenarioId() {
		return idScenario;
	}
	public void setScenarioId(String idScenario) {
		this.idScenario = idScenario;
	}
	public String getId() {
		return id;
	}

	public Map<String, IntervalDate> getPastUserId() {
		return pastUserId;
	}

	public void setPastUserId(Map<String, IntervalDate> pastUserId) {
		this.pastUserId = pastUserId;
	}

	public List<PostReference> getPosts() {
		return posts;
	}

	public void setPosts(List<PostReference> posts) {
		this.posts = posts;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public boolean isDeleted() {
		return deleted;
	}
	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}
	public String getBornTown() {
		return bornTown;
	}
	public void setBornTown(String bornTown) {
		this.bornTown = bornTown;
	}
	public String getDeadTown() {
		return deadTown;
	}
	public void setDeadTown(String deadTown) {
		this.deadTown = deadTown;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public String getNickname() {
		return nickname;
	}
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}


	public String getQuote() {
		return quote;
	}


	public void setQuote(String quote) {
		this.quote = quote;
	}


	public String getGender() {
		return gender;
	}


	public void setGender(String gender) {
		this.gender = gender;
	}


	public String getCoverPhotoId() {
		return coverPhotoId;
	}


	public void setCoverPhotoId(String coverPhotoId) {
		this.coverPhotoId = coverPhotoId;
	}


	public String getLargeCoverPhotoId() {
		return largeCoverPhotoId;
	}


	public void setLargeCoverPhotoId(String largeCoverPhotoId) {
		this.largeCoverPhotoId = largeCoverPhotoId;
	}


	
	
}
