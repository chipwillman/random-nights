Feature: LogOn
	So I can use my personal preferences when searching
	As a regular user
	I want to be able to log on to wwDrink

Scenario: Log On to web Site with face book
	Given I navigate to wwDrink
	And I am not logged in
	When I press Log in
	Then I should be presented with the ability to log on with facebook

Scenario: Register a new account
	Given I navigate to wwDrink
	And I am not logged in
	When I press Register
	Then I should redirected to the register page

Scenario: Log on with an existing account
	Given User Credential Exist 
	And I navigate to wwDrink
	And I am not logged in
	When I press Log in
	And Enter my user credentials
	Then I should return to the home page logged on

