Feature: Home page for each role
  Everyone at Golden Sea starts the day on a home page made for their role.
  It shows the figures they answer for, what needs their attention first, and what is due this week.

  Scenario: The home page needs a signed-in person
    Given I am not signed in
    When I open my home page
    Then I am not allowed

  Scenario: The home page greets me by my first name
    Given I am signed in as "Karim Youssef"
    When I open my home page
    Then my home page greets me with "Good morning, Karim"

  Scenario Outline: Each role gets its own summary line
    Given I am signed in as "<person>"
    When I open my home page
    Then my home page summary reads "<summary>"

    Examples:
      | person        | summary                                                                      |
      | Karim Youssef | 4 cases in your queue · 4 supplier replies outstanding · 3 follow-ups today |
      | Karim Balbaa  | 6 decisions waiting · 3 quotes due by tomorrow · 20 live cases              |
      | Soaad Amer    | 4 live cases · 1 awaiting the customer · 1 pipeline step this week          |
      | Ahmedy        | 2 deliveries in progress · 3 bills to match · 2 integration exceptions      |
      | Mohamed Helmy | 1 decision waiting · USD 17.1k past due · 3 supplier bills open             |
      | Esraa Mohamed | 6 messages to triage · 4 follow-ups due today · 20 live cases               |

  Scenario Outline: Each role sees the figures it answers for
    Given I am signed in as "<person>"
    When I open my home page
    Then my home page shows the figures "<figures>"

    Examples:
      | person        | figures                                                                                      |
      | Karim Youssef | Awaiting supplier; Awaiting internal approval; My quote turnaround                           |
      | Karim Balbaa  | Inquiries, last 4 weeks; Won, last 4 weeks; Quote turnaround; Expected gross profit, Nov     |
      | Soaad Amer    | Awaiting customer decision; Awaiting internal approval; Won, last 4 weeks                    |
      | Ahmedy        | Deliveries in progress                                                                       |
      | Mohamed Helmy | Receivables; Net cash, next 8 weeks; Expected gross profit, Nov                              |
      | Esraa Mohamed | Out-of-hours RFQs; Time to acknowledge                                                       |

  Scenario: Sales counts only the cases they own
    Given I am signed in as "Soaad Amer"
    When I open my home page
    Then my home page shows "Awaiting customer decision" as "1"
    And my home page shows "Awaiting internal approval" as "2"

  Scenario: The sourcing desk continues with its most urgent case
    Given I am signed in as "Karim Youssef"
    When I open my home page
    Then the main button on my home page is "Continue GS-RFQ-0136"

  Scenario: A closed case no longer counts as the most urgent
    Given I am signed in as "Karim Youssef"
    And the case "GS-RFQ-0136" has its stage set to "Lost"
    When I open my home page
    Then the main button on my home page is "Continue GS-RFQ-0140"

  Scenario Outline: Overdue quotes reach the desk, sales and management but not finance or operations
    Given I am signed in as "<person>"
    When I open my home page
    Then my daily briefing <sees> "Rig support · DOS Falcon quote 6 days overdue"

    Examples:
      | person        | sees             |
      | Karim Youssef | mentions         |
      | Soaad Amer    | mentions         |
      | Karim Balbaa  | mentions         |
      | Ahmedy        | does not mention |
      | Mohamed Helmy | does not mention |

  Scenario: A customer PO mismatch comes first in the operations briefing
    Given I am signed in as "Ahmedy"
    When I open my home page
    Then my daily briefing starts with "Customer PO mismatch on GS-RFQ-0136"

  Scenario: A vessel arriving within two days is in the operations briefing
    Given I am signed in as "Ahmedy"
    When I open my home page
    Then my daily briefing mentions "MV Nordic Tern arrives tomorrow"

  Scenario: An arrival without a time is given as a day only
    Given I am signed in as "Ahmedy"
    When I open my home page
    Then my daily briefing mentions "MV Nordic Tern arrives tomorrow · GS-RFQ-0136"
    And my daily briefing does not mention "arrives tomorrow 00:00"

  Scenario: A quote already with the customer is not late
    Given I am signed in as "Karim Youssef"
    When I open my home page
    Then my daily briefing does not mention "MT Atlas Pearl quote"

  Scenario: A quote the customer asked to revise is still due
    Given I am signed in as "Karim Youssef"
    And the case "GS-RFQ-0139" has its stage set to "Revision requested"
    When I open my home page
    Then my daily briefing mentions "MT Atlas Pearl quote 5 days overdue"

  Scenario: A supplier who has not replied in time is flagged to the desk
    Given I am signed in as "Karim Youssef"
    When I open my home page
    Then my daily briefing mentions "Red Sea Safety hasn't replied"

  Scenario: Sales is not told about silent suppliers
    Given I am signed in as "Soaad Amer"
    When I open my home page
    Then my daily briefing does not mention "Red Sea Safety hasn't replied"

  Scenario: A supplier who replied drops out of the briefing
    Given I am signed in as "Karim Youssef"
    And the supplier has replied to "GS-SRFQ-0141-A"
    When I open my home page
    Then my daily briefing does not mention "Red Sea Safety hasn't replied"

  Scenario: Sales hears how many items wait for approval
    Given I am signed in as "Soaad Amer"
    When I open my home page
    Then my daily briefing mentions "6 items awaiting approval"

  Scenario: Approvers count their own decisions instead of the whole queue
    Given I am signed in as "Karim Balbaa"
    When I open my home page
    Then my daily briefing does not mention "items awaiting approval"
    And my home page summary reads "6 decisions waiting · 3 quotes due by tomorrow · 20 live cases"

  Scenario: Pending approvals are counted the same on the home page, in the sidebar and by Golden Sea
    Given I am signed in as "Karim Balbaa"
    When I open my home page
    Then my home page summary reads "6 decisions waiting · 3 quotes due by tomorrow · 20 live cases"
    And my sidebar counts 6 decisions waiting for me
    When I ask Golden Sea "What's waiting for approval?"
    Then Golden Sea answers "6 approvals are waiting."

  Scenario: An approval signed by one of two approvers still waits for the second
    Given I am signed in as "Mohamed Helmy"
    When I open my home page
    Then my home page summary reads "1 decision waiting · USD 17.1k past due · 3 supplier bills open"
    And my sidebar counts 1 decision waiting for me
    When I ask Golden Sea "What's waiting for approval?"
    Then Golden Sea's answer lists "Port Said Welding requests new beneficiary bank account"

  Scenario: A decided approval leaves every count
    Given I am signed in as "Karim Balbaa"
    And I approve the request "ESAB OK 46.00 instead of Lincoln Omnia 46 (GS-RFQ-0135 line 1)"
    When I open my home page
    Then my home page summary reads "5 decisions waiting · 3 quotes due by tomorrow · 20 live cases"
    And my sidebar counts 5 decisions waiting for me
    When I ask Golden Sea "What's waiting for approval?"
    Then Golden Sea answers "5 approvals are waiting."

  Scenario: An open integration exception is in the operations briefing
    Given I am signed in as "Ahmedy"
    When I open my home page
    Then my daily briefing mentions "Outlook: purchasing@ mailbox token expired · 12 emails not yet imported · safe retry available"

  Scenario: A resolved integration exception leaves the briefing
    Given I am signed in as "Ahmedy"
    And the exception "purchasing@ mailbox token expired" has its status set to "Resolved"
    When I open my home page
    Then my daily briefing does not mention "purchasing@ mailbox token expired"
    And my home page summary reads "2 deliveries in progress · 3 bills to match · 1 integration exception"

  Scenario: Finance sees each open invoice with what is still owed
    Given I am signed in as "Mohamed Helmy"
    When I open my home page
    Then my daily briefing mentions "Helios Bulk Carriers: USD 4,200 due 30 Nov · INV/2026/0412 · Partially paid · 10,000 received"

  Scenario: An unpaid invoice past its due date is flagged as overdue
    Given I am signed in as "Mohamed Helmy"
    When I open my home page
    Then my daily briefing warns "Atlas Tankers: USD 1,400 overdue since 26 Aug · INV/2026/0371 · Overdue"
    And the invoice "INV/2026/0371" has status "Overdue"

  Scenario: A part-paid invoice past its due date is overdue too
    Given I am signed in as "Mohamed Helmy"
    When I open my home page
    Then my daily briefing warns "Delta Offshore Services: EGP 100,000 overdue since 28 Oct · INV/2026/0398 · Overdue · 70,000 received"

  Scenario: An invoice whose due date has not come yet is not overdue
    Given I am signed in as "Mohamed Helmy"
    When I open my home page
    Then the invoice "INV/2026/0405" has status "Open"
    And my daily briefing does not mention "INV/2026/0405 · Overdue"

  Scenario: An invoice that falls past its due date becomes overdue
    Given I am signed in as "Mohamed Helmy"
    And the invoice "INV/2026/0405" has its due date set to "2026-11-10T00:00:00.000Z"
    Then the invoice "INV/2026/0405" has status "Overdue"

  Scenario: A paid invoice leaves the finance briefing
    Given I am signed in as "Mohamed Helmy"
    And the invoice "INV/2026/0405" has its paid set to "465000"
    When I open my home page
    Then my daily briefing does not mention "INV/2026/0405"

  Scenario: Sales does not see invoices in the briefing
    Given I am signed in as "Soaad Amer"
    When I open my home page
    Then my daily briefing does not mention "INV/2026/0405"

  Scenario: The desk hears about new messages until they are triaged
    Given I am signed in as "Karim Youssef"
    And the intake message "Photo of requisition list (WhatsApp)" has its status set to "Linked"
    When I open my home page
    Then my daily briefing mentions "5 new messages in the inbox"

  Scenario: The office admin's daily briefing covers the inbox and integration problems
    Given I am signed in as "Esraa Mohamed"
    When I open my home page
    Then my daily briefing mentions "6 new messages in the inbox"
    And my daily briefing mentions "Outlook: purchasing@ mailbox token expired"
    And my daily briefing does not mention "INV/2026/0405"

  Scenario: Next up lists my own tasks
    Given I am signed in as "Ahmedy"
    When I open my home page
    Then my next up list includes "Collect signed delivery note for drop 1 (DOS Falcon)"

  Scenario: The office admin sees everyone's tasks
    Given I am signed in as "Esraa Mohamed"
    When I open my home page
    Then my next up list includes "Collect signed delivery note for drop 1 (DOS Falcon)"

  Scenario: Other people's tasks stay off my list
    Given I am signed in as "Soaad Amer"
    When I open my home page
    Then my next up list does not include "Collect signed delivery note for drop 1 (DOS Falcon)"

  Scenario: Sales sees only the quote deadlines of their own cases
    Given I am signed in as "Soaad Amer"
    When I open my home page
    Then my next up list includes "MV Corallo: quote due"
    And my next up list does not include "MV Aurora Crest: quote due"

  Scenario: Management sees every quote deadline this week
    Given I am signed in as "Karim Balbaa"
    When I open my home page
    Then my next up list includes "MV Aurora Crest: quote due"

  Scenario: A task whose time has passed is marked late
    Given I am signed in as "Ahmedy"
    And the task "Collect signed delivery note for drop 1 (DOS Falcon)" has its due set to "2026-11-17T08:00:00.000Z"
    When I open my home page
    Then "Collect signed delivery note for drop 1 (DOS Falcon)" is marked late in my next up list

  Scenario: Next up says how much is due today and later this week
    Given I am signed in as "Mohamed Helmy"
    When I open my home page
    Then my next up list says "Nothing due today · 2 later this week"
    And my next up list includes "Suez Industrial Supply: bill due"
