package ni.uam.edu.TestNumerico.modelo;

import lombok.Getter;
import lombok.Setter;
import org.openxava.annotations.Hidden;
import org.openxava.annotations.Required;
import org.openxava.annotations.View;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@View(members =
        "DatosPersonales {" +
                "primerNombre, segundoNombre;" +
                "primerApellido, segundoApellido;" +
                "fechaNacimiento, edad;" +
                "sexo;" +
                "codigoAcceso" +
                "};" +
                "DatosAcademicos {" +
                "estudios;" +
                "profesion" +
                "}"
)
public class Evaluado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Hidden
    private Long id;
    @Required
    @Column(length = 80)
    private String primerNombre;
    @Column(length = 80)
    private String segundoNombre;
    @Required
    @Column(length = 80)
    private String primerApellido;
    @Column(length = 80)
    private String segundoApellido;
    private LocalDate fechaNacimiento;
    private Integer edad;
    @Column(length = 20)
    private String sexo;
    @Column(length = 120)
    private String estudios;
    @Column(length = 120)
    private String profesion;
    @Required
    @Column(length = 20)
    private String codigoAcceso;
}
