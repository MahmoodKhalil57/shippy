Feature: Turning inbox messages into cases
  Supply chain reads each customer message in the inbox and turns a real request into a case.
  The inbox makes one case per request and acknowledges the customer once, so no RFQ is lost or answered twice.
  Only supply chain and management create cases. Everyone else can read the inbox.

  Background:
    Given I am signed in as "Karim Youssef"

  Scenario: A new RFQ by email becomes a case and the customer is acknowledged once
    When I create a case from the message "RFQ – MV Helios Star – engine stores – urgent"
    Then I am told "Case GS-RFQ-0143 created · acknowledgement sent once"
    And the intake message "RFQ – MV Helios Star – engine stores – urgent" has status "Case created"
    And the case "GS-RFQ-0143" has vessel "MV Helios Star"

  Scenario: A case with an unclear line starts in validation
    When I create a case from the message "RFQ – MV Helios Star – engine stores – urgent"
    Then the case "GS-RFQ-0143" has stage "Validating"

  Scenario: A case with every line clear starts in sourcing
    When I create a case from the message "Quick quote — Lalizas life jackets & lifebuoys, Abu Qir rig"
    Then the case "GS-RFQ-0143" has stage "Sourcing"

  Scenario: A request from a website form is acknowledged by hand
    When I create a case from the message "Quick quote — Lalizas life jackets & lifebuoys, Abu Qir rig"
    Then I am told "Case GS-RFQ-0143 created · acknowledge by hand"

  Scenario: A request from a new customer adds the customer
    When I create a case from the message "Quick quote — Lalizas life jackets & lifebuoys, Abu Qir rig"
    Then the customer "Petro Delta" has country "Egypt"

  Scenario: A customs clearance request becomes a service case
    When I create a case from the message "Spares for MV Aurora Crest — DHL AWB 41 2233 9081 — please clear & deliver with stores"
    Then the case "GS-SVC-0001" has stage "Customs clearance"
    And the intake message "Spares for MV Aurora Crest — DHL AWB 41 2233 9081 — please clear & deliver with stores" has classification "Service request"

  Scenario: A message makes only one case
    Given I create a case from the message "RFQ – MV Helios Star – engine stores – urgent"
    When I create a case from the message "RFQ – MV Helios Star – engine stores – urgent"
    Then I am told "Case GS-RFQ-0143 was already created from this message"

  Scenario: Reading a new RFQ does not create a case by itself
    When I read the message "RFQ – MV Helios Star – engine stores – urgent"
    Then the intake message "RFQ – MV Helios Star – engine stores – urgent" has status "New"
    And the intake message "RFQ – MV Helios Star – engine stores – urgent" has classification "New RFQ"

  Scenario: A message with nothing read from it cannot become a case
    When I create a case from the message "RE: Price enquiry – belt grip spray"
    Then I am stopped with "Nothing extracted from this message yet."

  Scenario: Management can create a case
    Given I am signed in as "Karim Balbaa"
    When I create a case from the message "RFQ – MV Helios Star – engine stores – urgent"
    Then I am told "Case GS-RFQ-0143 created · acknowledgement sent once"

  Scenario Outline: Only supply chain and management create cases
    Given I am signed in as "<person>"
    When I create a case from the message "RFQ – MV Helios Star – engine stores – urgent"
    Then I am not allowed
    And I am stopped with "Only supply chain and management can do this."
    And the intake message "RFQ – MV Helios Star – engine stores – urgent" has status "New"
    And there is no case "GS-RFQ-0143"

    Examples:
      | person        |
      | Soaad Amer    |
      | Ahmedy        |
      | Mohamed Helmy |
      | Esraa Mohamed |

  Scenario: Everyone signed in can read a new RFQ
    Given I am signed in as "Soaad Amer"
    When I read the message "RFQ – MV Helios Star – engine stores – urgent"
    Then the intake message "RFQ – MV Helios Star – engine stores – urgent" has classification "New RFQ"

  Scenario: Only signed-in people can work the inbox
    Given I am not signed in
    When I create a case from the message "RFQ – MV Helios Star – engine stores – urgent"
    Then I am not allowed
