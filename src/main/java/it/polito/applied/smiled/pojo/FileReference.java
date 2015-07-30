package it.polito.applied.smiled.pojo;

public class FileReference {

	private String id;
	private String originalName;
	
	public FileReference(){}
	
	public FileReference(String id, String originalName){
		this.id=id;
		this.originalName=originalName;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getOriginalName() {
		return originalName;
	}

	public void setOriginalName(String originalName) {
		this.originalName = originalName;
	}

	
}
