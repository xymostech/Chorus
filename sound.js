'use strict';

var baudio = require('baudio'), tune = require('tune');

var tau = Math.PI * 2;

function sin(freq, t) {
    return 1 * Math.sin((2 * Math.PI) * freq * t);
}

function square(freq, t) {
    return Math.sin(2 * Math.PI * t * freq) < 0 ? -1 : 1;
}

function sawtooth(freq, t) {
    return t % (1 / freq) * freq * 2 - 1;
}

var currtime = 0;

function Sound(freq, vol, length) {
    this.freq = 440 * Math.pow(2, freq) + 0.01;
    this.vol = vol;
    this.endtime = currtime + length;
}

Sound.prototype.is_dead = function(time) {
    return time > this.endtime;
};

Sound.prototype.play = function(time) {
    return this.vol * sin(this.freq, time);
};

var sounds = [];

add_chord([0, 1/4, 7/12], 0.5, 5);

function add_sound(freq, vol, length) {
    sounds.push(new Sound(freq, vol, length));
}

function add_chord(freqs, vol, length) {
    for (var i = 0; i < freqs.length; i++) {
        add_sound(freqs[i], vol, length);
    }
}

var b = baudio(function(t) {
    var value = 0;
    var len = sounds.length;

    for (var i = sounds.length - 1; i >= 0; i--) {
        value += sounds[i].play(t);
        if (sounds[i].is_dead(t)) {
            sounds.splice(i, 1);
        }
    }

    currtime = t;

    return value;
});

module.exports = {
    run: function() {
        b.play();
    },
    addSound: function(sound) {
    }
};
