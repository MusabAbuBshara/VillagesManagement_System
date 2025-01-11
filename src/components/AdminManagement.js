export default function AdminManagement(){
    const overlay = document.getElementById("overlay");
    const modals = document.querySelectorAll(".modal-village");
    const villagesPerPage = 4; // Number of villages per page
    let currentPage = 1; // Current page index
    let villageToUpdate;
  
    // Close all modals
    function closeAllModals() {
      modals.forEach((modal) => {
        modal.style.display = "none";
      });
      overlay.style.display = "none";
    }
  
    // Function to generate village elements
    function villageElement(village) {
      return `
        <div class="rad-6" id="village-element">
          <div class="name">${village.villageName} - ${village.region}</div>
          <div class="village-buttons">
            <button class="view-village rad-6">View</button>
            <button class="update-village rad-6">Update Village</button>
            <button class="delete-village rad-6">Delete Village</button>
            <button class="update-demographic-village rad-6">Update Demographic Data</button>
          </div>
        </div>
      `;
    }
  
    // Load villages from localStorage and render
    
    let villages = JSON.parse(localStorage.getItem("villages"));
    const originalOrder = [...villages]; // Store the original order of villages
    const villagesList = document.getElementById("villages-list");
    console.log(villagesList)
  
    function renderVillages(villagesToRender, page) {
      const startIndex = (page - 1) * villagesPerPage;
      const endIndex = startIndex + villagesPerPage;
      const paginatedVillages = villagesToRender.slice(startIndex, endIndex);
      const villagesResult = paginatedVillages.map(villageElement).join("")
      console.log(villagesResult);
      
      villagesList.innerHTML = villagesResult;
  
      // Handle "Prev" and "Next" button visibility
      document.getElementById("prev-page").disabled = page <= 1;
      document.getElementById("next-page").disabled =
        endIndex >= villagesToRender.length;
    }
  
    renderVillages(villages, currentPage);
  
    // Handle sorting
    const sortBy = document.getElementById("sort-by");
    sortBy.addEventListener("change", () => {
      const sortOption = sortBy.value;
      if (sortOption === "alphabetical") {
        villages.sort((a, b) =>
          a.villageName.localeCompare(b.villageName, undefined, {
            sensitivity: "base",
          })
        );
      } else if (sortOption === "default") {
        villages = [...originalOrder]; // Reset to original order
      }
      currentPage = 1; // Reset to first page
      renderVillages(villages, currentPage);
    });
  
    // Handle pagination buttons
    document.getElementById("prev-page").addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderVillages(villages, currentPage);
      }
    });
  
    document.getElementById("next-page").addEventListener("click", () => {
      const totalPages = Math.ceil(villages.length / villagesPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderVillages(villages, currentPage);
      }
    });
  
    // Event delegation for all buttons
    document.body.addEventListener("click", (event) => {
      // Close modal buttons
      if (event.target.closest(".modal-header button")) {
        closeAllModals();
      }
  
      // Add Village Modal
      if (event.target.id === "add-village") {
        document.getElementById("adding-village").style.display = "block";
        overlay.style.display = "block";
      }
  
      // Handle View Village
      if (event.target.classList.contains("view-village")) {
        const villageDiv = event.target.closest("#village-element");
        const nameElement = villageDiv.querySelector(".name").textContent;
        const [villageName, region] = nameElement.split(" - ");
        const village = villages.find(
          (v) =>
            v.villageName === villageName.trim() && v.region === region.trim()
        );
        if (village) {
          const viewingVillage = document.getElementById("viewing-village");
          viewingVillage.querySelector(".village-name .value").textContent =
            village.villageName;
          viewingVillage.querySelector(".region .value").textContent =
            village.region;
          viewingVillage.querySelector(".land-area .value").textContent =
            village.landArea;
          viewingVillage.querySelector(".latitude .value").textContent =
            village.latitude;
          viewingVillage.querySelector(".longitude .value").textContent =
            village.longitude;
          viewingVillage.querySelector(".tags .value").textContent =
            village.category;
          viewingVillage
            .querySelector(".image .value")
            .setAttribute("src", village.villageImage);
  
          viewingVillage.style.display = "block";
          overlay.style.display = "block";
        }
      }
  
      // Handle Update Village
      if (event.target.classList.contains("update-village")) {
        document.getElementById("updating-village").style.display = "block";
        overlay.style.display = "block";
        villageToUpdate = event.target.closest("#village-element");
      }
  
      // Handle Update Demographic Data
      if (event.target.classList.contains("update-demographic-village")) {
        document.getElementById("updating-demographic").style.display = "block";
        overlay.style.display = "block";
        villageToUpdate = event.target.closest("#village-element");
      }
  
      // Handle Delete Village
      if (event.target.classList.contains("delete-village")) {
        const villageDiv = event.target.closest("#village-element");
        const nameElement = villageDiv.querySelector(".name").textContent;
        const [villageName, region] = nameElement.split(" - ");
  
        // Update the villages array and localStorage
        villages = villages.filter(
          (v) =>
            !(v.villageName === villageName.trim() && v.region === region.trim())
        );
        localStorage.setItem("villages", JSON.stringify(villages));
        renderVillages(villages, currentPage);
      }
    });
  
    // Add New Village Handler
    document.querySelector("#adding-village input[type='submit']").addEventListener("click", (event) => {
        event.preventDefault();
        const newVillage = {
          villageName: document.querySelector("#adding-village #village-name")
            .value,
          region: document.querySelector("#adding-village #region").value,
          landArea: document.querySelector("#adding-village #land-area").value,
          latitude: document.querySelector("#adding-village #latitude").value,
          longitude: document.querySelector("#adding-village #longitude").value,
          category: document.querySelector("#adding-village #categories").value,
          population: 13117,
          villageImage: document.querySelector("#adding-village #village-image")
            .value,
          ageDistribution: [
            {
              upperlimit: 18,
              value: 45,
            },
            {
              upperlimit: 35,
              value: 30,
            },
            {
              upperlimit: 50,
              value: 15,
            },
            {
              upperlimit: 65,
              value: 7,
            },
            {
              upperlimit: 100,
              value: 3,
            },
          ],
          genderRatios: {
            male: 50.5,
            female: 49.5,
          },
          populationGrowthRate: 2.5,
        };
  
        // Add to villages array and update localStorage
        villages.push(newVillage);
        originalOrder.push(newVillage); // Add to the original order as well
        localStorage.setItem("villages", JSON.stringify(villages));
        renderVillages(villages, currentPage);
  
        // Close modals
        closeAllModals();
      });
  
    document
      .querySelector("#updating-village input[type='submit']")
      .addEventListener("click", (event) => {
        event.preventDefault();
        const updatedVillage = {
          villageName: document.querySelector("#updating-village #village-name")
            .value,
          region: document.querySelector("#updating-village #region").value,
          landArea: document.querySelector("#updating-village #land-area").value,
          latitude: document.querySelector("#updating-village #latitude").value,
          longitude: document.querySelector("#updating-village #longitude").value,
        };
  
        villages.forEach((villageLocal) => {
          if (
            villageLocal.villageName ===
            villageToUpdate.querySelector(".name").innerHTML.split(" ")[0]
          ) {
            villageLocal.villageName = updatedVillage.villageName;
            villageLocal.region = updatedVillage.region;
            villageLocal.landArea = updatedVillage.landArea;
            villageLocal.latitude = updatedVillage.latitude;
            villageLocal.longitude = updatedVillage.longitude;
          }
        });
        localStorage.setItem("villages", JSON.stringify(villages));
        renderVillages(villages, currentPage);
        closeAllModals();
      });
  
      document
      .querySelector("#updating-demographic input[type='submit']")
      .addEventListener("click", (event) => {
        event.preventDefault();
    
        // Get updated demographic data from form
        const updatedPopulation = parseInt(
          document.querySelector("#updating-demographic #population-size").value,
          10
        ) || 13117; // Default value if not provided
        const updatedGrowthRate = parseFloat(
          document.querySelector("#updating-demographic #growth-rate").value
        ) || 2.5; // Default value if not provided
    
        const updatedAgeDistribution = [
          {
            upperlimit: 18,
            value: 45,
          },
          {
            upperlimit: 35,
            value:30,
          },
          {
            upperlimit: 50,
            value: 15,
          },
          {
            upperlimit: 65,
            value: 7,
          },
          {
            upperlimit: 100,
            value: 3,
          },
        ];
        let AgeData = document.querySelector(".age-distribution").split(" ");
        for (let i=0; i < updatedAgeDistribution.length;i++) {
          updatedAgeDistribution[i].value = AgeData[i];
        }

        let genderData = document.querySelector(".gender-ratios").split(" ");
        const updatedGenderRatios = {
          male : genderData[0],
          female : genderData[1]
        }
    
        // Find and update the target village
        const villageName = villageToUpdate.querySelector(".name").textContent.split(" - ")[0].trim();
        villages.forEach((village) => {
          if (village.villageName === villageName) {
            village.population = updatedPopulation;
            village.populationGrowthRate = updatedGrowthRate;
            village.ageDistribution = updatedAgeDistribution;
            village.genderRatios = updatedGenderRatios;
          }
        });
    
        // Save updated villages to localStorage
        localStorage.setItem("villages", JSON.stringify(villages));
    
        // Re-render villages and close the modal
        renderVillages(villages, currentPage);
        closeAllModals();
      });
    
  
  return(
    <>
    <section id="overlay"></section>
    <section id="adding-village" class="rad-6 modal-village">
      <div class="modal-header">
        <h2>Add New Village</h2>
        <button>x</button>
      </div>
      <form action="">
        <div>
          <label for="village-name">Village Name:</label>
          <input type="text" name="Village Name" id="village-name" value="Tammun"/>
        </div>
        <div>
          <label for="region">Region/District:</label>
          <input type="text" name="Region" id="region" value="West Bank"/>
        </div>
        <div>
          <label for="land-area">Land Area (sq km):</label>
          <input type="text" name="Village Name" id="land-area" value="81"/>
        </div>
        <div>
          <label for="latitude">Latitude:</label>
          <input type="text" name="Latitude" id="latitude" value="32.3219"/>
        </div>
        <div>
          <label for="longitude">Longitude:</label>
          <input type="text" name="Longitude" id="longitude" value="35.3219"/>
        </div>
        <div>
          <label for="village-image">Upload Image:</label>
          <input type="file" name="Image" id="village-image"/>
        </div>
        <div>
          <label for="categories">Categories/Tags:</label>
          <input type="text" name="Categories" id="categories" placeholder="e.g., rural, urban" value="rural"/>
        </div>
        <input type="submit" value="Add Village"/>
      </form>
    </section>
    <section id="viewing-village" class="rad-6 modal-village">
      <div class="modal-header">
        <h2>Village Details</h2>
        <button>x</button>
      </div>
      <div class="village-data">
        <div class="village-name">
          <span class="info">Village Name:</span>
          <span class="value">Jabalia</span>
        </div>
        <div class="region">
          <span class="info">Region/District:</span>
          <span class="value">Gaza Strip</span>
        </div>
        <div class="land-area">
          <span class="info">Land Area (sq km):</span>
          <span class="value">10</span>
        </div>
        <div class="latitude">
          <span class="info">Latitude:</span>
          <span class="value">31.9522</span>
        </div>
        <div class="longitude">
          <span class="info">Longitude:</span>
          <span class="value">35.2034</span>
        </div>
        <div class="tags">
          <span class="info">Tags:</span>
          <span class="value">undefined</span>
        </div>
        <div class="image">
          <span class="info">Village Image</span>
          <img class="value" src="" alt=""/>
        </div>
      </div>
    </section>
    <section id="updating-village" class="rad-6 modal-village">
      <div class="modal-header">
        <h2>Update Village</h2>
        <button>x</button>
      </div>
      <form action="">
        <div>
          <label for="village-name">Village Name:</label>
          <input type="text" name="Village Name" id="village-name" value="Azmut"/>
        </div>
        <div>
          <label for="region">Region/District:</label>
          <input type="text" name="Region" id="region" value="West Bank"/>
        </div>
        <div>
          <label for="land-area">Land Area (sq km):</label>
          <input type="text" name="Land Area" id="land-area" value="10"/>
        </div>
        <div>
          <label for="latitude">Latitude:</label>
          <input type="text" name="Latitude" id="latitude" value="32.2397"/>
        </div>
        <div>
          <label for="longitude">Longitude:</label>
          <input type="text" name="Longitude" id="longitude" value="35.2953"/>
        </div>
        <div>
          <label for="village-image">Upload Image:</label>
          <input type="file" name="Image" id="village-image"/>
        </div>
        <input type="submit" value="Update Village"/>
      </form>
    </section>
    <section id="updating-demographic" class="rad-6 modal-village">
      <div class="modal-header">
        <h2>Add Demographic Data For</h2>
        <button>x</button>
      </div>
      <form action="">
        <div>
          <label for="population-size">Population Size:</label>
          <input type="text" name="Population Size" id="population-size" value="2887"/>
        </div>
        <div>
          <label for="age-distribution">Age Distribution:</label>
          <input type="text" name="Age Distribution" id="age-distribution" placeholder="e.g., 0-14: 30%, 15-64: 60%, 65+: 10%" value="40 30 18 8 4"/>
        </div>
        <div>
          <label for="gender-ratios">Gender Ratios:</label>
          <input type="text" name="Gender Ratios" id="gender-ratios" placeholder="e.g., Male: 51%, Female: 49%" value="51 49"/>
        </div>
        <div>
          <label for="growth-rate">Population Growth Rate:</label>
          <input type="text" name="Population Growth Rate" id="growth-rate" value="2.7"/>
        </div>
        <input type="submit" value="Add Demographic Data"/>
      </form>
    </section>
    <div id="content">
      <button id="add-village" class="rad-6">Add New Village</button>
      <div id="page-content"  class="management rad-6">
        <div id="view-village-list">
          <h3>View Village List</h3>
          <input class="rad-6" type="search" name="village-name" id="search-village" placeholder="Search villages..."/>
          <div id="villages-config">
            <div id="sort">
              <label for="sort-by">Sort by:</label>
              <select name="sort" class="rad-6" id="sort-by">
                <option value="default">Default</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
            <div id="navigate-pages">
              <p>Page:</p>
              <button id="prev-page" class="rad-6">Prev</button>
              <button id="next-page" class="rad-6">Next</button>
            </div>
          </div>
          <div id="villages-list">
            <div class="rad-6" id="village-element">
              <div class="name">Jabalia - Gaza Strip</div>
              <div class="village-buttons">
                <button class="view-village rad-6">View</button>
                <button class="update-village rad-6">Update Village</button>
                <button class="delete-village rad-6">Delete Village</button>
                <button class="update-demographic-village rad-6">Update Demographic Data</button>
              </div>
            </div>
            <div class="rad-6" id="village-element">
              <div class="name">Jabalia - Gaza Strip</div>
              <div class="village-buttons">
                <button class="view-village rad-6">View</button>
                <button class="update-village rad-6">Update Village</button>
                <button class="delete-village rad-6">Delete Village</button>
                <button class="update-demographic-village rad-6">Update Demographic Data</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}