/*

 Author: Arko
 Description:This is a casperjs automation script to check if an R library gets successfully loaded 

 */
casper.test.begin("Check if an R library is loaded successfully", 5, function suite(test) {

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
        this.wait(9000);
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
        functions.validation(casper);

    });

    //Create a new Notebook.
    functions.create_notebook(casper);

    //Add an R cell and execute its contents
    functions.addnewcell(casper);
    casper.viewport(1366, 768).then(function () {
        this.sendKeys('div.ace-chrome:nth-child(1) > textarea:nth-child(1)', "install.packages('abc')");
        this.click({type: 'css', path: 'div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > td:nth-child(3) > span:nth-child(1) > i:nth-child(1)'});//xpath for executing the contents
        this.wait(80000);
        this.echo("executed contents of the R cell");

    });

    //fetch the output text and compare
    casper.then(function () {
        this.test.assertTextExists("The downloaded source packages are in", "Confirmed that the library has got successfully loaded");

    });


    casper.run(function () {
        test.done();
    });
});
