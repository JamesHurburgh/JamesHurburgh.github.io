themes = [
    { "Name": "Bootstrap", "Path": "css/bootstrap.min.css" },
    { "Name": "Cerulean", "Path": "css/bootstrap.cerulean.min.css" },
    { "Name": "Cosmo", "Path": "css/bootstrap.cosmo.min.css" },
    { "Name": "Cyborg", "Path": "css/bootstrap.cyborg.min.css" },
    { "Name": "Darkly", "Path": "css/bootstrap.darkly.min.css" },
    { "Name": "Flatly", "Path": "css/bootstrap.flatly.min.css" },
    { "Name": "Journal", "Path": "css/bootstrap.journal.min.css" },
    { "Name": "Lumen", "Path": "css/bootstrap.lumen.min.css" },
    { "Name": "Paper", "Path": "css/bootstrap.paper.min.css" },
    { "Name": "Readable", "Path": "css/bootstrap.readable.min.css" },
    { "Name": "Sandstone", "Path": "css/bootstrap.sandstone.min.css" },
    { "Name": "Simplex", "Path": "css/bootstrap.simplex.min.css" },
    { "Name": "Slate", "Path": "css/bootstrap.slate.min.css" },
    { "Name": "Spacelab", "Path": "css/bootstrap.spacelab.min.css" },
    { "Name": "Superhero", "Path": "css/bootstrap.superhero.min.css" },
    { "Name": "United", "Path": "css/bootstrap.united.min.css" },
    { "Name": "Yeti", "Path": "css/bootstrap.yeti.min.css" }
];

function bootswitch(placeholderElement) {
    // TODO add config
    placeholderElement = document.getElementById(placeholderElement);
    // Add Base theme
    injectBootStrapDependencies();
    // Add Drop down list
    var bootSwitcher = addBootSwitchDropDown(placeholderElement);
    var selectedTheme = getCookie("bootSwitchTheme");
    // Fill Drop down with options
    populateBootSwitcher(bootSwitcher, selectedTheme);
    // Wire event handler
    wireOnChangeEvent(bootswitcher);
}

function injectBootStrapDependencies() {
    var headElement = document.getElementsByTagName("head")[0];

    var bootStrapCss = document.createElement("link");
    bootStrapCss.setAttribute("id", "bootswitchstyle");
    bootStrapCss.setAttribute("rel", "stylesheet");
    bootStrapCss.setAttribute("type", "text/css");
    bootStrapCss.setAttribute("href", "css/bootstrap.min.css");
    headElement.appendChild(bootStrapCss);

    // var jQueryJs = document.createElement("script");
    // jQueryJs.setAttribute("src", "js/jquery-2.2.4.min.js");
    // headElement.appendChild(jQueryJs);

    var bootStrapJs = document.createElement("script");
    bootStrapJs.setAttribute("src", "js/bootstrap.min.js");
    headElement.appendChild(bootStrapJs);
}

function addBootSwitchDropDown(placeholderElement) {
    placeholderElement.innerHTML += "<select id='bootSwitchSelect' class='form-control input-sm'></select>";
    return document.getElementById('bootSwitchSelect');
}

function populateBootSwitcher(bootSwitcher, selectedTheme) {
    themes.forEach(function(theme) {
        if (theme.Name == selectedTheme) {
            bootSwitcher.innerHTML += "<option selected='true' value='" + theme.Path + "'>" + theme.Name + "</option>";
            setTheme(theme.Name, theme.Path);
        } else {
            bootSwitcher.innerHTML += "<option value='" + theme.Path + "'>" + theme.Name + "</option>";
        }
    }, this);
}

function wireOnChangeEvent(bootswitcher) {
    bootswitcher.onchange = (event) => {
        setTheme(event.srcElement.options[event.srcElement.selectedIndex].text, event.srcElement.value);
    }
}

function setTheme(name, path) {
    setCookie("bootSwitchTheme", name, 365);
    changeCSSFile(path);
}

function changeCSSFile(cssPath) {
    var linkObject = document.getElementById("bootswitchstyle");
    linkObject.setAttribute("href", cssPath);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}