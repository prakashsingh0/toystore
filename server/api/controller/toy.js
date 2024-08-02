const express = require('express');
const mongoose = require('mongoose');


const userModel = mongoose.model('userModel')
const toyModel = mongoose.model('toyModel')
const addtoy = async (req, res) => {
  try {
    const { title, toy } = req.body;
    // console.log(title, toy);
    if (!title || !toy) {
      res.status(400).json({ message: "All field are required!" });
      return;
    }
    const newtoy = new toyModel({ title: title, toy: toy, userId: req.user._id });
    await newtoy.save();
    res.status(200).json({ message: "toy added successfully" })
  } catch (error) {
    res.status(500).json({ message: 'something went wrong please try again' })
  }
}

const updatetoy = async (req, res) => {
  try {

    // console.log(req.params.toyid);
    const { title, toy } = req.body;

    if (!title && !toy) {
      res.status(400).json({ message: "All fields are required!" });
      return;
    }

    const existingtoy = await toyModel.findById(req.params.toyid);

    if (!existingtoy) {
      res.status(404).json({ message: "toy not found!" });
      return;
    }
    if (existingtoy.status === "complete") {
      res.status(302).json({ message: "This toy is completed, You conn't modify it" })
      return;
    }

    if (existingtoy.userId.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: "You are not authorized to update this toy!" });
      return;
    }

    existingtoy.title = title || existingtoy.title;
    existingtoy.toy = toy || existingtoy.toy;

    await existingtoy.save();
    res.status(200).json({ message: 'toy updated successfully', toy: existingtoy });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
};
const toyFindByName = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      res.status(400).json({ message: "Toy name is required!" });
      return;
    }

    const toy = await toyModel.findOne({ title: name, userId: req.user._id });

    if (!toy) {
      res.status(404).json({ message: "Toy not found!" });
      return;
    }

    res.status(200).json({ toy });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
};




const deletetoy = async (req, res) => {
  try {
    const { id: toyId } = req.params; // Destructure toyId from req.params
    // console.log("toy ID:", toyId); // Log toyId for debugging

    const existingtoy = await toyModel.findById(toyId);
    // console.log("Existing toy:", existingtoy); // Log the existing toy for debugging

    if (!existingtoy) {
      res.status(404).json({ message: "toy not found!" });
      return;
    }
   

    if (existingtoy.userId.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: "You are not authorized to delete this toy!" });
      return;
    }

    await toyModel.deleteOne({ _id: toyId }); // Use deleteOne to delete the toy
    res.status(200).json({ message: 'toy deleted successfully' });
  } catch (error) {
    console.error(error); // Optional: Log the error for debugging
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
};

const gettoy = async (req, res) => {
  try {

    const usertoys = await toyModel.find({ userId: req.user._id });

    if (!usertoys.length) {
      res.status(404).json({ message: "No toys found for this user!" });
      return;
    }

    res.status(200).json({ toys: usertoys });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
};


module.exports = { addtoy, updatetoy, deletetoy, gettoy, toyFindByName };
