package it.polito.applied.smiled.dto;

public class ResetPasswordDTO {

	private String password;
	private String token;
	private String email;
	private String rePassword;
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getRePassword() {
		return rePassword;
	}
	public void setRePassword(String rePassword) {
		this.rePassword = rePassword;
	}
	
	@Override
	public String toString(){
		return "Password: "+password+"; Confirm: "+rePassword+"; Token: "+token+"; Email: "+email;
	}
	
}
