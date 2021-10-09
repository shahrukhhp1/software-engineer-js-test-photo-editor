import '../css/main.scss'

const AppView = () => {
    document.body.innerHTML = `<h1>Simple Example</h1>
        <form action="#">
            <fieldset>
                <label for="fileSelector">Select an Image file</label>
                <input type="file" id="fileSelector" />
                <button id="moveBtn">Move</button>
                <button id="resizeBtn">Re-Size</button>
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
    const ctx = editorCanvas.getContext('2d');
    const img = new Image();
    const userConfig = { mouseDown : false , moveTool : true , resizeTool : false , lastX : 0, lastY : 0 };
    const canvas = {
        width: 0,
        height: 0,
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
                        
                        img.onload = function() {
                            // grab some data from the image
                            const width = img.naturalWidth;
                            const height = img.naturalHeight;

                            editorCanvas.width = 500;
                            editorCanvas.height = 500 * height / width;


                            canvas.height = editorCanvas.height;
                            canvas.width  = editorCanvas.width;
                            canvas.photo.width = width;
                            canvas.photo.height = height;
                            canvas.photo.x=0;
                            canvas.photo.y=0;

                            reDoImage();             
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

    moveBtn.onclick = function(e){
        e.target.className= "active";
        resizeBtn.className = "";
        userConfig.moveTool = true;
        userConfig.resizeTool = false;
    };

    resizeBtn.onclick = function(e){
        e.target.className= "active";
        moveBtn.className = "";
        userConfig.resizeTool = true;
        userConfig.moveTool = false;
    };

    editorCanvas.onmousedown = function() {
        userConfig.mouseDown = true;
    };

    
    editorCanvas.onmouseup = function() {
        userConfig.mouseDown = false;
    };

    editorCanvas.onmousemove =function(e) {
        if(userConfig.mouseDown){
            let x = e.clientX - editorCanvas.offsetLeft;
            let y = e.clientY - editorCanvas.offsetTop;
            
            
            if(userConfig.moveTool){    
                canvas.photo.x = x;
                canvas.photo.y = y;
                infoLabel.innerHTML = "Position : " + x + " - " + y;
                reDoImage();
            }
            else if(userConfig.resizeTool){
                if(userConfig.lastX == userConfig.lastY == 0){
                    userConfig.lastX = x;
                    userConfig.lastY = y;
                }else{
                    canvas.photo.width += x - userConfig.lastX;
                    canvas.photo.height += y - userConfig.lastY;  
                    infoLabel.innerHTML = "Size : " + canvas.photo.width + " - " + canvas.photo.height;
                    reDoImage();
                }
            }
        }
    };



    const reDoImage = function()
    {
        ctx.clearRect(0, 0, editorCanvas.width, editorCanvas.height);

        ctx.drawImage(img, canvas.photo.clipX, canvas.photo.clipY, canvas.photo.width, 
            canvas.photo.height, canvas.photo.x, canvas.photo.y, editorCanvas.width,
                editorCanvas.height);     
    };
}

AppView();

