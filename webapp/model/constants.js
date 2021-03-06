sap.ui.define([], function () {
	"use strict";

	return {

		salesOrder: {

			lifecycleStatus: {
				none: " ",
				new: "N",
				inProgress: "P",
				closed: "C",
				canceled: "X"
			},
			
			deliveryStatus: {
				initial: "",
				delivered: "D"
			},
			
			billingStatus: {
				initial: "",
				paid: "P"
			}

		}

	};
});