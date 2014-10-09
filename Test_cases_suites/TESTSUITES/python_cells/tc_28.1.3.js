/*

 Author: Arko
 Description:On trying to execute an invalid Python code, appropriate error message should be thrown.

 */

//Begin Test

casper.test.begin("Invalid Python command", 5, function suite(test) {

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

    //Change the language of prompt cell to Python cell.Select 1 for markdown and 2 for python
    casper.then(function () {
        var z = casper.evaluate(function () {
            document.getElementById('insert-cell-language').selectedIndex = 2;
            return true;
        });
    });

    //create a new python cell and execute some invalid command
    casper.then(function () {
        console.log("Create a new Python cell ");
        functions.addnewcell(casper);
        this.wait(2000);
        this.then(function () {
            this.sendKeys('div.ace-chrome:nth-child(1) > textarea:nth-child(1)', 'print 56');
            this.click({type: 'xpath', path: '/html/body/div[2]/div/div[2]/div/div/div/div/div/table/td/span/i'});//xpath for executing the contents
            this.echo("executed contents of the python cell");
            this.wait(20000);
        });
        this.then(function () {
            this.test.assertTextExists("SyntaxError", "Confirmed that invalid Python command produces appropriate error");
        });
    });

    //functions.delete_notebooksIstarred(casper);

    casper.run(function () {
        test.done();
    });
});
