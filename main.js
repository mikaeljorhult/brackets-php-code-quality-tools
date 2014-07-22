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
		CommandRunner = require( 'modules/CommandRunner' ),
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
	
	// Register extension.
	CommandManager.register( 'PHP Lint Tools', COMMAND_ID_SETTINGS, showSettingsDialog );
	
	// Add command to menu.
	if ( menu !== undefined ) {
		menu.addMenuDivider();
		menu.addMenuItem( COMMAND_ID_SETTINGS );
	}
	
	// Show settings dialog.
	function showSettingsDialog() {
		SettingsDialog.show( preferences );
	}
	
	// Lint path and return found errors.
	function getErrors( fullPath ) {
		var filePath = fullPath.replace( new RegExp( ' ', 'g' ), '\\ ' ),
			phpcpdCommand = paths.phpcpd + ' ' + filePath,
			phpcsCommand = paths.phpcs + ' ' + filePath,
			phpmdCommand = paths.phpmd + ' ' + filePath + ' text cleancode,codesize,controversial,design,naming,unusedcode';
		
		// Run command using Node.
		CommandRunner.run( phpcpdCommand, Parsers.phpcpd );
		CommandRunner.run( phpcsCommand, Parsers.phpcs );
		CommandRunner.run( phpmdCommand, Parsers.phpmd );
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