require('dotenv').config();const connectDB=require('./db');const Room=require('./models/Room');const User=require('./models/User');const bcrypt=require('bcryptjs');
(async()=>{await connectDB();const rooms=[
{roomNumber:'101',name:'Standard King Room',roomType:'standard',price:120,capacity:2,amenities:['WiFi','Breakfast','Air Conditioning'],description:'Comfortable king room for short stays.'},
{roomNumber:'201',name:'Deluxe City View',roomType:'deluxe',price:180,capacity:2,amenities:['WiFi','Breakfast','City View','Mini Bar'],description:'Spacious deluxe room with city view.'},
{roomNumber:'301',name:'Executive Suite',roomType:'suite',price:280,capacity:3,amenities:['WiFi','Breakfast','Living Area','Mini Bar','Gym'],description:'Executive suite with separate living area.'},
{roomNumber:'202',name:'Deluxe Twin Room',roomType:'deluxe',price:200,capacity:3,amenities:['WiFi','Breakfast','Twin Beds'],description:'Deluxe room for friends or small families.'},
{roomNumber:'302',name:'Family Suite',roomType:'suite',price:350,capacity:5,amenities:['WiFi','Breakfast','Family Area','Pool'],description:'Large suite designed for families.'},
{roomNumber:'501',name:'Presidential Suite',roomType:'suite',price:650,capacity:4,amenities:['WiFi','Breakfast','Butler Service','Pool','Gym'],description:'Premium presidential suite experience.'}];
for(const r of rooms)await Room.updateOne({roomNumber:r.roomNumber},{$set:r},{upsert:true});const email='admin@amourhotel.com';if(!(await User.findOne({email})))await User.create({name:'System Admin',email,password:await bcrypt.hash('Admin123!',10),role:'superuser'});console.log('Seed complete. Demo superuser: admin@amourhotel.com / Admin123!');process.exit(0)})().catch(e=>{console.error(e);process.exit(1)});
