Feature: Urgent RFQs after hours
  Golden Sea works Sunday to Thursday, 08:00 to 17:00 Cairo time. An urgent RFQ outside those hours goes to the person on duty,
  then to their backup, then to the senior contacts. Management and the office manager keep the on-call roster.

  Scenario Outline: Who picks up an urgent RFQ depends on the time it arrives
    Given I am signed in as "Esraa Mohamed"
    When I check who gets an urgent RFQ that arrives at "<arrives>" Cairo time
    Then it goes to "<person>" with "<backup>" as backup

    Examples:
      | arrives          | person        | backup        |
      | 2026-11-17 21:40 | Karim Youssef | Ahmedy        |
      | 2026-11-19 17:00 | Karim Youssef | Ahmedy        |
      | 2026-11-20 10:00 | Karim Youssef | Ahmedy        |
      | 2026-11-21 14:00 | Ahmedy        | Karim Youssef |
      | 2026-11-22 18:30 | Soaad Amer    | Karim Youssef |

  Scenario Outline: In office hours the case owner picks it up
    Given I am signed in as "Esraa Mohamed"
    When I check who gets an urgent RFQ that arrives at "<arrives>" Cairo time
    Then it is picked up in office hours by the case owner
    And the routing explains "Office hours (Sun–Thu 08:00–17:00 Cairo): the case owner picks it up by the assignment rule."

    Examples:
      | arrives          |
      | 2026-11-17 11:30 |
      | 2026-11-19 08:00 |
      | 2026-11-22 16:59 |

  Scenario: After hours the on-duty person is alerted first, then the backup
    Given I am signed in as "Esraa Mohamed"
    When I check who gets an urgent RFQ that arrives at "2026-11-17 21:40" Cairo time
    Then the routing explains "Outside office hours: WhatsApp / SMS to the on-duty person; the backup after 15 min, then senior contacts."

  Scenario: With nobody on the roster it goes straight to the senior contacts
    Given I am signed in as "Esraa Mohamed"
    When I check who gets an urgent RFQ that arrives at "2026-11-14 14:00" Cairo time
    Then it goes to "Karim Balbaa" with "Mohamed Helmy" as backup
    And the routing explains "Outside office hours and no shift on the roster: straight to the senior call list."

  Scenario: A time that is not a time is refused
    Given I am signed in as "Esraa Mohamed"
    When I check who gets an urgent RFQ that arrives at "next Tuesday-ish"
    Then I am stopped with "Give a valid time."

  Scenario: A test alert reaches the person on duty and is logged
    Given I am signed in as "Karim Balbaa"
    When I send a test alert for an urgent RFQ at "2026-11-17 21:40" Cairo time
    Then "Karim Youssef" is notified "Urgent RFQ after hours: you're on call (Tue 17 Nov 21:40)"
    And the alert to "Karim Youssef" says "Simulated from Roles & permissions · acknowledge within 15 min, then Ahmedy is alerted"
    And the activity log records "Simulated urgent RFQ at Tue 17 Nov 21:40: alert sent to on-duty Karim Youssef, backup Ahmedy."

  Scenario: No alert goes out in office hours
    Given I am signed in as "Karim Balbaa"
    When I send a test alert for an urgent RFQ at "2026-11-17 11:30" Cairo time
    Then nobody is notified "Urgent RFQ after hours: you're on call (Tue 17 Nov 11:30)"

  Scenario: Routing needs a signed-in person
    Given I am not signed in
    When I check who gets an urgent RFQ that arrives at "2026-11-17 21:40" Cairo time
    Then I am not allowed

  Scenario: Only management and the office manager edit the roster
    Given I am signed in as "Soaad Amer"
    When I put "Soaad Amer" on duty for the shift from "2026-11-17 17:00" with "Ahmedy" as backup
    Then I am stopped with "Management and the office manager edit the roster."

  Scenario: The office manager changes who is on duty
    Given I am signed in as "Nancy Elsobhy"
    When I put "Soaad Amer" on duty for the shift from "2026-11-17 17:00" with "Ahmedy" as backup
    Then "Soaad Amer" is on duty for the shift from "2026-11-17 17:00" with "Ahmedy" as backup
    And the activity log records "Updated the on-call roster."

  Scenario: A changed roster changes who gets the urgent RFQ
    Given I am signed in as "Karim Balbaa"
    And I put "Soaad Amer" on duty for the shift from "2026-11-17 17:00" with "Ahmedy" as backup
    When I check who gets an urgent RFQ that arrives at "2026-11-17 21:40" Cairo time
    Then it goes to "Soaad Amer" with "Ahmedy" as backup

  Scenario: A shift needs someone on duty
    Given I am signed in as "Nancy Elsobhy"
    When I leave nobody on duty for the shift from "2026-11-17 17:00"
    Then I am stopped with "Pick who is on duty."

  Scenario: A shift that is not on the roster cannot be changed
    Given I am signed in as "Nancy Elsobhy"
    When I put "Soaad Amer" on duty for the shift from "2026-11-14 17:00" with "Ahmedy" as backup
    Then I am stopped with "Shift not found."
