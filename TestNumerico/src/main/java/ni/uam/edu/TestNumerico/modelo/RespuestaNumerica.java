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

    @ReadOnly // Hacemos que la fecha sea de solo lectura en la interfaz para que nadie la altere
    private LocalDateTime fechaRespuesta;

    // --- MEJORA 1: ASIGNACIÓN AUTOMÁTICA DE FECHA ---
    @PrePersist
    protected void onCreate() {
        this.fechaRespuesta = LocalDateTime.now();
    }

    // --- MEJORA 2: PROPIEDAD CALCULADA OPTIMIZADA ---
    public Boolean getCorrecta() {
        if (opcionSeleccionada == null) return false;
        return Boolean.TRUE.equals(opcionSeleccionada.getCorrecta());
    }
}