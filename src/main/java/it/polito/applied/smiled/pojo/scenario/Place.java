package it.polito.applied.smiled.pojo.scenario;

public class Place {

	private int x;
	private int y;
	private String urlMap;
	
	public Place(){
		
	}
	
	public Place(int x, int y){
		this.x=x;
		this.y=y;
	}

	public int getX() {
		return x;
	}

	public void setX(int x) {
		this.x = x;
	}

	public int getY() {
		return y;
	}

	public void setY(int y) {
		this.y = y;
	}

	public String getUrlMap() {
		return urlMap;
	}

	public void setUrlMap(String urlMap) {
		this.urlMap = urlMap;
	}
	
	
}
