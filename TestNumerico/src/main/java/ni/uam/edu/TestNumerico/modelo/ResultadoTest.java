package ni.uam.edu.TestNumerico.modelo;

import lombok.Getter;
import lombok.Setter;
import org.openxava.annotations.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@View(
        members =
                "Resultado {" +
                        "aplicacion;" +
                        "preguntasRespondidas;" +
                        "aciertos;" +
                        "errores;" +
                        "puntajeTotal;" +
                        "porcentaje;" +
                        "nivelDesempeno" +
                        "}"
)
@Tab(properties =
        "aplicacion.id,puntajeTotal,porcentaje,nivelDesempeno")
public class ResultadoTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Hidden
    private Long id;

    @OneToOne(optional = false)
    @Required
    private AplicacionTest aplicacion;

    private Integer preguntasRespondidas = 0;

    private Integer aciertos = 0;

    private Integer errores = 0;

    private Integer puntajeTotal = 0;

    private Double porcentaje = 0.0;

    @Column(length = 40)
    private String nivelDesempeno;

}