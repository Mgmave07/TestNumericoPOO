package ni.uam.edu.TestNumerico.modelo;

import lombok.Getter;
import lombok.Setter;
import org.openxava.annotations.*;

import javax.persistence.*;
import java.util.Collection;

@Entity
@Getter
@Setter
@View(members = "DatosTest {" +
        "codigo;" +
        "nombre;" +
        "descripcion;" +
        "tiempoMinutos;" +
        "activo" +
        "};" +
        "Preguntas {" +
        "preguntas" +
        "}")
@Tab(properties = "codigo, nombre, tiempoMinutos, activo")
public class TestRazonamientoNumerico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Hidden
    private Long id;

    @Required
    @Column(length = 20)
    private String codigo;
    @Required
    @Column(length = 120)
    private String nombre;
    @Stereotype("MEMO")
    @Column(length = 1000)
    private String descripcion;
    private Integer tiempoMinutos = 15;
    private Boolean activo = true;
    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL)
    @ListProperties("numero, enunciado, autor, activo")
    private Collection<PreguntaNumerica> preguntas;
}
