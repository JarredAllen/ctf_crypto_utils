function magic() {
    ciphertext_input = document.getElementById("ciphertext-input");
    ciphertext = ciphertext_input.value;//.toLowerCase().replace(/\W/g, '');

    key = vigenere_key_crack(ciphertext);
    console.log(vigenere_decode(ciphertext, key));
}
function build_ioc_table(ciphertext) {
    document.getElementById("missing-message").style.display = "none";
    document.getElementById("universal-analysis").style.display = "block";
    var table = document.getElementById("ioc-table");
    table.innerHTML = "<tr><th>Length</th><th>Index of Coincidence</th></tr>";
    var iocs = Array(likely_index_of_coincidence(ciphertext));
    var maxIoc = 0;
    for (var i=0; i<iocs.length; i++) {
        var row = table.insertRow(-1);
        row.insertCell(0).innerHTML = ""+(i+1);
        iocs[i] = index_of_coincidence(ciphertext, i+1);
        row.insertCell(1).innerHTML = ""+iocs[i];
        if (iocs[i] > maxIoc) {
            maxIoc = iocs[i]
        }
    }
    for (var i=1; i<=iocs.length; i++) {
        var row = table.rows[i];
        var cell = row.insertCell(2);
        var width = Math.round(iocs[i-1]/maxIoc*95);
        cell.innerHTML = "<div style=\"width:" + width+"%;\" "
                         + "class=\"bar-div blue\"></div>";
        console.log(cell.innerHTML);
        cell.width="100%";
    }
}

function clean_text(text) {
    return text.toLowerCase().replace(/\W/g, '');
}

function index_of_coincidence(message, length) {
    message = message.toLowerCase().replace(/\W/g, '');
    if (length == 1) {
        var count = 0;
        for (var i=0; i<message.length; i++) {
            for (var j=0; j<message.length; j++) {
                if (i == j) {
                    continue;
                }
                if (message.charAt(i) == message.charAt(j)) {
                    count++;
                }
            }
        }
        return count / message.length / (message.length - 1);
    }
    else {
        var strings = Array(length);
        for (var i=0; i<message.length; i++) {
            strings[i] = "";
        }
        for (var i = 0; i<message.length; i++) {
            strings[i%length] += message.charAt(i);
        }
        var sum = 0;
        for (var i=0; i<length; i++) {
            sum += index_of_coincidence(strings[i], 1);
        }
        return sum / length;
    }
}

function likely_index_of_coincidence(text) {
    text = text.toLowerCase().replace(/\W/g, '');
    for(var t=1; true; t++) {
        if (index_of_coincidence(text, t) > 0.060) {
            return t;
        }
    }
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

function vigenere_key_crack(ciphertext) {
    ciphertext = clean_text(ciphertext);
    var keylen = likely_index_of_coincidence(ciphertext);
    var slots = Array(keylen);
    for (var i=0; i<keylen; i++) {
        slots[i] = "";
    }
    for (var i=0; i<ciphertext.length; i++) {
        slots[i%keylen] += ciphertext.charAt(i);
    }
    key = '';
    for (var i=0; i<keylen; i++) {
        key += String.fromCharCode(97+26-correct_caesar_shift_amount(slots[i]));
    }
    return key.replace(/\{/g, 'a');
}

function vigenere_encode(ciphertext, key) {
    var out = "";
    var ki = 0;
    for (var i=0; i<ciphertext.length; i++) {
        var c = ciphertext.charCodeAt(i);
        var k = key.charCodeAt(ki);
        if (96<c && 123>c) {
            out += String.fromCharCode((c+k-97*2)%26+97);
            ki = (ki+1)%key.length;
            continue;
        }
        else if (64<c && 91>c) {
            out += String.fromCharCode((c+k-97-26)%26+65);
            ki = (ki+1)%key.length;
            continue;
        }
        else {
            out += String.fromCharCode(c);
        }
    }
}

function vigenere_decode(ciphertext, key) {
    var out = "";
    var ki = 0;
    for (var i=0; i<ciphertext.length; i++) {
        var c = ciphertext.charCodeAt(i);
        var k = key.charCodeAt(ki);
        if (96<c && 123>c) {
            out += String.fromCharCode((c-k+26)%26+97);
            ki = (ki+1)%key.length;
            continue;
        }
        else if (64<c && 91>c) {
            out += String.fromCharCode((c-k+97-65+26)%26+65);
            ki = (ki+1)%key.length;
            continue;
        }
        else {
            out += String.fromCharCode(c);
        }
    }
    return out;
}

