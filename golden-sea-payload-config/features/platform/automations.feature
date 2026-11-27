Feature: Automations and the exception queue
  Golden Sea runs automation rules for intake, reminders, checks and briefings, and anything uncertain waits for a person.
  Management decides which rules run. Anyone can retry a failed integration safely, without sending or creating anything twice.
  What the AI was unsure about waits for a person: it is reviewed, never retried.

  Scenario: The automations page needs a signed-in person
    Given I am not signed in
    When I open the automations page
    Then I am not allowed

  Scenario: The automations page counts the rules that run and the ones that use AI
    Given I am signed in as "Karim Youssef"
    When I open the automations page
    Then the automations page shows "Rules enabled" as "21 (21 of 21 rules)"
    And the automations page shows "AI-assisted" as "7 (7 of 21 rules)"

  Scenario: The review queue holds what the AI was not sure about
    Given I am signed in as "Karim Youssef"
    When I open the automations page
    Then the review queue holds 3 items
    And "AI extraction: Low confidence on 3 fields (PolarBay .docx)" in the review queue can be marked reviewed
    And "Delta Marine Stores: prices as requested" in the review queue can only be opened
    And "GS-RFQ-0142 line 6: Flame-retardant coverall, navy, EN ISO 11612" in the review queue shows a confidence of "58%"

  Scenario: A line read above the confidence threshold needs no review
    Given I am signed in as "Karim Balbaa"
    And I lower the confidence needed to create a case from an RFQ email to "50%"
    When I open the automations page
    Then the review queue does not include "GS-RFQ-0142 line 6: Flame-retardant coverall, navy, EN ISO 11612"

  Scenario: Only management pauses an automation rule
    Given I am signed in as "Karim Youssef"
    When I pause the automation rule "Supplier reminder"
    Then I am stopped with "Management can pause or enable rules."
    And the automation rule "Supplier reminder" is running

  Scenario: Pausing a rule is logged and can be undone
    Given I am signed in as "Karim Balbaa"
    When I pause the automation rule "Supplier reminder"
    Then I am told "Supplier reminder paused (logged)"
    And the automation rule "Supplier reminder" is paused
    And the rule change can be undone
    And the activity log records "Paused automation “Supplier reminder”."

  Scenario: A paused rule no longer counts as enabled
    Given I am signed in as "Karim Balbaa"
    And I pause the automation rule "Supplier reminder"
    When I open the automations page
    Then the automations page shows "Rules enabled" as "20 (20 of 21 rules)"

  Scenario: Management can enable a paused rule again
    Given I am signed in as "Karim Balbaa"
    And I pause the automation rule "Supplier reminder"
    When I enable the automation rule "Supplier reminder"
    Then I am told "Supplier reminder enabled (logged)"
    And the automation rule "Supplier reminder" is running
    And the activity log records "Enabled automation “Supplier reminder”."

  Scenario: An unknown rule cannot be switched
    Given I am signed in as "Karim Balbaa"
    When I pause the automation rule "Send birthday cards"
    Then I am stopped with "Rule not found."

  Scenario: A safe retry imports the waiting emails once and reconnects the mailbox
    Given I am signed in as "Ahmedy"
    When I retry the exception "purchasing@ mailbox token expired"
    Then I am told "Retried safely: Re-checked mailbox:purchasing@: 12 messages waiting, 0 already imported → 12 imported. No duplicate cases or acknowledgements."
    And the exception "purchasing@ mailbox token expired" has status "Resolved"
    And the exception "purchasing@ mailbox token expired" has retries "4"
    And the mailbox "purchasing@" is "Connected"
    And the mailbox "purchasing@" has imported 1324 emails
    And the activity log records "Outlook: purchasing@ mailbox token expired. Re-checked mailbox:purchasing@"

  Scenario: Retrying a resolved exception re-runs nothing
    Given I am signed in as "Ahmedy"
    And I retry the exception "purchasing@ mailbox token expired"
    When I retry the exception "purchasing@ mailbox token expired"
    Then I am told "Already resolved. Key mailbox:purchasing@ checked, nothing re-run or re-sent."
    And the exception "purchasing@ mailbox token expired" has retries "4"
    And the mailbox "purchasing@" has imported 1324 emails

  Scenario: A safe retry submits a failed e-invoice once
    Given I am signed in as "Mohamed Helmy"
    When I retry the exception "INV/2026/0419 — signature service unreachable"
    Then I am told "Retried safely: Re-checked invoice:INV/2026/0419: not yet accepted by the tax authority → signed and submitted once. Status: Valid."
    And the exception "INV/2026/0419 — signature service unreachable" has status "Resolved"

  Scenario: An e-invoice the tax authority already accepted is not submitted again
    Given I am signed in as "Mohamed Helmy"
    And the exception "INV/2026/0419 — signature service unreachable" has its status set to "Open"
    And I retry the exception "INV/2026/0419 — signature service unreachable"
    And the exception "INV/2026/0419 — signature service unreachable" has its status set to "Open"
    When I retry the exception "INV/2026/0419 — signature service unreachable"
    Then I am told "Retried safely: Re-checked invoice:INV/2026/0419: already accepted by the tax authority, not submitted again."

  Scenario: An exception that needs a person cannot be retried
    Given I am signed in as "Karim Youssef"
    When I retry the exception "Low confidence on 3 fields (PolarBay .docx)"
    Then I am stopped with "This exception needs a person to check it. Review it and mark it reviewed instead of retrying."
    And the exception "Low confidence on 3 fields (PolarBay .docx)" has status "Waiting for review"

  Scenario: Retrying an exception that does not exist is refused
    Given I am signed in as "Ahmedy"
    When I retry an exception that does not exist
    Then I am stopped with "Exception not found."

  Scenario: A person confirms the fields the AI was unsure about
    Given I am signed in as "Karim Youssef"
    When I mark the exception "Low confidence on 3 fields (PolarBay .docx)" as reviewed
    Then the exception "Low confidence on 3 fields (PolarBay .docx)" has status "Resolved"
    And the activity log records "Reviewed: Low confidence on 3 fields (PolarBay .docx). Fields confirmed by a person."

  Scenario: The reviewer's note goes on the activity log
    Given I am signed in as "Karim Youssef"
    When I mark the exception "Low confidence on 3 fields (PolarBay .docx)" as reviewed with the note "IMPA codes checked against the catalogue."
    Then the activity log records "Reviewed: Low confidence on 3 fields (PolarBay .docx). IMPA codes checked against the catalogue."

  Scenario: A reviewed exception leaves the review queue
    Given I am signed in as "Karim Youssef"
    And I mark the exception "Low confidence on 3 fields (PolarBay .docx)" as reviewed
    When I open the automations page
    Then the review queue holds 2 items

  Scenario: Only exceptions waiting for review can be marked reviewed
    Given I am signed in as "Karim Youssef"
    When I mark the exception "purchasing@ mailbox token expired" as reviewed
    Then nothing more needs reviewing there
    And the exception "purchasing@ mailbox token expired" has status "Open"

  Scenario: Marking an exception that does not exist is refused
    Given I am signed in as "Karim Youssef"
    When I mark an exception that does not exist as reviewed
    Then I am stopped with "Exception not found."
