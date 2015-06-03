package it.polito.applied.smiled.mailMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailMessageService {

	@Autowired
	JavaMailSender mailSender;

	public void sendTeacherRegistrationEmail(String firstName, String email,String token){
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom("noreply@smiled.com");
		message.setTo(email);
		message.setSubject("SMILED! Ciao "+firstName+", conferma la tua registrazione");
		message.setText("Clicca sul link che trovi in basso per confermare la tua registrazione.\n\n"
				+ "http://localhost:8080/ThesisProject/registrationConfirm.html?token="+token+"&email="+email+"\n\n\n"
						+ "A presto\nSMILED");
	
		mailSender.send(message);
	}

	public void sendStudentRegistrationEmail(String email,
			String pwd, String teacherName) {
		
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom("noreply@smiled.com");
		message.setTo(email);
		message.setSubject("SMILED! Ciao, sei stato invitato a SMILED");
		message.setText("Ciao\n\n"
				+"il prof. " + teacherName+" ti ha invitato a iscriverti a SMILED.\n\n "
						+ "Per il tuo primo accesso utilizza la seguente password: \n" + pwd + "\n\n" 
						  + "Segui il link in basso per iniizare ad utilizzare Smiled\n\n"
							+ "https://localhost:8443/ThesisProject/setPassword.html \n\n\n"							
								+ "A presto\n\nSMILED\n");
		
	
		mailSender.send(message);
	}

	
}
