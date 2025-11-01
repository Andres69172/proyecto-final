const mongoose = require('mongoose');
const Game = require('../models/Game');

const gamesData = [
  {
    title: "The Legend of Zelda: Tears of the Kingdom",
    platform: "Nintendo Switch",
    genre: "Aventura",
    releaseDate: "2023-05-12",
    rating: 4.9,
    image: "https://assets.nintendo.com/image/upload/c_pad,f_auto,h_613,q_auto,w_1089/ncom/en_US/games/switch/t/the-legend-of-zelda-tears-of-the-kingdom-switch/hero?v=2023042118"
  },
  {
    title: "God of War Ragnarök",
    platform: "PlayStation 5",
    genre: "Acción/Aventura",
    releaseDate: "2022-11-09",
    rating: 4.8,
    image: "https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4xJ8XB3bi888QTLZYdl7Oi0s.png"
  },
  {
    title: "Elden Ring",
    platform: "PC",
    genre: "RPG",
    releaseDate: "2022-02-25",
    rating: 4.7,
    image: "https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/phvVT0qZfcRms5qDAk0SI3CM.png"
  },
  {
    title: "Starfield",
    platform: "Xbox Series X",
    genre: "RPG",
    releaseDate: "2023-09-06",
    rating: 4.5,
    image: "https://assets.xboxservices.com/assets/1d/56/1d5607c7-44ea-4566-a292-e070d03f214e.jpg"
  },
  {
    title: "Final Fantasy XVI",
    platform: "PlayStation 5",
    genre: "RPG",
    releaseDate: "2023-06-22",
    rating: 4.6,
    image: "https://image.api.playstation.com/vulcan/ap/rnd/202211/0411/kh4MUIuMmHlktOHar3lVl6rY.png"
  },
  {
    title: "Cyberpunk 2077",
    platform: "PC",
    genre: "RPG",
    releaseDate: "2020-12-10",
    rating: 4.0,
    image: "https://image.api.playstation.com/vulcan/ap/rnd/202111/3013/cKZ4tKNFj9C00DYkxqJXNMS4.png"
  },
  {
    title: "Super Mario Wonder",
    platform: "Nintendo Switch",
    genre: "Plataformas",
    releaseDate: "2023-10-20",
    rating: 4.8,
    image: "https://assets.nintendo.com/image/upload/c_pad,f_auto,h_613,q_auto,w_1089/ncom/en_US/games/switch/s/super-mario-bros-wonder-switch/hero"
  },
  {
    title: "Spider-Man 2",
    platform: "PlayStation 5",
    genre: "Acción/Aventura",
    releaseDate: "2023-10-20",
    rating: 4.7,
    image: "https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/1c7c03d0ed9764909360b8227ee57c66690bd65d6261d350.png"
  },
  {
    title: "Red Dead Redemption 2",
    platform: "PC",
    genre: "Acción/Aventura",
    releaseDate: "2019-12-05",
    rating: 4.9,
    image: "https://image.api.playstation.com/vulcan/ap/rnd/202208/0921/dR9KJAKDW2izPbptHQbh3rnj.png"
  },
  {
    title: "Halo Infinite",
    platform: "Xbox Series X",
    genre: "FPS",
    releaseDate: "2021-12-08",
    rating: 4.3,
    image: "https://store-images.s-microsoft.com/image/apps.21536.13727851868390641.c9cc5f66-aff8-406c-af6b-440838730be0.68796bde-cbf5-4eaa-a299-011417041da6"
  },
  {
    title: "Resident Evil 4 Remake",
    platform: "PlayStation 5",
    genre: "Survival Horror",
    releaseDate: "2023-03-24",
    rating: 4.8,
    image: "https://image.api.playstation.com/vulcan/ap/rnd/202210/0706/EVWyZD63pahuh95eKloFaJuC.png"
  },
  {
    title: "Metroid Prime Remastered",
    platform: "Nintendo Switch",
    genre: "Acción/Aventura",
    releaseDate: "2023-02-08",
    rating: 4.7,
    image: "https://assets.nintendo.com/image/upload/c_pad,f_auto,h_613,q_auto,w_1089/ncom/en_US/games/switch/m/metroid-prime-remastered-switch/hero"
  }
];

const seedDatabase = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect('mongodb://localhost:27017/gamelib', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado a MongoDB...');

    // Limpiar la colección existente
    await Game.deleteMany({});
    console.log('Colección de juegos limpiada...');

    // Insertar los nuevos juegos
    await Game.insertMany(gamesData);
    console.log('¡Juegos de ejemplo insertados exitosamente!');

    // Cerrar la conexión
    await mongoose.connection.close();
    console.log('Conexión cerrada. ¡Proceso completado!');

  } catch (error) {
    console.error('Error durante el seeding:', error);
    process.exit(1);
  }
};

seedDatabase();