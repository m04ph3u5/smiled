package it.polito.applied.smiled.rabbit;

public enum NotificationType {
	
	/**
	 * Apertura di uno scenario
	 * --> Tutti i partecipanti | TOPIC: scenario 
	 * */
	OPEN_SCENARIO,
	
	/*Chiusura di uno scenario
	 * --> Tutti i partecipanti | TOPIC: scenario*/
	CLOSE_SCENARIO,
	
	/**
	 * Creazione nuovo post 
	 * 	--> Tutti i partecipanti | TOPIC: scenario
	 * */
	NEW_POST,
	
	/**
	 * Modifica di qualsiasi elemento di un post già esistente (nuovo like, modifica del testo, aggiunta di un tag o un file, ecc.)
	 * Tranne commenti e metacommenti
	 * 	--> Tutti i partecipanti | TOPIC: scenario
	 * */
	UPD_POST,
	
	/*Pseudo notifica che arriva a tutti i partecipanti allo scenario e porta con se il nuovo commento da visualizzare/o quello aggiornato
	 * --> Tutti i partecipanti | TOPIC: scenario*/
	UPD_NEW_COMMENT,
	
	/*Pseudo notifica che arriva a tutti i partecipanti allo scenario e porta con se il nuovo suggerimento da visualizzare/o quello aggiornato
	 * --> Tutti i partecipanti | TOPIC: scenario*/
	UPD_NEW_META,
	
	/*Pseudo notifica che arriva a tutti i partecipanti allo scenario e porta con se l'id del commento da cancellare
	 * --> Tutti i partecipanti | TOPIC: scenario*/
	UPD_DEL_COMMENT,
	
	/*Pseudo notifica che arriva a tutti i partecipanti allo scenario e porta con se l'id del suggerimento da cancellare
	 * --> Tutti i partecipanti | TOPIC: scenario*/
	UPD_DEL_METACOMMENT,
	
	/**
	 * Commento ad un post 
	 * 	--> Creatore post, chi interpreta il personaggio (se != da creatore), 
	 * 		tutti quelli che sono taggati, tutti quelli che hanno commentato e/o metacommentato
	 *  TOPIC: postAndComment
	 *  */
	COMMENT_TO_POST,
	
	/**
	 * Suggerimento ad un post 
	 * 	--> Creatore post, chi interpreta il personaggio (se != da creatore), 
	 * 		tutti quelli che hanno commentato e/o metacommentato | TOPIC: postAndComment
	 * */
	METACOMMENT_TO_POST,
	
	/**
	 * Like ad un post
	 * 	--> Creatore post, chi interpreta il personaggio (se != da creatore), 
	 * 		tutti quelli che sono taggati | TOPIC: post
	 * */
	LIKE_TO_POST,
	
	/**
	 * Tag di un personaggio alla creazione di un post
	 * --> Creatore post, chi interpreta il personaggio (se != da creatore), 
	 * 		tutti quelli che sono taggati | TOPIC: postAndComment
	 * */
	TAG_ON_CREATE,
	
	/**
	 * Tag di un personaggio alla modifica di un post
	 * --> Creatore post, chi interpreta il personaggio (se != da creatore), 
	 * 		tutti quelli che sono taggati | TOPIC: postAndComment
	 * */
	TAG_ON_MOD,
	
	/**
	 * Nuova associazione utente-personaggio
	 * --> Tutti i partecipanti allo scenario | TOPIC: scenario
	 * */
	NEW_ASSOCIATION,
	
	/**
	 * Eliminazione associazione utente-personaggio
	 * --> L'utente interessato | DIRECT
	 * */
	DEL_ASSOCIATION,
	
	/**
	 * Modifica del post da parte di un moderatore (!= dal creatore)
	 * --> Autore post | TOPIC: postAndComment
	 * */
	MODIFIED_POST_BY_MOD,
	
	/**
	 * Eliminazione post da parte di un moderatore
	 * --> Autore post | DIRECT
	 * */
	DELETED_POST_BY_MOD,
	
	/**
	 * Modifica di un commento da parte di un moderatore (!= dal creatore)
	 * --> Autore post | TOPIC: postAndComment
	 * */
	MODIFIED_COMMENT_BY_MOD,
	
	/**
	 * Eliminazione commento da parte di un moderatore
	 * --> Autore del commento | DIRECT
	 * */
	DELETED_COMMENT_BY_MOD,
	
	/**
	 * Eliminazione suggerimento da parte di un moderatore
	 * --> Autore del suggerimento | DIRECT
	 * */
	DELETED_META_COMMENT_BY_MOD,
	
	/**
	 * Modifica del post da parte del creatore
	 * --> tutti quelli taggati che hanno commentato e/o metacommentato | TOPIC: postAndComment
	 * */
	MODIFIED,
	
	/**
	 * Assegnazione compito da parte del docente a uno studente
	 * --> Utente a cui è stato assegnato il compito | DIRECT
	 * */
	NEW_PERSONAL_MISSION,
	
	/**
	 * Assegnazione compito globale dello scenario
	 *  --> Tutti i partecipanti allo scenario* | TOPIC: scenario
	 *  */
	NEW_GLOBAL_MISSION,
		
	/**
	 * Aggiunto nuovo moderatore allo scenario
	 *  --> Utente aggiunto come collaboratore | DIRECT
	 *  */
	NEW_MOD,
	
	/**
	 * Aggiunto nuovo moderatore allo scenario da un altro moderatore (non dal creatore)
	 * Notifica che deve arrivare al creatore dello scenario
	 *  --> Utente aggiunto come collaboratore | DIRECT
	 *  */
	NEW_MOD_TO_CREATOR,
	
	/**
	 * Elimino moderatore allo scenario
	 *  --> Utente rimosso dai collaboratori | DIRECT
	 *  */
	DEL_MOD,
	
	/**
	 * Aggiunto nuovo partecipante allo scenario
	 *  --> Utente aggiunto allo scenario | DIRECT
	 *  */
	NEW_ATTENDEE,
	
	/*Rimosso partecipante dallo scenario
	 * 
	 *  --> Utente rimosso dallo scenario | DIRECT
	 *  */
	DEL_ATTENDEE,
	
	/**
	 * Materiale aggiunto dal docente
	 * --> Tutti i partecipanti allo scenario | TOPIC: scenario
	 * */
	NEW_FILE
}
