package it.polito.applied.smiled.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.mongodb.WriteResult;

import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.pojo.InfoStatistics;
import it.polito.applied.smiled.pojo.Log;
import it.polito.applied.smiled.pojo.LogType;
import it.polito.applied.smiled.pojo.TypeCountOnLog;

public class LogRepositoryImpl implements CustomLogRepository{
	
	@Autowired
	private MongoOperations mongoOp;

	@Override
	public Page<Log> findByUserInDateAndType(String userId, Date start, Date end, LogType type, Integer nPag, Integer nItem) throws BadRequestException {
			
		if(userId==null)
			throw new BadRequestException();
		Query q = new Query();
		Sort s;
		s = new Sort( new Order(Direction.DESC, "date"));
		List<Criteria> criterias = new ArrayList<Criteria>();
		Criteria c1 = new Criteria();
		Criteria c2, c3, c4;
		c1 = Criteria.where("userId").is(userId);
		criterias.add(c1);
		
		if(start!=null){
			c2 = new Criteria();
			c2 = Criteria.where("date").gte(start);
			criterias.add(c2);
		}
		
		if(end!=null){
			c3 = new Criteria();
			c3 = Criteria.where("date").lte(end);
			criterias.add(c3);
		}
		
		if(type!=null){
			c4 = new Criteria();
			c4 = Criteria.where("type").is(type);
			criterias.add(c4);
		}
		
		Criteria finalCriteria = new Criteria().andOperator(criterias.toArray(new Criteria[criterias.size()]));
		q.addCriteria(finalCriteria);
		
		long total = mongoOp.count(q, Log.class);
		Pageable p = new PageRequest(nPag,nItem, s);
		q.with(p);
		List<Log> logs = mongoOp.find(q, Log.class);
		return new PageImpl<Log>(logs, p, total);
	}

	@Override
	public Page<Log> findByScenarioInDateAndType(String scenarioId, Date start,
			Date end, LogType type, Integer nPag, Integer nItem) throws BadRequestException {
		
		if(scenarioId==null)
			throw new BadRequestException();

		Query q = new Query();
		Sort s;
		s = new Sort( new Order(Direction.DESC, "date"));
		List<Criteria> criterias = new ArrayList<Criteria>();
		Criteria c1 = new Criteria();
		Criteria c2, c3, c4;
		c1 = Criteria.where("scenarioId").is(scenarioId);
		criterias.add(c1);
		
		if(start!=null){
			c2 = new Criteria();
			c2 = Criteria.where("date").gte(start);
			criterias.add(c2);
		}
		
		if(end!=null){
			c3 = new Criteria();
			c3 = Criteria.where("date").lte(end);
			criterias.add(c3);
		}
		
		if(type!=null){
			c4 = new Criteria();
			c4 = Criteria.where("type").is(type);
			criterias.add(c4);
		}
		
		Criteria finalCriteria = new Criteria().andOperator(criterias.toArray(new Criteria[criterias.size()]));
		q.addCriteria(finalCriteria);
					
		long total = mongoOp.count(q, Log.class);
		Pageable p = new PageRequest(nPag,nItem, s);
		q.with(p);
		List<Log> logs = mongoOp.find(q, Log.class);
		return new PageImpl<Log>(logs, p, total);
	}

	@Override
	public Page<Log> findByUserAndScenarioInDateAndType(String userId,
			String scenarioId, Date start, Date end, LogType type, Integer nPag, Integer nItem) throws BadRequestException {
		
		if(userId==null || scenarioId==null)
			throw new BadRequestException();
		
		Query q = new Query();
		Sort s;
		s = new Sort( new Order(Direction.DESC, "date"));
		List<Criteria> criterias = new ArrayList<Criteria>();
		Criteria c1 = new Criteria();
		Criteria c2, c3, c4;
		Criteria c5 = new Criteria();
		c1 = Criteria.where("userId").is(userId);
		c5 = Criteria.where("scenarioId").is(scenarioId);
		criterias.add(c1);
		criterias.add(c5);
		
		if(start!=null){
			c2 = new Criteria();
			c2 = Criteria.where("date").gte(start);
			criterias.add(c2);
		}
		
		if(end!=null){
			c3 = new Criteria();
			c3 = Criteria.where("date").lte(end);
			criterias.add(c3);
		}
		
		if(type!=null){
			c4 = new Criteria();
			c4 = Criteria.where("type").is(type);
			criterias.add(c4);
		}
		
		Criteria finalCriteria = new Criteria().andOperator(criterias.toArray(new Criteria[criterias.size()]));
		q.addCriteria(finalCriteria);
		
		long total = mongoOp.count(q, Log.class);
		Pageable p = new PageRequest(nPag,nItem, s);
		q.with(p);
		List<Log> logs = mongoOp.find(q, Log.class);
		return new PageImpl<Log>(logs, p, total);
		
	}

	@Override
	public int deleteByScenarioId(String scenarioId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("scenarioId").is(scenarioId));
		WriteResult w = mongoOp.remove(q, Log.class);
		return w.getN();
	}

	@Override
	public Page<Log> getPagingLogs(Date start, Date end, LogType type, Integer nPag, Integer nItem) {
		List<Criteria> criterias = new ArrayList<Criteria>();
		Criteria c1, c2, c3;
		Query q = new Query();
		Sort s;
		s = new Sort( new Order(Direction.DESC, "date"));
		
		if(start!=null){
			c1=new Criteria();
			c1 = Criteria.where("date").gte(start);
			criterias.add(c1);
		}if(end!=null){
			c2=new Criteria();
			c2 = Criteria.where("date").lte(end);
			criterias.add(c2);
		}if(type!=null){
			c3=new Criteria();
			c3 = Criteria.where("type").is(type);
			criterias.add(c3);
		}
		
		if(criterias.size()>0){
			Criteria finalCriteria = new Criteria().andOperator(criterias.toArray(new Criteria[criterias.size()]));
			q.addCriteria(finalCriteria);
		}
		
		
		long total = mongoOp.count(q, Log.class);
		
		Pageable p = new PageRequest(nPag,nItem, s);
		q.with(p);
		
		List<Log> logs = mongoOp.find(q, Log.class);
		return new PageImpl<Log>(logs, p, total);
	}

	@Override
	public long numLogOfUser(String userId) throws BadRequestException {
		if(userId==null)
			throw new BadRequestException();
		
		Query q = new Query();
		Criteria c = new Criteria();
		c = Criteria.where("userId").is(userId);
		q.addCriteria(c);
		
		return mongoOp.count(q, Log.class);
	}

	@Override
	public long numLogOfScenario(String scenarioId) throws BadRequestException {
		if(scenarioId==null)
			throw new BadRequestException();
		Query q = new Query();
		Criteria c = new Criteria();
		c = Criteria.where("scenarioId").is(scenarioId);
		q.addCriteria(c);
		
		return mongoOp.count(q, Log.class);
	}

	@Override
	public long numLogOfUserInScenario(String userId, String scenarioId) throws BadRequestException {
		if(userId==null || scenarioId==null)
			throw new BadRequestException();
		Query q = new Query();
		Criteria c = new Criteria();
		c = Criteria.where("userId").is(userId).andOperator(Criteria.where("scenarioId").is(scenarioId));
		q.addCriteria(c);
		
		return mongoOp.count(q, Log.class);
	}

	@Override
	public InfoStatistics getInfoStatisticsUser(String userId) throws BadRequestException {
		
		Criteria c = new Criteria();
		Criteria cOr = new Criteria();
		cOr.orOperator(Criteria.where("type").is(LogType.NEW_POST), 
				Criteria.where("type").is(LogType.NEW_COMM), 
				Criteria.where("type").is(LogType.NEW_META_COMM),
				Criteria.where("type").is(LogType.NEW_TRUST_FILE),
				Criteria.where("type").is(LogType.ADD_LIKE_POST),
				Criteria.where("type").is(LogType.UP_POST),
				Criteria.where("type").is(LogType.DEL_POST),
				Criteria.where("type").is(LogType.NEW_SCEN),
				Criteria.where("type").is(LogType.CHANGE_PWD)
				);
		c = Criteria.where("userId").is(userId).andOperator(cOr);
		
		Aggregation agg = Aggregation.newAggregation(Aggregation.match(c), 
				Aggregation.group("type").count().as("typeCount"),
				Aggregation.project("typeCount").and("type").previousOperation());
		
		AggregationResults result = mongoOp.aggregate(agg, Log.class, TypeCountOnLog.class);
		
		List<TypeCountOnLog> l = result.getMappedResults();
		
		InfoStatistics info = getInfo(l);
		
		long totLog;
		//faccio un'altra query al db per reperire il numero totale di operazioni fatte dall'utente
		totLog = numLogOfUser(userId);
		info.setNumTotalLog(totLog);
		
		return info;
	}

	private InfoStatistics getInfo(List<TypeCountOnLog> l){
		InfoStatistics info = new InfoStatistics();
		
		for (TypeCountOnLog t : l){
			if(t.getType().equals(LogType.NEW_POST))
				info.setNumPost(t.getTypeCount());
			else if(t.getType().equals(LogType.NEW_COMM))
				info.setNumComment(t.getTypeCount());
			else if(t.getType().equals(LogType.NEW_META_COMM))
				info.setNumMetaComment(t.getTypeCount());
			else if(t.getType().equals(LogType.NEW_TRUST_FILE))
				info.setNumFile(t.getTypeCount());
			else if(t.getType().equals(LogType.ADD_LIKE_POST))
				info.setNumLike(t.getTypeCount());
			else if(t.getType().equals(LogType.UP_POST))
				info.setUpdatePost(t.getTypeCount());
			else if(t.getType().equals(LogType.DEL_POST))
				info.setDeletePost(t.getTypeCount());
			else if(t.getType().equals(LogType.NEW_SCEN))
				info.setNewScen(t.getTypeCount());
			else if(t.getType().equals(LogType.CHANGE_PWD))
				info.setChangePwd(t.getTypeCount());
		}
		
		return info;
	}
	
	@Override
	public InfoStatistics getInfoStatisticsScenario(String scenarioId) throws BadRequestException {
		Criteria c = new Criteria();
		Criteria cOr = new Criteria();
		cOr.orOperator(Criteria.where("type").is(LogType.NEW_POST), 
				Criteria.where("type").is(LogType.NEW_COMM), 
				Criteria.where("type").is(LogType.NEW_META_COMM),
				Criteria.where("type").is(LogType.NEW_TRUST_FILE),
				Criteria.where("type").is(LogType.ADD_LIKE_POST)
				);
		c = Criteria.where("scenarioId").is(scenarioId).andOperator(cOr);
		
		Aggregation agg = Aggregation.newAggregation(Aggregation.match(c), 
				Aggregation.group("type").count().as("typeCount"),
				Aggregation.project("typeCount").and("type").previousOperation());
		
		AggregationResults result = mongoOp.aggregate(agg, Log.class, TypeCountOnLog.class);
		
		List<TypeCountOnLog> l = result.getMappedResults();
		
		InfoStatistics info = getInfo(l);
		
		long totLog;
		//faccio un'altra query al db per reperire il numero totale di operazioni fatte nello scenario
		totLog=numLogOfScenario(scenarioId);
		info.setNumTotalLog(totLog);
		return info;
	}

	@Override
	public InfoStatistics getInfoStatisticsUserInScenario(String userId, String scenarioId) throws BadRequestException {
		Criteria c = new Criteria();
		Criteria cAnd = new Criteria();
		Criteria cOr = new Criteria();
		cOr.orOperator(Criteria.where("type").is(LogType.NEW_POST), 
				Criteria.where("type").is(LogType.NEW_COMM), 
				Criteria.where("type").is(LogType.NEW_META_COMM),
				Criteria.where("type").is(LogType.NEW_TRUST_FILE),
				Criteria.where("type").is(LogType.ADD_LIKE_POST)
				);
		c = Criteria.where("userId").is(userId).andOperator(Criteria.where("scenarioId").is(scenarioId).andOperator(cOr));
		
		Aggregation agg = Aggregation.newAggregation(Aggregation.match(c), 
				Aggregation.group("type").count().as("typeCount"),
				Aggregation.project("typeCount").and("type").previousOperation());
		
		AggregationResults result = mongoOp.aggregate(agg, Log.class, TypeCountOnLog.class);
		
		List<TypeCountOnLog> l = result.getMappedResults();
		
		InfoStatistics info = getInfo(l);
		
		long totLog;
		//faccio un'altra query al db per reperire il numero totale di operazioni fatte nello scenario dall'utente
		totLog=numLogOfUserInScenario(userId, scenarioId);
		info.setNumTotalLog(totLog);
		
		return info;
	}

}
