package it.polito.applied.smiled.service;

import it.polito.applied.smiled.dto.FileMetadataDTO;
import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.exception.ForbiddenException;
import it.polito.applied.smiled.pojo.FileMetadata;
import it.polito.applied.smiled.pojo.ResourceType;
import it.polito.applied.smiled.pojo.SupportedMedia;
import it.polito.applied.smiled.pojo.scenario.Character;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.user.User;
import it.polito.applied.smiled.repository.CharacterRepository;
import it.polito.applied.smiled.repository.FileMetadataRepository;
import it.polito.applied.smiled.repository.ScenarioRepository;
import it.polito.applied.smiled.repository.UserRepository;
import it.polito.applied.smiled.security.CustomUserDetails;
import it.polito.applied.smiled.security.SmiledPermissionEvaluator;

import java.awt.AlphaComposite;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.codec.Base64;
import org.springframework.stereotype.Service;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.multipart.MultipartFile;

import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSFile;

@PropertySource(value={"classpath:application.properties"})
@Service
public class FileManagerServiceImpl implements FileManagerService {

	@Autowired
	private FileMetadataRepository fileMetadataRepository;

	@Autowired
	private ScenarioRepository scenarioRepository; 

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private CharacterRepository characterRepository;

	@Autowired
	private SmiledPermissionEvaluator permissionEvaluator;

	@Autowired
	private GridFsManager gridFsManager;

	@Value("${media.path}")
	private String path;


	@Value("${file.icon}")
	private String fileIcon;

	@Override
	public void postCoverScenario(String id, MultipartFile scenarioCover, CustomUserDetails user) throws IllegalStateException, IOException, BadRequestException, HttpMediaTypeNotAcceptableException {
		SupportedMedia type = validateAsImage(scenarioCover);

		Scenario scenario = scenarioRepository.findById(id);
		if(scenario==null){
			throw new BadRequestException();
		}

		FileMetadata meta = new FileMetadata();

		meta.setUserId(user.getId());
		meta.setScenarioId(id);
		meta.setCreationDate(new Date());
		meta.setType(ResourceType.ACTUAL_COVER);
		meta.setOriginalName(scenarioCover.getOriginalFilename());
		meta.setFormat(type);
		InputStream input = scenarioCover.getInputStream();
		String coverName = "s"+id;
		if(scenario.getCover()==null || scenario.getCover().isEmpty()){
			gridFsManager.save(input, coverName, scenarioCover.getContentType(), meta);
			scenarioRepository.setCover(id,coverName);
		}else{
			GridFSFile oldCover = gridFsManager.readOneByName(coverName);
			gridFsManager.toOldCover(oldCover);
			gridFsManager.save(input, coverName, scenarioCover.getContentType(), meta);
		}
	}

	@Override
	public byte[] getScenarioCover(String id) throws IOException, FileNotFoundException {
		String name = "s"+id;

		GridFSDBFile file = gridFsManager.readOneByName(name);
		if(file==null){
			throw new FileNotFoundException();
		}

		InputStream input = file.getInputStream();

		byte[] targetArray = new byte[(int)file.getLength()];
		input.read(targetArray);
		return targetArray;
	}


	@Override
	public void postCoverUser(MultipartFile userCover, CustomUserDetails user) throws IllegalStateException, IOException, BadRequestException, HttpMediaTypeNotAcceptableException {

		SupportedMedia type = validateAsImage(userCover);

		User u = userRepository.findById(user.getId());
		if(u==null)
			throw new BadRequestException();

		FileMetadata meta = new FileMetadata();

		meta.setUserId(user.getId());
		meta.setCreationDate(new Date());
		meta.setType(ResourceType.ACTUAL_COVER);
		meta.setOriginalName(userCover.getOriginalFilename());
		meta.setFormat(type);

		InputStream input = userCover.getInputStream();
		String coverName = "u"+user.getId();
		if(u.getProfile()==null || u.getProfile().getCoverPhoto()==null || u.getProfile().getCoverPhoto().isEmpty()){
			gridFsManager.save(input, coverName, userCover.getContentType(), meta);
			userRepository.setCover(u.getId(),meta.getId());
		}else{
			GridFSFile oldCover = gridFsManager.readOneByName(coverName);
			gridFsManager.toOldCover(oldCover);
			gridFsManager.save(input, coverName, userCover.getContentType(), meta);
		}
	}

	@Override
	public byte[] getUserCover(String id) throws FileNotFoundException, IOException {
		String name = "u"+id;
		GridFSDBFile file = gridFsManager.readOneByName(name);
		if(file==null){
			throw new FileNotFoundException();
		}
		InputStream input = file.getInputStream();
		byte[] targetArray = new byte[(int)file.getLength()];
		input.read(targetArray);
		return targetArray;
	}

	@Override
	public void postCoverCharacter(MultipartFile characterCover, String id, String characterId,
			CustomUserDetails user) throws BadRequestException, IllegalStateException, IOException, HttpMediaTypeNotAcceptableException {

		SupportedMedia type = validateAsImage(characterCover);

		Character c = characterRepository.findById(characterId);
		if(c==null)
			throw new BadRequestException();


		FileMetadata meta = new FileMetadata();

		meta.setUserId(user.getId());
		meta.setCreationDate(new Date());
		meta.setType(ResourceType.ACTUAL_COVER);
		meta.setScenarioId(id);
		meta.setCharacterId(characterId);
		meta.setOriginalName(characterCover.getOriginalFilename());
		meta.setFormat(type);
		InputStream input = characterCover.getInputStream();
		String coverName = "c"+c.getId();

		if(c.getCover()==null || c.getCover().isEmpty() || c.getCover().equals("")){
			gridFsManager.save(input, coverName, characterCover.getContentType(), meta);
			characterRepository.setCover(c.getId(),meta.getId());
		}else{
			GridFSFile oldCover = gridFsManager.readOneByName(coverName);
			gridFsManager.toOldCover(oldCover);
			gridFsManager.save(input, coverName, characterCover.getContentType(), meta);
		}

	}

	@Override
	public byte[] getCharacterCover(String characterId) throws FileNotFoundException, IOException {
		String name = "c"+characterId;
		GridFSDBFile file = gridFsManager.readOneByName(name);
		if(file==null){
			throw new FileNotFoundException();
		}
		InputStream input = file.getInputStream();

		byte[] targetArray = new byte[(int)file.getLength()];
		input.read(targetArray);
		return targetArray;
	}

	//	@Override
	//	public File getUserCoverFILESYSTEM(String id) {
	//		return new File(path+"cover/users/"+getFolderPath(id)+"/"+id);
	//	}

	//		public void postCoverScenarioFILESYSTEM(String id, MultipartFile scenarioCover, CustomUserDetails user) throws IllegalStateException, IOException, BadRequestException, HttpMediaTypeNotAcceptableException {
	//
	//		SupportedMedia type = validateAsImage(scenarioCover);
	//
	//		Scenario scenario = scenarioRepository.findById(id);
	//		if(scenario==null){
	//			throw new BadRequestException();
	//		}
	//				
	//		FileMetadata meta = new FileMetadata();
	//		
	//		meta.setUserId(user.getId());
	//		meta.setScenarioId(id);
	//		meta.setCreationDate(new Date());
	//		meta.setType(ResourceType.ACTUAL_COVER);
	//		meta.setOriginalName(scenarioCover.getOriginalFilename());
	//		meta.setFormat(type);
	//		
	//		if(scenario.getCover()==null || scenario.getCover().isEmpty()){
	//			//TODO modificare path
	//			
	//			File dir = new File(path+"cover/scenarios/"+getFolderPath(id));
	//			dir.mkdirs();
	//			File file = new File(dir,id);
	//
	//			
	//			scenarioCover.transferTo(file);
	//			//meta.setPath(path+"cover/scenarios/"+id);
	//			meta=fileMetadataRepository.save(meta);
	//			scenarioRepository.setCover(id,meta.getId());
	//		}else{
	//			
	//			FileMetadata oldMeta = fileMetadataRepository.findById(scenario.getCover());
	//			File oldCover = new File(path+"cover/scenarios/"+getFolderPath(id)+id);
	//			File dir = new File(path+"media/"+getFolderPath(oldMeta.getId()));
	//			dir.mkdirs();
	//			File newPath = new File(dir,oldMeta.getId()+"."+oldMeta.getFormat());
	//			if(oldCover.renameTo(newPath)){
	//				saveThumbnail(newPath, oldMeta.getId());
	//				File f = new File(path+"cover/scenarios/"+getFolderPath(id)+"/"+id);
	//				scenarioCover.transferTo(f);
	//				//meta.setPath(path+"cover/scenarios/"+id);
	//				meta=fileMetadataRepository.save(meta);
	//				//oldMeta.setPath(path+"media/"+oldMeta.getId()+"."+oldMeta.getFormat());
	//				oldMeta.setType(ResourceType.OLD_COVER);
	//				oldMeta.setLastChange(new Date());
	//				fileMetadataRepository.save(oldMeta);
	//				scenarioRepository.setCover(id,meta.getId());
	//			}else{
	//				throw new IOException();
	//			}
	//		}
	//	}
	//
	//	
	//	public File getScenarioCoverFILESYSTEM(String id) {
	//		return new File(path+"cover/scenarios/"+getFolderPath(id)+"/"+id);
	//	}


	//	@Override
	//	public void postCoverUserFILESYSTEM(MultipartFile userCover,
	//			CustomUserDetails user) throws BadRequestException, IllegalStateException, IOException, HttpMediaTypeNotAcceptableException {
	//	
	//		SupportedMedia type = validateAsImage(userCover);
	//
	//		User u = userRepository.findById(user.getId());
	//		if(u==null)
	//			throw new BadRequestException();
	//				
	//		FileMetadata meta = new FileMetadata();
	//		
	//		meta.setUserId(user.getId());
	//		meta.setCreationDate(new Date());
	//		meta.setType(ResourceType.ACTUAL_COVER);
	//		meta.setOriginalName(userCover.getOriginalFilename());
	//		meta.setFormat(type);
	//		System.out.println("user profile");
	//		if(u.getProfile()==null || u.getProfile().getCoverPhoto()==null || u.getProfile().getCoverPhoto().isEmpty()){
	//			File dir = new File(path+"cover/users/"+getFolderPath(u.getId()));
	//			dir.mkdirs();
	//			File file = new File(dir,u.getId());
	//
	//			
	//			userCover.transferTo(file);
	//			//meta.setPath(path+"cover/scenarios/"+id);
	//			meta=fileMetadataRepository.save(meta);
	//			userRepository.setCover(u.getId(),meta.getId());
	//		}else{
	//			FileMetadata oldMeta = fileMetadataRepository.findById(u.getProfile().getCoverPhoto());
	//			File oldCover = new File(path+"cover/users/"+getFolderPath(u.getId())+u.getId());
	//			File dir = new File(path+"media/"+getFolderPath(oldMeta.getId()));
	//			dir.mkdirs();
	//			File newPath = new File(dir,oldMeta.getId()+"."+oldMeta.getFormat());
	//			
	//
	//			if(oldCover.renameTo(newPath)){
	//				userCover.transferTo(new File(path+"cover/users/"+getFolderPath(u.getId())+"/"+u.getId()));
	//				saveThumbnail(newPath, oldMeta.getId());
	//
	//				//meta.setPath(path+"cover/scenarios/"+id);
	//				meta=fileMetadataRepository.save(meta);
	//				//oldMeta.setPath(path+"media/"+oldMeta.getId()+"."+oldMeta.getFormat());
	//				oldMeta.setType(ResourceType.OLD_COVER);
	//				oldMeta.setLastChange(new Date());
	//				fileMetadataRepository.save(oldMeta);
	//				userRepository.setCover(u.getId(),meta.getId());
	//			}else{
	//				throw new IOException();
	//			}
	//			
	//		}
	//	}

	//	@Override
	//	public void postCoverCharacterFILESYSTEM(MultipartFile characterCover, String id, String characterId,
	//			CustomUserDetails user) throws BadRequestException, IllegalStateException, IOException, HttpMediaTypeNotAcceptableException {
	//		
	//		SupportedMedia type = validateAsImage(characterCover);
	//
	//		Character c = characterRepository.findById(characterId);
	//		if(c==null)
	//			throw new BadRequestException();
	//		
	//		
	//		FileMetadata meta = new FileMetadata();
	//		
	//		meta.setUserId(user.getId());
	//		meta.setCreationDate(new Date());
	//		meta.setType(ResourceType.ACTUAL_COVER);
	//		meta.setScenarioId(id);
	//		meta.setCharacterId(characterId);
	//		meta.setOriginalName(characterCover.getOriginalFilename());
	//		meta.setFormat(type);
	//
	//		if(c.getCover()==null || c.getCover().isEmpty() || c.getCover().equals("")){
	//			File dir = new File(path+"cover/characters/"+getFolderPath(c.getId()));
	//			dir.mkdirs();
	//			File file = new File(dir,c.getId());
	//
	//			
	//			characterCover.transferTo(file);
	//			//meta.setPath(path+"cover/scenarios/"+id);
	//			meta=fileMetadataRepository.save(meta);
	//			characterRepository.setCover(c.getId(),meta.getId());
	//		}else{
	//			FileMetadata oldMeta = fileMetadataRepository.findById(c.getCover());
	//			File oldCover = new File(path+"cover/characters/"+getFolderPath(c.getId())+c.getId());
	//			File dir = new File(path+"media/"+getFolderPath(oldMeta.getId()));
	//			dir.mkdirs();
	//			File newPath = new File(dir,oldMeta.getId()+"."+oldMeta.getFormat());
	//			if(oldCover.renameTo(newPath)){
	//				saveThumbnail(newPath, oldMeta.getId());
	//				characterCover.transferTo(new File(path+"cover/users/"+getFolderPath(c.getId())+"/"+c.getId()));
	//				//meta.setPath(path+"cover/scenarios/"+id);
	//				meta=fileMetadataRepository.save(meta);
	//				//oldMeta.setPath(path+"media/"+oldMeta.getId()+"."+oldMeta.getFormat());
	//				oldMeta.setType(ResourceType.OLD_COVER);
	//				oldMeta.setLastChange(new Date());
	//				fileMetadataRepository.save(oldMeta);
	//				characterRepository.setCover(c.getId(),meta.getId());
	//			}else{
	//				throw new IOException();
	//			}
	//		}
	//		
	//	}

	//	@Override
	//	public File getCharacterCoverFILESYSTEM(String characterId) {
	//		return new File(path+"cover/characters/"+getFolderPath(characterId)+"/"+characterId);
	//	}
	
	
	@Override
	public String postMedia(MultipartFile media, CustomUserDetails user, String scenarioId) throws HttpMediaTypeNotAcceptableException, IllegalStateException, IOException {
		SupportedMedia type = validateAsMedia(media);
		FileMetadata meta = new FileMetadata();
		meta.setUserId(user.getId());
		meta.setCreationDate(new Date());
		if(isImage(type))
			meta.setType(ResourceType.TO_CONFIRM_IMG);
		else
			meta.setType(ResourceType.TO_CONFIRM_DOC);
		meta.setScenarioId(scenarioId);
		meta.setOriginalName(media.getOriginalFilename());
		meta.setFormat(type);
		String filename = new SimpleDateFormat("yyyyMMddhhmmssSS").format(meta.getCreationDate());
		GridFSFile file = gridFsManager.save(media.getInputStream(), filename, media.getContentType(), meta);
		
		return file.getFilename().toString();
	}

	@Override
	public byte[] getMedia(String filename, Authentication auth) throws FileNotFoundException, IOException, ForbiddenException {
		System.out.println("------------------>"+filename);
		GridFSDBFile file = gridFsManager.readOneByName(filename);
		if(file==null){
			throw new FileNotFoundException();
		}
		//gestione permessi - è possibile prelevare solo i propri media o i media degli "amici" (colleghi, studenti, amici)
		FileMetadata metadata = gridFsManager.getMetadata(file);
		if(!metadata.getUserId().equals(((CustomUserDetails)auth.getPrincipal()).getId()) && !permissionEvaluator.hasPermission(auth, metadata.getUserId(), "User", "READ"))
			throw new ForbiddenException();
		
		
		InputStream input = file.getInputStream();

		byte[] targetArray = new byte[(int)file.getLength()];
		input.read(targetArray);
		return targetArray;
	}

	
	@Override
	public void postMediaMetadata(String filename, FileMetadataDTO fileMetaDTO,
			Authentication auth) throws BadRequestException, ForbiddenException, IOException {
		
		FileMetadata fileMeta = gridFsManager.getMetadata(filename);
		
		if(fileMeta==null)
			throw new BadRequestException();
		CustomUserDetails user = (CustomUserDetails)auth.getPrincipal();
		if(!fileMeta.getUserId().equals(user.getId()))
			throw new ForbiddenException();

		if(fileMetaDTO.getCharacterId()!=null){
			if(!permissionEvaluator.hasPermission(auth, fileMetaDTO.getCharacterId(), "Character", "WRITE"))
				throw new ForbiddenException();
		}

		
		if(fileMetaDTO.getPlace()!=null)
			fileMeta.setPlace(fileMetaDTO.getPlace());
		if(fileMetaDTO.getTags()!=null)
			fileMeta.setTags(fileMetaDTO.getTags());
		if(fileMetaDTO.getDescription()!=null)
			fileMeta.setDescription(fileMetaDTO.getDescription());
		if(fileMetaDTO.getCharacterId()!=null)
			fileMeta.setCharacterId(fileMetaDTO.getCharacterId());
		fileMeta.setLastChange(new Date());
		if(isImage(fileMeta.getFormat())){
			fileMeta.setType(ResourceType.IMAGE);
		}
		else
			fileMeta.setType(ResourceType.DOCUMENT);

		gridFsManager.updateMetadata(filename, fileMeta);
	}

	@Override
	public Page<FileMetadataDTO> getUserImageMetadata(CustomUserDetails user, int nPag, int nItem) throws IOException {
		Pageable p =  new PageRequest(nPag,nItem);
		List<FileMetadata>  list = gridFsManager.findUserImage(user.getId(),p);
		
		System.out.println("My media number: "+list.size());
		Iterator<FileMetadata> it = list.iterator();
		List<FileMetadataDTO> fileMetaList = new ArrayList<FileMetadataDTO>();
		while(it.hasNext()){
			FileMetadata meta = it.next(); 
			FileMetadataDTO metaDTO = new FileMetadataDTO(meta);
			
			
//	TODO manage thumbnail		Path file = Paths.get(path+"thumb/"+getFolderPath(meta.getId())+meta.getId()+".jpg");
//			byte[] data = Files.readAllBytes(file);
//			metaDTO.setThumb(new String(Base64.encode(data)));
			fileMetaList.add(metaDTO);
		}
		return new PageImpl<FileMetadataDTO>(fileMetaList,p,fileMetaList.size());
	}

	@Override
	public Page<FileMetadataDTO> getUserFilesMetadata(CustomUserDetails user,
			Integer nPag, Integer nItem) throws IOException {
		Pageable p =  new PageRequest(nPag,nItem);
		List<FileMetadata>  list = gridFsManager.findUserFile(user.getId(),p);
		System.out.println("My media number: "+list.size());
		Iterator<FileMetadata> it = list.iterator();
		List<FileMetadataDTO> fileMetaList = new ArrayList<FileMetadataDTO>();
		while(it.hasNext()){
			FileMetadata meta = it.next(); 
			FileMetadataDTO metaDTO = new FileMetadataDTO(meta);
//			metaDTO.setThumb(fileIcon);
			fileMetaList.add(metaDTO);
		}
		return new PageImpl<FileMetadataDTO>(fileMetaList,p,fileMetaList.size());
	}

	@Override
	public Page<FileMetadataDTO> getScenarioImageMetadata(String idScenario,
			Integer nPag, Integer nItem) throws IOException {
		Pageable p =  new PageRequest(nPag,nItem);
		List<FileMetadata>  list = gridFsManager.findScenarioImage(idScenario,p);
		System.out.println("My media number: "+list.size());
		Iterator<FileMetadata> it = list.iterator();
		List<FileMetadataDTO> fileMetaList = new ArrayList<FileMetadataDTO>();
		while(it.hasNext()){
			FileMetadata meta = it.next(); 
			FileMetadataDTO metaDTO = new FileMetadataDTO(meta);
//			Path file = Paths.get(path+"thumb/"+getFolderPath(meta.getId())+meta.getId()+"."+meta.getFormat());
//			byte[] data = Files.readAllBytes(file);
//			metaDTO.setThumb(new String(Base64.encode(data)));
			fileMetaList.add(metaDTO);
		}
		return new PageImpl<FileMetadataDTO>(fileMetaList,p,fileMetaList.size());
	}

	@Override
	public Page<FileMetadataDTO> getScenarioFilesMetadata(String idScenario,
			Integer nPag, Integer nItem) throws IOException {
		Pageable p =  new PageRequest(nPag,nItem);
		List<FileMetadata>  list = gridFsManager.findScenarioFile(idScenario,p);
		System.out.println("My media number: "+list.size());
		Iterator<FileMetadata> it = list.iterator();
		List<FileMetadataDTO> fileMetaList = new ArrayList<FileMetadataDTO>();
		while(it.hasNext()){
			FileMetadata meta = it.next(); 
			FileMetadataDTO metaDTO = new FileMetadataDTO(meta);
//			metaDTO.setThumb(fileIcon);
			fileMetaList.add(metaDTO);
		}
		return new PageImpl<FileMetadataDTO>(fileMetaList,p,fileMetaList.size());
	}

	/*--------------------------------------------------------UTILS FUNCTIONS-----------------------------------------------------------------*/
	private String getFolderPath(String filename){
		System.out.println(filename);
		String folderPath=filename.substring(12, 14)+"/"+filename.substring(14, 16)+"/"+filename.substring(16, 18)+"/"+filename.substring(18,20)+"/";
		System.out.println("folderPath: "+folderPath+filename);
		return folderPath;
	}

	private SupportedMedia validateAsImage(MultipartFile file) throws HttpMediaTypeNotAcceptableException{
		System.out.println(file.getContentType());
		if(file.getContentType().equals("image/jpeg"))
			return SupportedMedia.jpg;
		else if(file.getContentType().equals("image/png"))
			return SupportedMedia.png;
		else
			throw new HttpMediaTypeNotAcceptableException("Formato non supportato");
	}

	private SupportedMedia validateAsMedia(MultipartFile file) throws HttpMediaTypeNotAcceptableException{
		String contentType = file.getContentType();
		if(contentType.equals("image/jpeg"))
			return SupportedMedia.jpg;
		else if(contentType.equals("image/png"))
			return SupportedMedia.png;
		else if(contentType.equals("application/pdf"))
			return SupportedMedia.pdf;
		else if(contentType.equals("application/msword"))
			return SupportedMedia.doc;
		else if(contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
			return SupportedMedia.docx;
		else if(contentType.equals("application/vnd.ms-excel"))
			return SupportedMedia.xls;
		else if(contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
			return SupportedMedia.xlsx;
		else if(contentType.equals("application/vnd.ms-powerpoint"))
			return SupportedMedia.ppt;
		else if(contentType.equals("application/vnd.openxmlformats-officedocument.presentationml.presentation"))
			return SupportedMedia.pptx;
		else if(contentType.equals("application/vnd.oasis.opendocument.text"))
			return SupportedMedia.odt;
		else if(contentType.equals("application/vnd.oasis.opendocument.presentation"))
			return SupportedMedia.odp;
		else if(contentType.equals("application/vnd.oasis.opendocument.spreadsheet"))
			return SupportedMedia.ods;
		else if(contentType.equals("text/plain"))
			return SupportedMedia.txt;
		else
			throw new HttpMediaTypeNotAcceptableException("Formato non supportato");
	}

	private boolean isImage(SupportedMedia media){
		if(media.equals(SupportedMedia.jpg))
			return true;
		if(media.equals(SupportedMedia.png))
			return true;

		return false;
	}

	

}
