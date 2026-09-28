const mongoose=require('mongoose');
const bookingSchema=new mongoose.Schema({
  bookingReference:{type:String,required:true,unique:true}, user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
  room:{type:mongoose.Schema.Types.ObjectId,ref:'Room',required:true}, fullName:{type:String,required:true}, email:{type:String,required:true},
  phone:{type:String,default:''}, checkIn:{type:Date,required:true}, checkOut:{type:Date,required:true}, guests:{type:Number,default:1},
  specialRequest:{type:String,default:''}, nights:{type:Number,required:true}, totalAmount:{type:Number,required:true},
  status:{type:String,enum:['pending','confirmed','cancelled','completed'],default:'pending'},
  paymentStatus:{type:String,enum:['unpaid','paid','failed','refunded'],default:'unpaid'}, cancellationReason:{type:String,default:''}, cancelledAt:Date
},{timestamps:true});
bookingSchema.index({room:1,checkIn:1,checkOut:1,status:1});
module.exports=mongoose.model('Booking',bookingSchema);
