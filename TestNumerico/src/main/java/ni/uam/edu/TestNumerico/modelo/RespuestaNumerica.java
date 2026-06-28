package ni.uam.edu.TestNumerico.modelo;

import lombok.Getter;
import lombok.Setter;
import org.openxava.annotations.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@View(
        members =
                "Respuesta {" +
                        "aplicacion;" +
                        "pregunta;" +
                        "opcionSeleccionada;" +
                        "fechaRespuesta;" +
                        "tiempoRespuesta;" +
                        "puntajeObtenido;" +
                        "correcta" +
                        "}"
)
@Tab(properties =
        "pregunta.numero, opcionSeleccionada.letra, puntajeObtenido, correcta")
public class RespuestaNumerica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Hidden
    private Long id;

    @ManyToOne(optional = false)
    @Required
    private AplicacionTest aplicacion;

    @ManyToOne(optional = false)
    @Required
    private PreguntaNumerica pregunta;

    @ManyToOne
    private OpcionNumerica opcionSeleccionada;

    private LocalDateTime fechaRespuesta;

    /**
     * Tiempo empleado por el usuario
     * para responder la pregunta.
     */
    private Integer tiempoRespuesta;

    /**
     * Puntaje obtenido en esta pregunta.
     */
    private Integer puntajeObtenido = 0;

    @ReadOnly
    public Boolean getCorrecta() {

        if (opcionSeleccionada == null) {
            return false;
        }

        return Boolean.TRUE.equals(opcionSeleccionada.getCorrecta());

    }

}
