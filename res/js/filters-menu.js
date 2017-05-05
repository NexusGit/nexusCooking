$(document).ready(function(){
  $("#menu_filter").accordion({collapsible: true}, {heightStyle: "content"});
  $("#menu_filter").css("z-index","10");
});



/*$('.menu2 li:has(ul)').click(function(e){
  e.preventDefault();

  if ($(this).hasClass('actived')){
      $(this).removeClass('actived');
      $(this).children('ul').slideUp();
  } else {
    $('.menu2 li ul').slideUp();
    $('.menu2 li').removeClass('actived');
    $(this).addClass('actived');
    $(this).children('ul').slideDown();
  }
});

$('.btn-menu').click(function(){
  $('.filter .menu2').slideToggle();
});*/
