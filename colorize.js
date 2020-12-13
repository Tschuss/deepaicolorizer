// Get the 'deepai' package here (Compatible with browser & nodejs):
// //     https://www.npmjs.com/package/deepai
// // All examples use JS async-await syntax, be sure to call the API inside an async function.
// //     Learn more about async-await here: https://javascript.info/async-await

const fs = require('fs');
const request = require('request');
const deepai = require('deepai'); 


deepai.setApiKey('bc2df53a-ee00-4283-a500-d71c9c11b1db');

const photo_dir = process.argv[2];

processDir(photo_dir);

function processDir(dir) {
    return new Promise((resolve) => {
        console.log ("Empezamos a procesar el directorio ["+ dir+"]", 'color: #00ff00');

        var count = {numdir:0, numfiles:0};
        fs.readdir(dir, (err, files) => {
            files.forEach(file => {
                var path=dir+"\\"+file;
                console.log ("Contenido: ["+ path+"]");

                fs.stat(path, (error, stats) => {
                    if (error) {
                        console.error (error);
                    } else {
                        if (stats && stats.isDirectory()) {
                            count.numdir++;
                            console.log (path+" es un directorio");
                            processDir(path);
                        } else {
                            count.numfiles++
                            processFile(path);
                        }
                    }
                });
            });
        });
    });
}

async function processFile (file) {
    try {
        console.log ("Empezamos a procesar el archivo ["+ file +"]", 'color: #0000ff');

        if (file.lastIndexOf("_color.jpg")>0) {
            console.log ("Photo ya coloreada: "+file)
        } else {
            var resp;
            var photo=file;
            //(async function() { 
                resp = await deepai.callStandardApi("colorizer", {
                    image: fs.createReadStream(photo),
                })
                .catch(error => {
                    console.error("Error en API:", 'color: #ff0000');
                    console.error(error.request);
                });
                //return new Promise((resolve) => {
                    if (resp) {
                        var url=resp.output_url;
                        var photo1=photo.substr(0,photo.lastIndexOf('.'));
                        var localPath=photo1+'_color.jpg';
                        try {
                            request.head(url, function(err2, res, body){
                                console.log ("escribe en disco: "+ localPath);
                                request(url).pipe(fs.createWriteStream(localPath));
                            });
                        } catch(error) {
                            console.error("Error en request: "+localPath, 'color: #ff0000');
                            console.error(error.response);
                        };
                    } else {
                        console.error ("API response no existe", 'color: #ff0000');
                    }
                //}).catch ( error => {
                //    console.log(error);
                //});
            //});
        }
    }catch (error) {
        console.error ("Error al procesar el fichero: "+file, 'color: #ff0000');
        console.error (error);
    }
}