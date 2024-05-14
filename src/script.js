let lastScrollTop = 0;

window.addEventListener("scroll", function() {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    // Check if scrolling down from the top of the page
    if (currentScroll > lastScrollTop && window.scrollY > window.innerHeight) {
        document.querySelector("header").style.display = "none"; // Hide navbar
    } else {
        document.querySelector("header").style.display = "block"; // Show navbar
    }

    lastScrollTop = currentScroll;
    
});
