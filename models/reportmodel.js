    const mongoose=require('mongoose')

    const report=mongoose.Schema({
        reported_by:{
            type:String
        },
        creator:{
    type:mongoose.Schema.ObjectId,
    ref:'creator'
        },
        email:{
            type:String
        },
        type_of_report:{
            type:String
        },
        subject:{
            type:String
        },
        description:{
            type:String
        },
        attachment:{
            type:String
        }
    })
    const reportmodel=mongoose.model('report',report)
    module.exports=reportmodel