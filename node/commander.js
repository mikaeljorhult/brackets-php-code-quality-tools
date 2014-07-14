( function() {
	
	var childProcess = require( 'child_process' );
	
	exports.init = function( manager ) {
		if ( !manager.hasDomain( 'phpcs' ) ) {
			manager.registerDomain( 'phpcs', {
				major: 1,
				minor: 0
			} );
		}
	
		manager.registerCommand( 'phpcs', 'commander', commander, true );
	};
	
	function commander( exec, cb ) {
		childProcess.exec( exec, function( err, stdout, stderr ) {
			cb( null, stderr + stdout );
		} );
	}
}() );