/* 
 Author: Arko
 Description:    This is a casperjs automated test script for showing that after opening the shared notebook in main.html 
 page by clicking on Edit Notebook icon, if the notebook is opened in Github , it opens under the alien user's 
 repository. The case is same if the notebook is opened in Github from  the view.html page
 */

//Begin Tests

casper.test.begin("Open Notebook In Github without Forking", 10, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var notebook_id = "82198d654e36c7e86761";//contains the notebook id of a different user to be searched

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


    casper.viewport(1366, 768).thenOpen('http://127.0.0.1:8080/view.html?notebook=' + notebook_id, function () {
        this.wait(7000);
        this.echo(this.getCurrentUrl());
        this.wait(4000);
    });

    casper.viewport(1366, 768).then(function () {
        this.test.assertUrlMatch(/view.html/, 'view.html page for given user loaded');
        this.wait(7000);
    });

    //verify that only output div is visible and editable icon exists which proves that the notebook is currently not in Editable form
    casper.viewport(1366, 768).then(function () {
        this.test.assertVisible({type: 'css', path: '#edit-notebook > i:nth-child(1)' }, 'Edit option visible which proves that notebook currently is uneditable');
        this.test.assertVisible({type: 'css', path: 'div:nth-child(3) > div:nth-child(2) > pre:nth-child(2) > code:nth-child(1)'}, 'output div visible');
        this.test.assertNotVisible({type: 'css', path: 'div:nth-child(3) > div:nth-child(2) > pre:nth-child(1) > code:nth-child(1)'}, 'source code not visible');

    });

    //open the notebook in Github 
    functions.open_advanceddiv(casper);
    casper.viewport(1366, 768).then(function () {

        this.waitForSelector({type: 'css', path: '#open-in-github'}, function () {
            console.log("Link for opening notebook in github found. Clicking on it");

            if (this.click({type: 'css', path: '#open-in-github'})) {

                this.wait(8000);
                this.waitForPopup(/gist.github.com/, function () {
                    this.test.assertEquals(this.popups.length, 1);

                });
                this.wait(11000);

                this.withPopup(/gist.github.com/, function () {
                    casper.viewport(1366, 768).then(function () {
                        this.wait(4000);
                        console.log(this.getCurrentUrl());
                        this.test.assertUrlMatch(/gist.github.com*/, 'Notebook opened in github');
                        //verifying that the gist opened belongs to different user
                        var gist_owner = this.fetchText({type: 'css', path: '.author > span:nth-child(1) > a:nth-child(1)'});
                        this.test.assertNotEquals(gist_owner, github_username, 'Confirmed that notebook opened in gist of different user');
                    });

                });

            }//if ends
            else {
                console.log('Notebook could not be opened in github');
            }
        });
    });


    casper.run(function () {
        test.done();
    });
});

