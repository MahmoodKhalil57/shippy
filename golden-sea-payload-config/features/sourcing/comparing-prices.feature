Feature: Seeing supplier prices on a case
  Everyone on the desk sees which lines of a case are asked, held or offered.
  Supplier costs stay with supply chain, management and finance: sales quote the customer without seeing what Golden Sea pays.

  Scenario Outline: Who sees what new suppliers charge
    Given I am signed in as "<person>"
    And supplier replies arrive for case "GS-RFQ-0142"
    When I open the supplier RFQs of case "GS-RFQ-0142"
    Then <what they see>

    Examples:
      | person        | what they see                             |
      | Karim Youssef | I see what new suppliers charge           |
      | Karim Balbaa  | I see what new suppliers charge           |
      | Mohamed Helmy | I see what new suppliers charge           |
      | Soaad Amer    | what new suppliers charge is hidden from me |
