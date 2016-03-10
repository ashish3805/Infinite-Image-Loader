# Infinite-Image-Loader

to create a infinite image container.
Just put the id="mainApp" for ex: see index.html
as of now it pulls images from imgur(the latest trending images);

mainApp container can be styled at ./css/style.css;
js code can be seen at ./js/app.js;

Procedure:Following is the proceduural flow, See issues for their status
1)calc initail no of images to be displayed.
2)see the img array nd create place holders as per their relative size.
3)set the loading txt/graphic/dummy image till image is fully loaded.
4)replace the dummy graphic with the image data.
5)see for scroll event
6)on scroll calc no of images to be added and repeat step 2,3,4
