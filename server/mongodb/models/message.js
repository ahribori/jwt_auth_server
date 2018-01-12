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
Message.statics.send = function send(message, receiver, sender) {
    const msg = new this({
        message,
        receiver,
        sender,
    });
    return msg.save();
};

Message.statics.sendSystemMessage = function send(message, receiver) {
    const msg = new this({
        message,
        receiver,
    });
    return msg.save();
};

Message.statics.findMessagesByUser = function findMessagesByUser(userId) {
    return this.find({ receiver: userId }).sort({ reg_date: -1 });
};

Message.statics.read = async function read(messageId) {
    const message = await this.findOne({ _id: messageId });
    message.read = true;
    await message.save();
    return message;
};

export default mongoose.model('Message', Message);
