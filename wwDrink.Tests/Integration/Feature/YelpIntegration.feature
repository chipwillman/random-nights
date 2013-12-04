Feature: YelpIntegration
	In order get a more comprehensive view of an establishment
	As a pub crawler
	I want to have information from Yelp included in my search results

@ignore @wip
Scenario: Yelp Reviews
	Given I am have searched for a popular establishments details
	When I view the establishment details
	Then the reviews should contain entries from "Yelp"
