/*!
 * Brackets PHP Code Quality Tools 0.1.8
 * Lint PHP using several code analysis tools.
 *
 * @author Mikael Jorhult
 * @license http://mikaeljorhult.mit-license.org MIT
 */
define( function( require, exports, module ) {
	'use strict';
	
	// Get module dependencies.
	var CommandManager = brackets.getModule( 'command/CommandManager' ),
		ExtensionUtils = brackets.getModule( 'utils/ExtensionUtils' ),
		Menus = brackets.getModule( 'command/Menus' ),
		PreferencesManager = brackets.getModule( 'preferences/PreferencesManager' ),
		
		// Extension Modules.
		Defaults = require( 'modules/Defaults' ),
		ParserManager = require( 'modules/ParserManager' ), // jshint ignore:line
		SettingsDialog = require( 'modules/SettingsDialog' ),
		Strings = require( 'modules/Strings' ),
		
		// Setup extension.
		COMMAND_ID_SETTINGS = 'mikaeljorhult.bracketsPHPLintTools.settings',
		preferences = PreferencesManager.getExtensionPrefs( 'mikaeljorhult.bracketsPHPLintTools' ),
		
		// Hook into menus.
		menu = Menus.getMenu( Menus.AppMenuBar.VIEW_MENU );
	
	// Define preferences.
	preferences.definePreference( 'php-available', 'boolean', false );
	preferences.definePreference( 'enabled-tools', 'array', Defaults.enabledTools );
	preferences.definePreference( 'phpcs-standards', 'array', Defaults.phpcsStandards );
	preferences.definePreference( 'phpmd-rulesets', 'array', Defaults.phpmdRulesets );
	
	// Register extension.
	CommandManager.register( Strings.EXTENSION_NAME, COMMAND_ID_SETTINGS, showSettingsDialog );
	
	// Add command to menu.
	if ( menu !== undefined ) {
		menu.addMenuDivider();
		menu.addMenuItem( COMMAND_ID_SETTINGS );
	}
	
	// Load stylesheet.
	ExtensionUtils.loadStyleSheet( module, 'php-tools.css' );
	
	// Show settings dialog.
	function showSettingsDialog() {
		SettingsDialog.show( preferences );
	}
} );
