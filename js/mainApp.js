/*
	Creating an Object of Angular js mainApp reference to ng-app="mainApp" in the html file....
*/
var mainApp = angular.module("mainApp", []);

/*
	The controller of div element ng-controller="rowCon" in html file is created....
*/
mainApp.controller("rowCon", function($scope) {

/*rows and colm are arrays that keeps row no and column no respectively*/
	$scope.rows=[];
	$scope.colm = [];
	$scope.no_colm = 0;//no of columns

	var img_height =  320;// fixed height of one image.
	/*Capturing screen Height and adding offset for smooth scrolling*/
	var screenHeight = window.innerHeight + 640;
	var screenWidth  = window.innerWidth;
	/*Calculating no of images to display*/
	no_rows=parseInt(screenHeight/img_height);
	var prev = no_rows+1;
	for(var i=1;i<=no_rows;i++){
				$scope.rows[i-1]=i;
			}

	if(screenWidth > 991){//then 3 images per row
		$scope.colm = [1,2,3];
		$scope.no_colm = 3;
	}
	else if (screenWidth > 768){//then 2 images per row
		$scope.colm = [1,2];
		$scope.no_colm = 2;
	}
	else{
		$scope.colm = [1];// if small screen then 1 image per row
		$scope.no_colm = 1;
	}

	MAX_IMAGES=28 //no of images in ./images directory

	/*detecting Scrolling and binding it to controller $digest() angularJs function*/
	window.addEventListener('scroll',function(){
			var totalHeight = screenHeight + window.pageYOffset ;
			no_rows=parseInt(totalHeight/img_height);

			/* calculating rows */
			for(var i=prev;i<=no_rows&&i<MAX_IMAGES/$scope.no_colm;i++){
				$scope.rows.push(i);
			}
			prev = no_rows+1;
			$scope.$digest();
		});
	});
	