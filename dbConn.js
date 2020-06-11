require('dotenv').config()
let mongoose = require('mongoose')
const MONGO_URI="mongodb://localhost/test"
mongoose.connect(MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true})
exports.conn = mongoose.connection
let Schema = mongoose.Schema

const urlSchema = new Schema({
    "originalUrl":{type:String,required:true},
    "hash":{type:String,required:true}
})
exports.urlModel = mongoose.model("urlModel",urlSchema)

