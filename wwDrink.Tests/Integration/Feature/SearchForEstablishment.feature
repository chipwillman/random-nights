Feature: Search For Establishment
	In order to know where to quench my thirst
	As a crawler
	I want to search for pubs near me

@mytag
Scenario: Search by GPS
	Given I navigate to wwDrink 
	And I search for "kensington, victoria"
	When I press the search button
	Then the results should contain "Hardimans"
