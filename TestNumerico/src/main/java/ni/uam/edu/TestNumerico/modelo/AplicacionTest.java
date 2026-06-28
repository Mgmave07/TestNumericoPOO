package ni.uam.edu.TestNumerico.modelo;

import lombok.Getter;
import lombok.Setter;
import ni.uam.edu.TestNumerico.enums.EstadoAplicacion;
import org.openxava.annotations.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Collection;

@Entity
@Getter
@Setter
@View(
        members =
                "Aplicación {" +
                        "evaluado;" +
                        "test;" +
                        "fechaInicio,fechaFinal;" +
                        "estado" +
                        "};" +

                        "Respuestas {" +
                        "respuestas" +
                        "};" +

                        "Resultado {" +
                        "resultado" +
                        "}"
)
@Tab(properties =
        "evaluado.primerNombre,evaluado.primerApellido,test.nombre,estado")
public class AplicacionTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Hidden
    private Long id;

    @ManyToOne(optional = false)
    @Required
    private Evaluado evaluado;

    @ManyToOne(optional = false)
    @Required
    private TestRazonamientoNumerico test;

    private LocalDateTime fechaInicio;

    private LocalDateTime fechaFinal;

    @Enumerated(EnumType.STRING)
    private EstadoAplicacion estado =
            EstadoAplicacion.PENDIENTE;

    @OneToMany(mappedBy = "aplicacion",
            cascade = CascadeType.ALL)
    @ListProperties(
            "pregunta.numero,puntajeObtenido,correcta")
    private Collection<RespuestaNumerica> respuestas;

    @OneToOne(mappedBy = "aplicacion",
            cascade = CascadeType.ALL)
    private ResultadoTest resultado;

}