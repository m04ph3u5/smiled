package it.polito.applied.smiled.pojo.user;

import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.Role;
import it.polito.applied.smiled.pojo.ScenarioReference;

import java.util.ArrayList;
import java.util.List;

public class Teacher extends User{


	private List<Reference> students;
	private List<Reference> colleagues;
	private List<String> myDeletedScenarios;

	
	public Teacher(){
//		this.students = new ArrayList<Reference>();
//		this.colleagues = new ArrayList<Reference>();
//		this.roles = new ArrayList<Role>();
//		this.openScenarios = new ArrayList<ScenarioReference>();
//		this.closedScenarios= new ArrayList<ScenarioReference>();
	}
	
	public Teacher(String email, Reference teacherRef, String hashPassword) {
//		this.students = new ArrayList<Reference>();
		this.colleagues = new ArrayList<Reference>();
		colleagues.add(teacherRef);
		this.roles = new ArrayList<Role>();
		roles.add(new Role("ROLE_TEACHER"));
		roles.add(new Role("ROLE_USER"));
//		this.openScenarios = new ArrayList<ScenarioReference>();
//		this.closedScenarios= new ArrayList<Reference>();
		this.email=email;
		this.password=hashPassword;
		this.invitedBy=teacherRef.getId();
		this.profile = new UserProfile();
	}

	public List<Reference> getStudents() {
		return students;
	}

	public void setStudents(List<Reference> students) {
		this.students = students;
	}

	
	public List<Reference> getColleagues() {
		return colleagues;
	}

	public void setColleagues(List<Reference> colleagues) {
		this.colleagues = colleagues;
	}

	public List<String> getMyDeletedScenarios() {
		return myDeletedScenarios;
	}

	public void setMyDeletedScenarios(List<String> myDeletedScenarios) {
		this.myDeletedScenarios = myDeletedScenarios;
	}
}
