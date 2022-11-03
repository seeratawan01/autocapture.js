/**
 * keep changing background color of the body after some time
 */
function changeColor() {
  let colors = ['#ff0054', '#00b7ff', '#0087ff', '#ff7800'];
  let color = colors[Math.floor(Math.random() * colors.length)];
  document.querySelectorAll('.bg-dynamic').forEach(function (el) {
    el.style.backgroundColor = color;
  });
  document.querySelectorAll('.text-dynamic').forEach((el) => {
    el.style.color = color;
  });
}

// call the function after some time with transition
setInterval(changeColor, 3000);


// Json viewer
const jsonViewer = new JSONViewer();

function appendJsonViewer(event) {

  let target = event.target;

  if (target.classList.contains('json-viewer-btn')) {
    try {
      let collapsedContainer = target.getAttribute('href');
      let jsonContainerWrapper = document.querySelector(collapsedContainer);

      // check if json viewer wrapper has class .json-viewer-added
      if (jsonContainerWrapper.classList.contains('json-viewer-added')) {
        return;
      }

      let jsonContainer = jsonContainerWrapper.querySelector('.json-viewer-container');
      let json = JSON.parse(jsonContainer.textContent);
      jsonContainer.innerHTML = '';
      jsonViewer.showJSON(json, -1, 2);
      jsonContainer.parentElement.appendChild(jsonViewer.getContainer());
      jsonContainerWrapper.classList.add('json-viewer-added');
    } catch (e) {
      console.log(e);
    }
  }
}

// // First time add json viewer to all json container
// document.querySelectorAll('.json-viewer-btn').forEach(function (el) {
//   el.addEventListener('click', appendJsonViewer);
// });
