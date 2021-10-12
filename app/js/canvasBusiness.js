/*
 * canvas business javascript file , this file is responsible for functions that are related to canvas 
and functions of canvas that can be separated from main file.

This helps in separation of methodologies that are related to canvas business logic

These methods takes parameters to work on , which are :
    ctx = context of canvas
    img = image object 
    canvas = and position & height & width etc properties in object form 
 */


    // This method resizes image inside canvas validating all corners of image
    // if image is inside canvas and not leaving any blank space by calculting
    //  x,y axis and height width of image with respect to canvas.
     function reSizeImage(canvas, editorCanvas, ctx, img){
        if(canvas.photo.width + canvas.photo.x < editorCanvas.width)
        {
            // if image width is getting smaller than canvas width limit it to canvas width
            // and addition of difference in position of x axis 
            canvas.photo.width = editorCanvas.width - canvas.photo.x;
        }
        if(canvas.photo.height + canvas.photo.y < editorCanvas.height)
        {
            // if image height is getting smaller than canvas height limit it to canvas width 
            // and addition of difference in position of y axis 
            canvas.photo.height = editorCanvas.height - canvas.photo.y;
        }
        // draw image if its covering the size of canvas
        reDoImage(ctx, img, canvas);
    };

    //This method move image inside canvas by changing is x, y axis
    // validating all aspects if image is not leaving canvas any blank space 
    // by calculting x,y axis and height width of image with respect to canvas.
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

    

    // This method clears canvas and draw image on canvas according to json object provided
    function reDoImage(ctx, img ,canvas)
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 
            canvas.photo.clipX, canvas.photo.clipY,canvas.width, canvas.height, 
            canvas.photo.x, canvas.photo.y,  canvas.photo.width, canvas.photo.height);     
    };


    function validateCanvasObj(canvas)
    {
        if(canvas)
        {
            if(canvas.photo)
            {
                if(canvas.photo.x && Number.isInteger(canvas.photo.x)
                && canvas.photo.y && Number.isInteger(canvas.photo.y)
                && canvas.photo.width && Number.isInteger(canvas.photo.width)
                && canvas.photo.height && Number.isInteger(canvas.photo.height)
                && canvas.photo.path && canvas.photo.path.length > 0)
                {
        
                }
            }

        }
        return false;
    }



    module.exports = { reDoImage , reSizeImage , moveImage};