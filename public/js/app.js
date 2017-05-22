/* globals Navigo controllers $ dataService document */

let router = new Navigo(null, true);

let controllersInstance = controllers.get(dataService, templates);

router
    .on("book", espController.all)
    .on("login", controllersInstance.login)
    .on("register", controllersInstance.register)
    .on("profiles/", profilesController.printAll)
    .on("profiles/:username", profilesController.print)
    // .on("home", controllersInstance.home)
    .on(() => {
        $("#main-nav .home a").addClass("active");
        router.navigate("/book");
    })
    .resolve();

dataService.isLoggedIn()
    .then(function(isLoggedIn) {
        if (isLoggedIn) {
            $(document.body).addClass("logged-in");
            $(".btn-nav-profile").attr("href", "#/profiles/" + dataService.getUsername());
        }
    });

$(".btn-nav-logout").on("click", () => {
    dataService.logout()
        .then(() => {
            $(document.body).removeClass("logged-in");
        });
});

$(".btn-nav-profile").on("click", () => {

});

$("#main-nav").on("click", "li", function(ev) {
    $("#main-nav .active").removeClass("active");
    $(this).addClass("active");
});

$(function() {
    $("#main-nav .active").removeClass("active");
    let $currentPageNavButton = $(`#main-nav a[href="${window.location.hash}"]`).parents("li");
    $currentPageNavButton.addClass("active");
});

Handlebars.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});


