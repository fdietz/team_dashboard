$(function() {

  $("body").on("click", "a[data-navigation-url]", function(event) {
    var url = $(event.target).attr("data-navigation-url")
    console.log("clicked", url);
    app.router.navigate(url, { trigger: true });
  });

});

