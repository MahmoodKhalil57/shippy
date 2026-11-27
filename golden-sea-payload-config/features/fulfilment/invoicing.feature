Feature: Invoicing delivered goods
  Operations and finance invoice each confirmed delivery for the quantities delivered and no more. VAT follows
  the customer: Egyptian customers pay 14%, foreign vessels in transit pay none.

  Background:
    Given I am signed in as "Ahmedy"

  Scenario Outline: Operations and finance issue invoices
    Given I confirm delivery "DN-0001" signed by "Chief Officer M. Saleh" with the signed delivery note
    And I am signed in as "<person>"
    When I invoice delivery "DN-0001"
    Then I am told "INV/2026/0420 created from DN-0001, for delivered quantities only."

    Examples:
      | person        |
      | Karim Balbaa  |
      | Mohamed Helmy |
      | Ahmedy        |

  Scenario Outline: Other roles cannot issue invoices
    Given I confirm delivery "DN-0001" signed by "Chief Officer M. Saleh" with the signed delivery note
    And I am signed in as "<person>"
    When I invoice delivery "DN-0001"
    Then I am stopped with "Invoices are issued by operations & finance."

    Examples:
      | person        |
      | Soaad Amer    |
      | Karim Youssef |
      | Esraa Mohamed |

  Scenario: Only a confirmed delivery can be invoiced
    When I invoice delivery "DN-0001"
    Then I am stopped with "Only a delivery confirmed with a signed delivery note can be invoiced."

  Scenario: An Egyptian customer is invoiced with 14% VAT on its payment terms
    Given I confirm delivery "DN-0001" signed by "Chief Officer M. Saleh" with the signed delivery note
    When I invoice delivery "DN-0001"
    Then the invoice "INV/2026/0420" has vat treatment "14% standard"
    And the invoice "INV/2026/0420" has currency "EGP"
    And the invoice "INV/2026/0420" has status "Open"
    And the invoice "INV/2026/0420" has e-invoice (tax authority) "Not submitted"
    And the case "GS-RFQ-0133" has next action "Submit INV/2026/0420 to the tax authority (e-invoice)"

  Scenario: A delivery cannot be invoiced twice
    When I invoice delivery "DN-0131"
    Then I am stopped with "Line 1: invoicing more than delivered (6 already invoiced)."

  Scenario: A cancelled invoice frees the delivery to be invoiced again, without VAT for a foreign vessel
    Given the invoice "INV/2026/0412" has its status set to "Cancelled"
    When I invoice delivery "DN-0131"
    Then I am told "INV/2026/0420 created from DN-0131, for delivered quantities only."
    And the invoice "INV/2026/0420" has vat treatment "0% — foreign vessel in transit"
    And the invoice "INV/2026/0420" has currency "USD"

  Scenario: The order page shows which invoice covers each delivery
    When I open the order page of case "GS-RFQ-0131"
    Then delivery "DN-0131" shows invoice "INV/2026/0412"

  Scenario: A delivery not yet invoiced shows no invoice
    Given I confirm delivery "DN-0001" signed by "Chief Officer M. Saleh" with the signed delivery note
    When I open the order page of case "GS-RFQ-0133"
    Then delivery "DN-0001" shows no invoice
