import jwt from 'jsonwebtoken';
import User from '../models/User.js'

const generatToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '5d'
    },
    );
};

export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({
                success: false,
                error:
                    userExists.email === email
                        ? "Email already register"
                        : "Username already taken",
                statusCode: 400,

            });
        }
        const user = await User.create({ username, email, password });
        const token = generatToken(user._id)
        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    profileImage: user.profileImage,
                    createdAt: user.createdAt,

                }, token,
            }
        });
    } catch (error) {
        next(error)

    }

}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Provide email and password",
            });
        }

        // Find user & include password
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Compare password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Generate token
        const token = generatToken(user._id);

        // Success
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
            },
            token,
        });

    } catch (error) {
        next(error);
    }
};

export const getprofile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        next(error);
    }
};


export const updateprofile = async (req, res, next) => {
    try {
        const { username, email, profileImage } = req.body;


        const user = req.user;

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (profileImage) user.profileImage = profileImage;

        await user.save();

        res.status(200).json({
            success: true,
            message: "User profile updated",
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });

    } catch (error) {
        next(error);
    }
};

export const changepassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 1. Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Provide current and new password",
      });
    }

    // 2. Get user with password
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3. Check current password
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // 4. Update password
    user.password = newPassword;
    await user.save();

    // 5. Response
    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.log(error)
    next(error);
  }
};
