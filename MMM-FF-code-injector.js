/* Magic Mirror
 * Module: MMM-FF-code-injector
 *
 * By Michael Trenkler
 * ISC Licensed.
 */

Module.register("MMM-FF-code-injector", {
  defaults: {
    ignoreEventsIfSuspended: false,
    scripts: {
      START: null,
      SUSPEND: null,
      RESUME: null,
      CODE_INJECTOR_EXEC: null,
      intervals: []
    },
    additionalScripts: [],
    additionalStyles: [],
    events: {
      CODE_INJECTOR_EXEC: "CODE_INJECTOR_EXEC"
    }
  },

  executeScript: function (type, args) {
    let conf = this.config?.scripts[type];
    if (typeof conf?.func === "function") {
      if (
        this.config.ignoreEventsIfSuspended &&
        conf.ignoreIfSuspended !== false &&
        this.suspended
      )
        return;
      Log.info(`MMM-FF-code-injector ${type} (${conf.args?.join(", ")})`);
      conf.func.apply(this, args ?? conf.args);
    }
  },

  execInterval: function (conf) {
    conf.timeout = setTimeout(() => {
      if (
        this.config.ignoreIntervalsIfSuspended &
          (conf.ignoreIfSuspended !== false) &&
        this.suspended
      )
        return;
      Log.info("MMM-FF-code-injector INTERVAL " + conf.description);
      conf.func.apply(this, conf.args);
      this.execInterval(conf);
    }, conf.interval);
  },

  init: function () {},

  start: function () {
    Log.info("Starting module: " + this.name);
    this.executeScript("START");
    this.config.scripts?.intervals?.forEach((_) => this.execInterval(_));
  },

  getScripts: function () {
    this.executeScript("GET_SCRIPTS");
    return [...this.config.additionalScripts].map((path) =>
      /^http(s)?:\/\//.test(path) ? path : this.file("../../" + path)
    );
  },

  getStyles: function () {
    this.executeScript("GET_STYLES");
    return [...this.config.additionalStyles].map((path) =>
      /^http(s)?:\/\//.test(path) ? path : this.file("../../" + path)
    );
  },

  isAcceptableSender(sender) {
    if (!sender) return false;
    const acceptableSender = this.config.events.sender;
    return (
      !acceptableSender ||
      acceptableSender === sender.name ||
      acceptableSender === sender.identifier ||
      (Array.isArray(acceptableSender) &&
        (acceptableSender.includes(sender.name) ||
          acceptableSender.includes(sender.identifier)))
    );
  },

  notificationReceived: function (notification, payload, sender) {
    if (!this.isAcceptableSender(sender)) return;

    this.config.events[notification]?.split(" ").forEach((e) => {
      switch (e) {
        case "CODE_INJECTOR_EXEC":
          this.executeScript("CODE_INJECTOR_EXEC", payload);
          break;
        default:
          break;
      }
    });
  },

  suspend: function () {
    this.suspended = true;
    this.executeScript("SUSPEND");
  },

  resume: function () {
    if (this.suspended === false) return;
    this.suspended = false;
    this.executeScript("RESUME");
  }
});
