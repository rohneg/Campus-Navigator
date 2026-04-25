import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

public class Main {
    public static void main(String[] args) throws Exception {

        Graph g = CampusData.buildGraph();
        DijkstraService d = new DijkstraService();
        RouteController c = new RouteController(g, d);

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        // API routes
        server.createContext("/api/nodes", c.nodesHandler());
        server.createContext("/api/route", c.routeHandler());

        // Root route (NO MORE 404)
        server.createContext("/", exchange -> {
            String response = "Campus Navigator Backend Running";
            exchange.getResponseHeaders().add("Content-Type", "text/plain");
            exchange.sendResponseHeaders(200, response.length());
            exchange.getResponseBody().write(response.getBytes());
            exchange.getResponseBody().close();
        });

        server.setExecutor(Executors.newFixedThreadPool(10));
        server.start();

        System.out.println("Server running at http://localhost:8080");
    }
}