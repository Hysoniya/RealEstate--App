const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Staff = require('../models/Staff');
const User = require('../models/User');

// Signup controller
exports.signup = async (req, res) => {
  try {
    const { email, password, role, ...otherFields } = req.body;
        console.log('Signup request body:', req.body); // Log incoming data


    // Validate required fields
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    // Determine user type and model
    let Model;
    let userData = { email, password: await bcrypt.hash(password, 10), ...otherFields };
    let userType;

    switch (role.toLowerCase()) {
      case 'admin':
        Model = Admin;
        userType = 'admin';
        userData.adminId = otherFields.adminId || `ADMIN${Date.now()}`;
        userData.fullName = otherFields.name || '';
        break;
      case 'staff':
        Model = Staff;
        userType = 'staff';
        userData.staffId = otherFields.staffId || `STAFF${Date.now()}`;
        userData.fullName = otherFields.name || '';
        break;
      case 'user':
        Model = User;
        userType = 'user';
        userData.firstName = otherFields.name || '';
        // userData.role = role.toLowerCase(); // Ensure role is set for user
        break;
      default:
        return res.status(400).json({ error: 'Invalid role specified' });
    }

    // Check if user already exists
    const existingUser = await Model.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create new user
    console.log('Creating new user with data:', userData); // Log user data before saving
    const newUser = new Model(userData);
    await newUser.save();


    console.log('New JWT secret:', process.env.JWT_SECRET); // Log the created user

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id, newUser },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );


    //     const token = "";
    
    // if (userType === 'admin') {
    //   token = jwt.sign({ adminId: newUser.adminId }, SECRET);
    // } else if (userType === 'staff') {
    //   token = jwt.sign({ staffId: newUser.staffId }, SECRET);
    // } else if(userType === 'user') {
    //   token = jwt.sign({ id: newUser._id, userType }, SECRET);
    // } else {
    //   return res.status(500).json({ error: 'Failed to generate token' });
    // }


    // Prepare response data
    const responseData = {
      id: newUser._id,
      email: newUser.email,
      userType,
      token,
      ...(userType === 'admin' && { adminId: newUser.adminId }),
      ...(userType === 'staff' && { staffId: newUser.staffId, fullName: newUser.fullName, role: newUser.role }),
      ...(userType === 'user' && { firstName: newUser.firstName, lastName: newUser.lastName || '' })
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
};

// Login controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check across all models
    let user = await Admin.findOne({ email }) || await Staff.findOne({ email }) || await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Determine user type
    let userType;
    let additionalData = {};
    
    if (user instanceof Admin) {
      userType = 'admin';
      additionalData = { adminId: user.adminId };
    } else if (user instanceof Staff) {
      userType = 'staff';
      additionalData = { staffId: user.staffId, fullName: user.fullName, role: user.role };
    } else {
      userType = 'user';
      additionalData = { firstName: user.firstName, lastName: user.lastName || '' };
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, userType },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    // Prepare response data
    const responseData = {
      id: user._id,
      email: user.email,
      userType,
      token,
      ...additionalData
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};