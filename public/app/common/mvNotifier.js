angular.module('app').value('mvToastr', toastr);

angular.module('app').factory('mvNotifier', function(mvToastr) {
  return {
    notify: function(msg) {
      mvToastr.success(msg);
      console.log(msg);
    },
    error: function(msg) {
      mvToastr.error(msg);
      console.log(msg);
    },
    info: function(msg) {
      mvToastr.info(msg);
      console.log(msg);
    },
    warning: function(msg) {
      mvToastr.warning(msg);
      console.log(msg);
    },
  }
})