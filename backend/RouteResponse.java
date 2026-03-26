import java.util.List;

public class RouteResponse {
    public List<String> path;
    public int distance;

    public RouteResponse(List<String> path, int distance) {
        this.path = path;
        this.distance = distance;
    }
}