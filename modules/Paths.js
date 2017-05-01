define( function( require, exports, module ) {
	'use strict';
	
	// Get module dependencies.
	var ExtensionUtils = brackets.getModule( 'utils/ExtensionUtils' ),
		
		// Variables.
		basePath = ExtensionUtils.getModulePath( module, 'vendor/' ),
		_paths = {
			base: basePath,
			phpcpd: basePath + 'phpcpd/phpcpd.phar',
			phpcsfixer: basePath + 'phpcsfixer/php-cs-fixer.phar',
			php7cc: basePath + 'php7cc/php7cc.phar',
			phpcs: 'phpcs.phar',
			phpl: '',
			phpsa: basePath + 'phpsa/phpsa.phar',
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
	
	function get( path, unescaped ) {
		var returnPath = ( unescaped === true ? _paths[ path ] : escapePath( _paths[ path ] ) );
		
		return returnPath;
	}
	
	// Return paths object.
	return {
		escape: escapePath,
		get: get
	};
} );