require('dotenv').config()
let mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true, useUnifiedTopology:true})
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('MongoDB connected!');
});
let bodyParser = require('body-parser')
let dns = require('dns')
let sha1 = require('sha1')
let express = require('express')
let app = express()
app.listen(3000)


app.use(bodyParser.urlencoded({extended:false}))
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/views/index.html') 
})

app.post('/',(req,res)=>{
    let expr= /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi; 
    let inputUrl = req.body.inputUrl.toString()
    let regex = new RegExp(expr)
    let resp;
    if(inputUrl.match(regex)){
        let index = inputUrl.search("www")
        if(index!=-1){
        let hostname= inputUrl.substr(index,inputUrl.length-1)
        var shakey = sha1(hostname);
        dns.lookup(hostname,(err,address)=>{
            if(err) return console.log(err)
        })
        var obj = new mongoose.Document({"hostname":hostname,"key":shakey});
        obj.save((err)=>{
            console.log(error);
        })
        
    }

    }
    else{
        resp={"error":"Invalid URL"}
    }
    res.json(resp)
})