const sourceSelect = document.getElementById("source");
const destinationSelect = document.getElementById("destination");
const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

const positions = {
    "Gate 1": { x: 140, y: 110 },
    "CSIT": { x: 270, y: 190 },
    "Auditorium": { x: 380, y: 300 },
    "ME Block": { x: 660, y: 170 },
    "Param Lab": { x: 610, y: 290 },
    "CE Block": { x: 530, y: 410 },
    "Gate 2": { x: 770, y: 300 },
    "Happiness Canteen": { x: 320, y: 470 }
};

const edges = [
    ["Gate 1", "CSIT", 60],
    ["Gate 1", "Auditorium", 110],
    ["CSIT", "Auditorium", 50],

    ["Auditorium", "ME Block", 70],
    ["Auditorium", "Param Lab", 65],
    ["Auditorium", "CE Block", 80],
    ["Auditorium", "Happiness Canteen", 55],

    ["Param Lab", "CE Block", 35],
    ["CE Block", "Happiness Canteen", 45],
    ["Param Lab", "ME Block", 40],

    ["Gate 2", "Param Lab", 50],
    ["Gate 2", "ME Block", 90]
];

let currentPath = [];
let currentSource = "";
let currentDestination = "";

async function loadLocations() {
    const res = await fetch("http://localhost:8080/api/nodes");
    const locations = await res.json();

    sourceSelect.innerHTML = "";
    destinationSelect.innerHTML = "";

    locations.forEach(location => {
        const option1 = document.createElement("option");
        option1.value = location;
        option1.textContent = location;

        const option2 = document.createElement("option");
        option2.value = location;
        option2.textContent = location;

        sourceSelect.appendChild(option1);
        destinationSelect.appendChild(option2);
    });

    currentSource = sourceSelect.value;
    currentDestination = destinationSelect.value;
    drawGraph();
}

async function findRoute() {
    const source = sourceSelect.value;
    const destination = destinationSelect.value;

    currentSource = source;
    currentDestination = destination;

    if (source === destination) {
        alert("Source and destination cannot be the same.");
        return;
    }

    const res = await fetch(`http://localhost:8080/api/route?src=${encodeURIComponent(source)}&dest=${encodeURIComponent(destination)}`);
    const data = await res.json();

    document.getElementById("path").textContent = data.path.join(" → ");
    document.getElementById("distance").textContent = data.distance + " meters";

    currentPath = data.path;
    drawGraph();
}

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawEdges();
    drawNodes();
}

function drawEdges() {
    edges.forEach(([from, to, dist]) => {
        const a = positions[from];
        const b = positions[to];
        const highlighted = isPathEdge(from, to);

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = highlighted ? "#c97b63" : "#d9cec2";
        ctx.lineWidth = highlighted ? 6 : 2;
        ctx.stroke();

        if (highlighted) {
            const midX = (a.x + b.x) / 2;
            const midY = (a.y + b.y) / 2;

            ctx.fillStyle = "#fffaf4";
            ctx.beginPath();
            ctx.roundRect(midX - 28, midY - 16, 56, 24, 8);
            ctx.fill();

            ctx.strokeStyle = "#e2d4c4";
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = "#6b5245";
            ctx.font = "bold 12px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(dist + "m", midX, midY);
        }
    });
}

function drawNodes() {
    Object.keys(positions).forEach(node => {
        const { x, y } = positions[node];
        const isInPath = currentPath.includes(node);
        const isSource = node === currentSource;
        const isDestination = node === currentDestination;

        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);

        if (isSource) {
            ctx.fillStyle = "#d28a71";
        } else if (isDestination) {
            ctx.fillStyle = "#8fa68b";
        } else if (isInPath) {
            ctx.fillStyle = "#d8c6b6";
        } else {
            ctx.fillStyle = "#b89f8d";
        }

        ctx.fill();
        ctx.strokeStyle = "#5c4033";
        ctx.lineWidth = 2;
        ctx.stroke();

        drawNodeLabel(node, x, y);
    });
}

function drawNodeLabel(node, x, y) {
    ctx.fillStyle = "#3f2d26";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const offsets = {
        "Gate 1": { x: 0, y: -28 },
        "CSIT": { x: 42, y: 0 },
        "Auditorium": { x: 0, y: -32 },
        "ME Block": { x: 0, y: -30 },
        "Param Lab": { x: 0, y: -30 },
        "CE Block": { x: 0, y: 30 },
        "Gate 2": { x: 0, y: -30 },
        "Happiness Canteen": { x: 0, y: 32 }
    };

    const offset = offsets[node] || { x: 0, y: -28 };
    ctx.fillText(node, x + offset.x, y + offset.y);
}

function isPathEdge(from, to) {
    for (let i = 0; i < currentPath.length - 1; i++) {
        const a = currentPath[i];
        const b = currentPath[i + 1];

        if ((a === from && b === to) || (a === to && b === from)) {
            return true;
        }
    }
    return false;
}

loadLocations();