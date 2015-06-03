package it.polito.applied.smiled.security;

import it.polito.applied.smiled.pojo.Role;
import it.polito.applied.smiled.pojo.ScenarioReference;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.scenario.Character;
import it.polito.applied.smiled.pojo.user.UserStatus;
import it.polito.applied.smiled.pojo.user.Student;
import it.polito.applied.smiled.pojo.user.Teacher;
import it.polito.applied.smiled.pojo.user.User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class CustomUserDetails implements UserDetails {

	private static final long serialVersionUID = 1L;

	private String username;
	private String id;
	private String password;
	private UserStatus status;
	private List<Role> roles;
	private List<String> openScenariosId;
	private List<String> closedScenariosId;
	//Questa lista contiene gli id di tutti gli utenti del sistema che hanno una relazione con lo user corrente (amicizia, isTeacher, isStudent, isColleagues)
	private List<String> relationsId;

	public CustomUserDetails(User user){

		relationsId = new ArrayList<String> ();

		//Inserisco nella lista di relazioni tutti i docenti e gli amici dello studente in questione
		if(user.getClass().equals(Student.class)){
			Student s = (Student)user;
			if(s.getTeachers()!=null){
				int sizeT = s.getTeachers().size();
				for(int i=0; i<sizeT; i++){
					relationsId.add(s.getTeachers().get(i).getId());
				}
			}
			if(s.getFriends()!=null){
				int sizeF = s.getFriends().size();
				for(int i=0; i<sizeF; i++){
					relationsId.add(s.getFriends().get(i).getId());
				}
			}
		}
		//Inserisco nella lista di relazioni tutti gli studenti e i colleghi del docente in questione
		else if(user.getClass().equals(Teacher.class)){
			Teacher t = (Teacher)user;

			if(t.getStudents()!=null){

				int sizeS = t.getStudents().size();
				for(int i=0; i<sizeS; i++){
					relationsId.add(t.getStudents().get(i).getId());
				}
			}
			if(t.getColleagues()!=null){

				int sizeC = t.getColleagues().size();
				for(int i=0; i<sizeC; i++){
					relationsId.add(t.getColleagues().get(i).getId());
				}
			}
		}
		

		username=user.getEmail();
		id=user.getId();
		password=user.getPassword();
		status=user.getStatus();
		roles=user.getRoles();
		openScenariosId=user.getOpenScenariosId();
		closedScenariosId=user.getClosedScenariosId();

	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return roles;
	}

	@Override
	public String getPassword() {
		return password;
	}

	public String getId() {
		return id;
	}

	@Override
	public String getUsername() {
		return username;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {

		if((status == UserStatus.STATUS_BANNED) || (status == UserStatus.STATUS_PENDING))
			return false;
		else 
			return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		if(status != UserStatus.STATUS_PENDING_DEFAULT_PASSWORD)
			return true;
		else 
			return false;
	}

	@Override
	public boolean isEnabled() {
		if (status != UserStatus.STATUS_BANNED)
			return true;
		else 
			return false;
	}

	public boolean containsOpenScenario(String id){
		return openScenariosId.contains(id);	

	}

	public List<String> getOpenScenariosId() {
		return openScenariosId;
	}

	public boolean containsClosedScenario(String id){
		return closedScenariosId.contains(id);
	}

	public List<String> getClosedScenariosId() {
		return closedScenariosId;
	}
	public List<String> getRelationsId() {
		return relationsId;
	}

	public boolean containsRelationsId(String id){
		return relationsId.contains(id);
	}
}
