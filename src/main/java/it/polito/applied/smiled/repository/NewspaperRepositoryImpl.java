package it.polito.applied.smiled.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import it.polito.applied.smiled.pojo.newspaper.Newspaper;
import it.polito.applied.smiled.pojo.scenario.PostStatus;

public class NewspaperRepositoryImpl implements CustomNewspaperRepository{
	
	@Autowired
	MongoOperations mongoOp;
	
	@Override
	public Newspaper getLastNewspaperFromScenario(String scenarioId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("idScenario").is(scenarioId).andOperator((Criteria.where("status").ne(PostStatus.DELETED))));
		List<Newspaper> allNumbers = mongoOp.find(q, Newspaper.class);
		int number = 0;
		Newspaper newspaper = null;
		for(Newspaper n : allNumbers){
			if(n.getNumber()>number){
				newspaper = n;
				number = n.getNumber();
			}
			
		}
		return newspaper;
	}

	@Override
	public Newspaper findNewspaperByIdScenarioAndNumberAndStatusNotDeleted(String idScenario, int number) {
		Query q = new Query();
		q.addCriteria(Criteria.where("idScenario").is(idScenario).andOperator((Criteria.where("status").ne(PostStatus.DELETED)).andOperator(Criteria.where("number").is(number))));
		return mongoOp.findOne(q,  Newspaper.class);
	
	}

	@Override
	public Newspaper findByIdScenarioAndNotDeleted(String idScenario) {
		Query q = new Query();
		q.addCriteria(Criteria.where("idScenario").is(idScenario).andOperator((Criteria.where("status").ne(PostStatus.DELETED))));
		return mongoOp.findOne(q,  Newspaper.class);
	}

	

}
