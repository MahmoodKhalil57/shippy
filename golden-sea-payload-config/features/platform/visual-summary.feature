Feature: Visual summary of deadlines, calendar and targets
  The visual summary shows each person their deadlines this month, a calendar of quotes, arrivals and deliveries, and how the team does against its targets.
  The sourcing desk and sales follow their own cases; invoices and money appear only for management, finance and operations.
  A quote is due only while the quotation has not yet gone to the customer.

  Scenario: The visual summary needs a signed-in person
    Given I am not signed in
    When I open my visual summary
    Then I am not allowed

  Scenario: Sales counts down to their own quote deadlines only
    Given I am signed in as "Soaad Amer"
    When I open my visual summary
    Then my deadlines include "MV Corallo: quote due"
    And my deadlines do not include "MV Aurora Crest: quote due"

  Scenario: The sourcing desk counts down to its own quote deadlines only
    Given I am signed in as "Karim Youssef"
    When I open my visual summary
    Then my deadlines include "MV Aurora Crest: quote due"
    And my deadlines do not include "MV Helios Star: quote due"

  Scenario: A quote already with the customer leaves the countdown
    Given I am signed in as "Karim Youssef"
    When I open my visual summary
    Then my deadlines do not include "MT Atlas Pearl: quote due"
    And my deadlines include "MT Atlas Pearl arrives"

  Scenario: A quote the customer asked to revise is back in the countdown
    Given I am signed in as "Karim Youssef"
    And the case "GS-RFQ-0139" has its stage set to "Revision requested"
    When I open my visual summary
    Then my deadlines include "MT Atlas Pearl: quote due"

  Scenario: The calendar marks quote deadlines by how close they are
    Given I am signed in as "Karim Balbaa"
    When I open my visual summary
    Then the calendar shows "Quote due · Rig support · DOS Falcon" on "2026-11-11" as "overdue"
    And the calendar shows "Quote due · MV Aurora Crest" on "2026-11-18" as "due soon"
    And the calendar shows "Quote due · MV Corallo" on "2026-11-19" as "planned"

  Scenario: Invoiced, won and quoted cases show no quote deadline in the calendar
    Given I am signed in as "Karim Balbaa"
    When I open my visual summary
    Then the calendar does not show "Quote due · MV Helios Dawn"
    And the calendar does not show "Quote due · MV Nordic Tern"
    And the calendar does not show "Quote due · MT Atlas Pearl"

  Scenario: A confirmed delivery shows as done in the calendar
    Given I am signed in as "Ahmedy"
    When I open my visual summary
    Then the calendar shows "Delivery DN-0131 · Delivered — confirmed" on "2026-11-09" as "done"
    And the calendar shows "Delivery DN-0002 · Planned" on "2026-11-21" as "planned"

  Scenario: Money roles see invoices falling due in the calendar
    Given I am signed in as "Mohamed Helmy"
    When I open my visual summary
    Then the calendar shows "Invoice INV/2026/0396 due · Nordvik Ship Management" on "2026-11-02" as "overdue"
    And the calendar shows "Invoice INV/2026/0405 due · Delta Offshore Services" on "2026-11-18" as "planned"

  Scenario: A paid invoice leaves the calendar
    Given I am signed in as "Mohamed Helmy"
    And the invoice "INV/2026/0405" has its paid set to "465000"
    When I open my visual summary
    Then the calendar shows "Quote due · MV Aurora Crest"
    And the calendar shows no invoice "INV/2026/0405"

  Scenario: Sales sees no invoices in the calendar
    Given I am signed in as "Soaad Amer"
    When I open my visual summary
    Then the calendar shows no invoices

  Scenario: Targets show the team against its goals
    Given I am signed in as "Esraa Mohamed"
    When I open my visual summary
    Then my visual summary shows the target "Win rate, 12 weeks" at "36%"
    And my visual summary shows the target "Deliveries on time, 6 weeks" at "78%"
    And my visual summary shows the target "Time to acknowledge" at "4 min"
