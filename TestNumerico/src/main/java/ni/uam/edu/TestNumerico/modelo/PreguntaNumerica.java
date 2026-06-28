package ni.uam.edu.TestNumerico.modelo;

import lombok.Getter;
import lombok.Setter;
import org.openxava.annotations.*;

import javax.persistence.*;
import java.util.Collection;

@Entity
@Getter
@Setter
@View(
        members =
                "DatosPregunta{" +
                        "test;" +
                        "numero;" +
                        "categoria;" +
                        "tipoOperacion;" +
                        "dificultad;" +
                        "valor;" +
                        "activo" +
                        "};" +

                        "Problema{" +
                        "enunciado" +
                        "};" +

                        "Opciones{" +
                        "opciones" +
                        "}"
)
@Tab(properties =
        "numero,categoria,tipoOperacion,dificultad,valor,activo")
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

    @Column(length = 80)
    private String categoria;

    @Column(length = 60)
    private String tipoOperacion;

    @Required
    @Stereotype("MEMO")
    @Column(length = 1500)
    private String enunciado;

    @Column(length = 30)
    private String dificultad;

    private Integer valor = 5;

    private Boolean activo = true;

    @OneToMany(mappedBy = "pregunta",
            cascade = CascadeType.ALL)
    @ListProperties("letra,texto,correcta")
    private Collection<OpcionNumerica> opciones;

}