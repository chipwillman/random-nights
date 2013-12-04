Feature: Review Staff
	In order to inform others
	As a pub crawler
	I want to be able to review the staff

@ignore @wip
Scenario: Review establishment bar staff
	Given I am reviewing an establishment
	When I expand the staff review section
	And I enter a bar staff review
	Then others should be allowed to see the review

@ignore @wip
Scenario: Review establishment security staff
	Given I am reviewing an establishment
	When I expand the staff review section
	And I enter a security staff review
	Then others should be allowed to see the review

@ignore @wip
Scenario: Review establishment management staff
	Given I am reviewing an establishment
	When I expand the staff review section
	And I enter a management staff review
	Then others should be allowed to see the review

