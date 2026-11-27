Feature: Importing the inbox history
  Golden Sea reads years of old email to learn its customers, vessels, suppliers and past prices.
  The desk decides every item the import is unsure about, and only management approves the import, because it writes new records for the whole company.
  The approvers are the people who have the management role, and they are told when the history is ready.

  Background:
    Given I am signed in as "Karim Balbaa"

  Scenario: Organising the history puts the unsure items up for a decision
    When I organise the inbox history
    Then the intake message "RE: loctite" has status "Needs review"
    And the intake message "RE: loctite" has classification "Supplier reply"

  Scenario: Management is told when the history is ready for approval
    When I organise the inbox history
    Then the notification "Inbox history ready for your approval" has user "Karim Balbaa"

  Scenario: Whoever has the management role approves the import
    Given the user "Karim Balbaa" has its role set to "Supply chain & customer service"
    And the user "Mohamed Helmy" has its role set to "Management approver"
    When I organise the inbox history
    Then the notification "Inbox history ready for your approval" has user "Mohamed Helmy"

  Scenario: A new management approver can approve the import
    Given the user "Mohamed Helmy" has its role set to "Management approver"
    And I organise the inbox history
    And I confirm every history item
    And I am signed in as "Mohamed Helmy"
    When I approve the history import
    Then the supplier "Damietta Paints & Coatings" has status "New"

  Scenario: History items stay out of the live inbox
    When I organise the inbox history
    Then the inbox shows 1 message to review

  Scenario: A confirmed proposal is kept for the import
    Given I organise the inbox history
    When I confirm the history item "Enquiry — safety equipment for PD-3"
    Then the intake message "Enquiry — safety equipment for PD-3" has status "Linked"

  Scenario: A rejected proposal is left out of the import
    Given I organise the inbox history
    When I reject the history item "Salary advance — personal"
    Then the intake message "Salary advance — personal" has status "Ignored"

  Scenario: The person who decided an item can take the decision back
    Given I organise the inbox history
    And I reject the history item "Salary advance — personal"
    When I take back my decision on the history item "Salary advance — personal"
    Then I am told "Back to needing a decision"
    And the intake message "Salary advance — personal" has status "Needs review"

  Scenario: Only the person who decided an item can take it back
    Given I organise the inbox history
    And I reject the history item "Salary advance — personal"
    And I am signed in as "Karim Youssef"
    When I take back my decision on the history item "Salary advance — personal"
    Then I am stopped with "Karim Balbaa decided this item, so only they can take it back."

  Scenario: An item still waiting has no decision to take back
    Given I organise the inbox history
    When I take back my decision on the history item "Salary advance — personal"
    Then I am stopped with "This item is already waiting for a decision."

  Scenario: Only history items take history decisions
    When I confirm the history item "prices as requested"
    Then I am stopped with "Not a history item."

  Scenario: The history must be organised before it is approved
    When I approve the history import
    Then I am stopped with "Organise the history first."

  Scenario: Every unsure item needs a decision before approval
    Given I organise the inbox history
    And I confirm the history item "Enquiry — safety equipment for PD-3"
    When I approve the history import
    Then I am stopped with "5 uncertain items still need a decision."

  Scenario Outline: Only management approves the history import
    Given I organise the inbox history
    And I confirm every history item
    And I am signed in as "<person>"
    When I approve the history import
    Then I am stopped with "Only management can approve the history import."

    Examples:
      | person        |
      | Karim Youssef |
      | Soaad Amer    |
      | Ahmedy        |
      | Mohamed Helmy |
      | Esraa Mohamed |

  Scenario: Approving the import adds the new suppliers it found
    Given I organise the inbox history
    And I confirm every history item
    When I approve the history import
    Then the supplier "Damietta Paints & Coatings" has status "New"
    And the customer "Baltic Reefer Management" has country "Latvia"

  Scenario: A confirmed new customer is added when the import is approved
    Given I organise the inbox history
    And I confirm every history item
    When I approve the history import
    Then the customer "Petro Delta" has country "Egypt"

  Scenario: Decisions cannot be taken back after the import is approved
    Given I organise the inbox history
    And I confirm every history item
    And I approve the history import
    When I take back my decision on the history item "Salary advance — personal"
    Then I am stopped with "The import is approved and saved, so its decisions can't be taken back."

  Scenario Outline: Who may approve the import and see past prices
    Given I am signed in as "<person>"
    When I open the inbox history
    Then I <approve> approve the history import
    And I <prices> see the prices found in the history

    Examples:
      | person        | approve | prices |
      | Karim Balbaa  | can     | can    |
      | Karim Youssef | cannot  | can    |
      | Mohamed Helmy | cannot  | can    |
      | Soaad Amer    | cannot  | cannot |
