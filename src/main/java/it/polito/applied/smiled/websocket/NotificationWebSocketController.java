package it.polito.applied.smiled.websocket;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageListener;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import it.polito.applied.smiled.security.CustomUserDetails;


@Controller
public class NotificationWebSocketController implements MessageListener{
	
//	@Autowired
//	private ConnectionFactory connectionFactory;
	
	@SubscribeMapping({"/messages"})
	@PreAuthorize("hasRole('ROLE_USER')")
	public void receiveNotificationsAndMessages(@AuthenticationPrincipal CustomUserDetails user) throws Exception {
//		SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
//		container.setConnectionFactory(connectionFactory);
//		container.setQueueNames("u"+user.getId());
//		container.setMessageListener(new MessageListenerAdapter(this));
//		container.start();
	}

	@Override
	public void onMessage(Message arg0) {
		// TODO Auto-generated method stub
		
	}
	
}
