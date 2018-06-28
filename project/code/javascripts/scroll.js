/**
 * Name: Mercylyn Wiemer (10749306)
 * Course: programming project
 *
 * jQuery to add smooth scrolling (when clicking on the links in the navbar)
 * https://www.w3schools.com/bootstrap/bootstrap_theme_company.asp
 */

var scrollTime = 900;

$(document).ready(function(){

    // Add smooth scrolling to all links in navbar + footer link
    $(".navbar a, footer a[href='#myPage'], .container-fluid a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== ""){

        // Prevent default anchor click behavior
        event.preventDefault();

        // Store hash
        var hash = this.hash;

        // Using jQuery's animate() method to add smooth page scroll
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, scrollTime, function(){

            // Add hash (#) to URL when done scrolling (default click behavior)
            window.location.hash = hash;
            });
        }
    });
})
