function eval_(code) {
  return eval.call(this, code);
}

function evalRoy(code, env) {
  var compiled = roy.compile(code, env, {}, {nodejs: true});
  compiled.result = eval_(compiled.output);
  return compiled;
}

function fmt(value, className) {
  return {msg: value, className: "jquery-console-message-" + className};
}

function fmtValue(value) { return fmt(value, "value"); }
function fmtType(value) { return fmt(value, "type"); }
function fmtError(value) { return fmt(value, "error"); }

$(function() {
  var console = $('<div class="console"></div>');
  $('body').append(console);

  var env = {};
  window.env = env;
  $.get("prelude.roy", {}, function (data) {
    evalRoy(data, env);
  }, "text");

  var controller = console.console({
    promptLabel: 'λ> ',
    autofocus: true,
    animateScroll: true,
    promptHistory: true,
    welcomeMessage: "Roy, you say? Here's an interactive session of Roy:",
    commandHandle: function (line, report) {
      var parts = line.split(" ");

      switch (parts[0]) {
      case ":t":
        var term = parts[1]
        if (env[term]) {
          return [fmtType(term)];
        } else {
          return [fmtError(term + " is not defined.")];
        }

      case ":c":
        try {
          var code = parts.slice(1).join(" ");
          var compiled = roy.compile(code, env, {}, {nodejs: true});
          return [fmt(compiled.output, "code")];
        } catch(e) {
          return [fmtError(e.toString())];
        }

      default:
        try {
          var evaled = evalRoy(line, env);

          if (evaled != undefined) {
            return [fmtValue(JSON.stringify(evaled.result)),
                    fmtType(": " + evaled.type.toString())];
          } else {
            return true;
          }
        } catch(e) {
          return [fmtError(e.toString())];
        }
      }
    }
  });
});
