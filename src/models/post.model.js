const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

const PostSchema = new mongoose.Schema({
  title       :   { type: String, required: true },
  content     :   { type: String, required: true },
  author      :   { type: ObjectId, ref: 'user' },
  comments    :   [{ type: ObjectId, ref: 'comment' }],
  isDeleted   :   { type: Boolean, default: false },
  deletedAt   :   { type: Date, default: null },
  deletedBy   :   { type: ObjectId, ref: 'user' },
}, { timestamps: true });

module.exports = mongoose.model('post', PostSchema ,'posts');