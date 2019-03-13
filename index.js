function load(name) {
    var par = document.getElementById("index-child-page");
    var found = false;
    for (var i=0; i < par.children.length; i++) {
        child = par.children[i]
        if (child.id.indexOf(name) >= 0) {
            child.hidden = false;
            found = true;
        }
        else {
            child.hidden = true;
        }
    }
    return found;
}

