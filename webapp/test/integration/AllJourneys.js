sap.ui.define([
	"sap/ui/test/Opa5",
	"./arrangements/Arrangement",
	"./WorklistJourney",
	"./NavigationJourney",
	"./NotFoundJourney",
	"./ObjectJourney",
	"./FLPIntegrationJourney"
], function (Opa5, Arrangement) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Arrangement(),
		viewNamespace: "de.robertwitt.demo.epm.salesordercockpit.view.",
		autoWait: true
	});

});