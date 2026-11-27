Feature: Asking suppliers for prices
  Supply chain drafts supplier RFQs for the lines of a case, checks them, and sends them.
  The desk picks the suppliers for each line and never asks a supplier twice for the same line, so suppliers get clean requests and the case gets offers to compare.
  Drafts are saved with the case until they are sent or discarded. Only supply chain and management draft and send supplier RFQs.

  Background:
    Given I am signed in as "Karim Youssef"

  Scenario: Each line goes to the three most punctual specialists for its category
    When I draft supplier RFQs for case "GS-RFQ-0141" for "L2"
    Then I am told "2 RFQ drafts ready. Check them before sending"
    And the RFQ drafts go to "Nile Safety Equipment, Delta Marine Stores"

  Scenario: A supplier already asked for a line is not asked again
    When I draft supplier RFQs for case "GS-RFQ-0141" for "L2"
    Then the drafts leave out "L2 already asked of Red Sea Safety"

  Scenario: A blocked supplier is never asked
    Given the supplier "Nile Safety Equipment" has its status set to "Blocked"
    When I draft supplier RFQs for case "GS-RFQ-0141" for "L2"
    Then the RFQ drafts go to "Delta Marine Stores"

  Scenario: A line with no specialist who can quote goes to the general chandler
    Given the supplier "Canal Marine Ropes" has its status set to "Blocked"
    When I draft supplier RFQs for case "GS-RFQ-0140" for "L1"
    Then I am told "1 RFQ draft ready. Check them before sending"
    And the RFQ drafts go to "Delta Marine Stores"

  Scenario: The full list goes to the general chandler only
    When I draft one full-list RFQ for case "GS-RFQ-0141" for "L1, L2"
    Then the RFQ drafts go to "Delta Marine Stores"

  Scenario: A line that needs clarification is held back
    When I draft supplier RFQs for case "GS-RFQ-0142" for "L6"
    Then I am told "Held back until clarified: L6 (Size breakdown not specified)"

  Scenario: Nothing is drafted when every supplier was already asked
    When I draft supplier RFQs for case "GS-RFQ-0142" for "L4"
    Then I am told "Nothing new to send: every picked line was already asked of these suppliers"

  Scenario: Drafting needs at least one line
    When I draft supplier RFQs for case "GS-RFQ-0141" without picking a line
    Then I am stopped with "Pick at least one line."

  Scenario: Sending the drafts creates one supplier RFQ per supplier
    Given I draft supplier RFQs for case "GS-RFQ-0141" for "L2"
    When I send the supplier RFQs for case "GS-RFQ-0141"
    Then the supplier rfq "GS-SRFQ-0141-D" has status "Sent"
    And the supplier rfq "GS-SRFQ-0141-D" has mode "Split by category"
    And the supplier rfq "GS-SRFQ-0141-E" has latest "Sent (client identity removed) · reminder 1 scheduled"

  Scenario: A full-list RFQ is sent as a full list
    Given I draft one full-list RFQ for case "GS-RFQ-0141" for "L1, L2"
    When I send the supplier RFQs for case "GS-RFQ-0141"
    Then the supplier rfq "GS-SRFQ-0141-D" has mode "Full list"

  Scenario: Sending the first RFQs moves a new case to awaiting supplier
    Given I create a case from the message "Quick quote — Lalizas life jackets & lifebuoys, Abu Qir rig"
    And I draft supplier RFQs for case "GS-RFQ-0143" for "L1, L2"
    When I send the supplier RFQs for case "GS-RFQ-0143"
    Then the case "GS-RFQ-0143" has stage "Awaiting supplier"

  Scenario: Nothing is sent before the RFQs are drafted
    When I send the supplier RFQs for case "GS-RFQ-0139"
    Then I am stopped with "Nothing to send. Draft the RFQs first."

  Scenario: Discarded drafts are not sent
    Given I draft supplier RFQs for case "GS-RFQ-0140" for "L1"
    And I discard the drafts of case "GS-RFQ-0140"
    When I send the supplier RFQs for case "GS-RFQ-0140"
    Then I am stopped with "Nothing to send. Draft the RFQs first."

  Scenario: A removed draft can be put back before sending
    Given I draft supplier RFQs for case "GS-RFQ-0141" for "L2"
    And I remove the draft "GS-SRFQ-0141-D" from case "GS-RFQ-0141"
    When I put back the drafts of case "GS-RFQ-0141"
    Then I am told "2 RFQ drafts back. Nothing was sent"

  Scenario: A draft can be removed only once
    Given I draft supplier RFQs for case "GS-RFQ-0141" for "L2"
    And I remove the draft "GS-SRFQ-0141-D" from case "GS-RFQ-0141"
    When I remove the draft "GS-SRFQ-0141-D" from case "GS-RFQ-0141"
    Then I am stopped with "That draft is no longer there."

  Scenario: Drafts cannot be put back after they were drafted again
    Given I draft supplier RFQs for case "GS-RFQ-0141" for "L2"
    And I remove the draft "GS-SRFQ-0141-D" from case "GS-RFQ-0141"
    And I draft supplier RFQs for case "GS-RFQ-0141" for "L2"
    When I put back the drafts of case "GS-RFQ-0141"
    Then I am stopped with "The drafts have changed since (drafted again or sent), so there is nothing to put back."

  Scenario: Drafts are saved with the case
    When I draft supplier RFQs for case "GS-RFQ-0141" for "L2"
    Then the case "GS-RFQ-0141" keeps 2 supplier RFQ drafts

  Scenario: Drafts saved by one person can be sent by another
    Given I draft supplier RFQs for case "GS-RFQ-0141" for "L2"
    And I am signed in as "Karim Balbaa"
    When I send the supplier RFQs for case "GS-RFQ-0141"
    Then the supplier rfq "GS-SRFQ-0141-D" has status "Sent"
    And the case "GS-RFQ-0141" keeps 0 supplier RFQ drafts

  Scenario: A discarded draft is no longer kept with the case
    Given I draft supplier RFQs for case "GS-RFQ-0140" for "L1"
    When I discard the drafts of case "GS-RFQ-0140"
    Then the case "GS-RFQ-0140" keeps 0 supplier RFQ drafts

  Scenario: A case starts with no drafts
    Then the case "GS-RFQ-0141" keeps 0 supplier RFQ drafts

  Scenario Outline: Only supply chain and management draft supplier RFQs
    Given I am signed in as "<person>"
    When I draft supplier RFQs for case "GS-RFQ-0141" for "L2"
    Then I am not allowed
    And I am stopped with "Only supply chain and management can do this."
    And the case "GS-RFQ-0141" keeps 0 supplier RFQ drafts

    Examples:
      | person        |
      | Soaad Amer    |
      | Ahmedy        |
      | Mohamed Helmy |
      | Esraa Mohamed |

  Scenario Outline: Only supply chain and management send supplier RFQs
    Given I draft supplier RFQs for case "GS-RFQ-0141" for "L2"
    And I am signed in as "<person>"
    When I send the supplier RFQs for case "GS-RFQ-0141"
    Then I am not allowed
    And I am stopped with "Only supply chain and management can do this."
    And there is no supplier rfq "GS-SRFQ-0141-D"
    And the case "GS-RFQ-0141" keeps 2 supplier RFQ drafts

    Examples:
      | person        |
      | Soaad Amer    |
      | Mohamed Helmy |

  Scenario: Only supply chain and management change the drafts
    Given I draft supplier RFQs for case "GS-RFQ-0141" for "L2"
    And I am signed in as "Soaad Amer"
    When I discard the drafts of case "GS-RFQ-0141"
    Then I am not allowed
    And the case "GS-RFQ-0141" keeps 2 supplier RFQ drafts
