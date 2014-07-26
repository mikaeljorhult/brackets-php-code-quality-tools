/*!
 * Brackets PHP Lint Tools 0.1.0
 * Lint PHP using several code analysis tools.
 *
 * @author Mikael Jorhult
 * @license http://mikaeljorhult.mit-license.org MIT
 */
define( function( require, exports, module ) {
	'use strict';
	
	// Get module dependencies.
	var CodeInspection = brackets.getModule( 'language/CodeInspection' ),
		CommandManager = brackets.getModule( 'command/CommandManager' ),
		DocumentManager = brackets.getModule( 'document/DocumentManager' ),
		ExtensionUtils = brackets.getModule( 'utils/ExtensionUtils' ),
		Menus = brackets.getModule( 'command/Menus' ),
		PreferencesManager = brackets.getModule( 'preferences/PreferencesManager' ),
		
		// Extension Modules.
		Defaults = require( 'modules/Defaults' ),
		Parsers = require( 'modules/Parsers' ),
		SettingsDialog = require( 'modules/SettingsDialog' ),
		
		// Setup extension.
		COMMAND_ID_SETTINGS = 'mikaeljorhult.bracketsPHPLintTools.settings',
		preferences = PreferencesManager.getExtensionPrefs( 'mikaeljorhult.bracketsPHPLintTools' ),
		
		// Variables.
		basePath = ExtensionUtils.getModulePath( module, 'modules/vendor/' ).replace( ' ', '\\ ' ),
		paths = {
			phpcpd: 'php ' + basePath + 'phpcpd/phpcpd.phar',
			phpcs: 'php ' + basePath + 'phpcs/phpcs.phar',
			phpmd: 'php ' + basePath + 'phpmd/phpmd.phar'
		},
		
		// Hook into menus.
		menu = Menus.getMenu( Menus.AppMenuBar.VIEW_MENU );
	
	// Define preferences.
	preferences.definePreference( 'enabled-tools', 'array', Defaults.enabledTools );
	preferences.definePreference( 'phpcs-standards', 'array', Defaults.phpcsStandards );
	preferences.definePreference( 'phpmd-rulesets', 'array', Defaults.phpmdRulesets );
	
	// Register extension.
	CommandManager.register( 'PHP Lint Tools', COMMAND_ID_SETTINGS, showSettingsDialog );
	
	// Add command to menu.
	if ( menu !== undefined ) {
		menu.addMenuDivider();
		menu.addMenuItem( COMMAND_ID_SETTINGS );
	}
	
	// Load stylesheet.
	ExtensionUtils.loadStyleSheet( module, 'phplinttools.css' );
	
	// Show settings dialog.
	function showSettingsDialog() {
		SettingsDialog.show( preferences );
	}
	
	// Lint path and return found errors.
	function getErrors( fullPath ) {
		var filePath = fullPath.replace( new RegExp( ' ', 'g' ), '\\ ' ),
			phpcsStandards = concatenateArray( preferences.get( 'phpcs-standards' ), ' --standard=' ),
			phpmdRulesets = concatenateArray( preferences.get( 'phpmd-rulesets' ) ),
			
			// Commands.
			phpcpdCommand = paths.phpcpd + ' ' + filePath,
			phpcsCommand = paths.phpcs + phpcsStandards + ' ' + filePath,
			phpmdCommand = paths.phpmd + ' ' + filePath + ' text ' + phpmdRulesets;
		
		// Pass command to parser.
		Parsers.run( {
			name: 'phpcs',
			command: phpcsCommand
		} );
		
		Parsers.run( {
			name: 'phpcpd',
			command: phpcpdCommand
		} );
		
		Parsers.run( {
			name: 'phpmd',
			command: phpmdCommand
		} );
	}
	
	// Concatenate a array of values to a comma separated string.
	function concatenateArray( valueArray, prefix ) {
		var returnValue = false;
		
		if ( valueArray.length > 0 ) {
			returnValue = ( prefix !== undefined ? prefix : '' ) + valueArray.join( ',' );
		}
		
		return returnValue;
	}
	
	// Run CodeInspection when a file is saved.
	$( DocumentManager ).on( 'documentSaved', function( event, fileEntry ) {
		getErrors( fileEntry.file.fullPath );
	} );
	
	// Register linting service.
	CodeInspection.register( 'php', {
		name: 'PHP Copy/Paste Detector',
		scanFile: function() {
			return {
				errors: Parsers.errors().phpcpd
			};
		}
	} );
	
	CodeInspection.register( 'php', {
		name: 'PHP CodeSniffer',
		scanFile: function() {
			return {
				errors: Parsers.errors().phpcs
			};
		}
	} );
	
	CodeInspection.register( 'php', {
		name: 'PHP Mess Detector',
		scanFile: function() {
			return {
				errors: Parsers.errors().phpmd
			};
		}
	} );
} );
