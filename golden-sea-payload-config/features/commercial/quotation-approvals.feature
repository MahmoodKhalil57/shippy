Feature: Management approval of quotations
  Every quotation needs management approval before it goes to the customer.
  Karim Balbaa approves or returns it, and a returned quotation goes back to pricing with the reason.

  Scenario: Asking for approval puts the quotation in front of management
    Given I am signed in as "Soaad Amer"
    When I request approval for quotation "GS-Q-0142 v1"
    Then quotation "GS-Q-0142 v1" is "Awaiting approval"
    And the quotation "GS-Q-0142 v1" has decision "Awaiting management approval"
    And the case "GS-RFQ-0142" has stage "Awaiting management approval"
    And the case "GS-RFQ-0142" has next action "Karim Balbaa: approve GS-Q-0142 v1"
    And quotation "GS-Q-0142 v1" waits for a "Customer quotation" approval by "Karim Balbaa"

  Scenario: Only a draft or returned quotation can be sent for approval
    Given I am signed in as "Soaad Amer"
    When I request approval for quotation "GS-Q-0139 v1"
    Then I am stopped with "GS-Q-0139 v1 is submitted. Nothing to request."

  Scenario: Sales cannot ask for a margin exception
    Given I am signed in as "Soaad Amer"
    When I request a margin exception for quotation "GS-Q-0142 v1"
    Then I am stopped with "Costs and margins are hidden for your role."

  Scenario: A case waiting on a margin decision tells sales only that management decides
    Given I am signed in as "Soaad Amer"
    Then the case "GS-RFQ-0137" has blocker "Waiting for management approval of the price"

  Scenario: Sales cannot search approvals by their type
    Given I am signed in as "Soaad Amer"
    When I search the approvals for the type "Quotation margin exception"
    Then the search is refused

  Scenario: Management can search approvals by their type
    Given I am signed in as "Karim Balbaa"
    When I search the approvals for the type "Quotation margin exception"
    Then the search finds at least one approval

  Scenario: Sales asking for approval of a thin margin sees nothing about the margin
    Given I am signed in as "Karim Balbaa"
    And I return quotation "GS-Q-0137 v2" because "Check the customer target price"
    And I am signed in as "Soaad Amer"
    And I request approval for quotation "GS-Q-0137 v2"
    When I open the approval request for quotation "GS-Q-0137 v2"
    Then the request shows neither its type nor its detail
    And nothing on the request reveals the margin or the policy minimum

  Scenario: Sales sees a margin exception like any other quotation approval
    Given I am signed in as "Soaad Amer"
    When I open the approval request for quotation "GS-Q-0137 v2"
    Then the request shows neither its type nor its detail
    And nothing on the request reveals the margin or the policy minimum

  Scenario: The approver still sees why a quotation needs a margin exception
    Given I am signed in as "Karim Balbaa"
    When I open the approval request for quotation "GS-Q-0137 v2"
    Then the request shows the type "Quotation margin exception"

  Scenario: An approved quotation is ready to send
    Given I am signed in as "Karim Balbaa"
    When I approve quotation "GS-Q-0135 v2"
    Then quotation "GS-Q-0135 v2" is "Approved"
    And the case "GS-RFQ-0135" has next action "Send GS-Q-0135 v2 to the customer"

  Scenario: A returned quotation needs a reason
    Given I am signed in as "Karim Balbaa"
    When I return quotation "GS-Q-0137 v2" without a reason
    Then I am stopped with "Give a reason when returning a request."
    And quotation "GS-Q-0137 v2" is "Awaiting approval"

  Scenario: A returned quotation goes back to pricing with the reason
    Given I am signed in as "Karim Balbaa"
    When I return quotation "GS-Q-0137 v2" because "Hold 15% on lines 1 and 2"
    Then quotation "GS-Q-0137 v2" is "Returned"
    And the case "GS-RFQ-0137" has next action "Revise pricing. Returned by Karim Balbaa: Hold 15% on lines 1 and 2"

  Scenario Outline: Only the named approver decides a quotation
    Given I am signed in as "<person>"
    When I approve quotation "GS-Q-0137 v2"
    Then I am stopped with "You are not an approver for this request."
    And quotation "GS-Q-0137 v2" is "Awaiting approval"

    Examples:
      | person         |
      | Soaad Amer     |
      | Mohamed Helmy  |
      | Karim Youssef  |

  Scenario: Each approver decides once
    Given I am signed in as "Karim Balbaa"
    When I approve quotation "GS-Q-0139 v1"
    Then I am stopped with "Each approver decides once."

  Scenario: An approver can withdraw an approval before the quotation is sent
    Given I am signed in as "Karim Balbaa"
    And I approve quotation "GS-Q-0135 v2"
    When I withdraw my decision on quotation "GS-Q-0135 v2"
    Then I am told "Decision withdrawn. Quote GS-Q-0135 v2 to Delta Offshore Services, USD 4,082.00 is waiting again."
    And quotation "GS-Q-0135 v2" is "Awaiting approval"
    And the case "GS-RFQ-0135" has next action "Karim Balbaa: approve GS-Q-0135 v2"

  Scenario: An approval cannot be withdrawn once the quotation is sent
    Given I am signed in as "Karim Balbaa"
    And I approve quotation "GS-Q-0135 v2"
    And I email quotation "GS-Q-0135 v2" to "purchasing@delta-offshore.example"
    When I withdraw my decision on quotation "GS-Q-0135 v2"
    Then I am stopped with "GS-Q-0135 v2 is already submitted, so the decision can't be withdrawn."

  Scenario: Only the person who decided can withdraw the decision
    Given I am signed in as "Mohamed Helmy"
    When I withdraw my decision on quotation "GS-Q-0139 v1"
    Then I am stopped with "You have no decision on this request to withdraw."
