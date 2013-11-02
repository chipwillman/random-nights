Feature: UserAddedContent
	In order to avoid having to do it myself
	As an administrator
	I want users to be able to provide content

@wip
Scenario: User add establishment aspects
	Given I am viewing an establishments details
	When I elect to add aspects 
	Then others should be able to see the added aspects

@wip
Scenario: User add establishment beverages
	Given I am viewing an establishments details
	When I elect to add a beverage
	Then others should be able to see the beverages available
