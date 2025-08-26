// ==UserScript==
// @name         Alejandro Juega - W Place Blue Marble
// @namespace    http://yourdomain.com/
// @version      1.0
// @description  Interfaz W Place AI estilo Blue Marble con dibujo automático
// @author       Tu Nombre
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // --- Crear CSS ---
    const style = document.createElement('style');
    style.textContent = `
    body {
        font-family: 'Courier New', monospace !important;
    }
    #wgCanvas {
        position: absolute; top:0; left:0; z-index:0;
    }
    #wgOverlay {
        position: fixed; top:0; left:0; width:100%; height:100%;
        background: rgba(0,0,50,0.85);
        display:flex; flex-direction:column; align-items:center; justify-content:flex-start;
        padding-top:50px;
        z-index:10000;
        border:5px solid #00ffcc;
        border-radius:15px;
    }
    #wgContainer { display:flex; flex-direction:column; align-items:center; }
    #wgContainer h1 { font-size:3em; margin-bottom:40px; text-shadow:0 0 10px #00ffcc; }
    #wgContainer button {
        display:block; width:200px; margin:10px auto; padding:15px; font-size:1.2em;
        cursor:pointer; background-color: rgba(0,31,77,0.7);
        color:#00ffcc; border:2px solid #00ffcc; border-radius:12px;
        transition:0.3s; text-shadow:0 0 5px #00ffcc;
    }
    #wgContainer button:hover { background-color: rgba(0,51,102,0.8); }
    #wgContainer input {
        padding:10px; margin:10px; width:150px; border-radius:8px;
        border:1px solid #00ffcc; background-color: rgba(0,15,42,0.8); color:#00ffcc;
    }
    #wgToggleButtons {
        position: fixed; top:10px; right:10px; display:flex; flex-direction:column; gap:5px; z-index:10001;
    }
    `;
    document.head.appendChild(style);

    // --- Crear Canvas ---
    const canvas = document.createElement('canvas');
    canvas.id = 'wgCanvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function resizeCanvas(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
    window.addEventListener('resize', resizeCanvas); resizeCanvas();

    // --- Crear UI Overlay ---
    const overlay = document.createElement('div');
    overlay.id = 'wgOverlay';
    overlay.innerHTML = `
        <div id="wgContainer">
            <h1>Alejandro Juega</h1>
            <button id="wgUploadTemplateBtn">Upload Template Page</button>
            <input type="file" id="wgUploadImage" accept="image/*">
            <label for="wgUploadImage" style="cursor:pointer;">Upload Image</label>
            <div style="margin-top:30px;">
                <input type="number" id="wgXCoord" placeholder="Coordenada X">
                <input type="number" id="wgYCoord" placeholder="Coordenada Y">
            </div>
            <button id="wgStartBtn">Start</button>
        </div>
    `;
    document.body.appendChild(overlay);

    // --- Crear Botones de Toggle ---
    const toggleDiv = document.createElement('div');
    toggleDiv.id = 'wgToggleButtons';
    toggleDiv.innerHTML = `
        <button id="wgHideBtn">Hide UI</button>
        <button id="wgShowBtn">Show UI</button>
    `;
    document.body.appendChild(toggleDiv);

    // --- Funciones de Toggle ---
    document.getElementById('wgHideBtn').addEventListener('click', ()=> overlay.style.display='none');
    document.getElementById('wgShowBtn').addEventListener('click', ()=> overlay.style.display='flex');

    // --- Abrir template page ---
    document.getElementById('wgUploadTemplateBtn').addEventListener('click', ()=>{
        window.open('https://pepoafonso.github.io/color%20converter/wplace/','_blank');
    });

    // --- Manejo de imágenes ---
    let templates=[];
    document.getElementById('wgUploadImage').addEventListener('change', e=>{
        const file=e.target.files[0];
        if(file){
            const img=new Image();
            img.onload=()=> templates.push(img);
            img.src=URL.createObjectURL(file);
        }
    });

    // --- Dibujar píxel ---
    function drawPixel(x,y,size,color){
        ctx.fillStyle=color;
        ctx.fillRect(x,y,size,size);
    }

    // --- Dibujo automático ---
    document.getElementById('wgStartBtn').addEventListener('click', ()=>{
        if(templates.length===0){ alert("Sube al menos un template"); return; }

        const startX=parseInt(document.getElementById('wgXCoord').value);
        const startY=parseInt(document.getElementById('wgYCoord').value);
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

})();
