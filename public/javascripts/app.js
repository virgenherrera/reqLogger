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
    return window.location.href = this.baseUrl+'/'+id;
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
    this.count = $( this.selector.count ).length;
  }

  RequestView.prototype.appendRequest = function(id,date,body){
    body = JSON.stringify( body,null,4 );
    this.count++;
    var newE = $(
    '<div class="thumbnail">' +
      '<div class="caption">' +
        '<div class="row">' +
          '<div class="col-md-6">'  +
            '<h3 data-reqnum="'+this.count+'">Request #<span>'+this.count+'</span></h3>'  +
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
    return $(this.selector.count).text( this.count );
  };

  return RequestView;
})();

$(function(){
  var model = new RequestModel();

  $('.button-view-request').on('click',function(e){
    var id = $(this).parent().data('id');
    model.get(id);
  });

  $('.button-delete-request').on('click',function(e){
    var id = $(this).parent().data('id');
    model.delete(id);
  });
});
