Feature: Project overview and acceptance tests
  The project page shows Golden Sea the delivery plan and proves each acceptance scenario from its own brief against the live records.
  A test passes only when the records show the behaviour, so the final payment follows real use.

  Scenario: The project overview needs a signed-in person
    Given I am not signed in
    When I open the project overview
    Then I am not allowed

  Scenario: Nine of the ten acceptance tests pass before settlement
    Given I am signed in as "Karim Balbaa"
    When I open the project overview
    Then "9 / 10" acceptance tests pass
    And acceptance test 1 shows "Pass"
    And acceptance test 10 shows "Runs at settlement"
    And acceptance test 10 was checked by "GS-RFQ-0131 closes once its balance is collected"

  Scenario: The last test passes once an order is closed and settled
    Given I am signed in as "Karim Balbaa"
    And the case "GS-RFQ-0131" has its stage set to "Closed — settled"
    When I open the project overview
    Then acceptance test 10 shows "Pass"
    And acceptance test 10 was checked by "GS-RFQ-0131 closed and settled"
    And "10 / 10" acceptance tests pass

  Scenario: The no-chase test fails if Atlas Tankers may be chased again
    Given I am signed in as "Karim Balbaa"
    And the customer "Atlas Tankers" has its contact rule set to "Follow-ups allowed"
    When I open the project overview
    Then acceptance test 4 shows "Not yet shown"

  Scenario: The safe retry test fails if an exception has no idempotency key
    Given I am signed in as "Karim Balbaa"
    And the exception "purchasing@ mailbox token expired" has its idempotency key set to ""
    When I open the project overview
    Then acceptance test 9 shows "Not yet shown"

  Scenario: The split delivery test needs two deliveries on one order
    Given I am signed in as "Karim Balbaa"
    And the delivery "DN-0002" has its case set to "gs-rfq-0131"
    When I open the project overview
    Then acceptance test 6 shows "Not yet shown"
