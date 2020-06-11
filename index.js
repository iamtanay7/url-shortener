let dbConn = require('./dbConn')
let bodyParser = require('body-parser')
let dns = require('dns')
let sha1 = require('sha1')
let express = require('express')
let app = express()
app.listen(3000)
let db = dbConn.conn
console.log(db.readyState)
db.on('error', console.error.bind(console, 'connection error:'));
 db.once('open', function() {
   console.log('MongoDB connected!');
 });

app.use(bodyParser.urlencoded({extended:false}))
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/views/index.html') 
})

app.post('/',(req,res)=>{
    let expr= /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi; 
    let inputUrl = req.body.inputUrl.toString()
    let regex = new RegExp(expr)
    let resp,newobj;
    if(inputUrl.match(regex)){
        let index = inputUrl.search("www")
        if(index!=-1){
        let hostname= inputUrl.substr(index,inputUrl.length-1)
        var shakey = sha1(hostname);
        dns.lookup(hostname,(err,address)=>{
            if(err) {
                resp={"error":"Invalid URL"}
                return console.log(err)
            }
            console.log(address,shakey)
            newobj = new dbConn.urlModel({"originalUrl":hostname,"hash":shakey})
            newobj.save((err,data)=>{
                if(err) {
                    resp={"error":"Invalid URL"}
                    return console.log(err)
                }
                 console.log(data)           
            })
           

        })
    }       
    }    
})

app.get('/:hashkey',(req,res)=>{
    dbConn.urlModel.find({"hash":req.params.hashkey},(err,data)=>{
        res.redirect(`http://${data[0].originalUrl}`)
    })
})