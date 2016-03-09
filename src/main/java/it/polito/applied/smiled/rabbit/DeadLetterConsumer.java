package it.polito.applied.smiled.rabbit;

import java.util.ArrayList;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageListener;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.databind.ObjectMapper;

import it.polito.applied.smiled.repository.NotificationRepository;

public class DeadLetterConsumer implements MessageListener{
	
	@Autowired
	private NotificationRepository notificationRepo;
	
	private ObjectMapper mapper;

	
	@PostConstruct
	public void postConstruct(){
		System.out.println("DeadLetterConsumer constructed");
		mapper = new ObjectMapper();
	}

	@Override
	public void onMessage(Message message) {
		try{
			System.out.println("Dead letter");
			Comunication c=null;
			Notification notification = null;
			UserMessage userMessage = null;
			MessageProperties prop = message.getMessageProperties();
			ArrayList<Object> xDeath = (ArrayList<Object>) prop.getHeaders().get("x-death");
			if(xDeath!=null && xDeath.size()>0){
				Map<String, Object> p = (Map<String, Object>) xDeath.get(0);
				String userQueue = (String) p.get("queue");
				String userId = userQueue.substring(5, userQueue.length());
				
				c = mapper.readValue(message.getBody(), Comunication.class);	
				if(c.getClass().equals(Notification.class)){
					notification = (Notification) c;
					notification.setReceiverId(userId);
					if(!notification.getVerb().equals(NotificationType.NEW_POST) && !notification.getVerb().equals(NotificationType.UPD_POST)
							&& !notification.getVerb().equals(NotificationType.UPD_NEW_COMMENT) && !notification.getVerb().equals(NotificationType.UPD_NEW_META)
							&& !notification.getVerb().equals(NotificationType.UPD_DEL_COMMENT) && !notification.getVerb().equals(NotificationType.UPD_DEL_METACOMMENT)){
						
						if((notification.getSender()!=null && !notification.getSender().equals(userId)) || notification.getSender()==null)
							notificationRepo.saveToReadNotification(notification);
					}
				}else if(c.getClass().equals(UserMessage.class)){
					
				}
			}
		}catch(Exception e){
			System.out.println("EXCEPTION ON DEAD LETTER HANDELR:\n"+e.getMessage()+" "+e.getClass().getName());
		}
	}
	

}
