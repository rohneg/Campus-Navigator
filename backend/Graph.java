import java.util.*;

public class Graph {
    private Map<String, List<Edge>> adj = new HashMap<>();

    public void addNode(String name) {
        adj.putIfAbsent(name, new ArrayList<>());
    }

    public void addEdge(String a, String b, int w) {
        adj.get(a).add(new Edge(b, w));
        adj.get(b).add(new Edge(a, w));
    }

    public List<Edge> getNeighbors(String node) {
        return adj.getOrDefault(node, new ArrayList<>());
    }

    public Set<String> getNodes() {
        return adj.keySet();
    }
}