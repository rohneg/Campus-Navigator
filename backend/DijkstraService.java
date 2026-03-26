import java.util.*;

public class DijkstraService {

    public RouteResponse findShortestPath(Graph graph, String src, String dest) {
        Map<String, Integer> dist = new HashMap<>();
        Map<String, String> prev = new HashMap<>();
        PriorityQueue<String> pq = new PriorityQueue<>(Comparator.comparingInt(dist::get));

        for (String node : graph.getNodes()) {
            dist.put(node, Integer.MAX_VALUE);
        }
        dist.put(src, 0);
        pq.add(src);

        while (!pq.isEmpty()) {
            String curr = pq.poll();
            if (curr.equals(dest)) break;

            for (Edge e : graph.getNeighbors(curr)) {
                int newDist = dist.get(curr) + e.weight;
                if (newDist < dist.get(e.to)) {
                    dist.put(e.to, newDist);
                    prev.put(e.to, curr);
                    pq.add(e.to);
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