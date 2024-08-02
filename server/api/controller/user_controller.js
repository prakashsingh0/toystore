const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const userModel = mongoose.model('userModel');



const profileUpdate = async (req, res) => {
    try {
        const { fullName, email, phone } = req.body
        // console.log(req.body);
        const user = await userModel.findById(req.user._id)
        // console.log(user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.fullName = fullName;
        user.phone = phone;
        
        user.email = email;

        // Save the updated user
        await user.save();

        // Send response with updated user profile
        res.status(200).json({ message: "User profile updated successfully", user });
    } catch (error) {
        console.log(error);
    }
}

const Register = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;
        
        // Check if all fields are provided
        if (!firstName || !lastName || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email address" });
        }
        
        // Phone number validation (basic example for US phone numbers)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: "Invalid phone number" });
        }

        // Check if email or phone number already exists in the database
        const emailInDb = await userModel.findOne({ email: email });
        const phoneInDb = await userModel.findOne({ phone: phone });
        if (emailInDb) {
            return res.status(401).json({ message: "This email is already in use" });
        } else if (phoneInDb) {
            return res.status(400).json({ message: "This phone number is already in use" });
        }

        // Generate full name and username
        const fullName = firstName + ' ' + lastName;
        const capitalizeWords = (fullName) => {
            return fullName
                .toLowerCase()
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        };
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const userName = '@' + (trimmedFirstName === trimmedLastName ? trimmedFirstName.replace(/\s/g, '') : (trimmedLastName + trimmedFirstName).replace(/\s/g, '')) + Math.floor(Math.random() * 10000); // Generate username

        // Hash the password
        const hashPassword = await bcryptjs.hash(password, 16);

        // Create and save the new user
        const user = new userModel({ fullName: capitalizeWords(fullName), userName: userName, password: hashPassword, email: email, phone: phone });
        await user.save();

        // Respond with success message
        res.status(201).json({ message: "Account created successfully", success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


const Login = async (req, res) => {
    try {
        const { userdata, password } = req.body;
        if (!userdata || !password) {
            return res.status(400).json({ message: "Please provide email/phone/username and password" });
        }
        const userInDb = await userModel.findOne({ $or: [{ email: userdata }, { phone: userdata }, { userName: userdata }] });
        if (!userInDb) {
            return res.status(404).json({ message: "User not found" });
        }
        const match = await bcryptjs.compare(password, userInDb.password);
        if (!match) {
            return res.status(401).json({ message: "Incorrect password" });
        }
        const jwtToken = jwt.sign({ _id: userInDb._id }, process.env.JWT_KEY, { expiresIn: "1h" });
        const user = await userModel.find(userInDb._id).select("-password")
        // console.log(user)
        res.cookie('token', jwtToken, { expiresIn: "1h", httpOnly: true });
        res.status(200).json({ token: jwtToken, user: user, message: `welcome back ${userInDb.fullName}`, success: true });
        // console.log("user logged in");
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};





const getMyProfile = async (req, res) => {
    try {
        const id = req.user._id;
        const user = await userModel.findById(id).select("-password")
        return res.status(200).json({ user })
    } catch (error) {
        console.log(error);
    }
}

module.exports = { Register, Login,getMyProfile, profileUpdate };