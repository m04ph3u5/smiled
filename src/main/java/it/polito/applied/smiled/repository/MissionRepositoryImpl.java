package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.scenario.Character;
import it.polito.applied.smiled.pojo.scenario.Mission;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

public class MissionRepositoryImpl implements CustomMissionRepository{

	@Autowired
	MongoOperations mongoOp;
	
	@Override
	public Page<Mission> customPageableFindAllByTeacher(
			List<String> missionsId, int size, Pageable p, String teacherId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Page<Mission> customPageableFindAllByStudent(
			List<String> missionsId, int size, Pageable p, String studentId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Mission updateMission(String missionId, Update u) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean deleteMission(String missionId) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean putInDeleteStatus(String id) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public List<Mission> getMissionsOfTeacherInScenario(String id,
			String teacherId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Mission> getMissionsOfStudentInScenario(String id,
			String studentId) {
		Reference r = new Reference();
		r.setId(studentId);
		
		Query q = new Query();
		q.addCriteria(Criteria.where("student").is(r)
				.andOperator(Criteria.where("scenarioId").is(id)));
		
		return mongoOp.find(q, Mission.class);
	}

}
