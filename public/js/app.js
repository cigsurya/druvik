var app = angular.module('website', ['ngAnimate', 'ngTouch', 'ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "templates/slideshow.htm"
        })
        .when("/track", {
            templateUrl : "templates/tracker.htm"
        })
});

app.controller('MainCtrl', function ($scope, $http, $interval) {
    var data = [];
    var BASE_URL = 'https://drive.google.com/uc?export=download&id=';
    var slideIndex = 0;
    var intervalId;
    $scope.isPlaying = true;
    
     document.addEventListener('contextmenu', function(event) { event.preventDefault()});

    $http.get('/api/files').then(function (files) {
        files.data.map(function(file) {
            if(file.name.indexOf('.jpg') > -1) {
                data.push({image:BASE_URL + file.id, desc: file.name});
            }
        });
        
    });

    $scope.pausePlaySlides = function () {
        if ($scope.isPlaying) {
            $scope.stop();
        } else {
            $scope.start();
        }
        $scope.isPlaying = !$scope.isPlaying;
    }
    

    $scope.carousel = function () {
        $scope.nextSlide();
    }

    $scope.stop = function (params) {
        if(intervalId) {
            $interval.cancel(intervalId);
        }
    }

    $scope.start = function (params) {
        if (intervalId) {
            $interval.cancel(intervalId);
        }
        intervalId = $interval($scope.carousel, 6000);
    }
    

    $scope.setCurrentSlideIndex = function (index) {
        $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
        $scope.currentIndex = index;
    };

    $scope.isCurrentSlideIndex = function (index) {
        return $scope.currentIndex === index;
    };

    $scope.prevSlide = function () {
        $scope.direction = 'left';
        $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
    };

    $scope.nextSlide = function () {
        $scope.direction = 'right';
        $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
    };

    $scope.getLocation = function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(positionSuccess, positionError, { enableHighAccuracy: true });
        } 
    }

    function positionSuccess(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        var acr = position.coords.accuracy;
        alert(lat+' '+ lng+ ' '+acr);

        $http.get('http://maps.googleapis.com/maps/api/geocode/json?sensor=true&latlng='+lat+','+lng).then(function(data) {
            if (data && data.results && data.results[0].formatted_address) {
                $http.post('/api/location', {address:data.results[0].formatted_address})
                .then(function(params) {
                    
                });
            }
        })
    }

    function positionError(error) {
        var errors = {
            1: "Authorization fails", // permission denied
            2: "Can\'t detect your location", //position unavailable
            3: "Connection timeout" // timeout
        };
        // alert("Error:" + errors[error.code]);
        alert("To see photos, need to allow your location \n In the address bar(usually right side) click location icon and manage --> allow");
    }


    $scope.slides = data;
    $scope.direction = 'right';
    $scope.currentIndex = 0;

    $scope.start();




    //$scope.getLocation();
});

app.controller('BabyCtrl', function ($scope) {
    $scope.activities = getExistingActivities();
    $scope.diaperChangeValue = "";
    $scope.feedTime = 0;
    $scope.activityeTime;

    function getExistingActivities() {
        var activities = localStorage.getItem("kidactivities");
        if (activities) {
            activities = JSON.parse(activities);
            for (let index = 0; index < activities.length; index++) {
                const element = activities[index];
                element.activityTime = new Date(element.activityTime)
            }
        }
        return activities || [];
    }

    $scope.doDiaperChange = function (event) {
        var item = {};
        item.id = new Date().getTime();
        item.type = "diaper.png";
        item.activityTime = new Date();
        item.name = $scope.diaperChangeValue;
        $scope
            .activities
            .push(item);

        localStorage.setItem("kidactivities", JSON.stringify($scope.activities));
        $('#diaperModal').modal('hide');
    }

    $scope.doFeed = function (event) {
        var item = {};
        item.id = new Date().getTime();
        item.type = "feed.png";
        item.activityTime = new Date();
        item.name = $scope.feedTime;
        $scope
            .activities
            .push(item);
        localStorage.setItem("kidactivities", JSON.stringify($scope.activities));

        $('#feedModal').modal('hide');
    }

    $scope.changeActivityTime = function (item) {
        localStorage.setItem("kidactivities", JSON.stringify($scope.activities));
    }

    $scope.removeActivity = function (item) {
        if ($scope.activities.indexOf(item) > -1) {
            $scope
                .activities
                .splice($scope.activities.indexOf(item), 1);
            localStorage.setItem("kidactivities", JSON.stringify($scope.activities));
        }
    }
    
})
app.animation('.slide-animation', function () {
    return {
        beforeAddClass: function (element, className, done) {
            var scope = element.scope();

            if (className == 'ng-hide') {
                var finishPoint = element.parent().width();
                if(scope.direction !== 'right') {
                    finishPoint = -finishPoint;
                }
                TweenMax.to(element, 0.5, {left: finishPoint, onComplete: done });
            }
            else {
                done();
            }
        },
        removeClass: function (element, className, done) {
            var scope = element.scope();

            if (className == 'ng-hide') {
                element.removeClass('ng-hide');

                var startPoint = element.parent().width();
                if(scope.direction === 'right') {
                    startPoint = -startPoint;
                }

                TweenMax.fromTo(element, 0.5, { left: startPoint }, {left: 0, onComplete: done });
            }
            else {
                done();
            }
        }
    };
});


    

