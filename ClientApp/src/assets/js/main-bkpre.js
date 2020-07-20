$(document).ready(function() {

    // VARIABLES
    // Valor del inmueble traído desde la DB - valor fijo como ejemplo
    var valor_inmueble = 450000000;
    // Cuota inicial correspondiente al 30% del valor del inmueble
    var cuota_inicial = valor_inmueble * 0.3;
    // Separación definida por constructora-inmobiliaria - 7% del valor_inmueble como ejemplo
    var separacion = Math.round(valor_inmueble * 0.07);
    // Valor por financiar, valor_inmueble - valor
    var valor_faltante;

    var valor_faltantecuotainicial;



    $("#valor_inmueblejq").text(valor_inmueble);
    $("#treinta_porcentajejq").text(cuota_inicial);
    $("#separacion_valor").text(separacion);


    //VALORES SIDEBAR - RESUMEN PLAN DE PAGOS
    $("#table-separacion").text(separacion);
    // $("#table-numcuotas").text(separacion);
    // $("#table-valcuota").text(separacion);


    // Icon changes for "info-btn"
    // $('.showinfo_link').click(function() {
    //     $("i", this).toggleClass("fa-chevron-down fa-chevron-up");
    // });

    //
    // var rangeSlider = function(){
    //   var slider = $('.range-slider'),
    //       range = $('.range-slider__range'),
    //       value = $('.range-slider__value');
    //
    //   slider.each(function(){
    //
    //     value.each(function(){
    //       var value = $(this).prev().attr('value');
    //       $(this).html(value);
    //     });
    //
    //     range.on('input', function(){
    //       $(this).next(value).html(this.value);
    //     });
    //   });
    // };
    //
    // rangeSlider();

    // $('.cuotainicial-valor').simpleMoneyFormat();




    //Mostrar bloque Proyecto al seleccionar alguno
    $("#proyecto_select").change(function() {
      if ($(this).val() != "") {
        $('#form_proyecto').slideDown();
      } else {
        $('#form_proyecto').slideUp();
      }
    });

    //Mostrar bloque Inmuebles al seleccionar Etapa
    $("#etapa_select").change(function() {
      if ($(this).val() != "") {
        $("#info-proyecto-block").collapse('show');
        $("#info-resumen-block").collapse('show');
        $('#listado_inmuebles').slideDown();
      } else {
        $("#info-proyecto-block").collapse('hide');
        $("#info-resumen-block").collapse('show');
        $('#listado_inmuebles').slideUp();
      }
    });

    //Mostrar wrapper Subsidio al seleccionar VIS
    $("#tipopproyecto_select").change(function() {
      if ($(this).val() == "vis") {
        $('.subsidio-row').addClass('show');
      } else {
        $('.subsidio-row').removeClass('show');
      }
    });

    //Mostrar bloque Subsidio al seleccionar opción SI
    $("#subsidio_select").change(function() {
      if ($(this).val() == "SI") {
        $('#subsidio-block').slideDown();
        $('#subsidio-tipo').show();
      } else {
        $('#subsidio-block').slideUp();
        $('#subsidio-tipo').hide();
      }
    });

    // $("#subsidio_switch").click(function(){
    //   $('#subsidio-block').toggle();
    //   $('#subsidio-tipo').toggle();
    // });

    //Mostrar bloque Prima al seleccionar opción SI
    $("#prima_select").change(function() {
      if ($(this).val() == "SI") {
        $('#prima-block').slideDown();
      } else {
        $('#prima-block').slideUp();
      }
    });

    //Mostrar bloque Cesantías al seleccionar opción SI
    $("#cesantia_select").change(function() {
      if ($(this).val() == "SI") {
        $('#cesantia-block').slideDown();
      } else {
        $('#cesantia-block').slideUp();
      }
    });

    //Mostrar bloque Pagos Adicionales al seleccionar opción SI
    $("#adicionales_select").change(function() {
      if ($(this).val() == "SI") {
        $('#adicionales-block').slideDown();
      } else {
        $('#adicionales-block').slideUp();
      }
    });


    $('.add_planpagos').on('click', function(e) {
      $('#plan-pagos').toggle();
    });





    // Envío formulario step-3
    // $("#btn_enviar-step-3").click(function(event){
    // 	var form_data=$("#form_step-3").serializeArray();
    // 	var error_free=true;
    // 	for (var input in form_data){
    // 		var element=$("#contact_"+form_data[input]['name']);
    // 		var valid=element.hasClass("valid");
    // 		var error_element=$("span", element.parent());
    // 		if (!valid){error_element.removeClass("error").addClass("error_show"); error_free=false;}
    // 		else{error_element.removeClass("error_show").addClass("error");}
    // 	}
    // 	if (!error_free){
    // 		event.preventDefault();
    // 	}
    // 	else{
    // 		alert('No errors: Form will be submitted');
    // 	}
    // });


    // Selector de inmuebles (inmueble-block)
    var inmueblesBlock = document.getElementsByClassName('inmueble-block')
    for (var i = 0; i < inmueblesBlock.length; i++) {
      inmueblesBlock[i].addEventListener("click", function(){

      var selectedBlock = document.querySelector(".selected");
      if(selectedBlock){
        selectedBlock.classList.remove("selected");
      }
      this.classList.add("selected");

      }, false);;
    }


    $("#parqueadero_switch").change(function() {
      if(this.checked) {
        console.log("Parqueadero - SI");
      }
    });
    $("#cuartoutil_switch").change(function() {
      if(this.checked) {
        console.log("Cuarto útil - SI");
      }
    });


    // RANGE SLIDER 1 - VALOR
    var $rangeslider = $('#slider-range');
    var $amount = $('#slider-cuota');
    var $multiplicado = $('#multiplicado_pordos');
    var $valor_financiar = $('#valor_financiar');
    var $valor_cuotamensual = $('#valor_cuotamensual');

    var $valor_cuotamensual_table = $('#table-valcuota');
    var $num_cuotas_table = $('#table-numcuotas');
    var $valor_financiar_table = $('#table-financiar');
    var $plazo_table = $('#table-plazo');
    var $interes_table = $('#table-interes');


    $rangeslider
      .rangeslider({
        polyfill: false,
        rangeClass: 'rangeslider rangeslider--cuota'
      })
      .on('input', function() {
        $amount[0].value = this.value;
        $multiplicado.text(this.value * 2);
        valor_faltante = valor_inmueble - this.value;

        valor_faltantecuotainicial = cuota_inicial - this.value;

        $valor_cuotamensual.text(Math.round((cuota_inicial - $rangeslider.val())/$rangeslidercuota.val()));

        // SIDEBAR - RESUMEN PLAN DE PAGOS VALUES
        $valor_cuotamensual_table.text(Math.round((cuota_inicial - $rangeslider.val())/$rangeslidercuota.val()));
        $num_cuotas_table.text($rangeslidercuota.val());
        $valor_financiar_table.text(valor_faltante);

        $('.step-description_value').text(valor_faltantecuotainicial);

        $valor_financiar.text(valor_faltante);
        //console.log(valor_faltante);

        if (this.value >= separacion) {
          $('#separacion-container').slideUp();
          $('#separacion_icon').removeClass('fa-times-circle');
          $('#separacion_icon').addClass('fa-check-circle');
          if (this.value <= cuota_inicial) {
            $('#cuotas-container').slideDown();
            $('#financiacion-container').slideDown();
            $('#js-rangeslider-0').removeClass('checked');
            $('.cuota-tr').show();
          } else if (this.value >= cuota_inicial) {
            $('#cuotas-container').slideUp();
            $('#financiacion-container').slideDown();
            $('#js-rangeslider-0').addClass('checked');
            $('.cuota-tr').hide();
          }
        } else {
          $('#separacion-container').slideDown();
          $('#separacion_icon').addClass('fa-times-circle');
          $('#separacion_icon').removeClass('fa-check-circle');
          $('#cuotas-container').slideUp();
          $('#financiacion-container').slideUp();
        }


        // VALOR SUPERIOR A LA CUOTA INICIAL
        // if (this.value >= cuota_inicial) {
        //   $('#cuotas-container').slideUp();
        //   $('#js-rangeslider-0').addClass('checked');
        // } else {
        //   $('#cuotas-container').slideDown();
        //   $('#js-rangeslider-0').removeClass('checked');
        // }
        //
        // // VALOR SUPERIOR A LA SEPARACIÓN
        // if (this.value <= separacion) {
        //   $('#separacion-container').slideDown();
        // } else {
        //   $('#separacion-container').slideUp();
        // }
        //
        // // VALOR IGUAL A LA TOTALIDAD DEL INMUEBLE
        if (this.value == valor_inmueble) {
          $('#cuotas-container').slideUp();
          $('#financiacion-container').slideUp();
          $('#totalidad-container').slideDown();
          $('#range-max-value').addClass('checked');
        } else if (this.value != valor_inmueble) {
          //$('#financiacion-container').slideDown();
          $('#totalidad-container').slideUp();
          $('#range-max-value').removeClass('checked');
        }
      });

    $amount.on('input', function() {
      $rangeslider.val(this.value).change();
    });


    // RANGE SLIDER 2 - CUOTA
    var $rangeslidercuota = $('#slider-range-cuota');
    const $elementcuota = $('#slider-range-cuota');
    var $handlecuota;

    $elementcuota
      .rangeslider({
        polyfill: false,
        rangeClass: 'rangeslider rangeslider--plazo',

        onInit: function() {
          $handlecuota = $('.rangeslider__handle', this.$range);
          updateHandle($handlecuota[0], this.value);

          // $valor_cuotamensual.text((cuota_inicial - $rangeslider.val())/this.value);


        }
      })
      .on('input', function() {
        updateHandle($handlecuota[0], this.value);
        // $valor_cuotamensual.text(this.value)
        $valor_cuotamensual.text(Math.round((cuota_inicial - $rangeslider.val())/this.value));

        // SIDEBAR - RESUMEN PLAN DE PAGOS VALUES
        $valor_cuotamensual_table.text(Math.round((cuota_inicial - $rangeslider.val())/this.value));
        $num_cuotas_table.text(this.value);

      });

    // Update the value inside the slider handle
    function updateHandle(el, val) {
      el.textContent = val;
    }



    // RANGE SLIDER 3 - PLAZO
    var $rangesliderplazo = $('#slider-range-plazo');
    const $element = $('#slider-range-plazo');
    const $tooltip = $('#slider-range-plazo');
    var $handle;

    $element
      .rangeslider({
        polyfill: false,
        rangeClass: 'rangeslider rangeslider--plazo',

        onInit: function() {
          $handle = $('.rangeslider__handle', this.$range);
          updateHandle($handle[0], this.value);
        }
      })
      .on('input', function() {
        $('#resumen-meses').text(this.value*12);
        updateHandle($handle[0], this.value);

        $plazo_table.text(this.value);
      });

    // Update the value inside the slider handle
    function updateHandle(el, val) {
      el.textContent = val;
    }



    // DEFINE FIRST VALUES
    // valor_faltante = valor_inmueble - $rangeslider.value;
    $valor_financiar_table.text(valor_inmueble -  $rangeslider.val());
    $plazo_table.text($element.val());
    var tasav =$("#tasainteres_number").val();
    $interes_table.text(tasav);



    $("#tasainteres_number").keyup(function(){
      $interes_table.text(this.value);
    });








    //
    // $("#number_currency").on({
    //   "focus": function(event) {
    //     $(event.target).select();
    //   },
    //   "keyup": function(event) {
    //     $(event.target).val(function(index, value) {
    //       return value.replace(/\D/g, "")
    //         .replace(/([0-9])([0-9]{2})$/, '$1.$2')
    //         .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
    //     });
    //   }
    // });





    // SUBSIDIO ADD fields
    var maxFieldSubsidio = 2; //Input fields increment limitation
    var addSubsidio = $('.add_subsidio'); //Add button selector
    var wrapperSubsidio = $('.subsidio-wrapper'); //Input field wrapper

    var htmlSubsidio = '<div class="cuotas-group"><div class="cuotas-third"><div class="select-list"><select class="form-control" name="subsidio_tipo" id="subsidio_tipo" required><option disabled selected value> -- Selecciona una opción -- </option><option value="Gobierno Nacional">Gobierno Nacional</option><option value="Alcaldía Local">Alcaldía Local</option></select></div></div><div class="cuotas-third"><div class="input-group"><div class="input-group-prepend"><span class="input-group-text">$</span></div><input type="number" class="subsidio_valor form-control" placeholder="0" required></div></div><div class="cuotas-third cuotas-third_last"><div class="input-group input-date"><input type="date" name="subsidio_fecha" class="subsidio_fecha"><i class="fa fa-calendar"></i></div></div><div class="cuotas-btn"><button class="remove_button"><i class="fa fa-minus"></i></button></div></div>'
    //var fieldHTML = '<div class="cuotas-group"><input type="text" name="field_name[]" value=""/><a href="javascript:void(0);" class="remove_button">-</a></div>'; //New input field html
    var x_subsidio = 1; //Initial field counter is 1

    //Once add button is clicked
    $(addSubsidio).click(function(){
        //Check maximum number of input fields
        if(x_subsidio < maxFieldSubsidio){
            x_subsidio++; //Increment field counter
            $(wrapperSubsidio).append(htmlSubsidio); //Add field html
        }
    });

    //Once remove button is clicked
    $(wrapperSubsidio).on('click', '.remove_button', function(e){
        e.preventDefault();
        //$(this).parent('div').remove(); //Remove field html
        $(this).closest('.cuotas-group').remove(); //Remove field html
        x_subsidio--; //Decrement field counter
    });



    // PRIMA ADD fields
    var maxFieldPrima = 4; //Input fields increment limitation
    var addPrima = $('.add_prima'); //Add button selector
    var wrapperPrima = $('.prima-wrapper'); //Input field wrapper
    var htmlPrima = '<div class="cuotas-group"><div class="cuotas-half"><div class="input-group"><div class="input-group-prepend"><span class="input-group-text">$</span></div><input type="number" class="prima_valor form-control" placeholder="0" required></div></div><div class="cuotas-half cuotas-half_second"><div class="input-group input-date"><input type="date" name="prima_fecha" class="prima_fecha"><i class="fa fa-calendar"></i></div></div><div class="cuotas-btn"><button class="remove_button"><i class="fa fa-minus"></i></button></div></div>'
    //var fieldHTML = '<div class="cuotas-group"><input type="text" name="field_name[]" value=""/><a href="javascript:void(0);" class="remove_button">-</a></div>'; //New input field html
    var x_prima = 1; //Initial field counter is 1

    //Once add button is clicked
    $(addPrima).click(function(){
        //Check maximum number of input fields
        if(x_prima < maxFieldPrima){
            x_prima++; //Increment field counter
            $(wrapperPrima).append(htmlPrima); //Add field html
        }
    });

    //Once remove button is clicked
    $(wrapperPrima).on('click', '.remove_button', function(e){
        e.preventDefault();
        //$(this).parent('div').remove(); //Remove field html
        $(this).closest('.cuotas-group').remove(); //Remove field html
        x_prima--; //Decrement field counter
    });




    // CESANTÍA ADD fields
    var maxFieldCesantia = 4; //Input fields increment limitation
    var addCesantia = $('.add_cesantia'); //Add button selector
    var wrapperCesantia = $('.cesantia-wrapper'); //Input field wrapper
    var htmlCesantia = '<div class="cuotas-group"><div class="cuotas-half"><div class="input-group"><div class="input-group-prepend"><span class="input-group-text">$</span></div><input type="number" class="cesantia_valor form-control" placeholder="0" required></div></div><div class="cuotas-half cuotas-half_second"><div class="input-group input-date"><input type="date" name="cesantia_fecha" class="cesantia_fecha"><i class="fa fa-calendar"></i></div></div><div class="cuotas-btn"><button class="remove_button"><i class="fa fa-minus"></i></button></div></div>'
    var x_cesantia = 1; //Initial field counter is 1

    //Once add button is clicked
    $(addCesantia).click(function(){
        //Check maximum number of input fields
        if(x_cesantia < maxFieldCesantia){
            x_cesantia++; //Increment field counter
            $(wrapperCesantia).append(htmlCesantia); //Add field html
        }
    });

    //Once remove button is clicked
    $(wrapperCesantia).on('click', '.remove_button', function(e){
        e.preventDefault();
        //$(this).parent('div').remove(); //Remove field html
        $(this).closest('.cuotas-group').remove(); //Remove field html
        x_cesantia--; //Decrement field counter
    });



    // ADICIONAL ADD fields
    var maxFieldAdicional = 5; //Input fields increment limitation
    var addAdicional = $('.add_adicional'); //Add button selector
    var wrapperAdicional = $('.adicional-wrapper'); //Input field wrapper
    var htmlAdicional = '<div class="cuotas-group"><div class="cuotas-half"><div class="input-group"><div class="input-group-prepend"><span class="input-group-text">$</span></div><input type="number" class="adicional_valor form-control" placeholder="0" required></div></div><div class="cuotas-half cuotas-half_second"><div class="input-group input-date"><input type="date" name="adicional_fecha" class="adicional_fecha"><i class="fa fa-calendar"></i></div></div><div class="cuotas-btn"><button class="remove_button"><i class="fa fa-minus"></i></button></div></div>'
    var x_adicional = 1; //Initial field counter is 1

    //Once add button is clicked
    $(addAdicional).click(function(){
        //Check maximum number of input fields
        if(x_adicional < maxFieldAdicional){
            x_adicional++; //Increment field counter
            $(wrapperAdicional).append(htmlAdicional); //Add field html
        }
    });

    //Once remove button is clicked
    $(wrapperAdicional).on('click', '.remove_button', function(e){
        e.preventDefault();
        //$(this).parent('div').remove(); //Remove field html
        $(this).closest('.cuotas-group').remove(); //Remove field html
        x_adicional--; //Decrement field counter
    });




    // SEPARACIÓN CUOTA INICIAL Range slider
    // var separacionSlider = document.getElementById('slider-separacion');
    // if (separacionSlider != undefined) {
    //     noUiSlider.create(separacionSlider, {
    //           start: [0],
    //           step: 100000,
    //           connect: [true, false],
    //           tooltips: [true],
    //           range: {
    //               'min': 0,
    //               'max': valor_inmueble //VALOR INMUEBLE
    //           },
    //           format: wNumb({
    //               decimals: 0,
    //               thousand: ',',
    //               prefix: '$ '
    //           })
    //   });
    // }
    // //
    // var x_value = "5000";
    // var xy_value = document.getElementById("#slider-separacion .noUi-handle").getAttribute("aria-valuetext");
    // var inicial_value = document.getElementById("#slider-separacion .noUi-handle");
    // //.getAttribute("aria-valuetext");
    // if (inicial_value != "") {
    //   $('#cuotainicial-valor').text(x_value.getAttribute("aria-valuetext"));
    // }
    // console.log(xy_value);



    // Slide selector
    // var marginSlider = document.getElementById('slider-margin');
    // if (marginSlider != undefined) {
    //     noUiSlider.create(marginSlider, {
    //           start: [10],
    //           step: 1,
    //           connect: [true, false],
    //           tooltips: [true],
    //           range: {
    //               'min': 1,
    //               'max': 20
    //           },
    //           format: wNumb({
    //               decimals: 0,
    //               thousand: ',',
    //               prefix: ' '
    //           })
    //   });
    // }


    var navListItems = $('ul.setup-panel li a'),
        allWells = $('.setup-content');

    allWells.hide();

    navListItems.click(function(e)
    {
        e.preventDefault();
        var $target = $($(this).attr('href')),
            $item = $(this).closest('li');

        if (!$item.hasClass('disabled')) {
            navListItems.closest('li').removeClass('active');
            $item.addClass('active');
            allWells.hide();
            $target.show();
        }
    });

    $('ul.setup-panel li.active a').trigger('click');

    // STEP 1 //
    $('.activate-step-1').on('click', function(e) {
        $('ul.setup-panel li:eq(0)').removeClass('disabled');
        $('ul.setup-panel li a[href="#step-1"]').trigger('click');
        $('.menu-lateral-step1').show();
        $('.menu-lateral-step2').hide();
        $('.menu-lateral-step3').hide();
        //$(this).remove();
    });
    // STEP 2 //
    $('.activate-step-2').on('click', function(e) {
        $('ul.setup-panel li:eq(1)').removeClass('disabled');
        $('ul.setup-panel li a[href="#step-2"]').trigger('click');
        $('.menu-lateral-step1').hide();
        $('.menu-lateral-step2').show();
        $('.menu-lateral-step3').hide();
        //$(this).remove();
    });
    // STEP 3 //
    $('.activate-step-3').on('click', function(e) {
        $('ul.setup-panel li:eq(2)').removeClass('disabled');
        $('ul.setup-panel li a[href="#step-3"]').trigger('click');
        $('.menu-lateral-step1').hide();
        $('.menu-lateral-step2').hide();
        $('.menu-lateral-step3').show();
        //$(this).remove();
    });






    // FORM VALIDATION - FALTAN
    // Validación campo Nombre (#nombres_text)
    $('#nombres_text').on('input', function() {
      var input=$(this);
      var is_name=input.val();
      if(is_name){input.removeClass("invalid").addClass("valid");}
      else{input.removeClass("valid").addClass("invalid");}
    });

    // Validación campo Apellidos (#apellidos_text)
    $('#apellidos_text').on('input', function() {
      var input=$(this);
      var is_name=input.val();
      if(is_name){input.removeClass("invalid").addClass("valid");}
      else{input.removeClass("valid").addClass("invalid");}
    });

    // Validación campo Email (#mail_email)
    $('#mail_email').on('input', function() {
    	var input=$(this);
    	var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    	var is_email=re.test(input.val());
    	if(is_email){input.removeClass("invalid").addClass("valid");}
    	else{input.removeClass("valid").addClass("invalid");}
    });

    // Validación campo Teléfono (#celular_number)
    $('#celular_number').on('input', function() {
      var input=$(this);
      var is_name=input.val();
      if(is_name){input.removeClass("invalid").addClass("valid");}
      else{input.removeClass("valid").addClass("invalid");}
    });



});
