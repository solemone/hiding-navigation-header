const navigationHeader = document.getElementById('navigationHeader');
let st;
let lastScrollTop = 0;
let scrollDistanceDownEntry = -1;
let scrollDistanceUpEntry = -1;
let scrollDistanceDown = 0;
let scrollDistanceUp = 0;
let navigationHeaderHeight = 64;
let navigationHeaderYposition = 0;
let isScrolling;


window.addEventListener('scroll', handleNavigationHeader);


function handleNavigationHeader () {
  st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"

  if (st > lastScrollTop) {
    // downscroll code

    scrollDistanceUpEntry = -1;

    if(scrollDistanceDownEntry === -1) {
      if(navigationHeaderYposition !== 0 && navigationHeaderYposition !== -navigationHeaderHeight) {
        scrollDistanceDownEntry = st + navigationHeaderYposition;
      } else {
        scrollDistanceDownEntry = st;
      }
    }
    
    scrollDistanceDown = scrollDistanceDownEntry - st;

    if(scrollDistanceDown < -navigationHeaderHeight) {
      navigationHeaderYposition = -navigationHeaderHeight;
    } else {
      navigationHeaderYposition = scrollDistanceDown;
    }
    
  } else {
    // upscroll code

    scrollDistanceDownEntry = -1;

    if(scrollDistanceUpEntry === -1) {
      if(navigationHeaderYposition !== 0 && navigationHeaderYposition !== -navigationHeaderHeight) {
        scrollDistanceUpEntry = st + navigationHeaderYposition + navigationHeaderHeight;
      } else {
        scrollDistanceUpEntry = st;        
      }
    }
    
    scrollDistanceUp = (scrollDistanceUpEntry - st) - navigationHeaderHeight;

    if(scrollDistanceUp >= 0) {
      navigationHeaderYposition = 0;
    } else {
      navigationHeaderYposition = scrollDistanceUp;
    }
    
  }

   navigationHeader.style.transform = `translateY(${navigationHeaderYposition}px)`;

   lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling

   // Check when scrolling ends
  window.clearTimeout( isScrolling );
  isScrolling = setTimeout(function() {
    // console.log('Scrolling has stopped.');
    if(navigationHeaderYposition !== 0 && navigationHeaderYposition !== -navigationHeaderHeight) {
      if(navigationHeaderYposition > ((navigationHeaderHeight / 2) * -1)) {
        // console.log('should show');
        let showHeader = navigationHeader.animate([
          { transform: `translateY(${navigationHeaderYposition}px)` },
          { transform: 'translateY(0px)' }
        ], 200);

        showHeader.onfinish = function() {
          navigationHeader.style.transform = 'translateY(0px)';
          scrollDistanceDownEntry = st;
          scrollDistanceUpEntry = st + navigationHeaderHeight;
        };
        
      } else {
        // console.log('should hide');

        let hideHeader = navigationHeader.animate([
          { transform: `translateY(${navigationHeaderYposition}px)` },
          { transform: `translateY(${-navigationHeaderHeight}px)` }
        ], 200);
        
        hideHeader.onfinish = function() {
          navigationHeader.style.transform = `translateY(-${navigationHeaderHeight}px)`;
          scrollDistanceUpEntry = st;
          scrollDistanceDownEntry = st - navigationHeaderHeight;
        };
      }
    }
  }, 200);
}