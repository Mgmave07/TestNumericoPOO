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
        "totalPreguntas;" + // <-- Añadimos este campo calculado en la vista
        "activo" +
        "};" +
        "Preguntas {" +
        "preguntas" +
        "}")
@Tab(properties = "codigo, nombre, tiempoMinutos, totalPreguntas, activo") // <-- También lo añadimos a la tabla general
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
    
    // Subimos el tiempo por defecto a 20 minutos, ya que los problemas numéricos requieren más cálculo
    private Integer tiempoMinutos = 20; 
    
    private Boolean activo = true;
    
    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL)
    @ListProperties("numero, enunciado, autor, activo")
    private Collection<PreguntaNumerica> preguntas;

    // --- MEJORA: PROPIEDAD CALCULADA ---
    // Muestra en la pantalla de forma automática cuántas preguntas se han asociado a este examen
    public int getTotalPreguntas() {
        if (preguntas == null) return 0;
        return preguntas.size();
    }
}