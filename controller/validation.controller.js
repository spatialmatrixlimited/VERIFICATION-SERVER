let request = require("request");
let path = require('path')
let userRecord = require('./user.record.controller')
loki = require('lokijs')

//eMail Notification
let jet = require('./mailjet.controller')
let mailer = require('./mailer.controller')
let alertTemplate = require('../lib/templates/alert.template')
let reAlertTemplate = require('../lib/templates/re.alert.template')

let emails;
const emailStorage = path.resolve(__dirname, '../../db/verified.email.db.json')

let databaseInitialize = {
    EMAIL: () => {
        emails = EMAILS.getCollection("verifiedemails")
        if (emails === null) {
            emails = EMAILS.addCollection('verifiedemails', {
                indices: ['id']
            })
        }
    }
}


let EMAILS = new loki(emailStorage, {
    autoload: true,
    autoloadCallback: databaseInitialize.EMAIL,
    autosave: true,
    autosaveInterval: 5000
})


let validate = {
    validateUser: (req, reply) => {

        let email = req.params.email
        let type = req.params.type
        let _email = []
        if (!email) {
            reply
                .code(404)
                .header('Content-Type', 'text/html')
                .send()
        }
        _email = emails.find({
            'email': email
        })

        if (_email.length === 0) {

            if (type == 'individual')
                userRecord.patchUserSecurity(email).then((response) => {
                    if (response) {
                        //send alert email
                        //jet.mailJet(email, 'Notification From SPiDER by Mobisoft', alertTemplate.alertTemplate())
                        mailer(email, 'Notification From SPiDER by Mobisoft', alertTemplate.alertTemplate())
                        emails.insert({
                            'email': email,
                            'user': type
                        })
                        reply
                            .code(200)
                            .header('Content-Type', 'text/html')
                            .send(alertTemplate.alertTemplate())
                    } else {
                        reply
                            .code(404)
                            .header('Content-Type', 'text/html')
                            .send()
                    }
                })

            if (type == 'organisation')
                userRecord.patchOrganisationSecurity(email).then((response) => {
                    if (response) {
                        //send alert email
                        //jet.mailJet(email, 'Notification From SPiDER by Mobisoft', alertTemplate.alertTemplate())
                        mailer(email, 'Notification From SPiDER by Mobisoft', alertTemplate.alertTemplate())
                        emails.insert({
                            'email': email,
                            'user': type
                        })
                        reply
                            .code(200)
                            .header('Content-Type', 'text/html')
                            .send(alertTemplate.alertTemplate())
                    } else {
                        reply
                            .code(404)
                            .header('Content-Type', 'text/html')
                            .send()
                    }
                })


        } else {

            reply
                .code(200)
                .header('Content-Type', 'text/html')
                .send(reAlertTemplate.reAlertTemplate())

        }

    },

    getValidateUser: (req, reply) => {
        let _emails = emails.find({})

        reply
            .code(200)
            .send({
                result: _emails
            })
    },

    test: (req, reply) => {
        mailer('kolagrey@asheori.com', 'Notification From Asheori Mail Exchange Network', alertTemplate.alertTemplate())

        reply
            .code(200)
            .send({
                result: 'Email Sent Successfully'
            })
    }
}

module.exports = validate;