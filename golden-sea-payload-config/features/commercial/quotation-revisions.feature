Feature: Quotation versions and revisions
  Sales makes a new version of a quotation when prices or lines must change after approval or after the customer saw it.
  The old version stays on file for audit, and every version keeps a traceable number.

  Background:
    Given I am signed in as "Soaad Amer"

  Scenario: Revising a quotation the customer received makes the next version
    When I revise quotation "GS-Q-0139 v1" because "Customer asked for 60 days payment"
    Then I am told "New version created. The previous one is kept for audit."
    And quotation "GS-Q-0139 v2" is "Draft"
    And quotation "GS-Q-0139 v2" replaces "GS-Q-0139 v1"
    And quotation "GS-Q-0139 v1" is "Superseded"
    And the quotation "GS-Q-0139 v1" has decision "Revision requested"
    And the case "GS-RFQ-0139" has stage "Revision requested"
    And the case "GS-RFQ-0139" has next action "Send GS-Q-0139 v2 for approval"

  Scenario: Revising an approved quotation before it is sent moves the next action to the new version
    Given I am signed in as "Karim Balbaa"
    And I approve quotation "GS-Q-0135 v2"
    When I revise quotation "GS-Q-0135 v2" because "Line 8 has a price now"
    Then I am told "New version created. The previous one is kept for audit."
    And quotation "GS-Q-0135 v3" is "Draft"
    And quotation "GS-Q-0135 v2" is "Superseded"
    And the quotation "GS-Q-0135 v2" has decision "Quotation prepared"
    And the case "GS-RFQ-0135" has stage "Revision requested"
    And the case "GS-RFQ-0135" has next action "Send GS-Q-0135 v3 for approval"

  Scenario: A quotation management returned can be revised
    Given I am signed in as "Karim Balbaa"
    And I return quotation "GS-Q-0137 v2" because "Margin too thin"
    When I revise quotation "GS-Q-0137 v2" because "Raise the margin on lines 1 and 2"
    Then I am told "New version created. The previous one is kept for audit."
    And quotation "GS-Q-0137 v3" is "Draft"
    And quotation "GS-Q-0137 v2" is "Superseded"

  Scenario Outline: Only the latest approved, sent or returned version can be revised
    When I revise quotation "<quotation>" because "Change the prices"
    Then I am stopped with "<message>"

    Examples:
      | quotation    | message                                                                |
      | GS-Q-0142 v1 | GS-Q-0142 v1 is draft. Revise the latest version instead.             |
      | GS-Q-0137 v2 | GS-Q-0137 v2 is awaiting approval. Revise the latest version instead. |
      | GS-Q-0137 v1 | GS-Q-0137 v1 is superseded. Revise the latest version instead.        |
