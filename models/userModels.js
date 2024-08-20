const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')

const UserShema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    img:{
        type:String
    },
    admin:{
        type:String
    },
    hcode:{
        type:String
    },
    phone:{
        type:String
    },
    addres:{
        type:String
    },
    date:{
        type:Date,
        default:Date.new
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
})


//
UserShema.methods.genationToken=async function(){

    try {
        const token=jwt.sign({_id:this._id},process.env.KEY)
        // const token=jwt.sign({_id:this._id,name:this.name,email:this.email,phone:this.phone},process.env.KEY)
        this.tokens=this.tokens.concat({token:token})
        await this.save()
        return token;
    } catch (error) {
        console.log(error)
    }
}


// hashing
UserShema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,12);
       // this.cpassword=await bcrypt.hash(this.cpassword,12);

    }
    next();

})


const User=mongoose.model('USER',UserShema);
module.exports=User;