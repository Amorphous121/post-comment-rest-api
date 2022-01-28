const { User } = require('../models');

exports.createUser = async (req, res) => {

  const { email } = req.body;
  const user = await User.findOne({ where: { email, isDeleted: false } });
  if (user) {
    return res.status(400).json({ message: 'User already exists' });
  }

  console.log("inside controller of user")

  const newUser = await User.create(req.body);
  return res.status(201).json(newUser);
};

