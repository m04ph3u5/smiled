package it.polito.applied.smiled.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import it.polito.applied.smiled.pojo.RegistrationToken;

public interface RegistrationRepository extends MongoRepository<RegistrationToken,String> , CustomRegistrationRepository{

	public RegistrationToken findByTokenAndEmail(String token, String email);
	public RegistrationToken findAndDeleteByEmail(String email);
	
}
