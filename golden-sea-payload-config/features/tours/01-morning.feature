@tour
Feature: One morning, four people
  The buyer, sales, the CEO and finance start their day — each sees only what needs them.

  Scenario: The tour
    Given I am signed in as "Karim Youssef"
    And I open my home page
    Then the tour says "Every role has its own day"
      """
      This is Karim Youssef, supply chain. Golden Sea's dashboard is built for the person signed in:
      his waiting states, his queue, his follow-ups.
      """
    And the tour points at "My queue" and says "A queue sorted by risk"
      """
      Every live case has an owner, a deadline and a next action. Blocked and at-risk cases come
      first, then the nearest deadline.
      """
    And the tour points at "Daily briefing" and says "Briefed at 07:00"
      """
      What changed overnight and what needs him today: deadlines, a PO mismatch, a supplier that
      hasn't replied, failed integrations.
      """
    When I sign in as "Soaad Amer"
    And I open my home page
    Then the tour points at "My queue" and says "Sales sees the same cases — without costs"
      """
      Soaad Amer signs in. Her queue has no values, costs or margins: sales never sees what Golden Sea
      pays its suppliers.
      """
    When I sign in as "Karim Balbaa"
    And I open my home page
    Then the tour points at "Waiting for your decision" and says "The CEO starts with decisions"
      """
      Karim Balbaa sees what waits for him first — a margin exception from Soaad, a supplier deposit,
      an FX rate, and a bank change that already has one of its two approvals.
      """
    When I sign in as "Mohamed Helmy"
    And I open my home page
    Then the tour points at "Waiting for your decision" and says "Finance approves payments"
      """
      Mohamed Helmy only sees payments and deposits. He already approved the bank change after a
      call-back; it now waits for the CEO — two people, always.
      """
    When I sign in as "Karim Youssef"
    And I open my home page
    And I open the side panel
    Then the tour points at "Notifications" in the side panel and says "Everyone's own notifications"
      """
      Notifications, bookmarks and the counters in this panel belong to the person signed in. Back as
      Karim Youssef — his are about his cases.
      """
