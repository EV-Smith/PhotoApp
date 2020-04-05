const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  userName: {
    type: String
  },
  avatar: {
    type: String
  },
  postPhoto: {
    type: String,
    required: true
  },
  postCaption: {
    type: String,
    required: true
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  dislikes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      commentText: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      commentDate: {
        type: Date,
        default: Date.now
      }
    }
  ],
  postDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = PostModel = mongoose.model('post', PostSchema);
