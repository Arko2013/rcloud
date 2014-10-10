/* 
 Author: Ganesh Moorthy
 Description:    This is a casperjs automated test script for showing that on clicking the Shareable Link present on top left
 corner of the Main page,the view.html page for the currently loaded notebook should open


 */

//Begin Tests

casper.test.begin("Loading view.html using Shareable Link", 4, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var notebookid;//to get the notebook id

    casper.start(rcloud_url, function () {
        casper.page.injectJs('jquery-1.10.2.js');
    });

    casper.wait(10000);

    //login to Github and RCloud
    casper.viewport(1024, 768).then(function () {
        functions.login(casper, github_username, github_password, rcloud_url);
    });

    casper.viewport(1024, 768).then(function () {
        this.wait(9000);
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
        functions.validation(casper);
        this.wait(4000);

    });

    //getting Notebook ID
    casper.viewport(1024, 768).then(function () {
        var temp1 = this.getCurrentUrl();
        notebookid = temp1.substring(41);
        this.echo("The Notebook Id: " + notebookid);
    });

    //currently the following function could not be made Headless. Hence implementing a workaround for opening the view.html for a notebook. Will update
    //the code as and when the issue is resolved
    /*
     casper.viewport(1366,768).then(function() {
     this.wait(3000);
     this.waitForSelector({type: 'css', path: 'html body div.navbar div div.nav-collapse ul.nav li span a#share-link.btn'}, function() {
     console.log("Shareable link found. Clicking on it");


     if (this.click({type: 'css', path: 'html body div.navbar div div.nav-collapse ul.nav li span a#share-link.btn'}))
     {


     this.wait(3000);
     this.viewport(1366,768).waitForPopup(/view\.html/, function() {
     this.test.assertEquals(this.popups.length, 1);

     });
     this.wait(20000);

     casper.viewport(1366,768).then(function() {
     this.withPopup(/view\.html/, function() {
     console.log(this.getCurrentUrl());*/
    //test.assertUrlMatch(/view.html*/, 'Got the shareable view');


    //verifying that the view.html page has git loaded properly by checking if the Edit icon is visible
    /*
     casper.viewport(1366,768).then(function() {
     this.wait(7000);
     this.echo("The view.html link : " + this.getCurrentUrl());
     this.test.assertExists(
     {type: 'xpath', path: '/html/body/div[2]/div/div[2]/ul/li/button/i' },
     'the element Edit icon exists'
     );
     this.wait(2000);
     });
     });

     }
     else
     {
     console.log("Shareable link could not be clicked");
     }
     });
     });*/

    casper.viewport(1366, 768).then(function () {
        this.wait(5000);
        this.waitForSelector({type: 'css', path: 'html body div.navbar div div.nav-collapse ul.nav li span a#share-link.btn'}, function () {
            console.log("Shareable link found. Clicking on it");
            casper.viewport(1366, 768).thenOpen('http://127.0.0.1:8080/view.html?notebook=' + notebookid, function () {
                this.wait(7000);
                this.echo("The view.html link for the notebook is : " + this.getCurrentUrl());
                this.test.assertExists({type: 'css', path: '#edit-notebook > i:nth-child(1)' },
                    'the element Edit icon exists. Hence page has got loaded properly'
                );
            });
        });
    });

    casper.run(function () {
        test.done();
    });
});

