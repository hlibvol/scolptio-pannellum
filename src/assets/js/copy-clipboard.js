$(document).ready(function () {
  $('#btnCopty').click(function () {
    $('#copy').select();
    document.execCommand("copy");
  });
});
