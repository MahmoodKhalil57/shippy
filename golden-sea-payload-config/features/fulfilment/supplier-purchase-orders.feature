Feature: Purchase orders to suppliers
  After the sales order is confirmed, supply chain re-checks each supplier PO's price, stock, exchange rate and
  lead time with the supplier, and management confirms it. This keeps Golden Sea from ordering on a stale price.

  Background:
    Given I am signed in as "Karim Youssef"
    And I read the customer PO for case "GS-RFQ-0142"
    And every mismatch on customer PO "NSM-PO-77231" is agreed in writing
    And I confirm the sales order for case "GS-RFQ-0142"

  Scenario: Re-checking a supplier PO records the supplier's answers
    When I re-check purchase order "P0422" with the supplier
    Then the purchase order "P0422" has re-check completed "true"

  Scenario: Sales cannot re-check supplier costs
    Given I am signed in as "Soaad Amer"
    When I re-check purchase order "P0422" with the supplier
    Then I am stopped with "Supplier costs are not visible to Sales."
    And the purchase order "P0422" has re-check completed "false"

  Scenario: A supplier PO cannot be confirmed before its re-check
    Given I am signed in as "Karim Balbaa"
    When I confirm purchase order "P0422" to the supplier
    Then I am stopped with "Re-check availability, cost, FX and lead time with the supplier before confirming."
    And the purchase order "P0422" has status "Awaiting approval"

  Scenario: Saying the re-check is done does not replace doing it
    Given I am signed in as "Karim Balbaa"
    When I confirm purchase order "P0422" to the supplier, saying the re-check is done
    Then I am stopped with "Re-check availability, cost, FX and lead time with the supplier before confirming."
    And the purchase order "P0422" has re-check completed "false"
    And the purchase order "P0422" has status "Awaiting approval"

  Scenario: Editing a supplier PO cannot skip the re-check
    Given I am signed in as "Karim Balbaa"
    When I edit purchase order "P0422" to confirmed and tick re-check completed
    Then I am stopped with "Re-check availability, cost, FX and lead time before confirming."
    And the purchase order "P0422" has status "Awaiting approval"

  Scenario: Only management confirms a supplier PO
    Given I re-check purchase order "P0422" with the supplier
    When I confirm purchase order "P0422" to the supplier
    Then I am stopped with "Supplier POs are approved by management."
    And the purchase order "P0422" has status "Awaiting approval"

  Scenario: Management confirms a re-checked supplier PO
    Given I re-check purchase order "P0422" with the supplier
    And I am signed in as "Karim Balbaa"
    When I confirm purchase order "P0422" to the supplier
    Then the purchase order "P0422" has status "Confirmed"

  Scenario: A re-check that found changes is flagged to management
    Given I re-check purchase order "P0422" with the supplier
    When I ask management to approve purchase order "P0422"
    Then the approval "Supplier PO P0422 to Nile Safety Equipment" has status "Pending"
    And the approval "Supplier PO P0422 to Nile Safety Equipment" has detail "PO P0422 · re-check done, changes flagged."

  Scenario: A clean re-check says so in the approval request
    Given I re-check purchase order "P0419" with the supplier
    When I ask management to approve purchase order "P0419"
    Then the approval "Supplier PO P0419 to Horizon Trading" has detail "PO P0419 · re-check done, no changes."
