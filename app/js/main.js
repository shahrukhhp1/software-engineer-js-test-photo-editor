/*
 * main.js - JavaScript file that is responsible for adding HTML content to body of document and functionality for image editing
 (limited features) on canvas.

* This is a test script that allows user to load image from system, which is opened in canvas and user can do following manipulation
with that image : 

1 - Move image using move button
2 - Resize image using resize button
3 - Save current image with its position and scaling (on local storage) by submit button
4 - Reload saved image with its actual positioning and scaling by using import button
 
 */



import '../css/main.scss'

const AppView = () => {
    document.body.innerHTML = `<h1>Simple Example</h1>
        <form action="#">
            <fieldset>
                <label for="fileSelector">Select an Image file</label>
                <input type="file" id="fileSelector" />
                <fieldset>
                    <label>Tools</label>
                    <button id="moveBtn">Move</button>
                    <button id="resizeBtn">Re-Size</button>
                </fieldset>
                <fieldset>
                    <label>Save/Export</label>
                    <button id="submitBtn">Submit</button>
                    <button id="reloadBtn">Import</button>
                </fieldset>
                <label id="info">-</label>
            </fieldset>
        </form>

        <canvas id="editorCanvas"></canvas>`;

    // grab DOM elements inside index.html
    const fileSelector = document.getElementById( "fileSelector" );
    const editorCanvas = document.getElementById( "editorCanvas" );
    const infoLabel = document.getElementById( "info" );
    const moveBtn = document.getElementById( "moveBtn" );
    const resizeBtn = document.getElementById( "resizeBtn" );
    const submitBtn = document.getElementById( "submitBtn" );
    const reloadBtn = document.getElementById( "reloadBtn" );
    const ctx = editorCanvas.getContext('2d');
    

    // variables' declaration
    const img = new Image();
    const settings = { mouseDown : false , moveTool : true , resizeTool : false , lastX : 0, lastY : 0 ,
                         savedName : "canvasConfig", reset : true};
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


    img.onload = function() {
        // grab some data from the image
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        // set initial values of image and canvas
        editorCanvas.width = 500;
        editorCanvas.height = 500 * height / width;
     
        if(settings.reset){
            canvas.height = editorCanvas.height;
            canvas.width  = editorCanvas.width;
            canvas.photo.width = width;
            canvas.photo.height = height;
            canvas.photo.x=0;
            canvas.photo.y=0;    
        }
        
        // call function to draw image
        reDoImage();             
    };

    submitBtn.onclick = function(){
        saveConfiguration();
    };

    reloadBtn.onclick = function(){
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

    //turn boolean false tool wont work if mouse key is not press
    editorCanvas.onmousedown = function() {
        settings.mouseDown = true;
    };

    //set boolen true while mouse is moving and key is pressed
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
            
            
        
            if(settings.moveTool){    
                // update position in json and call canvas to redraw iage 
                if(settings.lastX == settings.lastY == 0){
                    settings.lastX = x;
                    settings.lastY = y;
                }else{
                    canvas.photo.x = x - settings.lastX;
                    canvas.photo.y = y - settings.lastY;
                    infoLabel.innerHTML = "Position : " + canvas.photo.x + " - " + canvas.photo.y;
                    reDoImage();
                }
            }
            else if(settings.resizeTool){
                // set values of last position of mouse if not already set
                if(settings.lastX !== 0 && settings.lastY !== 0){
                    // update scaling in json and call canvas to redraw iage 
                    canvas.photo.width += x - settings.lastX;
                    canvas.photo.height += y - settings.lastY;  
                    reDoImage();
                }
                infoLabel.innerHTML = "Size : " + canvas.photo.width + " - " + canvas.photo.height;
                settings.lastX = x;
                settings.lastY = y;
            }
        }
    };

    // method to draw/redraw image on canvas according to json
    const reDoImage = function()
    {
        ctx.clearRect(0, 0, editorCanvas.width, editorCanvas.height);

        ctx.drawImage(img, canvas.photo.clipX, canvas.photo.clipY,editorCanvas.width, 
            editorCanvas.height, canvas.photo.x, canvas.photo.y,  canvas.photo.width,
            canvas.photo.height);     
    };


    const saveConfiguration = function(){
        localStorage.setItem(settings.savedName, JSON.stringify(canvas));
    };

    const loadConfiguration = function(){
        const retrievedObject = localStorage.getItem(settings.savedName);
       
        // parse data and set values to actual json variable
        const savedInfo = JSON.parse(retrievedObject);    
        canvas.width = savedInfo.width;
        canvas.height = savedInfo.height;
        canvas.photo = savedInfo.photo;
    };
}

AppView();

