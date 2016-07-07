//requirejs(["thirdParty/store.min"], function(util) {
    //This function is called when scripts/helper/util.js is loaded.
    //If util.js calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "helper/util".

	themes = [
		{ "Name" : "Cerulean", "Path" : "css/bootstrap.cerulean.min.css"},
		{ "Name" : "Cosmo", "Path" : "css/bootstrap.cosmo.min.css"},
		//{ "Name" : "Cyborg", "Path" : "css/bootstrap.cyborg.min.css"},
		//{ "Name" : "Darkly", "Path" : "css/bootstrap.darkly.min.css"},
		{ "Name" : "Flatly", "Path" : "css/bootstrap.flatly.min.css"},
		{ "Name" : "Journal", "Path" : "css/bootstrap.journal.min.css"},
		{ "Name" : "Lumen", "Path" : "css/bootstrap.lumen.min.css"},
		{ "Name" : "Paper", "Path" : "css/bootstrap.paper.min.css"},
		{ "Name" : "Readable", "Path" : "css/bootstrap.readable.min.css"},
		{ "Name" : "Sandstone", "Path" : "css/bootstrap.sandstone.min.css"},
		{ "Name" : "Simplex", "Path" : "css/bootstrap.simplex.min.css"},
		//{ "Name" : "Slate", "Path" : "css/bootstrap.slate.min.css"},
		{ "Name" : "Spacelab", "Path" : "css/bootstrap.spacelab.min.css"},
		//{ "Name" : "Superhero", "Path" : "css/bootstrap.superhero.min.css"},
		{ "Name" : "United", "Path" : "css/bootstrap.united.min.css"},
		{ "Name" : "Yeti", "Path" : "css/bootstrap.yeti.min.css"}
	];

	var themeSelector;

	function theme(jQuerythemeSelector, defaultTheme){
		
		themeSelector = jQuerythemeSelector;
		// Add change handler
		themeSelector.change(function () {
			changeCSSFile(themeSelector.val());
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

	function changeCSSFile(cssFile) {
		var linkObject = $("#customCss");
    linkObject.attr("href", cssFile);
	}

//});