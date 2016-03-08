var Controller = angular.module('Controller', ['movieProvider']);

Controller.controller('ListView', ['$scope', 'MovieProvider',
    function ($scope, MovieProvider) {
        $scope.movieData = MovieProvider.getAllMovies;
        $scope.movieData.operation.init();
    }

]);

Controller.controller('GalleryView', ['$scope', 'MovieProvider',
    function ($scope, MovieProvider) {
        $scope.movieData = MovieProvider.getAllMovies;
        $scope.movieData.operation.init();
    }
]);

Controller.controller('DetailView', ['$scope', '$routeParams', '$location', 'MovieProvider',
    function ($scope, $routeParams, $location, MovieProvider) {
        $scope.movieData = MovieProvider.getAllMovies;
        if (!$scope.movieData.movieDic) $scope.movieData.operation.createDic();

        $scope.movie = $scope.movieData.movieDic[$routeParams.imdbID];
        $scope.movieNumber = $scope.movieData.filteredMovies.length;
        // find the current movie in filtered movie list
        $scope.currentIndex = $scope.movieData.filteredMovies.indexOf($scope.movie);

        $scope.prevMovie = function() {
            var relativeIndex = ($scope.currentIndex+$scope.movieNumber-1) % $scope.movieNumber;
            var imdbID = $scope.movieData.filteredMovies[relativeIndex].imdbID;
            $location.path('/gallery/'+imdbID);
        };
        $scope.nextMovie = function() {
            var relativeIndex = ($scope.currentIndex+1) % $scope.movieNumber;
            var imdbID = $scope.movieData.filteredMovies[relativeIndex].imdbID;
            $location.path('/gallery/'+imdbID);
        };
    }
]);


// A filter on name and genre
var Filter = angular.module('Filter', []);

Filter.filter('movieFilter', function() {
    return function(array, atr, keyword) {
        var result = [];
        array.forEach(function(movie) {
            if (movie[atr]) {
                if (movie[atr].indexOf(keyword) != -1) result.push(movie);
            }
        });
        return result;
    };
});


// A provider service for all views
var movieProvider = angular.module('movieProvider', ['Filter']);

movieProvider.factory('MovieProvider', ['$http', '$filter', function($http, $filter) {

    var query = $http.get('./data/imdb250.json').
    success(function(data) {
        movieData.movies = data;
    }).
    error(function(err) {
        console.log('ERROR_STATUS: ' + err.status);
    });

    var movieData = {
        // Var declaration
        genres: ['All', 'Action', 'Adventure', 'Animation', 'Biography',
            'Comedy', 'Crime', 'Drama', 'Family', 'Fantasy', 'Film-Noir', 'History',
            'Horror', 'Music', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Sport',
            'Thriller', 'War', 'Western'],
        movieDic: false, // Map imdbID to movie
        movies: [], // All movies in database
        filteredMovies: [], // Movies shown in current view
        isSortedBy: '',

        // Operations on movie data
        operation: {
            init: function () {
                movieData.operation.setFilterResult(movieData.movies);
                movieData.operation.sortMovies('rank');
            },

            createDic: function () {
                movieData.movieDic = {};
                for (var i=0; i<movieData.movies.length; i++) {
                    movieData.movieDic[movieData.movies[i].imdbID] = movieData.movies[i];
                }
            },

            // Set the actual movies to be displayed
            setFilterResult: function (movies) {
                movieData.filteredMovies = movies;
            },

            filterMovies: function (atr, keyword) {
                var result = $filter('movieFilter')(movieData.movies, atr, keyword);
                movieData.operation.setFilterResult(result);
            },

            sortMovies: function (atr) {
                if (movieData.isSortedBy === atr) {
                    movieData.filteredMovies.reverse();
                } else {
                    movieData.filteredMovies.sort(
                        function(a, b){
                            if (a[atr] === b[atr]) return 0;
                            else if (a[atr] > b[atr]) return 1;
                            else return -1;
                        });
                    movieData.isSortedBy = atr;
                }
            },

        },
    };

    return {
        dataLoaded: query,
        getAllMovies: movieData,
    };

}]);
