package it.polito.applied.smiled.pojo;

public class MediaDataAndContentType {
	
	private byte[] data;
	private org.springframework.http.MediaType contentType;
	
	public MediaDataAndContentType(){
		
	}
	
	public MediaDataAndContentType(byte[] data, org.springframework.http.MediaType contentType){
		this.data=data;
		this.contentType=contentType;
	}
	
	public byte[] getData() {
		return data;
	}
	public void setData(byte[] data) {
		this.data = data;
	}
	public org.springframework.http.MediaType getContentType() {
		return contentType;
	}
	public void setContentType(org.springframework.http.MediaType contentType) {
		this.contentType = contentType;
	}
	
	

}
