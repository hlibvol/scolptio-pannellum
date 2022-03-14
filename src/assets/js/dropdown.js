
$(document).ready(function () {
	$(document).on('click', '.dropdown-menu', function (e) {
		e.stopPropagation();
	});

  $('.table tbody tr').each(function (index, element) {
    // $(this).click(function () {
    //   $('.table tbody tr').removeClass('hover');
    //   $(this).addClass('hover');
    // });
    // $(".table tbody tr").mouseenter(function () {
    //   $(this).addClass('hover');
    //   console.log($(this).hasClass('show'));
    // });
    // $(".table tbody tr").mouseleave(function () {
    //   $(this).removeClass('hover');
    // });
  });

});
