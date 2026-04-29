const sourceSelect = document.getElementById("source");
const destinationSelect = document.getElementById("destination");
const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");
const BASE = "http://localhost:8080";

const positions = {
    "Gate 1": { x: 420, y: 120 },
    "CSIT": { x: 220, y: 150 },
    "Silver Jubilee": { x: 520, y: 80 },
    "Hill Campus": { x: 680, y: 160 },
    "Audi": { x: 420, y: 260 },
    "3 Statue": { x: 260, y: 320 },
    "Happiness Canteen": { x: 160, y: 360 },
    "Ravi Canteen": { x: 120, y: 420 },
    "Badminton Academy": { x: 300, y: 420 },
    "CE Block": { x: 360, y: 470 },
    "Basketball Court": { x: 440, y: 470 },
    "MCA Block": { x: 520, y: 440 },
    "Param Lab": { x: 460, y: 360 },
    "KP Block": { x: 580, y: 360 },
    "ME Block": { x: 640, y: 260 },
    "Gate 2": { x: 720, y: 440 }
};

const edges = [
    ["Gate 1","CSIT",60],["Gate 1","Silver Jubilee",50],["Silver Jubilee","Hill Campus",70],
    ["Gate 1","Audi",80],["CSIT","Audi",60],
    ["Audi","3 Statue",40],["Audi","Param Lab",45],
    ["3 Statue","Happiness Canteen",30],
    ["Happiness Canteen","Ravi Canteen",25],
    ["Ravi Canteen","Badminton Academy",30],
    ["3 Statue","Badminton Academy",30],
    ["Badminton Academy","CE Block",35],
    ["CE Block","Basketball Court",20],
    ["Basketball Court","MCA Block",25],
    ["MCA Block","Param Lab",30],
    ["Param Lab","CE Block",35],
    ["Param Lab","KP Block",40],
    ["KP Block","ME Block",30],
    ["ME Block","Audi",50],
    ["KP Block","Gate 2",60]
];

const coords = {
  "Gate 1": "30.268687324580085,77.9947392198363",
  "CSIT": "30.268461239036643,77.99370174426723",
  "Silver Jubilee": "30.269453695411233,77.99516653148764",
  "Hill Campus": "30.27290961322626,78.00051734547755",
  "Audi": "30.267577702504873,77.99508117144181",
  "3 Statue": "30.267331340485025,77.99471756147791",
  "Happiness Canteen": "30.267240707308165,77.99469018635813",
  "Ravi Canteen": "30.26731754848523,77.9945464669791",
  "Badminton Academy": "30.26686864142008,77.99506548915728",
  "CE Block": "30.26679475533619,77.99552288178413",
  "Basketball Court": "30.267059759835604,77.99602361833293",
  "MCA Block": "30.267488204735248,77.99655152218656",
  "Param Lab": "30.267416393494244,77.99605623573407",
  "KP Block": "30.268050134215386,77.99668085073843",
  "ME Block": "30.268102840903875,77.9962265463984",
  "Gate 2": "30.268682612562518,77.9978227141791"
};

const nodeInfo = {};
const events = ["Tech Fest","Workshop","Seminar","Hackathon"];
const handlers = ["Rohit","Anirudh","Siddharth","Saif"];

function assignEvents() {
    Object.keys(positions).forEach(n => {
        nodeInfo[n] = {
            event: events[Math.floor(Math.random()*events.length)],
            handler: handlers[Math.floor(Math.random()*handlers.length)],
            contact: "9" + Math.floor(100000000 + Math.random()*900000000)
        };
    });
}

let currentPath = [];

document.getElementById("findBtn").addEventListener("click", findRoute);
loadLocations();

async function loadLocations() {
    const res = await fetch(BASE + "/api/nodes");
    const data = await res.json();

    data.forEach(n => {
        sourceSelect.add(new Option(n,n));
        destinationSelect.add(new Option(n,n));
    });

    assignEvents();
    drawGraph();
}

async function findRoute() {
    const s = sourceSelect.value;
    const d = destinationSelect.value;

    if (s === d) return alert("Same node");

    const res = await fetch(`${BASE}/api/route?src=${s}&dest=${d}`);
    const data = await res.json();

    document.getElementById("path").textContent = data.path.join(" → ");
    document.getElementById("distance").textContent = data.distance + " m";

    currentPath = data.path;
    drawGraph();
}

function drawGraph() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    edges.forEach(([a,b]) => {
        const p1 = positions[a];
        const p2 = positions[b];

        ctx.beginPath();
        ctx.moveTo(p1.x,p1.y);
        ctx.lineTo(p2.x,p2.y);
        ctx.strokeStyle = isPathEdge(a,b) ? "#c97b63" : "#ccc";
        ctx.lineWidth = isPathEdge(a,b) ? 5 : 2;
        ctx.stroke();
    });

    Object.keys(positions).forEach(n => {
        const p = positions[n];
        ctx.beginPath();
        ctx.arc(p.x,p.y,12,0,Math.PI*2);
        ctx.fillStyle = currentPath.includes(n) ? "#d8c6b6" : "#999";
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.fillText(n,p.x-20,p.y-15);
    });
}

function isPathEdge(a,b){
    return currentPath.some((v,i) =>
        i < currentPath.length-1 &&
        ((v===a && currentPath[i+1]===b) || (v===b && currentPath[i+1]===a))
    );
}

canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left)*(canvas.width/rect.width);
    const y = (e.clientY - rect.top)*(canvas.height/rect.height);

    for (let n in positions) {
        const p = positions[n];
        if (Math.hypot(x-p.x,y-p.y) < 12) {
            showPopup(n,e.clientX-rect.left,e.clientY-rect.top);
            return;
        }
    }
    closePopup();
});

canvas.addEventListener("mouseleave", closePopup);

canvas.addEventListener("dblclick", e => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left)*(canvas.width/rect.width);
    const y = (e.clientY - rect.top)*(canvas.height/rect.height);

    for (let n in positions) {
        const p = positions[n];
        if (Math.hypot(x-p.x,y-p.y) < 12) {
            openMap(n);
            return;
        }
    }
});

function showPopup(node,x,y){
    const p = document.getElementById("popup");
    const i = nodeInfo[node];

    p.innerHTML = `<b>${node}</b><br>
    Event: ${i.event}<br>
    Handler: ${i.handler}<br>
    Contact: ${i.contact}`;

    p.style.left = x + 15 + "px";
    p.style.top = y - 70 + "px";
    p.classList.remove("hidden");
}

function closePopup(){
    document.getElementById("popup").classList.add("hidden");
}

function openMap(node){
    const c = coords[node];
    if (!c) return;
    window.open("https://www.google.com/maps?q=" + c, "_blank");
}