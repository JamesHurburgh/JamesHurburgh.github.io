define(["jquery", "store"],
    function($, store) {

        var keys = {
            currentProfileName: 'currentProfileName',
            localProfileList: "localProfiles"
        };

        getLocalProfiles = function() {
            if (!store.get(keys.localProfileList)) {
                store.set(keys.localProfileList, []);
            }
            return store.get(keys.localProfileList);
        };

        getLocalProfile = function(profileName) {
            var localProfile = store.get("profile:" + profileName);
            if (!localProfile) {
                localProfile = { "Name": profileName };
                addProfile(localProfile);
            }
            return localProfile;
        };

        updateProfile = function(profile) {
            store.set("profile:" + profile.Name, profile);
        };

        addProfile = function(profile) {
            store.set("profile:" + profile.Name, profile);
            var localProfiles = getLocalProfiles();
            localProfiles.push(profile.Name);
            store.set(keys.localProfileList, localProfiles);
        };

        getCurrentProfile = function() {
            var profileName = store.get(keys.currentProfileName);
            if (!profileName) {
                profileName = "Guest";
            }
            return getLocalProfile(profileName);
        };

        setCurrentProfile = function(profileName) {
            store.set(keys.currentProfileName, profileName);
        };
    }
);