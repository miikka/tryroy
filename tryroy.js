function eval_(code) {
  return eval.call(this, code);
}

$(function() {
  var console = $('<div class="console"></div>');
  $('body').append(console);

  var env = {};

  var controller = console.console({
    promptLabel: 'λ> ',
    autofocus: true,
    animateScroll: true,
    promptHistory: true,
    welcomeMessage: "Roy, you say? Here's an interactive session of Roy:",
    commandHandle: function (line, report) {
      var parts = line.split(" ");
      if (parts[0] == ":t") {
        var term = parts[1]
        if (env[term]) {
          return [{msg: env[term], className: "jquery-console-message-type"}];
        } else {
          return [{msg: term + " is not defined.", className: "jquery-console-message-error"}];
        }
      }

      try {
        var compiled = roy.compile(line, env, {}, {nodejs: true, run: true});
        var output = eval_(compiled.output);

        if (output) {
          return [{msg: output, className: "jquery-console-message-value"},
                  {msg: ": " + compiled.type.name, className: "jquery-console-message-type"}];
        } else {
          return true;
        }
      } catch(e) {
        return [{msg: e.toString(), className: "jquery-console-message-error"}];
      }
    }
  });
});
