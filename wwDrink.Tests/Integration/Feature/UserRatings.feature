Feature: UserRatings
	In order better search results
	As an administrator
	I want users to be able to rate establishments and its aspects

@wip
Scenario: Rate an Establishment
	Given I have found an establishment with ratings
	When I rate an establishment 4 stars
	Then establishment should include my result in the ratings

@wip
Scenario: Rate an Establishments aspects
	Given I have found an establishment with ratings
	When I rate an establishment aspect 1 stars
	Then establishment aspect should include my result in the ratings
