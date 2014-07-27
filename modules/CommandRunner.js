define( function( require, exports, module ) {
	'use strict';
	
	// Get module dependencies.
	var AppInit = brackets.getModule( 'utils/AppInit' ),
		ExtensionUtils = brackets.getModule( 'utils/ExtensionUtils' ),
		NodeConnection = brackets.getModule( 'utils/NodeConnection' ),
		nodeConnection = new NodeConnection();
	
	// Run commands.
	function run( command, callback ) {
		nodeConnection.domains.phplinttools.commander( command ).done( callback );
	}
	
	// Connect to Node.
	nodeConnection.connect( true ).done( function() {
		// Load terminal domain.
		var path = ExtensionUtils.getModulePath( module, '../node/commander' );
		
		// Load commander into Node.
		nodeConnection.loadDomains( [ path ], true ).done( function() {
			// Loaded.
		} );
	} );
	
	// Return public functions.
	return {
		run: run
	};
} );