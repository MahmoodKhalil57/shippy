@tour
Feature: Handover without losing anything
  One case from first email to last payment, and a handover AI drafts for a person to confirm.

  Scenario: The tour
    Given I am signed in as "Karim Youssef"
    And I open the "Overview" tab of case "GS-RFQ-0142"
    Then the tour points at "Lifecycle" and says "One case, sixteen steps"
      """
      From the first email to the last payment, everything happens on one case. GS-RFQ-0142 is
      comparing offers.
      """
    And the tour points at "Line progress" and says "Never complete too early"
      """
      Three of six lines are ready and one is blocked by a clarification — a case only looks done when
      every line is.
      """
    And the tour points at "Owner & backup" and says "AI drafts the handover"
      """
      Reassigning asks AI for a handover note — open questions, tasks, the customer's contact rule. A
      person edits and confirms it.
      """
    And the tour points at "Activity timeline" and says "Every step logged"
      """
      Automatic steps name the rule that fired; human steps name the person. That's the audit trail.
      """
