package it.polito.applied.smiled.rabbit;

public enum NotificationType {
	
	/*Apertura di uno scenario
	 * --> Tutti i partecipanti*/
	OPEN_SCENARIO,
	
	/*Chiusura di uno scenario
	 * --> Tutti i partecipanti*/
	CLOSE_SCENARIO,
	
	/*Creazione nuovo post 
	 * 	--> Tutti i partecipanti*/
	NEW_POST,
	
	/*Commento ad un post 
	 * 	--> Creatore post, chi interpreta il personaggio (se != da creatore), 
	 * 		tutti quelli che sono taggati, tutti quelli che hanno commentato*/
	COMMENT_TO_POST,
	
	/*Suggerimento ad un post 
	 * 	--> Creatore post, chi interpreta il personaggio (se != da creatore), 
	 * 		tutti quelli che hanno metacommentato*/
	METACOMMENT_TO_POST,
	
	/*Like ad un post
	 * 	--> Creatore post, chi interpreta il personaggio (se != da creatore), 
	 * 		tutti quelli che sono taggati*/
	LIKE_TO_POST,
	
	/*Tag di un personaggio ad un post
	 * --> Creatore post, chi interpreta il personaggio (se != da creatore), 
	 * 		tutti quelli che sono taggati*/
	TAG_TO_POST,
	
	/*Nuova associazione utente-personaggio
	 * --> Tutti i partecipanti allo scenario se aperto, tutti i moderatori se in creazione*/
	NEW_ASSOCIATION,
	
	/*Eliminazione associazione utente-personaggio
	 * --> Utente che interpretava il personaggio se aperto, tutti i moderatori se in creazione*/
	DEL_ASSOCIATION,
	
	/*Modifica del post da parte di un moderatore (!= dal creatore)
	 * --> Autore post*/
	MODIFIED_BY_MOD,
	
	/*Eliminazione post da parte di un moderatore
	 * --> Autore post*/
	DELETED_BY_MOD,
	
	/*Assegnazione compito da parte del docente a uno studente
	 * --> Utente a cui è stato assegnato il compito*/
	NEW_MISSION,
		
	/*Aggiunto nuovo moderatore allo scenario
	 *  --> Tutti i partecipanti se aperto, tutti i moderatori se in creazione*/
	NEW_MOD,
	
	/*Elimino moderatore allo scenario
	 *  --> Tutti i partecipanti se aperto, tutti i moderatori se in crezione*/
	DEL_MOD,
	
	/*Aggiunto nuovo partecipante allo scenario
	 *  --> Tutti i partecipanti se aperto*/
	NEW_ATTENDEE,
	
	/*Rimosso partecipante dallo scenario
	 *  --> Tutti i partecipanti se aperto*/
	DEL_ATTENDEE
}
