'use strict';
angular.module('app').value('kssToastr', toastr);

angular.module('app').factory('kssNotifier', function(kssToastr) {
  return {
    notify: function(msg) {
      kssToastr.success(msg);
      console.log(msg);
    },
    error: function(msg) {
      kssToastr.error(msg);
      console.log(msg);
    },
    info: function(msg) {
      kssToastr.info(msg);
      console.log(msg);
    },
    warning: function(msg) {
      kssToastr.warning(msg);
      console.log(msg);
    }
  }
})