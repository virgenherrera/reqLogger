var express = require('express');
var reqController = require('../controllers/reqController');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var ctrl = new reqController(true);

  ctrl.find(null,function(query){
var data = {
  title: 'Received requests:',
  count: query.data.count,
  rows: query.data.rows
};
    console.log(data.rows[0].body);

    return res.render('index', data);
  });
});

module.exports = router;
