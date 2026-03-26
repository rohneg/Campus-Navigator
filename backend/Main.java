import com.sun.net.httpserver.*;
import java.net.InetSocketAddress;

public class Main {
    public static void main(String[] args) throws Exception {
        Graph graph = CampusData.buildGraph();
        DijkstraService dijkstra = new DijkstraService();
        RouteController controller = new RouteController(graph, dijkstra);

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/api/nodes", controller.nodesHandler());
        server.createContext("/api/route", controller.routeHandler());
        server.start();

        System.out.println("Server running at http://localhost:8080");
    }
}