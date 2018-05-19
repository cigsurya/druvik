angular.module('website', ['ngAnimate', 'ngTouch'])
    .controller('MainCtrl', function ($scope, $http, $interval) {
        // $scope.slides = [
        //     {image: 'https://drive.google.com/uc?export=download&id=1mtkZoRo3RYogFJu15rL_9YcYoDJveGzA', description: 'Image 00'},
        //     {image: 'https://drive.google.com/uc?export=download&id=1Yq75ArxZ_wy7ZjZEIajYDZtPDuWA_1Jx', description: 'Image 01'},
        //     {image: 'https://drive.google.com/uc?export=download&id=1s1NPvi3d_J1_ehZ7aXfYWWjKsqwRvyWo', description: 'Image 02'},
        //     {image: 'https://drive.google.com/uc?export=download&id=1nbfwFR80tD3aDS8ac-7arLCpICcefiuB', description: 'Image 03'},
        //     {image: 'https://drive.google.com/uc?export=download&id=1mAkUnICzo71mUAjE8dcXiuvdHItKvJ6l', description: 'Image 04'}
        // ];
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
            $scope.slides = data;
            $scope.direction = 'right';
            $scope.currentIndex = 0;

            $scope.start();
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
            intervalId = $interval($scope.carousel, 3000);
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
    })
    .animation('.slide-animation', function () {
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

