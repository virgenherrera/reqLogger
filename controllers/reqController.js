"use strict";
var models = require("../models");
var io = require('socket.io-client')('http://localhost:3001');

var reqController = (function(){
  function reqController(plain){
    this.plain = (plain);
  }

  reqController.prototype.notify = function(type,msg){
    return new Promise(function(F,R){
      return F( io.emit(type,msg) );
    });
  };

  reqController.prototype.find = function(id,cb){
    var where = ( id ) ? {where: {id: id}} : {};

    models.request.findAndCountAll( where )
    .then((data)=>{
      return {
        count: data.count,
        rows: data.rows.map(row=>{
          row.body = JSON.parse(row.body);
          return (this.plain) ? row.dataValues : row;
        }),
      };
    })
    .then(rows=>{
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
      body: JSON.stringify( request, null, 4 )
    };

    models.request.create(data)
    .then(data=>{
      this.notify('new request',{
        id: data.id,
        body: data.body,
        date: data.createdAt,
      });

      return data;
    })
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
      this.notify('deleted request',data.id);
      return data;
    })
    .then(data=>{
      return cb({
        error: false,
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

  reqController.prototype.deleteBatch = function(iDs,cb){
    models.request.sequelize.transaction(T1=>{
      var promises = [];

      for (var i = 0; i < iDs.length; i++) {
        // iDs[i]
        promises.push( models.request.destroy({ where: { id: iDs[i] } }, {transaction: T1 }) );
        this.notify('deleted request', iDs[i] );
      }

      return Promise.all( promises );
    })
    .then(data=>{
      return cb({
        error: false,
        data: data,
      });
    })
    .catch(error=>{
      return cb({
        error: true,
        data: error,
      });
    });
  };

  return reqController;
})();

module.exports = reqController;
