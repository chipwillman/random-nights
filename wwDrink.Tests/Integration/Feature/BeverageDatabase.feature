Feature: BeverageDatabase
	In order to include beverages in my personal and search preferences
	As a pub crawler
	I want to be able to browse wwDrink Beverage Database

Scenario: View Beer Database
	Given I have visited wwDrink
	When I press the Beer Menu
	Then I should be presented with a search for Beer page

Scenario: Search Beer Database
	Given I am at the Beer Page
	When I search for Toohey's Old
	Then I should be presented with search results Toohey's Old 

Scenario: View Wine Database
	Given I have visited wwDrink
	When I press the Wine Menu
	Then I should be presented with a search for Wine page

Scenario: Search Wine Database
	Given I am at the Wine Page
	When I search for Chianti
	Then I should be presented with search results Chianti 

Scenario: View Liqour Database
	Given I have visited wwDrink
	When I press the Liquor Menu
	Then I should be presented with a search for Liqour page

Scenario: Search Liqour Database
	Given I am at the Liqour Page
	When I search for Jack Daniels
	Then I should be presented with search results Jack Daniels
