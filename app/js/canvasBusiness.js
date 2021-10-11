/*
 * canvas business javascript file , this file is responsible for functions that are related to canvas 
and functions of canvas that can be separated from main file.

This helps in separation of methodologies that are related to canvas business logic
 */




// method to draw/redraw image on canvas according to json
     function reDoImage(ctx, img ,canvas)
     {
         ctx.clearRect(0, 0, canvas.width, canvas.height);
 
         ctx.drawImage(img, 
             canvas.photo.clipX, canvas.photo.clipY,canvas.width, canvas.height, 
             canvas.photo.x, canvas.photo.y,  canvas.photo.width, canvas.photo.height);     
     };


     function reSizeImage(canvas, editorCanvas, ctx, img){
        if(canvas.photo.width < editorCanvas.width)
        {
            // if image width is getting smaller than canvas width limit it to canvas width 
            canvas.photo.width = editorCanvas.width;
        }
        else if(canvas.photo.height < editorCanvas.height)
        {
            // if image height is getting smaller than canvas height limit it to canvas width 
            canvas.photo.height = editorCanvas.height;
        }
        else{
            // draw image if its covering the size of canvas
            reDoImage(ctx, img, canvas);
        }
    };


    function moveImage(canvas, editorCanvas, ctx, img){
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
        reDoImage(ctx, img ,canvas);
    };



    module.exports = { reDoImage , reSizeImage , moveImage};