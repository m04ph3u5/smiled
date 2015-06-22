package it.polito.applied.smiled.websocket;

import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

@Controller
public class MarcoController{
	
	@SubscribeMapping({"/marco"})
	public Shout handleTextMessage(Shout shout) throws Exception {
		System.out.println("Received message: " + shout.getMessage());
		Thread.sleep(2000);
		return new Shout("Polo!");

	}
	
}
