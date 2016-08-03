package it.polito.applied.smiled.service;

import java.awt.AlphaComposite;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
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
import java.util.Random;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.multipart.MultipartFile;

import com.mongodb.gridfs.GridFSDBFile;
import com.mongodb.gridfs.GridFSFile;

import it.polito.applied.smiled.dto.FileMetadataDTO;
import it.polito.applied.smiled.exception.BadRequestException;
import it.polito.applied.smiled.exception.ForbiddenException;
import it.polito.applied.smiled.exception.NotFoundException;
import it.polito.applied.smiled.pojo.FileMetadata;
import it.polito.applied.smiled.pojo.FileReference;
import it.polito.applied.smiled.pojo.MediaDataAndContentType;
import it.polito.applied.smiled.pojo.Reference;
import it.polito.applied.smiled.pojo.ResourceType;
import it.polito.applied.smiled.pojo.ScenarioReference;
import it.polito.applied.smiled.pojo.SupportedMedia;
import it.polito.applied.smiled.pojo.scenario.Character;
import it.polito.applied.smiled.pojo.scenario.Scenario;
import it.polito.applied.smiled.pojo.user.User;
import it.polito.applied.smiled.rabbit.NotifyService;
import it.polito.applied.smiled.repository.CharacterRepository;
import it.polito.applied.smiled.repository.PostRepository;
import it.polito.applied.smiled.repository.ScenarioRepository;
import it.polito.applied.smiled.repository.UserRepository;
import it.polito.applied.smiled.security.CustomUserDetails;
import it.polito.applied.smiled.security.SmiledPermissionEvaluator;

@Service
public class FileManagerServiceImpl implements FileManagerService {

//	@Autowired
//	private FileMetadataRepository fileMetadataRepository;

	@Autowired
	private ScenarioRepository scenarioRepository; 

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private PostRepository postRepository;

	@Autowired
	private CharacterRepository characterRepository;

	@Autowired
	private SmiledPermissionEvaluator permissionEvaluator;
	
	@Autowired
	private NotifyService notify;

	@Autowired
	private GridFsManager gridFsManager;

	@Value("${file.icon}")
	private String fileIcon;
	
	@Value("${win64Tool}")
	private String win64Tool;
	@Value("${win32Tool}")
	private String win32Tool;
	@Value("${macOSXTool}")
	private String macOSXTool;
	@Value("${linux64Tool}")
	private String linux64Tool;
	@Value("${linux32Tool}")
	private String linux32Tool;

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
			GridFSFile file = gridFsManager.save(input, coverName, scenarioCover.getContentType(), meta);
			scenarioRepository.setCover(id,file.getId().toString());
		}else{
			GridFSFile oldCover = gridFsManager.readOneById(scenario.getCover());
			gridFsManager.toOldCover(oldCover);
			GridFSFile file = gridFsManager.save(input, coverName, scenarioCover.getContentType(), meta);
			scenarioRepository.setCover(id,file.getId().toString());
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
		int count = 0;
		while(count<(int)file.getLength()){
			int n = input.read(targetArray, count, targetArray.length);
			count+=n;
		}
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
		if(u.getProfile()==null || u.getProfile().getCoverPhotoId()==null || u.getProfile().getCoverPhotoId().isEmpty()){
			GridFSFile file = gridFsManager.save(input, coverName, userCover.getContentType(), meta);
		    userRepository.setCover(u.getId(), file.getId().toString());
		}else{
			GridFSFile oldCover = gridFsManager.readOneById(u.getProfile().getCoverPhotoId());
			gridFsManager.toOldCover(oldCover);
			GridFSFile file =	gridFsManager.save(input, coverName, userCover.getContentType(), meta);
		    userRepository.setCover(u.getId(), file.getId().toString());

		}
	}


	@Override
	public void postCoverLargeUser(MultipartFile userCover,
			CustomUserDetails user) throws HttpMediaTypeNotAcceptableException, BadRequestException, IOException {
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
		System.out.println();
		String coverName = "ul"+user.getId();
		if(u.getProfile()==null || u.getProfile().getLargeCoverPhotoId()==null || u.getProfile().getLargeCoverPhotoId().isEmpty()){
			GridFSFile file = gridFsManager.save(input, coverName, userCover.getContentType(), meta);
		    userRepository.setCoverLarge(u.getId(), file.getId().toString());
		}else{
			GridFSFile oldCover = gridFsManager.readOneById(u.getProfile().getLargeCoverPhotoId());
			gridFsManager.toOldCover(oldCover);
			GridFSFile file =	gridFsManager.save(input, coverName, userCover.getContentType(), meta);
		    userRepository.setCoverLarge(u.getId(), file.getId().toString());

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
		int count = 0;
		while(count<(int)file.getLength()){
			int n = input.read(targetArray, count, targetArray.length);
			count+=n;
		}
		return targetArray;
	}
	
	@Override
	public byte[] getUserCoverLarge(String id) throws IOException {
		String name = "ul"+id;
		GridFSDBFile file = gridFsManager.readOneByName(name);
		if(file==null){
			throw new FileNotFoundException();
		}
		InputStream input = file.getInputStream();
		byte[] targetArray = new byte[(int)file.getLength()];
		int count = 0;
		while(count<(int)file.getLength()){
			int n = input.read(targetArray, count, targetArray.length);
			count+=n;
		}
		
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

		if(c.getCoverPhotoId()==null || c.getCoverPhotoId().isEmpty()){
			GridFSFile file = gridFsManager.save(input, coverName, characterCover.getContentType(), meta);
			characterRepository.setCover(c.getId(),file.getId().toString());
		}else{
			System.out.println("IN 2");
			GridFSFile oldCover = gridFsManager.readOneById(c.getCoverPhotoId());
			gridFsManager.toOldCover(oldCover);
			GridFSFile file = gridFsManager.save(input, coverName, characterCover.getContentType(), meta);
			characterRepository.setCover(c.getId(),file.getId().toString());
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
		int count = 0;
		while(count<(int)file.getLength()){
			int n = input.read(targetArray, count, targetArray.length);
			count+=n;
		}
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
	public String postMedia(MultipartFile media, CustomUserDetails user, String scenarioId, boolean trusted) throws HttpMediaTypeNotAcceptableException, IllegalStateException, IOException, BadRequestException {
		SupportedMedia type = validateAsMedia(media);
		FileMetadata meta = new FileMetadata();
		meta.setUserId(user.getId());
		meta.setCreationDate(new Date());
		meta.setOriginalName(media.getOriginalFilename());
		if(isImage(type)){
			if(!trusted)
				meta.setType(ResourceType.TO_CONFIRM_IMG);
			else
				meta.setType(ResourceType.IMAGE);
			meta.setThumbnail(saveThumbnail(media.getInputStream(),(int) media.getSize()));
		}
		else{
			if(!trusted)
				meta.setType(ResourceType.TO_CONFIRM_DOC);
			else
				meta.setType(ResourceType.DOCUMENT);
		}
		meta.setScenarioId(scenarioId);
		meta.setFormat(type);
		meta.setTrusted(trusted);
		String filename = new SimpleDateFormat("yyyyMMddhhmmssSS").format(meta.getCreationDate());
		filename+=(user.getId().substring(17));
		Random r = new Random();
		filename+=r.nextInt(10);
		filename+=r.nextInt(10);
		meta.setId(filename);
		GridFSFile file = gridFsManager.save(media.getInputStream(), filename, media.getContentType(), meta);
		
		//To notify new resource
		User mod = userRepository.findById(user.getId());
		ScenarioReference sr = null;
		for(ScenarioReference scenRef : mod.getOpenScenarios()){
			if(scenRef.getId().equals(scenarioId)){
				sr = scenRef;
				break;
			}
		}
		if(trusted && mod!=null && sr!=null)
			notify.notifyNewResource(sr, new Reference(mod), media.getOriginalFilename());
		return file.getFilename().toString();
	}

	@Override
	public MediaDataAndContentType getMedia(String filename, Authentication auth, Boolean getThumb) throws NotFoundException, IOException, ForbiddenException, HttpMediaTypeNotAcceptableException, BadRequestException {
		System.out.println("------------------>"+filename);
		
		//gestione permessi - è possibile prelevare solo i propri media o i media degli "amici" (colleghi, studenti, amici)
		FileMetadata metadata = gridFsManager.getMetadata(filename);
		if(metadata==null)
			throw new FileNotFoundException();
		if(metadata.getType().equals(ResourceType.DELETED_DOC) || metadata.getType().equals(ResourceType.DELETED_IMG))
			throw new FileNotFoundException();
		if(!metadata.getUserId().equals(((CustomUserDetails)auth.getPrincipal()).getId()) && !permissionEvaluator.hasPermission(auth, metadata.getScenarioId(), "Scenario", "READ"))
			throw new ForbiddenException();
		
		MediaDataAndContentType m = new MediaDataAndContentType();
		boolean founded=false;
		if(getThumb && metadata.getThumbnail()!=null){
			m.setData(metadata.getThumbnail());
			founded=true;
		}
		if(!founded){
			GridFSDBFile file = gridFsManager.readOneByName(filename);
			if(file==null){
				throw new FileNotFoundException();
			}
			
			InputStream input = file.getInputStream();
			
			if(getThumb){
				metadata.setThumbnail(saveThumbnail(input, (int)file.getLength()));
				gridFsManager.updateMetadata(filename, metadata);
			}
	
			byte[] targetArray = new byte[(int)file.getLength()];
			int count = 0;
			while(count<(int)file.getLength()){
				int n = input.read(targetArray, count, targetArray.length);
				count+=n;
			}
			
			m.setData(targetArray);
		}
		m.setContentType(MediaType.parseMediaType(getContentType(metadata.getFormat())));
		return m;
	}

	
	@Override
	public void postMediaMetadata(String filename, FileMetadataDTO fileMetaDTO,
			Authentication auth, Boolean trusted) throws BadRequestException, ForbiddenException, IOException, NotFoundException {
		
		FileMetadata fileMeta = gridFsManager.getMetadata(filename);
		
		if(fileMeta==null)
			throw new BadRequestException();
		CustomUserDetails user = (CustomUserDetails)auth.getPrincipal();
		if(!fileMeta.getUserId().equals(user.getId()))
			throw new ForbiddenException();

		if(fileMetaDTO.getPlace()!=null)
			fileMeta.setPlace(fileMetaDTO.getPlace());
		if(fileMetaDTO.getTags()!=null)
			fileMeta.setTags(fileMetaDTO.getTags());
		if(fileMetaDTO.getDescription()!=null)
			fileMeta.setDescription(fileMetaDTO.getDescription());
		
		fileMeta.setLastChange(new Date());
		if(isImage(fileMeta.getFormat())){
			fileMeta.setType(ResourceType.IMAGE);
		}
		else
			fileMeta.setType(ResourceType.DOCUMENT);

		fileMeta.setTrusted(trusted);
		
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
	public List<FileMetadataDTO> getTrustedScenarioMediaMetadata(String idScenario) {
		List<FileMetadata> list = gridFsManager.findScenarioTrustedMedia(idScenario);
		Iterator<FileMetadata> it = list.iterator();
		List<FileMetadataDTO> fileMetaList = new ArrayList<FileMetadataDTO>();
		while(it.hasNext()){
			FileMetadata meta = it.next(); 
			FileMetadataDTO metaDTO = new FileMetadataDTO(meta);
			fileMetaList.add(metaDTO);
		}
		return fileMetaList;
	}
		
	@Override
	public void deleteTrustedMedia(String idMedia) {
		//GridFSFile meta = gridFsManager.getOriginalMetadata(idMedia);
		gridFsManager.deleteMedia(idMedia);
	}
	

	@Override
	public void deleteMedia(CustomUserDetails user, String idMedia,
			String postId) throws NotFoundException, ForbiddenException, FileNotFoundException {
		FileMetadata f = gridFsManager.getMetadata(idMedia);
		if(!f.getUserId().equals(user.getId()))
			throw new ForbiddenException();
		
		FileReference ref = new FileReference(idMedia, f.getOriginalName());
		
		if(f.getType().equals(ResourceType.TO_CONFIRM_DOC) || f.getType().equals(ResourceType.DOCUMENT)){
			if(postId!=null){
				gridFsManager.putFileInDeleteStatus(idMedia);
				postRepository.deleteFileFromPost(postId, ref);
			}else{
				gridFsManager.deleteMedia(idMedia);
			}
		}else{
			if(postId!=null){
				gridFsManager.putImageInDeleteStatus(idMedia);
				postRepository.deleteImageFromPost(postId, ref);
			}else{
				gridFsManager.deleteMedia(idMedia);
			}
		}
		
		
			
	}
	
//	@Override
//	public Page<FileMetadataDTO> getScenarioImageMetadata(String idScenario,
//			Integer nPag, Integer nItem) throws IOException {
//		Pageable p =  new PageRequest(nPag,nItem);
//		List<FileMetadata>  list = gridFsManager.findScenarioImage(idScenario,p);
//		System.out.println("My media number: "+list.size());
//		Iterator<FileMetadata> it = list.iterator();
//		List<FileMetadataDTO> fileMetaList = new ArrayList<FileMetadataDTO>();
//		while(it.hasNext()){
//			FileMetadata meta = it.next(); 
//			FileMetadataDTO metaDTO = new FileMetadataDTO(meta);
////			Path file = Paths.get(path+"thumb/"+getFolderPath(meta.getId())+meta.getId()+"."+meta.getFormat());
////			byte[] data = Files.readAllBytes(file);
////			metaDTO.setThumb(new String(Base64.encode(data)));
//			fileMetaList.add(metaDTO);
//		}
//		return new PageImpl<FileMetadataDTO>(fileMetaList,p,fileMetaList.size());
//	}
//
//	@Override
//	public Page<FileMetadataDTO> getScenarioFilesMetadata(String idScenario,
//			Integer nPag, Integer nItem) throws IOException {
//		Pageable p =  new PageRequest(nPag,nItem);
//		List<FileMetadata>  list = gridFsManager.findScenarioFile(idScenario,p);
//		System.out.println("My media number: "+list.size());
//		Iterator<FileMetadata> it = list.iterator();
//		List<FileMetadataDTO> fileMetaList = new ArrayList<FileMetadataDTO>();
//		while(it.hasNext()){
//			FileMetadata meta = it.next(); 
//			FileMetadataDTO metaDTO = new FileMetadataDTO(meta);
////			metaDTO.setThumb(fileIcon);
//			fileMetaList.add(metaDTO);
//		}
//		return new PageImpl<FileMetadataDTO>(fileMetaList,p,fileMetaList.size());
//	}

	@Override
	public byte[] getToolMap(Integer version) throws BadRequestException, IOException {
		String path="";
		switch(version){
			case 1: {
				path=win64Tool;
				break;
			}
			case 2: {
				path=win32Tool;
				break;
			}
			case 3: {
				path=macOSXTool;
				break;
			}
			case 4: {
				path=linux64Tool;
				break;
			}
			case 5: {
				path=linux32Tool;
				break;
			}
		}
		
		if(path.isEmpty())
			throw new BadRequestException();
		
		Path p = Paths.get(path);
		byte[] data = Files.readAllBytes(p);
		
		return data;
		
	}
	/*--------------------------------------------------------UTILS FUNCTIONS-----------------------------------------------------------------*/
	
	private SupportedMedia validateAsImage(MultipartFile file) throws HttpMediaTypeNotAcceptableException{
		System.out.println(file.getContentType());
		if(file.getContentType().equals("image/jpeg"))
			return SupportedMedia.jpg;
		else if(file.getContentType().equals("image/png"))
			return SupportedMedia.png;
		else if(file.getContentType().equals("image/gif"))
			return SupportedMedia.gif;
		else
			throw new HttpMediaTypeNotAcceptableException("Formato non supportato");
	}

	private SupportedMedia validateAsMedia(MultipartFile file) throws HttpMediaTypeNotAcceptableException{
		String contentType = file.getContentType();
		if(contentType.equals("image/jpeg"))
			return SupportedMedia.jpg;
		else if(contentType.equals("image/png"))
			return SupportedMedia.png;
		else if(contentType.equals("image/gif"))
			return SupportedMedia.gif;
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
			throw new HttpMediaTypeNotAcceptableException(file.getContentType()+" formato non supportato");
	}
	
	private String getContentType(SupportedMedia type) throws HttpMediaTypeNotAcceptableException{
		if(type.equals(SupportedMedia.jpg))
			return "image/jpeg";
		else if(type.equals(SupportedMedia.png))
			return "image/png";
		else if(type.equals(SupportedMedia.gif))
			return "image/gif";
		else if(type.equals(SupportedMedia.pdf))
			return "application/pdf";
		else if(type.equals(SupportedMedia.doc))
			return "application/msword";
		else if(type.equals(SupportedMedia.docx))
			return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
		else if(type.equals(SupportedMedia.xls))
			return "application/vnd.ms-excel";
		else if(type.equals(SupportedMedia.xlsx))
			return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
		else if(type.equals(SupportedMedia.ppt))
			return "application/vnd.ms-powerpoint";
		else if(type.equals(SupportedMedia.pptx))
			return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
		else if(type.equals(SupportedMedia.odt))
			return "application/vnd.oasis.opendocument.text";
		else if(type.equals(SupportedMedia.odp))
			return "application/vnd.oasis.opendocument.presentation";
		else if(type.equals(SupportedMedia.ods))
			return "application/vnd.oasis.opendocument.spreadsheet";
		else if(type.equals(SupportedMedia.txt))
			return "text/plain";
		else
			return "application/octet-stream";
	}

	private boolean isImage(SupportedMedia media){
		if(media.equals(SupportedMedia.jpg))
			return true;
		if(media.equals(SupportedMedia.png))
			return true;
		if(media.equals(SupportedMedia.gif))
			return true;

		return false;
	}
	
	private byte[] saveThumbnail(InputStream file, int length) throws IOException, BadRequestException{
		System.out.println("saveThumb");
		BufferedImage sourceImage = ImageIO.read(file);
	
		if(sourceImage==null)
			throw new BadRequestException("Il file caricato non è un'immagine.");
		
        int width = sourceImage.getWidth();
        int height = sourceImage.getHeight();
        BufferedImage img2=null;
        
        
        if(width<100 && height<100){
        	byte[] targetArray = new byte[length];
    		int count = 0;
    		while(count<length){
    			int n = file.read(targetArray, count, targetArray.length);
    			count+=n;
    		}
    		return targetArray;
        }
        
        
        if(width>height){
            float extraSize=    height-100;
            float percentHight = (extraSize/height)*100;
            float percentWidth = width - ((width/100)*percentHight);
            BufferedImage img = new BufferedImage((int)percentWidth, 100, BufferedImage.TYPE_4BYTE_ABGR);
            Image scaledImage = sourceImage.getScaledInstance((int)percentWidth, 100, Image.SCALE_SMOOTH);
            Graphics2D g2 = img.createGraphics();
            //g2.setBackground(Color.WHITE);
            g2.clearRect(0,0,(int)percentWidth, 100);
            g2.setComposite(AlphaComposite.Src);
            g2.drawImage(scaledImage, 0, 0, null);
            img2 = new BufferedImage(100, 100 ,BufferedImage.TYPE_4BYTE_ABGR);
            img2 = img.getSubimage((int)((percentWidth-100)/2), 0, 100, 100);

        }else{
            float extraSize=    width-100;
            float percentWidth = (extraSize/width)*100;
            float  percentHight = height - ((height/100)*percentWidth);
            BufferedImage img = new BufferedImage(100, (int)percentHight, BufferedImage.TYPE_4BYTE_ABGR);
            Image scaledImage = sourceImage.getScaledInstance(100,(int)percentHight, Image.SCALE_SMOOTH);
            Graphics2D g2 = img.createGraphics();
            //g2.setBackground(Color.WHITE);
            g2.clearRect(0,0,100, (int)percentHight);
            g2.setComposite(AlphaComposite.Src);
            g2.drawImage(scaledImage, 0, 0, null);
            img2 = new BufferedImage(100, 100 ,BufferedImage.TYPE_4BYTE_ABGR);
            if(width==height)
                img2 = img.getSubimage(0, 0, 99, 99);
            else
            	img2 = img.getSubimage(0, (int)((percentHight-100)/2), 100, 100);

        }
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
    	ImageIO.write(img2, "png", baos);
    	baos.flush();
    	byte[] imageInByte = baos.toByteArray();
    	baos.close();
    	return imageInByte;
        
//		Convert BufferedImage in a Base64 String        
//        ByteArrayOutputStream os = new ByteArrayOutputStream();
//        OutputStream b64 = new Base64OutputStream(os);
//        ImageIO.write(img2, "png", b64);
//        return os.toString("UTF-8");
	}

	@Override
	public void deleteListOfMedia(List<String> mediaToDelete) {
		gridFsManager.deleteListOfMedia(mediaToDelete);
	}

	@Override
	public void putListOfImagesInDelete(List<String> mediaToDelete) throws FileNotFoundException {
		if(mediaToDelete!=null){
			for(String s : mediaToDelete){
				gridFsManager.putImageInDeleteStatus(s);
			}
		}
	}

	@Override
	public void putListOfFilesInDelete(List<String> mediaToDelete) throws FileNotFoundException {
		if(mediaToDelete!=null){
			for(String s : mediaToDelete){
				gridFsManager.putFileInDeleteStatus(s);
			}
		}		
	}

	


}
