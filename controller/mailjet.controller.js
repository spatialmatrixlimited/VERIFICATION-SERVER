var asset = require('../config/assets');
var mailjet = require ('node-mailjet')
.connect(asset.MJPKSMTP, asset.MJSKSMTP);


  var mailJet = (recepient, title, template)=>{
    var request = mailjet
        .post("send")
        .request({
            "FromEmail":"female.hire@wuntlist.com",
            "FromName":"SPiDER by Mobisoft",
            "Subject": title,
            "Text-part":"Important notification from SPiDER by Mobisoft!",
            "Html-part":template,
            "Recipients":[
                    {
                            "Email": recepient
                    },{
                            "Email": 'kolagrey@gmail.com'
                    }
            ]
        }).then((data)=>{
          //console.log(data.body.Sent);
        }).catch((e)=>{
          console.log(e);
        });
  }

  exports.mailJet = mailJet;
