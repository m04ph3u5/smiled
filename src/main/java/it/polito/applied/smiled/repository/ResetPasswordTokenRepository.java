package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.pojo.ResetPasswordToken;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ResetPasswordTokenRepository extends MongoRepository<ResetPasswordToken, String>{

	public ResetPasswordToken findByEmail(String email);
	
}
