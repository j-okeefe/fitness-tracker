const Workout = require("../models/workout");
const router = require("express").Router();


router.post("/api/workouts", async ({ body }, res) => {
  try {
    const newWorkout = await Workout.create({ body });
    
    res.status(200).json(newWorkout);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/api/workouts/:id", async (req, res) => {
  try {
    const changeWorkout = await Workout.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { exercises: req.body } },
      { new: true }
    );
  
    res.json(changeWorkout);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/api/workouts", async (req, res) => {
  try {
    const allExercises = await Workout.aggregate([
      { $addFields: { totalDuration: { $sum: "$exercises.duration" } } },
    ]);

    res.status(200).json(allExercises);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/api/workouts/range", async (req, res) => {
  try {
    const recentWorkouts = await Workout.aggregate([
      { $addFields: { totalDuration: { $sum: "$exercises.duration" } } },
      { $sort: { day: -1 } },
      { $limit: 7 },      
    ]);

    res.status(200).json(recentWorkouts);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;