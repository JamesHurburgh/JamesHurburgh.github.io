
referenceDataDefinitionList = [{
		"Name" : "arcanum",
		"Path" : "data/arcanum.json"
	},
	{
		"Name" : "sourceBooks",
		"Path" : "data/sourceBooks.json"
	},
	{
		"Name" : "spells",
		"Path" : "data/spells.json"
	},
	{
		"Name" : "glossary",
		"Path" : "data/glossary.json"
	}
];

function loadJson(url, callback) {
	$.ajax({
		url : url,
		beforeSend : function (xhr) {
			if (xhr.overrideMimeType) {
				xhr.overrideMimeType("application/json");
			}
		},
		dataType : 'json',
		async : true,
		data : null,
		error : function (xhr, status) {
			alert(status);
		},
		success : function (data, textStatus, request) {
			callback(data);
		}
	});
}

function getData(dataName, callback) {
	
	$(referenceDataDefinitionList).each(function (index, referenceDataDefinition) {
		if(referenceDataDefinition.Name == dataName){
			if(!referenceDataDefinition.Data){
				loadJson(referenceDataDefinition.Path, function (data){
					referenceDataDefinition.Data = data;
					callback(data);
				});
			}else{
				callback(data);
			}
		}
	});
}
