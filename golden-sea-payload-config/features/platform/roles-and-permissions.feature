Feature: Roles and permissions
  Each role at Golden Sea sees and approves only what it should. Sales never sees supplier costs, and bank-detail changes need two people.
  Only management changes what a role may do, and every change goes on the activity log.

  Scenario: Roles and permissions need a signed-in person
    Given I am not signed in
    When I open roles and permissions
    Then I am not allowed

  Scenario: The live checks prove that the key rules hold
    Given I am signed in as "Karim Balbaa"
    When I open roles and permissions
    Then the check "Sales never sees supplier costs" is "Verified"
    And the check "Sales never sees supplier costs" explains "Read an offer as Soaad Amer: the price field is removed by field access."
    And the check "Bank-detail changes need two people (Finance + CEO)" is "Verified"
    And the check "Bank-detail changes need two people (Finance + CEO)" explains "Approval rule “Bank detail change”: two-person on, approvers Karim Balbaa and Mohamed Helmy."

  Scenario: The bank-detail check fails when the rule no longer needs two people
    Given I am signed in as "Karim Balbaa"
    And the bank detail change rule no longer needs two people
    When I open roles and permissions
    Then the check "Bank-detail changes need two people (Finance + CEO)" is "Failing"
    And the check "Bank-detail changes need two people (Finance + CEO)" explains "Approval rule “Bank detail change”: two-person off, approvers Karim Balbaa and Mohamed Helmy."

  Scenario: Each permission says where it is enforced
    Given I am signed in as "Soaad Amer"
    When I open roles and permissions
    Then the permission "Supplier costs" is enforced by "Field access on offers, supplier prices and case pricing (hidden from Sales)"

  Scenario: Only management changes permissions
    Given I am signed in as "Karim Youssef"
    When I give "Sales" the permission "Supplier costs"
    Then I am stopped with "Only management edits permissions."
    And "Sales" does not have the permission "Supplier costs"

  Scenario: Management gives a role a permission and it is logged
    Given I am signed in as "Karim Balbaa"
    When I give "Office admin" the permission "Margins"
    Then "Office admin" has the permission "Margins"
    And the activity log records "Updated the Office admin permissions in the roles & permissions matrix."

  Scenario: Management takes a permission away
    Given I am signed in as "Karim Balbaa"
    When I take the permission "Accounting postings" away from "Operations & finance"
    Then "Operations & finance" does not have the permission "Accounting postings"

  Scenario: A role that does not exist cannot be changed
    Given I am signed in as "Karim Balbaa"
    When I give "Ship captain" the permission "Margins"
    Then I am stopped with "Role not found."

  Scenario: Saving a role without a permission change is refused
    Given I am signed in as "Karim Balbaa"
    When I save the permissions of "Sales" without changing any
    Then I am stopped with "Unknown permission."
