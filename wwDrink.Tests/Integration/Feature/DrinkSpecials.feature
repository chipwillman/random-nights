Feature: DrinkSpecials
	In order to encourage people to attend my establishment
	As an establishment owner
	I want to be be able to offer drink specials

# Adding drink specials in included in the Establishment Management feature

@ignore @wip
Scenario: View drink specials
	Given I have navigated to the specials page
	And an establishment exists in my local area
	When I view the web page
	Then the result should contain the specials
