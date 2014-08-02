define( function( require, exports, module ) {
	'use strict';
	
	// Get module dependencies.
	var AppInit = brackets.getModule( 'utils/AppInit' ),
		ExtensionUtils = brackets.getModule( 'utils/ExtensionUtils' ),
		ProjectManager = brackets.getModule( 'project/ProjectManager' ),
		
		// Extension modules.
		Paths = require( 'modules/Paths' ),
		
		// Variables.
		basePath = ExtensionUtils.getModulePath( module, 'vendor/' ),
		_paths = {
			phpcpd: basePath + 'phpcpd/phpcpd.phar',
			phpcs: basePath + 'phpcs/phpcs.phar',
			phpmd: basePath + 'phpmd/phpmd.phar'
		};
		
	function escapePath( path ) {
		if ( brackets.platform === 'win' ) {
			path = '"' + path + '"';
		} else {
			path = path.replace( new RegExp( ' ', 'g' ), '\\ ' );
		}
		
		return path;
	}
	
	function get( path ) {
		return escapePath( _paths[ path ] );
	}
	
	// Return paths object.
	return {
		get: get
	};
} );