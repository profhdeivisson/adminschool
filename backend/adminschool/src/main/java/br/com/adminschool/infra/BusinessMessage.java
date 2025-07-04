package br.com.adminschool.infra;

import org.springframework.http.HttpStatus;

public enum BusinessMessage {
    E501("501","Erro ao tentar acessaar o conteudo","Contate o suporte Técnicoo"){
        @Override
        public int getHttpStatus() {
            return 500;
        }
    }
    ;

    private  final String code;
    private  final String message;
    private  final String suggestion;

    private int httpStatus;


    BusinessMessage(String code, String message, String suggestion) {
        this.code = code;
        this.message = message;
        this.suggestion = suggestion;
    }

    public int getHttpStatus() {
        return HttpStatus.CONFLICT.value();
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public String getSuggestion() {
        return suggestion;
    }
}
