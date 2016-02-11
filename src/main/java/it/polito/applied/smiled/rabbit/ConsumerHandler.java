package it.polito.applied.smiled.rabbit;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageListener;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;

public class ConsumerHandler implements MessageListener {
	
//	@Autowired
//	private UserRepository userRepo;

	private List<WebSocketSession> sessions;
	private Object lock;
	
	public ConsumerHandler(){
		this(null);
	}
	
	public ConsumerHandler(List<WebSocketSession> sessions){
		this.sessions = sessions;
		lock = new Object();
	}

	@Override
	public void onMessage(Message message) {
		System.out.println("Received--------------------------");
		synchronized(lock){
			try {
				WebSocketMessage<?> m = new TextMessage(message.getBody());
				
	/*	  Per convertire devo essere sicuro di inviare un MessagePayload al broker e non Notification o UserMessage
		TODO Modificare Broker Producer e/o NotifyService (successivamente anche MessageService)
		
				ObjectMapper mapper = new ObjectMapper();
				MessagePayload messageObject = mapper.readValue(message.getBody(), MessagePayload.class);
	*/
				for(WebSocketSession session : sessions){
					session.sendMessage(m);
					System.out.println("Sended to: "+session.getId());
				}
			} catch (IOException e) {
				System.out.println("ERROR SENDING MESSAGE!\n"+e.getMessage());
			}
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
