package br.com.adminschool.infra;

import br.com.adminschool.infra.business.BusinessException;
import br.com.adminschool.infra.business.RegistroNaoLocalizadoException;
import br.com.adminschool.infra.http.Response;
import br.com.adminschool.infra.http.ResponseFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.lang.reflect.UndeclaredThrowableException;

public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(Exception.class)
    private ResponseEntity<Object> handleGeneral(Exception e, WebRequest request) {
        if (e.getClass().isAssignableFrom(UndeclaredThrowableException.class)) {
            UndeclaredThrowableException exception = (UndeclaredThrowableException) e;
            if (exception.getUndeclaredThrowable() instanceof BusinessException) {
                return handleBusinessException((BusinessException) exception.getUndeclaredThrowable(), request);
            }
        }

        BusinessMessage be = BusinessMessage.E501;
        Response error = ResponseFactory.error(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Ocorreu um erro interno no servidor",
                be.getSuggestion()
        );

        return buildResponseEntity(e, error, HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @ExceptionHandler(BusinessException.class)
    private ResponseEntity<Object> handleBusinessException(BusinessException be, WebRequest request) {
        Response error = ResponseFactory.error(
                be.getId(),
                be.getMessage(),
                be.getSuggestion()
        );
        return buildResponseEntity(be, error, HttpStatus.resolve(be.getHttpStatus()), request);
    }

    @ExceptionHandler(RegistroNaoLocalizadoException.class)
    private ResponseEntity<Object> handleRegistroNaoLocalizado(RegistroNaoLocalizadoException e, WebRequest request) {
        Response error = ResponseFactory.error(
                HttpStatus.NOT_FOUND.value(),
                e.getMessage(),
                "Verifique o ID informado e tente novamente"
        );
        return buildResponseEntity(e, error, HttpStatus.NOT_FOUND, request);
    }

    private ResponseEntity<Object> buildResponseEntity(Exception e, Response error, HttpStatus status, WebRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return handleExceptionInternal(e, error, headers, status, request);
    }

}