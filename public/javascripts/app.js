var RequestModel = (function(){
  function RequestModel(domain,api){
    this.baseUrl =  domain || window.location.origin;
    this.api =      api || '/api/v1/logger/';
  }

  RequestModel.prototype.AJAX = function(url,method,data,cb){
    var xhrConf = {
      url:    url || this.baseUrl+this.api,
      method: method || 'GET',
      data: data || null,
      dataType: 'json',
      context: this,
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      success: cb,
    };
    return $.ajax( xhrConf );
  };

  RequestModel.prototype.get = function(id){
    console.log('i will show expanded info for req with id: '+id);
    // return window.location.href = this.baseUrl+'/'+id;
  };

  RequestModel.prototype.delete = function(id){
    var url = this.baseUrl+this.api;
    url += id;

    this.AJAX(url,'DELETE',null,function(){
      swal({
        title: "Deleted!",
        text: "Your request with id: "+id+" has been deleted.",
        timer: 1000,
        showConfirmButton: false,
        type: "success",
      });
    });
  };

  RequestModel.prototype.deleteSelected = function(selIds){
    if(selIds.constructor !== Array) return;

    var url = this.baseUrl+this.api+'batch';

    this.AJAX(url,'DELETE',{ids:selIds},function(a){
      swal({
        title: "Deleted!",
        text: "Your selection has been deleted.",
        timer: 1000,
        showConfirmButton: false,
        type: "success",
      });
    });
  };

  return RequestModel;
})();

var RequestView = (function(){
  function RequestView(){
    this.selector = {
      content: '#content',
      count: '#count',
    };

    return this.init();
  }

  RequestView.prototype.Model = new RequestModel();

  RequestView.prototype.init = function(){
    var model = this.Model;

    // bind select all button
    $('#selected-all').unbind().on('click',function(e){
      // prevent default
      e.preventDefault();

      // toogle select all text and icon button
      if( $('#selected-all span').hasClass('glyphicon-ok') ){
        $(this).html('Unselect All <span class="glyphicon glyphicon-remove"></span>');
      } else {
        $(this).html('Select All <span class="glyphicon glyphicon-ok"></span>');
      }

      // toggle select all requests and select btns
      $('[data-id]').toggleClass('selected-request');
      $('.button-select-request span').toggleClass('glyphicon-check glyphicon-ban-circle');
    });

    // bind delete all button
    $('#delete-selected').unbind().on('click',function(e){
      var selectedIDs = [];
      // prevent default
      e.preventDefault()

      // walk selected requests
      $.each($('.selected-request'),function(k,v){
        // collect selected iDs
        selectedIDs.push( $(v).data('id') );
      });

      // execute delete-selected if there are any selected
      if( selectedIDs.length ){
        model.deleteSelected( selectedIDs );
      } else {
        swal({
          title: "Hey!",
          text: "nothing selected to delete",
          timer: 1500,
          showConfirmButton: false,
          type: "warning",
        });
      }
    });

    // publish bind options-actions
    $( this.selector.content ).on('bind-option-buttons-action',function(e){
      // binding for view-button
      $('.button-view-request').unbind().on('click',function(e){
        var reqItem = $(this).closest("[data-id]");
        var id = reqItem.data('id');
        model.get(id);
      });

      // binding for delete-button
      $('.button-delete-request').unbind().on('click',function(e){
        var reqItem = $(this).closest("[data-id]");
        var id = reqItem.data('id');
        model.delete(id);
      });

      // binding for select-button
      $('.button-select-request').unbind().on('click',function(e){
        var reqItem = $(this).closest("[data-id]");
        var id = reqItem.data('id');

        //select req container
        reqItem.toggleClass('selected-request');

        // change button glyphicon
        $(this).find('span').toggleClass('glyphicon-check glyphicon-ban-circle')
      });
    });
  };

  RequestView.prototype.bindNewActions = function(){
    return $( this.selector.content ).trigger('bind-option-buttons-action');
  };

  RequestView.prototype.scrollElem = function(sel){
    return $('html, body').animate({
      scrollTop: sel.offset().top
    },1000);
  };

  RequestView.prototype.appendRequest = function(msg){
    var id  = msg.id;
    var date  = msg.date;
    var body  = msg.body;
    var count = parseInt($( '#request-container' ).children().length) + 1;
    var newE = $(
      '<div class="col-md-4 portfolio-item" data-id="'+id+'" style="display: none;">' +
        '<h3>'  +
          '<a href="#">'  +
            'Request #' +
            '<span>'+count+'</span>' +
          '</a>'  +
        '</h3>' +
        '<ul>'  +
          '<li>'  +
            'received date:'  +
            '<code>'+date+'</code>' +
          '</li>' +
          '<li>'  +
            'Body:' +
            '<pre style="height: 200px;">'+body+'</pre>'  +
          '</li>' +
        '</ul>' +
        '<div class="panel-heading clearfix">'  +
          '<div class="btn-group pull-right">'  +
            '<div class="btn-group" role="group">'  +
              '<button class="btn btn-default btn-sm button-view-request">' +
                '<span class="glyphicon glyphicon-eye-open"></span>'  +
              '</button>' +
              '<button class="btn btn-default btn-sm button-delete-request">' +
                '<span class="glyphicon glyphicon-remove"></span>'  +
              '</button>' +
              '<button class="btn btn-default btn-sm button-select-request">' +
                '<span class="glyphicon glyphicon-check"></span>' +
              '</button>' +
            '</div>'  +
          '</div>'  +
          '<h3 class="panel-title pull-right" style="padding-top: 7.5px;">Options:</h3>'  +
        '</div>'  +
        '<hr>'  +
      '</div>'
    );

    newE.appendTo('#request-container').show('slow');

    this.bindNewActions();
    $(this.selector.count).text( count );
    this.scrollElem( newE );
  };

  RequestView.prototype.removeDeleted = function(id){
    var sel = $('[data-id="'+id+'"]');

    sel.hide('slow', function(){ sel.remove(); });
    $( this.selector.count ).text( $( '#request-container' ).children().length );

    $.each( $( '#request-container' ).children(),function(k,v){
      $(v).find('h3 a span').text( k );
      $
    });
  };

  return RequestView;
})();

$(function(){
  var socket = new io();
  var view = new RequestView();

  view.bindNewActions();

  socket.on('new request',function(msg){
    return view.appendRequest(msg)
  });

  socket.on('deleted request',function(msg){
    return view.removeDeleted(msg);
  });
});
