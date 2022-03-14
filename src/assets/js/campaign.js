
$(document).ready(function () {
  $(document).on("keyup", "#search", function () {
    var value = $(this).val().toLowerCase();
    $("#list li").filter(function () {
      console.log('sdfsd');
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

  // sort
  function sortAsc(selector) {
    $(selector).children("li").sort(function (a, b) {
      var A = $(a).text().toUpperCase();
      var B = $(b).text().toUpperCase();
      return (A < B) ? -1 : (A > B) ? 1 : 0;
    }).appendTo(selector);
  }
  function sortDesc(selector) {
    $(selector).children("li").sort(function (a, b) {
      var A = $(a).text().toUpperCase();
      var B = $(b).text().toUpperCase();
      return (A > B) ? -1 : (A < B) ? 1 : 0;
    }).appendTo(selector);
  }

  $('#sortAsc').on('click', function () {
    sortAsc("#list");
  });
  $('#sortDesc').on('click', function () {
    sortDesc("#list");
  });
});
