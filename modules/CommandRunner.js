define( function( require, exports, module ) {
	'use strict';
	
	// Get module dependencies.
	var AppInit = brackets.getModule( 'utils/AppInit' ),
		ExtensionUtils = brackets.getModule( 'utils/ExtensionUtils' ),
		NodeConnection = brackets.getModule( 'utils/NodeConnection' ),
		nodeConnection = new NodeConnection(),
		
		// Extension modules.
		Events = require( 'modules/Events' ),
		
		// Variables.
		initialized = false;
	
	// Run commands.
	function run( command, callback ) {
		nodeConnection.domains.phplinttools.commander( command ).done( callback );
	}
	
	// Return initialization status.
	function getInitialized() {
		return initialized;
	}
	
	// Connect to Node.
	AppInit.appReady( function() {
		// Connect to Node.
		nodeConnection.connect( true ).done( function() {
			// Load terminal domain.
			var path = ExtensionUtils.getModulePath( module, '../node/commander' );
			
			// Load commander into Node.
			nodeConnection.loadDomains( [ path ], true ).done( function() {
				// Set initialization status.
				initialized = true;
				
				// Publish event.
				Events.publish( 'node:connected' );
			} );
		} );
	} );
	
	// Return public functions.
	return {
		initialized: getInitialized,
		run: run,
		_nodeConnection: nodeConnection
	};
} );