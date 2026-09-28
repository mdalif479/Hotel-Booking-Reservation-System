const mongoose=require('mongoose');
const paymentSchema=new mongoose.Schema({
 booking:{type:mongoose.Schema.Types.ObjectId,ref:'Booking',required:true}, user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
 amount:{type:Number,required:true}, method:{type:String,default:'demo'}, transactionId:{type:String,required:true,unique:true},
 status:{type:String,enum:['pending','paid','failed','refunded'],default:'pending'}, providerResponse:{type:mongoose.Schema.Types.Mixed}
},{timestamps:true});
module.exports=mongoose.model('Payment',paymentSchema);
