export default function UserGallery(){
  // Function to generate image elements
  function imageElement(image) {
    return `
      <div class="image-box">
        <img src="${image.img}" alt="${image.description}">
        <p>${image.description}</p>
      </div>
    `;
  }

  // Load images from localStorage and render
  let images = JSON.parse(localStorage.getItem("images")) || [];
  const imageContent = document.getElementById("page-content");

  function renderImages() {
    imageContent.innerHTML = images.map(imageElement).join("");
  }
  renderImages();
  return(
    <div id="content">
    <div id="page-content" class="image-content">
      <div class="image-box">
        <img id="image-box-file" src="../imgs/jabalia.jpg" alt=""/>
        <p id="image-box-descrption">This Village Is Jabalia</p>
      </div>
      <div class="image-box">
        <img id="image-box-file" src="../imgs/jabalia.jpg" alt=""/>
        <p id="image-box-descrption">This Village Is Jabalia</p>
      </div>
      <div class="image-box">
        <img id="image-box-file" src="../imgs/jabalia.jpg" alt=""/>
        <p id="image-box-descrption">This Village Is Jabalia</p>
      </div>
      <div class="image-box">
        <img id="image-box-file" src="../imgs/jabalia.jpg" alt=""/>
        <p id="image-box-descrption">This Village Is Jabalia</p>
      </div>
      <div class="image-box">
        <img id="image-box-file" src="../imgs/jabalia.jpg" alt=""/>
        <p id="image-box-descrption">This Village Is Jabalia</p>
      </div>
      <div class="image-box">
        <img id="image-box-file" src="../imgs/jabalia.jpg" alt=""/>
        <p id="image-box-descrption">This Village Is Jabalia</p>
      </div>
    </div>
  </div>
  )
}