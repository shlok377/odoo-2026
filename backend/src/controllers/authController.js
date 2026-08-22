import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { queryOne, executeRun } from '../db/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'itinera_secret_hackathon_key_2026';

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide full name, email, and password.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check if user already exists
    const existingUser = await queryOne('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Default avatar based on initials
    const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=591d26&textColor=f5efe9`;

    // Insert user into SQLite DB
    const result = await executeRun(
      'INSERT INTO users (name, email, password_hash, avatar_url) VALUES (?, ?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), passwordHash, defaultAvatar]
    );

    const user = {
      id: result.lastID,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      avatar_url: defaultAvatar
    };

    // Generate Token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'Account created successfully!',
      token,
      user
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ error: 'Internal Server Error during registration.' });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter your email and password.' });
    }

    // Find user in SQL DB
    const user = await queryOne('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
      language_preference: user.language_preference
    };

    // Generate Token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      message: 'Welcome back to Itinera!',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ error: 'Internal Server Error during login.' });
  }
};

// Get Current User Profile
export const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Token missing.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await queryOne(
      'SELECT id, name, email, avatar_url, language_preference, created_at FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};
