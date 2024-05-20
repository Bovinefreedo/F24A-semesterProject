export function createSection5(){
  const section5 = document.getElementById("section5Content");
  const canvas5 = document.createElement("div");
  section5.appendChild(canvas5);
  canvas5.id="canvas5";
  canvas5.style.backgroundColor = "red";
  canvas5.style.width = "100%";
  canvas5.style.height = "80%";
  canvas5.style.top = "12px";
  canvas5.style.left = "10px";
  canvas5.style.display = "flex";
  canvas5.style.justifyContent= "space-between";
  const apiUrl = 'http://localhost:4000/getPopProj';
  fetch(apiUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
        
      })
      .catch(error => {
          console.error('Error:', error);
      });
}
 