export const constants = {
  DEFAULT: {
    DEFAULT_SELECT_VALUE: "-1",
    PRINCIPAL_BUILDING_TYPE_ID: 4,
    PARKING_BUILDING_TYPE_ID: 5,
    STORAGE_BUILDING_TYPE_ID: 6,
    OTHER_BUILDING_TYPE_ID: 7,
    DEFAULT_APPLY_SIMULATOR_DISCOUNTS_TO: 1,
    SIMULATOR_RESULT_TOLERANCE: 10000,
    DEFAULT_LEAD_ORIGIN: "SIMULADOR",
    DEFAULT_PROSPECT_MODULE_NAME: "PROSPECTOS",
    DEFAULT_LEAD_MESSAGE: "Lead recibido por medio de cotizador en página web",
    GENERIC_LISTS: {
      SEGMENT_PAYMENT_PLANS: "PLANES_PAGO_ETAPA",
    },
  },
  ENUMS: {
    FINANCIAL_CALCULATION_METHOD: {
      NORMAL: "normal",
      LINEAL: "lineal",
    },
    MODAL_MESSAGES_SIZE: {
      SMALL: "small",
      MEDIUM: "medium",
      LARGE: "large",
    },
    MESSAGES: {
      SIMULATION_BUILDING_SELECTION_REQUIRED:
        "<b>Por favor selecciona el inmueble de tu preferencia</b><hr> Selecciona el tipo de inmueble que más se ajuste a tus necesidades, recuerda que también puedes adicionar complementos a tu compra.",
      SIMULATION_INPUT_DATA_VALIDATION:
        "<b>Por favor verifica la información ingresada</b><hr> Recuerda que debes diligenciar todos los campos y que estos deben estar en un formato correcto.",
      SIMULATION_ERROR:
        "<b>Lo sentimos, algo ha salido mal</b><hr> Te invitamos a reiniciar el proceso y volverlo a intentar. Gracias.",
      SIMULATION_SENT(email: string) {
        return (
          "<b>Gracias. Tus datos han sido enviados.</b><hr> En un momento recibirás la información completa en el correo " +
          email +
          ". Revisa también tu bandeja de spam, en caso de no llegar el mensaje en los próximos minutos."
        );
      },
    },
  },
  ENDPOINTS: {
    BUILDINGS: {
      ENDPOINT_GROUPEDAVAILABLEBUILDINGS:
        "Inmuebles/ObtenerClasificacionInmueblesAgrupada?intIdObraInmueble={0}",
      ENDPOINT_GETBUILDINGSBYTYPE:
        "Inmuebles/ObtenerInventarioXEtapaTipo?intIdObraInmueble={0}&intIdTipoInmueble={1}&strClasificacionListaPrecio={2}",
    },
    COMPANY: {
      ENDPOINT_COMPANYPROJECTS:
        "Obra/ObtenerObrasActivasXEmpresa?intIdEmpresa={0}",
    },
    LEADS: {
      ENDPOINT_SAVELEAD: "Integracion/LeadAdd",
    },
    PROJECTS: {
      ENDPOINT_GET_MARKETING_CONFIGURATION:
        "Mercadeo/ConsultarConfiguracionMercadeoObra?intIdObra={0}",
    },
    SEGMENTS: {
      ENDPOINT_PROJECTSEGMENTS: "Inmuebles/ObtenerEtapasActivas?intIdObra={0}",
    },
    SIMULATOR: {
      ENDPOINT_GETSIMULATORPARAMETERS:
        "Cotizador/ObtenerParametrosCotizacion?intIdCotizacion=0&intIdObraInmueble={0}&colInmueblesSeleccionados={1}&bitEsArriendo=false",
      ENDPOINT_GETLINEALSIMULATORVALUES:
        "Cotizador/ObtenerFinancierosExcel?strNombreCotizador={0}&numTasaFavor={1}&numTasaContra={2}&intCantCuotas={3}&intCantCuotasCliente={4}&intCuotaFinal={5}",
      ENDPOINT_GETNONLINEALSIMULATORVALUES:
        "Cotizador/ObtenerFinancierosExcel?strNombreCotizador={0}&numTasaFavor={1}&numTasaContra={2}&intCantCuotas={3}&intCantCuotasCliente={4}&intCuotaFinal={5}",
      ENDPOINT_SAVE_SIMULATION: "Cotizador/GuardarCotizacion",
    },
    GENERICS: {
      ENDPOINT_QUERY_GENERIC_LIST:
        "Utilidades/ObtenerLista?strNombreLista={0}&bitIncluirSeleccione=false&strParam1={2}&strParam2={3}&strParam3={4}&strParam4={5}&bitIncluirTodos={6}",
      ENDPOINT_SEND_SIMULATOR_EMAIL: "Utilidades/EnviarCorreoElectronico",
      ENDPOINT_VALIDATE_EMAIL_EXISTANCE:
        "Mercadeo/ValidarExistenciaCorreoElectronico",
    },
  },
  FIELDS: {
    IDEMPRESA: "intIdEmpresa",
  },
  PARAMS: {
    COMPANY_ID: "companyid",
    PROJECT_ID: "projectid",
    SOURCE_NAME: "sourcename",
  },
  SESSION: {
    COMPANY_ID: "companyid",
    SOURCE_NAME: "sourcename",
    PROYECT_LIST: "proyectList",
    SEGMENT_LIST: "segmentList",
  },
};
