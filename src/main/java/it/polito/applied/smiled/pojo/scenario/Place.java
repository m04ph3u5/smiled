package it.polito.applied.smiled.pojo.scenario;

public class Place {

	private double x;
	private double y;
	private String text;
	
	public Place(){
		
	}
	
	public Place(double x, double y){
		this.x=x;
		this.y=y;
	}

	public double getX() {
		return x;
	}

	public void setX(double x) {
		this.x = x;
	}

	public double getY() {
		return y;
	}

	public void setY(double y) {
		this.y = y;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}
	
	
}
