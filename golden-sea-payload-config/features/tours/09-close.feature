@tour
Feature: Settle and close a case
  Estimates become actuals, FX and claims are accounted for, and only green checks close the case.

  Scenario: The tour
    Given I am signed in as "Mohamed Helmy"
    And I open the "Profit & close" tab of case "GS-RFQ-0131"
    Then the tour points at "Expected vs actual" and says "Estimates become actuals"
      """
      The profit promised at quotation against the real result: the launch cost more than estimated
      once it was billed.
      """
    And the tour points at "FX differences" and says "FX is real money"
      """
      USD 10,000 arrived at 48.80 against the quoted 48.60 — a gain of EGP 2,000, on the case where it
      happened.
      """
    And the tour points at "Claims" and says "Claims settle against credit notes"
      """
      Two helmets cracked in transit; the supplier's credit note settles the claim.
      """
    And the tour points at "Close checklist" and says "Only green closes"
      """
      Bills matched, deliveries signed, invoices accepted by the tax authority and paid, claims
      settled — then the case can close.
      """
