Feature: SearchUsingPreferences
	In order to impove search results
	As a pub crawler
	I want my search results to use my personal preferences

@wip
Scenario: Preferences adjust results sorting 
	Given I am a user with "pool table" as "high preference"
	When I search for establishments in "Melbourne"
	Then establishments with "pool table"s should appear "higher than" ones without

@wip
Scenario: Exclude from results
	Given I am a user with "pool table" as "excluded"
	When I search for establishment in "Kensington"
	Then establishment with "pool table"s should appear "below" ones without

@wip
Scenario: Required in results
	Given I am a user with "pool table" as "required"
	When I search for establishment in "Kensington"
	Then only establishment with "pool table"s should appear
