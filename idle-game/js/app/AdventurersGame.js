/*jshint esversion: 6 */

define(["jquery",
        "app/CommonFunctions",
        "alertify",
        "json!data/game.json",
        "json!data/settings.json",
        "app/PlayerManager",
        "app/PartyManager",
        "app/ItemManager",
        "app/LocationManager",
        "app/AdventurerManager",
        "app/AchievementManager",
        "app/QuestManager",
        "app/MessageManager",
        "app/SessionManager",
        "app/DataManager",
        "app/TimeManager",
        "app/StatisticsManager",
        "app/OptionsManager",
        "app/NoticeManager",
        "app/EffectsManager",
        "app/GameStateManager",
        "app/SpriteManager",
        "json!data/calendar.json",
        "json!data/contracts.json",
        "json!data/locations.json",
        "json!data/adventurers.json",
        "json!data/achievements.json"
    ],
    function AdventurersGame(
        jquery,
        CommonFunctions,
        alertify,
        game,
        settings,
        PlayerManager,
        PartyManager,
        ItemManager,
        LocationManager,
        AdventurerManager,
        AchievementManager,
        QuestManager,
        MessageManager,
        SessionManager,
        DataManager,
        TimeManager,
        StatisticsManager,
        OptionsManager,
        NoticeManager,
        EffectsManager,
        GameStateManager,
        SpriteManager,
        calendar,
        contracts,
        locations,
        adventurers,
        achievements) {

        commonFunctions = new CommonFunctions();
        data = new DataManager();

        return function AdventurersGame(saveData, saveFunction, logFunction) {

            log = logFunction;
            if (saveData === undefined || saveData === null) saveData = {};
            this.gameState = saveData;
            gameState = saveData;

            this._GameStateManager = new GameStateManager(this, this.gameState, saveFunction);
            this.GameStateManager = function() {
                if (this._GameStateManager) return this._GameStateManager;
                return this.$data._GameStateManager;
            };

            this._itemManager = new ItemManager(this, this.gameState);
            this.ItemManager = function() {
                if (this._itemManager) return this._itemManager;
                return this.$data._itemManager;
            };

            this._locationManager = new LocationManager(this, this.gameState);
            this.LocationManager = function() {
                if (this._locationManager) return this._locationManager;
                return this.$data._locationManager;
            };

            this._AdventurerManager = new AdventurerManager(this, this.gameState);
            this.AdventurerManager = function() {
                if (this._AdventurerManager) return this._AdventurerManager;
                return this.$data._AdventurerManager;
            };

            this._QuestManager = new QuestManager(this, this.gameState);
            this.QuestManager = function() {
                if (this._QuestManager) return this._QuestManager;
                return this.$data._QuestManager;
            };

            this._MessageManager = new MessageManager(this, this.gameState);
            this.MessageManager = function() {
                if (this._MessageManager) return this._MessageManager;
                return this.$data._MessageManager;
            };

            this._AchievementManager = new AchievementManager(this, this.gameState);
            this.AchievementManager = function() {
                if (this._AchievementManager) return this._AchievementManager;
                return this.$data._AchievementManager;
            };

            this._DataManager = new DataManager(this);
            this.DataManager = function() {
                if (this._DataManager) return this._DataManager;
                return this.$data._DataManager;
            };

            Time = new TimeManager(this);
            this._TimeManager = Time;
            this.TimeManager = function() {
                if (this._TimeManager) return this._TimeManager;
                return this.$data._TimeManager;
            };

            this._SessionManager = new SessionManager(this);
            this.SessionManager = function() {
                if (this._SessionManager) return this._SessionManager;
                return this.$data._SessionManager;
            };

            this._StatisticsManager = new StatisticsManager(this, this.gameState);
            this.StatisticsManager = function() {
                if (this._StatisticsManager) return this._StatisticsManager;
                return this.$data._StatisticsManager;
            };

            this._OptionsManager = new OptionsManager(this);
            this.OptionsManager = function() {
                if (this._OptionsManager) return this._OptionsManager;
                return this.$data._OptionsManager;
            };

            this._PlayerManager = new PlayerManager(this, this.gameState);
            this.PlayerManager = function() {
                if (this._PlayerManager) return this._PlayerManager;
                return this.$data._PlayerManager;
            };

            this._NoticeManager = new NoticeManager(this, this.gameState);
            this.NoticeManager = function() {
                if (this._NoticeManager) return this._NoticeManager;
                return this.$data._NoticeManager;
            };

            this._EffectsManager = new EffectsManager(this, this.gameState);
            this.EffectsManager = function() {
                if (this._EffectsManager) return this._EffectsManager;
                return this.$data._EffectsManager;
            };

            this._SpriteManager = new SpriteManager(this);
            this.SpriteManager = function() {
                if (this._SpriteManager) return this._SpriteManager;
                return this.$data._SpriteManager;
            };

            _PartyManager = new PartyManager(this);
            this.PartyManager = function() {
                return _PartyManager;
            };

            this.minorTick = function() {

                this.QuestManager().checkForCompletedQuests();

                this.NoticeManager().removeExpired();

                this.gameState.majorTickCounter++;
                if (this.gameState.majorTickCounter > 10) {
                    this.majorTick();
                    this.doAutomation();
                }
            };

            this.majorTick = function() {
                log("majorTick");
                // Do all calculations here
                this.gameState.majorTickCounter = 0;

                this.EffectsManager().removeExpired();
                this.NoticeManager().addNewContracts();
                this.AdventurerManager().addNewAdverturersForHire();
                this.AdventurerManager().updateQuotes();
                this.AdventurerManager().recoverAdventurers();

                this.AchievementManager().checkAndClaimAllAchievements();

                this.gameState.gameDateTime = this.TimeManager().getGameTime();

                // Autosave
                this.SessionManager().stillLoggedIn();
                this.GameStateManager().save();
            };

            this.doAutomation = function() {
                if (this.OptionsManager().getOptions().automaticRelocate) {
                    if (this.LocationManager().canRelocateUp()) {
                        this.LocationManager().relocateUp();
                    }
                }
                if (this.OptionsManager().getOptions().automaticClaim) {}
                if (this.OptionsManager().getOptions().automaticHire) {}
                if (this.OptionsManager().getOptions().automaticSend) {}
            };

            this.initialise = function() {
                log("initialising");

                if (this.gameState === undefined || this.gameState === null) {
                    this.gameState = {};
                    this.GameStateManager().reset();
                    this.majorTick();
                }

                this.GameStateManager().versionCheck();
                this.NoticeManager().prepContractQueue();
                this.SessionManager().login();
                this.majorTick();
            };

            this.initialise();
        };
    });