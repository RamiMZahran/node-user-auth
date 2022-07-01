const userService = require('../services/user.service');

exports.register = async (req, res) => {
  const check = await userService.checkExistingEmail(req.body.email);
  if (check) {
    return res.status(400).send({
      auth: false,
      error: 'email exists',
    });
  }
  try {
    const result = await userService.register(
      req.body.email,
      req.body.password
    );
    res.status(201).send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.login = async (req, res) => {
  try {
    const user = await userService.getByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await userService.generateToken(user);
    res.send({
      isAuth: true,
      user,
      auth: token,
    });
  } catch (err) {
    return res.status(404).send({ error: err });
  }
};

exports.get = (req, res) => {
  res.send({
    isAuth: true,
    user: req.user,
  });
};

exports.logout = async (req, res) => {
  try {
    await userService.logout(req.user);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

exports.getAll = async (req, res) => {
  const users = await userService.getAll();
  return res.send({ users });
};

exports.toggleAdmin = async (req, res) => {
  const check = await userService.checkExistingId(req.params.userId);
  if (!check) {
    return res.status(404).send({
      error: 'User not found!',
    });
  }
  await userService
    .toggleIsAdmin(req.params.userId)
    .catch((err) => res.status(500).send({ err: err.msg }));
  res.sendStatus(200);
};
