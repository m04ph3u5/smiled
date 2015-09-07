package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.scenario.Character;
import it.polito.applied.smiled.pojo.scenario.Mission;
import it.polito.applied.smiled.pojo.scenario.MissionStatus;
import it.polito.applied.smiled.pojo.scenario.Post;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
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
	public Page<Mission> getMissionsOfTeacher(Integer nPag, Integer nItem, boolean orderByDeliveryDate, String scenarioId,
			String teacherId, Boolean onlyActive) {
		
		ObjectId t = new ObjectId(teacherId);
		Query query = new Query();
		
		if(scenarioId!=null)
			query.addCriteria(Criteria.where("teacher.id").is(t)
				.andOperator(Criteria.where("scenarioId").is(scenarioId)));
		else
			query.addCriteria(Criteria.where("teacher.id").is(t));
		if(onlyActive)
			query.addCriteria(Criteria.where("status").is(MissionStatus.STARTED).orOperator(Criteria.where("status").is(MissionStatus.SOLICITED)));
		
		long size = mongoOp.count(query, Mission.class);
		
		Pageable pag;
		if(orderByDeliveryDate)
			pag = new PageRequest(nPag , nItem, Direction.ASC,"deliveryDate");
		else
			pag = new PageRequest(nPag , nItem, Direction.ASC,"creationDate");
		query.with(pag);
		
		
		List<Mission> listMission = mongoOp.find(query, Mission.class);
		return new PageImpl<Mission>(listMission, pag, size);
		
		
	}

	@Override
	public Page<Mission> getMissionsOfStudent(Integer nPag, Integer nItem, boolean orderByDeliveryDate, String scenarioId,
			String studentId, Boolean onlyActive) {
		ObjectId s = new ObjectId(studentId);
		Query query = new Query();
		if(scenarioId!=null)
			query.addCriteria(Criteria.where("student.id").is(s)
					.andOperator(Criteria.where("scenarioId").is(scenarioId)));
		else
			query.addCriteria(Criteria.where("student.id").is(s));
		
		if(onlyActive)
			query.addCriteria(Criteria.where("status").is(MissionStatus.STARTED).orOperator(Criteria.where("status").is(MissionStatus.SOLICITED)));
		
		long size = mongoOp.count(query, Mission.class);
		
		Pageable pag;
		if(orderByDeliveryDate)
			pag = new PageRequest(nPag , nItem, Direction.ASC,"deliveryDate");
		else
			pag = new PageRequest(nPag , nItem, Direction.ASC,"creationDate");
		query.with(pag);
		
		
		List<Mission> listMission = mongoOp.find(query, Mission.class);
		return new PageImpl<Mission>(listMission, pag, size);
	}

}
