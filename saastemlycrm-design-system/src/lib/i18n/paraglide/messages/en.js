/* eslint-disable */
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
import * as __paraglideRegistry from "../registry.js"


export const agent_allow = /** @type {(inputs: Agent_AllowInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Allow: ${i?.action}?`)
};

export const agent_allow_description = /** @type {(inputs: Agent_Allow_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The helper wants to make this change for you.`)
};

export const agent_builtin_too_small = /** @type {(inputs: Agent_Builtin_Too_SmallInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Chrome's built-in model has too little room for the helper on this device.`)
};

export const agent_builtin_unavailable = /** @type {(inputs: Agent_Builtin_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Chrome's built-in model isn't available on this device (it needs about 22 GB of free disk space and a GPU with more than 4 GB of memory, or 16 GB of RAM).`)
};

export const agent_could_not_finish = /** @type {(inputs: Agent_Could_Not_FinishInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`I couldn't finish that. Could you ask it another way, or narrower?`)
};

export const agent_decided_answer = /** @type {(inputs: Agent_Decided_AnswerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Decided to answer.`)
};

export const agent_decided_grounded = /** @type {(inputs: Agent_Decided_GroundedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Answered without checking any records, so the answer comes from ${i?.tool} instead.`)
};

export const agent_decided_tool = /** @type {(inputs: Agent_Decided_ToolInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Decided to use **${i?.tool}**.`)
};

export const agent_decided_tools = /** @type {(inputs: Agent_Decided_ToolsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Decided to use ${i?.tools}.`)
};

export const agent_details = /** @type {(inputs: Agent_DetailsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Details`)
};

export const agent_downloading = /** @type {(inputs: Agent_DownloadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Downloading the AI model (once per device)…`)
};

export const agent_downloading_progress = /** @type {(inputs: Agent_Downloading_ProgressInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Downloading the AI model… ${i?.percent}`)
};

export const agent_empty_body = /** @type {(inputs: Agent_Empty_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`I see the screen you're on, find records, explain what's waiting for you, take you anywhere and, with your OK, do things for you.`)
};

export const agent_empty_heading = /** @type {(inputs: Agent_Empty_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`How can I help?`)
};

export const agent_find_nothing = /** @type {(inputs: Agent_Find_NothingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Nothing matches "${i?.query}".`)
};

export const agent_local_body = /** @type {(inputs: Agent_Local_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This browser doesn't have Chrome's on-device AI switched on. Download the model once (about 800 MB, kept by the browser — not in private windows) to use it here — nothing you type leaves this computer. Or turn on Chrome's own (faster) with the steps on the login page.`)
};

export const agent_local_download = /** @type {(inputs: Agent_Local_DownloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Download the AI model (about 800 MB)`)
};

export const agent_local_heading = /** @type {(inputs: Agent_Local_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.model} runs on this computer`)
};

export const agent_local_loading = /** @type {(inputs: Agent_Local_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Loading…`)
};

export const agent_model_load_failed = /** @type {(inputs: Agent_Model_Load_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Couldn't load the model: ${i?.error}`)
};

export const agent_model_output = /** @type {(inputs: Agent_Model_OutputInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Model output`)
};

export const agent_models_cloud = /** @type {(inputs: Agent_Models_CloudInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`OpenAI · API key`)
};

export const agent_models_device = /** @type {(inputs: Agent_Models_DeviceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`On this device`)
};

export const agent_my_day_empty = /** @type {(inputs: Agent_My_Day_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing on the home page for this person.`)
};

export const agent_new_chat = /** @type {(inputs: Agent_New_ChatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New chat`)
};

export const agent_no_builtin_model = /** @type {(inputs: Agent_No_Builtin_ModelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`This browser has no built-in AI model. ${i?.model} needs Chrome's on-device AI or the downloadable model: see "Turn on on-device AI" on the login page.`)
};

export const agent_open = /** @type {(inputs: Agent_OpenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Open the ${i?.helper}`)
};

export const agent_openai_failed = /** @type {(inputs: Agent_Openai_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`OpenAI request failed (${i?.status})`)
};

export const agent_opened = /** @type {(inputs: Agent_OpenedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Opened: ${i?.title} (${i?.path}).`)
};

export const agent_prompt_placeholder = /** @type {(inputs: Agent_Prompt_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ask or tell the helper…`)
};

export const agent_record_page = /** @type {(inputs: Agent_Record_PageInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Page: ${i?.path}`)
};

export const agent_screen_about = /** @type {(inputs: Agent_Screen_AboutInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`About this page: ${i?.description}`)
};

export const agent_screen_list = /** @type {(inputs: Agent_Screen_ListInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`A list of ${i?.label}: ${i?.count} in all. First ones:`)
};

export const agent_screen_page = /** @type {(inputs: Agent_Screen_PageInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Page: ${i?.title} (${i?.path})`)
};

export const agent_screen_record = /** @type {(inputs: Agent_Screen_RecordInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`A ${i?.singular}: ${i?.title}`)
};

export const agent_screen_settings = /** @type {(inputs: Agent_Screen_SettingsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Settings: ${i?.label}.`)
};

export const agent_screen_signed_in = /** @type {(inputs: Agent_Screen_Signed_InInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Signed in as ${i?.name} — ${i?.role}`)
};

export const agent_screen_signed_out = /** @type {(inputs: Agent_Screen_Signed_OutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signed out`)
};

export const agent_screen_tabs = /** @type {(inputs: Agent_Screen_TabsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Tabs: ${i?.tabs}`)
};

export const agent_screen_view = /** @type {(inputs: Agent_Screen_ViewInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`A screen: ${i?.title}.`)
};

export const agent_sources = /** @type {(inputs: Agent_SourcesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sources: ${i?.sources}`)
};

export const agent_suggest_approvals = /** @type {(inputs: Agent_Suggest_ApprovalsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What needs my approval?`)
};

export const agent_suggest_page = /** @type {(inputs: Agent_Suggest_PageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`How does this page work?`)
};

export const agent_suggest_screen = /** @type {(inputs: Agent_Suggest_ScreenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What am I looking at?`)
};

export const agent_suggest_today = /** @type {(inputs: Agent_Suggest_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What's waiting for me today?`)
};

export const agent_thinking = /** @type {(inputs: Agent_ThinkingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Thinking…`)
};

export const agent_thought_for = /** @type {(inputs: Agent_Thought_ForInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Thought for ${i?.seconds} s`)
};

export const agent_thought_opened = /** @type {(inputs: Agent_Thought_OpenedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A request to open a page: opened it directly, without the model.`)
};

export const agent_thought_routed = /** @type {(inputs: Agent_Thought_RoutedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`A common request: answered with **${i?.tool}** directly, from the records, without the model.`)
};

export const agent_too_many_steps = /** @type {(inputs: Agent_Too_Many_StepsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`I stopped after many steps without finishing. Could you narrow the request?`)
};

export const agent_tool_ask_assistant = /** @type {(inputs: Agent_Tool_Ask_AssistantInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ask the records`)
};

export const agent_tool_ask_records = /** @type {(inputs: Agent_Tool_Ask_RecordsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ask the records`)
};

export const agent_tool_call_workflow = /** @type {(inputs: Agent_Tool_Call_WorkflowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Run a workflow`)
};

export const agent_tool_check_accessibility = /** @type {(inputs: Agent_Tool_Check_AccessibilityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Check colour contrast`)
};

export const agent_tool_count_documents = /** @type {(inputs: Agent_Tool_Count_DocumentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Count records`)
};

export const agent_tool_create_document = /** @type {(inputs: Agent_Tool_Create_DocumentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create a record`)
};

export const agent_tool_delete_document = /** @type {(inputs: Agent_Tool_Delete_DocumentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete a record`)
};

export const agent_tool_describe_schema = /** @type {(inputs: Agent_Tool_Describe_SchemaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Data model`)
};

export const agent_tool_find = /** @type {(inputs: Agent_Tool_FindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Find`)
};

export const agent_tool_find_documents = /** @type {(inputs: Agent_Tool_Find_DocumentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Find records`)
};

export const agent_tool_get_appearance = /** @type {(inputs: Agent_Tool_Get_AppearanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Appearance`)
};

export const agent_tool_get_bookmarks = /** @type {(inputs: Agent_Tool_Get_BookmarksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bookmarks`)
};

export const agent_tool_get_document = /** @type {(inputs: Agent_Tool_Get_DocumentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Read a record`)
};

export const agent_tool_get_my_work = /** @type {(inputs: Agent_Tool_Get_My_WorkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`My work`)
};

export const agent_tool_get_screen = /** @type {(inputs: Agent_Tool_Get_ScreenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What's on screen`)
};

export const agent_tool_get_settings = /** @type {(inputs: Agent_Tool_Get_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Read settings`)
};

export const agent_tool_list_demo_users = /** @type {(inputs: Agent_Tool_List_Demo_UsersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Demo users`)
};

export const agent_tool_list_pages = /** @type {(inputs: Agent_Tool_List_PagesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pages`)
};

export const agent_tool_list_tours = /** @type {(inputs: Agent_Tool_List_ToursInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Guided tours`)
};

export const agent_tool_list_workflows = /** @type {(inputs: Agent_Tool_List_WorkflowsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Workflows`)
};

export const agent_tool_mark_notification_read = /** @type {(inputs: Agent_Tool_Mark_Notification_ReadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mark notification read`)
};

export const agent_tool_my_day = /** @type {(inputs: Agent_Tool_My_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`My day`)
};

export const agent_tool_navigate = /** @type {(inputs: Agent_Tool_NavigateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Go to a page`)
};

export const agent_tool_open_page = /** @type {(inputs: Agent_Tool_Open_PageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open a page`)
};

export const agent_tool_platform_guide = /** @type {(inputs: Agent_Tool_Platform_GuideInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Platform guide`)
};

export const agent_tool_record_status = /** @type {(inputs: Agent_Tool_Record_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Record status`)
};

export const agent_tool_set_appearance = /** @type {(inputs: Agent_Tool_Set_AppearanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Change appearance`)
};

export const agent_tool_set_layout = /** @type {(inputs: Agent_Tool_Set_LayoutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open or close a side column`)
};

export const agent_tool_start_tour = /** @type {(inputs: Agent_Tool_Start_TourInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Start a tour`)
};

export const agent_tool_switch_user = /** @type {(inputs: Agent_Tool_Switch_UserInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Switch user (demo)`)
};

export const agent_tool_toggle_bookmark = /** @type {(inputs: Agent_Tool_Toggle_BookmarkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bookmark a page`)
};

export const agent_tool_update_document = /** @type {(inputs: Agent_Tool_Update_DocumentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Update a record`)
};

export const agent_tool_update_settings = /** @type {(inputs: Agent_Tool_Update_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Change settings`)
};

export const agent_tool_what_is_on_screen = /** @type {(inputs: Agent_Tool_What_Is_On_ScreenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What's on screen`)
};

export const agent_tool_with = /** @type {(inputs: Agent_Tool_WithInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`**${i?.tool}** with ${i?.input}`)
};

export const agent_trace_input = /** @type {(inputs: Agent_Trace_InputInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Input`)
};

export const agent_trace_result = /** @type {(inputs: Agent_Trace_ResultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Result`)
};

export const agent_working = /** @type {(inputs: Agent_WorkingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Working…`)
};

export const alert_dismiss = /** @type {(inputs: Alert_DismissInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dismiss`)
};

export const app_backend_failed = /** @type {(inputs: App_Backend_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The mock backend couldn't start`)
};

export const app_demo_tag = /** @type {(inputs: App_Demo_TagInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Demo`)
};

export const app_log_out = /** @type {(inputs: App_Log_OutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Log out`)
};

export const app_logged_out = /** @type {(inputs: App_Logged_OutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`You have been logged out.`)
};

export const app_nav_dashboard = /** @type {(inputs: App_Nav_DashboardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dashboard`)
};

export const app_nav_home = /** @type {(inputs: App_Nav_HomeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Home`)
};

export const app_needs_attention = /** @type {(inputs: App_Needs_AttentionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Needs attention`)
};

export const app_not_found_back = /** @type {(inputs: App_Not_Found_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Back to the dashboard`)
};

export const app_not_found_description = /** @type {(inputs: App_Not_Found_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`There's no dashboard page at this address.`)
};

export const app_not_found_heading = /** @type {(inputs: App_Not_Found_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing found`)
};

export const app_powered_by = /** @type {(inputs: App_Powered_ByInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`This Demo Powered by ${i?.name}`)
};

export const app_shell_navigation = /** @type {(inputs: App_Shell_NavigationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Navigation`)
};

export const app_shell_side_panel = /** @type {(inputs: App_Shell_Side_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Side panel`)
};

export const app_side_panel = /** @type {(inputs: App_Side_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Side panel`)
};

export const app_switch_user_failed = /** @type {(inputs: App_Switch_User_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Couldn't switch to ${i?.name}: ${i?.error}`)
};

export const app_switch_user_heading = /** @type {(inputs: App_Switch_User_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Switch user`)
};

export const app_switch_user_label = /** @type {(inputs: App_Switch_User_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Switch user (demo) — signed in as ${i?.name}`)
};

export const app_switched_user = /** @type {(inputs: App_Switched_UserInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Signed in as ${i?.name} (${i?.role})`)
};

export const app_title_account = /** @type {(inputs: App_Title_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Account`)
};

export const app_title_create_first_user = /** @type {(inputs: App_Title_Create_First_UserInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create first user`)
};

export const app_title_login = /** @type {(inputs: App_Title_LoginInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Login`)
};

export const app_title_not_found = /** @type {(inputs: App_Title_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not found`)
};

export const app_title_suffix = /** @type {(inputs: App_Title_SuffixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`· Dashboard`)
};

export const app_view_loading = /** @type {(inputs: App_View_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This screen is loading.`)
};

export const appearance_all_label = /** @type {(inputs: Appearance_All_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Display settings`)
};

export const appearance_background_heading = /** @type {(inputs: Appearance_Background_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Background`)
};

export const appearance_background_label = /** @type {(inputs: Appearance_Background_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Background image`)
};

export const appearance_background_live_magnet_lines = /** @type {(inputs: Appearance_Background_Live_Magnet_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Magnet lines`)
};

export const appearance_background_live_waves = /** @type {(inputs: Appearance_Background_Live_WavesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Waves`)
};

export const appearance_background_none = /** @type {(inputs: Appearance_Background_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No image`)
};

export const appearance_background_replace = /** @type {(inputs: Appearance_Background_ReplaceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Replace your image`)
};

export const appearance_background_upload = /** @type {(inputs: Appearance_Background_UploadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Upload your own`)
};

export const appearance_language_ar = /** @type {(inputs: Appearance_Language_ArInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Arabic`)
};

export const appearance_language_current = /** @type {(inputs: Appearance_Language_CurrentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Current language`)
};

export const appearance_language_en = /** @type {(inputs: Appearance_Language_EnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`English`)
};

export const appearance_language_heading = /** @type {(inputs: Appearance_Language_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Language`)
};

export const appearance_language_label = /** @type {(inputs: Appearance_Language_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Language: ${i?.name}`)
};

export const appearance_scheme_default = /** @type {(inputs: Appearance_Scheme_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Default`)
};

export const appearance_scheme_heading = /** @type {(inputs: Appearance_Scheme_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Colour scheme`)
};

export const appearance_scheme_label = /** @type {(inputs: Appearance_Scheme_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Colour scheme: ${i?.name}`)
};

export const appearance_theme_dark = /** @type {(inputs: Appearance_Theme_DarkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dark`)
};

export const appearance_theme_heading = /** @type {(inputs: Appearance_Theme_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Theme`)
};

export const appearance_theme_label = /** @type {(inputs: Appearance_Theme_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Theme: ${i?.current}. Switch to ${i?.next}`)
};

export const appearance_theme_light = /** @type {(inputs: Appearance_Theme_LightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Light`)
};

export const appearance_theme_system = /** @type {(inputs: Appearance_Theme_SystemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`System`)
};

export const aside_bookmark_add = /** @type {(inputs: Aside_Bookmark_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bookmark this page`)
};

export const aside_bookmark_list = /** @type {(inputs: Aside_Bookmark_ListInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`List`)
};

export const aside_bookmark_record = /** @type {(inputs: Aside_Bookmark_RecordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Record`)
};

export const aside_bookmark_remove = /** @type {(inputs: Aside_Bookmark_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remove this page from bookmarks`)
};

export const aside_bookmark_screen = /** @type {(inputs: Aside_Bookmark_ScreenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Screen`)
};

export const aside_bookmark_settings = /** @type {(inputs: Aside_Bookmark_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Settings`)
};

export const aside_bookmarks = /** @type {(inputs: Aside_BookmarksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bookmarks`)
};

export const aside_bookmarks_empty = /** @type {(inputs: Aside_Bookmarks_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Press the star to keep a page here`)
};

export const aside_caught_up = /** @type {(inputs: Aside_Caught_UpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`You're all caught up`)
};

export const aside_loading = /** @type {(inputs: Aside_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Loading…`)
};

export const aside_notification_read = /** @type {(inputs: Aside_Notification_ReadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Read`)
};

export const aside_notifications = /** @type {(inputs: Aside_NotificationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Notifications`)
};

export const aside_notifications_unread = /** @type {(inputs: Aside_Notifications_UnreadInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Notifications (${i?.count})`)
};

export const aside_tour_done = /** @type {(inputs: Aside_Tour_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Done`)
};

export const aside_tour_steps = /** @type {(inputs: Aside_Tour_StepsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} step`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} steps`)
};

export const aside_tours = /** @type {(inputs: Aside_ToursInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tours`)
};

export const aside_widgets = /** @type {(inputs: Aside_WidgetsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Widgets`)
};

export const ask_ask = /** @type {(inputs: Ask_AskInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ask`)
};

export const ask_assistant = /** @type {(inputs: Ask_AssistantInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Assistant`)
};

export const ask_placeholder = /** @type {(inputs: Ask_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ask a question…`)
};

export const ask_question = /** @type {(inputs: Ask_QuestionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Question`)
};

export const ask_reading = /** @type {(inputs: Ask_ReadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reading`)
};

export const ask_reading_records = /** @type {(inputs: Ask_Reading_RecordsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reading the records…`)
};

export const ask_sources = /** @type {(inputs: Ask_SourcesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sources:`)
};

export const ask_you = /** @type {(inputs: Ask_YouInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`You`)
};

export const assist_catch_me_up = /** @type {(inputs: Assist_Catch_Me_UpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Catch me up`)
};

export const assist_check_again = /** @type {(inputs: Assist_Check_AgainInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Check again`)
};

export const assist_check_with_ai = /** @type {(inputs: Assist_Check_With_AiInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Check with AI`)
};

export const assist_checked_heading = /** @type {(inputs: Assist_Checked_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Checked on this device — a person decides`)
};

export const assist_checking = /** @type {(inputs: Assist_CheckingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Checking…`)
};

export const assist_classified = /** @type {(inputs: Assist_ClassifiedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.label}: ${i?.category}`)
};

export const assist_copied = /** @type {(inputs: Assist_CopiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copied`)
};

export const assist_dictate = /** @type {(inputs: Assist_DictateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dictate`)
};

export const assist_downloading = /** @type {(inputs: Assist_DownloadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Getting the on-device model… ${i?.percent}`)
};

export const assist_drafted = /** @type {(inputs: Assist_DraftedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Drafted`)
};

export const assist_drafting = /** @type {(inputs: Assist_DraftingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Drafting…`)
};

export const assist_error_failed = /** @type {(inputs: Assist_Error_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The on-device model couldn't do this.`)
};

export const assist_fill_from_text = /** @type {(inputs: Assist_Fill_From_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fill from text`)
};

export const assist_fixes = /** @type {(inputs: Assist_FixesInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} fix`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} fixes`)
};

export const assist_flag_note = /** @type {(inputs: Assist_Flag_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.note} Spotted on this device — it can be wrong.`)
};

export const assist_found_heading = /** @type {(inputs: Assist_Found_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Found on this device — check before using`)
};

export const assist_heard_from = /** @type {(inputs: Assist_Heard_FromInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Heard from ${i?.name} · on this device — check it`)
};

export const assist_hide_summary = /** @type {(inputs: Assist_Hide_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hide summary`)
};

export const assist_key_points_heading = /** @type {(inputs: Assist_Key_Points_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Key points · on this device`)
};

export const assist_listening = /** @type {(inputs: Assist_ListeningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Listening…`)
};

export const assist_looks_like = /** @type {(inputs: Assist_Looks_LikeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Looks like`)
};

export const assist_made_firmer = /** @type {(inputs: Assist_Made_FirmerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Made firmer`)
};

export const assist_made_formal = /** @type {(inputs: Assist_Made_FormalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Made more formal`)
};

export const assist_made_friendlier = /** @type {(inputs: Assist_Made_FriendlierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Made friendlier`)
};

export const assist_no_fixes = /** @type {(inputs: Assist_No_FixesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No fixes needed`)
};

export const assist_no_microphone = /** @type {(inputs: Assist_No_MicrophoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The microphone isn't available (check the browser's permission).`)
};

export const assist_not_found = /** @type {(inputs: Assist_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`not found`)
};

export const assist_other_replies = /** @type {(inputs: Assist_Other_RepliesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Other replies`)
};

export const assist_paste_placeholder = /** @type {(inputs: Assist_Paste_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paste the message here…`)
};

export const assist_proofreading = /** @type {(inputs: Assist_ProofreadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Proofreading…`)
};

export const assist_read_aloud = /** @type {(inputs: Assist_Read_AloudInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Read aloud`)
};

export const assist_read_file = /** @type {(inputs: Assist_Read_FileInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Read a photo or voice note`)
};

export const assist_read_from = /** @type {(inputs: Assist_Read_FromInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Read from ${i?.name} · on this device — check it`)
};

export const assist_reading = /** @type {(inputs: Assist_ReadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reading…`)
};

export const assist_reading_photo = /** @type {(inputs: Assist_Reading_PhotoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reading the photo…`)
};

export const assist_rewriting = /** @type {(inputs: Assist_RewritingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rewriting…`)
};

export const assist_shortened = /** @type {(inputs: Assist_ShortenedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Shortened`)
};

export const assist_shortening = /** @type {(inputs: Assist_ShorteningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Shortening…`)
};

export const assist_show_original = /** @type {(inputs: Assist_Show_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Show original`)
};

export const assist_stop = /** @type {(inputs: Assist_StopInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stop`)
};

export const assist_stop_dictating = /** @type {(inputs: Assist_Stop_DictatingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stop and write it down`)
};

export const assist_suggest_category = /** @type {(inputs: Assist_Suggest_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suggest a category`)
};

export const assist_suggest_replies = /** @type {(inputs: Assist_Suggest_RepliesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suggest replies`)
};

export const assist_summarised_on_device = /** @type {(inputs: Assist_Summarised_On_DeviceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Summarised on this device`)
};

export const assist_summary_heading = /** @type {(inputs: Assist_Summary_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Summary · on this device`)
};

export const assist_tool_draft = /** @type {(inputs: Assist_Tool_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Draft with AI`)
};

export const assist_tool_firm = /** @type {(inputs: Assist_Tool_FirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Firmer`)
};

export const assist_tool_formal = /** @type {(inputs: Assist_Tool_FormalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`More formal`)
};

export const assist_tool_friendly = /** @type {(inputs: Assist_Tool_FriendlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Friendlier`)
};

export const assist_tool_proofread = /** @type {(inputs: Assist_Tool_ProofreadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Proofread`)
};

export const assist_tool_shorter = /** @type {(inputs: Assist_Tool_ShorterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Shorter`)
};

export const assist_tool_translate = /** @type {(inputs: Assist_Tool_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translate`)
};

export const assist_translate_to = /** @type {(inputs: Assist_Translate_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Translate to ${i?.language}`)
};

export const assist_translated_note = /** @type {(inputs: Assist_Translated_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translated on this device — check names and figures against the original.`)
};

export const assist_translated_to = /** @type {(inputs: Assist_Translated_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Translated to ${i?.language}`)
};

export const assist_translating = /** @type {(inputs: Assist_TranslatingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translating…`)
};

export const assist_translating_to = /** @type {(inputs: Assist_Translating_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Translating to ${i?.language}…`)
};

export const assist_undo = /** @type {(inputs: Assist_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Undo`)
};

export const assist_use_these = /** @type {(inputs: Assist_Use_TheseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Use these`)
};

export const assist_use_this = /** @type {(inputs: Assist_Use_ThisInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Use this`)
};

export const assist_writing_down = /** @type {(inputs: Assist_Writing_DownInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Writing it down…`)
};

export const assist_writing_replies = /** @type {(inputs: Assist_Writing_RepliesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Writing replies…`)
};

export const auth_account_created = /** @type {(inputs: Auth_Account_CreatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Account created.`)
};

export const auth_ai_download = /** @type {(inputs: Auth_Ai_DownloadInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Download (${i?.size})`)
};

export const auth_ai_download_body = /** @type {(inputs: Auth_Ai_Download_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`It works in any browser. It is slower and reads text only.`)
};

export const auth_ai_download_title = /** @type {(inputs: Auth_Ai_Download_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Or download a model`)
};

export const auth_ai_flags = /** @type {(inputs: Auth_Ai_FlagsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`In desktop Chrome, open ${i?.url}, enable these flags, then click Relaunch:`)
};

export const auth_ai_flags_more = /** @type {(inputs: Auth_Ai_Flags_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Also enable the Summarization, Writer, Rewriter, Proofreader, Translation and Language Detection APIs. For the first flag, choose "Enabled BypassPerfRequirement".`)
};

export const auth_ai_heading = /** @type {(inputs: Auth_Ai_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Turn on AI features`)
};

export const auth_ai_loading = /** @type {(inputs: Auth_Ai_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Loading…`)
};

export const auth_ai_local_on = /** @type {(inputs: Auth_Ai_Local_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This browser uses the downloaded model.`)
};

export const auth_ai_native_on = /** @type {(inputs: Auth_Ai_Native_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Chrome's on-device AI is on in this browser.`)
};

export const auth_ai_native_title = /** @type {(inputs: Auth_Ai_Native_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Switch on Chrome's on-device AI`)
};

export const auth_ai_recommended = /** @type {(inputs: Auth_Ai_RecommendedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Recommended`)
};

export const auth_change = /** @type {(inputs: Auth_ChangeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Change`)
};

export const auth_code_label = /** @type {(inputs: Auth_Code_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Authenticator code`)
};

export const auth_code_prompt = /** @type {(inputs: Auth_Code_PromptInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Enter the ${i?.length}-digit code from your authenticator app.`)
};

export const auth_continue = /** @type {(inputs: Auth_ContinueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Continue`)
};

export const auth_create = /** @type {(inputs: Auth_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create`)
};

export const auth_demo_note = /** @type {(inputs: Auth_Demo_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Demo: any ${i?.length}-digit code works, and the passkey prompt is simulated.`)
};

export const auth_email = /** @type {(inputs: Auth_EmailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Email`)
};

export const auth_first_user_heading = /** @type {(inputs: Auth_First_User_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create the first user`)
};

export const auth_first_user_intro = /** @type {(inputs: Auth_First_User_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The mock backend has no users yet.`)
};

export const auth_log_in = /** @type {(inputs: Auth_Log_InInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Log in`)
};

export const auth_login_intro = /** @type {(inputs: Auth_Login_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A demo user is filled in; switch roles any time from the dashboard.`)
};

export const auth_or = /** @type {(inputs: Auth_OrInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`or`)
};

export const auth_passkey_use = /** @type {(inputs: Auth_Passkey_UseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Use a passkey`)
};

export const auth_passkey_waiting = /** @type {(inputs: Auth_Passkey_WaitingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Waiting for your device…`)
};

export const auth_password_required = /** @type {(inputs: Auth_Password_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Password *`)
};

export const auth_signing_in_as = /** @type {(inputs: Auth_Signing_In_AsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signing in as`)
};

export const auth_verify_and_log_in = /** @type {(inputs: Auth_Verify_And_Log_InInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verify and log in`)
};

export const auth_verify_heading = /** @type {(inputs: Auth_Verify_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verify it's you`)
};

export const auth_verifying = /** @type {(inputs: Auth_VerifyingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verifying…`)
};

export const auth_welcome_back = /** @type {(inputs: Auth_Welcome_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Welcome back.`)
};

export const avatar_more = /** @type {(inputs: Avatar_MoreInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} more`)
};

export const badge_status = /** @type {(inputs: Badge_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Status`)
};

export const breadcrumbs_label = /** @type {(inputs: Breadcrumbs_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Breadcrumb`)
};

export const bullet_band = /** @type {(inputs: Bullet_BandInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.quality}: ${i?.low}–${i?.high} · ${i?.reading}`)
};

export const bullet_label = /** @type {(inputs: Bullet_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bullet graph`)
};

export const bullet_quality_good = /** @type {(inputs: Bullet_Quality_GoodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Good`)
};

export const bullet_quality_ok = /** @type {(inputs: Bullet_Quality_OkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`OK`)
};

export const bullet_quality_poor = /** @type {(inputs: Bullet_Quality_PoorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Poor`)
};

export const bullet_reading_of = /** @type {(inputs: Bullet_Reading_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} of ${i?.target}`)
};

export const bullet_reading_range = /** @type {(inputs: Bullet_Reading_RangeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} · ${i?.share} of ${i?.max}`)
};

export const bullet_reading_target = /** @type {(inputs: Bullet_Reading_TargetInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} of ${i?.target} · ${i?.share} of target`)
};

export const bullet_target = /** @type {(inputs: Bullet_TargetInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Target ${i?.target}`)
};

export const chart_range = /** @type {(inputs: Chart_RangeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Range`)
};

export const chart_series = /** @type {(inputs: Chart_SeriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Series`)
};

export const chart_target = /** @type {(inputs: Chart_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Target`)
};

export const chart_total = /** @type {(inputs: Chart_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Total`)
};

export const chip_remove = /** @type {(inputs: Chip_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remove`)
};

export const coachmark_back = /** @type {(inputs: Coachmark_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Back`)
};

export const coachmark_close = /** @type {(inputs: Coachmark_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Close`)
};

export const coachmark_finish = /** @type {(inputs: Coachmark_FinishInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Finish`)
};

export const coachmark_label = /** @type {(inputs: Coachmark_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Guided tour`)
};

export const coachmark_next = /** @type {(inputs: Coachmark_NextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next`)
};

export const coachmark_skip = /** @type {(inputs: Coachmark_SkipInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Skip`)
};

export const coachmark_step = /** @type {(inputs: Coachmark_StepInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Step ${i?.step} of ${i?.total}`)
};

export const column_picker_columns = /** @type {(inputs: Column_Picker_ColumnsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Columns`)
};

export const column_picker_density_compact = /** @type {(inputs: Column_Picker_Density_CompactInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Compact`)
};

export const column_picker_density_default = /** @type {(inputs: Column_Picker_Density_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Default`)
};

export const column_picker_density_dense = /** @type {(inputs: Column_Picker_Density_DenseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dense`)
};

export const column_picker_label = /** @type {(inputs: Column_Picker_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Columns (${i?.shown} of ${i?.total} shown)`)
};

export const column_picker_move_earlier = /** @type {(inputs: Column_Picker_Move_EarlierInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Move ${i?.name} earlier`)
};

export const column_picker_move_later = /** @type {(inputs: Column_Picker_Move_LaterInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Move ${i?.name} later`)
};

export const column_picker_reset = /** @type {(inputs: Column_Picker_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reset`)
};

export const column_picker_row_height = /** @type {(inputs: Column_Picker_Row_HeightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Row height`)
};

export const combobox_add = /** @type {(inputs: Combobox_AddInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Add “${i?.value}”`)
};

export const combobox_choose = /** @type {(inputs: Combobox_ChooseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose…`)
};

export const combobox_clear = /** @type {(inputs: Combobox_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clear`)
};

export const combobox_no_matches = /** @type {(inputs: Combobox_No_MatchesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No matches`)
};

export const combobox_nothing = /** @type {(inputs: Combobox_NothingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing to choose from`)
};

export const combobox_remove = /** @type {(inputs: Combobox_RemoveInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Remove ${i?.value}`)
};

export const combobox_type_to_add = /** @type {(inputs: Combobox_Type_To_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Type to add`)
};

export const command_account_description = /** @type {(inputs: Command_Account_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your profile and password`)
};

export const command_bookmark_add = /** @type {(inputs: Command_Bookmark_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bookmark this page`)
};

export const command_bookmark_description = /** @type {(inputs: Command_Bookmark_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bookmarks are listed in the side panel`)
};

export const command_bookmark_keywords = /** @type {(inputs: Command_Bookmark_KeywordsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`bookmark, pin`)
};

export const command_bookmark_remove = /** @type {(inputs: Command_Bookmark_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remove this page from bookmarks`)
};

export const command_collection_all = /** @type {(inputs: Command_Collection_AllInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`All ${i?.plural}`)
};

export const command_contrast_description = /** @type {(inputs: Command_Contrast_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Outline text that fails WCAG AA contrast, and anything that overflows or is squeezed at this width`)
};

export const command_contrast_keywords = /** @type {(inputs: Command_Contrast_KeywordsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`accessibility, contrast, layout`)
};

export const command_contrast_title = /** @type {(inputs: Command_Contrast_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Check contrast and layout`)
};

export const command_create_description = /** @type {(inputs: Command_Create_DescriptionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Open a blank ${i?.singular} form`)
};

export const command_create_keywords = /** @type {(inputs: Command_Create_KeywordsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`add, new`)
};

export const command_create_title = /** @type {(inputs: Command_Create_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Create new ${i?.singular}`)
};

export const command_dashboard_description = /** @type {(inputs: Command_Dashboard_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your day, KPIs and charts`)
};

export const command_dashboard_keywords = /** @type {(inputs: Command_Dashboard_KeywordsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`overview, home`)
};

export const command_group_accessibility = /** @type {(inputs: Command_Group_AccessibilityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Accessibility`)
};

export const command_group_configuration = /** @type {(inputs: Command_Group_ConfigurationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Configuration`)
};

export const command_group_you = /** @type {(inputs: Command_Group_YouInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`You`)
};

export const command_input_label = /** @type {(inputs: Command_Input_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Search actions, pages and records…`)
};

export const command_launcher_label = /** @type {(inputs: Command_Launcher_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Search actions, pages, records…`)
};

export const command_logout_keywords = /** @type {(inputs: Command_Logout_KeywordsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`log out, sign out`)
};

export const command_navigate = /** @type {(inputs: Command_NavigateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Navigate`)
};

export const command_no_results = /** @type {(inputs: Command_No_ResultsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`No results for “${i?.query}”`)
};

export const command_no_results_hint = /** @type {(inputs: Command_No_Results_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Try other words — search understands related terms too.`)
};

export const command_open = /** @type {(inputs: Command_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open`)
};

export const command_related = /** @type {(inputs: Command_RelatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`related`)
};

export const command_results = /** @type {(inputs: Command_ResultsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} result · fuzzy + semantic`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} results · fuzzy + semantic`)
};

export const command_section_actions = /** @type {(inputs: Command_Section_ActionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Actions`)
};

export const command_section_pages = /** @type {(inputs: Command_Section_PagesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pages`)
};

export const command_section_records = /** @type {(inputs: Command_Section_RecordsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Records`)
};

export const command_suggest_actions = /** @type {(inputs: Command_Suggest_ActionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quick actions`)
};

export const command_suggest_pages = /** @type {(inputs: Command_Suggest_PagesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Go to`)
};

export const command_this_page = /** @type {(inputs: Command_This_PageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This page`)
};

export const command_type_to_search = /** @type {(inputs: Command_Type_To_SearchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Type to search · fuzzy + semantic`)
};

export const confirmation_allow = /** @type {(inputs: Confirmation_AllowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Allow`)
};

export const confirmation_allowed = /** @type {(inputs: Confirmation_AllowedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Allowed`)
};

export const confirmation_deny = /** @type {(inputs: Confirmation_DenyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Don’t`)
};

export const confirmation_label = /** @type {(inputs: Confirmation_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirmation`)
};

export const confirmation_not_allowed = /** @type {(inputs: Confirmation_Not_AllowedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not allowed`)
};

export const contrast_audit_close = /** @type {(inputs: Contrast_Audit_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Close`)
};

export const contrast_audit_fails = /** @type {(inputs: Contrast_Audit_FailsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} text element fails WCAG AA`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} text elements fail WCAG AA`)
};

export const contrast_audit_fails_over_image = /** @type {(inputs: Contrast_Audit_Fails_Over_ImageInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} text element fails WCAG AA · ${i?.overImage} over the background image`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} text elements fail WCAG AA · ${i?.overImage} over the background image`)
};

export const contrast_audit_filled = /** @type {(inputs: Contrast_Audit_FilledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`filled`)
};

export const contrast_audit_filled_hint = /** @type {(inputs: Contrast_Audit_Filled_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A filled button: keep one or two per screen`)
};

export const contrast_audit_filled_on_dialog = /** @type {(inputs: Contrast_Audit_Filled_On_DialogInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} filled button on a dialog`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} filled buttons on a dialog`)
};

export const contrast_audit_filled_on_page = /** @type {(inputs: Contrast_Audit_Filled_On_PageInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} filled button on the page`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} filled buttons on the page`)
};

export const contrast_audit_issue = /** @type {(inputs: Contrast_Audit_IssueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.color} on ${i?.background} — needs ${i?.required}:1`)
};

export const contrast_audit_kind_cramped = /** @type {(inputs: Contrast_Audit_Kind_CrampedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`cramped`)
};

export const contrast_audit_kind_escapes = /** @type {(inputs: Contrast_Audit_Kind_EscapesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`escapes`)
};

export const contrast_audit_kind_page_scroll = /** @type {(inputs: Contrast_Audit_Kind_Page_ScrollInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`page-scroll`)
};

export const contrast_audit_kind_squeezed = /** @type {(inputs: Contrast_Audit_Kind_SqueezedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`squeezed`)
};

export const contrast_audit_layout = /** @type {(inputs: Contrast_Audit_LayoutInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} layout problem at ${i?.px}px: let it wrap or shrink.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} layout problems at ${i?.px}px: let it wrap or shrink.`)
};

export const contrast_audit_passes = /** @type {(inputs: Contrast_Audit_PassesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Everything on screen passes WCAG AA (4.5:1, large text 3:1).`)
};

export const contrast_audit_prominence = /** @type {(inputs: Contrast_Audit_ProminenceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.places}: keep one or two, make the rest tonal (variant="soft").`)
};

export const contrast_audit_ratio = /** @type {(inputs: Contrast_Audit_RatioInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.ratio}:1`)
};

export const contrast_audit_rerun = /** @type {(inputs: Contrast_Audit_RerunInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Re-run`)
};

export const contrast_audit_title = /** @type {(inputs: Contrast_Audit_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Contrast audit`)
};

export const countdown_due_now = /** @type {(inputs: Countdown_Due_NowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`due now`)
};

export const countdown_just_overdue = /** @type {(inputs: Countdown_Just_OverdueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`just overdue`)
};

export const countdown_left_days = /** @type {(inputs: Countdown_Left_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.days} d left`)
};

export const countdown_left_days_hours = /** @type {(inputs: Countdown_Left_Days_HoursInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.days} d ${i?.hours} h left`)
};

export const countdown_left_hours = /** @type {(inputs: Countdown_Left_HoursInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.hours} h left`)
};

export const countdown_left_hours_minutes = /** @type {(inputs: Countdown_Left_Hours_MinutesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.hours} h ${i?.minutes} min left`)
};

export const countdown_left_minutes = /** @type {(inputs: Countdown_Left_MinutesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.minutes} min left`)
};

export const countdown_overdue = /** @type {(inputs: Countdown_OverdueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.what} is overdue.`)
};

export const countdown_overdue_days = /** @type {(inputs: Countdown_Overdue_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`overdue ${i?.days} d`)
};

export const countdown_overdue_hours = /** @type {(inputs: Countdown_Overdue_HoursInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`overdue ${i?.hours} h`)
};

export const countdown_overdue_minutes = /** @type {(inputs: Countdown_Overdue_MinutesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`overdue ${i?.minutes} min`)
};

export const countdown_under_a_minute = /** @type {(inputs: Countdown_Under_A_MinuteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`under 1 min left`)
};

export const date_input_clear = /** @type {(inputs: Date_Input_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clear`)
};

export const date_input_in_a_week = /** @type {(inputs: Date_Input_In_A_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`In a week`)
};

export const date_input_picks = /** @type {(inputs: Date_Input_PicksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quick picks`)
};

export const date_input_picks_for = /** @type {(inputs: Date_Input_Picks_ForInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Quick picks for ${i?.label}`)
};

export const date_input_said = /** @type {(inputs: Date_Input_SaidInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.date} · ${i?.relative}`)
};

export const date_input_said_time = /** @type {(inputs: Date_Input_Said_TimeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.date} ${i?.time} · ${i?.relative}`)
};

export const date_input_today = /** @type {(inputs: Date_Input_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Today`)
};

export const date_input_tomorrow = /** @type {(inputs: Date_Input_TomorrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tomorrow`)
};

export const dial_label = /** @type {(inputs: Dial_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dial`)
};

export const dial_range = /** @type {(inputs: Dial_RangeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.low}–${i?.high}`)
};

export const dial_reading = /** @type {(inputs: Dial_ReadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} · ${i?.share} of ${i?.min}–${i?.max}`)
};

export const dial_zone = /** @type {(inputs: Dial_ZoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.zone}: ${i?.low}–${i?.high}`)
};

export const doc_form_add_block = /** @type {(inputs: Doc_Form_Add_BlockInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`+ Add block`)
};

export const doc_form_add_named = /** @type {(inputs: Doc_Form_Add_NamedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`+ Add ${i?.name}`)
};

export const doc_form_block_name = /** @type {(inputs: Doc_Form_Block_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Name`)
};

export const doc_form_choose = /** @type {(inputs: Doc_Form_ChooseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose…`)
};

export const doc_form_collapse_all = /** @type {(inputs: Doc_Form_Collapse_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Collapse all`)
};

export const doc_form_collapse_row = /** @type {(inputs: Doc_Form_Collapse_RowInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Collapse ${i?.kind} ${i?.number}`)
};

export const doc_form_create_new = /** @type {(inputs: Doc_Form_Create_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`+ Create new`)
};

export const doc_form_details = /** @type {(inputs: Doc_Form_DetailsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Details`)
};

export const doc_form_duplicate = /** @type {(inputs: Doc_Form_DuplicateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Duplicate`)
};

export const doc_form_errors = /** @type {(inputs: Doc_Form_ErrorsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} error`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} errors`)
};

export const doc_form_expand_all = /** @type {(inputs: Doc_Form_Expand_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expand all`)
};

export const doc_form_expand_row = /** @type {(inputs: Doc_Form_Expand_RowInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Expand ${i?.kind} ${i?.number}`)
};

export const doc_form_join_showing = /** @type {(inputs: Doc_Form_Join_ShowingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Showing ${i?.shown} of ${i?.total}.`)
};

export const doc_form_json_invalid = /** @type {(inputs: Doc_Form_Json_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not valid JSON yet; it's saved once it is.`)
};

export const doc_form_latitude = /** @type {(inputs: Doc_Form_LatitudeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Latitude`)
};

export const doc_form_longitude = /** @type {(inputs: Doc_Form_LongitudeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Longitude`)
};

export const doc_form_move_down = /** @type {(inputs: Doc_Form_Move_DownInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Move down`)
};

export const doc_form_move_up = /** @type {(inputs: Doc_Form_Move_UpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Move up`)
};

export const doc_form_new = /** @type {(inputs: Doc_Form_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`+ New`)
};

export const doc_form_no = /** @type {(inputs: Doc_Form_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No`)
};

export const doc_form_none_yet = /** @type {(inputs: Doc_Form_None_YetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`None yet.`)
};

export const doc_form_open = /** @type {(inputs: Doc_Form_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open`)
};

export const doc_form_optional = /** @type {(inputs: Doc_Form_OptionalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Optional`)
};

export const doc_form_remove = /** @type {(inputs: Doc_Form_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remove`)
};

export const doc_form_row = /** @type {(inputs: Doc_Form_RowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Row`)
};

export const doc_form_row_actions = /** @type {(inputs: Doc_Form_Row_ActionsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.kind} ${i?.number} actions`)
};

export const doc_form_row_title = /** @type {(inputs: Doc_Form_Row_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.kind} ${i?.number}`)
};

export const doc_form_rows_at_least = /** @type {(inputs: Doc_Form_Rows_At_LeastInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`at least ${i?.min}`)
};

export const doc_form_rows_empty = /** @type {(inputs: Doc_Form_Rows_EmptyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`No ${i?.items} yet.`)
};

export const doc_form_rows_max = /** @type {(inputs: Doc_Form_Rows_MaxInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`The most ${i?.items} allowed is ${i?.max}.`)
};

export const doc_form_rows_up_to = /** @type {(inputs: Doc_Form_Rows_Up_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`up to ${i?.max}`)
};

export const doc_form_suggest_failed = /** @type {(inputs: Doc_Form_Suggest_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The AI couldn't suggest an answer this time. Try again in a moment.`)
};

export const doc_form_suggest_nothing = /** @type {(inputs: Doc_Form_Suggest_NothingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing on the form points to an answer yet. Fill in more and try again.`)
};

export const doc_form_tab_errors = /** @type {(inputs: Doc_Form_Tab_ErrorsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.label} · ${__paraglideRegistry.icuPound("en", i?.count, {})} error`);
	return /** @type {LocalizedString} */ (`${i?.label} · ${__paraglideRegistry.icuPound("en", i?.count, {})} errors`)
};

export const doc_form_type_enter = /** @type {(inputs: Doc_Form_Type_EnterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Type and press Enter`)
};

export const doc_form_type_number_enter = /** @type {(inputs: Doc_Form_Type_Number_EnterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Type a number and press Enter`)
};

export const doc_form_unit_days = /** @type {(inputs: Doc_Form_Unit_DaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`days`)
};

export const doc_form_unsupported = /** @type {(inputs: Doc_Form_UnsupportedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.label}: unsupported field type "${i?.type}"`)
};

export const doc_form_yes = /** @type {(inputs: Doc_Form_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Yes`)
};

export const dropdown_more_info = /** @type {(inputs: Dropdown_More_InfoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`More info`)
};

export const edit_view_account = /** @type {(inputs: Edit_View_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Account`)
};

export const edit_view_cannot_undo = /** @type {(inputs: Edit_View_Cannot_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This can't be undone.`)
};

export const edit_view_create = /** @type {(inputs: Edit_View_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create`)
};

export const edit_view_create_title = /** @type {(inputs: Edit_View_Create_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Create new ${i?.what}`)
};

export const edit_view_created = /** @type {(inputs: Edit_View_CreatedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Created ${i?.date}`)
};

export const edit_view_dashboard = /** @type {(inputs: Edit_View_DashboardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dashboard`)
};

export const edit_view_delete = /** @type {(inputs: Edit_View_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete`)
};

export const edit_view_delete_confirm = /** @type {(inputs: Edit_View_Delete_ConfirmInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Delete ${i?.what}?`)
};

export const edit_view_details = /** @type {(inputs: Edit_View_DetailsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Details`)
};

export const edit_view_file_required = /** @type {(inputs: Edit_View_File_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`File *`)
};

export const edit_view_id = /** @type {(inputs: Edit_View_IdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ID`)
};

export const edit_view_link = /** @type {(inputs: Edit_View_LinkInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.field}: ${i?.name}`)
};

export const edit_view_new_password = /** @type {(inputs: Edit_View_New_PasswordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New password`)
};

export const edit_view_new_title = /** @type {(inputs: Edit_View_New_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`New ${i?.what}`)
};

export const edit_view_not_found = /** @type {(inputs: Edit_View_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not found`)
};

export const edit_view_not_found_body = /** @type {(inputs: Edit_View_Not_Found_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This document doesn't exist or you can't read it.`)
};

export const edit_view_password_hint = /** @type {(inputs: Edit_View_Password_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Leave empty to keep the current password.`)
};

export const edit_view_password_required = /** @type {(inputs: Edit_View_Password_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Password *`)
};

export const edit_view_problem = /** @type {(inputs: Edit_View_ProblemInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.field}: ${i?.message}`)
};

export const edit_view_problems = /** @type {(inputs: Edit_View_ProblemsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} field needs attention`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} fields need attention`)
};

export const edit_view_read_only = /** @type {(inputs: Edit_View_Read_OnlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Read only`)
};

export const edit_view_replace_file = /** @type {(inputs: Edit_View_Replace_FileInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Replace file`)
};

export const edit_view_save = /** @type {(inputs: Edit_View_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Save`)
};

export const edit_view_save_shortcut = /** @type {(inputs: Edit_View_Save_ShortcutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ctrl + S`)
};

export const edit_view_saved = /** @type {(inputs: Edit_View_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saved`)
};

export const edit_view_saving = /** @type {(inputs: Edit_View_SavingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saving…`)
};

export const edit_view_screen_loading = /** @type {(inputs: Edit_View_Screen_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This screen is loading.`)
};

export const edit_view_sections = /** @type {(inputs: Edit_View_SectionsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.what} sections`)
};

export const edit_view_setting = /** @type {(inputs: Edit_View_SettingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Setting`)
};

export const edit_view_unsaved = /** @type {(inputs: Edit_View_UnsavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unsaved changes`)
};

export const edit_view_updated = /** @type {(inputs: Edit_View_UpdatedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Updated ${i?.date}`)
};

export const empty_state_loading = /** @type {(inputs: Empty_State_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Loading`)
};

export const fab_close = /** @type {(inputs: Fab_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Close`)
};

export const field_about = /** @type {(inputs: Field_AboutInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`About ${i?.label}`)
};

export const field_about_this = /** @type {(inputs: Field_About_ThisInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`About this field`)
};

export const field_count_of = /** @type {(inputs: Field_Count_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} / ${i?.max}`)
};

export const field_error_at_least_one = /** @type {(inputs: Field_Error_At_Least_OneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add at least one.`)
};

export const field_error_check = /** @type {(inputs: Field_Error_CheckInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Check this value.`)
};

export const field_error_date = /** @type {(inputs: Field_Error_DateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pick a date.`)
};

export const field_error_email = /** @type {(inputs: Field_Error_EmailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`An email address, like name@company.com.`)
};

export const field_error_max = /** @type {(inputs: Field_Error_MaxInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.max} or less.`)
};

export const field_error_max_length = /** @type {(inputs: Field_Error_Max_LengthInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`At most ${__paraglideRegistry.icuPound("en", i?.count, {})} character.`);
	return /** @type {LocalizedString} */ (`At most ${__paraglideRegistry.icuPound("en", i?.count, {})} characters.`)
};

export const field_error_max_rows = /** @type {(inputs: Field_Error_Max_RowsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`At most ${__paraglideRegistry.icuPound("en", i?.count, {})} row.`);
	return /** @type {LocalizedString} */ (`At most ${__paraglideRegistry.icuPound("en", i?.count, {})} rows.`)
};

export const field_error_min = /** @type {(inputs: Field_Error_MinInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.min} or more.`)
};

export const field_error_min_length = /** @type {(inputs: Field_Error_Min_LengthInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`At least ${__paraglideRegistry.icuPound("en", i?.count, {})} character.`);
	return /** @type {LocalizedString} */ (`At least ${__paraglideRegistry.icuPound("en", i?.count, {})} characters.`)
};

export const field_error_min_rows = /** @type {(inputs: Field_Error_Min_RowsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`At least ${__paraglideRegistry.icuPound("en", i?.count, {})} row.`);
	return /** @type {LocalizedString} */ (`At least ${__paraglideRegistry.icuPound("en", i?.count, {})} rows.`)
};

export const field_error_number = /** @type {(inputs: Field_Error_NumberInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A number.`)
};

export const field_error_option = /** @type {(inputs: Field_Error_OptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pick one of the options.`)
};

export const field_error_required = /** @type {(inputs: Field_Error_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fill this in to save.`)
};

export const field_error_text = /** @type {(inputs: Field_Error_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Text only.`)
};

export const field_required_pill = /** @type {(inputs: Field_Required_PillInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Required`)
};

export const field_suggest = /** @type {(inputs: Field_SuggestInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Suggest ${i?.label}`)
};

export const field_suggest_answer = /** @type {(inputs: Field_Suggest_AnswerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suggest an answer`)
};

export const field_suggestion_dismiss = /** @type {(inputs: Field_Suggestion_DismissInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dismiss the suggestion`)
};

export const field_suggestion_use = /** @type {(inputs: Field_Suggestion_UseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Use`)
};

export const field_suggestion_use_label = /** @type {(inputs: Field_Suggestion_Use_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Suggested: ${i?.suggestion}. Use it`)
};

export const filter_builder_add_filter = /** @type {(inputs: Filter_Builder_Add_FilterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add filter`)
};

export const filter_builder_clear = /** @type {(inputs: Filter_Builder_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clear filters`)
};

export const filter_builder_field = /** @type {(inputs: Filter_Builder_FieldInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Field`)
};

export const filter_builder_filter = /** @type {(inputs: Filter_Builder_FilterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filter`)
};

export const filter_builder_is = /** @type {(inputs: Filter_Builder_IsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Is`)
};

export const filter_builder_match = /** @type {(inputs: Filter_Builder_MatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Match`)
};

export const filter_builder_match_all = /** @type {(inputs: Filter_Builder_Match_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`all`)
};

export const filter_builder_match_any = /** @type {(inputs: Filter_Builder_Match_AnyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`any`)
};

export const filter_builder_op_after = /** @type {(inputs: Filter_Builder_Op_AfterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`after`)
};

export const filter_builder_op_any_of = /** @type {(inputs: Filter_Builder_Op_Any_OfInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`is any of`)
};

export const filter_builder_op_before = /** @type {(inputs: Filter_Builder_Op_BeforeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`before`)
};

export const filter_builder_op_contains = /** @type {(inputs: Filter_Builder_Op_ContainsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`contains`)
};

export const filter_builder_op_is = /** @type {(inputs: Filter_Builder_Op_IsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`is`)
};

export const filter_builder_op_is_empty = /** @type {(inputs: Filter_Builder_Op_Is_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`is empty`)
};

export const filter_builder_op_is_not = /** @type {(inputs: Filter_Builder_Op_Is_NotInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`is not`)
};

export const filter_builder_op_is_set = /** @type {(inputs: Filter_Builder_Op_Is_SetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`is set`)
};

export const filter_builder_op_no = /** @type {(inputs: Filter_Builder_Op_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`is no`)
};

export const filter_builder_op_none_of = /** @type {(inputs: Filter_Builder_Op_None_OfInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`is none of`)
};

export const filter_builder_op_not_contains = /** @type {(inputs: Filter_Builder_Op_Not_ContainsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`doesn't contain`)
};

export const filter_builder_op_yes = /** @type {(inputs: Filter_Builder_Op_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`is yes`)
};

export const filter_builder_remove = /** @type {(inputs: Filter_Builder_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remove`)
};

export const filter_builder_remove_filter = /** @type {(inputs: Filter_Builder_Remove_FilterInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Remove filter: ${i?.field}`)
};

export const filter_builder_search_options = /** @type {(inputs: Filter_Builder_Search_OptionsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Search ${i?.field}`)
};

export const filter_builder_update = /** @type {(inputs: Filter_Builder_UpdateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Update`)
};

export const filter_builder_value = /** @type {(inputs: Filter_Builder_ValueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Value`)
};

export const filter_builder_values_more = /** @type {(inputs: Filter_Builder_Values_MoreInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.values} +${i?.count}`)
};

export const frame_collapse = /** @type {(inputs: Frame_CollapseInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Collapse ${i?.what}`)
};

export const frame_drag_to_close = /** @type {(inputs: Frame_Drag_To_CloseInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Drag to close ${i?.what}`)
};

export const frame_drag_to_open = /** @type {(inputs: Frame_Drag_To_OpenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Drag to open ${i?.what}`)
};

export const frame_expand = /** @type {(inputs: Frame_ExpandInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Expand ${i?.what}`)
};

export const frame_resize = /** @type {(inputs: Frame_ResizeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Resize`)
};

export const frame_resize_to_close = /** @type {(inputs: Frame_Resize_To_CloseInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Resize to close ${i?.what}`)
};

export const frame_resize_to_open = /** @type {(inputs: Frame_Resize_To_OpenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Resize to open ${i?.what}`)
};

export const frame_show_icons = /** @type {(inputs: Frame_Show_IconsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Show ${i?.what} icons`)
};

export const funnel_caption = /** @type {(inputs: Funnel_CaptionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.share} of ${i?.from} reach ${i?.to}`)
};

export const funnel_step = /** @type {(inputs: Funnel_StepInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.share} ${i?.step}`)
};

export const funnel_step_went_on = /** @type {(inputs: Funnel_Step_Went_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`went on`)
};

export const gauge_label = /** @type {(inputs: Gauge_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gauge`)
};

export const gauge_value_of = /** @type {(inputs: Gauge_Value_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} of ${i?.max}`)
};

export const heatmap_label = /** @type {(inputs: Heatmap_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Heatmap`)
};

export const heatmap_less = /** @type {(inputs: Heatmap_LessInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Less`)
};

export const heatmap_more = /** @type {(inputs: Heatmap_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`More`)
};

export const kanban_column = /** @type {(inputs: Kanban_ColumnInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.column}, ${__paraglideRegistry.icuPound("en", i?.count, {})} card`);
	return /** @type {LocalizedString} */ (`${i?.column}, ${__paraglideRegistry.icuPound("en", i?.count, {})} cards`)
};

export const kanban_dragging = /** @type {(inputs: Kanban_DraggingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Dragging ${i?.card}. Drop it on a column, or press Escape to cancel.`)
};

export const kanban_moved = /** @type {(inputs: Kanban_MovedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Moved to ${i?.column}.`)
};

export const kanban_not_moved = /** @type {(inputs: Kanban_Not_MovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not moved.`)
};

export const layout_cramped = /** @type {(inputs: Layout_CrampedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.lines} lines in ${i?.px}px`)
};

export const layout_escapes = /** @type {(inputs: Layout_EscapesInputs) => LocalizedString} */ (i) => {
	if (i?.box === "list_row") return /** @type {LocalizedString} */ (`${i?.px}px past its list row`);
	if (i?.box === "card") return /** @type {LocalizedString} */ (`${i?.px}px past its card`);
	if (i?.box === "page") return /** @type {LocalizedString} */ (`${i?.px}px past its page`);
	if (i?.box === "dialog") return /** @type {LocalizedString} */ (`${i?.px}px past its dialog`);
	if (i?.box === "component") return /** @type {LocalizedString} */ (`${i?.px}px past its ${i?.name}`);
	return /** @type {LocalizedString} */ (`${i?.px}px past its box`)
};

export const layout_page_scroll = /** @type {(inputs: Layout_Page_ScrollInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.px}px wider than the page`)
};

export const layout_squeezed = /** @type {(inputs: Layout_SqueezedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`squeezed to ${i?.px}px`)
};

export const list_view_by = /** @type {(inputs: List_View_ByInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.things} by ${i?.field}`)
};

export const list_view_calendar_count = /** @type {(inputs: List_View_Calendar_CountInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} by ${i?.field}`)
};

export const list_view_calendar_label = /** @type {(inputs: List_View_Calendar_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.things} by ${i?.field}, ${i?.month}`)
};

export const list_view_cannot_undo = /** @type {(inputs: List_View_Cannot_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This can't be undone.`)
};

export const list_view_chart_bucket = /** @type {(inputs: List_View_Chart_BucketInputs) => LocalizedString} */ (i) => {
	if (i?.bucket === "month") return /** @type {LocalizedString} */ (`${i?.field}, by month`);
	if (i?.bucket === "week") return /** @type {LocalizedString} */ (`${i?.field}, by week`);
	return /** @type {LocalizedString} */ (`${i?.field}, by day`)
};

export const list_view_clear_filters = /** @type {(inputs: List_View_Clear_FiltersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clear search and filters`)
};

export const list_view_clear_selection = /** @type {(inputs: List_View_Clear_SelectionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clear selection`)
};

export const list_view_count_of = /** @type {(inputs: List_View_Count_OfInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} ${i?.singular}`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} ${i?.plural}`)
};

export const list_view_create_first = /** @type {(inputs: List_View_Create_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Create the first one.`)
};

export const list_view_create_new = /** @type {(inputs: List_View_Create_NewInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`+ Create new ${i?.singular}`)
};

export const list_view_created = /** @type {(inputs: List_View_CreatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Created`)
};

export const list_view_dashboard = /** @type {(inputs: List_View_DashboardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dashboard`)
};

export const list_view_delete = /** @type {(inputs: List_View_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete`)
};

export const list_view_delete_count = /** @type {(inputs: List_View_Delete_CountInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Delete ${i?.count}`)
};

export const list_view_delete_heading = /** @type {(inputs: List_View_Delete_HeadingInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Delete ${__paraglideRegistry.icuPound("en", i?.count, {})} ${i?.singular}?`);
	return /** @type {LocalizedString} */ (`Delete ${__paraglideRegistry.icuPound("en", i?.count, {})} ${i?.plural}?`)
};

export const list_view_discard = /** @type {(inputs: List_View_DiscardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Discard`)
};

export const list_view_discard_heading = /** @type {(inputs: List_View_Discard_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Discard unsaved changes?`)
};

export const list_view_discard_text = /** @type {(inputs: List_View_Discard_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`What you changed in ${i?.title} hasn't been saved.`)
};

export const list_view_empty = /** @type {(inputs: List_View_EmptyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`No ${i?.things} yet`)
};

export const list_view_empty_filtered = /** @type {(inputs: List_View_Empty_FilteredInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`No ${i?.things} match`)
};

export const list_view_export_csv = /** @type {(inputs: List_View_Export_CsvInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Export CSV`)
};

export const list_view_heatmap_label = /** @type {(inputs: List_View_Heatmap_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.things} per day by ${i?.field}`)
};

export const list_view_heatmap_summary = /** @type {(inputs: List_View_Heatmap_SummaryInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.total} ${i?.things} in 12 weeks by ${i?.field}`)
};

export const list_view_id = /** @type {(inputs: List_View_IdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ID`)
};

export const list_view_item = /** @type {(inputs: List_View_ItemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`item`)
};

export const list_view_items = /** @type {(inputs: List_View_ItemsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`items`)
};

export const list_view_keep_editing = /** @type {(inputs: List_View_Keep_EditingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Keep editing`)
};

export const list_view_layout_board = /** @type {(inputs: List_View_Layout_BoardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Board`)
};

export const list_view_layout_calendar = /** @type {(inputs: List_View_Layout_CalendarInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Calendar`)
};

export const list_view_layout_cards = /** @type {(inputs: List_View_Layout_CardsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cards`)
};

export const list_view_layout_chart = /** @type {(inputs: List_View_Layout_ChartInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Chart by ${i?.field}`)
};

export const list_view_layout_compact = /** @type {(inputs: List_View_Layout_CompactInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Compact`)
};

export const list_view_layout_focus = /** @type {(inputs: List_View_Layout_FocusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Focus, one at a time`)
};

export const list_view_layout_groups = /** @type {(inputs: List_View_Layout_GroupsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Grouped by ${i?.field}`)
};

export const list_view_layout_heatmap = /** @type {(inputs: List_View_Layout_HeatmapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Heatmap`)
};

export const list_view_layout_list = /** @type {(inputs: List_View_Layout_ListInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`List`)
};

export const list_view_layout_ranking = /** @type {(inputs: List_View_Layout_RankingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Ranking by ${i?.field}`)
};

export const list_view_layout_scatter = /** @type {(inputs: List_View_Layout_ScatterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Scatter`)
};

export const list_view_layout_table = /** @type {(inputs: List_View_Layout_TableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Table`)
};

export const list_view_layout_timeline = /** @type {(inputs: List_View_Layout_TimelineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Timeline`)
};

export const list_view_layout_treemap = /** @type {(inputs: List_View_Layout_TreemapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Treemap`)
};

export const list_view_loading = /** @type {(inputs: List_View_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Loading…`)
};

export const list_view_move_failed = /** @type {(inputs: List_View_Move_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.title} stays in ${i?.column}: ${i?.error}`)
};

export const list_view_move_menu = /** @type {(inputs: List_View_Move_MenuInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Move ${i?.title}`)
};

export const list_view_move_to = /** @type {(inputs: List_View_Move_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Move to ${i?.column}`)
};

export const list_view_moved = /** @type {(inputs: List_View_MovedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.title} → ${i?.column}`)
};

export const list_view_new = /** @type {(inputs: List_View_NewInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`+ New ${i?.singular}`)
};

export const list_view_next = /** @type {(inputs: List_View_NextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next`)
};

export const list_view_next_month = /** @type {(inputs: List_View_Next_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next month`)
};

export const list_view_no_records = /** @type {(inputs: List_View_No_RecordsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No records`)
};

export const list_view_none_column = /** @type {(inputs: List_View_None_ColumnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`No ${i?.field}`)
};

export const list_view_none_inline = /** @type {(inputs: List_View_None_InlineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`no ${i?.field}`)
};

export const list_view_open = /** @type {(inputs: List_View_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open`)
};

export const list_view_open_full = /** @type {(inputs: List_View_Open_FullInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open full page`)
};

export const list_view_position = /** @type {(inputs: List_View_PositionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.at} of ${i?.total}`)
};

export const list_view_previous = /** @type {(inputs: List_View_PreviousInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Previous`)
};

export const list_view_previous_month = /** @type {(inputs: List_View_Previous_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Previous month`)
};

export const list_view_range = /** @type {(inputs: List_View_RangeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.from}–${i?.to} of ${i?.total}`)
};

export const list_view_read_only = /** @type {(inputs: List_View_Read_OnlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Read only`)
};

export const list_view_rows = /** @type {(inputs: List_View_RowsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rows`)
};

export const list_view_save = /** @type {(inputs: List_View_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Save`)
};

export const list_view_saved = /** @type {(inputs: List_View_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saved`)
};

export const list_view_saving = /** @type {(inputs: List_View_SavingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saving…`)
};

export const list_view_scatter_label = /** @type {(inputs: List_View_Scatter_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.things}: ${i?.x} and ${i?.y}`)
};

export const list_view_search_by = /** @type {(inputs: List_View_Search_ByInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Search by ${i?.field}`)
};

export const list_view_select_all = /** @type {(inputs: List_View_Select_AllInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Select all ${i?.total} ${i?.things}`)
};

export const list_view_select_all_matching = /** @type {(inputs: List_View_Select_All_MatchingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Select all ${i?.total} matching`)
};

export const list_view_selected = /** @type {(inputs: List_View_SelectedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} selected`)
};

export const list_view_selection = /** @type {(inputs: List_View_SelectionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Selection`)
};

export const list_view_sort = /** @type {(inputs: List_View_SortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sort`)
};

export const list_view_sort_default = /** @type {(inputs: List_View_Sort_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Default order`)
};

export const list_view_this_month = /** @type {(inputs: List_View_This_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This month`)
};

export const list_view_undo = /** @type {(inputs: List_View_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Undo`)
};

export const list_view_unsaved = /** @type {(inputs: List_View_UnsavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unsaved changes`)
};

export const list_view_updated = /** @type {(inputs: List_View_UpdatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Updated`)
};

export const list_view_view = /** @type {(inputs: List_View_ViewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`View`)
};

export const list_view_with = /** @type {(inputs: List_View_WithInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`With ${i?.person}`)
};

export const loading_label = /** @type {(inputs: Loading_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Loading`)
};

export const message_bad_response = /** @type {(inputs: Message_Bad_ResponseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bad response`)
};

export const message_copied = /** @type {(inputs: Message_CopiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copied`)
};

export const message_copy = /** @type {(inputs: Message_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copy`)
};

export const message_edit = /** @type {(inputs: Message_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Edit`)
};

export const message_good_response = /** @type {(inputs: Message_Good_ResponseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Good response`)
};

export const message_retry = /** @type {(inputs: Message_RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retry`)
};

export const message_scroller_jump = /** @type {(inputs: Message_Scroller_JumpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Jump to latest`)
};

export const modal_cancel = /** @type {(inputs: Modal_CancelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cancel`)
};

export const modal_close = /** @type {(inputs: Modal_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Close`)
};

export const model_selector_label = /** @type {(inputs: Model_Selector_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Model: ${i?.name}`)
};

export const month_day_due = /** @type {(inputs: Month_Day_DueInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.day}, ${__paraglideRegistry.icuPound("en", i?.count, {})} due`);
	return /** @type {LocalizedString} */ (`${i?.day}, ${__paraglideRegistry.icuPound("en", i?.count, {})} due`)
};

export const month_nothing_due = /** @type {(inputs: Month_Nothing_DueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing due`)
};

export const number_days = /** @type {(inputs: Number_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} d`)
};

export const number_hours = /** @type {(inputs: Number_HoursInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} h`)
};

export const number_minutes = /** @type {(inputs: Number_MinutesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} min`)
};

export const number_money = /** @type {(inputs: Number_MoneyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.currency} ${i?.amount}`)
};

export const number_money_compact = /** @type {(inputs: Number_Money_CompactInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.currency} ${i?.amount}k`)
};

export const number_pct = /** @type {(inputs: Number_PctInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value}%`)
};

export const number_thousands = /** @type {(inputs: Number_ThousandsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount}k`)
};

export const otp_label = /** @type {(inputs: Otp_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`One-time code`)
};

export const pagination_label = /** @type {(inputs: Pagination_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pagination`)
};

export const pagination_next = /** @type {(inputs: Pagination_NextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next page`)
};

export const pagination_page_of = /** @type {(inputs: Pagination_Page_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Page ${i?.page} of ${i?.total}`)
};

export const pagination_pages_range = /** @type {(inputs: Pagination_Pages_RangeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Pages ${i?.from} to ${i?.to}`)
};

export const pagination_previous = /** @type {(inputs: Pagination_PreviousInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Previous page`)
};

export const prompt_input_label = /** @type {(inputs: Prompt_Input_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Message`)
};

export const prompt_input_send = /** @type {(inputs: Prompt_Input_SendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Send`)
};

export const prompt_input_stop = /** @type {(inputs: Prompt_Input_StopInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stop`)
};

export const quadrant_measure = /** @type {(inputs: Quadrant_MeasureInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.measure} ${i?.value}`)
};

export const quadrant_point = /** @type {(inputs: Quadrant_PointInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.point}, ${i?.quadrant}`)
};

export const quadrant_split = /** @type {(inputs: Quadrant_SplitInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Split at ${i?.x} · ${i?.y}`)
};

export const quadrant_x_axis = /** @type {(inputs: Quadrant_X_AxisInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.measure} →`)
};

export const rating_none = /** @type {(inputs: Rating_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not rated`)
};

export const rating_of = /** @type {(inputs: Rating_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} of ${i?.max}`)
};

export const rating_star_words = /** @type {(inputs: Rating_Star_WordsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value}: ${i?.words}`)
};

export const record_named = /** @type {(inputs: Record_NamedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.title}, ${i?.status}`)
};

export const record_related = /** @type {(inputs: Record_RelatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Related`)
};

export const search_clear = /** @type {(inputs: Search_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clear search`)
};

export const search_label = /** @type {(inputs: Search_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Search`)
};

export const shared_bookmarks_failed = /** @type {(inputs: Shared_Bookmarks_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Couldn't update bookmarks: ${i?.error}`)
};

export const shared_collections = /** @type {(inputs: Shared_CollectionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Collections`)
};

export const shared_configuration = /** @type {(inputs: Shared_ConfigurationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Configuration`)
};

export const shared_no = /** @type {(inputs: Shared_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No`)
};

export const shared_rows = /** @type {(inputs: Shared_RowsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} row`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("en", i?.count, {})} rows`)
};

export const shared_untitled = /** @type {(inputs: Shared_UntitledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Untitled`)
};

export const shared_yes = /** @type {(inputs: Shared_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Yes`)
};

export const sheet_close = /** @type {(inputs: Sheet_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Close`)
};

export const site_assistant_name = /** @type {(inputs: Site_Assistant_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Assistant`)
};

export const site_default_name = /** @type {(inputs: Site_Default_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dashboard`)
};

export const skeleton_loading = /** @type {(inputs: Skeleton_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Loading`)
};

export const snackbar_dismiss = /** @type {(inputs: Snackbar_DismissInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dismiss`)
};

export const sources_used = /** @type {(inputs: Sources_UsedInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Used ${__paraglideRegistry.icuPound("en", i?.count, {})} source`);
	return /** @type {LocalizedString} */ (`Used ${__paraglideRegistry.icuPound("en", i?.count, {})} sources`)
};

export const stat_delta_down = /** @type {(inputs: Stat_Delta_DownInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Down`)
};

export const stat_delta_flat = /** @type {(inputs: Stat_Delta_FlatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No change`)
};

export const stat_delta_up = /** @type {(inputs: Stat_Delta_UpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Up`)
};

export const stepper_less = /** @type {(inputs: Stepper_LessInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Less`)
};

export const stepper_less_of = /** @type {(inputs: Stepper_Less_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Less ${i?.label}`)
};

export const stepper_more = /** @type {(inputs: Stepper_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`More`)
};

export const stepper_more_of = /** @type {(inputs: Stepper_More_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`More ${i?.label}`)
};

export const steps_done = /** @type {(inputs: Steps_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`(done)`)
};

export const steps_skipped = /** @type {(inputs: Steps_SkippedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`(skipped)`)
};

export const suggestions_label = /** @type {(inputs: Suggestions_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suggestions`)
};

export const table_column_fit = /** @type {(inputs: Table_Column_FitInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.column} fits its content`)
};

export const table_column_moved = /** @type {(inputs: Table_Column_MovedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.column} moved to column ${i?.place} of ${i?.total}`)
};

export const table_column_width = /** @type {(inputs: Table_Column_WidthInputs) => LocalizedString} */ (i) => {
	const widthPlural = __paraglideRegistry.plural("en", i?.width, {}, true);
	if (widthPlural === "one") return /** @type {LocalizedString} */ (`${i?.column} ${__paraglideRegistry.icuPound("en", i?.width, {})} pixel wide`);
	return /** @type {LocalizedString} */ (`${i?.column} ${__paraglideRegistry.icuPound("en", i?.width, {})} pixels wide`)
};

export const table_resize_column = /** @type {(inputs: Table_Resize_ColumnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Resize ${i?.column} column`)
};

export const table_resize_hint = /** @type {(inputs: Table_Resize_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Drag to resize · double-click to fit`)
};

export const table_select_all = /** @type {(inputs: Table_Select_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Select all`)
};

export const table_select_row = /** @type {(inputs: Table_Select_RowInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Select row ${i?.row}`)
};

export const table_sort_hint = /** @type {(inputs: Table_Sort_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sort (Shift-click to sort by several columns)`)
};

export const table_sort_move_hint = /** @type {(inputs: Table_Sort_Move_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sort (Shift-click to sort by several columns). Drag or Ctrl+Shift+← / → to move`)
};

export const tile_move = /** @type {(inputs: Tile_MoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Move`)
};

export const tile_move_hint = /** @type {(inputs: Tile_Move_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Drag to move. Click for more. Arrow keys: earlier or later. Delete: hide.`)
};

export const tile_move_named = /** @type {(inputs: Tile_Move_NamedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Move ${i?.name}`)
};

export const tile_remove = /** @type {(inputs: Tile_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remove`)
};

export const tile_remove_named = /** @type {(inputs: Tile_Remove_NamedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Remove ${i?.name}`)
};

export const tile_resize = /** @type {(inputs: Tile_ResizeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Resize`)
};

export const tile_resize_hint = /** @type {(inputs: Tile_Resize_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Drag to resize. Arrow keys: a tile at a time.`)
};

export const tile_resize_named = /** @type {(inputs: Tile_Resize_NamedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Resize ${i?.name}`)
};

export const tile_show_all = /** @type {(inputs: Tile_Show_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Show all`)
};

export const tile_show_less = /** @type {(inputs: Tile_Show_LessInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Show less`)
};

export const tour_eyebrow_signed_in = /** @type {(inputs: Tour_Eyebrow_Signed_InInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.tour} · signed in as ${i?.name} (${i?.role})`)
};

export const treemap_cell = /** @type {(inputs: Treemap_CellInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.label}, ${i?.amount}, ${i?.share}`)
};

export const visual_other = /** @type {(inputs: Visual_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Other`)
};

export const waffle_label = /** @type {(inputs: Waffle_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Share`)
};

export const waffle_reading = /** @type {(inputs: Waffle_ReadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} ${i?.caption}`)
};

export const waterfall_change = /** @type {(inputs: Waterfall_ChangeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.label}: ${i?.change} → ${i?.run}`)
};

export const waterfall_decrease = /** @type {(inputs: Waterfall_DecreaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Decrease`)
};

export const waterfall_increase = /** @type {(inputs: Waterfall_IncreaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Increase`)
};

export const waterfall_total = /** @type {(inputs: Waterfall_TotalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.label}: ${i?.run}`)
};

export const waterfall_total_key = /** @type {(inputs: Waterfall_Total_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Total`)
};

export const whatif_reset = /** @type {(inputs: Whatif_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reset`)
};

export const widget_ask_placeholder = /** @type {(inputs: Widget_Ask_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ask a question…`)
};

export const widget_ask_reading = /** @type {(inputs: Widget_Ask_ReadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reading the records…`)
};

export const widget_attach = /** @type {(inputs: Widget_AttachInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Attach ${i?.what}.`)
};

export const widget_blocks_chart = /** @type {(inputs: Widget_Blocks_ChartInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Chart`)
};

export const widget_blocks_funnel_step = /** @type {(inputs: Widget_Blocks_Funnel_StepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`went on`)
};

export const widget_blocks_more = /** @type {(inputs: Widget_Blocks_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`More`)
};

export const widget_dashboard = /** @type {(inputs: Widget_DashboardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dashboard`)
};

export const widget_data_all = /** @type {(inputs: Widget_Data_AllInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`All ${i?.what}`)
};

export const widget_data_in_all = /** @type {(inputs: Widget_Data_In_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`in all`)
};

export const widget_denied = /** @type {(inputs: Widget_DeniedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`You don't have access to this.`)
};

export const widget_empty = /** @type {(inputs: Widget_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing here yet.`)
};

export const widget_failed = /** @type {(inputs: Widget_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`That didn't work.`)
};

export const widget_fill_in = /** @type {(inputs: Widget_Fill_InInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Fill in ${i?.fields}.`)
};

export const widget_fill_in_button = /** @type {(inputs: Widget_Fill_In_ButtonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fill in`)
};

export const widget_host_all = /** @type {(inputs: Widget_Host_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All`)
};

export const widget_host_compact = /** @type {(inputs: Widget_Host_CompactInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Compact`)
};

export const widget_host_its_screen = /** @type {(inputs: Widget_Host_Its_ScreenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`its screen`)
};

export const widget_host_keep_here = /** @type {(inputs: Widget_Host_Keep_HereInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Keep it here`)
};

export const widget_host_kept = /** @type {(inputs: Widget_Host_KeptInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} is in your widgets`)
};

export const widget_host_reset_layout = /** @type {(inputs: Widget_Host_Reset_LayoutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reset layout`)
};

export const widget_host_show_hidden = /** @type {(inputs: Widget_Host_Show_HiddenInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("en", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Show ${__paraglideRegistry.icuPound("en", i?.count, {})} hidden tile`);
	return /** @type {LocalizedString} */ (`Show ${__paraglideRegistry.icuPound("en", i?.count, {})} hidden tiles`)
};

export const widget_host_tile = /** @type {(inputs: Widget_Host_TileInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`tile`)
};

export const widget_load_failed = /** @type {(inputs: Widget_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This couldn't load`)
};

export const widget_mini_of = /** @type {(inputs: Widget_Mini_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`of ${i?.max}`)
};

export const widget_mini_open = /** @type {(inputs: Widget_Mini_OpenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Open ${i?.label}`)
};

export const widget_mini_other = /** @type {(inputs: Widget_Mini_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Other`)
};

export const widget_mini_reading = /** @type {(inputs: Widget_Mini_ReadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reading`)
};

export const widget_mini_share = /** @type {(inputs: Widget_Mini_ShareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Share`)
};

export const widget_mini_step = /** @type {(inputs: Widget_Mini_StepInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Step ${i?.step} of ${i?.total}: ${i?.label}`)
};

export const widget_more_heading = /** @type {(inputs: Widget_More_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} more`)
};

export const widget_paste_placeholder = /** @type {(inputs: Widget_Paste_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paste the message here…`)
};

export const widget_save_failed = /** @type {(inputs: Widget_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`That didn't save.`)
};

export const widget_share_of_all = /** @type {(inputs: Widget_Share_Of_AllInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.pct}% of all ${i?.noun}`)
};

export const widget_share_of_first = /** @type {(inputs: Widget_Share_Of_FirstInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`of ${i?.label} (${i?.value})`)
};

export const widget_share_of_max = /** @type {(inputs: Widget_Share_Of_MaxInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`of ${i?.max}`)
};

export const widget_share_of_total = /** @type {(inputs: Widget_Share_Of_TotalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.pct}% of ${i?.total} ${i?.noun}`)
};

export const widget_total = /** @type {(inputs: Widget_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Total`)
};

export const widget_undo = /** @type {(inputs: Widget_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Undo`)
};

export const widget_undo_failed = /** @type {(inputs: Widget_Undo_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`That couldn't be undone.`)
};

export const widget_undone = /** @type {(inputs: Widget_UndoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Undone`)
};