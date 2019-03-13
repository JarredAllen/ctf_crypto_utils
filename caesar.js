function run_caesar() {
    var target = document.getElementById('caesar-mode');
    var key = document.getElementById('caesar-key');
    var text = document.getElementById('caesar-input');
    if (key.value == '') {
        console.log('Unknown key, decrypting');
        var ans = decode_caesar(text.value);
        key.value = ans[0];
        text.value = ans[1];
        target.innerHTML = 'Encrypt';
        return true;
    }
    if (target.innerHTML = 'Decrypt') {
        console.log('Known key, decrypting');
        text.value = caesar_shift(text.value, 26-parseInt(key.value));
        caesar_mode_change();
        return true;
    }
    if (target.innerHTML = 'Encrypt') {
        console.log('Encrypting');
        text.value = caesar_shift(text.value, parseInt(key.value));
        caesar_mode_change();
        return true;
    }
    return false;
}
function caesar_mode_change() {
    var target = document.getElementById('caesar-mode');
    var key = document.getElementById('caesar-key').value;
    if (key == '') {
        return false;
    }
    if (target.innerHTML === 'Decrypt') {
        target.innerHTML = 'Encrypt';
    }
    else {
        target.innerHTML = 'Decrypt';
    }
    return true;
}

function decode_caesar(ciphertext) {
    // Decodes caesar-encrypted data and returns the output.
    var key = correct_caesar_shift_amount(ciphertext);
    return [key, caesar_shift(ciphertext, key)];
}

function frequency_dot_product(text) {
    // Computes the product of the square roots of the frequencies of each
    // letter in the given text with those of the English language.

    // This serves as a quick and convenient proxy for the correctness of
    // a decoding when the cipher is a simple substitution, as it will
    // return near 1 if the text has the same letter frequencies as English

    var english_frequencies = [0.08167, 0.01492, 0.02782, 0.04235, //d
                               0.12702, 0.02228, 0.02015, 0.06094, //h
                               0.06966, 0.00153, 0.00772, 0.04025, //l
                               0.02406, 0.06749, 0.07507, 0.01929, //p
                               0.00095, 0.05987, 0.06327, 0.09056, //t
                               0.02758, 0.00978, 0.02360, 0.00150, //x
                               0.01974, 0.00074];
    var text_counts = Array(26);
    var nonletter = 0;
    for (var i=0; i<26; i++) {
        text_counts[i] = 0;
    }
    for (var i=0; i<text.length; i++) {
        var c = text.charCodeAt(i);
        if (c>96 && c<123) {
            text_counts[c-97]++;
            continue;
        }
        if (c>64 && c<91) {
            text_counts[c-65]++;
            continue;
        }
        nonletter++;
    }
    var sum=0;
    for (var i=0; i<26; i++) {
        sum += Math.sqrt(english_frequencies[i])
                * Math.sqrt(text_counts[i]/(text.length-nonletter));
    }
    return sum;
}

function correct_caesar_shift_amount(ciphertext) {
    // Guesses at the correct caesar cipher shift by using the letter frequency
    // dot product. This will most likely work for large enough data sets.
    var bestScore = 0;
    var bestRot = -1;
    for (var i=0; i<26; i++) {
        var score = frequency_dot_product(caesar_shift(ciphertext, i));
        if (score > bestScore) {
            bestScore = score;
            bestRot = i;
        }
    }
    return bestRot;
}

function caesar_shift(ciphertext, rotation) {
    // Take text and rotate the letters around by the specified rotation.
    // To encrypt, the rotation should be the key
    // To decrypt, the rotation shouls be 26 minus the key
    var out = "";
    for (var i=0; i<ciphertext.length; i++) {
        var c = ciphertext.charCodeAt(i);
        if (96<c && 123>c) {
            out += String.fromCharCode((c-97+rotation)%26+97);
            continue;
        }
        if (64<c && 91>c) {
            out += String.fromCharCode((c-65+rotation)%26+65);
            continue;
        }
        out += String.fromCharCode(c);
    }
    return out;
}

