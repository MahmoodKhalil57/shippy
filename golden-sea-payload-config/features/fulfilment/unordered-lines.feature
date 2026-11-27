Feature: Quoted lines the customer did not order
  A customer PO can leave out lines Golden Sea quoted. Sales decides for each one whether it stays open for a
  revised quotation or is closed with a reason, so no quoted line is forgotten.

  Background:
    Given I am signed in as "Soaad Amer"

  Scenario: A line left off the PO can be kept open for a revision
    When I keep line 4 of customer PO "NSM-PO-77104" open for a revision
    Then line 4 of customer PO "NSM-PO-77104" is "Open — revision to follow"

  Scenario: Closing a line left off the PO needs a reason
    When I close line 4 of customer PO "NSM-PO-77104"
    Then I am stopped with "Closing an unawarded line needs a reason."
    And line 4 of customer PO "NSM-PO-77104" is undecided

  Scenario: A line left off the PO can be closed with a reason
    When I close line 4 of customer PO "NSM-PO-77104" because "The customer bought it locally"
    Then line 4 of customer PO "NSM-PO-77104" is "Closed" because "The customer bought it locally"

  Scenario: Taking back a first decision makes the line undecided again
    Given I keep line 4 of customer PO "NSM-PO-77104" open for a revision
    When I take back that line decision
    Then I am told "Line 4 is undecided again"
    And line 4 of customer PO "NSM-PO-77104" is undecided

  Scenario: Taking back a closure returns a line that was kept open to open
    Given I keep line 4 of customer PO "NSM-PO-77104" open for a revision
    And I close line 4 of customer PO "NSM-PO-77104" because "The customer bought it locally"
    When I take back that line decision
    Then I am told "Line 4 is kept open again"
    And line 4 of customer PO "NSM-PO-77104" is "Open — revision to follow"

  Scenario: An older decision cannot be taken back once the line was decided again
    Given I keep line 4 of customer PO "NSM-PO-77104" open for a revision
    And I close line 4 of customer PO "NSM-PO-77104" because "The customer bought it locally"
    When I take back the first line decision
    Then I am stopped with "Line 4 has been decided again since, so there is nothing to take back."
    And line 4 of customer PO "NSM-PO-77104" is "Closed" because "The customer bought it locally"

  Scenario: A line decision stands once supplier POs are prepared
    Given I am signed in as "Karim Youssef"
    And I read the customer PO for case "GS-RFQ-0142"
    And every mismatch on customer PO "NSM-PO-77231" is agreed in writing
    And I confirm the sales order for case "GS-RFQ-0142"
    And I keep line 6 of customer PO "NSM-PO-77231" open for a revision
    When I take back that line decision
    Then I am stopped with "The sales order is confirmed and its supplier POs are prepared, so the line's decision stands."

  Scenario: A line on the customer PO cannot be kept open
    When I keep line 3 of customer PO "NSM-PO-77104" open for a revision
    Then I am stopped with "Line 3 is on the customer PO, so it can't be kept open or closed."
    And line 3 of customer PO "NSM-PO-77104" is undecided

  Scenario: A line on the customer PO cannot be closed
    When I close line 3 of customer PO "NSM-PO-77104" because "The customer bought it locally"
    Then I am stopped with "Line 3 is on the customer PO, so it can't be kept open or closed."
    And line 3 of customer PO "NSM-PO-77104" is undecided

  Scenario: Reading the customer PO keeps open the lines it says a revision will follow
    Given I am signed in as "Karim Youssef"
    When I read the customer PO for case "GS-RFQ-0142"
    Then line 4 of customer PO "NSM-PO-77231" is "Open — revision to follow" because "v2 to follow once welding offers are complete"
    And line 6 of customer PO "NSM-PO-77231" is undecided
