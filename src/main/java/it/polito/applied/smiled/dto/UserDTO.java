package it.polito.applied.smiled.dto;

import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.Role;
import it.polito.applied.smiled.pojo.ScenarioReference;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.user.UserStatus;
import it.polito.applied.smiled.pojo.user.Student;
import it.polito.applied.smiled.pojo.user.Teacher;
import it.polito.applied.smiled.pojo.user.User;
import it.polito.applied.smiled.pojo.user.UserOpenScenario;
import it.polito.applied.smiled.pojo.user.UserProfile;

import java.util.Date;
import java.util.List;

public class UserDTO {
	
	private String id;
	private String email;
	private String firstName;
	private String lastName;
	private Date registrationDate;
	private Role role;
	private List<ScenarioReference> openScenarios;
	private List<ScenarioReference> closedScenarios;
	private UserProfile profile;
	private List<Reference> teachers;
	private List<Reference> students;
	private String invitedBy;
	
	/* TODO	 
	 * AL MOMENTO NON UTILIZZATO - CONTERRA' LA LISTA DI AMICI DI UNO USER, SIA ESSO UNO STUDENT O UN TEACHER
	 * DA DECIDERE SE DARE LA POSSIBILITÀ AGLI UTENTI REALI DI CHIEDERE L'AMICIZIA O SEMPLICEMENTE DI AGGIUNGERE AGLI AMICI
	 * TUTTI GLI UTENTI CON CUI SI È PARTECIPATO ALMENO UNA VOLTA AD UNO SCENARIO COMUNE*/
	private List<Reference> friends;
	
	private List<Reference> colleagues;
	
	public UserDTO(){
	}
	
	public UserDTO(User user) {
		if(user.getClass().equals(Student.class)){
			Student s = (Student) user;
			teachers = s.getTeachers();
			friends = s.getFriends();
		}else if(user.getClass().equals(Teacher.class)){
			Teacher t = (Teacher) user;
			students = t.getStudents();
			colleagues = t.getColleagues();
		}
		
		id = user.getId();
		email = user.getEmail();
		firstName = user.getFirstName();
		lastName = user.getLastName();
		registrationDate = user.getRegistrationDate();
		openScenarios = user.getOpenScenarios();
		closedScenarios = user.getClosedScenarios();
		profile = user.getProfile();
		invitedBy = user.getInvitedBy();
		if(user.getRoles()!=null){
			role = user.getRoles().get(0);
		}
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
	
	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public List<ScenarioReference> getClosedScenarios() {
		return closedScenarios;
	}
	public void setClosedScenarios(List<ScenarioReference> closedScenarios) {
		this.closedScenarios = closedScenarios;
	}
	public UserProfile getProfile() {
		return profile;
	}
	public void setProfile(UserProfile profile) {
		this.profile = profile;
	}
	public List<Reference> getTeachers() {
		return teachers;
	}
	public void setTeachers(List<Reference> teachers) {
		this.teachers = teachers;
	}
	public List<Reference> getStudents() {
		return students;
	}
	public void setStudents(List<Reference> students) {
		this.students = students;
	}
	public List<Reference> getFriends() {
		return friends;
	}
	public void setFriends(List<Reference> friends) {
		this.friends = friends;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}

	public List<Reference> getColleagues() {
		return colleagues;
	}

	public void setColleagues(List<Reference> colleagues) {
		this.colleagues = colleagues;
	}

	public List<ScenarioReference> getOpenScenarios() {
		return openScenarios;
	}

	public void setOpenScenarios(List<ScenarioReference> openScenarios) {
		this.openScenarios = openScenarios;
	}

	public String getInvitedBy() {
		return invitedBy;
	}

	public void setInvitedBy(String invitedBy) {
		this.invitedBy = invitedBy;
	}
	
	

}
