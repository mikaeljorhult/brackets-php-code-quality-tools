define(function (require) {
  'use strict';

  // Get module dependencies.
  var AppInit = brackets.getModule('utils/AppInit');
  var CodeInspection = brackets.getModule('language/CodeInspection');
  var DocumentManager = brackets.getModule('document/DocumentManager');
  var EditorManager = brackets.getModule('editor/EditorManager');
  var PreferencesManager = brackets.getModule('preferences/PreferencesManager');

  // Extension Modules.
  var CommandRunner = require('modules/CommandRunner');
  var Events = require('modules/Events');
  var Paths = require('modules/Paths');

  // Parsers.
  var phpl = require('modules/parsers/phpl');
  var phpmd = require('modules/parsers/phpmd');
  var phpcpd = require('modules/parsers/phpcpd');
  var phpcs = require('modules/parsers/phpcs');
  var parsers = [
    phpl,
    phpcpd,
    phpcs,
    phpmd
  ];

  // Setup extension.
  var preferences = PreferencesManager.getExtensionPrefs('mikaeljorhult.bracketsPHPLintTools');

  // Lint path and return found errors.
  function getErrors (fullPath) {
    var filePath = Paths.escape(fullPath);

    // Pass file to each parser.
    for (var parser in parsers) {
      if (parsers.hasOwnProperty(parser)) {
        parsers[parser].parse(filePath);
      }
    }
  }

  // Sanitize PHP location
  function sanitizePHPLocation (phpLocation) {
    return phpLocation
      .replace(/"/g, '')
      .replace(/\\/g, '/');
  }

  // Check if PHP location is valid
  function checkPHPLocation (phpLocation, callback) {
    phpLocation = sanitizePHPLocation(phpLocation);

    CommandRunner.run('"' + phpLocation + '" -v', {}, function (data) {
      var phpAvailable = data.indexOf('PHP') === 0;
      callback(phpAvailable);
    });
  }

  // Register event listeners.
  function registerEvents () {
    // Test for PHP.
    CommandRunner.run('php -v', {}, function (data) {
      var phpAvailable = data.indexOf('PHP') === 0;

      // Save PHP state
      preferences.set('php-available', phpAvailable);
      preferences.save();

      // Only register linters and listeners if PHP is available on machine.
      if (phpAvailable) {
        // Register linting service.
        CodeInspection.register('php', {
          name: phpcpd.name(),
          scanFile: function () {
            return {
              errors: phpcpd.errors()
            };
          }
        });

        CodeInspection.register('php', {
          name: phpcs.name(),
          scanFile: function () {
            return {
              errors: phpcs.errors()
            };
          }
        });

        CodeInspection.register('php', {
          name: phpl.name(),
          scanFile: function () {
            return {
              errors: phpl.errors()
            };
          }
        });

        CodeInspection.register('php', {
          name: phpmd.name(),
          scanFile: function () {
            return {
              errors: phpmd.errors()
            };
          }
        });

        // Run CodeInspection when a file is saved, a file gets focus or on startup.
        DocumentManager.on('documentSaved.phpCodeQualityTools', getErrorsFromDocument);
        EditorManager.on('activeEditorChange.phpCodeQualityTools', getErrorsFromEditor);
        AppInit.appReady(getErrorsFromEditor);

        // Run parsers if preferences are changed.
        preferences.on('change', function () {
          getErrorsFromEditor();
        });
      }
    });
  }

  // Receive, or use active editor, to get current file.
  function getErrorsFromEditor (event, editor) {
    editor = editor || EditorManager.getCurrentFullEditor();

    if (editor) {
      getErrorsFromDocument(event, editor.document);
    }
  }

  // Trigger function to get errors if file is PHP.
  function getErrorsFromDocument (event, fileEntry) {
    if (fileEntry.language.getName() === 'PHP') {
      getErrors(fileEntry.file.fullPath);
    }
  }

  // Register event listeners.
  if (CommandRunner.initialized()) {
    registerEvents();
  } else {
    Events.subscribe('node:connected', registerEvents);
  }

  // To register events again
  return {
    registerEvents: registerEvents,
    checkPHPLocation: checkPHPLocation,
    sanitizePHPLocation: sanitizePHPLocation
  };
});
