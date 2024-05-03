 
const Review = require('../models/review');
const User = require('../models/users');
const Rating = require('../models/rating');


const postReview = async (req, res) => {
    const user = await User.findById(req.user.id);
    const review = {
        userId: req.user.id,
        recipeId: req.body.recipeId,
        username: user.username,
        text: req.body.text,
    };
    try {
        const result = await Review.create(review);
        
        res.status(201).json(result);
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ message: err.message });
    
    }
}

const postRating = async (req, res) => {

    const rating = {
        userId: req.user.id,
        recipeId: req.body.recipeId,
        rating: req.body.rating,
    };
    try {
        if (rating.rating <= 0 || rating.rating >= 6) {
            console.log("rating must be between 1 and 5");
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        if (await Rating.findOne({ userId: rating.userId, recipeId: rating.recipeId })) {
            console.log("rating already exists");
            return res.status(400).json({ message: 'Rating already exists' });
        }

        const result = await Rating.create(rating);

        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
}

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json(review);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        if (req.user._id.toString() !== review.user.toString()) {
            return res.status(403).json({ message: 'Not allowed' });
        }
        review.text = req.body.text;
        await review.save();
        res.status(200).json(review);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        if (req.user._id.toString() !== review.user.toString()) {
            return res.status(403).json({ message: 'Not allowed' });
        }
        await review.remove();
        res.status(200).json({ message: 'Review deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getReviewsByRecipeId = async (req, res) => {
    try {
        console.log(req.body.recipeId);
        const reviews = await Review.find({ recipeId: req.body.recipeId });
        if (reviews.length === 0) {
            return res.status(200).json({ reviews: []});
        }
        console.log(reviews);
        

        res.status(200).json({reviews: reviews});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}



const getRatings = async (req, res) => {
    try {
        const ratings = await Rating.find();
        res.status(200).json(ratings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const calculateRating = async (req, res) => {
    try {
        const ratings = await Rating.find({ recipeId: req.body.recipeId });
        if (ratings.length === 0) {
            return res.status(200).json({ rating: '0' });
        }
        const total = ratings.reduce((acc, rating) => acc + rating.rating, 0);
        const avg = total / ratings.length
        const users = ratings.map(rating => rating.userId);

        res.status(200).json({users:users , rating: avg });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const calRating = async(recipeId) => {
    try {
        const ratings = await Rating.find({ recipeId: recipeId });
        if (ratings.length === 0) {
            return 0;
        }
        const total = ratings.reduce((acc, rating) => acc + rating.rating, 0);
        const avg = total / ratings.length;
        return avg;
    }
    catch (err) {
        return 0;
    }
}


const getRating = async (req, res) => {
    try {
        const rating = await Rating.findById(req.params.id);
        if (!rating) {
            return res.status(404).json({ message: 'Rating not found' });
        }
        res.status(200).json(rating);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}



module.exports = {
    calRating,
    postReview,
    getReviews,
    getReview,
    updateReview,
    deleteReview,
    getReviewsByRecipeId,
    postRating,
    getRatings,
    calculateRating,
    getRating
};