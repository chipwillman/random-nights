Feature: AddReviews
	In order to Inform other of my experiences
	As a pub crawler
	I want be able to leave reviews

@ignore @wip
Scenario: Review an establishment
	Given I have a new registered user 
	And I am at an establishments details page
	When I enter an establishment review 
	Then others should be able to view my establishment review

@ignore @wip
Scenario: Review a beverage
	Given I have a new registered user 
	And I am at a beverage detail page
	When I enter a beverage review
	Then others should be able to view my beverage review

