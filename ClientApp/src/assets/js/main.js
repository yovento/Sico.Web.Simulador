$(document).ready(function () {});

function initializeNavigation() {
  var navListItems = $("ul.setup-panel li a"),
    allWells = $(".setup-content");

  // allWells.hide();

  navListItems.click(function (e) {
    e.preventDefault();
    var $target = $($(this).attr("href")),
      $item = $(this).closest("li");

    if (!$item.hasClass("disabled")) {
      navListItems.closest("li").removeClass("active");
      $item.addClass("active");
      allWells.hide();
      $target.show();
    }
  });

  $("ul.setup-panel li.active a").trigger("click");

  //Mostrar bloque Proyecto al seleccionar alguno
  $("#proyecto_select").change(function () {
    if ($(this).val() != "-1") {
      setTimeout(() => $("#info-proyecto-block").collapse("show"), 200);
    } else {
      $("#info-proyecto-block").collapse("hide");
    }
  });

  //Mostrar bloque Proyecto al seleccionar alguno
  $("#proyecto_etapa_select").change(function () {
    if ($(this).val() != "-1") {
      setTimeout(() => $("#form_proyecto").slideDown(), 200);
    } else {
      $("#form_proyecto").slideUp();
    }
  });

  //Mostrar bloque Inmuebles al seleccionar Etapa
  $("#etapa_select").change(function () {
    if ($(this).val() != null) {
      $("#info-resumen-block").collapse("show");
    } else {
      $("#info-resumen-block").collapse("hide");
    }
  });

  // Botón AJUSTAR FORMAS DE PAGO
  $("#btn-ajustar").on("click", function (e) {
    $("#cuotas-container").slideToggle();
    $("#financiacion-container").slideToggle();
    $("#propuestacuotainicial-block").slideToggle();
    $("#propuestafinanciacion-block").slideToggle();
    $("#btn-verpropuesta").show();
    $(this).hide();
  });

  // Botón VER PROPUESTA
  $("#btn-verpropuesta").on("click", function (e) {
    $("#cuotas-container").slideToggle();
    $("#financiacion-container").slideToggle();
    $("#propuestacuotainicial-block").slideToggle();
    $("#propuestafinanciacion-block").slideToggle();
    $("#btn-ajustar").show();
    $(this).hide();
  });

  // ANCHOR NAVIGATION

  $("#btn-anterior").on("click", function (event) {
    event.preventDefault();
    $("html,body").animate({ scrollTop: $("#title-1").offset().top }, "slow");
  });

  $("#next-step1").on("click", function (event) {
    event.preventDefault();
    $("html,body").animate({ scrollTop: $("#title-2").offset().top }, "slow");
  });

  $("#btn-ajustar").on("click", function (event) {
    event.preventDefault();
    $("html,body").animate({ scrollTop: $("#title-2").offset().top }, "slow");
  });

  $("#btn-verpropuesta").on("click", function (event) {
    event.preventDefault();
    $("html,body").animate({ scrollTop: $("#title-2").offset().top }, "slow");
  });

  $("#btn-cotizar").on("click", function (event) {
    event.preventDefault();
    $("html,body").animate({ scrollTop: $("#title-3").offset().top }, "slow");
  });

  $("#previous-step3").on("click", function (event) {
    event.preventDefault();
    $("html,body").animate({ scrollTop: $("#title-2").offset().top }, "slow");
  });

  $(".js-loading-bar").modal({
    backdrop: "static",
    show: false,
  });

  // FORM VALIDATION - FALTAN
  // Validación campo Nombre (#nombres_text)
  $("#nombres_text").on("input", function () {
    var input = $(this);
    var is_name = input.val();
    if (is_name) {
      input.removeClass("invalid").addClass("valid");
    } else {
      input.removeClass("valid").addClass("invalid");
    }
  });

  // Validación campo Apellidos (#apellidos_text)
  $("#apellidos_text").on("input", function () {
    var input = $(this);
    var is_name = input.val();
    if (is_name) {
      input.removeClass("invalid").addClass("valid");
    } else {
      input.removeClass("valid").addClass("invalid");
    }
  });

  // Validación campo Email (#mail_email)
  $("#mail_email").on("input", function () {
    var input = $(this);
    var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var is_email = re.test(input.val());
    if (is_email) {
      input.removeClass("invalid").addClass("valid");
    } else {
      input.removeClass("valid").addClass("invalid");
    }
  });

  // Validación campo Teléfono (#celular_number)
  $("#celular_number").on("input", function () {
    var input = $(this);
    var is_name = input.val();
    if (is_name) {
      input.removeClass("invalid").addClass("valid");
    } else {
      input.removeClass("valid").addClass("invalid");
    }
  });
}

function activateStep(step) {
  switch (step) {
    case 1:
      $("ul.setup-panel li:eq(0)").removeClass("disabled");
      $('ul.setup-panel li a[href="#step-1"]').trigger("click");
      $(".menu-lateral-step1").show();
      $(".menu-lateral-step2").hide();
      $(".menu-lateral-step3").hide();
      break;

    case 2:
      $("ul.setup-panel li:eq(1)").removeClass("disabled");
      $('ul.setup-panel li a[href="#step-2"]').trigger("click");
      $(".menu-lateral-step1").hide();
      $(".menu-lateral-step2").show();
      $(".menu-lateral-step3").hide();
      setTimeout(() => $("#info-resumenplan-block").collapse("show"), 200);
      break;
    case 3:
      $("ul.setup-panel li:eq(2)").removeClass("disabled");
      $('ul.setup-panel li a[href="#step-3"]').trigger("click");
      $(".menu-lateral-step1").hide();
      $(".menu-lateral-step2").hide();
      $(".menu-lateral-step3").show();
      break;

    default:
      break;
  }
}

function showProgressBar() {
  var $modal = $(".js-loading-bar"),
    $bar = $modal.find(".progress-bar");

  $modal.modal("show");
  $bar.addClass("animate");
}

function hideProgressBar() {
  var $modal = $(".js-loading-bar"),
    $bar = $modal.find(".progress-bar");
  $bar.removeClass("animate");
  $modal.modal("hide");
}

function reinitializeSimulator() {
  $("#proyecto_select")[0].selectedIndex = 0;
  $("#etapa_select")[0].selectedIndex = 0;
  $("#proyecto_etapa_select")[0].selectedIndex = 0;
  $("#form_proyecto").slideUp();
  $(".listado_inmuebles").slideUp();
  $("#next-step1").prop("disabled", true);
  $(".inmueble-block").removeClass("selected");
  $("#info-proyecto-block").collapse("hide");
  $("#info-resumen-block").collapse("hide");
  $("#info-resumenplan-block").collapse("hide");
  $("ul.setup-panel li:eq(1)").addClass("disabled");
  $("ul.setup-panel li:eq(2)").addClass("disabled");
}
