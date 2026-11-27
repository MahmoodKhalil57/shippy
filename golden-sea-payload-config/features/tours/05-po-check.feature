@tour
Feature: The PO doesn't match the quote
  A customer PO with an old price and the wrong quantity is caught before anything is ordered.

  Scenario: The tour
    Given I am signed in as "Karim Youssef"
    And I open the "Order & purchasing" tab of case "GS-RFQ-0136"
    Then the tour points at "Customer PO check" and says "The PO is checked line by line"
      """
      Nordvik's PO is matched to the approved quotation version. An old pack size, an expired v1 price
      and 15 instead of 10 helmets block the commitment until the customer agrees in writing.
      """
    And the tour points at "Partial award" and says "Partial awards, never silent"
      """
      Lines the customer didn't order stay open for a revision or close with a recorded reason.
      """
    And the tour points at "Supplier purchase orders" and says "Purchase orders per supplier"
      """
      Once the PO is agreed, supplier POs are prepared — drop-shipped or through the warehouse — and
      each is re-checked against the latest offer first.
      """
    And the tour points at "Supplier bills" and says "Three-way match"
      """
      Each supplier bill is matched to its PO and the goods received; a duplicate bill is refused.
      """
    When I sign in as "Karim Balbaa"
    Then the tour points at "Supplier purchase orders" and says "Karim Balbaa confirms"
      """
      Signed in as the CEO: a flagged price change on a supplier PO is shown before he commits, and
      deposits wait for a payment approval.
      """
