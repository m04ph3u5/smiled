package it.polito.applied.smiled.websocket;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import it.polito.applied.smiled.rabbit.Ack;
import it.polito.applied.smiled.rabbit.BrokerConsumer;
import it.polito.applied.smiled.rabbit.Comunication;
import it.polito.applied.smiled.rabbit.ComunicationType;
import it.polito.applied.smiled.rabbit.ConsumerHandler;
import it.polito.applied.smiled.rabbit.Notification;
import it.polito.applied.smiled.repository.NotificationRepository;
import it.polito.applied.smiled.security.CustomUserDetails;

@Controller
public class NotificationWebSocketController implements WebSocketHandler{
	
	@Autowired
	private ApplicationContext appContext;
	
	@Autowired
	private RabbitTemplate template;
	
	@Autowired
	private NotificationRepository notificationRepo;
	
	private BrokerConsumer consumer;
	private ConnectionFactory connectionFactory;
	private ObjectMapper mapper;
 
	
	/*La chiave di questa mappa rappresenta l'id dell'  utente, così da gestire con lo stesso consumer il prelievo dalla coda di un utente
	 * ed inviarlo a tutte le connessioni websocket attive per quell'utente*/
	private Map<String, BrokerConsumer> sessions;
	private Object lock;

	@PostConstruct
	private void initialize(){
		sessions = new HashMap<String, BrokerConsumer>();
		connectionFactory = template.getConnectionFactory();
		lock = new Object();
		mapper = new ObjectMapper();
	}
	
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		try {
			Authentication auth = (Authentication) session.getPrincipal();
			CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
			synchronized (lock) {
				BrokerConsumer c = sessions.get(user.getId());
				c.removeSessionToHandler(session.getId());
				if(c.getNumberOfSessions()==0){
					c.stopConsumer();
					sessions.remove(user.getId());
				}
			}
			
		} catch (Throwable e) {
			System.out.println("Error in stopping container");
		} finally{
			session.close();
		}
	}

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		Authentication auth = (Authentication) session.getPrincipal();
		CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();

		sendToReadOldNotification(user, session);
		
		synchronized(lock) {
			if(sessions.containsKey(user.getId())){
				BrokerConsumer c = sessions.get(user.getId());
				c.addSessionToHandler(session);
			}else{
				List<WebSocketSession> sessionsToHandler = new ArrayList<WebSocketSession>();
				sessionsToHandler.add(session);
				ConsumerHandler handler = (ConsumerHandler) appContext.getBean("consumerHandler",sessionsToHandler,user.getId());
				consumer = (BrokerConsumer) appContext.getBean("brokerConsumer", "user."+user.getId(), 1, connectionFactory, handler);
				sessions.put(user.getId(), consumer);
			}
		}
		
	}


    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message){
    	try {
    		if(message.getPayload().toString().equals("undefined"))
    			return;
    		System.out.println("START "+message.getPayloadLength());
    		System.out.println(message.getPayload().toString());
			Comunication c = mapper.readValue(message.getPayload().toString().getBytes(), Comunication.class);
    		System.out.println("AFTER MAPPER");

			if(c.getClass().equals(Ack.class)){
				Ack a = (Ack) c;
				List<String> ids = new ArrayList<String>();
				for(String s : a.getIds())
					ids.add(s);
	    		System.out.println("AFTER LIST ID: "+a.getType());

				if(a.getType().equals(ComunicationType.ACK)){
		    		System.out.println("BEFORE REPO");
					notificationRepo.moveFromToReadToSended(ids);
		    		System.out.println("AFTER REPO");

				}else if(a.getType().equals(ComunicationType.ACK_M)){
					
				}

			}
		} catch (JsonParseException e) {
			System.out.println("1"+e.getMessage());
		} catch (JsonMappingException e) {
			System.out.println("2"+e.getMessage());
		} catch (IOException e) {
			System.out.println("3"+e.getMessage());
		} catch (Exception e) {
			System.out.println("4"+e.getMessage());
		}
    }

	@Override
	public void handleTransportError(WebSocketSession session, Throwable arg1) throws Exception {
	}

	@Override
	public boolean supportsPartialMessages() {
		// TODO Auto-generated method stub
		return false;
	}
	
	private void sendToReadOldNotification(CustomUserDetails user, WebSocketSession session){
		List<Notification> toRead = notificationRepo.findToReadNotificationOfUser(user.getId());

		if(toRead!=null && toRead.size()>0){
			try{
				for(int i=0; i<toRead.size(); i++){
					WebSocketMessage<?> message = new TextMessage(mapper.writeValueAsBytes(toRead.get(i)));
					session.sendMessage(message);
				}
			} catch(IOException e){
				System.out.println("Error sending to read notification from persistence\n"+e.getMessage());
			} 
		}
	}

}