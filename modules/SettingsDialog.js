define( function( require, exports ) {
	'use strict';
	
	// Get module dependencies.
	var Dialogs = brackets.getModule( 'widgets/Dialogs' ),
		
		// Extension Modules.
		Defaults = require( 'modules/Defaults' ),
		Strings = require( 'modules/Strings' ),
		
		// Templates.
		settingsDialogTemplate = require( 'text!../html/settings-dialog.html' ),
		
		// Variables.
		dialog,
		$dialog,
		preferences;
	
	/**
	 * Reset all preferences to defaults.
	 */
	function resetValues() {
		setValues( Defaults );
		
		preferences.save();
	}
	
	/**
	 * Retrieve all values from settings dialog.
	 */
	function getValues() {
		var values = {
			enabledTools: getCheckboxArray( 'enabled' ),
			phpcsStandards: getCheckboxArray( 'phpcs-standards' ),
			phpcsfixerLevel: getCheckboxArray( 'phpcsfixer-level' ),
			phpmdRulesets: getCheckboxArray( 'phpmd-rulesets' )
		};
		
		return values;
	}
	
	/**
	 * Get values of checked checkboxes with same name.
	 */
	function getCheckboxArray( name ) {
		// Return values of checked checkboxes.
		return $( 'input[ name="' + name + '[]" ]:checked', $dialog ).map( function() {
			return this.value;
		} ).get();
	}

	/**
	 * Make sure CS Fixer only has one checkbox checked at any one time.
	 */

	function fixerCheck() {
		if ( $('#phpcsfixer-level[]').val() === 'all') {
			$('#phpcsfixer-level[!value="all"]').prop('checked', false);
		} 

		if ( $('#phpcsfixer-level[]').val() === 'psr0') {
			$('#phpcsfixer-level[!value="prs0"]').prop('checked', false);
		} 

		if ( $('#phpcsfixer-level[]').val() === 'psr1') {
			$('#phpcsfixer-level[!value="prs1"]').prop('checked', false);
		} 

		if ( $('#phpcsfixer-level[]').val() === 'psr2') {
			$('#phpcsfixer-level[!value="prs2"]').prop('checked', false);
		}

		if ( $('#phpcsfixer-level[]').val() === 'symfony') {
			$('#phpcsfixer-level[!value="symfony"]').prop('checked', false);
		}

	}

	/**
	 * Set each value of the preferences in dialog.
	 */
	function setValues( values ) {
		setCheckboxesFromArray( 'enabled', values.enabledTools );
		setCheckboxesFromArray( 'phpcs-standards', values.phpcsStandards );
		setCheckboxesFromArray( 'phpcsfixer-level', values.phpcsfixerLevel );
		setCheckboxesFromArray( 'phpmd-rulesets', values.phpmdRulesets );
	}
	
	/**
	 * Check checkboxes according to valuess in array.
	 */
	function setCheckboxesFromArray( name, valueArray ) {
		// Walk through each checkbox in dialog with supplied name.
		$dialog.find( 'input[ name="' + name + '[]" ]' ).each( function( index, element ) {
			var $this = $( element );
			
			// Make checkbox checked if its value is in array.
			$this.prop( 'checked', valueArray.indexOf( $this.attr( 'value' ) ) !== -1 );
		} );
	}
	
	/**
	 * Initialize dialog values.
	 */
	function init() {
		var values = {
			enabledTools: preferences.get( 'enabled-tools' ),
			phpcsStandards: preferences.get( 'phpcs-standards' ),
			phpcsfixerLevel: preferences.get('phpcsfixer-level'),
			phpmdRulesets: preferences.get( 'phpmd-rulesets' )
		};
		
		setValues( values );
	}
	
	/**
	 * Exposed method to show dialog.
	 */
	exports.show = function( prefs ) {
		// Compile dialog template.
		var compiledTemplate = Mustache.render( settingsDialogTemplate, {
			Strings: Strings,
			phpAvailable: prefs.get( 'php-available' )
		} );
		
		// Save dialog to variable.
		dialog = Dialogs.showModalDialogUsingTemplate( compiledTemplate );
		$dialog = dialog.getElement();
		preferences = prefs;
		
		// Initialize dialog values.
		init();
		
		// Register event listeners.
		$dialog
			.on( 'click', '.reset-preferences', function() {
				resetValues();
			} );
		
		// Open dialog.
		dialog.done( function( buttonId ) {
			var values;
			
			// Save preferences if OK button was clicked.
			if ( buttonId === 'ok' ) {
				values = getValues();
				
				preferences.set( 'enabled-tools', values.enabledTools );
				preferences.set( 'phpcs-standards', values.phpcsStandards );
				preferences.set( 'phpcsfixer-level', values.phpcsfixerLevel);
				preferences.set( 'phpmd-rulesets', values.phpmdRulesets );
				
				preferences.save();
			}
		} );
	};
} );