import React, { useEffect, useState } from "react";
// import Chart from "chart.js/auto";

export default function Overview() {
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    fetchOverviewData();
  }, []);

  useEffect(() => {
    if (villages.length > 0) {
      initMap();
    }
  }, [villages]);

  const fetchOverviewData = async () => {
    const query = `
      query {
        adminOverview {
          villages {
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
          villagesNumber
          urbanNumber
          populationSize
          averageLandArea
          averageAgeDistribution {
            upperlimit
            value
          }
          averageGenderRatios {
            male
            female
          }
        }
      }
    `;

    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();

      if (result.data && result.data.adminOverview) {
        const {
          villages,
          villagesNumber,
          urbanNumber,
          populationSize,
          averageLandArea,
          averageAgeDistribution,
          averageGenderRatios,
        } = result.data.adminOverview;

        // Update state with villages data
        setVillages(villages);
        localStorage.setItem("villages" , JSON.stringify(villages));
        // Update DOM elements with fetched data
        document.querySelector(".villagesNumber").innerHTML = villagesNumber;
        document.querySelector(".urbanNumber").innerHTML = urbanNumber;
        document.querySelector(".populationSize").innerHTML = populationSize;
        document.querySelector(".averageLandArea").innerHTML = averageLandArea;

        // Render charts
        renderCharts(villages, averageAgeDistribution, averageGenderRatios);
      } else {
        console.error("Error fetching overview data: ", result.errors);
      }
    } catch (error) {
      console.error("Error making request: ", error);
    }
  };

  const renderCharts = (villages, averageAgeDistribution, averageGenderRatios) => {
    const villagesPopulations = villages.map((village) => village.population);
    const villagesNames = villages.map((village) => village.villageName);

    // Population Bar Chart
    new Chart(document.getElementById("populationBar"), {
      type: "bar",
      data: {
        labels: villagesNames,
        datasets: [
          {
            label: "Population",
            data: villagesPopulations,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Age Distribution Pie Chart
    new Chart(document.querySelector(".ageDistributionChart"), {
      type: "pie",
      data: {
        labels: ["0-18", "19-35", "36-50", "51-65", "+65"],
        datasets: [
          {
            label: "# of People",
            data: [
              averageAgeDistribution[0].value,
              averageAgeDistribution[1].value,
              averageAgeDistribution[2].value,
              averageAgeDistribution[3].value,
              averageAgeDistribution[4].value,
            ],
            borderWidth: 1,
          },
        ],
      },
    });

    // Gender Ratios Pie Chart
    new Chart(document.querySelector(".genderChart"), {
      type: "pie",
      data: {
        labels: ["Male", "Female"],
        datasets: [
          {
            label: "# of People",
            data: [averageGenderRatios.male, averageGenderRatios.female],
            borderWidth: 1,
          },
        ],
      },
    });
  };

  const initMap = () => {
    const locations = villages.map((village) => ({
      lat: village.latitude,
      lng: village.longitude,
    }));

    const map = new window.google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: locations[0],
    });

    const bounds = new window.google.maps.LatLngBounds();

    locations.forEach((loc) => {
      new window.google.maps.Marker({
        position: loc,
        map: map,
      });
      bounds.extend(loc);
    });

    map.fitBounds(bounds);
  };

  // Load Google Maps API script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAysQBM3-leTK8l9EKH9GpzS5HeIplJeUM&callback=initMap`;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div id="content">
      <h1>Overview</h1>
      <div id="page-content">
        <div id="map" style={{ height: "400px", width: "100%" }}></div>
        <div id="stats">
          <div className="col-3 rad-6">
            <p>Total Number of Villages</p>
            <div className="villagesNumber">8</div>
          </div>
          <div className="col-3 rad-6">
            <p>Total Number of Urban Areas</p>
            <div className="urbanNumber">3</div>
          </div>
          <div className="col-3 rad-6">
            <p>Total Population Size</p>
            <div className="populationSize">660000</div>
          </div>
          <div className="col-3 rad-6">
            <p>Average Land Area</p>
            <div className="averageLandArea">11.88</div>
            <div id="unit" className="gray-text">
              sq km
            </div>
          </div>
        </div>
        <canvas id="populationBar"></canvas>
        <div id="graphs-content">
          <div className="graphs">
            <div className="rad-6">
              <h3>Age Distribution</h3>
              <div className="gray-text">Age Distribution</div>
              <canvas className="ageDistributionChart"></canvas>
            </div>
            <div className="rad-6">
              <h3>Gender Ratios</h3>
              <div className="gray-text">Gender Ratios</div>
              <canvas className="genderChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}