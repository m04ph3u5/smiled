package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.pojo.Log;
import it.polito.applied.smiled.pojo.LogSession;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;

public class LogSessionRepositoryImpl implements CustomLogSessionRepository{
	
	@Autowired
	private MongoOperations mongoOp;

	@Override
	public List<LogSession> findByUserInDate(String userId, Date start, Date end)
			throws BadRequestException {
		if(userId==null)
			throw new BadRequestException();
		
		Query q = new Query();
		Criteria c1 = new Criteria();
		
		if(start!=null && end==null){
			c1.andOperator(Criteria.where("userId").is(userId), Criteria.where("start").gte(start));
			q.addCriteria(c1);
		}else if(start==null && end!=null){
			c1.andOperator(Criteria.where("userId").is(userId), Criteria.where("start").lte(end));
			q.addCriteria(c1);
		}else if(start!=null && end!=null){
			q.addCriteria(Criteria.where("userId").is(userId)
					.andOperator(Criteria.where("start").lte(end)
							.andOperator(Criteria.where("start").gte(start))));
		}else
			throw new BadRequestException();
			
		return mongoOp.find(q, LogSession.class);
	}

	@Override
	public List<LogSession> findLoggedUsers() {
		
		Date d = new Date();
		Query q = new Query();
		
		q.addCriteria(Criteria.where("end").gt(d));
		q.fields().exclude("id");
		q.fields().exclude("start");
		q.fields().exclude("end");
		return mongoOp.find(q, LogSession.class);
//		List<String> users = new ArrayList<String>();
//		if(loggedSession!=null){
//			for(LogSession session : loggedSession){
//				users.add(session.getUserId());
//			}
//		}
//		return users;
	}

	@Override
	public List<LogSession> findLoggedUsersInDate(Date start, Date end) throws BadRequestException {
		
//		Query q = new Query();
//		Criteria c1 = new Criteria();
//		
//		if(start==null || end==null)
//			throw new BadRequestException();
//		
//		c1.orOperator(Criteria.where("start").gte(start), Criteria.where("end").lte(end));
//		q.addCriteria(c1);
//		return mongoOp.find(q, LogSession.class);
		
		DBCollection collection = mongoOp.getCollection("LogSession");
		DBObject query = new BasicDBObject();
		List<String> list = collection.distinct("userId", query);
		return null;
		
	}

	@Override
	public Long totalLoggedTimeOfUser(String userId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Long totalLoggedTimeOfUserInDate(String userId, Date start, Date end) {
		// TODO Auto-generated method stub
		return null;
	}

}
