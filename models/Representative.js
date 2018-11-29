const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortId = require('shortid');

const RepSchema = Schema({
  repShort: {
    type: String,
    default: shortId.generate,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  employer: {
    type: String,
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    index: true
  },
  mobile: {
    type: String,
    required: true,
    index: true
  }
},
{
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  id: false
});

RepSchema.virtual('tags',{
  localField: 'repShort',
  foreignField: 'ownerShort',
  ref: 'Tag'
})
class Representative {

  static async createItem(data) {
    try {
      return await this.create(data);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  static async getItem(id) {
    try {
      let rep = await this.findOne({tagShort : id})
      .populate({path : 'tags', model: 'Tag', select: '-_id -createdAt -updatedAt -__v'})
      .exec();

      return rep;
    } catch (err) {
      throw err;
    }
  }

  static async getItems() {
    try {
      return await this.find()
      .populate({path : 'tags', model: 'Tag', select: '-_id -createdAt -updatedAt -__v'})
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

RepSchema.loadClass(Representative);
module.exports = mongoose.model('Rep', RepSchema, 'reps');