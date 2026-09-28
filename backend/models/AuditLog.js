const mongoose=require('mongoose');
const schema=new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},action:String,entity:String,entityId:String,details:mongoose.Schema.Types.Mixed},{timestamps:true});
module.exports=mongoose.model('AuditLog',schema);
