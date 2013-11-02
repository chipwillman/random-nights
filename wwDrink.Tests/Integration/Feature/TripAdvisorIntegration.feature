Feature: TripAdvisorIntegration
	In order get a more comprehensive view of an establishment
	As a pub crawler
	I want to have information from Trip Advisor included in my search results

@wip
Scenario: Trip Advisor Reviews
	Given I am have searched for a popular establishments details
	When I view the establishment details
	Then the reviews should contain entries from "Trip Advisor"

