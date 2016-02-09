package it.polito.applied.smiled.websocket;

import java.util.HashMap;
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
	private Map<String, BrokerConsumer> sessions;

	/**/
	@PostConstruct
	private void initialize(){
		sessions = new HashMap<String, BrokerConsumer>();
		connectionFactory = template.getConnectionFactory();
	}
	
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		System.out.println("WEBSOCKET CLOSED: "+status);
		try {
			BrokerConsumer c = sessions.get(session.getId());
			c.stopConsumer();
		} catch (Throwable e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		session.close();
	}

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		Authentication auth = (Authentication) session.getPrincipal();
		CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
		ConsumerHandler handler = (ConsumerHandler) appContext.getBean("consumerHandler",session);
		consumer = (BrokerConsumer) appContext.getBean("brokerConsumer", "user."+user.getId(), 1, connectionFactory, handler);
//		 new BrokerConsumer("user."+user.getId(), 1, connectionFactory, session)
		sessions.put(session.getId(), consumer);
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