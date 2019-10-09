var Celebrate = require('celebrate');
var { Joi, joi } = Celebrate;
module.exports = {
  body: {
    email: Joi.string().email().required().allow(),
    password: Joi.string().min(7).max(150).required().allow()
  }
};