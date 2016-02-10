package it.polito.applied.smiled.rabbit;

import java.util.List;

import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;
import org.springframework.web.socket.WebSocketSession;


public class BrokerConsumer {

	private String queueName;
	private int onOfConsumer;
	private ConsumerSimpleMessageListenerContainer container;
	private List<String> sessionsId;
	private ConsumerHandler handler;
	
	public BrokerConsumer(){};

	public BrokerConsumer(String queueName, int onOfConsumer, ConnectionFactory connectionFactory, 
			ConsumerHandler handler) throws Exception {
		try{
			System.out.println("factory: "+connectionFactory.getHost()+":"+connectionFactory.getPort());
			this.queueName = queueName;
			this.onOfConsumer = onOfConsumer;
			this.handler = handler;
			container = new ConsumerSimpleMessageListenerContainer();
			container.setConnectionFactory(connectionFactory);
			container.setQueueNames(this.queueName);
			container.setConcurrentConsumers(this.onOfConsumer);
			sessionsId = handler.getSessionsId();
			container.setMessageListener(new MessageListenerAdapter(handler));
			container.startConsumers();
		}catch(Exception e){
			System.out.println("EXCEPTION: "+e.getMessage());
		}
	}

	public String getQueueName() {
		return queueName;
	}
	public void setQueueName(String queueName) {
		this.queueName = queueName;
	}
	
	public int getOnOfConsumer() {
		return onOfConsumer;
	}
	public void setOnOfConsumer(int onOfConsumer) {
		this.onOfConsumer = onOfConsumer;
	}

	public void stopConsumer() throws Throwable{
		container.stopConsumer();
	}
	public void addSessionToHandler(WebSocketSession session){
		sessionsId.add(session.getId());
		handler.addSession(session);
	}
	public void removeSessionToHandler(String sessionId){
		sessionsId.remove(sessionsId);
		handler.removeSession(sessionId);
	}
	public int getNumberOfSessions(){
		return handler.getNumberOfSessions();
	}
	

}
