window.onload = () => {

   /**
    *    Redirects of header`s buttons
    **/

   $( "#logo" ).click( () => {
      location.href = "/";
   });

   $( "#enter" ).click( () => {
      if ( document.getElementById( "enter" ).firstChild.innerHTML === "выйти" ){

         $.ajax({

            type : "POST",
            url : "/users",
            data : "exit=true",
            success : msg => {
               alert( msg );
            }

         });

      }

      location.href = "/users";

   });

   $( ".section" ).click( e =>  {

      location.href = "/" + e.target.id;

   });

   $( ".name" ).click( () => {
      location.href = "/stats" ;
   });

   /**
    *    Submitting of all forms
    **/

   $('#auth').submit(function ( e ) {
      e.preventDefault();

      if ($( this ).data( 'formstatus' ) !== ' submitting ' ){

         /**
          *    Forms`s metods
          **/

         let form = $( this ),
            formUrl = form.attr( 'action' ),
            formMethod = form.attr( 'method' );

         let formData2 = form.serialize();

            $.ajax({

               url : formUrl,
               type : formMethod,
               data : formData2,
               success : formSuccessAuth

            });
      }

      return false;
   });

   $('.sendFile').submit(function ( e ) {
      e.preventDefault();

      if ($( this ).data( 'formstatus' ) !== ' submitting ' ){

         /**
          *    Forms`s metods
          **/

         let form = $( this ),
            formUrl = form.attr( 'action' ),
            formMethod = form.attr( 'method' );

         let formData2 = form.serialize();

         $.ajax({

            url : formUrl,
            type : formMethod,
            data : formData2,
            success : formSuccessAuth

         });
      }

      return false;
   });

   $( `.sendFile` ).submit( function ( e ) {

      e.preventDefault();

      if ($( this ).data( 'formstatus' ) !== ' submitting ' ){

         /**
          *    Forms`s metods
          **/

         let form = $( this ),
            formUrl = form.attr( 'action' ),
            formMethod = form.attr( 'method' );

         let formData = new FormData( document.getElementById ( e.target.id ) );

            $.ajax({

               url : formUrl,
               type : formMethod,
               data : formData,
               contentType : false,
               processData : false,
               success : formSuccess

            });

      }

      return false;

   });

   $('.sendMulty').submit(function (e) {
      e.preventDefault();

      if ($( this ).data( 'formstatus' ) !== ' submitting ' ){

         let form = $( this ),
            formUrl = form.attr( 'action' ),
            formMethod = form.attr( 'method' );

         let formData2 = form.serialize();
         let user = document.getElementsByClassName( 'name' )[0].innerHTML;
         console.log(formData2 + "&name=" + user);

         $.ajax({

            url : formUrl,
            type : formMethod,
            data : formData2 + "&name=" + user,
            success : formSuccessAuth

         });
      }

      return false;
   });

   function formSuccessAuth( data ) {

       if ( data === "Вы успешно вошли в свой аккаунт" )
          location.href = "/";

      alert( data );

   }

   function formSuccess( data ) {
      alert( data );
   }

   /**
    *   Checking indicators of sensors in net-tasks
    **/

   $( '#quest2' ).click( () => {

      let user = document.getElementsByClassName( 'name' )[0].innerHTML;
      let dataObject = { "name" : user };

      $.ajax({

         url : 'http://localhost:3000/ping',
         type : 'POST',
         dataType : "json",
         data : dataObject,
         success : ( data ) => {

               alert(data.result);

         }

      });
   });

   $( '#physicCheck' ).click( () => {

      let user = document.getElementsByClassName( 'name' )[0].innerHTML;
      let dataObject = { "name" : user };

      $.ajax({

         url : 'http://localhost:3000/physic',
         type : 'POST',
         dataType : "json",
         data : dataObject,
         success : data => {
            alert( data.result );
         }

      });
   });

   $('.robotoCheck').click(function (e) {
      let id = e.target.id;
      let user = document.getElementsByClassName( 'name' )[0].innerHTML;
      let dataObject = { "name" : user };

      $.ajax({

         url : 'http://localhost:3000/roboto/' + id,
         type : 'POST',
         dataType : "json",
         data : dataObject,
         success : data => {
            alert( data.result );
         }

      });

   })



};