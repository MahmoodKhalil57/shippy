Feature: Supplier bills
  Finance books each supplier's bill once and matches it against the PO and what was received. A bill that
  charges for more than arrived goes on hold, so Golden Sea pays only for goods it has.

  Background:
    Given I am signed in as "Mohamed Helmy"

  Scenario: A bill that matches the PO and the receipt is matched
    Then the supplier bill "SI-0771" has status "Matched"

  Scenario: A bill for more than was received goes on hold with the reason
    Then the supplier bill "DM-5512" has status "On hold"
    And the supplier bill "DM-5512" has hold reason "Billed 200, received 180, ordered 200"

  Scenario: A supplier's bill number is booked only once
    When I book the incoming supplier bill "DM-5512"
    Then I am stopped with "Bill not booked. Duplicate bill: this supplier's bill number is already booked."

  Scenario: Only management and finance book supplier bills
    Given I am signed in as "Soaad Amer"
    When I book the incoming supplier bill "DM-5512"
    Then I am not allowed
