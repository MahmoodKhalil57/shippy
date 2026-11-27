Feature: Control room
  Management and the office follow the business live in the control room: open RFQs, speed, win rate and suppliers.
  Money figures are only for the people who answer for money: management, finance and operations.

  Scenario: The control room needs a signed-in person
    Given I am not signed in
    When I open the control room
    Then I am not allowed

  Scenario Outline: Only management, finance and operations see money in the control room
    Given I am signed in as "<person>"
    When I open the control room
    Then the control room <money> money

    Examples:
      | person        | money |
      | Karim Balbaa  | shows |
      | Mohamed Helmy | shows |
      | Ahmedy        | shows |
      | Karim Youssef | hides |
      | Soaad Amer    | hides |
      | Esraa Mohamed | hides |

  Scenario: Open RFQs counts every live case and how many are blocked or urgent
    Given I am signed in as "Karim Balbaa"
    When I open the control room
    Then the control room shows "Open RFQs" as "20"
    And the control room note under "Open RFQs" reads "2 blocked or urgent"

  Scenario: A lost case leaves the open RFQs
    Given I am signed in as "Karim Balbaa"
    And the case "GS-RFQ-0142" has its stage set to "Lost"
    When I open the control room
    Then the control room shows "Open RFQs" as "19"

  Scenario: Cases waiting on suppliers need attention
    Given I am signed in as "Karim Balbaa"
    When I open the control room
    Then the control room shows "Waiting on suppliers" as "2"
    And the control room note under "Waiting on suppliers" reads "5 supplier RFQs without a full reply"
    And the control room marks "Waiting on suppliers" as needing attention

  Scenario: Nothing to flag once no case waits on a supplier
    Given I am signed in as "Karim Balbaa"
    And the case "GS-RFQ-0142" has its wait set to "Awaiting internal approval"
    And the case "GS-RFQ-0141" has its wait set to "Awaiting internal approval"
    When I open the control room
    Then the control room shows "Waiting on suppliers" as "0"
    And the control room does not mark "Waiting on suppliers"

  Scenario: Receivables count open USD balances and how many are overdue
    Given I am signed in as "Mohamed Helmy"
    When I open the control room
    Then the control room shows "Receivables open" as "USD 35.6k"
    And the control room note under "Receivables open" reads "11 open invoices"
    And the control room shares "Receivables open" as "4 of 11 overdue"

  Scenario: A paid invoice leaves the receivables
    Given I am signed in as "Mohamed Helmy"
    And the invoice "INV/2026/0409" has its paid set to "8000"
    When I open the control room
    Then the control room shows "Receivables open" as "USD 27.6k"
    And the control room shares "Receivables open" as "4 of 10 overdue"

  Scenario: A draft invoice is not a receivable yet
    Given I am signed in as "Mohamed Helmy"
    And the invoice "INV/2026/0409" has its status set to "Draft"
    When I open the control room
    Then the control room note under "Receivables open" reads "10 open invoices"

  Scenario: The win rate covers the last 12 weeks unless I pick another period
    Given I am signed in as "Karim Balbaa"
    When I open the control room
    Then the control room shows "Win rate" as "36%"
    And the control room note under "Win rate" reads "42 won of 116 quoted, last 12 weeks"

  Scenario: The win rate follows the period I pick
    Given I am signed in as "Karim Balbaa"
    When I open the control room for the "last 4 weeks"
    Then the control room note under "Win rate" reads "17 won of 48 quoted, last 4 weeks"

  Scenario: An unknown period falls back to the last 12 weeks
    Given I am signed in as "Karim Balbaa"
    When I open the control room for the "last year"
    Then the control room note under "Win rate" reads "42 won of 116 quoted, last 12 weeks"
