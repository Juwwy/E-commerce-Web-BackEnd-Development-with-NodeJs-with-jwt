const mongoose = require('mongoose');

//Model Section
const productSchema = mongoose.Schema({
    name: {
        type: String, 
        required : true,
    },
    image : { 
        type: String,
        default: ''
    },
    images: [{ type: String}],
    countInStock: {
        type : Number,
        required : true,
        min: 0,
        max: 255
    },
    description: {
        type: String,
        required: true,
    },
    richDescription : { 
        type: String,
        default: ''
    },
    brand : { 
        type: String,
        default: ''
    },
    price : { 
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    rating : { 
        type: Number,
        default: 0
    },
    isFeatured : { 
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})

productSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

productSchema.set('toJSON',{
    virtuals: true
});

exports.Product = mongoose.model('Product', productSchema);

