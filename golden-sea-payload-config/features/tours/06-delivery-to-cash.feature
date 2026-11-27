@tour
Feature: From the quay to the bank
  An ETA change re-plans the delivery, proof of delivery unlocks the invoice, finance collects and
  pays.

  Scenario: The tour
    Given I am signed in as "Ahmedy"
    And I open the "Delivery & billing" tab of case "GS-RFQ-0133"
    Then the tour points at "Vessel delivery plan" and says "The vessel moves, the plan follows"
      """
      Port, ETA, agent, truck, boarding staff and launch in one plan. When the agent moves the ETA,
      drop 2 is re-planned and the owner is alerted.
      """
    And the tour points at "Drops & proof of delivery" and says "No evidence, no "Delivered""
      """
      Two drops for one order. A drop counts as delivered only with the signed delivery note from the
      vessel.
      """
    And the tour points at "Customer invoices & payments" and says "Invoice what was delivered, then e-invoice"
      """
      Only delivered quantities are invoiced, each invoice goes to the Egyptian tax authority, and
      rejections or outages get a safe retry.
      """
    When I sign in as "Mohamed Helmy"
    And I open the "Receivables & payables" page
    Then the tour points at "Payments needing approval" and says "A person approves, finance pays"
      """
      Receivables and payables side by side. Supplier payments wait for the Financial Director or the
      CEO.
      """
    When I sign in as "Karim Balbaa"
    And I open the "Receivables & payables" page
    Then the tour points at "requested change" and says "Two different people, always"
      """
      A supplier's new bank account needs a call-back on the number on file and two approvers —
      Finance and the CEO.
      """
