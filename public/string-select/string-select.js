(function () {

    var stringSelect = angular.module('stringSelect', [
    ]);

    stringSelect.directive('stringSelect', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ngModel: '=?',
                options: '=?',
                editable: '=?'
            },
            templateUrl: 'string-select/string-select.html',
            controller: 'StringSelectCtrl'
        };
    });

    stringSelect.controller('StringSelectCtrl', ['$scope', function ($scope) {
        $scope.optionsList = [];

        $scope.getOptionByValue = function( value ) {
            var result = undefined;
            $scope.optionsList.forEach(function(option) {
                if(option.value === value)
                    result = option;
            });
            return result;
        };

        $scope.$watch('options', function(options) {
            $scope.optionsList = [];
            for(var key in options) {
                if(options.hasOwnProperty(key)) {
                    var name = options[key];
                    var option = {
                        value: parseInt(key, 10), 
                        name: name
                    };
                    $scope.optionsList.push(option);
                }
                if($scope.ngModel !== undefined) {
                    var option = $scope.getOptionByValue($scope.ngModel);
                    $scope._model = option;
                }
            }
        });

        $scope.$watch('ngModel', function(model) {
            if(model === undefined)
                return;
            var option = $scope.getOptionByValue(model);
            $scope._model = option;
        });

        $scope.$watch('_model', function(_model) {
            if(_model === undefined)
                return;
            $scope.model = _model.value;
        });
    }]);

}());
