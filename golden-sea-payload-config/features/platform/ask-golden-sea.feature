Feature: Ask Golden Sea
  Anyone can ask the assistant about cases, approvals, money, suppliers, deadlines and the growth pipeline.
  It answers from the records it cites and never shares costs or margins with Sales.

  Scenario: Asking needs a signed-in person
    Given I am not signed in
    When I ask Golden Sea "Who owes us money?"
    Then I am not allowed

  Scenario: An empty question is refused
    Given I am signed in as "Karim Youssef"
    When I ask Golden Sea nothing
    Then I am stopped with "Ask a question."

  Scenario: Sales is never told costs or margins
    Given I am signed in as "Soaad Amer"
    When I ask Golden Sea "What's our margin this month?"
    Then Golden Sea refuses to answer
    And Golden Sea answers "I can't share costs, margins or profit with the Sales role."
    And the AI work "What's our margin this month?" is logged as "Rejected"

  Scenario: Management gets this month's gross profit and the weakest stores
    Given I am signed in as "Karim Balbaa"
    When I ask Golden Sea "What's our margin this month?"
    Then Golden Sea answers "Nov: gross profit EGP 412k expected at quotation, EGP 268k actual so far. The gap closes as November's costs are billed."
    And Golden Sea's answer lists "Lowest: Electrical stores 19.8%."
    And the AI work "What's our margin this month?" is logged as "Applied automatically"

  Scenario: Asking about a case's margin gives its actual against expected profit
    Given I am signed in as "Karim Balbaa"
    When I ask Golden Sea "What was the margin on Helios Dawn?"
    Then Golden Sea answers "GS-RFQ-0131 (MV Helios Dawn): actual gross profit EGP 165,370, 23.9% margin, against EGP 167,470 (24.3%) expected at quotation."
    And Golden Sea's answer lists "FX on receipts: +EGP 2,000"

  Scenario: Approvals waiting are listed with their approvers
    Given I am signed in as "Karim Youssef"
    When I ask Golden Sea "What's waiting for approval?"
    Then Golden Sea answers "6 approvals are waiting."
    And Golden Sea's answer lists "(two-person rule)"

  Scenario: Who owes us money lists the open invoices and what we owe suppliers
    Given I am signed in as "Mohamed Helmy"
    When I ask Golden Sea "Who owes us money?"
    Then Golden Sea answers "Customers owe USD 35,600 + EGP 663,500 + EUR 7,040 on 11 open invoices; 4 overdue."
    And Golden Sea's answer lists "Atlas Tankers: USD 1,400 on INV/2026/0371, overdue since 26 Aug"
    And Golden Sea's answer lists "We owe"

  Scenario: Sales hears what customers owe but not what we owe suppliers
    Given I am signed in as "Soaad Amer"
    When I ask Golden Sea "Who owes us money?"
    Then Golden Sea's answer does not list "We owe"

  Scenario: Late suppliers are summarised with the least reliable ones
    Given I am signed in as "Karim Youssef"
    When I ask Golden Sea "Which suppliers are late?"
    Then Golden Sea answers "2 deliveries are late or short, and 5 supplier RFQs are waiting for a reply."
    And Golden Sea's answer lists "Least reliable: Port Said Welding Co. 81% on time, 30 h replies"

  Scenario: Asking about one supplier answers for that supplier only
    Given I am signed in as "Karim Youssef"
    When I ask Golden Sea "How fast does Red Sea Safety reply?"
    Then Golden Sea answers "Red Sea Safety: replies in 5 h on average, 96% on time."
    And Golden Sea's answer lists "Red Sea Safety: GS-SRFQ-0141-A awaiting reply, due 3 days overdue (2 reminders)"
    And Golden Sea's answer does not list "Port Said Welding Co."
    And Golden Sea cites "Red Sea Safety"

  Scenario: The growth pipeline names opportunities without a next step
    Given I am signed in as "Soaad Amer"
    When I ask Golden Sea "How is the growth pipeline?"
    Then Golden Sea answers "6 growth opportunities open; 150 inquiries and 42 wins in the last 12 weeks (28% by count, 36% by value this month)."
    And Golden Sea's answer lists "Plan a next step or close: Medline Tankers."

  Scenario: Deadlines and risks list the cases that need attention
    Given I am signed in as "Karim Balbaa"
    When I ask Golden Sea "What is urgent today?"
    Then Golden Sea answers "6 live cases need attention."
    And Golden Sea's answer lists "GS-RFQ-0141 MV Helios Star: Awaiting supplier, deadline tomorrow 16:00"

  Scenario: Asking about a vessel gives its case status, deadline and suppliers
    Given I am signed in as "Karim Youssef"
    When I ask Golden Sea "What's the status of Aurora Crest?"
    Then Golden Sea answers "GS-RFQ-0142 · MV Aurora Crest (Nordvik Ship Management): Comparing offers."
    And Golden Sea's answer lists "Quote deadline 18 Nov 14:00 (tomorrow 14:00) · ETA Port Said 21 Nov"
    And Golden Sea's answer lists "Lines: 3 of 6 ready, 1 blocked"
    And Golden Sea's answer lists "Waiting on Port Said Welding Co. (awaiting reply)"

  Scenario: A case already with the customer shows no quote deadline
    Given I am signed in as "Karim Youssef"
    When I ask Golden Sea "Tell me about 0139"
    Then Golden Sea answers "GS-RFQ-0139 · MT Atlas Pearl (Atlas Tankers): Awaiting customer decision."
    And Golden Sea's answer lists "ETA Alexandria 28 Nov"
    And Golden Sea's answer does not list "Quote deadline"

  Scenario: A case waiting for approval says what is pending
    Given I am signed in as "Karim Youssef"
    When I ask Golden Sea "Tell me about 0137"
    Then Golden Sea's answer lists "Approval pending:"

  Scenario Outline: Only money roles see a delivered case's gross profit in its status
    Given I am signed in as "<person>"
    When I ask Golden Sea "Tell me about Helios Dawn"
    Then Golden Sea's answer <sees> "Gross profit EGP 165,370 (23.9%)"

    Examples:
      | person        | sees          |
      | Karim Balbaa  | lists         |
      | Karim Youssef | does not list |

  Scenario: A word about a decision alone does not make it an approvals question
    Given I am signed in as "Karim Youssef"
    When I ask Golden Sea "Has Aurora Crest had a decision?"
    Then Golden Sea answers "GS-RFQ-0142 · MV Aurora Crest (Nordvik Ship Management): Comparing offers."

  Scenario: Asking what decisions wait for me lists the approvals
    Given I am signed in as "Karim Balbaa"
    When I ask Golden Sea "Which decisions are waiting for me?"
    Then Golden Sea answers "6 approvals are waiting."

  Scenario: The question goes to the topic most of its words are about
    Given I am signed in as "Karim Youssef"
    When I ask Golden Sea "Which supplier is late to reply on the urgent case?"
    Then Golden Sea answers "2 deliveries are late or short, and 5 supplier RFQs are waiting for a reply."

  Scenario: A question it cannot place gets help on what to ask
    Given I am signed in as "Karim Youssef"
    When I ask Golden Sea "Hello there"
    Then Golden Sea answers "I answer from every case, quote, approval, invoice and supplier record in the platform. Ask about a vessel or case number, approvals, who owes us money, suppliers, deadlines or the growth pipeline."

  Scenario Outline: Sales is not offered the margin question
    Given I am signed in as "<person>"
    When I open the suggested questions
    Then I am <offered> the question "What's our margin this month?"
    And I am offered the question "Who owes us money?"

    Examples:
      | person       | offered     |
      | Karim Balbaa | offered     |
      | Soaad Amer   | not offered |
