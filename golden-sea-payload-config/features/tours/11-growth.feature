@tour
Feature: Growing the customer base
  Prospects, fleets and vendor registrations — with what to say on the next call.

  Scenario: The tour
    Given I am signed in as "Soaad Amer"
    And I open the "Growth board" page
    Then the tour points at "Growth funnel" and says "A pipeline beyond RFQs"
      """
      Ship managers from first introduction to active account; stalled prospects are flagged.
      """
    And the tour points at "Sales next steps" and says "Know what to say"
      """
      Each next step has a short script. Recording the outcome plans the next one.
      """
    And the tour points at "Vendor registrations" and says "Registrations tracked"
      """
      Documents and committee dates for getting onto each ship manager's approved-vendor list.
      """
