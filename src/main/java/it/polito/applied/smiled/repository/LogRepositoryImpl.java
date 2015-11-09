package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.pojo.Log;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.mongodb.WriteResult;

public class LogRepositoryImpl implements CustomLogRepository{
	
	@Autowired
	private MongoOperations mongoOp;

	@Override
	public List<Log> findByUserInDate(String userId, Date start, Date end) throws BadRequestException {
			
		if(userId==null)
			throw new BadRequestException();
		
		Query q = new Query();
		Criteria c1 = new Criteria();
		
		if(start!=null && end==null){
			c1.andOperator(Criteria.where("userId").is(userId), Criteria.where("date").gte(start));
			q.addCriteria(c1);
		}else if(start==null && end!=null){
			c1.andOperator(Criteria.where("userId").is(userId), Criteria.where("date").lte(end));
			q.addCriteria(c1);
		}else if(start!=null && end!=null){
			q.addCriteria(Criteria.where("userId").is(userId)
					.andOperator(Criteria.where("date").lte(end)
							.andOperator(Criteria.where("date").gte(start))));
		}else
			throw new BadRequestException();
			
		return mongoOp.find(q, Log.class);
	}

	@Override
	public List<Log> findByScenarioInDate(String scenarioId, Date start,
			Date end) throws BadRequestException {
		
		if(scenarioId==null)
			throw new BadRequestException();
		
		Query q = new Query();
		Criteria c1 = new Criteria();
		
		if(start!=null && end==null){
			c1.andOperator(Criteria.where("scenarioId").is(scenarioId), Criteria.where("date").gte(start));
			q.addCriteria(c1);
		}else if(start==null && end!=null){
			c1.andOperator(Criteria.where("scenarioId").is(scenarioId), Criteria.where("date").lte(end));
			q.addCriteria(c1);
		}else if(start!=null && end!=null){
			q.addCriteria(Criteria.where("scenarioId").is(scenarioId)
					.andOperator(Criteria.where("date").lte(end)
							.andOperator(Criteria.where("date").gte(start))));
		}else
			throw new BadRequestException();
			
		return mongoOp.find(q, Log.class);
	}

	@Override
	public List<Log> findByUserAndScenarioInDate(String userId,
			String scenarioId, Date start, Date end) throws BadRequestException {
		
		if(userId==null || scenarioId==null)
			throw new BadRequestException();
		
		Query q = new Query();
		if(start!=null && end==null){
			q.addCriteria(Criteria.where("scenarioId").is(scenarioId)
					.andOperator(Criteria.where("userId").is(userId)
							.andOperator(Criteria.where("date").gte(start))));
		}else if(start==null && end!=null){
			q.addCriteria(Criteria.where("scenarioId").is(scenarioId)
					.andOperator(Criteria.where("userId").is(userId)
							.andOperator(Criteria.where("date").lte(end))));
		}else if(start!=null && end!=null){
			q.addCriteria(Criteria.where("scenarioId").is(scenarioId)
					.andOperator(Criteria.where("userId").is(userId)
							.andOperator(Criteria.where("date").gte(start)
									.andOperator(Criteria.where("date").lte(end)))));
		}else
			throw new BadRequestException();
			
		return mongoOp.find(q, Log.class);
		
	}

	@Override
	public int deleteByScenarioId(String scenarioId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("scenarioId").is(scenarioId));
		WriteResult w = mongoOp.remove(q, Log.class);
		return w.getN();
	}

}
