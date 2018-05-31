//Database Model
let User = require('../model/user.model')

let userRecord = {

  //update user - access
  patchUserSecurity: (email) => {
    return new Promise(resolve => {
      User.findOneAndUpdate({
          'personal.email': email
        }, {
          'security.is_active': true
        }, {
          new: true
        })
        .exec((err, data) => {
          if (err) {
            resolve(false)
          } else {
            resolve(true)
          }
        })

    })
  },

  //update user - access
  patchOrganisationSecurity: (email) => {
    return new Promise(resolve => {
      User.findOneAndUpdate({
          'organisation.email': email
        }, {
          'security.is_active': true
        }, {
          new: true
        })
        .exec((err, data) => {
          if (err) {
            resolve(false)
          } else {
            resolve(true)
          }
        })
    })
  }
  
}

module.exports = userRecord