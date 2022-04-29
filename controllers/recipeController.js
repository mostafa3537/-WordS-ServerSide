const multer = require('multer');
const sharp = require('sharp');
const Recipe = require('../models/recipeModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadRecipeImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeRecipeImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  // 1) imageCover
  if (req.files.imageCover) {
    const folderName = `img/Recipes/Recipe-cover-${
      req.params.id
    }-${Date.now()}`;

    req.body.imageCover = `${req.protocol}://localhost:8000/${folderName}.jpeg`;
    console.log(req.body.imageCover);
    await sharp(req.files.imageCover[0].buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/${folderName}.jpeg`);
  }

  //// 2) Images
  // if (req.files.gallery) {
  //   req.body.images = [];
  //   const folderName = `img/Recipes/Recipe-images-${
  //     req.params.id
  //   }-${Date.now()}`;
  //   await Promise.all(
  //     req.files.images.map(async (file, i) => {
  //       if (process.env.NODE_ENV === 'development') {
  //         const filename = `${req.protocol}://localhost:8000/${folderName}-${
  //           i + 1
  //         }.jpeg`;
  //         req.body.images.push(filename);
  //       } else if (process.env.NODE_ENV === 'Recipeion') {
  //         const filename = `https://iti-art-deco.herokuapp.com/${folderName}-${
  //           i + 1
  //         }.jpeg`;
  //         req.body.images.push(filename);
  //       }

  //       await sharp(file.buffer)
  //         .resize(500, 500)
  //         .toFormat('jpeg')
  //         .jpeg({ quality: 90 })
  //         .toFile(`public/${folderName}-${i + 1}.jpeg`);

  //       // req.body.images.push(filename);
  //     })
  //   );
  // }

  next();
});

exports.getAllRecipes = factory.getAll(Recipe);
exports.getRecipe = factory.getOne(Recipe);
exports.createRecipe = factory.createOne(Recipe);
exports.updateRecipe = factory.updateOne(Recipe);
exports.deleteRecipe = factory.deleteOne(Recipe);

exports.getRecipeStats = catchAsync(async (req, res, next) => {
  const stats = await Recipe.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
