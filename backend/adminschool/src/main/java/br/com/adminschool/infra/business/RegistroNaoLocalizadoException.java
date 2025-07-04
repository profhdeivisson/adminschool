package br.com.adminschool.infra.business;

public class RegistroNaoLocalizadoException extends  BusinessException{

    public  RegistroNaoLocalizadoException() {
        super("2", "Registro não localizado", "Insira um registro previamente");
    }

    public  RegistroNaoLocalizadoException(String registro) {
        super("2", String.format("Não existe um(a) %s com o ID informado", registro), "Insira um registro previamente");
    }
}
