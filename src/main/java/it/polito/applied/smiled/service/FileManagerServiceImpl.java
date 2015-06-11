package it.polito.applied.smiled.service;

import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.pojo.FileMetadata;
import it.polito.applied.smiled.pojo.ResourceType;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.user.User;
import it.polito.applied.smiled.repository.FileMetadataRepository;
import it.polito.applied.smiled.repository.ScenarioRepository;
import it.polito.applied.smiled.repository.UserRepository;
import it.polito.applied.smiled.security.CustomUserDetails;

import java.io.File;
import java.io.IOException;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileManagerServiceImpl implements FileManagerService {
	
	@Autowired
	private FileMetadataRepository fileMetadataRepository;
	
	@Autowired
	private ScenarioRepository scenarioRepository; 
	
	@Autowired
	private UserRepository userRepository;
	
	private final String path="/var/smiled/";

	@Override
	public void postCoverScenario(String id, MultipartFile scenarioCover, CustomUserDetails user) throws IllegalStateException, IOException, BadRequestException {
		Scenario scenario = scenarioRepository.findById(id);
		if(scenario==null){
			throw new BadRequestException();
		}
		
		FileMetadata meta = new FileMetadata();
		
		meta.setUserId(user.getId());
		meta.setScenarioId(id);
		meta.setCreationDate(new Date());
		meta.setType(ResourceType.ACTUAL_COVER);
		
		if(scenario.getCover()==null || scenario.getCover().isEmpty()){
			scenarioCover.transferTo(new File(path+"cover/scenarios/"+id));
			meta.setPath(path+"cover/scenarios/"+id);
			meta=fileMetadataRepository.save(meta);
			scenarioRepository.setCover(id,meta.getId());
		}else{
			/*TODO 
			 * valutare possibilità di memorizzare lista di old cover così da poter differenziare le vecchie cover dai media generali riguardanti
			 * uno scenario*/
			FileMetadata oldMeta = fileMetadataRepository.findById(scenario.getCover());
			File oldCover = new File(oldMeta.getPath());
			if(oldCover.renameTo(new File(path+"media/"+oldMeta.getId()))){
				scenarioCover.transferTo(new File(path+"cover/scenarios/"+id));
				meta.setPath(path+"cover/scenarios/"+id);
				meta=fileMetadataRepository.save(meta);
				oldMeta.setPath(path+"media/"+oldMeta.getId());
				oldMeta.setType(ResourceType.OLD_COVER);
				oldMeta.setLastChange(new Date());
				fileMetadataRepository.save(oldMeta);
				scenarioRepository.setCover(id,meta.getId());
			}else{
				throw new IOException();
			}
		}
	}

	@Override
	public File getScenarioCover(String id) {
		return new File(path+"cover/scenarios/"+id);
	}

	@Override
	public File getUserCover(String id) {
		return new File(path+"cover/users/"+id);
	}

	@Override
	public void postCoverUser(MultipartFile userCover,
			CustomUserDetails user) throws BadRequestException, IllegalStateException, IOException {
		User u = userRepository.findById(user.getId());
		if(u==null)
			throw new BadRequestException();
		
		FileMetadata meta = new FileMetadata();
		
		meta.setUserId(user.getId());
		meta.setCreationDate(new Date());
		meta.setType(ResourceType.ACTUAL_COVER);
		
		if(u.getProfile()==null || u.getProfile().getCoverPhoto()==null || u.getProfile().getCoverPhoto().isEmpty()){
			userCover.transferTo(new File(path+"cover/users/"+u.getId()));
			meta.setPath(path+"cover/users/"+u.getId());
			meta=fileMetadataRepository.save(meta);
			userRepository.setCover(u.getId(),meta.getId());
		}
	}
}
