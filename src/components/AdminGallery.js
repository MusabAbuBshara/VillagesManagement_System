import React, { useState, useEffect } from "react";

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState({ img: "", description: "" });
  const [fileInput, setFileInput] = useState(null);

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
  
  // Handle form submission for adding a new image
  const handleAddImage = async (e) => {
    e.preventDefault();

    if (!newImage.description || !fileInput) {
      alert("Both description and image file are required!");
      return;
    }

    const reader = new FileReader();

    // Convert image file to base64
    reader.onload = async function () {
      const mutation = `
        mutation ($img: String!, $description: String!) {
          addImage(img: $img, description: $description) {
            img
            description
          }
        }
      `;
      const variables = {
        img: reader.result, // Base64 data URL
        description: newImage.description,
      };
      await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: mutation, variables }),
      });
      fetchImages(); // Refresh images list
      setNewImage({ img: "", description: "" });
      setFileInput(null);
      closeAllModals();
    };

    reader.readAsDataURL(fileInput);
  };

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
      <section id="adding-image" className="rad-6 modal-village">
        <div className="modal-header">
          <h2>Add New Image</h2>
          <button onClick={closeAllModals}>x</button>
        </div>
        <form onSubmit={handleAddImage}>
          <div>
            <label htmlFor="image-description">Image Description:</label>
            <input
              type="text"
              id="image-description"
              value={newImage.description}
              onChange={(e) =>
                setNewImage({ ...newImage, description: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="village-image">Upload Image:</label>
            <input
              type="file"
              id="village-image"
              onChange={(e) => setFileInput(e.target.files[0])}
            />
          </div>
          <input type="submit" value="Add Village" />
        </form>
      </section>
      <div id="content">
        <button
          id="add-image"
          className="rad-6"
          onClick={() => {
            document.getElementById("adding-image").style.display = "block";
            if (overlay) overlay.style.display = "block";
          }}
        >
          Add New Image
        </button>
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
