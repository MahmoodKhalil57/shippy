Feature: Choosing the supplier offer for each line
  Supply chain picks which supplier offer prices each line of the customer's request.
  The best-fit offer has the lowest landed cost. Any other choice needs a reason the approver can read.

  Background:
    Given I am signed in as "Karim Youssef"

  Scenario: The best-fit offer needs no reason
    When I select 24 from "Horizon Trading" for line 1 of case "GS-RFQ-0142"
    Then line 1 of case "GS-RFQ-0142" is "Offer selected"

  Scenario: Another offer needs a reason
    When I select 24 from "Delta Marine Stores" for line 1 of case "GS-RFQ-0142"
    Then I am stopped with "Give a reason: this isn't the best-fit offer (kept for the approver)."

  Scenario: Another offer with a reason is accepted
    When I select 24 from "Delta Marine Stores" for line 1 of case "GS-RFQ-0142" because "Customer prefers an approved supplier"
    Then line 1 of case "GS-RFQ-0142" is "Offer selected"

  Scenario: An offer with an expired price cannot be used
    When I select 24 from "Suez Industrial Supply" for line 1 of case "GS-RFQ-0142" because "Cheapest"
    Then I am stopped with "Suez Industrial Supply v1 is blocked from pricing: Expired validity: offer ended 15 Nov, reconfirm."

  Scenario: An import that misses the vessel's arrival cannot be used
    When I select 200 from "Vecom Marine" for line 3 of case "GS-RFQ-0142" because "Exact pack"
    Then I am stopped with "Vecom Marine v1 is blocked from pricing: Lead time vs ETA: 9-day import misses vessel ETA 21 Nov."

  Scenario: An offer cannot cover more than the supplier has
    When I select 15 from "Nile Safety Equipment" for line 5 of case "GS-RFQ-0142" because "Cheapest"
    Then I am stopped with "Nile Safety Equipment offers only 10 EA."

  Scenario: The whole quantity must be covered
    When I select 10 from "Nile Safety Equipment" for line 5 of case "GS-RFQ-0142" because "Cheapest"
    Then I am stopped with "Selected 10 of 15 EA. Split the rest to another offer."

  Scenario: The cheapest split is the best fit
    When I split line 5 of case "GS-RFQ-0142" as 10 from "Nile Safety Equipment" and 5 from "Delta Marine Stores"
    Then line 5 of case "GS-RFQ-0142" is "Split offer selected"

  Scenario: A different split needs a reason
    When I split line 5 of case "GS-RFQ-0142" as 5 from "Nile Safety Equipment" and 10 from "Delta Marine Stores"
    Then I am stopped with "Give a reason: this isn't the best-fit offer (kept for the approver)."

  Scenario: An alternative pack waits for the customer
    When I select 200 from "Suez Industrial Supply" for line 3 of case "GS-RFQ-0142"
    Then line 3 of case "GS-RFQ-0142" is "Awaiting customer acceptance"

  Scenario: The customer's acceptance of the alternative completes the line
    When I record that the customer accepts the alternative on line 3 of case "GS-RFQ-0142"
    Then line 3 of case "GS-RFQ-0142" is "Offer selected"

  Scenario: An alternative can only be accepted once one is selected
    When I record that the customer accepts the alternative on line 4 of case "GS-RFQ-0142"
    Then I am stopped with "Select the alternative offer first."

  Scenario: A selection can be taken back
    Given I select 200 from "Delta Marine Stores" for line 3 of case "GS-RFQ-0142" because "Shelf life is fine for this voyage"
    When I take back that selection
    Then I am told "Line 3: selection taken back"
    And line 3 of case "GS-RFQ-0142" is "Awaiting customer acceptance"

  Scenario: A selection on a quotation waiting for approval cannot be taken back
    Given I select 4 from "Delta Marine Stores" for line 3 of case "GS-RFQ-0137"
    When I take back that selection
    Then I am stopped with "GS-Q-0137 v2 is awaiting approval with this selection. Revise the quotation instead."

  Scenario: Offers are hidden from sales
    Given I am signed in as "Soaad Amer"
    When I look at the offers for case "GS-RFQ-0142"
    Then I am stopped with "Costs and margins are hidden for your role."
