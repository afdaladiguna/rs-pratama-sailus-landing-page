const mongoose = require('mongoose');
const axios = require('axios');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

// async function seedImg() {
//   try {
//     const resp = await axios.get('https://api.unsplash.com/photos/random', {
//       params: {
//         client_id: 'iiYvC8acAJ8hKK67gwLKRoHGkZE9-yMl5Bt1JVRkCqw',
//         collections: 483251,
//       },
//     });
//     return resp.data.urls.small;
//   } catch (err) {
//     return console.error(err);
//   }
// }
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i += 1) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20000) + 10000;

    const camp = new Campground({
      // image: await seedImg(),
      author: '6552f9e92e325de63fdc65b6',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. At quam tempora commodi adipisci illum laborum illo error a, dicta ipsum vero praesentium nam fuga accusantium alias voluptatibus aperiam molestiae dolorum.',
      price,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: 'https://res.cloudinary.com/depkm8h6l/image/upload/v1700284735/YelpCamp/j8wy0wrbsbe33uzwmdaj.jpg',
          filename: 'YelpCamp/j8wy0wrbsbe33uzwmdaj',
        },
        {
          url: 'https://res.cloudinary.com/depkm8h6l/image/upload/v1700284719/YelpCamp/rup3fvbghikiwy0gfbjo.jpg',
          filename: 'YelpCamp/rup3fvbghikiwy0gfbjo',
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
