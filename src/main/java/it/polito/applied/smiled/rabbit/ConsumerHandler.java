package it.polito.applied.smiled.rabbit;

import java.io.IOException;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageListener;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

public class ConsumerHandler implements MessageListener {
	
//	@Autowired
//	private UserRepository userRepo;

	private WebSocketSession session;
	
	public ConsumerHandler(){
		
	}
	
	public ConsumerHandler(WebSocketSession session){
		this.session = session;
	}

	@Override
	public void onMessage(Message message) {
		System.out.println("Received--------------------------");
		try {
			session.sendMessage(new TextMessage(message.getBody()));
			System.out.println("SENDED");
		} catch (IOException e) {
			System.out.println("ERROR SENDING MESSAGE!\n"+e.getMessage());
		}
		
	}
}
