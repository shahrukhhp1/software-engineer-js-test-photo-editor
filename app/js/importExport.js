/*
Import export javascript file , this file is responsible for functions that are related to writing to local 
storage and reading from it , also download of file can be separated from main file.

This helps in separation of methodologies that are related to import export of data 

Developed by Shahrukh for test - 12-10-2021
 */


 // This method saves object into local storage by converting 
 // object into JSON, it take parameter for name and object
    function writeLocal(name, obj) {
        localStorage.setItem(name, JSON.stringify(obj));
    };

    // This method loads object from local storage by name of variable saved 
    // from 'writeLocal' method , converting string of saved into into JSON object,
    // it take parameter for name and object
    function loadLocal(name){
        const retrievedObject = localStorage.getItem(name);
       
        // parse data and set values to actual json variable
        let savedInfo = JSON.parse(retrievedObject);    
        return  savedInfo;
    };


    // This method takes name of file and object
    // which then converts it into JSON object and writes file
    // and download it
    function createAndDownloadBlob(fName,data){
        let a = document.createElement('a');
        a.href = "data:application/octet-stream,"+encodeURIComponent(JSON.stringify(data));
        a.download = fName;
        a.click();
    };


    module.exports = {writeLocal , loadLocal, createAndDownloadBlob};