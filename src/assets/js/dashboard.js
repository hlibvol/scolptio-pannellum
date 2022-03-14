$(document).ready(function () {
  var temp = 0;
  var parent = true;
  $('.collapse-toggle').each(function (i) {
    $(this).on("click", function () {
      $('.collapse').css({ 'display': 'none' });
      if (temp === i) {
        if (parent) {
          $(this).next('.collapse').hide();
          parent = false;
        } else {
          $(this).next('.collapse').show();
          parent = true;
        }
      } else {
        $(this).next('.collapse').toggle();
      }
      temp = i;
    });
  });
});
