
app.controller('AppCtrl', function($mdDialog, $mdMedia) {
  this.status = '';

  this.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
  this.showAlert = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('This is an alert title')
        .textContent('You can specify some description text in here.')
        .ariaLabel('Alert Dialog Demo')
        .ok('Got it!')
        .targetEvent(ev)
    );
  };
  this.showConfirm = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Would you like to delete your debt?')
          .textContent('All of the banks have agreed to forgive you your debts.')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Please do it!')
          .cancel('Sounds like a scam');
    $mdDialog.show(confirm).then(function() {
      this.status = 'You decided to get rid of your debt.';
    }, function() {
      this.status = 'You decided to keep your debt.';
    });
  };
  this.showAdvanced = function(ev) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && this.customFullscreen;
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'dialog1.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: useFullScreen
    })
    .then(function(answer) {
      this.status = 'You said the information was "' + answer + '".';
    }, function() {
      this.status = 'You cancelled the dialog.';
    });
    this.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      this.customFullscreen = (wantsFullScreen === true);
    });
  };
  this.showTabDialog = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: '../partials/actionDialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    })
        .then(function(answer) {
          this.status = 'You said the information was "' + answer + '".';
        }, function() {
          this.status = 'You cancelled the dialog.';
        });
  };
// });
function DialogController($mdDialog) {
  this.hide = function() {
    $mdDialog.hide();
  };
  this.cancel = function() {
    $mdDialog.cancel();
  };
  this.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}