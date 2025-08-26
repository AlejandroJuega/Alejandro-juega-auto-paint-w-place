<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Alejandro Juega - W Place Blue Marble</title>
<style>
body {
    margin: 0;
    font-family: 'Courier New', monospace;
    background: radial-gradient(circle at 30% 30%, #0a1f4d, #001133);
    background-blend-mode: overlay;
    overflow: hidden;
    height: 100vh;
    color: #00ffcc;
}

canvas {
    position: absolute; top:0; left:0; z-index:0;
}

#uiOverlay {
    position: fixed; top:0; left:0;
    width:100%; height:100%;
    background: rgba(0,0,50,0.85);
    display:flex; flex-direction:column; align-items:center; justify-content:flex-start;
    padding-top:50px;
    z-index:10;
    border: 5px solid #00ffcc;
    border-radius: 15px;
}

#uiContainer {
    display:flex; flex-direction:column; align-items:center;
}

h1 {
    font-size:3em; margin-bottom:40px;
    text-shadow: 0 0 10px #00ffcc;
}

button {
    display:block; width:200px; margin:10px auto; padding:15px; font-size:1.2em;
    cursor:pointer; background-color: rgba(0,31,77,0.7);
    color:#00ffcc; border:2px solid #00ffcc; border-radius:12px;
    transition:0.3s;
    text-shadow: 0 0 5px #00ffcc;
}

button:hover{ background-color: rgba(0,51,102,0.8); }

input {
    padding:10px; margin:10px; width:150px; border-radius:8px;
    border:1px solid #00ffcc; background-color: rgba(0,15,42,0.8); color:#00ffcc;
}

#toggleButtons {
    position: fixed; top:10px; right:10px; display:flex; flex-direction:column; gap:5px; z-index:20;
}
</style>
</head>
<body>

<div id="toggleButtons">
    <button id="hideBtn">Hide UI</button>
    <button id="showBtn">Show UI</button>
</div>

<div id="uiOverlay">
    <div id="uiContainer">
        <h1>Alejandro Juega</h1>

        <button onclick="window.location.href='https://pepoafonso.github.io/color%20converter/wplace/'">
            Upload Template
        </button>

        <input type="file" id="uploadImage" accept="image/*" style="margin-top:20px;">
        <label for="uploadImage" style="cursor:pointer;">Upload Image</label>

        <div style="margin-top:30px;">
            <input type="number" id="xCoord" placeholder="Coordenada X">
            <input type="number" id="yCoord" placeholder="Coordenada Y">
        </div>

        <button id="startBtn">Start</button>
    </div>
</div>

<canvas id="drawingCanvas"></canvas>

<script>
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
window.addEventListener('resize', resizeCanvas); resizeCanvas();

const uiOverlay=document.getElementById('uiOverlay');
document.getElementById('hideBtn').addEventListener('click', ()=> uiOverlay.style.display='none');
document.getElementById('showBtn').addEventListener('click', ()=> uiOverlay.style.display='flex');

const uploadImage=document.getElementById('uploadImage');
let templates=[];

uploadImage.addEventListener('change', e=>{
    const file=e.target.files[0];
    if(file){
        const img=new Image();
        img.onload=()=> templates.push(img);
        img.src=URL.createObjectURL(file);
    }
});

function drawPixel(x,y,size,color){
    ctx.fillStyle=color;
    ctx.fillRect(x,y,size,size);
}

startBtn.addEventListener('click', ()=>{
    if(templates.length===0){ alert("Sube al menos un template"); return; }

    const startX=parseInt(document.getElementById('xCoord').value);
    const startY=parseInt(document.getElementById('yCoord').value);
    if(isNaN(startX)||isNaN(startY)){ alert("Introduce coordenadas válidas"); return; }

    const pixelSize=5;
    templates.forEach(template=>{
        const tempCanvas=document.createElement('canvas');
        const tempCtx=tempCanvas.getContext('2d');
        tempCanvas.width=template.width;
        tempCanvas.height=template.height;
        tempCtx.drawImage(template,0,0);
        const imgData=tempCtx.getImageData(0,0,template.width,template.height).data;

        let row=0; let col=0;
        const interval=setInterval(()=>{
            if(row>=template.height){ clearInterval(interval); return; }
            const index=(row*template.width+col)*4;
            const r=imgData[index], g=imgData[index+1], b=imgData[index+2], a=imgData[index+3];
            if(a>0) drawPixel(startX+col*pixelSize, startY+row*pixelSize, pixelSize, `rgba(${r},${g},${b},${a/255})`);
            col++; if(col>=template.width){ col=0; row++; }
        }, 5);
    });
});
</script>

</body>
</html>
