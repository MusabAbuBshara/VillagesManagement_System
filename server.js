/*

2)in adminSignup page client will send (adminName) and (adminFullName) and (adminPassword)
  add him to the data base and return "the admin has been added successfully"

4)in userSignup page client will send (userName) and (userFullName) and (userPassword)
  add him to the data base and return "the user has been added successfully"

7) in adminManagement page :-
  a) return the whole (villages) array
  b) client will send new village with (newVillage) name ADD it to the villages array
  c) client will send updated village with (updatedVillage) name find it in villages array and UPDATE it
  d) client will send (villageName) for the village that you nedd to DELETE it from villages array

8) in adminGallery page :-
  a) return the whole (images) array
  b) client will send new village with (newImage) name ADD it to the images array
*/
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const cors = require("cors"); // Import CORS

// Mock data
let admins = [
  {
    adminName: "musab",
    adminFullName: "Musab Abu Bshara",
    adminPassword: "123",
    adminImage: "../imgs/musab.jpg",
    token: "ADMIN1",
  },
  {
    adminName: "walid",
    adminFullName: "Walid Zitawi",
    adminPassword: "456",
    adminImage: "../imgs/walid.jpg",
    token: "ADMIN2",
  },
  {
    adminName: "maen",
    adminFullName: "Maen Daher",
    adminPassword: "789",
    adminImage: "../imgs/maen.png",
    token: "ADMIN3",
  },
];
let users = [
  {
    userName: "user1",
    userFullName: "User 1",
    userPassword: "123",
    userImage: "../imgs/user1.png",
    token: "USER1",
  },
  {
    userName: "user2",
    userFullName: "User 2",
    userPassword: "456",
    userImage: "../imgs/user2.png",
    token: "USER2",
  },
  {
    userName: "user3",
    userFullName: "User 3",
    userPassword: "789",
    userImage: "../imgs/user3.png",
    token: "USER3",
  },
];

let villages = [
  {
    villageName: "Jabalia",
    region: "Gaza Strip",
    landArea: 10, // km²
    latitude: 31.9522,
    longitude: 35.2034,
    category: "urban",
    population: 50000,
    villageImage: "../imgs/jabalia.jpg",
    ageDistribution: [
      {
        upperlimit: 18,
        value: 40,
      },
      {
        upperlimit: 35,
        value: 35,
      },
      {
        upperlimit: 50,
        value: 15,
      },
      {
        upperlimit: 65,
        value: 8,
      },
      {
        upperlimit: 100,
        value: 2,
      },
    ],
    genderRatios: {
      male: 51,
      female: 49,
    },
    populationGrowthRate: 5.2, // Percentage per year
  },
  {
    villageName: "Beit Lahia",
    region: "Gaza Strip",
    landArea: 15, // km²
    latitude: 31.561,
    longitude: 34.5001,
    category: "urban",
    population: 60000,
    villageImage: "../imgs/beitLahia.jpg",
    ageDistribution: [
      {
        upperlimit: 18,
        value: 38,
      },
      {
        upperlimit: 35,
        value: 34,
      },
      {
        upperlimit: 50,
        value: 18,
      },
      {
        upperlimit: 65,
        value: 8,
      },
      {
        upperlimit: 100,
        value: 2,
      },
    ],
    genderRatios: {
      male: 50,
      female: 50,
    },
    populationGrowthRate: 4.8,
  },
  {
    villageName: "Quds",
    region: "West Bank",
    landArea: 20, // km²
    latitude: 31.7683,
    longitude: 35.2137,
    category: "urban",
    population: 70000,
    villageImage: "../imgs/quds.jpg",
    ageDistribution: [
      {
        upperlimit: 18,
        value: 32,
      },
      {
        upperlimit: 35,
        value: 30,
      },
      {
        upperlimit: 50,
        value: 20,
      },
      {
        upperlimit: 65,
        value: 15,
      },
      {
        upperlimit: 100,
        value: 3,
      },
    ],
    genderRatios: {
      male: 49,
      female: 51,
    },
    populationGrowthRate: 3.7,
  },
  {
    villageName: "Shejaiya",
    region: "Gaza Strip",
    landArea: 8, // km²
    latitude: 31.5092,
    longitude: 34.4667,
    category: "urban",
    population: 55000,
    villageImage: "../imgs/shejaiya.jpg",
    ageDistribution: [
      {
        upperlimit: 18,
        value: 36,
      },
      {
        upperlimit: 35,
        value: 33,
      },
      {
        upperlimit: 50,
        value: 19,
      },
      {
        upperlimit: 65,
        value: 10,
      },
      {
        upperlimit: 100,
        value: 2,
      },
    ],
    genderRatios: {
      male: 52,
      female: 48,
    },
    populationGrowthRate: 4.5,
  },
  {
    villageName: "Hebron",
    region: "West Bank",
    landArea: 25, // km²
    latitude: 31.5326,
    longitude: 35.0998,
    category: "urban",
    population: 80000,
    villageImage: "../imgs/hebron.jpg",
    ageDistribution: [
      {
        upperlimit: 18,
        value: 35,
      },
      {
        upperlimit: 35,
        value: 34,
      },
      {
        upperlimit: 50,
        value: 18,
      },
      {
        upperlimit: 65,
        value: 10,
      },
      {
        upperlimit: 100,
        value: 3,
      },
    ],
    genderRatios: {
      male: 50,
      female: 50,
    },
    populationGrowthRate: 3.9,
  },
];

let des = "This Village Is";
let gazaReg = "Gaza";
let westReg = "West Bank";
let images = [
  {
    img: "../imgs/jabalia.jpg",
    description: `${des} Jabalia - ${gazaReg}`,
  },
  {
    img: "../imgs/beitLahia.jpg",
    description: `${des} Beit Lahia - ${gazaReg}`,
  },
  {
    img: "../imgs/quds.jpg",
    description: `${des} Quds - ${westReg}`,
  },
  {
    img: "../imgs/shejaiya.jpg",
    description: `${des} Shejaiya - ${gazaReg}`,
  },
  {
    img: "../imgs/hebron.jpg",
    description: `${des} Hebron - ${westReg}`,
  },
];


// GraphQL schema
const schema = buildSchema(`
  type Admin {
    adminName: String
    adminFullName: String
    adminPassword: String
    adminImage: String
    token: String
  }

  type User {
    userName: String
    userFullName: String
    userPassword: String
    userImage: String
    token: String
  }

  type AdminLoginResponse {
    image: String
    token: String
    message: String
  }

  type UserLoginResponse {
    image: String
    token: String
    message: String
  }

  type AgeDistribution {
    upperlimit: Int
    value: Float
  }

  type GenderRatios {
    male: Float
    female: Float
  }

  type Village {
    villageName: String
    region: String
    landArea: Float
    latitude: Float
    longitude: Float
    category: String
    population: Int
    villageImage: String
    ageDistribution: [AgeDistribution]
    genderRatios: GenderRatios
    populationGrowthRate: Float
  }

  type OverviewData {
    villages: [Village]
    villagesNumber: Int
    urbanNumber: Int
    populationSize: Int
    averageLandArea: Float
    averageAgeDistribution: [AgeDistribution]
    averageGenderRatios: GenderRatios
  }

  type Image {
    img: String
    description: String
  }

  type MutationResponse {
    message: String
  }

  type Query {
    loginAdmin(adminName: String!, adminPassword: String!): AdminLoginResponse
    loginUser(userName: String!, userPassword: String!): UserLoginResponse
    adminOverview: OverviewData
    userOverview: OverviewData
    getImages: [Image]
  }

  type Mutation {
    addImage(img: String!, description: String!): Image
    adminSignup(adminName: String!, adminFullName: String!, adminPassword: String!): MutationResponse
    userSignup(userName: String!, userFullName: String!, userPassword: String!): String
    addVillage(newVillage: String!): [Village]
    updateVillage(updatedVillage: String!): [Village]
    deleteVillage(villageName: String!): [Village]
  }

  `);
  // type Query {
  //   getImages: [Image]
  // }

  
// Resolver functions
const root = {
  loginAdmin: ({ adminName, adminPassword }) => {
    const admin = admins.find(
      (admin) =>
        admin.adminName === adminName && admin.adminPassword === adminPassword
    );
    if (admin) {
      return {
        image: admin.adminImage,
        token: admin.token,
        message: null,
      };
    } else {
      return {
        image: null,
        token: null,
        message: "Incorrect Name or Password",
      };
    }
  },
  loginUser: ({ userName, userPassword }) => {
    const user = users.find(
      (user) => user.userName === userName && user.userPassword === userPassword
    );
    if (user) {
      return {
        image: user.userImage,
        token: user.token,
        message: null,
      };
    } else {
      return {
        image: null,
        token: null,
        message: "Incorrect Name or Password",
      };
    }
  },
  adminOverview: getOverviewData,
  userOverview: getOverviewData,
  getImages: () => images,
  addImage: ({ img, description }) => {
    const newImage = { img, description };
    images.push(newImage);
    return newImage;
  },
  adminSignup: ({ adminName, adminFullName, adminPassword }) => {
    admins.push({
      adminName,
      adminFullName,
      adminPassword,
      adminImage: null,
      token: `ADMIN${admins.length + 1}`,
    });
    return { message: "The admin has been added successfully!" };
  },
  userSignup: ({ userName, userFullName, userPassword }) => {
    users.push({ userName, userFullName, userPassword, userImage: null, token: `USER${users.length + 1}` });
    return "The user has been added successfully";
  },
  addVillage: ({ newVillage }) => {
    villages.push(newVillage);
    return villages;
  },
  updateVillage: ({ updatedVillage }) => {
    const index = villages.findIndex((v) => v.villageName === updatedVillage.villageName);
    if (index !== -1) villages[index] = updatedVillage;
    return villages;
  },
  deleteVillage: ({ villageName }) => {
    villages = villages.filter((v) => v.villageName !== villageName);
    return villages;
  },  
};
function getOverviewData() {
  const totalVillages = villages.length;
  const totalUrban = villages.filter((v) => v.category === "urban").length;
  const totalPopulation = villages.reduce((sum, v) => sum + v.population, 0);
  const avgLandArea =
    villages.reduce((sum, v) => sum + v.landArea, 0) / totalVillages;

  const avgAgeDistribution = villages[0].ageDistribution.map(
    ({ upperlimit }) => {
      const totalValue = villages.reduce((sum, village) => {
        const ageObj = village.ageDistribution.find(
          (age) => age.upperlimit === upperlimit
        );
        return sum + (ageObj ? ageObj.value : 0);
      }, 0);
      return { upperlimit, value: totalValue / totalVillages };
    }
  );

  const avgGenderRatios = {
    male:
      villages.reduce((sum, v) => sum + v.genderRatios.male, 0) / totalVillages,
    female:
      villages.reduce((sum, v) => sum + v.genderRatios.female, 0) /
      totalVillages,
  };

  return {
    villages,
    villagesNumber: totalVillages,
    urbanNumber: totalUrban,
    populationSize: totalPopulation,
    averageLandArea: avgLandArea,
    averageAgeDistribution: avgAgeDistribution,
    averageGenderRatios: avgGenderRatios,
  };
}

// Initialize Express
const app = express();

// Enable CORS
app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
});
