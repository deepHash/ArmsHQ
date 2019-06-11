
// Site Nav menu toggle
function initMobileMenu(){
    var mainNavItem = $('.nav-main--label'),
        nav = $('header nav');

    // show menu, hide masthead logo
    $('#menu-icon').click(function (e) {
        e.preventDefault();

        $(this).toggleClass('close');       // toggle menu icon to close
        $('body').toggleClass('menu-open'); // add class to hide masthead logo when menu is open
    });

    // hide/show subnav
    $(mainNavItem).each(function(){
        $(this).on('click',function(){
            $(this).parent('.nav-main').toggleClass('expand');
            $(this).parent('.nav-main').find('.sub-nav').slideToggle();
        });
    });

    // open a subnav menu by default if page is company or support
    if ($('body').hasClass('company')) {
        $('.nav-main.nav-company label').click();
    }
    else if ($('body').hasClass('support')) {
        $('.nav-main.nav-support label').click();
    }

} // initMobileMenu

$(document).ready(function() {
    initMobileMenu();
});
