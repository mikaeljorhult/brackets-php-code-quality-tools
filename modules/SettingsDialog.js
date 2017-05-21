define(function (require, exports) {
  'use strict';

  // Get module dependencies.
  var Dialogs = brackets.getModule('widgets/Dialogs');
  var TemplateEngine = brackets.getModule('thirdparty/mustache/mustache');

  // Extension modules.
  var Defaults = require('modules/Defaults');
  var Strings = require('modules/Strings');
  var ParserManager = require('modules/ParserManager');

  // Templates.
  var settingsDialogTemplate = require('text!../html/settings-dialog.html');

  // Variables.
  var dialog;
  var $dialog;
  var preferences;

  /**
   * Reset all preferences to defaults.
   */
  function resetValues () {
    setValues(Defaults);

    preferences.save();
  }

  /**
   * Retrieve all values from settings dialog.
   */
  function getValues () {
    var phpLocation = $dialog.find('input[ name="php_location" ]').val();

    var values = {
      PHPLocation: ParserManager.sanitizePHPLocation(phpLocation),
      enabledTools: getCheckboxArray('enabled'),
      phpcsStandards: getCheckboxArray('phpcs-standards'),
      phpmdRulesets: getCheckboxArray('phpmd-rulesets')
    };

    return values;
  }

  /**
   * Get values of checked checkboxes with same name.
   */
  function getCheckboxArray (name) {
    // Return values of checked checkboxes.
    return $('input[ name="' + name + '[]" ]:checked', $dialog).map(function () {
      return this.value;
    }).get();
  }

  /**
   * Set each value of the preferences in dialog.
   */
  function setValues (values) {
    setCheckboxesFromArray('enabled', values.enabledTools);
    setCheckboxesFromArray('phpcs-standards', values.phpcsStandards);
    setCheckboxesFromArray('phpmd-rulesets', values.phpmdRulesets);
    $dialog.find('input[ name="php_location" ]').val(values.PHPLocation);
  }

  /**
   * Check checkboxes according to valuess in array.
   */
  function setCheckboxesFromArray (name, valueArray) {
    // Walk through each checkbox in dialog with supplied name.
    $dialog.find('input[ name="' + name + '[]" ]').each(function (index, element) {
      var $this = $(element);

      // Make checkbox checked if its value is in array.
      $this.prop('checked', valueArray.indexOf($this.attr('value')) !== -1);
    });
  }

  /**
   * Initialize dialog values.
   */
  function init () {
    var values = {
      enabledTools: preferences.get('enabled-tools'),
      phpcsStandards: preferences.get('phpcs-standards'),
      phpmdRulesets: preferences.get('phpmd-rulesets'),
      PHPLocation: preferences.get('php-location')
    };

    setValues(values);
  }

  /**
   * Exposed method to show dialog.
   */
  exports.show = function (prefs) {
    // Compile dialog template.
    var compiledTemplate = TemplateEngine.render(settingsDialogTemplate, {
      Strings: Strings,
      phpAvailable: prefs.get('php-available')
    });

    // Save dialog to variable.
    dialog = Dialogs.showModalDialogUsingTemplate(compiledTemplate);
    $dialog = dialog.getElement();
    preferences = prefs;

    // Initialize dialog values.
    init();

    // Register event listeners.
    $dialog
      .on('click', '.reset-preferences', function () {
        resetValues();
      });

    // Check PHP Location
    $dialog.find('.input-php-location').on('input', function () {
      var location = $(this).val();
      var okButton = $dialog.find('[data-button-id="ok"]');
      var errorElement = $dialog.find('.php-location-error');

      errorElement.hide();

      if (location) {
        okButton.attr('disabled', true);

        ParserManager.checkPHPLocation(location, function (phpAvailable) {
          if (phpAvailable) {
            okButton.attr('disabled', false);
          } else {
            errorElement.show();
          }
        });
      } else {
        okButton.attr('disabled', false);
      }
    });

    $dialog.find('.input-php-location').trigger('input');

    // Open dialog.
    dialog.done(function (buttonId) {
      var values;

      // Save preferences if OK button was clicked.
      if (buttonId === 'ok') {
        values = getValues();

        preferences.set('enabled-tools', values.enabledTools);
        preferences.set('phpcs-standards', values.phpcsStandards);
        preferences.set('phpmd-rulesets', values.phpmdRulesets);
        preferences.set('php-location', values.PHPLocation);

        preferences.save();

        ParserManager.registerEvents();
      }
    });
  };
});
