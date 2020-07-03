var express = require('express');  
var bodyParser = require('body-parser'); 
var app = express();  
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var fs = require('fs')

app.use(express.static( __dirname+'/public')); //making public directory as static directory  
app.use(bodyParser.json());

app.get("/", (req,res) => {
    res.sendFile( __dirname + "/public/" + "ball.html" );
})

app.post("/calc", urlencodedParser, (req,res) => {
    console.log("Post data: ", req.body)
    var g = 9.8
    var coeff = (req.body.coeff)
    var h1 = (req.body.init_h)
    var coeff_2 = coeff**2
    var t1 = Math.sqrt(2*h1/g)
    t1 = Math.round(t1 * 1000) / 1000
     
    var h2
    var h = [h1]
    var t = [t1]
    console
    var count = 0
    while (true){
        //height
        h1 = h[h.length -1]
        h2 = coeff_2 * h1
        h2 = Math.round(h2 * 1000) / 1000
        if(h2 == 0)
            break
        
        h.push(h2)

        //time 
        var ti = Math.sqrt(2*h2/g)
        ti = Math.round(ti * 1000) / 1000
        t.push(ti)

        count += 1
        if(count>=15)
            break
    }

    //graph coordinates
    // hcoords = [h[0], 0]
    // tcoords = [0, t[0]]
    coords = [{x:0, y:h[0]}, {x:t[0], y:0}]
    t_inc = t[0]
    for(var i=1; i< t.length; i++)
    {
        // hcoords.push(h[i],0)
        t_inc += t[i]
        t_inc = Math.round(t_inc * 1000) / 1000
        // tcoords.push(t_inc)
        coords.push({x:t_inc, y:h[i]})

        t_inc += t[i]
        t_inc = Math.round(t_inc * 1000) / 1000
        // tcoords.push(t_inc)
        coords.push({x:t_inc, y:0})
    }
    
    console.log("Count @ ",count," : ", h, t)
    calc_data = {coeff:coeff, count:count, coords:coords}
    res.send(calc_data)

    //store this
    fs.readFile('history.json', (err, data) => {
        if (err)
            console.log(err);
        else 
        {
            alldata = JSON.parse(data);
            alldata.push(calc_data); 
            fs.writeFile('history.json', JSON.stringify(alldata,null, 2), (err) => {
                if (err) throw err;
                console.log('Data written to file');
            });
        }
    });

})

app.get("/history", (req,res) => {
    res.sendFile( __dirname + "/public/" + "hist.html" );
})

app.get("/past_calc", (req,res) => {
    fs.readFile('history.json', (err, data) => {
        if (err)
            console.log(err);
        else 
        {
            alldata = JSON.parse(data);
            res.send(alldata)
        }
    });
})

app.listen(5000, () => {
    console.log("Server running at 5000")
})