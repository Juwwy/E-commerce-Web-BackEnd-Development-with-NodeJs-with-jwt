const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name: {type:String,
        required: true
    },
    email: {type:String,
        required: true
    },
    password: {type:String,
        required: true
    },
    street: {type:String,
        default: ''
    },
    city: {type:String,
        default: ''
    },
    apartment: {type:String,
        default: ''
    },
    country: {type:String,
        required: true,
        default: ''
    },
    phone: {type:Number,
        required: true
    },
    isAdmin: {type: Boolean,
        default: false
    },


});

userSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true
});

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;