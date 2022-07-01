exports.checkIsAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(401).send({
      error: "You don't have permission. Ask an admin to upgrade your role.",
    });
  }
  next();
};
