//requirejs(["thirdParty/store.min"], function(util) {
    //This function is called when scripts/helper/util.js is loaded.
    //If util.js calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "helper/util".

	themes = [
		{ "Name" : "Cerulean", "Path" : "ref/bootstrap.cerulean.min.css"},
		{ "Name" : "Cosmo", "Path" : "ref/bootstrap.cosmo.min.css"},
		//{ "Name" : "Cyborg", "Path" : "ref/bootstrap.cyborg.min.css"},
		//{ "Name" : "Darkly", "Path" : "ref/bootstrap.darkly.min.css"},
		{ "Name" : "Flatly", "Path" : "ref/bootstrap.flatly.min.css"},
		{ "Name" : "Journal", "Path" : "ref/bootstrap.journal.min.css"},
		{ "Name" : "Lumen", "Path" : "ref/bootstrap.lumen.min.css"},
		{ "Name" : "Paper", "Path" : "ref/bootstrap.paper.min.css"},
		{ "Name" : "Readable", "Path" : "ref/bootstrap.readable.min.css"},
		{ "Name" : "Sandstone", "Path" : "ref/bootstrap.sandstone.min.css"},
		{ "Name" : "Simplex", "Path" : "ref/bootstrap.simplex.min.css"},
		//{ "Name" : "Slate", "Path" : "ref/bootstrap.slate.min.css"},
		{ "Name" : "Spacelab", "Path" : "ref/bootstrap.spacelab.min.css"},
		//{ "Name" : "Superhero", "Path" : "ref/bootstrap.superhero.min.css"},
		{ "Name" : "United", "Path" : "ref/bootstrap.united.min.css"},
		{ "Name" : "Yeti", "Path" : "ref/bootstrap.yeti.min.css"}
	];

	var themeSelector;

	function theme(jQuerythemeSelector, defaultTheme){
		
		themeSelector = jQuerythemeSelector;
		// Add change handler
		themeSelector.change(function () {
			changeCSS(themeSelector.val(), 0);
			if(store != null && store.enabled){
				store.set('theme', themeSelector.find('option:selected').text());
			}
		});
		
		// Load the stored theme
		themeToLoad = defaultTheme;
		if(store != null && store.enabled){
			themeToLoad = store.get('theme') || defaultTheme;
		}
		
		// Fill drop down
		$(themes).each(function(index, theme) {
			themeSelector.append($("<option>").attr('value', theme.Path).text(theme.Name));
			if(theme.Name == themeToLoad){
				themeSelector.val(theme.Path);
				themeSelector.change();
			}
		});
				
	}	

	function changeCSS(cssFile, cssLinkIndex) {

		var oldlink = document.getElementsByTagName("link").item(cssLinkIndex);

		var newlink = document.createElement("link");
		newlink.setAttribute("rel", "stylesheet");
		newlink.setAttribute("type", "text/css");
		newlink.setAttribute("href", cssFile);

		document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
	}

//});