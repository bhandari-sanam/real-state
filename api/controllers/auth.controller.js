import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
  const { username, email, password, userType } = req.body;

  try {
    // Validate userType
    const allowedUserTypes = ["Agent", "Buyer"];
    if (userType && !allowedUserTypes.includes(userType)) {
      return res.status(400).json({ message: "Invalid user type" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user and save to DB
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        userType: userType || "Buyer", // Default to Buyer if not provided
      },
    });

    res.status(201).json({
      message: "User created successfully",
      userType: newUser.userType,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user!" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return res.status(400).json({ message: "Invalid Credentials!" });

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid Credentials!" });

    // Generate JWT token
    const age = 1000 * 60 * 60 * 24 * 7;
    const token = jwt.sign(
      {
        id: user.id,
        userType: user.userType, // Include userType in token
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    // Exclude password before sending response
    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
      })
      .status(200)
      .json({ ...userInfo, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to login!" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};
