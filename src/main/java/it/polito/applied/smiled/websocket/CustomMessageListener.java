package it.polito.applied.smiled.websocket;

import java.io.IOException;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageListener;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;


public class CustomMessageListener implements MessageListener{
	
	private WebSocketSession session;
	
	public CustomMessageListener(WebSocketSession session){
		this.session = session;
	}

	@Override
	public void onMessage(Message message) {
		try {
			System.out.println("onMessage");
			session.sendMessage(new TextMessage(message.getBody()));
		} catch (IOException e) {
			System.out.println("EXCEPTION onMessage");
			e.printStackTrace();
		}
		
	}
	

	

}
