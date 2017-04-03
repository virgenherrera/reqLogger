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

$(function(){
  var model = new RequestModel();
  $('.button-view-request').on('click',function(e){
    var id = $(this).parent().data('reqid');
    model.get(id);
  });

  $('.button-delete-request').on('click',function(e){
    var id = $(this).parent().data('reqid');
    model.delete(id);
  });
});
