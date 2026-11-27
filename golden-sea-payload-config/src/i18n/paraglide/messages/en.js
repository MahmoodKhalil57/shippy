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
	return /** @type {LocalizedString} */ (`Approve`)
};

export const action_cash_approve_call_back = /** @type {(inputs: Action_Cash_Approve_Call_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approve after call-back`)
};

export const action_cash_approve_heading = /** @type {(inputs: Action_Cash_Approve_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Approve: ${i?.title}`)
};

export const action_cash_approved = /** @type {(inputs: Action_Cash_ApprovedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Approved: ${i?.title}.`)
};

export const action_cash_call_back_text = /** @type {(inputs: Action_Cash_Call_Back_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Call the supplier back on the number on file (${i?.phone}), never on a number from the request, and confirm the new account with them.`)
};

export const action_cash_called_back = /** @type {(inputs: Action_Cash_Called_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`I called back on the number on file and the supplier confirmed the new account`)
};

export const action_cash_decided = /** @type {(inputs: Action_Cash_DecidedInputs) => LocalizedString} */ (i) => {
	if (i?.decision === "approve") return /** @type {LocalizedString} */ (`Approved by ${i?.name}`);
	return /** @type {LocalizedString} */ (`Rejected by ${i?.name}`)
};

export const action_cash_note_optional = /** @type {(inputs: Action_Cash_Note_OptionalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Note (optional)`)
};

export const action_cash_reason_required = /** @type {(inputs: Action_Cash_Reason_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reason (required)`)
};

export const action_cash_reject = /** @type {(inputs: Action_Cash_RejectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reject`)
};

export const action_cash_reject_heading = /** @type {(inputs: Action_Cash_Reject_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Reject: ${i?.title}`)
};

export const action_cash_rejected = /** @type {(inputs: Action_Cash_RejectedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Rejected: ${i?.title}.`)
};

export const action_eta_alert = /** @type {(inputs: Action_Eta_AlertInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Alert to ${i?.owner} and Karim Balbaa.`)
};

export const action_eta_apply = /** @type {(inputs: Action_Eta_ApplyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Apply re-plan & alert`)
};

export const action_eta_backorder_in_time = /** @type {(inputs: Action_Eta_Backorder_In_TimeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Backorder L${i?.line} (${i?.supplier}, ${i?.date}): now in time for the drop`)
};

export const action_eta_backorder_late = /** @type {(inputs: Action_Eta_Backorder_LateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Backorder L${i?.line} (${i?.supplier}, ${i?.date}): still late. Escalate.`)
};

export const action_eta_from = /** @type {(inputs: Action_Eta_FromInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`From ${i?.from} · Subject: ${i?.subject}`)
};

export const action_eta_heading = /** @type {(inputs: Action_Eta_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Agent email: ETA update`)
};

export const action_eta_label = /** @type {(inputs: Action_Eta_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Agent email: ETA update`)
};

export const action_eta_move = /** @type {(inputs: Action_Eta_MoveInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.drop}: on board ${i?.from} → ${i?.to} · launch re-booked · truck & boarding staff re-confirmed (task for ${i?.owner})`)
};

export const action_eta_no_drop = /** @type {(inputs: Action_Eta_No_DropInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No open drop to move.`)
};

export const action_eta_read = /** @type {(inputs: Action_Eta_ReadInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`AI read · 97% · New ETA ${i?.eta} (was ${i?.was})`)
};

export const action_eta_what_moves = /** @type {(inputs: Action_Eta_What_MovesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What moves`)
};

export const action_history_organise = /** @type {(inputs: Action_History_OrganiseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Organise`)
};

export const action_history_organised = /** @type {(inputs: Action_History_OrganisedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`History organised. Uncertain items are waiting for you`)
};

export const action_inbox_ack_auto = /** @type {(inputs: Action_Inbox_Ack_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The acknowledgement is sent once, from the approved template.`)
};

export const action_inbox_ack_manual = /** @type {(inputs: Action_Inbox_Ack_ManualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The acknowledgement is yours to send by hand.`)
};

export const action_inbox_backup = /** @type {(inputs: Action_Inbox_BackupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Backup`)
};

export const action_inbox_create = /** @type {(inputs: Action_Inbox_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create case`)
};

export const action_inbox_create_heading = /** @type {(inputs: Action_Inbox_Create_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create this case?`)
};

export const action_inbox_creates = /** @type {(inputs: Action_Inbox_CreatesInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (i?.kind === "service" && i?.isNew === "yes" && countPlural === "one") return /** @type {LocalizedString} */ (`Creates a service case for ${i?.customer} (new customer record) with ${__paraglideRegistry.icuPound("en", i?.count, {})} line exactly as drafted.`);
	if (i?.kind === "service" && i?.isNew === "yes") return /** @type {LocalizedString} */ (`Creates a service case for ${i?.customer} (new customer record) with ${__paraglideRegistry.icuPound("en", i?.count, {})} lines exactly as drafted.`);
	if (i?.kind === "service" && countPlural === "one") return /** @type {LocalizedString} */ (`Creates a service case for ${i?.customer} with ${__paraglideRegistry.icuPound("en", i?.count, {})} line exactly as drafted.`);
	if (i?.kind === "service") return /** @type {LocalizedString} */ (`Creates a service case for ${i?.customer} with ${__paraglideRegistry.icuPound("en", i?.count, {})} lines exactly as drafted.`);
	if (i?.isNew === "yes" && countPlural === "one") return /** @type {LocalizedString} */ (`Creates a RFQ case for ${i?.customer} (new customer record) with ${__paraglideRegistry.icuPound("en", i?.count, {})} line exactly as drafted.`);
	if (i?.isNew === "yes") return /** @type {LocalizedString} */ (`Creates a RFQ case for ${i?.customer} (new customer record) with ${__paraglideRegistry.icuPound("en", i?.count, {})} lines exactly as drafted.`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Creates a RFQ case for ${i?.customer} with ${__paraglideRegistry.icuPound("en", i?.count, {})} line exactly as drafted.`);
	return /** @type {LocalizedString} */ (`Creates a RFQ case for ${i?.customer} with ${__paraglideRegistry.icuPound("en", i?.count, {})} lines exactly as drafted.`)
};

export const action_inbox_deadline = /** @type {(inputs: Action_Inbox_DeadlineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quote deadline`)
};

export const action_inbox_deadline_hint = /** @type {(inputs: Action_Inbox_Deadline_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A reminder is scheduled before it.`)
};

export const action_inbox_flagged = /** @type {(inputs: Action_Inbox_FlaggedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Flagged lines stay “Clarification needed” until the customer answers.`)
};

export const action_inbox_new_email = /** @type {(inputs: Action_Inbox_New_EmailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`New email: “${i?.subject}”`)
};

export const action_inbox_new_reply = /** @type {(inputs: Action_Inbox_New_ReplyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`New supplier reply: “${i?.subject}”`)
};

export const action_inbox_not_related = /** @type {(inputs: Action_Inbox_Not_RelatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Marked not related`)
};

export const action_inbox_owner = /** @type {(inputs: Action_Inbox_OwnerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Owner`)
};

export const action_inbox_simulate_email = /** @type {(inputs: Action_Inbox_Simulate_EmailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Simulate new email`)
};

export const action_inbox_simulate_forward = /** @type {(inputs: Action_Inbox_Simulate_ForwardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Simulate forwarded copy`)
};

export const action_inbox_simulate_reply = /** @type {(inputs: Action_Inbox_Simulate_ReplyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Simulate supplier reply`)
};

export const action_money = /** @type {(inputs: Action_MoneyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.currency} ${i?.amount}`)
};

export const action_order_read_po = /** @type {(inputs: Action_Order_Read_PoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Read customer PO`)
};

export const action_profit_actual_line = /** @type {(inputs: Action_Profit_Actual_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.label} (${i?.detail}): ${i?.expected} to ${i?.actual}`)
};

export const action_profit_actuals_done = /** @type {(inputs: Action_Profit_Actuals_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Actual costs confirmed. Estimates replaced on the case.`)
};

export const action_profit_actuals_heading = /** @type {(inputs: Action_Profit_Actuals_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Replace estimates with actuals`)
};

export const action_profit_actuals_intro = /** @type {(inputs: Action_Profit_Actuals_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`These billed amounts replace the estimates on the case's shared charges:`)
};

export const action_profit_bank_reference = /** @type {(inputs: Action_Profit_Bank_ReferenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bank reference`)
};

export const action_profit_claim_done = /** @type {(inputs: Action_Profit_Claim_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Credit note ${i?.creditNote} recorded. Claim ${i?.ref} settled.`)
};

export const action_profit_claim_heading = /** @type {(inputs: Action_Profit_Claim_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Settle claim ${i?.ref}`)
};

export const action_profit_claim_text = /** @type {(inputs: Action_Profit_Claim_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.title}. ${i?.note}
Credit note ${i?.creditNote} from ${i?.against} for ${i?.amount} is booked against the replacement cost.`)
};

export const action_profit_close = /** @type {(inputs: Action_Profit_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Close case`)
};

export const action_profit_close_done = /** @type {(inputs: Action_Profit_Close_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.case} closed. Supplier prices and on-time results fed back.`)
};

export const action_profit_close_heading = /** @type {(inputs: Action_Profit_Close_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Close ${i?.case}?`)
};

export const action_profit_close_open = /** @type {(inputs: Action_Profit_Close_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Turn every check green to close.`)
};

export const action_profit_close_ready = /** @type {(inputs: Action_Profit_Close_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every check is green.`)
};

export const action_profit_close_role = /** @type {(inputs: Action_Profit_Close_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Management and finance close cases.`)
};

export const action_profit_close_text = /** @type {(inputs: Action_Profit_Close_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Actual gross profit ${i?.actual} (${i?.actualMargin}) against ${i?.expected} expected (${i?.expectedMargin}).
Supplier prices, lead times and on-time results feed back to the supplier records.`)
};

export const action_profit_confirm_actuals = /** @type {(inputs: Action_Profit_Confirm_ActualsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirm actuals`)
};

export const action_profit_receipt_description = /** @type {(inputs: Action_Profit_Receipt_DescriptionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} received from ${i?.customer}. Recorded after the bank movement; the platform never starts transfers.`)
};

export const action_profit_receipt_description_rate = /** @type {(inputs: Action_Profit_Receipt_Description_RateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} received from ${i?.customer} at ${i?.rate} EGP/${i?.currency}. Recorded after the bank movement; the platform never starts transfers.`)
};

export const action_profit_receipt_done = /** @type {(inputs: Action_Profit_Receipt_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Receipt recorded and allocated to ${i?.invoice}.`)
};

export const action_profit_receipt_prompt = /** @type {(inputs: Action_Profit_Receipt_PromptInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Record receipt for ${i?.invoice}`)
};

export const action_profit_record_credit_note = /** @type {(inputs: Action_Profit_Record_Credit_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Record credit note`)
};

export const action_profit_record_receipt = /** @type {(inputs: Action_Profit_Record_ReceiptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Record receipt`)
};

export const action_rfqs_simulate = /** @type {(inputs: Action_Rfqs_SimulateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Simulate replies`)
};

export const action_rfqs_simulated = /** @type {(inputs: Action_Rfqs_SimulatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier replies are in. Offers are on the Compare tab`)
};

export const api_assistant_and_more = /** @type {(inputs: Api_Assistant_And_MoreInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.list} and ${i?.more} more`)
};

export const api_assistant_approval_item = /** @type {(inputs: Api_Assistant_Approval_ItemInputs) => LocalizedString} */ (i) => {
	if (i?.twoPerson === "yes") return /** @type {LocalizedString} */ (`${i?.title}: ${i?.type}, from ${i?.from} · approvers ${i?.approvers} (two-person rule)`);
	return /** @type {LocalizedString} */ (`${i?.title}: ${i?.type}, from ${i?.from} · approvers ${i?.approvers}`)
};

export const api_assistant_approvals_for_you = /** @type {(inputs: Api_Assistant_Approvals_For_YouInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} approval waits for you: ${i?.list}.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} approvals wait for you: ${i?.list}.`)
};

export const api_assistant_approvals_waiting = /** @type {(inputs: Api_Assistant_Approvals_WaitingInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} approval is waiting.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} approvals are waiting.`)
};

export const api_assistant_ask_a_question = /** @type {(inputs: Api_Assistant_Ask_A_QuestionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ask a question.`)
};

export const api_assistant_bills_on_hold = /** @type {(inputs: Api_Assistant_Bills_On_HoldInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} supplier bill is on hold after the three-way match: ${i?.list}.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} supplier bills are on hold after the three-way match: ${i?.list}.`)
};

export const api_assistant_briefing_subject = /** @type {(inputs: Api_Assistant_Briefing_SubjectInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Briefing from ${i?.count} live records`)
};

export const api_assistant_case_approval_pending = /** @type {(inputs: Api_Assistant_Case_Approval_PendingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Approval pending: ${i?.titles}`)
};

export const api_assistant_case_deadline = /** @type {(inputs: Api_Assistant_Case_DeadlineInputs) => LocalizedString} */ (i) => {
	if (i?.hasEta === "yes") return /** @type {LocalizedString} */ (`Quote deadline ${i?.day} ${i?.time} (${i?.when}) · ${i?.eta}`);
	return /** @type {LocalizedString} */ (`Quote deadline ${i?.day} ${i?.time} (${i?.when})`)
};

export const api_assistant_case_gp = /** @type {(inputs: Api_Assistant_Case_GpInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Gross profit ${i?.actual} (${i?.actualMargin}) against ${i?.expected} expected (${i?.expectedMargin})`)
};

export const api_assistant_case_invoice = /** @type {(inputs: Api_Assistant_Case_InvoiceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Invoice ${i?.number}: ${i?.status}, ${i?.amount} open`)
};

export const api_assistant_case_lines = /** @type {(inputs: Api_Assistant_Case_LinesInputs) => LocalizedString} */ (i) => {
	if (i?.hasBlocked === "yes") return /** @type {LocalizedString} */ (`Lines: ${i?.ready} of ${i?.total} ready, ${i?.blocked} blocked`);
	return /** @type {LocalizedString} */ (`Lines: ${i?.ready} of ${i?.total} ready`)
};

export const api_assistant_case_margin = /** @type {(inputs: Api_Assistant_Case_MarginInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.caseId} (${i?.vessel}): actual gross profit ${i?.actual}, ${i?.actualMargin} margin, against ${i?.expected} (${i?.expectedMargin}) expected at quotation.`)
};

export const api_assistant_case_next = /** @type {(inputs: Api_Assistant_Case_NextInputs) => LocalizedString} */ (i) => {
	if (i?.hasBlocker === "yes") return /** @type {LocalizedString} */ (`Next: ${i?.next} · blocker: ${i?.blocker}`);
	return /** @type {LocalizedString} */ (`Next: ${i?.next}`)
};

export const api_assistant_case_profit_and_close = /** @type {(inputs: Api_Assistant_Case_Profit_And_CloseInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.caseId} profit & close`)
};

export const api_assistant_case_stage = /** @type {(inputs: Api_Assistant_Case_StageInputs) => LocalizedString} */ (i) => {
	if (i?.hasWait === "yes") return /** @type {LocalizedString} */ (`Stage: ${i?.stage} (${i?.wait}) · owner ${i?.owner}`);
	return /** @type {LocalizedString} */ (`Stage: ${i?.stage} · owner ${i?.owner}`)
};

export const api_assistant_case_waiting_on = /** @type {(inputs: Api_Assistant_Case_Waiting_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Waiting on ${i?.suppliers} (${i?.statuses})`)
};

export const api_assistant_cases_need_attention = /** @type {(inputs: Api_Assistant_Cases_Need_AttentionInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} live case needs attention.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} live cases need attention.`)
};

export const api_assistant_collections = /** @type {(inputs: Api_Assistant_CollectionsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Collections: ${i?.totals} open on ${i?.count} invoices.`)
};

export const api_assistant_commitment_blocked = /** @type {(inputs: Api_Assistant_Commitment_BlockedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`commitment blocked until it matches`)
};

export const api_assistant_control_room = /** @type {(inputs: Api_Assistant_Control_RoomInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Control room`)
};

export const api_assistant_customers_owe = /** @type {(inputs: Api_Assistant_Customers_OweInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	const overduePluralExact = i?.overdue;
	if (countPlural === "one" && (overduePluralExact === 0 || overduePluralExact === "0")) return /** @type {LocalizedString} */ (`Customers owe ${i?.totals} on ${__paraglideRegistry.icuPound("en", i?.count, {})} open invoice.`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Customers owe ${i?.totals} on ${__paraglideRegistry.icuPound("en", i?.count, {})} open invoice; ${i?.overdue} overdue.`);
	if ((overduePluralExact === 0 || overduePluralExact === "0")) return /** @type {LocalizedString} */ (`Customers owe ${i?.totals} on ${__paraglideRegistry.icuPound("en", i?.count, {})} open invoices.`);
	return /** @type {LocalizedString} */ (`Customers owe ${i?.totals} on ${__paraglideRegistry.icuPound("en", i?.count, {})} open invoices; ${i?.overdue} overdue.`)
};

export const api_assistant_deliveries_short = /** @type {(inputs: Api_Assistant_Deliveries_ShortInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} supplier delivery came in short: ${i?.list}. The bills stay on hold until the quantities match.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} supplier deliveries came in short: ${i?.list}. The bills stay on hold until the quantities match.`)
};

export const api_assistant_due_this_week = /** @type {(inputs: Api_Assistant_Due_This_WeekInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Due this week: ${i?.list}.`)
};

export const api_assistant_eta = /** @type {(inputs: Api_Assistant_EtaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`ETA ${i?.port} ${i?.day}`)
};

export const api_assistant_exceptions = /** @type {(inputs: Api_Assistant_ExceptionsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} integration exception needs a look: ${i?.list}. Safe retry is available.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} integration exceptions need a look: ${i?.list}. Safe retry is available.`)
};

export const api_assistant_fx_moved = /** @type {(inputs: Api_Assistant_Fx_MovedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`USD moved from ${i?.from} to ${i?.to} EGP (${i?.change}). The new rate waits for approval; open quotations are re-checked against the 15% minimum margin once it's active.`)
};

export const api_assistant_fx_on_receipts = /** @type {(inputs: Api_Assistant_Fx_On_ReceiptsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`FX on receipts: ${i?.amount}`)
};

export const api_assistant_fx_rates = /** @type {(inputs: Api_Assistant_Fx_RatesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`FX rates`)
};

export const api_assistant_good_morning = /** @type {(inputs: Api_Assistant_Good_MorningInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Good morning ${i?.name}.`)
};

export const api_assistant_good_morning_there = /** @type {(inputs: Api_Assistant_Good_Morning_ThereInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Good morning there.`)
};

export const api_assistant_growth_board = /** @type {(inputs: Api_Assistant_Growth_BoardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Growth board`)
};

export const api_assistant_help = /** @type {(inputs: Api_Assistant_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`I answer from every case, quote, approval, invoice and supplier record in the platform. Ask about a vessel or case number, approvals, who owes us money, suppliers, deadlines or the growth pipeline.`)
};

export const api_assistant_items_awaiting_approval = /** @type {(inputs: Api_Assistant_Items_Awaiting_ApprovalInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} item is awaiting approval (${i?.types}).`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} items are awaiting approval (${i?.types}).`)
};

export const api_assistant_late_item = /** @type {(inputs: Api_Assistant_Late_ItemInputs) => LocalizedString} */ (i) => {
	if (i?.extra === "claim") return /** @type {LocalizedString} */ (`${i?.supplier}, ${i?.po} line ${i?.line}: ${i?.received} of ${i?.ordered} received · ${i?.claim}`);
	if (i?.extra === "promised") return /** @type {LocalizedString} */ (`${i?.supplier}, ${i?.po} line ${i?.line}: ${i?.received} of ${i?.ordered} received · rest promised ${i?.promised}`);
	return /** @type {LocalizedString} */ (`${i?.supplier}, ${i?.po} line ${i?.line}: ${i?.received} of ${i?.ordered} received`)
};

export const api_assistant_least_reliable = /** @type {(inputs: Api_Assistant_Least_ReliableInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Least reliable: ${i?.name} ${i?.onTime}% on time, ${i?.hours} h replies`)
};

export const api_assistant_lowest = /** @type {(inputs: Api_Assistant_LowestInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Lowest: ${i?.list}.`)
};

export const api_assistant_margin_by_store = /** @type {(inputs: Api_Assistant_Margin_By_StoreInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Margin by store, last 90 days: ${i?.list} (minimum 15%).`)
};

export const api_assistant_month_gp = /** @type {(inputs: Api_Assistant_Month_GpInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.month}: gross profit EGP ${i?.expected}k expected at quotation, EGP ${i?.actual}k actual so far. The gap closes as November's costs are billed.`)
};

export const api_assistant_more_due_later = /** @type {(inputs: Api_Assistant_More_Due_LaterInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`…and ${i?.count} more due later.`)
};

export const api_assistant_no_case_at_risk = /** @type {(inputs: Api_Assistant_No_Case_At_RiskInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No live case is at risk.`)
};

export const api_assistant_no_open_balance = /** @type {(inputs: Api_Assistant_No_Open_BalanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No customer invoice has an open balance.`)
};

export const api_assistant_nothing_overdue = /** @type {(inputs: Api_Assistant_Nothing_OverdueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing overdue.`)
};

export const api_assistant_nothing_waiting_approval = /** @type {(inputs: Api_Assistant_Nothing_Waiting_ApprovalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing is waiting for approval.`)
};

export const api_assistant_november_gp = /** @type {(inputs: Api_Assistant_November_GpInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`November gross profit: EGP ${i?.expected}k expected at quotation, EGP ${i?.actual}k actual so far as costs are billed.`)
};

export const api_assistant_opportunity_item = /** @type {(inputs: Api_Assistant_Opportunity_ItemInputs) => LocalizedString} */ (i) => {
	if (i?.hasValue === "yes" && i?.next === "none") return /** @type {LocalizedString} */ (`${i?.name}: ${i?.stage}, ${i?.value} · no next step planned`);
	if (i?.hasValue === "yes" && i?.next === "dated") return /** @type {LocalizedString} */ (`${i?.name}: ${i?.stage}, ${i?.value} · next: ${i?.step} (${i?.due})`);
	if (i?.hasValue === "yes") return /** @type {LocalizedString} */ (`${i?.name}: ${i?.stage}, ${i?.value} · next: ${i?.step}`);
	if (i?.next === "none") return /** @type {LocalizedString} */ (`${i?.name}: ${i?.stage} · no next step planned`);
	if (i?.next === "dated") return /** @type {LocalizedString} */ (`${i?.name}: ${i?.stage} · next: ${i?.step} (${i?.due})`);
	return /** @type {LocalizedString} */ (`${i?.name}: ${i?.stage} · next: ${i?.step}`)
};

export const api_assistant_overdue = /** @type {(inputs: Api_Assistant_OverdueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Overdue: ${i?.list}.`)
};

export const api_assistant_owe_item = /** @type {(inputs: Api_Assistant_Owe_ItemInputs) => LocalizedString} */ (i) => {
	if (i?.due === "overdue" && i?.hasPaid === "yes") return /** @type {LocalizedString} */ (`${i?.customer}: ${i?.amount} on ${i?.number}, overdue since ${i?.day} (${i?.paid} received)`);
	if (i?.due === "due" && i?.hasPaid === "yes") return /** @type {LocalizedString} */ (`${i?.customer}: ${i?.amount} on ${i?.number}, due ${i?.day} (${i?.paid} received)`);
	if (i?.due === "overdue") return /** @type {LocalizedString} */ (`${i?.customer}: ${i?.amount} on ${i?.number}, overdue since ${i?.day}`);
	if (i?.due === "due") return /** @type {LocalizedString} */ (`${i?.customer}: ${i?.amount} on ${i?.number}, due ${i?.day}`);
	if (i?.hasPaid === "yes") return /** @type {LocalizedString} */ (`${i?.customer}: ${i?.amount} on ${i?.number} (${i?.paid} received)`);
	return /** @type {LocalizedString} */ (`${i?.customer}: ${i?.amount} on ${i?.number}`)
};

export const api_assistant_pipeline = /** @type {(inputs: Api_Assistant_PipelineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.open} growth opportunities open; ${i?.inquiries} inquiries and ${i?.won} wins in the last 12 weeks (${i?.byCount}% by count, ${i?.byValue}% by value this month).`)
};

export const api_assistant_plan_next_step = /** @type {(inputs: Api_Assistant_Plan_Next_StepInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Plan a next step or close: ${i?.names}.`)
};

export const api_assistant_po = /** @type {(inputs: Api_Assistant_PoInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`PO ${i?.po}`)
};

export const api_assistant_po_mismatch = /** @type {(inputs: Api_Assistant_Po_MismatchInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`The customer PO on ${i?.caseId} (${i?.vessel}) differs from the approved quote: ${i?.blocker}.`)
};

export const api_assistant_profit_and_close = /** @type {(inputs: Api_Assistant_Profit_And_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Profit & close`)
};

export const api_assistant_quote_due_item = /** @type {(inputs: Api_Assistant_Quote_Due_ItemInputs) => LocalizedString} */ (i) => {
	if (i?.hasBlocker === "yes") return /** @type {LocalizedString} */ (`${i?.vessel} (${i?.caseId}) ${i?.when}, ${i?.blocker}`);
	return /** @type {LocalizedString} */ (`${i?.vessel} (${i?.caseId}) ${i?.when}`)
};

export const api_assistant_quotes_due = /** @type {(inputs: Api_Assistant_Quotes_DueInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} quote must go out by tomorrow: ${i?.list}.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} quotes must go out by tomorrow: ${i?.list}.`)
};

export const api_assistant_receipt_po = /** @type {(inputs: Api_Assistant_Receipt_PoInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Receipt PO ${i?.po}`)
};

export const api_assistant_refused = /** @type {(inputs: Api_Assistant_RefusedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`I can't share costs, margins or profit with the Sales role.`)
};

export const api_assistant_refused_hint = /** @type {(inputs: Api_Assistant_Refused_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ask about a case's status, approvals, deadlines, suppliers or the growth pipeline instead.`)
};

export const api_assistant_risky_item = /** @type {(inputs: Api_Assistant_Risky_ItemInputs) => LocalizedString} */ (i) => {
	if (i?.hasBlocker === "yes") return /** @type {LocalizedString} */ (`${i?.caseId} ${i?.vessel}: ${i?.stage}, deadline ${i?.deadline} · ${i?.blocker}`);
	return /** @type {LocalizedString} */ (`${i?.caseId} ${i?.vessel}: ${i?.stage}, deadline ${i?.deadline}`)
};

export const api_assistant_settled_margin = /** @type {(inputs: Api_Assistant_Settled_MarginInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.caseId}: ${i?.actual} actual vs ${i?.expected} expected. The launch cost more after the ETA moved at short notice.`)
};

export const api_assistant_short_item = /** @type {(inputs: Api_Assistant_Short_ItemInputs) => LocalizedString} */ (i) => {
	if (i?.hasPromise === "yes") return /** @type {LocalizedString} */ (`PO ${i?.po} line ${i?.line}, ${i?.received} of ${i?.ordered}, rest promised ${i?.promised}`);
	return /** @type {LocalizedString} */ (`PO ${i?.po} line ${i?.line}, ${i?.received} of ${i?.ordered}`)
};

export const api_assistant_silent_item = /** @type {(inputs: Api_Assistant_Silent_ItemInputs) => LocalizedString} */ (i) => {
	const remindersPlural = __paraglideRegistry.plural("en", i?.reminders, {}, true);
	const remindersPluralExact = i?.reminders;
	if ((remindersPluralExact === 0 || remindersPluralExact === "0")) return /** @type {LocalizedString} */ (`${i?.supplier} on ${i?.reference}`);
	if (remindersPlural === "one") return /** @type {LocalizedString} */ (`${i?.supplier} on ${i?.reference} (${__paraglideRegistry.icuPound("en", i?.reminders, {})} reminder sent)`);
	return /** @type {LocalizedString} */ (`${i?.supplier} on ${i?.reference} (${__paraglideRegistry.icuPound("en", i?.reminders, {})} reminders sent)`)
};

export const api_assistant_suggest_approvals = /** @type {(inputs: Api_Assistant_Suggest_ApprovalsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What's waiting for approval?`)
};

export const api_assistant_suggest_late_suppliers = /** @type {(inputs: Api_Assistant_Suggest_Late_SuppliersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Which suppliers are late?`)
};

export const api_assistant_suggest_margin = /** @type {(inputs: Api_Assistant_Suggest_MarginInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What's our margin this month?`)
};

export const api_assistant_suggest_owes = /** @type {(inputs: Api_Assistant_Suggest_OwesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Who owes us money?`)
};

export const api_assistant_suggest_pipeline = /** @type {(inputs: Api_Assistant_Suggest_PipelineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`How is the growth pipeline?`)
};

export const api_assistant_suggest_status = /** @type {(inputs: Api_Assistant_Suggest_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What's the status of Aurora Crest?`)
};

export const api_assistant_summarised_again = /** @type {(inputs: Api_Assistant_Summarised_AgainInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Summarised again at ${i?.at} from ${i?.count} live records.`)
};

export const api_assistant_supplier_named = /** @type {(inputs: Api_Assistant_Supplier_NamedInputs) => LocalizedString} */ (i) => {
	if (i?.hasOnTime === "yes" && i?.isNew === "yes") return /** @type {LocalizedString} */ (`${i?.name}: replies in ${i?.hours} h on average, ${i?.onTime}% on time, new supplier, never ordered from.`);
	if (i?.hasOnTime === "yes") return /** @type {LocalizedString} */ (`${i?.name}: replies in ${i?.hours} h on average, ${i?.onTime}% on time.`);
	if (i?.isNew === "yes") return /** @type {LocalizedString} */ (`${i?.name}: replies in ${i?.hours} h on average, no deliveries yet, new supplier, never ordered from.`);
	return /** @type {LocalizedString} */ (`${i?.name}: replies in ${i?.hours} h on average, no deliveries yet.`)
};

export const api_assistant_suppliers_silent = /** @type {(inputs: Api_Assistant_Suppliers_SilentInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} supplier hasn't replied in time: ${i?.list}. Reminders run automatically; escalations go to the case owner.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} suppliers haven't replied in time: ${i?.list}. Reminders run automatically; escalations go to the case owner.`)
};

export const api_assistant_suppliers_summary = /** @type {(inputs: Api_Assistant_Suppliers_SummaryInputs) => LocalizedString} */ (i) => {
	const latePlural = __paraglideRegistry.plural("en", i?.late, {}, true);
	const waitingPlural = __paraglideRegistry.plural("en", i?.waiting, {}, true);
	if (latePlural === "one" && waitingPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.late, {})} delivery is late or short, and ${__paraglideRegistry.icuPound("en", i?.waiting, {})} supplier RFQ is waiting for a reply.`);
	if (latePlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.late, {})} delivery is late or short, and ${__paraglideRegistry.icuPound("en", i?.waiting, {})} supplier RFQs are waiting for a reply.`);
	if (waitingPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.late, {})} deliveries are late or short, and ${__paraglideRegistry.icuPound("en", i?.waiting, {})} supplier RFQ is waiting for a reply.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.late, {})} deliveries are late or short, and ${__paraglideRegistry.icuPound("en", i?.waiting, {})} supplier RFQs are waiting for a reply.`)
};

export const api_assistant_waiting_item = /** @type {(inputs: Api_Assistant_Waiting_ItemInputs) => LocalizedString} */ (i) => {
	const remindersPlural = __paraglideRegistry.plural("en", i?.reminders, {}, true);
	const remindersPluralExact = i?.reminders;
	if (i?.hasDue === "yes" && (remindersPluralExact === 0 || remindersPluralExact === "0")) return /** @type {LocalizedString} */ (`${i?.supplier}: ${i?.reference} ${i?.status}, due ${i?.due}`);
	if (i?.hasDue === "yes" && remindersPlural === "one") return /** @type {LocalizedString} */ (`${i?.supplier}: ${i?.reference} ${i?.status}, due ${i?.due} (${__paraglideRegistry.icuPound("en", i?.reminders, {})} reminder)`);
	if (i?.hasDue === "yes") return /** @type {LocalizedString} */ (`${i?.supplier}: ${i?.reference} ${i?.status}, due ${i?.due} (${__paraglideRegistry.icuPound("en", i?.reminders, {})} reminders)`);
	if ((remindersPluralExact === 0 || remindersPluralExact === "0")) return /** @type {LocalizedString} */ (`${i?.supplier}: ${i?.reference} ${i?.status}`);
	if (remindersPlural === "one") return /** @type {LocalizedString} */ (`${i?.supplier}: ${i?.reference} ${i?.status} (${__paraglideRegistry.icuPound("en", i?.reminders, {})} reminder)`);
	return /** @type {LocalizedString} */ (`${i?.supplier}: ${i?.reference} ${i?.status} (${__paraglideRegistry.icuPound("en", i?.reminders, {})} reminders)`)
};

export const api_assistant_we_owe = /** @type {(inputs: Api_Assistant_We_OweInputs) => LocalizedString} */ (i) => {
	if (i?.hasReason === "yes") return /** @type {LocalizedString} */ (`We owe ${i?.supplier} ${i?.amount} on bill ${i?.bill} (${i?.status}: ${i?.reason})`);
	return /** @type {LocalizedString} */ (`We owe ${i?.supplier} ${i?.amount} on bill ${i?.bill} (${i?.status})`)
};

export const api_cash_account_owner = /** @type {(inputs: Api_Cash_Account_OwnerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Account owner`)
};

export const api_cash_allocated_balance = /** @type {(inputs: Api_Cash_Allocated_BalanceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} allocated to ${i?.number}. Balance ${i?.balance}.`)
};

export const api_cash_allocated_paid = /** @type {(inputs: Api_Cash_Allocated_PaidInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} allocated to ${i?.number}. Paid in full.`)
};

export const api_cash_approval_in_progress = /** @type {(inputs: Api_Cash_Approval_In_ProgressInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`An approval is already in progress for this payable.`)
};

export const api_cash_approval_not_found = /** @type {(inputs: Api_Cash_Approval_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approval not found.`)
};

export const api_cash_approve_payment_title = /** @type {(inputs: Api_Cash_Approve_Payment_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Approve payment to ${i?.supplier}`)
};

export const api_cash_bank_change_not_found = /** @type {(inputs: Api_Cash_Bank_Change_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bank-detail change not found.`)
};

export const api_cash_bill_on_hold = /** @type {(inputs: Api_Cash_Bill_On_HoldInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`The supplier bill for ${i?.number} is on hold. Release the hold before asking for payment approval.`)
};

export const api_cash_call_back_done = /** @type {(inputs: Api_Cash_Call_Back_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Call-back done on number on file. ${i?.note}`)
};

export const api_cash_call_back_first = /** @type {(inputs: Api_Cash_Call_Back_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Call back on the number on file and tick the confirmation first.`)
};

export const api_cash_cant_decide = /** @type {(inputs: Api_Cash_Cant_DecideInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`You can't decide on this approval.`)
};

export const api_cash_collect_goal = /** @type {(inputs: Api_Cash_Collect_GoalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Collect ${i?.amount} on ${i?.number}`)
};

export const api_cash_enter_amount = /** @type {(inputs: Api_Cash_Enter_AmountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter the amount received.`)
};

export const api_cash_finance_applies_bank = /** @type {(inputs: Api_Cash_Finance_Applies_BankInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Management and finance apply bank details.`)
};

export const api_cash_finance_records_payments = /** @type {(inputs: Api_Cash_Finance_Records_PaymentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Management and finance record payments.`)
};

export const api_cash_finance_requests_approvals = /** @type {(inputs: Api_Cash_Finance_Requests_ApprovalsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Management and finance request payment approvals.`)
};

export const api_cash_give_bank_reference = /** @type {(inputs: Api_Cash_Give_Bank_ReferenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Give the bank reference.`)
};

export const api_cash_give_reject_reason = /** @type {(inputs: Api_Cash_Give_Reject_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Give a reason for rejecting.`)
};

export const api_cash_invoice_not_found = /** @type {(inputs: Api_Cash_Invoice_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoice not found.`)
};

export const api_cash_list_separator = /** @type {(inputs: Api_Cash_List_SeparatorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`; `)
};

export const api_cash_match_item = /** @type {(inputs: Api_Cash_Match_ItemInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} (${i?.customer}, ${i?.amount} open)`)
};

export const api_cash_match_message = /** @type {(inputs: Api_Cash_Match_MessageInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Looks like it pays this invoice: ${i?.list}. A person records the payment.`);
	return /** @type {LocalizedString} */ (`Looks like it pays these ${i?.count} invoices: ${i?.list}. A person records the payment.`)
};

export const api_cash_more_than_balance = /** @type {(inputs: Api_Cash_More_Than_BalanceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`This payment is more than the open balance of ${i?.balance} on ${i?.number}. Record no more than the open balance.`)
};

export const api_cash_no_remittance_match = /** @type {(inputs: Api_Cash_No_Remittance_MatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No open invoice matches these numbers or this amount. Check the remittance by hand.`)
};

export const api_cash_pay_detail = /** @type {(inputs: Api_Cash_Pay_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`PO ${i?.number} · due ${i?.due} · bank details unchanged.`)
};

export const api_cash_pay_detail_matched = /** @type {(inputs: Api_Cash_Pay_Detail_MatchedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`PO ${i?.number} · bill ${i?.bill} matched (PO = receipt = bill) · due ${i?.due} · bank details unchanged.`)
};

export const api_cash_pay_title = /** @type {(inputs: Api_Cash_Pay_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Pay ${i?.supplier} ${i?.amount} for ${i?.number}`)
};

export const api_cash_payable_not_found = /** @type {(inputs: Api_Cash_Payable_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payable not found.`)
};

export const api_cash_payables_hidden_from_sales = /** @type {(inputs: Api_Cash_Payables_Hidden_From_SalesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier payables, payment approvals and bank details are not visible to Sales.`)
};

export const api_cash_payment_not_approved = /** @type {(inputs: Api_Cash_Payment_Not_ApprovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The payment isn't approved yet.`)
};

export const api_cash_reminder_sent_note = /** @type {(inputs: Api_Cash_Reminder_Sent_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reviewed and sent by a person.`)
};

export const api_cash_two_approvers_first = /** @type {(inputs: Api_Cash_Two_Approvers_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Two different people must approve first.`)
};

export const api_commercial_accepted_activity = /** @type {(inputs: Api_Commercial_Accepted_ActivityInputs) => LocalizedString} */ (i) => {
	if (i?.hasNote === "yes") return /** @type {LocalizedString} */ (`L${i?.line}: customer accepted the alternative pack in writing (${i?.note}).`);
	return /** @type {LocalizedString} */ (`L${i?.line}: customer accepted the alternative pack in writing.`)
};

export const api_commercial_advance_payment = /** @type {(inputs: Api_Commercial_Advance_PaymentInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Advance payment exposure: ${i?.supplier}`)
};

export const api_commercial_agency_flag = /** @type {(inputs: Api_Commercial_Agency_FlagInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Agency pricelist: priced instantly, no supplier RFQ`)
};

export const api_commercial_agency_terms = /** @type {(inputs: Api_Commercial_Agency_TermsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Agency terms`)
};

export const api_commercial_already_awaiting = /** @type {(inputs: Api_Commercial_Already_AwaitingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} is already awaiting approval.`)
};

export const api_commercial_already_cant_withdraw = /** @type {(inputs: Api_Commercial_Already_Cant_WithdrawInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} is already ${i?.status}, so the decision can't be withdrawn.`)
};

export const api_commercial_alternative_accepted = /** @type {(inputs: Api_Commercial_Alternative_AcceptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Alternative pack accepted by the customer in writing`)
};

export const api_commercial_alternative_pack = /** @type {(inputs: Api_Commercial_Alternative_PackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`alternative pack`)
};

export const api_commercial_alternatives_allowed = /** @type {(inputs: Api_Commercial_Alternatives_AllowedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`alternatives allowed`)
};

export const api_commercial_approval_not_found = /** @type {(inputs: Api_Commercial_Approval_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approval not found.`)
};

export const api_commercial_approval_recorded = /** @type {(inputs: Api_Commercial_Approval_RecordedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Your approval is recorded: ${i?.progress}.`)
};

export const api_commercial_approval_title = /** @type {(inputs: Api_Commercial_Approval_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Quote ${i?.number} to ${i?.customer}, ${i?.total}`)
};

export const api_commercial_approved_dot = /** @type {(inputs: Api_Commercial_Approved_DotInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approved.`)
};

export const api_commercial_approved_title = /** @type {(inputs: Api_Commercial_Approved_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Approved: ${i?.title}`)
};

export const api_commercial_bank_applied_cant_withdraw = /** @type {(inputs: Api_Commercial_Bank_Applied_Cant_WithdrawInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The new bank details are already applied, so the decision can't be withdrawn.`)
};

export const api_commercial_below_min = /** @type {(inputs: Api_Commercial_Below_MinInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Below ${i?.min}% minimum margin: approval exception`)
};

export const api_commercial_best_fit_reason = /** @type {(inputs: Api_Commercial_Best_Fit_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Best-fit offer (landed cost)`)
};

export const api_commercial_best_regards = /** @type {(inputs: Api_Commercial_Best_RegardsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Best regards,`)
};

export const api_commercial_case_not_found = /** @type {(inputs: Api_Commercial_Case_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Case not found.`)
};

export const api_commercial_charge_estimate = /** @type {(inputs: Api_Commercial_Charge_EstimateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Shared charge is an estimate: ${i?.label} (${i?.amount})`)
};

export const api_commercial_check_po = /** @type {(inputs: Api_Commercial_Check_PoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Check customer PO against the quote`)
};

export const api_commercial_check_po_partial = /** @type {(inputs: Api_Commercial_Check_Po_PartialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Check customer PO against the quote (partial award)`)
};

export const api_commercial_choose_offer = /** @type {(inputs: Api_Commercial_Choose_OfferInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose at least one offer.`)
};

export const api_commercial_closed_expired = /** @type {(inputs: Api_Commercial_Closed_ExpiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Closed: expired`)
};

export const api_commercial_closed_lost = /** @type {(inputs: Api_Commercial_Closed_LostInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Closed: lost`)
};

export const api_commercial_converted_fx = /** @type {(inputs: Api_Commercial_Converted_FxInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Converted at approved FX ${i?.currency}/EGP ${i?.rate}`)
};

export const api_commercial_corrected_version = /** @type {(inputs: Api_Commercial_Corrected_VersionInputs) => LocalizedString} */ (i) => {
	if (i?.hasWas === "yes") return /** @type {LocalizedString} */ (`Corrected v${i?.version}: replaces v${i?.replaces} (${i?.was})`);
	return /** @type {LocalizedString} */ (`Corrected v${i?.version}: replaces v${i?.replaces}`)
};

export const api_commercial_correction_asked = /** @type {(inputs: Api_Commercial_Correction_AskedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Thank you for your offer. On line ${i?.line} we asked for ${i?.part} (exact part — no alternatives).`)
};

export const api_commercial_correction_please = /** @type {(inputs: Api_Commercial_Correction_PleaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Please send a corrected offer for the requested part, with price, availability and lead time to Port Said.`)
};

export const api_commercial_correction_sent_activity = /** @type {(inputs: Api_Commercial_Correction_Sent_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Correction request sent to ${i?.supplier} for line ${i?.line} (confirmed by ${i?.name}).`)
};

export const api_commercial_correction_sent_status = /** @type {(inputs: Api_Commercial_Correction_Sent_StatusInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sent 16 Nov · corrected v${i?.version} received and in use`)
};

export const api_commercial_correction_subject = /** @type {(inputs: Api_Commercial_Correction_SubjectInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.rfq}, line ${i?.line}: please correct your offer`)
};

export const api_commercial_customer_decision = /** @type {(inputs: Api_Commercial_Customer_DecisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer decision`)
};

export const api_commercial_days_short = /** @type {(inputs: Api_Commercial_Days_ShortInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} d`)
};

export const api_commercial_dear = /** @type {(inputs: Api_Commercial_DearInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Dear ${i?.name},`)
};

export const api_commercial_dear_colleagues = /** @type {(inputs: Api_Commercial_Dear_ColleaguesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dear colleagues,`)
};

export const api_commercial_decided_activity = /** @type {(inputs: Api_Commercial_Decided_ActivityInputs) => LocalizedString} */ (i) => {
	if (i?.approved === "yes" && i?.hasReason === "yes") return /** @type {LocalizedString} */ (`${i?.name} approved “${i?.title}”: ${i?.reason}.`);
	if (i?.approved === "yes") return /** @type {LocalizedString} */ (`${i?.name} approved “${i?.title}”.`);
	if (i?.hasReason === "yes") return /** @type {LocalizedString} */ (`${i?.name} returned “${i?.title}”: ${i?.reason}.`);
	return /** @type {LocalizedString} */ (`${i?.name} returned “${i?.title}”.`)
};

export const api_commercial_decision_activity = /** @type {(inputs: Api_Commercial_Decision_ActivityInputs) => LocalizedString} */ (i) => {
	if (i?.hasNote === "yes") return /** @type {LocalizedString} */ (`Customer decision on ${i?.number}: ${i?.decision} (${i?.note}).`);
	return /** @type {LocalizedString} */ (`Customer decision on ${i?.number}: ${i?.decision}.`)
};

export const api_commercial_decision_must_be = /** @type {(inputs: Api_Commercial_Decision_Must_BeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Decision must be Approve or Reject.`)
};

export const api_commercial_decision_on_received = /** @type {(inputs: Api_Commercial_Decision_On_ReceivedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Record the customer's decision on the version they received.`)
};

export const api_commercial_decision_withdrawn = /** @type {(inputs: Api_Commercial_Decision_WithdrawnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Decision withdrawn. ${i?.title} is waiting again.`)
};

export const api_commercial_delivered_as_quoted = /** @type {(inputs: Api_Commercial_Delivered_As_QuotedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delivered (as quoted)`)
};

export const api_commercial_delivery_terms_default = /** @type {(inputs: Api_Commercial_Delivery_Terms_DefaultInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`On board at ${i?.port} on arrival`)
};

export const api_commercial_deviation = /** @type {(inputs: Api_Commercial_DeviationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`deviation`)
};

export const api_commercial_different_item = /** @type {(inputs: Api_Commercial_Different_ItemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`different item`)
};

export const api_commercial_discount_above = /** @type {(inputs: Api_Commercial_Discount_AboveInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Customer discount ${i?.discount}% is above ${i?.max}% without approval`)
};

export const api_commercial_draft_not_sent = /** @type {(inputs: Api_Commercial_Draft_Not_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Draft, not sent`)
};

export const api_commercial_due_day = /** @type {(inputs: Api_Commercial_Due_DayInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Due ${i?.day}`)
};

export const api_commercial_emailed_activity = /** @type {(inputs: Api_Commercial_Emailed_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} emailed to ${i?.to}. Draft confirmed by ${i?.name}.`)
};

export const api_commercial_exact_only = /** @type {(inputs: Api_Commercial_Exact_OnlyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.part} only`)
};

export const api_commercial_expired_validity = /** @type {(inputs: Api_Commercial_Expired_ValidityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Expired validity: offer ended ${i?.day}, reconfirm`)
};

export const api_commercial_field_currency = /** @type {(inputs: Api_Commercial_Field_CurrencyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Currency`)
};

export const api_commercial_field_line_count = /** @type {(inputs: Api_Commercial_Field_Line_CountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Line count`)
};

export const api_commercial_field_payment_terms = /** @type {(inputs: Api_Commercial_Field_Payment_TermsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payment terms`)
};

export const api_commercial_field_quotation_no = /** @type {(inputs: Api_Commercial_Field_Quotation_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quotation no.`)
};

export const api_commercial_field_total = /** @type {(inputs: Api_Commercial_Field_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Total (excl. VAT)`)
};

export const api_commercial_field_validity = /** @type {(inputs: Api_Commercial_Field_ValidityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validity`)
};

export const api_commercial_follow_up_2_days = /** @type {(inputs: Api_Commercial_Follow_Up_2_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Follow up ${i?.number} in 2 days (internal reminder)`)
};

export const api_commercial_freight_as_quoted = /** @type {(inputs: Api_Commercial_Freight_As_QuotedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Freight as quoted`)
};

export const api_commercial_fx_decision_stands = /** @type {(inputs: Api_Commercial_Fx_Decision_StandsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`An exchange-rate decision takes effect at once. Propose a new rate instead.`)
};

export const api_commercial_fx_label = /** @type {(inputs: Api_Commercial_Fx_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Approved FX · USD/EGP ${i?.usd} · EUR/EGP ${i?.eur}`)
};

export const api_commercial_give_reason_not_best = /** @type {(inputs: Api_Commercial_Give_Reason_Not_BestInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Give a reason: this isn't the best-fit offer (kept for the approver).`)
};

export const api_commercial_give_return_reason = /** @type {(inputs: Api_Commercial_Give_Return_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Give a reason when returning a request.`)
};

export const api_commercial_gs_truck_lane = /** @type {(inputs: Api_Commercial_Gs_Truck_LaneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Golden Sea truck ${i?.from} → ${i?.port}`)
};

export const api_commercial_import_freight = /** @type {(inputs: Api_Commercial_Import_FreightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Import freight, duty & clearance (est. 18%)`)
};

export const api_commercial_items_follow = /** @type {(inputs: Api_Commercial_Items_FollowInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Items ${i?.lines} of your request will follow in a revised quotation.`)
};

export const api_commercial_karim_approve = /** @type {(inputs: Api_Commercial_Karim_ApproveInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Karim Balbaa: approve ${i?.number}`)
};

export const api_commercial_lead_days = /** @type {(inputs: Api_Commercial_Lead_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} days`)
};

export const api_commercial_lead_time_misses = /** @type {(inputs: Api_Commercial_Lead_Time_MissesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Lead time ${i?.days} d misses vessel ETA ${i?.eta}`)
};

export const api_commercial_lead_time_misses_eta = /** @type {(inputs: Api_Commercial_Lead_Time_Misses_EtaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier lead time misses ETA`)
};

export const api_commercial_line_not_found = /** @type {(inputs: Api_Commercial_Line_Not_FoundInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Line ${i?.line} not found.`)
};

export const api_commercial_lines_excluded = /** @type {(inputs: Api_Commercial_Lines_ExcludedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Lines ${i?.lines} excluded, to follow in a revised quotation`)
};

export const api_commercial_local_truck = /** @type {(inputs: Api_Commercial_Local_TruckInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Local truck in ${i?.port}`)
};

export const api_commercial_missing_item_note = /** @type {(inputs: Api_Commercial_Missing_Item_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier did not quote this line (partial reply), follow-up drafted`)
};

export const api_commercial_negative_profit = /** @type {(inputs: Api_Commercial_Negative_ProfitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Negative / zero profit`)
};

export const api_commercial_new_supplier = /** @type {(inputs: Api_Commercial_New_SupplierInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`New supplier · no delivery history · ${i?.terms}`)
};

export const api_commercial_no_approval_requested = /** @type {(inputs: Api_Commercial_No_Approval_RequestedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No approval requested yet.`)
};

export const api_commercial_no_decision_to_withdraw = /** @type {(inputs: Api_Commercial_No_Decision_To_WithdrawInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`You have no decision on this request to withdraw.`)
};

export const api_commercial_no_delivery_history = /** @type {(inputs: Api_Commercial_No_Delivery_HistoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No delivery history`)
};

export const api_commercial_no_exceptions = /** @type {(inputs: Api_Commercial_No_ExceptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No exceptions. Standard approval.`)
};

export const api_commercial_no_quotation_named = /** @type {(inputs: Api_Commercial_No_Quotation_NamedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This request doesn't name its quotation, so the decision can't be withdrawn.`)
};

export const api_commercial_not_a_selection = /** @type {(inputs: Api_Commercial_Not_A_SelectionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`That isn't a selection of line ${i?.line}.`)
};

export const api_commercial_not_given = /** @type {(inputs: Api_Commercial_Not_GivenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not given`)
};

export const api_commercial_nothing_to_request = /** @type {(inputs: Api_Commercial_Nothing_To_RequestInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} is ${i?.status}. Nothing to request.`)
};

export const api_commercial_offer_blocked = /** @type {(inputs: Api_Commercial_Offer_BlockedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} v${i?.version} is blocked from pricing: ${i?.reason}.`)
};

export const api_commercial_offer_not_found = /** @type {(inputs: Api_Commercial_Offer_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Offer not found.`)
};

export const api_commercial_offer_not_on_line = /** @type {(inputs: Api_Commercial_Offer_Not_On_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Offer ${i?.offer} is not on line ${i?.line}.`)
};

export const api_commercial_offers_only = /** @type {(inputs: Api_Commercial_Offers_OnlyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} offers only ${i?.qty} ${i?.unit}.`)
};

export const api_commercial_on_arrival = /** @type {(inputs: Api_Commercial_On_ArrivalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`On arrival`)
};

export const api_commercial_on_hand = /** @type {(inputs: Api_Commercial_On_HandInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} on hand · ${i?.place}`)
};

export const api_commercial_on_time = /** @type {(inputs: Api_Commercial_On_TimeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`On-time ${i?.pct}%`)
};

export const api_commercial_only_approved_sent = /** @type {(inputs: Api_Commercial_Only_Approved_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Only an approved version can be sent.`)
};

export const api_commercial_only_approved_to_customer = /** @type {(inputs: Api_Commercial_Only_Approved_To_CustomerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Only an approved version can be sent to the customer.`)
};

export const api_commercial_our_rfq = /** @type {(inputs: Api_Commercial_Our_RfqInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Our RFQ`)
};

export const api_commercial_own_stock_flag = /** @type {(inputs: Api_Commercial_Own_Stock_FlagInputs) => LocalizedString} */ (i) => {
	if (i?.hasLot === "yes") return /** @type {LocalizedString} */ (`Own stock (lot ${i?.lot}): reserve now, Golden Sea truck`);
	return /** @type {LocalizedString} */ (`Own stock: reserve now, Golden Sea truck`)
};

export const api_commercial_own_stock_terms = /** @type {(inputs: Api_Commercial_Own_Stock_TermsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Own stock (average cost)`)
};

export const api_commercial_pack = /** @type {(inputs: Api_Commercial_PackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`pack`)
};

export const api_commercial_pack_size = /** @type {(inputs: Api_Commercial_Pack_SizeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Pack size: ${i?.offered} instead of ${i?.requested}, written customer acceptance needed`)
};

export const api_commercial_payment_recorded_cant_withdraw = /** @type {(inputs: Api_Commercial_Payment_Recorded_Cant_WithdrawInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The payment is already recorded, so the decision can't be withdrawn.`)
};

export const api_commercial_payment_terms_default = /** @type {(inputs: Api_Commercial_Payment_Terms_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`90 days from invoice date`)
};

export const api_commercial_pending_acceptance = /** @type {(inputs: Api_Commercial_Pending_AcceptanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pending customer acceptance: alternative pack`)
};

export const api_commercial_portal_activity = /** @type {(inputs: Api_Commercial_Portal_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} entered in the customer's procurement portal by ${i?.name}.`)
};

export const api_commercial_portal_check_activity = /** @type {(inputs: Api_Commercial_Portal_Check_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`AI compared the portal screenshot with ${i?.number}: 1 difference (payment terms). Submission not marked complete.`)
};

export const api_commercial_portal_default_terms = /** @type {(inputs: Api_Commercial_Portal_Default_TermsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`60 days (portal default)`)
};

export const api_commercial_price_expired = /** @type {(inputs: Api_Commercial_Price_ExpiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier price expired, reconfirm`)
};

export const api_commercial_purchasing_department = /** @type {(inputs: Api_Commercial_Purchasing_DepartmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Purchasing department`)
};

export const api_commercial_quantity_shortfall = /** @type {(inputs: Api_Commercial_Quantity_ShortfallInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Quantity shortfall: covers ${i?.pct}% of the request`)
};

export const api_commercial_quotation_not_found = /** @type {(inputs: Api_Commercial_Quotation_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quotation not found.`)
};

export const api_commercial_quote_margin_below = /** @type {(inputs: Api_Commercial_Quote_Margin_BelowInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Quote margin ${i?.margin}% is below the ${i?.min}% minimum`)
};

export const api_commercial_quoted_with_selection = /** @type {(inputs: Api_Commercial_Quoted_With_SelectionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} is ${i?.status} with this selection. Revise the quotation instead.`)
};

export const api_commercial_rejected_technical = /** @type {(inputs: Api_Commercial_Rejected_TechnicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rejected on technical check`)
};

export const api_commercial_replies_in = /** @type {(inputs: Api_Commercial_Replies_InInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`replies ~${i?.hours} h`)
};

export const api_commercial_requested_activity = /** @type {(inputs: Api_Commercial_Requested_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} requested approval of ${i?.number}.`)
};

export const api_commercial_returned_title = /** @type {(inputs: Api_Commercial_Returned_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Returned: ${i?.title}`)
};

export const api_commercial_revise_for_customer = /** @type {(inputs: Api_Commercial_Revise_For_CustomerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Revise ${i?.number} as the customer asked`)
};

export const api_commercial_revise_latest = /** @type {(inputs: Api_Commercial_Revise_LatestInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} is ${i?.status}. Revise the latest version instead.`)
};

export const api_commercial_revise_pricing = /** @type {(inputs: Api_Commercial_Revise_PricingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Revise pricing. Returned by ${i?.name}: ${i?.reason}`)
};

export const api_commercial_revised_activity = /** @type {(inputs: Api_Commercial_Revised_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.next} created from ${i?.from} (kept for audit).`)
};

export const api_commercial_revision_remark = /** @type {(inputs: Api_Commercial_Revision_RemarkInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Revision: ${i?.reason}`)
};

export const api_commercial_sales_hidden = /** @type {(inputs: Api_Commercial_Sales_HiddenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Costs and margins are hidden for your role.`)
};

export const api_commercial_select_alternative_first = /** @type {(inputs: Api_Commercial_Select_Alternative_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Select the alternative offer first.`)
};

export const api_commercial_select_offers_first = /** @type {(inputs: Api_Commercial_Select_Offers_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Select offers for at least one line first.`)
};

export const api_commercial_selected_activity = /** @type {(inputs: Api_Commercial_Selected_ActivityInputs) => LocalizedString} */ (i) => {
	if (i?.hasReason === "yes") return /** @type {LocalizedString} */ (`L${i?.line}: selected ${i?.names} (${i?.reason}).`);
	return /** @type {LocalizedString} */ (`L${i?.line}: selected ${i?.names} (best fit).`)
};

export const api_commercial_selected_again = /** @type {(inputs: Api_Commercial_Selected_AgainInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Line ${i?.line} has been selected again since. Nothing to take back.`)
};

export const api_commercial_selected_of = /** @type {(inputs: Api_Commercial_Selected_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Selected ${i?.total} of ${i?.qty} ${i?.unit}. Split the rest to another offer.`)
};

export const api_commercial_send_for_approval = /** @type {(inputs: Api_Commercial_Send_For_ApprovalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Send ${i?.number} for approval`)
};

export const api_commercial_send_to_customer = /** @type {(inputs: Api_Commercial_Send_To_CustomerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Send ${i?.number} to the customer`)
};

export const api_commercial_sent_awaiting_corrected = /** @type {(inputs: Api_Commercial_Sent_Awaiting_CorrectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sent, awaiting corrected offer`)
};

export const api_commercial_shelf_life = /** @type {(inputs: Api_Commercial_Shelf_LifeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Shelf life: ${i?.left} months left, vessel asked for ${i?.need}`)
};

export const api_commercial_shelf_life_below = /** @type {(inputs: Api_Commercial_Shelf_Life_BelowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Shelf life below the vessel's requirement`)
};

export const api_commercial_someone_decided_after = /** @type {(inputs: Api_Commercial_Someone_Decided_AfterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Someone decided after you. The request has moved on.`)
};

export const api_commercial_split_sourcing = /** @type {(inputs: Api_Commercial_Split_SourcingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Split sourcing: ${i?.parts}`)
};

export const api_commercial_superseded_by = /** @type {(inputs: Api_Commercial_Superseded_ByInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Superseded by v${i?.version}, kept for audit`)
};

export const api_commercial_supplied_as = /** @type {(inputs: Api_Commercial_Supplied_AsInputs) => LocalizedString} */ (i) => {
	if (i?.accepted === "yes") return /** @type {LocalizedString} */ (`${i?.description}, supplied as ${i?.pack} (alternative pack, accepted)`);
	return /** @type {LocalizedString} */ (`${i?.description}, supplied as ${i?.pack} (alternative pack)`)
};

export const api_commercial_supplier_word = /** @type {(inputs: Api_Commercial_Supplier_WordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`supplier`)
};

export const api_commercial_taken_back = /** @type {(inputs: Api_Commercial_Taken_BackInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Line ${i?.line}: selection taken back`)
};

export const api_commercial_taken_back_activity = /** @type {(inputs: Api_Commercial_Taken_Back_ActivityInputs) => LocalizedString} */ (i) => {
	if (i?.earlier === "yes") return /** @type {LocalizedString} */ (`L${i?.line}: selection taken back by ${i?.name}. The earlier selection applies again.`);
	return /** @type {LocalizedString} */ (`L${i?.line}: selection taken back by ${i?.name}.`)
};

export const api_commercial_terms_tbc = /** @type {(inputs: Api_Commercial_Terms_TbcInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`terms tbc`)
};

export const api_commercial_the_customer = /** @type {(inputs: Api_Commercial_The_CustomerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`the customer`)
};

export const api_commercial_tight_eta = /** @type {(inputs: Api_Commercial_Tight_EtaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tight: ready on the ETA day`)
};

export const api_commercial_truck_lane = /** @type {(inputs: Api_Commercial_Truck_LaneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Truck ${i?.from} → ${i?.port}`)
};

export const api_commercial_unknown_action = /** @type {(inputs: Api_Commercial_Unknown_ActionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unknown action.`)
};

export const api_commercial_unknown_decision = /** @type {(inputs: Api_Commercial_Unknown_DecisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unknown decision.`)
};

export const api_commercial_withdrew_activity = /** @type {(inputs: Api_Commercial_Withdrew_ActivityInputs) => LocalizedString} */ (i) => {
	if (i?.approval === "yes") return /** @type {LocalizedString} */ (`${i?.name} withdrew their approval of “${i?.title}”. It is waiting for a decision again.`);
	return /** @type {LocalizedString} */ (`${i?.name} withdrew their return of “${i?.title}”. It is waiting for a decision again.`)
};

export const api_commercial_wrong_part = /** @type {(inputs: Api_Commercial_Wrong_PartInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Wrong brand / part: ${i?.brand} ${i?.partNo} only`)
};

export const api_commercial_your_offer = /** @type {(inputs: Api_Commercial_Your_OfferInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Your offer: ${i?.offered}. ${i?.detail}`)
};

export const api_control_room_ack_sub = /** @type {(inputs: Api_Control_Room_Ack_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Median minutes to acknowledge an RFQ. Automation live since 6 Oct`)
};

export const api_control_room_ack_title = /** @type {(inputs: Api_Control_Room_Ack_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Acknowledgement time`)
};

export const api_control_room_actual = /** @type {(inputs: Api_Control_Room_ActualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Actual`)
};

export const api_control_room_after_hours = /** @type {(inputs: Api_Control_Room_After_HoursInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Out-of-hours RFQs`)
};

export const api_control_room_after_hours_sub = /** @type {(inputs: Api_Control_Room_After_Hours_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`RFQs outside Sun–Thu 08:00–17:00, routed to the on-duty person`)
};

export const api_control_room_after_hours_title = /** @type {(inputs: Api_Control_Room_After_Hours_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Out-of-hours requests`)
};

export const api_control_room_ageing_sub = /** @type {(inputs: Api_Control_Room_Ageing_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All customers, by days past due`)
};

export const api_control_room_ageing_title = /** @type {(inputs: Api_Control_Room_Ageing_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receivables ageing`)
};

export const api_control_room_avg_time_to_quote = /** @type {(inputs: Api_Control_Room_Avg_Time_To_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Avg time to quote`)
};

export const api_control_room_blocked_or_urgent = /** @type {(inputs: Api_Control_Room_Blocked_Or_UrgentInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} blocked or urgent`)
};

export const api_control_room_cash_sub = /** @type {(inputs: Api_Control_Room_Cash_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expected customer receipts and committed supplier payments, next 8 weeks`)
};

export const api_control_room_cash_title = /** @type {(inputs: Api_Control_Room_Cash_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cash in vs cash out`)
};

export const api_control_room_conversion = /** @type {(inputs: Api_Control_Room_ConversionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Conversion`)
};

export const api_control_room_conversion_sub = /** @type {(inputs: Api_Control_Room_Conversion_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Value of POs ÷ value quoted, by month the RFQ arrived (November still open)`)
};

export const api_control_room_conversion_title = /** @type {(inputs: Api_Control_Room_Conversion_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Conversion by value`)
};

export const api_control_room_days = /** @type {(inputs: Api_Control_Room_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} d`)
};

export const api_control_room_deliveries_sub = /** @type {(inputs: Api_Control_Room_Deliveries_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deliveries to vessels per week`)
};

export const api_control_room_deliveries_title = /** @type {(inputs: Api_Control_Room_Deliveries_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deliveries by outcome`)
};

export const api_control_room_delivery_sub = /** @type {(inputs: Api_Control_Room_Delivery_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Who delivers on time, and how fast they answer`)
};

export const api_control_room_delivery_title = /** @type {(inputs: Api_Control_Room_Delivery_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delivery & suppliers`)
};

export const api_control_room_expected_at_quotation = /** @type {(inputs: Api_Control_Room_Expected_At_QuotationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expected at quotation`)
};

export const api_control_room_funnel_sub = /** @type {(inputs: Api_Control_Room_Funnel_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Last 90 days, each step counted once`)
};

export const api_control_room_funnel_title = /** @type {(inputs: Api_Control_Room_Funnel_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Conversion funnel`)
};

export const api_control_room_gp_note = /** @type {(inputs: Api_Control_Room_Gp_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`actual so far · ${i?.expected} expected at quotation`)
};

export const api_control_room_gp_sub = /** @type {(inputs: Api_Control_Room_Gp_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Actual replaces estimates as costs are billed (November in progress)`)
};

export const api_control_room_gp_title = /** @type {(inputs: Api_Control_Room_Gp_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gross profit: expected vs actual`)
};

export const api_control_room_gross_profit_month = /** @type {(inputs: Api_Control_Room_Gross_Profit_MonthInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Gross profit ${i?.month}`)
};

export const api_control_room_inquiries = /** @type {(inputs: Api_Control_Room_InquiriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inquiries`)
};

export const api_control_room_inquiries_chart_sub = /** @type {(inputs: Api_Control_Room_Inquiries_Chart_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`RFQ cases per week of receipt`)
};

export const api_control_room_inquiries_chart_title = /** @type {(inputs: Api_Control_Room_Inquiries_Chart_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inquiries, quotes and wins`)
};

export const api_control_room_last_12_weeks = /** @type {(inputs: Api_Control_Room_Last_12_WeeksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Last 12 weeks`)
};

export const api_control_room_last_4_weeks = /** @type {(inputs: Api_Control_Room_Last_4_WeeksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Last 4 weeks`)
};

export const api_control_room_last_6_months = /** @type {(inputs: Api_Control_Room_Last_6_MonthsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Last 6 months`)
};

export const api_control_room_lost_sub = /** @type {(inputs: Api_Control_Room_Lost_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lost cases by recorded reason, last 90 days`)
};

export const api_control_room_lost_title = /** @type {(inputs: Api_Control_Room_Lost_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Why we lose`)
};

export const api_control_room_margin_source_sub = /** @type {(inputs: Api_Control_Room_Margin_Source_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gross margin, last 90 days · minimum 15%`)
};

export const api_control_room_margin_source_title = /** @type {(inputs: Api_Control_Room_Margin_Source_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Margin by source`)
};

export const api_control_room_margin_store_sub = /** @type {(inputs: Api_Control_Room_Margin_Store_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Actual gross margin, last 90 days · minimum 15%`)
};

export const api_control_room_margin_store_title = /** @type {(inputs: Api_Control_Room_Margin_Store_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Margin by store`)
};

export const api_control_room_median_days = /** @type {(inputs: Api_Control_Room_Median_DaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Median days`)
};

export const api_control_room_minutes = /** @type {(inputs: Api_Control_Room_MinutesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Minutes`)
};

export const api_control_room_money_sub = /** @type {(inputs: Api_Control_Room_Money_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Management and finance only`)
};

export const api_control_room_money_title = /** @type {(inputs: Api_Control_Room_Money_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Profit & cash`)
};

export const api_control_room_nothing_over_30_days = /** @type {(inputs: Api_Control_Room_Nothing_Over_30_DaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`nothing over 30 days`)
};

export const api_control_room_open_invoices = /** @type {(inputs: Api_Control_Room_Open_InvoicesInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} open invoice`);
	return /** @type {LocalizedString} */ (`${i?.count} open invoices`)
};

export const api_control_room_open_rfqs = /** @type {(inputs: Api_Control_Room_Open_RfqsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open RFQs`)
};

export const api_control_room_over_30_days = /** @type {(inputs: Api_Control_Room_Over_30_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} over 30 days`)
};

export const api_control_room_overdue_of = /** @type {(inputs: Api_Control_Room_Overdue_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.overdue} of ${i?.total} overdue`)
};

export const api_control_room_payments = /** @type {(inputs: Api_Control_Room_PaymentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payments`)
};

export const api_control_room_pipeline_sub = /** @type {(inputs: Api_Control_Room_Pipeline_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inquiries to wins, and why we lose`)
};

export const api_control_room_pipeline_title = /** @type {(inputs: Api_Control_Room_Pipeline_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pipeline & conversion`)
};

export const api_control_room_quoted = /** @type {(inputs: Api_Control_Room_QuotedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quoted`)
};

export const api_control_room_receipts = /** @type {(inputs: Api_Control_Room_ReceiptsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receipts`)
};

export const api_control_room_receivables = /** @type {(inputs: Api_Control_Room_ReceivablesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receivables`)
};

export const api_control_room_receivables_customer_sub = /** @type {(inputs: Api_Control_Room_Receivables_Customer_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open balances, all ages`)
};

export const api_control_room_receivables_customer_title = /** @type {(inputs: Api_Control_Room_Receivables_Customer_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receivables by customer`)
};

export const api_control_room_receivables_open = /** @type {(inputs: Api_Control_Room_Receivables_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receivables open`)
};

export const api_control_room_rfqs_without_reply = /** @type {(inputs: Api_Control_Room_Rfqs_Without_ReplyInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} supplier RFQ without a full reply`);
	return /** @type {LocalizedString} */ (`${i?.count} supplier RFQs without a full reply`)
};

export const api_control_room_sales_source_sub = /** @type {(inputs: Api_Control_Room_Sales_Source_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Agency pricelists and own stock carry more margin than buying to order`)
};

export const api_control_room_sales_source_title = /** @type {(inputs: Api_Control_Room_Sales_Source_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sales by source`)
};

export const api_control_room_speed_sub = /** @type {(inputs: Api_Control_Room_Speed_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`How fast we answer, and who carries the load`)
};

export const api_control_room_speed_title = /** @type {(inputs: Api_Control_Room_Speed_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Speed & workload`)
};

export const api_control_room_target_1_day = /** @type {(inputs: Api_Control_Room_Target_1_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Target 1 d`)
};

export const api_control_room_target_35 = /** @type {(inputs: Api_Control_Room_Target_35Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Target 35%`)
};

export const api_control_room_thousands = /** @type {(inputs: Api_Control_Room_ThousandsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.currency} ${i?.n}k`)
};

export const api_control_room_turnaround_note = /** @type {(inputs: Api_Control_Room_Turnaround_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`was ${i?.was} d in September · target 1 d`)
};

export const api_control_room_turnaround_sub = /** @type {(inputs: Api_Control_Room_Turnaround_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Median days from RFQ received to quote sent`)
};

export const api_control_room_turnaround_title = /** @type {(inputs: Api_Control_Room_Turnaround_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quote turnaround`)
};

export const api_control_room_value_won = /** @type {(inputs: Api_Control_Room_Value_WonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Value won`)
};

export const api_control_room_value_won_sub = /** @type {(inputs: Api_Control_Room_Value_Won_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer POs incl. partial awards`)
};

export const api_control_room_value_won_title = /** @type {(inputs: Api_Control_Room_Value_Won_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Value won per month`)
};

export const api_control_room_waiting_on_suppliers = /** @type {(inputs: Api_Control_Room_Waiting_On_SuppliersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Waiting on suppliers`)
};

export const api_control_room_win_rate = /** @type {(inputs: Api_Control_Room_Win_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Win rate`)
};

export const api_control_room_won = /** @type {(inputs: Api_Control_Room_WonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Won`)
};

export const api_control_room_won_of_quoted = /** @type {(inputs: Api_Control_Room_Won_Of_QuotedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.won} won of ${i?.quoted} quoted, ${i?.period}`)
};

export const api_growth_crm_activity = /** @type {(inputs: Api_Growth_Crm_ActivityInputs) => LocalizedString} */ (i) => {
	if (i?.hasNote === "yes" && i?.hasNext === "yes") return /** @type {LocalizedString} */ (`${i?.name}: ${i?.result} (${i?.note}). Next: ${i?.step} (${i?.due}).`);
	if (i?.hasNote === "yes") return /** @type {LocalizedString} */ (`${i?.name}: ${i?.result} (${i?.note}). Stage: ${i?.stage}.`);
	if (i?.hasNext === "yes") return /** @type {LocalizedString} */ (`${i?.name}: ${i?.result}. Next: ${i?.step} (${i?.due}).`);
	return /** @type {LocalizedString} */ (`${i?.name}: ${i?.result}. Stage: ${i?.stage}.`)
};

export const api_growth_crm_choose_outcome = /** @type {(inputs: Api_Growth_Crm_Choose_OutcomeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose an outcome.`)
};

export const api_growth_crm_customer_relation = /** @type {(inputs: Api_Growth_Crm_Customer_RelationInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Customer · ${i?.status}`)
};

export const api_growth_crm_next_step_date_invalid = /** @type {(inputs: Api_Growth_Crm_Next_Step_Date_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The next step date isn't a date.`)
};

export const api_growth_crm_opportunity_not_found = /** @type {(inputs: Api_Growth_Crm_Opportunity_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opportunity not found.`)
};

export const api_growth_crm_outcome_planned = /** @type {(inputs: Api_Growth_Crm_Outcome_PlannedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Outcome saved. Next step “${i?.step}” planned for ${i?.due}`)
};

export const api_growth_crm_outcome_stage = /** @type {(inputs: Api_Growth_Crm_Outcome_StageInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Outcome saved. ${i?.name} is now “${i?.stage}”`)
};

export const api_growth_crm_plan_next_step = /** @type {(inputs: Api_Growth_Crm_Plan_Next_StepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Plan the next step and its date (or close the opportunity).`)
};

export const api_growth_crm_prospect_relation = /** @type {(inputs: Api_Growth_Crm_Prospect_RelationInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Prospect · ${i?.stage}`)
};

export const api_growth_crm_task_title = /** @type {(inputs: Api_Growth_Crm_Task_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.step}: ${i?.name}`)
};

export const api_growth_crm_unknown_stage = /** @type {(inputs: Api_Growth_Crm_Unknown_StageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unknown stage.`)
};

export const api_history_age_1_30 = /** @type {(inputs: Api_History_Age_1_30Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`1–30 d`)
};

export const api_history_age_31_60 = /** @type {(inputs: Api_History_Age_31_60Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`31–60 d`)
};

export const api_history_age_60_plus = /** @type {(inputs: Api_History_Age_60_PlusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`60+ d`)
};

export const api_history_agency_pricelist = /** @type {(inputs: Api_History_Agency_PricelistInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Agency pricelist`)
};

export const api_history_awaiting_corrected_offer = /** @type {(inputs: Api_History_Awaiting_Corrected_OfferInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Awaiting corrected offer`)
};

export const api_history_awaiting_customer_decision = /** @type {(inputs: Api_History_Awaiting_Customer_DecisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Awaiting customer decision`)
};

export const api_history_awaiting_delivery_or_payment = /** @type {(inputs: Api_History_Awaiting_Delivery_Or_PaymentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Awaiting delivery or payment`)
};

export const api_history_awaiting_internal_approval = /** @type {(inputs: Api_History_Awaiting_Internal_ApprovalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Awaiting internal approval`)
};

export const api_history_awaiting_supplier = /** @type {(inputs: Api_History_Awaiting_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Awaiting supplier`)
};

export const api_history_bought_to_order = /** @type {(inputs: Api_History_Bought_To_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bought to order`)
};

export const api_history_cabin_stores = /** @type {(inputs: Api_History_Cabin_StoresInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cabin stores`)
};

export const api_history_cancelled = /** @type {(inputs: Api_History_CancelledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cancelled`)
};

export const api_history_deck_stores = /** @type {(inputs: Api_History_Deck_StoresInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deck stores`)
};

export const api_history_electrical_stores = /** @type {(inputs: Api_History_Electrical_StoresInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Electrical stores`)
};

export const api_history_engine_stores = /** @type {(inputs: Api_History_Engine_StoresInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Engine stores`)
};

export const api_history_inquiries_received = /** @type {(inputs: Api_History_Inquiries_ReceivedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inquiries received`)
};

export const api_history_late = /** @type {(inputs: Api_History_LateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Late`)
};

export const api_history_late_quote = /** @type {(inputs: Api_History_Late_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Late quote`)
};

export const api_history_lead_time = /** @type {(inputs: Api_History_Lead_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lead time`)
};

export const api_history_no_supplier = /** @type {(inputs: Api_History_No_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No supplier`)
};

export const api_history_not_due = /** @type {(inputs: Api_History_Not_DueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not due`)
};

export const api_history_on_time = /** @type {(inputs: Api_History_On_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`On time`)
};

export const api_history_own_stock = /** @type {(inputs: Api_History_Own_StockInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Own stock`)
};

export const api_history_partial = /** @type {(inputs: Api_History_PartialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Partial`)
};

export const api_history_price = /** @type {(inputs: Api_History_PriceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Price`)
};

export const api_history_provision_stores = /** @type {(inputs: Api_History_Provision_StoresInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Provision stores`)
};

export const api_history_quoted = /** @type {(inputs: Api_History_QuotedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quoted`)
};

export const api_history_safety_stores = /** @type {(inputs: Api_History_Safety_StoresInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Safety stores`)
};

export const api_history_sent_to_suppliers = /** @type {(inputs: Api_History_Sent_To_SuppliersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sent to suppliers`)
};

export const api_history_spare_parts_clearance = /** @type {(inputs: Api_History_Spare_Parts_ClearanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Spare-parts clearance (fees)`)
};

export const api_history_validated = /** @type {(inputs: Api_History_ValidatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validated`)
};

export const api_history_won_full_or_partial = /** @type {(inputs: Api_History_Won_Full_Or_PartialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Won (full or partial)`)
};

export const api_home_4_weeks_ago = /** @type {(inputs: Api_Home_4_Weeks_AgoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`4 weeks ago`)
};

export const api_home_ack_sub = /** @type {(inputs: Api_Home_Ack_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Median minutes · automatic acknowledgement went live 6 Oct`)
};

export const api_home_ack_title = /** @type {(inputs: Api_Home_Ack_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Time to acknowledge an RFQ`)
};

export const api_home_actual = /** @type {(inputs: Api_Home_ActualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Actual`)
};

export const api_home_after_hours_sub = /** @type {(inputs: Api_Home_After_Hours_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`RFQs outside Sun–Thu 08:00–17:00, routed to the on-call person`)
};

export const api_home_after_hours_title = /** @type {(inputs: Api_Home_After_Hours_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Out-of-hours requests`)
};

export const api_home_all_cases = /** @type {(inputs: Api_Home_All_CasesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All cases`)
};

export const api_home_all_live_cases = /** @type {(inputs: Api_Home_All_Live_CasesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All live cases`)
};

export const api_home_amount_vs = /** @type {(inputs: Api_Home_Amount_VsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} vs ${i?.than}`)
};

export const api_home_approvals_in_queue = /** @type {(inputs: Api_Home_Approvals_In_QueueInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("en", i?.n, {}, true);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`${i?.n} approval in the queue`);
	return /** @type {LocalizedString} */ (`${i?.n} approvals in the queue`)
};

export const api_home_arrives = /** @type {(inputs: Api_Home_ArrivesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.vessel} arrives`)
};

export const api_home_arrives_when = /** @type {(inputs: Api_Home_Arrives_WhenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.vessel} arrives ${i?.when}`)
};

export const api_home_awaiting_customer = /** @type {(inputs: Api_Home_Awaiting_CustomerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} awaiting the customer`)
};

export const api_home_bill_due = /** @type {(inputs: Api_Home_Bill_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier}: bill due`)
};

export const api_home_billed_so_far = /** @type {(inputs: Api_Home_Billed_So_FarInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n}k billed so far`)
};

export const api_home_bills_to_match = /** @type {(inputs: Api_Home_Bills_To_MatchInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("en", i?.n, {}, true);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`${i?.n} bill to match`);
	return /** @type {LocalizedString} */ (`${i?.n} bills to match`)
};

export const api_home_briefing_sub = /** @type {(inputs: Api_Home_Briefing_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prepared at 07:00 from your cases, inbox and integrations`)
};

export const api_home_cases_in_queue = /** @type {(inputs: Api_Home_Cases_In_QueueInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("en", i?.n, {}, true);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`${i?.n} case in your queue`);
	return /** @type {LocalizedString} */ (`${i?.n} cases in your queue`)
};

export const api_home_cash_sub = /** @type {(inputs: Api_Home_Cash_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expected customer receipts and committed supplier payments, EGP thousands`)
};

export const api_home_cash_title = /** @type {(inputs: Api_Home_Cash_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cash in vs cash out, next 8 weeks`)
};

export const api_home_commitment_blocked = /** @type {(inputs: Api_Home_Commitment_BlockedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Commitment blocked until the PO matches the approved quote.`)
};

export const api_home_continue = /** @type {(inputs: Api_Home_ContinueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Continue ${i?.caseId}`)
};

export const api_home_daily_briefing = /** @type {(inputs: Api_Home_Daily_BriefingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Daily briefing`)
};

export const api_home_days = /** @type {(inputs: Api_Home_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} d`)
};

export const api_home_decisions_waiting = /** @type {(inputs: Api_Home_Decisions_WaitingInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("en", i?.n, {}, true);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`${i?.n} decision waiting`);
	return /** @type {LocalizedString} */ (`${i?.n} decisions waiting`)
};

export const api_home_deliveries = /** @type {(inputs: Api_Home_DeliveriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deliveries`)
};

export const api_home_deliveries_in_progress = /** @type {(inputs: Api_Home_Deliveries_In_ProgressInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("en", i?.n, {}, true);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`${i?.n} delivery in progress`);
	return /** @type {LocalizedString} */ (`${i?.n} deliveries in progress`)
};

export const api_home_deliveries_in_progress_label = /** @type {(inputs: Api_Home_Deliveries_In_Progress_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deliveries in progress`)
};

export const api_home_drop_leaves = /** @type {(inputs: Api_Home_Drop_LeavesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Drop ${i?.number} leaves`)
};

export const api_home_expected = /** @type {(inputs: Api_Home_ExpectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expected`)
};

export const api_home_expected_gp_nov = /** @type {(inputs: Api_Home_Expected_Gp_NovInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expected gross profit, Nov`)
};

export const api_home_follow_ups = /** @type {(inputs: Api_Home_Follow_UpsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Follow-ups`)
};

export const api_home_follow_ups_due_today = /** @type {(inputs: Api_Home_Follow_Ups_Due_TodayInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("en", i?.n, {}, true);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`${i?.n} follow-up due today`);
	return /** @type {LocalizedString} */ (`${i?.n} follow-ups due today`)
};

export const api_home_follow_ups_today = /** @type {(inputs: Api_Home_Follow_Ups_TodayInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("en", i?.n, {}, true);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`${i?.n} follow-up today`);
	return /** @type {LocalizedString} */ (`${i?.n} follow-ups today`)
};

export const api_home_good_morning = /** @type {(inputs: Api_Home_Good_MorningInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Good morning, ${i?.name}`)
};

export const api_home_gp_sub = /** @type {(inputs: Api_Home_Gp_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`EGP thousands · actual replaces estimates as costs are billed (Nov in progress)`)
};

export const api_home_gp_title = /** @type {(inputs: Api_Home_Gp_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gross profit: expected vs actual`)
};

export const api_home_in_out = /** @type {(inputs: Api_Home_In_OutInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`in ${i?.in}k · out ${i?.out}k`)
};

export const api_home_inquiries = /** @type {(inputs: Api_Home_InquiriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inquiries`)
};

export const api_home_inquiries_4_weeks = /** @type {(inputs: Api_Home_Inquiries_4_WeeksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inquiries, last 4 weeks`)
};

export const api_home_integration_exceptions = /** @type {(inputs: Api_Home_Integration_ExceptionsInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("en", i?.n, {}, true);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`${i?.n} integration exception`);
	return /** @type {LocalizedString} */ (`${i?.n} integration exceptions`)
};

export const api_home_invoice_due = /** @type {(inputs: Api_Home_Invoice_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.customer}: ${i?.amount} due ${i?.day}`)
};

export const api_home_invoice_due_short = /** @type {(inputs: Api_Home_Invoice_Due_ShortInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.customer}: invoice due`)
};

export const api_home_invoice_overdue = /** @type {(inputs: Api_Home_Invoice_OverdueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.customer}: ${i?.amount} overdue since ${i?.day}`)
};

export const api_home_invoice_sub = /** @type {(inputs: Api_Home_Invoice_SubInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} · ${i?.status} · collection reminder drafted`)
};

export const api_home_invoice_sub_paid = /** @type {(inputs: Api_Home_Invoice_Sub_PaidInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} · ${i?.status} · ${i?.paid} received · collection reminder drafted`)
};

export const api_home_invoices = /** @type {(inputs: Api_Home_InvoicesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoices`)
};

export const api_home_items_awaiting_approval = /** @type {(inputs: Api_Home_Items_Awaiting_ApprovalInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} item awaiting approval`);
	return /** @type {LocalizedString} */ (`${i?.count} items awaiting approval`)
};

export const api_home_k_past_due = /** @type {(inputs: Api_Home_K_Past_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n}k past due`)
};

export const api_home_last_week = /** @type {(inputs: Api_Home_Last_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`last week`)
};

export const api_home_later_this_week = /** @type {(inputs: Api_Home_Later_This_WeekInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} later this week`)
};

export const api_home_live_cases = /** @type {(inputs: Api_Home_Live_CasesInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("en", i?.n, {}, true);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`${i?.n} live case`);
	return /** @type {LocalizedString} */ (`${i?.n} live cases`)
};

export const api_home_lost_cases = /** @type {(inputs: Api_Home_Lost_CasesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lost cases`)
};

export const api_home_lost_sub = /** @type {(inputs: Api_Home_Lost_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lost cases by recorded reason, last 90 days`)
};

export const api_home_lost_title = /** @type {(inputs: Api_Home_Lost_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Why we lose`)
};

export const api_home_median_days = /** @type {(inputs: Api_Home_Median_DaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Median days`)
};

export const api_home_median_new_rfqs = /** @type {(inputs: Api_Home_Median_New_RfqsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`median, new RFQs`)
};

export const api_home_median_target = /** @type {(inputs: Api_Home_Median_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`median · target 1 d`)
};

export const api_home_messages_to_triage = /** @type {(inputs: Api_Home_Messages_To_TriageInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("en", i?.n, {}, true);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`${i?.n} message to triage`);
	return /** @type {LocalizedString} */ (`${i?.n} messages to triage`)
};

export const api_home_minutes = /** @type {(inputs: Api_Home_MinutesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} min`)
};

export const api_home_minutes_series = /** @type {(inputs: Api_Home_Minutes_SeriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Minutes`)
};

export const api_home_my_day = /** @type {(inputs: Api_Home_My_DayInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`My day · ${i?.date}`)
};

export const api_home_my_turnaround = /** @type {(inputs: Api_Home_My_TurnaroundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`My quote turnaround`)
};

export const api_home_my_turnaround_sub = /** @type {(inputs: Api_Home_My_Turnaround_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Median days, last 8 weeks`)
};

export const api_home_n_today = /** @type {(inputs: Api_Home_N_TodayInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} today`)
};

export const api_home_net_cash = /** @type {(inputs: Api_Home_Net_CashInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Net cash, next 8 weeks`)
};

export const api_home_new_case = /** @type {(inputs: Api_Home_New_CaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New case`)
};

export const api_home_new_messages = /** @type {(inputs: Api_Home_New_MessagesInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} new message in the inbox`);
	return /** @type {LocalizedString} */ (`${i?.count} new messages in the inbox`)
};

export const api_home_next_up = /** @type {(inputs: Api_Home_Next_UpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next up`)
};

export const api_home_no_change = /** @type {(inputs: Api_Home_No_ChangeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`no change`)
};

export const api_home_nothing_due_today = /** @type {(inputs: Api_Home_Nothing_Due_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing due today`)
};

export const api_home_nothing_due_week = /** @type {(inputs: Api_Home_Nothing_Due_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing due this week.`)
};

export const api_home_nothing_needs_you = /** @type {(inputs: Api_Home_Nothing_Needs_YouInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing needs you this morning.`)
};

export const api_home_open_approvals = /** @type {(inputs: Api_Home_Open_ApprovalsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open approvals`)
};

export const api_home_out_of_hours_rfqs = /** @type {(inputs: Api_Home_Out_Of_Hours_RfqsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Out-of-hours RFQs`)
};

export const api_home_payments = /** @type {(inputs: Api_Home_PaymentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payments`)
};

export const api_home_pipeline = /** @type {(inputs: Api_Home_PipelineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pipeline`)
};

export const api_home_pipeline_steps_week = /** @type {(inputs: Api_Home_Pipeline_Steps_WeekInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("en", i?.n, {}, true);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`${i?.n} pipeline step this week`);
	return /** @type {LocalizedString} */ (`${i?.n} pipeline steps this week`)
};

export const api_home_pipeline_sub = /** @type {(inputs: Api_Home_Pipeline_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`RFQ cases per week of receipt, last 12 weeks`)
};

export const api_home_pipeline_title = /** @type {(inputs: Api_Home_Pipeline_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inquiries, quotes and wins`)
};

export const api_home_po_mismatch = /** @type {(inputs: Api_Home_Po_MismatchInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Customer PO mismatch on ${i?.caseId}`)
};

export const api_home_quote_due = /** @type {(inputs: Api_Home_Quote_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.vessel}: quote due`)
};

export const api_home_quote_due_when = /** @type {(inputs: Api_Home_Quote_Due_WhenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.vessel} quote due ${i?.when}`)
};

export const api_home_quote_late = /** @type {(inputs: Api_Home_Quote_LateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.vessel} quote ${i?.when}`)
};

export const api_home_quote_turnaround = /** @type {(inputs: Api_Home_Quote_TurnaroundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quote turnaround`)
};

export const api_home_quoted = /** @type {(inputs: Api_Home_QuotedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quoted`)
};

export const api_home_quotes_due_tomorrow = /** @type {(inputs: Api_Home_Quotes_Due_TomorrowInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("en", i?.n, {}, true);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`${i?.n} quote due by tomorrow`);
	return /** @type {LocalizedString} */ (`${i?.n} quotes due by tomorrow`)
};

export const api_home_receipts = /** @type {(inputs: Api_Home_ReceiptsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receipts`)
};

export const api_home_receivables = /** @type {(inputs: Api_Home_ReceivablesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receivables`)
};

export const api_home_receivables_by_age = /** @type {(inputs: Api_Home_Receivables_By_AgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receivables by age`)
};

export const api_home_reminder_drafted = /** @type {(inputs: Api_Home_Reminder_DraftedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`reminder drafted`)
};

export const api_home_reply_due = /** @type {(inputs: Api_Home_Reply_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier}: reply due`)
};

export const api_home_review_inbox = /** @type {(inputs: Api_Home_Review_InboxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Review inbox`)
};

export const api_home_rfqs = /** @type {(inputs: Api_Home_RfqsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`RFQs`)
};

export const api_home_rfqs_awaiting_reply = /** @type {(inputs: Api_Home_Rfqs_Awaiting_ReplyInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("en", i?.n, {}, true);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`${i?.n} supplier RFQ awaiting reply`);
	return /** @type {LocalizedString} */ (`${i?.n} supplier RFQs awaiting reply`)
};

export const api_home_safe_retry = /** @type {(inputs: Api_Home_Safe_RetryInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.impact} · safe retry available`)
};

export const api_home_same_as = /** @type {(inputs: Api_Home_Same_AsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`same as ${i?.than}`)
};

export const api_home_supplier_bills = /** @type {(inputs: Api_Home_Supplier_BillsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier bills`)
};

export const api_home_supplier_bills_open = /** @type {(inputs: Api_Home_Supplier_Bills_OpenInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("en", i?.n, {}, true);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`${i?.n} supplier bill open`);
	return /** @type {LocalizedString} */ (`${i?.n} supplier bills open`)
};

export const api_home_supplier_replies_outstanding = /** @type {(inputs: Api_Home_Supplier_Replies_OutstandingInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("en", i?.n, {}, true);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`${i?.n} supplier reply outstanding`);
	return /** @type {LocalizedString} */ (`${i?.n} supplier replies outstanding`)
};

export const api_home_supplier_silent = /** @type {(inputs: Api_Home_Supplier_SilentInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} hasn't replied`)
};

export const api_home_target_1_day = /** @type {(inputs: Api_Home_Target_1_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Target 1 d`)
};

export const api_home_this_week_vs_last = /** @type {(inputs: Api_Home_This_Week_Vs_LastInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`this week, vs last week`)
};

export const api_home_thousands = /** @type {(inputs: Api_Home_ThousandsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.currency} ${i?.n}k`)
};

export const api_home_time_to_acknowledge = /** @type {(inputs: Api_Home_Time_To_AcknowledgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Time to acknowledge`)
};

export const api_home_today = /** @type {(inputs: Api_Home_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Today`)
};

export const api_home_turnaround_sub = /** @type {(inputs: Api_Home_Turnaround_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Median days from RFQ received to quote sent`)
};

export const api_home_turnaround_title = /** @type {(inputs: Api_Home_Turnaround_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quotation turnaround`)
};

export const api_home_usd_past_due = /** @type {(inputs: Api_Home_Usd_Past_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`USD ${i?.n}k past due`)
};

export const api_home_usd_thousands_all = /** @type {(inputs: Api_Home_Usd_Thousands_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`USD thousands, all customers`)
};

export const api_home_value_won = /** @type {(inputs: Api_Home_Value_WonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Value won`)
};

export const api_home_value_won_sub = /** @type {(inputs: Api_Home_Value_Won_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer POs incl. partial awards, USD thousands`)
};

export const api_home_value_won_title = /** @type {(inputs: Api_Home_Value_Won_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Value won per month`)
};

export const api_home_vs_prior_4_weeks = /** @type {(inputs: Api_Home_Vs_Prior_4_WeeksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`vs prior 4 weeks`)
};

export const api_home_was_due = /** @type {(inputs: Api_Home_Was_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.reference} was due ${i?.when} · ${i?.last}`)
};

export const api_home_won = /** @type {(inputs: Api_Home_WonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Won`)
};

export const api_home_won_4_weeks = /** @type {(inputs: Api_Home_Won_4_WeeksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Won, last 4 weeks`)
};

export const api_insights_shared_days_overdue = /** @type {(inputs: Api_Insights_Shared_Days_OverdueInputs) => LocalizedString} */ (i) => {
	const daysPlural = __paraglideRegistry.plural("en", i?.days, {}, true);
	if (daysPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.days, {})} day overdue`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.days, {})} days overdue`)
};

export const api_insights_shared_in_days = /** @type {(inputs: Api_Insights_Shared_In_DaysInputs) => LocalizedString} */ (i) => {
	const daysPlural = __paraglideRegistry.plural("en", i?.days, {}, true);
	if (daysPlural === "one") return /** @type {LocalizedString} */ (`in ${__paraglideRegistry.icuPound("en", i?.days, {})} day`);
	return /** @type {LocalizedString} */ (`in ${__paraglideRegistry.icuPound("en", i?.days, {})} days`)
};

export const api_insights_shared_not_allowed = /** @type {(inputs: Api_Insights_Shared_Not_AllowedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`You are not allowed to perform this action.`)
};

export const api_insights_shared_overdue_since = /** @type {(inputs: Api_Insights_Shared_Overdue_SinceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`overdue since ${i?.time}`)
};

export const api_insights_shared_today = /** @type {(inputs: Api_Insights_Shared_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`today`)
};

export const api_insights_shared_today_at = /** @type {(inputs: Api_Insights_Shared_Today_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`today ${i?.time}`)
};

export const api_insights_shared_tomorrow = /** @type {(inputs: Api_Insights_Shared_TomorrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`tomorrow`)
};

export const api_insights_shared_tomorrow_at = /** @type {(inputs: Api_Insights_Shared_Tomorrow_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`tomorrow ${i?.time}`)
};

export const api_operations_already_accepted = /** @type {(inputs: Api_Operations_Already_AcceptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Already accepted, so not resubmitted.`)
};

export const api_operations_amend_activity = /** @type {(inputs: Api_Operations_Amend_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`PO ${i?.number} line ${i?.line} (${i?.field}): ${i?.resolution}. Evidence attached.`)
};

export const api_operations_as_quoted = /** @type {(inputs: Api_Operations_As_QuotedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`As quoted`)
};

export const api_operations_attach_confirmation = /** @type {(inputs: Api_Operations_Attach_ConfirmationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Attach the customer's written confirmation (email or signed amendment).`)
};

export const api_operations_award_undo_activity = /** @type {(inputs: Api_Operations_Award_Undo_ActivityInputs) => LocalizedString} */ (i) => {
	if (i?.hasWas === "yes") return /** @type {LocalizedString} */ (`Line ${i?.line}: “${i?.outcome}” taken back, back to ${i?.was}.`);
	return /** @type {LocalizedString} */ (`Line ${i?.line}: “${i?.outcome}” taken back, undecided again.`)
};

export const api_operations_back_to_undecided = /** @type {(inputs: Api_Operations_Back_To_UndecidedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A line goes back to undecided or kept open.`)
};

export const api_operations_case_not_found = /** @type {(inputs: Api_Operations_Case_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Case not found.`)
};

export const api_operations_closing_needs_reason = /** @type {(inputs: Api_Operations_Closing_Needs_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Closing an unawarded line needs a reason.`)
};

export const api_operations_commitment_blocked = /** @type {(inputs: Api_Operations_Commitment_BlockedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Commitment blocked`)
};

export const api_operations_commitment_blocked_by = /** @type {(inputs: Api_Operations_Commitment_Blocked_ByInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Commitment blocked: ${i?.n} PO mismatch(es) need written customer agreement.`)
};

export const api_operations_confirm_and_prepare = /** @type {(inputs: Api_Operations_Confirm_And_PrepareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirm the sales order & prepare supplier POs`)
};

export const api_operations_confirm_sales_order = /** @type {(inputs: Api_Operations_Confirm_Sales_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirm the sales order`)
};

export const api_operations_confirmed_by_phone = /** @type {(inputs: Api_Operations_Confirmed_By_PhoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirmed by phone`)
};

export const api_operations_costs_hidden_sales = /** @type {(inputs: Api_Operations_Costs_Hidden_SalesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier costs are not visible to Sales.`)
};

export const api_operations_customer_po_not_found = /** @type {(inputs: Api_Operations_Customer_Po_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer PO not found.`)
};

export const api_operations_decided_again = /** @type {(inputs: Api_Operations_Decided_AgainInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Line ${i?.line} has been decided again since, so there is nothing to take back.`)
};

export const api_operations_decision_stands = /** @type {(inputs: Api_Operations_Decision_StandsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The sales order is confirmed and its supplier POs are prepared, so the line's decision stands.`)
};

export const api_operations_delivered_activity = /** @type {(inputs: Api_Operations_Delivered_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} delivered. Signed by ${i?.signedBy}; signed delivery note attached.`)
};

export const api_operations_delivery_not_found = /** @type {(inputs: Api_Operations_Delivery_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delivery not found.`)
};

export const api_operations_describe_agreement = /** @type {(inputs: Api_Operations_Describe_AgreementInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Describe the customer's written agreement (who, when, what).`)
};

export const api_operations_drop_delivered = /** @type {(inputs: Api_Operations_Drop_DeliveredInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Drop ${i?.done} of ${i?.total} delivered. Invoice ${i?.number}: delivered quantities only`)
};

export const api_operations_einvoice_submitted = /** @type {(inputs: Api_Operations_Einvoice_SubmittedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} signed and submitted.`)
};

export const api_operations_einvoice_submitted_activity = /** @type {(inputs: Api_Operations_Einvoice_Submitted_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`E-invoice ${i?.number} signed and submitted to the tax authority (UUID ${i?.uuid}).`)
};

export const api_operations_einvoice_valid = /** @type {(inputs: Api_Operations_Einvoice_ValidInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Tax authority: ${i?.number} is valid.`)
};

export const api_operations_einvoice_valid_activity = /** @type {(inputs: Api_Operations_Einvoice_Valid_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`E-invoice ${i?.number}: Valid (UUID ${i?.uuid}).`)
};

export const api_operations_einvoices_by_finance = /** @type {(inputs: Api_Operations_Einvoices_By_FinanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`E-invoices are submitted by operations & finance.`)
};

export const api_operations_eta_change_activity = /** @type {(inputs: Api_Operations_Eta_Change_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`ETA change from ${i?.from}: ${i?.was} → ${i?.now}. ${i?.email} Re-planned: ${i?.moved}; owner and management alerted.`)
};

export const api_operations_eta_moved_blocker = /** @type {(inputs: Api_Operations_Eta_Moved_BlockerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`ETA moved ${i?.hours} h by agent: ${i?.n} drop(s) re-planned`)
};

export const api_operations_eta_notification = /** @type {(inputs: Api_Operations_Eta_NotificationInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`ETA change ${i?.caseId}: ${i?.at}`)
};

export const api_operations_eta_notification_detail = /** @type {(inputs: Api_Operations_Eta_Notification_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} drop(s) re-planned. Re-confirm transport.`)
};

export const api_operations_eta_up_to_date = /** @type {(inputs: Api_Operations_Eta_Up_To_DateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ETA already up to date. Nothing re-planned.`)
};

export const api_operations_header = /** @type {(inputs: Api_Operations_HeaderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`header`)
};

export const api_operations_invoice_created_activity = /** @type {(inputs: Api_Operations_Invoice_Created_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Invoice ${i?.number} created from ${i?.delivery}: delivered quantities only (${i?.lines}).`)
};

export const api_operations_invoice_delivered = /** @type {(inputs: Api_Operations_Invoice_DeliveredInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Invoice ${i?.number}: delivered quantities only`)
};

export const api_operations_invoice_not_found = /** @type {(inputs: Api_Operations_Invoice_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoice not found.`)
};

export const api_operations_invoices_by_finance = /** @type {(inputs: Api_Operations_Invoices_By_FinanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoices are issued by operations & finance.`)
};

export const api_operations_keep_or_close = /** @type {(inputs: Api_Operations_Keep_Or_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose to keep the line open or close it.`)
};

export const api_operations_kept_open_again = /** @type {(inputs: Api_Operations_Kept_Open_AgainInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Line ${i?.line} is kept open again`)
};

export const api_operations_launch_boat = /** @type {(inputs: Api_Operations_Launch_BoatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Launch / boat`)
};

export const api_operations_launch_rebooked = /** @type {(inputs: Api_Operations_Launch_RebookedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.launch}, re-booked for ${i?.at}`)
};

export const api_operations_line = /** @type {(inputs: Api_Operations_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Line ${i?.n}`)
};

export const api_operations_line_on_po = /** @type {(inputs: Api_Operations_Line_On_PoInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Line ${i?.line} is on the customer PO, so it can't be kept open or closed.`)
};

export const api_operations_no_changes = /** @type {(inputs: Api_Operations_No_ChangesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`no changes`)
};

export const api_operations_no_customer_po = /** @type {(inputs: Api_Operations_No_Customer_PoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No customer PO on file.`)
};

export const api_operations_no_customer_po_yet = /** @type {(inputs: Api_Operations_No_Customer_Po_YetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No customer PO has been received for this case yet.`)
};

export const api_operations_no_eta_update = /** @type {(inputs: Api_Operations_No_Eta_UpdateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No ETA update from the agent for this case.`)
};

export const api_operations_no_mismatch = /** @type {(inputs: Api_Operations_No_MismatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`That check has no mismatch to resolve.`)
};

export const api_operations_no_order_book = /** @type {(inputs: Api_Operations_No_Order_BookInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No order book for this case.`)
};

export const api_operations_not_awarded_activity = /** @type {(inputs: Api_Operations_Not_Awarded_ActivityInputs) => LocalizedString} */ (i) => {
	if (i?.hasReason === "yes") return /** @type {LocalizedString} */ (`Line ${i?.line} not awarded: ${i?.outcome}. Reason: ${i?.reason}.`);
	return /** @type {LocalizedString} */ (`Line ${i?.line} not awarded: ${i?.outcome}.`)
};

export const api_operations_nothing_open = /** @type {(inputs: Api_Operations_Nothing_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`nothing open`)
};

export const api_operations_only_confirmed_invoiced = /** @type {(inputs: Api_Operations_Only_Confirmed_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Only a delivery confirmed with a signed delivery note can be invoiced.`)
};

export const api_operations_order_confirmed_activity = /** @type {(inputs: Api_Operations_Order_Confirmed_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sales order confirmed against PO ${i?.number}. ${i?.n} supplier PO(s) prepared for re-check and approval.`)
};

export const api_operations_po_not_found = /** @type {(inputs: Api_Operations_Po_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Purchase order not found.`)
};

export const api_operations_po_read_activity = /** @type {(inputs: Api_Operations_Po_Read_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Customer PO ${i?.number} read by AI and checked against ${i?.caseId} quotation: ${i?.open} mismatch(es).`)
};

export const api_operations_recheck_activity = /** @type {(inputs: Api_Operations_Recheck_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Re-check for ${i?.number}: ${i?.changes}.`)
};

export const api_operations_recheck_availability = /** @type {(inputs: Api_Operations_Recheck_AvailabilityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Availability & lead time`)
};

export const api_operations_recheck_first = /** @type {(inputs: Api_Operations_Recheck_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Re-check availability, cost, FX and lead time with the supplier before confirming.`)
};

export const api_operations_recheck_price = /** @type {(inputs: Api_Operations_Recheck_PriceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier price`)
};

export const api_operations_recheck_then_approve = /** @type {(inputs: Api_Operations_Recheck_Then_ApproveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Re-check supplier costs, then approve supplier POs`)
};

export const api_operations_reconfirm_task = /** @type {(inputs: Api_Operations_Reconfirm_TaskInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Re-confirm truck, boarding staff and launch for ${i?.number} (ETA ${i?.hours} h)`)
};

export const api_operations_rejected_tax_id = /** @type {(inputs: Api_Operations_Rejected_Tax_IdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rejected by the tax authority: buyer tax ID.`)
};

export const api_operations_resolve_mismatches = /** @type {(inputs: Api_Operations_Resolve_MismatchesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Resolve ${i?.n} PO mismatches before confirming the sales order`)
};

export const api_operations_sign_in_first = /** @type {(inputs: Api_Operations_Sign_In_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign in first.`)
};

export const api_operations_submit_einvoice = /** @type {(inputs: Api_Operations_Submit_EinvoiceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Submit ${i?.number} to the tax authority (e-invoice)`)
};

export const api_operations_tax_id_error = /** @type {(inputs: Api_Operations_Tax_Id_ErrorInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Buyer tax registration number “${i?.taxId}” not found (9 digits expected). Correct it and resubmit.`)
};

export const api_operations_unchanged = /** @type {(inputs: Api_Operations_UnchangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unchanged`)
};

export const api_operations_undecided_again = /** @type {(inputs: Api_Operations_Undecided_AgainInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Line ${i?.line} is undecided again`)
};

export const api_operations_who_signed = /** @type {(inputs: Api_Operations_Who_SignedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Who signed the delivery note on board?`)
};

export const api_order_to_cash_approval_detail_clean = /** @type {(inputs: Api_Order_To_Cash_Approval_Detail_CleanInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`PO ${i?.number} · re-check done, no changes.`)
};

export const api_order_to_cash_approval_detail_flagged = /** @type {(inputs: Api_Order_To_Cash_Approval_Detail_FlaggedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`PO ${i?.number} · re-check done, changes flagged.`)
};

export const api_order_to_cash_approval_title = /** @type {(inputs: Api_Order_To_Cash_Approval_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Supplier PO ${i?.number} to ${i?.supplier}`)
};

export const api_order_to_cash_duplicate_bill = /** @type {(inputs: Api_Order_To_Cash_Duplicate_BillInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Bill not booked. ${i?.reason}`)
};

export const api_order_to_cash_eta_updated = /** @type {(inputs: Api_Order_To_Cash_Eta_UpdatedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`ETA updated. ${i?.changed} drop(s) re-planned; owner and management alerted.`)
};

export const api_order_to_cash_invoice_created = /** @type {(inputs: Api_Order_To_Cash_Invoice_CreatedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} created from ${i?.delivery}, for delivered quantities only.`)
};

export const api_order_to_cash_invoice_created_from_delivery = /** @type {(inputs: Api_Order_To_Cash_Invoice_Created_From_DeliveryInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} created from the delivery, for delivered quantities only.`)
};

export const api_order_to_cash_no_bill = /** @type {(inputs: Api_Order_To_Cash_No_BillInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No supplier bill to book.`)
};

export const api_order_to_cash_notification_title = /** @type {(inputs: Api_Order_To_Cash_Notification_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Approve supplier PO ${i?.number}`)
};

export const api_order_to_cash_order_confirmed = /** @type {(inputs: Api_Order_To_Cash_Order_ConfirmedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sales order confirmed.`)
};

export const api_order_to_cash_order_confirmed_pos = /** @type {(inputs: Api_Order_To_Cash_Order_Confirmed_PosInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sales order confirmed · supplier POs ${i?.pos} prepared for re-check & approval.`)
};

export const api_order_to_cash_po_checked = /** @type {(inputs: Api_Order_To_Cash_Po_CheckedInputs) => LocalizedString} */ (i) => {
	const openPluralExact = i?.open;
	if (i?.created === "yes" && (openPluralExact === 0 || openPluralExact === "0")) return /** @type {LocalizedString} */ (`Customer PO read and checked: all lines match.`);
	if (i?.created === "yes") return /** @type {LocalizedString} */ (`Customer PO read and checked: ${i?.open} mismatch(es) block commitment.`);
	if ((openPluralExact === 0 || openPluralExact === "0")) return /** @type {LocalizedString} */ (`PO re-checked: all lines match.`);
	return /** @type {LocalizedString} */ (`PO re-checked: ${i?.open} mismatch(es) block commitment.`)
};

export const api_order_to_cash_po_not_found = /** @type {(inputs: Api_Order_To_Cash_Po_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Purchase order not found.`)
};

export const api_platform_acc_1 = /** @type {(inputs: Api_Platform_Acc_1Inputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.caseId}: ${i?.lines} lines, owner set, acknowledgement logged once`)
};

export const api_platform_acc_10_open = /** @type {(inputs: Api_Platform_Acc_10_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`GS-RFQ-0131 closes once its balance is collected`)
};

export const api_platform_acc_10_settled = /** @type {(inputs: Api_Platform_Acc_10_SettledInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.caseId} closed and settled`)
};

export const api_platform_acc_2 = /** @type {(inputs: Api_Platform_Acc_2Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deviation alert logged; revised offer received as a new version`)
};

export const api_platform_acc_3 = /** @type {(inputs: Api_Platform_Acc_3Inputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Line 3: ${i?.qty} × ${i?.pack} L = ${i?.total} L`)
};

export const api_platform_acc_4 = /** @type {(inputs: Api_Platform_Acc_4Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Atlas Tankers: do not chase · internal reminder only`)
};

export const api_platform_acc_5 = /** @type {(inputs: Api_Platform_Acc_5Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`GS-RFQ-0136: PO mismatch blocks the sales order`)
};

export const api_platform_acc_6 = /** @type {(inputs: Api_Platform_Acc_6Inputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`GS-RFQ-0133: ${i?.count} deliveries on one order`)
};

export const api_platform_acc_7 = /** @type {(inputs: Api_Platform_Acc_7Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deposit waits for approval; GS-RFQ-0131 invoice partially paid`)
};

export const api_platform_acc_8 = /** @type {(inputs: Api_Platform_Acc_8Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ETA change re-planned tasks; no-response escalation logged`)
};

export const api_platform_acc_9 = /** @type {(inputs: Api_Platform_Acc_9Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Duplicate auto-resolved; every exception carries an idempotency key`)
};

export const api_platform_already_done = /** @type {(inputs: Api_Platform_Already_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Already ${i?.status}. Key ${i?.key} checked, nothing re-run or re-sent.`)
};

export const api_platform_already_owns = /** @type {(inputs: Api_Platform_Already_OwnsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} already owns ${i?.caseId}.`)
};

export const api_platform_bank_detail_change = /** @type {(inputs: Api_Platform_Bank_Detail_ChangeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bank detail change`)
};

export const api_platform_case_line = /** @type {(inputs: Api_Platform_Case_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.caseId} line ${i?.line}: ${i?.description}`)
};

export const api_platform_case_not_found = /** @type {(inputs: Api_Platform_Case_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Case not found.`)
};

export const api_platform_case_record = /** @type {(inputs: Api_Platform_Case_RecordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Case record`)
};

export const api_platform_check_bank_detail = /** @type {(inputs: Api_Platform_Check_Bank_DetailInputs) => LocalizedString} */ (i) => {
	if (i?.on === "yes") return /** @type {LocalizedString} */ (`Approval rule “${i?.type}”: two-person on, approvers ${i?.approvers}.`);
	return /** @type {LocalizedString} */ (`Approval rule “${i?.type}”: two-person off, approvers ${i?.approvers}.`)
};

export const api_platform_check_bank_two_people = /** @type {(inputs: Api_Platform_Check_Bank_Two_PeopleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bank-detail changes need two people (Finance + CEO)`)
};

export const api_platform_check_sales_costs = /** @type {(inputs: Api_Platform_Check_Sales_CostsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sales never sees supplier costs`)
};

export const api_platform_check_sales_costs_detail = /** @type {(inputs: Api_Platform_Check_Sales_Costs_DetailInputs) => LocalizedString} */ (i) => {
	if (i?.hidden === "yes") return /** @type {LocalizedString} */ (`Read an offer as ${i?.name}: the price field is removed by field access.`);
	return /** @type {LocalizedString} */ (`Read an offer as ${i?.name}: the price field is visible.`)
};

export const api_platform_clarifications = /** @type {(inputs: Api_Platform_ClarificationsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} clarification`);
	return /** @type {LocalizedString} */ (`${i?.count} clarifications`)
};

export const api_platform_connection_not_found = /** @type {(inputs: Api_Platform_Connection_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Connection not found.`)
};

export const api_platform_customer = /** @type {(inputs: Api_Platform_CustomerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer`)
};

export const api_platform_deadline_passed = /** @type {(inputs: Api_Platform_Deadline_PassedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.when} (passed)`)
};

export const api_platform_deadline_within_24h = /** @type {(inputs: Api_Platform_Deadline_Within_24hInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.when} (within 24 h)`)
};

export const api_platform_delivery_note = /** @type {(inputs: Api_Platform_Delivery_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} ${i?.status}, not counted as delivered until confirmed`)
};

export const api_platform_exception_not_found = /** @type {(inputs: Api_Platform_Exception_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exception not found.`)
};

export const api_platform_handed_over = /** @type {(inputs: Api_Platform_Handed_OverInputs) => LocalizedString} */ (i) => {
	const movedPlural = __paraglideRegistry.plural("en", i?.moved, {}, true);
	const movedPluralExact = i?.moved;
	if ((movedPluralExact === 0 || movedPluralExact === "0")) return /** @type {LocalizedString} */ (`${i?.caseId} handed over to ${i?.name} · note logged on the timeline`);
	if (movedPlural === "one") return /** @type {LocalizedString} */ (`${i?.caseId} handed over to ${i?.name} · ${i?.moved} open task moved · note logged on the timeline`);
	return /** @type {LocalizedString} */ (`${i?.caseId} handed over to ${i?.name} · ${i?.moved} open tasks moved · note logged on the timeline`)
};

export const api_platform_handover_case = /** @type {(inputs: Api_Platform_Handover_CaseInputs) => LocalizedString} */ (i) => {
	if (i?.hasPort === "yes" && i?.hasEta === "yes") return /** @type {LocalizedString} */ (`${i?.customer} · ${i?.vessel}, ${i?.port}, ETA ${i?.eta}. Stage: ${i?.stage}. Quote due ${i?.due}.`);
	if (i?.hasPort === "yes") return /** @type {LocalizedString} */ (`${i?.customer} · ${i?.vessel}, ${i?.port}. Stage: ${i?.stage}. Quote due ${i?.due}.`);
	if (i?.hasEta === "yes") return /** @type {LocalizedString} */ (`${i?.customer} · ${i?.vessel}, ETA ${i?.eta}. Stage: ${i?.stage}. Quote due ${i?.due}.`);
	return /** @type {LocalizedString} */ (`${i?.customer} · ${i?.vessel}. Stage: ${i?.stage}. Quote due ${i?.due}.`)
};

export const api_platform_handover_check_line = /** @type {(inputs: Api_Platform_Handover_Check_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Check line ${i?.line} (${i?.description}): AI read it at ${i?.pct}%.`)
};

export const api_platform_handover_contact_rule = /** @type {(inputs: Api_Platform_Handover_Contact_RuleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Customer contact rule: ${i?.rule}.`)
};

export const api_platform_handover_from = /** @type {(inputs: Api_Platform_Handover_FromInputs) => LocalizedString} */ (i) => {
	const movedPlural = __paraglideRegistry.plural("en", i?.moved, {}, true);
	const movedPluralExact = i?.moved;
	if ((movedPluralExact === 0 || movedPluralExact === "0")) return /** @type {LocalizedString} */ (`Handover from ${i?.name}`);
	if (movedPlural === "one") return /** @type {LocalizedString} */ (`Handover from ${i?.name} · ${i?.moved} open task moved to you`);
	return /** @type {LocalizedString} */ (`Handover from ${i?.name} · ${i?.moved} open tasks moved to you`)
};

export const api_platform_handover_lines = /** @type {(inputs: Api_Platform_Handover_LinesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Lines: ${i?.ready} ready, ${i?.waiting} waiting, ${i?.blocked} blocked, ${i?.noOffer} without offer (of ${i?.total}).`)
};

export const api_platform_handover_next = /** @type {(inputs: Api_Platform_Handover_NextInputs) => LocalizedString} */ (i) => {
	if (i?.hasBlocker === "yes") return /** @type {LocalizedString} */ (`Next: ${i?.next}. Blocker: ${i?.blocker}.`);
	return /** @type {LocalizedString} */ (`Next: ${i?.next}.`)
};

export const api_platform_handover_question = /** @type {(inputs: Api_Platform_Handover_QuestionInputs) => LocalizedString} */ (i) => {
	if (i?.hasLine === "yes") return /** @type {LocalizedString} */ (`Open question (line ${i?.line}) to ${i?.to}: ${i?.question}`);
	return /** @type {LocalizedString} */ (`Open question to ${i?.to}: ${i?.question}`)
};

export const api_platform_handover_subject = /** @type {(inputs: Api_Platform_Handover_SubjectInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Handover note for ${i?.caseId} to ${i?.to}`)
};

export const api_platform_handover_task = /** @type {(inputs: Api_Platform_Handover_TaskInputs) => LocalizedString} */ (i) => {
	if (i?.hasDue === "yes") return /** @type {LocalizedString} */ (`Task: ${i?.title}, due ${i?.due}.`);
	return /** @type {LocalizedString} */ (`Task: ${i?.title}.`)
};

export const api_platform_handover_title = /** @type {(inputs: Api_Platform_Handover_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Handover: ${i?.caseId} for ${i?.to}`)
};

export const api_platform_invoice_already_accepted = /** @type {(inputs: Api_Platform_Invoice_Already_AcceptedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Re-checked ${i?.key}: already accepted by the tax authority, not submitted again.`)
};

export const api_platform_invoice_submitted_once = /** @type {(inputs: Api_Platform_Invoice_Submitted_OnceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Re-checked ${i?.key}: not yet accepted by the tax authority → signed and submitted once. Status: Valid.`)
};

export const api_platform_language_saved = /** @type {(inputs: Api_Platform_Language_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Language settings saved`)
};

export const api_platform_low_confidence = /** @type {(inputs: Api_Platform_Low_ConfidenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Low extraction confidence`)
};

export const api_platform_mailbox_rechecked = /** @type {(inputs: Api_Platform_Mailbox_RecheckedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Re-checked ${i?.key}: ${i?.pending} messages waiting, ${i?.linked} already imported → ${i?.imported} imported. No duplicate cases or acknowledgements.`)
};

export const api_platform_management_permissions = /** @type {(inputs: Api_Platform_Management_PermissionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Only management edits permissions.`)
};

export const api_platform_management_rules = /** @type {(inputs: Api_Platform_Management_RulesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Management can pause or enable rules.`)
};

export const api_platform_my_language_ar = /** @type {(inputs: Api_Platform_My_Language_ArInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your dashboard language: Arabic (applies after go-live translation)`)
};

export const api_platform_my_language_en = /** @type {(inputs: Api_Platform_My_Language_EnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your dashboard language: English`)
};

export const api_platform_needs_a_person = /** @type {(inputs: Api_Platform_Needs_A_PersonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This exception needs a person to check it. Review it and mark it reviewed instead of retrying.`)
};

export const api_platform_no_shift_reason = /** @type {(inputs: Api_Platform_No_Shift_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Outside office hours and no shift on the roster: straight to the senior call list.`)
};

export const api_platform_not_yet_shown = /** @type {(inputs: Api_Platform_Not_Yet_ShownInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not yet shown`)
};

export const api_platform_note_required = /** @type {(inputs: Api_Platform_Note_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A handover note is required.`)
};

export const api_platform_office_hours_reason = /** @type {(inputs: Api_Platform_Office_Hours_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Office hours (Sun–Thu 08:00–17:00 Cairo): the case owner picks it up by the assignment rule.`)
};

export const api_platform_on_call_detail = /** @type {(inputs: Api_Platform_On_Call_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Simulated from Roles & permissions · acknowledge within ${i?.minutes} min, then ${i?.next} is alerted`)
};

export const api_platform_on_call_title = /** @type {(inputs: Api_Platform_On_Call_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Urgent RFQ after hours: you're on call (${i?.at})`)
};

export const api_platform_on_duty_reason = /** @type {(inputs: Api_Platform_On_Duty_ReasonInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Outside office hours: WhatsApp / SMS to the on-duty person; the backup after ${i?.minutes} min, then senior contacts.`)
};

export const api_platform_only_owner_reassigns = /** @type {(inputs: Api_Platform_Only_Owner_ReassignsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Only the owner, the backup, the supply-chain desk or management can reassign.`)
};

export const api_platform_open_tasks = /** @type {(inputs: Api_Platform_Open_TasksInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} open task`);
	return /** @type {LocalizedString} */ (`${i?.count} open tasks`)
};

export const api_platform_pass = /** @type {(inputs: Api_Platform_PassInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pass`)
};

export const api_platform_permissions_activity = /** @type {(inputs: Api_Platform_Permissions_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Updated the ${i?.role} permissions in the roles & permissions matrix.`)
};

export const api_platform_pick_on_duty = /** @type {(inputs: Api_Platform_Pick_On_DutyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pick who is on duty.`)
};

export const api_platform_pick_someone = /** @type {(inputs: Api_Platform_Pick_SomeoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pick someone on the desk to hand over to.`)
};

export const api_platform_receipt_note = /** @type {(inputs: Api_Platform_Receipt_NoteInputs) => LocalizedString} */ (i) => {
	if (i?.hasRest === "yes") return /** @type {LocalizedString} */ (`Line ${i?.line}: ${i?.qc}, ${i?.received} of ${i?.ordered} received, rest due ${i?.rest}`);
	return /** @type {LocalizedString} */ (`Line ${i?.line}: ${i?.qc}, ${i?.received} of ${i?.ordered} received`)
};

export const api_platform_reconnect_roles = /** @type {(inputs: Api_Platform_Reconnect_RolesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Management, operations or the office manager reconnect mailboxes.`)
};

export const api_platform_reconnected = /** @type {(inputs: Api_Platform_ReconnectedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Reconnected ${i?.account}.`)
};

export const api_platform_reconnected_activity = /** @type {(inputs: Api_Platform_Reconnected_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Reconnected ${i?.kind} ${i?.account}.`)
};

export const api_platform_reconnected_note = /** @type {(inputs: Api_Platform_Reconnected_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reconnected. Waiting emails imported once each`)
};

export const api_platform_reconnected_with = /** @type {(inputs: Api_Platform_Reconnected_WithInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Reconnected ${i?.account}. ${i?.message}`)
};

export const api_platform_resolved_by_retry = /** @type {(inputs: Api_Platform_Resolved_By_RetryInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.impact}. Resolved by safe retry`)
};

export const api_platform_retried_safely = /** @type {(inputs: Api_Platform_Retried_SafelyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Retried safely: ${i?.message}`)
};

export const api_platform_reviewed_activity = /** @type {(inputs: Api_Platform_Reviewed_ActivityInputs) => LocalizedString} */ (i) => {
	if (i?.hasNote === "yes") return /** @type {LocalizedString} */ (`Reviewed: ${i?.summary}. ${i?.note}`);
	return /** @type {LocalizedString} */ (`Reviewed: ${i?.summary}. Fields confirmed by a person.`)
};

export const api_platform_role_not_found = /** @type {(inputs: Api_Platform_Role_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Role not found.`)
};

export const api_platform_roster_activity = /** @type {(inputs: Api_Platform_Roster_ActivityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Updated the on-call roster.`)
};

export const api_platform_roster_editors = /** @type {(inputs: Api_Platform_Roster_EditorsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Management and the office manager edit the roster.`)
};

export const api_platform_rule_enabled = /** @type {(inputs: Api_Platform_Rule_EnabledInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} enabled (logged)`)
};

export const api_platform_rule_enabled_activity = /** @type {(inputs: Api_Platform_Rule_Enabled_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Enabled automation “${i?.name}”.`)
};

export const api_platform_rule_not_found = /** @type {(inputs: Api_Platform_Rule_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rule not found.`)
};

export const api_platform_rule_paused = /** @type {(inputs: Api_Platform_Rule_PausedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} paused (logged)`)
};

export const api_platform_rule_paused_activity = /** @type {(inputs: Api_Platform_Rule_Paused_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Paused automation “${i?.name}”.`)
};

export const api_platform_runs_at_settlement = /** @type {(inputs: Api_Platform_Runs_At_SettlementInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Runs at settlement`)
};

export const api_platform_sales = /** @type {(inputs: Api_Platform_SalesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sales`)
};

export const api_platform_senior_contacts = /** @type {(inputs: Api_Platform_Senior_ContactsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`senior contacts`)
};

export const api_platform_settings_management = /** @type {(inputs: Api_Platform_Settings_ManagementInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Company settings are changed by management.`)
};

export const api_platform_shift_not_found = /** @type {(inputs: Api_Platform_Shift_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Shift not found.`)
};

export const api_platform_sign_in = /** @type {(inputs: Api_Platform_Sign_InInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Please sign in.`)
};

export const api_platform_simulated_activity = /** @type {(inputs: Api_Platform_Simulated_ActivityInputs) => LocalizedString} */ (i) => {
	if (i?.hasBackup === "yes") return /** @type {LocalizedString} */ (`Simulated urgent RFQ at ${i?.at}: alert sent to on-duty ${i?.name}, backup ${i?.backup}.`);
	return /** @type {LocalizedString} */ (`Simulated urgent RFQ at ${i?.at}: alert sent to on-duty ${i?.name}.`)
};

export const api_platform_staging_activity = /** @type {(inputs: Api_Platform_Staging_ActivityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Staging copy refreshed from last night's backup (emails and integrations disabled on staging).`)
};

export const api_platform_staging_management = /** @type {(inputs: Api_Platform_Staging_ManagementInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Only management refreshes the staging copy.`)
};

export const api_platform_step_rerun = /** @type {(inputs: Api_Platform_Step_RerunInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Re-checked ${i?.key}: step re-run once.`)
};

export const api_platform_system = /** @type {(inputs: Api_Platform_SystemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`System`)
};

export const api_platform_system_mailbox = /** @type {(inputs: Api_Platform_System_MailboxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`System mailbox`)
};

export const api_platform_the_record = /** @type {(inputs: Api_Platform_The_RecordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`the record`)
};

export const api_platform_timeline_entries = /** @type {(inputs: Api_Platform_Timeline_EntriesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} timeline entries`)
};

export const api_platform_uncertain_match = /** @type {(inputs: Api_Platform_Uncertain_MatchInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Uncertain match (${i?.classification}), waiting for a person in the inbox`)
};

export const api_platform_unclassified = /** @type {(inputs: Api_Platform_UnclassifiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`unclassified`)
};

export const api_platform_unknown_permission = /** @type {(inputs: Api_Platform_Unknown_PermissionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unknown permission.`)
};

export const api_platform_unknown_setting = /** @type {(inputs: Api_Platform_Unknown_SettingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unknown setting.`)
};

export const api_platform_valid_time = /** @type {(inputs: Api_Platform_Valid_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Give a valid time.`)
};

export const api_platform_you_now_own = /** @type {(inputs: Api_Platform_You_Now_OwnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`You now own ${i?.caseId}`)
};

export const api_profit_actuals_confirmed = /** @type {(inputs: Api_Profit_Actuals_ConfirmedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Actual costs confirmed: ${i?.list}.`)
};

export const api_profit_all_charges_confirmed = /** @type {(inputs: Api_Profit_All_Charges_ConfirmedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every shared charge is confirmed against its bill.`)
};

export const api_profit_all_paid = /** @type {(inputs: Api_Profit_All_PaidInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`All paid (${i?.count} receipt reconciled).`);
	return /** @type {LocalizedString} */ (`All paid (${i?.count} receipts reconciled).`)
};

export const api_profit_bill = /** @type {(inputs: Api_Profit_BillInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Bill ${i?.number} (${i?.status})`)
};

export const api_profit_bill_held = /** @type {(inputs: Api_Profit_Bill_HeldInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Bill ${i?.number} (${i?.status}: ${i?.reason})`)
};

export const api_profit_bill_number = /** @type {(inputs: Api_Profit_Bill_NumberInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Bill ${i?.number}`)
};

export const api_profit_billed_vs_estimate = /** @type {(inputs: Api_Profit_Billed_Vs_EstimateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.label}: billed ${i?.billed} vs estimate ${i?.estimate}, confirm`)
};

export const api_profit_cant_close = /** @type {(inputs: Api_Profit_Cant_CloseInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`The case can't close yet: ${i?.checks}.`)
};

export const api_profit_case_closed_activity = /** @type {(inputs: Api_Profit_Case_Closed_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Case closed. Actual gross profit ${i?.actual} (${i?.margin}%) against ${i?.expected} expected. Supplier prices and on-time results fed back to supplier records.`)
};

export const api_profit_case_not_found = /** @type {(inputs: Api_Profit_Case_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Case not found.`)
};

export const api_profit_check_actuals = /** @type {(inputs: Api_Profit_Check_ActualsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Estimated costs replaced by actuals`)
};

export const api_profit_check_bills = /** @type {(inputs: Api_Profit_Check_BillsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier bills matched to POs and receipts`)
};

export const api_profit_check_claims = /** @type {(inputs: Api_Profit_Check_ClaimsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Claims settled`)
};

export const api_profit_check_deliveries = /** @type {(inputs: Api_Profit_Check_DeliveriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deliveries signed on board`)
};

export const api_profit_check_einvoice = /** @type {(inputs: Api_Profit_Check_EinvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoices accepted by the tax authority (ETA e-invoice)`)
};

export const api_profit_check_paid = /** @type {(inputs: Api_Profit_Check_PaidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer invoices paid in full`)
};

export const api_profit_claim_line = /** @type {(inputs: Api_Profit_Claim_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Claim ${i?.ref}: ${i?.title}`)
};

export const api_profit_claim_not_found = /** @type {(inputs: Api_Profit_Claim_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Claim not found.`)
};

export const api_profit_claim_offset = /** @type {(inputs: Api_Profit_Claim_OffsetInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Replacement cost offset by credit note ${i?.creditNote}`)
};

export const api_profit_claim_open = /** @type {(inputs: Api_Profit_Claim_OpenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Open: claimed from ${i?.against}`)
};

export const api_profit_claim_open_with = /** @type {(inputs: Api_Profit_Claim_Open_WithInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.ref} (${i?.title}): open with ${i?.against}`)
};

export const api_profit_claim_settled_activity = /** @type {(inputs: Api_Profit_Claim_Settled_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Claim ${i?.ref} settled: credit note ${i?.creditNote} for ${i?.amount} recorded.`)
};

export const api_profit_claim_settled_by = /** @type {(inputs: Api_Profit_Claim_Settled_ByInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.ref} (${i?.title}): settled by credit note ${i?.creditNote}`)
};

export const api_profit_confirm_actuals = /** @type {(inputs: Api_Profit_Confirm_ActualsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirm actuals`)
};

export const api_profit_confirmed_on_pricing = /** @type {(inputs: Api_Profit_Confirmed_On_PricingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirmed on the pricing tab`)
};

export const api_profit_estimate = /** @type {(inputs: Api_Profit_EstimateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Estimate`)
};

export const api_profit_finance_only = /** @type {(inputs: Api_Profit_Finance_OnlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Only management and finance record receipts, credit notes and closures.`)
};

export const api_profit_hidden_from_sales = /** @type {(inputs: Api_Profit_Hidden_From_SalesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Profit, costs and margins are not visible to Sales.`)
};

export const api_profit_no_bill_yet = /** @type {(inputs: Api_Profit_No_Bill_YetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No supplier bill yet`)
};

export const api_profit_no_claims = /** @type {(inputs: Api_Profit_No_ClaimsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No claims on this case.`)
};

export const api_profit_no_delivery = /** @type {(inputs: Api_Profit_No_DeliveryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No delivery recorded yet.`)
};

export const api_profit_no_invoice = /** @type {(inputs: Api_Profit_No_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No customer invoice issued yet.`)
};

export const api_profit_no_po_or_bill = /** @type {(inputs: Api_Profit_No_Po_Or_BillInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No supplier PO or bill recorded for this case yet.`)
};

export const api_profit_no_single_balance = /** @type {(inputs: Api_Profit_No_Single_BalanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`There is no single open invoice balance to record.`)
};

export const api_profit_none_case_closed = /** @type {(inputs: Api_Profit_None_Case_ClosedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`None: case closed`)
};

export const api_profit_not_applicable = /** @type {(inputs: Api_Profit_Not_ApplicableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not applicable`)
};

export const api_profit_not_invoiced_today = /** @type {(inputs: Api_Profit_Not_Invoiced_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not yet invoiced, at today's rate`)
};

export const api_profit_open = /** @type {(inputs: Api_Profit_OpenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number}: ${i?.amount} open`)
};

export const api_profit_open_balance_today = /** @type {(inputs: Api_Profit_Open_Balance_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open balance, at today's rate`)
};

export const api_profit_open_due = /** @type {(inputs: Api_Profit_Open_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number}: ${i?.amount} open, due ${i?.due}`)
};

export const api_profit_po = /** @type {(inputs: Api_Profit_PoInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`PO ${i?.number}`)
};

export const api_profit_po_line = /** @type {(inputs: Api_Profit_Po_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier}: PO ${i?.number}`)
};

export const api_profit_receipt = /** @type {(inputs: Api_Profit_ReceiptInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Receipt ${i?.reference}`)
};

export const api_profit_receipt_on = /** @type {(inputs: Api_Profit_Receipt_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Receipt ${i?.reference} · ${i?.day}`)
};

export const api_profit_record_credit_note = /** @type {(inputs: Api_Profit_Record_Credit_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Record credit note`)
};

export const api_profit_record_receipt = /** @type {(inputs: Api_Profit_Record_ReceiptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Record receipt`)
};

export const api_profit_signed_by = /** @type {(inputs: Api_Profit_Signed_ByInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`signed by ${i?.who}`)
};

export const api_profit_signed_by_vessel = /** @type {(inputs: Api_Profit_Signed_By_VesselInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`signed by the vessel`)
};

export const api_profit_still_estimate = /** @type {(inputs: Api_Profit_Still_EstimateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.label}: still an estimate (${i?.estimate})`)
};

export const api_quotations_decision_recorded = /** @type {(inputs: Api_Quotations_Decision_RecordedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Decision recorded: ${i?.decision}.`)
};

export const api_quotations_entered_in_portal = /** @type {(inputs: Api_Quotations_Entered_In_PortalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} marked as entered in the portal.`)
};

export const api_quotations_give_lost_reason = /** @type {(inputs: Api_Quotations_Give_Lost_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Give the lost reason.`)
};

export const api_quotations_new_version = /** @type {(inputs: Api_Quotations_New_VersionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New version created. The previous one is kept for audit.`)
};

export const api_quotations_sent_to = /** @type {(inputs: Api_Quotations_Sent_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} sent to ${i?.to}.`)
};

export const api_service_sign_in = /** @type {(inputs: Api_Service_Sign_InInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Please sign in.`)
};

export const api_sourcing_a_person = /** @type {(inputs: Api_Sourcing_A_PersonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`a person`)
};

export const api_sourcing_ack_already_activity = /** @type {(inputs: Api_Sourcing_Ack_Already_ActivityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Already acknowledged earlier, so no second acknowledgement.`)
};

export const api_sourcing_ack_by_hand_activity = /** @type {(inputs: Api_Sourcing_Ack_By_Hand_ActivityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Acknowledgement to be sent by the owner by hand (WhatsApp / phone source).`)
};

export const api_sourcing_ack_default_body = /** @type {(inputs: Api_Sourcing_Ack_Default_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dear {{contact}},

Thank you. Your request for {{vessel}} is registered as {{caseId}}. We will revert by {{dueAt}}.`)
};

export const api_sourcing_ack_default_subject = /** @type {(inputs: Api_Sourcing_Ack_Default_SubjectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`We received your RFQ {{customerRef}}`)
};

export const api_sourcing_ack_footer = /** @type {(inputs: Api_Sourcing_Ack_FooterInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Your contact: ${i?.owner} (backup ${i?.backup}).

Golden Sea for Trading & Marketing
Ship chandler · Port Said · Suez · Alexandria`)
};

export const api_sourcing_ack_sent_activity = /** @type {(inputs: Api_Sourcing_Ack_Sent_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Acknowledgement sent once from the approved template “${i?.template}”.`)
};

export const api_sourcing_already_asked = /** @type {(inputs: Api_Sourcing_Already_AskedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`L${i?.line} already asked of ${i?.name}`)
};

export const api_sourcing_already_linked_no_new = /** @type {(inputs: Api_Sourcing_Already_Linked_No_NewInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Already linked to ${i?.caseId}: no new case, no second acknowledgement`)
};

export const api_sourcing_already_waiting = /** @type {(inputs: Api_Sourcing_Already_WaitingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This item is already waiting for a decision.`)
};

export const api_sourcing_auto_created_source = /** @type {(inputs: Api_Sourcing_Auto_Created_SourceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Auto-created from an email reply to ${i?.reference} (${i?.date}). Quoted, never ordered`)
};

export const api_sourcing_back_in_queue = /** @type {(inputs: Api_Sourcing_Back_In_QueueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Back in the review queue`)
};

export const api_sourcing_back_to_decision = /** @type {(inputs: Api_Sourcing_Back_To_DecisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Back to needing a decision`)
};

export const api_sourcing_below_threshold = /** @type {(inputs: Api_Sourcing_Below_ThresholdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Below 85%: a person confirms before anything is linked`)
};

export const api_sourcing_blocker = /** @type {(inputs: Api_Sourcing_BlockerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Line ${i?.lines}: ${i?.flag}`)
};

export const api_sourcing_cannot_supply = /** @type {(inputs: Api_Sourcing_Cannot_SupplyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cannot supply. Reminders stopped`)
};

export const api_sourcing_case_already_created = /** @type {(inputs: Api_Sourcing_Case_Already_CreatedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Case ${i?.caseId} was already created from this message`)
};

export const api_sourcing_case_created = /** @type {(inputs: Api_Sourcing_Case_CreatedInputs) => LocalizedString} */ (i) => {
	if (i?.ack === "sent") return /** @type {LocalizedString} */ (`Case ${i?.caseId} created · acknowledgement sent once`);
	if (i?.ack === "manual") return /** @type {LocalizedString} */ (`Case ${i?.caseId} created · acknowledge by hand`);
	return /** @type {LocalizedString} */ (`Case ${i?.caseId} created · already acknowledged`)
};

export const api_sourcing_case_not_found = /** @type {(inputs: Api_Sourcing_Case_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Case not found.`)
};

export const api_sourcing_case_number_on_creation = /** @type {(inputs: Api_Sourcing_Case_Number_On_CreationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`(case number on creation)`)
};

export const api_sourcing_cash_terms = /** @type {(inputs: Api_Sourcing_Cash_TermsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cash`)
};

export const api_sourcing_created_activity = /** @type {(inputs: Api_Sourcing_Created_ActivityInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Created from the ${i?.channel} “${i?.subject}”: ${i?.count} AI-extracted line checked and confirmed by ${i?.who}.`);
	return /** @type {LocalizedString} */ (`Created from the ${i?.channel} “${i?.subject}”: ${i?.count} AI-extracted lines checked and confirmed by ${i?.who}.`)
};

export const api_sourcing_customer_ref_is = /** @type {(inputs: Api_Sourcing_Customer_Ref_IsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Customer reference ${i?.ref} = ${i?.caseId}`)
};

export const api_sourcing_declined_event = /** @type {(inputs: Api_Sourcing_Declined_EventInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Declined by email. Reminders stopped`)
};

export const api_sourcing_desk_only = /** @type {(inputs: Api_Sourcing_Desk_OnlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Only supply chain and management can do this.`)
};

export const api_sourcing_draft_gone = /** @type {(inputs: Api_Sourcing_Draft_GoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`That draft is no longer there.`)
};

export const api_sourcing_drafts_back = /** @type {(inputs: Api_Sourcing_Drafts_BackInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} RFQ draft back. Nothing was sent`);
	return /** @type {LocalizedString} */ (`${i?.count} RFQ drafts back. Nothing was sent`)
};

export const api_sourcing_drafts_changed = /** @type {(inputs: Api_Sourcing_Drafts_ChangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The drafts have changed since (drafted again or sent), so there is nothing to put back.`)
};

export const api_sourcing_drafts_ready = /** @type {(inputs: Api_Sourcing_Drafts_ReadyInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} RFQ draft ready. Check them before sending`);
	return /** @type {LocalizedString} */ (`${i?.count} RFQ drafts ready. Check them before sending`)
};

export const api_sourcing_duplicate_kept = /** @type {(inputs: Api_Sourcing_Duplicate_KeptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Duplicate, kept with the original`)
};

export const api_sourcing_duplicate_linked = /** @type {(inputs: Api_Sourcing_Duplicate_LinkedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Duplicate, already linked to ${i?.caseId}`)
};

export const api_sourcing_escalated_to = /** @type {(inputs: Api_Sourcing_Escalated_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Escalated to ${i?.name}`)
};

export const api_sourcing_for_vessel = /** @type {(inputs: Api_Sourcing_For_VesselInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`for ${i?.vessel}`)
};

export const api_sourcing_forwarded_by_staff = /** @type {(inputs: Api_Sourcing_Forwarded_By_StaffInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`forwarded by staff`)
};

export const api_sourcing_general_full = /** @type {(inputs: Api_Sourcing_General_FullInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`General chandler: receives the full list`)
};

export const api_sourcing_held_back = /** @type {(inputs: Api_Sourcing_Held_BackInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Held back until clarified: ${i?.lines}`)
};

export const api_sourcing_history_approved_activity = /** @type {(inputs: Api_Sourcing_History_Approved_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Inbox history import approved by ${i?.name}: ${i?.customers} customers, ${i?.vessels} vessels, ${i?.suppliers} suppliers and ${i?.prices} dated prices (${i?.saved} sample prices written in the demo).`)
};

export const api_sourcing_history_ready = /** @type {(inputs: Api_Sourcing_History_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inbox history ready for your approval`)
};

export const api_sourcing_history_ready_detail = /** @type {(inputs: Api_Sourcing_History_Ready_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.customers} customers, ${i?.vessels} vessels, ${i?.suppliers} suppliers, ${i?.prices} dated prices · ${i?.uncertain} uncertain items to review`)
};

export const api_sourcing_identical_attachments = /** @type {(inputs: Api_Sourcing_Identical_AttachmentsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Identical attachments (${i?.hash}…) to “${i?.subject}”, received ${i?.at}`)
};

export const api_sourcing_import_approved = /** @type {(inputs: Api_Sourcing_Import_ApprovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The import is approved and saved, so its decisions can't be taken back.`)
};

export const api_sourcing_invited_on_many = /** @type {(inputs: Api_Sourcing_Invited_On_ManyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Invited on ${i?.count} open cases: can't tell which`)
};

export const api_sourcing_lines_offered = /** @type {(inputs: Api_Sourcing_Lines_OfferedInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one" && i?.changed === "yes") return /** @type {LocalizedString} */ (`${i?.count} line offered · subject changed, matched by reference`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} line offered`);
	if (i?.changed === "yes") return /** @type {LocalizedString} */ (`${i?.count} lines offered · subject changed, matched by reference`);
	return /** @type {LocalizedString} */ (`${i?.count} lines offered`)
};

export const api_sourcing_linked_activity = /** @type {(inputs: Api_Sourcing_Linked_ActivityInputs) => LocalizedString} */ (i) => {
	if (i?.offer === "yes") return /** @type {LocalizedString} */ (`“${i?.subject}” from ${i?.from} linked by ${i?.who} after review, offer confirmed.`);
	return /** @type {LocalizedString} */ (`“${i?.subject}” from ${i?.from} linked by ${i?.who} after review.`)
};

export const api_sourcing_linked_after_review_event = /** @type {(inputs: Api_Sourcing_Linked_After_Review_EventInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reply linked after review`)
};

export const api_sourcing_management_approves = /** @type {(inputs: Api_Sourcing_Management_ApprovesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Only management can approve the history import.`)
};

export const api_sourcing_matched_to = /** @type {(inputs: Api_Sourcing_Matched_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Matched to ${i?.caseId} by ${i?.reference} (${i?.pct})`)
};

export const api_sourcing_message_not_found = /** @type {(inputs: Api_Sourcing_Message_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Message not found.`)
};

export const api_sourcing_model = /** @type {(inputs: Api_Sourcing_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`gs-extract (demo stub) · vision + spreadsheet reader`)
};

export const api_sourcing_needs_clarification = /** @type {(inputs: Api_Sourcing_Needs_ClarificationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Needs clarification first`)
};

export const api_sourcing_new_case_assigned = /** @type {(inputs: Api_Sourcing_New_Case_AssignedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`New case ${i?.caseId} assigned to you`)
};

export const api_sourcing_new_case_detail = /** @type {(inputs: Api_Sourcing_New_Case_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.customer} · ${i?.vessel} · quote due ${i?.due}`)
};

export const api_sourcing_new_supplier_activity = /** @type {(inputs: Api_Sourcing_New_Supplier_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`New supplier ${i?.name} replied to ${i?.reference}. Supplier and dated price saved automatically; unit waits for a person.`)
};

export const api_sourcing_new_supplier_confirm = /** @type {(inputs: Api_Sourcing_New_Supplier_ConfirmInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`New supplier: confirm the offered item matches line ${i?.line}.`)
};

export const api_sourcing_new_supplier_created = /** @type {(inputs: Api_Sourcing_New_Supplier_CreatedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sender ${i?.domain} is not in the supplier list: new supplier created automatically`)
};

export const api_sourcing_new_supplier_detail = /** @type {(inputs: Api_Sourcing_New_Supplier_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not in the database: supplier created, dated price stored with validity. Unit to confirm`)
};

export const api_sourcing_new_supplier_saved = /** @type {(inputs: Api_Sourcing_New_Supplier_SavedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sender ${i?.domain} is not in the supplier list: new supplier already saved automatically`)
};

export const api_sourcing_no_new_case = /** @type {(inputs: Api_Sourcing_No_New_CaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No new case, no second acknowledgement`)
};

export const api_sourcing_no_reference = /** @type {(inputs: Api_Sourcing_No_ReferenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No supplier-RFQ reference in subject or body`)
};

export const api_sourcing_no_rule = /** @type {(inputs: Api_Sourcing_No_RuleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No rule matched, so you own it`)
};

export const api_sourcing_no_specialist = /** @type {(inputs: Api_Sourcing_No_SpecialistInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No specialist on file: general chandler`)
};

export const api_sourcing_none_waiting = /** @type {(inputs: Api_Sourcing_None_WaitingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No supplier RFQs are waiting for a reply.`)
};

export const api_sourcing_not_filed_by_review = /** @type {(inputs: Api_Sourcing_Not_Filed_By_ReviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This message isn't filed by a review, so there is nothing to take back.`)
};

export const api_sourcing_not_history_item = /** @type {(inputs: Api_Sourcing_Not_History_ItemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not a history item.`)
};

export const api_sourcing_not_invited_event = /** @type {(inputs: Api_Sourcing_Not_Invited_EventInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Not invited: replied to ${i?.reference} forwarded to them; supplier created automatically`)
};

export const api_sourcing_nothing_extracted = /** @type {(inputs: Api_Sourcing_Nothing_ExtractedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing extracted from this message yet.`)
};

export const api_sourcing_nothing_new = /** @type {(inputs: Api_Sourcing_Nothing_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing new to send: every picked line was already asked of these suppliers`)
};

export const api_sourcing_nothing_to_send = /** @type {(inputs: Api_Sourcing_Nothing_To_SendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing to send. Draft the RFQs first.`)
};

export const api_sourcing_offer_received_event = /** @type {(inputs: Api_Sourcing_Offer_Received_EventInputs) => LocalizedString} */ (i) => {
	if (i?.changed === "yes") return /** @type {LocalizedString} */ (`Offer received (subject “${i?.subject}”): matched by reference, reminders stopped`);
	return /** @type {LocalizedString} */ (`Offer received: matched by reference, reminders stopped`)
};

export const api_sourcing_offers_captured = /** @type {(inputs: Api_Sourcing_Offers_CapturedInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} offer line captured from the reply to ${i?.reference}. Dated prices saved to the supplier's history.`);
	return /** @type {LocalizedString} */ (`${i?.count} offer lines captured from the reply to ${i?.reference}. Dated prices saved to the supplier's history.`)
};

export const api_sourcing_only_decider = /** @type {(inputs: Api_Sourcing_Only_DeciderInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} decided this item, so only they can take it back.`)
};

export const api_sourcing_only_filer = /** @type {(inputs: Api_Sourcing_Only_FilerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} filed this message, so only they can take it back.`)
};

export const api_sourcing_organise_first = /** @type {(inputs: Api_Sourcing_Organise_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Organise the history first.`)
};

export const api_sourcing_original_not_case = /** @type {(inputs: Api_Sourcing_Original_Not_CaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The original message isn't a case yet. Handle that one; this copy is kept with it`)
};

export const api_sourcing_original_text = /** @type {(inputs: Api_Sourcing_Original_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.text} · source: ${i?.source}`)
};

export const api_sourcing_pending_items = /** @type {(inputs: Api_Sourcing_Pending_ItemsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} uncertain item still need a decision.`);
	return /** @type {LocalizedString} */ (`${i?.count} uncertain items still need a decision.`)
};

export const api_sourcing_per_kg_uncertain = /** @type {(inputs: Api_Sourcing_Per_Kg_UncertainInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Quoted “${i?.price} LE”, read as per kg, converted to ${i?.converted} per ${i?.pack} kg pack. Confirm the unit.`)
};

export const api_sourcing_pick_case = /** @type {(inputs: Api_Sourcing_Pick_CaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pick the case this message belongs to.`)
};

export const api_sourcing_pick_line = /** @type {(inputs: Api_Sourcing_Pick_LineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pick at least one line.`)
};

export const api_sourcing_price_unit_unclear = /** @type {(inputs: Api_Sourcing_Price_Unit_UnclearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Price unit unclear: a person confirms`)
};

export const api_sourcing_ref_in_body = /** @type {(inputs: Api_Sourcing_Ref_In_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Reference ${i?.ref} found in the body`)
};

export const api_sourcing_ref_in_subject = /** @type {(inputs: Api_Sourcing_Ref_In_SubjectInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Reference ${i?.ref} found in the subject`)
};

export const api_sourcing_reminder_escalated_event = /** @type {(inputs: Api_Sourcing_Reminder_Escalated_EventInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Reminder ${i?.n} sent. No reply after ${i?.after} reminders, escalated to the case owner`)
};

export const api_sourcing_reminder_n_sent = /** @type {(inputs: Api_Sourcing_Reminder_N_SentInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Reminder ${i?.n} sent`)
};

export const api_sourcing_reminder_sent_event = /** @type {(inputs: Api_Sourcing_Reminder_Sent_EventInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Reminder ${i?.n} sent (approved template, client hidden) · next in 24 h`)
};

export const api_sourcing_reminders_stop = /** @type {(inputs: Api_Sourcing_Reminders_StopInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reminders stop once a supplier has answered.`)
};

export const api_sourcing_reopened_activity = /** @type {(inputs: Api_Sourcing_Reopened_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`“${i?.subject}” from ${i?.from} put back in the review queue by ${i?.who}.`)
};

export const api_sourcing_reply_counted = /** @type {(inputs: Api_Sourcing_Reply_CountedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The supplier's reply is already counted on the case, so the link can't be taken back.`)
};

export const api_sourcing_reply_matched_event = /** @type {(inputs: Api_Sourcing_Reply_Matched_EventInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Reply matched by reference (subject “${i?.subject}”). Reminders stopped`)
};

export const api_sourcing_rfq_alternatives = /** @type {(inputs: Api_Sourcing_Rfq_AlternativesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` (alternatives: state brand)`)
};

export const api_sourcing_rfq_best_regards = /** @type {(inputs: Api_Sourcing_Rfq_Best_RegardsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Best regards,`)
};

export const api_sourcing_rfq_date_below = /** @type {(inputs: Api_Sourcing_Rfq_Date_BelowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`the date below`)
};

export const api_sourcing_rfq_dear = /** @type {(inputs: Api_Sourcing_Rfq_DearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dear supplier,`)
};

export const api_sourcing_rfq_exact = /** @type {(inputs: Api_Sourcing_Rfq_ExactInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` (exact brand / part only)`)
};

export const api_sourcing_rfq_keep_reference = /** @type {(inputs: Api_Sourcing_Rfq_Keep_ReferenceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Please keep our reference ${i?.reference} in your reply.`)
};

export const api_sourcing_rfq_not_found = /** @type {(inputs: Api_Sourcing_Rfq_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier RFQ not found.`)
};

export const api_sourcing_rfq_part = /** @type {(inputs: Api_Sourcing_Rfq_PartInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (` · part ${i?.part}`)
};

export const api_sourcing_rfq_please_quote = /** @type {(inputs: Api_Sourcing_Rfq_Please_QuoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Please quote the following, delivered ${i?.port} by ${i?.date}:`)
};

export const api_sourcing_rfq_please_state = /** @type {(inputs: Api_Sourcing_Rfq_Please_StateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`For each line please state: unit price & currency, available quantity, pack size, lead time, delivery basis, freight, validity and payment terms, and attach SDS / TDS / certificates.`)
};

export const api_sourcing_rfq_subject = /** @type {(inputs: Api_Sourcing_Rfq_SubjectInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Request for quotation ${i?.reference}: reply by ${i?.due}`)
};

export const api_sourcing_rfq_to_port = /** @type {(inputs: Api_Sourcing_Rfq_To_PortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`to port`)
};

export const api_sourcing_sender_differs = /** @type {(inputs: Api_Sourcing_Sender_DiffersInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sent by ${i?.name}, but ${i?.reference} was sent to ${i?.invited}. A person checks it before it counts`)
};

export const api_sourcing_sender_domain = /** @type {(inputs: Api_Sourcing_Sender_DomainInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sender domain ${i?.domain} = ${i?.name}`)
};

export const api_sourcing_sender_unknown = /** @type {(inputs: Api_Sourcing_Sender_UnknownInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sender ${i?.sender} is not in the supplier list: new supplier`)
};

export const api_sourcing_sent_activity = /** @type {(inputs: Api_Sourcing_Sent_ActivityInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} supplier RFQ sent by ${i?.who} (${i?.mode}, client identity removed): ${i?.references}.`);
	return /** @type {LocalizedString} */ (`${i?.count} supplier RFQs sent by ${i?.who} (${i?.mode}, client identity removed): ${i?.references}.`)
};

export const api_sourcing_sent_event = /** @type {(inputs: Api_Sourcing_Sent_EventInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sent (client identity removed) · reminder 1 scheduled`)
};

export const api_sourcing_silent_activity = /** @type {(inputs: Api_Sourcing_Silent_ActivityInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.reference}: ${i?.name} silent after ${i?.after} reminders, escalated to the owner.`)
};

export const api_sourcing_silent_detail = /** @type {(inputs: Api_Sourcing_Silent_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.after} reminders sent · ${i?.caseId} quote due ${i?.due}. Call them or source elsewhere`)
};

export const api_sourcing_silent_title = /** @type {(inputs: Api_Sourcing_Silent_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} hasn't replied to ${i?.reference}`)
};

export const api_sourcing_sir_madam = /** @type {(inputs: Api_Sourcing_Sir_MadamInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sir / Madam`)
};

export const api_sourcing_specialist = /** @type {(inputs: Api_Sourcing_SpecialistInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Specialist in ${i?.category}`)
};

export const api_sourcing_step_draft = /** @type {(inputs: Api_Sourcing_Step_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Draft, not sent`)
};

export const api_sourcing_step_escalate = /** @type {(inputs: Api_Sourcing_Step_EscalateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Escalate to case owner`)
};

export const api_sourcing_step_reminder = /** @type {(inputs: Api_Sourcing_Step_ReminderInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Reminder ${i?.n}`)
};

export const api_sourcing_step_sent = /** @type {(inputs: Api_Sourcing_Step_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sent`)
};

export const api_sourcing_step_stopped = /** @type {(inputs: Api_Sourcing_Step_StoppedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.status}: reminders stopped`)
};

export const api_sourcing_step_uninvited = /** @type {(inputs: Api_Sourcing_Step_UninvitedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.status} without an invitation: reply matched by reference`)
};

export const api_sourcing_subject_changed = /** @type {(inputs: Api_Sourcing_Subject_ChangedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Subject changed (“${i?.subject}”): matched by reference, not by subject`)
};

export const api_sourcing_subject_kept = /** @type {(inputs: Api_Sourcing_Subject_KeptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Thread subject kept`)
};

export const api_sourcing_supplier = /** @type {(inputs: Api_Sourcing_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier`)
};

export const api_sourcing_supplier_history_source = /** @type {(inputs: Api_Sourcing_Supplier_History_SourceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Inbox history import: quoted ${i?.quoted} lines 2022–2025, never ordered`)
};

export const api_sourcing_template_label = /** @type {(inputs: Api_Sourcing_Template_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} · v${i?.version} (approved)`)
};

export const api_sourcing_uncertain_review = /** @type {(inputs: Api_Sourcing_Uncertain_ReviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Uncertain, sent to the review queue`)
};

export const api_sourcing_unclassifiable = /** @type {(inputs: Api_Sourcing_UnclassifiableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No reference, no thread, unknown sender: a person classifies it`)
};

export const api_sourcing_vessel_history_note = /** @type {(inputs: Api_Sourcing_Vessel_History_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Found in inbox history: ${i?.calls} calls (${i?.ports}).`)
};

export const api_sourcing_was_asked_on = /** @type {(inputs: Api_Sourcing_Was_Asked_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} was asked on ${i?.reference} (${i?.status})`)
};

export const api_sourcing_your_vessel = /** @type {(inputs: Api_Sourcing_Your_VesselInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`your vessel`)
};

export const api_visuals_arrives = /** @type {(inputs: Api_Visuals_ArrivesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} arrives`)
};

export const api_visuals_calendar_arrives = /** @type {(inputs: Api_Visuals_Calendar_ArrivesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Arrives · ${i?.name}`)
};

export const api_visuals_calendar_delivery = /** @type {(inputs: Api_Visuals_Calendar_DeliveryInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Delivery ${i?.number} · ${i?.status}`)
};

export const api_visuals_calendar_invoice_due = /** @type {(inputs: Api_Visuals_Calendar_Invoice_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Invoice ${i?.number} due · ${i?.customer}`)
};

export const api_visuals_calendar_quote_due = /** @type {(inputs: Api_Visuals_Calendar_Quote_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Quote due · ${i?.name}`)
};

export const api_visuals_days = /** @type {(inputs: Api_Visuals_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} d`)
};

export const api_visuals_gp_actual = /** @type {(inputs: Api_Visuals_Gp_ActualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Actual`)
};

export const api_visuals_gp_at_quote = /** @type {(inputs: Api_Visuals_Gp_At_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`At quote`)
};

export const api_visuals_gp_freight = /** @type {(inputs: Api_Visuals_Gp_FreightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Freight`)
};

export const api_visuals_gp_fx = /** @type {(inputs: Api_Visuals_Gp_FxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`FX`)
};

export const api_visuals_gp_recovered = /** @type {(inputs: Api_Visuals_Gp_RecoveredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Recovered`)
};

export const api_visuals_gp_supplier_prices = /** @type {(inputs: Api_Visuals_Gp_Supplier_PricesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier prices`)
};

export const api_visuals_minutes = /** @type {(inputs: Api_Visuals_MinutesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} min`)
};

export const api_visuals_quote_due = /** @type {(inputs: Api_Visuals_Quote_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name}: quote due`)
};

export const api_visuals_target_acknowledge = /** @type {(inputs: Api_Visuals_Target_AcknowledgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Time to acknowledge`)
};

export const api_visuals_target_on_time = /** @type {(inputs: Api_Visuals_Target_On_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deliveries on time, 6 weeks`)
};

export const api_visuals_target_turnaround = /** @type {(inputs: Api_Visuals_Target_TurnaroundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quote turnaround`)
};

export const api_visuals_target_win_rate = /** @type {(inputs: Api_Visuals_Target_Win_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Win rate, 12 weeks`)
};

export const automations_ai_note = /** @type {(inputs: Automations_Ai_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`drafts only, confidence on every value`)
};

export const automations_auto_assign = /** @type {(inputs: Automations_Auto_AssignInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Assign owners, update proven events, calculate waiting times`)
};

export const automations_auto_calculate = /** @type {(inputs: Automations_Auto_CalculateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Calculate costs, FX conversions, margins and comparisons`)
};

export const automations_auto_capture = /** @type {(inputs: Automations_Auto_CaptureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Capture emails, link files, extract draft data, spot likely duplicates`)
};

export const automations_auto_prepare = /** @type {(inputs: Automations_Auto_PrepareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prepare linked quotations, POs, bills and invoice drafts`)
};

export const automations_auto_remind = /** @type {(inputs: Automations_Auto_RemindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create reminders, escalations, dashboards and daily briefings`)
};

export const automations_confirm_heading = /** @type {(inputs: Automations_Confirm_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mark as reviewed?`)
};

export const automations_confirm_label = /** @type {(inputs: Automations_Confirm_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirm reviewed`)
};

export const automations_confirm_text = /** @type {(inputs: Automations_Confirm_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.title}
Confirm you checked the flagged fields at the source. Your name goes on the audit log; the AI's values are never applied without this.`)
};

export const automations_enabled_note = /** @type {(inputs: Automations_Enabled_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`every one explicit`)
};

export const automations_figure_ai = /** @type {(inputs: Automations_Figure_AiInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI-assisted`)
};

export const automations_figure_enabled = /** @type {(inputs: Automations_Figure_EnabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rules enabled`)
};

export const automations_mark_reviewed = /** @type {(inputs: Automations_Mark_ReviewedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mark reviewed`)
};

export const automations_of_rules = /** @type {(inputs: Automations_Of_RulesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} of ${i?.total} rules`)
};

export const automations_open = /** @type {(inputs: Automations_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open`)
};

export const automations_people_commitments = /** @type {(inputs: Automations_People_CommitmentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Commercial commitments, accounting postings and payments`)
};

export const automations_people_messages = /** @type {(inputs: Automations_People_MessagesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`External messages and follow-ups unless explicitly pre-approved`)
};

export const automations_people_overrides = /** @type {(inputs: Automations_People_OverridesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Owner overrides, exception resolution, discretionary closure`)
};

export const automations_people_prices = /** @type {(inputs: Automations_People_PricesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Final selling prices, discounts, substitutions, supplier selection`)
};

export const automations_people_uncertain = /** @type {(inputs: Automations_People_UncertainInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Uncertain matches, technical interpretation, missing information`)
};

export const automations_review_empty = /** @type {(inputs: Automations_Review_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing waiting for review.`)
};

export const automations_review_note = /** @type {(inputs: Automations_Review_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Below the confidence threshold the AI never applies a value: it leaves the field blank or the match unlinked and waits here for a person.`)
};

export const automations_reviewed_done = /** @type {(inputs: Automations_Reviewed_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reviewed. Your name is on the audit log`)
};

export const case_overview_delivered = /** @type {(inputs: Case_Overview_DeliveredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delivered`)
};

export const case_overview_ended = /** @type {(inputs: Case_Overview_EndedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`The case ended here: ${i?.next}`)
};

export const case_overview_gauge_a11y = /** @type {(inputs: Case_Overview_Gauge_A11yInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.label}: ${i?.value} of ${i?.total} lines`)
};

export const case_overview_invoiced = /** @type {(inputs: Case_Overview_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoiced`)
};

export const case_overview_ordered = /** @type {(inputs: Case_Overview_OrderedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ordered`)
};

export const case_overview_paused = /** @type {(inputs: Case_Overview_PausedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Paused at the customer's decision: ${i?.next}`)
};

export const case_overview_phase = /** @type {(inputs: Case_Overview_PhaseInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Phase ${i?.phase}`)
};

export const case_overview_received = /** @type {(inputs: Case_Overview_ReceivedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Received`)
};

export const case_overview_step = /** @type {(inputs: Case_Overview_StepInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Step ${i?.step} of ${i?.total}`)
};

export const case_overview_summary_context = /** @type {(inputs: Case_Overview_Summary_ContextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The activity log of a ship-supply case at Golden Sea, from the customer's RFQ to payment. Say where it stands and what is blocking it.`)
};

export const case_overview_summary_label = /** @type {(inputs: Case_Overview_Summary_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Catch me up on this case`)
};

export const cash_amount_paid = /** @type {(inputs: Cash_Amount_PaidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amount paid`)
};

export const cash_applied = /** @type {(inputs: Cash_AppliedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Applied`)
};

export const cash_applied_alert = /** @type {(inputs: Cash_Applied_AlertInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`New details applied to ${i?.supplier} and verified. Payments can use them.`)
};

export const cash_apply_bank_details = /** @type {(inputs: Cash_Apply_Bank_DetailsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Apply new bank details`)
};

export const cash_apply_details = /** @type {(inputs: Cash_Apply_DetailsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Apply details`)
};

export const cash_apply_done = /** @type {(inputs: Cash_Apply_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`New bank details applied to ${i?.supplier}, verified by two people.`)
};

export const cash_apply_heading = /** @type {(inputs: Cash_Apply_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Apply the new bank details to ${i?.supplier}?`)
};

export const cash_apply_text = /** @type {(inputs: Cash_Apply_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Two people approved the change. From now on payments to this supplier go to the new account.`)
};

export const cash_bank_reference = /** @type {(inputs: Cash_Bank_ReferenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bank reference`)
};

export const cash_bridge_label = /** @type {(inputs: Cash_Bridge_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cash, next 8 weeks`)
};

export const cash_bridge_note = /** @type {(inputs: Cash_Bridge_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expected receipts less committed supplier payments and the budget's fixed costs`)
};

export const cash_call_back_on = /** @type {(inputs: Cash_Call_Back_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Call back on`)
};

export const cash_currency = /** @type {(inputs: Cash_CurrencyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Currency`)
};

export const cash_current_account = /** @type {(inputs: Cash_Current_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Current account`)
};

export const cash_fixed_costs = /** @type {(inputs: Cash_Fixed_CostsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fixed costs`)
};

export const cash_forecast_label = /** @type {(inputs: Cash_Forecast_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cash in vs out, next 8 weeks`)
};

export const cash_forecast_subhead = /** @type {(inputs: Cash_Forecast_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`EGP thousands, by week. Receipts by invoice due date (overdue counted this week, chronic late payers a week later); payments by bill and balance due dates. Bills on hold are left out until they match.`)
};

export const cash_forecast_subhead_fixed = /** @type {(inputs: Cash_Forecast_Subhead_FixedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`EGP thousands, by week. Receipts by invoice due date (overdue counted this week, chronic late payers a week later); payments by bill and balance due dates, plus ${i?.fixed} a week of fixed costs from the budget. Bills on hold are left out until they match.`)
};

export const cash_held_alert = /** @type {(inputs: Cash_Held_AlertInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Payments to ${i?.supplier} stay on the old, verified account until two different people, Finance and the CEO, approve after a call-back on the number on file.`)
};

export const cash_invoice_numbers = /** @type {(inputs: Cash_Invoice_NumbersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoice numbers`)
};

export const cash_invoice_numbers_hint = /** @type {(inputs: Cash_Invoice_Numbers_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every invoice number mentioned, comma-separated.`)
};

export const cash_match_prompt = /** @type {(inputs: Cash_Match_PromptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Match a remittance`)
};

export const cash_net_8_weeks = /** @type {(inputs: Cash_Net_8_WeeksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Net cash, 8 weeks`)
};

export const cash_net_cash = /** @type {(inputs: Cash_Net_CashInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Net cash`)
};

export const cash_net_note = /** @type {(inputs: Cash_Net_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expected receipts − committed payments − fixed costs`)
};

export const cash_never = /** @type {(inputs: Cash_NeverInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Never: ${i?.phone}`)
};

export const cash_no_open_invoices = /** @type {(inputs: Cash_No_Open_InvoicesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No open invoices to match.`)
};

export const cash_on_this_device = /** @type {(inputs: Cash_On_This_DeviceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`On this device`)
};

export const cash_paid_by = /** @type {(inputs: Cash_Paid_ByInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paid by`)
};

export const cash_read_and_match = /** @type {(inputs: Cash_Read_And_MatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Read and match`)
};

export const cash_receipts = /** @type {(inputs: Cash_ReceiptsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receipts`)
};

export const cash_remittance_placeholder = /** @type {(inputs: Cash_Remittance_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paste the remittance or payment advice…`)
};

export const cash_remittance_text = /** @type {(inputs: Cash_Remittance_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paste a customer's payment advice or remittance email: the invoice numbers and amount are read on this device, then matched to open invoices (by number, or by an equal balance). A person records the payment.`)
};

export const cash_request_came_by = /** @type {(inputs: Cash_Request_Came_ByInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Request came by`)
};

export const cash_requested = /** @type {(inputs: Cash_RequestedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Requested`)
};

export const cash_requested_value = /** @type {(inputs: Cash_Requested_ValueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.bank} · ${i?.iban}`)
};

export const cash_series_in = /** @type {(inputs: Cash_Series_InInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cash in (expected receipts)`)
};

export const cash_series_out = /** @type {(inputs: Cash_Series_OutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cash out (payables + fixed costs)`)
};

export const cash_status_approved = /** @type {(inputs: Cash_Status_ApprovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approved`)
};

export const cash_status_approved_1_of_2 = /** @type {(inputs: Cash_Status_Approved_1_Of_2Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approved 1 of 2`)
};

export const cash_status_pending = /** @type {(inputs: Cash_Status_PendingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pending`)
};

export const cash_status_rejected = /** @type {(inputs: Cash_Status_RejectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rejected`)
};

export const cash_step_applied = /** @type {(inputs: Cash_Step_AppliedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Applied & verified`)
};

export const cash_step_call_back = /** @type {(inputs: Cash_Step_Call_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Call-back on number on file`)
};

export const cash_step_first_approval = /** @type {(inputs: Cash_Step_First_ApprovalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`First approval`)
};

export const cash_step_request_received = /** @type {(inputs: Cash_Step_Request_ReceivedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Request received`)
};

export const cash_step_second_approval = /** @type {(inputs: Cash_Step_Second_ApprovalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Second approval`)
};

export const cash_suppliers = /** @type {(inputs: Cash_SuppliersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suppliers`)
};

export const cash_waiting_for_approver = /** @type {(inputs: Cash_Waiting_For_ApproverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Waiting for an approver.`)
};

export const cash_you_decided = /** @type {(inputs: Cash_You_DecidedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`You have decided. A second, different person must approve.`)
};

export const commercial_acceptance_done = /** @type {(inputs: Commercial_Acceptance_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Line ${i?.line}: customer acceptance recorded.`)
};

export const commercial_acceptance_text = /** @type {(inputs: Commercial_Acceptance_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Line ${i?.line} uses an alternative pack. The quotation can only show it as accepted with the customer's written confirmation.`)
};

export const commercial_accepted_in_writing = /** @type {(inputs: Commercial_Accepted_In_WritingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer accepted in writing`)
};

export const commercial_all_lines_priced = /** @type {(inputs: Commercial_All_Lines_PricedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`all lines priced`)
};

export const commercial_allocation_lines = /** @type {(inputs: Commercial_Allocation_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Equal per line`)
};

export const commercial_allocation_qty = /** @type {(inputs: Commercial_Allocation_QtyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`By quantity`)
};

export const commercial_allocation_value = /** @type {(inputs: Commercial_Allocation_ValueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`By line value`)
};

export const commercial_approval_pending = /** @type {(inputs: Commercial_Approval_PendingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.title} · ${i?.status}. Karim Balbaa decides in Approvals.`)
};

export const commercial_approval_requested_done = /** @type {(inputs: Commercial_Approval_Requested_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approval requested from Karim Balbaa. He decides in Approvals.`)
};

export const commercial_approval_requested_short = /** @type {(inputs: Commercial_Approval_Requested_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approval requested from Karim Balbaa.`)
};

export const commercial_approval_rule = /** @type {(inputs: Commercial_Approval_RuleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Rule: every customer quotation, discounts above ${i?.max}% and margin exceptions go to Karim Balbaa. Exceptions travel with the request.`)
};

export const commercial_approve = /** @type {(inputs: Commercial_ApproveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approve`)
};

export const commercial_approved_done = /** @type {(inputs: Commercial_Approved_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Approved ${i?.number}: it can be sent`)
};

export const commercial_charge_actual = /** @type {(inputs: Commercial_Charge_ActualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Actual`)
};

export const commercial_charge_confirmed = /** @type {(inputs: Commercial_Charge_ConfirmedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirmed`)
};

export const commercial_charge_estimate = /** @type {(inputs: Commercial_Charge_EstimateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Estimate`)
};

export const commercial_charges_allocated = /** @type {(inputs: Commercial_Charges_AllocatedInputs) => LocalizedString} */ (i) => {
	if (i?.allocation === "value") return /** @type {LocalizedString} */ (`Allocated by line value. Estimates are marked; actuals replace them at close.`);
	if (i?.allocation === "qty") return /** @type {LocalizedString} */ (`Allocated by quantity. Estimates are marked; actuals replace them at close.`);
	if (i?.allocation === "lines") return /** @type {LocalizedString} */ (`Allocated equal per line. Estimates are marked; actuals replace them at close.`);
	return /** @type {LocalizedString} */ (`Allocated ${i?.allocation}. Estimates are marked; actuals replace them at close.`)
};

export const commercial_charges_vat = /** @type {(inputs: Commercial_Charges_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`VAT: supply to a foreign vessel in transit is expected at 0%, which finance confirms. The quotation shows prices excl. VAT.`)
};

export const commercial_check_again = /** @type {(inputs: Commercial_Check_AgainInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Check again`)
};

export const commercial_check_no = /** @type {(inputs: Commercial_Check_NoInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier}: may differ from the request, check`)
};

export const commercial_check_offer = /** @type {(inputs: Commercial_Check_OfferInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Offer ${i?.n} from ${i?.supplier}: ${i?.offered}. Supplier note: ${i?.note}.`)
};

export const commercial_check_offers = /** @type {(inputs: Commercial_Check_OffersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Check offers against the request`)
};

export const commercial_check_question = /** @type {(inputs: Commercial_Check_QuestionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Does offer ${i?.n} (${i?.supplier}) match the requested item: the same product, brand or an approved equivalent, unit and pack size?`)
};

export const commercial_check_requested = /** @type {(inputs: Commercial_Check_RequestedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Requested: ${i?.description}, ${i?.requested}. Rules: ${i?.rules}.`)
};

export const commercial_check_yes = /** @type {(inputs: Commercial_Check_YesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier}: matches the request`)
};

export const commercial_col_amount = /** @type {(inputs: Commercial_Col_AmountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amount`)
};

export const commercial_col_approved_quote = /** @type {(inputs: Commercial_Col_Approved_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approved quote`)
};

export const commercial_col_charge = /** @type {(inputs: Commercial_Col_ChargeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Charge`)
};

export const commercial_col_checks = /** @type {(inputs: Commercial_Col_ChecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Checks`)
};

export const commercial_col_field = /** @type {(inputs: Commercial_Col_FieldInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Field`)
};

export const commercial_col_landed = /** @type {(inputs: Commercial_Col_LandedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Landed`)
};

export const commercial_col_landed_per = /** @type {(inputs: Commercial_Col_Landed_PerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Landed · EGP / ${i?.unit}`)
};

export const commercial_col_lead = /** @type {(inputs: Commercial_Col_LeadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lead`)
};

export const commercial_col_line_supplier = /** @type {(inputs: Commercial_Col_Line_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Line · selected supplier(s)`)
};

export const commercial_col_margin_pct = /** @type {(inputs: Commercial_Col_Margin_PctInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Margin %`)
};

export const commercial_col_markup = /** @type {(inputs: Commercial_Col_MarkupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Markup`)
};

export const commercial_col_match = /** @type {(inputs: Commercial_Col_MatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Match`)
};

export const commercial_col_offered = /** @type {(inputs: Commercial_Col_OfferedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Offered`)
};

export const commercial_col_plus_shared = /** @type {(inputs: Commercial_Col_Plus_SharedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`+ Shared`)
};

export const commercial_col_portal = /** @type {(inputs: Commercial_Col_PortalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Portal`)
};

export const commercial_col_price_offered = /** @type {(inputs: Commercial_Col_Price_OfferedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Price (as offered)`)
};

export const commercial_col_sell = /** @type {(inputs: Commercial_Col_SellInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sell (${i?.currency})`)
};

export const commercial_col_status = /** @type {(inputs: Commercial_Col_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Status`)
};

export const commercial_col_supplier = /** @type {(inputs: Commercial_Col_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier`)
};

export const commercial_col_terms = /** @type {(inputs: Commercial_Col_TermsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Valid · terms · basis`)
};

export const commercial_col_unit = /** @type {(inputs: Commercial_Col_UnitInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Unit (${i?.currency})`)
};

export const commercial_col_unit_price = /** @type {(inputs: Commercial_Col_Unit_PriceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Unit price · EGP / ${i?.unit}`)
};

export const commercial_compare_by = /** @type {(inputs: Commercial_Compare_ByInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Compare by`)
};

export const commercial_continue_pricing = /** @type {(inputs: Commercial_Continue_PricingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Continue to pricing`)
};

export const commercial_correction_note = /** @type {(inputs: Commercial_Correction_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The client is never named to the supplier. v1 stays on the case for audit; only a corrected version can be priced.`)
};

export const commercial_correction_sent = /** @type {(inputs: Commercial_Correction_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Correction request sent. The offer stays blocked until a corrected version arrives.`)
};

export const commercial_coverage = /** @type {(inputs: Commercial_CoverageInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.pct}% of requested`)
};

export const commercial_coverage_expiry = /** @type {(inputs: Commercial_Coverage_ExpiryInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.pct}% of requested · exp. ${i?.expiry}`)
};

export const commercial_create_revision = /** @type {(inputs: Commercial_Create_RevisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create revision`)
};

export const commercial_currency = /** @type {(inputs: Commercial_CurrencyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Currency`)
};

export const commercial_customer = /** @type {(inputs: Commercial_CustomerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`customer`)
};

export const commercial_customer_decision = /** @type {(inputs: Commercial_Customer_DecisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer decision`)
};

export const commercial_customer_discount = /** @type {(inputs: Commercial_Customer_DiscountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer discount %`)
};

export const commercial_customer_portal = /** @type {(inputs: Commercial_Customer_PortalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer portal`)
};

export const commercial_customers_portal = /** @type {(inputs: Commercial_Customers_PortalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`the customer's portal`)
};

export const commercial_decision = /** @type {(inputs: Commercial_DecisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Decision`)
};

export const commercial_decision_lost = /** @type {(inputs: Commercial_Decision_LostInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lost`)
};

export const commercial_decision_note_label = /** @type {(inputs: Commercial_Decision_Note_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Note (the lost reason, if lost)`)
};

export const commercial_decision_partially_won = /** @type {(inputs: Commercial_Decision_Partially_WonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Partially won`)
};

export const commercial_decision_placeholder = /** @type {(inputs: Commercial_Decision_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`e.g. PO NSM-PO-77231 received for lines 1–3`)
};

export const commercial_decision_revision_requested = /** @type {(inputs: Commercial_Decision_Revision_RequestedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revision requested`)
};

export const commercial_decision_text = /** @type {(inputs: Commercial_Decision_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`The customer's decision on ${i?.number}. No response never means lost.`)
};

export const commercial_decision_won = /** @type {(inputs: Commercial_Decision_WonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Won`)
};

export const commercial_difference = /** @type {(inputs: Commercial_DifferenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Difference`)
};

export const commercial_email_from_odoo = /** @type {(inputs: Commercial_Email_From_OdooInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Email from Odoo`)
};

export const commercial_email_to = /** @type {(inputs: Commercial_Email_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`To: ${i?.to}`)
};

export const commercial_eta_days = /** @type {(inputs: Commercial_Eta_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`ETA ${i?.day} · ${i?.days} days`)
};

export const commercial_evidence = /** @type {(inputs: Commercial_EvidenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Evidence`)
};

export const commercial_evidence_default = /** @type {(inputs: Commercial_Evidence_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer email 17 Nov 10:12: “500 ml cans OK”, attached`)
};

export const commercial_exceptions = /** @type {(inputs: Commercial_ExceptionsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} exception, shown to the approver as “${i?.type}”.`);
	return /** @type {LocalizedString} */ (`${i?.count} exceptions, shown to the approver as “${i?.type}”.`)
};

export const commercial_fig_expected_profit = /** @type {(inputs: Commercial_Fig_Expected_ProfitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expected gross profit`)
};

export const commercial_fig_input_vat = /** @type {(inputs: Commercial_Fig_Input_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Recoverable input VAT`)
};

export const commercial_fig_landed = /** @type {(inputs: Commercial_Fig_LandedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Landed cost (priced lines)`)
};

export const commercial_fig_lines_priced = /** @type {(inputs: Commercial_Fig_Lines_PricedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lines priced`)
};

export const commercial_fig_margin = /** @type {(inputs: Commercial_Fig_MarginInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Margin = profit ÷ selling price`)
};

export const commercial_fig_markup = /** @type {(inputs: Commercial_Fig_MarkupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Markup = profit ÷ landed cost`)
};

export const commercial_fig_selling = /** @type {(inputs: Commercial_Fig_SellingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Selling total (excl. VAT)`)
};

export const commercial_gross_profit = /** @type {(inputs: Commercial_Gross_ProfitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gross profit`)
};

export const commercial_how_compared = /** @type {(inputs: Commercial_How_ComparedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Each offer is checked against the original line and normalised to the requested base unit (EA / L / kg) in EGP at the approved FX rate, keeping the supplier's own units and currency. Landed cost adds the freight to ${i?.port} (lane rates, import costs for agency lines). AI suggests matches and deviations; technical equivalence is a person's decision.`)
};

export const commercial_landed_cost = /** @type {(inputs: Commercial_Landed_CostInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Landed cost`)
};

export const commercial_landed_note_confirmed = /** @type {(inputs: Commercial_Landed_Note_ConfirmedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`incl. ${i?.charges} shared charges · all confirmed`)
};

export const commercial_landed_note_estimates = /** @type {(inputs: Commercial_Landed_Note_EstimatesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`incl. ${i?.charges} shared charges · ${i?.count} estimate`)
};

export const commercial_language = /** @type {(inputs: Commercial_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Language`)
};

export const commercial_lead_days = /** @type {(inputs: Commercial_Lead_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.days} d`)
};

export const commercial_letter_body = /** @type {(inputs: Commercial_Letter_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Please find attached our quotation ${i?.number} for ${i?.vessel} (your ref. ${i?.ref}), delivery on board at ${i?.port}.`)
};

export const commercial_letter_company = /** @type {(inputs: Commercial_Letter_CompanyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Golden Sea for Trading & Marketing`)
};

export const commercial_letter_dear = /** @type {(inputs: Commercial_Letter_DearInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Dear ${i?.name},`)
};

export const commercial_letter_regards = /** @type {(inputs: Commercial_Letter_RegardsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Best regards,`)
};

export const commercial_letter_valid = /** @type {(inputs: Commercial_Letter_ValidInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Valid until ${i?.day}. Prices exclude VAT.`)
};

export const commercial_line_requested = /** @type {(inputs: Commercial_Line_RequestedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.description} · requested ${i?.requested}`)
};

export const commercial_lines_selected = /** @type {(inputs: Commercial_Lines_SelectedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.selected} of ${i?.total} lines selected`)
};

export const commercial_margin_for_line = /** @type {(inputs: Commercial_Margin_For_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Margin for line ${i?.line}`)
};

export const commercial_margin_markup = /** @type {(inputs: Commercial_Margin_MarkupInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Margin ${i?.margin} · markup ${i?.markup}`)
};

export const commercial_margin_note = /** @type {(inputs: Commercial_Margin_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.profit} ÷ ${i?.sell} · the policy is set on margin`)
};

export const commercial_margin_per_line = /** @type {(inputs: Commercial_Margin_Per_LineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Margin % per line`)
};

export const commercial_margin_vs_target = /** @type {(inputs: Commercial_Margin_Vs_TargetInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`margin against the ${i?.target}% target`)
};

export const commercial_markup_note = /** @type {(inputs: Commercial_Markup_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.profit} ÷ ${i?.landed} · a 25% margin is a 33.3% markup`)
};

export const commercial_match = /** @type {(inputs: Commercial_MatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Match`)
};

export const commercial_message = /** @type {(inputs: Commercial_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Message`)
};

export const commercial_metric_freight = /** @type {(inputs: Commercial_Metric_FreightInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`+ ${i?.freight} · ${i?.note}`)
};

export const commercial_metric_landed = /** @type {(inputs: Commercial_Metric_LandedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`landed ${i?.amount}`)
};

export const commercial_metric_no_freight = /** @type {(inputs: Commercial_Metric_No_FreightInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`no freight · ${i?.note}`)
};

export const commercial_no_exceptions = /** @type {(inputs: Commercial_No_ExceptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No exceptions. Standard approval.`)
};

export const commercial_no_issues = /** @type {(inputs: Commercial_No_IssuesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No issues`)
};

export const commercial_no_lines_yet = /** @type {(inputs: Commercial_No_Lines_YetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`no lines requested yet`)
};

export const commercial_no_offers = /** @type {(inputs: Commercial_No_OffersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No offers yet.`)
};

export const commercial_no_recommendation = /** @type {(inputs: Commercial_No_RecommendationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No offer passes every check yet, so there is no recommendation.`)
};

export const commercial_none = /** @type {(inputs: Commercial_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`none`)
};

export const commercial_not_sent_yet = /** @type {(inputs: Commercial_Not_Sent_YetInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Not sent to suppliers yet: ${i?.missing}. Waiting for the customer's answer.`)
};

export const commercial_note_approver_placeholder = /** @type {(inputs: Commercial_Note_Approver_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`e.g. Helmets split to make the ETA; launch estimate confirmed tomorrow`)
};

export const commercial_note_for_approver = /** @type {(inputs: Commercial_Note_For_ApproverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Note for the approver`)
};

export const commercial_of_selling_price = /** @type {(inputs: Commercial_Of_Selling_PriceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`of the selling price`)
};

export const commercial_of_the_lines = /** @type {(inputs: Commercial_Of_The_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`of the lines`)
};

export const commercial_offer_version = /** @type {(inputs: Commercial_Offer_VersionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} v${i?.version}`)
};

export const commercial_ok = /** @type {(inputs: Commercial_OkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`OK`)
};

export const commercial_on_top_landed = /** @type {(inputs: Commercial_On_Top_LandedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`on top of landed cost`)
};

export const commercial_open_approvals = /** @type {(inputs: Commercial_Open_ApprovalsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open approvals`)
};

export const commercial_paper_address = /** @type {(inputs: Commercial_Paper_AddressInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`6th of October City, Giza Governorate · demo document`)
};

export const commercial_paper_attention = /** @type {(inputs: Commercial_Paper_AttentionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Attention`)
};

export const commercial_paper_brand = /** @type {(inputs: Commercial_Paper_BrandInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`FOR TRADING & MARKETING · EST. 2011`)
};

export const commercial_paper_client = /** @type {(inputs: Commercial_Paper_ClientInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Client Information`)
};

export const commercial_paper_company = /** @type {(inputs: Commercial_Paper_CompanyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Company`)
};

export const commercial_paper_converted = /** @type {(inputs: Commercial_Paper_ConvertedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Converted at ${i?.currency}/EGP ${i?.fx} (approved rate on the quotation).`)
};

export const commercial_paper_date = /** @type {(inputs: Commercial_Paper_DateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Date: ${i?.date}`)
};

export const commercial_paper_delivery = /** @type {(inputs: Commercial_Paper_DeliveryInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Delivery: on board at ${i?.port} on arrival (${i?.eta}).`)
};

export const commercial_paper_desc = /** @type {(inputs: Commercial_Paper_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Description`)
};

export const commercial_paper_discount = /** @type {(inputs: Commercial_Paper_DiscountInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Less discount ${i?.pct}%`)
};

export const commercial_paper_draft = /** @type {(inputs: Commercial_Paper_DraftInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`DRAFT: not yet approved. Will be issued as version ${i?.version}.`)
};

export const commercial_paper_grand = /** @type {(inputs: Commercial_Paper_GrandInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Total in ${i?.currency} (excl. VAT)`)
};

export const commercial_paper_intro = /** @type {(inputs: Commercial_Paper_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`We are pleased to furnish our quotation as below:`)
};

export const commercial_paper_no = /** @type {(inputs: Commercial_Paper_NoInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Quotation No.: ${i?.number}`)
};

export const commercial_paper_part = /** @type {(inputs: Commercial_Paper_PartInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Part Number`)
};

export const commercial_paper_pay = /** @type {(inputs: Commercial_Paper_PayInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Payment terms: ${i?.terms}.`)
};

export const commercial_paper_port = /** @type {(inputs: Commercial_Paper_PortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delivery port`)
};

export const commercial_paper_port_eta = /** @type {(inputs: Commercial_Paper_Port_EtaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.port} · ETA ${i?.eta}`)
};

export const commercial_paper_prepared = /** @type {(inputs: Commercial_Paper_PreparedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Prepared by: ${i?.prepared}`)
};

export const commercial_paper_prepared_approved = /** @type {(inputs: Commercial_Paper_Prepared_ApprovedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Prepared by: ${i?.prepared} · Approved by: ${i?.approved}`)
};

export const commercial_paper_price = /** @type {(inputs: Commercial_Paper_PriceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Price/${i?.currency}`)
};

export const commercial_paper_qty = /** @type {(inputs: Commercial_Paper_QtyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`QTY`)
};

export const commercial_paper_qty_rule = /** @type {(inputs: Commercial_Paper_Qty_RuleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`QTY in the quote can’t be reduced; prices are based on the QTY listed.`)
};

export const commercial_paper_ref = /** @type {(inputs: Commercial_Paper_RefInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Your ref: ${i?.ref}`)
};

export const commercial_paper_remarks = /** @type {(inputs: Commercial_Paper_RemarksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remarks:`)
};

export const commercial_paper_s = /** @type {(inputs: Commercial_Paper_SInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`S.`)
};

export const commercial_paper_signature = /** @type {(inputs: Commercial_Paper_SignatureInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name}, authorised signature`)
};

export const commercial_paper_signature_pending = /** @type {(inputs: Commercial_Paper_Signature_PendingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signature on approval`)
};

export const commercial_paper_superseded = /** @type {(inputs: Commercial_Paper_SupersededInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Superseded: kept for audit. Not valid for ordering.`)
};

export const commercial_paper_title = /** @type {(inputs: Commercial_Paper_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`QUOTATION`)
};

export const commercial_paper_total = /** @type {(inputs: Commercial_Paper_TotalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Total/${i?.currency}`)
};

export const commercial_paper_uom = /** @type {(inputs: Commercial_Paper_UomInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`UOM`)
};

export const commercial_paper_valid = /** @type {(inputs: Commercial_Paper_ValidInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Valid until ${i?.day}; may be renewed thereafter upon mutual agreement.`)
};

export const commercial_paper_vat = /** @type {(inputs: Commercial_Paper_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prices are exclusive of Value Added Tax (VAT).`)
};

export const commercial_paper_vessel = /** @type {(inputs: Commercial_Paper_VesselInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vessel`)
};

export const commercial_paper_wish = /** @type {(inputs: Commercial_Paper_WishInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wish our offer wins your approvals ☺`)
};

export const commercial_policy_note = /** @type {(inputs: Commercial_Policy_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Policy: target ${i?.target}%, minimum ${i?.min}% (per store where set), discounts above ${i?.max}% need approval. ${i?.fx}.`)
};

export const commercial_policy_target = /** @type {(inputs: Commercial_Policy_TargetInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`policy target ${i?.target}%`)
};

export const commercial_portal_all_match = /** @type {(inputs: Commercial_Portal_All_MatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All fields match. Submission complete.`)
};

export const commercial_portal_diffs = /** @type {(inputs: Commercial_Portal_DiffsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Not marked complete: ${i?.fields} differ. Correct it in the portal or record the customer's agreement.`)
};

export const commercial_portal_empty = /** @type {(inputs: Commercial_Portal_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No screenshot compared yet.`)
};

export const commercial_portal_note = /** @type {(inputs: Commercial_Portal_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`For customers who buy through a procurement portal: upload the confirmation screenshot and the AI compares it with the approved quotation. The submission is complete only when every field matches.`)
};

export const commercial_preview_quote = /** @type {(inputs: Commercial_Preview_QuoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Preview ${i?.number}`)
};

export const commercial_price_build_up = /** @type {(inputs: Commercial_Price_Build_UpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Price build-up per line`)
};

export const commercial_price_note = /** @type {(inputs: Commercial_Price_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`per ${i?.per} · total ${i?.total}`)
};

export const commercial_pricing_policy = /** @type {(inputs: Commercial_Pricing_PolicyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pricing policy`)
};

export const commercial_print = /** @type {(inputs: Commercial_PrintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Print`)
};

export const commercial_profit_share = /** @type {(inputs: Commercial_Profit_ShareInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.pct} of it is profit`)
};

export const commercial_quantity_from = /** @type {(inputs: Commercial_Quantity_FromInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Quantity from ${i?.supplier}`)
};

export const commercial_quote_approved = /** @type {(inputs: Commercial_Quote_ApprovedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} approved and ready to send.`)
};

export const commercial_quote_returned = /** @type {(inputs: Commercial_Quote_ReturnedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} was returned. Adjust the pricing and request again.`)
};

export const commercial_ready = /** @type {(inputs: Commercial_ReadyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`ready ${i?.day}`)
};

export const commercial_reason = /** @type {(inputs: Commercial_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reason`)
};

export const commercial_reason_best = /** @type {(inputs: Commercial_Reason_BestInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This is the best-fit choice. A reason is optional.`)
};

export const commercial_reason_not_best = /** @type {(inputs: Commercial_Reason_Not_BestInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not the best-fit offer: give a reason. It's kept on the case and shown to the approver.`)
};

export const commercial_reason_placeholder = /** @type {(inputs: Commercial_Reason_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`e.g. Delta is our approved helmet supplier; Nile only has 10 in stock`)
};

export const commercial_recommendation_best = /** @type {(inputs: Commercial_Recommendation_BestInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.offer}: ${i?.landed} EGP / ${i?.baseUnit} landed, the lowest cost on board among offers that pass every check.`)
};

export const commercial_recommendation_heading = /** @type {(inputs: Commercial_Recommendation_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Recommendation · Suggested`)
};

export const commercial_recommendation_split = /** @type {(inputs: Commercial_Recommendation_SplitInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Split sourcing: ${i?.split}, ${i?.cost} landed, all before ETA.`)
};

export const commercial_recommendation_split_saves = /** @type {(inputs: Commercial_Recommendation_Split_SavesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Split sourcing: ${i?.split}, ${i?.cost} landed, saves ${i?.saves} vs the best single supplier, all before ETA.`)
};

export const commercial_record = /** @type {(inputs: Commercial_RecordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Record`)
};

export const commercial_record_acceptance = /** @type {(inputs: Commercial_Record_AcceptanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Record customer acceptance`)
};

export const commercial_record_acceptance_confirm = /** @type {(inputs: Commercial_Record_Acceptance_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Record acceptance`)
};

export const commercial_record_decision = /** @type {(inputs: Commercial_Record_DecisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Record customer decision`)
};

export const commercial_request_approval = /** @type {(inputs: Commercial_Request_ApprovalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Request approval`)
};

export const commercial_request_approval_text = /** @type {(inputs: Commercial_Request_Approval_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Creates the customer quotation (${i?.lines} priced lines, ${i?.sell} excl. VAT, margin ${i?.margin}) and a ${i?.type} approval for Karim Balbaa. Nothing is sent to the customer until it's approved and someone sends it.`)
};

export const commercial_requested_rules = /** @type {(inputs: Commercial_Requested_RulesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Requested: ${i?.requested} · ${i?.rules}`)
};

export const commercial_return = /** @type {(inputs: Commercial_ReturnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Return`)
};

export const commercial_return_heading = /** @type {(inputs: Commercial_Return_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Return ${i?.number}`)
};

export const commercial_return_placeholder = /** @type {(inputs: Commercial_Return_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`e.g. Re-check line 3, margin too thin for a new supplier`)
};

export const commercial_return_text = /** @type {(inputs: Commercial_Return_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Return ${i?.number} to the preparer. A reason is required and goes on the case timeline.`)
};

export const commercial_returned_done = /** @type {(inputs: Commercial_Returned_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Returned to the preparer with your reason.`)
};

export const commercial_revise_heading = /** @type {(inputs: Commercial_Revise_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Revise ${i?.number}`)
};

export const commercial_revise_placeholder = /** @type {(inputs: Commercial_Revise_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`e.g. Customer asked for ESAB on line 1`)
};

export const commercial_revise_text = /** @type {(inputs: Commercial_Revise_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Creates version ${i?.version} as a draft with the same lines; ${i?.number} is kept for audit and marked superseded.`)
};

export const commercial_sales_note = /** @type {(inputs: Commercial_Sales_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Soaad Amer (Sales) sees selling prices on the quotation; supplier costs, landed costs and margins are restricted to supply chain, finance and management.`)
};

export const commercial_save_selection = /** @type {(inputs: Commercial_Save_SelectionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Save selection`)
};

export const commercial_select = /** @type {(inputs: Commercial_SelectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Select`)
};

export const commercial_select_done_best = /** @type {(inputs: Commercial_Select_Done_BestInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Line ${i?.line}: ${i?.supplier} selected (best fit)`)
};

export const commercial_select_heading = /** @type {(inputs: Commercial_Select_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Line ${i?.line}: select offer`)
};

export const commercial_select_offer_line = /** @type {(inputs: Commercial_Select_Offer_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.offer} × ${i?.qty} ${i?.unit} · ${i?.landed} landed`)
};

export const commercial_selected = /** @type {(inputs: Commercial_SelectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Selected`)
};

export const commercial_selected_note = /** @type {(inputs: Commercial_Selected_NoteInputs) => LocalizedString} */ (i) => {
	if (i?.inferred === "yes") return /** @type {LocalizedString} */ (`Selected: ${i?.selected} (from the line status)`);
	return /** @type {LocalizedString} */ (`Selected: ${i?.selected}`)
};

export const commercial_selected_note_reason = /** @type {(inputs: Commercial_Selected_Note_ReasonInputs) => LocalizedString} */ (i) => {
	if (i?.inferred === "yes") return /** @type {LocalizedString} */ (`Selected: ${i?.selected} · ${i?.reason} (from the line status)`);
	return /** @type {LocalizedString} */ (`Selected: ${i?.selected} · ${i?.reason}`)
};

export const commercial_selected_qty = /** @type {(inputs: Commercial_Selected_QtyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Selected × ${i?.qty}`)
};

export const commercial_selection_saved = /** @type {(inputs: Commercial_Selection_SavedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Line ${i?.line}: selection saved to the case.`)
};

export const commercial_sell_note = /** @type {(inputs: Commercial_Sell_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.sell} at ${i?.currency}/EGP ${i?.fx}`)
};

export const commercial_sell_note_discount = /** @type {(inputs: Commercial_Sell_Note_DiscountInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.sell} at ${i?.currency}/EGP ${i?.fx} · after ${i?.discount}% discount`)
};

export const commercial_send = /** @type {(inputs: Commercial_SendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Send`)
};

export const commercial_send_ai_draft = /** @type {(inputs: Commercial_Send_Ai_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI draft · Nothing is sent until you confirm.`)
};

export const commercial_send_correction_heading = /** @type {(inputs: Commercial_Send_Correction_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Send the correction request?`)
};

export const commercial_send_correction_text = /** @type {(inputs: Commercial_Send_Correction_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`To ${i?.to}: “${i?.subject}”.`)
};

export const commercial_send_email_line = /** @type {(inputs: Commercial_Send_Email_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Email from Odoo. To: ${i?.to} · Subject: Quotation ${i?.number}, ${i?.vessel}, ref. ${i?.ref} · Attachment: ${i?.number}.pdf`)
};

export const commercial_send_heading = /** @type {(inputs: Commercial_Send_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Send ${i?.number}`)
};

export const commercial_send_portal_line = /** @type {(inputs: Commercial_Send_Portal_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Customer portal: enter the quotation in ${i?.portal}, then upload the confirmation screenshot below. The submission is only complete when it matches the approved quote.`)
};

export const commercial_send_to_customer = /** @type {(inputs: Commercial_Send_To_CustomerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Send to customer`)
};

export const commercial_send_to_supplier = /** @type {(inputs: Commercial_Send_To_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Send to supplier`)
};

export const commercial_sent_via = /** @type {(inputs: Commercial_Sent_ViaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`sent ${i?.when} via ${i?.method}`)
};

export const commercial_shared_allocated = /** @type {(inputs: Commercial_Shared_AllocatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Shared charges allocated`)
};

export const commercial_shared_charges = /** @type {(inputs: Commercial_Shared_ChargesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Shared charges`)
};

export const commercial_split_across = /** @type {(inputs: Commercial_Split_AcrossInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Split across suppliers…`)
};

export const commercial_split_adds_up = /** @type {(inputs: Commercial_Split_Adds_UpInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`The quantities add up to ${i?.qty} ${i?.unit}.`)
};

export const commercial_split_heading = /** @type {(inputs: Commercial_Split_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Line ${i?.line}: split sourcing`)
};

export const commercial_split_part_note = /** @type {(inputs: Commercial_Split_Part_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.offer} · ${i?.landed} EGP / ${i?.baseUnit} landed · up to ${i?.max} ${i?.unit}`)
};

export const commercial_split_reason = /** @type {(inputs: Commercial_Split_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`If this isn't the recommended split, give a reason: it's kept on the case and shown to the approver.`)
};

export const commercial_step_approval_requested = /** @type {(inputs: Commercial_Step_Approval_RequestedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approval requested`)
};

export const commercial_step_approved = /** @type {(inputs: Commercial_Step_ApprovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approved`)
};

export const commercial_step_prepared = /** @type {(inputs: Commercial_Step_PreparedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prepared`)
};

export const commercial_step_sent = /** @type {(inputs: Commercial_Step_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sent`)
};

export const commercial_submission_method = /** @type {(inputs: Commercial_Submission_MethodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Submission method`)
};

export const commercial_supplier_cost = /** @type {(inputs: Commercial_Supplier_CostInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier cost`)
};

export const commercial_tag_agency = /** @type {(inputs: Commercial_Tag_AgencyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Agency`)
};

export const commercial_tag_ai_check = /** @type {(inputs: Commercial_Tag_Ai_CheckInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI check`)
};

export const commercial_tag_ai_draft = /** @type {(inputs: Commercial_Tag_Ai_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI draft`)
};

export const commercial_tag_best_fit = /** @type {(inputs: Commercial_Tag_Best_FitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Best fit`)
};

export const commercial_tag_cheapest_unit = /** @type {(inputs: Commercial_Tag_Cheapest_UnitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cheapest unit price`)
};

export const commercial_tag_own_stock = /** @type {(inputs: Commercial_Tag_Own_StockInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Own stock`)
};

export const commercial_target_min = /** @type {(inputs: Commercial_Target_MinInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`target ${i?.target}% · min ${i?.min}%`)
};

export const commercial_terms_no_expiry = /** @type {(inputs: Commercial_Terms_No_ExpiryInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`No expiry · ${i?.terms}`)
};

export const commercial_terms_valid = /** @type {(inputs: Commercial_Terms_ValidInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Valid to ${i?.day} · ${i?.terms}`)
};

export const commercial_to_follow = /** @type {(inputs: Commercial_To_FollowInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} to follow as a revision`)
};

export const commercial_total_shared = /** @type {(inputs: Commercial_Total_SharedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Total shared`)
};

export const commercial_unit_price = /** @type {(inputs: Commercial_Unit_PriceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unit price`)
};

export const commercial_unpriced_line = /** @type {(inputs: Commercial_Unpriced_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`L${i?.line} · ${i?.description} (${i?.status}): no cost yet, excluded from this version.`)
};

export const commercial_upload_compare = /** @type {(inputs: Commercial_Upload_CompareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Upload screenshot & compare`)
};

export const commercial_use_split = /** @type {(inputs: Commercial_Use_SplitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Use suggested split`)
};

export const commercial_vat_note = /** @type {(inputs: Commercial_Vat_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`14% on local supplier bills, excluded from cost`)
};

export const commercial_view_quotation = /** @type {(inputs: Commercial_View_QuotationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`View quotation`)
};

export const commercial_what_changes = /** @type {(inputs: Commercial_What_ChangesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What changes`)
};

export const commercial_within_policy = /** @type {(inputs: Commercial_Within_PolicyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Within policy.`)
};

export const control_room_ageing_center = /** @type {(inputs: Control_Room_Ageing_CenterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`open`)
};

export const control_room_ageing_label = /** @type {(inputs: Control_Room_Ageing_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receivables by age`)
};

export const control_room_ai_draft = /** @type {(inputs: Control_Room_Ai_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI draft`)
};

export const control_room_all_cases = /** @type {(inputs: Control_Room_All_CasesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All cases`)
};

export const control_room_approvals = /** @type {(inputs: Control_Room_ApprovalsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approvals`)
};

export const control_room_ask_footnote = /** @type {(inputs: Control_Room_Ask_FootnoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The assistant reads and answers; it never sends, prices or pays.`)
};

export const control_room_ask_intro = /** @type {(inputs: Control_Room_Ask_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ask about a vessel or case number, approvals, who owes us money, suppliers, deadlines or the growth pipeline. Answers come from the live records and link to them.`)
};

export const control_room_ask_name = /** @type {(inputs: Control_Room_Ask_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Golden Sea assistant`)
};

export const control_room_ask_placeholder = /** @type {(inputs: Control_Room_Ask_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ask Golden Sea…`)
};

export const control_room_ask_question = /** @type {(inputs: Control_Room_Ask_QuestionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What's the status of Aurora Crest?`)
};

export const control_room_ask_reading = /** @type {(inputs: Control_Room_Ask_ReadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reading cases, approvals, invoices and suppliers…`)
};

export const control_room_assistant = /** @type {(inputs: Control_Room_AssistantInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Assistant`)
};

export const control_room_briefing_summarised = /** @type {(inputs: Control_Room_Briefing_SummarisedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Summarised again at ${i?.at} from ${i?.count} live records. A draft to read: nothing is sent, priced or paid.`)
};

export const control_room_briefing_written = /** @type {(inputs: Control_Room_Briefing_WrittenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Written at 07:00 from ${i?.count} live records. A draft to read: nothing is sent, priced or paid.`)
};

export const control_room_days_label = /** @type {(inputs: Control_Room_Days_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inquiries per day, last 12 weeks`)
};

export const control_room_days_summary = /** @type {(inputs: Control_Room_Days_SummaryInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.total} inquiries in 12 weeks · busiest ${i?.day} (${i?.count})`)
};

export const control_room_eyebrow = /** @type {(inputs: Control_Room_EyebrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Control room · for Karim Balbaa & Mohamed Helmy`)
};

export const control_room_figure_avg_time_to_quote = /** @type {(inputs: Control_Room_Figure_Avg_Time_To_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Avg time to quote`)
};

export const control_room_figure_gross_profit = /** @type {(inputs: Control_Room_Figure_Gross_ProfitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gross profit`)
};

export const control_room_figure_open_rfqs = /** @type {(inputs: Control_Room_Figure_Open_RfqsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open RFQs`)
};

export const control_room_figure_receivables_open = /** @type {(inputs: Control_Room_Figure_Receivables_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receivables open`)
};

export const control_room_figure_waiting_on_suppliers = /** @type {(inputs: Control_Room_Figure_Waiting_On_SuppliersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Waiting on suppliers`)
};

export const control_room_figure_win_rate = /** @type {(inputs: Control_Room_Figure_Win_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Win rate`)
};

export const control_room_funnel_12w = /** @type {(inputs: Control_Room_Funnel_12wInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quote funnel, the last 12 weeks`)
};

export const control_room_funnel_4w = /** @type {(inputs: Control_Room_Funnel_4wInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quote funnel, the last 4 weeks`)
};

export const control_room_funnel_note_12w = /** @type {(inputs: Control_Room_Funnel_Note_12wInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`RFQ cases received in the last 12 weeks, how many were quoted and how many won`)
};

export const control_room_funnel_note_4w = /** @type {(inputs: Control_Room_Funnel_Note_4wInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`RFQ cases received in the last 4 weeks, how many were quoted and how many won`)
};

export const control_room_heading = /** @type {(inputs: Control_Room_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The business, live.`)
};

export const control_room_inquiries = /** @type {(inputs: Control_Room_InquiriesInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} inquiry`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} inquiries`)
};

export const control_room_lost_center = /** @type {(inputs: Control_Room_Lost_CenterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`lost`)
};

export const control_room_lost_label = /** @type {(inputs: Control_Room_Lost_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Why quotes were lost`)
};

export const control_room_money_withheld = /** @type {(inputs: Control_Room_Money_WithheldInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gross profit, margins, receivables and cash flow are shown to management and finance only.`)
};

export const control_room_month_note = /** @type {(inputs: Control_Room_Month_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.month}: ${i?.note}`)
};

export const control_room_range_months = /** @type {(inputs: Control_Room_Range_MonthsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.points} m`)
};

export const control_room_range_weeks = /** @type {(inputs: Control_Room_Range_WeeksInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.points} w`)
};

export const control_room_receivables_payables = /** @type {(inputs: Control_Room_Receivables_PayablesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receivables & payables`)
};

export const control_room_subtitle = /** @type {(inputs: Control_Room_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Briefed at 07:00 from every case, quote, delivery and payment, with answers to any question about them.`)
};

export const control_room_summarise = /** @type {(inputs: Control_Room_SummariseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Summarise`)
};

export const growth_column_imo = /** @type {(inputs: Growth_Column_ImoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`IMO`)
};

export const growth_column_manager = /** @type {(inputs: Growth_Column_ManagerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ship manager`)
};

export const growth_column_supplied = /** @type {(inputs: Growth_Column_SuppliedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplied`)
};

export const growth_column_type = /** @type {(inputs: Growth_Column_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Type`)
};

export const growth_column_vessel = /** @type {(inputs: Growth_Column_VesselInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vessel`)
};

export const growth_extract_company = /** @type {(inputs: Growth_Extract_CompanyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Company`)
};

export const growth_extract_expires = /** @type {(inputs: Growth_Extract_ExpiresInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expires`)
};

export const growth_extract_expires_hint = /** @type {(inputs: Growth_Extract_Expires_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`the expiry or renewal date`)
};

export const growth_extract_issued = /** @type {(inputs: Growth_Extract_IssuedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Issued`)
};

export const growth_extract_label = /** @type {(inputs: Growth_Extract_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Read a registration document`)
};

export const growth_extract_registration = /** @type {(inputs: Growth_Extract_RegistrationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Commercial register no.`)
};

export const growth_extract_tax = /** @type {(inputs: Growth_Extract_TaxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tax card no.`)
};

export const growth_extract_what = /** @type {(inputs: Growth_Extract_WhatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`company registration document (commercial register, tax card or vendor certificate)`)
};

export const growth_fleet_supporting = /** @type {(inputs: Growth_Fleet_SupportingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} of ${i?.size} vessels on file · ${i?.supplied} supplied`)
};

export const growth_not_yet = /** @type {(inputs: Growth_Not_YetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not yet`)
};

export const growth_supplied = /** @type {(inputs: Growth_SuppliedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplied`)
};

export const home_away_context = /** @type {(inputs: Home_Away_ContextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unread notifications for someone back at their desk at a ship chandler: say what needs them first.`)
};

export const home_away_label = /** @type {(inputs: Home_Away_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`While you were away`)
};

export const home_figure_awaiting_customer_decision = /** @type {(inputs: Home_Figure_Awaiting_Customer_DecisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Awaiting customer decision`)
};

export const home_figure_awaiting_internal_approval = /** @type {(inputs: Home_Figure_Awaiting_Internal_ApprovalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Awaiting internal approval`)
};

export const home_figure_awaiting_supplier = /** @type {(inputs: Home_Figure_Awaiting_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Awaiting supplier`)
};

export const home_figure_deliveries_in_progress = /** @type {(inputs: Home_Figure_Deliveries_In_ProgressInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deliveries in progress`)
};

export const home_figure_expected_gross_profit_nov = /** @type {(inputs: Home_Figure_Expected_Gross_Profit_NovInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expected gross profit, Nov`)
};

export const home_figure_inquiries_4_weeks = /** @type {(inputs: Home_Figure_Inquiries_4_WeeksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inquiries, last 4 weeks`)
};

export const home_figure_my_quote_turnaround = /** @type {(inputs: Home_Figure_My_Quote_TurnaroundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`My quote turnaround`)
};

export const home_figure_net_cash_8_weeks = /** @type {(inputs: Home_Figure_Net_Cash_8_WeeksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Net cash, next 8 weeks`)
};

export const home_figure_out_of_hours_rfqs = /** @type {(inputs: Home_Figure_Out_Of_Hours_RfqsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Out-of-hours RFQs`)
};

export const home_figure_quote_turnaround = /** @type {(inputs: Home_Figure_Quote_TurnaroundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quote turnaround`)
};

export const home_figure_receivables = /** @type {(inputs: Home_Figure_ReceivablesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receivables`)
};

export const home_figure_time_to_acknowledge = /** @type {(inputs: Home_Figure_Time_To_AcknowledgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Time to acknowledge`)
};

export const home_figure_won_4_weeks = /** @type {(inputs: Home_Figure_Won_4_WeeksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Won, last 4 weeks`)
};

export const home_late = /** @type {(inputs: Home_LateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Late`)
};

export const inbox_ack_by_hand = /** @type {(inputs: Inbox_Ack_By_HandInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Send by hand`)
};

export const inbox_ack_note_manual = /** @type {(inputs: Inbox_Ack_Note_ManualInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Template: ${i?.template}. WhatsApp / form source: the owner sends it. The system never messages the customer by itself here.`)
};

export const inbox_ack_note_once = /** @type {(inputs: Inbox_Ack_Note_OnceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Template: ${i?.template}. Sent once from the approved template, never twice, even if the email is re-processed.`)
};

export const inbox_ack_on_create = /** @type {(inputs: Inbox_Ack_On_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sent once on create`)
};

export const inbox_ack_sent = /** @type {(inputs: Inbox_Ack_SentInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sent once · ${i?.when}`)
};

export const inbox_ai_draft = /** @type {(inputs: Inbox_Ai_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI draft`)
};

export const inbox_assignment_rule = /** @type {(inputs: Inbox_Assignment_RuleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Suggested by the assignment rules: ${i?.rule}.`)
};

export const inbox_assignment_rule_change = /** @type {(inputs: Inbox_Assignment_Rule_ChangeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Suggested by the assignment rules: ${i?.rule}. Change them when you create the case.`)
};

export const inbox_backup = /** @type {(inputs: Inbox_BackupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Backup`)
};

export const inbox_case_created = /** @type {(inputs: Inbox_Case_CreatedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Case ${i?.caseId} created from this message and linked to it.`)
};

export const inbox_case_was_created = /** @type {(inputs: Inbox_Case_Was_CreatedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Case ${i?.caseId} was created from this message.`)
};

export const inbox_channel = /** @type {(inputs: Inbox_ChannelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.kind} · ${i?.account}: ${i?.status}`)
};

export const inbox_check_original = /** @type {(inputs: Inbox_Check_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Check against the original`)
};

export const inbox_clarification_subject = /** @type {(inputs: Inbox_Clarification_SubjectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clarification request, drafted and not sent`)
};

export const inbox_col_confidence = /** @type {(inputs: Inbox_Col_ConfidenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confidence`)
};

export const inbox_col_item = /** @type {(inputs: Inbox_Col_ItemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Item`)
};

export const inbox_col_part_no = /** @type {(inputs: Inbox_Col_Part_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Part no.`)
};

export const inbox_col_qty = /** @type {(inputs: Inbox_Col_QtyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Qty`)
};

export const inbox_col_source = /** @type {(inputs: Inbox_Col_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Source`)
};

export const inbox_col_unit = /** @type {(inputs: Inbox_Col_UnitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unit`)
};

export const inbox_create_rfq = /** @type {(inputs: Inbox_Create_RfqInputs) => LocalizedString} */ (i) => {
	const linesPlural = __paraglideRegistry.plural("en", i?.lines, {}, true);
	if (linesPlural === "one") return /** @type {LocalizedString} */ (`RFQ case for ${i?.customer} with ${__paraglideRegistry.icuPound("en", i?.lines, {})} line, owner ${i?.owner}. The original message stays linked to it.`);
	return /** @type {LocalizedString} */ (`RFQ case for ${i?.customer} with ${__paraglideRegistry.icuPound("en", i?.lines, {})} lines, owner ${i?.owner}. The original message stays linked to it.`)
};

export const inbox_create_rfq_flagged = /** @type {(inputs: Inbox_Create_Rfq_FlaggedInputs) => LocalizedString} */ (i) => {
	const linesPlural = __paraglideRegistry.plural("en", i?.lines, {}, true);
	if (linesPlural === "one") return /** @type {LocalizedString} */ (`RFQ case for ${i?.customer} with ${__paraglideRegistry.icuPound("en", i?.lines, {})} line (${i?.flagged} flagged for clarification), owner ${i?.owner}. The original message stays linked to it.`);
	return /** @type {LocalizedString} */ (`RFQ case for ${i?.customer} with ${__paraglideRegistry.icuPound("en", i?.lines, {})} lines (${i?.flagged} flagged for clarification), owner ${i?.owner}. The original message stays linked to it.`)
};

export const inbox_create_service = /** @type {(inputs: Inbox_Create_ServiceInputs) => LocalizedString} */ (i) => {
	const linesPlural = __paraglideRegistry.plural("en", i?.lines, {}, true);
	if (linesPlural === "one") return /** @type {LocalizedString} */ (`Service case for ${i?.customer} with ${__paraglideRegistry.icuPound("en", i?.lines, {})} line, owner ${i?.owner}. The original message stays linked to it.`);
	return /** @type {LocalizedString} */ (`Service case for ${i?.customer} with ${__paraglideRegistry.icuPound("en", i?.lines, {})} lines, owner ${i?.owner}. The original message stays linked to it.`)
};

export const inbox_create_service_flagged = /** @type {(inputs: Inbox_Create_Service_FlaggedInputs) => LocalizedString} */ (i) => {
	const linesPlural = __paraglideRegistry.plural("en", i?.lines, {}, true);
	if (linesPlural === "one") return /** @type {LocalizedString} */ (`Service case for ${i?.customer} with ${__paraglideRegistry.icuPound("en", i?.lines, {})} line (${i?.flagged} flagged for clarification), owner ${i?.owner}. The original message stays linked to it.`);
	return /** @type {LocalizedString} */ (`Service case for ${i?.customer} with ${__paraglideRegistry.icuPound("en", i?.lines, {})} lines (${i?.flagged} flagged for clarification), owner ${i?.owner}. The original message stays linked to it.`)
};

export const inbox_extract = /** @type {(inputs: Inbox_ExtractInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Extract with AI`)
};

export const inbox_extract_text = /** @type {(inputs: Inbox_Extract_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The AI reads the email into a draft: customer, vessel, IMO, port, ETA, deadline and lines with IMPA / ISSA, part numbers and a confidence for every value. Nothing is created until you confirm.`)
};

export const inbox_extract_text_files = /** @type {(inputs: Inbox_Extract_Text_FilesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The AI reads the email and every attachment (Excel, PDF, Word, photos) into a draft: customer, vessel, IMO, port, ETA, deadline and lines with IMPA / ISSA, part numbers and a confidence for every value. Nothing is created until you confirm.`)
};

export const inbox_flag_auto_reply = /** @type {(inputs: Inbox_Flag_Auto_ReplyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Looks like an automatic reply`)
};

export const inbox_flag_auto_reply_note = /** @type {(inputs: Inbox_Flag_Auto_Reply_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`It doesn't answer the request, so supplier reminders keep running.`)
};

export const inbox_flag_bank = /** @type {(inputs: Inbox_Flag_BankInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Asks to change bank or payment details`)
};

export const inbox_flag_bank_note = /** @type {(inputs: Inbox_Flag_Bank_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Don't act on it from the email: a bank-detail change needs two people (Finance and the CEO) and a call-back on the number already on file.`)
};

export const inbox_flag_cannot_supply = /** @type {(inputs: Inbox_Flag_Cannot_SupplyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The sender can't supply`)
};

export const inbox_flag_cannot_supply_note = /** @type {(inputs: Inbox_Flag_Cannot_Supply_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Look for another supplier for these lines before the deadline.`)
};

export const inbox_from = /** @type {(inputs: Inbox_FromInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`From: ${i?.name} <${i?.email}>`)
};

export const inbox_history_approval_ready = /** @type {(inputs: Inbox_History_Approval_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Everything is reviewed. It's ready for approval.`)
};

export const inbox_history_approval_text = /** @type {(inputs: Inbox_History_Approval_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Only management approves the import. Nothing from the history becomes a record before management says yes. Confidential threads stay out.`)
};

export const inbox_history_approval_waiting = /** @type {(inputs: Inbox_History_Approval_WaitingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Waiting for ${i?.approvers} (management). ${i?.blocked}`)
};

export const inbox_history_approve = /** @type {(inputs: Inbox_History_ApproveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approve import`)
};

export const inbox_history_approve_done = /** @type {(inputs: Inbox_History_Approve_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Import approved: customers, vessels, suppliers and dated prices saved`)
};

export const inbox_history_approved_by = /** @type {(inputs: Inbox_History_Approved_ByInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Approved by ${i?.by}.`)
};

export const inbox_history_col_attachments = /** @type {(inputs: Inbox_History_Col_AttachmentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Attachments`)
};

export const inbox_history_col_calls = /** @type {(inputs: Inbox_History_Col_CallsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Calls`)
};

export const inbox_history_col_categories = /** @type {(inputs: Inbox_History_Col_CategoriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What they quote`)
};

export const inbox_history_col_country = /** @type {(inputs: Inbox_History_Col_CountryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Country`)
};

export const inbox_history_col_customer = /** @type {(inputs: Inbox_History_Col_CustomerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer`)
};

export const inbox_history_col_fleet = /** @type {(inputs: Inbox_History_Col_FleetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fleet`)
};

export const inbox_history_col_imo = /** @type {(inputs: Inbox_History_Col_ImoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`IMO`)
};

export const inbox_history_col_item = /** @type {(inputs: Inbox_History_Col_ItemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Item`)
};

export const inbox_history_col_mailbox = /** @type {(inputs: Inbox_History_Col_MailboxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mailbox`)
};

export const inbox_history_col_po = /** @type {(inputs: Inbox_History_Col_PoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PO`)
};

export const inbox_history_col_ports = /** @type {(inputs: Inbox_History_Col_PortsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ports`)
};

export const inbox_history_col_price = /** @type {(inputs: Inbox_History_Col_PriceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Price`)
};

export const inbox_history_col_quoted = /** @type {(inputs: Inbox_History_Col_QuotedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lines quoted`)
};

export const inbox_history_col_quoted_at = /** @type {(inputs: Inbox_History_Col_Quoted_AtInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quoted`)
};

export const inbox_history_col_rfqs = /** @type {(inputs: Inbox_History_Col_RfqsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`RFQs`)
};

export const inbox_history_col_source = /** @type {(inputs: Inbox_History_Col_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Source`)
};

export const inbox_history_col_supplier = /** @type {(inputs: Inbox_History_Col_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier`)
};

export const inbox_history_col_vessel = /** @type {(inputs: Inbox_History_Col_VesselInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vessel`)
};

export const inbox_history_col_years = /** @type {(inputs: Inbox_History_Col_YearsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Years`)
};

export const inbox_history_confirm_heading = /** @type {(inputs: Inbox_History_Confirm_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approve the history import?`)
};

export const inbox_history_confirm_text = /** @type {(inputs: Inbox_History_Confirm_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Saves ${i?.totals} and ${i?.prices} dated prices from ${i?.kept} de-duplicated messages, with your ${i?.decisions} decisions on the uncertain items. Rejected and confidential items are left out.`)
};

export const inbox_history_created = /** @type {(inputs: Inbox_History_CreatedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.kind}: ${i?.name}`)
};

export const inbox_history_customers = /** @type {(inputs: Inbox_History_CustomersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customers`)
};

export const inbox_history_customers_found = /** @type {(inputs: Inbox_History_Customers_FoundInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} found · top 5 by RFQs`)
};

export const inbox_history_customers_note = /** @type {(inputs: Inbox_History_Customers_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ship managers & owners`)
};

export const inbox_history_dated_prices = /** @type {(inputs: Inbox_History_Dated_PricesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dated prices`)
};

export const inbox_history_dedup_a11y = /** @type {(inputs: Inbox_History_Dedup_A11yInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.label}: ${i?.count} removed`)
};

export const inbox_history_dedup_note = /** @type {(inputs: Inbox_History_Dedup_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The same email often sits in three mailboxes. Each message is kept once, with all its copies linked.`)
};

export const inbox_history_dedup_value = /** @type {(inputs: Inbox_History_Dedup_ValueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`− ${i?.count}`)
};

export const inbox_history_eyebrow = /** @type {(inputs: Inbox_History_EyebrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sourcing desk · your history`)
};

export const inbox_history_heading = /** @type {(inputs: Inbox_History_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inbox history`)
};

export const inbox_history_kept = /** @type {(inputs: Inbox_History_KeptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Business messages kept`)
};

export const inbox_history_kept_share = /** @type {(inputs: Inbox_History_Kept_ShareInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`of ${i?.scanned} scanned`)
};

export const inbox_history_mailboxes_note = /** @type {(inputs: Inbox_History_Mailboxes_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All of Golden Sea's mailboxes and WhatsApp exports, read in a dry run first. Nothing is saved before approval.`)
};

export const inbox_history_management = /** @type {(inputs: Inbox_History_ManagementInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`management`)
};

export const inbox_history_messages = /** @type {(inputs: Inbox_History_MessagesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Messages`)
};

export const inbox_history_new_to_odoo = /** @type {(inputs: Inbox_History_New_To_OdooInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New to Odoo`)
};

export const inbox_history_no_po = /** @type {(inputs: Inbox_History_No_PoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No PO, still remembered`)
};

export const inbox_history_ordered = /** @type {(inputs: Inbox_History_OrderedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ordered`)
};

export const inbox_history_organise_first = /** @type {(inputs: Inbox_History_Organise_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Organise the history first.`)
};

export const inbox_history_organise_note = /** @type {(inputs: Inbox_History_Organise_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Then management approves the import. Nothing from the history becomes a record before.`)
};

export const inbox_history_organise_text = /** @type {(inputs: Inbox_History_Organise_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Press Organise: the AI reads the kept messages and builds your customers, vessels, suppliers and dated prices. Anything it isn't sure of comes to you first.`)
};

export const inbox_history_organised = /** @type {(inputs: Inbox_History_OrganisedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Organised`)
};

export const inbox_history_pending_decision = /** @type {(inputs: Inbox_History_Pending_DecisionInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} uncertain item still need a decision.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} uncertain items still need a decision.`)
};

export const inbox_history_per_year = /** @type {(inputs: Inbox_History_Per_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Messages per year`)
};

export const inbox_history_price = /** @type {(inputs: Inbox_History_PriceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.price} / ${i?.per}`)
};

export const inbox_history_price_hidden = /** @type {(inputs: Inbox_History_Price_HiddenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`hidden for your role`)
};

export const inbox_history_prices_found = /** @type {(inputs: Inbox_History_Prices_FoundInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} prices, each with its date and validity`)
};

export const inbox_history_prices_note = /** @type {(inputs: Inbox_History_Prices_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} with no PO`)
};

export const inbox_history_scanned = /** @type {(inputs: Inbox_History_ScannedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} messages · 2019–2026`)
};

export const inbox_history_searchable = /** @type {(inputs: Inbox_History_SearchableInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Your history is searchable from day one: ${i?.totals} and ${i?.prices} dated prices.`)
};

export const inbox_history_status_approved = /** @type {(inputs: Inbox_History_Status_ApprovedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Status: imported · approved by ${i?.by}`)
};

export const inbox_history_status_dry_run = /** @type {(inputs: Inbox_History_Status_Dry_RunInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Status: dry run ready. Nothing has been imported`)
};

export const inbox_history_status_pending = /** @type {(inputs: Inbox_History_Status_PendingInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Status: ${__paraglideRegistry.icuPound("en", i?.count, {})} uncertain item to review`);
	return /** @type {LocalizedString} */ (`Status: ${__paraglideRegistry.icuPound("en", i?.count, {})} uncertain items to review`)
};

export const inbox_history_status_waiting = /** @type {(inputs: Inbox_History_Status_WaitingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Status: waiting for management's approval`)
};

export const inbox_history_step_connect = /** @type {(inputs: Inbox_History_Step_ConnectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Connect mailboxes`)
};

export const inbox_history_step_dedup = /** @type {(inputs: Inbox_History_Step_DedupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`De-duplicate`)
};

export const inbox_history_step_organise = /** @type {(inputs: Inbox_History_Step_OrganiseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Organise`)
};

export const inbox_history_step_review = /** @type {(inputs: Inbox_History_Step_ReviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Review uncertain`)
};

export const inbox_history_step_scan = /** @type {(inputs: Inbox_History_Step_ScanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Scan (dry run)`)
};

export const inbox_history_subtitle = /** @type {(inputs: Inbox_History_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`We organise your past, not just your future: every inbox, every year.`)
};

export const inbox_history_suppliers = /** @type {(inputs: Inbox_History_SuppliersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suppliers`)
};

export const inbox_history_suppliers_found = /** @type {(inputs: Inbox_History_Suppliers_FoundInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} found · incl. ones you never ordered from`)
};

export const inbox_history_suppliers_note = /** @type {(inputs: Inbox_History_Suppliers_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`who quoted what`)
};

export const inbox_history_totals = /** @type {(inputs: Inbox_History_TotalsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.customersText} customers, ${i?.vesselsText} vessels, ${i?.suppliersText} suppliers`)
};

export const inbox_history_vessels = /** @type {(inputs: Inbox_History_VesselsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vessels`)
};

export const inbox_history_vessels_found = /** @type {(inputs: Inbox_History_Vessels_FoundInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} found · matched by IMO, renames kept`)
};

export const inbox_history_vessels_note = /** @type {(inputs: Inbox_History_Vessels_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`IMO · fleet · ports`)
};

export const inbox_kept_as_received = /** @type {(inputs: Inbox_Kept_As_ReceivedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kept as received`)
};

export const inbox_kind_complaint = /** @type {(inputs: Inbox_Kind_ComplaintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Complaint`)
};

export const inbox_kind_delivery = /** @type {(inputs: Inbox_Kind_DeliveryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delivery or logistics`)
};

export const inbox_kind_invoice = /** @type {(inputs: Inbox_Kind_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoice or payment query`)
};

export const inbox_kind_offer = /** @type {(inputs: Inbox_Kind_OfferInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier offer or reply`)
};

export const inbox_kind_order = /** @type {(inputs: Inbox_Kind_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer PO or order`)
};

export const inbox_kind_other = /** @type {(inputs: Inbox_Kind_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Other`)
};

export const inbox_kind_rfq = /** @type {(inputs: Inbox_Kind_RfqInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New RFQ`)
};

export const inbox_linked = /** @type {(inputs: Inbox_LinkedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Linked to case ${i?.caseId}.`)
};

export const inbox_linked_by = /** @type {(inputs: Inbox_Linked_ByInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Linked to case ${i?.caseId} by ${i?.by}.`)
};

export const inbox_linked_text = /** @type {(inputs: Inbox_Linked_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Its offer and files are on the case.`)
};

export const inbox_low_confidence = /** @type {(inputs: Inbox_Low_ConfidenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Low-confidence values are never applied without a person checking them.`)
};

export const inbox_match = /** @type {(inputs: Inbox_MatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Match reply`)
};

export const inbox_match_text = /** @type {(inputs: Inbox_Match_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Replies are matched by their supplier-RFQ reference even when the subject changes; forwards by their files. Below 85% a person decides.`)
};

export const inbox_match_uncertain = /** @type {(inputs: Inbox_Match_UncertainInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The match is uncertain, so it isn't linked. Pick its case under Reply match, or mark it not related.`)
};

export const inbox_message_id = /** @type {(inputs: Inbox_Message_IdInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Message id ${i?.id} · re-processing the same message never creates a second case or acknowledgement.`)
};

export const inbox_new_customer = /** @type {(inputs: Inbox_New_CustomerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New customer`)
};

export const inbox_next_rfqs = /** @type {(inputs: Inbox_Next_RfqsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next: send the supplier RFQs for its lines.`)
};

export const inbox_no_clarification = /** @type {(inputs: Inbox_No_ClarificationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No clarification request was drafted for these.`)
};

export const inbox_no_text = /** @type {(inputs: Inbox_No_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`(no text)`)
};

export const inbox_not_an_rfq = /** @type {(inputs: Inbox_Not_An_RfqInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not an RFQ`)
};

export const inbox_not_related = /** @type {(inputs: Inbox_Not_RelatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Marked not related.`)
};

export const inbox_not_related_by = /** @type {(inputs: Inbox_Not_Related_ByInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Marked not related by ${i?.by}.`)
};

export const inbox_not_rfq = /** @type {(inputs: Inbox_Not_RfqInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Marked “not an RFQ”.`)
};

export const inbox_nothing_more = /** @type {(inputs: Inbox_Nothing_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing more to do with this message.`)
};

export const inbox_offer_currency = /** @type {(inputs: Inbox_Offer_CurrencyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Currency`)
};

export const inbox_offer_extract = /** @type {(inputs: Inbox_Offer_ExtractInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pull out the offer details`)
};

export const inbox_offer_item = /** @type {(inputs: Inbox_Offer_ItemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Item offered`)
};

export const inbox_offer_lead_time = /** @type {(inputs: Inbox_Offer_Lead_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lead time`)
};

export const inbox_offer_pack = /** @type {(inputs: Inbox_Offer_PackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unit / pack size`)
};

export const inbox_offer_price = /** @type {(inputs: Inbox_Offer_PriceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unit price`)
};

export const inbox_offer_validity = /** @type {(inputs: Inbox_Offer_ValidityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Valid until`)
};

export const inbox_open_case = /** @type {(inputs: Inbox_Open_CaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open case`)
};

export const inbox_order = /** @type {(inputs: Inbox_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Order`)
};

export const inbox_order_newest = /** @type {(inputs: Inbox_Order_NewestInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Newest first`)
};

export const inbox_order_urgent = /** @type {(inputs: Inbox_Order_UrgentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Most urgent first`)
};

export const inbox_owner = /** @type {(inputs: Inbox_OwnerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Owner`)
};

export const inbox_pick_message = /** @type {(inputs: Inbox_Pick_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pick a message in the list.`)
};

export const inbox_quote_deadline = /** @type {(inputs: Inbox_Quote_DeadlineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quote deadline`)
};

export const inbox_reminder_scheduled = /** @type {(inputs: Inbox_Reminder_ScheduledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A reminder is scheduled before it.`)
};

export const inbox_send_rfqs = /** @type {(inputs: Inbox_Send_RfqsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Send supplier RFQs`)
};

export const inbox_show = /** @type {(inputs: Inbox_ShowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Show messages`)
};

export const inbox_show_all = /** @type {(inputs: Inbox_Show_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All`)
};

export const inbox_show_linked = /** @type {(inputs: Inbox_Show_LinkedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Linked`)
};

export const inbox_show_new = /** @type {(inputs: Inbox_Show_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New`)
};

export const inbox_show_review = /** @type {(inputs: Inbox_Show_ReviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Needs review`)
};

export const inbox_show_review_count = /** @type {(inputs: Inbox_Show_Review_CountInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Needs review · ${i?.count}`)
};

export const inbox_to = /** @type {(inputs: Inbox_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`To: ${i?.name} <${i?.email}>`)
};

export const inbox_today = /** @type {(inputs: Inbox_TodayInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Processed today: ${i?.processed} · duplicates suppressed: ${i?.duplicates} · waiting for a person: ${i?.review}`)
};

export const inbox_via = /** @type {(inputs: Inbox_ViaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Via: ${i?.via} · ${i?.when}`)
};

export const index_money = /** @type {(inputs: Index_MoneyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.currency} ${i?.amount}`)
};

export const index_money_k = /** @type {(inputs: Index_Money_KInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.currency} ${i?.amount}k`)
};

export const integrations_ack_from = /** @type {(inputs: Integrations_Ack_FromInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`From: Golden Sea <${i?.from}>`)
};

export const integrations_ack_note = /** @type {(inputs: Integrations_Ack_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Example for GS-RFQ-0142. Wording, recipients and trigger were approved by management; changing them needs a new approval.`)
};

export const integrations_ack_status = /** @type {(inputs: Integrations_Ack_StatusInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.status} v${i?.version} · ${i?.approvedBy}`)
};

export const integrations_ack_to = /** @type {(inputs: Integrations_Ack_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`To: ${i?.to}`)
};

export const integrations_all_templates = /** @type {(inputs: Integrations_All_TemplatesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All message templates`)
};

export const integrations_backups_note = /** @type {(inputs: Integrations_Backups_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The staging copy is where changes are tried before they reach your team; email sending and integrations are switched off there. Your data is always yours: export everything at any time.`)
};

export const integrations_checked_label = /** @type {(inputs: Integrations_Checked_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Checked against Odoo`)
};

export const integrations_checked_note = /** @type {(inputs: Integrations_Checked_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.checked} records checked by a person`)
};

export const integrations_company_default = /** @type {(inputs: Integrations_Company_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Company default`)
};

export const integrations_confidential = /** @type {(inputs: Integrations_ConfidentialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Flagged confidential`)
};

export const integrations_confidential_note = /** @type {(inputs: Integrations_Confidential_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`excluded unless approved`)
};

export const integrations_copies = /** @type {(inputs: Integrations_CopiesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copies`)
};

export const integrations_copies_value = /** @type {(inputs: Integrations_Copies_ValueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.locations} locations · kept ${i?.days} days`)
};

export const integrations_documents_ar = /** @type {(inputs: Integrations_Documents_ArInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer documents in العربية (Arabic)`)
};

export const integrations_documents_en = /** @type {(inputs: Integrations_Documents_EnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer documents in English`)
};

export const integrations_duplicates = /** @type {(inputs: Integrations_DuplicatesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Likely duplicates`)
};

export const integrations_duplicates_note = /** @type {(inputs: Integrations_Duplicates_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`linked, not re-created`)
};

export const integrations_emails_scanned = /** @type {(inputs: Integrations_Emails_ScannedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Emails scanned`)
};

export const integrations_exceptions = /** @type {(inputs: Integrations_ExceptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exceptions`)
};

export const integrations_exceptions_note = /** @type {(inputs: Integrations_Exceptions_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`unreadable attachments`)
};

export const integrations_import_days = /** @type {(inputs: Integrations_Import_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.days} days`)
};

export const integrations_import_note = /** @type {(inputs: Integrations_Import_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dry run first; nothing is imported before approval, and no acknowledgements or reminders are sent for historical mail.`)
};

export const integrations_lang_ar = /** @type {(inputs: Integrations_Lang_ArInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العربية (Arabic)`)
};

export const integrations_languages_note = /** @type {(inputs: Integrations_Languages_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The whole platform runs in English and Arabic: acknowledgements, quotations and invoices go out in the customer's language.`)
};

export const integrations_last_backup = /** @type {(inputs: Integrations_Last_BackupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Last backup`)
};

export const integrations_migration_note = /** @type {(inputs: Integrations_Migration_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Odoo keeps running beside the platform while its data moves. Nothing in Odoo is changed or deleted.`)
};

export const integrations_moved_label = /** @type {(inputs: Integrations_Moved_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Moved into the platform`)
};

export const integrations_moved_note = /** @type {(inputs: Integrations_Moved_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.moved} of ${i?.all} records`)
};

export const integrations_never_internal = /** @type {(inputs: Integrations_Never_InternalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Never to internal senders`)
};

export const integrations_once_per_thread = /** @type {(inputs: Integrations_Once_Per_ThreadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sent once per thread`)
};

export const integrations_open_inbox_history = /** @type {(inputs: Integrations_Open_Inbox_HistoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open inbox history`)
};

export const integrations_parts_label = /** @type {(inputs: Integrations_Parts_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Parts done`)
};

export const integrations_parts_value = /** @type {(inputs: Integrations_Parts_ValueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.done} of ${i?.total}`)
};

export const integrations_preview_language = /** @type {(inputs: Integrations_Preview_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Preview language`)
};

export const integrations_ready = /** @type {(inputs: Integrations_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ready to switch Odoo off`)
};

export const integrations_refresh_staging = /** @type {(inputs: Integrations_Refresh_StagingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Refresh staging copy`)
};

export const integrations_refresh_staging_done = /** @type {(inputs: Integrations_Refresh_Staging_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Staging copy refreshed from last night's backup`)
};

export const integrations_refresh_staging_reason = /** @type {(inputs: Integrations_Refresh_Staging_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Only management refreshes staging.`)
};

export const integrations_restore_tested = /** @type {(inputs: Integrations_Restore_TestedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Restore last tested`)
};

export const integrations_rfq_threads = /** @type {(inputs: Integrations_Rfq_ThreadsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`RFQ threads`)
};

export const integrations_rfq_threads_note = /** @type {(inputs: Integrations_Rfq_Threads_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`become historical cases`)
};

export const integrations_schedule = /** @type {(inputs: Integrations_ScheduleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Schedule`)
};

export const integrations_settings_by_management = /** @type {(inputs: Integrations_Settings_By_ManagementInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Company settings are changed by management.`)
};

export const integrations_staging_copy = /** @type {(inputs: Integrations_Staging_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Staging copy`)
};

export const integrations_stays_on = /** @type {(inputs: Integrations_Stays_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Odoo stays on until every part is done`)
};

export const integrations_your_language = /** @type {(inputs: Integrations_Your_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your language`)
};

export const order_to_cash_agent_contact = /** @type {(inputs: Order_To_Cash_Agent_ContactInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Agent / delivery contact`)
};

export const order_to_cash_agreement_hint = /** @type {(inputs: Order_To_Cash_Agreement_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Who agreed, when and what`)
};

export const order_to_cash_agreement_hint_ai = /** @type {(inputs: Order_To_Cash_Agreement_Hint_AiInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI draft from the customer's email. Check it before recording.`)
};

export const order_to_cash_agreement_label = /** @type {(inputs: Order_To_Cash_Agreement_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer's written agreement`)
};

export const order_to_cash_ai_check_line = /** @type {(inputs: Order_To_Cash_Ai_Check_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.what} · ${i?.field}: PO says "${i?.po}", quotation ${i?.quotation} says "${i?.quote}"`)
};

export const order_to_cash_ai_check_tag = /** @type {(inputs: Order_To_Cash_Ai_Check_TagInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI check · 96%`)
};

export const order_to_cash_ai_line = /** @type {(inputs: Order_To_Cash_Ai_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Line ${i?.line}`)
};

export const order_to_cash_ai_second_look = /** @type {(inputs: Order_To_Cash_Ai_Second_LookInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Second look with AI`)
};

export const order_to_cash_ai_terms = /** @type {(inputs: Order_To_Cash_Ai_TermsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Terms`)
};

export const order_to_cash_amendment_confirm = /** @type {(inputs: Order_To_Cash_Amendment_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Record amendment & lift block`)
};

export const order_to_cash_amendment_done = /** @type {(inputs: Order_To_Cash_Amendment_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Amendment recorded on line ${i?.line}. Evidence attached.`)
};

export const order_to_cash_amendment_heading_header = /** @type {(inputs: Order_To_Cash_Amendment_Heading_HeaderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Record customer amendment: line header`)
};

export const order_to_cash_amendment_heading_line = /** @type {(inputs: Order_To_Cash_Amendment_Heading_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Record customer amendment: line ${i?.line}`)
};

export const order_to_cash_amendment_intro = /** @type {(inputs: Order_To_Cash_Amendment_IntroInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.field}. PO: ${i?.po} · Quotation: ${i?.quote}`)
};

export const order_to_cash_approve_confirm = /** @type {(inputs: Order_To_Cash_Approve_ConfirmInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Approve & confirm ${i?.number}`)
};

export const order_to_cash_ask_approval = /** @type {(inputs: Order_To_Cash_Ask_ApprovalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ask Karim Balbaa to approve`)
};

export const order_to_cash_ask_approval_done = /** @type {(inputs: Order_To_Cash_Ask_Approval_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Approval requested from Karim Balbaa for ${i?.number}.`)
};

export const order_to_cash_bills_matched = /** @type {(inputs: Order_To_Cash_Bills_MatchedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Matched to PO and receipt`)
};

export const order_to_cash_bills_on_hold = /** @type {(inputs: Order_To_Cash_Bills_On_HoldInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} on hold: 3-way match`)
};

export const order_to_cash_change_line = /** @type {(inputs: Order_To_Cash_Change_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.item}: ${i?.now}`)
};

export const order_to_cash_changed = /** @type {(inputs: Order_To_Cash_ChangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Changed`)
};

export const order_to_cash_check_documents = /** @type {(inputs: Order_To_Cash_Check_DocumentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Documents: delivery note, packing list, SDS, certificates`)
};

export const order_to_cash_check_goods_ready = /** @type {(inputs: Order_To_Cash_Check_Goods_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Goods ready & labelled per line`)
};

export const order_to_cash_check_no_approval = /** @type {(inputs: Order_To_Cash_Check_No_ApprovalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No open approval on the order`)
};

export const order_to_cash_check_ship_stores = /** @type {(inputs: Order_To_Cash_Check_Ship_StoresInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ship-stores declaration`)
};

export const order_to_cash_check_transport = /** @type {(inputs: Order_To_Cash_Check_TransportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Transport booked (truck, launch)`)
};

export const order_to_cash_clearance = /** @type {(inputs: Order_To_Cash_ClearanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clearance`)
};

export const order_to_cash_close_line_prompt = /** @type {(inputs: Order_To_Cash_Close_Line_PromptInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Close line ${i?.line} (not awarded)`)
};

export const order_to_cash_close_with_reason = /** @type {(inputs: Order_To_Cash_Close_With_ReasonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Close with reason`)
};

export const order_to_cash_closed_done = /** @type {(inputs: Order_To_Cash_Closed_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Line ${i?.line}: closed with reason.`)
};

export const order_to_cash_col_at_quotation = /** @type {(inputs: Order_To_Cash_Col_At_QuotationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`At quotation`)
};

export const order_to_cash_col_check = /** @type {(inputs: Order_To_Cash_Col_CheckInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Check`)
};

export const order_to_cash_col_checked = /** @type {(inputs: Order_To_Cash_Col_CheckedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Checked`)
};

export const order_to_cash_col_customer_po = /** @type {(inputs: Order_To_Cash_Col_Customer_PoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer PO`)
};

export const order_to_cash_col_item = /** @type {(inputs: Order_To_Cash_Col_ItemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Item`)
};

export const order_to_cash_col_line = /** @type {(inputs: Order_To_Cash_Col_LineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Line`)
};

export const order_to_cash_col_now = /** @type {(inputs: Order_To_Cash_Col_NowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Now`)
};

export const order_to_cash_col_quotation = /** @type {(inputs: Order_To_Cash_Col_QuotationInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Quotation ${i?.quotation}`)
};

export const order_to_cash_col_result = /** @type {(inputs: Order_To_Cash_Col_ResultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Result`)
};

export const order_to_cash_commitment_blocked = /** @type {(inputs: Order_To_Cash_Commitment_BlockedInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Commitment blocked: ${i?.count} mismatch need the customer's written agreement (or an approved exception) before the sales order and supplier POs.`);
	return /** @type {LocalizedString} */ (`Commitment blocked: ${i?.count} mismatches need the customer's written agreement (or an approved exception) before the sales order and supplier POs.`)
};

export const order_to_cash_confirm_delivered = /** @type {(inputs: Order_To_Cash_Confirm_DeliveredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirm delivered`)
};

export const order_to_cash_confirm_delivered_heading = /** @type {(inputs: Order_To_Cash_Confirm_Delivered_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Confirm ${i?.number} delivered`)
};

export const order_to_cash_confirm_delivery = /** @type {(inputs: Order_To_Cash_Confirm_DeliveryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirm delivery…`)
};

export const order_to_cash_confirm_heading = /** @type {(inputs: Order_To_Cash_Confirm_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Confirm ${i?.number}?`)
};

export const order_to_cash_confirm_sales_order = /** @type {(inputs: Order_To_Cash_Confirm_Sales_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirm sales order & prepare supplier POs`)
};

export const order_to_cash_confirm_send = /** @type {(inputs: Order_To_Cash_Confirm_SendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirm & send`)
};

export const order_to_cash_confirm_text = /** @type {(inputs: Order_To_Cash_Confirm_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} goes to ${i?.supplier} as a confirmed order. That can't be undone here.`)
};

export const order_to_cash_confirmed_by_management = /** @type {(inputs: Order_To_Cash_Confirmed_By_ManagementInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier POs are confirmed by Karim Balbaa (management).`)
};

export const order_to_cash_confirmed_done = /** @type {(inputs: Order_To_Cash_Confirmed_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} confirmed and sent to ${i?.supplier}.`)
};

export const order_to_cash_delivered_count = /** @type {(inputs: Order_To_Cash_Delivered_CountInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} of ${i?.total} delivered`)
};

export const order_to_cash_delivered_done = /** @type {(inputs: Order_To_Cash_Delivered_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} delivered. Signed delivery note on file.`)
};

export const order_to_cash_dictate = /** @type {(inputs: Order_To_Cash_DictateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dictate shortages or damage`)
};

export const order_to_cash_dispatch = /** @type {(inputs: Order_To_Cash_DispatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dispatch`)
};

export const order_to_cash_dispatched_at = /** @type {(inputs: Order_To_Cash_Dispatched_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Dispatched ${i?.at}`)
};

export const order_to_cash_drop_heading = /** @type {(inputs: Order_To_Cash_Drop_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Drop ${i?.drop} · ${i?.number}`)
};

export const order_to_cash_drop_line = /** @type {(inputs: Order_To_Cash_Drop_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`L${i?.line} · ${i?.qty} × ${i?.description}`)
};

export const order_to_cash_drop_line_lot = /** @type {(inputs: Order_To_Cash_Drop_Line_LotInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`L${i?.line} · ${i?.qty} × ${i?.description} · lot ${i?.lot}`)
};

export const order_to_cash_drop_tag = /** @type {(inputs: Order_To_Cash_Drop_TagInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Drop ${i?.drop} of ${i?.total} · ${i?.status}`)
};

export const order_to_cash_evidence_hint = /** @type {(inputs: Order_To_Cash_Evidence_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Optional in the demo. A copy of the customer's email is attached if you skip this.`)
};

export const order_to_cash_evidence_legend = /** @type {(inputs: Order_To_Cash_Evidence_LegendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Evidence (email or signed amendment)`)
};

export const order_to_cash_figure_customer_po = /** @type {(inputs: Order_To_Cash_Figure_Customer_PoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer PO`)
};

export const order_to_cash_figure_received = /** @type {(inputs: Order_To_Cash_Figure_ReceivedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Received`)
};

export const order_to_cash_figure_supplier_bills = /** @type {(inputs: Order_To_Cash_Figure_Supplier_BillsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier bills`)
};

export const order_to_cash_figure_supplier_pos_confirmed = /** @type {(inputs: Order_To_Cash_Figure_Supplier_Pos_ConfirmedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier POs confirmed`)
};

export const order_to_cash_goods_ready = /** @type {(inputs: Order_To_Cash_Goods_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Goods ready`)
};

export const order_to_cash_header = /** @type {(inputs: Order_To_Cash_HeaderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Header`)
};

export const order_to_cash_intro = /** @type {(inputs: Order_To_Cash_IntroInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.lines}, ${i?.place}`)
};

export const order_to_cash_intro_line = /** @type {(inputs: Order_To_Cash_Intro_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`L${i?.line} × ${i?.qty}`)
};

export const order_to_cash_invoice_delivered = /** @type {(inputs: Order_To_Cash_Invoice_DeliveredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoice delivered quantities`)
};

export const order_to_cash_invoiced = /** @type {(inputs: Order_To_Cash_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoiced`)
};

export const order_to_cash_keep_open = /** @type {(inputs: Order_To_Cash_Keep_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Keep open`)
};

export const order_to_cash_kept_open_done = /** @type {(inputs: Order_To_Cash_Kept_Open_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Line ${i?.line}: kept open for a revision.`)
};

export const order_to_cash_launch_boat = /** @type {(inputs: Order_To_Cash_Launch_BoatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Launch / boat`)
};

export const order_to_cash_line_ref = /** @type {(inputs: Order_To_Cash_Line_RefInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`L${i?.line}`)
};

export const order_to_cash_mismatch_text = /** @type {(inputs: Order_To_Cash_Mismatch_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.line} · ${i?.field}`)
};

export const order_to_cash_missing_proof = /** @type {(inputs: Order_To_Cash_Missing_ProofInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No evidence, no “Delivered”: attach the signed note first.`)
};

export const order_to_cash_n_of_total = /** @type {(inputs: Order_To_Cash_N_Of_TotalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.n} of ${i?.total}`)
};

export const order_to_cash_no_plan = /** @type {(inputs: Order_To_Cash_No_PlanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No delivery planned yet. The plan is created once supplier POs are confirmed and goods are due.`)
};

export const order_to_cash_not_dispatched = /** @type {(inputs: Order_To_Cash_Not_DispatchedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not dispatched yet`)
};

export const order_to_cash_not_on_po_decide = /** @type {(inputs: Order_To_Cash_Not_On_Po_DecideInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not on the customer's PO: decide`)
};

export const order_to_cash_not_rechecked = /** @type {(inputs: Order_To_Cash_Not_RecheckedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not re-checked yet.`)
};

export const order_to_cash_ok = /** @type {(inputs: Order_To_Cash_OkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`OK`)
};

export const order_to_cash_on_backorder = /** @type {(inputs: Order_To_Cash_On_BackorderInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} on backorder`)
};

export const order_to_cash_on_plan = /** @type {(inputs: Order_To_Cash_On_PlanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`On plan: no ETA change from the agent and nothing blocking the delivery.`)
};

export const order_to_cash_outcome_closed = /** @type {(inputs: Order_To_Cash_Outcome_ClosedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Closed`)
};

export const order_to_cash_outcome_open_revision = /** @type {(inputs: Order_To_Cash_Outcome_Open_RevisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open, revision to follow`)
};

export const order_to_cash_outcome_with_reason = /** @type {(inputs: Order_To_Cash_Outcome_With_ReasonInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.outcome}: ${i?.reason}`)
};

export const order_to_cash_pair = /** @type {(inputs: Order_To_Cash_PairInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.a} · ${i?.b}`)
};

export const order_to_cash_partial_award_note = /** @type {(inputs: Order_To_Cash_Partial_Award_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quoted lines the customer didn't order stay open for a revision or close with a reason. A partly awarded case never shows as complete.`)
};

export const order_to_cash_plan_note = /** @type {(inputs: Order_To_Cash_Plan_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier promises and the customer promise are tracked separately; an ETA change moves every open drop, booking and task, and alerts the owner.`)
};

export const order_to_cash_planned_on_board = /** @type {(inputs: Order_To_Cash_Planned_On_BoardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Planned on board`)
};

export const order_to_cash_po_arrived_heading = /** @type {(inputs: Order_To_Cash_Po_Arrived_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nordvik's purchase order has just arrived by email.`)
};

export const order_to_cash_po_arrived_text = /** @type {(inputs: Order_To_Cash_Po_Arrived_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The AI reads it and checks every line and commercial term against the quotation version it refers to. Nothing is committed until a person resolves each mismatch.`)
};

export const order_to_cash_po_checked_validated = /** @type {(inputs: Order_To_Cash_Po_Checked_ValidatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The customer's PO was checked against the approved quotation and validated. The sales order is confirmed.`)
};

export const order_to_cash_po_empty_confirmed = /** @type {(inputs: Order_To_Cash_Po_Empty_ConfirmedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Checked and validated when the sales order was confirmed.`)
};

export const order_to_cash_po_empty_none = /** @type {(inputs: Order_To_Cash_Po_Empty_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No customer PO yet. When it arrives it is checked here against the approved quotation version.`)
};

export const order_to_cash_po_empty_read = /** @type {(inputs: Order_To_Cash_Po_Empty_ReadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Each line and term is checked here once the PO is read.`)
};

export const order_to_cash_po_not_received = /** @type {(inputs: Order_To_Cash_Po_Not_ReceivedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not received`)
};

export const order_to_cash_po_subhead = /** @type {(inputs: Order_To_Cash_Po_SubheadInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} · received ${i?.received} · matched to ${i?.quotation} · billing entity ${i?.entity}`)
};

export const order_to_cash_po_validated = /** @type {(inputs: Order_To_Cash_Po_ValidatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validated`)
};

export const order_to_cash_po_validated_agreed = /** @type {(inputs: Order_To_Cash_Po_Validated_AgreedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PO validated. Every mismatch has written customer agreement.`)
};

export const order_to_cash_po_validated_confirmed = /** @type {(inputs: Order_To_Cash_Po_Validated_ConfirmedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PO validated and sales order confirmed. Supplier POs follow below.`)
};

export const order_to_cash_po_vs_quotation = /** @type {(inputs: Order_To_Cash_Po_Vs_QuotationInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.po} vs ${i?.quotation}`)
};

export const order_to_cash_port_place = /** @type {(inputs: Order_To_Cash_Port_PlaceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Port · place`)
};

export const order_to_cash_pos_prepared_later = /** @type {(inputs: Order_To_Cash_Pos_Prepared_LaterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prepared when the sales order is confirmed`)
};

export const order_to_cash_pos_rechecked = /** @type {(inputs: Order_To_Cash_Pos_RecheckedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Re-checked before confirming`)
};

export const order_to_cash_proof_hint = /** @type {(inputs: Order_To_Cash_Proof_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Photo of the stamped note from the vessel, or the scanned PDF`)
};

export const order_to_cash_proof_legend = /** @type {(inputs: Order_To_Cash_Proof_LegendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signed delivery note or photo (required)`)
};

export const order_to_cash_q_items = /** @type {(inputs: Order_To_Cash_Q_ItemsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Are the items and quantities on the PO the same as on the quotation?`)
};

export const order_to_cash_q_items_no = /** @type {(inputs: Order_To_Cash_Q_Items_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`An item or quantity differs`)
};

export const order_to_cash_q_items_yes = /** @type {(inputs: Order_To_Cash_Q_Items_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Items and quantities match`)
};

export const order_to_cash_q_prices = /** @type {(inputs: Order_To_Cash_Q_PricesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Are the prices on the customer's PO the same as on the quotation?`)
};

export const order_to_cash_q_prices_no = /** @type {(inputs: Order_To_Cash_Q_Prices_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A price differs from the quotation`)
};

export const order_to_cash_q_prices_yes = /** @type {(inputs: Order_To_Cash_Q_Prices_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prices match the quotation`)
};

export const order_to_cash_q_terms = /** @type {(inputs: Order_To_Cash_Q_TermsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Do the PO's commercial terms (payment, delivery, validity) match the quotation?`)
};

export const order_to_cash_q_terms_no = /** @type {(inputs: Order_To_Cash_Q_Terms_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A term differs`)
};

export const order_to_cash_q_terms_yes = /** @type {(inputs: Order_To_Cash_Q_Terms_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Terms match`)
};

export const order_to_cash_read_note = /** @type {(inputs: Order_To_Cash_Read_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Read the signed note from a photo`)
};

export const order_to_cash_reason_hint = /** @type {(inputs: Order_To_Cash_Reason_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`L${i?.line} · ${i?.description}. Common: Vessel bought it locally · Customer cancelled the item · Price not accepted`)
};

export const order_to_cash_reason_label = /** @type {(inputs: Order_To_Cash_Reason_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reason (kept on the case)`)
};

export const order_to_cash_reason_placeholder = /** @type {(inputs: Order_To_Cash_Reason_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`e.g. Vessel bought it locally`)
};

export const order_to_cash_receipt = /** @type {(inputs: Order_To_Cash_ReceiptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receipt`)
};

export const order_to_cash_receipt_pending = /** @type {(inputs: Order_To_Cash_Receipt_PendingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirmed receipt pending: signed delivery note required`)
};

export const order_to_cash_recheck_confirm = /** @type {(inputs: Order_To_Cash_Recheck_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Re-check & confirm`)
};

export const order_to_cash_recheck_done = /** @type {(inputs: Order_To_Cash_Recheck_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Re-checked price, availability, FX and lead time with ${i?.supplier}.`)
};

export const order_to_cash_recheck_note = /** @type {(inputs: Order_To_Cash_Recheck_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.number} · ${i?.supplier}: price, availability, FX and lead time are re-checked with the supplier before it is confirmed.`)
};

export const order_to_cash_recheck_title = /** @type {(inputs: Order_To_Cash_Recheck_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Re-check before confirming ${i?.number}`)
};

export const order_to_cash_record_amendment = /** @type {(inputs: Order_To_Cash_Record_AmendmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Record amendment`)
};

export const order_to_cash_replan_heading = /** @type {(inputs: Order_To_Cash_Replan_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Re-planned after the agent's ETA change. Escalated to ${i?.owner} and Karim Balbaa`)
};

export const order_to_cash_replan_text = /** @type {(inputs: Order_To_Cash_Replan_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.at} · ${i?.text}`)
};

export const order_to_cash_rerun_po_check = /** @type {(inputs: Order_To_Cash_Rerun_Po_CheckInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Re-run PO check`)
};

export const order_to_cash_resolution_evidence = /** @type {(inputs: Order_To_Cash_Resolution_EvidenceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.resolution} · evidence attached`)
};

export const order_to_cash_result_amendment = /** @type {(inputs: Order_To_Cash_Result_AmendmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amendment recorded`)
};

export const order_to_cash_result_match = /** @type {(inputs: Order_To_Cash_Result_MatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Match`)
};

export const order_to_cash_result_mismatch = /** @type {(inputs: Order_To_Cash_Result_MismatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mismatch`)
};

export const order_to_cash_sales_order_confirmed = /** @type {(inputs: Order_To_Cash_Sales_Order_ConfirmedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sales order confirmed`)
};

export const order_to_cash_sample_from = /** @type {(inputs: Order_To_Cash_Sample_FromInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`From: purchasing (customer)`)
};

export const order_to_cash_sample_note = /** @type {(inputs: Order_To_Cash_Sample_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Delivery note ${i?.number}`)
};

export const order_to_cash_sample_re = /** @type {(inputs: Order_To_Cash_Sample_ReInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Re: ${i?.number} line ${i?.line}`)
};

export const order_to_cash_sample_received = /** @type {(inputs: Order_To_Cash_Sample_ReceivedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Received on board: ${i?.signedBy}`)
};

export const order_to_cash_sample_scan = /** @type {(inputs: Order_To_Cash_Sample_ScanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Use the sample scan from the boarding officer`)
};

export const order_to_cash_share_confirmed = /** @type {(inputs: Order_To_Cash_Share_ConfirmedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`confirmed`)
};

export const order_to_cash_share_matched = /** @type {(inputs: Order_To_Cash_Share_MatchedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} matched`)
};

export const order_to_cash_share_of_units_ordered = /** @type {(inputs: Order_To_Cash_Share_Of_Units_OrderedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`of the units ordered`)
};

export const order_to_cash_shortages = /** @type {(inputs: Order_To_Cash_ShortagesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Shortages`)
};

export const order_to_cash_shortages_hint = /** @type {(inputs: Order_To_Cash_Shortages_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Optional. Becomes a claim`)
};

export const order_to_cash_shortages_label = /** @type {(inputs: Order_To_Cash_Shortages_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Shortages or damage noted on board`)
};

export const order_to_cash_shortfall_backorder = /** @type {(inputs: Order_To_Cash_Shortfall_BackorderInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.changes}. The shortfall is scheduled as a backorder (the customer promise stays as agreed).`)
};

export const order_to_cash_signed_by_at = /** @type {(inputs: Order_To_Cash_Signed_By_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Signed by ${i?.by} · ${i?.at}`)
};

export const order_to_cash_signed_by_at_proof = /** @type {(inputs: Order_To_Cash_Signed_By_At_ProofInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Signed by ${i?.by} · ${i?.at} · signed delivery note on file`)
};

export const order_to_cash_signed_by_default = /** @type {(inputs: Order_To_Cash_Signed_By_DefaultInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Chief Officer, ${i?.vessel}`)
};

export const order_to_cash_signed_by_vessel = /** @type {(inputs: Order_To_Cash_Signed_By_VesselInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signed by (vessel)`)
};

export const order_to_cash_truck_staff = /** @type {(inputs: Order_To_Cash_Truck_StaffInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Truck & boarding staff`)
};

export const order_to_cash_undecided = /** @type {(inputs: Order_To_Cash_UndecidedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Undecided`)
};

export const order_to_cash_units_across_receipts = /** @type {(inputs: Order_To_Cash_Units_Across_ReceiptsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Units across all receipts`)
};

export const order_to_cash_vessel = /** @type {(inputs: Order_To_Cash_VesselInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`vessel`)
};

export const order_to_cash_vessel_eta = /** @type {(inputs: Order_To_Cash_Vessel_EtaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vessel ETA`)
};

export const order_to_cash_waiting_customer_order = /** @type {(inputs: Order_To_Cash_Waiting_Customer_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Waiting for the customer's order`)
};

export const order_to_cash_x_date = /** @type {(inputs: Order_To_Cash_X_DateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Date`)
};

export const order_to_cash_x_remarks = /** @type {(inputs: Order_To_Cash_X_RemarksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Shortages or damage noted`)
};

export const order_to_cash_x_signed_by = /** @type {(inputs: Order_To_Cash_X_Signed_ByInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signed by`)
};

export const order_to_cash_x_vessel = /** @type {(inputs: Order_To_Cash_X_VesselInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vessel`)
};

export const page_approval_rules_approved = /** @type {(inputs: Page_Approval_Rules_ApprovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approved`)
};

export const page_approval_rules_halfway = /** @type {(inputs: Page_Approval_Rules_HalfwayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Halfway`)
};

export const page_approval_rules_rejected = /** @type {(inputs: Page_Approval_Rules_RejectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rejected`)
};

export const page_approval_rules_requests_title = /** @type {(inputs: Page_Approval_Rules_Requests_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Requests under these rules`)
};

export const page_approval_rules_two_person = /** @type {(inputs: Page_Approval_Rules_Two_PersonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Two-person rules`)
};

export const page_approval_rules_waiting = /** @type {(inputs: Page_Approval_Rules_WaitingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Waiting`)
};

export const page_approval_rules_waiting_title = /** @type {(inputs: Page_Approval_Rules_Waiting_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Waiting for a decision`)
};

export const page_approvals_all = /** @type {(inputs: Page_Approvals_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All approvals`)
};

export const page_approvals_by_kind = /** @type {(inputs: Page_Approvals_By_KindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What's waiting, by kind`)
};

export const page_approvals_decided = /** @type {(inputs: Page_Approvals_DecidedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Decided`)
};

export const page_approvals_eyebrow = /** @type {(inputs: Page_Approvals_EyebrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approvals`)
};

export const page_approvals_finance_ceo = /** @type {(inputs: Page_Approvals_Finance_CeoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Finance + CEO`)
};

export const page_approvals_heading = /** @type {(inputs: Page_Approvals_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Decisions that need a named person`)
};

export const page_approvals_kept_for_audit = /** @type {(inputs: Page_Approvals_Kept_For_AuditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kept with the record for audit`)
};

export const page_approvals_listed_approver = /** @type {(inputs: Page_Approvals_Listed_ApproverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`You are a listed approver`)
};

export const page_approvals_others_empty = /** @type {(inputs: Page_Approvals_Others_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No other open requests.`)
};

export const page_approvals_others_subhead = /** @type {(inputs: Page_Approvals_Others_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Requests you can follow but not decide — each card says who can.`)
};

export const page_approvals_recent_empty = /** @type {(inputs: Page_Approvals_Recent_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No decisions yet.`)
};

export const page_approvals_recent_subhead = /** @type {(inputs: Page_Approvals_Recent_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approved and returned requests, with who decided and why.`)
};

export const page_approvals_recent_title = /** @type {(inputs: Page_Approvals_Recent_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Recently decided`)
};

export const page_approvals_rules = /** @type {(inputs: Page_Approvals_RulesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approval rules`)
};

export const page_approvals_see_not_decide = /** @type {(inputs: Page_Approvals_See_Not_DecideInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`You can see the evidence, not decide`)
};

export const page_approvals_subtitle = /** @type {(inputs: Page_Approvals_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every quotation, margin exception, payment, alternative item, bank-detail change and FX rate needs a named person. AI never approves.`)
};

export const page_approvals_two_person = /** @type {(inputs: Page_Approvals_Two_PersonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Two-person requests`)
};

export const page_approvals_waiting_for_others = /** @type {(inputs: Page_Approvals_Waiting_For_OthersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Waiting for others`)
};

export const page_approvals_waiting_for_you = /** @type {(inputs: Page_Approvals_Waiting_For_YouInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Waiting for you`)
};

export const page_approvals_yours_empty = /** @type {(inputs: Page_Approvals_Yours_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing needs your decision right now.`)
};

export const page_approvals_yours_subhead = /** @type {(inputs: Page_Approvals_Yours_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approve or return with a reason. Your decision is recorded under your name.`)
};

export const page_aside_awaiting_customer = /** @type {(inputs: Page_Aside_Awaiting_CustomerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Waiting on customers`)
};

export const page_aside_awaiting_customer_note = /** @type {(inputs: Page_Aside_Awaiting_Customer_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your quotes sent, waiting for a decision`)
};

export const page_aside_awaiting_supplier = /** @type {(inputs: Page_Aside_Awaiting_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Waiting on suppliers`)
};

export const page_aside_awaiting_supplier_note = /** @type {(inputs: Page_Aside_Awaiting_Supplier_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cases held for supplier replies`)
};

export const page_aside_bills = /** @type {(inputs: Page_Aside_BillsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier bills`)
};

export const page_aside_bills_note = /** @type {(inputs: Page_Aside_Bills_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bills to match against the PO and goods received`)
};

export const page_aside_bills_on_hold = /** @type {(inputs: Page_Aside_Bills_On_HoldInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bills on hold`)
};

export const page_aside_bills_on_hold_note = /** @type {(inputs: Page_Aside_Bills_On_Hold_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PO, receipt and bill don't match yet`)
};

export const page_aside_deliveries = /** @type {(inputs: Page_Aside_DeliveriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deliveries in progress`)
};

export const page_aside_deliveries_note = /** @type {(inputs: Page_Aside_Deliveries_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Drops planned or on the way to a vessel`)
};

export const page_aside_draft_quotes = /** @type {(inputs: Page_Aside_Draft_QuotesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quotes to finish`)
};

export const page_aside_draft_quotes_note = /** @type {(inputs: Page_Aside_Draft_Quotes_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Drafts not yet sent`)
};

export const page_aside_exceptions = /** @type {(inputs: Page_Aside_ExceptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Integration exceptions`)
};

export const page_aside_exceptions_note = /** @type {(inputs: Page_Aside_Exceptions_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Failed mailbox, e-invoice or AI steps waiting for a person`)
};

export const page_aside_follow_ups = /** @type {(inputs: Page_Aside_Follow_UpsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open follow-ups`)
};

export const page_aside_follow_ups_note = /** @type {(inputs: Page_Aside_Follow_Ups_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Calls, messages and reminders to do`)
};

export const page_aside_held = /** @type {(inputs: Page_Aside_HeldInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Held for approval`)
};

export const page_aside_held_note = /** @type {(inputs: Page_Aside_Held_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cases waiting on a margin, deposit or other approval`)
};

export const page_aside_inbox = /** @type {(inputs: Page_Aside_InboxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inbox to triage`)
};

export const page_aside_inbox_note = /** @type {(inputs: Page_Aside_Inbox_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New messages and uncertain matches`)
};

export const page_aside_live_cases = /** @type {(inputs: Page_Aside_Live_CasesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Live cases`)
};

export const page_aside_live_cases_note = /** @type {(inputs: Page_Aside_Live_Cases_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every case not yet settled, lost or expired`)
};

export const page_aside_my_decisions = /** @type {(inputs: Page_Aside_My_DecisionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Decisions waiting for me`)
};

export const page_aside_my_decisions_note = /** @type {(inputs: Page_Aside_My_Decisions_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approvals routed to you that you haven't decided`)
};

export const page_aside_my_live_cases = /** @type {(inputs: Page_Aside_My_Live_CasesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`My live cases`)
};

export const page_aside_my_live_cases_note = /** @type {(inputs: Page_Aside_My_Live_Cases_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cases you own that are still open`)
};

export const page_aside_my_tasks = /** @type {(inputs: Page_Aside_My_TasksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`My open tasks`)
};

export const page_aside_my_tasks_note = /** @type {(inputs: Page_Aside_My_Tasks_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your follow-ups still open`)
};

export const page_aside_overdue = /** @type {(inputs: Page_Aside_OverdueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Overdue invoices`)
};

export const page_aside_overdue_note = /** @type {(inputs: Page_Aside_Overdue_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Past their due date with a balance open`)
};

export const page_aside_pipeline = /** @type {(inputs: Page_Aside_PipelineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`My pipeline`)
};

export const page_aside_pipeline_note = /** @type {(inputs: Page_Aside_Pipeline_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prospects you're working on`)
};

export const page_aside_rfqs_waiting = /** @type {(inputs: Page_Aside_Rfqs_WaitingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`RFQs awaiting reply`)
};

export const page_aside_rfqs_waiting_note = /** @type {(inputs: Page_Aside_Rfqs_Waiting_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suppliers who haven't answered yet`)
};

export const page_aside_to_collect = /** @type {(inputs: Page_Aside_To_CollectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoices to collect`)
};

export const page_aside_to_collect_note = /** @type {(inputs: Page_Aside_To_Collect_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer invoices with a balance still open`)
};

export const page_aside_your_desk = /** @type {(inputs: Page_Aside_Your_DeskInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your desk`)
};

export const page_automations_activity_log = /** @type {(inputs: Page_Automations_Activity_LogInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Full activity log`)
};

export const page_automations_ai_log_subhead = /** @type {(inputs: Page_Automations_Ai_Log_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every AI call: what it read, how sure it was, and the person who checked it.`)
};

export const page_automations_ai_log_title = /** @type {(inputs: Page_Automations_Ai_Log_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI log`)
};

export const page_automations_all_exceptions = /** @type {(inputs: Page_Automations_All_ExceptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All exceptions`)
};

export const page_automations_audit_subhead = /** @type {(inputs: Page_Automations_Audit_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every automatic step and human decision, append-only.`)
};

export const page_automations_audit_title = /** @type {(inputs: Page_Automations_Audit_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Audit log`)
};

export const page_automations_auto_resolved = /** @type {(inputs: Page_Automations_Auto_ResolvedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Auto-resolved`)
};

export const page_automations_automatic = /** @type {(inputs: Page_Automations_AutomaticInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Runs automatically under approved rules`)
};

export const page_automations_by_people = /** @type {(inputs: Page_Automations_By_PeopleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prepared for an authorised person`)
};

export const page_automations_duplicates_caught = /** @type {(inputs: Page_Automations_Duplicates_CaughtInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`duplicates caught by idempotency key`)
};

export const page_automations_eyebrow = /** @type {(inputs: Page_Automations_EyebrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Work · automation`)
};

export const page_automations_heading = /** @type {(inputs: Page_Automations_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Automations & exceptions`)
};

export const page_automations_nothing_silent = /** @type {(inputs: Page_Automations_Nothing_SilentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`nothing fails silently`)
};

export const page_automations_open_exceptions = /** @type {(inputs: Page_Automations_Open_ExceptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open exceptions`)
};

export const page_automations_owner_due = /** @type {(inputs: Page_Automations_Owner_DueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Owner · due`)
};

export const page_automations_queue_subhead = /** @type {(inputs: Page_Automations_Queue_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A retry first checks the idempotency key (message-id, invoice number, mailbox), so nothing is created, imported or sent twice. Retrying a resolved item changes nothing.`)
};

export const page_automations_queue_title = /** @type {(inputs: Page_Automations_Queue_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exception queue`)
};

export const page_automations_registry_subhead = /** @type {(inputs: Page_Automations_Registry_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every rule is explicit; management pauses or enables one, and each change is logged.`)
};

export const page_automations_registry_title = /** @type {(inputs: Page_Automations_Registry_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rule registry`)
};

export const page_automations_review_queue = /** @type {(inputs: Page_Automations_Review_QueueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI review queue`)
};

export const page_automations_rule = /** @type {(inputs: Page_Automations_RuleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rule`)
};

export const page_automations_subtitle = /** @type {(inputs: Page_Automations_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every automation has a trigger, owner, due time, approval rule, retry behaviour and stop condition. Reprocessing never creates duplicates; failures land in the exception queue with a safe retry.`)
};

export const page_automations_what = /** @type {(inputs: Page_Automations_WhatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What`)
};

export const page_automations_what_happened = /** @type {(inputs: Page_Automations_What_HappenedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What happened`)
};

export const page_automations_what_it_read = /** @type {(inputs: Page_Automations_What_It_ReadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What it read`)
};

export const page_automations_when = /** @type {(inputs: Page_Automations_WhenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`When`)
};

export const page_automations_who = /** @type {(inputs: Page_Automations_WhoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Who`)
};

export const page_cash_ageing_subhead = /** @type {(inputs: Page_Cash_Ageing_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open balances in USD equivalent at today's rates, by days past due.`)
};

export const page_cash_ageing_title = /** @type {(inputs: Page_Cash_Ageing_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receivables ageing by customer`)
};

export const page_cash_all_invoices = /** @type {(inputs: Page_Cash_All_InvoicesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All invoices`)
};

export const page_cash_approvals_queue = /** @type {(inputs: Page_Cash_Approvals_QueueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approvals queue`)
};

export const page_cash_bank_change_subhead = /** @type {(inputs: Page_Cash_Bank_Change_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Two-person check: Finance and the CEO, after a call-back on the number on file.`)
};

export const page_cash_bills_by_due = /** @type {(inputs: Page_Cash_Bills_By_DueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier bills by due date`)
};

export const page_cash_buckets_title = /** @type {(inputs: Page_Cash_Buckets_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ageing buckets by customer`)
};

export const page_cash_collections_subhead = /** @type {(inputs: Page_Cash_Collections_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reminders follow each customer's contact rule: “do not chase” accounts get an internal reminder only; for the others the AI drafts the email and a person reviews and sends it.`)
};

export const page_cash_collections_title = /** @type {(inputs: Page_Cash_Collections_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Collections — open invoices`)
};

export const page_cash_due_month = /** @type {(inputs: Page_Cash_Due_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Due this month`)
};

export const page_cash_e_invoice = /** @type {(inputs: Page_Cash_E_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`E-invoice`)
};

export const page_cash_eyebrow = /** @type {(inputs: Page_Cash_EyebrowInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Finance · ${i?.day}`)
};

export const page_cash_fd_or_ceo = /** @type {(inputs: Page_Cash_Fd_Or_CeoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Financial Director or CEO`)
};

export const page_cash_heading = /** @type {(inputs: Page_Cash_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receivables & payables`)
};

export const page_cash_in_out = /** @type {(inputs: Page_Cash_In_OutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cash in vs out — next 8 weeks`)
};

export const page_cash_in_out_subhead = /** @type {(inputs: Page_Cash_In_Out_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`EGP thousands, by week`)
};

export const page_cash_next_weeks = /** @type {(inputs: Page_Cash_Next_WeeksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cash, next 8 weeks`)
};

export const page_cash_no_bank_changes = /** @type {(inputs: Page_Cash_No_Bank_ChangesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No bank-detail changes in progress.`)
};

export const page_cash_no_bank_request = /** @type {(inputs: Page_Cash_No_Bank_RequestInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No bank-detail change requested.`)
};

export const page_cash_no_open_invoices = /** @type {(inputs: Page_Cash_No_Open_InvoicesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No open invoices.`)
};

export const page_cash_no_payments = /** @type {(inputs: Page_Cash_No_PaymentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No payments waiting for approval.`)
};

export const page_cash_no_receivables = /** @type {(inputs: Page_Cash_No_ReceivablesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No open receivables.`)
};

export const page_cash_nothing_owed = /** @type {(inputs: Page_Cash_Nothing_OwedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing owed to suppliers.`)
};

export const page_cash_open_invoices = /** @type {(inputs: Page_Cash_Open_InvoicesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open invoices`)
};

export const page_cash_overdue = /** @type {(inputs: Page_Cash_OverdueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Overdue`)
};

export const page_cash_overdue_note = /** @type {(inputs: Page_Cash_Overdue_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Past their due date · USD equivalent`)
};

export const page_cash_payables = /** @type {(inputs: Page_Cash_PayablesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payables`)
};

export const page_cash_payables_note = /** @type {(inputs: Page_Cash_Payables_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open supplier balances · EGP equivalent`)
};

export const page_cash_payables_subhead = /** @type {(inputs: Page_Cash_Payables_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deposits paid against pro formas, balances due on delivery, and bills held when PO, receipt and bill don't match.`)
};

export const page_cash_payables_title = /** @type {(inputs: Page_Cash_Payables_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier payables`)
};

export const page_cash_payments_subhead = /** @type {(inputs: Page_Cash_Payments_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every supplier payment needs the Financial Director or the CEO. Once approved, finance pays in the bank and records it here with the bank reference.`)
};

export const page_cash_payments_title = /** @type {(inputs: Page_Cash_Payments_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payments needing approval`)
};

export const page_cash_payments_to_approve = /** @type {(inputs: Page_Cash_Payments_To_ApproveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payments to approve`)
};

export const page_cash_receivables = /** @type {(inputs: Page_Cash_ReceivablesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receivables`)
};

export const page_cash_receivables_note = /** @type {(inputs: Page_Cash_Receivables_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open invoices · USD equivalent`)
};

export const page_cash_remittance = /** @type {(inputs: Page_Cash_RemittanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Match a remittance`)
};

export const page_cash_requested_change = /** @type {(inputs: Page_Cash_Requested_ChangeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier}: requested change`)
};

export const page_cash_subtitle = /** @type {(inputs: Page_Cash_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What customers owe, what we owe suppliers, and what needs a decision. Money moves only in the bank — here people approve and record it.`)
};

export const page_cash_supplier_balances = /** @type {(inputs: Page_Cash_Supplier_BalancesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier balances open`)
};

export const page_cash_who_owes = /** @type {(inputs: Page_Cash_Who_OwesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Who owes us`)
};

export const page_compare_check_title = /** @type {(inputs: Page_Compare_Check_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Offer check · L${i?.line} · ${i?.description}`)
};

export const page_compare_correction_title = /** @type {(inputs: Page_Compare_Correction_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Correction request · ${i?.supplier} v${i?.version}`)
};

export const page_compare_denied = /** @type {(inputs: Page_Compare_DeniedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Costs and margins are hidden for your role. Supplier offers carry supplier costs, so Sales sees the selling prices on the quotation instead. Supply chain, finance and management compare offers.`)
};

export const page_compare_how_title = /** @type {(inputs: Page_Compare_How_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`How offers are compared`)
};

export const page_compare_line_title = /** @type {(inputs: Page_Compare_Line_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`L${i?.line} · ${i?.description}`)
};

export const page_compare_next_step = /** @type {(inputs: Page_Compare_Next_StepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next step`)
};

export const page_compare_no_corrections = /** @type {(inputs: Page_Compare_No_CorrectionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No offers need a correction request.`)
};

export const page_compare_no_lines = /** @type {(inputs: Page_Compare_No_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No requested lines to compare yet.`)
};

export const page_compare_no_more_checks = /** @type {(inputs: Page_Compare_No_More_ChecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No more lines with offers to check.`)
};

export const page_compare_no_more_lines = /** @type {(inputs: Page_Compare_No_More_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No more requested lines on this case.`)
};

export const page_compare_no_waiting = /** @type {(inputs: Page_Compare_No_WaitingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No line is waiting on a supplier's offer.`)
};

export const page_compare_others_title = /** @type {(inputs: Page_Compare_Others_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Asked, no offer · L${i?.line} · ${i?.description}`)
};

export const page_delivery_amount_vat = /** @type {(inputs: Page_Delivery_Amount_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amount · VAT`)
};

export const page_delivery_backorders_subhead = /** @type {(inputs: Page_Delivery_Backorders_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receipt shortfalls become backorders with a date and an owner; a late supplier is escalated against the drop it was meant for.`)
};

export const page_delivery_backorders_title = /** @type {(inputs: Page_Delivery_Backorders_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Backorders & late suppliers`)
};

export const page_delivery_balance = /** @type {(inputs: Page_Delivery_BalanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Balance`)
};

export const page_delivery_balance_note = /** @type {(inputs: Page_Delivery_Balance_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoices still open: $count`)
};

export const page_delivery_check_subhead = /** @type {(inputs: Page_Delivery_Check_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The next drop out`)
};

export const page_delivery_check_title = /** @type {(inputs: Page_Delivery_Check_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pre-dispatch check`)
};

export const page_delivery_drops_subhead = /** @type {(inputs: Page_Delivery_Drops_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`“Delivered” needs evidence: dispatch and confirmed receipt are separate, and a drop is confirmed only with the signed delivery note or photo from the vessel.`)
};

export const page_delivery_drops_title = /** @type {(inputs: Page_Delivery_Drops_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Drops & proof of delivery`)
};

export const page_delivery_invoice = /** @type {(inputs: Page_Delivery_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoice`)
};

export const page_delivery_invoiced = /** @type {(inputs: Page_Delivery_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoiced`)
};

export const page_delivery_invoiced_note = /** @type {(inputs: Page_Delivery_Invoiced_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delivered quantities only`)
};

export const page_delivery_invoices_subhead = /** @type {(inputs: Page_Delivery_Invoices_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoices come from signed deliveries: only delivered quantities, never the same quantity twice. Each one is signed and submitted to the Egyptian Tax Authority; a failed signature submits nothing and is safe to retry.`)
};

export const page_delivery_invoices_title = /** @type {(inputs: Page_Delivery_Invoices_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer invoices & payments`)
};

export const page_delivery_no_backorders = /** @type {(inputs: Page_Delivery_No_BackordersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No backorders on this case.`)
};

export const page_delivery_no_dispatch = /** @type {(inputs: Page_Delivery_No_DispatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No drop to dispatch yet.`)
};

export const page_delivery_no_drops = /** @type {(inputs: Page_Delivery_No_DropsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No deliveries planned yet.`)
};

export const page_delivery_no_invoice = /** @type {(inputs: Page_Delivery_No_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No invoice yet. The first one is created from a delivery confirmed with a signed note.`)
};

export const page_delivery_no_invoices = /** @type {(inputs: Page_Delivery_No_InvoicesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No invoices on this case yet.`)
};

export const page_delivery_paid_balance = /** @type {(inputs: Page_Delivery_Paid_BalanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paid · balance`)
};

export const page_delivery_plan_title = /** @type {(inputs: Page_Delivery_Plan_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vessel delivery plan`)
};

export const page_delivery_received = /** @type {(inputs: Page_Delivery_ReceivedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Received`)
};

export const page_delivery_received_note = /** @type {(inputs: Page_Delivery_Received_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer payments allocated`)
};

export const page_delivery_short = /** @type {(inputs: Page_Delivery_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Short`)
};

export const page_growth_add = /** @type {(inputs: Page_Growth_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add opportunity`)
};

export const page_growth_campaign = /** @type {(inputs: Page_Growth_CampaignInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Campaign`)
};

export const page_growth_campaigns = /** @type {(inputs: Page_Growth_CampaignsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Campaigns`)
};

export const page_growth_campaigns_can_send = /** @type {(inputs: Page_Growth_Campaigns_Can_SendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approved lists and content only. You can schedule and send.`)
};

export const page_growth_campaigns_cannot_send = /** @type {(inputs: Page_Growth_Campaigns_Cannot_SendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approved lists and content only. Only Karim Balbaa schedules or sends.`)
};

export const page_growth_content = /** @type {(inputs: Page_Growth_ContentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Content`)
};

export const page_growth_documents = /** @type {(inputs: Page_Growth_DocumentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Registration documents`)
};

export const page_growth_eyebrow = /** @type {(inputs: Page_Growth_EyebrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Growth`)
};

export const page_growth_fleets = /** @type {(inputs: Page_Growth_FleetsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fleets per ship manager`)
};

export const page_growth_funnel = /** @type {(inputs: Page_Growth_FunnelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Growth funnel`)
};

export const page_growth_funnel_subhead = /** @type {(inputs: Page_Growth_Funnel_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prospects that reached each stage or went further`)
};

export const page_growth_heading = /** @type {(inputs: Page_Growth_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Growth board`)
};

export const page_growth_next = /** @type {(inputs: Page_Growth_NextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next`)
};

export const page_growth_next_steps = /** @type {(inputs: Page_Growth_Next_StepsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sales next steps`)
};

export const page_growth_next_steps_subhead = /** @type {(inputs: Page_Growth_Next_Steps_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Each step has a channel, a date and what to say. Call or message yourself, then record what happened — the next step lands on the owner's follow-ups.`)
};

export const page_growth_no_step = /** @type {(inputs: Page_Growth_No_StepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No next step`)
};

export const page_growth_no_step_note = /** @type {(inputs: Page_Growth_No_Step_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`plan one or close the opportunity`)
};

export const page_growth_open = /** @type {(inputs: Page_Growth_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open opportunities`)
};

export const page_growth_open_note = /** @type {(inputs: Page_Growth_Open_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`prospects to active accounts`)
};

export const page_growth_pipeline = /** @type {(inputs: Page_Growth_PipelineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pipeline`)
};

export const page_growth_registrations = /** @type {(inputs: Page_Growth_RegistrationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Registrations in progress`)
};

export const page_growth_registrations_glance = /** @type {(inputs: Page_Growth_Registrations_GlanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Registrations at a glance`)
};

export const page_growth_registrations_note = /** @type {(inputs: Page_Growth_Registrations_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`waiting on documents or a committee`)
};

export const page_growth_sources = /** @type {(inputs: Page_Growth_SourcesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Where prospects come from`)
};

export const page_growth_stage_active = /** @type {(inputs: Page_Growth_Stage_ActiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Active account`)
};

export const page_growth_stage_approved = /** @type {(inputs: Page_Growth_Stage_ApprovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approved vendor`)
};

export const page_growth_stage_first_rfq = /** @type {(inputs: Page_Growth_Stage_First_RfqInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`First RFQ`)
};

export const page_growth_stage_introduced = /** @type {(inputs: Page_Growth_Stage_IntroducedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Introduced`)
};

export const page_growth_stage_prospect = /** @type {(inputs: Page_Growth_Stage_ProspectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prospect`)
};

export const page_growth_stage_registration = /** @type {(inputs: Page_Growth_Stage_RegistrationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Registration submitted`)
};

export const page_growth_subtitle = /** @type {(inputs: Page_Growth_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prospects, fleets, introductions and vendor registrations — kept apart from operational RFQs, and linked to the customer once business is won.`)
};

export const page_growth_this_week = /** @type {(inputs: Page_Growth_This_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next steps this week`)
};

export const page_growth_this_week_note = /** @type {(inputs: Page_Growth_This_Week_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`calls, emails and visits planned`)
};

export const page_growth_vendor_subhead = /** @type {(inputs: Page_Growth_Vendor_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Applications to become an approved supplier of a ship manager or owner.`)
};

export const page_growth_vendor_title = /** @type {(inputs: Page_Growth_Vendor_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vendor registrations`)
};

export const page_growth_vessels = /** @type {(inputs: Page_Growth_VesselsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vessels per ship manager`)
};

export const page_growth_vessels_subhead = /** @type {(inputs: Page_Growth_Vessels_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vessels with IMO for customers and prospects — the room to grow is every vessel we don't supply yet.`)
};

export const page_history_customers = /** @type {(inputs: Page_History_CustomersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customers — ship managers`)
};

export const page_history_dedup = /** @type {(inputs: Page_History_DedupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`De-duplication`)
};

export const page_history_mailboxes = /** @type {(inputs: Page_History_MailboxesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mailboxes imported`)
};

export const page_history_no_customers = /** @type {(inputs: Page_History_No_CustomersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No customers found yet.`)
};

export const page_history_no_prices = /** @type {(inputs: Page_History_No_PricesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No dated prices found yet.`)
};

export const page_history_no_suppliers = /** @type {(inputs: Page_History_No_SuppliersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No suppliers found yet.`)
};

export const page_history_no_vessels = /** @type {(inputs: Page_History_No_VesselsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No vessels found yet.`)
};

export const page_history_not_organised = /** @type {(inputs: Page_History_Not_OrganisedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Press Organise to read them from the kept messages.`)
};

export const page_history_organise_approve = /** @type {(inputs: Page_History_Organise_ApproveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Organise and approve`)
};

export const page_history_per_year = /** @type {(inputs: Page_History_Per_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Messages per year`)
};

export const page_history_prices = /** @type {(inputs: Page_History_PricesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dated prices — even with no PO`)
};

export const page_history_progress = /** @type {(inputs: Page_History_ProgressInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Import progress`)
};

export const page_history_suppliers = /** @type {(inputs: Page_History_SuppliersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suppliers — who quoted what`)
};

export const page_history_uncertain_empty = /** @type {(inputs: Page_History_Uncertain_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing to review yet. What the organiser isn't sure of comes here after Organise.`)
};

export const page_history_uncertain_subhead = /** @type {(inputs: Page_History_Uncertain_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reviewed with you before they are saved: confirm the proposal or reject it.`)
};

export const page_history_uncertain_title = /** @type {(inputs: Page_History_Uncertain_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Uncertain items`)
};

export const page_history_vessels = /** @type {(inputs: Page_History_VesselsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vessels — IMO, fleet, ports`)
};

export const page_home_all_live = /** @type {(inputs: Page_Home_All_LiveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All live cases`)
};

export const page_home_all_live_subhead = /** @type {(inputs: Page_Home_All_Live_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sorted by risk, then deadline · every case has an owner and a next action`)
};

export const page_home_bills_match = /** @type {(inputs: Page_Home_Bills_MatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier bills to match`)
};

export const page_home_bills_match_note = /** @type {(inputs: Page_Home_Bills_Match_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PO · receipt · bill`)
};

export const page_home_briefing = /** @type {(inputs: Page_Home_BriefingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Daily briefing`)
};

export const page_home_by_risk = /** @type {(inputs: Page_Home_By_RiskInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sorted by risk, then deadline`)
};

export const page_home_customer_vessel = /** @type {(inputs: Page_Home_Customer_VesselInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer · vessel`)
};

export const page_home_deadlines = /** @type {(inputs: Page_Home_DeadlinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deadlines, live`)
};

export const page_home_deadlines_subhead = /** @type {(inputs: Page_Home_Deadlines_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quotes due and vessels arriving, soonest first`)
};

export const page_home_decisions_note = /** @type {(inputs: Page_Home_Decisions_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`payments, deposits, bank changes`)
};

export const page_home_decisions_waiting = /** @type {(inputs: Page_Home_Decisions_WaitingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Decisions waiting`)
};

export const page_home_desk_cases = /** @type {(inputs: Page_Home_Desk_CasesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Desk cases`)
};

export const page_home_desk_cases_subhead = /** @type {(inputs: Page_Home_Desk_Cases_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every live case, its owner and next step`)
};

export const page_home_desk_queue_subhead = /** @type {(inputs: Page_Home_Desk_Queue_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sorted by risk, then deadline · every case has an owner, deadline and next action`)
};

export const page_home_due_today = /** @type {(inputs: Page_Home_Due_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Follow-ups due today`)
};

export const page_home_due_today_note = /** @type {(inputs: Page_Home_Due_Today_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`reminders stop on reply`)
};

export const page_home_exceptions = /** @type {(inputs: Page_Home_ExceptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Integration exceptions`)
};

export const page_home_exceptions_note = /** @type {(inputs: Page_Home_Exceptions_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`safe retry available`)
};

export const page_home_follow_ups_subhead = /** @type {(inputs: Page_Home_Follow_Ups_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reminders stop on reply, decline or case closure`)
};

export const page_home_follow_ups_title = /** @type {(inputs: Page_Home_Follow_Ups_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Today's follow-ups`)
};

export const page_home_inbox_note = /** @type {(inputs: Page_Home_Inbox_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`new messages and uncertain matches`)
};

export const page_home_inbox_subhead = /** @type {(inputs: Page_Home_Inbox_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI has read each message — check the case, owner and missing details`)
};

export const page_home_inbox_triage = /** @type {(inputs: Page_Home_Inbox_TriageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inbox to triage`)
};

export const page_home_lines = /** @type {(inputs: Page_Home_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lines`)
};

export const page_home_my_deadlines = /** @type {(inputs: Page_Home_My_DeadlinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`My deadlines, next 7 days`)
};

export const page_home_my_deadlines_subhead = /** @type {(inputs: Page_Home_My_Deadlines_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quote deadlines on cases I own`)
};

export const page_home_my_live_cases = /** @type {(inputs: Page_Home_My_Live_CasesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`My live cases`)
};

export const page_home_my_live_cases_note = /** @type {(inputs: Page_Home_My_Live_Cases_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`cases you own that are still open`)
};

export const page_home_my_queue = /** @type {(inputs: Page_Home_My_QueueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`My queue`)
};

export const page_home_my_queue_subhead = /** @type {(inputs: Page_Home_My_Queue_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cases I own, sorted by risk, then deadline`)
};

export const page_home_next_blocker = /** @type {(inputs: Page_Home_Next_BlockerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next action · blocker`)
};

export const page_home_next_up = /** @type {(inputs: Page_Home_Next_UpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next up`)
};

export const page_home_no_chart = /** @type {(inputs: Page_Home_No_ChartInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No chart for this yet.`)
};

export const page_home_no_follow_ups = /** @type {(inputs: Page_Home_No_Follow_UpsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No follow-ups due today.`)
};

export const page_home_no_live_cases = /** @type {(inputs: Page_Home_No_Live_CasesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No live cases.`)
};

export const page_home_nothing_morning = /** @type {(inputs: Page_Home_Nothing_MorningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing needs you this morning.`)
};

export const page_home_nothing_this_week = /** @type {(inputs: Page_Home_Nothing_This_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing due this week.`)
};

export const page_home_open_tasks = /** @type {(inputs: Page_Home_Open_TasksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open tasks`)
};

export const page_home_pipeline = /** @type {(inputs: Page_Home_PipelineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pipeline next steps`)
};

export const page_home_pipeline_subhead = /** @type {(inputs: Page_Home_Pipeline_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Growth CRM · calls, visits and registrations`)
};

export const page_home_quote_deadlines = /** @type {(inputs: Page_Home_Quote_DeadlinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quote deadlines`)
};

export const page_home_targets = /** @type {(inputs: Page_Home_TargetsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Targets`)
};

export const page_home_this_month = /** @type {(inputs: Page_Home_This_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This month`)
};

export const page_home_this_morning = /** @type {(inputs: Page_Home_This_MorningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This morning`)
};

export const page_home_this_week = /** @type {(inputs: Page_Home_This_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This week`)
};

export const page_home_to_collect = /** @type {(inputs: Page_Home_To_CollectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoices to collect`)
};

export const page_home_to_collect_note = /** @type {(inputs: Page_Home_To_Collect_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`e-invoices valid at the tax authority`)
};

export const page_home_turnaround = /** @type {(inputs: Page_Home_TurnaroundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quote turnaround`)
};

export const page_home_win_rate = /** @type {(inputs: Page_Home_Win_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Win rate`)
};

export const page_home_your_decision = /** @type {(inputs: Page_Home_Your_DecisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Waiting for your decision`)
};

export const page_home_your_decision_subhead = /** @type {(inputs: Page_Home_Your_Decision_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Everything is prepared — you approve or return`)
};

export const page_inbox_ack = /** @type {(inputs: Page_Inbox_AckInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Acknowledgement draft`)
};

export const page_inbox_assignment = /** @type {(inputs: Page_Inbox_AssignmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Owner, backup and deadline`)
};

export const page_inbox_channels = /** @type {(inputs: Page_Inbox_ChannelsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Connected channels`)
};

export const page_inbox_draft_case = /** @type {(inputs: Page_Inbox_Draft_CaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Draft case`)
};

export const page_inbox_draft_lines = /** @type {(inputs: Page_Inbox_Draft_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Draft lines`)
};

export const page_inbox_eyebrow = /** @type {(inputs: Page_Inbox_EyebrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sourcing desk · intake`)
};

export const page_inbox_heading = /** @type {(inputs: Page_Inbox_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inbox`)
};

export const page_inbox_match_empty = /** @type {(inputs: Page_Inbox_Match_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No match to show. A new request is read into a draft case, and a new reply is matched first.`)
};

export const page_inbox_match_subhead = /** @type {(inputs: Page_Inbox_Match_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Why it matched and who decided. Below 85% a person picks the case; a duplicate stays with the message already in.`)
};

export const page_inbox_match_title = /** @type {(inputs: Page_Inbox_Match_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reply match`)
};

export const page_inbox_messages = /** @type {(inputs: Page_Inbox_MessagesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Messages`)
};

export const page_inbox_missing = /** @type {(inputs: Page_Inbox_MissingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Missing or unclear`)
};

export const page_inbox_next_step = /** @type {(inputs: Page_Inbox_Next_StepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next step`)
};

export const page_inbox_no_ack = /** @type {(inputs: Page_Inbox_No_AckInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No acknowledgement for this message.`)
};

export const page_inbox_no_ack_description = /** @type {(inputs: Page_Inbox_No_Ack_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A new request gets one, from the approved template.`)
};

export const page_inbox_no_draft = /** @type {(inputs: Page_Inbox_No_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No draft case for this message.`)
};

export const page_inbox_no_draft_description = /** @type {(inputs: Page_Inbox_No_Draft_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Only a request for quotation is read into one.`)
};

export const page_inbox_no_draft_lines = /** @type {(inputs: Page_Inbox_No_Draft_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No draft lines for this message.`)
};

export const page_inbox_no_match_filter = /** @type {(inputs: Page_Inbox_No_Match_FilterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No messages match this filter.`)
};

export const page_inbox_no_message = /** @type {(inputs: Page_Inbox_No_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No message open.`)
};

export const page_inbox_no_next_step = /** @type {(inputs: Page_Inbox_No_Next_StepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No next step for this message.`)
};

export const page_inbox_no_owner = /** @type {(inputs: Page_Inbox_No_OwnerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No owner suggested yet.`)
};

export const page_inbox_no_owner_description = /** @type {(inputs: Page_Inbox_No_Owner_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The assignment rules suggest one once a request is read into a draft case.`)
};

export const page_inbox_no_text = /** @type {(inputs: Page_Inbox_No_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No text to read in this message.`)
};

export const page_inbox_no_warnings_text = /** @type {(inputs: Page_Inbox_No_Warnings_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No text to check for warnings.`)
};

export const page_inbox_nothing_clarify = /** @type {(inputs: Page_Inbox_Nothing_ClarifyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing to clarify with the sender.`)
};

export const page_inbox_offer_details = /** @type {(inputs: Page_Inbox_Offer_DetailsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Offer details and replies`)
};

export const page_inbox_original = /** @type {(inputs: Page_Inbox_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Original message`)
};

export const page_inbox_original_subhead = /** @type {(inputs: Page_Inbox_Original_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The message as it arrived`)
};

export const page_inbox_pick_message = /** @type {(inputs: Page_Inbox_Pick_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pick a message in the list.`)
};

export const page_inbox_review_empty = /** @type {(inputs: Page_Inbox_Review_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing waiting for review. Every reply is matched.`)
};

export const page_inbox_review_subhead = /** @type {(inputs: Page_Inbox_Review_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Matches below 85% confidence are never linked automatically — a person picks the case.`)
};

export const page_inbox_review_title = /** @type {(inputs: Page_Inbox_Review_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Review queue`)
};

export const page_inbox_subtitle = /** @type {(inputs: Page_Inbox_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every channel in one inbox. AI reads emails, files and photos into a draft case; people decide.`)
};

export const page_inbox_warnings = /** @type {(inputs: Page_Inbox_WarningsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Warnings in this message`)
};

export const page_inbox_what_is = /** @type {(inputs: Page_Inbox_What_IsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What this message is`)
};

export const page_integrations_ack = /** @type {(inputs: Page_Integrations_AckInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Branded acknowledgement`)
};

export const page_integrations_backups = /** @type {(inputs: Page_Integrations_BackupsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Backups, staging & export`)
};

export const page_integrations_channels = /** @type {(inputs: Page_Integrations_ChannelsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Channels`)
};

export const page_integrations_channels_subhead = /** @type {(inputs: Page_Integrations_Channels_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The website, WhatsApp, the tax authority, AI extraction, documents and Odoo underneath.`)
};

export const page_integrations_edit = /** @type {(inputs: Page_Integrations_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Edit connections`)
};

export const page_integrations_exception_queue = /** @type {(inputs: Page_Integrations_Exception_QueueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exception queue`)
};

export const page_integrations_eyebrow = /** @type {(inputs: Page_Integrations_EyebrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Configuration · integrations`)
};

export const page_integrations_heading = /** @type {(inputs: Page_Integrations_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Integrations & data`)
};

export const page_integrations_history = /** @type {(inputs: Page_Integrations_HistoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Email history import`)
};

export const page_integrations_history_subhead = /** @type {(inputs: Page_Integrations_History_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Days of email imported`)
};

export const page_integrations_imported = /** @type {(inputs: Page_Integrations_ImportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Emails imported`)
};

export const page_integrations_language = /** @type {(inputs: Page_Integrations_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Language — English / العربية`)
};

export const page_integrations_mailbox = /** @type {(inputs: Page_Integrations_MailboxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mailbox`)
};

export const page_integrations_mailboxes = /** @type {(inputs: Page_Integrations_MailboxesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mailboxes`)
};

export const page_integrations_mailboxes_subhead = /** @type {(inputs: Page_Integrations_Mailboxes_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every email to these mailboxes becomes or joins a case, with its attachments kept. A failed sync never drops mail: it waits in the exception queue and imports once on reconnect.`)
};

export const page_integrations_migration = /** @type {(inputs: Page_Integrations_MigrationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Odoo migration`)
};

export const page_integrations_odoo_subhead = /** @type {(inputs: Page_Integrations_Odoo_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Each part of Odoo's data is counted, copied in, then checked by a person against Odoo. Odoo is switched off once every part is done.`)
};

export const page_integrations_odoo_title = /** @type {(inputs: Page_Integrations_Odoo_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Moving off Odoo`)
};

export const page_integrations_subtitle = /** @type {(inputs: Page_Integrations_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your mailboxes, website, WhatsApp, the tax authority and Odoo, connected — with daily backups, a staging copy and your data exportable at any time.`)
};

export const page_integrations_token = /** @type {(inputs: Page_Integrations_TokenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Token expires`)
};

export const page_order_ai_check_title = /** @type {(inputs: Page_Order_Ai_Check_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI check of the customer PO`)
};

export const page_order_amendment_header = /** @type {(inputs: Page_Order_Amendment_HeaderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer amendment · header`)
};

export const page_order_amendment_line = /** @type {(inputs: Page_Order_Amendment_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Customer amendment · line ${i?.line}`)
};

export const page_order_amount = /** @type {(inputs: Page_Order_AmountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amount`)
};

export const page_order_backorder = /** @type {(inputs: Page_Order_BackorderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Backorder`)
};

export const page_order_bill = /** @type {(inputs: Page_Order_BillInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bill`)
};

export const page_order_bills_subhead = /** @type {(inputs: Page_Order_Bills_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A bill is payable only when ordered = received = billed. More billed than received puts it on hold; the same supplier's bill number can't be booked twice.`)
};

export const page_order_bills_title = /** @type {(inputs: Page_Order_Bills_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier bills — 3-way match`)
};

export const page_order_due = /** @type {(inputs: Page_Order_DueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Due`)
};

export const page_order_lot_expiry = /** @type {(inputs: Page_Order_Lot_ExpiryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lot · expiry`)
};

export const page_order_no_bills = /** @type {(inputs: Page_Order_No_BillsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No supplier bills on this case yet.`)
};

export const page_order_no_confirm = /** @type {(inputs: Page_Order_No_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No supplier PO waiting to be confirmed.`)
};

export const page_order_no_mismatch = /** @type {(inputs: Page_Order_No_MismatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No open mismatch on the customer's PO.`)
};

export const page_order_no_partial = /** @type {(inputs: Page_Order_No_PartialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No partial award on this case.`)
};

export const page_order_no_po = /** @type {(inputs: Page_Order_No_PoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No customer PO to check yet.`)
};

export const page_order_no_pos = /** @type {(inputs: Page_Order_No_PosInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No supplier PO yet. They are prepared once the customer's PO is validated and the sales order is confirmed.`)
};

export const page_order_no_receipts = /** @type {(inputs: Page_Order_No_ReceiptsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No receipts on this case yet.`)
};

export const page_order_partial_title = /** @type {(inputs: Page_Order_Partial_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Partial award`)
};

export const page_order_po = /** @type {(inputs: Page_Order_PoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PO`)
};

export const page_order_po_check_subhead = /** @type {(inputs: Page_Order_Po_Check_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The customer's PO against the quotation`)
};

export const page_order_po_check_title = /** @type {(inputs: Page_Order_Po_Check_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer PO check`)
};

export const page_order_pos_subhead = /** @type {(inputs: Page_Order_Pos_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Created from the confirmed sales order — split suppliers and scheduled quantities. Price, availability, FX and lead time are re-checked before a PO is confirmed; Karim Balbaa approves. Deposits go through payment approval. Supplier costs are hidden for Sales.`)
};

export const page_order_pos_title = /** @type {(inputs: Page_Order_Pos_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier purchase orders`)
};

export const page_order_receipts_subhead = /** @type {(inputs: Page_Order_Receipts_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Warehouse receipts and drop-ship deliveries, with lot, expiry and quality check per line. A shortfall becomes a backorder with a date and an owner — it follows in the next drop.`)
};

export const page_order_receipts_title = /** @type {(inputs: Page_Order_Receipts_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receipts · lots · expiry · quality`)
};

export const page_overview_after_order = /** @type {(inputs: Page_Overview_After_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`After the order`)
};

export const page_overview_clarifications_subhead = /** @type {(inputs: Page_Overview_Clarifications_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Questions and answers per line, to the customer, a supplier or internal. Clear lines keep moving while one waits.`)
};

export const page_overview_clarifications_title = /** @type {(inputs: Page_Overview_Clarifications_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clarifications log`)
};

export const page_overview_contact_rule = /** @type {(inputs: Page_Overview_Contact_RuleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer contact rule`)
};

export const page_overview_handover_title = /** @type {(inputs: Page_Overview_Handover_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Last handover note`)
};

export const page_overview_lifecycle_subhead = /** @type {(inputs: Page_Overview_Lifecycle_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Where the case is now`)
};

export const page_overview_lifecycle_title = /** @type {(inputs: Page_Overview_Lifecycle_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lifecycle — first email to last payment`)
};

export const page_overview_line = /** @type {(inputs: Page_Overview_LineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Line`)
};

export const page_overview_line_progress = /** @type {(inputs: Page_Overview_Line_ProgressInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Line progress`)
};

export const page_overview_line_progress_subhead = /** @type {(inputs: Page_Overview_Line_Progress_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Each line moves on its own. A case is never “done” until every line is.`)
};

export const page_overview_line_status = /** @type {(inputs: Page_Overview_Line_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Line status`)
};

export const page_overview_next_action = /** @type {(inputs: Page_Overview_Next_ActionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next action`)
};

export const page_overview_no_clarifications = /** @type {(inputs: Page_Overview_No_ClarificationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No clarifications on this case.`)
};

export const page_overview_no_handover = /** @type {(inputs: Page_Overview_No_HandoverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No handover on this case yet.`)
};

export const page_overview_no_lines = /** @type {(inputs: Page_Overview_No_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No lines on this case yet.`)
};

export const page_overview_nothing_ordered = /** @type {(inputs: Page_Overview_Nothing_OrderedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing ordered on this case yet.`)
};

export const page_overview_open_tasks = /** @type {(inputs: Page_Overview_Open_TasksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open tasks`)
};

export const page_overview_owner_backup = /** @type {(inputs: Page_Overview_Owner_BackupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Owner & backup`)
};

export const page_overview_summary = /** @type {(inputs: Page_Overview_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Case summary`)
};

export const page_overview_timeline_subhead = /** @type {(inputs: Page_Overview_Timeline_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every automatic step names the rule that fired; every human step names the person. Nothing is edited after the fact.`)
};

export const page_overview_timeline_title = /** @type {(inputs: Page_Overview_Timeline_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activity timeline — audit trail`)
};

export const page_overview_to_via = /** @type {(inputs: Page_Overview_To_ViaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`To · via`)
};

export const page_pricing_approval = /** @type {(inputs: Page_Pricing_ApprovalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approval`)
};

export const page_pricing_build_up = /** @type {(inputs: Page_Pricing_Build_UpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Price build-up per line`)
};

export const page_pricing_build_up_subhead = /** @type {(inputs: Page_Pricing_Build_Up_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier cost + shared charges + gross profit = selling price (EGP)`)
};

export const page_pricing_hidden = /** @type {(inputs: Page_Pricing_HiddenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Costs and margins are hidden for your role`)
};

export const page_pricing_how_built = /** @type {(inputs: Page_Pricing_How_BuiltInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`How the price is built`)
};

export const page_pricing_levers = /** @type {(inputs: Page_Pricing_LeversInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Margins and discount`)
};

export const page_pricing_lines = /** @type {(inputs: Page_Pricing_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Line pricing`)
};

export const page_pricing_margin_vs_policy = /** @type {(inputs: Page_Pricing_Margin_Vs_PolicyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Margin vs policy`)
};

export const page_pricing_not_priced = /** @type {(inputs: Page_Pricing_Not_PricedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No lines priced yet.`)
};

export const page_pricing_not_priced_description = /** @type {(inputs: Page_Pricing_Not_Priced_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Select an offer for a line to price it.`)
};

export const page_pricing_policy_checks = /** @type {(inputs: Page_Pricing_Policy_ChecksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Policy checks`)
};

export const page_pricing_shared_charges = /** @type {(inputs: Page_Pricing_Shared_ChargesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Shared charges`)
};

export const page_pricing_what_if = /** @type {(inputs: Page_Pricing_What_IfInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What if`)
};

export const page_profit_claims = /** @type {(inputs: Page_Profit_ClaimsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Claims`)
};

export const page_profit_close_checklist = /** @type {(inputs: Page_Profit_Close_ChecklistInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Close checklist`)
};

export const page_profit_close_progress = /** @type {(inputs: Page_Profit_Close_ProgressInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Close progress`)
};

export const page_profit_cost_title = /** @type {(inputs: Page_Profit_Cost_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expected vs actual cost`)
};

export const page_profit_damage = /** @type {(inputs: Page_Profit_DamageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Damage for a claim`)
};

export const page_profit_denied = /** @type {(inputs: Page_Profit_DeniedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Profit, costs and margins are not visible to Sales.`)
};

export const page_profit_fx = /** @type {(inputs: Page_Profit_FxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`FX differences`)
};

export const page_profit_no_claims = /** @type {(inputs: Page_Profit_No_ClaimsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No claims before the case is costed.`)
};

export const page_profit_no_cost_sheet = /** @type {(inputs: Page_Profit_No_Cost_SheetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No cost sheet yet.`)
};

export const page_profit_no_cost_sheet_description = /** @type {(inputs: Page_Profit_No_Cost_Sheet_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expected costs are fixed when the customer's PO is confirmed.`)
};

export const page_profit_no_delivery = /** @type {(inputs: Page_Profit_No_DeliveryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No delivery to claim against yet.`)
};

export const page_profit_no_receipts = /** @type {(inputs: Page_Profit_No_ReceiptsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No receipts yet.`)
};

export const page_project_acceptance = /** @type {(inputs: Page_Project_AcceptanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Acceptance tests from your brief`)
};

export const page_project_brief = /** @type {(inputs: Page_Project_BriefInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your brief, line by line`)
};

export const page_project_calendar = /** @type {(inputs: Page_Project_CalendarInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delivery calendar`)
};

export const page_project_every_phase = /** @type {(inputs: Page_Project_Every_PhaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Running through every phase`)
};

export const page_project_eyebrow = /** @type {(inputs: Page_Project_EyebrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Golden Sea × SaaSTEMLY · delivery plan`)
};

export const page_project_follow = /** @type {(inputs: Page_Project_FollowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Follow one case`)
};

export const page_project_heading = /** @type {(inputs: Page_Project_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`From the first email to the last payment`)
};

export const page_project_milestones = /** @type {(inputs: Page_Project_MilestonesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Milestones`)
};

export const page_project_monthly = /** @type {(inputs: Page_Project_MonthlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Monthly plan — from go-live`)
};

export const page_project_no_phase = /** @type {(inputs: Page_Project_No_PhaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No phase planned here.`)
};

export const page_project_passing = /** @type {(inputs: Page_Project_PassingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Acceptance tests passing`)
};

export const page_project_payment = /** @type {(inputs: Page_Project_PaymentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The last 20% is paid after 30 days of real use.`)
};

export const page_project_problems = /** @type {(inputs: Page_Project_ProblemsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nine problems you named. Nine answers.`)
};

export const page_project_roadmap = /** @type {(inputs: Page_Project_RoadmapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Roadmap — 13 weeks, phased`)
};

export const page_project_start = /** @type {(inputs: Page_Project_StartInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Start at the inbox`)
};

export const page_project_subtitle = /** @type {(inputs: Page_Project_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Four phases over 13 weeks, each shown in this demo. Every requirement from your brief is covered and proven by an acceptance test before the final payment.`)
};

export const page_project_trust = /** @type {(inputs: Page_Project_TrustInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI never sends, prices or pays without a person.`)
};

export const page_project_weeks = /** @type {(inputs: Page_Project_WeeksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Value from week 7. Everything by week 13.`)
};

export const page_quote_approvals = /** @type {(inputs: Page_Quote_ApprovalsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approvals`)
};

export const page_quote_copy = /** @type {(inputs: Page_Quote_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer copy`)
};

export const page_quote_copy_subhead = /** @type {(inputs: Page_Quote_Copy_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer-facing: supplier names, costs and margins are never printed.`)
};

export const page_quote_decision = /** @type {(inputs: Page_Quote_DecisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Decision state`)
};

export const page_quote_internal = /** @type {(inputs: Page_Quote_InternalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Internal, never printed`)
};

export const page_quote_no_portal = /** @type {(inputs: Page_Quote_No_PortalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No portal submission to check.`)
};

export const page_quote_no_portal_description = /** @type {(inputs: Page_Quote_No_Portal_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Only quotations sent through a customer's procurement portal are checked here.`)
};

export const page_quote_no_versions = /** @type {(inputs: Page_Quote_No_VersionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No other versions.`)
};

export const page_quote_portal = /** @type {(inputs: Page_Quote_PortalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Portal submission check`)
};

export const page_quote_versions = /** @type {(inputs: Page_Quote_VersionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Versions`)
};

export const page_records_activity_by_kind = /** @type {(inputs: Page_Records_Activity_By_KindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activity by kind`)
};

export const page_records_activity_per_day = /** @type {(inputs: Page_Records_Activity_Per_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activity per day`)
};

export const page_records_ai_calls_by_task = /** @type {(inputs: Page_Records_Ai_Calls_By_TaskInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI calls by task`)
};

export const page_records_available_by_product = /** @type {(inputs: Page_Records_Available_By_ProductInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Available by product`)
};

export const page_records_balance_by_age = /** @type {(inputs: Page_Records_Balance_By_AgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open balance by age (USD)`)
};

export const page_records_balance_by_customer = /** @type {(inputs: Page_Records_Balance_By_CustomerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open balance by customer (USD)`)
};

export const page_records_bills_due_by_week = /** @type {(inputs: Page_Records_Bills_Due_By_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bills falling due, by week`)
};

export const page_records_by_segment = /** @type {(inputs: Page_Records_By_SegmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`By segment`)
};

export const page_records_case_value_by_customer = /** @type {(inputs: Page_Records_Case_Value_By_CustomerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Case value by customer`)
};

export const page_records_cases_by_stage = /** @type {(inputs: Page_Records_Cases_By_StageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cases by stage`)
};

export const page_records_cases_per_owner = /** @type {(inputs: Page_Records_Cases_Per_OwnerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cases per owner`)
};

export const page_records_contact_rules = /** @type {(inputs: Page_Records_Contact_RulesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Contact rules`)
};

export const page_records_customer_pos_per_week = /** @type {(inputs: Page_Records_Customer_Pos_Per_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer POs per week`)
};

export const page_records_customers_by_type = /** @type {(inputs: Page_Records_Customers_By_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customers by type`)
};

export const page_records_decisions_by_kind = /** @type {(inputs: Page_Records_Decisions_By_KindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Decisions by kind`)
};

export const page_records_deliveries_by_status = /** @type {(inputs: Page_Records_Deliveries_By_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deliveries by status`)
};

export const page_records_deliveries_per_case = /** @type {(inputs: Page_Records_Deliveries_Per_CaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deliveries per case`)
};

export const page_records_exceptions_by_source = /** @type {(inputs: Page_Records_Exceptions_By_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exceptions by source`)
};

export const page_records_message_sources = /** @type {(inputs: Page_Records_Message_SourcesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Where messages come from`)
};

export const page_records_messages_per_day = /** @type {(inputs: Page_Records_Messages_Per_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Messages per day`)
};

export const page_records_money_in_out = /** @type {(inputs: Page_Records_Money_In_OutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Money in and out`)
};

export const page_records_offers_by_compliance = /** @type {(inputs: Page_Records_Offers_By_ComplianceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Offers by compliance`)
};

export const page_records_offers_per_supplier = /** @type {(inputs: Page_Records_Offers_Per_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Offers per supplier`)
};

export const page_records_order_value_by_supplier = /** @type {(inputs: Page_Records_Order_Value_By_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Order value by supplier`)
};

export const page_records_orders_by_supplier = /** @type {(inputs: Page_Records_Orders_By_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Orders by supplier`)
};

export const page_records_payments_per_week = /** @type {(inputs: Page_Records_Payments_Per_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payments per week`)
};

export const page_records_pricelists_per_principal = /** @type {(inputs: Page_Records_Pricelists_Per_PrincipalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Price lists per principal`)
};

export const page_records_prices_per_supplier = /** @type {(inputs: Page_Records_Prices_Per_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prices per supplier`)
};

export const page_records_products_by_store = /** @type {(inputs: Page_Records_Products_By_StoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Products by store`)
};

export const page_records_prospect_sources = /** @type {(inputs: Page_Records_Prospect_SourcesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Where prospects come from`)
};

export const page_records_quoted_value_by_status = /** @type {(inputs: Page_Records_Quoted_Value_By_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quoted value by status`)
};

export const page_records_receipts_by_warehouse = /** @type {(inputs: Page_Records_Receipts_By_WarehouseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receipts by warehouse`)
};

export const page_records_requests_per_supplier = /** @type {(inputs: Page_Records_Requests_Per_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Requests per supplier`)
};

export const page_records_stock_by_product = /** @type {(inputs: Page_Records_Stock_By_ProductInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stock on hand by product`)
};

export const page_records_supplier_kinds = /** @type {(inputs: Page_Records_Supplier_KindsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kinds of supplier`)
};

export const page_records_suppliers_by_country = /** @type {(inputs: Page_Records_Suppliers_By_CountryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suppliers by country`)
};

export const page_records_tasks_by_type = /** @type {(inputs: Page_Records_Tasks_By_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tasks by type`)
};

export const page_records_team_by_role = /** @type {(inputs: Page_Records_Team_By_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The team by role`)
};

export const page_records_units_by_warehouse = /** @type {(inputs: Page_Records_Units_By_WarehouseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Units on hand by warehouse`)
};

export const page_records_vessels_by_type = /** @type {(inputs: Page_Records_Vessels_By_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vessels by type`)
};

export const page_records_vessels_per_customer = /** @type {(inputs: Page_Records_Vessels_Per_CustomerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vessels per customer`)
};

export const page_records_who_owes_us = /** @type {(inputs: Page_Records_Who_Owes_UsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Who owes us (USD)`)
};

export const page_rfqs_arrivals_title = /** @type {(inputs: Page_Rfqs_Arrivals_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Replies arriving`)
};

export const page_rfqs_closed = /** @type {(inputs: Page_Rfqs_ClosedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Declined · no response`)
};

export const page_rfqs_closed_note = /** @type {(inputs: Page_Rfqs_Closed_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Two reminders, then the owner is alerted`)
};

export const page_rfqs_draft_title = /** @type {(inputs: Page_Rfqs_Draft_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Draft supplier RFQs`)
};

export const page_rfqs_drafted_title = /** @type {(inputs: Page_Rfqs_Drafted_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Drafted supplier RFQs`)
};

export const page_rfqs_from_one = /** @type {(inputs: Page_Rfqs_From_OneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`From 1 customer RFQ`)
};

export const page_rfqs_lines = /** @type {(inputs: Page_Rfqs_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lines`)
};

export const page_rfqs_list_empty = /** @type {(inputs: Page_Rfqs_List_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No supplier RFQs yet — draft them below.`)
};

export const page_rfqs_list_subhead = /** @type {(inputs: Page_Rfqs_List_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Each supplier sees only the lines they can quote — never the client, the vessel or the client's files.`)
};

export const page_rfqs_matched_subhead = /** @type {(inputs: Page_Rfqs_Matched_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Matched by reference, thread and sender — even when the supplier changed the subject.`)
};

export const page_rfqs_matched_title = /** @type {(inputs: Page_Rfqs_Matched_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Replies matched`)
};

export const page_rfqs_no_drafts = /** @type {(inputs: Page_Rfqs_No_DraftsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No drafts waiting to be sent.`)
};

export const page_rfqs_no_drafts_description = /** @type {(inputs: Page_Rfqs_No_Drafts_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Draft RFQs keeps them here to check before they go out.`)
};

export const page_rfqs_no_new_suppliers = /** @type {(inputs: Page_Rfqs_No_New_SuppliersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No new suppliers from replies yet.`)
};

export const page_rfqs_no_previews = /** @type {(inputs: Page_Rfqs_No_PreviewsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No draft emails to preview.`)
};

export const page_rfqs_no_replies = /** @type {(inputs: Page_Rfqs_No_RepliesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No supplier replies yet.`)
};

export const page_rfqs_none_chased = /** @type {(inputs: Page_Rfqs_None_ChasedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No supplier is being chased.`)
};

export const page_rfqs_reminders_title = /** @type {(inputs: Page_Rfqs_Reminders_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reminders and escalation`)
};

export const page_rfqs_replied = /** @type {(inputs: Page_Rfqs_RepliedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Replied`)
};

export const page_rfqs_replied_note = /** @type {(inputs: Page_Rfqs_Replied_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Offers captured automatically`)
};

export const page_rfqs_review_empty = /** @type {(inputs: Page_Rfqs_Review_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing waiting for a person.`)
};

export const page_rfqs_review_subhead = /** @type {(inputs: Page_Rfqs_Review_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Anything the AI isn't sure of waits here — nothing uncertain is applied on its own.`)
};

export const page_rfqs_review_title = /** @type {(inputs: Page_Rfqs_Review_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Needs a person`)
};

export const page_rfqs_sent_due = /** @type {(inputs: Page_Rfqs_Sent_DueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sent · due`)
};

export const page_rfqs_supplier_rfqs = /** @type {(inputs: Page_Rfqs_Supplier_RfqsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier RFQs`)
};

export const page_rfqs_waiting = /** @type {(inputs: Page_Rfqs_WaitingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Waiting`)
};

export const page_rfqs_waiting_note = /** @type {(inputs: Page_Rfqs_Waiting_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reminders scheduled`)
};

export const page_roles_alerted = /** @type {(inputs: Page_Roles_AlertedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Who is alerted`)
};

export const page_roles_approval_rules = /** @type {(inputs: Page_Roles_Approval_RulesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approval rules`)
};

export const page_roles_enforced = /** @type {(inputs: Page_Roles_EnforcedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enforced, not just written down`)
};

export const page_roles_eyebrow = /** @type {(inputs: Page_Roles_EyebrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Team · access`)
};

export const page_roles_heading = /** @type {(inputs: Page_Roles_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Roles & permissions`)
};

export const page_roles_matrix = /** @type {(inputs: Page_Roles_MatrixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Permissions matrix`)
};

export const page_roles_matrix_subhead = /** @type {(inputs: Page_Roles_Matrix_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Who can see and approve what, per role and person. Named users and licences are confirmed in Phase 0. Management edits a role: it applies to everyone in it and is logged on the audit trail.`)
};

export const page_roles_no_alert = /** @type {(inputs: Page_Roles_No_AlertInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No one is alerted in office hours.`)
};

export const page_roles_no_alert_description = /** @type {(inputs: Page_Roles_No_Alert_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The case owner picks the RFQ up.`)
};

export const page_roles_people = /** @type {(inputs: Page_Roles_PeopleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`People`)
};

export const page_roles_role = /** @type {(inputs: Page_Roles_RoleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Role`)
};

export const page_roles_roster = /** @type {(inputs: Page_Roles_RosterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`On-call roster`)
};

export const page_roles_roster_subhead = /** @type {(inputs: Page_Roles_Roster_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Office hours Sun–Thu 08:00–17:00 Cairo. Outside them, urgent RFQs (or a vessel ETA under 24 h) alert the on-duty person by WhatsApp / SMS, then the backup, then the senior contacts. Management and the office manager edit a shift.`)
};

export const page_roles_routing = /** @type {(inputs: Page_Roles_RoutingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`After-hours routing — try it`)
};

export const page_roles_subtitle = /** @type {(inputs: Page_Roles_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sales never sees costs or margins; approvals need a named person; bank-detail changes need two. Urgent RFQs after hours go to whoever is on call.`)
};

export const page_roles_where = /** @type {(inputs: Page_Roles_WhereInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Where each permission is enforced`)
};

export const page_room_ack = /** @type {(inputs: Page_Room_AckInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Time to acknowledge`)
};

export const page_room_ask = /** @type {(inputs: Page_Room_AskInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ask Golden Sea`)
};

export const page_room_briefing = /** @type {(inputs: Page_Room_BriefingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`07:00 · daily AI briefing`)
};

export const page_room_deliveries = /** @type {(inputs: Page_Room_DeliveriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deliveries this month`)
};

export const page_room_fast_late = /** @type {(inputs: Page_Room_Fast_LateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fast but late`)
};

export const page_room_funnel = /** @type {(inputs: Page_Room_FunnelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quote funnel`)
};

export const page_room_gp_bridge = /** @type {(inputs: Page_Room_Gp_BridgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gross profit: expected to actual`)
};

export const page_room_inquiries = /** @type {(inputs: Page_Room_InquiriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inquiries per day`)
};

export const page_room_live_cases = /** @type {(inputs: Page_Room_Live_CasesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Live cases`)
};

export const page_room_lost = /** @type {(inputs: Page_Room_LostInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Why quotes were lost`)
};

export const page_room_no_gp = /** @type {(inputs: Page_Room_No_GpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No gross profit to bridge yet.`)
};

export const page_room_no_ranking = /** @type {(inputs: Page_Room_No_RankingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No ranking to show.`)
};

export const page_room_no_receivables = /** @type {(inputs: Page_Room_No_ReceivablesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No open receivables.`)
};

export const page_room_no_trend = /** @type {(inputs: Page_Room_No_TrendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No trend to show.`)
};

export const page_room_ontime = /** @type {(inputs: Page_Room_OntimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suppliers by on-time delivery`)
};

export const page_room_ontime_subhead = /** @type {(inputs: Page_Room_Ontime_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Best first; reply time and open RFQs under each, from the live records`)
};

export const page_room_per_owner = /** @type {(inputs: Page_Room_Per_OwnerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Live cases per owner`)
};

export const page_room_per_owner_subhead = /** @type {(inputs: Page_Room_Per_Owner_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every live case has an owner, a deadline and a next action`)
};

export const page_room_profit_cash = /** @type {(inputs: Page_Room_Profit_CashInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Profit & cash`)
};

export const page_room_quadrant = /** @type {(inputs: Page_Room_QuadrantInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suppliers: on time vs reply time`)
};

export const page_room_quadrant_subhead = /** @type {(inputs: Page_Room_Quadrant_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Each supplier by its on-time deliveries and how fast it replies; choose one to open it`)
};

export const page_room_receivables_age = /** @type {(inputs: Page_Room_Receivables_AgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receivables by age`)
};

export const page_room_receivables_customer = /** @type {(inputs: Page_Room_Receivables_CustomerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receivables by customer`)
};

export const page_room_reliable_fast = /** @type {(inputs: Page_Room_Reliable_FastInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reliable & fast`)
};

export const page_room_reliable_slow = /** @type {(inputs: Page_Room_Reliable_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reliable but slow`)
};

export const page_room_slow_late = /** @type {(inputs: Page_Room_Slow_LateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Slow and late`)
};

export const page_room_targets = /** @type {(inputs: Page_Room_TargetsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Targets`)
};

export const page_room_turnaround = /** @type {(inputs: Page_Room_TurnaroundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quote turnaround`)
};

export const page_room_waits = /** @type {(inputs: Page_Room_WaitsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What live cases wait on`)
};

export const page_sourcing_description = /** @type {(inputs: Page_Sourcing_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Messages to review, supplier requests awaiting a reply and offers to check, on one page.`)
};

export const page_sourcing_eyebrow = /** @type {(inputs: Page_Sourcing_EyebrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sourcing desk`)
};

export const page_sourcing_heading = /** @type {(inputs: Page_Sourcing_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sourcing pipeline`)
};

export const page_sourcing_messages_subhead = /** @type {(inputs: Page_Sourcing_Messages_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New and flagged messages; a message opens beside the list.`)
};

export const page_sourcing_messages_title = /** @type {(inputs: Page_Sourcing_Messages_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Messages to review`)
};

export const page_sourcing_nav = /** @type {(inputs: Page_Sourcing_NavInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pipeline`)
};

export const page_sourcing_offers_subhead = /** @type {(inputs: Page_Sourcing_Offers_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Technical equivalence is a person's decision.`)
};

export const page_sourcing_offers_title = /** @type {(inputs: Page_Sourcing_Offers_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Offers to check`)
};

export const page_sourcing_rfqs_title = /** @type {(inputs: Page_Sourcing_Rfqs_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier requests awaiting a reply`)
};

export const page_sourcing_subtitle = /** @type {(inputs: Page_Sourcing_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Messages to read, supplier requests awaiting a reply, and offers to check, on one page.`)
};

export const page_usage_against_plan = /** @type {(inputs: Page_Usage_Against_PlanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This month against the plan at full use`)
};

export const page_usage_ai_calls = /** @type {(inputs: Page_Usage_Ai_CallsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI calls by task`)
};

export const page_usage_ai_log = /** @type {(inputs: Page_Usage_Ai_LogInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI log`)
};

export const page_usage_changes_subhead = /** @type {(inputs: Page_Usage_Changes_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Each one estimated and approved before work starts.`)
};

export const page_usage_changes_title = /** @type {(inputs: Page_Usage_Changes_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Change requests`)
};

export const page_usage_edit_plan = /** @type {(inputs: Page_Usage_Edit_PlanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Edit the plan`)
};

export const page_usage_eyebrow = /** @type {(inputs: Page_Usage_EyebrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Configuration · service`)
};

export const page_usage_heading = /** @type {(inputs: Page_Usage_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Service usage`)
};

export const page_usage_subtitle = /** @type {(inputs: Page_Usage_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What the platform did this month, counted the way the running costs are: documents read, questions answered, emails processed, support hours and changes. Quieter months use less.`)
};

export const page_usage_support_subhead = /** @type {(inputs: Page_Usage_Support_SubheadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sunday to Thursday, on your hours: fixes, updates, security patches and questions.`)
};

export const page_usage_support_title = /** @type {(inputs: Page_Usage_Support_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Support log`)
};

export const page_value_eyebrow = /** @type {(inputs: Page_Value_EyebrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Insights · value`)
};

export const page_value_heading = /** @type {(inputs: Page_Value_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What the platform is worth to you`)
};

export const page_value_payback = /** @type {(inputs: Page_Value_PaybackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`When it pays for itself`)
};

export const page_value_plan = /** @type {(inputs: Page_Value_PlanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delivery plan`)
};

export const page_value_subtitle = /** @type {(inputs: Page_Value_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Extra orders won and hours saved, in your own figures. Move the sliders; nothing is saved. Below, what the AI's work saved this month.`)
};

export const page_value_usage = /** @type {(inputs: Page_Value_UsageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Service usage`)
};

export const profit_actual_against_expected = /** @type {(inputs: Profit_Actual_Against_ExpectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`actual against expected`)
};

export const profit_actual_final = /** @type {(inputs: Profit_Actual_FinalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.pct} margin · final, every cost is actual`)
};

export const profit_actual_so_far = /** @type {(inputs: Profit_Actual_So_FarInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.pct} margin · so far, ${__paraglideRegistry.icuPound("en", i?.count, {})} close check open`);
	return /** @type {LocalizedString} */ (`${i?.pct} margin · so far, ${__paraglideRegistry.icuPound("en", i?.count, {})} close checks open`)
};

export const profit_at_quotation = /** @type {(inputs: Profit_At_QuotationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`at quotation`)
};

export const profit_check_done = /** @type {(inputs: Profit_Check_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Done`)
};

export const profit_check_open = /** @type {(inputs: Profit_Check_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open`)
};

export const profit_checklist_note = /** @type {(inputs: Profit_Checklist_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The case closes only when quantities, documents, claims and balances reconcile.`)
};

export const profit_checks_green_heading = /** @type {(inputs: Profit_Checks_Green_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every close check is green`)
};

export const profit_checks_green_label = /** @type {(inputs: Profit_Checks_Green_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Checks green`)
};

export const profit_checks_green_text = /** @type {(inputs: Profit_Checks_Green_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quantities, documents, claims and balances reconcile: the case can be closed.`)
};

export const profit_checks_open = /** @type {(inputs: Profit_Checks_OpenInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} close check open`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} close checks open`)
};

export const profit_checks_open_text = /** @type {(inputs: Profit_Checks_Open_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The actual profit is final once every cost is confirmed against its bill and the case is closed.`)
};

export const profit_claim = /** @type {(inputs: Profit_ClaimInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} against ${i?.against} · ${i?.note}`)
};

export const profit_claim_settled = /** @type {(inputs: Profit_Claim_SettledInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} against ${i?.against} · ${i?.note} · settled by credit note ${i?.creditNote}`)
};

export const profit_claims_empty = /** @type {(inputs: Profit_Claims_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No claims on this case.`)
};

export const profit_closed_heading = /** @type {(inputs: Profit_Closed_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Case closed and settled`)
};

export const profit_closed_text = /** @type {(inputs: Profit_Closed_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Actual profit recorded; supplier prices and on-time results fed back to the supplier records.`)
};

export const profit_closed_text_at = /** @type {(inputs: Profit_Closed_Text_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Closed ${i?.at}. Actual profit recorded; supplier prices and on-time results fed back to the supplier records.`)
};

export const profit_col_actual = /** @type {(inputs: Profit_Col_ActualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Actual`)
};

export const profit_col_cost = /** @type {(inputs: Profit_Col_CostInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cost`)
};

export const profit_col_difference = /** @type {(inputs: Profit_Col_DifferenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Difference`)
};

export const profit_col_expected = /** @type {(inputs: Profit_Col_ExpectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expected`)
};

export const profit_col_fx = /** @type {(inputs: Profit_Col_FxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`FX difference`)
};

export const profit_col_rate = /** @type {(inputs: Profit_Col_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rate`)
};

export const profit_col_realised = /** @type {(inputs: Profit_Col_RealisedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Realised`)
};

export const profit_col_receipt = /** @type {(inputs: Profit_Col_ReceiptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receipt`)
};

export const profit_col_status = /** @type {(inputs: Profit_Col_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Status`)
};

export const profit_costs_note = /** @type {(inputs: Profit_Costs_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Costs as estimated when the quotation was approved, and as billed. Bills replace estimates once a person confirms them; nothing changes on its own.`)
};

export const profit_damage_audio_prompt = /** @type {(inputs: Profit_Damage_Audio_PromptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This voice note describes goods delivered to a ship. Write down the damage or shortage for a claim: which items, how many, and what is wrong.`)
};

export const profit_damage_image_prompt = /** @type {(inputs: Profit_Damage_Image_PromptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This photo shows goods delivered to a ship. Describe any damage for a claim: which items, how many, what is damaged (dents, leaks, broken seals, wet cartons), and any visible labels, part numbers or batch numbers. Write only what you can see.`)
};

export const profit_damage_label = /** @type {(inputs: Profit_Damage_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Describe damage from a photo`)
};

export const profit_date_time = /** @type {(inputs: Profit_Date_TimeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.date}, ${i?.time}`)
};

export const profit_done_of = /** @type {(inputs: Profit_Done_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.done} / ${i?.total}`)
};

export const profit_figure_actual = /** @type {(inputs: Profit_Figure_ActualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Actual gross profit`)
};

export const profit_figure_difference = /** @type {(inputs: Profit_Figure_DifferenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Difference`)
};

export const profit_figure_expected = /** @type {(inputs: Profit_Figure_ExpectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expected gross profit`)
};

export const profit_figure_fx = /** @type {(inputs: Profit_Figure_FxInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`FX difference`)
};

export const profit_fx_empty = /** @type {(inputs: Profit_Fx_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No receipts yet.`)
};

export const profit_fx_empty_egp = /** @type {(inputs: Profit_Fx_Empty_EgpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoiced in EGP, so there's no exchange-rate difference.`)
};

export const profit_fx_note = /** @type {(inputs: Profit_Fx_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`quoted at ${i?.quoted} · today ${i?.today} EGP/${i?.currency}`)
};

export const profit_fx_table_note = /** @type {(inputs: Profit_Fx_Table_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Revenue is booked at the quotation's rate (${i?.rate} EGP/${i?.currency}); each receipt converts at the bank's actual rate. Expected revenue ${i?.expected} · actual ${i?.actual}.`)
};

export const profit_green_of = /** @type {(inputs: Profit_Green_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.done} of ${i?.total} green`)
};

export const profit_invoiced_egp = /** @type {(inputs: Profit_Invoiced_EgpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`invoiced in EGP`)
};

export const profit_margin = /** @type {(inputs: Profit_MarginInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.pct} margin`)
};

export const profit_margin_points = /** @type {(inputs: Profit_Margin_PointsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.points} pts of margin`)
};

export const profit_not_costed_heading = /** @type {(inputs: Profit_Not_Costed_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expected profit is fixed at the customer PO`)
};

export const profit_not_costed_text = /** @type {(inputs: Profit_Not_Costed_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.caseId} is at "${i?.stage}". The expected profit is taken from the approved quotation once the customer's PO is confirmed; actuals follow as supplier bills arrive.`)
};

export const profit_of_expected = /** @type {(inputs: Profit_Of_ExpectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`of the expected profit`)
};

export const profit_quoted_rate = /** @type {(inputs: Profit_Quoted_RateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`quoted ${i?.rate}`)
};

export const profit_rate_change = /** @type {(inputs: Profit_Rate_ChangeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`rate ${i?.from} → ${i?.to}`)
};

export const profit_realised = /** @type {(inputs: Profit_RealisedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Realised`)
};

export const profit_state_actual = /** @type {(inputs: Profit_State_ActualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Actual`)
};

export const profit_state_billed = /** @type {(inputs: Profit_State_BilledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Billed, to confirm`)
};

export const profit_state_estimate = /** @type {(inputs: Profit_State_EstimateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Estimate`)
};

export const profit_state_not_applicable = /** @type {(inputs: Profit_State_Not_ApplicableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not applicable`)
};

export const profit_total_cost = /** @type {(inputs: Profit_Total_CostInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Total cost`)
};

export const profit_unrealised = /** @type {(inputs: Profit_UnrealisedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unrealised`)
};

export const project_acceptance_note = /** @type {(inputs: Project_Acceptance_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`The ten scenarios you asked to see live, each with its evidence. Checked against the data in this demo ${i?.at}; at go-live they run on your own data.`)
};

export const project_answer = /** @type {(inputs: Project_AnswerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`→ ${i?.answer}`)
};

export const project_brief_note = /** @type {(inputs: Project_Brief_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every requirement designed, with the screen that shows it and an acceptance test.`)
};

export const project_col_checked = /** @type {(inputs: Project_Col_CheckedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Checked live`)
};

export const project_col_open = /** @type {(inputs: Project_Col_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open`)
};

export const project_col_requirement = /** @type {(inputs: Project_Col_RequirementInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`From your brief`)
};

export const project_col_scenario = /** @type {(inputs: Project_Col_ScenarioInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Scenario`)
};

export const project_col_status = /** @type {(inputs: Project_Col_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Status`)
};

export const project_covered = /** @type {(inputs: Project_CoveredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Covered`)
};

export const project_covered_of = /** @type {(inputs: Project_Covered_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.done} / ${i?.total} covered`)
};

export const project_done_of = /** @type {(inputs: Project_Done_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.done} / ${i?.total}`)
};

export const project_monthly_note = /** @type {(inputs: Project_Monthly_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`One monthly plan keeps everything running after go-live.`)
};

export const project_monthly_note_licences = /** @type {(inputs: Project_Monthly_Note_LicencesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Odoo licences are with Odoo directly. Larger change requests are scoped and agreed separately.`)
};

export const project_open = /** @type {(inputs: Project_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open`)
};

export const project_open_in_demo = /** @type {(inputs: Project_Open_In_DemoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open in demo`)
};

export const project_pass_of = /** @type {(inputs: Project_Pass_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.done} / ${i?.total} pass`)
};

export const project_passing = /** @type {(inputs: Project_PassingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Passing`)
};

export const project_payment_note = /** @type {(inputs: Project_Payment_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Each phase is paid in three steps, so you only pay the last part once it works in your hands.`)
};

export const project_phase = /** @type {(inputs: Project_PhaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Phase`)
};

export const project_phase_n = /** @type {(inputs: Project_Phase_NInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Phase ${i?.n}`)
};

export const project_problem = /** @type {(inputs: Project_ProblemInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Problem ${i?.n}`)
};

export const project_roadmap_note = /** @type {(inputs: Project_Roadmap_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Each phase is approved on its own; a weekly 45-minute review keeps progress, baseline numbers and decisions in one place.`)
};

export const project_show_me = /** @type {(inputs: Project_Show_MeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Show me`)
};

export const project_tests_pass = /** @type {(inputs: Project_Tests_PassInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} of ${i?.total} acceptance tests pass`)
};

export const project_week = /** @type {(inputs: Project_WeekInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`W${i?.n}`)
};

export const roles_after_hours = /** @type {(inputs: Roles_After_HoursInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`After hours`)
};

export const roles_alert_sent = /** @type {(inputs: Roles_Alert_SentInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Alert sent to ${i?.name} (WhatsApp / SMS simulated · notification created)`)
};

export const roles_failing = /** @type {(inputs: Roles_FailingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Failing`)
};

export const roles_in_hours_text = /** @type {(inputs: Roles_In_Hours_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.reason} Office hours: the case owner picks it up; no alert needed.`)
};

export const roles_office_hours = /** @type {(inputs: Roles_Office_HoursInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Office hours`)
};

export const roles_open_pricing = /** @type {(inputs: Roles_Open_PricingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open GS-RFQ-0142 pricing`)
};

export const roles_preset_friday = /** @type {(inputs: Roles_Preset_FridayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fri 20 Nov 10:00, weekend`)
};

export const roles_preset_office = /** @type {(inputs: Roles_Preset_OfficeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tue 17 Nov 11:30, office hours`)
};

export const roles_preset_saturday = /** @type {(inputs: Roles_Preset_SaturdayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sat 21 Nov 14:00, weekend`)
};

export const roles_preset_sunday = /** @type {(inputs: Roles_Preset_SundayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sun 22 Nov 06:30, before office`)
};

export const roles_preset_tonight = /** @type {(inputs: Roles_Preset_TonightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tonight 21:40`)
};

export const roles_send_alert = /** @type {(inputs: Roles_Send_AlertInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Send the alert (simulated)`)
};

export const roles_simulator_choice = /** @type {(inputs: Roles_Simulator_ChoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`When the urgent RFQ arrives`)
};

export const roles_simulator_note = /** @type {(inputs: Roles_Simulator_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pick when an urgent RFQ arrives. The rule “After-hours & weekend RFQ” decides who is alerted; the alert is simulated and lands in that person's notifications.`)
};

export const roles_step_backup = /** @type {(inputs: Roles_Step_BackupInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`+${i?.minutes} min: ${i?.name} (backup)`)
};

export const roles_step_now = /** @type {(inputs: Roles_Step_NowInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Now: ${i?.name} (on duty)`)
};

export const roles_step_senior = /** @type {(inputs: Roles_Step_SeniorInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Then: ${i?.names} (senior)`)
};

export const roles_try_it = /** @type {(inputs: Roles_Try_ItInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Try it: switch the signed-in user to Soaad Amer (Sales) and open the pricing tab of GS-RFQ-0142. Costs and margins are gone.`)
};

export const roles_verified = /** @type {(inputs: Roles_VerifiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verified`)
};

export const service_at_full_use = /** @type {(inputs: Service_At_Full_UseInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.full} at full use`)
};

export const service_calls_share = /** @type {(inputs: Service_Calls_ShareInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.part} of ${i?.calls} AI calls`)
};

export const service_checked = /** @type {(inputs: Service_CheckedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Checked by a person`)
};

export const service_checked_note = /** @type {(inputs: Service_Checked_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI results confirmed, corrected or rejected`)
};

export const service_documents_share = /** @type {(inputs: Service_Documents_ShareInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.documents} of ${i?.full} documents at full use`)
};

export const service_extra_orders = /** @type {(inputs: Service_Extra_OrdersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Extra orders won a month`)
};

export const service_gross_margin = /** @type {(inputs: Service_Gross_MarginInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gross margin`)
};

export const service_hour_cost = /** @type {(inputs: Service_Hour_CostInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cost of an hour`)
};

export const service_hours = /** @type {(inputs: Service_HoursInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.hours} hours`)
};

export const service_hours_per_person = /** @type {(inputs: Service_Hours_Per_PersonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hours saved a person a week`)
};

export const service_hours_saved = /** @type {(inputs: Service_Hours_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hours of typing saved`)
};

export const service_hours_saved_note = /** @type {(inputs: Service_Hours_Saved_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`about ${i?.minutes} minutes a document by hand`)
};

export const service_margin_month = /** @type {(inputs: Service_Margin_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Margin from extra orders a month`)
};

export const service_order_value = /** @type {(inputs: Service_Order_ValueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Average order value`)
};

export const service_payback = /** @type {(inputs: Service_PaybackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payback`)
};

export const service_payback_note = /** @type {(inputs: Service_Payback_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Starts at the proposal's illustration; slide to your own figures. This month the AI already read ${i?.documents} documents, about ${i?.hours} hours of typing.`)
};

export const service_people = /** @type {(inputs: Service_PeopleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`People using it`)
};

export const service_plan_note = /** @type {(inputs: Service_Plan_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.month}, day ${i?.day} of ${i?.days}. The tick is the plan at full use; quieter months use less.`)
};

export const service_replies_matched = /** @type {(inputs: Service_Replies_MatchedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Replies matched`)
};

export const service_replies_matched_note = /** @type {(inputs: Service_Replies_Matched_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`supplier replies filed on their case`)
};

export const service_replies_share = /** @type {(inputs: Service_Replies_ShareInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.automatic} of ${i?.matched} with no one's help`)
};

export const service_so_far = /** @type {(inputs: Service_So_FarInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.used} so far, on pace for ${i?.pace}`)
};

export const service_time_month = /** @type {(inputs: Service_Time_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Time saved a month`)
};

export const service_value_month = /** @type {(inputs: Service_Value_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Value a month`)
};

export const service_value_year = /** @type {(inputs: Service_Value_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Value a year`)
};

export const service_waiting = /** @type {(inputs: Service_WaitingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Waiting for review`)
};

export const service_waiting_note = /** @type {(inputs: Service_Waiting_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`uncertain results are never applied alone`)
};

export const sourcing_all_held = /** @type {(inputs: Sourcing_All_HeldInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every line is held until clarified.`)
};

export const sourcing_client_removed = /** @type {(inputs: Sourcing_Client_RemovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Client name removed`)
};

export const sourcing_discard_drafts = /** @type {(inputs: Sourcing_Discard_DraftsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Discard drafts`)
};

export const sourcing_draft = /** @type {(inputs: Sourcing_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Draft`)
};

export const sourcing_draft_rfqs = /** @type {(inputs: Sourcing_Draft_RfqsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Draft RFQs`)
};

export const sourcing_draft_rfqs_prompt = /** @type {(inputs: Sourcing_Draft_Rfqs_PromptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Draft supplier RFQs`)
};

export const sourcing_drafts_discarded = /** @type {(inputs: Sourcing_Drafts_DiscardedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Drafts discarded. Nothing was sent`)
};

export const sourcing_full = /** @type {(inputs: Sourcing_FullInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Full list`)
};

export const sourcing_full_note = /** @type {(inputs: Sourcing_Full_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`General chandlers receive every line in one RFQ.`)
};

export const sourcing_held_back = /** @type {(inputs: Sourcing_Held_BackInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Held back until clarified: ${i?.lines}`)
};

export const sourcing_how_to_send = /** @type {(inputs: Sourcing_How_To_SendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`How to send`)
};

export const sourcing_line_asked = /** @type {(inputs: Sourcing_Line_AskedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`asked: ${i?.rfqs}`)
};

export const sourcing_line_held = /** @type {(inputs: Sourcing_Line_HeldInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`held: ${i?.reason}`)
};

export const sourcing_line_offers = /** @type {(inputs: Sourcing_Line_OffersInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("en", i?.n, {}, true);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} offer`);
	return /** @type {LocalizedString} */ (`${i?.count} offers`)
};

export const sourcing_lines = /** @type {(inputs: Sourcing_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lines`)
};

export const sourcing_new_supplier_tag = /** @type {(inputs: Sourcing_New_Supplier_TagInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New · quoted, never ordered`)
};

export const sourcing_next_at = /** @type {(inputs: Sourcing_Next_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`next · ${i?.at}`)
};

export const sourcing_no_customer_files = /** @type {(inputs: Sourcing_No_Customer_FilesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No customer files`)
};

export const sourcing_no_lines = /** @type {(inputs: Sourcing_No_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This case has no lines yet.`)
};

export const sourcing_no_one_chased = /** @type {(inputs: Sourcing_No_One_ChasedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No supplier is being chased right now.`)
};

export const sourcing_not_needed = /** @type {(inputs: Sourcing_Not_NeededInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`not needed`)
};

export const sourcing_our_reference = /** @type {(inputs: Sourcing_Our_ReferenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Our reference only`)
};

export const sourcing_outcome_declined = /** @type {(inputs: Sourcing_Outcome_DeclinedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Declined`)
};

export const sourcing_outcome_escalated = /** @type {(inputs: Sourcing_Outcome_EscalatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Escalated`)
};

export const sourcing_outcome_new_supplier = /** @type {(inputs: Sourcing_Outcome_New_SupplierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New supplier saved`)
};

export const sourcing_outcome_reminder = /** @type {(inputs: Sourcing_Outcome_ReminderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reminder sent`)
};

export const sourcing_outcome_replied = /** @type {(inputs: Sourcing_Outcome_RepliedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Replied`)
};

export const sourcing_price = /** @type {(inputs: Sourcing_PriceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.currency} ${i?.price} / ${i?.per}`)
};

export const sourcing_price_hidden = /** @type {(inputs: Sourcing_Price_HiddenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`price hidden for your role`)
};

export const sourcing_quoted_line = /** @type {(inputs: Sourcing_Quoted_LineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.description}: ${i?.price} · quoted ${i?.quoted} · valid to ${i?.valid}`)
};

export const sourcing_reminder_rule = /** @type {(inputs: Sourcing_Reminder_RuleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Reminder 1 after 24 h, reminder 2 after 48 h, then the case owner (${i?.owner}) is alerted. Reminders stop the moment a supplier replies or declines.`)
};

export const sourcing_remove = /** @type {(inputs: Sourcing_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remove`)
};

export const sourcing_removed = /** @type {(inputs: Sourcing_RemovedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.reference} removed from the drafts`)
};

export const sourcing_saved_on_reply = /** @type {(inputs: Sourcing_Saved_On_ReplyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saved the moment they replied, even without an order.`)
};

export const sourcing_send_heading = /** @type {(inputs: Sourcing_Send_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Send these supplier RFQs?`)
};

export const sourcing_send_label = /** @type {(inputs: Sourcing_Send_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Send RFQs`)
};

export const sourcing_send_n = /** @type {(inputs: Sourcing_Send_NInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("en", i?.n, {}, true);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`Send ${i?.count} RFQ`);
	return /** @type {LocalizedString} */ (`Send ${i?.count} RFQs`)
};

export const sourcing_send_text = /** @type {(inputs: Sourcing_Send_TextInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("en", i?.n, {}, true);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} RFQ to ${i?.suppliers}: reply by ${i?.due}.

The client's name, vessel and files are removed. Reminders go out after 24 h and 48 h, stop as soon as a supplier answers, and the case owner is alerted after the second.`);
	return /** @type {LocalizedString} */ (`${i?.count} RFQs to ${i?.suppliers}: reply by ${i?.due}.

The client's name, vessel and files are removed. Reminders go out after 24 h and 48 h, stop as soon as a supplier answers, and the case owner is alerted after the second.`)
};

export const sourcing_sent = /** @type {(inputs: Sourcing_SentInputs) => LocalizedString} */ (i) => {
	const nPlural = __paraglideRegistry.plural("en", i?.n, {}, true);
	if (nPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} supplier RFQ sent. Replies will be matched automatically`);
	return /** @type {LocalizedString} */ (`${i?.count} supplier RFQs sent. Replies will be matched automatically`)
};

export const sourcing_skipped = /** @type {(inputs: Sourcing_SkippedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Skipped (already asked): ${i?.list}`)
};

export const sourcing_split = /** @type {(inputs: Sourcing_SplitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Split by category`)
};

export const sourcing_split_note = /** @type {(inputs: Sourcing_Split_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Each category goes to its specialists (best on-time first); a supplier asked for several categories gets one RFQ.`)
};

export const sourcing_subject = /** @type {(inputs: Sourcing_SubjectInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Subject: “${i?.subject}”`)
};

export const sourcing_supplier_record = /** @type {(inputs: Sourcing_Supplier_RecordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier record`)
};

export const sourcing_system_chooses = /** @type {(inputs: Sourcing_System_ChoosesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The system chooses the suppliers and drafts one anonymised RFQ each.`)
};

export const sourcing_vessel_removed = /** @type {(inputs: Sourcing_Vessel_RemovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vessel removed`)
};

export const tour_close_1_body = /** @type {(inputs: Tour_Close_1_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The profit promised at quotation against the real result: the launch cost more than estimated once it was billed.`)
};

export const tour_close_1_target = /** @type {(inputs: Tour_Close_1_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expected vs actual`)
};

export const tour_close_1_title = /** @type {(inputs: Tour_Close_1_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Estimates become actuals`)
};

export const tour_close_2_body = /** @type {(inputs: Tour_Close_2_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`USD 10,000 arrived at 48.80 against the quoted 48.60 — a gain of EGP 2,000, on the case where it happened.`)
};

export const tour_close_2_target = /** @type {(inputs: Tour_Close_2_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`FX differences`)
};

export const tour_close_2_title = /** @type {(inputs: Tour_Close_2_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`FX is real money`)
};

export const tour_close_3_body = /** @type {(inputs: Tour_Close_3_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Two helmets cracked in transit; the supplier's credit note settles the claim.`)
};

export const tour_close_3_target = /** @type {(inputs: Tour_Close_3_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Claims`)
};

export const tour_close_3_title = /** @type {(inputs: Tour_Close_3_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Claims settle against credit notes`)
};

export const tour_close_4_body = /** @type {(inputs: Tour_Close_4_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bills matched, deliveries signed, invoices accepted by the tax authority and paid, claims settled — then the case can close.`)
};

export const tour_close_4_target = /** @type {(inputs: Tour_Close_4_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Close checklist`)
};

export const tour_close_4_title = /** @type {(inputs: Tour_Close_4_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Only green closes`)
};

export const tour_close_summary = /** @type {(inputs: Tour_Close_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Estimates become actuals, FX and claims are accounted for, and only green checks close the case.`)
};

export const tour_close_title = /** @type {(inputs: Tour_Close_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Settle and close a case`)
};

export const tour_control_room_1_body = /** @type {(inputs: Tour_Control_Room_1_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Written at 07:00 from live records, with links to its sources.`)
};

export const tour_control_room_1_target = /** @type {(inputs: Tour_Control_Room_1_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`daily AI briefing`)
};

export const tour_control_room_1_title = /** @type {(inputs: Tour_Control_Room_1_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Briefed before coffee`)
};

export const tour_control_room_2_body = /** @type {(inputs: Tour_Control_Room_2_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Questions are answered from the live data, and every answer cites the records it used.`)
};

export const tour_control_room_2_click = /** @type {(inputs: Tour_Control_Room_2_ClickInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Who owes us money?`)
};

export const tour_control_room_2_target = /** @type {(inputs: Tour_Control_Room_2_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ask Golden Sea`)
};

export const tour_control_room_2_title = /** @type {(inputs: Tour_Control_Room_2_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ask anything`)
};

export const tour_control_room_3_body = /** @type {(inputs: Tour_Control_Room_3_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Margin by store against the 15% minimum, plus pipeline, speed, cash and supplier performance.`)
};

export const tour_control_room_3_target = /** @type {(inputs: Tour_Control_Room_3_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Margin by store`)
};

export const tour_control_room_3_title = /** @type {(inputs: Tour_Control_Room_3_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Policy in the numbers`)
};

export const tour_control_room_4_body = /** @type {(inputs: Tour_Control_Room_4_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signed in as Soaad Amer, the same assistant declines questions about costs and margins.`)
};

export const tour_control_room_4_target = /** @type {(inputs: Tour_Control_Room_4_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ask Golden Sea`)
};

export const tour_control_room_4_title = /** @type {(inputs: Tour_Control_Room_4_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sales never sees margins`)
};

export const tour_control_room_summary = /** @type {(inputs: Tour_Control_Room_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The CEO's control room and Ask Golden Sea — and what Sales is never told.`)
};

export const tour_control_room_title = /** @type {(inputs: Tour_Control_Room_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The business, live — briefed at 07:00`)
};

export const tour_delivery_to_cash_1_body = /** @type {(inputs: Tour_Delivery_To_Cash_1_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Port, ETA, agent, truck, boarding staff and launch in one plan. When the agent moves the ETA, drop 2 is re-planned and the owner is alerted.`)
};

export const tour_delivery_to_cash_1_target = /** @type {(inputs: Tour_Delivery_To_Cash_1_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vessel delivery plan`)
};

export const tour_delivery_to_cash_1_title = /** @type {(inputs: Tour_Delivery_To_Cash_1_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The vessel moves, the plan follows`)
};

export const tour_delivery_to_cash_2_body = /** @type {(inputs: Tour_Delivery_To_Cash_2_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Two drops for one order. A drop counts as delivered only with the signed delivery note from the vessel.`)
};

export const tour_delivery_to_cash_2_target = /** @type {(inputs: Tour_Delivery_To_Cash_2_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Drops & proof of delivery`)
};

export const tour_delivery_to_cash_2_title = /** @type {(inputs: Tour_Delivery_To_Cash_2_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No evidence, no "Delivered"`)
};

export const tour_delivery_to_cash_3_body = /** @type {(inputs: Tour_Delivery_To_Cash_3_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Only delivered quantities are invoiced, each invoice goes to the Egyptian tax authority, and rejections or outages get a safe retry.`)
};

export const tour_delivery_to_cash_3_target = /** @type {(inputs: Tour_Delivery_To_Cash_3_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer invoices & payments`)
};

export const tour_delivery_to_cash_3_title = /** @type {(inputs: Tour_Delivery_To_Cash_3_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoice what was delivered, then e-invoice`)
};

export const tour_delivery_to_cash_4_body = /** @type {(inputs: Tour_Delivery_To_Cash_4_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receivables and payables side by side. Supplier payments wait for the Financial Director or the CEO.`)
};

export const tour_delivery_to_cash_4_target = /** @type {(inputs: Tour_Delivery_To_Cash_4_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payments needing approval`)
};

export const tour_delivery_to_cash_4_title = /** @type {(inputs: Tour_Delivery_To_Cash_4_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A person approves, finance pays`)
};

export const tour_delivery_to_cash_5_body = /** @type {(inputs: Tour_Delivery_To_Cash_5_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A supplier's new bank account needs a call-back on the number on file and two approvers — Finance and the CEO.`)
};

export const tour_delivery_to_cash_5_target = /** @type {(inputs: Tour_Delivery_To_Cash_5_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`requested change`)
};

export const tour_delivery_to_cash_5_title = /** @type {(inputs: Tour_Delivery_To_Cash_5_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Two different people, always`)
};

export const tour_delivery_to_cash_summary = /** @type {(inputs: Tour_Delivery_To_Cash_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`An ETA change re-plans the delivery, proof of delivery unlocks the invoice, finance collects and pays.`)
};

export const tour_delivery_to_cash_title = /** @type {(inputs: Tour_Delivery_To_Cash_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`From the quay to the bank`)
};

export const tour_exceptions_1_body = /** @type {(inputs: Tour_Exceptions_1_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`An expired Outlook token and an unreachable e-invoice signing service sit in a queue with an owner — not in a log nobody reads.`)
};

export const tour_exceptions_1_target = /** @type {(inputs: Tour_Exceptions_1_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exception queue`)
};

export const tour_exceptions_1_title = /** @type {(inputs: Tour_Exceptions_1_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Failures are visible`)
};

export const tour_exceptions_2_body = /** @type {(inputs: Tour_Exceptions_2_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Uncertain AI results are never applied automatically; someone reviews them here.`)
};

export const tour_exceptions_2_target = /** @type {(inputs: Tour_Exceptions_2_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI review queue`)
};

export const tour_exceptions_2_title = /** @type {(inputs: Tour_Exceptions_2_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Low confidence waits for a person`)
};

export const tour_exceptions_3_body = /** @type {(inputs: Tour_Exceptions_3_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Trigger, owner, due time, approval, retry behaviour and stop condition for each rule — switched on and off by management, and logged.`)
};

export const tour_exceptions_3_target = /** @type {(inputs: Tour_Exceptions_3_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rule registry`)
};

export const tour_exceptions_3_title = /** @type {(inputs: Tour_Exceptions_3_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every automation is explicit`)
};

export const tour_exceptions_4_body = /** @type {(inputs: Tour_Exceptions_4_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Outside Sunday–Thursday office hours, urgent RFQs go to the on-duty person, with a backup if nobody answers.`)
};

export const tour_exceptions_4_target = /** @type {(inputs: Tour_Exceptions_4_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`After-hours routing`)
};

export const tour_exceptions_4_title = /** @type {(inputs: Tour_Exceptions_4_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Urgent RFQs after hours`)
};

export const tour_exceptions_summary = /** @type {(inputs: Tour_Exceptions_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A failed mailbox and a low-confidence AI result, handled safely; urgent RFQs reach the on-duty person.`)
};

export const tour_exceptions_title = /** @type {(inputs: Tour_Exceptions_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing fails silently`)
};

export const tour_growth_1_body = /** @type {(inputs: Tour_Growth_1_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ship managers from first introduction to active account; stalled prospects are flagged.`)
};

export const tour_growth_1_target = /** @type {(inputs: Tour_Growth_1_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Growth funnel`)
};

export const tour_growth_1_title = /** @type {(inputs: Tour_Growth_1_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A pipeline beyond RFQs`)
};

export const tour_growth_2_body = /** @type {(inputs: Tour_Growth_2_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Each next step has a short script. Recording the outcome plans the next one.`)
};

export const tour_growth_2_target = /** @type {(inputs: Tour_Growth_2_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sales next steps`)
};

export const tour_growth_2_title = /** @type {(inputs: Tour_Growth_2_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Know what to say`)
};

export const tour_growth_3_body = /** @type {(inputs: Tour_Growth_3_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Documents and committee dates for getting onto each ship manager's approved-vendor list.`)
};

export const tour_growth_3_target = /** @type {(inputs: Tour_Growth_3_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vendor registrations`)
};

export const tour_growth_3_title = /** @type {(inputs: Tour_Growth_3_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Registrations tracked`)
};

export const tour_growth_summary = /** @type {(inputs: Tour_Growth_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prospects, fleets and vendor registrations — with what to say on the next call.`)
};

export const tour_growth_title = /** @type {(inputs: Tour_Growth_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Growing the customer base`)
};

export const tour_handover_1_body = /** @type {(inputs: Tour_Handover_1_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`From the first email to the last payment, everything happens on one case. GS-RFQ-0142 is comparing offers.`)
};

export const tour_handover_1_target = /** @type {(inputs: Tour_Handover_1_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lifecycle`)
};

export const tour_handover_1_title = /** @type {(inputs: Tour_Handover_1_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`One case, sixteen steps`)
};

export const tour_handover_2_body = /** @type {(inputs: Tour_Handover_2_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Three of six lines are ready and one is blocked by a clarification — a case only looks done when every line is.`)
};

export const tour_handover_2_target = /** @type {(inputs: Tour_Handover_2_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Line progress`)
};

export const tour_handover_2_title = /** @type {(inputs: Tour_Handover_2_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Never complete too early`)
};

export const tour_handover_3_body = /** @type {(inputs: Tour_Handover_3_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reassigning asks AI for a handover note — open questions, tasks, the customer's contact rule. A person edits and confirms it.`)
};

export const tour_handover_3_target = /** @type {(inputs: Tour_Handover_3_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Owner & backup`)
};

export const tour_handover_3_title = /** @type {(inputs: Tour_Handover_3_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI drafts the handover`)
};

export const tour_handover_4_body = /** @type {(inputs: Tour_Handover_4_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Automatic steps name the rule that fired; human steps name the person. That's the audit trail.`)
};

export const tour_handover_4_target = /** @type {(inputs: Tour_Handover_4_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activity timeline`)
};

export const tour_handover_4_title = /** @type {(inputs: Tour_Handover_4_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every step logged`)
};

export const tour_handover_summary = /** @type {(inputs: Tour_Handover_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`One case from first email to last payment, and a handover AI drafts for a person to confirm.`)
};

export const tour_handover_title = /** @type {(inputs: Tour_Handover_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Handover without losing anything`)
};

export const tour_morning_1_body = /** @type {(inputs: Tour_Morning_1_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This is Karim Youssef, supply chain. Golden Sea's dashboard is built for the person signed in: his waiting states, his queue, his follow-ups.`)
};

export const tour_morning_1_title = /** @type {(inputs: Tour_Morning_1_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every role has its own day`)
};

export const tour_morning_2_body = /** @type {(inputs: Tour_Morning_2_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every live case has an owner, a deadline and a next action. Blocked and at-risk cases come first, then the nearest deadline.`)
};

export const tour_morning_2_target = /** @type {(inputs: Tour_Morning_2_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`My queue`)
};

export const tour_morning_2_title = /** @type {(inputs: Tour_Morning_2_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A queue sorted by risk`)
};

export const tour_morning_3_body = /** @type {(inputs: Tour_Morning_3_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What changed overnight and what needs him today: deadlines, a PO mismatch, a supplier that hasn't replied, failed integrations.`)
};

export const tour_morning_3_target = /** @type {(inputs: Tour_Morning_3_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Daily briefing`)
};

export const tour_morning_3_title = /** @type {(inputs: Tour_Morning_3_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Briefed at 07:00`)
};

export const tour_morning_4_body = /** @type {(inputs: Tour_Morning_4_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Soaad Amer signs in. Her queue has no values, costs or margins: sales never sees what Golden Sea pays its suppliers.`)
};

export const tour_morning_4_target = /** @type {(inputs: Tour_Morning_4_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`My queue`)
};

export const tour_morning_4_title = /** @type {(inputs: Tour_Morning_4_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sales sees the same cases — without costs`)
};

export const tour_morning_5_body = /** @type {(inputs: Tour_Morning_5_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Karim Balbaa sees what waits for him first — a margin exception from Soaad, a supplier deposit, an FX rate, and a bank change that already has one of its two approvals.`)
};

export const tour_morning_5_target = /** @type {(inputs: Tour_Morning_5_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Waiting for your decision`)
};

export const tour_morning_5_title = /** @type {(inputs: Tour_Morning_5_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The CEO starts with decisions`)
};

export const tour_morning_6_body = /** @type {(inputs: Tour_Morning_6_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mohamed Helmy only sees payments and deposits. He already approved the bank change after a call-back; it now waits for the CEO — two people, always.`)
};

export const tour_morning_6_target = /** @type {(inputs: Tour_Morning_6_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Waiting for your decision`)
};

export const tour_morning_6_title = /** @type {(inputs: Tour_Morning_6_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Finance approves payments`)
};

export const tour_morning_7_body = /** @type {(inputs: Tour_Morning_7_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Notifications, bookmarks and the counters in this panel belong to the person signed in. Back as Karim Youssef — his are about his cases.`)
};

export const tour_morning_7_target = /** @type {(inputs: Tour_Morning_7_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Notifications`)
};

export const tour_morning_7_title = /** @type {(inputs: Tour_Morning_7_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Everyone's own notifications`)
};

export const tour_morning_summary = /** @type {(inputs: Tour_Morning_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The buyer, sales, the CEO and finance start their day — each sees only what needs them.`)
};

export const tour_morning_title = /** @type {(inputs: Tour_Morning_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`One morning, four people`)
};

export const tour_po_check_1_body = /** @type {(inputs: Tour_Po_Check_1_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nordvik's PO is matched to the approved quotation version. An old pack size, an expired v1 price and 15 instead of 10 helmets block the commitment until the customer agrees in writing.`)
};

export const tour_po_check_1_target = /** @type {(inputs: Tour_Po_Check_1_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer PO check`)
};

export const tour_po_check_1_title = /** @type {(inputs: Tour_Po_Check_1_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The PO is checked line by line`)
};

export const tour_po_check_2_body = /** @type {(inputs: Tour_Po_Check_2_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lines the customer didn't order stay open for a revision or close with a recorded reason.`)
};

export const tour_po_check_2_target = /** @type {(inputs: Tour_Po_Check_2_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Partial award`)
};

export const tour_po_check_2_title = /** @type {(inputs: Tour_Po_Check_2_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Partial awards, never silent`)
};

export const tour_po_check_3_body = /** @type {(inputs: Tour_Po_Check_3_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Once the PO is agreed, supplier POs are prepared — drop-shipped or through the warehouse — and each is re-checked against the latest offer first.`)
};

export const tour_po_check_3_target = /** @type {(inputs: Tour_Po_Check_3_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier purchase orders`)
};

export const tour_po_check_3_title = /** @type {(inputs: Tour_Po_Check_3_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Purchase orders per supplier`)
};

export const tour_po_check_4_body = /** @type {(inputs: Tour_Po_Check_4_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Each supplier bill is matched to its PO and the goods received; a duplicate bill is refused.`)
};

export const tour_po_check_4_target = /** @type {(inputs: Tour_Po_Check_4_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier bills`)
};

export const tour_po_check_4_title = /** @type {(inputs: Tour_Po_Check_4_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Three-way match`)
};

export const tour_po_check_5_body = /** @type {(inputs: Tour_Po_Check_5_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signed in as the CEO: a flagged price change on a supplier PO is shown before he commits, and deposits wait for a payment approval.`)
};

export const tour_po_check_5_target = /** @type {(inputs: Tour_Po_Check_5_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier purchase orders`)
};

export const tour_po_check_5_title = /** @type {(inputs: Tour_Po_Check_5_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Karim Balbaa confirms`)
};

export const tour_po_check_summary = /** @type {(inputs: Tour_Po_Check_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A customer PO with an old price and the wrong quantity is caught before anything is ordered.`)
};

export const tour_po_check_title = /** @type {(inputs: Tour_Po_Check_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The PO doesn't match the quote`)
};

export const tour_quote_1_body = /** @type {(inputs: Tour_Quote_1_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every offer is normalised to EGP per base unit. Switch to landed cost and freight to Port Said re-ranks them.`)
};

export const tour_quote_1_click = /** @type {(inputs: Tour_Quote_1_ClickInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Landed cost`)
};

export const tour_quote_1_target = /** @type {(inputs: Tour_Quote_1_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`How offers are compared`)
};

export const tour_quote_1_title = /** @type {(inputs: Tour_Quote_1_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cheapest isn't always cheapest on board`)
};

export const tour_quote_2_body = /** @type {(inputs: Tour_Quote_2_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`242 was offered for an exact-part 243 line, so the line is blocked from pricing. v1 is kept for the record; the corrected v2 is used.`)
};

export const tour_quote_2_target = /** @type {(inputs: Tour_Quote_2_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L2 · LOCTITE 243`)
};

export const tour_quote_2_title = /** @type {(inputs: Tour_Quote_2_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The wrong part is caught`)
};

export const tour_quote_3_body = /** @type {(inputs: Tour_Quote_3_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Alexandria stock is cheapest per unit but dearest delivered. The proposal splits 10 + 5 across two suppliers, both before the vessel's ETA.`)
};

export const tour_quote_3_target = /** @type {(inputs: Tour_Quote_3_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L5 · Safety helmet`)
};

export const tour_quote_3_title = /** @type {(inputs: Tour_Quote_3_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Own stock and split sourcing`)
};

export const tour_quote_4_body = /** @type {(inputs: Tour_Quote_4_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Shared charges are spread over the lines; policy is checked on margin, and every line shows cost, charges and profit.`)
};

export const tour_quote_4_target = /** @type {(inputs: Tour_Quote_4_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Margin = profit ÷ selling price`)
};

export const tour_quote_4_title = /** @type {(inputs: Tour_Quote_4_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Margin, not markup`)
};

export const tour_quote_5_body = /** @type {(inputs: Tour_Quote_5_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The quotation and its exceptions go to Karim Balbaa with one click. AI never prices on its own.`)
};

export const tour_quote_5_target = /** @type {(inputs: Tour_Quote_5_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approval`)
};

export const tour_quote_5_title = /** @type {(inputs: Tour_Quote_5_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A person approves`)
};

export const tour_quote_6_body = /** @type {(inputs: Tour_Quote_6_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Karim Balbaa sees what he's deciding and why — the margin, the FX rate, the deposit, and the bank change Mohamed Helmy already approved.`)
};

export const tour_quote_6_target = /** @type {(inputs: Tour_Quote_6_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Waiting for you`)
};

export const tour_quote_6_title = /** @type {(inputs: Tour_Quote_6_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Evidence first`)
};

export const tour_quote_7_body = /** @type {(inputs: Tour_Quote_7_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The same quotation in Golden Sea's own layout, in English or Arabic, in EGP or USD. Nothing goes to the customer until a person confirms the email.`)
};

export const tour_quote_7_click = /** @type {(inputs: Tour_Quote_7_ClickInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العربية`)
};

export const tour_quote_7_target = /** @type {(inputs: Tour_Quote_7_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Decision state`)
};

export const tour_quote_7_title = /** @type {(inputs: Tour_Quote_7_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Their layout, their language`)
};

export const tour_quote_summary = /** @type {(inputs: Tour_Quote_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The buyer compares and prices, the CEO approves, the customer gets Golden Sea's own layout.`)
};

export const tour_quote_title = /** @type {(inputs: Tour_Quote_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`From offers to an approved quotation`)
};

export const tour_replies_1_body = /** @type {(inputs: Tour_Replies_1_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lines are split by category and each supplier sees only its lines — never the customer or the vessel.`)
};

export const tour_replies_1_target = /** @type {(inputs: Tour_Replies_1_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Each supplier sees only the lines they can quote`)
};

export const tour_replies_1_title = /** @type {(inputs: Tour_Replies_1_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The client stays hidden`)
};

export const tour_replies_2_body = /** @type {(inputs: Tour_Replies_2_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Replies arrive with changed subjects; each is matched to its RFQ by its reference, and reminders stop for that supplier.`)
};

export const tour_replies_2_click = /** @type {(inputs: Tour_Replies_2_ClickInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Simulate replies`)
};

export const tour_replies_2_target = /** @type {(inputs: Tour_Replies_2_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Replies arriving`)
};

export const tour_replies_2_title = /** @type {(inputs: Tour_Replies_2_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Matched by reference`)
};

export const tour_replies_3_body = /** @type {(inputs: Tour_Replies_3_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A supplier Golden Sea never bought from replied. It's created automatically, with its price, date and validity.`)
};

export const tour_replies_3_target = /** @type {(inputs: Tour_Replies_3_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`quoted, never ordered`)
};

export const tour_replies_3_title = /** @type {(inputs: Tour_Replies_3_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remembered without an order`)
};

export const tour_replies_4_body = /** @type {(inputs: Tour_Replies_4_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`An unclear price unit isn't used until someone confirms it.`)
};

export const tour_replies_4_target = /** @type {(inputs: Tour_Replies_4_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Needs a person`)
};

export const tour_replies_4_title = /** @type {(inputs: Tour_Replies_4_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A person confirms the uncertain`)
};

export const tour_replies_5_body = /** @type {(inputs: Tour_Replies_5_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The same engine reads the old inboxes into customers, vessels, suppliers and dated prices. Nothing is saved until Karim Balbaa approves.`)
};

export const tour_replies_5_target = /** @type {(inputs: Tour_Replies_5_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Organise and approve`)
};

export const tour_replies_5_title = /** @type {(inputs: Tour_Replies_5_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Years of email, organised`)
};

export const tour_replies_summary = /** @type {(inputs: Tour_Replies_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier RFQs go out without the client's name; replies are matched even with new subjects.`)
};

export const tour_replies_title = /** @type {(inputs: Tour_Replies_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every reply matched, every price remembered`)
};

export const tour_rfq_to_case_1_body = /** @type {(inputs: Tour_Rfq_To_Case_1_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Outlook, Gmail, the website quick-quote form and WhatsApp all land in one list — nothing lives in someone's personal mailbox.`)
};

export const tour_rfq_to_case_1_target = /** @type {(inputs: Tour_Rfq_To_Case_1_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Connected channels`)
};

export const tour_rfq_to_case_1_title = /** @type {(inputs: Tour_Rfq_To_Case_1_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`One inbox for every channel`)
};

export const tour_rfq_to_case_2_body = /** @type {(inputs: Tour_Rfq_To_Case_2_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A new RFQ for MV Aurora Crest arrives with an Excel list, a PDF and a WhatsApp photo. The email and every file stay with the case.`)
};

export const tour_rfq_to_case_2_click = /** @type {(inputs: Tour_Rfq_To_Case_2_ClickInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Simulate new email`)
};

export const tour_rfq_to_case_2_target = /** @type {(inputs: Tour_Rfq_To_Case_2_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Original message`)
};

export const tour_rfq_to_case_2_title = /** @type {(inputs: Tour_Rfq_To_Case_2_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The original is kept`)
};

export const tour_rfq_to_case_3_body = /** @type {(inputs: Tour_Rfq_To_Case_3_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every line gets its IMPA code, quantity, unit and the file it came from, with a confidence. The 62% photo line is flagged for a person.`)
};

export const tour_rfq_to_case_3_click = /** @type {(inputs: Tour_Rfq_To_Case_3_ClickInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Extract with AI`)
};

export const tour_rfq_to_case_3_target = /** @type {(inputs: Tour_Rfq_To_Case_3_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Draft lines`)
};

export const tour_rfq_to_case_3_title = /** @type {(inputs: Tour_Rfq_To_Case_3_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI reads, people decide`)
};

export const tour_rfq_to_case_4_body = /** @type {(inputs: Tour_Rfq_To_Case_4_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Missing details become a drafted clarification to the customer — drafted, not sent.`)
};

export const tour_rfq_to_case_4_target = /** @type {(inputs: Tour_Rfq_To_Case_4_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Missing or unclear`)
};

export const tour_rfq_to_case_4_title = /** @type {(inputs: Tour_Rfq_To_Case_4_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing is guessed`)
};

export const tour_rfq_to_case_5_body = /** @type {(inputs: Tour_Rfq_To_Case_5_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Assignment rules suggest who owns it and who backs them up; the deadline comes from the customer's request.`)
};

export const tour_rfq_to_case_5_target = /** @type {(inputs: Tour_Rfq_To_Case_5_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Owner, backup and deadline`)
};

export const tour_rfq_to_case_5_title = /** @type {(inputs: Tour_Rfq_To_Case_5_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Owner, backup, deadline`)
};

export const tour_rfq_to_case_6_body = /** @type {(inputs: Tour_Rfq_To_Case_6_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirming creates the case with its lines, links the email and sends one branded acknowledgement.`)
};

export const tour_rfq_to_case_6_target = /** @type {(inputs: Tour_Rfq_To_Case_6_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next step`)
};

export const tour_rfq_to_case_6_title = /** @type {(inputs: Tour_Rfq_To_Case_6_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`One click to a case`)
};

export const tour_rfq_to_case_summary = /** @type {(inputs: Tour_Rfq_To_Case_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`An RFQ email with Excel, PDF and a photo becomes one clean case — AI reads, a person decides.`)
};

export const tour_rfq_to_case_title = /** @type {(inputs: Tour_Rfq_To_Case_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Any format in, one case out`)
};

export const visuals_ack = /** @type {(inputs: Visuals_AckInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Time to acknowledge`)
};

export const visuals_ack_caption = /** @type {(inputs: Visuals_Ack_CaptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`median, new RFQs · target 15 min`)
};

export const visuals_customer_discount = /** @type {(inputs: Visuals_Customer_DiscountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Customer discount`)
};

export const visuals_days = /** @type {(inputs: Visuals_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} d`)
};

export const visuals_deadlines = /** @type {(inputs: Visuals_DeadlinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deadlines and arrivals`)
};

export const visuals_discount = /** @type {(inputs: Visuals_DiscountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Discount`)
};

export const visuals_gp_bridge = /** @type {(inputs: Visuals_Gp_BridgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gross profit, October: expected to actual`)
};

export const visuals_gp_bridge_note = /** @type {(inputs: Visuals_Gp_Bridge_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Where the profit went between the quotes and the bills`)
};

export const visuals_gross_profit = /** @type {(inputs: Visuals_Gross_ProfitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gross profit`)
};

export const visuals_margin = /** @type {(inputs: Visuals_MarginInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Margin`)
};

export const visuals_margin_after = /** @type {(inputs: Visuals_Margin_AfterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Margin after discount`)
};

export const visuals_margin_before = /** @type {(inputs: Visuals_Margin_BeforeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Margin before discount`)
};

export const visuals_margin_caption = /** @type {(inputs: Visuals_Margin_CaptionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`policy: minimum ${i?.min}%, target ${i?.target}%`)
};

export const visuals_minutes = /** @type {(inputs: Visuals_MinutesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} min`)
};

export const visuals_policy_max = /** @type {(inputs: Visuals_Policy_MaxInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`policy maximum ${i?.max}%`)
};

export const visuals_price_built = /** @type {(inputs: Visuals_Price_BuiltInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`How the price is built`)
};

export const visuals_profit = /** @type {(inputs: Visuals_ProfitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Profit`)
};

export const visuals_rate = /** @type {(inputs: Visuals_RateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Rate (EGP per ${i?.currency})`)
};

export const visuals_receivables = /** @type {(inputs: Visuals_ReceivablesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receivables by customer`)
};

export const visuals_selling_price = /** @type {(inputs: Visuals_Selling_PriceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Selling price`)
};

export const visuals_selling_price_in = /** @type {(inputs: Visuals_Selling_Price_InInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Selling price (${i?.currency})`)
};

export const visuals_shared_charges = /** @type {(inputs: Visuals_Shared_ChargesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Shared charges`)
};

export const visuals_supplier_cost = /** @type {(inputs: Visuals_Supplier_CostInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supplier cost`)
};

export const visuals_target = /** @type {(inputs: Visuals_TargetInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`target ${i?.target}%`)
};

export const visuals_targets_note = /** @type {(inputs: Visuals_Targets_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Each bar against its target (the tick); the shading reads poor, fair, good`)
};

export const visuals_this_month = /** @type {(inputs: Visuals_This_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This month`)
};

export const visuals_turnaround = /** @type {(inputs: Visuals_TurnaroundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quote turnaround`)
};

export const visuals_turnaround_caption = /** @type {(inputs: Visuals_Turnaround_CaptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`median, this week · target 1 d`)
};

export const visuals_under_minimum = /** @type {(inputs: Visuals_Under_MinimumInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`under the ${i?.min}% minimum: needs approval`)
};

export const visuals_what_if = /** @type {(inputs: Visuals_What_IfInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What if`)
};

export const visuals_what_if_note = /** @type {(inputs: Visuals_What_If_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Try a margin, a discount and an exchange rate; nothing is saved`)
};

export const visuals_win_caption = /** @type {(inputs: Visuals_Win_CaptionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`of quoted cases won, 12 weeks · target ${i?.target}`)
};

export const visuals_win_rate = /** @type {(inputs: Visuals_Win_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Win rate`)
};