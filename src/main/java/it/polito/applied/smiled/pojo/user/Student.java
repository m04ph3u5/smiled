package it.polito.applied.smiled.pojo.user;

import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.Role;
import it.polito.applied.smiled.pojo.ScenarioReference;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Student extends User{

	private List<Reference> teachers;
	private List<Reference> friends;
	
	
	/*L'inizializzazione delle collezioni non dovrebbe essere necessaria in modo esplicito, dal momento che al momento della modifica interagiamo
	 *direttamente col database (per ora!) */
	
	
	public Student(){
//		this.roles = new ArrayList<Role>();
//		this.openScenarios = new ArrayList<ScenarioReference>();
//		this.closedScenarios= new ArrayList<Reference>();
//		this.teachers = new ArrayList<Reference>();
//		this.friends = new ArrayList<Reference>();
//		this.profile = new UserProfile();
	}
	
	public Student(String email, Reference teacher, String password, String scenarioId){
		this.email=email;
		roles = new ArrayList<Role>();
		roles.add(new Role("ROLE_USER"));
		this.registrationDate=new Date();
//		this.openScenarios = new ArrayList<ScenarioReference>();
//		this.closedScenarios= new ArrayList<Reference>();
		this.status=UserStatus.STATUS_PENDING_DEFAULT_PASSWORD;
		this.teachers = new ArrayList<Reference>();
		teachers.add(teacher);
		this.invitedBy=teacher.getId();
//		this.friends = new ArrayList<Reference>();
//		this.profile = new UserProfile();
		this.password=password;
		this.invitingScenariosId = new ArrayList<String>();
		invitingScenariosId.add(scenarioId);
	}
	
	
	public Student(String email, Reference teacher, String password, ScenarioReference scenarioReference) {
		this.email=email;
		roles = new ArrayList<Role>();
		roles.add(new Role("ROLE_USER"));
		this.registrationDate=new Date();
//		this.openScenarios = new ArrayList<ScenarioReference>();
//		this.closedScenarios= new ArrayList<Reference>();
		this.status=UserStatus.STATUS_PENDING_DEFAULT_PASSWORD;
		this.teachers = new ArrayList<Reference>();
		teachers.add(teacher);
		this.invitedBy=teacher.getId();
//		this.friends = new ArrayList<Reference>();
//		this.profile = new UserProfile();
		this.password=password;
		this.openScenarios = new ArrayList<ScenarioReference>();
		openScenarios.add(scenarioReference);
	}

	public List<Reference> getTeachers() {
		return teachers;
	}

	public void setTeachers(List<Reference> teachers) {
		this.teachers = teachers;
	}
	
	public List<Reference> getFriends() {
		return friends;
	}

	public void setFriends(List<Reference> friends) {
		this.friends = friends;
	}
	
}
