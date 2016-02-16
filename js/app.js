/*
imgs array is updated using ajax from imgur, indexes less than used_no have been displayed
and still req_no of images are needed for the screen.
'end' is true when appEnd div containing 'End of images' have been displayed.
*/
var imgs=new Array();
var used_no=0,req_no=0;
var prevScroll=0;
var end=false;

var config={
	'Authorization': 'Client-ID 2caa3460222960b',
		'url': 'https://api.imgur.com/3/gallery/hot/',
    'imgWidth':160,
    'imgHeight':160
};
/*
start of imgur specific functions
*/
/*
for imgur given a url say http://i.xyz.jpg then its thumbnail(160px*160px) is found by appending image file name with 't'
i.e. thumbnail is at http://i.xyzt.jpg
*/
var getThumb=function(url){
  if(url[url.lastIndexOf('.')-1]!='h'){//its imgur exception some times it by default sends thumbnails
      url=url.substring(0, url.lastIndexOf('.')) + "t" + url.substring(url.lastIndexOf('.'), url.length);
  }else {
      url=url.substring(0, url.lastIndexOf('.')-1) + "t" + url.substring(url.lastIndexOf('.'), url.length);
  }
  return url;
}
/*
cbArray contains one object for each ajax call. object it containes is named as:
cb followed by an unique id indentifying that ajax call.
id is uniquely assaigned to each ajax call by incrementing counter.
ex:cbArray[cb1,cb2,cb3....] and cb1={},cb2={} which oncompletion of ajax call gets property 'status':true
i.e. cb1={'status:true'},cb2={'status:true'},...
*/
var cbArray={};
var counter=0;
var stock=0;
var getAlbumImg=function(id,callback){
	var cbId=++counter;
	cbArray['cb'+cbId]={};
	var request = new XMLHttpRequest();
	request.open("GET", 'https://api.imgur.com/3/gallery/album/'+id);
  request.setRequestHeader('Authorization', config.Authorization);
	request.onreadystatechange = function() {
			if (request.readyState === 4 && request.status === 200) {
        var data=JSON.parse(request.responseText);
					cbArray['cb'+cbId].status=true;//request has ended
          callback(data);
      }
      else if(request.status!==200){
        console.log("error"+request.status);
      }
    }
    request.send(null);
};

function getImgList(config, callback) {
	var cbId=++counter;
	cbArray['cb'+cbId]={};
	var request = new XMLHttpRequest();
	request.open("GET", config.url);
  request.setRequestHeader('Authorization', config.Authorization);
	request.onreadystatechange = function() {
			if (request.readyState === 4 && request.status === 200) {
						cbArray['cb'+cbId].status=true;//requst has ended
            var data=JSON.parse(request.responseText);
            for(x of data.data){
                if(!x.is_album){
									++stock;
                  imgs.push(getThumb(x.link));//append the imgs array with url of thumbnail
                }
                else{
									//if given link is of album not image then get details of album and then get all its image
                  getAlbumImg(x.id,function(album_data){
											stock+=album_data.data.images_count;
                      for(img of album_data.data.images)
                      imgs.push(getThumb(img.link));
                      callback();
                  });
                }
            };
						callback();
				}
			};
      request.send(null);
};
/*
checkEnd determines if all images source have been displayed.
it sees all ajax call status in cbArray and if all have ended displays appEnd div.
*/
var checkEnd=function(){
	var fl=true;
	for(cb in cbArray){
		if(!cbArray[cb].hasOwnProperty("status")){
			fl=false;
			break;
		}
	};
	if(fl&&(stock==used_no)&&(!end)){
		end=true;
		document.getElementById("mainApp").innerHTML +=
		'<div id="appEnd"><p>End Of Images</p></div>';
	}
}
/*
End of imgur Specific functions
*/

/*
addScreen function is fired on Event of scrolling. it calculates how many new images are to be inserted.
*/
var addScreen=function(){
  var elem = document.getElementById("mainApp");
  var w=parseInt(window.getComputedStyle(elem,null).getPropertyValue("width"));
  var imgDiv=document.getElementById("mainApp");
  if(imgDiv.scrollTop>prevScroll){
    req_no+=((imgDiv.scrollTop-prevScroll)*w)/(config.imgWidth*config.imgHeight);
    prevScroll=imgDiv.scrollTop;
    dispImg();
  }
};
/*
Intialises req_no i.e. no of images initially required for screen by taking width and height of conatiner 'mainApp'.
sets the event onscroll on mainApp
*/
var screenInit=function(){
  var elem = document.getElementById("mainApp");
  var h=parseInt(window.getComputedStyle(elem,null).getPropertyValue("height"));
  var w=parseInt(window.getComputedStyle(elem,null).getPropertyValue("width"));
  req_no=(h*w)/(config.imgHeight*config.imgWidth)+10;
  document.getElementById("mainApp").setAttribute("onscroll","addScreen()");
};

var putImg=function(url){
  document.getElementById("mainApp").innerHTML +='<img src="'+url+'" height="'+config.imgWidth+'" width="'+config.imgHeight+'">';
};
/*
displays images. and check for End through 'checkEnd'.
checkEnd function is source specific and must be provided as per source.
*/
var dispImg=function(){
  for(var i=used_no;i<req_no;i++){
    if(i<imgs.length){
      ++used_no;
      putImg(imgs[i]);
    }
  };
	checkEnd();
};

screenInit();
getImgList(config,dispImg);//get list of images from imgur,dispImg is callback
