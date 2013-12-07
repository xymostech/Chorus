var sound = require('./sound'), capture = require('./capture');

function convert_to_sound(packet) {
    var sound = {};

    sound.add_sound(sound);
}

capture.on('capture', convert_to_sound);

sound.run();
