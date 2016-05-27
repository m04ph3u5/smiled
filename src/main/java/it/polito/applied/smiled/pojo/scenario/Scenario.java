package it.polito.applied.smiled.pojo.scenario;

import it.polito.applied.smiled.dto.ScenarioDTO;
import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.IntervalDate;
import it.polito.applied.smiled.pojo.PostReference;
import it.polito.applied.smiled.pojo.Reference;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Scenario {
	@Id
	private String id;
	private String name;
	private Date startDate;
	private Date endDate;
	private Date creationDate;
	private Date lastUpdateDate;
	 
	private ScenarioStatus status;
	private History history;
	private String cover;
	private String description;
	
	private List<CharacterReference> characters;
	
	private List<PostReference> posts;
	
	private Reference teacherCreator;
	private List<Reference> attendees;
	private List<Reference> collaborators;
	private List<Reference> invited;
	
	private boolean showRelationsToAll;
	
	private Mission mission;
	private boolean newspaperEnabled;
	
	private Reference actualJournalist;
	private Date actualJournalistStart;
	private Map<String, ArrayList<IntervalDate>> pastJournalistId;   //la chiave e' l'id dello user, la lista contiene tutte le volte (tutti gli intervalli temporali) in cui quello user ha interpretato il ruolo di giornalista nello scenario
	
	/*TODO
	 * Valutare inizializzazione liste (fondamantale nel caso di operazioni in memoria, con aggiunta metodi add, remove dalle liste)*/
	
	public Scenario(){
	}
	
	public Scenario(ScenarioDTO s, Reference teacherCreator){
		name=s.getName();
		status=ScenarioStatus.CREATED_V1;
		history= s.getHistory();
		description = s.getDescription();
		//cover=s.getCover();
		this.teacherCreator = teacherCreator;
		this.showRelationsToAll = s.isShowRelationsToAll();
		this.newspaperEnabled = s.isNewspaperEnabled();
		creationDate = new Date();
		lastUpdateDate = creationDate;
	}
	

	
	public boolean isNewspaperEnabled() {
		return newspaperEnabled;
	}

	public void setNewspaperEnabled(boolean newspaperEnabled) {
		this.newspaperEnabled = newspaperEnabled;
	}

	public Date getStartActualJournalist() {
		return actualJournalistStart;
	}

	public void setStartActualJournalist(Date actualJournalistStart) {
		this.actualJournalistStart = actualJournalistStart;
	}

	public Reference getActualJournalist() {
		return actualJournalist;
	}

	public void setActualJournalist(Reference newActualUser) {
		Date now = new Date();
		/*Se lo Scenario non è ancora attivo oppure se il giornalista non era già interpretato da qualcuno, non devo gestire la lista di PastJournalist*/
		if(this.status.equals(ScenarioStatus.ACTIVE) && this.actualJournalist!=null){
			if(pastJournalistId==null)
				pastJournalistId=new HashMap<String, ArrayList<IntervalDate>>();
			IntervalDate intervalDate = new IntervalDate(actualJournalistStart,now);
			if(pastJournalistId.containsKey(this.actualJournalist.getId())){
				ArrayList<IntervalDate> tmp = pastJournalistId.get(this.actualJournalist.getId());   //tmp rappresenta la lista di volte che l'user che sto togliendo dal ruolo di journalist aveva interpretato il journalist
				tmp.add(intervalDate);
				pastJournalistId.put(this.actualJournalist.getId(), tmp);
			}else{
				ArrayList<IntervalDate> a = new ArrayList<IntervalDate>();
				a.add(intervalDate);
				pastJournalistId.put(this.actualJournalist.getId(), a);
			}
		}
		this.actualJournalist = newActualUser;
		if(newActualUser!=null)
			actualJournalistStart = now;
		else
			actualJournalistStart = null;
	}

	public Map<String, ArrayList<IntervalDate>> getPastJournalistId() {
		return pastJournalistId;
	}

	public void setPastJournalistId(Map<String, ArrayList<IntervalDate>> pastJournalistId) {
		this.pastJournalistId = pastJournalistId;
	}

	public Mission getMission() {
		return mission;
	}

	public void setMission(Mission mission) {
		this.mission = mission;
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

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getLastUpdateDate() {
		return lastUpdateDate;
	}

	public void setLastUpdateDate(Date lastUpdateDate) {
		this.lastUpdateDate = lastUpdateDate;
	}
	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}
	public History getHistory() {
		return history;
	}

	public void setHistory(History history) {
		this.history = history;
	}

	public String getCover() {
		return cover;
	}

	public void setCover(String cover) {
		this.cover = cover;
	}

	

	public List<CharacterReference> getCharacters() {
		return characters;
	}

	public void setCharacters(List<CharacterReference> characters) {
		this.characters = characters;
	}
	
	public CharacterReference getCharacter(String id){
		for(CharacterReference c : characters){
			if(c.getId().equals(id))
				return c;
		}
		return null;
	}

	public String getId() {
		return id;
	}

	
	public List<Reference> getAttendees() {
		return attendees;
	}

	public void setAttendees(List<Reference> attendees) {
		this.attendees = attendees;
	}

	public List<Reference> getCollaborators() {
		return collaborators;
	}

	public void setCollaborators(List<Reference> collaborators) {
		this.collaborators = collaborators;
	}

	public Reference getTeacherCreator() {
		return teacherCreator;
	}

	public void setTeacherCreator(Reference teacherCreator) {
		this.teacherCreator = teacherCreator;
	}

	public ScenarioStatus getStatus() {
		return status;
	}

	public void setStatus(ScenarioStatus status) {
		this.status = status;
	}

	public Date getCreationDate() {
		return creationDate;
	}

	public List<PostReference> getPosts() {
		return posts;
	}

	public void setPosts(List<PostReference> posts) {
		this.posts = posts;
	}

	public List<Reference> getInvited() {
		return invited;
	}

	public void setInvited(List<Reference> invited) {
		this.invited = invited;
	}

	public boolean isShowRelationsToAll() {
		return showRelationsToAll;
	}

	public void setShowRelationsToAll(boolean showRelationsToAll) {
		this.showRelationsToAll = showRelationsToAll;
	}

	
	
}
