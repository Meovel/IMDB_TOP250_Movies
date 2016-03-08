var app = angular.module('mp3', ['ngRoute', 'Controller', 'movieProvider']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/search', {
            templateUrl: './partials/list.html',
            controller: 'ListView',
            // Wait till data is loaded
            resolve: {movieLoaded: function(MovieProvider) {
                return MovieProvider.dataLoaded;}
            }
        }).when('/gallery', {
            templateUrl: './partials/gallery.html',
            controller: 'GalleryView',
            resolve: {movieLoaded: function(MovieProvider) {
                return MovieProvider.dataLoaded;}
            }
        })

        .when('/gallery/:imdbID', {
            templateUrl: './partials/details.html',
            controller: 'DetailView',
            resolve: {movieLoaded: function(MovieProvider) {
                return MovieProvider.dataLoaded;}
            }
        })
        // Default view is list
        .otherwise({
            redirectTo: '/search'
        });
}]);


// Append action to elements
var eventListener = angular.module('mp3');

eventListener.directive('searchKeyword', function() {
    return function(scope, element) {
        element.bind('input', function() {
            scope.movieData.operation.filterMovies('title', this.value);
            scope.$apply();
        });
    };
});

eventListener.directive('sortResult', function() {
    return function(scope, element) {
        element.bind('click', function() {
            var atr = this.innerHTML.toLowerCase();
            scope.movieData.operation.sortMovies(atr);
            scope.$apply();
        });
    };
});

eventListener.directive('movieFilter', function() {
    return function(scope, element) {
        element.bind('change', function() {
            if (this.value === 'All') {
                scope.movieData.operation.setFilterResult(scope.movieData.movies);
            } else {
                scope.movieData.operation.filterMovies('genre', this.value);
            }
            scope.$apply();
        });
    };
});
