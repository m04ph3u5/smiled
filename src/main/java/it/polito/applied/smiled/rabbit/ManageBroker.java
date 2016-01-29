package it.polito.applied.smiled.rabbit;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.Binding.DestinationType;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class ManageBroker {

	@Autowired
	private RabbitAdmin admin;
		
	@Autowired
	private AmqpTemplate amqpTemplate;
	
	public void createQueue(String queueName){
		Queue q = new Queue(queueName);
		admin.declareQueue(q);
	}
	
	public void createBinding(String queueName, String exchange, String routingKey){
		Binding b = new Binding(queueName, DestinationType.QUEUE, exchange, routingKey, null);
		admin.declareBinding(b);
	}
	
	public void removeBinding(String queueName, String exchange, String routingKey){
		Binding b = new Binding(queueName, DestinationType.QUEUE, exchange, routingKey, null);
		admin.removeBinding(b);
	}
	
	public void sendNotify(Notification n, String exchange, String routingKey){
		amqpTemplate.convertAndSend(exchange,routingKey,n);
	}
	
	public Notification receiveNotify(String queueName){
		return (Notification) amqpTemplate.receiveAndConvert(queueName);
	}
	
	public void sendMessage(Message m){
		amqpTemplate.convertAndSend("directExchange", m.getReceiverId(), m);
	}
	
	public Message receiveMessage(String queueName){
		return (Message) amqpTemplate.receiveAndConvert(queueName);
	}
}
