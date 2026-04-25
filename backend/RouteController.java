import com.sun.net.httpserver.*;
import java.io.*;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class RouteController {

    private final Graph graph;
    private final DijkstraService dijkstra;

    public RouteController(Graph graph, DijkstraService dijkstra) {
        this.graph = graph;
        this.dijkstra = dijkstra;
    }

    public HttpHandler nodesHandler() {
        return exchange -> {
            addCors(exchange);

            if (!exchange.getRequestMethod().equalsIgnoreCase("GET")) {
                exchange.sendResponseHeaders(405, -1);
                return;
            }

            List<String> nodes = new ArrayList<>(graph.getNodes());
            Collections.sort(nodes);

            String json = "[" + String.join(",", nodes.stream()
                    .map(n -> "\"" + n + "\"").toList()) + "]";

            send(exchange, 200, json);
        };
    }

    public HttpHandler routeHandler() {
        return exchange -> {
            addCors(exchange);

            if (!exchange.getRequestMethod().equalsIgnoreCase("GET")) {
                exchange.sendResponseHeaders(405, -1);
                return;
            }

            Map<String,String> q = parse(exchange.getRequestURI());
            String src = q.get("src");
            String dest = q.get("dest");

            if (src == null || dest == null) {
                send(exchange, 400, "{\"error\":\"missing params\"}");
                return;
            }

            RouteResponse res = dijkstra.findShortestPath(graph, src, dest);

            if (res.distance == -1) {
                send(exchange, 404, "{\"error\":\"no path\"}");
                return;
            }

            String path = "[" + String.join(",", res.path.stream()
                    .map(n -> "\"" + n + "\"").toList()) + "]";

            send(exchange, 200, "{\"path\":" + path + ",\"distance\":" + res.distance + "}");
        };
    }

    private void addCors(HttpExchange ex) {
        ex.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
    }

    private void send(HttpExchange ex, int code, String body) throws IOException {
        byte[] b = body.getBytes(StandardCharsets.UTF_8);
        ex.sendResponseHeaders(code, b.length);
        try (OutputStream os = ex.getResponseBody()) {
            os.write(b);
        }
    }

    private Map<String,String> parse(URI uri) throws UnsupportedEncodingException {
        Map<String,String> map = new HashMap<>();
        String q = uri.getRawQuery();
        if (q == null) return map;

        for (String p : q.split("&")) {
            String[] kv = p.split("=");
            if (kv.length == 2) {
                map.put(kv[0], java.net.URLDecoder.decode(kv[1], "UTF-8"));
            }
        }
        return map;
    }
}