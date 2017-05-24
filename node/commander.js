(function () {
  var childProcess = require('child_process');

  exports.init = function (manager) {
    if (!manager.hasDomain('phplinttools')) {
      manager.registerDomain('phplinttools', {
        major: 1,
        minor: 0
      });
    }

    manager.registerCommand('phplinttools', 'commander', commander, true);
  };

  function commander (exec, options, cb) {
    childProcess.exec(exec, options, function (err, stdout, stderr) {
      if (err) {
        console.log(err);
      }

      cb(null, stderr + stdout);
    });
  }
}());
