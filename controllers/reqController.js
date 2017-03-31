"use strict";
var models = require("../models");

var reqController = (function(){
  function reqController(){

  }

  reqController.prototype.find = function(id,cb){
    var where = ( id ) ? {where: {id: id}} : {};

    models.request.findAndCountAll( where )
    .then((data)=>{
      return {
        count: data.count,
        rows: data.rows.map(row=>{
          row.body = JSON.parse(row.body);
          return row;
        }),
      };
    })
    .then(rows=>{
      console.log(typeof rows.rows[0].body);
      return cb({
        error: false,
        data: rows,
      });
    })
    .catch((err)=>{
      return cb({
        error: true,
        data: err,
      });
    });
  };

  reqController.prototype.save = function(request,cb){
    var data = {
      body: JSON.stringify( request )
    };

    models.request.create(data)
    .then((data)=>{
      return cb({
        error: false,
        data: data,
      });
    })
    .catch((err)=>{
      return cb({
        error: true,
        data: err,
      });
    });
  };

  reqController.prototype.delete = function(id,cb){
    models.request.findById(id)
    .then(data=>{
      return data.destroy();
    })
    .then(data=>{
      return cb({
        error: true,
        data: data,
      });
    })
    .catch(error=>{
      return cb({
        error: true,
        data: error,
      });
    });
  }

  return reqController;
})();

module.exports = reqController;
