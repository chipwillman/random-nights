Feature: EditPersonalPreferences
	In order for wwDrink to filter my search results
	As a pub crawler
	I want to be able to enter my preferences

@wip
Scenario: Set Age Range
	Given I am at the manage user page
	When I select an age range
	And I press Save Details
	Then my age range should be set

@wip
Scenario: Set Screen Name
	Given I am at the manage user page
	When I change my screen name
	And I press Save Details
	Then my new screen name should be set

@wip
Scenario: Set Sexual Preference
	Given I am at the manage user page
	When I select my sexual preference
	And I press Save Details
	Then my sexual preference should be set

@wip
Scenario: Set Musical Preference Require
	Given I am at the manage user page
	When I set "Classic Rock" to "Require"
	And I press Save Details
	Then I should see "Classic Rock" as "Required" 

@wip
Scenario: Set Musical Preference Exclude
	Given I am at the manage user page
	When I set "Blues" to "Exclude"
	And I press Save Details
	Then I should see "Blues" as "Excluded" 

@wip
Scenario: Set Musical Preference to Highly Desired
	Given I am at the manage user page
	When I set "Country" to "Highly Desired"
	And I press Save Details
	Then I should see "Country" as "Highly Desired" 
	