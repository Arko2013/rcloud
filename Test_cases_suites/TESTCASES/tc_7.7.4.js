/* 
 Author: Arko
 Description:    When a published notebook is loaded by a user who is not logged-in, there is an option "Edit Notebook" present on the top-left corner
 of the page. On clicking, the message for "Please login first" is displayed
 */

//Begin Tests
casper.test.begin("Edit loaded notebook (published)", 11, function suite(test) {
    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var notebookid;
    var title;

    casper.start(rcloud_url, function () {
        casper.page.injectJs('jquery-1.10.2.js');
    });
    casper.wait(10000);

    casper.viewport(1024, 768).then(function () {
        functions.login(casper, github_username, github_password, rcloud_url);
    });

    casper.viewport(1024, 768).then(function () {
        this.wait(9000);
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
        functions.validation(casper);

    });

    //Create a new Notebook.
    functions.create_notebook(casper);

    //Get notebook title
    casper.then(function () {
        title = functions.notebookname(casper);
        this.echo("New Notebook title : " + title);
        this.wait(3000);
    });

    //getting Notebook ID
    casper.viewport(1024, 768).then(function () {
        var temp1 = this.getCurrentUrl();
        notebookid = temp1.substring(41);
        this.echo("The Notebook Id: " + notebookid);
    });

    //Now clicking on the advanced div
    functions.open_advanceddiv(casper);

    //clicking the checkbox to publish notebook
    casper.viewport(1024, 768).then(function () {
        var z = casper.evaluate(function () {
            $('#publish-notebook').click();

        });
    });

    //verify that notebook has been published successfully
    casper.then(function () {
        this.test.assertNotVisible({type: 'css', path: '#publish-notebook .icon-check-empty'}, "Notebook published successfully");
    });

    //logout of RCloud & Github
    casper.viewport(1366, 768).then(function () {
        console.log('Logging out of RCloud');
        var z = casper.evaluate(function () {
            $('#rcloud-logout').click();

        });
        this.wait(7000);
    });

    casper.viewport(1366, 768).then(function () {
        console.log('Logging out of Github');
        this.test.assertTruthy(this.click({type: 'css', path: '#main-div > p:nth-child(2) > a:nth-child(2)' }), "Logged out of Github");
        this.wait(10000);
    });

    casper.viewport(1366, 768).then(function () {
        this.echo("The url where the user can confirm logging out from Github : " + this.getCurrentUrl());
        this.test.assertTextExists(
            'Are you sure you want to sign out?', "Option to Sign Out of GitHub exists"
        );
    });

    casper.viewport(1366, 768).then(function () {
        this.click("form input[type=submit][value='Sign out']");
        console.log('logged out of Github');
        this.wait(7000);
        this.echo("The url after logging out of Github : " + this.getCurrentUrl());
        this.test.assertTextExists('GitHub', "Confirmed that successfully logged out of Github");

    });

    //load the view.html of the Published notebook
    casper.viewport(1366, 768).then(function () {
        sharedlink = "http://127.0.0.1:8080/view.html?notebook=" + notebookid;
        this.thenOpen(sharedlink, function () {
            this.wait(7000);
            this.echo("Opened the view.html of the published notebook " + title);
        });
    });

    //verify that the published notebook has been loaded
    casper.then(function () {
        publishedtitle = functions.notebookname(casper);
        this.echo("Published Notebook title : " + publishedtitle);
        this.test.assertEquals(publishedtitle, title, "Confirmed that the view.html of published notebook has been loaded");
    });

    //click on Edit icon and confirm that login message is displayed
    casper.then(function () {
        var z = casper.evaluate(function () {
            $('#edit-notebook').click();
        });
        this.echo("Edit option has been clicked");
    });

    casper.viewport(1366, 768).then(function () {
        this.test.assertUrlMatch(/edit.html*/, 'Confirmed that edit.html view opened for the notebook');
        this.test.assertTextExists('Please login first', 'Confirmed that Please login first message is displayed for the user');
    });

    //load the RCloud main page and delete the notebook
    casper.thenOpen(rcloud_url, function () {
        this.wait(2000);
        functions.login(casper, github_username, github_password, rcloud_url);
        this.wait(8000);
    });


    casper.run(function () {
        test.done();
    });
});
