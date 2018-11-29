const Rep = require('../models/Representative');

const RepManagerController = {
  
  addRep: async(req, res) => {
    try {
      let result = await Rep.createItem(req.body);
      res.send(result);
    } catch (err) {
      res.status(500).send('Unknown database error');
    }
  },

  findRep: async(req, res) => {
    let target = req.params.short;
    try{
      let result;
      (target != undefined) ? result = await Rep.getItem(target) : result = await Rep.getItems();
      res.send(result);
    } catch (err) {
      res.status(500).send('Unknown database error');
    }
  },

  modifyRep: async(req, res) => {
    let data = req.body;
    let id = req.params.short;
    if(id !== undefined) {
      try {
        let result = await Rep.updateItem(id, data);
        res.send(result);
      } catch (err) {
        res.status(500).send('Unknown database error');
      }
    } else {
      res.status(400).send('Required data missing');
    }
  }

};

module.exports.Controller = RepManagerController;
module.exports.controller = app => {

  app.post('/v1/rep', RepManagerController.addRep);
  app.get('/v1/rep/:short', RepManagerController.findRep);
  app.get('/v1/rep', RepManagerController.findRep);

  app.put('/v1/rep/:short', RepManagerController.modifyRep);
  app.put('/v1/rep', RepManagerController.modifyRep);

};
