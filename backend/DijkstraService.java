import java.util.*;

public class DijkstraService {

    static class Pair {
        String node;
        int dist;
        Pair(String n, int d) { node = n; dist = d; }
    }

    public RouteResponse findShortestPath(Graph graph, String src, String dest) {

        if (!graph.getNodes().contains(src) || !graph.getNodes().contains(dest)) {
            return new RouteResponse(Collections.emptyList(), -1);
        }

        Map<String, Integer> dist = new HashMap<>();
        Map<String, String> prev = new HashMap<>();

        for (String node : graph.getNodes()) {
            dist.put(node, Integer.MAX_VALUE);
        }

        PriorityQueue<Pair> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a.dist));

        dist.put(src, 0);
        pq.add(new Pair(src, 0));

        while (!pq.isEmpty()) {
            Pair curr = pq.poll();

            if (curr.node.equals(dest)) break;

            for (Edge e : graph.getNeighbors(curr.node)) {
                int newDist = dist.get(curr.node) + e.weight;

                if (newDist < dist.get(e.to)) {
                    dist.put(e.to, newDist);
                    prev.put(e.to, curr.node);
                    pq.add(new Pair(e.to, newDist));
                }
            }
        }

        List<String> path = new ArrayList<>();
        String curr = dest;

        while (curr != null) {
            path.add(0, curr);
            curr = prev.get(curr);
        }

        if (path.isEmpty() || !path.get(0).equals(src)) {
            return new RouteResponse(Collections.emptyList(), -1);
        }

        return new RouteResponse(path, dist.get(dest));
    }
}