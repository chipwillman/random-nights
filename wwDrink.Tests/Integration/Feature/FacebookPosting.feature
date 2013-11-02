Feature: FacebookPosting
	In order to share with my friends
	As a pub crawler
	I want to be able to share establishments, beverage and reviews 

@wip
Scenario: Share establishment on Facebook
	Given I am at an establishments details page
	When I press the face book like establishment button
	Then the results should be posted to facebook

@wip
Scenario: Share an establishment review on Facebook
	Given I am viewing a members establishment review
	When I press the face book like establishment review button
	Then the establishment review should be posted to facebook

@wip
Scenario: Share a beverage on Facebook
	Given I am at a beverage details page
	When I press the Facebook like beverage button
	Then the beverage should appear on the users timeline

@wip
Scenario: Share an beverage review on Facebook
	Given I am viewing a members review of a beverage
	When I press the face book like beverage review button
	Then the beverage review should be posted to facebook
