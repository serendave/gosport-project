$(document).ready(() => {

    // Sticky navigation
    $(".features").waypoint(function (direction) {
        if (direction == "down") {
            $(".header").addClass("header--sticky");
        } else {
            $(".header").removeClass("header--sticky");
        }
    }, {
        offset: "55px"
    });
});