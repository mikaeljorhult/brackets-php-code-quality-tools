define(function (require, exports, module) {
  'use strict';

  // Get module dependencies.
  var AppInit = brackets.getModule('utils/AppInit');
  var ExtensionUtils = brackets.getModule('utils/ExtensionUtils');
  var NodeConnection = brackets.getModule('utils/NodeConnection');
  var nodeConnection = new NodeConnection();
  var PreferencesManager = brackets.getModule('preferences/PreferencesManager');

  // Extension modules.
  var Events = require('modules/Events');
  var preferences = PreferencesManager.getExtensionPrefs('mikaeljorhult.bracketsPHPLintTools');

  // Variables.
  var initialized = false;

  // Run commands.
  function run (command, options, callback) {
    if (command.substr(0, 4) === 'php ') {
      var phpLocation = preferences.get('php-location');

      if (phpLocation) {
        command = phpLocation + ' ' + command.substr(4);
      }
    }

    nodeConnection.domains.phplinttools.commander(command, options).done(callback);
  }

  // Return initialization status.
  function getInitialized () {
    return initialized;
  }

  // Connect to Node.
  AppInit.appReady(function () {
    // Connect to Node.
    nodeConnection.connect(true).done(function () {
      // Load terminal domain.
      var path = ExtensionUtils.getModulePath(module, '../node/commander');

      // Load commander into Node.
      nodeConnection.loadDomains([path], true).done(function () {
        // Set initialization status.
        initialized = true;

        // Publish event.
        Events.publish('node:connected');
      });
    });
  });

  // Return public functions.
  return {
    initialized: getInitialized,
    run: run,
    _nodeConnection: nodeConnection
  };
});
