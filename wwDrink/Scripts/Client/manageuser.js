function ManageUsers() {
    var self = this;
    self.profilePk = ko.observable("");
    self.UserId = ko.observable("");
    self.UserName = ko.observable("");
    self.screenName = ko.observable();
    self.ageRange = ko.observable();

    self.editPersonalDetails = ko.observable(false);
    self.editEstablishmentDetails = ko.observable(false);

    self.userPreferences = ko.observableArray();
    self.musicalPreferences = ko.observableArray();
    
    self.musicalAspects = ko.observableArray();
    self.sexualOrientationAspects = ko.observableArray();
    
    self.serviceAndStaffAspects = ko.observableArray();
    self.venueTypeAspects = ko.observableArray();
    self.activitiesAspects = ko.observableArray();
    self.gamesAspects = ko.observableArray();
    self.foodAspects = ko.observableArray();
    self.musicPerformanceAspects = ko.observableArray();
    self.atmosphereAspects = ko.observableArray();

    self.ShowPersonalDetails = ko.observable();
    self.ShowEstablishmentDetails = ko.observable();
    self.ShowBeverageDetails = ko.observable();
    self.ShowAccessDetails = ko.observable();

    self.AspectHeadingClass = ko.computed(function () {
        if (self.ShowPersonalDetails()) {
            return "preference-heading-selected";
        }
        return "preference-heading";
    });

    self.EstablishmentHeadingClass = ko.computed(function () {
        if (self.ShowEstablishmentDetails()) {
            return "preference-heading-selected";
        }
        return "preference-heading";
    });

    self.BeverageHeadingClass = ko.computed(function () {
        if (self.ShowBeverageDetails()) {
            return "preference-heading-selected";
        }
        return "preference-heading";
    });

    self.AccessHeadingClass = ko.computed(function () {
        if (self.ShowAccessDetails()) {
            return "preference-heading-selected";
        }
        return "preference-heading";
    });

    self.ShowPersonalClick = function () {
        self.ShowPersonalDetails(!self.ShowPersonalDetails());
    };

    self.ShowEstablishmentClick = function () {
        self.ShowEstablishmentDetails(!self.ShowEstablishmentDetails());
    };

    self.ShowBeverageClick = function () {
        self.ShowBeverageDetails(!self.ShowBeverageDetails());
    };

    self.ShowAccessClick = function () {
        self.ShowAccessDetails(!self.ShowAccessDetails());
    };

    self.AddFavoriteAspect = function (aspect) {var favorite = new FavoriteAspect();
        favorite.Name(aspect.AspectName);
        favorite.AspectFk(aspect.AspectPk);
        return favorite;
    };

    self.AddPreference = function (list, detail) {
        for (var i = 0; i < list.length; i++) {
            var listItem = list[i];
            if (listItem.AspectFk() == detail.AspectFk) {
                listItem.UserPreferencePk(detail.UserPreferencePk);
                listItem.Enabled(true);
                listItem.Excluded(detail.Excluded);
                listItem.Required(detail.Required);
                listItem.Factor(detail.Factor);
            }
        }
    };

    self.musicalSettings = ko.computed(function() {
        var result = [];
        for (var i = 0; i < self.musicalAspects().length; i++) {
            result.push(self.AddFavoriteAspect(self.musicalAspects()[i]));
        }
        for (var i = 0; i < self.userPreferences().length; i++) {
            self.AddPreference(result, self.userPreferences()[i]);
        }
        return result.sort(function (left, right) { return left.Name() == right.Name() ? 0 : (left.Name() < right.Name() ? -1 : 1); });
    });

    self.sexualOrientation = ko.computed(function() {
        var result = [];
        for (var i = 0; i < self.sexualOrientationAspects().length; i++) {
            result.push(self.AddFavoriteAspect(self.sexualOrientationAspects()[i]));
        }
        return result.sort(function (left, right) { return left.Name() == right.Name() ? 0 : (left.Name() < right.Name() ? -1 : 1); });
    });

    self.serviceAndStaff = ko.computed(function () {
        var result = [];
        for (var i = 0; i < self.serviceAndStaffAspects().length; i++) {
            result.push(self.AddFavoriteAspect(self.serviceAndStaffAspects()[i]));
        }
        return result.sort(function (left, right) { return left.Name() == right.Name() ? 0 : (left.Name() < right.Name() ? -1 : 1); });
    });
    
    self.venueType = ko.computed(function () {
        var result = [];
        for (var i = 0; i < self.venueTypeAspects().length; i++) {
            result.push(self.AddFavoriteAspect(self.venueTypeAspects()[i]));
        }
        return result.sort(function (left, right) { return left.Name() == right.Name() ? 0 : (left.Name() < right.Name() ? -1 : 1); });
    });
    
    self.activities = ko.computed(function () {
        var result = [];
        for (var i = 0; i < self.activitiesAspects().length; i++) {
            result.push(self.AddFavoriteAspect(self.activitiesAspects()[i]));
        }
        return result.sort(function (left, right) { return left.Name() == right.Name() ? 0 : (left.Name() < right.Name() ? -1 : 1); });
    });
    
    self.games = ko.computed(function () {
        var result = [];
        for (var i = 0; i < self.gamesAspects().length; i++) {
            result.push(self.AddFavoriteAspect(self.gamesAspects()[i]));
        }
        return result.sort(function (left, right) { return left.Name() == right.Name() ? 0 : (left.Name() < right.Name() ? -1 : 1); });
    });
    
    self.food = ko.computed(function () {
        var result = [];
        for (var i = 0; i < self.foodAspects().length; i++) {
            result.push(self.AddFavoriteAspect(self.foodAspects()[i]));
        }
        return result.sort(function (left, right) { return left.Name() == right.Name() ? 0 : (left.Name() < right.Name() ? -1 : 1); });
    });
    
    self.musicPerformance = ko.computed(function () {
        var result = [];
        for (var i = 0; i < self.musicPerformanceAspects().length; i++) {
            result.push(self.AddFavoriteAspect(self.musicPerformanceAspects()[i]));
        }
        return result.sort(function (left, right) { return left.Name() == right.Name() ? 0 : (left.Name() < right.Name() ? -1 : 1); });
    });
    
    self.atmosphere = ko.computed(function () {
        var result = [];
        for (var i = 0; i < self.atmosphereAspects().length; i++) {
            result.push(self.AddFavoriteAspect(self.atmosphereAspects()[i]));
        }
        return result.sort(function (left, right) { return left.Name() == right.Name() ? 0 : (left.Name() < right.Name() ? -1 : 1); });
    });

    self.EditEstablishmentDetailsClick = function () {
        self.editEstablishmentDetails(!self.editEstablishmentDetails());
    };

    self.EditPersonalDetailsClick = function () {
        self.editPersonalDetails(!self.editPersonalDetails());
    };

    self.SaveEstablishmentDetailsClick = function () {
        self.editEstablishmentDetails(false);
        for (var i = 0; i < self.serviceAndStaff().length; i++) {
            self.SaveUserPreference(self.serviceAndStaff()[i]);
        }
        
        for (var i = 0; i < self.venueType().length; i++) {
            self.SaveUserPreference(self.venueType()[i]);
        }
        
        for (var i = 0; i < self.activities().length; i++) {
            self.SaveUserPreference(self.activities()[i]);
        }
        
        for (var i = 0; i < self.games().length; i++) {
            self.SaveUserPreference(self.games()[i]);
        }
        
        for (var i = 0; i < self.food().length; i++) {
            self.SaveUserPreference(self.food()[i]);
        }
        
        for (var i = 0; i < self.musicPerformance().length; i++) {
            self.SaveUserPreference(self.musicPerformance()[i]);
        }
        
        for (var i = 0; i < self.atmosphere().length; i++) {
            self.SaveUserPreference(self.atmosphere()[i]);
        }
    };

    self.SavePersonalDetailsClick = function () {
        self.editPersonalDetails(false);
        if (self.UserId() != "") {
            $.ajax({
                type: "PUT",
                url: "/api/Profile/" + self.UserId(),
                data: {
                    UserId: self.UserId(),
                    UserPk: self.profilePk(),
                    UserName: self.UserName(),
                    ScreenName: self.screenName(),
                    AgeRange: self.ageRange()
                },
                success: function (data) {
                    if (data) {
                    }
                }
            });
        } else {
            $.post("/api/Profile", {
                ScreenName: self.screenName(),
                AgeRange: self.ageRange()
            })
                .success(function(data) {
                    if (data) {
                        self.profilePk(success.ProfilePk);
                    }
                });
        }
        for (var i = 0; i < self.musicalSettings().length; i++) {
            self.SaveUserPreference(self.musicalSettings()[i]);
        }
    };

    self.SaveUserPreference = function (favoriteAspect) {
        if (favoriteAspect.UserPreferencePk() != "") {
            if (favoriteAspect.Enabled()) {
                $.ajax({
                    type: "PUT",
                    url: "/api/Preferences/" + favoriteAspect.UserPreferencePk(),
                    data: {
                        UserPreferencePk: favoriteAspect.UserPreferencePk(),
                        AspectFk: favoriteAspect.AspectFk(),
                        Required: favoriteAspect.Required().toString(),
                        Factor: favoriteAspect.Factor(),
                        Excluded: favoriteAspect.Excluded().toString()
                    },
                    success: function(data) {
                        if (data) {
                        }
                    }
                });
            } else {
                $.ajax({
                    type: "Delete",
                    url: "/api/Preferences/" + favoriteAspect.UserPreferencePk(),
                    success: function (data) {
                        if (data) {
                            self.userPreferences.remove(data);
                        }
                    }
                });
            }

        } else if (favoriteAspect.Enabled()) {
            var data = {
                AspectFk: favoriteAspect.AspectFk(),
                Required: favoriteAspect.Required(),
                Factor: favoriteAspect.Factor(),
                Excluded: favoriteAspect.Excluded()
            };
            $.ajax({
                type: "POST",
                url: "/api/Preferences",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data) {
                    if (data) {
                        favoriteAspect.UserPreferencePk(data.UserPreferencePk);
                    }
                }
            });
        }
    };
    

    self.LoadMusicPreferences = function () {
        $.getJSON('/api/Profile/', function (data) {
            if (data.length == 1) {
                self.UserId(data[0].UserId);
                self.profilePk(data[0].UserPk);
                self.UserName(data[0].UserName);
                self.ageRange(data[0].AgeRange);
                self.screenName(data[0].ScreenName);
            }
        });
        $.getJSON("/api/Preferences/", function (data) {
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var preference = data[i];
                    self.userPreferences.push(preference);
                }
            }
        });
        $.getJSON("/api/Aspect/", function(data) {
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var aspect = data[i];
                    if (aspect.PreferenceCategoryPk == "8aef2596-203b-4b55-8e6a-c0f9c9363200") {
                        self.musicalAspects.push(aspect);
                    } else if (aspect.PreferenceCategoryPk == "46886817-fc83-4f89-b3b0-d1694064ffcd") {
                        self.sexualOrientationAspects.push(aspect);
                    } else if (aspect.PreferenceCategoryPk == "9db6887c-592d-439c-8abd-23ed8d8b2eca") {
                        self.serviceAndStaffAspects.push(aspect);
                    } else if (aspect.PreferenceCategoryPk == "9b109bb0-99dc-4872-bef9-c67f6c4ea33a") {
                        self.venueTypeAspects.push(aspect);
                    } else if (aspect.PreferenceCategoryPk == "4aaf9665-1eae-4b68-9404-af85e43998b2") {
                        self.activitiesAspects.push(aspect);
                    } else if (aspect.PreferenceCategoryPk == "044b345d-a6ef-48e4-858b-16059105da20") {
                        self.gamesAspects.push(aspect);
                    } else if (aspect.PreferenceCategoryPk == "13b3cb56-7e4c-4232-93f8-979602d10924") {
                        self.atmosphereAspects.push(aspect);
                    } else if (aspect.PreferenceCategoryPk == "5ff1197c-6623-4233-8160-076cf5de6f92") {
                        self.foodAspects.push(aspect);
                    } else if (aspect.PreferenceCategoryPk == "5384b9b6-1bdf-46f2-901a-6863d7edee1c") {
                        self.musicPerformanceAspects.push(aspect);
                    }
                }
            }
            
            ko.applyBindings(manage_users_model);

        });
    };
};