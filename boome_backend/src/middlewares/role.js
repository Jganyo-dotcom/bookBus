const Checkrole = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Unauthorised acccess" });
  }
  next();
};

const checkrole = (req, res, next) => {
  if (req.user.role !== "Staff") {
    return res.status(403).json({ message: "Unauthorised acccess" });
  }
  next();
};

const CheckroleonAll = (req, res, next) => {
  if (req.user.role !== "Staff" &&  req.user.role !== "Admin") {
    return res.status(403).json({ message: "Unauthorised acccess" });
  }
  next();
};

module.exports = { Checkrole, checkrole, CheckroleonAll };
