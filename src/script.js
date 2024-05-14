let lastScrollTop = 0;

window.addEventListener("scroll", function() {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    // Check if scrolling down from the first page
    if (currentScroll > lastScrollTop && window.scrollY > window.innerHeight) {
        document.querySelector("header").style.top = "-100px"; // Hide navbar
    } else {
        document.querySelector("header").style.top = "0"; // Show navbar
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

