Feature: Exchange rate and bank detail approvals
  Management approves new exchange rates before pricing uses them, and two people approve a supplier's new bank account.
  These decisions follow the same approval rules as quotations.

  Scenario: An approved exchange rate becomes the active rate
    Given I am signed in as "Karim Balbaa"
    When I approve the request "New USD rate 48.95 (from 48.60)"
    Then I am told "Approved: New USD rate 48.95 (from 48.60)"
    And the exchange rate for "USD 48.95" is "Active"
    And the exchange rate for "USD 48.6" is "Superseded"

  Scenario: Pricing converts at the approved rate once management approves it
    Given I am signed in as "Karim Balbaa"
    And I approve the request "New USD rate 48.95 (from 48.60)"
    And I am signed in as "Karim Youssef"
    When I look at the pricing of case "GS-RFQ-0142"
    Then the pricing converts USD at 48.95

  Scenario: Pricing keeps the current rate while a new one waits for approval
    Given I am signed in as "Karim Youssef"
    When I look at the pricing of case "GS-RFQ-0142"
    Then the pricing converts USD at 48.6

  Scenario: An exchange rate decision cannot be withdrawn
    Given I am signed in as "Karim Balbaa"
    And I approve the request "New USD rate 48.95 (from 48.60)"
    When I withdraw my decision on the request "New USD rate 48.95 (from 48.60)"
    Then I am stopped with "An exchange-rate decision takes effect at once. Propose a new rate instead."

  Scenario: A new bank account needs a second person after the first approval
    Given I am signed in as "Mohamed Helmy"
    And I withdraw my decision on the request "Port Said Welding requests new beneficiary bank account"
    When I approve the request "Port Said Welding requests new beneficiary bank account"
    Then I am told "Your approval is recorded: Mohamed Helmy approved · waiting for Karim Balbaa."
    And the approval "Port Said Welding requests new beneficiary bank account" has status "Approved 1 of 2"

  Scenario: The second approval approves the new bank account
    Given I am signed in as "Karim Balbaa"
    When I approve the request "Port Said Welding requests new beneficiary bank account"
    Then I am told "Approved: Port Said Welding requests new beneficiary bank account"
    And the approval "Port Said Welding requests new beneficiary bank account" has status "Approved"

  Scenario: A decision cannot be withdrawn after someone else decided
    Given I am signed in as "Karim Balbaa"
    And I approve the request "Port Said Welding requests new beneficiary bank account"
    And I am signed in as "Mohamed Helmy"
    When I withdraw my decision on the request "Port Said Welding requests new beneficiary bank account"
    Then I am stopped with "Someone decided after you. The request has moved on."
