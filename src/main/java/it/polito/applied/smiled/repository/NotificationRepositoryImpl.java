package it.polito.applied.smiled.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import it.polito.applied.smiled.rabbit.Notification;

public class NotificationRepositoryImpl implements CustomNotificationRepository{
	
	private final String TO_READ = "to_read_notification";
	private final String SENDED = "sended_notification";
	
	@Autowired
	private MongoOperations mongoOp;

	@Override
	public void saveToReadNotification(Notification n) {
		mongoOp.save(n, TO_READ);
	}

	@Override
	public void saveSendedNotification(Notification n) {
		mongoOp.save(n, SENDED);
	}

	@Override
	public List<Notification> getToReadNotificationOfUser(String userId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("receiverId").is(userId));
		
		return mongoOp.findAllAndRemove(q, Notification.class, TO_READ);
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
	
	

}
