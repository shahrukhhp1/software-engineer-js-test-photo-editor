import '../css/main.scss'

const AppView = () => {
    document.body.innerHTML = `<h1>Simple Example</h1>
        <form action="#">
            <fieldset>
                <label for="fileSelector">Select an Image file</label>
                <input type="file" id="fileSelector" />
            </fieldset>
        </form>

        <canvas id="editorCanvas"></canvas>`;

    // grab DOM elements inside index.html
    const fileSelector = document.getElementById( "fileSelector" );
    const editorCanvas = document.getElementById( "editorCanvas" );

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
                        const img = new Image();
                        img.src = reader.result;

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
                            }
                        };


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

                            reLocateImage();
                                                  
                        }
                        // do your magic here...

                        const ctx = editorCanvas.getContext('2d');
                        const reLocateImage = function()
                        {
                            const ctx = editorCanvas.getContext('2d');
                            ctx.clearRect(0, 0, editorCanvas.width, editorCanvas.height);

                            ctx.drawImage(img, canvas.photo.clipX, canvas.photo.clipY, canvas.photo.width, 
                                canvas.photo.height, canvas.photo.x, canvas.photo.y, editorCanvas.width,
                                    editorCanvas.height);     
                        }
                    };
                    reader.readAsDataURL( file );
                    // process just one file.
                    return;

            }
        }
    };
}

AppView();

