package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.pojo.Permission;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface RelationPermissionRepository extends MongoRepository<Permission, String>, CustomRelationPermissionRepository{


	/*ATTENZIONE: non inserire signature di metodi qui perché esiste già un altro repository che mappa Permission (PermissionRepository)
	 * Questp è utilizzato per mappare i permessi riguardanti le relazioni (quindi gli user) in una collection separata dagli altri permessi
	 * Implementare sempre la versione custom esplicitando il nome della collection (relationPermission)*/
	
	/*TODO
	 * valutare utilizzo targetType o permission per differenziare permessi da Teacher
	 * a Student e viceversa*/
}
