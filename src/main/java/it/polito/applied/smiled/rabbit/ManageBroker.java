package it.polito.applied.smiled.rabbit;

import java.io.IOException;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.Binding.DestinationType;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageBuilder;
import org.springframework.amqp.core.MessageDeliveryMode;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.core.MessagePropertiesBuilder;
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
		amqpTemplate.convertAndSend(exchange,routingKey, n);
	}
	
	public MessagePayload receiveFromQueue(String queueName){
		return (MessagePayload) amqpTemplate.receiveAndConvert(queueName);
	}
	
	public void sendMessage(UserMessage m){
		amqpTemplate.convertAndSend("directExchange", "u"+m.getReceiverId(), m);
	}

}
