const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll(".circle");

const colors = [
    "#763edd",
    "#843bd9",
    "#a433ce",
    "#c829bc",
    "#e62aa6",
    "#fc3e8e",
    "#ff5b7a",
    "#ff786c",
    "#ff9166",
    "#ffa466",
    "#ffb169",
    "#ffb56b",
    "#fdaf69",
    "#f89d63",
    "#f59761",
    "#ef865e",
    "#ec805d",
    "#e36e5c",
    "#df685c",
    "#d5585c",
    "#d1525c",
    "#c5415d",
    "#c03b5d",
    "#b22c5e",
    "#ac265e",
    "#9c155f",
    "#950f5f",
    "#830060",
    "#7c0060",
    "#680060",
    "#60005f",
    "#48005f",
    "#3d005e"
  ];
  

circles.forEach(function (circle, index) {
  circle.x = 0;
  circle.y = 0;
  circle.style.backgroundColor = colors[index % colors.length];
});

window.addEventListener("mousemove", function(e){
    // Check if the mouse is over the charts
    if (!document.getElementById('animated-chart').contains(e.target)) {
      coords.x = e.clientX;
      coords.y = e.clientY;
    }
  });
  

function animateCircles() {
  
  let x = coords.x;
  let y = coords.y;
  
  circles.forEach(function (circle, index) {
    circle.style.left = x - 6 + "px";
    circle.style.top = y - 6 + "px";
    
    circle.style.scale = (circles.length - index) / circles.length;
    
    circle.x = x;
    circle.y = y;

    const nextCircle = circles[index + 1] || circles[0];
    x += (nextCircle.x - x) * 0.3;
    y += (nextCircle.y - y) * 0.3;
  });
 
  requestAnimationFrame(animateCircles);
}

animateCircles();

// Function to handle intersection changes
function handleIntersection(entries) {
    entries.forEach(entry => {
        // Check if the target is one of the sections we are interested in
        if (entry.target.classList.contains('one') || entry.target.classList.contains('two') || entry.target.classList.contains('three') || entry.target.classList.contains('four') || entry.target.classList.contains('five') || entry.target.classList.contains('six') || entry.target.classList.contains('seven')) {
            // Get the corresponding baggrund div within the section
            const baggrundDiv = entry.target.querySelector('.baggrund');
            // Check if 50% of the section is in view
            if (entry.intersectionRatio >= 0.5) {
                // If 50% or more is in view, add a class to the baggrund div
                baggrundDiv.classList.add('swipe-in');
            } 
        }
    });
}

// Create an intersection observer instance
const observer = new IntersectionObserver(handleIntersection, {
    threshold: 0.5 // Trigger when 50% of the section is in view
});

// Get all the sections from class one to seven
const sections = document.querySelectorAll('.one, .two, .three, .four, .five, .six, .seven');

// Observe each section
sections.forEach(section => {
    observer.observe(section);
});

