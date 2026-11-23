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
/** @typedef {{ name: NonNullable<unknown> }} Appearance_Scheme_LabelInputs */
/** @typedef {{}} Appearance_Theme_DarkInputs */
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
	return /** @type {LocalizedString} */ (`السماح بـ: ${i?.action}؟`)
};

export const agent_allow_description = /** @type {(inputs: Agent_Allow_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يريد المساعد إجراء هذا التغيير نيابةً عنك.`)
};

export const agent_builtin_too_small = /** @type {(inputs: Agent_Builtin_Too_SmallInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا تتوفر في النموذج المدمج في Chrome مساحة كافية للمساعد على هذا الجهاز.`)
};

export const agent_builtin_unavailable = /** @type {(inputs: Agent_Builtin_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النموذج المدمج في Chrome غير متاح على هذا الجهاز (يحتاج إلى نحو 22 غيغابايت من المساحة الحرة ومعالج رسوميات بذاكرة تزيد على 4 غيغابايت، أو 16 غيغابايت من الذاكرة).`)
};

export const agent_could_not_finish = /** @type {(inputs: Agent_Could_Not_FinishInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم أتمكن من إتمام ذلك. هل يمكنك صياغة السؤال بطريقة أخرى أو بشكل أضيق؟`)
};

export const agent_decided_answer = /** @type {(inputs: Agent_Decided_AnswerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قرّر الإجابة.`)
};

export const agent_decided_grounded = /** @type {(inputs: Agent_Decided_GroundedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أجاب دون الرجوع إلى أي سجل، لذا تأتي الإجابة من ${i?.tool} بدلًا من ذلك.`)
};

export const agent_decided_tool = /** @type {(inputs: Agent_Decided_ToolInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`قرّر استخدام **${i?.tool}**.`)
};

export const agent_decided_tools = /** @type {(inputs: Agent_Decided_ToolsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`قرّر استخدام ${i?.tools}.`)
};

export const agent_details = /** @type {(inputs: Agent_DetailsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التفاصيل`)
};

export const agent_downloading = /** @type {(inputs: Agent_DownloadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ تنزيل نموذج الذكاء الاصطناعي (مرة واحدة لكل جهاز)…`)
};

export const agent_downloading_progress = /** @type {(inputs: Agent_Downloading_ProgressInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`جارٍ تنزيل نموذج الذكاء الاصطناعي… ${i?.percent}`)
};

export const agent_empty_body = /** @type {(inputs: Agent_Empty_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أرى الشاشة التي أمامك، وأبحث في السجلات، وأوضح ما ينتظرك، وأنقلك إلى أي صفحة، وأنفّذ المهام نيابةً عنك بعد موافقتك.`)
};

export const agent_empty_heading = /** @type {(inputs: Agent_Empty_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كيف أستطيع مساعدتك؟`)
};

export const agent_find_nothing = /** @type {(inputs: Agent_Find_NothingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`لا يوجد ما يطابق «${i?.query}».`)
};

export const agent_local_body = /** @type {(inputs: Agent_Local_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الذكاء الاصطناعي المدمج في Chrome غير مفعّل في هذا المتصفح. نزّل النموذج مرة واحدة (نحو 800 ميغابايت، يحتفظ به المتصفح، ولا يعمل في النوافذ الخاصة) لاستخدامه هنا، ولن يغادر أي شيء تكتبه هذا الجهاز. أو فعّل النموذج المدمج في Chrome (أسرع) باتباع الخطوات في صفحة تسجيل الدخول.`)
};

export const agent_local_download = /** @type {(inputs: Agent_Local_DownloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تنزيل نموذج الذكاء الاصطناعي (نحو 800 ميغابايت)`)
};

export const agent_local_heading = /** @type {(inputs: Agent_Local_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`يعمل ${i?.model} على هذا الجهاز`)
};

export const agent_local_loading = /** @type {(inputs: Agent_Local_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ التحميل…`)
};

export const agent_model_load_failed = /** @type {(inputs: Agent_Model_Load_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تعذّر تحميل النموذج: ${i?.error}`)
};

export const agent_model_output = /** @type {(inputs: Agent_Model_OutputInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مخرجات النموذج`)
};

export const agent_models_cloud = /** @type {(inputs: Agent_Models_CloudInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`OpenAI · مفتاح API`)
};

export const agent_models_device = /** @type {(inputs: Agent_Models_DeviceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`على هذا الجهاز`)
};

export const agent_my_day_empty = /** @type {(inputs: Agent_My_Day_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد شيء في الصفحة الرئيسية لهذا الشخص.`)
};

export const agent_new_chat = /** @type {(inputs: Agent_New_ChatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`محادثة جديدة`)
};

export const agent_no_builtin_model = /** @type {(inputs: Agent_No_Builtin_ModelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`لا يحتوي هذا المتصفح على نموذج ذكاء اصطناعي مدمج. يحتاج ${i?.model} إلى الذكاء الاصطناعي المدمج في Chrome أو إلى النموذج القابل للتنزيل: راجع «تفعيل الذكاء الاصطناعي على الجهاز» في صفحة تسجيل الدخول.`)
};

export const agent_open = /** @type {(inputs: Agent_OpenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`فتح ${i?.helper}`)
};

export const agent_openai_failed = /** @type {(inputs: Agent_Openai_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`فشل طلب OpenAI (${i?.status})`)
};

export const agent_opened = /** @type {(inputs: Agent_OpenedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم فتح: ${i?.title} (${i?.path}).`)
};

export const agent_prompt_placeholder = /** @type {(inputs: Agent_Prompt_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اسأل المساعد أو اطلب منه…`)
};

export const agent_record_page = /** @type {(inputs: Agent_Record_PageInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الصفحة: ${i?.path}`)
};

export const agent_screen_about = /** @type {(inputs: Agent_Screen_AboutInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`عن هذه الصفحة: ${i?.description}`)
};

export const agent_screen_list = /** @type {(inputs: Agent_Screen_ListInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`قائمة ${i?.label}: ${i?.count} إجمالًا. أولها:`)
};

export const agent_screen_page = /** @type {(inputs: Agent_Screen_PageInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الصفحة: ${i?.title} (${i?.path})`)
};

export const agent_screen_record = /** @type {(inputs: Agent_Screen_RecordInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.singular}: ${i?.title}`)
};

export const agent_screen_settings = /** @type {(inputs: Agent_Screen_SettingsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الإعدادات: ${i?.label}.`)
};

export const agent_screen_signed_in = /** @type {(inputs: Agent_Screen_Signed_InInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مسجّل الدخول باسم ${i?.name} — ${i?.role}`)
};

export const agent_screen_signed_out = /** @type {(inputs: Agent_Screen_Signed_OutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`غير مسجّل الدخول`)
};

export const agent_screen_tabs = /** @type {(inputs: Agent_Screen_TabsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`التبويبات: ${i?.tabs}`)
};

export const agent_screen_view = /** @type {(inputs: Agent_Screen_ViewInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`شاشة: ${i?.title}.`)
};

export const agent_sources = /** @type {(inputs: Agent_SourcesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`المصادر: ${i?.sources}`)
};

export const agent_suggest_approvals = /** @type {(inputs: Agent_Suggest_ApprovalsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ما الذي ينتظر اعتمادي؟`)
};

export const agent_suggest_page = /** @type {(inputs: Agent_Suggest_PageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كيف تعمل هذه الصفحة؟`)
};

export const agent_suggest_screen = /** @type {(inputs: Agent_Suggest_ScreenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ما الذي أراه الآن؟`)
};

export const agent_suggest_today = /** @type {(inputs: Agent_Suggest_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ما المطلوب مني اليوم؟`)
};

export const agent_thinking = /** @type {(inputs: Agent_ThinkingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يفكّر…`)
};

export const agent_thought_for = /** @type {(inputs: Agent_Thought_ForInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`فكّر لمدة ${i?.seconds} ث`)
};

export const agent_thought_opened = /** @type {(inputs: Agent_Thought_OpenedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلب لفتح صفحة: فُتحت مباشرةً دون النموذج.`)
};

export const agent_thought_routed = /** @type {(inputs: Agent_Thought_RoutedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`طلب شائع: أُجيب عنه بـ **${i?.tool}** مباشرةً من السجلات دون النموذج.`)
};

export const agent_too_many_steps = /** @type {(inputs: Agent_Too_Many_StepsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`توقفت بعد خطوات كثيرة دون أن أنتهي. هل يمكنك تضييق الطلب؟`)
};

export const agent_tool_ask_assistant = /** @type {(inputs: Agent_Tool_Ask_AssistantInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سؤال السجلات`)
};

export const agent_tool_ask_records = /** @type {(inputs: Agent_Tool_Ask_RecordsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سؤال السجلات`)
};

export const agent_tool_call_workflow = /** @type {(inputs: Agent_Tool_Call_WorkflowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تشغيل مسار عمل`)
};

export const agent_tool_check_accessibility = /** @type {(inputs: Agent_Tool_Check_AccessibilityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فحص تباين الألوان`)
};

export const agent_tool_count_documents = /** @type {(inputs: Agent_Tool_Count_DocumentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عدّ السجلات`)
};

export const agent_tool_create_document = /** @type {(inputs: Agent_Tool_Create_DocumentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إنشاء سجل`)
};

export const agent_tool_delete_document = /** @type {(inputs: Agent_Tool_Delete_DocumentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حذف سجل`)
};

export const agent_tool_describe_schema = /** @type {(inputs: Agent_Tool_Describe_SchemaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نموذج البيانات`)
};

export const agent_tool_find = /** @type {(inputs: Agent_Tool_FindInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بحث`)
};

export const agent_tool_find_documents = /** @type {(inputs: Agent_Tool_Find_DocumentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`البحث في السجلات`)
};

export const agent_tool_get_appearance = /** @type {(inputs: Agent_Tool_Get_AppearanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المظهر`)
};

export const agent_tool_get_bookmarks = /** @type {(inputs: Agent_Tool_Get_BookmarksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المفضلة`)
};

export const agent_tool_get_document = /** @type {(inputs: Agent_Tool_Get_DocumentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قراءة سجل`)
};

export const agent_tool_get_my_work = /** @type {(inputs: Agent_Tool_Get_My_WorkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أعمالي`)
};

export const agent_tool_get_screen = /** @type {(inputs: Agent_Tool_Get_ScreenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ما على الشاشة`)
};

export const agent_tool_get_settings = /** @type {(inputs: Agent_Tool_Get_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قراءة الإعدادات`)
};

export const agent_tool_list_demo_users = /** @type {(inputs: Agent_Tool_List_Demo_UsersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المستخدمون التجريبيون`)
};

export const agent_tool_list_pages = /** @type {(inputs: Agent_Tool_List_PagesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الصفحات`)
};

export const agent_tool_list_tours = /** @type {(inputs: Agent_Tool_List_ToursInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الجولات الإرشادية`)
};

export const agent_tool_list_workflows = /** @type {(inputs: Agent_Tool_List_WorkflowsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسارات العمل`)
};

export const agent_tool_mark_notification_read = /** @type {(inputs: Agent_Tool_Mark_Notification_ReadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تعليم الإشعار كمقروء`)
};

export const agent_tool_my_day = /** @type {(inputs: Agent_Tool_My_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يومي`)
};

export const agent_tool_navigate = /** @type {(inputs: Agent_Tool_NavigateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الانتقال إلى صفحة`)
};

export const agent_tool_open_page = /** @type {(inputs: Agent_Tool_Open_PageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فتح صفحة`)
};

export const agent_tool_platform_guide = /** @type {(inputs: Agent_Tool_Platform_GuideInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`دليل المنصة`)
};

export const agent_tool_record_status = /** @type {(inputs: Agent_Tool_Record_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حالة السجل`)
};

export const agent_tool_set_appearance = /** @type {(inputs: Agent_Tool_Set_AppearanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تغيير المظهر`)
};

export const agent_tool_set_layout = /** @type {(inputs: Agent_Tool_Set_LayoutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فتح عمود جانبي أو إغلاقه`)
};

export const agent_tool_start_tour = /** @type {(inputs: Agent_Tool_Start_TourInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بدء جولة`)
};

export const agent_tool_switch_user = /** @type {(inputs: Agent_Tool_Switch_UserInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تبديل المستخدم (تجريبي)`)
};

export const agent_tool_toggle_bookmark = /** @type {(inputs: Agent_Tool_Toggle_BookmarkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إضافة صفحة إلى المفضلة`)
};

export const agent_tool_update_document = /** @type {(inputs: Agent_Tool_Update_DocumentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تعديل سجل`)
};

export const agent_tool_update_settings = /** @type {(inputs: Agent_Tool_Update_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تغيير الإعدادات`)
};

export const agent_tool_what_is_on_screen = /** @type {(inputs: Agent_Tool_What_Is_On_ScreenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ما على الشاشة`)
};

export const agent_tool_with = /** @type {(inputs: Agent_Tool_WithInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`**${i?.tool}** بالمدخلات ${i?.input}`)
};

export const agent_trace_input = /** @type {(inputs: Agent_Trace_InputInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المدخلات`)
};

export const agent_trace_result = /** @type {(inputs: Agent_Trace_ResultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النتيجة`)
};

export const agent_working = /** @type {(inputs: Agent_WorkingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ العمل…`)
};

export const alert_dismiss = /** @type {(inputs: Alert_DismissInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إغلاق`)
};

export const app_backend_failed = /** @type {(inputs: App_Backend_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تعذّر تشغيل الخادم التجريبي`)
};

export const app_demo_tag = /** @type {(inputs: App_Demo_TagInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تجريبي`)
};

export const app_log_out = /** @type {(inputs: App_Log_OutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسجيل الخروج`)
};

export const app_logged_out = /** @type {(inputs: App_Logged_OutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم تسجيل خروجك.`)
};

export const app_nav_dashboard = /** @type {(inputs: App_Nav_DashboardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لوحة التحكم`)
};

export const app_nav_home = /** @type {(inputs: App_Nav_HomeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الرئيسية`)
};

export const app_needs_attention = /** @type {(inputs: App_Needs_AttentionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يحتاج إلى متابعة`)
};

export const app_not_found_back = /** @type {(inputs: App_Not_Found_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العودة إلى لوحة التحكم`)
};

export const app_not_found_description = /** @type {(inputs: App_Not_Found_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد صفحة في لوحة التحكم بهذا العنوان.`)
};

export const app_not_found_heading = /** @type {(inputs: App_Not_Found_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد شيء هنا`)
};

export const app_powered_by = /** @type {(inputs: App_Powered_ByInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`هذا العرض التجريبي مقدَّم من ${i?.name}`)
};

export const app_shell_navigation = /** @type {(inputs: App_Shell_NavigationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التنقل`)
};

export const app_shell_side_panel = /** @type {(inputs: App_Shell_Side_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اللوحة الجانبية`)
};

export const app_side_panel = /** @type {(inputs: App_Side_PanelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اللوحة الجانبية`)
};

export const app_switch_user_failed = /** @type {(inputs: App_Switch_User_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تعذّر التبديل إلى ${i?.name}: ${i?.error}`)
};

export const app_switch_user_heading = /** @type {(inputs: App_Switch_User_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تبديل المستخدم`)
};

export const app_switch_user_label = /** @type {(inputs: App_Switch_User_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تبديل المستخدم (تجريبي) — مسجّل الدخول باسم ${i?.name}`)
};

export const app_switched_user = /** @type {(inputs: App_Switched_UserInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم تسجيل الدخول باسم ${i?.name} (${i?.role})`)
};

export const app_title_account = /** @type {(inputs: App_Title_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الحساب`)
};

export const app_title_create_first_user = /** @type {(inputs: App_Title_Create_First_UserInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إنشاء أول مستخدم`)
};

export const app_title_login = /** @type {(inputs: App_Title_LoginInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسجيل الدخول`)
};

export const app_title_not_found = /** @type {(inputs: App_Title_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`غير موجود`)
};

export const app_title_suffix = /** @type {(inputs: App_Title_SuffixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`· لوحة التحكم`)
};

export const app_view_loading = /** @type {(inputs: App_View_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ تحميل هذه الشاشة.`)
};

export const appearance_background_heading = /** @type {(inputs: Appearance_Background_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الخلفية`)
};

export const appearance_background_label = /** @type {(inputs: Appearance_Background_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صورة الخلفية`)
};

export const appearance_background_live_magnet_lines = /** @type {(inputs: Appearance_Background_Live_Magnet_LinesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خطوط مغناطيسية`)
};

export const appearance_background_live_waves = /** @type {(inputs: Appearance_Background_Live_WavesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أمواج`)
};

export const appearance_background_none = /** @type {(inputs: Appearance_Background_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بلا صورة`)
};

export const appearance_background_replace = /** @type {(inputs: Appearance_Background_ReplaceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استبدل صورتك`)
};

export const appearance_background_upload = /** @type {(inputs: Appearance_Background_UploadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ارفع صورتك`)
};

export const appearance_language_ar = /** @type {(inputs: Appearance_Language_ArInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العربية`)
};

export const appearance_language_current = /** @type {(inputs: Appearance_Language_CurrentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اللغة الحالية`)
};

export const appearance_language_en = /** @type {(inputs: Appearance_Language_EnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإنجليزية`)
};

export const appearance_language_heading = /** @type {(inputs: Appearance_Language_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اللغة`)
};

export const appearance_language_label = /** @type {(inputs: Appearance_Language_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`اللغة: ${i?.name}`)
};

export const appearance_scheme_default = /** @type {(inputs: Appearance_Scheme_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الافتراضي`)
};

export const appearance_scheme_label = /** @type {(inputs: Appearance_Scheme_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`نظام الألوان: ${i?.name}`)
};

export const appearance_theme_dark = /** @type {(inputs: Appearance_Theme_DarkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`داكن`)
};

export const appearance_theme_label = /** @type {(inputs: Appearance_Theme_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`المظهر: ${i?.current}. التبديل إلى ${i?.next}`)
};

export const appearance_theme_light = /** @type {(inputs: Appearance_Theme_LightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فاتح`)
};

export const appearance_theme_system = /** @type {(inputs: Appearance_Theme_SystemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النظام`)
};

export const aside_bookmark_add = /** @type {(inputs: Aside_Bookmark_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إضافة هذه الصفحة إلى المفضلة`)
};

export const aside_bookmark_list = /** @type {(inputs: Aside_Bookmark_ListInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قائمة`)
};

export const aside_bookmark_record = /** @type {(inputs: Aside_Bookmark_RecordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سجل`)
};

export const aside_bookmark_remove = /** @type {(inputs: Aside_Bookmark_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إزالة هذه الصفحة من المفضلة`)
};

export const aside_bookmark_screen = /** @type {(inputs: Aside_Bookmark_ScreenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`شاشة`)
};

export const aside_bookmark_settings = /** @type {(inputs: Aside_Bookmark_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإعدادات`)
};

export const aside_bookmarks = /** @type {(inputs: Aside_BookmarksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المفضلة`)
};

export const aside_bookmarks_empty = /** @type {(inputs: Aside_Bookmarks_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اضغط النجمة لحفظ صفحة هنا`)
};

export const aside_caught_up = /** @type {(inputs: Aside_Caught_UpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا جديد لديك`)
};

export const aside_loading = /** @type {(inputs: Aside_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ التحميل…`)
};

export const aside_notification_read = /** @type {(inputs: Aside_Notification_ReadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مقروء`)
};

export const aside_notifications = /** @type {(inputs: Aside_NotificationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإشعارات`)
};

export const aside_notifications_unread = /** @type {(inputs: Aside_Notifications_UnreadInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الإشعارات (${i?.count})`)
};

export const aside_tour_done = /** @type {(inputs: Aside_Tour_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تمت`)
};

export const aside_tour_steps = /** @type {(inputs: Aside_Tour_StepsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`بلا خطوات`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`خطوة واحدة`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`خطوتان`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} خطوات`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} خطوة`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} خطوة`)
};

export const aside_tours = /** @type {(inputs: Aside_ToursInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الجولات`)
};

export const aside_widgets = /** @type {(inputs: Aside_WidgetsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأدوات`)
};

export const ask_ask = /** @type {(inputs: Ask_AskInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اسأل`)
};

export const ask_assistant = /** @type {(inputs: Ask_AssistantInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المساعد`)
};

export const ask_placeholder = /** @type {(inputs: Ask_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اطرح سؤالًا…`)
};

export const ask_question = /** @type {(inputs: Ask_QuestionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السؤال`)
};

export const ask_reading = /** @type {(inputs: Ask_ReadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ القراءة`)
};

export const ask_reading_records = /** @type {(inputs: Ask_Reading_RecordsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ قراءة السجلات…`)
};

export const ask_sources = /** @type {(inputs: Ask_SourcesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المصادر:`)
};

export const ask_you = /** @type {(inputs: Ask_YouInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أنت`)
};

export const assist_catch_me_up = /** @type {(inputs: Assist_Catch_Me_UpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لخّص لي`)
};

export const assist_check_again = /** @type {(inputs: Assist_Check_AgainInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تحقّق مجددًا`)
};

export const assist_check_with_ai = /** @type {(inputs: Assist_Check_With_AiInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تحقّق بالذكاء الاصطناعي`)
};

export const assist_checked_heading = /** @type {(inputs: Assist_Checked_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم التحقق على هذا الجهاز — والقرار لشخص`)
};

export const assist_checking = /** @type {(inputs: Assist_CheckingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ التحقق…`)
};

export const assist_classified = /** @type {(inputs: Assist_ClassifiedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.label}: ${i?.category}`)
};

export const assist_copied = /** @type {(inputs: Assist_CopiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم النسخ`)
};

export const assist_dictate = /** @type {(inputs: Assist_DictateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إملاء`)
};

export const assist_downloading = /** @type {(inputs: Assist_DownloadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`جارٍ تنزيل النموذج على الجهاز… ${i?.percent}`)
};

export const assist_drafted = /** @type {(inputs: Assist_DraftedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تمت الصياغة`)
};

export const assist_drafting = /** @type {(inputs: Assist_DraftingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ الصياغة…`)
};

export const assist_error_failed = /** @type {(inputs: Assist_Error_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تعذّر على النموذج المحلي تنفيذ ذلك.`)
};

export const assist_fill_from_text = /** @type {(inputs: Assist_Fill_From_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تعبئة من نص`)
};

export const assist_fixes = /** @type {(inputs: Assist_FixesInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`لا توجد تصحيحات`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`تصحيح واحد`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`تصحيحان`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} تصحيحات`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} تصحيحًا`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} تصحيح`)
};

export const assist_flag_note = /** @type {(inputs: Assist_Flag_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.note} رُصد على هذا الجهاز — وقد يكون خاطئًا.`)
};

export const assist_found_heading = /** @type {(inputs: Assist_Found_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`وُجد على هذا الجهاز — راجعه قبل الاستخدام`)
};

export const assist_heard_from = /** @type {(inputs: Assist_Heard_FromInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مسموع من ${i?.name} · على هذا الجهاز — راجعه`)
};

export const assist_hide_summary = /** @type {(inputs: Assist_Hide_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إخفاء الملخص`)
};

export const assist_key_points_heading = /** @type {(inputs: Assist_Key_Points_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أبرز النقاط · على هذا الجهاز`)
};

export const assist_listening = /** @type {(inputs: Assist_ListeningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ الاستماع…`)
};

export const assist_looks_like = /** @type {(inputs: Assist_Looks_LikeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يبدو أنه`)
};

export const assist_made_firmer = /** @type {(inputs: Assist_Made_FirmerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أصبح أكثر حزمًا`)
};

export const assist_made_formal = /** @type {(inputs: Assist_Made_FormalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أصبح أكثر رسمية`)
};

export const assist_made_friendlier = /** @type {(inputs: Assist_Made_FriendlierInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أصبح أكثر ودًّا`)
};

export const assist_no_fixes = /** @type {(inputs: Assist_No_FixesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا حاجة إلى تصحيحات`)
};

export const assist_no_microphone = /** @type {(inputs: Assist_No_MicrophoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الميكروفون غير متاح (تحقّق من أذونات المتصفح).`)
};

export const assist_not_found = /** @type {(inputs: Assist_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`غير موجود`)
};

export const assist_other_replies = /** @type {(inputs: Assist_Other_RepliesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ردود أخرى`)
};

export const assist_paste_placeholder = /** @type {(inputs: Assist_Paste_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الصق الرسالة هنا…`)
};

export const assist_proofreading = /** @type {(inputs: Assist_ProofreadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ التدقيق…`)
};

export const assist_read_aloud = /** @type {(inputs: Assist_Read_AloudInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قراءة بصوت عالٍ`)
};

export const assist_read_file = /** @type {(inputs: Assist_Read_FileInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قراءة صورة أو رسالة صوتية`)
};

export const assist_read_from = /** @type {(inputs: Assist_Read_FromInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مقروء من ${i?.name} · على هذا الجهاز — راجعه`)
};

export const assist_reading = /** @type {(inputs: Assist_ReadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ القراءة…`)
};

export const assist_reading_photo = /** @type {(inputs: Assist_Reading_PhotoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ قراءة الصورة…`)
};

export const assist_rewriting = /** @type {(inputs: Assist_RewritingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ إعادة الصياغة…`)
};

export const assist_shortened = /** @type {(inputs: Assist_ShortenedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم الاختصار`)
};

export const assist_shortening = /** @type {(inputs: Assist_ShorteningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ الاختصار…`)
};

export const assist_show_original = /** @type {(inputs: Assist_Show_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عرض الأصل`)
};

export const assist_stop = /** @type {(inputs: Assist_StopInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إيقاف`)
};

export const assist_stop_dictating = /** @type {(inputs: Assist_Stop_DictatingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إيقاف وتدوين`)
};

export const assist_suggest_category = /** @type {(inputs: Assist_Suggest_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اقتراح فئة`)
};

export const assist_suggest_replies = /** @type {(inputs: Assist_Suggest_RepliesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اقتراح ردود`)
};

export const assist_summarised_on_device = /** @type {(inputs: Assist_Summarised_On_DeviceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم التلخيص على هذا الجهاز`)
};

export const assist_summary_heading = /** @type {(inputs: Assist_Summary_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الملخص · على هذا الجهاز`)
};

export const assist_tool_draft = /** @type {(inputs: Assist_Tool_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صياغة بالذكاء الاصطناعي`)
};

export const assist_tool_firm = /** @type {(inputs: Assist_Tool_FirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أكثر حزمًا`)
};

export const assist_tool_formal = /** @type {(inputs: Assist_Tool_FormalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أكثر رسمية`)
};

export const assist_tool_friendly = /** @type {(inputs: Assist_Tool_FriendlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أكثر ودًّا`)
};

export const assist_tool_proofread = /** @type {(inputs: Assist_Tool_ProofreadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تدقيق`)
};

export const assist_tool_shorter = /** @type {(inputs: Assist_Tool_ShorterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أقصر`)
};

export const assist_tool_translate = /** @type {(inputs: Assist_Tool_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ترجمة`)
};

export const assist_translate_to = /** @type {(inputs: Assist_Translate_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`ترجمة إلى ${i?.language}`)
};

export const assist_translated_note = /** @type {(inputs: Assist_Translated_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تُرجم على هذا الجهاز — طابق الأسماء والأرقام مع الأصل.`)
};

export const assist_translated_to = /** @type {(inputs: Assist_Translated_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تُرجم إلى ${i?.language}`)
};

export const assist_translating = /** @type {(inputs: Assist_TranslatingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ الترجمة…`)
};

export const assist_translating_to = /** @type {(inputs: Assist_Translating_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`جارٍ الترجمة إلى ${i?.language}…`)
};

export const assist_undo = /** @type {(inputs: Assist_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تراجع`)
};

export const assist_use_these = /** @type {(inputs: Assist_Use_TheseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استخدام هذه القيم`)
};

export const assist_use_this = /** @type {(inputs: Assist_Use_ThisInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استخدام هذا`)
};

export const assist_writing_down = /** @type {(inputs: Assist_Writing_DownInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ التدوين…`)
};

export const assist_writing_replies = /** @type {(inputs: Assist_Writing_RepliesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ كتابة الردود…`)
};

export const auth_account_created = /** @type {(inputs: Auth_Account_CreatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم إنشاء الحساب.`)
};

export const auth_ai_download = /** @type {(inputs: Auth_Ai_DownloadInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تنزيل (${i?.size})`)
};

export const auth_ai_download_body = /** @type {(inputs: Auth_Ai_Download_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يعمل في أي متصفح، لكنه أبطأ ويقرأ النصوص فقط.`)
};

export const auth_ai_download_title = /** @type {(inputs: Auth_Ai_Download_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أو نزّل نموذجًا`)
};

export const auth_ai_flags = /** @type {(inputs: Auth_Ai_FlagsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`في Chrome على الكمبيوتر، افتح ${i?.url}، وفعّل هذه الإعدادات، ثم اضغط Relaunch:`)
};

export const auth_ai_flags_more = /** @type {(inputs: Auth_Ai_Flags_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فعّل أيضًا واجهات Summarization وWriter وRewriter وProofreader وTranslation وLanguage Detection. وللإعداد الأول اختر "Enabled BypassPerfRequirement".`)
};

export const auth_ai_heading = /** @type {(inputs: Auth_Ai_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تفعيل ميزات الذكاء الاصطناعي`)
};

export const auth_ai_loading = /** @type {(inputs: Auth_Ai_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ التحميل…`)
};

export const auth_ai_local_on = /** @type {(inputs: Auth_Ai_Local_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يستخدم هذا المتصفح النموذج الذي تم تنزيله.`)
};

export const auth_ai_native_on = /** @type {(inputs: Auth_Ai_Native_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الذكاء الاصطناعي المدمج في Chrome مفعّل في هذا المتصفح.`)
};

export const auth_ai_native_title = /** @type {(inputs: Auth_Ai_Native_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فعّل الذكاء الاصطناعي المدمج في Chrome`)
};

export const auth_ai_recommended = /** @type {(inputs: Auth_Ai_RecommendedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`موصى به`)
};

export const auth_change = /** @type {(inputs: Auth_ChangeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تغيير`)
};

export const auth_code_label = /** @type {(inputs: Auth_Code_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`رمز المصادقة`)
};

export const auth_code_prompt = /** @type {(inputs: Auth_Code_PromptInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أدخل الرمز المكوّن من ${i?.length} أرقام من تطبيق المصادقة.`)
};

export const auth_continue = /** @type {(inputs: Auth_ContinueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`متابعة`)
};

export const auth_create = /** @type {(inputs: Auth_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إنشاء`)
};

export const auth_demo_note = /** @type {(inputs: Auth_Demo_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`عرض تجريبي: أي رمز من ${i?.length} أرقام يعمل، وطلب مفتاح المرور محاكاة.`)
};

export const auth_email = /** @type {(inputs: Auth_EmailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`البريد الإلكتروني`)
};

export const auth_first_user_heading = /** @type {(inputs: Auth_First_User_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إنشاء المستخدم الأول`)
};

export const auth_first_user_intro = /** @type {(inputs: Auth_First_User_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد مستخدمون في الخادم التجريبي بعد.`)
};

export const auth_log_in = /** @type {(inputs: Auth_Log_InInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسجيل الدخول`)
};

export const auth_login_intro = /** @type {(inputs: Auth_Login_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم إدخال مستخدم تجريبي؛ يمكنك تبديل الدور في أي وقت من لوحة التحكم.`)
};

export const auth_or = /** @type {(inputs: Auth_OrInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أو`)
};

export const auth_passkey_use = /** @type {(inputs: Auth_Passkey_UseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استخدام مفتاح المرور`)
};

export const auth_passkey_waiting = /** @type {(inputs: Auth_Passkey_WaitingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`في انتظار جهازك…`)
};

export const auth_password_required = /** @type {(inputs: Auth_Password_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كلمة المرور *`)
};

export const auth_signing_in_as = /** @type {(inputs: Auth_Signing_In_AsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسجيل الدخول باسم`)
};

export const auth_verify_and_log_in = /** @type {(inputs: Auth_Verify_And_Log_InInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تحقق وسجّل الدخول`)
};

export const auth_verify_heading = /** @type {(inputs: Auth_Verify_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تأكيد هويتك`)
};

export const auth_verifying = /** @type {(inputs: Auth_VerifyingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ التحقق…`)
};

export const auth_welcome_back = /** @type {(inputs: Auth_Welcome_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مرحبًا بعودتك.`)
};

export const avatar_more = /** @type {(inputs: Avatar_MoreInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} آخرون`)
};

export const badge_status = /** @type {(inputs: Badge_StatusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الحالة`)
};

export const breadcrumbs_label = /** @type {(inputs: Breadcrumbs_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسار التنقل`)
};

export const bullet_band = /** @type {(inputs: Bullet_BandInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.quality}: ${i?.low}–${i?.high} · ${i?.reading}`)
};

export const bullet_label = /** @type {(inputs: Bullet_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مخطط الأداء مقابل المستهدف`)
};

export const bullet_quality_good = /** @type {(inputs: Bullet_Quality_GoodInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جيد`)
};

export const bullet_quality_ok = /** @type {(inputs: Bullet_Quality_OkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مقبول`)
};

export const bullet_quality_poor = /** @type {(inputs: Bullet_Quality_PoorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ضعيف`)
};

export const bullet_reading_of = /** @type {(inputs: Bullet_Reading_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} من ${i?.target}`)
};

export const bullet_reading_range = /** @type {(inputs: Bullet_Reading_RangeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} · ${i?.share} من ${i?.max}`)
};

export const bullet_reading_target = /** @type {(inputs: Bullet_Reading_TargetInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} من ${i?.target} · ${i?.share} من المستهدف`)
};

export const bullet_target = /** @type {(inputs: Bullet_TargetInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`المستهدف ${i?.target}`)
};

export const chart_range = /** @type {(inputs: Chart_RangeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النطاق`)
};

export const chart_series = /** @type {(inputs: Chart_SeriesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السلاسل`)
};

export const chart_target = /** @type {(inputs: Chart_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المستهدف`)
};

export const chart_total = /** @type {(inputs: Chart_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإجمالي`)
};

export const chip_remove = /** @type {(inputs: Chip_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إزالة`)
};

export const coachmark_back = /** @type {(inputs: Coachmark_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السابق`)
};

export const coachmark_close = /** @type {(inputs: Coachmark_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إغلاق`)
};

export const coachmark_finish = /** @type {(inputs: Coachmark_FinishInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إنهاء`)
};

export const coachmark_label = /** @type {(inputs: Coachmark_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جولة إرشادية`)
};

export const coachmark_next = /** @type {(inputs: Coachmark_NextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التالي`)
};

export const coachmark_skip = /** @type {(inputs: Coachmark_SkipInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تخطٍّ`)
};

export const coachmark_step = /** @type {(inputs: Coachmark_StepInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الخطوة ${i?.step} من ${i?.total}`)
};

export const column_picker_columns = /** @type {(inputs: Column_Picker_ColumnsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأعمدة`)
};

export const column_picker_density_compact = /** @type {(inputs: Column_Picker_Density_CompactInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مضغوط`)
};

export const column_picker_density_default = /** @type {(inputs: Column_Picker_Density_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`افتراضي`)
};

export const column_picker_density_dense = /** @type {(inputs: Column_Picker_Density_DenseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كثيف`)
};

export const column_picker_label = /** @type {(inputs: Column_Picker_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الأعمدة (المعروض ${i?.shown} من ${i?.total})`)
};

export const column_picker_move_earlier = /** @type {(inputs: Column_Picker_Move_EarlierInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`نقل ${i?.name} إلى الأمام`)
};

export const column_picker_move_later = /** @type {(inputs: Column_Picker_Move_LaterInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`نقل ${i?.name} إلى الخلف`)
};

export const column_picker_reset = /** @type {(inputs: Column_Picker_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إعادة تعيين`)
};

export const column_picker_row_height = /** @type {(inputs: Column_Picker_Row_HeightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ارتفاع الصف`)
};

export const combobox_add = /** @type {(inputs: Combobox_AddInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`إضافة «${i?.value}»`)
};

export const combobox_choose = /** @type {(inputs: Combobox_ChooseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختر…`)
};

export const combobox_clear = /** @type {(inputs: Combobox_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسح`)
};

export const combobox_no_matches = /** @type {(inputs: Combobox_No_MatchesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد نتائج مطابقة`)
};

export const combobox_nothing = /** @type {(inputs: Combobox_NothingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد خيارات`)
};

export const combobox_remove = /** @type {(inputs: Combobox_RemoveInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`إزالة ${i?.value}`)
};

export const combobox_type_to_add = /** @type {(inputs: Combobox_Type_To_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اكتب للإضافة`)
};

export const command_account_description = /** @type {(inputs: Command_Account_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملفك الشخصي وكلمة المرور`)
};

export const command_bookmark_add = /** @type {(inputs: Command_Bookmark_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إضافة هذه الصفحة إلى المفضلة`)
};

export const command_bookmark_description = /** @type {(inputs: Command_Bookmark_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تظهر المفضلة في اللوحة الجانبية`)
};

export const command_bookmark_keywords = /** @type {(inputs: Command_Bookmark_KeywordsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مفضلة, تثبيت`)
};

export const command_bookmark_remove = /** @type {(inputs: Command_Bookmark_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إزالة هذه الصفحة من المفضلة`)
};

export const command_collection_all = /** @type {(inputs: Command_Collection_AllInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`كل ${i?.plural}`)
};

export const command_contrast_description = /** @type {(inputs: Command_Contrast_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تمييز النصوص التي لا تحقق تباين WCAG AA، وكل ما يفيض أو يضيق عند هذا العرض`)
};

export const command_contrast_keywords = /** @type {(inputs: Command_Contrast_KeywordsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إمكانية الوصول, تباين, ألوان, تخطيط`)
};

export const command_contrast_title = /** @type {(inputs: Command_Contrast_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فحص التباين والتخطيط`)
};

export const command_create_description = /** @type {(inputs: Command_Create_DescriptionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`فتح نموذج ${i?.singular} فارغ`)
};

export const command_create_keywords = /** @type {(inputs: Command_Create_KeywordsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إضافة, جديد, إنشاء`)
};

export const command_create_title = /** @type {(inputs: Command_Create_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.singular} جديد`)
};

export const command_dashboard_description = /** @type {(inputs: Command_Dashboard_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يومك ومؤشرات الأداء والرسوم البيانية`)
};

export const command_dashboard_keywords = /** @type {(inputs: Command_Dashboard_KeywordsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لوحة التحكم, نظرة عامة, الرئيسية`)
};

export const command_group_accessibility = /** @type {(inputs: Command_Group_AccessibilityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إمكانية الوصول`)
};

export const command_group_configuration = /** @type {(inputs: Command_Group_ConfigurationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التهيئة`)
};

export const command_group_you = /** @type {(inputs: Command_Group_YouInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أنت`)
};

export const command_input_label = /** @type {(inputs: Command_Input_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ابحث في الإجراءات والصفحات والسجلات…`)
};

export const command_launcher_label = /** @type {(inputs: Command_Launcher_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ابحث في الإجراءات والصفحات والسجلات…`)
};

export const command_logout_keywords = /** @type {(inputs: Command_Logout_KeywordsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسجيل الخروج, خروج`)
};

export const command_navigate = /** @type {(inputs: Command_NavigateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تنقّل`)
};

export const command_no_results = /** @type {(inputs: Command_No_ResultsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`لا نتائج لـ «${i?.query}»`)
};

export const command_no_results_hint = /** @type {(inputs: Command_No_Results_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جرّب كلمات أخرى، فالبحث يفهم الكلمات ذات الصلة أيضًا.`)
};

export const command_open = /** @type {(inputs: Command_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فتح`)
};

export const command_related = /** @type {(inputs: Command_RelatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ذو صلة`)
};

export const command_results = /** @type {(inputs: Command_ResultsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`لا نتائج · بحث تقريبي ودلالي`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`نتيجة واحدة · بحث تقريبي ودلالي`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`نتيجتان · بحث تقريبي ودلالي`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} نتائج · بحث تقريبي ودلالي`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} نتيجة · بحث تقريبي ودلالي`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} نتيجة · بحث تقريبي ودلالي`)
};

export const command_section_actions = /** @type {(inputs: Command_Section_ActionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإجراءات`)
};

export const command_section_pages = /** @type {(inputs: Command_Section_PagesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الصفحات`)
};

export const command_section_records = /** @type {(inputs: Command_Section_RecordsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السجلات`)
};

export const command_suggest_actions = /** @type {(inputs: Command_Suggest_ActionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إجراءات سريعة`)
};

export const command_suggest_pages = /** @type {(inputs: Command_Suggest_PagesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`انتقال إلى`)
};

export const command_this_page = /** @type {(inputs: Command_This_PageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هذه الصفحة`)
};

export const command_type_to_search = /** @type {(inputs: Command_Type_To_SearchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اكتب للبحث · بحث تقريبي ودلالي`)
};

export const confirmation_allow = /** @type {(inputs: Confirmation_AllowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سماح`)
};

export const confirmation_allowed = /** @type {(inputs: Confirmation_AllowedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم السماح`)
};

export const confirmation_deny = /** @type {(inputs: Confirmation_DenyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عدم السماح`)
};

export const confirmation_label = /** @type {(inputs: Confirmation_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تأكيد`)
};

export const confirmation_not_allowed = /** @type {(inputs: Confirmation_Not_AllowedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يُسمح`)
};

export const contrast_audit_close = /** @type {(inputs: Contrast_Audit_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إغلاق`)
};

export const contrast_audit_fails = /** @type {(inputs: Contrast_Audit_FailsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`لا يوجد نص لا يستوفي WCAG AA`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`عنصر نصي واحد لا يستوفي WCAG AA`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`عنصران نصيان لا يستوفيان WCAG AA`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} عناصر نصية لا تستوفي WCAG AA`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} عنصرًا نصيًا لا يستوفي WCAG AA`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} عنصر نصي لا يستوفي WCAG AA`)
};

export const contrast_audit_fails_over_image = /** @type {(inputs: Contrast_Audit_Fails_Over_ImageInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`لا يوجد نص لا يستوفي WCAG AA · ${i?.overImage} فوق صورة الخلفية`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`عنصر نصي واحد لا يستوفي WCAG AA · ${i?.overImage} فوق صورة الخلفية`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`عنصران نصيان لا يستوفيان WCAG AA · ${i?.overImage} فوق صورة الخلفية`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} عناصر نصية لا تستوفي WCAG AA · ${i?.overImage} فوق صورة الخلفية`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} عنصرًا نصيًا لا يستوفي WCAG AA · ${i?.overImage} فوق صورة الخلفية`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} عنصر نصي لا يستوفي WCAG AA · ${i?.overImage} فوق صورة الخلفية`)
};

export const contrast_audit_filled = /** @type {(inputs: Contrast_Audit_FilledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`معبّأ`)
};

export const contrast_audit_filled_hint = /** @type {(inputs: Contrast_Audit_Filled_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`زر معبّأ: زر أو زران في كل شاشة على الأكثر`)
};

export const contrast_audit_filled_on_dialog = /** @type {(inputs: Contrast_Audit_Filled_On_DialogInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`لا أزرار معبّأة في مربع حوار`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`زر معبّأ واحد في مربع حوار`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`زران معبّآن في مربع حوار`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} أزرار معبّأة في مربع حوار`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} زرًا معبّأً في مربع حوار`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} زر معبّأ في مربع حوار`)
};

export const contrast_audit_filled_on_page = /** @type {(inputs: Contrast_Audit_Filled_On_PageInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`لا أزرار معبّأة في الصفحة`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`زر معبّأ واحد في الصفحة`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`زران معبّآن في الصفحة`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} أزرار معبّأة في الصفحة`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} زرًا معبّأً في الصفحة`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} زر معبّأ في الصفحة`)
};

export const contrast_audit_issue = /** @type {(inputs: Contrast_Audit_IssueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.color} على ${i?.background} — المطلوب ${i?.required}:1`)
};

export const contrast_audit_kind_cramped = /** @type {(inputs: Contrast_Audit_Kind_CrampedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ضيّق`)
};

export const contrast_audit_kind_escapes = /** @type {(inputs: Contrast_Audit_Kind_EscapesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يتجاوز إطاره`)
};

export const contrast_audit_kind_page_scroll = /** @type {(inputs: Contrast_Audit_Kind_Page_ScrollInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تمرير أفقي`)
};

export const contrast_audit_kind_squeezed = /** @type {(inputs: Contrast_Audit_Kind_SqueezedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مضغوط`)
};

export const contrast_audit_layout = /** @type {(inputs: Contrast_Audit_LayoutInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`لا مشكلات تخطيط عند عرض ${i?.px} بكسل: اسمح له بالالتفاف أو التقلص.`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`مشكلة تخطيط واحدة عند عرض ${i?.px} بكسل: اسمح له بالالتفاف أو التقلص.`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`مشكلتا تخطيط عند عرض ${i?.px} بكسل: اسمح له بالالتفاف أو التقلص.`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} مشكلات تخطيط عند عرض ${i?.px} بكسل: اسمح له بالالتفاف أو التقلص.`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} مشكلة تخطيط عند عرض ${i?.px} بكسل: اسمح له بالالتفاف أو التقلص.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} مشكلة تخطيط عند عرض ${i?.px} بكسل: اسمح له بالالتفاف أو التقلص.`)
};

export const contrast_audit_passes = /** @type {(inputs: Contrast_Audit_PassesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كل ما على الشاشة يستوفي WCAG AA (4.5:1، والنص الكبير 3:1).`)
};

export const contrast_audit_prominence = /** @type {(inputs: Contrast_Audit_ProminenceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.places}: أبقِ زرًا أو زرين، واجعل البقية بلون خفيف (variant="soft").`)
};

export const contrast_audit_ratio = /** @type {(inputs: Contrast_Audit_RatioInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.ratio}:1`)
};

export const contrast_audit_rerun = /** @type {(inputs: Contrast_Audit_RerunInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إعادة الفحص`)
};

export const contrast_audit_title = /** @type {(inputs: Contrast_Audit_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فحص التباين`)
};

export const countdown_due_now = /** @type {(inputs: Countdown_Due_NowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مستحق الآن`)
};

export const countdown_just_overdue = /** @type {(inputs: Countdown_Just_OverdueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تأخر للتو`)
};

export const countdown_left_days = /** @type {(inputs: Countdown_Left_DaysInputs) => LocalizedString} */ (i) => {
	const daysPlural = __paraglideRegistry.plural("ar", i?.days, {}, true);
	if (daysPlural === "zero") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} يوم`);
	if (daysPlural === "one") return /** @type {LocalizedString} */ (`متبقٍ يوم واحد`);
	if (daysPlural === "two") return /** @type {LocalizedString} */ (`متبقٍ يومان`);
	if (daysPlural === "few") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} أيام`);
	if (daysPlural === "many") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} يومًا`);
	return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} يوم`)
};

export const countdown_left_days_hours = /** @type {(inputs: Countdown_Left_Days_HoursInputs) => LocalizedString} */ (i) => {
	const daysPlural = __paraglideRegistry.plural("ar", i?.days, {}, true);
	const hoursPlural = __paraglideRegistry.plural("ar", i?.hours, {}, true);
	if (daysPlural === "zero" && hoursPlural === "zero") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} يوم و${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة`);
	if (daysPlural === "one" && hoursPlural === "zero") return /** @type {LocalizedString} */ (`متبقٍ يوم واحد و${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة`);
	if (daysPlural === "two" && hoursPlural === "zero") return /** @type {LocalizedString} */ (`متبقٍ يومان و${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة`);
	if (daysPlural === "few" && hoursPlural === "zero") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} أيام و${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة`);
	if (daysPlural === "many" && hoursPlural === "zero") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} يومًا و${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة`);
	if (daysPlural === "zero" && hoursPlural === "one") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} يوم وساعة واحدة`);
	if (daysPlural === "one" && hoursPlural === "one") return /** @type {LocalizedString} */ (`متبقٍ يوم واحد وساعة واحدة`);
	if (daysPlural === "two" && hoursPlural === "one") return /** @type {LocalizedString} */ (`متبقٍ يومان وساعة واحدة`);
	if (daysPlural === "few" && hoursPlural === "one") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} أيام وساعة واحدة`);
	if (daysPlural === "many" && hoursPlural === "one") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} يومًا وساعة واحدة`);
	if (daysPlural === "zero" && hoursPlural === "two") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} يوم وساعتان`);
	if (daysPlural === "one" && hoursPlural === "two") return /** @type {LocalizedString} */ (`متبقٍ يوم واحد وساعتان`);
	if (daysPlural === "two" && hoursPlural === "two") return /** @type {LocalizedString} */ (`متبقٍ يومان وساعتان`);
	if (daysPlural === "few" && hoursPlural === "two") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} أيام وساعتان`);
	if (daysPlural === "many" && hoursPlural === "two") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} يومًا وساعتان`);
	if (daysPlural === "zero" && hoursPlural === "few") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} يوم و${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعات`);
	if (daysPlural === "one" && hoursPlural === "few") return /** @type {LocalizedString} */ (`متبقٍ يوم واحد و${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعات`);
	if (daysPlural === "two" && hoursPlural === "few") return /** @type {LocalizedString} */ (`متبقٍ يومان و${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعات`);
	if (daysPlural === "few" && hoursPlural === "few") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} أيام و${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعات`);
	if (daysPlural === "many" && hoursPlural === "few") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} يومًا و${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعات`);
	if (daysPlural === "zero" && hoursPlural === "many") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} يوم و${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة`);
	if (daysPlural === "one" && hoursPlural === "many") return /** @type {LocalizedString} */ (`متبقٍ يوم واحد و${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة`);
	if (daysPlural === "two" && hoursPlural === "many") return /** @type {LocalizedString} */ (`متبقٍ يومان و${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة`);
	if (daysPlural === "few" && hoursPlural === "many") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} أيام و${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة`);
	if (daysPlural === "many" && hoursPlural === "many") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} يومًا و${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة`);
	if (daysPlural === "zero") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} يوم و${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة`);
	if (daysPlural === "one") return /** @type {LocalizedString} */ (`متبقٍ يوم واحد و${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة`);
	if (daysPlural === "two") return /** @type {LocalizedString} */ (`متبقٍ يومان و${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة`);
	if (daysPlural === "few") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} أيام و${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة`);
	if (daysPlural === "many") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} يومًا و${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة`);
	if (hoursPlural === "zero") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} يوم و${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة`);
	if (hoursPlural === "one") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} يوم وساعة واحدة`);
	if (hoursPlural === "two") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} يوم وساعتان`);
	if (hoursPlural === "few") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} يوم و${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعات`);
	if (hoursPlural === "many") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} يوم و${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة`);
	return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.days, {})} يوم و${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة`)
};

export const countdown_left_hours = /** @type {(inputs: Countdown_Left_HoursInputs) => LocalizedString} */ (i) => {
	const hoursPlural = __paraglideRegistry.plural("ar", i?.hours, {}, true);
	if (hoursPlural === "zero") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة`);
	if (hoursPlural === "one") return /** @type {LocalizedString} */ (`متبقٍ ساعة واحدة`);
	if (hoursPlural === "two") return /** @type {LocalizedString} */ (`متبقٍ ساعتان`);
	if (hoursPlural === "few") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعات`);
	if (hoursPlural === "many") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة`);
	return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة`)
};

export const countdown_left_hours_minutes = /** @type {(inputs: Countdown_Left_Hours_MinutesInputs) => LocalizedString} */ (i) => {
	const hoursPlural = __paraglideRegistry.plural("ar", i?.hours, {}, true);
	const minutesPlural = __paraglideRegistry.plural("ar", i?.minutes, {}, true);
	if (hoursPlural === "zero" && minutesPlural === "zero") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة و${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقيقة`);
	if (hoursPlural === "one" && minutesPlural === "zero") return /** @type {LocalizedString} */ (`متبقٍ ساعة واحدة و${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقيقة`);
	if (hoursPlural === "two" && minutesPlural === "zero") return /** @type {LocalizedString} */ (`متبقٍ ساعتان و${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقيقة`);
	if (hoursPlural === "few" && minutesPlural === "zero") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعات و${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقيقة`);
	if (hoursPlural === "many" && minutesPlural === "zero") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة و${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقيقة`);
	if (hoursPlural === "zero" && minutesPlural === "one") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة ودقيقة واحدة`);
	if (hoursPlural === "one" && minutesPlural === "one") return /** @type {LocalizedString} */ (`متبقٍ ساعة واحدة ودقيقة واحدة`);
	if (hoursPlural === "two" && minutesPlural === "one") return /** @type {LocalizedString} */ (`متبقٍ ساعتان ودقيقة واحدة`);
	if (hoursPlural === "few" && minutesPlural === "one") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعات ودقيقة واحدة`);
	if (hoursPlural === "many" && minutesPlural === "one") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة ودقيقة واحدة`);
	if (hoursPlural === "zero" && minutesPlural === "two") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة ودقيقتان`);
	if (hoursPlural === "one" && minutesPlural === "two") return /** @type {LocalizedString} */ (`متبقٍ ساعة واحدة ودقيقتان`);
	if (hoursPlural === "two" && minutesPlural === "two") return /** @type {LocalizedString} */ (`متبقٍ ساعتان ودقيقتان`);
	if (hoursPlural === "few" && minutesPlural === "two") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعات ودقيقتان`);
	if (hoursPlural === "many" && minutesPlural === "two") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة ودقيقتان`);
	if (hoursPlural === "zero" && minutesPlural === "few") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة و${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقائق`);
	if (hoursPlural === "one" && minutesPlural === "few") return /** @type {LocalizedString} */ (`متبقٍ ساعة واحدة و${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقائق`);
	if (hoursPlural === "two" && minutesPlural === "few") return /** @type {LocalizedString} */ (`متبقٍ ساعتان و${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقائق`);
	if (hoursPlural === "few" && minutesPlural === "few") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعات و${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقائق`);
	if (hoursPlural === "many" && minutesPlural === "few") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة و${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقائق`);
	if (hoursPlural === "zero" && minutesPlural === "many") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة و${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقيقة`);
	if (hoursPlural === "one" && minutesPlural === "many") return /** @type {LocalizedString} */ (`متبقٍ ساعة واحدة و${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقيقة`);
	if (hoursPlural === "two" && minutesPlural === "many") return /** @type {LocalizedString} */ (`متبقٍ ساعتان و${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقيقة`);
	if (hoursPlural === "few" && minutesPlural === "many") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعات و${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقيقة`);
	if (hoursPlural === "many" && minutesPlural === "many") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة و${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقيقة`);
	if (hoursPlural === "zero") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة و${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقيقة`);
	if (hoursPlural === "one") return /** @type {LocalizedString} */ (`متبقٍ ساعة واحدة و${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقيقة`);
	if (hoursPlural === "two") return /** @type {LocalizedString} */ (`متبقٍ ساعتان و${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقيقة`);
	if (hoursPlural === "few") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعات و${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقيقة`);
	if (hoursPlural === "many") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة و${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقيقة`);
	if (minutesPlural === "zero") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة و${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقيقة`);
	if (minutesPlural === "one") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة ودقيقة واحدة`);
	if (minutesPlural === "two") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة ودقيقتان`);
	if (minutesPlural === "few") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة و${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقائق`);
	if (minutesPlural === "many") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة و${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقيقة`);
	return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة و${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقيقة`)
};

export const countdown_left_minutes = /** @type {(inputs: Countdown_Left_MinutesInputs) => LocalizedString} */ (i) => {
	const minutesPlural = __paraglideRegistry.plural("ar", i?.minutes, {}, true);
	if (minutesPlural === "zero") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقيقة`);
	if (minutesPlural === "one") return /** @type {LocalizedString} */ (`متبقٍ دقيقة واحدة`);
	if (minutesPlural === "two") return /** @type {LocalizedString} */ (`متبقٍ دقيقتان`);
	if (minutesPlural === "few") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقائق`);
	if (minutesPlural === "many") return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقيقة`);
	return /** @type {LocalizedString} */ (`متبقٍ ${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقيقة`)
};

export const countdown_overdue = /** @type {(inputs: Countdown_OverdueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.what} متأخر.`)
};

export const countdown_overdue_days = /** @type {(inputs: Countdown_Overdue_DaysInputs) => LocalizedString} */ (i) => {
	const daysPlural = __paraglideRegistry.plural("ar", i?.days, {}, true);
	if (daysPlural === "zero") return /** @type {LocalizedString} */ (`متأخر ${__paraglideRegistry.icuPound("ar", i?.days, {})} يوم`);
	if (daysPlural === "one") return /** @type {LocalizedString} */ (`متأخر يوم واحد`);
	if (daysPlural === "two") return /** @type {LocalizedString} */ (`متأخر يومان`);
	if (daysPlural === "few") return /** @type {LocalizedString} */ (`متأخر ${__paraglideRegistry.icuPound("ar", i?.days, {})} أيام`);
	if (daysPlural === "many") return /** @type {LocalizedString} */ (`متأخر ${__paraglideRegistry.icuPound("ar", i?.days, {})} يومًا`);
	return /** @type {LocalizedString} */ (`متأخر ${__paraglideRegistry.icuPound("ar", i?.days, {})} يوم`)
};

export const countdown_overdue_hours = /** @type {(inputs: Countdown_Overdue_HoursInputs) => LocalizedString} */ (i) => {
	const hoursPlural = __paraglideRegistry.plural("ar", i?.hours, {}, true);
	if (hoursPlural === "zero") return /** @type {LocalizedString} */ (`متأخر ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة`);
	if (hoursPlural === "one") return /** @type {LocalizedString} */ (`متأخر ساعة واحدة`);
	if (hoursPlural === "two") return /** @type {LocalizedString} */ (`متأخر ساعتان`);
	if (hoursPlural === "few") return /** @type {LocalizedString} */ (`متأخر ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعات`);
	if (hoursPlural === "many") return /** @type {LocalizedString} */ (`متأخر ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة`);
	return /** @type {LocalizedString} */ (`متأخر ${__paraglideRegistry.icuPound("ar", i?.hours, {})} ساعة`)
};

export const countdown_overdue_minutes = /** @type {(inputs: Countdown_Overdue_MinutesInputs) => LocalizedString} */ (i) => {
	const minutesPlural = __paraglideRegistry.plural("ar", i?.minutes, {}, true);
	if (minutesPlural === "zero") return /** @type {LocalizedString} */ (`متأخر ${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقيقة`);
	if (minutesPlural === "one") return /** @type {LocalizedString} */ (`متأخر دقيقة واحدة`);
	if (minutesPlural === "two") return /** @type {LocalizedString} */ (`متأخر دقيقتان`);
	if (minutesPlural === "few") return /** @type {LocalizedString} */ (`متأخر ${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقائق`);
	if (minutesPlural === "many") return /** @type {LocalizedString} */ (`متأخر ${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقيقة`);
	return /** @type {LocalizedString} */ (`متأخر ${__paraglideRegistry.icuPound("ar", i?.minutes, {})} دقيقة`)
};

export const countdown_under_a_minute = /** @type {(inputs: Countdown_Under_A_MinuteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`متبقٍ أقل من دقيقة`)
};

export const date_input_clear = /** @type {(inputs: Date_Input_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسح`)
};

export const date_input_in_a_week = /** @type {(inputs: Date_Input_In_A_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بعد أسبوع`)
};

export const date_input_picks = /** @type {(inputs: Date_Input_PicksInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختيارات سريعة`)
};

export const date_input_picks_for = /** @type {(inputs: Date_Input_Picks_ForInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`اختيارات سريعة: ${i?.label}`)
};

export const date_input_said = /** @type {(inputs: Date_Input_SaidInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.date} · ${i?.relative}`)
};

export const date_input_said_time = /** @type {(inputs: Date_Input_Said_TimeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.date}، ${i?.time} · ${i?.relative}`)
};

export const date_input_today = /** @type {(inputs: Date_Input_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اليوم`)
};

export const date_input_tomorrow = /** @type {(inputs: Date_Input_TomorrowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`غدًا`)
};

export const dial_label = /** @type {(inputs: Dial_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مؤشر`)
};

export const dial_range = /** @type {(inputs: Dial_RangeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.low}–${i?.high}`)
};

export const dial_reading = /** @type {(inputs: Dial_ReadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} · ${i?.share} من ${i?.min}–${i?.max}`)
};

export const dial_zone = /** @type {(inputs: Dial_ZoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.zone}: ${i?.low}–${i?.high}`)
};

export const doc_form_add_block = /** @type {(inputs: Doc_Form_Add_BlockInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`+ إضافة كتلة`)
};

export const doc_form_add_named = /** @type {(inputs: Doc_Form_Add_NamedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`+ إضافة ${i?.name}`)
};

export const doc_form_block_name = /** @type {(inputs: Doc_Form_Block_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الاسم`)
};

export const doc_form_choose = /** @type {(inputs: Doc_Form_ChooseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختر…`)
};

export const doc_form_collapse_all = /** @type {(inputs: Doc_Form_Collapse_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طي الكل`)
};

export const doc_form_collapse_row = /** @type {(inputs: Doc_Form_Collapse_RowInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`طي ${i?.kind} ${i?.number}`)
};

export const doc_form_create_new = /** @type {(inputs: Doc_Form_Create_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`+ إنشاء جديد`)
};

export const doc_form_details = /** @type {(inputs: Doc_Form_DetailsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التفاصيل`)
};

export const doc_form_duplicate = /** @type {(inputs: Doc_Form_DuplicateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تكرار`)
};

export const doc_form_errors = /** @type {(inputs: Doc_Form_ErrorsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`لا أخطاء`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`خطأ واحد`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`خطآن`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} أخطاء`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} خطأً`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} خطأ`)
};

export const doc_form_expand_all = /** @type {(inputs: Doc_Form_Expand_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`توسيع الكل`)
};

export const doc_form_expand_row = /** @type {(inputs: Doc_Form_Expand_RowInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`توسيع ${i?.kind} ${i?.number}`)
};

export const doc_form_join_showing = /** @type {(inputs: Doc_Form_Join_ShowingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`عرض ${i?.shown} من ${i?.total}.`)
};

export const doc_form_json_invalid = /** @type {(inputs: Doc_Form_Json_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صيغة JSON غير صحيحة بعد؛ تُحفظ عند تصحيحها.`)
};

export const doc_form_latitude = /** @type {(inputs: Doc_Form_LatitudeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خط العرض`)
};

export const doc_form_longitude = /** @type {(inputs: Doc_Form_LongitudeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خط الطول`)
};

export const doc_form_move_down = /** @type {(inputs: Doc_Form_Move_DownInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نقل لأسفل`)
};

export const doc_form_move_up = /** @type {(inputs: Doc_Form_Move_UpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نقل لأعلى`)
};

export const doc_form_new = /** @type {(inputs: Doc_Form_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`+ جديد`)
};

export const doc_form_no = /** @type {(inputs: Doc_Form_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا`)
};

export const doc_form_none_yet = /** @type {(inputs: Doc_Form_None_YetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد بعد.`)
};

export const doc_form_open = /** @type {(inputs: Doc_Form_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فتح`)
};

export const doc_form_optional = /** @type {(inputs: Doc_Form_OptionalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختياري`)
};

export const doc_form_remove = /** @type {(inputs: Doc_Form_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إزالة`)
};

export const doc_form_row = /** @type {(inputs: Doc_Form_RowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صف`)
};

export const doc_form_row_actions = /** @type {(inputs: Doc_Form_Row_ActionsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`إجراءات ${i?.kind} ${i?.number}`)
};

export const doc_form_row_title = /** @type {(inputs: Doc_Form_Row_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.kind} ${i?.number}`)
};

export const doc_form_rows_at_least = /** @type {(inputs: Doc_Form_Rows_At_LeastInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.min} على الأقل`)
};

export const doc_form_rows_empty = /** @type {(inputs: Doc_Form_Rows_EmptyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`لا يوجد ${i?.items} بعد.`)
};

export const doc_form_rows_max = /** @type {(inputs: Doc_Form_Rows_MaxInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الحد الأقصى من ${i?.items} هو ${i?.max}.`)
};

export const doc_form_rows_up_to = /** @type {(inputs: Doc_Form_Rows_Up_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`حتى ${i?.max}`)
};

export const doc_form_suggest_failed = /** @type {(inputs: Doc_Form_Suggest_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تعذّر على الذكاء الاصطناعي اقتراح إجابة هذه المرة. حاول مجددًا بعد قليل.`)
};

export const doc_form_suggest_nothing = /** @type {(inputs: Doc_Form_Suggest_NothingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا شيء في النموذج يدل على إجابة بعد. أكمل المزيد ثم حاول مجددًا.`)
};

export const doc_form_tab_errors = /** @type {(inputs: Doc_Form_Tab_ErrorsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`${i?.label} · لا أخطاء`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.label} · خطأ واحد`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`${i?.label} · خطآن`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${i?.label} · ${__paraglideRegistry.icuPound("ar", i?.count, {})} أخطاء`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${i?.label} · ${__paraglideRegistry.icuPound("ar", i?.count, {})} خطأً`);
	return /** @type {LocalizedString} */ (`${i?.label} · ${__paraglideRegistry.icuPound("ar", i?.count, {})} خطأ`)
};

export const doc_form_type_enter = /** @type {(inputs: Doc_Form_Type_EnterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اكتب ثم اضغط Enter`)
};

export const doc_form_type_number_enter = /** @type {(inputs: Doc_Form_Type_Number_EnterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اكتب رقمًا ثم اضغط Enter`)
};

export const doc_form_unit_days = /** @type {(inputs: Doc_Form_Unit_DaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يوم`)
};

export const doc_form_unsupported = /** @type {(inputs: Doc_Form_UnsupportedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.label}: نوع حقل غير مدعوم "${i?.type}"`)
};

export const doc_form_yes = /** @type {(inputs: Doc_Form_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نعم`)
};

export const dropdown_more_info = /** @type {(inputs: Dropdown_More_InfoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مزيد من المعلومات`)
};

export const edit_view_account = /** @type {(inputs: Edit_View_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الحساب`)
};

export const edit_view_cannot_undo = /** @type {(inputs: Edit_View_Cannot_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يمكن التراجع عن هذا.`)
};

export const edit_view_create = /** @type {(inputs: Edit_View_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إنشاء`)
};

export const edit_view_create_title = /** @type {(inputs: Edit_View_Create_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`إنشاء ${i?.what}`)
};

export const edit_view_created = /** @type {(inputs: Edit_View_CreatedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أُنشئ ${i?.date}`)
};

export const edit_view_dashboard = /** @type {(inputs: Edit_View_DashboardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لوحة التحكم`)
};

export const edit_view_delete = /** @type {(inputs: Edit_View_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حذف`)
};

export const edit_view_delete_confirm = /** @type {(inputs: Edit_View_Delete_ConfirmInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`حذف ${i?.what}؟`)
};

export const edit_view_details = /** @type {(inputs: Edit_View_DetailsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التفاصيل`)
};

export const edit_view_file_required = /** @type {(inputs: Edit_View_File_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الملف *`)
};

export const edit_view_id = /** @type {(inputs: Edit_View_IdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المعرّف`)
};

export const edit_view_link = /** @type {(inputs: Edit_View_LinkInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.field}: ${i?.name}`)
};

export const edit_view_new_password = /** @type {(inputs: Edit_View_New_PasswordInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كلمة مرور جديدة`)
};

export const edit_view_new_title = /** @type {(inputs: Edit_View_New_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`إضافة ${i?.what}`)
};

export const edit_view_not_found = /** @type {(inputs: Edit_View_Not_FoundInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`غير موجود`)
};

export const edit_view_not_found_body = /** @type {(inputs: Edit_View_Not_Found_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هذا المستند غير موجود أو لا تملك صلاحية قراءته.`)
};

export const edit_view_password_hint = /** @type {(inputs: Edit_View_Password_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اتركها فارغة للإبقاء على كلمة المرور الحالية.`)
};

export const edit_view_password_required = /** @type {(inputs: Edit_View_Password_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كلمة المرور *`)
};

export const edit_view_problem = /** @type {(inputs: Edit_View_ProblemInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.field}: ${i?.message}`)
};

export const edit_view_problems = /** @type {(inputs: Edit_View_ProblemsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`لا حقول تحتاج إلى مراجعة`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`حقل واحد يحتاج إلى مراجعة`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`حقلان يحتاجان إلى مراجعة`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} حقول تحتاج إلى مراجعة`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} حقلًا تحتاج إلى مراجعة`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} حقل تحتاج إلى مراجعة`)
};

export const edit_view_read_only = /** @type {(inputs: Edit_View_Read_OnlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`للقراءة فقط`)
};

export const edit_view_replace_file = /** @type {(inputs: Edit_View_Replace_FileInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استبدال الملف`)
};

export const edit_view_save = /** @type {(inputs: Edit_View_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حفظ`)
};

export const edit_view_save_shortcut = /** @type {(inputs: Edit_View_Save_ShortcutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ctrl + S`)
};

export const edit_view_saved = /** @type {(inputs: Edit_View_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم الحفظ`)
};

export const edit_view_saving = /** @type {(inputs: Edit_View_SavingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ الحفظ…`)
};

export const edit_view_screen_loading = /** @type {(inputs: Edit_View_Screen_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ تحميل هذه الشاشة.`)
};

export const edit_view_sections = /** @type {(inputs: Edit_View_SectionsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أقسام ${i?.what}`)
};

export const edit_view_setting = /** @type {(inputs: Edit_View_SettingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إعداد`)
};

export const edit_view_unsaved = /** @type {(inputs: Edit_View_UnsavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تغييرات غير محفوظة`)
};

export const edit_view_updated = /** @type {(inputs: Edit_View_UpdatedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`عُدّل ${i?.date}`)
};

export const empty_state_loading = /** @type {(inputs: Empty_State_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ التحميل`)
};

export const fab_close = /** @type {(inputs: Fab_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إغلاق`)
};

export const field_about = /** @type {(inputs: Field_AboutInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`معلومات عن ${i?.label}`)
};

export const field_about_this = /** @type {(inputs: Field_About_ThisInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`معلومات عن هذا الحقل`)
};

export const field_count_of = /** @type {(inputs: Field_Count_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} / ${i?.max}`)
};

export const field_error_at_least_one = /** @type {(inputs: Field_Error_At_Least_OneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أضف عنصرًا واحدًا على الأقل.`)
};

export const field_error_check = /** @type {(inputs: Field_Error_CheckInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`راجع هذه القيمة.`)
};

export const field_error_date = /** @type {(inputs: Field_Error_DateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختر تاريخًا.`)
};

export const field_error_email = /** @type {(inputs: Field_Error_EmailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بريد إلكتروني، مثل name@company.com.`)
};

export const field_error_max = /** @type {(inputs: Field_Error_MaxInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.max} أو أقل.`)
};

export const field_error_max_length = /** @type {(inputs: Field_Error_Max_LengthInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`لا يزيد عن ${__paraglideRegistry.icuPound("ar", i?.count, {})} حرف.`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`حرف واحد على الأكثر.`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`حرفان على الأكثر.`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} أحرف على الأكثر.`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} حرفًا على الأكثر.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} حرف على الأكثر.`)
};

export const field_error_max_rows = /** @type {(inputs: Field_Error_Max_RowsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`لا يزيد عن ${__paraglideRegistry.icuPound("ar", i?.count, {})} صف.`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`صف واحد على الأكثر.`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`صفان على الأكثر.`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} صفوف على الأكثر.`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} صفًا على الأكثر.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} صف على الأكثر.`)
};

export const field_error_min = /** @type {(inputs: Field_Error_MinInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.min} أو أكثر.`)
};

export const field_error_min_length = /** @type {(inputs: Field_Error_Min_LengthInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`لا يقل عن ${__paraglideRegistry.icuPound("ar", i?.count, {})} حرف.`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`حرف واحد على الأقل.`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`حرفان على الأقل.`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} أحرف على الأقل.`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} حرفًا على الأقل.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} حرف على الأقل.`)
};

export const field_error_min_rows = /** @type {(inputs: Field_Error_Min_RowsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`لا يقل عن ${__paraglideRegistry.icuPound("ar", i?.count, {})} صف.`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`صف واحد على الأقل.`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`صفان على الأقل.`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} صفوف على الأقل.`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} صفًا على الأقل.`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.count, {})} صف على الأقل.`)
};

export const field_error_number = /** @type {(inputs: Field_Error_NumberInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`رقم.`)
};

export const field_error_option = /** @type {(inputs: Field_Error_OptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختر أحد الخيارات.`)
};

export const field_error_required = /** @type {(inputs: Field_Error_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`املأ هذا الحقل للحفظ.`)
};

export const field_error_text = /** @type {(inputs: Field_Error_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نص فقط.`)
};

export const field_required_pill = /** @type {(inputs: Field_Required_PillInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مطلوب`)
};

export const field_suggest = /** @type {(inputs: Field_SuggestInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`اقتراح ${i?.label}`)
};

export const field_suggest_answer = /** @type {(inputs: Field_Suggest_AnswerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اقتراح إجابة`)
};

export const field_suggestion_dismiss = /** @type {(inputs: Field_Suggestion_DismissInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تجاهل الاقتراح`)
};

export const field_suggestion_use = /** @type {(inputs: Field_Suggestion_UseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استخدام`)
};

export const field_suggestion_use_label = /** @type {(inputs: Field_Suggestion_Use_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مقترح: ${i?.suggestion}. استخدمه`)
};

export const filter_builder_add_filter = /** @type {(inputs: Filter_Builder_Add_FilterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إضافة تصفية`)
};

export const filter_builder_clear = /** @type {(inputs: Filter_Builder_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسح التصفية`)
};

export const filter_builder_field = /** @type {(inputs: Filter_Builder_FieldInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الحقل`)
};

export const filter_builder_filter = /** @type {(inputs: Filter_Builder_FilterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تصفية`)
};

export const filter_builder_is = /** @type {(inputs: Filter_Builder_IsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الشرط`)
};

export const filter_builder_match = /** @type {(inputs: Filter_Builder_MatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المطابقة`)
};

export const filter_builder_match_all = /** @type {(inputs: Filter_Builder_Match_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الكل`)
};

export const filter_builder_match_any = /** @type {(inputs: Filter_Builder_Match_AnyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أيٌّ منها`)
};

export const filter_builder_op_after = /** @type {(inputs: Filter_Builder_Op_AfterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بعد`)
};

export const filter_builder_op_any_of = /** @type {(inputs: Filter_Builder_Op_Any_OfInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أحد`)
};

export const filter_builder_op_before = /** @type {(inputs: Filter_Builder_Op_BeforeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قبل`)
};

export const filter_builder_op_contains = /** @type {(inputs: Filter_Builder_Op_ContainsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يحتوي على`)
};

export const filter_builder_op_is = /** @type {(inputs: Filter_Builder_Op_IsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يساوي`)
};

export const filter_builder_op_is_empty = /** @type {(inputs: Filter_Builder_Op_Is_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فارغ`)
};

export const filter_builder_op_is_not = /** @type {(inputs: Filter_Builder_Op_Is_NotInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يساوي`)
};

export const filter_builder_op_is_set = /** @type {(inputs: Filter_Builder_Op_Is_SetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`محدد`)
};

export const filter_builder_op_no = /** @type {(inputs: Filter_Builder_Op_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا`)
};

export const filter_builder_op_none_of = /** @type {(inputs: Filter_Builder_Op_None_OfInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ليس أيًّا من`)
};

export const filter_builder_op_not_contains = /** @type {(inputs: Filter_Builder_Op_Not_ContainsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يحتوي على`)
};

export const filter_builder_op_yes = /** @type {(inputs: Filter_Builder_Op_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نعم`)
};

export const filter_builder_remove = /** @type {(inputs: Filter_Builder_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إزالة`)
};

export const filter_builder_remove_filter = /** @type {(inputs: Filter_Builder_Remove_FilterInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`إزالة التصفية: ${i?.field}`)
};

export const filter_builder_search_options = /** @type {(inputs: Filter_Builder_Search_OptionsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`بحث في ${i?.field}`)
};

export const filter_builder_update = /** @type {(inputs: Filter_Builder_UpdateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تحديث`)
};

export const filter_builder_value = /** @type {(inputs: Filter_Builder_ValueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`القيمة`)
};

export const filter_builder_values_more = /** @type {(inputs: Filter_Builder_Values_MoreInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.values} +${i?.count}`)
};

export const frame_collapse = /** @type {(inputs: Frame_CollapseInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`طي ${i?.what}`)
};

export const frame_drag_to_close = /** @type {(inputs: Frame_Drag_To_CloseInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`اسحب لإغلاق ${i?.what}`)
};

export const frame_drag_to_open = /** @type {(inputs: Frame_Drag_To_OpenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`اسحب لفتح ${i?.what}`)
};

export const frame_expand = /** @type {(inputs: Frame_ExpandInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`توسيع ${i?.what}`)
};

export const frame_resize = /** @type {(inputs: Frame_ResizeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تغيير الحجم`)
};

export const frame_resize_to_close = /** @type {(inputs: Frame_Resize_To_CloseInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`غيّر الحجم لإغلاق ${i?.what}`)
};

export const frame_resize_to_open = /** @type {(inputs: Frame_Resize_To_OpenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`غيّر الحجم لفتح ${i?.what}`)
};

export const frame_show_icons = /** @type {(inputs: Frame_Show_IconsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`عرض أيقونات ${i?.what}`)
};

export const funnel_caption = /** @type {(inputs: Funnel_CaptionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.share} من ${i?.from} تصل إلى ${i?.to}`)
};

export const funnel_step = /** @type {(inputs: Funnel_StepInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.share} ${i?.step}`)
};

export const funnel_step_went_on = /** @type {(inputs: Funnel_Step_Went_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تابعت`)
};

export const gauge_label = /** @type {(inputs: Gauge_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مقياس`)
};

export const gauge_value_of = /** @type {(inputs: Gauge_Value_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} من ${i?.max}`)
};

export const heatmap_label = /** @type {(inputs: Heatmap_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خريطة حرارية`)
};

export const heatmap_less = /** @type {(inputs: Heatmap_LessInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أقل`)
};

export const heatmap_more = /** @type {(inputs: Heatmap_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أكثر`)
};

export const kanban_column = /** @type {(inputs: Kanban_ColumnInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`${i?.column}، لا توجد بطاقات`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.column}، بطاقة واحدة`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`${i?.column}، بطاقتان`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${i?.column}، ${__paraglideRegistry.icuPound("ar", i?.count, {})} بطاقات`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${i?.column}، ${__paraglideRegistry.icuPound("ar", i?.count, {})} بطاقة`);
	return /** @type {LocalizedString} */ (`${i?.column}، ${__paraglideRegistry.icuPound("ar", i?.count, {})} بطاقة`)
};

export const kanban_dragging = /** @type {(inputs: Kanban_DraggingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`جارٍ سحب ${i?.card}. أفلِته على عمود، أو اضغط Escape للإلغاء.`)
};

export const kanban_moved = /** @type {(inputs: Kanban_MovedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`نُقل إلى ${i?.column}.`)
};

export const kanban_not_moved = /** @type {(inputs: Kanban_Not_MovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم يُنقل.`)
};

export const layout_cramped = /** @type {(inputs: Layout_CrampedInputs) => LocalizedString} */ (i) => {
	const linesPlural = __paraglideRegistry.plural("ar", i?.lines, {}, true);
	if (linesPlural === "zero") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.lines, {})} سطر في ${i?.px} بكسل`);
	if (linesPlural === "one") return /** @type {LocalizedString} */ (`سطر واحد في ${i?.px} بكسل`);
	if (linesPlural === "two") return /** @type {LocalizedString} */ (`سطران في ${i?.px} بكسل`);
	if (linesPlural === "few") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.lines, {})} أسطر في ${i?.px} بكسل`);
	if (linesPlural === "many") return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.lines, {})} سطرًا في ${i?.px} بكسل`);
	return /** @type {LocalizedString} */ (`${__paraglideRegistry.icuPound("ar", i?.lines, {})} سطر في ${i?.px} بكسل`)
};

export const layout_escapes = /** @type {(inputs: Layout_EscapesInputs) => LocalizedString} */ (i) => {
	if (i?.box === "list_row") return /** @type {LocalizedString} */ (`يتجاوز صف القائمة بمقدار ${i?.px} بكسل`);
	if (i?.box === "card") return /** @type {LocalizedString} */ (`يتجاوز البطاقة بمقدار ${i?.px} بكسل`);
	if (i?.box === "page") return /** @type {LocalizedString} */ (`يتجاوز الصفحة بمقدار ${i?.px} بكسل`);
	if (i?.box === "dialog") return /** @type {LocalizedString} */ (`يتجاوز مربع الحوار بمقدار ${i?.px} بكسل`);
	if (i?.box === "component") return /** @type {LocalizedString} */ (`يتجاوز ${i?.name} بمقدار ${i?.px} بكسل`);
	return /** @type {LocalizedString} */ (`يتجاوز إطاره بمقدار ${i?.px} بكسل`)
};

export const layout_page_scroll = /** @type {(inputs: Layout_Page_ScrollInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أعرض من الصفحة بمقدار ${i?.px} بكسل`)
};

export const layout_squeezed = /** @type {(inputs: Layout_SqueezedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مضغوط إلى ${i?.px} بكسل`)
};

export const list_view_by = /** @type {(inputs: List_View_ByInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.things} حسب ${i?.field}`)
};

export const list_view_calendar_count = /** @type {(inputs: List_View_Calendar_CountInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} حسب ${i?.field}`)
};

export const list_view_calendar_label = /** @type {(inputs: List_View_Calendar_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.things} حسب ${i?.field}، ${i?.month}`)
};

export const list_view_cannot_undo = /** @type {(inputs: List_View_Cannot_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يمكن التراجع عن هذا.`)
};

export const list_view_chart_bucket = /** @type {(inputs: List_View_Chart_BucketInputs) => LocalizedString} */ (i) => {
	if (i?.bucket === "month") return /** @type {LocalizedString} */ (`${i?.field}، حسب الشهر`);
	if (i?.bucket === "week") return /** @type {LocalizedString} */ (`${i?.field}، حسب الأسبوع`);
	return /** @type {LocalizedString} */ (`${i?.field}، حسب اليوم`)
};

export const list_view_clear_filters = /** @type {(inputs: List_View_Clear_FiltersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسح البحث والتصفية`)
};

export const list_view_clear_selection = /** @type {(inputs: List_View_Clear_SelectionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إلغاء التحديد`)
};

export const list_view_count_of = /** @type {(inputs: List_View_Count_OfInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.singular}: ${i?.count}`);
	return /** @type {LocalizedString} */ (`${i?.plural}: ${i?.count}`)
};

export const list_view_create_first = /** @type {(inputs: List_View_Create_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أنشئ أول سجل.`)
};

export const list_view_create_new = /** @type {(inputs: List_View_Create_NewInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`+ إنشاء ${i?.singular} جديد`)
};

export const list_view_created = /** @type {(inputs: List_View_CreatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تاريخ الإنشاء`)
};

export const list_view_dashboard = /** @type {(inputs: List_View_DashboardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لوحة التحكم`)
};

export const list_view_delete = /** @type {(inputs: List_View_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حذف`)
};

export const list_view_delete_count = /** @type {(inputs: List_View_Delete_CountInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`حذف ${i?.count}`)
};

export const list_view_delete_heading = /** @type {(inputs: List_View_Delete_HeadingInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`حذف ${i?.singular}؟`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`حذف اثنين من ${i?.plural}؟`);
	return /** @type {LocalizedString} */ (`حذف ${i?.count} من ${i?.plural}؟`)
};

export const list_view_discard = /** @type {(inputs: List_View_DiscardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تجاهل`)
};

export const list_view_discard_heading = /** @type {(inputs: List_View_Discard_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تجاهل التغييرات غير المحفوظة؟`)
};

export const list_view_discard_text = /** @type {(inputs: List_View_Discard_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`لم تُحفظ التغييرات التي أجريتها على ${i?.title}.`)
};

export const list_view_empty = /** @type {(inputs: List_View_EmptyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`لا توجد ${i?.things} بعد`)
};

export const list_view_empty_filtered = /** @type {(inputs: List_View_Empty_FilteredInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`لا توجد ${i?.things} مطابقة`)
};

export const list_view_export_csv = /** @type {(inputs: List_View_Export_CsvInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تصدير CSV`)
};

export const list_view_heatmap_label = /** @type {(inputs: List_View_Heatmap_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.things} يوميًا حسب ${i?.field}`)
};

export const list_view_heatmap_summary = /** @type {(inputs: List_View_Heatmap_SummaryInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.things}: ${i?.total} خلال 12 أسبوعًا حسب ${i?.field}`)
};

export const list_view_id = /** @type {(inputs: List_View_IdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المعرّف`)
};

export const list_view_item = /** @type {(inputs: List_View_ItemInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عنصر`)
};

export const list_view_items = /** @type {(inputs: List_View_ItemsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عناصر`)
};

export const list_view_keep_editing = /** @type {(inputs: List_View_Keep_EditingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`متابعة التعديل`)
};

export const list_view_layout_board = /** @type {(inputs: List_View_Layout_BoardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لوحة`)
};

export const list_view_layout_calendar = /** @type {(inputs: List_View_Layout_CalendarInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تقويم`)
};

export const list_view_layout_cards = /** @type {(inputs: List_View_Layout_CardsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بطاقات`)
};

export const list_view_layout_chart = /** @type {(inputs: List_View_Layout_ChartInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`رسم بياني حسب ${i?.field}`)
};

export const list_view_layout_compact = /** @type {(inputs: List_View_Layout_CompactInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مختصر`)
};

export const list_view_layout_focus = /** @type {(inputs: List_View_Layout_FocusInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تركيز، سجل تلو الآخر`)
};

export const list_view_layout_groups = /** @type {(inputs: List_View_Layout_GroupsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مجمّعة حسب ${i?.field}`)
};

export const list_view_layout_heatmap = /** @type {(inputs: List_View_Layout_HeatmapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خريطة حرارية`)
};

export const list_view_layout_list = /** @type {(inputs: List_View_Layout_ListInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قائمة`)
};

export const list_view_layout_ranking = /** @type {(inputs: List_View_Layout_RankingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`ترتيب حسب ${i?.field}`)
};

export const list_view_layout_scatter = /** @type {(inputs: List_View_Layout_ScatterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مخطط انتشار`)
};

export const list_view_layout_table = /** @type {(inputs: List_View_Layout_TableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جدول`)
};

export const list_view_layout_timeline = /** @type {(inputs: List_View_Layout_TimelineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خط زمني`)
};

export const list_view_layout_treemap = /** @type {(inputs: List_View_Layout_TreemapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خريطة شجرية`)
};

export const list_view_loading = /** @type {(inputs: List_View_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ التحميل…`)
};

export const list_view_move_failed = /** @type {(inputs: List_View_Move_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`يبقى ${i?.title} في ${i?.column}: ${i?.error}`)
};

export const list_view_move_menu = /** @type {(inputs: List_View_Move_MenuInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`نقل ${i?.title}`)
};

export const list_view_move_to = /** @type {(inputs: List_View_Move_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`نقل إلى ${i?.column}`)
};

export const list_view_moved = /** @type {(inputs: List_View_MovedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.title} ← ${i?.column}`)
};

export const list_view_new = /** @type {(inputs: List_View_NewInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`+ ${i?.singular} جديد`)
};

export const list_view_next = /** @type {(inputs: List_View_NextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التالي`)
};

export const list_view_next_month = /** @type {(inputs: List_View_Next_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الشهر التالي`)
};

export const list_view_no_records = /** @type {(inputs: List_View_No_RecordsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد سجلات`)
};

export const list_view_none_column = /** @type {(inputs: List_View_None_ColumnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`بدون ${i?.field}`)
};

export const list_view_none_inline = /** @type {(inputs: List_View_None_InlineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`بدون ${i?.field}`)
};

export const list_view_open = /** @type {(inputs: List_View_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فتح`)
};

export const list_view_open_full = /** @type {(inputs: List_View_Open_FullInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فتح الصفحة كاملة`)
};

export const list_view_position = /** @type {(inputs: List_View_PositionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.at} من ${i?.total}`)
};

export const list_view_previous = /** @type {(inputs: List_View_PreviousInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السابق`)
};

export const list_view_previous_month = /** @type {(inputs: List_View_Previous_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الشهر السابق`)
};

export const list_view_range = /** @type {(inputs: List_View_RangeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.from}–${i?.to} من ${i?.total}`)
};

export const list_view_read_only = /** @type {(inputs: List_View_Read_OnlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`للقراءة فقط`)
};

export const list_view_rows = /** @type {(inputs: List_View_RowsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الصفوف`)
};

export const list_view_save = /** @type {(inputs: List_View_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حفظ`)
};

export const list_view_saved = /** @type {(inputs: List_View_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم الحفظ`)
};

export const list_view_saving = /** @type {(inputs: List_View_SavingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ الحفظ…`)
};

export const list_view_scatter_label = /** @type {(inputs: List_View_Scatter_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.things}: ${i?.x} و${i?.y}`)
};

export const list_view_search_by = /** @type {(inputs: List_View_Search_ByInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`بحث حسب ${i?.field}`)
};

export const list_view_select_all = /** @type {(inputs: List_View_Select_AllInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تحديد كل ${i?.things} (${i?.total})`)
};

export const list_view_select_all_matching = /** @type {(inputs: List_View_Select_All_MatchingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تحديد كل النتائج المطابقة (${i?.total})`)
};

export const list_view_selected = /** @type {(inputs: List_View_SelectedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} محدد`)
};

export const list_view_selection = /** @type {(inputs: List_View_SelectionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التحديد`)
};

export const list_view_sort = /** @type {(inputs: List_View_SortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ترتيب`)
};

export const list_view_sort_default = /** @type {(inputs: List_View_Sort_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الترتيب الافتراضي`)
};

export const list_view_this_month = /** @type {(inputs: List_View_This_MonthInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`هذا الشهر`)
};

export const list_view_undo = /** @type {(inputs: List_View_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تراجع`)
};

export const list_view_unsaved = /** @type {(inputs: List_View_UnsavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تغييرات غير محفوظة`)
};

export const list_view_updated = /** @type {(inputs: List_View_UpdatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`آخر تحديث`)
};

export const list_view_view = /** @type {(inputs: List_View_ViewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العرض`)
};

export const list_view_with = /** @type {(inputs: List_View_WithInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مع ${i?.person}`)
};

export const loading_label = /** @type {(inputs: Loading_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ التحميل`)
};

export const message_bad_response = /** @type {(inputs: Message_Bad_ResponseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إجابة سيئة`)
};

export const message_copied = /** @type {(inputs: Message_CopiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم النسخ`)
};

export const message_copy = /** @type {(inputs: Message_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نسخ`)
};

export const message_edit = /** @type {(inputs: Message_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تعديل`)
};

export const message_good_response = /** @type {(inputs: Message_Good_ResponseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إجابة جيدة`)
};

export const message_retry = /** @type {(inputs: Message_RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إعادة المحاولة`)
};

export const message_scroller_jump = /** @type {(inputs: Message_Scroller_JumpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الانتقال إلى الأحدث`)
};

export const modal_cancel = /** @type {(inputs: Modal_CancelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إلغاء`)
};

export const modal_close = /** @type {(inputs: Modal_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إغلاق`)
};

export const model_selector_label = /** @type {(inputs: Model_Selector_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`النموذج: ${i?.name}`)
};

export const month_day_due = /** @type {(inputs: Month_Day_DueInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`${i?.day}، لا يوجد مستحق`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.day}، مستحق واحد`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`${i?.day}، مستحقان`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${i?.day}، ${__paraglideRegistry.icuPound("ar", i?.count, {})} مستحقات`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${i?.day}، ${__paraglideRegistry.icuPound("ar", i?.count, {})} مستحقًا`);
	return /** @type {LocalizedString} */ (`${i?.day}، ${__paraglideRegistry.icuPound("ar", i?.count, {})} مستحق`)
};

export const month_nothing_due = /** @type {(inputs: Month_Nothing_DueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد مستحق`)
};

export const number_days = /** @type {(inputs: Number_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} ي`)
};

export const number_hours = /** @type {(inputs: Number_HoursInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} س`)
};

export const number_minutes = /** @type {(inputs: Number_MinutesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} د`)
};

export const number_money = /** @type {(inputs: Number_MoneyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} ${i?.currency}`)
};

export const number_money_compact = /** @type {(inputs: Number_Money_CompactInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} ألف ${i?.currency}`)
};

export const number_pct = /** @type {(inputs: Number_PctInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value}%`)
};

export const number_thousands = /** @type {(inputs: Number_ThousandsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} ألف`)
};

export const otp_label = /** @type {(inputs: Otp_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`رمز التحقق`)
};

export const pagination_label = /** @type {(inputs: Pagination_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ترقيم الصفحات`)
};

export const pagination_next = /** @type {(inputs: Pagination_NextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الصفحة التالية`)
};

export const pagination_page_of = /** @type {(inputs: Pagination_Page_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الصفحة ${i?.page} من ${i?.total}`)
};

export const pagination_pages_range = /** @type {(inputs: Pagination_Pages_RangeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الصفحات من ${i?.from} إلى ${i?.to}`)
};

export const pagination_previous = /** @type {(inputs: Pagination_PreviousInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الصفحة السابقة`)
};

export const prompt_input_label = /** @type {(inputs: Prompt_Input_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`رسالة`)
};

export const prompt_input_send = /** @type {(inputs: Prompt_Input_SendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إرسال`)
};

export const prompt_input_stop = /** @type {(inputs: Prompt_Input_StopInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إيقاف`)
};

export const quadrant_measure = /** @type {(inputs: Quadrant_MeasureInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.measure} ${i?.value}`)
};

export const quadrant_point = /** @type {(inputs: Quadrant_PointInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.point}، ${i?.quadrant}`)
};

export const quadrant_split = /** @type {(inputs: Quadrant_SplitInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الفصل عند ${i?.x} · ${i?.y}`)
};

export const quadrant_x_axis = /** @type {(inputs: Quadrant_X_AxisInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.measure} ←`)
};

export const rating_none = /** @type {(inputs: Rating_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بدون تقييم`)
};

export const rating_of = /** @type {(inputs: Rating_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} من ${i?.max}`)
};

export const rating_star_words = /** @type {(inputs: Rating_Star_WordsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value}: ${i?.words}`)
};

export const record_named = /** @type {(inputs: Record_NamedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.title}، ${i?.status}`)
};

export const record_related = /** @type {(inputs: Record_RelatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ذات صلة`)
};

export const search_clear = /** @type {(inputs: Search_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسح البحث`)
};

export const search_label = /** @type {(inputs: Search_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بحث`)
};

export const shared_bookmarks_failed = /** @type {(inputs: Shared_Bookmarks_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تعذّر تحديث الإشارات المرجعية: ${i?.error}`)
};

export const shared_collections = /** @type {(inputs: Shared_CollectionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المجموعات`)
};

export const shared_configuration = /** @type {(inputs: Shared_ConfigurationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإعدادات`)
};

export const shared_no = /** @type {(inputs: Shared_NoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا`)
};

export const shared_rows = /** @type {(inputs: Shared_RowsInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`لا صفوف`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`صف واحد`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`صفّان`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`${i?.count} صفوف`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`${i?.count} صفًا`);
	return /** @type {LocalizedString} */ (`${i?.count} صف`)
};

export const shared_untitled = /** @type {(inputs: Shared_UntitledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بلا عنوان`)
};

export const shared_yes = /** @type {(inputs: Shared_YesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نعم`)
};

export const sheet_close = /** @type {(inputs: Sheet_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إغلاق`)
};

export const site_assistant_name = /** @type {(inputs: Site_Assistant_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المساعد`)
};

export const site_default_name = /** @type {(inputs: Site_Default_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لوحة التحكم`)
};

export const skeleton_loading = /** @type {(inputs: Skeleton_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ التحميل`)
};

export const snackbar_dismiss = /** @type {(inputs: Snackbar_DismissInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إغلاق`)
};

export const sources_used = /** @type {(inputs: Sources_UsedInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`لم يُستخدم أي مصدر`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`استُخدم مصدر واحد`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`استُخدم مصدران`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`استُخدمت ${__paraglideRegistry.icuPound("ar", i?.count, {})} مصادر`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`استُخدم ${__paraglideRegistry.icuPound("ar", i?.count, {})} مصدرًا`);
	return /** @type {LocalizedString} */ (`استُخدم ${__paraglideRegistry.icuPound("ar", i?.count, {})} مصدر`)
};

export const stat_delta_down = /** @type {(inputs: Stat_Delta_DownInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`انخفاض`)
};

export const stat_delta_flat = /** @type {(inputs: Stat_Delta_FlatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`دون تغيير`)
};

export const stat_delta_up = /** @type {(inputs: Stat_Delta_UpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ارتفاع`)
};

export const stepper_less = /** @type {(inputs: Stepper_LessInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تقليل`)
};

export const stepper_less_of = /** @type {(inputs: Stepper_Less_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تقليل ${i?.label}`)
};

export const stepper_more = /** @type {(inputs: Stepper_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`زيادة`)
};

export const stepper_more_of = /** @type {(inputs: Stepper_More_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`زيادة ${i?.label}`)
};

export const steps_done = /** @type {(inputs: Steps_DoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`(مكتملة)`)
};

export const steps_skipped = /** @type {(inputs: Steps_SkippedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`(تم تخطيها)`)
};

export const suggestions_label = /** @type {(inputs: Suggestions_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اقتراحات`)
};

export const table_column_fit = /** @type {(inputs: Table_Column_FitInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.column} يتسع لمحتواه`)
};

export const table_column_moved = /** @type {(inputs: Table_Column_MovedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`نُقل ${i?.column} إلى العمود ${i?.place} من ${i?.total}`)
};

export const table_column_width = /** @type {(inputs: Table_Column_WidthInputs) => LocalizedString} */ (i) => {
	const widthPlural = __paraglideRegistry.plural("ar", i?.width, {}, true);
	if (widthPlural === "zero") return /** @type {LocalizedString} */ (`عرض ${i?.column} ${__paraglideRegistry.icuPound("ar", i?.width, {})} بكسل`);
	if (widthPlural === "one") return /** @type {LocalizedString} */ (`عرض ${i?.column} بكسل واحد`);
	if (widthPlural === "two") return /** @type {LocalizedString} */ (`عرض ${i?.column} بكسلان`);
	if (widthPlural === "few") return /** @type {LocalizedString} */ (`عرض ${i?.column} ${__paraglideRegistry.icuPound("ar", i?.width, {})} بكسلات`);
	if (widthPlural === "many") return /** @type {LocalizedString} */ (`عرض ${i?.column} ${__paraglideRegistry.icuPound("ar", i?.width, {})} بكسلًا`);
	return /** @type {LocalizedString} */ (`عرض ${i?.column} ${__paraglideRegistry.icuPound("ar", i?.width, {})} بكسل`)
};

export const table_resize_column = /** @type {(inputs: Table_Resize_ColumnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تغيير عرض عمود ${i?.column}`)
};

export const table_resize_hint = /** @type {(inputs: Table_Resize_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اسحب لتغيير العرض · انقر مرتين للملاءمة`)
};

export const table_select_all = /** @type {(inputs: Table_Select_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تحديد الكل`)
};

export const table_select_row = /** @type {(inputs: Table_Select_RowInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تحديد الصف ${i?.row}`)
};

export const table_sort_hint = /** @type {(inputs: Table_Sort_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ترتيب (Shift مع النقر للترتيب حسب عدة أعمدة)`)
};

export const table_sort_move_hint = /** @type {(inputs: Table_Sort_Move_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ترتيب (Shift مع النقر للترتيب حسب عدة أعمدة). اسحب أو استخدم Ctrl+Shift+→ / ← للنقل`)
};

export const tile_move = /** @type {(inputs: Tile_MoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نقل`)
};

export const tile_move_hint = /** @type {(inputs: Tile_Move_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اسحب للنقل. انقر للمزيد. مفاتيح الأسهم: إلى الأمام أو إلى الخلف. Delete: إخفاء.`)
};

export const tile_move_named = /** @type {(inputs: Tile_Move_NamedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`نقل ${i?.name}`)
};

export const tile_remove = /** @type {(inputs: Tile_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إزالة`)
};

export const tile_remove_named = /** @type {(inputs: Tile_Remove_NamedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`إزالة ${i?.name}`)
};

export const tile_resize = /** @type {(inputs: Tile_ResizeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تغيير الحجم`)
};

export const tile_resize_hint = /** @type {(inputs: Tile_Resize_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اسحب لتغيير الحجم. مفاتيح الأسهم: بطاقة في كل مرة.`)
};

export const tile_resize_named = /** @type {(inputs: Tile_Resize_NamedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تغيير حجم ${i?.name}`)
};

export const tile_show_all = /** @type {(inputs: Tile_Show_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عرض الكل`)
};

export const tile_show_less = /** @type {(inputs: Tile_Show_LessInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عرض أقل`)
};

export const tour_eyebrow_signed_in = /** @type {(inputs: Tour_Eyebrow_Signed_InInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.tour} · مسجّل الدخول باسم ${i?.name} (${i?.role})`)
};

export const treemap_cell = /** @type {(inputs: Treemap_CellInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.label}، ${i?.amount}، ${i?.share}`)
};

export const visual_other = /** @type {(inputs: Visual_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أخرى`)
};

export const waffle_label = /** @type {(inputs: Waffle_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الحصة`)
};

export const waffle_reading = /** @type {(inputs: Waffle_ReadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} ${i?.caption}`)
};

export const waterfall_change = /** @type {(inputs: Waterfall_ChangeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.label}: ${i?.change} ← ${i?.run}`)
};

export const waterfall_decrease = /** @type {(inputs: Waterfall_DecreaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نقص`)
};

export const waterfall_increase = /** @type {(inputs: Waterfall_IncreaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`زيادة`)
};

export const waterfall_total = /** @type {(inputs: Waterfall_TotalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.label}: ${i?.run}`)
};

export const waterfall_total_key = /** @type {(inputs: Waterfall_Total_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإجمالي`)
};

export const whatif_reset = /** @type {(inputs: Whatif_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إعادة الضبط`)
};

export const widget_ask_placeholder = /** @type {(inputs: Widget_Ask_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اطرح سؤالاً…`)
};

export const widget_ask_reading = /** @type {(inputs: Widget_Ask_ReadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ قراءة السجلات…`)
};

export const widget_attach = /** @type {(inputs: Widget_AttachInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أرفق ${i?.what}.`)
};

export const widget_blocks_chart = /** @type {(inputs: Widget_Blocks_ChartInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مخطط`)
};

export const widget_blocks_funnel_step = /** @type {(inputs: Widget_Blocks_Funnel_StepInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تابعوا`)
};

export const widget_blocks_more = /** @type {(inputs: Widget_Blocks_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المزيد`)
};

export const widget_dashboard = /** @type {(inputs: Widget_DashboardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لوحة التحكم`)
};

export const widget_data_all = /** @type {(inputs: Widget_Data_AllInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`كل ${i?.what}`)
};

export const widget_data_in_all = /** @type {(inputs: Widget_Data_In_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإجمالي`)
};

export const widget_denied = /** @type {(inputs: Widget_DeniedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ليست لديك صلاحية الوصول إلى هذا.`)
};

export const widget_empty = /** @type {(inputs: Widget_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يوجد شيء هنا بعد.`)
};

export const widget_failed = /** @type {(inputs: Widget_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تعذّر تنفيذ ذلك.`)
};

export const widget_fill_in = /** @type {(inputs: Widget_Fill_InInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أكمل ${i?.fields}.`)
};

export const widget_fill_in_button = /** @type {(inputs: Widget_Fill_In_ButtonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تعبئة`)
};

export const widget_host_all = /** @type {(inputs: Widget_Host_AllInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الكل`)
};

export const widget_host_compact = /** @type {(inputs: Widget_Host_CompactInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سدّ الفراغات`)
};

export const widget_host_its_screen = /** @type {(inputs: Widget_Host_Its_ScreenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الشاشة`)
};

export const widget_host_keep_here = /** @type {(inputs: Widget_Host_Keep_HereInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أبقِها هنا`)
};

export const widget_host_kept = /** @type {(inputs: Widget_Host_KeptInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أصبحت ${i?.name} ضمن أدواتك`)
};

export const widget_host_reset_layout = /** @type {(inputs: Widget_Host_Reset_LayoutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إعادة ضبط الترتيب`)
};

export const widget_host_show_hidden = /** @type {(inputs: Widget_Host_Show_HiddenInputs) => LocalizedString} */ (i) => {
	const countPlural = __paraglideRegistry.plural("ar", i?.count, {}, true);
	if (countPlural === "zero") return /** @type {LocalizedString} */ (`لا توجد بطاقات مخفية`);
	if (countPlural === "one") return /** @type {LocalizedString} */ (`إظهار بطاقة مخفية`);
	if (countPlural === "two") return /** @type {LocalizedString} */ (`إظهار بطاقتين مخفيتين`);
	if (countPlural === "few") return /** @type {LocalizedString} */ (`إظهار ${__paraglideRegistry.icuPound("ar", i?.count, {})} بطاقات مخفية`);
	if (countPlural === "many") return /** @type {LocalizedString} */ (`إظهار ${__paraglideRegistry.icuPound("ar", i?.count, {})} بطاقة مخفية`);
	return /** @type {LocalizedString} */ (`إظهار ${__paraglideRegistry.icuPound("ar", i?.count, {})} بطاقة مخفية`)
};

export const widget_host_tile = /** @type {(inputs: Widget_Host_TileInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بطاقة`)
};

export const widget_load_failed = /** @type {(inputs: Widget_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تعذّر التحميل`)
};

export const widget_mini_of = /** @type {(inputs: Widget_Mini_OfInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`من ${i?.max}`)
};

export const widget_mini_open = /** @type {(inputs: Widget_Mini_OpenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`فتح ${i?.label}`)
};

export const widget_mini_other = /** @type {(inputs: Widget_Mini_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أخرى`)
};

export const widget_mini_reading = /** @type {(inputs: Widget_Mini_ReadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`القراءة`)
};

export const widget_mini_share = /** @type {(inputs: Widget_Mini_ShareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النسبة`)
};

export const widget_mini_step = /** @type {(inputs: Widget_Mini_StepInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الخطوة ${i?.step} من ${i?.total}: ${i?.label}`)
};

export const widget_more_heading = /** @type {(inputs: Widget_More_HeadingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} أخرى`)
};

export const widget_paste_placeholder = /** @type {(inputs: Widget_Paste_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الصق الرسالة هنا…`)
};

export const widget_save_failed = /** @type {(inputs: Widget_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تعذّر الحفظ.`)
};

export const widget_share_of_all = /** @type {(inputs: Widget_Share_Of_AllInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.pct}% من إجمالي ${i?.noun}`)
};

export const widget_share_of_first = /** @type {(inputs: Widget_Share_Of_FirstInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`من ${i?.label} (${i?.value})`)
};

export const widget_share_of_max = /** @type {(inputs: Widget_Share_Of_MaxInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`من ${i?.max}`)
};

export const widget_share_of_total = /** @type {(inputs: Widget_Share_Of_TotalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.pct}% من ${i?.total} ${i?.noun}`)
};

export const widget_total = /** @type {(inputs: Widget_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإجمالي`)
};

export const widget_undo = /** @type {(inputs: Widget_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تراجع`)
};

export const widget_undo_failed = /** @type {(inputs: Widget_Undo_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تعذّر التراجع عن ذلك.`)
};

export const widget_undone = /** @type {(inputs: Widget_UndoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم التراجع`)
};