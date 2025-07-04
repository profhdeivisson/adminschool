package br.com.adminschool.infra.business;

public class BusinessException extends RuntimeException{
    private String id;
    private String suggestion;
    public BusinessException(String id, String message,String suggestion){
        super(message);
        this.id = id;
        this.suggestion = suggestion;
    }

    public BusinessException() {
    }

    public String getSuggestion() {
        return suggestion;
    }

    public String getId() {
        return id;
    }
    public int getHttpStatus(){
        return 409;
    }
}
