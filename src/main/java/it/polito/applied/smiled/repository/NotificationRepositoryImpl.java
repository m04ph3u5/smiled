package it.polito.applied.smiled.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import it.polito.applied.smiled.rabbit.Notification;

public class NotificationRepositoryImpl implements CustomNotificationRepository{
	
	private final String TO_READ = "to_read_notification";
	private final String SENDED = "sended_notification";
	
	@Autowired
	private MongoOperations mongoOp;

	@Override
	public Notification saveToReadNotification(Notification n) {
		mongoOp.save(n, TO_READ);
		return n;
	}

	@Override
	public Notification saveSendedNotification(Notification n) {
		mongoOp.save(n, SENDED);
		return n;
	}

	@Override
	public List<Notification> findToReadNotificationOfUser(String userId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("receiverId").is(userId));
		q.with(new Sort(Sort.Direction.ASC, "date"));
		return mongoOp.find(q, Notification.class, TO_READ);
	}

	@Override
	public void addAllToSended(List<Notification> toSended) {
		for(Notification n : toSended)
			mongoOp.insert(n, SENDED);
	}

	@Override
	public void addAllToRead(List<Notification> toReinsertInToSend) {
		for(Notification n : toReinsertInToSend)
			mongoOp.save(n, TO_READ);		
	}


	@Override
	public void moveFromToReadToSended(List<String> ids) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").in(ids));
		List<Notification> n = mongoOp.findAllAndRemove(q, Notification.class, TO_READ);
		mongoOp.insert(n, SENDED);
	}

	@Override
	public List<Notification> findLastUserSendedNotification(String id, Integer num, String old) {
		Query q = new Query();
		if(old!=null && !old.isEmpty()){
			q.addCriteria(Criteria.where("receiverId").is(id)
				.andOperator(Criteria.where("_id").lt(new ObjectId(old))));
		}else
			q.addCriteria(Criteria.where("receiverId").is(id));
		q.limit(num);
		q.with(new Sort(Sort.Direction.DESC, "id"));
		return mongoOp.find(q, Notification.class, SENDED);
	}

	@Override
	public void setViewed(String notificationId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("id").is(notificationId));
		Update u = new Update();
		u.set("viewed", true);
		mongoOp.updateFirst(q, u, Notification.class, SENDED);
	}
	
	

}
