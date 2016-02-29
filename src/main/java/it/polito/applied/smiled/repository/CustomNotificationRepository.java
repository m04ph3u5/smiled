package it.polito.applied.smiled.repository;

import java.util.List;

import it.polito.applied.smiled.rabbit.Notification;

public interface CustomNotificationRepository {

	public Notification saveToReadNotification(Notification n);
	public Notification saveSendedNotification(Notification n);
	
	public List<Notification> findToReadNotificationOfUser(String userId);

	void addAllToSended(List<Notification> toSended);
	void addAllToRead(List<Notification> toReinsertInToSend);
	void moveFromToReadToSended(List<String> ids);

}
