import React, { useState, useEffect } from 'react';

export default function AdminManagement() {
  const [villages, setVillages] = useState([]);
  const [originalOrder, setOriginalOrder] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [showModal, setShowModal] = useState({ adding: false, viewing: false, updating: false, updatingDemographic: false });
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

  const handleAddVillage = async (event) => {
    event.preventDefault();
    const newVillage = {
      villageName: event.target.villageName.value,
      region: event.target.region.value,
      landArea: event.target.landArea.value,
      latitude: event.target.latitude.value,
      longitude: event.target.longitude.value,
      category: event.target.categories.value,
      population: 13117,
      villageImage: event.target.villageImage.value,
      ageDistribution: [
        { upperlimit: 18, value: 45 },
        { upperlimit: 35, value: 30 },
        { upperlimit: 50, value: 15 },
        { upperlimit: 65, value: 7 },
        { upperlimit: 100, value: 3 },
      ],
      genderRatios: { male: 50.5, female: 49.5 },
      populationGrowthRate: 2.5,
    };

    const query = `
      mutation AddVillage($newVillage: String!) {
        addVillage(newVillage: $newVillage) {
          villageName
          region
          landArea
          latitude
          longitude
          category
          population
          villageImage
          ageDistribution {
            upperlimit
            value
          }
          genderRatios {
            male
            female
          }
          populationGrowthRate
        }
      }
    `;

    const variables = {
      newVillage: JSON.stringify(newVillage),
    };

    const result = await makeGraphQLRequest(query, variables);
    if (result && result.addVillage) {
      const updatedVillages = [...villages, newVillage];
      setVillages(updatedVillages);
      localStorage.setItem("villages", JSON.stringify(updatedVillages));
      setShowModal({ ...showModal, adding: false });
    }
  };

  const handleUpdateVillageSubmit = async (event) => {
    event.preventDefault();
    const updatedVillage = {
      villageName: event.target.villageName.value,
      region: event.target.region.value,
      landArea: event.target.landArea.value,
      latitude: event.target.latitude.value,
      longitude: event.target.longitude.value,
    };

    const query = `
      mutation UpdateVillage($updatedVillage: String!) {
        updateVillage(updatedVillage: $updatedVillage) {
          villageName
          region
          landArea
          latitude
          longitude
          category
          population
          villageImage
          ageDistribution {
            upperlimit
            value
          }
          genderRatios {
            male
            female
          }
          populationGrowthRate
        }
      }
    `;

    const variables = {
      updatedVillage: JSON.stringify(updatedVillage),
    };

    const result = await makeGraphQLRequest(query, variables);
    if (result && result.updateVillage) {
      const updatedVillages = villages.map(v =>
        v.villageName === selectedVillage.villageName ? { ...v, ...updatedVillage } : v
      );
      setVillages(updatedVillages);
      localStorage.setItem("villages", JSON.stringify(updatedVillages));
      setShowModal({ ...showModal, updating: false });
    }
  };

  const handleDeleteVillage = async (village) => {
    const query = `
      mutation DeleteVillage($villageName: String!) {
        deleteVillage(villageName: $villageName) {
          villageName
          region
          landArea
          latitude
          longitude
          category
          population
          villageImage
          ageDistribution {
            upperlimit
            value
          }
          genderRatios {
            male
            female
          }
          populationGrowthRate
        }
      }
    `;

    const variables = {
      villageName: village.villageName,
    };

    const result = await makeGraphQLRequest(query, variables);
    if (result && result.deleteVillage) {
      const updatedVillages = villages.filter(v => v.villageName !== village.villageName || v.region !== village.region);
      setVillages(updatedVillages);
      localStorage.setItem("villages", JSON.stringify(updatedVillages));
    }
  };

  const handleUpdateDemographicSubmit = async (event) => {
    event.preventDefault();
    const updatedDemographic = {
      population: parseInt(event.target.populationSize.value, 10) || 13117,
      populationGrowthRate: parseFloat(event.target.growthRate.value) || 2.5,
      ageDistribution: event.target.ageDistribution.value.split(" ").map((value, index) => ({
        upperlimit: [18, 35, 50, 65, 100][index],
        value: parseInt(value, 10),
      })),
      genderRatios: {
        male: parseFloat(event.target.genderRatios.value.split(" ")[0]),
        female: parseFloat(event.target.genderRatios.value.split(" ")[1]),
      },
    };

    const query = `
      mutation UpdateVillage($updatedVillage: String!) {
        updateVillage(updatedVillage: $updatedVillage) {
          villageName
          region
          landArea
          latitude
          longitude
          category
          population
          villageImage
          ageDistribution {
            upperlimit
            value
          }
          genderRatios {
            male
            female
          }
          populationGrowthRate
        }
      }
    `;

    const updatedVillage = {
      ...selectedVillage,
      ...updatedDemographic,
    };

    const variables = {
      updatedVillage: JSON.stringify(updatedVillage),
    };

    const result = await makeGraphQLRequest(query, variables);
    if (result && result.updateVillage) {
      const updatedVillages = villages.map(v =>
        v.villageName === selectedVillage.villageName ? { ...v, ...updatedDemographic } : v
      );
      setVillages(updatedVillages);
      localStorage.setItem("villages", JSON.stringify(updatedVillages));
      setShowModal({ ...showModal, updatingDemographic: false });
    }
  };

  const closeModals = () => {
    setShowModal({ adding: false, viewing: false, updating: false, updatingDemographic: false });
  };

  const renderVillages = (villagesToRender, page) => {
    const startIndex = (page - 1) * villagesPerPage;
    const endIndex = startIndex + villagesPerPage;
    return villagesToRender.slice(startIndex, endIndex).map((village, index) => (
      <div key={index} className="rad-6 village-element">
        <div className="name">{village.villageName} - {village.region}</div>
        <div className="village-buttons">
          <button className="view-village rad-6" onClick={() => handleViewVillage(village)}>View</button>
          <button className="update-village rad-6" onClick={() => handleUpdateVillage(village)}>Update Village</button>
          <button className="delete-village rad-6" onClick={() => handleDeleteVillage(village)}>Delete Village</button>
          <button className="update-demographic-village rad-6" onClick={() => handleUpdateDemographic(village)}>Update Demographic Data</button>
        </div>
      </div>
    ));
  };

  const handleViewVillage = (village) => {
    setSelectedVillage(village);
    setShowModal({ ...showModal, viewing: true });
  };

  const handleUpdateVillage = (village) => {
    setSelectedVillage(village);
    setShowModal({ ...showModal, updating: true });
  };

  const handleUpdateDemographic = (village) => {
    setSelectedVillage(village);
    setShowModal({ ...showModal, updatingDemographic: true });
  };

  return (
    <>
      <section id="overlay" style={{ display: Object.values(showModal).some(v => v) ? 'block' : 'none' }}></section>
      {showModal.adding && (
        <section id="adding-village" className="rad-6 modal-village">
          <div className="modal-header">
            <h2>Add New Village</h2>
            <button onClick={closeModals}>x</button>
          </div>
          <form onSubmit={handleAddVillage}>
            <div>
              <label htmlFor="villageName">Village Name:</label>
              <input type="text" id="villageName" defaultValue="Tammun" />
            </div>
            <div>
              <label htmlFor="region">Region/District:</label>
              <input type="text" id="region" defaultValue="West Bank" />
            </div>
            <div>
              <label htmlFor="landArea">Land Area (sq km):</label>
              <input type="text" id="landArea" defaultValue="81" />
            </div>
            <div>
              <label htmlFor="latitude">Latitude:</label>
              <input type="text" id="latitude" defaultValue="32.3219" />
            </div>
            <div>
              <label htmlFor="longitude">Longitude:</label>
              <input type="text" id="longitude" defaultValue="35.3219" />
            </div>
            <div>
              <label htmlFor="villageImage">Upload Image:</label>
              <input type="file" id="villageImage" />
            </div>
            <div>
              <label htmlFor="categories">Categories/Tags:</label>
              <input type="text" id="categories" placeholder="e.g., rural, urban" defaultValue="rural" />
            </div>
            <input type="submit" value="Add Village" />
          </form>
        </section>
      )}
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
      {showModal.updating && selectedVillage && (
        <section id="updating-village" className="rad-6 modal-village">
          <div className="modal-header">
            <h2>Update Village</h2>
            <button onClick={closeModals}>x</button>
          </div>
          <form onSubmit={handleUpdateVillageSubmit}>
            <div>
              <label htmlFor="villageName">Village Name:</label>
              <input type="text" id="villageName" defaultValue={selectedVillage.villageName} />
            </div>
            <div>
              <label htmlFor="region">Region/District:</label>
              <input type="text" id="region" defaultValue={selectedVillage.region} />
            </div>
            <div>
              <label htmlFor="landArea">Land Area (sq km):</label>
              <input type="text" id="landArea" defaultValue={selectedVillage.landArea} />
            </div>
            <div>
              <label htmlFor="latitude">Latitude:</label>
              <input type="text" id="latitude" defaultValue={selectedVillage.latitude} />
            </div>
            <div>
              <label htmlFor="longitude">Longitude:</label>
              <input type="text" id="longitude" defaultValue={selectedVillage.longitude} />
            </div>
            <div>
              <label htmlFor="villageImage">Upload Image:</label>
              <input type="file" id="villageImage" />
            </div>
            <input type="submit" value="Update Village" />
          </form>
        </section>
      )}
      {showModal.updatingDemographic && selectedVillage && (
        <section id="updating-demographic" className="rad-6 modal-village">
          <div className="modal-header">
            <h2>Add Demographic Data For</h2>
            <button onClick={closeModals}>x</button>
          </div>
          <form onSubmit={handleUpdateDemographicSubmit}>
            <div>
              <label htmlFor="population-size">Population Size:</label>
              <input type="text" id="population-size" defaultValue={selectedVillage.population} />
            </div>
            <div>
              <label htmlFor="age-distribution">Age Distribution:</label>
              <input type="text" id="age-distribution" defaultValue={selectedVillage.ageDistribution.map(ad => ad.value).join(" ")} />
            </div>
            <div>
              <label htmlFor="gender-ratios">Gender Ratios:</label>
              <input type="text" id="gender-ratios" defaultValue={`${selectedVillage.genderRatios.male} ${selectedVillage.genderRatios.female}`} />
            </div>
            <div>
              <label htmlFor="growth-rate">Population Growth Rate:</label>
              <input type="text" id="growth-rate" defaultValue={selectedVillage.populationGrowthRate} />
            </div>
            <input type="submit" value="Add Demographic Data" />
          </form>
        </section>
      )}
      <div id="content">
        <button id="add-village" className="rad-6" onClick={() => setShowModal({ ...showModal, adding: true })}>Add New Village</button>
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