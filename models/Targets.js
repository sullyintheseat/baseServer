const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortId = require('shortid');

const TargetSchema = Schema({
  targetShort: {
    type: String,
    default: shortId.generate,
    index: true,
    required: true,
    unique: true
  }
},
{
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  id: false
});

class Target {
  
  static async createTarget(data) {
    try {
      return await this.create(data);
    } catch (err) {
      throw err;
    }
  }

  static async getItem(id) {
    try {
      return await this.findOne({targetShort : id})
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

TargetSchema.loadClass(Target);
module.exports = mongoose.model('Target', TargetSchema, 'targets');