document.addEventListener("DOMContentLoaded",function(){
  document.addEventListener("click",function(event){
    var image=event.target.closest('tr[id^="demo"] .scroll-container img');

    if(image){
      openImageLightbox(image);
      return;
    }

    if(event.target.classList.contains("image-lightbox")){
      closeImageLightbox();
    }
  });

  document.addEventListener("keydown",function(event){
    if(event.key==="Escape"){
      closeImageLightbox();
    }
  });
});

function openImageLightbox(sourceImage){
  closeImageLightbox();

  var overlay=document.createElement("div");
  var image=document.createElement("img");

  overlay.className="image-lightbox";
  image.src=sourceImage.currentSrc||sourceImage.src;
  image.alt=sourceImage.alt||"Fullscreen project image";

  overlay.appendChild(image);
  document.body.appendChild(overlay);
  document.body.classList.add("lightbox-open");
}

function closeImageLightbox(){
  var overlay=document.querySelector(".image-lightbox");

  if(overlay){
    overlay.remove();
  }

  document.body.classList.remove("lightbox-open");
}
