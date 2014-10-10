/* 
 Author: Arko
 Description:    This is a casperjs automated test script to show the source code for R cell in editable format


 */

//Begin Tests

casper.test.begin("Source code in editable format for R cell", 5, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var cellcontent = "hello";
    var initialcontent; //store the initial content of the cell
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

    //Added an R cell and execute its contents
    functions.addnewcell(casper);
    functions.addcontentstocell(casper);

    //make the cell editable
    casper.then(function () {
        initialcontent = this.fetchText({type: 'css', path: 'div.ace-chrome:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1)'});
        var z = casper.evaluate(function () {
            $('.icon-edit').click();
        });
        this.wait(4000);
        this.sendKeys('div.ace-chrome:nth-child(1) > textarea:nth-child(1)', cellcontent);
    });

    casper.viewport(1366, 768).then(function () {
        this.wait(10000);
        //checking whether contents are written on Rcell or not
        var temp = this.fetchText({type: 'css', path: 'div.ace-chrome:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1)'});
        this.test.assertNotEquals(temp, initialcontent, "Confirmed that content in the R cell has been modified");
    });


    casper.run(function () {
        test.done();
    });
});
