var StaticPageMethods = function($) {

  var HeaderLinksModule = function() {
    // ["welcome", "pricing", "plans", "docs", "account", "company", "home"]

      function removeFixedWidths() {
        $(".footer--content").css({ 'margin' : '0', 'padding-left': '60px' });
      }

    function loggedIn() {
      var $headerLinks = $("[js-header-link]").show();

      // hide company and home when logged in
      ["company", "home"].forEach(function(link) {
        $headerLinks.filter("[js-header-link=" + link + "]").hide();
      });

      // show the account user hash
      $("#headerAccountLinks").show();

      return $headerLinks;
    }

    function loginSignup() {
      return $("[js-header-link]")
        .hide()
        .filter("[js-header-link=docs]")
        .show();
    }

    return {
      setLinkByPage: function(page) {
        if (page === "loginSignup") {
          loginSignup();
        }
        else if (page === "loggedIn") {
          loggedIn();
        }
        removeFixedWidths();
      }
    };
  }();

  // Url patterns to hide user/account link
  return {
    hideMarketingContent: function() {
      $('[js-marketing-content]').hide();
    },
    hideAccountLinks: function() {
      $('[js-account-link]').hide();
    },
    hideManageButton: function() {
      $('[js-manage-button]').hide();
    },
    hideLoginLink: function() {
      $("#headerLoginLink").hide();
    },
    hideLogoutLink: function() {
      $("#headerLogoutLink").hide();
    },
    showLogoutLink: function() {
      $("#headerLogoutLink").show();
    },
    setLinkByPage: function(page) {
      return HeaderLinksModule.setLinkByPage(page);
    },
    showHasUserSession: function() {
      $("[js-no-user-session]").hide();
      $("[js-user-session]").show();

      var isWizardPage = location.pathname === "/create/wizard" || location.pathname === "/create-from-backup/wizard";
      if (isWizardPage) {
        $("#headerAccountLinks").hide();
      }
    },
    showHasNoUserSession: function() {
      $("[js-no-user-session]").show();
      $("[js-user-session]").hide();
    },
    hideSignupLink: function() {
      $("#headerSignupLink").hide();
    },
    showHeaderElements: function() {
      $('[js-header-elem]').show();
    }
  };

}($);
