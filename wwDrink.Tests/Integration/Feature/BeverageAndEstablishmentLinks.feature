Feature: BeverageAndEstablishmentLinks
	In order better decide if I want to visit an establishment
	As a pub crawler
	I want to see what drinks are available at an establishment

@wip
Scenario: Establishment Beverage Listings
	Given a claimed establishment has a drink menu
	And I have searched for a local establishment
	When I view the establishment details
	Then the details should contain the available drinks

@wip
Scenario: Searching by beverage to find an establishment
	Given a claimed establishment has a drink menu
	And I have select to search for a drink
	When I perform the search
	Then the details should contain establishments with the drink
