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

module.exports = mongoose.model('comment', CommentSchema, 'comments');
