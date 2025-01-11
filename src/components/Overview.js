export default function Overview() {
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

        // Access and use the data here
        localStorage.setItem("villages" , JSON.stringify(villages))
        document.querySelector(".villagesNumber").innerHTML = villagesNumber;
        document.querySelector(".urbanNumber").innerHTML = urbanNumber;
        document.querySelector(".populationSize").innerHTML = populationSize;
        document.querySelector(".averageLandArea").innerHTML = averageLandArea;
        let villagesPopulations = [];
        let villagesNames = [];
        for (const village of villages) {
          villagesPopulations.push(village.population);
          villagesNames.push(village.villageName);
        }
        
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
        new Chart(document.querySelector(".ageDistributionChart"), {
          type: "pie",
          data: {
            labels: ["0-18", "19-35", "36-50", "51-65", "+65"],
            datasets: [
              {
                label: "# of People",
                data: [averageAgeDistribution[0].value, averageAgeDistribution[1].value, averageAgeDistribution[2].value, averageAgeDistribution[3].value, averageAgeDistribution[4].value],
                borderWidth: 1,
              },
            ],
          },
        });
        new Chart(document.querySelectorAll(".genderChart"), {
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

        
        // initMap()
        return {
          villages,
          villagesNumber,
          urbanNumber,
          populationSize,
          averageLandArea,
          averageAgeDistribution,
          averageGenderRatios,
        };
      } else {
        console.error("Error fetching overview data: ", result.errors);
      }
    } catch (error) {
      console.error("Error making request: ", error);
    }
  };

  // Example usage
  fetchOverviewData().then((overviewData) => {
    console.log("Overview Data: ", overviewData);
  });
  return (
    <>
      <div id="content">
        <h1>Overview</h1>
        <div id="page-content">
          <div id="map"></div>
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

    </>
  );
}
