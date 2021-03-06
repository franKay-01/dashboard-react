import $ from "jquery";

$(document).ready(function() {
  $(".chips").material_chip();

  $("#categoryBtn").on("click", function(event) {
    let categories = [];

    let chipsObjectValue = $(".chips").material_chip("data");

    $.each(chipsObjectValue, function(key, value) {
      categories.push(value.tag);
    });

    document.getElementById("category_names").value = categories;
  });
});
