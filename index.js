var b = require('baudio')(), tune = require('tune');

var funcs = [];

funcs.push(tune('A5'));

b.push(function(t) {
    var value = 0;

    for (var i = 0; i < funcs.length; i++) {
        value += funcs[i](t);
    }

    return value / funcs.length;
});
b.play();
