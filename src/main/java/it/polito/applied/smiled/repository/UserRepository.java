package it.polito.applied.smiled.repository;

import java.util.List;

import it.polito.applied.smiled.pojo.CharacterReference;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.ScenarioReference;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.user.Student;
import it.polito.applied.smiled.pojo.user.User;

import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

public interface UserRepository extends MongoRepository<User,String>, CustomUserRepository {

	public User findByEmail(final String email);
	public User findById(final String id);
	public List<User> findByFirstNameIgnoreCaseAndLastNameIgnoreCase(String firstName, String lastName);
	public List<User> findByFirstNameIgnoreCase(String firstName);
	public List<User> findByLastNameIgnoreCase(String lastName);
	
}
