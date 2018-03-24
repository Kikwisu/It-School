
   let express = require( 'express' );
   let router = express.Router();
   const formidable = require( 'formidable' );
   const md5File = require( 'md5-file/promise' );
   const  lineReader = require( 'line-reader' );

/**
 *    GET net page
 **/

router.get( '/' , ( req , res ) => {

   let name = "Войдите в аккаунт!";
   let enter = "войти";

   if ( req.session.user ) {

      let login = req.session.user.login;
      let User = require('./userModel');

      User.findOne( { login : login } )
         .then( doc => {

            name = doc.firstName + " " + doc.lastName;
            let points = " Всего баллов: " + doc.allBalls;
            enter = "выйти";
            res.render('net', { name: name , points : points , enter: enter } );

         });

   } else {

      res.render( 'auth' , { name : name , enter : enter } );

   }

});

   /**
    *    Get params from local server
    *       and check PING
    **/

router.post('/api', ( req, res ) => {

   let User = require('./userModel');
   let msg = 'Вы уже выполнили задание! Ваш результат: ';

   /**
    *    Getting and parsing username
    *       to first and second name
    **/

   let name = req.body.name;
   let firstname = name.substring( 0, name.indexOf(" ") );
   let lastname = name.substring( name.indexOf(" ") );



   User.findOne( { firstName : firstname, lastName : lastname.trim() } )
       .then( ( doc ) => {

          /**
           *    Checking params
           **/

          let netQests = doc.net
              , allBalls = doc.allBalls
              , checNet = doc.checNet;



          if ( checNet[1] < 2 ){

             msg = "Задание выполнено неверно!";

             if ( req.body.ping ) {

                netQests[1] = 1;
                allBalls++;
                checNet[1]++;
                msg = "Задание выполнено верно! Вы получаете 1 балл";

             }

             checNet[1]++;

             /**
              *    Function updating user object
              **/

             Update( { firstName : firstname , lastName : lastname.trim() } , { allBalls : allBalls , net : netQests , checNet : checNet } );

          } else {

             msg += netQests[1] + "б.";

          }

          res.send( msg );

       });

});

function Update( query, options ) {

   let User = require('./userModel');

   /**
    *    Updating user object
    **/

   User.findOneAndUpdate( query, options, ( err, docs ) => {

      console.log( `err : ${err}` );
      console.log( `docs : ${docs}` );

   });

}

router.post( '/:number', ( req, res ) => {

   /**
    *    Getting params user`s object and numbers of quest
    *       which save our souls!
    **/

   let User = require('./userModel')
      , login = req.session.user.login
      , numb = req.params.number
      , testLine = "abcd"
      , form = new formidable.IncomingForm()
      , msg = 'Задание выполнено неверно';

   /**
    *    Parsing form with documents
    **/

   form.parse(req, function (err, fields, files) {

      if ( err ) return res.send( 'kek(((' );
      switch ( numb ) {

         case '1':

            lineReader.eachLine(files.file.path, ( line, last ) => {

               if( line === testLine )
                  msg = 'Вы успешно выполнили задание';

               if( last ){

                  User.findOne( { login : login } )
                     .then( doc => {

                        /**
                         *    Checking params
                         **/

                        let netQests = doc.net
                           , allBalls = doc.allBalls
                           , checNet = doc.checNet;

                        if ( checNet[0] < 2 ) {
                           if( msg === 'Вы успешно выполнили задание' ){

                              netQests[0] = 1;
                              allBalls++;
                              checNet[0]++;

                           }

                           checNet[1]++;

                           /**
                            *    Function updating user object
                            **/

                           Update( { login : login } , { allBalls : allBalls , net : netQests , checNet : checNet } );

                        } else {

                           msg = 'Ваш результат за это задание: ' + netQests[0];

                        }

                        return res.end( msg );

                     });

               }

            });

            break;

         case '3':

            /**
             *    Hash of the uploaded file
             **/

            md5File( files.file.path ).then( hash => {

               /**
                *    Hash of the original file
                **/

               md5File( __dirname + "/data/original.txt" ).then( original =>{

                  User.findOne( { login: login } )
                     .then( ( doc ) => {

                        /**
                         *    Checking params
                         **/

                        let netQests = doc.net
                           , allBalls = doc.allBalls
                           , checNet = doc.checNet;

                        if( checNet[2] < 4 ){

                           if( hash === original ){

                              msg = 'Вы успешно выполнили задание';
                              netQests[2] = 1;
                              checNet[2]++;
                              allBalls++;

                           }

                           checNet[2]++;

                           /**
                            *    Function updating user object
                            **/

                           Update( { login : login } , { allBalls : allBalls , net : netQests , checNet : checNet } );

                        }
                        else{

                           msg = 'Ваш результат за это задание: ' + netQests[2];

                        }

                        return res.send(msg);

                     });

               });

            });

            break;

         case '4':

            /**
             *    Hash of the uploaded file
             **/

            md5File( files.file.path ).then( hash => {

               /**
                *    Hash of the check file
                **/

               md5File( __dirname + "/data/check.txt" ).then( check =>{

                  User.findOne( { login: login } )
                     .then( doc => {

                        /**
                         *    Checking params
                         **/

                        let netQests = doc.net
                           , allBalls = doc.allBalls
                           , checNet = doc.checNet;

                        if( checNet[3] < 2 ){
                           if( hash === check ){

                              msg = 'Вы успешно выполнили задание';
                              netQests[3] = 1;
                              checNet[3]++;
                              allBalls++;

                           }

                           checNet[3]++;

                           /**
                            *    Function updating user object
                            **/

                           Update({login: login}, { allBalls : allBalls, net : netQests, checNet : checNet });

                        } else {

                           msg = 'Ваш результат за это задание: ' + netQests[3];

                        }

                        return res.send( msg );

                     });

               });

            });

            break;

      }

   });
});

module.exports = router;