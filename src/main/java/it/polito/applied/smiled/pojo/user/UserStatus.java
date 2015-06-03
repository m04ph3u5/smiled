package it.polito.applied.smiled.pojo.user;

/*Possibili stati che un utente può avere nel suo ciclo di vita all'interno dell'
 * applicazione:
 * 
 * - STATUS_APPROVED: l'utente è correttamente registrato nel sistema e abilitato
 * 					alle operazioni per cui possiede ruoli e permessi;
 * - STATUS_PENDING: stato in cui si troveranno i docenti a seguito della registrazione
 * 					effettuata attraverso il sito web. Ogni utente così registrato rimarrà
 * 					in 	questo stato fino all'approvazione esplicita di un amministratore
 * 					di sistema.
 * - STATUS_BANNED: stato in cui si potrà trovare potenzialmente qualunque utente in 
 * 					seguito a violazioni dei termini di servizio.
 * - STATUS_PENDING_DEFAULT_PASSWORD: stato in cui si troveranno gli studenti a seguito della
 * 							registrazione che i docenti effettueranno per loro, inserendoli
 * 							all'interno di uno scenario. Gli User che accedono al sistema
 * 							in questo stato, verranno automaticamente reindirizzati 
 * 							alla pagina del loro profilo personale per inserire una nuova
 * 							password per accedere al sistema.*/

/*TODO
 * da gestire le transizioni da e verso STATUS_CANCELED (richiesta chiusura account da parte di un utente) 
 * e STATUS_SUSPENDED (blocco temporaneo per numero eccessivo di tentativi di accesso falliti)
 * */
public enum UserStatus {
	STATUS_PENDING, STATUS_APPROVED, STATUS_BANNED, STATUS_PENDING_DEFAULT_PASSWORD, STATUS_CANCELED, STATUS_SUSPENDED;
}
