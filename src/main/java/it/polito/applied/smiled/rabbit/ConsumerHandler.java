package it.polito.applied.smiled.rabbit;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;

import com.fasterxml.jackson.databind.ObjectMapper;

import it.polito.applied.smiled.repository.NotificationRepository;

public class ConsumerHandler implements MessageListener {
	
	@Autowired
	private NotificationRepository notificationRepo;

	private List<WebSocketSession> sessions;
	private Object lock;
	private ObjectMapper mapper;
	private String userId;

	
	public ConsumerHandler(){
		this(null,null);
	}
	
	public ConsumerHandler(List<WebSocketSession> sessions, String userId){
		this.sessions = sessions;
		this.userId = userId;
		lock = new Object();
		mapper = new ObjectMapper();
	}

	@Override
	public void onMessage(Message message) {
		Comunication c=null;
		Notification notification = null;
		UserMessage userMessage = null;
		String messageText="";
		try {
			c = mapper.readValue(message.getBody(), Comunication.class);	
			if(c!=null){
				if(c.getClass().equals(Notification.class)){
					notification = (Notification) c;
					notification.setReceiverId(userId);
					if(!notification.getVerb().equals(NotificationType.NEW_POST) && !notification.getVerb().equals(NotificationType.UPD_POST)
							&& !notification.getVerb().equals(NotificationType.UPD_NEW_COMMENT) && !notification.getVerb().equals(NotificationType.UPD_NEW_META)
							&& !notification.getVerb().equals(NotificationType.UPD_DEL_COMMENT) && !notification.getVerb().equals(NotificationType.UPD_DEL_METACOMMENT)){
						
						if((notification.getSender()!=null && !notification.getSender().equals(userId)) || notification.getSender()==null)
							notification = notificationRepo.saveToReadNotification(notification);
						
					}
					messageText = mapper.writeValueAsString(notification);
				}else if(c.getClass().equals(UserMessage.class)){
					userMessage = (UserMessage) c;
				}
				if(!messageText.isEmpty()){
					WebSocketMessage<?> m = new TextMessage(messageText);
					synchronized(lock){
						for(WebSocketSession session : sessions){
							session.sendMessage(m);
						}
					}
				}
				
			}
		} catch (IOException e) {
			System.out.println("ERROR SENDING MESSAGE!\n"+e.getMessage());
		} 		
	}
	
	
	public void addSession(WebSocketSession s){
		synchronized (lock) {
			boolean present = false;
			for(WebSocketSession session : sessions)
				if(session.getId().equals(s.getId()))
					present = true;
			if(!present)
				sessions.add(s);
		}
	}
	
	public void removeSession(String sessionId){
		synchronized (lock) {
			if(!sessions.isEmpty()){
				for(WebSocketSession session : sessions){
					if(session.getId().equals(sessionId)){
						sessions.remove(session);
						break;
					}
				}
			}
		}
	}
	
	public int getNumberOfSessions(){
		int s;
		synchronized(lock){
			s = sessions.size();
		}
		return s;
	}
	
	public List<String> getSessionsId(){
		List<String> sessionsId = new ArrayList<String>();
		synchronized(lock){
			for(WebSocketSession session : sessions){
				sessionsId.add(session.getId());
			}
		}
		return sessionsId;
	}
}
