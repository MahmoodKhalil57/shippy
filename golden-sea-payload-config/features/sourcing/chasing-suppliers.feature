Feature: Chasing suppliers who have not replied
  Supply chain reminds suppliers who owe an answer on a supplier RFQ.
  After two reminders the supplier RFQ is escalated and the case owner is warned, so a silent supplier never holds up a quotation unnoticed.
  Only supply chain and management send reminders.

  Background:
    Given I am signed in as "Karim Youssef"

  Scenario: The first reminder keeps the supplier RFQ open
    Given the supplier rfq "GS-SRFQ-0142-E" has its reminders set to "0"
    When I remind the supplier on "GS-SRFQ-0142-E"
    Then the supplier rfq "GS-SRFQ-0142-E" has reminders "1"
    And the supplier rfq "GS-SRFQ-0142-E" has status "Awaiting reply"
    And the supplier rfq "GS-SRFQ-0142-E" has latest "Reminder 1 sent (approved template, client hidden) · next in 24 h"

  Scenario: The second reminder escalates to the case owner
    When I remind the supplier on "GS-SRFQ-0142-E"
    Then the supplier rfq "GS-SRFQ-0142-E" has status "Escalated"
    And the supplier rfq "GS-SRFQ-0142-E" has latest "Reminder 2 sent. No reply after 2 reminders, escalated to the case owner"

  Scenario: A supplier still silent after escalation has not responded
    Given I remind the supplier on "GS-SRFQ-0142-E"
    When I remind the supplier on "GS-SRFQ-0142-E"
    Then the supplier rfq "GS-SRFQ-0142-E" has status "No response"

  Scenario: A supplier reminded twice before has not responded
    When I remind the supplier on "GS-SRFQ-0141-A"
    Then the supplier rfq "GS-SRFQ-0141-A" has status "No response"

  Scenario Outline: Reminders stop once a supplier has answered
    When I remind the supplier on "<supplier RFQ>"
    Then I am stopped with "Reminders stop once a supplier has answered."

    Examples:
      | supplier RFQ   | status                 |
      | GS-SRFQ-0142-A | Replied                |
      | GS-SRFQ-0142-B | Revised offer received |

  Scenario: Management can send a reminder
    Given I am signed in as "Karim Balbaa"
    When I remind the supplier on "GS-SRFQ-0142-E"
    Then the supplier rfq "GS-SRFQ-0142-E" has reminders "2"

  Scenario Outline: Only supply chain and management send reminders
    Given I am signed in as "<person>"
    When I remind the supplier on "GS-SRFQ-0142-E"
    Then I am not allowed
    And I am stopped with "Only supply chain and management can do this."
    And the supplier rfq "GS-SRFQ-0142-E" has reminders "1"

    Examples:
      | person        |
      | Soaad Amer    |
      | Ahmedy        |
      | Mohamed Helmy |
      | Esraa Mohamed |

  Scenario: Replies arriving for open supplier RFQs count as answers
    When supplier replies arrive for case "GS-RFQ-0142"
    Then the supplier rfq "GS-SRFQ-0142-E" has status "Replied"

  Scenario: Replies that just arrived show on the case for everyone
    When supplier replies arrive for case "GS-RFQ-0142"
    And I sign in as "Karim Balbaa" and open the supplier RFQs of case "GS-RFQ-0142"
    Then the case shows replies that just arrived

  Scenario: A case starts with no replies just in
    When I sign in as "Karim Balbaa" and open the supplier RFQs of case "GS-RFQ-0142"
    Then the case shows no replies just in

  Scenario: An escalated supplier can still reply
    Given I remind the supplier on "GS-SRFQ-0142-E"
    When supplier replies arrive for case "GS-RFQ-0142"
    Then the supplier rfq "GS-SRFQ-0142-E" has status "Replied"

  Scenario: A supplier that replies without being asked is saved as a new supplier
    When supplier replies arrive for case "GS-RFQ-0142"
    Then the supplier "Alex Weld Trading" has status "New"
    And the intake message "price offer" has status "Needs review"

  Scenario: No replies arrive when every supplier has already answered
    When supplier replies arrive for case "GS-RFQ-0139"
    Then I am stopped with "No supplier RFQs are waiting for a reply."
    And there is no supplier "Alex Weld Trading"
    And the supplier rfq "GS-SRFQ-0139-A" has status "Replied"

  Scenario: No replies arrive before any supplier RFQ is sent
    Given I create a case from the message "Quick quote — Lalizas life jackets & lifebuoys, Abu Qir rig"
    When supplier replies arrive for case "GS-RFQ-0143"
    Then I am stopped with "No supplier RFQs are waiting for a reply."
    And there is no supplier "Alex Weld Trading"
