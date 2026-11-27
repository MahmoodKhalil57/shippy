Feature: Sending quotations to the customer
  Sales sends a quotation to the customer once management has approved it, by email or through the customer's procurement portal.
  Sending starts the wait for the customer's decision.

  Scenario: An approved quotation is emailed to the customer
    Given I am signed in as "Karim Balbaa"
    And I approve quotation "GS-Q-0135 v2"
    And I am signed in as "Soaad Amer"
    When I email quotation "GS-Q-0135 v2" to "purchasing@delta-offshore.example"
    Then I am told "GS-Q-0135 v2 sent to purchasing@delta-offshore.example."
    And quotation "GS-Q-0135 v2" is "Submitted"
    And the quotation "GS-Q-0135 v2" has decision "Awaiting customer decision"
    And the quotation "GS-Q-0135 v2" has method "Email from Odoo"
    And the case "GS-RFQ-0135" has stage "Awaiting customer decision"
    And the case "GS-RFQ-0135" has next action "Follow up GS-Q-0135 v2 in 2 days (internal reminder)"

  Scenario: An approved quotation can be entered in the customer's portal instead
    Given I am signed in as "Karim Balbaa"
    And I approve quotation "GS-Q-0135 v2"
    And I am signed in as "Soaad Amer"
    When I mark quotation "GS-Q-0135 v2" as entered in the customer portal
    Then I am told "GS-Q-0135 v2 marked as entered in the portal."
    And the quotation "GS-Q-0135 v2" has method "Customer procurement portal"
    And quotation "GS-Q-0135 v2" is "Submitted"

  Scenario Outline: Only an approved quotation can be sent
    Given I am signed in as "Soaad Amer"
    When I email quotation "<quotation>" to "purchasing@customer.example"
    Then I am stopped with "Only an approved version can be sent to the customer."

    Examples:
      | quotation    | status            |
      | GS-Q-0142 v1 | Draft             |
      | GS-Q-0137 v2 | Awaiting approval |
      | GS-Q-0139 v1 | Submitted         |
      | GS-Q-0137 v1 | Superseded        |

  Scenario: The portal check shows where the portal differs from the quotation
    Given I am signed in as "Soaad Amer"
    When I check quotation "GS-Q-0139 v1" against the customer portal
    Then the portal check flags only "Payment terms"
    And the quotation "GS-Q-0139 v1" has method "Customer procurement portal"
