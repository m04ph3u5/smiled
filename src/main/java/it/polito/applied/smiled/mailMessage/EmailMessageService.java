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
		
		/*EMAIL INFORMATIVA INVIATA ALLA PERSONA CHE STA CERCANDO DI REGISTRARSI */
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom("noreply@meschola.it");
		message.setTo(email);
		message.setSubject("Meschola! Ciao "+firstName+", la tua richiesta di registrazione è stata presa in carico");
		message.setText("Ciao "+firstName+" ,la tua richiesta di registrazione è stata presa in carico. Presto riceverai ulteriori dettagli! "
						+ "A presto\nMESCHOLA");
	
		mailSender.send(message);
		
		/*EMAIL PER CONFERMA INVIATA ALLA NOSTRA CASELLA DI POSTA */
		SimpleMailMessage message2 = new SimpleMailMessage();	
		message2.setFrom("noreply@meschola.it");
		message2.setTo("storybookpolito@gmail.com");
		message2.setSubject("Richiesta di registrazione da parte di "+firstName+ " per l'indirizzo "+email);
		message2.setText("Clicca sul link che trovi in basso per confermare la registrazione di "+firstName+" con l'indirizzo "+email+"\n\n"
				+ "http://localhost:8080/registrationConfirm.html?token="+token+"&email="+email+"\n\n\n"
						+ "A presto\nMESCHOLA");
	
		mailSender.send(message2);
	}

	public void sendStudentRegistrationEmail(String email,
			String pwd, String teacherName) {
		
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom("noreply@meschola.it");
		message.setTo(email);
		message.setSubject("Meschola! Ciao, sei stato invitato a MESCHOLA");
		message.setText("Ciao\n\n"
				+"il prof. " + teacherName+" ti ha invitato a iscriverti a MESCHOLA.\n\n "
						+ "Per il tuo primo accesso utilizza la seguente password: \n" + pwd + "\n\n" 
						  + "Segui il link in basso per iniizare ad utilizzare Meschola\n\n"
							+ "https://localhost:8443/setPassword.html \n\n\n"							
								+ "A presto\n\nMESCHOLA\n");
		
	
		mailSender.send(message);
	}

	
}
