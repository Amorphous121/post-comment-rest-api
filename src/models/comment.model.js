const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

const CommentSchema = new mongoose.Schema(
  {
    comment: { type: String, required: true },
    createdBy: { type: ObjectId, ref: 'user' },
    post: { type: ObjectId, ref: 'user' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: ObjectId, ref: 'user' },
  },
  { timestamps: true }
);

CommentSchema.pre(/\b(find|findOne|exists|countDocuments)\b/, function (next) {
  if (!this._conditions['isDeleted']) {
    this._conditions['isDeleted'] = false;
  }
  if (this.op === 'find' && !this['options']['sort']) {
    this['options']['sort'] = { createdAt: -1 };
  }
  next();
});

module.exports = mongoose.model('comment', CommentSchema, 'comments');
