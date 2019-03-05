export { decode_vigenere }
function vigenere_key_crack(ciphertext) {
    // Given a ciphertext encrypted via a Vigenere cipher, output a reasonable
    // guess at what the ciphertext is
    ciphertext = clean_text(ciphertext);
    var keylen = likely_index_of_coincidence(ciphertext, 0.05);
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

function encode_vigenere(ciphertext, key) {
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
    return out;
}

function decode_vigenere(ciphertext, key) {
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

