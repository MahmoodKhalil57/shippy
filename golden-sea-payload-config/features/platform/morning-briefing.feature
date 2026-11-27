Feature: Morning briefing
  Every morning at 07:00 Golden Sea writes a briefing from the live records: quotes due, silent suppliers, approvals, money and integration problems.
  Each person reads only what their role may see, and anyone can ask for it to be summarised again.

  Scenario: The briefing needs a signed-in person
    Given I am not signed in
    When I read the morning briefing
    Then I am not allowed

  Scenario: The briefing greets me and says what it read
    Given I am signed in as "Karim Balbaa"
    When I read the morning briefing
    Then the morning briefing opens with "Good morning Karim."
    And the morning briefing note reads "Written at 07:00 from 75 live records. A draft to read: nothing is sent, priced or paid."

  Scenario: Quotes due by tomorrow come with their blocker
    Given I am signed in as "Karim Youssef"
    When I read the morning briefing
    Then the morning briefing mentions "4 quotes must go out by tomorrow"
    And the morning briefing mentions "MV Corallo (GS-RFQ-0137) tomorrow 10:00, waiting for management approval of the price"
    And the morning briefing links to "GS-RFQ-0137"

  Scenario: A quote sent to the customer is no longer due
    Given I am signed in as "Karim Youssef"
    And the case "GS-RFQ-0137" has its stage set to "Quotation submitted"
    When I read the morning briefing
    Then the morning briefing mentions "3 quotes must go out by tomorrow"

  Scenario: Suppliers who missed their reply date are listed with their reminders
    Given I am signed in as "Karim Youssef"
    When I read the morning briefing
    Then the morning briefing mentions "Red Sea Safety on GS-SRFQ-0141-A (2 reminders sent)"

  Scenario: A PO mismatch is in everyone's briefing
    Given I am signed in as "Soaad Amer"
    When I read the morning briefing
    Then the morning briefing mentions "The customer PO on GS-RFQ-0136 (MV Nordic Tern) differs from the approved quote: Commitment blocked."

  Scenario: Approvers hear what waits for them
    Given I am signed in as "Karim Balbaa"
    When I read the morning briefing
    Then the morning briefing mentions "6 approvals wait for you"

  Scenario: Others hear what kinds of approvals are waiting
    Given I am signed in as "Soaad Amer"
    When I read the morning briefing
    Then the morning briefing mentions "6 items are awaiting approval"

  Scenario Outline: Short supplier deliveries are not shown to Sales
    Given I am signed in as "<person>"
    When I read the morning briefing
    Then the morning briefing <sees> "2 supplier deliveries came in short"

    Examples:
      | person        | sees             |
      | Ahmedy        | mentions         |
      | Karim Youssef | mentions         |
      | Soaad Amer    | does not mention |

  Scenario Outline: Collections are not shown to Sales
    Given I am signed in as "<person>"
    When I read the morning briefing
    Then the morning briefing <sees> "Overdue: Atlas Tankers USD 1,400 (INV/2026/0371)"

    Examples:
      | person        | sees             |
      | Mohamed Helmy | mentions         |
      | Karim Youssef | mentions         |
      | Soaad Amer    | does not mention |

  Scenario Outline: Exchange rates, bills on hold and gross profit are for money roles only
    Given I am signed in as "<person>"
    When I read the morning briefing
    Then the morning briefing <sees> "USD moved from 48.60 to 48.95 EGP"
    And the morning briefing <sees> "2 supplier bills are on hold after the three-way match"
    And the morning briefing <sees> "November gross profit: EGP 412k expected at quotation, EGP 268k actual so far"

    Examples:
      | person        | sees             |
      | Karim Balbaa  | mentions         |
      | Mohamed Helmy | mentions         |
      | Ahmedy        | mentions         |
      | Karim Youssef | does not mention |
      | Soaad Amer    | does not mention |

  Scenario: Open integration exceptions are in the briefing
    Given I am signed in as "Esraa Mohamed"
    When I read the morning briefing
    Then the morning briefing mentions "2 integration exceptions need a look"

  Scenario: A quote already with the customer is not due
    Given I am signed in as "Karim Youssef"
    When I read the morning briefing
    Then the morning briefing does not mention "MT Atlas Pearl (GS-RFQ-0139)"

  Scenario: Summarising again is logged as an AI call
    Given I am signed in as "Mohamed Helmy"
    When I ask for the morning briefing to be summarised again
    Then the AI work "Briefing from 75 live records" is logged as "Applied automatically"

  Scenario: The briefing keeps the time it was summarised again
    Given I am signed in as "Mohamed Helmy"
    And I ask for the morning briefing to be summarised again
    When I read the morning briefing
    Then the morning briefing says it was summarised again at the time I asked

  Scenario: Summarising again is kept with each person's records
    Given I am signed in as "Mohamed Helmy"
    And I ask for the morning briefing to be summarised again
    And I am signed in as "Karim Balbaa"
    When I read the morning briefing
    Then the morning briefing note reads "Written at 07:00 from 75 live records. A draft to read: nothing is sent, priced or paid."

  Scenario: A fresh start brings back the 07:00 briefing
    Given I am signed in as "Mohamed Helmy"
    When I read the morning briefing
    Then the morning briefing note reads "Written at 07:00 from 75 live records. A draft to read: nothing is sent, priced or paid."
