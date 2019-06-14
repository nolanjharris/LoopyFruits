document.documentElement.addEventListener('mousedown', () => {
    if (Tone.context.state !== 'running') Tone.context.resume();
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


// const polySynths = [
//     new Tone.PolySynth(4, Tone.Synth).chain(distortion, tremolo, Tone.Master),
//     new Tone.PolySynth(4, Tone.Synth).chain(distortion, tremolo, Tone.Master),
//     new Tone.PolySynth(4, Tone.Synth).chain(distortion, tremolo, Tone.Master),
//     new Tone.PolySynth(4, Tone.Synth).chain(distortion, tremolo, Tone.Master),
//     new Tone.PolySynth(4, Tone.Synth).chain(distortion, tremolo, Tone.Master),
//     new Tone.PolySynth(4, Tone.Synth).chain(distortion, tremolo, Tone.Master),
//     new Tone.PolySynth(4, Tone.Synth).chain(distortion, tremolo, Tone.Master),
//     new Tone.PolySynth(4, Tone.Synth).chain(distortion, tremolo, Tone.Master),
//     new Tone.PolySynth(4, Tone.Synth).chain(distortion, tremolo, Tone.Master),
//     new Tone.PolySynth(4, Tone.Synth).chain(distortion, tremolo, Tone.Master),
//     new Tone.PolySynth(4, Tone.Synth).chain(distortion, tremolo, Tone.Master),
//     new Tone.PolySynth(4, Tone.Synth).chain(distortion, tremolo, Tone.Master)
// ]

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

const bassSynths = [
    new Tone.PluckSynth(),
    new Tone.PluckSynth(),
    new Tone.PluckSynth(),
    new Tone.PluckSynth(),
    new Tone.PluckSynth(),
    new Tone.PluckSynth(),
    new Tone.PluckSynth(),
    new Tone.PluckSynth(),
    new Tone.PluckSynth(),
    new Tone.PluckSynth(),
    new Tone.PluckSynth(),
    new Tone.PluckSynth()
]

const allNotes = [
    'C3',
    'C#3',
    'D3',
    'Eb3',
    'E3',
    'F3',
    'F#3',
    'G3',
    'Ab3',
    'A3',
    'Bb3',
    'B3'
]


var gain = new Tone.Gain(0.15);
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
    // repeater(polySynths, "polySynths");
    repeater(bassSynths, "bassSynths");
    index++;

}

// function drumRepeater() {
//     let step = index % beatCountValue;
//     for (var i = 0; i < drums.length; i++) {
//         let drum = drums[i],
//             beat = $(`#drums${i+1} .beat${step + 1}`);
//         if (beat.hasClass('on')) {
//             drum.start();
//             beat.toggleClass('onPlaying');
//             setTimeout(() => {
//                 beat.removeClass('onPlaying');
//             }, 250);
//         } else {
//             beat.toggleClass('offPlaying');
//             setTimeout(() => {
//                 beat.removeClass('offPlaying');
//             }, 250);
//         }
//     }
//     index++;
// }

function repeater(notes, notesString) {
    let step = index % beatCountValue;
    for (var i = 0; i < notes.length; i++) {
        let note = notes[i],
            beat = $(`#${notesString}${i+1} .beat${step + 1}`);
        if (beat.hasClass('on')) {
            if (notes === drums) {
                note.start();
            } else {
                note.triggerAttackRelease(allNotes[i], "8n");
            }
            beat.toggleClass('onPlaying');
            setTimeout(() => {
                beat.removeClass('onPlaying');
            }, 250);
        } else {
            beat.toggleClass('offPlaying');
            setTimeout(() => {
                beat.removeClass('offPlaying');
            }, 250);
        }
    }
}

var beatCount = document.getElementById('beatCount');
var beatCountValue = beatCount.value;

function drawQuarterNotes(soundType, count) {
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
    let oldBeatCount = $(`#drums${i} .clickBeat`).length;
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

$('#beatCount').on('change', function () {
    for (let x = 1; x <= 7; x++) {
        beatCountChange(x);
    }
    removeListener('.clickBeat');
    addListener('.clickBeat');
    $('.player').attr("overflow-x", "hidden");
    setTimeout(() => {
        $('.player').css("overflow-x", "scroll");
    }, 1)
})

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