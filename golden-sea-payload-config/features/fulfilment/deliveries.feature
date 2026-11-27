Feature: Deliveries to the vessel and proof of delivery
  Operations delivers the goods on board and records who signed the delivery note. A delivery counts as done
  only with the signed note, because the invoice and any shortage claim depend on it.

  Background:
    Given I am signed in as "Ahmedy"

  Scenario: Confirming a delivery needs the name of who signed on board
    When I confirm delivery "DN-0001" with the signed delivery note but no signer
    Then I am stopped with "Who signed the delivery note on board?"
    And the delivery "DN-0001" has status "Dispatched"

  Scenario: Confirming a delivery needs the signed delivery note
    When I confirm delivery "DN-0001" signed by "Chief Officer M. Saleh" without the signed delivery note
    Then I am stopped with "Attach the signed delivery note or photo before confirming delivery."
    And the delivery "DN-0001" has status "Dispatched"

  Scenario: A confirmed first drop leaves the case delivering and counts the drops
    When I confirm delivery "DN-0001" signed by "Chief Officer M. Saleh" with the signed delivery note
    Then the delivery "DN-0001" has status "Delivered — confirmed"
    And the delivery "DN-0001" has signed by (vessel) "Chief Officer M. Saleh"
    And the case "GS-RFQ-0133" has stage "Delivering"
    And the case "GS-RFQ-0133" has next action "Drop 1 of 2 delivered. Invoice DN-0001: delivered quantities only"

  Scenario: The case is delivered once every drop is confirmed
    Given I confirm delivery "DN-0001" signed by "Chief Officer M. Saleh" with the signed delivery note
    When I confirm delivery "DN-0002" signed by "Chief Officer M. Saleh" with the signed delivery note
    Then the case "GS-RFQ-0133" has stage "Delivered"

  Scenario: Shortages written on the delivery note are kept with the delivery
    When I confirm delivery "DN-0001" signed by "Chief Officer M. Saleh" with the signed delivery note, noting "2 pairs of gloves missing"
    Then the delivery "DN-0001" has shortages "2 pairs of gloves missing"

  Scenario: Confirming a delivery needs a signed-in person
    Given I am not signed in
    When I confirm delivery "DN-0001" signed by "Chief Officer M. Saleh" with the signed delivery note
    Then I am not allowed

  Scenario: A new ETA from the agent re-plans the drops that have not left
    When I apply the agent's ETA update to case "GS-RFQ-0133"
    Then I am told "ETA updated. 1 drop(s) re-planned; owner and management alerted."
    And the delivery "DN-0002" has status "Rescheduled"
    And the delivery "DN-0001" has status "Dispatched"
    And the case "GS-RFQ-0133" has blocker "ETA moved +40 h by agent: 1 drop(s) re-planned"

  Scenario: The same ETA update is applied only once
    Given I apply the agent's ETA update to case "GS-RFQ-0133"
    When I apply the agent's ETA update to case "GS-RFQ-0133"
    Then I am told "ETA already up to date. Nothing re-planned."

  Scenario: A case without an ETA email from the agent has nothing to apply
    When I apply the agent's ETA update to case "GS-RFQ-0131"
    Then I am stopped with "No ETA update from the agent for this case."

  Scenario: A short receipt follows in the next drop
    When I open the order page of case "GS-RFQ-0133"
    Then line 2 is on backorder for delivery "DN-0002", "in time"
    And line 3 is on backorder for delivery "DN-0002", "arriving too late"

  Scenario: Sales sees the delivery plan without supplier costs or bills
    Given I am signed in as "Soaad Amer"
    When I open the order page of case "GS-RFQ-0133"
    Then I see no supplier costs or bills

  Scenario: Operations sees the supplier costs and bills of a case
    When I open the order page of case "GS-RFQ-0133"
    Then I see the supplier costs and bills
