
var imgs=new Array();
var used_no=0,req_no=0;
var prevScroll=0;
var config={
	'Authorization': 'Client-ID 2caa3460222960b',
		'url': 'https://api.imgur.com/3/gallery/hot/',
    'imgWidth':160,
    'imgHeight':160
};

var getThumb=function(url){
  if(url[url.lastIndexOf('.')-1]!='h'){//its imgur exception some times it by default sends thumbnails
      url=url.substring(0, url.lastIndexOf('.')) + "t" + url.substring(url.lastIndexOf('.'), url.length);
  }else {
      url=url.substring(0, url.lastIndexOf('.')-1) + "t" + url.substring(url.lastIndexOf('.'), url.length);
  }
  return url;
}
var cbArray={};
var counter=0;
var stock=0;
var end=false;
var getAlbumImg=function(id,callback){
	var cbId=++counter;
	cbArray['cb'+cbId]={};
	var request = new XMLHttpRequest();
	request.open("GET", 'https://api.imgur.com/3/gallery/album/'+id);
  request.setRequestHeader('Authorization', config.Authorization);
	request.onreadystatechange = function() {
			if (request.readyState === 4 && request.status === 200) {
        var data=JSON.parse(request.responseText);
					cbArray['cb'+cbId].status=true;//requst has ended
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
                  imgs.push(getThumb(x.link));
                }
                else{
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

var dispImg=function(){
  for(var i=used_no;i<req_no;i++){
    if(i<imgs.length){
      ++used_no;
      putImg(imgs[i]);
    }
  };
	checkEnd();
};

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

screenInit();//initialize screen i.e no of images initally
getImgList(config,dispImg);//get list of images from imgur
