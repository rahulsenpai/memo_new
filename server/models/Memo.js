const mongoose = require('mongoose')

const MemoSchema = new mongoose.Schema({
    text : String,
})

const Memo = mongoose.model("memo",MemoSchema)
module.exports  = Memo