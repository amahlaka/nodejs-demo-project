var Celebrate = require('celebrate');
var { Joi, joi } = Celebrate;
module.exports = {
  body: {
    email: Joi.string().email().allow().required(),
    password: Joi.string().min(7).max(150).required().allow()
  }
};