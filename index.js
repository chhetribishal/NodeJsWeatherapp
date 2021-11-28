const http = require("http");

const fs = require("fs");

var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal,orgVal) => {
    let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}",orgVal.weather.main);

    return temperature;

};

const server = http.createServer((req, res) =>{
    if (req.url = "/") {
        requests("http://api.openweathermap.org/data/2.5/weather?q=dharan&appid=8535f8b7dd4bbad68c71cd980b26bfe8")
            .on('data', function (chunk)  {
                const objData  = JSON.parse(chunk);
                const arrData = [objData];
                // console.log(arrobj[0].coord.lat);
                const realTimeData = arrData.map((val)=> replaceVal(homeFile,val))
                .join("");
                res.write(realTimeData);
            })
            .on('end', function (err)  {
                if (err) return console.log('connection closed due to errors', err);

                res.end();
            });
    } else {
        res.end("File not found");
    }
});

server.listen(2000,"127.0.0.1");