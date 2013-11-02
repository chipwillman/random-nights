Feature: BeverageDatabase
	In order to include beverages in my personal and search preferences
	As a pub crawler
	I want to be able to browse wwDrink Beverage Database

@wip
Scenario: View Beer Database
	Given I have visited wwDrink
	When I press the Beer Menu
	Then I should be presented with a search for "Beer" page

@wip
Scenario: View Wine Database
	Given I have visited wwDrink
	When I press the Wine Menu
	Then I should be presented with a search for "Wine" page

@wip
Scenario: View Liqour Database
	Given I have visited wwDrink
	When I press the Liquor Menu
	Then I should be presented with a search for "Liqour" page

