sap.ui.define([
	] , function () {
		"use strict";

		return {

			/**
			 * Rounds the number unit value to 2 digits
			 * @public
			 * @param {string} sValue the number string to be rounded
			 * @returns {string} sValue with 2 digits rounded
			 */
			numberUnit : function (sValue) {
				if (!sValue) {
					return "";
				}
				// return parseFloat(sValue).toFixed(2);
				var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
					minFractionDigits: 2,
					maxFractionDigits: 2
				});
				return oNumberFormat.format(sValue);
			}

		};

	}
);