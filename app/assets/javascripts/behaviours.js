"use strict";

$(function() {

  $("body").on("click", "a[href^='/']", function(event) {
    // allow to open links in new browser tab/window
    if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
      event.preventDefault();
      // remove leading slash to use path as backbone route
      var url = $(event.currentTarget).attr("href").replace(/^\//, "");
      app.router.navigate(url, { trigger: true });
    }
  });

});

