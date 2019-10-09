var Celebrate = require('celebrate');
var { Joi, joi } = Celebrate;
module.exports = {
  body: {
    session: Joi.string().required().allow(),
    data: Joi.string().required().allow()
  }
};