var keyData = {
    d: {
        sound: new Howl({
            src: ['/audio/test/kick.wav']
        })
    },
    f: {
        sound: new Howl({
            src: ['/audio/test/clap.wav']
        })
    },
    j: {
        sound: new Howl({
            src: ['/audio/test/cymbol.wav']
        })
    },
    k: {
        sound: new Howl({
            src: ['/audio/test/hihat.wav']
        })
    }
};

document.addEventListener('keydown', (event) => {
    var key = event.key || event.keyCode;
    if (keyData[key]) {
        keyData[key].sound.play();
    }
});

$('#box1').on("mousedown", function () {
    keyData['d'].sound.play();
});

$('#box2').on("mousedown", function () {
    keyData['f'].sound.play();
});

$('#box3').on("mousedown", function () {
    keyData['j'].sound.play();
});

$('#box4').on("mousedown", function () {
    keyData['k'].sound.play();
});