Feature: Customer decisions on quotations
  Sales records what the customer decided about each quotation they received.
  The decision moves the case on to the order, back to pricing, or closes it as lost.

  Background:
    Given I am signed in as "Soaad Amer"

  Scenario: A lost quotation needs a reason
    When I record the customer's decision on quotation "GS-Q-0139 v1" as "Lost"
    Then I am stopped with "Give the lost reason."
    And the quotation "GS-Q-0139 v1" has decision "Awaiting customer decision"

  Scenario: A lost quotation closes its case with the reason
    When I record the customer's decision on quotation "GS-Q-0139 v1" as "Lost" because "The customer found a cheaper supplier"
    Then I am told "Decision recorded: Lost."
    And the quotation "GS-Q-0139 v1" has decision "Lost"
    And the case "GS-RFQ-0139" has stage "Lost"
    And the case "GS-RFQ-0139" has lost reason "The customer found a cheaper supplier"
    And the case "GS-RFQ-0139" has next action "Closed: lost"

  Scenario: A won quotation moves its case to the sales order
    When I record the customer's decision on quotation "GS-Q-0139 v1" as "Won"
    Then I am told "Decision recorded: Won."
    And the case "GS-RFQ-0139" has stage "Won — sales order confirmed"
    And the case "GS-RFQ-0139" has next action "Check customer PO against the quote"

  Scenario: A partial award asks for the customer PO to be checked line by line
    When I record the customer's decision on quotation "GS-Q-0139 v1" as "Partially won"
    Then I am told "Decision recorded: Partially won."
    And the case "GS-RFQ-0139" has stage "Won — sales order confirmed"
    And the case "GS-RFQ-0139" has next action "Check customer PO against the quote (partial award)"

  Scenario: A customer who asks for changes sends the case back to revision
    When I record the customer's decision on quotation "GS-Q-0139 v1" as "Revision requested"
    Then I am told "Decision recorded: Revision requested."
    And the quotation "GS-Q-0139 v1" has decision "Revision requested"
    And the progress of quotation "GS-Q-0139 v1" shows "Revision requested"
    And the case "GS-RFQ-0139" has stage "Revision requested"
    And the case "GS-RFQ-0139" has next action "Revise GS-Q-0139 v1 as the customer asked"

  Scenario: An expired quotation closes its case without a reason
    When I record the customer's decision on quotation "GS-Q-0139 v1" as "Expired"
    Then I am told "Decision recorded: Expired."
    And the quotation "GS-Q-0139 v1" has decision "Expired"
    And the progress of quotation "GS-Q-0139 v1" shows "Expired"
    And the case "GS-RFQ-0139" has stage "Expired"
    And the case "GS-RFQ-0139" has next action "Closed: expired"

  Scenario: Only the listed decisions can be recorded
    When I record the customer's decision on quotation "GS-Q-0139 v1" as "Maybe later"
    Then I am stopped with "Unknown decision."

  Scenario: Only a quotation the customer received can get a decision
    When I record the customer's decision on quotation "GS-Q-0142 v1" as "Won"
    Then I am stopped with "Record the customer's decision on the version they received."
