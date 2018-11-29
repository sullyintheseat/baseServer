const Tag = require('../models/Tag');

const TagManagerController = {
  
  addTag: async(req, res) => {
    try {
      let result = await Tag.createTag(req.body);
      res.send(result);
    } catch (err) {
      res.status(500).send('Unknown database error');
    }
  },

  findTag: async(req, res) => {
    let target = req.params.short;
    try{
      let result;
      (target != undefined) ? result = await Tag.getItem(req.params.id) : result = await Tag.getItems();
      res.send(result);
    } catch (err) {
      res.status(500).send('Unknown database error');
    }
  },

  modifyTag: async(req, res) => {
    let data = req.body;
    let id = req.params.short;
    if(id !== undefined) {
      try {
        let result = await Tag.updateItem(id, data);
        res.send(result);
      } catch (err) {
        res.status(500).send('Unknown database error');
      }
    } else {
      res.status(400).send('Required data missing');
    }
  }

};

module.exports.Controller = TagManagerController;
module.exports.controller = app => {

  app.post('/v1/tag', TagManagerController.addTag);
  app.get('/v1/tag/:short', TagManagerController.findTag);
  app.get('/v1/tag', TagManagerController.findTag);

  app.put('/v1/tag/:short', TagManagerController.modifyTag);
  app.put('/v1/tag', TagManagerController.modifyTag);

};
