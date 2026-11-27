Feature: Customer payments and receivables
  Finance records what customers pay, matches remittance advice to open invoices and chases late payers
  within each customer's contact rule. The receivables list shows what is still owed.

  Background:
    Given I am signed in as "Mohamed Helmy"

  Scenario: A part payment leaves the rest of the invoice open
    When I record a customer payment of 1000 against invoice "INV/2026/0412"
    Then I am told "USD 1,000.00 allocated to INV/2026/0412. Balance USD 3,200.00."
    And the invoice "INV/2026/0412" has status "Partially paid"
    And the invoice "INV/2026/0412" has balance "3200"

  Scenario: Paying the balance settles the invoice
    When I record a customer payment of 4200 against invoice "INV/2026/0412"
    Then I am told "USD 4,200.00 allocated to INV/2026/0412. Paid in full."
    And the invoice "INV/2026/0412" has status "Paid"

  Scenario: A payment larger than the open balance is refused
    When I record a customer payment of 5000 against invoice "INV/2026/0412"
    Then I am stopped with "This payment is more than the open balance of USD 4,200.00 on INV/2026/0412. Record no more than the open balance."
    And the invoice "INV/2026/0412" has balance "4200"
    And the invoice "INV/2026/0412" has status "Partially paid"

  Scenario: A settled invoice leaves the receivables list
    Given I record a customer payment of 4200 against invoice "INV/2026/0412"
    When I open the cash page
    Then invoice "INV/2026/0412" is not on the receivables list
    And invoice "INV/2026/0409" is on the receivables list

  Scenario: A cancelled invoice is not a receivable
    Given the invoice "INV/2026/0409" has its status set to "Cancelled"
    When I open the cash page
    Then invoice "INV/2026/0409" is not on the receivables list

  Scenario: A payment needs an amount
    When I record a customer payment of 0 against invoice "INV/2026/0412"
    Then I am stopped with "Enter the amount received."

  Scenario Outline: Only management and finance record customer payments
    Given I am signed in as "<person>"
    When I record a customer payment of 1000 against invoice "INV/2026/0412"
    Then I am not allowed
    And the invoice "INV/2026/0412" has balance "4200"

    Examples:
      | person        |
      | Soaad Amer    |
      | Karim Youssef |
      | Esraa Mohamed |

  Scenario: A remittance is matched by invoice number
    When I match a remittance naming invoices "0405"
    Then I am told "Looks like it pays this invoice: INV/2026/0405 (Delta Offshore Services, EGP 465,000 open). A person records the payment."

  Scenario: A remittance is matched by amount
    When I match a remittance for the amount 4200
    Then I am told "Looks like it pays this invoice: INV/2026/0412 (Helios Bulk Carriers, USD 4,200.00 open). A person records the payment."

  Scenario: A remittance can pay several invoices
    When I match a remittance naming invoices "INV/2026/0388, INV/2026/0371"
    Then I am told "Looks like it pays these 2 invoices: INV/2026/0371 (Atlas Tankers, USD 1,400.00 open); INV/2026/0388 (Atlas Tankers, USD 6,500.00 open). A person records the payment."

  Scenario: A remittance that matches nothing is checked by hand
    When I match a remittance naming invoices "9999"
    Then I am stopped with "No open invoice matches these numbers or this amount. Check the remittance by hand."

  Scenario: A customer that may be chased gets a reminder email
    When I send the collection reminder for invoice "INV/2026/0409"
    Then the task "Reminder: INV/2026/0409 due 27 Nov 2026 — Helios Bulk Carriers" has type "Customer follow-up"
    And the task "Reminder: INV/2026/0409 due 27 Nov 2026 — Helios Bulk Carriers" has status "Done"

  Scenario: A customer that must not be chased gets an internal reminder only
    When I send the collection reminder for invoice "INV/2026/0388"
    Then the task "Internal: INV/2026/0388 USD 6,500.00 46 days overdue — Atlas Tankers" has type "Internal reminder"
    And the task "Internal: INV/2026/0388 USD 6,500.00 46 days overdue — Atlas Tankers" has status "Open"

  Scenario: A paid invoice gets no reminder
    Given I record a customer payment of 4200 against invoice "INV/2026/0412"
    When I send the collection reminder for invoice "INV/2026/0412"
    Then I am stopped with "Invoice not found."

  Scenario: Finance sees money in and money out
    When I open the cash page
    Then I see the money going out to suppliers

  Scenario: Sales sees the money coming in but not what goes to suppliers
    Given I am signed in as "Soaad Amer"
    When I open the cash page
    Then I see only the money coming in
