/*

 Author: Kunal
 Description:This is a casperjs automation script for writing code in a R cell, executing the results and then deleting the cell.

 */
casper.test.begin("Run the code and delete the R cell", 6, function suite(test) {

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

    //add a new R cell and execute its contents
    functions.addnewcell(casper);
    functions.addcontentstocell(casper);

    //delete the R cell
    casper.viewport(1366, 768).then(function () {
        this.test.assertTruthy(this.click({type: 'css', path: '.icon-trash'}), "Confirmed that cell has been deleted successfully");
        this.test.assertDoesntExist({type: 'css', path: '.r-result-div'}, "Confirmed that R cell no longer exists");
    });

    casper.run(function () {
        test.done();
    });
});
