import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Application = new Schema({
    user: Schema.Types.ObjectId,
    name: String,
    origin: String,
    callback_url: String,
    thumbnail_image: String,
    reg_date: { type: Date, default: Date.now },
    blocked: { type: Boolean, default: false },
});

export default mongoose.model('Application', Application);
