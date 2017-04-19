"use strict";
var express = require('express');
var router = express.Router();
var RequestController = require('../../../controllers/reqController');

/* GET home page. */
router
.post('/', function(req, res, next) {
  var ctrl = new RequestController();
  ctrl.save(req.body,(data)=>{
    var status = (data.error) ? 500 : 201;
    return res
    .status(status)
    .json(data.data);
  });
})
.get('/:id?', function(req, res, next) {
  var id = (req.params.id) ? req.params.id : null ;
  var ctrl = new RequestController();

  ctrl.find(id,(data)=>{
    var status = (data.error) ? 404 : 200;

    return res
    .status(status)
    .json( data.data );
  });
})
.delete('/batch',function(req,res,next){
  var ctrl = new RequestController();
  var iDs = req.body['ids[]'];

  if( iDs.constructor !== Array ){
      return res
      .status(404)
      .json({
        error:true,
        msg:'Exclusive endpoint for batch removal',
        dataReceived:iDs});
  }

  ctrl.deleteBatch(iDs,(data)=>{
    var status = (data.error) ? 404 : 200;

    return res
    .status(status)
    .json( data.data );
  });
})
.delete('/:id',function(req,res,next){
  var id = req.params.id;
  var ctrl = new RequestController();

  ctrl.delete(id,(data)=>{
    var status = (data.error) ? 404 : 200;

    return res
    .status(status)
    .json( data.data );
  });
})
;

module.exports = router;
