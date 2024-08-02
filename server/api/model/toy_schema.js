const { default: mongoose, ObjectId } = require('mongoose');

const toyModel = mongoose.Schema({

    title: {type:String, required: true },
    toy: { type: String, required: true },
    
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'userModel' ,
    require:true}
}, { timestamps: true });

mongoose.model('toyModel', toyModel)
module.exports = toyModel
