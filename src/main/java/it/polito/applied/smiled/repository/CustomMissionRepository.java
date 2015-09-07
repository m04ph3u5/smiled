package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.pojo.scenario.Mission;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.query.Update;

public interface CustomMissionRepository {

	public Page<Mission> customPageableFindAllByTeacher(List<String> missionsId, int size, Pageable p, String teacherId);
	public Page<Mission> customPageableFindAllByStudent(List<String> missionsId, int size, Pageable p, String studentId);
	public Mission updateMission(String missionId, Update u);
	public boolean deleteMission(String missionId);
	public boolean putInDeleteStatus(String id);
	
	
	public Page<Mission> getMissionsOfTeacher(Integer nPag, Integer nItem,
			boolean orderByDeliveryDate, String scenarioId, String teacherId, Boolean onlyActive);

	public Page<Mission> getMissionsOfStudent(Integer nPag, Integer nItem,
			boolean orderByDeliveryDate, String scenarioId, String studentId, Boolean onlyActive);
	
	
	
	
	
	
	
}
