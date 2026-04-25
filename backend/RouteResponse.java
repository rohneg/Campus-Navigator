import java.util.List;

public class RouteResponse {
    public final List<String> path;
    public final int distance;

    public RouteResponse(List<String> path, int distance) {
        this.path = path;
        this.distance = distance;
    }
}