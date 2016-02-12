/*
	Creating an Object of Angular js mainApp reference to ng-app="mainApp" in the html file....
*/
var mainApp = angular.module("mainApp", []);

/*
	The controller of div element ng-controller="rowCon" in html file is created
*/


mainApp.controller("rowCon", function($scope,$http) {
	$scope.imgs=[];
	$scope.message="";
	var IMG_HEIGHT=160;
	var IMG_WIDTH=160;
	var areaOfImgs=function(){
		return 160*160;
	};
	$scope.getTimes=function(n){
		var myarray=[];
		for(var i=0;i<n;i++)
			myarray.push(i);
		return myarray;
	};
  var getimg=function(callback){
    $http({
      headers:  {
              'Authorization': 'Client-ID 2caa3460222960b'
            },
      method: 'GET',
      url: 'https://api.imgur.com/3/gallery/hot/'
    }).then(function successCallback(response) {
      appendData(response.data.data,callback);
			callback();
      }, function errorCallback(response) {
        console.log("error");
      });
  };
  id='qBwa4';
  var getAlbumImg = function(id,callback){
    $http({
      headers:  {
              'Authorization': 'Client-ID 2caa3460222960b'
            },
      method: 'GET',
      url: 'https://api.imgur.com/3/gallery/album/'+id
    }).then(function successCallback(response) {
      parseAlbum(response.data.data.images);
			callback();
      }, function errorCallback(response) {
        console.log("error");
      });
  };
  var generateList=function(callback){
    getimg(callback);
  };
  var appendData=function(imgArray,callback){
    imgArray.forEach(function(s){
      if(s.is_album){
        getAlbumImg(s.id,callback);
      }
      else{
				s.link=s.link.substring(0, s.link.lastIndexOf('.')) + "t" + s.link.substring(s.link.lastIndexOf('.'), s.link.length);
        $scope.imgs.push(s.link);
      }
    });
  };
  var parseAlbum=function(albumData){
    albumData.forEach(function(t){
			t.link=t.link.substring(0, t.link.lastIndexOf('.')) + "t" + t.link.substring(t.link.lastIndexOf('.'), t.link.length);
      $scope.imgs.push(t.link);
    });
  };
	var calc_screen_init=function(max_images){
		var no_img=(window.innerHeight*window.innerWidth)/(areaOfImgs())+5;
		if(no_img>max_images)
			$scope.n=max_images;
		else
			$scope.n=no_img;
	};

 	generateList(function(){
		MAX_IMG=$scope.imgs.length;
		calc_screen_init(MAX_IMG);
	});

	var prevOffset=0;

	window.addEventListener('scroll',function(){
		if(window.pageYOffset>prevOffset){
			var nArea=window.pageYOffset*window.innerWidth;
			var x=nArea/areaOfImgs();
			if(($scope.n+x)<MAX_IMG)
				$scope.n+=x;
			else{
				$scope.n=MAX_IMG;
				$scope.message="END OF IMAGES";
			}
			console.log($scope.n);
			prevOffset=window.pageYOffset;
			$scope.$digest();
		}
	});
});
