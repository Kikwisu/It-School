
   const express = require('express');
   const router = express.Router();

/**
 *    GET page
 **/

router.get( '/' , ( req , res ) => {

   let name = "Войдите в аккаунт!";
   let enter = "войти";

   if ( req.session.user ) {

      let login = req.session.user.login;
      let User = require( './userModel' );

      User.findOne( { login : login } )
         .then( doc => {

            name = doc.firstName + " " + doc.lastName;
            let points = " Всего баллов: " + doc.allBalls;
            enter = "выйти";
            res.render('multy', {name : name , points : points , enter: enter});

         });

   } else {

      res.render( 'auth' , { name : name , enter : enter } );

   }

});



router.post('/', function (req, res) {

      res.send('kek');
});

module.exports = router;