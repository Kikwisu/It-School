let express = require('express');
let router = express.Router();
const formidable = require('formidable');
const md5File = require('md5-file/promise');
const  lineReader = require('line-reader');


/* GET home page. */
router.get('/', function(req, res) {
   let name = "Войдите в аккаунт!";
   let enter = "войти";
   if(req.session.user){
      let login = req.session.user.login;
      let User = require('./userModel');
      User.findOne({login: login})
         .then(function(doc){
            name = doc.firstName + " " + doc.lastName;
            enter = "выйти";
            res.render('net', {name: name, enter: enter});
         });
   }else{
      res.render('auth', {name: name, enter: enter});
   }
});

router.post('/api', function (req, res) {
   let User = require('./userModel');

   let name = req.body.name;
   name = name.substring(0, name.indexOf(" "));

   User.findOne({firstName: name})
       .then(function (doc) {
          let netQests = doc.net
              , allBalls = doc.allBalls
              , checNet = doc.checNet;
          console.log(doc);
          if(checNet[1] < 2){
             if(req.body.ping) {
                netQests[1] = 1;
                allBalls++;
             }
             checNet[1]++;
             Update({ firstName: name }, { allBalls : allBalls, net : netQests, checNet : checNet });
          }
       });
});

function Update(query, options) {
   let User = require('./userModel');
   User.findOneAndUpdate(query, options, (err, docs) => {
      console.log( `err : ${err}`);
      console.log( `docs : ${docs}`);
   });
}

router.post('/:number', function (req, res) {
   let User = require('./userModel')
      , login = req.session.user.login
      , numb = req.params.number
      , testLine = "abcd"
      , form = new formidable.IncomingForm()
      , msg = 'Задание выполнено неверно';
   form.parse(req, function (err, fields, files) {
      if(err) return res.send('kek(((');
      switch (numb){
         case '1':
            lineReader.eachLine(files.file.path, (line, last) => {
               console.log(line);
               if(line === testLine)
                  msg = 'Вы успешно выполнили задание';
               if(last){
                  User.findOne({login: login})
                     .then(function(doc){
                        let netQests = doc.net
                           , allBalls = doc.allBalls
                           , checNet = doc.checNet;
                        if(checNet[0] < 2){
                           if(msg === 'Вы успешно выполнили задание'){
                              netQests[0] = 1;
                              allBalls++;
                           }
                           checNet[1]++;
                           Update({login: login}, { allBalls : allBalls, net : netQests, checNet : checNet });
                        } else
                            msg = 'Ваш результат за это задание: ' + netQests[0];
                        return res.end(msg);
                     });
               }
            });
            break;
         case '3':
            md5File( files.file.path ).then(hash => {
               md5File( __dirname + "/data/original.txt" ).then(original =>{
                  console.log(`The MD5 sum of LICENSE.md is: ${hash} ${original}`);
                  User.findOne({ login: login })
                     .then(function(doc){
                        let netQests = doc.net
                           , allBalls = doc.allBalls
                           , checNet = doc.checNet;

                        if( checNet[2] < 2 ){
                           if( hash === original ){
                              netQests[2] = 1;
                              allBalls++;
                              msg = 'Вы успешно выполнили задание';
                           }
                           checNet[1]++;
                           Update({login: login}, { allBalls : allBalls, net : netQests, checNet : checNet });
                        }
                        else
                           msg = 'Ваш результат за это задание: ' + netQests[2];
                        return res.send(msg);
                     });
               });
            });
            break;
         case '4':
            md5File( files.file.path ).then(hash => {
               md5File( __dirname + "/data/check.txt" ).then(check =>{
                  console.log(`The MD5 sum of LICENSE.md is: ${hash} ${check}`);
                  User.findOne({ login: login })
                     .then(function(doc){
                        let netQests = doc.net
                           , allBalls = doc.allBalls
                           , checNet = doc.checNet;

                        if( checNet[2] < 2 ){
                           if( hash === check ){
                              netQests[2] = 1;
                              allBalls++;
                              msg = 'Вы успешно выполнили задание';
                           }
                           checNet[1]++;
                           Update({login: login}, { allBalls : allBalls, net : netQests, checNet : checNet });
                        }
                        else
                           msg = 'Ваш результат за это задание: ' + netQests[2];
                        return res.send(msg);
                     });
               });
            });
            break;
      }
   });
});

module.exports = router;