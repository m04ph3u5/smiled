'use strict';
/*global angular*/

/**
 * The element being dragged is referred to as source
 * The element being dropped is referred to as target
 * onDrag takes one parameter: source
 * onDrop takes two parameters: source, target
 * The element being dragger will be added a class dragClass
 * The element being dragger over will be added a class dragOverClass
 *
 * Note that to save the global drag state, we store the dragged source on $rootScope,
 * there should exist a better way to do this
 */
angular.module('ngDragDrop', [])
  .directive('dragAndDrop', ['$rootScope', function ($rootScope) {
    return {
      restrict: 'A',
      scope: true,

      link: function (scope, element, attrs, controller) {

        var dragClass = 'dragged';
        var dragOverClass = 'dragover';

        // set it draggable
        element.attr('draggable', 'true');

        // the source will only be set when the drag start
        $rootScope.dragSource = null;
        var object = scope.$eval(element.attr('drag-and-drop'));

        scope.enteredTimes = 0;
        scope.$watch('enteredTimes', function (val) {
          if (val > 0) {
            element.addClass(dragOverClass);
          } else {
            element.removeClass(dragOverClass);
          }
        });

        var onDrag = scope.$eval(element.attr('on-drag'));
        var onDrop = scope.$eval(element.attr('on-drop'));

        element.bind('dragstart', function (e) {
          $rootScope.dragSource = object;
          if (angular.isFunction(onDrag)) {
            onDrag($rootScope.dragSource);
          }
          element.addClass(dragClass);
        });

        element.bind('dragend', function (e) {
          element.removeClass(dragClass);
        });

        element.bind('dragover', function (e) {
          // The element is over the same source element,
          // do nothing
          if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
          }

          return false;
        });

        element.bind('dragenter', function (e) {
          if (object === $rootScope.dragSource) {
            return;
          }

          scope.$apply(function() {
            scope.enteredTimes += 1;
          });

        });

        element.bind('dragleave', function (e) {
          if (object === $rootScope.dragSource) {
            return;
          }

          scope.$apply(function() {
            scope.enteredTimes -= 1;
          });
        });

        element.bind('drop', function (e) {
          if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
          }

          if (e.stopPropagation) {
            e.stopPropagation(); // Necessary. Allows us to drop.
          }

          scope.$apply(function() {
            scope.enteredTimes -= 1;
          });

          // only call the callback function if we get valid target
          if (angular.isFunction(onDrop)) {
            onDrop($rootScope.dragSource, object);
          }

        });

      }
    };
  }])
  .directive('droppable', ['$rootScope', function ($rootScope) {

    return {
      restrict: 'A',

      link: function (scope, element, attrs, controller) {

        var dragOverClass = 'dragover';
        element.bind('dragenter', function (e) {
          element.addClass(dragOverClass);
        });

        element.bind('dragleave', function (e) {
          element.removeClass(dragOverClass);
        });
      }
    };
  }]);
