Feature: GoogleMap
	In order see what pubs are in my current vicinity
	As a pub crawler
	I want the search results to response to map changes

@wip
Scenario: Zoom out
	Given I have searched for establishments in a sparse area
	When I zoom out on the google map
	Then the search should expand to include the new area of the map

@wip
Scenario: Scroll Map
	Given I have searched for establishments
	When I scroll the google map
	Then the search should trigger 
	And establishments should appear in the new vicinity

@wip
Scenario: Dense Areas
	Given I have searched for establishments in a dense area
	When The initial results complete
	Then additional restablishments should continue to be added to the search results

@wip
Scenario: Map bubble information
	Given I have searched for establishments
	When I select a map marker
	Then summary details about the establishment should appear
