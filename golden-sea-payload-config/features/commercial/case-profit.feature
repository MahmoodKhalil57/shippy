Feature: Case profit and closing a case
  Finance compares each case's actual profit with what the quotation expected, and closes the case once every cost and payment is settled.
  A case only closes when its bills, deliveries, invoices, payments, claims and actual costs are all in order.

  Background:
    Given I am signed in as "Mohamed Helmy"

  Scenario: A case cannot close while checks are open
    When I close case "GS-RFQ-0131" as settled
    Then I am stopped with "The case can't close yet: customer invoices paid in full, claims settled, estimated costs replaced by actuals."
    And the case "GS-RFQ-0131" has stage "Invoiced — partially paid"

  Scenario: Confirming actual costs replaces the estimates with the billed amounts
    When I confirm the actual costs of case "GS-RFQ-0131"
    Then the close check "Estimated costs replaced by actuals" is done

  Scenario: Recording the customer's payment settles the open invoice
    When I record the customer's payment on case "GS-RFQ-0131" with bank reference "TRX-77984"
    Then the close check "Customer invoices paid in full" is done
    And the payment "TRX-77984" has amount "4200"

  Scenario: A customer payment is converted at the approved exchange rate
    When I record the customer's payment on case "GS-RFQ-0131" with bank reference "TRX-77984"
    Then the payment "TRX-77984" has actual fx "48.6"

  Scenario: A new exchange rate is used for payments once management approves it
    Given I am signed in as "Karim Balbaa"
    And I approve the request "New USD rate 48.95 (from 48.60)"
    When I record the customer's payment on case "GS-RFQ-0131" with bank reference "TRX-77984"
    Then the payment "TRX-77984" has actual fx "48.95"

  Scenario: Recording the supplier's credit note settles the claim
    When I record the credit note for claim "CLM-0131-1" on case "GS-RFQ-0131"
    Then the close check "Claims settled" is done

  Scenario: A claim must be one recorded on the case
    When I record the credit note for claim "CLM-9999" on case "GS-RFQ-0131"
    Then I am stopped with "Claim not found."

  Scenario: A case with every check done closes as settled
    Given I confirm the actual costs of case "GS-RFQ-0131"
    And I record the customer's payment on case "GS-RFQ-0131" with bank reference "TRX-77984"
    And I record the credit note for claim "CLM-0131-1" on case "GS-RFQ-0131"
    And the case can be closed
    When I close case "GS-RFQ-0131" as settled
    Then the case "GS-RFQ-0131" has stage "Closed — settled"
    And the case "GS-RFQ-0131" has next action "None: case closed"

  Scenario: A payment can only be recorded against a single open invoice
    When I record the customer's payment on case "GS-RFQ-0133" with bank reference "TRX-1"
    Then I am stopped with "There is no single open invoice balance to record."

  Scenario: Deliveries not yet signed on board keep the case open
    When I open the profit of case "GS-RFQ-0133"
    Then the close check "Deliveries signed on board" is open
    And the close check "Supplier bills matched to POs and receipts" is open
    And the close check "Claims settled" is done
    And the case cannot be closed

  Scenario Outline: Only management and finance record payments, credit notes and closures
    Given I am signed in as "<person>"
    When I close case "GS-RFQ-0131" as settled
    Then I am stopped with "Only management and finance record receipts, credit notes and closures."

    Examples:
      | person        |
      | Karim Youssef |
      | Esraa Mohamed |

  Scenario Outline: Everyone but sales sees the case profit
    Given I am signed in as "<person>"
    When I open the profit of case "GS-RFQ-0131"
    Then the case cannot be closed
    And the close check "Deliveries signed on board" is done

    Examples:
      | person        |
      | Karim Balbaa  |
      | Ahmedy        |
      | Karim Youssef |

  Scenario: Profit is hidden from sales
    Given I am signed in as "Soaad Amer"
    When I open the profit of case "GS-RFQ-0131"
    Then I am stopped with "Profit, costs and margins are not visible to Sales."
