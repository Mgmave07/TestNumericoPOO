package ni.uam.edu.TestNumerico.modelo;

import lombok.Getter;
import lombok.Setter;
import org.openxava.annotations.Hidden;
import org.openxava.annotations.Required;
import org.openxava.annotations.Tab;
import org.openxava.annotations.View;

import javax.persistence.*;

@Entity
@Getter
@Setter
@View(members =
        "Resultado {" +
                "aplicacion;" +
                "aciertos;" +
                "errores;" +
                "omitidas;" +
                "puntajeDirecto" +
                "}"
)
@Tab(properties = "aplicacion.id, aciertos, errores, omitidas, puntajeDirecto")
public class ResultadoTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Hidden
    private Long id;

    @OneToOne(optional = false)
    @Required
    private AplicacionTest aplicacion;

    private Integer aciertos = 0;

    private Integer errores = 0;

    private Integer omitidas = 0;

    private Integer puntajeDirecto = 0;
}

