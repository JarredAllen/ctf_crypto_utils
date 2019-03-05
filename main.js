import { decode_caesar } from './substitution.js';
import { decode_vigenere } from './vigenere.js';

// The main function to run to analyze whatever text is inputted
window.magic = function () {
    // Read the user input
    var ciphertext = document.getElementById("ciphertext-input").value;

    console.log("-------------------------------------------------------------");
    console.log("Ciphertext:\n"+ciphertext);

    // Setting constants for the functions
    var ioc_cutoff = 0.050;
    
    // Set a variable to store the output message in.
    var message = "---";
    var key = "-";

    // Check if it's a simple substitution cipher
    var simple = (index_of_coincidence(ciphertext, 1) > ioc_cutoff);
    if (simple) {
        console.log("It's a simple substitution cipher.");
        var decode = decode_caesar(ciphertext);
        key = decode[0]
        message = decode[1];
    }
    else {
        console.log("This was not encrypted with a simple substitution cipher");
        build_ioc_table(ciphertext);
    }
    console.log("The key used was: "+key);
    console.log("The original message was:\n"+message);
}

function clean_text(text) {
    // Remove everything that isn't a letter
    // and make all the letters lower-case
    return text.toLowerCase().replace(/\W/g, '');
}

function build_ioc_table(ciphertext, ioc_cutoff) {
    // Build a table with all the indexes of coincidence and display it on
    // the page.
    document.getElementById("missing-message").style.display = "none";
    document.getElementById("universal-analysis").style.display = "block";
    var table = document.getElementById("ioc-table");
    table.innerHTML = "<tr><th>Length</th><th>Index of Coincidence</th></tr>";
    var iocs = Array(likely_index_of_coincidence(ciphertext, ioc_cutoff));
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
    console.log(iocs);
    for (var i=1; i<=iocs.length; i++) {
        var row = table.rows[i];
        var cell = row.insertCell(2);
        var width = Math.round(iocs[i-1]/maxIoc*95);
        cell.innerHTML = "<div style=\"width:" + width+"%;\" "
                         + "class=\"bar-div blue\"></div>";
        cell.width="100%";
    }
}

function index_of_coincidence(message, length) {
    message = clean_text(message);
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
        for (var i=0; i<length; i++) {
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

function likely_index_of_coincidence(text, ioc_cutoff) {
    text = text.toLowerCase().replace(/\W/g, '');
    for(var t=1; t < text.length/8; t++) {
        if (index_of_coincidence(text, t) > ioc_cutoff) {
            return t;
        }
    }
}

