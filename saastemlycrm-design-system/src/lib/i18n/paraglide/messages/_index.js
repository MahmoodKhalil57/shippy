/* eslint-disable */
import { getLocale, experimentalStaticLocale, isDevelopment } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */
/** @typedef {{ action: NonNullable<unknown> }} Agent_AllowInputs */
/** @typedef {{}} Agent_Allow_DescriptionInputs */
/** @typedef {{}} Agent_Builtin_Too_SmallInputs */
/** @typedef {{}} Agent_Builtin_UnavailableInputs */
/** @typedef {{}} Agent_Could_Not_FinishInputs */
/** @typedef {{}} Agent_Decided_AnswerInputs */
/** @typedef {{ tool: NonNullable<unknown> }} Agent_Decided_GroundedInputs */
/** @typedef {{ tool: NonNullable<unknown> }} Agent_Decided_ToolInputs */
/** @typedef {{ tools: NonNullable<unknown> }} Agent_Decided_ToolsInputs */
/** @typedef {{}} Agent_DetailsInputs */
/** @typedef {{}} Agent_DownloadingInputs */
/** @typedef {{ percent: NonNullable<unknown> }} Agent_Downloading_ProgressInputs */
/** @typedef {{}} Agent_Empty_BodyInputs */
/** @typedef {{}} Agent_Empty_HeadingInputs */
/** @typedef {{ query: NonNullable<unknown> }} Agent_Find_NothingInputs */
/** @typedef {{}} Agent_Local_BodyInputs */
/** @typedef {{}} Agent_Local_DownloadInputs */
/** @typedef {{ model: NonNullable<unknown> }} Agent_Local_HeadingInputs */
/** @typedef {{}} Agent_Local_LoadingInputs */
/** @typedef {{ error: NonNullable<unknown> }} Agent_Model_Load_FailedInputs */
/** @typedef {{}} Agent_Model_OutputInputs */
/** @typedef {{}} Agent_Models_CloudInputs */
/** @typedef {{}} Agent_Models_DeviceInputs */
/** @typedef {{}} Agent_My_Day_EmptyInputs */
/** @typedef {{}} Agent_New_ChatInputs */
/** @typedef {{ model: NonNullable<unknown> }} Agent_No_Builtin_ModelInputs */
/** @typedef {{ helper: NonNullable<unknown> }} Agent_OpenInputs */
/** @typedef {{ status: NonNullable<unknown> }} Agent_Openai_FailedInputs */
/** @typedef {{ title: NonNullable<unknown>, path: NonNullable<unknown> }} Agent_OpenedInputs */
/** @typedef {{}} Agent_Prompt_PlaceholderInputs */
/** @typedef {{ path: NonNullable<unknown> }} Agent_Record_PageInputs */
/** @typedef {{ description: NonNullable<unknown> }} Agent_Screen_AboutInputs */
/** @typedef {{ label: NonNullable<unknown>, count: NonNullable<unknown> }} Agent_Screen_ListInputs */
/** @typedef {{ title: NonNullable<unknown>, path: NonNullable<unknown> }} Agent_Screen_PageInputs */
/** @typedef {{ singular: NonNullable<unknown>, title: NonNullable<unknown> }} Agent_Screen_RecordInputs */
/** @typedef {{ label: NonNullable<unknown> }} Agent_Screen_SettingsInputs */
/** @typedef {{ name: NonNullable<unknown>, role: NonNullable<unknown> }} Agent_Screen_Signed_InInputs */
/** @typedef {{}} Agent_Screen_Signed_OutInputs */
/** @typedef {{ tabs: NonNullable<unknown> }} Agent_Screen_TabsInputs */
/** @typedef {{ title: NonNullable<unknown> }} Agent_Screen_ViewInputs */
/** @typedef {{ sources: NonNullable<unknown> }} Agent_SourcesInputs */
/** @typedef {{}} Agent_Suggest_ApprovalsInputs */
/** @typedef {{}} Agent_Suggest_PageInputs */
/** @typedef {{}} Agent_Suggest_ScreenInputs */
/** @typedef {{}} Agent_Suggest_TodayInputs */
/** @typedef {{}} Agent_ThinkingInputs */
/** @typedef {{ seconds: NonNullable<unknown> }} Agent_Thought_ForInputs */
/** @typedef {{}} Agent_Thought_OpenedInputs */
/** @typedef {{ tool: NonNullable<unknown> }} Agent_Thought_RoutedInputs */
/** @typedef {{}} Agent_Too_Many_StepsInputs */
/** @typedef {{}} Agent_Tool_Ask_AssistantInputs */
/** @typedef {{}} Agent_Tool_Ask_RecordsInputs */
/** @typedef {{}} Agent_Tool_Call_WorkflowInputs */
/** @typedef {{}} Agent_Tool_Check_AccessibilityInputs */
/** @typedef {{}} Agent_Tool_Count_DocumentsInputs */
/** @typedef {{}} Agent_Tool_Create_DocumentInputs */
/** @typedef {{}} Agent_Tool_Delete_DocumentInputs */
/** @typedef {{}} Agent_Tool_Describe_SchemaInputs */
/** @typedef {{}} Agent_Tool_FindInputs */
/** @typedef {{}} Agent_Tool_Find_DocumentsInputs */
/** @typedef {{}} Agent_Tool_Get_AppearanceInputs */
/** @typedef {{}} Agent_Tool_Get_BookmarksInputs */
/** @typedef {{}} Agent_Tool_Get_DocumentInputs */
/** @typedef {{}} Agent_Tool_Get_My_WorkInputs */
/** @typedef {{}} Agent_Tool_Get_ScreenInputs */
/** @typedef {{}} Agent_Tool_Get_SettingsInputs */
/** @typedef {{}} Agent_Tool_List_Demo_UsersInputs */
/** @typedef {{}} Agent_Tool_List_PagesInputs */
/** @typedef {{}} Agent_Tool_List_ToursInputs */
/** @typedef {{}} Agent_Tool_List_WorkflowsInputs */
/** @typedef {{}} Agent_Tool_Mark_Notification_ReadInputs */
/** @typedef {{}} Agent_Tool_My_DayInputs */
/** @typedef {{}} Agent_Tool_NavigateInputs */
/** @typedef {{}} Agent_Tool_Open_PageInputs */
/** @typedef {{}} Agent_Tool_Platform_GuideInputs */
/** @typedef {{}} Agent_Tool_Record_StatusInputs */
/** @typedef {{}} Agent_Tool_Set_AppearanceInputs */
/** @typedef {{}} Agent_Tool_Set_LayoutInputs */
/** @typedef {{}} Agent_Tool_Start_TourInputs */
/** @typedef {{}} Agent_Tool_Switch_UserInputs */
/** @typedef {{}} Agent_Tool_Toggle_BookmarkInputs */
/** @typedef {{}} Agent_Tool_Update_DocumentInputs */
/** @typedef {{}} Agent_Tool_Update_SettingsInputs */
/** @typedef {{}} Agent_Tool_What_Is_On_ScreenInputs */
/** @typedef {{ tool: NonNullable<unknown>, input: NonNullable<unknown> }} Agent_Tool_WithInputs */
/** @typedef {{}} Agent_Trace_InputInputs */
/** @typedef {{}} Agent_Trace_ResultInputs */
/** @typedef {{}} Agent_WorkingInputs */
/** @typedef {{}} Alert_DismissInputs */
/** @typedef {{}} App_Backend_FailedInputs */
/** @typedef {{}} App_Demo_TagInputs */
/** @typedef {{}} App_Log_OutInputs */
/** @typedef {{}} App_Logged_OutInputs */
/** @typedef {{}} App_Nav_DashboardInputs */
/** @typedef {{}} App_Nav_HomeInputs */
/** @typedef {{}} App_Needs_AttentionInputs */
/** @typedef {{}} App_Not_Found_BackInputs */
/** @typedef {{}} App_Not_Found_DescriptionInputs */
/** @typedef {{}} App_Not_Found_HeadingInputs */
/** @typedef {{ name: NonNullable<unknown> }} App_Powered_ByInputs */
/** @typedef {{}} App_Shell_NavigationInputs */
/** @typedef {{}} App_Shell_Side_PanelInputs */
/** @typedef {{}} App_Side_PanelInputs */
/** @typedef {{ name: NonNullable<unknown>, error: NonNullable<unknown> }} App_Switch_User_FailedInputs */
/** @typedef {{}} App_Switch_User_HeadingInputs */
/** @typedef {{ name: NonNullable<unknown> }} App_Switch_User_LabelInputs */
/** @typedef {{ name: NonNullable<unknown>, role: NonNullable<unknown> }} App_Switched_UserInputs */
/** @typedef {{}} App_Title_AccountInputs */
/** @typedef {{}} App_Title_Create_First_UserInputs */
/** @typedef {{}} App_Title_LoginInputs */
/** @typedef {{}} App_Title_Not_FoundInputs */
/** @typedef {{}} App_Title_SuffixInputs */
/** @typedef {{}} App_View_LoadingInputs */
/** @typedef {{}} Appearance_All_LabelInputs */
/** @typedef {{}} Appearance_Background_HeadingInputs */
/** @typedef {{}} Appearance_Background_LabelInputs */
/** @typedef {{}} Appearance_Background_Live_Magnet_LinesInputs */
/** @typedef {{}} Appearance_Background_Live_WavesInputs */
/** @typedef {{}} Appearance_Background_NoneInputs */
/** @typedef {{}} Appearance_Background_ReplaceInputs */
/** @typedef {{}} Appearance_Background_UploadInputs */
/** @typedef {{}} Appearance_Language_ArInputs */
/** @typedef {{}} Appearance_Language_CurrentInputs */
/** @typedef {{}} Appearance_Language_EnInputs */
/** @typedef {{}} Appearance_Language_HeadingInputs */
/** @typedef {{ name: NonNullable<unknown> }} Appearance_Language_LabelInputs */
/** @typedef {{}} Appearance_Scheme_DefaultInputs */
/** @typedef {{}} Appearance_Scheme_HeadingInputs */
/** @typedef {{ name: NonNullable<unknown> }} Appearance_Scheme_LabelInputs */
/** @typedef {{}} Appearance_Theme_DarkInputs */
/** @typedef {{}} Appearance_Theme_HeadingInputs */
/** @typedef {{ current: NonNullable<unknown>, next: NonNullable<unknown> }} Appearance_Theme_LabelInputs */
/** @typedef {{}} Appearance_Theme_LightInputs */
/** @typedef {{}} Appearance_Theme_SystemInputs */
/** @typedef {{}} Aside_Bookmark_AddInputs */
/** @typedef {{}} Aside_Bookmark_ListInputs */
/** @typedef {{}} Aside_Bookmark_RecordInputs */
/** @typedef {{}} Aside_Bookmark_RemoveInputs */
/** @typedef {{}} Aside_Bookmark_ScreenInputs */
/** @typedef {{}} Aside_Bookmark_SettingsInputs */
/** @typedef {{}} Aside_BookmarksInputs */
/** @typedef {{}} Aside_Bookmarks_EmptyInputs */
/** @typedef {{}} Aside_Caught_UpInputs */
/** @typedef {{}} Aside_LoadingInputs */
/** @typedef {{}} Aside_Notification_ReadInputs */
/** @typedef {{}} Aside_NotificationsInputs */
/** @typedef {{ count: NonNullable<unknown> }} Aside_Notifications_UnreadInputs */
/** @typedef {{}} Aside_Tour_DoneInputs */
/** @typedef {{ count: NonNullable<unknown> }} Aside_Tour_StepsInputs */
/** @typedef {{}} Aside_ToursInputs */
/** @typedef {{}} Aside_WidgetsInputs */
/** @typedef {{}} Ask_AskInputs */
/** @typedef {{}} Ask_AssistantInputs */
/** @typedef {{}} Ask_PlaceholderInputs */
/** @typedef {{}} Ask_QuestionInputs */
/** @typedef {{}} Ask_ReadingInputs */
/** @typedef {{}} Ask_Reading_RecordsInputs */
/** @typedef {{}} Ask_SourcesInputs */
/** @typedef {{}} Ask_YouInputs */
/** @typedef {{}} Assist_Catch_Me_UpInputs */
/** @typedef {{}} Assist_Check_AgainInputs */
/** @typedef {{}} Assist_Check_With_AiInputs */
/** @typedef {{}} Assist_Checked_HeadingInputs */
/** @typedef {{}} Assist_CheckingInputs */
/** @typedef {{ label: NonNullable<unknown>, category: NonNullable<unknown> }} Assist_ClassifiedInputs */
/** @typedef {{}} Assist_CopiedInputs */
/** @typedef {{}} Assist_DictateInputs */
/** @typedef {{ percent: NonNullable<unknown> }} Assist_DownloadingInputs */
/** @typedef {{}} Assist_DraftedInputs */
/** @typedef {{}} Assist_DraftingInputs */
/** @typedef {{}} Assist_Error_FailedInputs */
/** @typedef {{}} Assist_Fill_From_TextInputs */
/** @typedef {{ count: NonNullable<unknown> }} Assist_FixesInputs */
/** @typedef {{ note: NonNullable<unknown> }} Assist_Flag_NoteInputs */
/** @typedef {{}} Assist_Found_HeadingInputs */
/** @typedef {{ name: NonNullable<unknown> }} Assist_Heard_FromInputs */
/** @typedef {{}} Assist_Hide_SummaryInputs */
/** @typedef {{}} Assist_Key_Points_HeadingInputs */
/** @typedef {{}} Assist_ListeningInputs */
/** @typedef {{}} Assist_Looks_LikeInputs */
/** @typedef {{}} Assist_Made_FirmerInputs */
/** @typedef {{}} Assist_Made_FormalInputs */
/** @typedef {{}} Assist_Made_FriendlierInputs */
/** @typedef {{}} Assist_No_FixesInputs */
/** @typedef {{}} Assist_No_MicrophoneInputs */
/** @typedef {{}} Assist_Not_FoundInputs */
/** @typedef {{}} Assist_Other_RepliesInputs */
/** @typedef {{}} Assist_Paste_PlaceholderInputs */
/** @typedef {{}} Assist_ProofreadingInputs */
/** @typedef {{}} Assist_Read_AloudInputs */
/** @typedef {{}} Assist_Read_FileInputs */
/** @typedef {{ name: NonNullable<unknown> }} Assist_Read_FromInputs */
/** @typedef {{}} Assist_ReadingInputs */
/** @typedef {{}} Assist_Reading_PhotoInputs */
/** @typedef {{}} Assist_RewritingInputs */
/** @typedef {{}} Assist_ShortenedInputs */
/** @typedef {{}} Assist_ShorteningInputs */
/** @typedef {{}} Assist_Show_OriginalInputs */
/** @typedef {{}} Assist_StopInputs */
/** @typedef {{}} Assist_Stop_DictatingInputs */
/** @typedef {{}} Assist_Suggest_CategoryInputs */
/** @typedef {{}} Assist_Suggest_RepliesInputs */
/** @typedef {{}} Assist_Summarised_On_DeviceInputs */
/** @typedef {{}} Assist_Summary_HeadingInputs */
/** @typedef {{}} Assist_Tool_DraftInputs */
/** @typedef {{}} Assist_Tool_FirmInputs */
/** @typedef {{}} Assist_Tool_FormalInputs */
/** @typedef {{}} Assist_Tool_FriendlyInputs */
/** @typedef {{}} Assist_Tool_ProofreadInputs */
/** @typedef {{}} Assist_Tool_ShorterInputs */
/** @typedef {{}} Assist_Tool_TranslateInputs */
/** @typedef {{ language: NonNullable<unknown> }} Assist_Translate_ToInputs */
/** @typedef {{}} Assist_Translated_NoteInputs */
/** @typedef {{ language: NonNullable<unknown> }} Assist_Translated_ToInputs */
/** @typedef {{}} Assist_TranslatingInputs */
/** @typedef {{ language: NonNullable<unknown> }} Assist_Translating_ToInputs */
/** @typedef {{}} Assist_UndoInputs */
/** @typedef {{}} Assist_Use_TheseInputs */
/** @typedef {{}} Assist_Use_ThisInputs */
/** @typedef {{}} Assist_Writing_DownInputs */
/** @typedef {{}} Assist_Writing_RepliesInputs */
/** @typedef {{}} Auth_Account_CreatedInputs */
/** @typedef {{ size: NonNullable<unknown> }} Auth_Ai_DownloadInputs */
/** @typedef {{}} Auth_Ai_Download_BodyInputs */
/** @typedef {{}} Auth_Ai_Download_TitleInputs */
/** @typedef {{ url: NonNullable<unknown> }} Auth_Ai_FlagsInputs */
/** @typedef {{}} Auth_Ai_Flags_MoreInputs */
/** @typedef {{}} Auth_Ai_HeadingInputs */
/** @typedef {{}} Auth_Ai_LoadingInputs */
/** @typedef {{}} Auth_Ai_Local_OnInputs */
/** @typedef {{}} Auth_Ai_Native_OnInputs */
/** @typedef {{}} Auth_Ai_Native_TitleInputs */
/** @typedef {{}} Auth_Ai_RecommendedInputs */
/** @typedef {{}} Auth_ChangeInputs */
/** @typedef {{}} Auth_Code_LabelInputs */
/** @typedef {{ length: NonNullable<unknown> }} Auth_Code_PromptInputs */
/** @typedef {{}} Auth_ContinueInputs */
/** @typedef {{}} Auth_CreateInputs */
/** @typedef {{ length: NonNullable<unknown> }} Auth_Demo_NoteInputs */
/** @typedef {{}} Auth_EmailInputs */
/** @typedef {{}} Auth_First_User_HeadingInputs */
/** @typedef {{}} Auth_First_User_IntroInputs */
/** @typedef {{}} Auth_Log_InInputs */
/** @typedef {{}} Auth_Login_IntroInputs */
/** @typedef {{}} Auth_OrInputs */
/** @typedef {{}} Auth_Passkey_UseInputs */
/** @typedef {{}} Auth_Passkey_WaitingInputs */
/** @typedef {{}} Auth_Password_RequiredInputs */
/** @typedef {{}} Auth_Signing_In_AsInputs */
/** @typedef {{}} Auth_Verify_And_Log_InInputs */
/** @typedef {{}} Auth_Verify_HeadingInputs */
/** @typedef {{}} Auth_VerifyingInputs */
/** @typedef {{}} Auth_Welcome_BackInputs */
/** @typedef {{ count: NonNullable<unknown> }} Avatar_MoreInputs */
/** @typedef {{}} Badge_StatusInputs */
/** @typedef {{}} Breadcrumbs_LabelInputs */
/** @typedef {{ quality: NonNullable<unknown>, low: NonNullable<unknown>, high: NonNullable<unknown>, reading: NonNullable<unknown> }} Bullet_BandInputs */
/** @typedef {{}} Bullet_LabelInputs */
/** @typedef {{}} Bullet_Quality_GoodInputs */
/** @typedef {{}} Bullet_Quality_OkInputs */
/** @typedef {{}} Bullet_Quality_PoorInputs */
/** @typedef {{ value: NonNullable<unknown>, target: NonNullable<unknown> }} Bullet_Reading_OfInputs */
/** @typedef {{ value: NonNullable<unknown>, share: NonNullable<unknown>, max: NonNullable<unknown> }} Bullet_Reading_RangeInputs */
/** @typedef {{ value: NonNullable<unknown>, target: NonNullable<unknown>, share: NonNullable<unknown> }} Bullet_Reading_TargetInputs */
/** @typedef {{ target: NonNullable<unknown> }} Bullet_TargetInputs */
/** @typedef {{}} Chart_RangeInputs */
/** @typedef {{}} Chart_SeriesInputs */
/** @typedef {{}} Chart_TargetInputs */
/** @typedef {{}} Chart_TotalInputs */
/** @typedef {{}} Chip_RemoveInputs */
/** @typedef {{}} Coachmark_BackInputs */
/** @typedef {{}} Coachmark_CloseInputs */
/** @typedef {{}} Coachmark_FinishInputs */
/** @typedef {{}} Coachmark_LabelInputs */
/** @typedef {{}} Coachmark_NextInputs */
/** @typedef {{}} Coachmark_SkipInputs */
/** @typedef {{ step: NonNullable<unknown>, total: NonNullable<unknown> }} Coachmark_StepInputs */
/** @typedef {{}} Column_Picker_ColumnsInputs */
/** @typedef {{}} Column_Picker_Density_CompactInputs */
/** @typedef {{}} Column_Picker_Density_DefaultInputs */
/** @typedef {{}} Column_Picker_Density_DenseInputs */
/** @typedef {{ shown: NonNullable<unknown>, total: NonNullable<unknown> }} Column_Picker_LabelInputs */
/** @typedef {{ name: NonNullable<unknown> }} Column_Picker_Move_EarlierInputs */
/** @typedef {{ name: NonNullable<unknown> }} Column_Picker_Move_LaterInputs */
/** @typedef {{}} Column_Picker_ResetInputs */
/** @typedef {{}} Column_Picker_Row_HeightInputs */
/** @typedef {{ value: NonNullable<unknown> }} Combobox_AddInputs */
/** @typedef {{}} Combobox_ChooseInputs */
/** @typedef {{}} Combobox_ClearInputs */
/** @typedef {{}} Combobox_No_MatchesInputs */
/** @typedef {{}} Combobox_NothingInputs */
/** @typedef {{ value: NonNullable<unknown> }} Combobox_RemoveInputs */
/** @typedef {{}} Combobox_Type_To_AddInputs */
/** @typedef {{}} Command_Account_DescriptionInputs */
/** @typedef {{}} Command_Bookmark_AddInputs */
/** @typedef {{}} Command_Bookmark_DescriptionInputs */
/** @typedef {{}} Command_Bookmark_KeywordsInputs */
/** @typedef {{}} Command_Bookmark_RemoveInputs */
/** @typedef {{ plural: NonNullable<unknown> }} Command_Collection_AllInputs */
/** @typedef {{}} Command_Contrast_DescriptionInputs */
/** @typedef {{}} Command_Contrast_KeywordsInputs */
/** @typedef {{}} Command_Contrast_TitleInputs */
/** @typedef {{ singular: NonNullable<unknown> }} Command_Create_DescriptionInputs */
/** @typedef {{}} Command_Create_KeywordsInputs */
/** @typedef {{ singular: NonNullable<unknown> }} Command_Create_TitleInputs */
/** @typedef {{}} Command_Dashboard_DescriptionInputs */
/** @typedef {{}} Command_Dashboard_KeywordsInputs */
/** @typedef {{}} Command_Group_AccessibilityInputs */
/** @typedef {{}} Command_Group_ConfigurationInputs */
/** @typedef {{}} Command_Group_YouInputs */
/** @typedef {{}} Command_Input_LabelInputs */
/** @typedef {{}} Command_Launcher_LabelInputs */
/** @typedef {{}} Command_Logout_KeywordsInputs */
/** @typedef {{}} Command_NavigateInputs */
/** @typedef {{ query: NonNullable<unknown> }} Command_No_ResultsInputs */
/** @typedef {{}} Command_No_Results_HintInputs */
/** @typedef {{}} Command_OpenInputs */
/** @typedef {{}} Command_RelatedInputs */
/** @typedef {{ count: NonNullable<unknown> }} Command_ResultsInputs */
/** @typedef {{}} Command_Section_ActionsInputs */
/** @typedef {{}} Command_Section_PagesInputs */
/** @typedef {{}} Command_Section_RecordsInputs */
/** @typedef {{}} Command_Suggest_ActionsInputs */
/** @typedef {{}} Command_Suggest_PagesInputs */
/** @typedef {{}} Command_This_PageInputs */
/** @typedef {{}} Command_Type_To_SearchInputs */
/** @typedef {{}} Confirmation_AllowInputs */
/** @typedef {{}} Confirmation_AllowedInputs */
/** @typedef {{}} Confirmation_DenyInputs */
/** @typedef {{}} Confirmation_LabelInputs */
/** @typedef {{}} Confirmation_Not_AllowedInputs */
/** @typedef {{}} Contrast_Audit_CloseInputs */
/** @typedef {{ count: NonNullable<unknown> }} Contrast_Audit_FailsInputs */
/** @typedef {{ count: NonNullable<unknown>, overImage: NonNullable<unknown> }} Contrast_Audit_Fails_Over_ImageInputs */
/** @typedef {{}} Contrast_Audit_FilledInputs */
/** @typedef {{}} Contrast_Audit_Filled_HintInputs */
/** @typedef {{ count: NonNullable<unknown> }} Contrast_Audit_Filled_On_DialogInputs */
/** @typedef {{ count: NonNullable<unknown> }} Contrast_Audit_Filled_On_PageInputs */
/** @typedef {{ color: NonNullable<unknown>, background: NonNullable<unknown>, required: NonNullable<unknown> }} Contrast_Audit_IssueInputs */
/** @typedef {{}} Contrast_Audit_Kind_CrampedInputs */
/** @typedef {{}} Contrast_Audit_Kind_EscapesInputs */
/** @typedef {{}} Contrast_Audit_Kind_Page_ScrollInputs */
/** @typedef {{}} Contrast_Audit_Kind_SqueezedInputs */
/** @typedef {{ count: NonNullable<unknown>, px: NonNullable<unknown> }} Contrast_Audit_LayoutInputs */
/** @typedef {{}} Contrast_Audit_PassesInputs */
/** @typedef {{ places: NonNullable<unknown> }} Contrast_Audit_ProminenceInputs */
/** @typedef {{ ratio: NonNullable<unknown> }} Contrast_Audit_RatioInputs */
/** @typedef {{}} Contrast_Audit_RerunInputs */
/** @typedef {{}} Contrast_Audit_TitleInputs */
/** @typedef {{}} Countdown_Due_NowInputs */
/** @typedef {{}} Countdown_Just_OverdueInputs */
/** @typedef {{ days: NonNullable<unknown> }} Countdown_Left_DaysInputs */
/** @typedef {{ days: NonNullable<unknown>, hours: NonNullable<unknown> }} Countdown_Left_Days_HoursInputs */
/** @typedef {{ hours: NonNullable<unknown> }} Countdown_Left_HoursInputs */
/** @typedef {{ hours: NonNullable<unknown>, minutes: NonNullable<unknown> }} Countdown_Left_Hours_MinutesInputs */
/** @typedef {{ minutes: NonNullable<unknown> }} Countdown_Left_MinutesInputs */
/** @typedef {{ what: NonNullable<unknown> }} Countdown_OverdueInputs */
/** @typedef {{ days: NonNullable<unknown> }} Countdown_Overdue_DaysInputs */
/** @typedef {{ hours: NonNullable<unknown> }} Countdown_Overdue_HoursInputs */
/** @typedef {{ minutes: NonNullable<unknown> }} Countdown_Overdue_MinutesInputs */
/** @typedef {{}} Countdown_Under_A_MinuteInputs */
/** @typedef {{}} Date_Input_ClearInputs */
/** @typedef {{}} Date_Input_In_A_WeekInputs */
/** @typedef {{}} Date_Input_PicksInputs */
/** @typedef {{ label: NonNullable<unknown> }} Date_Input_Picks_ForInputs */
/** @typedef {{ date: NonNullable<unknown>, relative: NonNullable<unknown> }} Date_Input_SaidInputs */
/** @typedef {{ date: NonNullable<unknown>, time: NonNullable<unknown>, relative: NonNullable<unknown> }} Date_Input_Said_TimeInputs */
/** @typedef {{}} Date_Input_TodayInputs */
/** @typedef {{}} Date_Input_TomorrowInputs */
/** @typedef {{}} Dial_LabelInputs */
/** @typedef {{ low: NonNullable<unknown>, high: NonNullable<unknown> }} Dial_RangeInputs */
/** @typedef {{ value: NonNullable<unknown>, share: NonNullable<unknown>, min: NonNullable<unknown>, max: NonNullable<unknown> }} Dial_ReadingInputs */
/** @typedef {{ zone: NonNullable<unknown>, low: NonNullable<unknown>, high: NonNullable<unknown> }} Dial_ZoneInputs */
/** @typedef {{}} Doc_Form_Add_BlockInputs */
/** @typedef {{ name: NonNullable<unknown> }} Doc_Form_Add_NamedInputs */
/** @typedef {{}} Doc_Form_Block_NameInputs */
/** @typedef {{}} Doc_Form_ChooseInputs */
/** @typedef {{}} Doc_Form_Collapse_AllInputs */
/** @typedef {{ kind: NonNullable<unknown>, number: NonNullable<unknown> }} Doc_Form_Collapse_RowInputs */
/** @typedef {{}} Doc_Form_Create_NewInputs */
/** @typedef {{}} Doc_Form_DetailsInputs */
/** @typedef {{}} Doc_Form_DuplicateInputs */
/** @typedef {{ count: NonNullable<unknown> }} Doc_Form_ErrorsInputs */
/** @typedef {{}} Doc_Form_Expand_AllInputs */
/** @typedef {{ kind: NonNullable<unknown>, number: NonNullable<unknown> }} Doc_Form_Expand_RowInputs */
/** @typedef {{ shown: NonNullable<unknown>, total: NonNullable<unknown> }} Doc_Form_Join_ShowingInputs */
/** @typedef {{}} Doc_Form_Json_InvalidInputs */
/** @typedef {{}} Doc_Form_LatitudeInputs */
/** @typedef {{}} Doc_Form_LongitudeInputs */
/** @typedef {{}} Doc_Form_Move_DownInputs */
/** @typedef {{}} Doc_Form_Move_UpInputs */
/** @typedef {{}} Doc_Form_NewInputs */
/** @typedef {{}} Doc_Form_NoInputs */
/** @typedef {{}} Doc_Form_None_YetInputs */
/** @typedef {{}} Doc_Form_OpenInputs */
/** @typedef {{}} Doc_Form_OptionalInputs */
/** @typedef {{}} Doc_Form_RemoveInputs */
/** @typedef {{}} Doc_Form_RowInputs */
/** @typedef {{ kind: NonNullable<unknown>, number: NonNullable<unknown> }} Doc_Form_Row_ActionsInputs */
/** @typedef {{ kind: NonNullable<unknown>, number: NonNullable<unknown> }} Doc_Form_Row_TitleInputs */
/** @typedef {{ min: NonNullable<unknown> }} Doc_Form_Rows_At_LeastInputs */
/** @typedef {{ items: NonNullable<unknown> }} Doc_Form_Rows_EmptyInputs */
/** @typedef {{ items: NonNullable<unknown>, max: NonNullable<unknown> }} Doc_Form_Rows_MaxInputs */
/** @typedef {{ max: NonNullable<unknown> }} Doc_Form_Rows_Up_ToInputs */
/** @typedef {{}} Doc_Form_Suggest_FailedInputs */
/** @typedef {{}} Doc_Form_Suggest_NothingInputs */
/** @typedef {{ label: NonNullable<unknown>, count: NonNullable<unknown> }} Doc_Form_Tab_ErrorsInputs */
/** @typedef {{}} Doc_Form_Type_EnterInputs */
/** @typedef {{}} Doc_Form_Type_Number_EnterInputs */
/** @typedef {{}} Doc_Form_Unit_DaysInputs */
/** @typedef {{ label: NonNullable<unknown>, type: NonNullable<unknown> }} Doc_Form_UnsupportedInputs */
/** @typedef {{}} Doc_Form_YesInputs */
/** @typedef {{}} Dropdown_More_InfoInputs */
/** @typedef {{}} Edit_View_AccountInputs */
/** @typedef {{}} Edit_View_Cannot_UndoInputs */
/** @typedef {{}} Edit_View_CreateInputs */
/** @typedef {{ what: NonNullable<unknown> }} Edit_View_Create_TitleInputs */
/** @typedef {{ date: NonNullable<unknown> }} Edit_View_CreatedInputs */
/** @typedef {{}} Edit_View_DashboardInputs */
/** @typedef {{}} Edit_View_DeleteInputs */
/** @typedef {{ what: NonNullable<unknown> }} Edit_View_Delete_ConfirmInputs */
/** @typedef {{}} Edit_View_DetailsInputs */
/** @typedef {{}} Edit_View_File_RequiredInputs */
/** @typedef {{}} Edit_View_IdInputs */
/** @typedef {{ field: NonNullable<unknown>, name: NonNullable<unknown> }} Edit_View_LinkInputs */
/** @typedef {{}} Edit_View_New_PasswordInputs */
/** @typedef {{ what: NonNullable<unknown> }} Edit_View_New_TitleInputs */
/** @typedef {{}} Edit_View_Not_FoundInputs */
/** @typedef {{}} Edit_View_Not_Found_BodyInputs */
/** @typedef {{}} Edit_View_Password_HintInputs */
/** @typedef {{}} Edit_View_Password_RequiredInputs */
/** @typedef {{ field: NonNullable<unknown>, message: NonNullable<unknown> }} Edit_View_ProblemInputs */
/** @typedef {{ count: NonNullable<unknown> }} Edit_View_ProblemsInputs */
/** @typedef {{}} Edit_View_Read_OnlyInputs */
/** @typedef {{}} Edit_View_Replace_FileInputs */
/** @typedef {{}} Edit_View_SaveInputs */
/** @typedef {{}} Edit_View_Save_ShortcutInputs */
/** @typedef {{}} Edit_View_SavedInputs */
/** @typedef {{}} Edit_View_SavingInputs */
/** @typedef {{}} Edit_View_Screen_LoadingInputs */
/** @typedef {{ what: NonNullable<unknown> }} Edit_View_SectionsInputs */
/** @typedef {{}} Edit_View_SettingInputs */
/** @typedef {{}} Edit_View_UnsavedInputs */
/** @typedef {{ date: NonNullable<unknown> }} Edit_View_UpdatedInputs */
/** @typedef {{}} Empty_State_LoadingInputs */
/** @typedef {{}} Fab_CloseInputs */
/** @typedef {{ label: NonNullable<unknown> }} Field_AboutInputs */
/** @typedef {{}} Field_About_ThisInputs */
/** @typedef {{ count: NonNullable<unknown>, max: NonNullable<unknown> }} Field_Count_OfInputs */
/** @typedef {{}} Field_Error_At_Least_OneInputs */
/** @typedef {{}} Field_Error_CheckInputs */
/** @typedef {{}} Field_Error_DateInputs */
/** @typedef {{}} Field_Error_EmailInputs */
/** @typedef {{ max: NonNullable<unknown> }} Field_Error_MaxInputs */
/** @typedef {{ count: NonNullable<unknown> }} Field_Error_Max_LengthInputs */
/** @typedef {{ count: NonNullable<unknown> }} Field_Error_Max_RowsInputs */
/** @typedef {{ min: NonNullable<unknown> }} Field_Error_MinInputs */
/** @typedef {{ count: NonNullable<unknown> }} Field_Error_Min_LengthInputs */
/** @typedef {{ count: NonNullable<unknown> }} Field_Error_Min_RowsInputs */
/** @typedef {{}} Field_Error_NumberInputs */
/** @typedef {{}} Field_Error_OptionInputs */
/** @typedef {{}} Field_Error_RequiredInputs */
/** @typedef {{}} Field_Error_TextInputs */
/** @typedef {{}} Field_Required_PillInputs */
/** @typedef {{ label: NonNullable<unknown> }} Field_SuggestInputs */
/** @typedef {{}} Field_Suggest_AnswerInputs */
/** @typedef {{}} Field_Suggestion_DismissInputs */
/** @typedef {{}} Field_Suggestion_UseInputs */
/** @typedef {{ suggestion: NonNullable<unknown> }} Field_Suggestion_Use_LabelInputs */
/** @typedef {{}} Filter_Builder_Add_FilterInputs */
/** @typedef {{}} Filter_Builder_ClearInputs */
/** @typedef {{}} Filter_Builder_FieldInputs */
/** @typedef {{}} Filter_Builder_FilterInputs */
/** @typedef {{}} Filter_Builder_IsInputs */
/** @typedef {{}} Filter_Builder_MatchInputs */
/** @typedef {{}} Filter_Builder_Match_AllInputs */
/** @typedef {{}} Filter_Builder_Match_AnyInputs */
/** @typedef {{}} Filter_Builder_Op_AfterInputs */
/** @typedef {{}} Filter_Builder_Op_Any_OfInputs */
/** @typedef {{}} Filter_Builder_Op_BeforeInputs */
/** @typedef {{}} Filter_Builder_Op_ContainsInputs */
/** @typedef {{}} Filter_Builder_Op_IsInputs */
/** @typedef {{}} Filter_Builder_Op_Is_EmptyInputs */
/** @typedef {{}} Filter_Builder_Op_Is_NotInputs */
/** @typedef {{}} Filter_Builder_Op_Is_SetInputs */
/** @typedef {{}} Filter_Builder_Op_NoInputs */
/** @typedef {{}} Filter_Builder_Op_None_OfInputs */
/** @typedef {{}} Filter_Builder_Op_Not_ContainsInputs */
/** @typedef {{}} Filter_Builder_Op_YesInputs */
/** @typedef {{}} Filter_Builder_RemoveInputs */
/** @typedef {{ field: NonNullable<unknown> }} Filter_Builder_Remove_FilterInputs */
/** @typedef {{ field: NonNullable<unknown> }} Filter_Builder_Search_OptionsInputs */
/** @typedef {{}} Filter_Builder_UpdateInputs */
/** @typedef {{}} Filter_Builder_ValueInputs */
/** @typedef {{ values: NonNullable<unknown>, count: NonNullable<unknown> }} Filter_Builder_Values_MoreInputs */
/** @typedef {{ what: NonNullable<unknown> }} Frame_CollapseInputs */
/** @typedef {{ what: NonNullable<unknown> }} Frame_Drag_To_CloseInputs */
/** @typedef {{ what: NonNullable<unknown> }} Frame_Drag_To_OpenInputs */
/** @typedef {{ what: NonNullable<unknown> }} Frame_ExpandInputs */
/** @typedef {{}} Frame_PanesInputs */
/** @typedef {{}} Frame_ResizeInputs */
/** @typedef {{ what: NonNullable<unknown> }} Frame_Resize_To_CloseInputs */
/** @typedef {{ what: NonNullable<unknown> }} Frame_Resize_To_OpenInputs */
/** @typedef {{ what: NonNullable<unknown> }} Frame_Show_IconsInputs */
/** @typedef {{ share: NonNullable<unknown>, from: NonNullable<unknown>, to: NonNullable<unknown> }} Funnel_CaptionInputs */
/** @typedef {{ share: NonNullable<unknown>, step: NonNullable<unknown> }} Funnel_StepInputs */
/** @typedef {{}} Funnel_Step_Went_OnInputs */
/** @typedef {{}} Gauge_LabelInputs */
/** @typedef {{ value: NonNullable<unknown>, max: NonNullable<unknown> }} Gauge_Value_OfInputs */
/** @typedef {{}} Heatmap_LabelInputs */
/** @typedef {{}} Heatmap_LessInputs */
/** @typedef {{}} Heatmap_MoreInputs */
/** @typedef {{ column: NonNullable<unknown>, count: NonNullable<unknown> }} Kanban_ColumnInputs */
/** @typedef {{ card: NonNullable<unknown> }} Kanban_DraggingInputs */
/** @typedef {{ column: NonNullable<unknown> }} Kanban_MovedInputs */
/** @typedef {{}} Kanban_Not_MovedInputs */
/** @typedef {{ lines: NonNullable<unknown>, px: NonNullable<unknown> }} Layout_CrampedInputs */
/** @typedef {{ box: NonNullable<unknown>, px: NonNullable<unknown>, name: NonNullable<unknown> }} Layout_EscapesInputs */
/** @typedef {{ px: NonNullable<unknown> }} Layout_Page_ScrollInputs */
/** @typedef {{ px: NonNullable<unknown> }} Layout_SqueezedInputs */
/** @typedef {{ things: NonNullable<unknown>, field: NonNullable<unknown> }} List_View_ByInputs */
/** @typedef {{ count: NonNullable<unknown>, field: NonNullable<unknown> }} List_View_Calendar_CountInputs */
/** @typedef {{ things: NonNullable<unknown>, field: NonNullable<unknown>, month: NonNullable<unknown> }} List_View_Calendar_LabelInputs */
/** @typedef {{}} List_View_Cannot_UndoInputs */
/** @typedef {{ bucket: NonNullable<unknown>, field: NonNullable<unknown> }} List_View_Chart_BucketInputs */
/** @typedef {{}} List_View_Clear_FiltersInputs */
/** @typedef {{}} List_View_Clear_SelectionInputs */
/** @typedef {{ count: NonNullable<unknown>, singular: NonNullable<unknown>, plural: NonNullable<unknown> }} List_View_Count_OfInputs */
/** @typedef {{}} List_View_Create_FirstInputs */
/** @typedef {{ singular: NonNullable<unknown> }} List_View_Create_NewInputs */
/** @typedef {{}} List_View_CreatedInputs */
/** @typedef {{}} List_View_DashboardInputs */
/** @typedef {{}} List_View_DeleteInputs */
/** @typedef {{ count: NonNullable<unknown> }} List_View_Delete_CountInputs */
/** @typedef {{ count: NonNullable<unknown>, singular: NonNullable<unknown>, plural: NonNullable<unknown> }} List_View_Delete_HeadingInputs */
/** @typedef {{}} List_View_DiscardInputs */
/** @typedef {{}} List_View_Discard_HeadingInputs */
/** @typedef {{ title: NonNullable<unknown> }} List_View_Discard_TextInputs */
/** @typedef {{ things: NonNullable<unknown> }} List_View_EmptyInputs */
/** @typedef {{ things: NonNullable<unknown> }} List_View_Empty_FilteredInputs */
/** @typedef {{}} List_View_Export_CsvInputs */
/** @typedef {{ things: NonNullable<unknown>, field: NonNullable<unknown> }} List_View_Heatmap_LabelInputs */
/** @typedef {{ total: NonNullable<unknown>, things: NonNullable<unknown>, field: NonNullable<unknown> }} List_View_Heatmap_SummaryInputs */
/** @typedef {{}} List_View_IdInputs */
/** @typedef {{}} List_View_ItemInputs */
/** @typedef {{}} List_View_ItemsInputs */
/** @typedef {{}} List_View_Keep_EditingInputs */
/** @typedef {{}} List_View_Layout_BoardInputs */
/** @typedef {{}} List_View_Layout_CalendarInputs */
/** @typedef {{}} List_View_Layout_CardsInputs */
/** @typedef {{ field: NonNullable<unknown> }} List_View_Layout_ChartInputs */
/** @typedef {{}} List_View_Layout_CompactInputs */
/** @typedef {{}} List_View_Layout_FocusInputs */
/** @typedef {{ field: NonNullable<unknown> }} List_View_Layout_GroupsInputs */
/** @typedef {{}} List_View_Layout_HeatmapInputs */
/** @typedef {{}} List_View_Layout_ListInputs */
/** @typedef {{ field: NonNullable<unknown> }} List_View_Layout_RankingInputs */
/** @typedef {{}} List_View_Layout_ScatterInputs */
/** @typedef {{}} List_View_Layout_TableInputs */
/** @typedef {{}} List_View_Layout_TimelineInputs */
/** @typedef {{}} List_View_Layout_TreemapInputs */
/** @typedef {{}} List_View_LoadingInputs */
/** @typedef {{ title: NonNullable<unknown>, column: NonNullable<unknown>, error: NonNullable<unknown> }} List_View_Move_FailedInputs */
/** @typedef {{ title: NonNullable<unknown> }} List_View_Move_MenuInputs */
/** @typedef {{ column: NonNullable<unknown> }} List_View_Move_ToInputs */
/** @typedef {{ title: NonNullable<unknown>, column: NonNullable<unknown> }} List_View_MovedInputs */
/** @typedef {{ singular: NonNullable<unknown> }} List_View_NewInputs */
/** @typedef {{}} List_View_NextInputs */
/** @typedef {{}} List_View_Next_MonthInputs */
/** @typedef {{}} List_View_No_RecordsInputs */
/** @typedef {{ field: NonNullable<unknown> }} List_View_None_ColumnInputs */
/** @typedef {{ field: NonNullable<unknown> }} List_View_None_InlineInputs */
/** @typedef {{}} List_View_OpenInputs */
/** @typedef {{}} List_View_Open_FullInputs */
/** @typedef {{ what: NonNullable<unknown> }} List_View_PagesInputs */
/** @typedef {{ at: NonNullable<unknown>, total: NonNullable<unknown> }} List_View_PositionInputs */
/** @typedef {{}} List_View_PreviousInputs */
/** @typedef {{}} List_View_Previous_MonthInputs */
/** @typedef {{ from: NonNullable<unknown>, to: NonNullable<unknown>, total: NonNullable<unknown> }} List_View_RangeInputs */
/** @typedef {{}} List_View_Read_OnlyInputs */
/** @typedef {{}} List_View_RowsInputs */
/** @typedef {{}} List_View_SaveInputs */
/** @typedef {{}} List_View_SavedInputs */
/** @typedef {{}} List_View_SavingInputs */
/** @typedef {{ things: NonNullable<unknown>, x: NonNullable<unknown>, y: NonNullable<unknown> }} List_View_Scatter_LabelInputs */
/** @typedef {{ field: NonNullable<unknown> }} List_View_Search_ByInputs */
/** @typedef {{ total: NonNullable<unknown>, things: NonNullable<unknown> }} List_View_Select_AllInputs */
/** @typedef {{ total: NonNullable<unknown> }} List_View_Select_All_MatchingInputs */
/** @typedef {{ count: NonNullable<unknown> }} List_View_SelectedInputs */
/** @typedef {{}} List_View_SelectionInputs */
/** @typedef {{}} List_View_SortInputs */
/** @typedef {{}} List_View_Sort_DefaultInputs */
/** @typedef {{}} List_View_This_MonthInputs */
/** @typedef {{}} List_View_UndoInputs */
/** @typedef {{}} List_View_UnsavedInputs */
/** @typedef {{}} List_View_UpdatedInputs */
/** @typedef {{}} List_View_ViewInputs */
/** @typedef {{ person: NonNullable<unknown> }} List_View_WithInputs */
/** @typedef {{}} Loading_LabelInputs */
/** @typedef {{}} Message_Bad_ResponseInputs */
/** @typedef {{}} Message_CopiedInputs */
/** @typedef {{}} Message_CopyInputs */
/** @typedef {{}} Message_EditInputs */
/** @typedef {{}} Message_Good_ResponseInputs */
/** @typedef {{}} Message_RetryInputs */
/** @typedef {{}} Message_Scroller_JumpInputs */
/** @typedef {{}} Modal_CancelInputs */
/** @typedef {{}} Modal_CloseInputs */
/** @typedef {{ name: NonNullable<unknown> }} Model_Selector_LabelInputs */
/** @typedef {{ day: NonNullable<unknown>, count: NonNullable<unknown> }} Month_Day_DueInputs */
/** @typedef {{}} Month_Nothing_DueInputs */
/** @typedef {{ value: NonNullable<unknown> }} Number_DaysInputs */
/** @typedef {{ value: NonNullable<unknown> }} Number_HoursInputs */
/** @typedef {{ value: NonNullable<unknown> }} Number_MinutesInputs */
/** @typedef {{ currency: NonNullable<unknown>, amount: NonNullable<unknown> }} Number_MoneyInputs */
/** @typedef {{ currency: NonNullable<unknown>, amount: NonNullable<unknown> }} Number_Money_CompactInputs */
/** @typedef {{ value: NonNullable<unknown> }} Number_PctInputs */
/** @typedef {{ amount: NonNullable<unknown> }} Number_ThousandsInputs */
/** @typedef {{}} Otp_LabelInputs */
/** @typedef {{}} Pagination_LabelInputs */
/** @typedef {{}} Pagination_NextInputs */
/** @typedef {{ page: NonNullable<unknown>, total: NonNullable<unknown> }} Pagination_Page_OfInputs */
/** @typedef {{ from: NonNullable<unknown>, to: NonNullable<unknown> }} Pagination_Pages_RangeInputs */
/** @typedef {{}} Pagination_PreviousInputs */
/** @typedef {{}} Prompt_Input_LabelInputs */
/** @typedef {{}} Prompt_Input_SendInputs */
/** @typedef {{}} Prompt_Input_StopInputs */
/** @typedef {{ measure: NonNullable<unknown>, value: NonNullable<unknown> }} Quadrant_MeasureInputs */
/** @typedef {{ point: NonNullable<unknown>, quadrant: NonNullable<unknown> }} Quadrant_PointInputs */
/** @typedef {{ x: NonNullable<unknown>, y: NonNullable<unknown> }} Quadrant_SplitInputs */
/** @typedef {{ measure: NonNullable<unknown> }} Quadrant_X_AxisInputs */
/** @typedef {{}} Rating_NoneInputs */
/** @typedef {{ value: NonNullable<unknown>, max: NonNullable<unknown> }} Rating_OfInputs */
/** @typedef {{ value: NonNullable<unknown>, words: NonNullable<unknown> }} Rating_Star_WordsInputs */
/** @typedef {{ title: NonNullable<unknown>, status: NonNullable<unknown> }} Record_NamedInputs */
/** @typedef {{}} Record_RelatedInputs */
/** @typedef {{}} Search_ClearInputs */
/** @typedef {{}} Search_LabelInputs */
/** @typedef {{ error: NonNullable<unknown> }} Shared_Bookmarks_FailedInputs */
/** @typedef {{}} Shared_CollectionsInputs */
/** @typedef {{}} Shared_ConfigurationInputs */
/** @typedef {{}} Shared_NoInputs */
/** @typedef {{ count: NonNullable<unknown> }} Shared_RowsInputs */
/** @typedef {{}} Shared_UntitledInputs */
/** @typedef {{}} Shared_YesInputs */
/** @typedef {{}} Sheet_CloseInputs */
/** @typedef {{}} Site_Assistant_NameInputs */
/** @typedef {{}} Site_Default_NameInputs */
/** @typedef {{}} Skeleton_LoadingInputs */
/** @typedef {{}} Snackbar_DismissInputs */
/** @typedef {{ count: NonNullable<unknown> }} Sources_UsedInputs */
/** @typedef {{}} Stat_Delta_DownInputs */
/** @typedef {{}} Stat_Delta_FlatInputs */
/** @typedef {{}} Stat_Delta_UpInputs */
/** @typedef {{}} Stepper_LessInputs */
/** @typedef {{ label: NonNullable<unknown> }} Stepper_Less_OfInputs */
/** @typedef {{}} Stepper_MoreInputs */
/** @typedef {{ label: NonNullable<unknown> }} Stepper_More_OfInputs */
/** @typedef {{}} Steps_DoneInputs */
/** @typedef {{}} Steps_SkippedInputs */
/** @typedef {{}} Suggestions_LabelInputs */
/** @typedef {{ column: NonNullable<unknown> }} Table_Column_FitInputs */
/** @typedef {{ column: NonNullable<unknown>, place: NonNullable<unknown>, total: NonNullable<unknown> }} Table_Column_MovedInputs */
/** @typedef {{ column: NonNullable<unknown>, width: NonNullable<unknown> }} Table_Column_WidthInputs */
/** @typedef {{ column: NonNullable<unknown> }} Table_Resize_ColumnInputs */
/** @typedef {{}} Table_Resize_HintInputs */
/** @typedef {{}} Table_Select_AllInputs */
/** @typedef {{ row: NonNullable<unknown> }} Table_Select_RowInputs */
/** @typedef {{}} Table_Sort_HintInputs */
/** @typedef {{}} Table_Sort_Move_HintInputs */
/** @typedef {{}} Tile_MoveInputs */
/** @typedef {{}} Tile_Move_HintInputs */
/** @typedef {{ name: NonNullable<unknown> }} Tile_Move_NamedInputs */
/** @typedef {{}} Tile_RemoveInputs */
/** @typedef {{ name: NonNullable<unknown> }} Tile_Remove_NamedInputs */
/** @typedef {{}} Tile_ResizeInputs */
/** @typedef {{}} Tile_Resize_HintInputs */
/** @typedef {{ name: NonNullable<unknown> }} Tile_Resize_NamedInputs */
/** @typedef {{}} Tile_Show_AllInputs */
/** @typedef {{}} Tile_Show_LessInputs */
/** @typedef {{ tour: NonNullable<unknown>, name: NonNullable<unknown>, role: NonNullable<unknown> }} Tour_Eyebrow_Signed_InInputs */
/** @typedef {{ label: NonNullable<unknown>, amount: NonNullable<unknown>, share: NonNullable<unknown> }} Treemap_CellInputs */
/** @typedef {{}} Visual_OtherInputs */
/** @typedef {{}} Waffle_LabelInputs */
/** @typedef {{ value: NonNullable<unknown>, caption: NonNullable<unknown> }} Waffle_ReadingInputs */
/** @typedef {{ label: NonNullable<unknown>, change: NonNullable<unknown>, run: NonNullable<unknown> }} Waterfall_ChangeInputs */
/** @typedef {{}} Waterfall_DecreaseInputs */
/** @typedef {{}} Waterfall_IncreaseInputs */
/** @typedef {{ label: NonNullable<unknown>, run: NonNullable<unknown> }} Waterfall_TotalInputs */
/** @typedef {{}} Waterfall_Total_KeyInputs */
/** @typedef {{}} Whatif_ResetInputs */
/** @typedef {{}} Widget_Ask_PlaceholderInputs */
/** @typedef {{}} Widget_Ask_ReadingInputs */
/** @typedef {{ what: NonNullable<unknown> }} Widget_AttachInputs */
/** @typedef {{}} Widget_Blocks_ChartInputs */
/** @typedef {{}} Widget_Blocks_Funnel_StepInputs */
/** @typedef {{}} Widget_Blocks_MoreInputs */
/** @typedef {{}} Widget_DashboardInputs */
/** @typedef {{ what: NonNullable<unknown> }} Widget_Data_AllInputs */
/** @typedef {{}} Widget_Data_In_AllInputs */
/** @typedef {{}} Widget_DeniedInputs */
/** @typedef {{}} Widget_EmptyInputs */
/** @typedef {{}} Widget_FailedInputs */
/** @typedef {{ fields: NonNullable<unknown> }} Widget_Fill_InInputs */
/** @typedef {{}} Widget_Fill_In_ButtonInputs */
/** @typedef {{}} Widget_Host_AllInputs */
/** @typedef {{}} Widget_Host_CompactInputs */
/** @typedef {{}} Widget_Host_Its_ScreenInputs */
/** @typedef {{}} Widget_Host_Keep_HereInputs */
/** @typedef {{ name: NonNullable<unknown> }} Widget_Host_KeptInputs */
/** @typedef {{}} Widget_Host_Reset_LayoutInputs */
/** @typedef {{ count: NonNullable<unknown> }} Widget_Host_Show_HiddenInputs */
/** @typedef {{}} Widget_Host_TileInputs */
/** @typedef {{}} Widget_Load_FailedInputs */
/** @typedef {{ max: NonNullable<unknown> }} Widget_Mini_OfInputs */
/** @typedef {{ label: NonNullable<unknown> }} Widget_Mini_OpenInputs */
/** @typedef {{}} Widget_Mini_OtherInputs */
/** @typedef {{}} Widget_Mini_ReadingInputs */
/** @typedef {{}} Widget_Mini_ShareInputs */
/** @typedef {{ step: NonNullable<unknown>, total: NonNullable<unknown>, label: NonNullable<unknown> }} Widget_Mini_StepInputs */
/** @typedef {{ count: NonNullable<unknown> }} Widget_More_HeadingInputs */
/** @typedef {{}} Widget_Paste_PlaceholderInputs */
/** @typedef {{}} Widget_Save_FailedInputs */
/** @typedef {{ pct: NonNullable<unknown>, noun: NonNullable<unknown> }} Widget_Share_Of_AllInputs */
/** @typedef {{ label: NonNullable<unknown>, value: NonNullable<unknown> }} Widget_Share_Of_FirstInputs */
/** @typedef {{ max: NonNullable<unknown> }} Widget_Share_Of_MaxInputs */
/** @typedef {{ pct: NonNullable<unknown>, total: NonNullable<unknown>, noun: NonNullable<unknown> }} Widget_Share_Of_TotalInputs */
/** @typedef {{}} Widget_TotalInputs */
/** @typedef {{}} Widget_UndoInputs */
/** @typedef {{}} Widget_Undo_FailedInputs */
/** @typedef {{}} Widget_UndoneInputs */
import * as __en from "./en.js"
import * as __ar from "./ar.js"
/**

* @param {Agent_AllowInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_allow = /** @type {((inputs: Agent_AllowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_AllowInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_allow(inputs)
	return __en.agent_allow(inputs)
});
/**

* @param {Agent_Allow_DescriptionInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_allow_description = /** @type {((inputs?: Agent_Allow_DescriptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Allow_DescriptionInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_allow_description(inputs)
	return __en.agent_allow_description(inputs)
});
/**

* @param {Agent_Builtin_Too_SmallInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_builtin_too_small = /** @type {((inputs?: Agent_Builtin_Too_SmallInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Builtin_Too_SmallInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_builtin_too_small(inputs)
	return __en.agent_builtin_too_small(inputs)
});
/**

* @param {Agent_Builtin_UnavailableInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_builtin_unavailable = /** @type {((inputs?: Agent_Builtin_UnavailableInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Builtin_UnavailableInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_builtin_unavailable(inputs)
	return __en.agent_builtin_unavailable(inputs)
});
/**

* @param {Agent_Could_Not_FinishInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_could_not_finish = /** @type {((inputs?: Agent_Could_Not_FinishInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Could_Not_FinishInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_could_not_finish(inputs)
	return __en.agent_could_not_finish(inputs)
});
/**

* @param {Agent_Decided_AnswerInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_decided_answer = /** @type {((inputs?: Agent_Decided_AnswerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Decided_AnswerInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_decided_answer(inputs)
	return __en.agent_decided_answer(inputs)
});
/**

* @param {Agent_Decided_GroundedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_decided_grounded = /** @type {((inputs: Agent_Decided_GroundedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Decided_GroundedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_decided_grounded(inputs)
	return __en.agent_decided_grounded(inputs)
});
/**

* @param {Agent_Decided_ToolInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_decided_tool = /** @type {((inputs: Agent_Decided_ToolInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Decided_ToolInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_decided_tool(inputs)
	return __en.agent_decided_tool(inputs)
});
/**

* @param {Agent_Decided_ToolsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_decided_tools = /** @type {((inputs: Agent_Decided_ToolsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Decided_ToolsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_decided_tools(inputs)
	return __en.agent_decided_tools(inputs)
});
/**

* @param {Agent_DetailsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_details = /** @type {((inputs?: Agent_DetailsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_DetailsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_details(inputs)
	return __en.agent_details(inputs)
});
/**

* @param {Agent_DownloadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_downloading = /** @type {((inputs?: Agent_DownloadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_DownloadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_downloading(inputs)
	return __en.agent_downloading(inputs)
});
/**

* @param {Agent_Downloading_ProgressInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_downloading_progress = /** @type {((inputs: Agent_Downloading_ProgressInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Downloading_ProgressInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_downloading_progress(inputs)
	return __en.agent_downloading_progress(inputs)
});
/**

* @param {Agent_Empty_BodyInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_empty_body = /** @type {((inputs?: Agent_Empty_BodyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Empty_BodyInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_empty_body(inputs)
	return __en.agent_empty_body(inputs)
});
/**

* @param {Agent_Empty_HeadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_empty_heading = /** @type {((inputs?: Agent_Empty_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Empty_HeadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_empty_heading(inputs)
	return __en.agent_empty_heading(inputs)
});
/**

* @param {Agent_Find_NothingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_find_nothing = /** @type {((inputs: Agent_Find_NothingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Find_NothingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_find_nothing(inputs)
	return __en.agent_find_nothing(inputs)
});
/**

* @param {Agent_Local_BodyInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_local_body = /** @type {((inputs?: Agent_Local_BodyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Local_BodyInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_local_body(inputs)
	return __en.agent_local_body(inputs)
});
/**

* @param {Agent_Local_DownloadInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_local_download = /** @type {((inputs?: Agent_Local_DownloadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Local_DownloadInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_local_download(inputs)
	return __en.agent_local_download(inputs)
});
/**

* @param {Agent_Local_HeadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_local_heading = /** @type {((inputs: Agent_Local_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Local_HeadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_local_heading(inputs)
	return __en.agent_local_heading(inputs)
});
/**

* @param {Agent_Local_LoadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_local_loading = /** @type {((inputs?: Agent_Local_LoadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Local_LoadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_local_loading(inputs)
	return __en.agent_local_loading(inputs)
});
/**

* @param {Agent_Model_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_model_load_failed = /** @type {((inputs: Agent_Model_Load_FailedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Model_Load_FailedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_model_load_failed(inputs)
	return __en.agent_model_load_failed(inputs)
});
/**

* @param {Agent_Model_OutputInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_model_output = /** @type {((inputs?: Agent_Model_OutputInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Model_OutputInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_model_output(inputs)
	return __en.agent_model_output(inputs)
});
/**

* @param {Agent_Models_CloudInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_models_cloud = /** @type {((inputs?: Agent_Models_CloudInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Models_CloudInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_models_cloud(inputs)
	return __en.agent_models_cloud(inputs)
});
/**

* @param {Agent_Models_DeviceInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_models_device = /** @type {((inputs?: Agent_Models_DeviceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Models_DeviceInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_models_device(inputs)
	return __en.agent_models_device(inputs)
});
/**

* @param {Agent_My_Day_EmptyInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_my_day_empty = /** @type {((inputs?: Agent_My_Day_EmptyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_My_Day_EmptyInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_my_day_empty(inputs)
	return __en.agent_my_day_empty(inputs)
});
/**

* @param {Agent_New_ChatInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_new_chat = /** @type {((inputs?: Agent_New_ChatInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_New_ChatInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_new_chat(inputs)
	return __en.agent_new_chat(inputs)
});
/**

* @param {Agent_No_Builtin_ModelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_no_builtin_model = /** @type {((inputs: Agent_No_Builtin_ModelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_No_Builtin_ModelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_no_builtin_model(inputs)
	return __en.agent_no_builtin_model(inputs)
});
/**

* @param {Agent_OpenInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_open = /** @type {((inputs: Agent_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_OpenInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_open(inputs)
	return __en.agent_open(inputs)
});
/**

* @param {Agent_Openai_FailedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_openai_failed = /** @type {((inputs: Agent_Openai_FailedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Openai_FailedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_openai_failed(inputs)
	return __en.agent_openai_failed(inputs)
});
/**

* @param {Agent_OpenedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_opened = /** @type {((inputs: Agent_OpenedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_OpenedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_opened(inputs)
	return __en.agent_opened(inputs)
});
/**

* @param {Agent_Prompt_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_prompt_placeholder = /** @type {((inputs?: Agent_Prompt_PlaceholderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Prompt_PlaceholderInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_prompt_placeholder(inputs)
	return __en.agent_prompt_placeholder(inputs)
});
/**

* @param {Agent_Record_PageInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_record_page = /** @type {((inputs: Agent_Record_PageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Record_PageInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_record_page(inputs)
	return __en.agent_record_page(inputs)
});
/**

* @param {Agent_Screen_AboutInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_screen_about = /** @type {((inputs: Agent_Screen_AboutInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Screen_AboutInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_screen_about(inputs)
	return __en.agent_screen_about(inputs)
});
/**

* @param {Agent_Screen_ListInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_screen_list = /** @type {((inputs: Agent_Screen_ListInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Screen_ListInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_screen_list(inputs)
	return __en.agent_screen_list(inputs)
});
/**

* @param {Agent_Screen_PageInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_screen_page = /** @type {((inputs: Agent_Screen_PageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Screen_PageInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_screen_page(inputs)
	return __en.agent_screen_page(inputs)
});
/**

* @param {Agent_Screen_RecordInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_screen_record = /** @type {((inputs: Agent_Screen_RecordInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Screen_RecordInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_screen_record(inputs)
	return __en.agent_screen_record(inputs)
});
/**

* @param {Agent_Screen_SettingsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_screen_settings = /** @type {((inputs: Agent_Screen_SettingsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Screen_SettingsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_screen_settings(inputs)
	return __en.agent_screen_settings(inputs)
});
/**

* @param {Agent_Screen_Signed_InInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_screen_signed_in = /** @type {((inputs: Agent_Screen_Signed_InInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Screen_Signed_InInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_screen_signed_in(inputs)
	return __en.agent_screen_signed_in(inputs)
});
/**

* @param {Agent_Screen_Signed_OutInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_screen_signed_out = /** @type {((inputs?: Agent_Screen_Signed_OutInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Screen_Signed_OutInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_screen_signed_out(inputs)
	return __en.agent_screen_signed_out(inputs)
});
/**

* @param {Agent_Screen_TabsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_screen_tabs = /** @type {((inputs: Agent_Screen_TabsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Screen_TabsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_screen_tabs(inputs)
	return __en.agent_screen_tabs(inputs)
});
/**

* @param {Agent_Screen_ViewInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_screen_view = /** @type {((inputs: Agent_Screen_ViewInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Screen_ViewInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_screen_view(inputs)
	return __en.agent_screen_view(inputs)
});
/**

* @param {Agent_SourcesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_sources = /** @type {((inputs: Agent_SourcesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_SourcesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_sources(inputs)
	return __en.agent_sources(inputs)
});
/**

* @param {Agent_Suggest_ApprovalsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_suggest_approvals = /** @type {((inputs?: Agent_Suggest_ApprovalsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Suggest_ApprovalsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_suggest_approvals(inputs)
	return __en.agent_suggest_approvals(inputs)
});
/**

* @param {Agent_Suggest_PageInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_suggest_page = /** @type {((inputs?: Agent_Suggest_PageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Suggest_PageInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_suggest_page(inputs)
	return __en.agent_suggest_page(inputs)
});
/**

* @param {Agent_Suggest_ScreenInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_suggest_screen = /** @type {((inputs?: Agent_Suggest_ScreenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Suggest_ScreenInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_suggest_screen(inputs)
	return __en.agent_suggest_screen(inputs)
});
/**

* @param {Agent_Suggest_TodayInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_suggest_today = /** @type {((inputs?: Agent_Suggest_TodayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Suggest_TodayInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_suggest_today(inputs)
	return __en.agent_suggest_today(inputs)
});
/**

* @param {Agent_ThinkingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_thinking = /** @type {((inputs?: Agent_ThinkingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_ThinkingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_thinking(inputs)
	return __en.agent_thinking(inputs)
});
/**

* @param {Agent_Thought_ForInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_thought_for = /** @type {((inputs: Agent_Thought_ForInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Thought_ForInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_thought_for(inputs)
	return __en.agent_thought_for(inputs)
});
/**

* @param {Agent_Thought_OpenedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_thought_opened = /** @type {((inputs?: Agent_Thought_OpenedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Thought_OpenedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_thought_opened(inputs)
	return __en.agent_thought_opened(inputs)
});
/**

* @param {Agent_Thought_RoutedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_thought_routed = /** @type {((inputs: Agent_Thought_RoutedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Thought_RoutedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_thought_routed(inputs)
	return __en.agent_thought_routed(inputs)
});
/**

* @param {Agent_Too_Many_StepsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_too_many_steps = /** @type {((inputs?: Agent_Too_Many_StepsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Too_Many_StepsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_too_many_steps(inputs)
	return __en.agent_too_many_steps(inputs)
});
/**

* @param {Agent_Tool_Ask_AssistantInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_ask_assistant = /** @type {((inputs?: Agent_Tool_Ask_AssistantInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Ask_AssistantInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_ask_assistant(inputs)
	return __en.agent_tool_ask_assistant(inputs)
});
/**

* @param {Agent_Tool_Ask_RecordsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_ask_records = /** @type {((inputs?: Agent_Tool_Ask_RecordsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Ask_RecordsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_ask_records(inputs)
	return __en.agent_tool_ask_records(inputs)
});
/**

* @param {Agent_Tool_Call_WorkflowInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_call_workflow = /** @type {((inputs?: Agent_Tool_Call_WorkflowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Call_WorkflowInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_call_workflow(inputs)
	return __en.agent_tool_call_workflow(inputs)
});
/**

* @param {Agent_Tool_Check_AccessibilityInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_check_accessibility = /** @type {((inputs?: Agent_Tool_Check_AccessibilityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Check_AccessibilityInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_check_accessibility(inputs)
	return __en.agent_tool_check_accessibility(inputs)
});
/**

* @param {Agent_Tool_Count_DocumentsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_count_documents = /** @type {((inputs?: Agent_Tool_Count_DocumentsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Count_DocumentsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_count_documents(inputs)
	return __en.agent_tool_count_documents(inputs)
});
/**

* @param {Agent_Tool_Create_DocumentInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_create_document = /** @type {((inputs?: Agent_Tool_Create_DocumentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Create_DocumentInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_create_document(inputs)
	return __en.agent_tool_create_document(inputs)
});
/**

* @param {Agent_Tool_Delete_DocumentInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_delete_document = /** @type {((inputs?: Agent_Tool_Delete_DocumentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Delete_DocumentInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_delete_document(inputs)
	return __en.agent_tool_delete_document(inputs)
});
/**

* @param {Agent_Tool_Describe_SchemaInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_describe_schema = /** @type {((inputs?: Agent_Tool_Describe_SchemaInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Describe_SchemaInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_describe_schema(inputs)
	return __en.agent_tool_describe_schema(inputs)
});
/**

* @param {Agent_Tool_FindInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_find = /** @type {((inputs?: Agent_Tool_FindInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_FindInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_find(inputs)
	return __en.agent_tool_find(inputs)
});
/**

* @param {Agent_Tool_Find_DocumentsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_find_documents = /** @type {((inputs?: Agent_Tool_Find_DocumentsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Find_DocumentsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_find_documents(inputs)
	return __en.agent_tool_find_documents(inputs)
});
/**

* @param {Agent_Tool_Get_AppearanceInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_get_appearance = /** @type {((inputs?: Agent_Tool_Get_AppearanceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Get_AppearanceInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_get_appearance(inputs)
	return __en.agent_tool_get_appearance(inputs)
});
/**

* @param {Agent_Tool_Get_BookmarksInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_get_bookmarks = /** @type {((inputs?: Agent_Tool_Get_BookmarksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Get_BookmarksInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_get_bookmarks(inputs)
	return __en.agent_tool_get_bookmarks(inputs)
});
/**

* @param {Agent_Tool_Get_DocumentInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_get_document = /** @type {((inputs?: Agent_Tool_Get_DocumentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Get_DocumentInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_get_document(inputs)
	return __en.agent_tool_get_document(inputs)
});
/**

* @param {Agent_Tool_Get_My_WorkInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_get_my_work = /** @type {((inputs?: Agent_Tool_Get_My_WorkInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Get_My_WorkInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_get_my_work(inputs)
	return __en.agent_tool_get_my_work(inputs)
});
/**

* @param {Agent_Tool_Get_ScreenInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_get_screen = /** @type {((inputs?: Agent_Tool_Get_ScreenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Get_ScreenInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_get_screen(inputs)
	return __en.agent_tool_get_screen(inputs)
});
/**

* @param {Agent_Tool_Get_SettingsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_get_settings = /** @type {((inputs?: Agent_Tool_Get_SettingsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Get_SettingsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_get_settings(inputs)
	return __en.agent_tool_get_settings(inputs)
});
/**

* @param {Agent_Tool_List_Demo_UsersInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_list_demo_users = /** @type {((inputs?: Agent_Tool_List_Demo_UsersInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_List_Demo_UsersInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_list_demo_users(inputs)
	return __en.agent_tool_list_demo_users(inputs)
});
/**

* @param {Agent_Tool_List_PagesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_list_pages = /** @type {((inputs?: Agent_Tool_List_PagesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_List_PagesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_list_pages(inputs)
	return __en.agent_tool_list_pages(inputs)
});
/**

* @param {Agent_Tool_List_ToursInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_list_tours = /** @type {((inputs?: Agent_Tool_List_ToursInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_List_ToursInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_list_tours(inputs)
	return __en.agent_tool_list_tours(inputs)
});
/**

* @param {Agent_Tool_List_WorkflowsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_list_workflows = /** @type {((inputs?: Agent_Tool_List_WorkflowsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_List_WorkflowsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_list_workflows(inputs)
	return __en.agent_tool_list_workflows(inputs)
});
/**

* @param {Agent_Tool_Mark_Notification_ReadInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_mark_notification_read = /** @type {((inputs?: Agent_Tool_Mark_Notification_ReadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Mark_Notification_ReadInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_mark_notification_read(inputs)
	return __en.agent_tool_mark_notification_read(inputs)
});
/**

* @param {Agent_Tool_My_DayInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_my_day = /** @type {((inputs?: Agent_Tool_My_DayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_My_DayInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_my_day(inputs)
	return __en.agent_tool_my_day(inputs)
});
/**

* @param {Agent_Tool_NavigateInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_navigate = /** @type {((inputs?: Agent_Tool_NavigateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_NavigateInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_navigate(inputs)
	return __en.agent_tool_navigate(inputs)
});
/**

* @param {Agent_Tool_Open_PageInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_open_page = /** @type {((inputs?: Agent_Tool_Open_PageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Open_PageInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_open_page(inputs)
	return __en.agent_tool_open_page(inputs)
});
/**

* @param {Agent_Tool_Platform_GuideInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_platform_guide = /** @type {((inputs?: Agent_Tool_Platform_GuideInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Platform_GuideInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_platform_guide(inputs)
	return __en.agent_tool_platform_guide(inputs)
});
/**

* @param {Agent_Tool_Record_StatusInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_record_status = /** @type {((inputs?: Agent_Tool_Record_StatusInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Record_StatusInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_record_status(inputs)
	return __en.agent_tool_record_status(inputs)
});
/**

* @param {Agent_Tool_Set_AppearanceInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_set_appearance = /** @type {((inputs?: Agent_Tool_Set_AppearanceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Set_AppearanceInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_set_appearance(inputs)
	return __en.agent_tool_set_appearance(inputs)
});
/**

* @param {Agent_Tool_Set_LayoutInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_set_layout = /** @type {((inputs?: Agent_Tool_Set_LayoutInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Set_LayoutInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_set_layout(inputs)
	return __en.agent_tool_set_layout(inputs)
});
/**

* @param {Agent_Tool_Start_TourInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_start_tour = /** @type {((inputs?: Agent_Tool_Start_TourInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Start_TourInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_start_tour(inputs)
	return __en.agent_tool_start_tour(inputs)
});
/**

* @param {Agent_Tool_Switch_UserInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_switch_user = /** @type {((inputs?: Agent_Tool_Switch_UserInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Switch_UserInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_switch_user(inputs)
	return __en.agent_tool_switch_user(inputs)
});
/**

* @param {Agent_Tool_Toggle_BookmarkInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_toggle_bookmark = /** @type {((inputs?: Agent_Tool_Toggle_BookmarkInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Toggle_BookmarkInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_toggle_bookmark(inputs)
	return __en.agent_tool_toggle_bookmark(inputs)
});
/**

* @param {Agent_Tool_Update_DocumentInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_update_document = /** @type {((inputs?: Agent_Tool_Update_DocumentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Update_DocumentInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_update_document(inputs)
	return __en.agent_tool_update_document(inputs)
});
/**

* @param {Agent_Tool_Update_SettingsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_update_settings = /** @type {((inputs?: Agent_Tool_Update_SettingsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_Update_SettingsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_update_settings(inputs)
	return __en.agent_tool_update_settings(inputs)
});
/**

* @param {Agent_Tool_What_Is_On_ScreenInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_what_is_on_screen = /** @type {((inputs?: Agent_Tool_What_Is_On_ScreenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_What_Is_On_ScreenInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_what_is_on_screen(inputs)
	return __en.agent_tool_what_is_on_screen(inputs)
});
/**

* @param {Agent_Tool_WithInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_tool_with = /** @type {((inputs: Agent_Tool_WithInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Tool_WithInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_tool_with(inputs)
	return __en.agent_tool_with(inputs)
});
/**

* @param {Agent_Trace_InputInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_trace_input = /** @type {((inputs?: Agent_Trace_InputInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Trace_InputInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_trace_input(inputs)
	return __en.agent_trace_input(inputs)
});
/**

* @param {Agent_Trace_ResultInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_trace_result = /** @type {((inputs?: Agent_Trace_ResultInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_Trace_ResultInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_trace_result(inputs)
	return __en.agent_trace_result(inputs)
});
/**

* @param {Agent_WorkingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const agent_working = /** @type {((inputs?: Agent_WorkingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Agent_WorkingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.agent_working(inputs)
	return __en.agent_working(inputs)
});
/**

* @param {Alert_DismissInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const alert_dismiss = /** @type {((inputs?: Alert_DismissInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Alert_DismissInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.alert_dismiss(inputs)
	return __en.alert_dismiss(inputs)
});
/**

* @param {App_Backend_FailedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const app_backend_failed = /** @type {((inputs?: App_Backend_FailedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Backend_FailedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.app_backend_failed(inputs)
	return __en.app_backend_failed(inputs)
});
/**

* @param {App_Demo_TagInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const app_demo_tag = /** @type {((inputs?: App_Demo_TagInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Demo_TagInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.app_demo_tag(inputs)
	return __en.app_demo_tag(inputs)
});
/**

* @param {App_Log_OutInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const app_log_out = /** @type {((inputs?: App_Log_OutInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Log_OutInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.app_log_out(inputs)
	return __en.app_log_out(inputs)
});
/**

* @param {App_Logged_OutInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const app_logged_out = /** @type {((inputs?: App_Logged_OutInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Logged_OutInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.app_logged_out(inputs)
	return __en.app_logged_out(inputs)
});
/**

* @param {App_Nav_DashboardInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const app_nav_dashboard = /** @type {((inputs?: App_Nav_DashboardInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Nav_DashboardInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.app_nav_dashboard(inputs)
	return __en.app_nav_dashboard(inputs)
});
/**

* @param {App_Nav_HomeInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const app_nav_home = /** @type {((inputs?: App_Nav_HomeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Nav_HomeInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.app_nav_home(inputs)
	return __en.app_nav_home(inputs)
});
/**

* @param {App_Needs_AttentionInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const app_needs_attention = /** @type {((inputs?: App_Needs_AttentionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Needs_AttentionInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.app_needs_attention(inputs)
	return __en.app_needs_attention(inputs)
});
/**

* @param {App_Not_Found_BackInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const app_not_found_back = /** @type {((inputs?: App_Not_Found_BackInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Not_Found_BackInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.app_not_found_back(inputs)
	return __en.app_not_found_back(inputs)
});
/**

* @param {App_Not_Found_DescriptionInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const app_not_found_description = /** @type {((inputs?: App_Not_Found_DescriptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Not_Found_DescriptionInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.app_not_found_description(inputs)
	return __en.app_not_found_description(inputs)
});
/**

* @param {App_Not_Found_HeadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const app_not_found_heading = /** @type {((inputs?: App_Not_Found_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Not_Found_HeadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.app_not_found_heading(inputs)
	return __en.app_not_found_heading(inputs)
});
/**

* @param {App_Powered_ByInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const app_powered_by = /** @type {((inputs: App_Powered_ByInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Powered_ByInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.app_powered_by(inputs)
	return __en.app_powered_by(inputs)
});
/**

* @param {App_Shell_NavigationInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const app_shell_navigation = /** @type {((inputs?: App_Shell_NavigationInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Shell_NavigationInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.app_shell_navigation(inputs)
	return __en.app_shell_navigation(inputs)
});
/**

* @param {App_Shell_Side_PanelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const app_shell_side_panel = /** @type {((inputs?: App_Shell_Side_PanelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Shell_Side_PanelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.app_shell_side_panel(inputs)
	return __en.app_shell_side_panel(inputs)
});
/**

* @param {App_Side_PanelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const app_side_panel = /** @type {((inputs?: App_Side_PanelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Side_PanelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.app_side_panel(inputs)
	return __en.app_side_panel(inputs)
});
/**

* @param {App_Switch_User_FailedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const app_switch_user_failed = /** @type {((inputs: App_Switch_User_FailedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Switch_User_FailedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.app_switch_user_failed(inputs)
	return __en.app_switch_user_failed(inputs)
});
/**

* @param {App_Switch_User_HeadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const app_switch_user_heading = /** @type {((inputs?: App_Switch_User_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Switch_User_HeadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.app_switch_user_heading(inputs)
	return __en.app_switch_user_heading(inputs)
});
/**

* @param {App_Switch_User_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const app_switch_user_label = /** @type {((inputs: App_Switch_User_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Switch_User_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.app_switch_user_label(inputs)
	return __en.app_switch_user_label(inputs)
});
/**

* @param {App_Switched_UserInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const app_switched_user = /** @type {((inputs: App_Switched_UserInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Switched_UserInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.app_switched_user(inputs)
	return __en.app_switched_user(inputs)
});
/**

* @param {App_Title_AccountInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const app_title_account = /** @type {((inputs?: App_Title_AccountInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Title_AccountInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.app_title_account(inputs)
	return __en.app_title_account(inputs)
});
/**

* @param {App_Title_Create_First_UserInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const app_title_create_first_user = /** @type {((inputs?: App_Title_Create_First_UserInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Title_Create_First_UserInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.app_title_create_first_user(inputs)
	return __en.app_title_create_first_user(inputs)
});
/**

* @param {App_Title_LoginInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const app_title_login = /** @type {((inputs?: App_Title_LoginInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Title_LoginInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.app_title_login(inputs)
	return __en.app_title_login(inputs)
});
/**

* @param {App_Title_Not_FoundInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const app_title_not_found = /** @type {((inputs?: App_Title_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Title_Not_FoundInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.app_title_not_found(inputs)
	return __en.app_title_not_found(inputs)
});
/**

* @param {App_Title_SuffixInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const app_title_suffix = /** @type {((inputs?: App_Title_SuffixInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_Title_SuffixInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.app_title_suffix(inputs)
	return __en.app_title_suffix(inputs)
});
/**

* @param {App_View_LoadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const app_view_loading = /** @type {((inputs?: App_View_LoadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_View_LoadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.app_view_loading(inputs)
	return __en.app_view_loading(inputs)
});
/**

* @param {Appearance_All_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const appearance_all_label = /** @type {((inputs?: Appearance_All_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Appearance_All_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.appearance_all_label(inputs)
	return __en.appearance_all_label(inputs)
});
/**

* @param {Appearance_Background_HeadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const appearance_background_heading = /** @type {((inputs?: Appearance_Background_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Appearance_Background_HeadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.appearance_background_heading(inputs)
	return __en.appearance_background_heading(inputs)
});
/**

* @param {Appearance_Background_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const appearance_background_label = /** @type {((inputs?: Appearance_Background_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Appearance_Background_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.appearance_background_label(inputs)
	return __en.appearance_background_label(inputs)
});
/**

* @param {Appearance_Background_Live_Magnet_LinesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const appearance_background_live_magnet_lines = /** @type {((inputs?: Appearance_Background_Live_Magnet_LinesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Appearance_Background_Live_Magnet_LinesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.appearance_background_live_magnet_lines(inputs)
	return __en.appearance_background_live_magnet_lines(inputs)
});
/**

* @param {Appearance_Background_Live_WavesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const appearance_background_live_waves = /** @type {((inputs?: Appearance_Background_Live_WavesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Appearance_Background_Live_WavesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.appearance_background_live_waves(inputs)
	return __en.appearance_background_live_waves(inputs)
});
/**

* @param {Appearance_Background_NoneInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const appearance_background_none = /** @type {((inputs?: Appearance_Background_NoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Appearance_Background_NoneInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.appearance_background_none(inputs)
	return __en.appearance_background_none(inputs)
});
/**

* @param {Appearance_Background_ReplaceInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const appearance_background_replace = /** @type {((inputs?: Appearance_Background_ReplaceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Appearance_Background_ReplaceInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.appearance_background_replace(inputs)
	return __en.appearance_background_replace(inputs)
});
/**

* @param {Appearance_Background_UploadInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const appearance_background_upload = /** @type {((inputs?: Appearance_Background_UploadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Appearance_Background_UploadInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.appearance_background_upload(inputs)
	return __en.appearance_background_upload(inputs)
});
/**

* @param {Appearance_Language_ArInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const appearance_language_ar = /** @type {((inputs?: Appearance_Language_ArInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Appearance_Language_ArInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.appearance_language_ar(inputs)
	return __en.appearance_language_ar(inputs)
});
/**

* @param {Appearance_Language_CurrentInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const appearance_language_current = /** @type {((inputs?: Appearance_Language_CurrentInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Appearance_Language_CurrentInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.appearance_language_current(inputs)
	return __en.appearance_language_current(inputs)
});
/**

* @param {Appearance_Language_EnInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const appearance_language_en = /** @type {((inputs?: Appearance_Language_EnInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Appearance_Language_EnInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.appearance_language_en(inputs)
	return __en.appearance_language_en(inputs)
});
/**

* @param {Appearance_Language_HeadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const appearance_language_heading = /** @type {((inputs?: Appearance_Language_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Appearance_Language_HeadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.appearance_language_heading(inputs)
	return __en.appearance_language_heading(inputs)
});
/**

* @param {Appearance_Language_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const appearance_language_label = /** @type {((inputs: Appearance_Language_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Appearance_Language_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.appearance_language_label(inputs)
	return __en.appearance_language_label(inputs)
});
/**

* @param {Appearance_Scheme_DefaultInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const appearance_scheme_default = /** @type {((inputs?: Appearance_Scheme_DefaultInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Appearance_Scheme_DefaultInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.appearance_scheme_default(inputs)
	return __en.appearance_scheme_default(inputs)
});
/**

* @param {Appearance_Scheme_HeadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const appearance_scheme_heading = /** @type {((inputs?: Appearance_Scheme_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Appearance_Scheme_HeadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.appearance_scheme_heading(inputs)
	return __en.appearance_scheme_heading(inputs)
});
/**

* @param {Appearance_Scheme_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const appearance_scheme_label = /** @type {((inputs: Appearance_Scheme_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Appearance_Scheme_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.appearance_scheme_label(inputs)
	return __en.appearance_scheme_label(inputs)
});
/**

* @param {Appearance_Theme_DarkInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const appearance_theme_dark = /** @type {((inputs?: Appearance_Theme_DarkInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Appearance_Theme_DarkInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.appearance_theme_dark(inputs)
	return __en.appearance_theme_dark(inputs)
});
/**

* @param {Appearance_Theme_HeadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const appearance_theme_heading = /** @type {((inputs?: Appearance_Theme_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Appearance_Theme_HeadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.appearance_theme_heading(inputs)
	return __en.appearance_theme_heading(inputs)
});
/**

* @param {Appearance_Theme_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const appearance_theme_label = /** @type {((inputs: Appearance_Theme_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Appearance_Theme_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.appearance_theme_label(inputs)
	return __en.appearance_theme_label(inputs)
});
/**

* @param {Appearance_Theme_LightInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const appearance_theme_light = /** @type {((inputs?: Appearance_Theme_LightInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Appearance_Theme_LightInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.appearance_theme_light(inputs)
	return __en.appearance_theme_light(inputs)
});
/**

* @param {Appearance_Theme_SystemInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const appearance_theme_system = /** @type {((inputs?: Appearance_Theme_SystemInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Appearance_Theme_SystemInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.appearance_theme_system(inputs)
	return __en.appearance_theme_system(inputs)
});
/**

* @param {Aside_Bookmark_AddInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const aside_bookmark_add = /** @type {((inputs?: Aside_Bookmark_AddInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aside_Bookmark_AddInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.aside_bookmark_add(inputs)
	return __en.aside_bookmark_add(inputs)
});
/**

* @param {Aside_Bookmark_ListInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const aside_bookmark_list = /** @type {((inputs?: Aside_Bookmark_ListInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aside_Bookmark_ListInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.aside_bookmark_list(inputs)
	return __en.aside_bookmark_list(inputs)
});
/**

* @param {Aside_Bookmark_RecordInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const aside_bookmark_record = /** @type {((inputs?: Aside_Bookmark_RecordInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aside_Bookmark_RecordInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.aside_bookmark_record(inputs)
	return __en.aside_bookmark_record(inputs)
});
/**

* @param {Aside_Bookmark_RemoveInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const aside_bookmark_remove = /** @type {((inputs?: Aside_Bookmark_RemoveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aside_Bookmark_RemoveInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.aside_bookmark_remove(inputs)
	return __en.aside_bookmark_remove(inputs)
});
/**

* @param {Aside_Bookmark_ScreenInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const aside_bookmark_screen = /** @type {((inputs?: Aside_Bookmark_ScreenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aside_Bookmark_ScreenInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.aside_bookmark_screen(inputs)
	return __en.aside_bookmark_screen(inputs)
});
/**

* @param {Aside_Bookmark_SettingsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const aside_bookmark_settings = /** @type {((inputs?: Aside_Bookmark_SettingsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aside_Bookmark_SettingsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.aside_bookmark_settings(inputs)
	return __en.aside_bookmark_settings(inputs)
});
/**

* @param {Aside_BookmarksInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const aside_bookmarks = /** @type {((inputs?: Aside_BookmarksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aside_BookmarksInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.aside_bookmarks(inputs)
	return __en.aside_bookmarks(inputs)
});
/**

* @param {Aside_Bookmarks_EmptyInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const aside_bookmarks_empty = /** @type {((inputs?: Aside_Bookmarks_EmptyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aside_Bookmarks_EmptyInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.aside_bookmarks_empty(inputs)
	return __en.aside_bookmarks_empty(inputs)
});
/**

* @param {Aside_Caught_UpInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const aside_caught_up = /** @type {((inputs?: Aside_Caught_UpInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aside_Caught_UpInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.aside_caught_up(inputs)
	return __en.aside_caught_up(inputs)
});
/**

* @param {Aside_LoadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const aside_loading = /** @type {((inputs?: Aside_LoadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aside_LoadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.aside_loading(inputs)
	return __en.aside_loading(inputs)
});
/**

* @param {Aside_Notification_ReadInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const aside_notification_read = /** @type {((inputs?: Aside_Notification_ReadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aside_Notification_ReadInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.aside_notification_read(inputs)
	return __en.aside_notification_read(inputs)
});
/**

* @param {Aside_NotificationsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const aside_notifications = /** @type {((inputs?: Aside_NotificationsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aside_NotificationsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.aside_notifications(inputs)
	return __en.aside_notifications(inputs)
});
/**

* @param {Aside_Notifications_UnreadInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const aside_notifications_unread = /** @type {((inputs: Aside_Notifications_UnreadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aside_Notifications_UnreadInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.aside_notifications_unread(inputs)
	return __en.aside_notifications_unread(inputs)
});
/**

* @param {Aside_Tour_DoneInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const aside_tour_done = /** @type {((inputs?: Aside_Tour_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aside_Tour_DoneInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.aside_tour_done(inputs)
	return __en.aside_tour_done(inputs)
});
/**

* @param {Aside_Tour_StepsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const aside_tour_steps = /** @type {((inputs: Aside_Tour_StepsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aside_Tour_StepsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.aside_tour_steps(inputs)
	return __en.aside_tour_steps(inputs)
});
/**

* @param {Aside_ToursInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const aside_tours = /** @type {((inputs?: Aside_ToursInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aside_ToursInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.aside_tours(inputs)
	return __en.aside_tours(inputs)
});
/**

* @param {Aside_WidgetsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const aside_widgets = /** @type {((inputs?: Aside_WidgetsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aside_WidgetsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.aside_widgets(inputs)
	return __en.aside_widgets(inputs)
});
/**

* @param {Ask_AskInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const ask_ask = /** @type {((inputs?: Ask_AskInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ask_AskInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.ask_ask(inputs)
	return __en.ask_ask(inputs)
});
/**

* @param {Ask_AssistantInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const ask_assistant = /** @type {((inputs?: Ask_AssistantInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ask_AssistantInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.ask_assistant(inputs)
	return __en.ask_assistant(inputs)
});
/**

* @param {Ask_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const ask_placeholder = /** @type {((inputs?: Ask_PlaceholderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ask_PlaceholderInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.ask_placeholder(inputs)
	return __en.ask_placeholder(inputs)
});
/**

* @param {Ask_QuestionInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const ask_question = /** @type {((inputs?: Ask_QuestionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ask_QuestionInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.ask_question(inputs)
	return __en.ask_question(inputs)
});
/**

* @param {Ask_ReadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const ask_reading = /** @type {((inputs?: Ask_ReadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ask_ReadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.ask_reading(inputs)
	return __en.ask_reading(inputs)
});
/**

* @param {Ask_Reading_RecordsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const ask_reading_records = /** @type {((inputs?: Ask_Reading_RecordsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ask_Reading_RecordsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.ask_reading_records(inputs)
	return __en.ask_reading_records(inputs)
});
/**

* @param {Ask_SourcesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const ask_sources = /** @type {((inputs?: Ask_SourcesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ask_SourcesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.ask_sources(inputs)
	return __en.ask_sources(inputs)
});
/**

* @param {Ask_YouInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const ask_you = /** @type {((inputs?: Ask_YouInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ask_YouInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.ask_you(inputs)
	return __en.ask_you(inputs)
});
/**

* @param {Assist_Catch_Me_UpInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_catch_me_up = /** @type {((inputs?: Assist_Catch_Me_UpInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Catch_Me_UpInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_catch_me_up(inputs)
	return __en.assist_catch_me_up(inputs)
});
/**

* @param {Assist_Check_AgainInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_check_again = /** @type {((inputs?: Assist_Check_AgainInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Check_AgainInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_check_again(inputs)
	return __en.assist_check_again(inputs)
});
/**

* @param {Assist_Check_With_AiInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_check_with_ai = /** @type {((inputs?: Assist_Check_With_AiInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Check_With_AiInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_check_with_ai(inputs)
	return __en.assist_check_with_ai(inputs)
});
/**

* @param {Assist_Checked_HeadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_checked_heading = /** @type {((inputs?: Assist_Checked_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Checked_HeadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_checked_heading(inputs)
	return __en.assist_checked_heading(inputs)
});
/**

* @param {Assist_CheckingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_checking = /** @type {((inputs?: Assist_CheckingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_CheckingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_checking(inputs)
	return __en.assist_checking(inputs)
});
/**

* @param {Assist_ClassifiedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_classified = /** @type {((inputs: Assist_ClassifiedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_ClassifiedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_classified(inputs)
	return __en.assist_classified(inputs)
});
/**

* @param {Assist_CopiedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_copied = /** @type {((inputs?: Assist_CopiedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_CopiedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_copied(inputs)
	return __en.assist_copied(inputs)
});
/**

* @param {Assist_DictateInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_dictate = /** @type {((inputs?: Assist_DictateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_DictateInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_dictate(inputs)
	return __en.assist_dictate(inputs)
});
/**

* @param {Assist_DownloadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_downloading = /** @type {((inputs: Assist_DownloadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_DownloadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_downloading(inputs)
	return __en.assist_downloading(inputs)
});
/**

* @param {Assist_DraftedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_drafted = /** @type {((inputs?: Assist_DraftedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_DraftedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_drafted(inputs)
	return __en.assist_drafted(inputs)
});
/**

* @param {Assist_DraftingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_drafting = /** @type {((inputs?: Assist_DraftingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_DraftingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_drafting(inputs)
	return __en.assist_drafting(inputs)
});
/**

* @param {Assist_Error_FailedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_error_failed = /** @type {((inputs?: Assist_Error_FailedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Error_FailedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_error_failed(inputs)
	return __en.assist_error_failed(inputs)
});
/**

* @param {Assist_Fill_From_TextInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_fill_from_text = /** @type {((inputs?: Assist_Fill_From_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Fill_From_TextInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_fill_from_text(inputs)
	return __en.assist_fill_from_text(inputs)
});
/**

* @param {Assist_FixesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_fixes = /** @type {((inputs: Assist_FixesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_FixesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_fixes(inputs)
	return __en.assist_fixes(inputs)
});
/**

* @param {Assist_Flag_NoteInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_flag_note = /** @type {((inputs: Assist_Flag_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Flag_NoteInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_flag_note(inputs)
	return __en.assist_flag_note(inputs)
});
/**

* @param {Assist_Found_HeadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_found_heading = /** @type {((inputs?: Assist_Found_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Found_HeadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_found_heading(inputs)
	return __en.assist_found_heading(inputs)
});
/**

* @param {Assist_Heard_FromInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_heard_from = /** @type {((inputs: Assist_Heard_FromInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Heard_FromInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_heard_from(inputs)
	return __en.assist_heard_from(inputs)
});
/**

* @param {Assist_Hide_SummaryInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_hide_summary = /** @type {((inputs?: Assist_Hide_SummaryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Hide_SummaryInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_hide_summary(inputs)
	return __en.assist_hide_summary(inputs)
});
/**

* @param {Assist_Key_Points_HeadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_key_points_heading = /** @type {((inputs?: Assist_Key_Points_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Key_Points_HeadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_key_points_heading(inputs)
	return __en.assist_key_points_heading(inputs)
});
/**

* @param {Assist_ListeningInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_listening = /** @type {((inputs?: Assist_ListeningInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_ListeningInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_listening(inputs)
	return __en.assist_listening(inputs)
});
/**

* @param {Assist_Looks_LikeInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_looks_like = /** @type {((inputs?: Assist_Looks_LikeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Looks_LikeInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_looks_like(inputs)
	return __en.assist_looks_like(inputs)
});
/**

* @param {Assist_Made_FirmerInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_made_firmer = /** @type {((inputs?: Assist_Made_FirmerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Made_FirmerInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_made_firmer(inputs)
	return __en.assist_made_firmer(inputs)
});
/**

* @param {Assist_Made_FormalInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_made_formal = /** @type {((inputs?: Assist_Made_FormalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Made_FormalInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_made_formal(inputs)
	return __en.assist_made_formal(inputs)
});
/**

* @param {Assist_Made_FriendlierInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_made_friendlier = /** @type {((inputs?: Assist_Made_FriendlierInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Made_FriendlierInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_made_friendlier(inputs)
	return __en.assist_made_friendlier(inputs)
});
/**

* @param {Assist_No_FixesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_no_fixes = /** @type {((inputs?: Assist_No_FixesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_No_FixesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_no_fixes(inputs)
	return __en.assist_no_fixes(inputs)
});
/**

* @param {Assist_No_MicrophoneInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_no_microphone = /** @type {((inputs?: Assist_No_MicrophoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_No_MicrophoneInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_no_microphone(inputs)
	return __en.assist_no_microphone(inputs)
});
/**

* @param {Assist_Not_FoundInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_not_found = /** @type {((inputs?: Assist_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Not_FoundInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_not_found(inputs)
	return __en.assist_not_found(inputs)
});
/**

* @param {Assist_Other_RepliesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_other_replies = /** @type {((inputs?: Assist_Other_RepliesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Other_RepliesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_other_replies(inputs)
	return __en.assist_other_replies(inputs)
});
/**

* @param {Assist_Paste_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_paste_placeholder = /** @type {((inputs?: Assist_Paste_PlaceholderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Paste_PlaceholderInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_paste_placeholder(inputs)
	return __en.assist_paste_placeholder(inputs)
});
/**

* @param {Assist_ProofreadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_proofreading = /** @type {((inputs?: Assist_ProofreadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_ProofreadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_proofreading(inputs)
	return __en.assist_proofreading(inputs)
});
/**

* @param {Assist_Read_AloudInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_read_aloud = /** @type {((inputs?: Assist_Read_AloudInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Read_AloudInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_read_aloud(inputs)
	return __en.assist_read_aloud(inputs)
});
/**

* @param {Assist_Read_FileInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_read_file = /** @type {((inputs?: Assist_Read_FileInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Read_FileInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_read_file(inputs)
	return __en.assist_read_file(inputs)
});
/**

* @param {Assist_Read_FromInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_read_from = /** @type {((inputs: Assist_Read_FromInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Read_FromInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_read_from(inputs)
	return __en.assist_read_from(inputs)
});
/**

* @param {Assist_ReadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_reading = /** @type {((inputs?: Assist_ReadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_ReadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_reading(inputs)
	return __en.assist_reading(inputs)
});
/**

* @param {Assist_Reading_PhotoInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_reading_photo = /** @type {((inputs?: Assist_Reading_PhotoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Reading_PhotoInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_reading_photo(inputs)
	return __en.assist_reading_photo(inputs)
});
/**

* @param {Assist_RewritingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_rewriting = /** @type {((inputs?: Assist_RewritingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_RewritingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_rewriting(inputs)
	return __en.assist_rewriting(inputs)
});
/**

* @param {Assist_ShortenedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_shortened = /** @type {((inputs?: Assist_ShortenedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_ShortenedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_shortened(inputs)
	return __en.assist_shortened(inputs)
});
/**

* @param {Assist_ShorteningInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_shortening = /** @type {((inputs?: Assist_ShorteningInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_ShorteningInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_shortening(inputs)
	return __en.assist_shortening(inputs)
});
/**

* @param {Assist_Show_OriginalInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_show_original = /** @type {((inputs?: Assist_Show_OriginalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Show_OriginalInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_show_original(inputs)
	return __en.assist_show_original(inputs)
});
/**

* @param {Assist_StopInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_stop = /** @type {((inputs?: Assist_StopInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_StopInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_stop(inputs)
	return __en.assist_stop(inputs)
});
/**

* @param {Assist_Stop_DictatingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_stop_dictating = /** @type {((inputs?: Assist_Stop_DictatingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Stop_DictatingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_stop_dictating(inputs)
	return __en.assist_stop_dictating(inputs)
});
/**

* @param {Assist_Suggest_CategoryInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_suggest_category = /** @type {((inputs?: Assist_Suggest_CategoryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Suggest_CategoryInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_suggest_category(inputs)
	return __en.assist_suggest_category(inputs)
});
/**

* @param {Assist_Suggest_RepliesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_suggest_replies = /** @type {((inputs?: Assist_Suggest_RepliesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Suggest_RepliesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_suggest_replies(inputs)
	return __en.assist_suggest_replies(inputs)
});
/**

* @param {Assist_Summarised_On_DeviceInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_summarised_on_device = /** @type {((inputs?: Assist_Summarised_On_DeviceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Summarised_On_DeviceInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_summarised_on_device(inputs)
	return __en.assist_summarised_on_device(inputs)
});
/**

* @param {Assist_Summary_HeadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_summary_heading = /** @type {((inputs?: Assist_Summary_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Summary_HeadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_summary_heading(inputs)
	return __en.assist_summary_heading(inputs)
});
/**

* @param {Assist_Tool_DraftInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_tool_draft = /** @type {((inputs?: Assist_Tool_DraftInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Tool_DraftInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_tool_draft(inputs)
	return __en.assist_tool_draft(inputs)
});
/**

* @param {Assist_Tool_FirmInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_tool_firm = /** @type {((inputs?: Assist_Tool_FirmInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Tool_FirmInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_tool_firm(inputs)
	return __en.assist_tool_firm(inputs)
});
/**

* @param {Assist_Tool_FormalInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_tool_formal = /** @type {((inputs?: Assist_Tool_FormalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Tool_FormalInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_tool_formal(inputs)
	return __en.assist_tool_formal(inputs)
});
/**

* @param {Assist_Tool_FriendlyInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_tool_friendly = /** @type {((inputs?: Assist_Tool_FriendlyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Tool_FriendlyInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_tool_friendly(inputs)
	return __en.assist_tool_friendly(inputs)
});
/**

* @param {Assist_Tool_ProofreadInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_tool_proofread = /** @type {((inputs?: Assist_Tool_ProofreadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Tool_ProofreadInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_tool_proofread(inputs)
	return __en.assist_tool_proofread(inputs)
});
/**

* @param {Assist_Tool_ShorterInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_tool_shorter = /** @type {((inputs?: Assist_Tool_ShorterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Tool_ShorterInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_tool_shorter(inputs)
	return __en.assist_tool_shorter(inputs)
});
/**

* @param {Assist_Tool_TranslateInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_tool_translate = /** @type {((inputs?: Assist_Tool_TranslateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Tool_TranslateInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_tool_translate(inputs)
	return __en.assist_tool_translate(inputs)
});
/**

* @param {Assist_Translate_ToInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_translate_to = /** @type {((inputs: Assist_Translate_ToInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Translate_ToInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_translate_to(inputs)
	return __en.assist_translate_to(inputs)
});
/**

* @param {Assist_Translated_NoteInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_translated_note = /** @type {((inputs?: Assist_Translated_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Translated_NoteInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_translated_note(inputs)
	return __en.assist_translated_note(inputs)
});
/**

* @param {Assist_Translated_ToInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_translated_to = /** @type {((inputs: Assist_Translated_ToInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Translated_ToInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_translated_to(inputs)
	return __en.assist_translated_to(inputs)
});
/**

* @param {Assist_TranslatingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_translating = /** @type {((inputs?: Assist_TranslatingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_TranslatingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_translating(inputs)
	return __en.assist_translating(inputs)
});
/**

* @param {Assist_Translating_ToInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_translating_to = /** @type {((inputs: Assist_Translating_ToInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Translating_ToInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_translating_to(inputs)
	return __en.assist_translating_to(inputs)
});
/**

* @param {Assist_UndoInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_undo = /** @type {((inputs?: Assist_UndoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_UndoInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_undo(inputs)
	return __en.assist_undo(inputs)
});
/**

* @param {Assist_Use_TheseInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_use_these = /** @type {((inputs?: Assist_Use_TheseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Use_TheseInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_use_these(inputs)
	return __en.assist_use_these(inputs)
});
/**

* @param {Assist_Use_ThisInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_use_this = /** @type {((inputs?: Assist_Use_ThisInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Use_ThisInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_use_this(inputs)
	return __en.assist_use_this(inputs)
});
/**

* @param {Assist_Writing_DownInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_writing_down = /** @type {((inputs?: Assist_Writing_DownInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Writing_DownInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_writing_down(inputs)
	return __en.assist_writing_down(inputs)
});
/**

* @param {Assist_Writing_RepliesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const assist_writing_replies = /** @type {((inputs?: Assist_Writing_RepliesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Assist_Writing_RepliesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.assist_writing_replies(inputs)
	return __en.assist_writing_replies(inputs)
});
/**

* @param {Auth_Account_CreatedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_account_created = /** @type {((inputs?: Auth_Account_CreatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Account_CreatedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_account_created(inputs)
	return __en.auth_account_created(inputs)
});
/**

* @param {Auth_Ai_DownloadInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_ai_download = /** @type {((inputs: Auth_Ai_DownloadInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Ai_DownloadInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_ai_download(inputs)
	return __en.auth_ai_download(inputs)
});
/**

* @param {Auth_Ai_Download_BodyInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_ai_download_body = /** @type {((inputs?: Auth_Ai_Download_BodyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Ai_Download_BodyInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_ai_download_body(inputs)
	return __en.auth_ai_download_body(inputs)
});
/**

* @param {Auth_Ai_Download_TitleInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_ai_download_title = /** @type {((inputs?: Auth_Ai_Download_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Ai_Download_TitleInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_ai_download_title(inputs)
	return __en.auth_ai_download_title(inputs)
});
/**

* @param {Auth_Ai_FlagsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_ai_flags = /** @type {((inputs: Auth_Ai_FlagsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Ai_FlagsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_ai_flags(inputs)
	return __en.auth_ai_flags(inputs)
});
/**

* @param {Auth_Ai_Flags_MoreInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_ai_flags_more = /** @type {((inputs?: Auth_Ai_Flags_MoreInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Ai_Flags_MoreInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_ai_flags_more(inputs)
	return __en.auth_ai_flags_more(inputs)
});
/**

* @param {Auth_Ai_HeadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_ai_heading = /** @type {((inputs?: Auth_Ai_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Ai_HeadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_ai_heading(inputs)
	return __en.auth_ai_heading(inputs)
});
/**

* @param {Auth_Ai_LoadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_ai_loading = /** @type {((inputs?: Auth_Ai_LoadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Ai_LoadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_ai_loading(inputs)
	return __en.auth_ai_loading(inputs)
});
/**

* @param {Auth_Ai_Local_OnInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_ai_local_on = /** @type {((inputs?: Auth_Ai_Local_OnInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Ai_Local_OnInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_ai_local_on(inputs)
	return __en.auth_ai_local_on(inputs)
});
/**

* @param {Auth_Ai_Native_OnInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_ai_native_on = /** @type {((inputs?: Auth_Ai_Native_OnInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Ai_Native_OnInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_ai_native_on(inputs)
	return __en.auth_ai_native_on(inputs)
});
/**

* @param {Auth_Ai_Native_TitleInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_ai_native_title = /** @type {((inputs?: Auth_Ai_Native_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Ai_Native_TitleInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_ai_native_title(inputs)
	return __en.auth_ai_native_title(inputs)
});
/**

* @param {Auth_Ai_RecommendedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_ai_recommended = /** @type {((inputs?: Auth_Ai_RecommendedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Ai_RecommendedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_ai_recommended(inputs)
	return __en.auth_ai_recommended(inputs)
});
/**

* @param {Auth_ChangeInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_change = /** @type {((inputs?: Auth_ChangeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_ChangeInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_change(inputs)
	return __en.auth_change(inputs)
});
/**

* @param {Auth_Code_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_code_label = /** @type {((inputs?: Auth_Code_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Code_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_code_label(inputs)
	return __en.auth_code_label(inputs)
});
/**

* @param {Auth_Code_PromptInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_code_prompt = /** @type {((inputs: Auth_Code_PromptInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Code_PromptInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_code_prompt(inputs)
	return __en.auth_code_prompt(inputs)
});
/**

* @param {Auth_ContinueInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_continue = /** @type {((inputs?: Auth_ContinueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_ContinueInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_continue(inputs)
	return __en.auth_continue(inputs)
});
/**

* @param {Auth_CreateInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_create = /** @type {((inputs?: Auth_CreateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_CreateInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_create(inputs)
	return __en.auth_create(inputs)
});
/**

* @param {Auth_Demo_NoteInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_demo_note = /** @type {((inputs: Auth_Demo_NoteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Demo_NoteInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_demo_note(inputs)
	return __en.auth_demo_note(inputs)
});
/**

* @param {Auth_EmailInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_email = /** @type {((inputs?: Auth_EmailInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_EmailInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_email(inputs)
	return __en.auth_email(inputs)
});
/**

* @param {Auth_First_User_HeadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_first_user_heading = /** @type {((inputs?: Auth_First_User_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_First_User_HeadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_first_user_heading(inputs)
	return __en.auth_first_user_heading(inputs)
});
/**

* @param {Auth_First_User_IntroInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_first_user_intro = /** @type {((inputs?: Auth_First_User_IntroInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_First_User_IntroInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_first_user_intro(inputs)
	return __en.auth_first_user_intro(inputs)
});
/**

* @param {Auth_Log_InInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_log_in = /** @type {((inputs?: Auth_Log_InInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Log_InInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_log_in(inputs)
	return __en.auth_log_in(inputs)
});
/**

* @param {Auth_Login_IntroInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_login_intro = /** @type {((inputs?: Auth_Login_IntroInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Login_IntroInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_login_intro(inputs)
	return __en.auth_login_intro(inputs)
});
/**

* @param {Auth_OrInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_or = /** @type {((inputs?: Auth_OrInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_OrInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_or(inputs)
	return __en.auth_or(inputs)
});
/**

* @param {Auth_Passkey_UseInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_passkey_use = /** @type {((inputs?: Auth_Passkey_UseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Passkey_UseInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_passkey_use(inputs)
	return __en.auth_passkey_use(inputs)
});
/**

* @param {Auth_Passkey_WaitingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_passkey_waiting = /** @type {((inputs?: Auth_Passkey_WaitingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Passkey_WaitingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_passkey_waiting(inputs)
	return __en.auth_passkey_waiting(inputs)
});
/**

* @param {Auth_Password_RequiredInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_password_required = /** @type {((inputs?: Auth_Password_RequiredInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Password_RequiredInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_password_required(inputs)
	return __en.auth_password_required(inputs)
});
/**

* @param {Auth_Signing_In_AsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_signing_in_as = /** @type {((inputs?: Auth_Signing_In_AsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Signing_In_AsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_signing_in_as(inputs)
	return __en.auth_signing_in_as(inputs)
});
/**

* @param {Auth_Verify_And_Log_InInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_verify_and_log_in = /** @type {((inputs?: Auth_Verify_And_Log_InInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Verify_And_Log_InInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_verify_and_log_in(inputs)
	return __en.auth_verify_and_log_in(inputs)
});
/**

* @param {Auth_Verify_HeadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_verify_heading = /** @type {((inputs?: Auth_Verify_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Verify_HeadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_verify_heading(inputs)
	return __en.auth_verify_heading(inputs)
});
/**

* @param {Auth_VerifyingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_verifying = /** @type {((inputs?: Auth_VerifyingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_VerifyingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_verifying(inputs)
	return __en.auth_verifying(inputs)
});
/**

* @param {Auth_Welcome_BackInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const auth_welcome_back = /** @type {((inputs?: Auth_Welcome_BackInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Auth_Welcome_BackInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.auth_welcome_back(inputs)
	return __en.auth_welcome_back(inputs)
});
/**

* @param {Avatar_MoreInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const avatar_more = /** @type {((inputs: Avatar_MoreInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Avatar_MoreInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.avatar_more(inputs)
	return __en.avatar_more(inputs)
});
/**

* @param {Badge_StatusInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const badge_status = /** @type {((inputs?: Badge_StatusInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Badge_StatusInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.badge_status(inputs)
	return __en.badge_status(inputs)
});
/**

* @param {Breadcrumbs_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const breadcrumbs_label = /** @type {((inputs?: Breadcrumbs_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Breadcrumbs_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.breadcrumbs_label(inputs)
	return __en.breadcrumbs_label(inputs)
});
/**

* @param {Bullet_BandInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const bullet_band = /** @type {((inputs: Bullet_BandInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bullet_BandInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.bullet_band(inputs)
	return __en.bullet_band(inputs)
});
/**

* @param {Bullet_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const bullet_label = /** @type {((inputs?: Bullet_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bullet_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.bullet_label(inputs)
	return __en.bullet_label(inputs)
});
/**

* @param {Bullet_Quality_GoodInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const bullet_quality_good = /** @type {((inputs?: Bullet_Quality_GoodInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bullet_Quality_GoodInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.bullet_quality_good(inputs)
	return __en.bullet_quality_good(inputs)
});
/**

* @param {Bullet_Quality_OkInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const bullet_quality_ok = /** @type {((inputs?: Bullet_Quality_OkInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bullet_Quality_OkInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.bullet_quality_ok(inputs)
	return __en.bullet_quality_ok(inputs)
});
/**

* @param {Bullet_Quality_PoorInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const bullet_quality_poor = /** @type {((inputs?: Bullet_Quality_PoorInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bullet_Quality_PoorInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.bullet_quality_poor(inputs)
	return __en.bullet_quality_poor(inputs)
});
/**

* @param {Bullet_Reading_OfInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const bullet_reading_of = /** @type {((inputs: Bullet_Reading_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bullet_Reading_OfInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.bullet_reading_of(inputs)
	return __en.bullet_reading_of(inputs)
});
/**

* @param {Bullet_Reading_RangeInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const bullet_reading_range = /** @type {((inputs: Bullet_Reading_RangeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bullet_Reading_RangeInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.bullet_reading_range(inputs)
	return __en.bullet_reading_range(inputs)
});
/**

* @param {Bullet_Reading_TargetInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const bullet_reading_target = /** @type {((inputs: Bullet_Reading_TargetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bullet_Reading_TargetInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.bullet_reading_target(inputs)
	return __en.bullet_reading_target(inputs)
});
/**

* @param {Bullet_TargetInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const bullet_target = /** @type {((inputs: Bullet_TargetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bullet_TargetInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.bullet_target(inputs)
	return __en.bullet_target(inputs)
});
/**

* @param {Chart_RangeInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const chart_range = /** @type {((inputs?: Chart_RangeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_RangeInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.chart_range(inputs)
	return __en.chart_range(inputs)
});
/**

* @param {Chart_SeriesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const chart_series = /** @type {((inputs?: Chart_SeriesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_SeriesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.chart_series(inputs)
	return __en.chart_series(inputs)
});
/**

* @param {Chart_TargetInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const chart_target = /** @type {((inputs?: Chart_TargetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_TargetInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.chart_target(inputs)
	return __en.chart_target(inputs)
});
/**

* @param {Chart_TotalInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const chart_total = /** @type {((inputs?: Chart_TotalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chart_TotalInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.chart_total(inputs)
	return __en.chart_total(inputs)
});
/**

* @param {Chip_RemoveInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const chip_remove = /** @type {((inputs?: Chip_RemoveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Chip_RemoveInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.chip_remove(inputs)
	return __en.chip_remove(inputs)
});
/**

* @param {Coachmark_BackInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const coachmark_back = /** @type {((inputs?: Coachmark_BackInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Coachmark_BackInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.coachmark_back(inputs)
	return __en.coachmark_back(inputs)
});
/**

* @param {Coachmark_CloseInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const coachmark_close = /** @type {((inputs?: Coachmark_CloseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Coachmark_CloseInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.coachmark_close(inputs)
	return __en.coachmark_close(inputs)
});
/**

* @param {Coachmark_FinishInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const coachmark_finish = /** @type {((inputs?: Coachmark_FinishInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Coachmark_FinishInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.coachmark_finish(inputs)
	return __en.coachmark_finish(inputs)
});
/**

* @param {Coachmark_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const coachmark_label = /** @type {((inputs?: Coachmark_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Coachmark_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.coachmark_label(inputs)
	return __en.coachmark_label(inputs)
});
/**

* @param {Coachmark_NextInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const coachmark_next = /** @type {((inputs?: Coachmark_NextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Coachmark_NextInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.coachmark_next(inputs)
	return __en.coachmark_next(inputs)
});
/**

* @param {Coachmark_SkipInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const coachmark_skip = /** @type {((inputs?: Coachmark_SkipInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Coachmark_SkipInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.coachmark_skip(inputs)
	return __en.coachmark_skip(inputs)
});
/**

* @param {Coachmark_StepInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const coachmark_step = /** @type {((inputs: Coachmark_StepInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Coachmark_StepInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.coachmark_step(inputs)
	return __en.coachmark_step(inputs)
});
/**

* @param {Column_Picker_ColumnsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const column_picker_columns = /** @type {((inputs?: Column_Picker_ColumnsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Column_Picker_ColumnsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.column_picker_columns(inputs)
	return __en.column_picker_columns(inputs)
});
/**

* @param {Column_Picker_Density_CompactInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const column_picker_density_compact = /** @type {((inputs?: Column_Picker_Density_CompactInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Column_Picker_Density_CompactInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.column_picker_density_compact(inputs)
	return __en.column_picker_density_compact(inputs)
});
/**

* @param {Column_Picker_Density_DefaultInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const column_picker_density_default = /** @type {((inputs?: Column_Picker_Density_DefaultInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Column_Picker_Density_DefaultInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.column_picker_density_default(inputs)
	return __en.column_picker_density_default(inputs)
});
/**

* @param {Column_Picker_Density_DenseInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const column_picker_density_dense = /** @type {((inputs?: Column_Picker_Density_DenseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Column_Picker_Density_DenseInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.column_picker_density_dense(inputs)
	return __en.column_picker_density_dense(inputs)
});
/**

* @param {Column_Picker_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const column_picker_label = /** @type {((inputs: Column_Picker_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Column_Picker_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.column_picker_label(inputs)
	return __en.column_picker_label(inputs)
});
/**

* @param {Column_Picker_Move_EarlierInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const column_picker_move_earlier = /** @type {((inputs: Column_Picker_Move_EarlierInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Column_Picker_Move_EarlierInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.column_picker_move_earlier(inputs)
	return __en.column_picker_move_earlier(inputs)
});
/**

* @param {Column_Picker_Move_LaterInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const column_picker_move_later = /** @type {((inputs: Column_Picker_Move_LaterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Column_Picker_Move_LaterInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.column_picker_move_later(inputs)
	return __en.column_picker_move_later(inputs)
});
/**

* @param {Column_Picker_ResetInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const column_picker_reset = /** @type {((inputs?: Column_Picker_ResetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Column_Picker_ResetInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.column_picker_reset(inputs)
	return __en.column_picker_reset(inputs)
});
/**

* @param {Column_Picker_Row_HeightInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const column_picker_row_height = /** @type {((inputs?: Column_Picker_Row_HeightInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Column_Picker_Row_HeightInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.column_picker_row_height(inputs)
	return __en.column_picker_row_height(inputs)
});
/**

* @param {Combobox_AddInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const combobox_add = /** @type {((inputs: Combobox_AddInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Combobox_AddInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.combobox_add(inputs)
	return __en.combobox_add(inputs)
});
/**

* @param {Combobox_ChooseInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const combobox_choose = /** @type {((inputs?: Combobox_ChooseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Combobox_ChooseInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.combobox_choose(inputs)
	return __en.combobox_choose(inputs)
});
/**

* @param {Combobox_ClearInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const combobox_clear = /** @type {((inputs?: Combobox_ClearInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Combobox_ClearInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.combobox_clear(inputs)
	return __en.combobox_clear(inputs)
});
/**

* @param {Combobox_No_MatchesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const combobox_no_matches = /** @type {((inputs?: Combobox_No_MatchesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Combobox_No_MatchesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.combobox_no_matches(inputs)
	return __en.combobox_no_matches(inputs)
});
/**

* @param {Combobox_NothingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const combobox_nothing = /** @type {((inputs?: Combobox_NothingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Combobox_NothingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.combobox_nothing(inputs)
	return __en.combobox_nothing(inputs)
});
/**

* @param {Combobox_RemoveInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const combobox_remove = /** @type {((inputs: Combobox_RemoveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Combobox_RemoveInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.combobox_remove(inputs)
	return __en.combobox_remove(inputs)
});
/**

* @param {Combobox_Type_To_AddInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const combobox_type_to_add = /** @type {((inputs?: Combobox_Type_To_AddInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Combobox_Type_To_AddInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.combobox_type_to_add(inputs)
	return __en.combobox_type_to_add(inputs)
});
/**

* @param {Command_Account_DescriptionInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_account_description = /** @type {((inputs?: Command_Account_DescriptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Account_DescriptionInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_account_description(inputs)
	return __en.command_account_description(inputs)
});
/**

* @param {Command_Bookmark_AddInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_bookmark_add = /** @type {((inputs?: Command_Bookmark_AddInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Bookmark_AddInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_bookmark_add(inputs)
	return __en.command_bookmark_add(inputs)
});
/**

* @param {Command_Bookmark_DescriptionInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_bookmark_description = /** @type {((inputs?: Command_Bookmark_DescriptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Bookmark_DescriptionInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_bookmark_description(inputs)
	return __en.command_bookmark_description(inputs)
});
/**

* @param {Command_Bookmark_KeywordsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_bookmark_keywords = /** @type {((inputs?: Command_Bookmark_KeywordsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Bookmark_KeywordsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_bookmark_keywords(inputs)
	return __en.command_bookmark_keywords(inputs)
});
/**

* @param {Command_Bookmark_RemoveInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_bookmark_remove = /** @type {((inputs?: Command_Bookmark_RemoveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Bookmark_RemoveInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_bookmark_remove(inputs)
	return __en.command_bookmark_remove(inputs)
});
/**

* @param {Command_Collection_AllInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_collection_all = /** @type {((inputs: Command_Collection_AllInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Collection_AllInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_collection_all(inputs)
	return __en.command_collection_all(inputs)
});
/**

* @param {Command_Contrast_DescriptionInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_contrast_description = /** @type {((inputs?: Command_Contrast_DescriptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Contrast_DescriptionInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_contrast_description(inputs)
	return __en.command_contrast_description(inputs)
});
/**

* @param {Command_Contrast_KeywordsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_contrast_keywords = /** @type {((inputs?: Command_Contrast_KeywordsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Contrast_KeywordsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_contrast_keywords(inputs)
	return __en.command_contrast_keywords(inputs)
});
/**

* @param {Command_Contrast_TitleInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_contrast_title = /** @type {((inputs?: Command_Contrast_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Contrast_TitleInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_contrast_title(inputs)
	return __en.command_contrast_title(inputs)
});
/**

* @param {Command_Create_DescriptionInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_create_description = /** @type {((inputs: Command_Create_DescriptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Create_DescriptionInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_create_description(inputs)
	return __en.command_create_description(inputs)
});
/**

* @param {Command_Create_KeywordsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_create_keywords = /** @type {((inputs?: Command_Create_KeywordsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Create_KeywordsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_create_keywords(inputs)
	return __en.command_create_keywords(inputs)
});
/**

* @param {Command_Create_TitleInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_create_title = /** @type {((inputs: Command_Create_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Create_TitleInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_create_title(inputs)
	return __en.command_create_title(inputs)
});
/**

* @param {Command_Dashboard_DescriptionInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_dashboard_description = /** @type {((inputs?: Command_Dashboard_DescriptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Dashboard_DescriptionInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_dashboard_description(inputs)
	return __en.command_dashboard_description(inputs)
});
/**

* @param {Command_Dashboard_KeywordsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_dashboard_keywords = /** @type {((inputs?: Command_Dashboard_KeywordsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Dashboard_KeywordsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_dashboard_keywords(inputs)
	return __en.command_dashboard_keywords(inputs)
});
/**

* @param {Command_Group_AccessibilityInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_group_accessibility = /** @type {((inputs?: Command_Group_AccessibilityInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Group_AccessibilityInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_group_accessibility(inputs)
	return __en.command_group_accessibility(inputs)
});
/**

* @param {Command_Group_ConfigurationInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_group_configuration = /** @type {((inputs?: Command_Group_ConfigurationInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Group_ConfigurationInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_group_configuration(inputs)
	return __en.command_group_configuration(inputs)
});
/**

* @param {Command_Group_YouInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_group_you = /** @type {((inputs?: Command_Group_YouInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Group_YouInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_group_you(inputs)
	return __en.command_group_you(inputs)
});
/**

* @param {Command_Input_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_input_label = /** @type {((inputs?: Command_Input_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Input_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_input_label(inputs)
	return __en.command_input_label(inputs)
});
/**

* @param {Command_Launcher_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_launcher_label = /** @type {((inputs?: Command_Launcher_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Launcher_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_launcher_label(inputs)
	return __en.command_launcher_label(inputs)
});
/**

* @param {Command_Logout_KeywordsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_logout_keywords = /** @type {((inputs?: Command_Logout_KeywordsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Logout_KeywordsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_logout_keywords(inputs)
	return __en.command_logout_keywords(inputs)
});
/**

* @param {Command_NavigateInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_navigate = /** @type {((inputs?: Command_NavigateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_NavigateInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_navigate(inputs)
	return __en.command_navigate(inputs)
});
/**

* @param {Command_No_ResultsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_no_results = /** @type {((inputs: Command_No_ResultsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_No_ResultsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_no_results(inputs)
	return __en.command_no_results(inputs)
});
/**

* @param {Command_No_Results_HintInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_no_results_hint = /** @type {((inputs?: Command_No_Results_HintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_No_Results_HintInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_no_results_hint(inputs)
	return __en.command_no_results_hint(inputs)
});
/**

* @param {Command_OpenInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_open = /** @type {((inputs?: Command_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_OpenInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_open(inputs)
	return __en.command_open(inputs)
});
/**

* @param {Command_RelatedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_related = /** @type {((inputs?: Command_RelatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_RelatedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_related(inputs)
	return __en.command_related(inputs)
});
/**

* @param {Command_ResultsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_results = /** @type {((inputs: Command_ResultsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_ResultsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_results(inputs)
	return __en.command_results(inputs)
});
/**

* @param {Command_Section_ActionsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_section_actions = /** @type {((inputs?: Command_Section_ActionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Section_ActionsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_section_actions(inputs)
	return __en.command_section_actions(inputs)
});
/**

* @param {Command_Section_PagesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_section_pages = /** @type {((inputs?: Command_Section_PagesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Section_PagesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_section_pages(inputs)
	return __en.command_section_pages(inputs)
});
/**

* @param {Command_Section_RecordsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_section_records = /** @type {((inputs?: Command_Section_RecordsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Section_RecordsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_section_records(inputs)
	return __en.command_section_records(inputs)
});
/**

* @param {Command_Suggest_ActionsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_suggest_actions = /** @type {((inputs?: Command_Suggest_ActionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Suggest_ActionsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_suggest_actions(inputs)
	return __en.command_suggest_actions(inputs)
});
/**

* @param {Command_Suggest_PagesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_suggest_pages = /** @type {((inputs?: Command_Suggest_PagesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Suggest_PagesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_suggest_pages(inputs)
	return __en.command_suggest_pages(inputs)
});
/**

* @param {Command_This_PageInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_this_page = /** @type {((inputs?: Command_This_PageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_This_PageInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_this_page(inputs)
	return __en.command_this_page(inputs)
});
/**

* @param {Command_Type_To_SearchInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const command_type_to_search = /** @type {((inputs?: Command_Type_To_SearchInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Command_Type_To_SearchInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.command_type_to_search(inputs)
	return __en.command_type_to_search(inputs)
});
/**

* @param {Confirmation_AllowInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const confirmation_allow = /** @type {((inputs?: Confirmation_AllowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Confirmation_AllowInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.confirmation_allow(inputs)
	return __en.confirmation_allow(inputs)
});
/**

* @param {Confirmation_AllowedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const confirmation_allowed = /** @type {((inputs?: Confirmation_AllowedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Confirmation_AllowedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.confirmation_allowed(inputs)
	return __en.confirmation_allowed(inputs)
});
/**

* @param {Confirmation_DenyInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const confirmation_deny = /** @type {((inputs?: Confirmation_DenyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Confirmation_DenyInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.confirmation_deny(inputs)
	return __en.confirmation_deny(inputs)
});
/**

* @param {Confirmation_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const confirmation_label = /** @type {((inputs?: Confirmation_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Confirmation_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.confirmation_label(inputs)
	return __en.confirmation_label(inputs)
});
/**

* @param {Confirmation_Not_AllowedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const confirmation_not_allowed = /** @type {((inputs?: Confirmation_Not_AllowedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Confirmation_Not_AllowedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.confirmation_not_allowed(inputs)
	return __en.confirmation_not_allowed(inputs)
});
/**

* @param {Contrast_Audit_CloseInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const contrast_audit_close = /** @type {((inputs?: Contrast_Audit_CloseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Contrast_Audit_CloseInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.contrast_audit_close(inputs)
	return __en.contrast_audit_close(inputs)
});
/**

* @param {Contrast_Audit_FailsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const contrast_audit_fails = /** @type {((inputs: Contrast_Audit_FailsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Contrast_Audit_FailsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.contrast_audit_fails(inputs)
	return __en.contrast_audit_fails(inputs)
});
/**

* @param {Contrast_Audit_Fails_Over_ImageInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const contrast_audit_fails_over_image = /** @type {((inputs: Contrast_Audit_Fails_Over_ImageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Contrast_Audit_Fails_Over_ImageInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.contrast_audit_fails_over_image(inputs)
	return __en.contrast_audit_fails_over_image(inputs)
});
/**

* @param {Contrast_Audit_FilledInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const contrast_audit_filled = /** @type {((inputs?: Contrast_Audit_FilledInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Contrast_Audit_FilledInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.contrast_audit_filled(inputs)
	return __en.contrast_audit_filled(inputs)
});
/**

* @param {Contrast_Audit_Filled_HintInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const contrast_audit_filled_hint = /** @type {((inputs?: Contrast_Audit_Filled_HintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Contrast_Audit_Filled_HintInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.contrast_audit_filled_hint(inputs)
	return __en.contrast_audit_filled_hint(inputs)
});
/**

* @param {Contrast_Audit_Filled_On_DialogInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const contrast_audit_filled_on_dialog = /** @type {((inputs: Contrast_Audit_Filled_On_DialogInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Contrast_Audit_Filled_On_DialogInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.contrast_audit_filled_on_dialog(inputs)
	return __en.contrast_audit_filled_on_dialog(inputs)
});
/**

* @param {Contrast_Audit_Filled_On_PageInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const contrast_audit_filled_on_page = /** @type {((inputs: Contrast_Audit_Filled_On_PageInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Contrast_Audit_Filled_On_PageInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.contrast_audit_filled_on_page(inputs)
	return __en.contrast_audit_filled_on_page(inputs)
});
/**

* @param {Contrast_Audit_IssueInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const contrast_audit_issue = /** @type {((inputs: Contrast_Audit_IssueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Contrast_Audit_IssueInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.contrast_audit_issue(inputs)
	return __en.contrast_audit_issue(inputs)
});
/**

* @param {Contrast_Audit_Kind_CrampedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const contrast_audit_kind_cramped = /** @type {((inputs?: Contrast_Audit_Kind_CrampedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Contrast_Audit_Kind_CrampedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.contrast_audit_kind_cramped(inputs)
	return __en.contrast_audit_kind_cramped(inputs)
});
/**

* @param {Contrast_Audit_Kind_EscapesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const contrast_audit_kind_escapes = /** @type {((inputs?: Contrast_Audit_Kind_EscapesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Contrast_Audit_Kind_EscapesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.contrast_audit_kind_escapes(inputs)
	return __en.contrast_audit_kind_escapes(inputs)
});
/**

* @param {Contrast_Audit_Kind_Page_ScrollInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const contrast_audit_kind_page_scroll = /** @type {((inputs?: Contrast_Audit_Kind_Page_ScrollInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Contrast_Audit_Kind_Page_ScrollInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.contrast_audit_kind_page_scroll(inputs)
	return __en.contrast_audit_kind_page_scroll(inputs)
});
/**

* @param {Contrast_Audit_Kind_SqueezedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const contrast_audit_kind_squeezed = /** @type {((inputs?: Contrast_Audit_Kind_SqueezedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Contrast_Audit_Kind_SqueezedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.contrast_audit_kind_squeezed(inputs)
	return __en.contrast_audit_kind_squeezed(inputs)
});
/**

* @param {Contrast_Audit_LayoutInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const contrast_audit_layout = /** @type {((inputs: Contrast_Audit_LayoutInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Contrast_Audit_LayoutInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.contrast_audit_layout(inputs)
	return __en.contrast_audit_layout(inputs)
});
/**

* @param {Contrast_Audit_PassesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const contrast_audit_passes = /** @type {((inputs?: Contrast_Audit_PassesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Contrast_Audit_PassesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.contrast_audit_passes(inputs)
	return __en.contrast_audit_passes(inputs)
});
/**

* @param {Contrast_Audit_ProminenceInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const contrast_audit_prominence = /** @type {((inputs: Contrast_Audit_ProminenceInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Contrast_Audit_ProminenceInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.contrast_audit_prominence(inputs)
	return __en.contrast_audit_prominence(inputs)
});
/**

* @param {Contrast_Audit_RatioInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const contrast_audit_ratio = /** @type {((inputs: Contrast_Audit_RatioInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Contrast_Audit_RatioInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.contrast_audit_ratio(inputs)
	return __en.contrast_audit_ratio(inputs)
});
/**

* @param {Contrast_Audit_RerunInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const contrast_audit_rerun = /** @type {((inputs?: Contrast_Audit_RerunInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Contrast_Audit_RerunInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.contrast_audit_rerun(inputs)
	return __en.contrast_audit_rerun(inputs)
});
/**

* @param {Contrast_Audit_TitleInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const contrast_audit_title = /** @type {((inputs?: Contrast_Audit_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Contrast_Audit_TitleInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.contrast_audit_title(inputs)
	return __en.contrast_audit_title(inputs)
});
/**

* @param {Countdown_Due_NowInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const countdown_due_now = /** @type {((inputs?: Countdown_Due_NowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Countdown_Due_NowInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.countdown_due_now(inputs)
	return __en.countdown_due_now(inputs)
});
/**

* @param {Countdown_Just_OverdueInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const countdown_just_overdue = /** @type {((inputs?: Countdown_Just_OverdueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Countdown_Just_OverdueInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.countdown_just_overdue(inputs)
	return __en.countdown_just_overdue(inputs)
});
/**

* @param {Countdown_Left_DaysInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const countdown_left_days = /** @type {((inputs: Countdown_Left_DaysInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Countdown_Left_DaysInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.countdown_left_days(inputs)
	return __en.countdown_left_days(inputs)
});
/**

* @param {Countdown_Left_Days_HoursInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const countdown_left_days_hours = /** @type {((inputs: Countdown_Left_Days_HoursInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Countdown_Left_Days_HoursInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.countdown_left_days_hours(inputs)
	return __en.countdown_left_days_hours(inputs)
});
/**

* @param {Countdown_Left_HoursInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const countdown_left_hours = /** @type {((inputs: Countdown_Left_HoursInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Countdown_Left_HoursInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.countdown_left_hours(inputs)
	return __en.countdown_left_hours(inputs)
});
/**

* @param {Countdown_Left_Hours_MinutesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const countdown_left_hours_minutes = /** @type {((inputs: Countdown_Left_Hours_MinutesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Countdown_Left_Hours_MinutesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.countdown_left_hours_minutes(inputs)
	return __en.countdown_left_hours_minutes(inputs)
});
/**

* @param {Countdown_Left_MinutesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const countdown_left_minutes = /** @type {((inputs: Countdown_Left_MinutesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Countdown_Left_MinutesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.countdown_left_minutes(inputs)
	return __en.countdown_left_minutes(inputs)
});
/**

* @param {Countdown_OverdueInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const countdown_overdue = /** @type {((inputs: Countdown_OverdueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Countdown_OverdueInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.countdown_overdue(inputs)
	return __en.countdown_overdue(inputs)
});
/**

* @param {Countdown_Overdue_DaysInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const countdown_overdue_days = /** @type {((inputs: Countdown_Overdue_DaysInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Countdown_Overdue_DaysInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.countdown_overdue_days(inputs)
	return __en.countdown_overdue_days(inputs)
});
/**

* @param {Countdown_Overdue_HoursInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const countdown_overdue_hours = /** @type {((inputs: Countdown_Overdue_HoursInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Countdown_Overdue_HoursInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.countdown_overdue_hours(inputs)
	return __en.countdown_overdue_hours(inputs)
});
/**

* @param {Countdown_Overdue_MinutesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const countdown_overdue_minutes = /** @type {((inputs: Countdown_Overdue_MinutesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Countdown_Overdue_MinutesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.countdown_overdue_minutes(inputs)
	return __en.countdown_overdue_minutes(inputs)
});
/**

* @param {Countdown_Under_A_MinuteInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const countdown_under_a_minute = /** @type {((inputs?: Countdown_Under_A_MinuteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Countdown_Under_A_MinuteInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.countdown_under_a_minute(inputs)
	return __en.countdown_under_a_minute(inputs)
});
/**

* @param {Date_Input_ClearInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const date_input_clear = /** @type {((inputs?: Date_Input_ClearInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Date_Input_ClearInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.date_input_clear(inputs)
	return __en.date_input_clear(inputs)
});
/**

* @param {Date_Input_In_A_WeekInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const date_input_in_a_week = /** @type {((inputs?: Date_Input_In_A_WeekInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Date_Input_In_A_WeekInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.date_input_in_a_week(inputs)
	return __en.date_input_in_a_week(inputs)
});
/**

* @param {Date_Input_PicksInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const date_input_picks = /** @type {((inputs?: Date_Input_PicksInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Date_Input_PicksInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.date_input_picks(inputs)
	return __en.date_input_picks(inputs)
});
/**

* @param {Date_Input_Picks_ForInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const date_input_picks_for = /** @type {((inputs: Date_Input_Picks_ForInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Date_Input_Picks_ForInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.date_input_picks_for(inputs)
	return __en.date_input_picks_for(inputs)
});
/**

* @param {Date_Input_SaidInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const date_input_said = /** @type {((inputs: Date_Input_SaidInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Date_Input_SaidInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.date_input_said(inputs)
	return __en.date_input_said(inputs)
});
/**

* @param {Date_Input_Said_TimeInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const date_input_said_time = /** @type {((inputs: Date_Input_Said_TimeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Date_Input_Said_TimeInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.date_input_said_time(inputs)
	return __en.date_input_said_time(inputs)
});
/**

* @param {Date_Input_TodayInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const date_input_today = /** @type {((inputs?: Date_Input_TodayInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Date_Input_TodayInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.date_input_today(inputs)
	return __en.date_input_today(inputs)
});
/**

* @param {Date_Input_TomorrowInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const date_input_tomorrow = /** @type {((inputs?: Date_Input_TomorrowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Date_Input_TomorrowInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.date_input_tomorrow(inputs)
	return __en.date_input_tomorrow(inputs)
});
/**

* @param {Dial_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const dial_label = /** @type {((inputs?: Dial_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dial_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.dial_label(inputs)
	return __en.dial_label(inputs)
});
/**

* @param {Dial_RangeInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const dial_range = /** @type {((inputs: Dial_RangeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dial_RangeInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.dial_range(inputs)
	return __en.dial_range(inputs)
});
/**

* @param {Dial_ReadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const dial_reading = /** @type {((inputs: Dial_ReadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dial_ReadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.dial_reading(inputs)
	return __en.dial_reading(inputs)
});
/**

* @param {Dial_ZoneInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const dial_zone = /** @type {((inputs: Dial_ZoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dial_ZoneInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.dial_zone(inputs)
	return __en.dial_zone(inputs)
});
/**

* @param {Doc_Form_Add_BlockInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_add_block = /** @type {((inputs?: Doc_Form_Add_BlockInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_Add_BlockInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_add_block(inputs)
	return __en.doc_form_add_block(inputs)
});
/**

* @param {Doc_Form_Add_NamedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_add_named = /** @type {((inputs: Doc_Form_Add_NamedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_Add_NamedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_add_named(inputs)
	return __en.doc_form_add_named(inputs)
});
/**

* @param {Doc_Form_Block_NameInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_block_name = /** @type {((inputs?: Doc_Form_Block_NameInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_Block_NameInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_block_name(inputs)
	return __en.doc_form_block_name(inputs)
});
/**

* @param {Doc_Form_ChooseInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_choose = /** @type {((inputs?: Doc_Form_ChooseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_ChooseInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_choose(inputs)
	return __en.doc_form_choose(inputs)
});
/**

* @param {Doc_Form_Collapse_AllInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_collapse_all = /** @type {((inputs?: Doc_Form_Collapse_AllInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_Collapse_AllInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_collapse_all(inputs)
	return __en.doc_form_collapse_all(inputs)
});
/**

* @param {Doc_Form_Collapse_RowInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_collapse_row = /** @type {((inputs: Doc_Form_Collapse_RowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_Collapse_RowInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_collapse_row(inputs)
	return __en.doc_form_collapse_row(inputs)
});
/**

* @param {Doc_Form_Create_NewInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_create_new = /** @type {((inputs?: Doc_Form_Create_NewInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_Create_NewInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_create_new(inputs)
	return __en.doc_form_create_new(inputs)
});
/**

* @param {Doc_Form_DetailsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_details = /** @type {((inputs?: Doc_Form_DetailsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_DetailsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_details(inputs)
	return __en.doc_form_details(inputs)
});
/**

* @param {Doc_Form_DuplicateInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_duplicate = /** @type {((inputs?: Doc_Form_DuplicateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_DuplicateInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_duplicate(inputs)
	return __en.doc_form_duplicate(inputs)
});
/**

* @param {Doc_Form_ErrorsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_errors = /** @type {((inputs: Doc_Form_ErrorsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_ErrorsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_errors(inputs)
	return __en.doc_form_errors(inputs)
});
/**

* @param {Doc_Form_Expand_AllInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_expand_all = /** @type {((inputs?: Doc_Form_Expand_AllInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_Expand_AllInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_expand_all(inputs)
	return __en.doc_form_expand_all(inputs)
});
/**

* @param {Doc_Form_Expand_RowInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_expand_row = /** @type {((inputs: Doc_Form_Expand_RowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_Expand_RowInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_expand_row(inputs)
	return __en.doc_form_expand_row(inputs)
});
/**

* @param {Doc_Form_Join_ShowingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_join_showing = /** @type {((inputs: Doc_Form_Join_ShowingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_Join_ShowingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_join_showing(inputs)
	return __en.doc_form_join_showing(inputs)
});
/**

* @param {Doc_Form_Json_InvalidInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_json_invalid = /** @type {((inputs?: Doc_Form_Json_InvalidInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_Json_InvalidInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_json_invalid(inputs)
	return __en.doc_form_json_invalid(inputs)
});
/**

* @param {Doc_Form_LatitudeInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_latitude = /** @type {((inputs?: Doc_Form_LatitudeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_LatitudeInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_latitude(inputs)
	return __en.doc_form_latitude(inputs)
});
/**

* @param {Doc_Form_LongitudeInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_longitude = /** @type {((inputs?: Doc_Form_LongitudeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_LongitudeInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_longitude(inputs)
	return __en.doc_form_longitude(inputs)
});
/**

* @param {Doc_Form_Move_DownInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_move_down = /** @type {((inputs?: Doc_Form_Move_DownInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_Move_DownInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_move_down(inputs)
	return __en.doc_form_move_down(inputs)
});
/**

* @param {Doc_Form_Move_UpInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_move_up = /** @type {((inputs?: Doc_Form_Move_UpInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_Move_UpInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_move_up(inputs)
	return __en.doc_form_move_up(inputs)
});
/**

* @param {Doc_Form_NewInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_new = /** @type {((inputs?: Doc_Form_NewInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_NewInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_new(inputs)
	return __en.doc_form_new(inputs)
});
/**

* @param {Doc_Form_NoInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_no = /** @type {((inputs?: Doc_Form_NoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_NoInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_no(inputs)
	return __en.doc_form_no(inputs)
});
/**

* @param {Doc_Form_None_YetInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_none_yet = /** @type {((inputs?: Doc_Form_None_YetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_None_YetInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_none_yet(inputs)
	return __en.doc_form_none_yet(inputs)
});
/**

* @param {Doc_Form_OpenInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_open = /** @type {((inputs?: Doc_Form_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_OpenInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_open(inputs)
	return __en.doc_form_open(inputs)
});
/**

* @param {Doc_Form_OptionalInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_optional = /** @type {((inputs?: Doc_Form_OptionalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_OptionalInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_optional(inputs)
	return __en.doc_form_optional(inputs)
});
/**

* @param {Doc_Form_RemoveInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_remove = /** @type {((inputs?: Doc_Form_RemoveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_RemoveInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_remove(inputs)
	return __en.doc_form_remove(inputs)
});
/**

* @param {Doc_Form_RowInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_row = /** @type {((inputs?: Doc_Form_RowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_RowInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_row(inputs)
	return __en.doc_form_row(inputs)
});
/**

* @param {Doc_Form_Row_ActionsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_row_actions = /** @type {((inputs: Doc_Form_Row_ActionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_Row_ActionsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_row_actions(inputs)
	return __en.doc_form_row_actions(inputs)
});
/**

* @param {Doc_Form_Row_TitleInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_row_title = /** @type {((inputs: Doc_Form_Row_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_Row_TitleInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_row_title(inputs)
	return __en.doc_form_row_title(inputs)
});
/**

* @param {Doc_Form_Rows_At_LeastInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_rows_at_least = /** @type {((inputs: Doc_Form_Rows_At_LeastInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_Rows_At_LeastInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_rows_at_least(inputs)
	return __en.doc_form_rows_at_least(inputs)
});
/**

* @param {Doc_Form_Rows_EmptyInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_rows_empty = /** @type {((inputs: Doc_Form_Rows_EmptyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_Rows_EmptyInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_rows_empty(inputs)
	return __en.doc_form_rows_empty(inputs)
});
/**

* @param {Doc_Form_Rows_MaxInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_rows_max = /** @type {((inputs: Doc_Form_Rows_MaxInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_Rows_MaxInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_rows_max(inputs)
	return __en.doc_form_rows_max(inputs)
});
/**

* @param {Doc_Form_Rows_Up_ToInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_rows_up_to = /** @type {((inputs: Doc_Form_Rows_Up_ToInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_Rows_Up_ToInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_rows_up_to(inputs)
	return __en.doc_form_rows_up_to(inputs)
});
/**

* @param {Doc_Form_Suggest_FailedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_suggest_failed = /** @type {((inputs?: Doc_Form_Suggest_FailedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_Suggest_FailedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_suggest_failed(inputs)
	return __en.doc_form_suggest_failed(inputs)
});
/**

* @param {Doc_Form_Suggest_NothingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_suggest_nothing = /** @type {((inputs?: Doc_Form_Suggest_NothingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_Suggest_NothingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_suggest_nothing(inputs)
	return __en.doc_form_suggest_nothing(inputs)
});
/**

* @param {Doc_Form_Tab_ErrorsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_tab_errors = /** @type {((inputs: Doc_Form_Tab_ErrorsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_Tab_ErrorsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_tab_errors(inputs)
	return __en.doc_form_tab_errors(inputs)
});
/**

* @param {Doc_Form_Type_EnterInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_type_enter = /** @type {((inputs?: Doc_Form_Type_EnterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_Type_EnterInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_type_enter(inputs)
	return __en.doc_form_type_enter(inputs)
});
/**

* @param {Doc_Form_Type_Number_EnterInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_type_number_enter = /** @type {((inputs?: Doc_Form_Type_Number_EnterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_Type_Number_EnterInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_type_number_enter(inputs)
	return __en.doc_form_type_number_enter(inputs)
});
/**

* @param {Doc_Form_Unit_DaysInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_unit_days = /** @type {((inputs?: Doc_Form_Unit_DaysInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_Unit_DaysInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_unit_days(inputs)
	return __en.doc_form_unit_days(inputs)
});
/**

* @param {Doc_Form_UnsupportedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_unsupported = /** @type {((inputs: Doc_Form_UnsupportedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_UnsupportedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_unsupported(inputs)
	return __en.doc_form_unsupported(inputs)
});
/**

* @param {Doc_Form_YesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const doc_form_yes = /** @type {((inputs?: Doc_Form_YesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Doc_Form_YesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.doc_form_yes(inputs)
	return __en.doc_form_yes(inputs)
});
/**

* @param {Dropdown_More_InfoInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const dropdown_more_info = /** @type {((inputs?: Dropdown_More_InfoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Dropdown_More_InfoInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.dropdown_more_info(inputs)
	return __en.dropdown_more_info(inputs)
});
/**

* @param {Edit_View_AccountInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_account = /** @type {((inputs?: Edit_View_AccountInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_AccountInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_account(inputs)
	return __en.edit_view_account(inputs)
});
/**

* @param {Edit_View_Cannot_UndoInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_cannot_undo = /** @type {((inputs?: Edit_View_Cannot_UndoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_Cannot_UndoInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_cannot_undo(inputs)
	return __en.edit_view_cannot_undo(inputs)
});
/**

* @param {Edit_View_CreateInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_create = /** @type {((inputs?: Edit_View_CreateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_CreateInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_create(inputs)
	return __en.edit_view_create(inputs)
});
/**

* @param {Edit_View_Create_TitleInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_create_title = /** @type {((inputs: Edit_View_Create_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_Create_TitleInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_create_title(inputs)
	return __en.edit_view_create_title(inputs)
});
/**

* @param {Edit_View_CreatedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_created = /** @type {((inputs: Edit_View_CreatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_CreatedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_created(inputs)
	return __en.edit_view_created(inputs)
});
/**

* @param {Edit_View_DashboardInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_dashboard = /** @type {((inputs?: Edit_View_DashboardInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_DashboardInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_dashboard(inputs)
	return __en.edit_view_dashboard(inputs)
});
/**

* @param {Edit_View_DeleteInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_delete = /** @type {((inputs?: Edit_View_DeleteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_DeleteInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_delete(inputs)
	return __en.edit_view_delete(inputs)
});
/**

* @param {Edit_View_Delete_ConfirmInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_delete_confirm = /** @type {((inputs: Edit_View_Delete_ConfirmInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_Delete_ConfirmInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_delete_confirm(inputs)
	return __en.edit_view_delete_confirm(inputs)
});
/**

* @param {Edit_View_DetailsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_details = /** @type {((inputs?: Edit_View_DetailsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_DetailsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_details(inputs)
	return __en.edit_view_details(inputs)
});
/**

* @param {Edit_View_File_RequiredInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_file_required = /** @type {((inputs?: Edit_View_File_RequiredInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_File_RequiredInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_file_required(inputs)
	return __en.edit_view_file_required(inputs)
});
/**

* @param {Edit_View_IdInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_id = /** @type {((inputs?: Edit_View_IdInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_IdInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_id(inputs)
	return __en.edit_view_id(inputs)
});
/**

* @param {Edit_View_LinkInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_link = /** @type {((inputs: Edit_View_LinkInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_LinkInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_link(inputs)
	return __en.edit_view_link(inputs)
});
/**

* @param {Edit_View_New_PasswordInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_new_password = /** @type {((inputs?: Edit_View_New_PasswordInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_New_PasswordInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_new_password(inputs)
	return __en.edit_view_new_password(inputs)
});
/**

* @param {Edit_View_New_TitleInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_new_title = /** @type {((inputs: Edit_View_New_TitleInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_New_TitleInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_new_title(inputs)
	return __en.edit_view_new_title(inputs)
});
/**

* @param {Edit_View_Not_FoundInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_not_found = /** @type {((inputs?: Edit_View_Not_FoundInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_Not_FoundInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_not_found(inputs)
	return __en.edit_view_not_found(inputs)
});
/**

* @param {Edit_View_Not_Found_BodyInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_not_found_body = /** @type {((inputs?: Edit_View_Not_Found_BodyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_Not_Found_BodyInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_not_found_body(inputs)
	return __en.edit_view_not_found_body(inputs)
});
/**

* @param {Edit_View_Password_HintInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_password_hint = /** @type {((inputs?: Edit_View_Password_HintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_Password_HintInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_password_hint(inputs)
	return __en.edit_view_password_hint(inputs)
});
/**

* @param {Edit_View_Password_RequiredInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_password_required = /** @type {((inputs?: Edit_View_Password_RequiredInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_Password_RequiredInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_password_required(inputs)
	return __en.edit_view_password_required(inputs)
});
/**

* @param {Edit_View_ProblemInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_problem = /** @type {((inputs: Edit_View_ProblemInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_ProblemInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_problem(inputs)
	return __en.edit_view_problem(inputs)
});
/**

* @param {Edit_View_ProblemsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_problems = /** @type {((inputs: Edit_View_ProblemsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_ProblemsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_problems(inputs)
	return __en.edit_view_problems(inputs)
});
/**

* @param {Edit_View_Read_OnlyInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_read_only = /** @type {((inputs?: Edit_View_Read_OnlyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_Read_OnlyInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_read_only(inputs)
	return __en.edit_view_read_only(inputs)
});
/**

* @param {Edit_View_Replace_FileInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_replace_file = /** @type {((inputs?: Edit_View_Replace_FileInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_Replace_FileInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_replace_file(inputs)
	return __en.edit_view_replace_file(inputs)
});
/**

* @param {Edit_View_SaveInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_save = /** @type {((inputs?: Edit_View_SaveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_SaveInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_save(inputs)
	return __en.edit_view_save(inputs)
});
/**

* @param {Edit_View_Save_ShortcutInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_save_shortcut = /** @type {((inputs?: Edit_View_Save_ShortcutInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_Save_ShortcutInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_save_shortcut(inputs)
	return __en.edit_view_save_shortcut(inputs)
});
/**

* @param {Edit_View_SavedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_saved = /** @type {((inputs?: Edit_View_SavedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_SavedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_saved(inputs)
	return __en.edit_view_saved(inputs)
});
/**

* @param {Edit_View_SavingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_saving = /** @type {((inputs?: Edit_View_SavingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_SavingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_saving(inputs)
	return __en.edit_view_saving(inputs)
});
/**

* @param {Edit_View_Screen_LoadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_screen_loading = /** @type {((inputs?: Edit_View_Screen_LoadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_Screen_LoadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_screen_loading(inputs)
	return __en.edit_view_screen_loading(inputs)
});
/**

* @param {Edit_View_SectionsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_sections = /** @type {((inputs: Edit_View_SectionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_SectionsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_sections(inputs)
	return __en.edit_view_sections(inputs)
});
/**

* @param {Edit_View_SettingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_setting = /** @type {((inputs?: Edit_View_SettingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_SettingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_setting(inputs)
	return __en.edit_view_setting(inputs)
});
/**

* @param {Edit_View_UnsavedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_unsaved = /** @type {((inputs?: Edit_View_UnsavedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_UnsavedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_unsaved(inputs)
	return __en.edit_view_unsaved(inputs)
});
/**

* @param {Edit_View_UpdatedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const edit_view_updated = /** @type {((inputs: Edit_View_UpdatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Edit_View_UpdatedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.edit_view_updated(inputs)
	return __en.edit_view_updated(inputs)
});
/**

* @param {Empty_State_LoadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const empty_state_loading = /** @type {((inputs?: Empty_State_LoadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Empty_State_LoadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.empty_state_loading(inputs)
	return __en.empty_state_loading(inputs)
});
/**

* @param {Fab_CloseInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const fab_close = /** @type {((inputs?: Fab_CloseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Fab_CloseInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.fab_close(inputs)
	return __en.fab_close(inputs)
});
/**

* @param {Field_AboutInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const field_about = /** @type {((inputs: Field_AboutInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Field_AboutInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.field_about(inputs)
	return __en.field_about(inputs)
});
/**

* @param {Field_About_ThisInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const field_about_this = /** @type {((inputs?: Field_About_ThisInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Field_About_ThisInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.field_about_this(inputs)
	return __en.field_about_this(inputs)
});
/**

* @param {Field_Count_OfInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const field_count_of = /** @type {((inputs: Field_Count_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Field_Count_OfInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.field_count_of(inputs)
	return __en.field_count_of(inputs)
});
/**

* @param {Field_Error_At_Least_OneInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const field_error_at_least_one = /** @type {((inputs?: Field_Error_At_Least_OneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Field_Error_At_Least_OneInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.field_error_at_least_one(inputs)
	return __en.field_error_at_least_one(inputs)
});
/**

* @param {Field_Error_CheckInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const field_error_check = /** @type {((inputs?: Field_Error_CheckInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Field_Error_CheckInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.field_error_check(inputs)
	return __en.field_error_check(inputs)
});
/**

* @param {Field_Error_DateInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const field_error_date = /** @type {((inputs?: Field_Error_DateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Field_Error_DateInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.field_error_date(inputs)
	return __en.field_error_date(inputs)
});
/**

* @param {Field_Error_EmailInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const field_error_email = /** @type {((inputs?: Field_Error_EmailInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Field_Error_EmailInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.field_error_email(inputs)
	return __en.field_error_email(inputs)
});
/**

* @param {Field_Error_MaxInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const field_error_max = /** @type {((inputs: Field_Error_MaxInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Field_Error_MaxInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.field_error_max(inputs)
	return __en.field_error_max(inputs)
});
/**

* @param {Field_Error_Max_LengthInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const field_error_max_length = /** @type {((inputs: Field_Error_Max_LengthInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Field_Error_Max_LengthInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.field_error_max_length(inputs)
	return __en.field_error_max_length(inputs)
});
/**

* @param {Field_Error_Max_RowsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const field_error_max_rows = /** @type {((inputs: Field_Error_Max_RowsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Field_Error_Max_RowsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.field_error_max_rows(inputs)
	return __en.field_error_max_rows(inputs)
});
/**

* @param {Field_Error_MinInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const field_error_min = /** @type {((inputs: Field_Error_MinInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Field_Error_MinInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.field_error_min(inputs)
	return __en.field_error_min(inputs)
});
/**

* @param {Field_Error_Min_LengthInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const field_error_min_length = /** @type {((inputs: Field_Error_Min_LengthInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Field_Error_Min_LengthInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.field_error_min_length(inputs)
	return __en.field_error_min_length(inputs)
});
/**

* @param {Field_Error_Min_RowsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const field_error_min_rows = /** @type {((inputs: Field_Error_Min_RowsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Field_Error_Min_RowsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.field_error_min_rows(inputs)
	return __en.field_error_min_rows(inputs)
});
/**

* @param {Field_Error_NumberInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const field_error_number = /** @type {((inputs?: Field_Error_NumberInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Field_Error_NumberInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.field_error_number(inputs)
	return __en.field_error_number(inputs)
});
/**

* @param {Field_Error_OptionInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const field_error_option = /** @type {((inputs?: Field_Error_OptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Field_Error_OptionInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.field_error_option(inputs)
	return __en.field_error_option(inputs)
});
/**

* @param {Field_Error_RequiredInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const field_error_required = /** @type {((inputs?: Field_Error_RequiredInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Field_Error_RequiredInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.field_error_required(inputs)
	return __en.field_error_required(inputs)
});
/**

* @param {Field_Error_TextInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const field_error_text = /** @type {((inputs?: Field_Error_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Field_Error_TextInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.field_error_text(inputs)
	return __en.field_error_text(inputs)
});
/**

* @param {Field_Required_PillInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const field_required_pill = /** @type {((inputs?: Field_Required_PillInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Field_Required_PillInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.field_required_pill(inputs)
	return __en.field_required_pill(inputs)
});
/**

* @param {Field_SuggestInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const field_suggest = /** @type {((inputs: Field_SuggestInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Field_SuggestInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.field_suggest(inputs)
	return __en.field_suggest(inputs)
});
/**

* @param {Field_Suggest_AnswerInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const field_suggest_answer = /** @type {((inputs?: Field_Suggest_AnswerInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Field_Suggest_AnswerInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.field_suggest_answer(inputs)
	return __en.field_suggest_answer(inputs)
});
/**

* @param {Field_Suggestion_DismissInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const field_suggestion_dismiss = /** @type {((inputs?: Field_Suggestion_DismissInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Field_Suggestion_DismissInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.field_suggestion_dismiss(inputs)
	return __en.field_suggestion_dismiss(inputs)
});
/**

* @param {Field_Suggestion_UseInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const field_suggestion_use = /** @type {((inputs?: Field_Suggestion_UseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Field_Suggestion_UseInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.field_suggestion_use(inputs)
	return __en.field_suggestion_use(inputs)
});
/**

* @param {Field_Suggestion_Use_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const field_suggestion_use_label = /** @type {((inputs: Field_Suggestion_Use_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Field_Suggestion_Use_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.field_suggestion_use_label(inputs)
	return __en.field_suggestion_use_label(inputs)
});
/**

* @param {Filter_Builder_Add_FilterInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_add_filter = /** @type {((inputs?: Filter_Builder_Add_FilterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_Add_FilterInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_add_filter(inputs)
	return __en.filter_builder_add_filter(inputs)
});
/**

* @param {Filter_Builder_ClearInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_clear = /** @type {((inputs?: Filter_Builder_ClearInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_ClearInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_clear(inputs)
	return __en.filter_builder_clear(inputs)
});
/**

* @param {Filter_Builder_FieldInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_field = /** @type {((inputs?: Filter_Builder_FieldInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_FieldInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_field(inputs)
	return __en.filter_builder_field(inputs)
});
/**

* @param {Filter_Builder_FilterInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_filter = /** @type {((inputs?: Filter_Builder_FilterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_FilterInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_filter(inputs)
	return __en.filter_builder_filter(inputs)
});
/**

* @param {Filter_Builder_IsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_is = /** @type {((inputs?: Filter_Builder_IsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_IsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_is(inputs)
	return __en.filter_builder_is(inputs)
});
/**

* @param {Filter_Builder_MatchInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_match = /** @type {((inputs?: Filter_Builder_MatchInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_MatchInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_match(inputs)
	return __en.filter_builder_match(inputs)
});
/**

* @param {Filter_Builder_Match_AllInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_match_all = /** @type {((inputs?: Filter_Builder_Match_AllInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_Match_AllInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_match_all(inputs)
	return __en.filter_builder_match_all(inputs)
});
/**

* @param {Filter_Builder_Match_AnyInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_match_any = /** @type {((inputs?: Filter_Builder_Match_AnyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_Match_AnyInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_match_any(inputs)
	return __en.filter_builder_match_any(inputs)
});
/**

* @param {Filter_Builder_Op_AfterInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_op_after = /** @type {((inputs?: Filter_Builder_Op_AfterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_Op_AfterInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_op_after(inputs)
	return __en.filter_builder_op_after(inputs)
});
/**

* @param {Filter_Builder_Op_Any_OfInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_op_any_of = /** @type {((inputs?: Filter_Builder_Op_Any_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_Op_Any_OfInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_op_any_of(inputs)
	return __en.filter_builder_op_any_of(inputs)
});
/**

* @param {Filter_Builder_Op_BeforeInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_op_before = /** @type {((inputs?: Filter_Builder_Op_BeforeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_Op_BeforeInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_op_before(inputs)
	return __en.filter_builder_op_before(inputs)
});
/**

* @param {Filter_Builder_Op_ContainsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_op_contains = /** @type {((inputs?: Filter_Builder_Op_ContainsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_Op_ContainsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_op_contains(inputs)
	return __en.filter_builder_op_contains(inputs)
});
/**

* @param {Filter_Builder_Op_IsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_op_is = /** @type {((inputs?: Filter_Builder_Op_IsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_Op_IsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_op_is(inputs)
	return __en.filter_builder_op_is(inputs)
});
/**

* @param {Filter_Builder_Op_Is_EmptyInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_op_is_empty = /** @type {((inputs?: Filter_Builder_Op_Is_EmptyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_Op_Is_EmptyInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_op_is_empty(inputs)
	return __en.filter_builder_op_is_empty(inputs)
});
/**

* @param {Filter_Builder_Op_Is_NotInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_op_is_not = /** @type {((inputs?: Filter_Builder_Op_Is_NotInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_Op_Is_NotInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_op_is_not(inputs)
	return __en.filter_builder_op_is_not(inputs)
});
/**

* @param {Filter_Builder_Op_Is_SetInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_op_is_set = /** @type {((inputs?: Filter_Builder_Op_Is_SetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_Op_Is_SetInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_op_is_set(inputs)
	return __en.filter_builder_op_is_set(inputs)
});
/**

* @param {Filter_Builder_Op_NoInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_op_no = /** @type {((inputs?: Filter_Builder_Op_NoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_Op_NoInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_op_no(inputs)
	return __en.filter_builder_op_no(inputs)
});
/**

* @param {Filter_Builder_Op_None_OfInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_op_none_of = /** @type {((inputs?: Filter_Builder_Op_None_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_Op_None_OfInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_op_none_of(inputs)
	return __en.filter_builder_op_none_of(inputs)
});
/**

* @param {Filter_Builder_Op_Not_ContainsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_op_not_contains = /** @type {((inputs?: Filter_Builder_Op_Not_ContainsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_Op_Not_ContainsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_op_not_contains(inputs)
	return __en.filter_builder_op_not_contains(inputs)
});
/**

* @param {Filter_Builder_Op_YesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_op_yes = /** @type {((inputs?: Filter_Builder_Op_YesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_Op_YesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_op_yes(inputs)
	return __en.filter_builder_op_yes(inputs)
});
/**

* @param {Filter_Builder_RemoveInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_remove = /** @type {((inputs?: Filter_Builder_RemoveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_RemoveInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_remove(inputs)
	return __en.filter_builder_remove(inputs)
});
/**

* @param {Filter_Builder_Remove_FilterInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_remove_filter = /** @type {((inputs: Filter_Builder_Remove_FilterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_Remove_FilterInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_remove_filter(inputs)
	return __en.filter_builder_remove_filter(inputs)
});
/**

* @param {Filter_Builder_Search_OptionsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_search_options = /** @type {((inputs: Filter_Builder_Search_OptionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_Search_OptionsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_search_options(inputs)
	return __en.filter_builder_search_options(inputs)
});
/**

* @param {Filter_Builder_UpdateInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_update = /** @type {((inputs?: Filter_Builder_UpdateInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_UpdateInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_update(inputs)
	return __en.filter_builder_update(inputs)
});
/**

* @param {Filter_Builder_ValueInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_value = /** @type {((inputs?: Filter_Builder_ValueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_ValueInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_value(inputs)
	return __en.filter_builder_value(inputs)
});
/**

* @param {Filter_Builder_Values_MoreInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const filter_builder_values_more = /** @type {((inputs: Filter_Builder_Values_MoreInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Filter_Builder_Values_MoreInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.filter_builder_values_more(inputs)
	return __en.filter_builder_values_more(inputs)
});
/**

* @param {Frame_CollapseInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const frame_collapse = /** @type {((inputs: Frame_CollapseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Frame_CollapseInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.frame_collapse(inputs)
	return __en.frame_collapse(inputs)
});
/**

* @param {Frame_Drag_To_CloseInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const frame_drag_to_close = /** @type {((inputs: Frame_Drag_To_CloseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Frame_Drag_To_CloseInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.frame_drag_to_close(inputs)
	return __en.frame_drag_to_close(inputs)
});
/**

* @param {Frame_Drag_To_OpenInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const frame_drag_to_open = /** @type {((inputs: Frame_Drag_To_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Frame_Drag_To_OpenInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.frame_drag_to_open(inputs)
	return __en.frame_drag_to_open(inputs)
});
/**

* @param {Frame_ExpandInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const frame_expand = /** @type {((inputs: Frame_ExpandInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Frame_ExpandInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.frame_expand(inputs)
	return __en.frame_expand(inputs)
});
/**

* @param {Frame_PanesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const frame_panes = /** @type {((inputs?: Frame_PanesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Frame_PanesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.frame_panes(inputs)
	return __en.frame_panes(inputs)
});
/**

* @param {Frame_ResizeInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const frame_resize = /** @type {((inputs?: Frame_ResizeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Frame_ResizeInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.frame_resize(inputs)
	return __en.frame_resize(inputs)
});
/**

* @param {Frame_Resize_To_CloseInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const frame_resize_to_close = /** @type {((inputs: Frame_Resize_To_CloseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Frame_Resize_To_CloseInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.frame_resize_to_close(inputs)
	return __en.frame_resize_to_close(inputs)
});
/**

* @param {Frame_Resize_To_OpenInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const frame_resize_to_open = /** @type {((inputs: Frame_Resize_To_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Frame_Resize_To_OpenInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.frame_resize_to_open(inputs)
	return __en.frame_resize_to_open(inputs)
});
/**

* @param {Frame_Show_IconsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const frame_show_icons = /** @type {((inputs: Frame_Show_IconsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Frame_Show_IconsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.frame_show_icons(inputs)
	return __en.frame_show_icons(inputs)
});
/**

* @param {Funnel_CaptionInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const funnel_caption = /** @type {((inputs: Funnel_CaptionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Funnel_CaptionInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.funnel_caption(inputs)
	return __en.funnel_caption(inputs)
});
/**

* @param {Funnel_StepInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const funnel_step = /** @type {((inputs: Funnel_StepInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Funnel_StepInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.funnel_step(inputs)
	return __en.funnel_step(inputs)
});
/**

* @param {Funnel_Step_Went_OnInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const funnel_step_went_on = /** @type {((inputs?: Funnel_Step_Went_OnInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Funnel_Step_Went_OnInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.funnel_step_went_on(inputs)
	return __en.funnel_step_went_on(inputs)
});
/**

* @param {Gauge_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const gauge_label = /** @type {((inputs?: Gauge_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Gauge_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.gauge_label(inputs)
	return __en.gauge_label(inputs)
});
/**

* @param {Gauge_Value_OfInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const gauge_value_of = /** @type {((inputs: Gauge_Value_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Gauge_Value_OfInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.gauge_value_of(inputs)
	return __en.gauge_value_of(inputs)
});
/**

* @param {Heatmap_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const heatmap_label = /** @type {((inputs?: Heatmap_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Heatmap_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.heatmap_label(inputs)
	return __en.heatmap_label(inputs)
});
/**

* @param {Heatmap_LessInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const heatmap_less = /** @type {((inputs?: Heatmap_LessInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Heatmap_LessInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.heatmap_less(inputs)
	return __en.heatmap_less(inputs)
});
/**

* @param {Heatmap_MoreInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const heatmap_more = /** @type {((inputs?: Heatmap_MoreInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Heatmap_MoreInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.heatmap_more(inputs)
	return __en.heatmap_more(inputs)
});
/**

* @param {Kanban_ColumnInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const kanban_column = /** @type {((inputs: Kanban_ColumnInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kanban_ColumnInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.kanban_column(inputs)
	return __en.kanban_column(inputs)
});
/**

* @param {Kanban_DraggingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const kanban_dragging = /** @type {((inputs: Kanban_DraggingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kanban_DraggingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.kanban_dragging(inputs)
	return __en.kanban_dragging(inputs)
});
/**

* @param {Kanban_MovedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const kanban_moved = /** @type {((inputs: Kanban_MovedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kanban_MovedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.kanban_moved(inputs)
	return __en.kanban_moved(inputs)
});
/**

* @param {Kanban_Not_MovedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const kanban_not_moved = /** @type {((inputs?: Kanban_Not_MovedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Kanban_Not_MovedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.kanban_not_moved(inputs)
	return __en.kanban_not_moved(inputs)
});
/**

* @param {Layout_CrampedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const layout_cramped = /** @type {((inputs: Layout_CrampedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layout_CrampedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.layout_cramped(inputs)
	return __en.layout_cramped(inputs)
});
/**

* @param {Layout_EscapesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const layout_escapes = /** @type {((inputs: Layout_EscapesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layout_EscapesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.layout_escapes(inputs)
	return __en.layout_escapes(inputs)
});
/**

* @param {Layout_Page_ScrollInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const layout_page_scroll = /** @type {((inputs: Layout_Page_ScrollInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layout_Page_ScrollInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.layout_page_scroll(inputs)
	return __en.layout_page_scroll(inputs)
});
/**

* @param {Layout_SqueezedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const layout_squeezed = /** @type {((inputs: Layout_SqueezedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layout_SqueezedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.layout_squeezed(inputs)
	return __en.layout_squeezed(inputs)
});
/**

* @param {List_View_ByInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_by = /** @type {((inputs: List_View_ByInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_ByInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_by(inputs)
	return __en.list_view_by(inputs)
});
/**

* @param {List_View_Calendar_CountInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_calendar_count = /** @type {((inputs: List_View_Calendar_CountInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Calendar_CountInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_calendar_count(inputs)
	return __en.list_view_calendar_count(inputs)
});
/**

* @param {List_View_Calendar_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_calendar_label = /** @type {((inputs: List_View_Calendar_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Calendar_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_calendar_label(inputs)
	return __en.list_view_calendar_label(inputs)
});
/**

* @param {List_View_Cannot_UndoInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_cannot_undo = /** @type {((inputs?: List_View_Cannot_UndoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Cannot_UndoInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_cannot_undo(inputs)
	return __en.list_view_cannot_undo(inputs)
});
/**

* @param {List_View_Chart_BucketInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_chart_bucket = /** @type {((inputs: List_View_Chart_BucketInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Chart_BucketInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_chart_bucket(inputs)
	return __en.list_view_chart_bucket(inputs)
});
/**

* @param {List_View_Clear_FiltersInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_clear_filters = /** @type {((inputs?: List_View_Clear_FiltersInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Clear_FiltersInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_clear_filters(inputs)
	return __en.list_view_clear_filters(inputs)
});
/**

* @param {List_View_Clear_SelectionInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_clear_selection = /** @type {((inputs?: List_View_Clear_SelectionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Clear_SelectionInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_clear_selection(inputs)
	return __en.list_view_clear_selection(inputs)
});
/**

* @param {List_View_Count_OfInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_count_of = /** @type {((inputs: List_View_Count_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Count_OfInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_count_of(inputs)
	return __en.list_view_count_of(inputs)
});
/**

* @param {List_View_Create_FirstInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_create_first = /** @type {((inputs?: List_View_Create_FirstInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Create_FirstInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_create_first(inputs)
	return __en.list_view_create_first(inputs)
});
/**

* @param {List_View_Create_NewInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_create_new = /** @type {((inputs: List_View_Create_NewInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Create_NewInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_create_new(inputs)
	return __en.list_view_create_new(inputs)
});
/**

* @param {List_View_CreatedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_created = /** @type {((inputs?: List_View_CreatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_CreatedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_created(inputs)
	return __en.list_view_created(inputs)
});
/**

* @param {List_View_DashboardInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_dashboard = /** @type {((inputs?: List_View_DashboardInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_DashboardInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_dashboard(inputs)
	return __en.list_view_dashboard(inputs)
});
/**

* @param {List_View_DeleteInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_delete = /** @type {((inputs?: List_View_DeleteInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_DeleteInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_delete(inputs)
	return __en.list_view_delete(inputs)
});
/**

* @param {List_View_Delete_CountInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_delete_count = /** @type {((inputs: List_View_Delete_CountInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Delete_CountInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_delete_count(inputs)
	return __en.list_view_delete_count(inputs)
});
/**

* @param {List_View_Delete_HeadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_delete_heading = /** @type {((inputs: List_View_Delete_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Delete_HeadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_delete_heading(inputs)
	return __en.list_view_delete_heading(inputs)
});
/**

* @param {List_View_DiscardInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_discard = /** @type {((inputs?: List_View_DiscardInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_DiscardInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_discard(inputs)
	return __en.list_view_discard(inputs)
});
/**

* @param {List_View_Discard_HeadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_discard_heading = /** @type {((inputs?: List_View_Discard_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Discard_HeadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_discard_heading(inputs)
	return __en.list_view_discard_heading(inputs)
});
/**

* @param {List_View_Discard_TextInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_discard_text = /** @type {((inputs: List_View_Discard_TextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Discard_TextInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_discard_text(inputs)
	return __en.list_view_discard_text(inputs)
});
/**

* @param {List_View_EmptyInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_empty = /** @type {((inputs: List_View_EmptyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_EmptyInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_empty(inputs)
	return __en.list_view_empty(inputs)
});
/**

* @param {List_View_Empty_FilteredInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_empty_filtered = /** @type {((inputs: List_View_Empty_FilteredInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Empty_FilteredInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_empty_filtered(inputs)
	return __en.list_view_empty_filtered(inputs)
});
/**

* @param {List_View_Export_CsvInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_export_csv = /** @type {((inputs?: List_View_Export_CsvInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Export_CsvInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_export_csv(inputs)
	return __en.list_view_export_csv(inputs)
});
/**

* @param {List_View_Heatmap_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_heatmap_label = /** @type {((inputs: List_View_Heatmap_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Heatmap_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_heatmap_label(inputs)
	return __en.list_view_heatmap_label(inputs)
});
/**

* @param {List_View_Heatmap_SummaryInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_heatmap_summary = /** @type {((inputs: List_View_Heatmap_SummaryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Heatmap_SummaryInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_heatmap_summary(inputs)
	return __en.list_view_heatmap_summary(inputs)
});
/**

* @param {List_View_IdInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_id = /** @type {((inputs?: List_View_IdInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_IdInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_id(inputs)
	return __en.list_view_id(inputs)
});
/**

* @param {List_View_ItemInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_item = /** @type {((inputs?: List_View_ItemInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_ItemInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_item(inputs)
	return __en.list_view_item(inputs)
});
/**

* @param {List_View_ItemsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_items = /** @type {((inputs?: List_View_ItemsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_ItemsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_items(inputs)
	return __en.list_view_items(inputs)
});
/**

* @param {List_View_Keep_EditingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_keep_editing = /** @type {((inputs?: List_View_Keep_EditingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Keep_EditingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_keep_editing(inputs)
	return __en.list_view_keep_editing(inputs)
});
/**

* @param {List_View_Layout_BoardInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_layout_board = /** @type {((inputs?: List_View_Layout_BoardInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Layout_BoardInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_layout_board(inputs)
	return __en.list_view_layout_board(inputs)
});
/**

* @param {List_View_Layout_CalendarInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_layout_calendar = /** @type {((inputs?: List_View_Layout_CalendarInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Layout_CalendarInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_layout_calendar(inputs)
	return __en.list_view_layout_calendar(inputs)
});
/**

* @param {List_View_Layout_CardsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_layout_cards = /** @type {((inputs?: List_View_Layout_CardsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Layout_CardsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_layout_cards(inputs)
	return __en.list_view_layout_cards(inputs)
});
/**

* @param {List_View_Layout_ChartInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_layout_chart = /** @type {((inputs: List_View_Layout_ChartInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Layout_ChartInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_layout_chart(inputs)
	return __en.list_view_layout_chart(inputs)
});
/**

* @param {List_View_Layout_CompactInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_layout_compact = /** @type {((inputs?: List_View_Layout_CompactInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Layout_CompactInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_layout_compact(inputs)
	return __en.list_view_layout_compact(inputs)
});
/**

* @param {List_View_Layout_FocusInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_layout_focus = /** @type {((inputs?: List_View_Layout_FocusInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Layout_FocusInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_layout_focus(inputs)
	return __en.list_view_layout_focus(inputs)
});
/**

* @param {List_View_Layout_GroupsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_layout_groups = /** @type {((inputs: List_View_Layout_GroupsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Layout_GroupsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_layout_groups(inputs)
	return __en.list_view_layout_groups(inputs)
});
/**

* @param {List_View_Layout_HeatmapInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_layout_heatmap = /** @type {((inputs?: List_View_Layout_HeatmapInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Layout_HeatmapInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_layout_heatmap(inputs)
	return __en.list_view_layout_heatmap(inputs)
});
/**

* @param {List_View_Layout_ListInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_layout_list = /** @type {((inputs?: List_View_Layout_ListInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Layout_ListInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_layout_list(inputs)
	return __en.list_view_layout_list(inputs)
});
/**

* @param {List_View_Layout_RankingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_layout_ranking = /** @type {((inputs: List_View_Layout_RankingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Layout_RankingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_layout_ranking(inputs)
	return __en.list_view_layout_ranking(inputs)
});
/**

* @param {List_View_Layout_ScatterInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_layout_scatter = /** @type {((inputs?: List_View_Layout_ScatterInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Layout_ScatterInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_layout_scatter(inputs)
	return __en.list_view_layout_scatter(inputs)
});
/**

* @param {List_View_Layout_TableInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_layout_table = /** @type {((inputs?: List_View_Layout_TableInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Layout_TableInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_layout_table(inputs)
	return __en.list_view_layout_table(inputs)
});
/**

* @param {List_View_Layout_TimelineInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_layout_timeline = /** @type {((inputs?: List_View_Layout_TimelineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Layout_TimelineInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_layout_timeline(inputs)
	return __en.list_view_layout_timeline(inputs)
});
/**

* @param {List_View_Layout_TreemapInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_layout_treemap = /** @type {((inputs?: List_View_Layout_TreemapInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Layout_TreemapInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_layout_treemap(inputs)
	return __en.list_view_layout_treemap(inputs)
});
/**

* @param {List_View_LoadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_loading = /** @type {((inputs?: List_View_LoadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_LoadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_loading(inputs)
	return __en.list_view_loading(inputs)
});
/**

* @param {List_View_Move_FailedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_move_failed = /** @type {((inputs: List_View_Move_FailedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Move_FailedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_move_failed(inputs)
	return __en.list_view_move_failed(inputs)
});
/**

* @param {List_View_Move_MenuInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_move_menu = /** @type {((inputs: List_View_Move_MenuInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Move_MenuInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_move_menu(inputs)
	return __en.list_view_move_menu(inputs)
});
/**

* @param {List_View_Move_ToInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_move_to = /** @type {((inputs: List_View_Move_ToInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Move_ToInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_move_to(inputs)
	return __en.list_view_move_to(inputs)
});
/**

* @param {List_View_MovedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_moved = /** @type {((inputs: List_View_MovedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_MovedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_moved(inputs)
	return __en.list_view_moved(inputs)
});
/**

* @param {List_View_NewInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_new = /** @type {((inputs: List_View_NewInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_NewInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_new(inputs)
	return __en.list_view_new(inputs)
});
/**

* @param {List_View_NextInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_next = /** @type {((inputs?: List_View_NextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_NextInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_next(inputs)
	return __en.list_view_next(inputs)
});
/**

* @param {List_View_Next_MonthInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_next_month = /** @type {((inputs?: List_View_Next_MonthInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Next_MonthInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_next_month(inputs)
	return __en.list_view_next_month(inputs)
});
/**

* @param {List_View_No_RecordsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_no_records = /** @type {((inputs?: List_View_No_RecordsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_No_RecordsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_no_records(inputs)
	return __en.list_view_no_records(inputs)
});
/**

* @param {List_View_None_ColumnInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_none_column = /** @type {((inputs: List_View_None_ColumnInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_None_ColumnInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_none_column(inputs)
	return __en.list_view_none_column(inputs)
});
/**

* @param {List_View_None_InlineInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_none_inline = /** @type {((inputs: List_View_None_InlineInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_None_InlineInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_none_inline(inputs)
	return __en.list_view_none_inline(inputs)
});
/**

* @param {List_View_OpenInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_open = /** @type {((inputs?: List_View_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_OpenInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_open(inputs)
	return __en.list_view_open(inputs)
});
/**

* @param {List_View_Open_FullInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_open_full = /** @type {((inputs?: List_View_Open_FullInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Open_FullInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_open_full(inputs)
	return __en.list_view_open_full(inputs)
});
/**

* @param {List_View_PagesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_pages = /** @type {((inputs: List_View_PagesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_PagesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_pages(inputs)
	return __en.list_view_pages(inputs)
});
/**

* @param {List_View_PositionInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_position = /** @type {((inputs: List_View_PositionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_PositionInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_position(inputs)
	return __en.list_view_position(inputs)
});
/**

* @param {List_View_PreviousInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_previous = /** @type {((inputs?: List_View_PreviousInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_PreviousInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_previous(inputs)
	return __en.list_view_previous(inputs)
});
/**

* @param {List_View_Previous_MonthInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_previous_month = /** @type {((inputs?: List_View_Previous_MonthInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Previous_MonthInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_previous_month(inputs)
	return __en.list_view_previous_month(inputs)
});
/**

* @param {List_View_RangeInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_range = /** @type {((inputs: List_View_RangeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_RangeInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_range(inputs)
	return __en.list_view_range(inputs)
});
/**

* @param {List_View_Read_OnlyInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_read_only = /** @type {((inputs?: List_View_Read_OnlyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Read_OnlyInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_read_only(inputs)
	return __en.list_view_read_only(inputs)
});
/**

* @param {List_View_RowsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_rows = /** @type {((inputs?: List_View_RowsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_RowsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_rows(inputs)
	return __en.list_view_rows(inputs)
});
/**

* @param {List_View_SaveInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_save = /** @type {((inputs?: List_View_SaveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_SaveInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_save(inputs)
	return __en.list_view_save(inputs)
});
/**

* @param {List_View_SavedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_saved = /** @type {((inputs?: List_View_SavedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_SavedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_saved(inputs)
	return __en.list_view_saved(inputs)
});
/**

* @param {List_View_SavingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_saving = /** @type {((inputs?: List_View_SavingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_SavingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_saving(inputs)
	return __en.list_view_saving(inputs)
});
/**

* @param {List_View_Scatter_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_scatter_label = /** @type {((inputs: List_View_Scatter_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Scatter_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_scatter_label(inputs)
	return __en.list_view_scatter_label(inputs)
});
/**

* @param {List_View_Search_ByInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_search_by = /** @type {((inputs: List_View_Search_ByInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Search_ByInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_search_by(inputs)
	return __en.list_view_search_by(inputs)
});
/**

* @param {List_View_Select_AllInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_select_all = /** @type {((inputs: List_View_Select_AllInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Select_AllInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_select_all(inputs)
	return __en.list_view_select_all(inputs)
});
/**

* @param {List_View_Select_All_MatchingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_select_all_matching = /** @type {((inputs: List_View_Select_All_MatchingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Select_All_MatchingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_select_all_matching(inputs)
	return __en.list_view_select_all_matching(inputs)
});
/**

* @param {List_View_SelectedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_selected = /** @type {((inputs: List_View_SelectedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_SelectedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_selected(inputs)
	return __en.list_view_selected(inputs)
});
/**

* @param {List_View_SelectionInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_selection = /** @type {((inputs?: List_View_SelectionInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_SelectionInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_selection(inputs)
	return __en.list_view_selection(inputs)
});
/**

* @param {List_View_SortInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_sort = /** @type {((inputs?: List_View_SortInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_SortInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_sort(inputs)
	return __en.list_view_sort(inputs)
});
/**

* @param {List_View_Sort_DefaultInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_sort_default = /** @type {((inputs?: List_View_Sort_DefaultInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_Sort_DefaultInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_sort_default(inputs)
	return __en.list_view_sort_default(inputs)
});
/**

* @param {List_View_This_MonthInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_this_month = /** @type {((inputs?: List_View_This_MonthInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_This_MonthInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_this_month(inputs)
	return __en.list_view_this_month(inputs)
});
/**

* @param {List_View_UndoInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_undo = /** @type {((inputs?: List_View_UndoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_UndoInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_undo(inputs)
	return __en.list_view_undo(inputs)
});
/**

* @param {List_View_UnsavedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_unsaved = /** @type {((inputs?: List_View_UnsavedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_UnsavedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_unsaved(inputs)
	return __en.list_view_unsaved(inputs)
});
/**

* @param {List_View_UpdatedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_updated = /** @type {((inputs?: List_View_UpdatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_UpdatedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_updated(inputs)
	return __en.list_view_updated(inputs)
});
/**

* @param {List_View_ViewInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_view = /** @type {((inputs?: List_View_ViewInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_ViewInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_view(inputs)
	return __en.list_view_view(inputs)
});
/**

* @param {List_View_WithInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const list_view_with = /** @type {((inputs: List_View_WithInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<List_View_WithInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.list_view_with(inputs)
	return __en.list_view_with(inputs)
});
/**

* @param {Loading_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const loading_label = /** @type {((inputs?: Loading_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Loading_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.loading_label(inputs)
	return __en.loading_label(inputs)
});
/**

* @param {Message_Bad_ResponseInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const message_bad_response = /** @type {((inputs?: Message_Bad_ResponseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Message_Bad_ResponseInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.message_bad_response(inputs)
	return __en.message_bad_response(inputs)
});
/**

* @param {Message_CopiedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const message_copied = /** @type {((inputs?: Message_CopiedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Message_CopiedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.message_copied(inputs)
	return __en.message_copied(inputs)
});
/**

* @param {Message_CopyInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const message_copy = /** @type {((inputs?: Message_CopyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Message_CopyInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.message_copy(inputs)
	return __en.message_copy(inputs)
});
/**

* @param {Message_EditInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const message_edit = /** @type {((inputs?: Message_EditInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Message_EditInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.message_edit(inputs)
	return __en.message_edit(inputs)
});
/**

* @param {Message_Good_ResponseInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const message_good_response = /** @type {((inputs?: Message_Good_ResponseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Message_Good_ResponseInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.message_good_response(inputs)
	return __en.message_good_response(inputs)
});
/**

* @param {Message_RetryInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const message_retry = /** @type {((inputs?: Message_RetryInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Message_RetryInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.message_retry(inputs)
	return __en.message_retry(inputs)
});
/**

* @param {Message_Scroller_JumpInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const message_scroller_jump = /** @type {((inputs?: Message_Scroller_JumpInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Message_Scroller_JumpInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.message_scroller_jump(inputs)
	return __en.message_scroller_jump(inputs)
});
/**

* @param {Modal_CancelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const modal_cancel = /** @type {((inputs?: Modal_CancelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Modal_CancelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.modal_cancel(inputs)
	return __en.modal_cancel(inputs)
});
/**

* @param {Modal_CloseInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const modal_close = /** @type {((inputs?: Modal_CloseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Modal_CloseInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.modal_close(inputs)
	return __en.modal_close(inputs)
});
/**

* @param {Model_Selector_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const model_selector_label = /** @type {((inputs: Model_Selector_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Model_Selector_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.model_selector_label(inputs)
	return __en.model_selector_label(inputs)
});
/**

* @param {Month_Day_DueInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const month_day_due = /** @type {((inputs: Month_Day_DueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Month_Day_DueInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.month_day_due(inputs)
	return __en.month_day_due(inputs)
});
/**

* @param {Month_Nothing_DueInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const month_nothing_due = /** @type {((inputs?: Month_Nothing_DueInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Month_Nothing_DueInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.month_nothing_due(inputs)
	return __en.month_nothing_due(inputs)
});
/**

* @param {Number_DaysInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const number_days = /** @type {((inputs: Number_DaysInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Number_DaysInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.number_days(inputs)
	return __en.number_days(inputs)
});
/**

* @param {Number_HoursInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const number_hours = /** @type {((inputs: Number_HoursInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Number_HoursInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.number_hours(inputs)
	return __en.number_hours(inputs)
});
/**

* @param {Number_MinutesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const number_minutes = /** @type {((inputs: Number_MinutesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Number_MinutesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.number_minutes(inputs)
	return __en.number_minutes(inputs)
});
/**

* @param {Number_MoneyInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const number_money = /** @type {((inputs: Number_MoneyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Number_MoneyInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.number_money(inputs)
	return __en.number_money(inputs)
});
/**

* @param {Number_Money_CompactInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const number_money_compact = /** @type {((inputs: Number_Money_CompactInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Number_Money_CompactInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.number_money_compact(inputs)
	return __en.number_money_compact(inputs)
});
/**

* @param {Number_PctInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const number_pct = /** @type {((inputs: Number_PctInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Number_PctInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.number_pct(inputs)
	return __en.number_pct(inputs)
});
/**

* @param {Number_ThousandsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const number_thousands = /** @type {((inputs: Number_ThousandsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Number_ThousandsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.number_thousands(inputs)
	return __en.number_thousands(inputs)
});
/**

* @param {Otp_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const otp_label = /** @type {((inputs?: Otp_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Otp_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.otp_label(inputs)
	return __en.otp_label(inputs)
});
/**

* @param {Pagination_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const pagination_label = /** @type {((inputs?: Pagination_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Pagination_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.pagination_label(inputs)
	return __en.pagination_label(inputs)
});
/**

* @param {Pagination_NextInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const pagination_next = /** @type {((inputs?: Pagination_NextInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Pagination_NextInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.pagination_next(inputs)
	return __en.pagination_next(inputs)
});
/**

* @param {Pagination_Page_OfInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const pagination_page_of = /** @type {((inputs: Pagination_Page_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Pagination_Page_OfInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.pagination_page_of(inputs)
	return __en.pagination_page_of(inputs)
});
/**

* @param {Pagination_Pages_RangeInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const pagination_pages_range = /** @type {((inputs: Pagination_Pages_RangeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Pagination_Pages_RangeInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.pagination_pages_range(inputs)
	return __en.pagination_pages_range(inputs)
});
/**

* @param {Pagination_PreviousInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const pagination_previous = /** @type {((inputs?: Pagination_PreviousInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Pagination_PreviousInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.pagination_previous(inputs)
	return __en.pagination_previous(inputs)
});
/**

* @param {Prompt_Input_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const prompt_input_label = /** @type {((inputs?: Prompt_Input_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompt_Input_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.prompt_input_label(inputs)
	return __en.prompt_input_label(inputs)
});
/**

* @param {Prompt_Input_SendInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const prompt_input_send = /** @type {((inputs?: Prompt_Input_SendInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompt_Input_SendInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.prompt_input_send(inputs)
	return __en.prompt_input_send(inputs)
});
/**

* @param {Prompt_Input_StopInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const prompt_input_stop = /** @type {((inputs?: Prompt_Input_StopInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompt_Input_StopInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.prompt_input_stop(inputs)
	return __en.prompt_input_stop(inputs)
});
/**

* @param {Quadrant_MeasureInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const quadrant_measure = /** @type {((inputs: Quadrant_MeasureInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quadrant_MeasureInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.quadrant_measure(inputs)
	return __en.quadrant_measure(inputs)
});
/**

* @param {Quadrant_PointInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const quadrant_point = /** @type {((inputs: Quadrant_PointInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quadrant_PointInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.quadrant_point(inputs)
	return __en.quadrant_point(inputs)
});
/**

* @param {Quadrant_SplitInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const quadrant_split = /** @type {((inputs: Quadrant_SplitInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quadrant_SplitInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.quadrant_split(inputs)
	return __en.quadrant_split(inputs)
});
/**

* @param {Quadrant_X_AxisInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const quadrant_x_axis = /** @type {((inputs: Quadrant_X_AxisInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quadrant_X_AxisInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.quadrant_x_axis(inputs)
	return __en.quadrant_x_axis(inputs)
});
/**

* @param {Rating_NoneInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const rating_none = /** @type {((inputs?: Rating_NoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rating_NoneInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.rating_none(inputs)
	return __en.rating_none(inputs)
});
/**

* @param {Rating_OfInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const rating_of = /** @type {((inputs: Rating_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rating_OfInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.rating_of(inputs)
	return __en.rating_of(inputs)
});
/**

* @param {Rating_Star_WordsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const rating_star_words = /** @type {((inputs: Rating_Star_WordsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Rating_Star_WordsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.rating_star_words(inputs)
	return __en.rating_star_words(inputs)
});
/**

* @param {Record_NamedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const record_named = /** @type {((inputs: Record_NamedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Record_NamedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.record_named(inputs)
	return __en.record_named(inputs)
});
/**

* @param {Record_RelatedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const record_related = /** @type {((inputs?: Record_RelatedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Record_RelatedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.record_related(inputs)
	return __en.record_related(inputs)
});
/**

* @param {Search_ClearInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const search_clear = /** @type {((inputs?: Search_ClearInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Search_ClearInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.search_clear(inputs)
	return __en.search_clear(inputs)
});
/**

* @param {Search_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const search_label = /** @type {((inputs?: Search_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Search_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.search_label(inputs)
	return __en.search_label(inputs)
});
/**

* @param {Shared_Bookmarks_FailedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const shared_bookmarks_failed = /** @type {((inputs: Shared_Bookmarks_FailedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shared_Bookmarks_FailedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.shared_bookmarks_failed(inputs)
	return __en.shared_bookmarks_failed(inputs)
});
/**

* @param {Shared_CollectionsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const shared_collections = /** @type {((inputs?: Shared_CollectionsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shared_CollectionsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.shared_collections(inputs)
	return __en.shared_collections(inputs)
});
/**

* @param {Shared_ConfigurationInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const shared_configuration = /** @type {((inputs?: Shared_ConfigurationInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shared_ConfigurationInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.shared_configuration(inputs)
	return __en.shared_configuration(inputs)
});
/**

* @param {Shared_NoInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const shared_no = /** @type {((inputs?: Shared_NoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shared_NoInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.shared_no(inputs)
	return __en.shared_no(inputs)
});
/**

* @param {Shared_RowsInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const shared_rows = /** @type {((inputs: Shared_RowsInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shared_RowsInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.shared_rows(inputs)
	return __en.shared_rows(inputs)
});
/**

* @param {Shared_UntitledInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const shared_untitled = /** @type {((inputs?: Shared_UntitledInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shared_UntitledInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.shared_untitled(inputs)
	return __en.shared_untitled(inputs)
});
/**

* @param {Shared_YesInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const shared_yes = /** @type {((inputs?: Shared_YesInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shared_YesInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.shared_yes(inputs)
	return __en.shared_yes(inputs)
});
/**

* @param {Sheet_CloseInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const sheet_close = /** @type {((inputs?: Sheet_CloseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sheet_CloseInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.sheet_close(inputs)
	return __en.sheet_close(inputs)
});
/**

* @param {Site_Assistant_NameInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const site_assistant_name = /** @type {((inputs?: Site_Assistant_NameInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Site_Assistant_NameInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.site_assistant_name(inputs)
	return __en.site_assistant_name(inputs)
});
/**

* @param {Site_Default_NameInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const site_default_name = /** @type {((inputs?: Site_Default_NameInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Site_Default_NameInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.site_default_name(inputs)
	return __en.site_default_name(inputs)
});
/**

* @param {Skeleton_LoadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const skeleton_loading = /** @type {((inputs?: Skeleton_LoadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skeleton_LoadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.skeleton_loading(inputs)
	return __en.skeleton_loading(inputs)
});
/**

* @param {Snackbar_DismissInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const snackbar_dismiss = /** @type {((inputs?: Snackbar_DismissInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Snackbar_DismissInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.snackbar_dismiss(inputs)
	return __en.snackbar_dismiss(inputs)
});
/**

* @param {Sources_UsedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const sources_used = /** @type {((inputs: Sources_UsedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sources_UsedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.sources_used(inputs)
	return __en.sources_used(inputs)
});
/**

* @param {Stat_Delta_DownInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const stat_delta_down = /** @type {((inputs?: Stat_Delta_DownInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stat_Delta_DownInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.stat_delta_down(inputs)
	return __en.stat_delta_down(inputs)
});
/**

* @param {Stat_Delta_FlatInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const stat_delta_flat = /** @type {((inputs?: Stat_Delta_FlatInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stat_Delta_FlatInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.stat_delta_flat(inputs)
	return __en.stat_delta_flat(inputs)
});
/**

* @param {Stat_Delta_UpInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const stat_delta_up = /** @type {((inputs?: Stat_Delta_UpInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stat_Delta_UpInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.stat_delta_up(inputs)
	return __en.stat_delta_up(inputs)
});
/**

* @param {Stepper_LessInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const stepper_less = /** @type {((inputs?: Stepper_LessInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stepper_LessInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.stepper_less(inputs)
	return __en.stepper_less(inputs)
});
/**

* @param {Stepper_Less_OfInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const stepper_less_of = /** @type {((inputs: Stepper_Less_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stepper_Less_OfInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.stepper_less_of(inputs)
	return __en.stepper_less_of(inputs)
});
/**

* @param {Stepper_MoreInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const stepper_more = /** @type {((inputs?: Stepper_MoreInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stepper_MoreInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.stepper_more(inputs)
	return __en.stepper_more(inputs)
});
/**

* @param {Stepper_More_OfInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const stepper_more_of = /** @type {((inputs: Stepper_More_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Stepper_More_OfInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.stepper_more_of(inputs)
	return __en.stepper_more_of(inputs)
});
/**

* @param {Steps_DoneInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const steps_done = /** @type {((inputs?: Steps_DoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Steps_DoneInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.steps_done(inputs)
	return __en.steps_done(inputs)
});
/**

* @param {Steps_SkippedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const steps_skipped = /** @type {((inputs?: Steps_SkippedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Steps_SkippedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.steps_skipped(inputs)
	return __en.steps_skipped(inputs)
});
/**

* @param {Suggestions_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const suggestions_label = /** @type {((inputs?: Suggestions_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Suggestions_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.suggestions_label(inputs)
	return __en.suggestions_label(inputs)
});
/**

* @param {Table_Column_FitInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const table_column_fit = /** @type {((inputs: Table_Column_FitInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Table_Column_FitInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.table_column_fit(inputs)
	return __en.table_column_fit(inputs)
});
/**

* @param {Table_Column_MovedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const table_column_moved = /** @type {((inputs: Table_Column_MovedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Table_Column_MovedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.table_column_moved(inputs)
	return __en.table_column_moved(inputs)
});
/**

* @param {Table_Column_WidthInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const table_column_width = /** @type {((inputs: Table_Column_WidthInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Table_Column_WidthInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.table_column_width(inputs)
	return __en.table_column_width(inputs)
});
/**

* @param {Table_Resize_ColumnInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const table_resize_column = /** @type {((inputs: Table_Resize_ColumnInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Table_Resize_ColumnInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.table_resize_column(inputs)
	return __en.table_resize_column(inputs)
});
/**

* @param {Table_Resize_HintInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const table_resize_hint = /** @type {((inputs?: Table_Resize_HintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Table_Resize_HintInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.table_resize_hint(inputs)
	return __en.table_resize_hint(inputs)
});
/**

* @param {Table_Select_AllInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const table_select_all = /** @type {((inputs?: Table_Select_AllInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Table_Select_AllInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.table_select_all(inputs)
	return __en.table_select_all(inputs)
});
/**

* @param {Table_Select_RowInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const table_select_row = /** @type {((inputs: Table_Select_RowInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Table_Select_RowInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.table_select_row(inputs)
	return __en.table_select_row(inputs)
});
/**

* @param {Table_Sort_HintInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const table_sort_hint = /** @type {((inputs?: Table_Sort_HintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Table_Sort_HintInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.table_sort_hint(inputs)
	return __en.table_sort_hint(inputs)
});
/**

* @param {Table_Sort_Move_HintInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const table_sort_move_hint = /** @type {((inputs?: Table_Sort_Move_HintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Table_Sort_Move_HintInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.table_sort_move_hint(inputs)
	return __en.table_sort_move_hint(inputs)
});
/**

* @param {Tile_MoveInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const tile_move = /** @type {((inputs?: Tile_MoveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Tile_MoveInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.tile_move(inputs)
	return __en.tile_move(inputs)
});
/**

* @param {Tile_Move_HintInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const tile_move_hint = /** @type {((inputs?: Tile_Move_HintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Tile_Move_HintInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.tile_move_hint(inputs)
	return __en.tile_move_hint(inputs)
});
/**

* @param {Tile_Move_NamedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const tile_move_named = /** @type {((inputs: Tile_Move_NamedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Tile_Move_NamedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.tile_move_named(inputs)
	return __en.tile_move_named(inputs)
});
/**

* @param {Tile_RemoveInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const tile_remove = /** @type {((inputs?: Tile_RemoveInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Tile_RemoveInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.tile_remove(inputs)
	return __en.tile_remove(inputs)
});
/**

* @param {Tile_Remove_NamedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const tile_remove_named = /** @type {((inputs: Tile_Remove_NamedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Tile_Remove_NamedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.tile_remove_named(inputs)
	return __en.tile_remove_named(inputs)
});
/**

* @param {Tile_ResizeInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const tile_resize = /** @type {((inputs?: Tile_ResizeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Tile_ResizeInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.tile_resize(inputs)
	return __en.tile_resize(inputs)
});
/**

* @param {Tile_Resize_HintInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const tile_resize_hint = /** @type {((inputs?: Tile_Resize_HintInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Tile_Resize_HintInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.tile_resize_hint(inputs)
	return __en.tile_resize_hint(inputs)
});
/**

* @param {Tile_Resize_NamedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const tile_resize_named = /** @type {((inputs: Tile_Resize_NamedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Tile_Resize_NamedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.tile_resize_named(inputs)
	return __en.tile_resize_named(inputs)
});
/**

* @param {Tile_Show_AllInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const tile_show_all = /** @type {((inputs?: Tile_Show_AllInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Tile_Show_AllInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.tile_show_all(inputs)
	return __en.tile_show_all(inputs)
});
/**

* @param {Tile_Show_LessInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const tile_show_less = /** @type {((inputs?: Tile_Show_LessInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Tile_Show_LessInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.tile_show_less(inputs)
	return __en.tile_show_less(inputs)
});
/**

* @param {Tour_Eyebrow_Signed_InInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const tour_eyebrow_signed_in = /** @type {((inputs: Tour_Eyebrow_Signed_InInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Tour_Eyebrow_Signed_InInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.tour_eyebrow_signed_in(inputs)
	return __en.tour_eyebrow_signed_in(inputs)
});
/**

* @param {Treemap_CellInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const treemap_cell = /** @type {((inputs: Treemap_CellInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treemap_CellInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.treemap_cell(inputs)
	return __en.treemap_cell(inputs)
});
/**

* @param {Visual_OtherInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const visual_other = /** @type {((inputs?: Visual_OtherInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Visual_OtherInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.visual_other(inputs)
	return __en.visual_other(inputs)
});
/**

* @param {Waffle_LabelInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const waffle_label = /** @type {((inputs?: Waffle_LabelInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Waffle_LabelInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.waffle_label(inputs)
	return __en.waffle_label(inputs)
});
/**

* @param {Waffle_ReadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const waffle_reading = /** @type {((inputs: Waffle_ReadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Waffle_ReadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.waffle_reading(inputs)
	return __en.waffle_reading(inputs)
});
/**

* @param {Waterfall_ChangeInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const waterfall_change = /** @type {((inputs: Waterfall_ChangeInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Waterfall_ChangeInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.waterfall_change(inputs)
	return __en.waterfall_change(inputs)
});
/**

* @param {Waterfall_DecreaseInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const waterfall_decrease = /** @type {((inputs?: Waterfall_DecreaseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Waterfall_DecreaseInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.waterfall_decrease(inputs)
	return __en.waterfall_decrease(inputs)
});
/**

* @param {Waterfall_IncreaseInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const waterfall_increase = /** @type {((inputs?: Waterfall_IncreaseInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Waterfall_IncreaseInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.waterfall_increase(inputs)
	return __en.waterfall_increase(inputs)
});
/**

* @param {Waterfall_TotalInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const waterfall_total = /** @type {((inputs: Waterfall_TotalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Waterfall_TotalInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.waterfall_total(inputs)
	return __en.waterfall_total(inputs)
});
/**

* @param {Waterfall_Total_KeyInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const waterfall_total_key = /** @type {((inputs?: Waterfall_Total_KeyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Waterfall_Total_KeyInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.waterfall_total_key(inputs)
	return __en.waterfall_total_key(inputs)
});
/**

* @param {Whatif_ResetInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const whatif_reset = /** @type {((inputs?: Whatif_ResetInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Whatif_ResetInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.whatif_reset(inputs)
	return __en.whatif_reset(inputs)
});
/**

* @param {Widget_Ask_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_ask_placeholder = /** @type {((inputs?: Widget_Ask_PlaceholderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Ask_PlaceholderInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_ask_placeholder(inputs)
	return __en.widget_ask_placeholder(inputs)
});
/**

* @param {Widget_Ask_ReadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_ask_reading = /** @type {((inputs?: Widget_Ask_ReadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Ask_ReadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_ask_reading(inputs)
	return __en.widget_ask_reading(inputs)
});
/**

* @param {Widget_AttachInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_attach = /** @type {((inputs: Widget_AttachInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_AttachInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_attach(inputs)
	return __en.widget_attach(inputs)
});
/**

* @param {Widget_Blocks_ChartInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_blocks_chart = /** @type {((inputs?: Widget_Blocks_ChartInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Blocks_ChartInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_blocks_chart(inputs)
	return __en.widget_blocks_chart(inputs)
});
/**

* @param {Widget_Blocks_Funnel_StepInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_blocks_funnel_step = /** @type {((inputs?: Widget_Blocks_Funnel_StepInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Blocks_Funnel_StepInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_blocks_funnel_step(inputs)
	return __en.widget_blocks_funnel_step(inputs)
});
/**

* @param {Widget_Blocks_MoreInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_blocks_more = /** @type {((inputs?: Widget_Blocks_MoreInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Blocks_MoreInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_blocks_more(inputs)
	return __en.widget_blocks_more(inputs)
});
/**

* @param {Widget_DashboardInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_dashboard = /** @type {((inputs?: Widget_DashboardInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_DashboardInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_dashboard(inputs)
	return __en.widget_dashboard(inputs)
});
/**

* @param {Widget_Data_AllInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_data_all = /** @type {((inputs: Widget_Data_AllInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Data_AllInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_data_all(inputs)
	return __en.widget_data_all(inputs)
});
/**

* @param {Widget_Data_In_AllInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_data_in_all = /** @type {((inputs?: Widget_Data_In_AllInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Data_In_AllInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_data_in_all(inputs)
	return __en.widget_data_in_all(inputs)
});
/**

* @param {Widget_DeniedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_denied = /** @type {((inputs?: Widget_DeniedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_DeniedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_denied(inputs)
	return __en.widget_denied(inputs)
});
/**

* @param {Widget_EmptyInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_empty = /** @type {((inputs?: Widget_EmptyInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_EmptyInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_empty(inputs)
	return __en.widget_empty(inputs)
});
/**

* @param {Widget_FailedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_failed = /** @type {((inputs?: Widget_FailedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_FailedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_failed(inputs)
	return __en.widget_failed(inputs)
});
/**

* @param {Widget_Fill_InInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_fill_in = /** @type {((inputs: Widget_Fill_InInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Fill_InInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_fill_in(inputs)
	return __en.widget_fill_in(inputs)
});
/**

* @param {Widget_Fill_In_ButtonInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_fill_in_button = /** @type {((inputs?: Widget_Fill_In_ButtonInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Fill_In_ButtonInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_fill_in_button(inputs)
	return __en.widget_fill_in_button(inputs)
});
/**

* @param {Widget_Host_AllInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_host_all = /** @type {((inputs?: Widget_Host_AllInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Host_AllInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_host_all(inputs)
	return __en.widget_host_all(inputs)
});
/**

* @param {Widget_Host_CompactInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_host_compact = /** @type {((inputs?: Widget_Host_CompactInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Host_CompactInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_host_compact(inputs)
	return __en.widget_host_compact(inputs)
});
/**

* @param {Widget_Host_Its_ScreenInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_host_its_screen = /** @type {((inputs?: Widget_Host_Its_ScreenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Host_Its_ScreenInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_host_its_screen(inputs)
	return __en.widget_host_its_screen(inputs)
});
/**

* @param {Widget_Host_Keep_HereInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_host_keep_here = /** @type {((inputs?: Widget_Host_Keep_HereInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Host_Keep_HereInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_host_keep_here(inputs)
	return __en.widget_host_keep_here(inputs)
});
/**

* @param {Widget_Host_KeptInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_host_kept = /** @type {((inputs: Widget_Host_KeptInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Host_KeptInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_host_kept(inputs)
	return __en.widget_host_kept(inputs)
});
/**

* @param {Widget_Host_Reset_LayoutInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_host_reset_layout = /** @type {((inputs?: Widget_Host_Reset_LayoutInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Host_Reset_LayoutInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_host_reset_layout(inputs)
	return __en.widget_host_reset_layout(inputs)
});
/**

* @param {Widget_Host_Show_HiddenInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_host_show_hidden = /** @type {((inputs: Widget_Host_Show_HiddenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Host_Show_HiddenInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_host_show_hidden(inputs)
	return __en.widget_host_show_hidden(inputs)
});
/**

* @param {Widget_Host_TileInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_host_tile = /** @type {((inputs?: Widget_Host_TileInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Host_TileInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_host_tile(inputs)
	return __en.widget_host_tile(inputs)
});
/**

* @param {Widget_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_load_failed = /** @type {((inputs?: Widget_Load_FailedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Load_FailedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_load_failed(inputs)
	return __en.widget_load_failed(inputs)
});
/**

* @param {Widget_Mini_OfInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_mini_of = /** @type {((inputs: Widget_Mini_OfInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Mini_OfInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_mini_of(inputs)
	return __en.widget_mini_of(inputs)
});
/**

* @param {Widget_Mini_OpenInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_mini_open = /** @type {((inputs: Widget_Mini_OpenInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Mini_OpenInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_mini_open(inputs)
	return __en.widget_mini_open(inputs)
});
/**

* @param {Widget_Mini_OtherInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_mini_other = /** @type {((inputs?: Widget_Mini_OtherInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Mini_OtherInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_mini_other(inputs)
	return __en.widget_mini_other(inputs)
});
/**

* @param {Widget_Mini_ReadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_mini_reading = /** @type {((inputs?: Widget_Mini_ReadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Mini_ReadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_mini_reading(inputs)
	return __en.widget_mini_reading(inputs)
});
/**

* @param {Widget_Mini_ShareInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_mini_share = /** @type {((inputs?: Widget_Mini_ShareInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Mini_ShareInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_mini_share(inputs)
	return __en.widget_mini_share(inputs)
});
/**

* @param {Widget_Mini_StepInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_mini_step = /** @type {((inputs: Widget_Mini_StepInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Mini_StepInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_mini_step(inputs)
	return __en.widget_mini_step(inputs)
});
/**

* @param {Widget_More_HeadingInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_more_heading = /** @type {((inputs: Widget_More_HeadingInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_More_HeadingInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_more_heading(inputs)
	return __en.widget_more_heading(inputs)
});
/**

* @param {Widget_Paste_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_paste_placeholder = /** @type {((inputs?: Widget_Paste_PlaceholderInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Paste_PlaceholderInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_paste_placeholder(inputs)
	return __en.widget_paste_placeholder(inputs)
});
/**

* @param {Widget_Save_FailedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_save_failed = /** @type {((inputs?: Widget_Save_FailedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Save_FailedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_save_failed(inputs)
	return __en.widget_save_failed(inputs)
});
/**

* @param {Widget_Share_Of_AllInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_share_of_all = /** @type {((inputs: Widget_Share_Of_AllInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Share_Of_AllInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_share_of_all(inputs)
	return __en.widget_share_of_all(inputs)
});
/**

* @param {Widget_Share_Of_FirstInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_share_of_first = /** @type {((inputs: Widget_Share_Of_FirstInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Share_Of_FirstInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_share_of_first(inputs)
	return __en.widget_share_of_first(inputs)
});
/**

* @param {Widget_Share_Of_MaxInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_share_of_max = /** @type {((inputs: Widget_Share_Of_MaxInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Share_Of_MaxInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_share_of_max(inputs)
	return __en.widget_share_of_max(inputs)
});
/**

* @param {Widget_Share_Of_TotalInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_share_of_total = /** @type {((inputs: Widget_Share_Of_TotalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Share_Of_TotalInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_share_of_total(inputs)
	return __en.widget_share_of_total(inputs)
});
/**

* @param {Widget_TotalInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_total = /** @type {((inputs?: Widget_TotalInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_TotalInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_total(inputs)
	return __en.widget_total(inputs)
});
/**

* @param {Widget_UndoInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_undo = /** @type {((inputs?: Widget_UndoInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_UndoInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_undo(inputs)
	return __en.widget_undo(inputs)
});
/**

* @param {Widget_Undo_FailedInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_undo_failed = /** @type {((inputs?: Widget_Undo_FailedInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_Undo_FailedInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_undo_failed(inputs)
	return __en.widget_undo_failed(inputs)
});
/**

* @param {Widget_UndoneInputs} inputs
* @param {{ locale?: "en" | "ar" }} options
* @returns {LocalizedString}
*/
export const widget_undone = /** @type {((inputs?: Widget_UndoneInputs, options?: { locale?: "en" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Widget_UndoneInputs, { locale?: "en" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ ?? options.locale ?? getLocale()
	if (isDevelopment && /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__ !== undefined && options.locale !== undefined && options.locale !== /** @type {any} */ (globalThis).__PARAGLIDE_STATIC_LOCALE__) console.warn("Paraglide: options.locale cannot override a locale-specialized client bundle; use a full document navigation to switch locales.")
	if (locale === "ar") return __ar.widget_undone(inputs)
	return __en.widget_undone(inputs)
});