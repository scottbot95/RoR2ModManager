!include nsDialogs.nsh

Var Dialog
Var RoR2Dir
Var DirText
Var BrowseButton


Page custom RoR2InstallDirSelect LeaveCallback

Function RoR2InstallDirSelect

  ReadRegStr $DirText HKLM "Software\${PRODUCT_NAME}" "RoR2Dir"
  ${If} $DirText == ""
    StrCpy $DirText "C:\Program Files (x86)\Steam\steamapps\common\Risk of Rain 2"
  ${EndIf}


  nsDialogs::Create 1018
  Pop $Dialog

  ${If} $Dialog == error
    abort
  ${EndIf}

  ${NSD_CreateLabel} 0 0 100% 12u "Risk of Rain 2 Install Directory"

  ${NSD_CreateDirRequest} 0 13u 84% 12u $DirText
  Pop $RoR2Dir
  ${NSD_CreateBrowseButton} 85% 13u 15% 12u "Browse"
  Pop $BrowseButton
  ${NSD_OnClick} $BrowseButton OnBrowseForDir

  ${NSD_CreateLabel} 0 26u 100% 12u "NOTE: this can be changed later in the settings"

  nsDialogs::Show

FunctionEnd

Function OnBrowseForDir
  nsDialogs::SelectFolderDialog /NOUNLOAD "Directory"
  Pop $0
  ${If} $0 == error
  ${Else}
    StrCpy $DirText $0
    ${If} ${FileExists} "$DirText\Risk of Rain 2.exe"
      ${NSD_SetText} $RoR2Dir $DirText
    ${Else}
      MessageBox MB_OK|MB_ICONEXCLAMATION "Selected folder must contain 'Risk of Rain 2.exe'"
    ${EndIf}
  ${EndIf}
FunctionEnd

Function LeaveCallback
  ${NSD_GetText} $RoR2Dir $DirText
  ${If} ${FileExists} "$DirText\Risk of Rain 2.exe"

    WriteRegStr HKLM "Software\${PRODUCT_NAME}" "RoR2Dir" $DirText
  ${Else}
    MessageBox MB_OK|MB_ICONEXCLAMATION "Selected folder must contain 'Risk of Rain 2.exe'"
    Abort
  ${EndIf}
FunctionEnd

Section
SectionEnd

!macro customInstall
  DetailPrint "Register ror2mm URI handler"
  DeleteRegKey HKCR "ror2mm"
  WriteRegStr HKCR "ror2mm" "" "URL:ror2mm"
  WriteRegStr HKCR "ror2mm" "Url Protocol" ""
  WriteRegStr HKCR "ror2mm\DefaultIcon" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  WriteRegStr HKCR "ror2mm\shell" "" ""
  WriteRegStr HKCR "ror2mm\shell\Open" "" ""
  WriteRegStr HKCR "ror2mm\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend
