@tour
Feature: Nothing fails silently
  A failed mailbox and a low-confidence AI result, handled safely; urgent RFQs reach the on-duty
  person.

  Scenario: The tour
    Given I am signed in as "Karim Balbaa"
    And I open the "Automations" page
    Then the tour points at "Exception queue" and says "Failures are visible"
      """
      An expired Outlook token and an unreachable e-invoice signing service sit in a queue with an
      owner — not in a log nobody reads.
      """
    And the tour points at "AI review queue" and says "Low confidence waits for a person"
      """
      Uncertain AI results are never applied automatically; someone reviews them here.
      """
    And the tour points at "Rule registry" and says "Every automation is explicit"
      """
      Trigger, owner, due time, approval, retry behaviour and stop condition for each rule — switched
      on and off by management, and logged.
      """
    When I open the "Roles & permissions" page
    Then the tour points at "After-hours routing" and says "Urgent RFQs after hours"
      """
      Outside Sunday–Thursday office hours, urgent RFQs go to the on-duty person, with a backup if
      nobody answers.
      """
