angular.module('smiled.application').directive('hideOnHoverParent',
   function() {
      return {
         link : function(scope, element, attrs) {
            element.parent().bind('mouseenter', function() {
                element.hide();
            });
            element.parent().bind('mouseleave', function() {
                 element.show();
            });
       }
   };
});