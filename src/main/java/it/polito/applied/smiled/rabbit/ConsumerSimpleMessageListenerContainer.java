package it.polito.applied.smiled.rabbit;

import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;


public class ConsumerSimpleMessageListenerContainer extends SimpleMessageListenerContainer{
	
	 public void startConsumers() throws Exception {
		 super.doStart();
	 }

	 public void stopConsumer() throws Throwable {
		 super.doStop();
	 }
}
