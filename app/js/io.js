
 
    function writeLocal(name, obj) {
        localStorage.setItem(name, JSON.stringify(obj));
    };

    function loadLocal(name){
        const retrievedObject = localStorage.getItem(name);
       
        // parse data and set values to actual json variable
        let savedInfo = JSON.parse(retrievedObject);    
        return  savedInfo;
    };


    function createAndDownloadBlob(fName,data){
        let a = document.createElement('a');
        a.href = "data:application/octet-stream,"+encodeURIComponent(JSON.stringify(data));
        a.download = fName;
        a.click();
    };


    module.exports = {writeLocal , loadLocal, createAndDownloadBlob};