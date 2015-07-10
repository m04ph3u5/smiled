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

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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
		
		if(scenario.getCover()==null || scenario.getCover().isEmpty()){
			//TODO modificare path
			
			File dir = new File(path+"cover/scenarios/"+getFolderPath(id));
			dir.mkdirs();
			File file = new File(dir,id);

			
			scenarioCover.transferTo(file);
			//meta.setPath(path+"cover/scenarios/"+id);
			meta=fileMetadataRepository.save(meta);
			scenarioRepository.setCover(id,meta.getId());
		}else{
			
			FileMetadata oldMeta = fileMetadataRepository.findById(scenario.getCover());
			File oldCover = new File(path+"cover/scenarios/"+getFolderPath(id)+id);
			File dir = new File(path+"media/"+getFolderPath(oldMeta.getId()));
			dir.mkdirs();
			File newPath = new File(dir,oldMeta.getId()+"."+oldMeta.getFormat());
			if(oldCover.renameTo(newPath)){
				saveThumbnail(newPath, oldMeta.getId());
				File f = new File(path+"cover/scenarios/"+getFolderPath(id)+"/"+id);
				scenarioCover.transferTo(f);
				//meta.setPath(path+"cover/scenarios/"+id);
				meta=fileMetadataRepository.save(meta);
				//oldMeta.setPath(path+"media/"+oldMeta.getId()+"."+oldMeta.getFormat());
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
		return new File(path+"cover/scenarios/"+getFolderPath(id)+"/"+id);
	}

	@Override
	public File getUserCover(String id) {
		return new File(path+"cover/users/"+getFolderPath(id)+"/"+id);
	}

	@Override
	public void postCoverUser(MultipartFile userCover,
			CustomUserDetails user) throws BadRequestException, IllegalStateException, IOException, HttpMediaTypeNotAcceptableException {
	
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
		System.out.println("user profile");
		if(u.getProfile()==null || u.getProfile().getCoverPhoto()==null || u.getProfile().getCoverPhoto().isEmpty()){
			File dir = new File(path+"cover/users/"+getFolderPath(u.getId()));
			dir.mkdirs();
			File file = new File(dir,u.getId());

			
			userCover.transferTo(file);
			//meta.setPath(path+"cover/scenarios/"+id);
			meta=fileMetadataRepository.save(meta);
			userRepository.setCover(u.getId(),meta.getId());
		}else{
			FileMetadata oldMeta = fileMetadataRepository.findById(u.getProfile().getCoverPhoto());
			File oldCover = new File(path+"cover/users/"+getFolderPath(u.getId())+u.getId());
			File dir = new File(path+"media/"+getFolderPath(oldMeta.getId()));
			dir.mkdirs();
			File newPath = new File(dir,oldMeta.getId()+"."+oldMeta.getFormat());
			

			if(oldCover.renameTo(newPath)){
				userCover.transferTo(new File(path+"cover/users/"+getFolderPath(u.getId())+"/"+u.getId()));
				saveThumbnail(newPath, oldMeta.getId());

				//meta.setPath(path+"cover/scenarios/"+id);
				meta=fileMetadataRepository.save(meta);
				//oldMeta.setPath(path+"media/"+oldMeta.getId()+"."+oldMeta.getFormat());
				oldMeta.setType(ResourceType.OLD_COVER);
				oldMeta.setLastChange(new Date());
				fileMetadataRepository.save(oldMeta);
				userRepository.setCover(u.getId(),meta.getId());
			}else{
				throw new IOException();
			}
			
		}
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

		if(c.getCover()==null || c.getCover().isEmpty() || c.getCover().equals("")){
			File dir = new File(path+"cover/characters/"+getFolderPath(c.getId()));
			dir.mkdirs();
			File file = new File(dir,c.getId());

			
			characterCover.transferTo(file);
			//meta.setPath(path+"cover/scenarios/"+id);
			meta=fileMetadataRepository.save(meta);
			characterRepository.setCover(c.getId(),meta.getId());
		}else{
			FileMetadata oldMeta = fileMetadataRepository.findById(c.getCover());
			File oldCover = new File(path+"cover/characters/"+getFolderPath(c.getId())+c.getId());
			File dir = new File(path+"media/"+getFolderPath(oldMeta.getId()));
			dir.mkdirs();
			File newPath = new File(dir,oldMeta.getId()+"."+oldMeta.getFormat());
			if(oldCover.renameTo(newPath)){
				saveThumbnail(newPath, oldMeta.getId());
				characterCover.transferTo(new File(path+"cover/users/"+getFolderPath(c.getId())+"/"+c.getId()));
				//meta.setPath(path+"cover/scenarios/"+id);
				meta=fileMetadataRepository.save(meta);
				//oldMeta.setPath(path+"media/"+oldMeta.getId()+"."+oldMeta.getFormat());
				oldMeta.setType(ResourceType.OLD_COVER);
				oldMeta.setLastChange(new Date());
				fileMetadataRepository.save(oldMeta);
				characterRepository.setCover(c.getId(),meta.getId());
			}else{
				throw new IOException();
			}
		}
		
	}

	@Override
	public File getCharacterCover(String characterId) {
		return new File(path+"cover/characters/"+getFolderPath(characterId)+"/"+characterId);
	}

	@Override
	public File getMedia(String filename) {
		FileMetadata meta=fileMetadataRepository.findById(filename);
		return new File(path+"media/"+getFolderPath(filename)+"/"+filename+"."+meta.getFormat());
	}

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
		meta=fileMetadataRepository.save(meta);
		File dir = new File(path+"media/"+getFolderPath(meta.getId()));
		dir.mkdirs();
		File file = new File(dir,meta.getId()+"."+meta.getFormat());
		media.transferTo(file);
	//	fileMetadataRepository.setFileMetadataPath(meta.getId(), path+"media/"+getFolderPath(meta.getId())+meta.getId()+"."+meta.getFormat());
		
		
		return meta.getId();
	}
	
	@Override
	public void postMediaMetadata(String idMedia, FileMetadataDTO fileMetaDTO,
			Authentication auth) throws BadRequestException, ForbiddenException {
		FileMetadata fileMeta = fileMetadataRepository.findById(idMedia);
		if(fileMeta==null)
			throw new BadRequestException();
		CustomUserDetails user = (CustomUserDetails)auth.getPrincipal();
		if(!fileMeta.getUserId().equals(user.getId()))
			throw new ForbiddenException();
		
		if(fileMetaDTO.getCharacterId()!=null){
			if(!permissionEvaluator.hasPermission(auth, fileMetaDTO.getCharacterId(), "Character", "WRITE"))
				throw new ForbiddenException();
		}
		
		fileMeta.setLastChange(new Date());
		if(isImage(fileMeta.getFormat()))
			fileMeta.setType(ResourceType.IMAGE);
		else
			fileMeta.setType(ResourceType.DOCUMENT);

		if(fileMetaDTO.getPlace()!=null)
			fileMeta.setPlace(fileMetaDTO.getPlace());
		if(fileMetaDTO.getTags()!=null)
			fileMeta.setTags(fileMetaDTO.getTags());
		if(fileMetaDTO.getDescription()!=null)
			fileMeta.setDescription(fileMetaDTO.getDescription());
		if(fileMetaDTO.getCharacterId()!=null)
			fileMeta.setCharacterId(fileMetaDTO.getCharacterId());
		fileMetadataRepository.save(fileMeta);
	}
	
	@Override
	public Page<FileMetadataDTO> getUserImageMetadata(CustomUserDetails user, int nPag, int nItem) throws IOException {
		Pageable p =  new PageRequest(nPag,nItem);
		List<FileMetadata>  list = fileMetadataRepository.findUserImage(user.getId(),p);
		System.out.println("My media number: "+list.size());
		Iterator<FileMetadata> it = list.iterator();
		List<FileMetadataDTO> fileMetaList = new ArrayList<FileMetadataDTO>();
		while(it.hasNext()){
			FileMetadata meta = it.next(); 
			FileMetadataDTO metaDTO = new FileMetadataDTO(meta);
			Path file = Paths.get(path+"thumb/"+getFolderPath(meta.getId())+meta.getId()+".jpg");
			byte[] data = Files.readAllBytes(file);
			metaDTO.setThumb(new String(Base64.encode(data)));
			fileMetaList.add(metaDTO);
		}
		return new PageImpl<FileMetadataDTO>(fileMetaList,p,fileMetaList.size());
	}
	
	@Override
	public Page<FileMetadataDTO> getUserFilesMetadata(CustomUserDetails user,
			Integer nPag, Integer nItem) throws IOException {
		Pageable p =  new PageRequest(nPag,nItem);
		List<FileMetadata>  list = fileMetadataRepository.findUserFile(user.getId(),p);
		System.out.println("My media number: "+list.size());
		Iterator<FileMetadata> it = list.iterator();
		List<FileMetadataDTO> fileMetaList = new ArrayList<FileMetadataDTO>();
		while(it.hasNext()){
			FileMetadata meta = it.next(); 
			FileMetadataDTO metaDTO = new FileMetadataDTO(meta);
			metaDTO.setThumb(fileIcon);
			fileMetaList.add(metaDTO);
		}
		return new PageImpl<FileMetadataDTO>(fileMetaList,p,fileMetaList.size());
	}
	
	@Override
	public Page<FileMetadataDTO> getScenarioImageMetadata(String idScenario,
			Integer nPag, Integer nItem) throws IOException {
		Pageable p =  new PageRequest(nPag,nItem);
		List<FileMetadata>  list = fileMetadataRepository.findScenarioImage(idScenario,p);
		System.out.println("My media number: "+list.size());
		Iterator<FileMetadata> it = list.iterator();
		List<FileMetadataDTO> fileMetaList = new ArrayList<FileMetadataDTO>();
		while(it.hasNext()){
			FileMetadata meta = it.next(); 
			FileMetadataDTO metaDTO = new FileMetadataDTO(meta);
			Path file = Paths.get(path+"thumb/"+getFolderPath(meta.getId())+meta.getId()+"."+meta.getFormat());
			byte[] data = Files.readAllBytes(file);
			metaDTO.setThumb(new String(Base64.encode(data)));
			fileMetaList.add(metaDTO);
		}
		return new PageImpl<FileMetadataDTO>(fileMetaList,p,fileMetaList.size());
	}

	@Override
	public Page<FileMetadataDTO> getScenarioFilesMetadata(String idScenario,
			Integer nPag, Integer nItem) throws IOException {
		Pageable p =  new PageRequest(nPag,nItem);
		List<FileMetadata>  list = fileMetadataRepository.findScenarioFile(idScenario,p);
		System.out.println("My media number: "+list.size());
		Iterator<FileMetadata> it = list.iterator();
		List<FileMetadataDTO> fileMetaList = new ArrayList<FileMetadataDTO>();
		while(it.hasNext()){
			FileMetadata meta = it.next(); 
			FileMetadataDTO metaDTO = new FileMetadataDTO(meta);
			metaDTO.setThumb(fileIcon);
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
	
	private void saveThumbnail(File file, String id) throws IOException{
		BufferedImage sourceImage = ImageIO.read(file);
        int width = sourceImage.getWidth();
        int height = sourceImage.getHeight();
        BufferedImage img2=null;
        if(width>height){
            float extraSize=    height-100;
            float percentHight = (extraSize/height)*100;
            float percentWidth = width - ((width/100)*percentHight);
            BufferedImage img = new BufferedImage((int)percentWidth, 100, BufferedImage.TYPE_INT_RGB);
            Image scaledImage = sourceImage.getScaledInstance((int)percentWidth, 100, Image.SCALE_SMOOTH);
            Graphics2D g2 = img.createGraphics();
            g2.setBackground(Color.WHITE);
            g2.clearRect(0,0,(int)percentWidth, 100);
            g2.drawImage(scaledImage, 0, 0, null);
            img2 = new BufferedImage(100, 100 ,BufferedImage.TYPE_INT_RGB);
            img2 = img.getSubimage((int)((percentWidth-100)/2), 0, 100, 100);

        }else{
            float extraSize=    width-100;
            float percentWidth = (extraSize/width)*100;
            float  percentHight = height - ((height/100)*percentWidth);
            BufferedImage img = new BufferedImage(100, (int)percentHight, BufferedImage.TYPE_INT_RGB);
            Image scaledImage = sourceImage.getScaledInstance(100,(int)percentHight, Image.SCALE_SMOOTH);
            Graphics2D g2 = img.createGraphics();
            g2.setBackground(Color.WHITE);
            g2.clearRect(0,0,100, (int)percentHight);
            g2.drawImage(scaledImage, 0, 0, null);
            img2 = new BufferedImage(100, 100 ,BufferedImage.TYPE_INT_RGB);
            img2 = img.getSubimage(0, (int)((percentHight-100)/2), 100, 100);

        }
		  File dir = new File(path+"thumb/"+getFolderPath(id));
		  dir.mkdirs();
		  File f = new File(dir,id+"."+SupportedMedia.jpg); 
		  ImageIO.write(img2,"jpg",f);
	}
	
}
