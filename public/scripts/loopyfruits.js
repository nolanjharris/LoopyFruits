var loopySounds = {
    kick: {
        sound: new Howl({
            src: ['/audio/test/kick.wav']
        })
    },
    clap: {
        sound: new Howl({
            src: ['/audio/test/clap.wav']
        })
    },
    cymbol: {
        sound: new Howl({
            src: ['/audio/test/cymbol.wav']
        })
    },
    hihat: {
        sound: new Howl({
            src: ['/audio/test/hihat.wav']
        })
    }
};

Howler.autoUnlock = false;

var selectInstrument1 = document.getElementById('loopyFruits1');
var selectInstrument2 = document.getElementById('loopyFruits2');
var selectInstrument3 = document.getElementById('loopyFruits3');
var selectInstrument4 = document.getElementById('loopyFruits4');
var instrumentValue1 = selectInstrument1.value;
var instrumentValue2 = selectInstrument2.value;
var instrumentValue3 = selectInstrument3.value;
var instrumentValue4 = selectInstrument4.value;
var beatCount = document.getElementById('beatCount');
var beatCountValue = beatCount.value;
var interval = 0;
console.log(beatCountValue);

for (let y = 1; y <= 4; y++) {
    for (let x = 1; x <= beatCountValue; x++) {
        $('#instrument' + y).append(`<div class="clickBeat beat${x}"></div>`);
    }
}

for (let x = 1; x < beatCountValue; x += 4) {
    $('.beat' + x).toggleClass('emphasize');
}

const addListener = function (element) {
    $(element).click(function () {
        $(this).toggleClass('on');
    });
}

const removeListener = function (element) {
    $(element).off('click');
}

addListener('.clickBeat');

$('#loopyFruits').on('change', function () {
    instrumentValue = selectInstrument.value;
    for (let x = 1; x <= beatCountValue; x++) {
        $('.beat' + x).removeClass('on');
    }
});

var beatCountChange = function (i) {
    let oldBeatCount = $(`#instrument${i} .clickBeat`).length;
    beatCountValue = beatCount.value;
    if (oldBeatCount < beatCountValue) {
        for (let x = oldBeatCount + 1; x <= beatCountValue; x++) {
            if (x == 1 || (x - 1) % 4 == 0) {
                $('#instrument' + i).append(`<div class="clickBeat beat${x} emphasize"></div>`)
            } else {
                $('#instrument' + i).append(`<div class="clickBeat beat${x}"></div>`)
            }
        }
    } else if (oldBeatCount > beatCountValue) {
        for (let x = oldBeatCount; x > beatCountValue; x--) {
            $('.beat' + x).remove();
        }
    }
}

var playerWidth = $('.player').width();

// $("name-of-your-div").getNiceScroll().onResize()

$('#beatCount').on('change', function () {
    beatCountChange(1);
    beatCountChange(2);
    beatCountChange(3);
    beatCountChange(4);
    removeListener('.clickBeat');
    addListener('.clickBeat');
    $('.player').attr("overflow-x", "hidden");
    setTimeout(() => {
        $('.player').css("overflow-x", "scroll");
    }, 1)
})

var play = function (i, x) {
    if ($(`#instrument${i} .beat${x}`).hasClass('on')) {
        setTimeout(() => {
            loopySounds[eval(`instrumentValue${i}`)].sound.play();
            $(`#instrument${i} .beat${x}`).toggleClass('onPlaying');
            setTimeout(() => {
                $(`#instrument${i} .beat${x}`).removeClass('onPlaying');
            }, 250);
        }, interval);
    } else {
        setTimeout(() => {
            $(`#instrument${i} .beat${x}`).toggleClass('offPlaying');
            setTimeout(() => {
                $(`#instrument${i} .beat${x}`).removeClass('offPlaying');
            }, 250);
        }, interval);
    }
}

var playListener = function () {
    $('#playButton').click(function () {
        removeListener('#playButton');
        interval = 0;
        for (let x = 1; x <= beatCountValue; x++) {
            play(1, x);
            play(2, x);
            play(3, x);
            play(4, x);
            interval += 250;
        }

        setTimeout(() => {
            playListener();
        }, interval);
        console.log(interval);
    });
}

playListener();

$('#stopButton').click(function () {
    var highestTimeoutId = setTimeout(";");
    for (var i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i);
    }
    for (var x = 1; x <= 4; x++) {
        for (var y = 1; y <= beatCountValue; y++) {
            $('#instrument' + x + ' .beat' + y).removeClass('onPlaying offPlaying');
        }
    }
    playListener();
});

$('#clearButton').click(function () {
    console.log(beatCountValue);
    for (let x = 1; x <= beatCountValue; x++) {
        $('.beat' + x).removeClass('on');
    }
})