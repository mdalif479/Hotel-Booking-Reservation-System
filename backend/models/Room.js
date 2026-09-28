const mongoose=require('mongoose');
const roomSchema=new mongoose.Schema({
  roomNumber:{type:String,required:true,unique:true}, name:{type:String,required:true}, roomType:{type:String,required:true,lowercase:true},
  price:{type:Number,required:true,min:0}, status:{type:String,enum:['available','maintenance','inactive'],default:'available'},
  capacity:{type:Number,default:2,min:1}, description:{type:String,default:''}, amenities:[{type:String}], images:[{type:String}]
},{timestamps:true});
module.exports=mongoose.model('Room',roomSchema);
