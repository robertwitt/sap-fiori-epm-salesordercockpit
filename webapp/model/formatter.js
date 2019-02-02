sap.ui.define([
	"de/robertwitt/demo/epm/salesordercockpit/model/constants"
], function (constants) {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function (sValue) {
			if (!sValue) {
				return "";
			}
			// return parseFloat(sValue).toFixed(2);
			var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
				minFractionDigits: 2,
				maxFractionDigits: 2
			});
			return oNumberFormat.format(sValue);
		},

		/**
		 * Returns the value state based on a sales order's lifecycle status
		 * @public
		 * @param {string} sLifecycleStatus a sales order's lifecycle status
		 * @returns {sap.ui.core.ValueState} a value state
		 */
		objectStatusValueState: function (sLifecycleStatus) {
			switch (sLifecycleStatus) {
			case constants.salesOrder.lifecycleStatus.new:
				return sap.ui.core.ValueState.Error;
			case constants.salesOrder.lifecycleStatus.inProgress:
				return sap.ui.core.ValueState.Warning;
			case constants.salesOrder.lifecycleStatus.closed:
				return sap.ui.core.ValueState.Success;
			default:
				return sap.ui.core.ValueState.None;
			}
		},

		/**
		 * Returns an icon URI based on a sales order's lifecycle status
		 * @public
		 * @param {string} sLifecycleStatus a sales order's lifecycle status
		 * @returns {string} an icon URI
		 */
		objectStatusIcon: function (sLifecycleStatus) {
			switch (sLifecycleStatus) {
			case constants.salesOrder.lifecycleStatus.new:
				return "sap-icon://status-error";
			case constants.salesOrder.lifecycleStatus.inProgress:
				return "sap-icon://status-in-process";
			case constants.salesOrder.lifecycleStatus.closed:
				return "sap-icon://status-completed";
			case constants.salesOrder.lifecycleStatus.canceled:
				return "sap-icon://status-inactive";
			default:
				return "sap-icon://sales-order";
			}
		},

		/**
		 * Returns true if the goods issue is possible for specified lifecycle
		 * status and delivery status
		 * @public
		 * @param {string} sLifecycleStatus a sales order's lifecycle status
		 * @param {string} sDeliveryStatus a sales order's delivery status
		 * @returns {boolean} true if goods issue is possible
		 */
		goodsIssuePossible: function (sLifecycleStatus, sDeliveryStatus) {
			return sLifecycleStatus === constants.salesOrder.lifecycleStatus.inProgress && sDeliveryStatus !== constants.salesOrder.deliveryStatus
				.delivered;
		},

		/**
		 * Returns true if the invoice can be created for specified lifecycle
		 * status and delivery status
		 * @public
		 * @param {string} sLifecycleStatus a sales order's lifecycle status
		 * @param {string} sDeliveryStatus a sales order's delivery status
		 * @param {string} sBillingStatus a sales order's billing status
		 * @returns {boolean} true if invoicing is possible
		 */
		invoicePossible: function (sLifecycleStatus, sDeliveryStatus, sBillingStatus) {
			return sLifecycleStatus === constants.salesOrder.lifecycleStatus.inProgress &&
				sDeliveryStatus === constants.salesOrder.deliveryStatus.delivered &&
				sBillingStatus !== constants.salesOrder.billingStatus.paid;
		},

		/**
		 * Returns true if a sales order with specified lifecycle status can be confirmed
		 * @public
		 * @param {string} sLifecycleStatus a sales order's lifecycle status
		 * @returns {boolean} true if confirmation is possible
		 */
		confirmPossible: function (sLifecycleStatus) {
			return sLifecycleStatus === constants.salesOrder.lifecycleStatus.new;
		},

		/**
		 * Returns true if a sales order with specified lifecycle status can be cancelled
		 * @public
		 * @param {string} sLifecycleStatus a sales order's lifecycle status
		 * @param {string} sDeliveryStatus a sales order's delivery status
		 * @returns {boolean} true if cancellation is possible
		 */
		cancelPossible: function (sLifecycleStatus, sDeliveryStatus) {
			return sLifecycleStatus === constants.salesOrder.lifecycleStatus.inProgress && sDeliveryStatus !== constants.salesOrder.deliveryStatus
				.delivered;
		}

	};

});