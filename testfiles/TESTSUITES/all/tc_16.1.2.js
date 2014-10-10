/* 
 Author: Arko
 Description:    This is a casperjs automated test script showing that executing an invalid R command following a '?' in any cell
 (R/Markdown/Prompt) will not display the description of the particular code in Help div. It will produce an error


 */

//Begin Tests


casper.test.begin("Invalid R command in Help div", 4, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var help_content = "hello";//invalid R command
    var functions = require(fs.absolute('basicfunctions'));

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


    casper.viewport(1366, 768).then(function () {
        if (this.visible('#help-form')) {
            this.echo('Help div is open');
            this.wait(5000);

        }
        else {
            this.echo('Help div is not open,hence opening it');
            this.wait(5000);
            this.click(x('/html/body/div[3]/div/div/div[2]/div/div/div[3]/div/a/i'));
            this.wait(5000);
        }
        this.sendKeys('#input-text-help', help_content);
        this.wait(6000);
        if (this.click({type: 'xpath', path: '/html/body/div[3]/div/div/div[2]/div/div/div[3]/div[2]/div/div/form/div/div/button/i'})) {
            this.echo('topic for help entered successfully');
        }
        else {
            this.echo('could not enter help content');
        }
        this.wait(8000);
    });

    casper.then(function () {
        console.log('validating that the appropriate documentation is displayed for the incorrect R command entered');
        this.page.switchToChildFrame(0);
        this.wait(6000);
        casper.then(function () {
            this.test.assertTextExists("No help found", "Confirmed that no Help content shown for invalid R command");
        });

    });


    casper.run(function () {
        test.done();
    });
});
