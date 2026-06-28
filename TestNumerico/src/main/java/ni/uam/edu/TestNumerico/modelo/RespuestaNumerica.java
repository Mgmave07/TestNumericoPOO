package ni.uam.edu.TestNumerico.modelo;

import lombok.Getter;
import lombok.Setter;
import org.openxava.annotations.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@View(members =
        "DatosRespuesta {" +
                "aplicacion;" +
                "pregunta;" +
                "opcionSeleccionada;" +
                "fechaRespuesta;" +
                "correcta" +
                "}"
)
@Tab(properties = "aplicacion.id, pregunta.numero, opcionSeleccionada.letra, correcta")
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

    @ReadOnly
    public Boolean getCorrecta() {
        if (opcionSeleccionada == null) return false;
        return Boolean.TRUE.equals(opcionSeleccionada.getCorrecta());
    }

}