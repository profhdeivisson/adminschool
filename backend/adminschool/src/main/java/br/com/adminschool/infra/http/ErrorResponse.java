package br.com.adminschool.infra.http;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Schema(name = "ErrorResponse", description = "Modelo padrão para respostas de erro")
public class ErrorResponse {
    @Schema(description = "Timestamp do erro", example = "2025-05-10 22:22:52")
    private String dateTime = LocalDateTime.now().toString();

    @Schema(description = "Indicador de sucesso", example = "false")
    private boolean success;

    @Schema(description = "Mensagem de erro", example = "Erro ao processar a requisição")
    private String message;

    @Schema(description = "Código de erro", example = "500")
    private Serializable code;

    @Schema(description = "Sugestão para resolução", example = "Contacte o suporte técnico")
    private String suggestion;
}
