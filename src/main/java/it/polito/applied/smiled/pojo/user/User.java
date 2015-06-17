package it.polito.applied.smiled.pojo.user;

import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.Role;
import it.polito.applied.smiled.pojo.ScenarioReference;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

/*Classe che mappa l'oggetto User che andrà salvato nel DB. La classe è astratta, sia la classe Teacher che quella Student la dovranno implementare.*/

public abstract class User {

	@Id
	private String id;
	
	@Indexed(unique=true)
	protected String email;
	protected String firstName;
	protected String lastName;
	protected Date registrationDate;
	protected String password;
	protected List<Role> roles;
	
	protected List<ScenarioReference> creatingScenarios; 
	protected List<ScenarioReference> openScenarios;
	protected List<ScenarioReference> closedScenarios;
	/*Lista di scenari da cui l'utente è stato bannato. Prendiamo solo l'id in quanto l'elenco di questi scenari non deve essere mostrato all'utente
	 * ma serve solo al sistema in fase di aggiornamento dei Reference*/
	protected List<String> blockedScenariosId;
	protected UserStatus status;
	protected UserProfile profile;
	protected String invitedBy;
	
	/*Questa lista contiene gli scenari a cui lo studente è stato invitato
	 *nei casi in cui:
	 *1. lo scenario è nello stato CREATED_Vx*/
	protected List<String> invitingScenariosId;
	
	protected List<String> draftPostsId;

	
	public List<String> getOpenScenariosId(){
		List<String> l = new ArrayList<String>();
		if(openScenarios!=null)
			for(ScenarioReference s: openScenarios){
				l.add(s.getId());
			}
		return l;
	}	
	
	public List<String> getCreatingScenariosId(){
		List<String> l = new ArrayList<String>();
		if(creatingScenarios!=null)
			for(ScenarioReference s: creatingScenarios){
				l.add(s.getId());
			}
		return l;
	}

	
	public List<String> getClosedScenariosId(){
		List<String> l = new ArrayList<String>();
		if(closedScenarios!=null)
			for(ScenarioReference s: closedScenarios){
				l.add(s.getId());
			}
		return l;
	}
	
	public String getId() {
		return id;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public Date getRegistrationDate() {
		return registrationDate;
	}
	public void setRegistrationDate(Date registrationDate) {
		this.registrationDate = registrationDate;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public List<Role> getRoles() {
		return roles;
	}
	public void setRoles(List<Role> roles) {
		this.roles = roles;
	}
	public void addRole(Role role){
		this.roles.add(role);
	}
	public List<ScenarioReference> getClosedScenarios() {
		return closedScenarios;
	}
	public void setClosedScenarios(List<ScenarioReference> closedScenarios) {
		this.closedScenarios = closedScenarios;
	}
	public UserStatus getStatus() {
		return status;
	}
	public void setStatus(UserStatus status) {
		this.status = status;
	}
	public UserProfile getProfile() {
		return profile;
	}
	public void setProfile(UserProfile profile) {
		this.profile = profile;
	}
	public String getInvitedBy() {
		return invitedBy;
	}
	public void setInvitedBy(String invitedBy) {
		this.invitedBy = invitedBy;
	}

	public List<ScenarioReference> getOpenScenarios() {
		return openScenarios;
	}

	public void setOpenScenarios(List<ScenarioReference> openScenarios) {
		this.openScenarios = openScenarios;
	}

	public List<String> getBlockedScenariosId() {
		return blockedScenariosId;
	}

	public void setBlockedScenariosId(List<String> blockedScenariosId) {
		this.blockedScenariosId = blockedScenariosId;
	}
	
	public void addClosedScenario(ScenarioReference closeScenario){
		if(closedScenarios!=null)
			closedScenarios.add(closeScenario);
	}
	
	public List<String> getInvitingScenariosId() {
		return invitingScenariosId;
	}

	public void setInvitingScenariosId(List<String> invitingScenariosId) {
		this.invitingScenariosId = invitingScenariosId;
	}


	public void updateCharacter(String scenarioId, CharacterReference charRef) {
		if(openScenarios!=null){
			for(ScenarioReference r : openScenarios){
				if(r.getId().equals(scenarioId)){
					if(r.getMyCharacterId().equals(charRef.getId())){
						r.setMyCharacterName(charRef.getCharacterName());
						/*TODO togliere setCover perché probabilmente non serve (url cover fisso)*/
						r.setMyCharacterCover(charRef.getCharacterCover());
					}
					break;
				}
			}
		}
	}


	public List<String> getDraftPostsId() {
		return draftPostsId;
	}


	public void setDraftPostsId(List<String> draftPostsId) {
		this.draftPostsId = draftPostsId;
	}

	public List<ScenarioReference> getCreatingScenarios() {
		return creatingScenarios;
	}

	public void setCreatingScenarios(List<ScenarioReference> creatingScenarios) {
		this.creatingScenarios = creatingScenarios;
	}
	
	
	
}
