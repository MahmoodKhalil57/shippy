/* eslint-disable */
/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */
/** @typedef {{}} Action_Cash_ApproveInputs */
/** @typedef {{}} Action_Cash_Approve_Call_BackInputs */
/** @typedef {{ title: NonNullable<unknown> }} Action_Cash_Approve_HeadingInputs */
/** @typedef {{ title: NonNullable<unknown> }} Action_Cash_ApprovedInputs */
/** @typedef {{ phone: NonNullable<unknown> }} Action_Cash_Call_Back_TextInputs */
/** @typedef {{}} Action_Cash_Called_BackInputs */
/** @typedef {{ decision: NonNullable<unknown>, name: NonNullable<unknown> }} Action_Cash_DecidedInputs */
/** @typedef {{}} Action_Cash_Note_OptionalInputs */
/** @typedef {{}} Action_Cash_Reason_RequiredInputs */
/** @typedef {{}} Action_Cash_RejectInputs */
/** @typedef {{ title: NonNullable<unknown> }} Action_Cash_Reject_HeadingInputs */
/** @typedef {{ title: NonNullable<unknown> }} Action_Cash_RejectedInputs */
/** @typedef {{ owner: NonNullable<unknown> }} Action_Eta_AlertInputs */
/** @typedef {{}} Action_Eta_ApplyInputs */
/** @typedef {{ line: NonNullable<unknown>, supplier: NonNullable<unknown>, date: NonNullable<unknown> }} Action_Eta_Backorder_In_TimeInputs */
/** @typedef {{ line: NonNullable<unknown>, supplier: NonNullable<unknown>, date: NonNullable<unknown> }} Action_Eta_Backorder_LateInputs */
/** @typedef {{ from: NonNullable<unknown>, subject: NonNullable<unknown> }} Action_Eta_FromInputs */
/** @typedef {{}} Action_Eta_HeadingInputs */
/** @typedef {{}} Action_Eta_LabelInputs */
/** @typedef {{ drop: NonNullable<unknown>, from: NonNullable<unknown>, to: NonNullable<unknown>, owner: NonNullable<unknown> }} Action_Eta_MoveInputs */
/** @typedef {{}} Action_Eta_No_DropInputs */
/** @typedef {{ eta: NonNullable<unknown>, was: NonNullable<unknown> }} Action_Eta_ReadInputs */
/** @typedef {{}} Action_Eta_What_MovesInputs */
/** @typedef {{}} Action_History_OrganiseInputs */
/** @typedef {{}} Action_History_OrganisedInputs */
/** @typedef {{}} Action_Inbox_Ack_AutoInputs */
/** @typedef {{}} Action_Inbox_Ack_ManualInputs */
/** @typedef {{}} Action_Inbox_BackupInputs */
/** @typedef {{}} Action_Inbox_CreateInputs */
/** @typedef {{}} Action_Inbox_Create_HeadingInputs */
/** @typedef {{ kind: NonNullable<unknown>, customer: NonNullable<unknown>, isNew: NonNullable<unknown>, count: NonNullable<unknown> }} Action_Inbox_CreatesInputs */
/** @typedef {{}} Action_Inbox_DeadlineInputs */
/** @typedef {{}} Action_Inbox_Deadline_HintInputs */
/** @typedef {{}} Action_Inbox_FlaggedInputs */
/** @typedef {{ subject: NonNullable<unknown> }} Action_Inbox_New_EmailInputs */
/** @typedef {{ subject: NonNullable<unknown> }} Action_Inbox_New_ReplyInputs */
/** @typedef {{}} Action_Inbox_Not_RelatedInputs */
/** @typedef {{}} Action_Inbox_OwnerInputs */
/** @typedef {{}} Action_Inbox_Simulate_EmailInputs */
/** @typedef {{}} Action_Inbox_Simulate_ForwardInputs */
/** @typedef {{}} Action_Inbox_Simulate_ReplyInputs */
/** @typedef {{ currency: NonNullable<unknown>, amount: NonNullable<unknown> }} Action_MoneyInputs */
/** @typedef {{}} Action_Order_Read_PoInputs */
/** @typedef {{ label: NonNullable<unknown>, detail: NonNullable<unknown>, expected: NonNullable<unknown>, actual: NonNullable<unknown> }} Action_Profit_Actual_LineInputs */
/** @typedef {{}} Action_Profit_Actuals_DoneInputs */
/** @typedef {{}} Action_Profit_Actuals_HeadingInputs */
/** @typedef {{}} Action_Profit_Actuals_IntroInputs */
/** @typedef {{}} Action_Profit_Bank_ReferenceInputs */
/** @typedef {{ creditNote: NonNullable<unknown>, ref: NonNullable<unknown> }} Action_Profit_Claim_DoneInputs */
/** @typedef {{ ref: NonNullable<unknown> }} Action_Profit_Claim_HeadingInputs */
/** @typedef {{ title: NonNullable<unknown>, note: NonNullable<unknown>, creditNote: NonNullable<unknown>, against: NonNullable<unknown>, amount: NonNullable<unknown> }} Action_Profit_Claim_TextInputs */
/** @typedef {{}} Action_Profit_CloseInputs */
/** @typedef {{ case: NonNullable<unknown> }} Action_Profit_Close_DoneInputs */
/** @typedef {{ case: NonNullable<unknown> }} Action_Profit_Close_HeadingInputs */
/** @typedef {{}} Action_Profit_Close_OpenInputs */
/** @typedef {{}} Action_Profit_Close_ReadyInputs */
/** @typedef {{}} Action_Profit_Close_RoleInputs */
/** @typedef {{ actual: NonNullable<unknown>, actualMargin: NonNullable<unknown>, expected: NonNullable<unknown>, expectedMargin: NonNullable<unknown> }} Action_Profit_Close_TextInputs */
/** @typedef {{}} Action_Profit_Confirm_ActualsInputs */
/** @typedef {{ amount: NonNullable<unknown>, customer: NonNullable<unknown> }} Action_Profit_Receipt_DescriptionInputs */
/** @typedef {{ amount: NonNullable<unknown>, customer: NonNullable<unknown>, rate: NonNullable<unknown>, currency: NonNullable<unknown> }} Action_Profit_Receipt_Description_RateInputs */
/** @typedef {{ invoice: NonNullable<unknown> }} Action_Profit_Receipt_DoneInputs */
/** @typedef {{ invoice: NonNullable<unknown> }} Action_Profit_Receipt_PromptInputs */
/** @typedef {{}} Action_Profit_Record_Credit_NoteInputs */
/** @typedef {{}} Action_Profit_Record_ReceiptInputs */
/** @typedef {{}} Action_Rfqs_SimulateInputs */
/** @typedef {{}} Action_Rfqs_SimulatedInputs */
/** @typedef {{ list: NonNullable<unknown>, more: NonNullable<unknown> }} Api_Assistant_And_MoreInputs */
/** @typedef {{ title: NonNullable<unknown>, type: NonNullable<unknown>, from: NonNullable<unknown>, approvers: NonNullable<unknown>, twoPerson: NonNullable<unknown> }} Api_Assistant_Approval_ItemInputs */
/** @typedef {{ count: NonNullable<unknown>, list: NonNullable<unknown> }} Api_Assistant_Approvals_For_YouInputs */
/** @typedef {{ count: NonNullable<unknown> }} Api_Assistant_Approvals_WaitingInputs */
/** @typedef {{}} Api_Assistant_Ask_A_QuestionInputs */
/** @typedef {{ count: NonNullable<unknown>, list: NonNullable<unknown> }} Api_Assistant_Bills_On_HoldInputs */
/** @typedef {{ count: NonNullable<unknown> }} Api_Assistant_Briefing_SubjectInputs */
/** @typedef {{ titles: NonNullable<unknown> }} Api_Assistant_Case_Approval_PendingInputs */
/** @typedef {{ day: NonNullable<unknown>, time: NonNullable<unknown>, when: NonNullable<unknown>, hasEta: NonNullable<unknown>, eta: NonNullable<unknown> }} Api_Assistant_Case_DeadlineInputs */
/** @typedef {{ actual: NonNullable<unknown>, actualMargin: NonNullable<unknown>, expected: NonNullable<unknown>, expectedMargin: NonNullable<unknown> }} Api_Assistant_Case_GpInputs */
/** @typedef {{ number: NonNullable<unknown>, status: NonNullable<unknown>, amount: NonNullable<unknown> }} Api_Assistant_Case_InvoiceInputs */
/** @typedef {{ ready: NonNullable<unknown>, total: NonNullable<unknown>, hasBlocked: NonNullable<unknown>, blocked: NonNullable<unknown> }} Api_Assistant_Case_LinesInputs */
/** @typedef {{ caseId: NonNullable<unknown>, vessel: NonNullable<unknown>, actual: NonNullable<unknown>, actualMargin: NonNullable<unknown>, expected: NonNullable<unknown>, expectedMargin: NonNullable<unknown> }} Api_Assistant_Case_MarginInputs */
/** @typedef {{ next: NonNullable<unknown>, hasBlocker: NonNullable<unknown>, blocker: NonNullable<unknown> }} Api_Assistant_Case_NextInputs */
/** @typedef {{ caseId: NonNullable<unknown> }} Api_Assistant_Case_Profit_And_CloseInputs */
/** @typedef {{ stage: NonNullable<unknown>, hasWait: NonNullable<unknown>, wait: NonNullable<unknown>, owner: NonNullable<unknown> }} Api_Assistant_Case_StageInputs */
/** @typedef {{ suppliers: NonNullable<unknown>, statuses: NonNullable<unknown> }} Api_Assistant_Case_Waiting_OnInputs */
/** @typedef {{ count: NonNullable<unknown> }} Api_Assistant_Cases_Need_AttentionInputs */
/** @typedef {{ totals: NonNullable<unknown>, count: NonNullable<unknown> }} Api_Assistant_CollectionsInputs */
/** @typedef {{}} Api_Assistant_Commitment_BlockedInputs */
/** @typedef {{}} Api_Assistant_Control_RoomInputs */
/** @typedef {{ totals: NonNullable<unknown>, count: NonNullable<unknown>, overdue: NonNullable<unknown> }} Api_Assistant_Customers_OweInputs */
/** @typedef {{ count: NonNullable<unknown>, list: NonNullable<unknown> }} Api_Assistant_Deliveries_ShortInputs */
/** @typedef {{ list: NonNullable<unknown> }} Api_Assistant_Due_This_WeekInputs */
/** @typedef {{ port: NonNullable<unknown>, day: NonNullable<unknown> }} Api_Assistant_EtaInputs */
/** @typedef {{ count: NonNullable<unknown>, list: NonNullable<unknown> }} Api_Assistant_ExceptionsInputs */
/** @typedef {{ from: NonNullable<unknown>, to: NonNullable<unknown>, change: NonNullable<unknown> }} Api_Assistant_Fx_MovedInputs */
/** @typedef {{ amount: NonNullable<unknown> }} Api_Assistant_Fx_On_ReceiptsInputs */
/** @typedef {{}} Api_Assistant_Fx_RatesInputs */
/** @typedef {{ name: NonNullable<unknown> }} Api_Assistant_Good_MorningInputs */
/** @typedef {{}} Api_Assistant_Good_Morning_ThereInputs */
/** @typedef {{}} Api_Assistant_Growth_BoardInputs */
/** @typedef {{}} Api_Assistant_HelpInputs */
/** @typedef {{ count: NonNullable<unknown>, types: NonNullable<unknown> }} Api_Assistant_Items_Awaiting_ApprovalInputs */
/** @typedef {{ supplier: NonNullable<unknown>, po: NonNullable<unknown>, line: NonNullable<unknown>, received: NonNullable<unknown>, ordered: NonNullable<unknown>, extra: NonNullable<unknown>, claim: NonNullable<unknown>, promised: NonNullable<unknown> }} Api_Assistant_Late_ItemInputs */
/** @typedef {{ name: NonNullable<unknown>, onTime: NonNullable<unknown>, hours: NonNullable<unknown> }} Api_Assistant_Least_ReliableInputs */
/** @typedef {{ list: NonNullable<unknown> }} Api_Assistant_LowestInputs */
/** @typedef {{ list: NonNullable<unknown> }} Api_Assistant_Margin_By_StoreInputs */
/** @typedef {{ month: NonNullable<unknown>, expected: NonNullable<unknown>, actual: NonNullable<unknown> }} Api_Assistant_Month_GpInputs */
/** @typedef {{ count: NonNullable<unknown> }} Api_Assistant_More_Due_LaterInputs */
/** @typedef {{}} Api_Assistant_No_Case_At_RiskInputs */
/** @typedef {{}} Api_Assistant_No_Open_BalanceInputs */
/** @typedef {{}} Api_Assistant_Nothing_OverdueInputs */
/** @typedef {{}} Api_Assistant_Nothing_Waiting_ApprovalInputs */
/** @typedef {{ expected: NonNullable<unknown>, actual: NonNullable<unknown> }} Api_Assistant_November_GpInputs */
/** @typedef {{ name: NonNullable<unknown>, stage: NonNullable<unknown>, hasValue: NonNullable<unknown>, value: NonNullable<unknown>, next: NonNullable<unknown>, step: NonNullable<unknown>, due: NonNullable<unknown> }} Api_Assistant_Opportunity_ItemInputs */
/** @typedef {{ list: NonNullable<unknown> }} Api_Assistant_OverdueInputs */
/** @typedef {{ customer: NonNullable<unknown>, amount: NonNullable<unknown>, number: NonNullable<unknown>, due: NonNullable<unknown>, day: NonNullable<unknown>, hasPaid: NonNullable<unknown>, paid: NonNullable<unknown> }} Api_Assistant_Owe_ItemInputs */
/** @typedef {{ open: NonNullable<unknown>, inquiries: NonNullable<unknown>, won: NonNullable<unknown>, byCount: NonNullable<unknown>, byValue: NonNullable<unknown> }} Api_Assistant_PipelineInputs */
/** @typedef {{ names: NonNullable<unknown> }} Api_Assistant_Plan_Next_StepInputs */
/** @typedef {{ po: NonNullable<unknown> }} Api_Assistant_PoInputs */
/** @typedef {{ caseId: NonNullable<unknown>, vessel: NonNullable<unknown>, blocker: NonNullable<unknown> }} Api_Assistant_Po_MismatchInputs */
/** @typedef {{}} Api_Assistant_Profit_And_CloseInputs */
/** @typedef {{ vessel: NonNullable<unknown>, caseId: NonNullable<unknown>, when: NonNullable<unknown>, hasBlocker: NonNullable<unknown>, blocker: NonNullable<unknown> }} Api_Assistant_Quote_Due_ItemInputs */
/** @typedef {{ count: NonNullable<unknown>, list: NonNullable<unknown> }} Api_Assistant_Quotes_DueInputs */
/** @typedef {{ po: NonNullable<unknown> }} Api_Assistant_Receipt_PoInputs */
/** @typedef {{}} Api_Assistant_RefusedInputs */
/** @typedef {{}} Api_Assistant_Refused_HintInputs */
/** @typedef {{ caseId: NonNullable<unknown>, vessel: NonNullable<unknown>, stage: NonNullable<unknown>, deadline: NonNullable<unknown>, hasBlocker: NonNullable<unknown>, blocker: NonNullable<unknown> }} Api_Assistant_Risky_ItemInputs */
/** @typedef {{ caseId: NonNullable<unknown>, actual: NonNullable<unknown>, expected: NonNullable<unknown> }} Api_Assistant_Settled_MarginInputs */
/** @typedef {{ po: NonNullable<unknown>, line: NonNullable<unknown>, received: NonNullable<unknown>, ordered: NonNullable<unknown>, hasPromise: NonNullable<unknown>, promised: NonNullable<unknown> }} Api_Assistant_Short_ItemInputs */
/** @typedef {{ supplier: NonNullable<unknown>, reference: NonNullable<unknown>, reminders: NonNullable<unknown> }} Api_Assistant_Silent_ItemInputs */
/** @typedef {{}} Api_Assistant_Suggest_ApprovalsInputs */
/** @typedef {{}} Api_Assistant_Suggest_Late_SuppliersInputs */
/** @typedef {{}} Api_Assistant_Suggest_MarginInputs */
/** @typedef {{}} Api_Assistant_Suggest_OwesInputs */
/** @typedef {{}} Api_Assistant_Suggest_PipelineInputs */
/** @typedef {{}} Api_Assistant_Suggest_StatusInputs */
/** @typedef {{ at: NonNullable<unknown>, count: NonNullable<unknown> }} Api_Assistant_Summarised_AgainInputs */
/** @typedef {{ name: NonNullable<unknown>, hours: NonNullable<unknown>, hasOnTime: NonNullable<unknown>, onTime: NonNullable<unknown>, isNew: NonNullable<unknown> }} Api_Assistant_Supplier_NamedInputs */
/** @typedef {{ count: NonNullable<unknown>, list: NonNullable<unknown> }} Api_Assistant_Suppliers_SilentInputs */
/** @typedef {{ late: NonNullable<unknown>, waiting: NonNullable<unknown> }} Api_Assistant_Suppliers_SummaryInputs */
/** @typedef {{ supplier: NonNullable<unknown>, reference: NonNullable<unknown>, status: NonNullable<unknown>, hasDue: NonNullable<unknown>, due: NonNullable<unknown>, reminders: NonNullable<unknown> }} Api_Assistant_Waiting_ItemInputs */
/** @typedef {{ supplier: NonNullable<unknown>, amount: NonNullable<unknown>, bill: NonNullable<unknown>, status: NonNullable<unknown>, hasReason: NonNullable<unknown>, reason: NonNullable<unknown> }} Api_Assistant_We_OweInputs */
/** @typedef {{}} Api_Cash_Account_OwnerInputs */
/** @typedef {{ amount: NonNullable<unknown>, number: NonNullable<unknown>, balance: NonNullable<unknown> }} Api_Cash_Allocated_BalanceInputs */
/** @typedef {{ amount: NonNullable<unknown>, number: NonNullable<unknown> }} Api_Cash_Allocated_PaidInputs */
/** @typedef {{}} Api_Cash_Approval_In_ProgressInputs */
/** @typedef {{}} Api_Cash_Approval_Not_FoundInputs */
/** @typedef {{ supplier: NonNullable<unknown> }} Api_Cash_Approve_Payment_TitleInputs */
/** @typedef {{}} Api_Cash_Bank_Change_Not_FoundInputs */
/** @typedef {{ number: NonNullable<unknown> }} Api_Cash_Bill_On_HoldInputs */
/** @typedef {{ note: NonNullable<unknown> }} Api_Cash_Call_Back_DoneInputs */
/** @typedef {{}} Api_Cash_Call_Back_FirstInputs */
/** @typedef {{}} Api_Cash_Cant_DecideInputs */
/** @typedef {{ amount: NonNullable<unknown>, number: NonNullable<unknown> }} Api_Cash_Collect_GoalInputs */
/** @typedef {{}} Api_Cash_Enter_AmountInputs */
/** @typedef {{}} Api_Cash_Finance_Applies_BankInputs */
/** @typedef {{}} Api_Cash_Finance_Records_PaymentsInputs */
/** @typedef {{}} Api_Cash_Finance_Requests_ApprovalsInputs */
/** @typedef {{}} Api_Cash_Give_Bank_ReferenceInputs */
/** @typedef {{}} Api_Cash_Give_Reject_ReasonInputs */
/** @typedef {{}} Api_Cash_Invoice_Not_FoundInputs */
/** @typedef {{}} Api_Cash_List_SeparatorInputs */
/** @typedef {{ number: NonNullable<unknown>, customer: NonNullable<unknown>, amount: NonNullable<unknown> }} Api_Cash_Match_ItemInputs */
/** @typedef {{ count: NonNullable<unknown>, list: NonNullable<unknown> }} Api_Cash_Match_MessageInputs */
/** @typedef {{ balance: NonNullable<unknown>, number: NonNullable<unknown> }} Api_Cash_More_Than_BalanceInputs */
/** @typedef {{}} Api_Cash_No_Remittance_MatchInputs */
/** @typedef {{ number: NonNullable<unknown>, due: NonNullable<unknown> }} Api_Cash_Pay_DetailInputs */
/** @typedef {{ number: NonNullable<unknown>, bill: NonNullable<unknown>, due: NonNullable<unknown> }} Api_Cash_Pay_Detail_MatchedInputs */
/** @typedef {{ supplier: NonNullable<unknown>, amount: NonNullable<unknown>, number: NonNullable<unknown> }} Api_Cash_Pay_TitleInputs */
/** @typedef {{}} Api_Cash_Payable_Not_FoundInputs */
/** @typedef {{}} Api_Cash_Payables_Hidden_From_SalesInputs */
/** @typedef {{}} Api_Cash_Payment_Not_ApprovedInputs */
/** @typedef {{}} Api_Cash_Reminder_Sent_NoteInputs */
/** @typedef {{}} Api_Cash_Two_Approvers_FirstInputs */
/** @typedef {{ line: NonNullable<unknown>, hasNote: NonNullable<unknown>, note: NonNullable<unknown> }} Api_Commercial_Accepted_ActivityInputs */
/** @typedef {{ supplier: NonNullable<unknown> }} Api_Commercial_Advance_PaymentInputs */
/** @typedef {{}} Api_Commercial_Agency_FlagInputs */
/** @typedef {{}} Api_Commercial_Agency_TermsInputs */
/** @typedef {{ number: NonNullable<unknown> }} Api_Commercial_Already_AwaitingInputs */
/** @typedef {{ number: NonNullable<unknown>, status: NonNullable<unknown> }} Api_Commercial_Already_Cant_WithdrawInputs */
/** @typedef {{}} Api_Commercial_Alternative_AcceptedInputs */
/** @typedef {{}} Api_Commercial_Alternative_PackInputs */
/** @typedef {{}} Api_Commercial_Alternatives_AllowedInputs */
/** @typedef {{}} Api_Commercial_Approval_Not_FoundInputs */
/** @typedef {{ progress: NonNullable<unknown> }} Api_Commercial_Approval_RecordedInputs */
/** @typedef {{ number: NonNullable<unknown>, customer: NonNullable<unknown>, total: NonNullable<unknown> }} Api_Commercial_Approval_TitleInputs */
/** @typedef {{}} Api_Commercial_Approved_DotInputs */
/** @typedef {{ title: NonNullable<unknown> }} Api_Commercial_Approved_TitleInputs */
/** @typedef {{}} Api_Commercial_Bank_Applied_Cant_WithdrawInputs */
/** @typedef {{ min: NonNullable<unknown> }} Api_Commercial_Below_MinInputs */
/** @typedef {{}} Api_Commercial_Best_Fit_ReasonInputs */
/** @typedef {{}} Api_Commercial_Best_RegardsInputs */
/** @typedef {{}} Api_Commercial_Case_Not_FoundInputs */
/** @typedef {{ label: NonNullable<unknown>, amount: NonNullable<unknown> }} Api_Commercial_Charge_EstimateInputs */
/** @typedef {{}} Api_Commercial_Check_PoInputs */
/** @typedef {{}} Api_Commercial_Check_Po_PartialInputs */
/** @typedef {{}} Api_Commercial_Choose_OfferInputs */
/** @typedef {{}} Api_Commercial_Closed_ExpiredInputs */
/** @typedef {{}} Api_Commercial_Closed_LostInputs */
/** @typedef {{ currency: NonNullable<unknown>, rate: NonNullable<unknown> }} Api_Commercial_Converted_FxInputs */
/** @typedef {{ version: NonNullable<unknown>, replaces: NonNullable<unknown>, hasWas: NonNullable<unknown>, was: NonNullable<unknown> }} Api_Commercial_Corrected_VersionInputs */
/** @typedef {{ line: NonNullable<unknown>, part: NonNullable<unknown> }} Api_Commercial_Correction_AskedInputs */
/** @typedef {{}} Api_Commercial_Correction_PleaseInputs */
/** @typedef {{ supplier: NonNullable<unknown>, line: NonNullable<unknown>, name: NonNullable<unknown> }} Api_Commercial_Correction_Sent_ActivityInputs */
/** @typedef {{ version: NonNullable<unknown> }} Api_Commercial_Correction_Sent_StatusInputs */
/** @typedef {{ rfq: NonNullable<unknown>, line: NonNullable<unknown> }} Api_Commercial_Correction_SubjectInputs */
/** @typedef {{}} Api_Commercial_Customer_DecisionInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Commercial_Days_ShortInputs */
/** @typedef {{ name: NonNullable<unknown> }} Api_Commercial_DearInputs */
/** @typedef {{}} Api_Commercial_Dear_ColleaguesInputs */
/** @typedef {{ name: NonNullable<unknown>, approved: NonNullable<unknown>, title: NonNullable<unknown>, hasReason: NonNullable<unknown>, reason: NonNullable<unknown> }} Api_Commercial_Decided_ActivityInputs */
/** @typedef {{ number: NonNullable<unknown>, decision: NonNullable<unknown>, hasNote: NonNullable<unknown>, note: NonNullable<unknown> }} Api_Commercial_Decision_ActivityInputs */
/** @typedef {{}} Api_Commercial_Decision_Must_BeInputs */
/** @typedef {{}} Api_Commercial_Decision_On_ReceivedInputs */
/** @typedef {{ title: NonNullable<unknown> }} Api_Commercial_Decision_WithdrawnInputs */
/** @typedef {{}} Api_Commercial_Delivered_As_QuotedInputs */
/** @typedef {{ port: NonNullable<unknown> }} Api_Commercial_Delivery_Terms_DefaultInputs */
/** @typedef {{}} Api_Commercial_DeviationInputs */
/** @typedef {{}} Api_Commercial_Different_ItemInputs */
/** @typedef {{ discount: NonNullable<unknown>, max: NonNullable<unknown> }} Api_Commercial_Discount_AboveInputs */
/** @typedef {{}} Api_Commercial_Draft_Not_SentInputs */
/** @typedef {{ day: NonNullable<unknown> }} Api_Commercial_Due_DayInputs */
/** @typedef {{ number: NonNullable<unknown>, to: NonNullable<unknown>, name: NonNullable<unknown> }} Api_Commercial_Emailed_ActivityInputs */
/** @typedef {{ part: NonNullable<unknown> }} Api_Commercial_Exact_OnlyInputs */
/** @typedef {{ day: NonNullable<unknown> }} Api_Commercial_Expired_ValidityInputs */
/** @typedef {{}} Api_Commercial_Field_CurrencyInputs */
/** @typedef {{}} Api_Commercial_Field_Line_CountInputs */
/** @typedef {{}} Api_Commercial_Field_Payment_TermsInputs */
/** @typedef {{}} Api_Commercial_Field_Quotation_NoInputs */
/** @typedef {{}} Api_Commercial_Field_TotalInputs */
/** @typedef {{}} Api_Commercial_Field_ValidityInputs */
/** @typedef {{ number: NonNullable<unknown> }} Api_Commercial_Follow_Up_2_DaysInputs */
/** @typedef {{}} Api_Commercial_Freight_As_QuotedInputs */
/** @typedef {{}} Api_Commercial_Fx_Decision_StandsInputs */
/** @typedef {{ usd: NonNullable<unknown>, eur: NonNullable<unknown> }} Api_Commercial_Fx_LabelInputs */
/** @typedef {{}} Api_Commercial_Give_Reason_Not_BestInputs */
/** @typedef {{}} Api_Commercial_Give_Return_ReasonInputs */
/** @typedef {{ from: NonNullable<unknown>, port: NonNullable<unknown> }} Api_Commercial_Gs_Truck_LaneInputs */
/** @typedef {{}} Api_Commercial_Import_FreightInputs */
/** @typedef {{ lines: NonNullable<unknown> }} Api_Commercial_Items_FollowInputs */
/** @typedef {{ number: NonNullable<unknown> }} Api_Commercial_Karim_ApproveInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Commercial_Lead_DaysInputs */
/** @typedef {{ days: NonNullable<unknown>, eta: NonNullable<unknown> }} Api_Commercial_Lead_Time_MissesInputs */
/** @typedef {{}} Api_Commercial_Lead_Time_Misses_EtaInputs */
/** @typedef {{ line: NonNullable<unknown> }} Api_Commercial_Line_Not_FoundInputs */
/** @typedef {{ lines: NonNullable<unknown> }} Api_Commercial_Lines_ExcludedInputs */
/** @typedef {{ port: NonNullable<unknown> }} Api_Commercial_Local_TruckInputs */
/** @typedef {{}} Api_Commercial_Missing_Item_NoteInputs */
/** @typedef {{}} Api_Commercial_Negative_ProfitInputs */
/** @typedef {{ terms: NonNullable<unknown> }} Api_Commercial_New_SupplierInputs */
/** @typedef {{}} Api_Commercial_No_Approval_RequestedInputs */
/** @typedef {{}} Api_Commercial_No_Decision_To_WithdrawInputs */
/** @typedef {{}} Api_Commercial_No_Delivery_HistoryInputs */
/** @typedef {{}} Api_Commercial_No_ExceptionsInputs */
/** @typedef {{}} Api_Commercial_No_Quotation_NamedInputs */
/** @typedef {{ line: NonNullable<unknown> }} Api_Commercial_Not_A_SelectionInputs */
/** @typedef {{}} Api_Commercial_Not_GivenInputs */
/** @typedef {{ number: NonNullable<unknown>, status: NonNullable<unknown> }} Api_Commercial_Nothing_To_RequestInputs */
/** @typedef {{ supplier: NonNullable<unknown>, version: NonNullable<unknown>, reason: NonNullable<unknown> }} Api_Commercial_Offer_BlockedInputs */
/** @typedef {{}} Api_Commercial_Offer_Not_FoundInputs */
/** @typedef {{ offer: NonNullable<unknown>, line: NonNullable<unknown> }} Api_Commercial_Offer_Not_On_LineInputs */
/** @typedef {{ supplier: NonNullable<unknown>, qty: NonNullable<unknown>, unit: NonNullable<unknown> }} Api_Commercial_Offers_OnlyInputs */
/** @typedef {{}} Api_Commercial_On_ArrivalInputs */
/** @typedef {{ n: NonNullable<unknown>, place: NonNullable<unknown> }} Api_Commercial_On_HandInputs */
/** @typedef {{ pct: NonNullable<unknown> }} Api_Commercial_On_TimeInputs */
/** @typedef {{}} Api_Commercial_Only_Approved_SentInputs */
/** @typedef {{}} Api_Commercial_Only_Approved_To_CustomerInputs */
/** @typedef {{}} Api_Commercial_Our_RfqInputs */
/** @typedef {{ hasLot: NonNullable<unknown>, lot: NonNullable<unknown> }} Api_Commercial_Own_Stock_FlagInputs */
/** @typedef {{}} Api_Commercial_Own_Stock_TermsInputs */
/** @typedef {{}} Api_Commercial_PackInputs */
/** @typedef {{ offered: NonNullable<unknown>, requested: NonNullable<unknown> }} Api_Commercial_Pack_SizeInputs */
/** @typedef {{}} Api_Commercial_Payment_Recorded_Cant_WithdrawInputs */
/** @typedef {{}} Api_Commercial_Payment_Terms_DefaultInputs */
/** @typedef {{}} Api_Commercial_Pending_AcceptanceInputs */
/** @typedef {{ number: NonNullable<unknown>, name: NonNullable<unknown> }} Api_Commercial_Portal_ActivityInputs */
/** @typedef {{ number: NonNullable<unknown> }} Api_Commercial_Portal_Check_ActivityInputs */
/** @typedef {{}} Api_Commercial_Portal_Default_TermsInputs */
/** @typedef {{}} Api_Commercial_Price_ExpiredInputs */
/** @typedef {{}} Api_Commercial_Purchasing_DepartmentInputs */
/** @typedef {{ pct: NonNullable<unknown> }} Api_Commercial_Quantity_ShortfallInputs */
/** @typedef {{}} Api_Commercial_Quotation_Not_FoundInputs */
/** @typedef {{ margin: NonNullable<unknown>, min: NonNullable<unknown> }} Api_Commercial_Quote_Margin_BelowInputs */
/** @typedef {{ number: NonNullable<unknown>, status: NonNullable<unknown> }} Api_Commercial_Quoted_With_SelectionInputs */
/** @typedef {{}} Api_Commercial_Rejected_TechnicalInputs */
/** @typedef {{ hours: NonNullable<unknown> }} Api_Commercial_Replies_InInputs */
/** @typedef {{ name: NonNullable<unknown>, number: NonNullable<unknown> }} Api_Commercial_Requested_ActivityInputs */
/** @typedef {{ title: NonNullable<unknown> }} Api_Commercial_Returned_TitleInputs */
/** @typedef {{ number: NonNullable<unknown> }} Api_Commercial_Revise_For_CustomerInputs */
/** @typedef {{ number: NonNullable<unknown>, status: NonNullable<unknown> }} Api_Commercial_Revise_LatestInputs */
/** @typedef {{ name: NonNullable<unknown>, reason: NonNullable<unknown> }} Api_Commercial_Revise_PricingInputs */
/** @typedef {{ next: NonNullable<unknown>, from: NonNullable<unknown> }} Api_Commercial_Revised_ActivityInputs */
/** @typedef {{ reason: NonNullable<unknown> }} Api_Commercial_Revision_RemarkInputs */
/** @typedef {{}} Api_Commercial_Sales_HiddenInputs */
/** @typedef {{}} Api_Commercial_Select_Alternative_FirstInputs */
/** @typedef {{}} Api_Commercial_Select_Offers_FirstInputs */
/** @typedef {{ line: NonNullable<unknown>, names: NonNullable<unknown>, hasReason: NonNullable<unknown>, reason: NonNullable<unknown> }} Api_Commercial_Selected_ActivityInputs */
/** @typedef {{ line: NonNullable<unknown> }} Api_Commercial_Selected_AgainInputs */
/** @typedef {{ total: NonNullable<unknown>, qty: NonNullable<unknown>, unit: NonNullable<unknown> }} Api_Commercial_Selected_OfInputs */
/** @typedef {{ number: NonNullable<unknown> }} Api_Commercial_Send_For_ApprovalInputs */
/** @typedef {{ number: NonNullable<unknown> }} Api_Commercial_Send_To_CustomerInputs */
/** @typedef {{}} Api_Commercial_Sent_Awaiting_CorrectedInputs */
/** @typedef {{ left: NonNullable<unknown>, need: NonNullable<unknown> }} Api_Commercial_Shelf_LifeInputs */
/** @typedef {{}} Api_Commercial_Shelf_Life_BelowInputs */
/** @typedef {{}} Api_Commercial_Someone_Decided_AfterInputs */
/** @typedef {{ parts: NonNullable<unknown> }} Api_Commercial_Split_SourcingInputs */
/** @typedef {{ version: NonNullable<unknown> }} Api_Commercial_Superseded_ByInputs */
/** @typedef {{ description: NonNullable<unknown>, pack: NonNullable<unknown>, accepted: NonNullable<unknown> }} Api_Commercial_Supplied_AsInputs */
/** @typedef {{}} Api_Commercial_Supplier_WordInputs */
/** @typedef {{ line: NonNullable<unknown> }} Api_Commercial_Taken_BackInputs */
/** @typedef {{ line: NonNullable<unknown>, name: NonNullable<unknown>, earlier: NonNullable<unknown> }} Api_Commercial_Taken_Back_ActivityInputs */
/** @typedef {{}} Api_Commercial_Terms_TbcInputs */
/** @typedef {{}} Api_Commercial_The_CustomerInputs */
/** @typedef {{}} Api_Commercial_Tight_EtaInputs */
/** @typedef {{ from: NonNullable<unknown>, port: NonNullable<unknown> }} Api_Commercial_Truck_LaneInputs */
/** @typedef {{}} Api_Commercial_Unknown_ActionInputs */
/** @typedef {{}} Api_Commercial_Unknown_DecisionInputs */
/** @typedef {{ name: NonNullable<unknown>, approval: NonNullable<unknown>, title: NonNullable<unknown> }} Api_Commercial_Withdrew_ActivityInputs */
/** @typedef {{ brand: NonNullable<unknown>, partNo: NonNullable<unknown> }} Api_Commercial_Wrong_PartInputs */
/** @typedef {{ offered: NonNullable<unknown>, detail: NonNullable<unknown> }} Api_Commercial_Your_OfferInputs */
/** @typedef {{}} Api_Control_Room_Ack_SubInputs */
/** @typedef {{}} Api_Control_Room_Ack_TitleInputs */
/** @typedef {{}} Api_Control_Room_ActualInputs */
/** @typedef {{}} Api_Control_Room_After_HoursInputs */
/** @typedef {{}} Api_Control_Room_After_Hours_SubInputs */
/** @typedef {{}} Api_Control_Room_After_Hours_TitleInputs */
/** @typedef {{}} Api_Control_Room_Ageing_SubInputs */
/** @typedef {{}} Api_Control_Room_Ageing_TitleInputs */
/** @typedef {{}} Api_Control_Room_Avg_Time_To_QuoteInputs */
/** @typedef {{ count: NonNullable<unknown> }} Api_Control_Room_Blocked_Or_UrgentInputs */
/** @typedef {{}} Api_Control_Room_Cash_SubInputs */
/** @typedef {{}} Api_Control_Room_Cash_TitleInputs */
/** @typedef {{}} Api_Control_Room_ConversionInputs */
/** @typedef {{}} Api_Control_Room_Conversion_SubInputs */
/** @typedef {{}} Api_Control_Room_Conversion_TitleInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Control_Room_DaysInputs */
/** @typedef {{}} Api_Control_Room_Deliveries_SubInputs */
/** @typedef {{}} Api_Control_Room_Deliveries_TitleInputs */
/** @typedef {{}} Api_Control_Room_Delivery_SubInputs */
/** @typedef {{}} Api_Control_Room_Delivery_TitleInputs */
/** @typedef {{}} Api_Control_Room_Expected_At_QuotationInputs */
/** @typedef {{}} Api_Control_Room_Funnel_SubInputs */
/** @typedef {{}} Api_Control_Room_Funnel_TitleInputs */
/** @typedef {{ expected: NonNullable<unknown> }} Api_Control_Room_Gp_NoteInputs */
/** @typedef {{}} Api_Control_Room_Gp_SubInputs */
/** @typedef {{}} Api_Control_Room_Gp_TitleInputs */
/** @typedef {{ month: NonNullable<unknown> }} Api_Control_Room_Gross_Profit_MonthInputs */
/** @typedef {{}} Api_Control_Room_InquiriesInputs */
/** @typedef {{}} Api_Control_Room_Inquiries_Chart_SubInputs */
/** @typedef {{}} Api_Control_Room_Inquiries_Chart_TitleInputs */
/** @typedef {{}} Api_Control_Room_Last_12_WeeksInputs */
/** @typedef {{}} Api_Control_Room_Last_4_WeeksInputs */
/** @typedef {{}} Api_Control_Room_Last_6_MonthsInputs */
/** @typedef {{}} Api_Control_Room_Lost_SubInputs */
/** @typedef {{}} Api_Control_Room_Lost_TitleInputs */
/** @typedef {{}} Api_Control_Room_Margin_Source_SubInputs */
/** @typedef {{}} Api_Control_Room_Margin_Source_TitleInputs */
/** @typedef {{}} Api_Control_Room_Margin_Store_SubInputs */
/** @typedef {{}} Api_Control_Room_Margin_Store_TitleInputs */
/** @typedef {{}} Api_Control_Room_Median_DaysInputs */
/** @typedef {{}} Api_Control_Room_MinutesInputs */
/** @typedef {{}} Api_Control_Room_Money_SubInputs */
/** @typedef {{}} Api_Control_Room_Money_TitleInputs */
/** @typedef {{}} Api_Control_Room_Nothing_Over_30_DaysInputs */
/** @typedef {{ count: NonNullable<unknown> }} Api_Control_Room_Open_InvoicesInputs */
/** @typedef {{}} Api_Control_Room_Open_RfqsInputs */
/** @typedef {{ amount: NonNullable<unknown> }} Api_Control_Room_Over_30_DaysInputs */
/** @typedef {{ overdue: NonNullable<unknown>, total: NonNullable<unknown> }} Api_Control_Room_Overdue_OfInputs */
/** @typedef {{}} Api_Control_Room_PaymentsInputs */
/** @typedef {{}} Api_Control_Room_Pipeline_SubInputs */
/** @typedef {{}} Api_Control_Room_Pipeline_TitleInputs */
/** @typedef {{}} Api_Control_Room_QuotedInputs */
/** @typedef {{}} Api_Control_Room_ReceiptsInputs */
/** @typedef {{}} Api_Control_Room_ReceivablesInputs */
/** @typedef {{}} Api_Control_Room_Receivables_Customer_SubInputs */
/** @typedef {{}} Api_Control_Room_Receivables_Customer_TitleInputs */
/** @typedef {{}} Api_Control_Room_Receivables_OpenInputs */
/** @typedef {{ count: NonNullable<unknown> }} Api_Control_Room_Rfqs_Without_ReplyInputs */
/** @typedef {{}} Api_Control_Room_Sales_Source_SubInputs */
/** @typedef {{}} Api_Control_Room_Sales_Source_TitleInputs */
/** @typedef {{}} Api_Control_Room_Speed_SubInputs */
/** @typedef {{}} Api_Control_Room_Speed_TitleInputs */
/** @typedef {{}} Api_Control_Room_Target_1_DayInputs */
/** @typedef {{}} Api_Control_Room_Target_35Inputs */
/** @typedef {{ currency: NonNullable<unknown>, n: NonNullable<unknown> }} Api_Control_Room_ThousandsInputs */
/** @typedef {{ was: NonNullable<unknown> }} Api_Control_Room_Turnaround_NoteInputs */
/** @typedef {{}} Api_Control_Room_Turnaround_SubInputs */
/** @typedef {{}} Api_Control_Room_Turnaround_TitleInputs */
/** @typedef {{}} Api_Control_Room_Value_WonInputs */
/** @typedef {{}} Api_Control_Room_Value_Won_SubInputs */
/** @typedef {{}} Api_Control_Room_Value_Won_TitleInputs */
/** @typedef {{}} Api_Control_Room_Waiting_On_SuppliersInputs */
/** @typedef {{}} Api_Control_Room_Win_RateInputs */
/** @typedef {{}} Api_Control_Room_WonInputs */
/** @typedef {{ won: NonNullable<unknown>, quoted: NonNullable<unknown>, period: NonNullable<unknown> }} Api_Control_Room_Won_Of_QuotedInputs */
/** @typedef {{ name: NonNullable<unknown>, result: NonNullable<unknown>, hasNote: NonNullable<unknown>, note: NonNullable<unknown>, hasNext: NonNullable<unknown>, step: NonNullable<unknown>, due: NonNullable<unknown>, stage: NonNullable<unknown> }} Api_Growth_Crm_ActivityInputs */
/** @typedef {{}} Api_Growth_Crm_Choose_OutcomeInputs */
/** @typedef {{ status: NonNullable<unknown> }} Api_Growth_Crm_Customer_RelationInputs */
/** @typedef {{}} Api_Growth_Crm_Next_Step_Date_InvalidInputs */
/** @typedef {{}} Api_Growth_Crm_Opportunity_Not_FoundInputs */
/** @typedef {{ step: NonNullable<unknown>, due: NonNullable<unknown> }} Api_Growth_Crm_Outcome_PlannedInputs */
/** @typedef {{ name: NonNullable<unknown>, stage: NonNullable<unknown> }} Api_Growth_Crm_Outcome_StageInputs */
/** @typedef {{}} Api_Growth_Crm_Plan_Next_StepInputs */
/** @typedef {{ stage: NonNullable<unknown> }} Api_Growth_Crm_Prospect_RelationInputs */
/** @typedef {{ step: NonNullable<unknown>, name: NonNullable<unknown> }} Api_Growth_Crm_Task_TitleInputs */
/** @typedef {{}} Api_Growth_Crm_Unknown_StageInputs */
/** @typedef {{}} Api_History_Age_1_30Inputs */
/** @typedef {{}} Api_History_Age_31_60Inputs */
/** @typedef {{}} Api_History_Age_60_PlusInputs */
/** @typedef {{}} Api_History_Agency_PricelistInputs */
/** @typedef {{}} Api_History_Awaiting_Corrected_OfferInputs */
/** @typedef {{}} Api_History_Awaiting_Customer_DecisionInputs */
/** @typedef {{}} Api_History_Awaiting_Delivery_Or_PaymentInputs */
/** @typedef {{}} Api_History_Awaiting_Internal_ApprovalInputs */
/** @typedef {{}} Api_History_Awaiting_SupplierInputs */
/** @typedef {{}} Api_History_Bought_To_OrderInputs */
/** @typedef {{}} Api_History_Cabin_StoresInputs */
/** @typedef {{}} Api_History_CancelledInputs */
/** @typedef {{}} Api_History_Deck_StoresInputs */
/** @typedef {{}} Api_History_Electrical_StoresInputs */
/** @typedef {{}} Api_History_Engine_StoresInputs */
/** @typedef {{}} Api_History_Inquiries_ReceivedInputs */
/** @typedef {{}} Api_History_LateInputs */
/** @typedef {{}} Api_History_Late_QuoteInputs */
/** @typedef {{}} Api_History_Lead_TimeInputs */
/** @typedef {{}} Api_History_No_SupplierInputs */
/** @typedef {{}} Api_History_Not_DueInputs */
/** @typedef {{}} Api_History_On_TimeInputs */
/** @typedef {{}} Api_History_Own_StockInputs */
/** @typedef {{}} Api_History_PartialInputs */
/** @typedef {{}} Api_History_PriceInputs */
/** @typedef {{}} Api_History_Provision_StoresInputs */
/** @typedef {{}} Api_History_QuotedInputs */
/** @typedef {{}} Api_History_Safety_StoresInputs */
/** @typedef {{}} Api_History_Sent_To_SuppliersInputs */
/** @typedef {{}} Api_History_Spare_Parts_ClearanceInputs */
/** @typedef {{}} Api_History_ValidatedInputs */
/** @typedef {{}} Api_History_Won_Full_Or_PartialInputs */
/** @typedef {{}} Api_Home_4_Weeks_AgoInputs */
/** @typedef {{}} Api_Home_Ack_SubInputs */
/** @typedef {{}} Api_Home_Ack_TitleInputs */
/** @typedef {{}} Api_Home_ActualInputs */
/** @typedef {{}} Api_Home_After_Hours_SubInputs */
/** @typedef {{}} Api_Home_After_Hours_TitleInputs */
/** @typedef {{}} Api_Home_All_CasesInputs */
/** @typedef {{}} Api_Home_All_Live_CasesInputs */
/** @typedef {{ amount: NonNullable<unknown>, than: NonNullable<unknown> }} Api_Home_Amount_VsInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Home_Approvals_In_QueueInputs */
/** @typedef {{ vessel: NonNullable<unknown> }} Api_Home_ArrivesInputs */
/** @typedef {{ vessel: NonNullable<unknown>, when: NonNullable<unknown> }} Api_Home_Arrives_WhenInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Home_Awaiting_CustomerInputs */
/** @typedef {{ supplier: NonNullable<unknown> }} Api_Home_Bill_DueInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Home_Billed_So_FarInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Home_Bills_To_MatchInputs */
/** @typedef {{}} Api_Home_Briefing_SubInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Home_Cases_In_QueueInputs */
/** @typedef {{}} Api_Home_Cash_SubInputs */
/** @typedef {{}} Api_Home_Cash_TitleInputs */
/** @typedef {{}} Api_Home_Commitment_BlockedInputs */
/** @typedef {{ caseId: NonNullable<unknown> }} Api_Home_ContinueInputs */
/** @typedef {{}} Api_Home_Daily_BriefingInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Home_DaysInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Home_Decisions_WaitingInputs */
/** @typedef {{}} Api_Home_DeliveriesInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Home_Deliveries_In_ProgressInputs */
/** @typedef {{}} Api_Home_Deliveries_In_Progress_LabelInputs */
/** @typedef {{ number: NonNullable<unknown> }} Api_Home_Drop_LeavesInputs */
/** @typedef {{}} Api_Home_ExpectedInputs */
/** @typedef {{}} Api_Home_Expected_Gp_NovInputs */
/** @typedef {{}} Api_Home_Follow_UpsInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Home_Follow_Ups_Due_TodayInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Home_Follow_Ups_TodayInputs */
/** @typedef {{ name: NonNullable<unknown> }} Api_Home_Good_MorningInputs */
/** @typedef {{}} Api_Home_Gp_SubInputs */
/** @typedef {{}} Api_Home_Gp_TitleInputs */
/** @typedef {{ in: NonNullable<unknown>, out: NonNullable<unknown> }} Api_Home_In_OutInputs */
/** @typedef {{}} Api_Home_InquiriesInputs */
/** @typedef {{}} Api_Home_Inquiries_4_WeeksInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Home_Integration_ExceptionsInputs */
/** @typedef {{ customer: NonNullable<unknown>, amount: NonNullable<unknown>, day: NonNullable<unknown> }} Api_Home_Invoice_DueInputs */
/** @typedef {{ customer: NonNullable<unknown> }} Api_Home_Invoice_Due_ShortInputs */
/** @typedef {{ customer: NonNullable<unknown>, amount: NonNullable<unknown>, day: NonNullable<unknown> }} Api_Home_Invoice_OverdueInputs */
/** @typedef {{ number: NonNullable<unknown>, status: NonNullable<unknown> }} Api_Home_Invoice_SubInputs */
/** @typedef {{ number: NonNullable<unknown>, status: NonNullable<unknown>, paid: NonNullable<unknown> }} Api_Home_Invoice_Sub_PaidInputs */
/** @typedef {{}} Api_Home_InvoicesInputs */
/** @typedef {{ count: NonNullable<unknown> }} Api_Home_Items_Awaiting_ApprovalInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Home_K_Past_DueInputs */
/** @typedef {{}} Api_Home_Last_WeekInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Home_Later_This_WeekInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Home_Live_CasesInputs */
/** @typedef {{}} Api_Home_Lost_CasesInputs */
/** @typedef {{}} Api_Home_Lost_SubInputs */
/** @typedef {{}} Api_Home_Lost_TitleInputs */
/** @typedef {{}} Api_Home_Median_DaysInputs */
/** @typedef {{}} Api_Home_Median_New_RfqsInputs */
/** @typedef {{}} Api_Home_Median_TargetInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Home_Messages_To_TriageInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Home_MinutesInputs */
/** @typedef {{}} Api_Home_Minutes_SeriesInputs */
/** @typedef {{ date: NonNullable<unknown> }} Api_Home_My_DayInputs */
/** @typedef {{}} Api_Home_My_TurnaroundInputs */
/** @typedef {{}} Api_Home_My_Turnaround_SubInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Home_N_TodayInputs */
/** @typedef {{}} Api_Home_Net_CashInputs */
/** @typedef {{}} Api_Home_New_CaseInputs */
/** @typedef {{ count: NonNullable<unknown> }} Api_Home_New_MessagesInputs */
/** @typedef {{}} Api_Home_Next_UpInputs */
/** @typedef {{}} Api_Home_No_ChangeInputs */
/** @typedef {{}} Api_Home_Nothing_Due_TodayInputs */
/** @typedef {{}} Api_Home_Nothing_Due_WeekInputs */
/** @typedef {{}} Api_Home_Nothing_Needs_YouInputs */
/** @typedef {{}} Api_Home_Open_ApprovalsInputs */
/** @typedef {{}} Api_Home_Out_Of_Hours_RfqsInputs */
/** @typedef {{}} Api_Home_PaymentsInputs */
/** @typedef {{}} Api_Home_PipelineInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Home_Pipeline_Steps_WeekInputs */
/** @typedef {{}} Api_Home_Pipeline_SubInputs */
/** @typedef {{}} Api_Home_Pipeline_TitleInputs */
/** @typedef {{ caseId: NonNullable<unknown> }} Api_Home_Po_MismatchInputs */
/** @typedef {{ vessel: NonNullable<unknown> }} Api_Home_Quote_DueInputs */
/** @typedef {{ vessel: NonNullable<unknown>, when: NonNullable<unknown> }} Api_Home_Quote_Due_WhenInputs */
/** @typedef {{ vessel: NonNullable<unknown>, when: NonNullable<unknown> }} Api_Home_Quote_LateInputs */
/** @typedef {{}} Api_Home_Quote_TurnaroundInputs */
/** @typedef {{}} Api_Home_QuotedInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Home_Quotes_Due_TomorrowInputs */
/** @typedef {{}} Api_Home_ReceiptsInputs */
/** @typedef {{}} Api_Home_ReceivablesInputs */
/** @typedef {{}} Api_Home_Receivables_By_AgeInputs */
/** @typedef {{}} Api_Home_Reminder_DraftedInputs */
/** @typedef {{ supplier: NonNullable<unknown> }} Api_Home_Reply_DueInputs */
/** @typedef {{}} Api_Home_Review_InboxInputs */
/** @typedef {{}} Api_Home_RfqsInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Home_Rfqs_Awaiting_ReplyInputs */
/** @typedef {{ impact: NonNullable<unknown> }} Api_Home_Safe_RetryInputs */
/** @typedef {{ than: NonNullable<unknown> }} Api_Home_Same_AsInputs */
/** @typedef {{}} Api_Home_Supplier_BillsInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Home_Supplier_Bills_OpenInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Home_Supplier_Replies_OutstandingInputs */
/** @typedef {{ supplier: NonNullable<unknown> }} Api_Home_Supplier_SilentInputs */
/** @typedef {{}} Api_Home_Target_1_DayInputs */
/** @typedef {{}} Api_Home_This_Week_Vs_LastInputs */
/** @typedef {{ currency: NonNullable<unknown>, n: NonNullable<unknown> }} Api_Home_ThousandsInputs */
/** @typedef {{}} Api_Home_Time_To_AcknowledgeInputs */
/** @typedef {{}} Api_Home_TodayInputs */
/** @typedef {{}} Api_Home_Turnaround_SubInputs */
/** @typedef {{}} Api_Home_Turnaround_TitleInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Home_Usd_Past_DueInputs */
/** @typedef {{}} Api_Home_Usd_Thousands_AllInputs */
/** @typedef {{}} Api_Home_Value_WonInputs */
/** @typedef {{}} Api_Home_Value_Won_SubInputs */
/** @typedef {{}} Api_Home_Value_Won_TitleInputs */
/** @typedef {{}} Api_Home_Vs_Prior_4_WeeksInputs */
/** @typedef {{ reference: NonNullable<unknown>, when: NonNullable<unknown>, last: NonNullable<unknown> }} Api_Home_Was_DueInputs */
/** @typedef {{}} Api_Home_WonInputs */
/** @typedef {{}} Api_Home_Won_4_WeeksInputs */
/** @typedef {{ days: NonNullable<unknown> }} Api_Insights_Shared_Days_OverdueInputs */
/** @typedef {{ days: NonNullable<unknown> }} Api_Insights_Shared_In_DaysInputs */
/** @typedef {{}} Api_Insights_Shared_Not_AllowedInputs */
/** @typedef {{ time: NonNullable<unknown> }} Api_Insights_Shared_Overdue_SinceInputs */
/** @typedef {{}} Api_Insights_Shared_TodayInputs */
/** @typedef {{ time: NonNullable<unknown> }} Api_Insights_Shared_Today_AtInputs */
/** @typedef {{}} Api_Insights_Shared_TomorrowInputs */
/** @typedef {{ time: NonNullable<unknown> }} Api_Insights_Shared_Tomorrow_AtInputs */
/** @typedef {{}} Api_Operations_Already_AcceptedInputs */
/** @typedef {{ number: NonNullable<unknown>, line: NonNullable<unknown>, field: NonNullable<unknown>, resolution: NonNullable<unknown> }} Api_Operations_Amend_ActivityInputs */
/** @typedef {{}} Api_Operations_As_QuotedInputs */
/** @typedef {{}} Api_Operations_Attach_ConfirmationInputs */
/** @typedef {{ line: NonNullable<unknown>, outcome: NonNullable<unknown>, hasWas: NonNullable<unknown>, was: NonNullable<unknown> }} Api_Operations_Award_Undo_ActivityInputs */
/** @typedef {{}} Api_Operations_Back_To_UndecidedInputs */
/** @typedef {{}} Api_Operations_Case_Not_FoundInputs */
/** @typedef {{}} Api_Operations_Closing_Needs_ReasonInputs */
/** @typedef {{}} Api_Operations_Commitment_BlockedInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Operations_Commitment_Blocked_ByInputs */
/** @typedef {{}} Api_Operations_Confirm_And_PrepareInputs */
/** @typedef {{}} Api_Operations_Confirm_Sales_OrderInputs */
/** @typedef {{}} Api_Operations_Confirmed_By_PhoneInputs */
/** @typedef {{}} Api_Operations_Costs_Hidden_SalesInputs */
/** @typedef {{}} Api_Operations_Customer_Po_Not_FoundInputs */
/** @typedef {{ line: NonNullable<unknown> }} Api_Operations_Decided_AgainInputs */
/** @typedef {{}} Api_Operations_Decision_StandsInputs */
/** @typedef {{ number: NonNullable<unknown>, signedBy: NonNullable<unknown> }} Api_Operations_Delivered_ActivityInputs */
/** @typedef {{}} Api_Operations_Delivery_Not_FoundInputs */
/** @typedef {{}} Api_Operations_Describe_AgreementInputs */
/** @typedef {{ done: NonNullable<unknown>, total: NonNullable<unknown>, number: NonNullable<unknown> }} Api_Operations_Drop_DeliveredInputs */
/** @typedef {{ number: NonNullable<unknown> }} Api_Operations_Einvoice_SubmittedInputs */
/** @typedef {{ number: NonNullable<unknown>, uuid: NonNullable<unknown> }} Api_Operations_Einvoice_Submitted_ActivityInputs */
/** @typedef {{ number: NonNullable<unknown> }} Api_Operations_Einvoice_ValidInputs */
/** @typedef {{ number: NonNullable<unknown>, uuid: NonNullable<unknown> }} Api_Operations_Einvoice_Valid_ActivityInputs */
/** @typedef {{}} Api_Operations_Einvoices_By_FinanceInputs */
/** @typedef {{ from: NonNullable<unknown>, was: NonNullable<unknown>, now: NonNullable<unknown>, email: NonNullable<unknown>, moved: NonNullable<unknown> }} Api_Operations_Eta_Change_ActivityInputs */
/** @typedef {{ hours: NonNullable<unknown>, n: NonNullable<unknown> }} Api_Operations_Eta_Moved_BlockerInputs */
/** @typedef {{ caseId: NonNullable<unknown>, at: NonNullable<unknown> }} Api_Operations_Eta_NotificationInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Operations_Eta_Notification_DetailInputs */
/** @typedef {{}} Api_Operations_Eta_Up_To_DateInputs */
/** @typedef {{}} Api_Operations_HeaderInputs */
/** @typedef {{ number: NonNullable<unknown>, delivery: NonNullable<unknown>, lines: NonNullable<unknown> }} Api_Operations_Invoice_Created_ActivityInputs */
/** @typedef {{ number: NonNullable<unknown> }} Api_Operations_Invoice_DeliveredInputs */
/** @typedef {{}} Api_Operations_Invoice_Not_FoundInputs */
/** @typedef {{}} Api_Operations_Invoices_By_FinanceInputs */
/** @typedef {{}} Api_Operations_Keep_Or_CloseInputs */
/** @typedef {{ line: NonNullable<unknown> }} Api_Operations_Kept_Open_AgainInputs */
/** @typedef {{}} Api_Operations_Launch_BoatInputs */
/** @typedef {{ launch: NonNullable<unknown>, at: NonNullable<unknown> }} Api_Operations_Launch_RebookedInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Operations_LineInputs */
/** @typedef {{ line: NonNullable<unknown> }} Api_Operations_Line_On_PoInputs */
/** @typedef {{}} Api_Operations_No_ChangesInputs */
/** @typedef {{}} Api_Operations_No_Customer_PoInputs */
/** @typedef {{}} Api_Operations_No_Customer_Po_YetInputs */
/** @typedef {{}} Api_Operations_No_Eta_UpdateInputs */
/** @typedef {{}} Api_Operations_No_MismatchInputs */
/** @typedef {{}} Api_Operations_No_Order_BookInputs */
/** @typedef {{ line: NonNullable<unknown>, outcome: NonNullable<unknown>, hasReason: NonNullable<unknown>, reason: NonNullable<unknown> }} Api_Operations_Not_Awarded_ActivityInputs */
/** @typedef {{}} Api_Operations_Nothing_OpenInputs */
/** @typedef {{}} Api_Operations_Only_Confirmed_InvoicedInputs */
/** @typedef {{ number: NonNullable<unknown>, n: NonNullable<unknown> }} Api_Operations_Order_Confirmed_ActivityInputs */
/** @typedef {{}} Api_Operations_Po_Not_FoundInputs */
/** @typedef {{ number: NonNullable<unknown>, caseId: NonNullable<unknown>, open: NonNullable<unknown> }} Api_Operations_Po_Read_ActivityInputs */
/** @typedef {{ number: NonNullable<unknown>, changes: NonNullable<unknown> }} Api_Operations_Recheck_ActivityInputs */
/** @typedef {{}} Api_Operations_Recheck_AvailabilityInputs */
/** @typedef {{}} Api_Operations_Recheck_FirstInputs */
/** @typedef {{}} Api_Operations_Recheck_PriceInputs */
/** @typedef {{}} Api_Operations_Recheck_Then_ApproveInputs */
/** @typedef {{ number: NonNullable<unknown>, hours: NonNullable<unknown> }} Api_Operations_Reconfirm_TaskInputs */
/** @typedef {{}} Api_Operations_Rejected_Tax_IdInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Operations_Resolve_MismatchesInputs */
/** @typedef {{}} Api_Operations_Sign_In_FirstInputs */
/** @typedef {{ number: NonNullable<unknown> }} Api_Operations_Submit_EinvoiceInputs */
/** @typedef {{ taxId: NonNullable<unknown> }} Api_Operations_Tax_Id_ErrorInputs */
/** @typedef {{}} Api_Operations_UnchangedInputs */
/** @typedef {{ line: NonNullable<unknown> }} Api_Operations_Undecided_AgainInputs */
/** @typedef {{}} Api_Operations_Who_SignedInputs */
/** @typedef {{ number: NonNullable<unknown> }} Api_Order_To_Cash_Approval_Detail_CleanInputs */
/** @typedef {{ number: NonNullable<unknown> }} Api_Order_To_Cash_Approval_Detail_FlaggedInputs */
/** @typedef {{ number: NonNullable<unknown>, supplier: NonNullable<unknown> }} Api_Order_To_Cash_Approval_TitleInputs */
/** @typedef {{ reason: NonNullable<unknown> }} Api_Order_To_Cash_Duplicate_BillInputs */
/** @typedef {{ changed: NonNullable<unknown> }} Api_Order_To_Cash_Eta_UpdatedInputs */
/** @typedef {{ number: NonNullable<unknown>, delivery: NonNullable<unknown> }} Api_Order_To_Cash_Invoice_CreatedInputs */
/** @typedef {{ number: NonNullable<unknown> }} Api_Order_To_Cash_Invoice_Created_From_DeliveryInputs */
/** @typedef {{}} Api_Order_To_Cash_No_BillInputs */
/** @typedef {{ number: NonNullable<unknown> }} Api_Order_To_Cash_Notification_TitleInputs */
/** @typedef {{}} Api_Order_To_Cash_Order_ConfirmedInputs */
/** @typedef {{ pos: NonNullable<unknown> }} Api_Order_To_Cash_Order_Confirmed_PosInputs */
/** @typedef {{ created: NonNullable<unknown>, open: NonNullable<unknown> }} Api_Order_To_Cash_Po_CheckedInputs */
/** @typedef {{}} Api_Order_To_Cash_Po_Not_FoundInputs */
/** @typedef {{ caseId: NonNullable<unknown>, lines: NonNullable<unknown> }} Api_Platform_Acc_1Inputs */
/** @typedef {{}} Api_Platform_Acc_10_OpenInputs */
/** @typedef {{ caseId: NonNullable<unknown> }} Api_Platform_Acc_10_SettledInputs */
/** @typedef {{}} Api_Platform_Acc_2Inputs */
/** @typedef {{ qty: NonNullable<unknown>, pack: NonNullable<unknown>, total: NonNullable<unknown> }} Api_Platform_Acc_3Inputs */
/** @typedef {{}} Api_Platform_Acc_4Inputs */
/** @typedef {{}} Api_Platform_Acc_5Inputs */
/** @typedef {{ count: NonNullable<unknown> }} Api_Platform_Acc_6Inputs */
/** @typedef {{}} Api_Platform_Acc_7Inputs */
/** @typedef {{}} Api_Platform_Acc_8Inputs */
/** @typedef {{}} Api_Platform_Acc_9Inputs */
/** @typedef {{ status: NonNullable<unknown>, key: NonNullable<unknown> }} Api_Platform_Already_DoneInputs */
/** @typedef {{ name: NonNullable<unknown>, caseId: NonNullable<unknown> }} Api_Platform_Already_OwnsInputs */
/** @typedef {{}} Api_Platform_Bank_Detail_ChangeInputs */
/** @typedef {{ caseId: NonNullable<unknown>, line: NonNullable<unknown>, description: NonNullable<unknown> }} Api_Platform_Case_LineInputs */
/** @typedef {{}} Api_Platform_Case_Not_FoundInputs */
/** @typedef {{}} Api_Platform_Case_RecordInputs */
/** @typedef {{ type: NonNullable<unknown>, on: NonNullable<unknown>, approvers: NonNullable<unknown> }} Api_Platform_Check_Bank_DetailInputs */
/** @typedef {{}} Api_Platform_Check_Bank_Two_PeopleInputs */
/** @typedef {{}} Api_Platform_Check_Sales_CostsInputs */
/** @typedef {{ name: NonNullable<unknown>, hidden: NonNullable<unknown> }} Api_Platform_Check_Sales_Costs_DetailInputs */
/** @typedef {{ count: NonNullable<unknown> }} Api_Platform_ClarificationsInputs */
/** @typedef {{}} Api_Platform_Connection_Not_FoundInputs */
/** @typedef {{}} Api_Platform_CustomerInputs */
/** @typedef {{ when: NonNullable<unknown> }} Api_Platform_Deadline_PassedInputs */
/** @typedef {{ when: NonNullable<unknown> }} Api_Platform_Deadline_Within_24hInputs */
/** @typedef {{ number: NonNullable<unknown>, status: NonNullable<unknown> }} Api_Platform_Delivery_NoteInputs */
/** @typedef {{}} Api_Platform_Exception_Not_FoundInputs */
/** @typedef {{ caseId: NonNullable<unknown>, name: NonNullable<unknown>, moved: NonNullable<unknown> }} Api_Platform_Handed_OverInputs */
/** @typedef {{ customer: NonNullable<unknown>, vessel: NonNullable<unknown>, hasPort: NonNullable<unknown>, port: NonNullable<unknown>, hasEta: NonNullable<unknown>, eta: NonNullable<unknown>, stage: NonNullable<unknown>, due: NonNullable<unknown> }} Api_Platform_Handover_CaseInputs */
/** @typedef {{ line: NonNullable<unknown>, description: NonNullable<unknown>, pct: NonNullable<unknown> }} Api_Platform_Handover_Check_LineInputs */
/** @typedef {{ rule: NonNullable<unknown> }} Api_Platform_Handover_Contact_RuleInputs */
/** @typedef {{ name: NonNullable<unknown>, moved: NonNullable<unknown> }} Api_Platform_Handover_FromInputs */
/** @typedef {{ ready: NonNullable<unknown>, waiting: NonNullable<unknown>, blocked: NonNullable<unknown>, noOffer: NonNullable<unknown>, total: NonNullable<unknown> }} Api_Platform_Handover_LinesInputs */
/** @typedef {{ next: NonNullable<unknown>, hasBlocker: NonNullable<unknown>, blocker: NonNullable<unknown> }} Api_Platform_Handover_NextInputs */
/** @typedef {{ hasLine: NonNullable<unknown>, line: NonNullable<unknown>, to: NonNullable<unknown>, question: NonNullable<unknown> }} Api_Platform_Handover_QuestionInputs */
/** @typedef {{ caseId: NonNullable<unknown>, to: NonNullable<unknown> }} Api_Platform_Handover_SubjectInputs */
/** @typedef {{ title: NonNullable<unknown>, hasDue: NonNullable<unknown>, due: NonNullable<unknown> }} Api_Platform_Handover_TaskInputs */
/** @typedef {{ caseId: NonNullable<unknown>, to: NonNullable<unknown> }} Api_Platform_Handover_TitleInputs */
/** @typedef {{ key: NonNullable<unknown> }} Api_Platform_Invoice_Already_AcceptedInputs */
/** @typedef {{ key: NonNullable<unknown> }} Api_Platform_Invoice_Submitted_OnceInputs */
/** @typedef {{}} Api_Platform_Language_SavedInputs */
/** @typedef {{}} Api_Platform_Low_ConfidenceInputs */
/** @typedef {{ key: NonNullable<unknown>, pending: NonNullable<unknown>, linked: NonNullable<unknown>, imported: NonNullable<unknown> }} Api_Platform_Mailbox_RecheckedInputs */
/** @typedef {{}} Api_Platform_Management_PermissionsInputs */
/** @typedef {{}} Api_Platform_Management_RulesInputs */
/** @typedef {{}} Api_Platform_My_Language_ArInputs */
/** @typedef {{}} Api_Platform_My_Language_EnInputs */
/** @typedef {{}} Api_Platform_Needs_A_PersonInputs */
/** @typedef {{}} Api_Platform_No_Shift_ReasonInputs */
/** @typedef {{}} Api_Platform_Not_Yet_ShownInputs */
/** @typedef {{}} Api_Platform_Note_RequiredInputs */
/** @typedef {{}} Api_Platform_Office_Hours_ReasonInputs */
/** @typedef {{ minutes: NonNullable<unknown>, next: NonNullable<unknown> }} Api_Platform_On_Call_DetailInputs */
/** @typedef {{ at: NonNullable<unknown> }} Api_Platform_On_Call_TitleInputs */
/** @typedef {{ minutes: NonNullable<unknown> }} Api_Platform_On_Duty_ReasonInputs */
/** @typedef {{}} Api_Platform_Only_Owner_ReassignsInputs */
/** @typedef {{ count: NonNullable<unknown> }} Api_Platform_Open_TasksInputs */
/** @typedef {{}} Api_Platform_PassInputs */
/** @typedef {{ role: NonNullable<unknown> }} Api_Platform_Permissions_ActivityInputs */
/** @typedef {{}} Api_Platform_Pick_On_DutyInputs */
/** @typedef {{}} Api_Platform_Pick_SomeoneInputs */
/** @typedef {{ line: NonNullable<unknown>, qc: NonNullable<unknown>, received: NonNullable<unknown>, ordered: NonNullable<unknown>, hasRest: NonNullable<unknown>, rest: NonNullable<unknown> }} Api_Platform_Receipt_NoteInputs */
/** @typedef {{}} Api_Platform_Reconnect_RolesInputs */
/** @typedef {{ account: NonNullable<unknown> }} Api_Platform_ReconnectedInputs */
/** @typedef {{ kind: NonNullable<unknown>, account: NonNullable<unknown> }} Api_Platform_Reconnected_ActivityInputs */
/** @typedef {{}} Api_Platform_Reconnected_NoteInputs */
/** @typedef {{ account: NonNullable<unknown>, message: NonNullable<unknown> }} Api_Platform_Reconnected_WithInputs */
/** @typedef {{ impact: NonNullable<unknown> }} Api_Platform_Resolved_By_RetryInputs */
/** @typedef {{ message: NonNullable<unknown> }} Api_Platform_Retried_SafelyInputs */
/** @typedef {{ summary: NonNullable<unknown>, hasNote: NonNullable<unknown>, note: NonNullable<unknown> }} Api_Platform_Reviewed_ActivityInputs */
/** @typedef {{}} Api_Platform_Role_Not_FoundInputs */
/** @typedef {{}} Api_Platform_Roster_ActivityInputs */
/** @typedef {{}} Api_Platform_Roster_EditorsInputs */
/** @typedef {{ name: NonNullable<unknown> }} Api_Platform_Rule_EnabledInputs */
/** @typedef {{ name: NonNullable<unknown> }} Api_Platform_Rule_Enabled_ActivityInputs */
/** @typedef {{}} Api_Platform_Rule_Not_FoundInputs */
/** @typedef {{ name: NonNullable<unknown> }} Api_Platform_Rule_PausedInputs */
/** @typedef {{ name: NonNullable<unknown> }} Api_Platform_Rule_Paused_ActivityInputs */
/** @typedef {{}} Api_Platform_Runs_At_SettlementInputs */
/** @typedef {{}} Api_Platform_SalesInputs */
/** @typedef {{}} Api_Platform_Senior_ContactsInputs */
/** @typedef {{}} Api_Platform_Settings_ManagementInputs */
/** @typedef {{}} Api_Platform_Shift_Not_FoundInputs */
/** @typedef {{}} Api_Platform_Sign_InInputs */
/** @typedef {{ at: NonNullable<unknown>, name: NonNullable<unknown>, hasBackup: NonNullable<unknown>, backup: NonNullable<unknown> }} Api_Platform_Simulated_ActivityInputs */
/** @typedef {{}} Api_Platform_Staging_ActivityInputs */
/** @typedef {{}} Api_Platform_Staging_ManagementInputs */
/** @typedef {{ key: NonNullable<unknown> }} Api_Platform_Step_RerunInputs */
/** @typedef {{}} Api_Platform_SystemInputs */
/** @typedef {{}} Api_Platform_System_MailboxInputs */
/** @typedef {{}} Api_Platform_The_RecordInputs */
/** @typedef {{ count: NonNullable<unknown> }} Api_Platform_Timeline_EntriesInputs */
/** @typedef {{ classification: NonNullable<unknown> }} Api_Platform_Uncertain_MatchInputs */
/** @typedef {{}} Api_Platform_UnclassifiedInputs */
/** @typedef {{}} Api_Platform_Unknown_PermissionInputs */
/** @typedef {{}} Api_Platform_Unknown_SettingInputs */
/** @typedef {{}} Api_Platform_Valid_TimeInputs */
/** @typedef {{ caseId: NonNullable<unknown> }} Api_Platform_You_Now_OwnInputs */
/** @typedef {{ list: NonNullable<unknown> }} Api_Profit_Actuals_ConfirmedInputs */
/** @typedef {{}} Api_Profit_All_Charges_ConfirmedInputs */
/** @typedef {{ count: NonNullable<unknown> }} Api_Profit_All_PaidInputs */
/** @typedef {{ number: NonNullable<unknown>, status: NonNullable<unknown> }} Api_Profit_BillInputs */
/** @typedef {{ number: NonNullable<unknown>, status: NonNullable<unknown>, reason: NonNullable<unknown> }} Api_Profit_Bill_HeldInputs */
/** @typedef {{ number: NonNullable<unknown> }} Api_Profit_Bill_NumberInputs */
/** @typedef {{ label: NonNullable<unknown>, billed: NonNullable<unknown>, estimate: NonNullable<unknown> }} Api_Profit_Billed_Vs_EstimateInputs */
/** @typedef {{ checks: NonNullable<unknown> }} Api_Profit_Cant_CloseInputs */
/** @typedef {{ actual: NonNullable<unknown>, margin: NonNullable<unknown>, expected: NonNullable<unknown> }} Api_Profit_Case_Closed_ActivityInputs */
/** @typedef {{}} Api_Profit_Case_Not_FoundInputs */
/** @typedef {{}} Api_Profit_Check_ActualsInputs */
/** @typedef {{}} Api_Profit_Check_BillsInputs */
/** @typedef {{}} Api_Profit_Check_ClaimsInputs */
/** @typedef {{}} Api_Profit_Check_DeliveriesInputs */
/** @typedef {{}} Api_Profit_Check_EinvoiceInputs */
/** @typedef {{}} Api_Profit_Check_PaidInputs */
/** @typedef {{ ref: NonNullable<unknown>, title: NonNullable<unknown> }} Api_Profit_Claim_LineInputs */
/** @typedef {{}} Api_Profit_Claim_Not_FoundInputs */
/** @typedef {{ creditNote: NonNullable<unknown> }} Api_Profit_Claim_OffsetInputs */
/** @typedef {{ against: NonNullable<unknown> }} Api_Profit_Claim_OpenInputs */
/** @typedef {{ ref: NonNullable<unknown>, title: NonNullable<unknown>, against: NonNullable<unknown> }} Api_Profit_Claim_Open_WithInputs */
/** @typedef {{ ref: NonNullable<unknown>, creditNote: NonNullable<unknown>, amount: NonNullable<unknown> }} Api_Profit_Claim_Settled_ActivityInputs */
/** @typedef {{ ref: NonNullable<unknown>, title: NonNullable<unknown>, creditNote: NonNullable<unknown> }} Api_Profit_Claim_Settled_ByInputs */
/** @typedef {{}} Api_Profit_Confirm_ActualsInputs */
/** @typedef {{}} Api_Profit_Confirmed_On_PricingInputs */
/** @typedef {{}} Api_Profit_EstimateInputs */
/** @typedef {{}} Api_Profit_Finance_OnlyInputs */
/** @typedef {{}} Api_Profit_Hidden_From_SalesInputs */
/** @typedef {{}} Api_Profit_No_Bill_YetInputs */
/** @typedef {{}} Api_Profit_No_ClaimsInputs */
/** @typedef {{}} Api_Profit_No_DeliveryInputs */
/** @typedef {{}} Api_Profit_No_InvoiceInputs */
/** @typedef {{}} Api_Profit_No_Po_Or_BillInputs */
/** @typedef {{}} Api_Profit_No_Single_BalanceInputs */
/** @typedef {{}} Api_Profit_None_Case_ClosedInputs */
/** @typedef {{}} Api_Profit_Not_ApplicableInputs */
/** @typedef {{}} Api_Profit_Not_Invoiced_TodayInputs */
/** @typedef {{ number: NonNullable<unknown>, amount: NonNullable<unknown> }} Api_Profit_OpenInputs */
/** @typedef {{}} Api_Profit_Open_Balance_TodayInputs */
/** @typedef {{ number: NonNullable<unknown>, amount: NonNullable<unknown>, due: NonNullable<unknown> }} Api_Profit_Open_DueInputs */
/** @typedef {{ number: NonNullable<unknown> }} Api_Profit_PoInputs */
/** @typedef {{ supplier: NonNullable<unknown>, number: NonNullable<unknown> }} Api_Profit_Po_LineInputs */
/** @typedef {{ reference: NonNullable<unknown> }} Api_Profit_ReceiptInputs */
/** @typedef {{ reference: NonNullable<unknown>, day: NonNullable<unknown> }} Api_Profit_Receipt_OnInputs */
/** @typedef {{}} Api_Profit_Record_Credit_NoteInputs */
/** @typedef {{}} Api_Profit_Record_ReceiptInputs */
/** @typedef {{ who: NonNullable<unknown> }} Api_Profit_Signed_ByInputs */
/** @typedef {{}} Api_Profit_Signed_By_VesselInputs */
/** @typedef {{ label: NonNullable<unknown>, estimate: NonNullable<unknown> }} Api_Profit_Still_EstimateInputs */
/** @typedef {{ decision: NonNullable<unknown> }} Api_Quotations_Decision_RecordedInputs */
/** @typedef {{ number: NonNullable<unknown> }} Api_Quotations_Entered_In_PortalInputs */
/** @typedef {{}} Api_Quotations_Give_Lost_ReasonInputs */
/** @typedef {{}} Api_Quotations_New_VersionInputs */
/** @typedef {{ number: NonNullable<unknown>, to: NonNullable<unknown> }} Api_Quotations_Sent_ToInputs */
/** @typedef {{}} Api_Service_Sign_InInputs */
/** @typedef {{}} Api_Sourcing_A_PersonInputs */
/** @typedef {{}} Api_Sourcing_Ack_Already_ActivityInputs */
/** @typedef {{}} Api_Sourcing_Ack_By_Hand_ActivityInputs */
/** @typedef {{}} Api_Sourcing_Ack_Default_BodyInputs */
/** @typedef {{}} Api_Sourcing_Ack_Default_SubjectInputs */
/** @typedef {{ owner: NonNullable<unknown>, backup: NonNullable<unknown> }} Api_Sourcing_Ack_FooterInputs */
/** @typedef {{ template: NonNullable<unknown> }} Api_Sourcing_Ack_Sent_ActivityInputs */
/** @typedef {{ line: NonNullable<unknown>, name: NonNullable<unknown> }} Api_Sourcing_Already_AskedInputs */
/** @typedef {{ caseId: NonNullable<unknown> }} Api_Sourcing_Already_Linked_No_NewInputs */
/** @typedef {{}} Api_Sourcing_Already_WaitingInputs */
/** @typedef {{ reference: NonNullable<unknown>, date: NonNullable<unknown> }} Api_Sourcing_Auto_Created_SourceInputs */
/** @typedef {{}} Api_Sourcing_Back_In_QueueInputs */
/** @typedef {{}} Api_Sourcing_Back_To_DecisionInputs */
/** @typedef {{}} Api_Sourcing_Below_ThresholdInputs */
/** @typedef {{ lines: NonNullable<unknown>, flag: NonNullable<unknown> }} Api_Sourcing_BlockerInputs */
/** @typedef {{}} Api_Sourcing_Cannot_SupplyInputs */
/** @typedef {{ caseId: NonNullable<unknown> }} Api_Sourcing_Case_Already_CreatedInputs */
/** @typedef {{ caseId: NonNullable<unknown>, ack: NonNullable<unknown> }} Api_Sourcing_Case_CreatedInputs */
/** @typedef {{}} Api_Sourcing_Case_Not_FoundInputs */
/** @typedef {{}} Api_Sourcing_Case_Number_On_CreationInputs */
/** @typedef {{}} Api_Sourcing_Cash_TermsInputs */
/** @typedef {{ channel: NonNullable<unknown>, subject: NonNullable<unknown>, count: NonNullable<unknown>, who: NonNullable<unknown> }} Api_Sourcing_Created_ActivityInputs */
/** @typedef {{ ref: NonNullable<unknown>, caseId: NonNullable<unknown> }} Api_Sourcing_Customer_Ref_IsInputs */
/** @typedef {{}} Api_Sourcing_Declined_EventInputs */
/** @typedef {{}} Api_Sourcing_Desk_OnlyInputs */
/** @typedef {{}} Api_Sourcing_Draft_GoneInputs */
/** @typedef {{ count: NonNullable<unknown> }} Api_Sourcing_Drafts_BackInputs */
/** @typedef {{}} Api_Sourcing_Drafts_ChangedInputs */
/** @typedef {{ count: NonNullable<unknown> }} Api_Sourcing_Drafts_ReadyInputs */
/** @typedef {{}} Api_Sourcing_Duplicate_KeptInputs */
/** @typedef {{ caseId: NonNullable<unknown> }} Api_Sourcing_Duplicate_LinkedInputs */
/** @typedef {{ name: NonNullable<unknown> }} Api_Sourcing_Escalated_ToInputs */
/** @typedef {{ vessel: NonNullable<unknown> }} Api_Sourcing_For_VesselInputs */
/** @typedef {{}} Api_Sourcing_Forwarded_By_StaffInputs */
/** @typedef {{}} Api_Sourcing_General_FullInputs */
/** @typedef {{ lines: NonNullable<unknown> }} Api_Sourcing_Held_BackInputs */
/** @typedef {{ name: NonNullable<unknown>, customers: NonNullable<unknown>, vessels: NonNullable<unknown>, suppliers: NonNullable<unknown>, prices: NonNullable<unknown>, saved: NonNullable<unknown> }} Api_Sourcing_History_Approved_ActivityInputs */
/** @typedef {{}} Api_Sourcing_History_ReadyInputs */
/** @typedef {{ customers: NonNullable<unknown>, vessels: NonNullable<unknown>, suppliers: NonNullable<unknown>, prices: NonNullable<unknown>, uncertain: NonNullable<unknown> }} Api_Sourcing_History_Ready_DetailInputs */
/** @typedef {{ hash: NonNullable<unknown>, subject: NonNullable<unknown>, at: NonNullable<unknown> }} Api_Sourcing_Identical_AttachmentsInputs */
/** @typedef {{}} Api_Sourcing_Import_ApprovedInputs */
/** @typedef {{ count: NonNullable<unknown> }} Api_Sourcing_Invited_On_ManyInputs */
/** @typedef {{ count: NonNullable<unknown>, changed: NonNullable<unknown> }} Api_Sourcing_Lines_OfferedInputs */
/** @typedef {{ subject: NonNullable<unknown>, from: NonNullable<unknown>, who: NonNullable<unknown>, offer: NonNullable<unknown> }} Api_Sourcing_Linked_ActivityInputs */
/** @typedef {{}} Api_Sourcing_Linked_After_Review_EventInputs */
/** @typedef {{}} Api_Sourcing_Management_ApprovesInputs */
/** @typedef {{ caseId: NonNullable<unknown>, reference: NonNullable<unknown>, pct: NonNullable<unknown> }} Api_Sourcing_Matched_ToInputs */
/** @typedef {{}} Api_Sourcing_Message_Not_FoundInputs */
/** @typedef {{}} Api_Sourcing_ModelInputs */
/** @typedef {{}} Api_Sourcing_Needs_ClarificationInputs */
/** @typedef {{ caseId: NonNullable<unknown> }} Api_Sourcing_New_Case_AssignedInputs */
/** @typedef {{ customer: NonNullable<unknown>, vessel: NonNullable<unknown>, due: NonNullable<unknown> }} Api_Sourcing_New_Case_DetailInputs */
/** @typedef {{ name: NonNullable<unknown>, reference: NonNullable<unknown> }} Api_Sourcing_New_Supplier_ActivityInputs */
/** @typedef {{ line: NonNullable<unknown> }} Api_Sourcing_New_Supplier_ConfirmInputs */
/** @typedef {{ domain: NonNullable<unknown> }} Api_Sourcing_New_Supplier_CreatedInputs */
/** @typedef {{}} Api_Sourcing_New_Supplier_DetailInputs */
/** @typedef {{ domain: NonNullable<unknown> }} Api_Sourcing_New_Supplier_SavedInputs */
/** @typedef {{}} Api_Sourcing_No_New_CaseInputs */
/** @typedef {{}} Api_Sourcing_No_ReferenceInputs */
/** @typedef {{}} Api_Sourcing_No_RuleInputs */
/** @typedef {{}} Api_Sourcing_No_SpecialistInputs */
/** @typedef {{}} Api_Sourcing_None_WaitingInputs */
/** @typedef {{}} Api_Sourcing_Not_Filed_By_ReviewInputs */
/** @typedef {{}} Api_Sourcing_Not_History_ItemInputs */
/** @typedef {{ reference: NonNullable<unknown> }} Api_Sourcing_Not_Invited_EventInputs */
/** @typedef {{}} Api_Sourcing_Nothing_ExtractedInputs */
/** @typedef {{}} Api_Sourcing_Nothing_NewInputs */
/** @typedef {{}} Api_Sourcing_Nothing_To_SendInputs */
/** @typedef {{ changed: NonNullable<unknown>, subject: NonNullable<unknown> }} Api_Sourcing_Offer_Received_EventInputs */
/** @typedef {{ count: NonNullable<unknown>, reference: NonNullable<unknown> }} Api_Sourcing_Offers_CapturedInputs */
/** @typedef {{ name: NonNullable<unknown> }} Api_Sourcing_Only_DeciderInputs */
/** @typedef {{ name: NonNullable<unknown> }} Api_Sourcing_Only_FilerInputs */
/** @typedef {{}} Api_Sourcing_Organise_FirstInputs */
/** @typedef {{}} Api_Sourcing_Original_Not_CaseInputs */
/** @typedef {{ text: NonNullable<unknown>, source: NonNullable<unknown> }} Api_Sourcing_Original_TextInputs */
/** @typedef {{ count: NonNullable<unknown> }} Api_Sourcing_Pending_ItemsInputs */
/** @typedef {{ price: NonNullable<unknown>, converted: NonNullable<unknown>, pack: NonNullable<unknown> }} Api_Sourcing_Per_Kg_UncertainInputs */
/** @typedef {{}} Api_Sourcing_Pick_CaseInputs */
/** @typedef {{}} Api_Sourcing_Pick_LineInputs */
/** @typedef {{}} Api_Sourcing_Price_Unit_UnclearInputs */
/** @typedef {{ ref: NonNullable<unknown> }} Api_Sourcing_Ref_In_BodyInputs */
/** @typedef {{ ref: NonNullable<unknown> }} Api_Sourcing_Ref_In_SubjectInputs */
/** @typedef {{ n: NonNullable<unknown>, after: NonNullable<unknown> }} Api_Sourcing_Reminder_Escalated_EventInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Sourcing_Reminder_N_SentInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Sourcing_Reminder_Sent_EventInputs */
/** @typedef {{}} Api_Sourcing_Reminders_StopInputs */
/** @typedef {{ subject: NonNullable<unknown>, from: NonNullable<unknown>, who: NonNullable<unknown> }} Api_Sourcing_Reopened_ActivityInputs */
/** @typedef {{}} Api_Sourcing_Reply_CountedInputs */
/** @typedef {{ subject: NonNullable<unknown> }} Api_Sourcing_Reply_Matched_EventInputs */
/** @typedef {{}} Api_Sourcing_Rfq_AlternativesInputs */
/** @typedef {{}} Api_Sourcing_Rfq_Best_RegardsInputs */
/** @typedef {{}} Api_Sourcing_Rfq_Date_BelowInputs */
/** @typedef {{}} Api_Sourcing_Rfq_DearInputs */
/** @typedef {{}} Api_Sourcing_Rfq_ExactInputs */
/** @typedef {{ reference: NonNullable<unknown> }} Api_Sourcing_Rfq_Keep_ReferenceInputs */
/** @typedef {{}} Api_Sourcing_Rfq_Not_FoundInputs */
/** @typedef {{ part: NonNullable<unknown> }} Api_Sourcing_Rfq_PartInputs */
/** @typedef {{ port: NonNullable<unknown>, date: NonNullable<unknown> }} Api_Sourcing_Rfq_Please_QuoteInputs */
/** @typedef {{}} Api_Sourcing_Rfq_Please_StateInputs */
/** @typedef {{ reference: NonNullable<unknown>, due: NonNullable<unknown> }} Api_Sourcing_Rfq_SubjectInputs */
/** @typedef {{}} Api_Sourcing_Rfq_To_PortInputs */
/** @typedef {{ name: NonNullable<unknown>, reference: NonNullable<unknown>, invited: NonNullable<unknown> }} Api_Sourcing_Sender_DiffersInputs */
/** @typedef {{ domain: NonNullable<unknown>, name: NonNullable<unknown> }} Api_Sourcing_Sender_DomainInputs */
/** @typedef {{ sender: NonNullable<unknown> }} Api_Sourcing_Sender_UnknownInputs */
/** @typedef {{ count: NonNullable<unknown>, who: NonNullable<unknown>, mode: NonNullable<unknown>, references: NonNullable<unknown> }} Api_Sourcing_Sent_ActivityInputs */
/** @typedef {{}} Api_Sourcing_Sent_EventInputs */
/** @typedef {{ reference: NonNullable<unknown>, name: NonNullable<unknown>, after: NonNullable<unknown> }} Api_Sourcing_Silent_ActivityInputs */
/** @typedef {{ after: NonNullable<unknown>, caseId: NonNullable<unknown>, due: NonNullable<unknown> }} Api_Sourcing_Silent_DetailInputs */
/** @typedef {{ name: NonNullable<unknown>, reference: NonNullable<unknown> }} Api_Sourcing_Silent_TitleInputs */
/** @typedef {{}} Api_Sourcing_Sir_MadamInputs */
/** @typedef {{ category: NonNullable<unknown> }} Api_Sourcing_SpecialistInputs */
/** @typedef {{}} Api_Sourcing_Step_DraftInputs */
/** @typedef {{}} Api_Sourcing_Step_EscalateInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Sourcing_Step_ReminderInputs */
/** @typedef {{}} Api_Sourcing_Step_SentInputs */
/** @typedef {{ status: NonNullable<unknown> }} Api_Sourcing_Step_StoppedInputs */
/** @typedef {{ status: NonNullable<unknown> }} Api_Sourcing_Step_UninvitedInputs */
/** @typedef {{ subject: NonNullable<unknown> }} Api_Sourcing_Subject_ChangedInputs */
/** @typedef {{}} Api_Sourcing_Subject_KeptInputs */
/** @typedef {{}} Api_Sourcing_SupplierInputs */
/** @typedef {{ quoted: NonNullable<unknown> }} Api_Sourcing_Supplier_History_SourceInputs */
/** @typedef {{ name: NonNullable<unknown>, version: NonNullable<unknown> }} Api_Sourcing_Template_LabelInputs */
/** @typedef {{}} Api_Sourcing_Uncertain_ReviewInputs */
/** @typedef {{}} Api_Sourcing_UnclassifiableInputs */
/** @typedef {{ calls: NonNullable<unknown>, ports: NonNullable<unknown> }} Api_Sourcing_Vessel_History_NoteInputs */
/** @typedef {{ name: NonNullable<unknown>, reference: NonNullable<unknown>, status: NonNullable<unknown> }} Api_Sourcing_Was_Asked_OnInputs */
/** @typedef {{}} Api_Sourcing_Your_VesselInputs */
/** @typedef {{ name: NonNullable<unknown> }} Api_Visuals_ArrivesInputs */
/** @typedef {{ name: NonNullable<unknown> }} Api_Visuals_Calendar_ArrivesInputs */
/** @typedef {{ number: NonNullable<unknown>, status: NonNullable<unknown> }} Api_Visuals_Calendar_DeliveryInputs */
/** @typedef {{ number: NonNullable<unknown>, customer: NonNullable<unknown> }} Api_Visuals_Calendar_Invoice_DueInputs */
/** @typedef {{ name: NonNullable<unknown> }} Api_Visuals_Calendar_Quote_DueInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Visuals_DaysInputs */
/** @typedef {{}} Api_Visuals_Gp_ActualInputs */
/** @typedef {{}} Api_Visuals_Gp_At_QuoteInputs */
/** @typedef {{}} Api_Visuals_Gp_FreightInputs */
/** @typedef {{}} Api_Visuals_Gp_FxInputs */
/** @typedef {{}} Api_Visuals_Gp_RecoveredInputs */
/** @typedef {{}} Api_Visuals_Gp_Supplier_PricesInputs */
/** @typedef {{ n: NonNullable<unknown> }} Api_Visuals_MinutesInputs */
/** @typedef {{ name: NonNullable<unknown> }} Api_Visuals_Quote_DueInputs */
/** @typedef {{}} Api_Visuals_Target_AcknowledgeInputs */
/** @typedef {{}} Api_Visuals_Target_On_TimeInputs */
/** @typedef {{}} Api_Visuals_Target_TurnaroundInputs */
/** @typedef {{}} Api_Visuals_Target_Win_RateInputs */
/** @typedef {{}} Automations_Ai_NoteInputs */
/** @typedef {{}} Automations_Auto_AssignInputs */
/** @typedef {{}} Automations_Auto_CalculateInputs */
/** @typedef {{}} Automations_Auto_CaptureInputs */
/** @typedef {{}} Automations_Auto_PrepareInputs */
/** @typedef {{}} Automations_Auto_RemindInputs */
/** @typedef {{}} Automations_Confirm_HeadingInputs */
/** @typedef {{}} Automations_Confirm_LabelInputs */
/** @typedef {{ title: NonNullable<unknown> }} Automations_Confirm_TextInputs */
/** @typedef {{}} Automations_Enabled_NoteInputs */
/** @typedef {{}} Automations_Figure_AiInputs */
/** @typedef {{}} Automations_Figure_EnabledInputs */
/** @typedef {{}} Automations_Mark_ReviewedInputs */
/** @typedef {{ count: NonNullable<unknown>, total: NonNullable<unknown> }} Automations_Of_RulesInputs */
/** @typedef {{}} Automations_OpenInputs */
/** @typedef {{}} Automations_People_CommitmentsInputs */
/** @typedef {{}} Automations_People_MessagesInputs */
/** @typedef {{}} Automations_People_OverridesInputs */
/** @typedef {{}} Automations_People_PricesInputs */
/** @typedef {{}} Automations_People_UncertainInputs */
/** @typedef {{}} Automations_Review_EmptyInputs */
/** @typedef {{}} Automations_Review_NoteInputs */
/** @typedef {{}} Automations_Reviewed_DoneInputs */
/** @typedef {{}} Case_Overview_DeliveredInputs */
/** @typedef {{ next: NonNullable<unknown> }} Case_Overview_EndedInputs */
/** @typedef {{ label: NonNullable<unknown>, value: NonNullable<unknown>, total: NonNullable<unknown> }} Case_Overview_Gauge_A11yInputs */
/** @typedef {{}} Case_Overview_InvoicedInputs */
/** @typedef {{}} Case_Overview_OrderedInputs */
/** @typedef {{ next: NonNullable<unknown> }} Case_Overview_PausedInputs */
/** @typedef {{ phase: NonNullable<unknown> }} Case_Overview_PhaseInputs */
/** @typedef {{}} Case_Overview_ReceivedInputs */
/** @typedef {{ step: NonNullable<unknown>, total: NonNullable<unknown> }} Case_Overview_StepInputs */
/** @typedef {{}} Case_Overview_Summary_ContextInputs */
/** @typedef {{}} Case_Overview_Summary_LabelInputs */
/** @typedef {{}} Cash_Amount_PaidInputs */
/** @typedef {{}} Cash_AppliedInputs */
/** @typedef {{ supplier: NonNullable<unknown> }} Cash_Applied_AlertInputs */
/** @typedef {{}} Cash_Apply_Bank_DetailsInputs */
/** @typedef {{}} Cash_Apply_DetailsInputs */
/** @typedef {{ supplier: NonNullable<unknown> }} Cash_Apply_DoneInputs */
/** @typedef {{ supplier: NonNullable<unknown> }} Cash_Apply_HeadingInputs */
/** @typedef {{}} Cash_Apply_TextInputs */
/** @typedef {{}} Cash_Bank_ReferenceInputs */
/** @typedef {{}} Cash_Bridge_LabelInputs */
/** @typedef {{}} Cash_Bridge_NoteInputs */
/** @typedef {{}} Cash_Call_Back_OnInputs */
/** @typedef {{}} Cash_CurrencyInputs */
/** @typedef {{}} Cash_Current_AccountInputs */
/** @typedef {{}} Cash_Fixed_CostsInputs */
/** @typedef {{}} Cash_Forecast_LabelInputs */
/** @typedef {{}} Cash_Forecast_SubheadInputs */
/** @typedef {{ fixed: NonNullable<unknown> }} Cash_Forecast_Subhead_FixedInputs */
/** @typedef {{ supplier: NonNullable<unknown> }} Cash_Held_AlertInputs */
/** @typedef {{}} Cash_Invoice_NumbersInputs */
/** @typedef {{}} Cash_Invoice_Numbers_HintInputs */
/** @typedef {{}} Cash_Match_PromptInputs */
/** @typedef {{}} Cash_Net_8_WeeksInputs */
/** @typedef {{}} Cash_Net_CashInputs */
/** @typedef {{}} Cash_Net_NoteInputs */
/** @typedef {{ phone: NonNullable<unknown> }} Cash_NeverInputs */
/** @typedef {{}} Cash_No_Open_InvoicesInputs */
/** @typedef {{}} Cash_On_This_DeviceInputs */
/** @typedef {{}} Cash_Paid_ByInputs */
/** @typedef {{}} Cash_Read_And_MatchInputs */
/** @typedef {{}} Cash_ReceiptsInputs */
/** @typedef {{}} Cash_Remittance_PlaceholderInputs */
/** @typedef {{}} Cash_Remittance_TextInputs */
/** @typedef {{}} Cash_Request_Came_ByInputs */
/** @typedef {{}} Cash_RequestedInputs */
/** @typedef {{ bank: NonNullable<unknown>, iban: NonNullable<unknown> }} Cash_Requested_ValueInputs */
/** @typedef {{}} Cash_Series_InInputs */
/** @typedef {{}} Cash_Series_OutInputs */
/** @typedef {{}} Cash_Status_ApprovedInputs */
/** @typedef {{}} Cash_Status_Approved_1_Of_2Inputs */
/** @typedef {{}} Cash_Status_PendingInputs */
/** @typedef {{}} Cash_Status_RejectedInputs */
/** @typedef {{}} Cash_Step_AppliedInputs */
/** @typedef {{}} Cash_Step_Call_BackInputs */
/** @typedef {{}} Cash_Step_First_ApprovalInputs */
/** @typedef {{}} Cash_Step_Request_ReceivedInputs */
/** @typedef {{}} Cash_Step_Second_ApprovalInputs */
/** @typedef {{}} Cash_SuppliersInputs */
/** @typedef {{}} Cash_Waiting_For_ApproverInputs */
/** @typedef {{}} Cash_You_DecidedInputs */
/** @typedef {{ line: NonNullable<unknown> }} Commercial_Acceptance_DoneInputs */
/** @typedef {{ line: NonNullable<unknown> }} Commercial_Acceptance_TextInputs */
/** @typedef {{}} Commercial_Accepted_In_WritingInputs */
/** @typedef {{}} Commercial_All_Lines_PricedInputs */
/** @typedef {{}} Commercial_Allocation_LinesInputs */
/** @typedef {{}} Commercial_Allocation_QtyInputs */
/** @typedef {{}} Commercial_Allocation_ValueInputs */
/** @typedef {{ title: NonNullable<unknown>, status: NonNullable<unknown> }} Commercial_Approval_PendingInputs */
/** @typedef {{}} Commercial_Approval_Requested_DoneInputs */
/** @typedef {{}} Commercial_Approval_Requested_ShortInputs */
/** @typedef {{ max: NonNullable<unknown> }} Commercial_Approval_RuleInputs */
/** @typedef {{}} Commercial_ApproveInputs */
/** @typedef {{ number: NonNullable<unknown> }} Commercial_Approved_DoneInputs */
/** @typedef {{}} Commercial_Charge_ActualInputs */
/** @typedef {{}} Commercial_Charge_ConfirmedInputs */
/** @typedef {{}} Commercial_Charge_EstimateInputs */
/** @typedef {{ allocation: NonNullable<unknown> }} Commercial_Charges_AllocatedInputs */
/** @typedef {{}} Commercial_Charges_VatInputs */
/** @typedef {{}} Commercial_Check_AgainInputs */
/** @typedef {{ supplier: NonNullable<unknown> }} Commercial_Check_NoInputs */
/** @typedef {{ n: NonNullable<unknown>, supplier: NonNullable<unknown>, offered: NonNullable<unknown>, note: NonNullable<unknown> }} Commercial_Check_OfferInputs */
/** @typedef {{}} Commercial_Check_OffersInputs */
/** @typedef {{ n: NonNullable<unknown>, supplier: NonNullable<unknown> }} Commercial_Check_QuestionInputs */
/** @typedef {{ description: NonNullable<unknown>, requested: NonNullable<unknown>, rules: NonNullable<unknown> }} Commercial_Check_RequestedInputs */
/** @typedef {{ supplier: NonNullable<unknown> }} Commercial_Check_YesInputs */
/** @typedef {{}} Commercial_Col_AmountInputs */
/** @typedef {{}} Commercial_Col_Approved_QuoteInputs */
/** @typedef {{}} Commercial_Col_ChargeInputs */
/** @typedef {{}} Commercial_Col_ChecksInputs */
/** @typedef {{}} Commercial_Col_FieldInputs */
/** @typedef {{}} Commercial_Col_LandedInputs */
/** @typedef {{ unit: NonNullable<unknown> }} Commercial_Col_Landed_PerInputs */
/** @typedef {{}} Commercial_Col_LeadInputs */
/** @typedef {{}} Commercial_Col_Line_SupplierInputs */
/** @typedef {{}} Commercial_Col_Margin_PctInputs */
/** @typedef {{}} Commercial_Col_MarkupInputs */
/** @typedef {{}} Commercial_Col_MatchInputs */
/** @typedef {{}} Commercial_Col_OfferedInputs */
/** @typedef {{}} Commercial_Col_Plus_SharedInputs */
/** @typedef {{}} Commercial_Col_PortalInputs */
/** @typedef {{}} Commercial_Col_Price_OfferedInputs */
/** @typedef {{ currency: NonNullable<unknown> }} Commercial_Col_SellInputs */
/** @typedef {{}} Commercial_Col_StatusInputs */
/** @typedef {{}} Commercial_Col_SupplierInputs */
/** @typedef {{}} Commercial_Col_TermsInputs */
/** @typedef {{ currency: NonNullable<unknown> }} Commercial_Col_UnitInputs */
/** @typedef {{ unit: NonNullable<unknown> }} Commercial_Col_Unit_PriceInputs */
/** @typedef {{}} Commercial_Compare_ByInputs */
/** @typedef {{}} Commercial_Continue_PricingInputs */
/** @typedef {{}} Commercial_Correction_NoteInputs */
/** @typedef {{}} Commercial_Correction_SentInputs */
/** @typedef {{ pct: NonNullable<unknown> }} Commercial_CoverageInputs */
/** @typedef {{ pct: NonNullable<unknown>, expiry: NonNullable<unknown> }} Commercial_Coverage_ExpiryInputs */
/** @typedef {{}} Commercial_Create_RevisionInputs */
/** @typedef {{}} Commercial_CurrencyInputs */
/** @typedef {{}} Commercial_CustomerInputs */
/** @typedef {{}} Commercial_Customer_DecisionInputs */
/** @typedef {{}} Commercial_Customer_DiscountInputs */
/** @typedef {{}} Commercial_Customer_PortalInputs */
/** @typedef {{}} Commercial_Customers_PortalInputs */
/** @typedef {{}} Commercial_DecisionInputs */
/** @typedef {{}} Commercial_Decision_LostInputs */
/** @typedef {{}} Commercial_Decision_Note_LabelInputs */
/** @typedef {{}} Commercial_Decision_Partially_WonInputs */
/** @typedef {{}} Commercial_Decision_PlaceholderInputs */
/** @typedef {{}} Commercial_Decision_Revision_RequestedInputs */
/** @typedef {{ number: NonNullable<unknown> }} Commercial_Decision_TextInputs */
/** @typedef {{}} Commercial_Decision_WonInputs */
/** @typedef {{}} Commercial_DifferenceInputs */
/** @typedef {{}} Commercial_Email_From_OdooInputs */
/** @typedef {{ to: NonNullable<unknown> }} Commercial_Email_ToInputs */
/** @typedef {{ day: NonNullable<unknown>, days: NonNullable<unknown> }} Commercial_Eta_DaysInputs */
/** @typedef {{}} Commercial_EvidenceInputs */
/** @typedef {{}} Commercial_Evidence_DefaultInputs */
/** @typedef {{ count: NonNullable<unknown>, type: NonNullable<unknown> }} Commercial_ExceptionsInputs */
/** @typedef {{}} Commercial_Fig_Expected_ProfitInputs */
/** @typedef {{}} Commercial_Fig_Input_VatInputs */
/** @typedef {{}} Commercial_Fig_LandedInputs */
/** @typedef {{}} Commercial_Fig_Lines_PricedInputs */
/** @typedef {{}} Commercial_Fig_MarginInputs */
/** @typedef {{}} Commercial_Fig_MarkupInputs */
/** @typedef {{}} Commercial_Fig_SellingInputs */
/** @typedef {{}} Commercial_Gross_ProfitInputs */
/** @typedef {{ port: NonNullable<unknown> }} Commercial_How_ComparedInputs */
/** @typedef {{}} Commercial_Landed_CostInputs */
/** @typedef {{ charges: NonNullable<unknown> }} Commercial_Landed_Note_ConfirmedInputs */
/** @typedef {{ charges: NonNullable<unknown>, count: NonNullable<unknown> }} Commercial_Landed_Note_EstimatesInputs */
/** @typedef {{}} Commercial_LanguageInputs */
/** @typedef {{ days: NonNullable<unknown> }} Commercial_Lead_DaysInputs */
/** @typedef {{ number: NonNullable<unknown>, vessel: NonNullable<unknown>, ref: NonNullable<unknown>, port: NonNullable<unknown> }} Commercial_Letter_BodyInputs */
/** @typedef {{}} Commercial_Letter_CompanyInputs */
/** @typedef {{ name: NonNullable<unknown> }} Commercial_Letter_DearInputs */
/** @typedef {{}} Commercial_Letter_RegardsInputs */
/** @typedef {{ day: NonNullable<unknown> }} Commercial_Letter_ValidInputs */
/** @typedef {{ description: NonNullable<unknown>, requested: NonNullable<unknown> }} Commercial_Line_RequestedInputs */
/** @typedef {{ selected: NonNullable<unknown>, total: NonNullable<unknown> }} Commercial_Lines_SelectedInputs */
/** @typedef {{ line: NonNullable<unknown> }} Commercial_Margin_For_LineInputs */
/** @typedef {{ margin: NonNullable<unknown>, markup: NonNullable<unknown> }} Commercial_Margin_MarkupInputs */
/** @typedef {{ profit: NonNullable<unknown>, sell: NonNullable<unknown> }} Commercial_Margin_NoteInputs */
/** @typedef {{}} Commercial_Margin_Per_LineInputs */
/** @typedef {{ target: NonNullable<unknown> }} Commercial_Margin_Vs_TargetInputs */
/** @typedef {{ profit: NonNullable<unknown>, landed: NonNullable<unknown> }} Commercial_Markup_NoteInputs */
/** @typedef {{}} Commercial_MatchInputs */
/** @typedef {{}} Commercial_MessageInputs */
/** @typedef {{ freight: NonNullable<unknown>, note: NonNullable<unknown> }} Commercial_Metric_FreightInputs */
/** @typedef {{ amount: NonNullable<unknown> }} Commercial_Metric_LandedInputs */
/** @typedef {{ note: NonNullable<unknown> }} Commercial_Metric_No_FreightInputs */
/** @typedef {{}} Commercial_No_ExceptionsInputs */
/** @typedef {{}} Commercial_No_IssuesInputs */
/** @typedef {{}} Commercial_No_Lines_YetInputs */
/** @typedef {{}} Commercial_No_OffersInputs */
/** @typedef {{}} Commercial_No_RecommendationInputs */
/** @typedef {{}} Commercial_NoneInputs */
/** @typedef {{ missing: NonNullable<unknown> }} Commercial_Not_Sent_YetInputs */
/** @typedef {{}} Commercial_Note_Approver_PlaceholderInputs */
/** @typedef {{}} Commercial_Note_For_ApproverInputs */
/** @typedef {{}} Commercial_Of_Selling_PriceInputs */
/** @typedef {{}} Commercial_Of_The_LinesInputs */
/** @typedef {{ supplier: NonNullable<unknown>, version: NonNullable<unknown> }} Commercial_Offer_VersionInputs */
/** @typedef {{}} Commercial_OkInputs */
/** @typedef {{}} Commercial_On_Top_LandedInputs */
/** @typedef {{}} Commercial_Open_ApprovalsInputs */
/** @typedef {{}} Commercial_Paper_AddressInputs */
/** @typedef {{}} Commercial_Paper_AttentionInputs */
/** @typedef {{}} Commercial_Paper_BrandInputs */
/** @typedef {{}} Commercial_Paper_ClientInputs */
/** @typedef {{}} Commercial_Paper_CompanyInputs */
/** @typedef {{ currency: NonNullable<unknown>, fx: NonNullable<unknown> }} Commercial_Paper_ConvertedInputs */
/** @typedef {{ date: NonNullable<unknown> }} Commercial_Paper_DateInputs */
/** @typedef {{ port: NonNullable<unknown>, eta: NonNullable<unknown> }} Commercial_Paper_DeliveryInputs */
/** @typedef {{}} Commercial_Paper_DescInputs */
/** @typedef {{ pct: NonNullable<unknown> }} Commercial_Paper_DiscountInputs */
/** @typedef {{ version: NonNullable<unknown> }} Commercial_Paper_DraftInputs */
/** @typedef {{ currency: NonNullable<unknown> }} Commercial_Paper_GrandInputs */
/** @typedef {{}} Commercial_Paper_IntroInputs */
/** @typedef {{ number: NonNullable<unknown> }} Commercial_Paper_NoInputs */
/** @typedef {{}} Commercial_Paper_PartInputs */
/** @typedef {{ terms: NonNullable<unknown> }} Commercial_Paper_PayInputs */
/** @typedef {{}} Commercial_Paper_PortInputs */
/** @typedef {{ port: NonNullable<unknown>, eta: NonNullable<unknown> }} Commercial_Paper_Port_EtaInputs */
/** @typedef {{ prepared: NonNullable<unknown> }} Commercial_Paper_PreparedInputs */
/** @typedef {{ prepared: NonNullable<unknown>, approved: NonNullable<unknown> }} Commercial_Paper_Prepared_ApprovedInputs */
/** @typedef {{ currency: NonNullable<unknown> }} Commercial_Paper_PriceInputs */
/** @typedef {{}} Commercial_Paper_QtyInputs */
/** @typedef {{}} Commercial_Paper_Qty_RuleInputs */
/** @typedef {{ ref: NonNullable<unknown> }} Commercial_Paper_RefInputs */
/** @typedef {{}} Commercial_Paper_RemarksInputs */
/** @typedef {{}} Commercial_Paper_SInputs */
/** @typedef {{ name: NonNullable<unknown> }} Commercial_Paper_SignatureInputs */
/** @typedef {{}} Commercial_Paper_Signature_PendingInputs */
/** @typedef {{}} Commercial_Paper_SupersededInputs */
/** @typedef {{}} Commercial_Paper_TitleInputs */
/** @typedef {{ currency: NonNullable<unknown> }} Commercial_Paper_TotalInputs */
/** @typedef {{}} Commercial_Paper_UomInputs */
/** @typedef {{ day: NonNullable<unknown> }} Commercial_Paper_ValidInputs */
/** @typedef {{}} Commercial_Paper_VatInputs */
/** @typedef {{}} Commercial_Paper_VesselInputs */
/** @typedef {{}} Commercial_Paper_WishInputs */
/** @typedef {{ target: NonNullable<unknown>, min: NonNullable<unknown>, max: NonNullable<unknown>, fx: NonNullable<unknown> }} Commercial_Policy_NoteInputs */
/** @typedef {{ target: NonNullable<unknown> }} Commercial_Policy_TargetInputs */
/** @typedef {{}} Commercial_Portal_All_MatchInputs */
/** @typedef {{ fields: NonNullable<unknown> }} Commercial_Portal_DiffsInputs */
/** @typedef {{}} Commercial_Portal_EmptyInputs */
/** @typedef {{}} Commercial_Portal_NoteInputs */
/** @typedef {{ number: NonNullable<unknown> }} Commercial_Preview_QuoteInputs */
/** @typedef {{}} Commercial_Price_Build_UpInputs */
/** @typedef {{ per: NonNullable<unknown>, total: NonNullable<unknown> }} Commercial_Price_NoteInputs */
/** @typedef {{}} Commercial_Pricing_PolicyInputs */
/** @typedef {{}} Commercial_PrintInputs */
/** @typedef {{ pct: NonNullable<unknown> }} Commercial_Profit_ShareInputs */
/** @typedef {{ supplier: NonNullable<unknown> }} Commercial_Quantity_FromInputs */
/** @typedef {{ number: NonNullable<unknown> }} Commercial_Quote_ApprovedInputs */
/** @typedef {{ number: NonNullable<unknown> }} Commercial_Quote_ReturnedInputs */
/** @typedef {{ day: NonNullable<unknown> }} Commercial_ReadyInputs */
/** @typedef {{}} Commercial_ReasonInputs */
/** @typedef {{}} Commercial_Reason_BestInputs */
/** @typedef {{}} Commercial_Reason_Not_BestInputs */
/** @typedef {{}} Commercial_Reason_PlaceholderInputs */
/** @typedef {{ offer: NonNullable<unknown>, landed: NonNullable<unknown>, baseUnit: NonNullable<unknown> }} Commercial_Recommendation_BestInputs */
/** @typedef {{}} Commercial_Recommendation_HeadingInputs */
/** @typedef {{ split: NonNullable<unknown>, cost: NonNullable<unknown> }} Commercial_Recommendation_SplitInputs */
/** @typedef {{ split: NonNullable<unknown>, cost: NonNullable<unknown>, saves: NonNullable<unknown> }} Commercial_Recommendation_Split_SavesInputs */
/** @typedef {{}} Commercial_RecordInputs */
/** @typedef {{}} Commercial_Record_AcceptanceInputs */
/** @typedef {{}} Commercial_Record_Acceptance_ConfirmInputs */
/** @typedef {{}} Commercial_Record_DecisionInputs */
/** @typedef {{}} Commercial_Request_ApprovalInputs */
/** @typedef {{ lines: NonNullable<unknown>, sell: NonNullable<unknown>, margin: NonNullable<unknown>, type: NonNullable<unknown> }} Commercial_Request_Approval_TextInputs */
/** @typedef {{ requested: NonNullable<unknown>, rules: NonNullable<unknown> }} Commercial_Requested_RulesInputs */
/** @typedef {{}} Commercial_ReturnInputs */
/** @typedef {{ number: NonNullable<unknown> }} Commercial_Return_HeadingInputs */
/** @typedef {{}} Commercial_Return_PlaceholderInputs */
/** @typedef {{ number: NonNullable<unknown> }} Commercial_Return_TextInputs */
/** @typedef {{}} Commercial_Returned_DoneInputs */
/** @typedef {{ number: NonNullable<unknown> }} Commercial_Revise_HeadingInputs */
/** @typedef {{}} Commercial_Revise_PlaceholderInputs */
/** @typedef {{ version: NonNullable<unknown>, number: NonNullable<unknown> }} Commercial_Revise_TextInputs */
/** @typedef {{}} Commercial_Sales_NoteInputs */
/** @typedef {{}} Commercial_Save_SelectionInputs */
/** @typedef {{}} Commercial_SelectInputs */
/** @typedef {{ line: NonNullable<unknown>, supplier: NonNullable<unknown> }} Commercial_Select_Done_BestInputs */
/** @typedef {{ line: NonNullable<unknown> }} Commercial_Select_HeadingInputs */
/** @typedef {{ offer: NonNullable<unknown>, qty: NonNullable<unknown>, unit: NonNullable<unknown>, landed: NonNullable<unknown> }} Commercial_Select_Offer_LineInputs */
/** @typedef {{}} Commercial_SelectedInputs */
/** @typedef {{ selected: NonNullable<unknown>, inferred: NonNullable<unknown> }} Commercial_Selected_NoteInputs */
/** @typedef {{ selected: NonNullable<unknown>, reason: NonNullable<unknown>, inferred: NonNullable<unknown> }} Commercial_Selected_Note_ReasonInputs */
/** @typedef {{ qty: NonNullable<unknown> }} Commercial_Selected_QtyInputs */
/** @typedef {{ line: NonNullable<unknown> }} Commercial_Selection_SavedInputs */
/** @typedef {{ sell: NonNullable<unknown>, currency: NonNullable<unknown>, fx: NonNullable<unknown> }} Commercial_Sell_NoteInputs */
/** @typedef {{ sell: NonNullable<unknown>, currency: NonNullable<unknown>, fx: NonNullable<unknown>, discount: NonNullable<unknown> }} Commercial_Sell_Note_DiscountInputs */
/** @typedef {{}} Commercial_SendInputs */
/** @typedef {{}} Commercial_Send_Ai_DraftInputs */
/** @typedef {{}} Commercial_Send_Correction_HeadingInputs */
/** @typedef {{ to: NonNullable<unknown>, subject: NonNullable<unknown> }} Commercial_Send_Correction_TextInputs */
/** @typedef {{ to: NonNullable<unknown>, number: NonNullable<unknown>, vessel: NonNullable<unknown>, ref: NonNullable<unknown> }} Commercial_Send_Email_LineInputs */
/** @typedef {{ number: NonNullable<unknown> }} Commercial_Send_HeadingInputs */
/** @typedef {{ portal: NonNullable<unknown> }} Commercial_Send_Portal_LineInputs */
/** @typedef {{}} Commercial_Send_To_CustomerInputs */
/** @typedef {{}} Commercial_Send_To_SupplierInputs */
/** @typedef {{ when: NonNullable<unknown>, method: NonNullable<unknown> }} Commercial_Sent_ViaInputs */
/** @typedef {{}} Commercial_Shared_AllocatedInputs */
/** @typedef {{}} Commercial_Shared_ChargesInputs */
/** @typedef {{}} Commercial_Split_AcrossInputs */
/** @typedef {{ qty: NonNullable<unknown>, unit: NonNullable<unknown> }} Commercial_Split_Adds_UpInputs */
/** @typedef {{ line: NonNullable<unknown> }} Commercial_Split_HeadingInputs */
/** @typedef {{ offer: NonNullable<unknown>, landed: NonNullable<unknown>, baseUnit: NonNullable<unknown>, max: NonNullable<unknown>, unit: NonNullable<unknown> }} Commercial_Split_Part_NoteInputs */
/** @typedef {{}} Commercial_Split_ReasonInputs */
/** @typedef {{}} Commercial_Step_Approval_RequestedInputs */
/** @typedef {{}} Commercial_Step_ApprovedInputs */
/** @typedef {{}} Commercial_Step_PreparedInputs */
/** @typedef {{}} Commercial_Step_SentInputs */
/** @typedef {{}} Commercial_Submission_MethodInputs */
/** @typedef {{}} Commercial_Supplier_CostInputs */
/** @typedef {{}} Commercial_Tag_AgencyInputs */
/** @typedef {{}} Commercial_Tag_Ai_CheckInputs */
/** @typedef {{}} Commercial_Tag_Ai_DraftInputs */
/** @typedef {{}} Commercial_Tag_Best_FitInputs */
/** @typedef {{}} Commercial_Tag_Cheapest_UnitInputs */
/** @typedef {{}} Commercial_Tag_Own_StockInputs */
/** @typedef {{ target: NonNullable<unknown>, min: NonNullable<unknown> }} Commercial_Target_MinInputs */
/** @typedef {{ terms: NonNullable<unknown> }} Commercial_Terms_No_ExpiryInputs */
/** @typedef {{ day: NonNullable<unknown>, terms: NonNullable<unknown> }} Commercial_Terms_ValidInputs */
/** @typedef {{ count: NonNullable<unknown> }} Commercial_To_FollowInputs */
/** @typedef {{}} Commercial_Total_SharedInputs */
/** @typedef {{}} Commercial_Unit_PriceInputs */
/** @typedef {{ line: NonNullable<unknown>, description: NonNullable<unknown>, status: NonNullable<unknown> }} Commercial_Unpriced_LineInputs */
/** @typedef {{}} Commercial_Upload_CompareInputs */
/** @typedef {{}} Commercial_Use_SplitInputs */
/** @typedef {{}} Commercial_Vat_NoteInputs */
/** @typedef {{}} Commercial_View_QuotationInputs */
/** @typedef {{}} Commercial_What_ChangesInputs */
/** @typedef {{}} Commercial_Within_PolicyInputs */
/** @typedef {{}} Control_Room_Ageing_CenterInputs */
/** @typedef {{}} Control_Room_Ageing_LabelInputs */
/** @typedef {{}} Control_Room_Ai_DraftInputs */
/** @typedef {{}} Control_Room_All_CasesInputs */
/** @typedef {{}} Control_Room_ApprovalsInputs */
/** @typedef {{}} Control_Room_Ask_FootnoteInputs */
/** @typedef {{}} Control_Room_Ask_IntroInputs */
/** @typedef {{}} Control_Room_Ask_NameInputs */
/** @typedef {{}} Control_Room_Ask_PlaceholderInputs */
/** @typedef {{}} Control_Room_Ask_QuestionInputs */
/** @typedef {{}} Control_Room_Ask_ReadingInputs */
/** @typedef {{}} Control_Room_AssistantInputs */
/** @typedef {{ at: NonNullable<unknown>, count: NonNullable<unknown> }} Control_Room_Briefing_SummarisedInputs */
/** @typedef {{ count: NonNullable<unknown> }} Control_Room_Briefing_WrittenInputs */
/** @typedef {{}} Control_Room_Days_LabelInputs */
/** @typedef {{ total: NonNullable<unknown>, day: NonNullable<unknown>, count: NonNullable<unknown> }} Control_Room_Days_SummaryInputs */
/** @typedef {{}} Control_Room_EyebrowInputs */
/** @typedef {{}} Control_Room_Figure_Avg_Time_To_QuoteInputs */
/** @typedef {{}} Control_Room_Figure_Gross_ProfitInputs */
/** @typedef {{}} Control_Room_Figure_Open_RfqsInputs */
/** @typedef {{}} Control_Room_Figure_Receivables_OpenInputs */
/** @typedef {{}} Control_Room_Figure_Waiting_On_SuppliersInputs */
/** @typedef {{}} Control_Room_Figure_Win_RateInputs */
/** @typedef {{}} Control_Room_Funnel_12wInputs */
/** @typedef {{}} Control_Room_Funnel_4wInputs */
/** @typedef {{}} Control_Room_Funnel_Note_12wInputs */
/** @typedef {{}} Control_Room_Funnel_Note_4wInputs */
/** @typedef {{}} Control_Room_HeadingInputs */
/** @typedef {{ count: NonNullable<unknown> }} Control_Room_InquiriesInputs */
/** @typedef {{}} Control_Room_Lost_CenterInputs */
/** @typedef {{}} Control_Room_Lost_LabelInputs */
/** @typedef {{}} Control_Room_Money_WithheldInputs */
/** @typedef {{ month: NonNullable<unknown>, note: NonNullable<unknown> }} Control_Room_Month_NoteInputs */
/** @typedef {{ points: NonNullable<unknown> }} Control_Room_Range_MonthsInputs */
/** @typedef {{ points: NonNullable<unknown> }} Control_Room_Range_WeeksInputs */
/** @typedef {{}} Control_Room_Receivables_PayablesInputs */
/** @typedef {{}} Control_Room_SubtitleInputs */
/** @typedef {{}} Control_Room_SummariseInputs */
/** @typedef {{}} Growth_Column_ImoInputs */
/** @typedef {{}} Growth_Column_ManagerInputs */
/** @typedef {{}} Growth_Column_SuppliedInputs */
/** @typedef {{}} Growth_Column_TypeInputs */
/** @typedef {{}} Growth_Column_VesselInputs */
/** @typedef {{}} Growth_Extract_CompanyInputs */
/** @typedef {{}} Growth_Extract_ExpiresInputs */
/** @typedef {{}} Growth_Extract_Expires_HintInputs */
/** @typedef {{}} Growth_Extract_IssuedInputs */
/** @typedef {{}} Growth_Extract_LabelInputs */
/** @typedef {{}} Growth_Extract_RegistrationInputs */
/** @typedef {{}} Growth_Extract_TaxInputs */
/** @typedef {{}} Growth_Extract_WhatInputs */
/** @typedef {{ count: NonNullable<unknown>, size: NonNullable<unknown>, supplied: NonNullable<unknown> }} Growth_Fleet_SupportingInputs */
/** @typedef {{}} Growth_Not_YetInputs */
/** @typedef {{}} Growth_SuppliedInputs */
/** @typedef {{}} Home_Away_ContextInputs */
/** @typedef {{}} Home_Away_LabelInputs */
/** @typedef {{}} Home_Figure_Awaiting_Customer_DecisionInputs */
/** @typedef {{}} Home_Figure_Awaiting_Internal_ApprovalInputs */
/** @typedef {{}} Home_Figure_Awaiting_SupplierInputs */
/** @typedef {{}} Home_Figure_Deliveries_In_ProgressInputs */
/** @typedef {{}} Home_Figure_Expected_Gross_Profit_NovInputs */
/** @typedef {{}} Home_Figure_Inquiries_4_WeeksInputs */
/** @typedef {{}} Home_Figure_My_Quote_TurnaroundInputs */
/** @typedef {{}} Home_Figure_Net_Cash_8_WeeksInputs */
/** @typedef {{}} Home_Figure_Out_Of_Hours_RfqsInputs */
/** @typedef {{}} Home_Figure_Quote_TurnaroundInputs */
/** @typedef {{}} Home_Figure_ReceivablesInputs */
/** @typedef {{}} Home_Figure_Time_To_AcknowledgeInputs */
/** @typedef {{}} Home_Figure_Won_4_WeeksInputs */
/** @typedef {{}} Home_LateInputs */
/** @typedef {{}} Inbox_Ack_By_HandInputs */
/** @typedef {{ template: NonNullable<unknown> }} Inbox_Ack_Note_ManualInputs */
/** @typedef {{ template: NonNullable<unknown> }} Inbox_Ack_Note_OnceInputs */
/** @typedef {{}} Inbox_Ack_On_CreateInputs */
/** @typedef {{ when: NonNullable<unknown> }} Inbox_Ack_SentInputs */
/** @typedef {{}} Inbox_Ai_DraftInputs */
/** @typedef {{ rule: NonNullable<unknown> }} Inbox_Assignment_RuleInputs */
/** @typedef {{ rule: NonNullable<unknown> }} Inbox_Assignment_Rule_ChangeInputs */
/** @typedef {{}} Inbox_BackupInputs */
/** @typedef {{ caseId: NonNullable<unknown> }} Inbox_Case_CreatedInputs */
/** @typedef {{ caseId: NonNullable<unknown> }} Inbox_Case_Was_CreatedInputs */
/** @typedef {{ kind: NonNullable<unknown>, account: NonNullable<unknown>, status: NonNullable<unknown> }} Inbox_ChannelInputs */
/** @typedef {{}} Inbox_Check_OriginalInputs */
/** @typedef {{}} Inbox_Clarification_SubjectInputs */
/** @typedef {{}} Inbox_Col_ConfidenceInputs */
/** @typedef {{}} Inbox_Col_ItemInputs */
/** @typedef {{}} Inbox_Col_Part_NoInputs */
/** @typedef {{}} Inbox_Col_QtyInputs */
/** @typedef {{}} Inbox_Col_SourceInputs */
/** @typedef {{}} Inbox_Col_UnitInputs */
/** @typedef {{ customer: NonNullable<unknown>, lines: NonNullable<unknown>, owner: NonNullable<unknown> }} Inbox_Create_RfqInputs */
/** @typedef {{ customer: NonNullable<unknown>, lines: NonNullable<unknown>, flagged: NonNullable<unknown>, owner: NonNullable<unknown> }} Inbox_Create_Rfq_FlaggedInputs */
/** @typedef {{ customer: NonNullable<unknown>, lines: NonNullable<unknown>, owner: NonNullable<unknown> }} Inbox_Create_ServiceInputs */
/** @typedef {{ customer: NonNullable<unknown>, lines: NonNullable<unknown>, flagged: NonNullable<unknown>, owner: NonNullable<unknown> }} Inbox_Create_Service_FlaggedInputs */
/** @typedef {{}} Inbox_ExtractInputs */
/** @typedef {{}} Inbox_Extract_TextInputs */
/** @typedef {{}} Inbox_Extract_Text_FilesInputs */
/** @typedef {{}} Inbox_Flag_Auto_ReplyInputs */
/** @typedef {{}} Inbox_Flag_Auto_Reply_NoteInputs */
/** @typedef {{}} Inbox_Flag_BankInputs */
/** @typedef {{}} Inbox_Flag_Bank_NoteInputs */
/** @typedef {{}} Inbox_Flag_Cannot_SupplyInputs */
/** @typedef {{}} Inbox_Flag_Cannot_Supply_NoteInputs */
/** @typedef {{ name: NonNullable<unknown>, email: NonNullable<unknown> }} Inbox_FromInputs */
/** @typedef {{}} Inbox_History_Approval_ReadyInputs */
/** @typedef {{}} Inbox_History_Approval_TextInputs */
/** @typedef {{ approvers: NonNullable<unknown>, blocked: NonNullable<unknown> }} Inbox_History_Approval_WaitingInputs */
/** @typedef {{}} Inbox_History_ApproveInputs */
/** @typedef {{}} Inbox_History_Approve_DoneInputs */
/** @typedef {{ by: NonNullable<unknown> }} Inbox_History_Approved_ByInputs */
/** @typedef {{}} Inbox_History_Col_AttachmentsInputs */
/** @typedef {{}} Inbox_History_Col_CallsInputs */
/** @typedef {{}} Inbox_History_Col_CategoriesInputs */
/** @typedef {{}} Inbox_History_Col_CountryInputs */
/** @typedef {{}} Inbox_History_Col_CustomerInputs */
/** @typedef {{}} Inbox_History_Col_FleetInputs */
/** @typedef {{}} Inbox_History_Col_ImoInputs */
/** @typedef {{}} Inbox_History_Col_ItemInputs */
/** @typedef {{}} Inbox_History_Col_MailboxInputs */
/** @typedef {{}} Inbox_History_Col_PoInputs */
/** @typedef {{}} Inbox_History_Col_PortsInputs */
/** @typedef {{}} Inbox_History_Col_PriceInputs */
/** @typedef {{}} Inbox_History_Col_QuotedInputs */
/** @typedef {{}} Inbox_History_Col_Quoted_AtInputs */
/** @typedef {{}} Inbox_History_Col_RfqsInputs */
/** @typedef {{}} Inbox_History_Col_SourceInputs */
/** @typedef {{}} Inbox_History_Col_SupplierInputs */
/** @typedef {{}} Inbox_History_Col_VesselInputs */
/** @typedef {{}} Inbox_History_Col_YearsInputs */
/** @typedef {{}} Inbox_History_Confirm_HeadingInputs */
/** @typedef {{ totals: NonNullable<unknown>, prices: NonNullable<unknown>, kept: NonNullable<unknown>, decisions: NonNullable<unknown> }} Inbox_History_Confirm_TextInputs */
/** @typedef {{ kind: NonNullable<unknown>, name: NonNullable<unknown> }} Inbox_History_CreatedInputs */
/** @typedef {{}} Inbox_History_CustomersInputs */
/** @typedef {{ count: NonNullable<unknown> }} Inbox_History_Customers_FoundInputs */
/** @typedef {{}} Inbox_History_Customers_NoteInputs */
/** @typedef {{}} Inbox_History_Dated_PricesInputs */
/** @typedef {{ label: NonNullable<unknown>, count: NonNullable<unknown> }} Inbox_History_Dedup_A11yInputs */
/** @typedef {{}} Inbox_History_Dedup_NoteInputs */
/** @typedef {{ count: NonNullable<unknown> }} Inbox_History_Dedup_ValueInputs */
/** @typedef {{}} Inbox_History_EyebrowInputs */
/** @typedef {{}} Inbox_History_HeadingInputs */
/** @typedef {{}} Inbox_History_KeptInputs */
/** @typedef {{ scanned: NonNullable<unknown> }} Inbox_History_Kept_ShareInputs */
/** @typedef {{}} Inbox_History_Mailboxes_NoteInputs */
/** @typedef {{}} Inbox_History_ManagementInputs */
/** @typedef {{}} Inbox_History_MessagesInputs */
/** @typedef {{}} Inbox_History_New_To_OdooInputs */
/** @typedef {{}} Inbox_History_No_PoInputs */
/** @typedef {{}} Inbox_History_OrderedInputs */
/** @typedef {{}} Inbox_History_Organise_FirstInputs */
/** @typedef {{}} Inbox_History_Organise_NoteInputs */
/** @typedef {{}} Inbox_History_Organise_TextInputs */
/** @typedef {{}} Inbox_History_OrganisedInputs */
/** @typedef {{ count: NonNullable<unknown> }} Inbox_History_Pending_DecisionInputs */
/** @typedef {{}} Inbox_History_Per_YearInputs */
/** @typedef {{ price: NonNullable<unknown>, per: NonNullable<unknown> }} Inbox_History_PriceInputs */
/** @typedef {{}} Inbox_History_Price_HiddenInputs */
/** @typedef {{ count: NonNullable<unknown> }} Inbox_History_Prices_FoundInputs */
/** @typedef {{ count: NonNullable<unknown> }} Inbox_History_Prices_NoteInputs */
/** @typedef {{ count: NonNullable<unknown> }} Inbox_History_ScannedInputs */
/** @typedef {{ totals: NonNullable<unknown>, prices: NonNullable<unknown> }} Inbox_History_SearchableInputs */
/** @typedef {{ by: NonNullable<unknown> }} Inbox_History_Status_ApprovedInputs */
/** @typedef {{}} Inbox_History_Status_Dry_RunInputs */
/** @typedef {{ count: NonNullable<unknown> }} Inbox_History_Status_PendingInputs */
/** @typedef {{}} Inbox_History_Status_WaitingInputs */
/** @typedef {{}} Inbox_History_Step_ConnectInputs */
/** @typedef {{}} Inbox_History_Step_DedupInputs */
/** @typedef {{}} Inbox_History_Step_OrganiseInputs */
/** @typedef {{}} Inbox_History_Step_ReviewInputs */
/** @typedef {{}} Inbox_History_Step_ScanInputs */
/** @typedef {{}} Inbox_History_SubtitleInputs */
/** @typedef {{}} Inbox_History_SuppliersInputs */
/** @typedef {{ count: NonNullable<unknown> }} Inbox_History_Suppliers_FoundInputs */
/** @typedef {{}} Inbox_History_Suppliers_NoteInputs */
/** @typedef {{ customers: NonNullable<unknown>, customersText: NonNullable<unknown>, vessels: NonNullable<unknown>, vesselsText: NonNullable<unknown>, suppliers: NonNullable<unknown>, suppliersText: NonNullable<unknown> }} Inbox_History_TotalsInputs */
/** @typedef {{}} Inbox_History_VesselsInputs */
/** @typedef {{ count: NonNullable<unknown> }} Inbox_History_Vessels_FoundInputs */
/** @typedef {{}} Inbox_History_Vessels_NoteInputs */
/** @typedef {{}} Inbox_Kept_As_ReceivedInputs */
/** @typedef {{}} Inbox_Kind_ComplaintInputs */
/** @typedef {{}} Inbox_Kind_DeliveryInputs */
/** @typedef {{}} Inbox_Kind_InvoiceInputs */
/** @typedef {{}} Inbox_Kind_OfferInputs */
/** @typedef {{}} Inbox_Kind_OrderInputs */
/** @typedef {{}} Inbox_Kind_OtherInputs */
/** @typedef {{}} Inbox_Kind_RfqInputs */
/** @typedef {{ caseId: NonNullable<unknown> }} Inbox_LinkedInputs */
/** @typedef {{ caseId: NonNullable<unknown>, by: NonNullable<unknown> }} Inbox_Linked_ByInputs */
/** @typedef {{}} Inbox_Linked_TextInputs */
/** @typedef {{}} Inbox_Low_ConfidenceInputs */
/** @typedef {{}} Inbox_MatchInputs */
/** @typedef {{}} Inbox_Match_TextInputs */
/** @typedef {{}} Inbox_Match_UncertainInputs */
/** @typedef {{ id: NonNullable<unknown> }} Inbox_Message_IdInputs */
/** @typedef {{}} Inbox_New_CustomerInputs */
/** @typedef {{}} Inbox_Next_RfqsInputs */
/** @typedef {{}} Inbox_No_ClarificationInputs */
/** @typedef {{}} Inbox_No_TextInputs */
/** @typedef {{}} Inbox_Not_An_RfqInputs */
/** @typedef {{}} Inbox_Not_RelatedInputs */
/** @typedef {{ by: NonNullable<unknown> }} Inbox_Not_Related_ByInputs */
/** @typedef {{}} Inbox_Not_RfqInputs */
/** @typedef {{}} Inbox_Nothing_MoreInputs */
/** @typedef {{}} Inbox_Offer_CurrencyInputs */
/** @typedef {{}} Inbox_Offer_ExtractInputs */
/** @typedef {{}} Inbox_Offer_ItemInputs */
/** @typedef {{}} Inbox_Offer_Lead_TimeInputs */
/** @typedef {{}} Inbox_Offer_PackInputs */
/** @typedef {{}} Inbox_Offer_PriceInputs */
/** @typedef {{}} Inbox_Offer_ValidityInputs */
/** @typedef {{}} Inbox_Open_CaseInputs */
/** @typedef {{}} Inbox_OrderInputs */
/** @typedef {{}} Inbox_Order_NewestInputs */
/** @typedef {{}} Inbox_Order_UrgentInputs */
/** @typedef {{}} Inbox_OwnerInputs */
/** @typedef {{}} Inbox_Pick_MessageInputs */
/** @typedef {{}} Inbox_Quote_DeadlineInputs */
/** @typedef {{}} Inbox_Reminder_ScheduledInputs */
/** @typedef {{}} Inbox_Send_RfqsInputs */
/** @typedef {{}} Inbox_ShowInputs */
/** @typedef {{}} Inbox_Show_AllInputs */
/** @typedef {{}} Inbox_Show_LinkedInputs */
/** @typedef {{}} Inbox_Show_NewInputs */
/** @typedef {{}} Inbox_Show_ReviewInputs */
/** @typedef {{ count: NonNullable<unknown> }} Inbox_Show_Review_CountInputs */
/** @typedef {{ name: NonNullable<unknown>, email: NonNullable<unknown> }} Inbox_ToInputs */
/** @typedef {{ processed: NonNullable<unknown>, duplicates: NonNullable<unknown>, review: NonNullable<unknown> }} Inbox_TodayInputs */
/** @typedef {{ via: NonNullable<unknown>, when: NonNullable<unknown> }} Inbox_ViaInputs */
/** @typedef {{ currency: NonNullable<unknown>, amount: NonNullable<unknown> }} Index_MoneyInputs */
/** @typedef {{ currency: NonNullable<unknown>, amount: NonNullable<unknown> }} Index_Money_KInputs */
/** @typedef {{ from: NonNullable<unknown> }} Integrations_Ack_FromInputs */
/** @typedef {{}} Integrations_Ack_NoteInputs */
/** @typedef {{ status: NonNullable<unknown>, version: NonNullable<unknown>, approvedBy: NonNullable<unknown> }} Integrations_Ack_StatusInputs */
/** @typedef {{ to: NonNullable<unknown> }} Integrations_Ack_ToInputs */
/** @typedef {{}} Integrations_All_TemplatesInputs */
/** @typedef {{}} Integrations_Backups_NoteInputs */
/** @typedef {{}} Integrations_Checked_LabelInputs */
/** @typedef {{ n: NonNullable<unknown>, checked: NonNullable<unknown> }} Integrations_Checked_NoteInputs */
/** @typedef {{}} Integrations_Company_DefaultInputs */
/** @typedef {{}} Integrations_ConfidentialInputs */
/** @typedef {{}} Integrations_Confidential_NoteInputs */
/** @typedef {{}} Integrations_CopiesInputs */
/** @typedef {{ locations: NonNullable<unknown>, days: NonNullable<unknown> }} Integrations_Copies_ValueInputs */
/** @typedef {{}} Integrations_Documents_ArInputs */
/** @typedef {{}} Integrations_Documents_EnInputs */
/** @typedef {{}} Integrations_DuplicatesInputs */
/** @typedef {{}} Integrations_Duplicates_NoteInputs */
/** @typedef {{}} Integrations_Emails_ScannedInputs */
/** @typedef {{}} Integrations_ExceptionsInputs */
/** @typedef {{}} Integrations_Exceptions_NoteInputs */
/** @typedef {{ n: NonNullable<unknown>, days: NonNullable<unknown> }} Integrations_Import_DaysInputs */
/** @typedef {{}} Integrations_Import_NoteInputs */
/** @typedef {{}} Integrations_Lang_ArInputs */
/** @typedef {{}} Integrations_Languages_NoteInputs */
/** @typedef {{}} Integrations_Last_BackupInputs */
/** @typedef {{}} Integrations_Migration_NoteInputs */
/** @typedef {{}} Integrations_Moved_LabelInputs */
/** @typedef {{ n: NonNullable<unknown>, moved: NonNullable<unknown>, all: NonNullable<unknown> }} Integrations_Moved_NoteInputs */
/** @typedef {{}} Integrations_Never_InternalInputs */
/** @typedef {{}} Integrations_Once_Per_ThreadInputs */
/** @typedef {{}} Integrations_Open_Inbox_HistoryInputs */
/** @typedef {{}} Integrations_Parts_LabelInputs */
/** @typedef {{ done: NonNullable<unknown>, total: NonNullable<unknown> }} Integrations_Parts_ValueInputs */
/** @typedef {{}} Integrations_Preview_LanguageInputs */
/** @typedef {{}} Integrations_ReadyInputs */
/** @typedef {{}} Integrations_Refresh_StagingInputs */
/** @typedef {{}} Integrations_Refresh_Staging_DoneInputs */
/** @typedef {{}} Integrations_Refresh_Staging_ReasonInputs */
/** @typedef {{}} Integrations_Restore_TestedInputs */
/** @typedef {{}} Integrations_Rfq_ThreadsInputs */
/** @typedef {{}} Integrations_Rfq_Threads_NoteInputs */
/** @typedef {{}} Integrations_ScheduleInputs */
/** @typedef {{}} Integrations_Settings_By_ManagementInputs */
/** @typedef {{}} Integrations_Staging_CopyInputs */
/** @typedef {{}} Integrations_Stays_OnInputs */
/** @typedef {{}} Integrations_Your_LanguageInputs */
/** @typedef {{}} Order_To_Cash_Agent_ContactInputs */
/** @typedef {{}} Order_To_Cash_Agreement_HintInputs */
/** @typedef {{}} Order_To_Cash_Agreement_Hint_AiInputs */
/** @typedef {{}} Order_To_Cash_Agreement_LabelInputs */
/** @typedef {{ what: NonNullable<unknown>, field: NonNullable<unknown>, po: NonNullable<unknown>, quotation: NonNullable<unknown>, quote: NonNullable<unknown> }} Order_To_Cash_Ai_Check_LineInputs */
/** @typedef {{}} Order_To_Cash_Ai_Check_TagInputs */
/** @typedef {{ line: NonNullable<unknown> }} Order_To_Cash_Ai_LineInputs */
/** @typedef {{}} Order_To_Cash_Ai_Second_LookInputs */
/** @typedef {{}} Order_To_Cash_Ai_TermsInputs */
/** @typedef {{}} Order_To_Cash_Amendment_ConfirmInputs */
/** @typedef {{ line: NonNullable<unknown> }} Order_To_Cash_Amendment_DoneInputs */
/** @typedef {{}} Order_To_Cash_Amendment_Heading_HeaderInputs */
/** @typedef {{ line: NonNullable<unknown> }} Order_To_Cash_Amendment_Heading_LineInputs */
/** @typedef {{ field: NonNullable<unknown>, po: NonNullable<unknown>, quote: NonNullable<unknown> }} Order_To_Cash_Amendment_IntroInputs */
/** @typedef {{ number: NonNullable<unknown> }} Order_To_Cash_Approve_ConfirmInputs */
/** @typedef {{}} Order_To_Cash_Ask_ApprovalInputs */
/** @typedef {{ number: NonNullable<unknown> }} Order_To_Cash_Ask_Approval_DoneInputs */
/** @typedef {{}} Order_To_Cash_Bills_MatchedInputs */
/** @typedef {{ count: NonNullable<unknown> }} Order_To_Cash_Bills_On_HoldInputs */
/** @typedef {{ item: NonNullable<unknown>, now: NonNullable<unknown> }} Order_To_Cash_Change_LineInputs */
/** @typedef {{}} Order_To_Cash_ChangedInputs */
/** @typedef {{}} Order_To_Cash_Check_DocumentsInputs */
/** @typedef {{}} Order_To_Cash_Check_Goods_ReadyInputs */
/** @typedef {{}} Order_To_Cash_Check_No_ApprovalInputs */
/** @typedef {{}} Order_To_Cash_Check_Ship_StoresInputs */
/** @typedef {{}} Order_To_Cash_Check_TransportInputs */
/** @typedef {{}} Order_To_Cash_ClearanceInputs */
/** @typedef {{ line: NonNullable<unknown> }} Order_To_Cash_Close_Line_PromptInputs */
/** @typedef {{}} Order_To_Cash_Close_With_ReasonInputs */
/** @typedef {{ line: NonNullable<unknown> }} Order_To_Cash_Closed_DoneInputs */
/** @typedef {{}} Order_To_Cash_Col_At_QuotationInputs */
/** @typedef {{}} Order_To_Cash_Col_CheckInputs */
/** @typedef {{}} Order_To_Cash_Col_CheckedInputs */
/** @typedef {{}} Order_To_Cash_Col_Customer_PoInputs */
/** @typedef {{}} Order_To_Cash_Col_ItemInputs */
/** @typedef {{}} Order_To_Cash_Col_LineInputs */
/** @typedef {{}} Order_To_Cash_Col_NowInputs */
/** @typedef {{ quotation: NonNullable<unknown> }} Order_To_Cash_Col_QuotationInputs */
/** @typedef {{}} Order_To_Cash_Col_ResultInputs */
/** @typedef {{ count: NonNullable<unknown> }} Order_To_Cash_Commitment_BlockedInputs */
/** @typedef {{}} Order_To_Cash_Confirm_DeliveredInputs */
/** @typedef {{ number: NonNullable<unknown> }} Order_To_Cash_Confirm_Delivered_HeadingInputs */
/** @typedef {{}} Order_To_Cash_Confirm_DeliveryInputs */
/** @typedef {{ number: NonNullable<unknown> }} Order_To_Cash_Confirm_HeadingInputs */
/** @typedef {{}} Order_To_Cash_Confirm_Sales_OrderInputs */
/** @typedef {{}} Order_To_Cash_Confirm_SendInputs */
/** @typedef {{ number: NonNullable<unknown>, supplier: NonNullable<unknown> }} Order_To_Cash_Confirm_TextInputs */
/** @typedef {{}} Order_To_Cash_Confirmed_By_ManagementInputs */
/** @typedef {{ number: NonNullable<unknown>, supplier: NonNullable<unknown> }} Order_To_Cash_Confirmed_DoneInputs */
/** @typedef {{ n: NonNullable<unknown>, total: NonNullable<unknown> }} Order_To_Cash_Delivered_CountInputs */
/** @typedef {{ number: NonNullable<unknown> }} Order_To_Cash_Delivered_DoneInputs */
/** @typedef {{}} Order_To_Cash_DictateInputs */
/** @typedef {{}} Order_To_Cash_DispatchInputs */
/** @typedef {{ at: NonNullable<unknown> }} Order_To_Cash_Dispatched_AtInputs */
/** @typedef {{ drop: NonNullable<unknown>, number: NonNullable<unknown> }} Order_To_Cash_Drop_HeadingInputs */
/** @typedef {{ line: NonNullable<unknown>, qty: NonNullable<unknown>, description: NonNullable<unknown> }} Order_To_Cash_Drop_LineInputs */
/** @typedef {{ line: NonNullable<unknown>, qty: NonNullable<unknown>, description: NonNullable<unknown>, lot: NonNullable<unknown> }} Order_To_Cash_Drop_Line_LotInputs */
/** @typedef {{ drop: NonNullable<unknown>, total: NonNullable<unknown>, status: NonNullable<unknown> }} Order_To_Cash_Drop_TagInputs */
/** @typedef {{}} Order_To_Cash_Evidence_HintInputs */
/** @typedef {{}} Order_To_Cash_Evidence_LegendInputs */
/** @typedef {{}} Order_To_Cash_Figure_Customer_PoInputs */
/** @typedef {{}} Order_To_Cash_Figure_ReceivedInputs */
/** @typedef {{}} Order_To_Cash_Figure_Supplier_BillsInputs */
/** @typedef {{}} Order_To_Cash_Figure_Supplier_Pos_ConfirmedInputs */
/** @typedef {{}} Order_To_Cash_Goods_ReadyInputs */
/** @typedef {{}} Order_To_Cash_HeaderInputs */
/** @typedef {{ lines: NonNullable<unknown>, place: NonNullable<unknown> }} Order_To_Cash_IntroInputs */
/** @typedef {{ line: NonNullable<unknown>, qty: NonNullable<unknown> }} Order_To_Cash_Intro_LineInputs */
/** @typedef {{}} Order_To_Cash_Invoice_DeliveredInputs */
/** @typedef {{}} Order_To_Cash_InvoicedInputs */
/** @typedef {{}} Order_To_Cash_Keep_OpenInputs */
/** @typedef {{ line: NonNullable<unknown> }} Order_To_Cash_Kept_Open_DoneInputs */
/** @typedef {{}} Order_To_Cash_Launch_BoatInputs */
/** @typedef {{ line: NonNullable<unknown> }} Order_To_Cash_Line_RefInputs */
/** @typedef {{ line: NonNullable<unknown>, field: NonNullable<unknown> }} Order_To_Cash_Mismatch_TextInputs */
/** @typedef {{}} Order_To_Cash_Missing_ProofInputs */
/** @typedef {{ n: NonNullable<unknown>, total: NonNullable<unknown> }} Order_To_Cash_N_Of_TotalInputs */
/** @typedef {{}} Order_To_Cash_No_PlanInputs */
/** @typedef {{}} Order_To_Cash_Not_DispatchedInputs */
/** @typedef {{}} Order_To_Cash_Not_On_Po_DecideInputs */
/** @typedef {{}} Order_To_Cash_Not_RecheckedInputs */
/** @typedef {{}} Order_To_Cash_OkInputs */
/** @typedef {{ count: NonNullable<unknown> }} Order_To_Cash_On_BackorderInputs */
/** @typedef {{}} Order_To_Cash_On_PlanInputs */
/** @typedef {{}} Order_To_Cash_Outcome_ClosedInputs */
/** @typedef {{}} Order_To_Cash_Outcome_Open_RevisionInputs */
/** @typedef {{ outcome: NonNullable<unknown>, reason: NonNullable<unknown> }} Order_To_Cash_Outcome_With_ReasonInputs */
/** @typedef {{ a: NonNullable<unknown>, b: NonNullable<unknown> }} Order_To_Cash_PairInputs */
/** @typedef {{}} Order_To_Cash_Partial_Award_NoteInputs */
/** @typedef {{}} Order_To_Cash_Plan_NoteInputs */
/** @typedef {{}} Order_To_Cash_Planned_On_BoardInputs */
/** @typedef {{}} Order_To_Cash_Po_Arrived_HeadingInputs */
/** @typedef {{}} Order_To_Cash_Po_Arrived_TextInputs */
/** @typedef {{}} Order_To_Cash_Po_Checked_ValidatedInputs */
/** @typedef {{}} Order_To_Cash_Po_Empty_ConfirmedInputs */
/** @typedef {{}} Order_To_Cash_Po_Empty_NoneInputs */
/** @typedef {{}} Order_To_Cash_Po_Empty_ReadInputs */
/** @typedef {{}} Order_To_Cash_Po_Not_ReceivedInputs */
/** @typedef {{ number: NonNullable<unknown>, received: NonNullable<unknown>, quotation: NonNullable<unknown>, entity: NonNullable<unknown> }} Order_To_Cash_Po_SubheadInputs */
/** @typedef {{}} Order_To_Cash_Po_ValidatedInputs */
/** @typedef {{}} Order_To_Cash_Po_Validated_AgreedInputs */
/** @typedef {{}} Order_To_Cash_Po_Validated_ConfirmedInputs */
/** @typedef {{ po: NonNullable<unknown>, quotation: NonNullable<unknown> }} Order_To_Cash_Po_Vs_QuotationInputs */
/** @typedef {{}} Order_To_Cash_Port_PlaceInputs */
/** @typedef {{}} Order_To_Cash_Pos_Prepared_LaterInputs */
/** @typedef {{}} Order_To_Cash_Pos_RecheckedInputs */
/** @typedef {{}} Order_To_Cash_Proof_HintInputs */
/** @typedef {{}} Order_To_Cash_Proof_LegendInputs */
/** @typedef {{}} Order_To_Cash_Q_ItemsInputs */
/** @typedef {{}} Order_To_Cash_Q_Items_NoInputs */
/** @typedef {{}} Order_To_Cash_Q_Items_YesInputs */
/** @typedef {{}} Order_To_Cash_Q_PricesInputs */
/** @typedef {{}} Order_To_Cash_Q_Prices_NoInputs */
/** @typedef {{}} Order_To_Cash_Q_Prices_YesInputs */
/** @typedef {{}} Order_To_Cash_Q_TermsInputs */
/** @typedef {{}} Order_To_Cash_Q_Terms_NoInputs */
/** @typedef {{}} Order_To_Cash_Q_Terms_YesInputs */
/** @typedef {{}} Order_To_Cash_Read_NoteInputs */
/** @typedef {{ line: NonNullable<unknown>, description: NonNullable<unknown> }} Order_To_Cash_Reason_HintInputs */
/** @typedef {{}} Order_To_Cash_Reason_LabelInputs */
/** @typedef {{}} Order_To_Cash_Reason_PlaceholderInputs */
/** @typedef {{}} Order_To_Cash_ReceiptInputs */
/** @typedef {{}} Order_To_Cash_Receipt_PendingInputs */
/** @typedef {{}} Order_To_Cash_Recheck_ConfirmInputs */
/** @typedef {{ supplier: NonNullable<unknown> }} Order_To_Cash_Recheck_DoneInputs */
/** @typedef {{ number: NonNullable<unknown>, supplier: NonNullable<unknown> }} Order_To_Cash_Recheck_NoteInputs */
/** @typedef {{ number: NonNullable<unknown> }} Order_To_Cash_Recheck_TitleInputs */
/** @typedef {{}} Order_To_Cash_Record_AmendmentInputs */
/** @typedef {{ owner: NonNullable<unknown> }} Order_To_Cash_Replan_HeadingInputs */
/** @typedef {{ at: NonNullable<unknown>, text: NonNullable<unknown> }} Order_To_Cash_Replan_TextInputs */
/** @typedef {{}} Order_To_Cash_Rerun_Po_CheckInputs */
/** @typedef {{ resolution: NonNullable<unknown> }} Order_To_Cash_Resolution_EvidenceInputs */
/** @typedef {{}} Order_To_Cash_Result_AmendmentInputs */
/** @typedef {{}} Order_To_Cash_Result_MatchInputs */
/** @typedef {{}} Order_To_Cash_Result_MismatchInputs */
/** @typedef {{}} Order_To_Cash_Sales_Order_ConfirmedInputs */
/** @typedef {{}} Order_To_Cash_Sample_FromInputs */
/** @typedef {{ number: NonNullable<unknown> }} Order_To_Cash_Sample_NoteInputs */
/** @typedef {{ number: NonNullable<unknown>, line: NonNullable<unknown> }} Order_To_Cash_Sample_ReInputs */
/** @typedef {{ signedBy: NonNullable<unknown> }} Order_To_Cash_Sample_ReceivedInputs */
/** @typedef {{}} Order_To_Cash_Sample_ScanInputs */
/** @typedef {{}} Order_To_Cash_Share_ConfirmedInputs */
/** @typedef {{ count: NonNullable<unknown> }} Order_To_Cash_Share_MatchedInputs */
/** @typedef {{}} Order_To_Cash_Share_Of_Units_OrderedInputs */
/** @typedef {{}} Order_To_Cash_ShortagesInputs */
/** @typedef {{}} Order_To_Cash_Shortages_HintInputs */
/** @typedef {{}} Order_To_Cash_Shortages_LabelInputs */
/** @typedef {{ changes: NonNullable<unknown> }} Order_To_Cash_Shortfall_BackorderInputs */
/** @typedef {{ by: NonNullable<unknown>, at: NonNullable<unknown> }} Order_To_Cash_Signed_By_AtInputs */
/** @typedef {{ by: NonNullable<unknown>, at: NonNullable<unknown> }} Order_To_Cash_Signed_By_At_ProofInputs */
/** @typedef {{ vessel: NonNullable<unknown> }} Order_To_Cash_Signed_By_DefaultInputs */
/** @typedef {{}} Order_To_Cash_Signed_By_VesselInputs */
/** @typedef {{}} Order_To_Cash_Truck_StaffInputs */
/** @typedef {{}} Order_To_Cash_UndecidedInputs */
/** @typedef {{}} Order_To_Cash_Units_Across_ReceiptsInputs */
/** @typedef {{}} Order_To_Cash_VesselInputs */
/** @typedef {{}} Order_To_Cash_Vessel_EtaInputs */
/** @typedef {{}} Order_To_Cash_Waiting_Customer_OrderInputs */
/** @typedef {{}} Order_To_Cash_X_DateInputs */
/** @typedef {{}} Order_To_Cash_X_RemarksInputs */
/** @typedef {{}} Order_To_Cash_X_Signed_ByInputs */
/** @typedef {{}} Order_To_Cash_X_VesselInputs */
/** @typedef {{}} Page_Approval_Rules_ApprovedInputs */
/** @typedef {{}} Page_Approval_Rules_HalfwayInputs */
/** @typedef {{}} Page_Approval_Rules_RejectedInputs */
/** @typedef {{}} Page_Approval_Rules_Requests_TitleInputs */
/** @typedef {{}} Page_Approval_Rules_Two_PersonInputs */
/** @typedef {{}} Page_Approval_Rules_WaitingInputs */
/** @typedef {{}} Page_Approval_Rules_Waiting_TitleInputs */
/** @typedef {{}} Page_Approvals_AllInputs */
/** @typedef {{}} Page_Approvals_By_KindInputs */
/** @typedef {{}} Page_Approvals_DecidedInputs */
/** @typedef {{}} Page_Approvals_EyebrowInputs */
/** @typedef {{}} Page_Approvals_Finance_CeoInputs */
/** @typedef {{}} Page_Approvals_HeadingInputs */
/** @typedef {{}} Page_Approvals_Kept_For_AuditInputs */
/** @typedef {{}} Page_Approvals_Listed_ApproverInputs */
/** @typedef {{}} Page_Approvals_Others_EmptyInputs */
/** @typedef {{}} Page_Approvals_Others_SubheadInputs */
/** @typedef {{}} Page_Approvals_Recent_EmptyInputs */
/** @typedef {{}} Page_Approvals_Recent_SubheadInputs */
/** @typedef {{}} Page_Approvals_Recent_TitleInputs */
/** @typedef {{}} Page_Approvals_RulesInputs */
/** @typedef {{}} Page_Approvals_See_Not_DecideInputs */
/** @typedef {{}} Page_Approvals_SubtitleInputs */
/** @typedef {{}} Page_Approvals_Two_PersonInputs */
/** @typedef {{}} Page_Approvals_Waiting_For_OthersInputs */
/** @typedef {{}} Page_Approvals_Waiting_For_YouInputs */
/** @typedef {{}} Page_Approvals_Yours_EmptyInputs */
/** @typedef {{}} Page_Approvals_Yours_SubheadInputs */
/** @typedef {{}} Page_Aside_Awaiting_CustomerInputs */
/** @typedef {{}} Page_Aside_Awaiting_Customer_NoteInputs */
/** @typedef {{}} Page_Aside_Awaiting_SupplierInputs */
/** @typedef {{}} Page_Aside_Awaiting_Supplier_NoteInputs */
/** @typedef {{}} Page_Aside_BillsInputs */
/** @typedef {{}} Page_Aside_Bills_NoteInputs */
/** @typedef {{}} Page_Aside_Bills_On_HoldInputs */
/** @typedef {{}} Page_Aside_Bills_On_Hold_NoteInputs */
/** @typedef {{}} Page_Aside_DeliveriesInputs */
/** @typedef {{}} Page_Aside_Deliveries_NoteInputs */
/** @typedef {{}} Page_Aside_Draft_QuotesInputs */
/** @typedef {{}} Page_Aside_Draft_Quotes_NoteInputs */
/** @typedef {{}} Page_Aside_ExceptionsInputs */
/** @typedef {{}} Page_Aside_Exceptions_NoteInputs */
/** @typedef {{}} Page_Aside_Follow_UpsInputs */
/** @typedef {{}} Page_Aside_Follow_Ups_NoteInputs */
/** @typedef {{}} Page_Aside_HeldInputs */
/** @typedef {{}} Page_Aside_Held_NoteInputs */
/** @typedef {{}} Page_Aside_InboxInputs */
/** @typedef {{}} Page_Aside_Inbox_NoteInputs */
/** @typedef {{}} Page_Aside_Live_CasesInputs */
/** @typedef {{}} Page_Aside_Live_Cases_NoteInputs */
/** @typedef {{}} Page_Aside_My_DecisionsInputs */
/** @typedef {{}} Page_Aside_My_Decisions_NoteInputs */
/** @typedef {{}} Page_Aside_My_Live_CasesInputs */
/** @typedef {{}} Page_Aside_My_Live_Cases_NoteInputs */
/** @typedef {{}} Page_Aside_My_TasksInputs */
/** @typedef {{}} Page_Aside_My_Tasks_NoteInputs */
/** @typedef {{}} Page_Aside_OverdueInputs */
/** @typedef {{}} Page_Aside_Overdue_NoteInputs */
/** @typedef {{}} Page_Aside_PipelineInputs */
/** @typedef {{}} Page_Aside_Pipeline_NoteInputs */
/** @typedef {{}} Page_Aside_Rfqs_WaitingInputs */
/** @typedef {{}} Page_Aside_Rfqs_Waiting_NoteInputs */
/** @typedef {{}} Page_Aside_To_CollectInputs */
/** @typedef {{}} Page_Aside_To_Collect_NoteInputs */
/** @typedef {{}} Page_Aside_Your_DeskInputs */
/** @typedef {{}} Page_Automations_Activity_LogInputs */
/** @typedef {{}} Page_Automations_Ai_Log_SubheadInputs */
/** @typedef {{}} Page_Automations_Ai_Log_TitleInputs */
/** @typedef {{}} Page_Automations_All_ExceptionsInputs */
/** @typedef {{}} Page_Automations_Audit_SubheadInputs */
/** @typedef {{}} Page_Automations_Audit_TitleInputs */
/** @typedef {{}} Page_Automations_Auto_ResolvedInputs */
/** @typedef {{}} Page_Automations_AutomaticInputs */
/** @typedef {{}} Page_Automations_By_PeopleInputs */
/** @typedef {{}} Page_Automations_Duplicates_CaughtInputs */
/** @typedef {{}} Page_Automations_EyebrowInputs */
/** @typedef {{}} Page_Automations_HeadingInputs */
/** @typedef {{}} Page_Automations_Nothing_SilentInputs */
/** @typedef {{}} Page_Automations_Open_ExceptionsInputs */
/** @typedef {{}} Page_Automations_Owner_DueInputs */
/** @typedef {{}} Page_Automations_Queue_SubheadInputs */
/** @typedef {{}} Page_Automations_Queue_TitleInputs */
/** @typedef {{}} Page_Automations_Registry_SubheadInputs */
/** @typedef {{}} Page_Automations_Registry_TitleInputs */
/** @typedef {{}} Page_Automations_Review_QueueInputs */
/** @typedef {{}} Page_Automations_RuleInputs */
/** @typedef {{}} Page_Automations_SubtitleInputs */
/** @typedef {{}} Page_Automations_WhatInputs */
/** @typedef {{}} Page_Automations_What_HappenedInputs */
/** @typedef {{}} Page_Automations_What_It_ReadInputs */
/** @typedef {{}} Page_Automations_WhenInputs */
/** @typedef {{}} Page_Automations_WhoInputs */
/** @typedef {{}} Page_Cash_Ageing_SubheadInputs */
/** @typedef {{}} Page_Cash_Ageing_TitleInputs */
/** @typedef {{}} Page_Cash_All_InvoicesInputs */
/** @typedef {{}} Page_Cash_Approvals_QueueInputs */
/** @typedef {{}} Page_Cash_Bank_Change_SubheadInputs */
/** @typedef {{}} Page_Cash_Bills_By_DueInputs */
/** @typedef {{}} Page_Cash_Buckets_TitleInputs */
/** @typedef {{}} Page_Cash_Collections_SubheadInputs */
/** @typedef {{}} Page_Cash_Collections_TitleInputs */
/** @typedef {{}} Page_Cash_Due_MonthInputs */
/** @typedef {{}} Page_Cash_E_InvoiceInputs */
/** @typedef {{ day: NonNullable<unknown> }} Page_Cash_EyebrowInputs */
/** @typedef {{}} Page_Cash_Fd_Or_CeoInputs */
/** @typedef {{}} Page_Cash_HeadingInputs */
/** @typedef {{}} Page_Cash_In_OutInputs */
/** @typedef {{}} Page_Cash_In_Out_SubheadInputs */
/** @typedef {{}} Page_Cash_Next_WeeksInputs */
/** @typedef {{}} Page_Cash_No_Bank_ChangesInputs */
/** @typedef {{}} Page_Cash_No_Bank_RequestInputs */
/** @typedef {{}} Page_Cash_No_Open_InvoicesInputs */
/** @typedef {{}} Page_Cash_No_PaymentsInputs */
/** @typedef {{}} Page_Cash_No_ReceivablesInputs */
/** @typedef {{}} Page_Cash_Nothing_OwedInputs */
/** @typedef {{}} Page_Cash_Open_InvoicesInputs */
/** @typedef {{}} Page_Cash_OverdueInputs */
/** @typedef {{}} Page_Cash_Overdue_NoteInputs */
/** @typedef {{}} Page_Cash_PayablesInputs */
/** @typedef {{}} Page_Cash_Payables_NoteInputs */
/** @typedef {{}} Page_Cash_Payables_SubheadInputs */
/** @typedef {{}} Page_Cash_Payables_TitleInputs */
/** @typedef {{}} Page_Cash_Payments_SubheadInputs */
/** @typedef {{}} Page_Cash_Payments_TitleInputs */
/** @typedef {{}} Page_Cash_Payments_To_ApproveInputs */
/** @typedef {{}} Page_Cash_ReceivablesInputs */
/** @typedef {{}} Page_Cash_Receivables_NoteInputs */
/** @typedef {{}} Page_Cash_RemittanceInputs */
/** @typedef {{ supplier: NonNullable<unknown> }} Page_Cash_Requested_ChangeInputs */
/** @typedef {{}} Page_Cash_SubtitleInputs */
/** @typedef {{}} Page_Cash_Supplier_BalancesInputs */
/** @typedef {{}} Page_Cash_Who_OwesInputs */
/** @typedef {{ line: NonNullable<unknown>, description: NonNullable<unknown> }} Page_Compare_Check_TitleInputs */
/** @typedef {{ supplier: NonNullable<unknown>, version: NonNullable<unknown> }} Page_Compare_Correction_TitleInputs */
/** @typedef {{}} Page_Compare_DeniedInputs */
/** @typedef {{}} Page_Compare_How_TitleInputs */
/** @typedef {{ line: NonNullable<unknown>, description: NonNullable<unknown> }} Page_Compare_Line_TitleInputs */
/** @typedef {{}} Page_Compare_Next_StepInputs */
/** @typedef {{}} Page_Compare_No_CorrectionsInputs */
/** @typedef {{}} Page_Compare_No_LinesInputs */
/** @typedef {{}} Page_Compare_No_More_ChecksInputs */
/** @typedef {{}} Page_Compare_No_More_LinesInputs */
/** @typedef {{}} Page_Compare_No_WaitingInputs */
/** @typedef {{ line: NonNullable<unknown>, description: NonNullable<unknown> }} Page_Compare_Others_TitleInputs */
/** @typedef {{}} Page_Delivery_Amount_VatInputs */
/** @typedef {{}} Page_Delivery_Backorders_SubheadInputs */
/** @typedef {{}} Page_Delivery_Backorders_TitleInputs */
/** @typedef {{}} Page_Delivery_BalanceInputs */
/** @typedef {{}} Page_Delivery_Balance_NoteInputs */
/** @typedef {{}} Page_Delivery_Check_SubheadInputs */
/** @typedef {{}} Page_Delivery_Check_TitleInputs */
/** @typedef {{}} Page_Delivery_Drops_SubheadInputs */
/** @typedef {{}} Page_Delivery_Drops_TitleInputs */
/** @typedef {{}} Page_Delivery_InvoiceInputs */
/** @typedef {{}} Page_Delivery_InvoicedInputs */
/** @typedef {{}} Page_Delivery_Invoiced_NoteInputs */
/** @typedef {{}} Page_Delivery_Invoices_SubheadInputs */
/** @typedef {{}} Page_Delivery_Invoices_TitleInputs */
/** @typedef {{}} Page_Delivery_No_BackordersInputs */
/** @typedef {{}} Page_Delivery_No_DispatchInputs */
/** @typedef {{}} Page_Delivery_No_DropsInputs */
/** @typedef {{}} Page_Delivery_No_InvoiceInputs */
/** @typedef {{}} Page_Delivery_No_InvoicesInputs */
/** @typedef {{}} Page_Delivery_Paid_BalanceInputs */
/** @typedef {{}} Page_Delivery_Plan_TitleInputs */
/** @typedef {{}} Page_Delivery_ReceivedInputs */
/** @typedef {{}} Page_Delivery_Received_NoteInputs */
/** @typedef {{}} Page_Delivery_ShortInputs */
/** @typedef {{}} Page_Growth_AddInputs */
/** @typedef {{}} Page_Growth_CampaignInputs */
/** @typedef {{}} Page_Growth_CampaignsInputs */
/** @typedef {{}} Page_Growth_Campaigns_Can_SendInputs */
/** @typedef {{}} Page_Growth_Campaigns_Cannot_SendInputs */
/** @typedef {{}} Page_Growth_ContentInputs */
/** @typedef {{}} Page_Growth_DocumentsInputs */
/** @typedef {{}} Page_Growth_EyebrowInputs */
/** @typedef {{}} Page_Growth_FleetsInputs */
/** @typedef {{}} Page_Growth_FunnelInputs */
/** @typedef {{}} Page_Growth_Funnel_SubheadInputs */
/** @typedef {{}} Page_Growth_HeadingInputs */
/** @typedef {{}} Page_Growth_NextInputs */
/** @typedef {{}} Page_Growth_Next_StepsInputs */
/** @typedef {{}} Page_Growth_Next_Steps_SubheadInputs */
/** @typedef {{}} Page_Growth_No_StepInputs */
/** @typedef {{}} Page_Growth_No_Step_NoteInputs */
/** @typedef {{}} Page_Growth_OpenInputs */
/** @typedef {{}} Page_Growth_Open_NoteInputs */
/** @typedef {{}} Page_Growth_PipelineInputs */
/** @typedef {{}} Page_Growth_RegistrationsInputs */
/** @typedef {{}} Page_Growth_Registrations_GlanceInputs */
/** @typedef {{}} Page_Growth_Registrations_NoteInputs */
/** @typedef {{}} Page_Growth_SourcesInputs */
/** @typedef {{}} Page_Growth_Stage_ActiveInputs */
/** @typedef {{}} Page_Growth_Stage_ApprovedInputs */
/** @typedef {{}} Page_Growth_Stage_First_RfqInputs */
/** @typedef {{}} Page_Growth_Stage_IntroducedInputs */
/** @typedef {{}} Page_Growth_Stage_ProspectInputs */
/** @typedef {{}} Page_Growth_Stage_RegistrationInputs */
/** @typedef {{}} Page_Growth_SubtitleInputs */
/** @typedef {{}} Page_Growth_This_WeekInputs */
/** @typedef {{}} Page_Growth_This_Week_NoteInputs */
/** @typedef {{}} Page_Growth_Vendor_SubheadInputs */
/** @typedef {{}} Page_Growth_Vendor_TitleInputs */
/** @typedef {{}} Page_Growth_VesselsInputs */
/** @typedef {{}} Page_Growth_Vessels_SubheadInputs */
/** @typedef {{}} Page_History_CustomersInputs */
/** @typedef {{}} Page_History_DedupInputs */
/** @typedef {{}} Page_History_MailboxesInputs */
/** @typedef {{}} Page_History_No_CustomersInputs */
/** @typedef {{}} Page_History_No_PricesInputs */
/** @typedef {{}} Page_History_No_SuppliersInputs */
/** @typedef {{}} Page_History_No_VesselsInputs */
/** @typedef {{}} Page_History_Not_OrganisedInputs */
/** @typedef {{}} Page_History_Organise_ApproveInputs */
/** @typedef {{}} Page_History_Per_YearInputs */
/** @typedef {{}} Page_History_PricesInputs */
/** @typedef {{}} Page_History_ProgressInputs */
/** @typedef {{}} Page_History_SuppliersInputs */
/** @typedef {{}} Page_History_Uncertain_EmptyInputs */
/** @typedef {{}} Page_History_Uncertain_SubheadInputs */
/** @typedef {{}} Page_History_Uncertain_TitleInputs */
/** @typedef {{}} Page_History_VesselsInputs */
/** @typedef {{}} Page_Home_All_LiveInputs */
/** @typedef {{}} Page_Home_All_Live_SubheadInputs */
/** @typedef {{}} Page_Home_Bills_MatchInputs */
/** @typedef {{}} Page_Home_Bills_Match_NoteInputs */
/** @typedef {{}} Page_Home_BriefingInputs */
/** @typedef {{}} Page_Home_By_RiskInputs */
/** @typedef {{}} Page_Home_Customer_VesselInputs */
/** @typedef {{}} Page_Home_DeadlinesInputs */
/** @typedef {{}} Page_Home_Deadlines_SubheadInputs */
/** @typedef {{}} Page_Home_Decisions_NoteInputs */
/** @typedef {{}} Page_Home_Decisions_WaitingInputs */
/** @typedef {{}} Page_Home_Desk_CasesInputs */
/** @typedef {{}} Page_Home_Desk_Cases_SubheadInputs */
/** @typedef {{}} Page_Home_Desk_Queue_SubheadInputs */
/** @typedef {{}} Page_Home_Due_TodayInputs */
/** @typedef {{}} Page_Home_Due_Today_NoteInputs */
/** @typedef {{}} Page_Home_ExceptionsInputs */
/** @typedef {{}} Page_Home_Exceptions_NoteInputs */
/** @typedef {{}} Page_Home_Follow_Ups_SubheadInputs */
/** @typedef {{}} Page_Home_Follow_Ups_TitleInputs */
/** @typedef {{}} Page_Home_Inbox_NoteInputs */
/** @typedef {{}} Page_Home_Inbox_SubheadInputs */
/** @typedef {{}} Page_Home_Inbox_TriageInputs */
/** @typedef {{}} Page_Home_LinesInputs */
/** @typedef {{}} Page_Home_My_DeadlinesInputs */
/** @typedef {{}} Page_Home_My_Deadlines_SubheadInputs */
/** @typedef {{}} Page_Home_My_Live_CasesInputs */
/** @typedef {{}} Page_Home_My_Live_Cases_NoteInputs */
/** @typedef {{}} Page_Home_My_QueueInputs */
/** @typedef {{}} Page_Home_My_Queue_SubheadInputs */
/** @typedef {{}} Page_Home_Next_BlockerInputs */
/** @typedef {{}} Page_Home_Next_UpInputs */
/** @typedef {{}} Page_Home_No_ChartInputs */
/** @typedef {{}} Page_Home_No_Follow_UpsInputs */
/** @typedef {{}} Page_Home_No_Live_CasesInputs */
/** @typedef {{}} Page_Home_Nothing_MorningInputs */
/** @typedef {{}} Page_Home_Nothing_This_WeekInputs */
/** @typedef {{}} Page_Home_Open_TasksInputs */
/** @typedef {{}} Page_Home_PipelineInputs */
/** @typedef {{}} Page_Home_Pipeline_SubheadInputs */
/** @typedef {{}} Page_Home_Quote_DeadlinesInputs */
/** @typedef {{}} Page_Home_TargetsInputs */
/** @typedef {{}} Page_Home_This_MonthInputs */
/** @typedef {{}} Page_Home_This_MorningInputs */
/** @typedef {{}} Page_Home_This_WeekInputs */
/** @typedef {{}} Page_Home_To_CollectInputs */
/** @typedef {{}} Page_Home_To_Collect_NoteInputs */
/** @typedef {{}} Page_Home_TurnaroundInputs */
/** @typedef {{}} Page_Home_Win_RateInputs */
/** @typedef {{}} Page_Home_Your_DecisionInputs */
/** @typedef {{}} Page_Home_Your_Decision_SubheadInputs */
/** @typedef {{}} Page_Inbox_AckInputs */
/** @typedef {{}} Page_Inbox_AssignmentInputs */
/** @typedef {{}} Page_Inbox_ChannelsInputs */
/** @typedef {{}} Page_Inbox_Draft_CaseInputs */
/** @typedef {{}} Page_Inbox_Draft_LinesInputs */
/** @typedef {{}} Page_Inbox_EyebrowInputs */
/** @typedef {{}} Page_Inbox_HeadingInputs */
/** @typedef {{}} Page_Inbox_Match_EmptyInputs */
/** @typedef {{}} Page_Inbox_Match_SubheadInputs */
/** @typedef {{}} Page_Inbox_Match_TitleInputs */
/** @typedef {{}} Page_Inbox_MessagesInputs */
/** @typedef {{}} Page_Inbox_MissingInputs */
/** @typedef {{}} Page_Inbox_Next_StepInputs */
/** @typedef {{}} Page_Inbox_No_AckInputs */
/** @typedef {{}} Page_Inbox_No_Ack_DescriptionInputs */
/** @typedef {{}} Page_Inbox_No_DraftInputs */
/** @typedef {{}} Page_Inbox_No_Draft_DescriptionInputs */
/** @typedef {{}} Page_Inbox_No_Draft_LinesInputs */
/** @typedef {{}} Page_Inbox_No_Match_FilterInputs */
/** @typedef {{}} Page_Inbox_No_MessageInputs */
/** @typedef {{}} Page_Inbox_No_Next_StepInputs */
/** @typedef {{}} Page_Inbox_No_OwnerInputs */
/** @typedef {{}} Page_Inbox_No_Owner_DescriptionInputs */
/** @typedef {{}} Page_Inbox_No_TextInputs */
/** @typedef {{}} Page_Inbox_No_Warnings_TextInputs */
/** @typedef {{}} Page_Inbox_Nothing_ClarifyInputs */
/** @typedef {{}} Page_Inbox_Offer_DetailsInputs */
/** @typedef {{}} Page_Inbox_OriginalInputs */
/** @typedef {{}} Page_Inbox_Original_SubheadInputs */
/** @typedef {{}} Page_Inbox_Pick_MessageInputs */
/** @typedef {{}} Page_Inbox_Review_EmptyInputs */
/** @typedef {{}} Page_Inbox_Review_SubheadInputs */
/** @typedef {{}} Page_Inbox_Review_TitleInputs */
/** @typedef {{}} Page_Inbox_SubtitleInputs */
/** @typedef {{}} Page_Inbox_WarningsInputs */
/** @typedef {{}} Page_Inbox_What_IsInputs */
/** @typedef {{}} Page_Integrations_AckInputs */
/** @typedef {{}} Page_Integrations_BackupsInputs */
/** @typedef {{}} Page_Integrations_ChannelsInputs */
/** @typedef {{}} Page_Integrations_Channels_SubheadInputs */
/** @typedef {{}} Page_Integrations_EditInputs */
/** @typedef {{}} Page_Integrations_Exception_QueueInputs */
/** @typedef {{}} Page_Integrations_EyebrowInputs */
/** @typedef {{}} Page_Integrations_HeadingInputs */
/** @typedef {{}} Page_Integrations_HistoryInputs */
/** @typedef {{}} Page_Integrations_History_SubheadInputs */
/** @typedef {{}} Page_Integrations_ImportedInputs */
/** @typedef {{}} Page_Integrations_LanguageInputs */
/** @typedef {{}} Page_Integrations_MailboxInputs */
/** @typedef {{}} Page_Integrations_MailboxesInputs */
/** @typedef {{}} Page_Integrations_Mailboxes_SubheadInputs */
/** @typedef {{}} Page_Integrations_MigrationInputs */
/** @typedef {{}} Page_Integrations_Odoo_SubheadInputs */
/** @typedef {{}} Page_Integrations_Odoo_TitleInputs */
/** @typedef {{}} Page_Integrations_SubtitleInputs */
/** @typedef {{}} Page_Integrations_TokenInputs */
/** @typedef {{}} Page_Order_Ai_Check_TitleInputs */
/** @typedef {{}} Page_Order_Amendment_HeaderInputs */
/** @typedef {{ line: NonNullable<unknown> }} Page_Order_Amendment_LineInputs */
/** @typedef {{}} Page_Order_AmountInputs */
/** @typedef {{}} Page_Order_BackorderInputs */
/** @typedef {{}} Page_Order_BillInputs */
/** @typedef {{}} Page_Order_Bills_SubheadInputs */
/** @typedef {{}} Page_Order_Bills_TitleInputs */
/** @typedef {{}} Page_Order_DueInputs */
/** @typedef {{}} Page_Order_Lot_ExpiryInputs */
/** @typedef {{}} Page_Order_No_BillsInputs */
/** @typedef {{}} Page_Order_No_ConfirmInputs */
/** @typedef {{}} Page_Order_No_MismatchInputs */
/** @typedef {{}} Page_Order_No_PartialInputs */
/** @typedef {{}} Page_Order_No_PoInputs */
/** @typedef {{}} Page_Order_No_PosInputs */
/** @typedef {{}} Page_Order_No_ReceiptsInputs */
/** @typedef {{}} Page_Order_Partial_TitleInputs */
/** @typedef {{}} Page_Order_PoInputs */
/** @typedef {{}} Page_Order_Po_Check_SubheadInputs */
/** @typedef {{}} Page_Order_Po_Check_TitleInputs */
/** @typedef {{}} Page_Order_Pos_SubheadInputs */
/** @typedef {{}} Page_Order_Pos_TitleInputs */
/** @typedef {{}} Page_Order_Receipts_SubheadInputs */
/** @typedef {{}} Page_Order_Receipts_TitleInputs */
/** @typedef {{}} Page_Overview_After_OrderInputs */
/** @typedef {{}} Page_Overview_Clarifications_SubheadInputs */
/** @typedef {{}} Page_Overview_Clarifications_TitleInputs */
/** @typedef {{}} Page_Overview_Contact_RuleInputs */
/** @typedef {{}} Page_Overview_Handover_TitleInputs */
/** @typedef {{}} Page_Overview_Lifecycle_SubheadInputs */
/** @typedef {{}} Page_Overview_Lifecycle_TitleInputs */
/** @typedef {{}} Page_Overview_LineInputs */
/** @typedef {{}} Page_Overview_Line_ProgressInputs */
/** @typedef {{}} Page_Overview_Line_Progress_SubheadInputs */
/** @typedef {{}} Page_Overview_Line_StatusInputs */
/** @typedef {{}} Page_Overview_Next_ActionInputs */
/** @typedef {{}} Page_Overview_No_ClarificationsInputs */
/** @typedef {{}} Page_Overview_No_HandoverInputs */
/** @typedef {{}} Page_Overview_No_LinesInputs */
/** @typedef {{}} Page_Overview_Nothing_OrderedInputs */
/** @typedef {{}} Page_Overview_Open_TasksInputs */
/** @typedef {{}} Page_Overview_Owner_BackupInputs */
/** @typedef {{}} Page_Overview_SummaryInputs */
/** @typedef {{}} Page_Overview_Timeline_SubheadInputs */
/** @typedef {{}} Page_Overview_Timeline_TitleInputs */
/** @typedef {{}} Page_Overview_To_ViaInputs */
/** @typedef {{}} Page_Pricing_ApprovalInputs */
/** @typedef {{}} Page_Pricing_Build_UpInputs */
/** @typedef {{}} Page_Pricing_Build_Up_SubheadInputs */
/** @typedef {{}} Page_Pricing_HiddenInputs */
/** @typedef {{}} Page_Pricing_How_BuiltInputs */
/** @typedef {{}} Page_Pricing_LeversInputs */
/** @typedef {{}} Page_Pricing_LinesInputs */
/** @typedef {{}} Page_Pricing_Margin_Vs_PolicyInputs */
/** @typedef {{}} Page_Pricing_Not_PricedInputs */
/** @typedef {{}} Page_Pricing_Not_Priced_DescriptionInputs */
/** @typedef {{}} Page_Pricing_Policy_ChecksInputs */
/** @typedef {{}} Page_Pricing_Shared_ChargesInputs */
/** @typedef {{}} Page_Pricing_What_IfInputs */
/** @typedef {{}} Page_Profit_ClaimsInputs */
/** @typedef {{}} Page_Profit_Close_ChecklistInputs */
/** @typedef {{}} Page_Profit_Close_ProgressInputs */
/** @typedef {{}} Page_Profit_Cost_TitleInputs */
/** @typedef {{}} Page_Profit_DamageInputs */
/** @typedef {{}} Page_Profit_DeniedInputs */
/** @typedef {{}} Page_Profit_FxInputs */
/** @typedef {{}} Page_Profit_No_ClaimsInputs */
/** @typedef {{}} Page_Profit_No_Cost_SheetInputs */
/** @typedef {{}} Page_Profit_No_Cost_Sheet_DescriptionInputs */
/** @typedef {{}} Page_Profit_No_DeliveryInputs */
/** @typedef {{}} Page_Profit_No_ReceiptsInputs */
/** @typedef {{}} Page_Project_AcceptanceInputs */
/** @typedef {{}} Page_Project_BriefInputs */
/** @typedef {{}} Page_Project_CalendarInputs */
/** @typedef {{}} Page_Project_Every_PhaseInputs */
/** @typedef {{}} Page_Project_EyebrowInputs */
/** @typedef {{}} Page_Project_FollowInputs */
/** @typedef {{}} Page_Project_HeadingInputs */
/** @typedef {{}} Page_Project_MilestonesInputs */
/** @typedef {{}} Page_Project_MonthlyInputs */
/** @typedef {{}} Page_Project_No_PhaseInputs */
/** @typedef {{}} Page_Project_PassingInputs */
/** @typedef {{}} Page_Project_PaymentInputs */
/** @typedef {{}} Page_Project_ProblemsInputs */
/** @typedef {{}} Page_Project_RoadmapInputs */
/** @typedef {{}} Page_Project_StartInputs */
/** @typedef {{}} Page_Project_SubtitleInputs */
/** @typedef {{}} Page_Project_TrustInputs */
/** @typedef {{}} Page_Project_WeeksInputs */
/** @typedef {{}} Page_Quote_ApprovalsInputs */
/** @typedef {{}} Page_Quote_CopyInputs */
/** @typedef {{}} Page_Quote_Copy_SubheadInputs */
/** @typedef {{}} Page_Quote_DecisionInputs */
/** @typedef {{}} Page_Quote_InternalInputs */
/** @typedef {{}} Page_Quote_No_PortalInputs */
/** @typedef {{}} Page_Quote_No_Portal_DescriptionInputs */
/** @typedef {{}} Page_Quote_No_VersionsInputs */
/** @typedef {{}} Page_Quote_PortalInputs */
/** @typedef {{}} Page_Quote_VersionsInputs */
/** @typedef {{}} Page_Records_Activity_By_KindInputs */
/** @typedef {{}} Page_Records_Activity_Per_DayInputs */
/** @typedef {{}} Page_Records_Ai_Calls_By_TaskInputs */
/** @typedef {{}} Page_Records_Available_By_ProductInputs */
/** @typedef {{}} Page_Records_Balance_By_AgeInputs */
/** @typedef {{}} Page_Records_Balance_By_CustomerInputs */
/** @typedef {{}} Page_Records_Bills_Due_By_WeekInputs */
/** @typedef {{}} Page_Records_By_SegmentInputs */
/** @typedef {{}} Page_Records_Case_Value_By_CustomerInputs */
/** @typedef {{}} Page_Records_Cases_By_StageInputs */
/** @typedef {{}} Page_Records_Cases_Per_OwnerInputs */
/** @typedef {{}} Page_Records_Contact_RulesInputs */
/** @typedef {{}} Page_Records_Customer_Pos_Per_WeekInputs */
/** @typedef {{}} Page_Records_Customers_By_TypeInputs */
/** @typedef {{}} Page_Records_Decisions_By_KindInputs */
/** @typedef {{}} Page_Records_Deliveries_By_StatusInputs */
/** @typedef {{}} Page_Records_Deliveries_Per_CaseInputs */
/** @typedef {{}} Page_Records_Exceptions_By_SourceInputs */
/** @typedef {{}} Page_Records_Message_SourcesInputs */
/** @typedef {{}} Page_Records_Messages_Per_DayInputs */
/** @typedef {{}} Page_Records_Money_In_OutInputs */
/** @typedef {{}} Page_Records_Offers_By_ComplianceInputs */
/** @typedef {{}} Page_Records_Offers_Per_SupplierInputs */
/** @typedef {{}} Page_Records_Order_Value_By_SupplierInputs */
/** @typedef {{}} Page_Records_Orders_By_SupplierInputs */
/** @typedef {{}} Page_Records_Payments_Per_WeekInputs */
/** @typedef {{}} Page_Records_Pricelists_Per_PrincipalInputs */
/** @typedef {{}} Page_Records_Prices_Per_SupplierInputs */
/** @typedef {{}} Page_Records_Products_By_StoreInputs */
/** @typedef {{}} Page_Records_Prospect_SourcesInputs */
/** @typedef {{}} Page_Records_Quoted_Value_By_StatusInputs */
/** @typedef {{}} Page_Records_Receipts_By_WarehouseInputs */
/** @typedef {{}} Page_Records_Requests_Per_SupplierInputs */
/** @typedef {{}} Page_Records_Stock_By_ProductInputs */
/** @typedef {{}} Page_Records_Supplier_KindsInputs */
/** @typedef {{}} Page_Records_Suppliers_By_CountryInputs */
/** @typedef {{}} Page_Records_Tasks_By_TypeInputs */
/** @typedef {{}} Page_Records_Team_By_RoleInputs */
/** @typedef {{}} Page_Records_Units_By_WarehouseInputs */
/** @typedef {{}} Page_Records_Vessels_By_TypeInputs */
/** @typedef {{}} Page_Records_Vessels_Per_CustomerInputs */
/** @typedef {{}} Page_Records_Who_Owes_UsInputs */
/** @typedef {{}} Page_Rfqs_Arrivals_TitleInputs */
/** @typedef {{}} Page_Rfqs_ClosedInputs */
/** @typedef {{}} Page_Rfqs_Closed_NoteInputs */
/** @typedef {{}} Page_Rfqs_Draft_TitleInputs */
/** @typedef {{}} Page_Rfqs_Drafted_TitleInputs */
/** @typedef {{}} Page_Rfqs_From_OneInputs */
/** @typedef {{}} Page_Rfqs_LinesInputs */
/** @typedef {{}} Page_Rfqs_List_EmptyInputs */
/** @typedef {{}} Page_Rfqs_List_SubheadInputs */
/** @typedef {{}} Page_Rfqs_Matched_SubheadInputs */
/** @typedef {{}} Page_Rfqs_Matched_TitleInputs */
/** @typedef {{}} Page_Rfqs_No_DraftsInputs */
/** @typedef {{}} Page_Rfqs_No_Drafts_DescriptionInputs */
/** @typedef {{}} Page_Rfqs_No_New_SuppliersInputs */
/** @typedef {{}} Page_Rfqs_No_PreviewsInputs */
/** @typedef {{}} Page_Rfqs_No_RepliesInputs */
/** @typedef {{}} Page_Rfqs_None_ChasedInputs */
/** @typedef {{}} Page_Rfqs_Reminders_TitleInputs */
/** @typedef {{}} Page_Rfqs_RepliedInputs */
/** @typedef {{}} Page_Rfqs_Replied_NoteInputs */
/** @typedef {{}} Page_Rfqs_Review_EmptyInputs */
/** @typedef {{}} Page_Rfqs_Review_SubheadInputs */
/** @typedef {{}} Page_Rfqs_Review_TitleInputs */
/** @typedef {{}} Page_Rfqs_Sent_DueInputs */
/** @typedef {{}} Page_Rfqs_Supplier_RfqsInputs */
/** @typedef {{}} Page_Rfqs_WaitingInputs */
/** @typedef {{}} Page_Rfqs_Waiting_NoteInputs */
/** @typedef {{}} Page_Roles_AlertedInputs */
/** @typedef {{}} Page_Roles_Approval_RulesInputs */
/** @typedef {{}} Page_Roles_EnforcedInputs */
/** @typedef {{}} Page_Roles_EyebrowInputs */
/** @typedef {{}} Page_Roles_HeadingInputs */
/** @typedef {{}} Page_Roles_MatrixInputs */
/** @typedef {{}} Page_Roles_Matrix_SubheadInputs */
/** @typedef {{}} Page_Roles_No_AlertInputs */
/** @typedef {{}} Page_Roles_No_Alert_DescriptionInputs */
/** @typedef {{}} Page_Roles_PeopleInputs */
/** @typedef {{}} Page_Roles_RoleInputs */
/** @typedef {{}} Page_Roles_RosterInputs */
/** @typedef {{}} Page_Roles_Roster_SubheadInputs */
/** @typedef {{}} Page_Roles_RoutingInputs */
/** @typedef {{}} Page_Roles_SubtitleInputs */
/** @typedef {{}} Page_Roles_WhereInputs */
/** @typedef {{}} Page_Room_AckInputs */
/** @typedef {{}} Page_Room_AskInputs */
/** @typedef {{}} Page_Room_BriefingInputs */
/** @typedef {{}} Page_Room_DeliveriesInputs */
/** @typedef {{}} Page_Room_Fast_LateInputs */
/** @typedef {{}} Page_Room_FunnelInputs */
/** @typedef {{}} Page_Room_Gp_BridgeInputs */
/** @typedef {{}} Page_Room_InquiriesInputs */
/** @typedef {{}} Page_Room_Live_CasesInputs */
/** @typedef {{}} Page_Room_LostInputs */
/** @typedef {{}} Page_Room_No_GpInputs */
/** @typedef {{}} Page_Room_No_RankingInputs */
/** @typedef {{}} Page_Room_No_ReceivablesInputs */
/** @typedef {{}} Page_Room_No_TrendInputs */
/** @typedef {{}} Page_Room_OntimeInputs */
/** @typedef {{}} Page_Room_Ontime_SubheadInputs */
/** @typedef {{}} Page_Room_Per_OwnerInputs */
/** @typedef {{}} Page_Room_Per_Owner_SubheadInputs */
/** @typedef {{}} Page_Room_Profit_CashInputs */
/** @typedef {{}} Page_Room_QuadrantInputs */
/** @typedef {{}} Page_Room_Quadrant_SubheadInputs */
/** @typedef {{}} Page_Room_Receivables_AgeInputs */
/** @typedef {{}} Page_Room_Receivables_CustomerInputs */
/** @typedef {{}} Page_Room_Reliable_FastInputs */
/** @typedef {{}} Page_Room_Reliable_SlowInputs */
/** @typedef {{}} Page_Room_Slow_LateInputs */
/** @typedef {{}} Page_Room_TargetsInputs */
/** @typedef {{}} Page_Room_TurnaroundInputs */
/** @typedef {{}} Page_Room_WaitsInputs */
/** @typedef {{}} Page_Sourcing_DescriptionInputs */
/** @typedef {{}} Page_Sourcing_EyebrowInputs */
/** @typedef {{}} Page_Sourcing_HeadingInputs */
/** @typedef {{}} Page_Sourcing_Messages_SubheadInputs */
/** @typedef {{}} Page_Sourcing_Messages_TitleInputs */
/** @typedef {{}} Page_Sourcing_NavInputs */
/** @typedef {{}} Page_Sourcing_Offers_SubheadInputs */
/** @typedef {{}} Page_Sourcing_Offers_TitleInputs */
/** @typedef {{}} Page_Sourcing_Rfqs_TitleInputs */
/** @typedef {{}} Page_Sourcing_SubtitleInputs */
/** @typedef {{}} Page_Usage_Against_PlanInputs */
/** @typedef {{}} Page_Usage_Ai_CallsInputs */
/** @typedef {{}} Page_Usage_Ai_LogInputs */
/** @typedef {{}} Page_Usage_Changes_SubheadInputs */
/** @typedef {{}} Page_Usage_Changes_TitleInputs */
/** @typedef {{}} Page_Usage_Edit_PlanInputs */
/** @typedef {{}} Page_Usage_EyebrowInputs */
/** @typedef {{}} Page_Usage_HeadingInputs */
/** @typedef {{}} Page_Usage_SubtitleInputs */
/** @typedef {{}} Page_Usage_Support_SubheadInputs */
/** @typedef {{}} Page_Usage_Support_TitleInputs */
/** @typedef {{}} Page_Value_EyebrowInputs */
/** @typedef {{}} Page_Value_HeadingInputs */
/** @typedef {{}} Page_Value_PaybackInputs */
/** @typedef {{}} Page_Value_PlanInputs */
/** @typedef {{}} Page_Value_SubtitleInputs */
/** @typedef {{}} Page_Value_UsageInputs */
/** @typedef {{}} Profit_Actual_Against_ExpectedInputs */
/** @typedef {{ pct: NonNullable<unknown> }} Profit_Actual_FinalInputs */
/** @typedef {{ pct: NonNullable<unknown>, count: NonNullable<unknown> }} Profit_Actual_So_FarInputs */
/** @typedef {{}} Profit_At_QuotationInputs */
/** @typedef {{}} Profit_Check_DoneInputs */
/** @typedef {{}} Profit_Check_OpenInputs */
/** @typedef {{}} Profit_Checklist_NoteInputs */
/** @typedef {{}} Profit_Checks_Green_HeadingInputs */
/** @typedef {{}} Profit_Checks_Green_LabelInputs */
/** @typedef {{}} Profit_Checks_Green_TextInputs */
/** @typedef {{ count: NonNullable<unknown> }} Profit_Checks_OpenInputs */
/** @typedef {{}} Profit_Checks_Open_TextInputs */
/** @typedef {{ amount: NonNullable<unknown>, against: NonNullable<unknown>, note: NonNullable<unknown> }} Profit_ClaimInputs */
/** @typedef {{ amount: NonNullable<unknown>, against: NonNullable<unknown>, note: NonNullable<unknown>, creditNote: NonNullable<unknown> }} Profit_Claim_SettledInputs */
/** @typedef {{}} Profit_Claims_EmptyInputs */
/** @typedef {{}} Profit_Closed_HeadingInputs */
/** @typedef {{}} Profit_Closed_TextInputs */
/** @typedef {{ at: NonNullable<unknown> }} Profit_Closed_Text_AtInputs */
/** @typedef {{}} Profit_Col_ActualInputs */
/** @typedef {{}} Profit_Col_CostInputs */
/** @typedef {{}} Profit_Col_DifferenceInputs */
/** @typedef {{}} Profit_Col_ExpectedInputs */
/** @typedef {{}} Profit_Col_FxInputs */
/** @typedef {{}} Profit_Col_RateInputs */
/** @typedef {{}} Profit_Col_RealisedInputs */
/** @typedef {{}} Profit_Col_ReceiptInputs */
/** @typedef {{}} Profit_Col_StatusInputs */
/** @typedef {{}} Profit_Costs_NoteInputs */
/** @typedef {{}} Profit_Damage_Audio_PromptInputs */
/** @typedef {{}} Profit_Damage_Image_PromptInputs */
/** @typedef {{}} Profit_Damage_LabelInputs */
/** @typedef {{ date: NonNullable<unknown>, time: NonNullable<unknown> }} Profit_Date_TimeInputs */
/** @typedef {{ done: NonNullable<unknown>, total: NonNullable<unknown> }} Profit_Done_OfInputs */
/** @typedef {{}} Profit_Figure_ActualInputs */
/** @typedef {{}} Profit_Figure_DifferenceInputs */
/** @typedef {{}} Profit_Figure_ExpectedInputs */
/** @typedef {{}} Profit_Figure_FxInputs */
/** @typedef {{}} Profit_Fx_EmptyInputs */
/** @typedef {{}} Profit_Fx_Empty_EgpInputs */
/** @typedef {{ quoted: NonNullable<unknown>, today: NonNullable<unknown>, currency: NonNullable<unknown> }} Profit_Fx_NoteInputs */
/** @typedef {{ rate: NonNullable<unknown>, currency: NonNullable<unknown>, expected: NonNullable<unknown>, actual: NonNullable<unknown> }} Profit_Fx_Table_NoteInputs */
/** @typedef {{ done: NonNullable<unknown>, total: NonNullable<unknown> }} Profit_Green_OfInputs */
/** @typedef {{}} Profit_Invoiced_EgpInputs */
/** @typedef {{ pct: NonNullable<unknown> }} Profit_MarginInputs */
/** @typedef {{ points: NonNullable<unknown> }} Profit_Margin_PointsInputs */
/** @typedef {{}} Profit_Not_Costed_HeadingInputs */
/** @typedef {{ caseId: NonNullable<unknown>, stage: NonNullable<unknown> }} Profit_Not_Costed_TextInputs */
/** @typedef {{}} Profit_Of_ExpectedInputs */
/** @typedef {{ rate: NonNullable<unknown> }} Profit_Quoted_RateInputs */
/** @typedef {{ from: NonNullable<unknown>, to: NonNullable<unknown> }} Profit_Rate_ChangeInputs */
/** @typedef {{}} Profit_RealisedInputs */
/** @typedef {{}} Profit_State_ActualInputs */
/** @typedef {{}} Profit_State_BilledInputs */
/** @typedef {{}} Profit_State_EstimateInputs */
/** @typedef {{}} Profit_State_Not_ApplicableInputs */
/** @typedef {{}} Profit_Total_CostInputs */
/** @typedef {{}} Profit_UnrealisedInputs */
/** @typedef {{ at: NonNullable<unknown> }} Project_Acceptance_NoteInputs */
/** @typedef {{ answer: NonNullable<unknown> }} Project_AnswerInputs */
/** @typedef {{}} Project_Brief_NoteInputs */
/** @typedef {{}} Project_Col_CheckedInputs */
/** @typedef {{}} Project_Col_OpenInputs */
/** @typedef {{}} Project_Col_RequirementInputs */
/** @typedef {{}} Project_Col_ScenarioInputs */
/** @typedef {{}} Project_Col_StatusInputs */
/** @typedef {{}} Project_CoveredInputs */
/** @typedef {{ done: NonNullable<unknown>, total: NonNullable<unknown> }} Project_Covered_OfInputs */
/** @typedef {{ done: NonNullable<unknown>, total: NonNullable<unknown> }} Project_Done_OfInputs */
/** @typedef {{}} Project_Monthly_NoteInputs */
/** @typedef {{}} Project_Monthly_Note_LicencesInputs */
/** @typedef {{}} Project_OpenInputs */
/** @typedef {{}} Project_Open_In_DemoInputs */
/** @typedef {{ done: NonNullable<unknown>, total: NonNullable<unknown> }} Project_Pass_OfInputs */
/** @typedef {{}} Project_PassingInputs */
/** @typedef {{}} Project_Payment_NoteInputs */
/** @typedef {{}} Project_PhaseInputs */
/** @typedef {{ n: NonNullable<unknown> }} Project_Phase_NInputs */
/** @typedef {{ n: NonNullable<unknown> }} Project_ProblemInputs */
/** @typedef {{}} Project_Roadmap_NoteInputs */
/** @typedef {{}} Project_Show_MeInputs */
/** @typedef {{ count: NonNullable<unknown>, total: NonNullable<unknown> }} Project_Tests_PassInputs */
/** @typedef {{ n: NonNullable<unknown> }} Project_WeekInputs */
/** @typedef {{}} Roles_After_HoursInputs */
/** @typedef {{ name: NonNullable<unknown> }} Roles_Alert_SentInputs */
/** @typedef {{}} Roles_FailingInputs */
/** @typedef {{ reason: NonNullable<unknown> }} Roles_In_Hours_TextInputs */
/** @typedef {{}} Roles_Office_HoursInputs */
/** @typedef {{}} Roles_Open_PricingInputs */
/** @typedef {{}} Roles_Preset_FridayInputs */
/** @typedef {{}} Roles_Preset_OfficeInputs */
/** @typedef {{}} Roles_Preset_SaturdayInputs */
/** @typedef {{}} Roles_Preset_SundayInputs */
/** @typedef {{}} Roles_Preset_TonightInputs */
/** @typedef {{}} Roles_Send_AlertInputs */
/** @typedef {{}} Roles_Simulator_ChoiceInputs */
/** @typedef {{}} Roles_Simulator_NoteInputs */
/** @typedef {{ minutes: NonNullable<unknown>, name: NonNullable<unknown> }} Roles_Step_BackupInputs */
/** @typedef {{ name: NonNullable<unknown> }} Roles_Step_NowInputs */
/** @typedef {{ names: NonNullable<unknown> }} Roles_Step_SeniorInputs */
/** @typedef {{}} Roles_Try_ItInputs */
/** @typedef {{}} Roles_VerifiedInputs */
/** @typedef {{ full: NonNullable<unknown> }} Service_At_Full_UseInputs */
/** @typedef {{ part: NonNullable<unknown>, calls: NonNullable<unknown> }} Service_Calls_ShareInputs */
/** @typedef {{}} Service_CheckedInputs */
/** @typedef {{}} Service_Checked_NoteInputs */
/** @typedef {{ documents: NonNullable<unknown>, full: NonNullable<unknown> }} Service_Documents_ShareInputs */
/** @typedef {{}} Service_Extra_OrdersInputs */
/** @typedef {{}} Service_Gross_MarginInputs */
/** @typedef {{}} Service_Hour_CostInputs */
/** @typedef {{ n: NonNullable<unknown>, hours: NonNullable<unknown> }} Service_HoursInputs */
/** @typedef {{}} Service_Hours_Per_PersonInputs */
/** @typedef {{}} Service_Hours_SavedInputs */
/** @typedef {{ n: NonNullable<unknown>, minutes: NonNullable<unknown> }} Service_Hours_Saved_NoteInputs */
/** @typedef {{}} Service_Margin_MonthInputs */
/** @typedef {{}} Service_Order_ValueInputs */
/** @typedef {{}} Service_PaybackInputs */
/** @typedef {{ documents: NonNullable<unknown>, hours: NonNullable<unknown> }} Service_Payback_NoteInputs */
/** @typedef {{}} Service_PeopleInputs */
/** @typedef {{ month: NonNullable<unknown>, day: NonNullable<unknown>, days: NonNullable<unknown> }} Service_Plan_NoteInputs */
/** @typedef {{}} Service_Replies_MatchedInputs */
/** @typedef {{}} Service_Replies_Matched_NoteInputs */
/** @typedef {{ automatic: NonNullable<unknown>, matched: NonNullable<unknown> }} Service_Replies_ShareInputs */
/** @typedef {{ used: NonNullable<unknown>, pace: NonNullable<unknown> }} Service_So_FarInputs */
/** @typedef {{}} Service_Time_MonthInputs */
/** @typedef {{}} Service_Value_MonthInputs */
/** @typedef {{}} Service_Value_YearInputs */
/** @typedef {{}} Service_WaitingInputs */
/** @typedef {{}} Service_Waiting_NoteInputs */
/** @typedef {{}} Sourcing_All_HeldInputs */
/** @typedef {{}} Sourcing_Client_RemovedInputs */
/** @typedef {{}} Sourcing_Discard_DraftsInputs */
/** @typedef {{}} Sourcing_DraftInputs */
/** @typedef {{}} Sourcing_Draft_RfqsInputs */
/** @typedef {{}} Sourcing_Draft_Rfqs_PromptInputs */
/** @typedef {{}} Sourcing_Drafts_DiscardedInputs */
/** @typedef {{}} Sourcing_FullInputs */
/** @typedef {{}} Sourcing_Full_NoteInputs */
/** @typedef {{ lines: NonNullable<unknown> }} Sourcing_Held_BackInputs */
/** @typedef {{}} Sourcing_How_To_SendInputs */
/** @typedef {{ rfqs: NonNullable<unknown> }} Sourcing_Line_AskedInputs */
/** @typedef {{ reason: NonNullable<unknown> }} Sourcing_Line_HeldInputs */
/** @typedef {{ n: NonNullable<unknown>, count: NonNullable<unknown> }} Sourcing_Line_OffersInputs */
/** @typedef {{}} Sourcing_LinesInputs */
/** @typedef {{}} Sourcing_New_Supplier_TagInputs */
/** @typedef {{ at: NonNullable<unknown> }} Sourcing_Next_AtInputs */
/** @typedef {{}} Sourcing_No_Customer_FilesInputs */
/** @typedef {{}} Sourcing_No_LinesInputs */
/** @typedef {{}} Sourcing_No_One_ChasedInputs */
/** @typedef {{}} Sourcing_Not_NeededInputs */
/** @typedef {{}} Sourcing_Our_ReferenceInputs */
/** @typedef {{}} Sourcing_Outcome_DeclinedInputs */
/** @typedef {{}} Sourcing_Outcome_EscalatedInputs */
/** @typedef {{}} Sourcing_Outcome_New_SupplierInputs */
/** @typedef {{}} Sourcing_Outcome_ReminderInputs */
/** @typedef {{}} Sourcing_Outcome_RepliedInputs */
/** @typedef {{ currency: NonNullable<unknown>, price: NonNullable<unknown>, per: NonNullable<unknown> }} Sourcing_PriceInputs */
/** @typedef {{}} Sourcing_Price_HiddenInputs */
/** @typedef {{ description: NonNullable<unknown>, price: NonNullable<unknown>, quoted: NonNullable<unknown>, valid: NonNullable<unknown> }} Sourcing_Quoted_LineInputs */
/** @typedef {{ owner: NonNullable<unknown> }} Sourcing_Reminder_RuleInputs */
/** @typedef {{}} Sourcing_RemoveInputs */
/** @typedef {{ reference: NonNullable<unknown> }} Sourcing_RemovedInputs */
/** @typedef {{}} Sourcing_Saved_On_ReplyInputs */
/** @typedef {{}} Sourcing_Send_HeadingInputs */
/** @typedef {{}} Sourcing_Send_LabelInputs */
/** @typedef {{ n: NonNullable<unknown>, count: NonNullable<unknown> }} Sourcing_Send_NInputs */
/** @typedef {{ n: NonNullable<unknown>, count: NonNullable<unknown>, suppliers: NonNullable<unknown>, due: NonNullable<unknown> }} Sourcing_Send_TextInputs */
/** @typedef {{ n: NonNullable<unknown>, count: NonNullable<unknown> }} Sourcing_SentInputs */
/** @typedef {{ list: NonNullable<unknown> }} Sourcing_SkippedInputs */
/** @typedef {{}} Sourcing_SplitInputs */
/** @typedef {{}} Sourcing_Split_NoteInputs */
/** @typedef {{ subject: NonNullable<unknown> }} Sourcing_SubjectInputs */
/** @typedef {{}} Sourcing_Supplier_RecordInputs */
/** @typedef {{}} Sourcing_System_ChoosesInputs */
/** @typedef {{}} Sourcing_Vessel_RemovedInputs */
/** @typedef {{}} Tour_Close_1_BodyInputs */
/** @typedef {{}} Tour_Close_1_TargetInputs */
/** @typedef {{}} Tour_Close_1_TitleInputs */
/** @typedef {{}} Tour_Close_2_BodyInputs */
/** @typedef {{}} Tour_Close_2_TargetInputs */
/** @typedef {{}} Tour_Close_2_TitleInputs */
/** @typedef {{}} Tour_Close_3_BodyInputs */
/** @typedef {{}} Tour_Close_3_TargetInputs */
/** @typedef {{}} Tour_Close_3_TitleInputs */
/** @typedef {{}} Tour_Close_4_BodyInputs */
/** @typedef {{}} Tour_Close_4_TargetInputs */
/** @typedef {{}} Tour_Close_4_TitleInputs */
/** @typedef {{}} Tour_Close_SummaryInputs */
/** @typedef {{}} Tour_Close_TitleInputs */
/** @typedef {{}} Tour_Control_Room_1_BodyInputs */
/** @typedef {{}} Tour_Control_Room_1_TargetInputs */
/** @typedef {{}} Tour_Control_Room_1_TitleInputs */
/** @typedef {{}} Tour_Control_Room_2_BodyInputs */
/** @typedef {{}} Tour_Control_Room_2_ClickInputs */
/** @typedef {{}} Tour_Control_Room_2_TargetInputs */
/** @typedef {{}} Tour_Control_Room_2_TitleInputs */
/** @typedef {{}} Tour_Control_Room_3_BodyInputs */
/** @typedef {{}} Tour_Control_Room_3_TargetInputs */
/** @typedef {{}} Tour_Control_Room_3_TitleInputs */
/** @typedef {{}} Tour_Control_Room_4_BodyInputs */
/** @typedef {{}} Tour_Control_Room_4_TargetInputs */
/** @typedef {{}} Tour_Control_Room_4_TitleInputs */
/** @typedef {{}} Tour_Control_Room_SummaryInputs */
/** @typedef {{}} Tour_Control_Room_TitleInputs */
/** @typedef {{}} Tour_Delivery_To_Cash_1_BodyInputs */
/** @typedef {{}} Tour_Delivery_To_Cash_1_TargetInputs */
/** @typedef {{}} Tour_Delivery_To_Cash_1_TitleInputs */
/** @typedef {{}} Tour_Delivery_To_Cash_2_BodyInputs */
/** @typedef {{}} Tour_Delivery_To_Cash_2_TargetInputs */
/** @typedef {{}} Tour_Delivery_To_Cash_2_TitleInputs */
/** @typedef {{}} Tour_Delivery_To_Cash_3_BodyInputs */
/** @typedef {{}} Tour_Delivery_To_Cash_3_TargetInputs */
/** @typedef {{}} Tour_Delivery_To_Cash_3_TitleInputs */
/** @typedef {{}} Tour_Delivery_To_Cash_4_BodyInputs */
/** @typedef {{}} Tour_Delivery_To_Cash_4_TargetInputs */
/** @typedef {{}} Tour_Delivery_To_Cash_4_TitleInputs */
/** @typedef {{}} Tour_Delivery_To_Cash_5_BodyInputs */
/** @typedef {{}} Tour_Delivery_To_Cash_5_TargetInputs */
/** @typedef {{}} Tour_Delivery_To_Cash_5_TitleInputs */
/** @typedef {{}} Tour_Delivery_To_Cash_SummaryInputs */
/** @typedef {{}} Tour_Delivery_To_Cash_TitleInputs */
/** @typedef {{}} Tour_Exceptions_1_BodyInputs */
/** @typedef {{}} Tour_Exceptions_1_TargetInputs */
/** @typedef {{}} Tour_Exceptions_1_TitleInputs */
/** @typedef {{}} Tour_Exceptions_2_BodyInputs */
/** @typedef {{}} Tour_Exceptions_2_TargetInputs */
/** @typedef {{}} Tour_Exceptions_2_TitleInputs */
/** @typedef {{}} Tour_Exceptions_3_BodyInputs */
/** @typedef {{}} Tour_Exceptions_3_TargetInputs */
/** @typedef {{}} Tour_Exceptions_3_TitleInputs */
/** @typedef {{}} Tour_Exceptions_4_BodyInputs */
/** @typedef {{}} Tour_Exceptions_4_TargetInputs */
/** @typedef {{}} Tour_Exceptions_4_TitleInputs */
/** @typedef {{}} Tour_Exceptions_SummaryInputs */
/** @typedef {{}} Tour_Exceptions_TitleInputs */
/** @typedef {{}} Tour_Growth_1_BodyInputs */
/** @typedef {{}} Tour_Growth_1_TargetInputs */
/** @typedef {{}} Tour_Growth_1_TitleInputs */
/** @typedef {{}} Tour_Growth_2_BodyInputs */
/** @typedef {{}} Tour_Growth_2_TargetInputs */
/** @typedef {{}} Tour_Growth_2_TitleInputs */
/** @typedef {{}} Tour_Growth_3_BodyInputs */
/** @typedef {{}} Tour_Growth_3_TargetInputs */
/** @typedef {{}} Tour_Growth_3_TitleInputs */
/** @typedef {{}} Tour_Growth_SummaryInputs */
/** @typedef {{}} Tour_Growth_TitleInputs */
/** @typedef {{}} Tour_Handover_1_BodyInputs */
/** @typedef {{}} Tour_Handover_1_TargetInputs */
/** @typedef {{}} Tour_Handover_1_TitleInputs */
/** @typedef {{}} Tour_Handover_2_BodyInputs */
/** @typedef {{}} Tour_Handover_2_TargetInputs */
/** @typedef {{}} Tour_Handover_2_TitleInputs */
/** @typedef {{}} Tour_Handover_3_BodyInputs */
/** @typedef {{}} Tour_Handover_3_TargetInputs */
/** @typedef {{}} Tour_Handover_3_TitleInputs */
/** @typedef {{}} Tour_Handover_4_BodyInputs */
/** @typedef {{}} Tour_Handover_4_TargetInputs */
/** @typedef {{}} Tour_Handover_4_TitleInputs */
/** @typedef {{}} Tour_Handover_SummaryInputs */
/** @typedef {{}} Tour_Handover_TitleInputs */
/** @typedef {{}} Tour_Morning_1_BodyInputs */
/** @typedef {{}} Tour_Morning_1_TitleInputs */
/** @typedef {{}} Tour_Morning_2_BodyInputs */
/** @typedef {{}} Tour_Morning_2_TargetInputs */
/** @typedef {{}} Tour_Morning_2_TitleInputs */
/** @typedef {{}} Tour_Morning_3_BodyInputs */
/** @typedef {{}} Tour_Morning_3_TargetInputs */
/** @typedef {{}} Tour_Morning_3_TitleInputs */
/** @typedef {{}} Tour_Morning_4_BodyInputs */
/** @typedef {{}} Tour_Morning_4_TargetInputs */
/** @typedef {{}} Tour_Morning_4_TitleInputs */
/** @typedef {{}} Tour_Morning_5_BodyInputs */
/** @typedef {{}} Tour_Morning_5_TargetInputs */
/** @typedef {{}} Tour_Morning_5_TitleInputs */
/** @typedef {{}} Tour_Morning_6_BodyInputs */
/** @typedef {{}} Tour_Morning_6_TargetInputs */
/** @typedef {{}} Tour_Morning_6_TitleInputs */
/** @typedef {{}} Tour_Morning_7_BodyInputs */
/** @typedef {{}} Tour_Morning_7_TargetInputs */
/** @typedef {{}} Tour_Morning_7_TitleInputs */
/** @typedef {{}} Tour_Morning_SummaryInputs */
/** @typedef {{}} Tour_Morning_TitleInputs */
/** @typedef {{}} Tour_Po_Check_1_BodyInputs */
/** @typedef {{}} Tour_Po_Check_1_TargetInputs */
/** @typedef {{}} Tour_Po_Check_1_TitleInputs */
/** @typedef {{}} Tour_Po_Check_2_BodyInputs */
/** @typedef {{}} Tour_Po_Check_2_TargetInputs */
/** @typedef {{}} Tour_Po_Check_2_TitleInputs */
/** @typedef {{}} Tour_Po_Check_3_BodyInputs */
/** @typedef {{}} Tour_Po_Check_3_TargetInputs */
/** @typedef {{}} Tour_Po_Check_3_TitleInputs */
/** @typedef {{}} Tour_Po_Check_4_BodyInputs */
/** @typedef {{}} Tour_Po_Check_4_TargetInputs */
/** @typedef {{}} Tour_Po_Check_4_TitleInputs */
/** @typedef {{}} Tour_Po_Check_5_BodyInputs */
/** @typedef {{}} Tour_Po_Check_5_TargetInputs */
/** @typedef {{}} Tour_Po_Check_5_TitleInputs */
/** @typedef {{}} Tour_Po_Check_SummaryInputs */
/** @typedef {{}} Tour_Po_Check_TitleInputs */
/** @typedef {{}} Tour_Quote_1_BodyInputs */
/** @typedef {{}} Tour_Quote_1_ClickInputs */
/** @typedef {{}} Tour_Quote_1_TargetInputs */
/** @typedef {{}} Tour_Quote_1_TitleInputs */
/** @typedef {{}} Tour_Quote_2_BodyInputs */
/** @typedef {{}} Tour_Quote_2_TargetInputs */
/** @typedef {{}} Tour_Quote_2_TitleInputs */
/** @typedef {{}} Tour_Quote_3_BodyInputs */
/** @typedef {{}} Tour_Quote_3_TargetInputs */
/** @typedef {{}} Tour_Quote_3_TitleInputs */
/** @typedef {{}} Tour_Quote_4_BodyInputs */
/** @typedef {{}} Tour_Quote_4_TargetInputs */
/** @typedef {{}} Tour_Quote_4_TitleInputs */
/** @typedef {{}} Tour_Quote_5_BodyInputs */
/** @typedef {{}} Tour_Quote_5_TargetInputs */
/** @typedef {{}} Tour_Quote_5_TitleInputs */
/** @typedef {{}} Tour_Quote_6_BodyInputs */
/** @typedef {{}} Tour_Quote_6_TargetInputs */
/** @typedef {{}} Tour_Quote_6_TitleInputs */
/** @typedef {{}} Tour_Quote_7_BodyInputs */
/** @typedef {{}} Tour_Quote_7_ClickInputs */
/** @typedef {{}} Tour_Quote_7_TargetInputs */
/** @typedef {{}} Tour_Quote_7_TitleInputs */
/** @typedef {{}} Tour_Quote_SummaryInputs */
/** @typedef {{}} Tour_Quote_TitleInputs */
/** @typedef {{}} Tour_Replies_1_BodyInputs */
/** @typedef {{}} Tour_Replies_1_TargetInputs */
/** @typedef {{}} Tour_Replies_1_TitleInputs */
/** @typedef {{}} Tour_Replies_2_BodyInputs */
/** @typedef {{}} Tour_Replies_2_ClickInputs */
/** @typedef {{}} Tour_Replies_2_TargetInputs */
/** @typedef {{}} Tour_Replies_2_TitleInputs */
/** @typedef {{}} Tour_Replies_3_BodyInputs */
/** @typedef {{}} Tour_Replies_3_TargetInputs */
/** @typedef {{}} Tour_Replies_3_TitleInputs */
/** @typedef {{}} Tour_Replies_4_BodyInputs */
/** @typedef {{}} Tour_Replies_4_TargetInputs */
/** @typedef {{}} Tour_Replies_4_TitleInputs */
/** @typedef {{}} Tour_Replies_5_BodyInputs */
/** @typedef {{}} Tour_Replies_5_TargetInputs */
/** @typedef {{}} Tour_Replies_5_TitleInputs */
/** @typedef {{}} Tour_Replies_SummaryInputs */
/** @typedef {{}} Tour_Replies_TitleInputs */
/** @typedef {{}} Tour_Rfq_To_Case_1_BodyInputs */
/** @typedef {{}} Tour_Rfq_To_Case_1_TargetInputs */
/** @typedef {{}} Tour_Rfq_To_Case_1_TitleInputs */
/** @typedef {{}} Tour_Rfq_To_Case_2_BodyInputs */
/** @typedef {{}} Tour_Rfq_To_Case_2_ClickInputs */
/** @typedef {{}} Tour_Rfq_To_Case_2_TargetInputs */
/** @typedef {{}} Tour_Rfq_To_Case_2_TitleInputs */
/** @typedef {{}} Tour_Rfq_To_Case_3_BodyInputs */
/** @typedef {{}} Tour_Rfq_To_Case_3_ClickInputs */
/** @typedef {{}} Tour_Rfq_To_Case_3_TargetInputs */
/** @typedef {{}} Tour_Rfq_To_Case_3_TitleInputs */
/** @typedef {{}} Tour_Rfq_To_Case_4_BodyInputs */
/** @typedef {{}} Tour_Rfq_To_Case_4_TargetInputs */
/** @typedef {{}} Tour_Rfq_To_Case_4_TitleInputs */
/** @typedef {{}} Tour_Rfq_To_Case_5_BodyInputs */
/** @typedef {{}} Tour_Rfq_To_Case_5_TargetInputs */
/** @typedef {{}} Tour_Rfq_To_Case_5_TitleInputs */
/** @typedef {{}} Tour_Rfq_To_Case_6_BodyInputs */
/** @typedef {{}} Tour_Rfq_To_Case_6_TargetInputs */
/** @typedef {{}} Tour_Rfq_To_Case_6_TitleInputs */
/** @typedef {{}} Tour_Rfq_To_Case_SummaryInputs */
/** @typedef {{}} Tour_Rfq_To_Case_TitleInputs */
/** @typedef {{}} Visuals_AckInputs */
/** @typedef {{}} Visuals_Ack_CaptionInputs */
/** @typedef {{}} Visuals_Customer_DiscountInputs */
/** @typedef {{ value: NonNullable<unknown> }} Visuals_DaysInputs */
/** @typedef {{}} Visuals_DeadlinesInputs */
/** @typedef {{}} Visuals_DiscountInputs */
/** @typedef {{}} Visuals_Gp_BridgeInputs */
/** @typedef {{}} Visuals_Gp_Bridge_NoteInputs */
/** @typedef {{}} Visuals_Gross_ProfitInputs */
/** @typedef {{}} Visuals_MarginInputs */
/** @typedef {{}} Visuals_Margin_AfterInputs */
/** @typedef {{}} Visuals_Margin_BeforeInputs */
/** @typedef {{ min: NonNullable<unknown>, target: NonNullable<unknown> }} Visuals_Margin_CaptionInputs */
/** @typedef {{ value: NonNullable<unknown> }} Visuals_MinutesInputs */
/** @typedef {{ max: NonNullable<unknown> }} Visuals_Policy_MaxInputs */
/** @typedef {{}} Visuals_Price_BuiltInputs */
/** @typedef {{}} Visuals_ProfitInputs */
/** @typedef {{ currency: NonNullable<unknown> }} Visuals_RateInputs */
/** @typedef {{}} Visuals_ReceivablesInputs */
/** @typedef {{}} Visuals_Selling_PriceInputs */
/** @typedef {{ currency: NonNullable<unknown> }} Visuals_Selling_Price_InInputs */
/** @typedef {{}} Visuals_Shared_ChargesInputs */
/** @typedef {{}} Visuals_Supplier_CostInputs */
/** @typedef {{ target: NonNullable<unknown> }} Visuals_TargetInputs */
/** @typedef {{}} Visuals_Targets_NoteInputs */
/** @typedef {{}} Visuals_This_MonthInputs */
/** @typedef {{}} Visuals_TurnaroundInputs */
/** @typedef {{}} Visuals_Turnaround_CaptionInputs */
/** @typedef {{ min: NonNullable<unknown> }} Visuals_Under_MinimumInputs */
/** @typedef {{}} Visuals_What_IfInputs */
/** @typedef {{}} Visuals_What_If_NoteInputs */
/** @typedef {{ target: NonNullable<unknown> }} Visuals_Win_CaptionInputs */
/** @typedef {{}} Visuals_Win_RateInputs */
import * as __paraglideRegistry from "../registry.js"


export const action_cash_approve = /** @type {(inputs: Action_Cash_ApproveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اعتماد`)
};

export const action_cash_approve_call_back = /** @type {(inputs: Action_Cash_Approve_Call_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اعتماد بعد معاودة الاتصال`)
};

export const action_cash_approve_heading = /** @type {(inputs: Action_Cash_Approve_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`اعتماد: ${i?.title}`)
};

export const action_cash_approved = /** @type {(inputs: Action_Cash_ApprovedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`اعتُمد: ${i?.title}.`)
};

export const action_cash_call_back_text = /** @type {(inputs: Action_Cash_Call_Back_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`عاود الاتصال بالمورّد على الرقم المسجَّل (${i?.phone})، لا على رقم ورد في الطلب أبدًا، وأكّد معه الحساب الجديد.`)
};

export const action_cash_called_back = /** @type {(inputs: Action_Cash_Called_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عاودتُ الاتصال على الرقم المسجَّل وأكّد المورّد الحساب الجديد`)
};

export const action_cash_decided = /** @type {(inputs: Action_Cash_DecidedInputs) => LocalizedString} */ (i) => {
	if (i?.decision === "approve") return /** @type {LocalizedString} */ (`اعتمده ${i?.name}`);
	return /** @type {LocalizedString} */ (`رفضه ${i?.name}`)
};

export const action_cash_note_optional = /** @type {(inputs: Action_Cash_Note_OptionalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملاحظة (اختيارية)`)
};

export const action_cash_reason_required = /** @type {(inputs: Action_Cash_Reason_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السبب (مطلوب)`)
};

export const action_cash_reject = /** @type {(inputs: Action_Cash_RejectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`رفض`)
};

export const action_cash_reject_heading = /** @type {(inputs: Action_Cash_Reject_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`رفض: ${i?.title}`)
};

export const action_cash_rejected = /** @type {(inputs: Action_Cash_RejectedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`رُفض: ${i?.title}.`)
};

export const action_eta_alert = /** @type {(inputs: Action_Eta_AlertInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تنبيه إلى ${i?.owner} وKarim Balbaa.`)
};

export const action_eta_apply = /** @type {(inputs: Action_Eta_ApplyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طبّق إعادة التخطيط ونبّه`)
};

export const action_eta_backorder_in_time = /** @type {(inputs: Action_Eta_Backorder_In_TimeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`طلب مؤجل للبند ${i?.line} (${i?.supplier}، ${i?.date}): أصبح في موعد الشحنة`)
};

export const action_eta_backorder_late = /** @type {(inputs: Action_Eta_Backorder_LateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`طلب مؤجل للبند ${i?.line} (${i?.supplier}، ${i?.date}): ما زال متأخرًا. صعّد.`)
};

export const action_eta_from = /** @type {(inputs: Action_Eta_FromInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`من ${i?.from} · الموضوع: ${i?.subject}`)
};

export const action_eta_heading = /** @type {(inputs: Action_Eta_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`رسالة الوكيل: تحديث موعد الوصول`)
};

export const action_eta_label = /** @type {(inputs: Action_Eta_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`رسالة الوكيل: تحديث موعد الوصول`)
};

export const action_eta_move = /** @type {(inputs: Action_Eta_MoveInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.drop}: على متن السفينة ${i?.from} ← ${i?.to} · أُعيد حجز اللانش · أُعيد تأكيد الشاحنة وفريق الصعود (مهمة لـ ${i?.owner})`)
};

export const action_eta_no_drop = /** @type {(inputs: Action_Eta_No_DropInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد شحنة مفتوحة لنقلها.`)
};

export const action_eta_read = /** @type {(inputs: Action_Eta_ReadInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`قراءة الذكاء الاصطناعي · 97% · موعد الوصول الجديد ${i?.eta} (كان ${i?.was})`)
};

export const action_eta_what_moves = /** @type {(inputs: Action_Eta_What_MovesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ما الذي يتغير`)
};

export const action_history_organise = /** @type {(inputs: Action_History_OrganiseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تنظيم`)
};

export const action_history_organised = /** @type {(inputs: Action_History_OrganisedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نُظّم السجل، والعناصر غير المؤكدة بانتظارك`)
};

export const action_inbox_ack_auto = /** @type {(inputs: Action_Inbox_Ack_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يُرسل الإقرار بالاستلام مرة واحدة من القالب المعتمد.`)
};

export const action_inbox_ack_manual = /** @type {(inputs: Action_Inbox_Ack_ManualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إرسال الإقرار بالاستلام متروك لك يدويًا.`)
};

export const action_inbox_backup = /** @type {(inputs: Action_Inbox_BackupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`البديل`)
};

export const action_inbox_create = /** @type {(inputs: Action_Inbox_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إنشاء ملف`)
};

export const action_inbox_create_heading = /** @type {(inputs: Action_Inbox_Create_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إنشاء هذا الملف؟`)
};

export const action_inbox_creates = /** @type {(inputs: Action_Inbox_CreatesInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (i?.kind === "service" && i?.isNew === "yes" && countPlural === "zero") return /** @type {LocalizedString} */ (`يُنشئ ملف خدمة للعميل ${i?.customer} (سجل عميل جديد) يضم صفر بنود كما في المسودة تمامًا.`);
	if (i?.kind === "service" && i?.isNew === "yes" && countPlural === "one") return /** @type {LocalizedString} */ (`يُنشئ ملف خدمة للعميل ${i?.customer} (سجل عميل جديد) يضم بندًا واحدًا كما في المسودة تمامًا.`);
	if (i?.kind === "service" && i?.isNew === "yes" && countPlural === "two") return /** @type {LocalizedString} */ (`يُنشئ ملف خدمة للعميل ${i?.customer} (سجل عميل جديد) يضم بندين كما في المسودة تمامًا.`);
	if (i?.kind === "service" && i?.isNew === "yes" && countPlural === "few") return /** @type {LocalizedString} */ (`يُنشئ ملف خدمة للعميل ${i?.customer} (سجل عميل جديد) يضم ${__paraglideRegistry.icuPound("ar", i?.count, {})} بنود كما في المسودة تمامًا.`);
	if (i?.kind === "service" && i?.isNew === "yes" && countPlural === "many") return /** @type {LocalizedString} */ (`يُنشئ ملف خدمة للعميل ${i?.customer} (سجل عميل جديد) يضم ${__paraglideRegistry.icuPound("ar", i?.count, {})} بندًا كما في المسودة تمامًا.`);
	if (i?.kind === "service" && i?.isNew === "yes") return /** @type {LocalizedString} */ (`يُنشئ ملف خدمة للعميل ${i?.customer} (سجل عميل جديد) يضم ${__paraglideRegistry.icuPound("ar", i?.count, {})} بند كما في المسودة تمامًا.`);
	if (i?.kind === "service" && countPlural === "zero") return /** @type {LocalizedString} */ (`يُنشئ ملف خدمة للعميل ${i?.customer} يضم صفر بنود كما في المسودة تمامًا.`);
	if (i?.kind === "service" && countPlural === "one") return /** @type {LocalizedString} */ (`يُنشئ ملف خدمة للعميل ${i?.customer} يضم بندًا واحدًا كما في المسودة تمامًا.`);
	if (i?.kind === "service" && countPlural === "two") return /** @type {LocalizedString} */ (`يُنشئ ملف خدمة للعميل ${i?.customer} يضم بندين كما في المسودة تمامًا.`);
	if (i?.kind === "service" && countPlural === "few") return /** @type {LocalizedString} */ (`يُنشئ ملف خدمة للعميل ${i?.customer} يضم ${__paraglideRegistry.icuPound("ar", i?.count, {})} بنود كما في المسودة تمامًا.`);
	if (i?.kind === "service" && countPlural === "many") return /** @type {LocalizedString} */ (`يُنشئ ملف خدمة للعميل ${i?.customer} يضم ${__paraglideRegistry.icuPound("ar", i?.count, {})} بندًا كما في المسودة تمامًا.`);
	if (i?.kind === "service") return /** @type {LocalizedString} */ (`يُنشئ ملف خدمة للعميل ${i?.customer} يضم ${__paraglideRegistry.icuPound("ar", i?.count, {})} بند كما في المسودة تمامًا.`);
	if (i?.isNew === "yes" && countPlural === "zero") return /** @type {LocalizedString} */ (`يُنشئ ملف طلب عرض أسعار للعميل ${i?.customer} (سجل عميل جديد) يضم صفر بنود كما في المسودة تمامًا.`);
	if (i?.isNew === "yes" && countPlural === "one") return /** @type {LocalizedString} */ (`يُنشئ ملف طلب عرض أسعار للعميل ${i?.customer} (سجل عميل جديد) يضم بندًا واحدًا كما في المسودة تمامًا.`);
	if (i?.isNew === "yes" && countPlural === "two") return /** @type {LocalizedString} */ (`يُنشئ ملف طلب عرض أسعار للعميل ${i?.customer} (سجل عميل جديد) يضم بندين كما في المسودة تمامًا.`);
	if (i?.isNew === "yes" && countPlural === "few") return /** @type {LocalizedString} */ (`يُنشئ ملف طلب عرض أسعار للعميل ${i?.customer} (سجل عميل جديد) يضم ${__paraglideRegistry.icuPound("ar", i?.count, {})} بنود كما في المسودة تمامًا.`);
	if (i?.isNew === "yes" && countPlural === "many") return /** @type {LocalizedString} */ (`يُنشئ ملف طلب عرض أسعار للعميل ${i?.customer} (سجل عميل جديد) يضم ${__paraglideRegistry.icuPound("ar", i?.count, {})} بندًا كما في المسودة تمامًا.`);
	if (i?.isNew === "yes") return /** @type {LocalizedString} */ (`يُنشئ ملف طلب عرض أسعار للعميل ${i?.customer} (سجل عميل جديد) يضم ${__paraglideRegistry.icuPound("ar", i?.count, {})} بند كما في المسودة تمامًا.`);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`يُنشئ ملف طلب عرض أسعار للعميل ${i?.customer} يضم صفر بنود كما في المسودة تمامًا.`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`يُنشئ ملف طلب عرض أسعار للعميل ${i?.customer} يضم بندًا واحدًا كما في المسودة تمامًا.`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`يُنشئ ملف طلب عرض أسعار للعميل ${i?.customer} يضم بندين كما في المسودة تمامًا.`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`يُنشئ ملف طلب عرض أسعار للعميل ${i?.customer} يضم ${__paraglideRegistry.icuPound("ar", i?.count, {})} بنود كما في المسودة تمامًا.`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`يُنشئ ملف طلب عرض أسعار للعميل ${i?.customer} يضم ${__paraglideRegistry.icuPound("ar", i?.count, {})} بندًا كما في المسودة تمامًا.`);
	return /** @type {LocalizedString} */ (`يُنشئ ملف طلب عرض أسعار للعميل ${i?.customer} يضم ${__paraglideRegistry.icuPound("ar", i?.count, {})} بند كما في المسودة تمامًا.`)
};

export const action_inbox_deadline = /** @type {(inputs: Action_Inbox_DeadlineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الموعد النهائي لعرض السعر`)
};

export const action_inbox_deadline_hint = /** @type {(inputs: Action_Inbox_Deadline_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يُجدوَل تذكير قبله.`)
};

export const action_inbox_flagged = /** @type {(inputs: Action_Inbox_FlaggedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تبقى البنود المعلَّمة بحالة «تحتاج إلى استيضاح» حتى يرد العميل.`)
};

export const action_inbox_new_email = /** @type {(inputs: Action_Inbox_New_EmailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`رسالة جديدة: «${i?.subject}»`)
};

export const action_inbox_new_reply = /** @type {(inputs: Action_Inbox_New_ReplyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`رد جديد من مورّد: «${i?.subject}»`)
};

export const action_inbox_not_related = /** @type {(inputs: Action_Inbox_Not_RelatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عُلِّمت كغير ذات صلة`)
};

export const action_inbox_owner = /** @type {(inputs: Action_Inbox_OwnerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المسؤول`)
};

export const action_inbox_simulate_email = /** @type {(inputs: Action_Inbox_Simulate_EmailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`محاكاة رسالة جديدة`)
};

export const action_inbox_simulate_forward = /** @type {(inputs: Action_Inbox_Simulate_ForwardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`محاكاة نسخة مُعاد توجيهها`)
};

export const action_inbox_simulate_reply = /** @type {(inputs: Action_Inbox_Simulate_ReplyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`محاكاة رد مورّد`)
};

export const action_money = /** @type {(inputs: Action_MoneyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} ${i?.currency}`)
};

export const action_order_read_po = /** @type {(inputs: Action_Order_Read_PoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قراءة أمر شراء العميل`)
};

export const action_profit_actual_line = /** @type {(inputs: Action_Profit_Actual_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.label} (${i?.detail}): من ${i?.expected} إلى ${i?.actual}`)
};

export const action_profit_actuals_done = /** @type {(inputs: Action_Profit_Actuals_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تأكدت التكاليف الفعلية. واستُبدلت التقديرات في الملف.`)
};

export const action_profit_actuals_heading = /** @type {(inputs: Action_Profit_Actuals_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استبدال التقديرات بالتكاليف الفعلية`)
};

export const action_profit_actuals_intro = /** @type {(inputs: Action_Profit_Actuals_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تحل هذه المبالغ المُفوترة محل التقديرات في المصاريف المشتركة للملف:`)
};

export const action_profit_bank_reference = /** @type {(inputs: Action_Profit_Bank_ReferenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المرجع البنكي`)
};

export const action_profit_claim_done = /** @type {(inputs: Action_Profit_Claim_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`سُجّل الإشعار الدائن ${i?.creditNote}. وسُوّيت المطالبة ${i?.ref}.`)
};

export const action_profit_claim_heading = /** @type {(inputs: Action_Profit_Claim_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تسوية المطالبة ${i?.ref}`)
};

export const action_profit_claim_text = /** @type {(inputs: Action_Profit_Claim_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.title}. ${i?.note}
يُقيَّد الإشعار الدائن ${i?.creditNote} من ${i?.against} بمبلغ ${i?.amount} مقابل تكلفة الاستبدال.`)
};

export const action_profit_close = /** @type {(inputs: Action_Profit_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إغلاق الملف`)
};

export const action_profit_close_done = /** @type {(inputs: Action_Profit_Close_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُغلق ${i?.case}. وعادت أسعار الموردين ونتائج الالتزام بالمواعيد إلى سجلاتهم.`)
};

export const action_profit_close_heading = /** @type {(inputs: Action_Profit_Close_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`إغلاق ${i?.case}؟`)
};

export const action_profit_close_open = /** @type {(inputs: Action_Profit_Close_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اجعل كل الفحوص خضراء للإغلاق.`)
};

export const action_profit_close_ready = /** @type {(inputs: Action_Profit_Close_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل الفحوص خضراء.`)
};

export const action_profit_close_role = /** @type {(inputs: Action_Profit_Close_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإدارة والمالية تغلقان الملفات.`)
};

export const action_profit_close_text = /** @type {(inputs: Action_Profit_Close_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`إجمالي الربح الفعلي ${i?.actual} (${i?.actualMargin}) مقابل ${i?.expected} متوقعًا (${i?.expectedMargin}).
تعود أسعار الموردين ومدد التوريد ونتائج الالتزام بالمواعيد إلى سجلات الموردين.`)
};

export const action_profit_confirm_actuals = /** @type {(inputs: Action_Profit_Confirm_ActualsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تأكيد التكاليف الفعلية`)
};

export const action_profit_receipt_description = /** @type {(inputs: Action_Profit_Receipt_DescriptionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} مستلمة من ${i?.customer}. تُسجَّل بعد الحركة البنكية؛ والمنصة لا تبدأ أي تحويل أبدًا.`)
};

export const action_profit_receipt_description_rate = /** @type {(inputs: Action_Profit_Receipt_Description_RateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} مستلمة من ${i?.customer} بسعر ${i?.rate} EGP/${i?.currency}. تُسجَّل بعد الحركة البنكية؛ والمنصة لا تبدأ أي تحويل أبدًا.`)
};

export const action_profit_receipt_done = /** @type {(inputs: Action_Profit_Receipt_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`سُجّل المقبوض وخُصّص للفاتورة ${i?.invoice}.`)
};

export const action_profit_receipt_prompt = /** @type {(inputs: Action_Profit_Receipt_PromptInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تسجيل مقبوض للفاتورة ${i?.invoice}`)
};

export const action_profit_record_credit_note = /** @type {(inputs: Action_Profit_Record_Credit_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسجيل إشعار دائن`)
};

export const action_profit_record_receipt = /** @type {(inputs: Action_Profit_Record_ReceiptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسجيل مقبوض`)
};

export const action_rfqs_simulate = /** @type {(inputs: Action_Rfqs_SimulateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`محاكاة الردود`)
};

export const action_rfqs_simulated = /** @type {(inputs: Action_Rfqs_SimulatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`وصلت ردود الموردين، والعروض في تبويب «مقارنة»`)
};

export const api_assistant_and_more = /** @type {(inputs: Api_Assistant_And_MoreInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.list} و${i?.more} غيرها`)
};

export const api_assistant_approval_item = /** @type {(inputs: Api_Assistant_Approval_ItemInputs) => LocalizedString} */ (i) => {
	if (i?.twoPerson === "yes") return /** @type {LocalizedString} */ (`${i?.title}: ${i?.type}، من ${i?.from} · الموافقون ${i?.approvers} (قاعدة الشخصين)`);
	return /** @type {LocalizedString} */ (`${i?.title}: ${i?.type}، من ${i?.from} · الموافقون ${i?.approvers}`)
};

export const api_assistant_approvals_for_you = /** @type {(inputs: Api_Assistant_Approvals_For_YouInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`موافقة واحدة تنتظرك: ${i?.list}.`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`موافقتان تنتظرانك: ${i?.list}.`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} موافقات تنتظرك: ${i?.list}.`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} موافقة تنتظرك: ${i?.list}.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} موافقة تنتظرك: ${i?.list}.`)
};

export const api_assistant_approvals_waiting = /** @type {(inputs: Api_Assistant_Approvals_WaitingInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`موافقة واحدة تنتظر.`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`موافقتان تنتظران.`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} موافقات تنتظر.`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} موافقة تنتظر.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} موافقة تنتظر.`)
};

export const api_assistant_ask_a_question = /** @type {(inputs: Api_Assistant_Ask_A_QuestionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اطرح سؤالًا.`)
};

export const api_assistant_bills_on_hold = /** @type {(inputs: Api_Assistant_Bills_On_HoldInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`فاتورة مورّد واحدة معلّقة بعد المطابقة الثلاثية: ${i?.list}.`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`فاتورتا مورّد معلّقتان بعد المطابقة الثلاثية: ${i?.list}.`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} فواتير موردين معلّقة بعد المطابقة الثلاثية: ${i?.list}.`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} فاتورة موردين معلّقة بعد المطابقة الثلاثية: ${i?.list}.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} فاتورة موردين معلّقة بعد المطابقة الثلاثية: ${i?.list}.`)
};

export const api_assistant_briefing_subject = /** @type {(inputs: Api_Assistant_Briefing_SubjectInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`ملخص من ${i?.count} سجلًا حيًا`)
};

export const api_assistant_case_approval_pending = /** @type {(inputs: Api_Assistant_Case_Approval_PendingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`موافقة معلّقة: ${i?.titles}`)
};

export const api_assistant_case_deadline = /** @type {(inputs: Api_Assistant_Case_DeadlineInputs) => LocalizedString} */ (i) => {
	if (i?.hasEta === "yes") return /** @type {LocalizedString} */ (`موعد عرض السعر ${i?.day} ${i?.time} (${i?.when}) · ${i?.eta}`);
	return /** @type {LocalizedString} */ (`موعد عرض السعر ${i?.day} ${i?.time} (${i?.when})`)
};

export const api_assistant_case_gp = /** @type {(inputs: Api_Assistant_Case_GpInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`إجمالي الربح ${i?.actual} (${i?.actualMargin}) مقابل ${i?.expected} متوقع (${i?.expectedMargin})`)
};

export const api_assistant_case_invoice = /** @type {(inputs: Api_Assistant_Case_InvoiceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الفاتورة ${i?.number}: ${i?.status}، ${i?.amount} مستحق`)
};

export const api_assistant_case_lines = /** @type {(inputs: Api_Assistant_Case_LinesInputs) => LocalizedString} */ (i) => {
	if (i?.hasBlocked === "yes") return /** @type {LocalizedString} */ (`البنود: ${i?.ready} من ${i?.total} جاهزة، و${i?.blocked} متوقفة`);
	return /** @type {LocalizedString} */ (`البنود: ${i?.ready} من ${i?.total} جاهزة`)
};

export const api_assistant_case_margin = /** @type {(inputs: Api_Assistant_Case_MarginInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.caseId} (${i?.vessel}): إجمالي الربح الفعلي ${i?.actual} بهامش ${i?.actualMargin}، مقابل ${i?.expected} (${i?.expectedMargin}) متوقع عند عرض السعر.`)
};

export const api_assistant_case_next = /** @type {(inputs: Api_Assistant_Case_NextInputs) => LocalizedString} */ (i) => {
	if (i?.hasBlocker === "yes") return /** @type {LocalizedString} */ (`التالي: ${i?.next} · العائق: ${i?.blocker}`);
	return /** @type {LocalizedString} */ (`التالي: ${i?.next}`)
};

export const api_assistant_case_profit_and_close = /** @type {(inputs: Api_Assistant_Case_Profit_And_CloseInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الربح والإغلاق لـ${i?.caseId}`)
};

export const api_assistant_case_stage = /** @type {(inputs: Api_Assistant_Case_StageInputs) => LocalizedString} */ (i) => {
	if (i?.hasWait === "yes") return /** @type {LocalizedString} */ (`المرحلة: ${i?.stage} (${i?.wait}) · المسؤول ${i?.owner}`);
	return /** @type {LocalizedString} */ (`المرحلة: ${i?.stage} · المسؤول ${i?.owner}`)
};

export const api_assistant_case_waiting_on = /** @type {(inputs: Api_Assistant_Case_Waiting_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`بانتظار ${i?.suppliers} (${i?.statuses})`)
};

export const api_assistant_cases_need_attention = /** @type {(inputs: Api_Assistant_Cases_Need_AttentionInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`ملف نشط واحد يحتاج إلى متابعة.`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`ملفان نشطان يحتاجان إلى متابعة.`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} ملفات نشطة تحتاج إلى متابعة.`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} ملفًا نشطًا يحتاج إلى متابعة.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} ملف نشط يحتاج إلى متابعة.`)
};

export const api_assistant_collections = /** @type {(inputs: Api_Assistant_CollectionsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`التحصيلات: ${i?.totals} مستحقة على فاتورة واحدة.`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`التحصيلات: ${i?.totals} مستحقة على فاتورتين.`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`التحصيلات: ${i?.totals} مستحقة على ${__paraglideRegistry.icuPound("ar", i?.count, {})} فواتير.`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`التحصيلات: ${i?.totals} مستحقة على ${__paraglideRegistry.icuPound("ar", i?.count, {})} فاتورة.`);
	return /** @type {LocalizedString} */ (`التحصيلات: ${i?.totals} مستحقة على ${__paraglideRegistry.icuPound("ar", i?.count, {})} فاتورة.`)
};

export const api_assistant_commitment_blocked = /** @type {(inputs: Api_Assistant_Commitment_BlockedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الالتزام موقوف حتى يتطابق`)
};

export const api_assistant_control_room = /** @type {(inputs: Api_Assistant_Control_RoomInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`غرفة التحكم`)
};

export const api_assistant_customers_owe = /** @type {(inputs: Api_Assistant_Customers_OweInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	const overduePluralExact = i?.overdue;
	if (countPlural === "one" && (overduePluralExact === 0 || overduePluralExact === "0")) return /** @type {LocalizedString} */ (`العملاء مدينون بـ${i?.totals} على فاتورة مفتوحة واحدة.`);
	if (countPlural === "two" && (overduePluralExact === 0 || overduePluralExact === "0")) return /** @type {LocalizedString} */ (`العملاء مدينون بـ${i?.totals} على فاتورتين مفتوحتين.`);
	if (countPlural === "few" && (overduePluralExact === 0 || overduePluralExact === "0")) return /** @type {LocalizedString} */ (`العملاء مدينون بـ${i?.totals} على ${__paraglideRegistry.icuPound("ar", i?.count, {})} فواتير مفتوحة.`);
	if (countPlural === "many" && (overduePluralExact === 0 || overduePluralExact === "0")) return /** @type {LocalizedString} */ (`العملاء مدينون بـ${i?.totals} على ${__paraglideRegistry.icuPound("ar", i?.count, {})} فاتورة مفتوحة.`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`العملاء مدينون بـ${i?.totals} على فاتورة مفتوحة واحدة، منها ${i?.overdue} متأخرة.`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`العملاء مدينون بـ${i?.totals} على فاتورتين مفتوحتين، منها ${i?.overdue} متأخرة.`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`العملاء مدينون بـ${i?.totals} على ${__paraglideRegistry.icuPound("ar", i?.count, {})} فواتير مفتوحة، منها ${i?.overdue} متأخرة.`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`العملاء مدينون بـ${i?.totals} على ${__paraglideRegistry.icuPound("ar", i?.count, {})} فاتورة مفتوحة، منها ${i?.overdue} متأخرة.`);
	if ((overduePluralExact === 0 || overduePluralExact === "0")) return /** @type {LocalizedString} */ (`العملاء مدينون بـ${i?.totals} على ${__paraglideRegistry.icuPound("ar", i?.count, {})} فاتورة مفتوحة.`);
	return /** @type {LocalizedString} */ (`العملاء مدينون بـ${i?.totals} على ${__paraglideRegistry.icuPound("ar", i?.count, {})} فاتورة مفتوحة، منها ${i?.overdue} متأخرة.`)
};

export const api_assistant_deliveries_short = /** @type {(inputs: Api_Assistant_Deliveries_ShortInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`تسليم واحد من مورّد وصل ناقصًا: ${i?.list}. تبقى الفواتير معلّقة حتى تتطابق الكميات.`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`تسليمان من الموردين وصلا ناقصًا: ${i?.list}. تبقى الفواتير معلّقة حتى تتطابق الكميات.`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} تسليمات من الموردين وصلت ناقصًا: ${i?.list}. تبقى الفواتير معلّقة حتى تتطابق الكميات.`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} تسليمًا من الموردين وصل ناقصًا: ${i?.list}. تبقى الفواتير معلّقة حتى تتطابق الكميات.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} تسليم من الموردين وصل ناقصًا: ${i?.list}. تبقى الفواتير معلّقة حتى تتطابق الكميات.`)
};

export const api_assistant_due_this_week = /** @type {(inputs: Api_Assistant_Due_This_WeekInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مستحق هذا الأسبوع: ${i?.list}.`)
};

export const api_assistant_eta = /** @type {(inputs: Api_Assistant_EtaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الوصول المتوقع ${i?.port} ${i?.day}`)
};

export const api_assistant_exceptions = /** @type {(inputs: Api_Assistant_ExceptionsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`استثناء تكامل واحد يحتاج إلى مراجعة: ${i?.list}. إعادة المحاولة الآمنة متاحة.`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`استثناءا تكامل يحتاجان إلى مراجعة: ${i?.list}. إعادة المحاولة الآمنة متاحة.`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} استثناءات تكامل تحتاج إلى مراجعة: ${i?.list}. إعادة المحاولة الآمنة متاحة.`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} استثناءً تكامليًا يحتاج إلى مراجعة: ${i?.list}. إعادة المحاولة الآمنة متاحة.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} استثناء تكامل يحتاج إلى مراجعة: ${i?.list}. إعادة المحاولة الآمنة متاحة.`)
};

export const api_assistant_fx_moved = /** @type {(inputs: Api_Assistant_Fx_MovedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تغيّر سعر الدولار من ${i?.from} إلى ${i?.to} جنيه (${i?.change}). السعر الجديد ينتظر الموافقة، وتُراجع عروض الأسعار المفتوحة مقابل الحد الأدنى لهامش الربح 15% فور تفعيله.`)
};

export const api_assistant_fx_on_receipts = /** @type {(inputs: Api_Assistant_Fx_On_ReceiptsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`فروق العملة على التحصيلات: ${i?.amount}`)
};

export const api_assistant_fx_rates = /** @type {(inputs: Api_Assistant_Fx_RatesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أسعار الصرف`)
};

export const api_assistant_good_morning = /** @type {(inputs: Api_Assistant_Good_MorningInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`صباح الخير يا ${i?.name}.`)
};

export const api_assistant_good_morning_there = /** @type {(inputs: Api_Assistant_Good_Morning_ThereInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صباح الخير.`)
};

export const api_assistant_growth_board = /** @type {(inputs: Api_Assistant_Growth_BoardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لوحة النمو`)
};

export const api_assistant_help = /** @type {(inputs: Api_Assistant_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أجيب من كل ملف وعرض سعر وموافقة وفاتورة وسجل مورّد في المنصة. اسأل عن سفينة أو رقم ملف، أو الموافقات، أو من يدين لنا بالمال، أو الموردين، أو المواعيد، أو مسار النمو.`)
};

export const api_assistant_items_awaiting_approval = /** @type {(inputs: Api_Assistant_Items_Awaiting_ApprovalInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`بند واحد ينتظر الموافقة (${i?.types}).`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`بندان ينتظران الموافقة (${i?.types}).`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} بنود تنتظر الموافقة (${i?.types}).`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} بندًا ينتظر الموافقة (${i?.types}).`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} بند ينتظر الموافقة (${i?.types}).`)
};

export const api_assistant_late_item = /** @type {(inputs: Api_Assistant_Late_ItemInputs) => LocalizedString} */ (i) => {
	if (i?.extra === "claim") return /** @type {LocalizedString} */ (`${i?.supplier}، ${i?.po} البند ${i?.line}: استُلم ${i?.received} من ${i?.ordered} · ${i?.claim}`);
	if (i?.extra === "promised") return /** @type {LocalizedString} */ (`${i?.supplier}، ${i?.po} البند ${i?.line}: استُلم ${i?.received} من ${i?.ordered} · والباقي موعود في ${i?.promised}`);
	return /** @type {LocalizedString} */ (`${i?.supplier}، ${i?.po} البند ${i?.line}: استُلم ${i?.received} من ${i?.ordered}`)
};

export const api_assistant_least_reliable = /** @type {(inputs: Api_Assistant_Least_ReliableInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الأقل التزامًا: ${i?.name}، ${i?.onTime}% في الموعد، والرد خلال ${i?.hours} ساعة`)
};

export const api_assistant_lowest = /** @type {(inputs: Api_Assistant_LowestInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الأدنى: ${i?.list}.`)
};

export const api_assistant_margin_by_store = /** @type {(inputs: Api_Assistant_Margin_By_StoreInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`هامش الربح حسب الفئة، آخر 90 يومًا: ${i?.list} (الحد الأدنى 15%).`)
};

export const api_assistant_month_gp = /** @type {(inputs: Api_Assistant_Month_GpInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.month}: إجمالي الربح ${i?.expected} ألف جنيه متوقع عند عرض السعر، و${i?.actual} ألف جنيه فعلي حتى الآن، والفارق يضيق مع فوترة تكاليف نوفمبر.`)
};

export const api_assistant_more_due_later = /** @type {(inputs: Api_Assistant_More_Due_LaterInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`…و${i?.count} غيرها تستحق لاحقًا.`)
};

export const api_assistant_no_case_at_risk = /** @type {(inputs: Api_Assistant_No_Case_At_RiskInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد ملف نشط معرّض للخطر.`)
};

export const api_assistant_no_open_balance = /** @type {(inputs: Api_Assistant_No_Open_BalanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد فاتورة عميل برصيد مفتوح.`)
};

export const api_assistant_nothing_overdue = /** @type {(inputs: Api_Assistant_Nothing_OverdueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا شيء متأخر.`)
};

export const api_assistant_nothing_waiting_approval = /** @type {(inputs: Api_Assistant_Nothing_Waiting_ApprovalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا شيء ينتظر الموافقة.`)
};

export const api_assistant_november_gp = /** @type {(inputs: Api_Assistant_November_GpInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`إجمالي ربح نوفمبر: ${i?.expected} ألف جنيه متوقع عند عرض السعر، و${i?.actual} ألف جنيه فعلي حتى الآن مع فوترة التكاليف.`)
};

export const api_assistant_opportunity_item = /** @type {(inputs: Api_Assistant_Opportunity_ItemInputs) => LocalizedString} */ (i) => {
	if (i?.hasValue === "yes" && i?.next === "none") return /** @type {LocalizedString} */ (`${i?.name}: ${i?.stage}، ${i?.value} · لا توجد خطوة تالية مخططة`);
	if (i?.hasValue === "yes" && i?.next === "dated") return /** @type {LocalizedString} */ (`${i?.name}: ${i?.stage}، ${i?.value} · التالي: ${i?.step} (${i?.due})`);
	if (i?.hasValue === "yes") return /** @type {LocalizedString} */ (`${i?.name}: ${i?.stage}، ${i?.value} · التالي: ${i?.step}`);
	if (i?.next === "none") return /** @type {LocalizedString} */ (`${i?.name}: ${i?.stage} · لا توجد خطوة تالية مخططة`);
	if (i?.next === "dated") return /** @type {LocalizedString} */ (`${i?.name}: ${i?.stage} · التالي: ${i?.step} (${i?.due})`);
	return /** @type {LocalizedString} */ (`${i?.name}: ${i?.stage} · التالي: ${i?.step}`)
};

export const api_assistant_overdue = /** @type {(inputs: Api_Assistant_OverdueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`متأخر: ${i?.list}.`)
};

export const api_assistant_owe_item = /** @type {(inputs: Api_Assistant_Owe_ItemInputs) => LocalizedString} */ (i) => {
	if (i?.due === "overdue" && i?.hasPaid === "yes") return /** @type {LocalizedString} */ (`${i?.customer}: ${i?.amount} على ${i?.number}، متأخرة منذ ${i?.day} (استُلم ${i?.paid})`);
	if (i?.due === "due" && i?.hasPaid === "yes") return /** @type {LocalizedString} */ (`${i?.customer}: ${i?.amount} على ${i?.number}، تستحق في ${i?.day} (استُلم ${i?.paid})`);
	if (i?.due === "overdue") return /** @type {LocalizedString} */ (`${i?.customer}: ${i?.amount} على ${i?.number}، متأخرة منذ ${i?.day}`);
	if (i?.due === "due") return /** @type {LocalizedString} */ (`${i?.customer}: ${i?.amount} على ${i?.number}، تستحق في ${i?.day}`);
	if (i?.hasPaid === "yes") return /** @type {LocalizedString} */ (`${i?.customer}: ${i?.amount} على ${i?.number} (استُلم ${i?.paid})`);
	return /** @type {LocalizedString} */ (`${i?.customer}: ${i?.amount} على ${i?.number}`)
};

export const api_assistant_pipeline = /** @type {(inputs: Api_Assistant_PipelineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.open} فرص نمو مفتوحة، و${i?.inquiries} استفسارًا و${i?.won} صفقة رابحة في آخر 12 أسبوعًا (${i?.byCount}% بالعدد، و${i?.byValue}% بالقيمة هذا الشهر).`)
};

export const api_assistant_plan_next_step = /** @type {(inputs: Api_Assistant_Plan_Next_StepInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`خطط لخطوة تالية أو أغلق: ${i?.names}.`)
};

export const api_assistant_po = /** @type {(inputs: Api_Assistant_PoInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أمر الشراء ${i?.po}`)
};

export const api_assistant_po_mismatch = /** @type {(inputs: Api_Assistant_Po_MismatchInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أمر شراء العميل في ${i?.caseId} (${i?.vessel}) يختلف عن عرض السعر المعتمد: ${i?.blocker}.`)
};

export const api_assistant_profit_and_close = /** @type {(inputs: Api_Assistant_Profit_And_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الربح والإغلاق`)
};

export const api_assistant_quote_due_item = /** @type {(inputs: Api_Assistant_Quote_Due_ItemInputs) => LocalizedString} */ (i) => {
	if (i?.hasBlocker === "yes") return /** @type {LocalizedString} */ (`${i?.vessel} (${i?.caseId}) ${i?.when}، ${i?.blocker}`);
	return /** @type {LocalizedString} */ (`${i?.vessel} (${i?.caseId}) ${i?.when}`)
};

export const api_assistant_quotes_due = /** @type {(inputs: Api_Assistant_Quotes_DueInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`عرض سعر واحد يجب أن يُرسل قبل نهاية الغد: ${i?.list}.`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`عرضا سعر يجب أن يُرسلا قبل نهاية الغد: ${i?.list}.`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} عروض أسعار يجب أن تُرسل قبل نهاية الغد: ${i?.list}.`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} عرض سعر يجب أن يُرسل قبل نهاية الغد: ${i?.list}.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} عرض سعر يجب أن يُرسل قبل نهاية الغد: ${i?.list}.`)
};

export const api_assistant_receipt_po = /** @type {(inputs: Api_Assistant_Receipt_PoInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`استلام أمر الشراء ${i?.po}`)
};

export const api_assistant_refused = /** @type {(inputs: Api_Assistant_RefusedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يمكنني مشاركة التكاليف أو هوامش الربح أو الأرباح مع دور المبيعات.`)
};

export const api_assistant_refused_hint = /** @type {(inputs: Api_Assistant_Refused_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اسأل بدلًا من ذلك عن حالة ملف أو الموافقات أو المواعيد أو الموردين أو مسار النمو.`)
};

export const api_assistant_risky_item = /** @type {(inputs: Api_Assistant_Risky_ItemInputs) => LocalizedString} */ (i) => {
	if (i?.hasBlocker === "yes") return /** @type {LocalizedString} */ (`${i?.caseId} ${i?.vessel}: ${i?.stage}، الموعد ${i?.deadline} · ${i?.blocker}`);
	return /** @type {LocalizedString} */ (`${i?.caseId} ${i?.vessel}: ${i?.stage}، الموعد ${i?.deadline}`)
};

export const api_assistant_settled_margin = /** @type {(inputs: Api_Assistant_Settled_MarginInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.caseId}: ${i?.actual} فعلي مقابل ${i?.expected} متوقع، فقد زادت تكلفة البلنش بعد تغيّر موعد الوصول في وقت قصير.`)
};

export const api_assistant_short_item = /** @type {(inputs: Api_Assistant_Short_ItemInputs) => LocalizedString} */ (i) => {
	if (i?.hasPromise === "yes") return /** @type {LocalizedString} */ (`أمر الشراء ${i?.po} البند ${i?.line}، ${i?.received} من ${i?.ordered}، والباقي موعود في ${i?.promised}`);
	return /** @type {LocalizedString} */ (`أمر الشراء ${i?.po} البند ${i?.line}، ${i?.received} من ${i?.ordered}`)
};

export const api_assistant_silent_item = /** @type {(inputs: Api_Assistant_Silent_ItemInputs) => LocalizedString} */ (i) => {
	const remindersPlural = __paraglideRegistry.plural("ar", i?.reminders, {}, true);
	const remindersPluralExact = i?.reminders;
	if ((remindersPluralExact === 0 || remindersPluralExact === "0")) return /** @type {LocalizedString} */ (`${i?.supplier} على ${i?.reference}`);
	if (remindersPlural === "one") return /** @type {LocalizedString} */ (`${i?.supplier} على ${i?.reference} (أُرسل تذكير واحد)`);
	if (remindersPlural === "two") return /** @type {LocalizedString} */ (`${i?.supplier} على ${i?.reference} (أُرسل تذكيران)`);
	if (remindersPlural === "few") return /** @type {LocalizedString} */ (`${i?.supplier} على ${i?.reference} (أُرسلت ${__paraglideRegistry.icuPound("ar", i?.reminders, {})} تذكيرات)`);
	if (remindersPlural === "many") return /** @type {LocalizedString} */ (`${i?.supplier} على ${i?.reference} (أُرسل ${__paraglideRegistry.icuPound("ar", i?.reminders, {})} تذكيرًا)`);
	return /** @type {LocalizedString} */ (`${i?.supplier} على ${i?.reference} (أُرسل ${__paraglideRegistry.icuPound("ar", i?.reminders, {})} تذكير)`)
};

export const api_assistant_suggest_approvals = /** @type {(inputs: Api_Assistant_Suggest_ApprovalsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ما الذي ينتظر الموافقة؟`)
};

export const api_assistant_suggest_late_suppliers = /** @type {(inputs: Api_Assistant_Suggest_Late_SuppliersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أي الموردين متأخرون؟`)
};

export const api_assistant_suggest_margin = /** @type {(inputs: Api_Assistant_Suggest_MarginInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ما هامش الربح هذا الشهر؟`)
};

export const api_assistant_suggest_owes = /** @type {(inputs: Api_Assistant_Suggest_OwesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`من يدين لنا بالمال؟`)
};

export const api_assistant_suggest_pipeline = /** @type {(inputs: Api_Assistant_Suggest_PipelineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كيف حال مسار النمو؟`)
};

export const api_assistant_suggest_status = /** @type {(inputs: Api_Assistant_Suggest_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ما حالة Aurora Crest؟`)
};

export const api_assistant_summarised_again = /** @type {(inputs: Api_Assistant_Summarised_AgainInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُعيد التلخيص في ${i?.at} من ${i?.count} سجلًا حيًا.`)
};

export const api_assistant_supplier_named = /** @type {(inputs: Api_Assistant_Supplier_NamedInputs) => LocalizedString} */ (i) => {
	if (i?.hasOnTime === "yes" && i?.isNew === "yes") return /** @type {LocalizedString} */ (`${i?.name}: يرد خلال ${i?.hours} ساعة في المتوسط، ${i?.onTime}% في الموعد، وهو مورّد جديد لم نطلب منه من قبل.`);
	if (i?.hasOnTime === "yes") return /** @type {LocalizedString} */ (`${i?.name}: يرد خلال ${i?.hours} ساعة في المتوسط، ${i?.onTime}% في الموعد.`);
	if (i?.isNew === "yes") return /** @type {LocalizedString} */ (`${i?.name}: يرد خلال ${i?.hours} ساعة في المتوسط، لا توجد تسليمات بعد، وهو مورّد جديد لم نطلب منه من قبل.`);
	return /** @type {LocalizedString} */ (`${i?.name}: يرد خلال ${i?.hours} ساعة في المتوسط، لا توجد تسليمات بعد.`)
};

export const api_assistant_suppliers_silent = /** @type {(inputs: Api_Assistant_Suppliers_SilentInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`مورّد واحد لم يرد في الموعد: ${i?.list}. التذكيرات تُرسل تلقائيًا، والتصعيد يذهب إلى مسؤول الملف.`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`مورّدان لم يردا في الموعد: ${i?.list}. التذكيرات تُرسل تلقائيًا، والتصعيد يذهب إلى مسؤول الملف.`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} موردين لم يردوا في الموعد: ${i?.list}. التذكيرات تُرسل تلقائيًا، والتصعيد يذهب إلى مسؤول الملف.`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} مورّدًا لم يردوا في الموعد: ${i?.list}. التذكيرات تُرسل تلقائيًا، والتصعيد يذهب إلى مسؤول الملف.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} مورّد لم يردوا في الموعد: ${i?.list}. التذكيرات تُرسل تلقائيًا، والتصعيد يذهب إلى مسؤول الملف.`)
};

export const api_assistant_suppliers_summary = /** @type {(inputs: Api_Assistant_Suppliers_SummaryInputs) => LocalizedString} */ (i) => {
	const latePlural = __paraglideRegistry.plural("ar", i?.late, {}, true);
	const waitingPlural = __paraglideRegistry.plural("ar", i?.waiting, {}, true);
	if (latePlural === "zero" && waitingPlural === "zero") return /** @type {LocalizedString} */ (`لا توجد تسليمات متأخرة أو ناقصة، ولا توجد طلبات عروض أسعار تنتظر ردًا من الموردين.`);
	if (latePlural === "one" && waitingPlural === "zero") return /** @type {LocalizedString} */ (`تسليم واحد متأخر أو ناقص، ولا توجد طلبات عروض أسعار تنتظر ردًا من الموردين.`);
	if (latePlural === "two" && waitingPlural === "zero") return /** @type {LocalizedString} */ (`تسليمان متأخران أو ناقصان، ولا توجد طلبات عروض أسعار تنتظر ردًا من الموردين.`);
	if (latePlural === "few" && waitingPlural === "zero") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.late, {})} تسليمات متأخرة أو ناقصة، ولا توجد طلبات عروض أسعار تنتظر ردًا من الموردين.`);
	if (latePlural === "many" && waitingPlural === "zero") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.late, {})} تسليمًا متأخرًا أو ناقصًا، ولا توجد طلبات عروض أسعار تنتظر ردًا من الموردين.`);
	if (latePlural === "zero" && waitingPlural === "one") return /** @type {LocalizedString} */ (`لا توجد تسليمات متأخرة أو ناقصة، وطلب عرض أسعار واحد ينتظر ردًا من الموردين.`);
	if (latePlural === "one" && waitingPlural === "one") return /** @type {LocalizedString} */ (`تسليم واحد متأخر أو ناقص، وطلب عرض أسعار واحد ينتظر ردًا من الموردين.`);
	if (latePlural === "two" && waitingPlural === "one") return /** @type {LocalizedString} */ (`تسليمان متأخران أو ناقصان، وطلب عرض أسعار واحد ينتظر ردًا من الموردين.`);
	if (latePlural === "few" && waitingPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.late, {})} تسليمات متأخرة أو ناقصة، وطلب عرض أسعار واحد ينتظر ردًا من الموردين.`);
	if (latePlural === "many" && waitingPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.late, {})} تسليمًا متأخرًا أو ناقصًا، وطلب عرض أسعار واحد ينتظر ردًا من الموردين.`);
	if (latePlural === "zero" && waitingPlural === "two") return /** @type {LocalizedString} */ (`لا توجد تسليمات متأخرة أو ناقصة، وطلبا عرض أسعار ينتظران ردًا من الموردين.`);
	if (latePlural === "one" && waitingPlural === "two") return /** @type {LocalizedString} */ (`تسليم واحد متأخر أو ناقص، وطلبا عرض أسعار ينتظران ردًا من الموردين.`);
	if (latePlural === "two" && waitingPlural === "two") return /** @type {LocalizedString} */ (`تسليمان متأخران أو ناقصان، وطلبا عرض أسعار ينتظران ردًا من الموردين.`);
	if (latePlural === "few" && waitingPlural === "two") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.late, {})} تسليمات متأخرة أو ناقصة، وطلبا عرض أسعار ينتظران ردًا من الموردين.`);
	if (latePlural === "many" && waitingPlural === "two") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.late, {})} تسليمًا متأخرًا أو ناقصًا، وطلبا عرض أسعار ينتظران ردًا من الموردين.`);
	if (latePlural === "zero" && waitingPlural === "few") return /** @type {LocalizedString} */ (`لا توجد تسليمات متأخرة أو ناقصة، و${__paraglideRegistry.icuPound("ar", i?.waiting, {})} طلبات عروض أسعار تنتظر ردًا من الموردين.`);
	if (latePlural === "one" && waitingPlural === "few") return /** @type {LocalizedString} */ (`تسليم واحد متأخر أو ناقص، و${__paraglideRegistry.icuPound("ar", i?.waiting, {})} طلبات عروض أسعار تنتظر ردًا من الموردين.`);
	if (latePlural === "two" && waitingPlural === "few") return /** @type {LocalizedString} */ (`تسليمان متأخران أو ناقصان، و${__paraglideRegistry.icuPound("ar", i?.waiting, {})} طلبات عروض أسعار تنتظر ردًا من الموردين.`);
	if (latePlural === "few" && waitingPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.late, {})} تسليمات متأخرة أو ناقصة، و${__paraglideRegistry.icuPound("ar", i?.waiting, {})} طلبات عروض أسعار تنتظر ردًا من الموردين.`);
	if (latePlural === "many" && waitingPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.late, {})} تسليمًا متأخرًا أو ناقصًا، و${__paraglideRegistry.icuPound("ar", i?.waiting, {})} طلبات عروض أسعار تنتظر ردًا من الموردين.`);
	if (latePlural === "zero" && waitingPlural === "many") return /** @type {LocalizedString} */ (`لا توجد تسليمات متأخرة أو ناقصة، و${__paraglideRegistry.icuPound("ar", i?.waiting, {})} طلبًا لعروض الأسعار ينتظر ردًا من الموردين.`);
	if (latePlural === "one" && waitingPlural === "many") return /** @type {LocalizedString} */ (`تسليم واحد متأخر أو ناقص، و${__paraglideRegistry.icuPound("ar", i?.waiting, {})} طلبًا لعروض الأسعار ينتظر ردًا من الموردين.`);
	if (latePlural === "two" && waitingPlural === "many") return /** @type {LocalizedString} */ (`تسليمان متأخران أو ناقصان، و${__paraglideRegistry.icuPound("ar", i?.waiting, {})} طلبًا لعروض الأسعار ينتظر ردًا من الموردين.`);
	if (latePlural === "few" && waitingPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.late, {})} تسليمات متأخرة أو ناقصة، و${__paraglideRegistry.icuPound("ar", i?.waiting, {})} طلبًا لعروض الأسعار ينتظر ردًا من الموردين.`);
	if (latePlural === "many" && waitingPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.late, {})} تسليمًا متأخرًا أو ناقصًا، و${__paraglideRegistry.icuPound("ar", i?.waiting, {})} طلبًا لعروض الأسعار ينتظر ردًا من الموردين.`);
	if (latePlural === "zero") return /** @type {LocalizedString} */ (`لا توجد تسليمات متأخرة أو ناقصة، و${__paraglideRegistry.icuPound("ar", i?.waiting, {})} طلب عرض أسعار ينتظر ردًا من الموردين.`);
	if (latePlural === "one") return /** @type {LocalizedString} */ (`تسليم واحد متأخر أو ناقص، و${__paraglideRegistry.icuPound("ar", i?.waiting, {})} طلب عرض أسعار ينتظر ردًا من الموردين.`);
	if (latePlural === "two") return /** @type {LocalizedString} */ (`تسليمان متأخران أو ناقصان، و${__paraglideRegistry.icuPound("ar", i?.waiting, {})} طلب عرض أسعار ينتظر ردًا من الموردين.`);
	if (latePlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.late, {})} تسليمات متأخرة أو ناقصة، و${__paraglideRegistry.icuPound("ar", i?.waiting, {})} طلب عرض أسعار ينتظر ردًا من الموردين.`);
	if (latePlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.late, {})} تسليمًا متأخرًا أو ناقصًا، و${__paraglideRegistry.icuPound("ar", i?.waiting, {})} طلب عرض أسعار ينتظر ردًا من الموردين.`);
	if (waitingPlural === "zero") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.late, {})} تسليم متأخر أو ناقص، ولا توجد طلبات عروض أسعار تنتظر ردًا من الموردين.`);
	if (waitingPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.late, {})} تسليم متأخر أو ناقص، وطلب عرض أسعار واحد ينتظر ردًا من الموردين.`);
	if (waitingPlural === "two") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.late, {})} تسليم متأخر أو ناقص، وطلبا عرض أسعار ينتظران ردًا من الموردين.`);
	if (waitingPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.late, {})} تسليم متأخر أو ناقص، و${__paraglideRegistry.icuPound("ar", i?.waiting, {})} طلبات عروض أسعار تنتظر ردًا من الموردين.`);
	if (waitingPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.late, {})} تسليم متأخر أو ناقص، و${__paraglideRegistry.icuPound("ar", i?.waiting, {})} طلبًا لعروض الأسعار ينتظر ردًا من الموردين.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.late, {})} تسليم متأخر أو ناقص، و${__paraglideRegistry.icuPound("ar", i?.waiting, {})} طلب عرض أسعار ينتظر ردًا من الموردين.`)
};

export const api_assistant_waiting_item = /** @type {(inputs: Api_Assistant_Waiting_ItemInputs) => LocalizedString} */ (i) => {
	const remindersPlural = __paraglideRegistry.plural("ar", i?.reminders, {}, true);
	const remindersPluralExact = i?.reminders;
	if (i?.hasDue === "yes" && (remindersPluralExact === 0 || remindersPluralExact === "0")) return /** @type {LocalizedString} */ (`${i?.supplier}: ${i?.reference} ${i?.status}، الموعد ${i?.due}`);
	if (i?.hasDue === "yes" && remindersPlural === "one") return /** @type {LocalizedString} */ (`${i?.supplier}: ${i?.reference} ${i?.status}، الموعد ${i?.due} (تذكير واحد)`);
	if (i?.hasDue === "yes" && remindersPlural === "two") return /** @type {LocalizedString} */ (`${i?.supplier}: ${i?.reference} ${i?.status}، الموعد ${i?.due} (تذكيران)`);
	if (i?.hasDue === "yes" && remindersPlural === "few") return /** @type {LocalizedString} */ (`${i?.supplier}: ${i?.reference} ${i?.status}، الموعد ${i?.due} (${__paraglideRegistry.icuPound("ar", i?.reminders, {})} تذكيرات)`);
	if (i?.hasDue === "yes" && remindersPlural === "many") return /** @type {LocalizedString} */ (`${i?.supplier}: ${i?.reference} ${i?.status}، الموعد ${i?.due} (${__paraglideRegistry.icuPound("ar", i?.reminders, {})} تذكيرًا)`);
	if (i?.hasDue === "yes") return /** @type {LocalizedString} */ (`${i?.supplier}: ${i?.reference} ${i?.status}، الموعد ${i?.due} (${__paraglideRegistry.icuPound("ar", i?.reminders, {})} تذكير)`);
	if ((remindersPluralExact === 0 || remindersPluralExact === "0")) return /** @type {LocalizedString} */ (`${i?.supplier}: ${i?.reference} ${i?.status}`);
	if (remindersPlural === "one") return /** @type {LocalizedString} */ (`${i?.supplier}: ${i?.reference} ${i?.status} (تذكير واحد)`);
	if (remindersPlural === "two") return /** @type {LocalizedString} */ (`${i?.supplier}: ${i?.reference} ${i?.status} (تذكيران)`);
	if (remindersPlural === "few") return /** @type {LocalizedString} */ (`${i?.supplier}: ${i?.reference} ${i?.status} (${__paraglideRegistry.icuPound("ar", i?.reminders, {})} تذكيرات)`);
	if (remindersPlural === "many") return /** @type {LocalizedString} */ (`${i?.supplier}: ${i?.reference} ${i?.status} (${__paraglideRegistry.icuPound("ar", i?.reminders, {})} تذكيرًا)`);
	return /** @type {LocalizedString} */ (`${i?.supplier}: ${i?.reference} ${i?.status} (${__paraglideRegistry.icuPound("ar", i?.reminders, {})} تذكير)`)
};

export const api_assistant_we_owe = /** @type {(inputs: Api_Assistant_We_OweInputs) => LocalizedString} */ (i) => {
	if (i?.hasReason === "yes") return /** @type {LocalizedString} */ (`ندين لـ${i?.supplier} بـ${i?.amount} على الفاتورة ${i?.bill} (${i?.status}: ${i?.reason})`);
	return /** @type {LocalizedString} */ (`ندين لـ${i?.supplier} بـ${i?.amount} على الفاتورة ${i?.bill} (${i?.status})`)
};

export const api_cash_account_owner = /** @type {(inputs: Api_Cash_Account_OwnerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسؤول الحساب`)
};

export const api_cash_allocated_balance = /** @type {(inputs: Api_Cash_Allocated_BalanceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم تخصيص ${i?.amount} للفاتورة ${i?.number}، والمتبقي ${i?.balance}.`)
};

export const api_cash_allocated_paid = /** @type {(inputs: Api_Cash_Allocated_PaidInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم تخصيص ${i?.amount} للفاتورة ${i?.number}، وسُدّدت بالكامل.`)
};

export const api_cash_approval_in_progress = /** @type {(inputs: Api_Cash_Approval_In_ProgressInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`توجد موافقة قيد التنفيذ بالفعل لهذا المستحق.`)
};

export const api_cash_approval_not_found = /** @type {(inputs: Api_Cash_Approval_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على الموافقة.`)
};

export const api_cash_approve_payment_title = /** @type {(inputs: Api_Cash_Approve_Payment_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`وافق على الدفع إلى ${i?.supplier}`)
};

export const api_cash_bank_change_not_found = /** @type {(inputs: Api_Cash_Bank_Change_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على طلب تغيير البيانات البنكية.`)
};

export const api_cash_bill_on_hold = /** @type {(inputs: Api_Cash_Bill_On_HoldInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`فاتورة المورّد الخاصة بـ ${i?.number} معلّقة. ارفع التعليق قبل طلب موافقة الدفع.`)
};

export const api_cash_call_back_done = /** @type {(inputs: Api_Cash_Call_Back_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم الاتصال بالرقم المسجّل لدينا. ${i?.note}`)
};

export const api_cash_call_back_first = /** @type {(inputs: Api_Cash_Call_Back_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اتصل أولًا بالرقم المسجّل لدينا وحدّد خانة التأكيد.`)
};

export const api_cash_cant_decide = /** @type {(inputs: Api_Cash_Cant_DecideInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يمكنك اتخاذ قرار في هذه الموافقة.`)
};

export const api_cash_collect_goal = /** @type {(inputs: Api_Cash_Collect_GoalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تحصيل ${i?.amount} على ${i?.number}`)
};

export const api_cash_enter_amount = /** @type {(inputs: Api_Cash_Enter_AmountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أدخل المبلغ المستلم.`)
};

export const api_cash_finance_applies_bank = /** @type {(inputs: Api_Cash_Finance_Applies_BankInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإدارة والمالية فقط تطبّقان البيانات البنكية.`)
};

export const api_cash_finance_records_payments = /** @type {(inputs: Api_Cash_Finance_Records_PaymentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإدارة والمالية فقط تسجّلان الدفعات.`)
};

export const api_cash_finance_requests_approvals = /** @type {(inputs: Api_Cash_Finance_Requests_ApprovalsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإدارة والمالية فقط تطلبان موافقات الدفع.`)
};

export const api_cash_give_bank_reference = /** @type {(inputs: Api_Cash_Give_Bank_ReferenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أدخل المرجع البنكي.`)
};

export const api_cash_give_reject_reason = /** @type {(inputs: Api_Cash_Give_Reject_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اذكر سبب الرفض.`)
};

export const api_cash_invoice_not_found = /** @type {(inputs: Api_Cash_Invoice_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على الفاتورة.`)
};

export const api_cash_list_separator = /** @type {(inputs: Api_Cash_List_SeparatorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`؛ `)
};

export const api_cash_match_item = /** @type {(inputs: Api_Cash_Match_ItemInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} (${i?.customer}، ${i?.amount} مستحق)`)
};

export const api_cash_match_message = /** @type {(inputs: Api_Cash_Match_MessageInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`يبدو أنه يسدّد هذه الفاتورة: ${i?.list}. يسجّل شخص الدفعة.`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`يبدو أنه يسدّد هاتين الفاتورتين: ${i?.list}. يسجّل شخص الدفعة.`);
	return /** @type {LocalizedString} */ (`يبدو أنه يسدّد هذه الفواتير الـ${i?.count}: ${i?.list}. يسجّل شخص الدفعة.`)
};

export const api_cash_more_than_balance = /** @type {(inputs: Api_Cash_More_Than_BalanceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`هذه الدفعة أكبر من الرصيد المفتوح البالغ ${i?.balance} على ${i?.number}. سجّل مبلغًا لا يزيد على الرصيد المفتوح.`)
};

export const api_cash_no_remittance_match = /** @type {(inputs: Api_Cash_No_Remittance_MatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد فاتورة مفتوحة تطابق هذه الأرقام أو هذا المبلغ، راجع إشعار التحويل يدويًا.`)
};

export const api_cash_pay_detail = /** @type {(inputs: Api_Cash_Pay_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أمر الشراء ${i?.number} · الاستحقاق ${i?.due} · البيانات البنكية دون تغيير.`)
};

export const api_cash_pay_detail_matched = /** @type {(inputs: Api_Cash_Pay_Detail_MatchedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أمر الشراء ${i?.number} · الفاتورة ${i?.bill} مطابقة (أمر الشراء = الاستلام = الفاتورة) · الاستحقاق ${i?.due} · البيانات البنكية دون تغيير.`)
};

export const api_cash_pay_title = /** @type {(inputs: Api_Cash_Pay_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`دفع ${i?.amount} إلى ${i?.supplier} مقابل ${i?.number}`)
};

export const api_cash_payable_not_found = /** @type {(inputs: Api_Cash_Payable_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على المستحق.`)
};

export const api_cash_payables_hidden_from_sales = /** @type {(inputs: Api_Cash_Payables_Hidden_From_SalesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مستحقات الموردين وموافقات الدفع والبيانات البنكية غير متاحة لفريق المبيعات.`)
};

export const api_cash_payment_not_approved = /** @type {(inputs: Api_Cash_Payment_Not_ApprovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم تتم الموافقة على الدفعة بعد.`)
};

export const api_cash_reminder_sent_note = /** @type {(inputs: Api_Cash_Reminder_Sent_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`راجعه شخص وأرسله.`)
};

export const api_cash_two_approvers_first = /** @type {(inputs: Api_Cash_Two_Approvers_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يجب أن يوافق شخصان مختلفان أولًا.`)
};

export const api_commercial_accepted_activity = /** @type {(inputs: Api_Commercial_Accepted_ActivityInputs) => LocalizedString} */ (i) => {
	if (i?.hasNote === "yes") return /** @type {LocalizedString} */ (`البند ${i?.line}: قبل العميل العبوة البديلة كتابيًا (${i?.note}).`);
	return /** @type {LocalizedString} */ (`البند ${i?.line}: قبل العميل العبوة البديلة كتابيًا.`)
};

export const api_commercial_advance_payment = /** @type {(inputs: Api_Commercial_Advance_PaymentInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مخاطر دفعة مقدمة: ${i?.supplier}`)
};

export const api_commercial_agency_flag = /** @type {(inputs: Api_Commercial_Agency_FlagInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قائمة أسعار الوكالة: تسعير فوري دون طلب عرض أسعار من مورّد`)
};

export const api_commercial_agency_terms = /** @type {(inputs: Api_Commercial_Agency_TermsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`شروط الوكالة`)
};

export const api_commercial_already_awaiting = /** @type {(inputs: Api_Commercial_Already_AwaitingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} ينتظر الموافقة بالفعل.`)
};

export const api_commercial_already_cant_withdraw = /** @type {(inputs: Api_Commercial_Already_Cant_WithdrawInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} أصبح بالفعل في حالة ${i?.status}، ولا يمكن سحب القرار.`)
};

export const api_commercial_alternative_accepted = /** @type {(inputs: Api_Commercial_Alternative_AcceptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قبل العميل العبوة البديلة كتابيًا`)
};

export const api_commercial_alternative_pack = /** @type {(inputs: Api_Commercial_Alternative_PackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عبوة بديلة`)
};

export const api_commercial_alternatives_allowed = /** @type {(inputs: Api_Commercial_Alternatives_AllowedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`البدائل مسموحة`)
};

export const api_commercial_approval_not_found = /** @type {(inputs: Api_Commercial_Approval_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على الموافقة.`)
};

export const api_commercial_approval_recorded = /** @type {(inputs: Api_Commercial_Approval_RecordedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم تسجيل موافقتك، ${i?.progress}.`)
};

export const api_commercial_approval_title = /** @type {(inputs: Api_Commercial_Approval_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`عرض السعر ${i?.number} إلى ${i?.customer}، ${i?.total}`)
};

export const api_commercial_approved_dot = /** @type {(inputs: Api_Commercial_Approved_DotInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تمت الموافقة.`)
};

export const api_commercial_approved_title = /** @type {(inputs: Api_Commercial_Approved_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تمت الموافقة: ${i?.title}`)
};

export const api_commercial_bank_applied_cant_withdraw = /** @type {(inputs: Api_Commercial_Bank_Applied_Cant_WithdrawInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`البيانات البنكية الجديدة مطبّقة بالفعل، ولا يمكن سحب القرار.`)
};

export const api_commercial_below_min = /** @type {(inputs: Api_Commercial_Below_MinInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أقل من الحد الأدنى لهامش الربح ${i?.min}%، ويلزم استثناء بموافقة`)
};

export const api_commercial_best_fit_reason = /** @type {(inputs: Api_Commercial_Best_Fit_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العرض الأنسب (التكلفة حتى الموقع)`)
};

export const api_commercial_best_regards = /** @type {(inputs: Api_Commercial_Best_RegardsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مع خالص التحية،`)
};

export const api_commercial_case_not_found = /** @type {(inputs: Api_Commercial_Case_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على الملف.`)
};

export const api_commercial_charge_estimate = /** @type {(inputs: Api_Commercial_Charge_EstimateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`رسم مشترك تقديري: ${i?.label} (${i?.amount})`)
};

export const api_commercial_check_po = /** @type {(inputs: Api_Commercial_Check_PoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طابق أمر شراء العميل مع عرض السعر`)
};

export const api_commercial_check_po_partial = /** @type {(inputs: Api_Commercial_Check_Po_PartialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طابق أمر شراء العميل مع عرض السعر (ترسية جزئية)`)
};

export const api_commercial_choose_offer = /** @type {(inputs: Api_Commercial_Choose_OfferInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختر عرضًا واحدًا على الأقل.`)
};

export const api_commercial_closed_expired = /** @type {(inputs: Api_Commercial_Closed_ExpiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مغلق، منتهي الصلاحية`)
};

export const api_commercial_closed_lost = /** @type {(inputs: Api_Commercial_Closed_LostInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مغلق، خاسر`)
};

export const api_commercial_converted_fx = /** @type {(inputs: Api_Commercial_Converted_FxInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`محوّل بسعر الصرف المعتمد ${i?.currency}/EGP ${i?.rate}`)
};

export const api_commercial_corrected_version = /** @type {(inputs: Api_Commercial_Corrected_VersionInputs) => LocalizedString} */ (i) => {
	if (i?.hasWas === "yes") return /** @type {LocalizedString} */ (`نسخة مصحّحة v${i?.version}: تحل محل v${i?.replaces} (${i?.was})`);
	return /** @type {LocalizedString} */ (`نسخة مصحّحة v${i?.version}: تحل محل v${i?.replaces}`)
};

export const api_commercial_correction_asked = /** @type {(inputs: Api_Commercial_Correction_AskedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`شكرًا على عرضكم. في البند ${i?.line} طلبنا ${i?.part} (القطعة نفسها تمامًا، دون بدائل).`)
};

export const api_commercial_correction_please = /** @type {(inputs: Api_Commercial_Correction_PleaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يُرجى إرسال عرض مصحّح للقطعة المطلوبة، مع السعر والتوافر ومدة التوريد إلى بورسعيد.`)
};

export const api_commercial_correction_sent_activity = /** @type {(inputs: Api_Commercial_Correction_Sent_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُرسل طلب تصحيح إلى ${i?.supplier} للبند ${i?.line} (أكّده ${i?.name}).`)
};

export const api_commercial_correction_sent_status = /** @type {(inputs: Api_Commercial_Correction_Sent_StatusInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُرسل في 16 نوفمبر · استُلمت النسخة المصحّحة v${i?.version} وهي مستخدمة`)
};

export const api_commercial_correction_subject = /** @type {(inputs: Api_Commercial_Correction_SubjectInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.rfq}، البند ${i?.line}: يُرجى تصحيح عرضكم`)
};

export const api_commercial_customer_decision = /** @type {(inputs: Api_Commercial_Customer_DecisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قرار العميل`)
};

export const api_commercial_days_short = /** @type {(inputs: Api_Commercial_Days_ShortInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} يوم`)
};

export const api_commercial_dear = /** @type {(inputs: Api_Commercial_DearInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`السيد/السيدة ${i?.name}،`)
};

export const api_commercial_dear_colleagues = /** @type {(inputs: Api_Commercial_Dear_ColleaguesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الزملاء الأعزاء،`)
};

export const api_commercial_decided_activity = /** @type {(inputs: Api_Commercial_Decided_ActivityInputs) => LocalizedString} */ (i) => {
	if (i?.approved === "yes" && i?.hasReason === "yes") return /** @type {LocalizedString} */ (`وافق ${i?.name} على «${i?.title}»: ${i?.reason}.`);
	if (i?.approved === "yes") return /** @type {LocalizedString} */ (`وافق ${i?.name} على «${i?.title}».`);
	if (i?.hasReason === "yes") return /** @type {LocalizedString} */ (`أرجع ${i?.name} على «${i?.title}»: ${i?.reason}.`);
	return /** @type {LocalizedString} */ (`أرجع ${i?.name} على «${i?.title}».`)
};

export const api_commercial_decision_activity = /** @type {(inputs: Api_Commercial_Decision_ActivityInputs) => LocalizedString} */ (i) => {
	if (i?.hasNote === "yes") return /** @type {LocalizedString} */ (`قرار العميل على ${i?.number}: ${i?.decision} (${i?.note}).`);
	return /** @type {LocalizedString} */ (`قرار العميل على ${i?.number}: ${i?.decision}.`)
};

export const api_commercial_decision_must_be = /** @type {(inputs: Api_Commercial_Decision_Must_BeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يجب أن يكون القرار موافقة أو رفضًا.`)
};

export const api_commercial_decision_on_received = /** @type {(inputs: Api_Commercial_Decision_On_ReceivedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سجّل قرار العميل على النسخة التي استلمها.`)
};

export const api_commercial_decision_withdrawn = /** @type {(inputs: Api_Commercial_Decision_WithdrawnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم سحب القرار، و${i?.title} ينتظر من جديد`)
};

export const api_commercial_delivered_as_quoted = /** @type {(inputs: Api_Commercial_Delivered_As_QuotedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسليم حتى الموقع (كما في العرض)`)
};

export const api_commercial_delivery_terms_default = /** @type {(inputs: Api_Commercial_Delivery_Terms_DefaultInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`على متن السفينة في ${i?.port} عند الوصول`)
};

export const api_commercial_deviation = /** @type {(inputs: Api_Commercial_DeviationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`انحراف`)
};

export const api_commercial_different_item = /** @type {(inputs: Api_Commercial_Different_ItemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صنف مختلف`)
};

export const api_commercial_discount_above = /** @type {(inputs: Api_Commercial_Discount_AboveInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`خصم العميل ${i?.discount}% أعلى من ${i?.max}% دون موافقة`)
};

export const api_commercial_draft_not_sent = /** @type {(inputs: Api_Commercial_Draft_Not_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسودة، لم تُرسل`)
};

export const api_commercial_due_day = /** @type {(inputs: Api_Commercial_Due_DayInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مستحق ${i?.day}`)
};

export const api_commercial_emailed_activity = /** @type {(inputs: Api_Commercial_Emailed_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُرسل ${i?.number} بالبريد إلى ${i?.to}، وأكّد ${i?.name} المسودة.`)
};

export const api_commercial_exact_only = /** @type {(inputs: Api_Commercial_Exact_OnlyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.part} فقط`)
};

export const api_commercial_expired_validity = /** @type {(inputs: Api_Commercial_Expired_ValidityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`انتهت الصلاحية: انتهى العرض في ${i?.day}، يُرجى إعادة التأكيد`)
};

export const api_commercial_field_currency = /** @type {(inputs: Api_Commercial_Field_CurrencyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العملة`)
};

export const api_commercial_field_line_count = /** @type {(inputs: Api_Commercial_Field_Line_CountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عدد البنود`)
};

export const api_commercial_field_payment_terms = /** @type {(inputs: Api_Commercial_Field_Payment_TermsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`شروط الدفع`)
};

export const api_commercial_field_quotation_no = /** @type {(inputs: Api_Commercial_Field_Quotation_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`رقم عرض السعر`)
};

export const api_commercial_field_total = /** @type {(inputs: Api_Commercial_Field_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإجمالي (دون ضريبة القيمة المضافة)`)
};

export const api_commercial_field_validity = /** @type {(inputs: Api_Commercial_Field_ValidityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الصلاحية`)
};

export const api_commercial_follow_up_2_days = /** @type {(inputs: Api_Commercial_Follow_Up_2_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تابع ${i?.number} بعد يومين (تذكير داخلي)`)
};

export const api_commercial_freight_as_quoted = /** @type {(inputs: Api_Commercial_Freight_As_QuotedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الشحن كما في العرض`)
};

export const api_commercial_fx_decision_stands = /** @type {(inputs: Api_Commercial_Fx_Decision_StandsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قرار سعر الصرف يسري فورًا، فاقترح سعرًا جديدًا بدلًا من ذلك.`)
};

export const api_commercial_fx_label = /** @type {(inputs: Api_Commercial_Fx_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أسعار الصرف المعتمدة · USD/EGP ${i?.usd} · EUR/EGP ${i?.eur}`)
};

export const api_commercial_give_reason_not_best = /** @type {(inputs: Api_Commercial_Give_Reason_Not_BestInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اذكر سببًا: هذا ليس العرض الأنسب (يُحفظ للمعتمِد).`)
};

export const api_commercial_give_return_reason = /** @type {(inputs: Api_Commercial_Give_Return_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اذكر سببًا عند إرجاع الطلب.`)
};

export const api_commercial_gs_truck_lane = /** @type {(inputs: Api_Commercial_Gs_Truck_LaneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`شاحنة Golden Sea من ${i?.from} ← ${i?.port}`)
};

export const api_commercial_import_freight = /** @type {(inputs: Api_Commercial_Import_FreightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`شحن الاستيراد والرسوم والتخليص (تقديريًا 18%)`)
};

export const api_commercial_items_follow = /** @type {(inputs: Api_Commercial_Items_FollowInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`البنود ${i?.lines} من طلبكم ستُرسل لاحقًا في عرض سعر معدّل.`)
};

export const api_commercial_karim_approve = /** @type {(inputs: Api_Commercial_Karim_ApproveInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Karim Balbaa: الموافقة على ${i?.number}`)
};

export const api_commercial_lead_days = /** @type {(inputs: Api_Commercial_Lead_DaysInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`يوم واحد`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`يومان`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`${i?.n} أيام`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`${i?.n} يومًا`);
	return /** @type {LocalizedString} */ (`${i?.n} يوم`)
};

export const api_commercial_lead_time_misses = /** @type {(inputs: Api_Commercial_Lead_Time_MissesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مدة التوريد ${i?.days} يوم تتجاوز موعد وصول السفينة ${i?.eta}`)
};

export const api_commercial_lead_time_misses_eta = /** @type {(inputs: Api_Commercial_Lead_Time_Misses_EtaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مدة توريد المورّد تتجاوز موعد الوصول`)
};

export const api_commercial_line_not_found = /** @type {(inputs: Api_Commercial_Line_Not_FoundInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على البند ${i?.line}.`)
};

export const api_commercial_lines_excluded = /** @type {(inputs: Api_Commercial_Lines_ExcludedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`البنود ${i?.lines} مستبعدة، وتُرسل لاحقًا في عرض سعر معدّل`)
};

export const api_commercial_local_truck = /** @type {(inputs: Api_Commercial_Local_TruckInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`نقل محلي في ${i?.port}`)
};

export const api_commercial_missing_item_note = /** @type {(inputs: Api_Commercial_Missing_Item_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يسعّر المورّد هذا البند (رد جزئي)، وتمت صياغة متابعة`)
};

export const api_commercial_negative_profit = /** @type {(inputs: Api_Commercial_Negative_ProfitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ربح سالب أو صفري`)
};

export const api_commercial_new_supplier = /** @type {(inputs: Api_Commercial_New_SupplierInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مورّد جديد · لا سجل تسليمات · ${i?.terms}`)
};

export const api_commercial_no_approval_requested = /** @type {(inputs: Api_Commercial_No_Approval_RequestedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم تُطلب موافقة بعد.`)
};

export const api_commercial_no_decision_to_withdraw = /** @type {(inputs: Api_Commercial_No_Decision_To_WithdrawInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ليس لديك قرار على هذا الطلب لتسحبه.`)
};

export const api_commercial_no_delivery_history = /** @type {(inputs: Api_Commercial_No_Delivery_HistoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا سجل تسليمات`)
};

export const api_commercial_no_exceptions = /** @type {(inputs: Api_Commercial_No_ExceptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا استثناءات، موافقة اعتيادية.`)
};

export const api_commercial_no_quotation_named = /** @type {(inputs: Api_Commercial_No_Quotation_NamedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هذا الطلب لا يحدد عرض السعر الخاص به، ولا يمكن سحب القرار.`)
};

export const api_commercial_not_a_selection = /** @type {(inputs: Api_Commercial_Not_A_SelectionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`هذا ليس اختيارًا للبند ${i?.line}.`)
};

export const api_commercial_not_given = /** @type {(inputs: Api_Commercial_Not_GivenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يُذكر`)
};

export const api_commercial_nothing_to_request = /** @type {(inputs: Api_Commercial_Nothing_To_RequestInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} حالته ${i?.status}، ولا يوجد ما يُطلب.`)
};

export const api_commercial_offer_blocked = /** @type {(inputs: Api_Commercial_Offer_BlockedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} v${i?.version} ممنوع من التسعير: ${i?.reason}.`)
};

export const api_commercial_offer_not_found = /** @type {(inputs: Api_Commercial_Offer_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على العرض.`)
};

export const api_commercial_offer_not_on_line = /** @type {(inputs: Api_Commercial_Offer_Not_On_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`العرض ${i?.offer} ليس على البند ${i?.line}.`)
};

export const api_commercial_offers_only = /** @type {(inputs: Api_Commercial_Offers_OnlyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} يعرض ${i?.qty} ${i?.unit} فقط.`)
};

export const api_commercial_on_arrival = /** @type {(inputs: Api_Commercial_On_ArrivalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عند الوصول`)
};

export const api_commercial_on_hand = /** @type {(inputs: Api_Commercial_On_HandInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} متوفر · ${i?.place}`)
};

export const api_commercial_on_time = /** @type {(inputs: Api_Commercial_On_TimeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`في الموعد ${i?.pct}%`)
};

export const api_commercial_only_approved_sent = /** @type {(inputs: Api_Commercial_Only_Approved_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا تُرسل إلا نسخة معتمدة.`)
};

export const api_commercial_only_approved_to_customer = /** @type {(inputs: Api_Commercial_Only_Approved_To_CustomerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا تُرسل إلى العميل إلا نسخة معتمدة.`)
};

export const api_commercial_our_rfq = /** @type {(inputs: Api_Commercial_Our_RfqInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلب عرض الأسعار الخاص بنا`)
};

export const api_commercial_own_stock_flag = /** @type {(inputs: Api_Commercial_Own_Stock_FlagInputs) => LocalizedString} */ (i) => {
	if (i?.hasLot === "yes") return /** @type {LocalizedString} */ (`من مخزوننا (التشغيلة ${i?.lot})، احجز الآن، والنقل بشاحنة Golden Sea`);
	return /** @type {LocalizedString} */ (`من مخزوننا، احجز الآن، والنقل بشاحنة Golden Sea`)
};

export const api_commercial_own_stock_terms = /** @type {(inputs: Api_Commercial_Own_Stock_TermsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مخزوننا (بمتوسط التكلفة)`)
};

export const api_commercial_pack = /** @type {(inputs: Api_Commercial_PackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عبوة`)
};

export const api_commercial_pack_size = /** @type {(inputs: Api_Commercial_Pack_SizeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`حجم العبوة: ${i?.offered} بدلًا من ${i?.requested}، ويلزم قبول كتابي من العميل`)
};

export const api_commercial_payment_recorded_cant_withdraw = /** @type {(inputs: Api_Commercial_Payment_Recorded_Cant_WithdrawInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الدفعة مسجّلة بالفعل، ولا يمكن سحب القرار.`)
};

export const api_commercial_payment_terms_default = /** @type {(inputs: Api_Commercial_Payment_Terms_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`90 يومًا من تاريخ الفاتورة`)
};

export const api_commercial_pending_acceptance = /** @type {(inputs: Api_Commercial_Pending_AcceptanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظار قبول العميل، عبوة بديلة`)
};

export const api_commercial_portal_activity = /** @type {(inputs: Api_Commercial_Portal_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أدخل ${i?.name} عرض السعر ${i?.number} في بوابة مشتريات العميل.`)
};

export const api_commercial_portal_check_activity = /** @type {(inputs: Api_Commercial_Portal_Check_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`قارن الذكاء الاصطناعي لقطة البوابة مع ${i?.number}: اختلاف واحد (شروط الدفع). لم يُعتبر الإرسال مكتملًا.`)
};

export const api_commercial_portal_default_terms = /** @type {(inputs: Api_Commercial_Portal_Default_TermsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`60 يومًا (افتراضي البوابة)`)
};

export const api_commercial_price_expired = /** @type {(inputs: Api_Commercial_Price_ExpiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`انتهت صلاحية سعر المورّد، يُرجى إعادة التأكيد`)
};

export const api_commercial_purchasing_department = /** @type {(inputs: Api_Commercial_Purchasing_DepartmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إدارة المشتريات`)
};

export const api_commercial_quantity_shortfall = /** @type {(inputs: Api_Commercial_Quantity_ShortfallInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`نقص في الكمية: يغطي ${i?.pct}% من الطلب`)
};

export const api_commercial_quotation_not_found = /** @type {(inputs: Api_Commercial_Quotation_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على عرض السعر.`)
};

export const api_commercial_quote_margin_below = /** @type {(inputs: Api_Commercial_Quote_Margin_BelowInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`هامش ربح عرض السعر ${i?.margin}% أقل من الحد الأدنى ${i?.min}%`)
};

export const api_commercial_quoted_with_selection = /** @type {(inputs: Api_Commercial_Quoted_With_SelectionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} في حالة ${i?.status} بهذا الاختيار، فعدّل عرض السعر بدلًا من ذلك.`)
};

export const api_commercial_rejected_technical = /** @type {(inputs: Api_Commercial_Rejected_TechnicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مرفوض في الفحص الفني`)
};

export const api_commercial_replies_in = /** @type {(inputs: Api_Commercial_Replies_InInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`يرد خلال ~${i?.hours} ساعة`)
};

export const api_commercial_requested_activity = /** @type {(inputs: Api_Commercial_Requested_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`طلب ${i?.name} الموافقة على ${i?.number}.`)
};

export const api_commercial_returned_title = /** @type {(inputs: Api_Commercial_Returned_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُرجع: ${i?.title}`)
};

export const api_commercial_revise_for_customer = /** @type {(inputs: Api_Commercial_Revise_For_CustomerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`راجع ${i?.number} كما طلب العميل`)
};

export const api_commercial_revise_latest = /** @type {(inputs: Api_Commercial_Revise_LatestInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} في حالة ${i?.status}، فعدّل أحدث نسخة بدلًا من ذلك.`)
};

export const api_commercial_revise_pricing = /** @type {(inputs: Api_Commercial_Revise_PricingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`عدّل التسعير، أرجعه ${i?.name}: ${i?.reason}`)
};

export const api_commercial_revised_activity = /** @type {(inputs: Api_Commercial_Revised_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُنشئ ${i?.next} من ${i?.from} (محفوظ للمراجعة).`)
};

export const api_commercial_revision_remark = /** @type {(inputs: Api_Commercial_Revision_RemarkInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تعديل: ${i?.reason}`)
};

export const api_commercial_sales_hidden = /** @type {(inputs: Api_Commercial_Sales_HiddenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التكاليف وهوامش الربح مخفية عن دورك.`)
};

export const api_commercial_select_alternative_first = /** @type {(inputs: Api_Commercial_Select_Alternative_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختر العرض البديل أولًا.`)
};

export const api_commercial_select_offers_first = /** @type {(inputs: Api_Commercial_Select_Offers_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختر عروضًا لبند واحد على الأقل أولًا.`)
};

export const api_commercial_selected_activity = /** @type {(inputs: Api_Commercial_Selected_ActivityInputs) => LocalizedString} */ (i) => {
	if (i?.hasReason === "yes") return /** @type {LocalizedString} */ (`البند ${i?.line}: تم اختيار ${i?.names} (${i?.reason}).`);
	return /** @type {LocalizedString} */ (`البند ${i?.line}: تم اختيار ${i?.names} (الأنسب).`)
};

export const api_commercial_selected_again = /** @type {(inputs: Api_Commercial_Selected_AgainInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`اختير البند ${i?.line} من جديد منذ ذلك الحين، ولا يوجد ما يُتراجع عنه.`)
};

export const api_commercial_selected_of = /** @type {(inputs: Api_Commercial_Selected_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم اختيار ${i?.total} من ${i?.qty} ${i?.unit}، فوزّع الباقي على عرض آخر.`)
};

export const api_commercial_send_for_approval = /** @type {(inputs: Api_Commercial_Send_For_ApprovalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أرسل ${i?.number} للاعتماد`)
};

export const api_commercial_send_to_customer = /** @type {(inputs: Api_Commercial_Send_To_CustomerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أرسل ${i?.number} إلى العميل`)
};

export const api_commercial_sent_awaiting_corrected = /** @type {(inputs: Api_Commercial_Sent_Awaiting_CorrectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أُرسل، بانتظار العرض المصحّح`)
};

export const api_commercial_shelf_life = /** @type {(inputs: Api_Commercial_Shelf_LifeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مدة الصلاحية: متبقٍ ${i?.left} شهرًا، والسفينة طلبت ${i?.need}`)
};

export const api_commercial_shelf_life_below = /** @type {(inputs: Api_Commercial_Shelf_Life_BelowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مدة الصلاحية أقل مما تطلبه السفينة`)
};

export const api_commercial_someone_decided_after = /** @type {(inputs: Api_Commercial_Someone_Decided_AfterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اتخذ شخص آخر قرارًا بعدك، وتقدّم الطلب.`)
};

export const api_commercial_split_sourcing = /** @type {(inputs: Api_Commercial_Split_SourcingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`توريد مقسّم: ${i?.parts}`)
};

export const api_commercial_superseded_by = /** @type {(inputs: Api_Commercial_Superseded_ByInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`استُبدل بالنسخة v${i?.version}، ومحفوظ للمراجعة`)
};

export const api_commercial_supplied_as = /** @type {(inputs: Api_Commercial_Supplied_AsInputs) => LocalizedString} */ (i) => {
	if (i?.accepted === "yes") return /** @type {LocalizedString} */ (`${i?.description}، يُورَّد في صورة ${i?.pack} (عبوة بديلة، مقبولة)`);
	return /** @type {LocalizedString} */ (`${i?.description}، يُورَّد في صورة ${i?.pack} (عبوة بديلة)`)
};

export const api_commercial_supplier_word = /** @type {(inputs: Api_Commercial_Supplier_WordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المورّد`)
};

export const api_commercial_taken_back = /** @type {(inputs: Api_Commercial_Taken_BackInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`البند ${i?.line}: تم التراجع عن الاختيار`)
};

export const api_commercial_taken_back_activity = /** @type {(inputs: Api_Commercial_Taken_Back_ActivityInputs) => LocalizedString} */ (i) => {
	if (i?.earlier === "yes") return /** @type {LocalizedString} */ (`البند ${i?.line}: تراجع ${i?.name} عن الاختيار، ويعود الاختيار السابق.`);
	return /** @type {LocalizedString} */ (`البند ${i?.line}: تراجع ${i?.name} عن الاختيار.`)
};

export const api_commercial_terms_tbc = /** @type {(inputs: Api_Commercial_Terms_TbcInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الشروط لم تُحدد`)
};

export const api_commercial_the_customer = /** @type {(inputs: Api_Commercial_The_CustomerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العميل`)
};

export const api_commercial_tight_eta = /** @type {(inputs: Api_Commercial_Tight_EtaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ضيق: جاهز في يوم الوصول`)
};

export const api_commercial_truck_lane = /** @type {(inputs: Api_Commercial_Truck_LaneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`شاحنة من ${i?.from} ← ${i?.port}`)
};

export const api_commercial_unknown_action = /** @type {(inputs: Api_Commercial_Unknown_ActionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إجراء غير معروف.`)
};

export const api_commercial_unknown_decision = /** @type {(inputs: Api_Commercial_Unknown_DecisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قرار غير معروف.`)
};

export const api_commercial_withdrew_activity = /** @type {(inputs: Api_Commercial_Withdrew_ActivityInputs) => LocalizedString} */ (i) => {
	if (i?.approval === "yes") return /** @type {LocalizedString} */ (`سحب ${i?.name} موافقته على «${i?.title}»، وهو ينتظر قرارًا من جديد.`);
	return /** @type {LocalizedString} */ (`سحب ${i?.name} إرجاعه على «${i?.title}»، وهو ينتظر قرارًا من جديد.`)
};

export const api_commercial_wrong_part = /** @type {(inputs: Api_Commercial_Wrong_PartInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`علامة / قطعة خاطئة: ${i?.brand} ${i?.partNo} فقط`)
};

export const api_commercial_your_offer = /** @type {(inputs: Api_Commercial_Your_OfferInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`عرضكم: ${i?.offered}. ${i?.detail}`)
};

export const api_control_room_ack_sub = /** @type {(inputs: Api_Control_Room_Ack_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الوسيط بالدقائق لتأكيد استلام طلب عرض الأسعار، والأتمتة تعمل منذ 6 أكتوبر`)
};

export const api_control_room_ack_title = /** @type {(inputs: Api_Control_Room_Ack_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مدة تأكيد الاستلام`)
};

export const api_control_room_actual = /** @type {(inputs: Api_Control_Room_ActualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الفعلي`)
};

export const api_control_room_after_hours = /** @type {(inputs: Api_Control_Room_After_HoursInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلبات خارج ساعات العمل`)
};

export const api_control_room_after_hours_sub = /** @type {(inputs: Api_Control_Room_After_Hours_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلبات عروض الأسعار خارج الأحد–الخميس 08:00–17:00، تُحوَّل إلى المناوب`)
};

export const api_control_room_after_hours_title = /** @type {(inputs: Api_Control_Room_After_Hours_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الطلبات خارج ساعات العمل`)
};

export const api_control_room_ageing_sub = /** @type {(inputs: Api_Control_Room_Ageing_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل العملاء، حسب أيام التأخر`)
};

export const api_control_room_ageing_title = /** @type {(inputs: Api_Control_Room_Ageing_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أعمار الذمم المدينة`)
};

export const api_control_room_avg_time_to_quote = /** @type {(inputs: Api_Control_Room_Avg_Time_To_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`متوسط مدة إعداد عرض السعر`)
};

export const api_control_room_blocked_or_urgent = /** @type {(inputs: Api_Control_Room_Blocked_Or_UrgentInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} متوقفة أو عاجلة`)
};

export const api_control_room_cash_sub = /** @type {(inputs: Api_Control_Room_Cash_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`متحصلات العملاء المتوقعة ومدفوعات الموردين الملتزم بها، الأسابيع الثمانية القادمة`)
};

export const api_control_room_cash_title = /** @type {(inputs: Api_Control_Room_Cash_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التدفق الداخل مقابل الخارج`)
};

export const api_control_room_conversion = /** @type {(inputs: Api_Control_Room_ConversionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التحويل`)
};

export const api_control_room_conversion_sub = /** @type {(inputs: Api_Control_Room_Conversion_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قيمة أوامر الشراء ÷ قيمة العروض، حسب شهر وصول الطلب (نوفمبر ما زال مفتوحًا)`)
};

export const api_control_room_conversion_title = /** @type {(inputs: Api_Control_Room_Conversion_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التحويل حسب القيمة`)
};

export const api_control_room_days = /** @type {(inputs: Api_Control_Room_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} يوم`)
};

export const api_control_room_deliveries_sub = /** @type {(inputs: Api_Control_Room_Deliveries_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التسليمات إلى السفن أسبوعيًا`)
};

export const api_control_room_deliveries_title = /** @type {(inputs: Api_Control_Room_Deliveries_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التسليمات حسب النتيجة`)
};

export const api_control_room_delivery_sub = /** @type {(inputs: Api_Control_Room_Delivery_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`من يسلّم في الموعد، ومدى سرعة ردّه`)
};

export const api_control_room_delivery_title = /** @type {(inputs: Api_Control_Room_Delivery_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التسليم والموردون`)
};

export const api_control_room_expected_at_quotation = /** @type {(inputs: Api_Control_Room_Expected_At_QuotationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المتوقع عند عرض السعر`)
};

export const api_control_room_funnel_sub = /** @type {(inputs: Api_Control_Room_Funnel_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`آخر 90 يومًا، وكل خطوة تُحسب مرة واحدة`)
};

export const api_control_room_funnel_title = /** @type {(inputs: Api_Control_Room_Funnel_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسار التحويل`)
};

export const api_control_room_gp_note = /** @type {(inputs: Api_Control_Room_Gp_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الفعلي حتى الآن · ${i?.expected} متوقع عند عرض السعر`)
};

export const api_control_room_gp_sub = /** @type {(inputs: Api_Control_Room_Gp_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الفعلي يحل محل التقديرات مع فوترة التكاليف (نوفمبر جارٍ)`)
};

export const api_control_room_gp_title = /** @type {(inputs: Api_Control_Room_Gp_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إجمالي الربح: المتوقع مقابل الفعلي`)
};

export const api_control_room_gross_profit_month = /** @type {(inputs: Api_Control_Room_Gross_Profit_MonthInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`إجمالي الربح ${i?.month}`)
};

export const api_control_room_inquiries = /** @type {(inputs: Api_Control_Room_InquiriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الاستفسارات`)
};

export const api_control_room_inquiries_chart_sub = /** @type {(inputs: Api_Control_Room_Inquiries_Chart_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملفات طلبات عروض الأسعار حسب أسبوع الاستلام`)
};

export const api_control_room_inquiries_chart_title = /** @type {(inputs: Api_Control_Room_Inquiries_Chart_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الاستفسارات وعروض الأسعار والصفقات الرابحة`)
};

export const api_control_room_last_12_weeks = /** @type {(inputs: Api_Control_Room_Last_12_WeeksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`آخر 12 أسبوعًا`)
};

export const api_control_room_last_4_weeks = /** @type {(inputs: Api_Control_Room_Last_4_WeeksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`آخر 4 أسابيع`)
};

export const api_control_room_last_6_months = /** @type {(inputs: Api_Control_Room_Last_6_MonthsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`آخر 6 أشهر`)
};

export const api_control_room_lost_sub = /** @type {(inputs: Api_Control_Room_Lost_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الملفات الخاسرة حسب السبب المسجّل، آخر 90 يومًا`)
};

export const api_control_room_lost_title = /** @type {(inputs: Api_Control_Room_Lost_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لماذا نخسر`)
};

export const api_control_room_margin_source_sub = /** @type {(inputs: Api_Control_Room_Margin_Source_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هامش الربح الإجمالي، آخر 90 يومًا · الحد الأدنى 15%`)
};

export const api_control_room_margin_source_title = /** @type {(inputs: Api_Control_Room_Margin_Source_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هامش الربح حسب المصدر`)
};

export const api_control_room_margin_store_sub = /** @type {(inputs: Api_Control_Room_Margin_Store_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هامش الربح الإجمالي الفعلي، آخر 90 يومًا · الحد الأدنى 15%`)
};

export const api_control_room_margin_store_title = /** @type {(inputs: Api_Control_Room_Margin_Store_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هامش الربح حسب الفئة`)
};

export const api_control_room_median_days = /** @type {(inputs: Api_Control_Room_Median_DaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الوسيط بالأيام`)
};

export const api_control_room_minutes = /** @type {(inputs: Api_Control_Room_MinutesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الدقائق`)
};

export const api_control_room_money_sub = /** @type {(inputs: Api_Control_Room_Money_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`للإدارة والمالية فقط`)
};

export const api_control_room_money_title = /** @type {(inputs: Api_Control_Room_Money_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الربح والسيولة`)
};

export const api_control_room_nothing_over_30_days = /** @type {(inputs: Api_Control_Room_Nothing_Over_30_DaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا شيء متأخر أكثر من 30 يومًا`)
};

export const api_control_room_open_invoices = /** @type {(inputs: Api_Control_Room_Open_InvoicesInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`لا توجد فواتير مفتوحة`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`فاتورة مفتوحة واحدة`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`فاتورتان مفتوحتان`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${i?.count} فواتير مفتوحة`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${i?.count} فاتورة مفتوحة`);
	return /** @type {LocalizedString} */ (`${i?.count} فاتورة مفتوحة`)
};

export const api_control_room_open_rfqs = /** @type {(inputs: Api_Control_Room_Open_RfqsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلبات عروض الأسعار المفتوحة`)
};

export const api_control_room_over_30_days = /** @type {(inputs: Api_Control_Room_Over_30_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} متأخر أكثر من 30 يومًا`)
};

export const api_control_room_overdue_of = /** @type {(inputs: Api_Control_Room_Overdue_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.overdue} من ${i?.total} متأخرة`)
};

export const api_control_room_payments = /** @type {(inputs: Api_Control_Room_PaymentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المدفوعات`)
};

export const api_control_room_pipeline_sub = /** @type {(inputs: Api_Control_Room_Pipeline_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`من الاستفسار إلى الفوز، ولماذا نخسر`)
};

export const api_control_room_pipeline_title = /** @type {(inputs: Api_Control_Room_Pipeline_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسار المبيعات ونسب التحويل`)
};

export const api_control_room_quoted = /** @type {(inputs: Api_Control_Room_QuotedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صدر لها عرض سعر`)
};

export const api_control_room_receipts = /** @type {(inputs: Api_Control_Room_ReceiptsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المتحصلات`)
};

export const api_control_room_receivables = /** @type {(inputs: Api_Control_Room_ReceivablesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الذمم المدينة`)
};

export const api_control_room_receivables_customer_sub = /** @type {(inputs: Api_Control_Room_Receivables_Customer_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأرصدة المفتوحة، كل الأعمار`)
};

export const api_control_room_receivables_customer_title = /** @type {(inputs: Api_Control_Room_Receivables_Customer_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الذمم المدينة حسب العميل`)
};

export const api_control_room_receivables_open = /** @type {(inputs: Api_Control_Room_Receivables_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الذمم المدينة المفتوحة`)
};

export const api_control_room_rfqs_without_reply = /** @type {(inputs: Api_Control_Room_Rfqs_Without_ReplyInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`لا توجد طلبات عروض أسعار للموردين دون رد كامل`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`طلب عرض أسعار واحد لمورّد دون رد كامل`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`طلبا عرض أسعار لموردين دون رد كامل`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${i?.count} طلبات عروض أسعار لموردين دون رد كامل`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${i?.count} طلبًا لعروض أسعار من الموردين دون رد كامل`);
	return /** @type {LocalizedString} */ (`${i?.count} طلب عرض أسعار لموردين دون رد كامل`)
};

export const api_control_room_sales_source_sub = /** @type {(inputs: Api_Control_Room_Sales_Source_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قوائم أسعار الوكالات ومخزوننا يحققان هامش ربح أعلى من الشراء حسب الطلب`)
};

export const api_control_room_sales_source_title = /** @type {(inputs: Api_Control_Room_Sales_Source_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المبيعات حسب المصدر`)
};

export const api_control_room_speed_sub = /** @type {(inputs: Api_Control_Room_Speed_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مدى سرعة ردّنا، ومن يتحمّل العبء`)
};

export const api_control_room_speed_title = /** @type {(inputs: Api_Control_Room_Speed_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السرعة وحجم العمل`)
};

export const api_control_room_target_1_day = /** @type {(inputs: Api_Control_Room_Target_1_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المستهدف يوم واحد`)
};

export const api_control_room_target_35 = /** @type {(inputs: Api_Control_Room_Target_35Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المستهدف 35%`)
};

export const api_control_room_thousands = /** @type {(inputs: Api_Control_Room_ThousandsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} ألف ${i?.currency}`)
};

export const api_control_room_turnaround_note = /** @type {(inputs: Api_Control_Room_Turnaround_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`كان ${i?.was} يوم في سبتمبر · المستهدف يوم واحد`)
};

export const api_control_room_turnaround_sub = /** @type {(inputs: Api_Control_Room_Turnaround_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الوسيط بالأيام من استلام الطلب إلى إرسال عرض السعر`)
};

export const api_control_room_turnaround_title = /** @type {(inputs: Api_Control_Room_Turnaround_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مدة إعداد عرض السعر`)
};

export const api_control_room_value_won = /** @type {(inputs: Api_Control_Room_Value_WonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`القيمة الرابحة`)
};

export const api_control_room_value_won_sub = /** @type {(inputs: Api_Control_Room_Value_Won_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أوامر شراء العملاء، بما فيها الترسيات الجزئية`)
};

export const api_control_room_value_won_title = /** @type {(inputs: Api_Control_Room_Value_Won_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قيمة الصفقات الرابحة شهريًا`)
};

export const api_control_room_waiting_on_suppliers = /** @type {(inputs: Api_Control_Room_Waiting_On_SuppliersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظار الموردين`)
};

export const api_control_room_win_rate = /** @type {(inputs: Api_Control_Room_Win_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نسبة الفوز`)
};

export const api_control_room_won = /** @type {(inputs: Api_Control_Room_WonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فزنا بها`)
};

export const api_control_room_won_of_quoted = /** @type {(inputs: Api_Control_Room_Won_Of_QuotedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`فزنا بـ${i?.won} من ${i?.quoted} عرض سعر، ${i?.period}`)
};

export const api_growth_crm_activity = /** @type {(inputs: Api_Growth_Crm_ActivityInputs) => LocalizedString} */ (i) => {
	if (i?.hasNote === "yes" && i?.hasNext === "yes") return /** @type {LocalizedString} */ (`${i?.name}: ${i?.result} (${i?.note}). الخطوة التالية: ${i?.step} (${i?.due}).`);
	if (i?.hasNote === "yes") return /** @type {LocalizedString} */ (`${i?.name}: ${i?.result} (${i?.note}). المرحلة: ${i?.stage}.`);
	if (i?.hasNext === "yes") return /** @type {LocalizedString} */ (`${i?.name}: ${i?.result}. الخطوة التالية: ${i?.step} (${i?.due}).`);
	return /** @type {LocalizedString} */ (`${i?.name}: ${i?.result}. المرحلة: ${i?.stage}.`)
};

export const api_growth_crm_choose_outcome = /** @type {(inputs: Api_Growth_Crm_Choose_OutcomeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختر النتيجة.`)
};

export const api_growth_crm_customer_relation = /** @type {(inputs: Api_Growth_Crm_Customer_RelationInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`عميل · ${i?.status}`)
};

export const api_growth_crm_next_step_date_invalid = /** @type {(inputs: Api_Growth_Crm_Next_Step_Date_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تاريخ الخطوة التالية غير صالح.`)
};

export const api_growth_crm_opportunity_not_found = /** @type {(inputs: Api_Growth_Crm_Opportunity_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على الفرصة.`)
};

export const api_growth_crm_outcome_planned = /** @type {(inputs: Api_Growth_Crm_Outcome_PlannedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم حفظ النتيجة، والخطوة التالية «${i?.step}» مخططة في ${i?.due}`)
};

export const api_growth_crm_outcome_stage = /** @type {(inputs: Api_Growth_Crm_Outcome_StageInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم حفظ النتيجة، و${i?.name} الآن في مرحلة «${i?.stage}»`)
};

export const api_growth_crm_plan_next_step = /** @type {(inputs: Api_Growth_Crm_Plan_Next_StepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حدّد الخطوة التالية وتاريخها (أو أغلق الفرصة).`)
};

export const api_growth_crm_prospect_relation = /** @type {(inputs: Api_Growth_Crm_Prospect_RelationInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`عميل محتمل · ${i?.stage}`)
};

export const api_growth_crm_task_title = /** @type {(inputs: Api_Growth_Crm_Task_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.step}: ${i?.name}`)
};

export const api_growth_crm_unknown_stage = /** @type {(inputs: Api_Growth_Crm_Unknown_StageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مرحلة غير معروفة.`)
};

export const api_history_age_1_30 = /** @type {(inputs: Api_History_Age_1_30Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`1–30 يومًا`)
};

export const api_history_age_31_60 = /** @type {(inputs: Api_History_Age_31_60Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`31–60 يومًا`)
};

export const api_history_age_60_plus = /** @type {(inputs: Api_History_Age_60_PlusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أكثر من 60 يومًا`)
};

export const api_history_agency_pricelist = /** @type {(inputs: Api_History_Agency_PricelistInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قائمة أسعار الوكالة`)
};

export const api_history_awaiting_corrected_offer = /** @type {(inputs: Api_History_Awaiting_Corrected_OfferInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظار عرض مصحّح`)
};

export const api_history_awaiting_customer_decision = /** @type {(inputs: Api_History_Awaiting_Customer_DecisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظار قرار العميل`)
};

export const api_history_awaiting_delivery_or_payment = /** @type {(inputs: Api_History_Awaiting_Delivery_Or_PaymentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظار التسليم أو الدفع`)
};

export const api_history_awaiting_internal_approval = /** @type {(inputs: Api_History_Awaiting_Internal_ApprovalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظار موافقة داخلية`)
};

export const api_history_awaiting_supplier = /** @type {(inputs: Api_History_Awaiting_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظار المورّد`)
};

export const api_history_bought_to_order = /** @type {(inputs: Api_History_Bought_To_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`شراء حسب الطلب`)
};

export const api_history_cabin_stores = /** @type {(inputs: Api_History_Cabin_StoresInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مستلزمات الكبائن`)
};

export const api_history_cancelled = /** @type {(inputs: Api_History_CancelledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أُلغي`)
};

export const api_history_deck_stores = /** @type {(inputs: Api_History_Deck_StoresInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مستلزمات السطح`)
};

export const api_history_electrical_stores = /** @type {(inputs: Api_History_Electrical_StoresInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المستلزمات الكهربائية`)
};

export const api_history_engine_stores = /** @type {(inputs: Api_History_Engine_StoresInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مستلزمات المحركات`)
};

export const api_history_inquiries_received = /** @type {(inputs: Api_History_Inquiries_ReceivedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الاستفسارات الواردة`)
};

export const api_history_late = /** @type {(inputs: Api_History_LateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`متأخر`)
};

export const api_history_late_quote = /** @type {(inputs: Api_History_Late_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عرض سعر متأخر`)
};

export const api_history_lead_time = /** @type {(inputs: Api_History_Lead_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مدة التوريد`)
};

export const api_history_no_supplier = /** @type {(inputs: Api_History_No_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد مورّد`)
};

export const api_history_not_due = /** @type {(inputs: Api_History_Not_DueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`غير مستحق`)
};

export const api_history_on_time = /** @type {(inputs: Api_History_On_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`في الموعد`)
};

export const api_history_own_stock = /** @type {(inputs: Api_History_Own_StockInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مخزوننا`)
};

export const api_history_partial = /** @type {(inputs: Api_History_PartialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جزئي`)
};

export const api_history_price = /** @type {(inputs: Api_History_PriceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السعر`)
};

export const api_history_provision_stores = /** @type {(inputs: Api_History_Provision_StoresInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مؤن غذائية`)
};

export const api_history_quoted = /** @type {(inputs: Api_History_QuotedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صدر لها عرض سعر`)
};

export const api_history_safety_stores = /** @type {(inputs: Api_History_Safety_StoresInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مستلزمات السلامة`)
};

export const api_history_sent_to_suppliers = /** @type {(inputs: Api_History_Sent_To_SuppliersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أُرسلت إلى الموردين`)
};

export const api_history_spare_parts_clearance = /** @type {(inputs: Api_History_Spare_Parts_ClearanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تخليص قطع الغيار (رسوم)`)
};

export const api_history_validated = /** @type {(inputs: Api_History_ValidatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم التحقق منها`)
};

export const api_history_won_full_or_partial = /** @type {(inputs: Api_History_Won_Full_Or_PartialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فزنا بها (كليًا أو جزئيًا)`)
};

export const api_home_4_weeks_ago = /** @type {(inputs: Api_Home_4_Weeks_AgoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قبل 4 أسابيع`)
};

export const api_home_ack_sub = /** @type {(inputs: Api_Home_Ack_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الوسيط بالدقائق · بدأ التأكيد التلقائي في 6 أكتوبر`)
};

export const api_home_ack_title = /** @type {(inputs: Api_Home_Ack_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مدة تأكيد استلام طلب عرض الأسعار`)
};

export const api_home_actual = /** @type {(inputs: Api_Home_ActualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الفعلي`)
};

export const api_home_after_hours_sub = /** @type {(inputs: Api_Home_After_Hours_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلبات عروض الأسعار خارج الأحد–الخميس 08:00–17:00، تُحوَّل إلى المناوب`)
};

export const api_home_after_hours_title = /** @type {(inputs: Api_Home_After_Hours_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الطلبات خارج ساعات العمل`)
};

export const api_home_all_cases = /** @type {(inputs: Api_Home_All_CasesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل الملفات`)
};

export const api_home_all_live_cases = /** @type {(inputs: Api_Home_All_Live_CasesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل الملفات النشطة`)
};

export const api_home_amount_vs = /** @type {(inputs: Api_Home_Amount_VsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} مقارنة بـ${i?.than}`)
};

export const api_home_approvals_in_queue = /** @type {(inputs: Api_Home_Approvals_In_QueueInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`لا توجد موافقات في القائمة`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`موافقة واحدة في القائمة`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`موافقتان في القائمة`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`${i?.n} موافقات في القائمة`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`${i?.n} موافقة في القائمة`);
	return /** @type {LocalizedString} */ (`${i?.n} موافقة في القائمة`)
};

export const api_home_arrives = /** @type {(inputs: Api_Home_ArrivesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`وصول ${i?.vessel}`)
};

export const api_home_arrives_when = /** @type {(inputs: Api_Home_Arrives_WhenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`وصول ${i?.vessel} ${i?.when}`)
};

export const api_home_awaiting_customer = /** @type {(inputs: Api_Home_Awaiting_CustomerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} بانتظار العميل`)
};

export const api_home_bill_due = /** @type {(inputs: Api_Home_Bill_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier}: الفاتورة مستحقة`)
};

export const api_home_billed_so_far = /** @type {(inputs: Api_Home_Billed_So_FarInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} ألف مفوتر حتى الآن`)
};

export const api_home_bills_to_match = /** @type {(inputs: Api_Home_Bills_To_MatchInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`لا توجد فواتير للمطابقة`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`فاتورة واحدة للمطابقة`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`فاتورتان للمطابقة`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`${i?.n} فواتير للمطابقة`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`${i?.n} فاتورة للمطابقة`);
	return /** @type {LocalizedString} */ (`${i?.n} فاتورة للمطابقة`)
};

export const api_home_briefing_sub = /** @type {(inputs: Api_Home_Briefing_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أُعدّ في 07:00 من ملفاتك وبريدك الوارد والتكاملات`)
};

export const api_home_cases_in_queue = /** @type {(inputs: Api_Home_Cases_In_QueueInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`لا توجد ملفات في قائمتك`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`ملف واحد في قائمتك`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`ملفان في قائمتك`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`${i?.n} ملفات في قائمتك`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`${i?.n} ملفًا في قائمتك`);
	return /** @type {LocalizedString} */ (`${i?.n} ملف في قائمتك`)
};

export const api_home_cash_sub = /** @type {(inputs: Api_Home_Cash_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`متحصلات العملاء المتوقعة ومدفوعات الموردين الملتزم بها، بآلاف الجنيهات`)
};

export const api_home_cash_title = /** @type {(inputs: Api_Home_Cash_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التدفق الداخل مقابل الخارج، الأسابيع الثمانية القادمة`)
};

export const api_home_commitment_blocked = /** @type {(inputs: Api_Home_Commitment_BlockedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الالتزام موقوف حتى يطابق أمر الشراء عرض السعر المعتمد.`)
};

export const api_home_continue = /** @type {(inputs: Api_Home_ContinueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`متابعة ${i?.caseId}`)
};

export const api_home_daily_briefing = /** @type {(inputs: Api_Home_Daily_BriefingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الموجز اليومي`)
};

export const api_home_days = /** @type {(inputs: Api_Home_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} يوم`)
};

export const api_home_decisions_waiting = /** @type {(inputs: Api_Home_Decisions_WaitingInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`لا توجد قرارات تنتظر`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`قرار واحد ينتظر`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`قراران ينتظران`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`${i?.n} قرارات تنتظر`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`${i?.n} قرارًا ينتظر`);
	return /** @type {LocalizedString} */ (`${i?.n} قرار ينتظر`)
};

export const api_home_deliveries = /** @type {(inputs: Api_Home_DeliveriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التسليمات`)
};

export const api_home_deliveries_in_progress = /** @type {(inputs: Api_Home_Deliveries_In_ProgressInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`لا توجد تسليمات جارية`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`تسليم واحد جارٍ`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`تسليمان جاريان`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`${i?.n} تسليمات جارية`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`${i?.n} تسليمًا جاريًا`);
	return /** @type {LocalizedString} */ (`${i?.n} تسليم جارٍ`)
};

export const api_home_deliveries_in_progress_label = /** @type {(inputs: Api_Home_Deliveries_In_Progress_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التسليمات الجارية`)
};

export const api_home_drop_leaves = /** @type {(inputs: Api_Home_Drop_LeavesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`خروج دفعة التسليم ${i?.number}`)
};

export const api_home_expected = /** @type {(inputs: Api_Home_ExpectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المتوقع`)
};

export const api_home_expected_gp_nov = /** @type {(inputs: Api_Home_Expected_Gp_NovInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إجمالي الربح المتوقع، نوفمبر`)
};

export const api_home_follow_ups = /** @type {(inputs: Api_Home_Follow_UpsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المتابعات`)
};

export const api_home_follow_ups_due_today = /** @type {(inputs: Api_Home_Follow_Ups_Due_TodayInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`لا توجد متابعات مستحقة اليوم`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`متابعة واحدة مستحقة اليوم`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`متابعتان مستحقتان اليوم`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`${i?.n} متابعات مستحقة اليوم`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`${i?.n} متابعة مستحقة اليوم`);
	return /** @type {LocalizedString} */ (`${i?.n} متابعة مستحقة اليوم`)
};

export const api_home_follow_ups_today = /** @type {(inputs: Api_Home_Follow_Ups_TodayInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`لا توجد متابعات اليوم`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`متابعة واحدة اليوم`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`متابعتان اليوم`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`${i?.n} متابعات اليوم`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`${i?.n} متابعة اليوم`);
	return /** @type {LocalizedString} */ (`${i?.n} متابعة اليوم`)
};

export const api_home_good_morning = /** @type {(inputs: Api_Home_Good_MorningInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`صباح الخير يا ${i?.name}`)
};

export const api_home_gp_sub = /** @type {(inputs: Api_Home_Gp_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بآلاف الجنيهات · الفعلي يحل محل التقديرات مع فوترة التكاليف (نوفمبر جارٍ)`)
};

export const api_home_gp_title = /** @type {(inputs: Api_Home_Gp_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إجمالي الربح: المتوقع مقابل الفعلي`)
};

export const api_home_in_out = /** @type {(inputs: Api_Home_In_OutInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`داخل ${i?.in} ألف · خارج ${i?.out} ألف`)
};

export const api_home_inquiries = /** @type {(inputs: Api_Home_InquiriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الاستفسارات`)
};

export const api_home_inquiries_4_weeks = /** @type {(inputs: Api_Home_Inquiries_4_WeeksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الاستفسارات، آخر 4 أسابيع`)
};

export const api_home_integration_exceptions = /** @type {(inputs: Api_Home_Integration_ExceptionsInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`لا توجد استثناءات تكامل`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`استثناء تكامل واحد`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`استثناءا تكامل`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`${i?.n} استثناءات تكامل`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`${i?.n} استثناءً تكامليًا`);
	return /** @type {LocalizedString} */ (`${i?.n} استثناء تكامل`)
};

export const api_home_invoice_due = /** @type {(inputs: Api_Home_Invoice_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.customer}: ${i?.amount} تستحق في ${i?.day}`)
};

export const api_home_invoice_due_short = /** @type {(inputs: Api_Home_Invoice_Due_ShortInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.customer}: الفاتورة مستحقة`)
};

export const api_home_invoice_overdue = /** @type {(inputs: Api_Home_Invoice_OverdueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.customer}: ${i?.amount} متأخرة منذ ${i?.day}`)
};

export const api_home_invoice_sub = /** @type {(inputs: Api_Home_Invoice_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} · ${i?.status} · تمت صياغة تذكير تحصيل`)
};

export const api_home_invoice_sub_paid = /** @type {(inputs: Api_Home_Invoice_Sub_PaidInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} · ${i?.status} · استُلم ${i?.paid} · تمت صياغة تذكير تحصيل`)
};

export const api_home_invoices = /** @type {(inputs: Api_Home_InvoicesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الفواتير`)
};

export const api_home_items_awaiting_approval = /** @type {(inputs: Api_Home_Items_Awaiting_ApprovalInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`بند واحد ينتظر الموافقة`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`بندان ينتظران الموافقة`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${i?.count} بنود تنتظر الموافقة`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${i?.count} بندًا ينتظر الموافقة`);
	return /** @type {LocalizedString} */ (`${i?.count} بند ينتظر الموافقة`)
};

export const api_home_k_past_due = /** @type {(inputs: Api_Home_K_Past_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} ألف متأخرة السداد`)
};

export const api_home_last_week = /** @type {(inputs: Api_Home_Last_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأسبوع الماضي`)
};

export const api_home_later_this_week = /** @type {(inputs: Api_Home_Later_This_WeekInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} لاحقًا هذا الأسبوع`)
};

export const api_home_live_cases = /** @type {(inputs: Api_Home_Live_CasesInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`لا توجد ملفات نشطة`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`ملف نشط واحد`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`ملفان نشطان`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`${i?.n} ملفات نشطة`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`${i?.n} ملفًا نشطًا`);
	return /** @type {LocalizedString} */ (`${i?.n} ملف نشط`)
};

export const api_home_lost_cases = /** @type {(inputs: Api_Home_Lost_CasesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الملفات الخاسرة`)
};

export const api_home_lost_sub = /** @type {(inputs: Api_Home_Lost_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الملفات الخاسرة حسب السبب المسجّل، آخر 90 يومًا`)
};

export const api_home_lost_title = /** @type {(inputs: Api_Home_Lost_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لماذا نخسر`)
};

export const api_home_median_days = /** @type {(inputs: Api_Home_Median_DaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الوسيط بالأيام`)
};

export const api_home_median_new_rfqs = /** @type {(inputs: Api_Home_Median_New_RfqsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الوسيط، طلبات عروض الأسعار الجديدة`)
};

export const api_home_median_target = /** @type {(inputs: Api_Home_Median_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الوسيط · المستهدف يوم واحد`)
};

export const api_home_messages_to_triage = /** @type {(inputs: Api_Home_Messages_To_TriageInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`لا توجد رسائل للفرز`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`رسالة واحدة للفرز`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`رسالتان للفرز`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`${i?.n} رسائل للفرز`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`${i?.n} رسالة للفرز`);
	return /** @type {LocalizedString} */ (`${i?.n} رسالة للفرز`)
};

export const api_home_minutes = /** @type {(inputs: Api_Home_MinutesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} دقيقة`)
};

export const api_home_minutes_series = /** @type {(inputs: Api_Home_Minutes_SeriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الدقائق`)
};

export const api_home_my_day = /** @type {(inputs: Api_Home_My_DayInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`يومي · ${i?.date}`)
};

export const api_home_my_turnaround = /** @type {(inputs: Api_Home_My_TurnaroundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مدة إعدادي لعروض الأسعار`)
};

export const api_home_my_turnaround_sub = /** @type {(inputs: Api_Home_My_Turnaround_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الوسيط بالأيام، آخر 8 أسابيع`)
};

export const api_home_n_today = /** @type {(inputs: Api_Home_N_TodayInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} اليوم`)
};

export const api_home_net_cash = /** @type {(inputs: Api_Home_Net_CashInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صافي السيولة، الأسابيع الثمانية القادمة`)
};

export const api_home_new_case = /** @type {(inputs: Api_Home_New_CaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملف جديد`)
};

export const api_home_new_messages = /** @type {(inputs: Api_Home_New_MessagesInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`رسالة جديدة واحدة في البريد الوارد`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`رسالتان جديدتان في البريد الوارد`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${i?.count} رسائل جديدة في البريد الوارد`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${i?.count} رسالة جديدة في البريد الوارد`);
	return /** @type {LocalizedString} */ (`${i?.count} رسالة جديدة في البريد الوارد`)
};

export const api_home_next_up = /** @type {(inputs: Api_Home_Next_UpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التالي`)
};

export const api_home_no_change = /** @type {(inputs: Api_Home_No_ChangeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`دون تغيير`)
};

export const api_home_nothing_due_today = /** @type {(inputs: Api_Home_Nothing_Due_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا شيء مستحق اليوم`)
};

export const api_home_nothing_due_week = /** @type {(inputs: Api_Home_Nothing_Due_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا شيء مستحق هذا الأسبوع.`)
};

export const api_home_nothing_needs_you = /** @type {(inputs: Api_Home_Nothing_Needs_YouInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا شيء يحتاجك هذا الصباح.`)
};

export const api_home_open_approvals = /** @type {(inputs: Api_Home_Open_ApprovalsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الموافقات المفتوحة`)
};

export const api_home_out_of_hours_rfqs = /** @type {(inputs: Api_Home_Out_Of_Hours_RfqsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلبات خارج ساعات العمل`)
};

export const api_home_payments = /** @type {(inputs: Api_Home_PaymentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المدفوعات`)
};

export const api_home_pipeline = /** @type {(inputs: Api_Home_PipelineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسار المبيعات`)
};

export const api_home_pipeline_steps_week = /** @type {(inputs: Api_Home_Pipeline_Steps_WeekInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`لا توجد خطوات مبيعات هذا الأسبوع`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`خطوة مبيعات واحدة هذا الأسبوع`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`خطوتا مبيعات هذا الأسبوع`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`${i?.n} خطوات مبيعات هذا الأسبوع`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`${i?.n} خطوة مبيعات هذا الأسبوع`);
	return /** @type {LocalizedString} */ (`${i?.n} خطوة مبيعات هذا الأسبوع`)
};

export const api_home_pipeline_sub = /** @type {(inputs: Api_Home_Pipeline_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملفات طلبات عروض الأسعار حسب أسبوع الاستلام، آخر 12 أسبوعًا`)
};

export const api_home_pipeline_title = /** @type {(inputs: Api_Home_Pipeline_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الاستفسارات وعروض الأسعار والصفقات الرابحة`)
};

export const api_home_po_mismatch = /** @type {(inputs: Api_Home_Po_MismatchInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`اختلاف في أمر شراء العميل على ${i?.caseId}`)
};

export const api_home_quote_due = /** @type {(inputs: Api_Home_Quote_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.vessel}: عرض السعر مستحق`)
};

export const api_home_quote_due_when = /** @type {(inputs: Api_Home_Quote_Due_WhenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`عرض سعر ${i?.vessel} مستحق ${i?.when}`)
};

export const api_home_quote_late = /** @type {(inputs: Api_Home_Quote_LateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`عرض سعر ${i?.vessel} ${i?.when}`)
};

export const api_home_quote_turnaround = /** @type {(inputs: Api_Home_Quote_TurnaroundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مدة إعداد عرض السعر`)
};

export const api_home_quoted = /** @type {(inputs: Api_Home_QuotedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صدر لها عرض سعر`)
};

export const api_home_quotes_due_tomorrow = /** @type {(inputs: Api_Home_Quotes_Due_TomorrowInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`لا توجد عروض أسعار مستحقة قبل نهاية الغد`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`عرض سعر واحد مستحق قبل نهاية الغد`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`عرضا سعر مستحقان قبل نهاية الغد`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`${i?.n} عروض أسعار مستحقة قبل نهاية الغد`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`${i?.n} عرض سعر مستحقًا قبل نهاية الغد`);
	return /** @type {LocalizedString} */ (`${i?.n} عرض سعر مستحق قبل نهاية الغد`)
};

export const api_home_receipts = /** @type {(inputs: Api_Home_ReceiptsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المتحصلات`)
};

export const api_home_receivables = /** @type {(inputs: Api_Home_ReceivablesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الذمم المدينة`)
};

export const api_home_receivables_by_age = /** @type {(inputs: Api_Home_Receivables_By_AgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الذمم المدينة حسب العمر`)
};

export const api_home_reminder_drafted = /** @type {(inputs: Api_Home_Reminder_DraftedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تمت صياغة تذكير`)
};

export const api_home_reply_due = /** @type {(inputs: Api_Home_Reply_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier}: الرد مستحق`)
};

export const api_home_review_inbox = /** @type {(inputs: Api_Home_Review_InboxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مراجعة البريد الوارد`)
};

export const api_home_rfqs = /** @type {(inputs: Api_Home_RfqsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلبات عروض الأسعار`)
};

export const api_home_rfqs_awaiting_reply = /** @type {(inputs: Api_Home_Rfqs_Awaiting_ReplyInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`لا توجد طلبات عروض أسعار تنتظر ردًا`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`طلب عرض أسعار واحد ينتظر ردًا`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`طلبا عرض أسعار ينتظران ردًا`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`${i?.n} طلبات عروض أسعار تنتظر ردًا`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`${i?.n} طلبًا ينتظر ردًا`);
	return /** @type {LocalizedString} */ (`${i?.n} طلب عرض أسعار ينتظر ردًا`)
};

export const api_home_safe_retry = /** @type {(inputs: Api_Home_Safe_RetryInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.impact} · إعادة المحاولة الآمنة متاحة`)
};

export const api_home_same_as = /** @type {(inputs: Api_Home_Same_AsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مثل ${i?.than}`)
};

export const api_home_supplier_bills = /** @type {(inputs: Api_Home_Supplier_BillsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فواتير الموردين`)
};

export const api_home_supplier_bills_open = /** @type {(inputs: Api_Home_Supplier_Bills_OpenInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`لا توجد فواتير موردين مفتوحة`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`فاتورة مورّد واحدة مفتوحة`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`فاتورتا مورّد مفتوحتان`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`${i?.n} فواتير موردين مفتوحة`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`${i?.n} فاتورة موردين مفتوحة`);
	return /** @type {LocalizedString} */ (`${i?.n} فاتورة موردين مفتوحة`)
};

export const api_home_supplier_replies_outstanding = /** @type {(inputs: Api_Home_Supplier_Replies_OutstandingInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`لا توجد ردود موردين معلّقة`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`رد مورّد واحد معلّق`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`ردّا مورّدين معلّقان`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`${i?.n} ردود موردين معلّقة`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`${i?.n} ردًا من الموردين معلّقًا`);
	return /** @type {LocalizedString} */ (`${i?.n} رد موردين معلّق`)
};

export const api_home_supplier_silent = /** @type {(inputs: Api_Home_Supplier_SilentInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} لم يرد`)
};

export const api_home_target_1_day = /** @type {(inputs: Api_Home_Target_1_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المستهدف يوم واحد`)
};

export const api_home_this_week_vs_last = /** @type {(inputs: Api_Home_This_Week_Vs_LastInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هذا الأسبوع، مقارنة بالأسبوع الماضي`)
};

export const api_home_thousands = /** @type {(inputs: Api_Home_ThousandsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} ألف ${i?.currency}`)
};

export const api_home_time_to_acknowledge = /** @type {(inputs: Api_Home_Time_To_AcknowledgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مدة تأكيد الاستلام`)
};

export const api_home_today = /** @type {(inputs: Api_Home_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اليوم`)
};

export const api_home_turnaround_sub = /** @type {(inputs: Api_Home_Turnaround_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الوسيط بالأيام من استلام الطلب إلى إرسال عرض السعر`)
};

export const api_home_turnaround_title = /** @type {(inputs: Api_Home_Turnaround_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مدة إعداد عرض السعر`)
};

export const api_home_usd_past_due = /** @type {(inputs: Api_Home_Usd_Past_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} ألف دولار متأخرة السداد`)
};

export const api_home_usd_thousands_all = /** @type {(inputs: Api_Home_Usd_Thousands_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بآلاف الدولارات، كل العملاء`)
};

export const api_home_value_won = /** @type {(inputs: Api_Home_Value_WonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`القيمة الرابحة`)
};

export const api_home_value_won_sub = /** @type {(inputs: Api_Home_Value_Won_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أوامر شراء العملاء بما فيها الترسيات الجزئية، بآلاف الدولارات`)
};

export const api_home_value_won_title = /** @type {(inputs: Api_Home_Value_Won_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قيمة الصفقات الرابحة شهريًا`)
};

export const api_home_vs_prior_4_weeks = /** @type {(inputs: Api_Home_Vs_Prior_4_WeeksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مقارنة بالأسابيع الأربعة السابقة`)
};

export const api_home_was_due = /** @type {(inputs: Api_Home_Was_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.reference} كان مستحقًا ${i?.when} · ${i?.last}`)
};

export const api_home_won = /** @type {(inputs: Api_Home_WonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فزنا بها`)
};

export const api_home_won_4_weeks = /** @type {(inputs: Api_Home_Won_4_WeeksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الصفقات الرابحة، آخر 4 أسابيع`)
};

export const api_insights_shared_days_overdue = /** @type {(inputs: Api_Insights_Shared_Days_OverdueInputs) => LocalizedString} */ (i) => {
	const daysPlural = __paraglideRegistry.plural("ar", i?.days, {}, true);
	if (daysPlural === "zero") return /** @type {LocalizedString} */ (`غير متأخر`);
	if (daysPlural === "one") return /** @type {LocalizedString} */ (`متأخر يومًا واحدًا`);
	if (daysPlural === "two") return /** @type {LocalizedString} */ (`متأخر يومين`);
	if (daysPlural === "few") return /** @type {LocalizedString} */ (`متأخر ${__paraglideRegistry.icuPound("ar", i?.days, {})} أيام`);
	if (daysPlural === "many") return /** @type {LocalizedString} */ (`متأخر ${__paraglideRegistry.icuPound("ar", i?.days, {})} يومًا`);
	return /** @type {LocalizedString} */ (`متأخر ${__paraglideRegistry.icuPound("ar", i?.days, {})} يوم`)
};

export const api_insights_shared_in_days = /** @type {(inputs: Api_Insights_Shared_In_DaysInputs) => LocalizedString} */ (i) => {
	const daysPlural = __paraglideRegistry.plural("ar", i?.days, {}, true);
	if (daysPlural === "zero") return /** @type {LocalizedString} */ (`اليوم`);
	if (daysPlural === "one") return /** @type {LocalizedString} */ (`بعد يوم واحد`);
	if (daysPlural === "two") return /** @type {LocalizedString} */ (`بعد يومين`);
	if (daysPlural === "few") return /** @type {LocalizedString} */ (`بعد ${__paraglideRegistry.icuPound("ar", i?.days, {})} أيام`);
	if (daysPlural === "many") return /** @type {LocalizedString} */ (`بعد ${__paraglideRegistry.icuPound("ar", i?.days, {})} يومًا`);
	return /** @type {LocalizedString} */ (`بعد ${__paraglideRegistry.icuPound("ar", i?.days, {})} يوم`)
};

export const api_insights_shared_not_allowed = /** @type {(inputs: Api_Insights_Shared_Not_AllowedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`غير مسموح لك بتنفيذ هذا الإجراء.`)
};

export const api_insights_shared_overdue_since = /** @type {(inputs: Api_Insights_Shared_Overdue_SinceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`متأخر منذ ${i?.time}`)
};

export const api_insights_shared_today = /** @type {(inputs: Api_Insights_Shared_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اليوم`)
};

export const api_insights_shared_today_at = /** @type {(inputs: Api_Insights_Shared_Today_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`اليوم ${i?.time}`)
};

export const api_insights_shared_tomorrow = /** @type {(inputs: Api_Insights_Shared_TomorrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`غدًا`)
};

export const api_insights_shared_tomorrow_at = /** @type {(inputs: Api_Insights_Shared_Tomorrow_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`غدًا ${i?.time}`)
};

export const api_operations_already_accepted = /** @type {(inputs: Api_Operations_Already_AcceptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مقبولة بالفعل، ولم يُعَد إرسالها.`)
};

export const api_operations_amend_activity = /** @type {(inputs: Api_Operations_Amend_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أمر الشراء ${i?.number} البند ${i?.line} (${i?.field}): ${i?.resolution}، والدليل مرفق.`)
};

export const api_operations_as_quoted = /** @type {(inputs: Api_Operations_As_QuotedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كما في العرض`)
};

export const api_operations_attach_confirmation = /** @type {(inputs: Api_Operations_Attach_ConfirmationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أرفق تأكيد العميل الكتابي (بريد إلكتروني أو تعديل موقّع).`)
};

export const api_operations_award_undo_activity = /** @type {(inputs: Api_Operations_Award_Undo_ActivityInputs) => LocalizedString} */ (i) => {
	if (i?.hasWas === "yes") return /** @type {LocalizedString} */ (`البند ${i?.line}: تم التراجع عن «${i?.outcome}»، ${i?.was}.`);
	return /** @type {LocalizedString} */ (`البند ${i?.line}: تم التراجع عن «${i?.outcome}»، وأصبح غير محسوم من جديد.`)
};

export const api_operations_back_to_undecided = /** @type {(inputs: Api_Operations_Back_To_UndecidedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يعود البند إلى غير محسوم أو يبقى مفتوحًا.`)
};

export const api_operations_case_not_found = /** @type {(inputs: Api_Operations_Case_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على الملف.`)
};

export const api_operations_closing_needs_reason = /** @type {(inputs: Api_Operations_Closing_Needs_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إغلاق بند غير مُرسى يحتاج إلى سبب.`)
};

export const api_operations_commitment_blocked = /** @type {(inputs: Api_Operations_Commitment_BlockedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الالتزام موقوف`)
};

export const api_operations_commitment_blocked_by = /** @type {(inputs: Api_Operations_Commitment_Blocked_ByInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	const nPlural1 = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "one" && nPlural1 === "one") return /** @type {LocalizedString} */ (`الالتزام موقوف: اختلاف واحد في أمر الشراء يحتاج إلى موافقة العميل الكتابية.`);
	if (nPlural === "two" && nPlural1 === "one") return /** @type {LocalizedString} */ (`الالتزام موقوف: اختلافان في أمر الشراء يحتاج إلى موافقة العميل الكتابية.`);
	if (nPlural === "few" && nPlural1 === "one") return /** @type {LocalizedString} */ (`الالتزام موقوف: ${i?.n} اختلافات في أمر الشراء يحتاج إلى موافقة العميل الكتابية.`);
	if (nPlural === "many" && nPlural1 === "one") return /** @type {LocalizedString} */ (`الالتزام موقوف: ${i?.n} اختلافًا في أمر الشراء يحتاج إلى موافقة العميل الكتابية.`);
	if (nPlural === "one" && nPlural1 === "two") return /** @type {LocalizedString} */ (`الالتزام موقوف: اختلاف واحد في أمر الشراء يحتاجان إلى موافقة العميل الكتابية.`);
	if (nPlural === "two" && nPlural1 === "two") return /** @type {LocalizedString} */ (`الالتزام موقوف: اختلافان في أمر الشراء يحتاجان إلى موافقة العميل الكتابية.`);
	if (nPlural === "few" && nPlural1 === "two") return /** @type {LocalizedString} */ (`الالتزام موقوف: ${i?.n} اختلافات في أمر الشراء يحتاجان إلى موافقة العميل الكتابية.`);
	if (nPlural === "many" && nPlural1 === "two") return /** @type {LocalizedString} */ (`الالتزام موقوف: ${i?.n} اختلافًا في أمر الشراء يحتاجان إلى موافقة العميل الكتابية.`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`الالتزام موقوف: اختلاف واحد في أمر الشراء تحتاج إلى موافقة العميل الكتابية.`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`الالتزام موقوف: اختلافان في أمر الشراء تحتاج إلى موافقة العميل الكتابية.`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`الالتزام موقوف: ${i?.n} اختلافات في أمر الشراء تحتاج إلى موافقة العميل الكتابية.`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`الالتزام موقوف: ${i?.n} اختلافًا في أمر الشراء تحتاج إلى موافقة العميل الكتابية.`);
	if (nPlural1 === "one") return /** @type {LocalizedString} */ (`الالتزام موقوف: ${i?.n} اختلاف في أمر الشراء يحتاج إلى موافقة العميل الكتابية.`);
	if (nPlural1 === "two") return /** @type {LocalizedString} */ (`الالتزام موقوف: ${i?.n} اختلاف في أمر الشراء يحتاجان إلى موافقة العميل الكتابية.`);
	return /** @type {LocalizedString} */ (`الالتزام موقوف: ${i?.n} اختلاف في أمر الشراء تحتاج إلى موافقة العميل الكتابية.`)
};

export const api_operations_confirm_and_prepare = /** @type {(inputs: Api_Operations_Confirm_And_PrepareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أكّد أمر البيع وجهّز أوامر الشراء للموردين`)
};

export const api_operations_confirm_sales_order = /** @type {(inputs: Api_Operations_Confirm_Sales_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أكّد أمر البيع`)
};

export const api_operations_confirmed_by_phone = /** @type {(inputs: Api_Operations_Confirmed_By_PhoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مؤكد هاتفيًا`)
};

export const api_operations_costs_hidden_sales = /** @type {(inputs: Api_Operations_Costs_Hidden_SalesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تكاليف الموردين غير متاحة لفريق المبيعات.`)
};

export const api_operations_customer_po_not_found = /** @type {(inputs: Api_Operations_Customer_Po_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على أمر شراء العميل.`)
};

export const api_operations_decided_again = /** @type {(inputs: Api_Operations_Decided_AgainInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تقرر البند ${i?.line} من جديد منذ ذلك الحين، ولا يوجد ما يُتراجع عنه.`)
};

export const api_operations_decision_stands = /** @type {(inputs: Api_Operations_Decision_StandsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أمر البيع مؤكد وأوامر الشراء للموردين جاهزة، وقرار البند نافذ.`)
};

export const api_operations_delivered_activity = /** @type {(inputs: Api_Operations_Delivered_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم تسليم ${i?.number}، ووقّعه ${i?.signedBy}، وإذن التسليم الموقّع مرفق.`)
};

export const api_operations_delivery_not_found = /** @type {(inputs: Api_Operations_Delivery_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على التسليم.`)
};

export const api_operations_describe_agreement = /** @type {(inputs: Api_Operations_Describe_AgreementInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صف موافقة العميل الكتابية (من، ومتى، وعلى ماذا).`)
};

export const api_operations_drop_delivered = /** @type {(inputs: Api_Operations_Drop_DeliveredInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`سُلّمت الدفعة ${i?.done} من ${i?.total}. فوترة ${i?.number}، بالكميات المسلّمة فقط`)
};

export const api_operations_einvoice_submitted = /** @type {(inputs: Api_Operations_Einvoice_SubmittedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`وُقّعت ${i?.number} وأُرسلت.`)
};

export const api_operations_einvoice_submitted_activity = /** @type {(inputs: Api_Operations_Einvoice_Submitted_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`وُقّعت الفاتورة الإلكترونية ${i?.number} وأُرسلت إلى مصلحة الضرائب (UUID ${i?.uuid}).`)
};

export const api_operations_einvoice_valid = /** @type {(inputs: Api_Operations_Einvoice_ValidInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مصلحة الضرائب: ${i?.number} صالحة.`)
};

export const api_operations_einvoice_valid_activity = /** @type {(inputs: Api_Operations_Einvoice_Valid_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الفاتورة الإلكترونية ${i?.number}: صالحة (UUID ${i?.uuid}).`)
};

export const api_operations_einvoices_by_finance = /** @type {(inputs: Api_Operations_Einvoices_By_FinanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ترسل العمليات والمالية الفواتير الإلكترونية.`)
};

export const api_operations_eta_change_activity = /** @type {(inputs: Api_Operations_Eta_Change_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تغيير موعد الوصول من ${i?.from}: ${i?.was} ← ${i?.now}. ${i?.email} أُعيد تخطيط: ${i?.moved}، وتم تنبيه المسؤول والإدارة.`)
};

export const api_operations_eta_moved_blocker = /** @type {(inputs: Api_Operations_Eta_Moved_BlockerInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`غيّر الوكيل موعد الوصول ${i?.hours} ساعة، وأُعيد تخطيط لا دفعات`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`غيّر الوكيل موعد الوصول ${i?.hours} ساعة، وأُعيد تخطيط دفعة واحدة`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`غيّر الوكيل موعد الوصول ${i?.hours} ساعة، وأُعيد تخطيط دفعتين`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`غيّر الوكيل موعد الوصول ${i?.hours} ساعة، وأُعيد تخطيط ${i?.n} دفعات`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`غيّر الوكيل موعد الوصول ${i?.hours} ساعة، وأُعيد تخطيط ${i?.n} دفعة`);
	return /** @type {LocalizedString} */ (`غيّر الوكيل موعد الوصول ${i?.hours} ساعة، وأُعيد تخطيط ${i?.n} دفعة`)
};

export const api_operations_eta_notification = /** @type {(inputs: Api_Operations_Eta_NotificationInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تغيير موعد الوصول ${i?.caseId}: ${i?.at}`)
};

export const api_operations_eta_notification_detail = /** @type {(inputs: Api_Operations_Eta_Notification_DetailInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`أُعيد تخطيط لا دفعات، أعد تأكيد النقل.`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`أُعيد تخطيط دفعة واحدة، أعد تأكيد النقل.`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`أُعيد تخطيط دفعتين، أعد تأكيد النقل.`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`أُعيد تخطيط ${i?.n} دفعات، أعد تأكيد النقل.`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`أُعيد تخطيط ${i?.n} دفعة، أعد تأكيد النقل.`);
	return /** @type {LocalizedString} */ (`أُعيد تخطيط ${i?.n} دفعة، أعد تأكيد النقل.`)
};

export const api_operations_eta_up_to_date = /** @type {(inputs: Api_Operations_Eta_Up_To_DateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`موعد الوصول محدّث بالفعل، ولم يُعَد تخطيط شيء.`)
};

export const api_operations_header = /** @type {(inputs: Api_Operations_HeaderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الرأس`)
};

export const api_operations_invoice_created_activity = /** @type {(inputs: Api_Operations_Invoice_Created_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُنشئت الفاتورة ${i?.number} من ${i?.delivery}: بالكميات المسلّمة فقط (${i?.lines}).`)
};

export const api_operations_invoice_delivered = /** @type {(inputs: Api_Operations_Invoice_DeliveredInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`فوترة ${i?.number}، بالكميات المسلّمة فقط`)
};

export const api_operations_invoice_not_found = /** @type {(inputs: Api_Operations_Invoice_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على الفاتورة.`)
};

export const api_operations_invoices_by_finance = /** @type {(inputs: Api_Operations_Invoices_By_FinanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تصدر الفواتير من العمليات والمالية.`)
};

export const api_operations_keep_or_close = /** @type {(inputs: Api_Operations_Keep_Or_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختر إبقاء البند مفتوحًا أو إغلاقه.`)
};

export const api_operations_kept_open_again = /** @type {(inputs: Api_Operations_Kept_Open_AgainInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`البند ${i?.line} مفتوح من جديد`)
};

export const api_operations_launch_boat = /** @type {(inputs: Api_Operations_Launch_BoatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بلنش / قارب`)
};

export const api_operations_launch_rebooked = /** @type {(inputs: Api_Operations_Launch_RebookedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.launch}، أُعيد الحجز في ${i?.at}`)
};

export const api_operations_line = /** @type {(inputs: Api_Operations_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`البند ${i?.n}`)
};

export const api_operations_line_on_po = /** @type {(inputs: Api_Operations_Line_On_PoInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`البند ${i?.line} موجود في أمر شراء العميل، لذا لا يمكن إبقاؤه مفتوحًا أو إغلاقه.`)
};

export const api_operations_no_changes = /** @type {(inputs: Api_Operations_No_ChangesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا تغييرات`)
};

export const api_operations_no_customer_po = /** @type {(inputs: Api_Operations_No_Customer_PoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد أمر شراء من العميل.`)
};

export const api_operations_no_customer_po_yet = /** @type {(inputs: Api_Operations_No_Customer_Po_YetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يُستلم أمر شراء من العميل لهذا الملف بعد.`)
};

export const api_operations_no_eta_update = /** @type {(inputs: Api_Operations_No_Eta_UpdateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد تحديث لموعد الوصول من الوكيل لهذا الملف.`)
};

export const api_operations_no_mismatch = /** @type {(inputs: Api_Operations_No_MismatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد اختلاف في هذا الفحص لمعالجته.`)
};

export const api_operations_no_order_book = /** @type {(inputs: Api_Operations_No_Order_BookInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد سجل طلبات لهذا الملف.`)
};

export const api_operations_not_awarded_activity = /** @type {(inputs: Api_Operations_Not_Awarded_ActivityInputs) => LocalizedString} */ (i) => {
	if (i?.hasReason === "yes") return /** @type {LocalizedString} */ (`البند ${i?.line} غير مُرسى: ${i?.outcome}. السبب: ${i?.reason}.`);
	return /** @type {LocalizedString} */ (`البند ${i?.line} غير مُرسى: ${i?.outcome}.`)
};

export const api_operations_nothing_open = /** @type {(inputs: Api_Operations_Nothing_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا شيء مفتوح`)
};

export const api_operations_only_confirmed_invoiced = /** @type {(inputs: Api_Operations_Only_Confirmed_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يُفوتر إلا تسليم مؤكد بإذن تسليم موقّع.`)
};

export const api_operations_order_confirmed_activity = /** @type {(inputs: Api_Operations_Order_Confirmed_ActivityInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`تم تأكيد أمر البيع مقابل أمر الشراء ${i?.number}. لم يُجهَّز أي أمر شراء للموردين لإعادة المراجعة والموافقة.`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`تم تأكيد أمر البيع مقابل أمر الشراء ${i?.number}. جُهّز أمر شراء واحد لمورّد لإعادة المراجعة والموافقة.`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`تم تأكيد أمر البيع مقابل أمر الشراء ${i?.number}. جُهّز أمرا شراء للموردين لإعادة المراجعة والموافقة.`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`تم تأكيد أمر البيع مقابل أمر الشراء ${i?.number}. جُهّزت ${i?.n} أوامر شراء للموردين لإعادة المراجعة والموافقة.`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`تم تأكيد أمر البيع مقابل أمر الشراء ${i?.number}. جُهّز ${i?.n} أمر شراء للموردين لإعادة المراجعة والموافقة.`);
	return /** @type {LocalizedString} */ (`تم تأكيد أمر البيع مقابل أمر الشراء ${i?.number}. جُهّز ${i?.n} أمر شراء للموردين لإعادة المراجعة والموافقة.`)
};

export const api_operations_po_not_found = /** @type {(inputs: Api_Operations_Po_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على أمر الشراء.`)
};

export const api_operations_po_read_activity = /** @type {(inputs: Api_Operations_Po_Read_ActivityInputs) => LocalizedString} */ (i) => {
	const openPlural = __paraglideRegistry.plural("ar", i?.open, {}, true);
	if (openPlural === "zero") return /** @type {LocalizedString} */ (`قرأ الذكاء الاصطناعي أمر شراء العميل ${i?.number} وطابقه مع عرض سعر ${i?.caseId}: لا اختلافات.`);
	if (openPlural === "one") return /** @type {LocalizedString} */ (`قرأ الذكاء الاصطناعي أمر شراء العميل ${i?.number} وطابقه مع عرض سعر ${i?.caseId}: اختلاف واحد.`);
	if (openPlural === "two") return /** @type {LocalizedString} */ (`قرأ الذكاء الاصطناعي أمر شراء العميل ${i?.number} وطابقه مع عرض سعر ${i?.caseId}: اختلافان.`);
	if (openPlural === "few") return /** @type {LocalizedString} */ (`قرأ الذكاء الاصطناعي أمر شراء العميل ${i?.number} وطابقه مع عرض سعر ${i?.caseId}: ${i?.open} اختلافات.`);
	if (openPlural === "many") return /** @type {LocalizedString} */ (`قرأ الذكاء الاصطناعي أمر شراء العميل ${i?.number} وطابقه مع عرض سعر ${i?.caseId}: ${i?.open} اختلافًا.`);
	return /** @type {LocalizedString} */ (`قرأ الذكاء الاصطناعي أمر شراء العميل ${i?.number} وطابقه مع عرض سعر ${i?.caseId}: ${i?.open} اختلاف.`)
};

export const api_operations_recheck_activity = /** @type {(inputs: Api_Operations_Recheck_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`إعادة المراجعة لـ${i?.number}: ${i?.changes}.`)
};

export const api_operations_recheck_availability = /** @type {(inputs: Api_Operations_Recheck_AvailabilityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التوافر ومدة التوريد`)
};

export const api_operations_recheck_first = /** @type {(inputs: Api_Operations_Recheck_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أعد التحقق من التوفر والتكلفة وسعر الصرف ومدة التوريد مع المورّد قبل التأكيد.`)
};

export const api_operations_recheck_price = /** @type {(inputs: Api_Operations_Recheck_PriceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سعر المورّد`)
};

export const api_operations_recheck_then_approve = /** @type {(inputs: Api_Operations_Recheck_Then_ApproveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أعد مراجعة تكاليف الموردين، ثم وافق على أوامر الشراء`)
};

export const api_operations_reconfirm_task = /** @type {(inputs: Api_Operations_Reconfirm_TaskInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أعد تأكيد الشاحنة وفريق الصعود والبلنش لـ${i?.number} (موعد الوصول ${i?.hours} ساعة)`)
};

export const api_operations_rejected_tax_id = /** @type {(inputs: Api_Operations_Rejected_Tax_IdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`رفضتها مصلحة الضرائب، بسبب الرقم الضريبي للمشتري.`)
};

export const api_operations_resolve_mismatches = /** @type {(inputs: Api_Operations_Resolve_MismatchesInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`عالج اختلافًا واحدًا في أمر الشراء قبل تأكيد أمر البيع`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`عالج اختلافين في أمر الشراء قبل تأكيد أمر البيع`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`عالج ${i?.n} اختلافات في أمر الشراء قبل تأكيد أمر البيع`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`عالج ${i?.n} اختلافًا في أمر الشراء قبل تأكيد أمر البيع`);
	return /** @type {LocalizedString} */ (`عالج ${i?.n} اختلاف في أمر الشراء قبل تأكيد أمر البيع`)
};

export const api_operations_sign_in_first = /** @type {(inputs: Api_Operations_Sign_In_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سجّل الدخول أولًا.`)
};

export const api_operations_submit_einvoice = /** @type {(inputs: Api_Operations_Submit_EinvoiceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أرسل ${i?.number} إلى مصلحة الضرائب (فاتورة إلكترونية)`)
};

export const api_operations_tax_id_error = /** @type {(inputs: Api_Operations_Tax_Id_ErrorInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`رقم التسجيل الضريبي للمشتري «${i?.taxId}» غير موجود (المتوقع 9 أرقام). صحّحه وأعد الإرسال.`)
};

export const api_operations_unchanged = /** @type {(inputs: Api_Operations_UnchangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`دون تغيير`)
};

export const api_operations_undecided_again = /** @type {(inputs: Api_Operations_Undecided_AgainInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`البند ${i?.line} غير محسوم من جديد`)
};

export const api_operations_who_signed = /** @type {(inputs: Api_Operations_Who_SignedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`من وقّع إذن التسليم على متن السفينة؟`)
};

export const api_order_to_cash_approval_detail_clean = /** @type {(inputs: Api_Order_To_Cash_Approval_Detail_CleanInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أمر الشراء ${i?.number} · تمت إعادة المراجعة، دون تغييرات.`)
};

export const api_order_to_cash_approval_detail_flagged = /** @type {(inputs: Api_Order_To_Cash_Approval_Detail_FlaggedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أمر الشراء ${i?.number} · تمت إعادة المراجعة، وتم رصد تغييرات.`)
};

export const api_order_to_cash_approval_title = /** @type {(inputs: Api_Order_To_Cash_Approval_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أمر شراء المورّد ${i?.number} إلى ${i?.supplier}`)
};

export const api_order_to_cash_duplicate_bill = /** @type {(inputs: Api_Order_To_Cash_Duplicate_BillInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`لم تُسجَّل الفاتورة. ${i?.reason}`)
};

export const api_order_to_cash_eta_updated = /** @type {(inputs: Api_Order_To_Cash_Eta_UpdatedInputs) => LocalizedString} */ (i) => {
	const changedPlural = __paraglideRegistry.plural("ar", i?.changed, {}, true);
	if (changedPlural === "one") return /** @type {LocalizedString} */ (`تم تحديث موعد الوصول المتوقع، وأُعيد تخطيط دفعة تسليم واحدة، وتم تنبيه المسؤول والإدارة.`);
	if (changedPlural === "two") return /** @type {LocalizedString} */ (`تم تحديث موعد الوصول المتوقع، وأُعيد تخطيط دفعتي تسليم، وتم تنبيه المسؤول والإدارة.`);
	if (changedPlural === "few") return /** @type {LocalizedString} */ (`تم تحديث موعد الوصول المتوقع، وأُعيد تخطيط ${i?.changed} دفعات تسليم، وتم تنبيه المسؤول والإدارة.`);
	if (changedPlural === "many") return /** @type {LocalizedString} */ (`تم تحديث موعد الوصول المتوقع، وأُعيد تخطيط ${i?.changed} دفعة تسليم، وتم تنبيه المسؤول والإدارة.`);
	return /** @type {LocalizedString} */ (`تم تحديث موعد الوصول المتوقع، وأُعيد تخطيط ${i?.changed} دفعة تسليم، وتم تنبيه المسؤول والإدارة.`)
};

export const api_order_to_cash_invoice_created = /** @type {(inputs: Api_Order_To_Cash_Invoice_CreatedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم إنشاء ${i?.number} من ${i?.delivery}، بالكميات المسلّمة فقط.`)
};

export const api_order_to_cash_invoice_created_from_delivery = /** @type {(inputs: Api_Order_To_Cash_Invoice_Created_From_DeliveryInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم إنشاء ${i?.number} من التسليم، بالكميات المسلّمة فقط.`)
};

export const api_order_to_cash_no_bill = /** @type {(inputs: Api_Order_To_Cash_No_BillInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد فاتورة مورّد لتسجيلها.`)
};

export const api_order_to_cash_notification_title = /** @type {(inputs: Api_Order_To_Cash_Notification_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`وافق على أمر شراء المورّد ${i?.number}`)
};

export const api_order_to_cash_order_confirmed = /** @type {(inputs: Api_Order_To_Cash_Order_ConfirmedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم تأكيد أمر البيع.`)
};

export const api_order_to_cash_order_confirmed_pos = /** @type {(inputs: Api_Order_To_Cash_Order_Confirmed_PosInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم تأكيد أمر البيع · أوامر الشراء للموردين ${i?.pos} جاهزة لإعادة المراجعة والموافقة.`)
};

export const api_order_to_cash_po_checked = /** @type {(inputs: Api_Order_To_Cash_Po_CheckedInputs) => LocalizedString} */ (i) => {
	const openPlural = __paraglideRegistry.plural("ar", i?.open, {}, true);
	const openPluralExact = i?.open;
	if (i?.created === "yes" && (openPluralExact === 0 || openPluralExact === "0")) return /** @type {LocalizedString} */ (`تمت قراءة أمر شراء العميل ومراجعته: كل البنود مطابقة.`);
	if (i?.created === "yes" && openPlural === "one") return /** @type {LocalizedString} */ (`تمت قراءة أمر شراء العميل ومراجعته: اختلاف واحد يمنع الالتزام.`);
	if (i?.created === "yes" && openPlural === "two") return /** @type {LocalizedString} */ (`تمت قراءة أمر شراء العميل ومراجعته: اختلافان يمنعان الالتزام.`);
	if (i?.created === "yes" && openPlural === "few") return /** @type {LocalizedString} */ (`تمت قراءة أمر شراء العميل ومراجعته: ${i?.open} اختلافات تمنع الالتزام.`);
	if (i?.created === "yes" && openPlural === "many") return /** @type {LocalizedString} */ (`تمت قراءة أمر شراء العميل ومراجعته: ${i?.open} اختلافًا يمنع الالتزام.`);
	if (i?.created === "yes") return /** @type {LocalizedString} */ (`تمت قراءة أمر شراء العميل ومراجعته: ${i?.open} اختلاف يمنع الالتزام.`);
	if ((openPluralExact === 0 || openPluralExact === "0")) return /** @type {LocalizedString} */ (`تمت إعادة مراجعة أمر الشراء: كل البنود مطابقة.`);
	if (openPlural === "one") return /** @type {LocalizedString} */ (`تمت إعادة مراجعة أمر الشراء: اختلاف واحد يمنع الالتزام.`);
	if (openPlural === "two") return /** @type {LocalizedString} */ (`تمت إعادة مراجعة أمر الشراء: اختلافان يمنعان الالتزام.`);
	if (openPlural === "few") return /** @type {LocalizedString} */ (`تمت إعادة مراجعة أمر الشراء: ${i?.open} اختلافات تمنع الالتزام.`);
	if (openPlural === "many") return /** @type {LocalizedString} */ (`تمت إعادة مراجعة أمر الشراء: ${i?.open} اختلافًا يمنع الالتزام.`);
	return /** @type {LocalizedString} */ (`تمت إعادة مراجعة أمر الشراء: ${i?.open} اختلاف يمنع الالتزام.`)
};

export const api_order_to_cash_po_not_found = /** @type {(inputs: Api_Order_To_Cash_Po_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على أمر الشراء.`)
};

export const api_platform_acc_1 = /** @type {(inputs: Api_Platform_Acc_1Inputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.caseId}: ${i?.lines} بنود، والمسؤول محدد، وتأكيد الاستلام مسجّل مرة واحدة`)
};

export const api_platform_acc_10_open = /** @type {(inputs: Api_Platform_Acc_10_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يُغلق GS-RFQ-0131 بعد تحصيل رصيده`)
};

export const api_platform_acc_10_settled = /** @type {(inputs: Api_Platform_Acc_10_SettledInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.caseId} مغلق ومسوّى`)
};

export const api_platform_acc_2 = /** @type {(inputs: Api_Platform_Acc_2Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سُجّل تنبيه الانحراف، واستُلم العرض المعدّل نسخةً جديدة`)
};

export const api_platform_acc_3 = /** @type {(inputs: Api_Platform_Acc_3Inputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`البند 3: ${i?.qty} × ${i?.pack} لتر = ${i?.total} لتر`)
};

export const api_platform_acc_4 = /** @type {(inputs: Api_Platform_Acc_4Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Atlas Tankers: عدم المتابعة · تذكير داخلي فقط`)
};

export const api_platform_acc_5 = /** @type {(inputs: Api_Platform_Acc_5Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`GS-RFQ-0136: اختلاف أمر الشراء يوقف أمر البيع`)
};

export const api_platform_acc_6 = /** @type {(inputs: Api_Platform_Acc_6Inputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`GS-RFQ-0133: ${i?.count} تسليمات على طلب واحد`)
};

export const api_platform_acc_7 = /** @type {(inputs: Api_Platform_Acc_7Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الدفعة المقدمة تنتظر الموافقة، وفاتورة GS-RFQ-0131 مسددة جزئيًا`)
};

export const api_platform_acc_8 = /** @type {(inputs: Api_Platform_Acc_8Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تغيير موعد الوصول أعاد تخطيط المهام، وسُجّل تصعيد عدم الرد`)
};

export const api_platform_acc_9 = /** @type {(inputs: Api_Platform_Acc_9Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حُلّ التكرار تلقائيًا، ولكل استثناء مفتاح منع التكرار`)
};

export const api_platform_already_done = /** @type {(inputs: Api_Platform_Already_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الحالة بالفعل ${i?.status}، وتمت مراجعة المفتاح ${i?.key}، ولم يُعَد تشغيل أو إرسال شيء.`)
};

export const api_platform_already_owns = /** @type {(inputs: Api_Platform_Already_OwnsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} مسؤول بالفعل عن ${i?.caseId}.`)
};

export const api_platform_bank_detail_change = /** @type {(inputs: Api_Platform_Bank_Detail_ChangeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تغيير البيانات البنكية`)
};

export const api_platform_case_line = /** @type {(inputs: Api_Platform_Case_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.caseId} البند ${i?.line}: ${i?.description}`)
};

export const api_platform_case_not_found = /** @type {(inputs: Api_Platform_Case_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على الملف.`)
};

export const api_platform_case_record = /** @type {(inputs: Api_Platform_Case_RecordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سجل الملف`)
};

export const api_platform_check_bank_detail = /** @type {(inputs: Api_Platform_Check_Bank_DetailInputs) => LocalizedString} */ (i) => {
	if (i?.on === "yes") return /** @type {LocalizedString} */ (`قاعدة الموافقة «${i?.type}»: قاعدة الشخصين مفعّلة، والموافقون ${i?.approvers}.`);
	return /** @type {LocalizedString} */ (`قاعدة الموافقة «${i?.type}»: قاعدة الشخصين غير مفعّلة، والموافقون ${i?.approvers}.`)
};

export const api_platform_check_bank_two_people = /** @type {(inputs: Api_Platform_Check_Bank_Two_PeopleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تغيير البيانات البنكية يحتاج إلى شخصين (المالية والرئيس التنفيذي)`)
};

export const api_platform_check_sales_costs = /** @type {(inputs: Api_Platform_Check_Sales_CostsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المبيعات لا ترى تكاليف الموردين أبدًا`)
};

export const api_platform_check_sales_costs_detail = /** @type {(inputs: Api_Platform_Check_Sales_Costs_DetailInputs) => LocalizedString} */ (i) => {
	if (i?.hidden === "yes") return /** @type {LocalizedString} */ (`قراءة عرض بصفة ${i?.name}: حقل السعر محذوف بصلاحية الحقول.`);
	return /** @type {LocalizedString} */ (`قراءة عرض بصفة ${i?.name}: حقل السعر ظاهر.`)
};

export const api_platform_clarifications = /** @type {(inputs: Api_Platform_ClarificationsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`لا استيضاحات`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`استيضاح واحد`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`استيضاحان`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${i?.count} استيضاحات`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${i?.count} استيضاحًا`);
	return /** @type {LocalizedString} */ (`${i?.count} استيضاح`)
};

export const api_platform_connection_not_found = /** @type {(inputs: Api_Platform_Connection_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على الاتصال.`)
};

export const api_platform_customer = /** @type {(inputs: Api_Platform_CustomerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العميل`)
};

export const api_platform_deadline_passed = /** @type {(inputs: Api_Platform_Deadline_PassedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.when} (انقضى)`)
};

export const api_platform_deadline_within_24h = /** @type {(inputs: Api_Platform_Deadline_Within_24hInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.when} (خلال 24 ساعة)`)
};

export const api_platform_delivery_note = /** @type {(inputs: Api_Platform_Delivery_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} ${i?.status}، ولا يُحتسب مسلّمًا حتى يتأكد`)
};

export const api_platform_exception_not_found = /** @type {(inputs: Api_Platform_Exception_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على الاستثناء.`)
};

export const api_platform_handed_over = /** @type {(inputs: Api_Platform_Handed_OverInputs) => LocalizedString} */ (i) => {
	const movedPlural = __paraglideRegistry.plural("ar", i?.moved, {}, true);
	const movedPluralExact = i?.moved;
	if ((movedPluralExact === 0 || movedPluralExact === "0")) return /** @type {LocalizedString} */ (`سُلّم ${i?.caseId} إلى ${i?.name} · سُجّلت الملاحظة في السجل الزمني`);
	if (movedPlural === "one") return /** @type {LocalizedString} */ (`سُلّم ${i?.caseId} إلى ${i?.name} · نُقلت مهمة مفتوحة واحدة · سُجّلت الملاحظة في السجل الزمني`);
	if (movedPlural === "two") return /** @type {LocalizedString} */ (`سُلّم ${i?.caseId} إلى ${i?.name} · نُقلت مهمتان مفتوحتان · سُجّلت الملاحظة في السجل الزمني`);
	if (movedPlural === "few") return /** @type {LocalizedString} */ (`سُلّم ${i?.caseId} إلى ${i?.name} · نُقلت ${i?.moved} مهام مفتوحة · سُجّلت الملاحظة في السجل الزمني`);
	if (movedPlural === "many") return /** @type {LocalizedString} */ (`سُلّم ${i?.caseId} إلى ${i?.name} · نُقلت ${i?.moved} مهمة مفتوحة · سُجّلت الملاحظة في السجل الزمني`);
	return /** @type {LocalizedString} */ (`سُلّم ${i?.caseId} إلى ${i?.name} · نُقلت ${i?.moved} مهمة مفتوحة · سُجّلت الملاحظة في السجل الزمني`)
};

export const api_platform_handover_case = /** @type {(inputs: Api_Platform_Handover_CaseInputs) => LocalizedString} */ (i) => {
	if (i?.hasPort === "yes" && i?.hasEta === "yes") return /** @type {LocalizedString} */ (`${i?.customer} · ${i?.vessel}، ${i?.port}، الوصول المتوقع ${i?.eta}. المرحلة: ${i?.stage}. موعد عرض السعر ${i?.due}.`);
	if (i?.hasPort === "yes") return /** @type {LocalizedString} */ (`${i?.customer} · ${i?.vessel}، ${i?.port}. المرحلة: ${i?.stage}. موعد عرض السعر ${i?.due}.`);
	if (i?.hasEta === "yes") return /** @type {LocalizedString} */ (`${i?.customer} · ${i?.vessel}، الوصول المتوقع ${i?.eta}. المرحلة: ${i?.stage}. موعد عرض السعر ${i?.due}.`);
	return /** @type {LocalizedString} */ (`${i?.customer} · ${i?.vessel}. المرحلة: ${i?.stage}. موعد عرض السعر ${i?.due}.`)
};

export const api_platform_handover_check_line = /** @type {(inputs: Api_Platform_Handover_Check_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`راجع البند ${i?.line} (${i?.description}): قرأه الذكاء الاصطناعي بثقة ${i?.pct}%.`)
};

export const api_platform_handover_contact_rule = /** @type {(inputs: Api_Platform_Handover_Contact_RuleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`قاعدة التواصل مع العميل: ${i?.rule}.`)
};

export const api_platform_handover_from = /** @type {(inputs: Api_Platform_Handover_FromInputs) => LocalizedString} */ (i) => {
	const movedPlural = __paraglideRegistry.plural("ar", i?.moved, {}, true);
	const movedPluralExact = i?.moved;
	if ((movedPluralExact === 0 || movedPluralExact === "0")) return /** @type {LocalizedString} */ (`تسليم من ${i?.name}`);
	if (movedPlural === "one") return /** @type {LocalizedString} */ (`تسليم من ${i?.name} · نُقلت إليك مهمة مفتوحة واحدة`);
	if (movedPlural === "two") return /** @type {LocalizedString} */ (`تسليم من ${i?.name} · نُقلت إليك مهمتان مفتوحتان`);
	if (movedPlural === "few") return /** @type {LocalizedString} */ (`تسليم من ${i?.name} · نُقلت إليك ${i?.moved} مهام مفتوحة`);
	if (movedPlural === "many") return /** @type {LocalizedString} */ (`تسليم من ${i?.name} · نُقلت إليك ${i?.moved} مهمة مفتوحة`);
	return /** @type {LocalizedString} */ (`تسليم من ${i?.name} · نُقلت إليك ${i?.moved} مهمة مفتوحة`)
};

export const api_platform_handover_lines = /** @type {(inputs: Api_Platform_Handover_LinesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`البنود: ${i?.ready} جاهزة، و${i?.waiting} بالانتظار، و${i?.blocked} متوقفة، و${i?.noOffer} دون عرض (من ${i?.total}).`)
};

export const api_platform_handover_next = /** @type {(inputs: Api_Platform_Handover_NextInputs) => LocalizedString} */ (i) => {
	if (i?.hasBlocker === "yes") return /** @type {LocalizedString} */ (`التالي: ${i?.next}. العائق: ${i?.blocker}.`);
	return /** @type {LocalizedString} */ (`التالي: ${i?.next}.`)
};

export const api_platform_handover_question = /** @type {(inputs: Api_Platform_Handover_QuestionInputs) => LocalizedString} */ (i) => {
	if (i?.hasLine === "yes") return /** @type {LocalizedString} */ (`سؤال مفتوح (البند ${i?.line}) إلى ${i?.to}: ${i?.question}`);
	return /** @type {LocalizedString} */ (`سؤال مفتوح إلى ${i?.to}: ${i?.question}`)
};

export const api_platform_handover_subject = /** @type {(inputs: Api_Platform_Handover_SubjectInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`ملاحظة تسليم ${i?.caseId} إلى ${i?.to}`)
};

export const api_platform_handover_task = /** @type {(inputs: Api_Platform_Handover_TaskInputs) => LocalizedString} */ (i) => {
	if (i?.hasDue === "yes") return /** @type {LocalizedString} */ (`مهمة: ${i?.title}، مستحقة ${i?.due}.`);
	return /** @type {LocalizedString} */ (`مهمة: ${i?.title}.`)
};

export const api_platform_handover_title = /** @type {(inputs: Api_Platform_Handover_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تسليم: ${i?.caseId} إلى ${i?.to}`)
};

export const api_platform_invoice_already_accepted = /** @type {(inputs: Api_Platform_Invoice_Already_AcceptedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُعيدت مراجعة ${i?.key}: مقبولة بالفعل لدى مصلحة الضرائب، ولم يُعَد إرسالها.`)
};

export const api_platform_invoice_submitted_once = /** @type {(inputs: Api_Platform_Invoice_Submitted_OnceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُعيدت مراجعة ${i?.key}: لم تُقبل بعد لدى مصلحة الضرائب ← وُقّعت وأُرسلت مرة واحدة. الحالة: صالحة.`)
};

export const api_platform_language_saved = /** @type {(inputs: Api_Platform_Language_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم حفظ إعدادات اللغة`)
};

export const api_platform_low_confidence = /** @type {(inputs: Api_Platform_Low_ConfidenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ثقة استخراج منخفضة`)
};

export const api_platform_mailbox_rechecked = /** @type {(inputs: Api_Platform_Mailbox_RecheckedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُعيدت مراجعة ${i?.key}: ${i?.pending} رسالة بالانتظار، و${i?.linked} مستوردة بالفعل ← استُورد ${i?.imported}. لا ملفات أو تأكيدات استلام مكررة.`)
};

export const api_platform_management_permissions = /** @type {(inputs: Api_Platform_Management_PermissionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإدارة فقط تعدّل الصلاحيات.`)
};

export const api_platform_management_rules = /** @type {(inputs: Api_Platform_Management_RulesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإدارة فقط توقف القواعد أو تفعّلها.`)
};

export const api_platform_my_language_ar = /** @type {(inputs: Api_Platform_My_Language_ArInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لغة لوحتك: العربية`)
};

export const api_platform_my_language_en = /** @type {(inputs: Api_Platform_My_Language_EnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لغة لوحتك: الإنجليزية`)
};

export const api_platform_needs_a_person = /** @type {(inputs: Api_Platform_Needs_A_PersonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يحتاج هذا الاستثناء إلى شخص يراجعه. راجعه وعلّمه كمُراجَع بدلًا من إعادة المحاولة.`)
};

export const api_platform_no_shift_reason = /** @type {(inputs: Api_Platform_No_Shift_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خارج ساعات العمل ولا توجد مناوبة في الجدول: مباشرة إلى قائمة الاتصال بالمسؤولين.`)
};

export const api_platform_not_yet_shown = /** @type {(inputs: Api_Platform_Not_Yet_ShownInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يُعرض بعد`)
};

export const api_platform_note_required = /** @type {(inputs: Api_Platform_Note_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملاحظة التسليم مطلوبة.`)
};

export const api_platform_office_hours_reason = /** @type {(inputs: Api_Platform_Office_Hours_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ساعات العمل (الأحد–الخميس 08:00–17:00 بتوقيت القاهرة): يتولاه مسؤول الملف وفق قاعدة الإسناد.`)
};

export const api_platform_on_call_detail = /** @type {(inputs: Api_Platform_On_Call_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`محاكاة من صفحة الأدوار والصلاحيات · أكّد الاستلام خلال ${i?.minutes} دقيقة، وإلا يُنبَّه ${i?.next}`)
};

export const api_platform_on_call_title = /** @type {(inputs: Api_Platform_On_Call_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`طلب عرض أسعار عاجل بعد ساعات العمل، وأنت المناوب (${i?.at})`)
};

export const api_platform_on_duty_reason = /** @type {(inputs: Api_Platform_On_Duty_ReasonInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`خارج ساعات العمل: واتساب أو رسالة نصية إلى المناوب، ثم البديل بعد ${i?.minutes} دقيقة، ثم المسؤولون.`)
};

export const api_platform_only_owner_reassigns = /** @type {(inputs: Api_Platform_Only_Owner_ReassignsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يعيد الإسناد إلا المسؤول أو البديل أو مكتب سلسلة التوريد أو الإدارة.`)
};

export const api_platform_open_tasks = /** @type {(inputs: Api_Platform_Open_TasksInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`لا مهام مفتوحة`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`مهمة مفتوحة واحدة`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`مهمتان مفتوحتان`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${i?.count} مهام مفتوحة`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${i?.count} مهمة مفتوحة`);
	return /** @type {LocalizedString} */ (`${i?.count} مهمة مفتوحة`)
};

export const api_platform_pass = /** @type {(inputs: Api_Platform_PassInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ناجح`)
};

export const api_platform_permissions_activity = /** @type {(inputs: Api_Platform_Permissions_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`عُدّلت صلاحيات ${i?.role} في مصفوفة الأدوار والصلاحيات.`)
};

export const api_platform_pick_on_duty = /** @type {(inputs: Api_Platform_Pick_On_DutyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختر المناوب.`)
};

export const api_platform_pick_someone = /** @type {(inputs: Api_Platform_Pick_SomeoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختر شخصًا من الفريق لتسليمه الملف.`)
};

export const api_platform_receipt_note = /** @type {(inputs: Api_Platform_Receipt_NoteInputs) => LocalizedString} */ (i) => {
	if (i?.hasRest === "yes") return /** @type {LocalizedString} */ (`البند ${i?.line}: ${i?.qc}، استُلم ${i?.received} من ${i?.ordered}، والباقي مستحق ${i?.rest}`);
	return /** @type {LocalizedString} */ (`البند ${i?.line}: ${i?.qc}، استُلم ${i?.received} من ${i?.ordered}`)
};

export const api_platform_reconnect_roles = /** @type {(inputs: Api_Platform_Reconnect_RolesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإدارة أو العمليات أو مدير المكتب فقط يعيدون ربط صناديق البريد.`)
};

export const api_platform_reconnected = /** @type {(inputs: Api_Platform_ReconnectedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُعيد ربط ${i?.account}.`)
};

export const api_platform_reconnected_activity = /** @type {(inputs: Api_Platform_Reconnected_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُعيد ربط ${i?.kind} ${i?.account}.`)
};

export const api_platform_reconnected_note = /** @type {(inputs: Api_Platform_Reconnected_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أُعيد الاتصال، واستُوردت الرسائل المنتظرة مرة واحدة لكل منها`)
};

export const api_platform_reconnected_with = /** @type {(inputs: Api_Platform_Reconnected_WithInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُعيد ربط ${i?.account}. ${i?.message}`)
};

export const api_platform_resolved_by_retry = /** @type {(inputs: Api_Platform_Resolved_By_RetryInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.impact}، وحُلّ بإعادة المحاولة الآمنة`)
};

export const api_platform_retried_safely = /** @type {(inputs: Api_Platform_Retried_SafelyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُعيدت المحاولة بأمان: ${i?.message}`)
};

export const api_platform_reviewed_activity = /** @type {(inputs: Api_Platform_Reviewed_ActivityInputs) => LocalizedString} */ (i) => {
	if (i?.hasNote === "yes") return /** @type {LocalizedString} */ (`تمت المراجعة: ${i?.summary}. ${i?.note}`);
	return /** @type {LocalizedString} */ (`تمت المراجعة: ${i?.summary}. أكّد شخص الحقول.`)
};

export const api_platform_role_not_found = /** @type {(inputs: Api_Platform_Role_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على الدور.`)
};

export const api_platform_roster_activity = /** @type {(inputs: Api_Platform_Roster_ActivityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عُدّل جدول المناوبة.`)
};

export const api_platform_roster_editors = /** @type {(inputs: Api_Platform_Roster_EditorsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإدارة ومدير المكتب فقط يعدّلون جدول المناوبة.`)
};

export const api_platform_rule_enabled = /** @type {(inputs: Api_Platform_Rule_EnabledInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`فُعّلت ${i?.name} (مسجّل)`)
};

export const api_platform_rule_enabled_activity = /** @type {(inputs: Api_Platform_Rule_Enabled_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`فُعّلت الأتمتة «${i?.name}».`)
};

export const api_platform_rule_not_found = /** @type {(inputs: Api_Platform_Rule_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على القاعدة.`)
};

export const api_platform_rule_paused = /** @type {(inputs: Api_Platform_Rule_PausedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُوقفت ${i?.name} (مسجّل)`)
};

export const api_platform_rule_paused_activity = /** @type {(inputs: Api_Platform_Rule_Paused_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُوقفت الأتمتة «${i?.name}».`)
};

export const api_platform_runs_at_settlement = /** @type {(inputs: Api_Platform_Runs_At_SettlementInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يُختبر عند التسوية`)
};

export const api_platform_sales = /** @type {(inputs: Api_Platform_SalesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المبيعات`)
};

export const api_platform_senior_contacts = /** @type {(inputs: Api_Platform_Senior_ContactsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المسؤولون`)
};

export const api_platform_settings_management = /** @type {(inputs: Api_Platform_Settings_ManagementInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإدارة فقط تغيّر إعدادات الشركة.`)
};

export const api_platform_shift_not_found = /** @type {(inputs: Api_Platform_Shift_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على المناوبة.`)
};

export const api_platform_sign_in = /** @type {(inputs: Api_Platform_Sign_InInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يُرجى تسجيل الدخول.`)
};

export const api_platform_simulated_activity = /** @type {(inputs: Api_Platform_Simulated_ActivityInputs) => LocalizedString} */ (i) => {
	if (i?.hasBackup === "yes") return /** @type {LocalizedString} */ (`محاكاة طلب عاجل في ${i?.at}: أُرسل تنبيه إلى المناوب ${i?.name}، والبديل ${i?.backup}.`);
	return /** @type {LocalizedString} */ (`محاكاة طلب عاجل في ${i?.at}: أُرسل تنبيه إلى المناوب ${i?.name}.`)
};

export const api_platform_staging_activity = /** @type {(inputs: Api_Platform_Staging_ActivityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حُدّثت النسخة التجريبية من نسخة الليلة الماضية الاحتياطية (البريد والتكاملات معطّلة في النسخة التجريبية).`)
};

export const api_platform_staging_management = /** @type {(inputs: Api_Platform_Staging_ManagementInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإدارة فقط تحدّث النسخة التجريبية.`)
};

export const api_platform_step_rerun = /** @type {(inputs: Api_Platform_Step_RerunInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُعيدت مراجعة ${i?.key}: أُعيد تشغيل الخطوة مرة واحدة.`)
};

export const api_platform_system = /** @type {(inputs: Api_Platform_SystemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النظام`)
};

export const api_platform_system_mailbox = /** @type {(inputs: Api_Platform_System_MailboxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صندوق بريد النظام`)
};

export const api_platform_the_record = /** @type {(inputs: Api_Platform_The_RecordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السجل`)
};

export const api_platform_timeline_entries = /** @type {(inputs: Api_Platform_Timeline_EntriesInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`لا قيود في السجل الزمني`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`قيد واحد في السجل الزمني`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`قيدان في السجل الزمني`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${i?.count} قيود في السجل الزمني`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${i?.count} قيدًا في السجل الزمني`);
	return /** @type {LocalizedString} */ (`${i?.count} قيد في السجل الزمني`)
};

export const api_platform_uncertain_match = /** @type {(inputs: Api_Platform_Uncertain_MatchInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مطابقة غير مؤكدة (${i?.classification})، بانتظار شخص في البريد الوارد`)
};

export const api_platform_unclassified = /** @type {(inputs: Api_Platform_UnclassifiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`غير مصنّف`)
};

export const api_platform_unknown_permission = /** @type {(inputs: Api_Platform_Unknown_PermissionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صلاحية غير معروفة.`)
};

export const api_platform_unknown_setting = /** @type {(inputs: Api_Platform_Unknown_SettingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إعداد غير معروف.`)
};

export const api_platform_valid_time = /** @type {(inputs: Api_Platform_Valid_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أدخل وقتًا صالحًا.`)
};

export const api_platform_you_now_own = /** @type {(inputs: Api_Platform_You_Now_OwnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أصبحت مسؤولًا عن ${i?.caseId}`)
};

export const api_profit_actuals_confirmed = /** @type {(inputs: Api_Profit_Actuals_ConfirmedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم تأكيد التكاليف الفعلية: ${i?.list}.`)
};

export const api_profit_all_charges_confirmed = /** @type {(inputs: Api_Profit_All_Charges_ConfirmedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل رسم مشترك مؤكد مقابل فاتورته.`)
};

export const api_profit_all_paid = /** @type {(inputs: Api_Profit_All_PaidInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`سُدّد الكل (لا توجد تحصيلات مطابقة).`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`سُدّد الكل (تحصيل واحد مطابق).`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`سُدّد الكل (تحصيلان مطابقان).`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`سُدّد الكل (${i?.count} تحصيلات مطابقة).`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`سُدّد الكل (${i?.count} تحصيلًا مطابقًا).`);
	return /** @type {LocalizedString} */ (`سُدّد الكل (${i?.count} تحصيل مطابق).`)
};

export const api_profit_bill = /** @type {(inputs: Api_Profit_BillInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الفاتورة ${i?.number} (${i?.status})`)
};

export const api_profit_bill_held = /** @type {(inputs: Api_Profit_Bill_HeldInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الفاتورة ${i?.number} (${i?.status}: ${i?.reason})`)
};

export const api_profit_bill_number = /** @type {(inputs: Api_Profit_Bill_NumberInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الفاتورة ${i?.number}`)
};

export const api_profit_billed_vs_estimate = /** @type {(inputs: Api_Profit_Billed_Vs_EstimateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.label}: المفوتر ${i?.billed} مقابل تقدير ${i?.estimate}، يُرجى التأكيد`)
};

export const api_profit_cant_close = /** @type {(inputs: Api_Profit_Cant_CloseInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`لا يمكن إغلاق الملف بعد: ${i?.checks}.`)
};

export const api_profit_case_closed_activity = /** @type {(inputs: Api_Profit_Case_Closed_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُغلق الملف، وإجمالي الربح الفعلي ${i?.actual} (${i?.margin}%) مقابل ${i?.expected} متوقع. أُضيفت أسعار الموردين ونتائج الالتزام بالمواعيد إلى سجلات الموردين.`)
};

export const api_profit_case_not_found = /** @type {(inputs: Api_Profit_Case_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على الملف.`)
};

export const api_profit_check_actuals = /** @type {(inputs: Api_Profit_Check_ActualsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التكاليف التقديرية استُبدلت بالفعلية`)
};

export const api_profit_check_bills = /** @type {(inputs: Api_Profit_Check_BillsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فواتير الموردين مطابقة لأوامر الشراء والاستلامات`)
};

export const api_profit_check_claims = /** @type {(inputs: Api_Profit_Check_ClaimsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المطالبات مسوّاة`)
};

export const api_profit_check_deliveries = /** @type {(inputs: Api_Profit_Check_DeliveriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التسليمات موقّعة على متن السفينة`)
};

export const api_profit_check_einvoice = /** @type {(inputs: Api_Profit_Check_EinvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الفواتير مقبولة لدى مصلحة الضرائب (الفاتورة الإلكترونية)`)
};

export const api_profit_check_paid = /** @type {(inputs: Api_Profit_Check_PaidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فواتير العميل مسددة بالكامل`)
};

export const api_profit_claim_line = /** @type {(inputs: Api_Profit_Claim_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`المطالبة ${i?.ref}: ${i?.title}`)
};

export const api_profit_claim_not_found = /** @type {(inputs: Api_Profit_Claim_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على المطالبة.`)
};

export const api_profit_claim_offset = /** @type {(inputs: Api_Profit_Claim_OffsetInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تكلفة الاستبدال مغطاة بإشعار دائن ${i?.creditNote}`)
};

export const api_profit_claim_open = /** @type {(inputs: Api_Profit_Claim_OpenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مفتوحة، مطالب بها من ${i?.against}`)
};

export const api_profit_claim_open_with = /** @type {(inputs: Api_Profit_Claim_Open_WithInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.ref} (${i?.title}): مفتوحة مع ${i?.against}`)
};

export const api_profit_claim_settled_activity = /** @type {(inputs: Api_Profit_Claim_Settled_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`سُوّيت المطالبة ${i?.ref}: سُجّل إشعار دائن ${i?.creditNote} بقيمة ${i?.amount}.`)
};

export const api_profit_claim_settled_by = /** @type {(inputs: Api_Profit_Claim_Settled_ByInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.ref} (${i?.title}): سُوّيت بإشعار دائن ${i?.creditNote}`)
};

export const api_profit_confirm_actuals = /** @type {(inputs: Api_Profit_Confirm_ActualsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تأكيد التكاليف الفعلية`)
};

export const api_profit_confirmed_on_pricing = /** @type {(inputs: Api_Profit_Confirmed_On_PricingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مؤكد في تبويب التسعير`)
};

export const api_profit_estimate = /** @type {(inputs: Api_Profit_EstimateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تقدير`)
};

export const api_profit_finance_only = /** @type {(inputs: Api_Profit_Finance_OnlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإدارة والمالية فقط تسجّلان التحصيلات والإشعارات الدائنة وإغلاق الملفات.`)
};

export const api_profit_hidden_from_sales = /** @type {(inputs: Api_Profit_Hidden_From_SalesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأرباح والتكاليف وهوامش الربح غير متاحة لفريق المبيعات.`)
};

export const api_profit_no_bill_yet = /** @type {(inputs: Api_Profit_No_Bill_YetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد فاتورة مورّد بعد`)
};

export const api_profit_no_claims = /** @type {(inputs: Api_Profit_No_ClaimsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد مطالبات على هذا الملف.`)
};

export const api_profit_no_delivery = /** @type {(inputs: Api_Profit_No_DeliveryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يُسجَّل أي تسليم بعد.`)
};

export const api_profit_no_invoice = /** @type {(inputs: Api_Profit_No_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم تصدر فاتورة للعميل بعد.`)
};

export const api_profit_no_po_or_bill = /** @type {(inputs: Api_Profit_No_Po_Or_BillInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يُسجَّل أمر شراء أو فاتورة مورّد لهذا الملف بعد.`)
};

export const api_profit_no_single_balance = /** @type {(inputs: Api_Profit_No_Single_BalanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد رصيد فاتورة مفتوح واحد لتسجيله.`)
};

export const api_profit_none_case_closed = /** @type {(inputs: Api_Profit_None_Case_ClosedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا شيء، الملف مغلق`)
};

export const api_profit_not_applicable = /** @type {(inputs: Api_Profit_Not_ApplicableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا ينطبق`)
};

export const api_profit_not_invoiced_today = /** @type {(inputs: Api_Profit_Not_Invoiced_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم تصدر فاتورة بعد، بسعر اليوم`)
};

export const api_profit_open = /** @type {(inputs: Api_Profit_OpenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number}: ${i?.amount} مستحق`)
};

export const api_profit_open_balance_today = /** @type {(inputs: Api_Profit_Open_Balance_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الرصيد المفتوح بسعر اليوم`)
};

export const api_profit_open_due = /** @type {(inputs: Api_Profit_Open_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number}: ${i?.amount} مستحق، الاستحقاق ${i?.due}`)
};

export const api_profit_po = /** @type {(inputs: Api_Profit_PoInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أمر الشراء ${i?.number}`)
};

export const api_profit_po_line = /** @type {(inputs: Api_Profit_Po_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier}: أمر الشراء ${i?.number}`)
};

export const api_profit_receipt = /** @type {(inputs: Api_Profit_ReceiptInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`التحصيل ${i?.reference}`)
};

export const api_profit_receipt_on = /** @type {(inputs: Api_Profit_Receipt_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`التحصيل ${i?.reference} · ${i?.day}`)
};

export const api_profit_record_credit_note = /** @type {(inputs: Api_Profit_Record_Credit_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسجيل إشعار دائن`)
};

export const api_profit_record_receipt = /** @type {(inputs: Api_Profit_Record_ReceiptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسجيل تحصيل`)
};

export const api_profit_signed_by = /** @type {(inputs: Api_Profit_Signed_ByInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`وقّعها ${i?.who}`)
};

export const api_profit_signed_by_vessel = /** @type {(inputs: Api_Profit_Signed_By_VesselInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`وقّعتها السفينة`)
};

export const api_profit_still_estimate = /** @type {(inputs: Api_Profit_Still_EstimateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.label}: ما زال تقديرًا (${i?.estimate})`)
};

export const api_quotations_decision_recorded = /** @type {(inputs: Api_Quotations_Decision_RecordedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم تسجيل القرار: ${i?.decision}.`)
};

export const api_quotations_entered_in_portal = /** @type {(inputs: Api_Quotations_Entered_In_PortalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم تسجيل ${i?.number} على أنه أُدخل في البوابة.`)
};

export const api_quotations_give_lost_reason = /** @type {(inputs: Api_Quotations_Give_Lost_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اذكر سبب الخسارة.`)
};

export const api_quotations_new_version = /** @type {(inputs: Api_Quotations_New_VersionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم إنشاء نسخة جديدة، والنسخة السابقة محفوظة للمراجعة.`)
};

export const api_quotations_sent_to = /** @type {(inputs: Api_Quotations_Sent_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم إرسال ${i?.number} إلى ${i?.to}.`)
};

export const api_service_sign_in = /** @type {(inputs: Api_Service_Sign_InInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يُرجى تسجيل الدخول.`)
};

export const api_sourcing_a_person = /** @type {(inputs: Api_Sourcing_A_PersonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`شخص`)
};

export const api_sourcing_ack_already_activity = /** @type {(inputs: Api_Sourcing_Ack_Already_ActivityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أُكّد الاستلام سابقًا، فلا تأكيد ثانٍ.`)
};

export const api_sourcing_ack_by_hand_activity = /** @type {(inputs: Api_Sourcing_Ack_By_Hand_ActivityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يرسل المسؤول تأكيد الاستلام يدويًا (المصدر واتساب / هاتف).`)
};

export const api_sourcing_ack_default_body = /** @type {(inputs: Api_Sourcing_Ack_Default_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عزيزي {{contact}}،

شكرًا لكم، سُجّل طلبكم لـ{{vessel}} برقم {{caseId}}. سنرد عليكم قبل {{dueAt}}.`)
};

export const api_sourcing_ack_default_subject = /** @type {(inputs: Api_Sourcing_Ack_Default_SubjectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استلمنا طلب عرض الأسعار {{customerRef}}`)
};

export const api_sourcing_ack_footer = /** @type {(inputs: Api_Sourcing_Ack_FooterInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مسؤول التواصل: ${i?.owner} (البديل ${i?.backup}).

Golden Sea for Trading & Marketing
توريدات بحرية · بورسعيد · السويس · الإسكندرية`)
};

export const api_sourcing_ack_sent_activity = /** @type {(inputs: Api_Sourcing_Ack_Sent_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُرسل تأكيد الاستلام مرة واحدة من القالب المعتمد «${i?.template}».`)
};

export const api_sourcing_already_asked = /** @type {(inputs: Api_Sourcing_Already_AskedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`البند ${i?.line} طُلب بالفعل من ${i?.name}`)
};

export const api_sourcing_already_linked_no_new = /** @type {(inputs: Api_Sourcing_Already_Linked_No_NewInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مرتبطة بالفعل بـ${i?.caseId}، فلا ملف جديد ولا تأكيد استلام ثانٍ`)
};

export const api_sourcing_already_waiting = /** @type {(inputs: Api_Sourcing_Already_WaitingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هذا العنصر ينتظر قرارًا بالفعل.`)
};

export const api_sourcing_auto_created_source = /** @type {(inputs: Api_Sourcing_Auto_Created_SourceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُنشئ تلقائيًا من رد بالبريد على ${i?.reference} (${i?.date})، سعّر ولم يُطلب منه`)
};

export const api_sourcing_back_in_queue = /** @type {(inputs: Api_Sourcing_Back_In_QueueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عادت إلى قائمة المراجعة`)
};

export const api_sourcing_back_to_decision = /** @type {(inputs: Api_Sourcing_Back_To_DecisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عاد بانتظار قرار`)
};

export const api_sourcing_below_threshold = /** @type {(inputs: Api_Sourcing_Below_ThresholdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أقل من 85%، فيؤكد شخص قبل ربط أي شيء`)
};

export const api_sourcing_blocker = /** @type {(inputs: Api_Sourcing_BlockerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`البند ${i?.lines}: ${i?.flag}`)
};

export const api_sourcing_cannot_supply = /** @type {(inputs: Api_Sourcing_Cannot_SupplyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يستطيع التوريد، وتوقفت التذكيرات`)
};

export const api_sourcing_case_already_created = /** @type {(inputs: Api_Sourcing_Case_Already_CreatedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُنشئ الملف ${i?.caseId} من هذه الرسالة من قبل`)
};

export const api_sourcing_case_created = /** @type {(inputs: Api_Sourcing_Case_CreatedInputs) => LocalizedString} */ (i) => {
	if (i?.ack === "sent") return /** @type {LocalizedString} */ (`أُنشئ الملف ${i?.caseId} · أُرسل تأكيد الاستلام مرة واحدة`);
	if (i?.ack === "manual") return /** @type {LocalizedString} */ (`أُنشئ الملف ${i?.caseId} · أكّد الاستلام يدويًا`);
	return /** @type {LocalizedString} */ (`أُنشئ الملف ${i?.caseId} · أُكّد الاستلام سابقًا`)
};

export const api_sourcing_case_not_found = /** @type {(inputs: Api_Sourcing_Case_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على الملف.`)
};

export const api_sourcing_case_number_on_creation = /** @type {(inputs: Api_Sourcing_Case_Number_On_CreationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`(رقم الملف عند إنشائه)`)
};

export const api_sourcing_cash_terms = /** @type {(inputs: Api_Sourcing_Cash_TermsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نقدًا`)
};

export const api_sourcing_created_activity = /** @type {(inputs: Api_Sourcing_Created_ActivityInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`أُنشئ من ${i?.channel} «${i?.subject}»، وراجع ${i?.who} وأكّد بندًا واحدًا استخرجه الذكاء الاصطناعي.`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`أُنشئ من ${i?.channel} «${i?.subject}»، وراجع ${i?.who} وأكّد بندين استخرجهما الذكاء الاصطناعي.`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`أُنشئ من ${i?.channel} «${i?.subject}»، وراجع ${i?.who} وأكّد ${i?.count} بنود استخرجها الذكاء الاصطناعي.`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`أُنشئ من ${i?.channel} «${i?.subject}»، وراجع ${i?.who} وأكّد ${i?.count} بندًا استخرجها الذكاء الاصطناعي.`);
	return /** @type {LocalizedString} */ (`أُنشئ من ${i?.channel} «${i?.subject}»، وراجع ${i?.who} وأكّد ${i?.count} بند استخرجها الذكاء الاصطناعي.`)
};

export const api_sourcing_customer_ref_is = /** @type {(inputs: Api_Sourcing_Customer_Ref_IsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مرجع العميل ${i?.ref} = ${i?.caseId}`)
};

export const api_sourcing_declined_event = /** @type {(inputs: Api_Sourcing_Declined_EventInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اعتذر بالبريد، وتوقفت التذكيرات`)
};

export const api_sourcing_desk_only = /** @type {(inputs: Api_Sourcing_Desk_OnlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سلسلة التوريد والإدارة فقط يمكنهما القيام بذلك.`)
};

export const api_sourcing_draft_gone = /** @type {(inputs: Api_Sourcing_Draft_GoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هذه المسودة لم تعد موجودة.`)
};

export const api_sourcing_drafts_back = /** @type {(inputs: Api_Sourcing_Drafts_BackInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`عادت مسودة واحدة، ولم يُرسل شيء`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`عادت مسودتان، ولم يُرسل شيء`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`عادت ${i?.count} مسودات، ولم يُرسل شيء`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`عادت ${i?.count} مسودة، ولم يُرسل شيء`);
	return /** @type {LocalizedString} */ (`عادت ${i?.count} مسودة، ولم يُرسل شيء`)
};

export const api_sourcing_drafts_changed = /** @type {(inputs: Api_Sourcing_Drafts_ChangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تغيّرت المسودات منذ ذلك الحين (أُعيدت صياغتها أو أُرسلت)، فلا يوجد ما يُعاد.`)
};

export const api_sourcing_drafts_ready = /** @type {(inputs: Api_Sourcing_Drafts_ReadyInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`مسودة طلب عرض أسعار واحدة جاهزة، راجعها قبل الإرسال`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`مسودتا طلب عرض أسعار جاهزتان، راجعها قبل الإرسال`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${i?.count} مسودات طلبات عروض أسعار جاهزة، راجعها قبل الإرسال`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${i?.count} مسودة طلب عرض أسعار جاهزة، راجعها قبل الإرسال`);
	return /** @type {LocalizedString} */ (`${i?.count} مسودة طلب عرض أسعار جاهزة، راجعها قبل الإرسال`)
};

export const api_sourcing_duplicate_kept = /** @type {(inputs: Api_Sourcing_Duplicate_KeptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مكررة، وتُحفظ مع الأصلية`)
};

export const api_sourcing_duplicate_linked = /** @type {(inputs: Api_Sourcing_Duplicate_LinkedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مكررة، ومرتبطة بالفعل بـ${i?.caseId}`)
};

export const api_sourcing_escalated_to = /** @type {(inputs: Api_Sourcing_Escalated_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`صُعّد إلى ${i?.name}`)
};

export const api_sourcing_for_vessel = /** @type {(inputs: Api_Sourcing_For_VesselInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`لـ${i?.vessel}`)
};

export const api_sourcing_forwarded_by_staff = /** @type {(inputs: Api_Sourcing_Forwarded_By_StaffInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يحوّلها الموظفون`)
};

export const api_sourcing_general_full = /** @type {(inputs: Api_Sourcing_General_FullInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مورّد عام، يستلم القائمة كاملة`)
};

export const api_sourcing_held_back = /** @type {(inputs: Api_Sourcing_Held_BackInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`محجوزة حتى الاستيضاح: ${i?.lines}`)
};

export const api_sourcing_history_approved_activity = /** @type {(inputs: Api_Sourcing_History_Approved_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`وافق ${i?.name} على استيراد سجل البريد: ${i?.customers} عميلًا، و${i?.vessels} سفينة، و${i?.suppliers} مورّدًا، و${i?.prices} سعرًا مؤرخًا (${i?.saved} أسعار نموذجية كُتبت في العرض التجريبي).`)
};

export const api_sourcing_history_ready = /** @type {(inputs: Api_Sourcing_History_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سجل البريد جاهز لموافقتك`)
};

export const api_sourcing_history_ready_detail = /** @type {(inputs: Api_Sourcing_History_Ready_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.customers} عميلًا، و${i?.vessels} سفينة، و${i?.suppliers} مورّدًا، و${i?.prices} سعرًا مؤرخًا · ${i?.uncertain} عناصر غير مؤكدة للمراجعة`)
};

export const api_sourcing_identical_attachments = /** @type {(inputs: Api_Sourcing_Identical_AttachmentsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مرفقات مطابقة (${i?.hash}…) لرسالة «${i?.subject}» المستلمة ${i?.at}`)
};

export const api_sourcing_import_approved = /** @type {(inputs: Api_Sourcing_Import_ApprovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الاستيراد معتمد ومحفوظ، ولا يمكن التراجع عن قراراته.`)
};

export const api_sourcing_invited_on_many = /** @type {(inputs: Api_Sourcing_Invited_On_ManyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`دُعي في ${i?.count} ملفات مفتوحة، ولا يمكن تحديد أيها`)
};

export const api_sourcing_lines_offered = /** @type {(inputs: Api_Sourcing_Lines_OfferedInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "one" && i?.changed === "yes") return /** @type {LocalizedString} */ (`عُرض بند واحد · تغيّر الموضوع وطوبق بالمرجع`);
	if (countPlural === "two" && i?.changed === "yes") return /** @type {LocalizedString} */ (`عُرض بندان · تغيّر الموضوع وطوبق بالمرجع`);
	if (countPlural === "few" && i?.changed === "yes") return /** @type {LocalizedString} */ (`عُرضت ${i?.count} بنود · تغيّر الموضوع وطوبق بالمرجع`);
	if (countPlural === "many" && i?.changed === "yes") return /** @type {LocalizedString} */ (`عُرض ${i?.count} بندًا · تغيّر الموضوع وطوبق بالمرجع`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`عُرض بند واحد`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`عُرض بندان`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`عُرضت ${i?.count} بنود`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`عُرض ${i?.count} بندًا`);
	if (i?.changed === "yes") return /** @type {LocalizedString} */ (`عُرض ${i?.count} بند · تغيّر الموضوع وطوبق بالمرجع`);
	return /** @type {LocalizedString} */ (`عُرض ${i?.count} بند`)
};

export const api_sourcing_linked_activity = /** @type {(inputs: Api_Sourcing_Linked_ActivityInputs) => LocalizedString} */ (i) => {
	if (i?.offer === "yes") return /** @type {LocalizedString} */ (`ربط ${i?.who} رسالة «${i?.subject}» من ${i?.from} بعد المراجعة، وتأكّد العرض.`);
	return /** @type {LocalizedString} */ (`ربط ${i?.who} رسالة «${i?.subject}» من ${i?.from} بعد المراجعة.`)
};

export const api_sourcing_linked_after_review_event = /** @type {(inputs: Api_Sourcing_Linked_After_Review_EventInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`رُبط الرد بعد المراجعة`)
};

export const api_sourcing_management_approves = /** @type {(inputs: Api_Sourcing_Management_ApprovesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإدارة فقط توافق على استيراد السجل.`)
};

export const api_sourcing_matched_to = /** @type {(inputs: Api_Sourcing_Matched_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`طوبقت مع ${i?.caseId} بالمرجع ${i?.reference} (${i?.pct})`)
};

export const api_sourcing_message_not_found = /** @type {(inputs: Api_Sourcing_Message_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على الرسالة.`)
};

export const api_sourcing_model = /** @type {(inputs: Api_Sourcing_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`gs-extract (نموذج تجريبي) · قارئ صور وجداول`)
};

export const api_sourcing_needs_clarification = /** @type {(inputs: Api_Sourcing_Needs_ClarificationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يحتاج إلى استيضاح أولًا`)
};

export const api_sourcing_new_case_assigned = /** @type {(inputs: Api_Sourcing_New_Case_AssignedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُسند إليك ملف جديد ${i?.caseId}`)
};

export const api_sourcing_new_case_detail = /** @type {(inputs: Api_Sourcing_New_Case_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.customer} · ${i?.vessel} · موعد عرض السعر ${i?.due}`)
};

export const api_sourcing_new_supplier_activity = /** @type {(inputs: Api_Sourcing_New_Supplier_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`رد المورّد الجديد ${i?.name} على ${i?.reference}، فحُفظ المورّد والسعر المؤرخ تلقائيًا، والوحدة بانتظار شخص.`)
};

export const api_sourcing_new_supplier_confirm = /** @type {(inputs: Api_Sourcing_New_Supplier_ConfirmInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مورّد جديد: أكّد أن الصنف المعروض يطابق البند ${i?.line}.`)
};

export const api_sourcing_new_supplier_created = /** @type {(inputs: Api_Sourcing_New_Supplier_CreatedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`المرسل ${i?.domain} ليس في قائمة الموردين، فأُنشئ مورّد جديد تلقائيًا`)
};

export const api_sourcing_new_supplier_detail = /** @type {(inputs: Api_Sourcing_New_Supplier_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`غير موجود في قاعدة البيانات: أُنشئ المورّد، وحُفظ السعر المؤرخ بصلاحيته، والوحدة بانتظار التأكيد`)
};

export const api_sourcing_new_supplier_saved = /** @type {(inputs: Api_Sourcing_New_Supplier_SavedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`المرسل ${i?.domain} ليس في قائمة الموردين، والمورّد الجديد محفوظ بالفعل تلقائيًا`)
};

export const api_sourcing_no_new_case = /** @type {(inputs: Api_Sourcing_No_New_CaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا ملف جديد ولا تأكيد استلام ثانٍ`)
};

export const api_sourcing_no_reference = /** @type {(inputs: Api_Sourcing_No_ReferenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد مرجع طلب عرض أسعار في الموضوع أو النص`)
};

export const api_sourcing_no_rule = /** @type {(inputs: Api_Sourcing_No_RuleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم تنطبق أي قاعدة، فأنت المسؤول عنه`)
};

export const api_sourcing_no_specialist = /** @type {(inputs: Api_Sourcing_No_SpecialistInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد متخصص مسجّل، مورّد عام`)
};

export const api_sourcing_none_waiting = /** @type {(inputs: Api_Sourcing_None_WaitingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد طلبات عروض أسعار تنتظر ردًا.`)
};

export const api_sourcing_not_filed_by_review = /** @type {(inputs: Api_Sourcing_Not_Filed_By_ReviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هذه الرسالة لم تُصنَّف بمراجعة، فلا يوجد ما يُتراجع عنه.`)
};

export const api_sourcing_not_history_item = /** @type {(inputs: Api_Sourcing_Not_History_ItemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ليس عنصرًا من السجل.`)
};

export const api_sourcing_not_invited_event = /** @type {(inputs: Api_Sourcing_Not_Invited_EventInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`لم يُدعَ، ورد على ${i?.reference} المحوّل إليه، فأُنشئ المورّد تلقائيًا`)
};

export const api_sourcing_nothing_extracted = /** @type {(inputs: Api_Sourcing_Nothing_ExtractedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يُستخرج شيء من هذه الرسالة بعد.`)
};

export const api_sourcing_nothing_new = /** @type {(inputs: Api_Sourcing_Nothing_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا جديد للإرسال، فكل البنود المختارة طُلبت بالفعل من هؤلاء الموردين`)
};

export const api_sourcing_nothing_to_send = /** @type {(inputs: Api_Sourcing_Nothing_To_SendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد ما يُرسل، صِغ طلبات العروض أولًا.`)
};

export const api_sourcing_offer_received_event = /** @type {(inputs: Api_Sourcing_Offer_Received_EventInputs) => LocalizedString} */ (i) => {
	if (i?.changed === "yes") return /** @type {LocalizedString} */ (`استُلم العرض (الموضوع «${i?.subject}»)، وطوبق بالمرجع، وتوقفت التذكيرات`);
	return /** @type {LocalizedString} */ (`استُلم العرض، وطوبق بالمرجع، وتوقفت التذكيرات`)
};

export const api_sourcing_offers_captured = /** @type {(inputs: Api_Sourcing_Offers_CapturedInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`سُجّل بند عرض واحد من الرد على ${i?.reference}، وحُفظت الأسعار المؤرخة في سجل المورّد.`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`سُجّل بندا عرض من الرد على ${i?.reference}، وحُفظت الأسعار المؤرخة في سجل المورّد.`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`سُجّلت ${i?.count} بنود عرض من الرد على ${i?.reference}، وحُفظت الأسعار المؤرخة في سجل المورّد.`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`سُجّل ${i?.count} بند عرض من الرد على ${i?.reference}، وحُفظت الأسعار المؤرخة في سجل المورّد.`);
	return /** @type {LocalizedString} */ (`سُجّل ${i?.count} بند عرض من الرد على ${i?.reference}، وحُفظت الأسعار المؤرخة في سجل المورّد.`)
};

export const api_sourcing_only_decider = /** @type {(inputs: Api_Sourcing_Only_DeciderInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`قرّر ${i?.name} في هذا العنصر، ولا يتراجع عنه غيره.`)
};

export const api_sourcing_only_filer = /** @type {(inputs: Api_Sourcing_Only_FilerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`صنّف ${i?.name} هذه الرسالة، ولا يتراجع عنها غيره.`)
};

export const api_sourcing_organise_first = /** @type {(inputs: Api_Sourcing_Organise_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نظّم السجل أولًا.`)
};

export const api_sourcing_original_not_case = /** @type {(inputs: Api_Sourcing_Original_Not_CaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الرسالة الأصلية ليست ملفًا بعد، فعالجها هي، وتُحفظ هذه النسخة معها`)
};

export const api_sourcing_original_text = /** @type {(inputs: Api_Sourcing_Original_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.text} · المصدر: ${i?.source}`)
};

export const api_sourcing_pending_items = /** @type {(inputs: Api_Sourcing_Pending_ItemsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`عنصر واحد غير مؤكد ما زال يحتاج إلى قرار.`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`عنصران غير مؤكدين ما زالا يحتاجان إلى قرار.`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${i?.count} عناصر غير مؤكدة ما زالت تحتاج إلى قرار.`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${i?.count} عنصرًا غير مؤكد ما زال يحتاج إلى قرار.`);
	return /** @type {LocalizedString} */ (`${i?.count} عنصر غير مؤكد ما زال يحتاج إلى قرار.`)
};

export const api_sourcing_per_kg_uncertain = /** @type {(inputs: Api_Sourcing_Per_Kg_UncertainInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`سعّر «${i?.price} جنيه»، وقُرئ للكيلوجرام، وحُوّل إلى ${i?.converted} لكل عبوة ${i?.pack} كجم. أكّد الوحدة.`)
};

export const api_sourcing_pick_case = /** @type {(inputs: Api_Sourcing_Pick_CaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختر الملف الذي تخصه هذه الرسالة.`)
};

export const api_sourcing_pick_line = /** @type {(inputs: Api_Sourcing_Pick_LineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختر بندًا واحدًا على الأقل.`)
};

export const api_sourcing_price_unit_unclear = /** @type {(inputs: Api_Sourcing_Price_Unit_UnclearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`وحدة السعر غير واضحة، فيؤكد شخص`)
};

export const api_sourcing_ref_in_body = /** @type {(inputs: Api_Sourcing_Ref_In_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`عُثر على المرجع ${i?.ref} في نص الرسالة`)
};

export const api_sourcing_ref_in_subject = /** @type {(inputs: Api_Sourcing_Ref_In_SubjectInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`عُثر على المرجع ${i?.ref} في الموضوع`)
};

export const api_sourcing_reminder_escalated_event = /** @type {(inputs: Api_Sourcing_Reminder_Escalated_EventInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُرسل التذكير ${i?.n}، ولا رد بعد ${i?.after} تذكيرات، فصُعّد إلى مسؤول الملف`)
};

export const api_sourcing_reminder_n_sent = /** @type {(inputs: Api_Sourcing_Reminder_N_SentInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُرسل التذكير ${i?.n}`)
};

export const api_sourcing_reminder_sent_event = /** @type {(inputs: Api_Sourcing_Reminder_Sent_EventInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُرسل التذكير ${i?.n} (قالب معتمد، والعميل مخفي) · التالي بعد 24 ساعة`)
};

export const api_sourcing_reminders_stop = /** @type {(inputs: Api_Sourcing_Reminders_StopInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تتوقف التذكيرات بمجرد رد المورّد.`)
};

export const api_sourcing_reopened_activity = /** @type {(inputs: Api_Sourcing_Reopened_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أعاد ${i?.who} رسالة «${i?.subject}» من ${i?.from} إلى قائمة المراجعة.`)
};

export const api_sourcing_reply_counted = /** @type {(inputs: Api_Sourcing_Reply_CountedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`رد المورّد محسوب بالفعل على الملف، ولا يمكن التراجع عن الربط.`)
};

export const api_sourcing_reply_matched_event = /** @type {(inputs: Api_Sourcing_Reply_Matched_EventInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`طوبق الرد بالمرجع (الموضوع «${i?.subject}»)، وتوقفت التذكيرات`)
};

export const api_sourcing_rfq_alternatives = /** @type {(inputs: Api_Sourcing_Rfq_AlternativesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` (البدائل: اذكر العلامة)`)
};

export const api_sourcing_rfq_best_regards = /** @type {(inputs: Api_Sourcing_Rfq_Best_RegardsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مع خالص التحية،`)
};

export const api_sourcing_rfq_date_below = /** @type {(inputs: Api_Sourcing_Rfq_Date_BelowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التاريخ أدناه`)
};

export const api_sourcing_rfq_dear = /** @type {(inputs: Api_Sourcing_Rfq_DearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السيد المورّد،`)
};

export const api_sourcing_rfq_exact = /** @type {(inputs: Api_Sourcing_Rfq_ExactInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` (العلامة / القطعة نفسها فقط)`)
};

export const api_sourcing_rfq_keep_reference = /** @type {(inputs: Api_Sourcing_Rfq_Keep_ReferenceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`يُرجى الإبقاء على مرجعنا ${i?.reference} في ردكم.`)
};

export const api_sourcing_rfq_not_found = /** @type {(inputs: Api_Sourcing_Rfq_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يتم العثور على طلب عرض الأسعار.`)
};

export const api_sourcing_rfq_part = /** @type {(inputs: Api_Sourcing_Rfq_PartInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (` · القطعة ${i?.part}`)
};

export const api_sourcing_rfq_please_quote = /** @type {(inputs: Api_Sourcing_Rfq_Please_QuoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`يُرجى تسعير ما يلي، تسليم ${i?.port} قبل ${i?.date}:`)
};

export const api_sourcing_rfq_please_state = /** @type {(inputs: Api_Sourcing_Rfq_Please_StateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لكل بند يُرجى ذكر: سعر الوحدة والعملة، والكمية المتاحة، وحجم العبوة، ومدة التوريد، وأساس التسليم، والشحن، والصلاحية، وشروط الدفع، مع إرفاق SDS / TDS / الشهادات.`)
};

export const api_sourcing_rfq_subject = /** @type {(inputs: Api_Sourcing_Rfq_SubjectInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`طلب عرض أسعار ${i?.reference}: الرد قبل ${i?.due}`)
};

export const api_sourcing_rfq_to_port = /** @type {(inputs: Api_Sourcing_Rfq_To_PortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إلى الميناء`)
};

export const api_sourcing_sender_differs = /** @type {(inputs: Api_Sourcing_Sender_DiffersInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أرسلها ${i?.name}، لكن ${i?.reference} أُرسل إلى ${i?.invited}. يتحقق منها شخص قبل احتسابها`)
};

export const api_sourcing_sender_domain = /** @type {(inputs: Api_Sourcing_Sender_DomainInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`نطاق المرسل ${i?.domain} = ${i?.name}`)
};

export const api_sourcing_sender_unknown = /** @type {(inputs: Api_Sourcing_Sender_UnknownInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`المرسل ${i?.sender} ليس في قائمة الموردين، فهو مورّد جديد`)
};

export const api_sourcing_sent_activity = /** @type {(inputs: Api_Sourcing_Sent_ActivityInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`أرسل ${i?.who} طلب عرض أسعار واحدًا للموردين (${i?.mode}، مع إخفاء هوية العميل): ${i?.references}.`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`أرسل ${i?.who} طلبي عرض أسعار للموردين (${i?.mode}، مع إخفاء هوية العميل): ${i?.references}.`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`أرسل ${i?.who} ${i?.count} طلبات عروض أسعار للموردين (${i?.mode}، مع إخفاء هوية العميل): ${i?.references}.`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`أرسل ${i?.who} ${i?.count} طلبًا لعروض الأسعار للموردين (${i?.mode}، مع إخفاء هوية العميل): ${i?.references}.`);
	return /** @type {LocalizedString} */ (`أرسل ${i?.who} ${i?.count} طلب عرض أسعار للموردين (${i?.mode}، مع إخفاء هوية العميل): ${i?.references}.`)
};

export const api_sourcing_sent_event = /** @type {(inputs: Api_Sourcing_Sent_EventInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أُرسل (مع إخفاء هوية العميل) · جُدول التذكير 1`)
};

export const api_sourcing_silent_activity = /** @type {(inputs: Api_Sourcing_Silent_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.reference}: لم يرد ${i?.name} بعد ${i?.after} تذكيرات، فصُعّد إلى المسؤول.`)
};

export const api_sourcing_silent_detail = /** @type {(inputs: Api_Sourcing_Silent_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُرسلت ${i?.after} تذكيرات · موعد عرض سعر ${i?.caseId} ${i?.due}، اتصل بهم أو ورّد من مكان آخر`)
};

export const api_sourcing_silent_title = /** @type {(inputs: Api_Sourcing_Silent_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`لم يرد ${i?.name} على ${i?.reference}`)
};

export const api_sourcing_sir_madam = /** @type {(inputs: Api_Sourcing_Sir_MadamInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السيد / السيدة`)
};

export const api_sourcing_specialist = /** @type {(inputs: Api_Sourcing_SpecialistInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`متخصص في ${i?.category}`)
};

export const api_sourcing_step_draft = /** @type {(inputs: Api_Sourcing_Step_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسودة، لم تُرسل`)
};

export const api_sourcing_step_escalate = /** @type {(inputs: Api_Sourcing_Step_EscalateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التصعيد إلى مسؤول الملف`)
};

export const api_sourcing_step_reminder = /** @type {(inputs: Api_Sourcing_Step_ReminderInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`التذكير ${i?.n}`)
};

export const api_sourcing_step_sent = /** @type {(inputs: Api_Sourcing_Step_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أُرسل`)
};

export const api_sourcing_step_stopped = /** @type {(inputs: Api_Sourcing_Step_StoppedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.status}، وتوقفت التذكيرات`)
};

export const api_sourcing_step_uninvited = /** @type {(inputs: Api_Sourcing_Step_UninvitedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.status} دون دعوة، وطوبق الرد بالمرجع`)
};

export const api_sourcing_subject_changed = /** @type {(inputs: Api_Sourcing_Subject_ChangedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تغيّر الموضوع («${i?.subject}»)، فطوبقت بالمرجع لا بالموضوع`)
};

export const api_sourcing_subject_kept = /** @type {(inputs: Api_Sourcing_Subject_KeptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`موضوع المراسلة كما هو`)
};

export const api_sourcing_supplier = /** @type {(inputs: Api_Sourcing_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المورّد`)
};

export const api_sourcing_supplier_history_source = /** @type {(inputs: Api_Sourcing_Supplier_History_SourceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`استيراد سجل البريد: سعّر ${i?.quoted} بندًا بين 2022 و2025 دون أي طلب`)
};

export const api_sourcing_template_label = /** @type {(inputs: Api_Sourcing_Template_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} · v${i?.version} (معتمد)`)
};

export const api_sourcing_uncertain_review = /** @type {(inputs: Api_Sourcing_Uncertain_ReviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`غير مؤكدة، وأُرسلت إلى قائمة المراجعة`)
};

export const api_sourcing_unclassifiable = /** @type {(inputs: Api_Sourcing_UnclassifiableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا مرجع ولا مراسلة سابقة والمرسل مجهول، فيصنّفها شخص`)
};

export const api_sourcing_vessel_history_note = /** @type {(inputs: Api_Sourcing_Vessel_History_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`وُجدت في سجل البريد: ${i?.calls} زيارة (${i?.ports}).`)
};

export const api_sourcing_was_asked_on = /** @type {(inputs: Api_Sourcing_Was_Asked_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`طُلب من ${i?.name} في ${i?.reference} (${i?.status})`)
};

export const api_sourcing_your_vessel = /** @type {(inputs: Api_Sourcing_Your_VesselInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سفينتكم`)
};

export const api_visuals_arrives = /** @type {(inputs: Api_Visuals_ArrivesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`وصول ${i?.name}`)
};

export const api_visuals_calendar_arrives = /** @type {(inputs: Api_Visuals_Calendar_ArrivesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`وصول · ${i?.name}`)
};

export const api_visuals_calendar_delivery = /** @type {(inputs: Api_Visuals_Calendar_DeliveryInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`التسليم ${i?.number} · ${i?.status}`)
};

export const api_visuals_calendar_invoice_due = /** @type {(inputs: Api_Visuals_Calendar_Invoice_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`استحقاق الفاتورة ${i?.number} · ${i?.customer}`)
};

export const api_visuals_calendar_quote_due = /** @type {(inputs: Api_Visuals_Calendar_Quote_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`موعد عرض السعر · ${i?.name}`)
};

export const api_visuals_days = /** @type {(inputs: Api_Visuals_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} يوم`)
};

export const api_visuals_gp_actual = /** @type {(inputs: Api_Visuals_Gp_ActualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الفعلي`)
};

export const api_visuals_gp_at_quote = /** @type {(inputs: Api_Visuals_Gp_At_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عند عرض السعر`)
};

export const api_visuals_gp_freight = /** @type {(inputs: Api_Visuals_Gp_FreightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الشحن`)
};

export const api_visuals_gp_fx = /** @type {(inputs: Api_Visuals_Gp_FxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فروق العملة`)
};

export const api_visuals_gp_recovered = /** @type {(inputs: Api_Visuals_Gp_RecoveredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المسترد`)
};

export const api_visuals_gp_supplier_prices = /** @type {(inputs: Api_Visuals_Gp_Supplier_PricesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أسعار الموردين`)
};

export const api_visuals_minutes = /** @type {(inputs: Api_Visuals_MinutesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} دقيقة`)
};

export const api_visuals_quote_due = /** @type {(inputs: Api_Visuals_Quote_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name}: موعد عرض السعر`)
};

export const api_visuals_target_acknowledge = /** @type {(inputs: Api_Visuals_Target_AcknowledgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مدة تأكيد الاستلام`)
};

export const api_visuals_target_on_time = /** @type {(inputs: Api_Visuals_Target_On_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التسليمات في موعدها، 6 أسابيع`)
};

export const api_visuals_target_turnaround = /** @type {(inputs: Api_Visuals_Target_TurnaroundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مدة إعداد عرض السعر`)
};

export const api_visuals_target_win_rate = /** @type {(inputs: Api_Visuals_Target_Win_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نسبة الفوز، 12 أسبوعًا`)
};

export const automations_ai_note = /** @type {(inputs: Automations_Ai_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسودات فقط، مع درجة الثقة لكل قيمة`)
};

export const automations_auto_assign = /** @type {(inputs: Automations_Auto_AssignInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تعيين المسؤولين، وتحديث الأحداث المؤكدة، وحساب أوقات الانتظار`)
};

export const automations_auto_calculate = /** @type {(inputs: Automations_Auto_CalculateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حساب التكاليف وتحويلات العملات وهوامش الربح والمقارنات`)
};

export const automations_auto_capture = /** @type {(inputs: Automations_Auto_CaptureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التقاط الرسائل، وربط الملفات، واستخراج مسودات البيانات، ورصد التكرارات المحتملة`)
};

export const automations_auto_prepare = /** @type {(inputs: Automations_Auto_PrepareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تجهيز مسودات عروض الأسعار وأوامر الشراء والفواتير المرتبطة`)
};

export const automations_auto_remind = /** @type {(inputs: Automations_Auto_RemindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إنشاء التذكيرات والتصعيدات ولوحات المتابعة والملخصات اليومية`)
};

export const automations_confirm_heading = /** @type {(inputs: Automations_Confirm_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تعليم كمُراجَع؟`)
};

export const automations_confirm_label = /** @type {(inputs: Automations_Confirm_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تأكيد المراجعة`)
};

export const automations_confirm_text = /** @type {(inputs: Automations_Confirm_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.title}
أكّد أنك راجعت الحقول المعلَّمة في مصدرها. سيُسجَّل اسمك في سجل التدقيق؛ ولا تُطبَّق قيم الذكاء الاصطناعي أبدًا دون ذلك.`)
};

export const automations_enabled_note = /** @type {(inputs: Automations_Enabled_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كلٌّ منها صريح`)
};

export const automations_figure_ai = /** @type {(inputs: Automations_Figure_AiInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بمساعدة الذكاء الاصطناعي`)
};

export const automations_figure_enabled = /** @type {(inputs: Automations_Figure_EnabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`القواعد المفعّلة`)
};

export const automations_mark_reviewed = /** @type {(inputs: Automations_Mark_ReviewedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تعليم كمُراجَع`)
};

export const automations_of_rules = /** @type {(inputs: Automations_Of_RulesInputs) => LocalizedString} */ (i) => {
	const totalPlural = __paraglideRegistry.plural("ar", i?.total, {}, true);
	if (totalPlural === "zero") return /** @type {LocalizedString} */ (`${i?.count} من ${__paraglideRegistry.icuPound("ar", i?.total, {})} قاعدة`);
	if (totalPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} من قاعدة واحدة`);
	if (totalPlural === "two") return /** @type {LocalizedString} */ (`${i?.count} من قاعدتين`);
	if (totalPlural === "few") return /** @type {LocalizedString} */ (`${i?.count} من ${__paraglideRegistry.icuPound("ar", i?.total, {})} قواعد`);
	if (totalPlural === "many") return /** @type {LocalizedString} */ (`${i?.count} من ${__paraglideRegistry.icuPound("ar", i?.total, {})} قاعدة`);
	return /** @type {LocalizedString} */ (`${i?.count} من ${__paraglideRegistry.icuPound("ar", i?.total, {})} قاعدة`)
};

export const automations_open = /** @type {(inputs: Automations_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فتح`)
};

export const automations_people_commitments = /** @type {(inputs: Automations_People_CommitmentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الالتزامات التجارية والقيود المحاسبية والمدفوعات`)
};

export const automations_people_messages = /** @type {(inputs: Automations_People_MessagesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الرسائل الخارجية والمتابعات ما لم تُعتمد مسبقًا صراحةً`)
};

export const automations_people_overrides = /** @type {(inputs: Automations_People_OverridesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تجاوزات المسؤول، وحل الاستثناءات، والإغلاق التقديري`)
};

export const automations_people_prices = /** @type {(inputs: Automations_People_PricesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أسعار البيع النهائية والخصومات والبدائل واختيار المورّد`)
};

export const automations_people_uncertain = /** @type {(inputs: Automations_People_UncertainInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المطابقات غير المؤكدة، والتفسير الفني، والمعلومات الناقصة`)
};

export const automations_review_empty = /** @type {(inputs: Automations_Review_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا شيء بانتظار المراجعة.`)
};

export const automations_review_note = /** @type {(inputs: Automations_Review_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تحت حد الثقة لا يطبّق الذكاء الاصطناعي أي قيمة: يترك الحقل فارغًا أو المطابقة دون ربط، وينتظر هنا شخصًا يراجعها.`)
};

export const automations_reviewed_done = /** @type {(inputs: Automations_Reviewed_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تمت المراجعة، واسمك مسجَّل في سجل التدقيق`)
};

export const case_overview_delivered = /** @type {(inputs: Case_Overview_DeliveredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسلّمة`)
};

export const case_overview_ended = /** @type {(inputs: Case_Overview_EndedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`انتهى الملف هنا: ${i?.next}`)
};

export const case_overview_gauge_a11y = /** @type {(inputs: Case_Overview_Gauge_A11yInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.label}: ${i?.value} من أصل ${i?.total} بند`)
};

export const case_overview_invoiced = /** @type {(inputs: Case_Overview_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مفوترة`)
};

export const case_overview_ordered = /** @type {(inputs: Case_Overview_OrderedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مطلوبة`)
};

export const case_overview_paused = /** @type {(inputs: Case_Overview_PausedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`متوقف عند قرار العميل: ${i?.next}`)
};

export const case_overview_phase = /** @type {(inputs: Case_Overview_PhaseInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`المرحلة ${i?.phase}`)
};

export const case_overview_received = /** @type {(inputs: Case_Overview_ReceivedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مستلمة`)
};

export const case_overview_step = /** @type {(inputs: Case_Overview_StepInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الخطوة ${i?.step} من ${i?.total}`)
};

export const case_overview_summary_context = /** @type {(inputs: Case_Overview_Summary_ContextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سجل نشاط ملف توريد سفن لدى Golden Sea، من طلب عرض الأسعار من العميل حتى الدفع. وضّح أين وصل الملف وما الذي يعطّله.`)
};

export const case_overview_summary_label = /** @type {(inputs: Case_Overview_Summary_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لخّص لي هذا الملف`)
};

export const cash_amount_paid = /** @type {(inputs: Cash_Amount_PaidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المبلغ المدفوع`)
};

export const cash_applied = /** @type {(inputs: Cash_AppliedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مطبَّق`)
};

export const cash_applied_alert = /** @type {(inputs: Cash_Applied_AlertInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`طُبّقت البيانات الجديدة على ${i?.supplier} وتم التحقق منها. يمكن استخدامها في المدفوعات.`)
};

export const cash_apply_bank_details = /** @type {(inputs: Cash_Apply_Bank_DetailsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تطبيق البيانات البنكية الجديدة`)
};

export const cash_apply_details = /** @type {(inputs: Cash_Apply_DetailsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تطبيق البيانات`)
};

export const cash_apply_done = /** @type {(inputs: Cash_Apply_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`طُبّقت البيانات البنكية الجديدة على ${i?.supplier}، وتحقّق منها شخصان.`)
};

export const cash_apply_heading = /** @type {(inputs: Cash_Apply_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تطبيق البيانات البنكية الجديدة على ${i?.supplier}؟`)
};

export const cash_apply_text = /** @type {(inputs: Cash_Apply_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اعتمد شخصان التغيير. من الآن تُحوَّل المدفوعات لهذا المورّد إلى الحساب الجديد.`)
};

export const cash_bank_reference = /** @type {(inputs: Cash_Bank_ReferenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المرجع البنكي`)
};

export const cash_bridge_label = /** @type {(inputs: Cash_Bridge_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النقد، الأسابيع الثمانية القادمة`)
};

export const cash_bridge_note = /** @type {(inputs: Cash_Bridge_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المقبوضات المتوقعة مطروحًا منها مدفوعات الموردين الملتزم بها والتكاليف الثابتة في الموازنة`)
};

export const cash_call_back_on = /** @type {(inputs: Cash_Call_Back_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`معاودة الاتصال على`)
};

export const cash_currency = /** @type {(inputs: Cash_CurrencyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العملة`)
};

export const cash_current_account = /** @type {(inputs: Cash_Current_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الحساب الحالي`)
};

export const cash_fixed_costs = /** @type {(inputs: Cash_Fixed_CostsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التكاليف الثابتة`)
};

export const cash_forecast_label = /** @type {(inputs: Cash_Forecast_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النقد الداخل مقابل الخارج، الأسابيع الثمانية القادمة`)
};

export const cash_forecast_subhead = /** @type {(inputs: Cash_Forecast_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بآلاف الجنيهات (EGP)، أسبوعيًا. المقبوضات حسب تاريخ استحقاق الفاتورة (المتأخر يُحسب هذا الأسبوع، والمتأخرون المزمنون بعد أسبوع)؛ والمدفوعات حسب تواريخ استحقاق الفواتير والأرصدة. الفواتير المعلّقة مستبعدة حتى تتطابق.`)
};

export const cash_forecast_subhead_fixed = /** @type {(inputs: Cash_Forecast_Subhead_FixedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`بآلاف الجنيهات (EGP)، أسبوعيًا. المقبوضات حسب تاريخ استحقاق الفاتورة (المتأخر يُحسب هذا الأسبوع، والمتأخرون المزمنون بعد أسبوع)؛ والمدفوعات حسب تواريخ استحقاق الفواتير والأرصدة، إضافة إلى ${i?.fixed} أسبوعيًا من التكاليف الثابتة في الموازنة. الفواتير المعلّقة مستبعدة حتى تتطابق.`)
};

export const cash_held_alert = /** @type {(inputs: Cash_Held_AlertInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تبقى المدفوعات إلى ${i?.supplier} على الحساب القديم المُتحقَّق منه حتى يعتمد شخصان مختلفان، المالية والرئيس التنفيذي، بعد معاودة الاتصال بالرقم المسجّل.`)
};

export const cash_invoice_numbers = /** @type {(inputs: Cash_Invoice_NumbersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أرقام الفواتير`)
};

export const cash_invoice_numbers_hint = /** @type {(inputs: Cash_Invoice_Numbers_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل رقم فاتورة مذكور، مفصولة بفواصل.`)
};

export const cash_match_prompt = /** @type {(inputs: Cash_Match_PromptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مطابقة إشعار تحويل`)
};

export const cash_net_8_weeks = /** @type {(inputs: Cash_Net_8_WeeksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صافي النقد، 8 أسابيع`)
};

export const cash_net_cash = /** @type {(inputs: Cash_Net_CashInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صافي النقد`)
};

export const cash_net_note = /** @type {(inputs: Cash_Net_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المقبوضات المتوقعة − المدفوعات الملتزم بها − التكاليف الثابتة`)
};

export const cash_never = /** @type {(inputs: Cash_NeverInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`لا تتصل أبدًا على: ${i?.phone}`)
};

export const cash_no_open_invoices = /** @type {(inputs: Cash_No_Open_InvoicesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد فواتير مفتوحة للمطابقة.`)
};

export const cash_on_this_device = /** @type {(inputs: Cash_On_This_DeviceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`على هذا الجهاز`)
};

export const cash_paid_by = /** @type {(inputs: Cash_Paid_ByInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الدافع`)
};

export const cash_read_and_match = /** @type {(inputs: Cash_Read_And_MatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قراءة ومطابقة`)
};

export const cash_receipts = /** @type {(inputs: Cash_ReceiptsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المقبوضات`)
};

export const cash_remittance_placeholder = /** @type {(inputs: Cash_Remittance_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الصق إشعار التحويل أو الدفع…`)
};

export const cash_remittance_text = /** @type {(inputs: Cash_Remittance_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الصق إشعار الدفع أو بريد التحويل من العميل: تُقرأ أرقام الفواتير والمبلغ على هذا الجهاز، ثم تُطابق مع الفواتير المفتوحة (بالرقم، أو برصيد مساوٍ). يسجّل أحد الموظفين الدفعة.`)
};

export const cash_request_came_by = /** @type {(inputs: Cash_Request_Came_ByInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`وصل الطلب عبر`)
};

export const cash_requested = /** @type {(inputs: Cash_RequestedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المطلوب`)
};

export const cash_requested_value = /** @type {(inputs: Cash_Requested_ValueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.bank} · ${i?.iban}`)
};

export const cash_series_in = /** @type {(inputs: Cash_Series_InInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النقد الداخل (المقبوضات المتوقعة)`)
};

export const cash_series_out = /** @type {(inputs: Cash_Series_OutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النقد الخارج (المستحقات للموردين + التكاليف الثابتة)`)
};

export const cash_status_approved = /** @type {(inputs: Cash_Status_ApprovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`معتمد`)
};

export const cash_status_approved_1_of_2 = /** @type {(inputs: Cash_Status_Approved_1_Of_2Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اعتماد 1 من 2`)
};

export const cash_status_pending = /** @type {(inputs: Cash_Status_PendingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قيد الانتظار`)
};

export const cash_status_rejected = /** @type {(inputs: Cash_Status_RejectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مرفوض`)
};

export const cash_step_applied = /** @type {(inputs: Cash_Step_AppliedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التطبيق والتحقق`)
};

export const cash_step_call_back = /** @type {(inputs: Cash_Step_Call_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`معاودة الاتصال بالرقم المسجّل`)
};

export const cash_step_first_approval = /** @type {(inputs: Cash_Step_First_ApprovalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الاعتماد الأول`)
};

export const cash_step_request_received = /** @type {(inputs: Cash_Step_Request_ReceivedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استلام الطلب`)
};

export const cash_step_second_approval = /** @type {(inputs: Cash_Step_Second_ApprovalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الاعتماد الثاني`)
};

export const cash_suppliers = /** @type {(inputs: Cash_SuppliersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الموردون`)
};

export const cash_waiting_for_approver = /** @type {(inputs: Cash_Waiting_For_ApproverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظار المعتمِد.`)
};

export const cash_you_decided = /** @type {(inputs: Cash_You_DecidedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لقد اتخذت قرارك. يجب أن يعتمد شخص ثانٍ مختلف.`)
};

export const commercial_acceptance_done = /** @type {(inputs: Commercial_Acceptance_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`البند ${i?.line}: تم تسجيل موافقة العميل.`)
};

export const commercial_acceptance_text = /** @type {(inputs: Commercial_Acceptance_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`البند ${i?.line} بعبوة بديلة. لا يظهر في عرض السعر كمقبول إلا بتأكيد كتابي من العميل.`)
};

export const commercial_accepted_in_writing = /** @type {(inputs: Commercial_Accepted_In_WritingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`وافق العميل كتابيًا`)
};

export const commercial_all_lines_priced = /** @type {(inputs: Commercial_All_Lines_PricedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل البنود مسعّرة`)
};

export const commercial_allocation_lines = /** @type {(inputs: Commercial_Allocation_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بالتساوي على البنود`)
};

export const commercial_allocation_qty = /** @type {(inputs: Commercial_Allocation_QtyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حسب الكمية`)
};

export const commercial_allocation_value = /** @type {(inputs: Commercial_Allocation_ValueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حسب قيمة البند`)
};

export const commercial_approval_pending = /** @type {(inputs: Commercial_Approval_PendingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.title} · ${i?.status}. يقرر Karim Balbaa من صفحة الاعتمادات.`)
};

export const commercial_approval_requested_done = /** @type {(inputs: Commercial_Approval_Requested_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طُلب الاعتماد من Karim Balbaa. يقرر من صفحة الاعتمادات.`)
};

export const commercial_approval_requested_short = /** @type {(inputs: Commercial_Approval_Requested_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طُلب الاعتماد من Karim Balbaa.`)
};

export const commercial_approval_rule = /** @type {(inputs: Commercial_Approval_RuleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`القاعدة: كل عروض الأسعار للعملاء، والخصومات فوق ${i?.max}%، واستثناءات هامش الربح تذهب إلى Karim Balbaa. وتُرفق الاستثناءات بالطلب.`)
};

export const commercial_approve = /** @type {(inputs: Commercial_ApproveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اعتماد`)
};

export const commercial_approved_done = /** @type {(inputs: Commercial_Approved_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم اعتماد ${i?.number}، ويمكن إرساله`)
};

export const commercial_charge_actual = /** @type {(inputs: Commercial_Charge_ActualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فعلي`)
};

export const commercial_charge_confirmed = /** @type {(inputs: Commercial_Charge_ConfirmedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مؤكد`)
};

export const commercial_charge_estimate = /** @type {(inputs: Commercial_Charge_EstimateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تقديري`)
};

export const commercial_charges_allocated = /** @type {(inputs: Commercial_Charges_AllocatedInputs) => LocalizedString} */ (i) => {
	if (i?.allocation === "value") return /** @type {LocalizedString} */ (`موزعة حسب قيمة البند. التقديرات معلَّمة، وتحل محلها القيم الفعلية عند الإغلاق.`);
	if (i?.allocation === "qty") return /** @type {LocalizedString} */ (`موزعة حسب الكمية. التقديرات معلَّمة، وتحل محلها القيم الفعلية عند الإغلاق.`);
	if (i?.allocation === "lines") return /** @type {LocalizedString} */ (`موزعة بالتساوي على البنود. التقديرات معلَّمة، وتحل محلها القيم الفعلية عند الإغلاق.`);
	return /** @type {LocalizedString} */ (`موزعة ${i?.allocation}. التقديرات معلَّمة، وتحل محلها القيم الفعلية عند الإغلاق.`)
};

export const commercial_charges_vat = /** @type {(inputs: Commercial_Charges_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الضريبة: يُتوقع أن يكون التوريد لسفينة أجنبية عابرة بنسبة 0%، وتؤكد المالية ذلك. يعرض عرض السعر الأسعار غير شاملة الضريبة.`)
};

export const commercial_check_again = /** @type {(inputs: Commercial_Check_AgainInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فحص مجددًا`)
};

export const commercial_check_no = /** @type {(inputs: Commercial_Check_NoInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier}: قد يختلف عن الطلب، تحقّق`)
};

export const commercial_check_offer = /** @type {(inputs: Commercial_Check_OfferInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`العرض ${i?.n} من ${i?.supplier}: ${i?.offered}. ملاحظة المورّد: ${i?.note}.`)
};

export const commercial_check_offers = /** @type {(inputs: Commercial_Check_OffersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مطابقة العروض مع الطلب`)
};

export const commercial_check_question = /** @type {(inputs: Commercial_Check_QuestionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`هل يطابق العرض ${i?.n} (${i?.supplier}) البند المطلوب: المنتج نفسه، والعلامة التجارية أو بديل معتمد، والوحدة وحجم العبوة؟`)
};

export const commercial_check_requested = /** @type {(inputs: Commercial_Check_RequestedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`المطلوب: ${i?.description}، ${i?.requested}. القواعد: ${i?.rules}.`)
};

export const commercial_check_yes = /** @type {(inputs: Commercial_Check_YesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier}: يطابق الطلب`)
};

export const commercial_col_amount = /** @type {(inputs: Commercial_Col_AmountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المبلغ`)
};

export const commercial_col_approved_quote = /** @type {(inputs: Commercial_Col_Approved_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العرض المعتمد`)
};

export const commercial_col_charge = /** @type {(inputs: Commercial_Col_ChargeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`البند`)
};

export const commercial_col_checks = /** @type {(inputs: Commercial_Col_ChecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الفحوص`)
};

export const commercial_col_field = /** @type {(inputs: Commercial_Col_FieldInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الحقل`)
};

export const commercial_col_landed = /** @type {(inputs: Commercial_Col_LandedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حتى التسليم`)
};

export const commercial_col_landed_per = /** @type {(inputs: Commercial_Col_Landed_PerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`حتى التسليم · جنيه / ${i?.unit}`)
};

export const commercial_col_lead = /** @type {(inputs: Commercial_Col_LeadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مدة التوريد`)
};

export const commercial_col_line_supplier = /** @type {(inputs: Commercial_Col_Line_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`البند · المورّد المُختار`)
};

export const commercial_col_margin_pct = /** @type {(inputs: Commercial_Col_Margin_PctInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هامش الربح %`)
};

export const commercial_col_markup = /** @type {(inputs: Commercial_Col_MarkupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نسبة الإضافة`)
};

export const commercial_col_match = /** @type {(inputs: Commercial_Col_MatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التطابق`)
};

export const commercial_col_offered = /** @type {(inputs: Commercial_Col_OfferedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المعروض`)
};

export const commercial_col_plus_shared = /** @type {(inputs: Commercial_Col_Plus_SharedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`+ مشتركة`)
};

export const commercial_col_portal = /** @type {(inputs: Commercial_Col_PortalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`البوابة`)
};

export const commercial_col_price_offered = /** @type {(inputs: Commercial_Col_Price_OfferedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السعر (كما عُرض)`)
};

export const commercial_col_sell = /** @type {(inputs: Commercial_Col_SellInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`البيع (${i?.currency})`)
};

export const commercial_col_status = /** @type {(inputs: Commercial_Col_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الحالة`)
};

export const commercial_col_supplier = /** @type {(inputs: Commercial_Col_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المورّد`)
};

export const commercial_col_terms = /** @type {(inputs: Commercial_Col_TermsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الصلاحية · الشروط · الأساس`)
};

export const commercial_col_unit = /** @type {(inputs: Commercial_Col_UnitInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الوحدة (${i?.currency})`)
};

export const commercial_col_unit_price = /** @type {(inputs: Commercial_Col_Unit_PriceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`سعر الوحدة · جنيه / ${i?.unit}`)
};

export const commercial_compare_by = /** @type {(inputs: Commercial_Compare_ByInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المقارنة حسب`)
};

export const commercial_continue_pricing = /** @type {(inputs: Commercial_Continue_PricingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المتابعة إلى التسعير`)
};

export const commercial_correction_note = /** @type {(inputs: Commercial_Correction_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يُذكر اسم العميل للمورّد أبدًا. يبقى الإصدار 1 في الملف للتدقيق، ولا يُسعَّر إلا الإصدار المصحَّح.`)
};

export const commercial_correction_sent = /** @type {(inputs: Commercial_Correction_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم إرسال طلب التصحيح. يبقى العرض موقوفًا حتى يصل إصدار مصحَّح.`)
};

export const commercial_coverage = /** @type {(inputs: Commercial_CoverageInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.pct}% من المطلوب`)
};

export const commercial_coverage_expiry = /** @type {(inputs: Commercial_Coverage_ExpiryInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.pct}% من المطلوب · ينتهي ${i?.expiry}`)
};

export const commercial_create_revision = /** @type {(inputs: Commercial_Create_RevisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إنشاء مراجعة`)
};

export const commercial_currency = /** @type {(inputs: Commercial_CurrencyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العملة`)
};

export const commercial_customer = /** @type {(inputs: Commercial_CustomerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العميل`)
};

export const commercial_customer_decision = /** @type {(inputs: Commercial_Customer_DecisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قرار العميل`)
};

export const commercial_customer_discount = /** @type {(inputs: Commercial_Customer_DiscountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خصم العميل %`)
};

export const commercial_customer_portal = /** @type {(inputs: Commercial_Customer_PortalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بوابة العميل`)
};

export const commercial_customers_portal = /** @type {(inputs: Commercial_Customers_PortalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بوابة العميل`)
};

export const commercial_decision = /** @type {(inputs: Commercial_DecisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`القرار`)
};

export const commercial_decision_lost = /** @type {(inputs: Commercial_Decision_LostInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خسرناه`)
};

export const commercial_decision_note_label = /** @type {(inputs: Commercial_Decision_Note_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملاحظة (سبب الخسارة إن خسرناه)`)
};

export const commercial_decision_partially_won = /** @type {(inputs: Commercial_Decision_Partially_WonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فزنا بجزء منه`)
};

export const commercial_decision_placeholder = /** @type {(inputs: Commercial_Decision_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مثال: استلمنا أمر الشراء NSM-PO-77231 للبنود 1–3`)
};

export const commercial_decision_revision_requested = /** @type {(inputs: Commercial_Decision_Revision_RequestedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طُلبت مراجعة`)
};

export const commercial_decision_text = /** @type {(inputs: Commercial_Decision_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`قرار العميل بشأن ${i?.number}. عدم الرد لا يعني الخسارة أبدًا.`)
};

export const commercial_decision_won = /** @type {(inputs: Commercial_Decision_WonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فزنا به`)
};

export const commercial_difference = /** @type {(inputs: Commercial_DifferenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مختلف`)
};

export const commercial_email_from_odoo = /** @type {(inputs: Commercial_Email_From_OdooInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بريد من Odoo`)
};

export const commercial_email_to = /** @type {(inputs: Commercial_Email_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`إلى: ${i?.to}`)
};

export const commercial_eta_days = /** @type {(inputs: Commercial_Eta_DaysInputs) => LocalizedString} */ (i) => {
	const daysPlural = __paraglideRegistry.plural("ar", i?.days, {}, true);
	if (daysPlural === "zero") return /** @type {LocalizedString} */ (`الوصول المتوقع ${i?.day} · اليوم`);
	if (daysPlural === "one") return /** @type {LocalizedString} */ (`الوصول المتوقع ${i?.day} · يوم واحد`);
	if (daysPlural === "two") return /** @type {LocalizedString} */ (`الوصول المتوقع ${i?.day} · يومان`);
	if (daysPlural === "few") return /** @type {LocalizedString} */ (`الوصول المتوقع ${i?.day} · ${i?.days} أيام`);
	if (daysPlural === "many") return /** @type {LocalizedString} */ (`الوصول المتوقع ${i?.day} · ${i?.days} يومًا`);
	return /** @type {LocalizedString} */ (`الوصول المتوقع ${i?.day} · ${i?.days} يوم`)
};

export const commercial_evidence = /** @type {(inputs: Commercial_EvidenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإثبات`)
};

export const commercial_evidence_default = /** @type {(inputs: Commercial_Evidence_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بريد العميل 17 نوفمبر 10:12: «علب 500 مل مقبولة»، مرفق`)
};

export const commercial_exceptions = /** @type {(inputs: Commercial_ExceptionsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`لا استثناءات، تُعرض على المعتمِد كـ«${i?.type}».`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`استثناء واحد، يُعرض على المعتمِد كـ«${i?.type}».`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`استثناءان، يُعرضان على المعتمِد كـ«${i?.type}».`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${i?.count} استثناءات، تُعرض على المعتمِد كـ«${i?.type}».`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${i?.count} استثناءً، تُعرض على المعتمِد كـ«${i?.type}».`);
	return /** @type {LocalizedString} */ (`${i?.count} استثناء، تُعرض على المعتمِد كـ«${i?.type}».`)
};

export const commercial_fig_expected_profit = /** @type {(inputs: Commercial_Fig_Expected_ProfitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إجمالي الربح المتوقع`)
};

export const commercial_fig_input_vat = /** @type {(inputs: Commercial_Fig_Input_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ضريبة المدخلات القابلة للاسترداد`)
};

export const commercial_fig_landed = /** @type {(inputs: Commercial_Fig_LandedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التكلفة حتى التسليم (البنود المسعّرة)`)
};

export const commercial_fig_lines_priced = /** @type {(inputs: Commercial_Fig_Lines_PricedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`البنود المسعّرة`)
};

export const commercial_fig_margin = /** @type {(inputs: Commercial_Fig_MarginInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هامش الربح = الربح ÷ سعر البيع`)
};

export const commercial_fig_markup = /** @type {(inputs: Commercial_Fig_MarkupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نسبة الإضافة = الربح ÷ التكلفة حتى التسليم`)
};

export const commercial_fig_selling = /** @type {(inputs: Commercial_Fig_SellingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إجمالي البيع (غير شامل الضريبة)`)
};

export const commercial_gross_profit = /** @type {(inputs: Commercial_Gross_ProfitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إجمالي الربح`)
};

export const commercial_how_compared = /** @type {(inputs: Commercial_How_ComparedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`يُطابَق كل عرض مع البند الأصلي ويُحوَّل إلى الوحدة الأساسية المطلوبة (قطعة / لتر / كجم) بالجنيه بسعر الصرف المعتمد، مع الاحتفاظ بوحدات المورّد وعملته. وتضيف التكلفة حتى التسليم الشحن إلى ${i?.port} (أسعار الخطوط، وتكاليف الاستيراد لبنود الوكالة). يقترح الذكاء الاصطناعي المطابقات والفروق، أما التكافؤ الفني فقرار بشري.`)
};

export const commercial_landed_cost = /** @type {(inputs: Commercial_Landed_CostInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التكلفة حتى التسليم`)
};

export const commercial_landed_note_confirmed = /** @type {(inputs: Commercial_Landed_Note_ConfirmedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تشمل ${i?.charges} مصاريف مشتركة · كلها مؤكدة`)
};

export const commercial_landed_note_estimates = /** @type {(inputs: Commercial_Landed_Note_EstimatesInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`تشمل ${i?.charges} مصاريف مشتركة · بلا تقديرات`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`تشمل ${i?.charges} مصاريف مشتركة · تقدير واحد`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`تشمل ${i?.charges} مصاريف مشتركة · تقديران`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`تشمل ${i?.charges} مصاريف مشتركة · ${i?.count} تقديرات`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`تشمل ${i?.charges} مصاريف مشتركة · ${i?.count} تقديرًا`);
	return /** @type {LocalizedString} */ (`تشمل ${i?.charges} مصاريف مشتركة · ${i?.count} تقدير`)
};

export const commercial_language = /** @type {(inputs: Commercial_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اللغة`)
};

export const commercial_lead_days = /** @type {(inputs: Commercial_Lead_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.days} ي`)
};

export const commercial_letter_body = /** @type {(inputs: Commercial_Letter_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مرفق عرض السعر ${i?.number} للسفينة ${i?.vessel} (مرجعكم ${i?.ref})، والتسليم على متن السفينة في ${i?.port}.`)
};

export const commercial_letter_company = /** @type {(inputs: Commercial_Letter_CompanyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Golden Sea للتجارة والتسويق`)
};

export const commercial_letter_dear = /** @type {(inputs: Commercial_Letter_DearInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`السيد/السيدة ${i?.name}،`)
};

export const commercial_letter_regards = /** @type {(inputs: Commercial_Letter_RegardsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مع خالص التحية،`)
};

export const commercial_letter_valid = /** @type {(inputs: Commercial_Letter_ValidInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`سارٍ حتى ${i?.day}. الأسعار لا تشمل ضريبة القيمة المضافة.`)
};

export const commercial_line_requested = /** @type {(inputs: Commercial_Line_RequestedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.description} · المطلوب ${i?.requested}`)
};

export const commercial_lines_selected = /** @type {(inputs: Commercial_Lines_SelectedInputs) => LocalizedString} */ (i) => {
	const totalPlural = __paraglideRegistry.plural("ar", i?.total, {}, true);
	if (totalPlural === "zero") return /** @type {LocalizedString} */ (`${i?.selected} من ${i?.total} بند مُختار`);
	if (totalPlural === "one") return /** @type {LocalizedString} */ (`${i?.selected} من بند واحد مُختار`);
	if (totalPlural === "two") return /** @type {LocalizedString} */ (`${i?.selected} من بندين مُختار`);
	if (totalPlural === "few") return /** @type {LocalizedString} */ (`${i?.selected} من ${i?.total} بنود مُختارة`);
	if (totalPlural === "many") return /** @type {LocalizedString} */ (`${i?.selected} من ${i?.total} بندًا مُختارة`);
	return /** @type {LocalizedString} */ (`${i?.selected} من ${i?.total} بند مُختارة`)
};

export const commercial_margin_for_line = /** @type {(inputs: Commercial_Margin_For_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`هامش الربح للبند ${i?.line}`)
};

export const commercial_margin_markup = /** @type {(inputs: Commercial_Margin_MarkupInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`هامش الربح ${i?.margin} · نسبة الإضافة ${i?.markup}`)
};

export const commercial_margin_note = /** @type {(inputs: Commercial_Margin_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.profit} ÷ ${i?.sell} · السياسة مبنية على هامش الربح`)
};

export const commercial_margin_per_line = /** @type {(inputs: Commercial_Margin_Per_LineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هامش الربح % لكل بند`)
};

export const commercial_margin_vs_target = /** @type {(inputs: Commercial_Margin_Vs_TargetInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`هامش الربح مقابل المستهدف ${i?.target}%`)
};

export const commercial_markup_note = /** @type {(inputs: Commercial_Markup_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.profit} ÷ ${i?.landed} · هامش ربح 25% يعادل نسبة إضافة 33.3%`)
};

export const commercial_match = /** @type {(inputs: Commercial_MatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مطابق`)
};

export const commercial_message = /** @type {(inputs: Commercial_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الرسالة`)
};

export const commercial_metric_freight = /** @type {(inputs: Commercial_Metric_FreightInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`+ ${i?.freight} · ${i?.note}`)
};

export const commercial_metric_landed = /** @type {(inputs: Commercial_Metric_LandedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`حتى التسليم ${i?.amount}`)
};

export const commercial_metric_no_freight = /** @type {(inputs: Commercial_Metric_No_FreightInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`بدون شحن · ${i?.note}`)
};

export const commercial_no_exceptions = /** @type {(inputs: Commercial_No_ExceptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا استثناءات. اعتماد عادي.`)
};

export const commercial_no_issues = /** @type {(inputs: Commercial_No_IssuesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا ملاحظات`)
};

export const commercial_no_lines_yet = /** @type {(inputs: Commercial_No_Lines_YetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا بنود مطلوبة بعد`)
};

export const commercial_no_offers = /** @type {(inputs: Commercial_No_OffersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد عروض بعد.`)
};

export const commercial_no_recommendation = /** @type {(inputs: Commercial_No_RecommendationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد عرض يجتاز كل الفحوص بعد، فلا توصية.`)
};

export const commercial_none = /** @type {(inputs: Commercial_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد`)
};

export const commercial_not_sent_yet = /** @type {(inputs: Commercial_Not_Sent_YetInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`لم يُرسل للموردين بعد: ${i?.missing}. بانتظار رد العميل.`)
};

export const commercial_note_approver_placeholder = /** @type {(inputs: Commercial_Note_Approver_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مثال: وُزّعت الخوذ للّحاق بموعد الوصول؛ تقدير اللنش يتأكد غدًا`)
};

export const commercial_note_for_approver = /** @type {(inputs: Commercial_Note_For_ApproverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملاحظة للمعتمِد`)
};

export const commercial_of_selling_price = /** @type {(inputs: Commercial_Of_Selling_PriceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`من سعر البيع`)
};

export const commercial_of_the_lines = /** @type {(inputs: Commercial_Of_The_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`من البنود`)
};

export const commercial_offer_version = /** @type {(inputs: Commercial_Offer_VersionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} (الإصدار ${i?.version})`)
};

export const commercial_ok = /** @type {(inputs: Commercial_OkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سليم`)
};

export const commercial_on_top_landed = /** @type {(inputs: Commercial_On_Top_LandedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فوق التكلفة حتى التسليم`)
};

export const commercial_open_approvals = /** @type {(inputs: Commercial_Open_ApprovalsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فتح الاعتمادات`)
};

export const commercial_paper_address = /** @type {(inputs: Commercial_Paper_AddressInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مدينة 6 أكتوبر، محافظة الجيزة · مستند تجريبي`)
};

export const commercial_paper_attention = /** @type {(inputs: Commercial_Paper_AttentionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عناية`)
};

export const commercial_paper_brand = /** @type {(inputs: Commercial_Paper_BrandInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`للتجارة والتسويق · تأسست 2011`)
};

export const commercial_paper_client = /** @type {(inputs: Commercial_Paper_ClientInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بيانات العميل`)
};

export const commercial_paper_company = /** @type {(inputs: Commercial_Paper_CompanyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الشركة`)
};

export const commercial_paper_converted = /** @type {(inputs: Commercial_Paper_ConvertedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`محوّل بسعر ${i?.currency}/EGP ${i?.fx} (السعر المعتمد في عرض السعر).`)
};

export const commercial_paper_date = /** @type {(inputs: Commercial_Paper_DateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`التاريخ: ${i?.date}`)
};

export const commercial_paper_delivery = /** @type {(inputs: Commercial_Paper_DeliveryInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`التسليم: على متن السفينة في ${i?.port} عند الوصول (${i?.eta}).`)
};

export const commercial_paper_desc = /** @type {(inputs: Commercial_Paper_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الوصف`)
};

export const commercial_paper_discount = /** @type {(inputs: Commercial_Paper_DiscountInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`خصم ${i?.pct}%`)
};

export const commercial_paper_draft = /** @type {(inputs: Commercial_Paper_DraftInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مسودة: لم تُعتمد بعد. ستصدر كنسخة ${i?.version}.`)
};

export const commercial_paper_grand = /** @type {(inputs: Commercial_Paper_GrandInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الإجمالي بعملة ${i?.currency} (غير شامل ضريبة القيمة المضافة)`)
};

export const commercial_paper_intro = /** @type {(inputs: Commercial_Paper_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يسعدنا أن نقدم لكم عرض أسعارنا كما يلي:`)
};

export const commercial_paper_no = /** @type {(inputs: Commercial_Paper_NoInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`رقم العرض: ${i?.number}`)
};

export const commercial_paper_part = /** @type {(inputs: Commercial_Paper_PartInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`رقم القطعة`)
};

export const commercial_paper_pay = /** @type {(inputs: Commercial_Paper_PayInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`شروط الدفع: ${i?.terms}.`)
};

export const commercial_paper_port = /** @type {(inputs: Commercial_Paper_PortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ميناء التسليم`)
};

export const commercial_paper_port_eta = /** @type {(inputs: Commercial_Paper_Port_EtaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.port} · الوصول المتوقع ${i?.eta}`)
};

export const commercial_paper_prepared = /** @type {(inputs: Commercial_Paper_PreparedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أعدّه: ${i?.prepared}`)
};

export const commercial_paper_prepared_approved = /** @type {(inputs: Commercial_Paper_Prepared_ApprovedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أعدّه: ${i?.prepared} · اعتمده: ${i?.approved}`)
};

export const commercial_paper_price = /** @type {(inputs: Commercial_Paper_PriceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`السعر/${i?.currency}`)
};

export const commercial_paper_qty = /** @type {(inputs: Commercial_Paper_QtyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الكمية`)
};

export const commercial_paper_qty_rule = /** @type {(inputs: Commercial_Paper_Qty_RuleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يمكن تخفيض الكميات الواردة في العرض، والأسعار مبنية على الكميات المذكورة.`)
};

export const commercial_paper_ref = /** @type {(inputs: Commercial_Paper_RefInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مرجعكم: ${i?.ref}`)
};

export const commercial_paper_remarks = /** @type {(inputs: Commercial_Paper_RemarksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملاحظات:`)
};

export const commercial_paper_s = /** @type {(inputs: Commercial_Paper_SInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`م`)
};

export const commercial_paper_signature = /** @type {(inputs: Commercial_Paper_SignatureInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name}، توقيع معتمد`)
};

export const commercial_paper_signature_pending = /** @type {(inputs: Commercial_Paper_Signature_PendingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التوقيع عند الاعتماد`)
};

export const commercial_paper_superseded = /** @type {(inputs: Commercial_Paper_SupersededInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مُستبدَل: محفوظ للتدقيق. غير صالح للطلب.`)
};

export const commercial_paper_title = /** @type {(inputs: Commercial_Paper_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عرض سعر`)
};

export const commercial_paper_total = /** @type {(inputs: Commercial_Paper_TotalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الإجمالي/${i?.currency}`)
};

export const commercial_paper_uom = /** @type {(inputs: Commercial_Paper_UomInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الوحدة`)
};

export const commercial_paper_valid = /** @type {(inputs: Commercial_Paper_ValidInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`العرض سارٍ حتى ${i?.day}، ويمكن تجديده بعد ذلك باتفاق الطرفين.`)
};

export const commercial_paper_vat = /** @type {(inputs: Commercial_Paper_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأسعار لا تشمل ضريبة القيمة المضافة.`)
};

export const commercial_paper_vessel = /** @type {(inputs: Commercial_Paper_VesselInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السفينة`)
};

export const commercial_paper_wish = /** @type {(inputs: Commercial_Paper_WishInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نتمنى أن ينال عرضنا موافقتكم ☺`)
};

export const commercial_policy_note = /** @type {(inputs: Commercial_Policy_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`السياسة: المستهدف ${i?.target}%، والحد الأدنى ${i?.min}% (لكل صنف حيث يُحدد)، والخصومات فوق ${i?.max}% تحتاج اعتمادًا. ${i?.fx}.`)
};

export const commercial_policy_target = /** @type {(inputs: Commercial_Policy_TargetInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مستهدف السياسة ${i?.target}%`)
};

export const commercial_portal_all_match = /** @type {(inputs: Commercial_Portal_All_MatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل الحقول متطابقة. اكتمل التقديم.`)
};

export const commercial_portal_diffs = /** @type {(inputs: Commercial_Portal_DiffsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`لم يُعلَّم كمكتمل: تختلف ${i?.fields}. صحّح ذلك في البوابة أو سجّل موافقة العميل.`)
};

export const commercial_portal_empty = /** @type {(inputs: Commercial_Portal_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم تُقارن أي لقطة شاشة بعد.`)
};

export const commercial_portal_note = /** @type {(inputs: Commercial_Portal_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`للعملاء الذين يشترون عبر بوابة مشتريات: ارفع لقطة شاشة التأكيد ليقارنها الذكاء الاصطناعي بعرض السعر المعتمد. لا يكتمل التقديم إلا بتطابق كل الحقول.`)
};

export const commercial_preview_quote = /** @type {(inputs: Commercial_Preview_QuoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`معاينة ${i?.number}`)
};

export const commercial_price_build_up = /** @type {(inputs: Commercial_Price_Build_UpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مكوّنات السعر لكل بند`)
};

export const commercial_price_note = /** @type {(inputs: Commercial_Price_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`لكل ${i?.per} · الإجمالي ${i?.total}`)
};

export const commercial_pricing_policy = /** @type {(inputs: Commercial_Pricing_PolicyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سياسة التسعير`)
};

export const commercial_print = /** @type {(inputs: Commercial_PrintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طباعة`)
};

export const commercial_profit_share = /** @type {(inputs: Commercial_Profit_ShareInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.pct} منه ربح`)
};

export const commercial_quantity_from = /** @type {(inputs: Commercial_Quantity_FromInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الكمية من ${i?.supplier}`)
};

export const commercial_quote_approved = /** @type {(inputs: Commercial_Quote_ApprovedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم اعتماد ${i?.number}، وهو جاهز للإرسال.`)
};

export const commercial_quote_returned = /** @type {(inputs: Commercial_Quote_ReturnedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُعيد ${i?.number}. عدّل التسعير واطلب الاعتماد مجددًا.`)
};

export const commercial_ready = /** @type {(inputs: Commercial_ReadyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`جاهز ${i?.day}`)
};

export const commercial_reason = /** @type {(inputs: Commercial_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السبب`)
};

export const commercial_reason_best = /** @type {(inputs: Commercial_Reason_BestInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هذا هو الاختيار الأنسب. ذكر السبب اختياري.`)
};

export const commercial_reason_not_best = /** @type {(inputs: Commercial_Reason_Not_BestInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ليس العرض الأنسب: اذكر السبب. يُحفظ في الملف ويُعرض على المعتمِد.`)
};

export const commercial_reason_placeholder = /** @type {(inputs: Commercial_Reason_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مثال: Delta هو مورّد الخوذ المعتمد لدينا، وNile لديه 10 فقط في المخزون`)
};

export const commercial_recommendation_best = /** @type {(inputs: Commercial_Recommendation_BestInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.offer}: ${i?.landed} جنيه / ${i?.baseUnit} حتى التسليم، وهو أقل تكلفة على متن السفينة بين العروض التي تجتاز كل الفحوص.`)
};

export const commercial_recommendation_heading = /** @type {(inputs: Commercial_Recommendation_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التوصية · مقترحة`)
};

export const commercial_recommendation_split = /** @type {(inputs: Commercial_Recommendation_SplitInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`توزيع التوريد: ${i?.split}، ${i?.cost} حتى التسليم، والكل قبل الوصول المتوقع.`)
};

export const commercial_recommendation_split_saves = /** @type {(inputs: Commercial_Recommendation_Split_SavesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`توزيع التوريد: ${i?.split}، ${i?.cost} حتى التسليم، بتوفير ${i?.saves} مقارنة بأفضل مورّد منفرد، والكل قبل الوصول المتوقع.`)
};

export const commercial_record = /** @type {(inputs: Commercial_RecordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسجيل`)
};

export const commercial_record_acceptance = /** @type {(inputs: Commercial_Record_AcceptanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسجيل موافقة العميل`)
};

export const commercial_record_acceptance_confirm = /** @type {(inputs: Commercial_Record_Acceptance_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسجيل الموافقة`)
};

export const commercial_record_decision = /** @type {(inputs: Commercial_Record_DecisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسجيل قرار العميل`)
};

export const commercial_request_approval = /** @type {(inputs: Commercial_Request_ApprovalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلب الاعتماد`)
};

export const commercial_request_approval_text = /** @type {(inputs: Commercial_Request_Approval_TextInputs) => LocalizedString} */ (i) => {
	const linesPlural = __paraglideRegistry.plural("ar", i?.lines, {}, true);
	if (linesPlural === "zero") return /** @type {LocalizedString} */ (`يُنشئ عرض السعر للعميل (بلا بنود مسعّرة، ${i?.sell} غير شامل الضريبة، هامش الربح ${i?.margin}) وطلب اعتماد «${i?.type}» لدى Karim Balbaa. لا يُرسل شيء للعميل حتى يُعتمد ويرسله أحد.`);
	if (linesPlural === "one") return /** @type {LocalizedString} */ (`يُنشئ عرض السعر للعميل (بند مسعّر واحد، ${i?.sell} غير شامل الضريبة، هامش الربح ${i?.margin}) وطلب اعتماد «${i?.type}» لدى Karim Balbaa. لا يُرسل شيء للعميل حتى يُعتمد ويرسله أحد.`);
	if (linesPlural === "two") return /** @type {LocalizedString} */ (`يُنشئ عرض السعر للعميل (بندان مسعّران، ${i?.sell} غير شامل الضريبة، هامش الربح ${i?.margin}) وطلب اعتماد «${i?.type}» لدى Karim Balbaa. لا يُرسل شيء للعميل حتى يُعتمد ويرسله أحد.`);
	if (linesPlural === "few") return /** @type {LocalizedString} */ (`يُنشئ عرض السعر للعميل (${i?.lines} بنود مسعّرة، ${i?.sell} غير شامل الضريبة، هامش الربح ${i?.margin}) وطلب اعتماد «${i?.type}» لدى Karim Balbaa. لا يُرسل شيء للعميل حتى يُعتمد ويرسله أحد.`);
	if (linesPlural === "many") return /** @type {LocalizedString} */ (`يُنشئ عرض السعر للعميل (${i?.lines} بندًا مسعّرًا، ${i?.sell} غير شامل الضريبة، هامش الربح ${i?.margin}) وطلب اعتماد «${i?.type}» لدى Karim Balbaa. لا يُرسل شيء للعميل حتى يُعتمد ويرسله أحد.`);
	return /** @type {LocalizedString} */ (`يُنشئ عرض السعر للعميل (${i?.lines} بند مسعّر، ${i?.sell} غير شامل الضريبة، هامش الربح ${i?.margin}) وطلب اعتماد «${i?.type}» لدى Karim Balbaa. لا يُرسل شيء للعميل حتى يُعتمد ويرسله أحد.`)
};

export const commercial_requested_rules = /** @type {(inputs: Commercial_Requested_RulesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`المطلوب: ${i?.requested} · ${i?.rules}`)
};

export const commercial_return = /** @type {(inputs: Commercial_ReturnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إعادة`)
};

export const commercial_return_heading = /** @type {(inputs: Commercial_Return_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`إعادة ${i?.number}`)
};

export const commercial_return_placeholder = /** @type {(inputs: Commercial_Return_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مثال: راجع البند 3، الهامش ضئيل لمورّد جديد`)
};

export const commercial_return_text = /** @type {(inputs: Commercial_Return_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`إعادة ${i?.number} إلى مُعدّه. السبب مطلوب ويُسجَّل في سجل الملف.`)
};

export const commercial_returned_done = /** @type {(inputs: Commercial_Returned_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أُعيد إلى مُعدّه مع السبب.`)
};

export const commercial_revise_heading = /** @type {(inputs: Commercial_Revise_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مراجعة ${i?.number}`)
};

export const commercial_revise_placeholder = /** @type {(inputs: Commercial_Revise_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مثال: طلب العميل ESAB في البند 1`)
};

export const commercial_revise_text = /** @type {(inputs: Commercial_Revise_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`يُنشئ الإصدار ${i?.version} كمسودة بالبنود نفسها؛ ويُحتفظ بـ${i?.number} للتدقيق ويُعلَّم كمُستبدَل.`)
};

export const commercial_sales_note = /** @type {(inputs: Commercial_Sales_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ترى Soaad Amer (المبيعات) أسعار البيع في عرض السعر؛ أما تكاليف الموردين والتكلفة حتى التسليم وهوامش الربح فمقصورة على سلسلة الإمداد والمالية والإدارة.`)
};

export const commercial_save_selection = /** @type {(inputs: Commercial_Save_SelectionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حفظ الاختيار`)
};

export const commercial_select = /** @type {(inputs: Commercial_SelectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختيار`)
};

export const commercial_select_done_best = /** @type {(inputs: Commercial_Select_Done_BestInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`البند ${i?.line}: تم اختيار ${i?.supplier} (الأنسب)`)
};

export const commercial_select_heading = /** @type {(inputs: Commercial_Select_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`البند ${i?.line}: اختيار عرض`)
};

export const commercial_select_offer_line = /** @type {(inputs: Commercial_Select_Offer_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.offer} × ${i?.qty} ${i?.unit} · ${i?.landed} شاملة التكلفة حتى التسليم`)
};

export const commercial_selected = /** @type {(inputs: Commercial_SelectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مُختار`)
};

export const commercial_selected_note = /** @type {(inputs: Commercial_Selected_NoteInputs) => LocalizedString} */ (i) => {
	if (i?.inferred === "yes") return /** @type {LocalizedString} */ (`المُختار: ${i?.selected} (من حالة البند)`);
	return /** @type {LocalizedString} */ (`المُختار: ${i?.selected}`)
};

export const commercial_selected_note_reason = /** @type {(inputs: Commercial_Selected_Note_ReasonInputs) => LocalizedString} */ (i) => {
	if (i?.inferred === "yes") return /** @type {LocalizedString} */ (`المُختار: ${i?.selected} · ${i?.reason} (من حالة البند)`);
	return /** @type {LocalizedString} */ (`المُختار: ${i?.selected} · ${i?.reason}`)
};

export const commercial_selected_qty = /** @type {(inputs: Commercial_Selected_QtyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مُختار × ${i?.qty}`)
};

export const commercial_selection_saved = /** @type {(inputs: Commercial_Selection_SavedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`البند ${i?.line}: تم حفظ الاختيار في الملف.`)
};

export const commercial_sell_note = /** @type {(inputs: Commercial_Sell_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.sell} بسعر ${i?.currency}/EGP ${i?.fx}`)
};

export const commercial_sell_note_discount = /** @type {(inputs: Commercial_Sell_Note_DiscountInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.sell} بسعر ${i?.currency}/EGP ${i?.fx} · بعد خصم ${i?.discount}%`)
};

export const commercial_send = /** @type {(inputs: Commercial_SendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إرسال`)
};

export const commercial_send_ai_draft = /** @type {(inputs: Commercial_Send_Ai_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسودة بالذكاء الاصطناعي · لا يُرسل شيء حتى تؤكد.`)
};

export const commercial_send_correction_heading = /** @type {(inputs: Commercial_Send_Correction_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إرسال طلب التصحيح؟`)
};

export const commercial_send_correction_text = /** @type {(inputs: Commercial_Send_Correction_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`إلى ${i?.to}: «${i?.subject}».`)
};

export const commercial_send_email_line = /** @type {(inputs: Commercial_Send_Email_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`بريد من Odoo. إلى: ${i?.to} · الموضوع: عرض سعر ${i?.number}، ${i?.vessel}، المرجع ${i?.ref} · المرفق: ${i?.number}.pdf`)
};

export const commercial_send_heading = /** @type {(inputs: Commercial_Send_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`إرسال ${i?.number}`)
};

export const commercial_send_portal_line = /** @type {(inputs: Commercial_Send_Portal_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`بوابة العميل: أدخل عرض السعر في ${i?.portal}، ثم ارفع لقطة شاشة التأكيد أدناه. لا يكتمل التقديم إلا بمطابقتها للعرض المعتمد.`)
};

export const commercial_send_to_customer = /** @type {(inputs: Commercial_Send_To_CustomerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إرسال إلى العميل`)
};

export const commercial_send_to_supplier = /** @type {(inputs: Commercial_Send_To_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إرسال إلى المورّد`)
};

export const commercial_sent_via = /** @type {(inputs: Commercial_Sent_ViaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُرسل ${i?.when} عبر ${i?.method}`)
};

export const commercial_shared_allocated = /** @type {(inputs: Commercial_Shared_AllocatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`توزيع المصاريف المشتركة`)
};

export const commercial_shared_charges = /** @type {(inputs: Commercial_Shared_ChargesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المصاريف المشتركة`)
};

export const commercial_split_across = /** @type {(inputs: Commercial_Split_AcrossInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`توزيع على عدة موردين…`)
};

export const commercial_split_adds_up = /** @type {(inputs: Commercial_Split_Adds_UpInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مجموع الكميات ${i?.qty} ${i?.unit}.`)
};

export const commercial_split_heading = /** @type {(inputs: Commercial_Split_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`البند ${i?.line}: توزيع التوريد`)
};

export const commercial_split_part_note = /** @type {(inputs: Commercial_Split_Part_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.offer} · ${i?.landed} جنيه / ${i?.baseUnit} حتى التسليم · حتى ${i?.max} ${i?.unit}`)
};

export const commercial_split_reason = /** @type {(inputs: Commercial_Split_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إن لم يكن هذا التوزيع المقترح، فاذكر السبب: يُحفظ في الملف ويُعرض على المعتمِد.`)
};

export const commercial_step_approval_requested = /** @type {(inputs: Commercial_Step_Approval_RequestedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طُلب الاعتماد`)
};

export const commercial_step_approved = /** @type {(inputs: Commercial_Step_ApprovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`معتمد`)
};

export const commercial_step_prepared = /** @type {(inputs: Commercial_Step_PreparedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أُعدّ`)
};

export const commercial_step_sent = /** @type {(inputs: Commercial_Step_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أُرسل`)
};

export const commercial_submission_method = /** @type {(inputs: Commercial_Submission_MethodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طريقة التقديم`)
};

export const commercial_supplier_cost = /** @type {(inputs: Commercial_Supplier_CostInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تكلفة المورّد`)
};

export const commercial_tag_agency = /** @type {(inputs: Commercial_Tag_AgencyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`وكالة`)
};

export const commercial_tag_ai_check = /** @type {(inputs: Commercial_Tag_Ai_CheckInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فحص بالذكاء الاصطناعي`)
};

export const commercial_tag_ai_draft = /** @type {(inputs: Commercial_Tag_Ai_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسودة بالذكاء الاصطناعي`)
};

export const commercial_tag_best_fit = /** @type {(inputs: Commercial_Tag_Best_FitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأنسب`)
};

export const commercial_tag_cheapest_unit = /** @type {(inputs: Commercial_Tag_Cheapest_UnitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أقل سعر وحدة`)
};

export const commercial_tag_own_stock = /** @type {(inputs: Commercial_Tag_Own_StockInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مخزوننا`)
};

export const commercial_target_min = /** @type {(inputs: Commercial_Target_MinInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`المستهدف ${i?.target}% · الأدنى ${i?.min}%`)
};

export const commercial_terms_no_expiry = /** @type {(inputs: Commercial_Terms_No_ExpiryInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`بلا تاريخ انتهاء · ${i?.terms}`)
};

export const commercial_terms_valid = /** @type {(inputs: Commercial_Terms_ValidInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`سارٍ حتى ${i?.day} · ${i?.terms}`)
};

export const commercial_to_follow = /** @type {(inputs: Commercial_To_FollowInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} تتبع في مراجعة`)
};

export const commercial_total_shared = /** @type {(inputs: Commercial_Total_SharedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إجمالي المشتركة`)
};

export const commercial_unit_price = /** @type {(inputs: Commercial_Unit_PriceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سعر الوحدة`)
};

export const commercial_unpriced_line = /** @type {(inputs: Commercial_Unpriced_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`L${i?.line} · ${i?.description} (${i?.status}): لا تكلفة بعد، مستبعد من هذا الإصدار.`)
};

export const commercial_upload_compare = /** @type {(inputs: Commercial_Upload_CompareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`رفع لقطة الشاشة ومقارنتها`)
};

export const commercial_use_split = /** @type {(inputs: Commercial_Use_SplitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استخدام التوزيع المقترح`)
};

export const commercial_vat_note = /** @type {(inputs: Commercial_Vat_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`14% على فواتير الموردين المحليين، مستبعدة من التكلفة`)
};

export const commercial_view_quotation = /** @type {(inputs: Commercial_View_QuotationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عرض عرض السعر`)
};

export const commercial_what_changes = /** @type {(inputs: Commercial_What_ChangesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ما الذي يتغير`)
};

export const commercial_within_policy = /** @type {(inputs: Commercial_Within_PolicyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ضمن السياسة.`)
};

export const control_room_ageing_center = /** @type {(inputs: Control_Room_Ageing_CenterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مفتوحة`)
};

export const control_room_ageing_label = /** @type {(inputs: Control_Room_Ageing_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المستحقات حسب العمر`)
};

export const control_room_ai_draft = /** @type {(inputs: Control_Room_Ai_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسودة ذكاء اصطناعي`)
};

export const control_room_all_cases = /** @type {(inputs: Control_Room_All_CasesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل الملفات`)
};

export const control_room_approvals = /** @type {(inputs: Control_Room_ApprovalsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الاعتمادات`)
};

export const control_room_ask_footnote = /** @type {(inputs: Control_Room_Ask_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المساعد يقرأ ويجيب، ولا يرسل أو يسعّر أو يدفع أبدًا.`)
};

export const control_room_ask_intro = /** @type {(inputs: Control_Room_Ask_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اسأل عن سفينة أو رقم ملف، أو الاعتمادات، أو من يدين لنا بالمال، أو الموردين، أو المواعيد النهائية، أو فرص النمو. تأتي الإجابات من السجلات الحالية مع روابط إليها.`)
};

export const control_room_ask_name = /** @type {(inputs: Control_Room_Ask_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مساعد Golden Sea`)
};

export const control_room_ask_placeholder = /** @type {(inputs: Control_Room_Ask_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اسأل Golden Sea…`)
};

export const control_room_ask_question = /** @type {(inputs: Control_Room_Ask_QuestionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ما حالة Aurora Crest؟`)
};

export const control_room_ask_reading = /** @type {(inputs: Control_Room_Ask_ReadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ قراءة الملفات والاعتمادات والفواتير والموردين…`)
};

export const control_room_assistant = /** @type {(inputs: Control_Room_AssistantInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المساعد`)
};

export const control_room_briefing_summarised = /** @type {(inputs: Control_Room_Briefing_SummarisedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُعيد تلخيصه في ${i?.at} من السجلات الحالية (${i?.count}). مسودة للقراءة: لا يُرسل شيء ولا يُسعّر ولا يُدفع.`)
};

export const control_room_briefing_written = /** @type {(inputs: Control_Room_Briefing_WrittenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`كُتب في 07:00 من السجلات الحالية (${i?.count}). مسودة للقراءة: لا يُرسل شيء ولا يُسعّر ولا يُدفع.`)
};

export const control_room_days_label = /** @type {(inputs: Control_Room_Days_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الاستفسارات يوميًا، آخر 12 أسبوعًا`)
};

export const control_room_days_summary = /** @type {(inputs: Control_Room_Days_SummaryInputs) => LocalizedString} */ (i) => {
	const totalPlural = __paraglideRegistry.plural("ar", i?.total, {}, true);
	if (totalPlural === "zero") return /** @type {LocalizedString} */ (`لا استفسارات في 12 أسبوعًا · الأكثر ازدحامًا ${i?.day} (${i?.count})`);
	if (totalPlural === "one") return /** @type {LocalizedString} */ (`استفسار واحد في 12 أسبوعًا · الأكثر ازدحامًا ${i?.day} (${i?.count})`);
	if (totalPlural === "two") return /** @type {LocalizedString} */ (`استفساران في 12 أسبوعًا · الأكثر ازدحامًا ${i?.day} (${i?.count})`);
	if (totalPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.total, {})} استفسارات في 12 أسبوعًا · الأكثر ازدحامًا ${i?.day} (${i?.count})`);
	if (totalPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.total, {})} استفسارًا في 12 أسبوعًا · الأكثر ازدحامًا ${i?.day} (${i?.count})`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.total, {})} استفسار في 12 أسبوعًا · الأكثر ازدحامًا ${i?.day} (${i?.count})`)
};

export const control_room_eyebrow = /** @type {(inputs: Control_Room_EyebrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`غرفة التحكم · لـ Karim Balbaa وMohamed Helmy`)
};

export const control_room_figure_avg_time_to_quote = /** @type {(inputs: Control_Room_Figure_Avg_Time_To_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`متوسط زمن التسعير`)
};

export const control_room_figure_gross_profit = /** @type {(inputs: Control_Room_Figure_Gross_ProfitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إجمالي الربح`)
};

export const control_room_figure_open_rfqs = /** @type {(inputs: Control_Room_Figure_Open_RfqsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلبات عروض الأسعار المفتوحة`)
};

export const control_room_figure_receivables_open = /** @type {(inputs: Control_Room_Figure_Receivables_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المستحقات المفتوحة`)
};

export const control_room_figure_waiting_on_suppliers = /** @type {(inputs: Control_Room_Figure_Waiting_On_SuppliersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظار الموردين`)
};

export const control_room_figure_win_rate = /** @type {(inputs: Control_Room_Figure_Win_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نسبة الفوز`)
};

export const control_room_funnel_12w = /** @type {(inputs: Control_Room_Funnel_12wInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسار عروض الأسعار، آخر 12 أسبوعًا`)
};

export const control_room_funnel_4w = /** @type {(inputs: Control_Room_Funnel_4wInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسار عروض الأسعار، آخر 4 أسابيع`)
};

export const control_room_funnel_note_12w = /** @type {(inputs: Control_Room_Funnel_Note_12wInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملفات طلبات عروض الأسعار الواردة في آخر 12 أسبوعًا، وكم منها سُعّر وكم فزنا به`)
};

export const control_room_funnel_note_4w = /** @type {(inputs: Control_Room_Funnel_Note_4wInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملفات طلبات عروض الأسعار الواردة في آخر 4 أسابيع، وكم منها سُعّر وكم فزنا به`)
};

export const control_room_heading = /** @type {(inputs: Control_Room_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأعمال لحظة بلحظة.`)
};

export const control_room_inquiries = /** @type {(inputs: Control_Room_InquiriesInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`لا استفسارات`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`استفسار واحد`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`استفساران`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} استفسارات`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} استفسارًا`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} استفسار`)
};

export const control_room_lost_center = /** @type {(inputs: Control_Room_Lost_CenterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خاسرة`)
};

export const control_room_lost_label = /** @type {(inputs: Control_Room_Lost_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أسباب خسارة العروض`)
};

export const control_room_money_withheld = /** @type {(inputs: Control_Room_Money_WithheldInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إجمالي الربح وهوامش الربح والمستحقات والتدفق النقدي تظهر للإدارة والمالية فقط.`)
};

export const control_room_month_note = /** @type {(inputs: Control_Room_Month_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.month}: ${i?.note}`)
};

export const control_room_range_months = /** @type {(inputs: Control_Room_Range_MonthsInputs) => LocalizedString} */ (i) => {
	const pointsPlural = __paraglideRegistry.plural("ar", i?.points, {}, true);
	if (pointsPlural === "one") return /** @type {LocalizedString} */ (`شهر`);
	if (pointsPlural === "two") return /** @type {LocalizedString} */ (`شهران`);
	if (pointsPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.points, {})} أشهر`);
	if (pointsPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.points, {})} شهرًا`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.points, {})} شهر`)
};

export const control_room_range_weeks = /** @type {(inputs: Control_Room_Range_WeeksInputs) => LocalizedString} */ (i) => {
	const pointsPlural = __paraglideRegistry.plural("ar", i?.points, {}, true);
	if (pointsPlural === "one") return /** @type {LocalizedString} */ (`أسبوع`);
	if (pointsPlural === "two") return /** @type {LocalizedString} */ (`أسبوعان`);
	if (pointsPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.points, {})} أسابيع`);
	if (pointsPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.points, {})} أسبوعًا`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.points, {})} أسبوع`)
};

export const control_room_receivables_payables = /** @type {(inputs: Control_Room_Receivables_PayablesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المستحقات والمدفوعات`)
};

export const control_room_subtitle = /** @type {(inputs: Control_Room_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملخص في 07:00 من كل ملف وعرض سعر وتسليم ودفعة، وإجابات عن أي سؤال بشأنها.`)
};

export const control_room_summarise = /** @type {(inputs: Control_Room_SummariseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تلخيص`)
};

export const growth_column_imo = /** @type {(inputs: Growth_Column_ImoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`IMO`)
};

export const growth_column_manager = /** @type {(inputs: Growth_Column_ManagerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مدير السفن`)
};

export const growth_column_supplied = /** @type {(inputs: Growth_Column_SuppliedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التوريد`)
};

export const growth_column_type = /** @type {(inputs: Growth_Column_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النوع`)
};

export const growth_column_vessel = /** @type {(inputs: Growth_Column_VesselInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السفينة`)
};

export const growth_extract_company = /** @type {(inputs: Growth_Extract_CompanyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الشركة`)
};

export const growth_extract_expires = /** @type {(inputs: Growth_Extract_ExpiresInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تاريخ الانتهاء`)
};

export const growth_extract_expires_hint = /** @type {(inputs: Growth_Extract_Expires_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تاريخ الانتهاء أو التجديد`)
};

export const growth_extract_issued = /** @type {(inputs: Growth_Extract_IssuedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تاريخ الإصدار`)
};

export const growth_extract_label = /** @type {(inputs: Growth_Extract_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قراءة مستند تسجيل`)
};

export const growth_extract_registration = /** @type {(inputs: Growth_Extract_RegistrationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`رقم السجل التجاري`)
};

export const growth_extract_tax = /** @type {(inputs: Growth_Extract_TaxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`رقم البطاقة الضريبية`)
};

export const growth_extract_what = /** @type {(inputs: Growth_Extract_WhatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مستند تسجيل شركة (سجل تجاري أو بطاقة ضريبية أو شهادة مورّد)`)
};

export const growth_fleet_supporting = /** @type {(inputs: Growth_Fleet_SupportingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`في السجل ${i?.count} من ${i?.size} سفينة · نورّد منها ${i?.supplied}`)
};

export const growth_not_yet = /** @type {(inputs: Growth_Not_YetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ليس بعد`)
};

export const growth_supplied = /** @type {(inputs: Growth_SuppliedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نورّدها`)
};

export const home_away_context = /** @type {(inputs: Home_Away_ContextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إشعارات غير مقروءة لموظف عاد إلى مكتبه في شركة توريدات بحرية: ابدأ بما يحتاج إليه أولًا.`)
};

export const home_away_label = /** @type {(inputs: Home_Away_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أثناء غيابك`)
};

export const home_figure_awaiting_customer_decision = /** @type {(inputs: Home_Figure_Awaiting_Customer_DecisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظار قرار العميل`)
};

export const home_figure_awaiting_internal_approval = /** @type {(inputs: Home_Figure_Awaiting_Internal_ApprovalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظار الاعتماد الداخلي`)
};

export const home_figure_awaiting_supplier = /** @type {(inputs: Home_Figure_Awaiting_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظار المورّد`)
};

export const home_figure_deliveries_in_progress = /** @type {(inputs: Home_Figure_Deliveries_In_ProgressInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عمليات تسليم جارية`)
};

export const home_figure_expected_gross_profit_nov = /** @type {(inputs: Home_Figure_Expected_Gross_Profit_NovInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إجمالي الربح المتوقع، نوفمبر`)
};

export const home_figure_inquiries_4_weeks = /** @type {(inputs: Home_Figure_Inquiries_4_WeeksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الاستفسارات، آخر 4 أسابيع`)
};

export const home_figure_my_quote_turnaround = /** @type {(inputs: Home_Figure_My_Quote_TurnaroundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`زمن إعدادي لعروض الأسعار`)
};

export const home_figure_net_cash_8_weeks = /** @type {(inputs: Home_Figure_Net_Cash_8_WeeksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صافي النقد، الأسابيع الثمانية القادمة`)
};

export const home_figure_out_of_hours_rfqs = /** @type {(inputs: Home_Figure_Out_Of_Hours_RfqsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلبات عروض أسعار خارج الدوام`)
};

export const home_figure_quote_turnaround = /** @type {(inputs: Home_Figure_Quote_TurnaroundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`زمن إعداد عرض السعر`)
};

export const home_figure_receivables = /** @type {(inputs: Home_Figure_ReceivablesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المستحقات`)
};

export const home_figure_time_to_acknowledge = /** @type {(inputs: Home_Figure_Time_To_AcknowledgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`زمن تأكيد الاستلام`)
};

export const home_figure_won_4_weeks = /** @type {(inputs: Home_Figure_Won_4_WeeksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الصفقات الرابحة، آخر 4 أسابيع`)
};

export const home_late = /** @type {(inputs: Home_LateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`متأخر`)
};

export const inbox_ack_by_hand = /** @type {(inputs: Inbox_Ack_By_HandInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يُرسل يدويًا`)
};

export const inbox_ack_note_manual = /** @type {(inputs: Inbox_Ack_Note_ManualInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`القالب: ${i?.template}. مصدر WhatsApp أو النموذج: يرسله المسؤول بنفسه، ولا يراسل النظام العميل من تلقاء نفسه هنا.`)
};

export const inbox_ack_note_once = /** @type {(inputs: Inbox_Ack_Note_OnceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`القالب: ${i?.template}. يُرسل مرة واحدة من القالب المعتمد، ولا يُرسل مرتين أبدًا، حتى لو أُعيدت معالجة البريد.`)
};

export const inbox_ack_on_create = /** @type {(inputs: Inbox_Ack_On_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يُرسل مرة واحدة عند الإنشاء`)
};

export const inbox_ack_sent = /** @type {(inputs: Inbox_Ack_SentInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُرسل مرة واحدة · ${i?.when}`)
};

export const inbox_ai_draft = /** @type {(inputs: Inbox_Ai_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسودة الذكاء الاصطناعي`)
};

export const inbox_assignment_rule = /** @type {(inputs: Inbox_Assignment_RuleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مقترح وفق قواعد الإسناد: ${i?.rule}.`)
};

export const inbox_assignment_rule_change = /** @type {(inputs: Inbox_Assignment_Rule_ChangeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مقترح وفق قواعد الإسناد: ${i?.rule}. غيّرها عند إنشاء الملف.`)
};

export const inbox_backup = /** @type {(inputs: Inbox_BackupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`البديل`)
};

export const inbox_case_created = /** @type {(inputs: Inbox_Case_CreatedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُنشئ الملف ${i?.caseId} من هذه الرسالة ورُبط بها.`)
};

export const inbox_case_was_created = /** @type {(inputs: Inbox_Case_Was_CreatedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُنشئ الملف ${i?.caseId} من هذه الرسالة.`)
};

export const inbox_channel = /** @type {(inputs: Inbox_ChannelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.kind} · ${i?.account}: ${i?.status}`)
};

export const inbox_check_original = /** @type {(inputs: Inbox_Check_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`راجعه مقابل الأصل`)
};

export const inbox_clarification_subject = /** @type {(inputs: Inbox_Clarification_SubjectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلب توضيح، مسودة لم تُرسل`)
};

export const inbox_col_confidence = /** @type {(inputs: Inbox_Col_ConfidenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الثقة`)
};

export const inbox_col_item = /** @type {(inputs: Inbox_Col_ItemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الصنف`)
};

export const inbox_col_part_no = /** @type {(inputs: Inbox_Col_Part_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`رقم القطعة`)
};

export const inbox_col_qty = /** @type {(inputs: Inbox_Col_QtyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الكمية`)
};

export const inbox_col_source = /** @type {(inputs: Inbox_Col_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المصدر`)
};

export const inbox_col_unit = /** @type {(inputs: Inbox_Col_UnitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الوحدة`)
};

export const inbox_create_rfq = /** @type {(inputs: Inbox_Create_RfqInputs) => LocalizedString} */ (i) => {
	const linesPlural = __paraglideRegistry.plural("ar", i?.lines, {}, true);
	if (linesPlural === "zero") return /** @type {LocalizedString} */ (`ملف طلب عرض أسعار لـ ${i?.customer} يضم لا بنود، المسؤول ${i?.owner}. تبقى الرسالة الأصلية مرتبطة به.`);
	if (linesPlural === "one") return /** @type {LocalizedString} */ (`ملف طلب عرض أسعار لـ ${i?.customer} يضم بندًا واحدًا، المسؤول ${i?.owner}. تبقى الرسالة الأصلية مرتبطة به.`);
	if (linesPlural === "two") return /** @type {LocalizedString} */ (`ملف طلب عرض أسعار لـ ${i?.customer} يضم بندين، المسؤول ${i?.owner}. تبقى الرسالة الأصلية مرتبطة به.`);
	if (linesPlural === "few") return /** @type {LocalizedString} */ (`ملف طلب عرض أسعار لـ ${i?.customer} يضم ${__paraglideRegistry.icuPound("ar", i?.lines, {})} بنود، المسؤول ${i?.owner}. تبقى الرسالة الأصلية مرتبطة به.`);
	if (linesPlural === "many") return /** @type {LocalizedString} */ (`ملف طلب عرض أسعار لـ ${i?.customer} يضم ${__paraglideRegistry.icuPound("ar", i?.lines, {})} بندًا، المسؤول ${i?.owner}. تبقى الرسالة الأصلية مرتبطة به.`);
	return /** @type {LocalizedString} */ (`ملف طلب عرض أسعار لـ ${i?.customer} يضم ${__paraglideRegistry.icuPound("ar", i?.lines, {})} بند، المسؤول ${i?.owner}. تبقى الرسالة الأصلية مرتبطة به.`)
};

export const inbox_create_rfq_flagged = /** @type {(inputs: Inbox_Create_Rfq_FlaggedInputs) => LocalizedString} */ (i) => {
	const linesPlural = __paraglideRegistry.plural("ar", i?.lines, {}, true);
	if (linesPlural === "zero") return /** @type {LocalizedString} */ (`ملف طلب عرض أسعار لـ ${i?.customer} يضم لا بنود (${i?.flagged} بحاجة إلى توضيح)، المسؤول ${i?.owner}. تبقى الرسالة الأصلية مرتبطة به.`);
	if (linesPlural === "one") return /** @type {LocalizedString} */ (`ملف طلب عرض أسعار لـ ${i?.customer} يضم بندًا واحدًا (${i?.flagged} بحاجة إلى توضيح)، المسؤول ${i?.owner}. تبقى الرسالة الأصلية مرتبطة به.`);
	if (linesPlural === "two") return /** @type {LocalizedString} */ (`ملف طلب عرض أسعار لـ ${i?.customer} يضم بندين (${i?.flagged} بحاجة إلى توضيح)، المسؤول ${i?.owner}. تبقى الرسالة الأصلية مرتبطة به.`);
	if (linesPlural === "few") return /** @type {LocalizedString} */ (`ملف طلب عرض أسعار لـ ${i?.customer} يضم ${__paraglideRegistry.icuPound("ar", i?.lines, {})} بنود (${i?.flagged} بحاجة إلى توضيح)، المسؤول ${i?.owner}. تبقى الرسالة الأصلية مرتبطة به.`);
	if (linesPlural === "many") return /** @type {LocalizedString} */ (`ملف طلب عرض أسعار لـ ${i?.customer} يضم ${__paraglideRegistry.icuPound("ar", i?.lines, {})} بندًا (${i?.flagged} بحاجة إلى توضيح)، المسؤول ${i?.owner}. تبقى الرسالة الأصلية مرتبطة به.`);
	return /** @type {LocalizedString} */ (`ملف طلب عرض أسعار لـ ${i?.customer} يضم ${__paraglideRegistry.icuPound("ar", i?.lines, {})} بند (${i?.flagged} بحاجة إلى توضيح)، المسؤول ${i?.owner}. تبقى الرسالة الأصلية مرتبطة به.`)
};

export const inbox_create_service = /** @type {(inputs: Inbox_Create_ServiceInputs) => LocalizedString} */ (i) => {
	const linesPlural = __paraglideRegistry.plural("ar", i?.lines, {}, true);
	if (linesPlural === "zero") return /** @type {LocalizedString} */ (`ملف خدمة لـ ${i?.customer} يضم لا بنود، المسؤول ${i?.owner}. تبقى الرسالة الأصلية مرتبطة به.`);
	if (linesPlural === "one") return /** @type {LocalizedString} */ (`ملف خدمة لـ ${i?.customer} يضم بندًا واحدًا، المسؤول ${i?.owner}. تبقى الرسالة الأصلية مرتبطة به.`);
	if (linesPlural === "two") return /** @type {LocalizedString} */ (`ملف خدمة لـ ${i?.customer} يضم بندين، المسؤول ${i?.owner}. تبقى الرسالة الأصلية مرتبطة به.`);
	if (linesPlural === "few") return /** @type {LocalizedString} */ (`ملف خدمة لـ ${i?.customer} يضم ${__paraglideRegistry.icuPound("ar", i?.lines, {})} بنود، المسؤول ${i?.owner}. تبقى الرسالة الأصلية مرتبطة به.`);
	if (linesPlural === "many") return /** @type {LocalizedString} */ (`ملف خدمة لـ ${i?.customer} يضم ${__paraglideRegistry.icuPound("ar", i?.lines, {})} بندًا، المسؤول ${i?.owner}. تبقى الرسالة الأصلية مرتبطة به.`);
	return /** @type {LocalizedString} */ (`ملف خدمة لـ ${i?.customer} يضم ${__paraglideRegistry.icuPound("ar", i?.lines, {})} بند، المسؤول ${i?.owner}. تبقى الرسالة الأصلية مرتبطة به.`)
};

export const inbox_create_service_flagged = /** @type {(inputs: Inbox_Create_Service_FlaggedInputs) => LocalizedString} */ (i) => {
	const linesPlural = __paraglideRegistry.plural("ar", i?.lines, {}, true);
	if (linesPlural === "zero") return /** @type {LocalizedString} */ (`ملف خدمة لـ ${i?.customer} يضم لا بنود (${i?.flagged} بحاجة إلى توضيح)، المسؤول ${i?.owner}. تبقى الرسالة الأصلية مرتبطة به.`);
	if (linesPlural === "one") return /** @type {LocalizedString} */ (`ملف خدمة لـ ${i?.customer} يضم بندًا واحدًا (${i?.flagged} بحاجة إلى توضيح)، المسؤول ${i?.owner}. تبقى الرسالة الأصلية مرتبطة به.`);
	if (linesPlural === "two") return /** @type {LocalizedString} */ (`ملف خدمة لـ ${i?.customer} يضم بندين (${i?.flagged} بحاجة إلى توضيح)، المسؤول ${i?.owner}. تبقى الرسالة الأصلية مرتبطة به.`);
	if (linesPlural === "few") return /** @type {LocalizedString} */ (`ملف خدمة لـ ${i?.customer} يضم ${__paraglideRegistry.icuPound("ar", i?.lines, {})} بنود (${i?.flagged} بحاجة إلى توضيح)، المسؤول ${i?.owner}. تبقى الرسالة الأصلية مرتبطة به.`);
	if (linesPlural === "many") return /** @type {LocalizedString} */ (`ملف خدمة لـ ${i?.customer} يضم ${__paraglideRegistry.icuPound("ar", i?.lines, {})} بندًا (${i?.flagged} بحاجة إلى توضيح)، المسؤول ${i?.owner}. تبقى الرسالة الأصلية مرتبطة به.`);
	return /** @type {LocalizedString} */ (`ملف خدمة لـ ${i?.customer} يضم ${__paraglideRegistry.icuPound("ar", i?.lines, {})} بند (${i?.flagged} بحاجة إلى توضيح)، المسؤول ${i?.owner}. تبقى الرسالة الأصلية مرتبطة به.`)
};

export const inbox_extract = /** @type {(inputs: Inbox_ExtractInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استخراج بالذكاء الاصطناعي`)
};

export const inbox_extract_text = /** @type {(inputs: Inbox_Extract_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يقرأ الذكاء الاصطناعي البريد إلى مسودة: العميل، السفينة، IMO، الميناء، الوصول المتوقع، الموعد النهائي، والبنود مع IMPA / ISSA وأرقام القطع ودرجة ثقة لكل قيمة. لا يُنشأ شيء حتى تؤكد.`)
};

export const inbox_extract_text_files = /** @type {(inputs: Inbox_Extract_Text_FilesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يقرأ الذكاء الاصطناعي البريد وكل مرفق (Excel، PDF، Word، صور) إلى مسودة: العميل، السفينة، IMO، الميناء، الوصول المتوقع، الموعد النهائي، والبنود مع IMPA / ISSA وأرقام القطع ودرجة ثقة لكل قيمة. لا يُنشأ شيء حتى تؤكد.`)
};

export const inbox_flag_auto_reply = /** @type {(inputs: Inbox_Flag_Auto_ReplyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يبدو ردًا تلقائيًا`)
};

export const inbox_flag_auto_reply_note = /** @type {(inputs: Inbox_Flag_Auto_Reply_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يجيب عن الطلب، فتستمر تذكيرات المورد.`)
};

export const inbox_flag_bank = /** @type {(inputs: Inbox_Flag_BankInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يطلب تغيير بيانات البنك أو الدفع`)
};

export const inbox_flag_bank_note = /** @type {(inputs: Inbox_Flag_Bank_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا تتصرف بناءً على البريد: تغيير بيانات البنك يحتاج إلى شخصين (المالية والرئيس التنفيذي) ومعاودة الاتصال على الرقم المسجل لدينا.`)
};

export const inbox_flag_cannot_supply = /** @type {(inputs: Inbox_Flag_Cannot_SupplyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المرسل لا يستطيع التوريد`)
};

export const inbox_flag_cannot_supply_note = /** @type {(inputs: Inbox_Flag_Cannot_Supply_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ابحث عن مورّد آخر لهذه البنود قبل الموعد النهائي.`)
};

export const inbox_from = /** @type {(inputs: Inbox_FromInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`من: ${i?.name} <${i?.email}>`)
};

export const inbox_history_approval_ready = /** @type {(inputs: Inbox_History_Approval_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تمت مراجعة كل شيء، وهو جاهز للاعتماد.`)
};

export const inbox_history_approval_text = /** @type {(inputs: Inbox_History_Approval_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإدارة وحدها تعتمد الاستيراد. لا يصبح شيء من السجل قيدًا قبل موافقة الإدارة. وتبقى المراسلات السرية خارجه.`)
};

export const inbox_history_approval_waiting = /** @type {(inputs: Inbox_History_Approval_WaitingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`بانتظار ${i?.approvers} (الإدارة). ${i?.blocked}`)
};

export const inbox_history_approve = /** @type {(inputs: Inbox_History_ApproveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اعتماد الاستيراد`)
};

export const inbox_history_approve_done = /** @type {(inputs: Inbox_History_Approve_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم اعتماد الاستيراد: حُفظ العملاء والسفن والموردون والأسعار المؤرخة`)
};

export const inbox_history_approved_by = /** @type {(inputs: Inbox_History_Approved_ByInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`اعتمده ${i?.by}.`)
};

export const inbox_history_col_attachments = /** @type {(inputs: Inbox_History_Col_AttachmentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المرفقات`)
};

export const inbox_history_col_calls = /** @type {(inputs: Inbox_History_Col_CallsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الزيارات`)
};

export const inbox_history_col_categories = /** @type {(inputs: Inbox_History_Col_CategoriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ما يسعّره`)
};

export const inbox_history_col_country = /** @type {(inputs: Inbox_History_Col_CountryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الدولة`)
};

export const inbox_history_col_customer = /** @type {(inputs: Inbox_History_Col_CustomerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العميل`)
};

export const inbox_history_col_fleet = /** @type {(inputs: Inbox_History_Col_FleetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأسطول`)
};

export const inbox_history_col_imo = /** @type {(inputs: Inbox_History_Col_ImoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`IMO`)
};

export const inbox_history_col_item = /** @type {(inputs: Inbox_History_Col_ItemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الصنف`)
};

export const inbox_history_col_mailbox = /** @type {(inputs: Inbox_History_Col_MailboxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صندوق البريد`)
};

export const inbox_history_col_po = /** @type {(inputs: Inbox_History_Col_PoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أمر الشراء`)
};

export const inbox_history_col_ports = /** @type {(inputs: Inbox_History_Col_PortsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الموانئ`)
};

export const inbox_history_col_price = /** @type {(inputs: Inbox_History_Col_PriceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السعر`)
};

export const inbox_history_col_quoted = /** @type {(inputs: Inbox_History_Col_QuotedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`البنود المسعّرة`)
};

export const inbox_history_col_quoted_at = /** @type {(inputs: Inbox_History_Col_Quoted_AtInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تاريخ التسعير`)
};

export const inbox_history_col_rfqs = /** @type {(inputs: Inbox_History_Col_RfqsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلبات عروض الأسعار`)
};

export const inbox_history_col_source = /** @type {(inputs: Inbox_History_Col_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المصدر`)
};

export const inbox_history_col_supplier = /** @type {(inputs: Inbox_History_Col_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المورّد`)
};

export const inbox_history_col_vessel = /** @type {(inputs: Inbox_History_Col_VesselInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السفينة`)
};

export const inbox_history_col_years = /** @type {(inputs: Inbox_History_Col_YearsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السنوات`)
};

export const inbox_history_confirm_heading = /** @type {(inputs: Inbox_History_Confirm_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اعتماد استيراد السجل؟`)
};

export const inbox_history_confirm_text = /** @type {(inputs: Inbox_History_Confirm_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`يحفظ ${i?.totals} و${i?.prices} سعرًا مؤرخًا من ${i?.kept} رسالة بعد إزالة التكرار، مع قراراتك (${i?.decisions}) على العناصر غير المؤكدة. تُستبعد العناصر المرفوضة والسرية.`)
};

export const inbox_history_created = /** @type {(inputs: Inbox_History_CreatedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.kind}: ${i?.name}`)
};

export const inbox_history_customers = /** @type {(inputs: Inbox_History_CustomersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العملاء`)
};

export const inbox_history_customers_found = /** @type {(inputs: Inbox_History_Customers_FoundInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`عُثر على ${i?.count} · أعلى 5 حسب طلبات عروض الأسعار`)
};

export const inbox_history_customers_note = /** @type {(inputs: Inbox_History_Customers_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مديرو السفن وملّاكها`)
};

export const inbox_history_dated_prices = /** @type {(inputs: Inbox_History_Dated_PricesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أسعار مؤرخة`)
};

export const inbox_history_dedup_a11y = /** @type {(inputs: Inbox_History_Dedup_A11yInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.label}: حُذف ${i?.count}`)
};

export const inbox_history_dedup_note = /** @type {(inputs: Inbox_History_Dedup_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كثيرًا ما توجد الرسالة نفسها في ثلاثة صناديق بريد. تُحفظ كل رسالة مرة واحدة، مع ربط كل نسخها.`)
};

export const inbox_history_dedup_value = /** @type {(inputs: Inbox_History_Dedup_ValueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`− ${i?.count}`)
};

export const inbox_history_eyebrow = /** @type {(inputs: Inbox_History_EyebrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مكتب التوريد · سجلّك`)
};

export const inbox_history_heading = /** @type {(inputs: Inbox_History_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سجل البريد الوارد`)
};

export const inbox_history_kept = /** @type {(inputs: Inbox_History_KeptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`رسائل العمل المحفوظة`)
};

export const inbox_history_kept_share = /** @type {(inputs: Inbox_History_Kept_ShareInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`من ${i?.scanned} تم فحصها`)
};

export const inbox_history_mailboxes_note = /** @type {(inputs: Inbox_History_Mailboxes_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل صناديق بريد Golden Sea وتصديرات WhatsApp، تُقرأ أولًا في تجربة دون حفظ، ولا يُحفظ شيء قبل الاعتماد.`)
};

export const inbox_history_management = /** @type {(inputs: Inbox_History_ManagementInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإدارة`)
};

export const inbox_history_messages = /** @type {(inputs: Inbox_History_MessagesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الرسائل`)
};

export const inbox_history_new_to_odoo = /** @type {(inputs: Inbox_History_New_To_OdooInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جديد على Odoo`)
};

export const inbox_history_no_po = /** @type {(inputs: Inbox_History_No_PoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`دون أمر شراء، لكنه محفوظ`)
};

export const inbox_history_ordered = /** @type {(inputs: Inbox_History_OrderedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم الطلب`)
};

export const inbox_history_organise_first = /** @type {(inputs: Inbox_History_Organise_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نظّم السجل أولًا.`)
};

export const inbox_history_organise_note = /** @type {(inputs: Inbox_History_Organise_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ثم تعتمد الإدارة الاستيراد. لا يصبح شيء من السجل قيدًا قبل ذلك.`)
};

export const inbox_history_organise_text = /** @type {(inputs: Inbox_History_Organise_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اضغط «تنظيم»: يقرأ الذكاء الاصطناعي الرسائل المحفوظة ويبني عملاءك وسفنك ومورديك وأسعارك المؤرخة. وما لا يتأكد منه يُعرض عليك أولًا.`)
};

export const inbox_history_organised = /** @type {(inputs: Inbox_History_OrganisedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مُنظَّم`)
};

export const inbox_history_pending_decision = /** @type {(inputs: Inbox_History_Pending_DecisionInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`لا عناصر غير مؤكدة تحتاج إلى قرار.`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`عنصر واحد غير مؤكد ما زال يحتاج إلى قرار.`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`عنصران غير مؤكدين ما زالا يحتاجان إلى قرار.`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} عناصر غير مؤكدة ما زالت تحتاج إلى قرار.`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} عنصرًا غير مؤكد ما زال يحتاج إلى قرار.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} عنصر غير مؤكد ما زال يحتاج إلى قرار.`)
};

export const inbox_history_per_year = /** @type {(inputs: Inbox_History_Per_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الرسائل في كل سنة`)
};

export const inbox_history_price = /** @type {(inputs: Inbox_History_PriceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.price} / ${i?.per}`)
};

export const inbox_history_price_hidden = /** @type {(inputs: Inbox_History_Price_HiddenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مخفي لدورك`)
};

export const inbox_history_prices_found = /** @type {(inputs: Inbox_History_Prices_FoundInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} سعرًا، لكلٍّ تاريخه ومدة صلاحيته`)
};

export const inbox_history_prices_note = /** @type {(inputs: Inbox_History_Prices_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} دون أمر شراء`)
};

export const inbox_history_scanned = /** @type {(inputs: Inbox_History_ScannedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} رسالة · 2019–2026`)
};

export const inbox_history_searchable = /** @type {(inputs: Inbox_History_SearchableInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`سجلّك قابل للبحث من اليوم الأول: ${i?.totals} و${i?.prices} سعرًا مؤرخًا.`)
};

export const inbox_history_status_approved = /** @type {(inputs: Inbox_History_Status_ApprovedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الحالة: تم الاستيراد · اعتمده ${i?.by}`)
};

export const inbox_history_status_dry_run = /** @type {(inputs: Inbox_History_Status_Dry_RunInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الحالة: التجربة جاهزة، ولم يُستورد شيء`)
};

export const inbox_history_status_pending = /** @type {(inputs: Inbox_History_Status_PendingInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`الحالة: لا عناصر غير مؤكدة للمراجعة`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`الحالة: عنصر واحد غير مؤكد للمراجعة`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`الحالة: عنصران غير مؤكدين للمراجعة`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`الحالة: ${__paraglideRegistry.icuPound("ar", i?.count, {})} عناصر غير مؤكدة للمراجعة`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`الحالة: ${__paraglideRegistry.icuPound("ar", i?.count, {})} عنصرًا غير مؤكد للمراجعة`);
	return /** @type {LocalizedString} */ (`الحالة: ${__paraglideRegistry.icuPound("ar", i?.count, {})} عنصر غير مؤكد للمراجعة`)
};

export const inbox_history_status_waiting = /** @type {(inputs: Inbox_History_Status_WaitingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الحالة: بانتظار اعتماد الإدارة`)
};

export const inbox_history_step_connect = /** @type {(inputs: Inbox_History_Step_ConnectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ربط صناديق البريد`)
};

export const inbox_history_step_dedup = /** @type {(inputs: Inbox_History_Step_DedupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إزالة التكرار`)
};

export const inbox_history_step_organise = /** @type {(inputs: Inbox_History_Step_OrganiseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التنظيم`)
};

export const inbox_history_step_review = /** @type {(inputs: Inbox_History_Step_ReviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مراجعة غير المؤكد`)
};

export const inbox_history_step_scan = /** @type {(inputs: Inbox_History_Step_ScanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الفحص (تجربة دون حفظ)`)
};

export const inbox_history_subtitle = /** @type {(inputs: Inbox_History_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ننظّم ماضيك لا مستقبلك فقط: كل صندوق بريد، وكل سنة.`)
};

export const inbox_history_suppliers = /** @type {(inputs: Inbox_History_SuppliersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الموردون`)
};

export const inbox_history_suppliers_found = /** @type {(inputs: Inbox_History_Suppliers_FoundInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`عُثر على ${i?.count} · منهم من لم تطلب منه قط`)
};

export const inbox_history_suppliers_note = /** @type {(inputs: Inbox_History_Suppliers_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`من سعّر ماذا`)
};

export const inbox_history_totals = /** @type {(inputs: Inbox_History_TotalsInputs) => LocalizedString} */ (i) => {
	const customersPlural = __paraglideRegistry.plural("ar", i?.customers, {}, true);
	const vesselsPlural = __paraglideRegistry.plural("ar", i?.vessels, {}, true);
	const suppliersPlural = __paraglideRegistry.plural("ar", i?.suppliers, {}, true);
	if (customersPlural === "zero" && vesselsPlural === "zero" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`لا عملاء، لا سفن، لا موردين`);
	if (customersPlural === "one" && vesselsPlural === "zero" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`عميل واحد، لا سفن، لا موردين`);
	if (customersPlural === "two" && vesselsPlural === "zero" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`عميلان، لا سفن، لا موردين`);
	if (customersPlural === "few" && vesselsPlural === "zero" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، لا سفن، لا موردين`);
	if (customersPlural === "many" && vesselsPlural === "zero" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، لا سفن، لا موردين`);
	if (customersPlural === "zero" && vesselsPlural === "one" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`لا عملاء، سفينة واحدة، لا موردين`);
	if (customersPlural === "one" && vesselsPlural === "one" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`عميل واحد، سفينة واحدة، لا موردين`);
	if (customersPlural === "two" && vesselsPlural === "one" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`عميلان، سفينة واحدة، لا موردين`);
	if (customersPlural === "few" && vesselsPlural === "one" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، سفينة واحدة، لا موردين`);
	if (customersPlural === "many" && vesselsPlural === "one" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، سفينة واحدة، لا موردين`);
	if (customersPlural === "zero" && vesselsPlural === "two" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`لا عملاء، سفينتان، لا موردين`);
	if (customersPlural === "one" && vesselsPlural === "two" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`عميل واحد، سفينتان، لا موردين`);
	if (customersPlural === "two" && vesselsPlural === "two" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`عميلان، سفينتان، لا موردين`);
	if (customersPlural === "few" && vesselsPlural === "two" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، سفينتان، لا موردين`);
	if (customersPlural === "many" && vesselsPlural === "two" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، سفينتان، لا موردين`);
	if (customersPlural === "zero" && vesselsPlural === "few" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`لا عملاء، ${i?.vesselsText} سفن، لا موردين`);
	if (customersPlural === "one" && vesselsPlural === "few" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`عميل واحد، ${i?.vesselsText} سفن، لا موردين`);
	if (customersPlural === "two" && vesselsPlural === "few" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`عميلان، ${i?.vesselsText} سفن، لا موردين`);
	if (customersPlural === "few" && vesselsPlural === "few" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، ${i?.vesselsText} سفن، لا موردين`);
	if (customersPlural === "many" && vesselsPlural === "few" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، ${i?.vesselsText} سفن، لا موردين`);
	if (customersPlural === "zero" && vesselsPlural === "many" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`لا عملاء، ${i?.vesselsText} سفينة، لا موردين`);
	if (customersPlural === "one" && vesselsPlural === "many" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`عميل واحد، ${i?.vesselsText} سفينة، لا موردين`);
	if (customersPlural === "two" && vesselsPlural === "many" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`عميلان، ${i?.vesselsText} سفينة، لا موردين`);
	if (customersPlural === "few" && vesselsPlural === "many" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، ${i?.vesselsText} سفينة، لا موردين`);
	if (customersPlural === "many" && vesselsPlural === "many" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، ${i?.vesselsText} سفينة، لا موردين`);
	if (customersPlural === "zero" && vesselsPlural === "zero" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`لا عملاء، لا سفن، مورّد واحد`);
	if (customersPlural === "one" && vesselsPlural === "zero" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`عميل واحد، لا سفن، مورّد واحد`);
	if (customersPlural === "two" && vesselsPlural === "zero" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`عميلان، لا سفن، مورّد واحد`);
	if (customersPlural === "few" && vesselsPlural === "zero" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، لا سفن، مورّد واحد`);
	if (customersPlural === "many" && vesselsPlural === "zero" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، لا سفن، مورّد واحد`);
	if (customersPlural === "zero" && vesselsPlural === "one" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`لا عملاء، سفينة واحدة، مورّد واحد`);
	if (customersPlural === "one" && vesselsPlural === "one" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`عميل واحد، سفينة واحدة، مورّد واحد`);
	if (customersPlural === "two" && vesselsPlural === "one" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`عميلان، سفينة واحدة، مورّد واحد`);
	if (customersPlural === "few" && vesselsPlural === "one" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، سفينة واحدة، مورّد واحد`);
	if (customersPlural === "many" && vesselsPlural === "one" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، سفينة واحدة، مورّد واحد`);
	if (customersPlural === "zero" && vesselsPlural === "two" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`لا عملاء، سفينتان، مورّد واحد`);
	if (customersPlural === "one" && vesselsPlural === "two" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`عميل واحد، سفينتان، مورّد واحد`);
	if (customersPlural === "two" && vesselsPlural === "two" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`عميلان، سفينتان، مورّد واحد`);
	if (customersPlural === "few" && vesselsPlural === "two" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، سفينتان، مورّد واحد`);
	if (customersPlural === "many" && vesselsPlural === "two" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، سفينتان، مورّد واحد`);
	if (customersPlural === "zero" && vesselsPlural === "few" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`لا عملاء، ${i?.vesselsText} سفن، مورّد واحد`);
	if (customersPlural === "one" && vesselsPlural === "few" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`عميل واحد، ${i?.vesselsText} سفن، مورّد واحد`);
	if (customersPlural === "two" && vesselsPlural === "few" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`عميلان، ${i?.vesselsText} سفن، مورّد واحد`);
	if (customersPlural === "few" && vesselsPlural === "few" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، ${i?.vesselsText} سفن، مورّد واحد`);
	if (customersPlural === "many" && vesselsPlural === "few" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، ${i?.vesselsText} سفن، مورّد واحد`);
	if (customersPlural === "zero" && vesselsPlural === "many" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`لا عملاء، ${i?.vesselsText} سفينة، مورّد واحد`);
	if (customersPlural === "one" && vesselsPlural === "many" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`عميل واحد، ${i?.vesselsText} سفينة، مورّد واحد`);
	if (customersPlural === "two" && vesselsPlural === "many" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`عميلان، ${i?.vesselsText} سفينة، مورّد واحد`);
	if (customersPlural === "few" && vesselsPlural === "many" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، ${i?.vesselsText} سفينة، مورّد واحد`);
	if (customersPlural === "many" && vesselsPlural === "many" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، ${i?.vesselsText} سفينة، مورّد واحد`);
	if (customersPlural === "zero" && vesselsPlural === "zero" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`لا عملاء، لا سفن، مورّدان`);
	if (customersPlural === "one" && vesselsPlural === "zero" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`عميل واحد، لا سفن، مورّدان`);
	if (customersPlural === "two" && vesselsPlural === "zero" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`عميلان، لا سفن، مورّدان`);
	if (customersPlural === "few" && vesselsPlural === "zero" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، لا سفن، مورّدان`);
	if (customersPlural === "many" && vesselsPlural === "zero" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، لا سفن، مورّدان`);
	if (customersPlural === "zero" && vesselsPlural === "one" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`لا عملاء، سفينة واحدة، مورّدان`);
	if (customersPlural === "one" && vesselsPlural === "one" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`عميل واحد، سفينة واحدة، مورّدان`);
	if (customersPlural === "two" && vesselsPlural === "one" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`عميلان، سفينة واحدة، مورّدان`);
	if (customersPlural === "few" && vesselsPlural === "one" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، سفينة واحدة، مورّدان`);
	if (customersPlural === "many" && vesselsPlural === "one" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، سفينة واحدة، مورّدان`);
	if (customersPlural === "zero" && vesselsPlural === "two" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`لا عملاء، سفينتان، مورّدان`);
	if (customersPlural === "one" && vesselsPlural === "two" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`عميل واحد، سفينتان، مورّدان`);
	if (customersPlural === "two" && vesselsPlural === "two" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`عميلان، سفينتان، مورّدان`);
	if (customersPlural === "few" && vesselsPlural === "two" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، سفينتان، مورّدان`);
	if (customersPlural === "many" && vesselsPlural === "two" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، سفينتان، مورّدان`);
	if (customersPlural === "zero" && vesselsPlural === "few" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`لا عملاء، ${i?.vesselsText} سفن، مورّدان`);
	if (customersPlural === "one" && vesselsPlural === "few" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`عميل واحد، ${i?.vesselsText} سفن، مورّدان`);
	if (customersPlural === "two" && vesselsPlural === "few" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`عميلان، ${i?.vesselsText} سفن، مورّدان`);
	if (customersPlural === "few" && vesselsPlural === "few" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، ${i?.vesselsText} سفن، مورّدان`);
	if (customersPlural === "many" && vesselsPlural === "few" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، ${i?.vesselsText} سفن، مورّدان`);
	if (customersPlural === "zero" && vesselsPlural === "many" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`لا عملاء، ${i?.vesselsText} سفينة، مورّدان`);
	if (customersPlural === "one" && vesselsPlural === "many" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`عميل واحد، ${i?.vesselsText} سفينة، مورّدان`);
	if (customersPlural === "two" && vesselsPlural === "many" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`عميلان، ${i?.vesselsText} سفينة، مورّدان`);
	if (customersPlural === "few" && vesselsPlural === "many" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، ${i?.vesselsText} سفينة، مورّدان`);
	if (customersPlural === "many" && vesselsPlural === "many" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، ${i?.vesselsText} سفينة، مورّدان`);
	if (customersPlural === "zero" && vesselsPlural === "zero" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`لا عملاء، لا سفن، ${i?.suppliersText} موردين`);
	if (customersPlural === "one" && vesselsPlural === "zero" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`عميل واحد، لا سفن، ${i?.suppliersText} موردين`);
	if (customersPlural === "two" && vesselsPlural === "zero" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`عميلان، لا سفن، ${i?.suppliersText} موردين`);
	if (customersPlural === "few" && vesselsPlural === "zero" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، لا سفن، ${i?.suppliersText} موردين`);
	if (customersPlural === "many" && vesselsPlural === "zero" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، لا سفن، ${i?.suppliersText} موردين`);
	if (customersPlural === "zero" && vesselsPlural === "one" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`لا عملاء، سفينة واحدة، ${i?.suppliersText} موردين`);
	if (customersPlural === "one" && vesselsPlural === "one" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`عميل واحد، سفينة واحدة، ${i?.suppliersText} موردين`);
	if (customersPlural === "two" && vesselsPlural === "one" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`عميلان، سفينة واحدة، ${i?.suppliersText} موردين`);
	if (customersPlural === "few" && vesselsPlural === "one" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، سفينة واحدة، ${i?.suppliersText} موردين`);
	if (customersPlural === "many" && vesselsPlural === "one" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، سفينة واحدة، ${i?.suppliersText} موردين`);
	if (customersPlural === "zero" && vesselsPlural === "two" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`لا عملاء، سفينتان، ${i?.suppliersText} موردين`);
	if (customersPlural === "one" && vesselsPlural === "two" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`عميل واحد، سفينتان، ${i?.suppliersText} موردين`);
	if (customersPlural === "two" && vesselsPlural === "two" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`عميلان، سفينتان، ${i?.suppliersText} موردين`);
	if (customersPlural === "few" && vesselsPlural === "two" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، سفينتان، ${i?.suppliersText} موردين`);
	if (customersPlural === "many" && vesselsPlural === "two" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، سفينتان، ${i?.suppliersText} موردين`);
	if (customersPlural === "zero" && vesselsPlural === "few" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`لا عملاء، ${i?.vesselsText} سفن، ${i?.suppliersText} موردين`);
	if (customersPlural === "one" && vesselsPlural === "few" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`عميل واحد، ${i?.vesselsText} سفن، ${i?.suppliersText} موردين`);
	if (customersPlural === "two" && vesselsPlural === "few" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`عميلان، ${i?.vesselsText} سفن، ${i?.suppliersText} موردين`);
	if (customersPlural === "few" && vesselsPlural === "few" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، ${i?.vesselsText} سفن، ${i?.suppliersText} موردين`);
	if (customersPlural === "many" && vesselsPlural === "few" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، ${i?.vesselsText} سفن، ${i?.suppliersText} موردين`);
	if (customersPlural === "zero" && vesselsPlural === "many" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`لا عملاء، ${i?.vesselsText} سفينة، ${i?.suppliersText} موردين`);
	if (customersPlural === "one" && vesselsPlural === "many" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`عميل واحد، ${i?.vesselsText} سفينة، ${i?.suppliersText} موردين`);
	if (customersPlural === "two" && vesselsPlural === "many" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`عميلان، ${i?.vesselsText} سفينة، ${i?.suppliersText} موردين`);
	if (customersPlural === "few" && vesselsPlural === "many" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، ${i?.vesselsText} سفينة، ${i?.suppliersText} موردين`);
	if (customersPlural === "many" && vesselsPlural === "many" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، ${i?.vesselsText} سفينة، ${i?.suppliersText} موردين`);
	if (customersPlural === "zero" && vesselsPlural === "zero" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`لا عملاء، لا سفن، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "one" && vesselsPlural === "zero" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`عميل واحد، لا سفن، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "two" && vesselsPlural === "zero" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`عميلان، لا سفن، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "few" && vesselsPlural === "zero" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، لا سفن، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "many" && vesselsPlural === "zero" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، لا سفن، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "zero" && vesselsPlural === "one" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`لا عملاء، سفينة واحدة، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "one" && vesselsPlural === "one" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`عميل واحد، سفينة واحدة، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "two" && vesselsPlural === "one" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`عميلان، سفينة واحدة، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "few" && vesselsPlural === "one" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، سفينة واحدة، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "many" && vesselsPlural === "one" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، سفينة واحدة، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "zero" && vesselsPlural === "two" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`لا عملاء، سفينتان، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "one" && vesselsPlural === "two" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`عميل واحد، سفينتان، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "two" && vesselsPlural === "two" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`عميلان، سفينتان، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "few" && vesselsPlural === "two" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، سفينتان، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "many" && vesselsPlural === "two" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، سفينتان، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "zero" && vesselsPlural === "few" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`لا عملاء، ${i?.vesselsText} سفن، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "one" && vesselsPlural === "few" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`عميل واحد، ${i?.vesselsText} سفن، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "two" && vesselsPlural === "few" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`عميلان، ${i?.vesselsText} سفن، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "few" && vesselsPlural === "few" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، ${i?.vesselsText} سفن، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "many" && vesselsPlural === "few" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، ${i?.vesselsText} سفن، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "zero" && vesselsPlural === "many" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`لا عملاء، ${i?.vesselsText} سفينة، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "one" && vesselsPlural === "many" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`عميل واحد، ${i?.vesselsText} سفينة، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "two" && vesselsPlural === "many" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`عميلان، ${i?.vesselsText} سفينة، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "few" && vesselsPlural === "many" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، ${i?.vesselsText} سفينة، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "many" && vesselsPlural === "many" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، ${i?.vesselsText} سفينة، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "zero" && vesselsPlural === "zero") return /** @type {LocalizedString} */ (`لا عملاء، لا سفن، ${i?.suppliersText} مورّد`);
	if (customersPlural === "one" && vesselsPlural === "zero") return /** @type {LocalizedString} */ (`عميل واحد، لا سفن، ${i?.suppliersText} مورّد`);
	if (customersPlural === "two" && vesselsPlural === "zero") return /** @type {LocalizedString} */ (`عميلان، لا سفن، ${i?.suppliersText} مورّد`);
	if (customersPlural === "few" && vesselsPlural === "zero") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، لا سفن، ${i?.suppliersText} مورّد`);
	if (customersPlural === "many" && vesselsPlural === "zero") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، لا سفن، ${i?.suppliersText} مورّد`);
	if (customersPlural === "zero" && vesselsPlural === "one") return /** @type {LocalizedString} */ (`لا عملاء، سفينة واحدة، ${i?.suppliersText} مورّد`);
	if (customersPlural === "one" && vesselsPlural === "one") return /** @type {LocalizedString} */ (`عميل واحد، سفينة واحدة، ${i?.suppliersText} مورّد`);
	if (customersPlural === "two" && vesselsPlural === "one") return /** @type {LocalizedString} */ (`عميلان، سفينة واحدة، ${i?.suppliersText} مورّد`);
	if (customersPlural === "few" && vesselsPlural === "one") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، سفينة واحدة، ${i?.suppliersText} مورّد`);
	if (customersPlural === "many" && vesselsPlural === "one") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، سفينة واحدة، ${i?.suppliersText} مورّد`);
	if (customersPlural === "zero" && vesselsPlural === "two") return /** @type {LocalizedString} */ (`لا عملاء، سفينتان، ${i?.suppliersText} مورّد`);
	if (customersPlural === "one" && vesselsPlural === "two") return /** @type {LocalizedString} */ (`عميل واحد، سفينتان، ${i?.suppliersText} مورّد`);
	if (customersPlural === "two" && vesselsPlural === "two") return /** @type {LocalizedString} */ (`عميلان، سفينتان، ${i?.suppliersText} مورّد`);
	if (customersPlural === "few" && vesselsPlural === "two") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، سفينتان، ${i?.suppliersText} مورّد`);
	if (customersPlural === "many" && vesselsPlural === "two") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، سفينتان، ${i?.suppliersText} مورّد`);
	if (customersPlural === "zero" && vesselsPlural === "few") return /** @type {LocalizedString} */ (`لا عملاء، ${i?.vesselsText} سفن، ${i?.suppliersText} مورّد`);
	if (customersPlural === "one" && vesselsPlural === "few") return /** @type {LocalizedString} */ (`عميل واحد، ${i?.vesselsText} سفن، ${i?.suppliersText} مورّد`);
	if (customersPlural === "two" && vesselsPlural === "few") return /** @type {LocalizedString} */ (`عميلان، ${i?.vesselsText} سفن، ${i?.suppliersText} مورّد`);
	if (customersPlural === "few" && vesselsPlural === "few") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، ${i?.vesselsText} سفن، ${i?.suppliersText} مورّد`);
	if (customersPlural === "many" && vesselsPlural === "few") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، ${i?.vesselsText} سفن، ${i?.suppliersText} مورّد`);
	if (customersPlural === "zero" && vesselsPlural === "many") return /** @type {LocalizedString} */ (`لا عملاء، ${i?.vesselsText} سفينة، ${i?.suppliersText} مورّد`);
	if (customersPlural === "one" && vesselsPlural === "many") return /** @type {LocalizedString} */ (`عميل واحد، ${i?.vesselsText} سفينة، ${i?.suppliersText} مورّد`);
	if (customersPlural === "two" && vesselsPlural === "many") return /** @type {LocalizedString} */ (`عميلان، ${i?.vesselsText} سفينة، ${i?.suppliersText} مورّد`);
	if (customersPlural === "few" && vesselsPlural === "many") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، ${i?.vesselsText} سفينة، ${i?.suppliersText} مورّد`);
	if (customersPlural === "many" && vesselsPlural === "many") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، ${i?.vesselsText} سفينة، ${i?.suppliersText} مورّد`);
	if (customersPlural === "zero" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`لا عملاء، ${i?.vesselsText} سفينة، لا موردين`);
	if (customersPlural === "one" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`عميل واحد، ${i?.vesselsText} سفينة، لا موردين`);
	if (customersPlural === "two" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`عميلان، ${i?.vesselsText} سفينة، لا موردين`);
	if (customersPlural === "few" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، ${i?.vesselsText} سفينة، لا موردين`);
	if (customersPlural === "many" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، ${i?.vesselsText} سفينة، لا موردين`);
	if (customersPlural === "zero" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`لا عملاء، ${i?.vesselsText} سفينة، مورّد واحد`);
	if (customersPlural === "one" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`عميل واحد، ${i?.vesselsText} سفينة، مورّد واحد`);
	if (customersPlural === "two" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`عميلان، ${i?.vesselsText} سفينة، مورّد واحد`);
	if (customersPlural === "few" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، ${i?.vesselsText} سفينة، مورّد واحد`);
	if (customersPlural === "many" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، ${i?.vesselsText} سفينة، مورّد واحد`);
	if (customersPlural === "zero" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`لا عملاء، ${i?.vesselsText} سفينة، مورّدان`);
	if (customersPlural === "one" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`عميل واحد، ${i?.vesselsText} سفينة، مورّدان`);
	if (customersPlural === "two" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`عميلان، ${i?.vesselsText} سفينة، مورّدان`);
	if (customersPlural === "few" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، ${i?.vesselsText} سفينة، مورّدان`);
	if (customersPlural === "many" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، ${i?.vesselsText} سفينة، مورّدان`);
	if (customersPlural === "zero" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`لا عملاء، ${i?.vesselsText} سفينة، ${i?.suppliersText} موردين`);
	if (customersPlural === "one" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`عميل واحد، ${i?.vesselsText} سفينة، ${i?.suppliersText} موردين`);
	if (customersPlural === "two" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`عميلان، ${i?.vesselsText} سفينة، ${i?.suppliersText} موردين`);
	if (customersPlural === "few" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، ${i?.vesselsText} سفينة، ${i?.suppliersText} موردين`);
	if (customersPlural === "many" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، ${i?.vesselsText} سفينة، ${i?.suppliersText} موردين`);
	if (customersPlural === "zero" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`لا عملاء، ${i?.vesselsText} سفينة، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "one" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`عميل واحد، ${i?.vesselsText} سفينة، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "two" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`عميلان، ${i?.vesselsText} سفينة، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "few" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، ${i?.vesselsText} سفينة، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "many" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، ${i?.vesselsText} سفينة، ${i?.suppliersText} مورّدًا`);
	if (customersPlural === "zero") return /** @type {LocalizedString} */ (`لا عملاء، ${i?.vesselsText} سفينة، ${i?.suppliersText} مورّد`);
	if (customersPlural === "one") return /** @type {LocalizedString} */ (`عميل واحد، ${i?.vesselsText} سفينة، ${i?.suppliersText} مورّد`);
	if (customersPlural === "two") return /** @type {LocalizedString} */ (`عميلان، ${i?.vesselsText} سفينة، ${i?.suppliersText} مورّد`);
	if (customersPlural === "few") return /** @type {LocalizedString} */ (`${i?.customersText} عملاء، ${i?.vesselsText} سفينة، ${i?.suppliersText} مورّد`);
	if (customersPlural === "many") return /** @type {LocalizedString} */ (`${i?.customersText} عميلًا، ${i?.vesselsText} سفينة، ${i?.suppliersText} مورّد`);
	if (vesselsPlural === "zero" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، لا سفن، لا موردين`);
	if (vesselsPlural === "one" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، سفينة واحدة، لا موردين`);
	if (vesselsPlural === "two" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، سفينتان، لا موردين`);
	if (vesselsPlural === "few" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، ${i?.vesselsText} سفن، لا موردين`);
	if (vesselsPlural === "many" && suppliersPlural === "zero") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، ${i?.vesselsText} سفينة، لا موردين`);
	if (vesselsPlural === "zero" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، لا سفن، مورّد واحد`);
	if (vesselsPlural === "one" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، سفينة واحدة، مورّد واحد`);
	if (vesselsPlural === "two" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، سفينتان، مورّد واحد`);
	if (vesselsPlural === "few" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، ${i?.vesselsText} سفن، مورّد واحد`);
	if (vesselsPlural === "many" && suppliersPlural === "one") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، ${i?.vesselsText} سفينة، مورّد واحد`);
	if (vesselsPlural === "zero" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، لا سفن، مورّدان`);
	if (vesselsPlural === "one" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، سفينة واحدة، مورّدان`);
	if (vesselsPlural === "two" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، سفينتان، مورّدان`);
	if (vesselsPlural === "few" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، ${i?.vesselsText} سفن، مورّدان`);
	if (vesselsPlural === "many" && suppliersPlural === "two") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، ${i?.vesselsText} سفينة، مورّدان`);
	if (vesselsPlural === "zero" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، لا سفن، ${i?.suppliersText} موردين`);
	if (vesselsPlural === "one" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، سفينة واحدة، ${i?.suppliersText} موردين`);
	if (vesselsPlural === "two" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، سفينتان، ${i?.suppliersText} موردين`);
	if (vesselsPlural === "few" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، ${i?.vesselsText} سفن، ${i?.suppliersText} موردين`);
	if (vesselsPlural === "many" && suppliersPlural === "few") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، ${i?.vesselsText} سفينة، ${i?.suppliersText} موردين`);
	if (vesselsPlural === "zero" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، لا سفن، ${i?.suppliersText} مورّدًا`);
	if (vesselsPlural === "one" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، سفينة واحدة، ${i?.suppliersText} مورّدًا`);
	if (vesselsPlural === "two" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، سفينتان، ${i?.suppliersText} مورّدًا`);
	if (vesselsPlural === "few" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، ${i?.vesselsText} سفن، ${i?.suppliersText} مورّدًا`);
	if (vesselsPlural === "many" && suppliersPlural === "many") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، ${i?.vesselsText} سفينة، ${i?.suppliersText} مورّدًا`);
	if (vesselsPlural === "zero") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، لا سفن، ${i?.suppliersText} مورّد`);
	if (vesselsPlural === "one") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، سفينة واحدة، ${i?.suppliersText} مورّد`);
	if (vesselsPlural === "two") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، سفينتان، ${i?.suppliersText} مورّد`);
	if (vesselsPlural === "few") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، ${i?.vesselsText} سفن، ${i?.suppliersText} مورّد`);
	if (vesselsPlural === "many") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، ${i?.vesselsText} سفينة، ${i?.suppliersText} مورّد`);
	if (suppliersPlural === "zero") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، ${i?.vesselsText} سفينة، لا موردين`);
	if (suppliersPlural === "one") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، ${i?.vesselsText} سفينة، مورّد واحد`);
	if (suppliersPlural === "two") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، ${i?.vesselsText} سفينة، مورّدان`);
	if (suppliersPlural === "few") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، ${i?.vesselsText} سفينة، ${i?.suppliersText} موردين`);
	if (suppliersPlural === "many") return /** @type {LocalizedString} */ (`${i?.customersText} عميل، ${i?.vesselsText} سفينة، ${i?.suppliersText} مورّدًا`);
	return /** @type {LocalizedString} */ (`${i?.customersText} عميل، ${i?.vesselsText} سفينة، ${i?.suppliersText} مورّد`)
};

export const inbox_history_vessels = /** @type {(inputs: Inbox_History_VesselsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السفن`)
};

export const inbox_history_vessels_found = /** @type {(inputs: Inbox_History_Vessels_FoundInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`عُثر على ${i?.count} · مطابقة برقم IMO مع حفظ الأسماء السابقة`)
};

export const inbox_history_vessels_note = /** @type {(inputs: Inbox_History_Vessels_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`IMO · الأسطول · الموانئ`)
};

export const inbox_kept_as_received = /** @type {(inputs: Inbox_Kept_As_ReceivedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`محفوظة كما وردت`)
};

export const inbox_kind_complaint = /** @type {(inputs: Inbox_Kind_ComplaintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`شكوى`)
};

export const inbox_kind_delivery = /** @type {(inputs: Inbox_Kind_DeliveryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسليم أو شحن`)
};

export const inbox_kind_invoice = /** @type {(inputs: Inbox_Kind_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استفسار عن فاتورة أو دفعة`)
};

export const inbox_kind_offer = /** @type {(inputs: Inbox_Kind_OfferInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عرض أو رد من مورّد`)
};

export const inbox_kind_order = /** @type {(inputs: Inbox_Kind_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أمر شراء أو طلب من عميل`)
};

export const inbox_kind_other = /** @type {(inputs: Inbox_Kind_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أخرى`)
};

export const inbox_kind_rfq = /** @type {(inputs: Inbox_Kind_RfqInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلب عرض أسعار جديد`)
};

export const inbox_linked = /** @type {(inputs: Inbox_LinkedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مرتبطة بالملف ${i?.caseId}.`)
};

export const inbox_linked_by = /** @type {(inputs: Inbox_Linked_ByInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`ربطها ${i?.by} بالملف ${i?.caseId}.`)
};

export const inbox_linked_text = /** @type {(inputs: Inbox_Linked_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عرضها وملفاتها في الملف.`)
};

export const inbox_low_confidence = /** @type {(inputs: Inbox_Low_ConfidenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`القيم منخفضة الثقة لا تُطبَّق أبدًا دون أن يراجعها شخص.`)
};

export const inbox_match = /** @type {(inputs: Inbox_MatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مطابقة الرد`)
};

export const inbox_match_text = /** @type {(inputs: Inbox_Match_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تُطابق الردود بمرجع طلب عرض الأسعار المرسل للمورد حتى لو تغيّر الموضوع، والرسائل المُعاد توجيهها بملفاتها. تحت 85% يقرر شخص.`)
};

export const inbox_match_uncertain = /** @type {(inputs: Inbox_Match_UncertainInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المطابقة غير مؤكدة، لذا لم تُربط. اختر ملفها في «مطابقة الرد»، أو علّمها غير ذات صلة.`)
};

export const inbox_message_id = /** @type {(inputs: Inbox_Message_IdInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`معرّف الرسالة ${i?.id} · إعادة معالجة الرسالة نفسها لا تُنشئ ملفًا ثانيًا ولا إشعار استلام ثانيًا.`)
};

export const inbox_new_customer = /** @type {(inputs: Inbox_New_CustomerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عميل جديد`)
};

export const inbox_next_rfqs = /** @type {(inputs: Inbox_Next_RfqsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التالي: أرسل طلبات عروض الأسعار إلى الموردين لبنوده.`)
};

export const inbox_no_clarification = /** @type {(inputs: Inbox_No_ClarificationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم تُكتب مسودة طلب توضيح لهذه.`)
};

export const inbox_no_text = /** @type {(inputs: Inbox_No_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`(بلا نص)`)
};

export const inbox_not_an_rfq = /** @type {(inputs: Inbox_Not_An_RfqInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ليست طلب عرض أسعار`)
};

export const inbox_not_related = /** @type {(inputs: Inbox_Not_RelatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عُلّمت غير ذات صلة.`)
};

export const inbox_not_related_by = /** @type {(inputs: Inbox_Not_Related_ByInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`علّمها ${i?.by} غير ذات صلة.`)
};

export const inbox_not_rfq = /** @type {(inputs: Inbox_Not_RfqInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عُلّمت «ليست طلب عرض أسعار».`)
};

export const inbox_nothing_more = /** @type {(inputs: Inbox_Nothing_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا شيء آخر يُفعل بهذه الرسالة.`)
};

export const inbox_offer_currency = /** @type {(inputs: Inbox_Offer_CurrencyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العملة`)
};

export const inbox_offer_extract = /** @type {(inputs: Inbox_Offer_ExtractInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استخراج تفاصيل العرض`)
};

export const inbox_offer_item = /** @type {(inputs: Inbox_Offer_ItemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الصنف المعروض`)
};

export const inbox_offer_lead_time = /** @type {(inputs: Inbox_Offer_Lead_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مدة التوريد`)
};

export const inbox_offer_pack = /** @type {(inputs: Inbox_Offer_PackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الوحدة / حجم العبوة`)
};

export const inbox_offer_price = /** @type {(inputs: Inbox_Offer_PriceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سعر الوحدة`)
};

export const inbox_offer_validity = /** @type {(inputs: Inbox_Offer_ValidityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صالح حتى`)
};

export const inbox_open_case = /** @type {(inputs: Inbox_Open_CaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فتح الملف`)
};

export const inbox_order = /** @type {(inputs: Inbox_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الترتيب`)
};

export const inbox_order_newest = /** @type {(inputs: Inbox_Order_NewestInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأحدث أولًا`)
};

export const inbox_order_urgent = /** @type {(inputs: Inbox_Order_UrgentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأكثر إلحاحًا أولًا`)
};

export const inbox_owner = /** @type {(inputs: Inbox_OwnerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المسؤول`)
};

export const inbox_pick_message = /** @type {(inputs: Inbox_Pick_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختر رسالة من القائمة.`)
};

export const inbox_quote_deadline = /** @type {(inputs: Inbox_Quote_DeadlineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الموعد النهائي لعرض السعر`)
};

export const inbox_reminder_scheduled = /** @type {(inputs: Inbox_Reminder_ScheduledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جُدول تذكير قبله.`)
};

export const inbox_send_rfqs = /** @type {(inputs: Inbox_Send_RfqsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إرسال طلبات عروض الأسعار للموردين`)
};

export const inbox_show = /** @type {(inputs: Inbox_ShowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عرض الرسائل`)
};

export const inbox_show_all = /** @type {(inputs: Inbox_Show_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الكل`)
};

export const inbox_show_linked = /** @type {(inputs: Inbox_Show_LinkedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مرتبطة`)
};

export const inbox_show_new = /** @type {(inputs: Inbox_Show_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جديدة`)
};

export const inbox_show_review = /** @type {(inputs: Inbox_Show_ReviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تحتاج إلى مراجعة`)
};

export const inbox_show_review_count = /** @type {(inputs: Inbox_Show_Review_CountInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تحتاج إلى مراجعة · ${i?.count}`)
};

export const inbox_to = /** @type {(inputs: Inbox_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`إلى: ${i?.name} <${i?.email}>`)
};

export const inbox_today = /** @type {(inputs: Inbox_TodayInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`عولج اليوم: ${i?.processed} · تكرارات حُجبت: ${i?.duplicates} · بانتظار شخص: ${i?.review}`)
};

export const inbox_via = /** @type {(inputs: Inbox_ViaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`عبر: ${i?.via} · ${i?.when}`)
};

export const index_money = /** @type {(inputs: Index_MoneyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} ${i?.currency}`)
};

export const index_money_k = /** @type {(inputs: Index_Money_KInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} ألف ${i?.currency}`)
};

export const integrations_ack_from = /** @type {(inputs: Integrations_Ack_FromInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`من: Golden Sea <${i?.from}>`)
};

export const integrations_ack_note = /** @type {(inputs: Integrations_Ack_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مثال للملف GS-RFQ-0142. اعتمدت الإدارة الصياغة والمستلمين وشرط الإرسال، وأي تغيير فيها يحتاج إلى اعتماد جديد.`)
};

export const integrations_ack_status = /** @type {(inputs: Integrations_Ack_StatusInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.status} الإصدار ${i?.version} · ${i?.approvedBy}`)
};

export const integrations_ack_to = /** @type {(inputs: Integrations_Ack_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`إلى: ${i?.to}`)
};

export const integrations_all_templates = /** @type {(inputs: Integrations_All_TemplatesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل قوالب الرسائل`)
};

export const integrations_backups_note = /** @type {(inputs: Integrations_Backups_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`في النسخة التجريبية تُجرَّب التغييرات قبل أن تصل إلى فريقك، وإرسال البريد والتكاملات متوقفة فيها. بياناتك ملكك دائمًا: صدّرها كلها في أي وقت.`)
};

export const integrations_checked_label = /** @type {(inputs: Integrations_Checked_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مطابَق مع Odoo`)
};

export const integrations_checked_note = /** @type {(inputs: Integrations_Checked_NoteInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`لم يراجع شخص أي سجل`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`سجل واحد راجعه شخص`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`سجلان راجعهما شخص`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`${i?.checked} سجلات راجعها شخص`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`${i?.checked} سجلًا راجعه شخص`);
	return /** @type {LocalizedString} */ (`${i?.checked} سجل راجعه شخص`)
};

export const integrations_company_default = /** @type {(inputs: Integrations_Company_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لغة الشركة الافتراضية`)
};

export const integrations_confidential = /** @type {(inputs: Integrations_ConfidentialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مُعلَّمة سرية`)
};

export const integrations_confidential_note = /** @type {(inputs: Integrations_Confidential_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مستبعدة ما لم تُعتمد`)
};

export const integrations_copies = /** @type {(inputs: Integrations_CopiesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النسخ`)
};

export const integrations_copies_value = /** @type {(inputs: Integrations_Copies_ValueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`المواقع: ${i?.locations} · مدة الحفظ بالأيام: ${i?.days}`)
};

export const integrations_documents_ar = /** @type {(inputs: Integrations_Documents_ArInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مستندات العملاء بالعربية`)
};

export const integrations_documents_en = /** @type {(inputs: Integrations_Documents_EnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مستندات العملاء بالإنجليزية`)
};

export const integrations_duplicates = /** @type {(inputs: Integrations_DuplicatesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تكرارات محتملة`)
};

export const integrations_duplicates_note = /** @type {(inputs: Integrations_Duplicates_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تُربط ولا يُعاد إنشاؤها`)
};

export const integrations_emails_scanned = /** @type {(inputs: Integrations_Emails_ScannedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الرسائل المفحوصة`)
};

export const integrations_exceptions = /** @type {(inputs: Integrations_ExceptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الاستثناءات`)
};

export const integrations_exceptions_note = /** @type {(inputs: Integrations_Exceptions_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مرفقات تعذّرت قراءتها`)
};

export const integrations_import_days = /** @type {(inputs: Integrations_Import_DaysInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`${i?.days} يوم`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`يوم واحد`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`يومان`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`${i?.days} أيام`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`${i?.days} يومًا`);
	return /** @type {LocalizedString} */ (`${i?.days} يوم`)
};

export const integrations_import_note = /** @type {(inputs: Integrations_Import_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تشغيل تجريبي أولًا: لا يُستورد شيء قبل الاعتماد، ولا تُرسل إشعارات استلام أو تذكيرات للرسائل السابقة.`)
};

export const integrations_lang_ar = /** @type {(inputs: Integrations_Lang_ArInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العربية`)
};

export const integrations_languages_note = /** @type {(inputs: Integrations_Languages_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تعمل المنصة كلها بالإنجليزية والعربية: تُرسل إشعارات الاستلام وعروض الأسعار والفواتير بلغة العميل.`)
};

export const integrations_last_backup = /** @type {(inputs: Integrations_Last_BackupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`آخر نسخة احتياطية`)
};

export const integrations_migration_note = /** @type {(inputs: Integrations_Migration_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يستمر Odoo في العمل بجانب المنصة أثناء نقل بياناته. لا يُعدَّل أي شيء في Odoo ولا يُحذف.`)
};

export const integrations_moved_label = /** @type {(inputs: Integrations_Moved_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نُقل إلى المنصة`)
};

export const integrations_moved_note = /** @type {(inputs: Integrations_Moved_NoteInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`${i?.moved} من ${i?.all} سجل`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`${i?.moved} من سجل واحد`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`${i?.moved} من سجلين`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`${i?.moved} من ${i?.all} سجلات`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`${i?.moved} من ${i?.all} سجلًا`);
	return /** @type {LocalizedString} */ (`${i?.moved} من ${i?.all} سجل`)
};

export const integrations_never_internal = /** @type {(inputs: Integrations_Never_InternalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يُرسل أبدًا إلى المرسلين الداخليين`)
};

export const integrations_once_per_thread = /** @type {(inputs: Integrations_Once_Per_ThreadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يُرسل مرة واحدة لكل محادثة`)
};

export const integrations_open_inbox_history = /** @type {(inputs: Integrations_Open_Inbox_HistoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فتح سجل البريد الوارد`)
};

export const integrations_parts_label = /** @type {(inputs: Integrations_Parts_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأجزاء المنجزة`)
};

export const integrations_parts_value = /** @type {(inputs: Integrations_Parts_ValueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.done} من ${i?.total}`)
};

export const integrations_preview_language = /** @type {(inputs: Integrations_Preview_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لغة المعاينة`)
};

export const integrations_ready = /** @type {(inputs: Integrations_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جاهز لإيقاف Odoo`)
};

export const integrations_refresh_staging = /** @type {(inputs: Integrations_Refresh_StagingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تحديث النسخة التجريبية`)
};

export const integrations_refresh_staging_done = /** @type {(inputs: Integrations_Refresh_Staging_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حُدّثت النسخة التجريبية من النسخة الاحتياطية لليلة الماضية`)
};

export const integrations_refresh_staging_reason = /** @type {(inputs: Integrations_Refresh_Staging_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإدارة وحدها تحدّث النسخة التجريبية.`)
};

export const integrations_restore_tested = /** @type {(inputs: Integrations_Restore_TestedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`آخر اختبار للاستعادة`)
};

export const integrations_rfq_threads = /** @type {(inputs: Integrations_Rfq_ThreadsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`محادثات طلبات عروض الأسعار`)
};

export const integrations_rfq_threads_note = /** @type {(inputs: Integrations_Rfq_Threads_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تصبح ملفات سابقة`)
};

export const integrations_schedule = /** @type {(inputs: Integrations_ScheduleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الجدول`)
};

export const integrations_settings_by_management = /** @type {(inputs: Integrations_Settings_By_ManagementInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تغيّر الإدارة إعدادات الشركة.`)
};

export const integrations_staging_copy = /** @type {(inputs: Integrations_Staging_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النسخة التجريبية`)
};

export const integrations_stays_on = /** @type {(inputs: Integrations_Stays_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يبقى Odoo قيد التشغيل حتى يكتمل كل جزء`)
};

export const integrations_your_language = /** @type {(inputs: Integrations_Your_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لغتك`)
};

export const order_to_cash_agent_contact = /** @type {(inputs: Order_To_Cash_Agent_ContactInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الوكيل / جهة اتصال التسليم`)
};

export const order_to_cash_agreement_hint = /** @type {(inputs: Order_To_Cash_Agreement_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`من وافق، ومتى، وعلى ماذا`)
};

export const order_to_cash_agreement_hint_ai = /** @type {(inputs: Order_To_Cash_Agreement_Hint_AiInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسودة الذكاء الاصطناعي من بريد العميل. راجعها قبل التسجيل.`)
};

export const order_to_cash_agreement_label = /** @type {(inputs: Order_To_Cash_Agreement_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`موافقة العميل المكتوبة`)
};

export const order_to_cash_ai_check_line = /** @type {(inputs: Order_To_Cash_Ai_Check_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.what} · ${i?.field}: في أمر الشراء «${i?.po}»، وفي عرض السعر ${i?.quotation} «${i?.quote}»`)
};

export const order_to_cash_ai_check_tag = /** @type {(inputs: Order_To_Cash_Ai_Check_TagInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فحص بالذكاء الاصطناعي · 96%`)
};

export const order_to_cash_ai_line = /** @type {(inputs: Order_To_Cash_Ai_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`البند ${i?.line}`)
};

export const order_to_cash_ai_second_look = /** @type {(inputs: Order_To_Cash_Ai_Second_LookInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نظرة ثانية بالذكاء الاصطناعي`)
};

export const order_to_cash_ai_terms = /** @type {(inputs: Order_To_Cash_Ai_TermsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الشروط`)
};

export const order_to_cash_amendment_confirm = /** @type {(inputs: Order_To_Cash_Amendment_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسجيل التعديل ورفع الإيقاف`)
};

export const order_to_cash_amendment_done = /** @type {(inputs: Order_To_Cash_Amendment_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`سُجّل التعديل على البند ${i?.line}. الدليل مرفق.`)
};

export const order_to_cash_amendment_heading_header = /** @type {(inputs: Order_To_Cash_Amendment_Heading_HeaderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسجيل تعديل العميل: الرأس`)
};

export const order_to_cash_amendment_heading_line = /** @type {(inputs: Order_To_Cash_Amendment_Heading_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تسجيل تعديل العميل: البند ${i?.line}`)
};

export const order_to_cash_amendment_intro = /** @type {(inputs: Order_To_Cash_Amendment_IntroInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.field}. أمر الشراء: ${i?.po} · عرض السعر: ${i?.quote}`)
};

export const order_to_cash_approve_confirm = /** @type {(inputs: Order_To_Cash_Approve_ConfirmInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`اعتماد وتأكيد ${i?.number}`)
};

export const order_to_cash_ask_approval = /** @type {(inputs: Order_To_Cash_Ask_ApprovalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلب الاعتماد من Karim Balbaa`)
};

export const order_to_cash_ask_approval_done = /** @type {(inputs: Order_To_Cash_Ask_Approval_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`طُلب اعتماد ${i?.number} من Karim Balbaa.`)
};

export const order_to_cash_bills_matched = /** @type {(inputs: Order_To_Cash_Bills_MatchedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مطابقة لأمر الشراء والاستلام`)
};

export const order_to_cash_bills_on_hold = /** @type {(inputs: Order_To_Cash_Bills_On_HoldInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} معلّقة: مطابقة ثلاثية`)
};

export const order_to_cash_change_line = /** @type {(inputs: Order_To_Cash_Change_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.item}: ${i?.now}`)
};

export const order_to_cash_changed = /** @type {(inputs: Order_To_Cash_ChangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تغيّر`)
};

export const order_to_cash_check_documents = /** @type {(inputs: Order_To_Cash_Check_DocumentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المستندات: إذن التسليم، قائمة التعبئة، SDS، الشهادات`)
};

export const order_to_cash_check_goods_ready = /** @type {(inputs: Order_To_Cash_Check_Goods_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`البضائع جاهزة ومُعلّمة لكل بند`)
};

export const order_to_cash_check_no_approval = /** @type {(inputs: Order_To_Cash_Check_No_ApprovalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا اعتماد مفتوح على الطلب`)
};

export const order_to_cash_check_ship_stores = /** @type {(inputs: Order_To_Cash_Check_Ship_StoresInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إقرار مؤن السفينة`)
};

export const order_to_cash_check_transport = /** @type {(inputs: Order_To_Cash_Check_TransportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النقل محجوز (شاحنة، لنش)`)
};

export const order_to_cash_clearance = /** @type {(inputs: Order_To_Cash_ClearanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التخليص`)
};

export const order_to_cash_close_line_prompt = /** @type {(inputs: Order_To_Cash_Close_Line_PromptInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`إغلاق البند ${i?.line} (لم يُرسَ)`)
};

export const order_to_cash_close_with_reason = /** @type {(inputs: Order_To_Cash_Close_With_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إغلاق مع ذكر السبب`)
};

export const order_to_cash_closed_done = /** @type {(inputs: Order_To_Cash_Closed_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`البند ${i?.line}: أُغلق مع ذكر السبب.`)
};

export const order_to_cash_col_at_quotation = /** @type {(inputs: Order_To_Cash_Col_At_QuotationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عند عرض السعر`)
};

export const order_to_cash_col_check = /** @type {(inputs: Order_To_Cash_Col_CheckInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التحقق`)
};

export const order_to_cash_col_checked = /** @type {(inputs: Order_To_Cash_Col_CheckedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ما فُحص`)
};

export const order_to_cash_col_customer_po = /** @type {(inputs: Order_To_Cash_Col_Customer_PoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أمر شراء العميل`)
};

export const order_to_cash_col_item = /** @type {(inputs: Order_To_Cash_Col_ItemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الصنف`)
};

export const order_to_cash_col_line = /** @type {(inputs: Order_To_Cash_Col_LineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`البند`)
};

export const order_to_cash_col_now = /** @type {(inputs: Order_To_Cash_Col_NowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الآن`)
};

export const order_to_cash_col_quotation = /** @type {(inputs: Order_To_Cash_Col_QuotationInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`عرض السعر ${i?.quotation}`)
};

export const order_to_cash_col_result = /** @type {(inputs: Order_To_Cash_Col_ResultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النتيجة`)
};

export const order_to_cash_commitment_blocked = /** @type {(inputs: Order_To_Cash_Commitment_BlockedInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`الالتزام موقوف: لا اختلافات تحتاج إلى موافقة العميل المكتوبة (أو استثناء معتمد) قبل أمر البيع وأوامر شراء الموردين.`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`الالتزام موقوف: اختلاف واحد يحتاج إلى موافقة العميل المكتوبة (أو استثناء معتمد) قبل أمر البيع وأوامر شراء الموردين.`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`الالتزام موقوف: اختلافان يحتاجان إلى موافقة العميل المكتوبة (أو استثناء معتمد) قبل أمر البيع وأوامر شراء الموردين.`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`الالتزام موقوف: ${i?.count} اختلافات تحتاج إلى موافقة العميل المكتوبة (أو استثناء معتمد) قبل أمر البيع وأوامر شراء الموردين.`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`الالتزام موقوف: ${i?.count} اختلافًا تحتاج إلى موافقة العميل المكتوبة (أو استثناء معتمد) قبل أمر البيع وأوامر شراء الموردين.`);
	return /** @type {LocalizedString} */ (`الالتزام موقوف: ${i?.count} اختلاف تحتاج إلى موافقة العميل المكتوبة (أو استثناء معتمد) قبل أمر البيع وأوامر شراء الموردين.`)
};

export const order_to_cash_confirm_delivered = /** @type {(inputs: Order_To_Cash_Confirm_DeliveredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تأكيد التسليم`)
};

export const order_to_cash_confirm_delivered_heading = /** @type {(inputs: Order_To_Cash_Confirm_Delivered_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تأكيد تسليم ${i?.number}`)
};

export const order_to_cash_confirm_delivery = /** @type {(inputs: Order_To_Cash_Confirm_DeliveryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تأكيد التسليم…`)
};

export const order_to_cash_confirm_heading = /** @type {(inputs: Order_To_Cash_Confirm_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تأكيد ${i?.number}؟`)
};

export const order_to_cash_confirm_sales_order = /** @type {(inputs: Order_To_Cash_Confirm_Sales_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تأكيد أمر البيع وإعداد أوامر شراء الموردين`)
};

export const order_to_cash_confirm_send = /** @type {(inputs: Order_To_Cash_Confirm_SendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تأكيد وإرسال`)
};

export const order_to_cash_confirm_text = /** @type {(inputs: Order_To_Cash_Confirm_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`يُرسل ${i?.number} إلى ${i?.supplier} أمرًا مؤكدًا. لا يمكن التراجع عن ذلك هنا.`)
};

export const order_to_cash_confirmed_by_management = /** @type {(inputs: Order_To_Cash_Confirmed_By_ManagementInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يؤكد Karim Balbaa (الإدارة) أوامر شراء الموردين.`)
};

export const order_to_cash_confirmed_done = /** @type {(inputs: Order_To_Cash_Confirmed_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم تأكيد ${i?.number} وأُرسل إلى ${i?.supplier}.`)
};

export const order_to_cash_delivered_count = /** @type {(inputs: Order_To_Cash_Delivered_CountInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم تسليم ${i?.n} من ${i?.total}`)
};

export const order_to_cash_delivered_done = /** @type {(inputs: Order_To_Cash_Delivered_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم تسليم ${i?.number}. إذن التسليم الموقّع محفوظ.`)
};

export const order_to_cash_dictate = /** @type {(inputs: Order_To_Cash_DictateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إملاء النواقص أو التلف`)
};

export const order_to_cash_dispatch = /** @type {(inputs: Order_To_Cash_DispatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإرسال`)
};

export const order_to_cash_dispatched_at = /** @type {(inputs: Order_To_Cash_Dispatched_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُرسل ${i?.at}`)
};

export const order_to_cash_drop_heading = /** @type {(inputs: Order_To_Cash_Drop_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الدفعة ${i?.drop} · ${i?.number}`)
};

export const order_to_cash_drop_line = /** @type {(inputs: Order_To_Cash_Drop_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`L${i?.line} · ${i?.qty} × ${i?.description}`)
};

export const order_to_cash_drop_line_lot = /** @type {(inputs: Order_To_Cash_Drop_Line_LotInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`L${i?.line} · ${i?.qty} × ${i?.description} · التشغيلة ${i?.lot}`)
};

export const order_to_cash_drop_tag = /** @type {(inputs: Order_To_Cash_Drop_TagInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الدفعة ${i?.drop} من ${i?.total} · ${i?.status}`)
};

export const order_to_cash_evidence_hint = /** @type {(inputs: Order_To_Cash_Evidence_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختياري في العرض التجريبي. تُرفق نسخة من بريد العميل إن تخطيته.`)
};

export const order_to_cash_evidence_legend = /** @type {(inputs: Order_To_Cash_Evidence_LegendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الدليل (بريد إلكتروني أو تعديل موقّع)`)
};

export const order_to_cash_figure_customer_po = /** @type {(inputs: Order_To_Cash_Figure_Customer_PoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أمر شراء العميل`)
};

export const order_to_cash_figure_received = /** @type {(inputs: Order_To_Cash_Figure_ReceivedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المستلم`)
};

export const order_to_cash_figure_supplier_bills = /** @type {(inputs: Order_To_Cash_Figure_Supplier_BillsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فواتير الموردين`)
};

export const order_to_cash_figure_supplier_pos_confirmed = /** @type {(inputs: Order_To_Cash_Figure_Supplier_Pos_ConfirmedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أوامر شراء الموردين المؤكدة`)
};

export const order_to_cash_goods_ready = /** @type {(inputs: Order_To_Cash_Goods_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جاهزية البضائع`)
};

export const order_to_cash_header = /** @type {(inputs: Order_To_Cash_HeaderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الرأس`)
};

export const order_to_cash_intro = /** @type {(inputs: Order_To_Cash_IntroInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.lines}، ${i?.place}`)
};

export const order_to_cash_intro_line = /** @type {(inputs: Order_To_Cash_Intro_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`L${i?.line} × ${i?.qty}`)
};

export const order_to_cash_invoice_delivered = /** @type {(inputs: Order_To_Cash_Invoice_DeliveredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فوترة الكميات المسلّمة`)
};

export const order_to_cash_invoiced = /** @type {(inputs: Order_To_Cash_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الفاتورة`)
};

export const order_to_cash_keep_open = /** @type {(inputs: Order_To_Cash_Keep_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إبقاء مفتوح`)
};

export const order_to_cash_kept_open_done = /** @type {(inputs: Order_To_Cash_Kept_Open_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`البند ${i?.line}: بقي مفتوحًا لمراجعة لاحقة.`)
};

export const order_to_cash_launch_boat = /** @type {(inputs: Order_To_Cash_Launch_BoatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اللنش / القارب`)
};

export const order_to_cash_line_ref = /** @type {(inputs: Order_To_Cash_Line_RefInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`L${i?.line}`)
};

export const order_to_cash_mismatch_text = /** @type {(inputs: Order_To_Cash_Mismatch_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.line} · ${i?.field}`)
};

export const order_to_cash_missing_proof = /** @type {(inputs: Order_To_Cash_Missing_ProofInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا دليل، لا «تم التسليم»: أرفق الإذن الموقّع أولًا.`)
};

export const order_to_cash_n_of_total = /** @type {(inputs: Order_To_Cash_N_Of_TotalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} من ${i?.total}`)
};

export const order_to_cash_no_plan = /** @type {(inputs: Order_To_Cash_No_PlanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد تسليم مخطط بعد. تُنشأ الخطة بعد تأكيد أوامر شراء الموردين واستحقاق البضائع.`)
};

export const order_to_cash_not_dispatched = /** @type {(inputs: Order_To_Cash_Not_DispatchedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يُرسل بعد`)
};

export const order_to_cash_not_on_po_decide = /** @type {(inputs: Order_To_Cash_Not_On_Po_DecideInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`غير موجود في أمر شراء العميل: قرّر`)
};

export const order_to_cash_not_rechecked = /** @type {(inputs: Order_To_Cash_Not_RecheckedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يُعد فحصه بعد.`)
};

export const order_to_cash_ok = /** @type {(inputs: Order_To_Cash_OkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سليم`)
};

export const order_to_cash_on_backorder = /** @type {(inputs: Order_To_Cash_On_BackorderInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} في طلبات مؤجلة`)
};

export const order_to_cash_on_plan = /** @type {(inputs: Order_To_Cash_On_PlanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حسب الخطة: لا تغيير من الوكيل في الوصول المتوقع ولا شيء يعيق التسليم.`)
};

export const order_to_cash_outcome_closed = /** @type {(inputs: Order_To_Cash_Outcome_ClosedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مغلق`)
};

export const order_to_cash_outcome_open_revision = /** @type {(inputs: Order_To_Cash_Outcome_Open_RevisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مفتوح، مراجعة لاحقة`)
};

export const order_to_cash_outcome_with_reason = /** @type {(inputs: Order_To_Cash_Outcome_With_ReasonInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.outcome}: ${i?.reason}`)
};

export const order_to_cash_pair = /** @type {(inputs: Order_To_Cash_PairInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.a} · ${i?.b}`)
};

export const order_to_cash_partial_award_note = /** @type {(inputs: Order_To_Cash_Partial_Award_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`البنود المسعّرة التي لم يطلبها العميل تبقى مفتوحة لمراجعة لاحقة أو تُغلق مع ذكر السبب. الملف المُرسى جزئيًا لا يظهر مكتملًا أبدًا.`)
};

export const order_to_cash_plan_note = /** @type {(inputs: Order_To_Cash_Plan_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تُتابع مواعيد الموردين وموعد العميل كلٌّ على حدة؛ تغيير الوصول المتوقع ينقل كل دفعة وحجز ومهمة مفتوحة وينبّه المسؤول.`)
};

export const order_to_cash_planned_on_board = /** @type {(inputs: Order_To_Cash_Planned_On_BoardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`موعد الصعود المخطط`)
};

export const order_to_cash_po_arrived_heading = /** @type {(inputs: Order_To_Cash_Po_Arrived_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`وصل أمر شراء Nordvik للتو بالبريد الإلكتروني.`)
};

export const order_to_cash_po_arrived_text = /** @type {(inputs: Order_To_Cash_Po_Arrived_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يقرؤه الذكاء الاصطناعي ويفحص كل بند وكل شرط تجاري مقابل نسخة عرض السعر التي يشير إليها. لا يُلتزم بشيء حتى يحسم شخص كل اختلاف.`)
};

export const order_to_cash_po_checked_validated = /** @type {(inputs: Order_To_Cash_Po_Checked_ValidatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فُحص أمر شراء العميل مقابل عرض السعر المعتمد وتم التحقق منه. أمر البيع مؤكد.`)
};

export const order_to_cash_po_empty_confirmed = /** @type {(inputs: Order_To_Cash_Po_Empty_ConfirmedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فُحص وتم التحقق منه عند تأكيد أمر البيع.`)
};

export const order_to_cash_po_empty_none = /** @type {(inputs: Order_To_Cash_Po_Empty_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد أمر شراء من العميل بعد. عند وصوله يُفحص هنا مقابل نسخة عرض السعر المعتمدة.`)
};

export const order_to_cash_po_empty_read = /** @type {(inputs: Order_To_Cash_Po_Empty_ReadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يُفحص هنا كل بند وشرط بمجرد قراءة أمر الشراء.`)
};

export const order_to_cash_po_not_received = /** @type {(inputs: Order_To_Cash_Po_Not_ReceivedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يُستلم`)
};

export const order_to_cash_po_subhead = /** @type {(inputs: Order_To_Cash_Po_SubheadInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} · استُلم ${i?.received} · مطابق لـ ${i?.quotation} · جهة الفوترة ${i?.entity}`)
};

export const order_to_cash_po_validated = /** @type {(inputs: Order_To_Cash_Po_ValidatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم التحقق`)
};

export const order_to_cash_po_validated_agreed = /** @type {(inputs: Order_To_Cash_Po_Validated_AgreedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم التحقق من أمر الشراء. لكل اختلاف موافقة مكتوبة من العميل.`)
};

export const order_to_cash_po_validated_confirmed = /** @type {(inputs: Order_To_Cash_Po_Validated_ConfirmedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم التحقق من أمر الشراء وتأكيد أمر البيع. أوامر شراء الموردين أدناه.`)
};

export const order_to_cash_po_vs_quotation = /** @type {(inputs: Order_To_Cash_Po_Vs_QuotationInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.po} مقابل ${i?.quotation}`)
};

export const order_to_cash_port_place = /** @type {(inputs: Order_To_Cash_Port_PlaceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الميناء · المكان`)
};

export const order_to_cash_pos_prepared_later = /** @type {(inputs: Order_To_Cash_Pos_Prepared_LaterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تُعدّ عند تأكيد أمر البيع`)
};

export const order_to_cash_pos_rechecked = /** @type {(inputs: Order_To_Cash_Pos_RecheckedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أُعيد فحصها قبل التأكيد`)
};

export const order_to_cash_proof_hint = /** @type {(inputs: Order_To_Cash_Proof_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صورة الإذن المختوم من السفينة، أو ملف PDF الممسوح`)
};

export const order_to_cash_proof_legend = /** @type {(inputs: Order_To_Cash_Proof_LegendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إذن التسليم الموقّع أو صورته (مطلوب)`)
};

export const order_to_cash_q_items = /** @type {(inputs: Order_To_Cash_Q_ItemsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هل الأصناف والكميات في أمر الشراء هي نفسها في عرض السعر؟`)
};

export const order_to_cash_q_items_no = /** @type {(inputs: Order_To_Cash_Q_Items_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صنف أو كمية مختلفة`)
};

export const order_to_cash_q_items_yes = /** @type {(inputs: Order_To_Cash_Q_Items_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأصناف والكميات مطابقة`)
};

export const order_to_cash_q_prices = /** @type {(inputs: Order_To_Cash_Q_PricesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هل الأسعار في أمر شراء العميل هي نفسها في عرض السعر؟`)
};

export const order_to_cash_q_prices_no = /** @type {(inputs: Order_To_Cash_Q_Prices_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سعر يختلف عن عرض السعر`)
};

export const order_to_cash_q_prices_yes = /** @type {(inputs: Order_To_Cash_Q_Prices_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأسعار مطابقة لعرض السعر`)
};

export const order_to_cash_q_terms = /** @type {(inputs: Order_To_Cash_Q_TermsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هل تطابق الشروط التجارية لأمر الشراء (الدفع، التسليم، الصلاحية) عرض السعر؟`)
};

export const order_to_cash_q_terms_no = /** @type {(inputs: Order_To_Cash_Q_Terms_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`شرط مختلف`)
};

export const order_to_cash_q_terms_yes = /** @type {(inputs: Order_To_Cash_Q_Terms_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الشروط مطابقة`)
};

export const order_to_cash_read_note = /** @type {(inputs: Order_To_Cash_Read_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قراءة الإذن الموقّع من صورة`)
};

export const order_to_cash_reason_hint = /** @type {(inputs: Order_To_Cash_Reason_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`L${i?.line} · ${i?.description}. الأسباب الشائعة: اشترته السفينة محليًا · ألغى العميل الصنف · السعر غير مقبول`)
};

export const order_to_cash_reason_label = /** @type {(inputs: Order_To_Cash_Reason_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السبب (يُحفظ في الملف)`)
};

export const order_to_cash_reason_placeholder = /** @type {(inputs: Order_To_Cash_Reason_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مثال: اشترته السفينة محليًا`)
};

export const order_to_cash_receipt = /** @type {(inputs: Order_To_Cash_ReceiptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الاستلام`)
};

export const order_to_cash_receipt_pending = /** @type {(inputs: Order_To_Cash_Receipt_PendingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تأكيد الاستلام معلّق: يلزم إذن تسليم موقّع`)
};

export const order_to_cash_recheck_confirm = /** @type {(inputs: Order_To_Cash_Recheck_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إعادة الفحص والتأكيد`)
};

export const order_to_cash_recheck_done = /** @type {(inputs: Order_To_Cash_Recheck_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُعيد فحص السعر والتوفر وسعر الصرف ومدة التوريد مع ${i?.supplier}.`)
};

export const order_to_cash_recheck_note = /** @type {(inputs: Order_To_Cash_Recheck_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} · ${i?.supplier}: يُعاد فحص السعر والتوفر وسعر الصرف ومدة التوريد مع المورّد قبل التأكيد.`)
};

export const order_to_cash_recheck_title = /** @type {(inputs: Order_To_Cash_Recheck_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`إعادة الفحص قبل تأكيد ${i?.number}`)
};

export const order_to_cash_record_amendment = /** @type {(inputs: Order_To_Cash_Record_AmendmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسجيل التعديل`)
};

export const order_to_cash_replan_heading = /** @type {(inputs: Order_To_Cash_Replan_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُعيد التخطيط بعد تغيير الوكيل للوصول المتوقع. صُعّد إلى ${i?.owner} وKarim Balbaa`)
};

export const order_to_cash_replan_text = /** @type {(inputs: Order_To_Cash_Replan_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.at} · ${i?.text}`)
};

export const order_to_cash_rerun_po_check = /** @type {(inputs: Order_To_Cash_Rerun_Po_CheckInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إعادة فحص أمر الشراء`)
};

export const order_to_cash_resolution_evidence = /** @type {(inputs: Order_To_Cash_Resolution_EvidenceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.resolution} · الدليل مرفق`)
};

export const order_to_cash_result_amendment = /** @type {(inputs: Order_To_Cash_Result_AmendmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سُجّل التعديل`)
};

export const order_to_cash_result_match = /** @type {(inputs: Order_To_Cash_Result_MatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مطابق`)
};

export const order_to_cash_result_mismatch = /** @type {(inputs: Order_To_Cash_Result_MismatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مختلف`)
};

export const order_to_cash_sales_order_confirmed = /** @type {(inputs: Order_To_Cash_Sales_Order_ConfirmedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم تأكيد أمر البيع`)
};

export const order_to_cash_sample_from = /** @type {(inputs: Order_To_Cash_Sample_FromInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`من: المشتريات (العميل)`)
};

export const order_to_cash_sample_note = /** @type {(inputs: Order_To_Cash_Sample_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`إذن التسليم ${i?.number}`)
};

export const order_to_cash_sample_re = /** @type {(inputs: Order_To_Cash_Sample_ReInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`بخصوص: ${i?.number} البند ${i?.line}`)
};

export const order_to_cash_sample_received = /** @type {(inputs: Order_To_Cash_Sample_ReceivedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`استُلم على متن السفينة: ${i?.signedBy}`)
};

export const order_to_cash_sample_scan = /** @type {(inputs: Order_To_Cash_Sample_ScanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استخدام المسح النموذجي من ضابط الصعود`)
};

export const order_to_cash_share_confirmed = /** @type {(inputs: Order_To_Cash_Share_ConfirmedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مؤكدة`)
};

export const order_to_cash_share_matched = /** @type {(inputs: Order_To_Cash_Share_MatchedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} مطابقة`)
};

export const order_to_cash_share_of_units_ordered = /** @type {(inputs: Order_To_Cash_Share_Of_Units_OrderedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`من الوحدات المطلوبة`)
};

export const order_to_cash_shortages = /** @type {(inputs: Order_To_Cash_ShortagesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النواقص`)
};

export const order_to_cash_shortages_hint = /** @type {(inputs: Order_To_Cash_Shortages_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختياري. يصبح مطالبة`)
};

export const order_to_cash_shortages_label = /** @type {(inputs: Order_To_Cash_Shortages_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النواقص أو التلف المسجّل على متن السفينة`)
};

export const order_to_cash_shortfall_backorder = /** @type {(inputs: Order_To_Cash_Shortfall_BackorderInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.changes}. يُجدول النقص طلبًا مؤجلًا (يبقى الموعد المتفق عليه مع العميل كما هو).`)
};

export const order_to_cash_signed_by_at = /** @type {(inputs: Order_To_Cash_Signed_By_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`وقّعه ${i?.by} · ${i?.at}`)
};

export const order_to_cash_signed_by_at_proof = /** @type {(inputs: Order_To_Cash_Signed_By_At_ProofInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`وقّعه ${i?.by} · ${i?.at} · إذن التسليم الموقّع محفوظ`)
};

export const order_to_cash_signed_by_default = /** @type {(inputs: Order_To_Cash_Signed_By_DefaultInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الضابط الأول، ${i?.vessel}`)
};

export const order_to_cash_signed_by_vessel = /** @type {(inputs: Order_To_Cash_Signed_By_VesselInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الموقّع (من السفينة)`)
};

export const order_to_cash_truck_staff = /** @type {(inputs: Order_To_Cash_Truck_StaffInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الشاحنة وطاقم الصعود`)
};

export const order_to_cash_undecided = /** @type {(inputs: Order_To_Cash_UndecidedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يُحسم`)
};

export const order_to_cash_units_across_receipts = /** @type {(inputs: Order_To_Cash_Units_Across_ReceiptsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الوحدات في جميع الاستلامات`)
};

export const order_to_cash_vessel = /** @type {(inputs: Order_To_Cash_VesselInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السفينة`)
};

export const order_to_cash_vessel_eta = /** @type {(inputs: Order_To_Cash_Vessel_EtaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الوصول المتوقع للسفينة`)
};

export const order_to_cash_waiting_customer_order = /** @type {(inputs: Order_To_Cash_Waiting_Customer_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظار أمر شراء العميل`)
};

export const order_to_cash_x_date = /** @type {(inputs: Order_To_Cash_X_DateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التاريخ`)
};

export const order_to_cash_x_remarks = /** @type {(inputs: Order_To_Cash_X_RemarksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النواقص أو التلف المسجّل`)
};

export const order_to_cash_x_signed_by = /** @type {(inputs: Order_To_Cash_X_Signed_ByInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الموقّع`)
};

export const order_to_cash_x_vessel = /** @type {(inputs: Order_To_Cash_X_VesselInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السفينة`)
};

export const page_approval_rules_approved = /** @type {(inputs: Page_Approval_Rules_ApprovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`معتمد`)
};

export const page_approval_rules_halfway = /** @type {(inputs: Page_Approval_Rules_HalfwayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`في منتصف الطريق`)
};

export const page_approval_rules_rejected = /** @type {(inputs: Page_Approval_Rules_RejectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مرفوض`)
};

export const page_approval_rules_requests_title = /** @type {(inputs: Page_Approval_Rules_Requests_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الطلبات الخاضعة لهذه القواعد`)
};

export const page_approval_rules_two_person = /** @type {(inputs: Page_Approval_Rules_Two_PersonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قواعد الشخصين`)
};

export const page_approval_rules_waiting = /** @type {(inputs: Page_Approval_Rules_WaitingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظار القرار`)
};

export const page_approval_rules_waiting_title = /** @type {(inputs: Page_Approval_Rules_Waiting_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظار قرار`)
};

export const page_approvals_all = /** @type {(inputs: Page_Approvals_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل الموافقات`)
};

export const page_approvals_by_kind = /** @type {(inputs: Page_Approvals_By_KindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ما ينتظر القرار، حسب النوع`)
};

export const page_approvals_decided = /** @type {(inputs: Page_Approvals_DecidedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم البت فيها`)
};

export const page_approvals_eyebrow = /** @type {(inputs: Page_Approvals_EyebrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الموافقات`)
};

export const page_approvals_finance_ceo = /** @type {(inputs: Page_Approvals_Finance_CeoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المالية + الرئيس التنفيذي`)
};

export const page_approvals_heading = /** @type {(inputs: Page_Approvals_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قرارات تحتاج إلى شخص مسمّى`)
};

export const page_approvals_kept_for_audit = /** @type {(inputs: Page_Approvals_Kept_For_AuditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`محفوظة مع السجل للتدقيق`)
};

export const page_approvals_listed_approver = /** @type {(inputs: Page_Approvals_Listed_ApproverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أنت ضمن المعتمِدين`)
};

export const page_approvals_others_empty = /** @type {(inputs: Page_Approvals_Others_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد طلبات مفتوحة أخرى.`)
};

export const page_approvals_others_subhead = /** @type {(inputs: Page_Approvals_Others_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلبات يمكنك متابعتها دون البت فيها — توضح كل بطاقة من يملك القرار.`)
};

export const page_approvals_recent_empty = /** @type {(inputs: Page_Approvals_Recent_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد قرارات بعد.`)
};

export const page_approvals_recent_subhead = /** @type {(inputs: Page_Approvals_Recent_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الطلبات المعتمدة والمُعادة، مع من قرّر ولماذا.`)
};

export const page_approvals_recent_title = /** @type {(inputs: Page_Approvals_Recent_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قرارات حديثة`)
};

export const page_approvals_rules = /** @type {(inputs: Page_Approvals_RulesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قواعد الموافقة`)
};

export const page_approvals_see_not_decide = /** @type {(inputs: Page_Approvals_See_Not_DecideInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يمكنك الاطلاع على المستندات دون اتخاذ القرار`)
};

export const page_approvals_subtitle = /** @type {(inputs: Page_Approvals_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل عرض سعر، واستثناء في هامش الربح، ودفعة، وصنف بديل، وتغيير في البيانات البنكية، وسعر صرف يحتاج إلى شخص مسمّى. الذكاء الاصطناعي لا يعتمد أبدًا.`)
};

export const page_approvals_two_person = /** @type {(inputs: Page_Approvals_Two_PersonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلبات تتطلب شخصين`)
};

export const page_approvals_waiting_for_others = /** @type {(inputs: Page_Approvals_Waiting_For_OthersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظار آخرين`)
};

export const page_approvals_waiting_for_you = /** @type {(inputs: Page_Approvals_Waiting_For_YouInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظارك`)
};

export const page_approvals_yours_empty = /** @type {(inputs: Page_Approvals_Yours_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا شيء يحتاج إلى قرارك الآن.`)
};

export const page_approvals_yours_subhead = /** @type {(inputs: Page_Approvals_Yours_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اعتمد أو أعِد الطلب مع ذكر السبب. يُسجَّل قرارك باسمك.`)
};

export const page_aside_awaiting_customer = /** @type {(inputs: Page_Aside_Awaiting_CustomerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظار العملاء`)
};

export const page_aside_awaiting_customer_note = /** @type {(inputs: Page_Aside_Awaiting_Customer_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عروضك المُرسلة بانتظار قرار`)
};

export const page_aside_awaiting_supplier = /** @type {(inputs: Page_Aside_Awaiting_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظار الموردين`)
};

export const page_aside_awaiting_supplier_note = /** @type {(inputs: Page_Aside_Awaiting_Supplier_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملفات معلّقة بانتظار ردود الموردين`)
};

export const page_aside_bills = /** @type {(inputs: Page_Aside_BillsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فواتير الموردين`)
};

export const page_aside_bills_note = /** @type {(inputs: Page_Aside_Bills_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فواتير تجب مطابقتها مع أمر الشراء والبضاعة المستلمة`)
};

export const page_aside_bills_on_hold = /** @type {(inputs: Page_Aside_Bills_On_HoldInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فواتير معلّقة`)
};

export const page_aside_bills_on_hold_note = /** @type {(inputs: Page_Aside_Bills_On_Hold_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أمر الشراء والاستلام والفاتورة غير متطابقة بعد`)
};

export const page_aside_deliveries = /** @type {(inputs: Page_Aside_DeliveriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسليمات جارية`)
};

export const page_aside_deliveries_note = /** @type {(inputs: Page_Aside_Deliveries_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`شحنات مخططة أو في الطريق إلى سفينة`)
};

export const page_aside_draft_quotes = /** @type {(inputs: Page_Aside_Draft_QuotesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عروض أسعار لإكمالها`)
};

export const page_aside_draft_quotes_note = /** @type {(inputs: Page_Aside_Draft_Quotes_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسودات لم تُرسل بعد`)
};

export const page_aside_exceptions = /** @type {(inputs: Page_Aside_ExceptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استثناءات التكامل`)
};

export const page_aside_exceptions_note = /** @type {(inputs: Page_Aside_Exceptions_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خطوات متعثرة في البريد أو الفاتورة الإلكترونية أو الذكاء الاصطناعي تنتظر شخصًا`)
};

export const page_aside_follow_ups = /** @type {(inputs: Page_Aside_Follow_UpsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`متابعات مفتوحة`)
};

export const page_aside_follow_ups_note = /** @type {(inputs: Page_Aside_Follow_Ups_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مكالمات ورسائل وتذكيرات مطلوبة`)
};

export const page_aside_held = /** @type {(inputs: Page_Aside_HeldInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`معلّقة للموافقة`)
};

export const page_aside_held_note = /** @type {(inputs: Page_Aside_Held_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملفات تنتظر موافقة على هامش ربح أو دفعة مقدمة أو غيرها`)
};

export const page_aside_inbox = /** @type {(inputs: Page_Aside_InboxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صندوق الوارد للفرز`)
};

export const page_aside_inbox_note = /** @type {(inputs: Page_Aside_Inbox_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`رسائل جديدة ومطابقات غير مؤكدة`)
};

export const page_aside_live_cases = /** @type {(inputs: Page_Aside_Live_CasesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الملفات الجارية`)
};

export const page_aside_live_cases_note = /** @type {(inputs: Page_Aside_Live_Cases_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل ملف لم يُسوَّ أو يُخسر أو تنتهِ صلاحيته بعد`)
};

export const page_aside_my_decisions = /** @type {(inputs: Page_Aside_My_DecisionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قرارات بانتظاري`)
};

export const page_aside_my_decisions_note = /** @type {(inputs: Page_Aside_My_Decisions_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`موافقات أُحيلت إليك ولم تبتّ فيها بعد`)
};

export const page_aside_my_live_cases = /** @type {(inputs: Page_Aside_My_Live_CasesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملفاتي الجارية`)
};

export const page_aside_my_live_cases_note = /** @type {(inputs: Page_Aside_My_Live_Cases_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملفات أنت مسؤول عنها وما زالت مفتوحة`)
};

export const page_aside_my_tasks = /** @type {(inputs: Page_Aside_My_TasksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مهامي المفتوحة`)
};

export const page_aside_my_tasks_note = /** @type {(inputs: Page_Aside_My_Tasks_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`متابعاتك التي ما زالت مفتوحة`)
};

export const page_aside_overdue = /** @type {(inputs: Page_Aside_OverdueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فواتير متأخرة`)
};

export const page_aside_overdue_note = /** @type {(inputs: Page_Aside_Overdue_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تجاوزت تاريخ استحقاقها وعليها رصيد مفتوح`)
};

export const page_aside_pipeline = /** @type {(inputs: Page_Aside_PipelineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فرصي البيعية`)
};

export const page_aside_pipeline_note = /** @type {(inputs: Page_Aside_Pipeline_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عملاء محتملون تعمل عليهم`)
};

export const page_aside_rfqs_waiting = /** @type {(inputs: Page_Aside_Rfqs_WaitingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلبات عروض أسعار بانتظار الرد`)
};

export const page_aside_rfqs_waiting_note = /** @type {(inputs: Page_Aside_Rfqs_Waiting_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`موردون لم يردّوا بعد`)
};

export const page_aside_to_collect = /** @type {(inputs: Page_Aside_To_CollectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فواتير للتحصيل`)
};

export const page_aside_to_collect_note = /** @type {(inputs: Page_Aside_To_Collect_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فواتير عملاء ما زال عليها رصيد مفتوح`)
};

export const page_aside_your_desk = /** @type {(inputs: Page_Aside_Your_DeskInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مكتبك`)
};

export const page_automations_activity_log = /** @type {(inputs: Page_Automations_Activity_LogInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سجل النشاط الكامل`)
};

export const page_automations_ai_log_subhead = /** @type {(inputs: Page_Automations_Ai_Log_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل طلب للذكاء الاصطناعي: ما قرأه، ومدى ثقته، والشخص الذي راجعه.`)
};

export const page_automations_ai_log_title = /** @type {(inputs: Page_Automations_Ai_Log_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سجل الذكاء الاصطناعي`)
};

export const page_automations_all_exceptions = /** @type {(inputs: Page_Automations_All_ExceptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل الاستثناءات`)
};

export const page_automations_audit_subhead = /** @type {(inputs: Page_Automations_Audit_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل خطوة تلقائية وكل قرار بشري، بالإضافة فقط دون تعديل.`)
};

export const page_automations_audit_title = /** @type {(inputs: Page_Automations_Audit_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سجل التدقيق`)
};

export const page_automations_auto_resolved = /** @type {(inputs: Page_Automations_Auto_ResolvedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حُلّت تلقائيًا`)
};

export const page_automations_automatic = /** @type {(inputs: Page_Automations_AutomaticInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يعمل تلقائيًا وفق قواعد معتمدة`)
};

export const page_automations_by_people = /** @type {(inputs: Page_Automations_By_PeopleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يُجهَّز لشخص مخوَّل`)
};

export const page_automations_duplicates_caught = /** @type {(inputs: Page_Automations_Duplicates_CaughtInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تكرارات رصدها مفتاح عدم التكرار`)
};

export const page_automations_eyebrow = /** @type {(inputs: Page_Automations_EyebrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العمل · الأتمتة`)
};

export const page_automations_heading = /** @type {(inputs: Page_Automations_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأتمتة والاستثناءات`)
};

export const page_automations_nothing_silent = /** @type {(inputs: Page_Automations_Nothing_SilentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا شيء يتعثر دون تنبيه`)
};

export const page_automations_open_exceptions = /** @type {(inputs: Page_Automations_Open_ExceptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استثناءات مفتوحة`)
};

export const page_automations_owner_due = /** @type {(inputs: Page_Automations_Owner_DueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المسؤول · الموعد`)
};

export const page_automations_queue_subhead = /** @type {(inputs: Page_Automations_Queue_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تتحقق إعادة المحاولة أولًا من مفتاح عدم التكرار (معرّف الرسالة، رقم الفاتورة، صندوق البريد)، فلا يُنشأ شيء أو يُستورد أو يُرسل مرتين. وإعادة محاولة عنصر محلول لا تغيّر شيئًا.`)
};

export const page_automations_queue_title = /** @type {(inputs: Page_Automations_Queue_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قائمة الاستثناءات`)
};

export const page_automations_registry_subhead = /** @type {(inputs: Page_Automations_Registry_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل قاعدة صريحة؛ تُوقفها الإدارة أو تُفعّلها، ويُسجَّل كل تغيير.`)
};

export const page_automations_registry_title = /** @type {(inputs: Page_Automations_Registry_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سجل القواعد`)
};

export const page_automations_review_queue = /** @type {(inputs: Page_Automations_Review_QueueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قائمة مراجعة الذكاء الاصطناعي`)
};

export const page_automations_rule = /** @type {(inputs: Page_Automations_RuleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`القاعدة`)
};

export const page_automations_subtitle = /** @type {(inputs: Page_Automations_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لكل أتمتة مُشغِّل ومسؤول وموعد وقاعدة موافقة وسلوك إعادة محاولة وشرط توقف. إعادة المعالجة لا تُنشئ تكرارات أبدًا؛ وتذهب الإخفاقات إلى قائمة الاستثناءات مع إعادة محاولة آمنة.`)
};

export const page_automations_what = /** @type {(inputs: Page_Automations_WhatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ماذا`)
};

export const page_automations_what_happened = /** @type {(inputs: Page_Automations_What_HappenedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ما حدث`)
};

export const page_automations_what_it_read = /** @type {(inputs: Page_Automations_What_It_ReadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ما قرأه`)
};

export const page_automations_when = /** @type {(inputs: Page_Automations_WhenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التوقيت`)
};

export const page_automations_who = /** @type {(inputs: Page_Automations_WhoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`من`)
};

export const page_cash_ageing_subhead = /** @type {(inputs: Page_Cash_Ageing_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأرصدة المفتوحة بالمعادل بالدولار الأمريكي بأسعار اليوم، حسب أيام التأخير.`)
};

export const page_cash_ageing_title = /** @type {(inputs: Page_Cash_Ageing_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أعمار الذمم المدينة حسب العميل`)
};

export const page_cash_all_invoices = /** @type {(inputs: Page_Cash_All_InvoicesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل الفواتير`)
};

export const page_cash_approvals_queue = /** @type {(inputs: Page_Cash_Approvals_QueueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قائمة الموافقات`)
};

export const page_cash_bank_change_subhead = /** @type {(inputs: Page_Cash_Bank_Change_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تحقق من شخصين: المالية والرئيس التنفيذي، بعد معاودة الاتصال على الرقم المسجَّل.`)
};

export const page_cash_bills_by_due = /** @type {(inputs: Page_Cash_Bills_By_DueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فواتير الموردين حسب تاريخ الاستحقاق`)
};

export const page_cash_buckets_title = /** @type {(inputs: Page_Cash_Buckets_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فئات الأعمار حسب العميل`)
};

export const page_cash_collections_subhead = /** @type {(inputs: Page_Cash_Collections_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تتبع التذكيرات قاعدة التواصل لكل عميل: الحسابات المصنّفة «بلا ملاحقة» تحصل على تذكير داخلي فقط؛ وللبقية يُعدّ الذكاء الاصطناعي الرسالة ويراجعها شخص ويرسلها.`)
};

export const page_cash_collections_title = /** @type {(inputs: Page_Cash_Collections_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التحصيل — الفواتير المفتوحة`)
};

export const page_cash_due_month = /** @type {(inputs: Page_Cash_Due_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المستحق هذا الشهر`)
};

export const page_cash_e_invoice = /** @type {(inputs: Page_Cash_E_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الفاتورة الإلكترونية`)
};

export const page_cash_eyebrow = /** @type {(inputs: Page_Cash_EyebrowInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`المالية · ${i?.day}`)
};

export const page_cash_fd_or_ceo = /** @type {(inputs: Page_Cash_Fd_Or_CeoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المدير المالي أو الرئيس التنفيذي`)
};

export const page_cash_heading = /** @type {(inputs: Page_Cash_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الذمم المدينة والدائنة`)
};

export const page_cash_in_out = /** @type {(inputs: Page_Cash_In_OutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النقد الوارد مقابل الصادر — الأسابيع الثمانية القادمة`)
};

export const page_cash_in_out_subhead = /** @type {(inputs: Page_Cash_In_Out_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بآلاف الجنيهات المصرية، أسبوعيًا`)
};

export const page_cash_next_weeks = /** @type {(inputs: Page_Cash_Next_WeeksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النقد، الأسابيع الثمانية القادمة`)
};

export const page_cash_no_bank_changes = /** @type {(inputs: Page_Cash_No_Bank_ChangesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد تغييرات جارية في البيانات البنكية.`)
};

export const page_cash_no_bank_request = /** @type {(inputs: Page_Cash_No_Bank_RequestInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد طلب لتغيير البيانات البنكية.`)
};

export const page_cash_no_open_invoices = /** @type {(inputs: Page_Cash_No_Open_InvoicesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد فواتير مفتوحة.`)
};

export const page_cash_no_payments = /** @type {(inputs: Page_Cash_No_PaymentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد مدفوعات بانتظار الموافقة.`)
};

export const page_cash_no_receivables = /** @type {(inputs: Page_Cash_No_ReceivablesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد ذمم مدينة مفتوحة.`)
};

export const page_cash_nothing_owed = /** @type {(inputs: Page_Cash_Nothing_OwedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا مستحقات للموردين.`)
};

export const page_cash_open_invoices = /** @type {(inputs: Page_Cash_Open_InvoicesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الفواتير المفتوحة`)
};

export const page_cash_overdue = /** @type {(inputs: Page_Cash_OverdueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`متأخر`)
};

export const page_cash_overdue_note = /** @type {(inputs: Page_Cash_Overdue_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تجاوزت تاريخ الاستحقاق · المعادل بالدولار الأمريكي`)
};

export const page_cash_payables = /** @type {(inputs: Page_Cash_PayablesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الذمم الدائنة`)
};

export const page_cash_payables_note = /** @type {(inputs: Page_Cash_Payables_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أرصدة الموردين المفتوحة · المعادل بالجنيه المصري`)
};

export const page_cash_payables_subhead = /** @type {(inputs: Page_Cash_Payables_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الدفعات المقدمة مقابل الفواتير المبدئية، والأرصدة المستحقة عند التسليم، والفواتير المعلّقة عند عدم تطابق أمر الشراء والاستلام والفاتورة.`)
};

export const page_cash_payables_title = /** @type {(inputs: Page_Cash_Payables_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مستحقات الموردين`)
};

export const page_cash_payments_subhead = /** @type {(inputs: Page_Cash_Payments_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تحتاج كل دفعة لمورّد إلى موافقة المدير المالي أو الرئيس التنفيذي. وبعد الاعتماد تدفعها المالية عبر البنك وتسجلها هنا بالمرجع البنكي.`)
};

export const page_cash_payments_title = /** @type {(inputs: Page_Cash_Payments_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مدفوعات تحتاج إلى موافقة`)
};

export const page_cash_payments_to_approve = /** @type {(inputs: Page_Cash_Payments_To_ApproveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مدفوعات للاعتماد`)
};

export const page_cash_receivables = /** @type {(inputs: Page_Cash_ReceivablesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الذمم المدينة`)
};

export const page_cash_receivables_note = /** @type {(inputs: Page_Cash_Receivables_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الفواتير المفتوحة · المعادل بالدولار الأمريكي`)
};

export const page_cash_remittance = /** @type {(inputs: Page_Cash_RemittanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مطابقة إشعار تحويل`)
};

export const page_cash_requested_change = /** @type {(inputs: Page_Cash_Requested_ChangeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier}: التغيير المطلوب`)
};

export const page_cash_subtitle = /** @type {(inputs: Page_Cash_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ما يدين به العملاء، وما ندين به للموردين، وما يحتاج إلى قرار. لا تتحرك الأموال إلا عبر البنك — وهنا يعتمدها الأشخاص ويسجلونها.`)
};

export const page_cash_supplier_balances = /** @type {(inputs: Page_Cash_Supplier_BalancesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أرصدة موردين مفتوحة`)
};

export const page_cash_who_owes = /** @type {(inputs: Page_Cash_Who_OwesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المبالغ المستحقة لنا`)
};

export const page_compare_check_title = /** @type {(inputs: Page_Compare_Check_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مراجعة العروض · البند ${i?.line} · ${i?.description}`)
};

export const page_compare_correction_title = /** @type {(inputs: Page_Compare_Correction_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`طلب تصحيح · ${i?.supplier} الإصدار ${i?.version}`)
};

export const page_compare_denied = /** @type {(inputs: Page_Compare_DeniedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التكاليف وهوامش الربح مخفية لدورك. عروض الموردين تتضمن تكاليفهم، لذا يرى فريق المبيعات أسعار البيع في عرض السعر بدلًا منها. تتولى سلسلة الإمداد والمالية والإدارة مقارنة العروض.`)
};

export const page_compare_how_title = /** @type {(inputs: Page_Compare_How_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كيف تُقارَن العروض`)
};

export const page_compare_line_title = /** @type {(inputs: Page_Compare_Line_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`البند ${i?.line} · ${i?.description}`)
};

export const page_compare_next_step = /** @type {(inputs: Page_Compare_Next_StepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الخطوة التالية`)
};

export const page_compare_no_corrections = /** @type {(inputs: Page_Compare_No_CorrectionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد عروض تحتاج إلى طلب تصحيح.`)
};

export const page_compare_no_lines = /** @type {(inputs: Page_Compare_No_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد بنود مطلوبة للمقارنة بعد.`)
};

export const page_compare_no_more_checks = /** @type {(inputs: Page_Compare_No_More_ChecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد بنود أخرى بعروض للمراجعة.`)
};

export const page_compare_no_more_lines = /** @type {(inputs: Page_Compare_No_More_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد بنود مطلوبة أخرى في هذا الملف.`)
};

export const page_compare_no_waiting = /** @type {(inputs: Page_Compare_No_WaitingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد بند بانتظار عرض من مورّد.`)
};

export const page_compare_others_title = /** @type {(inputs: Page_Compare_Others_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`طُلب ولم يصل عرض · البند ${i?.line} · ${i?.description}`)
};

export const page_delivery_amount_vat = /** @type {(inputs: Page_Delivery_Amount_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المبلغ · ضريبة القيمة المضافة`)
};

export const page_delivery_backorders_subhead = /** @type {(inputs: Page_Delivery_Backorders_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يتحول نقص الاستلام إلى طلب مؤجل له تاريخ ومسؤول؛ ويُصعَّد المورّد المتأخر مقابل الشحنة التي كان مخصصًا لها.`)
};

export const page_delivery_backorders_title = /** @type {(inputs: Page_Delivery_Backorders_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الطلبات المؤجلة والموردون المتأخرون`)
};

export const page_delivery_balance = /** @type {(inputs: Page_Delivery_BalanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الرصيد`)
};

export const page_delivery_balance_note = /** @type {(inputs: Page_Delivery_Balance_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فواتير ما زالت مفتوحة: $count`)
};

export const page_delivery_check_subhead = /** @type {(inputs: Page_Delivery_Check_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الشحنة التالية`)
};

export const page_delivery_check_title = /** @type {(inputs: Page_Delivery_Check_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فحص ما قبل الإرسال`)
};

export const page_delivery_drops_subhead = /** @type {(inputs: Page_Delivery_Drops_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حالة «تم التسليم» تحتاج إلى دليل: الإرسال وتأكيد الاستلام خطوتان منفصلتان، ولا تُؤكَّد الشحنة إلا بإذن تسليم موقّع أو صورة من السفينة.`)
};

export const page_delivery_drops_title = /** @type {(inputs: Page_Delivery_Drops_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الشحنات وإثبات التسليم`)
};

export const page_delivery_invoice = /** @type {(inputs: Page_Delivery_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الفاتورة`)
};

export const page_delivery_invoiced = /** @type {(inputs: Page_Delivery_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المُفوتَر`)
};

export const page_delivery_invoiced_note = /** @type {(inputs: Page_Delivery_Invoiced_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الكميات المسلَّمة فقط`)
};

export const page_delivery_invoices_subhead = /** @type {(inputs: Page_Delivery_Invoices_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تصدر الفواتير من تسليمات موقّعة: الكميات المسلَّمة فقط، ولا تُفوتَر الكمية نفسها مرتين. تُوقَّع كل فاتورة وتُقدَّم إلى مصلحة الضرائب المصرية؛ وإذا تعثّر التوقيع لا يُقدَّم شيء وتكون إعادة المحاولة آمنة.`)
};

export const page_delivery_invoices_title = /** @type {(inputs: Page_Delivery_Invoices_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فواتير العملاء والمدفوعات`)
};

export const page_delivery_no_backorders = /** @type {(inputs: Page_Delivery_No_BackordersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد طلبات مؤجلة في هذا الملف.`)
};

export const page_delivery_no_dispatch = /** @type {(inputs: Page_Delivery_No_DispatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد شحنة للإرسال بعد.`)
};

export const page_delivery_no_drops = /** @type {(inputs: Page_Delivery_No_DropsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد تسليمات مخططة بعد.`)
};

export const page_delivery_no_invoice = /** @type {(inputs: Page_Delivery_No_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد فاتورة بعد. تُنشأ الأولى من تسليم مؤكَّد بإذن موقّع.`)
};

export const page_delivery_no_invoices = /** @type {(inputs: Page_Delivery_No_InvoicesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد فواتير في هذا الملف بعد.`)
};

export const page_delivery_paid_balance = /** @type {(inputs: Page_Delivery_Paid_BalanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المدفوع · الرصيد`)
};

export const page_delivery_plan_title = /** @type {(inputs: Page_Delivery_Plan_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خطة التسليم للسفينة`)
};

export const page_delivery_received = /** @type {(inputs: Page_Delivery_ReceivedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المُحصَّل`)
};

export const page_delivery_received_note = /** @type {(inputs: Page_Delivery_Received_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مدفوعات العملاء المخصَّصة`)
};

export const page_delivery_short = /** @type {(inputs: Page_Delivery_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النقص`)
};

export const page_growth_add = /** @type {(inputs: Page_Growth_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إضافة فرصة`)
};

export const page_growth_campaign = /** @type {(inputs: Page_Growth_CampaignInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الحملة`)
};

export const page_growth_campaigns = /** @type {(inputs: Page_Growth_CampaignsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الحملات`)
};

export const page_growth_campaigns_can_send = /** @type {(inputs: Page_Growth_Campaigns_Can_SendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قوائم ومحتوى معتمدان فقط. يمكنك الجدولة والإرسال.`)
};

export const page_growth_campaigns_cannot_send = /** @type {(inputs: Page_Growth_Campaigns_Cannot_SendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قوائم ومحتوى معتمدان فقط. Karim Balbaa وحده يجدول أو يرسل.`)
};

export const page_growth_content = /** @type {(inputs: Page_Growth_ContentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المحتوى`)
};

export const page_growth_documents = /** @type {(inputs: Page_Growth_DocumentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مستندات التسجيل`)
};

export const page_growth_eyebrow = /** @type {(inputs: Page_Growth_EyebrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النمو`)
};

export const page_growth_fleets = /** @type {(inputs: Page_Growth_FleetsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأساطيل لكل مدير سفن`)
};

export const page_growth_funnel = /** @type {(inputs: Page_Growth_FunnelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسار النمو`)
};

export const page_growth_funnel_subhead = /** @type {(inputs: Page_Growth_Funnel_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العملاء المحتملون الذين بلغوا كل مرحلة أو تجاوزوها`)
};

export const page_growth_heading = /** @type {(inputs: Page_Growth_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لوحة النمو`)
};

export const page_growth_next = /** @type {(inputs: Page_Growth_NextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التالي`)
};

export const page_growth_next_steps = /** @type {(inputs: Page_Growth_Next_StepsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خطوات المبيعات التالية`)
};

export const page_growth_next_steps_subhead = /** @type {(inputs: Page_Growth_Next_Steps_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لكل خطوة قناة وتاريخ وما يُقال. اتصل أو راسل بنفسك، ثم سجّل ما حدث — وتنتقل الخطوة التالية إلى متابعات المسؤول.`)
};

export const page_growth_no_step = /** @type {(inputs: Page_Growth_No_StepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بلا خطوة تالية`)
};

export const page_growth_no_step_note = /** @type {(inputs: Page_Growth_No_Step_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خطّط لخطوة أو أغلق الفرصة`)
};

export const page_growth_open = /** @type {(inputs: Page_Growth_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الفرص المفتوحة`)
};

export const page_growth_open_note = /** @type {(inputs: Page_Growth_Open_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`من عملاء محتملين إلى حسابات نشطة`)
};

export const page_growth_pipeline = /** @type {(inputs: Page_Growth_PipelineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المسار`)
};

export const page_growth_registrations = /** @type {(inputs: Page_Growth_RegistrationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسجيلات جارية`)
};

export const page_growth_registrations_glance = /** @type {(inputs: Page_Growth_Registrations_GlanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التسجيلات في لمحة`)
};

export const page_growth_registrations_note = /** @type {(inputs: Page_Growth_Registrations_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظار مستندات أو لجنة`)
};

export const page_growth_sources = /** @type {(inputs: Page_Growth_SourcesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مصادر العملاء المحتملين`)
};

export const page_growth_stage_active = /** @type {(inputs: Page_Growth_Stage_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حساب نشط`)
};

export const page_growth_stage_approved = /** @type {(inputs: Page_Growth_Stage_ApprovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مورّد معتمد`)
};

export const page_growth_stage_first_rfq = /** @type {(inputs: Page_Growth_Stage_First_RfqInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أول طلب عرض أسعار`)
};

export const page_growth_stage_introduced = /** @type {(inputs: Page_Growth_Stage_IntroducedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم التعارف`)
};

export const page_growth_stage_prospect = /** @type {(inputs: Page_Growth_Stage_ProspectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عميل محتمل`)
};

export const page_growth_stage_registration = /** @type {(inputs: Page_Growth_Stage_RegistrationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قُدّم التسجيل`)
};

export const page_growth_subtitle = /** @type {(inputs: Page_Growth_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العملاء المحتملون والأساطيل والتعارف وتسجيلات الموردين — بمعزل عن طلبات عروض الأسعار التشغيلية، وتُربط بالعميل حين نكسب التعامل.`)
};

export const page_growth_this_week = /** @type {(inputs: Page_Growth_This_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الخطوات التالية هذا الأسبوع`)
};

export const page_growth_this_week_note = /** @type {(inputs: Page_Growth_This_Week_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مكالمات ورسائل وزيارات مخططة`)
};

export const page_growth_vendor_subhead = /** @type {(inputs: Page_Growth_Vendor_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلبات الاعتماد كمورّد لدى مدير سفن أو مالك.`)
};

export const page_growth_vendor_title = /** @type {(inputs: Page_Growth_Vendor_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسجيلات الموردين`)
};

export const page_growth_vessels = /** @type {(inputs: Page_Growth_VesselsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السفن لكل مدير سفن`)
};

export const page_growth_vessels_subhead = /** @type {(inputs: Page_Growth_Vessels_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سفن العملاء والعملاء المحتملين برقم IMO — وفرصة النمو في كل سفينة لا نورّد لها بعد.`)
};

export const page_history_customers = /** @type {(inputs: Page_History_CustomersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العملاء — مديرو السفن`)
};

export const page_history_dedup = /** @type {(inputs: Page_History_DedupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إزالة التكرار`)
};

export const page_history_mailboxes = /** @type {(inputs: Page_History_MailboxesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صناديق البريد المستوردة`)
};

export const page_history_no_customers = /** @type {(inputs: Page_History_No_CustomersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يُعثر على عملاء بعد.`)
};

export const page_history_no_prices = /** @type {(inputs: Page_History_No_PricesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يُعثر على أسعار مؤرخة بعد.`)
};

export const page_history_no_suppliers = /** @type {(inputs: Page_History_No_SuppliersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يُعثر على موردين بعد.`)
};

export const page_history_no_vessels = /** @type {(inputs: Page_History_No_VesselsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يُعثر على سفن بعد.`)
};

export const page_history_not_organised = /** @type {(inputs: Page_History_Not_OrganisedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اضغط «تنظيم» لاستخراجها من الرسائل المحفوظة.`)
};

export const page_history_organise_approve = /** @type {(inputs: Page_History_Organise_ApproveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التنظيم والاعتماد`)
};

export const page_history_per_year = /** @type {(inputs: Page_History_Per_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الرسائل سنويًا`)
};

export const page_history_prices = /** @type {(inputs: Page_History_PricesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أسعار مؤرخة — حتى دون أمر شراء`)
};

export const page_history_progress = /** @type {(inputs: Page_History_ProgressInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تقدّم الاستيراد`)
};

export const page_history_suppliers = /** @type {(inputs: Page_History_SuppliersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الموردون — من سعّر ماذا`)
};

export const page_history_uncertain_empty = /** @type {(inputs: Page_History_Uncertain_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا شيء للمراجعة بعد. ما لا يتأكد منه المنظِّم يظهر هنا بعد «تنظيم».`)
};

export const page_history_uncertain_subhead = /** @type {(inputs: Page_History_Uncertain_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تُراجَع معك قبل حفظها: أكّد المقترح أو ارفضه.`)
};

export const page_history_uncertain_title = /** @type {(inputs: Page_History_Uncertain_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عناصر غير مؤكدة`)
};

export const page_history_vessels = /** @type {(inputs: Page_History_VesselsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السفن — IMO، الأسطول، الموانئ`)
};

export const page_home_all_live = /** @type {(inputs: Page_Home_All_LiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل الملفات الجارية`)
};

export const page_home_all_live_subhead = /** @type {(inputs: Page_Home_All_Live_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مرتبة حسب المخاطر ثم الموعد النهائي · لكل ملف مسؤول وإجراء تالٍ`)
};

export const page_home_bills_match = /** @type {(inputs: Page_Home_Bills_MatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فواتير موردين للمطابقة`)
};

export const page_home_bills_match_note = /** @type {(inputs: Page_Home_Bills_Match_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أمر الشراء · الاستلام · الفاتورة`)
};

export const page_home_briefing = /** @type {(inputs: Page_Home_BriefingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الموجز اليومي`)
};

export const page_home_by_risk = /** @type {(inputs: Page_Home_By_RiskInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مرتبة حسب المخاطر ثم الموعد النهائي`)
};

export const page_home_customer_vessel = /** @type {(inputs: Page_Home_Customer_VesselInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العميل · السفينة`)
};

export const page_home_deadlines = /** @type {(inputs: Page_Home_DeadlinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المواعيد النهائية، مباشرة`)
};

export const page_home_deadlines_subhead = /** @type {(inputs: Page_Home_Deadlines_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عروض مستحقة وسفن قادمة، الأقرب أولًا`)
};

export const page_home_decisions_note = /** @type {(inputs: Page_Home_Decisions_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مدفوعات ودفعات مقدمة وتغييرات بنكية`)
};

export const page_home_decisions_waiting = /** @type {(inputs: Page_Home_Decisions_WaitingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قرارات معلّقة`)
};

export const page_home_desk_cases = /** @type {(inputs: Page_Home_Desk_CasesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملفات المكتب`)
};

export const page_home_desk_cases_subhead = /** @type {(inputs: Page_Home_Desk_Cases_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل ملف جارٍ ومسؤوله وخطوته التالية`)
};

export const page_home_desk_queue_subhead = /** @type {(inputs: Page_Home_Desk_Queue_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مرتبة حسب المخاطر ثم الموعد النهائي · لكل ملف مسؤول وموعد نهائي وإجراء تالٍ`)
};

export const page_home_due_today = /** @type {(inputs: Page_Home_Due_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`متابعات مستحقة اليوم`)
};

export const page_home_due_today_note = /** @type {(inputs: Page_Home_Due_Today_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تتوقف التذكيرات عند الرد`)
};

export const page_home_exceptions = /** @type {(inputs: Page_Home_ExceptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استثناءات التكامل`)
};

export const page_home_exceptions_note = /** @type {(inputs: Page_Home_Exceptions_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إعادة المحاولة الآمنة متاحة`)
};

export const page_home_follow_ups_subhead = /** @type {(inputs: Page_Home_Follow_Ups_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تتوقف التذكيرات عند الرد أو الاعتذار أو إغلاق الملف`)
};

export const page_home_follow_ups_title = /** @type {(inputs: Page_Home_Follow_Ups_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`متابعات اليوم`)
};

export const page_home_inbox_note = /** @type {(inputs: Page_Home_Inbox_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`رسائل جديدة ومطابقات غير مؤكدة`)
};

export const page_home_inbox_subhead = /** @type {(inputs: Page_Home_Inbox_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قرأ الذكاء الاصطناعي كل رسالة — تحقّق من الملف والمسؤول والتفاصيل الناقصة`)
};

export const page_home_inbox_triage = /** @type {(inputs: Page_Home_Inbox_TriageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صندوق الوارد للفرز`)
};

export const page_home_lines = /** @type {(inputs: Page_Home_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`البنود`)
};

export const page_home_my_deadlines = /** @type {(inputs: Page_Home_My_DeadlinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مواعيدي النهائية، الأيام السبعة القادمة`)
};

export const page_home_my_deadlines_subhead = /** @type {(inputs: Page_Home_My_Deadlines_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مواعيد عروض الأسعار في ملفاتي`)
};

export const page_home_my_live_cases = /** @type {(inputs: Page_Home_My_Live_CasesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملفاتي الجارية`)
};

export const page_home_my_live_cases_note = /** @type {(inputs: Page_Home_My_Live_Cases_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملفات أنت مسؤول عنها وما زالت مفتوحة`)
};

export const page_home_my_queue = /** @type {(inputs: Page_Home_My_QueueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قائمتي`)
};

export const page_home_my_queue_subhead = /** @type {(inputs: Page_Home_My_Queue_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملفاتي، مرتبة حسب المخاطر ثم الموعد النهائي`)
};

export const page_home_next_blocker = /** @type {(inputs: Page_Home_Next_BlockerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإجراء التالي · العائق`)
};

export const page_home_next_up = /** @type {(inputs: Page_Home_Next_UpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التالي`)
};

export const page_home_no_chart = /** @type {(inputs: Page_Home_No_ChartInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد رسم بياني لهذا بعد.`)
};

export const page_home_no_follow_ups = /** @type {(inputs: Page_Home_No_Follow_UpsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد متابعات مستحقة اليوم.`)
};

export const page_home_no_live_cases = /** @type {(inputs: Page_Home_No_Live_CasesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد ملفات جارية.`)
};

export const page_home_nothing_morning = /** @type {(inputs: Page_Home_Nothing_MorningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا شيء يحتاجك هذا الصباح.`)
};

export const page_home_nothing_this_week = /** @type {(inputs: Page_Home_Nothing_This_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا شيء مستحق هذا الأسبوع.`)
};

export const page_home_open_tasks = /** @type {(inputs: Page_Home_Open_TasksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المهام المفتوحة`)
};

export const page_home_pipeline = /** @type {(inputs: Page_Home_PipelineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الخطوات التالية في المسار`)
};

export const page_home_pipeline_subhead = /** @type {(inputs: Page_Home_Pipeline_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إدارة النمو · مكالمات وزيارات وتسجيلات`)
};

export const page_home_quote_deadlines = /** @type {(inputs: Page_Home_Quote_DeadlinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مواعيد عروض الأسعار`)
};

export const page_home_targets = /** @type {(inputs: Page_Home_TargetsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأهداف`)
};

export const page_home_this_month = /** @type {(inputs: Page_Home_This_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هذا الشهر`)
};

export const page_home_this_morning = /** @type {(inputs: Page_Home_This_MorningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هذا الصباح`)
};

export const page_home_this_week = /** @type {(inputs: Page_Home_This_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هذا الأسبوع`)
};

export const page_home_to_collect = /** @type {(inputs: Page_Home_To_CollectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فواتير للتحصيل`)
};

export const page_home_to_collect_note = /** @type {(inputs: Page_Home_To_Collect_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فواتير إلكترونية مقبولة لدى مصلحة الضرائب`)
};

export const page_home_turnaround = /** @type {(inputs: Page_Home_TurnaroundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سرعة إعداد عروض الأسعار`)
};

export const page_home_win_rate = /** @type {(inputs: Page_Home_Win_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نسبة الفوز`)
};

export const page_home_your_decision = /** @type {(inputs: Page_Home_Your_DecisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظار قرارك`)
};

export const page_home_your_decision_subhead = /** @type {(inputs: Page_Home_Your_Decision_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل شيء جاهز — تعتمد أو تُعيد`)
};

export const page_inbox_ack = /** @type {(inputs: Page_Inbox_AckInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسودة الإقرار بالاستلام`)
};

export const page_inbox_assignment = /** @type {(inputs: Page_Inbox_AssignmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المسؤول والبديل والموعد النهائي`)
};

export const page_inbox_channels = /** @type {(inputs: Page_Inbox_ChannelsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`القنوات المتصلة`)
};

export const page_inbox_draft_case = /** @type {(inputs: Page_Inbox_Draft_CaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسودة الملف`)
};

export const page_inbox_draft_lines = /** @type {(inputs: Page_Inbox_Draft_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بنود المسودة`)
};

export const page_inbox_eyebrow = /** @type {(inputs: Page_Inbox_EyebrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مكتب التوريد · الوارد`)
};

export const page_inbox_heading = /** @type {(inputs: Page_Inbox_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صندوق الوارد`)
};

export const page_inbox_match_empty = /** @type {(inputs: Page_Inbox_Match_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد مطابقة لعرضها. يُقرأ الطلب الجديد إلى مسودة ملف، ويُطابَق الرد الجديد أولًا.`)
};

export const page_inbox_match_subhead = /** @type {(inputs: Page_Inbox_Match_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سبب المطابقة ومن قرّر. تحت 85% يختار شخص الملف؛ والرسالة المكررة تبقى مع الرسالة الواردة سابقًا.`)
};

export const page_inbox_match_title = /** @type {(inputs: Page_Inbox_Match_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مطابقة الرد`)
};

export const page_inbox_messages = /** @type {(inputs: Page_Inbox_MessagesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الرسائل`)
};

export const page_inbox_missing = /** @type {(inputs: Page_Inbox_MissingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ناقص أو غير واضح`)
};

export const page_inbox_next_step = /** @type {(inputs: Page_Inbox_Next_StepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الخطوة التالية`)
};

export const page_inbox_no_ack = /** @type {(inputs: Page_Inbox_No_AckInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد إقرار بالاستلام لهذه الرسالة.`)
};

export const page_inbox_no_ack_description = /** @type {(inputs: Page_Inbox_No_Ack_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يحصل الطلب الجديد على إقرار من القالب المعتمد.`)
};

export const page_inbox_no_draft = /** @type {(inputs: Page_Inbox_No_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد مسودة ملف لهذه الرسالة.`)
};

export const page_inbox_no_draft_description = /** @type {(inputs: Page_Inbox_No_Draft_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلبات عروض الأسعار وحدها تُقرأ إلى مسودة ملف.`)
};

export const page_inbox_no_draft_lines = /** @type {(inputs: Page_Inbox_No_Draft_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد بنود مسودة لهذه الرسالة.`)
};

export const page_inbox_no_match_filter = /** @type {(inputs: Page_Inbox_No_Match_FilterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد رسائل مطابقة لهذه التصفية.`)
};

export const page_inbox_no_message = /** @type {(inputs: Page_Inbox_No_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد رسالة مفتوحة.`)
};

export const page_inbox_no_next_step = /** @type {(inputs: Page_Inbox_No_Next_StepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد خطوة تالية لهذه الرسالة.`)
};

export const page_inbox_no_owner = /** @type {(inputs: Page_Inbox_No_OwnerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يُقترح مسؤول بعد.`)
};

export const page_inbox_no_owner_description = /** @type {(inputs: Page_Inbox_No_Owner_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تقترح قواعد الإسناد مسؤولًا بعد قراءة الطلب إلى مسودة ملف.`)
};

export const page_inbox_no_text = /** @type {(inputs: Page_Inbox_No_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد نص للقراءة في هذه الرسالة.`)
};

export const page_inbox_no_warnings_text = /** @type {(inputs: Page_Inbox_No_Warnings_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد نص لفحص التحذيرات.`)
};

export const page_inbox_nothing_clarify = /** @type {(inputs: Page_Inbox_Nothing_ClarifyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا شيء يحتاج إلى استيضاح من المرسل.`)
};

export const page_inbox_offer_details = /** @type {(inputs: Page_Inbox_Offer_DetailsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تفاصيل العرض والردود`)
};

export const page_inbox_original = /** @type {(inputs: Page_Inbox_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الرسالة الأصلية`)
};

export const page_inbox_original_subhead = /** @type {(inputs: Page_Inbox_Original_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الرسالة كما وصلت`)
};

export const page_inbox_pick_message = /** @type {(inputs: Page_Inbox_Pick_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختر رسالة من القائمة.`)
};

export const page_inbox_review_empty = /** @type {(inputs: Page_Inbox_Review_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا شيء بانتظار المراجعة. كل الردود مطابَقة.`)
};

export const page_inbox_review_subhead = /** @type {(inputs: Page_Inbox_Review_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المطابقات بثقة أقل من 85% لا تُربط تلقائيًا أبدًا — يختار شخص الملف.`)
};

export const page_inbox_review_title = /** @type {(inputs: Page_Inbox_Review_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قائمة المراجعة`)
};

export const page_inbox_subtitle = /** @type {(inputs: Page_Inbox_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل القنوات في صندوق وارد واحد. يقرأ الذكاء الاصطناعي الرسائل والملفات والصور ويحوّلها إلى مسودة ملف؛ والقرار للأشخاص.`)
};

export const page_inbox_warnings = /** @type {(inputs: Page_Inbox_WarningsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تحذيرات في هذه الرسالة`)
};

export const page_inbox_what_is = /** @type {(inputs: Page_Inbox_What_IsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ما هذه الرسالة`)
};

export const page_integrations_ack = /** @type {(inputs: Page_Integrations_AckInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إقرار استلام بهوية الشركة`)
};

export const page_integrations_backups = /** @type {(inputs: Page_Integrations_BackupsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النسخ الاحتياطي والنسخة التجريبية والتصدير`)
};

export const page_integrations_channels = /** @type {(inputs: Page_Integrations_ChannelsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`القنوات`)
};

export const page_integrations_channels_subhead = /** @type {(inputs: Page_Integrations_Channels_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الموقع وWhatsApp ومصلحة الضرائب واستخراج الذكاء الاصطناعي والمستندات، وOdoo في الخلفية.`)
};

export const page_integrations_edit = /** @type {(inputs: Page_Integrations_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تعديل الاتصالات`)
};

export const page_integrations_exception_queue = /** @type {(inputs: Page_Integrations_Exception_QueueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قائمة الاستثناءات`)
};

export const page_integrations_eyebrow = /** @type {(inputs: Page_Integrations_EyebrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإعدادات · التكاملات`)
};

export const page_integrations_heading = /** @type {(inputs: Page_Integrations_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التكاملات والبيانات`)
};

export const page_integrations_history = /** @type {(inputs: Page_Integrations_HistoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استيراد سجل البريد`)
};

export const page_integrations_history_subhead = /** @type {(inputs: Page_Integrations_History_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أيام البريد المستوردة`)
};

export const page_integrations_imported = /** @type {(inputs: Page_Integrations_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الرسائل المستوردة`)
};

export const page_integrations_language = /** @type {(inputs: Page_Integrations_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اللغة — English / العربية`)
};

export const page_integrations_mailbox = /** @type {(inputs: Page_Integrations_MailboxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صندوق البريد`)
};

export const page_integrations_mailboxes = /** @type {(inputs: Page_Integrations_MailboxesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صناديق البريد`)
};

export const page_integrations_mailboxes_subhead = /** @type {(inputs: Page_Integrations_Mailboxes_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل رسالة إلى هذه الصناديق تصبح ملفًا أو تنضم إلى ملف، مع حفظ مرفقاتها. ولا تضيع أي رسالة عند تعثّر المزامنة: تنتظر في قائمة الاستثناءات وتُستورد مرة واحدة عند إعادة الاتصال.`)
};

export const page_integrations_migration = /** @type {(inputs: Page_Integrations_MigrationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الترحيل من Odoo`)
};

export const page_integrations_odoo_subhead = /** @type {(inputs: Page_Integrations_Odoo_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يُحصى كل جزء من بيانات Odoo ويُنسخ، ثم يراجعه شخص مقابل Odoo. ويُوقف Odoo بعد اكتمال كل الأجزاء.`)
};

export const page_integrations_odoo_title = /** @type {(inputs: Page_Integrations_Odoo_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الانتقال من Odoo`)
};

export const page_integrations_subtitle = /** @type {(inputs: Page_Integrations_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صناديق بريدك وموقعك وWhatsApp ومصلحة الضرائب وOdoo، متصلة — مع نسخ احتياطية يومية ونسخة تجريبية وإمكانية تصدير بياناتك في أي وقت.`)
};

export const page_integrations_token = /** @type {(inputs: Page_Integrations_TokenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`انتهاء الرمز`)
};

export const page_order_ai_check_title = /** @type {(inputs: Page_Order_Ai_Check_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مراجعة الذكاء الاصطناعي لأمر شراء العميل`)
};

export const page_order_amendment_header = /** @type {(inputs: Page_Order_Amendment_HeaderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تعديل العميل · الترويسة`)
};

export const page_order_amendment_line = /** @type {(inputs: Page_Order_Amendment_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تعديل العميل · البند ${i?.line}`)
};

export const page_order_amount = /** @type {(inputs: Page_Order_AmountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المبلغ`)
};

export const page_order_backorder = /** @type {(inputs: Page_Order_BackorderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلب مؤجل`)
};

export const page_order_bill = /** @type {(inputs: Page_Order_BillInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الفاتورة`)
};

export const page_order_bills_subhead = /** @type {(inputs: Page_Order_Bills_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا تُستحق الفاتورة الدفع إلا إذا تساوى المطلوب والمستلم والمُفوتَر. وإذا زاد المُفوتَر على المستلم تُعلَّق؛ ولا يمكن تسجيل رقم فاتورة المورّد نفسه مرتين.`)
};

export const page_order_bills_title = /** @type {(inputs: Page_Order_Bills_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فواتير الموردين — المطابقة الثلاثية`)
};

export const page_order_due = /** @type {(inputs: Page_Order_DueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الاستحقاق`)
};

export const page_order_lot_expiry = /** @type {(inputs: Page_Order_Lot_ExpiryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التشغيلة · الصلاحية`)
};

export const page_order_no_bills = /** @type {(inputs: Page_Order_No_BillsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد فواتير موردين في هذا الملف بعد.`)
};

export const page_order_no_confirm = /** @type {(inputs: Page_Order_No_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد أمر شراء لمورّد بانتظار التأكيد.`)
};

export const page_order_no_mismatch = /** @type {(inputs: Page_Order_No_MismatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد فروقات مفتوحة في أمر شراء العميل.`)
};

export const page_order_no_partial = /** @type {(inputs: Page_Order_No_PartialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد ترسية جزئية في هذا الملف.`)
};

export const page_order_no_po = /** @type {(inputs: Page_Order_No_PoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد أمر شراء من العميل للمراجعة بعد.`)
};

export const page_order_no_pos = /** @type {(inputs: Page_Order_No_PosInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد أمر شراء لمورّد بعد. تُجهَّز الأوامر بعد التحقق من أمر شراء العميل وتأكيد أمر البيع.`)
};

export const page_order_no_receipts = /** @type {(inputs: Page_Order_No_ReceiptsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد استلامات في هذا الملف بعد.`)
};

export const page_order_partial_title = /** @type {(inputs: Page_Order_Partial_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الترسية الجزئية`)
};

export const page_order_po = /** @type {(inputs: Page_Order_PoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أمر الشراء`)
};

export const page_order_po_check_subhead = /** @type {(inputs: Page_Order_Po_Check_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أمر شراء العميل مقابل عرض السعر`)
};

export const page_order_po_check_title = /** @type {(inputs: Page_Order_Po_Check_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مراجعة أمر شراء العميل`)
};

export const page_order_pos_subhead = /** @type {(inputs: Page_Order_Pos_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تُنشأ من أمر البيع المؤكَّد — بموردين متعددين وكميات مجدولة. يُعاد التحقق من السعر والتوفر وسعر الصرف ومدة التوريد قبل تأكيد أمر الشراء؛ ويعتمده Karim Balbaa. وتمر الدفعات المقدمة عبر موافقة الدفع. تكاليف الموردين مخفية عن المبيعات.`)
};

export const page_order_pos_title = /** @type {(inputs: Page_Order_Pos_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أوامر الشراء للموردين`)
};

export const page_order_receipts_subhead = /** @type {(inputs: Page_Order_Receipts_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استلامات المخزن والتسليمات المباشرة من المورّد، مع رقم التشغيلة والصلاحية وفحص الجودة لكل بند. يتحول النقص إلى طلب مؤجل له تاريخ ومسؤول — ويُلحق بالشحنة التالية.`)
};

export const page_order_receipts_title = /** @type {(inputs: Page_Order_Receipts_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الاستلامات · التشغيلات · الصلاحية · الجودة`)
};

export const page_overview_after_order = /** @type {(inputs: Page_Overview_After_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بعد الطلب`)
};

export const page_overview_clarifications_subhead = /** @type {(inputs: Page_Overview_Clarifications_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأسئلة والأجوبة لكل بند، مع العميل أو المورّد أو داخليًا. تستمر البنود الواضحة في التقدّم بينما ينتظر غيرها.`)
};

export const page_overview_clarifications_title = /** @type {(inputs: Page_Overview_Clarifications_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سجل الاستيضاحات`)
};

export const page_overview_contact_rule = /** @type {(inputs: Page_Overview_Contact_RuleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قاعدة التواصل مع العميل`)
};

export const page_overview_handover_title = /** @type {(inputs: Page_Overview_Handover_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`آخر ملاحظة تسليم`)
};

export const page_overview_lifecycle_subhead = /** @type {(inputs: Page_Overview_Lifecycle_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أين وصل الملف الآن`)
};

export const page_overview_lifecycle_title = /** @type {(inputs: Page_Overview_Lifecycle_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`دورة الملف — من أول رسالة إلى آخر دفعة`)
};

export const page_overview_line = /** @type {(inputs: Page_Overview_LineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`البند`)
};

export const page_overview_line_progress = /** @type {(inputs: Page_Overview_Line_ProgressInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تقدّم البنود`)
};

export const page_overview_line_progress_subhead = /** @type {(inputs: Page_Overview_Line_Progress_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يتقدّم كل بند على حدة. لا يُعدّ الملف «منجزًا» حتى تُنجز كل بنوده.`)
};

export const page_overview_line_status = /** @type {(inputs: Page_Overview_Line_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حالة البنود`)
};

export const page_overview_next_action = /** @type {(inputs: Page_Overview_Next_ActionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإجراء التالي`)
};

export const page_overview_no_clarifications = /** @type {(inputs: Page_Overview_No_ClarificationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد استيضاحات في هذا الملف.`)
};

export const page_overview_no_handover = /** @type {(inputs: Page_Overview_No_HandoverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد تسليم في هذا الملف بعد.`)
};

export const page_overview_no_lines = /** @type {(inputs: Page_Overview_No_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد بنود في هذا الملف بعد.`)
};

export const page_overview_nothing_ordered = /** @type {(inputs: Page_Overview_Nothing_OrderedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يُطلب شيء في هذا الملف بعد.`)
};

export const page_overview_open_tasks = /** @type {(inputs: Page_Overview_Open_TasksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المهام المفتوحة`)
};

export const page_overview_owner_backup = /** @type {(inputs: Page_Overview_Owner_BackupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المسؤول والبديل`)
};

export const page_overview_summary = /** @type {(inputs: Page_Overview_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملخص الملف`)
};

export const page_overview_timeline_subhead = /** @type {(inputs: Page_Overview_Timeline_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل خطوة تلقائية تذكر القاعدة التي شغّلتها، وكل خطوة بشرية تذكر الشخص. لا يُعدَّل شيء بعد وقوعه.`)
};

export const page_overview_timeline_title = /** @type {(inputs: Page_Overview_Timeline_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سجل النشاط — مسار التدقيق`)
};

export const page_overview_to_via = /** @type {(inputs: Page_Overview_To_ViaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إلى · عبر`)
};

export const page_pricing_approval = /** @type {(inputs: Page_Pricing_ApprovalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الموافقة`)
};

export const page_pricing_build_up = /** @type {(inputs: Page_Pricing_Build_UpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مكوّنات السعر لكل بند`)
};

export const page_pricing_build_up_subhead = /** @type {(inputs: Page_Pricing_Build_Up_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تكلفة المورّد + المصاريف المشتركة + إجمالي الربح = سعر البيع (EGP)`)
};

export const page_pricing_hidden = /** @type {(inputs: Page_Pricing_HiddenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التكاليف وهوامش الربح مخفية لدورك`)
};

export const page_pricing_how_built = /** @type {(inputs: Page_Pricing_How_BuiltInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كيف يُبنى السعر`)
};

export const page_pricing_levers = /** @type {(inputs: Page_Pricing_LeversInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هوامش الربح والخصم`)
};

export const page_pricing_lines = /** @type {(inputs: Page_Pricing_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسعير البنود`)
};

export const page_pricing_margin_vs_policy = /** @type {(inputs: Page_Pricing_Margin_Vs_PolicyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هامش الربح مقابل السياسة`)
};

export const page_pricing_not_priced = /** @type {(inputs: Page_Pricing_Not_PricedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم تُسعَّر أي بنود بعد.`)
};

export const page_pricing_not_priced_description = /** @type {(inputs: Page_Pricing_Not_Priced_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختر عرضًا لبند لتسعيره.`)
};

export const page_pricing_policy_checks = /** @type {(inputs: Page_Pricing_Policy_ChecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فحوص السياسة`)
};

export const page_pricing_shared_charges = /** @type {(inputs: Page_Pricing_Shared_ChargesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المصاريف المشتركة`)
};

export const page_pricing_what_if = /** @type {(inputs: Page_Pricing_What_IfInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ماذا لو`)
};

export const page_profit_claims = /** @type {(inputs: Page_Profit_ClaimsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المطالبات`)
};

export const page_profit_close_checklist = /** @type {(inputs: Page_Profit_Close_ChecklistInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قائمة فحوص الإغلاق`)
};

export const page_profit_close_progress = /** @type {(inputs: Page_Profit_Close_ProgressInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تقدّم الإغلاق`)
};

export const page_profit_cost_title = /** @type {(inputs: Page_Profit_Cost_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التكلفة المتوقعة مقابل الفعلية`)
};

export const page_profit_damage = /** @type {(inputs: Page_Profit_DamageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الضرر موضوع المطالبة`)
};

export const page_profit_denied = /** @type {(inputs: Page_Profit_DeniedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الربح والتكاليف وهوامش الربح غير ظاهرة للمبيعات.`)
};

export const page_profit_fx = /** @type {(inputs: Page_Profit_FxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فروق أسعار الصرف`)
};

export const page_profit_no_claims = /** @type {(inputs: Page_Profit_No_ClaimsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا مطالبات قبل احتساب تكاليف الملف.`)
};

export const page_profit_no_cost_sheet = /** @type {(inputs: Page_Profit_No_Cost_SheetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد ورقة تكاليف بعد.`)
};

export const page_profit_no_cost_sheet_description = /** @type {(inputs: Page_Profit_No_Cost_Sheet_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تُثبَّت التكاليف المتوقعة عند تأكيد أمر شراء العميل.`)
};

export const page_profit_no_delivery = /** @type {(inputs: Page_Profit_No_DeliveryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد تسليم يمكن المطالبة عنه بعد.`)
};

export const page_profit_no_receipts = /** @type {(inputs: Page_Profit_No_ReceiptsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد مقبوضات بعد.`)
};

export const page_project_acceptance = /** @type {(inputs: Page_Project_AcceptanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختبارات القبول من متطلباتك`)
};

export const page_project_brief = /** @type {(inputs: Page_Project_BriefInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`متطلباتك، بندًا بندًا`)
};

export const page_project_calendar = /** @type {(inputs: Page_Project_CalendarInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تقويم التسليم`)
};

export const page_project_every_phase = /** @type {(inputs: Page_Project_Every_PhaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يمتد عبر كل المراحل`)
};

export const page_project_eyebrow = /** @type {(inputs: Page_Project_EyebrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Golden Sea × SaaSTEMLY · خطة التنفيذ`)
};

export const page_project_follow = /** @type {(inputs: Page_Project_FollowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تابع ملفًا واحدًا`)
};

export const page_project_heading = /** @type {(inputs: Page_Project_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`من أول رسالة إلى آخر دفعة`)
};

export const page_project_milestones = /** @type {(inputs: Page_Project_MilestonesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المراحل الرئيسية`)
};

export const page_project_monthly = /** @type {(inputs: Page_Project_MonthlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الخطة الشهرية — من بدء التشغيل`)
};

export const page_project_no_phase = /** @type {(inputs: Page_Project_No_PhaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد مرحلة مخططة هنا.`)
};

export const page_project_passing = /** @type {(inputs: Page_Project_PassingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختبارات القبول الناجحة`)
};

export const page_project_payment = /** @type {(inputs: Page_Project_PaymentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تُدفع آخر 20% بعد 30 يومًا من الاستخدام الفعلي.`)
};

export const page_project_problems = /** @type {(inputs: Page_Project_ProblemsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسع مشكلات ذكرتها. تسعة حلول.`)
};

export const page_project_roadmap = /** @type {(inputs: Page_Project_RoadmapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خارطة الطريق — 13 أسبوعًا على مراحل`)
};

export const page_project_start = /** @type {(inputs: Page_Project_StartInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ابدأ من صندوق الوارد`)
};

export const page_project_subtitle = /** @type {(inputs: Page_Project_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أربع مراحل على مدى 13 أسبوعًا، تظهر كلها في هذا العرض. كل متطلب في وثيقة متطلباتك مغطّى ومُثبت باختبار قبول قبل الدفعة الأخيرة.`)
};

export const page_project_trust = /** @type {(inputs: Page_Project_TrustInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الذكاء الاصطناعي لا يرسل ولا يسعّر ولا يدفع دون شخص.`)
};

export const page_project_weeks = /** @type {(inputs: Page_Project_WeeksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قيمة من الأسبوع 7. وكل شيء بحلول الأسبوع 13.`)
};

export const page_quote_approvals = /** @type {(inputs: Page_Quote_ApprovalsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الموافقات`)
};

export const page_quote_copy = /** @type {(inputs: Page_Quote_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نسخة العميل`)
};

export const page_quote_copy_subhead = /** @type {(inputs: Page_Quote_Copy_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`موجّهة للعميل: لا تُطبع أسماء الموردين ولا التكاليف ولا هوامش الربح أبدًا.`)
};

export const page_quote_decision = /** @type {(inputs: Page_Quote_DecisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حالة القرار`)
};

export const page_quote_internal = /** @type {(inputs: Page_Quote_InternalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`داخلي، لا يُطبع أبدًا`)
};

export const page_quote_no_portal = /** @type {(inputs: Page_Quote_No_PortalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد تقديم عبر البوابة للفحص.`)
};

export const page_quote_no_portal_description = /** @type {(inputs: Page_Quote_No_Portal_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تُفحص هنا فقط عروض الأسعار المرسلة عبر بوابة المشتريات لدى العميل.`)
};

export const page_quote_no_versions = /** @type {(inputs: Page_Quote_No_VersionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد إصدارات أخرى.`)
};

export const page_quote_portal = /** @type {(inputs: Page_Quote_PortalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فحص التقديم عبر البوابة`)
};

export const page_quote_versions = /** @type {(inputs: Page_Quote_VersionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإصدارات`)
};

export const page_records_activity_by_kind = /** @type {(inputs: Page_Records_Activity_By_KindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النشاط حسب النوع`)
};

export const page_records_activity_per_day = /** @type {(inputs: Page_Records_Activity_Per_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النشاط يوميًا`)
};

export const page_records_ai_calls_by_task = /** @type {(inputs: Page_Records_Ai_Calls_By_TaskInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلبات الذكاء الاصطناعي حسب المهمة`)
};

export const page_records_available_by_product = /** @type {(inputs: Page_Records_Available_By_ProductInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المتاح حسب الصنف`)
};

export const page_records_balance_by_age = /** @type {(inputs: Page_Records_Balance_By_AgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الرصيد المفتوح حسب العمر (USD)`)
};

export const page_records_balance_by_customer = /** @type {(inputs: Page_Records_Balance_By_CustomerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الرصيد المفتوح حسب العميل (USD)`)
};

export const page_records_bills_due_by_week = /** @type {(inputs: Page_Records_Bills_Due_By_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الفواتير المستحقة حسب الأسبوع`)
};

export const page_records_by_segment = /** @type {(inputs: Page_Records_By_SegmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حسب الشريحة`)
};

export const page_records_case_value_by_customer = /** @type {(inputs: Page_Records_Case_Value_By_CustomerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قيمة الملفات حسب العميل`)
};

export const page_records_cases_by_stage = /** @type {(inputs: Page_Records_Cases_By_StageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الملفات حسب المرحلة`)
};

export const page_records_cases_per_owner = /** @type {(inputs: Page_Records_Cases_Per_OwnerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الملفات لكل مسؤول`)
};

export const page_records_contact_rules = /** @type {(inputs: Page_Records_Contact_RulesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قواعد التواصل`)
};

export const page_records_customer_pos_per_week = /** @type {(inputs: Page_Records_Customer_Pos_Per_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أوامر شراء العملاء أسبوعيًا`)
};

export const page_records_customers_by_type = /** @type {(inputs: Page_Records_Customers_By_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العملاء حسب النوع`)
};

export const page_records_decisions_by_kind = /** @type {(inputs: Page_Records_Decisions_By_KindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`القرارات حسب النوع`)
};

export const page_records_deliveries_by_status = /** @type {(inputs: Page_Records_Deliveries_By_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التسليمات حسب الحالة`)
};

export const page_records_deliveries_per_case = /** @type {(inputs: Page_Records_Deliveries_Per_CaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التسليمات لكل ملف`)
};

export const page_records_exceptions_by_source = /** @type {(inputs: Page_Records_Exceptions_By_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الاستثناءات حسب المصدر`)
};

export const page_records_message_sources = /** @type {(inputs: Page_Records_Message_SourcesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مصادر الرسائل`)
};

export const page_records_messages_per_day = /** @type {(inputs: Page_Records_Messages_Per_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الرسائل يوميًا`)
};

export const page_records_money_in_out = /** @type {(inputs: Page_Records_Money_In_OutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الوارد والصادر`)
};

export const page_records_offers_by_compliance = /** @type {(inputs: Page_Records_Offers_By_ComplianceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العروض حسب المطابقة`)
};

export const page_records_offers_per_supplier = /** @type {(inputs: Page_Records_Offers_Per_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العروض لكل مورّد`)
};

export const page_records_order_value_by_supplier = /** @type {(inputs: Page_Records_Order_Value_By_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قيمة الطلبات حسب المورّد`)
};

export const page_records_orders_by_supplier = /** @type {(inputs: Page_Records_Orders_By_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الطلبات حسب المورّد`)
};

export const page_records_payments_per_week = /** @type {(inputs: Page_Records_Payments_Per_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المدفوعات أسبوعيًا`)
};

export const page_records_pricelists_per_principal = /** @type {(inputs: Page_Records_Pricelists_Per_PrincipalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قوائم الأسعار لكل موكِّل`)
};

export const page_records_prices_per_supplier = /** @type {(inputs: Page_Records_Prices_Per_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأسعار لكل مورّد`)
};

export const page_records_products_by_store = /** @type {(inputs: Page_Records_Products_By_StoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأصناف حسب المخزن`)
};

export const page_records_prospect_sources = /** @type {(inputs: Page_Records_Prospect_SourcesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مصادر العملاء المحتملين`)
};

export const page_records_quoted_value_by_status = /** @type {(inputs: Page_Records_Quoted_Value_By_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قيمة العروض حسب الحالة`)
};

export const page_records_receipts_by_warehouse = /** @type {(inputs: Page_Records_Receipts_By_WarehouseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الاستلامات حسب المخزن`)
};

export const page_records_requests_per_supplier = /** @type {(inputs: Page_Records_Requests_Per_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الطلبات لكل مورّد`)
};

export const page_records_stock_by_product = /** @type {(inputs: Page_Records_Stock_By_ProductInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المخزون المتاح حسب الصنف`)
};

export const page_records_supplier_kinds = /** @type {(inputs: Page_Records_Supplier_KindsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أنواع الموردين`)
};

export const page_records_suppliers_by_country = /** @type {(inputs: Page_Records_Suppliers_By_CountryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الموردون حسب الدولة`)
};

export const page_records_tasks_by_type = /** @type {(inputs: Page_Records_Tasks_By_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المهام حسب النوع`)
};

export const page_records_team_by_role = /** @type {(inputs: Page_Records_Team_By_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الفريق حسب الدور`)
};

export const page_records_units_by_warehouse = /** @type {(inputs: Page_Records_Units_By_WarehouseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الوحدات المتاحة حسب المخزن`)
};

export const page_records_vessels_by_type = /** @type {(inputs: Page_Records_Vessels_By_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السفن حسب النوع`)
};

export const page_records_vessels_per_customer = /** @type {(inputs: Page_Records_Vessels_Per_CustomerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السفن لكل عميل`)
};

export const page_records_who_owes_us = /** @type {(inputs: Page_Records_Who_Owes_UsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المبالغ المستحقة لنا (USD)`)
};

export const page_rfqs_arrivals_title = /** @type {(inputs: Page_Rfqs_Arrivals_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الردود الواردة`)
};

export const page_rfqs_closed = /** @type {(inputs: Page_Rfqs_ClosedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اعتذر · لم يرد`)
};

export const page_rfqs_closed_note = /** @type {(inputs: Page_Rfqs_Closed_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تذكيران، ثم يُنبَّه المسؤول`)
};

export const page_rfqs_draft_title = /** @type {(inputs: Page_Rfqs_Draft_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إعداد طلبات عروض الأسعار للموردين`)
};

export const page_rfqs_drafted_title = /** @type {(inputs: Page_Rfqs_Drafted_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسودات طلبات عروض الأسعار للموردين`)
};

export const page_rfqs_from_one = /** @type {(inputs: Page_Rfqs_From_OneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`من طلب عرض أسعار واحد للعميل`)
};

export const page_rfqs_lines = /** @type {(inputs: Page_Rfqs_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`البنود`)
};

export const page_rfqs_list_empty = /** @type {(inputs: Page_Rfqs_List_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد طلبات عروض أسعار للموردين بعد — أعِدّ مسوداتها أدناه.`)
};

export const page_rfqs_list_subhead = /** @type {(inputs: Page_Rfqs_List_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يرى كل مورّد البنود التي يمكنه تسعيرها فقط — ولا يرى العميل ولا السفينة ولا ملفات العميل أبدًا.`)
};

export const page_rfqs_matched_subhead = /** @type {(inputs: Page_Rfqs_Matched_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مطابَقة بالمرجع وسلسلة المراسلة والمرسل — حتى لو غيّر المورّد الموضوع.`)
};

export const page_rfqs_matched_title = /** @type {(inputs: Page_Rfqs_Matched_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ردود مطابَقة`)
};

export const page_rfqs_no_drafts = /** @type {(inputs: Page_Rfqs_No_DraftsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد مسودات بانتظار الإرسال.`)
};

export const page_rfqs_no_drafts_description = /** @type {(inputs: Page_Rfqs_No_Drafts_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تُحفظ المسودات هنا لمراجعتها قبل إرسالها.`)
};

export const page_rfqs_no_new_suppliers = /** @type {(inputs: Page_Rfqs_No_New_SuppliersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد موردون جدد من الردود بعد.`)
};

export const page_rfqs_no_previews = /** @type {(inputs: Page_Rfqs_No_PreviewsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد مسودات رسائل للمعاينة.`)
};

export const page_rfqs_no_replies = /** @type {(inputs: Page_Rfqs_No_RepliesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد ردود من الموردين بعد.`)
};

export const page_rfqs_none_chased = /** @type {(inputs: Page_Rfqs_None_ChasedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد مورّد قيد المتابعة.`)
};

export const page_rfqs_reminders_title = /** @type {(inputs: Page_Rfqs_Reminders_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التذكيرات والتصعيد`)
};

export const page_rfqs_replied = /** @type {(inputs: Page_Rfqs_RepliedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم الرد`)
};

export const page_rfqs_replied_note = /** @type {(inputs: Page_Rfqs_Replied_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عروض سُجّلت تلقائيًا`)
};

export const page_rfqs_review_empty = /** @type {(inputs: Page_Rfqs_Review_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا شيء ينتظر شخصًا.`)
};

export const page_rfqs_review_subhead = /** @type {(inputs: Page_Rfqs_Review_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل ما لا يتأكد منه الذكاء الاصطناعي ينتظر هنا — لا يُطبَّق شيء غير مؤكد من تلقاء نفسه.`)
};

export const page_rfqs_review_title = /** @type {(inputs: Page_Rfqs_Review_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تحتاج إلى شخص`)
};

export const page_rfqs_sent_due = /** @type {(inputs: Page_Rfqs_Sent_DueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإرسال · الاستحقاق`)
};

export const page_rfqs_supplier_rfqs = /** @type {(inputs: Page_Rfqs_Supplier_RfqsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلبات عروض الأسعار للموردين`)
};

export const page_rfqs_waiting = /** @type {(inputs: Page_Rfqs_WaitingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظار الرد`)
};

export const page_rfqs_waiting_note = /** @type {(inputs: Page_Rfqs_Waiting_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تذكيرات مجدولة`)
};

export const page_roles_alerted = /** @type {(inputs: Page_Roles_AlertedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`من يُنبَّه`)
};

export const page_roles_approval_rules = /** @type {(inputs: Page_Roles_Approval_RulesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قواعد الموافقة`)
};

export const page_roles_enforced = /** @type {(inputs: Page_Roles_EnforcedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مُطبَّقة فعلًا، لا مكتوبة فقط`)
};

export const page_roles_eyebrow = /** @type {(inputs: Page_Roles_EyebrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الفريق · الصلاحيات`)
};

export const page_roles_heading = /** @type {(inputs: Page_Roles_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأدوار والصلاحيات`)
};

export const page_roles_matrix = /** @type {(inputs: Page_Roles_MatrixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مصفوفة الصلاحيات`)
};

export const page_roles_matrix_subhead = /** @type {(inputs: Page_Roles_Matrix_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`من يرى ماذا ومن يعتمد ماذا، لكل دور وشخص. تُؤكَّد أسماء المستخدمين والتراخيص في المرحلة 0. تعدّل الإدارة الدور: فيسري على كل من فيه ويُسجَّل في مسار التدقيق.`)
};

export const page_roles_no_alert = /** @type {(inputs: Page_Roles_No_AlertInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يُنبَّه أحد خلال ساعات العمل.`)
};

export const page_roles_no_alert_description = /** @type {(inputs: Page_Roles_No_Alert_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يتولى مسؤول الملف طلب عرض الأسعار.`)
};

export const page_roles_people = /** @type {(inputs: Page_Roles_PeopleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأشخاص`)
};

export const page_roles_role = /** @type {(inputs: Page_Roles_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الدور`)
};

export const page_roles_roster = /** @type {(inputs: Page_Roles_RosterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جدول المناوبة`)
};

export const page_roles_roster_subhead = /** @type {(inputs: Page_Roles_Roster_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ساعات العمل من الأحد إلى الخميس 08:00–17:00 بتوقيت القاهرة. وخارجها، تنبّه طلبات عروض الأسعار العاجلة (أو وصول سفينة خلال أقل من 24 ساعة) المناوب عبر WhatsApp / SMS، ثم البديل، ثم كبار المسؤولين. تعدّل الإدارة ومدير المكتب المناوبات.`)
};

export const page_roles_routing = /** @type {(inputs: Page_Roles_RoutingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التوجيه بعد ساعات العمل — جرّبه`)
};

export const page_roles_subtitle = /** @type {(inputs: Page_Roles_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا ترى المبيعات التكاليف ولا هوامش الربح أبدًا؛ والموافقات تحتاج إلى شخص مسمّى؛ وتغيير البيانات البنكية يحتاج إلى شخصين. وتذهب طلبات عروض الأسعار العاجلة بعد ساعات العمل إلى المناوب.`)
};

export const page_roles_where = /** @type {(inputs: Page_Roles_WhereInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أين تُطبَّق كل صلاحية`)
};

export const page_room_ack = /** @type {(inputs: Page_Room_AckInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`زمن الإقرار بالاستلام`)
};

export const page_room_ask = /** @type {(inputs: Page_Room_AskInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اسأل Golden Sea`)
};

export const page_room_briefing = /** @type {(inputs: Page_Room_BriefingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`07:00 · الموجز اليومي من الذكاء الاصطناعي`)
};

export const page_room_deliveries = /** @type {(inputs: Page_Room_DeliveriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسليمات هذا الشهر`)
};

export const page_room_fast_late = /** @type {(inputs: Page_Room_Fast_LateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سريع لكنه متأخر`)
};

export const page_room_funnel = /** @type {(inputs: Page_Room_FunnelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسار عروض الأسعار`)
};

export const page_room_gp_bridge = /** @type {(inputs: Page_Room_Gp_BridgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إجمالي الربح: من المتوقع إلى الفعلي`)
};

export const page_room_inquiries = /** @type {(inputs: Page_Room_InquiriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الاستفسارات يوميًا`)
};

export const page_room_live_cases = /** @type {(inputs: Page_Room_Live_CasesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الملفات الجارية`)
};

export const page_room_lost = /** @type {(inputs: Page_Room_LostInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أسباب خسارة العروض`)
};

export const page_room_no_gp = /** @type {(inputs: Page_Room_No_GpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد إجمالي ربح للمقارنة بعد.`)
};

export const page_room_no_ranking = /** @type {(inputs: Page_Room_No_RankingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد ترتيب لعرضه.`)
};

export const page_room_no_receivables = /** @type {(inputs: Page_Room_No_ReceivablesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد ذمم مدينة مفتوحة.`)
};

export const page_room_no_trend = /** @type {(inputs: Page_Room_No_TrendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد اتجاه لعرضه.`)
};

export const page_room_ontime = /** @type {(inputs: Page_Room_OntimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الموردون حسب التسليم في الموعد`)
};

export const page_room_ontime_subhead = /** @type {(inputs: Page_Room_Ontime_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأفضل أولًا؛ مع زمن الرد وطلبات عروض الأسعار المفتوحة تحت كل مورّد، من السجلات الحية`)
};

export const page_room_per_owner = /** @type {(inputs: Page_Room_Per_OwnerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الملفات الجارية لكل مسؤول`)
};

export const page_room_per_owner_subhead = /** @type {(inputs: Page_Room_Per_Owner_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لكل ملف جارٍ مسؤول وموعد نهائي وإجراء تالٍ`)
};

export const page_room_profit_cash = /** @type {(inputs: Page_Room_Profit_CashInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الربح والنقد`)
};

export const page_room_quadrant = /** @type {(inputs: Page_Room_QuadrantInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الموردون: الالتزام بالمواعيد مقابل سرعة الرد`)
};

export const page_room_quadrant_subhead = /** @type {(inputs: Page_Room_Quadrant_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل مورّد حسب تسليماته في الموعد وسرعة رده؛ اختر أحدهم لفتحه`)
};

export const page_room_receivables_age = /** @type {(inputs: Page_Room_Receivables_AgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الذمم المدينة حسب العمر`)
};

export const page_room_receivables_customer = /** @type {(inputs: Page_Room_Receivables_CustomerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الذمم المدينة حسب العميل`)
};

export const page_room_reliable_fast = /** @type {(inputs: Page_Room_Reliable_FastInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`موثوق وسريع`)
};

export const page_room_reliable_slow = /** @type {(inputs: Page_Room_Reliable_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`موثوق لكنه بطيء`)
};

export const page_room_slow_late = /** @type {(inputs: Page_Room_Slow_LateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بطيء ومتأخر`)
};

export const page_room_targets = /** @type {(inputs: Page_Room_TargetsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأهداف`)
};

export const page_room_turnaround = /** @type {(inputs: Page_Room_TurnaroundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سرعة إعداد عروض الأسعار`)
};

export const page_room_waits = /** @type {(inputs: Page_Room_WaitsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ما تنتظره الملفات الجارية`)
};

export const page_sourcing_description = /** @type {(inputs: Page_Sourcing_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الرسائل المطلوب مراجعتها، وطلبات الموردين بانتظار الرد، والعروض المطلوب فحصها، في صفحة واحدة.`)
};

export const page_sourcing_eyebrow = /** @type {(inputs: Page_Sourcing_EyebrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مكتب التوريد`)
};

export const page_sourcing_heading = /** @type {(inputs: Page_Sourcing_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسار التوريد`)
};

export const page_sourcing_messages_subhead = /** @type {(inputs: Page_Sourcing_Messages_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الرسائل الجديدة والمعلَّمة؛ تُفتح الرسالة بجوار القائمة.`)
};

export const page_sourcing_messages_title = /** @type {(inputs: Page_Sourcing_Messages_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`رسائل للمراجعة`)
};

export const page_sourcing_nav = /** @type {(inputs: Page_Sourcing_NavInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المسار`)
};

export const page_sourcing_offers_subhead = /** @type {(inputs: Page_Sourcing_Offers_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التكافؤ الفني قرار يتخذه شخص مسؤول.`)
};

export const page_sourcing_offers_title = /** @type {(inputs: Page_Sourcing_Offers_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عروض للمراجعة`)
};

export const page_sourcing_rfqs_title = /** @type {(inputs: Page_Sourcing_Rfqs_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلبات الموردين بانتظار الرد`)
};

export const page_sourcing_subtitle = /** @type {(inputs: Page_Sourcing_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الرسائل المطلوب قراءتها، وطلبات الموردين بانتظار الرد، والعروض المطلوب مراجعتها، في صفحة واحدة.`)
};

export const page_usage_against_plan = /** @type {(inputs: Page_Usage_Against_PlanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هذا الشهر مقارنةً بالخطة عند الاستخدام الكامل`)
};

export const page_usage_ai_calls = /** @type {(inputs: Page_Usage_Ai_CallsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلبات الذكاء الاصطناعي حسب المهمة`)
};

export const page_usage_ai_log = /** @type {(inputs: Page_Usage_Ai_LogInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سجل الذكاء الاصطناعي`)
};

export const page_usage_changes_subhead = /** @type {(inputs: Page_Usage_Changes_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يُقدَّر كل طلب ويُعتمد قبل بدء العمل.`)
};

export const page_usage_changes_title = /** @type {(inputs: Page_Usage_Changes_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلبات التعديل`)
};

export const page_usage_edit_plan = /** @type {(inputs: Page_Usage_Edit_PlanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تعديل الخطة`)
};

export const page_usage_eyebrow = /** @type {(inputs: Page_Usage_EyebrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإعدادات · الخدمة`)
};

export const page_usage_heading = /** @type {(inputs: Page_Usage_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استخدام الخدمة`)
};

export const page_usage_subtitle = /** @type {(inputs: Page_Usage_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ما أنجزته المنصة هذا الشهر، محسوبًا بالطريقة نفسها التي تُحسب بها تكاليف التشغيل: المستندات المقروءة، والأسئلة المُجاب عنها، ورسائل البريد المعالَجة، وساعات الدعم، والتعديلات. الأشهر الأهدأ تستهلك أقل.`)
};

export const page_usage_support_subhead = /** @type {(inputs: Page_Usage_Support_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`من الأحد إلى الخميس، في ساعات عملك: إصلاحات وتحديثات وتصحيحات أمنية واستفسارات.`)
};

export const page_usage_support_title = /** @type {(inputs: Page_Usage_Support_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سجل الدعم`)
};

export const page_value_eyebrow = /** @type {(inputs: Page_Value_EyebrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التحليلات · القيمة`)
};

export const page_value_heading = /** @type {(inputs: Page_Value_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ما تقدّمه لك المنصة من قيمة`)
};

export const page_value_payback = /** @type {(inputs: Page_Value_PaybackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`متى تسترد المنصة تكلفتها`)
};

export const page_value_plan = /** @type {(inputs: Page_Value_PlanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خطة التنفيذ`)
};

export const page_value_subtitle = /** @type {(inputs: Page_Value_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الطلبات الإضافية المكتسبة والساعات الموفَّرة، بأرقامك أنت. حرّك المؤشرات؛ لا يُحفظ شيء. وفي الأسفل، ما وفّره عمل الذكاء الاصطناعي هذا الشهر.`)
};

export const page_value_usage = /** @type {(inputs: Page_Value_UsageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استخدام الخدمة`)
};

export const profit_actual_against_expected = /** @type {(inputs: Profit_Actual_Against_ExpectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الفعلي مقابل المتوقع`)
};

export const profit_actual_final = /** @type {(inputs: Profit_Actual_FinalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`هامش ربح ${i?.pct} · نهائي، كل التكاليف فعلية`)
};

export const profit_actual_so_far = /** @type {(inputs: Profit_Actual_So_FarInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`هامش ربح ${i?.pct} · حتى الآن، لا بنود إغلاق مفتوحة`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`هامش ربح ${i?.pct} · حتى الآن، بند إغلاق واحد مفتوح`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`هامش ربح ${i?.pct} · حتى الآن، بندا إغلاق مفتوحان`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`هامش ربح ${i?.pct} · حتى الآن، ${__paraglideRegistry.icuPound("ar", i?.count, {})} بنود إغلاق مفتوحة`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`هامش ربح ${i?.pct} · حتى الآن، ${__paraglideRegistry.icuPound("ar", i?.count, {})} بندًا مفتوحًا للإغلاق`);
	return /** @type {LocalizedString} */ (`هامش ربح ${i?.pct} · حتى الآن، ${__paraglideRegistry.icuPound("ar", i?.count, {})} بند إغلاق مفتوح`)
};

export const profit_at_quotation = /** @type {(inputs: Profit_At_QuotationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عند عرض السعر`)
};

export const profit_check_done = /** @type {(inputs: Profit_Check_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم`)
};

export const profit_check_open = /** @type {(inputs: Profit_Check_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مفتوح`)
};

export const profit_checklist_note = /** @type {(inputs: Profit_Checklist_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يُغلق الملف إلا بعد مطابقة الكميات والمستندات والمطالبات والأرصدة.`)
};

export const profit_checks_green_heading = /** @type {(inputs: Profit_Checks_Green_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل بنود الإغلاق مكتملة`)
};

export const profit_checks_green_label = /** @type {(inputs: Profit_Checks_Green_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`البنود المكتملة`)
};

export const profit_checks_green_text = /** @type {(inputs: Profit_Checks_Green_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الكميات والمستندات والمطالبات والأرصدة متطابقة: يمكن إغلاق الملف.`)
};

export const profit_checks_open = /** @type {(inputs: Profit_Checks_OpenInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`لا بنود إغلاق مفتوحة`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`بند إغلاق واحد مفتوح`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`بندا إغلاق مفتوحان`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} بنود إغلاق مفتوحة`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} بندًا مفتوحًا للإغلاق`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} بند إغلاق مفتوح`)
};

export const profit_checks_open_text = /** @type {(inputs: Profit_Checks_Open_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يصبح الربح الفعلي نهائيًا بعد تأكيد كل تكلفة مقابل فاتورتها وإغلاق الملف.`)
};

export const profit_claim = /** @type {(inputs: Profit_ClaimInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} على ${i?.against} · ${i?.note}`)
};

export const profit_claim_settled = /** @type {(inputs: Profit_Claim_SettledInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} على ${i?.against} · ${i?.note} · سُوّيت بإشعار دائن ${i?.creditNote}`)
};

export const profit_claims_empty = /** @type {(inputs: Profit_Claims_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا مطالبات على هذا الملف.`)
};

export const profit_closed_heading = /** @type {(inputs: Profit_Closed_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الملف مغلق ومسوّى`)
};

export const profit_closed_text = /** @type {(inputs: Profit_Closed_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سُجّل الربح الفعلي؛ وأُضيفت أسعار الموردين ونتائج الالتزام بالمواعيد إلى سجلات الموردين.`)
};

export const profit_closed_text_at = /** @type {(inputs: Profit_Closed_Text_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُغلق في ${i?.at}. سُجّل الربح الفعلي؛ وأُضيفت أسعار الموردين ونتائج الالتزام بالمواعيد إلى سجلات الموردين.`)
};

export const profit_col_actual = /** @type {(inputs: Profit_Col_ActualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الفعلي`)
};

export const profit_col_cost = /** @type {(inputs: Profit_Col_CostInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التكلفة`)
};

export const profit_col_difference = /** @type {(inputs: Profit_Col_DifferenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الفرق`)
};

export const profit_col_expected = /** @type {(inputs: Profit_Col_ExpectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المتوقع`)
};

export const profit_col_fx = /** @type {(inputs: Profit_Col_FxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فرق العملة`)
};

export const profit_col_rate = /** @type {(inputs: Profit_Col_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السعر`)
};

export const profit_col_realised = /** @type {(inputs: Profit_Col_RealisedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`محقق`)
};

export const profit_col_receipt = /** @type {(inputs: Profit_Col_ReceiptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المقبوض`)
};

export const profit_col_status = /** @type {(inputs: Profit_Col_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الحالة`)
};

export const profit_costs_note = /** @type {(inputs: Profit_Costs_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التكاليف كما قُدّرت عند اعتماد عرض السعر، وكما وردت في الفواتير. تحل الفواتير محل التقديرات بعد أن يؤكدها شخص؛ ولا يتغير شيء تلقائيًا.`)
};

export const profit_damage_audio_prompt = /** @type {(inputs: Profit_Damage_Audio_PromptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تصف هذه الرسالة الصوتية بضائع سُلّمت إلى سفينة. اكتب التلف أو النقص لتقديم مطالبة: أي الأصناف، وكم عددها، وما المشكلة.`)
};

export const profit_damage_image_prompt = /** @type {(inputs: Profit_Damage_Image_PromptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تُظهر هذه الصورة بضائع سُلّمت إلى سفينة. صِف أي تلف لتقديم مطالبة: أي الأصناف، وكم عددها، وما التالف (انبعاجات، تسريبات، أختام مكسورة، كراتين مبللة)، وأي ملصقات أو أرقام قطع أو أرقام تشغيلات ظاهرة. اكتب فقط ما تراه.`)
};

export const profit_damage_label = /** @type {(inputs: Profit_Damage_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`وصف التلف من صورة`)
};

export const profit_date_time = /** @type {(inputs: Profit_Date_TimeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.date}، ${i?.time}`)
};

export const profit_done_of = /** @type {(inputs: Profit_Done_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.done} / ${i?.total}`)
};

export const profit_figure_actual = /** @type {(inputs: Profit_Figure_ActualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إجمالي الربح الفعلي`)
};

export const profit_figure_difference = /** @type {(inputs: Profit_Figure_DifferenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الفرق`)
};

export const profit_figure_expected = /** @type {(inputs: Profit_Figure_ExpectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إجمالي الربح المتوقع`)
};

export const profit_figure_fx = /** @type {(inputs: Profit_Figure_FxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فرق العملة`)
};

export const profit_fx_empty = /** @type {(inputs: Profit_Fx_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا مقبوضات بعد.`)
};

export const profit_fx_empty_egp = /** @type {(inputs: Profit_Fx_Empty_EgpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الفاتورة بالجنيه (EGP)، فلا يوجد فرق في سعر الصرف.`)
};

export const profit_fx_note = /** @type {(inputs: Profit_Fx_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`سعر العرض ${i?.quoted} · اليوم ${i?.today} EGP/${i?.currency}`)
};

export const profit_fx_table_note = /** @type {(inputs: Profit_Fx_Table_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تُسجَّل الإيرادات بسعر عرض السعر (${i?.rate} EGP/${i?.currency})؛ ويُحوَّل كل مقبوض بسعر البنك الفعلي. الإيرادات المتوقعة ${i?.expected} · الفعلية ${i?.actual}.`)
};

export const profit_green_of = /** @type {(inputs: Profit_Green_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.done} من ${i?.total} مكتمل`)
};

export const profit_invoiced_egp = /** @type {(inputs: Profit_Invoiced_EgpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الفاتورة بالجنيه (EGP)`)
};

export const profit_margin = /** @type {(inputs: Profit_MarginInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`هامش ربح ${i?.pct}`)
};

export const profit_margin_points = /** @type {(inputs: Profit_Margin_PointsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.points} نقطة من هامش الربح`)
};

export const profit_not_costed_heading = /** @type {(inputs: Profit_Not_Costed_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يُحدَّد الربح المتوقع عند أمر شراء العميل`)
};

export const profit_not_costed_text = /** @type {(inputs: Profit_Not_Costed_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.caseId} في مرحلة «${i?.stage}». يؤخذ الربح المتوقع من عرض السعر المعتمد بعد تأكيد أمر شراء العميل؛ ويتبعه الفعلي مع وصول فواتير الموردين.`)
};

export const profit_of_expected = /** @type {(inputs: Profit_Of_ExpectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`من الربح المتوقع`)
};

export const profit_quoted_rate = /** @type {(inputs: Profit_Quoted_RateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`سعر العرض ${i?.rate}`)
};

export const profit_rate_change = /** @type {(inputs: Profit_Rate_ChangeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`السعر ${i?.from} ← ${i?.to}`)
};

export const profit_realised = /** @type {(inputs: Profit_RealisedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`محقَّق`)
};

export const profit_state_actual = /** @type {(inputs: Profit_State_ActualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فعلي`)
};

export const profit_state_billed = /** @type {(inputs: Profit_State_BilledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مفوتر، بانتظار التأكيد`)
};

export const profit_state_estimate = /** @type {(inputs: Profit_State_EstimateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تقديري`)
};

export const profit_state_not_applicable = /** @type {(inputs: Profit_State_Not_ApplicableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا ينطبق`)
};

export const profit_total_cost = /** @type {(inputs: Profit_Total_CostInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إجمالي التكلفة`)
};

export const profit_unrealised = /** @type {(inputs: Profit_UnrealisedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`غير محقَّق`)
};

export const project_acceptance_note = /** @type {(inputs: Project_Acceptance_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`السيناريوهات العشرة التي طلبتم رؤيتها مباشرة، لكلٍّ منها دليله. فُحصت على بيانات هذا العرض التوضيحي ${i?.at}؛ وعند التشغيل الفعلي تعمل على بياناتكم.`)
};

export const project_answer = /** @type {(inputs: Project_AnswerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`← ${i?.answer}`)
};

export const project_brief_note = /** @type {(inputs: Project_Brief_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل متطلب مصمَّم، مع الشاشة التي تعرضه واختبار قبول.`)
};

export const project_col_checked = /** @type {(inputs: Project_Col_CheckedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فُحص مباشرة`)
};

export const project_col_open = /** @type {(inputs: Project_Col_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فتح`)
};

export const project_col_requirement = /** @type {(inputs: Project_Col_RequirementInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`من متطلباتكم`)
};

export const project_col_scenario = /** @type {(inputs: Project_Col_ScenarioInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السيناريو`)
};

export const project_col_status = /** @type {(inputs: Project_Col_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الحالة`)
};

export const project_covered = /** @type {(inputs: Project_CoveredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مغطّى`)
};

export const project_covered_of = /** @type {(inputs: Project_Covered_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.done} / ${i?.total} مغطّى`)
};

export const project_done_of = /** @type {(inputs: Project_Done_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.done} / ${i?.total}`)
};

export const project_monthly_note = /** @type {(inputs: Project_Monthly_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خطة شهرية واحدة تُبقي كل شيء يعمل بعد التشغيل الفعلي.`)
};

export const project_monthly_note_licences = /** @type {(inputs: Project_Monthly_Note_LicencesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تراخيص Odoo مع Odoo مباشرة. طلبات التغيير الأكبر يُحدَّد نطاقها ويُتفق عليها بشكل منفصل.`)
};

export const project_open = /** @type {(inputs: Project_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فتح`)
};

export const project_open_in_demo = /** @type {(inputs: Project_Open_In_DemoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فتح في العرض التوضيحي`)
};

export const project_pass_of = /** @type {(inputs: Project_Pass_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.done} / ${i?.total} ناجح`)
};

export const project_passing = /** @type {(inputs: Project_PassingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ناجح`)
};

export const project_payment_note = /** @type {(inputs: Project_Payment_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تُدفع كل مرحلة على ثلاث دفعات، فلا تدفعون الجزء الأخير إلا بعد أن تعمل بين أيديكم.`)
};

export const project_phase = /** @type {(inputs: Project_PhaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المرحلة`)
};

export const project_phase_n = /** @type {(inputs: Project_Phase_NInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`المرحلة ${i?.n}`)
};

export const project_problem = /** @type {(inputs: Project_ProblemInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`المشكلة ${i?.n}`)
};

export const project_roadmap_note = /** @type {(inputs: Project_Roadmap_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تُعتمد كل مرحلة على حدة؛ ومراجعة أسبوعية مدتها 45 دقيقة تجمع التقدم وأرقام الأساس والقرارات في مكان واحد.`)
};

export const project_show_me = /** @type {(inputs: Project_Show_MeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اعرض لي`)
};

export const project_tests_pass = /** @type {(inputs: Project_Tests_PassInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} من ${i?.total} اختبارات قبول ناجحة`)
};

export const project_week = /** @type {(inputs: Project_WeekInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أ${i?.n}`)
};

export const roles_after_hours = /** @type {(inputs: Roles_After_HoursInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خارج الدوام`)
};

export const roles_alert_sent = /** @type {(inputs: Roles_Alert_SentInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُرسل التنبيه إلى ${i?.name} (WhatsApp / SMS محاكاة · أُنشئ إشعار)`)
};

export const roles_failing = /** @type {(inputs: Roles_FailingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فاشل`)
};

export const roles_in_hours_text = /** @type {(inputs: Roles_In_Hours_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.reason} ساعات الدوام: يتولاه مسؤول الملف؛ لا حاجة إلى تنبيه.`)
};

export const roles_office_hours = /** @type {(inputs: Roles_Office_HoursInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ساعات الدوام`)
};

export const roles_open_pricing = /** @type {(inputs: Roles_Open_PricingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فتح تسعير GS-RFQ-0142`)
};

export const roles_preset_friday = /** @type {(inputs: Roles_Preset_FridayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الجمعة 20 نوفمبر 10:00، عطلة نهاية الأسبوع`)
};

export const roles_preset_office = /** @type {(inputs: Roles_Preset_OfficeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الثلاثاء 17 نوفمبر 11:30، ساعات الدوام`)
};

export const roles_preset_saturday = /** @type {(inputs: Roles_Preset_SaturdayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السبت 21 نوفمبر 14:00، عطلة نهاية الأسبوع`)
};

export const roles_preset_sunday = /** @type {(inputs: Roles_Preset_SundayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأحد 22 نوفمبر 06:30، قبل الدوام`)
};

export const roles_preset_tonight = /** @type {(inputs: Roles_Preset_TonightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الليلة 21:40`)
};

export const roles_send_alert = /** @type {(inputs: Roles_Send_AlertInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إرسال التنبيه (محاكاة)`)
};

export const roles_simulator_choice = /** @type {(inputs: Roles_Simulator_ChoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`متى يصل طلب عرض الأسعار العاجل`)
};

export const roles_simulator_note = /** @type {(inputs: Roles_Simulator_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختر متى يصل طلب عرض أسعار عاجل. تحدد قاعدة «طلبات عروض الأسعار خارج الدوام وفي العطلات» من يُنبَّه؛ والتنبيه محاكاة ويصل إلى إشعارات ذلك الشخص.`)
};

export const roles_step_backup = /** @type {(inputs: Roles_Step_BackupInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`+${i?.minutes} د: ${i?.name} (احتياطي)`)
};

export const roles_step_now = /** @type {(inputs: Roles_Step_NowInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الآن: ${i?.name} (المناوب)`)
};

export const roles_step_senior = /** @type {(inputs: Roles_Step_SeniorInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`ثم: ${i?.names} (الإدارة العليا)`)
};

export const roles_try_it = /** @type {(inputs: Roles_Try_ItInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جرّب: بدّل المستخدم الحالي إلى Soaad Amer (المبيعات) وافتح تبويب التسعير في GS-RFQ-0142. تختفي التكاليف وهوامش الربح.`)
};

export const roles_verified = /** @type {(inputs: Roles_VerifiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`متحقَّق منه`)
};

export const service_at_full_use = /** @type {(inputs: Service_At_Full_UseInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.full} عند الاستخدام الكامل`)
};

export const service_calls_share = /** @type {(inputs: Service_Calls_ShareInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.part} من ${i?.calls} من طلبات الذكاء الاصطناعي`)
};

export const service_checked = /** @type {(inputs: Service_CheckedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`راجعها شخص`)
};

export const service_checked_note = /** @type {(inputs: Service_Checked_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نتائج الذكاء الاصطناعي المؤكدة أو المصححة أو المرفوضة`)
};

export const service_documents_share = /** @type {(inputs: Service_Documents_ShareInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`المستندات: ${i?.documents} من ${i?.full} عند الاستخدام الكامل`)
};

export const service_extra_orders = /** @type {(inputs: Service_Extra_OrdersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الطلبات الإضافية المكسوبة شهريًا`)
};

export const service_gross_margin = /** @type {(inputs: Service_Gross_MarginInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هامش الربح الإجمالي`)
};

export const service_hour_cost = /** @type {(inputs: Service_Hour_CostInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تكلفة الساعة`)
};

export const service_hours = /** @type {(inputs: Service_HoursInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`${i?.hours} ساعة`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`ساعة واحدة`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`ساعتان`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`${i?.hours} ساعات`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`${i?.hours} ساعة`);
	return /** @type {LocalizedString} */ (`${i?.hours} ساعة`)
};

export const service_hours_per_person = /** @type {(inputs: Service_Hours_Per_PersonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الساعات الموفَّرة للشخص أسبوعيًا`)
};

export const service_hours_saved = /** @type {(inputs: Service_Hours_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ساعات الكتابة الموفَّرة`)
};

export const service_hours_saved_note = /** @type {(inputs: Service_Hours_Saved_NoteInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`نحو ${i?.minutes} دقيقة للمستند يدويًا`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`نحو دقيقة واحدة للمستند يدويًا`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`نحو دقيقتين للمستند يدويًا`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`نحو ${i?.minutes} دقائق للمستند يدويًا`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`نحو ${i?.minutes} دقيقة للمستند يدويًا`);
	return /** @type {LocalizedString} */ (`نحو ${i?.minutes} دقيقة للمستند يدويًا`)
};

export const service_margin_month = /** @type {(inputs: Service_Margin_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هامش الربح من الطلبات الإضافية شهريًا`)
};

export const service_order_value = /** @type {(inputs: Service_Order_ValueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`متوسط قيمة الطلب`)
};

export const service_payback = /** @type {(inputs: Service_PaybackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استرداد التكلفة`)
};

export const service_payback_note = /** @type {(inputs: Service_Payback_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`يبدأ بأرقام المثال في العرض، فحرّك المؤشرات إلى أرقامك. هذا الشهر قرأ الذكاء الاصطناعي بالفعل مستندات عددها ${i?.documents}، أي نحو ${i?.hours} من ساعات الكتابة.`)
};

export const service_people = /** @type {(inputs: Service_PeopleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عدد المستخدمين`)
};

export const service_plan_note = /** @type {(inputs: Service_Plan_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.month}، اليوم ${i?.day} من ${i?.days}. العلامة هي الخطة عند الاستخدام الكامل، والأشهر الأهدأ تستخدم أقل.`)
};

export const service_replies_matched = /** @type {(inputs: Service_Replies_MatchedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الردود المطابَقة`)
};

export const service_replies_matched_note = /** @type {(inputs: Service_Replies_Matched_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ردود الموردين المحفوظة في ملفاتها`)
};

export const service_replies_share = /** @type {(inputs: Service_Replies_ShareInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.automatic} من ${i?.matched} دون تدخل أحد`)
};

export const service_so_far = /** @type {(inputs: Service_So_FarInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.used} حتى الآن، والمتوقع ${i?.pace} بهذا المعدل`)
};

export const service_time_month = /** @type {(inputs: Service_Time_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قيمة الوقت الموفَّر شهريًا`)
};

export const service_value_month = /** @type {(inputs: Service_Value_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`القيمة شهريًا`)
};

export const service_value_year = /** @type {(inputs: Service_Value_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`القيمة سنويًا`)
};

export const service_waiting = /** @type {(inputs: Service_WaitingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظار المراجعة`)
};

export const service_waiting_note = /** @type {(inputs: Service_Waiting_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النتائج غير المؤكدة لا تُطبَّق تلقائيًا أبدًا`)
};

export const sourcing_all_held = /** @type {(inputs: Sourcing_All_HeldInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل البنود معلّقة حتى توضيحها.`)
};

export const sourcing_client_removed = /** @type {(inputs: Sourcing_Client_RemovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حُذف اسم العميل`)
};

export const sourcing_discard_drafts = /** @type {(inputs: Sourcing_Discard_DraftsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تجاهل المسودات`)
};

export const sourcing_draft = /** @type {(inputs: Sourcing_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسودة`)
};

export const sourcing_draft_rfqs = /** @type {(inputs: Sourcing_Draft_RfqsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صياغة طلبات عروض الأسعار`)
};

export const sourcing_draft_rfqs_prompt = /** @type {(inputs: Sourcing_Draft_Rfqs_PromptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صياغة طلبات عروض أسعار للموردين`)
};

export const sourcing_drafts_discarded = /** @type {(inputs: Sourcing_Drafts_DiscardedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حُذفت المسودات، ولم يُرسل شيء`)
};

export const sourcing_full = /** @type {(inputs: Sourcing_FullInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`القائمة كاملة`)
};

export const sourcing_full_note = /** @type {(inputs: Sourcing_Full_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يتلقى موردو التموين العام كل البنود في طلب عرض أسعار واحد.`)
};

export const sourcing_held_back = /** @type {(inputs: Sourcing_Held_BackInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مؤجَّلة حتى التوضيح: ${i?.lines}`)
};

export const sourcing_how_to_send = /** @type {(inputs: Sourcing_How_To_SendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طريقة الإرسال`)
};

export const sourcing_line_asked = /** @type {(inputs: Sourcing_Line_AskedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`طُلب في: ${i?.rfqs}`)
};

export const sourcing_line_held = /** @type {(inputs: Sourcing_Line_HeldInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`معلّق: ${i?.reason}`)
};

export const sourcing_line_offers = /** @type {(inputs: Sourcing_Line_OffersInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`${i?.count} عرض`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`عرض واحد`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`عرضان`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`${i?.count} عروض`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`${i?.count} عرضًا`);
	return /** @type {LocalizedString} */ (`${i?.count} عرض`)
};

export const sourcing_lines = /** @type {(inputs: Sourcing_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`البنود`)
};

export const sourcing_new_supplier_tag = /** @type {(inputs: Sourcing_New_Supplier_TagInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جديد · قدّم عرضًا ولم يُطلب منه بعد`)
};

export const sourcing_next_at = /** @type {(inputs: Sourcing_Next_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`التالي · ${i?.at}`)
};

export const sourcing_no_customer_files = /** @type {(inputs: Sourcing_No_Customer_FilesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بلا ملفات العميل`)
};

export const sourcing_no_lines = /** @type {(inputs: Sourcing_No_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد بنود في هذا الملف بعد.`)
};

export const sourcing_no_one_chased = /** @type {(inputs: Sourcing_No_One_ChasedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا تجري متابعة أي مورّد الآن.`)
};

export const sourcing_not_needed = /** @type {(inputs: Sourcing_Not_NeededInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`غير مطلوب`)
};

export const sourcing_our_reference = /** @type {(inputs: Sourcing_Our_ReferenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مرجعنا فقط`)
};

export const sourcing_outcome_declined = /** @type {(inputs: Sourcing_Outcome_DeclinedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اعتذر`)
};

export const sourcing_outcome_escalated = /** @type {(inputs: Sourcing_Outcome_EscalatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صُعِّد`)
};

export const sourcing_outcome_new_supplier = /** @type {(inputs: Sourcing_Outcome_New_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حُفظ مورّد جديد`)
};

export const sourcing_outcome_reminder = /** @type {(inputs: Sourcing_Outcome_ReminderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أُرسل تذكير`)
};

export const sourcing_outcome_replied = /** @type {(inputs: Sourcing_Outcome_RepliedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ردّ`)
};

export const sourcing_price = /** @type {(inputs: Sourcing_PriceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.price} ${i?.currency} / ${i?.per}`)
};

export const sourcing_price_hidden = /** @type {(inputs: Sourcing_Price_HiddenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السعر مخفي لدورك`)
};

export const sourcing_quoted_line = /** @type {(inputs: Sourcing_Quoted_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.description}: ${i?.price} · عُرض في ${i?.quoted} · صالح حتى ${i?.valid}`)
};

export const sourcing_reminder_rule = /** @type {(inputs: Sourcing_Reminder_RuleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`التذكير الأول بعد 24 ساعة، والثاني بعد 48 ساعة، ثم يُنبَّه صاحب الملف (${i?.owner}). تتوقف التذكيرات فور ردّ المورّد أو اعتذاره.`)
};

export const sourcing_remove = /** @type {(inputs: Sourcing_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إزالة`)
};

export const sourcing_removed = /** @type {(inputs: Sourcing_RemovedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُزيل ${i?.reference} من المسودات`)
};

export const sourcing_saved_on_reply = /** @type {(inputs: Sourcing_Saved_On_ReplyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حُفظ لحظة ردّه، حتى دون طلب.`)
};

export const sourcing_send_heading = /** @type {(inputs: Sourcing_Send_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إرسال طلبات عروض الأسعار هذه إلى الموردين؟`)
};

export const sourcing_send_label = /** @type {(inputs: Sourcing_Send_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إرسال الطلبات`)
};

export const sourcing_send_n = /** @type {(inputs: Sourcing_Send_NInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`إرسال ${i?.count} طلب`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`إرسال طلب واحد`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`إرسال طلبين`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`إرسال ${i?.count} طلبات`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`إرسال ${i?.count} طلبًا`);
	return /** @type {LocalizedString} */ (`إرسال ${i?.count} طلب`)
};

export const sourcing_send_text = /** @type {(inputs: Sourcing_Send_TextInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`${i?.count} طلب إلى ${i?.suppliers}، والرد قبل ${i?.due}.

حُذف اسم العميل والسفينة وملفاته. تُرسل التذكيرات بعد 24 ساعة و48 ساعة، وتتوقف فور ردّ المورّد، ويُنبَّه صاحب الملف بعد التذكير الثاني.`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`طلب واحد إلى ${i?.suppliers}، والرد قبل ${i?.due}.

حُذف اسم العميل والسفينة وملفاته. تُرسل التذكيرات بعد 24 ساعة و48 ساعة، وتتوقف فور ردّ المورّد، ويُنبَّه صاحب الملف بعد التذكير الثاني.`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`طلبان إلى ${i?.suppliers}، والرد قبل ${i?.due}.

حُذف اسم العميل والسفينة وملفاته. تُرسل التذكيرات بعد 24 ساعة و48 ساعة، وتتوقف فور ردّ المورّد، ويُنبَّه صاحب الملف بعد التذكير الثاني.`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`${i?.count} طلبات إلى ${i?.suppliers}، والرد قبل ${i?.due}.

حُذف اسم العميل والسفينة وملفاته. تُرسل التذكيرات بعد 24 ساعة و48 ساعة، وتتوقف فور ردّ المورّد، ويُنبَّه صاحب الملف بعد التذكير الثاني.`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`${i?.count} طلبًا إلى ${i?.suppliers}، والرد قبل ${i?.due}.

حُذف اسم العميل والسفينة وملفاته. تُرسل التذكيرات بعد 24 ساعة و48 ساعة، وتتوقف فور ردّ المورّد، ويُنبَّه صاحب الملف بعد التذكير الثاني.`);
	return /** @type {LocalizedString} */ (`${i?.count} طلب إلى ${i?.suppliers}، والرد قبل ${i?.due}.

حُذف اسم العميل والسفينة وملفاته. تُرسل التذكيرات بعد 24 ساعة و48 ساعة، وتتوقف فور ردّ المورّد، ويُنبَّه صاحب الملف بعد التذكير الثاني.`)
};

export const sourcing_sent = /** @type {(inputs: Sourcing_SentInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("ar", i?.n, {}, true);
	if (nPlural === "zero") return /** @type {LocalizedString} */ (`أُرسل ${i?.count} طلب إلى الموردين، وستُطابَق الردود تلقائيًا`);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`أُرسل طلب واحد إلى الموردين، وستُطابَق الردود تلقائيًا`);
	if (nPlural === "two") return /** @type {LocalizedString} */ (`أُرسل طلبان إلى الموردين، وستُطابَق الردود تلقائيًا`);
	if (nPlural === "few") return /** @type {LocalizedString} */ (`أُرسلت ${i?.count} طلبات إلى الموردين، وستُطابَق الردود تلقائيًا`);
	if (nPlural === "many") return /** @type {LocalizedString} */ (`أُرسل ${i?.count} طلبًا إلى الموردين، وستُطابَق الردود تلقائيًا`);
	return /** @type {LocalizedString} */ (`أُرسل ${i?.count} طلب إلى الموردين، وستُطابَق الردود تلقائيًا`)
};

export const sourcing_skipped = /** @type {(inputs: Sourcing_SkippedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم تخطيها (طُلبت سابقًا): ${i?.list}`)
};

export const sourcing_split = /** @type {(inputs: Sourcing_SplitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مقسّمة حسب الفئة`)
};

export const sourcing_split_note = /** @type {(inputs: Sourcing_Split_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تذهب كل فئة إلى الموردين المتخصصين فيها (الأكثر التزامًا بالمواعيد أولًا)، والمورّد المطلوب منه عدة فئات يتلقى طلب عرض أسعار واحدًا.`)
};

export const sourcing_subject = /** @type {(inputs: Sourcing_SubjectInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الموضوع: «${i?.subject}»`)
};

export const sourcing_supplier_record = /** @type {(inputs: Sourcing_Supplier_RecordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سجل المورّد`)
};

export const sourcing_system_chooses = /** @type {(inputs: Sourcing_System_ChoosesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يختار النظام الموردين ويصوغ لكل منهم طلب عرض أسعار مجهول الهوية.`)
};

export const sourcing_vessel_removed = /** @type {(inputs: Sourcing_Vessel_RemovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حُذفت السفينة`)
};

export const tour_close_1_body = /** @type {(inputs: Tour_Close_1_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الربح الموعود عند التسعير مقابل النتيجة الفعلية: كلّف اللنش أكثر من التقدير بعد فوترته.`)
};

export const tour_close_1_target = /** @type {(inputs: Tour_Close_1_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التكلفة المتوقعة مقابل الفعلية`)
};

export const tour_close_1_title = /** @type {(inputs: Tour_Close_1_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التقديرات تصبح فعلية`)
};

export const tour_close_2_body = /** @type {(inputs: Tour_Close_2_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`وصل USD 10,000 بسعر 48.80 مقابل 48.60 المسعّر — ربح EGP 2,000، على الملف الذي حدث فيه.`)
};

export const tour_close_2_target = /** @type {(inputs: Tour_Close_2_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فروق أسعار الصرف`)
};

export const tour_close_2_title = /** @type {(inputs: Tour_Close_2_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فروق الصرف أموال حقيقية`)
};

export const tour_close_3_body = /** @type {(inputs: Tour_Close_3_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`انشرخت خوذتان أثناء النقل؛ ويسوّي إشعار الدائن من المورّد المطالبة.`)
};

export const tour_close_3_target = /** @type {(inputs: Tour_Close_3_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المطالبات`)
};

export const tour_close_3_title = /** @type {(inputs: Tour_Close_3_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تُسوّى المطالبات مقابل إشعارات الدائن`)
};

export const tour_close_4_body = /** @type {(inputs: Tour_Close_4_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فواتير مطابقة، وتسليمات موقّعة، وفواتير قبلتها مصلحة الضرائب ودُفعت، ومطالبات مسوّاة — ثم يمكن إغلاق الملف.`)
};

export const tour_close_4_target = /** @type {(inputs: Tour_Close_4_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قائمة فحوص الإغلاق`)
};

export const tour_close_4_title = /** @type {(inputs: Tour_Close_4_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا إغلاق إلا بالأخضر`)
};

export const tour_close_summary = /** @type {(inputs: Tour_Close_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تتحول التقديرات إلى أرقام فعلية، وتُحتسب فروق الصرف والمطالبات، ولا يُغلق الملف إلا بالفحوص الخضراء.`)
};

export const tour_close_title = /** @type {(inputs: Tour_Close_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسوية الملف وإغلاقه`)
};

export const tour_control_room_1_body = /** @type {(inputs: Tour_Control_Room_1_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يُكتب الساعة 07:00 من السجلات الحية، مع روابط إلى مصادره.`)
};

export const tour_control_room_1_target = /** @type {(inputs: Tour_Control_Room_1_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الموجز اليومي من الذكاء الاصطناعي`)
};

export const tour_control_room_1_title = /** @type {(inputs: Tour_Control_Room_1_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملخص قبل القهوة`)
};

export const tour_control_room_2_body = /** @type {(inputs: Tour_Control_Room_2_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يُجاب عن الأسئلة من البيانات الحية، وتستشهد كل إجابة بالسجلات التي استخدمتها.`)
};

export const tour_control_room_2_click = /** @type {(inputs: Tour_Control_Room_2_ClickInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`من يدين لنا بالمال؟`)
};

export const tour_control_room_2_target = /** @type {(inputs: Tour_Control_Room_2_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اسأل Golden Sea`)
};

export const tour_control_room_2_title = /** @type {(inputs: Tour_Control_Room_2_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اسأل أي شيء`)
};

export const tour_control_room_3_body = /** @type {(inputs: Tour_Control_Room_3_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الهامش حسب القسم مقابل الحد الأدنى 15%، إضافة إلى المسار والسرعة والنقد وأداء الموردين.`)
};

export const tour_control_room_3_target = /** @type {(inputs: Tour_Control_Room_3_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هامش الربح حسب الفئة`)
};

export const tour_control_room_3_title = /** @type {(inputs: Tour_Control_Room_3_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السياسة في الأرقام`)
};

export const tour_control_room_4_body = /** @type {(inputs: Tour_Control_Room_4_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسجّلًا الدخول باسم سعاد عامر، يرفض المساعد نفسه الأسئلة عن التكاليف والهوامش.`)
};

export const tour_control_room_4_target = /** @type {(inputs: Tour_Control_Room_4_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اسأل Golden Sea`)
};

export const tour_control_room_4_title = /** @type {(inputs: Tour_Control_Room_4_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المبيعات لا ترى الهوامش أبدًا`)
};

export const tour_control_room_summary = /** @type {(inputs: Tour_Control_Room_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`غرفة تحكم الرئيس التنفيذي و«اسأل Golden Sea» — وما لا يُقال للمبيعات أبدًا.`)
};

export const tour_control_room_title = /** @type {(inputs: Tour_Control_Room_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العمل مباشرةً — ملخص الساعة 07:00`)
};

export const tour_delivery_to_cash_1_body = /** @type {(inputs: Tour_Delivery_To_Cash_1_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الميناء وموعد الوصول والوكيل والشاحنة وطاقم الصعود واللنش في خطة واحدة. عندما يغيّر الوكيل موعد الوصول، يُعاد تخطيط الدفعة 2 ويُنبَّه المالك.`)
};

export const tour_delivery_to_cash_1_target = /** @type {(inputs: Tour_Delivery_To_Cash_1_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خطة التسليم للسفينة`)
};

export const tour_delivery_to_cash_1_title = /** @type {(inputs: Tour_Delivery_To_Cash_1_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السفينة تتحرك، والخطة تتبعها`)
};

export const tour_delivery_to_cash_2_body = /** @type {(inputs: Tour_Delivery_To_Cash_2_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`دفعتان لطلب واحد. لا تُحتسب الدفعة مسلّمة إلا بإذن التسليم الموقّع من السفينة.`)
};

export const tour_delivery_to_cash_2_target = /** @type {(inputs: Tour_Delivery_To_Cash_2_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الشحنات وإثبات التسليم`)
};

export const tour_delivery_to_cash_2_title = /** @type {(inputs: Tour_Delivery_To_Cash_2_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا إثبات، لا «تم التسليم»`)
};

export const tour_delivery_to_cash_3_body = /** @type {(inputs: Tour_Delivery_To_Cash_3_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يُفوتر إلا ما سُلّم، وتذهب كل فاتورة إلى مصلحة الضرائب المصرية، ويحصل الرفض أو الانقطاع على إعادة محاولة آمنة.`)
};

export const tour_delivery_to_cash_3_target = /** @type {(inputs: Tour_Delivery_To_Cash_3_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فواتير العملاء والمدفوعات`)
};

export const tour_delivery_to_cash_3_title = /** @type {(inputs: Tour_Delivery_To_Cash_3_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فوتر ما سُلّم، ثم الفاتورة الإلكترونية`)
};

export const tour_delivery_to_cash_4_body = /** @type {(inputs: Tour_Delivery_To_Cash_4_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المستحقات والمدفوعات جنبًا إلى جنب. تنتظر مدفوعات الموردين المدير المالي أو الرئيس التنفيذي.`)
};

export const tour_delivery_to_cash_4_target = /** @type {(inputs: Tour_Delivery_To_Cash_4_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مدفوعات تحتاج إلى موافقة`)
};

export const tour_delivery_to_cash_4_title = /** @type {(inputs: Tour_Delivery_To_Cash_4_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`شخص يعتمد، والمالية تدفع`)
};

export const tour_delivery_to_cash_5_body = /** @type {(inputs: Tour_Delivery_To_Cash_5_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الحساب البنكي الجديد للمورّد يحتاج معاودة اتصال بالرقم المسجّل ومعتمدَين — المالية والرئيس التنفيذي.`)
};

export const tour_delivery_to_cash_5_target = /** @type {(inputs: Tour_Delivery_To_Cash_5_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التغيير المطلوب`)
};

export const tour_delivery_to_cash_5_title = /** @type {(inputs: Tour_Delivery_To_Cash_5_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`شخصان مختلفان، دائمًا`)
};

export const tour_delivery_to_cash_summary = /** @type {(inputs: Tour_Delivery_To_Cash_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تغيّر موعد الوصول يعيد تخطيط التسليم، وإثبات التسليم يفتح الفاتورة، والمالية تحصّل وتدفع.`)
};

export const tour_delivery_to_cash_title = /** @type {(inputs: Tour_Delivery_To_Cash_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`من الرصيف إلى البنك`)
};

export const tour_exceptions_1_body = /** @type {(inputs: Tour_Exceptions_1_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`رمز Outlook منتهٍ وخدمة توقيع فواتير إلكترونية متعذرة تنتظران في قائمة لها مالك — لا في سجل لا يقرؤه أحد.`)
};

export const tour_exceptions_1_target = /** @type {(inputs: Tour_Exceptions_1_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قائمة الاستثناءات`)
};

export const tour_exceptions_1_title = /** @type {(inputs: Tour_Exceptions_1_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإخفاقات ظاهرة`)
};

export const tour_exceptions_2_body = /** @type {(inputs: Tour_Exceptions_2_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نتائج الذكاء الاصطناعي غير المؤكدة لا تُطبَّق تلقائيًا أبدًا؛ يراجعها أحد هنا.`)
};

export const tour_exceptions_2_target = /** @type {(inputs: Tour_Exceptions_2_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قائمة مراجعة الذكاء الاصطناعي`)
};

export const tour_exceptions_2_title = /** @type {(inputs: Tour_Exceptions_2_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الثقة المنخفضة تنتظر شخصًا`)
};

export const tour_exceptions_3_body = /** @type {(inputs: Tour_Exceptions_3_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المُشغِّل والمالك وموعد الاستحقاق والموافقة وسلوك إعادة المحاولة وشرط التوقف لكل قاعدة — تفعّلها الإدارة وتوقفها، ويُسجَّل ذلك.`)
};

export const tour_exceptions_3_target = /** @type {(inputs: Tour_Exceptions_3_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سجل القواعد`)
};

export const tour_exceptions_3_title = /** @type {(inputs: Tour_Exceptions_3_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل أتمتة صريحة`)
};

export const tour_exceptions_4_body = /** @type {(inputs: Tour_Exceptions_4_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خارج ساعات العمل من الأحد إلى الخميس، تذهب طلبات العروض العاجلة إلى المناوب، مع احتياطي إذا لم يرد أحد.`)
};

export const tour_exceptions_4_target = /** @type {(inputs: Tour_Exceptions_4_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التوجيه بعد ساعات العمل`)
};

export const tour_exceptions_4_title = /** @type {(inputs: Tour_Exceptions_4_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلبات العروض العاجلة بعد الدوام`)
};

export const tour_exceptions_summary = /** @type {(inputs: Tour_Exceptions_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صندوق بريد معطّل ونتيجة ذكاء اصطناعي منخفضة الثقة، يُعالجان بأمان؛ وتصل طلبات العروض العاجلة إلى المناوب.`)
};

export const tour_exceptions_title = /** @type {(inputs: Tour_Exceptions_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا شيء يفشل بصمت`)
};

export const tour_growth_1_body = /** @type {(inputs: Tour_Growth_1_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مديرو السفن من أول تعارف حتى الحساب النشط؛ ويُعلَّم العملاء المحتملون المتعثرون.`)
};

export const tour_growth_1_target = /** @type {(inputs: Tour_Growth_1_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسار النمو`)
};

export const tour_growth_1_title = /** @type {(inputs: Tour_Growth_1_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسار يتجاوز طلبات العروض`)
};

export const tour_growth_2_body = /** @type {(inputs: Tour_Growth_2_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لكل خطوة تالية نص قصير. وتسجيل النتيجة يخطط للخطوة التالية.`)
};

export const tour_growth_2_target = /** @type {(inputs: Tour_Growth_2_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خطوات المبيعات التالية`)
};

export const tour_growth_2_title = /** @type {(inputs: Tour_Growth_2_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اعرف ماذا تقول`)
};

export const tour_growth_3_body = /** @type {(inputs: Tour_Growth_3_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المستندات ومواعيد اللجان للانضمام إلى قائمة الموردين المعتمدين لدى كل مدير سفن.`)
};

export const tour_growth_3_target = /** @type {(inputs: Tour_Growth_3_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسجيلات الموردين`)
};

export const tour_growth_3_title = /** @type {(inputs: Tour_Growth_3_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسجيلات متابَعة`)
};

export const tour_growth_summary = /** @type {(inputs: Tour_Growth_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العملاء المحتملون والأساطيل وتسجيلات الموردين — مع ما يُقال في المكالمة التالية.`)
};

export const tour_growth_title = /** @type {(inputs: Tour_Growth_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تنمية قاعدة العملاء`)
};

export const tour_handover_1_body = /** @type {(inputs: Tour_Handover_1_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`من أول بريد حتى آخر دفعة، كل شيء يحدث على ملف واحد. GS-RFQ-0142 في مرحلة مقارنة العروض.`)
};

export const tour_handover_1_target = /** @type {(inputs: Tour_Handover_1_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`دورة الملف`)
};

export const tour_handover_1_title = /** @type {(inputs: Tour_Handover_1_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملف واحد، ست عشرة خطوة`)
};

export const tour_handover_2_body = /** @type {(inputs: Tour_Handover_2_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ثلاثة من ستة بنود جاهزة وواحد متوقف بسبب توضيح — لا يبدو الملف مكتملًا إلا باكتمال كل بند.`)
};

export const tour_handover_2_target = /** @type {(inputs: Tour_Handover_2_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تقدّم البنود`)
};

export const tour_handover_2_title = /** @type {(inputs: Tour_Handover_2_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا اكتمال قبل الأوان أبدًا`)
};

export const tour_handover_3_body = /** @type {(inputs: Tour_Handover_3_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إعادة الإسناد تطلب من الذكاء الاصطناعي مذكرة تسليم — الأسئلة المفتوحة، والمهام، وقاعدة التواصل مع العميل. يعدّلها شخص ويؤكدها.`)
};

export const tour_handover_3_target = /** @type {(inputs: Tour_Handover_3_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المسؤول والبديل`)
};

export const tour_handover_3_title = /** @type {(inputs: Tour_Handover_3_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الذكاء الاصطناعي يصوغ مذكرة التسليم`)
};

export const tour_handover_4_body = /** @type {(inputs: Tour_Handover_4_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الخطوات التلقائية تذكر القاعدة التي عملت؛ والخطوات البشرية تذكر الشخص. هذا هو سجل التدقيق.`)
};

export const tour_handover_4_target = /** @type {(inputs: Tour_Handover_4_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سجل النشاط`)
};

export const tour_handover_4_title = /** @type {(inputs: Tour_Handover_4_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل خطوة مسجّلة`)
};

export const tour_handover_summary = /** @type {(inputs: Tour_Handover_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملف واحد من أول بريد حتى آخر دفعة، ومذكرة تسليم يصوغها الذكاء الاصطناعي ليؤكدها شخص.`)
};

export const tour_handover_title = /** @type {(inputs: Tour_Handover_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسليم دون فقدان شيء`)
};

export const tour_morning_1_body = /** @type {(inputs: Tour_Morning_1_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هذا كريم يوسف، سلسلة التوريد. لوحة تحكم Golden Sea مبنية للشخص المسجّل دخوله: ما ينتظره، وقائمته، ومتابعاته.`)
};

export const tour_morning_1_title = /** @type {(inputs: Tour_Morning_1_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لكل دور يومه الخاص`)
};

export const tour_morning_2_body = /** @type {(inputs: Tour_Morning_2_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لكل ملف حي مالك وموعد نهائي وإجراء تالٍ. تأتي الملفات المتوقفة والمعرضة للخطر أولًا، ثم الأقرب موعدًا.`)
};

export const tour_morning_2_target = /** @type {(inputs: Tour_Morning_2_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قائمتي`)
};

export const tour_morning_2_title = /** @type {(inputs: Tour_Morning_2_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قائمة مرتبة حسب المخاطر`)
};

export const tour_morning_3_body = /** @type {(inputs: Tour_Morning_3_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ما تغيّر خلال الليل وما يحتاجه اليوم: المواعيد النهائية، وعدم تطابق أمر شراء، ومورّد لم يرد، وتكاملات فاشلة.`)
};

export const tour_morning_3_target = /** @type {(inputs: Tour_Morning_3_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الموجز اليومي`)
};

export const tour_morning_3_title = /** @type {(inputs: Tour_Morning_3_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملخص الساعة 07:00`)
};

export const tour_morning_4_body = /** @type {(inputs: Tour_Morning_4_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسجّل سعاد عامر الدخول. قائمتها بلا قيم أو تكاليف أو هوامش: لا ترى المبيعات أبدًا ما تدفعه Golden Sea لمورّديها.`)
};

export const tour_morning_4_target = /** @type {(inputs: Tour_Morning_4_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قائمتي`)
};

export const tour_morning_4_title = /** @type {(inputs: Tour_Morning_4_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المبيعات ترى الملفات نفسها — دون التكاليف`)
};

export const tour_morning_5_body = /** @type {(inputs: Tour_Morning_5_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يرى كريم بلباع ما ينتظره أولًا — استثناء هامش من سعاد، ودفعة مقدمة لمورّد، وسعر صرف، وتغيير بنك حصل بالفعل على إحدى موافقتيه.`)
};

export const tour_morning_5_target = /** @type {(inputs: Tour_Morning_5_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظار قرارك`)
};

export const tour_morning_5_title = /** @type {(inputs: Tour_Morning_5_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الرئيس التنفيذي يبدأ بالقرارات`)
};

export const tour_morning_6_body = /** @type {(inputs: Tour_Morning_6_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يرى محمد حلمي المدفوعات والدفعات المقدمة فقط. وقد وافق على تغيير البنك بعد معاودة الاتصال؛ وهو الآن ينتظر الرئيس التنفيذي — شخصان، دائمًا.`)
};

export const tour_morning_6_target = /** @type {(inputs: Tour_Morning_6_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظار قرارك`)
};

export const tour_morning_6_title = /** @type {(inputs: Tour_Morning_6_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المالية تعتمد المدفوعات`)
};

export const tour_morning_7_body = /** @type {(inputs: Tour_Morning_7_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإشعارات والإشارات المرجعية والعدادات في هذه اللوحة تخص الشخص المسجّل دخوله. عدنا إلى كريم يوسف — وإشعاراته عن ملفاته.`)
};

export const tour_morning_7_target = /** @type {(inputs: Tour_Morning_7_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإشعارات`)
};

export const tour_morning_7_title = /** @type {(inputs: Tour_Morning_7_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إشعارات خاصة بكل شخص`)
};

export const tour_morning_summary = /** @type {(inputs: Tour_Morning_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المشتري والمبيعات والرئيس التنفيذي والمالية يبدؤون يومهم — كلٌّ يرى فقط ما يحتاجه.`)
};

export const tour_morning_title = /** @type {(inputs: Tour_Morning_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صباح واحد، أربعة أشخاص`)
};

export const tour_po_check_1_body = /** @type {(inputs: Tour_Po_Check_1_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يُطابق أمر شراء Nordvik مع إصدار عرض السعر المعتمد. حجم عبوة قديم، وسعر v1 منتهٍ، و15 خوذة بدلًا من 10 توقف الالتزام حتى يوافق العميل كتابيًا.`)
};

export const tour_po_check_1_target = /** @type {(inputs: Tour_Po_Check_1_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مراجعة أمر شراء العميل`)
};

export const tour_po_check_1_title = /** @type {(inputs: Tour_Po_Check_1_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يُفحص أمر الشراء بندًا بندًا`)
};

export const tour_po_check_2_body = /** @type {(inputs: Tour_Po_Check_2_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`البنود التي لم يطلبها العميل تبقى مفتوحة للمراجعة أو تُغلق بسبب مسجّل.`)
};

export const tour_po_check_2_target = /** @type {(inputs: Tour_Po_Check_2_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الترسية الجزئية`)
};

export const tour_po_check_2_title = /** @type {(inputs: Tour_Po_Check_2_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ترسية جزئية، لا تمر بصمت أبدًا`)
};

export const tour_po_check_3_body = /** @type {(inputs: Tour_Po_Check_3_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بعد الاتفاق على أمر الشراء، تُعدّ أوامر شراء الموردين — بالشحن المباشر أو عبر المستودع — ويُراجع كلٌّ منها أولًا مقابل أحدث عرض.`)
};

export const tour_po_check_3_target = /** @type {(inputs: Tour_Po_Check_3_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أوامر الشراء للموردين`)
};

export const tour_po_check_3_title = /** @type {(inputs: Tour_Po_Check_3_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أوامر شراء لكل مورّد`)
};

export const tour_po_check_4_body = /** @type {(inputs: Tour_Po_Check_4_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تُطابق كل فاتورة مورّد مع أمر شرائها والبضاعة المستلمة؛ وتُرفض الفاتورة المكررة.`)
};

export const tour_po_check_4_target = /** @type {(inputs: Tour_Po_Check_4_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فواتير الموردين`)
};

export const tour_po_check_4_title = /** @type {(inputs: Tour_Po_Check_4_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مطابقة ثلاثية`)
};

export const tour_po_check_5_body = /** @type {(inputs: Tour_Po_Check_5_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسجّلًا الدخول كالرئيس التنفيذي: يظهر تغيّر سعر معلَّم في أمر شراء مورّد قبل أن يلتزم، وتنتظر الدفعات المقدمة موافقة دفع.`)
};

export const tour_po_check_5_target = /** @type {(inputs: Tour_Po_Check_5_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أوامر الشراء للموردين`)
};

export const tour_po_check_5_title = /** @type {(inputs: Tour_Po_Check_5_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كريم بلباع يؤكد`)
};

export const tour_po_check_summary = /** @type {(inputs: Tour_Po_Check_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أمر شراء عميل بسعر قديم وكمية خاطئة يُكتشف قبل طلب أي شيء.`)
};

export const tour_po_check_title = /** @type {(inputs: Tour_Po_Check_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أمر الشراء لا يطابق العرض`)
};

export const tour_quote_1_body = /** @type {(inputs: Tour_Quote_1_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يُوحَّد كل عرض إلى جنيه لكل وحدة أساسية. بدّل إلى التكلفة الواصلة فيعيد الشحن إلى بورسعيد ترتيبها.`)
};

export const tour_quote_1_click = /** @type {(inputs: Tour_Quote_1_ClickInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التكلفة حتى التسليم`)
};

export const tour_quote_1_target = /** @type {(inputs: Tour_Quote_1_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كيف تُقارَن العروض`)
};

export const tour_quote_1_title = /** @type {(inputs: Tour_Quote_1_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأرخص ليس دائمًا الأرخص على متن السفينة`)
};

export const tour_quote_2_body = /** @type {(inputs: Tour_Quote_2_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عُرض 242 لبند يتطلب القطعة 243 نفسها، فأُوقف البند عن التسعير. يُحفظ v1 للسجل؛ ويُستخدم v2 المصحَّح.`)
};

export const tour_quote_2_target = /** @type {(inputs: Tour_Quote_2_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مثبّت براغي LOCTITE 243`)
};

export const tour_quote_2_title = /** @type {(inputs: Tour_Quote_2_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تُكتشف القطعة الخاطئة`)
};

export const tour_quote_3_body = /** @type {(inputs: Tour_Quote_3_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مخزون الإسكندرية الأرخص للوحدة لكنه الأغلى عند التسليم. يقسّم الاقتراح 10 + 5 على موردَين، وكلاهما قبل موعد وصول السفينة.`)
};

export const tour_quote_3_target = /** @type {(inputs: Tour_Quote_3_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خوذة سلامة EN 397`)
};

export const tour_quote_3_title = /** @type {(inputs: Tour_Quote_3_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المخزون الخاص والتوريد المجزّأ`)
};

export const tour_quote_4_body = /** @type {(inputs: Tour_Quote_4_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تُوزَّع الرسوم المشتركة على البنود؛ وتُفحص السياسة على الهامش، ويعرض كل بند التكلفة والرسوم والربح.`)
};

export const tour_quote_4_target = /** @type {(inputs: Tour_Quote_4_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هامش الربح = الربح ÷ سعر البيع`)
};

export const tour_quote_4_title = /** @type {(inputs: Tour_Quote_4_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الهامش لا نسبة الإضافة`)
};

export const tour_quote_5_body = /** @type {(inputs: Tour_Quote_5_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يذهب عرض السعر واستثناءاته إلى كريم بلباع بنقرة واحدة. الذكاء الاصطناعي لا يسعّر وحده أبدًا.`)
};

export const tour_quote_5_target = /** @type {(inputs: Tour_Quote_5_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الموافقة`)
};

export const tour_quote_5_title = /** @type {(inputs: Tour_Quote_5_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`شخص يعتمد`)
};

export const tour_quote_6_body = /** @type {(inputs: Tour_Quote_6_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يرى كريم بلباع ما يقرره ولماذا — الهامش، وسعر الصرف، والدفعة المقدمة، وتغيير البنك الذي وافق عليه محمد حلمي بالفعل.`)
};

export const tour_quote_6_target = /** @type {(inputs: Tour_Quote_6_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بانتظارك`)
};

export const tour_quote_6_title = /** @type {(inputs: Tour_Quote_6_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإثبات أولًا`)
};

export const tour_quote_7_body = /** @type {(inputs: Tour_Quote_7_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عرض السعر نفسه بتنسيق Golden Sea الخاص، بالإنجليزية أو العربية، بالجنيه أو الدولار. لا يذهب شيء إلى العميل حتى يؤكد شخص البريد.`)
};

export const tour_quote_7_click = /** @type {(inputs: Tour_Quote_7_ClickInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العربية`)
};

export const tour_quote_7_target = /** @type {(inputs: Tour_Quote_7_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حالة القرار`)
};

export const tour_quote_7_title = /** @type {(inputs: Tour_Quote_7_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تنسيقهم، ولغتهم`)
};

export const tour_quote_summary = /** @type {(inputs: Tour_Quote_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المشتري يقارن ويسعّر، والرئيس التنفيذي يعتمد، والعميل يتلقى تنسيق Golden Sea الخاص.`)
};

export const tour_quote_title = /** @type {(inputs: Tour_Quote_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`من العروض إلى عرض سعر معتمد`)
};

export const tour_replies_1_body = /** @type {(inputs: Tour_Replies_1_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تُقسّم البنود حسب الفئة ولا يرى كل مورّد إلا بنوده — دون العميل أو السفينة أبدًا.`)
};

export const tour_replies_1_target = /** @type {(inputs: Tour_Replies_1_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يرى كل مورّد البنود التي يمكنه تسعيرها فقط`)
};

export const tour_replies_1_title = /** @type {(inputs: Tour_Replies_1_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يبقى العميل مخفيًا`)
};

export const tour_replies_2_body = /** @type {(inputs: Tour_Replies_2_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تصل الردود بمواضيع متغيرة؛ ويُطابق كلٌّ منها مع طلب عرضه بمرجعه، وتتوقف التذكيرات لذلك المورّد.`)
};

export const tour_replies_2_click = /** @type {(inputs: Tour_Replies_2_ClickInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`محاكاة الردود`)
};

export const tour_replies_2_target = /** @type {(inputs: Tour_Replies_2_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الردود الواردة`)
};

export const tour_replies_2_title = /** @type {(inputs: Tour_Replies_2_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مطابقة بالمرجع`)
};

export const tour_replies_3_body = /** @type {(inputs: Tour_Replies_3_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ردّ مورّد لم تشترِ منه Golden Sea قط. يُنشأ تلقائيًا، مع سعره وتاريخه وصلاحيته.`)
};

export const tour_replies_3_target = /** @type {(inputs: Tour_Replies_3_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قدّم عرضًا ولم يُطلب منه بعد`)
};

export const tour_replies_3_title = /** @type {(inputs: Tour_Replies_3_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`محفوظ دون طلب`)
};

export const tour_replies_4_body = /** @type {(inputs: Tour_Replies_4_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`وحدة السعر غير الواضحة لا تُستخدم حتى يؤكدها أحد.`)
};

export const tour_replies_4_target = /** @type {(inputs: Tour_Replies_4_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تحتاج إلى شخص`)
};

export const tour_replies_4_title = /** @type {(inputs: Tour_Replies_4_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`شخص يؤكد غير المؤكد`)
};

export const tour_replies_5_body = /** @type {(inputs: Tour_Replies_5_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المحرك نفسه يقرأ صناديق البريد القديمة إلى عملاء وسفن وموردين وأسعار مؤرخة. لا يُحفظ شيء حتى يوافق كريم بلباع.`)
};

export const tour_replies_5_target = /** @type {(inputs: Tour_Replies_5_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التنظيم والاعتماد`)
};

export const tour_replies_5_title = /** @type {(inputs: Tour_Replies_5_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سنوات من البريد، منظمة`)
};

export const tour_replies_summary = /** @type {(inputs: Tour_Replies_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تُرسل طلبات عروض الموردين دون اسم العميل؛ وتُطابق الردود حتى بمواضيع جديدة.`)
};

export const tour_replies_title = /** @type {(inputs: Tour_Replies_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل رد مطابق، وكل سعر محفوظ`)
};

export const tour_rfq_to_case_1_body = /** @type {(inputs: Tour_Rfq_To_Case_1_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Outlook وGmail ونموذج طلب العرض السريع على الموقع وواتساب كلها تصل إلى قائمة واحدة — لا شيء يبقى في بريد شخصي.`)
};

export const tour_rfq_to_case_1_target = /** @type {(inputs: Tour_Rfq_To_Case_1_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`القنوات المتصلة`)
};

export const tour_rfq_to_case_1_title = /** @type {(inputs: Tour_Rfq_To_Case_1_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صندوق وارد واحد لكل القنوات`)
};

export const tour_rfq_to_case_2_body = /** @type {(inputs: Tour_Rfq_To_Case_2_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يصل طلب عرض جديد للسفينة MV Aurora Crest مع قائمة Excel وملف PDF وصورة واتساب. يبقى البريد وكل ملف مع الملف.`)
};

export const tour_rfq_to_case_2_click = /** @type {(inputs: Tour_Rfq_To_Case_2_ClickInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`محاكاة رسالة جديدة`)
};

export const tour_rfq_to_case_2_target = /** @type {(inputs: Tour_Rfq_To_Case_2_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الرسالة الأصلية`)
};

export const tour_rfq_to_case_2_title = /** @type {(inputs: Tour_Rfq_To_Case_2_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يُحفظ الأصل`)
};

export const tour_rfq_to_case_3_body = /** @type {(inputs: Tour_Rfq_To_Case_3_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يحصل كل بند على رمز IMPA والكمية والوحدة والملف الذي جاء منه، مع درجة ثقة. ويُعلَّم بند الصورة بثقة 62% ليراجعه شخص.`)
};

export const tour_rfq_to_case_3_click = /** @type {(inputs: Tour_Rfq_To_Case_3_ClickInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استخراج بالذكاء الاصطناعي`)
};

export const tour_rfq_to_case_3_target = /** @type {(inputs: Tour_Rfq_To_Case_3_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بنود المسودة`)
};

export const tour_rfq_to_case_3_title = /** @type {(inputs: Tour_Rfq_To_Case_3_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الذكاء الاصطناعي يقرأ، والناس يقررون`)
};

export const tour_rfq_to_case_4_body = /** @type {(inputs: Tour_Rfq_To_Case_4_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تتحول التفاصيل الناقصة إلى مسودة توضيح للعميل — مسودة، لا تُرسل.`)
};

export const tour_rfq_to_case_4_target = /** @type {(inputs: Tour_Rfq_To_Case_4_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ناقص أو غير واضح`)
};

export const tour_rfq_to_case_4_title = /** @type {(inputs: Tour_Rfq_To_Case_4_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا شيء بالتخمين`)
};

export const tour_rfq_to_case_5_body = /** @type {(inputs: Tour_Rfq_To_Case_5_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تقترح قواعد الإسناد المالك والاحتياطي؛ ويأتي الموعد النهائي من طلب العميل.`)
};

export const tour_rfq_to_case_5_target = /** @type {(inputs: Tour_Rfq_To_Case_5_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المسؤول والبديل والموعد النهائي`)
};

export const tour_rfq_to_case_5_title = /** @type {(inputs: Tour_Rfq_To_Case_5_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المالك والاحتياطي والموعد النهائي`)
};

export const tour_rfq_to_case_6_body = /** @type {(inputs: Tour_Rfq_To_Case_6_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التأكيد ينشئ الملف ببنوده، ويربط البريد، ويرسل إشعار استلام واحدًا بهوية الشركة.`)
};

export const tour_rfq_to_case_6_target = /** @type {(inputs: Tour_Rfq_To_Case_6_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الخطوة التالية`)
};

export const tour_rfq_to_case_6_title = /** @type {(inputs: Tour_Rfq_To_Case_6_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نقرة واحدة إلى ملف`)
};

export const tour_rfq_to_case_summary = /** @type {(inputs: Tour_Rfq_To_Case_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بريد طلب عرض مع Excel وPDF وصورة يصبح ملفًا واحدًا نظيفًا — الذكاء الاصطناعي يقرأ، والشخص يقرر.`)
};

export const tour_rfq_to_case_title = /** @type {(inputs: Tour_Rfq_To_Case_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أي صيغة تدخل، ملف واحد يخرج`)
};

export const visuals_ack = /** @type {(inputs: Visuals_AckInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`زمن إشعار الاستلام`)
};

export const visuals_ack_caption = /** @type {(inputs: Visuals_Ack_CaptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الوسيط لطلبات عروض الأسعار الجديدة · الهدف 15 دقيقة`)
};

export const visuals_customer_discount = /** @type {(inputs: Visuals_Customer_DiscountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خصم العميل`)
};

export const visuals_days = /** @type {(inputs: Visuals_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} يوم`)
};

export const visuals_deadlines = /** @type {(inputs: Visuals_DeadlinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المواعيد النهائية والوصول`)
};

export const visuals_discount = /** @type {(inputs: Visuals_DiscountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الخصم`)
};

export const visuals_gp_bridge = /** @type {(inputs: Visuals_Gp_BridgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إجمالي الربح، أكتوبر: من المتوقع إلى الفعلي`)
};

export const visuals_gp_bridge_note = /** @type {(inputs: Visuals_Gp_Bridge_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أين ذهب الربح بين عروض الأسعار والفواتير`)
};

export const visuals_gross_profit = /** @type {(inputs: Visuals_Gross_ProfitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إجمالي الربح`)
};

export const visuals_margin = /** @type {(inputs: Visuals_MarginInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هامش الربح`)
};

export const visuals_margin_after = /** @type {(inputs: Visuals_Margin_AfterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هامش الربح بعد الخصم`)
};

export const visuals_margin_before = /** @type {(inputs: Visuals_Margin_BeforeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هامش الربح قبل الخصم`)
};

export const visuals_margin_caption = /** @type {(inputs: Visuals_Margin_CaptionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`السياسة: الحد الأدنى ${i?.min}%، والهدف ${i?.target}%`)
};

export const visuals_minutes = /** @type {(inputs: Visuals_MinutesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} د`)
};

export const visuals_policy_max = /** @type {(inputs: Visuals_Policy_MaxInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الحد الأقصى في السياسة ${i?.max}%`)
};

export const visuals_price_built = /** @type {(inputs: Visuals_Price_BuiltInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كيف يُبنى السعر`)
};

export const visuals_profit = /** @type {(inputs: Visuals_ProfitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الربح`)
};

export const visuals_rate = /** @type {(inputs: Visuals_RateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`سعر الصرف (EGP لكل ${i?.currency})`)
};

export const visuals_receivables = /** @type {(inputs: Visuals_ReceivablesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الذمم المدينة حسب العميل`)
};

export const visuals_selling_price = /** @type {(inputs: Visuals_Selling_PriceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سعر البيع`)
};

export const visuals_selling_price_in = /** @type {(inputs: Visuals_Selling_Price_InInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`سعر البيع (${i?.currency})`)
};

export const visuals_shared_charges = /** @type {(inputs: Visuals_Shared_ChargesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المصاريف المشتركة`)
};

export const visuals_supplier_cost = /** @type {(inputs: Visuals_Supplier_CostInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تكلفة المورّد`)
};

export const visuals_target = /** @type {(inputs: Visuals_TargetInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الهدف ${i?.target}%`)
};

export const visuals_targets_note = /** @type {(inputs: Visuals_Targets_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل شريط مقابل هدفه (العلامة)، والتظليل يعني: ضعيف، مقبول، جيد`)
};

export const visuals_this_month = /** @type {(inputs: Visuals_This_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هذا الشهر`)
};

export const visuals_turnaround = /** @type {(inputs: Visuals_TurnaroundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`زمن إعداد عرض السعر`)
};

export const visuals_turnaround_caption = /** @type {(inputs: Visuals_Turnaround_CaptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الوسيط هذا الأسبوع · الهدف يوم واحد`)
};

export const visuals_under_minimum = /** @type {(inputs: Visuals_Under_MinimumInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أقل من الحد الأدنى ${i?.min}%: يحتاج إلى اعتماد`)
};

export const visuals_what_if = /** @type {(inputs: Visuals_What_IfInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ماذا لو`)
};

export const visuals_what_if_note = /** @type {(inputs: Visuals_What_If_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جرّب هامش ربح وخصمًا وسعر صرف، ولا يُحفظ شيء`)
};

export const visuals_win_caption = /** @type {(inputs: Visuals_Win_CaptionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`من الملفات المسعَّرة التي فزنا بها، 12 أسبوعًا · الهدف ${i?.target}`)
};

export const visuals_win_rate = /** @type {(inputs: Visuals_Win_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نسبة الفوز`)
};