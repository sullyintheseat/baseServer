const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortId = require('shortid');

const TagSchema = Schema({
  tagShort: {
    type: String,
    default: shortId.generate ,
    index: true,
    required: true,
    unique: true
  },
  ownerShort: {
    type: String,
    default: null,
    unique: true,
    index: true
  },
  created: {
    type:Date,
    default: Date.now()
  }
}, {collection: 'newTags'});

class Tag {
  
  static async createTag(data) {
    try {
      return await this.create(data);
    } catch (err) {
      throw err;
    }
  }

  static async getItem(id) {
    try {
      return await this.findOne({_id : id})
      .exec();
    } catch (err) {
      throw err;
    }
  }

  static async getItems() {
    try {
      return await this.find()
      .exec();
    } catch (err) {
      throw err;
    }
  }

  static async updateItem(id, data) {
    try {
      return `${id} ${data}`;
    } catch (err) {
      throw err;
    }
  }
}

TagSchema.loadClass(Tag);
module.exports = mongoose.model('tag', TagSchema);