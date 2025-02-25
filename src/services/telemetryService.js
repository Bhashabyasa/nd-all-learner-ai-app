// import { CsTelemetryModule } from "@project-sunbird/client-services/telemetry";
const duration = new Date().getTime();
let CsTelemetryModule = "";

export const initialize = ({ did }) => {
  return;
  if (!CsTelemetryModule.instance.isInitialised) {
    CsTelemetryModule.instance.init({});
    const telemetryConfig = {
      config: {
        pdata: {
          id: process.env.REACT_APP_ID,
          ver: process.env.REACT_APP_VER,
          pid: process.env.REACT_APP_PID,
        },
        env: process.env.REACT_APP_ENV,
        channel: process.env.REACT_APP_CHANNEL,
        did: did,
        authtoken: "",
        uid: localStorage.getItem("apiToken"),
        sid: "",
        batchsize: 1,
        mode: "",
        host: process.env.REACT_APP_BASE_URL,
        apislug: process.env.REACT_APP_API_SLUG,
        endpoint: process.env.REACT_APP_ENDPOINT,
        tags: [],
        cdata: [
          { id: "", type: "ContentSession" },
          { id: "", type: "PlaySession" },
        ],
        // ,
        // dispatcher : {
        //   dispatch: function (event) {
        //     console.log('Event', event);
        //   }
        // }
      },
      userOrgDetails: {},
    };

    CsTelemetryModule.instance.telemetryService.initTelemetry(telemetryConfig);
  }
};

export const start = (duration) => {
  return;

  CsTelemetryModule.instance.telemetryService.raiseStartTelemetry({
    options: getEventOptions(),
    edata: {
      type: "content",
      mode: "play",
      stageid: "",
      duration: Number((duration / 1e3).toFixed(2)),
    },
  });
};

export const getEventOptions = () => {
  return;

  return {
    object: {},
    context: {
      pdata: {
        id: "",
        ver: "",
        pid: "",
      },
      env: process.env.ENV,
      uid: localStorage.getItem("apiToken"),
      cdata: [],
      rollup: {},
    },
  };
};

export const startEvent = () => {
  return;
  start(duration);
};
