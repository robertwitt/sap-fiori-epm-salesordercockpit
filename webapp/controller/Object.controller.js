/*global location*/
sap.ui.define([
	"de/robertwitt/demo/epm/salesordercockpit/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"de/robertwitt/demo/epm/salesordercockpit/model/formatter"
], function (BaseController, JSONModel, History, formatter) {
	"use strict";

	return BaseController.extend("de.robertwitt.demo.epm.salesordercockpit.controller.Object", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function () {
			var oViewModel = this.getModel("objectView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		},

		/**
		 * Event handler of goods issue button. Performs the goods issue for
		 * the bound sales order object.
		 * @public
		 */
		onGoodsIssuePressed: function () {
			this._processSalesOrder("/SalesOrder_GoodsIssueCreated", this.getResourceBundle().getText("goodsIssueMessage"));
		},

		/**
		 * Event handler of invoice button. Creates the invoice for the bound
		 * sales order object.
		 * @public
		 */
		onInvoicePressed: function () {
			this._processSalesOrder("/SalesOrder_InvoiceCreated", this.getResourceBundle().getText("invoiceMessage"));
		},

		/**
		 * Event handler of confirm button. Closes the bound sales order object.
		 * @public
		 */
		onConfirmPressed: function () {
			this._processSalesOrder("/SalesOrder_Confirm", this.getResourceBundle().getText("confirmMessage"));
		},

		/**
		 * Event handler of cancel button. Cancels the bound sales order object.
		 * @public
		 */
		onCancelPressed: function () {
			this._processSalesOrder("/SalesOrder_Cancel", this.getResourceBundle().getText("cancelMessage"));
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function (oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("SalesOrderSet", {
					SalesOrderID: sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function (sObjectPath) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				parameters: {
					expand: "ToLineItems,ToLineItems/ToProduct"
				},
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oDataModel.metadataLoaded().then(function () {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function () {
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.SalesOrderID,
				sObjectName = oObject.SalesOrderID;

			oViewModel.setProperty("/busy", false);
			// Add the object page to the flp routing history
			this.addHistoryEntry({
				title: this.getResourceBundle().getText("objectTitle") + " - " + sObjectName,
				icon: "sap-icon://enter-more",
				intent: "#SalesOrderCockpit-display&/SalesOrderSet/" + sObjectId
			});

			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		},

		/**
		 * Calls a function import of the OData model and displays 
		 * specified message if successful.
		 * @private
		 * @param {string} sFunctionName name of a function import
		 * @param {string} sSuccessMessage text to be displayed as toast in success case
		 */
		_processSalesOrder: function (sFunctionName, sSuccessMessage) {
			var oViewModel = this.getModel("objectView");
			oViewModel.setProperty("/busy", true);
			var sSalesOrderId = this.getView().getBindingContext().getObject().SalesOrderID;
			this.getModel().callFunction(sFunctionName, {
				method: "POST",
				urlParameters: {
					SalesOrderID: sSalesOrderId
				},
				success: function () {
					oViewModel.setProperty("/busy", false);
					sap.m.MessageToast.show(sSuccessMessage);
				},
				error: function () {
					oViewModel.setProperty("/busy", false);
				}
			});
		}

	});

});