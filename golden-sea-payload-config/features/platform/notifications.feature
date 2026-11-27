Feature: Notifications while I was away
  The home page tells each person what happened for them while they were away.
  It lists only their own unread notifications, so nobody reads someone else's alerts.

  Scenario: My unread notifications are listed
    Given I am signed in as "Karim Youssef"
    When I open my home page
    Then while I was away I got "Mare Nostrum: corrected offer received (RAL 7038)"

  Scenario: A notification I already read is not listed again
    Given I am signed in as "Karim Youssef"
    When I open my home page
    Then while I was away I got nothing about "Soaad Amer is your backup on GS-RFQ-0142"

  Scenario: Someone else's notifications are not listed
    Given I am signed in as "Soaad Amer"
    When I open my home page
    Then while I was away I got nothing about "Mare Nostrum: corrected offer received (RAL 7038)"

  Scenario: Marking a notification read takes it off the list
    Given I am signed in as "Karim Youssef"
    And the notification "Mare Nostrum: corrected offer received (RAL 7038)" has its read set to "yes"
    When I open my home page
    Then while I was away I got nothing about "Mare Nostrum: corrected offer received (RAL 7038)"

  Scenario: The new owner of a handed-over case is told
    Given I am signed in as "Karim Youssef"
    And I hand case "GS-RFQ-0142" over to "Soaad Amer" with the note "On leave from tomorrow"
    And I am signed in as "Soaad Amer"
    When I open my home page
    Then while I was away I got "You now own GS-RFQ-0142"
