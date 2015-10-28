package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.exception.BadRequestException;
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
	public List<Mission> getMissionsOfTeacher(String scenarioId, Boolean onlyActive) {
		
		
		Query query = new Query();
		
		if(scenarioId!=null)
			query.addCriteria(Criteria.where("scenarioId").is(scenarioId));
		
		if(onlyActive)
			query.addCriteria(Criteria.where("status").is(MissionStatus.STARTED).orOperator(Criteria.where("status").is(MissionStatus.SOLICITED)));
		
		return mongoOp.find(query, Mission.class);
		
		
	}

	@Override
	public List<Mission> getMissionsOfCharacter(String characterId, Boolean onlyActive) {
		ObjectId s = new ObjectId(characterId);
		Query query = new Query();
		if(characterId!= null){
			query.addCriteria(Criteria.where("character.id").is(s));
			if(onlyActive)
				query.addCriteria(Criteria.where("status").is(MissionStatus.STARTED).orOperator(Criteria.where("status").is(MissionStatus.SOLICITED)));
			return mongoOp.find(query, Mission.class);
		}
		return null;
	}

}
