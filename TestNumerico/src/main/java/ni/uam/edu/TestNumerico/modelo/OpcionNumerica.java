package ni.uam.edu.TestNumerico.modelo;

import lombok.Getter;
import lombok.Setter;
import ni.uam.edu.TestNumerico.enums.LetraOpcion;
import org.openxava.annotations.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@View(members = "DatosOpcion {" +
        "pregunta;" +
        "letra;" +
        "texto;" +
        "correcta" +
        "}")
// Mejoramos el diseño de la tabla de administración para ver el número y el enunciado resumido
@Tab(properties = "pregunta.numero, pregunta.enunciado, letra, texto, correcta")
public class OpcionNumerica {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Hidden
    private Long id;
    
    @ManyToOne(optional = false)
    @Required
    private PreguntaNumerica pregunta;
    
    @Required
    @Enumerated(EnumType.STRING)
    private LetraOpcion letra;
    
    @Required
    @Stereotype("MEMO")
    @Column(length = 1000)
    private String texto;
    
    private Boolean correcta = false;
    
    // NOTA: Eliminamos el método getCorrecta() manual ya que Lombok 
    // genera automáticamente los getters/setters limpios por detrás.
}