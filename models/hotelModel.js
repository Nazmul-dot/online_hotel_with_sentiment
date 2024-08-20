const mongoose=require('mongoose');

const HotelShema=new mongoose.Schema({
    Hotel_Name:{
        type:String,
        required:true
    },
    Hotel_code:{
        type:String,
        required:true
    },
    img1:{
        type:String
    },
    img2:{
        type:String
    },
    img3:{
        type:String
    },
    description:{
        type:String
    },
})



const Hotel=mongoose.model('Hotel',HotelShema);
module.exports=Hotel;