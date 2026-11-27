Feature: Matching supplier replies to cases
  Supply chain files each supplier reply in the inbox against the case and the supplier RFQ it answers.
  A sure match counts the offer at once. An unsure one waits for a person, so no offer lands on the wrong case.
  Only supply chain and management match, link or set aside supplier replies.

  Background:
    Given I am signed in as "Karim Youssef"

  Scenario: A reply that quotes our supplier RFQ reference is matched to its case
    When I match the message "RE: Price enquiry – belt grip spray"
    Then I am told "Matched to GS-RFQ-0142 by GS-SRFQ-0142-C (99%)"
    And the intake message "RE: Price enquiry – belt grip spray" has status "Linked"

  Scenario: A matched reply from the invited supplier counts as their answer
    Given the intake message "RE: Price enquiry – belt grip spray" has its from set to "sales@psweld.example"
    And the intake message "RE: Price enquiry – belt grip spray" has its body set to "Our offer for your GS-SRFQ-0142-E"
    When I match the message "RE: Price enquiry – belt grip spray"
    Then the supplier rfq "GS-SRFQ-0142-E" has status "Replied"

  Scenario: A reply that quotes another supplier's reference waits for review
    Given the intake message "RE: Price enquiry – belt grip spray" has its from set to "sales@psweld.example"
    When I match the message "RE: Price enquiry – belt grip spray"
    Then I am told "Uncertain, sent to the review queue"
    And the intake message "RE: Price enquiry – belt grip spray" has status "Needs review"
    And the review reason for the message "RE: Price enquiry – belt grip spray" says "Sent by Port Said Welding Co., but GS-SRFQ-0142-C was sent to Horizon Trading. A person checks it before it counts"
    And the supplier rfq "GS-SRFQ-0142-E" has status "Awaiting reply"

  Scenario: A reply without our reference waits for a person to review it
    When I match the message "prices as requested"
    Then I am told "Uncertain, sent to the review queue"
    And the intake message "prices as requested" has status "Needs review"

  Scenario: A message from an unknown sender without a reference waits for review
    When I match the message "Inquiry MV Polar Bay – provisions & cabin stores"
    Then I am told "Uncertain, sent to the review queue"

  Scenario: A forward of a request we already have is a duplicate of its case
    When I match the message "FW: RFQ NSM-REQ-55821 MV Aurora Crest"
    Then I am told "Duplicate, already linked to GS-RFQ-0142"
    And the intake message "FW: RFQ NSM-REQ-55821 MV Aurora Crest" has classification "Duplicate"

  Scenario: The same attachments sent again are kept with the first message, not sent to review
    Given the intake message "Inquiry MV Polar Bay – provisions & cabin stores" has its attachment hash set to "sha256:polar-bay"
    And the intake message "Quick quote — Lalizas life jackets & lifebuoys, Abu Qir rig" has its attachment hash set to "sha256:polar-bay"
    When I match the message "Inquiry MV Polar Bay – provisions & cabin stores"
    Then I am told "Duplicate, kept with the original"
    And the intake message "Inquiry MV Polar Bay – provisions & cabin stores" has classification "Duplicate"
    And the intake message "Inquiry MV Polar Bay – provisions & cabin stores" has status "Linked"
    And the inbox shows 1 message to review

  Scenario: Reading a duplicate files it with the original case
    Given the intake message "Inquiry MV Polar Bay – provisions & cabin stores" has its attachment hash set to "sha256:9f1c…"
    When I read the message "Inquiry MV Polar Bay – provisions & cabin stores"
    Then the intake message "Inquiry MV Polar Bay – provisions & cabin stores" has classification "Duplicate"
    And the intake message "Inquiry MV Polar Bay – provisions & cabin stores" has status "Linked"

  Scenario: Linking a reviewed reply counts it on the supplier's RFQ
    When I link the message "prices as requested" to case "GS-RFQ-0141"
    Then the intake message "prices as requested" has status "Linked"
    And the supplier rfq "GS-SRFQ-0141-B" has status "Replied"
    And the supplier rfq "GS-SRFQ-0141-B" has latest "Reply linked after review"

  Scenario: A reply cannot be linked without a case
    When I link the message "prices as requested" to its suggested case
    Then I am stopped with "Pick the case this message belongs to."

  Scenario: A message that is not related is set aside
    When I mark the message "prices as requested" as not related
    Then the intake message "prices as requested" has status "Ignored"

  Scenario: Management can link a reply
    Given I am signed in as "Karim Balbaa"
    When I link the message "prices as requested" to case "GS-RFQ-0141"
    Then the intake message "prices as requested" has status "Linked"

  Scenario Outline: Only supply chain and management link supplier replies
    Given I am signed in as "<person>"
    When I link the message "prices as requested" to case "GS-RFQ-0141"
    Then I am not allowed
    And I am stopped with "Only supply chain and management can do this."
    And the intake message "prices as requested" has status "Needs review"
    And the supplier rfq "GS-SRFQ-0141-B" has status "Partial reply"

    Examples:
      | person        |
      | Soaad Amer    |
      | Ahmedy        |
      | Mohamed Helmy |
      | Esraa Mohamed |

  Scenario: Sales cannot set a supplier reply aside
    Given I am signed in as "Soaad Amer"
    When I mark the message "prices as requested" as not related
    Then I am not allowed
    And I am stopped with "Only supply chain and management can do this."
    And the intake message "prices as requested" has status "Needs review"

  Scenario: Sales cannot match a supplier reply
    Given I am signed in as "Soaad Amer"
    When I match the message "Inquiry MV Polar Bay – provisions & cabin stores"
    Then I am not allowed
    And I am stopped with "Only supply chain and management can do this."
    And the intake message "Inquiry MV Polar Bay – provisions & cabin stores" has status "New"

  Scenario: The person who set a message aside can put it back in the queue
    Given I mark the message "prices as requested" as not related
    When I take back my review of the message "prices as requested"
    Then I am told "Back in the review queue"
    And the intake message "prices as requested" has status "Needs review"

  Scenario: Only the person who filed a message can take it back
    Given I mark the message "prices as requested" as not related
    And I am signed in as "Karim Balbaa"
    When I take back my review of the message "prices as requested"
    Then I am stopped with "Karim Youssef filed this message, so only they can take it back."

  Scenario: A link that counted a supplier's reply cannot be taken back
    Given I link the message "prices as requested" to case "GS-RFQ-0141"
    When I take back my review of the message "prices as requested"
    Then I am stopped with "The supplier's reply is already counted on the case, so the link can't be taken back."

  Scenario: A link that counted nothing can be taken back
    Given I link the message "Inquiry MV Polar Bay – provisions & cabin stores" to case "GS-RFQ-0141"
    When I take back my review of the message "Inquiry MV Polar Bay – provisions & cabin stores"
    Then I am told "Back in the review queue"

  Scenario: Only a message filed by a review can be taken back
    When I take back my review of the message "RE: Price enquiry – belt grip spray"
    Then I am stopped with "This message isn't filed by a review, so there is nothing to take back."
