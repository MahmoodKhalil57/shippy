Feature: Service usage against the plan
  Golden Sea's managers check how much of the dashboard service they use this month against the plan, and the
  typing time the AI reading saves them.

  Scenario: Hours saved count twelve minutes for every document read
    Given I am signed in as "Karim Balbaa"
    When I open the service usage
    Then each document read counts as 12 minutes of typing saved

  Scenario: Service usage needs a signed-in person
    Given I am not signed in
    When I open the service usage
    Then I am not allowed
