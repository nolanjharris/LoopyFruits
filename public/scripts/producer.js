document.documentElement.addEventListener('mousedown', () => {
    if (Tone.context.state !== 'running') Tone.context.resume();
});


let tempo = $('#tempoSlider');
Tone.Transport.bpm.value = tempo.val();

$('#tempoSlider').on('input', function () {
    Tone.Transport.bpm.value = tempo.val();
    noteTime = 1800 / tempo.val();
    $('#tempoDiv h4').html('BPM:' + tempo.val());
});

const drums = [
    new Tone.Player('/audio/test/snare.wav'),
    new Tone.Player('/audio/test/clap.wav'),
    new Tone.Player('/audio/test/kick.wav'),
    new Tone.Player('/audio/test/cymbol.wav'),
    new Tone.Player('/audio/test/hihat-open.wav'),
    new Tone.Player('/audio/test/hihat-closed.wav'),
    new Tone.Player('/audio/test/shaker.wav')
]

var distortion = new Tone.Distortion(0.1)
var tremolo = new Tone.Tremolo().start()

tremolo.wet.value = 0.4;

const synths = [
    new Tone.MonoSynth(),
    new Tone.MonoSynth(),
    new Tone.MonoSynth(),
    new Tone.MonoSynth(),
    new Tone.MonoSynth(),
    new Tone.MonoSynth(),
    new Tone.MonoSynth(),
    new Tone.MonoSynth(),
    new Tone.MonoSynth(),
    new Tone.MonoSynth(),
    new Tone.MonoSynth(),
    new Tone.MonoSynth()
]

var bassSynth = new Tone.Synth({
    oscillator: {
        type: 'triangle4'
    },
    envelope: {
        attack: 0.001,
        decay: 0,
        sustain: 1,
        release: 0.5
    }
}).toMaster()

const bassSynths = [
    bassSynth,
    bassSynth,
    bassSynth,
    bassSynth,
    bassSynth,
    bassSynth,
    bassSynth,
    bassSynth,
    bassSynth,
    bassSynth,
    bassSynth,
    bassSynth
]

const allNotes = [
    'C',
    'C#',
    'D',
    'Eb',
    'E',
    'F',
    'F#',
    'G',
    'Ab',
    'A',
    'Bb',
    'B'
]

let octave = 3;

function instrumentVolume(sliderName, synthName) {
    $(sliderName).on('input', function () {
        synthName.forEach(synth => synth.volume.value = $(sliderName).val());
    });
}

const instruments = SampleLibrary.load({
    instruments: ["guitar-nylon", "guitar-acoustic", "piano", "cello", "contrabass", "saxophone", "harmonium"]
});

// instruments["piano"].toMaster();

// instruments.forEach(instrument => instrument.toMaster());

for (var key in instruments) {
    instruments[key].toMaster();
}

$('.testThisShit').on('click', function () {
    instruments["guitar-acoustic"].triggerAttackRelease('B2');
    console.log('testing');
});

instrumentVolume('#drumsVolumeSlider', drums);
instrumentVolume('#synthVolumeSlider', synths);
instrumentVolume('#bassVolumeSlider', bassSynths);

var gain = new Tone.Gain(0.4);
gain.toMaster();
drums.forEach(drum => drum.toMaster());
bassSynths.forEach(bass => bass.toMaster());
// drums.forEach(drum => drum.connect(gain));
synths.forEach(synth => synth.connect(gain));



let index = 0;

Tone.context.lookAhead = 0;

function playListener() {
    $('#playButton').click(function () {
        Tone.Transport.start();
        Tone.Transport.scheduleRepeat(repeat, '8n');
        removeListener($('#playButton'));
    });
}

playListener();

function repeat(time) {
    repeater(drums, "drums");
    repeater(synths, "synths");
    // repeater(bassSynths, "bassSynths");
    index++;

}

let instrumentSelect = $('#instrumentOptionSelect').val();

$('#instrumentOptionSelect').on('change', function () {
    instrumentSelect = $('#instrumentOptionSelect').val();
})

$('.instrumentOctave select').on('change', function () {
    octave = $('.instrumentOctave select').val();
})

let noteTime = 1800 / tempo.val();

function repeater(notes, notesString) {
    let step = index % beatCountValue;
    let bpm = tempo.val();
    let bpmCount = 30000 / bpm;
    for (var i = 0; i < notes.length; i++) {
        let note = notes[i],
            beat = $(`#${notesString}${i+1} .beat${step + 1}`);
        if (beat.hasClass('on')) {
            if (notes === drums) {
                note.start();
            } else if (notes === bassSynths) {
                note.triggerAttackRelease(allNotes[i] + "2", "8n");
            } else {
                note.triggerAttackRelease(allNotes[i] + octave, "8n");
            }
            beat.toggleClass('onPlaying');
            setTimeout(() => {
                beat.removeClass('onPlaying');
            }, bpmCount);
        } else {
            beat.toggleClass('offPlaying');
            setTimeout(() => {
                beat.removeClass('offPlaying');
            }, bpmCount);
        }
    }
}

var beatCount = document.getElementById('beatCount');
var beatCountValue = beatCount.value;

function drawQuarterNotes(soundType, count) {
    let currentBeatCount = $('#drums1 .clickBeat').length;
    for (let y = 1; y <= count; y++) {
        for (let x = 1; x <= beatCountValue; x++) {
            $(soundType + y).append(`<div class="clickBeat beat${x}"></div>`);
            if ((x - 1) % 4 === 0) {
                $('.beat' + x).addClass('emphasize');
            }
        }
    }
}
drawQuarterNotes('#drums', 7);
drawQuarterNotes('#synths', 12);
drawQuarterNotes('#polySynths', 12);
drawQuarterNotes('#bassSynths', 12);



const addListener = function (element) {
    $(element).click(function () {
        $(this).toggleClass('on');
    });
}

const removeListener = function (element) {
    $(element).off('click');
}

addListener('.clickBeat');

var beatCountChange = function (i) {
    let oldBeatCount = $(`#drums1 .clickBeat`).length;
    beatCountValue = beatCount.value;
    if (oldBeatCount < beatCountValue) {
        for (let x = oldBeatCount + 1; x <= beatCountValue; x++) {
            if (x == 1 || (x - 1) % 4 == 0) {
                $('#drums' + i).append(`<div class="clickBeat beat${x} emphasize"></div>`)
            } else {
                $('#drums' + i).append(`<div class="clickBeat beat${x}"></div>`)
            }
        }
    } else if (oldBeatCount > beatCountValue) {
        for (let x = oldBeatCount; x > beatCountValue; x--) {
            $('.beat' + x).remove();
        }
    }
}

var beatCountChange = function (soundType) {
    let oldBeatCount = $(`#${soundType}1 .clickBeat`).length;
    beatCountValue = beatCount.value;
    for (let d = 1; d <= oldBeatCount; d++) {
        if (oldBeatCount < beatCountValue) {
            for (let x = oldBeatCount + 1; x <= beatCountValue; x++) {
                if (x == 1 || (x - 1) % 4 == 0) {
                    $(`#${soundType}${d}`).append(`<div class="clickBeat beat${x} emphasize"></div>`)
                } else {
                    $(`#${soundType}${d}`).append(`<div class="clickBeat beat${x}"></div>`)
                }
            }
        } else if (oldBeatCount > beatCountValue) {
            for (let x = oldBeatCount; x > beatCountValue; x--) {
                $('.beat' + x).remove();
            }
        }
    }

}

$('#beatCount').on('change', function () {
    beatCountChange('drums');
    beatCountChange('synths');
    beatCountChange('polySynths');
    beatCountChange('bassSynths');
    removeListener('.clickBeat');
    addListener('.clickBeat');
    $('.player').attr("overflow-x", "hidden");
    setTimeout(() => {
        $('.player').css("overflow-x", "scroll");
    }, 1)
});


$('#stopButton').click(function () {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    index = 0;
    playListener();
});

$('#clearButton').click(function () {
    console.log(beatCountValue);
    for (let x = 1; x <= beatCountValue; x++) {
        $('.beat' + x).removeClass('on');
    }
})