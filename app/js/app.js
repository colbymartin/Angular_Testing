const testingAngularApp = angular.module('testingAngularApp', []);

testingAngularApp.controller('testingAngularCtrl', function ($rootScope, $scope, $http, $timeout) {
    $scope.title = "Testing AngularJS Applications";

    $scope.destinations = [];

    $scope.apiKey = '7422a40fcd920a358c61c282f5867464';

    $scope.newDestination = {
        city: undefined,
        country: undefined,
    };

    $scope.addDestination = function () {
        $scope.destinations.push(
            {
                city: $scope.newDestination.city,
                country: $scope.newDestination.country,
            }
        );
    }

    $scope.removeDestination = function (index) {
        $scope.destinations.splice(index, 1);
    };

    $rootScope.messageWatcher = $scope.$watch('message', function () {
        if ($rootScope.message) {
            $timeout(function () {
                $rootScope.message = null;
            }, 3000);
        }
    })
});

testingAngularApp.filter('warmestDestinations', function () {
    return function(destinations, minimumTemp) {
        var warmestDestinations = [];

        angular.forEach(destinations, function (destination) {
            if (destination.weather && destination.weather.temp && destination.weather.temp >= minimumTemp) {
                warmestDestinations.push(destination);
            }
        });
        return warmestDestinations;
    }
});

testingAngularApp.directive('destinationDirective', function () {
    return {
        scope: {
            destination: '=',
            apiKey: '=',
            onRemove: '&',
        },
        template: 
            '<p>{{destination.city}}, {{destination.country}}</p>' +
            '<p ng-if="destination.weather"> - {{destination.weather.main}}, {{destination.weather.temp}}</p>' +
            '<button ng-click="onRemove()">Remove</button>' +
            '<button ng-click="getWeather(destination)">Update Weather</button>',
        controller: function ($http, $rootScope, $scope) {
            $scope.getWeather = function (destination) {
                $http.get('http://api.openweathermap.org/data/2.5/weather?q=' + destination.city + '&appid=' + $scope.apiKey).then(
                    function successCallback (response) {
                        if (response.data.weather) {
                                destination.weather = {},
                                destination.weather.main = response.data.weather[0].main;
                                destination.weather.temp = $scope.convertKelvinToCelsius(response.data.main.temp);
                        } else {
                            $rootScope.message = "City Not Found";
                        }
                    },
                    function errorCallback (error) {
                        $rootScope.message = "Server Error";
                    }
                );
            };
            $scope.convertKelvinToCelsius = function (temp) {
                return Math.round(temp - 273);
            }
        }
    }
});