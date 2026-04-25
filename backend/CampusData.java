public class CampusData {
    public static Graph buildGraph() {
        Graph g = new Graph();

        String[] nodes = {
            "Gate 1","CSIT","SJ","Hill Campus","Audi",
            "Stadium","Badminton Academy","CE Block",
            "Basketball Court","Old MBA Block","Param Lab",
            "XP Block","HG Block","Gate 2"
        };

        for (String n : nodes) g.addNode(n);

        g.addEdge("Gate 1","CSIT",60);
        g.addEdge("Gate 1","SJ",50);
        g.addEdge("SJ","Hill Campus",70);

        g.addEdge("Gate 1","Audi",80);
        g.addEdge("CSIT","Audi",60);

        g.addEdge("Audi","Stadium",40);
        g.addEdge("Stadium","Badminton Academy",30);
        g.addEdge("Badminton Academy","CE Block",35);

        g.addEdge("CE Block","Basketball Court",20);
        g.addEdge("Basketball Court","Old MAC Block",25);
        g.addEdge("Old MCA Block","Param Lab",30);
        g.addEdge("Param Lab","CE Block",35);

        g.addEdge("Param Lab","KP Block",40);
        g.addEdge("KP Block","ME Block",30);
        g.addEdge("ME Block","Audi",50);

        g.addEdge("KP Block","Gate 2",60);

        return g;
    }
}