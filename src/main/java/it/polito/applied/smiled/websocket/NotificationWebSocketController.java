package it.polito.applied.smiled.websocket;

import java.io.IOException;

import javax.annotation.PreDestroy;

import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;

import it.polito.applied.smiled.security.CustomUserDetails;

@Controller
public class NotificationWebSocketController implements WebSocketHandler{
	
	@Autowired
	private ConnectionFactory connectionFactory;

	private SimpleMessageListenerContainer container;

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		if(container.isActive())
			container.stop();
		System.out.println("DISCONNECTED "+status.getCode());
		session.close(status);
	}


	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		Authentication a = (Authentication)session.getPrincipal();
		if(a==null){
			System.out.println("NOT LOGGED");
			session.close();
		}else{
			container = new SimpleMessageListenerContainer();
			container.setConnectionFactory(connectionFactory);
			CustomUserDetails user = (CustomUserDetails)a.getPrincipal();
			System.out.println("user: "+user.getId());
			container.setQueueNames("user."+user.getId());
			MessageListenerAdapter listener = new MessageListenerAdapter(new CustomMessageListener(session));
			container.setMessageListener(listener);
			container.start();
		}			
	}


	@Override
	public void handleMessage(WebSocketSession arg0, WebSocketMessage<?> arg1) throws Exception {

	}


	@Override
	public void handleTransportError(WebSocketSession session, Throwable arg1) throws Exception {
		if(container.isActive())
			container.stop();
		session.close(CloseStatus.GOING_AWAY);
		System.out.println(arg1.getMessage());
	}


	@Override
	public boolean supportsPartialMessages() {
		// TODO Auto-generated method stub
		return false;
	}

}
/*aaaaaaaaaaaaaaaaaaaaaaa*/
//@SubscribeMapping("/queue")
//public void subscribe(@DestinationVariable String userId, @AuthenticationPrincipal CustomUserDetails user){
//	System.out.println("SUBSCRIBE");
//	container = new SimpleMessageListenerContainer();
//	container.setConnectionFactory(connectionFactory);
//	container.setQueueNames("user."+user.getId());
//	MessageListenerAdapter listener = new MessageListenerAdapter(this);
//	listener.setDefaultListenerMethod("sendMessage");
//	container.setMessageListener(listener);
//	container.start();	
//}
//
//public MessagePayload sendMessage(MessagePayload message) {
//	System.out.println("WEBSOCKET CONTROLLER\n");
//	return message;
//}


////	@PreAuthorize("hasRole('ROLE_USER')")
//	@PostConstruct
//	public void receiveNotificationsAndMessages() throws Exception {
//		System.out.println("MESSAGGES");
//		SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
//		container.setConnectionFactory(connectionFactory);
//		container.setQueueNames("u5698ccd15c4c9bb2fc7d7f95");
//		MessageListenerAdapter listener = new MessageListenerAdapter(this);
//		container.setMessageListener(listener);
//		container.start();
//	}

