let date = new Date();

setInterval(function(){
  document.querySelector('.time').innerText = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}, 1000);

setTimeout(function(){
  document.querySelector('#boot').style.display = 'none';
}, 0);

setTimeout(function(){
  document.querySelector('#boot-ready').style.display = 'none';
}, 0);

document.querySelector('select[name="wallpaper"]').addEventListener('click', function(e){
  wallpaper = e.target.value;
  switch (wallpaper){
    case 'none':
      document.querySelector('#desktop').style.background = 'teal';
      break; 
     case '1':
      document.querySelector('#desktop').style.backgroundImage = 'url(https://i.pinimg.com/originals/e3/6b/41/e36b414450077c6a1e29eab4a27a858c.jpg)';
      break; 
    case '2':
      document.querySelector('#desktop').style.backgroundImage = 'url(http://cs.gettysburg.edu/~duncjo01/archive/patterns/windows/ancestry/Black%20Thatch.bmp)';
      break;
    case '3':
      document.querySelector('#desktop').style.backgroundImage = 'url(http://cs.gettysburg.edu/~duncjo01/archive/patterns/windows/ancestry/Blue%20Rivets.bmp)';
      break;
    case '4':
      document.querySelector('#desktop').style.backgroundImage = 'url(http://cs.gettysburg.edu/~duncjo01/archive/patterns/windows/ancestry/Soap%20Bubbles.bmp)';
      break;
  }
});

var draggie = new Draggabilly( '.window', {
 // containment: '.container',
  handle: '.window-toolbar'
});