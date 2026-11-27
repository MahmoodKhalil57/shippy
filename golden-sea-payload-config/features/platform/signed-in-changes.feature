Feature: Changes need a signed-in person
  Every change on the platform pages carries the name of the person who made it, so nobody can change anything without signing in.

  Scenario Outline: A change without signing in is refused
    Given I am not signed in
    When I <change>
    Then I am not allowed

    Examples:
      | change                                                                                 |
      | pause the automation rule "Supplier reminder"                                          |
      | retry the exception "purchasing@ mailbox token expired"                                |
      | mark the exception "Low confidence on 3 fields (PolarBay .docx)" as reviewed           |
      | give "Sales" the permission "Supplier costs"                                           |
      | put "Soaad Amer" on duty for the shift from "2026-11-17 17:00" with "Ahmedy" as backup |
      | reconnect the mailbox "purchasing@"                                                    |
      | refresh the staging copy                                                               |
      | set my dashboard language to "Arabic"                                                  |
      | ask for a handover draft of case "GS-RFQ-0142" for "Soaad Amer"                        |
      | hand case "GS-RFQ-0142" over to "Ahmedy" with the note "On leave"                      |
      | ask for the morning briefing to be summarised again                                    |
      | send a test alert for an urgent RFQ at "2026-11-17 21:40" Cairo time                   |
