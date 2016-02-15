package it.polito.applied.smiled.websocket;

import java.util.ArrayList;
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
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;

import it.polito.applied.smiled.rabbit.BrokerConsumer;
import it.polito.applied.smiled.rabbit.ConsumerHandler;
import it.polito.applied.smiled.security.CustomUserDetails;

@Controller
public class NotificationWebSocketController implements WebSocketHandler{
	
	@Autowired
	private ApplicationContext appContext;
	
	@Autowired
	private RabbitTemplate template;
	
	private BrokerConsumer consumer;
	private ConnectionFactory connectionFactory;
	
	/*La chiave di questa mappa rappresenta l'id dell'  utente, così da gestire con lo stesso consumer il prelievo dalla coda di un utente
	 * ed inviarlo a tutte le connessioni websocket attive per quell'utente*/
	private Map<String, BrokerConsumer> sessions;
	private Object lock;

	@PostConstruct
	private void initialize(){
		sessions = new HashMap<String, BrokerConsumer>();
		connectionFactory = template.getConnectionFactory();
		lock = new Object();
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
		System.out.println(session.getId());
		synchronized(lock) {
			if(sessions.containsKey(user.getId())){
				BrokerConsumer c = sessions.get(user.getId());
				c.addSessionToHandler(session);
			}else{
				List<WebSocketSession> sessionsToHandler = new ArrayList<WebSocketSession>();
				sessionsToHandler.add(session);
				ConsumerHandler handler = (ConsumerHandler) appContext.getBean("consumerHandler",sessionsToHandler);
				consumer = (BrokerConsumer) appContext.getBean("brokerConsumer", "user."+user.getId(), 1, connectionFactory, handler);
				sessions.put(user.getId(), consumer);
			}
		}
		
	}


	@Override
	public void handleMessage(WebSocketSession arg0, WebSocketMessage<?> arg1) throws Exception {

	}


	@Override
	public void handleTransportError(WebSocketSession session, Throwable arg1) throws Exception {
		System.out.println("WEBSOCKET ERROR: "+arg1.getMessage());
	}

	@Override
	public boolean supportsPartialMessages() {
		// TODO Auto-generated method stub
		return false;
	}

}