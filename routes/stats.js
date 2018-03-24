const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {

   let name = "Войдите в аккаунт!";
   let enter = "войти";
   if( req.session.user ) {

      let login = req.session.user.login;
      let User = require( './userModel' );

      User.findOne( { login : login } )
         .then( doc => {

            let points = " Всего баллов: " + doc.allBalls;
            name = doc.firstName + " " + doc.lastName;
            enter = "выйти";

            User.find().then( docs => {

               function compareBall( personA, personB ) {

                  return personB.allBalls - personA.allBalls;

               }

               let users = docs.sort( compareBall );

               res.render( 'stats' , { name : name, points : points, enter : enter, users : users });
            });

         });

   } else {

      res.render( 'auth', { name : name , enter : enter } );

   }

});

module.exports = router;