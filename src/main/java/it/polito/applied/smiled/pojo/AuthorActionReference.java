package it.polito.applied.smiled.pojo;

public class AuthorActionReference {

	private String id;
	private String name;
	
	public AuthorActionReference(){
		
	}
	
	public AuthorActionReference(Reference ref){
		id = ref.getId();
		name="";
		if(ref.getFirstname()!=null)
			name = ref.getFirstname();
		if(ref.getLastname()!=null){
			if(!name.isEmpty())
				name+=" "+ref.getLastname();
			else
				name=ref.getLastname();
		}
	}
	
	public AuthorActionReference(CharacterReference ref){
		id = ref.getId();
		name = ref.getName();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	
}
