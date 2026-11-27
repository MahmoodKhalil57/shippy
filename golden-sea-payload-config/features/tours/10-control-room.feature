@tour
Feature: The business, live — briefed at 07:00
  The CEO's control room and Ask Golden Sea — and what Sales is never told.

  Scenario: The tour
    Given I am signed in as "Karim Balbaa"
    And I open the "Control room" page
    Then the tour points at "daily AI briefing" and says "Briefed before coffee"
      """
      Written at 07:00 from live records, with links to its sources.
      """
    When I click "Who owes us money?"
    And I give it 1.6 seconds
    Then the tour points at "Ask Golden Sea" and says "Ask anything"
      """
      Questions are answered from the live data, and every answer cites the records it used.
      """
    And the tour points at "Margin by store" and says "Policy in the numbers"
      """
      Margin by store against the 15% minimum, plus pipeline, speed, cash and supplier performance.
      """
    When I sign in as "Soaad Amer"
    And I open the "Control room" page
    Then the tour points at "Ask Golden Sea" and says "Sales never sees margins"
      """
      Signed in as Soaad Amer, the same assistant declines questions about costs and margins.
      """
