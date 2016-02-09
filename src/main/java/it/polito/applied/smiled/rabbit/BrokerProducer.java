package it.polito.applied.smiled.rabbit;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.Binding.DestinationType;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class BrokerProducer {

	@Autowired
	private RabbitAdmin admin;
		
	@Autowired
	private RabbitTemplate template;
	
	
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
		template.convertAndSend(exchange,routingKey, n);
	}
	
	public MessagePayload receiveFromQueue(String queueName){
		return (MessagePayload) template.receiveAndConvert(queueName);
	}
	
	public void sendMessage(UserMessage m){
		template.convertAndSend("directExchange", "u"+m.getReceiverId(), m);
	}

}
