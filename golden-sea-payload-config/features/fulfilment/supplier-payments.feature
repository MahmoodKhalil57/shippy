Feature: Paying suppliers
  Money only leaves Golden Sea against an approved payment approval, and a supplier's new bank details apply only
  after a call-back on the number on file and two different approvers. Finance requests and records payments;
  Karim Balbaa and Mohamed Helmy approve them.

  Background:
    Given I am signed in as "Mohamed Helmy"

  Scenario: Supplier payables are hidden from Sales
    Given I am signed in as "Soaad Amer"
    When I open the supplier payables
    Then I am stopped with "Supplier payables, payment approvals and bank details are not visible to Sales."

  Scenario: Finance asks for approval to pay a supplier's matched bill
    When I request payment approval for purchase order "P0416"
    Then the approval "Pay Suez Industrial Supply EGP 83,160 for P0416" has status "Pending"
    And the approval "Pay Suez Industrial Supply EGP 83,160 for P0416" has type "Supplier payment"

  Scenario: A payable gets only one approval at a time
    Given I request payment approval for purchase order "P0416"
    When I request payment approval for purchase order "P0416"
    Then I am stopped with "An approval is already in progress for this payable."

  Scenario: A payable whose deposit is waiting for approval cannot get another approval
    When I request payment approval for purchase order "P0418"
    Then I am stopped with "An approval is already in progress for this payable."

  Scenario: A bill on hold cannot be put up for payment, and Finance is told why
    When I request payment approval for purchase order "P0417"
    Then I am stopped with "The supplier bill for P0417 is on hold. Release the hold before asking for payment approval."

  Scenario: A fully paid purchase order has nothing to pay
    When I request payment approval for purchase order "P0402"
    Then I am stopped with "Payable not found."

  Scenario Outline: Only management and finance request payment approvals
    Given I am signed in as "<person>"
    When I request payment approval for purchase order "P0416"
    Then I am stopped with "Management and finance request payment approvals."

    Examples:
      | person        |
      | Karim Youssef |
      | Esraa Mohamed |

  Scenario: Only a named approver decides on a payment
    Given I am signed in as "Ahmedy"
    When I approve "50% advance to Delta Marine Stores — EGP 96,400"
    Then I am stopped with "You can't decide on this approval."

  Scenario: Rejecting a payment needs a reason
    When I reject "50% advance to Delta Marine Stores — EGP 96,400"
    Then I am stopped with "Give a reason for rejecting."
    And the approval "50% advance to Delta Marine Stores — EGP 96,400" has status "Pending"

  Scenario: A rejected payment keeps its reason
    When I reject "50% advance to Delta Marine Stores — EGP 96,400" because "Pro forma amount does not match the PO"
    Then the approval "50% advance to Delta Marine Stores — EGP 96,400" has status "Rejected"

  Scenario: A payment cannot be recorded before it is approved
    When I record the payment for "50% advance to Delta Marine Stores — EGP 96,400" with bank reference "TRX-90120"
    Then I am stopped with "The payment isn't approved yet."

  Scenario: An approved payment needs the bank reference
    Given I approve "50% advance to Delta Marine Stores — EGP 96,400"
    When I record the payment for "50% advance to Delta Marine Stores — EGP 96,400" with bank reference ""
    Then I am stopped with "Give the bank reference."

  Scenario: An approved deposit is paid for its share of the PO
    Given I approve "50% advance to Delta Marine Stores — EGP 96,400"
    When I record the payment for "50% advance to Delta Marine Stores — EGP 96,400" with bank reference "TRX-90120"
    Then the payment "TRX-90120" has amount "48200"
    And the payment "TRX-90120" has kind "Deposit / advance"
    And the payment "TRX-90120" has direction "Supplier payment"

  Scenario: An approved payment is recorded once
    Given I approve "50% advance to Delta Marine Stores — EGP 96,400"
    And I record the payment for "50% advance to Delta Marine Stores — EGP 96,400" with bank reference "TRX-90120"
    When I record the payment for "50% advance to Delta Marine Stores — EGP 96,400" with bank reference "TRX-90121"
    Then I am stopped with "Approval not found."

  Scenario: Only management and finance record supplier payments
    Given I approve "50% advance to Delta Marine Stores — EGP 96,400"
    And I am signed in as "Karim Youssef"
    When I record the payment for "50% advance to Delta Marine Stores — EGP 96,400" with bank reference "TRX-90120"
    Then I am stopped with "Management and finance record payments."

  Scenario: New bank details need a call-back before approval
    Given I am signed in as "Karim Balbaa"
    When I approve "Port Said Welding requests new beneficiary bank account"
    Then I am stopped with "Call back on the number on file and tick the confirmation first."

  Scenario: One person cannot approve a bank change twice
    When I approve "Port Said Welding requests new beneficiary bank account" after calling back on the number on file
    Then I am stopped with "You can't decide on this approval."

  Scenario: The second approver completes a bank change
    Given I am signed in as "Karim Balbaa"
    When I approve "Port Said Welding requests new beneficiary bank account" after calling back on the number on file
    Then the approval "Port Said Welding requests new beneficiary bank account" has status "Approved"

  Scenario: Bank details apply only after two approvers
    When I apply the approved bank details from "Port Said Welding requests new beneficiary bank account"
    Then I am stopped with "Two different people must approve first."

  Scenario: Approved bank details are applied and marked verified
    Given I am signed in as "Karim Balbaa"
    And I approve "Port Said Welding requests new beneficiary bank account" after calling back on the number on file
    When I apply the approved bank details from "Port Said Welding requests new beneficiary bank account"
    Then the supplier "Port Said Welding Co." has iban / account "EG38 0019 0005 0000 0000 2631 8000 2"
    And the supplier "Port Said Welding Co." has bank name "Banque Misr"

  Scenario: Approved bank details are applied once
    Given I am signed in as "Karim Balbaa"
    And I approve "Port Said Welding requests new beneficiary bank account" after calling back on the number on file
    And I apply the approved bank details from "Port Said Welding requests new beneficiary bank account"
    When I apply the approved bank details from "Port Said Welding requests new beneficiary bank account"
    Then I am stopped with "Two different people must approve first."

  Scenario: Only management and finance apply bank details
    Given I am signed in as "Karim Balbaa"
    And I approve "Port Said Welding requests new beneficiary bank account" after calling back on the number on file
    And I am signed in as "Karim Youssef"
    When I apply the approved bank details from "Port Said Welding requests new beneficiary bank account"
    Then I am stopped with "Management and finance apply bank details."
