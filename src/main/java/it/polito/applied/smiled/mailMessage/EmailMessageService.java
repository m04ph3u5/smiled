package it.polito.applied.smiled.mailMessage;

import it.polito.applied.smiled.pojo.Issue;
import it.polito.applied.smiled.pojo.ResetPasswordToken;
import it.polito.applied.smiled.pojo.user.User;
import it.polito.applied.smiled.security.CustomUserDetails;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.Date;
import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailMessageService {

	@Autowired
	JavaMailSender mailSender;
	
//	private Properties prop = new Properties();
//	private InputStream input = null;
	
	@Value("${mailAddress.from}")
	private String from;
	
	@Value("${mailAddress.to}")
	private String to;
	
	@Value("${domain}")
	private String domain;

	public void sendTeacherRegistrationEmail(String firstName, String email,String token){
//		
//		try {
//			input = new FileInputStream("/WEB-INF/config/properties");
//		} catch (FileNotFoundException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
		
		
		/*EMAIL INFORMATIVA INVIATA ALLA PERSONA CHE STA CERCANDO DI REGISTRARSI */
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(from);
		message.setTo(email);
		message.setSubject("Meschola! Ciao "+firstName+", la tua richiesta di registrazione e' stata presa in carico");
		message.setText("Ciao "+firstName+" ,la tua richiesta di registrazione e' stata presa in carico. Presto riceverai ulteriori dettagli! "
						+ "A presto\nMESCHOLA");
	
		System.out.println("Sto inviando una mail di registrazione docente all'indirizzo: "+ email);
		System.out.println("dall'indirizzo: "+ from);
		mailSender.send(message);
		
		/*EMAIL PER CONFERMA INVIATA ALLA NOSTRA CASELLA DI POSTA */
		SimpleMailMessage message2 = new SimpleMailMessage();	
		message2.setFrom(from);
		message2.setTo(to);
		message2.setSubject("Richiesta di registrazione da parte di "+firstName+ " per l'indirizzo "+email);
		message2.setText("Clicca sul link che trovi in basso per confermare la registrazione di "+firstName+" con l'indirizzo "+email+"\n\n"
				+ domain+"registrationConfirm.html?token="+token+"&email="+email+"\n\n\n"
						+ "A presto\nMESCHOLA");
	
		mailSender.send(message2);
	}

	public void sendStudentRegistrationEmail(String email,
			String pwd, String teacherName) {
		
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(from);
		message.setTo(email);
		message.setSubject("Meschola! Ciao, sei stato invitato a MESCHOLA");
		message.setText("Ciao\n\n"
				+"il prof. " + teacherName+" ti ha invitato a iscriverti a MESCHOLA.\n\n"
						+ "Per il tuo primo accesso utilizza la seguente password: \n\n" + pwd + "\n\n" 
						  + "Segui il link in basso per inizare ad utilizzare Meschola\n\n"
							+ domain+"setPassword \n\n\n"							
								+ "A presto\n\nMESCHOLA\n");
		
	
		mailSender.send(message);
	}
	public void sendErrorEmail (String errorMessage){
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(from);
		message.setTo(to);
		message.setSubject("Meschola! Errore sul server!!!");
		message.setText("Si � verificato il seguente problema:\n\n " + errorMessage);
				
	
		mailSender.send(message);
	}
	public void sendRegistrationConfirmTeacher(String email, String teacherName){
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(from);
		message.setTo(email);
		message.setSubject("Meschola! Conferma registrazione");
		message.setText("Ciao "+teacherName+"\n\n "
				+ "Il team di Meschola ha confermato la tua registrazione alla piattaforma.\n"
				+ "Inizia subito a scoprire il mondo di Meschola\n\n"
				+ domain+"\n\n"
				+ "Saluti,\n"
				+ "Il team di Meschola");
				
	
		mailSender.send(message);
	}

	public void sendExpiredEmail(String email) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(from);
		message.setTo(email);
		message.setSubject("Meschola! Conferma registrazione");
		message.setText("Gentile utente\n\n "
				+ "e' passato troppo tempo dalla tua ultima registrazione. Affiche' tu possa utilizzare al meglio i nostri servizi, e' necessario che tu"
				+ "ripeta la procedura di registrazione\n\nGrazie per la collaborazione\n\n"
				+ "Saluti,\n"
				+ "Il team di Meschola");
				
	
		mailSender.send(message);
		
	}
	
	public void sendInviteTeacherEmail(String email, String inviterTeacherName){
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(from);
		message.setTo(email);
		message.setSubject("Meschola! "+inviterTeacherName+" ti ha invitato ad iscriverti");
		message.setText("Gentile utente\n\n "
				+ "il docente "+ inviterTeacherName +" ti ha invitato ad iscriverti a meschola.\n\n"
				+ "Per farlo bastano pochi semplici passi:\nclicca qui: www.meschola.it ed iscriviti subito."
				+ "Saluti,\n"
				+ "Il team di Meschola");
				
	
		mailSender.send(message);
	}

	public void sendReportEmail(User activeUser, Issue issue) {
		SimpleMailMessage message = new SimpleMailMessage();
		Date d = new Date();
		message.setFrom(from);
		message.setTo("info@meschola.it");
		message.setSubject("Meschola - Report problema");
		message.setText("Segnalazione problema da parte di "+activeUser.getLastName()+" "+activeUser.getFirstName()
				+ "\nEmail: "+activeUser.getEmail()
				+ "\n\nData: "+d.toString()
				+ "\n\nOperazione precedente: \n"+issue.getPreOperation()
				+ ";\n\nAnomalia riscontrata: \n"+issue.getIssue()
				+ ";\n\nComportamento atteso: \n"+issue.getExpect()
				+ ".");
				
	
		mailSender.send(message);
	}

	public void sendResetPasswordEmail(User u, ResetPasswordToken t) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(from);
		message.setTo(t.getEmail());
		message.setSubject("Meschola - Richiesta reset password");
		message.setText("Salve "+u.getFirstName()+",\n\n"
				+ "Hai dimenticato le credenziali? Clicca sul link sottostante per resettare la tua password "
				+ "e sceglierne una nuova.\n\n"
				+ "https://meschola.it/reset-password.html?token="+t.getToken()+"&email="+t.getEmail()+"\n\n"
				+ "Se invece non sei stato tu a richiedere questa operazione, ignora questa comunicazione. Ci scusiamo per il disturbo."
				+ "\n\n\nBuona giornata\n\nIl team di Meschola");
		mailSender.send(message);

	}

	
}
