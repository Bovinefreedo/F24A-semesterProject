export function createSection5(){
  const section5 = document.getElementById("section5Content");
  const canvas5 = document.createElement("div");
  section5.appendChild(canvas5);
  canvas5.id="canvas5";
  canvas5.className = "background"
  const apiUrl = 'http://localhost:4000/getEnergyUseSuperType';
  fetch(apiUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
        console.log(data)
      })
      .catch(error => {
          console.error('Error:', error);
      });
}
 