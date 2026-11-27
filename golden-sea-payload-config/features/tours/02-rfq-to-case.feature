@tour
Feature: Any format in, one case out
  An RFQ email with Excel, PDF and a photo becomes one clean case — AI reads, a person decides.

  Scenario: The tour
    Given I am signed in as "Karim Youssef"
    And I open the "Inbox" page
    Then the tour points at "Connected channels" and says "One inbox for every channel"
      """
      Outlook, Gmail, the website quick-quote form and WhatsApp all land in one list — nothing lives
      in someone's personal mailbox.
      """
    When I click "Simulate new email"
    Then the tour points at "Original message" and says "The original is kept"
      """
      A new RFQ for MV Aurora Crest arrives with an Excel list, a PDF and a WhatsApp photo. The email
      and every file stay with the case.
      """
    When I click "Extract with AI"
    And I give it 1.8 seconds
    Then the tour points at "Draft lines" and says "AI reads, people decide"
      """
      Every line gets its IMPA code, quantity, unit and the file it came from, with a confidence. The
      62% photo line is flagged for a person.
      """
    And the tour points at "Missing or unclear" and says "Nothing is guessed"
      """
      Missing details become a drafted clarification to the customer — drafted, not sent.
      """
    And the tour points at "Owner, backup and deadline" and says "Owner, backup, deadline"
      """
      Assignment rules suggest who owns it and who backs them up; the deadline comes from the
      customer's request.
      """
    And the tour points at "Next step" and says "One click to a case"
      """
      Confirming creates the case with its lines, links the email and sends one branded
      acknowledgement.
      """
