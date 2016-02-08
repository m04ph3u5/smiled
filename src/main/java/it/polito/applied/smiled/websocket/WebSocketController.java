package it.polito.applied.smiled.websocket;

import java.util.Date;

import org.springframework.amqp.core.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import it.polito.applied.smiled.rabbit.MessagePayload;
import it.polito.applied.smiled.security.CustomUserDetails;

//@Controller
public class WebSocketController {

//	@PreAuthorize("hasRole('ROLE_USER')")
//	@MessageMapping("/messages")
//	@SendTo("/u{userId}")
//	public MessagePayload sendMessage(MessagePayload message, @DestinationVariable String userId, 
//			@AuthenticationPrincipal CustomUserDetails activeUser) {
//		System.out.println("WEBSOCKET CONTROLLER\n"+activeUser.getId());
//		return message;
//	}

}
