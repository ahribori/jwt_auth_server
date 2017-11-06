import mongoose from 'mongoose';
import crypto from 'crypto';
import conf from '../../conf';

const Schema = mongoose.Schema;

const secret_key = conf.server.secret || 'AbCdEfG!2#4%6&';

const User = new Schema({
    account_type: String, // ahribori(undefined), kakao, google, facebook
    username: String,
    password: String,
    nickname: String,
    email: String,
    email_verified: {type: Boolean, default: false},
    level: {type: Number, default: 1},
    cash: {type: Number, default: 0},
    point: {type: Number, default: 0},
    social_id: String,
    thumbnail_image: String,
    admin: {type: Boolean, default: false},
    reg_date: {type: Date, default: Date.now},
    last_login: {type: Date, default: Date.now},
    blocked: {type: Boolean, default: false}
});

// create new User document
User.statics.create = function (username, password, nickname, email) {
    if (typeof password === 'number') password = password.toString();
    const encrypted = crypto.createHmac('sha1', secret_key).update(password).digest('base64');
    const user = new this({
        username,
        password: encrypted,
        nickname,
        email
    });

    // return the Promise
    return user.save()
};

// find one user by using username
User.statics.findOneByUsername = function (username) {
    return this.findOne({
        username
    }).exec()
};

// verify the password of the User documment
User.methods.verify = function (password) {
    if (typeof password === 'number') password = password.toString();
    const encrypted = crypto.createHmac('sha1', secret_key).update(password).digest('base64');
    return this.password === encrypted;
};

User.methods.changePassword = function (newPassword) {
    if (typeof newPassword === 'number') newPassword = newPassword.toString();
    this.password = crypto.createHmac('sha1', secret_key).update(newPassword).digest('base64');
    return this.save();
};

User.methods.assignAdmin = function () {
    this.admin = true;
    return this.save()
};

export default mongoose.model('User', User);