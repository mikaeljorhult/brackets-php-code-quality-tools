define( function( require, exports ) {
	'use strict';
	
	// Get module dependencies.
	var Dialogs = brackets.getModule( 'widgets/Dialogs' ),
		
		// Extension Modules.
		Defaults = require( 'modules/Defaults' ),
		
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
	 * Set each value of the preferences in dialog.
	 */
	function setValues( values ) {
		setCheckboxesFromArray( 'enabled', values.enabledTools );
		setCheckboxesFromArray( 'phpcs-standards', values.phpcsStandards );
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
			if ( valueArray.indexOf( $this.attr( 'value' ) ) !== -1 ) {
				$this.prop( 'checked', true );
			}
		} );
	}
	
	/**
	 * Initialize dialog values.
	 */
	function init() {
		var values = {
			enabledTools: preferences.get( 'enabled-tools' ),
			phpcsStandards: preferences.get( 'phpcs-standards' ),
			phpmdRulesets: preferences.get( 'phpmd-rulesets' )
		};
		
		setValues( values );
	}
	
	/**
	 * Exposed method to show dialog.
	 */
	exports.show = function( prefs ) {
		// Compile dialog template.
		var compiledTemplate = Mustache.render( settingsDialogTemplate, {} );
		
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
				preferences.set( 'phpmd-rulesets', values.phpmdRulesets );
				
				preferences.save();
			}
		} );
	};
} );