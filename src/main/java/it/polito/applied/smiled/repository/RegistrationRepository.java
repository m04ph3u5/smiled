package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.pojo.RegistrationToken;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface RegistrationRepository extends MongoRepository<RegistrationToken,String>{

	public RegistrationToken findByTokenAndEmail(String token, String email);
	public RegistrationToken findAndDeleteByEmail(String email);
	
}
