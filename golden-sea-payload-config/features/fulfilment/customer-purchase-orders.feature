Feature: Customer purchase orders and sales orders
  When a customer wins a quotation they send their own purchase order. The team reads it against the quotation
  and confirms the sales order only when every difference has the customer's written agreement, so Golden Sea
  never commits to suppliers on terms the customer did not accept.

  Background:
    Given I am signed in as "Karim Youssef"

  Scenario: Reading a customer PO checks it against the quotation and blocks commitment on mismatches
    When I read the customer PO for case "GS-RFQ-0142"
    Then I am told "Customer PO read and checked: 2 mismatch(es) block commitment."
    And customer PO "NSM-PO-77231" is "Blocked — mismatch"
    And the case "GS-RFQ-0142" has stage "Won — PO mismatch"
    And the case "GS-RFQ-0142" has next action "Resolve 2 PO mismatches before confirming the sales order"
    And the case "GS-RFQ-0142" has blocker "Commitment blocked"

  Scenario: Reading a customer PO again re-checks the one on file
    When I read the customer PO for case "GS-RFQ-0136"
    Then I am told "PO re-checked: 3 mismatch(es) block commitment."

  Scenario: A case without a customer PO has nothing to read
    When I read the customer PO for case "GS-RFQ-0139"
    Then I am stopped with "No customer PO has been received for this case yet."

  Scenario: A sales order cannot be confirmed without a customer PO
    When I confirm the sales order for case "GS-RFQ-0139"
    Then I am stopped with "No customer PO on file."

  Scenario: Open mismatches block the sales order
    When I confirm the sales order for case "GS-RFQ-0136"
    Then I am stopped with "Commitment blocked: 3 PO mismatch(es) need written customer agreement."
    And the case "GS-RFQ-0136" has stage "Won — PO mismatch"

  Scenario: Resolving a mismatch needs a description of the customer's agreement
    When I record the customer's agreement on customer PO "NSM-PO-77104" line 3 "Quantity" as "" with their written confirmation
    Then I am stopped with "Describe the customer's written agreement (who, when, what)."

  Scenario: Resolving a mismatch needs the customer's written confirmation
    When I record the customer's agreement on customer PO "NSM-PO-77104" line 3 "Quantity" as "Customer confirmed 10 EA" without their written confirmation
    Then I am stopped with "Attach the customer's written confirmation (email or signed amendment)."

  Scenario: Only a mismatch can be resolved
    When I record the customer's agreement on customer PO "NSM-PO-77104" line 2 "Price" as "Agreed" with their written confirmation
    Then I am stopped with "That check has no mismatch to resolve."

  Scenario: A resolved mismatch no longer blocks the customer PO
    When I record the customer's agreement on customer PO "NSM-PO-77104" line 3 "Quantity" as "Customer confirmed 10 EA" with their written confirmation
    Then customer PO "NSM-PO-77104" has 2 open mismatches
    And customer PO "NSM-PO-77104" is "Blocked — mismatch"

  Scenario: Resolving the last mismatch validates the customer PO and clears the blocker
    Given every mismatch on customer PO "NSM-PO-77104" is agreed in writing
    Then customer PO "NSM-PO-77104" is "Validated"
    And the case "GS-RFQ-0136" has next action "Confirm the sales order & prepare supplier POs"
    And the case "GS-RFQ-0136" has blocker ""

  Scenario: Confirming the sales order prepares one supplier PO for each supplier
    Given I read the customer PO for case "GS-RFQ-0142"
    And every mismatch on customer PO "NSM-PO-77231" is agreed in writing
    When I confirm the sales order for case "GS-RFQ-0142"
    Then I am told "Sales order confirmed · supplier POs P0419, P0420, P0421, P0422 prepared for re-check & approval."
    And the case "GS-RFQ-0142" has stage "Won — sales order confirmed"
    And the case "GS-RFQ-0142" has next action "Re-check supplier costs, then approve supplier POs"
    And the purchase order "P0419" has status "Awaiting approval"

  Scenario: A supplier PO for drop-shipped goods goes straight to the vessel
    Given I read the customer PO for case "GS-RFQ-0142"
    And every mismatch on customer PO "NSM-PO-77231" is agreed in writing
    When I confirm the sales order for case "GS-RFQ-0142"
    Then the purchase order "P0421" has route "Direct to vessel (dropship)"
    And the purchase order "P0420" has route "Alexandria"

  Scenario: A sales order whose supplier POs already exist prepares no new ones
    When I confirm the sales order for case "GS-RFQ-0131"
    Then I am told "Sales order confirmed."

  Scenario: Confirming the sales order never moves a case back to an earlier stage
    Given the case "GS-RFQ-0131" has stage "Invoiced — partially paid"
    When I confirm the sales order for case "GS-RFQ-0131"
    Then the case "GS-RFQ-0131" has stage "Invoiced — partially paid"

  Scenario: Reading a customer PO needs a signed-in person
    Given I am not signed in
    When I read the customer PO for case "GS-RFQ-0142"
    Then I am not allowed
