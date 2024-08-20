const mongoose=require('mongoose');

const BookingShema=new mongoose.Schema({
    name:{
        type: String
    },
    phone:{
        type: String
    },
    email:{
        type: String
    },
    roomNum:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    hotelName:{
        type:String,
        required:true
    },
    hotelCode:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    
   
    time:{
        type:Array,
        default:[]
    },
    confirm:{
        type:Boolean,
        default:false
    },
    state:{
        type:String,
    }
    
})



const BOOKING=mongoose.model('BOOKING',BookingShema);
module.exports=BOOKING;