Feature: EstablishmentManagement
	In order for the establishment listing to better reflect my business
	As an establishment owner
	I want to be told the sum of two numbers

@wip
Scenario: Claim an establishment
	Given I have found my establishment 
	When I complete the claim establishment form
	Then I should be able to edit the details of the establishment

@wip
Scenario: Edit an establishments aspects
	Given I am at the edit my establishment page
	When I select aspects for my establishment and save
	Then I others should be able to view my changed aspects

@wip
Scenario: Edit an establishments opening hours
	Given I am at the edit my establishment page
	When I change my opening hours and save
	Then I others should be able to view my changed opening hours

@wip
Scenario: Edit an establishment photo
	Given I am at the edit my establishment page
	When I change my establishment photo and save
	Then I others should be able to view my changed primary photo

@wip
Scenario: Edit an establishment drinks menu
	Given I am at the edit my establishment page
	When I enter my establishment drinks menu
	Then I others should be able to view my drinks menu

@wip
Scenario: Edit an establishment food menu
	Given I am at the edit my establishment page
	When I enter my establishment food menu
	Then I others should be able to view my food menu

@wip
Scenario: Edit an establishment events calendar
	Given I am at the edit my establishment page
	When I enter new events 
	Then I others should be able to view my events calendar

@wip
Scenario: Edit an establishment specials
	Given I am at the edit my establishment page
	When I enter specials 
	Then I others should be able to view my specials
