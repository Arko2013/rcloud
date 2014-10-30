/* 
 Author: Arko
 Description:    This is a casperjs automated test script for deleting all but one notebook

 */

//Begin Tests

casper.test.begin(" Delete the notebooks", 4, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));

    casper.start(rcloud_url, function () {
        casper.page.injectJs('jquery-1.10.2.js');
    });
    casper.wait(10000);

    casper.viewport(1024, 768).then(function () {
        functions.login(casper, github_username, github_password, rcloud_url);
    });

    casper.viewport(1024, 768).then(function () {
        this.wait(12000);
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
        functions.validation(casper);

    });

    //count the total number of notebooks and delete all but one notebook
    casper.then(function () {
        var counter = 0;//counts the number of notebooks
        do
        {
            counter = counter + 1;
            this.wait(2000);
        } while (this.visible({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + counter + ') > div:nth-child(1) > span:nth-child(1)'}));
        counter = counter - 1;
        //delete the notebooks
        for (var i = 1; i < counter; i++) {
            this.click({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + i + ') > div:nth-child(1) > span:nth-child(2) > span:nth-child(2) > span:nth-child(2) > span:nth-child(1) > span:nth-child(4) > i:nth-child(1)'});
        }
        this.wait(6000);
    });

    casper.then(function () {
        var newcounter = 0;//counts the number of notebooks
        do
        {
            newcounter = newcounter + 1;
            this.wait(2000);
        } while (this.visible({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + newcounter + ') > div:nth-child(1) > span:nth-child(1)'}));
        newcounter = newcounter - 1;
        this.test.assertEquals(newcounter, 1, "Confirmed that all but 1 notebooks have been deleted");
    });

    casper.run(function () {
        test.done();
    });
});



