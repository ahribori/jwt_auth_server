import mongoose from 'mongoose';

const { Schema } = mongoose;

const Message = new Schema({
    receiver: Schema.Types.ObjectId,
    sender: Schema.Types.ObjectId,
    message: String,
    read: { type: Boolean, default: false },
    read_date: Date,
    reg_date: { type: Date, default: Date.now },
});

// create new User document
Message.statics.send = function (message, receiver, sender) {
    const msg = new this({
        message,
        receiver,
        sender,
    });
    return msg.save();
};

export default mongoose.model('Message', Message);
