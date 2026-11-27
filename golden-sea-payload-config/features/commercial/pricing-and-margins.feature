Feature: Pricing and margins
  Supply chain prices each case from the selected offers, at the target margin for each store, before the quotation goes to management.
  The pricing warns about anything that needs an approval exception, so management sees it before the customer does.

  Background:
    Given I am signed in as "Karim Youssef"

  Scenario: Lines are priced at the target margin for their store
    When I look at the pricing of case "GS-RFQ-0141"
    Then line 5 is priced at a 22% margin
    And line 6 is priced at a 22% margin
    And the pricing needs a "Customer quotation" approval

  Scenario: Lines without a selected offer stay off the quotation
    When I look at the pricing of case "GS-RFQ-0142"
    Then line 4 is left off the quotation
    And line 6 is left off the quotation
    And the pricing warns "Lines 4, 6 excluded, to follow in a revised quotation"

  Scenario: An estimated shared charge is pointed out
    When I look at the pricing of case "GS-RFQ-0142"
    Then the pricing warns "Shared charge is an estimate: Port Said launch delivery to vessel (EGP 4,200)"

  Scenario: An alternative pack waits for the customer's written acceptance
    When I look at the pricing of case "GS-RFQ-0142"
    Then line 3 has the check "Pending customer acceptance: alternative pack"
    And the pricing warns "L3: Pending customer acceptance: alternative pack"

  Scenario: A new supplier shows the advance payment exposure
    When I look at the pricing of case "GS-RFQ-0142"
    Then line 1 has the check "Advance payment exposure: Horizon Trading"

  Scenario: A margin below the store minimum needs a margin exception
    When I set the margin on line 1 of case "GS-RFQ-0142" to 10%
    Then line 1 has the check "Below 15% minimum margin: approval exception"
    And the pricing warns "L1: Below 15% minimum margin: approval exception"
    And the pricing needs a "Quotation margin exception" approval

  Scenario: A line with no profit is flagged as an error
    When I set the margin on line 2 of case "GS-RFQ-0142" to 0%
    Then line 2 has the check "Negative / zero profit"
    And the pricing warns "L2: Negative / zero profit"

  Scenario Outline: A line margin stays between -50% and 90%
    When I set the margin on line 1 of case "GS-RFQ-0142" to <asked>%
    Then line 1 is priced at a <kept>% margin

    Examples:
      | asked | kept |
      | 95    | 90   |
      | -80   | -50  |
      | 30    | 30   |

  Scenario Outline: A customer discount above the policy limit needs approval
    When I give the customer on case "GS-RFQ-0142" a discount of <discount>%
    Then the pricing needs a "<approval>" approval

    Examples:
      | discount | approval           |
      | 3        | Customer quotation |
      | 4        | Customer discount  |

  Scenario: The discount warning names the policy limit
    When I give the customer on case "GS-RFQ-0142" a discount of 5%
    Then the pricing warns "Customer discount 5% is above 3% without approval"

  Scenario: A customer discount is capped at 50%
    When I give the customer on case "GS-RFQ-0142" a discount of 80%
    Then the customer discount is 50%

  Scenario: A quotation margin below the policy minimum needs a margin exception
    When I give the customer on case "GS-RFQ-0142" a discount of 15%
    Then the pricing warns "Quote margin 11.7% is below the 15% minimum"
    And the pricing needs a "Quotation margin exception" approval

  Scenario: Costs and margins are hidden from sales
    Given I am signed in as "Soaad Amer"
    When I look at the pricing of case "GS-RFQ-0142"
    Then I am stopped with "Costs and margins are hidden for your role."

  Scenario: Pricing needs a signed-in person
    Given I am not signed in
    When I look at the pricing of case "GS-RFQ-0142"
    Then I am not allowed

  Scenario: Sending the pricing for approval updates the draft quotation
    When I send the pricing of case "GS-RFQ-0142" for approval
    Then quotation "GS-Q-0142 v1" is "Awaiting approval"
    And quotation "GS-Q-0142 v1" waits for a "Customer quotation" approval by "Karim Balbaa"
    And the case "GS-RFQ-0142" has stage "Awaiting management approval"

  Scenario: Sending the pricing for approval with a thin margin asks for a margin exception
    Given I set the margin on line 1 of case "GS-RFQ-0142" to 10%
    When I send the pricing of case "GS-RFQ-0142" for approval
    Then quotation "GS-Q-0142 v1" waits for a "Quotation margin exception" approval by "Karim Balbaa"

  Scenario: The first pricing of a case creates its first quotation
    When I send the pricing of case "GS-RFQ-0141" for approval
    Then quotation "GS-Q-0141 v1" is "Awaiting approval"
    And the quotation "GS-Q-0141 v1" has payment terms "90 days from invoice date"

  Scenario: New pricing after the customer saw a quotation records a revision request
    When I send the pricing of case "GS-RFQ-0139" for approval
    Then quotation "GS-Q-0139 v2" is "Awaiting approval"
    And quotation "GS-Q-0139 v2" replaces "GS-Q-0139 v1"
    And quotation "GS-Q-0139 v1" is "Superseded"
    And the quotation "GS-Q-0139 v1" has decision "Revision requested"
    And the case "GS-RFQ-0139" has next action "Karim Balbaa: approve GS-Q-0139 v2"

  Scenario: Pricing waiting for approval cannot be sent again
    When I send the pricing of case "GS-RFQ-0137" for approval
    Then I am stopped with "GS-Q-0137 v2 is already awaiting approval."
