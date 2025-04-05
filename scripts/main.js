document.addEventListener("DOMContentLoaded", function () {
  updateStyles();
  $('.theme-toggle').click(function () {
    toggleTheme();
  });
  var coll = document.getElementsByClassName("collapsible");
  var i;

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "" || content.style.display === "none") {
        content.style.display = "block";
      } else {
        content.style.display = "none";
      }
    });
  }

  setIndividualScrolling();
  toggleSocialLinks();
  window.addEventListener("resize", function () {
    setIndividualScrolling();
    toggleSocialLinks();
  });
  var rightThemeScroller = document.querySelector('.right-theme .scroll-container');
  rightThemeScroller.addEventListener('scroll', function () {
    window.scrollTo(0, rightThemeScroller.scrollTop);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  updateTheme();
  $('#themeToggle').click(function () {
    toggleTheme();
  });
});

function toggleTheme() {
  document.body.classList.toggle('light-mode');
  document.body.classList.toggle('dark-mode');
  updateTheme();
}

function updateTheme() {
  localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

function setIndividualScrolling() {
  var leftThemeWrapper = document.querySelector('.left-theme .overlay-text');
  var rightThemeWrapper = document.querySelector('.right-theme .scroll-container');

  if (window.innerWidth <= 768) {
    leftThemeWrapper.style.overflowY = "hidden";
    rightThemeWrapper.style.overflowY = "auto"; 
  } else {
    leftThemeWrapper.style.overflowY = leftThemeWrapper.scrollHeight > leftThemeWrapper.clientHeight ? "auto" : "hidden";
    rightThemeWrapper.style.overflowY = rightThemeWrapper.scrollHeight > rightThemeWrapper.clientHeight ? "auto" : "hidden";
  }
}

function toggleSocialLinks() {
  var leftSocialLinks = document.querySelector('.left-social-links');
  var rightSocialLinks = document.querySelector('.right-social-links');

  if (window.innerWidth <= 768) {
    leftSocialLinks.style.display = "block"; 
    rightSocialLinks.style.display = "none"; 
  } else {
    leftSocialLinks.style.display = "none"; 
    rightSocialLinks.style.display = "block"; 
  }
}

var coll = document.getElementsByClassName("custom-btn");
var images = [];
var currentImageIndex = 0;

document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth <= 768) {
    document.body.style.overflowY = "auto";
  } else {
    document.body.style.overflowY = "hidden";
    window.addEventListener("scroll", function () {
      window.scrollTo(0, 0);
    });
  }
});

function scrollToTop(element) {
  element.scrollIntoView({ behavior: 'smooth' });
}
$(document).ready(function(){
  console.log('Document is ready!');
  $('.custom-btn').click(function(){
    console.log('Button clicked!');
  });
});

document.addEventListener("DOMContentLoaded", function () {
    var hoverTriggers = document.querySelectorAll('.hover-trigger');

    hoverTriggers.forEach(function (trigger) {
      trigger.addEventListener('mouseenter', function () {
        var imageSource = this.getAttribute('data-image-source');
        displayHoveredImage(imageSource);
      });

      trigger.addEventListener('mouseleave', function () {
        hideHoveredImage();
      });
    });
  });

  function displayHoveredImage(imageSource) {
    var hoveredImage = document.querySelector('.hovered-image');
    if (hoveredImage) {
      hoveredImage.src = imageSource;
      hoveredImage.style.display = 'block';
    }
  }

  function hideHoveredImage() {
    var hoveredImage = document.querySelector('.hovered-image');
    if (hoveredImage) {
      hoveredImage.style.display = 'none';
    }
  }