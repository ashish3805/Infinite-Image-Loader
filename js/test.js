console.log("test")
var test = angular.module("test", []);

test.controller("testCon", function($scope,$http) {
  $scope.imgs=[];
  var getimg=function(){
    $http({
      headers:  {
              'Authorization': 'Client-ID 2caa3460222960b'
            },
      method: 'GET',
      url: 'https://api.imgur.com/3/gallery/hot/'
    }).then(function successCallback(response) {
      appendData(response.data.data);
      }, function errorCallback(response) {
        console.log("error");
      });
  };
  id='qBwa4';
  var getAlbumImg = function(id){
    $http({
      headers:  {
              'Authorization': 'Client-ID 2caa3460222960b'
            },
      method: 'GET',
      url: 'https://api.imgur.com/3/gallery/album/'+id
    }).then(function successCallback(response) {
      parseAlbum(response.data.data.images);
      }, function errorCallback(response) {
        console.log("error");
      });
  };
  var generateList=function(){
    getimg();
  };
  var appendData=function(imgArray){
    imgArray.forEach(function(s){
      if(s.is_album){
        getAlbumImg(s.id);
      }
      else{
        $scope.imgs.push(s.link);
      }
    });
    console.log($scope.imgs.length);
  };
  var parseAlbum=function(albumData){
    albumData.forEach(function(t){
      $scope.imgs.push(t.link);
    });
    console.log($scope.imgs.length);
  };
  generateList();
});
