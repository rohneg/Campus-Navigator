public class CampusData {
    public static Graph buildGraph() {
        Graph g = new Graph();

        g.addNode("Gate 1");
        g.addNode("Gate 2");
        g.addNode("Auditorium");
        g.addNode("ME Block");
        g.addNode("CE Block");
        g.addNode("CSIT");
        g.addNode("Param Lab");
        g.addNode("Happiness Canteen");

        g.addEdge("Gate 1", "CSIT", 60);
        g.addEdge("Gate 1", "Auditorium", 110);
        g.addEdge("CSIT", "Auditorium", 50);

        g.addEdge("Auditorium", "ME Block", 70);
        g.addEdge("Auditorium", "Param Lab", 65);
        g.addEdge("Auditorium", "CE Block", 80);
        g.addEdge("Auditorium", "Happiness Canteen", 55);
        

        g.addEdge("Param Lab", "CE Block", 35);
        g.addEdge("CE Block", "Happiness Canteen", 45);
        g.addEdge("Param Lab", "ME Block", 40);

        g.addEdge("Gate 2", "Param Lab", 50);
        g.addEdge("Gate 2", "ME Block", 90);

        return g;
    }
}