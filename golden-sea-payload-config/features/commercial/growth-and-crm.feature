Feature: Growth and sales follow-up
  Sales logs the outcome of every call or visit to a prospect and plans the next step, so no opportunity goes quiet.
  The fleet view shows which ship managers and owners Golden Sea already supplies and which vessels are still to win.

  Background:
    Given I am signed in as "Soaad Amer"

  Scenario: An outcome with a next step plans the follow-up
    When I log the outcome "Reached — positive" for "Gulf Star Shipping" with the next step "Send registration documents" on "2026-11-21"
    Then I am told "Outcome saved. Next step “Send registration documents” planned for 21 Nov"
    And the opportunity "Gulf Star Shipping" has next step "Send registration documents"
    And there is an open sales task "Send registration documents: Gulf Star Shipping"

  Scenario: Logging an outcome completes the open follow-up task
    When I log the outcome "No answer" for "Gulf Star Shipping" with the next step "Call again" on "2026-11-19"
    Then the task "Call Gulf Star — registration decision date" has status "Done"

  Scenario: An open opportunity needs a next step and its date
    When I log the outcome "No answer" for "Aegean Ferries"
    Then I am stopped with "Plan the next step and its date (or close the opportunity)."

  Scenario Outline: A closed opportunity or an active account needs no next step
    When I log the outcome "<outcome>" for "<opportunity>" and move it to "<stage>"
    Then I am told "Outcome saved. <opportunity> is now “<stage>”"
    And the opportunity "<opportunity>" has stage "<stage>"

    Examples:
      | outcome            | opportunity             | stage          |
      | Not interested     | Aegean Ferries          | Closed         |
      | Reached — positive | Nordvik Ship Management | Active account |

  Scenario: An outcome must be chosen
    When I log the outcome "Thinking about it" for "Aegean Ferries"
    Then I am stopped with "Choose an outcome."

  Scenario: The stage must be one of the growth stages
    When I log the outcome "Reached — positive" for "Aegean Ferries" and move it to "Won"
    Then I am stopped with "Unknown stage."

  Scenario: The next step date must be a date
    When I log the outcome "Reached — call back" for "Aegean Ferries" with the next step "Call back" on "next Tuesday"
    Then I am stopped with "The next step date isn't a date."

  Scenario: Logging an outcome needs a signed-in person
    Given I am not signed in
    When I log the outcome "No answer" for "Aegean Ferries"
    Then I am not allowed

  Scenario: The fleet view shows customer fleets and the vessels already supplied
    When I look at the fleets
    Then the fleet of "Helios Bulk Carriers" shows 2 vessels, 2 supplied
    And the fleet of "Mare Nostrum Shipping" shows 1 vessels, 1 supplied
    And the fleet of "Nordvik Ship Management" shows 2 vessels, 2 supplied

  Scenario: The fleet view shows prospects with a known fleet
    When I look at the fleets
    Then the fleet of "Baltic Reefer Management" shows 3 vessels, 0 supplied
    And the fleet of "Gulf Star Shipping" shows 3 vessels, 0 supplied

  Scenario: The fleet view leaves out companies without a fleet to win
    When I look at the fleets
    Then the fleets do not show "Delta Offshore Services"
    And the fleets do not show "Red Sea Dredging"

  Scenario: A closed opportunity leaves the fleet view
    Given I log the outcome "Not interested" for "Medline Tankers" and move it to "Closed"
    When I look at the fleets
    Then the fleets do not show "Medline Tankers"
