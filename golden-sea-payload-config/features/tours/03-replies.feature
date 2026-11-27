@tour
Feature: Every reply matched, every price remembered
  Supplier RFQs go out without the client's name; replies are matched even with new subjects.

  Scenario: The tour
    Given I am signed in as "Karim Youssef"
    And I open the "Supplier RFQs" tab of case "GS-RFQ-0142"
    Then the tour points at "Each supplier sees only the lines they can quote" and says "The client stays hidden"
      """
      Lines are split by category and each supplier sees only its lines — never the customer or the
      vessel.
      """
    When I click "Simulate replies"
    And I give it 2.5 seconds
    Then the tour points at "Replies arriving" and says "Matched by reference"
      """
      Replies arrive with changed subjects; each is matched to its RFQ by its reference, and reminders
      stop for that supplier.
      """
    And the tour points at "quoted, never ordered" and says "Remembered without an order"
      """
      A supplier Golden Sea never bought from replied. It's created automatically, with its price,
      date and validity.
      """
    And the tour points at "Needs a person" and says "A person confirms the uncertain"
      """
      An unclear price unit isn't used until someone confirms it.
      """
    When I sign in as "Karim Balbaa"
    And I open the "Inbox history" page
    Then the tour points at "Organise and approve" and says "Years of email, organised"
      """
      The same engine reads the old inboxes into customers, vessels, suppliers and dated prices.
      Nothing is saved until Karim Balbaa approves.
      """
