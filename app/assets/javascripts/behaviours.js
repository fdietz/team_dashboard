$(function() {

  $("body").on("click", "a[data-navigation-url]", function(event) {
    var url = $(event.target).attr("data-navigation-url");
    app.router.navigate(url, { trigger: true });
    return false;
  });

});

