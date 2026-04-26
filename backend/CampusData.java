public class CampusData 
{
    public static Graph buildGraph() 
    {
        Graph g = new Graph();

        g.addNode("Gate 1");
        g.addNode("Gate 2");
        g.addNode("CSIT");
        g.addNode("SJ");
        g.addNode("Hill Campus");
        g.addNode("Audi");
        g.addNode("3 Statue");
        g.addNode("Happiness Canteen");
        g.addNode("Ravi Canteen");
        g.addNode("Badminton Academy");
        g.addNode("CE Block");
        g.addNode("Basketball Court");
        g.addNode("MCA Block");
        g.addNode("Param Lab");
        g.addNode("KP Block");
        g.addNode("ME Block");

        g.addEdge("Gate 1","CSIT",60);
        g.addEdge("Gate 1","SJ",50);
        g.addEdge("SJ","Hill Campus",70);
        g.addEdge("Gate 1","Audi",80);
        g.addEdge("CSIT","Audi",60);

        g.addEdge("Audi","3 Statue",40);
        g.addEdge("Audi","Param Lab",45);

        g.addEdge("3 Statue","Happiness Canteen",30);
        g.addEdge("Happiness Canteen","Ravi Canteen",25);
        g.addEdge("Ravi Canteen","Badminton Academy",30);

        g.addEdge("3 Statue","Badminton Academy",30);
        g.addEdge("Badminton Academy","CE Block",35);
        g.addEdge("CE Block","Basketball Court",20);
        g.addEdge("Basketball Court","MCA Block",25);
        g.addEdge("MCA Block","Param Lab",30);

        g.addEdge("Param Lab","CE Block",35);
        g.addEdge("Param Lab","KP Block",40);

        g.addEdge("KP Block","ME Block",30);
        g.addEdge("ME Block","Audi",50);

        g.addEdge("KP Block","Gate 2",60);

        return g;
    }
}