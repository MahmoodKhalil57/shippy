Feature: Egyptian e-invoices
  Finance signs every invoice and submits it to the Egyptian Tax Authority, then reads back whether it is valid.
  A 14% VAT invoice needs the buyer's 9-digit tax registration number, or the tax authority rejects it.

  Background:
    Given I am signed in as "Mohamed Helmy"

  Scenario: An invoice is signed, submitted and read back as valid
    When I submit invoice "INV/2026/0419" to the tax authority
    Then I am told "Tax authority: INV/2026/0419 is valid."
    And the invoice "INV/2026/0419" has e-invoice (tax authority) "Valid"

  Scenario: A successful submission resolves the failed earlier attempt
    When I submit invoice "INV/2026/0419" to the tax authority
    Then the exception "INV/2026/0419 — signature service unreachable" has status "Resolved"

  Scenario: A submitted invoice is read back as valid
    When I submit invoice "INV/2026/0418" to the tax authority
    Then I am told "Tax authority: INV/2026/0418 is valid."

  Scenario: An accepted invoice is not submitted again
    When I submit invoice "INV/2026/0412" to the tax authority
    Then I am told "Already accepted, so not resubmitted."

  Scenario: A 14% VAT invoice without a 9-digit buyer tax ID is rejected
    When I submit invoice "INV/2026/0417" to the tax authority
    Then I am told "Rejected by the tax authority: buyer tax ID."
    And the invoice "INV/2026/0417" has e-invoice (tax authority) "Rejected"

  Scenario: Correcting the buyer tax ID lets the invoice through
    When I submit invoice "INV/2026/0417" to the tax authority with buyer tax ID "100200300"
    Then I am told "Tax authority: INV/2026/0417 is valid."
    And the invoice "INV/2026/0417" has tax id "100200300"

  Scenario Outline: Only operations and finance submit e-invoices
    Given I am signed in as "<person>"
    When I submit invoice "INV/2026/0419" to the tax authority
    Then I am stopped with "E-invoices are submitted by operations & finance."

    Examples:
      | person        |
      | Soaad Amer    |
      | Karim Youssef |
      | Nancy Elsobhy |
