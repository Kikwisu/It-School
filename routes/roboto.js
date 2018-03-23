const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
   let name = "Войдите в аккаунт!";
   let enter = "войти";
   if(req.session.user){
      let login = req.session.user.login;
      let User = require('./userModel');
      User.findOne({login: login})
         .then(function(doc){
            name = doc.firstName + " " + doc.lastName;
            let points = " Всего баллов: " + doc.allBalls;
            enter = "выйти";
            res.render('roboto', {name: name, points : points, enter: enter});
         });
   }else{
      res.render('auth', {name: name, enter: enter});
   }
});

module.exports = router;