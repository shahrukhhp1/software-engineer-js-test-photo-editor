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

const AppView = () => {
    document.body.innerHTML = `<h1>Simple Example</h1>
    <form action="#">
            <fieldset class="toolArea">
                <label for="fileSelector">Select an Image file</label>
                <input type="file" id="fileSelector" />
                <fieldset>
                    <label>Tools</label>
                    <button id="moveBtn">Move with Cursor</button>
                    <button id="resizeBtn">Re-Size with Cursor</button>
                    </br>
                    <label>
                    Manual Movement
                    </label>
                    <input type="number" id="changeTxt" value="1" />
                    </br>
                    <button id="leftBtn">Move Left</button>
                    <button id="rightBtn">Move Right</button>
                    <button id="upBtn">Move Up</button>
                    <button id="downBtn">Move Down</button>
                    
                </fieldset>
                <fieldset>
                    <label>Save/Export</label>
                    <button id="submitBtn">Submit</button>
                    <button id="importBtn">Import</button>
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
    const importBtn = document.getElementById( "importBtn" );
    const leftBtn = document.getElementById( "leftBtn" );
    const rightBtn = document.getElementById( "rightBtn" );
    const upBtn = document.getElementById( "upBtn" );
    const downBtn = document.getElementById( "downBtn" );

    const changeTxt = document.getElementById( "changeTxt" );
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
        reDoImage();             
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
        let imageXDiff = canvas.photo.width - editorCanvas.width;
        let imageYDiff = canvas.photo.height - editorCanvas.height;
        // to manage x axis of image so it doesn't leave borders
        if(canvas.photo.x <= -imageXDiff)
        { // if image has gone farther left and right side of canvas is going empty
            // reset image position to right border of canvas
            canvas.photo.x =  editorCanvas.width - canvas.photo.width;
        }
        else if (canvas.photo.x > 0) 
        {// image is going farther right and left side of canvas is going to be empty
            // reset image position to zero point of x-axis
            canvas.photo.x = 0;
        }
         
        // to manage y axis of image so it doesn't leave borders
        if(canvas.photo.y <= -imageYDiff)
        {
            canvas.photo.y =  editorCanvas.height - canvas.photo.height;
        }
        else if (canvas.photo.y > 0) 
        {// image is going farther right and left side of canvas is going to be empty
            // reset image position to zero point of x-axis
            canvas.photo.y = 0;
        }
        reDoImage();
        //reDoImage();
    };

    function reSizeImage(xDiff,yDiff){
        canvas.photo.width += xDiff;    
        canvas.photo.height += yDiff;  
        if(canvas.photo.width < editorCanvas.width)
        {
            // if image width is getting smaller than canvas width limit it to canvas width 
            canvas.photo.width = editorCanvas.width;
        }
        else if(canvas.photo.height < editorCanvas.height)
        {
            // if image height is getting smaller than canvas height limit it to canvas width 
            canvas.photo.height = editorCanvas.height;
        }else{
            // draw image if its covering the size of canvas
            reDoImage();
        }
    };

    // method to draw/redraw image on canvas according to json
     function reDoImage()
    {
        ctx.clearRect(0, 0, editorCanvas.width, editorCanvas.height);

        ctx.drawImage(img, 
            canvas.photo.clipX, canvas.photo.clipY,canvas.width, canvas.height, 
            canvas.photo.x, canvas.photo.y,  canvas.photo.width, canvas.photo.height);     
    };


    function saveConfiguration() {
        localStorage.setItem(settings.savedName, JSON.stringify(canvas));
    };

    function loadConfiguration(){
        const retrievedObject = localStorage.getItem(settings.savedName);
       
        // parse data and set values to actual json variable
        const savedInfo = JSON.parse(retrievedObject);    
        canvas.width = savedInfo.width;
        canvas.height = savedInfo.height;
        canvas.photo = savedInfo.photo;
    };
}

AppView();

