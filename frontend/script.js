const sourceSelect = document.getElementById("source");
const destinationSelect = document.getElementById("destination");
const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

const BASE = "http://localhost:8080";

const positions = {
    "Gate 1": { x: 300, y: 100 },
    "CSIT": { x: 120, y: 140 },
    "SJ": { x: 420, y: 80 },
    "Hill Campus": { x: 550, y: 160 },
    "Audi": { x: 300, y: 250 },
    "Stadium": { x: 180, y: 320 },
    "Badminton Academy": { x: 220, y: 420 },
    "CE Block": { x: 300, y: 460 },
    "Basketball Court": { x: 380, y: 460 },
    "Old MBA Block": { x: 440, y: 400 },
    "Param Lab": { x: 380, y: 320 },
    "XP Block": { x: 500, y: 320 },
    "HG Block": { x: 550, y: 250 },
    "Gate 2": { x: 600, y: 420 }
};

const edges = [
    ["Gate 1","CSIT",60],
    ["Gate 1","SJ",50],
    ["SJ","Hill Campus",70],
    ["Gate 1","Audi",80],
    ["CSIT","Audi",60],
    ["Audi","Stadium",40],
    ["Stadium","Badminton Academy",30],
    ["Badminton Academy","CE Block",35],
    ["CE Block","Basketball Court",20],
    ["Basketball Court","Old MBA Block",25],
    ["Old MBA Block","Param Lab",30],
    ["Param Lab","CE Block",35],
    ["Param Lab","XP Block",40],
    ["XP Block","HG Block",30],
    ["HG Block","Audi",50],
    ["XP Block","Gate 2",60]
];

const eventNames = [
    "Tech Fest", "Coding Contest", "Workshop", "Seminar",
    "Sports Meet", "Hackathon", "Cultural Fest", "Guest Lecture"
];

const handlers = [
    "Rohit", "Aman", "Priya", "Karan",
    "Neha", "Arjun", "Simran", "Vikas"
];

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomInfo() {
    return {
        event: getRandom(eventNames),
        handler: getRandom(handlers),
        contact: "9" + Math.floor(100000000 + Math.random() * 900000000)
    };
}

const nodeInfo = {
    "Audi": { event: "Tech Fest", handler: "Rohit", contact: "9876543210" },
    "CSIT": { event: "Coding Contest", handler: "Aman", contact: "9123456780" }
};

function assignEventsToAllNodes() {
    Object.keys(positions).forEach(node => {
        if (!nodeInfo[node]) {
            nodeInfo[node] = generateRandomInfo();
        }
    });
}

let currentPath = [];
let currentSource = "";
let currentDestination = "";

document.getElementById("findBtn").addEventListener("click", findRoute);
loadLocations();

async function loadLocations() {
    const res = await fetch(BASE + "/api/nodes");
    const data = await res.json();

    data.forEach(n => {
        let o1 = document.createElement("option");
        o1.value = n;
        o1.textContent = n;

        let o2 = document.createElement("option");
        o2.value = n;
        o2.textContent = n;

        sourceSelect.appendChild(o1);
        destinationSelect.appendChild(o2);
    });

    assignEventsToAllNodes();

    currentSource = sourceSelect.value;
    currentDestination = destinationSelect.value;
    drawGraph();
}

async function findRoute() {
    let s = sourceSelect.value;
    let d = destinationSelect.value;

    if (s === d) {
        alert("Same node selected");
        return;
    }

    currentSource = s;
    currentDestination = d;

    document.getElementById("path").textContent = "Loading...";
    document.getElementById("distance").textContent = "...";

    const res = await fetch(`${BASE}/api/route?src=${encodeURIComponent(s)}&dest=${encodeURIComponent(d)}`);

    if (!res.ok) {
        alert("Error fetching route");
        return;
    }

    const data = await res.json();

    document.getElementById("path").textContent = data.path.join(" → ");
    document.getElementById("distance").textContent = data.distance + " m";

    currentPath = data.path;
    drawGraph();
}

function drawGraph() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawEdges();
    drawNodes();
}

function drawEdges() {
    edges.forEach(([a,b]) => {
        const p1 = positions[a];
        const p2 = positions[b];

        let highlight = isPathEdge(a,b);

        ctx.beginPath();
        ctx.moveTo(p1.x,p1.y);
        ctx.lineTo(p2.x,p2.y);
        ctx.strokeStyle = highlight ? "#c97b63" : "#ccc";
        ctx.lineWidth = highlight ? 5 : 2;
        ctx.stroke();
    });
}

function drawNodes() {
    Object.keys(positions).forEach(n => {
        let p = positions[n];

        ctx.beginPath();
        ctx.arc(p.x,p.y,12,0,Math.PI*2);

        if (n === currentSource) ctx.fillStyle = "orange";
        else if (n === currentDestination) ctx.fillStyle = "green";
        else if (currentPath.includes(n)) ctx.fillStyle = "#d8c6b6";
        else ctx.fillStyle = "#999";

        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "black";
        ctx.fillText(n,p.x,p.y-18);
    });
}

function isPathEdge(a,b) {
    for(let i=0;i<currentPath.length-1;i++){
        if((currentPath[i]===a && currentPath[i+1]===b) ||
           (currentPath[i]===b && currentPath[i+1]===a)){
            return true;
        }
    }
    return false;
}

canvas.addEventListener("click", function(e){
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let n of Object.keys(positions)) {
        let p = positions[n];
        let d = Math.sqrt((x - p.x) ** 2 + (y - p.y) ** 2);

        if (d < 12) {
            showPopup(n);
            return;
        }
    }
});

function showPopup(node){
    const popup = document.getElementById("popup");
    const info = nodeInfo[node];

    popup.innerHTML = `
        <div style="text-align:right; cursor:pointer;" onclick="closePopup()">✖</div>
        <b>${node}</b><br><br>
        Event: ${info.event}<br>
        Handler: ${info.handler}<br>
        Contact: ${info.contact}
    `;

    popup.classList.remove("hidden");
}

function closePopup(){
    document.getElementById("popup").classList.add("hidden");
}