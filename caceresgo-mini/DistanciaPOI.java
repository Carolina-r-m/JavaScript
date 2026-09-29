import java.util.ArrayList;
import java.util.List;

/**
 * Calcula qué monumento de Cáceres está más cerca del usuario
 * usando la fórmula de Haversine para coordenadas GPS.
 *
 * Para compilar: javac DistanciaPOI.java
 * Para ejecutar: java DistanciaPOI
 */
public class DistanciaPOI {

    // Radio medio de la Tierra en kilómetros
    private static final double RADIO_TIERRA_KM = 6371.0;

    /** Clase para guardar los datos de un punto de interés. */
    static class PuntoInteres {
        String nombre;
        double latitud;
        double longitud;

        PuntoInteres(String nombre, double latitud, double longitud) {
            this.nombre = nombre;
            this.latitud = latitud;
            this.longitud = longitud;
        }
    }

    /**
     * Calcula la distancia en kilómetros entre dos coordenadas.
     * Primero convierto los grados a radianes para poder usar la fórmula.
     */
    static double distanciaKm(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                 + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                 * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return RADIO_TIERRA_KM * c;
    }

    public static void main(String[] args) {
        // Uso coordenadas aproximadas de algunos monumentos de Cáceres
        List<PuntoInteres> puntos = new ArrayList<>();
        puntos.add(new PuntoInteres("Plaza Mayor", 39.4741, -6.3697));
        puntos.add(new PuntoInteres("Arco de la Estrella", 39.4749, -6.3708));
        puntos.add(new PuntoInteres("Torre de Bujaco", 39.4738, -6.3719));

        // Esta es la posición de prueba del usuario
        double miLat = 39.4750;
        double miLon = -6.3730;

        PuntoInteres masCercano = null;
        double menorDistancia = Double.MAX_VALUE; // empiezo con un valor muy grande

        // Recorro los puntos y guardo el que esté más cerca
        for (PuntoInteres p : puntos) {
            double d = distanciaKm(miLat, miLon, p.latitud, p.longitud);
            System.out.printf("%-22s -> %.0f metros%n", p.nombre, d * 1000);

            if (d < menorDistancia) {
                menorDistancia = d;
                masCercano = p;
            }
        }

        System.out.println("\nEl punto más cercano es: " + masCercano.nombre);
    }
}
