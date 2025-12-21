import User from "../model/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { welcomeTemplate } from "../utils/emails/welcomeMail.js";
import { generateToken } from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { resetPasswordTemplate } from "../utils/emails/resetPasswordMail.js";

const setRefreshToken = (res, token) => {
  res.cookie("lfyrftkn", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });

    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    const html = welcomeTemplate({ name });

    await sendEmail({
      to: email,
      subject: "Welcome to Learnify🌟",
      html,
    });

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ message: "User not .Register and try again" });

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) return res.status(400).json({ message: "Invalid Credentials" });

    const { accessToken, refreshToken } = generateToken(user);
    setRefreshToken(res, refreshToken);

    const safeUser = await User.findById(user._id).select("-password");

    res.status(200).json({
      accessToken,
      message: "Login successfull",
      user: safeUser,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("lfyrftkn", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const token = req.cookies?.lfyrftkn;

    if (!token)
      return res
        .status(200)
        .json({ message: "No Refresh Token", accessToken: null });

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err)
        return res
          .status(200)
          .json({ accessToken: null, message: "Invalid or Expired Token" });
      const accessToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES,
        }
      );
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      res.status(200).json({ accessToken, user });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const requestReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    const name = user.name;

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const html = resetPasswordTemplate({ name, resetUrl });
    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      html,
    });

    res
      .status(204)
      .json({ success: true, message: "Mail with reset link has been sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetExpiry: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetExpiry = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
