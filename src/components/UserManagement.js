import React, { useState, useEffect } from 'react';

export default function UserManagement() {
  const [villages, setVillages] = useState([]);
  const [originalOrder, setOriginalOrder] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [showModal, setShowModal] = useState({ viewing: false });
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const villagesPerPage = 4;

  useEffect(() => {
    const storedVillages = JSON.parse(localStorage.getItem("villages")) || [];
    setVillages(storedVillages);
    setOriginalOrder(storedVillages);
  }, []);

  // Filter villages based on the search term
  const filteredVillages = villages.filter(village =>
    village.villageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    village.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const makeGraphQLRequest = async (query, variables = {}) => {
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables }),
      });
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error making GraphQL request: ", error);
      return null;
    }
  };

  const closeModals = () => {
    setShowModal({ viewing: false });
  };

  const renderVillages = (villagesToRender, page) => {
    const startIndex = (page - 1) * villagesPerPage;
    const endIndex = startIndex + villagesPerPage;
    return villagesToRender.slice(startIndex, endIndex).map((village, index) => (
      <div key={index} className="rad-6 village-element">
        <div className="name">{village.villageName} - {village.region}</div>
        <div className="village-buttons">
          <button className="view-village rad-6" onClick={() => handleViewVillage(village)}>View</button>
        </div>
      </div>
    ));
  };

  const handleViewVillage = (village) => {
    setSelectedVillage(village);
    setShowModal({ viewing: true });
  };

  return (
    <>
      <section id="overlay" style={{ display: showModal.viewing ? 'block' : 'none' }}></section>
      {showModal.viewing && selectedVillage && (
        <section id="viewing-village" className="rad-6 modal-village">
          <div className="modal-header">
            <h2>Village Details</h2>
            <button onClick={closeModals}>x</button>
          </div>
          <div className="village-data">
            <div className="villageName">
              <span className="info">Village Name:</span>
              <span className="value">{selectedVillage.villageName}</span>
            </div>
            <div className="region">
              <span className="info">Region/District:</span>
              <span className="value">{selectedVillage.region}</span>
            </div>
            <div className="landArea">
              <span className="info">Land Area (sq km):</span>
              <span className="value">{selectedVillage.landArea}</span>
            </div>
            <div className="latitude">
              <span className="info">Latitude:</span>
              <span className="value">{selectedVillage.latitude}</span>
            </div>
            <div className="longitude">
              <span className="info">Longitude:</span>
              <span className="value">{selectedVillage.longitude}</span>
            </div>
            <div className="tags">
              <span className="info">Tags:</span>
              <span className="value">{selectedVillage.category}</span>
            </div>
            <div className="image">
              <span className="info">Village Image</span>
              <img className="value" src={selectedVillage.villageImage} alt="" />
            </div>
          </div>
        </section>
      )}
      <div id="content">
        <div id="page-content" className="management rad-6">
          <div id="view-village-list">
            <h3>View Village List</h3>
            <input
              className="rad-6"
              type="search"
              id="search-village"
              placeholder="Search villages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            />
            <div id="villages-config">
              <div id="sort">
                <label htmlFor="sort-by">Sort by:</label>
                <select
                  name="sort"
                  className="rad-6"
                  id="sort-by"
                  onChange={(e) => {
                    if (e.target.value === "alphabetical") {
                      setVillages([...villages].sort((a, b) => a.villageName.localeCompare(b.villageName)));
                    } else {
                      setVillages([...originalOrder]);
                    }
                  }}
                >
                  <option value="default">Default</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>
              <div id="navigate-pages">
                <p>Page:</p>
                <button id="prev-page" className="rad-6" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>Prev</button>
                <button id="next-page" className="rad-6" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
              </div>
            </div>
            <div id="villages-list">
              {renderVillages(filteredVillages, currentPage)} {/* Render filtered villages */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}