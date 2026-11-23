type __ParaglideMessageMetadata<Inputs, Options, Markup extends import("../runtime.js").MessageMarkupSchema> = import("../runtime.js").MessageMetadata<Inputs, Options, Markup>;
/**
* | output |
* | --- |
* | "Approve" |
*
*/
export const action_cash_approve: ((inputs?: Action_Cash_ApproveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Cash_ApproveInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approve after call-back" |
*
*/
export const action_cash_approve_call_back: ((inputs?: Action_Cash_Approve_Call_BackInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Cash_Approve_Call_BackInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approve: {title}" |
*
*/
export const action_cash_approve_heading: ((inputs: Action_Cash_Approve_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Cash_Approve_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approved: {title}." |
*
*/
export const action_cash_approved: ((inputs: Action_Cash_ApprovedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Cash_ApprovedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Call the supplier back on the number on file ({phone}) — never on a number from the request — and confirm the new account with them." |
*
*/
export const action_cash_call_back_text: ((inputs: Action_Cash_Call_Back_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Cash_Call_Back_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "I called back on the number on file and the supplier confirmed the new account" |
*
*/
export const action_cash_called_back: ((inputs?: Action_Cash_Called_BackInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Cash_Called_BackInputs, { locale?: "en" | "ar" }, {}>;
/**
* | decision | output |
* | --- | --- |
* | "approve" | "Approved by {name}" |
* | * | "Rejected by {name}" |
*
*/
export const action_cash_decided: ((inputs: Action_Cash_DecidedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Cash_DecidedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Note (optional)" |
*
*/
export const action_cash_note_optional: ((inputs?: Action_Cash_Note_OptionalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Cash_Note_OptionalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reason (required)" |
*
*/
export const action_cash_reason_required: ((inputs?: Action_Cash_Reason_RequiredInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Cash_Reason_RequiredInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reject" |
*
*/
export const action_cash_reject: ((inputs?: Action_Cash_RejectInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Cash_RejectInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reject: {title}" |
*
*/
export const action_cash_reject_heading: ((inputs: Action_Cash_Reject_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Cash_Reject_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Rejected: {title}." |
*
*/
export const action_cash_rejected: ((inputs: Action_Cash_RejectedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Cash_RejectedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Alert to {owner} and Karim Balbaa." |
*
*/
export const action_eta_alert: ((inputs: Action_Eta_AlertInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Eta_AlertInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Apply re-plan & alert" |
*
*/
export const action_eta_apply: ((inputs?: Action_Eta_ApplyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Eta_ApplyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Backorder L{line} ({supplier}, {date}): now in time for the drop" |
*
*/
export const action_eta_backorder_in_time: ((inputs: Action_Eta_Backorder_In_TimeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Eta_Backorder_In_TimeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Backorder L{line} ({supplier}, {date}): still late — escalate" |
*
*/
export const action_eta_backorder_late: ((inputs: Action_Eta_Backorder_LateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Eta_Backorder_LateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "From {from} · Subject: {subject}" |
*
*/
export const action_eta_from: ((inputs: Action_Eta_FromInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Eta_FromInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Agent email — ETA update" |
*
*/
export const action_eta_heading: ((inputs?: Action_Eta_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Eta_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Agent email: ETA update" |
*
*/
export const action_eta_label: ((inputs?: Action_Eta_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Eta_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{drop}: on board {from} → {to} · launch re-booked · truck & boarding staff re-confirmed (task for {owner})" |
*
*/
export const action_eta_move: ((inputs: Action_Eta_MoveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Eta_MoveInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No open drop to move." |
*
*/
export const action_eta_no_drop: ((inputs?: Action_Eta_No_DropInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Eta_No_DropInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "AI read · 97% · New ETA {eta} (was {was})" |
*
*/
export const action_eta_read: ((inputs: Action_Eta_ReadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Eta_ReadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "What moves" |
*
*/
export const action_eta_what_moves: ((inputs?: Action_Eta_What_MovesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Eta_What_MovesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Organise" |
*
*/
export const action_history_organise: ((inputs?: Action_History_OrganiseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_History_OrganiseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "History organised — uncertain items are waiting for you" |
*
*/
export const action_history_organised: ((inputs?: Action_History_OrganisedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_History_OrganisedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The acknowledgement is sent once, from the approved template." |
*
*/
export const action_inbox_ack_auto: ((inputs?: Action_Inbox_Ack_AutoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Inbox_Ack_AutoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The acknowledgement is yours to send by hand." |
*
*/
export const action_inbox_ack_manual: ((inputs?: Action_Inbox_Ack_ManualInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Inbox_Ack_ManualInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Backup" |
*
*/
export const action_inbox_backup: ((inputs?: Action_Inbox_BackupInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Inbox_BackupInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Create case" |
*
*/
export const action_inbox_create: ((inputs?: Action_Inbox_CreateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Inbox_CreateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Create this case?" |
*
*/
export const action_inbox_create_heading: ((inputs?: Action_Inbox_Create_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Inbox_Create_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | kind | isNew | countPlural | output |
* | --- | --- | --- | --- |
* | "service" | "yes" | "one" | "Creates a service case for {customer} (new customer record) with {count} line exactly as drafted." |
* | "service" | * | "one" | "Creates a service case for {customer} with {count} line exactly as drafted." |
* | * | "yes" | "one" | "Creates a RFQ case for {customer} (new customer record) with {count} line exactly as drafted." |
* | * | * | "one" | "Creates a RFQ case for {customer} with {count} line exactly as drafted." |
* | "service" | "yes" | * | "Creates a service case for {customer} (new customer record) with {count} lines exactly as drafted." |
* | "service" | * | * | "Creates a service case for {customer} with {count} lines exactly as drafted." |
* | * | "yes" | * | "Creates a RFQ case for {customer} (new customer record) with {count} lines exactly as drafted." |
* | * | * | * | "Creates a RFQ case for {customer} with {count} lines exactly as drafted." |
*
*/
export const action_inbox_creates: ((inputs: Action_Inbox_CreatesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Inbox_CreatesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quote deadline" |
*
*/
export const action_inbox_deadline: ((inputs?: Action_Inbox_DeadlineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Inbox_DeadlineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "A reminder is scheduled before it." |
*
*/
export const action_inbox_deadline_hint: ((inputs?: Action_Inbox_Deadline_HintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Inbox_Deadline_HintInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Flagged lines stay “Clarification needed” until the customer answers." |
*
*/
export const action_inbox_flagged: ((inputs?: Action_Inbox_FlaggedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Inbox_FlaggedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "New email: “{subject}”" |
*
*/
export const action_inbox_new_email: ((inputs: Action_Inbox_New_EmailInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Inbox_New_EmailInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "New supplier reply: “{subject}”" |
*
*/
export const action_inbox_new_reply: ((inputs: Action_Inbox_New_ReplyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Inbox_New_ReplyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Marked not related" |
*
*/
export const action_inbox_not_related: ((inputs?: Action_Inbox_Not_RelatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Inbox_Not_RelatedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Owner" |
*
*/
export const action_inbox_owner: ((inputs?: Action_Inbox_OwnerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Inbox_OwnerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Simulate new email" |
*
*/
export const action_inbox_simulate_email: ((inputs?: Action_Inbox_Simulate_EmailInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Inbox_Simulate_EmailInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Simulate forwarded copy" |
*
*/
export const action_inbox_simulate_forward: ((inputs?: Action_Inbox_Simulate_ForwardInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Inbox_Simulate_ForwardInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Simulate supplier reply" |
*
*/
export const action_inbox_simulate_reply: ((inputs?: Action_Inbox_Simulate_ReplyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Inbox_Simulate_ReplyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{currency} {amount}" |
*
*/
export const action_money: ((inputs: Action_MoneyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_MoneyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Read customer PO" |
*
*/
export const action_order_read_po: ((inputs?: Action_Order_Read_PoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Order_Read_PoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{label} ({detail}): {expected} to {actual}" |
*
*/
export const action_profit_actual_line: ((inputs: Action_Profit_Actual_LineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Profit_Actual_LineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Actual costs confirmed. Estimates replaced on the case." |
*
*/
export const action_profit_actuals_done: ((inputs?: Action_Profit_Actuals_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Profit_Actuals_DoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Replace estimates with actuals" |
*
*/
export const action_profit_actuals_heading: ((inputs?: Action_Profit_Actuals_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Profit_Actuals_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "These billed amounts replace the estimates on the case's shared charges:" |
*
*/
export const action_profit_actuals_intro: ((inputs?: Action_Profit_Actuals_IntroInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Profit_Actuals_IntroInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Bank reference" |
*
*/
export const action_profit_bank_reference: ((inputs?: Action_Profit_Bank_ReferenceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Profit_Bank_ReferenceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Credit note {creditNote} recorded. Claim {ref} settled." |
*
*/
export const action_profit_claim_done: ((inputs: Action_Profit_Claim_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Profit_Claim_DoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Settle claim {ref}" |
*
*/
export const action_profit_claim_heading: ((inputs: Action_Profit_Claim_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Profit_Claim_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{title}. {note} Credit note {creditNote} from {against} for {amount} is booked against the replacement cost." |
*
*/
export const action_profit_claim_text: ((inputs: Action_Profit_Claim_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Profit_Claim_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Close case" |
*
*/
export const action_profit_close: ((inputs?: Action_Profit_CloseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Profit_CloseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{case} closed. Supplier prices and on-time results fed back." |
*
*/
export const action_profit_close_done: ((inputs: Action_Profit_Close_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Profit_Close_DoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Close {case}?" |
*
*/
export const action_profit_close_heading: ((inputs: Action_Profit_Close_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Profit_Close_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Turn every check green to close." |
*
*/
export const action_profit_close_open: ((inputs?: Action_Profit_Close_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Profit_Close_OpenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Every check is green." |
*
*/
export const action_profit_close_ready: ((inputs?: Action_Profit_Close_ReadyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Profit_Close_ReadyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Management and finance close cases." |
*
*/
export const action_profit_close_role: ((inputs?: Action_Profit_Close_RoleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Profit_Close_RoleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Actual gross profit {actual} ({actualMargin}) against {expected} expected ({expectedMargin}). Supplier prices, lead times and on-time results feed back to th..." |
*
*/
export const action_profit_close_text: ((inputs: Action_Profit_Close_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Profit_Close_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Confirm actuals" |
*
*/
export const action_profit_confirm_actuals: ((inputs?: Action_Profit_Confirm_ActualsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Profit_Confirm_ActualsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{amount} received from {customer}. Recorded after the bank movement; the platform never starts transfers." |
*
*/
export const action_profit_receipt_description: ((inputs: Action_Profit_Receipt_DescriptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Profit_Receipt_DescriptionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{amount} received from {customer} at {rate} EGP/{currency}. Recorded after the bank movement; the platform never starts transfers." |
*
*/
export const action_profit_receipt_description_rate: ((inputs: Action_Profit_Receipt_Description_RateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Profit_Receipt_Description_RateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receipt recorded and allocated to {invoice}." |
*
*/
export const action_profit_receipt_done: ((inputs: Action_Profit_Receipt_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Profit_Receipt_DoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Record receipt for {invoice}" |
*
*/
export const action_profit_receipt_prompt: ((inputs: Action_Profit_Receipt_PromptInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Profit_Receipt_PromptInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Record credit note" |
*
*/
export const action_profit_record_credit_note: ((inputs?: Action_Profit_Record_Credit_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Profit_Record_Credit_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Record receipt" |
*
*/
export const action_profit_record_receipt: ((inputs?: Action_Profit_Record_ReceiptInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Profit_Record_ReceiptInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Simulate replies" |
*
*/
export const action_rfqs_simulate: ((inputs?: Action_Rfqs_SimulateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Rfqs_SimulateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier replies are in — offers are on the Compare tab" |
*
*/
export const action_rfqs_simulated: ((inputs?: Action_Rfqs_SimulatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Action_Rfqs_SimulatedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{list} and {more} more" |
*
*/
export const api_assistant_and_more: ((inputs: Api_Assistant_And_MoreInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_And_MoreInputs, { locale?: "en" | "ar" }, {}>;
/**
* | twoPerson | output |
* | --- | --- |
* | "yes" | "{title} — {type}, from {from} · approvers {approvers} (two-person rule)" |
* | * | "{title} — {type}, from {from} · approvers {approvers}" |
*
*/
export const api_assistant_approval_item: ((inputs: Api_Assistant_Approval_ItemInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Approval_ItemInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} approval waits for you: {list}." |
* | * | "{count} approvals wait for you: {list}." |
*
*/
export const api_assistant_approvals_for_you: ((inputs: Api_Assistant_Approvals_For_YouInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Approvals_For_YouInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} approval is waiting." |
* | * | "{count} approvals are waiting." |
*
*/
export const api_assistant_approvals_waiting: ((inputs: Api_Assistant_Approvals_WaitingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Approvals_WaitingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Ask a question." |
*
*/
export const api_assistant_ask_a_question: ((inputs?: Api_Assistant_Ask_A_QuestionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Ask_A_QuestionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} supplier bill is on hold after the three-way match: {list}." |
* | * | "{count} supplier bills are on hold after the three-way match: {list}." |
*
*/
export const api_assistant_bills_on_hold: ((inputs: Api_Assistant_Bills_On_HoldInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Bills_On_HoldInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Briefing from {count} live records" |
*
*/
export const api_assistant_briefing_subject: ((inputs: Api_Assistant_Briefing_SubjectInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Briefing_SubjectInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approval pending: {titles}" |
*
*/
export const api_assistant_case_approval_pending: ((inputs: Api_Assistant_Case_Approval_PendingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Case_Approval_PendingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasEta | output |
* | --- | --- |
* | "yes" | "Quote deadline {day} {time} ({when}) · {eta}" |
* | * | "Quote deadline {day} {time} ({when})" |
*
*/
export const api_assistant_case_deadline: ((inputs: Api_Assistant_Case_DeadlineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Case_DeadlineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Gross profit {actual} ({actualMargin}) against {expected} expected ({expectedMargin})" |
*
*/
export const api_assistant_case_gp: ((inputs: Api_Assistant_Case_GpInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Case_GpInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Invoice {number}: {status}, {amount} open" |
*
*/
export const api_assistant_case_invoice: ((inputs: Api_Assistant_Case_InvoiceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Case_InvoiceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasBlocked | output |
* | --- | --- |
* | "yes" | "Lines: {ready} of {total} ready, {blocked} blocked" |
* | * | "Lines: {ready} of {total} ready" |
*
*/
export const api_assistant_case_lines: ((inputs: Api_Assistant_Case_LinesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Case_LinesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{caseId} ({vessel}): actual gross profit {actual}, {actualMargin} margin, against {expected} ({expectedMargin}) expected at quotation." |
*
*/
export const api_assistant_case_margin: ((inputs: Api_Assistant_Case_MarginInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Case_MarginInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasBlocker | output |
* | --- | --- |
* | "yes" | "Next: {next} · blocker: {blocker}" |
* | * | "Next: {next}" |
*
*/
export const api_assistant_case_next: ((inputs: Api_Assistant_Case_NextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Case_NextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{caseId} profit & close" |
*
*/
export const api_assistant_case_profit_and_close: ((inputs: Api_Assistant_Case_Profit_And_CloseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Case_Profit_And_CloseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasWait | output |
* | --- | --- |
* | "yes" | "Stage: {stage} ({wait}) · owner {owner}" |
* | * | "Stage: {stage} · owner {owner}" |
*
*/
export const api_assistant_case_stage: ((inputs: Api_Assistant_Case_StageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Case_StageInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Waiting on {suppliers} ({statuses})" |
*
*/
export const api_assistant_case_waiting_on: ((inputs: Api_Assistant_Case_Waiting_OnInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Case_Waiting_OnInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} live case needs attention." |
* | * | "{count} live cases need attention." |
*
*/
export const api_assistant_cases_need_attention: ((inputs: Api_Assistant_Cases_Need_AttentionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Cases_Need_AttentionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Collections: {totals} open on {count} invoices." |
*
*/
export const api_assistant_collections: ((inputs: Api_Assistant_CollectionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_CollectionsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "commitment blocked until it matches" |
*
*/
export const api_assistant_commitment_blocked: ((inputs?: Api_Assistant_Commitment_BlockedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Commitment_BlockedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Control room" |
*
*/
export const api_assistant_control_room: ((inputs?: Api_Assistant_Control_RoomInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Control_RoomInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | overduePluralExact | overduePlural | output |
* | --- | --- | --- | --- |
* | "one" | "0" | * | "Customers owe {totals} on {count} open invoice." |
* | * | "0" | * | "Customers owe {totals} on {count} open invoices." |
* | "one" | * | * | "Customers owe {totals} on {count} open invoice; {overdue} overdue." |
* | * | * | * | "Customers owe {totals} on {count} open invoices; {overdue} overdue." |
*
*/
export const api_assistant_customers_owe: ((inputs: Api_Assistant_Customers_OweInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Customers_OweInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} supplier delivery came in short: {list}. The bills stay on hold until the quantities match." |
* | * | "{count} supplier deliveries came in short: {list}. The bills stay on hold until the quantities match." |
*
*/
export const api_assistant_deliveries_short: ((inputs: Api_Assistant_Deliveries_ShortInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Deliveries_ShortInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Due this week: {list}." |
*
*/
export const api_assistant_due_this_week: ((inputs: Api_Assistant_Due_This_WeekInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Due_This_WeekInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "ETA {port} {day}" |
*
*/
export const api_assistant_eta: ((inputs: Api_Assistant_EtaInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_EtaInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} integration exception needs a look: {list}. Safe retry is available." |
* | * | "{count} integration exceptions need a look: {list}. Safe retry is available." |
*
*/
export const api_assistant_exceptions: ((inputs: Api_Assistant_ExceptionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_ExceptionsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "USD moved from {from} to {to} EGP ({change}). The new rate waits for approval; open quotations are re-checked against the 15% minimum margin once it's active." |
*
*/
export const api_assistant_fx_moved: ((inputs: Api_Assistant_Fx_MovedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Fx_MovedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "FX on receipts: {amount}" |
*
*/
export const api_assistant_fx_on_receipts: ((inputs: Api_Assistant_Fx_On_ReceiptsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Fx_On_ReceiptsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "FX rates" |
*
*/
export const api_assistant_fx_rates: ((inputs?: Api_Assistant_Fx_RatesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Fx_RatesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Good morning {name}." |
*
*/
export const api_assistant_good_morning: ((inputs: Api_Assistant_Good_MorningInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Good_MorningInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Good morning there." |
*
*/
export const api_assistant_good_morning_there: ((inputs?: Api_Assistant_Good_Morning_ThereInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Good_Morning_ThereInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Growth board" |
*
*/
export const api_assistant_growth_board: ((inputs?: Api_Assistant_Growth_BoardInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Growth_BoardInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "I answer from every case, quote, approval, invoice and supplier record in the platform. Ask about a vessel or case number, approvals, who owes us money, supp..." |
*
*/
export const api_assistant_help: ((inputs?: Api_Assistant_HelpInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_HelpInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} item is awaiting approval ({types})." |
* | * | "{count} items are awaiting approval ({types})." |
*
*/
export const api_assistant_items_awaiting_approval: ((inputs: Api_Assistant_Items_Awaiting_ApprovalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Items_Awaiting_ApprovalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | extra | output |
* | --- | --- |
* | "claim" | "{supplier} — {po} line {line}: {received} of {ordered} received · {claim}" |
* | "promised" | "{supplier} — {po} line {line}: {received} of {ordered} received · rest promised {promised}" |
* | * | "{supplier} — {po} line {line}: {received} of {ordered} received" |
*
*/
export const api_assistant_late_item: ((inputs: Api_Assistant_Late_ItemInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Late_ItemInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Least reliable: {name} {onTime}% on time, {hours} h replies" |
*
*/
export const api_assistant_least_reliable: ((inputs: Api_Assistant_Least_ReliableInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Least_ReliableInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Lowest: {list}." |
*
*/
export const api_assistant_lowest: ((inputs: Api_Assistant_LowestInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_LowestInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Margin by store, last 90 days: {list} (minimum 15%)." |
*
*/
export const api_assistant_margin_by_store: ((inputs: Api_Assistant_Margin_By_StoreInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Margin_By_StoreInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{month}: gross profit EGP {expected}k expected at quotation, EGP {actual}k actual so far — the gap closes as November's costs are billed." |
*
*/
export const api_assistant_month_gp: ((inputs: Api_Assistant_Month_GpInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Month_GpInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "…and {count} more due later." |
*
*/
export const api_assistant_more_due_later: ((inputs: Api_Assistant_More_Due_LaterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_More_Due_LaterInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No live case is at risk." |
*
*/
export const api_assistant_no_case_at_risk: ((inputs?: Api_Assistant_No_Case_At_RiskInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_No_Case_At_RiskInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No customer invoice has an open balance." |
*
*/
export const api_assistant_no_open_balance: ((inputs?: Api_Assistant_No_Open_BalanceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_No_Open_BalanceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing overdue." |
*
*/
export const api_assistant_nothing_overdue: ((inputs?: Api_Assistant_Nothing_OverdueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Nothing_OverdueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing is waiting for approval." |
*
*/
export const api_assistant_nothing_waiting_approval: ((inputs?: Api_Assistant_Nothing_Waiting_ApprovalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Nothing_Waiting_ApprovalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "November gross profit: EGP {expected}k expected at quotation, EGP {actual}k actual so far as costs are billed." |
*
*/
export const api_assistant_november_gp: ((inputs: Api_Assistant_November_GpInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_November_GpInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasValue | next | output |
* | --- | --- | --- |
* | "yes" | "none" | "{name} — {stage}, {value} · no next step planned" |
* | "yes" | "dated" | "{name} — {stage}, {value} · next: {step} ({due})" |
* | "yes" | * | "{name} — {stage}, {value} · next: {step}" |
* | * | "none" | "{name} — {stage} · no next step planned" |
* | * | "dated" | "{name} — {stage} · next: {step} ({due})" |
* | * | * | "{name} — {stage} · next: {step}" |
*
*/
export const api_assistant_opportunity_item: ((inputs: Api_Assistant_Opportunity_ItemInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Opportunity_ItemInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Overdue: {list}." |
*
*/
export const api_assistant_overdue: ((inputs: Api_Assistant_OverdueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_OverdueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | due | hasPaid | output |
* | --- | --- | --- |
* | "overdue" | "yes" | "{customer}: {amount} on {number}, overdue since {day} ({paid} received)" |
* | "overdue" | * | "{customer}: {amount} on {number}, overdue since {day}" |
* | "due" | "yes" | "{customer}: {amount} on {number}, due {day} ({paid} received)" |
* | "due" | * | "{customer}: {amount} on {number}, due {day}" |
* | * | "yes" | "{customer}: {amount} on {number} ({paid} received)" |
* | * | * | "{customer}: {amount} on {number}" |
*
*/
export const api_assistant_owe_item: ((inputs: Api_Assistant_Owe_ItemInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Owe_ItemInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{open} growth opportunities open; {inquiries} inquiries and {won} wins in the last 12 weeks ({byCount}% by count, {byValue}% by value this month)." |
*
*/
export const api_assistant_pipeline: ((inputs: Api_Assistant_PipelineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_PipelineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Plan a next step or close: {names}." |
*
*/
export const api_assistant_plan_next_step: ((inputs: Api_Assistant_Plan_Next_StepInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Plan_Next_StepInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "PO {po}" |
*
*/
export const api_assistant_po: ((inputs: Api_Assistant_PoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_PoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The customer PO on {caseId} ({vessel}) differs from the approved quote: {blocker}." |
*
*/
export const api_assistant_po_mismatch: ((inputs: Api_Assistant_Po_MismatchInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Po_MismatchInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Profit & close" |
*
*/
export const api_assistant_profit_and_close: ((inputs?: Api_Assistant_Profit_And_CloseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Profit_And_CloseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasBlocker | output |
* | --- | --- |
* | "yes" | "{vessel} ({caseId}) {when} — {blocker}" |
* | * | "{vessel} ({caseId}) {when}" |
*
*/
export const api_assistant_quote_due_item: ((inputs: Api_Assistant_Quote_Due_ItemInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Quote_Due_ItemInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} quote must go out by tomorrow: {list}." |
* | * | "{count} quotes must go out by tomorrow: {list}." |
*
*/
export const api_assistant_quotes_due: ((inputs: Api_Assistant_Quotes_DueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Quotes_DueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receipt PO {po}" |
*
*/
export const api_assistant_receipt_po: ((inputs: Api_Assistant_Receipt_PoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Receipt_PoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "I can't share costs, margins or profit with the Sales role." |
*
*/
export const api_assistant_refused: ((inputs?: Api_Assistant_RefusedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_RefusedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Ask about a case's status, approvals, deadlines, suppliers or the growth pipeline instead." |
*
*/
export const api_assistant_refused_hint: ((inputs?: Api_Assistant_Refused_HintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Refused_HintInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasBlocker | output |
* | --- | --- |
* | "yes" | "{caseId} {vessel} — {stage}, deadline {deadline} · {blocker}" |
* | * | "{caseId} {vessel} — {stage}, deadline {deadline}" |
*
*/
export const api_assistant_risky_item: ((inputs: Api_Assistant_Risky_ItemInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Risky_ItemInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{caseId}: {actual} actual vs {expected} expected — the launch cost more after the ETA moved at short notice." |
*
*/
export const api_assistant_settled_margin: ((inputs: Api_Assistant_Settled_MarginInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Settled_MarginInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasPromise | output |
* | --- | --- |
* | "yes" | "PO {po} line {line}, {received} of {ordered} — rest promised {promised}" |
* | * | "PO {po} line {line}, {received} of {ordered}" |
*
*/
export const api_assistant_short_item: ((inputs: Api_Assistant_Short_ItemInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Short_ItemInputs, { locale?: "en" | "ar" }, {}>;
/**
* | remindersPluralExact | remindersPlural | output |
* | --- | --- | --- |
* | "0" | * | "{supplier} on {reference}" |
* | * | "one" | "{supplier} on {reference} ({reminders} reminder sent)" |
* | * | * | "{supplier} on {reference} ({reminders} reminders sent)" |
*
*/
export const api_assistant_silent_item: ((inputs: Api_Assistant_Silent_ItemInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Silent_ItemInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "What's waiting for approval?" |
*
*/
export const api_assistant_suggest_approvals: ((inputs?: Api_Assistant_Suggest_ApprovalsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Suggest_ApprovalsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Which suppliers are late?" |
*
*/
export const api_assistant_suggest_late_suppliers: ((inputs?: Api_Assistant_Suggest_Late_SuppliersInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Suggest_Late_SuppliersInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "What's our margin this month?" |
*
*/
export const api_assistant_suggest_margin: ((inputs?: Api_Assistant_Suggest_MarginInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Suggest_MarginInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Who owes us money?" |
*
*/
export const api_assistant_suggest_owes: ((inputs?: Api_Assistant_Suggest_OwesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Suggest_OwesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "How is the growth pipeline?" |
*
*/
export const api_assistant_suggest_pipeline: ((inputs?: Api_Assistant_Suggest_PipelineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Suggest_PipelineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "What's the status of Aurora Crest?" |
*
*/
export const api_assistant_suggest_status: ((inputs?: Api_Assistant_Suggest_StatusInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Suggest_StatusInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Summarised again at {at} from {count} live records." |
*
*/
export const api_assistant_summarised_again: ((inputs: Api_Assistant_Summarised_AgainInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Summarised_AgainInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasOnTime | isNew | output |
* | --- | --- | --- |
* | "yes" | "yes" | "{name}: replies in {hours} h on average, {onTime}% on time — new supplier, never ordered from." |
* | "yes" | * | "{name}: replies in {hours} h on average, {onTime}% on time." |
* | * | "yes" | "{name}: replies in {hours} h on average, no deliveries yet — new supplier, never ordered from." |
* | * | * | "{name}: replies in {hours} h on average, no deliveries yet." |
*
*/
export const api_assistant_supplier_named: ((inputs: Api_Assistant_Supplier_NamedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Supplier_NamedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} supplier hasn't replied in time: {list}. Reminders run automatically; escalations go to the case owner." |
* | * | "{count} suppliers haven't replied in time: {list}. Reminders run automatically; escalations go to the case owner." |
*
*/
export const api_assistant_suppliers_silent: ((inputs: Api_Assistant_Suppliers_SilentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Suppliers_SilentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | latePlural | waitingPlural | output |
* | --- | --- | --- |
* | "one" | "one" | "{late} delivery is late or short, and {waiting} supplier RFQ is waiting for a reply." |
* | * | "one" | "{late} deliveries are late or short, and {waiting} supplier RFQ is waiting for a reply." |
* | "one" | * | "{late} delivery is late or short, and {waiting} supplier RFQs are waiting for a reply." |
* | * | * | "{late} deliveries are late or short, and {waiting} supplier RFQs are waiting for a reply." |
*
*/
export const api_assistant_suppliers_summary: ((inputs: Api_Assistant_Suppliers_SummaryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Suppliers_SummaryInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasDue | remindersPluralExact | remindersPlural | output |
* | --- | --- | --- | --- |
* | "yes" | "0" | * | "{supplier} — {reference} {status}, due {due}" |
* | * | "0" | * | "{supplier} — {reference} {status}" |
* | "yes" | * | "one" | "{supplier} — {reference} {status}, due {due} ({reminders} reminder)" |
* | * | * | "one" | "{supplier} — {reference} {status} ({reminders} reminder)" |
* | "yes" | * | * | "{supplier} — {reference} {status}, due {due} ({reminders} reminders)" |
* | * | * | * | "{supplier} — {reference} {status} ({reminders} reminders)" |
*
*/
export const api_assistant_waiting_item: ((inputs: Api_Assistant_Waiting_ItemInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_Waiting_ItemInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasReason | output |
* | --- | --- |
* | "yes" | "We owe {supplier} {amount} on bill {bill} ({status}: {reason})" |
* | * | "We owe {supplier} {amount} on bill {bill} ({status})" |
*
*/
export const api_assistant_we_owe: ((inputs: Api_Assistant_We_OweInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Assistant_We_OweInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Account owner" |
*
*/
export const api_cash_account_owner: ((inputs?: Api_Cash_Account_OwnerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Account_OwnerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{amount} allocated to {number} — balance {balance}." |
*
*/
export const api_cash_allocated_balance: ((inputs: Api_Cash_Allocated_BalanceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Allocated_BalanceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{amount} allocated to {number} — paid in full." |
*
*/
export const api_cash_allocated_paid: ((inputs: Api_Cash_Allocated_PaidInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Allocated_PaidInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "An approval is already in progress for this payable." |
*
*/
export const api_cash_approval_in_progress: ((inputs?: Api_Cash_Approval_In_ProgressInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Approval_In_ProgressInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approval not found." |
*
*/
export const api_cash_approval_not_found: ((inputs?: Api_Cash_Approval_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Approval_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approve payment to {supplier}" |
*
*/
export const api_cash_approve_payment_title: ((inputs: Api_Cash_Approve_Payment_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Approve_Payment_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Bank-detail change not found." |
*
*/
export const api_cash_bank_change_not_found: ((inputs?: Api_Cash_Bank_Change_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Bank_Change_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Call-back done on number on file. {note}" |
*
*/
export const api_cash_call_back_done: ((inputs: Api_Cash_Call_Back_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Call_Back_DoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Call back on the number on file and tick the confirmation first." |
*
*/
export const api_cash_call_back_first: ((inputs?: Api_Cash_Call_Back_FirstInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Call_Back_FirstInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "You can't decide on this approval." |
*
*/
export const api_cash_cant_decide: ((inputs?: Api_Cash_Cant_DecideInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Cant_DecideInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Collect {amount} on {number}" |
*
*/
export const api_cash_collect_goal: ((inputs: Api_Cash_Collect_GoalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Collect_GoalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Enter the amount received." |
*
*/
export const api_cash_enter_amount: ((inputs?: Api_Cash_Enter_AmountInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Enter_AmountInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Management and finance apply bank details." |
*
*/
export const api_cash_finance_applies_bank: ((inputs?: Api_Cash_Finance_Applies_BankInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Finance_Applies_BankInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Management and finance record payments." |
*
*/
export const api_cash_finance_records_payments: ((inputs?: Api_Cash_Finance_Records_PaymentsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Finance_Records_PaymentsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Management and finance request payment approvals." |
*
*/
export const api_cash_finance_requests_approvals: ((inputs?: Api_Cash_Finance_Requests_ApprovalsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Finance_Requests_ApprovalsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Give the bank reference." |
*
*/
export const api_cash_give_bank_reference: ((inputs?: Api_Cash_Give_Bank_ReferenceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Give_Bank_ReferenceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Give a reason for rejecting." |
*
*/
export const api_cash_give_reject_reason: ((inputs?: Api_Cash_Give_Reject_ReasonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Give_Reject_ReasonInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Invoice not found." |
*
*/
export const api_cash_invoice_not_found: ((inputs?: Api_Cash_Invoice_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Invoice_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | ";" |
*
*/
export const api_cash_list_separator: ((inputs?: Api_Cash_List_SeparatorInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_List_SeparatorInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number} ({customer}, {amount} open)" |
*
*/
export const api_cash_match_item: ((inputs: Api_Cash_Match_ItemInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Match_ItemInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "Looks like it pays this invoice: {list}. A person records the payment." |
* | * | "Looks like it pays these {count} invoices: {list}. A person records the payment." |
*
*/
export const api_cash_match_message: ((inputs: Api_Cash_Match_MessageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Match_MessageInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No open invoice matches these numbers or this amount — check the remittance by hand." |
*
*/
export const api_cash_no_remittance_match: ((inputs?: Api_Cash_No_Remittance_MatchInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_No_Remittance_MatchInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "PO {number} · due {due} · bank details unchanged." |
*
*/
export const api_cash_pay_detail: ((inputs: Api_Cash_Pay_DetailInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Pay_DetailInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "PO {number} · bill {bill} matched (PO = receipt = bill) · due {due} · bank details unchanged." |
*
*/
export const api_cash_pay_detail_matched: ((inputs: Api_Cash_Pay_Detail_MatchedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Pay_Detail_MatchedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pay {supplier} {amount} — {number}" |
*
*/
export const api_cash_pay_title: ((inputs: Api_Cash_Pay_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Pay_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Payable not found." |
*
*/
export const api_cash_payable_not_found: ((inputs?: Api_Cash_Payable_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Payable_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier payables, payment approvals and bank details are not visible to Sales." |
*
*/
export const api_cash_payables_hidden_from_sales: ((inputs?: Api_Cash_Payables_Hidden_From_SalesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Payables_Hidden_From_SalesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The payment isn't approved yet." |
*
*/
export const api_cash_payment_not_approved: ((inputs?: Api_Cash_Payment_Not_ApprovedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Payment_Not_ApprovedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reviewed and sent by a person." |
*
*/
export const api_cash_reminder_sent_note: ((inputs?: Api_Cash_Reminder_Sent_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Reminder_Sent_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Two different people must approve first." |
*
*/
export const api_cash_two_approvers_first: ((inputs?: Api_Cash_Two_Approvers_FirstInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Cash_Two_Approvers_FirstInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasNote | output |
* | --- | --- |
* | "yes" | "L{line}: customer accepted the alternative pack in writing ({note})." |
* | * | "L{line}: customer accepted the alternative pack in writing." |
*
*/
export const api_commercial_accepted_activity: ((inputs: Api_Commercial_Accepted_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Accepted_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Advance payment exposure: {supplier}" |
*
*/
export const api_commercial_advance_payment: ((inputs: Api_Commercial_Advance_PaymentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Advance_PaymentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Agency pricelist — priced instantly, no supplier RFQ" |
*
*/
export const api_commercial_agency_flag: ((inputs?: Api_Commercial_Agency_FlagInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Agency_FlagInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Agency terms" |
*
*/
export const api_commercial_agency_terms: ((inputs?: Api_Commercial_Agency_TermsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Agency_TermsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number} is already awaiting approval." |
*
*/
export const api_commercial_already_awaiting: ((inputs: Api_Commercial_Already_AwaitingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Already_AwaitingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number} is already {status} — the decision can't be withdrawn." |
*
*/
export const api_commercial_already_cant_withdraw: ((inputs: Api_Commercial_Already_Cant_WithdrawInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Already_Cant_WithdrawInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Alternative pack accepted by the customer in writing" |
*
*/
export const api_commercial_alternative_accepted: ((inputs?: Api_Commercial_Alternative_AcceptedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Alternative_AcceptedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "alternative pack" |
*
*/
export const api_commercial_alternative_pack: ((inputs?: Api_Commercial_Alternative_PackInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Alternative_PackInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "alternatives allowed" |
*
*/
export const api_commercial_alternatives_allowed: ((inputs?: Api_Commercial_Alternatives_AllowedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Alternatives_AllowedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approval not found." |
*
*/
export const api_commercial_approval_not_found: ((inputs?: Api_Commercial_Approval_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Approval_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Your approval is recorded — {progress}." |
*
*/
export const api_commercial_approval_recorded: ((inputs: Api_Commercial_Approval_RecordedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Approval_RecordedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quote {number} to {customer} — {total}" |
*
*/
export const api_commercial_approval_title: ((inputs: Api_Commercial_Approval_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Approval_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasMargin | output |
* | --- | --- |
* | "yes" | "Quote {number} to {customer} — {margin}% margin (min {min}%)" |
* | * | "Quote {number} to {customer} (min {min}%)" |
*
*/
export const api_commercial_approval_title_margin: ((inputs: Api_Commercial_Approval_Title_MarginInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Approval_Title_MarginInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approved." |
*
*/
export const api_commercial_approved_dot: ((inputs?: Api_Commercial_Approved_DotInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Approved_DotInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approved: {title}" |
*
*/
export const api_commercial_approved_title: ((inputs: Api_Commercial_Approved_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Approved_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The new bank details are already applied — the decision can't be withdrawn." |
*
*/
export const api_commercial_bank_applied_cant_withdraw: ((inputs?: Api_Commercial_Bank_Applied_Cant_WithdrawInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Bank_Applied_Cant_WithdrawInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Below {min}% minimum margin — approval exception" |
*
*/
export const api_commercial_below_min: ((inputs: Api_Commercial_Below_MinInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Below_MinInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Best-fit offer (landed cost)" |
*
*/
export const api_commercial_best_fit_reason: ((inputs?: Api_Commercial_Best_Fit_ReasonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Best_Fit_ReasonInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Best regards," |
*
*/
export const api_commercial_best_regards: ((inputs?: Api_Commercial_Best_RegardsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Best_RegardsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Case not found." |
*
*/
export const api_commercial_case_not_found: ((inputs?: Api_Commercial_Case_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Case_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Shared charge is an estimate: {label} ({amount})" |
*
*/
export const api_commercial_charge_estimate: ((inputs: Api_Commercial_Charge_EstimateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Charge_EstimateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Check customer PO against the quote" |
*
*/
export const api_commercial_check_po: ((inputs?: Api_Commercial_Check_PoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Check_PoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Check customer PO against the quote (partial award)" |
*
*/
export const api_commercial_check_po_partial: ((inputs?: Api_Commercial_Check_Po_PartialInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Check_Po_PartialInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Choose at least one offer." |
*
*/
export const api_commercial_choose_offer: ((inputs?: Api_Commercial_Choose_OfferInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Choose_OfferInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Closed — lost" |
*
*/
export const api_commercial_closed_lost: ((inputs?: Api_Commercial_Closed_LostInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Closed_LostInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Converted at approved FX {currency}/EGP {rate}" |
*
*/
export const api_commercial_converted_fx: ((inputs: Api_Commercial_Converted_FxInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Converted_FxInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasWas | output |
* | --- | --- |
* | "yes" | "Corrected v{version}: replaces v{replaces} ({was})" |
* | * | "Corrected v{version}: replaces v{replaces}" |
*
*/
export const api_commercial_corrected_version: ((inputs: Api_Commercial_Corrected_VersionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Corrected_VersionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Thank you for your offer. On line {line} we asked for {part} (exact part — no alternatives)." |
*
*/
export const api_commercial_correction_asked: ((inputs: Api_Commercial_Correction_AskedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Correction_AskedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Please send a corrected offer for the requested part, with price, availability and lead time to Port Said." |
*
*/
export const api_commercial_correction_please: ((inputs?: Api_Commercial_Correction_PleaseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Correction_PleaseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Correction request sent to {supplier} for line {line} (confirmed by {name})." |
*
*/
export const api_commercial_correction_sent_activity: ((inputs: Api_Commercial_Correction_Sent_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Correction_Sent_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sent 16 Nov · corrected v{version} received and in use" |
*
*/
export const api_commercial_correction_sent_status: ((inputs: Api_Commercial_Correction_Sent_StatusInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Correction_Sent_StatusInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{rfq} — line {line}: please correct your offer" |
*
*/
export const api_commercial_correction_subject: ((inputs: Api_Commercial_Correction_SubjectInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Correction_SubjectInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer decision" |
*
*/
export const api_commercial_customer_decision: ((inputs?: Api_Commercial_Customer_DecisionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Customer_DecisionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{n} d" |
*
*/
export const api_commercial_days_short: ((inputs: Api_Commercial_Days_ShortInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Days_ShortInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Dear {name}," |
*
*/
export const api_commercial_dear: ((inputs: Api_Commercial_DearInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_DearInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Dear colleagues," |
*
*/
export const api_commercial_dear_colleagues: ((inputs?: Api_Commercial_Dear_ColleaguesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Dear_ColleaguesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | approved | hasReason | output |
* | --- | --- | --- |
* | "yes" | "yes" | "{name} approved “{title}”: {reason}." |
* | "yes" | * | "{name} approved “{title}”." |
* | * | "yes" | "{name} returned “{title}”: {reason}." |
* | * | * | "{name} returned “{title}”." |
*
*/
export const api_commercial_decided_activity: ((inputs: Api_Commercial_Decided_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Decided_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasNote | output |
* | --- | --- |
* | "yes" | "Customer decision on {number}: {decision} — {note}." |
* | * | "Customer decision on {number}: {decision}." |
*
*/
export const api_commercial_decision_activity: ((inputs: Api_Commercial_Decision_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Decision_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Decision must be Approve or Reject." |
*
*/
export const api_commercial_decision_must_be: ((inputs?: Api_Commercial_Decision_Must_BeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Decision_Must_BeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Record the customer's decision on the version they received." |
*
*/
export const api_commercial_decision_on_received: ((inputs?: Api_Commercial_Decision_On_ReceivedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Decision_On_ReceivedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Decision withdrawn — {title} is waiting again" |
*
*/
export const api_commercial_decision_withdrawn: ((inputs: Api_Commercial_Decision_WithdrawnInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Decision_WithdrawnInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Delivered (as quoted)" |
*
*/
export const api_commercial_delivered_as_quoted: ((inputs?: Api_Commercial_Delivered_As_QuotedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Delivered_As_QuotedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "On board at {port} on arrival" |
*
*/
export const api_commercial_delivery_terms_default: ((inputs: Api_Commercial_Delivery_Terms_DefaultInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Delivery_Terms_DefaultInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "deviation" |
*
*/
export const api_commercial_deviation: ((inputs?: Api_Commercial_DeviationInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_DeviationInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "different item" |
*
*/
export const api_commercial_different_item: ((inputs?: Api_Commercial_Different_ItemInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Different_ItemInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer discount {discount}% is above {max}% without approval" |
*
*/
export const api_commercial_discount_above: ((inputs: Api_Commercial_Discount_AboveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Discount_AboveInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Draft — not sent" |
*
*/
export const api_commercial_draft_not_sent: ((inputs?: Api_Commercial_Draft_Not_SentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Draft_Not_SentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Due {day}" |
*
*/
export const api_commercial_due_day: ((inputs: Api_Commercial_Due_DayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Due_DayInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number} emailed to {to} — draft confirmed by {name}." |
*
*/
export const api_commercial_emailed_activity: ((inputs: Api_Commercial_Emailed_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Emailed_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{part} only" |
*
*/
export const api_commercial_exact_only: ((inputs: Api_Commercial_Exact_OnlyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Exact_OnlyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Expired validity: offer ended {day} — reconfirm" |
*
*/
export const api_commercial_expired_validity: ((inputs: Api_Commercial_Expired_ValidityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Expired_ValidityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Currency" |
*
*/
export const api_commercial_field_currency: ((inputs?: Api_Commercial_Field_CurrencyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Field_CurrencyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Line count" |
*
*/
export const api_commercial_field_line_count: ((inputs?: Api_Commercial_Field_Line_CountInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Field_Line_CountInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Payment terms" |
*
*/
export const api_commercial_field_payment_terms: ((inputs?: Api_Commercial_Field_Payment_TermsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Field_Payment_TermsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quotation no." |
*
*/
export const api_commercial_field_quotation_no: ((inputs?: Api_Commercial_Field_Quotation_NoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Field_Quotation_NoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Total (excl. VAT)" |
*
*/
export const api_commercial_field_total: ((inputs?: Api_Commercial_Field_TotalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Field_TotalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Validity" |
*
*/
export const api_commercial_field_validity: ((inputs?: Api_Commercial_Field_ValidityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Field_ValidityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Follow up {number} in 2 days (internal reminder)" |
*
*/
export const api_commercial_follow_up_2_days: ((inputs: Api_Commercial_Follow_Up_2_DaysInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Follow_Up_2_DaysInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Freight as quoted" |
*
*/
export const api_commercial_freight_as_quoted: ((inputs?: Api_Commercial_Freight_As_QuotedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Freight_As_QuotedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "An exchange-rate decision takes effect at once — propose a new rate instead." |
*
*/
export const api_commercial_fx_decision_stands: ((inputs?: Api_Commercial_Fx_Decision_StandsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Fx_Decision_StandsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approved FX · USD/EGP {usd} · EUR/EGP {eur}" |
*
*/
export const api_commercial_fx_label: ((inputs: Api_Commercial_Fx_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Fx_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Give a reason: this isn't the best-fit offer (kept for the approver)." |
*
*/
export const api_commercial_give_reason_not_best: ((inputs?: Api_Commercial_Give_Reason_Not_BestInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Give_Reason_Not_BestInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Give a reason when returning a request." |
*
*/
export const api_commercial_give_return_reason: ((inputs?: Api_Commercial_Give_Return_ReasonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Give_Return_ReasonInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Golden Sea truck {from} → {port}" |
*
*/
export const api_commercial_gs_truck_lane: ((inputs: Api_Commercial_Gs_Truck_LaneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Gs_Truck_LaneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Import freight, duty & clearance (est. 18%)" |
*
*/
export const api_commercial_import_freight: ((inputs?: Api_Commercial_Import_FreightInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Import_FreightInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Items {lines} of your request will follow in a revised quotation." |
*
*/
export const api_commercial_items_follow: ((inputs: Api_Commercial_Items_FollowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Items_FollowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Karim Balbaa: approve {number}" |
*
*/
export const api_commercial_karim_approve: ((inputs: Api_Commercial_Karim_ApproveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Karim_ApproveInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{n} days" |
*
*/
export const api_commercial_lead_days: ((inputs: Api_Commercial_Lead_DaysInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Lead_DaysInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Lead time {days} d misses vessel ETA {eta}" |
*
*/
export const api_commercial_lead_time_misses: ((inputs: Api_Commercial_Lead_Time_MissesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Lead_Time_MissesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier lead time misses ETA" |
*
*/
export const api_commercial_lead_time_misses_eta: ((inputs?: Api_Commercial_Lead_Time_Misses_EtaInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Lead_Time_Misses_EtaInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Line {line} not found." |
*
*/
export const api_commercial_line_not_found: ((inputs: Api_Commercial_Line_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Line_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Lines {lines} excluded — to follow in a revised quotation" |
*
*/
export const api_commercial_lines_excluded: ((inputs: Api_Commercial_Lines_ExcludedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Lines_ExcludedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Local truck in {port}" |
*
*/
export const api_commercial_local_truck: ((inputs: Api_Commercial_Local_TruckInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Local_TruckInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier did not quote this line (partial reply) — follow-up drafted" |
*
*/
export const api_commercial_missing_item_note: ((inputs?: Api_Commercial_Missing_Item_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Missing_Item_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Negative / zero profit" |
*
*/
export const api_commercial_negative_profit: ((inputs?: Api_Commercial_Negative_ProfitInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Negative_ProfitInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "New supplier · no delivery history · {terms}" |
*
*/
export const api_commercial_new_supplier: ((inputs: Api_Commercial_New_SupplierInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_New_SupplierInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No approval requested yet." |
*
*/
export const api_commercial_no_approval_requested: ((inputs?: Api_Commercial_No_Approval_RequestedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_No_Approval_RequestedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "You have no decision on this request to withdraw." |
*
*/
export const api_commercial_no_decision_to_withdraw: ((inputs?: Api_Commercial_No_Decision_To_WithdrawInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_No_Decision_To_WithdrawInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No delivery history" |
*
*/
export const api_commercial_no_delivery_history: ((inputs?: Api_Commercial_No_Delivery_HistoryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_No_Delivery_HistoryInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No exceptions — standard approval." |
*
*/
export const api_commercial_no_exceptions: ((inputs?: Api_Commercial_No_ExceptionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_No_ExceptionsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "This request doesn't name its quotation — the decision can't be withdrawn." |
*
*/
export const api_commercial_no_quotation_named: ((inputs?: Api_Commercial_No_Quotation_NamedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_No_Quotation_NamedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "That isn't a selection of line {line}." |
*
*/
export const api_commercial_not_a_selection: ((inputs: Api_Commercial_Not_A_SelectionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Not_A_SelectionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Not given" |
*
*/
export const api_commercial_not_given: ((inputs?: Api_Commercial_Not_GivenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Not_GivenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number} is {status} — nothing to request." |
*
*/
export const api_commercial_nothing_to_request: ((inputs: Api_Commercial_Nothing_To_RequestInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Nothing_To_RequestInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{supplier} v{version} is blocked from pricing: {reason}." |
*
*/
export const api_commercial_offer_blocked: ((inputs: Api_Commercial_Offer_BlockedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Offer_BlockedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Offer not found." |
*
*/
export const api_commercial_offer_not_found: ((inputs?: Api_Commercial_Offer_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Offer_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Offer {offer} is not on line {line}." |
*
*/
export const api_commercial_offer_not_on_line: ((inputs: Api_Commercial_Offer_Not_On_LineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Offer_Not_On_LineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{supplier} offers only {qty} {unit}." |
*
*/
export const api_commercial_offers_only: ((inputs: Api_Commercial_Offers_OnlyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Offers_OnlyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "On arrival" |
*
*/
export const api_commercial_on_arrival: ((inputs?: Api_Commercial_On_ArrivalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_On_ArrivalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{n} on hand · {place}" |
*
*/
export const api_commercial_on_hand: ((inputs: Api_Commercial_On_HandInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_On_HandInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "On-time {pct}%" |
*
*/
export const api_commercial_on_time: ((inputs: Api_Commercial_On_TimeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_On_TimeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Only an approved version can be sent." |
*
*/
export const api_commercial_only_approved_sent: ((inputs?: Api_Commercial_Only_Approved_SentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Only_Approved_SentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Only an approved version can be sent to the customer." |
*
*/
export const api_commercial_only_approved_to_customer: ((inputs?: Api_Commercial_Only_Approved_To_CustomerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Only_Approved_To_CustomerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Our RFQ" |
*
*/
export const api_commercial_our_rfq: ((inputs?: Api_Commercial_Our_RfqInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Our_RfqInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasLot | output |
* | --- | --- |
* | "yes" | "Own stock (lot {lot}) — reserve now, Golden Sea truck" |
* | * | "Own stock — reserve now, Golden Sea truck" |
*
*/
export const api_commercial_own_stock_flag: ((inputs: Api_Commercial_Own_Stock_FlagInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Own_Stock_FlagInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Own stock (average cost)" |
*
*/
export const api_commercial_own_stock_terms: ((inputs?: Api_Commercial_Own_Stock_TermsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Own_Stock_TermsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "pack" |
*
*/
export const api_commercial_pack: ((inputs?: Api_Commercial_PackInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_PackInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pack size: {offered} instead of {requested} — written customer acceptance needed" |
*
*/
export const api_commercial_pack_size: ((inputs: Api_Commercial_Pack_SizeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Pack_SizeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The payment is already recorded — the decision can't be withdrawn." |
*
*/
export const api_commercial_payment_recorded_cant_withdraw: ((inputs?: Api_Commercial_Payment_Recorded_Cant_WithdrawInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Payment_Recorded_Cant_WithdrawInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "90 days from invoice date" |
*
*/
export const api_commercial_payment_terms_default: ((inputs?: Api_Commercial_Payment_Terms_DefaultInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Payment_Terms_DefaultInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pending customer acceptance — alternative pack" |
*
*/
export const api_commercial_pending_acceptance: ((inputs?: Api_Commercial_Pending_AcceptanceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Pending_AcceptanceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number} entered in the customer's procurement portal by {name}." |
*
*/
export const api_commercial_portal_activity: ((inputs: Api_Commercial_Portal_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Portal_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "AI compared the portal screenshot with {number}: 1 difference (payment terms). Submission not marked complete." |
*
*/
export const api_commercial_portal_check_activity: ((inputs: Api_Commercial_Portal_Check_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Portal_Check_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "60 days (portal default)" |
*
*/
export const api_commercial_portal_default_terms: ((inputs?: Api_Commercial_Portal_Default_TermsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Portal_Default_TermsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier price expired — reconfirm" |
*
*/
export const api_commercial_price_expired: ((inputs?: Api_Commercial_Price_ExpiredInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Price_ExpiredInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Purchasing department" |
*
*/
export const api_commercial_purchasing_department: ((inputs?: Api_Commercial_Purchasing_DepartmentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Purchasing_DepartmentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quantity shortfall: covers {pct}% of the request" |
*
*/
export const api_commercial_quantity_shortfall: ((inputs: Api_Commercial_Quantity_ShortfallInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Quantity_ShortfallInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quotation not found." |
*
*/
export const api_commercial_quotation_not_found: ((inputs?: Api_Commercial_Quotation_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Quotation_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quote margin {margin}% is below the {min}% minimum" |
*
*/
export const api_commercial_quote_margin_below: ((inputs: Api_Commercial_Quote_Margin_BelowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Quote_Margin_BelowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number} is {status} with this selection — revise the quotation instead." |
*
*/
export const api_commercial_quoted_with_selection: ((inputs: Api_Commercial_Quoted_With_SelectionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Quoted_With_SelectionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Rejected on technical check" |
*
*/
export const api_commercial_rejected_technical: ((inputs?: Api_Commercial_Rejected_TechnicalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Rejected_TechnicalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "replies ~{hours} h" |
*
*/
export const api_commercial_replies_in: ((inputs: Api_Commercial_Replies_InInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Replies_InInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{name} requested approval of {number} ({type})." |
*
*/
export const api_commercial_requested_activity: ((inputs: Api_Commercial_Requested_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Requested_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Returned: {title}" |
*
*/
export const api_commercial_returned_title: ((inputs: Api_Commercial_Returned_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Returned_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number} is {status} — revise the latest version instead." |
*
*/
export const api_commercial_revise_latest: ((inputs: Api_Commercial_Revise_LatestInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Revise_LatestInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Revise pricing — returned by {name}: {reason}" |
*
*/
export const api_commercial_revise_pricing: ((inputs: Api_Commercial_Revise_PricingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Revise_PricingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{next} created from {from} (kept for audit)." |
*
*/
export const api_commercial_revised_activity: ((inputs: Api_Commercial_Revised_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Revised_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Revision: {reason}" |
*
*/
export const api_commercial_revision_remark: ((inputs: Api_Commercial_Revision_RemarkInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Revision_RemarkInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Costs and margins are hidden for your role." |
*
*/
export const api_commercial_sales_hidden: ((inputs?: Api_Commercial_Sales_HiddenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Sales_HiddenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Select the alternative offer first." |
*
*/
export const api_commercial_select_alternative_first: ((inputs?: Api_Commercial_Select_Alternative_FirstInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Select_Alternative_FirstInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Select offers for at least one line first." |
*
*/
export const api_commercial_select_offers_first: ((inputs?: Api_Commercial_Select_Offers_FirstInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Select_Offers_FirstInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasReason | output |
* | --- | --- |
* | "yes" | "L{line}: selected {names} — {reason}." |
* | * | "L{line}: selected {names} (best fit)." |
*
*/
export const api_commercial_selected_activity: ((inputs: Api_Commercial_Selected_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Selected_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Line {line} has been selected again since — nothing to take back." |
*
*/
export const api_commercial_selected_again: ((inputs: Api_Commercial_Selected_AgainInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Selected_AgainInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Selected {total} of {qty} {unit} — split the rest to another offer." |
*
*/
export const api_commercial_selected_of: ((inputs: Api_Commercial_Selected_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Selected_OfInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Send {number} to the customer" |
*
*/
export const api_commercial_send_to_customer: ((inputs: Api_Commercial_Send_To_CustomerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Send_To_CustomerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sent — awaiting corrected offer" |
*
*/
export const api_commercial_sent_awaiting_corrected: ((inputs?: Api_Commercial_Sent_Awaiting_CorrectedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Sent_Awaiting_CorrectedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Shelf life: {left} months left, vessel asked for {need}" |
*
*/
export const api_commercial_shelf_life: ((inputs: Api_Commercial_Shelf_LifeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Shelf_LifeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Shelf life below the vessel's requirement" |
*
*/
export const api_commercial_shelf_life_below: ((inputs?: Api_Commercial_Shelf_Life_BelowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Shelf_Life_BelowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Someone decided after you — the request has moved on." |
*
*/
export const api_commercial_someone_decided_after: ((inputs?: Api_Commercial_Someone_Decided_AfterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Someone_Decided_AfterInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Split sourcing: {parts}" |
*
*/
export const api_commercial_split_sourcing: ((inputs: Api_Commercial_Split_SourcingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Split_SourcingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Superseded by v{version} — kept for audit" |
*
*/
export const api_commercial_superseded_by: ((inputs: Api_Commercial_Superseded_ByInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Superseded_ByInputs, { locale?: "en" | "ar" }, {}>;
/**
* | accepted | output |
* | --- | --- |
* | "yes" | "{description} — supplied as {pack} (alternative pack, accepted)" |
* | * | "{description} — supplied as {pack} (alternative pack)" |
*
*/
export const api_commercial_supplied_as: ((inputs: Api_Commercial_Supplied_AsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Supplied_AsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "supplier" |
*
*/
export const api_commercial_supplier_word: ((inputs?: Api_Commercial_Supplier_WordInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Supplier_WordInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Line {line}: selection taken back" |
*
*/
export const api_commercial_taken_back: ((inputs: Api_Commercial_Taken_BackInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Taken_BackInputs, { locale?: "en" | "ar" }, {}>;
/**
* | earlier | output |
* | --- | --- |
* | "yes" | "L{line}: selection taken back by {name} — the earlier selection applies again." |
* | * | "L{line}: selection taken back by {name}." |
*
*/
export const api_commercial_taken_back_activity: ((inputs: Api_Commercial_Taken_Back_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Taken_Back_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "terms tbc" |
*
*/
export const api_commercial_terms_tbc: ((inputs?: Api_Commercial_Terms_TbcInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Terms_TbcInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "the customer" |
*
*/
export const api_commercial_the_customer: ((inputs?: Api_Commercial_The_CustomerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_The_CustomerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Tight: ready on the ETA day" |
*
*/
export const api_commercial_tight_eta: ((inputs?: Api_Commercial_Tight_EtaInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Tight_EtaInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Truck {from} → {port}" |
*
*/
export const api_commercial_truck_lane: ((inputs: Api_Commercial_Truck_LaneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Truck_LaneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Unknown action." |
*
*/
export const api_commercial_unknown_action: ((inputs?: Api_Commercial_Unknown_ActionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Unknown_ActionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Unknown decision." |
*
*/
export const api_commercial_unknown_decision: ((inputs?: Api_Commercial_Unknown_DecisionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Unknown_DecisionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | approval | output |
* | --- | --- |
* | "yes" | "{name} withdrew their approval of “{title}” — it is waiting for a decision again." |
* | * | "{name} withdrew their return of “{title}” — it is waiting for a decision again." |
*
*/
export const api_commercial_withdrew_activity: ((inputs: Api_Commercial_Withdrew_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Withdrew_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Wrong brand / part: {brand} {partNo} only" |
*
*/
export const api_commercial_wrong_part: ((inputs: Api_Commercial_Wrong_PartInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Wrong_PartInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Your offer: {offered}. {detail}" |
*
*/
export const api_commercial_your_offer: ((inputs: Api_Commercial_Your_OfferInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Commercial_Your_OfferInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Median minutes to acknowledge an RFQ — automation live since 6 Oct" |
*
*/
export const api_control_room_ack_sub: ((inputs?: Api_Control_Room_Ack_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Ack_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Acknowledgement time" |
*
*/
export const api_control_room_ack_title: ((inputs?: Api_Control_Room_Ack_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Ack_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Actual" |
*
*/
export const api_control_room_actual: ((inputs?: Api_Control_Room_ActualInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_ActualInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Out-of-hours RFQs" |
*
*/
export const api_control_room_after_hours: ((inputs?: Api_Control_Room_After_HoursInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_After_HoursInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "RFQs outside Sun–Thu 08:00–17:00, routed to the on-duty person" |
*
*/
export const api_control_room_after_hours_sub: ((inputs?: Api_Control_Room_After_Hours_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_After_Hours_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Out-of-hours requests" |
*
*/
export const api_control_room_after_hours_title: ((inputs?: Api_Control_Room_After_Hours_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_After_Hours_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "All customers, by days past due" |
*
*/
export const api_control_room_ageing_sub: ((inputs?: Api_Control_Room_Ageing_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Ageing_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receivables ageing" |
*
*/
export const api_control_room_ageing_title: ((inputs?: Api_Control_Room_Ageing_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Ageing_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Avg time to quote" |
*
*/
export const api_control_room_avg_time_to_quote: ((inputs?: Api_Control_Room_Avg_Time_To_QuoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Avg_Time_To_QuoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{count} blocked or urgent" |
*
*/
export const api_control_room_blocked_or_urgent: ((inputs: Api_Control_Room_Blocked_Or_UrgentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Blocked_Or_UrgentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Expected customer receipts and committed supplier payments, next 8 weeks" |
*
*/
export const api_control_room_cash_sub: ((inputs?: Api_Control_Room_Cash_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Cash_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Cash in vs cash out" |
*
*/
export const api_control_room_cash_title: ((inputs?: Api_Control_Room_Cash_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Cash_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Conversion" |
*
*/
export const api_control_room_conversion: ((inputs?: Api_Control_Room_ConversionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_ConversionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Value of POs ÷ value quoted, by month the RFQ arrived (November still open)" |
*
*/
export const api_control_room_conversion_sub: ((inputs?: Api_Control_Room_Conversion_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Conversion_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Conversion by value" |
*
*/
export const api_control_room_conversion_title: ((inputs?: Api_Control_Room_Conversion_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Conversion_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{n} d" |
*
*/
export const api_control_room_days: ((inputs: Api_Control_Room_DaysInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_DaysInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Deliveries to vessels per week" |
*
*/
export const api_control_room_deliveries_sub: ((inputs?: Api_Control_Room_Deliveries_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Deliveries_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Deliveries by outcome" |
*
*/
export const api_control_room_deliveries_title: ((inputs?: Api_Control_Room_Deliveries_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Deliveries_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Who delivers on time, and how fast they answer" |
*
*/
export const api_control_room_delivery_sub: ((inputs?: Api_Control_Room_Delivery_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Delivery_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Delivery & suppliers" |
*
*/
export const api_control_room_delivery_title: ((inputs?: Api_Control_Room_Delivery_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Delivery_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Expected at quotation" |
*
*/
export const api_control_room_expected_at_quotation: ((inputs?: Api_Control_Room_Expected_At_QuotationInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Expected_At_QuotationInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Last 90 days, each step counted once" |
*
*/
export const api_control_room_funnel_sub: ((inputs?: Api_Control_Room_Funnel_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Funnel_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Conversion funnel" |
*
*/
export const api_control_room_funnel_title: ((inputs?: Api_Control_Room_Funnel_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Funnel_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "actual so far · {expected} expected at quotation" |
*
*/
export const api_control_room_gp_note: ((inputs: Api_Control_Room_Gp_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Gp_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Actual replaces estimates as costs are billed (November in progress)" |
*
*/
export const api_control_room_gp_sub: ((inputs?: Api_Control_Room_Gp_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Gp_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Gross profit: expected vs actual" |
*
*/
export const api_control_room_gp_title: ((inputs?: Api_Control_Room_Gp_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Gp_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Gross profit {month}" |
*
*/
export const api_control_room_gross_profit_month: ((inputs: Api_Control_Room_Gross_Profit_MonthInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Gross_Profit_MonthInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Inquiries" |
*
*/
export const api_control_room_inquiries: ((inputs?: Api_Control_Room_InquiriesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_InquiriesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "RFQ cases per week of receipt" |
*
*/
export const api_control_room_inquiries_chart_sub: ((inputs?: Api_Control_Room_Inquiries_Chart_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Inquiries_Chart_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Inquiries, quotes and wins" |
*
*/
export const api_control_room_inquiries_chart_title: ((inputs?: Api_Control_Room_Inquiries_Chart_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Inquiries_Chart_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Last 12 weeks" |
*
*/
export const api_control_room_last_12_weeks: ((inputs?: Api_Control_Room_Last_12_WeeksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Last_12_WeeksInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Last 4 weeks" |
*
*/
export const api_control_room_last_4_weeks: ((inputs?: Api_Control_Room_Last_4_WeeksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Last_4_WeeksInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Last 6 months" |
*
*/
export const api_control_room_last_6_months: ((inputs?: Api_Control_Room_Last_6_MonthsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Last_6_MonthsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Lost cases by recorded reason, last 90 days" |
*
*/
export const api_control_room_lost_sub: ((inputs?: Api_Control_Room_Lost_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Lost_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Why we lose" |
*
*/
export const api_control_room_lost_title: ((inputs?: Api_Control_Room_Lost_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Lost_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Gross margin, last 90 days · minimum 15%" |
*
*/
export const api_control_room_margin_source_sub: ((inputs?: Api_Control_Room_Margin_Source_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Margin_Source_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Margin by source" |
*
*/
export const api_control_room_margin_source_title: ((inputs?: Api_Control_Room_Margin_Source_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Margin_Source_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Actual gross margin, last 90 days · minimum 15%" |
*
*/
export const api_control_room_margin_store_sub: ((inputs?: Api_Control_Room_Margin_Store_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Margin_Store_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Margin by store" |
*
*/
export const api_control_room_margin_store_title: ((inputs?: Api_Control_Room_Margin_Store_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Margin_Store_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Median days" |
*
*/
export const api_control_room_median_days: ((inputs?: Api_Control_Room_Median_DaysInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Median_DaysInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Minutes" |
*
*/
export const api_control_room_minutes: ((inputs?: Api_Control_Room_MinutesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_MinutesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Management and finance only" |
*
*/
export const api_control_room_money_sub: ((inputs?: Api_Control_Room_Money_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Money_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Profit & cash" |
*
*/
export const api_control_room_money_title: ((inputs?: Api_Control_Room_Money_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Money_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "nothing over 30 days" |
*
*/
export const api_control_room_nothing_over_30_days: ((inputs?: Api_Control_Room_Nothing_Over_30_DaysInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Nothing_Over_30_DaysInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} open invoice" |
* | * | "{count} open invoices" |
*
*/
export const api_control_room_open_invoices: ((inputs: Api_Control_Room_Open_InvoicesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Open_InvoicesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open RFQs" |
*
*/
export const api_control_room_open_rfqs: ((inputs?: Api_Control_Room_Open_RfqsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Open_RfqsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{amount} over 30 days" |
*
*/
export const api_control_room_over_30_days: ((inputs: Api_Control_Room_Over_30_DaysInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Over_30_DaysInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{overdue} of {total} overdue" |
*
*/
export const api_control_room_overdue_of: ((inputs: Api_Control_Room_Overdue_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Overdue_OfInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Payments" |
*
*/
export const api_control_room_payments: ((inputs?: Api_Control_Room_PaymentsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_PaymentsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Inquiries to wins, and why we lose" |
*
*/
export const api_control_room_pipeline_sub: ((inputs?: Api_Control_Room_Pipeline_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Pipeline_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pipeline & conversion" |
*
*/
export const api_control_room_pipeline_title: ((inputs?: Api_Control_Room_Pipeline_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Pipeline_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quoted" |
*
*/
export const api_control_room_quoted: ((inputs?: Api_Control_Room_QuotedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_QuotedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receipts" |
*
*/
export const api_control_room_receipts: ((inputs?: Api_Control_Room_ReceiptsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_ReceiptsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receivables" |
*
*/
export const api_control_room_receivables: ((inputs?: Api_Control_Room_ReceivablesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_ReceivablesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open balances, all ages" |
*
*/
export const api_control_room_receivables_customer_sub: ((inputs?: Api_Control_Room_Receivables_Customer_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Receivables_Customer_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receivables by customer" |
*
*/
export const api_control_room_receivables_customer_title: ((inputs?: Api_Control_Room_Receivables_Customer_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Receivables_Customer_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receivables open" |
*
*/
export const api_control_room_receivables_open: ((inputs?: Api_Control_Room_Receivables_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Receivables_OpenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} supplier RFQ without a full reply" |
* | * | "{count} supplier RFQs without a full reply" |
*
*/
export const api_control_room_rfqs_without_reply: ((inputs: Api_Control_Room_Rfqs_Without_ReplyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Rfqs_Without_ReplyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Agency pricelists and own stock carry more margin than buying to order" |
*
*/
export const api_control_room_sales_source_sub: ((inputs?: Api_Control_Room_Sales_Source_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Sales_Source_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sales by source" |
*
*/
export const api_control_room_sales_source_title: ((inputs?: Api_Control_Room_Sales_Source_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Sales_Source_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "How fast we answer, and who carries the load" |
*
*/
export const api_control_room_speed_sub: ((inputs?: Api_Control_Room_Speed_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Speed_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Speed & workload" |
*
*/
export const api_control_room_speed_title: ((inputs?: Api_Control_Room_Speed_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Speed_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Target 1 d" |
*
*/
export const api_control_room_target_1_day: ((inputs?: Api_Control_Room_Target_1_DayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Target_1_DayInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Target 35%" |
*
*/
export const api_control_room_target_35: ((inputs?: Api_Control_Room_Target_35Inputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Target_35Inputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{currency} {n}k" |
*
*/
export const api_control_room_thousands: ((inputs: Api_Control_Room_ThousandsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_ThousandsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "was {was} d in September · target 1 d" |
*
*/
export const api_control_room_turnaround_note: ((inputs: Api_Control_Room_Turnaround_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Turnaround_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Median days from RFQ received to quote sent" |
*
*/
export const api_control_room_turnaround_sub: ((inputs?: Api_Control_Room_Turnaround_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Turnaround_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quote turnaround" |
*
*/
export const api_control_room_turnaround_title: ((inputs?: Api_Control_Room_Turnaround_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Turnaround_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Value won" |
*
*/
export const api_control_room_value_won: ((inputs?: Api_Control_Room_Value_WonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Value_WonInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer POs incl. partial awards" |
*
*/
export const api_control_room_value_won_sub: ((inputs?: Api_Control_Room_Value_Won_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Value_Won_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Value won per month" |
*
*/
export const api_control_room_value_won_title: ((inputs?: Api_Control_Room_Value_Won_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Value_Won_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Waiting on suppliers" |
*
*/
export const api_control_room_waiting_on_suppliers: ((inputs?: Api_Control_Room_Waiting_On_SuppliersInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Waiting_On_SuppliersInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Win rate" |
*
*/
export const api_control_room_win_rate: ((inputs?: Api_Control_Room_Win_RateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Win_RateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Won" |
*
*/
export const api_control_room_won: ((inputs?: Api_Control_Room_WonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_WonInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{won} won of {quoted} quoted, {period}" |
*
*/
export const api_control_room_won_of_quoted: ((inputs: Api_Control_Room_Won_Of_QuotedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Control_Room_Won_Of_QuotedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasNote | hasNext | output |
* | --- | --- | --- |
* | "yes" | "yes" | "{name}: {result} — {note}. Next: {step} ({due})." |
* | "yes" | * | "{name}: {result} — {note}. Stage: {stage}." |
* | * | "yes" | "{name}: {result}. Next: {step} ({due})." |
* | * | * | "{name}: {result}. Stage: {stage}." |
*
*/
export const api_growth_crm_activity: ((inputs: Api_Growth_Crm_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Growth_Crm_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Choose an outcome." |
*
*/
export const api_growth_crm_choose_outcome: ((inputs?: Api_Growth_Crm_Choose_OutcomeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Growth_Crm_Choose_OutcomeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer · {status}" |
*
*/
export const api_growth_crm_customer_relation: ((inputs: Api_Growth_Crm_Customer_RelationInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Growth_Crm_Customer_RelationInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The next step date isn't a date." |
*
*/
export const api_growth_crm_next_step_date_invalid: ((inputs?: Api_Growth_Crm_Next_Step_Date_InvalidInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Growth_Crm_Next_Step_Date_InvalidInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Opportunity not found." |
*
*/
export const api_growth_crm_opportunity_not_found: ((inputs?: Api_Growth_Crm_Opportunity_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Growth_Crm_Opportunity_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Outcome saved — next step “{step}” planned for {due}" |
*
*/
export const api_growth_crm_outcome_planned: ((inputs: Api_Growth_Crm_Outcome_PlannedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Growth_Crm_Outcome_PlannedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Outcome saved — {name} is now “{stage}”" |
*
*/
export const api_growth_crm_outcome_stage: ((inputs: Api_Growth_Crm_Outcome_StageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Growth_Crm_Outcome_StageInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Plan the next step and its date (or close the opportunity)." |
*
*/
export const api_growth_crm_plan_next_step: ((inputs?: Api_Growth_Crm_Plan_Next_StepInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Growth_Crm_Plan_Next_StepInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Prospect · {stage}" |
*
*/
export const api_growth_crm_prospect_relation: ((inputs: Api_Growth_Crm_Prospect_RelationInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Growth_Crm_Prospect_RelationInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{step} — {name}" |
*
*/
export const api_growth_crm_task_title: ((inputs: Api_Growth_Crm_Task_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Growth_Crm_Task_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Unknown stage." |
*
*/
export const api_growth_crm_unknown_stage: ((inputs?: Api_Growth_Crm_Unknown_StageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Growth_Crm_Unknown_StageInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "1–30 d" |
*
*/
export const api_history_age_1_30: ((inputs?: Api_History_Age_1_30Inputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_Age_1_30Inputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "31–60 d" |
*
*/
export const api_history_age_31_60: ((inputs?: Api_History_Age_31_60Inputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_Age_31_60Inputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "60+ d" |
*
*/
export const api_history_age_60_plus: ((inputs?: Api_History_Age_60_PlusInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_Age_60_PlusInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Agency pricelist" |
*
*/
export const api_history_agency_pricelist: ((inputs?: Api_History_Agency_PricelistInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_Agency_PricelistInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Awaiting corrected offer" |
*
*/
export const api_history_awaiting_corrected_offer: ((inputs?: Api_History_Awaiting_Corrected_OfferInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_Awaiting_Corrected_OfferInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Awaiting customer decision" |
*
*/
export const api_history_awaiting_customer_decision: ((inputs?: Api_History_Awaiting_Customer_DecisionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_Awaiting_Customer_DecisionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Awaiting delivery or payment" |
*
*/
export const api_history_awaiting_delivery_or_payment: ((inputs?: Api_History_Awaiting_Delivery_Or_PaymentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_Awaiting_Delivery_Or_PaymentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Awaiting internal approval" |
*
*/
export const api_history_awaiting_internal_approval: ((inputs?: Api_History_Awaiting_Internal_ApprovalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_Awaiting_Internal_ApprovalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Awaiting supplier" |
*
*/
export const api_history_awaiting_supplier: ((inputs?: Api_History_Awaiting_SupplierInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_Awaiting_SupplierInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Bought to order" |
*
*/
export const api_history_bought_to_order: ((inputs?: Api_History_Bought_To_OrderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_Bought_To_OrderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Cabin stores" |
*
*/
export const api_history_cabin_stores: ((inputs?: Api_History_Cabin_StoresInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_Cabin_StoresInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Cancelled" |
*
*/
export const api_history_cancelled: ((inputs?: Api_History_CancelledInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_CancelledInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Deck stores" |
*
*/
export const api_history_deck_stores: ((inputs?: Api_History_Deck_StoresInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_Deck_StoresInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Electrical stores" |
*
*/
export const api_history_electrical_stores: ((inputs?: Api_History_Electrical_StoresInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_Electrical_StoresInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Engine stores" |
*
*/
export const api_history_engine_stores: ((inputs?: Api_History_Engine_StoresInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_Engine_StoresInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Inquiries received" |
*
*/
export const api_history_inquiries_received: ((inputs?: Api_History_Inquiries_ReceivedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_Inquiries_ReceivedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Late" |
*
*/
export const api_history_late: ((inputs?: Api_History_LateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_LateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Late quote" |
*
*/
export const api_history_late_quote: ((inputs?: Api_History_Late_QuoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_Late_QuoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Lead time" |
*
*/
export const api_history_lead_time: ((inputs?: Api_History_Lead_TimeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_Lead_TimeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No supplier" |
*
*/
export const api_history_no_supplier: ((inputs?: Api_History_No_SupplierInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_No_SupplierInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Not due" |
*
*/
export const api_history_not_due: ((inputs?: Api_History_Not_DueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_Not_DueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "On time" |
*
*/
export const api_history_on_time: ((inputs?: Api_History_On_TimeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_On_TimeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Own stock" |
*
*/
export const api_history_own_stock: ((inputs?: Api_History_Own_StockInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_Own_StockInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Partial" |
*
*/
export const api_history_partial: ((inputs?: Api_History_PartialInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_PartialInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Price" |
*
*/
export const api_history_price: ((inputs?: Api_History_PriceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_PriceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Provision stores" |
*
*/
export const api_history_provision_stores: ((inputs?: Api_History_Provision_StoresInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_Provision_StoresInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quoted" |
*
*/
export const api_history_quoted: ((inputs?: Api_History_QuotedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_QuotedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Safety stores" |
*
*/
export const api_history_safety_stores: ((inputs?: Api_History_Safety_StoresInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_Safety_StoresInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sent to suppliers" |
*
*/
export const api_history_sent_to_suppliers: ((inputs?: Api_History_Sent_To_SuppliersInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_Sent_To_SuppliersInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Spare-parts clearance (fees)" |
*
*/
export const api_history_spare_parts_clearance: ((inputs?: Api_History_Spare_Parts_ClearanceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_Spare_Parts_ClearanceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Validated" |
*
*/
export const api_history_validated: ((inputs?: Api_History_ValidatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_ValidatedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Won (full or partial)" |
*
*/
export const api_history_won_full_or_partial: ((inputs?: Api_History_Won_Full_Or_PartialInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_History_Won_Full_Or_PartialInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "4 weeks ago" |
*
*/
export const api_home_4_weeks_ago: ((inputs?: Api_Home_4_Weeks_AgoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_4_Weeks_AgoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Median minutes · automatic acknowledgement went live 6 Oct" |
*
*/
export const api_home_ack_sub: ((inputs?: Api_Home_Ack_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Ack_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Time to acknowledge an RFQ" |
*
*/
export const api_home_ack_title: ((inputs?: Api_Home_Ack_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Ack_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Actual" |
*
*/
export const api_home_actual: ((inputs?: Api_Home_ActualInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_ActualInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "RFQs outside Sun–Thu 08:00–17:00, routed to the on-call person" |
*
*/
export const api_home_after_hours_sub: ((inputs?: Api_Home_After_Hours_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_After_Hours_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Out-of-hours requests" |
*
*/
export const api_home_after_hours_title: ((inputs?: Api_Home_After_Hours_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_After_Hours_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "All cases" |
*
*/
export const api_home_all_cases: ((inputs?: Api_Home_All_CasesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_All_CasesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "All live cases" |
*
*/
export const api_home_all_live_cases: ((inputs?: Api_Home_All_Live_CasesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_All_Live_CasesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{amount} vs {than}" |
*
*/
export const api_home_amount_vs: ((inputs: Api_Home_Amount_VsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Amount_VsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | nPlural | output |
* | --- | --- |
* | "one" | "{n} approval in the queue" |
* | * | "{n} approvals in the queue" |
*
*/
export const api_home_approvals_in_queue: ((inputs: Api_Home_Approvals_In_QueueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Approvals_In_QueueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{vessel} arrives" |
*
*/
export const api_home_arrives: ((inputs: Api_Home_ArrivesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_ArrivesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{vessel} arrives {when}" |
*
*/
export const api_home_arrives_when: ((inputs: Api_Home_Arrives_WhenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Arrives_WhenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{n} awaiting the customer" |
*
*/
export const api_home_awaiting_customer: ((inputs: Api_Home_Awaiting_CustomerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Awaiting_CustomerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{supplier}: bill due" |
*
*/
export const api_home_bill_due: ((inputs: Api_Home_Bill_DueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Bill_DueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{n}k billed so far" |
*
*/
export const api_home_billed_so_far: ((inputs: Api_Home_Billed_So_FarInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Billed_So_FarInputs, { locale?: "en" | "ar" }, {}>;
/**
* | nPlural | output |
* | --- | --- |
* | "one" | "{n} bill to match" |
* | * | "{n} bills to match" |
*
*/
export const api_home_bills_to_match: ((inputs: Api_Home_Bills_To_MatchInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Bills_To_MatchInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Prepared at 07:00 from your cases, inbox and integrations" |
*
*/
export const api_home_briefing_sub: ((inputs?: Api_Home_Briefing_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Briefing_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | nPlural | output |
* | --- | --- |
* | "one" | "{n} case in your queue" |
* | * | "{n} cases in your queue" |
*
*/
export const api_home_cases_in_queue: ((inputs: Api_Home_Cases_In_QueueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Cases_In_QueueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Expected customer receipts and committed supplier payments, EGP thousands" |
*
*/
export const api_home_cash_sub: ((inputs?: Api_Home_Cash_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Cash_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Cash in vs cash out, next 8 weeks" |
*
*/
export const api_home_cash_title: ((inputs?: Api_Home_Cash_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Cash_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Commitment blocked until the PO matches the approved quote." |
*
*/
export const api_home_commitment_blocked: ((inputs?: Api_Home_Commitment_BlockedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Commitment_BlockedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Continue {caseId}" |
*
*/
export const api_home_continue: ((inputs: Api_Home_ContinueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_ContinueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Daily briefing" |
*
*/
export const api_home_daily_briefing: ((inputs?: Api_Home_Daily_BriefingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Daily_BriefingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{n} d" |
*
*/
export const api_home_days: ((inputs: Api_Home_DaysInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_DaysInputs, { locale?: "en" | "ar" }, {}>;
/**
* | nPlural | output |
* | --- | --- |
* | "one" | "{n} decision waiting" |
* | * | "{n} decisions waiting" |
*
*/
export const api_home_decisions_waiting: ((inputs: Api_Home_Decisions_WaitingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Decisions_WaitingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Deliveries" |
*
*/
export const api_home_deliveries: ((inputs?: Api_Home_DeliveriesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_DeliveriesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | nPlural | output |
* | --- | --- |
* | "one" | "{n} delivery in progress" |
* | * | "{n} deliveries in progress" |
*
*/
export const api_home_deliveries_in_progress: ((inputs: Api_Home_Deliveries_In_ProgressInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Deliveries_In_ProgressInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Deliveries in progress" |
*
*/
export const api_home_deliveries_in_progress_label: ((inputs?: Api_Home_Deliveries_In_Progress_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Deliveries_In_Progress_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Drop {number} leaves" |
*
*/
export const api_home_drop_leaves: ((inputs: Api_Home_Drop_LeavesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Drop_LeavesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Expected" |
*
*/
export const api_home_expected: ((inputs?: Api_Home_ExpectedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_ExpectedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Expected gross profit, Nov" |
*
*/
export const api_home_expected_gp_nov: ((inputs?: Api_Home_Expected_Gp_NovInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Expected_Gp_NovInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Follow-ups" |
*
*/
export const api_home_follow_ups: ((inputs?: Api_Home_Follow_UpsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Follow_UpsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | nPlural | output |
* | --- | --- |
* | "one" | "{n} follow-up due today" |
* | * | "{n} follow-ups due today" |
*
*/
export const api_home_follow_ups_due_today: ((inputs: Api_Home_Follow_Ups_Due_TodayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Follow_Ups_Due_TodayInputs, { locale?: "en" | "ar" }, {}>;
/**
* | nPlural | output |
* | --- | --- |
* | "one" | "{n} follow-up today" |
* | * | "{n} follow-ups today" |
*
*/
export const api_home_follow_ups_today: ((inputs: Api_Home_Follow_Ups_TodayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Follow_Ups_TodayInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Good morning, {name}" |
*
*/
export const api_home_good_morning: ((inputs: Api_Home_Good_MorningInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Good_MorningInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "EGP thousands · actual replaces estimates as costs are billed (Nov in progress)" |
*
*/
export const api_home_gp_sub: ((inputs?: Api_Home_Gp_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Gp_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Gross profit: expected vs actual" |
*
*/
export const api_home_gp_title: ((inputs?: Api_Home_Gp_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Gp_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "in {in}k · out {out}k" |
*
*/
export const api_home_in_out: ((inputs: Api_Home_In_OutInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_In_OutInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Inquiries" |
*
*/
export const api_home_inquiries: ((inputs?: Api_Home_InquiriesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_InquiriesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Inquiries, last 4 weeks" |
*
*/
export const api_home_inquiries_4_weeks: ((inputs?: Api_Home_Inquiries_4_WeeksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Inquiries_4_WeeksInputs, { locale?: "en" | "ar" }, {}>;
/**
* | nPlural | output |
* | --- | --- |
* | "one" | "{n} integration exception" |
* | * | "{n} integration exceptions" |
*
*/
export const api_home_integration_exceptions: ((inputs: Api_Home_Integration_ExceptionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Integration_ExceptionsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{customer}: {amount} due {day}" |
*
*/
export const api_home_invoice_due: ((inputs: Api_Home_Invoice_DueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Invoice_DueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{customer}: invoice due" |
*
*/
export const api_home_invoice_due_short: ((inputs: Api_Home_Invoice_Due_ShortInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Invoice_Due_ShortInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number} · {status} · collection reminder drafted" |
*
*/
export const api_home_invoice_sub: ((inputs: Api_Home_Invoice_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Invoice_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number} · {status} · {paid} received · collection reminder drafted" |
*
*/
export const api_home_invoice_sub_paid: ((inputs: Api_Home_Invoice_Sub_PaidInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Invoice_Sub_PaidInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Invoices" |
*
*/
export const api_home_invoices: ((inputs?: Api_Home_InvoicesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_InvoicesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} item awaiting approval" |
* | * | "{count} items awaiting approval" |
*
*/
export const api_home_items_awaiting_approval: ((inputs: Api_Home_Items_Awaiting_ApprovalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Items_Awaiting_ApprovalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{n}k past due" |
*
*/
export const api_home_k_past_due: ((inputs: Api_Home_K_Past_DueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_K_Past_DueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "last week" |
*
*/
export const api_home_last_week: ((inputs?: Api_Home_Last_WeekInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Last_WeekInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{n} later this week" |
*
*/
export const api_home_later_this_week: ((inputs: Api_Home_Later_This_WeekInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Later_This_WeekInputs, { locale?: "en" | "ar" }, {}>;
/**
* | nPlural | output |
* | --- | --- |
* | "one" | "{n} live case" |
* | * | "{n} live cases" |
*
*/
export const api_home_live_cases: ((inputs: Api_Home_Live_CasesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Live_CasesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Lost cases" |
*
*/
export const api_home_lost_cases: ((inputs?: Api_Home_Lost_CasesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Lost_CasesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Lost cases by recorded reason, last 90 days" |
*
*/
export const api_home_lost_sub: ((inputs?: Api_Home_Lost_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Lost_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Why we lose" |
*
*/
export const api_home_lost_title: ((inputs?: Api_Home_Lost_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Lost_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Median days" |
*
*/
export const api_home_median_days: ((inputs?: Api_Home_Median_DaysInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Median_DaysInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "median, new RFQs" |
*
*/
export const api_home_median_new_rfqs: ((inputs?: Api_Home_Median_New_RfqsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Median_New_RfqsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "median · target 1 d" |
*
*/
export const api_home_median_target: ((inputs?: Api_Home_Median_TargetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Median_TargetInputs, { locale?: "en" | "ar" }, {}>;
/**
* | nPlural | output |
* | --- | --- |
* | "one" | "{n} message to triage" |
* | * | "{n} messages to triage" |
*
*/
export const api_home_messages_to_triage: ((inputs: Api_Home_Messages_To_TriageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Messages_To_TriageInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{n} min" |
*
*/
export const api_home_minutes: ((inputs: Api_Home_MinutesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_MinutesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Minutes" |
*
*/
export const api_home_minutes_series: ((inputs?: Api_Home_Minutes_SeriesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Minutes_SeriesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "My day · {date}" |
*
*/
export const api_home_my_day: ((inputs: Api_Home_My_DayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_My_DayInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "My quote turnaround" |
*
*/
export const api_home_my_turnaround: ((inputs?: Api_Home_My_TurnaroundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_My_TurnaroundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Median days, last 8 weeks" |
*
*/
export const api_home_my_turnaround_sub: ((inputs?: Api_Home_My_Turnaround_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_My_Turnaround_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{n} today" |
*
*/
export const api_home_n_today: ((inputs: Api_Home_N_TodayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_N_TodayInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Net cash, next 8 weeks" |
*
*/
export const api_home_net_cash: ((inputs?: Api_Home_Net_CashInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Net_CashInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "New case" |
*
*/
export const api_home_new_case: ((inputs?: Api_Home_New_CaseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_New_CaseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} new message in the inbox" |
* | * | "{count} new messages in the inbox" |
*
*/
export const api_home_new_messages: ((inputs: Api_Home_New_MessagesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_New_MessagesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Next up" |
*
*/
export const api_home_next_up: ((inputs?: Api_Home_Next_UpInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Next_UpInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "no change" |
*
*/
export const api_home_no_change: ((inputs?: Api_Home_No_ChangeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_No_ChangeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing due today" |
*
*/
export const api_home_nothing_due_today: ((inputs?: Api_Home_Nothing_Due_TodayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Nothing_Due_TodayInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing due this week." |
*
*/
export const api_home_nothing_due_week: ((inputs?: Api_Home_Nothing_Due_WeekInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Nothing_Due_WeekInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing needs you this morning." |
*
*/
export const api_home_nothing_needs_you: ((inputs?: Api_Home_Nothing_Needs_YouInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Nothing_Needs_YouInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open approvals" |
*
*/
export const api_home_open_approvals: ((inputs?: Api_Home_Open_ApprovalsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Open_ApprovalsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Out-of-hours RFQs" |
*
*/
export const api_home_out_of_hours_rfqs: ((inputs?: Api_Home_Out_Of_Hours_RfqsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Out_Of_Hours_RfqsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Payments" |
*
*/
export const api_home_payments: ((inputs?: Api_Home_PaymentsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_PaymentsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pipeline" |
*
*/
export const api_home_pipeline: ((inputs?: Api_Home_PipelineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_PipelineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | nPlural | output |
* | --- | --- |
* | "one" | "{n} pipeline step this week" |
* | * | "{n} pipeline steps this week" |
*
*/
export const api_home_pipeline_steps_week: ((inputs: Api_Home_Pipeline_Steps_WeekInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Pipeline_Steps_WeekInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "RFQ cases per week of receipt, last 12 weeks" |
*
*/
export const api_home_pipeline_sub: ((inputs?: Api_Home_Pipeline_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Pipeline_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Inquiries, quotes and wins" |
*
*/
export const api_home_pipeline_title: ((inputs?: Api_Home_Pipeline_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Pipeline_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer PO mismatch on {caseId}" |
*
*/
export const api_home_po_mismatch: ((inputs: Api_Home_Po_MismatchInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Po_MismatchInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{vessel}: quote due" |
*
*/
export const api_home_quote_due: ((inputs: Api_Home_Quote_DueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Quote_DueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{vessel} quote due {when}" |
*
*/
export const api_home_quote_due_when: ((inputs: Api_Home_Quote_Due_WhenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Quote_Due_WhenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{vessel} quote {when}" |
*
*/
export const api_home_quote_late: ((inputs: Api_Home_Quote_LateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Quote_LateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quote turnaround" |
*
*/
export const api_home_quote_turnaround: ((inputs?: Api_Home_Quote_TurnaroundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Quote_TurnaroundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quoted" |
*
*/
export const api_home_quoted: ((inputs?: Api_Home_QuotedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_QuotedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | nPlural | output |
* | --- | --- |
* | "one" | "{n} quote due by tomorrow" |
* | * | "{n} quotes due by tomorrow" |
*
*/
export const api_home_quotes_due_tomorrow: ((inputs: Api_Home_Quotes_Due_TomorrowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Quotes_Due_TomorrowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receipts" |
*
*/
export const api_home_receipts: ((inputs?: Api_Home_ReceiptsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_ReceiptsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receivables" |
*
*/
export const api_home_receivables: ((inputs?: Api_Home_ReceivablesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_ReceivablesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receivables by age" |
*
*/
export const api_home_receivables_by_age: ((inputs?: Api_Home_Receivables_By_AgeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Receivables_By_AgeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "reminder drafted" |
*
*/
export const api_home_reminder_drafted: ((inputs?: Api_Home_Reminder_DraftedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Reminder_DraftedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{supplier}: reply due" |
*
*/
export const api_home_reply_due: ((inputs: Api_Home_Reply_DueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Reply_DueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Review inbox" |
*
*/
export const api_home_review_inbox: ((inputs?: Api_Home_Review_InboxInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Review_InboxInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "RFQs" |
*
*/
export const api_home_rfqs: ((inputs?: Api_Home_RfqsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_RfqsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | nPlural | output |
* | --- | --- |
* | "one" | "{n} supplier RFQ awaiting reply" |
* | * | "{n} supplier RFQs awaiting reply" |
*
*/
export const api_home_rfqs_awaiting_reply: ((inputs: Api_Home_Rfqs_Awaiting_ReplyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Rfqs_Awaiting_ReplyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{impact} · safe retry available" |
*
*/
export const api_home_safe_retry: ((inputs: Api_Home_Safe_RetryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Safe_RetryInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "same as {than}" |
*
*/
export const api_home_same_as: ((inputs: Api_Home_Same_AsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Same_AsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier bills" |
*
*/
export const api_home_supplier_bills: ((inputs?: Api_Home_Supplier_BillsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Supplier_BillsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | nPlural | output |
* | --- | --- |
* | "one" | "{n} supplier bill open" |
* | * | "{n} supplier bills open" |
*
*/
export const api_home_supplier_bills_open: ((inputs: Api_Home_Supplier_Bills_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Supplier_Bills_OpenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | nPlural | output |
* | --- | --- |
* | "one" | "{n} supplier reply outstanding" |
* | * | "{n} supplier replies outstanding" |
*
*/
export const api_home_supplier_replies_outstanding: ((inputs: Api_Home_Supplier_Replies_OutstandingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Supplier_Replies_OutstandingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{supplier} hasn't replied" |
*
*/
export const api_home_supplier_silent: ((inputs: Api_Home_Supplier_SilentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Supplier_SilentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Target 1 d" |
*
*/
export const api_home_target_1_day: ((inputs?: Api_Home_Target_1_DayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Target_1_DayInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "this week, vs last week" |
*
*/
export const api_home_this_week_vs_last: ((inputs?: Api_Home_This_Week_Vs_LastInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_This_Week_Vs_LastInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{currency} {n}k" |
*
*/
export const api_home_thousands: ((inputs: Api_Home_ThousandsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_ThousandsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Time to acknowledge" |
*
*/
export const api_home_time_to_acknowledge: ((inputs?: Api_Home_Time_To_AcknowledgeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Time_To_AcknowledgeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Today" |
*
*/
export const api_home_today: ((inputs?: Api_Home_TodayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_TodayInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Median days from RFQ received to quote sent" |
*
*/
export const api_home_turnaround_sub: ((inputs?: Api_Home_Turnaround_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Turnaround_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quotation turnaround" |
*
*/
export const api_home_turnaround_title: ((inputs?: Api_Home_Turnaround_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Turnaround_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "USD {n}k past due" |
*
*/
export const api_home_usd_past_due: ((inputs: Api_Home_Usd_Past_DueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Usd_Past_DueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "USD thousands, all customers" |
*
*/
export const api_home_usd_thousands_all: ((inputs?: Api_Home_Usd_Thousands_AllInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Usd_Thousands_AllInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Value won" |
*
*/
export const api_home_value_won: ((inputs?: Api_Home_Value_WonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Value_WonInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer POs incl. partial awards, USD thousands" |
*
*/
export const api_home_value_won_sub: ((inputs?: Api_Home_Value_Won_SubInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Value_Won_SubInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Value won per month" |
*
*/
export const api_home_value_won_title: ((inputs?: Api_Home_Value_Won_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Value_Won_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "vs prior 4 weeks" |
*
*/
export const api_home_vs_prior_4_weeks: ((inputs?: Api_Home_Vs_Prior_4_WeeksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Vs_Prior_4_WeeksInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{reference} was due {when} · {last}" |
*
*/
export const api_home_was_due: ((inputs: Api_Home_Was_DueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Was_DueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Won" |
*
*/
export const api_home_won: ((inputs?: Api_Home_WonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_WonInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Won, last 4 weeks" |
*
*/
export const api_home_won_4_weeks: ((inputs?: Api_Home_Won_4_WeeksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Home_Won_4_WeeksInputs, { locale?: "en" | "ar" }, {}>;
/**
* | daysPlural | output |
* | --- | --- |
* | "one" | "{days} day overdue" |
* | * | "{days} days overdue" |
*
*/
export const api_insights_shared_days_overdue: ((inputs: Api_Insights_Shared_Days_OverdueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Insights_Shared_Days_OverdueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | daysPlural | output |
* | --- | --- |
* | "one" | "in {days} day" |
* | * | "in {days} days" |
*
*/
export const api_insights_shared_in_days: ((inputs: Api_Insights_Shared_In_DaysInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Insights_Shared_In_DaysInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "You are not allowed to perform this action." |
*
*/
export const api_insights_shared_not_allowed: ((inputs?: Api_Insights_Shared_Not_AllowedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Insights_Shared_Not_AllowedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "overdue since {time}" |
*
*/
export const api_insights_shared_overdue_since: ((inputs: Api_Insights_Shared_Overdue_SinceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Insights_Shared_Overdue_SinceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "today {time}" |
*
*/
export const api_insights_shared_today_at: ((inputs: Api_Insights_Shared_Today_AtInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Insights_Shared_Today_AtInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "tomorrow {time}" |
*
*/
export const api_insights_shared_tomorrow_at: ((inputs: Api_Insights_Shared_Tomorrow_AtInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Insights_Shared_Tomorrow_AtInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Already accepted — not resubmitted." |
*
*/
export const api_operations_already_accepted: ((inputs?: Api_Operations_Already_AcceptedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Already_AcceptedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "PO {number} line {line} ({field}): {resolution} — evidence attached." |
*
*/
export const api_operations_amend_activity: ((inputs: Api_Operations_Amend_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Amend_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "As quoted" |
*
*/
export const api_operations_as_quoted: ((inputs?: Api_Operations_As_QuotedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_As_QuotedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Attach the customer's written confirmation (email or signed amendment)." |
*
*/
export const api_operations_attach_confirmation: ((inputs?: Api_Operations_Attach_ConfirmationInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Attach_ConfirmationInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasWas | output |
* | --- | --- |
* | "yes" | "Line {line}: “{outcome}” taken back — {was}." |
* | * | "Line {line}: “{outcome}” taken back — undecided again." |
*
*/
export const api_operations_award_undo_activity: ((inputs: Api_Operations_Award_Undo_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Award_Undo_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "A line goes back to undecided or kept open." |
*
*/
export const api_operations_back_to_undecided: ((inputs?: Api_Operations_Back_To_UndecidedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Back_To_UndecidedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Case not found." |
*
*/
export const api_operations_case_not_found: ((inputs?: Api_Operations_Case_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Case_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Closing an unawarded line needs a reason." |
*
*/
export const api_operations_closing_needs_reason: ((inputs?: Api_Operations_Closing_Needs_ReasonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Closing_Needs_ReasonInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Commitment blocked" |
*
*/
export const api_operations_commitment_blocked: ((inputs?: Api_Operations_Commitment_BlockedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Commitment_BlockedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Commitment blocked: {n} PO mismatch(es) need written customer agreement." |
*
*/
export const api_operations_commitment_blocked_by: ((inputs: Api_Operations_Commitment_Blocked_ByInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Commitment_Blocked_ByInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Confirm the sales order & prepare supplier POs" |
*
*/
export const api_operations_confirm_and_prepare: ((inputs?: Api_Operations_Confirm_And_PrepareInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Confirm_And_PrepareInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Confirm the sales order" |
*
*/
export const api_operations_confirm_sales_order: ((inputs?: Api_Operations_Confirm_Sales_OrderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Confirm_Sales_OrderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Confirmed by phone" |
*
*/
export const api_operations_confirmed_by_phone: ((inputs?: Api_Operations_Confirmed_By_PhoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Confirmed_By_PhoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier costs are not visible to Sales." |
*
*/
export const api_operations_costs_hidden_sales: ((inputs?: Api_Operations_Costs_Hidden_SalesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Costs_Hidden_SalesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer PO not found." |
*
*/
export const api_operations_customer_po_not_found: ((inputs?: Api_Operations_Customer_Po_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Customer_Po_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Line {line} has been decided again since — nothing to take back." |
*
*/
export const api_operations_decided_again: ((inputs: Api_Operations_Decided_AgainInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Decided_AgainInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The sales order is confirmed and its supplier POs are prepared — the line's decision stands." |
*
*/
export const api_operations_decision_stands: ((inputs?: Api_Operations_Decision_StandsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Decision_StandsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number} delivered — signed by {signedBy}; signed delivery note attached." |
*
*/
export const api_operations_delivered_activity: ((inputs: Api_Operations_Delivered_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Delivered_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Delivery not found." |
*
*/
export const api_operations_delivery_not_found: ((inputs?: Api_Operations_Delivery_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Delivery_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Describe the customer's written agreement (who, when, what)." |
*
*/
export const api_operations_describe_agreement: ((inputs?: Api_Operations_Describe_AgreementInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Describe_AgreementInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number} signed and submitted." |
*
*/
export const api_operations_einvoice_submitted: ((inputs: Api_Operations_Einvoice_SubmittedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Einvoice_SubmittedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "E-invoice {number} signed and submitted to the tax authority (UUID {uuid})." |
*
*/
export const api_operations_einvoice_submitted_activity: ((inputs: Api_Operations_Einvoice_Submitted_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Einvoice_Submitted_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Tax authority: {number} is valid." |
*
*/
export const api_operations_einvoice_valid: ((inputs: Api_Operations_Einvoice_ValidInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Einvoice_ValidInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "E-invoice {number}: Valid (UUID {uuid})." |
*
*/
export const api_operations_einvoice_valid_activity: ((inputs: Api_Operations_Einvoice_Valid_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Einvoice_Valid_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "E-invoices are submitted by operations & finance." |
*
*/
export const api_operations_einvoices_by_finance: ((inputs?: Api_Operations_Einvoices_By_FinanceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Einvoices_By_FinanceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "ETA change from {from}: {was} → {now}. {email} Re-planned: {moved}; owner and management alerted." |
*
*/
export const api_operations_eta_change_activity: ((inputs: Api_Operations_Eta_Change_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Eta_Change_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "ETA moved {hours} h by agent — {n} drop(s) re-planned" |
*
*/
export const api_operations_eta_moved_blocker: ((inputs: Api_Operations_Eta_Moved_BlockerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Eta_Moved_BlockerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "ETA change {caseId}: {at}" |
*
*/
export const api_operations_eta_notification: ((inputs: Api_Operations_Eta_NotificationInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Eta_NotificationInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{n} drop(s) re-planned — re-confirm transport." |
*
*/
export const api_operations_eta_notification_detail: ((inputs: Api_Operations_Eta_Notification_DetailInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Eta_Notification_DetailInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "ETA already up to date — nothing re-planned." |
*
*/
export const api_operations_eta_up_to_date: ((inputs?: Api_Operations_Eta_Up_To_DateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Eta_Up_To_DateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "header" |
*
*/
export const api_operations_header: ((inputs?: Api_Operations_HeaderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_HeaderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Invoice {number} created from {delivery}: delivered quantities only ({lines})." |
*
*/
export const api_operations_invoice_created_activity: ((inputs: Api_Operations_Invoice_Created_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Invoice_Created_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Invoice {number} — delivered quantities only" |
*
*/
export const api_operations_invoice_delivered: ((inputs: Api_Operations_Invoice_DeliveredInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Invoice_DeliveredInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Invoice not found." |
*
*/
export const api_operations_invoice_not_found: ((inputs?: Api_Operations_Invoice_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Invoice_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Invoices are issued by operations & finance." |
*
*/
export const api_operations_invoices_by_finance: ((inputs?: Api_Operations_Invoices_By_FinanceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Invoices_By_FinanceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Choose to keep the line open or close it." |
*
*/
export const api_operations_keep_or_close: ((inputs?: Api_Operations_Keep_Or_CloseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Keep_Or_CloseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Line {line} is kept open again" |
*
*/
export const api_operations_kept_open_again: ((inputs: Api_Operations_Kept_Open_AgainInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Kept_Open_AgainInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Launch / boat" |
*
*/
export const api_operations_launch_boat: ((inputs?: Api_Operations_Launch_BoatInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Launch_BoatInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{launch} — re-booked for {at}" |
*
*/
export const api_operations_launch_rebooked: ((inputs: Api_Operations_Launch_RebookedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Launch_RebookedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Line {n}" |
*
*/
export const api_operations_line: ((inputs: Api_Operations_LineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_LineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "no changes" |
*
*/
export const api_operations_no_changes: ((inputs?: Api_Operations_No_ChangesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_No_ChangesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No customer PO on file." |
*
*/
export const api_operations_no_customer_po: ((inputs?: Api_Operations_No_Customer_PoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_No_Customer_PoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No customer PO has been received for this case yet." |
*
*/
export const api_operations_no_customer_po_yet: ((inputs?: Api_Operations_No_Customer_Po_YetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_No_Customer_Po_YetInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No ETA update from the agent for this case." |
*
*/
export const api_operations_no_eta_update: ((inputs?: Api_Operations_No_Eta_UpdateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_No_Eta_UpdateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "That check has no mismatch to resolve." |
*
*/
export const api_operations_no_mismatch: ((inputs?: Api_Operations_No_MismatchInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_No_MismatchInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No order book for this case." |
*
*/
export const api_operations_no_order_book: ((inputs?: Api_Operations_No_Order_BookInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_No_Order_BookInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasReason | output |
* | --- | --- |
* | "yes" | "Line {line} not awarded: {outcome} — {reason}." |
* | * | "Line {line} not awarded: {outcome}." |
*
*/
export const api_operations_not_awarded_activity: ((inputs: Api_Operations_Not_Awarded_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Not_Awarded_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "nothing open" |
*
*/
export const api_operations_nothing_open: ((inputs?: Api_Operations_Nothing_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Nothing_OpenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Only a delivery confirmed with a signed delivery note can be invoiced." |
*
*/
export const api_operations_only_confirmed_invoiced: ((inputs?: Api_Operations_Only_Confirmed_InvoicedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Only_Confirmed_InvoicedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sales order confirmed against PO {number}. {n} supplier PO(s) prepared for re-check and approval." |
*
*/
export const api_operations_order_confirmed_activity: ((inputs: Api_Operations_Order_Confirmed_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Order_Confirmed_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Purchase order not found." |
*
*/
export const api_operations_po_not_found: ((inputs?: Api_Operations_Po_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Po_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer PO {number} read by AI and checked against {caseId} quotation: {open} mismatch(es)." |
*
*/
export const api_operations_po_read_activity: ((inputs: Api_Operations_Po_Read_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Po_Read_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Re-check for {number}: {changes}." |
*
*/
export const api_operations_recheck_activity: ((inputs: Api_Operations_Recheck_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Recheck_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Availability & lead time" |
*
*/
export const api_operations_recheck_availability: ((inputs?: Api_Operations_Recheck_AvailabilityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Recheck_AvailabilityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier price" |
*
*/
export const api_operations_recheck_price: ((inputs?: Api_Operations_Recheck_PriceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Recheck_PriceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Re-check supplier costs, then approve supplier POs" |
*
*/
export const api_operations_recheck_then_approve: ((inputs?: Api_Operations_Recheck_Then_ApproveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Recheck_Then_ApproveInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Re-confirm truck, boarding staff and launch for {number} (ETA {hours} h)" |
*
*/
export const api_operations_reconfirm_task: ((inputs: Api_Operations_Reconfirm_TaskInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Reconfirm_TaskInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Rejected by the tax authority — buyer tax ID." |
*
*/
export const api_operations_rejected_tax_id: ((inputs?: Api_Operations_Rejected_Tax_IdInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Rejected_Tax_IdInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Resolve {n} PO mismatches before confirming the sales order" |
*
*/
export const api_operations_resolve_mismatches: ((inputs: Api_Operations_Resolve_MismatchesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Resolve_MismatchesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sign in first." |
*
*/
export const api_operations_sign_in_first: ((inputs?: Api_Operations_Sign_In_FirstInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Sign_In_FirstInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Submit {number} to the tax authority (e-invoice)" |
*
*/
export const api_operations_submit_einvoice: ((inputs: Api_Operations_Submit_EinvoiceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Submit_EinvoiceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Buyer tax registration number “{taxId}” not found (9 digits expected). Correct it and resubmit." |
*
*/
export const api_operations_tax_id_error: ((inputs: Api_Operations_Tax_Id_ErrorInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Tax_Id_ErrorInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Unchanged" |
*
*/
export const api_operations_unchanged: ((inputs?: Api_Operations_UnchangedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_UnchangedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Line {line} is undecided again" |
*
*/
export const api_operations_undecided_again: ((inputs: Api_Operations_Undecided_AgainInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Undecided_AgainInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Who signed the delivery note on board?" |
*
*/
export const api_operations_who_signed: ((inputs?: Api_Operations_Who_SignedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Operations_Who_SignedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "PO {number} · re-check done, no changes." |
*
*/
export const api_order_to_cash_approval_detail_clean: ((inputs: Api_Order_To_Cash_Approval_Detail_CleanInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Order_To_Cash_Approval_Detail_CleanInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "PO {number} · re-check done — changes flagged." |
*
*/
export const api_order_to_cash_approval_detail_flagged: ((inputs: Api_Order_To_Cash_Approval_Detail_FlaggedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Order_To_Cash_Approval_Detail_FlaggedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier PO {number} to {supplier}" |
*
*/
export const api_order_to_cash_approval_title: ((inputs: Api_Order_To_Cash_Approval_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Order_To_Cash_Approval_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Duplicate bill blocked — {reason}" |
*
*/
export const api_order_to_cash_duplicate_bill: ((inputs: Api_Order_To_Cash_Duplicate_BillInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Order_To_Cash_Duplicate_BillInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "ETA updated — {changed} drop(s) re-planned; owner and management alerted." |
*
*/
export const api_order_to_cash_eta_updated: ((inputs: Api_Order_To_Cash_Eta_UpdatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Order_To_Cash_Eta_UpdatedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number} created from {delivery} — delivered quantities only." |
*
*/
export const api_order_to_cash_invoice_created: ((inputs: Api_Order_To_Cash_Invoice_CreatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Order_To_Cash_Invoice_CreatedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number} created from the delivery — delivered quantities only." |
*
*/
export const api_order_to_cash_invoice_created_from_delivery: ((inputs: Api_Order_To_Cash_Invoice_Created_From_DeliveryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Order_To_Cash_Invoice_Created_From_DeliveryInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No supplier bill to book." |
*
*/
export const api_order_to_cash_no_bill: ((inputs?: Api_Order_To_Cash_No_BillInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Order_To_Cash_No_BillInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approve supplier PO {number}" |
*
*/
export const api_order_to_cash_notification_title: ((inputs: Api_Order_To_Cash_Notification_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Order_To_Cash_Notification_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sales order confirmed." |
*
*/
export const api_order_to_cash_order_confirmed: ((inputs?: Api_Order_To_Cash_Order_ConfirmedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Order_To_Cash_Order_ConfirmedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sales order confirmed · supplier POs {pos} prepared for re-check & approval." |
*
*/
export const api_order_to_cash_order_confirmed_pos: ((inputs: Api_Order_To_Cash_Order_Confirmed_PosInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Order_To_Cash_Order_Confirmed_PosInputs, { locale?: "en" | "ar" }, {}>;
/**
* | created | openPluralExact | openPlural | output |
* | --- | --- | --- | --- |
* | "yes" | "0" | * | "Customer PO read and checked: all lines match." |
* | * | "0" | * | "PO re-checked: all lines match." |
* | "yes" | * | * | "Customer PO read and checked: {open} mismatch(es) block commitment." |
* | * | * | * | "PO re-checked: {open} mismatch(es) block commitment." |
*
*/
export const api_order_to_cash_po_checked: ((inputs: Api_Order_To_Cash_Po_CheckedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Order_To_Cash_Po_CheckedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Purchase order not found." |
*
*/
export const api_order_to_cash_po_not_found: ((inputs?: Api_Order_To_Cash_Po_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Order_To_Cash_Po_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{caseId}: {lines} lines, owner set, acknowledgement logged once" |
*
*/
export const api_platform_acc_1: ((inputs: Api_Platform_Acc_1Inputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Acc_1Inputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "GS-RFQ-0131 closes once its balance is collected" |
*
*/
export const api_platform_acc_10_open: ((inputs?: Api_Platform_Acc_10_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Acc_10_OpenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{caseId} closed and settled" |
*
*/
export const api_platform_acc_10_settled: ((inputs: Api_Platform_Acc_10_SettledInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Acc_10_SettledInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Deviation alert logged; revised offer received as a new version" |
*
*/
export const api_platform_acc_2: ((inputs?: Api_Platform_Acc_2Inputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Acc_2Inputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Line 3: {qty} × {pack} L = {total} L" |
*
*/
export const api_platform_acc_3: ((inputs: Api_Platform_Acc_3Inputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Acc_3Inputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Atlas Tankers: do not chase · internal reminder only" |
*
*/
export const api_platform_acc_4: ((inputs?: Api_Platform_Acc_4Inputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Acc_4Inputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "GS-RFQ-0136: PO mismatch blocks the sales order" |
*
*/
export const api_platform_acc_5: ((inputs?: Api_Platform_Acc_5Inputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Acc_5Inputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "GS-RFQ-0133: {count} deliveries on one order" |
*
*/
export const api_platform_acc_6: ((inputs: Api_Platform_Acc_6Inputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Acc_6Inputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Deposit waits for approval; GS-RFQ-0131 invoice partially paid" |
*
*/
export const api_platform_acc_7: ((inputs?: Api_Platform_Acc_7Inputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Acc_7Inputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "ETA change re-planned tasks; no-response escalation logged" |
*
*/
export const api_platform_acc_8: ((inputs?: Api_Platform_Acc_8Inputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Acc_8Inputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Duplicate auto-resolved; every exception carries an idempotency key" |
*
*/
export const api_platform_acc_9: ((inputs?: Api_Platform_Acc_9Inputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Acc_9Inputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Already {status} — key {key} checked, nothing re-run or re-sent." |
*
*/
export const api_platform_already_done: ((inputs: Api_Platform_Already_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Already_DoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{name} already owns {caseId}." |
*
*/
export const api_platform_already_owns: ((inputs: Api_Platform_Already_OwnsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Already_OwnsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Bank detail change" |
*
*/
export const api_platform_bank_detail_change: ((inputs?: Api_Platform_Bank_Detail_ChangeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Bank_Detail_ChangeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{caseId} line {line}: {description}" |
*
*/
export const api_platform_case_line: ((inputs: Api_Platform_Case_LineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Case_LineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Case not found." |
*
*/
export const api_platform_case_not_found: ((inputs?: Api_Platform_Case_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Case_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Case record" |
*
*/
export const api_platform_case_record: ((inputs?: Api_Platform_Case_RecordInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Case_RecordInputs, { locale?: "en" | "ar" }, {}>;
/**
* | on | output |
* | --- | --- |
* | "yes" | "Approval rule “{type}”: two-person on, approvers {approvers}." |
* | * | "Approval rule “{type}”: two-person off, approvers {approvers}." |
*
*/
export const api_platform_check_bank_detail: ((inputs: Api_Platform_Check_Bank_DetailInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Check_Bank_DetailInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Bank-detail changes need two people (Finance + CEO)" |
*
*/
export const api_platform_check_bank_two_people: ((inputs?: Api_Platform_Check_Bank_Two_PeopleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Check_Bank_Two_PeopleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sales never sees supplier costs" |
*
*/
export const api_platform_check_sales_costs: ((inputs?: Api_Platform_Check_Sales_CostsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Check_Sales_CostsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hidden | output |
* | --- | --- |
* | "yes" | "Read an offer as {name}: the price field is removed by field access." |
* | * | "Read an offer as {name}: the price field is visible." |
*
*/
export const api_platform_check_sales_costs_detail: ((inputs: Api_Platform_Check_Sales_Costs_DetailInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Check_Sales_Costs_DetailInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} clarification" |
* | * | "{count} clarifications" |
*
*/
export const api_platform_clarifications: ((inputs: Api_Platform_ClarificationsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_ClarificationsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Connection not found." |
*
*/
export const api_platform_connection_not_found: ((inputs?: Api_Platform_Connection_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Connection_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer" |
*
*/
export const api_platform_customer: ((inputs?: Api_Platform_CustomerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_CustomerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{when} (passed)" |
*
*/
export const api_platform_deadline_passed: ((inputs: Api_Platform_Deadline_PassedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Deadline_PassedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{when} (within 24 h)" |
*
*/
export const api_platform_deadline_within_24h: ((inputs: Api_Platform_Deadline_Within_24hInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Deadline_Within_24hInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number} {status} — not counted as delivered until confirmed" |
*
*/
export const api_platform_delivery_note: ((inputs: Api_Platform_Delivery_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Delivery_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Exception not found." |
*
*/
export const api_platform_exception_not_found: ((inputs?: Api_Platform_Exception_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Exception_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | movedPluralExact | movedPlural | output |
* | --- | --- | --- |
* | "0" | * | "{caseId} handed over to {name} · note logged on the timeline" |
* | * | "one" | "{caseId} handed over to {name} · {moved} open task moved · note logged on the timeline" |
* | * | * | "{caseId} handed over to {name} · {moved} open tasks moved · note logged on the timeline" |
*
*/
export const api_platform_handed_over: ((inputs: Api_Platform_Handed_OverInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Handed_OverInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasPort | hasEta | output |
* | --- | --- | --- |
* | "yes" | "yes" | "{customer} · {vessel}, {port}, ETA {eta}. Stage: {stage}. Quote due {due}." |
* | "yes" | * | "{customer} · {vessel}, {port}. Stage: {stage}. Quote due {due}." |
* | * | "yes" | "{customer} · {vessel}, ETA {eta}. Stage: {stage}. Quote due {due}." |
* | * | * | "{customer} · {vessel}. Stage: {stage}. Quote due {due}." |
*
*/
export const api_platform_handover_case: ((inputs: Api_Platform_Handover_CaseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Handover_CaseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Check line {line} ({description}): AI read it at {pct}%." |
*
*/
export const api_platform_handover_check_line: ((inputs: Api_Platform_Handover_Check_LineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Handover_Check_LineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer contact rule: {rule}." |
*
*/
export const api_platform_handover_contact_rule: ((inputs: Api_Platform_Handover_Contact_RuleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Handover_Contact_RuleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | movedPluralExact | movedPlural | output |
* | --- | --- | --- |
* | "0" | * | "Handover from {name}" |
* | * | "one" | "Handover from {name} · {moved} open task moved to you" |
* | * | * | "Handover from {name} · {moved} open tasks moved to you" |
*
*/
export const api_platform_handover_from: ((inputs: Api_Platform_Handover_FromInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Handover_FromInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Lines: {ready} ready, {waiting} waiting, {blocked} blocked, {noOffer} without offer (of {total})." |
*
*/
export const api_platform_handover_lines: ((inputs: Api_Platform_Handover_LinesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Handover_LinesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasBlocker | output |
* | --- | --- |
* | "yes" | "Next: {next}. Blocker: {blocker}." |
* | * | "Next: {next}." |
*
*/
export const api_platform_handover_next: ((inputs: Api_Platform_Handover_NextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Handover_NextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasLine | output |
* | --- | --- |
* | "yes" | "Open question (line {line}) to {to}: {question}" |
* | * | "Open question to {to}: {question}" |
*
*/
export const api_platform_handover_question: ((inputs: Api_Platform_Handover_QuestionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Handover_QuestionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Handover note for {caseId} to {to}" |
*
*/
export const api_platform_handover_subject: ((inputs: Api_Platform_Handover_SubjectInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Handover_SubjectInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasDue | output |
* | --- | --- |
* | "yes" | "Task: {title} — due {due}." |
* | * | "Task: {title}." |
*
*/
export const api_platform_handover_task: ((inputs: Api_Platform_Handover_TaskInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Handover_TaskInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Handover — {caseId} for {to}" |
*
*/
export const api_platform_handover_title: ((inputs: Api_Platform_Handover_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Handover_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Re-checked {key}: already accepted by the tax authority — not submitted again." |
*
*/
export const api_platform_invoice_already_accepted: ((inputs: Api_Platform_Invoice_Already_AcceptedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Invoice_Already_AcceptedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Re-checked {key}: not yet accepted by the tax authority → signed and submitted once. Status: Valid." |
*
*/
export const api_platform_invoice_submitted_once: ((inputs: Api_Platform_Invoice_Submitted_OnceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Invoice_Submitted_OnceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Language settings saved" |
*
*/
export const api_platform_language_saved: ((inputs?: Api_Platform_Language_SavedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Language_SavedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Low extraction confidence" |
*
*/
export const api_platform_low_confidence: ((inputs?: Api_Platform_Low_ConfidenceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Low_ConfidenceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Re-checked {key}: {pending} messages waiting, {linked} already imported → {imported} imported. No duplicate cases or acknowledgements." |
*
*/
export const api_platform_mailbox_rechecked: ((inputs: Api_Platform_Mailbox_RecheckedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Mailbox_RecheckedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Only management edits permissions." |
*
*/
export const api_platform_management_permissions: ((inputs?: Api_Platform_Management_PermissionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Management_PermissionsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Management can pause or enable rules." |
*
*/
export const api_platform_management_rules: ((inputs?: Api_Platform_Management_RulesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Management_RulesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Your dashboard language: Arabic (applies after go-live translation)" |
*
*/
export const api_platform_my_language_ar: ((inputs?: Api_Platform_My_Language_ArInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_My_Language_ArInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Your dashboard language: English" |
*
*/
export const api_platform_my_language_en: ((inputs?: Api_Platform_My_Language_EnInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_My_Language_EnInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Outside office hours and no shift on the roster: straight to the senior call list." |
*
*/
export const api_platform_no_shift_reason: ((inputs?: Api_Platform_No_Shift_ReasonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_No_Shift_ReasonInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Not yet shown" |
*
*/
export const api_platform_not_yet_shown: ((inputs?: Api_Platform_Not_Yet_ShownInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Not_Yet_ShownInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "A handover note is required." |
*
*/
export const api_platform_note_required: ((inputs?: Api_Platform_Note_RequiredInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Note_RequiredInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Office hours (Sun–Thu 08:00–17:00 Cairo): the case owner picks it up by the assignment rule." |
*
*/
export const api_platform_office_hours_reason: ((inputs?: Api_Platform_Office_Hours_ReasonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Office_Hours_ReasonInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Simulated from /roles · acknowledge within {minutes} min, then {next} is alerted" |
*
*/
export const api_platform_on_call_detail: ((inputs: Api_Platform_On_Call_DetailInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_On_Call_DetailInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Urgent RFQ after hours — you're on call ({at})" |
*
*/
export const api_platform_on_call_title: ((inputs: Api_Platform_On_Call_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_On_Call_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Outside office hours: WhatsApp / SMS to the on-duty person; the backup after {minutes} min, then senior contacts." |
*
*/
export const api_platform_on_duty_reason: ((inputs: Api_Platform_On_Duty_ReasonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_On_Duty_ReasonInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Only the owner, the backup, the supply-chain desk or management can reassign." |
*
*/
export const api_platform_only_owner_reassigns: ((inputs?: Api_Platform_Only_Owner_ReassignsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Only_Owner_ReassignsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} open task" |
* | * | "{count} open tasks" |
*
*/
export const api_platform_open_tasks: ((inputs: Api_Platform_Open_TasksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Open_TasksInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pass" |
*
*/
export const api_platform_pass: ((inputs?: Api_Platform_PassInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_PassInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Updated the {role} permissions in the roles & permissions matrix." |
*
*/
export const api_platform_permissions_activity: ((inputs: Api_Platform_Permissions_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Permissions_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pick who is on duty." |
*
*/
export const api_platform_pick_on_duty: ((inputs?: Api_Platform_Pick_On_DutyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Pick_On_DutyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pick someone on the desk to hand over to." |
*
*/
export const api_platform_pick_someone: ((inputs?: Api_Platform_Pick_SomeoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Pick_SomeoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasRest | output |
* | --- | --- |
* | "yes" | "Line {line}: {qc} — {received} of {ordered} received, rest due {rest}" |
* | * | "Line {line}: {qc} — {received} of {ordered} received" |
*
*/
export const api_platform_receipt_note: ((inputs: Api_Platform_Receipt_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Receipt_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Management, operations or the office manager reconnect mailboxes." |
*
*/
export const api_platform_reconnect_roles: ((inputs?: Api_Platform_Reconnect_RolesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Reconnect_RolesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reconnected {account}." |
*
*/
export const api_platform_reconnected: ((inputs: Api_Platform_ReconnectedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_ReconnectedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reconnected {kind} {account}." |
*
*/
export const api_platform_reconnected_activity: ((inputs: Api_Platform_Reconnected_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Reconnected_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reconnected — waiting emails imported once each" |
*
*/
export const api_platform_reconnected_note: ((inputs?: Api_Platform_Reconnected_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Reconnected_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reconnected {account}. {message}" |
*
*/
export const api_platform_reconnected_with: ((inputs: Api_Platform_Reconnected_WithInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Reconnected_WithInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{impact} — resolved by safe retry" |
*
*/
export const api_platform_resolved_by_retry: ((inputs: Api_Platform_Resolved_By_RetryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Resolved_By_RetryInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Retried safely — {message}" |
*
*/
export const api_platform_retried_safely: ((inputs: Api_Platform_Retried_SafelyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Retried_SafelyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasNote | output |
* | --- | --- |
* | "yes" | "Reviewed: {summary}. {note}" |
* | * | "Reviewed: {summary}. Fields confirmed by a person." |
*
*/
export const api_platform_reviewed_activity: ((inputs: Api_Platform_Reviewed_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Reviewed_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Role not found." |
*
*/
export const api_platform_role_not_found: ((inputs?: Api_Platform_Role_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Role_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Updated the on-call roster." |
*
*/
export const api_platform_roster_activity: ((inputs?: Api_Platform_Roster_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Roster_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Management and the office manager edit the roster." |
*
*/
export const api_platform_roster_editors: ((inputs?: Api_Platform_Roster_EditorsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Roster_EditorsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{name} enabled (logged)" |
*
*/
export const api_platform_rule_enabled: ((inputs: Api_Platform_Rule_EnabledInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Rule_EnabledInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Enabled automation “{name}”." |
*
*/
export const api_platform_rule_enabled_activity: ((inputs: Api_Platform_Rule_Enabled_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Rule_Enabled_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Rule not found." |
*
*/
export const api_platform_rule_not_found: ((inputs?: Api_Platform_Rule_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Rule_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{name} paused (logged)" |
*
*/
export const api_platform_rule_paused: ((inputs: Api_Platform_Rule_PausedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Rule_PausedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Paused automation “{name}”." |
*
*/
export const api_platform_rule_paused_activity: ((inputs: Api_Platform_Rule_Paused_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Rule_Paused_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Runs at settlement" |
*
*/
export const api_platform_runs_at_settlement: ((inputs?: Api_Platform_Runs_At_SettlementInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Runs_At_SettlementInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sales" |
*
*/
export const api_platform_sales: ((inputs?: Api_Platform_SalesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_SalesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "senior contacts" |
*
*/
export const api_platform_senior_contacts: ((inputs?: Api_Platform_Senior_ContactsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Senior_ContactsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Company settings are changed by management." |
*
*/
export const api_platform_settings_management: ((inputs?: Api_Platform_Settings_ManagementInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Settings_ManagementInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Shift not found." |
*
*/
export const api_platform_shift_not_found: ((inputs?: Api_Platform_Shift_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Shift_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Please sign in." |
*
*/
export const api_platform_sign_in: ((inputs?: Api_Platform_Sign_InInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Sign_InInputs, { locale?: "en" | "ar" }, {}>;
/**
* | hasBackup | output |
* | --- | --- |
* | "yes" | "Simulated urgent RFQ at {at}: alert sent to on-duty {name}, backup {backup}." |
* | * | "Simulated urgent RFQ at {at}: alert sent to on-duty {name}." |
*
*/
export const api_platform_simulated_activity: ((inputs: Api_Platform_Simulated_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Simulated_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Staging copy refreshed from last night's backup (emails and integrations disabled on staging)." |
*
*/
export const api_platform_staging_activity: ((inputs?: Api_Platform_Staging_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Staging_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Only management refreshes the staging copy." |
*
*/
export const api_platform_staging_management: ((inputs?: Api_Platform_Staging_ManagementInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Staging_ManagementInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Re-checked {key}: step re-run once." |
*
*/
export const api_platform_step_rerun: ((inputs: Api_Platform_Step_RerunInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Step_RerunInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "System" |
*
*/
export const api_platform_system: ((inputs?: Api_Platform_SystemInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_SystemInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "System mailbox" |
*
*/
export const api_platform_system_mailbox: ((inputs?: Api_Platform_System_MailboxInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_System_MailboxInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "the record" |
*
*/
export const api_platform_the_record: ((inputs?: Api_Platform_The_RecordInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_The_RecordInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{count} timeline entries" |
*
*/
export const api_platform_timeline_entries: ((inputs: Api_Platform_Timeline_EntriesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Timeline_EntriesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Uncertain match ({classification}) — waiting for a person in the inbox" |
*
*/
export const api_platform_uncertain_match: ((inputs: Api_Platform_Uncertain_MatchInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Uncertain_MatchInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "unclassified" |
*
*/
export const api_platform_unclassified: ((inputs?: Api_Platform_UnclassifiedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_UnclassifiedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Unknown permission." |
*
*/
export const api_platform_unknown_permission: ((inputs?: Api_Platform_Unknown_PermissionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Unknown_PermissionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Unknown setting." |
*
*/
export const api_platform_unknown_setting: ((inputs?: Api_Platform_Unknown_SettingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Unknown_SettingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Give a valid time." |
*
*/
export const api_platform_valid_time: ((inputs?: Api_Platform_Valid_TimeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_Valid_TimeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "You now own {caseId}" |
*
*/
export const api_platform_you_now_own: ((inputs: Api_Platform_You_Now_OwnInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Platform_You_Now_OwnInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Actual costs confirmed: {list}." |
*
*/
export const api_profit_actuals_confirmed: ((inputs: Api_Profit_Actuals_ConfirmedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Actuals_ConfirmedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Every shared charge is confirmed against its bill." |
*
*/
export const api_profit_all_charges_confirmed: ((inputs?: Api_Profit_All_Charges_ConfirmedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_All_Charges_ConfirmedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "All paid ({count} receipt reconciled)." |
* | * | "All paid ({count} receipts reconciled)." |
*
*/
export const api_profit_all_paid: ((inputs: Api_Profit_All_PaidInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_All_PaidInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Bill {number} ({status})" |
*
*/
export const api_profit_bill: ((inputs: Api_Profit_BillInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_BillInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Bill {number} ({status}: {reason})" |
*
*/
export const api_profit_bill_held: ((inputs: Api_Profit_Bill_HeldInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Bill_HeldInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Bill {number}" |
*
*/
export const api_profit_bill_number: ((inputs: Api_Profit_Bill_NumberInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Bill_NumberInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{label}: billed {billed} vs estimate {estimate} — confirm" |
*
*/
export const api_profit_billed_vs_estimate: ((inputs: Api_Profit_Billed_Vs_EstimateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Billed_Vs_EstimateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The case can't close yet: {checks}." |
*
*/
export const api_profit_cant_close: ((inputs: Api_Profit_Cant_CloseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Cant_CloseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Case closed — actual gross profit {actual} ({margin}%) against {expected} expected. Supplier prices and on-time results fed back to supplier records." |
*
*/
export const api_profit_case_closed_activity: ((inputs: Api_Profit_Case_Closed_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Case_Closed_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Case not found." |
*
*/
export const api_profit_case_not_found: ((inputs?: Api_Profit_Case_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Case_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Estimated costs replaced by actuals" |
*
*/
export const api_profit_check_actuals: ((inputs?: Api_Profit_Check_ActualsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Check_ActualsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier bills matched to POs and receipts" |
*
*/
export const api_profit_check_bills: ((inputs?: Api_Profit_Check_BillsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Check_BillsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Claims settled" |
*
*/
export const api_profit_check_claims: ((inputs?: Api_Profit_Check_ClaimsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Check_ClaimsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Deliveries signed on board" |
*
*/
export const api_profit_check_deliveries: ((inputs?: Api_Profit_Check_DeliveriesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Check_DeliveriesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Invoices accepted by the tax authority (ETA e-invoice)" |
*
*/
export const api_profit_check_einvoice: ((inputs?: Api_Profit_Check_EinvoiceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Check_EinvoiceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer invoices paid in full" |
*
*/
export const api_profit_check_paid: ((inputs?: Api_Profit_Check_PaidInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Check_PaidInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Claim {ref}: {title}" |
*
*/
export const api_profit_claim_line: ((inputs: Api_Profit_Claim_LineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Claim_LineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Claim not found." |
*
*/
export const api_profit_claim_not_found: ((inputs?: Api_Profit_Claim_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Claim_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Replacement cost offset by credit note {creditNote}" |
*
*/
export const api_profit_claim_offset: ((inputs: Api_Profit_Claim_OffsetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Claim_OffsetInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open — claimed from {against}" |
*
*/
export const api_profit_claim_open: ((inputs: Api_Profit_Claim_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Claim_OpenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{ref} ({title}): open with {against}" |
*
*/
export const api_profit_claim_open_with: ((inputs: Api_Profit_Claim_Open_WithInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Claim_Open_WithInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Claim {ref} settled: credit note {creditNote} for {amount} recorded." |
*
*/
export const api_profit_claim_settled_activity: ((inputs: Api_Profit_Claim_Settled_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Claim_Settled_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{ref} ({title}): settled by credit note {creditNote}" |
*
*/
export const api_profit_claim_settled_by: ((inputs: Api_Profit_Claim_Settled_ByInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Claim_Settled_ByInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Confirm actuals" |
*
*/
export const api_profit_confirm_actuals: ((inputs?: Api_Profit_Confirm_ActualsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Confirm_ActualsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Confirmed on the pricing tab" |
*
*/
export const api_profit_confirmed_on_pricing: ((inputs?: Api_Profit_Confirmed_On_PricingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Confirmed_On_PricingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Estimate" |
*
*/
export const api_profit_estimate: ((inputs?: Api_Profit_EstimateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_EstimateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Only management and finance record receipts, credit notes and closures." |
*
*/
export const api_profit_finance_only: ((inputs?: Api_Profit_Finance_OnlyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Finance_OnlyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Profit, costs and margins are not visible to Sales." |
*
*/
export const api_profit_hidden_from_sales: ((inputs?: Api_Profit_Hidden_From_SalesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Hidden_From_SalesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No supplier bill yet" |
*
*/
export const api_profit_no_bill_yet: ((inputs?: Api_Profit_No_Bill_YetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_No_Bill_YetInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No claims on this case." |
*
*/
export const api_profit_no_claims: ((inputs?: Api_Profit_No_ClaimsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_No_ClaimsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No delivery recorded yet." |
*
*/
export const api_profit_no_delivery: ((inputs?: Api_Profit_No_DeliveryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_No_DeliveryInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No customer invoice issued yet." |
*
*/
export const api_profit_no_invoice: ((inputs?: Api_Profit_No_InvoiceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_No_InvoiceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No supplier PO or bill recorded for this case yet." |
*
*/
export const api_profit_no_po_or_bill: ((inputs?: Api_Profit_No_Po_Or_BillInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_No_Po_Or_BillInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "There is no single open invoice balance to record." |
*
*/
export const api_profit_no_single_balance: ((inputs?: Api_Profit_No_Single_BalanceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_No_Single_BalanceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "None — case closed" |
*
*/
export const api_profit_none_case_closed: ((inputs?: Api_Profit_None_Case_ClosedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_None_Case_ClosedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Not applicable" |
*
*/
export const api_profit_not_applicable: ((inputs?: Api_Profit_Not_ApplicableInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Not_ApplicableInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Not yet invoiced, at today's rate" |
*
*/
export const api_profit_not_invoiced_today: ((inputs?: Api_Profit_Not_Invoiced_TodayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Not_Invoiced_TodayInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number}: {amount} open" |
*
*/
export const api_profit_open: ((inputs: Api_Profit_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_OpenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open balance, at today's rate" |
*
*/
export const api_profit_open_balance_today: ((inputs?: Api_Profit_Open_Balance_TodayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Open_Balance_TodayInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number}: {amount} open, due {due}" |
*
*/
export const api_profit_open_due: ((inputs: Api_Profit_Open_DueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Open_DueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "PO {number}" |
*
*/
export const api_profit_po: ((inputs: Api_Profit_PoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_PoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{supplier} — PO {number}" |
*
*/
export const api_profit_po_line: ((inputs: Api_Profit_Po_LineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Po_LineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receipt {reference}" |
*
*/
export const api_profit_receipt: ((inputs: Api_Profit_ReceiptInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_ReceiptInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receipt {reference} · {day}" |
*
*/
export const api_profit_receipt_on: ((inputs: Api_Profit_Receipt_OnInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Receipt_OnInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Record credit note" |
*
*/
export const api_profit_record_credit_note: ((inputs?: Api_Profit_Record_Credit_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Record_Credit_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Record receipt" |
*
*/
export const api_profit_record_receipt: ((inputs?: Api_Profit_Record_ReceiptInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Record_ReceiptInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "signed by {who}" |
*
*/
export const api_profit_signed_by: ((inputs: Api_Profit_Signed_ByInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Signed_ByInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "signed by the vessel" |
*
*/
export const api_profit_signed_by_vessel: ((inputs?: Api_Profit_Signed_By_VesselInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Signed_By_VesselInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{label}: still an estimate ({estimate})" |
*
*/
export const api_profit_still_estimate: ((inputs: Api_Profit_Still_EstimateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Profit_Still_EstimateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Decision recorded: {decision}." |
*
*/
export const api_quotations_decision_recorded: ((inputs: Api_Quotations_Decision_RecordedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Quotations_Decision_RecordedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number} marked as entered in the portal." |
*
*/
export const api_quotations_entered_in_portal: ((inputs: Api_Quotations_Entered_In_PortalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Quotations_Entered_In_PortalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Give the lost reason." |
*
*/
export const api_quotations_give_lost_reason: ((inputs?: Api_Quotations_Give_Lost_ReasonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Quotations_Give_Lost_ReasonInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "New version created — the previous one is kept for audit." |
*
*/
export const api_quotations_new_version: ((inputs?: Api_Quotations_New_VersionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Quotations_New_VersionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number} sent to {to}." |
*
*/
export const api_quotations_sent_to: ((inputs: Api_Quotations_Sent_ToInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Quotations_Sent_ToInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Please sign in." |
*
*/
export const api_service_sign_in: ((inputs?: Api_Service_Sign_InInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Service_Sign_InInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "a person" |
*
*/
export const api_sourcing_a_person: ((inputs?: Api_Sourcing_A_PersonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_A_PersonInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Already acknowledged earlier — no second acknowledgement." |
*
*/
export const api_sourcing_ack_already_activity: ((inputs?: Api_Sourcing_Ack_Already_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Ack_Already_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Acknowledgement to be sent by the owner by hand (WhatsApp / phone source)." |
*
*/
export const api_sourcing_ack_by_hand_activity: ((inputs?: Api_Sourcing_Ack_By_Hand_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Ack_By_Hand_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Dear {{contact}}, Thank you — your request for {{vessel}} is registered as {{caseId}}. We will revert by {{dueAt}}." |
*
*/
export const api_sourcing_ack_default_body: ((inputs?: Api_Sourcing_Ack_Default_BodyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Ack_Default_BodyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "We received your RFQ {{customerRef}}" |
*
*/
export const api_sourcing_ack_default_subject: ((inputs?: Api_Sourcing_Ack_Default_SubjectInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Ack_Default_SubjectInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Your contact: {owner} (backup {backup}). Golden Sea for Trading & Marketing Ship chandler · Port Said · Suez · Alexandria" |
*
*/
export const api_sourcing_ack_footer: ((inputs: Api_Sourcing_Ack_FooterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Ack_FooterInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Acknowledgement sent once from the approved template “{template}”." |
*
*/
export const api_sourcing_ack_sent_activity: ((inputs: Api_Sourcing_Ack_Sent_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Ack_Sent_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "L{line} already asked of {name}" |
*
*/
export const api_sourcing_already_asked: ((inputs: Api_Sourcing_Already_AskedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Already_AskedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Already linked to {caseId} — no new case, no second acknowledgement" |
*
*/
export const api_sourcing_already_linked_no_new: ((inputs: Api_Sourcing_Already_Linked_No_NewInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Already_Linked_No_NewInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "This item is already waiting for a decision." |
*
*/
export const api_sourcing_already_waiting: ((inputs?: Api_Sourcing_Already_WaitingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Already_WaitingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Auto-created from an email reply to {reference} ({date}) — quoted, never ordered" |
*
*/
export const api_sourcing_auto_created_source: ((inputs: Api_Sourcing_Auto_Created_SourceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Auto_Created_SourceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Back in the review queue" |
*
*/
export const api_sourcing_back_in_queue: ((inputs?: Api_Sourcing_Back_In_QueueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Back_In_QueueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Back to needing a decision" |
*
*/
export const api_sourcing_back_to_decision: ((inputs?: Api_Sourcing_Back_To_DecisionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Back_To_DecisionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Below 85% — a person confirms before anything is linked" |
*
*/
export const api_sourcing_below_threshold: ((inputs?: Api_Sourcing_Below_ThresholdInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Below_ThresholdInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Line {lines}: {flag}" |
*
*/
export const api_sourcing_blocker: ((inputs: Api_Sourcing_BlockerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_BlockerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Cannot supply — reminders stopped" |
*
*/
export const api_sourcing_cannot_supply: ((inputs?: Api_Sourcing_Cannot_SupplyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Cannot_SupplyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Case {caseId} was already created from this message" |
*
*/
export const api_sourcing_case_already_created: ((inputs: Api_Sourcing_Case_Already_CreatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Case_Already_CreatedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | ack | output |
* | --- | --- |
* | "sent" | "Case {caseId} created · acknowledgement sent once" |
* | "manual" | "Case {caseId} created · acknowledge by hand" |
* | * | "Case {caseId} created · already acknowledged" |
*
*/
export const api_sourcing_case_created: ((inputs: Api_Sourcing_Case_CreatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Case_CreatedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Case not found." |
*
*/
export const api_sourcing_case_not_found: ((inputs?: Api_Sourcing_Case_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Case_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "(case number on creation)" |
*
*/
export const api_sourcing_case_number_on_creation: ((inputs?: Api_Sourcing_Case_Number_On_CreationInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Case_Number_On_CreationInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Cash" |
*
*/
export const api_sourcing_cash_terms: ((inputs?: Api_Sourcing_Cash_TermsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Cash_TermsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "Created from the {channel} “{subject}” — {count} AI-extracted line checked and confirmed by {who}." |
* | * | "Created from the {channel} “{subject}” — {count} AI-extracted lines checked and confirmed by {who}." |
*
*/
export const api_sourcing_created_activity: ((inputs: Api_Sourcing_Created_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Created_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer reference {ref} = {caseId}" |
*
*/
export const api_sourcing_customer_ref_is: ((inputs: Api_Sourcing_Customer_Ref_IsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Customer_Ref_IsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Declined by email — reminders stopped" |
*
*/
export const api_sourcing_declined_event: ((inputs?: Api_Sourcing_Declined_EventInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Declined_EventInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "That draft is no longer there." |
*
*/
export const api_sourcing_draft_gone: ((inputs?: Api_Sourcing_Draft_GoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Draft_GoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} RFQ draft back — nothing was sent" |
* | * | "{count} RFQ drafts back — nothing was sent" |
*
*/
export const api_sourcing_drafts_back: ((inputs: Api_Sourcing_Drafts_BackInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Drafts_BackInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The drafts have changed since (drafted again or sent) — there is nothing to put back." |
*
*/
export const api_sourcing_drafts_changed: ((inputs?: Api_Sourcing_Drafts_ChangedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Drafts_ChangedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} RFQ draft ready — check them before sending" |
* | * | "{count} RFQ drafts ready — check them before sending" |
*
*/
export const api_sourcing_drafts_ready: ((inputs: Api_Sourcing_Drafts_ReadyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Drafts_ReadyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Duplicate — kept with the original" |
*
*/
export const api_sourcing_duplicate_kept: ((inputs?: Api_Sourcing_Duplicate_KeptInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Duplicate_KeptInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Duplicate — already linked to {caseId}" |
*
*/
export const api_sourcing_duplicate_linked: ((inputs: Api_Sourcing_Duplicate_LinkedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Duplicate_LinkedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Escalated to {name}" |
*
*/
export const api_sourcing_escalated_to: ((inputs: Api_Sourcing_Escalated_ToInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Escalated_ToInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "for {vessel}" |
*
*/
export const api_sourcing_for_vessel: ((inputs: Api_Sourcing_For_VesselInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_For_VesselInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "forwarded by staff" |
*
*/
export const api_sourcing_forwarded_by_staff: ((inputs?: Api_Sourcing_Forwarded_By_StaffInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Forwarded_By_StaffInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "General chandler — receives the full list" |
*
*/
export const api_sourcing_general_full: ((inputs?: Api_Sourcing_General_FullInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_General_FullInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Held back until clarified: {lines}" |
*
*/
export const api_sourcing_held_back: ((inputs: Api_Sourcing_Held_BackInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Held_BackInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Inbox history import approved by {name}: {customers} customers, {vessels} vessels, {suppliers} suppliers and {prices} dated prices ({saved} sample prices wri..." |
*
*/
export const api_sourcing_history_approved_activity: ((inputs: Api_Sourcing_History_Approved_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_History_Approved_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Inbox history ready for your approval" |
*
*/
export const api_sourcing_history_ready: ((inputs?: Api_Sourcing_History_ReadyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_History_ReadyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{customers} customers, {vessels} vessels, {suppliers} suppliers, {prices} dated prices · {uncertain} uncertain items to review" |
*
*/
export const api_sourcing_history_ready_detail: ((inputs: Api_Sourcing_History_Ready_DetailInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_History_Ready_DetailInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Identical attachments ({hash}…) to “{subject}”, received {at}" |
*
*/
export const api_sourcing_identical_attachments: ((inputs: Api_Sourcing_Identical_AttachmentsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Identical_AttachmentsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The import is approved and saved — its decisions can't be taken back." |
*
*/
export const api_sourcing_import_approved: ((inputs?: Api_Sourcing_Import_ApprovedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Import_ApprovedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Invited on {count} open cases — can't tell which" |
*
*/
export const api_sourcing_invited_on_many: ((inputs: Api_Sourcing_Invited_On_ManyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Invited_On_ManyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | changed | output |
* | --- | --- | --- |
* | "one" | "yes" | "{count} line offered · subject changed, matched by reference" |
* | "one" | * | "{count} line offered" |
* | * | "yes" | "{count} lines offered · subject changed, matched by reference" |
* | * | * | "{count} lines offered" |
*
*/
export const api_sourcing_lines_offered: ((inputs: Api_Sourcing_Lines_OfferedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Lines_OfferedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | offer | output |
* | --- | --- |
* | "yes" | "“{subject}” from {from} linked by {who} after review — offer confirmed." |
* | * | "“{subject}” from {from} linked by {who} after review." |
*
*/
export const api_sourcing_linked_activity: ((inputs: Api_Sourcing_Linked_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Linked_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reply linked after review" |
*
*/
export const api_sourcing_linked_after_review_event: ((inputs?: Api_Sourcing_Linked_After_Review_EventInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Linked_After_Review_EventInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Only management (Karim Balbaa) can approve the history import." |
*
*/
export const api_sourcing_management_approves: ((inputs?: Api_Sourcing_Management_ApprovesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Management_ApprovesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Matched to {caseId} by {reference} ({pct})" |
*
*/
export const api_sourcing_matched_to: ((inputs: Api_Sourcing_Matched_ToInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Matched_ToInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Message not found." |
*
*/
export const api_sourcing_message_not_found: ((inputs?: Api_Sourcing_Message_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Message_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "gs-extract (demo stub) · vision + spreadsheet reader" |
*
*/
export const api_sourcing_model: ((inputs?: Api_Sourcing_ModelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_ModelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Needs clarification first" |
*
*/
export const api_sourcing_needs_clarification: ((inputs?: Api_Sourcing_Needs_ClarificationInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Needs_ClarificationInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "New case {caseId} assigned to you" |
*
*/
export const api_sourcing_new_case_assigned: ((inputs: Api_Sourcing_New_Case_AssignedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_New_Case_AssignedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{customer} · {vessel} · quote due {due}" |
*
*/
export const api_sourcing_new_case_detail: ((inputs: Api_Sourcing_New_Case_DetailInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_New_Case_DetailInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "New supplier {name} replied to {reference} — supplier and dated price saved automatically; unit waits for a person." |
*
*/
export const api_sourcing_new_supplier_activity: ((inputs: Api_Sourcing_New_Supplier_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_New_Supplier_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "New supplier: confirm the offered item matches line {line}." |
*
*/
export const api_sourcing_new_supplier_confirm: ((inputs: Api_Sourcing_New_Supplier_ConfirmInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_New_Supplier_ConfirmInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sender {domain} is not in the supplier list — new supplier created automatically" |
*
*/
export const api_sourcing_new_supplier_created: ((inputs: Api_Sourcing_New_Supplier_CreatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_New_Supplier_CreatedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Not in the database: supplier created, dated price stored with validity — unit to confirm" |
*
*/
export const api_sourcing_new_supplier_detail: ((inputs?: Api_Sourcing_New_Supplier_DetailInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_New_Supplier_DetailInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sender {domain} is not in the supplier list — new supplier already saved automatically" |
*
*/
export const api_sourcing_new_supplier_saved: ((inputs: Api_Sourcing_New_Supplier_SavedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_New_Supplier_SavedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No new case, no second acknowledgement" |
*
*/
export const api_sourcing_no_new_case: ((inputs?: Api_Sourcing_No_New_CaseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_No_New_CaseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No supplier-RFQ reference in subject or body" |
*
*/
export const api_sourcing_no_reference: ((inputs?: Api_Sourcing_No_ReferenceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_No_ReferenceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No rule matched — you own it" |
*
*/
export const api_sourcing_no_rule: ((inputs?: Api_Sourcing_No_RuleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_No_RuleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No specialist on file — general chandler" |
*
*/
export const api_sourcing_no_specialist: ((inputs?: Api_Sourcing_No_SpecialistInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_No_SpecialistInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No supplier RFQs are waiting for a reply — send RFQs first" |
*
*/
export const api_sourcing_none_waiting: ((inputs?: Api_Sourcing_None_WaitingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_None_WaitingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "This message isn't filed by a review — there is nothing to take back." |
*
*/
export const api_sourcing_not_filed_by_review: ((inputs?: Api_Sourcing_Not_Filed_By_ReviewInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Not_Filed_By_ReviewInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Not a history item." |
*
*/
export const api_sourcing_not_history_item: ((inputs?: Api_Sourcing_Not_History_ItemInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Not_History_ItemInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Not invited — replied to {reference} forwarded to them; supplier created automatically" |
*
*/
export const api_sourcing_not_invited_event: ((inputs: Api_Sourcing_Not_Invited_EventInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Not_Invited_EventInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing extracted from this message yet." |
*
*/
export const api_sourcing_nothing_extracted: ((inputs?: Api_Sourcing_Nothing_ExtractedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Nothing_ExtractedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing new to send — every picked line was already asked of these suppliers" |
*
*/
export const api_sourcing_nothing_new: ((inputs?: Api_Sourcing_Nothing_NewInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Nothing_NewInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing to send — draft the RFQs first." |
*
*/
export const api_sourcing_nothing_to_send: ((inputs?: Api_Sourcing_Nothing_To_SendInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Nothing_To_SendInputs, { locale?: "en" | "ar" }, {}>;
/**
* | changed | output |
* | --- | --- |
* | "yes" | "Offer received (subject “{subject}”) — matched by reference, reminders stopped" |
* | * | "Offer received — matched by reference, reminders stopped" |
*
*/
export const api_sourcing_offer_received_event: ((inputs: Api_Sourcing_Offer_Received_EventInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Offer_Received_EventInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} offer line captured from the reply to {reference} — dated prices saved to the supplier's history." |
* | * | "{count} offer lines captured from the reply to {reference} — dated prices saved to the supplier's history." |
*
*/
export const api_sourcing_offers_captured: ((inputs: Api_Sourcing_Offers_CapturedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Offers_CapturedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{name} decided this item — only they can take it back." |
*
*/
export const api_sourcing_only_decider: ((inputs: Api_Sourcing_Only_DeciderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Only_DeciderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{name} filed this message — only they can take it back." |
*
*/
export const api_sourcing_only_filer: ((inputs: Api_Sourcing_Only_FilerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Only_FilerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Organise the history first." |
*
*/
export const api_sourcing_organise_first: ((inputs?: Api_Sourcing_Organise_FirstInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Organise_FirstInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The original message isn't a case yet — handle that one; this copy is kept with it" |
*
*/
export const api_sourcing_original_not_case: ((inputs?: Api_Sourcing_Original_Not_CaseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Original_Not_CaseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{text} · source: {source}" |
*
*/
export const api_sourcing_original_text: ((inputs: Api_Sourcing_Original_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Original_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} uncertain item still need a decision." |
* | * | "{count} uncertain items still need a decision." |
*
*/
export const api_sourcing_pending_items: ((inputs: Api_Sourcing_Pending_ItemsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Pending_ItemsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quoted “{price} LE” — read as per kg, converted to {converted} per {pack} kg pack. Confirm the unit." |
*
*/
export const api_sourcing_per_kg_uncertain: ((inputs: Api_Sourcing_Per_Kg_UncertainInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Per_Kg_UncertainInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pick the case this message belongs to." |
*
*/
export const api_sourcing_pick_case: ((inputs?: Api_Sourcing_Pick_CaseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Pick_CaseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pick at least one line." |
*
*/
export const api_sourcing_pick_line: ((inputs?: Api_Sourcing_Pick_LineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Pick_LineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Price unit unclear — a person confirms" |
*
*/
export const api_sourcing_price_unit_unclear: ((inputs?: Api_Sourcing_Price_Unit_UnclearInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Price_Unit_UnclearInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reference {ref} found in the body" |
*
*/
export const api_sourcing_ref_in_body: ((inputs: Api_Sourcing_Ref_In_BodyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Ref_In_BodyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reference {ref} found in the subject" |
*
*/
export const api_sourcing_ref_in_subject: ((inputs: Api_Sourcing_Ref_In_SubjectInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Ref_In_SubjectInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reminder {n} sent — no reply after {after} reminders, escalated to the case owner" |
*
*/
export const api_sourcing_reminder_escalated_event: ((inputs: Api_Sourcing_Reminder_Escalated_EventInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Reminder_Escalated_EventInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reminder {n} sent" |
*
*/
export const api_sourcing_reminder_n_sent: ((inputs: Api_Sourcing_Reminder_N_SentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Reminder_N_SentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reminder {n} sent (approved template, client hidden) · next in 24 h" |
*
*/
export const api_sourcing_reminder_sent_event: ((inputs: Api_Sourcing_Reminder_Sent_EventInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Reminder_Sent_EventInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reminders stop once a supplier has answered." |
*
*/
export const api_sourcing_reminders_stop: ((inputs?: Api_Sourcing_Reminders_StopInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Reminders_StopInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "“{subject}” from {from} put back in the review queue by {who}." |
*
*/
export const api_sourcing_reopened_activity: ((inputs: Api_Sourcing_Reopened_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Reopened_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The supplier's reply is already counted on the case — the link can't be taken back." |
*
*/
export const api_sourcing_reply_counted: ((inputs?: Api_Sourcing_Reply_CountedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Reply_CountedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reply matched by reference (subject “{subject}”) — reminders stopped" |
*
*/
export const api_sourcing_reply_matched_event: ((inputs: Api_Sourcing_Reply_Matched_EventInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Reply_Matched_EventInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "(alternatives: state brand)" |
*
*/
export const api_sourcing_rfq_alternatives: ((inputs?: Api_Sourcing_Rfq_AlternativesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Rfq_AlternativesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Best regards," |
*
*/
export const api_sourcing_rfq_best_regards: ((inputs?: Api_Sourcing_Rfq_Best_RegardsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Rfq_Best_RegardsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "the date below" |
*
*/
export const api_sourcing_rfq_date_below: ((inputs?: Api_Sourcing_Rfq_Date_BelowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Rfq_Date_BelowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Dear supplier," |
*
*/
export const api_sourcing_rfq_dear: ((inputs?: Api_Sourcing_Rfq_DearInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Rfq_DearInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "(exact brand / part only)" |
*
*/
export const api_sourcing_rfq_exact: ((inputs?: Api_Sourcing_Rfq_ExactInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Rfq_ExactInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Please keep our reference {reference} in your reply." |
*
*/
export const api_sourcing_rfq_keep_reference: ((inputs: Api_Sourcing_Rfq_Keep_ReferenceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Rfq_Keep_ReferenceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier RFQ not found." |
*
*/
export const api_sourcing_rfq_not_found: ((inputs?: Api_Sourcing_Rfq_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Rfq_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "· part {part}" |
*
*/
export const api_sourcing_rfq_part: ((inputs: Api_Sourcing_Rfq_PartInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Rfq_PartInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Please quote the following, delivered {port} by {date}:" |
*
*/
export const api_sourcing_rfq_please_quote: ((inputs: Api_Sourcing_Rfq_Please_QuoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Rfq_Please_QuoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "For each line please state: unit price & currency, available quantity, pack size, lead time, delivery basis, freight, validity and payment terms — and attach..." |
*
*/
export const api_sourcing_rfq_please_state: ((inputs?: Api_Sourcing_Rfq_Please_StateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Rfq_Please_StateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Request for quotation {reference} — reply by {due}" |
*
*/
export const api_sourcing_rfq_subject: ((inputs: Api_Sourcing_Rfq_SubjectInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Rfq_SubjectInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "to port" |
*
*/
export const api_sourcing_rfq_to_port: ((inputs?: Api_Sourcing_Rfq_To_PortInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Rfq_To_PortInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sender domain {domain} = {name}" |
*
*/
export const api_sourcing_sender_domain: ((inputs: Api_Sourcing_Sender_DomainInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Sender_DomainInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sender {sender} is not in the supplier list — new supplier" |
*
*/
export const api_sourcing_sender_unknown: ((inputs: Api_Sourcing_Sender_UnknownInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Sender_UnknownInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} supplier RFQ sent by {who} ({mode}, client identity removed): {references}." |
* | * | "{count} supplier RFQs sent by {who} ({mode}, client identity removed): {references}." |
*
*/
export const api_sourcing_sent_activity: ((inputs: Api_Sourcing_Sent_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Sent_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sent by {name} for an RFQ sent to another supplier" |
*
*/
export const api_sourcing_sent_by_other: ((inputs: Api_Sourcing_Sent_By_OtherInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Sent_By_OtherInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sent (client identity removed) · reminder 1 scheduled" |
*
*/
export const api_sourcing_sent_event: ((inputs?: Api_Sourcing_Sent_EventInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Sent_EventInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{reference}: {name} silent after {after} reminders — escalated to the owner." |
*
*/
export const api_sourcing_silent_activity: ((inputs: Api_Sourcing_Silent_ActivityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Silent_ActivityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{after} reminders sent · {caseId} quote due {due} — call them or source elsewhere" |
*
*/
export const api_sourcing_silent_detail: ((inputs: Api_Sourcing_Silent_DetailInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Silent_DetailInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{name} hasn't replied to {reference}" |
*
*/
export const api_sourcing_silent_title: ((inputs: Api_Sourcing_Silent_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Silent_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sir / Madam" |
*
*/
export const api_sourcing_sir_madam: ((inputs?: Api_Sourcing_Sir_MadamInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Sir_MadamInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Specialist in {category}" |
*
*/
export const api_sourcing_specialist: ((inputs: Api_Sourcing_SpecialistInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_SpecialistInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Draft — not sent" |
*
*/
export const api_sourcing_step_draft: ((inputs?: Api_Sourcing_Step_DraftInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Step_DraftInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Escalate to case owner" |
*
*/
export const api_sourcing_step_escalate: ((inputs?: Api_Sourcing_Step_EscalateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Step_EscalateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reminder {n}" |
*
*/
export const api_sourcing_step_reminder: ((inputs: Api_Sourcing_Step_ReminderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Step_ReminderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sent" |
*
*/
export const api_sourcing_step_sent: ((inputs?: Api_Sourcing_Step_SentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Step_SentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{status} — reminders stopped" |
*
*/
export const api_sourcing_step_stopped: ((inputs: Api_Sourcing_Step_StoppedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Step_StoppedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{status} without an invitation — reply matched by reference" |
*
*/
export const api_sourcing_step_uninvited: ((inputs: Api_Sourcing_Step_UninvitedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Step_UninvitedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Subject changed (“{subject}”) — matched by reference, not by subject" |
*
*/
export const api_sourcing_subject_changed: ((inputs: Api_Sourcing_Subject_ChangedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Subject_ChangedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Thread subject kept" |
*
*/
export const api_sourcing_subject_kept: ((inputs?: Api_Sourcing_Subject_KeptInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Subject_KeptInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier" |
*
*/
export const api_sourcing_supplier: ((inputs?: Api_Sourcing_SupplierInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_SupplierInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Inbox history import — quoted {quoted} lines 2022–2025, never ordered" |
*
*/
export const api_sourcing_supplier_history_source: ((inputs: Api_Sourcing_Supplier_History_SourceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Supplier_History_SourceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{name} · v{version} (approved)" |
*
*/
export const api_sourcing_template_label: ((inputs: Api_Sourcing_Template_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Template_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Uncertain — sent to the review queue" |
*
*/
export const api_sourcing_uncertain_review: ((inputs?: Api_Sourcing_Uncertain_ReviewInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Uncertain_ReviewInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No reference, no thread, unknown sender — a person classifies it" |
*
*/
export const api_sourcing_unclassifiable: ((inputs?: Api_Sourcing_UnclassifiableInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_UnclassifiableInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Found in inbox history: {calls} calls ({ports})." |
*
*/
export const api_sourcing_vessel_history_note: ((inputs: Api_Sourcing_Vessel_History_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Vessel_History_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{name} was asked on {reference} ({status})" |
*
*/
export const api_sourcing_was_asked_on: ((inputs: Api_Sourcing_Was_Asked_OnInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Was_Asked_OnInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "your vessel" |
*
*/
export const api_sourcing_your_vessel: ((inputs?: Api_Sourcing_Your_VesselInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Sourcing_Your_VesselInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{name} arrives" |
*
*/
export const api_visuals_arrives: ((inputs: Api_Visuals_ArrivesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Visuals_ArrivesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Arrives · {name}" |
*
*/
export const api_visuals_calendar_arrives: ((inputs: Api_Visuals_Calendar_ArrivesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Visuals_Calendar_ArrivesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Delivery {number} · {status}" |
*
*/
export const api_visuals_calendar_delivery: ((inputs: Api_Visuals_Calendar_DeliveryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Visuals_Calendar_DeliveryInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Invoice {number} due · {customer}" |
*
*/
export const api_visuals_calendar_invoice_due: ((inputs: Api_Visuals_Calendar_Invoice_DueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Visuals_Calendar_Invoice_DueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quote due · {name}" |
*
*/
export const api_visuals_calendar_quote_due: ((inputs: Api_Visuals_Calendar_Quote_DueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Visuals_Calendar_Quote_DueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{n} d" |
*
*/
export const api_visuals_days: ((inputs: Api_Visuals_DaysInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Visuals_DaysInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Actual" |
*
*/
export const api_visuals_gp_actual: ((inputs?: Api_Visuals_Gp_ActualInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Visuals_Gp_ActualInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "At quote" |
*
*/
export const api_visuals_gp_at_quote: ((inputs?: Api_Visuals_Gp_At_QuoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Visuals_Gp_At_QuoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Freight" |
*
*/
export const api_visuals_gp_freight: ((inputs?: Api_Visuals_Gp_FreightInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Visuals_Gp_FreightInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "FX" |
*
*/
export const api_visuals_gp_fx: ((inputs?: Api_Visuals_Gp_FxInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Visuals_Gp_FxInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Recovered" |
*
*/
export const api_visuals_gp_recovered: ((inputs?: Api_Visuals_Gp_RecoveredInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Visuals_Gp_RecoveredInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier prices" |
*
*/
export const api_visuals_gp_supplier_prices: ((inputs?: Api_Visuals_Gp_Supplier_PricesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Visuals_Gp_Supplier_PricesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{n} min" |
*
*/
export const api_visuals_minutes: ((inputs: Api_Visuals_MinutesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Visuals_MinutesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{name}: quote due" |
*
*/
export const api_visuals_quote_due: ((inputs: Api_Visuals_Quote_DueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Visuals_Quote_DueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Time to acknowledge" |
*
*/
export const api_visuals_target_acknowledge: ((inputs?: Api_Visuals_Target_AcknowledgeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Visuals_Target_AcknowledgeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Deliveries on time, 6 weeks" |
*
*/
export const api_visuals_target_on_time: ((inputs?: Api_Visuals_Target_On_TimeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Visuals_Target_On_TimeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quote turnaround" |
*
*/
export const api_visuals_target_turnaround: ((inputs?: Api_Visuals_Target_TurnaroundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Visuals_Target_TurnaroundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Win rate, 12 weeks" |
*
*/
export const api_visuals_target_win_rate: ((inputs?: Api_Visuals_Target_Win_RateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Api_Visuals_Target_Win_RateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "drafts only, confidence on every value" |
*
*/
export const automations_ai_note: ((inputs?: Automations_Ai_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Automations_Ai_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Assign owners, update proven events, calculate waiting times" |
*
*/
export const automations_auto_assign: ((inputs?: Automations_Auto_AssignInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Automations_Auto_AssignInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Calculate costs, FX conversions, margins and comparisons" |
*
*/
export const automations_auto_calculate: ((inputs?: Automations_Auto_CalculateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Automations_Auto_CalculateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Capture emails, link files, extract draft data, spot likely duplicates" |
*
*/
export const automations_auto_capture: ((inputs?: Automations_Auto_CaptureInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Automations_Auto_CaptureInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Prepare linked quotations, POs, bills and invoice drafts" |
*
*/
export const automations_auto_prepare: ((inputs?: Automations_Auto_PrepareInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Automations_Auto_PrepareInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Create reminders, escalations, dashboards and daily briefings" |
*
*/
export const automations_auto_remind: ((inputs?: Automations_Auto_RemindInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Automations_Auto_RemindInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Mark as reviewed?" |
*
*/
export const automations_confirm_heading: ((inputs?: Automations_Confirm_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Automations_Confirm_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Confirm reviewed" |
*
*/
export const automations_confirm_label: ((inputs?: Automations_Confirm_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Automations_Confirm_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{title} Confirm you checked the flagged fields at the source. Your name goes on the audit log; the AI's values are never applied without this." |
*
*/
export const automations_confirm_text: ((inputs: Automations_Confirm_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Automations_Confirm_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "every one explicit" |
*
*/
export const automations_enabled_note: ((inputs?: Automations_Enabled_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Automations_Enabled_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "AI-assisted" |
*
*/
export const automations_figure_ai: ((inputs?: Automations_Figure_AiInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Automations_Figure_AiInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Rules enabled" |
*
*/
export const automations_figure_enabled: ((inputs?: Automations_Figure_EnabledInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Automations_Figure_EnabledInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Mark reviewed" |
*
*/
export const automations_mark_reviewed: ((inputs?: Automations_Mark_ReviewedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Automations_Mark_ReviewedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{count} of {total} rules" |
*
*/
export const automations_of_rules: ((inputs: Automations_Of_RulesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Automations_Of_RulesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open" |
*
*/
export const automations_open: ((inputs?: Automations_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Automations_OpenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Commercial commitments, accounting postings and payments" |
*
*/
export const automations_people_commitments: ((inputs?: Automations_People_CommitmentsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Automations_People_CommitmentsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "External messages and follow-ups unless explicitly pre-approved" |
*
*/
export const automations_people_messages: ((inputs?: Automations_People_MessagesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Automations_People_MessagesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Owner overrides, exception resolution, discretionary closure" |
*
*/
export const automations_people_overrides: ((inputs?: Automations_People_OverridesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Automations_People_OverridesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Final selling prices, discounts, substitutions, supplier selection" |
*
*/
export const automations_people_prices: ((inputs?: Automations_People_PricesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Automations_People_PricesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Uncertain matches, technical interpretation, missing information" |
*
*/
export const automations_people_uncertain: ((inputs?: Automations_People_UncertainInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Automations_People_UncertainInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing waiting for review." |
*
*/
export const automations_review_empty: ((inputs?: Automations_Review_EmptyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Automations_Review_EmptyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Below the confidence threshold the AI never applies a value: it leaves the field blank or the match unlinked and waits here for a person." |
*
*/
export const automations_review_note: ((inputs?: Automations_Review_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Automations_Review_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reviewed — your name is on the audit log" |
*
*/
export const automations_reviewed_done: ((inputs?: Automations_Reviewed_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Automations_Reviewed_DoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Delivered" |
*
*/
export const case_overview_delivered: ((inputs?: Case_Overview_DeliveredInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Case_Overview_DeliveredInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The case ended here — {next}" |
*
*/
export const case_overview_ended: ((inputs: Case_Overview_EndedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Case_Overview_EndedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{label}: {value} of {total} lines" |
*
*/
export const case_overview_gauge_a11y: ((inputs: Case_Overview_Gauge_A11yInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Case_Overview_Gauge_A11yInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Invoiced" |
*
*/
export const case_overview_invoiced: ((inputs?: Case_Overview_InvoicedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Case_Overview_InvoicedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Ordered" |
*
*/
export const case_overview_ordered: ((inputs?: Case_Overview_OrderedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Case_Overview_OrderedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Paused at the customer's decision — {next}" |
*
*/
export const case_overview_paused: ((inputs: Case_Overview_PausedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Case_Overview_PausedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Phase {phase}" |
*
*/
export const case_overview_phase: ((inputs: Case_Overview_PhaseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Case_Overview_PhaseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Received" |
*
*/
export const case_overview_received: ((inputs?: Case_Overview_ReceivedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Case_Overview_ReceivedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Step {step} of {total}" |
*
*/
export const case_overview_step: ((inputs: Case_Overview_StepInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Case_Overview_StepInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The activity log of a ship-supply case at Golden Sea, from the customer's RFQ to payment. Say where it stands and what is blocking it." |
*
*/
export const case_overview_summary_context: ((inputs?: Case_Overview_Summary_ContextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Case_Overview_Summary_ContextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Catch me up on this case" |
*
*/
export const case_overview_summary_label: ((inputs?: Case_Overview_Summary_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Case_Overview_Summary_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Amount paid" |
*
*/
export const cash_amount_paid: ((inputs?: Cash_Amount_PaidInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Amount_PaidInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Applied" |
*
*/
export const cash_applied: ((inputs?: Cash_AppliedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_AppliedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "New details applied to {supplier} and verified. Payments can use them." |
*
*/
export const cash_applied_alert: ((inputs: Cash_Applied_AlertInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Applied_AlertInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Apply new bank details" |
*
*/
export const cash_apply_bank_details: ((inputs?: Cash_Apply_Bank_DetailsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Apply_Bank_DetailsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Apply details" |
*
*/
export const cash_apply_details: ((inputs?: Cash_Apply_DetailsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Apply_DetailsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "New bank details applied to {supplier} — verified by two people." |
*
*/
export const cash_apply_done: ((inputs: Cash_Apply_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Apply_DoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Apply the new bank details to {supplier}?" |
*
*/
export const cash_apply_heading: ((inputs: Cash_Apply_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Apply_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Two people approved the change. From now on payments to this supplier go to the new account." |
*
*/
export const cash_apply_text: ((inputs?: Cash_Apply_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Apply_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Bank reference" |
*
*/
export const cash_bank_reference: ((inputs?: Cash_Bank_ReferenceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Bank_ReferenceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Cash, next 8 weeks" |
*
*/
export const cash_bridge_label: ((inputs?: Cash_Bridge_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Bridge_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Expected receipts less committed supplier payments and the budget's fixed costs" |
*
*/
export const cash_bridge_note: ((inputs?: Cash_Bridge_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Bridge_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Call back on" |
*
*/
export const cash_call_back_on: ((inputs?: Cash_Call_Back_OnInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Call_Back_OnInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Currency" |
*
*/
export const cash_currency: ((inputs?: Cash_CurrencyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_CurrencyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Current account" |
*
*/
export const cash_current_account: ((inputs?: Cash_Current_AccountInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Current_AccountInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Fixed costs" |
*
*/
export const cash_fixed_costs: ((inputs?: Cash_Fixed_CostsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Fixed_CostsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Cash in vs out, next 8 weeks" |
*
*/
export const cash_forecast_label: ((inputs?: Cash_Forecast_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Forecast_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "EGP thousands, by week. Receipts by invoice due date (overdue counted this week, chronic late payers a week later); payments by bill and balance due dates. B..." |
*
*/
export const cash_forecast_subhead: ((inputs?: Cash_Forecast_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Forecast_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "EGP thousands, by week. Receipts by invoice due date (overdue counted this week, chronic late payers a week later); payments by bill and balance due dates, p..." |
*
*/
export const cash_forecast_subhead_fixed: ((inputs: Cash_Forecast_Subhead_FixedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Forecast_Subhead_FixedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Payments to {supplier} stay on the old, verified account until two different people — Finance and the CEO — approve after a call-back on the number on file." |
*
*/
export const cash_held_alert: ((inputs: Cash_Held_AlertInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Held_AlertInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Invoice numbers" |
*
*/
export const cash_invoice_numbers: ((inputs?: Cash_Invoice_NumbersInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Invoice_NumbersInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Every invoice number mentioned, comma-separated." |
*
*/
export const cash_invoice_numbers_hint: ((inputs?: Cash_Invoice_Numbers_HintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Invoice_Numbers_HintInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Match a remittance" |
*
*/
export const cash_match_prompt: ((inputs?: Cash_Match_PromptInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Match_PromptInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Net cash, 8 weeks" |
*
*/
export const cash_net_8_weeks: ((inputs?: Cash_Net_8_WeeksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Net_8_WeeksInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Net cash" |
*
*/
export const cash_net_cash: ((inputs?: Cash_Net_CashInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Net_CashInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Expected receipts − committed payments − fixed costs" |
*
*/
export const cash_net_note: ((inputs?: Cash_Net_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Net_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Never: {phone}" |
*
*/
export const cash_never: ((inputs: Cash_NeverInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_NeverInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No open invoices to match." |
*
*/
export const cash_no_open_invoices: ((inputs?: Cash_No_Open_InvoicesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_No_Open_InvoicesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "On this device" |
*
*/
export const cash_on_this_device: ((inputs?: Cash_On_This_DeviceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_On_This_DeviceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Paid by" |
*
*/
export const cash_paid_by: ((inputs?: Cash_Paid_ByInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Paid_ByInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Read and match" |
*
*/
export const cash_read_and_match: ((inputs?: Cash_Read_And_MatchInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Read_And_MatchInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receipts" |
*
*/
export const cash_receipts: ((inputs?: Cash_ReceiptsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_ReceiptsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Paste the remittance or payment advice…" |
*
*/
export const cash_remittance_placeholder: ((inputs?: Cash_Remittance_PlaceholderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Remittance_PlaceholderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Paste a customer's payment advice or remittance email: the invoice numbers and amount are read on this device, then matched to open invoices (by number, or b..." |
*
*/
export const cash_remittance_text: ((inputs?: Cash_Remittance_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Remittance_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Request came by" |
*
*/
export const cash_request_came_by: ((inputs?: Cash_Request_Came_ByInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Request_Came_ByInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Requested" |
*
*/
export const cash_requested: ((inputs?: Cash_RequestedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_RequestedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{bank} · {iban}" |
*
*/
export const cash_requested_value: ((inputs: Cash_Requested_ValueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Requested_ValueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Cash in (expected receipts)" |
*
*/
export const cash_series_in: ((inputs?: Cash_Series_InInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Series_InInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Cash out (payables + fixed costs)" |
*
*/
export const cash_series_out: ((inputs?: Cash_Series_OutInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Series_OutInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approved" |
*
*/
export const cash_status_approved: ((inputs?: Cash_Status_ApprovedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Status_ApprovedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approved 1 of 2" |
*
*/
export const cash_status_approved_1_of_2: ((inputs?: Cash_Status_Approved_1_Of_2Inputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Status_Approved_1_Of_2Inputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pending" |
*
*/
export const cash_status_pending: ((inputs?: Cash_Status_PendingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Status_PendingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Rejected" |
*
*/
export const cash_status_rejected: ((inputs?: Cash_Status_RejectedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Status_RejectedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Applied & verified" |
*
*/
export const cash_step_applied: ((inputs?: Cash_Step_AppliedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Step_AppliedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Call-back on number on file" |
*
*/
export const cash_step_call_back: ((inputs?: Cash_Step_Call_BackInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Step_Call_BackInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "First approval" |
*
*/
export const cash_step_first_approval: ((inputs?: Cash_Step_First_ApprovalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Step_First_ApprovalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Request received" |
*
*/
export const cash_step_request_received: ((inputs?: Cash_Step_Request_ReceivedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Step_Request_ReceivedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Second approval" |
*
*/
export const cash_step_second_approval: ((inputs?: Cash_Step_Second_ApprovalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Step_Second_ApprovalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Suppliers" |
*
*/
export const cash_suppliers: ((inputs?: Cash_SuppliersInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_SuppliersInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Waiting for an approver." |
*
*/
export const cash_waiting_for_approver: ((inputs?: Cash_Waiting_For_ApproverInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_Waiting_For_ApproverInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "You have decided — a second, different person must approve." |
*
*/
export const cash_you_decided: ((inputs?: Cash_You_DecidedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Cash_You_DecidedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Line {line}: customer acceptance recorded." |
*
*/
export const commercial_acceptance_done: ((inputs: Commercial_Acceptance_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Acceptance_DoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Line {line} uses an alternative pack. The quotation can only show it as accepted with the customer's written confirmation." |
*
*/
export const commercial_acceptance_text: ((inputs: Commercial_Acceptance_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Acceptance_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer accepted in writing" |
*
*/
export const commercial_accepted_in_writing: ((inputs?: Commercial_Accepted_In_WritingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Accepted_In_WritingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "all lines priced" |
*
*/
export const commercial_all_lines_priced: ((inputs?: Commercial_All_Lines_PricedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_All_Lines_PricedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Equal per line" |
*
*/
export const commercial_allocation_lines: ((inputs?: Commercial_Allocation_LinesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Allocation_LinesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "By quantity" |
*
*/
export const commercial_allocation_qty: ((inputs?: Commercial_Allocation_QtyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Allocation_QtyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "By line value" |
*
*/
export const commercial_allocation_value: ((inputs?: Commercial_Allocation_ValueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Allocation_ValueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{title} · {status}. Karim Balbaa decides in Approvals." |
*
*/
export const commercial_approval_pending: ((inputs: Commercial_Approval_PendingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Approval_PendingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approval requested from Karim Balbaa. He decides in Approvals." |
*
*/
export const commercial_approval_requested_done: ((inputs?: Commercial_Approval_Requested_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Approval_Requested_DoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approval requested from Karim Balbaa." |
*
*/
export const commercial_approval_requested_short: ((inputs?: Commercial_Approval_Requested_ShortInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Approval_Requested_ShortInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Rule: every customer quotation, discounts above {max}% and margin exceptions go to Karim Balbaa. Exceptions travel with the request." |
*
*/
export const commercial_approval_rule: ((inputs: Commercial_Approval_RuleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Approval_RuleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approve" |
*
*/
export const commercial_approve: ((inputs?: Commercial_ApproveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_ApproveInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approved {number} — it can be sent" |
*
*/
export const commercial_approved_done: ((inputs: Commercial_Approved_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Approved_DoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Actual" |
*
*/
export const commercial_charge_actual: ((inputs?: Commercial_Charge_ActualInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Charge_ActualInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Confirmed" |
*
*/
export const commercial_charge_confirmed: ((inputs?: Commercial_Charge_ConfirmedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Charge_ConfirmedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Estimate" |
*
*/
export const commercial_charge_estimate: ((inputs?: Commercial_Charge_EstimateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Charge_EstimateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | allocation | output |
* | --- | --- |
* | "value" | "Allocated by line value. Estimates are marked; actuals replace them at close." |
* | "qty" | "Allocated by quantity. Estimates are marked; actuals replace them at close." |
* | "lines" | "Allocated equal per line. Estimates are marked; actuals replace them at close." |
* | * | "Allocated {allocation}. Estimates are marked; actuals replace them at close." |
*
*/
export const commercial_charges_allocated: ((inputs: Commercial_Charges_AllocatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Charges_AllocatedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "VAT: supply to a foreign vessel in transit is expected at 0% — finance confirms. The quotation shows prices excl. VAT." |
*
*/
export const commercial_charges_vat: ((inputs?: Commercial_Charges_VatInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Charges_VatInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Check again" |
*
*/
export const commercial_check_again: ((inputs?: Commercial_Check_AgainInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Check_AgainInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{supplier}: may differ from the request — check" |
*
*/
export const commercial_check_no: ((inputs: Commercial_Check_NoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Check_NoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Offer {n} from {supplier}: {offered}. Supplier note: {note}." |
*
*/
export const commercial_check_offer: ((inputs: Commercial_Check_OfferInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Check_OfferInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Check offers against the request" |
*
*/
export const commercial_check_offers: ((inputs?: Commercial_Check_OffersInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Check_OffersInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Does offer {n} ({supplier}) match the requested item: the same product, brand or an approved equivalent, unit and pack size?" |
*
*/
export const commercial_check_question: ((inputs: Commercial_Check_QuestionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Check_QuestionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Requested: {description} — {requested}. Rules: {rules}." |
*
*/
export const commercial_check_requested: ((inputs: Commercial_Check_RequestedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Check_RequestedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{supplier}: matches the request" |
*
*/
export const commercial_check_yes: ((inputs: Commercial_Check_YesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Check_YesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Amount" |
*
*/
export const commercial_col_amount: ((inputs?: Commercial_Col_AmountInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Col_AmountInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approved quote" |
*
*/
export const commercial_col_approved_quote: ((inputs?: Commercial_Col_Approved_QuoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Col_Approved_QuoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Charge" |
*
*/
export const commercial_col_charge: ((inputs?: Commercial_Col_ChargeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Col_ChargeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Checks" |
*
*/
export const commercial_col_checks: ((inputs?: Commercial_Col_ChecksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Col_ChecksInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Field" |
*
*/
export const commercial_col_field: ((inputs?: Commercial_Col_FieldInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Col_FieldInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Landed" |
*
*/
export const commercial_col_landed: ((inputs?: Commercial_Col_LandedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Col_LandedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Landed · EGP / {unit}" |
*
*/
export const commercial_col_landed_per: ((inputs: Commercial_Col_Landed_PerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Col_Landed_PerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Lead" |
*
*/
export const commercial_col_lead: ((inputs?: Commercial_Col_LeadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Col_LeadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Line · selected supplier(s)" |
*
*/
export const commercial_col_line_supplier: ((inputs?: Commercial_Col_Line_SupplierInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Col_Line_SupplierInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Margin %" |
*
*/
export const commercial_col_margin_pct: ((inputs?: Commercial_Col_Margin_PctInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Col_Margin_PctInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Markup" |
*
*/
export const commercial_col_markup: ((inputs?: Commercial_Col_MarkupInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Col_MarkupInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Offered" |
*
*/
export const commercial_col_offered: ((inputs?: Commercial_Col_OfferedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Col_OfferedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "+ Shared" |
*
*/
export const commercial_col_plus_shared: ((inputs?: Commercial_Col_Plus_SharedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Col_Plus_SharedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Portal" |
*
*/
export const commercial_col_portal: ((inputs?: Commercial_Col_PortalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Col_PortalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Price (as offered)" |
*
*/
export const commercial_col_price_offered: ((inputs?: Commercial_Col_Price_OfferedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Col_Price_OfferedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sell ({currency})" |
*
*/
export const commercial_col_sell: ((inputs: Commercial_Col_SellInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Col_SellInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Status" |
*
*/
export const commercial_col_status: ((inputs?: Commercial_Col_StatusInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Col_StatusInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier" |
*
*/
export const commercial_col_supplier: ((inputs?: Commercial_Col_SupplierInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Col_SupplierInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Valid · terms · basis" |
*
*/
export const commercial_col_terms: ((inputs?: Commercial_Col_TermsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Col_TermsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Unit ({currency})" |
*
*/
export const commercial_col_unit: ((inputs: Commercial_Col_UnitInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Col_UnitInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Unit price · EGP / {unit}" |
*
*/
export const commercial_col_unit_price: ((inputs: Commercial_Col_Unit_PriceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Col_Unit_PriceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Compare by" |
*
*/
export const commercial_compare_by: ((inputs?: Commercial_Compare_ByInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Compare_ByInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Continue to pricing" |
*
*/
export const commercial_continue_pricing: ((inputs?: Commercial_Continue_PricingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Continue_PricingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The client is never named to the supplier. v1 stays on the case for audit; only a corrected version can be priced." |
*
*/
export const commercial_correction_note: ((inputs?: Commercial_Correction_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Correction_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Correction request sent. The offer stays blocked until a corrected version arrives." |
*
*/
export const commercial_correction_sent: ((inputs?: Commercial_Correction_SentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Correction_SentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{pct}% of requested" |
*
*/
export const commercial_coverage: ((inputs: Commercial_CoverageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_CoverageInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{pct}% of requested · exp. {expiry}" |
*
*/
export const commercial_coverage_expiry: ((inputs: Commercial_Coverage_ExpiryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Coverage_ExpiryInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Create revision" |
*
*/
export const commercial_create_revision: ((inputs?: Commercial_Create_RevisionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Create_RevisionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Currency" |
*
*/
export const commercial_currency: ((inputs?: Commercial_CurrencyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_CurrencyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "customer" |
*
*/
export const commercial_customer: ((inputs?: Commercial_CustomerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_CustomerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer decision" |
*
*/
export const commercial_customer_decision: ((inputs?: Commercial_Customer_DecisionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Customer_DecisionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer discount %" |
*
*/
export const commercial_customer_discount: ((inputs?: Commercial_Customer_DiscountInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Customer_DiscountInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer portal" |
*
*/
export const commercial_customer_portal: ((inputs?: Commercial_Customer_PortalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Customer_PortalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "the customer's portal" |
*
*/
export const commercial_customers_portal: ((inputs?: Commercial_Customers_PortalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Customers_PortalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Decision" |
*
*/
export const commercial_decision: ((inputs?: Commercial_DecisionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_DecisionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Lost" |
*
*/
export const commercial_decision_lost: ((inputs?: Commercial_Decision_LostInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Decision_LostInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Note (the lost reason, if lost)" |
*
*/
export const commercial_decision_note_label: ((inputs?: Commercial_Decision_Note_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Decision_Note_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Partially won" |
*
*/
export const commercial_decision_partially_won: ((inputs?: Commercial_Decision_Partially_WonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Decision_Partially_WonInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "e.g. PO NSM-PO-77231 received for lines 1–3" |
*
*/
export const commercial_decision_placeholder: ((inputs?: Commercial_Decision_PlaceholderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Decision_PlaceholderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Revision requested" |
*
*/
export const commercial_decision_revision_requested: ((inputs?: Commercial_Decision_Revision_RequestedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Decision_Revision_RequestedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The customer's decision on {number}. No response never means lost." |
*
*/
export const commercial_decision_text: ((inputs: Commercial_Decision_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Decision_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Won" |
*
*/
export const commercial_decision_won: ((inputs?: Commercial_Decision_WonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Decision_WonInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Difference" |
*
*/
export const commercial_difference: ((inputs?: Commercial_DifferenceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_DifferenceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Email from Odoo" |
*
*/
export const commercial_email_from_odoo: ((inputs?: Commercial_Email_From_OdooInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Email_From_OdooInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "To: {to}" |
*
*/
export const commercial_email_to: ((inputs: Commercial_Email_ToInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Email_ToInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "ETA {day} · {days} days" |
*
*/
export const commercial_eta_days: ((inputs: Commercial_Eta_DaysInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Eta_DaysInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Evidence" |
*
*/
export const commercial_evidence: ((inputs?: Commercial_EvidenceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_EvidenceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer email 17 Nov 10:12 — “500 ml cans OK”, attached" |
*
*/
export const commercial_evidence_default: ((inputs?: Commercial_Evidence_DefaultInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Evidence_DefaultInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} exception — shown to the approver as “{type}”." |
* | * | "{count} exceptions — shown to the approver as “{type}”." |
*
*/
export const commercial_exceptions: ((inputs: Commercial_ExceptionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_ExceptionsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Expected gross profit" |
*
*/
export const commercial_fig_expected_profit: ((inputs?: Commercial_Fig_Expected_ProfitInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Fig_Expected_ProfitInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Recoverable input VAT" |
*
*/
export const commercial_fig_input_vat: ((inputs?: Commercial_Fig_Input_VatInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Fig_Input_VatInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Landed cost (priced lines)" |
*
*/
export const commercial_fig_landed: ((inputs?: Commercial_Fig_LandedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Fig_LandedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Lines priced" |
*
*/
export const commercial_fig_lines_priced: ((inputs?: Commercial_Fig_Lines_PricedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Fig_Lines_PricedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Margin = profit ÷ selling price" |
*
*/
export const commercial_fig_margin: ((inputs?: Commercial_Fig_MarginInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Fig_MarginInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Markup = profit ÷ landed cost" |
*
*/
export const commercial_fig_markup: ((inputs?: Commercial_Fig_MarkupInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Fig_MarkupInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Selling total (excl. VAT)" |
*
*/
export const commercial_fig_selling: ((inputs?: Commercial_Fig_SellingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Fig_SellingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Gross profit" |
*
*/
export const commercial_gross_profit: ((inputs?: Commercial_Gross_ProfitInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Gross_ProfitInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Each offer is checked against the original line and normalised to the requested base unit (EA / L / kg) in EGP at the approved FX rate, keeping the supplier'..." |
*
*/
export const commercial_how_compared: ((inputs: Commercial_How_ComparedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_How_ComparedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Landed cost" |
*
*/
export const commercial_landed_cost: ((inputs?: Commercial_Landed_CostInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Landed_CostInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "incl. {charges} shared charges · all confirmed" |
*
*/
export const commercial_landed_note_confirmed: ((inputs: Commercial_Landed_Note_ConfirmedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Landed_Note_ConfirmedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "incl. {charges} shared charges · {count} estimate" |
*
*/
export const commercial_landed_note_estimates: ((inputs: Commercial_Landed_Note_EstimatesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Landed_Note_EstimatesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Language" |
*
*/
export const commercial_language: ((inputs?: Commercial_LanguageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_LanguageInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{days} d" |
*
*/
export const commercial_lead_days: ((inputs: Commercial_Lead_DaysInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Lead_DaysInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Please find attached our quotation {number} for {vessel} (your ref. {ref}), delivery on board at {port}." |
*
*/
export const commercial_letter_body: ((inputs: Commercial_Letter_BodyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Letter_BodyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Golden Sea for Trading & Marketing" |
*
*/
export const commercial_letter_company: ((inputs?: Commercial_Letter_CompanyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Letter_CompanyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Dear {name}," |
*
*/
export const commercial_letter_dear: ((inputs: Commercial_Letter_DearInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Letter_DearInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Best regards," |
*
*/
export const commercial_letter_regards: ((inputs?: Commercial_Letter_RegardsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Letter_RegardsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Valid until {day}. Prices exclude VAT." |
*
*/
export const commercial_letter_valid: ((inputs: Commercial_Letter_ValidInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Letter_ValidInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{description} · requested {requested}" |
*
*/
export const commercial_line_requested: ((inputs: Commercial_Line_RequestedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Line_RequestedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{selected} of {total} lines selected" |
*
*/
export const commercial_lines_selected: ((inputs: Commercial_Lines_SelectedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Lines_SelectedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Margin for line {line}" |
*
*/
export const commercial_margin_for_line: ((inputs: Commercial_Margin_For_LineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Margin_For_LineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Margin {margin} · markup {markup}" |
*
*/
export const commercial_margin_markup: ((inputs: Commercial_Margin_MarkupInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Margin_MarkupInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{profit} ÷ {sell} · the policy is set on margin" |
*
*/
export const commercial_margin_note: ((inputs: Commercial_Margin_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Margin_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Margin % per line" |
*
*/
export const commercial_margin_per_line: ((inputs?: Commercial_Margin_Per_LineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Margin_Per_LineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "margin against the {target}% target" |
*
*/
export const commercial_margin_vs_target: ((inputs: Commercial_Margin_Vs_TargetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Margin_Vs_TargetInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{profit} ÷ {landed} · a 25% margin is a 33.3% markup" |
*
*/
export const commercial_markup_note: ((inputs: Commercial_Markup_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Markup_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Match" |
*
*/
export const commercial_match: ((inputs?: Commercial_MatchInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_MatchInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Message" |
*
*/
export const commercial_message: ((inputs?: Commercial_MessageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_MessageInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "+ {freight} · {note}" |
*
*/
export const commercial_metric_freight: ((inputs: Commercial_Metric_FreightInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Metric_FreightInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "landed {amount}" |
*
*/
export const commercial_metric_landed: ((inputs: Commercial_Metric_LandedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Metric_LandedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "no freight · {note}" |
*
*/
export const commercial_metric_no_freight: ((inputs: Commercial_Metric_No_FreightInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Metric_No_FreightInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No exceptions — standard approval." |
*
*/
export const commercial_no_exceptions: ((inputs?: Commercial_No_ExceptionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_No_ExceptionsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No issues" |
*
*/
export const commercial_no_issues: ((inputs?: Commercial_No_IssuesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_No_IssuesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "no lines requested yet" |
*
*/
export const commercial_no_lines_yet: ((inputs?: Commercial_No_Lines_YetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_No_Lines_YetInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No offers yet." |
*
*/
export const commercial_no_offers: ((inputs?: Commercial_No_OffersInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_No_OffersInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No offer passes every check yet — no recommendation." |
*
*/
export const commercial_no_recommendation: ((inputs?: Commercial_No_RecommendationInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_No_RecommendationInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "none" |
*
*/
export const commercial_none: ((inputs?: Commercial_NoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_NoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Not sent to suppliers yet: {missing}. Waiting for the customer's answer." |
*
*/
export const commercial_not_sent_yet: ((inputs: Commercial_Not_Sent_YetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Not_Sent_YetInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "e.g. Helmets split to make the ETA; launch estimate confirmed tomorrow" |
*
*/
export const commercial_note_approver_placeholder: ((inputs?: Commercial_Note_Approver_PlaceholderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Note_Approver_PlaceholderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Note for the approver" |
*
*/
export const commercial_note_for_approver: ((inputs?: Commercial_Note_For_ApproverInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Note_For_ApproverInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "of the selling price" |
*
*/
export const commercial_of_selling_price: ((inputs?: Commercial_Of_Selling_PriceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Of_Selling_PriceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "of the lines" |
*
*/
export const commercial_of_the_lines: ((inputs?: Commercial_Of_The_LinesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Of_The_LinesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{supplier} v{version}" |
*
*/
export const commercial_offer_version: ((inputs: Commercial_Offer_VersionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Offer_VersionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "OK" |
*
*/
export const commercial_ok: ((inputs?: Commercial_OkInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_OkInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "on top of landed cost" |
*
*/
export const commercial_on_top_landed: ((inputs?: Commercial_On_Top_LandedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_On_Top_LandedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open approvals" |
*
*/
export const commercial_open_approvals: ((inputs?: Commercial_Open_ApprovalsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Open_ApprovalsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "6th of October City, Giza Governorate · demo document" |
*
*/
export const commercial_paper_address: ((inputs?: Commercial_Paper_AddressInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_AddressInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Attention" |
*
*/
export const commercial_paper_attention: ((inputs?: Commercial_Paper_AttentionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_AttentionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "FOR TRADING & MARKETING · EST. 2011" |
*
*/
export const commercial_paper_brand: ((inputs?: Commercial_Paper_BrandInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_BrandInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Client Information" |
*
*/
export const commercial_paper_client: ((inputs?: Commercial_Paper_ClientInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_ClientInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Company" |
*
*/
export const commercial_paper_company: ((inputs?: Commercial_Paper_CompanyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_CompanyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Converted at {currency}/EGP {fx} (approved rate on the quotation)." |
*
*/
export const commercial_paper_converted: ((inputs: Commercial_Paper_ConvertedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_ConvertedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Date: {date}" |
*
*/
export const commercial_paper_date: ((inputs: Commercial_Paper_DateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_DateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Delivery: on board at {port} on arrival ({eta})." |
*
*/
export const commercial_paper_delivery: ((inputs: Commercial_Paper_DeliveryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_DeliveryInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Description" |
*
*/
export const commercial_paper_desc: ((inputs?: Commercial_Paper_DescInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_DescInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Less discount {pct}%" |
*
*/
export const commercial_paper_discount: ((inputs: Commercial_Paper_DiscountInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_DiscountInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "DRAFT — not yet approved. Will be issued as version {version}." |
*
*/
export const commercial_paper_draft: ((inputs: Commercial_Paper_DraftInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_DraftInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Total in {currency} (excl. VAT)" |
*
*/
export const commercial_paper_grand: ((inputs: Commercial_Paper_GrandInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_GrandInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "We are pleased to furnish our quotation as below:" |
*
*/
export const commercial_paper_intro: ((inputs?: Commercial_Paper_IntroInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_IntroInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quotation No.: {number}" |
*
*/
export const commercial_paper_no: ((inputs: Commercial_Paper_NoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_NoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Part Number" |
*
*/
export const commercial_paper_part: ((inputs?: Commercial_Paper_PartInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_PartInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Payment terms: {terms}." |
*
*/
export const commercial_paper_pay: ((inputs: Commercial_Paper_PayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_PayInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Delivery port" |
*
*/
export const commercial_paper_port: ((inputs?: Commercial_Paper_PortInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_PortInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{port} · ETA {eta}" |
*
*/
export const commercial_paper_port_eta: ((inputs: Commercial_Paper_Port_EtaInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_Port_EtaInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Prepared by: {prepared}" |
*
*/
export const commercial_paper_prepared: ((inputs: Commercial_Paper_PreparedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_PreparedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Prepared by: {prepared} · Approved by: {approved}" |
*
*/
export const commercial_paper_prepared_approved: ((inputs: Commercial_Paper_Prepared_ApprovedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_Prepared_ApprovedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Price/{currency}" |
*
*/
export const commercial_paper_price: ((inputs: Commercial_Paper_PriceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_PriceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "QTY" |
*
*/
export const commercial_paper_qty: ((inputs?: Commercial_Paper_QtyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_QtyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "QTY in the quote can’t be reduced; prices are based on the QTY listed." |
*
*/
export const commercial_paper_qty_rule: ((inputs?: Commercial_Paper_Qty_RuleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_Qty_RuleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Your ref: {ref}" |
*
*/
export const commercial_paper_ref: ((inputs: Commercial_Paper_RefInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_RefInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Remarks:" |
*
*/
export const commercial_paper_remarks: ((inputs?: Commercial_Paper_RemarksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_RemarksInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "S." |
*
*/
export const commercial_paper_s: ((inputs?: Commercial_Paper_SInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_SInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{name} — authorised signature" |
*
*/
export const commercial_paper_signature: ((inputs: Commercial_Paper_SignatureInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_SignatureInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Signature on approval" |
*
*/
export const commercial_paper_signature_pending: ((inputs?: Commercial_Paper_Signature_PendingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_Signature_PendingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Superseded — kept for audit. Not valid for ordering." |
*
*/
export const commercial_paper_superseded: ((inputs?: Commercial_Paper_SupersededInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_SupersededInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "QUOTATION" |
*
*/
export const commercial_paper_title: ((inputs?: Commercial_Paper_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Total/{currency}" |
*
*/
export const commercial_paper_total: ((inputs: Commercial_Paper_TotalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_TotalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "UOM" |
*
*/
export const commercial_paper_uom: ((inputs?: Commercial_Paper_UomInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_UomInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Valid until {day}; may be renewed thereafter upon mutual agreement." |
*
*/
export const commercial_paper_valid: ((inputs: Commercial_Paper_ValidInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_ValidInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Prices are exclusive of Value Added Tax (VAT)." |
*
*/
export const commercial_paper_vat: ((inputs?: Commercial_Paper_VatInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_VatInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Vessel" |
*
*/
export const commercial_paper_vessel: ((inputs?: Commercial_Paper_VesselInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_VesselInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Wish our offer wins your approvals ☺" |
*
*/
export const commercial_paper_wish: ((inputs?: Commercial_Paper_WishInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Paper_WishInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Policy: target {target}%, minimum {min}% (per store where set), discounts above {max}% need approval. {fx}." |
*
*/
export const commercial_policy_note: ((inputs: Commercial_Policy_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Policy_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "policy target {target}%" |
*
*/
export const commercial_policy_target: ((inputs: Commercial_Policy_TargetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Policy_TargetInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "All fields match — submission complete." |
*
*/
export const commercial_portal_all_match: ((inputs?: Commercial_Portal_All_MatchInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Portal_All_MatchInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Not marked complete: {fields} differ. Correct it in the portal or record the customer's agreement." |
*
*/
export const commercial_portal_diffs: ((inputs: Commercial_Portal_DiffsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Portal_DiffsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No screenshot compared yet." |
*
*/
export const commercial_portal_empty: ((inputs?: Commercial_Portal_EmptyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Portal_EmptyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "For customers who buy through a procurement portal: upload the confirmation screenshot and the AI compares it with the approved quotation. The submission is ..." |
*
*/
export const commercial_portal_note: ((inputs?: Commercial_Portal_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Portal_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Preview {number}" |
*
*/
export const commercial_preview_quote: ((inputs: Commercial_Preview_QuoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Preview_QuoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Price build-up per line" |
*
*/
export const commercial_price_build_up: ((inputs?: Commercial_Price_Build_UpInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Price_Build_UpInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "per {per} · total {total}" |
*
*/
export const commercial_price_note: ((inputs: Commercial_Price_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Price_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pricing policy" |
*
*/
export const commercial_pricing_policy: ((inputs?: Commercial_Pricing_PolicyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Pricing_PolicyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Print" |
*
*/
export const commercial_print: ((inputs?: Commercial_PrintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_PrintInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{pct} of it is profit" |
*
*/
export const commercial_profit_share: ((inputs: Commercial_Profit_ShareInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Profit_ShareInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quantity from {supplier}" |
*
*/
export const commercial_quantity_from: ((inputs: Commercial_Quantity_FromInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Quantity_FromInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number} approved — ready to send." |
*
*/
export const commercial_quote_approved: ((inputs: Commercial_Quote_ApprovedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Quote_ApprovedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number} was returned. Adjust the pricing and request again." |
*
*/
export const commercial_quote_returned: ((inputs: Commercial_Quote_ReturnedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Quote_ReturnedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "ready {day}" |
*
*/
export const commercial_ready: ((inputs: Commercial_ReadyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_ReadyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reason" |
*
*/
export const commercial_reason: ((inputs?: Commercial_ReasonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_ReasonInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "This is the best-fit choice. A reason is optional." |
*
*/
export const commercial_reason_best: ((inputs?: Commercial_Reason_BestInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Reason_BestInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Not the best-fit offer: give a reason. It's kept on the case and shown to the approver." |
*
*/
export const commercial_reason_not_best: ((inputs?: Commercial_Reason_Not_BestInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Reason_Not_BestInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "e.g. Delta is our approved helmet supplier; Nile only has 10 in stock" |
*
*/
export const commercial_reason_placeholder: ((inputs?: Commercial_Reason_PlaceholderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Reason_PlaceholderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{offer}: {landed} EGP / {baseUnit} landed — lowest cost on board among offers that pass every check." |
*
*/
export const commercial_recommendation_best: ((inputs: Commercial_Recommendation_BestInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Recommendation_BestInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Recommendation · Suggested" |
*
*/
export const commercial_recommendation_heading: ((inputs?: Commercial_Recommendation_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Recommendation_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Split sourcing: {split} — {cost} landed, all before ETA." |
*
*/
export const commercial_recommendation_split: ((inputs: Commercial_Recommendation_SplitInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Recommendation_SplitInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Split sourcing: {split} — {cost} landed, saves {saves} vs the best single supplier, all before ETA." |
*
*/
export const commercial_recommendation_split_saves: ((inputs: Commercial_Recommendation_Split_SavesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Recommendation_Split_SavesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Record" |
*
*/
export const commercial_record: ((inputs?: Commercial_RecordInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_RecordInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Record customer acceptance" |
*
*/
export const commercial_record_acceptance: ((inputs?: Commercial_Record_AcceptanceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Record_AcceptanceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Record acceptance" |
*
*/
export const commercial_record_acceptance_confirm: ((inputs?: Commercial_Record_Acceptance_ConfirmInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Record_Acceptance_ConfirmInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Record customer decision" |
*
*/
export const commercial_record_decision: ((inputs?: Commercial_Record_DecisionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Record_DecisionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Request approval" |
*
*/
export const commercial_request_approval: ((inputs?: Commercial_Request_ApprovalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Request_ApprovalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Creates the customer quotation ({lines} priced lines, {sell} excl. VAT, margin {margin}) and a {type} approval for Karim Balbaa. Nothing is sent to the custo..." |
*
*/
export const commercial_request_approval_text: ((inputs: Commercial_Request_Approval_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Request_Approval_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Requested: {requested} · {rules}" |
*
*/
export const commercial_requested_rules: ((inputs: Commercial_Requested_RulesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Requested_RulesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Return" |
*
*/
export const commercial_return: ((inputs?: Commercial_ReturnInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_ReturnInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Return {number}" |
*
*/
export const commercial_return_heading: ((inputs: Commercial_Return_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Return_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "e.g. Re-check line 3 — margin too thin for a new supplier" |
*
*/
export const commercial_return_placeholder: ((inputs?: Commercial_Return_PlaceholderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Return_PlaceholderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Return {number} to the preparer. A reason is required and goes on the case timeline." |
*
*/
export const commercial_return_text: ((inputs: Commercial_Return_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Return_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Returned to the preparer with your reason." |
*
*/
export const commercial_returned_done: ((inputs?: Commercial_Returned_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Returned_DoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Revise {number}" |
*
*/
export const commercial_revise_heading: ((inputs: Commercial_Revise_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Revise_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "e.g. Customer asked for ESAB on line 1" |
*
*/
export const commercial_revise_placeholder: ((inputs?: Commercial_Revise_PlaceholderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Revise_PlaceholderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Creates version {version} as a draft with the same lines; {number} is kept for audit and marked superseded." |
*
*/
export const commercial_revise_text: ((inputs: Commercial_Revise_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Revise_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Soaad Amer (Sales) sees selling prices on the quotation; supplier costs, landed costs and margins are restricted to supply chain, finance and management." |
*
*/
export const commercial_sales_note: ((inputs?: Commercial_Sales_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Sales_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Save selection" |
*
*/
export const commercial_save_selection: ((inputs?: Commercial_Save_SelectionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Save_SelectionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Select" |
*
*/
export const commercial_select: ((inputs?: Commercial_SelectInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_SelectInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Line {line}: {supplier} selected (best fit)" |
*
*/
export const commercial_select_done_best: ((inputs: Commercial_Select_Done_BestInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Select_Done_BestInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Line {line}: select offer" |
*
*/
export const commercial_select_heading: ((inputs: Commercial_Select_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Select_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{offer} × {qty} {unit} · {landed} landed" |
*
*/
export const commercial_select_offer_line: ((inputs: Commercial_Select_Offer_LineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Select_Offer_LineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Selected" |
*
*/
export const commercial_selected: ((inputs?: Commercial_SelectedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_SelectedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | inferred | output |
* | --- | --- |
* | "yes" | "Selected: {selected} (from the line status)" |
* | * | "Selected: {selected}" |
*
*/
export const commercial_selected_note: ((inputs: Commercial_Selected_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Selected_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | inferred | output |
* | --- | --- |
* | "yes" | "Selected: {selected} · {reason} (from the line status)" |
* | * | "Selected: {selected} · {reason}" |
*
*/
export const commercial_selected_note_reason: ((inputs: Commercial_Selected_Note_ReasonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Selected_Note_ReasonInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Selected × {qty}" |
*
*/
export const commercial_selected_qty: ((inputs: Commercial_Selected_QtyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Selected_QtyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Line {line}: selection saved to the case." |
*
*/
export const commercial_selection_saved: ((inputs: Commercial_Selection_SavedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Selection_SavedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{sell} at {currency}/EGP {fx}" |
*
*/
export const commercial_sell_note: ((inputs: Commercial_Sell_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Sell_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{sell} at {currency}/EGP {fx} · after {discount}% discount" |
*
*/
export const commercial_sell_note_discount: ((inputs: Commercial_Sell_Note_DiscountInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Sell_Note_DiscountInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Send" |
*
*/
export const commercial_send: ((inputs?: Commercial_SendInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_SendInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "AI draft · Nothing is sent until you confirm." |
*
*/
export const commercial_send_ai_draft: ((inputs?: Commercial_Send_Ai_DraftInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Send_Ai_DraftInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Send the correction request?" |
*
*/
export const commercial_send_correction_heading: ((inputs?: Commercial_Send_Correction_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Send_Correction_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "To {to}: “{subject}”." |
*
*/
export const commercial_send_correction_text: ((inputs: Commercial_Send_Correction_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Send_Correction_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Email from Odoo — To: {to} · Subject: Quotation {number} — {vessel} — ref. {ref} · Attachment: {number}.pdf" |
*
*/
export const commercial_send_email_line: ((inputs: Commercial_Send_Email_LineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Send_Email_LineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Send {number}" |
*
*/
export const commercial_send_heading: ((inputs: Commercial_Send_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Send_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer portal — enter the quotation in {portal}, then upload the confirmation screenshot below — the submission is only complete when it matches the approv..." |
*
*/
export const commercial_send_portal_line: ((inputs: Commercial_Send_Portal_LineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Send_Portal_LineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Send to customer" |
*
*/
export const commercial_send_to_customer: ((inputs?: Commercial_Send_To_CustomerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Send_To_CustomerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Send to supplier" |
*
*/
export const commercial_send_to_supplier: ((inputs?: Commercial_Send_To_SupplierInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Send_To_SupplierInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "sent {when} via {method}" |
*
*/
export const commercial_sent_via: ((inputs: Commercial_Sent_ViaInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Sent_ViaInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Shared charges allocated" |
*
*/
export const commercial_shared_allocated: ((inputs?: Commercial_Shared_AllocatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Shared_AllocatedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Shared charges" |
*
*/
export const commercial_shared_charges: ((inputs?: Commercial_Shared_ChargesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Shared_ChargesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Split across suppliers…" |
*
*/
export const commercial_split_across: ((inputs?: Commercial_Split_AcrossInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Split_AcrossInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The quantities add up to {qty} {unit}." |
*
*/
export const commercial_split_adds_up: ((inputs: Commercial_Split_Adds_UpInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Split_Adds_UpInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Line {line}: split sourcing" |
*
*/
export const commercial_split_heading: ((inputs: Commercial_Split_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Split_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{offer} · {landed} EGP / {baseUnit} landed · up to {max} {unit}" |
*
*/
export const commercial_split_part_note: ((inputs: Commercial_Split_Part_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Split_Part_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "If this isn't the recommended split, give a reason: it's kept on the case and shown to the approver." |
*
*/
export const commercial_split_reason: ((inputs?: Commercial_Split_ReasonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Split_ReasonInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approval requested" |
*
*/
export const commercial_step_approval_requested: ((inputs?: Commercial_Step_Approval_RequestedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Step_Approval_RequestedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approved" |
*
*/
export const commercial_step_approved: ((inputs?: Commercial_Step_ApprovedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Step_ApprovedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Prepared" |
*
*/
export const commercial_step_prepared: ((inputs?: Commercial_Step_PreparedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Step_PreparedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sent" |
*
*/
export const commercial_step_sent: ((inputs?: Commercial_Step_SentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Step_SentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Submission method" |
*
*/
export const commercial_submission_method: ((inputs?: Commercial_Submission_MethodInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Submission_MethodInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier cost" |
*
*/
export const commercial_supplier_cost: ((inputs?: Commercial_Supplier_CostInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Supplier_CostInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Agency" |
*
*/
export const commercial_tag_agency: ((inputs?: Commercial_Tag_AgencyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Tag_AgencyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "AI check" |
*
*/
export const commercial_tag_ai_check: ((inputs?: Commercial_Tag_Ai_CheckInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Tag_Ai_CheckInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "AI draft" |
*
*/
export const commercial_tag_ai_draft: ((inputs?: Commercial_Tag_Ai_DraftInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Tag_Ai_DraftInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Best fit" |
*
*/
export const commercial_tag_best_fit: ((inputs?: Commercial_Tag_Best_FitInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Tag_Best_FitInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Cheapest unit price" |
*
*/
export const commercial_tag_cheapest_unit: ((inputs?: Commercial_Tag_Cheapest_UnitInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Tag_Cheapest_UnitInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Own stock" |
*
*/
export const commercial_tag_own_stock: ((inputs?: Commercial_Tag_Own_StockInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Tag_Own_StockInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "target {target}% · min {min}%" |
*
*/
export const commercial_target_min: ((inputs: Commercial_Target_MinInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Target_MinInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No expiry · {terms}" |
*
*/
export const commercial_terms_no_expiry: ((inputs: Commercial_Terms_No_ExpiryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Terms_No_ExpiryInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Valid to {day} · {terms}" |
*
*/
export const commercial_terms_valid: ((inputs: Commercial_Terms_ValidInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Terms_ValidInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{count} to follow as a revision" |
*
*/
export const commercial_to_follow: ((inputs: Commercial_To_FollowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_To_FollowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Total shared" |
*
*/
export const commercial_total_shared: ((inputs?: Commercial_Total_SharedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Total_SharedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Unit price" |
*
*/
export const commercial_unit_price: ((inputs?: Commercial_Unit_PriceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Unit_PriceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "L{line} · {description} — {status}: no cost yet, excluded from this version." |
*
*/
export const commercial_unpriced_line: ((inputs: Commercial_Unpriced_LineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Unpriced_LineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Upload screenshot & compare" |
*
*/
export const commercial_upload_compare: ((inputs?: Commercial_Upload_CompareInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Upload_CompareInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Use suggested split" |
*
*/
export const commercial_use_split: ((inputs?: Commercial_Use_SplitInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Use_SplitInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "14% on local supplier bills — excluded from cost" |
*
*/
export const commercial_vat_note: ((inputs?: Commercial_Vat_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Vat_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "View quotation" |
*
*/
export const commercial_view_quotation: ((inputs?: Commercial_View_QuotationInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_View_QuotationInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "What changes" |
*
*/
export const commercial_what_changes: ((inputs?: Commercial_What_ChangesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_What_ChangesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Within policy." |
*
*/
export const commercial_within_policy: ((inputs?: Commercial_Within_PolicyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Commercial_Within_PolicyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "open" |
*
*/
export const control_room_ageing_center: ((inputs?: Control_Room_Ageing_CenterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Ageing_CenterInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receivables by age" |
*
*/
export const control_room_ageing_label: ((inputs?: Control_Room_Ageing_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Ageing_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "AI draft" |
*
*/
export const control_room_ai_draft: ((inputs?: Control_Room_Ai_DraftInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Ai_DraftInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "All cases" |
*
*/
export const control_room_all_cases: ((inputs?: Control_Room_All_CasesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_All_CasesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approvals" |
*
*/
export const control_room_approvals: ((inputs?: Control_Room_ApprovalsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_ApprovalsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The assistant reads and answers; it never sends, prices or pays." |
*
*/
export const control_room_ask_footnote: ((inputs?: Control_Room_Ask_FootnoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Ask_FootnoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Ask about a vessel or case number, approvals, who owes us money, suppliers, deadlines or the growth pipeline. Answers come from the live records and link to ..." |
*
*/
export const control_room_ask_intro: ((inputs?: Control_Room_Ask_IntroInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Ask_IntroInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Golden Sea assistant" |
*
*/
export const control_room_ask_name: ((inputs?: Control_Room_Ask_NameInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Ask_NameInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Ask Golden Sea…" |
*
*/
export const control_room_ask_placeholder: ((inputs?: Control_Room_Ask_PlaceholderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Ask_PlaceholderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "What's the status of Aurora Crest?" |
*
*/
export const control_room_ask_question: ((inputs?: Control_Room_Ask_QuestionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Ask_QuestionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reading cases, approvals, invoices and suppliers…" |
*
*/
export const control_room_ask_reading: ((inputs?: Control_Room_Ask_ReadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Ask_ReadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Assistant" |
*
*/
export const control_room_assistant: ((inputs?: Control_Room_AssistantInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_AssistantInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Summarised again at {at} from {count} live records. A draft to read — nothing is sent, priced or paid." |
*
*/
export const control_room_briefing_summarised: ((inputs: Control_Room_Briefing_SummarisedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Briefing_SummarisedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Written at 07:00 from {count} live records. A draft to read — nothing is sent, priced or paid." |
*
*/
export const control_room_briefing_written: ((inputs: Control_Room_Briefing_WrittenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Briefing_WrittenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Inquiries per day, last 12 weeks" |
*
*/
export const control_room_days_label: ((inputs?: Control_Room_Days_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Days_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{total} inquiries in 12 weeks · busiest {day} ({count})" |
*
*/
export const control_room_days_summary: ((inputs: Control_Room_Days_SummaryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Days_SummaryInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Control room · for Karim Balbaa & Mohamed Helmy" |
*
*/
export const control_room_eyebrow: ((inputs?: Control_Room_EyebrowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_EyebrowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Avg time to quote" |
*
*/
export const control_room_figure_avg_time_to_quote: ((inputs?: Control_Room_Figure_Avg_Time_To_QuoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Figure_Avg_Time_To_QuoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Gross profit" |
*
*/
export const control_room_figure_gross_profit: ((inputs?: Control_Room_Figure_Gross_ProfitInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Figure_Gross_ProfitInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open RFQs" |
*
*/
export const control_room_figure_open_rfqs: ((inputs?: Control_Room_Figure_Open_RfqsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Figure_Open_RfqsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receivables open" |
*
*/
export const control_room_figure_receivables_open: ((inputs?: Control_Room_Figure_Receivables_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Figure_Receivables_OpenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Waiting on suppliers" |
*
*/
export const control_room_figure_waiting_on_suppliers: ((inputs?: Control_Room_Figure_Waiting_On_SuppliersInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Figure_Waiting_On_SuppliersInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Win rate" |
*
*/
export const control_room_figure_win_rate: ((inputs?: Control_Room_Figure_Win_RateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Figure_Win_RateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quote funnel, the last 12 weeks" |
*
*/
export const control_room_funnel_12w: ((inputs?: Control_Room_Funnel_12wInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Funnel_12wInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quote funnel, the last 4 weeks" |
*
*/
export const control_room_funnel_4w: ((inputs?: Control_Room_Funnel_4wInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Funnel_4wInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "RFQ cases received in the last 12 weeks, how many were quoted and how many won" |
*
*/
export const control_room_funnel_note_12w: ((inputs?: Control_Room_Funnel_Note_12wInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Funnel_Note_12wInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "RFQ cases received in the last 4 weeks, how many were quoted and how many won" |
*
*/
export const control_room_funnel_note_4w: ((inputs?: Control_Room_Funnel_Note_4wInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Funnel_Note_4wInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The business, live." |
*
*/
export const control_room_heading: ((inputs?: Control_Room_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} inquiry" |
* | * | "{count} inquiries" |
*
*/
export const control_room_inquiries: ((inputs: Control_Room_InquiriesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_InquiriesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "lost" |
*
*/
export const control_room_lost_center: ((inputs?: Control_Room_Lost_CenterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Lost_CenterInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Why quotes were lost" |
*
*/
export const control_room_lost_label: ((inputs?: Control_Room_Lost_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Lost_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Gross profit, margins, receivables and cash flow are shown to management and finance only." |
*
*/
export const control_room_money_withheld: ((inputs?: Control_Room_Money_WithheldInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Money_WithheldInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{month}: {note}" |
*
*/
export const control_room_month_note: ((inputs: Control_Room_Month_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Month_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{points} m" |
*
*/
export const control_room_range_months: ((inputs: Control_Room_Range_MonthsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Range_MonthsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{points} w" |
*
*/
export const control_room_range_weeks: ((inputs: Control_Room_Range_WeeksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Range_WeeksInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receivables & payables" |
*
*/
export const control_room_receivables_payables: ((inputs?: Control_Room_Receivables_PayablesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_Receivables_PayablesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Briefed at 07:00 from every case, quote, delivery and payment — and answers to any question about them." |
*
*/
export const control_room_subtitle: ((inputs?: Control_Room_SubtitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_SubtitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Summarise" |
*
*/
export const control_room_summarise: ((inputs?: Control_Room_SummariseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Control_Room_SummariseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "IMO" |
*
*/
export const growth_column_imo: ((inputs?: Growth_Column_ImoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Growth_Column_ImoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Ship manager" |
*
*/
export const growth_column_manager: ((inputs?: Growth_Column_ManagerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Growth_Column_ManagerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Type" |
*
*/
export const growth_column_type: ((inputs?: Growth_Column_TypeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Growth_Column_TypeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Vessel" |
*
*/
export const growth_column_vessel: ((inputs?: Growth_Column_VesselInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Growth_Column_VesselInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Company" |
*
*/
export const growth_extract_company: ((inputs?: Growth_Extract_CompanyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Growth_Extract_CompanyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Expires" |
*
*/
export const growth_extract_expires: ((inputs?: Growth_Extract_ExpiresInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Growth_Extract_ExpiresInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "the expiry or renewal date" |
*
*/
export const growth_extract_expires_hint: ((inputs?: Growth_Extract_Expires_HintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Growth_Extract_Expires_HintInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Issued" |
*
*/
export const growth_extract_issued: ((inputs?: Growth_Extract_IssuedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Growth_Extract_IssuedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Read a registration document" |
*
*/
export const growth_extract_label: ((inputs?: Growth_Extract_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Growth_Extract_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Commercial register no." |
*
*/
export const growth_extract_registration: ((inputs?: Growth_Extract_RegistrationInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Growth_Extract_RegistrationInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Tax card no." |
*
*/
export const growth_extract_tax: ((inputs?: Growth_Extract_TaxInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Growth_Extract_TaxInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "company registration document (commercial register, tax card or vendor certificate)" |
*
*/
export const growth_extract_what: ((inputs?: Growth_Extract_WhatInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Growth_Extract_WhatInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{count} of {size} vessels on file · {supplied} supplied" |
*
*/
export const growth_fleet_supporting: ((inputs: Growth_Fleet_SupportingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Growth_Fleet_SupportingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Not yet" |
*
*/
export const growth_not_yet: ((inputs?: Growth_Not_YetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Growth_Not_YetInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplied" |
*
*/
export const growth_supplied: ((inputs?: Growth_SuppliedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Growth_SuppliedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Unread notifications for someone back at their desk at a ship chandler: say what needs them first." |
*
*/
export const home_away_context: ((inputs?: Home_Away_ContextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Home_Away_ContextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "While you were away" |
*
*/
export const home_away_label: ((inputs?: Home_Away_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Home_Away_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Awaiting customer decision" |
*
*/
export const home_figure_awaiting_customer_decision: ((inputs?: Home_Figure_Awaiting_Customer_DecisionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Home_Figure_Awaiting_Customer_DecisionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Awaiting internal approval" |
*
*/
export const home_figure_awaiting_internal_approval: ((inputs?: Home_Figure_Awaiting_Internal_ApprovalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Home_Figure_Awaiting_Internal_ApprovalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Awaiting supplier" |
*
*/
export const home_figure_awaiting_supplier: ((inputs?: Home_Figure_Awaiting_SupplierInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Home_Figure_Awaiting_SupplierInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Deliveries in progress" |
*
*/
export const home_figure_deliveries_in_progress: ((inputs?: Home_Figure_Deliveries_In_ProgressInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Home_Figure_Deliveries_In_ProgressInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Expected gross profit, Nov" |
*
*/
export const home_figure_expected_gross_profit_nov: ((inputs?: Home_Figure_Expected_Gross_Profit_NovInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Home_Figure_Expected_Gross_Profit_NovInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Inquiries, last 4 weeks" |
*
*/
export const home_figure_inquiries_4_weeks: ((inputs?: Home_Figure_Inquiries_4_WeeksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Home_Figure_Inquiries_4_WeeksInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "My quote turnaround" |
*
*/
export const home_figure_my_quote_turnaround: ((inputs?: Home_Figure_My_Quote_TurnaroundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Home_Figure_My_Quote_TurnaroundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Net cash, next 8 weeks" |
*
*/
export const home_figure_net_cash_8_weeks: ((inputs?: Home_Figure_Net_Cash_8_WeeksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Home_Figure_Net_Cash_8_WeeksInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Out-of-hours RFQs" |
*
*/
export const home_figure_out_of_hours_rfqs: ((inputs?: Home_Figure_Out_Of_Hours_RfqsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Home_Figure_Out_Of_Hours_RfqsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quote turnaround" |
*
*/
export const home_figure_quote_turnaround: ((inputs?: Home_Figure_Quote_TurnaroundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Home_Figure_Quote_TurnaroundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receivables" |
*
*/
export const home_figure_receivables: ((inputs?: Home_Figure_ReceivablesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Home_Figure_ReceivablesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Time to acknowledge" |
*
*/
export const home_figure_time_to_acknowledge: ((inputs?: Home_Figure_Time_To_AcknowledgeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Home_Figure_Time_To_AcknowledgeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Won, last 4 weeks" |
*
*/
export const home_figure_won_4_weeks: ((inputs?: Home_Figure_Won_4_WeeksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Home_Figure_Won_4_WeeksInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Late" |
*
*/
export const home_late: ((inputs?: Home_LateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Home_LateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Send by hand" |
*
*/
export const inbox_ack_by_hand: ((inputs?: Inbox_Ack_By_HandInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Ack_By_HandInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Template: {template}. WhatsApp / form source: the owner sends it — the system never messages the customer by itself here." |
*
*/
export const inbox_ack_note_manual: ((inputs: Inbox_Ack_Note_ManualInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Ack_Note_ManualInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Template: {template}. Sent once from the approved template — never twice, even if the email is re-processed." |
*
*/
export const inbox_ack_note_once: ((inputs: Inbox_Ack_Note_OnceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Ack_Note_OnceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sent once on create" |
*
*/
export const inbox_ack_on_create: ((inputs?: Inbox_Ack_On_CreateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Ack_On_CreateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sent once · {when}" |
*
*/
export const inbox_ack_sent: ((inputs: Inbox_Ack_SentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Ack_SentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "AI draft" |
*
*/
export const inbox_ai_draft: ((inputs?: Inbox_Ai_DraftInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Ai_DraftInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Suggested by the assignment rules: {rule}." |
*
*/
export const inbox_assignment_rule: ((inputs: Inbox_Assignment_RuleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Assignment_RuleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Suggested by the assignment rules: {rule}. Change them when you create the case." |
*
*/
export const inbox_assignment_rule_change: ((inputs: Inbox_Assignment_Rule_ChangeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Assignment_Rule_ChangeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Backup" |
*
*/
export const inbox_backup: ((inputs?: Inbox_BackupInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_BackupInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Case {caseId} created from this message and linked to it." |
*
*/
export const inbox_case_created: ((inputs: Inbox_Case_CreatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Case_CreatedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Case {caseId} was created from this message." |
*
*/
export const inbox_case_was_created: ((inputs: Inbox_Case_Was_CreatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Case_Was_CreatedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{kind} · {account} — {status}" |
*
*/
export const inbox_channel: ((inputs: Inbox_ChannelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_ChannelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Check against the original" |
*
*/
export const inbox_check_original: ((inputs?: Inbox_Check_OriginalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Check_OriginalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Clarification request, drafted and not sent" |
*
*/
export const inbox_clarification_subject: ((inputs?: Inbox_Clarification_SubjectInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Clarification_SubjectInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Confidence" |
*
*/
export const inbox_col_confidence: ((inputs?: Inbox_Col_ConfidenceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Col_ConfidenceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Item" |
*
*/
export const inbox_col_item: ((inputs?: Inbox_Col_ItemInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Col_ItemInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Part no." |
*
*/
export const inbox_col_part_no: ((inputs?: Inbox_Col_Part_NoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Col_Part_NoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Qty" |
*
*/
export const inbox_col_qty: ((inputs?: Inbox_Col_QtyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Col_QtyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Source" |
*
*/
export const inbox_col_source: ((inputs?: Inbox_Col_SourceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Col_SourceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Unit" |
*
*/
export const inbox_col_unit: ((inputs?: Inbox_Col_UnitInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Col_UnitInputs, { locale?: "en" | "ar" }, {}>;
/**
* | linesPlural | output |
* | --- | --- |
* | "one" | "RFQ case for {customer} with {lines} line, owner {owner}. The original message stays linked to it." |
* | * | "RFQ case for {customer} with {lines} lines, owner {owner}. The original message stays linked to it." |
*
*/
export const inbox_create_rfq: ((inputs: Inbox_Create_RfqInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Create_RfqInputs, { locale?: "en" | "ar" }, {}>;
/**
* | linesPlural | output |
* | --- | --- |
* | "one" | "RFQ case for {customer} with {lines} line ({flagged} flagged for clarification), owner {owner}. The original message stays linked to it." |
* | * | "RFQ case for {customer} with {lines} lines ({flagged} flagged for clarification), owner {owner}. The original message stays linked to it." |
*
*/
export const inbox_create_rfq_flagged: ((inputs: Inbox_Create_Rfq_FlaggedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Create_Rfq_FlaggedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | linesPlural | output |
* | --- | --- |
* | "one" | "Service case for {customer} with {lines} line, owner {owner}. The original message stays linked to it." |
* | * | "Service case for {customer} with {lines} lines, owner {owner}. The original message stays linked to it." |
*
*/
export const inbox_create_service: ((inputs: Inbox_Create_ServiceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Create_ServiceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | linesPlural | output |
* | --- | --- |
* | "one" | "Service case for {customer} with {lines} line ({flagged} flagged for clarification), owner {owner}. The original message stays linked to it." |
* | * | "Service case for {customer} with {lines} lines ({flagged} flagged for clarification), owner {owner}. The original message stays linked to it." |
*
*/
export const inbox_create_service_flagged: ((inputs: Inbox_Create_Service_FlaggedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Create_Service_FlaggedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Extract with AI" |
*
*/
export const inbox_extract: ((inputs?: Inbox_ExtractInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_ExtractInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The AI reads the email into a draft: customer, vessel, IMO, port, ETA, deadline and lines with IMPA / ISSA, part numbers and a confidence for every value. No..." |
*
*/
export const inbox_extract_text: ((inputs?: Inbox_Extract_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Extract_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The AI reads the email and every attachment (Excel, PDF, Word, photos) into a draft: customer, vessel, IMO, port, ETA, deadline and lines with IMPA / ISSA, p..." |
*
*/
export const inbox_extract_text_files: ((inputs?: Inbox_Extract_Text_FilesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Extract_Text_FilesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Looks like an automatic reply" |
*
*/
export const inbox_flag_auto_reply: ((inputs?: Inbox_Flag_Auto_ReplyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Flag_Auto_ReplyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "It doesn't answer the request — supplier reminders keep running." |
*
*/
export const inbox_flag_auto_reply_note: ((inputs?: Inbox_Flag_Auto_Reply_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Flag_Auto_Reply_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Asks to change bank or payment details" |
*
*/
export const inbox_flag_bank: ((inputs?: Inbox_Flag_BankInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Flag_BankInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Don't act on it from the email: a bank-detail change needs two people (Finance and the CEO) and a call-back on the number already on file." |
*
*/
export const inbox_flag_bank_note: ((inputs?: Inbox_Flag_Bank_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Flag_Bank_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The sender can't supply" |
*
*/
export const inbox_flag_cannot_supply: ((inputs?: Inbox_Flag_Cannot_SupplyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Flag_Cannot_SupplyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Look for another supplier for these lines before the deadline." |
*
*/
export const inbox_flag_cannot_supply_note: ((inputs?: Inbox_Flag_Cannot_Supply_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Flag_Cannot_Supply_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "From: {name} <{email}>" |
*
*/
export const inbox_from: ((inputs: Inbox_FromInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_FromInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Everything is reviewed — it's ready for approval." |
*
*/
export const inbox_history_approval_ready: ((inputs?: Inbox_History_Approval_ReadyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Approval_ReadyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Only management approves the import — nothing from the history becomes a record before Karim Balbaa says yes. Confidential threads stay out." |
*
*/
export const inbox_history_approval_text: ((inputs?: Inbox_History_Approval_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Approval_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Waiting for Karim Balbaa (management). {blocked}" |
*
*/
export const inbox_history_approval_waiting: ((inputs: Inbox_History_Approval_WaitingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Approval_WaitingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approve import" |
*
*/
export const inbox_history_approve: ((inputs?: Inbox_History_ApproveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_ApproveInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Import approved — customers, vessels, suppliers and dated prices saved" |
*
*/
export const inbox_history_approve_done: ((inputs?: Inbox_History_Approve_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Approve_DoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approved by {by}." |
*
*/
export const inbox_history_approved_by: ((inputs: Inbox_History_Approved_ByInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Approved_ByInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Attachments" |
*
*/
export const inbox_history_col_attachments: ((inputs?: Inbox_History_Col_AttachmentsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Col_AttachmentsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Calls" |
*
*/
export const inbox_history_col_calls: ((inputs?: Inbox_History_Col_CallsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Col_CallsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "What they quote" |
*
*/
export const inbox_history_col_categories: ((inputs?: Inbox_History_Col_CategoriesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Col_CategoriesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Country" |
*
*/
export const inbox_history_col_country: ((inputs?: Inbox_History_Col_CountryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Col_CountryInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer" |
*
*/
export const inbox_history_col_customer: ((inputs?: Inbox_History_Col_CustomerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Col_CustomerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Fleet" |
*
*/
export const inbox_history_col_fleet: ((inputs?: Inbox_History_Col_FleetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Col_FleetInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "IMO" |
*
*/
export const inbox_history_col_imo: ((inputs?: Inbox_History_Col_ImoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Col_ImoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Item" |
*
*/
export const inbox_history_col_item: ((inputs?: Inbox_History_Col_ItemInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Col_ItemInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Mailbox" |
*
*/
export const inbox_history_col_mailbox: ((inputs?: Inbox_History_Col_MailboxInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Col_MailboxInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "PO" |
*
*/
export const inbox_history_col_po: ((inputs?: Inbox_History_Col_PoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Col_PoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Ports" |
*
*/
export const inbox_history_col_ports: ((inputs?: Inbox_History_Col_PortsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Col_PortsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Price" |
*
*/
export const inbox_history_col_price: ((inputs?: Inbox_History_Col_PriceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Col_PriceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Lines quoted" |
*
*/
export const inbox_history_col_quoted: ((inputs?: Inbox_History_Col_QuotedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Col_QuotedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quoted" |
*
*/
export const inbox_history_col_quoted_at: ((inputs?: Inbox_History_Col_Quoted_AtInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Col_Quoted_AtInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "RFQs" |
*
*/
export const inbox_history_col_rfqs: ((inputs?: Inbox_History_Col_RfqsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Col_RfqsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Source" |
*
*/
export const inbox_history_col_source: ((inputs?: Inbox_History_Col_SourceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Col_SourceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier" |
*
*/
export const inbox_history_col_supplier: ((inputs?: Inbox_History_Col_SupplierInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Col_SupplierInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Vessel" |
*
*/
export const inbox_history_col_vessel: ((inputs?: Inbox_History_Col_VesselInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Col_VesselInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Years" |
*
*/
export const inbox_history_col_years: ((inputs?: Inbox_History_Col_YearsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Col_YearsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approve the history import?" |
*
*/
export const inbox_history_confirm_heading: ((inputs?: Inbox_History_Confirm_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Confirm_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Saves {totals} and {prices} dated prices from {kept} de-duplicated messages, with your {decisions} decisions on the uncertain items. Rejected and confidentia..." |
*
*/
export const inbox_history_confirm_text: ((inputs: Inbox_History_Confirm_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Confirm_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{kind}: {name}" |
*
*/
export const inbox_history_created: ((inputs: Inbox_History_CreatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_CreatedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customers" |
*
*/
export const inbox_history_customers: ((inputs?: Inbox_History_CustomersInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_CustomersInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{count} found · top 5 by RFQs" |
*
*/
export const inbox_history_customers_found: ((inputs: Inbox_History_Customers_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Customers_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "ship managers & owners" |
*
*/
export const inbox_history_customers_note: ((inputs?: Inbox_History_Customers_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Customers_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Dated prices" |
*
*/
export const inbox_history_dated_prices: ((inputs?: Inbox_History_Dated_PricesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Dated_PricesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{label}: {count} removed" |
*
*/
export const inbox_history_dedup_a11y: ((inputs: Inbox_History_Dedup_A11yInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Dedup_A11yInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The same email often sits in three mailboxes. Each message is kept once, with all its copies linked." |
*
*/
export const inbox_history_dedup_note: ((inputs?: Inbox_History_Dedup_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Dedup_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "− {count}" |
*
*/
export const inbox_history_dedup_value: ((inputs: Inbox_History_Dedup_ValueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Dedup_ValueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sourcing desk · your history" |
*
*/
export const inbox_history_eyebrow: ((inputs?: Inbox_History_EyebrowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_EyebrowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Inbox history" |
*
*/
export const inbox_history_heading: ((inputs?: Inbox_History_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Business messages kept" |
*
*/
export const inbox_history_kept: ((inputs?: Inbox_History_KeptInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_KeptInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "of {scanned} scanned" |
*
*/
export const inbox_history_kept_share: ((inputs: Inbox_History_Kept_ShareInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Kept_ShareInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "All of Golden Sea's mailboxes and WhatsApp exports, read in a dry run first — nothing is saved before approval." |
*
*/
export const inbox_history_mailboxes_note: ((inputs?: Inbox_History_Mailboxes_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Mailboxes_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Messages" |
*
*/
export const inbox_history_messages: ((inputs?: Inbox_History_MessagesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_MessagesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "New to Odoo" |
*
*/
export const inbox_history_new_to_odoo: ((inputs?: Inbox_History_New_To_OdooInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_New_To_OdooInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No PO — still remembered" |
*
*/
export const inbox_history_no_po: ((inputs?: Inbox_History_No_PoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_No_PoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Ordered" |
*
*/
export const inbox_history_ordered: ((inputs?: Inbox_History_OrderedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_OrderedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Organise the history first." |
*
*/
export const inbox_history_organise_first: ((inputs?: Inbox_History_Organise_FirstInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Organise_FirstInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Then management approves the import. Nothing from the history becomes a record before." |
*
*/
export const inbox_history_organise_note: ((inputs?: Inbox_History_Organise_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Organise_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Press Organise: the AI reads the kept messages and builds your customers, vessels, suppliers and dated prices. Anything it isn't sure of comes to you first." |
*
*/
export const inbox_history_organise_text: ((inputs?: Inbox_History_Organise_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Organise_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Organised" |
*
*/
export const inbox_history_organised: ((inputs?: Inbox_History_OrganisedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_OrganisedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} uncertain item still need a decision." |
* | * | "{count} uncertain items still need a decision." |
*
*/
export const inbox_history_pending_decision: ((inputs: Inbox_History_Pending_DecisionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Pending_DecisionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Messages per year" |
*
*/
export const inbox_history_per_year: ((inputs?: Inbox_History_Per_YearInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Per_YearInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{price} / {per}" |
*
*/
export const inbox_history_price: ((inputs: Inbox_History_PriceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_PriceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "hidden for your role" |
*
*/
export const inbox_history_price_hidden: ((inputs?: Inbox_History_Price_HiddenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Price_HiddenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{count} prices, each with its date and validity" |
*
*/
export const inbox_history_prices_found: ((inputs: Inbox_History_Prices_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Prices_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{count} with no PO" |
*
*/
export const inbox_history_prices_note: ((inputs: Inbox_History_Prices_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Prices_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{count} messages · 2019–2026" |
*
*/
export const inbox_history_scanned: ((inputs: Inbox_History_ScannedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_ScannedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Your history is searchable from day one: {totals} and {prices} dated prices." |
*
*/
export const inbox_history_searchable: ((inputs: Inbox_History_SearchableInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_SearchableInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Status: imported · approved by {by}" |
*
*/
export const inbox_history_status_approved: ((inputs: Inbox_History_Status_ApprovedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Status_ApprovedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Status: dry run ready — nothing has been imported" |
*
*/
export const inbox_history_status_dry_run: ((inputs?: Inbox_History_Status_Dry_RunInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Status_Dry_RunInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "Status: {count} uncertain item to review" |
* | * | "Status: {count} uncertain items to review" |
*
*/
export const inbox_history_status_pending: ((inputs: Inbox_History_Status_PendingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Status_PendingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Status: waiting for management's approval" |
*
*/
export const inbox_history_status_waiting: ((inputs?: Inbox_History_Status_WaitingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Status_WaitingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Connect mailboxes" |
*
*/
export const inbox_history_step_connect: ((inputs?: Inbox_History_Step_ConnectInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Step_ConnectInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "De-duplicate" |
*
*/
export const inbox_history_step_dedup: ((inputs?: Inbox_History_Step_DedupInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Step_DedupInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Organise" |
*
*/
export const inbox_history_step_organise: ((inputs?: Inbox_History_Step_OrganiseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Step_OrganiseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Review uncertain" |
*
*/
export const inbox_history_step_review: ((inputs?: Inbox_History_Step_ReviewInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Step_ReviewInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Scan (dry run)" |
*
*/
export const inbox_history_step_scan: ((inputs?: Inbox_History_Step_ScanInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Step_ScanInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "We organise your past, not just your future: every inbox, every year." |
*
*/
export const inbox_history_subtitle: ((inputs?: Inbox_History_SubtitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_SubtitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Suppliers" |
*
*/
export const inbox_history_suppliers: ((inputs?: Inbox_History_SuppliersInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_SuppliersInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{count} found · incl. ones you never ordered from" |
*
*/
export const inbox_history_suppliers_found: ((inputs: Inbox_History_Suppliers_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Suppliers_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "who quoted what" |
*
*/
export const inbox_history_suppliers_note: ((inputs?: Inbox_History_Suppliers_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Suppliers_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | customersPlural | vesselsPlural | suppliersPlural | output |
* | --- | --- | --- | --- |
* | * | * | * | "{customersText} customers, {vesselsText} vessels, {suppliersText} suppliers" |
*
*/
export const inbox_history_totals: ((inputs: Inbox_History_TotalsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_TotalsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Vessels" |
*
*/
export const inbox_history_vessels: ((inputs?: Inbox_History_VesselsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_VesselsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{count} found · matched by IMO, renames kept" |
*
*/
export const inbox_history_vessels_found: ((inputs: Inbox_History_Vessels_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Vessels_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "IMO · fleet · ports" |
*
*/
export const inbox_history_vessels_note: ((inputs?: Inbox_History_Vessels_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_History_Vessels_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Kept as received" |
*
*/
export const inbox_kept_as_received: ((inputs?: Inbox_Kept_As_ReceivedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Kept_As_ReceivedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Complaint" |
*
*/
export const inbox_kind_complaint: ((inputs?: Inbox_Kind_ComplaintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Kind_ComplaintInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Delivery or logistics" |
*
*/
export const inbox_kind_delivery: ((inputs?: Inbox_Kind_DeliveryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Kind_DeliveryInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Invoice or payment query" |
*
*/
export const inbox_kind_invoice: ((inputs?: Inbox_Kind_InvoiceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Kind_InvoiceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier offer or reply" |
*
*/
export const inbox_kind_offer: ((inputs?: Inbox_Kind_OfferInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Kind_OfferInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer PO or order" |
*
*/
export const inbox_kind_order: ((inputs?: Inbox_Kind_OrderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Kind_OrderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Other" |
*
*/
export const inbox_kind_other: ((inputs?: Inbox_Kind_OtherInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Kind_OtherInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "New RFQ" |
*
*/
export const inbox_kind_rfq: ((inputs?: Inbox_Kind_RfqInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Kind_RfqInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Linked to case {caseId}." |
*
*/
export const inbox_linked: ((inputs: Inbox_LinkedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_LinkedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Linked to case {caseId} by {by}." |
*
*/
export const inbox_linked_by: ((inputs: Inbox_Linked_ByInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Linked_ByInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Its offer and files are on the case." |
*
*/
export const inbox_linked_text: ((inputs?: Inbox_Linked_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Linked_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Low-confidence values are never applied without a person checking them." |
*
*/
export const inbox_low_confidence: ((inputs?: Inbox_Low_ConfidenceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Low_ConfidenceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Match reply" |
*
*/
export const inbox_match: ((inputs?: Inbox_MatchInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_MatchInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Replies are matched by their supplier-RFQ reference even when the subject changes; forwards by their files. Below 85% a person decides." |
*
*/
export const inbox_match_text: ((inputs?: Inbox_Match_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Match_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The match is uncertain, so it isn't linked. Pick its case under Reply match, or mark it not related." |
*
*/
export const inbox_match_uncertain: ((inputs?: Inbox_Match_UncertainInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Match_UncertainInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Message id {id} · re-processing the same message never creates a second case or acknowledgement." |
*
*/
export const inbox_message_id: ((inputs: Inbox_Message_IdInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Message_IdInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "New customer" |
*
*/
export const inbox_new_customer: ((inputs?: Inbox_New_CustomerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_New_CustomerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Next: send the supplier RFQs for its lines." |
*
*/
export const inbox_next_rfqs: ((inputs?: Inbox_Next_RfqsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Next_RfqsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No clarification request was drafted for these." |
*
*/
export const inbox_no_clarification: ((inputs?: Inbox_No_ClarificationInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_No_ClarificationInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "(no text)" |
*
*/
export const inbox_no_text: ((inputs?: Inbox_No_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_No_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Not an RFQ" |
*
*/
export const inbox_not_an_rfq: ((inputs?: Inbox_Not_An_RfqInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Not_An_RfqInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Marked not related." |
*
*/
export const inbox_not_related: ((inputs?: Inbox_Not_RelatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Not_RelatedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Marked not related by {by}." |
*
*/
export const inbox_not_related_by: ((inputs: Inbox_Not_Related_ByInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Not_Related_ByInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Marked “not an RFQ”." |
*
*/
export const inbox_not_rfq: ((inputs?: Inbox_Not_RfqInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Not_RfqInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing more to do with this message." |
*
*/
export const inbox_nothing_more: ((inputs?: Inbox_Nothing_MoreInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Nothing_MoreInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Currency" |
*
*/
export const inbox_offer_currency: ((inputs?: Inbox_Offer_CurrencyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Offer_CurrencyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pull out the offer details" |
*
*/
export const inbox_offer_extract: ((inputs?: Inbox_Offer_ExtractInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Offer_ExtractInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Item offered" |
*
*/
export const inbox_offer_item: ((inputs?: Inbox_Offer_ItemInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Offer_ItemInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Lead time" |
*
*/
export const inbox_offer_lead_time: ((inputs?: Inbox_Offer_Lead_TimeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Offer_Lead_TimeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Unit / pack size" |
*
*/
export const inbox_offer_pack: ((inputs?: Inbox_Offer_PackInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Offer_PackInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Unit price" |
*
*/
export const inbox_offer_price: ((inputs?: Inbox_Offer_PriceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Offer_PriceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Valid until" |
*
*/
export const inbox_offer_validity: ((inputs?: Inbox_Offer_ValidityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Offer_ValidityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open case" |
*
*/
export const inbox_open_case: ((inputs?: Inbox_Open_CaseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Open_CaseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Order" |
*
*/
export const inbox_order: ((inputs?: Inbox_OrderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_OrderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Newest first" |
*
*/
export const inbox_order_newest: ((inputs?: Inbox_Order_NewestInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Order_NewestInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Most urgent first" |
*
*/
export const inbox_order_urgent: ((inputs?: Inbox_Order_UrgentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Order_UrgentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Owner" |
*
*/
export const inbox_owner: ((inputs?: Inbox_OwnerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_OwnerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pick a message in the list." |
*
*/
export const inbox_pick_message: ((inputs?: Inbox_Pick_MessageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Pick_MessageInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quote deadline" |
*
*/
export const inbox_quote_deadline: ((inputs?: Inbox_Quote_DeadlineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Quote_DeadlineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "A reminder is scheduled before it." |
*
*/
export const inbox_reminder_scheduled: ((inputs?: Inbox_Reminder_ScheduledInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Reminder_ScheduledInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Send supplier RFQs" |
*
*/
export const inbox_send_rfqs: ((inputs?: Inbox_Send_RfqsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Send_RfqsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Show messages" |
*
*/
export const inbox_show: ((inputs?: Inbox_ShowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_ShowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "All" |
*
*/
export const inbox_show_all: ((inputs?: Inbox_Show_AllInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Show_AllInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Linked" |
*
*/
export const inbox_show_linked: ((inputs?: Inbox_Show_LinkedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Show_LinkedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "New" |
*
*/
export const inbox_show_new: ((inputs?: Inbox_Show_NewInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Show_NewInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Needs review" |
*
*/
export const inbox_show_review: ((inputs?: Inbox_Show_ReviewInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Show_ReviewInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Needs review · {count}" |
*
*/
export const inbox_show_review_count: ((inputs: Inbox_Show_Review_CountInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_Show_Review_CountInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "To: {name} <{email}>" |
*
*/
export const inbox_to: ((inputs: Inbox_ToInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_ToInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Processed today: {processed} · duplicates suppressed: {duplicates} · waiting for a person: {review}" |
*
*/
export const inbox_today: ((inputs: Inbox_TodayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_TodayInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Via: {via} · {when}" |
*
*/
export const inbox_via: ((inputs: Inbox_ViaInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Inbox_ViaInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{currency} {amount}" |
*
*/
export const index_money: ((inputs: Index_MoneyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Index_MoneyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{currency} {amount}k" |
*
*/
export const index_money_k: ((inputs: Index_Money_KInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Index_Money_KInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "From: Golden Sea <{from}>" |
*
*/
export const integrations_ack_from: ((inputs: Integrations_Ack_FromInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Ack_FromInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Example for GS-RFQ-0142. Wording, recipients and trigger were approved by management; changing them needs a new approval." |
*
*/
export const integrations_ack_note: ((inputs?: Integrations_Ack_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Ack_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{status} v{version} · {approvedBy}" |
*
*/
export const integrations_ack_status: ((inputs: Integrations_Ack_StatusInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Ack_StatusInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "To: {to}" |
*
*/
export const integrations_ack_to: ((inputs: Integrations_Ack_ToInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Ack_ToInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "All message templates" |
*
*/
export const integrations_all_templates: ((inputs?: Integrations_All_TemplatesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_All_TemplatesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The staging copy is where changes are tried before they reach your team; email sending and integrations are switched off there. Your data is always yours: ex..." |
*
*/
export const integrations_backups_note: ((inputs?: Integrations_Backups_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Backups_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Checked against Odoo" |
*
*/
export const integrations_checked_label: ((inputs?: Integrations_Checked_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Checked_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | nPlural | output |
* | --- | --- |
* | * | "{checked} records checked by a person" |
*
*/
export const integrations_checked_note: ((inputs: Integrations_Checked_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Checked_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Company default" |
*
*/
export const integrations_company_default: ((inputs?: Integrations_Company_DefaultInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Company_DefaultInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Flagged confidential" |
*
*/
export const integrations_confidential: ((inputs?: Integrations_ConfidentialInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_ConfidentialInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "excluded unless approved" |
*
*/
export const integrations_confidential_note: ((inputs?: Integrations_Confidential_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Confidential_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Copies" |
*
*/
export const integrations_copies: ((inputs?: Integrations_CopiesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_CopiesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{locations} locations · kept {days} days" |
*
*/
export const integrations_copies_value: ((inputs: Integrations_Copies_ValueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Copies_ValueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer documents in العربية (Arabic)" |
*
*/
export const integrations_documents_ar: ((inputs?: Integrations_Documents_ArInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Documents_ArInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer documents in English" |
*
*/
export const integrations_documents_en: ((inputs?: Integrations_Documents_EnInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Documents_EnInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Likely duplicates" |
*
*/
export const integrations_duplicates: ((inputs?: Integrations_DuplicatesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_DuplicatesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "linked, not re-created" |
*
*/
export const integrations_duplicates_note: ((inputs?: Integrations_Duplicates_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Duplicates_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Emails scanned" |
*
*/
export const integrations_emails_scanned: ((inputs?: Integrations_Emails_ScannedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Emails_ScannedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Exceptions" |
*
*/
export const integrations_exceptions: ((inputs?: Integrations_ExceptionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_ExceptionsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "unreadable attachments" |
*
*/
export const integrations_exceptions_note: ((inputs?: Integrations_Exceptions_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Exceptions_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | nPlural | output |
* | --- | --- |
* | * | "{days} days" |
*
*/
export const integrations_import_days: ((inputs: Integrations_Import_DaysInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Import_DaysInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Dry run first; nothing is imported before approval, and no acknowledgements or reminders are sent for historical mail." |
*
*/
export const integrations_import_note: ((inputs?: Integrations_Import_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Import_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "العربية (Arabic)" |
*
*/
export const integrations_lang_ar: ((inputs?: Integrations_Lang_ArInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Lang_ArInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The whole platform runs in English and Arabic: acknowledgements, quotations and invoices go out in the customer's language." |
*
*/
export const integrations_languages_note: ((inputs?: Integrations_Languages_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Languages_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Last backup" |
*
*/
export const integrations_last_backup: ((inputs?: Integrations_Last_BackupInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Last_BackupInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Odoo keeps running beside the platform while its data moves. Nothing in Odoo is changed or deleted." |
*
*/
export const integrations_migration_note: ((inputs?: Integrations_Migration_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Migration_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Moved into the platform" |
*
*/
export const integrations_moved_label: ((inputs?: Integrations_Moved_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Moved_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | nPlural | output |
* | --- | --- |
* | * | "{moved} of {all} records" |
*
*/
export const integrations_moved_note: ((inputs: Integrations_Moved_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Moved_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Never to internal senders" |
*
*/
export const integrations_never_internal: ((inputs?: Integrations_Never_InternalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Never_InternalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sent once per thread" |
*
*/
export const integrations_once_per_thread: ((inputs?: Integrations_Once_Per_ThreadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Once_Per_ThreadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open inbox history" |
*
*/
export const integrations_open_inbox_history: ((inputs?: Integrations_Open_Inbox_HistoryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Open_Inbox_HistoryInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Parts done" |
*
*/
export const integrations_parts_label: ((inputs?: Integrations_Parts_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Parts_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{done} of {total}" |
*
*/
export const integrations_parts_value: ((inputs: Integrations_Parts_ValueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Parts_ValueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Preview language" |
*
*/
export const integrations_preview_language: ((inputs?: Integrations_Preview_LanguageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Preview_LanguageInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Ready to switch Odoo off" |
*
*/
export const integrations_ready: ((inputs?: Integrations_ReadyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_ReadyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Refresh staging copy" |
*
*/
export const integrations_refresh_staging: ((inputs?: Integrations_Refresh_StagingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Refresh_StagingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Staging copy refreshed from last night's backup" |
*
*/
export const integrations_refresh_staging_done: ((inputs?: Integrations_Refresh_Staging_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Refresh_Staging_DoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Only management refreshes staging." |
*
*/
export const integrations_refresh_staging_reason: ((inputs?: Integrations_Refresh_Staging_ReasonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Refresh_Staging_ReasonInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Restore last tested" |
*
*/
export const integrations_restore_tested: ((inputs?: Integrations_Restore_TestedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Restore_TestedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "RFQ threads" |
*
*/
export const integrations_rfq_threads: ((inputs?: Integrations_Rfq_ThreadsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Rfq_ThreadsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "become historical cases" |
*
*/
export const integrations_rfq_threads_note: ((inputs?: Integrations_Rfq_Threads_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Rfq_Threads_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Schedule" |
*
*/
export const integrations_schedule: ((inputs?: Integrations_ScheduleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_ScheduleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Company settings are changed by management." |
*
*/
export const integrations_settings_by_management: ((inputs?: Integrations_Settings_By_ManagementInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Settings_By_ManagementInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Staging copy" |
*
*/
export const integrations_staging_copy: ((inputs?: Integrations_Staging_CopyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Staging_CopyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Odoo stays on until every part is done" |
*
*/
export const integrations_stays_on: ((inputs?: Integrations_Stays_OnInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Stays_OnInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Your language" |
*
*/
export const integrations_your_language: ((inputs?: Integrations_Your_LanguageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Integrations_Your_LanguageInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Agent / delivery contact" |
*
*/
export const order_to_cash_agent_contact: ((inputs?: Order_To_Cash_Agent_ContactInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Agent_ContactInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Who agreed, when and what" |
*
*/
export const order_to_cash_agreement_hint: ((inputs?: Order_To_Cash_Agreement_HintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Agreement_HintInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "AI draft from the customer's email — check it before recording" |
*
*/
export const order_to_cash_agreement_hint_ai: ((inputs?: Order_To_Cash_Agreement_Hint_AiInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Agreement_Hint_AiInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer's written agreement" |
*
*/
export const order_to_cash_agreement_label: ((inputs?: Order_To_Cash_Agreement_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Agreement_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{what} · {field}: PO says \"{po}\", quotation {quotation} says \"{quote}\"" |
*
*/
export const order_to_cash_ai_check_line: ((inputs: Order_To_Cash_Ai_Check_LineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Ai_Check_LineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "AI check · 96%" |
*
*/
export const order_to_cash_ai_check_tag: ((inputs?: Order_To_Cash_Ai_Check_TagInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Ai_Check_TagInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Line {line}" |
*
*/
export const order_to_cash_ai_line: ((inputs: Order_To_Cash_Ai_LineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Ai_LineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Second look with AI" |
*
*/
export const order_to_cash_ai_second_look: ((inputs?: Order_To_Cash_Ai_Second_LookInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Ai_Second_LookInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Terms" |
*
*/
export const order_to_cash_ai_terms: ((inputs?: Order_To_Cash_Ai_TermsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Ai_TermsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Record amendment & lift block" |
*
*/
export const order_to_cash_amendment_confirm: ((inputs?: Order_To_Cash_Amendment_ConfirmInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Amendment_ConfirmInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Amendment recorded on line {line} — evidence attached." |
*
*/
export const order_to_cash_amendment_done: ((inputs: Order_To_Cash_Amendment_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Amendment_DoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Record customer amendment — line header" |
*
*/
export const order_to_cash_amendment_heading_header: ((inputs?: Order_To_Cash_Amendment_Heading_HeaderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Amendment_Heading_HeaderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Record customer amendment — line {line}" |
*
*/
export const order_to_cash_amendment_heading_line: ((inputs: Order_To_Cash_Amendment_Heading_LineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Amendment_Heading_LineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{field} — PO: {po} · Quotation: {quote}" |
*
*/
export const order_to_cash_amendment_intro: ((inputs: Order_To_Cash_Amendment_IntroInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Amendment_IntroInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approve & confirm {number}" |
*
*/
export const order_to_cash_approve_confirm: ((inputs: Order_To_Cash_Approve_ConfirmInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Approve_ConfirmInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Ask Karim Balbaa to approve" |
*
*/
export const order_to_cash_ask_approval: ((inputs?: Order_To_Cash_Ask_ApprovalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Ask_ApprovalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approval requested from Karim Balbaa for {number}." |
*
*/
export const order_to_cash_ask_approval_done: ((inputs: Order_To_Cash_Ask_Approval_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Ask_Approval_DoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Matched to PO and receipt" |
*
*/
export const order_to_cash_bills_matched: ((inputs?: Order_To_Cash_Bills_MatchedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Bills_MatchedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{count} on hold — 3-way match" |
*
*/
export const order_to_cash_bills_on_hold: ((inputs: Order_To_Cash_Bills_On_HoldInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Bills_On_HoldInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{item}: {now}" |
*
*/
export const order_to_cash_change_line: ((inputs: Order_To_Cash_Change_LineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Change_LineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Changed" |
*
*/
export const order_to_cash_changed: ((inputs?: Order_To_Cash_ChangedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_ChangedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Documents: delivery note, packing list, SDS, certificates" |
*
*/
export const order_to_cash_check_documents: ((inputs?: Order_To_Cash_Check_DocumentsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Check_DocumentsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Goods ready & labelled per line" |
*
*/
export const order_to_cash_check_goods_ready: ((inputs?: Order_To_Cash_Check_Goods_ReadyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Check_Goods_ReadyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No open approval on the order" |
*
*/
export const order_to_cash_check_no_approval: ((inputs?: Order_To_Cash_Check_No_ApprovalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Check_No_ApprovalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Ship-stores declaration" |
*
*/
export const order_to_cash_check_ship_stores: ((inputs?: Order_To_Cash_Check_Ship_StoresInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Check_Ship_StoresInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Transport booked (truck, launch)" |
*
*/
export const order_to_cash_check_transport: ((inputs?: Order_To_Cash_Check_TransportInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Check_TransportInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Clearance" |
*
*/
export const order_to_cash_clearance: ((inputs?: Order_To_Cash_ClearanceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_ClearanceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Close line {line} (not awarded)" |
*
*/
export const order_to_cash_close_line_prompt: ((inputs: Order_To_Cash_Close_Line_PromptInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Close_Line_PromptInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Close with reason" |
*
*/
export const order_to_cash_close_with_reason: ((inputs?: Order_To_Cash_Close_With_ReasonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Close_With_ReasonInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Line {line}: closed with reason." |
*
*/
export const order_to_cash_closed_done: ((inputs: Order_To_Cash_Closed_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Closed_DoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "At quotation" |
*
*/
export const order_to_cash_col_at_quotation: ((inputs?: Order_To_Cash_Col_At_QuotationInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Col_At_QuotationInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Checked" |
*
*/
export const order_to_cash_col_checked: ((inputs?: Order_To_Cash_Col_CheckedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Col_CheckedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer PO" |
*
*/
export const order_to_cash_col_customer_po: ((inputs?: Order_To_Cash_Col_Customer_PoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Col_Customer_PoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Item" |
*
*/
export const order_to_cash_col_item: ((inputs?: Order_To_Cash_Col_ItemInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Col_ItemInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Line" |
*
*/
export const order_to_cash_col_line: ((inputs?: Order_To_Cash_Col_LineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Col_LineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Now" |
*
*/
export const order_to_cash_col_now: ((inputs?: Order_To_Cash_Col_NowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Col_NowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quotation {quotation}" |
*
*/
export const order_to_cash_col_quotation: ((inputs: Order_To_Cash_Col_QuotationInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Col_QuotationInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Result" |
*
*/
export const order_to_cash_col_result: ((inputs?: Order_To_Cash_Col_ResultInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Col_ResultInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "Commitment blocked: {count} mismatch need the customer's written agreement (or an approved exception) before the sales order and supplier POs." |
* | * | "Commitment blocked: {count} mismatches need the customer's written agreement (or an approved exception) before the sales order and supplier POs." |
*
*/
export const order_to_cash_commitment_blocked: ((inputs: Order_To_Cash_Commitment_BlockedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Commitment_BlockedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Confirm delivered" |
*
*/
export const order_to_cash_confirm_delivered: ((inputs?: Order_To_Cash_Confirm_DeliveredInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Confirm_DeliveredInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Confirm {number} delivered" |
*
*/
export const order_to_cash_confirm_delivered_heading: ((inputs: Order_To_Cash_Confirm_Delivered_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Confirm_Delivered_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Confirm delivery…" |
*
*/
export const order_to_cash_confirm_delivery: ((inputs?: Order_To_Cash_Confirm_DeliveryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Confirm_DeliveryInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Confirm {number}?" |
*
*/
export const order_to_cash_confirm_heading: ((inputs: Order_To_Cash_Confirm_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Confirm_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Confirm sales order & prepare supplier POs" |
*
*/
export const order_to_cash_confirm_sales_order: ((inputs?: Order_To_Cash_Confirm_Sales_OrderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Confirm_Sales_OrderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Confirm & send" |
*
*/
export const order_to_cash_confirm_send: ((inputs?: Order_To_Cash_Confirm_SendInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Confirm_SendInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number} goes to {supplier} as a confirmed order. That can't be undone here." |
*
*/
export const order_to_cash_confirm_text: ((inputs: Order_To_Cash_Confirm_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Confirm_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier POs are confirmed by Karim Balbaa (management)." |
*
*/
export const order_to_cash_confirmed_by_management: ((inputs?: Order_To_Cash_Confirmed_By_ManagementInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Confirmed_By_ManagementInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number} confirmed — sent to {supplier}." |
*
*/
export const order_to_cash_confirmed_done: ((inputs: Order_To_Cash_Confirmed_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Confirmed_DoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{n} of {total} delivered" |
*
*/
export const order_to_cash_delivered_count: ((inputs: Order_To_Cash_Delivered_CountInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Delivered_CountInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number} delivered — signed delivery note on file." |
*
*/
export const order_to_cash_delivered_done: ((inputs: Order_To_Cash_Delivered_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Delivered_DoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Dictate shortages or damage" |
*
*/
export const order_to_cash_dictate: ((inputs?: Order_To_Cash_DictateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_DictateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Dispatch" |
*
*/
export const order_to_cash_dispatch: ((inputs?: Order_To_Cash_DispatchInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_DispatchInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Dispatched {at}" |
*
*/
export const order_to_cash_dispatched_at: ((inputs: Order_To_Cash_Dispatched_AtInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Dispatched_AtInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Drop {drop} · {number}" |
*
*/
export const order_to_cash_drop_heading: ((inputs: Order_To_Cash_Drop_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Drop_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "L{line} · {qty} × {description}" |
*
*/
export const order_to_cash_drop_line: ((inputs: Order_To_Cash_Drop_LineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Drop_LineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "L{line} · {qty} × {description} · lot {lot}" |
*
*/
export const order_to_cash_drop_line_lot: ((inputs: Order_To_Cash_Drop_Line_LotInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Drop_Line_LotInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Drop {drop} of {total} · {status}" |
*
*/
export const order_to_cash_drop_tag: ((inputs: Order_To_Cash_Drop_TagInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Drop_TagInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Optional in the demo — a copy of the customer's email is attached if you skip this" |
*
*/
export const order_to_cash_evidence_hint: ((inputs?: Order_To_Cash_Evidence_HintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Evidence_HintInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Evidence (email or signed amendment)" |
*
*/
export const order_to_cash_evidence_legend: ((inputs?: Order_To_Cash_Evidence_LegendInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Evidence_LegendInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer PO" |
*
*/
export const order_to_cash_figure_customer_po: ((inputs?: Order_To_Cash_Figure_Customer_PoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Figure_Customer_PoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Received" |
*
*/
export const order_to_cash_figure_received: ((inputs?: Order_To_Cash_Figure_ReceivedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Figure_ReceivedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier bills" |
*
*/
export const order_to_cash_figure_supplier_bills: ((inputs?: Order_To_Cash_Figure_Supplier_BillsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Figure_Supplier_BillsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier POs confirmed" |
*
*/
export const order_to_cash_figure_supplier_pos_confirmed: ((inputs?: Order_To_Cash_Figure_Supplier_Pos_ConfirmedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Figure_Supplier_Pos_ConfirmedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Goods ready" |
*
*/
export const order_to_cash_goods_ready: ((inputs?: Order_To_Cash_Goods_ReadyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Goods_ReadyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Header" |
*
*/
export const order_to_cash_header: ((inputs?: Order_To_Cash_HeaderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_HeaderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{lines} — {place}" |
*
*/
export const order_to_cash_intro: ((inputs: Order_To_Cash_IntroInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_IntroInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "L{line} × {qty}" |
*
*/
export const order_to_cash_intro_line: ((inputs: Order_To_Cash_Intro_LineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Intro_LineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Invoice delivered quantities" |
*
*/
export const order_to_cash_invoice_delivered: ((inputs?: Order_To_Cash_Invoice_DeliveredInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Invoice_DeliveredInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Invoiced" |
*
*/
export const order_to_cash_invoiced: ((inputs?: Order_To_Cash_InvoicedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_InvoicedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Keep open" |
*
*/
export const order_to_cash_keep_open: ((inputs?: Order_To_Cash_Keep_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Keep_OpenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Line {line}: kept open for a revision." |
*
*/
export const order_to_cash_kept_open_done: ((inputs: Order_To_Cash_Kept_Open_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Kept_Open_DoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Launch / boat" |
*
*/
export const order_to_cash_launch_boat: ((inputs?: Order_To_Cash_Launch_BoatInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Launch_BoatInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "L{line}" |
*
*/
export const order_to_cash_line_ref: ((inputs: Order_To_Cash_Line_RefInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Line_RefInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{line} · {field}" |
*
*/
export const order_to_cash_mismatch_text: ((inputs: Order_To_Cash_Mismatch_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Mismatch_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No evidence, no “Delivered”: attach the signed note first." |
*
*/
export const order_to_cash_missing_proof: ((inputs?: Order_To_Cash_Missing_ProofInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Missing_ProofInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{n} of {total}" |
*
*/
export const order_to_cash_n_of_total: ((inputs: Order_To_Cash_N_Of_TotalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_N_Of_TotalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No delivery planned yet — the plan is created once supplier POs are confirmed and goods are due." |
*
*/
export const order_to_cash_no_plan: ((inputs?: Order_To_Cash_No_PlanInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_No_PlanInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Not dispatched yet" |
*
*/
export const order_to_cash_not_dispatched: ((inputs?: Order_To_Cash_Not_DispatchedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Not_DispatchedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Not on the customer's PO — decide" |
*
*/
export const order_to_cash_not_on_po_decide: ((inputs?: Order_To_Cash_Not_On_Po_DecideInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Not_On_Po_DecideInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Not re-checked yet." |
*
*/
export const order_to_cash_not_rechecked: ((inputs?: Order_To_Cash_Not_RecheckedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Not_RecheckedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "OK" |
*
*/
export const order_to_cash_ok: ((inputs?: Order_To_Cash_OkInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_OkInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{count} on backorder" |
*
*/
export const order_to_cash_on_backorder: ((inputs: Order_To_Cash_On_BackorderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_On_BackorderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "On plan: no ETA change from the agent and nothing blocking the delivery." |
*
*/
export const order_to_cash_on_plan: ((inputs?: Order_To_Cash_On_PlanInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_On_PlanInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Closed" |
*
*/
export const order_to_cash_outcome_closed: ((inputs?: Order_To_Cash_Outcome_ClosedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Outcome_ClosedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open — revision to follow" |
*
*/
export const order_to_cash_outcome_open_revision: ((inputs?: Order_To_Cash_Outcome_Open_RevisionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Outcome_Open_RevisionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{outcome} — {reason}" |
*
*/
export const order_to_cash_outcome_with_reason: ((inputs: Order_To_Cash_Outcome_With_ReasonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Outcome_With_ReasonInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{a} · {b}" |
*
*/
export const order_to_cash_pair: ((inputs: Order_To_Cash_PairInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_PairInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quoted lines the customer didn't order: they stay open for a revision or close with a reason — a partly awarded case never shows as complete." |
*
*/
export const order_to_cash_partial_award_note: ((inputs?: Order_To_Cash_Partial_Award_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Partial_Award_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier promises and the customer promise are tracked separately; an ETA change moves every open drop, booking and task, and alerts the owner." |
*
*/
export const order_to_cash_plan_note: ((inputs?: Order_To_Cash_Plan_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Plan_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Planned on board" |
*
*/
export const order_to_cash_planned_on_board: ((inputs?: Order_To_Cash_Planned_On_BoardInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Planned_On_BoardInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nordvik's purchase order has just arrived by email." |
*
*/
export const order_to_cash_po_arrived_heading: ((inputs?: Order_To_Cash_Po_Arrived_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Po_Arrived_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The AI reads it and checks every line and commercial term against the quotation version it refers to. Nothing is committed until a person resolves each misma..." |
*
*/
export const order_to_cash_po_arrived_text: ((inputs?: Order_To_Cash_Po_Arrived_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Po_Arrived_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The customer's PO was checked against the approved quotation and validated — the sales order is confirmed." |
*
*/
export const order_to_cash_po_checked_validated: ((inputs?: Order_To_Cash_Po_Checked_ValidatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Po_Checked_ValidatedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Checked and validated when the sales order was confirmed." |
*
*/
export const order_to_cash_po_empty_confirmed: ((inputs?: Order_To_Cash_Po_Empty_ConfirmedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Po_Empty_ConfirmedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No customer PO yet. When it arrives it is checked here against the approved quotation version." |
*
*/
export const order_to_cash_po_empty_none: ((inputs?: Order_To_Cash_Po_Empty_NoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Po_Empty_NoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Each line and term is checked here once the PO is read." |
*
*/
export const order_to_cash_po_empty_read: ((inputs?: Order_To_Cash_Po_Empty_ReadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Po_Empty_ReadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Not received" |
*
*/
export const order_to_cash_po_not_received: ((inputs?: Order_To_Cash_Po_Not_ReceivedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Po_Not_ReceivedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number} · received {received} · matched to {quotation} · billing entity {entity}" |
*
*/
export const order_to_cash_po_subhead: ((inputs: Order_To_Cash_Po_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Po_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Validated" |
*
*/
export const order_to_cash_po_validated: ((inputs?: Order_To_Cash_Po_ValidatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Po_ValidatedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "PO validated — every mismatch has written customer agreement." |
*
*/
export const order_to_cash_po_validated_agreed: ((inputs?: Order_To_Cash_Po_Validated_AgreedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Po_Validated_AgreedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "PO validated — sales order confirmed. Supplier POs follow below." |
*
*/
export const order_to_cash_po_validated_confirmed: ((inputs?: Order_To_Cash_Po_Validated_ConfirmedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Po_Validated_ConfirmedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{po} vs {quotation}" |
*
*/
export const order_to_cash_po_vs_quotation: ((inputs: Order_To_Cash_Po_Vs_QuotationInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Po_Vs_QuotationInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Port · place" |
*
*/
export const order_to_cash_port_place: ((inputs?: Order_To_Cash_Port_PlaceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Port_PlaceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Prepared when the sales order is confirmed" |
*
*/
export const order_to_cash_pos_prepared_later: ((inputs?: Order_To_Cash_Pos_Prepared_LaterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Pos_Prepared_LaterInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Re-checked before confirming" |
*
*/
export const order_to_cash_pos_rechecked: ((inputs?: Order_To_Cash_Pos_RecheckedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Pos_RecheckedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Photo of the stamped note from the vessel, or the scanned PDF" |
*
*/
export const order_to_cash_proof_hint: ((inputs?: Order_To_Cash_Proof_HintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Proof_HintInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Signed delivery note or photo (required)" |
*
*/
export const order_to_cash_proof_legend: ((inputs?: Order_To_Cash_Proof_LegendInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Proof_LegendInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Are the items and quantities on the PO the same as on the quotation?" |
*
*/
export const order_to_cash_q_items: ((inputs?: Order_To_Cash_Q_ItemsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Q_ItemsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "An item or quantity differs" |
*
*/
export const order_to_cash_q_items_no: ((inputs?: Order_To_Cash_Q_Items_NoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Q_Items_NoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Items and quantities match" |
*
*/
export const order_to_cash_q_items_yes: ((inputs?: Order_To_Cash_Q_Items_YesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Q_Items_YesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Are the prices on the customer's PO the same as on the quotation?" |
*
*/
export const order_to_cash_q_prices: ((inputs?: Order_To_Cash_Q_PricesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Q_PricesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "A price differs from the quotation" |
*
*/
export const order_to_cash_q_prices_no: ((inputs?: Order_To_Cash_Q_Prices_NoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Q_Prices_NoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Prices match the quotation" |
*
*/
export const order_to_cash_q_prices_yes: ((inputs?: Order_To_Cash_Q_Prices_YesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Q_Prices_YesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Do the PO's commercial terms (payment, delivery, validity) match the quotation?" |
*
*/
export const order_to_cash_q_terms: ((inputs?: Order_To_Cash_Q_TermsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Q_TermsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "A term differs" |
*
*/
export const order_to_cash_q_terms_no: ((inputs?: Order_To_Cash_Q_Terms_NoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Q_Terms_NoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Terms match" |
*
*/
export const order_to_cash_q_terms_yes: ((inputs?: Order_To_Cash_Q_Terms_YesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Q_Terms_YesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Read the signed note from a photo" |
*
*/
export const order_to_cash_read_note: ((inputs?: Order_To_Cash_Read_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Read_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "L{line} · {description}. Common: Vessel bought it locally · Customer cancelled the item · Price not accepted" |
*
*/
export const order_to_cash_reason_hint: ((inputs: Order_To_Cash_Reason_HintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Reason_HintInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reason (kept on the case)" |
*
*/
export const order_to_cash_reason_label: ((inputs?: Order_To_Cash_Reason_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Reason_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "e.g. Vessel bought it locally" |
*
*/
export const order_to_cash_reason_placeholder: ((inputs?: Order_To_Cash_Reason_PlaceholderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Reason_PlaceholderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receipt" |
*
*/
export const order_to_cash_receipt: ((inputs?: Order_To_Cash_ReceiptInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_ReceiptInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Confirmed receipt pending — signed delivery note required" |
*
*/
export const order_to_cash_receipt_pending: ((inputs?: Order_To_Cash_Receipt_PendingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Receipt_PendingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Re-check & confirm" |
*
*/
export const order_to_cash_recheck_confirm: ((inputs?: Order_To_Cash_Recheck_ConfirmInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Recheck_ConfirmInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Re-checked price, availability, FX and lead time with {supplier}." |
*
*/
export const order_to_cash_recheck_done: ((inputs: Order_To_Cash_Recheck_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Recheck_DoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{number} · {supplier}: price, availability, FX and lead time are re-checked with the supplier before it is confirmed." |
*
*/
export const order_to_cash_recheck_note: ((inputs: Order_To_Cash_Recheck_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Recheck_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Re-check before confirming {number}" |
*
*/
export const order_to_cash_recheck_title: ((inputs: Order_To_Cash_Recheck_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Recheck_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Record amendment" |
*
*/
export const order_to_cash_record_amendment: ((inputs?: Order_To_Cash_Record_AmendmentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Record_AmendmentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Re-planned after the agent's ETA change — escalated to {owner} and Karim Balbaa" |
*
*/
export const order_to_cash_replan_heading: ((inputs: Order_To_Cash_Replan_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Replan_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{at} · {text}" |
*
*/
export const order_to_cash_replan_text: ((inputs: Order_To_Cash_Replan_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Replan_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Re-run PO check" |
*
*/
export const order_to_cash_rerun_po_check: ((inputs?: Order_To_Cash_Rerun_Po_CheckInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Rerun_Po_CheckInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{resolution} · evidence attached" |
*
*/
export const order_to_cash_resolution_evidence: ((inputs: Order_To_Cash_Resolution_EvidenceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Resolution_EvidenceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Amendment recorded" |
*
*/
export const order_to_cash_result_amendment: ((inputs?: Order_To_Cash_Result_AmendmentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Result_AmendmentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Match" |
*
*/
export const order_to_cash_result_match: ((inputs?: Order_To_Cash_Result_MatchInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Result_MatchInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Mismatch" |
*
*/
export const order_to_cash_result_mismatch: ((inputs?: Order_To_Cash_Result_MismatchInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Result_MismatchInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sales order confirmed" |
*
*/
export const order_to_cash_sales_order_confirmed: ((inputs?: Order_To_Cash_Sales_Order_ConfirmedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Sales_Order_ConfirmedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "From: purchasing (customer)" |
*
*/
export const order_to_cash_sample_from: ((inputs?: Order_To_Cash_Sample_FromInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Sample_FromInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Delivery note {number}" |
*
*/
export const order_to_cash_sample_note: ((inputs: Order_To_Cash_Sample_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Sample_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Re: {number} line {line}" |
*
*/
export const order_to_cash_sample_re: ((inputs: Order_To_Cash_Sample_ReInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Sample_ReInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Received on board — {signedBy}" |
*
*/
export const order_to_cash_sample_received: ((inputs: Order_To_Cash_Sample_ReceivedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Sample_ReceivedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Use the sample scan from the boarding officer" |
*
*/
export const order_to_cash_sample_scan: ((inputs?: Order_To_Cash_Sample_ScanInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Sample_ScanInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "confirmed" |
*
*/
export const order_to_cash_share_confirmed: ((inputs?: Order_To_Cash_Share_ConfirmedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Share_ConfirmedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{count} matched" |
*
*/
export const order_to_cash_share_matched: ((inputs: Order_To_Cash_Share_MatchedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Share_MatchedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "of the units ordered" |
*
*/
export const order_to_cash_share_of_units_ordered: ((inputs?: Order_To_Cash_Share_Of_Units_OrderedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Share_Of_Units_OrderedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Shortages" |
*
*/
export const order_to_cash_shortages: ((inputs?: Order_To_Cash_ShortagesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_ShortagesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Optional — becomes a claim" |
*
*/
export const order_to_cash_shortages_hint: ((inputs?: Order_To_Cash_Shortages_HintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Shortages_HintInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Shortages or damage noted on board" |
*
*/
export const order_to_cash_shortages_label: ((inputs?: Order_To_Cash_Shortages_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Shortages_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{changes} — the shortfall is scheduled as a backorder (the customer promise stays as agreed)." |
*
*/
export const order_to_cash_shortfall_backorder: ((inputs: Order_To_Cash_Shortfall_BackorderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Shortfall_BackorderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Signed by {by} · {at}" |
*
*/
export const order_to_cash_signed_by_at: ((inputs: Order_To_Cash_Signed_By_AtInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Signed_By_AtInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Signed by {by} · {at} · signed delivery note on file" |
*
*/
export const order_to_cash_signed_by_at_proof: ((inputs: Order_To_Cash_Signed_By_At_ProofInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Signed_By_At_ProofInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Chief Officer, {vessel}" |
*
*/
export const order_to_cash_signed_by_default: ((inputs: Order_To_Cash_Signed_By_DefaultInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Signed_By_DefaultInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Signed by (vessel)" |
*
*/
export const order_to_cash_signed_by_vessel: ((inputs?: Order_To_Cash_Signed_By_VesselInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Signed_By_VesselInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Truck & boarding staff" |
*
*/
export const order_to_cash_truck_staff: ((inputs?: Order_To_Cash_Truck_StaffInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Truck_StaffInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Undecided" |
*
*/
export const order_to_cash_undecided: ((inputs?: Order_To_Cash_UndecidedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_UndecidedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Units across all receipts" |
*
*/
export const order_to_cash_units_across_receipts: ((inputs?: Order_To_Cash_Units_Across_ReceiptsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Units_Across_ReceiptsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "vessel" |
*
*/
export const order_to_cash_vessel: ((inputs?: Order_To_Cash_VesselInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_VesselInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Vessel ETA" |
*
*/
export const order_to_cash_vessel_eta: ((inputs?: Order_To_Cash_Vessel_EtaInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Vessel_EtaInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Waiting for the customer's order" |
*
*/
export const order_to_cash_waiting_customer_order: ((inputs?: Order_To_Cash_Waiting_Customer_OrderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_Waiting_Customer_OrderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Date" |
*
*/
export const order_to_cash_x_date: ((inputs?: Order_To_Cash_X_DateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_X_DateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Shortages or damage noted" |
*
*/
export const order_to_cash_x_remarks: ((inputs?: Order_To_Cash_X_RemarksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_X_RemarksInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Signed by" |
*
*/
export const order_to_cash_x_signed_by: ((inputs?: Order_To_Cash_X_Signed_ByInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_X_Signed_ByInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Vessel" |
*
*/
export const order_to_cash_x_vessel: ((inputs?: Order_To_Cash_X_VesselInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Order_To_Cash_X_VesselInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approved" |
*
*/
export const page_approval_rules_approved: ((inputs?: Page_Approval_Rules_ApprovedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approval_Rules_ApprovedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Halfway" |
*
*/
export const page_approval_rules_halfway: ((inputs?: Page_Approval_Rules_HalfwayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approval_Rules_HalfwayInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Rejected" |
*
*/
export const page_approval_rules_rejected: ((inputs?: Page_Approval_Rules_RejectedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approval_Rules_RejectedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Requests under these rules" |
*
*/
export const page_approval_rules_requests_title: ((inputs?: Page_Approval_Rules_Requests_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approval_Rules_Requests_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Two-person rules" |
*
*/
export const page_approval_rules_two_person: ((inputs?: Page_Approval_Rules_Two_PersonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approval_Rules_Two_PersonInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Waiting" |
*
*/
export const page_approval_rules_waiting: ((inputs?: Page_Approval_Rules_WaitingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approval_Rules_WaitingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Waiting for a decision" |
*
*/
export const page_approval_rules_waiting_title: ((inputs?: Page_Approval_Rules_Waiting_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approval_Rules_Waiting_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "All approvals" |
*
*/
export const page_approvals_all: ((inputs?: Page_Approvals_AllInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approvals_AllInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "What's waiting, by kind" |
*
*/
export const page_approvals_by_kind: ((inputs?: Page_Approvals_By_KindInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approvals_By_KindInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Decided" |
*
*/
export const page_approvals_decided: ((inputs?: Page_Approvals_DecidedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approvals_DecidedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approvals" |
*
*/
export const page_approvals_eyebrow: ((inputs?: Page_Approvals_EyebrowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approvals_EyebrowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Finance + CEO" |
*
*/
export const page_approvals_finance_ceo: ((inputs?: Page_Approvals_Finance_CeoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approvals_Finance_CeoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Decisions that need a named person" |
*
*/
export const page_approvals_heading: ((inputs?: Page_Approvals_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approvals_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Kept with the record for audit" |
*
*/
export const page_approvals_kept_for_audit: ((inputs?: Page_Approvals_Kept_For_AuditInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approvals_Kept_For_AuditInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "You are a listed approver" |
*
*/
export const page_approvals_listed_approver: ((inputs?: Page_Approvals_Listed_ApproverInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approvals_Listed_ApproverInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No other open requests." |
*
*/
export const page_approvals_others_empty: ((inputs?: Page_Approvals_Others_EmptyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approvals_Others_EmptyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Requests you can follow but not decide — each card says who can." |
*
*/
export const page_approvals_others_subhead: ((inputs?: Page_Approvals_Others_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approvals_Others_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No decisions yet." |
*
*/
export const page_approvals_recent_empty: ((inputs?: Page_Approvals_Recent_EmptyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approvals_Recent_EmptyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approved and returned requests, with who decided and why." |
*
*/
export const page_approvals_recent_subhead: ((inputs?: Page_Approvals_Recent_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approvals_Recent_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Recently decided" |
*
*/
export const page_approvals_recent_title: ((inputs?: Page_Approvals_Recent_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approvals_Recent_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approval rules" |
*
*/
export const page_approvals_rules: ((inputs?: Page_Approvals_RulesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approvals_RulesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "You can see the evidence, not decide" |
*
*/
export const page_approvals_see_not_decide: ((inputs?: Page_Approvals_See_Not_DecideInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approvals_See_Not_DecideInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Every quotation, margin exception, payment, alternative item, bank-detail change and FX rate needs a named person. AI never approves." |
*
*/
export const page_approvals_subtitle: ((inputs?: Page_Approvals_SubtitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approvals_SubtitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Two-person requests" |
*
*/
export const page_approvals_two_person: ((inputs?: Page_Approvals_Two_PersonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approvals_Two_PersonInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Waiting for others" |
*
*/
export const page_approvals_waiting_for_others: ((inputs?: Page_Approvals_Waiting_For_OthersInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approvals_Waiting_For_OthersInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Waiting for you" |
*
*/
export const page_approvals_waiting_for_you: ((inputs?: Page_Approvals_Waiting_For_YouInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approvals_Waiting_For_YouInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing needs your decision right now." |
*
*/
export const page_approvals_yours_empty: ((inputs?: Page_Approvals_Yours_EmptyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approvals_Yours_EmptyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approve or return with a reason. Your decision is recorded under your name." |
*
*/
export const page_approvals_yours_subhead: ((inputs?: Page_Approvals_Yours_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Approvals_Yours_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Waiting on customers" |
*
*/
export const page_aside_awaiting_customer: ((inputs?: Page_Aside_Awaiting_CustomerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_Awaiting_CustomerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Your quotes sent, waiting for a decision" |
*
*/
export const page_aside_awaiting_customer_note: ((inputs?: Page_Aside_Awaiting_Customer_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_Awaiting_Customer_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Waiting on suppliers" |
*
*/
export const page_aside_awaiting_supplier: ((inputs?: Page_Aside_Awaiting_SupplierInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_Awaiting_SupplierInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Cases held for supplier replies" |
*
*/
export const page_aside_awaiting_supplier_note: ((inputs?: Page_Aside_Awaiting_Supplier_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_Awaiting_Supplier_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier bills" |
*
*/
export const page_aside_bills: ((inputs?: Page_Aside_BillsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_BillsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Bills to match against the PO and goods received" |
*
*/
export const page_aside_bills_note: ((inputs?: Page_Aside_Bills_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_Bills_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Bills on hold" |
*
*/
export const page_aside_bills_on_hold: ((inputs?: Page_Aside_Bills_On_HoldInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_Bills_On_HoldInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "PO, receipt and bill don't match yet" |
*
*/
export const page_aside_bills_on_hold_note: ((inputs?: Page_Aside_Bills_On_Hold_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_Bills_On_Hold_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Deliveries in progress" |
*
*/
export const page_aside_deliveries: ((inputs?: Page_Aside_DeliveriesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_DeliveriesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Drops planned or on the way to a vessel" |
*
*/
export const page_aside_deliveries_note: ((inputs?: Page_Aside_Deliveries_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_Deliveries_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quotes to finish" |
*
*/
export const page_aside_draft_quotes: ((inputs?: Page_Aside_Draft_QuotesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_Draft_QuotesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Drafts not yet sent" |
*
*/
export const page_aside_draft_quotes_note: ((inputs?: Page_Aside_Draft_Quotes_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_Draft_Quotes_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Integration exceptions" |
*
*/
export const page_aside_exceptions: ((inputs?: Page_Aside_ExceptionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_ExceptionsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Failed mailbox, e-invoice or AI steps waiting for a person" |
*
*/
export const page_aside_exceptions_note: ((inputs?: Page_Aside_Exceptions_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_Exceptions_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open follow-ups" |
*
*/
export const page_aside_follow_ups: ((inputs?: Page_Aside_Follow_UpsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_Follow_UpsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Calls, messages and reminders to do" |
*
*/
export const page_aside_follow_ups_note: ((inputs?: Page_Aside_Follow_Ups_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_Follow_Ups_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Held for approval" |
*
*/
export const page_aside_held: ((inputs?: Page_Aside_HeldInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_HeldInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Cases waiting on a margin, deposit or other approval" |
*
*/
export const page_aside_held_note: ((inputs?: Page_Aside_Held_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_Held_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Inbox to triage" |
*
*/
export const page_aside_inbox: ((inputs?: Page_Aside_InboxInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_InboxInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "New messages and uncertain matches" |
*
*/
export const page_aside_inbox_note: ((inputs?: Page_Aside_Inbox_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_Inbox_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Live cases" |
*
*/
export const page_aside_live_cases: ((inputs?: Page_Aside_Live_CasesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_Live_CasesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Every case not yet settled, lost or expired" |
*
*/
export const page_aside_live_cases_note: ((inputs?: Page_Aside_Live_Cases_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_Live_Cases_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Decisions waiting for me" |
*
*/
export const page_aside_my_decisions: ((inputs?: Page_Aside_My_DecisionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_My_DecisionsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approvals routed to you that you haven't decided" |
*
*/
export const page_aside_my_decisions_note: ((inputs?: Page_Aside_My_Decisions_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_My_Decisions_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "My live cases" |
*
*/
export const page_aside_my_live_cases: ((inputs?: Page_Aside_My_Live_CasesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_My_Live_CasesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Cases you own that are still open" |
*
*/
export const page_aside_my_live_cases_note: ((inputs?: Page_Aside_My_Live_Cases_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_My_Live_Cases_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "My open tasks" |
*
*/
export const page_aside_my_tasks: ((inputs?: Page_Aside_My_TasksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_My_TasksInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Your follow-ups still open" |
*
*/
export const page_aside_my_tasks_note: ((inputs?: Page_Aside_My_Tasks_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_My_Tasks_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Overdue invoices" |
*
*/
export const page_aside_overdue: ((inputs?: Page_Aside_OverdueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_OverdueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Past their due date with a balance open" |
*
*/
export const page_aside_overdue_note: ((inputs?: Page_Aside_Overdue_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_Overdue_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "My pipeline" |
*
*/
export const page_aside_pipeline: ((inputs?: Page_Aside_PipelineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_PipelineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Prospects you're working on" |
*
*/
export const page_aside_pipeline_note: ((inputs?: Page_Aside_Pipeline_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_Pipeline_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "RFQs awaiting reply" |
*
*/
export const page_aside_rfqs_waiting: ((inputs?: Page_Aside_Rfqs_WaitingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_Rfqs_WaitingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Suppliers who haven't answered yet" |
*
*/
export const page_aside_rfqs_waiting_note: ((inputs?: Page_Aside_Rfqs_Waiting_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_Rfqs_Waiting_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Invoices to collect" |
*
*/
export const page_aside_to_collect: ((inputs?: Page_Aside_To_CollectInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_To_CollectInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer invoices with a balance still open" |
*
*/
export const page_aside_to_collect_note: ((inputs?: Page_Aside_To_Collect_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_To_Collect_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Your desk" |
*
*/
export const page_aside_your_desk: ((inputs?: Page_Aside_Your_DeskInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Aside_Your_DeskInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Full activity log" |
*
*/
export const page_automations_activity_log: ((inputs?: Page_Automations_Activity_LogInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_Activity_LogInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Every AI call: what it read, how sure it was, and the person who checked it." |
*
*/
export const page_automations_ai_log_subhead: ((inputs?: Page_Automations_Ai_Log_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_Ai_Log_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "AI log" |
*
*/
export const page_automations_ai_log_title: ((inputs?: Page_Automations_Ai_Log_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_Ai_Log_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "All exceptions" |
*
*/
export const page_automations_all_exceptions: ((inputs?: Page_Automations_All_ExceptionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_All_ExceptionsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Every automatic step and human decision, append-only." |
*
*/
export const page_automations_audit_subhead: ((inputs?: Page_Automations_Audit_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_Audit_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Audit log" |
*
*/
export const page_automations_audit_title: ((inputs?: Page_Automations_Audit_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_Audit_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Auto-resolved" |
*
*/
export const page_automations_auto_resolved: ((inputs?: Page_Automations_Auto_ResolvedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_Auto_ResolvedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Runs automatically under approved rules" |
*
*/
export const page_automations_automatic: ((inputs?: Page_Automations_AutomaticInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_AutomaticInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Prepared for an authorised person" |
*
*/
export const page_automations_by_people: ((inputs?: Page_Automations_By_PeopleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_By_PeopleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "duplicates caught by idempotency key" |
*
*/
export const page_automations_duplicates_caught: ((inputs?: Page_Automations_Duplicates_CaughtInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_Duplicates_CaughtInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Work · automation" |
*
*/
export const page_automations_eyebrow: ((inputs?: Page_Automations_EyebrowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_EyebrowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Automations & exceptions" |
*
*/
export const page_automations_heading: ((inputs?: Page_Automations_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "nothing fails silently" |
*
*/
export const page_automations_nothing_silent: ((inputs?: Page_Automations_Nothing_SilentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_Nothing_SilentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open exceptions" |
*
*/
export const page_automations_open_exceptions: ((inputs?: Page_Automations_Open_ExceptionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_Open_ExceptionsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Owner · due" |
*
*/
export const page_automations_owner_due: ((inputs?: Page_Automations_Owner_DueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_Owner_DueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "A retry first checks the idempotency key (message-id, invoice number, mailbox), so nothing is created, imported or sent twice. Retrying a resolved item chang..." |
*
*/
export const page_automations_queue_subhead: ((inputs?: Page_Automations_Queue_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_Queue_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Exception queue" |
*
*/
export const page_automations_queue_title: ((inputs?: Page_Automations_Queue_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_Queue_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Every rule is explicit; management pauses or enables one, and each change is logged." |
*
*/
export const page_automations_registry_subhead: ((inputs?: Page_Automations_Registry_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_Registry_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Rule registry" |
*
*/
export const page_automations_registry_title: ((inputs?: Page_Automations_Registry_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_Registry_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "AI review queue" |
*
*/
export const page_automations_review_queue: ((inputs?: Page_Automations_Review_QueueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_Review_QueueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Rule" |
*
*/
export const page_automations_rule: ((inputs?: Page_Automations_RuleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_RuleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Every automation has a trigger, owner, due time, approval rule, retry behaviour and stop condition. Reprocessing never creates duplicates; failures land in t..." |
*
*/
export const page_automations_subtitle: ((inputs?: Page_Automations_SubtitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_SubtitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "What" |
*
*/
export const page_automations_what: ((inputs?: Page_Automations_WhatInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_WhatInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "What happened" |
*
*/
export const page_automations_what_happened: ((inputs?: Page_Automations_What_HappenedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_What_HappenedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "What it read" |
*
*/
export const page_automations_what_it_read: ((inputs?: Page_Automations_What_It_ReadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_What_It_ReadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "When" |
*
*/
export const page_automations_when: ((inputs?: Page_Automations_WhenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_WhenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Who" |
*
*/
export const page_automations_who: ((inputs?: Page_Automations_WhoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Automations_WhoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open balances in USD equivalent at today's rates, by days past due." |
*
*/
export const page_cash_ageing_subhead: ((inputs?: Page_Cash_Ageing_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_Ageing_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receivables ageing by customer" |
*
*/
export const page_cash_ageing_title: ((inputs?: Page_Cash_Ageing_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_Ageing_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "All invoices" |
*
*/
export const page_cash_all_invoices: ((inputs?: Page_Cash_All_InvoicesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_All_InvoicesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approvals queue" |
*
*/
export const page_cash_approvals_queue: ((inputs?: Page_Cash_Approvals_QueueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_Approvals_QueueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Two-person check: Finance and the CEO, after a call-back on the number on file." |
*
*/
export const page_cash_bank_change_subhead: ((inputs?: Page_Cash_Bank_Change_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_Bank_Change_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier bills by due date" |
*
*/
export const page_cash_bills_by_due: ((inputs?: Page_Cash_Bills_By_DueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_Bills_By_DueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Ageing buckets by customer" |
*
*/
export const page_cash_buckets_title: ((inputs?: Page_Cash_Buckets_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_Buckets_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reminders follow each customer's contact rule: “do not chase” accounts get an internal reminder only; for the others the AI drafts the email and a person rev..." |
*
*/
export const page_cash_collections_subhead: ((inputs?: Page_Cash_Collections_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_Collections_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Collections — open invoices" |
*
*/
export const page_cash_collections_title: ((inputs?: Page_Cash_Collections_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_Collections_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Due this month" |
*
*/
export const page_cash_due_month: ((inputs?: Page_Cash_Due_MonthInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_Due_MonthInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "E-invoice" |
*
*/
export const page_cash_e_invoice: ((inputs?: Page_Cash_E_InvoiceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_E_InvoiceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Finance · {day}" |
*
*/
export const page_cash_eyebrow: ((inputs: Page_Cash_EyebrowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_EyebrowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Financial Director or CEO" |
*
*/
export const page_cash_fd_or_ceo: ((inputs?: Page_Cash_Fd_Or_CeoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_Fd_Or_CeoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receivables & payables" |
*
*/
export const page_cash_heading: ((inputs?: Page_Cash_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Cash in vs out — next 8 weeks" |
*
*/
export const page_cash_in_out: ((inputs?: Page_Cash_In_OutInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_In_OutInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "EGP thousands, by week" |
*
*/
export const page_cash_in_out_subhead: ((inputs?: Page_Cash_In_Out_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_In_Out_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Cash, next 8 weeks" |
*
*/
export const page_cash_next_weeks: ((inputs?: Page_Cash_Next_WeeksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_Next_WeeksInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No bank-detail changes in progress." |
*
*/
export const page_cash_no_bank_changes: ((inputs?: Page_Cash_No_Bank_ChangesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_No_Bank_ChangesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No bank-detail change requested." |
*
*/
export const page_cash_no_bank_request: ((inputs?: Page_Cash_No_Bank_RequestInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_No_Bank_RequestInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No open invoices." |
*
*/
export const page_cash_no_open_invoices: ((inputs?: Page_Cash_No_Open_InvoicesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_No_Open_InvoicesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No payments waiting for approval." |
*
*/
export const page_cash_no_payments: ((inputs?: Page_Cash_No_PaymentsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_No_PaymentsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No open receivables." |
*
*/
export const page_cash_no_receivables: ((inputs?: Page_Cash_No_ReceivablesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_No_ReceivablesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing owed to suppliers." |
*
*/
export const page_cash_nothing_owed: ((inputs?: Page_Cash_Nothing_OwedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_Nothing_OwedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open invoices" |
*
*/
export const page_cash_open_invoices: ((inputs?: Page_Cash_Open_InvoicesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_Open_InvoicesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Overdue" |
*
*/
export const page_cash_overdue: ((inputs?: Page_Cash_OverdueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_OverdueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Past their due date · USD equivalent" |
*
*/
export const page_cash_overdue_note: ((inputs?: Page_Cash_Overdue_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_Overdue_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Payables" |
*
*/
export const page_cash_payables: ((inputs?: Page_Cash_PayablesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_PayablesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open supplier balances · EGP equivalent" |
*
*/
export const page_cash_payables_note: ((inputs?: Page_Cash_Payables_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_Payables_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Deposits paid against pro formas, balances due on delivery, and bills held when PO, receipt and bill don't match." |
*
*/
export const page_cash_payables_subhead: ((inputs?: Page_Cash_Payables_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_Payables_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier payables" |
*
*/
export const page_cash_payables_title: ((inputs?: Page_Cash_Payables_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_Payables_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Every supplier payment needs the Financial Director or the CEO. Once approved, finance pays in the bank and records it here with the bank reference." |
*
*/
export const page_cash_payments_subhead: ((inputs?: Page_Cash_Payments_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_Payments_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Payments needing approval" |
*
*/
export const page_cash_payments_title: ((inputs?: Page_Cash_Payments_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_Payments_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Payments to approve" |
*
*/
export const page_cash_payments_to_approve: ((inputs?: Page_Cash_Payments_To_ApproveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_Payments_To_ApproveInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receivables" |
*
*/
export const page_cash_receivables: ((inputs?: Page_Cash_ReceivablesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_ReceivablesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open invoices · USD equivalent" |
*
*/
export const page_cash_receivables_note: ((inputs?: Page_Cash_Receivables_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_Receivables_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Match a remittance" |
*
*/
export const page_cash_remittance: ((inputs?: Page_Cash_RemittanceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_RemittanceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{supplier}: requested change" |
*
*/
export const page_cash_requested_change: ((inputs: Page_Cash_Requested_ChangeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_Requested_ChangeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "What customers owe, what we owe suppliers, and what needs a decision. Money moves only in the bank — here people approve and record it." |
*
*/
export const page_cash_subtitle: ((inputs?: Page_Cash_SubtitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_SubtitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier balances open" |
*
*/
export const page_cash_supplier_balances: ((inputs?: Page_Cash_Supplier_BalancesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_Supplier_BalancesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Who owes us" |
*
*/
export const page_cash_who_owes: ((inputs?: Page_Cash_Who_OwesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Cash_Who_OwesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Offer check · L{line} · {description}" |
*
*/
export const page_compare_check_title: ((inputs: Page_Compare_Check_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Compare_Check_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Correction request · {supplier} v{version}" |
*
*/
export const page_compare_correction_title: ((inputs: Page_Compare_Correction_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Compare_Correction_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Costs and margins are hidden for your role. Supplier offers carry supplier costs, so Sales sees the selling prices on the quotation instead. Supply chain, fi..." |
*
*/
export const page_compare_denied: ((inputs?: Page_Compare_DeniedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Compare_DeniedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "How offers are compared" |
*
*/
export const page_compare_how_title: ((inputs?: Page_Compare_How_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Compare_How_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "L{line} · {description}" |
*
*/
export const page_compare_line_title: ((inputs: Page_Compare_Line_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Compare_Line_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Next step" |
*
*/
export const page_compare_next_step: ((inputs?: Page_Compare_Next_StepInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Compare_Next_StepInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No offers need a correction request." |
*
*/
export const page_compare_no_corrections: ((inputs?: Page_Compare_No_CorrectionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Compare_No_CorrectionsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No requested lines to compare yet." |
*
*/
export const page_compare_no_lines: ((inputs?: Page_Compare_No_LinesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Compare_No_LinesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No more lines with offers to check." |
*
*/
export const page_compare_no_more_checks: ((inputs?: Page_Compare_No_More_ChecksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Compare_No_More_ChecksInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No more requested lines on this case." |
*
*/
export const page_compare_no_more_lines: ((inputs?: Page_Compare_No_More_LinesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Compare_No_More_LinesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No line is waiting on a supplier's offer." |
*
*/
export const page_compare_no_waiting: ((inputs?: Page_Compare_No_WaitingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Compare_No_WaitingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Asked, no offer · L{line} · {description}" |
*
*/
export const page_compare_others_title: ((inputs: Page_Compare_Others_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Compare_Others_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Amount · VAT" |
*
*/
export const page_delivery_amount_vat: ((inputs?: Page_Delivery_Amount_VatInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Delivery_Amount_VatInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receipt shortfalls become backorders with a date and an owner; a late supplier is escalated against the drop it was meant for." |
*
*/
export const page_delivery_backorders_subhead: ((inputs?: Page_Delivery_Backorders_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Delivery_Backorders_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Backorders & late suppliers" |
*
*/
export const page_delivery_backorders_title: ((inputs?: Page_Delivery_Backorders_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Delivery_Backorders_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Balance" |
*
*/
export const page_delivery_balance: ((inputs?: Page_Delivery_BalanceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Delivery_BalanceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Invoices still open: $count" |
*
*/
export const page_delivery_balance_note: ((inputs?: Page_Delivery_Balance_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Delivery_Balance_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The next drop out" |
*
*/
export const page_delivery_check_subhead: ((inputs?: Page_Delivery_Check_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Delivery_Check_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pre-dispatch check" |
*
*/
export const page_delivery_check_title: ((inputs?: Page_Delivery_Check_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Delivery_Check_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "“Delivered” needs evidence: dispatch and confirmed receipt are separate, and a drop is confirmed only with the signed delivery note or photo from the vessel." |
*
*/
export const page_delivery_drops_subhead: ((inputs?: Page_Delivery_Drops_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Delivery_Drops_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Drops & proof of delivery" |
*
*/
export const page_delivery_drops_title: ((inputs?: Page_Delivery_Drops_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Delivery_Drops_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Invoice" |
*
*/
export const page_delivery_invoice: ((inputs?: Page_Delivery_InvoiceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Delivery_InvoiceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Invoiced" |
*
*/
export const page_delivery_invoiced: ((inputs?: Page_Delivery_InvoicedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Delivery_InvoicedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Delivered quantities only" |
*
*/
export const page_delivery_invoiced_note: ((inputs?: Page_Delivery_Invoiced_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Delivery_Invoiced_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Invoices come from signed deliveries: only delivered quantities, never the same quantity twice. Each one is signed and submitted to the Egyptian Tax Authorit..." |
*
*/
export const page_delivery_invoices_subhead: ((inputs?: Page_Delivery_Invoices_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Delivery_Invoices_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer invoices & payments" |
*
*/
export const page_delivery_invoices_title: ((inputs?: Page_Delivery_Invoices_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Delivery_Invoices_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No backorders on this case." |
*
*/
export const page_delivery_no_backorders: ((inputs?: Page_Delivery_No_BackordersInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Delivery_No_BackordersInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No drop to dispatch yet." |
*
*/
export const page_delivery_no_dispatch: ((inputs?: Page_Delivery_No_DispatchInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Delivery_No_DispatchInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No deliveries planned yet." |
*
*/
export const page_delivery_no_drops: ((inputs?: Page_Delivery_No_DropsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Delivery_No_DropsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No invoice yet. The first one is created from a delivery confirmed with a signed note." |
*
*/
export const page_delivery_no_invoice: ((inputs?: Page_Delivery_No_InvoiceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Delivery_No_InvoiceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No invoices on this case yet." |
*
*/
export const page_delivery_no_invoices: ((inputs?: Page_Delivery_No_InvoicesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Delivery_No_InvoicesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Paid · balance" |
*
*/
export const page_delivery_paid_balance: ((inputs?: Page_Delivery_Paid_BalanceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Delivery_Paid_BalanceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Vessel delivery plan" |
*
*/
export const page_delivery_plan_title: ((inputs?: Page_Delivery_Plan_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Delivery_Plan_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Received" |
*
*/
export const page_delivery_received: ((inputs?: Page_Delivery_ReceivedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Delivery_ReceivedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer payments allocated" |
*
*/
export const page_delivery_received_note: ((inputs?: Page_Delivery_Received_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Delivery_Received_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Short" |
*
*/
export const page_delivery_short: ((inputs?: Page_Delivery_ShortInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Delivery_ShortInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Add opportunity" |
*
*/
export const page_growth_add: ((inputs?: Page_Growth_AddInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_AddInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Campaign" |
*
*/
export const page_growth_campaign: ((inputs?: Page_Growth_CampaignInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_CampaignInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Campaigns" |
*
*/
export const page_growth_campaigns: ((inputs?: Page_Growth_CampaignsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_CampaignsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approved lists and content only. You can schedule and send." |
*
*/
export const page_growth_campaigns_can_send: ((inputs?: Page_Growth_Campaigns_Can_SendInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_Campaigns_Can_SendInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approved lists and content only. Only Karim Balbaa schedules or sends." |
*
*/
export const page_growth_campaigns_cannot_send: ((inputs?: Page_Growth_Campaigns_Cannot_SendInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_Campaigns_Cannot_SendInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Content" |
*
*/
export const page_growth_content: ((inputs?: Page_Growth_ContentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_ContentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Registration documents" |
*
*/
export const page_growth_documents: ((inputs?: Page_Growth_DocumentsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_DocumentsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Growth" |
*
*/
export const page_growth_eyebrow: ((inputs?: Page_Growth_EyebrowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_EyebrowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Fleets per ship manager" |
*
*/
export const page_growth_fleets: ((inputs?: Page_Growth_FleetsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_FleetsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Growth funnel" |
*
*/
export const page_growth_funnel: ((inputs?: Page_Growth_FunnelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_FunnelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Prospects that reached each stage or went further" |
*
*/
export const page_growth_funnel_subhead: ((inputs?: Page_Growth_Funnel_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_Funnel_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Growth board" |
*
*/
export const page_growth_heading: ((inputs?: Page_Growth_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Next" |
*
*/
export const page_growth_next: ((inputs?: Page_Growth_NextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_NextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sales next steps" |
*
*/
export const page_growth_next_steps: ((inputs?: Page_Growth_Next_StepsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_Next_StepsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Each step has a channel, a date and what to say. Call or message yourself, then record what happened — the next step lands on the owner's follow-ups." |
*
*/
export const page_growth_next_steps_subhead: ((inputs?: Page_Growth_Next_Steps_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_Next_Steps_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No next step" |
*
*/
export const page_growth_no_step: ((inputs?: Page_Growth_No_StepInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_No_StepInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "plan one or close the opportunity" |
*
*/
export const page_growth_no_step_note: ((inputs?: Page_Growth_No_Step_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_No_Step_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open opportunities" |
*
*/
export const page_growth_open: ((inputs?: Page_Growth_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_OpenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "prospects to active accounts" |
*
*/
export const page_growth_open_note: ((inputs?: Page_Growth_Open_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_Open_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pipeline" |
*
*/
export const page_growth_pipeline: ((inputs?: Page_Growth_PipelineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_PipelineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Registrations in progress" |
*
*/
export const page_growth_registrations: ((inputs?: Page_Growth_RegistrationsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_RegistrationsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Registrations at a glance" |
*
*/
export const page_growth_registrations_glance: ((inputs?: Page_Growth_Registrations_GlanceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_Registrations_GlanceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "waiting on documents or a committee" |
*
*/
export const page_growth_registrations_note: ((inputs?: Page_Growth_Registrations_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_Registrations_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Where prospects come from" |
*
*/
export const page_growth_sources: ((inputs?: Page_Growth_SourcesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_SourcesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Active account" |
*
*/
export const page_growth_stage_active: ((inputs?: Page_Growth_Stage_ActiveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_Stage_ActiveInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approved vendor" |
*
*/
export const page_growth_stage_approved: ((inputs?: Page_Growth_Stage_ApprovedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_Stage_ApprovedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "First RFQ" |
*
*/
export const page_growth_stage_first_rfq: ((inputs?: Page_Growth_Stage_First_RfqInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_Stage_First_RfqInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Introduced" |
*
*/
export const page_growth_stage_introduced: ((inputs?: Page_Growth_Stage_IntroducedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_Stage_IntroducedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Prospect" |
*
*/
export const page_growth_stage_prospect: ((inputs?: Page_Growth_Stage_ProspectInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_Stage_ProspectInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Registration submitted" |
*
*/
export const page_growth_stage_registration: ((inputs?: Page_Growth_Stage_RegistrationInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_Stage_RegistrationInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Prospects, fleets, introductions and vendor registrations — kept apart from operational RFQs, and linked to the customer once business is won." |
*
*/
export const page_growth_subtitle: ((inputs?: Page_Growth_SubtitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_SubtitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Next steps this week" |
*
*/
export const page_growth_this_week: ((inputs?: Page_Growth_This_WeekInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_This_WeekInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "calls, emails and visits planned" |
*
*/
export const page_growth_this_week_note: ((inputs?: Page_Growth_This_Week_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_This_Week_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Applications to become an approved supplier of a ship manager or owner." |
*
*/
export const page_growth_vendor_subhead: ((inputs?: Page_Growth_Vendor_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_Vendor_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Vendor registrations" |
*
*/
export const page_growth_vendor_title: ((inputs?: Page_Growth_Vendor_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_Vendor_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Vessels per ship manager" |
*
*/
export const page_growth_vessels: ((inputs?: Page_Growth_VesselsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_VesselsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Vessels with IMO for customers and prospects — the room to grow is every vessel we don't supply yet." |
*
*/
export const page_growth_vessels_subhead: ((inputs?: Page_Growth_Vessels_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Growth_Vessels_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customers — ship managers" |
*
*/
export const page_history_customers: ((inputs?: Page_History_CustomersInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_History_CustomersInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "De-duplication" |
*
*/
export const page_history_dedup: ((inputs?: Page_History_DedupInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_History_DedupInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Mailboxes imported" |
*
*/
export const page_history_mailboxes: ((inputs?: Page_History_MailboxesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_History_MailboxesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No customers found yet." |
*
*/
export const page_history_no_customers: ((inputs?: Page_History_No_CustomersInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_History_No_CustomersInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No dated prices found yet." |
*
*/
export const page_history_no_prices: ((inputs?: Page_History_No_PricesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_History_No_PricesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No suppliers found yet." |
*
*/
export const page_history_no_suppliers: ((inputs?: Page_History_No_SuppliersInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_History_No_SuppliersInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No vessels found yet." |
*
*/
export const page_history_no_vessels: ((inputs?: Page_History_No_VesselsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_History_No_VesselsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Press Organise to read them from the kept messages." |
*
*/
export const page_history_not_organised: ((inputs?: Page_History_Not_OrganisedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_History_Not_OrganisedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Organise and approve" |
*
*/
export const page_history_organise_approve: ((inputs?: Page_History_Organise_ApproveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_History_Organise_ApproveInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Messages per year" |
*
*/
export const page_history_per_year: ((inputs?: Page_History_Per_YearInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_History_Per_YearInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Dated prices — even with no PO" |
*
*/
export const page_history_prices: ((inputs?: Page_History_PricesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_History_PricesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Import progress" |
*
*/
export const page_history_progress: ((inputs?: Page_History_ProgressInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_History_ProgressInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Suppliers — who quoted what" |
*
*/
export const page_history_suppliers: ((inputs?: Page_History_SuppliersInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_History_SuppliersInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing to review yet. What the organiser isn't sure of comes here after Organise." |
*
*/
export const page_history_uncertain_empty: ((inputs?: Page_History_Uncertain_EmptyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_History_Uncertain_EmptyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reviewed with you before they are saved: confirm the proposal or reject it." |
*
*/
export const page_history_uncertain_subhead: ((inputs?: Page_History_Uncertain_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_History_Uncertain_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Uncertain items" |
*
*/
export const page_history_uncertain_title: ((inputs?: Page_History_Uncertain_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_History_Uncertain_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Vessels — IMO, fleet, ports" |
*
*/
export const page_history_vessels: ((inputs?: Page_History_VesselsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_History_VesselsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "All live cases" |
*
*/
export const page_home_all_live: ((inputs?: Page_Home_All_LiveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_All_LiveInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sorted by risk, then deadline · every case has an owner and a next action" |
*
*/
export const page_home_all_live_subhead: ((inputs?: Page_Home_All_Live_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_All_Live_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier bills to match" |
*
*/
export const page_home_bills_match: ((inputs?: Page_Home_Bills_MatchInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Bills_MatchInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "PO · receipt · bill" |
*
*/
export const page_home_bills_match_note: ((inputs?: Page_Home_Bills_Match_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Bills_Match_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Daily briefing" |
*
*/
export const page_home_briefing: ((inputs?: Page_Home_BriefingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_BriefingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sorted by risk, then deadline" |
*
*/
export const page_home_by_risk: ((inputs?: Page_Home_By_RiskInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_By_RiskInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer · vessel" |
*
*/
export const page_home_customer_vessel: ((inputs?: Page_Home_Customer_VesselInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Customer_VesselInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Deadlines, live" |
*
*/
export const page_home_deadlines: ((inputs?: Page_Home_DeadlinesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_DeadlinesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quotes due and vessels arriving, soonest first" |
*
*/
export const page_home_deadlines_subhead: ((inputs?: Page_Home_Deadlines_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Deadlines_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "payments, deposits, bank changes" |
*
*/
export const page_home_decisions_note: ((inputs?: Page_Home_Decisions_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Decisions_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Decisions waiting" |
*
*/
export const page_home_decisions_waiting: ((inputs?: Page_Home_Decisions_WaitingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Decisions_WaitingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Desk cases" |
*
*/
export const page_home_desk_cases: ((inputs?: Page_Home_Desk_CasesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Desk_CasesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Every live case, its owner and next step" |
*
*/
export const page_home_desk_cases_subhead: ((inputs?: Page_Home_Desk_Cases_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Desk_Cases_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sorted by risk, then deadline · every case has an owner, deadline and next action" |
*
*/
export const page_home_desk_queue_subhead: ((inputs?: Page_Home_Desk_Queue_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Desk_Queue_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Follow-ups due today" |
*
*/
export const page_home_due_today: ((inputs?: Page_Home_Due_TodayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Due_TodayInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "reminders stop on reply" |
*
*/
export const page_home_due_today_note: ((inputs?: Page_Home_Due_Today_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Due_Today_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Integration exceptions" |
*
*/
export const page_home_exceptions: ((inputs?: Page_Home_ExceptionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_ExceptionsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "safe retry available" |
*
*/
export const page_home_exceptions_note: ((inputs?: Page_Home_Exceptions_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Exceptions_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reminders stop on reply, decline or case closure" |
*
*/
export const page_home_follow_ups_subhead: ((inputs?: Page_Home_Follow_Ups_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Follow_Ups_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Today's follow-ups" |
*
*/
export const page_home_follow_ups_title: ((inputs?: Page_Home_Follow_Ups_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Follow_Ups_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "new messages and uncertain matches" |
*
*/
export const page_home_inbox_note: ((inputs?: Page_Home_Inbox_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Inbox_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "AI has read each message — check the case, owner and missing details" |
*
*/
export const page_home_inbox_subhead: ((inputs?: Page_Home_Inbox_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Inbox_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Inbox to triage" |
*
*/
export const page_home_inbox_triage: ((inputs?: Page_Home_Inbox_TriageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Inbox_TriageInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Lines" |
*
*/
export const page_home_lines: ((inputs?: Page_Home_LinesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_LinesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "My deadlines, next 7 days" |
*
*/
export const page_home_my_deadlines: ((inputs?: Page_Home_My_DeadlinesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_My_DeadlinesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quote deadlines on cases I own" |
*
*/
export const page_home_my_deadlines_subhead: ((inputs?: Page_Home_My_Deadlines_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_My_Deadlines_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "My live cases" |
*
*/
export const page_home_my_live_cases: ((inputs?: Page_Home_My_Live_CasesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_My_Live_CasesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "cases you own that are still open" |
*
*/
export const page_home_my_live_cases_note: ((inputs?: Page_Home_My_Live_Cases_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_My_Live_Cases_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "My queue" |
*
*/
export const page_home_my_queue: ((inputs?: Page_Home_My_QueueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_My_QueueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Cases I own, sorted by risk, then deadline" |
*
*/
export const page_home_my_queue_subhead: ((inputs?: Page_Home_My_Queue_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_My_Queue_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Next action · blocker" |
*
*/
export const page_home_next_blocker: ((inputs?: Page_Home_Next_BlockerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Next_BlockerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Next up" |
*
*/
export const page_home_next_up: ((inputs?: Page_Home_Next_UpInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Next_UpInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No chart for this yet." |
*
*/
export const page_home_no_chart: ((inputs?: Page_Home_No_ChartInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_No_ChartInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No follow-ups due today." |
*
*/
export const page_home_no_follow_ups: ((inputs?: Page_Home_No_Follow_UpsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_No_Follow_UpsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No live cases." |
*
*/
export const page_home_no_live_cases: ((inputs?: Page_Home_No_Live_CasesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_No_Live_CasesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing needs you this morning." |
*
*/
export const page_home_nothing_morning: ((inputs?: Page_Home_Nothing_MorningInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Nothing_MorningInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing due this week." |
*
*/
export const page_home_nothing_this_week: ((inputs?: Page_Home_Nothing_This_WeekInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Nothing_This_WeekInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open tasks" |
*
*/
export const page_home_open_tasks: ((inputs?: Page_Home_Open_TasksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Open_TasksInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pipeline next steps" |
*
*/
export const page_home_pipeline: ((inputs?: Page_Home_PipelineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_PipelineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Growth CRM · calls, visits and registrations" |
*
*/
export const page_home_pipeline_subhead: ((inputs?: Page_Home_Pipeline_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Pipeline_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quote deadlines" |
*
*/
export const page_home_quote_deadlines: ((inputs?: Page_Home_Quote_DeadlinesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Quote_DeadlinesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Targets" |
*
*/
export const page_home_targets: ((inputs?: Page_Home_TargetsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_TargetsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "This month" |
*
*/
export const page_home_this_month: ((inputs?: Page_Home_This_MonthInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_This_MonthInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "This morning" |
*
*/
export const page_home_this_morning: ((inputs?: Page_Home_This_MorningInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_This_MorningInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "This week" |
*
*/
export const page_home_this_week: ((inputs?: Page_Home_This_WeekInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_This_WeekInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Invoices to collect" |
*
*/
export const page_home_to_collect: ((inputs?: Page_Home_To_CollectInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_To_CollectInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "e-invoices valid at the tax authority" |
*
*/
export const page_home_to_collect_note: ((inputs?: Page_Home_To_Collect_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_To_Collect_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quote turnaround" |
*
*/
export const page_home_turnaround: ((inputs?: Page_Home_TurnaroundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_TurnaroundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Win rate" |
*
*/
export const page_home_win_rate: ((inputs?: Page_Home_Win_RateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Win_RateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Waiting for your decision" |
*
*/
export const page_home_your_decision: ((inputs?: Page_Home_Your_DecisionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Your_DecisionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Everything is prepared — you approve or return" |
*
*/
export const page_home_your_decision_subhead: ((inputs?: Page_Home_Your_Decision_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Home_Your_Decision_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Acknowledgement draft" |
*
*/
export const page_inbox_ack: ((inputs?: Page_Inbox_AckInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_AckInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Owner, backup and deadline" |
*
*/
export const page_inbox_assignment: ((inputs?: Page_Inbox_AssignmentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_AssignmentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Connected channels" |
*
*/
export const page_inbox_channels: ((inputs?: Page_Inbox_ChannelsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_ChannelsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Draft case" |
*
*/
export const page_inbox_draft_case: ((inputs?: Page_Inbox_Draft_CaseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_Draft_CaseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Draft lines" |
*
*/
export const page_inbox_draft_lines: ((inputs?: Page_Inbox_Draft_LinesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_Draft_LinesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sourcing desk · intake" |
*
*/
export const page_inbox_eyebrow: ((inputs?: Page_Inbox_EyebrowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_EyebrowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Inbox" |
*
*/
export const page_inbox_heading: ((inputs?: Page_Inbox_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No match to show. A new request is read into a draft case, and a new reply is matched first." |
*
*/
export const page_inbox_match_empty: ((inputs?: Page_Inbox_Match_EmptyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_Match_EmptyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Why it matched and who decided. Below 85% a person picks the case; a duplicate stays with the message already in." |
*
*/
export const page_inbox_match_subhead: ((inputs?: Page_Inbox_Match_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_Match_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reply match" |
*
*/
export const page_inbox_match_title: ((inputs?: Page_Inbox_Match_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_Match_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Messages" |
*
*/
export const page_inbox_messages: ((inputs?: Page_Inbox_MessagesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_MessagesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Missing or unclear" |
*
*/
export const page_inbox_missing: ((inputs?: Page_Inbox_MissingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_MissingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Next step" |
*
*/
export const page_inbox_next_step: ((inputs?: Page_Inbox_Next_StepInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_Next_StepInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No acknowledgement for this message." |
*
*/
export const page_inbox_no_ack: ((inputs?: Page_Inbox_No_AckInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_No_AckInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "A new request gets one, from the approved template." |
*
*/
export const page_inbox_no_ack_description: ((inputs?: Page_Inbox_No_Ack_DescriptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_No_Ack_DescriptionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No draft case for this message." |
*
*/
export const page_inbox_no_draft: ((inputs?: Page_Inbox_No_DraftInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_No_DraftInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Only a request for quotation is read into one." |
*
*/
export const page_inbox_no_draft_description: ((inputs?: Page_Inbox_No_Draft_DescriptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_No_Draft_DescriptionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No draft lines for this message." |
*
*/
export const page_inbox_no_draft_lines: ((inputs?: Page_Inbox_No_Draft_LinesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_No_Draft_LinesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No messages match this filter." |
*
*/
export const page_inbox_no_match_filter: ((inputs?: Page_Inbox_No_Match_FilterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_No_Match_FilterInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No message open." |
*
*/
export const page_inbox_no_message: ((inputs?: Page_Inbox_No_MessageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_No_MessageInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No next step for this message." |
*
*/
export const page_inbox_no_next_step: ((inputs?: Page_Inbox_No_Next_StepInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_No_Next_StepInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No owner suggested yet." |
*
*/
export const page_inbox_no_owner: ((inputs?: Page_Inbox_No_OwnerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_No_OwnerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The assignment rules suggest one once a request is read into a draft case." |
*
*/
export const page_inbox_no_owner_description: ((inputs?: Page_Inbox_No_Owner_DescriptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_No_Owner_DescriptionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No text to read in this message." |
*
*/
export const page_inbox_no_text: ((inputs?: Page_Inbox_No_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_No_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No text to check for warnings." |
*
*/
export const page_inbox_no_warnings_text: ((inputs?: Page_Inbox_No_Warnings_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_No_Warnings_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing to clarify with the sender." |
*
*/
export const page_inbox_nothing_clarify: ((inputs?: Page_Inbox_Nothing_ClarifyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_Nothing_ClarifyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Offer details and replies" |
*
*/
export const page_inbox_offer_details: ((inputs?: Page_Inbox_Offer_DetailsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_Offer_DetailsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Original message" |
*
*/
export const page_inbox_original: ((inputs?: Page_Inbox_OriginalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_OriginalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The message as it arrived" |
*
*/
export const page_inbox_original_subhead: ((inputs?: Page_Inbox_Original_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_Original_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pick a message in the list." |
*
*/
export const page_inbox_pick_message: ((inputs?: Page_Inbox_Pick_MessageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_Pick_MessageInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing waiting for review. Every reply is matched." |
*
*/
export const page_inbox_review_empty: ((inputs?: Page_Inbox_Review_EmptyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_Review_EmptyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Matches below 85% confidence are never linked automatically — a person picks the case." |
*
*/
export const page_inbox_review_subhead: ((inputs?: Page_Inbox_Review_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_Review_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Review queue" |
*
*/
export const page_inbox_review_title: ((inputs?: Page_Inbox_Review_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_Review_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Every channel in one inbox. AI reads emails, files and photos into a draft case; people decide." |
*
*/
export const page_inbox_subtitle: ((inputs?: Page_Inbox_SubtitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_SubtitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Warnings in this message" |
*
*/
export const page_inbox_warnings: ((inputs?: Page_Inbox_WarningsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_WarningsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "What this message is" |
*
*/
export const page_inbox_what_is: ((inputs?: Page_Inbox_What_IsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Inbox_What_IsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Branded acknowledgement" |
*
*/
export const page_integrations_ack: ((inputs?: Page_Integrations_AckInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Integrations_AckInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Backups, staging & export" |
*
*/
export const page_integrations_backups: ((inputs?: Page_Integrations_BackupsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Integrations_BackupsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Channels" |
*
*/
export const page_integrations_channels: ((inputs?: Page_Integrations_ChannelsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Integrations_ChannelsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The website, WhatsApp, the tax authority, AI extraction, documents and Odoo underneath." |
*
*/
export const page_integrations_channels_subhead: ((inputs?: Page_Integrations_Channels_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Integrations_Channels_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Edit connections" |
*
*/
export const page_integrations_edit: ((inputs?: Page_Integrations_EditInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Integrations_EditInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Exception queue" |
*
*/
export const page_integrations_exception_queue: ((inputs?: Page_Integrations_Exception_QueueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Integrations_Exception_QueueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Configuration · integrations" |
*
*/
export const page_integrations_eyebrow: ((inputs?: Page_Integrations_EyebrowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Integrations_EyebrowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Integrations & data" |
*
*/
export const page_integrations_heading: ((inputs?: Page_Integrations_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Integrations_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Email history import" |
*
*/
export const page_integrations_history: ((inputs?: Page_Integrations_HistoryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Integrations_HistoryInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Days of email imported" |
*
*/
export const page_integrations_history_subhead: ((inputs?: Page_Integrations_History_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Integrations_History_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Emails imported" |
*
*/
export const page_integrations_imported: ((inputs?: Page_Integrations_ImportedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Integrations_ImportedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Language — English / العربية" |
*
*/
export const page_integrations_language: ((inputs?: Page_Integrations_LanguageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Integrations_LanguageInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Mailbox" |
*
*/
export const page_integrations_mailbox: ((inputs?: Page_Integrations_MailboxInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Integrations_MailboxInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Mailboxes" |
*
*/
export const page_integrations_mailboxes: ((inputs?: Page_Integrations_MailboxesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Integrations_MailboxesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Every email to these mailboxes becomes or joins a case, with its attachments kept. A failed sync never drops mail: it waits in the exception queue and import..." |
*
*/
export const page_integrations_mailboxes_subhead: ((inputs?: Page_Integrations_Mailboxes_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Integrations_Mailboxes_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Odoo migration" |
*
*/
export const page_integrations_migration: ((inputs?: Page_Integrations_MigrationInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Integrations_MigrationInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Each part of Odoo's data is counted, copied in, then checked by a person against Odoo. Odoo is switched off once every part is done." |
*
*/
export const page_integrations_odoo_subhead: ((inputs?: Page_Integrations_Odoo_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Integrations_Odoo_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Moving off Odoo" |
*
*/
export const page_integrations_odoo_title: ((inputs?: Page_Integrations_Odoo_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Integrations_Odoo_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Your mailboxes, website, WhatsApp, the tax authority and Odoo, connected — with daily backups, a staging copy and your data exportable at any time." |
*
*/
export const page_integrations_subtitle: ((inputs?: Page_Integrations_SubtitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Integrations_SubtitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Token expires" |
*
*/
export const page_integrations_token: ((inputs?: Page_Integrations_TokenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Integrations_TokenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "AI check of the customer PO" |
*
*/
export const page_order_ai_check_title: ((inputs?: Page_Order_Ai_Check_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Order_Ai_Check_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer amendment · header" |
*
*/
export const page_order_amendment_header: ((inputs?: Page_Order_Amendment_HeaderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Order_Amendment_HeaderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer amendment · line {line}" |
*
*/
export const page_order_amendment_line: ((inputs: Page_Order_Amendment_LineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Order_Amendment_LineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Amount" |
*
*/
export const page_order_amount: ((inputs?: Page_Order_AmountInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Order_AmountInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Backorder" |
*
*/
export const page_order_backorder: ((inputs?: Page_Order_BackorderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Order_BackorderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Bill" |
*
*/
export const page_order_bill: ((inputs?: Page_Order_BillInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Order_BillInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "A bill is payable only when ordered = received = billed. More billed than received puts it on hold; the same supplier's bill number can't be booked twice." |
*
*/
export const page_order_bills_subhead: ((inputs?: Page_Order_Bills_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Order_Bills_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier bills — 3-way match" |
*
*/
export const page_order_bills_title: ((inputs?: Page_Order_Bills_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Order_Bills_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Due" |
*
*/
export const page_order_due: ((inputs?: Page_Order_DueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Order_DueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Lot · expiry" |
*
*/
export const page_order_lot_expiry: ((inputs?: Page_Order_Lot_ExpiryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Order_Lot_ExpiryInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No supplier bills on this case yet." |
*
*/
export const page_order_no_bills: ((inputs?: Page_Order_No_BillsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Order_No_BillsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No supplier PO waiting to be confirmed." |
*
*/
export const page_order_no_confirm: ((inputs?: Page_Order_No_ConfirmInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Order_No_ConfirmInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No open mismatch on the customer's PO." |
*
*/
export const page_order_no_mismatch: ((inputs?: Page_Order_No_MismatchInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Order_No_MismatchInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No partial award on this case." |
*
*/
export const page_order_no_partial: ((inputs?: Page_Order_No_PartialInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Order_No_PartialInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No customer PO to check yet." |
*
*/
export const page_order_no_po: ((inputs?: Page_Order_No_PoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Order_No_PoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No supplier PO yet. They are prepared once the customer's PO is validated and the sales order is confirmed." |
*
*/
export const page_order_no_pos: ((inputs?: Page_Order_No_PosInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Order_No_PosInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No receipts on this case yet." |
*
*/
export const page_order_no_receipts: ((inputs?: Page_Order_No_ReceiptsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Order_No_ReceiptsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Partial award" |
*
*/
export const page_order_partial_title: ((inputs?: Page_Order_Partial_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Order_Partial_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "PO" |
*
*/
export const page_order_po: ((inputs?: Page_Order_PoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Order_PoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The customer's PO against the quotation" |
*
*/
export const page_order_po_check_subhead: ((inputs?: Page_Order_Po_Check_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Order_Po_Check_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer PO check" |
*
*/
export const page_order_po_check_title: ((inputs?: Page_Order_Po_Check_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Order_Po_Check_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Created from the confirmed sales order — split suppliers and scheduled quantities. Price, availability, FX and lead time are re-checked before a PO is confir..." |
*
*/
export const page_order_pos_subhead: ((inputs?: Page_Order_Pos_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Order_Pos_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier purchase orders" |
*
*/
export const page_order_pos_title: ((inputs?: Page_Order_Pos_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Order_Pos_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Warehouse receipts and drop-ship deliveries, with lot, expiry and quality check per line. A shortfall becomes a backorder with a date and an owner — it follo..." |
*
*/
export const page_order_receipts_subhead: ((inputs?: Page_Order_Receipts_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Order_Receipts_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receipts · lots · expiry · quality" |
*
*/
export const page_order_receipts_title: ((inputs?: Page_Order_Receipts_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Order_Receipts_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "After the order" |
*
*/
export const page_overview_after_order: ((inputs?: Page_Overview_After_OrderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Overview_After_OrderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Questions and answers per line, to the customer, a supplier or internal. Clear lines keep moving while one waits." |
*
*/
export const page_overview_clarifications_subhead: ((inputs?: Page_Overview_Clarifications_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Overview_Clarifications_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Clarifications log" |
*
*/
export const page_overview_clarifications_title: ((inputs?: Page_Overview_Clarifications_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Overview_Clarifications_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer contact rule" |
*
*/
export const page_overview_contact_rule: ((inputs?: Page_Overview_Contact_RuleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Overview_Contact_RuleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Last handover note" |
*
*/
export const page_overview_handover_title: ((inputs?: Page_Overview_Handover_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Overview_Handover_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Where the case is now" |
*
*/
export const page_overview_lifecycle_subhead: ((inputs?: Page_Overview_Lifecycle_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Overview_Lifecycle_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Lifecycle — first email to last payment" |
*
*/
export const page_overview_lifecycle_title: ((inputs?: Page_Overview_Lifecycle_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Overview_Lifecycle_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Line" |
*
*/
export const page_overview_line: ((inputs?: Page_Overview_LineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Overview_LineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Line progress" |
*
*/
export const page_overview_line_progress: ((inputs?: Page_Overview_Line_ProgressInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Overview_Line_ProgressInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Each line moves on its own. A case is never “done” until every line is." |
*
*/
export const page_overview_line_progress_subhead: ((inputs?: Page_Overview_Line_Progress_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Overview_Line_Progress_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Line status" |
*
*/
export const page_overview_line_status: ((inputs?: Page_Overview_Line_StatusInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Overview_Line_StatusInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Next action" |
*
*/
export const page_overview_next_action: ((inputs?: Page_Overview_Next_ActionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Overview_Next_ActionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No clarifications on this case." |
*
*/
export const page_overview_no_clarifications: ((inputs?: Page_Overview_No_ClarificationsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Overview_No_ClarificationsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No handover on this case yet." |
*
*/
export const page_overview_no_handover: ((inputs?: Page_Overview_No_HandoverInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Overview_No_HandoverInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No lines on this case yet." |
*
*/
export const page_overview_no_lines: ((inputs?: Page_Overview_No_LinesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Overview_No_LinesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing ordered on this case yet." |
*
*/
export const page_overview_nothing_ordered: ((inputs?: Page_Overview_Nothing_OrderedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Overview_Nothing_OrderedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open tasks" |
*
*/
export const page_overview_open_tasks: ((inputs?: Page_Overview_Open_TasksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Overview_Open_TasksInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Owner & backup" |
*
*/
export const page_overview_owner_backup: ((inputs?: Page_Overview_Owner_BackupInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Overview_Owner_BackupInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Case summary" |
*
*/
export const page_overview_summary: ((inputs?: Page_Overview_SummaryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Overview_SummaryInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Every automatic step names the rule that fired; every human step names the person. Nothing is edited after the fact." |
*
*/
export const page_overview_timeline_subhead: ((inputs?: Page_Overview_Timeline_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Overview_Timeline_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Activity timeline — audit trail" |
*
*/
export const page_overview_timeline_title: ((inputs?: Page_Overview_Timeline_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Overview_Timeline_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "To · via" |
*
*/
export const page_overview_to_via: ((inputs?: Page_Overview_To_ViaInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Overview_To_ViaInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approval" |
*
*/
export const page_pricing_approval: ((inputs?: Page_Pricing_ApprovalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Pricing_ApprovalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Price build-up per line" |
*
*/
export const page_pricing_build_up: ((inputs?: Page_Pricing_Build_UpInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Pricing_Build_UpInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier cost + shared charges + gross profit = selling price (EGP)" |
*
*/
export const page_pricing_build_up_subhead: ((inputs?: Page_Pricing_Build_Up_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Pricing_Build_Up_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Costs and margins are hidden for your role" |
*
*/
export const page_pricing_hidden: ((inputs?: Page_Pricing_HiddenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Pricing_HiddenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "How the price is built" |
*
*/
export const page_pricing_how_built: ((inputs?: Page_Pricing_How_BuiltInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Pricing_How_BuiltInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Margins and discount" |
*
*/
export const page_pricing_levers: ((inputs?: Page_Pricing_LeversInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Pricing_LeversInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Line pricing" |
*
*/
export const page_pricing_lines: ((inputs?: Page_Pricing_LinesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Pricing_LinesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Margin vs policy" |
*
*/
export const page_pricing_margin_vs_policy: ((inputs?: Page_Pricing_Margin_Vs_PolicyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Pricing_Margin_Vs_PolicyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No lines priced yet." |
*
*/
export const page_pricing_not_priced: ((inputs?: Page_Pricing_Not_PricedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Pricing_Not_PricedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Select an offer for a line to price it." |
*
*/
export const page_pricing_not_priced_description: ((inputs?: Page_Pricing_Not_Priced_DescriptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Pricing_Not_Priced_DescriptionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Policy checks" |
*
*/
export const page_pricing_policy_checks: ((inputs?: Page_Pricing_Policy_ChecksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Pricing_Policy_ChecksInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Shared charges" |
*
*/
export const page_pricing_shared_charges: ((inputs?: Page_Pricing_Shared_ChargesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Pricing_Shared_ChargesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "What if" |
*
*/
export const page_pricing_what_if: ((inputs?: Page_Pricing_What_IfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Pricing_What_IfInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Claims" |
*
*/
export const page_profit_claims: ((inputs?: Page_Profit_ClaimsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Profit_ClaimsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Close checklist" |
*
*/
export const page_profit_close_checklist: ((inputs?: Page_Profit_Close_ChecklistInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Profit_Close_ChecklistInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Close progress" |
*
*/
export const page_profit_close_progress: ((inputs?: Page_Profit_Close_ProgressInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Profit_Close_ProgressInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Expected vs actual cost" |
*
*/
export const page_profit_cost_title: ((inputs?: Page_Profit_Cost_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Profit_Cost_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Damage for a claim" |
*
*/
export const page_profit_damage: ((inputs?: Page_Profit_DamageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Profit_DamageInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Profit, costs and margins are not visible to Sales." |
*
*/
export const page_profit_denied: ((inputs?: Page_Profit_DeniedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Profit_DeniedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "FX differences" |
*
*/
export const page_profit_fx: ((inputs?: Page_Profit_FxInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Profit_FxInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No claims before the case is costed." |
*
*/
export const page_profit_no_claims: ((inputs?: Page_Profit_No_ClaimsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Profit_No_ClaimsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No cost sheet yet." |
*
*/
export const page_profit_no_cost_sheet: ((inputs?: Page_Profit_No_Cost_SheetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Profit_No_Cost_SheetInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Expected costs are fixed when the customer's PO is confirmed." |
*
*/
export const page_profit_no_cost_sheet_description: ((inputs?: Page_Profit_No_Cost_Sheet_DescriptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Profit_No_Cost_Sheet_DescriptionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No delivery to claim against yet." |
*
*/
export const page_profit_no_delivery: ((inputs?: Page_Profit_No_DeliveryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Profit_No_DeliveryInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No receipts yet." |
*
*/
export const page_profit_no_receipts: ((inputs?: Page_Profit_No_ReceiptsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Profit_No_ReceiptsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Acceptance tests from your brief" |
*
*/
export const page_project_acceptance: ((inputs?: Page_Project_AcceptanceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Project_AcceptanceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Your brief, line by line" |
*
*/
export const page_project_brief: ((inputs?: Page_Project_BriefInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Project_BriefInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Delivery calendar" |
*
*/
export const page_project_calendar: ((inputs?: Page_Project_CalendarInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Project_CalendarInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Running through every phase" |
*
*/
export const page_project_every_phase: ((inputs?: Page_Project_Every_PhaseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Project_Every_PhaseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Golden Sea × SaaSTEMLY · delivery plan" |
*
*/
export const page_project_eyebrow: ((inputs?: Page_Project_EyebrowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Project_EyebrowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Follow one case" |
*
*/
export const page_project_follow: ((inputs?: Page_Project_FollowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Project_FollowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "From the first email to the last payment" |
*
*/
export const page_project_heading: ((inputs?: Page_Project_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Project_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Milestones" |
*
*/
export const page_project_milestones: ((inputs?: Page_Project_MilestonesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Project_MilestonesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Monthly plan — from go-live" |
*
*/
export const page_project_monthly: ((inputs?: Page_Project_MonthlyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Project_MonthlyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No phase planned here." |
*
*/
export const page_project_no_phase: ((inputs?: Page_Project_No_PhaseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Project_No_PhaseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Acceptance tests passing" |
*
*/
export const page_project_passing: ((inputs?: Page_Project_PassingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Project_PassingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The last 20% is paid after 30 days of real use." |
*
*/
export const page_project_payment: ((inputs?: Page_Project_PaymentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Project_PaymentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nine problems you named. Nine answers." |
*
*/
export const page_project_problems: ((inputs?: Page_Project_ProblemsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Project_ProblemsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Roadmap — 13 weeks, phased" |
*
*/
export const page_project_roadmap: ((inputs?: Page_Project_RoadmapInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Project_RoadmapInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Start at the inbox" |
*
*/
export const page_project_start: ((inputs?: Page_Project_StartInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Project_StartInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Four phases over 13 weeks, each shown in this demo. Every requirement from your brief is covered and proven by an acceptance test before the final payment." |
*
*/
export const page_project_subtitle: ((inputs?: Page_Project_SubtitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Project_SubtitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "AI never sends, prices or pays without a person." |
*
*/
export const page_project_trust: ((inputs?: Page_Project_TrustInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Project_TrustInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Value from week 7. Everything by week 13." |
*
*/
export const page_project_weeks: ((inputs?: Page_Project_WeeksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Project_WeeksInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approvals" |
*
*/
export const page_quote_approvals: ((inputs?: Page_Quote_ApprovalsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Quote_ApprovalsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer copy" |
*
*/
export const page_quote_copy: ((inputs?: Page_Quote_CopyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Quote_CopyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer-facing: supplier names, costs and margins are never printed." |
*
*/
export const page_quote_copy_subhead: ((inputs?: Page_Quote_Copy_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Quote_Copy_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Decision state" |
*
*/
export const page_quote_decision: ((inputs?: Page_Quote_DecisionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Quote_DecisionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Internal — never printed" |
*
*/
export const page_quote_internal: ((inputs?: Page_Quote_InternalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Quote_InternalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No portal submission to check." |
*
*/
export const page_quote_no_portal: ((inputs?: Page_Quote_No_PortalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Quote_No_PortalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Only quotations sent through a customer's procurement portal are checked here." |
*
*/
export const page_quote_no_portal_description: ((inputs?: Page_Quote_No_Portal_DescriptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Quote_No_Portal_DescriptionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No other versions." |
*
*/
export const page_quote_no_versions: ((inputs?: Page_Quote_No_VersionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Quote_No_VersionsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Portal submission check" |
*
*/
export const page_quote_portal: ((inputs?: Page_Quote_PortalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Quote_PortalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Versions" |
*
*/
export const page_quote_versions: ((inputs?: Page_Quote_VersionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Quote_VersionsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Activity by kind" |
*
*/
export const page_records_activity_by_kind: ((inputs?: Page_Records_Activity_By_KindInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Activity_By_KindInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Activity per day" |
*
*/
export const page_records_activity_per_day: ((inputs?: Page_Records_Activity_Per_DayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Activity_Per_DayInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "AI calls by task" |
*
*/
export const page_records_ai_calls_by_task: ((inputs?: Page_Records_Ai_Calls_By_TaskInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Ai_Calls_By_TaskInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Available by product" |
*
*/
export const page_records_available_by_product: ((inputs?: Page_Records_Available_By_ProductInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Available_By_ProductInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open balance by age (USD)" |
*
*/
export const page_records_balance_by_age: ((inputs?: Page_Records_Balance_By_AgeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Balance_By_AgeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open balance by customer (USD)" |
*
*/
export const page_records_balance_by_customer: ((inputs?: Page_Records_Balance_By_CustomerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Balance_By_CustomerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Bills falling due, by week" |
*
*/
export const page_records_bills_due_by_week: ((inputs?: Page_Records_Bills_Due_By_WeekInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Bills_Due_By_WeekInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "By segment" |
*
*/
export const page_records_by_segment: ((inputs?: Page_Records_By_SegmentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_By_SegmentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Case value by customer" |
*
*/
export const page_records_case_value_by_customer: ((inputs?: Page_Records_Case_Value_By_CustomerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Case_Value_By_CustomerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Cases by stage" |
*
*/
export const page_records_cases_by_stage: ((inputs?: Page_Records_Cases_By_StageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Cases_By_StageInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Cases per owner" |
*
*/
export const page_records_cases_per_owner: ((inputs?: Page_Records_Cases_Per_OwnerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Cases_Per_OwnerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Contact rules" |
*
*/
export const page_records_contact_rules: ((inputs?: Page_Records_Contact_RulesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Contact_RulesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer POs per week" |
*
*/
export const page_records_customer_pos_per_week: ((inputs?: Page_Records_Customer_Pos_Per_WeekInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Customer_Pos_Per_WeekInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customers by type" |
*
*/
export const page_records_customers_by_type: ((inputs?: Page_Records_Customers_By_TypeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Customers_By_TypeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Decisions by kind" |
*
*/
export const page_records_decisions_by_kind: ((inputs?: Page_Records_Decisions_By_KindInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Decisions_By_KindInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Deliveries by status" |
*
*/
export const page_records_deliveries_by_status: ((inputs?: Page_Records_Deliveries_By_StatusInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Deliveries_By_StatusInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Deliveries per case" |
*
*/
export const page_records_deliveries_per_case: ((inputs?: Page_Records_Deliveries_Per_CaseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Deliveries_Per_CaseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Exceptions by source" |
*
*/
export const page_records_exceptions_by_source: ((inputs?: Page_Records_Exceptions_By_SourceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Exceptions_By_SourceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Where messages come from" |
*
*/
export const page_records_message_sources: ((inputs?: Page_Records_Message_SourcesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Message_SourcesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Messages per day" |
*
*/
export const page_records_messages_per_day: ((inputs?: Page_Records_Messages_Per_DayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Messages_Per_DayInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Money in and out" |
*
*/
export const page_records_money_in_out: ((inputs?: Page_Records_Money_In_OutInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Money_In_OutInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Offers by compliance" |
*
*/
export const page_records_offers_by_compliance: ((inputs?: Page_Records_Offers_By_ComplianceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Offers_By_ComplianceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Offers per supplier" |
*
*/
export const page_records_offers_per_supplier: ((inputs?: Page_Records_Offers_Per_SupplierInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Offers_Per_SupplierInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Order value by supplier" |
*
*/
export const page_records_order_value_by_supplier: ((inputs?: Page_Records_Order_Value_By_SupplierInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Order_Value_By_SupplierInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Orders by supplier" |
*
*/
export const page_records_orders_by_supplier: ((inputs?: Page_Records_Orders_By_SupplierInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Orders_By_SupplierInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Payments per week" |
*
*/
export const page_records_payments_per_week: ((inputs?: Page_Records_Payments_Per_WeekInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Payments_Per_WeekInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Price lists per principal" |
*
*/
export const page_records_pricelists_per_principal: ((inputs?: Page_Records_Pricelists_Per_PrincipalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Pricelists_Per_PrincipalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Prices per supplier" |
*
*/
export const page_records_prices_per_supplier: ((inputs?: Page_Records_Prices_Per_SupplierInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Prices_Per_SupplierInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Products by store" |
*
*/
export const page_records_products_by_store: ((inputs?: Page_Records_Products_By_StoreInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Products_By_StoreInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Where prospects come from" |
*
*/
export const page_records_prospect_sources: ((inputs?: Page_Records_Prospect_SourcesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Prospect_SourcesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quoted value by status" |
*
*/
export const page_records_quoted_value_by_status: ((inputs?: Page_Records_Quoted_Value_By_StatusInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Quoted_Value_By_StatusInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receipts by warehouse" |
*
*/
export const page_records_receipts_by_warehouse: ((inputs?: Page_Records_Receipts_By_WarehouseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Receipts_By_WarehouseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Requests per supplier" |
*
*/
export const page_records_requests_per_supplier: ((inputs?: Page_Records_Requests_Per_SupplierInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Requests_Per_SupplierInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Stock on hand by product" |
*
*/
export const page_records_stock_by_product: ((inputs?: Page_Records_Stock_By_ProductInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Stock_By_ProductInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Kinds of supplier" |
*
*/
export const page_records_supplier_kinds: ((inputs?: Page_Records_Supplier_KindsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Supplier_KindsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Suppliers by country" |
*
*/
export const page_records_suppliers_by_country: ((inputs?: Page_Records_Suppliers_By_CountryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Suppliers_By_CountryInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Tasks by type" |
*
*/
export const page_records_tasks_by_type: ((inputs?: Page_Records_Tasks_By_TypeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Tasks_By_TypeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The team by role" |
*
*/
export const page_records_team_by_role: ((inputs?: Page_Records_Team_By_RoleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Team_By_RoleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Units on hand by warehouse" |
*
*/
export const page_records_units_by_warehouse: ((inputs?: Page_Records_Units_By_WarehouseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Units_By_WarehouseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Vessels by type" |
*
*/
export const page_records_vessels_by_type: ((inputs?: Page_Records_Vessels_By_TypeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Vessels_By_TypeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Vessels per customer" |
*
*/
export const page_records_vessels_per_customer: ((inputs?: Page_Records_Vessels_Per_CustomerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Vessels_Per_CustomerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Who owes us (USD)" |
*
*/
export const page_records_who_owes_us: ((inputs?: Page_Records_Who_Owes_UsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Records_Who_Owes_UsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Replies arriving" |
*
*/
export const page_rfqs_arrivals_title: ((inputs?: Page_Rfqs_Arrivals_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_Arrivals_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Declined · no response" |
*
*/
export const page_rfqs_closed: ((inputs?: Page_Rfqs_ClosedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_ClosedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Two reminders, then the owner is alerted" |
*
*/
export const page_rfqs_closed_note: ((inputs?: Page_Rfqs_Closed_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_Closed_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Draft supplier RFQs" |
*
*/
export const page_rfqs_draft_title: ((inputs?: Page_Rfqs_Draft_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_Draft_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Drafted supplier RFQs" |
*
*/
export const page_rfqs_drafted_title: ((inputs?: Page_Rfqs_Drafted_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_Drafted_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "From 1 customer RFQ" |
*
*/
export const page_rfqs_from_one: ((inputs?: Page_Rfqs_From_OneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_From_OneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Lines" |
*
*/
export const page_rfqs_lines: ((inputs?: Page_Rfqs_LinesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_LinesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No supplier RFQs yet — draft them below." |
*
*/
export const page_rfqs_list_empty: ((inputs?: Page_Rfqs_List_EmptyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_List_EmptyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Each supplier sees only the lines they can quote — never the client, the vessel or the client's files." |
*
*/
export const page_rfqs_list_subhead: ((inputs?: Page_Rfqs_List_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_List_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Matched by reference, thread and sender — even when the supplier changed the subject." |
*
*/
export const page_rfqs_matched_subhead: ((inputs?: Page_Rfqs_Matched_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_Matched_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Replies matched" |
*
*/
export const page_rfqs_matched_title: ((inputs?: Page_Rfqs_Matched_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_Matched_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No drafts waiting to be sent." |
*
*/
export const page_rfqs_no_drafts: ((inputs?: Page_Rfqs_No_DraftsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_No_DraftsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Draft RFQs keeps them here to check before they go out." |
*
*/
export const page_rfqs_no_drafts_description: ((inputs?: Page_Rfqs_No_Drafts_DescriptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_No_Drafts_DescriptionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No new suppliers from replies yet." |
*
*/
export const page_rfqs_no_new_suppliers: ((inputs?: Page_Rfqs_No_New_SuppliersInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_No_New_SuppliersInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No draft emails to preview." |
*
*/
export const page_rfqs_no_previews: ((inputs?: Page_Rfqs_No_PreviewsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_No_PreviewsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No supplier replies yet." |
*
*/
export const page_rfqs_no_replies: ((inputs?: Page_Rfqs_No_RepliesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_No_RepliesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No supplier is being chased." |
*
*/
export const page_rfqs_none_chased: ((inputs?: Page_Rfqs_None_ChasedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_None_ChasedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reminders and escalation" |
*
*/
export const page_rfqs_reminders_title: ((inputs?: Page_Rfqs_Reminders_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_Reminders_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Replied" |
*
*/
export const page_rfqs_replied: ((inputs?: Page_Rfqs_RepliedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_RepliedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Offers captured automatically" |
*
*/
export const page_rfqs_replied_note: ((inputs?: Page_Rfqs_Replied_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_Replied_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing waiting for a person." |
*
*/
export const page_rfqs_review_empty: ((inputs?: Page_Rfqs_Review_EmptyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_Review_EmptyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Anything the AI isn't sure of waits here — nothing uncertain is applied on its own." |
*
*/
export const page_rfqs_review_subhead: ((inputs?: Page_Rfqs_Review_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_Review_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Needs a person" |
*
*/
export const page_rfqs_review_title: ((inputs?: Page_Rfqs_Review_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_Review_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sent · due" |
*
*/
export const page_rfqs_sent_due: ((inputs?: Page_Rfqs_Sent_DueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_Sent_DueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier RFQs" |
*
*/
export const page_rfqs_supplier_rfqs: ((inputs?: Page_Rfqs_Supplier_RfqsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_Supplier_RfqsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Waiting" |
*
*/
export const page_rfqs_waiting: ((inputs?: Page_Rfqs_WaitingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_WaitingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reminders scheduled" |
*
*/
export const page_rfqs_waiting_note: ((inputs?: Page_Rfqs_Waiting_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Rfqs_Waiting_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Who is alerted" |
*
*/
export const page_roles_alerted: ((inputs?: Page_Roles_AlertedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Roles_AlertedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Approval rules" |
*
*/
export const page_roles_approval_rules: ((inputs?: Page_Roles_Approval_RulesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Roles_Approval_RulesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Enforced, not just written down" |
*
*/
export const page_roles_enforced: ((inputs?: Page_Roles_EnforcedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Roles_EnforcedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Team · access" |
*
*/
export const page_roles_eyebrow: ((inputs?: Page_Roles_EyebrowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Roles_EyebrowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Roles & permissions" |
*
*/
export const page_roles_heading: ((inputs?: Page_Roles_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Roles_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Permissions matrix" |
*
*/
export const page_roles_matrix: ((inputs?: Page_Roles_MatrixInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Roles_MatrixInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Who can see and approve what, per role and person. Named users and licences are confirmed in Phase 0. Management edits a role: it applies to everyone in it a..." |
*
*/
export const page_roles_matrix_subhead: ((inputs?: Page_Roles_Matrix_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Roles_Matrix_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No one is alerted in office hours." |
*
*/
export const page_roles_no_alert: ((inputs?: Page_Roles_No_AlertInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Roles_No_AlertInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The case owner picks the RFQ up." |
*
*/
export const page_roles_no_alert_description: ((inputs?: Page_Roles_No_Alert_DescriptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Roles_No_Alert_DescriptionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "People" |
*
*/
export const page_roles_people: ((inputs?: Page_Roles_PeopleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Roles_PeopleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Role" |
*
*/
export const page_roles_role: ((inputs?: Page_Roles_RoleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Roles_RoleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "On-call roster" |
*
*/
export const page_roles_roster: ((inputs?: Page_Roles_RosterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Roles_RosterInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Office hours Sun–Thu 08:00–17:00 Cairo. Outside them, urgent RFQs (or a vessel ETA under 24 h) alert the on-duty person by WhatsApp / SMS, then the backup, t..." |
*
*/
export const page_roles_roster_subhead: ((inputs?: Page_Roles_Roster_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Roles_Roster_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "After-hours routing — try it" |
*
*/
export const page_roles_routing: ((inputs?: Page_Roles_RoutingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Roles_RoutingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sales never sees costs or margins; approvals need a named person; bank-detail changes need two. Urgent RFQs after hours go to whoever is on call." |
*
*/
export const page_roles_subtitle: ((inputs?: Page_Roles_SubtitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Roles_SubtitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Where each permission is enforced" |
*
*/
export const page_roles_where: ((inputs?: Page_Roles_WhereInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Roles_WhereInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Time to acknowledge" |
*
*/
export const page_room_ack: ((inputs?: Page_Room_AckInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_AckInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Ask Golden Sea" |
*
*/
export const page_room_ask: ((inputs?: Page_Room_AskInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_AskInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "07:00 · daily AI briefing" |
*
*/
export const page_room_briefing: ((inputs?: Page_Room_BriefingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_BriefingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Deliveries this month" |
*
*/
export const page_room_deliveries: ((inputs?: Page_Room_DeliveriesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_DeliveriesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Fast but late" |
*
*/
export const page_room_fast_late: ((inputs?: Page_Room_Fast_LateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_Fast_LateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quote funnel" |
*
*/
export const page_room_funnel: ((inputs?: Page_Room_FunnelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_FunnelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Gross profit: expected to actual" |
*
*/
export const page_room_gp_bridge: ((inputs?: Page_Room_Gp_BridgeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_Gp_BridgeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Inquiries per day" |
*
*/
export const page_room_inquiries: ((inputs?: Page_Room_InquiriesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_InquiriesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Live cases" |
*
*/
export const page_room_live_cases: ((inputs?: Page_Room_Live_CasesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_Live_CasesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Why quotes were lost" |
*
*/
export const page_room_lost: ((inputs?: Page_Room_LostInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_LostInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No gross profit to bridge yet." |
*
*/
export const page_room_no_gp: ((inputs?: Page_Room_No_GpInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_No_GpInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No ranking to show." |
*
*/
export const page_room_no_ranking: ((inputs?: Page_Room_No_RankingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_No_RankingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No open receivables." |
*
*/
export const page_room_no_receivables: ((inputs?: Page_Room_No_ReceivablesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_No_ReceivablesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No trend to show." |
*
*/
export const page_room_no_trend: ((inputs?: Page_Room_No_TrendInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_No_TrendInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Suppliers by on-time delivery" |
*
*/
export const page_room_ontime: ((inputs?: Page_Room_OntimeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_OntimeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Best first; reply time and open RFQs under each, from the live records" |
*
*/
export const page_room_ontime_subhead: ((inputs?: Page_Room_Ontime_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_Ontime_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Live cases per owner" |
*
*/
export const page_room_per_owner: ((inputs?: Page_Room_Per_OwnerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_Per_OwnerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Every live case has an owner, a deadline and a next action" |
*
*/
export const page_room_per_owner_subhead: ((inputs?: Page_Room_Per_Owner_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_Per_Owner_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Profit & cash" |
*
*/
export const page_room_profit_cash: ((inputs?: Page_Room_Profit_CashInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_Profit_CashInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Suppliers: on time vs reply time" |
*
*/
export const page_room_quadrant: ((inputs?: Page_Room_QuadrantInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_QuadrantInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Each supplier by its on-time deliveries and how fast it replies; choose one to open it" |
*
*/
export const page_room_quadrant_subhead: ((inputs?: Page_Room_Quadrant_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_Quadrant_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receivables by age" |
*
*/
export const page_room_receivables_age: ((inputs?: Page_Room_Receivables_AgeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_Receivables_AgeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receivables by customer" |
*
*/
export const page_room_receivables_customer: ((inputs?: Page_Room_Receivables_CustomerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_Receivables_CustomerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reliable & fast" |
*
*/
export const page_room_reliable_fast: ((inputs?: Page_Room_Reliable_FastInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_Reliable_FastInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reliable but slow" |
*
*/
export const page_room_reliable_slow: ((inputs?: Page_Room_Reliable_SlowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_Reliable_SlowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Slow and late" |
*
*/
export const page_room_slow_late: ((inputs?: Page_Room_Slow_LateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_Slow_LateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Targets" |
*
*/
export const page_room_targets: ((inputs?: Page_Room_TargetsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_TargetsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quote turnaround" |
*
*/
export const page_room_turnaround: ((inputs?: Page_Room_TurnaroundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_TurnaroundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "What live cases wait on" |
*
*/
export const page_room_waits: ((inputs?: Page_Room_WaitsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Room_WaitsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Messages to review, supplier requests awaiting a reply and offers to check, on one page." |
*
*/
export const page_sourcing_description: ((inputs?: Page_Sourcing_DescriptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Sourcing_DescriptionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sourcing desk" |
*
*/
export const page_sourcing_eyebrow: ((inputs?: Page_Sourcing_EyebrowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Sourcing_EyebrowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sourcing pipeline" |
*
*/
export const page_sourcing_heading: ((inputs?: Page_Sourcing_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Sourcing_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "New and flagged messages; a message opens beside the list." |
*
*/
export const page_sourcing_messages_subhead: ((inputs?: Page_Sourcing_Messages_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Sourcing_Messages_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Messages to review" |
*
*/
export const page_sourcing_messages_title: ((inputs?: Page_Sourcing_Messages_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Sourcing_Messages_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pipeline" |
*
*/
export const page_sourcing_nav: ((inputs?: Page_Sourcing_NavInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Sourcing_NavInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Technical equivalence is a person's decision." |
*
*/
export const page_sourcing_offers_subhead: ((inputs?: Page_Sourcing_Offers_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Sourcing_Offers_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Offers to check" |
*
*/
export const page_sourcing_offers_title: ((inputs?: Page_Sourcing_Offers_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Sourcing_Offers_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier requests awaiting a reply" |
*
*/
export const page_sourcing_rfqs_title: ((inputs?: Page_Sourcing_Rfqs_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Sourcing_Rfqs_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Messages to read, supplier requests awaiting a reply, and offers to check, on one page." |
*
*/
export const page_sourcing_subtitle: ((inputs?: Page_Sourcing_SubtitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Sourcing_SubtitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "This month against the plan at full use" |
*
*/
export const page_usage_against_plan: ((inputs?: Page_Usage_Against_PlanInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Usage_Against_PlanInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "AI calls by task" |
*
*/
export const page_usage_ai_calls: ((inputs?: Page_Usage_Ai_CallsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Usage_Ai_CallsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "AI log" |
*
*/
export const page_usage_ai_log: ((inputs?: Page_Usage_Ai_LogInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Usage_Ai_LogInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Each one estimated and approved before work starts." |
*
*/
export const page_usage_changes_subhead: ((inputs?: Page_Usage_Changes_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Usage_Changes_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Change requests" |
*
*/
export const page_usage_changes_title: ((inputs?: Page_Usage_Changes_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Usage_Changes_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Edit the plan" |
*
*/
export const page_usage_edit_plan: ((inputs?: Page_Usage_Edit_PlanInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Usage_Edit_PlanInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Configuration · service" |
*
*/
export const page_usage_eyebrow: ((inputs?: Page_Usage_EyebrowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Usage_EyebrowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Service usage" |
*
*/
export const page_usage_heading: ((inputs?: Page_Usage_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Usage_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "What the platform did this month, counted the way the running costs are: documents read, questions answered, emails processed, support hours and changes. Qui..." |
*
*/
export const page_usage_subtitle: ((inputs?: Page_Usage_SubtitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Usage_SubtitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sunday to Thursday, on your hours: fixes, updates, security patches and questions." |
*
*/
export const page_usage_support_subhead: ((inputs?: Page_Usage_Support_SubheadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Usage_Support_SubheadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Support log" |
*
*/
export const page_usage_support_title: ((inputs?: Page_Usage_Support_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Usage_Support_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Insights · value" |
*
*/
export const page_value_eyebrow: ((inputs?: Page_Value_EyebrowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Value_EyebrowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "What the platform is worth to you" |
*
*/
export const page_value_heading: ((inputs?: Page_Value_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Value_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "When it pays for itself" |
*
*/
export const page_value_payback: ((inputs?: Page_Value_PaybackInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Value_PaybackInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Delivery plan" |
*
*/
export const page_value_plan: ((inputs?: Page_Value_PlanInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Value_PlanInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Extra orders won and hours saved, in your own figures. Move the sliders; nothing is saved. Below, what the AI's work saved this month." |
*
*/
export const page_value_subtitle: ((inputs?: Page_Value_SubtitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Value_SubtitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Service usage" |
*
*/
export const page_value_usage: ((inputs?: Page_Value_UsageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Page_Value_UsageInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "actual against expected" |
*
*/
export const profit_actual_against_expected: ((inputs?: Profit_Actual_Against_ExpectedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Actual_Against_ExpectedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{pct} margin · final, every cost is actual" |
*
*/
export const profit_actual_final: ((inputs: Profit_Actual_FinalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Actual_FinalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{pct} margin · so far, {count} close check open" |
* | * | "{pct} margin · so far, {count} close checks open" |
*
*/
export const profit_actual_so_far: ((inputs: Profit_Actual_So_FarInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Actual_So_FarInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "at quotation" |
*
*/
export const profit_at_quotation: ((inputs?: Profit_At_QuotationInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_At_QuotationInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Done" |
*
*/
export const profit_check_done: ((inputs?: Profit_Check_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Check_DoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open" |
*
*/
export const profit_check_open: ((inputs?: Profit_Check_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Check_OpenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The case closes only when quantities, documents, claims and balances reconcile." |
*
*/
export const profit_checklist_note: ((inputs?: Profit_Checklist_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Checklist_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Every close check is green" |
*
*/
export const profit_checks_green_heading: ((inputs?: Profit_Checks_Green_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Checks_Green_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Checks green" |
*
*/
export const profit_checks_green_label: ((inputs?: Profit_Checks_Green_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Checks_Green_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quantities, documents, claims and balances reconcile: the case can be closed." |
*
*/
export const profit_checks_green_text: ((inputs?: Profit_Checks_Green_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Checks_Green_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} close check open" |
* | * | "{count} close checks open" |
*
*/
export const profit_checks_open: ((inputs: Profit_Checks_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Checks_OpenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The actual profit is final once every cost is confirmed against its bill and the case is closed." |
*
*/
export const profit_checks_open_text: ((inputs?: Profit_Checks_Open_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Checks_Open_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{amount} against {against} · {note}" |
*
*/
export const profit_claim: ((inputs: Profit_ClaimInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_ClaimInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{amount} against {against} · {note} · settled by credit note {creditNote}" |
*
*/
export const profit_claim_settled: ((inputs: Profit_Claim_SettledInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Claim_SettledInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No claims on this case." |
*
*/
export const profit_claims_empty: ((inputs?: Profit_Claims_EmptyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Claims_EmptyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Case closed and settled" |
*
*/
export const profit_closed_heading: ((inputs?: Profit_Closed_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Closed_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Actual profit recorded; supplier prices and on-time results fed back to the supplier records." |
*
*/
export const profit_closed_text: ((inputs?: Profit_Closed_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Closed_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Closed {at}. Actual profit recorded; supplier prices and on-time results fed back to the supplier records." |
*
*/
export const profit_closed_text_at: ((inputs: Profit_Closed_Text_AtInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Closed_Text_AtInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Actual" |
*
*/
export const profit_col_actual: ((inputs?: Profit_Col_ActualInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Col_ActualInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Cost" |
*
*/
export const profit_col_cost: ((inputs?: Profit_Col_CostInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Col_CostInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Difference" |
*
*/
export const profit_col_difference: ((inputs?: Profit_Col_DifferenceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Col_DifferenceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Expected" |
*
*/
export const profit_col_expected: ((inputs?: Profit_Col_ExpectedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Col_ExpectedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "FX difference" |
*
*/
export const profit_col_fx: ((inputs?: Profit_Col_FxInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Col_FxInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Rate" |
*
*/
export const profit_col_rate: ((inputs?: Profit_Col_RateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Col_RateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receipt" |
*
*/
export const profit_col_receipt: ((inputs?: Profit_Col_ReceiptInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Col_ReceiptInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Status" |
*
*/
export const profit_col_status: ((inputs?: Profit_Col_StatusInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Col_StatusInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Costs as estimated when the quotation was approved, and as billed. Bills replace estimates once a person confirms them; nothing changes on its own." |
*
*/
export const profit_costs_note: ((inputs?: Profit_Costs_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Costs_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "This voice note describes goods delivered to a ship. Write down the damage or shortage for a claim: which items, how many, and what is wrong." |
*
*/
export const profit_damage_audio_prompt: ((inputs?: Profit_Damage_Audio_PromptInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Damage_Audio_PromptInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "This photo shows goods delivered to a ship. Describe any damage for a claim: which items, how many, what is damaged (dents, leaks, broken seals, wet cartons)..." |
*
*/
export const profit_damage_image_prompt: ((inputs?: Profit_Damage_Image_PromptInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Damage_Image_PromptInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Describe damage from a photo" |
*
*/
export const profit_damage_label: ((inputs?: Profit_Damage_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Damage_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{date}, {time}" |
*
*/
export const profit_date_time: ((inputs: Profit_Date_TimeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Date_TimeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{done} / {total}" |
*
*/
export const profit_done_of: ((inputs: Profit_Done_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Done_OfInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Actual gross profit" |
*
*/
export const profit_figure_actual: ((inputs?: Profit_Figure_ActualInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Figure_ActualInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Difference" |
*
*/
export const profit_figure_difference: ((inputs?: Profit_Figure_DifferenceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Figure_DifferenceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Expected gross profit" |
*
*/
export const profit_figure_expected: ((inputs?: Profit_Figure_ExpectedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Figure_ExpectedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "FX difference" |
*
*/
export const profit_figure_fx: ((inputs?: Profit_Figure_FxInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Figure_FxInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No receipts yet." |
*
*/
export const profit_fx_empty: ((inputs?: Profit_Fx_EmptyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Fx_EmptyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Invoiced in EGP, so there's no exchange-rate difference." |
*
*/
export const profit_fx_empty_egp: ((inputs?: Profit_Fx_Empty_EgpInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Fx_Empty_EgpInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "quoted at {quoted} · today {today} EGP/{currency}" |
*
*/
export const profit_fx_note: ((inputs: Profit_Fx_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Fx_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Revenue is booked at the quotation's rate ({rate} EGP/{currency}); each receipt converts at the bank's actual rate. Expected revenue {expected} · actual {act..." |
*
*/
export const profit_fx_table_note: ((inputs: Profit_Fx_Table_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Fx_Table_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{done} of {total} green" |
*
*/
export const profit_green_of: ((inputs: Profit_Green_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Green_OfInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "invoiced in EGP" |
*
*/
export const profit_invoiced_egp: ((inputs?: Profit_Invoiced_EgpInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Invoiced_EgpInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{pct} margin" |
*
*/
export const profit_margin: ((inputs: Profit_MarginInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_MarginInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{points} pts of margin" |
*
*/
export const profit_margin_points: ((inputs: Profit_Margin_PointsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Margin_PointsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Expected profit is fixed at the customer PO" |
*
*/
export const profit_not_costed_heading: ((inputs?: Profit_Not_Costed_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Not_Costed_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{caseId} is at \"{stage}\". The expected profit is taken from the approved quotation once the customer's PO is confirmed; actuals follow as supplier bills arrive." |
*
*/
export const profit_not_costed_text: ((inputs: Profit_Not_Costed_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Not_Costed_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "of the expected profit" |
*
*/
export const profit_of_expected: ((inputs?: Profit_Of_ExpectedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Of_ExpectedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "quoted {rate}" |
*
*/
export const profit_quoted_rate: ((inputs: Profit_Quoted_RateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Quoted_RateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "rate {from} → {to}" |
*
*/
export const profit_rate_change: ((inputs: Profit_Rate_ChangeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Rate_ChangeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Realised" |
*
*/
export const profit_realised: ((inputs?: Profit_RealisedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_RealisedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Actual" |
*
*/
export const profit_state_actual: ((inputs?: Profit_State_ActualInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_State_ActualInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Billed, to confirm" |
*
*/
export const profit_state_billed: ((inputs?: Profit_State_BilledInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_State_BilledInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Estimate" |
*
*/
export const profit_state_estimate: ((inputs?: Profit_State_EstimateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_State_EstimateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Not applicable" |
*
*/
export const profit_state_not_applicable: ((inputs?: Profit_State_Not_ApplicableInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_State_Not_ApplicableInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Total cost" |
*
*/
export const profit_total_cost: ((inputs?: Profit_Total_CostInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_Total_CostInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Unrealised" |
*
*/
export const profit_unrealised: ((inputs?: Profit_UnrealisedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Profit_UnrealisedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The ten scenarios you asked to see live, each with its evidence. Checked against the data in this demo {at}; at go-live they run on your own data." |
*
*/
export const project_acceptance_note: ((inputs: Project_Acceptance_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Project_Acceptance_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "→ {answer}" |
*
*/
export const project_answer: ((inputs: Project_AnswerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Project_AnswerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Every requirement designed, with the screen that shows it and an acceptance test." |
*
*/
export const project_brief_note: ((inputs?: Project_Brief_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Project_Brief_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Checked live" |
*
*/
export const project_col_checked: ((inputs?: Project_Col_CheckedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Project_Col_CheckedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "From your brief" |
*
*/
export const project_col_requirement: ((inputs?: Project_Col_RequirementInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Project_Col_RequirementInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Scenario" |
*
*/
export const project_col_scenario: ((inputs?: Project_Col_ScenarioInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Project_Col_ScenarioInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Status" |
*
*/
export const project_col_status: ((inputs?: Project_Col_StatusInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Project_Col_StatusInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Covered" |
*
*/
export const project_covered: ((inputs?: Project_CoveredInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Project_CoveredInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{done} / {total} covered" |
*
*/
export const project_covered_of: ((inputs: Project_Covered_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Project_Covered_OfInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{done} / {total}" |
*
*/
export const project_done_of: ((inputs: Project_Done_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Project_Done_OfInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "One monthly plan keeps everything running after go-live." |
*
*/
export const project_monthly_note: ((inputs?: Project_Monthly_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Project_Monthly_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Odoo licences are with Odoo directly. Larger change requests are scoped and agreed separately." |
*
*/
export const project_monthly_note_licences: ((inputs?: Project_Monthly_Note_LicencesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Project_Monthly_Note_LicencesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open" |
*
*/
export const project_open: ((inputs?: Project_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Project_OpenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open in demo" |
*
*/
export const project_open_in_demo: ((inputs?: Project_Open_In_DemoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Project_Open_In_DemoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{done} / {total} pass" |
*
*/
export const project_pass_of: ((inputs: Project_Pass_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Project_Pass_OfInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Passing" |
*
*/
export const project_passing: ((inputs?: Project_PassingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Project_PassingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Each phase is paid in three steps, so you only pay the last part once it works in your hands." |
*
*/
export const project_payment_note: ((inputs?: Project_Payment_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Project_Payment_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Phase" |
*
*/
export const project_phase: ((inputs?: Project_PhaseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Project_PhaseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Phase {n}" |
*
*/
export const project_phase_n: ((inputs: Project_Phase_NInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Project_Phase_NInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Problem {n}" |
*
*/
export const project_problem: ((inputs: Project_ProblemInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Project_ProblemInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Each phase is approved on its own; a weekly 45-minute review keeps progress, baseline numbers and decisions in one place." |
*
*/
export const project_roadmap_note: ((inputs?: Project_Roadmap_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Project_Roadmap_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Show me" |
*
*/
export const project_show_me: ((inputs?: Project_Show_MeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Project_Show_MeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{count} of {total} acceptance tests pass" |
*
*/
export const project_tests_pass: ((inputs: Project_Tests_PassInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Project_Tests_PassInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "W{n}" |
*
*/
export const project_week: ((inputs: Project_WeekInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Project_WeekInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "After hours" |
*
*/
export const roles_after_hours: ((inputs?: Roles_After_HoursInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Roles_After_HoursInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Alert sent to {name} (WhatsApp / SMS simulated · notification created)" |
*
*/
export const roles_alert_sent: ((inputs: Roles_Alert_SentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Roles_Alert_SentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Failing" |
*
*/
export const roles_failing: ((inputs?: Roles_FailingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Roles_FailingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{reason} Office hours — the case owner picks it up; no alert needed." |
*
*/
export const roles_in_hours_text: ((inputs: Roles_In_Hours_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Roles_In_Hours_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Office hours" |
*
*/
export const roles_office_hours: ((inputs?: Roles_Office_HoursInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Roles_Office_HoursInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open GS-RFQ-0142 pricing" |
*
*/
export const roles_open_pricing: ((inputs?: Roles_Open_PricingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Roles_Open_PricingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Fri 20 Nov 10:00 — weekend" |
*
*/
export const roles_preset_friday: ((inputs?: Roles_Preset_FridayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Roles_Preset_FridayInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Tue 17 Nov 11:30 — office hours" |
*
*/
export const roles_preset_office: ((inputs?: Roles_Preset_OfficeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Roles_Preset_OfficeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sat 21 Nov 14:00 — weekend" |
*
*/
export const roles_preset_saturday: ((inputs?: Roles_Preset_SaturdayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Roles_Preset_SaturdayInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sun 22 Nov 06:30 — before office" |
*
*/
export const roles_preset_sunday: ((inputs?: Roles_Preset_SundayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Roles_Preset_SundayInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Tonight 21:40" |
*
*/
export const roles_preset_tonight: ((inputs?: Roles_Preset_TonightInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Roles_Preset_TonightInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Send the alert (simulated)" |
*
*/
export const roles_send_alert: ((inputs?: Roles_Send_AlertInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Roles_Send_AlertInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "When the urgent RFQ arrives" |
*
*/
export const roles_simulator_choice: ((inputs?: Roles_Simulator_ChoiceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Roles_Simulator_ChoiceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pick when an urgent RFQ arrives. The rule “After-hours & weekend RFQ” decides who is alerted; the alert is simulated and lands in that person's notifications." |
*
*/
export const roles_simulator_note: ((inputs?: Roles_Simulator_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Roles_Simulator_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "+{minutes} min: {name} (backup)" |
*
*/
export const roles_step_backup: ((inputs: Roles_Step_BackupInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Roles_Step_BackupInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Now: {name} (on duty)" |
*
*/
export const roles_step_now: ((inputs: Roles_Step_NowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Roles_Step_NowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Then: {names} (senior)" |
*
*/
export const roles_step_senior: ((inputs: Roles_Step_SeniorInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Roles_Step_SeniorInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Try it: switch the signed-in user to Soaad Amer (Sales) and open the pricing tab of GS-RFQ-0142 — costs and margins are gone." |
*
*/
export const roles_try_it: ((inputs?: Roles_Try_ItInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Roles_Try_ItInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Verified" |
*
*/
export const roles_verified: ((inputs?: Roles_VerifiedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Roles_VerifiedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{full} at full use" |
*
*/
export const service_at_full_use: ((inputs: Service_At_Full_UseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_At_Full_UseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{part} of {calls} AI calls" |
*
*/
export const service_calls_share: ((inputs: Service_Calls_ShareInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_Calls_ShareInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Checked by a person" |
*
*/
export const service_checked: ((inputs?: Service_CheckedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_CheckedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "AI results confirmed, corrected or rejected" |
*
*/
export const service_checked_note: ((inputs?: Service_Checked_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_Checked_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{documents} of {full} documents at full use" |
*
*/
export const service_documents_share: ((inputs: Service_Documents_ShareInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_Documents_ShareInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Extra orders won a month" |
*
*/
export const service_extra_orders: ((inputs?: Service_Extra_OrdersInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_Extra_OrdersInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Gross margin" |
*
*/
export const service_gross_margin: ((inputs?: Service_Gross_MarginInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_Gross_MarginInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Cost of an hour" |
*
*/
export const service_hour_cost: ((inputs?: Service_Hour_CostInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_Hour_CostInputs, { locale?: "en" | "ar" }, {}>;
/**
* | nPlural | output |
* | --- | --- |
* | * | "{hours} hours" |
*
*/
export const service_hours: ((inputs: Service_HoursInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_HoursInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Hours saved a person a week" |
*
*/
export const service_hours_per_person: ((inputs?: Service_Hours_Per_PersonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_Hours_Per_PersonInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Hours of typing saved" |
*
*/
export const service_hours_saved: ((inputs?: Service_Hours_SavedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_Hours_SavedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | nPlural | output |
* | --- | --- |
* | * | "about {minutes} minutes a document by hand" |
*
*/
export const service_hours_saved_note: ((inputs: Service_Hours_Saved_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_Hours_Saved_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Margin from extra orders a month" |
*
*/
export const service_margin_month: ((inputs?: Service_Margin_MonthInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_Margin_MonthInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Average order value" |
*
*/
export const service_order_value: ((inputs?: Service_Order_ValueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_Order_ValueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Payback" |
*
*/
export const service_payback: ((inputs?: Service_PaybackInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_PaybackInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Starts at the proposal's illustration; slide to your own figures. This month the AI already read {documents} documents, about {hours} hours of typing." |
*
*/
export const service_payback_note: ((inputs: Service_Payback_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_Payback_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "People using it" |
*
*/
export const service_people: ((inputs?: Service_PeopleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_PeopleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{month}, day {day} of {days}. The tick is the plan at full use; quieter months use less." |
*
*/
export const service_plan_note: ((inputs: Service_Plan_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_Plan_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Replies matched" |
*
*/
export const service_replies_matched: ((inputs?: Service_Replies_MatchedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_Replies_MatchedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "supplier replies filed on their case" |
*
*/
export const service_replies_matched_note: ((inputs?: Service_Replies_Matched_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_Replies_Matched_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{automatic} of {matched} with no one's help" |
*
*/
export const service_replies_share: ((inputs: Service_Replies_ShareInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_Replies_ShareInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{used} so far, on pace for {pace}" |
*
*/
export const service_so_far: ((inputs: Service_So_FarInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_So_FarInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Time saved a month" |
*
*/
export const service_time_month: ((inputs?: Service_Time_MonthInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_Time_MonthInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Value a month" |
*
*/
export const service_value_month: ((inputs?: Service_Value_MonthInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_Value_MonthInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Value a year" |
*
*/
export const service_value_year: ((inputs?: Service_Value_YearInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_Value_YearInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Waiting for review" |
*
*/
export const service_waiting: ((inputs?: Service_WaitingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_WaitingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "uncertain results are never applied alone" |
*
*/
export const service_waiting_note: ((inputs?: Service_Waiting_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Service_Waiting_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Every line is held until clarified." |
*
*/
export const sourcing_all_held: ((inputs?: Sourcing_All_HeldInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_All_HeldInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Client name removed" |
*
*/
export const sourcing_client_removed: ((inputs?: Sourcing_Client_RemovedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Client_RemovedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Discard drafts" |
*
*/
export const sourcing_discard_drafts: ((inputs?: Sourcing_Discard_DraftsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Discard_DraftsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Draft" |
*
*/
export const sourcing_draft: ((inputs?: Sourcing_DraftInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_DraftInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Draft RFQs" |
*
*/
export const sourcing_draft_rfqs: ((inputs?: Sourcing_Draft_RfqsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Draft_RfqsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Draft supplier RFQs" |
*
*/
export const sourcing_draft_rfqs_prompt: ((inputs?: Sourcing_Draft_Rfqs_PromptInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Draft_Rfqs_PromptInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Drafts discarded — nothing was sent" |
*
*/
export const sourcing_drafts_discarded: ((inputs?: Sourcing_Drafts_DiscardedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Drafts_DiscardedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Full list" |
*
*/
export const sourcing_full: ((inputs?: Sourcing_FullInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_FullInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "General chandlers receive every line in one RFQ." |
*
*/
export const sourcing_full_note: ((inputs?: Sourcing_Full_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Full_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Held back until clarified: {lines}" |
*
*/
export const sourcing_held_back: ((inputs: Sourcing_Held_BackInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Held_BackInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "How to send" |
*
*/
export const sourcing_how_to_send: ((inputs?: Sourcing_How_To_SendInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_How_To_SendInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "asked: {rfqs}" |
*
*/
export const sourcing_line_asked: ((inputs: Sourcing_Line_AskedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Line_AskedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "held: {reason}" |
*
*/
export const sourcing_line_held: ((inputs: Sourcing_Line_HeldInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Line_HeldInputs, { locale?: "en" | "ar" }, {}>;
/**
* | nPlural | output |
* | --- | --- |
* | "one" | "{count} offer" |
* | * | "{count} offers" |
*
*/
export const sourcing_line_offers: ((inputs: Sourcing_Line_OffersInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Line_OffersInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Lines" |
*
*/
export const sourcing_lines: ((inputs?: Sourcing_LinesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_LinesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "New · quoted, never ordered" |
*
*/
export const sourcing_new_supplier_tag: ((inputs?: Sourcing_New_Supplier_TagInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_New_Supplier_TagInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "next · {at}" |
*
*/
export const sourcing_next_at: ((inputs: Sourcing_Next_AtInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Next_AtInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No customer files" |
*
*/
export const sourcing_no_customer_files: ((inputs?: Sourcing_No_Customer_FilesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_No_Customer_FilesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "This case has no lines yet." |
*
*/
export const sourcing_no_lines: ((inputs?: Sourcing_No_LinesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_No_LinesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No supplier is being chased right now." |
*
*/
export const sourcing_no_one_chased: ((inputs?: Sourcing_No_One_ChasedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_No_One_ChasedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "not needed" |
*
*/
export const sourcing_not_needed: ((inputs?: Sourcing_Not_NeededInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Not_NeededInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Our reference only" |
*
*/
export const sourcing_our_reference: ((inputs?: Sourcing_Our_ReferenceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Our_ReferenceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Declined" |
*
*/
export const sourcing_outcome_declined: ((inputs?: Sourcing_Outcome_DeclinedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Outcome_DeclinedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Escalated" |
*
*/
export const sourcing_outcome_escalated: ((inputs?: Sourcing_Outcome_EscalatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Outcome_EscalatedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "New supplier saved" |
*
*/
export const sourcing_outcome_new_supplier: ((inputs?: Sourcing_Outcome_New_SupplierInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Outcome_New_SupplierInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reminder sent" |
*
*/
export const sourcing_outcome_reminder: ((inputs?: Sourcing_Outcome_ReminderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Outcome_ReminderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Replied" |
*
*/
export const sourcing_outcome_replied: ((inputs?: Sourcing_Outcome_RepliedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Outcome_RepliedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{currency} {price} / {per}" |
*
*/
export const sourcing_price: ((inputs: Sourcing_PriceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_PriceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "price hidden for your role" |
*
*/
export const sourcing_price_hidden: ((inputs?: Sourcing_Price_HiddenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Price_HiddenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{description}: {price} · quoted {quoted} · valid to {valid}" |
*
*/
export const sourcing_quoted_line: ((inputs: Sourcing_Quoted_LineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Quoted_LineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reminder 1 after 24 h, reminder 2 after 48 h, then the case owner ({owner}) is alerted. Reminders stop the moment a supplier replies or declines." |
*
*/
export const sourcing_reminder_rule: ((inputs: Sourcing_Reminder_RuleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Reminder_RuleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Remove" |
*
*/
export const sourcing_remove: ((inputs?: Sourcing_RemoveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_RemoveInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{reference} removed from the drafts" |
*
*/
export const sourcing_removed: ((inputs: Sourcing_RemovedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_RemovedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Saved the moment they replied, even without an order." |
*
*/
export const sourcing_saved_on_reply: ((inputs?: Sourcing_Saved_On_ReplyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Saved_On_ReplyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Send these supplier RFQs?" |
*
*/
export const sourcing_send_heading: ((inputs?: Sourcing_Send_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Send_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Send RFQs" |
*
*/
export const sourcing_send_label: ((inputs?: Sourcing_Send_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Send_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | nPlural | output |
* | --- | --- |
* | "one" | "Send {count} RFQ" |
* | * | "Send {count} RFQs" |
*
*/
export const sourcing_send_n: ((inputs: Sourcing_Send_NInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Send_NInputs, { locale?: "en" | "ar" }, {}>;
/**
* | nPlural | output |
* | --- | --- |
* | "one" | "{count} RFQ to {suppliers} — reply by {due}. The client's name, vessel and files are removed. Reminders go out after 24 h and 48 h, stop as soon as a supplie..." |
* | * | "{count} RFQs to {suppliers} — reply by {due}. The client's name, vessel and files are removed. Reminders go out after 24 h and 48 h, stop as soon as a suppli..." |
*
*/
export const sourcing_send_text: ((inputs: Sourcing_Send_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Send_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | nPlural | output |
* | --- | --- |
* | "one" | "{count} supplier RFQ sent — replies will be matched automatically" |
* | * | "{count} supplier RFQs sent — replies will be matched automatically" |
*
*/
export const sourcing_sent: ((inputs: Sourcing_SentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_SentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Skipped (already asked): {list}" |
*
*/
export const sourcing_skipped: ((inputs: Sourcing_SkippedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_SkippedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Split by category" |
*
*/
export const sourcing_split: ((inputs?: Sourcing_SplitInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_SplitInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Each category goes to its specialists (best on-time first); a supplier asked for several categories gets one RFQ." |
*
*/
export const sourcing_split_note: ((inputs?: Sourcing_Split_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Split_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Subject: “{subject}”" |
*
*/
export const sourcing_subject: ((inputs: Sourcing_SubjectInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_SubjectInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier record" |
*
*/
export const sourcing_supplier_record: ((inputs?: Sourcing_Supplier_RecordInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Supplier_RecordInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The system chooses the suppliers and drafts one anonymised RFQ each." |
*
*/
export const sourcing_system_chooses: ((inputs?: Sourcing_System_ChoosesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_System_ChoosesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Vessel removed" |
*
*/
export const sourcing_vessel_removed: ((inputs?: Sourcing_Vessel_RemovedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sourcing_Vessel_RemovedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Time to acknowledge" |
*
*/
export const visuals_ack: ((inputs?: Visuals_AckInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_AckInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "median, new RFQs · target 15 min" |
*
*/
export const visuals_ack_caption: ((inputs?: Visuals_Ack_CaptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_Ack_CaptionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Customer discount" |
*
*/
export const visuals_customer_discount: ((inputs?: Visuals_Customer_DiscountInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_Customer_DiscountInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{value} d" |
*
*/
export const visuals_days: ((inputs: Visuals_DaysInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_DaysInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Deadlines and arrivals" |
*
*/
export const visuals_deadlines: ((inputs?: Visuals_DeadlinesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_DeadlinesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Discount" |
*
*/
export const visuals_discount: ((inputs?: Visuals_DiscountInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_DiscountInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Gross profit, October: expected to actual" |
*
*/
export const visuals_gp_bridge: ((inputs?: Visuals_Gp_BridgeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_Gp_BridgeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Where the profit went between the quotes and the bills" |
*
*/
export const visuals_gp_bridge_note: ((inputs?: Visuals_Gp_Bridge_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_Gp_Bridge_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Gross profit" |
*
*/
export const visuals_gross_profit: ((inputs?: Visuals_Gross_ProfitInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_Gross_ProfitInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Margin" |
*
*/
export const visuals_margin: ((inputs?: Visuals_MarginInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_MarginInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Margin after discount" |
*
*/
export const visuals_margin_after: ((inputs?: Visuals_Margin_AfterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_Margin_AfterInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Margin before discount" |
*
*/
export const visuals_margin_before: ((inputs?: Visuals_Margin_BeforeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_Margin_BeforeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "policy: minimum {min}%, target {target}%" |
*
*/
export const visuals_margin_caption: ((inputs: Visuals_Margin_CaptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_Margin_CaptionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{value} min" |
*
*/
export const visuals_minutes: ((inputs: Visuals_MinutesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_MinutesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "policy maximum {max}%" |
*
*/
export const visuals_policy_max: ((inputs: Visuals_Policy_MaxInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_Policy_MaxInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "How the price is built" |
*
*/
export const visuals_price_built: ((inputs?: Visuals_Price_BuiltInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_Price_BuiltInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Profit" |
*
*/
export const visuals_profit: ((inputs?: Visuals_ProfitInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_ProfitInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Rate (EGP per {currency})" |
*
*/
export const visuals_rate: ((inputs: Visuals_RateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_RateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Receivables by customer" |
*
*/
export const visuals_receivables: ((inputs?: Visuals_ReceivablesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_ReceivablesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Selling price" |
*
*/
export const visuals_selling_price: ((inputs?: Visuals_Selling_PriceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_Selling_PriceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Selling price ({currency})" |
*
*/
export const visuals_selling_price_in: ((inputs: Visuals_Selling_Price_InInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_Selling_Price_InInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Shared charges" |
*
*/
export const visuals_shared_charges: ((inputs?: Visuals_Shared_ChargesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_Shared_ChargesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Supplier cost" |
*
*/
export const visuals_supplier_cost: ((inputs?: Visuals_Supplier_CostInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_Supplier_CostInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "target {target}%" |
*
*/
export const visuals_target: ((inputs: Visuals_TargetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_TargetInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Each bar against its target (the tick); the shading reads poor, fair, good" |
*
*/
export const visuals_targets_note: ((inputs?: Visuals_Targets_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_Targets_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "This month" |
*
*/
export const visuals_this_month: ((inputs?: Visuals_This_MonthInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_This_MonthInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quote turnaround" |
*
*/
export const visuals_turnaround: ((inputs?: Visuals_TurnaroundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_TurnaroundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "median, this week · target 1 d" |
*
*/
export const visuals_turnaround_caption: ((inputs?: Visuals_Turnaround_CaptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_Turnaround_CaptionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "under the {min}% minimum: needs approval" |
*
*/
export const visuals_under_minimum: ((inputs: Visuals_Under_MinimumInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_Under_MinimumInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "What if" |
*
*/
export const visuals_what_if: ((inputs?: Visuals_What_IfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_What_IfInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Try a margin, a discount and an exchange rate; nothing is saved" |
*
*/
export const visuals_what_if_note: ((inputs?: Visuals_What_If_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_What_If_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "of quoted cases won, 12 weeks · target {target}" |
*
*/
export const visuals_win_caption: ((inputs: Visuals_Win_CaptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_Win_CaptionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Win rate" |
*
*/
export const visuals_win_rate: ((inputs?: Visuals_Win_RateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visuals_Win_RateInputs, { locale?: "en" | "ar" }, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Action_Cash_ApproveInputs = {};
export type Action_Cash_Approve_Call_BackInputs = {};
export type Action_Cash_Approve_HeadingInputs = { title: NonNullable<unknown> };
export type Action_Cash_ApprovedInputs = { title: NonNullable<unknown> };
export type Action_Cash_Call_Back_TextInputs = { phone: NonNullable<unknown> };
export type Action_Cash_Called_BackInputs = {};
export type Action_Cash_DecidedInputs = { decision: NonNullable<unknown>, name: NonNullable<unknown> };
export type Action_Cash_Note_OptionalInputs = {};
export type Action_Cash_Reason_RequiredInputs = {};
export type Action_Cash_RejectInputs = {};
export type Action_Cash_Reject_HeadingInputs = { title: NonNullable<unknown> };
export type Action_Cash_RejectedInputs = { title: NonNullable<unknown> };
export type Action_Eta_AlertInputs = { owner: NonNullable<unknown> };
export type Action_Eta_ApplyInputs = {};
export type Action_Eta_Backorder_In_TimeInputs = { line: NonNullable<unknown>, supplier: NonNullable<unknown>, date: NonNullable<unknown> };
export type Action_Eta_Backorder_LateInputs = { line: NonNullable<unknown>, supplier: NonNullable<unknown>, date: NonNullable<unknown> };
export type Action_Eta_FromInputs = { from: NonNullable<unknown>, subject: NonNullable<unknown> };
export type Action_Eta_HeadingInputs = {};
export type Action_Eta_LabelInputs = {};
export type Action_Eta_MoveInputs = { drop: NonNullable<unknown>, from: NonNullable<unknown>, to: NonNullable<unknown>, owner: NonNullable<unknown> };
export type Action_Eta_No_DropInputs = {};
export type Action_Eta_ReadInputs = { eta: NonNullable<unknown>, was: NonNullable<unknown> };
export type Action_Eta_What_MovesInputs = {};
export type Action_History_OrganiseInputs = {};
export type Action_History_OrganisedInputs = {};
export type Action_Inbox_Ack_AutoInputs = {};
export type Action_Inbox_Ack_ManualInputs = {};
export type Action_Inbox_BackupInputs = {};
export type Action_Inbox_CreateInputs = {};
export type Action_Inbox_Create_HeadingInputs = {};
export type Action_Inbox_CreatesInputs = { kind: NonNullable<unknown>, customer: NonNullable<unknown>, isNew: NonNullable<unknown>, count: NonNullable<unknown> };
export type Action_Inbox_DeadlineInputs = {};
export type Action_Inbox_Deadline_HintInputs = {};
export type Action_Inbox_FlaggedInputs = {};
export type Action_Inbox_New_EmailInputs = { subject: NonNullable<unknown> };
export type Action_Inbox_New_ReplyInputs = { subject: NonNullable<unknown> };
export type Action_Inbox_Not_RelatedInputs = {};
export type Action_Inbox_OwnerInputs = {};
export type Action_Inbox_Simulate_EmailInputs = {};
export type Action_Inbox_Simulate_ForwardInputs = {};
export type Action_Inbox_Simulate_ReplyInputs = {};
export type Action_MoneyInputs = { currency: NonNullable<unknown>, amount: NonNullable<unknown> };
export type Action_Order_Read_PoInputs = {};
export type Action_Profit_Actual_LineInputs = { label: NonNullable<unknown>, detail: NonNullable<unknown>, expected: NonNullable<unknown>, actual: NonNullable<unknown> };
export type Action_Profit_Actuals_DoneInputs = {};
export type Action_Profit_Actuals_HeadingInputs = {};
export type Action_Profit_Actuals_IntroInputs = {};
export type Action_Profit_Bank_ReferenceInputs = {};
export type Action_Profit_Claim_DoneInputs = { creditNote: NonNullable<unknown>, ref: NonNullable<unknown> };
export type Action_Profit_Claim_HeadingInputs = { ref: NonNullable<unknown> };
export type Action_Profit_Claim_TextInputs = { title: NonNullable<unknown>, note: NonNullable<unknown>, creditNote: NonNullable<unknown>, against: NonNullable<unknown>, amount: NonNullable<unknown> };
export type Action_Profit_CloseInputs = {};
export type Action_Profit_Close_DoneInputs = { case: NonNullable<unknown> };
export type Action_Profit_Close_HeadingInputs = { case: NonNullable<unknown> };
export type Action_Profit_Close_OpenInputs = {};
export type Action_Profit_Close_ReadyInputs = {};
export type Action_Profit_Close_RoleInputs = {};
export type Action_Profit_Close_TextInputs = { actual: NonNullable<unknown>, actualMargin: NonNullable<unknown>, expected: NonNullable<unknown>, expectedMargin: NonNullable<unknown> };
export type Action_Profit_Confirm_ActualsInputs = {};
export type Action_Profit_Receipt_DescriptionInputs = { amount: NonNullable<unknown>, customer: NonNullable<unknown> };
export type Action_Profit_Receipt_Description_RateInputs = { amount: NonNullable<unknown>, customer: NonNullable<unknown>, rate: NonNullable<unknown>, currency: NonNullable<unknown> };
export type Action_Profit_Receipt_DoneInputs = { invoice: NonNullable<unknown> };
export type Action_Profit_Receipt_PromptInputs = { invoice: NonNullable<unknown> };
export type Action_Profit_Record_Credit_NoteInputs = {};
export type Action_Profit_Record_ReceiptInputs = {};
export type Action_Rfqs_SimulateInputs = {};
export type Action_Rfqs_SimulatedInputs = {};
export type Api_Assistant_And_MoreInputs = { list: NonNullable<unknown>, more: NonNullable<unknown> };
export type Api_Assistant_Approval_ItemInputs = { title: NonNullable<unknown>, type: NonNullable<unknown>, from: NonNullable<unknown>, approvers: NonNullable<unknown>, twoPerson: NonNullable<unknown> };
export type Api_Assistant_Approvals_For_YouInputs = { count: NonNullable<unknown>, list: NonNullable<unknown> };
export type Api_Assistant_Approvals_WaitingInputs = { count: NonNullable<unknown> };
export type Api_Assistant_Ask_A_QuestionInputs = {};
export type Api_Assistant_Bills_On_HoldInputs = { count: NonNullable<unknown>, list: NonNullable<unknown> };
export type Api_Assistant_Briefing_SubjectInputs = { count: NonNullable<unknown> };
export type Api_Assistant_Case_Approval_PendingInputs = { titles: NonNullable<unknown> };
export type Api_Assistant_Case_DeadlineInputs = { day: NonNullable<unknown>, time: NonNullable<unknown>, when: NonNullable<unknown>, hasEta: NonNullable<unknown>, eta: NonNullable<unknown> };
export type Api_Assistant_Case_GpInputs = { actual: NonNullable<unknown>, actualMargin: NonNullable<unknown>, expected: NonNullable<unknown>, expectedMargin: NonNullable<unknown> };
export type Api_Assistant_Case_InvoiceInputs = { number: NonNullable<unknown>, status: NonNullable<unknown>, amount: NonNullable<unknown> };
export type Api_Assistant_Case_LinesInputs = { ready: NonNullable<unknown>, total: NonNullable<unknown>, hasBlocked: NonNullable<unknown>, blocked: NonNullable<unknown> };
export type Api_Assistant_Case_MarginInputs = { caseId: NonNullable<unknown>, vessel: NonNullable<unknown>, actual: NonNullable<unknown>, actualMargin: NonNullable<unknown>, expected: NonNullable<unknown>, expectedMargin: NonNullable<unknown> };
export type Api_Assistant_Case_NextInputs = { next: NonNullable<unknown>, hasBlocker: NonNullable<unknown>, blocker: NonNullable<unknown> };
export type Api_Assistant_Case_Profit_And_CloseInputs = { caseId: NonNullable<unknown> };
export type Api_Assistant_Case_StageInputs = { stage: NonNullable<unknown>, hasWait: NonNullable<unknown>, wait: NonNullable<unknown>, owner: NonNullable<unknown> };
export type Api_Assistant_Case_Waiting_OnInputs = { suppliers: NonNullable<unknown>, statuses: NonNullable<unknown> };
export type Api_Assistant_Cases_Need_AttentionInputs = { count: NonNullable<unknown> };
export type Api_Assistant_CollectionsInputs = { totals: NonNullable<unknown>, count: NonNullable<unknown> };
export type Api_Assistant_Commitment_BlockedInputs = {};
export type Api_Assistant_Control_RoomInputs = {};
export type Api_Assistant_Customers_OweInputs = { totals: NonNullable<unknown>, count: NonNullable<unknown>, overdue: NonNullable<unknown> };
export type Api_Assistant_Deliveries_ShortInputs = { count: NonNullable<unknown>, list: NonNullable<unknown> };
export type Api_Assistant_Due_This_WeekInputs = { list: NonNullable<unknown> };
export type Api_Assistant_EtaInputs = { port: NonNullable<unknown>, day: NonNullable<unknown> };
export type Api_Assistant_ExceptionsInputs = { count: NonNullable<unknown>, list: NonNullable<unknown> };
export type Api_Assistant_Fx_MovedInputs = { from: NonNullable<unknown>, to: NonNullable<unknown>, change: NonNullable<unknown> };
export type Api_Assistant_Fx_On_ReceiptsInputs = { amount: NonNullable<unknown> };
export type Api_Assistant_Fx_RatesInputs = {};
export type Api_Assistant_Good_MorningInputs = { name: NonNullable<unknown> };
export type Api_Assistant_Good_Morning_ThereInputs = {};
export type Api_Assistant_Growth_BoardInputs = {};
export type Api_Assistant_HelpInputs = {};
export type Api_Assistant_Items_Awaiting_ApprovalInputs = { count: NonNullable<unknown>, types: NonNullable<unknown> };
export type Api_Assistant_Late_ItemInputs = { supplier: NonNullable<unknown>, po: NonNullable<unknown>, line: NonNullable<unknown>, received: NonNullable<unknown>, ordered: NonNullable<unknown>, extra: NonNullable<unknown>, claim: NonNullable<unknown>, promised: NonNullable<unknown> };
export type Api_Assistant_Least_ReliableInputs = { name: NonNullable<unknown>, onTime: NonNullable<unknown>, hours: NonNullable<unknown> };
export type Api_Assistant_LowestInputs = { list: NonNullable<unknown> };
export type Api_Assistant_Margin_By_StoreInputs = { list: NonNullable<unknown> };
export type Api_Assistant_Month_GpInputs = { month: NonNullable<unknown>, expected: NonNullable<unknown>, actual: NonNullable<unknown> };
export type Api_Assistant_More_Due_LaterInputs = { count: NonNullable<unknown> };
export type Api_Assistant_No_Case_At_RiskInputs = {};
export type Api_Assistant_No_Open_BalanceInputs = {};
export type Api_Assistant_Nothing_OverdueInputs = {};
export type Api_Assistant_Nothing_Waiting_ApprovalInputs = {};
export type Api_Assistant_November_GpInputs = { expected: NonNullable<unknown>, actual: NonNullable<unknown> };
export type Api_Assistant_Opportunity_ItemInputs = { name: NonNullable<unknown>, stage: NonNullable<unknown>, hasValue: NonNullable<unknown>, value: NonNullable<unknown>, next: NonNullable<unknown>, step: NonNullable<unknown>, due: NonNullable<unknown> };
export type Api_Assistant_OverdueInputs = { list: NonNullable<unknown> };
export type Api_Assistant_Owe_ItemInputs = { customer: NonNullable<unknown>, amount: NonNullable<unknown>, number: NonNullable<unknown>, due: NonNullable<unknown>, day: NonNullable<unknown>, hasPaid: NonNullable<unknown>, paid: NonNullable<unknown> };
export type Api_Assistant_PipelineInputs = { open: NonNullable<unknown>, inquiries: NonNullable<unknown>, won: NonNullable<unknown>, byCount: NonNullable<unknown>, byValue: NonNullable<unknown> };
export type Api_Assistant_Plan_Next_StepInputs = { names: NonNullable<unknown> };
export type Api_Assistant_PoInputs = { po: NonNullable<unknown> };
export type Api_Assistant_Po_MismatchInputs = { caseId: NonNullable<unknown>, vessel: NonNullable<unknown>, blocker: NonNullable<unknown> };
export type Api_Assistant_Profit_And_CloseInputs = {};
export type Api_Assistant_Quote_Due_ItemInputs = { vessel: NonNullable<unknown>, caseId: NonNullable<unknown>, when: NonNullable<unknown>, hasBlocker: NonNullable<unknown>, blocker: NonNullable<unknown> };
export type Api_Assistant_Quotes_DueInputs = { count: NonNullable<unknown>, list: NonNullable<unknown> };
export type Api_Assistant_Receipt_PoInputs = { po: NonNullable<unknown> };
export type Api_Assistant_RefusedInputs = {};
export type Api_Assistant_Refused_HintInputs = {};
export type Api_Assistant_Risky_ItemInputs = { caseId: NonNullable<unknown>, vessel: NonNullable<unknown>, stage: NonNullable<unknown>, deadline: NonNullable<unknown>, hasBlocker: NonNullable<unknown>, blocker: NonNullable<unknown> };
export type Api_Assistant_Settled_MarginInputs = { caseId: NonNullable<unknown>, actual: NonNullable<unknown>, expected: NonNullable<unknown> };
export type Api_Assistant_Short_ItemInputs = { po: NonNullable<unknown>, line: NonNullable<unknown>, received: NonNullable<unknown>, ordered: NonNullable<unknown>, hasPromise: NonNullable<unknown>, promised: NonNullable<unknown> };
export type Api_Assistant_Silent_ItemInputs = { supplier: NonNullable<unknown>, reference: NonNullable<unknown>, reminders: NonNullable<unknown> };
export type Api_Assistant_Suggest_ApprovalsInputs = {};
export type Api_Assistant_Suggest_Late_SuppliersInputs = {};
export type Api_Assistant_Suggest_MarginInputs = {};
export type Api_Assistant_Suggest_OwesInputs = {};
export type Api_Assistant_Suggest_PipelineInputs = {};
export type Api_Assistant_Suggest_StatusInputs = {};
export type Api_Assistant_Summarised_AgainInputs = { at: NonNullable<unknown>, count: NonNullable<unknown> };
export type Api_Assistant_Supplier_NamedInputs = { name: NonNullable<unknown>, hours: NonNullable<unknown>, hasOnTime: NonNullable<unknown>, onTime: NonNullable<unknown>, isNew: NonNullable<unknown> };
export type Api_Assistant_Suppliers_SilentInputs = { count: NonNullable<unknown>, list: NonNullable<unknown> };
export type Api_Assistant_Suppliers_SummaryInputs = { late: NonNullable<unknown>, waiting: NonNullable<unknown> };
export type Api_Assistant_Waiting_ItemInputs = { supplier: NonNullable<unknown>, reference: NonNullable<unknown>, status: NonNullable<unknown>, hasDue: NonNullable<unknown>, due: NonNullable<unknown>, reminders: NonNullable<unknown> };
export type Api_Assistant_We_OweInputs = { supplier: NonNullable<unknown>, amount: NonNullable<unknown>, bill: NonNullable<unknown>, status: NonNullable<unknown>, hasReason: NonNullable<unknown>, reason: NonNullable<unknown> };
export type Api_Cash_Account_OwnerInputs = {};
export type Api_Cash_Allocated_BalanceInputs = { amount: NonNullable<unknown>, number: NonNullable<unknown>, balance: NonNullable<unknown> };
export type Api_Cash_Allocated_PaidInputs = { amount: NonNullable<unknown>, number: NonNullable<unknown> };
export type Api_Cash_Approval_In_ProgressInputs = {};
export type Api_Cash_Approval_Not_FoundInputs = {};
export type Api_Cash_Approve_Payment_TitleInputs = { supplier: NonNullable<unknown> };
export type Api_Cash_Bank_Change_Not_FoundInputs = {};
export type Api_Cash_Call_Back_DoneInputs = { note: NonNullable<unknown> };
export type Api_Cash_Call_Back_FirstInputs = {};
export type Api_Cash_Cant_DecideInputs = {};
export type Api_Cash_Collect_GoalInputs = { amount: NonNullable<unknown>, number: NonNullable<unknown> };
export type Api_Cash_Enter_AmountInputs = {};
export type Api_Cash_Finance_Applies_BankInputs = {};
export type Api_Cash_Finance_Records_PaymentsInputs = {};
export type Api_Cash_Finance_Requests_ApprovalsInputs = {};
export type Api_Cash_Give_Bank_ReferenceInputs = {};
export type Api_Cash_Give_Reject_ReasonInputs = {};
export type Api_Cash_Invoice_Not_FoundInputs = {};
export type Api_Cash_List_SeparatorInputs = {};
export type Api_Cash_Match_ItemInputs = { number: NonNullable<unknown>, customer: NonNullable<unknown>, amount: NonNullable<unknown> };
export type Api_Cash_Match_MessageInputs = { count: NonNullable<unknown>, list: NonNullable<unknown> };
export type Api_Cash_No_Remittance_MatchInputs = {};
export type Api_Cash_Pay_DetailInputs = { number: NonNullable<unknown>, due: NonNullable<unknown> };
export type Api_Cash_Pay_Detail_MatchedInputs = { number: NonNullable<unknown>, bill: NonNullable<unknown>, due: NonNullable<unknown> };
export type Api_Cash_Pay_TitleInputs = { supplier: NonNullable<unknown>, amount: NonNullable<unknown>, number: NonNullable<unknown> };
export type Api_Cash_Payable_Not_FoundInputs = {};
export type Api_Cash_Payables_Hidden_From_SalesInputs = {};
export type Api_Cash_Payment_Not_ApprovedInputs = {};
export type Api_Cash_Reminder_Sent_NoteInputs = {};
export type Api_Cash_Two_Approvers_FirstInputs = {};
export type Api_Commercial_Accepted_ActivityInputs = { line: NonNullable<unknown>, hasNote: NonNullable<unknown>, note: NonNullable<unknown> };
export type Api_Commercial_Advance_PaymentInputs = { supplier: NonNullable<unknown> };
export type Api_Commercial_Agency_FlagInputs = {};
export type Api_Commercial_Agency_TermsInputs = {};
export type Api_Commercial_Already_AwaitingInputs = { number: NonNullable<unknown> };
export type Api_Commercial_Already_Cant_WithdrawInputs = { number: NonNullable<unknown>, status: NonNullable<unknown> };
export type Api_Commercial_Alternative_AcceptedInputs = {};
export type Api_Commercial_Alternative_PackInputs = {};
export type Api_Commercial_Alternatives_AllowedInputs = {};
export type Api_Commercial_Approval_Not_FoundInputs = {};
export type Api_Commercial_Approval_RecordedInputs = { progress: NonNullable<unknown> };
export type Api_Commercial_Approval_TitleInputs = { number: NonNullable<unknown>, customer: NonNullable<unknown>, total: NonNullable<unknown> };
export type Api_Commercial_Approval_Title_MarginInputs = { number: NonNullable<unknown>, customer: NonNullable<unknown>, hasMargin: NonNullable<unknown>, margin: NonNullable<unknown>, min: NonNullable<unknown> };
export type Api_Commercial_Approved_DotInputs = {};
export type Api_Commercial_Approved_TitleInputs = { title: NonNullable<unknown> };
export type Api_Commercial_Bank_Applied_Cant_WithdrawInputs = {};
export type Api_Commercial_Below_MinInputs = { min: NonNullable<unknown> };
export type Api_Commercial_Best_Fit_ReasonInputs = {};
export type Api_Commercial_Best_RegardsInputs = {};
export type Api_Commercial_Case_Not_FoundInputs = {};
export type Api_Commercial_Charge_EstimateInputs = { label: NonNullable<unknown>, amount: NonNullable<unknown> };
export type Api_Commercial_Check_PoInputs = {};
export type Api_Commercial_Check_Po_PartialInputs = {};
export type Api_Commercial_Choose_OfferInputs = {};
export type Api_Commercial_Closed_LostInputs = {};
export type Api_Commercial_Converted_FxInputs = { currency: NonNullable<unknown>, rate: NonNullable<unknown> };
export type Api_Commercial_Corrected_VersionInputs = { version: NonNullable<unknown>, replaces: NonNullable<unknown>, hasWas: NonNullable<unknown>, was: NonNullable<unknown> };
export type Api_Commercial_Correction_AskedInputs = { line: NonNullable<unknown>, part: NonNullable<unknown> };
export type Api_Commercial_Correction_PleaseInputs = {};
export type Api_Commercial_Correction_Sent_ActivityInputs = { supplier: NonNullable<unknown>, line: NonNullable<unknown>, name: NonNullable<unknown> };
export type Api_Commercial_Correction_Sent_StatusInputs = { version: NonNullable<unknown> };
export type Api_Commercial_Correction_SubjectInputs = { rfq: NonNullable<unknown>, line: NonNullable<unknown> };
export type Api_Commercial_Customer_DecisionInputs = {};
export type Api_Commercial_Days_ShortInputs = { n: NonNullable<unknown> };
export type Api_Commercial_DearInputs = { name: NonNullable<unknown> };
export type Api_Commercial_Dear_ColleaguesInputs = {};
export type Api_Commercial_Decided_ActivityInputs = { name: NonNullable<unknown>, approved: NonNullable<unknown>, title: NonNullable<unknown>, hasReason: NonNullable<unknown>, reason: NonNullable<unknown> };
export type Api_Commercial_Decision_ActivityInputs = { number: NonNullable<unknown>, decision: NonNullable<unknown>, hasNote: NonNullable<unknown>, note: NonNullable<unknown> };
export type Api_Commercial_Decision_Must_BeInputs = {};
export type Api_Commercial_Decision_On_ReceivedInputs = {};
export type Api_Commercial_Decision_WithdrawnInputs = { title: NonNullable<unknown> };
export type Api_Commercial_Delivered_As_QuotedInputs = {};
export type Api_Commercial_Delivery_Terms_DefaultInputs = { port: NonNullable<unknown> };
export type Api_Commercial_DeviationInputs = {};
export type Api_Commercial_Different_ItemInputs = {};
export type Api_Commercial_Discount_AboveInputs = { discount: NonNullable<unknown>, max: NonNullable<unknown> };
export type Api_Commercial_Draft_Not_SentInputs = {};
export type Api_Commercial_Due_DayInputs = { day: NonNullable<unknown> };
export type Api_Commercial_Emailed_ActivityInputs = { number: NonNullable<unknown>, to: NonNullable<unknown>, name: NonNullable<unknown> };
export type Api_Commercial_Exact_OnlyInputs = { part: NonNullable<unknown> };
export type Api_Commercial_Expired_ValidityInputs = { day: NonNullable<unknown> };
export type Api_Commercial_Field_CurrencyInputs = {};
export type Api_Commercial_Field_Line_CountInputs = {};
export type Api_Commercial_Field_Payment_TermsInputs = {};
export type Api_Commercial_Field_Quotation_NoInputs = {};
export type Api_Commercial_Field_TotalInputs = {};
export type Api_Commercial_Field_ValidityInputs = {};
export type Api_Commercial_Follow_Up_2_DaysInputs = { number: NonNullable<unknown> };
export type Api_Commercial_Freight_As_QuotedInputs = {};
export type Api_Commercial_Fx_Decision_StandsInputs = {};
export type Api_Commercial_Fx_LabelInputs = { usd: NonNullable<unknown>, eur: NonNullable<unknown> };
export type Api_Commercial_Give_Reason_Not_BestInputs = {};
export type Api_Commercial_Give_Return_ReasonInputs = {};
export type Api_Commercial_Gs_Truck_LaneInputs = { from: NonNullable<unknown>, port: NonNullable<unknown> };
export type Api_Commercial_Import_FreightInputs = {};
export type Api_Commercial_Items_FollowInputs = { lines: NonNullable<unknown> };
export type Api_Commercial_Karim_ApproveInputs = { number: NonNullable<unknown> };
export type Api_Commercial_Lead_DaysInputs = { n: NonNullable<unknown> };
export type Api_Commercial_Lead_Time_MissesInputs = { days: NonNullable<unknown>, eta: NonNullable<unknown> };
export type Api_Commercial_Lead_Time_Misses_EtaInputs = {};
export type Api_Commercial_Line_Not_FoundInputs = { line: NonNullable<unknown> };
export type Api_Commercial_Lines_ExcludedInputs = { lines: NonNullable<unknown> };
export type Api_Commercial_Local_TruckInputs = { port: NonNullable<unknown> };
export type Api_Commercial_Missing_Item_NoteInputs = {};
export type Api_Commercial_Negative_ProfitInputs = {};
export type Api_Commercial_New_SupplierInputs = { terms: NonNullable<unknown> };
export type Api_Commercial_No_Approval_RequestedInputs = {};
export type Api_Commercial_No_Decision_To_WithdrawInputs = {};
export type Api_Commercial_No_Delivery_HistoryInputs = {};
export type Api_Commercial_No_ExceptionsInputs = {};
export type Api_Commercial_No_Quotation_NamedInputs = {};
export type Api_Commercial_Not_A_SelectionInputs = { line: NonNullable<unknown> };
export type Api_Commercial_Not_GivenInputs = {};
export type Api_Commercial_Nothing_To_RequestInputs = { number: NonNullable<unknown>, status: NonNullable<unknown> };
export type Api_Commercial_Offer_BlockedInputs = { supplier: NonNullable<unknown>, version: NonNullable<unknown>, reason: NonNullable<unknown> };
export type Api_Commercial_Offer_Not_FoundInputs = {};
export type Api_Commercial_Offer_Not_On_LineInputs = { offer: NonNullable<unknown>, line: NonNullable<unknown> };
export type Api_Commercial_Offers_OnlyInputs = { supplier: NonNullable<unknown>, qty: NonNullable<unknown>, unit: NonNullable<unknown> };
export type Api_Commercial_On_ArrivalInputs = {};
export type Api_Commercial_On_HandInputs = { n: NonNullable<unknown>, place: NonNullable<unknown> };
export type Api_Commercial_On_TimeInputs = { pct: NonNullable<unknown> };
export type Api_Commercial_Only_Approved_SentInputs = {};
export type Api_Commercial_Only_Approved_To_CustomerInputs = {};
export type Api_Commercial_Our_RfqInputs = {};
export type Api_Commercial_Own_Stock_FlagInputs = { hasLot: NonNullable<unknown>, lot: NonNullable<unknown> };
export type Api_Commercial_Own_Stock_TermsInputs = {};
export type Api_Commercial_PackInputs = {};
export type Api_Commercial_Pack_SizeInputs = { offered: NonNullable<unknown>, requested: NonNullable<unknown> };
export type Api_Commercial_Payment_Recorded_Cant_WithdrawInputs = {};
export type Api_Commercial_Payment_Terms_DefaultInputs = {};
export type Api_Commercial_Pending_AcceptanceInputs = {};
export type Api_Commercial_Portal_ActivityInputs = { number: NonNullable<unknown>, name: NonNullable<unknown> };
export type Api_Commercial_Portal_Check_ActivityInputs = { number: NonNullable<unknown> };
export type Api_Commercial_Portal_Default_TermsInputs = {};
export type Api_Commercial_Price_ExpiredInputs = {};
export type Api_Commercial_Purchasing_DepartmentInputs = {};
export type Api_Commercial_Quantity_ShortfallInputs = { pct: NonNullable<unknown> };
export type Api_Commercial_Quotation_Not_FoundInputs = {};
export type Api_Commercial_Quote_Margin_BelowInputs = { margin: NonNullable<unknown>, min: NonNullable<unknown> };
export type Api_Commercial_Quoted_With_SelectionInputs = { number: NonNullable<unknown>, status: NonNullable<unknown> };
export type Api_Commercial_Rejected_TechnicalInputs = {};
export type Api_Commercial_Replies_InInputs = { hours: NonNullable<unknown> };
export type Api_Commercial_Requested_ActivityInputs = { name: NonNullable<unknown>, number: NonNullable<unknown>, type: NonNullable<unknown> };
export type Api_Commercial_Returned_TitleInputs = { title: NonNullable<unknown> };
export type Api_Commercial_Revise_LatestInputs = { number: NonNullable<unknown>, status: NonNullable<unknown> };
export type Api_Commercial_Revise_PricingInputs = { name: NonNullable<unknown>, reason: NonNullable<unknown> };
export type Api_Commercial_Revised_ActivityInputs = { next: NonNullable<unknown>, from: NonNullable<unknown> };
export type Api_Commercial_Revision_RemarkInputs = { reason: NonNullable<unknown> };
export type Api_Commercial_Sales_HiddenInputs = {};
export type Api_Commercial_Select_Alternative_FirstInputs = {};
export type Api_Commercial_Select_Offers_FirstInputs = {};
export type Api_Commercial_Selected_ActivityInputs = { line: NonNullable<unknown>, names: NonNullable<unknown>, hasReason: NonNullable<unknown>, reason: NonNullable<unknown> };
export type Api_Commercial_Selected_AgainInputs = { line: NonNullable<unknown> };
export type Api_Commercial_Selected_OfInputs = { total: NonNullable<unknown>, qty: NonNullable<unknown>, unit: NonNullable<unknown> };
export type Api_Commercial_Send_To_CustomerInputs = { number: NonNullable<unknown> };
export type Api_Commercial_Sent_Awaiting_CorrectedInputs = {};
export type Api_Commercial_Shelf_LifeInputs = { left: NonNullable<unknown>, need: NonNullable<unknown> };
export type Api_Commercial_Shelf_Life_BelowInputs = {};
export type Api_Commercial_Someone_Decided_AfterInputs = {};
export type Api_Commercial_Split_SourcingInputs = { parts: NonNullable<unknown> };
export type Api_Commercial_Superseded_ByInputs = { version: NonNullable<unknown> };
export type Api_Commercial_Supplied_AsInputs = { description: NonNullable<unknown>, pack: NonNullable<unknown>, accepted: NonNullable<unknown> };
export type Api_Commercial_Supplier_WordInputs = {};
export type Api_Commercial_Taken_BackInputs = { line: NonNullable<unknown> };
export type Api_Commercial_Taken_Back_ActivityInputs = { line: NonNullable<unknown>, name: NonNullable<unknown>, earlier: NonNullable<unknown> };
export type Api_Commercial_Terms_TbcInputs = {};
export type Api_Commercial_The_CustomerInputs = {};
export type Api_Commercial_Tight_EtaInputs = {};
export type Api_Commercial_Truck_LaneInputs = { from: NonNullable<unknown>, port: NonNullable<unknown> };
export type Api_Commercial_Unknown_ActionInputs = {};
export type Api_Commercial_Unknown_DecisionInputs = {};
export type Api_Commercial_Withdrew_ActivityInputs = { name: NonNullable<unknown>, approval: NonNullable<unknown>, title: NonNullable<unknown> };
export type Api_Commercial_Wrong_PartInputs = { brand: NonNullable<unknown>, partNo: NonNullable<unknown> };
export type Api_Commercial_Your_OfferInputs = { offered: NonNullable<unknown>, detail: NonNullable<unknown> };
export type Api_Control_Room_Ack_SubInputs = {};
export type Api_Control_Room_Ack_TitleInputs = {};
export type Api_Control_Room_ActualInputs = {};
export type Api_Control_Room_After_HoursInputs = {};
export type Api_Control_Room_After_Hours_SubInputs = {};
export type Api_Control_Room_After_Hours_TitleInputs = {};
export type Api_Control_Room_Ageing_SubInputs = {};
export type Api_Control_Room_Ageing_TitleInputs = {};
export type Api_Control_Room_Avg_Time_To_QuoteInputs = {};
export type Api_Control_Room_Blocked_Or_UrgentInputs = { count: NonNullable<unknown> };
export type Api_Control_Room_Cash_SubInputs = {};
export type Api_Control_Room_Cash_TitleInputs = {};
export type Api_Control_Room_ConversionInputs = {};
export type Api_Control_Room_Conversion_SubInputs = {};
export type Api_Control_Room_Conversion_TitleInputs = {};
export type Api_Control_Room_DaysInputs = { n: NonNullable<unknown> };
export type Api_Control_Room_Deliveries_SubInputs = {};
export type Api_Control_Room_Deliveries_TitleInputs = {};
export type Api_Control_Room_Delivery_SubInputs = {};
export type Api_Control_Room_Delivery_TitleInputs = {};
export type Api_Control_Room_Expected_At_QuotationInputs = {};
export type Api_Control_Room_Funnel_SubInputs = {};
export type Api_Control_Room_Funnel_TitleInputs = {};
export type Api_Control_Room_Gp_NoteInputs = { expected: NonNullable<unknown> };
export type Api_Control_Room_Gp_SubInputs = {};
export type Api_Control_Room_Gp_TitleInputs = {};
export type Api_Control_Room_Gross_Profit_MonthInputs = { month: NonNullable<unknown> };
export type Api_Control_Room_InquiriesInputs = {};
export type Api_Control_Room_Inquiries_Chart_SubInputs = {};
export type Api_Control_Room_Inquiries_Chart_TitleInputs = {};
export type Api_Control_Room_Last_12_WeeksInputs = {};
export type Api_Control_Room_Last_4_WeeksInputs = {};
export type Api_Control_Room_Last_6_MonthsInputs = {};
export type Api_Control_Room_Lost_SubInputs = {};
export type Api_Control_Room_Lost_TitleInputs = {};
export type Api_Control_Room_Margin_Source_SubInputs = {};
export type Api_Control_Room_Margin_Source_TitleInputs = {};
export type Api_Control_Room_Margin_Store_SubInputs = {};
export type Api_Control_Room_Margin_Store_TitleInputs = {};
export type Api_Control_Room_Median_DaysInputs = {};
export type Api_Control_Room_MinutesInputs = {};
export type Api_Control_Room_Money_SubInputs = {};
export type Api_Control_Room_Money_TitleInputs = {};
export type Api_Control_Room_Nothing_Over_30_DaysInputs = {};
export type Api_Control_Room_Open_InvoicesInputs = { count: NonNullable<unknown> };
export type Api_Control_Room_Open_RfqsInputs = {};
export type Api_Control_Room_Over_30_DaysInputs = { amount: NonNullable<unknown> };
export type Api_Control_Room_Overdue_OfInputs = { overdue: NonNullable<unknown>, total: NonNullable<unknown> };
export type Api_Control_Room_PaymentsInputs = {};
export type Api_Control_Room_Pipeline_SubInputs = {};
export type Api_Control_Room_Pipeline_TitleInputs = {};
export type Api_Control_Room_QuotedInputs = {};
export type Api_Control_Room_ReceiptsInputs = {};
export type Api_Control_Room_ReceivablesInputs = {};
export type Api_Control_Room_Receivables_Customer_SubInputs = {};
export type Api_Control_Room_Receivables_Customer_TitleInputs = {};
export type Api_Control_Room_Receivables_OpenInputs = {};
export type Api_Control_Room_Rfqs_Without_ReplyInputs = { count: NonNullable<unknown> };
export type Api_Control_Room_Sales_Source_SubInputs = {};
export type Api_Control_Room_Sales_Source_TitleInputs = {};
export type Api_Control_Room_Speed_SubInputs = {};
export type Api_Control_Room_Speed_TitleInputs = {};
export type Api_Control_Room_Target_1_DayInputs = {};
export type Api_Control_Room_Target_35Inputs = {};
export type Api_Control_Room_ThousandsInputs = { currency: NonNullable<unknown>, n: NonNullable<unknown> };
export type Api_Control_Room_Turnaround_NoteInputs = { was: NonNullable<unknown> };
export type Api_Control_Room_Turnaround_SubInputs = {};
export type Api_Control_Room_Turnaround_TitleInputs = {};
export type Api_Control_Room_Value_WonInputs = {};
export type Api_Control_Room_Value_Won_SubInputs = {};
export type Api_Control_Room_Value_Won_TitleInputs = {};
export type Api_Control_Room_Waiting_On_SuppliersInputs = {};
export type Api_Control_Room_Win_RateInputs = {};
export type Api_Control_Room_WonInputs = {};
export type Api_Control_Room_Won_Of_QuotedInputs = { won: NonNullable<unknown>, quoted: NonNullable<unknown>, period: NonNullable<unknown> };
export type Api_Growth_Crm_ActivityInputs = { name: NonNullable<unknown>, result: NonNullable<unknown>, hasNote: NonNullable<unknown>, note: NonNullable<unknown>, hasNext: NonNullable<unknown>, step: NonNullable<unknown>, due: NonNullable<unknown>, stage: NonNullable<unknown> };
export type Api_Growth_Crm_Choose_OutcomeInputs = {};
export type Api_Growth_Crm_Customer_RelationInputs = { status: NonNullable<unknown> };
export type Api_Growth_Crm_Next_Step_Date_InvalidInputs = {};
export type Api_Growth_Crm_Opportunity_Not_FoundInputs = {};
export type Api_Growth_Crm_Outcome_PlannedInputs = { step: NonNullable<unknown>, due: NonNullable<unknown> };
export type Api_Growth_Crm_Outcome_StageInputs = { name: NonNullable<unknown>, stage: NonNullable<unknown> };
export type Api_Growth_Crm_Plan_Next_StepInputs = {};
export type Api_Growth_Crm_Prospect_RelationInputs = { stage: NonNullable<unknown> };
export type Api_Growth_Crm_Task_TitleInputs = { step: NonNullable<unknown>, name: NonNullable<unknown> };
export type Api_Growth_Crm_Unknown_StageInputs = {};
export type Api_History_Age_1_30Inputs = {};
export type Api_History_Age_31_60Inputs = {};
export type Api_History_Age_60_PlusInputs = {};
export type Api_History_Agency_PricelistInputs = {};
export type Api_History_Awaiting_Corrected_OfferInputs = {};
export type Api_History_Awaiting_Customer_DecisionInputs = {};
export type Api_History_Awaiting_Delivery_Or_PaymentInputs = {};
export type Api_History_Awaiting_Internal_ApprovalInputs = {};
export type Api_History_Awaiting_SupplierInputs = {};
export type Api_History_Bought_To_OrderInputs = {};
export type Api_History_Cabin_StoresInputs = {};
export type Api_History_CancelledInputs = {};
export type Api_History_Deck_StoresInputs = {};
export type Api_History_Electrical_StoresInputs = {};
export type Api_History_Engine_StoresInputs = {};
export type Api_History_Inquiries_ReceivedInputs = {};
export type Api_History_LateInputs = {};
export type Api_History_Late_QuoteInputs = {};
export type Api_History_Lead_TimeInputs = {};
export type Api_History_No_SupplierInputs = {};
export type Api_History_Not_DueInputs = {};
export type Api_History_On_TimeInputs = {};
export type Api_History_Own_StockInputs = {};
export type Api_History_PartialInputs = {};
export type Api_History_PriceInputs = {};
export type Api_History_Provision_StoresInputs = {};
export type Api_History_QuotedInputs = {};
export type Api_History_Safety_StoresInputs = {};
export type Api_History_Sent_To_SuppliersInputs = {};
export type Api_History_Spare_Parts_ClearanceInputs = {};
export type Api_History_ValidatedInputs = {};
export type Api_History_Won_Full_Or_PartialInputs = {};
export type Api_Home_4_Weeks_AgoInputs = {};
export type Api_Home_Ack_SubInputs = {};
export type Api_Home_Ack_TitleInputs = {};
export type Api_Home_ActualInputs = {};
export type Api_Home_After_Hours_SubInputs = {};
export type Api_Home_After_Hours_TitleInputs = {};
export type Api_Home_All_CasesInputs = {};
export type Api_Home_All_Live_CasesInputs = {};
export type Api_Home_Amount_VsInputs = { amount: NonNullable<unknown>, than: NonNullable<unknown> };
export type Api_Home_Approvals_In_QueueInputs = { n: NonNullable<unknown> };
export type Api_Home_ArrivesInputs = { vessel: NonNullable<unknown> };
export type Api_Home_Arrives_WhenInputs = { vessel: NonNullable<unknown>, when: NonNullable<unknown> };
export type Api_Home_Awaiting_CustomerInputs = { n: NonNullable<unknown> };
export type Api_Home_Bill_DueInputs = { supplier: NonNullable<unknown> };
export type Api_Home_Billed_So_FarInputs = { n: NonNullable<unknown> };
export type Api_Home_Bills_To_MatchInputs = { n: NonNullable<unknown> };
export type Api_Home_Briefing_SubInputs = {};
export type Api_Home_Cases_In_QueueInputs = { n: NonNullable<unknown> };
export type Api_Home_Cash_SubInputs = {};
export type Api_Home_Cash_TitleInputs = {};
export type Api_Home_Commitment_BlockedInputs = {};
export type Api_Home_ContinueInputs = { caseId: NonNullable<unknown> };
export type Api_Home_Daily_BriefingInputs = {};
export type Api_Home_DaysInputs = { n: NonNullable<unknown> };
export type Api_Home_Decisions_WaitingInputs = { n: NonNullable<unknown> };
export type Api_Home_DeliveriesInputs = {};
export type Api_Home_Deliveries_In_ProgressInputs = { n: NonNullable<unknown> };
export type Api_Home_Deliveries_In_Progress_LabelInputs = {};
export type Api_Home_Drop_LeavesInputs = { number: NonNullable<unknown> };
export type Api_Home_ExpectedInputs = {};
export type Api_Home_Expected_Gp_NovInputs = {};
export type Api_Home_Follow_UpsInputs = {};
export type Api_Home_Follow_Ups_Due_TodayInputs = { n: NonNullable<unknown> };
export type Api_Home_Follow_Ups_TodayInputs = { n: NonNullable<unknown> };
export type Api_Home_Good_MorningInputs = { name: NonNullable<unknown> };
export type Api_Home_Gp_SubInputs = {};
export type Api_Home_Gp_TitleInputs = {};
export type Api_Home_In_OutInputs = { in: NonNullable<unknown>, out: NonNullable<unknown> };
export type Api_Home_InquiriesInputs = {};
export type Api_Home_Inquiries_4_WeeksInputs = {};
export type Api_Home_Integration_ExceptionsInputs = { n: NonNullable<unknown> };
export type Api_Home_Invoice_DueInputs = { customer: NonNullable<unknown>, amount: NonNullable<unknown>, day: NonNullable<unknown> };
export type Api_Home_Invoice_Due_ShortInputs = { customer: NonNullable<unknown> };
export type Api_Home_Invoice_SubInputs = { number: NonNullable<unknown>, status: NonNullable<unknown> };
export type Api_Home_Invoice_Sub_PaidInputs = { number: NonNullable<unknown>, status: NonNullable<unknown>, paid: NonNullable<unknown> };
export type Api_Home_InvoicesInputs = {};
export type Api_Home_Items_Awaiting_ApprovalInputs = { count: NonNullable<unknown> };
export type Api_Home_K_Past_DueInputs = { n: NonNullable<unknown> };
export type Api_Home_Last_WeekInputs = {};
export type Api_Home_Later_This_WeekInputs = { n: NonNullable<unknown> };
export type Api_Home_Live_CasesInputs = { n: NonNullable<unknown> };
export type Api_Home_Lost_CasesInputs = {};
export type Api_Home_Lost_SubInputs = {};
export type Api_Home_Lost_TitleInputs = {};
export type Api_Home_Median_DaysInputs = {};
export type Api_Home_Median_New_RfqsInputs = {};
export type Api_Home_Median_TargetInputs = {};
export type Api_Home_Messages_To_TriageInputs = { n: NonNullable<unknown> };
export type Api_Home_MinutesInputs = { n: NonNullable<unknown> };
export type Api_Home_Minutes_SeriesInputs = {};
export type Api_Home_My_DayInputs = { date: NonNullable<unknown> };
export type Api_Home_My_TurnaroundInputs = {};
export type Api_Home_My_Turnaround_SubInputs = {};
export type Api_Home_N_TodayInputs = { n: NonNullable<unknown> };
export type Api_Home_Net_CashInputs = {};
export type Api_Home_New_CaseInputs = {};
export type Api_Home_New_MessagesInputs = { count: NonNullable<unknown> };
export type Api_Home_Next_UpInputs = {};
export type Api_Home_No_ChangeInputs = {};
export type Api_Home_Nothing_Due_TodayInputs = {};
export type Api_Home_Nothing_Due_WeekInputs = {};
export type Api_Home_Nothing_Needs_YouInputs = {};
export type Api_Home_Open_ApprovalsInputs = {};
export type Api_Home_Out_Of_Hours_RfqsInputs = {};
export type Api_Home_PaymentsInputs = {};
export type Api_Home_PipelineInputs = {};
export type Api_Home_Pipeline_Steps_WeekInputs = { n: NonNullable<unknown> };
export type Api_Home_Pipeline_SubInputs = {};
export type Api_Home_Pipeline_TitleInputs = {};
export type Api_Home_Po_MismatchInputs = { caseId: NonNullable<unknown> };
export type Api_Home_Quote_DueInputs = { vessel: NonNullable<unknown> };
export type Api_Home_Quote_Due_WhenInputs = { vessel: NonNullable<unknown>, when: NonNullable<unknown> };
export type Api_Home_Quote_LateInputs = { vessel: NonNullable<unknown>, when: NonNullable<unknown> };
export type Api_Home_Quote_TurnaroundInputs = {};
export type Api_Home_QuotedInputs = {};
export type Api_Home_Quotes_Due_TomorrowInputs = { n: NonNullable<unknown> };
export type Api_Home_ReceiptsInputs = {};
export type Api_Home_ReceivablesInputs = {};
export type Api_Home_Receivables_By_AgeInputs = {};
export type Api_Home_Reminder_DraftedInputs = {};
export type Api_Home_Reply_DueInputs = { supplier: NonNullable<unknown> };
export type Api_Home_Review_InboxInputs = {};
export type Api_Home_RfqsInputs = {};
export type Api_Home_Rfqs_Awaiting_ReplyInputs = { n: NonNullable<unknown> };
export type Api_Home_Safe_RetryInputs = { impact: NonNullable<unknown> };
export type Api_Home_Same_AsInputs = { than: NonNullable<unknown> };
export type Api_Home_Supplier_BillsInputs = {};
export type Api_Home_Supplier_Bills_OpenInputs = { n: NonNullable<unknown> };
export type Api_Home_Supplier_Replies_OutstandingInputs = { n: NonNullable<unknown> };
export type Api_Home_Supplier_SilentInputs = { supplier: NonNullable<unknown> };
export type Api_Home_Target_1_DayInputs = {};
export type Api_Home_This_Week_Vs_LastInputs = {};
export type Api_Home_ThousandsInputs = { currency: NonNullable<unknown>, n: NonNullable<unknown> };
export type Api_Home_Time_To_AcknowledgeInputs = {};
export type Api_Home_TodayInputs = {};
export type Api_Home_Turnaround_SubInputs = {};
export type Api_Home_Turnaround_TitleInputs = {};
export type Api_Home_Usd_Past_DueInputs = { n: NonNullable<unknown> };
export type Api_Home_Usd_Thousands_AllInputs = {};
export type Api_Home_Value_WonInputs = {};
export type Api_Home_Value_Won_SubInputs = {};
export type Api_Home_Value_Won_TitleInputs = {};
export type Api_Home_Vs_Prior_4_WeeksInputs = {};
export type Api_Home_Was_DueInputs = { reference: NonNullable<unknown>, when: NonNullable<unknown>, last: NonNullable<unknown> };
export type Api_Home_WonInputs = {};
export type Api_Home_Won_4_WeeksInputs = {};
export type Api_Insights_Shared_Days_OverdueInputs = { days: NonNullable<unknown> };
export type Api_Insights_Shared_In_DaysInputs = { days: NonNullable<unknown> };
export type Api_Insights_Shared_Not_AllowedInputs = {};
export type Api_Insights_Shared_Overdue_SinceInputs = { time: NonNullable<unknown> };
export type Api_Insights_Shared_Today_AtInputs = { time: NonNullable<unknown> };
export type Api_Insights_Shared_Tomorrow_AtInputs = { time: NonNullable<unknown> };
export type Api_Operations_Already_AcceptedInputs = {};
export type Api_Operations_Amend_ActivityInputs = { number: NonNullable<unknown>, line: NonNullable<unknown>, field: NonNullable<unknown>, resolution: NonNullable<unknown> };
export type Api_Operations_As_QuotedInputs = {};
export type Api_Operations_Attach_ConfirmationInputs = {};
export type Api_Operations_Award_Undo_ActivityInputs = { line: NonNullable<unknown>, outcome: NonNullable<unknown>, hasWas: NonNullable<unknown>, was: NonNullable<unknown> };
export type Api_Operations_Back_To_UndecidedInputs = {};
export type Api_Operations_Case_Not_FoundInputs = {};
export type Api_Operations_Closing_Needs_ReasonInputs = {};
export type Api_Operations_Commitment_BlockedInputs = {};
export type Api_Operations_Commitment_Blocked_ByInputs = { n: NonNullable<unknown> };
export type Api_Operations_Confirm_And_PrepareInputs = {};
export type Api_Operations_Confirm_Sales_OrderInputs = {};
export type Api_Operations_Confirmed_By_PhoneInputs = {};
export type Api_Operations_Costs_Hidden_SalesInputs = {};
export type Api_Operations_Customer_Po_Not_FoundInputs = {};
export type Api_Operations_Decided_AgainInputs = { line: NonNullable<unknown> };
export type Api_Operations_Decision_StandsInputs = {};
export type Api_Operations_Delivered_ActivityInputs = { number: NonNullable<unknown>, signedBy: NonNullable<unknown> };
export type Api_Operations_Delivery_Not_FoundInputs = {};
export type Api_Operations_Describe_AgreementInputs = {};
export type Api_Operations_Einvoice_SubmittedInputs = { number: NonNullable<unknown> };
export type Api_Operations_Einvoice_Submitted_ActivityInputs = { number: NonNullable<unknown>, uuid: NonNullable<unknown> };
export type Api_Operations_Einvoice_ValidInputs = { number: NonNullable<unknown> };
export type Api_Operations_Einvoice_Valid_ActivityInputs = { number: NonNullable<unknown>, uuid: NonNullable<unknown> };
export type Api_Operations_Einvoices_By_FinanceInputs = {};
export type Api_Operations_Eta_Change_ActivityInputs = { from: NonNullable<unknown>, was: NonNullable<unknown>, now: NonNullable<unknown>, email: NonNullable<unknown>, moved: NonNullable<unknown> };
export type Api_Operations_Eta_Moved_BlockerInputs = { hours: NonNullable<unknown>, n: NonNullable<unknown> };
export type Api_Operations_Eta_NotificationInputs = { caseId: NonNullable<unknown>, at: NonNullable<unknown> };
export type Api_Operations_Eta_Notification_DetailInputs = { n: NonNullable<unknown> };
export type Api_Operations_Eta_Up_To_DateInputs = {};
export type Api_Operations_HeaderInputs = {};
export type Api_Operations_Invoice_Created_ActivityInputs = { number: NonNullable<unknown>, delivery: NonNullable<unknown>, lines: NonNullable<unknown> };
export type Api_Operations_Invoice_DeliveredInputs = { number: NonNullable<unknown> };
export type Api_Operations_Invoice_Not_FoundInputs = {};
export type Api_Operations_Invoices_By_FinanceInputs = {};
export type Api_Operations_Keep_Or_CloseInputs = {};
export type Api_Operations_Kept_Open_AgainInputs = { line: NonNullable<unknown> };
export type Api_Operations_Launch_BoatInputs = {};
export type Api_Operations_Launch_RebookedInputs = { launch: NonNullable<unknown>, at: NonNullable<unknown> };
export type Api_Operations_LineInputs = { n: NonNullable<unknown> };
export type Api_Operations_No_ChangesInputs = {};
export type Api_Operations_No_Customer_PoInputs = {};
export type Api_Operations_No_Customer_Po_YetInputs = {};
export type Api_Operations_No_Eta_UpdateInputs = {};
export type Api_Operations_No_MismatchInputs = {};
export type Api_Operations_No_Order_BookInputs = {};
export type Api_Operations_Not_Awarded_ActivityInputs = { line: NonNullable<unknown>, outcome: NonNullable<unknown>, hasReason: NonNullable<unknown>, reason: NonNullable<unknown> };
export type Api_Operations_Nothing_OpenInputs = {};
export type Api_Operations_Only_Confirmed_InvoicedInputs = {};
export type Api_Operations_Order_Confirmed_ActivityInputs = { number: NonNullable<unknown>, n: NonNullable<unknown> };
export type Api_Operations_Po_Not_FoundInputs = {};
export type Api_Operations_Po_Read_ActivityInputs = { number: NonNullable<unknown>, caseId: NonNullable<unknown>, open: NonNullable<unknown> };
export type Api_Operations_Recheck_ActivityInputs = { number: NonNullable<unknown>, changes: NonNullable<unknown> };
export type Api_Operations_Recheck_AvailabilityInputs = {};
export type Api_Operations_Recheck_PriceInputs = {};
export type Api_Operations_Recheck_Then_ApproveInputs = {};
export type Api_Operations_Reconfirm_TaskInputs = { number: NonNullable<unknown>, hours: NonNullable<unknown> };
export type Api_Operations_Rejected_Tax_IdInputs = {};
export type Api_Operations_Resolve_MismatchesInputs = { n: NonNullable<unknown> };
export type Api_Operations_Sign_In_FirstInputs = {};
export type Api_Operations_Submit_EinvoiceInputs = { number: NonNullable<unknown> };
export type Api_Operations_Tax_Id_ErrorInputs = { taxId: NonNullable<unknown> };
export type Api_Operations_UnchangedInputs = {};
export type Api_Operations_Undecided_AgainInputs = { line: NonNullable<unknown> };
export type Api_Operations_Who_SignedInputs = {};
export type Api_Order_To_Cash_Approval_Detail_CleanInputs = { number: NonNullable<unknown> };
export type Api_Order_To_Cash_Approval_Detail_FlaggedInputs = { number: NonNullable<unknown> };
export type Api_Order_To_Cash_Approval_TitleInputs = { number: NonNullable<unknown>, supplier: NonNullable<unknown> };
export type Api_Order_To_Cash_Duplicate_BillInputs = { reason: NonNullable<unknown> };
export type Api_Order_To_Cash_Eta_UpdatedInputs = { changed: NonNullable<unknown> };
export type Api_Order_To_Cash_Invoice_CreatedInputs = { number: NonNullable<unknown>, delivery: NonNullable<unknown> };
export type Api_Order_To_Cash_Invoice_Created_From_DeliveryInputs = { number: NonNullable<unknown> };
export type Api_Order_To_Cash_No_BillInputs = {};
export type Api_Order_To_Cash_Notification_TitleInputs = { number: NonNullable<unknown> };
export type Api_Order_To_Cash_Order_ConfirmedInputs = {};
export type Api_Order_To_Cash_Order_Confirmed_PosInputs = { pos: NonNullable<unknown> };
export type Api_Order_To_Cash_Po_CheckedInputs = { created: NonNullable<unknown>, open: NonNullable<unknown> };
export type Api_Order_To_Cash_Po_Not_FoundInputs = {};
export type Api_Platform_Acc_1Inputs = { caseId: NonNullable<unknown>, lines: NonNullable<unknown> };
export type Api_Platform_Acc_10_OpenInputs = {};
export type Api_Platform_Acc_10_SettledInputs = { caseId: NonNullable<unknown> };
export type Api_Platform_Acc_2Inputs = {};
export type Api_Platform_Acc_3Inputs = { qty: NonNullable<unknown>, pack: NonNullable<unknown>, total: NonNullable<unknown> };
export type Api_Platform_Acc_4Inputs = {};
export type Api_Platform_Acc_5Inputs = {};
export type Api_Platform_Acc_6Inputs = { count: NonNullable<unknown> };
export type Api_Platform_Acc_7Inputs = {};
export type Api_Platform_Acc_8Inputs = {};
export type Api_Platform_Acc_9Inputs = {};
export type Api_Platform_Already_DoneInputs = { status: NonNullable<unknown>, key: NonNullable<unknown> };
export type Api_Platform_Already_OwnsInputs = { name: NonNullable<unknown>, caseId: NonNullable<unknown> };
export type Api_Platform_Bank_Detail_ChangeInputs = {};
export type Api_Platform_Case_LineInputs = { caseId: NonNullable<unknown>, line: NonNullable<unknown>, description: NonNullable<unknown> };
export type Api_Platform_Case_Not_FoundInputs = {};
export type Api_Platform_Case_RecordInputs = {};
export type Api_Platform_Check_Bank_DetailInputs = { type: NonNullable<unknown>, on: NonNullable<unknown>, approvers: NonNullable<unknown> };
export type Api_Platform_Check_Bank_Two_PeopleInputs = {};
export type Api_Platform_Check_Sales_CostsInputs = {};
export type Api_Platform_Check_Sales_Costs_DetailInputs = { name: NonNullable<unknown>, hidden: NonNullable<unknown> };
export type Api_Platform_ClarificationsInputs = { count: NonNullable<unknown> };
export type Api_Platform_Connection_Not_FoundInputs = {};
export type Api_Platform_CustomerInputs = {};
export type Api_Platform_Deadline_PassedInputs = { when: NonNullable<unknown> };
export type Api_Platform_Deadline_Within_24hInputs = { when: NonNullable<unknown> };
export type Api_Platform_Delivery_NoteInputs = { number: NonNullable<unknown>, status: NonNullable<unknown> };
export type Api_Platform_Exception_Not_FoundInputs = {};
export type Api_Platform_Handed_OverInputs = { caseId: NonNullable<unknown>, name: NonNullable<unknown>, moved: NonNullable<unknown> };
export type Api_Platform_Handover_CaseInputs = { customer: NonNullable<unknown>, vessel: NonNullable<unknown>, hasPort: NonNullable<unknown>, port: NonNullable<unknown>, hasEta: NonNullable<unknown>, eta: NonNullable<unknown>, stage: NonNullable<unknown>, due: NonNullable<unknown> };
export type Api_Platform_Handover_Check_LineInputs = { line: NonNullable<unknown>, description: NonNullable<unknown>, pct: NonNullable<unknown> };
export type Api_Platform_Handover_Contact_RuleInputs = { rule: NonNullable<unknown> };
export type Api_Platform_Handover_FromInputs = { name: NonNullable<unknown>, moved: NonNullable<unknown> };
export type Api_Platform_Handover_LinesInputs = { ready: NonNullable<unknown>, waiting: NonNullable<unknown>, blocked: NonNullable<unknown>, noOffer: NonNullable<unknown>, total: NonNullable<unknown> };
export type Api_Platform_Handover_NextInputs = { next: NonNullable<unknown>, hasBlocker: NonNullable<unknown>, blocker: NonNullable<unknown> };
export type Api_Platform_Handover_QuestionInputs = { hasLine: NonNullable<unknown>, line: NonNullable<unknown>, to: NonNullable<unknown>, question: NonNullable<unknown> };
export type Api_Platform_Handover_SubjectInputs = { caseId: NonNullable<unknown>, to: NonNullable<unknown> };
export type Api_Platform_Handover_TaskInputs = { title: NonNullable<unknown>, hasDue: NonNullable<unknown>, due: NonNullable<unknown> };
export type Api_Platform_Handover_TitleInputs = { caseId: NonNullable<unknown>, to: NonNullable<unknown> };
export type Api_Platform_Invoice_Already_AcceptedInputs = { key: NonNullable<unknown> };
export type Api_Platform_Invoice_Submitted_OnceInputs = { key: NonNullable<unknown> };
export type Api_Platform_Language_SavedInputs = {};
export type Api_Platform_Low_ConfidenceInputs = {};
export type Api_Platform_Mailbox_RecheckedInputs = { key: NonNullable<unknown>, pending: NonNullable<unknown>, linked: NonNullable<unknown>, imported: NonNullable<unknown> };
export type Api_Platform_Management_PermissionsInputs = {};
export type Api_Platform_Management_RulesInputs = {};
export type Api_Platform_My_Language_ArInputs = {};
export type Api_Platform_My_Language_EnInputs = {};
export type Api_Platform_No_Shift_ReasonInputs = {};
export type Api_Platform_Not_Yet_ShownInputs = {};
export type Api_Platform_Note_RequiredInputs = {};
export type Api_Platform_Office_Hours_ReasonInputs = {};
export type Api_Platform_On_Call_DetailInputs = { minutes: NonNullable<unknown>, next: NonNullable<unknown> };
export type Api_Platform_On_Call_TitleInputs = { at: NonNullable<unknown> };
export type Api_Platform_On_Duty_ReasonInputs = { minutes: NonNullable<unknown> };
export type Api_Platform_Only_Owner_ReassignsInputs = {};
export type Api_Platform_Open_TasksInputs = { count: NonNullable<unknown> };
export type Api_Platform_PassInputs = {};
export type Api_Platform_Permissions_ActivityInputs = { role: NonNullable<unknown> };
export type Api_Platform_Pick_On_DutyInputs = {};
export type Api_Platform_Pick_SomeoneInputs = {};
export type Api_Platform_Receipt_NoteInputs = { line: NonNullable<unknown>, qc: NonNullable<unknown>, received: NonNullable<unknown>, ordered: NonNullable<unknown>, hasRest: NonNullable<unknown>, rest: NonNullable<unknown> };
export type Api_Platform_Reconnect_RolesInputs = {};
export type Api_Platform_ReconnectedInputs = { account: NonNullable<unknown> };
export type Api_Platform_Reconnected_ActivityInputs = { kind: NonNullable<unknown>, account: NonNullable<unknown> };
export type Api_Platform_Reconnected_NoteInputs = {};
export type Api_Platform_Reconnected_WithInputs = { account: NonNullable<unknown>, message: NonNullable<unknown> };
export type Api_Platform_Resolved_By_RetryInputs = { impact: NonNullable<unknown> };
export type Api_Platform_Retried_SafelyInputs = { message: NonNullable<unknown> };
export type Api_Platform_Reviewed_ActivityInputs = { summary: NonNullable<unknown>, hasNote: NonNullable<unknown>, note: NonNullable<unknown> };
export type Api_Platform_Role_Not_FoundInputs = {};
export type Api_Platform_Roster_ActivityInputs = {};
export type Api_Platform_Roster_EditorsInputs = {};
export type Api_Platform_Rule_EnabledInputs = { name: NonNullable<unknown> };
export type Api_Platform_Rule_Enabled_ActivityInputs = { name: NonNullable<unknown> };
export type Api_Platform_Rule_Not_FoundInputs = {};
export type Api_Platform_Rule_PausedInputs = { name: NonNullable<unknown> };
export type Api_Platform_Rule_Paused_ActivityInputs = { name: NonNullable<unknown> };
export type Api_Platform_Runs_At_SettlementInputs = {};
export type Api_Platform_SalesInputs = {};
export type Api_Platform_Senior_ContactsInputs = {};
export type Api_Platform_Settings_ManagementInputs = {};
export type Api_Platform_Shift_Not_FoundInputs = {};
export type Api_Platform_Sign_InInputs = {};
export type Api_Platform_Simulated_ActivityInputs = { at: NonNullable<unknown>, name: NonNullable<unknown>, hasBackup: NonNullable<unknown>, backup: NonNullable<unknown> };
export type Api_Platform_Staging_ActivityInputs = {};
export type Api_Platform_Staging_ManagementInputs = {};
export type Api_Platform_Step_RerunInputs = { key: NonNullable<unknown> };
export type Api_Platform_SystemInputs = {};
export type Api_Platform_System_MailboxInputs = {};
export type Api_Platform_The_RecordInputs = {};
export type Api_Platform_Timeline_EntriesInputs = { count: NonNullable<unknown> };
export type Api_Platform_Uncertain_MatchInputs = { classification: NonNullable<unknown> };
export type Api_Platform_UnclassifiedInputs = {};
export type Api_Platform_Unknown_PermissionInputs = {};
export type Api_Platform_Unknown_SettingInputs = {};
export type Api_Platform_Valid_TimeInputs = {};
export type Api_Platform_You_Now_OwnInputs = { caseId: NonNullable<unknown> };
export type Api_Profit_Actuals_ConfirmedInputs = { list: NonNullable<unknown> };
export type Api_Profit_All_Charges_ConfirmedInputs = {};
export type Api_Profit_All_PaidInputs = { count: NonNullable<unknown> };
export type Api_Profit_BillInputs = { number: NonNullable<unknown>, status: NonNullable<unknown> };
export type Api_Profit_Bill_HeldInputs = { number: NonNullable<unknown>, status: NonNullable<unknown>, reason: NonNullable<unknown> };
export type Api_Profit_Bill_NumberInputs = { number: NonNullable<unknown> };
export type Api_Profit_Billed_Vs_EstimateInputs = { label: NonNullable<unknown>, billed: NonNullable<unknown>, estimate: NonNullable<unknown> };
export type Api_Profit_Cant_CloseInputs = { checks: NonNullable<unknown> };
export type Api_Profit_Case_Closed_ActivityInputs = { actual: NonNullable<unknown>, margin: NonNullable<unknown>, expected: NonNullable<unknown> };
export type Api_Profit_Case_Not_FoundInputs = {};
export type Api_Profit_Check_ActualsInputs = {};
export type Api_Profit_Check_BillsInputs = {};
export type Api_Profit_Check_ClaimsInputs = {};
export type Api_Profit_Check_DeliveriesInputs = {};
export type Api_Profit_Check_EinvoiceInputs = {};
export type Api_Profit_Check_PaidInputs = {};
export type Api_Profit_Claim_LineInputs = { ref: NonNullable<unknown>, title: NonNullable<unknown> };
export type Api_Profit_Claim_Not_FoundInputs = {};
export type Api_Profit_Claim_OffsetInputs = { creditNote: NonNullable<unknown> };
export type Api_Profit_Claim_OpenInputs = { against: NonNullable<unknown> };
export type Api_Profit_Claim_Open_WithInputs = { ref: NonNullable<unknown>, title: NonNullable<unknown>, against: NonNullable<unknown> };
export type Api_Profit_Claim_Settled_ActivityInputs = { ref: NonNullable<unknown>, creditNote: NonNullable<unknown>, amount: NonNullable<unknown> };
export type Api_Profit_Claim_Settled_ByInputs = { ref: NonNullable<unknown>, title: NonNullable<unknown>, creditNote: NonNullable<unknown> };
export type Api_Profit_Confirm_ActualsInputs = {};
export type Api_Profit_Confirmed_On_PricingInputs = {};
export type Api_Profit_EstimateInputs = {};
export type Api_Profit_Finance_OnlyInputs = {};
export type Api_Profit_Hidden_From_SalesInputs = {};
export type Api_Profit_No_Bill_YetInputs = {};
export type Api_Profit_No_ClaimsInputs = {};
export type Api_Profit_No_DeliveryInputs = {};
export type Api_Profit_No_InvoiceInputs = {};
export type Api_Profit_No_Po_Or_BillInputs = {};
export type Api_Profit_No_Single_BalanceInputs = {};
export type Api_Profit_None_Case_ClosedInputs = {};
export type Api_Profit_Not_ApplicableInputs = {};
export type Api_Profit_Not_Invoiced_TodayInputs = {};
export type Api_Profit_OpenInputs = { number: NonNullable<unknown>, amount: NonNullable<unknown> };
export type Api_Profit_Open_Balance_TodayInputs = {};
export type Api_Profit_Open_DueInputs = { number: NonNullable<unknown>, amount: NonNullable<unknown>, due: NonNullable<unknown> };
export type Api_Profit_PoInputs = { number: NonNullable<unknown> };
export type Api_Profit_Po_LineInputs = { supplier: NonNullable<unknown>, number: NonNullable<unknown> };
export type Api_Profit_ReceiptInputs = { reference: NonNullable<unknown> };
export type Api_Profit_Receipt_OnInputs = { reference: NonNullable<unknown>, day: NonNullable<unknown> };
export type Api_Profit_Record_Credit_NoteInputs = {};
export type Api_Profit_Record_ReceiptInputs = {};
export type Api_Profit_Signed_ByInputs = { who: NonNullable<unknown> };
export type Api_Profit_Signed_By_VesselInputs = {};
export type Api_Profit_Still_EstimateInputs = { label: NonNullable<unknown>, estimate: NonNullable<unknown> };
export type Api_Quotations_Decision_RecordedInputs = { decision: NonNullable<unknown> };
export type Api_Quotations_Entered_In_PortalInputs = { number: NonNullable<unknown> };
export type Api_Quotations_Give_Lost_ReasonInputs = {};
export type Api_Quotations_New_VersionInputs = {};
export type Api_Quotations_Sent_ToInputs = { number: NonNullable<unknown>, to: NonNullable<unknown> };
export type Api_Service_Sign_InInputs = {};
export type Api_Sourcing_A_PersonInputs = {};
export type Api_Sourcing_Ack_Already_ActivityInputs = {};
export type Api_Sourcing_Ack_By_Hand_ActivityInputs = {};
export type Api_Sourcing_Ack_Default_BodyInputs = {};
export type Api_Sourcing_Ack_Default_SubjectInputs = {};
export type Api_Sourcing_Ack_FooterInputs = { owner: NonNullable<unknown>, backup: NonNullable<unknown> };
export type Api_Sourcing_Ack_Sent_ActivityInputs = { template: NonNullable<unknown> };
export type Api_Sourcing_Already_AskedInputs = { line: NonNullable<unknown>, name: NonNullable<unknown> };
export type Api_Sourcing_Already_Linked_No_NewInputs = { caseId: NonNullable<unknown> };
export type Api_Sourcing_Already_WaitingInputs = {};
export type Api_Sourcing_Auto_Created_SourceInputs = { reference: NonNullable<unknown>, date: NonNullable<unknown> };
export type Api_Sourcing_Back_In_QueueInputs = {};
export type Api_Sourcing_Back_To_DecisionInputs = {};
export type Api_Sourcing_Below_ThresholdInputs = {};
export type Api_Sourcing_BlockerInputs = { lines: NonNullable<unknown>, flag: NonNullable<unknown> };
export type Api_Sourcing_Cannot_SupplyInputs = {};
export type Api_Sourcing_Case_Already_CreatedInputs = { caseId: NonNullable<unknown> };
export type Api_Sourcing_Case_CreatedInputs = { caseId: NonNullable<unknown>, ack: NonNullable<unknown> };
export type Api_Sourcing_Case_Not_FoundInputs = {};
export type Api_Sourcing_Case_Number_On_CreationInputs = {};
export type Api_Sourcing_Cash_TermsInputs = {};
export type Api_Sourcing_Created_ActivityInputs = { channel: NonNullable<unknown>, subject: NonNullable<unknown>, count: NonNullable<unknown>, who: NonNullable<unknown> };
export type Api_Sourcing_Customer_Ref_IsInputs = { ref: NonNullable<unknown>, caseId: NonNullable<unknown> };
export type Api_Sourcing_Declined_EventInputs = {};
export type Api_Sourcing_Draft_GoneInputs = {};
export type Api_Sourcing_Drafts_BackInputs = { count: NonNullable<unknown> };
export type Api_Sourcing_Drafts_ChangedInputs = {};
export type Api_Sourcing_Drafts_ReadyInputs = { count: NonNullable<unknown> };
export type Api_Sourcing_Duplicate_KeptInputs = {};
export type Api_Sourcing_Duplicate_LinkedInputs = { caseId: NonNullable<unknown> };
export type Api_Sourcing_Escalated_ToInputs = { name: NonNullable<unknown> };
export type Api_Sourcing_For_VesselInputs = { vessel: NonNullable<unknown> };
export type Api_Sourcing_Forwarded_By_StaffInputs = {};
export type Api_Sourcing_General_FullInputs = {};
export type Api_Sourcing_Held_BackInputs = { lines: NonNullable<unknown> };
export type Api_Sourcing_History_Approved_ActivityInputs = { name: NonNullable<unknown>, customers: NonNullable<unknown>, vessels: NonNullable<unknown>, suppliers: NonNullable<unknown>, prices: NonNullable<unknown>, saved: NonNullable<unknown> };
export type Api_Sourcing_History_ReadyInputs = {};
export type Api_Sourcing_History_Ready_DetailInputs = { customers: NonNullable<unknown>, vessels: NonNullable<unknown>, suppliers: NonNullable<unknown>, prices: NonNullable<unknown>, uncertain: NonNullable<unknown> };
export type Api_Sourcing_Identical_AttachmentsInputs = { hash: NonNullable<unknown>, subject: NonNullable<unknown>, at: NonNullable<unknown> };
export type Api_Sourcing_Import_ApprovedInputs = {};
export type Api_Sourcing_Invited_On_ManyInputs = { count: NonNullable<unknown> };
export type Api_Sourcing_Lines_OfferedInputs = { count: NonNullable<unknown>, changed: NonNullable<unknown> };
export type Api_Sourcing_Linked_ActivityInputs = { subject: NonNullable<unknown>, from: NonNullable<unknown>, who: NonNullable<unknown>, offer: NonNullable<unknown> };
export type Api_Sourcing_Linked_After_Review_EventInputs = {};
export type Api_Sourcing_Management_ApprovesInputs = {};
export type Api_Sourcing_Matched_ToInputs = { caseId: NonNullable<unknown>, reference: NonNullable<unknown>, pct: NonNullable<unknown> };
export type Api_Sourcing_Message_Not_FoundInputs = {};
export type Api_Sourcing_ModelInputs = {};
export type Api_Sourcing_Needs_ClarificationInputs = {};
export type Api_Sourcing_New_Case_AssignedInputs = { caseId: NonNullable<unknown> };
export type Api_Sourcing_New_Case_DetailInputs = { customer: NonNullable<unknown>, vessel: NonNullable<unknown>, due: NonNullable<unknown> };
export type Api_Sourcing_New_Supplier_ActivityInputs = { name: NonNullable<unknown>, reference: NonNullable<unknown> };
export type Api_Sourcing_New_Supplier_ConfirmInputs = { line: NonNullable<unknown> };
export type Api_Sourcing_New_Supplier_CreatedInputs = { domain: NonNullable<unknown> };
export type Api_Sourcing_New_Supplier_DetailInputs = {};
export type Api_Sourcing_New_Supplier_SavedInputs = { domain: NonNullable<unknown> };
export type Api_Sourcing_No_New_CaseInputs = {};
export type Api_Sourcing_No_ReferenceInputs = {};
export type Api_Sourcing_No_RuleInputs = {};
export type Api_Sourcing_No_SpecialistInputs = {};
export type Api_Sourcing_None_WaitingInputs = {};
export type Api_Sourcing_Not_Filed_By_ReviewInputs = {};
export type Api_Sourcing_Not_History_ItemInputs = {};
export type Api_Sourcing_Not_Invited_EventInputs = { reference: NonNullable<unknown> };
export type Api_Sourcing_Nothing_ExtractedInputs = {};
export type Api_Sourcing_Nothing_NewInputs = {};
export type Api_Sourcing_Nothing_To_SendInputs = {};
export type Api_Sourcing_Offer_Received_EventInputs = { changed: NonNullable<unknown>, subject: NonNullable<unknown> };
export type Api_Sourcing_Offers_CapturedInputs = { count: NonNullable<unknown>, reference: NonNullable<unknown> };
export type Api_Sourcing_Only_DeciderInputs = { name: NonNullable<unknown> };
export type Api_Sourcing_Only_FilerInputs = { name: NonNullable<unknown> };
export type Api_Sourcing_Organise_FirstInputs = {};
export type Api_Sourcing_Original_Not_CaseInputs = {};
export type Api_Sourcing_Original_TextInputs = { text: NonNullable<unknown>, source: NonNullable<unknown> };
export type Api_Sourcing_Pending_ItemsInputs = { count: NonNullable<unknown> };
export type Api_Sourcing_Per_Kg_UncertainInputs = { price: NonNullable<unknown>, converted: NonNullable<unknown>, pack: NonNullable<unknown> };
export type Api_Sourcing_Pick_CaseInputs = {};
export type Api_Sourcing_Pick_LineInputs = {};
export type Api_Sourcing_Price_Unit_UnclearInputs = {};
export type Api_Sourcing_Ref_In_BodyInputs = { ref: NonNullable<unknown> };
export type Api_Sourcing_Ref_In_SubjectInputs = { ref: NonNullable<unknown> };
export type Api_Sourcing_Reminder_Escalated_EventInputs = { n: NonNullable<unknown>, after: NonNullable<unknown> };
export type Api_Sourcing_Reminder_N_SentInputs = { n: NonNullable<unknown> };
export type Api_Sourcing_Reminder_Sent_EventInputs = { n: NonNullable<unknown> };
export type Api_Sourcing_Reminders_StopInputs = {};
export type Api_Sourcing_Reopened_ActivityInputs = { subject: NonNullable<unknown>, from: NonNullable<unknown>, who: NonNullable<unknown> };
export type Api_Sourcing_Reply_CountedInputs = {};
export type Api_Sourcing_Reply_Matched_EventInputs = { subject: NonNullable<unknown> };
export type Api_Sourcing_Rfq_AlternativesInputs = {};
export type Api_Sourcing_Rfq_Best_RegardsInputs = {};
export type Api_Sourcing_Rfq_Date_BelowInputs = {};
export type Api_Sourcing_Rfq_DearInputs = {};
export type Api_Sourcing_Rfq_ExactInputs = {};
export type Api_Sourcing_Rfq_Keep_ReferenceInputs = { reference: NonNullable<unknown> };
export type Api_Sourcing_Rfq_Not_FoundInputs = {};
export type Api_Sourcing_Rfq_PartInputs = { part: NonNullable<unknown> };
export type Api_Sourcing_Rfq_Please_QuoteInputs = { port: NonNullable<unknown>, date: NonNullable<unknown> };
export type Api_Sourcing_Rfq_Please_StateInputs = {};
export type Api_Sourcing_Rfq_SubjectInputs = { reference: NonNullable<unknown>, due: NonNullable<unknown> };
export type Api_Sourcing_Rfq_To_PortInputs = {};
export type Api_Sourcing_Sender_DomainInputs = { domain: NonNullable<unknown>, name: NonNullable<unknown> };
export type Api_Sourcing_Sender_UnknownInputs = { sender: NonNullable<unknown> };
export type Api_Sourcing_Sent_ActivityInputs = { count: NonNullable<unknown>, who: NonNullable<unknown>, mode: NonNullable<unknown>, references: NonNullable<unknown> };
export type Api_Sourcing_Sent_By_OtherInputs = { name: NonNullable<unknown> };
export type Api_Sourcing_Sent_EventInputs = {};
export type Api_Sourcing_Silent_ActivityInputs = { reference: NonNullable<unknown>, name: NonNullable<unknown>, after: NonNullable<unknown> };
export type Api_Sourcing_Silent_DetailInputs = { after: NonNullable<unknown>, caseId: NonNullable<unknown>, due: NonNullable<unknown> };
export type Api_Sourcing_Silent_TitleInputs = { name: NonNullable<unknown>, reference: NonNullable<unknown> };
export type Api_Sourcing_Sir_MadamInputs = {};
export type Api_Sourcing_SpecialistInputs = { category: NonNullable<unknown> };
export type Api_Sourcing_Step_DraftInputs = {};
export type Api_Sourcing_Step_EscalateInputs = {};
export type Api_Sourcing_Step_ReminderInputs = { n: NonNullable<unknown> };
export type Api_Sourcing_Step_SentInputs = {};
export type Api_Sourcing_Step_StoppedInputs = { status: NonNullable<unknown> };
export type Api_Sourcing_Step_UninvitedInputs = { status: NonNullable<unknown> };
export type Api_Sourcing_Subject_ChangedInputs = { subject: NonNullable<unknown> };
export type Api_Sourcing_Subject_KeptInputs = {};
export type Api_Sourcing_SupplierInputs = {};
export type Api_Sourcing_Supplier_History_SourceInputs = { quoted: NonNullable<unknown> };
export type Api_Sourcing_Template_LabelInputs = { name: NonNullable<unknown>, version: NonNullable<unknown> };
export type Api_Sourcing_Uncertain_ReviewInputs = {};
export type Api_Sourcing_UnclassifiableInputs = {};
export type Api_Sourcing_Vessel_History_NoteInputs = { calls: NonNullable<unknown>, ports: NonNullable<unknown> };
export type Api_Sourcing_Was_Asked_OnInputs = { name: NonNullable<unknown>, reference: NonNullable<unknown>, status: NonNullable<unknown> };
export type Api_Sourcing_Your_VesselInputs = {};
export type Api_Visuals_ArrivesInputs = { name: NonNullable<unknown> };
export type Api_Visuals_Calendar_ArrivesInputs = { name: NonNullable<unknown> };
export type Api_Visuals_Calendar_DeliveryInputs = { number: NonNullable<unknown>, status: NonNullable<unknown> };
export type Api_Visuals_Calendar_Invoice_DueInputs = { number: NonNullable<unknown>, customer: NonNullable<unknown> };
export type Api_Visuals_Calendar_Quote_DueInputs = { name: NonNullable<unknown> };
export type Api_Visuals_DaysInputs = { n: NonNullable<unknown> };
export type Api_Visuals_Gp_ActualInputs = {};
export type Api_Visuals_Gp_At_QuoteInputs = {};
export type Api_Visuals_Gp_FreightInputs = {};
export type Api_Visuals_Gp_FxInputs = {};
export type Api_Visuals_Gp_RecoveredInputs = {};
export type Api_Visuals_Gp_Supplier_PricesInputs = {};
export type Api_Visuals_MinutesInputs = { n: NonNullable<unknown> };
export type Api_Visuals_Quote_DueInputs = { name: NonNullable<unknown> };
export type Api_Visuals_Target_AcknowledgeInputs = {};
export type Api_Visuals_Target_On_TimeInputs = {};
export type Api_Visuals_Target_TurnaroundInputs = {};
export type Api_Visuals_Target_Win_RateInputs = {};
export type Automations_Ai_NoteInputs = {};
export type Automations_Auto_AssignInputs = {};
export type Automations_Auto_CalculateInputs = {};
export type Automations_Auto_CaptureInputs = {};
export type Automations_Auto_PrepareInputs = {};
export type Automations_Auto_RemindInputs = {};
export type Automations_Confirm_HeadingInputs = {};
export type Automations_Confirm_LabelInputs = {};
export type Automations_Confirm_TextInputs = { title: NonNullable<unknown> };
export type Automations_Enabled_NoteInputs = {};
export type Automations_Figure_AiInputs = {};
export type Automations_Figure_EnabledInputs = {};
export type Automations_Mark_ReviewedInputs = {};
export type Automations_Of_RulesInputs = { count: NonNullable<unknown>, total: NonNullable<unknown> };
export type Automations_OpenInputs = {};
export type Automations_People_CommitmentsInputs = {};
export type Automations_People_MessagesInputs = {};
export type Automations_People_OverridesInputs = {};
export type Automations_People_PricesInputs = {};
export type Automations_People_UncertainInputs = {};
export type Automations_Review_EmptyInputs = {};
export type Automations_Review_NoteInputs = {};
export type Automations_Reviewed_DoneInputs = {};
export type Case_Overview_DeliveredInputs = {};
export type Case_Overview_EndedInputs = { next: NonNullable<unknown> };
export type Case_Overview_Gauge_A11yInputs = { label: NonNullable<unknown>, value: NonNullable<unknown>, total: NonNullable<unknown> };
export type Case_Overview_InvoicedInputs = {};
export type Case_Overview_OrderedInputs = {};
export type Case_Overview_PausedInputs = { next: NonNullable<unknown> };
export type Case_Overview_PhaseInputs = { phase: NonNullable<unknown> };
export type Case_Overview_ReceivedInputs = {};
export type Case_Overview_StepInputs = { step: NonNullable<unknown>, total: NonNullable<unknown> };
export type Case_Overview_Summary_ContextInputs = {};
export type Case_Overview_Summary_LabelInputs = {};
export type Cash_Amount_PaidInputs = {};
export type Cash_AppliedInputs = {};
export type Cash_Applied_AlertInputs = { supplier: NonNullable<unknown> };
export type Cash_Apply_Bank_DetailsInputs = {};
export type Cash_Apply_DetailsInputs = {};
export type Cash_Apply_DoneInputs = { supplier: NonNullable<unknown> };
export type Cash_Apply_HeadingInputs = { supplier: NonNullable<unknown> };
export type Cash_Apply_TextInputs = {};
export type Cash_Bank_ReferenceInputs = {};
export type Cash_Bridge_LabelInputs = {};
export type Cash_Bridge_NoteInputs = {};
export type Cash_Call_Back_OnInputs = {};
export type Cash_CurrencyInputs = {};
export type Cash_Current_AccountInputs = {};
export type Cash_Fixed_CostsInputs = {};
export type Cash_Forecast_LabelInputs = {};
export type Cash_Forecast_SubheadInputs = {};
export type Cash_Forecast_Subhead_FixedInputs = { fixed: NonNullable<unknown> };
export type Cash_Held_AlertInputs = { supplier: NonNullable<unknown> };
export type Cash_Invoice_NumbersInputs = {};
export type Cash_Invoice_Numbers_HintInputs = {};
export type Cash_Match_PromptInputs = {};
export type Cash_Net_8_WeeksInputs = {};
export type Cash_Net_CashInputs = {};
export type Cash_Net_NoteInputs = {};
export type Cash_NeverInputs = { phone: NonNullable<unknown> };
export type Cash_No_Open_InvoicesInputs = {};
export type Cash_On_This_DeviceInputs = {};
export type Cash_Paid_ByInputs = {};
export type Cash_Read_And_MatchInputs = {};
export type Cash_ReceiptsInputs = {};
export type Cash_Remittance_PlaceholderInputs = {};
export type Cash_Remittance_TextInputs = {};
export type Cash_Request_Came_ByInputs = {};
export type Cash_RequestedInputs = {};
export type Cash_Requested_ValueInputs = { bank: NonNullable<unknown>, iban: NonNullable<unknown> };
export type Cash_Series_InInputs = {};
export type Cash_Series_OutInputs = {};
export type Cash_Status_ApprovedInputs = {};
export type Cash_Status_Approved_1_Of_2Inputs = {};
export type Cash_Status_PendingInputs = {};
export type Cash_Status_RejectedInputs = {};
export type Cash_Step_AppliedInputs = {};
export type Cash_Step_Call_BackInputs = {};
export type Cash_Step_First_ApprovalInputs = {};
export type Cash_Step_Request_ReceivedInputs = {};
export type Cash_Step_Second_ApprovalInputs = {};
export type Cash_SuppliersInputs = {};
export type Cash_Waiting_For_ApproverInputs = {};
export type Cash_You_DecidedInputs = {};
export type Commercial_Acceptance_DoneInputs = { line: NonNullable<unknown> };
export type Commercial_Acceptance_TextInputs = { line: NonNullable<unknown> };
export type Commercial_Accepted_In_WritingInputs = {};
export type Commercial_All_Lines_PricedInputs = {};
export type Commercial_Allocation_LinesInputs = {};
export type Commercial_Allocation_QtyInputs = {};
export type Commercial_Allocation_ValueInputs = {};
export type Commercial_Approval_PendingInputs = { title: NonNullable<unknown>, status: NonNullable<unknown> };
export type Commercial_Approval_Requested_DoneInputs = {};
export type Commercial_Approval_Requested_ShortInputs = {};
export type Commercial_Approval_RuleInputs = { max: NonNullable<unknown> };
export type Commercial_ApproveInputs = {};
export type Commercial_Approved_DoneInputs = { number: NonNullable<unknown> };
export type Commercial_Charge_ActualInputs = {};
export type Commercial_Charge_ConfirmedInputs = {};
export type Commercial_Charge_EstimateInputs = {};
export type Commercial_Charges_AllocatedInputs = { allocation: NonNullable<unknown> };
export type Commercial_Charges_VatInputs = {};
export type Commercial_Check_AgainInputs = {};
export type Commercial_Check_NoInputs = { supplier: NonNullable<unknown> };
export type Commercial_Check_OfferInputs = { n: NonNullable<unknown>, supplier: NonNullable<unknown>, offered: NonNullable<unknown>, note: NonNullable<unknown> };
export type Commercial_Check_OffersInputs = {};
export type Commercial_Check_QuestionInputs = { n: NonNullable<unknown>, supplier: NonNullable<unknown> };
export type Commercial_Check_RequestedInputs = { description: NonNullable<unknown>, requested: NonNullable<unknown>, rules: NonNullable<unknown> };
export type Commercial_Check_YesInputs = { supplier: NonNullable<unknown> };
export type Commercial_Col_AmountInputs = {};
export type Commercial_Col_Approved_QuoteInputs = {};
export type Commercial_Col_ChargeInputs = {};
export type Commercial_Col_ChecksInputs = {};
export type Commercial_Col_FieldInputs = {};
export type Commercial_Col_LandedInputs = {};
export type Commercial_Col_Landed_PerInputs = { unit: NonNullable<unknown> };
export type Commercial_Col_LeadInputs = {};
export type Commercial_Col_Line_SupplierInputs = {};
export type Commercial_Col_Margin_PctInputs = {};
export type Commercial_Col_MarkupInputs = {};
export type Commercial_Col_OfferedInputs = {};
export type Commercial_Col_Plus_SharedInputs = {};
export type Commercial_Col_PortalInputs = {};
export type Commercial_Col_Price_OfferedInputs = {};
export type Commercial_Col_SellInputs = { currency: NonNullable<unknown> };
export type Commercial_Col_StatusInputs = {};
export type Commercial_Col_SupplierInputs = {};
export type Commercial_Col_TermsInputs = {};
export type Commercial_Col_UnitInputs = { currency: NonNullable<unknown> };
export type Commercial_Col_Unit_PriceInputs = { unit: NonNullable<unknown> };
export type Commercial_Compare_ByInputs = {};
export type Commercial_Continue_PricingInputs = {};
export type Commercial_Correction_NoteInputs = {};
export type Commercial_Correction_SentInputs = {};
export type Commercial_CoverageInputs = { pct: NonNullable<unknown> };
export type Commercial_Coverage_ExpiryInputs = { pct: NonNullable<unknown>, expiry: NonNullable<unknown> };
export type Commercial_Create_RevisionInputs = {};
export type Commercial_CurrencyInputs = {};
export type Commercial_CustomerInputs = {};
export type Commercial_Customer_DecisionInputs = {};
export type Commercial_Customer_DiscountInputs = {};
export type Commercial_Customer_PortalInputs = {};
export type Commercial_Customers_PortalInputs = {};
export type Commercial_DecisionInputs = {};
export type Commercial_Decision_LostInputs = {};
export type Commercial_Decision_Note_LabelInputs = {};
export type Commercial_Decision_Partially_WonInputs = {};
export type Commercial_Decision_PlaceholderInputs = {};
export type Commercial_Decision_Revision_RequestedInputs = {};
export type Commercial_Decision_TextInputs = { number: NonNullable<unknown> };
export type Commercial_Decision_WonInputs = {};
export type Commercial_DifferenceInputs = {};
export type Commercial_Email_From_OdooInputs = {};
export type Commercial_Email_ToInputs = { to: NonNullable<unknown> };
export type Commercial_Eta_DaysInputs = { day: NonNullable<unknown>, days: NonNullable<unknown> };
export type Commercial_EvidenceInputs = {};
export type Commercial_Evidence_DefaultInputs = {};
export type Commercial_ExceptionsInputs = { count: NonNullable<unknown>, type: NonNullable<unknown> };
export type Commercial_Fig_Expected_ProfitInputs = {};
export type Commercial_Fig_Input_VatInputs = {};
export type Commercial_Fig_LandedInputs = {};
export type Commercial_Fig_Lines_PricedInputs = {};
export type Commercial_Fig_MarginInputs = {};
export type Commercial_Fig_MarkupInputs = {};
export type Commercial_Fig_SellingInputs = {};
export type Commercial_Gross_ProfitInputs = {};
export type Commercial_How_ComparedInputs = { port: NonNullable<unknown> };
export type Commercial_Landed_CostInputs = {};
export type Commercial_Landed_Note_ConfirmedInputs = { charges: NonNullable<unknown> };
export type Commercial_Landed_Note_EstimatesInputs = { charges: NonNullable<unknown>, count: NonNullable<unknown> };
export type Commercial_LanguageInputs = {};
export type Commercial_Lead_DaysInputs = { days: NonNullable<unknown> };
export type Commercial_Letter_BodyInputs = { number: NonNullable<unknown>, vessel: NonNullable<unknown>, ref: NonNullable<unknown>, port: NonNullable<unknown> };
export type Commercial_Letter_CompanyInputs = {};
export type Commercial_Letter_DearInputs = { name: NonNullable<unknown> };
export type Commercial_Letter_RegardsInputs = {};
export type Commercial_Letter_ValidInputs = { day: NonNullable<unknown> };
export type Commercial_Line_RequestedInputs = { description: NonNullable<unknown>, requested: NonNullable<unknown> };
export type Commercial_Lines_SelectedInputs = { selected: NonNullable<unknown>, total: NonNullable<unknown> };
export type Commercial_Margin_For_LineInputs = { line: NonNullable<unknown> };
export type Commercial_Margin_MarkupInputs = { margin: NonNullable<unknown>, markup: NonNullable<unknown> };
export type Commercial_Margin_NoteInputs = { profit: NonNullable<unknown>, sell: NonNullable<unknown> };
export type Commercial_Margin_Per_LineInputs = {};
export type Commercial_Margin_Vs_TargetInputs = { target: NonNullable<unknown> };
export type Commercial_Markup_NoteInputs = { profit: NonNullable<unknown>, landed: NonNullable<unknown> };
export type Commercial_MatchInputs = {};
export type Commercial_MessageInputs = {};
export type Commercial_Metric_FreightInputs = { freight: NonNullable<unknown>, note: NonNullable<unknown> };
export type Commercial_Metric_LandedInputs = { amount: NonNullable<unknown> };
export type Commercial_Metric_No_FreightInputs = { note: NonNullable<unknown> };
export type Commercial_No_ExceptionsInputs = {};
export type Commercial_No_IssuesInputs = {};
export type Commercial_No_Lines_YetInputs = {};
export type Commercial_No_OffersInputs = {};
export type Commercial_No_RecommendationInputs = {};
export type Commercial_NoneInputs = {};
export type Commercial_Not_Sent_YetInputs = { missing: NonNullable<unknown> };
export type Commercial_Note_Approver_PlaceholderInputs = {};
export type Commercial_Note_For_ApproverInputs = {};
export type Commercial_Of_Selling_PriceInputs = {};
export type Commercial_Of_The_LinesInputs = {};
export type Commercial_Offer_VersionInputs = { supplier: NonNullable<unknown>, version: NonNullable<unknown> };
export type Commercial_OkInputs = {};
export type Commercial_On_Top_LandedInputs = {};
export type Commercial_Open_ApprovalsInputs = {};
export type Commercial_Paper_AddressInputs = {};
export type Commercial_Paper_AttentionInputs = {};
export type Commercial_Paper_BrandInputs = {};
export type Commercial_Paper_ClientInputs = {};
export type Commercial_Paper_CompanyInputs = {};
export type Commercial_Paper_ConvertedInputs = { currency: NonNullable<unknown>, fx: NonNullable<unknown> };
export type Commercial_Paper_DateInputs = { date: NonNullable<unknown> };
export type Commercial_Paper_DeliveryInputs = { port: NonNullable<unknown>, eta: NonNullable<unknown> };
export type Commercial_Paper_DescInputs = {};
export type Commercial_Paper_DiscountInputs = { pct: NonNullable<unknown> };
export type Commercial_Paper_DraftInputs = { version: NonNullable<unknown> };
export type Commercial_Paper_GrandInputs = { currency: NonNullable<unknown> };
export type Commercial_Paper_IntroInputs = {};
export type Commercial_Paper_NoInputs = { number: NonNullable<unknown> };
export type Commercial_Paper_PartInputs = {};
export type Commercial_Paper_PayInputs = { terms: NonNullable<unknown> };
export type Commercial_Paper_PortInputs = {};
export type Commercial_Paper_Port_EtaInputs = { port: NonNullable<unknown>, eta: NonNullable<unknown> };
export type Commercial_Paper_PreparedInputs = { prepared: NonNullable<unknown> };
export type Commercial_Paper_Prepared_ApprovedInputs = { prepared: NonNullable<unknown>, approved: NonNullable<unknown> };
export type Commercial_Paper_PriceInputs = { currency: NonNullable<unknown> };
export type Commercial_Paper_QtyInputs = {};
export type Commercial_Paper_Qty_RuleInputs = {};
export type Commercial_Paper_RefInputs = { ref: NonNullable<unknown> };
export type Commercial_Paper_RemarksInputs = {};
export type Commercial_Paper_SInputs = {};
export type Commercial_Paper_SignatureInputs = { name: NonNullable<unknown> };
export type Commercial_Paper_Signature_PendingInputs = {};
export type Commercial_Paper_SupersededInputs = {};
export type Commercial_Paper_TitleInputs = {};
export type Commercial_Paper_TotalInputs = { currency: NonNullable<unknown> };
export type Commercial_Paper_UomInputs = {};
export type Commercial_Paper_ValidInputs = { day: NonNullable<unknown> };
export type Commercial_Paper_VatInputs = {};
export type Commercial_Paper_VesselInputs = {};
export type Commercial_Paper_WishInputs = {};
export type Commercial_Policy_NoteInputs = { target: NonNullable<unknown>, min: NonNullable<unknown>, max: NonNullable<unknown>, fx: NonNullable<unknown> };
export type Commercial_Policy_TargetInputs = { target: NonNullable<unknown> };
export type Commercial_Portal_All_MatchInputs = {};
export type Commercial_Portal_DiffsInputs = { fields: NonNullable<unknown> };
export type Commercial_Portal_EmptyInputs = {};
export type Commercial_Portal_NoteInputs = {};
export type Commercial_Preview_QuoteInputs = { number: NonNullable<unknown> };
export type Commercial_Price_Build_UpInputs = {};
export type Commercial_Price_NoteInputs = { per: NonNullable<unknown>, total: NonNullable<unknown> };
export type Commercial_Pricing_PolicyInputs = {};
export type Commercial_PrintInputs = {};
export type Commercial_Profit_ShareInputs = { pct: NonNullable<unknown> };
export type Commercial_Quantity_FromInputs = { supplier: NonNullable<unknown> };
export type Commercial_Quote_ApprovedInputs = { number: NonNullable<unknown> };
export type Commercial_Quote_ReturnedInputs = { number: NonNullable<unknown> };
export type Commercial_ReadyInputs = { day: NonNullable<unknown> };
export type Commercial_ReasonInputs = {};
export type Commercial_Reason_BestInputs = {};
export type Commercial_Reason_Not_BestInputs = {};
export type Commercial_Reason_PlaceholderInputs = {};
export type Commercial_Recommendation_BestInputs = { offer: NonNullable<unknown>, landed: NonNullable<unknown>, baseUnit: NonNullable<unknown> };
export type Commercial_Recommendation_HeadingInputs = {};
export type Commercial_Recommendation_SplitInputs = { split: NonNullable<unknown>, cost: NonNullable<unknown> };
export type Commercial_Recommendation_Split_SavesInputs = { split: NonNullable<unknown>, cost: NonNullable<unknown>, saves: NonNullable<unknown> };
export type Commercial_RecordInputs = {};
export type Commercial_Record_AcceptanceInputs = {};
export type Commercial_Record_Acceptance_ConfirmInputs = {};
export type Commercial_Record_DecisionInputs = {};
export type Commercial_Request_ApprovalInputs = {};
export type Commercial_Request_Approval_TextInputs = { lines: NonNullable<unknown>, sell: NonNullable<unknown>, margin: NonNullable<unknown>, type: NonNullable<unknown> };
export type Commercial_Requested_RulesInputs = { requested: NonNullable<unknown>, rules: NonNullable<unknown> };
export type Commercial_ReturnInputs = {};
export type Commercial_Return_HeadingInputs = { number: NonNullable<unknown> };
export type Commercial_Return_PlaceholderInputs = {};
export type Commercial_Return_TextInputs = { number: NonNullable<unknown> };
export type Commercial_Returned_DoneInputs = {};
export type Commercial_Revise_HeadingInputs = { number: NonNullable<unknown> };
export type Commercial_Revise_PlaceholderInputs = {};
export type Commercial_Revise_TextInputs = { version: NonNullable<unknown>, number: NonNullable<unknown> };
export type Commercial_Sales_NoteInputs = {};
export type Commercial_Save_SelectionInputs = {};
export type Commercial_SelectInputs = {};
export type Commercial_Select_Done_BestInputs = { line: NonNullable<unknown>, supplier: NonNullable<unknown> };
export type Commercial_Select_HeadingInputs = { line: NonNullable<unknown> };
export type Commercial_Select_Offer_LineInputs = { offer: NonNullable<unknown>, qty: NonNullable<unknown>, unit: NonNullable<unknown>, landed: NonNullable<unknown> };
export type Commercial_SelectedInputs = {};
export type Commercial_Selected_NoteInputs = { selected: NonNullable<unknown>, inferred: NonNullable<unknown> };
export type Commercial_Selected_Note_ReasonInputs = { selected: NonNullable<unknown>, reason: NonNullable<unknown>, inferred: NonNullable<unknown> };
export type Commercial_Selected_QtyInputs = { qty: NonNullable<unknown> };
export type Commercial_Selection_SavedInputs = { line: NonNullable<unknown> };
export type Commercial_Sell_NoteInputs = { sell: NonNullable<unknown>, currency: NonNullable<unknown>, fx: NonNullable<unknown> };
export type Commercial_Sell_Note_DiscountInputs = { sell: NonNullable<unknown>, currency: NonNullable<unknown>, fx: NonNullable<unknown>, discount: NonNullable<unknown> };
export type Commercial_SendInputs = {};
export type Commercial_Send_Ai_DraftInputs = {};
export type Commercial_Send_Correction_HeadingInputs = {};
export type Commercial_Send_Correction_TextInputs = { to: NonNullable<unknown>, subject: NonNullable<unknown> };
export type Commercial_Send_Email_LineInputs = { to: NonNullable<unknown>, number: NonNullable<unknown>, vessel: NonNullable<unknown>, ref: NonNullable<unknown> };
export type Commercial_Send_HeadingInputs = { number: NonNullable<unknown> };
export type Commercial_Send_Portal_LineInputs = { portal: NonNullable<unknown> };
export type Commercial_Send_To_CustomerInputs = {};
export type Commercial_Send_To_SupplierInputs = {};
export type Commercial_Sent_ViaInputs = { when: NonNullable<unknown>, method: NonNullable<unknown> };
export type Commercial_Shared_AllocatedInputs = {};
export type Commercial_Shared_ChargesInputs = {};
export type Commercial_Split_AcrossInputs = {};
export type Commercial_Split_Adds_UpInputs = { qty: NonNullable<unknown>, unit: NonNullable<unknown> };
export type Commercial_Split_HeadingInputs = { line: NonNullable<unknown> };
export type Commercial_Split_Part_NoteInputs = { offer: NonNullable<unknown>, landed: NonNullable<unknown>, baseUnit: NonNullable<unknown>, max: NonNullable<unknown>, unit: NonNullable<unknown> };
export type Commercial_Split_ReasonInputs = {};
export type Commercial_Step_Approval_RequestedInputs = {};
export type Commercial_Step_ApprovedInputs = {};
export type Commercial_Step_PreparedInputs = {};
export type Commercial_Step_SentInputs = {};
export type Commercial_Submission_MethodInputs = {};
export type Commercial_Supplier_CostInputs = {};
export type Commercial_Tag_AgencyInputs = {};
export type Commercial_Tag_Ai_CheckInputs = {};
export type Commercial_Tag_Ai_DraftInputs = {};
export type Commercial_Tag_Best_FitInputs = {};
export type Commercial_Tag_Cheapest_UnitInputs = {};
export type Commercial_Tag_Own_StockInputs = {};
export type Commercial_Target_MinInputs = { target: NonNullable<unknown>, min: NonNullable<unknown> };
export type Commercial_Terms_No_ExpiryInputs = { terms: NonNullable<unknown> };
export type Commercial_Terms_ValidInputs = { day: NonNullable<unknown>, terms: NonNullable<unknown> };
export type Commercial_To_FollowInputs = { count: NonNullable<unknown> };
export type Commercial_Total_SharedInputs = {};
export type Commercial_Unit_PriceInputs = {};
export type Commercial_Unpriced_LineInputs = { line: NonNullable<unknown>, description: NonNullable<unknown>, status: NonNullable<unknown> };
export type Commercial_Upload_CompareInputs = {};
export type Commercial_Use_SplitInputs = {};
export type Commercial_Vat_NoteInputs = {};
export type Commercial_View_QuotationInputs = {};
export type Commercial_What_ChangesInputs = {};
export type Commercial_Within_PolicyInputs = {};
export type Control_Room_Ageing_CenterInputs = {};
export type Control_Room_Ageing_LabelInputs = {};
export type Control_Room_Ai_DraftInputs = {};
export type Control_Room_All_CasesInputs = {};
export type Control_Room_ApprovalsInputs = {};
export type Control_Room_Ask_FootnoteInputs = {};
export type Control_Room_Ask_IntroInputs = {};
export type Control_Room_Ask_NameInputs = {};
export type Control_Room_Ask_PlaceholderInputs = {};
export type Control_Room_Ask_QuestionInputs = {};
export type Control_Room_Ask_ReadingInputs = {};
export type Control_Room_AssistantInputs = {};
export type Control_Room_Briefing_SummarisedInputs = { at: NonNullable<unknown>, count: NonNullable<unknown> };
export type Control_Room_Briefing_WrittenInputs = { count: NonNullable<unknown> };
export type Control_Room_Days_LabelInputs = {};
export type Control_Room_Days_SummaryInputs = { total: NonNullable<unknown>, day: NonNullable<unknown>, count: NonNullable<unknown> };
export type Control_Room_EyebrowInputs = {};
export type Control_Room_Figure_Avg_Time_To_QuoteInputs = {};
export type Control_Room_Figure_Gross_ProfitInputs = {};
export type Control_Room_Figure_Open_RfqsInputs = {};
export type Control_Room_Figure_Receivables_OpenInputs = {};
export type Control_Room_Figure_Waiting_On_SuppliersInputs = {};
export type Control_Room_Figure_Win_RateInputs = {};
export type Control_Room_Funnel_12wInputs = {};
export type Control_Room_Funnel_4wInputs = {};
export type Control_Room_Funnel_Note_12wInputs = {};
export type Control_Room_Funnel_Note_4wInputs = {};
export type Control_Room_HeadingInputs = {};
export type Control_Room_InquiriesInputs = { count: NonNullable<unknown> };
export type Control_Room_Lost_CenterInputs = {};
export type Control_Room_Lost_LabelInputs = {};
export type Control_Room_Money_WithheldInputs = {};
export type Control_Room_Month_NoteInputs = { month: NonNullable<unknown>, note: NonNullable<unknown> };
export type Control_Room_Range_MonthsInputs = { points: NonNullable<unknown> };
export type Control_Room_Range_WeeksInputs = { points: NonNullable<unknown> };
export type Control_Room_Receivables_PayablesInputs = {};
export type Control_Room_SubtitleInputs = {};
export type Control_Room_SummariseInputs = {};
export type Growth_Column_ImoInputs = {};
export type Growth_Column_ManagerInputs = {};
export type Growth_Column_TypeInputs = {};
export type Growth_Column_VesselInputs = {};
export type Growth_Extract_CompanyInputs = {};
export type Growth_Extract_ExpiresInputs = {};
export type Growth_Extract_Expires_HintInputs = {};
export type Growth_Extract_IssuedInputs = {};
export type Growth_Extract_LabelInputs = {};
export type Growth_Extract_RegistrationInputs = {};
export type Growth_Extract_TaxInputs = {};
export type Growth_Extract_WhatInputs = {};
export type Growth_Fleet_SupportingInputs = { count: NonNullable<unknown>, size: NonNullable<unknown>, supplied: NonNullable<unknown> };
export type Growth_Not_YetInputs = {};
export type Growth_SuppliedInputs = {};
export type Home_Away_ContextInputs = {};
export type Home_Away_LabelInputs = {};
export type Home_Figure_Awaiting_Customer_DecisionInputs = {};
export type Home_Figure_Awaiting_Internal_ApprovalInputs = {};
export type Home_Figure_Awaiting_SupplierInputs = {};
export type Home_Figure_Deliveries_In_ProgressInputs = {};
export type Home_Figure_Expected_Gross_Profit_NovInputs = {};
export type Home_Figure_Inquiries_4_WeeksInputs = {};
export type Home_Figure_My_Quote_TurnaroundInputs = {};
export type Home_Figure_Net_Cash_8_WeeksInputs = {};
export type Home_Figure_Out_Of_Hours_RfqsInputs = {};
export type Home_Figure_Quote_TurnaroundInputs = {};
export type Home_Figure_ReceivablesInputs = {};
export type Home_Figure_Time_To_AcknowledgeInputs = {};
export type Home_Figure_Won_4_WeeksInputs = {};
export type Home_LateInputs = {};
export type Inbox_Ack_By_HandInputs = {};
export type Inbox_Ack_Note_ManualInputs = { template: NonNullable<unknown> };
export type Inbox_Ack_Note_OnceInputs = { template: NonNullable<unknown> };
export type Inbox_Ack_On_CreateInputs = {};
export type Inbox_Ack_SentInputs = { when: NonNullable<unknown> };
export type Inbox_Ai_DraftInputs = {};
export type Inbox_Assignment_RuleInputs = { rule: NonNullable<unknown> };
export type Inbox_Assignment_Rule_ChangeInputs = { rule: NonNullable<unknown> };
export type Inbox_BackupInputs = {};
export type Inbox_Case_CreatedInputs = { caseId: NonNullable<unknown> };
export type Inbox_Case_Was_CreatedInputs = { caseId: NonNullable<unknown> };
export type Inbox_ChannelInputs = { kind: NonNullable<unknown>, account: NonNullable<unknown>, status: NonNullable<unknown> };
export type Inbox_Check_OriginalInputs = {};
export type Inbox_Clarification_SubjectInputs = {};
export type Inbox_Col_ConfidenceInputs = {};
export type Inbox_Col_ItemInputs = {};
export type Inbox_Col_Part_NoInputs = {};
export type Inbox_Col_QtyInputs = {};
export type Inbox_Col_SourceInputs = {};
export type Inbox_Col_UnitInputs = {};
export type Inbox_Create_RfqInputs = { customer: NonNullable<unknown>, lines: NonNullable<unknown>, owner: NonNullable<unknown> };
export type Inbox_Create_Rfq_FlaggedInputs = { customer: NonNullable<unknown>, lines: NonNullable<unknown>, flagged: NonNullable<unknown>, owner: NonNullable<unknown> };
export type Inbox_Create_ServiceInputs = { customer: NonNullable<unknown>, lines: NonNullable<unknown>, owner: NonNullable<unknown> };
export type Inbox_Create_Service_FlaggedInputs = { customer: NonNullable<unknown>, lines: NonNullable<unknown>, flagged: NonNullable<unknown>, owner: NonNullable<unknown> };
export type Inbox_ExtractInputs = {};
export type Inbox_Extract_TextInputs = {};
export type Inbox_Extract_Text_FilesInputs = {};
export type Inbox_Flag_Auto_ReplyInputs = {};
export type Inbox_Flag_Auto_Reply_NoteInputs = {};
export type Inbox_Flag_BankInputs = {};
export type Inbox_Flag_Bank_NoteInputs = {};
export type Inbox_Flag_Cannot_SupplyInputs = {};
export type Inbox_Flag_Cannot_Supply_NoteInputs = {};
export type Inbox_FromInputs = { name: NonNullable<unknown>, email: NonNullable<unknown> };
export type Inbox_History_Approval_ReadyInputs = {};
export type Inbox_History_Approval_TextInputs = {};
export type Inbox_History_Approval_WaitingInputs = { blocked: NonNullable<unknown> };
export type Inbox_History_ApproveInputs = {};
export type Inbox_History_Approve_DoneInputs = {};
export type Inbox_History_Approved_ByInputs = { by: NonNullable<unknown> };
export type Inbox_History_Col_AttachmentsInputs = {};
export type Inbox_History_Col_CallsInputs = {};
export type Inbox_History_Col_CategoriesInputs = {};
export type Inbox_History_Col_CountryInputs = {};
export type Inbox_History_Col_CustomerInputs = {};
export type Inbox_History_Col_FleetInputs = {};
export type Inbox_History_Col_ImoInputs = {};
export type Inbox_History_Col_ItemInputs = {};
export type Inbox_History_Col_MailboxInputs = {};
export type Inbox_History_Col_PoInputs = {};
export type Inbox_History_Col_PortsInputs = {};
export type Inbox_History_Col_PriceInputs = {};
export type Inbox_History_Col_QuotedInputs = {};
export type Inbox_History_Col_Quoted_AtInputs = {};
export type Inbox_History_Col_RfqsInputs = {};
export type Inbox_History_Col_SourceInputs = {};
export type Inbox_History_Col_SupplierInputs = {};
export type Inbox_History_Col_VesselInputs = {};
export type Inbox_History_Col_YearsInputs = {};
export type Inbox_History_Confirm_HeadingInputs = {};
export type Inbox_History_Confirm_TextInputs = { totals: NonNullable<unknown>, prices: NonNullable<unknown>, kept: NonNullable<unknown>, decisions: NonNullable<unknown> };
export type Inbox_History_CreatedInputs = { kind: NonNullable<unknown>, name: NonNullable<unknown> };
export type Inbox_History_CustomersInputs = {};
export type Inbox_History_Customers_FoundInputs = { count: NonNullable<unknown> };
export type Inbox_History_Customers_NoteInputs = {};
export type Inbox_History_Dated_PricesInputs = {};
export type Inbox_History_Dedup_A11yInputs = { label: NonNullable<unknown>, count: NonNullable<unknown> };
export type Inbox_History_Dedup_NoteInputs = {};
export type Inbox_History_Dedup_ValueInputs = { count: NonNullable<unknown> };
export type Inbox_History_EyebrowInputs = {};
export type Inbox_History_HeadingInputs = {};
export type Inbox_History_KeptInputs = {};
export type Inbox_History_Kept_ShareInputs = { scanned: NonNullable<unknown> };
export type Inbox_History_Mailboxes_NoteInputs = {};
export type Inbox_History_MessagesInputs = {};
export type Inbox_History_New_To_OdooInputs = {};
export type Inbox_History_No_PoInputs = {};
export type Inbox_History_OrderedInputs = {};
export type Inbox_History_Organise_FirstInputs = {};
export type Inbox_History_Organise_NoteInputs = {};
export type Inbox_History_Organise_TextInputs = {};
export type Inbox_History_OrganisedInputs = {};
export type Inbox_History_Pending_DecisionInputs = { count: NonNullable<unknown> };
export type Inbox_History_Per_YearInputs = {};
export type Inbox_History_PriceInputs = { price: NonNullable<unknown>, per: NonNullable<unknown> };
export type Inbox_History_Price_HiddenInputs = {};
export type Inbox_History_Prices_FoundInputs = { count: NonNullable<unknown> };
export type Inbox_History_Prices_NoteInputs = { count: NonNullable<unknown> };
export type Inbox_History_ScannedInputs = { count: NonNullable<unknown> };
export type Inbox_History_SearchableInputs = { totals: NonNullable<unknown>, prices: NonNullable<unknown> };
export type Inbox_History_Status_ApprovedInputs = { by: NonNullable<unknown> };
export type Inbox_History_Status_Dry_RunInputs = {};
export type Inbox_History_Status_PendingInputs = { count: NonNullable<unknown> };
export type Inbox_History_Status_WaitingInputs = {};
export type Inbox_History_Step_ConnectInputs = {};
export type Inbox_History_Step_DedupInputs = {};
export type Inbox_History_Step_OrganiseInputs = {};
export type Inbox_History_Step_ReviewInputs = {};
export type Inbox_History_Step_ScanInputs = {};
export type Inbox_History_SubtitleInputs = {};
export type Inbox_History_SuppliersInputs = {};
export type Inbox_History_Suppliers_FoundInputs = { count: NonNullable<unknown> };
export type Inbox_History_Suppliers_NoteInputs = {};
export type Inbox_History_TotalsInputs = { customers: NonNullable<unknown>, customersText: NonNullable<unknown>, vessels: NonNullable<unknown>, vesselsText: NonNullable<unknown>, suppliers: NonNullable<unknown>, suppliersText: NonNullable<unknown> };
export type Inbox_History_VesselsInputs = {};
export type Inbox_History_Vessels_FoundInputs = { count: NonNullable<unknown> };
export type Inbox_History_Vessels_NoteInputs = {};
export type Inbox_Kept_As_ReceivedInputs = {};
export type Inbox_Kind_ComplaintInputs = {};
export type Inbox_Kind_DeliveryInputs = {};
export type Inbox_Kind_InvoiceInputs = {};
export type Inbox_Kind_OfferInputs = {};
export type Inbox_Kind_OrderInputs = {};
export type Inbox_Kind_OtherInputs = {};
export type Inbox_Kind_RfqInputs = {};
export type Inbox_LinkedInputs = { caseId: NonNullable<unknown> };
export type Inbox_Linked_ByInputs = { caseId: NonNullable<unknown>, by: NonNullable<unknown> };
export type Inbox_Linked_TextInputs = {};
export type Inbox_Low_ConfidenceInputs = {};
export type Inbox_MatchInputs = {};
export type Inbox_Match_TextInputs = {};
export type Inbox_Match_UncertainInputs = {};
export type Inbox_Message_IdInputs = { id: NonNullable<unknown> };
export type Inbox_New_CustomerInputs = {};
export type Inbox_Next_RfqsInputs = {};
export type Inbox_No_ClarificationInputs = {};
export type Inbox_No_TextInputs = {};
export type Inbox_Not_An_RfqInputs = {};
export type Inbox_Not_RelatedInputs = {};
export type Inbox_Not_Related_ByInputs = { by: NonNullable<unknown> };
export type Inbox_Not_RfqInputs = {};
export type Inbox_Nothing_MoreInputs = {};
export type Inbox_Offer_CurrencyInputs = {};
export type Inbox_Offer_ExtractInputs = {};
export type Inbox_Offer_ItemInputs = {};
export type Inbox_Offer_Lead_TimeInputs = {};
export type Inbox_Offer_PackInputs = {};
export type Inbox_Offer_PriceInputs = {};
export type Inbox_Offer_ValidityInputs = {};
export type Inbox_Open_CaseInputs = {};
export type Inbox_OrderInputs = {};
export type Inbox_Order_NewestInputs = {};
export type Inbox_Order_UrgentInputs = {};
export type Inbox_OwnerInputs = {};
export type Inbox_Pick_MessageInputs = {};
export type Inbox_Quote_DeadlineInputs = {};
export type Inbox_Reminder_ScheduledInputs = {};
export type Inbox_Send_RfqsInputs = {};
export type Inbox_ShowInputs = {};
export type Inbox_Show_AllInputs = {};
export type Inbox_Show_LinkedInputs = {};
export type Inbox_Show_NewInputs = {};
export type Inbox_Show_ReviewInputs = {};
export type Inbox_Show_Review_CountInputs = { count: NonNullable<unknown> };
export type Inbox_ToInputs = { name: NonNullable<unknown>, email: NonNullable<unknown> };
export type Inbox_TodayInputs = { processed: NonNullable<unknown>, duplicates: NonNullable<unknown>, review: NonNullable<unknown> };
export type Inbox_ViaInputs = { via: NonNullable<unknown>, when: NonNullable<unknown> };
export type Index_MoneyInputs = { currency: NonNullable<unknown>, amount: NonNullable<unknown> };
export type Index_Money_KInputs = { currency: NonNullable<unknown>, amount: NonNullable<unknown> };
export type Integrations_Ack_FromInputs = { from: NonNullable<unknown> };
export type Integrations_Ack_NoteInputs = {};
export type Integrations_Ack_StatusInputs = { status: NonNullable<unknown>, version: NonNullable<unknown>, approvedBy: NonNullable<unknown> };
export type Integrations_Ack_ToInputs = { to: NonNullable<unknown> };
export type Integrations_All_TemplatesInputs = {};
export type Integrations_Backups_NoteInputs = {};
export type Integrations_Checked_LabelInputs = {};
export type Integrations_Checked_NoteInputs = { n: NonNullable<unknown>, checked: NonNullable<unknown> };
export type Integrations_Company_DefaultInputs = {};
export type Integrations_ConfidentialInputs = {};
export type Integrations_Confidential_NoteInputs = {};
export type Integrations_CopiesInputs = {};
export type Integrations_Copies_ValueInputs = { locations: NonNullable<unknown>, days: NonNullable<unknown> };
export type Integrations_Documents_ArInputs = {};
export type Integrations_Documents_EnInputs = {};
export type Integrations_DuplicatesInputs = {};
export type Integrations_Duplicates_NoteInputs = {};
export type Integrations_Emails_ScannedInputs = {};
export type Integrations_ExceptionsInputs = {};
export type Integrations_Exceptions_NoteInputs = {};
export type Integrations_Import_DaysInputs = { n: NonNullable<unknown>, days: NonNullable<unknown> };
export type Integrations_Import_NoteInputs = {};
export type Integrations_Lang_ArInputs = {};
export type Integrations_Languages_NoteInputs = {};
export type Integrations_Last_BackupInputs = {};
export type Integrations_Migration_NoteInputs = {};
export type Integrations_Moved_LabelInputs = {};
export type Integrations_Moved_NoteInputs = { n: NonNullable<unknown>, moved: NonNullable<unknown>, all: NonNullable<unknown> };
export type Integrations_Never_InternalInputs = {};
export type Integrations_Once_Per_ThreadInputs = {};
export type Integrations_Open_Inbox_HistoryInputs = {};
export type Integrations_Parts_LabelInputs = {};
export type Integrations_Parts_ValueInputs = { done: NonNullable<unknown>, total: NonNullable<unknown> };
export type Integrations_Preview_LanguageInputs = {};
export type Integrations_ReadyInputs = {};
export type Integrations_Refresh_StagingInputs = {};
export type Integrations_Refresh_Staging_DoneInputs = {};
export type Integrations_Refresh_Staging_ReasonInputs = {};
export type Integrations_Restore_TestedInputs = {};
export type Integrations_Rfq_ThreadsInputs = {};
export type Integrations_Rfq_Threads_NoteInputs = {};
export type Integrations_ScheduleInputs = {};
export type Integrations_Settings_By_ManagementInputs = {};
export type Integrations_Staging_CopyInputs = {};
export type Integrations_Stays_OnInputs = {};
export type Integrations_Your_LanguageInputs = {};
export type Order_To_Cash_Agent_ContactInputs = {};
export type Order_To_Cash_Agreement_HintInputs = {};
export type Order_To_Cash_Agreement_Hint_AiInputs = {};
export type Order_To_Cash_Agreement_LabelInputs = {};
export type Order_To_Cash_Ai_Check_LineInputs = { what: NonNullable<unknown>, field: NonNullable<unknown>, po: NonNullable<unknown>, quotation: NonNullable<unknown>, quote: NonNullable<unknown> };
export type Order_To_Cash_Ai_Check_TagInputs = {};
export type Order_To_Cash_Ai_LineInputs = { line: NonNullable<unknown> };
export type Order_To_Cash_Ai_Second_LookInputs = {};
export type Order_To_Cash_Ai_TermsInputs = {};
export type Order_To_Cash_Amendment_ConfirmInputs = {};
export type Order_To_Cash_Amendment_DoneInputs = { line: NonNullable<unknown> };
export type Order_To_Cash_Amendment_Heading_HeaderInputs = {};
export type Order_To_Cash_Amendment_Heading_LineInputs = { line: NonNullable<unknown> };
export type Order_To_Cash_Amendment_IntroInputs = { field: NonNullable<unknown>, po: NonNullable<unknown>, quote: NonNullable<unknown> };
export type Order_To_Cash_Approve_ConfirmInputs = { number: NonNullable<unknown> };
export type Order_To_Cash_Ask_ApprovalInputs = {};
export type Order_To_Cash_Ask_Approval_DoneInputs = { number: NonNullable<unknown> };
export type Order_To_Cash_Bills_MatchedInputs = {};
export type Order_To_Cash_Bills_On_HoldInputs = { count: NonNullable<unknown> };
export type Order_To_Cash_Change_LineInputs = { item: NonNullable<unknown>, now: NonNullable<unknown> };
export type Order_To_Cash_ChangedInputs = {};
export type Order_To_Cash_Check_DocumentsInputs = {};
export type Order_To_Cash_Check_Goods_ReadyInputs = {};
export type Order_To_Cash_Check_No_ApprovalInputs = {};
export type Order_To_Cash_Check_Ship_StoresInputs = {};
export type Order_To_Cash_Check_TransportInputs = {};
export type Order_To_Cash_ClearanceInputs = {};
export type Order_To_Cash_Close_Line_PromptInputs = { line: NonNullable<unknown> };
export type Order_To_Cash_Close_With_ReasonInputs = {};
export type Order_To_Cash_Closed_DoneInputs = { line: NonNullable<unknown> };
export type Order_To_Cash_Col_At_QuotationInputs = {};
export type Order_To_Cash_Col_CheckedInputs = {};
export type Order_To_Cash_Col_Customer_PoInputs = {};
export type Order_To_Cash_Col_ItemInputs = {};
export type Order_To_Cash_Col_LineInputs = {};
export type Order_To_Cash_Col_NowInputs = {};
export type Order_To_Cash_Col_QuotationInputs = { quotation: NonNullable<unknown> };
export type Order_To_Cash_Col_ResultInputs = {};
export type Order_To_Cash_Commitment_BlockedInputs = { count: NonNullable<unknown> };
export type Order_To_Cash_Confirm_DeliveredInputs = {};
export type Order_To_Cash_Confirm_Delivered_HeadingInputs = { number: NonNullable<unknown> };
export type Order_To_Cash_Confirm_DeliveryInputs = {};
export type Order_To_Cash_Confirm_HeadingInputs = { number: NonNullable<unknown> };
export type Order_To_Cash_Confirm_Sales_OrderInputs = {};
export type Order_To_Cash_Confirm_SendInputs = {};
export type Order_To_Cash_Confirm_TextInputs = { number: NonNullable<unknown>, supplier: NonNullable<unknown> };
export type Order_To_Cash_Confirmed_By_ManagementInputs = {};
export type Order_To_Cash_Confirmed_DoneInputs = { number: NonNullable<unknown>, supplier: NonNullable<unknown> };
export type Order_To_Cash_Delivered_CountInputs = { n: NonNullable<unknown>, total: NonNullable<unknown> };
export type Order_To_Cash_Delivered_DoneInputs = { number: NonNullable<unknown> };
export type Order_To_Cash_DictateInputs = {};
export type Order_To_Cash_DispatchInputs = {};
export type Order_To_Cash_Dispatched_AtInputs = { at: NonNullable<unknown> };
export type Order_To_Cash_Drop_HeadingInputs = { drop: NonNullable<unknown>, number: NonNullable<unknown> };
export type Order_To_Cash_Drop_LineInputs = { line: NonNullable<unknown>, qty: NonNullable<unknown>, description: NonNullable<unknown> };
export type Order_To_Cash_Drop_Line_LotInputs = { line: NonNullable<unknown>, qty: NonNullable<unknown>, description: NonNullable<unknown>, lot: NonNullable<unknown> };
export type Order_To_Cash_Drop_TagInputs = { drop: NonNullable<unknown>, total: NonNullable<unknown>, status: NonNullable<unknown> };
export type Order_To_Cash_Evidence_HintInputs = {};
export type Order_To_Cash_Evidence_LegendInputs = {};
export type Order_To_Cash_Figure_Customer_PoInputs = {};
export type Order_To_Cash_Figure_ReceivedInputs = {};
export type Order_To_Cash_Figure_Supplier_BillsInputs = {};
export type Order_To_Cash_Figure_Supplier_Pos_ConfirmedInputs = {};
export type Order_To_Cash_Goods_ReadyInputs = {};
export type Order_To_Cash_HeaderInputs = {};
export type Order_To_Cash_IntroInputs = { lines: NonNullable<unknown>, place: NonNullable<unknown> };
export type Order_To_Cash_Intro_LineInputs = { line: NonNullable<unknown>, qty: NonNullable<unknown> };
export type Order_To_Cash_Invoice_DeliveredInputs = {};
export type Order_To_Cash_InvoicedInputs = {};
export type Order_To_Cash_Keep_OpenInputs = {};
export type Order_To_Cash_Kept_Open_DoneInputs = { line: NonNullable<unknown> };
export type Order_To_Cash_Launch_BoatInputs = {};
export type Order_To_Cash_Line_RefInputs = { line: NonNullable<unknown> };
export type Order_To_Cash_Mismatch_TextInputs = { line: NonNullable<unknown>, field: NonNullable<unknown> };
export type Order_To_Cash_Missing_ProofInputs = {};
export type Order_To_Cash_N_Of_TotalInputs = { n: NonNullable<unknown>, total: NonNullable<unknown> };
export type Order_To_Cash_No_PlanInputs = {};
export type Order_To_Cash_Not_DispatchedInputs = {};
export type Order_To_Cash_Not_On_Po_DecideInputs = {};
export type Order_To_Cash_Not_RecheckedInputs = {};
export type Order_To_Cash_OkInputs = {};
export type Order_To_Cash_On_BackorderInputs = { count: NonNullable<unknown> };
export type Order_To_Cash_On_PlanInputs = {};
export type Order_To_Cash_Outcome_ClosedInputs = {};
export type Order_To_Cash_Outcome_Open_RevisionInputs = {};
export type Order_To_Cash_Outcome_With_ReasonInputs = { outcome: NonNullable<unknown>, reason: NonNullable<unknown> };
export type Order_To_Cash_PairInputs = { a: NonNullable<unknown>, b: NonNullable<unknown> };
export type Order_To_Cash_Partial_Award_NoteInputs = {};
export type Order_To_Cash_Plan_NoteInputs = {};
export type Order_To_Cash_Planned_On_BoardInputs = {};
export type Order_To_Cash_Po_Arrived_HeadingInputs = {};
export type Order_To_Cash_Po_Arrived_TextInputs = {};
export type Order_To_Cash_Po_Checked_ValidatedInputs = {};
export type Order_To_Cash_Po_Empty_ConfirmedInputs = {};
export type Order_To_Cash_Po_Empty_NoneInputs = {};
export type Order_To_Cash_Po_Empty_ReadInputs = {};
export type Order_To_Cash_Po_Not_ReceivedInputs = {};
export type Order_To_Cash_Po_SubheadInputs = { number: NonNullable<unknown>, received: NonNullable<unknown>, quotation: NonNullable<unknown>, entity: NonNullable<unknown> };
export type Order_To_Cash_Po_ValidatedInputs = {};
export type Order_To_Cash_Po_Validated_AgreedInputs = {};
export type Order_To_Cash_Po_Validated_ConfirmedInputs = {};
export type Order_To_Cash_Po_Vs_QuotationInputs = { po: NonNullable<unknown>, quotation: NonNullable<unknown> };
export type Order_To_Cash_Port_PlaceInputs = {};
export type Order_To_Cash_Pos_Prepared_LaterInputs = {};
export type Order_To_Cash_Pos_RecheckedInputs = {};
export type Order_To_Cash_Proof_HintInputs = {};
export type Order_To_Cash_Proof_LegendInputs = {};
export type Order_To_Cash_Q_ItemsInputs = {};
export type Order_To_Cash_Q_Items_NoInputs = {};
export type Order_To_Cash_Q_Items_YesInputs = {};
export type Order_To_Cash_Q_PricesInputs = {};
export type Order_To_Cash_Q_Prices_NoInputs = {};
export type Order_To_Cash_Q_Prices_YesInputs = {};
export type Order_To_Cash_Q_TermsInputs = {};
export type Order_To_Cash_Q_Terms_NoInputs = {};
export type Order_To_Cash_Q_Terms_YesInputs = {};
export type Order_To_Cash_Read_NoteInputs = {};
export type Order_To_Cash_Reason_HintInputs = { line: NonNullable<unknown>, description: NonNullable<unknown> };
export type Order_To_Cash_Reason_LabelInputs = {};
export type Order_To_Cash_Reason_PlaceholderInputs = {};
export type Order_To_Cash_ReceiptInputs = {};
export type Order_To_Cash_Receipt_PendingInputs = {};
export type Order_To_Cash_Recheck_ConfirmInputs = {};
export type Order_To_Cash_Recheck_DoneInputs = { supplier: NonNullable<unknown> };
export type Order_To_Cash_Recheck_NoteInputs = { number: NonNullable<unknown>, supplier: NonNullable<unknown> };
export type Order_To_Cash_Recheck_TitleInputs = { number: NonNullable<unknown> };
export type Order_To_Cash_Record_AmendmentInputs = {};
export type Order_To_Cash_Replan_HeadingInputs = { owner: NonNullable<unknown> };
export type Order_To_Cash_Replan_TextInputs = { at: NonNullable<unknown>, text: NonNullable<unknown> };
export type Order_To_Cash_Rerun_Po_CheckInputs = {};
export type Order_To_Cash_Resolution_EvidenceInputs = { resolution: NonNullable<unknown> };
export type Order_To_Cash_Result_AmendmentInputs = {};
export type Order_To_Cash_Result_MatchInputs = {};
export type Order_To_Cash_Result_MismatchInputs = {};
export type Order_To_Cash_Sales_Order_ConfirmedInputs = {};
export type Order_To_Cash_Sample_FromInputs = {};
export type Order_To_Cash_Sample_NoteInputs = { number: NonNullable<unknown> };
export type Order_To_Cash_Sample_ReInputs = { number: NonNullable<unknown>, line: NonNullable<unknown> };
export type Order_To_Cash_Sample_ReceivedInputs = { signedBy: NonNullable<unknown> };
export type Order_To_Cash_Sample_ScanInputs = {};
export type Order_To_Cash_Share_ConfirmedInputs = {};
export type Order_To_Cash_Share_MatchedInputs = { count: NonNullable<unknown> };
export type Order_To_Cash_Share_Of_Units_OrderedInputs = {};
export type Order_To_Cash_ShortagesInputs = {};
export type Order_To_Cash_Shortages_HintInputs = {};
export type Order_To_Cash_Shortages_LabelInputs = {};
export type Order_To_Cash_Shortfall_BackorderInputs = { changes: NonNullable<unknown> };
export type Order_To_Cash_Signed_By_AtInputs = { by: NonNullable<unknown>, at: NonNullable<unknown> };
export type Order_To_Cash_Signed_By_At_ProofInputs = { by: NonNullable<unknown>, at: NonNullable<unknown> };
export type Order_To_Cash_Signed_By_DefaultInputs = { vessel: NonNullable<unknown> };
export type Order_To_Cash_Signed_By_VesselInputs = {};
export type Order_To_Cash_Truck_StaffInputs = {};
export type Order_To_Cash_UndecidedInputs = {};
export type Order_To_Cash_Units_Across_ReceiptsInputs = {};
export type Order_To_Cash_VesselInputs = {};
export type Order_To_Cash_Vessel_EtaInputs = {};
export type Order_To_Cash_Waiting_Customer_OrderInputs = {};
export type Order_To_Cash_X_DateInputs = {};
export type Order_To_Cash_X_RemarksInputs = {};
export type Order_To_Cash_X_Signed_ByInputs = {};
export type Order_To_Cash_X_VesselInputs = {};
export type Page_Approval_Rules_ApprovedInputs = {};
export type Page_Approval_Rules_HalfwayInputs = {};
export type Page_Approval_Rules_RejectedInputs = {};
export type Page_Approval_Rules_Requests_TitleInputs = {};
export type Page_Approval_Rules_Two_PersonInputs = {};
export type Page_Approval_Rules_WaitingInputs = {};
export type Page_Approval_Rules_Waiting_TitleInputs = {};
export type Page_Approvals_AllInputs = {};
export type Page_Approvals_By_KindInputs = {};
export type Page_Approvals_DecidedInputs = {};
export type Page_Approvals_EyebrowInputs = {};
export type Page_Approvals_Finance_CeoInputs = {};
export type Page_Approvals_HeadingInputs = {};
export type Page_Approvals_Kept_For_AuditInputs = {};
export type Page_Approvals_Listed_ApproverInputs = {};
export type Page_Approvals_Others_EmptyInputs = {};
export type Page_Approvals_Others_SubheadInputs = {};
export type Page_Approvals_Recent_EmptyInputs = {};
export type Page_Approvals_Recent_SubheadInputs = {};
export type Page_Approvals_Recent_TitleInputs = {};
export type Page_Approvals_RulesInputs = {};
export type Page_Approvals_See_Not_DecideInputs = {};
export type Page_Approvals_SubtitleInputs = {};
export type Page_Approvals_Two_PersonInputs = {};
export type Page_Approvals_Waiting_For_OthersInputs = {};
export type Page_Approvals_Waiting_For_YouInputs = {};
export type Page_Approvals_Yours_EmptyInputs = {};
export type Page_Approvals_Yours_SubheadInputs = {};
export type Page_Aside_Awaiting_CustomerInputs = {};
export type Page_Aside_Awaiting_Customer_NoteInputs = {};
export type Page_Aside_Awaiting_SupplierInputs = {};
export type Page_Aside_Awaiting_Supplier_NoteInputs = {};
export type Page_Aside_BillsInputs = {};
export type Page_Aside_Bills_NoteInputs = {};
export type Page_Aside_Bills_On_HoldInputs = {};
export type Page_Aside_Bills_On_Hold_NoteInputs = {};
export type Page_Aside_DeliveriesInputs = {};
export type Page_Aside_Deliveries_NoteInputs = {};
export type Page_Aside_Draft_QuotesInputs = {};
export type Page_Aside_Draft_Quotes_NoteInputs = {};
export type Page_Aside_ExceptionsInputs = {};
export type Page_Aside_Exceptions_NoteInputs = {};
export type Page_Aside_Follow_UpsInputs = {};
export type Page_Aside_Follow_Ups_NoteInputs = {};
export type Page_Aside_HeldInputs = {};
export type Page_Aside_Held_NoteInputs = {};
export type Page_Aside_InboxInputs = {};
export type Page_Aside_Inbox_NoteInputs = {};
export type Page_Aside_Live_CasesInputs = {};
export type Page_Aside_Live_Cases_NoteInputs = {};
export type Page_Aside_My_DecisionsInputs = {};
export type Page_Aside_My_Decisions_NoteInputs = {};
export type Page_Aside_My_Live_CasesInputs = {};
export type Page_Aside_My_Live_Cases_NoteInputs = {};
export type Page_Aside_My_TasksInputs = {};
export type Page_Aside_My_Tasks_NoteInputs = {};
export type Page_Aside_OverdueInputs = {};
export type Page_Aside_Overdue_NoteInputs = {};
export type Page_Aside_PipelineInputs = {};
export type Page_Aside_Pipeline_NoteInputs = {};
export type Page_Aside_Rfqs_WaitingInputs = {};
export type Page_Aside_Rfqs_Waiting_NoteInputs = {};
export type Page_Aside_To_CollectInputs = {};
export type Page_Aside_To_Collect_NoteInputs = {};
export type Page_Aside_Your_DeskInputs = {};
export type Page_Automations_Activity_LogInputs = {};
export type Page_Automations_Ai_Log_SubheadInputs = {};
export type Page_Automations_Ai_Log_TitleInputs = {};
export type Page_Automations_All_ExceptionsInputs = {};
export type Page_Automations_Audit_SubheadInputs = {};
export type Page_Automations_Audit_TitleInputs = {};
export type Page_Automations_Auto_ResolvedInputs = {};
export type Page_Automations_AutomaticInputs = {};
export type Page_Automations_By_PeopleInputs = {};
export type Page_Automations_Duplicates_CaughtInputs = {};
export type Page_Automations_EyebrowInputs = {};
export type Page_Automations_HeadingInputs = {};
export type Page_Automations_Nothing_SilentInputs = {};
export type Page_Automations_Open_ExceptionsInputs = {};
export type Page_Automations_Owner_DueInputs = {};
export type Page_Automations_Queue_SubheadInputs = {};
export type Page_Automations_Queue_TitleInputs = {};
export type Page_Automations_Registry_SubheadInputs = {};
export type Page_Automations_Registry_TitleInputs = {};
export type Page_Automations_Review_QueueInputs = {};
export type Page_Automations_RuleInputs = {};
export type Page_Automations_SubtitleInputs = {};
export type Page_Automations_WhatInputs = {};
export type Page_Automations_What_HappenedInputs = {};
export type Page_Automations_What_It_ReadInputs = {};
export type Page_Automations_WhenInputs = {};
export type Page_Automations_WhoInputs = {};
export type Page_Cash_Ageing_SubheadInputs = {};
export type Page_Cash_Ageing_TitleInputs = {};
export type Page_Cash_All_InvoicesInputs = {};
export type Page_Cash_Approvals_QueueInputs = {};
export type Page_Cash_Bank_Change_SubheadInputs = {};
export type Page_Cash_Bills_By_DueInputs = {};
export type Page_Cash_Buckets_TitleInputs = {};
export type Page_Cash_Collections_SubheadInputs = {};
export type Page_Cash_Collections_TitleInputs = {};
export type Page_Cash_Due_MonthInputs = {};
export type Page_Cash_E_InvoiceInputs = {};
export type Page_Cash_EyebrowInputs = { day: NonNullable<unknown> };
export type Page_Cash_Fd_Or_CeoInputs = {};
export type Page_Cash_HeadingInputs = {};
export type Page_Cash_In_OutInputs = {};
export type Page_Cash_In_Out_SubheadInputs = {};
export type Page_Cash_Next_WeeksInputs = {};
export type Page_Cash_No_Bank_ChangesInputs = {};
export type Page_Cash_No_Bank_RequestInputs = {};
export type Page_Cash_No_Open_InvoicesInputs = {};
export type Page_Cash_No_PaymentsInputs = {};
export type Page_Cash_No_ReceivablesInputs = {};
export type Page_Cash_Nothing_OwedInputs = {};
export type Page_Cash_Open_InvoicesInputs = {};
export type Page_Cash_OverdueInputs = {};
export type Page_Cash_Overdue_NoteInputs = {};
export type Page_Cash_PayablesInputs = {};
export type Page_Cash_Payables_NoteInputs = {};
export type Page_Cash_Payables_SubheadInputs = {};
export type Page_Cash_Payables_TitleInputs = {};
export type Page_Cash_Payments_SubheadInputs = {};
export type Page_Cash_Payments_TitleInputs = {};
export type Page_Cash_Payments_To_ApproveInputs = {};
export type Page_Cash_ReceivablesInputs = {};
export type Page_Cash_Receivables_NoteInputs = {};
export type Page_Cash_RemittanceInputs = {};
export type Page_Cash_Requested_ChangeInputs = { supplier: NonNullable<unknown> };
export type Page_Cash_SubtitleInputs = {};
export type Page_Cash_Supplier_BalancesInputs = {};
export type Page_Cash_Who_OwesInputs = {};
export type Page_Compare_Check_TitleInputs = { line: NonNullable<unknown>, description: NonNullable<unknown> };
export type Page_Compare_Correction_TitleInputs = { supplier: NonNullable<unknown>, version: NonNullable<unknown> };
export type Page_Compare_DeniedInputs = {};
export type Page_Compare_How_TitleInputs = {};
export type Page_Compare_Line_TitleInputs = { line: NonNullable<unknown>, description: NonNullable<unknown> };
export type Page_Compare_Next_StepInputs = {};
export type Page_Compare_No_CorrectionsInputs = {};
export type Page_Compare_No_LinesInputs = {};
export type Page_Compare_No_More_ChecksInputs = {};
export type Page_Compare_No_More_LinesInputs = {};
export type Page_Compare_No_WaitingInputs = {};
export type Page_Compare_Others_TitleInputs = { line: NonNullable<unknown>, description: NonNullable<unknown> };
export type Page_Delivery_Amount_VatInputs = {};
export type Page_Delivery_Backorders_SubheadInputs = {};
export type Page_Delivery_Backorders_TitleInputs = {};
export type Page_Delivery_BalanceInputs = {};
export type Page_Delivery_Balance_NoteInputs = {};
export type Page_Delivery_Check_SubheadInputs = {};
export type Page_Delivery_Check_TitleInputs = {};
export type Page_Delivery_Drops_SubheadInputs = {};
export type Page_Delivery_Drops_TitleInputs = {};
export type Page_Delivery_InvoiceInputs = {};
export type Page_Delivery_InvoicedInputs = {};
export type Page_Delivery_Invoiced_NoteInputs = {};
export type Page_Delivery_Invoices_SubheadInputs = {};
export type Page_Delivery_Invoices_TitleInputs = {};
export type Page_Delivery_No_BackordersInputs = {};
export type Page_Delivery_No_DispatchInputs = {};
export type Page_Delivery_No_DropsInputs = {};
export type Page_Delivery_No_InvoiceInputs = {};
export type Page_Delivery_No_InvoicesInputs = {};
export type Page_Delivery_Paid_BalanceInputs = {};
export type Page_Delivery_Plan_TitleInputs = {};
export type Page_Delivery_ReceivedInputs = {};
export type Page_Delivery_Received_NoteInputs = {};
export type Page_Delivery_ShortInputs = {};
export type Page_Growth_AddInputs = {};
export type Page_Growth_CampaignInputs = {};
export type Page_Growth_CampaignsInputs = {};
export type Page_Growth_Campaigns_Can_SendInputs = {};
export type Page_Growth_Campaigns_Cannot_SendInputs = {};
export type Page_Growth_ContentInputs = {};
export type Page_Growth_DocumentsInputs = {};
export type Page_Growth_EyebrowInputs = {};
export type Page_Growth_FleetsInputs = {};
export type Page_Growth_FunnelInputs = {};
export type Page_Growth_Funnel_SubheadInputs = {};
export type Page_Growth_HeadingInputs = {};
export type Page_Growth_NextInputs = {};
export type Page_Growth_Next_StepsInputs = {};
export type Page_Growth_Next_Steps_SubheadInputs = {};
export type Page_Growth_No_StepInputs = {};
export type Page_Growth_No_Step_NoteInputs = {};
export type Page_Growth_OpenInputs = {};
export type Page_Growth_Open_NoteInputs = {};
export type Page_Growth_PipelineInputs = {};
export type Page_Growth_RegistrationsInputs = {};
export type Page_Growth_Registrations_GlanceInputs = {};
export type Page_Growth_Registrations_NoteInputs = {};
export type Page_Growth_SourcesInputs = {};
export type Page_Growth_Stage_ActiveInputs = {};
export type Page_Growth_Stage_ApprovedInputs = {};
export type Page_Growth_Stage_First_RfqInputs = {};
export type Page_Growth_Stage_IntroducedInputs = {};
export type Page_Growth_Stage_ProspectInputs = {};
export type Page_Growth_Stage_RegistrationInputs = {};
export type Page_Growth_SubtitleInputs = {};
export type Page_Growth_This_WeekInputs = {};
export type Page_Growth_This_Week_NoteInputs = {};
export type Page_Growth_Vendor_SubheadInputs = {};
export type Page_Growth_Vendor_TitleInputs = {};
export type Page_Growth_VesselsInputs = {};
export type Page_Growth_Vessels_SubheadInputs = {};
export type Page_History_CustomersInputs = {};
export type Page_History_DedupInputs = {};
export type Page_History_MailboxesInputs = {};
export type Page_History_No_CustomersInputs = {};
export type Page_History_No_PricesInputs = {};
export type Page_History_No_SuppliersInputs = {};
export type Page_History_No_VesselsInputs = {};
export type Page_History_Not_OrganisedInputs = {};
export type Page_History_Organise_ApproveInputs = {};
export type Page_History_Per_YearInputs = {};
export type Page_History_PricesInputs = {};
export type Page_History_ProgressInputs = {};
export type Page_History_SuppliersInputs = {};
export type Page_History_Uncertain_EmptyInputs = {};
export type Page_History_Uncertain_SubheadInputs = {};
export type Page_History_Uncertain_TitleInputs = {};
export type Page_History_VesselsInputs = {};
export type Page_Home_All_LiveInputs = {};
export type Page_Home_All_Live_SubheadInputs = {};
export type Page_Home_Bills_MatchInputs = {};
export type Page_Home_Bills_Match_NoteInputs = {};
export type Page_Home_BriefingInputs = {};
export type Page_Home_By_RiskInputs = {};
export type Page_Home_Customer_VesselInputs = {};
export type Page_Home_DeadlinesInputs = {};
export type Page_Home_Deadlines_SubheadInputs = {};
export type Page_Home_Decisions_NoteInputs = {};
export type Page_Home_Decisions_WaitingInputs = {};
export type Page_Home_Desk_CasesInputs = {};
export type Page_Home_Desk_Cases_SubheadInputs = {};
export type Page_Home_Desk_Queue_SubheadInputs = {};
export type Page_Home_Due_TodayInputs = {};
export type Page_Home_Due_Today_NoteInputs = {};
export type Page_Home_ExceptionsInputs = {};
export type Page_Home_Exceptions_NoteInputs = {};
export type Page_Home_Follow_Ups_SubheadInputs = {};
export type Page_Home_Follow_Ups_TitleInputs = {};
export type Page_Home_Inbox_NoteInputs = {};
export type Page_Home_Inbox_SubheadInputs = {};
export type Page_Home_Inbox_TriageInputs = {};
export type Page_Home_LinesInputs = {};
export type Page_Home_My_DeadlinesInputs = {};
export type Page_Home_My_Deadlines_SubheadInputs = {};
export type Page_Home_My_Live_CasesInputs = {};
export type Page_Home_My_Live_Cases_NoteInputs = {};
export type Page_Home_My_QueueInputs = {};
export type Page_Home_My_Queue_SubheadInputs = {};
export type Page_Home_Next_BlockerInputs = {};
export type Page_Home_Next_UpInputs = {};
export type Page_Home_No_ChartInputs = {};
export type Page_Home_No_Follow_UpsInputs = {};
export type Page_Home_No_Live_CasesInputs = {};
export type Page_Home_Nothing_MorningInputs = {};
export type Page_Home_Nothing_This_WeekInputs = {};
export type Page_Home_Open_TasksInputs = {};
export type Page_Home_PipelineInputs = {};
export type Page_Home_Pipeline_SubheadInputs = {};
export type Page_Home_Quote_DeadlinesInputs = {};
export type Page_Home_TargetsInputs = {};
export type Page_Home_This_MonthInputs = {};
export type Page_Home_This_MorningInputs = {};
export type Page_Home_This_WeekInputs = {};
export type Page_Home_To_CollectInputs = {};
export type Page_Home_To_Collect_NoteInputs = {};
export type Page_Home_TurnaroundInputs = {};
export type Page_Home_Win_RateInputs = {};
export type Page_Home_Your_DecisionInputs = {};
export type Page_Home_Your_Decision_SubheadInputs = {};
export type Page_Inbox_AckInputs = {};
export type Page_Inbox_AssignmentInputs = {};
export type Page_Inbox_ChannelsInputs = {};
export type Page_Inbox_Draft_CaseInputs = {};
export type Page_Inbox_Draft_LinesInputs = {};
export type Page_Inbox_EyebrowInputs = {};
export type Page_Inbox_HeadingInputs = {};
export type Page_Inbox_Match_EmptyInputs = {};
export type Page_Inbox_Match_SubheadInputs = {};
export type Page_Inbox_Match_TitleInputs = {};
export type Page_Inbox_MessagesInputs = {};
export type Page_Inbox_MissingInputs = {};
export type Page_Inbox_Next_StepInputs = {};
export type Page_Inbox_No_AckInputs = {};
export type Page_Inbox_No_Ack_DescriptionInputs = {};
export type Page_Inbox_No_DraftInputs = {};
export type Page_Inbox_No_Draft_DescriptionInputs = {};
export type Page_Inbox_No_Draft_LinesInputs = {};
export type Page_Inbox_No_Match_FilterInputs = {};
export type Page_Inbox_No_MessageInputs = {};
export type Page_Inbox_No_Next_StepInputs = {};
export type Page_Inbox_No_OwnerInputs = {};
export type Page_Inbox_No_Owner_DescriptionInputs = {};
export type Page_Inbox_No_TextInputs = {};
export type Page_Inbox_No_Warnings_TextInputs = {};
export type Page_Inbox_Nothing_ClarifyInputs = {};
export type Page_Inbox_Offer_DetailsInputs = {};
export type Page_Inbox_OriginalInputs = {};
export type Page_Inbox_Original_SubheadInputs = {};
export type Page_Inbox_Pick_MessageInputs = {};
export type Page_Inbox_Review_EmptyInputs = {};
export type Page_Inbox_Review_SubheadInputs = {};
export type Page_Inbox_Review_TitleInputs = {};
export type Page_Inbox_SubtitleInputs = {};
export type Page_Inbox_WarningsInputs = {};
export type Page_Inbox_What_IsInputs = {};
export type Page_Integrations_AckInputs = {};
export type Page_Integrations_BackupsInputs = {};
export type Page_Integrations_ChannelsInputs = {};
export type Page_Integrations_Channels_SubheadInputs = {};
export type Page_Integrations_EditInputs = {};
export type Page_Integrations_Exception_QueueInputs = {};
export type Page_Integrations_EyebrowInputs = {};
export type Page_Integrations_HeadingInputs = {};
export type Page_Integrations_HistoryInputs = {};
export type Page_Integrations_History_SubheadInputs = {};
export type Page_Integrations_ImportedInputs = {};
export type Page_Integrations_LanguageInputs = {};
export type Page_Integrations_MailboxInputs = {};
export type Page_Integrations_MailboxesInputs = {};
export type Page_Integrations_Mailboxes_SubheadInputs = {};
export type Page_Integrations_MigrationInputs = {};
export type Page_Integrations_Odoo_SubheadInputs = {};
export type Page_Integrations_Odoo_TitleInputs = {};
export type Page_Integrations_SubtitleInputs = {};
export type Page_Integrations_TokenInputs = {};
export type Page_Order_Ai_Check_TitleInputs = {};
export type Page_Order_Amendment_HeaderInputs = {};
export type Page_Order_Amendment_LineInputs = { line: NonNullable<unknown> };
export type Page_Order_AmountInputs = {};
export type Page_Order_BackorderInputs = {};
export type Page_Order_BillInputs = {};
export type Page_Order_Bills_SubheadInputs = {};
export type Page_Order_Bills_TitleInputs = {};
export type Page_Order_DueInputs = {};
export type Page_Order_Lot_ExpiryInputs = {};
export type Page_Order_No_BillsInputs = {};
export type Page_Order_No_ConfirmInputs = {};
export type Page_Order_No_MismatchInputs = {};
export type Page_Order_No_PartialInputs = {};
export type Page_Order_No_PoInputs = {};
export type Page_Order_No_PosInputs = {};
export type Page_Order_No_ReceiptsInputs = {};
export type Page_Order_Partial_TitleInputs = {};
export type Page_Order_PoInputs = {};
export type Page_Order_Po_Check_SubheadInputs = {};
export type Page_Order_Po_Check_TitleInputs = {};
export type Page_Order_Pos_SubheadInputs = {};
export type Page_Order_Pos_TitleInputs = {};
export type Page_Order_Receipts_SubheadInputs = {};
export type Page_Order_Receipts_TitleInputs = {};
export type Page_Overview_After_OrderInputs = {};
export type Page_Overview_Clarifications_SubheadInputs = {};
export type Page_Overview_Clarifications_TitleInputs = {};
export type Page_Overview_Contact_RuleInputs = {};
export type Page_Overview_Handover_TitleInputs = {};
export type Page_Overview_Lifecycle_SubheadInputs = {};
export type Page_Overview_Lifecycle_TitleInputs = {};
export type Page_Overview_LineInputs = {};
export type Page_Overview_Line_ProgressInputs = {};
export type Page_Overview_Line_Progress_SubheadInputs = {};
export type Page_Overview_Line_StatusInputs = {};
export type Page_Overview_Next_ActionInputs = {};
export type Page_Overview_No_ClarificationsInputs = {};
export type Page_Overview_No_HandoverInputs = {};
export type Page_Overview_No_LinesInputs = {};
export type Page_Overview_Nothing_OrderedInputs = {};
export type Page_Overview_Open_TasksInputs = {};
export type Page_Overview_Owner_BackupInputs = {};
export type Page_Overview_SummaryInputs = {};
export type Page_Overview_Timeline_SubheadInputs = {};
export type Page_Overview_Timeline_TitleInputs = {};
export type Page_Overview_To_ViaInputs = {};
export type Page_Pricing_ApprovalInputs = {};
export type Page_Pricing_Build_UpInputs = {};
export type Page_Pricing_Build_Up_SubheadInputs = {};
export type Page_Pricing_HiddenInputs = {};
export type Page_Pricing_How_BuiltInputs = {};
export type Page_Pricing_LeversInputs = {};
export type Page_Pricing_LinesInputs = {};
export type Page_Pricing_Margin_Vs_PolicyInputs = {};
export type Page_Pricing_Not_PricedInputs = {};
export type Page_Pricing_Not_Priced_DescriptionInputs = {};
export type Page_Pricing_Policy_ChecksInputs = {};
export type Page_Pricing_Shared_ChargesInputs = {};
export type Page_Pricing_What_IfInputs = {};
export type Page_Profit_ClaimsInputs = {};
export type Page_Profit_Close_ChecklistInputs = {};
export type Page_Profit_Close_ProgressInputs = {};
export type Page_Profit_Cost_TitleInputs = {};
export type Page_Profit_DamageInputs = {};
export type Page_Profit_DeniedInputs = {};
export type Page_Profit_FxInputs = {};
export type Page_Profit_No_ClaimsInputs = {};
export type Page_Profit_No_Cost_SheetInputs = {};
export type Page_Profit_No_Cost_Sheet_DescriptionInputs = {};
export type Page_Profit_No_DeliveryInputs = {};
export type Page_Profit_No_ReceiptsInputs = {};
export type Page_Project_AcceptanceInputs = {};
export type Page_Project_BriefInputs = {};
export type Page_Project_CalendarInputs = {};
export type Page_Project_Every_PhaseInputs = {};
export type Page_Project_EyebrowInputs = {};
export type Page_Project_FollowInputs = {};
export type Page_Project_HeadingInputs = {};
export type Page_Project_MilestonesInputs = {};
export type Page_Project_MonthlyInputs = {};
export type Page_Project_No_PhaseInputs = {};
export type Page_Project_PassingInputs = {};
export type Page_Project_PaymentInputs = {};
export type Page_Project_ProblemsInputs = {};
export type Page_Project_RoadmapInputs = {};
export type Page_Project_StartInputs = {};
export type Page_Project_SubtitleInputs = {};
export type Page_Project_TrustInputs = {};
export type Page_Project_WeeksInputs = {};
export type Page_Quote_ApprovalsInputs = {};
export type Page_Quote_CopyInputs = {};
export type Page_Quote_Copy_SubheadInputs = {};
export type Page_Quote_DecisionInputs = {};
export type Page_Quote_InternalInputs = {};
export type Page_Quote_No_PortalInputs = {};
export type Page_Quote_No_Portal_DescriptionInputs = {};
export type Page_Quote_No_VersionsInputs = {};
export type Page_Quote_PortalInputs = {};
export type Page_Quote_VersionsInputs = {};
export type Page_Records_Activity_By_KindInputs = {};
export type Page_Records_Activity_Per_DayInputs = {};
export type Page_Records_Ai_Calls_By_TaskInputs = {};
export type Page_Records_Available_By_ProductInputs = {};
export type Page_Records_Balance_By_AgeInputs = {};
export type Page_Records_Balance_By_CustomerInputs = {};
export type Page_Records_Bills_Due_By_WeekInputs = {};
export type Page_Records_By_SegmentInputs = {};
export type Page_Records_Case_Value_By_CustomerInputs = {};
export type Page_Records_Cases_By_StageInputs = {};
export type Page_Records_Cases_Per_OwnerInputs = {};
export type Page_Records_Contact_RulesInputs = {};
export type Page_Records_Customer_Pos_Per_WeekInputs = {};
export type Page_Records_Customers_By_TypeInputs = {};
export type Page_Records_Decisions_By_KindInputs = {};
export type Page_Records_Deliveries_By_StatusInputs = {};
export type Page_Records_Deliveries_Per_CaseInputs = {};
export type Page_Records_Exceptions_By_SourceInputs = {};
export type Page_Records_Message_SourcesInputs = {};
export type Page_Records_Messages_Per_DayInputs = {};
export type Page_Records_Money_In_OutInputs = {};
export type Page_Records_Offers_By_ComplianceInputs = {};
export type Page_Records_Offers_Per_SupplierInputs = {};
export type Page_Records_Order_Value_By_SupplierInputs = {};
export type Page_Records_Orders_By_SupplierInputs = {};
export type Page_Records_Payments_Per_WeekInputs = {};
export type Page_Records_Pricelists_Per_PrincipalInputs = {};
export type Page_Records_Prices_Per_SupplierInputs = {};
export type Page_Records_Products_By_StoreInputs = {};
export type Page_Records_Prospect_SourcesInputs = {};
export type Page_Records_Quoted_Value_By_StatusInputs = {};
export type Page_Records_Receipts_By_WarehouseInputs = {};
export type Page_Records_Requests_Per_SupplierInputs = {};
export type Page_Records_Stock_By_ProductInputs = {};
export type Page_Records_Supplier_KindsInputs = {};
export type Page_Records_Suppliers_By_CountryInputs = {};
export type Page_Records_Tasks_By_TypeInputs = {};
export type Page_Records_Team_By_RoleInputs = {};
export type Page_Records_Units_By_WarehouseInputs = {};
export type Page_Records_Vessels_By_TypeInputs = {};
export type Page_Records_Vessels_Per_CustomerInputs = {};
export type Page_Records_Who_Owes_UsInputs = {};
export type Page_Rfqs_Arrivals_TitleInputs = {};
export type Page_Rfqs_ClosedInputs = {};
export type Page_Rfqs_Closed_NoteInputs = {};
export type Page_Rfqs_Draft_TitleInputs = {};
export type Page_Rfqs_Drafted_TitleInputs = {};
export type Page_Rfqs_From_OneInputs = {};
export type Page_Rfqs_LinesInputs = {};
export type Page_Rfqs_List_EmptyInputs = {};
export type Page_Rfqs_List_SubheadInputs = {};
export type Page_Rfqs_Matched_SubheadInputs = {};
export type Page_Rfqs_Matched_TitleInputs = {};
export type Page_Rfqs_No_DraftsInputs = {};
export type Page_Rfqs_No_Drafts_DescriptionInputs = {};
export type Page_Rfqs_No_New_SuppliersInputs = {};
export type Page_Rfqs_No_PreviewsInputs = {};
export type Page_Rfqs_No_RepliesInputs = {};
export type Page_Rfqs_None_ChasedInputs = {};
export type Page_Rfqs_Reminders_TitleInputs = {};
export type Page_Rfqs_RepliedInputs = {};
export type Page_Rfqs_Replied_NoteInputs = {};
export type Page_Rfqs_Review_EmptyInputs = {};
export type Page_Rfqs_Review_SubheadInputs = {};
export type Page_Rfqs_Review_TitleInputs = {};
export type Page_Rfqs_Sent_DueInputs = {};
export type Page_Rfqs_Supplier_RfqsInputs = {};
export type Page_Rfqs_WaitingInputs = {};
export type Page_Rfqs_Waiting_NoteInputs = {};
export type Page_Roles_AlertedInputs = {};
export type Page_Roles_Approval_RulesInputs = {};
export type Page_Roles_EnforcedInputs = {};
export type Page_Roles_EyebrowInputs = {};
export type Page_Roles_HeadingInputs = {};
export type Page_Roles_MatrixInputs = {};
export type Page_Roles_Matrix_SubheadInputs = {};
export type Page_Roles_No_AlertInputs = {};
export type Page_Roles_No_Alert_DescriptionInputs = {};
export type Page_Roles_PeopleInputs = {};
export type Page_Roles_RoleInputs = {};
export type Page_Roles_RosterInputs = {};
export type Page_Roles_Roster_SubheadInputs = {};
export type Page_Roles_RoutingInputs = {};
export type Page_Roles_SubtitleInputs = {};
export type Page_Roles_WhereInputs = {};
export type Page_Room_AckInputs = {};
export type Page_Room_AskInputs = {};
export type Page_Room_BriefingInputs = {};
export type Page_Room_DeliveriesInputs = {};
export type Page_Room_Fast_LateInputs = {};
export type Page_Room_FunnelInputs = {};
export type Page_Room_Gp_BridgeInputs = {};
export type Page_Room_InquiriesInputs = {};
export type Page_Room_Live_CasesInputs = {};
export type Page_Room_LostInputs = {};
export type Page_Room_No_GpInputs = {};
export type Page_Room_No_RankingInputs = {};
export type Page_Room_No_ReceivablesInputs = {};
export type Page_Room_No_TrendInputs = {};
export type Page_Room_OntimeInputs = {};
export type Page_Room_Ontime_SubheadInputs = {};
export type Page_Room_Per_OwnerInputs = {};
export type Page_Room_Per_Owner_SubheadInputs = {};
export type Page_Room_Profit_CashInputs = {};
export type Page_Room_QuadrantInputs = {};
export type Page_Room_Quadrant_SubheadInputs = {};
export type Page_Room_Receivables_AgeInputs = {};
export type Page_Room_Receivables_CustomerInputs = {};
export type Page_Room_Reliable_FastInputs = {};
export type Page_Room_Reliable_SlowInputs = {};
export type Page_Room_Slow_LateInputs = {};
export type Page_Room_TargetsInputs = {};
export type Page_Room_TurnaroundInputs = {};
export type Page_Room_WaitsInputs = {};
export type Page_Sourcing_DescriptionInputs = {};
export type Page_Sourcing_EyebrowInputs = {};
export type Page_Sourcing_HeadingInputs = {};
export type Page_Sourcing_Messages_SubheadInputs = {};
export type Page_Sourcing_Messages_TitleInputs = {};
export type Page_Sourcing_NavInputs = {};
export type Page_Sourcing_Offers_SubheadInputs = {};
export type Page_Sourcing_Offers_TitleInputs = {};
export type Page_Sourcing_Rfqs_TitleInputs = {};
export type Page_Sourcing_SubtitleInputs = {};
export type Page_Usage_Against_PlanInputs = {};
export type Page_Usage_Ai_CallsInputs = {};
export type Page_Usage_Ai_LogInputs = {};
export type Page_Usage_Changes_SubheadInputs = {};
export type Page_Usage_Changes_TitleInputs = {};
export type Page_Usage_Edit_PlanInputs = {};
export type Page_Usage_EyebrowInputs = {};
export type Page_Usage_HeadingInputs = {};
export type Page_Usage_SubtitleInputs = {};
export type Page_Usage_Support_SubheadInputs = {};
export type Page_Usage_Support_TitleInputs = {};
export type Page_Value_EyebrowInputs = {};
export type Page_Value_HeadingInputs = {};
export type Page_Value_PaybackInputs = {};
export type Page_Value_PlanInputs = {};
export type Page_Value_SubtitleInputs = {};
export type Page_Value_UsageInputs = {};
export type Profit_Actual_Against_ExpectedInputs = {};
export type Profit_Actual_FinalInputs = { pct: NonNullable<unknown> };
export type Profit_Actual_So_FarInputs = { pct: NonNullable<unknown>, count: NonNullable<unknown> };
export type Profit_At_QuotationInputs = {};
export type Profit_Check_DoneInputs = {};
export type Profit_Check_OpenInputs = {};
export type Profit_Checklist_NoteInputs = {};
export type Profit_Checks_Green_HeadingInputs = {};
export type Profit_Checks_Green_LabelInputs = {};
export type Profit_Checks_Green_TextInputs = {};
export type Profit_Checks_OpenInputs = { count: NonNullable<unknown> };
export type Profit_Checks_Open_TextInputs = {};
export type Profit_ClaimInputs = { amount: NonNullable<unknown>, against: NonNullable<unknown>, note: NonNullable<unknown> };
export type Profit_Claim_SettledInputs = { amount: NonNullable<unknown>, against: NonNullable<unknown>, note: NonNullable<unknown>, creditNote: NonNullable<unknown> };
export type Profit_Claims_EmptyInputs = {};
export type Profit_Closed_HeadingInputs = {};
export type Profit_Closed_TextInputs = {};
export type Profit_Closed_Text_AtInputs = { at: NonNullable<unknown> };
export type Profit_Col_ActualInputs = {};
export type Profit_Col_CostInputs = {};
export type Profit_Col_DifferenceInputs = {};
export type Profit_Col_ExpectedInputs = {};
export type Profit_Col_FxInputs = {};
export type Profit_Col_RateInputs = {};
export type Profit_Col_ReceiptInputs = {};
export type Profit_Col_StatusInputs = {};
export type Profit_Costs_NoteInputs = {};
export type Profit_Damage_Audio_PromptInputs = {};
export type Profit_Damage_Image_PromptInputs = {};
export type Profit_Damage_LabelInputs = {};
export type Profit_Date_TimeInputs = { date: NonNullable<unknown>, time: NonNullable<unknown> };
export type Profit_Done_OfInputs = { done: NonNullable<unknown>, total: NonNullable<unknown> };
export type Profit_Figure_ActualInputs = {};
export type Profit_Figure_DifferenceInputs = {};
export type Profit_Figure_ExpectedInputs = {};
export type Profit_Figure_FxInputs = {};
export type Profit_Fx_EmptyInputs = {};
export type Profit_Fx_Empty_EgpInputs = {};
export type Profit_Fx_NoteInputs = { quoted: NonNullable<unknown>, today: NonNullable<unknown>, currency: NonNullable<unknown> };
export type Profit_Fx_Table_NoteInputs = { rate: NonNullable<unknown>, currency: NonNullable<unknown>, expected: NonNullable<unknown>, actual: NonNullable<unknown> };
export type Profit_Green_OfInputs = { done: NonNullable<unknown>, total: NonNullable<unknown> };
export type Profit_Invoiced_EgpInputs = {};
export type Profit_MarginInputs = { pct: NonNullable<unknown> };
export type Profit_Margin_PointsInputs = { points: NonNullable<unknown> };
export type Profit_Not_Costed_HeadingInputs = {};
export type Profit_Not_Costed_TextInputs = { caseId: NonNullable<unknown>, stage: NonNullable<unknown> };
export type Profit_Of_ExpectedInputs = {};
export type Profit_Quoted_RateInputs = { rate: NonNullable<unknown> };
export type Profit_Rate_ChangeInputs = { from: NonNullable<unknown>, to: NonNullable<unknown> };
export type Profit_RealisedInputs = {};
export type Profit_State_ActualInputs = {};
export type Profit_State_BilledInputs = {};
export type Profit_State_EstimateInputs = {};
export type Profit_State_Not_ApplicableInputs = {};
export type Profit_Total_CostInputs = {};
export type Profit_UnrealisedInputs = {};
export type Project_Acceptance_NoteInputs = { at: NonNullable<unknown> };
export type Project_AnswerInputs = { answer: NonNullable<unknown> };
export type Project_Brief_NoteInputs = {};
export type Project_Col_CheckedInputs = {};
export type Project_Col_RequirementInputs = {};
export type Project_Col_ScenarioInputs = {};
export type Project_Col_StatusInputs = {};
export type Project_CoveredInputs = {};
export type Project_Covered_OfInputs = { done: NonNullable<unknown>, total: NonNullable<unknown> };
export type Project_Done_OfInputs = { done: NonNullable<unknown>, total: NonNullable<unknown> };
export type Project_Monthly_NoteInputs = {};
export type Project_Monthly_Note_LicencesInputs = {};
export type Project_OpenInputs = {};
export type Project_Open_In_DemoInputs = {};
export type Project_Pass_OfInputs = { done: NonNullable<unknown>, total: NonNullable<unknown> };
export type Project_PassingInputs = {};
export type Project_Payment_NoteInputs = {};
export type Project_PhaseInputs = {};
export type Project_Phase_NInputs = { n: NonNullable<unknown> };
export type Project_ProblemInputs = { n: NonNullable<unknown> };
export type Project_Roadmap_NoteInputs = {};
export type Project_Show_MeInputs = {};
export type Project_Tests_PassInputs = { count: NonNullable<unknown>, total: NonNullable<unknown> };
export type Project_WeekInputs = { n: NonNullable<unknown> };
export type Roles_After_HoursInputs = {};
export type Roles_Alert_SentInputs = { name: NonNullable<unknown> };
export type Roles_FailingInputs = {};
export type Roles_In_Hours_TextInputs = { reason: NonNullable<unknown> };
export type Roles_Office_HoursInputs = {};
export type Roles_Open_PricingInputs = {};
export type Roles_Preset_FridayInputs = {};
export type Roles_Preset_OfficeInputs = {};
export type Roles_Preset_SaturdayInputs = {};
export type Roles_Preset_SundayInputs = {};
export type Roles_Preset_TonightInputs = {};
export type Roles_Send_AlertInputs = {};
export type Roles_Simulator_ChoiceInputs = {};
export type Roles_Simulator_NoteInputs = {};
export type Roles_Step_BackupInputs = { minutes: NonNullable<unknown>, name: NonNullable<unknown> };
export type Roles_Step_NowInputs = { name: NonNullable<unknown> };
export type Roles_Step_SeniorInputs = { names: NonNullable<unknown> };
export type Roles_Try_ItInputs = {};
export type Roles_VerifiedInputs = {};
export type Service_At_Full_UseInputs = { full: NonNullable<unknown> };
export type Service_Calls_ShareInputs = { part: NonNullable<unknown>, calls: NonNullable<unknown> };
export type Service_CheckedInputs = {};
export type Service_Checked_NoteInputs = {};
export type Service_Documents_ShareInputs = { documents: NonNullable<unknown>, full: NonNullable<unknown> };
export type Service_Extra_OrdersInputs = {};
export type Service_Gross_MarginInputs = {};
export type Service_Hour_CostInputs = {};
export type Service_HoursInputs = { n: NonNullable<unknown>, hours: NonNullable<unknown> };
export type Service_Hours_Per_PersonInputs = {};
export type Service_Hours_SavedInputs = {};
export type Service_Hours_Saved_NoteInputs = { n: NonNullable<unknown>, minutes: NonNullable<unknown> };
export type Service_Margin_MonthInputs = {};
export type Service_Order_ValueInputs = {};
export type Service_PaybackInputs = {};
export type Service_Payback_NoteInputs = { documents: NonNullable<unknown>, hours: NonNullable<unknown> };
export type Service_PeopleInputs = {};
export type Service_Plan_NoteInputs = { month: NonNullable<unknown>, day: NonNullable<unknown>, days: NonNullable<unknown> };
export type Service_Replies_MatchedInputs = {};
export type Service_Replies_Matched_NoteInputs = {};
export type Service_Replies_ShareInputs = { automatic: NonNullable<unknown>, matched: NonNullable<unknown> };
export type Service_So_FarInputs = { used: NonNullable<unknown>, pace: NonNullable<unknown> };
export type Service_Time_MonthInputs = {};
export type Service_Value_MonthInputs = {};
export type Service_Value_YearInputs = {};
export type Service_WaitingInputs = {};
export type Service_Waiting_NoteInputs = {};
export type Sourcing_All_HeldInputs = {};
export type Sourcing_Client_RemovedInputs = {};
export type Sourcing_Discard_DraftsInputs = {};
export type Sourcing_DraftInputs = {};
export type Sourcing_Draft_RfqsInputs = {};
export type Sourcing_Draft_Rfqs_PromptInputs = {};
export type Sourcing_Drafts_DiscardedInputs = {};
export type Sourcing_FullInputs = {};
export type Sourcing_Full_NoteInputs = {};
export type Sourcing_Held_BackInputs = { lines: NonNullable<unknown> };
export type Sourcing_How_To_SendInputs = {};
export type Sourcing_Line_AskedInputs = { rfqs: NonNullable<unknown> };
export type Sourcing_Line_HeldInputs = { reason: NonNullable<unknown> };
export type Sourcing_Line_OffersInputs = { n: NonNullable<unknown>, count: NonNullable<unknown> };
export type Sourcing_LinesInputs = {};
export type Sourcing_New_Supplier_TagInputs = {};
export type Sourcing_Next_AtInputs = { at: NonNullable<unknown> };
export type Sourcing_No_Customer_FilesInputs = {};
export type Sourcing_No_LinesInputs = {};
export type Sourcing_No_One_ChasedInputs = {};
export type Sourcing_Not_NeededInputs = {};
export type Sourcing_Our_ReferenceInputs = {};
export type Sourcing_Outcome_DeclinedInputs = {};
export type Sourcing_Outcome_EscalatedInputs = {};
export type Sourcing_Outcome_New_SupplierInputs = {};
export type Sourcing_Outcome_ReminderInputs = {};
export type Sourcing_Outcome_RepliedInputs = {};
export type Sourcing_PriceInputs = { currency: NonNullable<unknown>, price: NonNullable<unknown>, per: NonNullable<unknown> };
export type Sourcing_Price_HiddenInputs = {};
export type Sourcing_Quoted_LineInputs = { description: NonNullable<unknown>, price: NonNullable<unknown>, quoted: NonNullable<unknown>, valid: NonNullable<unknown> };
export type Sourcing_Reminder_RuleInputs = { owner: NonNullable<unknown> };
export type Sourcing_RemoveInputs = {};
export type Sourcing_RemovedInputs = { reference: NonNullable<unknown> };
export type Sourcing_Saved_On_ReplyInputs = {};
export type Sourcing_Send_HeadingInputs = {};
export type Sourcing_Send_LabelInputs = {};
export type Sourcing_Send_NInputs = { n: NonNullable<unknown>, count: NonNullable<unknown> };
export type Sourcing_Send_TextInputs = { n: NonNullable<unknown>, count: NonNullable<unknown>, suppliers: NonNullable<unknown>, due: NonNullable<unknown> };
export type Sourcing_SentInputs = { n: NonNullable<unknown>, count: NonNullable<unknown> };
export type Sourcing_SkippedInputs = { list: NonNullable<unknown> };
export type Sourcing_SplitInputs = {};
export type Sourcing_Split_NoteInputs = {};
export type Sourcing_SubjectInputs = { subject: NonNullable<unknown> };
export type Sourcing_Supplier_RecordInputs = {};
export type Sourcing_System_ChoosesInputs = {};
export type Sourcing_Vessel_RemovedInputs = {};
export type Visuals_AckInputs = {};
export type Visuals_Ack_CaptionInputs = {};
export type Visuals_Customer_DiscountInputs = {};
export type Visuals_DaysInputs = { value: NonNullable<unknown> };
export type Visuals_DeadlinesInputs = {};
export type Visuals_DiscountInputs = {};
export type Visuals_Gp_BridgeInputs = {};
export type Visuals_Gp_Bridge_NoteInputs = {};
export type Visuals_Gross_ProfitInputs = {};
export type Visuals_MarginInputs = {};
export type Visuals_Margin_AfterInputs = {};
export type Visuals_Margin_BeforeInputs = {};
export type Visuals_Margin_CaptionInputs = { min: NonNullable<unknown>, target: NonNullable<unknown> };
export type Visuals_MinutesInputs = { value: NonNullable<unknown> };
export type Visuals_Policy_MaxInputs = { max: NonNullable<unknown> };
export type Visuals_Price_BuiltInputs = {};
export type Visuals_ProfitInputs = {};
export type Visuals_RateInputs = { currency: NonNullable<unknown> };
export type Visuals_ReceivablesInputs = {};
export type Visuals_Selling_PriceInputs = {};
export type Visuals_Selling_Price_InInputs = { currency: NonNullable<unknown> };
export type Visuals_Shared_ChargesInputs = {};
export type Visuals_Supplier_CostInputs = {};
export type Visuals_TargetInputs = { target: NonNullable<unknown> };
export type Visuals_Targets_NoteInputs = {};
export type Visuals_This_MonthInputs = {};
export type Visuals_TurnaroundInputs = {};
export type Visuals_Turnaround_CaptionInputs = {};
export type Visuals_Under_MinimumInputs = { min: NonNullable<unknown> };
export type Visuals_What_IfInputs = {};
export type Visuals_What_If_NoteInputs = {};
export type Visuals_Win_CaptionInputs = { target: NonNullable<unknown> };
export type Visuals_Win_RateInputs = {};
export {};
