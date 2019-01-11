sap.ui.define([
		"de/robertwitt/demo/epm/salesordercockpit/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("de.robertwitt.demo.epm.salesordercockpit.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);