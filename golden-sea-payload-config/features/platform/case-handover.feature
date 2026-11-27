Feature: Case overview and handover
  Every case has an owner, a backup, a next action and a deadline, so nothing falls through on leave.
  The owner, the backup, the supply-chain desk or management can hand a case over, with a note and an AI draft to start from.
  A handover keeps the case's backup unless it names a new one.

  Scenario: The case overview needs a signed-in person
    Given I am not signed in
    When I open the overview of case "GS-RFQ-0142"
    Then I am not allowed

  Scenario: A case that does not exist has no overview
    Given I am signed in as "Karim Youssef"
    When I open the overview of a case that does not exist
    Then I am stopped with "Case not found."

  Scenario Outline: The overview warns when the quote deadline is close or passed
    Given I am signed in as "Karim Youssef"
    When I open the overview of case "<case>"
    Then the case overview gives the quote deadline as "<deadline>"

    Examples:
      | case        | deadline                        |
      | GS-RFQ-0142 | Wed 18 Nov 16:00                |
      | GS-RFQ-0140 | Thu 19 Nov 14:00                |
      | GS-RFQ-0139 | Thu 12 Nov 14:00 (passed)       |

  Scenario: A quote deadline less than a day away is flagged
    Given I am signed in as "Karim Youssef"
    And the case "GS-RFQ-0142" has its deadline set to "2026-11-18T08:00:00.000Z"
    When I open the overview of case "GS-RFQ-0142"
    Then the case overview gives the quote deadline as "Wed 18 Nov 10:00 (within 24 h)"

  Scenario Outline: The overview shows where the case stands in the lifecycle
    Given I am signed in as "Karim Youssef"
    When I open the overview of case "<case>"
    Then the case overview is at step "<step>"
    And the case overview shows the case as "<state>"

    Examples:
      | case        | step     | state   |
      | GS-RFQ-0142 | Compare  | moving  |
      | GS-RFQ-0130 | Decision | paused  |
      | GS-RFQ-0133 | Deliver  | moving  |

  Scenario: A lost case shows as stopped
    Given I am signed in as "Karim Youssef"
    And the case "GS-RFQ-0142" has its stage set to "Lost"
    When I open the overview of case "GS-RFQ-0142"
    Then the case overview shows the case as "stopped"

  Scenario: A delivery counts only once it is confirmed
    Given I am signed in as "Ahmedy"
    When I open the overview of case "GS-RFQ-0133"
    Then the case overview counts "4 ordered, 2 received, 0 delivered, 0 invoiced of 9"
    And the case overview notes "DN-0002 planned, not counted as delivered until confirmed"

  Scenario: An invoiced case counts its delivered and invoiced lines
    Given I am signed in as "Ahmedy"
    When I open the overview of case "GS-RFQ-0131"
    Then the case overview counts "4 ordered, 4 received, 4 delivered, 4 invoiced of 4"

  Scenario Outline: Who may hand a case over
    Given I am signed in as "<person>"
    When I open the overview of case "GS-RFQ-0142"
    Then I <may> hand the case over

    Examples:
      | person        | may    |
      | Karim Youssef | can    |
      | Soaad Amer    | can    |
      | Karim Balbaa  | can    |
      | Ahmedy        | cannot |
      | Esraa Mohamed | cannot |

  Scenario: A case can only go to someone on the desk
    Given I am signed in as "Karim Youssef"
    When I open the overview of case "GS-RFQ-0142"
    Then the case can be handed to "Karim Youssef, Karim Balbaa, Soaad Amer, Ahmedy"

  Scenario: The handover draft covers open questions and lines to check
    Given I am signed in as "Karim Youssef"
    When I ask for a handover draft of case "GS-RFQ-0142" for "Soaad Amer"
    Then the handover draft says "Handover: GS-RFQ-0142 for Soaad Amer"
    And the handover draft says "Check line 6 (Flame-retardant coverall, navy, EN ISO 11612): AI read it at 58%."
    And the AI work "Handover note for GS-RFQ-0142 to Soaad Amer" is logged as "Waiting for review"

  Scenario: Someone who may not reassign gets no handover draft
    Given I am signed in as "Ahmedy"
    When I ask for a handover draft of case "GS-RFQ-0142" for "Soaad Amer"
    Then I am stopped with "Only the owner, the backup, the supply-chain desk or management can reassign."

  Scenario: A handover draft is only for someone on the desk
    Given I am signed in as "Karim Youssef"
    When I ask for a handover draft of case "GS-RFQ-0142" for "Esraa Mohamed"
    Then I am stopped with "Pick someone on the desk to hand over to."

  Scenario: A handover needs a note
    Given I am signed in as "Karim Youssef"
    When I hand case "GS-RFQ-0142" over to "Ahmedy" without a note
    Then I am stopped with "A handover note is required."
    And case "GS-RFQ-0142" is owned by "Karim Youssef" with "Soaad Amer" as backup

  Scenario: A case cannot be handed to its own owner
    Given I am signed in as "Karim Youssef"
    When I hand case "GS-RFQ-0142" over to "Karim Youssef" with the note "Back to me"
    Then I am stopped with "Karim Youssef already owns GS-RFQ-0142."

  Scenario: A case cannot be handed to someone off the desk
    Given I am signed in as "Karim Youssef"
    When I hand case "GS-RFQ-0142" over to "Nancy Elsobhy" with the note "Please cover"
    Then I am stopped with "Pick someone on the desk to hand over to."

  Scenario: Only the owner, the backup, the desk or management reassigns
    Given I am signed in as "Ahmedy"
    When I hand case "GS-RFQ-0142" over to "Ahmedy" with the note "I'll take it"
    Then I am stopped with "Only the owner, the backup, the supply-chain desk or management can reassign."

  Scenario: Handing a case over moves the open tasks and keeps the backup
    Given I am signed in as "Karim Youssef"
    When I hand case "GS-RFQ-0142" over to "Ahmedy" with the note "On leave from tomorrow"
    Then I am told "GS-RFQ-0142 handed over to Ahmedy · 3 open tasks moved · note logged on the timeline"
    And case "GS-RFQ-0142" is owned by "Ahmedy" with "Soaad Amer" as backup
    And the case "GS-RFQ-0142" has handover note "On leave from tomorrow"
    And the open tasks on case "GS-RFQ-0142" belong to "Ahmedy"
    And "Ahmedy" is notified "You now own GS-RFQ-0142"

  Scenario: A handover can name a new backup
    Given I am signed in as "Karim Youssef"
    When I hand case "GS-RFQ-0142" over to "Ahmedy" with "Karim Balbaa" as the new backup and the note "On leave from tomorrow"
    Then case "GS-RFQ-0142" is owned by "Ahmedy" with "Karim Balbaa" as backup

  Scenario: A new backup must be someone on the desk
    Given I am signed in as "Karim Youssef"
    When I hand case "GS-RFQ-0142" over to "Ahmedy" with "Esraa Mohamed" as the new backup and the note "On leave from tomorrow"
    Then I am stopped with "Pick someone on the desk to hand over to."
    And case "GS-RFQ-0142" is owned by "Karim Youssef" with "Soaad Amer" as backup

  Scenario: Handing a case to its backup makes the previous owner the backup
    Given I am signed in as "Karim Youssef"
    When I hand case "GS-RFQ-0142" over to "Soaad Amer" with the note "On leave from tomorrow"
    Then case "GS-RFQ-0142" is owned by "Soaad Amer" with "Karim Youssef" as backup

  Scenario: The handover draft counts as reviewed once the case is handed over
    Given I am signed in as "Karim Youssef"
    And I ask for a handover draft of case "GS-RFQ-0142" for "Soaad Amer"
    When I hand case "GS-RFQ-0142" over to "Soaad Amer" with the note "Draft checked"
    Then the AI work "Handover note for GS-RFQ-0142 to Soaad Amer" is logged as "Confirmed by a person"
