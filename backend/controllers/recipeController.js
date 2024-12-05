const Recipe = require('../models/Recipe');
const User = require('../models/User');


const createRecipe = async (req, res) => {
	const { title, ingredients, instructions,imgurl, prepTime, difficulty, category, userid} = req.body;
	try{
		const recipe = new Recipe({
			title,
			ingredients,
			instructions,
			imgurl,
			prepTime,
			difficulty,
			category,
			userid
		});

	const createdRecipe = await recipe.save();
	res.status(200).json(createdRecipe);
	}
	catch(e){
		res.status(500).json({ message: 'Server error' });
	}
};


const getRecipes = async (req, res) => {
  let { page = 1, limit = 5, category, difficulty, search = '' } = req.query; // Default search to empty string
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  const query = {};
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { ingredients: { $regex: search, $options: 'i' } },
    ];
  }
  console.log('Query object:', query);
  try {
    const recipes = await Recipe.find(query)
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Recipe.countDocuments(query);

    res.status(200).json({
      recipes,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRecipes: total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching recipes' });
  }
};


const savedRecipe = async (req, res) => {
  try {
    const { recipeID, userID } = req.body;

    // Validate IDs
    if (!recipeID || !userID) {
      return res.status(400).json({ message: 'RecipeID and UserID are required' });
    }
    if (!mongoose.Types.ObjectId.isValid(recipeID) || !mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).json({ message: 'Invalid RecipeID or UserID' });
    }

    // Find recipe and user
    const recipe = await Recipe.findById(recipeID);
    const user = await User.findById(userID);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if recipe is already saved
    const alreadySaved = user.savedRecipes.includes(recipeID);
    if (alreadySaved) {
      return res.status(400).json({ message: 'Recipe already saved' });
    }

    // Save recipe
    user.savedRecipes.push(recipeID);
    await user.save();

    return res.status(201).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    console.error('Error saving recipe:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};




const getsavedRecipebyid = async(req,res)=>  {
  try {
    const user = await User.findById(req.params.userID);
    return res.status(201).json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};


const getsavedRecipe = async(req,res)=>  {
  try {
    const user = await User.findById(req.params.userID);
    const savedRecipes = await Recipe.find({
      _id: { $in: user?.savedRecipes },
    });

    return res.status(201).json({ savedRecipes });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};


// Rate a recipe
const rateRecipe = async(req,res) => {
  const { recipeId } = req.params;
  const { userid, rating } = req.body;

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const userRating = recipe.ratings.find(r => r.userid.toString() === userid);
    if (userRating) {
      userRating.rating = rating;
    } else {
      recipe.ratings.push({ userid, rating });
    }

    await recipe.save();

    // Calculate the new average rating
    const totalRatings = recipe.ratings.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = totalRatings / recipe.ratings.length;
    const numberOfRatings = recipe.ratings.length;
    res.status(202).json({ averageRating, numberOfRatings });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const gettotalReciperatting = async(req,res) => {
  const { recipeId } = req.params;

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const totalRatings = recipe.ratings.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = totalRatings / recipe.ratings.length;
    const numberOfRatings = recipe.ratings.length;

    return res.status(202).json({ averageRating, numberOfRatings });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



//comment apis
/// Get all comments for a recipe
const getComments = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const recipe = await Recipe.findById(recipeId).populate('comments.userid', 'username');
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    return res.status(200).json(recipe.comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


const addComment = async (req, res) => {
  const { userid, comment } = req.body;
  const { recipeId } = req.params;

  try {
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

      const datacomment = { userid, comment };
      recipe.comments.push(datacomment);
      await recipe.save();

      const recipeoutput = await recipe.populate('comments.userid', 'username');
      if (!recipeoutput) return res.status(404).json({ message: 'Failed to populate recipe data' });

      return res.status(201).json(recipeoutput.comments);
  } catch (error) {
      console.error("Error adding comment:", error);
      return res.status(500).json({ message: 'Server error' });
  }
};


// Edit a comment
const editComment = async (req, res) => {
  const { recipeId, commentId } = req.params;
  const { comment } = req.body;

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const commentToEdit = recipe.comments.find(c => c._id.toString() === commentId);
    if (!commentToEdit) return res.status(404).json({ message: 'Comment not found' });

    commentToEdit.comment = comment;
    await recipe.save();

    console.log("before", commentToEdit);
    await Recipe.populate(recipe, {
      path: 'comments.userid',
      select: 'username'
    });

    const updatedComment = recipe.comments.id(commentId);
    return res.status(200).json(updatedComment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  const { recipeId, commentId } = req.params;

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    
    recipe.comments.pull({ _id: commentId });

    await recipe.save();
    return res.status(200).json(recipe.comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


// my recipe api 

const getMyrecipe =async (req,res)=>{
  try {
    const { userId } = req.params;
    const recipes = await Recipe.find({ userid:userId }).populate('userid', 'username');
    return res.status(200).json(recipes);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}


const editMyrecipe = async (req, res) => {
  const { title, ingredients, instructions, imgurl, prepTime, difficulty, category } = req.body;
  try {
      const recipe = await Recipe.findById(req.params.recipeId); // Correct parameter to recipeId
      if (recipe) {
          recipe.title = title || recipe.title;
          recipe.ingredients = ingredients || recipe.ingredients;
          recipe.instructions = instructions || recipe.instructions;
          recipe.imgurl = imgurl || recipe.imgurl;
          recipe.prepTime = prepTime || recipe.prepTime;
          recipe.difficulty = difficulty || recipe.difficulty;
          recipe.category = category || recipe.category;
          recipe.updatedAt = new Date(); // Use updatedAt instead of modifying createdAt

          const updatedRecipe = await recipe.save();
          res.status(200).json(updatedRecipe);
      } else {
          res.status(404).json({ message: 'Recipe not found' });
      }
  } catch (e) {
      res.status(500).json({ message: 'Server error' });
  }
};


const deleteMyrecipe = async (req, res) => {
  const { recipeId } = req.params;
  
  try {
      // Find and delete the recipe
      const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
      if (!deletedRecipe) return res.status(404).json({ message: 'Recipe not found' });

      // Update all users' savedRecipes array
      const usersUpdated = await User.updateMany(
          { savedRecipes: recipeId },
          { $pull: { savedRecipes: recipeId } }
      );
      console.log(`${usersUpdated.modifiedCount} users updated`);

      res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};





const getFeaturerecipe = async (req, res) => {
  try {
    const recipes = await Recipe.aggregate([
      { $unwind: '$ratings' },
      {
        $group: {
          _id: '$_id',
          title: { $first: '$title' },
          ingredients: { $first: '$ingredients' },
          instructions: { $first: '$instructions' },
          imgurl: { $first: '$imgurl' },
          prepTime: { $first: '$prepTime' },
          difficulty: { $first: '$difficulty' },
          category: { $first: '$category' },
          userid: { $first: '$userid' },
          ratings: { $push: '$ratings' },
          totalRating: { $sum: '$ratings.rating' },
        },
      },
      { $sort: { totalRating: -1 } },
      { $limit: 1 },
    ]);

    if (recipes.length === 0) {
      return res.status(404).json({ message: 'No recipes found' });
    }

    const featuredRecipe = recipes[0];
    const user = await User.findById(featuredRecipe.userid);
    const username = user ? user.username : 'Unknown';

    res.status(200).json({ featuredRecipe, username });
  } catch (error) {
    console.error('Error fetching featured recipe:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  createRecipe,
  getRecipes,
  savedRecipe,
  getsavedRecipe,
  getsavedRecipebyid,
  rateRecipe ,
  gettotalReciperatting,
  addComment,
  editComment,
  deleteComment,
  getComments,
  getMyrecipe,
  editMyrecipe,
  deleteMyrecipe,
  getFeaturerecipe
};
