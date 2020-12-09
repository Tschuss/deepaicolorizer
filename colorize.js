// Get the 'deepai' package here (Compatible with browser & nodejs):
// //     https://www.npmjs.com/package/deepai
// // All examples use JS async-await syntax, be sure to call the API inside an async function.
// //     Learn more about async-await here: https://javascript.info/async-await

const fs = require('fs');
const request = require('request');
const deepai = require('deepai'); 


deepai.setApiKey('bc2df53a-ee00-4283-a500-d71c9c11b1db');
var photo="C:\\Users\\jiglesias\\Pictures\\jesus.png";

(async function() {
    var resp;
    resp = await deepai.callStandardApi("colorizer", {
        image: fs.createReadStream(photo),
    }).catch(error => {
        console.error('ERROR ',error);
    });
    console.log(resp);
    //añadido para evitar un error al validar el certificado (que no salida en octubre y ahora aparece en noviembre 2020)
    //process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
    return new Promise((resolve) => {
        var url; //= "https://api.deepai.org/job-view-file/7c87cc27-cf07-4459-ad87-7f8e43478897/outputs/output.jpg"
        if (resp) {
            url=resp.output_url;
        }
        var photo1=photo.substr(0,photo.lastIndexOf('.'));
        var localPath=photo1+'_color.jpg';

        request.head(url, function(err, res, body){
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);
        
            request(url).pipe(fs.createWriteStream(localPath));
          });

          

    }).catch(error => {
        console.error('ERROR ',error);
    });
})()

/**
 
 request(url, function (error, response, body) {


            console.log (photo1+'_color.jpg');
            //console.debug (body);
            var buf = Buffer.from(body, 'binary');
            fs.writeFileSync(photo1+'_color.jpg', buf);
            //console.log (body);
 // ****** other
 

        var file = fs.createWriteStream(localPath);
        console.log(url +' >> '+localPath)
        var request = https.get(url, function(response) {
            response.pipe(file);
        });
 */