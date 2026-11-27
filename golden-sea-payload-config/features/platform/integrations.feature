Feature: Integrations, backups and languages
  Golden Sea's mailboxes, e-invoicing and backups are run from the integrations page.
  Operations and the office reconnect a mailbox; only management refreshes the staging copy or changes company languages.

  Scenario: The integrations page needs a signed-in person
    Given I am not signed in
    When I open the integrations page
    Then I am not allowed

  Scenario: The acknowledgement customers receive is the approved template
    Given I am signed in as "Soaad Amer"
    When I open the integrations page
    Then the acknowledgement preview has the subject "We received your RFQ NSM-REQ-55821 — MV Aurora Crest (GS-RFQ-0142)"
    And the acknowledgement is "Approved" version 3 by "Karim Balbaa"

  Scenario: Sales cannot reconnect a mailbox
    Given I am signed in as "Soaad Amer"
    When I reconnect the mailbox "purchasing@"
    Then I am stopped with "Management, operations or the office manager reconnect mailboxes."
    And the mailbox "purchasing@" is "Token expired"

  Scenario: Reconnecting a mailbox imports what was waiting, once
    Given I am signed in as "Esraa Mohamed"
    When I reconnect the mailbox "purchasing@"
    Then I am told "Reconnected purchasing@. Re-checked mailbox:purchasing@: 12 messages waiting, 0 already imported → 12 imported. No duplicate cases or acknowledgements."
    And the mailbox "purchasing@" is "Connected"
    And the exception "purchasing@ mailbox token expired" has status "Resolved"

  Scenario: Reconnecting a mailbox with nothing waiting just signs it back in
    Given I am signed in as "Ahmedy"
    When I reconnect the mailbox "sales@"
    Then I am told "Reconnected sales@."
    And the mailbox "sales@" is "Connected"
    And the activity log records "Reconnected Outlook mailbox sales@."

  Scenario: A mailbox whose exception is already resolved is only signed back in
    Given I am signed in as "Ahmedy"
    And the exception "purchasing@ mailbox token expired" has its status set to "Resolved"
    When I reconnect the mailbox "purchasing@"
    Then I am told "Reconnected purchasing@."
    And the mailbox "purchasing@" is "Connected"

  Scenario: An unknown mailbox cannot be reconnected
    Given I am signed in as "Ahmedy"
    When I reconnect the mailbox "info@"
    Then I am stopped with "Connection not found."

  Scenario: Only management refreshes the staging copy
    Given I am signed in as "Ahmedy"
    When I refresh the staging copy
    Then I am stopped with "Only management refreshes the staging copy."
    And the staging copy is still from "2026-11-16 00:00"

  Scenario: Management refreshes the staging copy and it is logged
    Given I am signed in as "Karim Balbaa"
    When I refresh the staging copy
    Then the staging copy is fresh
    And the activity log records "Staging copy refreshed from last night's backup (emails and integrations disabled on staging)."

  Scenario Outline: The staging refresh button is only active for management
    Given I am signed in as "<person>"
    When I open the integrations page
    Then I <can>

    Examples:
      | person       | can                                                                     |
      | Karim Balbaa | can refresh the staging copy                                            |
      | Ahmedy       | cannot refresh the staging copy because "Only management refreshes staging." |

  Scenario Outline: Company language settings are locked for everyone but management
    Given I am signed in as "<person>"
    When I open the integrations page
    Then the company language settings are <state> for me

    Examples:
      | person        | state  |
      | Karim Balbaa  | open   |
      | Soaad Amer    | locked |
      | Mohamed Helmy | locked |

  Scenario: Anyone chooses their own dashboard language
    Given I am signed in as "Soaad Amer"
    When I set my dashboard language to "Arabic"
    Then I am told "Your dashboard language: Arabic (applies after go-live translation)"
    And the user "Soaad Amer" has language "العربية (Arabic)"

  Scenario: Switching back to English
    Given I am signed in as "Soaad Amer"
    And I set my dashboard language to "Arabic"
    When I set my dashboard language to "English"
    Then I am told "Your dashboard language: English"
    And the user "Soaad Amer" has language "English"

  Scenario: Only management changes the company default language
    Given I am signed in as "Soaad Amer"
    When I set the company default language to "Arabic"
    Then I am stopped with "Company settings are changed by management."
    And the company default language is "English"

  Scenario: Management changes the company default language
    Given I am signed in as "Karim Balbaa"
    When I set the company default language to "Arabic"
    Then I am told "Language settings saved"
    And the company default language is "Arabic"

  Scenario: Management stops issuing documents in Arabic
    Given I am signed in as "Karim Balbaa"
    When I stop issuing documents in "Arabic"
    Then documents are issued in "English"

  Scenario: Documents are always issued in at least English
    Given I am signed in as "Karim Balbaa"
    And I stop issuing documents in "English"
    When I stop issuing documents in "Arabic"
    Then documents are issued in "English"

  Scenario: A document language can be added back
    Given I am signed in as "Karim Balbaa"
    And I stop issuing documents in "Arabic"
    When I start issuing documents in "Arabic"
    Then documents are issued in "English and Arabic"

  Scenario: An unknown language setting is refused
    Given I am signed in as "Karim Balbaa"
    When I change the language setting "currency"
    Then I am stopped with "Unknown setting."
