const bcrypt = require('bcrypt')
const User = require('../models/User')

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Add your password validation criteria here
    // For example, requiring at least 8 characters, including uppercase, lowercase, and a number
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };
  
exports.register = async (req, res) => {
    const { username, password } = req.body;
    if (!validateEmail(username)) {
        return res.status(400).json({ error: 'Invalid email format.' });
      }
    if (!validatePassword(password)) {
    return res.status(400).json({ error: 'Invalid password format. Must require at least 8 characters, including uppercase, lowercase, and a number.' });
    }
    try {
        const hashedPass = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPass });
        res.status(201).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401), json({ error: 'Invalid credentials' });
        }

        req.session.userId = user._id;
        res.status(200).json({ user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    };

}
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({message: 'Logged out successfully'});
    });
}