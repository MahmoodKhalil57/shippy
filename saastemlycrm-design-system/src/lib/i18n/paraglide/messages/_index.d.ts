type __ParaglideMessageMetadata<Inputs, Options, Markup extends import("../runtime.js").MessageMarkupSchema> = import("../runtime.js").MessageMetadata<Inputs, Options, Markup>;
/**
* | output |
* | --- |
* | "Allow: {action}?" |
*
*/
export const agent_allow: ((inputs: Agent_AllowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_AllowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The helper wants to make this change for you." |
*
*/
export const agent_allow_description: ((inputs?: Agent_Allow_DescriptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Allow_DescriptionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Chrome's built-in model has too little room for the helper on this device." |
*
*/
export const agent_builtin_too_small: ((inputs?: Agent_Builtin_Too_SmallInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Builtin_Too_SmallInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Chrome's built-in model isn't available on this device (it needs about 22 GB of free disk space and a GPU with more than 4 GB of memory, or 16 GB of RAM)." |
*
*/
export const agent_builtin_unavailable: ((inputs?: Agent_Builtin_UnavailableInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Builtin_UnavailableInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "I couldn't finish that. Could you ask it another way, or narrower?" |
*
*/
export const agent_could_not_finish: ((inputs?: Agent_Could_Not_FinishInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Could_Not_FinishInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Decided to answer." |
*
*/
export const agent_decided_answer: ((inputs?: Agent_Decided_AnswerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Decided_AnswerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Answered without checking any records, so the answer comes from {tool} instead." |
*
*/
export const agent_decided_grounded: ((inputs: Agent_Decided_GroundedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Decided_GroundedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Decided to use **{tool}**." |
*
*/
export const agent_decided_tool: ((inputs: Agent_Decided_ToolInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Decided_ToolInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Decided to use {tools}." |
*
*/
export const agent_decided_tools: ((inputs: Agent_Decided_ToolsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Decided_ToolsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Details" |
*
*/
export const agent_details: ((inputs?: Agent_DetailsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_DetailsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Downloading the AI model (once per device)…" |
*
*/
export const agent_downloading: ((inputs?: Agent_DownloadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_DownloadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Downloading the AI model… {percent}" |
*
*/
export const agent_downloading_progress: ((inputs: Agent_Downloading_ProgressInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Downloading_ProgressInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "I see the screen you're on, find records, explain what's waiting for you, take you anywhere and, with your OK, do things for you." |
*
*/
export const agent_empty_body: ((inputs?: Agent_Empty_BodyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Empty_BodyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "How can I help?" |
*
*/
export const agent_empty_heading: ((inputs?: Agent_Empty_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Empty_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing matches \"{query}\"." |
*
*/
export const agent_find_nothing: ((inputs: Agent_Find_NothingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Find_NothingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "This browser doesn't have Chrome's on-device AI switched on. Download the model once (about 800 MB, kept by the browser — not in private windows) to use it h..." |
*
*/
export const agent_local_body: ((inputs?: Agent_Local_BodyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Local_BodyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Download the AI model (about 800 MB)" |
*
*/
export const agent_local_download: ((inputs?: Agent_Local_DownloadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Local_DownloadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{model} runs on this computer" |
*
*/
export const agent_local_heading: ((inputs: Agent_Local_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Local_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Loading…" |
*
*/
export const agent_local_loading: ((inputs?: Agent_Local_LoadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Local_LoadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Couldn't load the model: {error}" |
*
*/
export const agent_model_load_failed: ((inputs: Agent_Model_Load_FailedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Model_Load_FailedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Model output" |
*
*/
export const agent_model_output: ((inputs?: Agent_Model_OutputInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Model_OutputInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "OpenAI · API key" |
*
*/
export const agent_models_cloud: ((inputs?: Agent_Models_CloudInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Models_CloudInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "On this device" |
*
*/
export const agent_models_device: ((inputs?: Agent_Models_DeviceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Models_DeviceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing on the home page for this person." |
*
*/
export const agent_my_day_empty: ((inputs?: Agent_My_Day_EmptyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_My_Day_EmptyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "New chat" |
*
*/
export const agent_new_chat: ((inputs?: Agent_New_ChatInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_New_ChatInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "This browser has no built-in AI model. {model} needs Chrome's on-device AI or the downloadable model: see \"Turn on on-device AI\" on the login page." |
*
*/
export const agent_no_builtin_model: ((inputs: Agent_No_Builtin_ModelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_No_Builtin_ModelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open the {helper}" |
*
*/
export const agent_open: ((inputs: Agent_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_OpenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "OpenAI request failed ({status})" |
*
*/
export const agent_openai_failed: ((inputs: Agent_Openai_FailedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Openai_FailedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Opened: {title} ({path})." |
*
*/
export const agent_opened: ((inputs: Agent_OpenedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_OpenedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Ask or tell the helper…" |
*
*/
export const agent_prompt_placeholder: ((inputs?: Agent_Prompt_PlaceholderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Prompt_PlaceholderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Page: {path}" |
*
*/
export const agent_record_page: ((inputs: Agent_Record_PageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Record_PageInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "About this page: {description}" |
*
*/
export const agent_screen_about: ((inputs: Agent_Screen_AboutInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Screen_AboutInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "A list of {label}: {count} in all. First ones:" |
*
*/
export const agent_screen_list: ((inputs: Agent_Screen_ListInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Screen_ListInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Page: {title} ({path})" |
*
*/
export const agent_screen_page: ((inputs: Agent_Screen_PageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Screen_PageInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "A {singular}: {title}" |
*
*/
export const agent_screen_record: ((inputs: Agent_Screen_RecordInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Screen_RecordInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Settings: {label}." |
*
*/
export const agent_screen_settings: ((inputs: Agent_Screen_SettingsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Screen_SettingsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Signed in as {name} — {role}" |
*
*/
export const agent_screen_signed_in: ((inputs: Agent_Screen_Signed_InInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Screen_Signed_InInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Signed out" |
*
*/
export const agent_screen_signed_out: ((inputs?: Agent_Screen_Signed_OutInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Screen_Signed_OutInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Tabs: {tabs}" |
*
*/
export const agent_screen_tabs: ((inputs: Agent_Screen_TabsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Screen_TabsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "A screen: {title}." |
*
*/
export const agent_screen_view: ((inputs: Agent_Screen_ViewInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Screen_ViewInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sources: {sources}" |
*
*/
export const agent_sources: ((inputs: Agent_SourcesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_SourcesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "What needs my approval?" |
*
*/
export const agent_suggest_approvals: ((inputs?: Agent_Suggest_ApprovalsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Suggest_ApprovalsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "How does this page work?" |
*
*/
export const agent_suggest_page: ((inputs?: Agent_Suggest_PageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Suggest_PageInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "What am I looking at?" |
*
*/
export const agent_suggest_screen: ((inputs?: Agent_Suggest_ScreenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Suggest_ScreenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "What's waiting for me today?" |
*
*/
export const agent_suggest_today: ((inputs?: Agent_Suggest_TodayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Suggest_TodayInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Thinking…" |
*
*/
export const agent_thinking: ((inputs?: Agent_ThinkingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_ThinkingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Thought for {seconds} s" |
*
*/
export const agent_thought_for: ((inputs: Agent_Thought_ForInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Thought_ForInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "A request to open a page: opened it directly, without the model." |
*
*/
export const agent_thought_opened: ((inputs?: Agent_Thought_OpenedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Thought_OpenedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "A common request: answered with **{tool}** directly, from the records, without the model." |
*
*/
export const agent_thought_routed: ((inputs: Agent_Thought_RoutedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Thought_RoutedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "I stopped after many steps without finishing. Could you narrow the request?" |
*
*/
export const agent_too_many_steps: ((inputs?: Agent_Too_Many_StepsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Too_Many_StepsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Ask the records" |
*
*/
export const agent_tool_ask_assistant: ((inputs?: Agent_Tool_Ask_AssistantInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Ask_AssistantInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Ask the records" |
*
*/
export const agent_tool_ask_records: ((inputs?: Agent_Tool_Ask_RecordsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Ask_RecordsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Run a workflow" |
*
*/
export const agent_tool_call_workflow: ((inputs?: Agent_Tool_Call_WorkflowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Call_WorkflowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Check colour contrast" |
*
*/
export const agent_tool_check_accessibility: ((inputs?: Agent_Tool_Check_AccessibilityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Check_AccessibilityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Count records" |
*
*/
export const agent_tool_count_documents: ((inputs?: Agent_Tool_Count_DocumentsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Count_DocumentsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Create a record" |
*
*/
export const agent_tool_create_document: ((inputs?: Agent_Tool_Create_DocumentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Create_DocumentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Delete a record" |
*
*/
export const agent_tool_delete_document: ((inputs?: Agent_Tool_Delete_DocumentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Delete_DocumentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Data model" |
*
*/
export const agent_tool_describe_schema: ((inputs?: Agent_Tool_Describe_SchemaInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Describe_SchemaInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Find" |
*
*/
export const agent_tool_find: ((inputs?: Agent_Tool_FindInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_FindInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Find records" |
*
*/
export const agent_tool_find_documents: ((inputs?: Agent_Tool_Find_DocumentsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Find_DocumentsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Appearance" |
*
*/
export const agent_tool_get_appearance: ((inputs?: Agent_Tool_Get_AppearanceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Get_AppearanceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Bookmarks" |
*
*/
export const agent_tool_get_bookmarks: ((inputs?: Agent_Tool_Get_BookmarksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Get_BookmarksInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Read a record" |
*
*/
export const agent_tool_get_document: ((inputs?: Agent_Tool_Get_DocumentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Get_DocumentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "My work" |
*
*/
export const agent_tool_get_my_work: ((inputs?: Agent_Tool_Get_My_WorkInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Get_My_WorkInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "What's on screen" |
*
*/
export const agent_tool_get_screen: ((inputs?: Agent_Tool_Get_ScreenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Get_ScreenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Read settings" |
*
*/
export const agent_tool_get_settings: ((inputs?: Agent_Tool_Get_SettingsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Get_SettingsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Demo users" |
*
*/
export const agent_tool_list_demo_users: ((inputs?: Agent_Tool_List_Demo_UsersInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_List_Demo_UsersInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pages" |
*
*/
export const agent_tool_list_pages: ((inputs?: Agent_Tool_List_PagesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_List_PagesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Guided tours" |
*
*/
export const agent_tool_list_tours: ((inputs?: Agent_Tool_List_ToursInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_List_ToursInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Workflows" |
*
*/
export const agent_tool_list_workflows: ((inputs?: Agent_Tool_List_WorkflowsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_List_WorkflowsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Mark notification read" |
*
*/
export const agent_tool_mark_notification_read: ((inputs?: Agent_Tool_Mark_Notification_ReadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Mark_Notification_ReadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "My day" |
*
*/
export const agent_tool_my_day: ((inputs?: Agent_Tool_My_DayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_My_DayInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Go to a page" |
*
*/
export const agent_tool_navigate: ((inputs?: Agent_Tool_NavigateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_NavigateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open a page" |
*
*/
export const agent_tool_open_page: ((inputs?: Agent_Tool_Open_PageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Open_PageInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Platform guide" |
*
*/
export const agent_tool_platform_guide: ((inputs?: Agent_Tool_Platform_GuideInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Platform_GuideInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Record status" |
*
*/
export const agent_tool_record_status: ((inputs?: Agent_Tool_Record_StatusInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Record_StatusInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Change appearance" |
*
*/
export const agent_tool_set_appearance: ((inputs?: Agent_Tool_Set_AppearanceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Set_AppearanceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open or close a side column" |
*
*/
export const agent_tool_set_layout: ((inputs?: Agent_Tool_Set_LayoutInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Set_LayoutInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Start a tour" |
*
*/
export const agent_tool_start_tour: ((inputs?: Agent_Tool_Start_TourInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Start_TourInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Switch user (demo)" |
*
*/
export const agent_tool_switch_user: ((inputs?: Agent_Tool_Switch_UserInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Switch_UserInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Bookmark a page" |
*
*/
export const agent_tool_toggle_bookmark: ((inputs?: Agent_Tool_Toggle_BookmarkInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Toggle_BookmarkInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Update a record" |
*
*/
export const agent_tool_update_document: ((inputs?: Agent_Tool_Update_DocumentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Update_DocumentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Change settings" |
*
*/
export const agent_tool_update_settings: ((inputs?: Agent_Tool_Update_SettingsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_Update_SettingsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "What's on screen" |
*
*/
export const agent_tool_what_is_on_screen: ((inputs?: Agent_Tool_What_Is_On_ScreenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_What_Is_On_ScreenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "**{tool}** with {input}" |
*
*/
export const agent_tool_with: ((inputs: Agent_Tool_WithInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Tool_WithInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Input" |
*
*/
export const agent_trace_input: ((inputs?: Agent_Trace_InputInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Trace_InputInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Result" |
*
*/
export const agent_trace_result: ((inputs?: Agent_Trace_ResultInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_Trace_ResultInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Working…" |
*
*/
export const agent_working: ((inputs?: Agent_WorkingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Agent_WorkingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Dismiss" |
*
*/
export const alert_dismiss: ((inputs?: Alert_DismissInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Alert_DismissInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The mock backend couldn't start" |
*
*/
export const app_backend_failed: ((inputs?: App_Backend_FailedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<App_Backend_FailedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Demo" |
*
*/
export const app_demo_tag: ((inputs?: App_Demo_TagInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<App_Demo_TagInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Log out" |
*
*/
export const app_log_out: ((inputs?: App_Log_OutInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<App_Log_OutInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "You have been logged out." |
*
*/
export const app_logged_out: ((inputs?: App_Logged_OutInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<App_Logged_OutInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Dashboard" |
*
*/
export const app_nav_dashboard: ((inputs?: App_Nav_DashboardInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<App_Nav_DashboardInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Home" |
*
*/
export const app_nav_home: ((inputs?: App_Nav_HomeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<App_Nav_HomeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Needs attention" |
*
*/
export const app_needs_attention: ((inputs?: App_Needs_AttentionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<App_Needs_AttentionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Back to the dashboard" |
*
*/
export const app_not_found_back: ((inputs?: App_Not_Found_BackInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<App_Not_Found_BackInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "There's no dashboard page at this address." |
*
*/
export const app_not_found_description: ((inputs?: App_Not_Found_DescriptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<App_Not_Found_DescriptionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing found" |
*
*/
export const app_not_found_heading: ((inputs?: App_Not_Found_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<App_Not_Found_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "This Demo Powered by {name}" |
*
*/
export const app_powered_by: ((inputs: App_Powered_ByInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<App_Powered_ByInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Navigation" |
*
*/
export const app_shell_navigation: ((inputs?: App_Shell_NavigationInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<App_Shell_NavigationInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Side panel" |
*
*/
export const app_shell_side_panel: ((inputs?: App_Shell_Side_PanelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<App_Shell_Side_PanelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Side panel" |
*
*/
export const app_side_panel: ((inputs?: App_Side_PanelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<App_Side_PanelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Couldn't switch to {name}: {error}" |
*
*/
export const app_switch_user_failed: ((inputs: App_Switch_User_FailedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<App_Switch_User_FailedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Switch user" |
*
*/
export const app_switch_user_heading: ((inputs?: App_Switch_User_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<App_Switch_User_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Switch user (demo) — signed in as {name}" |
*
*/
export const app_switch_user_label: ((inputs: App_Switch_User_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<App_Switch_User_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Signed in as {name} ({role})" |
*
*/
export const app_switched_user: ((inputs: App_Switched_UserInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<App_Switched_UserInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Account" |
*
*/
export const app_title_account: ((inputs?: App_Title_AccountInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<App_Title_AccountInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Create first user" |
*
*/
export const app_title_create_first_user: ((inputs?: App_Title_Create_First_UserInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<App_Title_Create_First_UserInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Login" |
*
*/
export const app_title_login: ((inputs?: App_Title_LoginInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<App_Title_LoginInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Not found" |
*
*/
export const app_title_not_found: ((inputs?: App_Title_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<App_Title_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "· Dashboard" |
*
*/
export const app_title_suffix: ((inputs?: App_Title_SuffixInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<App_Title_SuffixInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "This screen is loading." |
*
*/
export const app_view_loading: ((inputs?: App_View_LoadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<App_View_LoadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Display settings" |
*
*/
export const appearance_all_label: ((inputs?: Appearance_All_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Appearance_All_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Background" |
*
*/
export const appearance_background_heading: ((inputs?: Appearance_Background_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Appearance_Background_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Background image" |
*
*/
export const appearance_background_label: ((inputs?: Appearance_Background_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Appearance_Background_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Magnet lines" |
*
*/
export const appearance_background_live_magnet_lines: ((inputs?: Appearance_Background_Live_Magnet_LinesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Appearance_Background_Live_Magnet_LinesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Waves" |
*
*/
export const appearance_background_live_waves: ((inputs?: Appearance_Background_Live_WavesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Appearance_Background_Live_WavesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No image" |
*
*/
export const appearance_background_none: ((inputs?: Appearance_Background_NoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Appearance_Background_NoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Replace your image" |
*
*/
export const appearance_background_replace: ((inputs?: Appearance_Background_ReplaceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Appearance_Background_ReplaceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Upload your own" |
*
*/
export const appearance_background_upload: ((inputs?: Appearance_Background_UploadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Appearance_Background_UploadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Arabic" |
*
*/
export const appearance_language_ar: ((inputs?: Appearance_Language_ArInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Appearance_Language_ArInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Current language" |
*
*/
export const appearance_language_current: ((inputs?: Appearance_Language_CurrentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Appearance_Language_CurrentInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "English" |
*
*/
export const appearance_language_en: ((inputs?: Appearance_Language_EnInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Appearance_Language_EnInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Language" |
*
*/
export const appearance_language_heading: ((inputs?: Appearance_Language_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Appearance_Language_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Language: {name}" |
*
*/
export const appearance_language_label: ((inputs: Appearance_Language_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Appearance_Language_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Default" |
*
*/
export const appearance_scheme_default: ((inputs?: Appearance_Scheme_DefaultInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Appearance_Scheme_DefaultInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Colour scheme" |
*
*/
export const appearance_scheme_heading: ((inputs?: Appearance_Scheme_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Appearance_Scheme_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Colour scheme: {name}" |
*
*/
export const appearance_scheme_label: ((inputs: Appearance_Scheme_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Appearance_Scheme_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Dark" |
*
*/
export const appearance_theme_dark: ((inputs?: Appearance_Theme_DarkInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Appearance_Theme_DarkInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Theme" |
*
*/
export const appearance_theme_heading: ((inputs?: Appearance_Theme_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Appearance_Theme_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Theme: {current}. Switch to {next}" |
*
*/
export const appearance_theme_label: ((inputs: Appearance_Theme_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Appearance_Theme_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Light" |
*
*/
export const appearance_theme_light: ((inputs?: Appearance_Theme_LightInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Appearance_Theme_LightInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "System" |
*
*/
export const appearance_theme_system: ((inputs?: Appearance_Theme_SystemInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Appearance_Theme_SystemInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Bookmark this page" |
*
*/
export const aside_bookmark_add: ((inputs?: Aside_Bookmark_AddInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Aside_Bookmark_AddInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "List" |
*
*/
export const aside_bookmark_list: ((inputs?: Aside_Bookmark_ListInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Aside_Bookmark_ListInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Record" |
*
*/
export const aside_bookmark_record: ((inputs?: Aside_Bookmark_RecordInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Aside_Bookmark_RecordInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Remove this page from bookmarks" |
*
*/
export const aside_bookmark_remove: ((inputs?: Aside_Bookmark_RemoveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Aside_Bookmark_RemoveInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Screen" |
*
*/
export const aside_bookmark_screen: ((inputs?: Aside_Bookmark_ScreenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Aside_Bookmark_ScreenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Settings" |
*
*/
export const aside_bookmark_settings: ((inputs?: Aside_Bookmark_SettingsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Aside_Bookmark_SettingsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Bookmarks" |
*
*/
export const aside_bookmarks: ((inputs?: Aside_BookmarksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Aside_BookmarksInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Press the star to keep a page here" |
*
*/
export const aside_bookmarks_empty: ((inputs?: Aside_Bookmarks_EmptyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Aside_Bookmarks_EmptyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "You're all caught up" |
*
*/
export const aside_caught_up: ((inputs?: Aside_Caught_UpInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Aside_Caught_UpInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Loading…" |
*
*/
export const aside_loading: ((inputs?: Aside_LoadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Aside_LoadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Read" |
*
*/
export const aside_notification_read: ((inputs?: Aside_Notification_ReadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Aside_Notification_ReadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Notifications" |
*
*/
export const aside_notifications: ((inputs?: Aside_NotificationsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Aside_NotificationsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Notifications ({count})" |
*
*/
export const aside_notifications_unread: ((inputs: Aside_Notifications_UnreadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Aside_Notifications_UnreadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Done" |
*
*/
export const aside_tour_done: ((inputs?: Aside_Tour_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Aside_Tour_DoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} step" |
* | * | "{count} steps" |
*
*/
export const aside_tour_steps: ((inputs: Aside_Tour_StepsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Aside_Tour_StepsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Tours" |
*
*/
export const aside_tours: ((inputs?: Aside_ToursInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Aside_ToursInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Widgets" |
*
*/
export const aside_widgets: ((inputs?: Aside_WidgetsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Aside_WidgetsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Ask" |
*
*/
export const ask_ask: ((inputs?: Ask_AskInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Ask_AskInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Assistant" |
*
*/
export const ask_assistant: ((inputs?: Ask_AssistantInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Ask_AssistantInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Ask a question…" |
*
*/
export const ask_placeholder: ((inputs?: Ask_PlaceholderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Ask_PlaceholderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Question" |
*
*/
export const ask_question: ((inputs?: Ask_QuestionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Ask_QuestionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reading" |
*
*/
export const ask_reading: ((inputs?: Ask_ReadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Ask_ReadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reading the records…" |
*
*/
export const ask_reading_records: ((inputs?: Ask_Reading_RecordsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Ask_Reading_RecordsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sources:" |
*
*/
export const ask_sources: ((inputs?: Ask_SourcesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Ask_SourcesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "You" |
*
*/
export const ask_you: ((inputs?: Ask_YouInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Ask_YouInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Catch me up" |
*
*/
export const assist_catch_me_up: ((inputs?: Assist_Catch_Me_UpInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Catch_Me_UpInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Check again" |
*
*/
export const assist_check_again: ((inputs?: Assist_Check_AgainInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Check_AgainInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Check with AI" |
*
*/
export const assist_check_with_ai: ((inputs?: Assist_Check_With_AiInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Check_With_AiInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Checked on this device — a person decides" |
*
*/
export const assist_checked_heading: ((inputs?: Assist_Checked_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Checked_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Checking…" |
*
*/
export const assist_checking: ((inputs?: Assist_CheckingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_CheckingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{label}: {category}" |
*
*/
export const assist_classified: ((inputs: Assist_ClassifiedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_ClassifiedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Copied" |
*
*/
export const assist_copied: ((inputs?: Assist_CopiedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_CopiedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Dictate" |
*
*/
export const assist_dictate: ((inputs?: Assist_DictateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_DictateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Getting the on-device model… {percent}" |
*
*/
export const assist_downloading: ((inputs: Assist_DownloadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_DownloadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Drafted" |
*
*/
export const assist_drafted: ((inputs?: Assist_DraftedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_DraftedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Drafting…" |
*
*/
export const assist_drafting: ((inputs?: Assist_DraftingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_DraftingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The on-device model couldn't do this." |
*
*/
export const assist_error_failed: ((inputs?: Assist_Error_FailedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Error_FailedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Fill from text" |
*
*/
export const assist_fill_from_text: ((inputs?: Assist_Fill_From_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Fill_From_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} fix" |
* | * | "{count} fixes" |
*
*/
export const assist_fixes: ((inputs: Assist_FixesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_FixesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{note} Spotted on this device — it can be wrong." |
*
*/
export const assist_flag_note: ((inputs: Assist_Flag_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Flag_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Found on this device — check before using" |
*
*/
export const assist_found_heading: ((inputs?: Assist_Found_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Found_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Heard from {name} · on this device — check it" |
*
*/
export const assist_heard_from: ((inputs: Assist_Heard_FromInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Heard_FromInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Hide summary" |
*
*/
export const assist_hide_summary: ((inputs?: Assist_Hide_SummaryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Hide_SummaryInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Key points · on this device" |
*
*/
export const assist_key_points_heading: ((inputs?: Assist_Key_Points_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Key_Points_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Listening…" |
*
*/
export const assist_listening: ((inputs?: Assist_ListeningInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_ListeningInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Looks like" |
*
*/
export const assist_looks_like: ((inputs?: Assist_Looks_LikeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Looks_LikeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Made firmer" |
*
*/
export const assist_made_firmer: ((inputs?: Assist_Made_FirmerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Made_FirmerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Made more formal" |
*
*/
export const assist_made_formal: ((inputs?: Assist_Made_FormalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Made_FormalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Made friendlier" |
*
*/
export const assist_made_friendlier: ((inputs?: Assist_Made_FriendlierInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Made_FriendlierInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No fixes needed" |
*
*/
export const assist_no_fixes: ((inputs?: Assist_No_FixesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_No_FixesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The microphone isn't available (check the browser's permission)." |
*
*/
export const assist_no_microphone: ((inputs?: Assist_No_MicrophoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_No_MicrophoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "not found" |
*
*/
export const assist_not_found: ((inputs?: Assist_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Other replies" |
*
*/
export const assist_other_replies: ((inputs?: Assist_Other_RepliesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Other_RepliesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Paste the message here…" |
*
*/
export const assist_paste_placeholder: ((inputs?: Assist_Paste_PlaceholderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Paste_PlaceholderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Proofreading…" |
*
*/
export const assist_proofreading: ((inputs?: Assist_ProofreadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_ProofreadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Read aloud" |
*
*/
export const assist_read_aloud: ((inputs?: Assist_Read_AloudInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Read_AloudInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Read a photo or voice note" |
*
*/
export const assist_read_file: ((inputs?: Assist_Read_FileInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Read_FileInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Read from {name} · on this device — check it" |
*
*/
export const assist_read_from: ((inputs: Assist_Read_FromInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Read_FromInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reading…" |
*
*/
export const assist_reading: ((inputs?: Assist_ReadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_ReadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reading the photo…" |
*
*/
export const assist_reading_photo: ((inputs?: Assist_Reading_PhotoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Reading_PhotoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Rewriting…" |
*
*/
export const assist_rewriting: ((inputs?: Assist_RewritingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_RewritingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Shortened" |
*
*/
export const assist_shortened: ((inputs?: Assist_ShortenedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_ShortenedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Shortening…" |
*
*/
export const assist_shortening: ((inputs?: Assist_ShorteningInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_ShorteningInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Show original" |
*
*/
export const assist_show_original: ((inputs?: Assist_Show_OriginalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Show_OriginalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Stop" |
*
*/
export const assist_stop: ((inputs?: Assist_StopInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_StopInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Stop and write it down" |
*
*/
export const assist_stop_dictating: ((inputs?: Assist_Stop_DictatingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Stop_DictatingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Suggest a category" |
*
*/
export const assist_suggest_category: ((inputs?: Assist_Suggest_CategoryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Suggest_CategoryInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Suggest replies" |
*
*/
export const assist_suggest_replies: ((inputs?: Assist_Suggest_RepliesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Suggest_RepliesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Summarised on this device" |
*
*/
export const assist_summarised_on_device: ((inputs?: Assist_Summarised_On_DeviceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Summarised_On_DeviceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Summary · on this device" |
*
*/
export const assist_summary_heading: ((inputs?: Assist_Summary_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Summary_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Draft with AI" |
*
*/
export const assist_tool_draft: ((inputs?: Assist_Tool_DraftInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Tool_DraftInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Firmer" |
*
*/
export const assist_tool_firm: ((inputs?: Assist_Tool_FirmInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Tool_FirmInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "More formal" |
*
*/
export const assist_tool_formal: ((inputs?: Assist_Tool_FormalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Tool_FormalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Friendlier" |
*
*/
export const assist_tool_friendly: ((inputs?: Assist_Tool_FriendlyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Tool_FriendlyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Proofread" |
*
*/
export const assist_tool_proofread: ((inputs?: Assist_Tool_ProofreadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Tool_ProofreadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Shorter" |
*
*/
export const assist_tool_shorter: ((inputs?: Assist_Tool_ShorterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Tool_ShorterInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Translate" |
*
*/
export const assist_tool_translate: ((inputs?: Assist_Tool_TranslateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Tool_TranslateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Translate to {language}" |
*
*/
export const assist_translate_to: ((inputs: Assist_Translate_ToInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Translate_ToInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Translated on this device — check names and figures against the original." |
*
*/
export const assist_translated_note: ((inputs?: Assist_Translated_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Translated_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Translated to {language}" |
*
*/
export const assist_translated_to: ((inputs: Assist_Translated_ToInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Translated_ToInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Translating…" |
*
*/
export const assist_translating: ((inputs?: Assist_TranslatingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_TranslatingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Translating to {language}…" |
*
*/
export const assist_translating_to: ((inputs: Assist_Translating_ToInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Translating_ToInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Undo" |
*
*/
export const assist_undo: ((inputs?: Assist_UndoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_UndoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Use these" |
*
*/
export const assist_use_these: ((inputs?: Assist_Use_TheseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Use_TheseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Use this" |
*
*/
export const assist_use_this: ((inputs?: Assist_Use_ThisInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Use_ThisInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Writing it down…" |
*
*/
export const assist_writing_down: ((inputs?: Assist_Writing_DownInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Writing_DownInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Writing replies…" |
*
*/
export const assist_writing_replies: ((inputs?: Assist_Writing_RepliesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Assist_Writing_RepliesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Account created." |
*
*/
export const auth_account_created: ((inputs?: Auth_Account_CreatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_Account_CreatedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Download ({size})" |
*
*/
export const auth_ai_download: ((inputs: Auth_Ai_DownloadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_Ai_DownloadInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "It works in any browser. It is slower and reads text only." |
*
*/
export const auth_ai_download_body: ((inputs?: Auth_Ai_Download_BodyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_Ai_Download_BodyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Or download a model" |
*
*/
export const auth_ai_download_title: ((inputs?: Auth_Ai_Download_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_Ai_Download_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "In desktop Chrome, open {url}, enable these flags, then click Relaunch:" |
*
*/
export const auth_ai_flags: ((inputs: Auth_Ai_FlagsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_Ai_FlagsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Also enable the Summarization, Writer, Rewriter, Proofreader, Translation and Language Detection APIs. For the first flag, choose \"Enabled BypassPerfRequirem..." |
*
*/
export const auth_ai_flags_more: ((inputs?: Auth_Ai_Flags_MoreInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_Ai_Flags_MoreInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Turn on AI features" |
*
*/
export const auth_ai_heading: ((inputs?: Auth_Ai_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_Ai_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Loading…" |
*
*/
export const auth_ai_loading: ((inputs?: Auth_Ai_LoadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_Ai_LoadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "This browser uses the downloaded model." |
*
*/
export const auth_ai_local_on: ((inputs?: Auth_Ai_Local_OnInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_Ai_Local_OnInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Chrome's on-device AI is on in this browser." |
*
*/
export const auth_ai_native_on: ((inputs?: Auth_Ai_Native_OnInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_Ai_Native_OnInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Switch on Chrome's on-device AI" |
*
*/
export const auth_ai_native_title: ((inputs?: Auth_Ai_Native_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_Ai_Native_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Recommended" |
*
*/
export const auth_ai_recommended: ((inputs?: Auth_Ai_RecommendedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_Ai_RecommendedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Change" |
*
*/
export const auth_change: ((inputs?: Auth_ChangeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_ChangeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Authenticator code" |
*
*/
export const auth_code_label: ((inputs?: Auth_Code_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_Code_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Enter the {length}-digit code from your authenticator app." |
*
*/
export const auth_code_prompt: ((inputs: Auth_Code_PromptInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_Code_PromptInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Continue" |
*
*/
export const auth_continue: ((inputs?: Auth_ContinueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_ContinueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Create" |
*
*/
export const auth_create: ((inputs?: Auth_CreateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_CreateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Demo: any {length}-digit code works, and the passkey prompt is simulated." |
*
*/
export const auth_demo_note: ((inputs: Auth_Demo_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_Demo_NoteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Email" |
*
*/
export const auth_email: ((inputs?: Auth_EmailInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_EmailInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Create the first user" |
*
*/
export const auth_first_user_heading: ((inputs?: Auth_First_User_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_First_User_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The mock backend has no users yet." |
*
*/
export const auth_first_user_intro: ((inputs?: Auth_First_User_IntroInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_First_User_IntroInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Log in" |
*
*/
export const auth_log_in: ((inputs?: Auth_Log_InInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_Log_InInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "A demo user is filled in; switch roles any time from the dashboard." |
*
*/
export const auth_login_intro: ((inputs?: Auth_Login_IntroInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_Login_IntroInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "or" |
*
*/
export const auth_or: ((inputs?: Auth_OrInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_OrInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Use a passkey" |
*
*/
export const auth_passkey_use: ((inputs?: Auth_Passkey_UseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_Passkey_UseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Waiting for your device…" |
*
*/
export const auth_passkey_waiting: ((inputs?: Auth_Passkey_WaitingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_Passkey_WaitingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Password *" |
*
*/
export const auth_password_required: ((inputs?: Auth_Password_RequiredInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_Password_RequiredInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Signing in as" |
*
*/
export const auth_signing_in_as: ((inputs?: Auth_Signing_In_AsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_Signing_In_AsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Verify and log in" |
*
*/
export const auth_verify_and_log_in: ((inputs?: Auth_Verify_And_Log_InInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_Verify_And_Log_InInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Verify it's you" |
*
*/
export const auth_verify_heading: ((inputs?: Auth_Verify_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_Verify_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Verifying…" |
*
*/
export const auth_verifying: ((inputs?: Auth_VerifyingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_VerifyingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Welcome back." |
*
*/
export const auth_welcome_back: ((inputs?: Auth_Welcome_BackInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Auth_Welcome_BackInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{count} more" |
*
*/
export const avatar_more: ((inputs: Avatar_MoreInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Avatar_MoreInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Status" |
*
*/
export const badge_status: ((inputs?: Badge_StatusInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Badge_StatusInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Breadcrumb" |
*
*/
export const breadcrumbs_label: ((inputs?: Breadcrumbs_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Breadcrumbs_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{quality}: {low}–{high} · {reading}" |
*
*/
export const bullet_band: ((inputs: Bullet_BandInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Bullet_BandInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Bullet graph" |
*
*/
export const bullet_label: ((inputs?: Bullet_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Bullet_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Good" |
*
*/
export const bullet_quality_good: ((inputs?: Bullet_Quality_GoodInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Bullet_Quality_GoodInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "OK" |
*
*/
export const bullet_quality_ok: ((inputs?: Bullet_Quality_OkInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Bullet_Quality_OkInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Poor" |
*
*/
export const bullet_quality_poor: ((inputs?: Bullet_Quality_PoorInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Bullet_Quality_PoorInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{value} of {target}" |
*
*/
export const bullet_reading_of: ((inputs: Bullet_Reading_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Bullet_Reading_OfInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{value} · {share} of {max}" |
*
*/
export const bullet_reading_range: ((inputs: Bullet_Reading_RangeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Bullet_Reading_RangeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{value} of {target} · {share} of target" |
*
*/
export const bullet_reading_target: ((inputs: Bullet_Reading_TargetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Bullet_Reading_TargetInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Target {target}" |
*
*/
export const bullet_target: ((inputs: Bullet_TargetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Bullet_TargetInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Range" |
*
*/
export const chart_range: ((inputs?: Chart_RangeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Chart_RangeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Series" |
*
*/
export const chart_series: ((inputs?: Chart_SeriesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Chart_SeriesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Target" |
*
*/
export const chart_target: ((inputs?: Chart_TargetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Chart_TargetInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Total" |
*
*/
export const chart_total: ((inputs?: Chart_TotalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Chart_TotalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Remove" |
*
*/
export const chip_remove: ((inputs?: Chip_RemoveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Chip_RemoveInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Back" |
*
*/
export const coachmark_back: ((inputs?: Coachmark_BackInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Coachmark_BackInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Close" |
*
*/
export const coachmark_close: ((inputs?: Coachmark_CloseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Coachmark_CloseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Finish" |
*
*/
export const coachmark_finish: ((inputs?: Coachmark_FinishInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Coachmark_FinishInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Guided tour" |
*
*/
export const coachmark_label: ((inputs?: Coachmark_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Coachmark_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Next" |
*
*/
export const coachmark_next: ((inputs?: Coachmark_NextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Coachmark_NextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Skip" |
*
*/
export const coachmark_skip: ((inputs?: Coachmark_SkipInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Coachmark_SkipInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Step {step} of {total}" |
*
*/
export const coachmark_step: ((inputs: Coachmark_StepInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Coachmark_StepInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Columns" |
*
*/
export const column_picker_columns: ((inputs?: Column_Picker_ColumnsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Column_Picker_ColumnsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Compact" |
*
*/
export const column_picker_density_compact: ((inputs?: Column_Picker_Density_CompactInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Column_Picker_Density_CompactInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Default" |
*
*/
export const column_picker_density_default: ((inputs?: Column_Picker_Density_DefaultInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Column_Picker_Density_DefaultInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Dense" |
*
*/
export const column_picker_density_dense: ((inputs?: Column_Picker_Density_DenseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Column_Picker_Density_DenseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Columns ({shown} of {total} shown)" |
*
*/
export const column_picker_label: ((inputs: Column_Picker_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Column_Picker_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Move {name} earlier" |
*
*/
export const column_picker_move_earlier: ((inputs: Column_Picker_Move_EarlierInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Column_Picker_Move_EarlierInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Move {name} later" |
*
*/
export const column_picker_move_later: ((inputs: Column_Picker_Move_LaterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Column_Picker_Move_LaterInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reset" |
*
*/
export const column_picker_reset: ((inputs?: Column_Picker_ResetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Column_Picker_ResetInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Row height" |
*
*/
export const column_picker_row_height: ((inputs?: Column_Picker_Row_HeightInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Column_Picker_Row_HeightInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Add “{value}”" |
*
*/
export const combobox_add: ((inputs: Combobox_AddInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Combobox_AddInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Choose…" |
*
*/
export const combobox_choose: ((inputs?: Combobox_ChooseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Combobox_ChooseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Clear" |
*
*/
export const combobox_clear: ((inputs?: Combobox_ClearInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Combobox_ClearInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No matches" |
*
*/
export const combobox_no_matches: ((inputs?: Combobox_No_MatchesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Combobox_No_MatchesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing to choose from" |
*
*/
export const combobox_nothing: ((inputs?: Combobox_NothingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Combobox_NothingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Remove {value}" |
*
*/
export const combobox_remove: ((inputs: Combobox_RemoveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Combobox_RemoveInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Type to add" |
*
*/
export const combobox_type_to_add: ((inputs?: Combobox_Type_To_AddInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Combobox_Type_To_AddInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Your profile and password" |
*
*/
export const command_account_description: ((inputs?: Command_Account_DescriptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Account_DescriptionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Bookmark this page" |
*
*/
export const command_bookmark_add: ((inputs?: Command_Bookmark_AddInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Bookmark_AddInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Bookmarks are listed in the side panel" |
*
*/
export const command_bookmark_description: ((inputs?: Command_Bookmark_DescriptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Bookmark_DescriptionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "bookmark, pin" |
*
*/
export const command_bookmark_keywords: ((inputs?: Command_Bookmark_KeywordsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Bookmark_KeywordsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Remove this page from bookmarks" |
*
*/
export const command_bookmark_remove: ((inputs?: Command_Bookmark_RemoveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Bookmark_RemoveInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "All {plural}" |
*
*/
export const command_collection_all: ((inputs: Command_Collection_AllInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Collection_AllInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Outline text that fails WCAG AA contrast, and anything that overflows or is squeezed at this width" |
*
*/
export const command_contrast_description: ((inputs?: Command_Contrast_DescriptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Contrast_DescriptionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "accessibility, contrast, layout" |
*
*/
export const command_contrast_keywords: ((inputs?: Command_Contrast_KeywordsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Contrast_KeywordsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Check contrast and layout" |
*
*/
export const command_contrast_title: ((inputs?: Command_Contrast_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Contrast_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open a blank {singular} form" |
*
*/
export const command_create_description: ((inputs: Command_Create_DescriptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Create_DescriptionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "add, new" |
*
*/
export const command_create_keywords: ((inputs?: Command_Create_KeywordsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Create_KeywordsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Create new {singular}" |
*
*/
export const command_create_title: ((inputs: Command_Create_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Create_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Your day, KPIs and charts" |
*
*/
export const command_dashboard_description: ((inputs?: Command_Dashboard_DescriptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Dashboard_DescriptionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "overview, home" |
*
*/
export const command_dashboard_keywords: ((inputs?: Command_Dashboard_KeywordsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Dashboard_KeywordsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Accessibility" |
*
*/
export const command_group_accessibility: ((inputs?: Command_Group_AccessibilityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Group_AccessibilityInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Configuration" |
*
*/
export const command_group_configuration: ((inputs?: Command_Group_ConfigurationInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Group_ConfigurationInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "You" |
*
*/
export const command_group_you: ((inputs?: Command_Group_YouInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Group_YouInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Search actions, pages and records…" |
*
*/
export const command_input_label: ((inputs?: Command_Input_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Input_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Search actions, pages, records…" |
*
*/
export const command_launcher_label: ((inputs?: Command_Launcher_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Launcher_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "log out, sign out" |
*
*/
export const command_logout_keywords: ((inputs?: Command_Logout_KeywordsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Logout_KeywordsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Navigate" |
*
*/
export const command_navigate: ((inputs?: Command_NavigateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_NavigateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No results for “{query}”" |
*
*/
export const command_no_results: ((inputs: Command_No_ResultsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_No_ResultsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Try other words — search understands related terms too." |
*
*/
export const command_no_results_hint: ((inputs?: Command_No_Results_HintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_No_Results_HintInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open" |
*
*/
export const command_open: ((inputs?: Command_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_OpenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "related" |
*
*/
export const command_related: ((inputs?: Command_RelatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_RelatedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} result · fuzzy + semantic" |
* | * | "{count} results · fuzzy + semantic" |
*
*/
export const command_results: ((inputs: Command_ResultsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_ResultsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Actions" |
*
*/
export const command_section_actions: ((inputs?: Command_Section_ActionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Section_ActionsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pages" |
*
*/
export const command_section_pages: ((inputs?: Command_Section_PagesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Section_PagesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Records" |
*
*/
export const command_section_records: ((inputs?: Command_Section_RecordsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Section_RecordsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quick actions" |
*
*/
export const command_suggest_actions: ((inputs?: Command_Suggest_ActionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Suggest_ActionsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Go to" |
*
*/
export const command_suggest_pages: ((inputs?: Command_Suggest_PagesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Suggest_PagesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "This page" |
*
*/
export const command_this_page: ((inputs?: Command_This_PageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_This_PageInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Type to search · fuzzy + semantic" |
*
*/
export const command_type_to_search: ((inputs?: Command_Type_To_SearchInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Command_Type_To_SearchInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Allow" |
*
*/
export const confirmation_allow: ((inputs?: Confirmation_AllowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Confirmation_AllowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Allowed" |
*
*/
export const confirmation_allowed: ((inputs?: Confirmation_AllowedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Confirmation_AllowedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Don’t" |
*
*/
export const confirmation_deny: ((inputs?: Confirmation_DenyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Confirmation_DenyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Confirmation" |
*
*/
export const confirmation_label: ((inputs?: Confirmation_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Confirmation_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Not allowed" |
*
*/
export const confirmation_not_allowed: ((inputs?: Confirmation_Not_AllowedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Confirmation_Not_AllowedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Close" |
*
*/
export const contrast_audit_close: ((inputs?: Contrast_Audit_CloseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Contrast_Audit_CloseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} text element fails WCAG AA" |
* | * | "{count} text elements fail WCAG AA" |
*
*/
export const contrast_audit_fails: ((inputs: Contrast_Audit_FailsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Contrast_Audit_FailsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} text element fails WCAG AA · {overImage} over the background image" |
* | * | "{count} text elements fail WCAG AA · {overImage} over the background image" |
*
*/
export const contrast_audit_fails_over_image: ((inputs: Contrast_Audit_Fails_Over_ImageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Contrast_Audit_Fails_Over_ImageInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "filled" |
*
*/
export const contrast_audit_filled: ((inputs?: Contrast_Audit_FilledInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Contrast_Audit_FilledInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "A filled button: keep one or two per screen" |
*
*/
export const contrast_audit_filled_hint: ((inputs?: Contrast_Audit_Filled_HintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Contrast_Audit_Filled_HintInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} filled button on a dialog" |
* | * | "{count} filled buttons on a dialog" |
*
*/
export const contrast_audit_filled_on_dialog: ((inputs: Contrast_Audit_Filled_On_DialogInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Contrast_Audit_Filled_On_DialogInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} filled button on the page" |
* | * | "{count} filled buttons on the page" |
*
*/
export const contrast_audit_filled_on_page: ((inputs: Contrast_Audit_Filled_On_PageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Contrast_Audit_Filled_On_PageInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{color} on {background} — needs {required}:1" |
*
*/
export const contrast_audit_issue: ((inputs: Contrast_Audit_IssueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Contrast_Audit_IssueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "cramped" |
*
*/
export const contrast_audit_kind_cramped: ((inputs?: Contrast_Audit_Kind_CrampedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Contrast_Audit_Kind_CrampedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "escapes" |
*
*/
export const contrast_audit_kind_escapes: ((inputs?: Contrast_Audit_Kind_EscapesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Contrast_Audit_Kind_EscapesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "page-scroll" |
*
*/
export const contrast_audit_kind_page_scroll: ((inputs?: Contrast_Audit_Kind_Page_ScrollInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Contrast_Audit_Kind_Page_ScrollInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "squeezed" |
*
*/
export const contrast_audit_kind_squeezed: ((inputs?: Contrast_Audit_Kind_SqueezedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Contrast_Audit_Kind_SqueezedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} layout problem at {px}px: let it wrap or shrink." |
* | * | "{count} layout problems at {px}px: let it wrap or shrink." |
*
*/
export const contrast_audit_layout: ((inputs: Contrast_Audit_LayoutInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Contrast_Audit_LayoutInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Everything on screen passes WCAG AA (4.5:1, large text 3:1)." |
*
*/
export const contrast_audit_passes: ((inputs?: Contrast_Audit_PassesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Contrast_Audit_PassesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{places}: keep one or two, make the rest tonal (variant=\"soft\")." |
*
*/
export const contrast_audit_prominence: ((inputs: Contrast_Audit_ProminenceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Contrast_Audit_ProminenceInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{ratio}:1" |
*
*/
export const contrast_audit_ratio: ((inputs: Contrast_Audit_RatioInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Contrast_Audit_RatioInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Re-run" |
*
*/
export const contrast_audit_rerun: ((inputs?: Contrast_Audit_RerunInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Contrast_Audit_RerunInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Contrast audit" |
*
*/
export const contrast_audit_title: ((inputs?: Contrast_Audit_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Contrast_Audit_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "due now" |
*
*/
export const countdown_due_now: ((inputs?: Countdown_Due_NowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Countdown_Due_NowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "just overdue" |
*
*/
export const countdown_just_overdue: ((inputs?: Countdown_Just_OverdueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Countdown_Just_OverdueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{days} d left" |
*
*/
export const countdown_left_days: ((inputs: Countdown_Left_DaysInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Countdown_Left_DaysInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{days} d {hours} h left" |
*
*/
export const countdown_left_days_hours: ((inputs: Countdown_Left_Days_HoursInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Countdown_Left_Days_HoursInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{hours} h left" |
*
*/
export const countdown_left_hours: ((inputs: Countdown_Left_HoursInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Countdown_Left_HoursInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{hours} h {minutes} min left" |
*
*/
export const countdown_left_hours_minutes: ((inputs: Countdown_Left_Hours_MinutesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Countdown_Left_Hours_MinutesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{minutes} min left" |
*
*/
export const countdown_left_minutes: ((inputs: Countdown_Left_MinutesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Countdown_Left_MinutesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{what} is overdue." |
*
*/
export const countdown_overdue: ((inputs: Countdown_OverdueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Countdown_OverdueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "overdue {days} d" |
*
*/
export const countdown_overdue_days: ((inputs: Countdown_Overdue_DaysInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Countdown_Overdue_DaysInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "overdue {hours} h" |
*
*/
export const countdown_overdue_hours: ((inputs: Countdown_Overdue_HoursInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Countdown_Overdue_HoursInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "overdue {minutes} min" |
*
*/
export const countdown_overdue_minutes: ((inputs: Countdown_Overdue_MinutesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Countdown_Overdue_MinutesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "under 1 min left" |
*
*/
export const countdown_under_a_minute: ((inputs?: Countdown_Under_A_MinuteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Countdown_Under_A_MinuteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Clear" |
*
*/
export const date_input_clear: ((inputs?: Date_Input_ClearInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Date_Input_ClearInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "In a week" |
*
*/
export const date_input_in_a_week: ((inputs?: Date_Input_In_A_WeekInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Date_Input_In_A_WeekInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quick picks" |
*
*/
export const date_input_picks: ((inputs?: Date_Input_PicksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Date_Input_PicksInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Quick picks for {label}" |
*
*/
export const date_input_picks_for: ((inputs: Date_Input_Picks_ForInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Date_Input_Picks_ForInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{date} · {relative}" |
*
*/
export const date_input_said: ((inputs: Date_Input_SaidInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Date_Input_SaidInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{date} {time} · {relative}" |
*
*/
export const date_input_said_time: ((inputs: Date_Input_Said_TimeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Date_Input_Said_TimeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Today" |
*
*/
export const date_input_today: ((inputs?: Date_Input_TodayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Date_Input_TodayInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Tomorrow" |
*
*/
export const date_input_tomorrow: ((inputs?: Date_Input_TomorrowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Date_Input_TomorrowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Dial" |
*
*/
export const dial_label: ((inputs?: Dial_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Dial_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{low}–{high}" |
*
*/
export const dial_range: ((inputs: Dial_RangeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Dial_RangeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{value} · {share} of {min}–{max}" |
*
*/
export const dial_reading: ((inputs: Dial_ReadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Dial_ReadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{zone}: {low}–{high}" |
*
*/
export const dial_zone: ((inputs: Dial_ZoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Dial_ZoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "+ Add block" |
*
*/
export const doc_form_add_block: ((inputs?: Doc_Form_Add_BlockInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_Add_BlockInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "+ Add {name}" |
*
*/
export const doc_form_add_named: ((inputs: Doc_Form_Add_NamedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_Add_NamedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Name" |
*
*/
export const doc_form_block_name: ((inputs?: Doc_Form_Block_NameInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_Block_NameInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Choose…" |
*
*/
export const doc_form_choose: ((inputs?: Doc_Form_ChooseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_ChooseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Collapse all" |
*
*/
export const doc_form_collapse_all: ((inputs?: Doc_Form_Collapse_AllInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_Collapse_AllInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Collapse {kind} {number}" |
*
*/
export const doc_form_collapse_row: ((inputs: Doc_Form_Collapse_RowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_Collapse_RowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "+ Create new" |
*
*/
export const doc_form_create_new: ((inputs?: Doc_Form_Create_NewInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_Create_NewInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Details" |
*
*/
export const doc_form_details: ((inputs?: Doc_Form_DetailsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_DetailsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Duplicate" |
*
*/
export const doc_form_duplicate: ((inputs?: Doc_Form_DuplicateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_DuplicateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} error" |
* | * | "{count} errors" |
*
*/
export const doc_form_errors: ((inputs: Doc_Form_ErrorsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_ErrorsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Expand all" |
*
*/
export const doc_form_expand_all: ((inputs?: Doc_Form_Expand_AllInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_Expand_AllInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Expand {kind} {number}" |
*
*/
export const doc_form_expand_row: ((inputs: Doc_Form_Expand_RowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_Expand_RowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Showing {shown} of {total}." |
*
*/
export const doc_form_join_showing: ((inputs: Doc_Form_Join_ShowingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_Join_ShowingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Not valid JSON yet; it's saved once it is." |
*
*/
export const doc_form_json_invalid: ((inputs?: Doc_Form_Json_InvalidInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_Json_InvalidInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Latitude" |
*
*/
export const doc_form_latitude: ((inputs?: Doc_Form_LatitudeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_LatitudeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Longitude" |
*
*/
export const doc_form_longitude: ((inputs?: Doc_Form_LongitudeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_LongitudeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Move down" |
*
*/
export const doc_form_move_down: ((inputs?: Doc_Form_Move_DownInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_Move_DownInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Move up" |
*
*/
export const doc_form_move_up: ((inputs?: Doc_Form_Move_UpInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_Move_UpInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "+ New" |
*
*/
export const doc_form_new: ((inputs?: Doc_Form_NewInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_NewInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No" |
*
*/
export const doc_form_no: ((inputs?: Doc_Form_NoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_NoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "None yet." |
*
*/
export const doc_form_none_yet: ((inputs?: Doc_Form_None_YetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_None_YetInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open" |
*
*/
export const doc_form_open: ((inputs?: Doc_Form_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_OpenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Optional" |
*
*/
export const doc_form_optional: ((inputs?: Doc_Form_OptionalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_OptionalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Remove" |
*
*/
export const doc_form_remove: ((inputs?: Doc_Form_RemoveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_RemoveInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Row" |
*
*/
export const doc_form_row: ((inputs?: Doc_Form_RowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_RowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{kind} {number} actions" |
*
*/
export const doc_form_row_actions: ((inputs: Doc_Form_Row_ActionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_Row_ActionsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{kind} {number}" |
*
*/
export const doc_form_row_title: ((inputs: Doc_Form_Row_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_Row_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "at least {min}" |
*
*/
export const doc_form_rows_at_least: ((inputs: Doc_Form_Rows_At_LeastInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_Rows_At_LeastInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No {items} yet." |
*
*/
export const doc_form_rows_empty: ((inputs: Doc_Form_Rows_EmptyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_Rows_EmptyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The most {items} allowed is {max}." |
*
*/
export const doc_form_rows_max: ((inputs: Doc_Form_Rows_MaxInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_Rows_MaxInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "up to {max}" |
*
*/
export const doc_form_rows_up_to: ((inputs: Doc_Form_Rows_Up_ToInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_Rows_Up_ToInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "The AI couldn't suggest an answer this time. Try again in a moment." |
*
*/
export const doc_form_suggest_failed: ((inputs?: Doc_Form_Suggest_FailedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_Suggest_FailedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing on the form points to an answer yet. Fill in more and try again." |
*
*/
export const doc_form_suggest_nothing: ((inputs?: Doc_Form_Suggest_NothingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_Suggest_NothingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{label} · {count} error" |
* | * | "{label} · {count} errors" |
*
*/
export const doc_form_tab_errors: ((inputs: Doc_Form_Tab_ErrorsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_Tab_ErrorsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Type and press Enter" |
*
*/
export const doc_form_type_enter: ((inputs?: Doc_Form_Type_EnterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_Type_EnterInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Type a number and press Enter" |
*
*/
export const doc_form_type_number_enter: ((inputs?: Doc_Form_Type_Number_EnterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_Type_Number_EnterInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "days" |
*
*/
export const doc_form_unit_days: ((inputs?: Doc_Form_Unit_DaysInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_Unit_DaysInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{label}: unsupported field type \"{type}\"" |
*
*/
export const doc_form_unsupported: ((inputs: Doc_Form_UnsupportedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_UnsupportedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Yes" |
*
*/
export const doc_form_yes: ((inputs?: Doc_Form_YesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Doc_Form_YesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "More info" |
*
*/
export const dropdown_more_info: ((inputs?: Dropdown_More_InfoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Dropdown_More_InfoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Account" |
*
*/
export const edit_view_account: ((inputs?: Edit_View_AccountInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_AccountInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "This can't be undone." |
*
*/
export const edit_view_cannot_undo: ((inputs?: Edit_View_Cannot_UndoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_Cannot_UndoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Create" |
*
*/
export const edit_view_create: ((inputs?: Edit_View_CreateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_CreateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Create new {what}" |
*
*/
export const edit_view_create_title: ((inputs: Edit_View_Create_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_Create_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Created {date}" |
*
*/
export const edit_view_created: ((inputs: Edit_View_CreatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_CreatedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Dashboard" |
*
*/
export const edit_view_dashboard: ((inputs?: Edit_View_DashboardInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_DashboardInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Delete" |
*
*/
export const edit_view_delete: ((inputs?: Edit_View_DeleteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_DeleteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Delete {what}?" |
*
*/
export const edit_view_delete_confirm: ((inputs: Edit_View_Delete_ConfirmInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_Delete_ConfirmInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Details" |
*
*/
export const edit_view_details: ((inputs?: Edit_View_DetailsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_DetailsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "File *" |
*
*/
export const edit_view_file_required: ((inputs?: Edit_View_File_RequiredInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_File_RequiredInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "ID" |
*
*/
export const edit_view_id: ((inputs?: Edit_View_IdInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_IdInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{field}: {name}" |
*
*/
export const edit_view_link: ((inputs: Edit_View_LinkInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_LinkInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "New password" |
*
*/
export const edit_view_new_password: ((inputs?: Edit_View_New_PasswordInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_New_PasswordInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "New {what}" |
*
*/
export const edit_view_new_title: ((inputs: Edit_View_New_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_New_TitleInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Not found" |
*
*/
export const edit_view_not_found: ((inputs?: Edit_View_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_Not_FoundInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "This document doesn't exist or you can't read it." |
*
*/
export const edit_view_not_found_body: ((inputs?: Edit_View_Not_Found_BodyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_Not_Found_BodyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Leave empty to keep the current password." |
*
*/
export const edit_view_password_hint: ((inputs?: Edit_View_Password_HintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_Password_HintInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Password *" |
*
*/
export const edit_view_password_required: ((inputs?: Edit_View_Password_RequiredInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_Password_RequiredInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{field}: {message}" |
*
*/
export const edit_view_problem: ((inputs: Edit_View_ProblemInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_ProblemInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} field needs attention" |
* | * | "{count} fields need attention" |
*
*/
export const edit_view_problems: ((inputs: Edit_View_ProblemsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_ProblemsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Read only" |
*
*/
export const edit_view_read_only: ((inputs?: Edit_View_Read_OnlyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_Read_OnlyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Replace file" |
*
*/
export const edit_view_replace_file: ((inputs?: Edit_View_Replace_FileInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_Replace_FileInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Save" |
*
*/
export const edit_view_save: ((inputs?: Edit_View_SaveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_SaveInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Ctrl + S" |
*
*/
export const edit_view_save_shortcut: ((inputs?: Edit_View_Save_ShortcutInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_Save_ShortcutInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Saved" |
*
*/
export const edit_view_saved: ((inputs?: Edit_View_SavedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_SavedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Saving…" |
*
*/
export const edit_view_saving: ((inputs?: Edit_View_SavingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_SavingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "This screen is loading." |
*
*/
export const edit_view_screen_loading: ((inputs?: Edit_View_Screen_LoadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_Screen_LoadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{what} sections" |
*
*/
export const edit_view_sections: ((inputs: Edit_View_SectionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_SectionsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Setting" |
*
*/
export const edit_view_setting: ((inputs?: Edit_View_SettingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_SettingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Unsaved changes" |
*
*/
export const edit_view_unsaved: ((inputs?: Edit_View_UnsavedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_UnsavedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Updated {date}" |
*
*/
export const edit_view_updated: ((inputs: Edit_View_UpdatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Edit_View_UpdatedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Loading" |
*
*/
export const empty_state_loading: ((inputs?: Empty_State_LoadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Empty_State_LoadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Close" |
*
*/
export const fab_close: ((inputs?: Fab_CloseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Fab_CloseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "About {label}" |
*
*/
export const field_about: ((inputs: Field_AboutInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Field_AboutInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "About this field" |
*
*/
export const field_about_this: ((inputs?: Field_About_ThisInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Field_About_ThisInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{count} / {max}" |
*
*/
export const field_count_of: ((inputs: Field_Count_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Field_Count_OfInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Add at least one." |
*
*/
export const field_error_at_least_one: ((inputs?: Field_Error_At_Least_OneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Field_Error_At_Least_OneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Check this value." |
*
*/
export const field_error_check: ((inputs?: Field_Error_CheckInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Field_Error_CheckInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pick a date." |
*
*/
export const field_error_date: ((inputs?: Field_Error_DateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Field_Error_DateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "An email address, like name@company.com." |
*
*/
export const field_error_email: ((inputs?: Field_Error_EmailInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Field_Error_EmailInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{max} or less." |
*
*/
export const field_error_max: ((inputs: Field_Error_MaxInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Field_Error_MaxInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "At most {count} character." |
* | * | "At most {count} characters." |
*
*/
export const field_error_max_length: ((inputs: Field_Error_Max_LengthInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Field_Error_Max_LengthInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "At most {count} row." |
* | * | "At most {count} rows." |
*
*/
export const field_error_max_rows: ((inputs: Field_Error_Max_RowsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Field_Error_Max_RowsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{min} or more." |
*
*/
export const field_error_min: ((inputs: Field_Error_MinInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Field_Error_MinInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "At least {count} character." |
* | * | "At least {count} characters." |
*
*/
export const field_error_min_length: ((inputs: Field_Error_Min_LengthInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Field_Error_Min_LengthInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "At least {count} row." |
* | * | "At least {count} rows." |
*
*/
export const field_error_min_rows: ((inputs: Field_Error_Min_RowsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Field_Error_Min_RowsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "A number." |
*
*/
export const field_error_number: ((inputs?: Field_Error_NumberInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Field_Error_NumberInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pick one of the options." |
*
*/
export const field_error_option: ((inputs?: Field_Error_OptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Field_Error_OptionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Fill this in to save." |
*
*/
export const field_error_required: ((inputs?: Field_Error_RequiredInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Field_Error_RequiredInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Text only." |
*
*/
export const field_error_text: ((inputs?: Field_Error_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Field_Error_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Required" |
*
*/
export const field_required_pill: ((inputs?: Field_Required_PillInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Field_Required_PillInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Suggest {label}" |
*
*/
export const field_suggest: ((inputs: Field_SuggestInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Field_SuggestInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Suggest an answer" |
*
*/
export const field_suggest_answer: ((inputs?: Field_Suggest_AnswerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Field_Suggest_AnswerInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Dismiss the suggestion" |
*
*/
export const field_suggestion_dismiss: ((inputs?: Field_Suggestion_DismissInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Field_Suggestion_DismissInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Use" |
*
*/
export const field_suggestion_use: ((inputs?: Field_Suggestion_UseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Field_Suggestion_UseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Suggested: {suggestion}. Use it" |
*
*/
export const field_suggestion_use_label: ((inputs: Field_Suggestion_Use_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Field_Suggestion_Use_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Add filter" |
*
*/
export const filter_builder_add_filter: ((inputs?: Filter_Builder_Add_FilterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_Add_FilterInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Clear filters" |
*
*/
export const filter_builder_clear: ((inputs?: Filter_Builder_ClearInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_ClearInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Field" |
*
*/
export const filter_builder_field: ((inputs?: Filter_Builder_FieldInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_FieldInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Filter" |
*
*/
export const filter_builder_filter: ((inputs?: Filter_Builder_FilterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_FilterInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Is" |
*
*/
export const filter_builder_is: ((inputs?: Filter_Builder_IsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_IsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Match" |
*
*/
export const filter_builder_match: ((inputs?: Filter_Builder_MatchInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_MatchInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "all" |
*
*/
export const filter_builder_match_all: ((inputs?: Filter_Builder_Match_AllInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_Match_AllInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "any" |
*
*/
export const filter_builder_match_any: ((inputs?: Filter_Builder_Match_AnyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_Match_AnyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "after" |
*
*/
export const filter_builder_op_after: ((inputs?: Filter_Builder_Op_AfterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_Op_AfterInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "is any of" |
*
*/
export const filter_builder_op_any_of: ((inputs?: Filter_Builder_Op_Any_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_Op_Any_OfInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "before" |
*
*/
export const filter_builder_op_before: ((inputs?: Filter_Builder_Op_BeforeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_Op_BeforeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "contains" |
*
*/
export const filter_builder_op_contains: ((inputs?: Filter_Builder_Op_ContainsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_Op_ContainsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "is" |
*
*/
export const filter_builder_op_is: ((inputs?: Filter_Builder_Op_IsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_Op_IsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "is empty" |
*
*/
export const filter_builder_op_is_empty: ((inputs?: Filter_Builder_Op_Is_EmptyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_Op_Is_EmptyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "is not" |
*
*/
export const filter_builder_op_is_not: ((inputs?: Filter_Builder_Op_Is_NotInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_Op_Is_NotInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "is set" |
*
*/
export const filter_builder_op_is_set: ((inputs?: Filter_Builder_Op_Is_SetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_Op_Is_SetInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "is no" |
*
*/
export const filter_builder_op_no: ((inputs?: Filter_Builder_Op_NoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_Op_NoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "is none of" |
*
*/
export const filter_builder_op_none_of: ((inputs?: Filter_Builder_Op_None_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_Op_None_OfInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "doesn't contain" |
*
*/
export const filter_builder_op_not_contains: ((inputs?: Filter_Builder_Op_Not_ContainsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_Op_Not_ContainsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "is yes" |
*
*/
export const filter_builder_op_yes: ((inputs?: Filter_Builder_Op_YesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_Op_YesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Remove" |
*
*/
export const filter_builder_remove: ((inputs?: Filter_Builder_RemoveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_RemoveInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Remove filter: {field}" |
*
*/
export const filter_builder_remove_filter: ((inputs: Filter_Builder_Remove_FilterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_Remove_FilterInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Search {field}" |
*
*/
export const filter_builder_search_options: ((inputs: Filter_Builder_Search_OptionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_Search_OptionsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Update" |
*
*/
export const filter_builder_update: ((inputs?: Filter_Builder_UpdateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_UpdateInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Value" |
*
*/
export const filter_builder_value: ((inputs?: Filter_Builder_ValueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_ValueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{values} +{count}" |
*
*/
export const filter_builder_values_more: ((inputs: Filter_Builder_Values_MoreInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Filter_Builder_Values_MoreInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Collapse {what}" |
*
*/
export const frame_collapse: ((inputs: Frame_CollapseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Frame_CollapseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Drag to close {what}" |
*
*/
export const frame_drag_to_close: ((inputs: Frame_Drag_To_CloseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Frame_Drag_To_CloseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Drag to open {what}" |
*
*/
export const frame_drag_to_open: ((inputs: Frame_Drag_To_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Frame_Drag_To_OpenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Expand {what}" |
*
*/
export const frame_expand: ((inputs: Frame_ExpandInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Frame_ExpandInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pane sizes" |
*
*/
export const frame_panes: ((inputs?: Frame_PanesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Frame_PanesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Resize" |
*
*/
export const frame_resize: ((inputs?: Frame_ResizeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Frame_ResizeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Resize to close {what}" |
*
*/
export const frame_resize_to_close: ((inputs: Frame_Resize_To_CloseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Frame_Resize_To_CloseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Resize to open {what}" |
*
*/
export const frame_resize_to_open: ((inputs: Frame_Resize_To_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Frame_Resize_To_OpenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Show {what} icons" |
*
*/
export const frame_show_icons: ((inputs: Frame_Show_IconsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Frame_Show_IconsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{share} of {from} reach {to}" |
*
*/
export const funnel_caption: ((inputs: Funnel_CaptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Funnel_CaptionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{share} {step}" |
*
*/
export const funnel_step: ((inputs: Funnel_StepInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Funnel_StepInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "went on" |
*
*/
export const funnel_step_went_on: ((inputs?: Funnel_Step_Went_OnInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Funnel_Step_Went_OnInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Gauge" |
*
*/
export const gauge_label: ((inputs?: Gauge_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Gauge_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{value} of {max}" |
*
*/
export const gauge_value_of: ((inputs: Gauge_Value_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Gauge_Value_OfInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Heatmap" |
*
*/
export const heatmap_label: ((inputs?: Heatmap_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Heatmap_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Less" |
*
*/
export const heatmap_less: ((inputs?: Heatmap_LessInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Heatmap_LessInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "More" |
*
*/
export const heatmap_more: ((inputs?: Heatmap_MoreInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Heatmap_MoreInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{column}, {count} card" |
* | * | "{column}, {count} cards" |
*
*/
export const kanban_column: ((inputs: Kanban_ColumnInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Kanban_ColumnInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Dragging {card}. Drop it on a column, or press Escape to cancel." |
*
*/
export const kanban_dragging: ((inputs: Kanban_DraggingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Kanban_DraggingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Moved to {column}." |
*
*/
export const kanban_moved: ((inputs: Kanban_MovedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Kanban_MovedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Not moved." |
*
*/
export const kanban_not_moved: ((inputs?: Kanban_Not_MovedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Kanban_Not_MovedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{lines} lines in {px}px" |
*
*/
export const layout_cramped: ((inputs: Layout_CrampedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Layout_CrampedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | box | output |
* | --- | --- |
* | "list_row" | "{px}px past its list row" |
* | "card" | "{px}px past its card" |
* | "page" | "{px}px past its page" |
* | "dialog" | "{px}px past its dialog" |
* | "component" | "{px}px past its {name}" |
* | * | "{px}px past its box" |
*
*/
export const layout_escapes: ((inputs: Layout_EscapesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Layout_EscapesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{px}px wider than the page" |
*
*/
export const layout_page_scroll: ((inputs: Layout_Page_ScrollInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Layout_Page_ScrollInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "squeezed to {px}px" |
*
*/
export const layout_squeezed: ((inputs: Layout_SqueezedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Layout_SqueezedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{things} by {field}" |
*
*/
export const list_view_by: ((inputs: List_View_ByInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_ByInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{count} by {field}" |
*
*/
export const list_view_calendar_count: ((inputs: List_View_Calendar_CountInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Calendar_CountInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{things} by {field}, {month}" |
*
*/
export const list_view_calendar_label: ((inputs: List_View_Calendar_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Calendar_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "This can't be undone." |
*
*/
export const list_view_cannot_undo: ((inputs?: List_View_Cannot_UndoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Cannot_UndoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | bucket | output |
* | --- | --- |
* | "month" | "{field}, by month" |
* | "week" | "{field}, by week" |
* | * | "{field}, by day" |
*
*/
export const list_view_chart_bucket: ((inputs: List_View_Chart_BucketInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Chart_BucketInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Clear search and filters" |
*
*/
export const list_view_clear_filters: ((inputs?: List_View_Clear_FiltersInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Clear_FiltersInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Clear selection" |
*
*/
export const list_view_clear_selection: ((inputs?: List_View_Clear_SelectionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Clear_SelectionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} {singular}" |
* | * | "{count} {plural}" |
*
*/
export const list_view_count_of: ((inputs: List_View_Count_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Count_OfInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Create the first one." |
*
*/
export const list_view_create_first: ((inputs?: List_View_Create_FirstInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Create_FirstInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "+ Create new {singular}" |
*
*/
export const list_view_create_new: ((inputs: List_View_Create_NewInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Create_NewInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Created" |
*
*/
export const list_view_created: ((inputs?: List_View_CreatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_CreatedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Dashboard" |
*
*/
export const list_view_dashboard: ((inputs?: List_View_DashboardInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_DashboardInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Delete" |
*
*/
export const list_view_delete: ((inputs?: List_View_DeleteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_DeleteInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Delete {count}" |
*
*/
export const list_view_delete_count: ((inputs: List_View_Delete_CountInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Delete_CountInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "Delete {count} {singular}?" |
* | * | "Delete {count} {plural}?" |
*
*/
export const list_view_delete_heading: ((inputs: List_View_Delete_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Delete_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Discard" |
*
*/
export const list_view_discard: ((inputs?: List_View_DiscardInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_DiscardInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Discard unsaved changes?" |
*
*/
export const list_view_discard_heading: ((inputs?: List_View_Discard_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Discard_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "What you changed in {title} hasn't been saved." |
*
*/
export const list_view_discard_text: ((inputs: List_View_Discard_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Discard_TextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No {things} yet" |
*
*/
export const list_view_empty: ((inputs: List_View_EmptyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_EmptyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No {things} match" |
*
*/
export const list_view_empty_filtered: ((inputs: List_View_Empty_FilteredInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Empty_FilteredInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Export CSV" |
*
*/
export const list_view_export_csv: ((inputs?: List_View_Export_CsvInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Export_CsvInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{things} per day by {field}" |
*
*/
export const list_view_heatmap_label: ((inputs: List_View_Heatmap_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Heatmap_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{total} {things} in 12 weeks by {field}" |
*
*/
export const list_view_heatmap_summary: ((inputs: List_View_Heatmap_SummaryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Heatmap_SummaryInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "ID" |
*
*/
export const list_view_id: ((inputs?: List_View_IdInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_IdInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "item" |
*
*/
export const list_view_item: ((inputs?: List_View_ItemInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_ItemInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "items" |
*
*/
export const list_view_items: ((inputs?: List_View_ItemsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_ItemsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Keep editing" |
*
*/
export const list_view_keep_editing: ((inputs?: List_View_Keep_EditingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Keep_EditingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Board" |
*
*/
export const list_view_layout_board: ((inputs?: List_View_Layout_BoardInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Layout_BoardInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Calendar" |
*
*/
export const list_view_layout_calendar: ((inputs?: List_View_Layout_CalendarInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Layout_CalendarInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Cards" |
*
*/
export const list_view_layout_cards: ((inputs?: List_View_Layout_CardsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Layout_CardsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Chart by {field}" |
*
*/
export const list_view_layout_chart: ((inputs: List_View_Layout_ChartInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Layout_ChartInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Compact" |
*
*/
export const list_view_layout_compact: ((inputs?: List_View_Layout_CompactInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Layout_CompactInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Focus, one at a time" |
*
*/
export const list_view_layout_focus: ((inputs?: List_View_Layout_FocusInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Layout_FocusInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Grouped by {field}" |
*
*/
export const list_view_layout_groups: ((inputs: List_View_Layout_GroupsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Layout_GroupsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Heatmap" |
*
*/
export const list_view_layout_heatmap: ((inputs?: List_View_Layout_HeatmapInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Layout_HeatmapInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "List" |
*
*/
export const list_view_layout_list: ((inputs?: List_View_Layout_ListInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Layout_ListInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Ranking by {field}" |
*
*/
export const list_view_layout_ranking: ((inputs: List_View_Layout_RankingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Layout_RankingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Scatter" |
*
*/
export const list_view_layout_scatter: ((inputs?: List_View_Layout_ScatterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Layout_ScatterInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Table" |
*
*/
export const list_view_layout_table: ((inputs?: List_View_Layout_TableInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Layout_TableInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Timeline" |
*
*/
export const list_view_layout_timeline: ((inputs?: List_View_Layout_TimelineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Layout_TimelineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Treemap" |
*
*/
export const list_view_layout_treemap: ((inputs?: List_View_Layout_TreemapInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Layout_TreemapInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Loading…" |
*
*/
export const list_view_loading: ((inputs?: List_View_LoadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_LoadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{title} stays in {column}: {error}" |
*
*/
export const list_view_move_failed: ((inputs: List_View_Move_FailedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Move_FailedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Move {title}" |
*
*/
export const list_view_move_menu: ((inputs: List_View_Move_MenuInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Move_MenuInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Move to {column}" |
*
*/
export const list_view_move_to: ((inputs: List_View_Move_ToInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Move_ToInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{title} → {column}" |
*
*/
export const list_view_moved: ((inputs: List_View_MovedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_MovedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "+ New {singular}" |
*
*/
export const list_view_new: ((inputs: List_View_NewInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_NewInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Next" |
*
*/
export const list_view_next: ((inputs?: List_View_NextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_NextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Next month" |
*
*/
export const list_view_next_month: ((inputs?: List_View_Next_MonthInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Next_MonthInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No records" |
*
*/
export const list_view_no_records: ((inputs?: List_View_No_RecordsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_No_RecordsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No {field}" |
*
*/
export const list_view_none_column: ((inputs: List_View_None_ColumnInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_None_ColumnInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "no {field}" |
*
*/
export const list_view_none_inline: ((inputs: List_View_None_InlineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_None_InlineInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open" |
*
*/
export const list_view_open: ((inputs?: List_View_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_OpenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open full page" |
*
*/
export const list_view_open_full: ((inputs?: List_View_Open_FullInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Open_FullInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{what} pages" |
*
*/
export const list_view_pages: ((inputs: List_View_PagesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_PagesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{at} of {total}" |
*
*/
export const list_view_position: ((inputs: List_View_PositionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_PositionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Previous" |
*
*/
export const list_view_previous: ((inputs?: List_View_PreviousInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_PreviousInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Previous month" |
*
*/
export const list_view_previous_month: ((inputs?: List_View_Previous_MonthInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Previous_MonthInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{from}–{to} of {total}" |
*
*/
export const list_view_range: ((inputs: List_View_RangeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_RangeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Read only" |
*
*/
export const list_view_read_only: ((inputs?: List_View_Read_OnlyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Read_OnlyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Rows" |
*
*/
export const list_view_rows: ((inputs?: List_View_RowsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_RowsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Save" |
*
*/
export const list_view_save: ((inputs?: List_View_SaveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_SaveInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Saved" |
*
*/
export const list_view_saved: ((inputs?: List_View_SavedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_SavedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Saving…" |
*
*/
export const list_view_saving: ((inputs?: List_View_SavingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_SavingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{things}: {x} and {y}" |
*
*/
export const list_view_scatter_label: ((inputs: List_View_Scatter_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Scatter_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Search by {field}" |
*
*/
export const list_view_search_by: ((inputs: List_View_Search_ByInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Search_ByInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Select all {total} {things}" |
*
*/
export const list_view_select_all: ((inputs: List_View_Select_AllInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Select_AllInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Select all {total} matching" |
*
*/
export const list_view_select_all_matching: ((inputs: List_View_Select_All_MatchingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Select_All_MatchingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{count} selected" |
*
*/
export const list_view_selected: ((inputs: List_View_SelectedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_SelectedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Selection" |
*
*/
export const list_view_selection: ((inputs?: List_View_SelectionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_SelectionInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sort" |
*
*/
export const list_view_sort: ((inputs?: List_View_SortInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_SortInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Default order" |
*
*/
export const list_view_sort_default: ((inputs?: List_View_Sort_DefaultInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_Sort_DefaultInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "This month" |
*
*/
export const list_view_this_month: ((inputs?: List_View_This_MonthInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_This_MonthInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Undo" |
*
*/
export const list_view_undo: ((inputs?: List_View_UndoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_UndoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Unsaved changes" |
*
*/
export const list_view_unsaved: ((inputs?: List_View_UnsavedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_UnsavedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Updated" |
*
*/
export const list_view_updated: ((inputs?: List_View_UpdatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_UpdatedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "View" |
*
*/
export const list_view_view: ((inputs?: List_View_ViewInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_ViewInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "With {person}" |
*
*/
export const list_view_with: ((inputs: List_View_WithInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<List_View_WithInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Loading" |
*
*/
export const loading_label: ((inputs?: Loading_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Loading_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Bad response" |
*
*/
export const message_bad_response: ((inputs?: Message_Bad_ResponseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Message_Bad_ResponseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Copied" |
*
*/
export const message_copied: ((inputs?: Message_CopiedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Message_CopiedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Copy" |
*
*/
export const message_copy: ((inputs?: Message_CopyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Message_CopyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Edit" |
*
*/
export const message_edit: ((inputs?: Message_EditInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Message_EditInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Good response" |
*
*/
export const message_good_response: ((inputs?: Message_Good_ResponseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Message_Good_ResponseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Retry" |
*
*/
export const message_retry: ((inputs?: Message_RetryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Message_RetryInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Jump to latest" |
*
*/
export const message_scroller_jump: ((inputs?: Message_Scroller_JumpInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Message_Scroller_JumpInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Cancel" |
*
*/
export const modal_cancel: ((inputs?: Modal_CancelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Modal_CancelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Close" |
*
*/
export const modal_close: ((inputs?: Modal_CloseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Modal_CloseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Model: {name}" |
*
*/
export const model_selector_label: ((inputs: Model_Selector_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Model_Selector_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{day}, {count} due" |
* | * | "{day}, {count} due" |
*
*/
export const month_day_due: ((inputs: Month_Day_DueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Month_Day_DueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing due" |
*
*/
export const month_nothing_due: ((inputs?: Month_Nothing_DueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Month_Nothing_DueInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{value} d" |
*
*/
export const number_days: ((inputs: Number_DaysInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Number_DaysInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{value} h" |
*
*/
export const number_hours: ((inputs: Number_HoursInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Number_HoursInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{value} min" |
*
*/
export const number_minutes: ((inputs: Number_MinutesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Number_MinutesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{currency} {amount}" |
*
*/
export const number_money: ((inputs: Number_MoneyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Number_MoneyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{currency} {amount}k" |
*
*/
export const number_money_compact: ((inputs: Number_Money_CompactInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Number_Money_CompactInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{value}%" |
*
*/
export const number_pct: ((inputs: Number_PctInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Number_PctInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{amount}k" |
*
*/
export const number_thousands: ((inputs: Number_ThousandsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Number_ThousandsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "One-time code" |
*
*/
export const otp_label: ((inputs?: Otp_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Otp_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pagination" |
*
*/
export const pagination_label: ((inputs?: Pagination_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Pagination_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Next page" |
*
*/
export const pagination_next: ((inputs?: Pagination_NextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Pagination_NextInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Page {page} of {total}" |
*
*/
export const pagination_page_of: ((inputs: Pagination_Page_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Pagination_Page_OfInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Pages {from} to {to}" |
*
*/
export const pagination_pages_range: ((inputs: Pagination_Pages_RangeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Pagination_Pages_RangeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Previous page" |
*
*/
export const pagination_previous: ((inputs?: Pagination_PreviousInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Pagination_PreviousInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Message" |
*
*/
export const prompt_input_label: ((inputs?: Prompt_Input_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Prompt_Input_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Send" |
*
*/
export const prompt_input_send: ((inputs?: Prompt_Input_SendInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Prompt_Input_SendInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Stop" |
*
*/
export const prompt_input_stop: ((inputs?: Prompt_Input_StopInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Prompt_Input_StopInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{measure} {value}" |
*
*/
export const quadrant_measure: ((inputs: Quadrant_MeasureInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Quadrant_MeasureInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{point}, {quadrant}" |
*
*/
export const quadrant_point: ((inputs: Quadrant_PointInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Quadrant_PointInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Split at {x} · {y}" |
*
*/
export const quadrant_split: ((inputs: Quadrant_SplitInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Quadrant_SplitInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{measure} →" |
*
*/
export const quadrant_x_axis: ((inputs: Quadrant_X_AxisInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Quadrant_X_AxisInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Not rated" |
*
*/
export const rating_none: ((inputs?: Rating_NoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Rating_NoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{value} of {max}" |
*
*/
export const rating_of: ((inputs: Rating_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Rating_OfInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{value}: {words}" |
*
*/
export const rating_star_words: ((inputs: Rating_Star_WordsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Rating_Star_WordsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{title}, {status}" |
*
*/
export const record_named: ((inputs: Record_NamedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Record_NamedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Related" |
*
*/
export const record_related: ((inputs?: Record_RelatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Record_RelatedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Clear search" |
*
*/
export const search_clear: ((inputs?: Search_ClearInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Search_ClearInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Search" |
*
*/
export const search_label: ((inputs?: Search_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Search_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Couldn't update bookmarks: {error}" |
*
*/
export const shared_bookmarks_failed: ((inputs: Shared_Bookmarks_FailedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Shared_Bookmarks_FailedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Collections" |
*
*/
export const shared_collections: ((inputs?: Shared_CollectionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Shared_CollectionsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Configuration" |
*
*/
export const shared_configuration: ((inputs?: Shared_ConfigurationInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Shared_ConfigurationInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No" |
*
*/
export const shared_no: ((inputs?: Shared_NoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Shared_NoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} row" |
* | * | "{count} rows" |
*
*/
export const shared_rows: ((inputs: Shared_RowsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Shared_RowsInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Untitled" |
*
*/
export const shared_untitled: ((inputs?: Shared_UntitledInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Shared_UntitledInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Yes" |
*
*/
export const shared_yes: ((inputs?: Shared_YesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Shared_YesInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Close" |
*
*/
export const sheet_close: ((inputs?: Sheet_CloseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sheet_CloseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Assistant" |
*
*/
export const site_assistant_name: ((inputs?: Site_Assistant_NameInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Site_Assistant_NameInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Dashboard" |
*
*/
export const site_default_name: ((inputs?: Site_Default_NameInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Site_Default_NameInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Loading" |
*
*/
export const skeleton_loading: ((inputs?: Skeleton_LoadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Skeleton_LoadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Dismiss" |
*
*/
export const snackbar_dismiss: ((inputs?: Snackbar_DismissInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Snackbar_DismissInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "Used {count} source" |
* | * | "Used {count} sources" |
*
*/
export const sources_used: ((inputs: Sources_UsedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Sources_UsedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Down" |
*
*/
export const stat_delta_down: ((inputs?: Stat_Delta_DownInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Stat_Delta_DownInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "No change" |
*
*/
export const stat_delta_flat: ((inputs?: Stat_Delta_FlatInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Stat_Delta_FlatInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Up" |
*
*/
export const stat_delta_up: ((inputs?: Stat_Delta_UpInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Stat_Delta_UpInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Less" |
*
*/
export const stepper_less: ((inputs?: Stepper_LessInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Stepper_LessInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Less {label}" |
*
*/
export const stepper_less_of: ((inputs: Stepper_Less_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Stepper_Less_OfInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "More" |
*
*/
export const stepper_more: ((inputs?: Stepper_MoreInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Stepper_MoreInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "More {label}" |
*
*/
export const stepper_more_of: ((inputs: Stepper_More_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Stepper_More_OfInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "(done)" |
*
*/
export const steps_done: ((inputs?: Steps_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Steps_DoneInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "(skipped)" |
*
*/
export const steps_skipped: ((inputs?: Steps_SkippedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Steps_SkippedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Suggestions" |
*
*/
export const suggestions_label: ((inputs?: Suggestions_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Suggestions_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{column} fits its content" |
*
*/
export const table_column_fit: ((inputs: Table_Column_FitInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Table_Column_FitInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{column} moved to column {place} of {total}" |
*
*/
export const table_column_moved: ((inputs: Table_Column_MovedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Table_Column_MovedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | widthPlural | output |
* | --- | --- |
* | "one" | "{column} {width} pixel wide" |
* | * | "{column} {width} pixels wide" |
*
*/
export const table_column_width: ((inputs: Table_Column_WidthInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Table_Column_WidthInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Resize {column} column" |
*
*/
export const table_resize_column: ((inputs: Table_Resize_ColumnInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Table_Resize_ColumnInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Drag to resize · double-click to fit" |
*
*/
export const table_resize_hint: ((inputs?: Table_Resize_HintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Table_Resize_HintInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Select all" |
*
*/
export const table_select_all: ((inputs?: Table_Select_AllInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Table_Select_AllInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Select row {row}" |
*
*/
export const table_select_row: ((inputs: Table_Select_RowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Table_Select_RowInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sort (Shift-click to sort by several columns)" |
*
*/
export const table_sort_hint: ((inputs?: Table_Sort_HintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Table_Sort_HintInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Sort (Shift-click to sort by several columns). Drag or Ctrl+Shift+← / → to move" |
*
*/
export const table_sort_move_hint: ((inputs?: Table_Sort_Move_HintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Table_Sort_Move_HintInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Move" |
*
*/
export const tile_move: ((inputs?: Tile_MoveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Tile_MoveInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Drag to move. Click for more. Arrow keys: earlier or later. Delete: hide." |
*
*/
export const tile_move_hint: ((inputs?: Tile_Move_HintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Tile_Move_HintInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Move {name}" |
*
*/
export const tile_move_named: ((inputs: Tile_Move_NamedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Tile_Move_NamedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Remove" |
*
*/
export const tile_remove: ((inputs?: Tile_RemoveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Tile_RemoveInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Remove {name}" |
*
*/
export const tile_remove_named: ((inputs: Tile_Remove_NamedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Tile_Remove_NamedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Resize" |
*
*/
export const tile_resize: ((inputs?: Tile_ResizeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Tile_ResizeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Drag to resize. Arrow keys: a tile at a time." |
*
*/
export const tile_resize_hint: ((inputs?: Tile_Resize_HintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Tile_Resize_HintInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Resize {name}" |
*
*/
export const tile_resize_named: ((inputs: Tile_Resize_NamedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Tile_Resize_NamedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Show all" |
*
*/
export const tile_show_all: ((inputs?: Tile_Show_AllInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Tile_Show_AllInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Show less" |
*
*/
export const tile_show_less: ((inputs?: Tile_Show_LessInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Tile_Show_LessInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{tour} · signed in as {name} ({role})" |
*
*/
export const tour_eyebrow_signed_in: ((inputs: Tour_Eyebrow_Signed_InInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Tour_Eyebrow_Signed_InInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{label}, {amount}, {share}" |
*
*/
export const treemap_cell: ((inputs: Treemap_CellInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Treemap_CellInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Other" |
*
*/
export const visual_other: ((inputs?: Visual_OtherInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Visual_OtherInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Share" |
*
*/
export const waffle_label: ((inputs?: Waffle_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Waffle_LabelInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{value} {caption}" |
*
*/
export const waffle_reading: ((inputs: Waffle_ReadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Waffle_ReadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{label}: {change} → {run}" |
*
*/
export const waterfall_change: ((inputs: Waterfall_ChangeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Waterfall_ChangeInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Decrease" |
*
*/
export const waterfall_decrease: ((inputs?: Waterfall_DecreaseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Waterfall_DecreaseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Increase" |
*
*/
export const waterfall_increase: ((inputs?: Waterfall_IncreaseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Waterfall_IncreaseInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{label}: {run}" |
*
*/
export const waterfall_total: ((inputs: Waterfall_TotalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Waterfall_TotalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Total" |
*
*/
export const waterfall_total_key: ((inputs?: Waterfall_Total_KeyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Waterfall_Total_KeyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reset" |
*
*/
export const whatif_reset: ((inputs?: Whatif_ResetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Whatif_ResetInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Ask a question…" |
*
*/
export const widget_ask_placeholder: ((inputs?: Widget_Ask_PlaceholderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Ask_PlaceholderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reading the records…" |
*
*/
export const widget_ask_reading: ((inputs?: Widget_Ask_ReadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Ask_ReadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Attach {what}." |
*
*/
export const widget_attach: ((inputs: Widget_AttachInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_AttachInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Chart" |
*
*/
export const widget_blocks_chart: ((inputs?: Widget_Blocks_ChartInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Blocks_ChartInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "went on" |
*
*/
export const widget_blocks_funnel_step: ((inputs?: Widget_Blocks_Funnel_StepInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Blocks_Funnel_StepInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "More" |
*
*/
export const widget_blocks_more: ((inputs?: Widget_Blocks_MoreInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Blocks_MoreInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Dashboard" |
*
*/
export const widget_dashboard: ((inputs?: Widget_DashboardInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_DashboardInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "All {what}" |
*
*/
export const widget_data_all: ((inputs: Widget_Data_AllInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Data_AllInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "in all" |
*
*/
export const widget_data_in_all: ((inputs?: Widget_Data_In_AllInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Data_In_AllInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "You don't have access to this." |
*
*/
export const widget_denied: ((inputs?: Widget_DeniedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_DeniedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Nothing here yet." |
*
*/
export const widget_empty: ((inputs?: Widget_EmptyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_EmptyInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "That didn't work." |
*
*/
export const widget_failed: ((inputs?: Widget_FailedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_FailedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Fill in {fields}." |
*
*/
export const widget_fill_in: ((inputs: Widget_Fill_InInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Fill_InInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Fill in" |
*
*/
export const widget_fill_in_button: ((inputs?: Widget_Fill_In_ButtonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Fill_In_ButtonInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "All" |
*
*/
export const widget_host_all: ((inputs?: Widget_Host_AllInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Host_AllInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Compact" |
*
*/
export const widget_host_compact: ((inputs?: Widget_Host_CompactInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Host_CompactInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "its screen" |
*
*/
export const widget_host_its_screen: ((inputs?: Widget_Host_Its_ScreenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Host_Its_ScreenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Keep it here" |
*
*/
export const widget_host_keep_here: ((inputs?: Widget_Host_Keep_HereInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Host_Keep_HereInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{name} is in your widgets" |
*
*/
export const widget_host_kept: ((inputs: Widget_Host_KeptInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Host_KeptInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reset layout" |
*
*/
export const widget_host_reset_layout: ((inputs?: Widget_Host_Reset_LayoutInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Host_Reset_LayoutInputs, { locale?: "en" | "ar" }, {}>;
/**
* | countPlural | output |
* | --- | --- |
* | "one" | "Show {count} hidden tile" |
* | * | "Show {count} hidden tiles" |
*
*/
export const widget_host_show_hidden: ((inputs: Widget_Host_Show_HiddenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Host_Show_HiddenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "tile" |
*
*/
export const widget_host_tile: ((inputs?: Widget_Host_TileInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Host_TileInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "This couldn't load" |
*
*/
export const widget_load_failed: ((inputs?: Widget_Load_FailedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Load_FailedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "of {max}" |
*
*/
export const widget_mini_of: ((inputs: Widget_Mini_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Mini_OfInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Open {label}" |
*
*/
export const widget_mini_open: ((inputs: Widget_Mini_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Mini_OpenInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Other" |
*
*/
export const widget_mini_other: ((inputs?: Widget_Mini_OtherInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Mini_OtherInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Reading" |
*
*/
export const widget_mini_reading: ((inputs?: Widget_Mini_ReadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Mini_ReadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Share" |
*
*/
export const widget_mini_share: ((inputs?: Widget_Mini_ShareInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Mini_ShareInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Step {step} of {total}: {label}" |
*
*/
export const widget_mini_step: ((inputs: Widget_Mini_StepInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Mini_StepInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{count} more" |
*
*/
export const widget_more_heading: ((inputs: Widget_More_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_More_HeadingInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Paste the message here…" |
*
*/
export const widget_paste_placeholder: ((inputs?: Widget_Paste_PlaceholderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Paste_PlaceholderInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "That didn't save." |
*
*/
export const widget_save_failed: ((inputs?: Widget_Save_FailedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Save_FailedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{pct}% of all {noun}" |
*
*/
export const widget_share_of_all: ((inputs: Widget_Share_Of_AllInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Share_Of_AllInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "of {label} ({value})" |
*
*/
export const widget_share_of_first: ((inputs: Widget_Share_Of_FirstInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Share_Of_FirstInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "of {max}" |
*
*/
export const widget_share_of_max: ((inputs: Widget_Share_Of_MaxInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Share_Of_MaxInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "{pct}% of {total} {noun}" |
*
*/
export const widget_share_of_total: ((inputs: Widget_Share_Of_TotalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Share_Of_TotalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Total" |
*
*/
export const widget_total: ((inputs?: Widget_TotalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_TotalInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Undo" |
*
*/
export const widget_undo: ((inputs?: Widget_UndoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_UndoInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "That couldn't be undone." |
*
*/
export const widget_undo_failed: ((inputs?: Widget_Undo_FailedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_Undo_FailedInputs, { locale?: "en" | "ar" }, {}>;
/**
* | output |
* | --- |
* | "Undone" |
*
*/
export const widget_undone: ((inputs?: Widget_UndoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & __ParaglideMessageMetadata<Widget_UndoneInputs, { locale?: "en" | "ar" }, {}>;
export type LocalizedString = import("../runtime.js").LocalizedString;
export type Agent_AllowInputs = { action: NonNullable<unknown> };
export type Agent_Allow_DescriptionInputs = {};
export type Agent_Builtin_Too_SmallInputs = {};
export type Agent_Builtin_UnavailableInputs = {};
export type Agent_Could_Not_FinishInputs = {};
export type Agent_Decided_AnswerInputs = {};
export type Agent_Decided_GroundedInputs = { tool: NonNullable<unknown> };
export type Agent_Decided_ToolInputs = { tool: NonNullable<unknown> };
export type Agent_Decided_ToolsInputs = { tools: NonNullable<unknown> };
export type Agent_DetailsInputs = {};
export type Agent_DownloadingInputs = {};
export type Agent_Downloading_ProgressInputs = { percent: NonNullable<unknown> };
export type Agent_Empty_BodyInputs = {};
export type Agent_Empty_HeadingInputs = {};
export type Agent_Find_NothingInputs = { query: NonNullable<unknown> };
export type Agent_Local_BodyInputs = {};
export type Agent_Local_DownloadInputs = {};
export type Agent_Local_HeadingInputs = { model: NonNullable<unknown> };
export type Agent_Local_LoadingInputs = {};
export type Agent_Model_Load_FailedInputs = { error: NonNullable<unknown> };
export type Agent_Model_OutputInputs = {};
export type Agent_Models_CloudInputs = {};
export type Agent_Models_DeviceInputs = {};
export type Agent_My_Day_EmptyInputs = {};
export type Agent_New_ChatInputs = {};
export type Agent_No_Builtin_ModelInputs = { model: NonNullable<unknown> };
export type Agent_OpenInputs = { helper: NonNullable<unknown> };
export type Agent_Openai_FailedInputs = { status: NonNullable<unknown> };
export type Agent_OpenedInputs = { title: NonNullable<unknown>, path: NonNullable<unknown> };
export type Agent_Prompt_PlaceholderInputs = {};
export type Agent_Record_PageInputs = { path: NonNullable<unknown> };
export type Agent_Screen_AboutInputs = { description: NonNullable<unknown> };
export type Agent_Screen_ListInputs = { label: NonNullable<unknown>, count: NonNullable<unknown> };
export type Agent_Screen_PageInputs = { title: NonNullable<unknown>, path: NonNullable<unknown> };
export type Agent_Screen_RecordInputs = { singular: NonNullable<unknown>, title: NonNullable<unknown> };
export type Agent_Screen_SettingsInputs = { label: NonNullable<unknown> };
export type Agent_Screen_Signed_InInputs = { name: NonNullable<unknown>, role: NonNullable<unknown> };
export type Agent_Screen_Signed_OutInputs = {};
export type Agent_Screen_TabsInputs = { tabs: NonNullable<unknown> };
export type Agent_Screen_ViewInputs = { title: NonNullable<unknown> };
export type Agent_SourcesInputs = { sources: NonNullable<unknown> };
export type Agent_Suggest_ApprovalsInputs = {};
export type Agent_Suggest_PageInputs = {};
export type Agent_Suggest_ScreenInputs = {};
export type Agent_Suggest_TodayInputs = {};
export type Agent_ThinkingInputs = {};
export type Agent_Thought_ForInputs = { seconds: NonNullable<unknown> };
export type Agent_Thought_OpenedInputs = {};
export type Agent_Thought_RoutedInputs = { tool: NonNullable<unknown> };
export type Agent_Too_Many_StepsInputs = {};
export type Agent_Tool_Ask_AssistantInputs = {};
export type Agent_Tool_Ask_RecordsInputs = {};
export type Agent_Tool_Call_WorkflowInputs = {};
export type Agent_Tool_Check_AccessibilityInputs = {};
export type Agent_Tool_Count_DocumentsInputs = {};
export type Agent_Tool_Create_DocumentInputs = {};
export type Agent_Tool_Delete_DocumentInputs = {};
export type Agent_Tool_Describe_SchemaInputs = {};
export type Agent_Tool_FindInputs = {};
export type Agent_Tool_Find_DocumentsInputs = {};
export type Agent_Tool_Get_AppearanceInputs = {};
export type Agent_Tool_Get_BookmarksInputs = {};
export type Agent_Tool_Get_DocumentInputs = {};
export type Agent_Tool_Get_My_WorkInputs = {};
export type Agent_Tool_Get_ScreenInputs = {};
export type Agent_Tool_Get_SettingsInputs = {};
export type Agent_Tool_List_Demo_UsersInputs = {};
export type Agent_Tool_List_PagesInputs = {};
export type Agent_Tool_List_ToursInputs = {};
export type Agent_Tool_List_WorkflowsInputs = {};
export type Agent_Tool_Mark_Notification_ReadInputs = {};
export type Agent_Tool_My_DayInputs = {};
export type Agent_Tool_NavigateInputs = {};
export type Agent_Tool_Open_PageInputs = {};
export type Agent_Tool_Platform_GuideInputs = {};
export type Agent_Tool_Record_StatusInputs = {};
export type Agent_Tool_Set_AppearanceInputs = {};
export type Agent_Tool_Set_LayoutInputs = {};
export type Agent_Tool_Start_TourInputs = {};
export type Agent_Tool_Switch_UserInputs = {};
export type Agent_Tool_Toggle_BookmarkInputs = {};
export type Agent_Tool_Update_DocumentInputs = {};
export type Agent_Tool_Update_SettingsInputs = {};
export type Agent_Tool_What_Is_On_ScreenInputs = {};
export type Agent_Tool_WithInputs = { tool: NonNullable<unknown>, input: NonNullable<unknown> };
export type Agent_Trace_InputInputs = {};
export type Agent_Trace_ResultInputs = {};
export type Agent_WorkingInputs = {};
export type Alert_DismissInputs = {};
export type App_Backend_FailedInputs = {};
export type App_Demo_TagInputs = {};
export type App_Log_OutInputs = {};
export type App_Logged_OutInputs = {};
export type App_Nav_DashboardInputs = {};
export type App_Nav_HomeInputs = {};
export type App_Needs_AttentionInputs = {};
export type App_Not_Found_BackInputs = {};
export type App_Not_Found_DescriptionInputs = {};
export type App_Not_Found_HeadingInputs = {};
export type App_Powered_ByInputs = { name: NonNullable<unknown> };
export type App_Shell_NavigationInputs = {};
export type App_Shell_Side_PanelInputs = {};
export type App_Side_PanelInputs = {};
export type App_Switch_User_FailedInputs = { name: NonNullable<unknown>, error: NonNullable<unknown> };
export type App_Switch_User_HeadingInputs = {};
export type App_Switch_User_LabelInputs = { name: NonNullable<unknown> };
export type App_Switched_UserInputs = { name: NonNullable<unknown>, role: NonNullable<unknown> };
export type App_Title_AccountInputs = {};
export type App_Title_Create_First_UserInputs = {};
export type App_Title_LoginInputs = {};
export type App_Title_Not_FoundInputs = {};
export type App_Title_SuffixInputs = {};
export type App_View_LoadingInputs = {};
export type Appearance_All_LabelInputs = {};
export type Appearance_Background_HeadingInputs = {};
export type Appearance_Background_LabelInputs = {};
export type Appearance_Background_Live_Magnet_LinesInputs = {};
export type Appearance_Background_Live_WavesInputs = {};
export type Appearance_Background_NoneInputs = {};
export type Appearance_Background_ReplaceInputs = {};
export type Appearance_Background_UploadInputs = {};
export type Appearance_Language_ArInputs = {};
export type Appearance_Language_CurrentInputs = {};
export type Appearance_Language_EnInputs = {};
export type Appearance_Language_HeadingInputs = {};
export type Appearance_Language_LabelInputs = { name: NonNullable<unknown> };
export type Appearance_Scheme_DefaultInputs = {};
export type Appearance_Scheme_HeadingInputs = {};
export type Appearance_Scheme_LabelInputs = { name: NonNullable<unknown> };
export type Appearance_Theme_DarkInputs = {};
export type Appearance_Theme_HeadingInputs = {};
export type Appearance_Theme_LabelInputs = { current: NonNullable<unknown>, next: NonNullable<unknown> };
export type Appearance_Theme_LightInputs = {};
export type Appearance_Theme_SystemInputs = {};
export type Aside_Bookmark_AddInputs = {};
export type Aside_Bookmark_ListInputs = {};
export type Aside_Bookmark_RecordInputs = {};
export type Aside_Bookmark_RemoveInputs = {};
export type Aside_Bookmark_ScreenInputs = {};
export type Aside_Bookmark_SettingsInputs = {};
export type Aside_BookmarksInputs = {};
export type Aside_Bookmarks_EmptyInputs = {};
export type Aside_Caught_UpInputs = {};
export type Aside_LoadingInputs = {};
export type Aside_Notification_ReadInputs = {};
export type Aside_NotificationsInputs = {};
export type Aside_Notifications_UnreadInputs = { count: NonNullable<unknown> };
export type Aside_Tour_DoneInputs = {};
export type Aside_Tour_StepsInputs = { count: NonNullable<unknown> };
export type Aside_ToursInputs = {};
export type Aside_WidgetsInputs = {};
export type Ask_AskInputs = {};
export type Ask_AssistantInputs = {};
export type Ask_PlaceholderInputs = {};
export type Ask_QuestionInputs = {};
export type Ask_ReadingInputs = {};
export type Ask_Reading_RecordsInputs = {};
export type Ask_SourcesInputs = {};
export type Ask_YouInputs = {};
export type Assist_Catch_Me_UpInputs = {};
export type Assist_Check_AgainInputs = {};
export type Assist_Check_With_AiInputs = {};
export type Assist_Checked_HeadingInputs = {};
export type Assist_CheckingInputs = {};
export type Assist_ClassifiedInputs = { label: NonNullable<unknown>, category: NonNullable<unknown> };
export type Assist_CopiedInputs = {};
export type Assist_DictateInputs = {};
export type Assist_DownloadingInputs = { percent: NonNullable<unknown> };
export type Assist_DraftedInputs = {};
export type Assist_DraftingInputs = {};
export type Assist_Error_FailedInputs = {};
export type Assist_Fill_From_TextInputs = {};
export type Assist_FixesInputs = { count: NonNullable<unknown> };
export type Assist_Flag_NoteInputs = { note: NonNullable<unknown> };
export type Assist_Found_HeadingInputs = {};
export type Assist_Heard_FromInputs = { name: NonNullable<unknown> };
export type Assist_Hide_SummaryInputs = {};
export type Assist_Key_Points_HeadingInputs = {};
export type Assist_ListeningInputs = {};
export type Assist_Looks_LikeInputs = {};
export type Assist_Made_FirmerInputs = {};
export type Assist_Made_FormalInputs = {};
export type Assist_Made_FriendlierInputs = {};
export type Assist_No_FixesInputs = {};
export type Assist_No_MicrophoneInputs = {};
export type Assist_Not_FoundInputs = {};
export type Assist_Other_RepliesInputs = {};
export type Assist_Paste_PlaceholderInputs = {};
export type Assist_ProofreadingInputs = {};
export type Assist_Read_AloudInputs = {};
export type Assist_Read_FileInputs = {};
export type Assist_Read_FromInputs = { name: NonNullable<unknown> };
export type Assist_ReadingInputs = {};
export type Assist_Reading_PhotoInputs = {};
export type Assist_RewritingInputs = {};
export type Assist_ShortenedInputs = {};
export type Assist_ShorteningInputs = {};
export type Assist_Show_OriginalInputs = {};
export type Assist_StopInputs = {};
export type Assist_Stop_DictatingInputs = {};
export type Assist_Suggest_CategoryInputs = {};
export type Assist_Suggest_RepliesInputs = {};
export type Assist_Summarised_On_DeviceInputs = {};
export type Assist_Summary_HeadingInputs = {};
export type Assist_Tool_DraftInputs = {};
export type Assist_Tool_FirmInputs = {};
export type Assist_Tool_FormalInputs = {};
export type Assist_Tool_FriendlyInputs = {};
export type Assist_Tool_ProofreadInputs = {};
export type Assist_Tool_ShorterInputs = {};
export type Assist_Tool_TranslateInputs = {};
export type Assist_Translate_ToInputs = { language: NonNullable<unknown> };
export type Assist_Translated_NoteInputs = {};
export type Assist_Translated_ToInputs = { language: NonNullable<unknown> };
export type Assist_TranslatingInputs = {};
export type Assist_Translating_ToInputs = { language: NonNullable<unknown> };
export type Assist_UndoInputs = {};
export type Assist_Use_TheseInputs = {};
export type Assist_Use_ThisInputs = {};
export type Assist_Writing_DownInputs = {};
export type Assist_Writing_RepliesInputs = {};
export type Auth_Account_CreatedInputs = {};
export type Auth_Ai_DownloadInputs = { size: NonNullable<unknown> };
export type Auth_Ai_Download_BodyInputs = {};
export type Auth_Ai_Download_TitleInputs = {};
export type Auth_Ai_FlagsInputs = { url: NonNullable<unknown> };
export type Auth_Ai_Flags_MoreInputs = {};
export type Auth_Ai_HeadingInputs = {};
export type Auth_Ai_LoadingInputs = {};
export type Auth_Ai_Local_OnInputs = {};
export type Auth_Ai_Native_OnInputs = {};
export type Auth_Ai_Native_TitleInputs = {};
export type Auth_Ai_RecommendedInputs = {};
export type Auth_ChangeInputs = {};
export type Auth_Code_LabelInputs = {};
export type Auth_Code_PromptInputs = { length: NonNullable<unknown> };
export type Auth_ContinueInputs = {};
export type Auth_CreateInputs = {};
export type Auth_Demo_NoteInputs = { length: NonNullable<unknown> };
export type Auth_EmailInputs = {};
export type Auth_First_User_HeadingInputs = {};
export type Auth_First_User_IntroInputs = {};
export type Auth_Log_InInputs = {};
export type Auth_Login_IntroInputs = {};
export type Auth_OrInputs = {};
export type Auth_Passkey_UseInputs = {};
export type Auth_Passkey_WaitingInputs = {};
export type Auth_Password_RequiredInputs = {};
export type Auth_Signing_In_AsInputs = {};
export type Auth_Verify_And_Log_InInputs = {};
export type Auth_Verify_HeadingInputs = {};
export type Auth_VerifyingInputs = {};
export type Auth_Welcome_BackInputs = {};
export type Avatar_MoreInputs = { count: NonNullable<unknown> };
export type Badge_StatusInputs = {};
export type Breadcrumbs_LabelInputs = {};
export type Bullet_BandInputs = { quality: NonNullable<unknown>, low: NonNullable<unknown>, high: NonNullable<unknown>, reading: NonNullable<unknown> };
export type Bullet_LabelInputs = {};
export type Bullet_Quality_GoodInputs = {};
export type Bullet_Quality_OkInputs = {};
export type Bullet_Quality_PoorInputs = {};
export type Bullet_Reading_OfInputs = { value: NonNullable<unknown>, target: NonNullable<unknown> };
export type Bullet_Reading_RangeInputs = { value: NonNullable<unknown>, share: NonNullable<unknown>, max: NonNullable<unknown> };
export type Bullet_Reading_TargetInputs = { value: NonNullable<unknown>, target: NonNullable<unknown>, share: NonNullable<unknown> };
export type Bullet_TargetInputs = { target: NonNullable<unknown> };
export type Chart_RangeInputs = {};
export type Chart_SeriesInputs = {};
export type Chart_TargetInputs = {};
export type Chart_TotalInputs = {};
export type Chip_RemoveInputs = {};
export type Coachmark_BackInputs = {};
export type Coachmark_CloseInputs = {};
export type Coachmark_FinishInputs = {};
export type Coachmark_LabelInputs = {};
export type Coachmark_NextInputs = {};
export type Coachmark_SkipInputs = {};
export type Coachmark_StepInputs = { step: NonNullable<unknown>, total: NonNullable<unknown> };
export type Column_Picker_ColumnsInputs = {};
export type Column_Picker_Density_CompactInputs = {};
export type Column_Picker_Density_DefaultInputs = {};
export type Column_Picker_Density_DenseInputs = {};
export type Column_Picker_LabelInputs = { shown: NonNullable<unknown>, total: NonNullable<unknown> };
export type Column_Picker_Move_EarlierInputs = { name: NonNullable<unknown> };
export type Column_Picker_Move_LaterInputs = { name: NonNullable<unknown> };
export type Column_Picker_ResetInputs = {};
export type Column_Picker_Row_HeightInputs = {};
export type Combobox_AddInputs = { value: NonNullable<unknown> };
export type Combobox_ChooseInputs = {};
export type Combobox_ClearInputs = {};
export type Combobox_No_MatchesInputs = {};
export type Combobox_NothingInputs = {};
export type Combobox_RemoveInputs = { value: NonNullable<unknown> };
export type Combobox_Type_To_AddInputs = {};
export type Command_Account_DescriptionInputs = {};
export type Command_Bookmark_AddInputs = {};
export type Command_Bookmark_DescriptionInputs = {};
export type Command_Bookmark_KeywordsInputs = {};
export type Command_Bookmark_RemoveInputs = {};
export type Command_Collection_AllInputs = { plural: NonNullable<unknown> };
export type Command_Contrast_DescriptionInputs = {};
export type Command_Contrast_KeywordsInputs = {};
export type Command_Contrast_TitleInputs = {};
export type Command_Create_DescriptionInputs = { singular: NonNullable<unknown> };
export type Command_Create_KeywordsInputs = {};
export type Command_Create_TitleInputs = { singular: NonNullable<unknown> };
export type Command_Dashboard_DescriptionInputs = {};
export type Command_Dashboard_KeywordsInputs = {};
export type Command_Group_AccessibilityInputs = {};
export type Command_Group_ConfigurationInputs = {};
export type Command_Group_YouInputs = {};
export type Command_Input_LabelInputs = {};
export type Command_Launcher_LabelInputs = {};
export type Command_Logout_KeywordsInputs = {};
export type Command_NavigateInputs = {};
export type Command_No_ResultsInputs = { query: NonNullable<unknown> };
export type Command_No_Results_HintInputs = {};
export type Command_OpenInputs = {};
export type Command_RelatedInputs = {};
export type Command_ResultsInputs = { count: NonNullable<unknown> };
export type Command_Section_ActionsInputs = {};
export type Command_Section_PagesInputs = {};
export type Command_Section_RecordsInputs = {};
export type Command_Suggest_ActionsInputs = {};
export type Command_Suggest_PagesInputs = {};
export type Command_This_PageInputs = {};
export type Command_Type_To_SearchInputs = {};
export type Confirmation_AllowInputs = {};
export type Confirmation_AllowedInputs = {};
export type Confirmation_DenyInputs = {};
export type Confirmation_LabelInputs = {};
export type Confirmation_Not_AllowedInputs = {};
export type Contrast_Audit_CloseInputs = {};
export type Contrast_Audit_FailsInputs = { count: NonNullable<unknown> };
export type Contrast_Audit_Fails_Over_ImageInputs = { count: NonNullable<unknown>, overImage: NonNullable<unknown> };
export type Contrast_Audit_FilledInputs = {};
export type Contrast_Audit_Filled_HintInputs = {};
export type Contrast_Audit_Filled_On_DialogInputs = { count: NonNullable<unknown> };
export type Contrast_Audit_Filled_On_PageInputs = { count: NonNullable<unknown> };
export type Contrast_Audit_IssueInputs = { color: NonNullable<unknown>, background: NonNullable<unknown>, required: NonNullable<unknown> };
export type Contrast_Audit_Kind_CrampedInputs = {};
export type Contrast_Audit_Kind_EscapesInputs = {};
export type Contrast_Audit_Kind_Page_ScrollInputs = {};
export type Contrast_Audit_Kind_SqueezedInputs = {};
export type Contrast_Audit_LayoutInputs = { count: NonNullable<unknown>, px: NonNullable<unknown> };
export type Contrast_Audit_PassesInputs = {};
export type Contrast_Audit_ProminenceInputs = { places: NonNullable<unknown> };
export type Contrast_Audit_RatioInputs = { ratio: NonNullable<unknown> };
export type Contrast_Audit_RerunInputs = {};
export type Contrast_Audit_TitleInputs = {};
export type Countdown_Due_NowInputs = {};
export type Countdown_Just_OverdueInputs = {};
export type Countdown_Left_DaysInputs = { days: NonNullable<unknown> };
export type Countdown_Left_Days_HoursInputs = { days: NonNullable<unknown>, hours: NonNullable<unknown> };
export type Countdown_Left_HoursInputs = { hours: NonNullable<unknown> };
export type Countdown_Left_Hours_MinutesInputs = { hours: NonNullable<unknown>, minutes: NonNullable<unknown> };
export type Countdown_Left_MinutesInputs = { minutes: NonNullable<unknown> };
export type Countdown_OverdueInputs = { what: NonNullable<unknown> };
export type Countdown_Overdue_DaysInputs = { days: NonNullable<unknown> };
export type Countdown_Overdue_HoursInputs = { hours: NonNullable<unknown> };
export type Countdown_Overdue_MinutesInputs = { minutes: NonNullable<unknown> };
export type Countdown_Under_A_MinuteInputs = {};
export type Date_Input_ClearInputs = {};
export type Date_Input_In_A_WeekInputs = {};
export type Date_Input_PicksInputs = {};
export type Date_Input_Picks_ForInputs = { label: NonNullable<unknown> };
export type Date_Input_SaidInputs = { date: NonNullable<unknown>, relative: NonNullable<unknown> };
export type Date_Input_Said_TimeInputs = { date: NonNullable<unknown>, time: NonNullable<unknown>, relative: NonNullable<unknown> };
export type Date_Input_TodayInputs = {};
export type Date_Input_TomorrowInputs = {};
export type Dial_LabelInputs = {};
export type Dial_RangeInputs = { low: NonNullable<unknown>, high: NonNullable<unknown> };
export type Dial_ReadingInputs = { value: NonNullable<unknown>, share: NonNullable<unknown>, min: NonNullable<unknown>, max: NonNullable<unknown> };
export type Dial_ZoneInputs = { zone: NonNullable<unknown>, low: NonNullable<unknown>, high: NonNullable<unknown> };
export type Doc_Form_Add_BlockInputs = {};
export type Doc_Form_Add_NamedInputs = { name: NonNullable<unknown> };
export type Doc_Form_Block_NameInputs = {};
export type Doc_Form_ChooseInputs = {};
export type Doc_Form_Collapse_AllInputs = {};
export type Doc_Form_Collapse_RowInputs = { kind: NonNullable<unknown>, number: NonNullable<unknown> };
export type Doc_Form_Create_NewInputs = {};
export type Doc_Form_DetailsInputs = {};
export type Doc_Form_DuplicateInputs = {};
export type Doc_Form_ErrorsInputs = { count: NonNullable<unknown> };
export type Doc_Form_Expand_AllInputs = {};
export type Doc_Form_Expand_RowInputs = { kind: NonNullable<unknown>, number: NonNullable<unknown> };
export type Doc_Form_Join_ShowingInputs = { shown: NonNullable<unknown>, total: NonNullable<unknown> };
export type Doc_Form_Json_InvalidInputs = {};
export type Doc_Form_LatitudeInputs = {};
export type Doc_Form_LongitudeInputs = {};
export type Doc_Form_Move_DownInputs = {};
export type Doc_Form_Move_UpInputs = {};
export type Doc_Form_NewInputs = {};
export type Doc_Form_NoInputs = {};
export type Doc_Form_None_YetInputs = {};
export type Doc_Form_OpenInputs = {};
export type Doc_Form_OptionalInputs = {};
export type Doc_Form_RemoveInputs = {};
export type Doc_Form_RowInputs = {};
export type Doc_Form_Row_ActionsInputs = { kind: NonNullable<unknown>, number: NonNullable<unknown> };
export type Doc_Form_Row_TitleInputs = { kind: NonNullable<unknown>, number: NonNullable<unknown> };
export type Doc_Form_Rows_At_LeastInputs = { min: NonNullable<unknown> };
export type Doc_Form_Rows_EmptyInputs = { items: NonNullable<unknown> };
export type Doc_Form_Rows_MaxInputs = { items: NonNullable<unknown>, max: NonNullable<unknown> };
export type Doc_Form_Rows_Up_ToInputs = { max: NonNullable<unknown> };
export type Doc_Form_Suggest_FailedInputs = {};
export type Doc_Form_Suggest_NothingInputs = {};
export type Doc_Form_Tab_ErrorsInputs = { label: NonNullable<unknown>, count: NonNullable<unknown> };
export type Doc_Form_Type_EnterInputs = {};
export type Doc_Form_Type_Number_EnterInputs = {};
export type Doc_Form_Unit_DaysInputs = {};
export type Doc_Form_UnsupportedInputs = { label: NonNullable<unknown>, type: NonNullable<unknown> };
export type Doc_Form_YesInputs = {};
export type Dropdown_More_InfoInputs = {};
export type Edit_View_AccountInputs = {};
export type Edit_View_Cannot_UndoInputs = {};
export type Edit_View_CreateInputs = {};
export type Edit_View_Create_TitleInputs = { what: NonNullable<unknown> };
export type Edit_View_CreatedInputs = { date: NonNullable<unknown> };
export type Edit_View_DashboardInputs = {};
export type Edit_View_DeleteInputs = {};
export type Edit_View_Delete_ConfirmInputs = { what: NonNullable<unknown> };
export type Edit_View_DetailsInputs = {};
export type Edit_View_File_RequiredInputs = {};
export type Edit_View_IdInputs = {};
export type Edit_View_LinkInputs = { field: NonNullable<unknown>, name: NonNullable<unknown> };
export type Edit_View_New_PasswordInputs = {};
export type Edit_View_New_TitleInputs = { what: NonNullable<unknown> };
export type Edit_View_Not_FoundInputs = {};
export type Edit_View_Not_Found_BodyInputs = {};
export type Edit_View_Password_HintInputs = {};
export type Edit_View_Password_RequiredInputs = {};
export type Edit_View_ProblemInputs = { field: NonNullable<unknown>, message: NonNullable<unknown> };
export type Edit_View_ProblemsInputs = { count: NonNullable<unknown> };
export type Edit_View_Read_OnlyInputs = {};
export type Edit_View_Replace_FileInputs = {};
export type Edit_View_SaveInputs = {};
export type Edit_View_Save_ShortcutInputs = {};
export type Edit_View_SavedInputs = {};
export type Edit_View_SavingInputs = {};
export type Edit_View_Screen_LoadingInputs = {};
export type Edit_View_SectionsInputs = { what: NonNullable<unknown> };
export type Edit_View_SettingInputs = {};
export type Edit_View_UnsavedInputs = {};
export type Edit_View_UpdatedInputs = { date: NonNullable<unknown> };
export type Empty_State_LoadingInputs = {};
export type Fab_CloseInputs = {};
export type Field_AboutInputs = { label: NonNullable<unknown> };
export type Field_About_ThisInputs = {};
export type Field_Count_OfInputs = { count: NonNullable<unknown>, max: NonNullable<unknown> };
export type Field_Error_At_Least_OneInputs = {};
export type Field_Error_CheckInputs = {};
export type Field_Error_DateInputs = {};
export type Field_Error_EmailInputs = {};
export type Field_Error_MaxInputs = { max: NonNullable<unknown> };
export type Field_Error_Max_LengthInputs = { count: NonNullable<unknown> };
export type Field_Error_Max_RowsInputs = { count: NonNullable<unknown> };
export type Field_Error_MinInputs = { min: NonNullable<unknown> };
export type Field_Error_Min_LengthInputs = { count: NonNullable<unknown> };
export type Field_Error_Min_RowsInputs = { count: NonNullable<unknown> };
export type Field_Error_NumberInputs = {};
export type Field_Error_OptionInputs = {};
export type Field_Error_RequiredInputs = {};
export type Field_Error_TextInputs = {};
export type Field_Required_PillInputs = {};
export type Field_SuggestInputs = { label: NonNullable<unknown> };
export type Field_Suggest_AnswerInputs = {};
export type Field_Suggestion_DismissInputs = {};
export type Field_Suggestion_UseInputs = {};
export type Field_Suggestion_Use_LabelInputs = { suggestion: NonNullable<unknown> };
export type Filter_Builder_Add_FilterInputs = {};
export type Filter_Builder_ClearInputs = {};
export type Filter_Builder_FieldInputs = {};
export type Filter_Builder_FilterInputs = {};
export type Filter_Builder_IsInputs = {};
export type Filter_Builder_MatchInputs = {};
export type Filter_Builder_Match_AllInputs = {};
export type Filter_Builder_Match_AnyInputs = {};
export type Filter_Builder_Op_AfterInputs = {};
export type Filter_Builder_Op_Any_OfInputs = {};
export type Filter_Builder_Op_BeforeInputs = {};
export type Filter_Builder_Op_ContainsInputs = {};
export type Filter_Builder_Op_IsInputs = {};
export type Filter_Builder_Op_Is_EmptyInputs = {};
export type Filter_Builder_Op_Is_NotInputs = {};
export type Filter_Builder_Op_Is_SetInputs = {};
export type Filter_Builder_Op_NoInputs = {};
export type Filter_Builder_Op_None_OfInputs = {};
export type Filter_Builder_Op_Not_ContainsInputs = {};
export type Filter_Builder_Op_YesInputs = {};
export type Filter_Builder_RemoveInputs = {};
export type Filter_Builder_Remove_FilterInputs = { field: NonNullable<unknown> };
export type Filter_Builder_Search_OptionsInputs = { field: NonNullable<unknown> };
export type Filter_Builder_UpdateInputs = {};
export type Filter_Builder_ValueInputs = {};
export type Filter_Builder_Values_MoreInputs = { values: NonNullable<unknown>, count: NonNullable<unknown> };
export type Frame_CollapseInputs = { what: NonNullable<unknown> };
export type Frame_Drag_To_CloseInputs = { what: NonNullable<unknown> };
export type Frame_Drag_To_OpenInputs = { what: NonNullable<unknown> };
export type Frame_ExpandInputs = { what: NonNullable<unknown> };
export type Frame_PanesInputs = {};
export type Frame_ResizeInputs = {};
export type Frame_Resize_To_CloseInputs = { what: NonNullable<unknown> };
export type Frame_Resize_To_OpenInputs = { what: NonNullable<unknown> };
export type Frame_Show_IconsInputs = { what: NonNullable<unknown> };
export type Funnel_CaptionInputs = { share: NonNullable<unknown>, from: NonNullable<unknown>, to: NonNullable<unknown> };
export type Funnel_StepInputs = { share: NonNullable<unknown>, step: NonNullable<unknown> };
export type Funnel_Step_Went_OnInputs = {};
export type Gauge_LabelInputs = {};
export type Gauge_Value_OfInputs = { value: NonNullable<unknown>, max: NonNullable<unknown> };
export type Heatmap_LabelInputs = {};
export type Heatmap_LessInputs = {};
export type Heatmap_MoreInputs = {};
export type Kanban_ColumnInputs = { column: NonNullable<unknown>, count: NonNullable<unknown> };
export type Kanban_DraggingInputs = { card: NonNullable<unknown> };
export type Kanban_MovedInputs = { column: NonNullable<unknown> };
export type Kanban_Not_MovedInputs = {};
export type Layout_CrampedInputs = { lines: NonNullable<unknown>, px: NonNullable<unknown> };
export type Layout_EscapesInputs = { box: NonNullable<unknown>, px: NonNullable<unknown>, name: NonNullable<unknown> };
export type Layout_Page_ScrollInputs = { px: NonNullable<unknown> };
export type Layout_SqueezedInputs = { px: NonNullable<unknown> };
export type List_View_ByInputs = { things: NonNullable<unknown>, field: NonNullable<unknown> };
export type List_View_Calendar_CountInputs = { count: NonNullable<unknown>, field: NonNullable<unknown> };
export type List_View_Calendar_LabelInputs = { things: NonNullable<unknown>, field: NonNullable<unknown>, month: NonNullable<unknown> };
export type List_View_Cannot_UndoInputs = {};
export type List_View_Chart_BucketInputs = { bucket: NonNullable<unknown>, field: NonNullable<unknown> };
export type List_View_Clear_FiltersInputs = {};
export type List_View_Clear_SelectionInputs = {};
export type List_View_Count_OfInputs = { count: NonNullable<unknown>, singular: NonNullable<unknown>, plural: NonNullable<unknown> };
export type List_View_Create_FirstInputs = {};
export type List_View_Create_NewInputs = { singular: NonNullable<unknown> };
export type List_View_CreatedInputs = {};
export type List_View_DashboardInputs = {};
export type List_View_DeleteInputs = {};
export type List_View_Delete_CountInputs = { count: NonNullable<unknown> };
export type List_View_Delete_HeadingInputs = { count: NonNullable<unknown>, singular: NonNullable<unknown>, plural: NonNullable<unknown> };
export type List_View_DiscardInputs = {};
export type List_View_Discard_HeadingInputs = {};
export type List_View_Discard_TextInputs = { title: NonNullable<unknown> };
export type List_View_EmptyInputs = { things: NonNullable<unknown> };
export type List_View_Empty_FilteredInputs = { things: NonNullable<unknown> };
export type List_View_Export_CsvInputs = {};
export type List_View_Heatmap_LabelInputs = { things: NonNullable<unknown>, field: NonNullable<unknown> };
export type List_View_Heatmap_SummaryInputs = { total: NonNullable<unknown>, things: NonNullable<unknown>, field: NonNullable<unknown> };
export type List_View_IdInputs = {};
export type List_View_ItemInputs = {};
export type List_View_ItemsInputs = {};
export type List_View_Keep_EditingInputs = {};
export type List_View_Layout_BoardInputs = {};
export type List_View_Layout_CalendarInputs = {};
export type List_View_Layout_CardsInputs = {};
export type List_View_Layout_ChartInputs = { field: NonNullable<unknown> };
export type List_View_Layout_CompactInputs = {};
export type List_View_Layout_FocusInputs = {};
export type List_View_Layout_GroupsInputs = { field: NonNullable<unknown> };
export type List_View_Layout_HeatmapInputs = {};
export type List_View_Layout_ListInputs = {};
export type List_View_Layout_RankingInputs = { field: NonNullable<unknown> };
export type List_View_Layout_ScatterInputs = {};
export type List_View_Layout_TableInputs = {};
export type List_View_Layout_TimelineInputs = {};
export type List_View_Layout_TreemapInputs = {};
export type List_View_LoadingInputs = {};
export type List_View_Move_FailedInputs = { title: NonNullable<unknown>, column: NonNullable<unknown>, error: NonNullable<unknown> };
export type List_View_Move_MenuInputs = { title: NonNullable<unknown> };
export type List_View_Move_ToInputs = { column: NonNullable<unknown> };
export type List_View_MovedInputs = { title: NonNullable<unknown>, column: NonNullable<unknown> };
export type List_View_NewInputs = { singular: NonNullable<unknown> };
export type List_View_NextInputs = {};
export type List_View_Next_MonthInputs = {};
export type List_View_No_RecordsInputs = {};
export type List_View_None_ColumnInputs = { field: NonNullable<unknown> };
export type List_View_None_InlineInputs = { field: NonNullable<unknown> };
export type List_View_OpenInputs = {};
export type List_View_Open_FullInputs = {};
export type List_View_PagesInputs = { what: NonNullable<unknown> };
export type List_View_PositionInputs = { at: NonNullable<unknown>, total: NonNullable<unknown> };
export type List_View_PreviousInputs = {};
export type List_View_Previous_MonthInputs = {};
export type List_View_RangeInputs = { from: NonNullable<unknown>, to: NonNullable<unknown>, total: NonNullable<unknown> };
export type List_View_Read_OnlyInputs = {};
export type List_View_RowsInputs = {};
export type List_View_SaveInputs = {};
export type List_View_SavedInputs = {};
export type List_View_SavingInputs = {};
export type List_View_Scatter_LabelInputs = { things: NonNullable<unknown>, x: NonNullable<unknown>, y: NonNullable<unknown> };
export type List_View_Search_ByInputs = { field: NonNullable<unknown> };
export type List_View_Select_AllInputs = { total: NonNullable<unknown>, things: NonNullable<unknown> };
export type List_View_Select_All_MatchingInputs = { total: NonNullable<unknown> };
export type List_View_SelectedInputs = { count: NonNullable<unknown> };
export type List_View_SelectionInputs = {};
export type List_View_SortInputs = {};
export type List_View_Sort_DefaultInputs = {};
export type List_View_This_MonthInputs = {};
export type List_View_UndoInputs = {};
export type List_View_UnsavedInputs = {};
export type List_View_UpdatedInputs = {};
export type List_View_ViewInputs = {};
export type List_View_WithInputs = { person: NonNullable<unknown> };
export type Loading_LabelInputs = {};
export type Message_Bad_ResponseInputs = {};
export type Message_CopiedInputs = {};
export type Message_CopyInputs = {};
export type Message_EditInputs = {};
export type Message_Good_ResponseInputs = {};
export type Message_RetryInputs = {};
export type Message_Scroller_JumpInputs = {};
export type Modal_CancelInputs = {};
export type Modal_CloseInputs = {};
export type Model_Selector_LabelInputs = { name: NonNullable<unknown> };
export type Month_Day_DueInputs = { day: NonNullable<unknown>, count: NonNullable<unknown> };
export type Month_Nothing_DueInputs = {};
export type Number_DaysInputs = { value: NonNullable<unknown> };
export type Number_HoursInputs = { value: NonNullable<unknown> };
export type Number_MinutesInputs = { value: NonNullable<unknown> };
export type Number_MoneyInputs = { currency: NonNullable<unknown>, amount: NonNullable<unknown> };
export type Number_Money_CompactInputs = { currency: NonNullable<unknown>, amount: NonNullable<unknown> };
export type Number_PctInputs = { value: NonNullable<unknown> };
export type Number_ThousandsInputs = { amount: NonNullable<unknown> };
export type Otp_LabelInputs = {};
export type Pagination_LabelInputs = {};
export type Pagination_NextInputs = {};
export type Pagination_Page_OfInputs = { page: NonNullable<unknown>, total: NonNullable<unknown> };
export type Pagination_Pages_RangeInputs = { from: NonNullable<unknown>, to: NonNullable<unknown> };
export type Pagination_PreviousInputs = {};
export type Prompt_Input_LabelInputs = {};
export type Prompt_Input_SendInputs = {};
export type Prompt_Input_StopInputs = {};
export type Quadrant_MeasureInputs = { measure: NonNullable<unknown>, value: NonNullable<unknown> };
export type Quadrant_PointInputs = { point: NonNullable<unknown>, quadrant: NonNullable<unknown> };
export type Quadrant_SplitInputs = { x: NonNullable<unknown>, y: NonNullable<unknown> };
export type Quadrant_X_AxisInputs = { measure: NonNullable<unknown> };
export type Rating_NoneInputs = {};
export type Rating_OfInputs = { value: NonNullable<unknown>, max: NonNullable<unknown> };
export type Rating_Star_WordsInputs = { value: NonNullable<unknown>, words: NonNullable<unknown> };
export type Record_NamedInputs = { title: NonNullable<unknown>, status: NonNullable<unknown> };
export type Record_RelatedInputs = {};
export type Search_ClearInputs = {};
export type Search_LabelInputs = {};
export type Shared_Bookmarks_FailedInputs = { error: NonNullable<unknown> };
export type Shared_CollectionsInputs = {};
export type Shared_ConfigurationInputs = {};
export type Shared_NoInputs = {};
export type Shared_RowsInputs = { count: NonNullable<unknown> };
export type Shared_UntitledInputs = {};
export type Shared_YesInputs = {};
export type Sheet_CloseInputs = {};
export type Site_Assistant_NameInputs = {};
export type Site_Default_NameInputs = {};
export type Skeleton_LoadingInputs = {};
export type Snackbar_DismissInputs = {};
export type Sources_UsedInputs = { count: NonNullable<unknown> };
export type Stat_Delta_DownInputs = {};
export type Stat_Delta_FlatInputs = {};
export type Stat_Delta_UpInputs = {};
export type Stepper_LessInputs = {};
export type Stepper_Less_OfInputs = { label: NonNullable<unknown> };
export type Stepper_MoreInputs = {};
export type Stepper_More_OfInputs = { label: NonNullable<unknown> };
export type Steps_DoneInputs = {};
export type Steps_SkippedInputs = {};
export type Suggestions_LabelInputs = {};
export type Table_Column_FitInputs = { column: NonNullable<unknown> };
export type Table_Column_MovedInputs = { column: NonNullable<unknown>, place: NonNullable<unknown>, total: NonNullable<unknown> };
export type Table_Column_WidthInputs = { column: NonNullable<unknown>, width: NonNullable<unknown> };
export type Table_Resize_ColumnInputs = { column: NonNullable<unknown> };
export type Table_Resize_HintInputs = {};
export type Table_Select_AllInputs = {};
export type Table_Select_RowInputs = { row: NonNullable<unknown> };
export type Table_Sort_HintInputs = {};
export type Table_Sort_Move_HintInputs = {};
export type Tile_MoveInputs = {};
export type Tile_Move_HintInputs = {};
export type Tile_Move_NamedInputs = { name: NonNullable<unknown> };
export type Tile_RemoveInputs = {};
export type Tile_Remove_NamedInputs = { name: NonNullable<unknown> };
export type Tile_ResizeInputs = {};
export type Tile_Resize_HintInputs = {};
export type Tile_Resize_NamedInputs = { name: NonNullable<unknown> };
export type Tile_Show_AllInputs = {};
export type Tile_Show_LessInputs = {};
export type Tour_Eyebrow_Signed_InInputs = { tour: NonNullable<unknown>, name: NonNullable<unknown>, role: NonNullable<unknown> };
export type Treemap_CellInputs = { label: NonNullable<unknown>, amount: NonNullable<unknown>, share: NonNullable<unknown> };
export type Visual_OtherInputs = {};
export type Waffle_LabelInputs = {};
export type Waffle_ReadingInputs = { value: NonNullable<unknown>, caption: NonNullable<unknown> };
export type Waterfall_ChangeInputs = { label: NonNullable<unknown>, change: NonNullable<unknown>, run: NonNullable<unknown> };
export type Waterfall_DecreaseInputs = {};
export type Waterfall_IncreaseInputs = {};
export type Waterfall_TotalInputs = { label: NonNullable<unknown>, run: NonNullable<unknown> };
export type Waterfall_Total_KeyInputs = {};
export type Whatif_ResetInputs = {};
export type Widget_Ask_PlaceholderInputs = {};
export type Widget_Ask_ReadingInputs = {};
export type Widget_AttachInputs = { what: NonNullable<unknown> };
export type Widget_Blocks_ChartInputs = {};
export type Widget_Blocks_Funnel_StepInputs = {};
export type Widget_Blocks_MoreInputs = {};
export type Widget_DashboardInputs = {};
export type Widget_Data_AllInputs = { what: NonNullable<unknown> };
export type Widget_Data_In_AllInputs = {};
export type Widget_DeniedInputs = {};
export type Widget_EmptyInputs = {};
export type Widget_FailedInputs = {};
export type Widget_Fill_InInputs = { fields: NonNullable<unknown> };
export type Widget_Fill_In_ButtonInputs = {};
export type Widget_Host_AllInputs = {};
export type Widget_Host_CompactInputs = {};
export type Widget_Host_Its_ScreenInputs = {};
export type Widget_Host_Keep_HereInputs = {};
export type Widget_Host_KeptInputs = { name: NonNullable<unknown> };
export type Widget_Host_Reset_LayoutInputs = {};
export type Widget_Host_Show_HiddenInputs = { count: NonNullable<unknown> };
export type Widget_Host_TileInputs = {};
export type Widget_Load_FailedInputs = {};
export type Widget_Mini_OfInputs = { max: NonNullable<unknown> };
export type Widget_Mini_OpenInputs = { label: NonNullable<unknown> };
export type Widget_Mini_OtherInputs = {};
export type Widget_Mini_ReadingInputs = {};
export type Widget_Mini_ShareInputs = {};
export type Widget_Mini_StepInputs = { step: NonNullable<unknown>, total: NonNullable<unknown>, label: NonNullable<unknown> };
export type Widget_More_HeadingInputs = { count: NonNullable<unknown> };
export type Widget_Paste_PlaceholderInputs = {};
export type Widget_Save_FailedInputs = {};
export type Widget_Share_Of_AllInputs = { pct: NonNullable<unknown>, noun: NonNullable<unknown> };
export type Widget_Share_Of_FirstInputs = { label: NonNullable<unknown>, value: NonNullable<unknown> };
export type Widget_Share_Of_MaxInputs = { max: NonNullable<unknown> };
export type Widget_Share_Of_TotalInputs = { pct: NonNullable<unknown>, total: NonNullable<unknown>, noun: NonNullable<unknown> };
export type Widget_TotalInputs = {};
export type Widget_UndoInputs = {};
export type Widget_Undo_FailedInputs = {};
export type Widget_UndoneInputs = {};
export {};
