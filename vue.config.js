module.exports = {
  productionSourceMap: false,
  // publicPath: process.env.NODE_ENV === "production" ? "/" : "/"
  /* pwa: {
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/registerServiceWorker.js"
    }
  } */
  pwa: {
    // workboxPluginMode: "InjectManifest",
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      // swSrc: "service-worker.js",
      // ...other Workbox options...
      exclude: [/_redirects/]
    },
    appleMobileWebAppCapable: true,
    themeColor: "#fff",
    msTileColor: "#fff",
    manifestOptions: {
      background_color: "#fff"
    }
    // configure the workbox plugin

    /* workboxPluginMode: "InjectManifest",
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: "src/service-worker.js"
      // ...other Workbox options...
    } */
  },
  pluginOptions: {
    i18n: {
      locale: "it",
      fallbackLocale: "it",
      localeDir: "locales",
      enableInSFC: false
    }
  },
  runtimeCompiler: true
};
