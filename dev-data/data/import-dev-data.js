const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Recipes = require('../../models/recipeModel');
// const User = require('../../models/userModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

// READ JSON FILE
const recipes = JSON.parse(
  fs.readFileSync(`${__dirname}/recipes.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Recipes.create(recipes);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Recipes.deleteMany();
    // await User.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
