package ni.uam.edu.TestNumerico.modelo;

import lombok.Getter;
import lombok.Setter;
import org.openxava.annotations.*;

import javax.persistence.*;
import java.util.Collection;

@Entity
@Getter
@Setter
@View(members = "DatosPregunta {" +
        "test;" +
        "numero;" +
        "enunciado;" +
        "autor;" +
        "activo" +
        "};" +
        "Opciones {" +
        "opciones" +
        "}")
@Tab(properties = "numero, enunciado, autor, activo")
public class PreguntaNumerica {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Hidden
    private Long id;
    @ManyToOne(optional = false)
    @Required
    private TestRazonamientoNumerico test;
    @Required
    private Integer numero;
    @Required
    @Stereotype("MEMO")
    @Column(length = 1500)
    private String enunciado;
    @Column(length = 120)
    private String autor;
    private Boolean activo = true;
    @OneToMany(mappedBy = "pregunta", cascade = CascadeType.ALL)
    @ListProperties("letra, texto, correcta")
    private Collection<OpcionNumerica> opciones;

}
