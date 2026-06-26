package ni.uam.edu.TestNumerico.run;

import org.openxava.util.*;

/**
 * Ejecuta esta clase para arrancar la aplicación.
 */

public class TestNumerico {

	public static void main(String[] args) throws Exception {
		DBServer.start("TestNumerico-db"); // Para usar tu propia base de datos comenta esta línea y configura src/main/webapp/META-INF/context.xml
		AppServer.run("TestNumerico"); // Usa AppServer.run("") para funcionar en el contexto raíz
	}

}
