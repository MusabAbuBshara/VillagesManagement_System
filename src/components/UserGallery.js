import React, { useState, useEffect } from "react";

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const overlay = document.getElementById("overlay");

  // Fetch images from GraphQL API
  const fetchImages = async () => {
    const query = `
      query {
        getImages {
          img
          description
        }
      }
    `;
    const response = await fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    setImages(data.data.getImages);
  };
  console.log(images);

  useEffect(() => {
    fetchImages();
  }, []);

  // Close all modals
  function closeAllModals() {
    const modals = document.querySelectorAll(".modal-village");
    modals.forEach((modal) => {
      modal.style.display = "none";
    });
    if (overlay) overlay.style.display = "none";
  }

  return (
    <>
      <section id="overlay"></section>
      <div id="content">
        <div id="page-content" className="image-content">
          {images.map((image, index) => (
            <div className="image-box" key={index}>
              <img src={image.img} alt="" />
              <p>{image.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
