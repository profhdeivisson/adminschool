package br.com.adminschool.infra.http;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.springframework.web.bind.annotation.ResponseStatus;

@Data
@Schema(name="Resposta da requisição", description="Representação padrão do conteúdo das respostas HTTP disponíveis na API")
public class Response {
    private ResponseStatus status;
    @Schema(description="Corpo da resposta da requisição que pode ser uma lista, um objeto ou um elemento", nullable = false )
    private Object body;
}
