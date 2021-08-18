const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    shippingAddr1: {type: String},
    shippingAddr2: {type: String},
    city: {type: String},
    zip: {type: String},
    country: {type: String},
    phone: {type: Number},
    status: {type: String, required: true, default: 'Pending'},
    totalPrice: {type: Number},
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true
    }],
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dateOrdered: {type: Date,
        default: Date.now
    },
});


orderSchema.virtual('id').get(function(){
    return this._id.toHexString();
});


orderSchema.set('toJSON', {
    virtuals : true
});

exports.Order = mongoose.model('Order', orderSchema);