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

//dest dir to upload into
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadRecipeImage = upload.single('imageCover');

exports.resizeRecipeImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const folderName = `img/recipes/recipe-${req.params.id}-${Date.now()}.jpeg`;

  if (process.env.NODE_ENV === 'development') {
    req.file.filename = `${req.protocol}://localhost:8000/${folderName}`;
  } else if (process.env.NODE_ENV === 'production') {
    req.file.filename = `https://iti-art-deco.herokuapp.com/${folderName}`;
  }
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/${folderName}`);
  next();
});

exports.updateRecipe = catchAsync(async (req, res, next) => {
  console.log('req.params.id', req.params.id);
  console.log('req.body', req.body);
  if (req.file) {
    req.body.imageCover = req.file.filename;
  }
  const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidation: true,
  });

  if (!recipe) {
    return next(new AppError('No Document was found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: recipe,
    },
  });
});

exports.createRecipe = catchAsync(async (req, res, next) => {
  console.log('req.file', req.file);
  console.log('req.body', req.body);
  if (req.file) {
    req.body.imageCover = req.file.filename;
  }
  const recipe = await Recipe.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: recipe,
    },
  });
});

exports.getAllRecipes = factory.getAll(Recipe);
exports.getRecipe = factory.getOne(Recipe);
// exports.createRecipe = factory.createOne(Recipe);
exports.deleteRecipe = factory.deleteOne(Recipe);
