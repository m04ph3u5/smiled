package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.pojo.scenario.Mission;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.query.Update;

public interface CustomMissionRepository {

	public Mission updateMission(String missionId, Update u);
	public boolean deleteMission(String missionId);
	public boolean putInDeleteStatus(String id);
	
	
	public List<Mission> getMissionsOfTeacher (String scenarioId, Boolean onlyActive);

	public List<Mission> getMissionsOfCharacter(String characterId, Boolean onlyActive);
	
	
	
	
	
	
	
	
}
