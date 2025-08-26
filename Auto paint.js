// ==UserScript==
// @name         Alejandro Juega - W Place Blue Marble
// @namespace    http://yourdomain.com/
// @version      1.1
// @description  W Place AI estilo Blue Marble solo en wplace.live
// @author       Tu Nombre
// @match        https://wplace.live/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // --- Evitar duplicados si se recarga la página ---
    if(document.getElementById('wgCanvas')) return;

    // --- Crear CSS ---
    const style = document.createElement('style');
    style.textContent = `
    #wgCanvas {
        position: fixed; top:0; left:0; z-index:9990;
        pointer-events:none; /* permite interactuar con la página */
    }
    #wgOverlay {
        position: fixed; top:10px; left:10px;
        background: rgba(0,0,50,0.85);
        padding: 15px; border:3px solid #00ffcc; border-radius:12px;
        z-index:9999;
        font-family: 'Courier New', monospace;
    }
    #wgOverlay h1 { font-size:1.5em; color:#00ffcc; margin:5px; text-shadow:0 0 5px #00ffcc; }
    #wgOverlay button {
        display:block; width:150px; margin:5px 0; padding:8px;
        background: rgba(0,31,77,0.7); color:#00ffcc; border:2px solid #00ffcc; border-radius:8px;
        cursor:pointer; font-size:1em; text-shadow:0 0 3px #00ffcc;
    }
    #wgOverlay button:hover { background: rgba(0,51,102,0.8); }
    #wgOverlay input {
        width:100px; margin:3px 0; padding:5px;
        border:1px solid #00ffcc; border-radius:5px;
        background: rgba(0,15,42,0.8); color:#00ffcc;
    }
    `;
    document.head.appendChild(style);

    // --- Crear Canvas ---
    const canvas = document.createElement('canvas');
    canvas.id = 'wgCanvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    function resizeCanvas(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // --- Crear UI Overlay ---
    const overlay = document.createElement('div');
    overlay.id = 'wgOverlay';
    overlay.innerHTML = `
        <h1>Alejandro Juega</h1>
        <button id="wgUploadTemplateBtn">Upload Template Page</button>
        <input type="file" id="wgUploadImage" accept="image/*">
        <label for="wgUploadImage">Upload Image</label>
        <div>
            <input type="number" id="wgXCoord" placeholder="X">
            <input type="number" id="wgYCoord" placeholder="Y">
        </div>
        <button id="wgStartBtn">Start</button>
        <button id="wgHideBtn">Hide UI</button>
        <button id="wgShowBtn">Show UI</button>
    `;
    document.body.appendChild(overlay);

    const wgOverlay=document.getElementById('wgOverlay');
    const wgUploadTemplateBtn=document.getElementById('wgUploadTemplateBtn');
    const wgUploadImage=document.getElementById('wgUploadImage');
    const wgStartBtn=document.getElementById('wgStartBtn');
    const wgHideBtn=document.getElementById('wgHideBtn');
    const wgShowBtn=document.getElementById('wgShowBtn');

    wgHideBtn.addEventListener('click', ()=> wgOverlay.style.display='none');
    wgShowBtn.addEventListener('click', ()=> wgOverlay.style.display='block');

    wgUploadTemplateBtn.addEventListener('click', ()=> {
        window.open('https://pepoafonso.github.io/color%20converter/wplace/','_blank');
    });

    // --- Manejo de templates ---
    let templates=[];
    wgUploadImage.addEventListener('change', e=>{
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
    wgStartBtn.addEventListener('click', ()=>{
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
