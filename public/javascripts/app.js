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
    console.log(' wating for proper handler');
    // return window.location.href = this.baseUrl+'/'+id;
  };

  RequestModel.prototype.delete = function(id){
    var self = this;
    var url = this.baseUrl+this.api;
    url += id;

    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this request!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: false
    },
    function(){
      self.AJAX(url,'DELETE');
      swal("Deleted!", "Your request with id: "+id+" has been deleted.", "success");
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
    $( this.selector.content ).on('bindNewActions',function(e){
      $('.button-view-request').unbind().on('click',function(e){
        var id = $(this).parent().data('id');
        model.get(id);
      });

      $('.button-delete-request').unbind().on('click',function(e){
        var id = $(this).parent().data('id');
        model.delete(id);
      });
    });
  };

  RequestView.prototype.bindNewActions = function(){
    return $( this.selector.content ).trigger('bindNewActions');
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
    var count = parseInt($( this.selector.content ).children().length) + 1;
    var newE = $(
    '<div class="thumbnail">' +
      '<div class="caption">' +
        '<div class="row">' +
          '<div class="col-md-6">'  +
            '<h3 data-reqnum="'+count+'">Request #<span>'+count+'</span></h3>'  +
          '</div>'  +
          '<div class="col-md-2 col-md-push-4">'  +
            '<div class="btn-group" role="group" data-id="'+id+'">'  +
              '<button class="btn btn-success button-view-request">'  +
                '<span class="glyphicon glyphicon-eye-open"></span>'  +
              '</button>' +
              '<button class="btn btn-warning button-delete-request">'  +
                '<span class="glyphicon glyphicon-remove"></span>'  +
              '</button>' +
            '</div>'  +
          '</div>'  +
        '</div>'  +
        '<h4 data-createdAt="'+date+'">received data at: <span>'+date+'</span></h4>' +
        '<pre data-body="'+body+'">'+body+'</pre>'  +
      '</div>'  +
    '</div>'
    );

    $(this.selector.content).append( newE );
    this.bindNewActions();
    $(this.selector.count).text( count );
    this.scrollElem( newE );
  };

  RequestView.prototype.removeDeleted = function(id){
    var sel = $('[data-id="'+id+'"]').parents().eq(3);
    sel.remove();

    $( this.selector.count ).text( $( this.selector.content ).children().length );
    this.scrollElem( $( this.selector.count ) );

    $.each( $( this.selector.content ).children(),function(k,v){
      var counter = parseInt(k) + 1;
      $(v).find('h3 span').text( counter );
      $
    });
  };

  return RequestView;
})();

$(function(){
  var socket = new io();
  var model = new RequestModel();
  var view = new RequestView();

  view.bindNewActions();

  socket.on('new request',function(msg){
    return view.appendRequest(msg)
  });

  socket.on('deleted request',function(msg){
    return view.removeDeleted(msg);
  });
});
