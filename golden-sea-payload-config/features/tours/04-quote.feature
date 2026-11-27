@tour
Feature: From offers to an approved quotation
  The buyer compares and prices, the CEO approves, the customer gets Golden Sea's own layout.

  Scenario: The tour
    Given I am signed in as "Karim Youssef"
    And I open the "Compare offers" tab of case "GS-RFQ-0142"
    And I click "Landed cost"
    Then the tour points at "How offers are compared" and says "Cheapest isn't always cheapest on board"
      """
      Every offer is normalised to EGP per base unit. Switch to landed cost and freight to Port Said
      re-ranks them.
      """
    And the tour points at "L2 · LOCTITE 243" and says "The wrong part is caught"
      """
      242 was offered for an exact-part 243 line, so the line is blocked from pricing. v1 is kept for
      the record; the corrected v2 is used.
      """
    And the tour points at "L5 · Safety helmet" and says "Own stock and split sourcing"
      """
      Alexandria stock is cheapest per unit but dearest delivered. The proposal splits 10 + 5 across
      two suppliers, both before the vessel's ETA.
      """
    When I open the "Pricing" tab of case "GS-RFQ-0142"
    Then the tour points at "Margin = profit ÷ selling price" and says "Margin, not markup"
      """
      Shared charges are spread over the lines; policy is checked on margin, and every line shows
      cost, charges and profit.
      """
    And the tour points at "Approval" and says "A person approves"
      """
      The quotation and its exceptions go to Karim Balbaa with one click. AI never prices on its own.
      """
    When I sign in as "Karim Balbaa"
    And I open the "Approvals" page
    Then the tour points at "Waiting for you" and says "Evidence first"
      """
      Karim Balbaa sees what he's deciding and why — the margin, the FX rate, the deposit, and the
      bank change Mohamed Helmy already approved.
      """
    When I open the "Preview & send" tab of quotation "GS-Q-0142 v1"
    And I click "العربية"
    Then the tour points at "Decision state" and says "Their layout, their language"
      """
      The same quotation in Golden Sea's own layout, in English or Arabic, in EGP or USD. Nothing goes
      to the customer until a person confirms the email.
      """
