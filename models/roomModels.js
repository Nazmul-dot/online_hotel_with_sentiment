const mongoose=require('mongoose');

const RoomShema=new mongoose.Schema({
    Hotel_Name:{
        type:String,
        required:true
    },
    Hotel_code:{
        type:String,
        required:true
    },
    roomNum:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    type:{
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
    ratting:{
        type:Number,
        default:0
    },
    positive:{
        posiNum:{
            type:Number,
            default:0
        },
        posiRating:{
            type:Number,
            default:0
        }
        
    },
    nagetive:{
        negiNum:{
            type:Number,
            default:0
        },
        negiRating:{
            type:Number,
            default:0
        }
        
    },
    rank:{
        type:Number,
        
    },
    reviews:[
        {
            // descript:{
            //     type:String,
            // }
            name: String,
            review: String,
            image: String,
            email: String,
            PersonalRating:Number
            
        }
    ],
    NumberOfReview:{
        type:Number,
        default:0
    },
    confirm:{
        type:Number,
        default:0
    },
    time: {
        type: [
            {
                avail: Boolean,
                times: [String], // Change the type to an array of numbers (assuming dates is a number)
                userEmail: String,
                userName: String,
                userPhone:String,
                bookingId:String
            }
        ]
    },
    available:{
        type:Boolean,
        default:false
    }
})



const Room=mongoose.model('Room',RoomShema);
module.exports=Room;