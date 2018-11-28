const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortId = require('shortid');

const RepSchema = Schema({
  repShort: {
    type: String,
    default: null,
    unique: true,
    index: true
  },
  created: {
    type:Date,
    default: Date.now()
  }
}, {collection: 'reps'});

class Representative {

}

RepSchema.loadClass(Representative);
module.exports = mongoose.model('rep', RepSchema);