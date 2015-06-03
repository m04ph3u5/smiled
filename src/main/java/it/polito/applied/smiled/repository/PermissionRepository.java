package it.polito.applied.smiled.repository;

import it.polito.applied.smiled.pojo.Permission;
import it.polito.applied.smiled.pojo.scenario.Scenario;

import java.io.Serializable;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

/**/
public interface PermissionRepository extends MongoRepository<Permission,String>, CustomPermissionRepository {

	public List<Permission> findByUserId(String userId);


}
