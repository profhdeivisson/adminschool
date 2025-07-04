package br.com.adminschool.infra.business;

public class ConsultaSemRegistrosException extends BusinessException{
    public ConsultaSemRegistrosException() {
        super("3", "Consulta sem Registro", "Insira um registro previamente");
    }
}
