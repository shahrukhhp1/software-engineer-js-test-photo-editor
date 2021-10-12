/*
 * main.js - JavaScript file that is responsible for adding HTML content to body of document and functionality for image editing
 (limited features) on canvas.

* This is a test script that allows user to load image from system, which is opened in canvas and user can do following manipulation
with that image : 

1 - Move image using move button
2 - Resize image using resize button
3 - Save current image with its position and scaling (on local storage) by submit button
4 - Import saved image with its actual positioning and scaling by using import button
 
 */



import '../css/main.scss'
const io = require("./importExport")
const canv = require("../js/canvasBusiness")
const consants = require("../js/constants")

const AppView = () => {

//#region DOM elements initialized
    // grab DOM elements inside index.html
    const fileSelector = document.getElementById( "fileSelector" );
    const editorCanvas = document.getElementById( "editorCanvas" );
    const infoLabel = document.getElementById( "info" );
    const moveBtn = document.getElementById( "moveBtn" );
    const resizeBtn = document.getElementById( "resizeBtn" );
    const submitBtn = document.getElementById( "submitBtn" );
    const importBtn = document.getElementById( "importBtn" );
    const leftBtn = document.getElementById( "leftBtn" );
    const rightBtn = document.getElementById( "rightBtn" );
    const upBtn = document.getElementById( "upBtn" );
    const downBtn = document.getElementById( "downBtn" );
    const scaleUp = document.getElementById( "scaleUp" );
    const scaleDown = document.getElementById( "scaleDown" );


    const downloadBtn = document.getElementById( "downloadBtn" );
    const configUploader = document.getElementById( "configUploader" );

    const changeTxt = document.getElementById( "changeTxt" );
    const ctx = editorCanvas.getContext('2d');

//#endregion    

//#region variable region


// all variabls that are used in system in the scope of app view
    const img = new Image();
    const settings = { mouseDown : false , moveTool : true , resizeTool : false , lastX : 0, lastY : 0 ,
                         savedName : consants.savedConfigName , reset : true};
    const canvas = { 
        width: 0, height: 0,
        photo : {
            id:"",
            width:0,
            height :0,
            x:0,
            y:0,
            clipX:0,
            clipY:0,
            path:""
        }
    };

//#endregion

//#region event handlers
    fileSelector.onchange = function( e ) {
        // get all selected Files
        const files = e.target.files;
        let file;
        for ( let i = 0; i < files.length; ++i ) {
            settings.reset = true;
            file = files[ i ];
            // check if file is valid Image (just a MIME check)
            switch ( file.type ) {
                case "image/jpeg":
                case "image/png":
                case "image/gif":
                    // read Image contents from file
                    const reader = new FileReader();
                    reader.onload = function( e ) {
                        // create HTMLImageElement holding image data
                        
                        img.src = reader.result;
                        canvas.photo.path = img.src;                
                        
                    };
                    reader.readAsDataURL( file );
                    // process just one file.
                    return;

                default:
                    alert("Invalid file type");
            }
        }
    };

    configUploader.onchange = function(e){
        const files = e.target.files;
        let file;
        for ( let i = 0; i < files.length; ++i ) {
            settings.reset = false;
            file = files[ i ];
            // check if file is valid Image (just a MIME check)
            switch ( file.type ) {
                case "application/json":
                    // read Image contents from file
                    const reader = new FileReader();
                    reader.onload = function( e ) {
                        // create HTMLImageElement holding image data
                        reader.readAsText(file, "UTF-8");
                        reader.onload = function (evt) {
                            let retrievedObject = evt.target.result;

                            const savedInfo = JSON.parse(retrievedObject);    
                            canvas.width = savedInfo.width;
                            canvas.height = savedInfo.height;
                            canvas.photo = savedInfo.photo;
                            img.src = canvas.photo.path;
                        }
                    };
                    reader.readAsDataURL( file );
                    // process just one file.
                    return;

                default:
                    alert("Invalid file type");
            }
        }
    };

    

    img.onload = function() {
        // grab some data from the image
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        // set initial values of image and canvas
        editorCanvas.width = consants.canvasWidth;
        editorCanvas.height = consants.canvasWidth * height / width;
     
        // if new image is loaded set all the initial value
        // if saved images is loaded, this part wont run as all properties are already loaded from saved configuration
        if(settings.reset){
            canvas.height = height;
            canvas.width  = width;
            canvas.photo.width = width;
            canvas.photo.height = height;
            canvas.photo.x=0;
            canvas.photo.y=0;    
        }
        
        // call function to draw image
        canv.reDoImage(ctx, img , canvas);
        
    };


    
    downloadBtn.onclick = function(){
        io.createAndDownloadBlob(consants.jsonFileName,canvas);
    };


    leftBtn.onclick = function(){
        let change = parseInt(changeTxt.value);
        moveImage(canvas.photo.x - change,canvas.photo.y);
    };

    rightBtn.onclick = function(){
        let change = parseInt(changeTxt.value);
        moveImage(canvas.photo.x + change,canvas.photo.y);
    };

    
    upBtn.onclick = function(){
        let change = parseInt(changeTxt.value);
        moveImage(canvas.photo.x,canvas.photo.y - change);
    };

    downBtn.onclick = function(){
        let change = parseInt(changeTxt.value);
        moveImage(canvas.photo.x ,canvas.photo.y + change);
    };

    scaleUp.onclick = function(){
        let change = parseInt(changeTxt.value);
        reSizeImage(change,change);       
    };

    scaleDown.onclick = function(){
        let change = parseInt(changeTxt.value);
        reSizeImage(-change,-change);       
    };

    submitBtn.onclick = function(){
        saveConfiguration();
    };

    importBtn.onclick = function(){
        settings.reset = false;
        loadConfiguration();
        img.src = canvas.photo.path;        
    };

    // select a tool for image movement
    moveBtn.onclick = function(e){
        e.target.className= "active";
        resizeBtn.className = "";
        settings.moveTool = true;
        settings.resizeTool = false;
    };

    // select a tool for image resizing
    resizeBtn.onclick = function(e){
        e.target.className= "active";
        moveBtn.className = "";
        settings.resizeTool = true;
        settings.moveTool = false;
    };


    //set boolen true while mouse is moving and key is pressed
    editorCanvas.onmousedown = function() {
        settings.mouseDown = true;
    };

    //turn boolean false tool wont work if mouse key is not press
    editorCanvas.onmouseup = function() {
        settings.mouseDown = false;
        settings.lastX = 0;
        settings.lastY = 0;
    };

    
    editorCanvas.onmousemove =function(e) {
        // if key is pressed while mouse is moving over canvas
        if(settings.mouseDown){
            // calculate cursor coordinates reference to canvas position
            let x = e.clientX - editorCanvas.offsetLeft;
            let y = e.clientY - editorCanvas.offsetTop;
            let xDiff = x - settings.lastX;
            let yDiff = y - settings.lastY;
            
        
            if(settings.moveTool){    
                // if last points are not zero and mouse has moved, update position in json and call canvas to redraw image  
                if(settings.lastX !== 0 && settings.lastY !== 0 && settings.lastX !== x && settings.lastY !==y){
                    moveImage(xDiff,yDiff);
                } else {
                    // set x,y of last position of mouse , on movement of mouse every time this initial point is subtracted
                    // from new position to calculate movement
                    settings.lastX = x;
                    settings.lastY = y;
                }
                infoLabel.innerHTML = "Position : " + canvas.photo.x + " x " + canvas.photo.y;
            }
            else if(settings.resizeTool){
                // if last points are not zero and mouse has moved, update scaling in json and call canvas to redraw iage 
                if(settings.lastX !== 0 && settings.lastY !== 0 && settings.lastX !== x && settings.lastY !==y){
                    reSizeImage(xDiff,yDiff);       
                }
                // set x,y of last position of mouse for next use
                settings.lastX = x;
                settings.lastY = y;
                infoLabel.innerHTML = "Scale : " + canvas.photo.width + " x " + canvas.photo.height;                
            }
        }
    };

    function moveImage(xDiff,yDiff){
        canvas.photo.x = xDiff;
        canvas.photo.y = yDiff;
        canv.moveImage(canvas,editorCanvas,ctx,img);
    };

    function reSizeImage(xDiff,yDiff){
        canvas.photo.width += xDiff;    
        canvas.photo.height += yDiff;  
        canv.reSizeImage(canvas,editorCanvas,ctx,img);
    };

    
    function saveConfiguration() {
        io.writeLocal(settings.savedName,canvas);
    };

    function loadConfiguration(){
        const savedInfo = io.loadLocal(settings.savedName);
        
        canvas.width = savedInfo.width;
        canvas.height = savedInfo.height;
        canvas.photo = savedInfo.photo;
    };

//#endregion
}

// starting point of script and app
AppView();

