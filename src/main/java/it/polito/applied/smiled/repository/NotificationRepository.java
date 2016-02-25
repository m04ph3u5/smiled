package it.polito.applied.smiled.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import it.polito.applied.smiled.rabbit.Notification;

public interface NotificationRepository extends MongoRepository<Notification, String>, CustomNotificationRepository {


}
