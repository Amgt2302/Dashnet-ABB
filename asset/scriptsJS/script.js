//Auto date Display
const CurrentDate = new Date();
const CurrentYear = CurrentDate.getFullYear();
document.getElementById("Auto-Copyright").textContent = CurrentYear + ` - All rights reserved -`;

//Hidden Console Message
const Img = `
     ))
    (((
  +-----+
  |Coffe|╗  
  |  ϕ  |╝
  "-----"

  Need a break ?
`;

console.log(Img);
console.log("\x1b[30;44;1mHey! Try this: ↑ ↓ ← → B A ↵ ");

//Easter Egg Input Detection
const listkey = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'b', 'a', 'Enter'];
let index = 0;

function Secret(event) {
    if (event.key == listkey[index]) {
        index += 1;
        if (index === listkey.length) {
            alert("Easter Egg unlock ! ☕");
            window.location.href = 'https://amgt2302.github.io/Web-Space/Hidden.html';
            index = 0;
        }
    } else {index = 0;}
}
document.addEventListener('keydown', Secret);
