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
            if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            StringBuilder sb = new StringBuilder("[");
            List<String> nodes = new ArrayList<>(graph.getNodes());
            Collections.sort(nodes);
            for (int i = 0; i < nodes.size(); i++) {
                sb.append("\"").append(nodes.get(i)).append("\"");
                if (i < nodes.size() - 1) sb.append(",");
            }
            sb.append("]");
            sendJson(exchange, 200, sb.toString());
        };
    }

    public HttpHandler routeHandler() {
        return exchange -> {
            addCors(exchange);
            if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            Map<String, String> params = parseQuery(exchange.getRequestURI());
            String src = params.getOrDefault("src", "");
            String dest = params.getOrDefault("dest", "");

            if (src.isEmpty() || dest.isEmpty()) {
                sendJson(exchange, 400, "{\"error\":\"Missing src or dest\"}");
                return;
            }

            RouteResponse result = dijkstra.findShortestPath(graph, src, dest);

            if (result.distance == -1) {
                sendJson(exchange, 404, "{\"error\":\"No path found\"}");
                return;
            }

            StringBuilder pathArr = new StringBuilder("[");
            for (int i = 0; i < result.path.size(); i++) {
                pathArr.append("\"").append(result.path.get(i)).append("\"");
                if (i < result.path.size() - 1) pathArr.append(",");
            }
            pathArr.append("]");

            String json = "{\"path\":" + pathArr + ",\"distance\":" + result.distance + "}";
            sendJson(exchange, 200, json);
        };
    }

    private void addCors(HttpExchange exchange) {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET,OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
    }

    private void sendJson(HttpExchange exchange, int code, String body) throws IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(code, bytes.length);
        exchange.getResponseBody().write(bytes);
        exchange.getResponseBody().close();
    }

    private Map<String, String> parseQuery(URI uri) throws UnsupportedEncodingException {
        Map<String, String> map = new HashMap<>();
        String query = uri.getRawQuery();
        if (query == null) return map;
        for (String pair : query.split("&")) {
            String[] kv = pair.split("=", 2);
            if (kv.length == 2) {
                map.put(java.net.URLDecoder.decode(kv[0], "UTF-8"),
                        java.net.URLDecoder.decode(kv[1], "UTF-8"));
            }
        }
        return map;
    }
}