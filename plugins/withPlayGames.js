const { withAndroidManifest, withStringsXml, AndroidConfig } = require("@expo/config-plugins");

module.exports = function withPlayGames(config, props) {
  config = withStringsXml(config, (config) => {
    const { appId } = props;
    if (!appId) return config;

    config.modResults = AndroidConfig.Strings.setStringItem(
      [
        {
          $: { name: "game_services_project_id", translatable: "false" },
          _: appId,
        },
      ],
      config.modResults
    );
    return config;
  });

  return withAndroidManifest(config, (config) => {
    const mainApplication = config.modResults.manifest.application[0];
    
    // Make sure we have a meta-data array
    if (!mainApplication["meta-data"]) {
      mainApplication["meta-data"] = [];
    }

    const { appId } = props;

    // Filter out existing Play Games app id if any
    mainApplication["meta-data"] = mainApplication["meta-data"].filter(
      (m) => m.$["android:name"] !== "com.google.android.gms.games.APP_ID"
    );

    // Add Play Games app id
    if (appId) {
      mainApplication["meta-data"].push({
        $: {
          "android:name": "com.google.android.gms.games.APP_ID",
          "android:value": "@string/game_services_project_id",
        },
      });
      mainApplication["meta-data"].push({
        $: {
          "android:name": "com.google.android.gms.version",
          "android:value": "@integer/google_play_services_version",
        },
      });
    }

    return config;
  });
};