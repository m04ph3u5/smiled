package it.polito.applied.smiled.pojo;

import org.springframework.security.core.GrantedAuthority;

public class Role implements GrantedAuthority {
  
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	
	private String role;
    
    public Role(){}
    
    public Role(String role){
    	this.role=role;
    }

    @Override
    public String getAuthority() {
        return role;
    }
    
    public void setRole(String role){
    	this.role=role;
    }
       
}