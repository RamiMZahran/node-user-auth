const { User } = require('../models/User');

let auth = (req, res, next) => {
  let token = req.header('auth');
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user)
      return res.status(401).send({
        error: true,
        errorMsg: "You're not logged in",
      });

    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
