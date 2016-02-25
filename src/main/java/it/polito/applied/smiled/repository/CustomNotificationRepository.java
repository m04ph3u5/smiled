package it.polito.applied.smiled.repository;

import java.util.List;

import it.polito.applied.smiled.rabbit.Notification;

public interface CustomNotificationRepository {

	public void saveToReadNotification(Notification n);
	public void saveSendedNotification(Notification n);
	
	public List<Notification> getToReadNotificationOfUser(String userId);

	void addAllToSended(List<Notification> toSended);
	void addAllToRead(List<Notification> toReinsertInToSend);
}
