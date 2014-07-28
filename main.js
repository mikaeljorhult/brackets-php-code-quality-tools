/*!
 * Brackets PHP Code Quality Tools 0.1.0
 * Lint PHP using several code analysis tools.
 *
 * @author Mikael Jorhult
 * @license http://mikaeljorhult.mit-license.org MIT
 */
define( function( require, exports, module ) {
	'use strict';
	
	// Get module dependencies.
	var AppInit = brackets.getModule( 'utils/AppInit' ),
		CodeInspection = brackets.getModule( 'language/CodeInspection' ),
		CommandManager = brackets.getModule( 'command/CommandManager' ),
		DocumentManager = brackets.getModule( 'document/DocumentManager' ),
		EditorManager = brackets.getModule( 'editor/EditorManager' ),
		ExtensionUtils = brackets.getModule( 'utils/ExtensionUtils' ),
		Menus = brackets.getModule( 'command/Menus' ),
		PreferencesManager = brackets.getModule( 'preferences/PreferencesManager' ),
		
		// Extension Modules.
		CommandRunner = require( 'modules/CommandRunner' ),
		Defaults = require( 'modules/Defaults' ),
		Parsers = require( 'modules/Parsers' ),
		SettingsDialog = require( 'modules/SettingsDialog' ),
		Strings = require( 'modules/Strings' ),
		
		// Setup extension.
		COMMAND_ID_SETTINGS = 'mikaeljorhult.bracketsPHPLintTools.settings',
		preferences = PreferencesManager.getExtensionPrefs( 'mikaeljorhult.bracketsPHPLintTools' ),
		
		// Variables.
		basePath = ExtensionUtils.getModulePath( module, 'modules/vendor/' ).replace( ' ', '\\ ' ),
		paths = {
			phpcpd: 'php ' + basePath + 'phpcpd/phpcpd.phar',
			phpcs: 'php ' + basePath + 'phpcs/phpcs.phar',
			phpl: 'php',
			phpmd: 'php ' + basePath + 'phpmd/phpmd.phar'
		},
		
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
	
	// Lint path and return found errors.
	function getErrors( fullPath ) {
		var filePath = fullPath.replace( new RegExp( ' ', 'g' ), '\\ ' ),
			phpcsStandards = concatenateArray( preferences.get( 'phpcs-standards' ), ' --standard=' ),
			phpmdRulesets = concatenateArray( preferences.get( 'phpmd-rulesets' ) ),
			
			// Commands.
			phpcpdCommand = paths.phpcpd + ' ' + filePath,
			phpcsCommand = paths.phpcs + phpcsStandards + ' ' + filePath,
			phplCommand = paths.phpl + ' -d display_errors=1 -d error_reporting=-1 -l ' + filePath,
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
			name: 'phpl',
			command: phplCommand
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
	
	// Register event listeners.
	AppInit.appReady( function() {
		// Test for PHP.
		CommandRunner.run( 'php -v', function( data ) {
			var phpAvailable = data.indexOf( 'PHP' ) > -1;
			
			// Save PHP state
			preferences.set( 'php-available', phpAvailable );
			preferences.save();
			
			// Only register linters and listeners if PHP is available on machine.
			if ( phpAvailable ) {
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
					name: 'PHP Lint',
					scanFile: function() {
						return {
							errors: Parsers.errors().phpl
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
				
				// Run CodeInspection when a file is saved or other file get focus.
				$( DocumentManager ).on( 'documentSaved.phpLintTools', function( event, fileEntry ) {
					getErrors( fileEntry.file.fullPath );
				} );
				
				$( EditorManager ).on( 'activeEditorChange', function( event, editor ) {
					getErrors( editor.document.file.fullPath );
				} );
			}
		} );
	} );
} );