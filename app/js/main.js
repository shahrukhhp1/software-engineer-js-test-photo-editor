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
    const userConfig = { mouseDown : false , moveTool : true , resizeTool : false , lastX : 0, lastY : 0 ,
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
            userConfig.reset = true;
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
     
        if(userConfig.reset){
            canvas.height = editorCanvas.height;
            canvas.width  = editorCanvas.width;
            canvas.photo.width = width;
            canvas.photo.height = height;
            canvas.photo.x=0;
            canvas.photo.y=0;    
        }
        
        // call function to draw image
        reDoImage();             
    }

    submitBtn.onclick = function(){
        saveConfiguration();
    };

    reloadBtn.onclick = function(){
        userConfig.reset = false;
        loadConfiguration();
        img.src = canvas.photo.path;        
    };

    // select a tool for image movement
    moveBtn.onclick = function(e){
        e.target.className= "active";
        resizeBtn.className = "";
        userConfig.moveTool = true;
        userConfig.resizeTool = false;
    };

    // select a tool for image resizing
    resizeBtn.onclick = function(e){
        e.target.className= "active";
        moveBtn.className = "";
        userConfig.resizeTool = true;
        userConfig.moveTool = false;
    };

    //turn boolean false tool wont work if mouse key is not press
    editorCanvas.onmousedown = function() {
        userConfig.mouseDown = true;
    };

    //set boolen true while mouse is moving and key is pressed
    editorCanvas.onmouseup = function() {
        userConfig.mouseDown = false;
        userConfig.lastX = 0;
        userConfig.lastY = 0;
    };

    
    editorCanvas.onmousemove =function(e) {
        // if key is pressed while mouse is moving over canvas
        if(userConfig.mouseDown){
            // calculate cursor coordinates reference to canvas position
            let x = e.clientX - editorCanvas.offsetLeft;
            let y = e.clientY - editorCanvas.offsetTop;
            
            
        
            if(userConfig.moveTool){    
                // update position in json and call canvas to redraw iage 
                if(userConfig.lastX == userConfig.lastY == 0){
                    userConfig.lastX = x;
                    userConfig.lastY = y;
                }else{
                    canvas.photo.x = x - userConfig.lastX;
                    canvas.photo.y = y - userConfig.lastY;
                    infoLabel.innerHTML = "Position : " + canvas.photo.x + " - " + canvas.photo.y;
                    reDoImage();
                }
            }
            else if(userConfig.resizeTool){
                // set values of last position of mouse if not already set
                if(userConfig.lastX == userConfig.lastY == 0){
                    userConfig.lastX = x;
                    userConfig.lastY = y;
                }else{
                    // update scaling in json and call canvas to redraw iage 
                    canvas.photo.width += x - userConfig.lastX;
                    canvas.photo.height += y - userConfig.lastY;  
                    infoLabel.innerHTML = "Size : " + canvas.photo.width + " - " + canvas.photo.height;
                    reDoImage();
                }
            }
        }
    };

    // method to draw/redraw image on canvas according to json
    const reDoImage = function()
    {
        ctx.clearRect(0, 0, editorCanvas.width, editorCanvas.height);

        ctx.drawImage(img, canvas.photo.clipX, canvas.photo.clipY, canvas.photo.width, 
            canvas.photo.height, canvas.photo.x, canvas.photo.y, editorCanvas.width,
                editorCanvas.height);     
    };


    const saveConfiguration = function(){
        localStorage.setItem(userConfig.savedName, JSON.stringify(canvas));
    };

    const loadConfiguration = function(){
        const retrievedObject = localStorage.getItem(userConfig.savedName);
       
        // parse data and set values to actual variable on callback
        const savedInfo = JSON.parse(retrievedObject);    
        canvas.width = savedInfo.width;
        canvas.height = savedInfo.height;
        canvas.photo = savedInfo.photo;
    };
}

AppView();

