const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { appConfig } = require('../config');

const ObjectId = mongoose.Types.ObjectId;

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    posts: [{ type: ObjectId, ref: 'post' }],
    comments: [{ type: ObjectId, ref: 'comment' }],
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: ObjectId, ref: 'user' },
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, appConfig.bcryptRounds);
  next();
});

UserSchema.pre(/\b(find|findOne|countDocuments|findById)\b/, function (next) {
  if (!this._conditions['isDeleted']) {
    this._conditions['isDeleted'] = false;
  }
  
  if (this.op === 'find' && !this['options']['sort']) {
    this['options']['sort'] = { createdAt: -1 };
  }
  next();
});

module.exports = mongoose.model('user', UserSchema, 'users');
