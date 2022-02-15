const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: ObjectId, ref: 'user' },
    comments: [{ type: ObjectId, ref: 'comment' }],
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: ObjectId, ref: 'user' },
  },
  { timestamps: true }
);

PostSchema.pre(/\b(find|findOne|exists|countDocuments)\b/, function (next) {
  if (!this._conditions['isDeleted']) {
    this._conditions['isDeleted'] = false;
  }
  
  if (this.op === 'find' && !this['options']['sort']) {
    this['options']['sort'] = { createdAt: -1 };
  }
  next();
});

module.exports = mongoose.model('post', PostSchema, 'posts');
