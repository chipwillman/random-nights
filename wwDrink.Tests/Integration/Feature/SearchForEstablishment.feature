Feature: Search For Establishment
	In order to know where to quench my thirst
	As a crawler
	I want to search for pubs near me

Scenario: Search by City
	Given I navigate to wwDrink 
	And I search for "kensington, victoria"
	When I press the search button
	Then the results should contain "Hardimans"

# barnivore.com for veggies
# happycow.com (org/net) also
@wip
Scenario: Catering for Vegans and Vegitarians
	Given I am non meat eating pub crawler
	When I visit wwDrink
	And I search for vegitarian safe beer
	Then I should see "Little Creatures"
